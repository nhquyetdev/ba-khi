// GodK Bá Khí — networking: Firebase Realtime DB, or local BroadcastChannel fallback
'use strict';
const Net = (() => {
  let mode = 'local', db = null, room = null, myId = null;
  const ROOT = 'godk1';
  const cbs = { players: ()=>{}, duel: ()=>{}, lb: ()=>{} };
  let players = {}; // id -> data
  let refs = [];
  let bc = null, localTimer = null;

  function loadScript(src){ return new Promise((res, rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }

  async function init(id){
    myId = id;
    const cfg = window.FIREBASE_CONFIG;
    if (cfg && cfg.apiKey && cfg.databaseURL) {
      try {
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js');
        firebase.initializeApp(cfg); db = firebase.database(); mode = 'firebase';
        // global leaderboard listener
        db.ref(`${ROOT}/lb`).orderByChild('s').limitToLast(50).on('value', snap => {
          const arr = []; snap.forEach(c => { arr.push(Object.assign({ id: c.key }, c.val())); }); cbs.lb(arr);
        });
        return mode;
      } catch (e) { console.warn('Firebase failed, local mode', e); }
    }
    mode = 'local';
    bc = new BroadcastChannel('godk_ba_khi');
    bc.onmessage = ev => onLocal(ev.data);
    localTimer = setInterval(() => { cbs.lb(localLB()); pruneLocal(); }, 2000);
    setTimeout(()=>cbs.lb(localLB()), 100);
    return mode;
  }

  // ---------- local mode ----------
  const localRooms = {}; // code -> {ts, n, host}
  function onLocal(m){
    if (!m || m.from === myId) return;
    if (m.type === 'p') {
      localRooms[m.room] = { ts: Date.now(), host: m.d.host ? m.d.n : (localRooms[m.room]||{}).host, n: 0 };
      if (room && m.room === room) { players[m.from] = Object.assign(m.d, { _ts: Date.now() }); cbs.players(players); }
    } else if (m.type === 'leave' && room === m.room) { delete players[m.from]; cbs.players(players); }
    else if (m.type === 'duel' && room === m.room) { localDuels[m.id] = Object.assign(localDuels[m.id]||{}, m.d); cbs.duel(m.id, Object.assign({}, localDuels[m.id])); }
  }
  function pruneLocal(){ const now=Date.now(); let ch=false; for (const k in players) if (now - players[k]._ts > 6000) { delete players[k]; ch=true; } if (ch) cbs.players(players);
    for (const k in localRooms) if (now - localRooms[k].ts > 6000) delete localRooms[k]; }
  function localLB(){ try { const o = JSON.parse(localStorage.getItem('godk_local_lb')||'{}'); return Object.keys(o).map(k=>Object.assign({id:k},o[k])); } catch(e){ return []; } }

  // ---------- API ----------
  async function listRooms(){
    if (mode === 'firebase') {
      const snap = await db.ref(`${ROOT}/rooms`).limitToLast(30).once('value');
      const out = []; const now = Date.now();
      snap.forEach(c => { const v = c.val()||{}; const p = v.p ? Object.values(v.p) : []; const alive = p.filter(x => now - (x.ts||0) < 60000);
        if (alive.length) out.push({ code: c.key, n: alive.length, host: (v.meta&&v.meta.hn)||'?' }); });
      return out;
    }
    return Object.keys(localRooms).map(k => ({ code: k, n: '?', host: localRooms[k].host || '?' }));
  }

  async function join(code, me, isHost){
    room = code; players = {};
    if (mode === 'firebase') {
      if (!isHost) {
        const snap = await db.ref(`${ROOT}/rooms/${code}/p`).once('value');
        if (!snap.exists() || snap.numChildren() >= 10) { room = null; return false; }
      } else {
        await db.ref(`${ROOT}/rooms/${code}/meta`).set({ host: myId, hn: me.n, created: firebase.database.ServerValue.TIMESTAMP });
      }
      const pref = db.ref(`${ROOT}/rooms/${code}/p/${myId}`);
      pref.onDisconnect().remove();
      await pref.set(Object.assign({}, me, { ts: firebase.database.ServerValue.TIMESTAMP }));
      const pr = db.ref(`${ROOT}/rooms/${code}/p`);
      pr.on('child_added', s => { if (s.key !== myId) { players[s.key] = s.val(); cbs.players(players); } });
      pr.on('child_changed', s => { if (s.key !== myId) { players[s.key] = s.val(); cbs.players(players); } });
      pr.on('child_removed', s => { delete players[s.key]; cbs.players(players); });
      const dr = db.ref(`${ROOT}/rooms/${code}/duels`);
      dr.on('child_added', s => cbs.duel(s.key, s.val()));
      dr.on('child_changed', s => cbs.duel(s.key, s.val()));
      refs = [pr, dr];
      return true;
    }
    return true;
  }

  let lastSend = 0;
  function sendMe(me, force){
    if (!room) return; const now = Date.now(); if (!force && now - lastSend < 110) return; lastSend = now;
    if (mode === 'firebase') db.ref(`${ROOT}/rooms/${room}/p/${myId}`).update(Object.assign({}, me, { ts: firebase.database.ServerValue.TIMESTAMP }));
    else bc.postMessage({ type: 'p', room, from: myId, d: me });
  }

  const localDuels = {};
  function duelWrite(id, d){
    if (!room) return;
    if (mode === 'firebase') db.ref(`${ROOT}/rooms/${room}/duels/${id}`).update(d);
    else { localDuels[id] = Object.assign(localDuels[id]||{}, d); const full = Object.assign({}, localDuels[id]);
      bc.postMessage({ type: 'duel', room, from: myId, id, d: full }); setTimeout(()=>cbs.duel(id, full), 0); }
  }
  function duelRemove(id){ if (mode === 'firebase' && room) db.ref(`${ROOT}/rooms/${room}/duels/${id}`).remove(); }

  function pushLB(entry){
    if (mode === 'firebase') db.ref(`${ROOT}/lb/${myId}`).set(Object.assign({}, entry, { ts: firebase.database.ServerValue.TIMESTAMP }));
    else { try { const o = JSON.parse(localStorage.getItem('godk_local_lb')||'{}'); o[myId] = Object.assign({}, entry, { ts: Date.now() }); localStorage.setItem('godk_local_lb', JSON.stringify(o)); } catch(e){} }
  }

  function leave(){
    if (!room) return;
    if (mode === 'firebase') { refs.forEach(r => r.off()); db.ref(`${ROOT}/rooms/${room}/p/${myId}`).remove(); }
    else bc.postMessage({ type: 'leave', room, from: myId });
    room = null; players = {}; cbs.players(players);
  }

  return {
    init, listRooms, join, sendMe, duelWrite, duelRemove, pushLB, leave,
    on(ev, f){ cbs[ev] = f; },
    get mode(){ return mode; }, get room(){ return room; }, get players(){ return players; },
  };
})();
