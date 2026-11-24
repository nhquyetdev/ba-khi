// GodK Bá Khí v1.0 — main game
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const cv = $('cv'), ctx = cv.getContext('2d');
  const mm = $('minimap'), mctx = mm.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  function resize(){ DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W*DPR; cv.height = H*DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  addEventListener('resize', resize); resize();

  // ---------------- Save ----------------
  const uid = () => 'p' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const DEF = () => ({ v: 1, id: uid(), name: '', lang: (navigator.language||'').startsWith('vi') ? 'vi' : 'en', L: 1, xp: 0, t: 1, R: 0, E: 0, best: 1, stelae: [], wells: [], pvpW: 0, muted: false, vol: { m: 0.5, s: 0.8, a: 0.5 }, roamCD: {}, stats: {}, as: 'realm', sk: 'classic', nk: 'none', unlocks: [], pvpCD: 0, playSec: 0, marks: 0, riftCD: {}, riftSeen: [], buffUntil: 0, buffEv: -1, tv: 2, shards: 0, mirrorCD: 0, bestiary: {}, sanct: {}, sanctCD: {}, sanctMode: 'normal', gear: { slots: { weapon: null, armor: null, charm: null }, inv: [] }, passives: [], nm: {}, xeno: { lv: 0, xp: 0 }, xs: 0, xcd: {}, xenoOpen: 0, eLog: [], trans: 0, transRate: 0, Ef: 0, catchupFx: false }); // v1.11: gear/passives reserved (features off)
  let S;
  function migrate(o){ // v1.5 inserted 50 titles: convert old title numbers (saves without tv:2)
    if (o && !o.tv) { if (typeof o.t === 'number') o.t = OT(o.t); if (typeof o.best === 'number') o.best = OT(o.best); o.tv = 2; } return o; }
  function load(){ try { const o = migrate(JSON.parse(localStorage.getItem(SAVE_KEY))); S = Object.assign(DEF(), o || {}); } catch(e) { S = DEF(); } }
  function save(){ try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch(e){} }
  load();
  // v1.8 bestiary backfill: bosses of every gate you already passed count as encountered
  (() => { S.bestiary = S.bestiary || {}; if (S.bfill) return; for (let g = 1; g < Math.min(S.best, MAX_TITLE + 60); g++) { const id = bossFor(g).id; S.bestiary[id] = S.bestiary[id] || { k: 0, w: g >= MAX_TITLE ? 'tower' : 'gate' }; } S.bfill = 1; })();
  save();
  const T = k => (I18N[S.lang] || I18N.en)[k] || k;
  const tn = t => titleName(t, S.lang);

  // ---------------- Audio (v1.2: js/audio.js) ----------------
  function ac(){ const a = AudioM.ensure(); AudioM.setMuted(S.muted); AudioM.setVol(S.vol); return a; }
  const tone = (...a) => AudioM.tone(...a);
  const snd = (name, synth) => () => { if (!AudioM.sfx(name)) synth(); };
  const sfx = {
    lvl: snd('levelup', () => { tone(660, 0.15, 'triangle', 0.08); setTimeout(()=>tone(990, 0.2, 'triangle', 0.08), 70); }),
    title: snd('title', () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(()=>tone(f, 0.6, 'triangle', 0.07), i*90)); tone(65, 1.2, 'sine', 0.3, 0.5); }),
    hit: snd('hit', () => tone(180, 0.12, 'square', 0.05, 0.4)), hurt: snd('hurt', () => tone(90, 0.2, 'sawtooth', 0.08, 0.5)),
    beat(){ tone(55, 0.25, 'sine', 0.3, 0.6); setTimeout(()=>tone(50, 0.25, 'sine', 0.22, 0.6), 180); },
    win: snd('win', () => [392, 523, 659, 784].forEach((f, i) => setTimeout(()=>tone(f, 0.5, 'triangle', 0.08), i*120))),
    lose: snd('lose', () => [300, 240, 180, 120].forEach((f, i) => setTimeout(()=>tone(f, 0.5, 'sawtooth', 0.05), i*160))),
    transform: snd('transform', () => { tone(80, 1.2, 'sawtooth', 0.12, 3); setTimeout(()=>tone(160, 0.9, 'square', 0.06, 2), 200); }),
    find: snd('find', () => [880, 1320].forEach((f, i) => setTimeout(()=>tone(f, 0.4, 'sine', 0.08), i*120))),
    event: snd('event', () => [660, 880, 1100, 1320, 1760].forEach((f, i) => setTimeout(()=>tone(f, 0.5, 'sine', 0.07), i*80))),
    rebirth: snd('rebirth', () => { [262, 330, 392, 523, 659, 784].forEach((f, i) => setTimeout(()=>tone(f, 0.9, 'triangle', 0.06), i*110)); tone(40, 2, 'sine', 0.3, 0.5); }),
  };
  addEventListener('keydown', () => ac(), { once: true }); addEventListener('pointerdown', () => ac(), { once: true });

  // ---------------- World ----------------
  const DECOR = R.genDecor();
  const GATE = { x: 0, y: -260 };
  const WELLS = [ [2100, 1700], [-2600, 900], [900, -2900], [-1500, -2400], [3300, -600] ];
  const STELAE = (() => { let s = 99; const r = () => (s = (s*16807) % 2147483647) / 2147483647; const out = [];
    for (let i = 0; i < STELAE_LORE.length; i++) { const a = r()*Math.PI*2, d = 900 + r()*2900; out.push([Math.round(Math.cos(a)*d), Math.round(Math.sin(a)*d)]); } return out; })();

  const me = { x: (Math.random() - 0.5)*500, y: 220 + Math.random()*200, face: 1, moving: false, phase: 0, fx: {}, seed: Math.random()*10, shake: 0 };
  const cam = { x: 0, y: 0, z: 1 };
  const others = {}; // id -> {x,y,tx,ty,t,n,l,r,mv,f,fx,phase,seed}
  let scene = 'lobby', time = 0, isHost = false;
  const keys = {};
  const toasts = [];
  let floaters = [];

  // ---------------- Input ----------------
  addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; keys[e.key.toLowerCase()] = true; if (e.key.toLowerCase() === 'e') interact(); });
  addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  const joy = { on: false, id: null, sx: 0, sy: 0, dx: 0, dy: 0 };
  cv.addEventListener('pointerdown', e => {
    ac();
    if (scene !== 'world') return;
    const hit = pickPlayer(e.clientX, e.clientY); if (hit) { inspect(hit); return; }
    if (e.pointerType === 'touch' || e.pointerType === 'pen') { joy.on = true; joy.id = e.pointerId; joy.sx = e.clientX; joy.sy = e.clientY; joy.dx = joy.dy = 0; showJoy(); }
  });
  cv.addEventListener('pointermove', e => { if (joy.on && e.pointerId === joy.id) { joy.dx = e.clientX - joy.sx; joy.dy = e.clientY - joy.sy; const m = Math.hypot(joy.dx, joy.dy); if (m > 60) { joy.dx *= 60/m; joy.dy *= 60/m; } showJoy(); } });
  const endJoy = e => { if (e.pointerId === joy.id) { joy.on = false; joy.dx = joy.dy = 0; showJoy(); } };
  cv.addEventListener('pointerup', endJoy); cv.addEventListener('pointercancel', endJoy);
  function showJoy(){ const j = $('joy'); j.style.display = joy.on ? 'block' : 'none'; j.style.left = joy.sx + 'px'; j.style.top = joy.sy + 'px'; $('joyKnob').style.transform = `translate(${joy.dx}px,${joy.dy}px)`; }

  // ---------------- Helpers ----------------
  const mmss = ms => { const t = Math.max(0, Math.ceil(ms/1000)); return Math.floor(t/60) + ':' + String(t%60).padStart(2, '0'); };
  const fmt = n => n >= 1e9 ? (n/1e9).toFixed(2) + 'B' : n >= 1e6 ? (n/1e6).toFixed(2) + 'M' : n >= 1e4 ? (n/1e3).toFixed(1) + 'K' : Math.floor(n).toLocaleString();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  function toast(msg, ms=2600){ const d = document.createElement('div'); d.className = 'toast'; d.innerHTML = msg; $('toasts').appendChild(d); setTimeout(()=>d.classList.add('out'), ms); setTimeout(()=>d.remove(), ms + 600); }
  function titleCss(t){ const A = R.auraStyle(t); return A.rainbow ? 'rainbow' : ''; }
  function titleColor(t){ const A = R.auraStyle(t); if (A.void) return `hsl(${A.oh},100%,72%)`; return `hsl(${A.h},${Math.max(40, A.s)}%,${Math.min(80, Math.max(60, A.l))}%)`; }
  const myStats = () => { const s = F.stats(S.L, S.t, S.E, S.marks, S.shards, sanctBonus(S)), g = gearMult(S), x = xenoMult(S); // v2.1: Xeno levels; gear hook (off)
    return { hp: s.hp*g.hp*x, atk: s.atk*g.atk*x, def: s.def*g.def*x, crit: Math.min(0.95, s.crit + g.crit + xenoCrit(S)) }; };
  const buffOn = () => Date.now() < (S.buffUntil || 0);
  const capped = () => S.L >= F.levelCap(S.t);
  const inWell = () => WELLS.some(([x, y]) => Math.hypot(me.x - x, me.y - y) < 70);

  // ---------------- Lobby ----------------
  function lobbyTexts(){
    document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
    document.querySelectorAll('[data-ph]').forEach(el => { el.placeholder = T(el.dataset.ph); });
    $('langBtn').textContent = S.lang === 'vi' ? 'VI 🇻🇳' : 'EN 🇬🇧';
    $('modeNote').textContent = Net.mode === 'firebase' ? '🌐 ' + T('onlineNote') : '💻 ' + T('soloNote');
  }
  $('langBtn').onclick = () => { S.lang = S.lang === 'vi' ? 'en' : 'vi'; save(); lobbyTexts(); refreshHUD(true); };
  $('nameIn').value = S.name || '';
  async function refreshRooms(){
    const list = await Net.listRooms().catch(()=>[]); const el = $('roomList');
    el.innerHTML = list.length ? list.map(r => `<button class="roomItem" data-code="${esc(r.code)}">#${esc(r.code)} · ${esc(r.host)} <span>${r.n}👤</span></button>`).join('') : `<div class="muted">${T('noRooms')}</div>`;
    el.querySelectorAll('.roomItem').forEach(b => b.onclick = () => enterRoom(b.dataset.code, false));
  }
  $('refreshRooms').onclick = refreshRooms;
  $('createBtn').onclick = () => enterRoom(Array.from({length: 5}, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join(''), true);
  $('joinBtn').onclick = () => { const c = $('codeIn').value.trim().toUpperCase(); if (c) enterRoom(c, false); };

  async function enterRoom(code, host){
    const n = $('nameIn').value.trim().slice(0, 16); if (!n) { $('nameIn').focus(); $('nameIn').classList.add('shake'); setTimeout(()=>$('nameIn').classList.remove('shake'), 500); return; }
    S.name = n; save(); isHost = host; ac();
    const ok = await Net.join(code, meNet(), host);
    if (!ok) { toast(T('joinFail')); return; }
    scene = 'world'; $('lobby').style.display = 'none'; $('hud').style.display = 'block'; $('langBtn').style.display = 'none';
    $('roomCode').textContent = '#' + code; refreshHUD(true); pushLB();
    toast(`<b>${esc(T('room'))} #${esc(code)}</b><br><small>${esc(T('controls'))}</small>`, 5000);
  }
  $('leaveBtn').onclick = () => { Net.leave(); for (const k in others) delete others[k]; scene = 'lobby'; $('hud').style.display = 'none'; $('lobby').style.display = 'flex'; $('langBtn').style.display = ''; closeModal(); refreshRooms(); };

  // ---------------- Net glue ----------------
  const meNet = () => ({ n: S.name, x: Math.round(me.x), y: Math.round(me.y), t: S.t, l: S.L, r: S.R, mv: me.moving ? 1 : 0, f: me.face, host: isHost ? 1 : 0, pw: S.pvpW, sk: S.sk, as: S.as, nk: S.nk, xl: (S.xeno || {}).lv || 0 });
  Net.on('players', ps => {
    for (const id in ps) { const p = ps[id]; const o = others[id] || (others[id] = { x: p.x, y: p.y, fx: {}, phase: 0, seed: Math.random()*10 });
      Object.assign(o, { tx: p.x, ty: p.y, t: p.t || 1, n: p.n || '?', l: p.l || 1, r: p.r || 0, mv: p.mv, f: p.f || 1, host: p.host, pw: p.pw || 0, sk: p.sk || 'classic', as: p.as || 'realm', nk: p.nk || 'none', xl: p.xl || 0 }); }
    for (const id in others) if (!ps[id]) delete others[id];
    renderRoomList();
  });
  let lbData = [];
  Net.on('lb', arr => { lbData = arr; if (lbTab === 'world') renderLB(); });
  function pushLB(){ Net.pushLB({ n: S.name || '?', t: S.t, l: S.L, r: S.R, s: S.t*1e6 + S.L, nk: S.nk || 'none' }); }

  // ---------------- HUD ----------------
  let lastHUD = '';
  function refreshHUD(force){
    if (scene === 'lobby' && !force) return;
    const key = [S.t, S.L, S.lang, S.R, capped()].join('|');
    if (key !== lastHUD || force) {
      lastHUD = key;
      const tEl = $('hTitle'); tEl.textContent = tn(S.t); tEl.style.color = titleColor(S.t); tEl.className = titleCss(S.t);
      $('hTier').textContent = tierName(S.t, S.lang);
      $('hName').textContent = S.name;
      $('hLv').textContent = `${T('level')} ${S.L}` + (S.R ? `  ·  ✦${S.R}` : '');
      $('btnRebirth').style.display = !S.trans && (S.best >= F.REBIRTH_MIN_TITLE || S.R > 0) ? '' : 'none';
      $('btnTalent').style.display = talentVisible() ? '' : 'none';
      document.querySelectorAll('#hud [data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
      renderRoomList(); if (lbTab === 'world') renderLB();
    }
    const need = F.xpNeed(S.L); const pct = capped() ? 100 : Math.min(100, S.xp/need*100);
    $('xpFill').style.width = pct + '%'; $('xpFill').classList.toggle('capped', capped());
    const rate = F.xpRate(S, me.moving, inWell(), buffOn());
    $('hRate').textContent = capped() ? '' : `${fmt(rate)} ${T('auraPerSec')} · ${inWell() ? T('well') : me.moving ? T('moving') : T('standing')}`;
    const bl = (S.buffUntil || 0) - Date.now(); $('hBuff').style.display = bl > 0 ? 'block' : 'none'; if (bl > 0) $('hBuff').textContent = `⚡ ${T('buff')} · ${mmss(bl)}`;
    const ev = eventAt(Date.now()); const evOpen = ev.active && S.buffEv !== ev.idx;
    $('hEvent').innerHTML = evOpen ? `✨ ${esc(T('eventLeft').replace('{n}', ev.type[S.lang]).replace('{t}', mmss(ev.endsAt - Date.now())))}` : `<span class="muted">⏳ ${esc(T('eventNext').replace('{t}', mmss(ev.nextAt - Date.now())))}</span>`;
    $('capMsg').style.display = capped() ? 'block' : 'none';
    if (S.t >= MAX_TITLE) { const fl = towerFloor(S.t), bp = towerBossPas(fl, towerBoss(fl)); $('capMsg').textContent = (fl >= TOWER_NEW_FROM && fl <= HELL_TO ? '🔥 ' : '🗼 ') + T('towerNext').replace('{n}', fl).replace('{a}', towerAffixes(fl, Date.now()).map(a => a.ico + ' ' + a[S.lang]).join(' · ')) + (bp ? ' · 😈 ' + bp.pas.map(id => PASSIVES[id].ico).join('') + ' ' + ROMAN(bp.rank) : ''); }
    else $('capMsg').textContent = T('capReached');
    const tg = scene === 'world' ? nearTarget() : null;
    $('gateBtn').style.display = tg ? 'block' : 'none';
    if (tg) { const lbl = tg.kind === 'boss' ? '獄 ' + T('gateHint') : tg.kind === 'xeno' ? `🛸 ${T('xenoChallenge')} · ${XENO_BOSSES[tg.i][S.lang]}` : tg.kind === 'sanct' ? (sanctNM() ? `👁 ${T('sanctEnter')} · ${nmBoss(tg.sym)[S.lang]} · ${ROMAN(nmTier(S, tg.sym.id) + 1)}` : `⛩ ${T('sanctEnter')} · ${(sanctCursed() ? symbolBoss(tg.sym, 1) : tg.sym)[S.lang]}`) : tg.kind === 'mirror' ? `🪞 ${T('enterMirror')} · ${T('mirrorChance').replace('{p}', Math.round(mirrorChance(S)*100))}` : tg.kind === 'roam' ? `☠ ${T('challengeRoam')} · ${S.lang === 'vi' ? tg.r.B.vi : tg.r.B.en}` : `⛩ ${T('enterRift')} · ${RIFT_RANKS[RIFTS[tg.i][2]][S.lang]}`; if ($('gateBtn').textContent !== lbl) $('gateBtn').textContent = lbl;
      $('gateBtn').style.borderColor = tg.kind === 'boss' || tg.kind === 'mirror' ? '#ff5060' : tg.kind === 'xeno' ? '#40f0ff' : tg.kind === 'roam' ? '#b060ff' : tg.kind === 'sanct' ? (sanctNM() ? '#ff1020' : sanctCursed() ? '#ff2a60' : '#ffd040') : RIFT_RANKS[RIFTS[tg.i][2]].c; }
  }

  let lbTab = 'room';
  $('tabRoom').onclick = () => { lbTab = 'room'; $('tabRoom').classList.add('on'); $('tabWorld').classList.remove('on'); renderRoomList(); };
  $('tabWorld').onclick = () => { lbTab = 'world'; $('tabWorld').classList.add('on'); $('tabRoom').classList.remove('on'); renderLB(); };
  function rowHTML(id, n, t, isMe, extra){ return `<div class="lbRow${isMe ? ' me' : ''}" data-id="${esc(id)}"><span class="lbName">${esc(n)}${extra||''}</span><span class="lbTitle ${titleCss(t)}" style="color:${titleColor(t)}">${esc(tn(t))}</span></div>`; }
  function renderRoomList(){
    if (lbTab !== 'room') return;
    const arr = [{ id: S.id, n: S.name, t: S.t, l: S.L, me: 1, host: isHost }].concat(Object.keys(others).map(id => Object.assign({ id }, others[id])));
    arr.sort((a, b) => (b.t - a.t) || (b.l - a.l));
    $('lbList').innerHTML = arr.map((p, i) => rowHTML(p.id, `${i+1}. ${p.n}`, p.t, p.me, p.host ? ' 👑' : '')).join('');
    bindRows();
  }
  function renderLB(){
    const arr = lbData.slice(); if (!arr.find(x => x.id === S.id)) arr.push({ id: S.id, n: S.name, t: S.t, l: S.L, r: S.R });
    arr.sort((a, b) => (b.t - a.t) || ((b.l||0) - (a.l||0)));
    $('lbList').innerHTML = arr.slice(0, 50).map((p, i) => rowHTML(p.id, `${i+1}. ${p.n}`, p.t, p.id === S.id, p.r ? ` <small class="rb">✦${p.r}</small>` : '')).join('');
    bindRows();
  }
  function bindRows(){ document.querySelectorAll('.lbRow').forEach(r => r.onclick = () => { const id = r.dataset.id; if (id === S.id) return openStats();
    const o = others[id]; if (o) inspect(Object.assign({ id }, o)); else { const p = lbData.find(x => x.id === id); if (p) inspect(Object.assign({}, p, { offline: 1 })); } }); }

  // ---------------- Modals ----------------
  function modal(html){ $('modalBody').innerHTML = html; $('modal').style.display = 'flex'; }
  function closeModal(){ $('modal').style.display = 'none'; }
  $('modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.dataset.close !== undefined) closeModal(); });

  function inspect(p){
    const behind = (p.t - S.t) >= 5;
    const lv = behind ? '????' : (p.l || '?');
    const canDuel = !p.offline && others[p.id] && scene === 'world';
    modal(`<h2 class="${titleCss(p.t)}" style="color:${titleColor(p.t)}">${esc(tn(p.t))}</h2>
      <div class="muted">${esc(tierName(p.t, S.lang))}</div>
      <div class="big">${esc(p.n)}</div>${p.nk && p.nk !== 'none' ? `<div style="color:#ffd98a;font-style:italic">「${esc(byId(NICKS, p.nk)[S.lang])}」</div>` : ''}
      <table class="st"><tr><td>${T('level')}</td><td>${lv}</td></tr>
      <tr><td>${T('rebirths')}</td><td>${behind ? '????' : (p.r || 0)}</td></tr>
      ${p.pw !== undefined ? `<tr><td>${T('pvpWins')}</td><td>${behind ? '????' : p.pw}</td></tr>` : ''}</table>
      ${behind ? `<p class="muted"><i>${T('hiddenLv')}</i></p>` : ''}
      <canvas id="prevCv" width="220" height="200"></canvas>
      <div class="row">${canDuel ? (pvpCDLeft() > 0 ? `<button class="btn" disabled>⏳ ${mmss(pvpCDLeft())}</button>` : `<button class="btn red" id="duelBtn">⚔ ${T('challenge')}</button>`) : ''}<button class="btn" data-close>${T('close')}</button></div>`);
    previewChar(p.t, p.sk, p.as);
    if (canDuel) $('duelBtn').onclick = () => { challenge(p.id); closeModal(); };
  }
  let prevRAF = null;
  function previewChar(t, sk, as){ const c = $('prevCv'); if (!c) return; const x = c.getContext('2d'); const ch = { t, moving: false, fx: {}, face: 1, seed: 1, sk, as }; window.__prevCh = ch;
    cancelAnimationFrame(prevRAF); const loop = () => { if (!document.body.contains(c)) return; x.clearRect(0, 0, c.width, c.height); x.fillStyle = '#0a0810'; x.fillRect(0, 0, c.width, c.height);
      R.character(x, c.width/2, c.height - 28, 1.05, ch, time); prevRAF = requestAnimationFrame(loop); }; loop(); }

  function openStats(){
    const st = myStats();
    modal(`<h2 class="${titleCss(S.t)}" style="color:${titleColor(S.t)}">${esc(tn(S.t))}</h2><div class="muted">${esc(tierName(S.t, S.lang))}</div>
      <table class="st">
      <tr><td>${T('level')}</td><td>${S.L} / ${F.levelCap(S.t)}</td></tr>
      <tr><td>❤ ${T('hp')}</td><td>${fmt(st.hp)}</td></tr><tr><td>🔥 ${T('atk')}</td><td>${fmt(st.atk)}</td></tr>
      <tr><td>🛡 ${T('def')}</td><td>${fmt(st.def)}</td></tr><tr><td>✴ ${T('crit')}</td><td>${(st.crit*100).toFixed(1)}%</td></tr><tr><td>👟 ${T('speed')}</td><td>${Math.round(F.speed(S.t))}</td></tr>
      ${S.R ? `<tr><td>✦ ${T('rebirths')}</td><td>${S.R}</td></tr><tr><td>💠 ${T('essence')}</td><td>${S.E}</td></tr><tr><td>💠 ${T('essBonus')}</td><td>×${F.essMult(S.E).toFixed(2)}</td></tr>` : ''}
      <tr><td>📈 ${T('xpBonus')}</td><td>×${((1 + S.R)*(1 + 0.05*S.stelae.length)*(1 + 0.01*(S.marks||0))).toFixed(2)}</td></tr>
      ${S.stelae.length ? `<tr><td>🗿 ${T('stelae')}</td><td>${S.stelae.length} / ${STELAE.length}</td></tr>` : ''}
      ${S.marks ? `<tr><td>⛩ ${T('marks')}</td><td>${S.marks} / ${MAX_MARKS}</td></tr>` : ''}${S.shards ? `<tr><td>🪞 ${T('shards')}</td><td>${S.shards} / ${MAX_SHARDS} (+${Math.round(S.shards*SHARD_BONUS*100)}%)</td></tr>` : ''}${sanctBonus(S) ? `<tr><td>⛩ ${T('sanctBonus')}</td><td>+${Math.round(sanctBonus(S)*100)}%</td></tr>` : ''}${S.best > MAX_TITLE ? `<tr><td>🗼 ${T('towerBest')}</td><td>${S.best - MAX_TITLE}</td></tr>` : ''}${Object.keys(S.nm || {}).length ? `<tr><td>👁 ${T('nmTiers')}</td><td>${SYMBOLS.map(x => SYM_ICO[x.id] + ROMAN(nmTier(S, x.id) || 0 ) ).join(' ')}</td></tr>` : ''}${S.trans ? `<tr><td>✧ ${T('trans')}</td><td>+${fmt(S.transRate)}/h</td></tr>` : ''}${(S.xeno || {}).lv ? `<tr><td>🛸 ${T('xenoLv').replace('{n}', S.xeno.lv)}</td><td>+${S.xeno.lv*2}% · ✴+${S.xeno.lv}%</td></tr>` : ''}${activePassives(S).length ? `<tr><td>✦ ${T('talents')}</td><td>${activePassives(S).map(id => PASSIVES[id].ico + ' ' + ROMAN(passiveRank(S, id))).join(' · ')}</td></tr>` : ''}<tr><td>⚔ ${T('pvpWins')}</td><td>${S.pvpW}</td></tr></table>${S.marks ? `<p class="muted small">⛩ ${T('markEffect')}</p>` : ''}
      ${S.stelae.length ? `<div class="lore">${S.stelae.map(i => `<p>🗿 ${esc(STELAE_LORE[i][S.lang])}</p>`).join('')}</div>` : ''}
      <div class="row"><button class="btn" data-close>${T('close')}</button></div>`);
  }
  $('btnStats').onclick = openStats;
  // ---------------- v2.0 Talents (Thiên Phú) ----------------
  const SYM_ICO = { azure: '🐉', tiger: '🐯', phoenix: '🔥', tortoise: '🐢', yellowdragon: '👁' };
  function talentVisible(){ return Object.keys(PASSIVES).some(id => passiveRank(S, id) > 0) || nmOpen(S) || S.best >= MAX_TITLE; }
  function openTalents(){
    S.passives = (S.passives || []).filter(id => passiveRank(S, id) > 0); const slots = passiveSlots(S), eq = S.passives;
    let h = `<h2>✦ ${T('talents')}</h2><div class="muted small">${T('talentHint')}</div><p><b>${T('talentSlots').replace('{a}', Math.min(eq.length, slots)).replace('{b}', slots)}</b></p><div class="wGrid">`;
    for (const id in PASSIVES) { const P = PASSIVES[id]; if (P.hidden) continue; const r = passiveRank(S, id), ok = r > 0, on = eq.includes(id);
      const [k, a] = P.src.split(':'), srcTxt = k === 'sanct' ? T('src_sanct').replace('{n}', nmBoss(SYMBOLS.find(x => x.id === a))[S.lang]) : k === 'xeno' ? '🛸 ' + T('xeno') + ': ' + (S.best >= MAX_TITLE ? XENO_BOSSES[+a][S.lang] : '???') : T('src_' + k);
      const name = ok ? `${P.ico} ${P[S.lang]}` : `🔒 ${(k === 'sanct' && !nmOpen(S)) || (k === 'xeno' && S.best < MAX_TITLE) ? '???' : P[S.lang]}`;
      h += `<button class="wItem${on ? ' on' : ''}${ok ? '' : ' lockedW'}" data-pas="${id}" ${ok ? '' : 'disabled'}><b>${esc(name)}</b>
        <small>${ok ? esc(P.d[S.lang].replace('{v}', P.val(r))) + (k === 'sanct' ? ' · ' + T('talentRank').replace('{r}', r).replace('{m}', PASSIVE_RANK_MAX) : '') : esc((k === 'sanct' && !nmOpen(S)) || (k === 'xeno' && S.best < MAX_TITLE) ? T('talentLocked') : srcTxt)}</small>
        ${ok ? `<small>${on ? '✔ ' + T('equipped') : T('equip')}</small>` : ''}</button>`; }
    h += `</div><div class="row"><button class="btn" data-close>${T('close')}</button></div>`; modal(h);
    document.querySelectorAll('[data-pas]:not([disabled])').forEach(b => b.onclick = () => { const id = b.dataset.pas, i = S.passives.indexOf(id);
      if (i >= 0) S.passives.splice(i, 1); else if (S.passives.length >= passiveSlots(S)) { toast('✦ ' + T('talentFull')); return; } else S.passives.push(id);
      save(); sfx.lvl(); openTalents(); });
  }
  $('btnTalent').onclick = openTalents;
  // ---------------- v2.1 Handbook (Sổ Tay): what every stat / trait / mechanic / talent does + how to deal with it ----------------
  let gTab = 'mech';
  function openGuide(){
    const tabs = [['stats', 'gStats'], ['traits', 'gTraits'], ['mech', 'gMech'], ['talent', 'gTalent']];
    let h = `<h2>📘 ${T('guide')}</h2><div class="gTabs tabs">${tabs.map(([k, l]) => `<button data-gt="${k}" class="${gTab === k ? 'on' : ''}">${T(l)}</button>`).join('')}</div><div class="gList">`;
    const item = (title, desc, counter, how) => `<div class="gItem"><b>${title}</b><div>${esc(desc)}</div>${counter ? `<div class="c">💡 ${T('gCounter')}: ${esc(counter)}</div>` : ''}${how ? `<div class="h">🔑 ${T('gHow')}: ${esc(how)}</div>` : ''}</div>`;
    if (gTab === 'stats') for (const g of GUIDE_STATS) h += item(`${g.ico} ${esc(T(g.k))}`, g.d[S.lang]);
    if (gTab === 'traits') for (const id in TRAITS) { const t = TRAITS[id], m = t.m; h += item(`${t.ico} ${esc(t[S.lang])}`, `${T('hp')} ×${m[0]} · ${T('atk')} ×${m[1]} · ${T('def')} ×${m[2]}`); }
    if (gTab === 'mech') { h += item(`🔱 ${esc(T('mechTransform').split(':')[0])}`, T('mechTransform').replace('{h}', 15).replace('{a}', 20));
      if (S.best >= MAX_TITLE) h += item(`😈 ${esc(T('bossTalents'))}`, T('bossTalentsD'));
      for (const A of AFFIXES) h += item(`${A.ico} ${esc(A[S.lang])}`, A.d[S.lang]);
      const seenX = S.best >= MAX_TITLE; for (const A of XAFFIXES) h += seenX ? item(`${A.ico} ${esc(A[S.lang])} 🛸`, A.d[S.lang]) : item('🛸 ???', '???'); }
    if (gTab === 'talent') for (const id in PASSIVES) { const P = PASSIVES[id]; if (P.hidden) continue; const r = Math.max(1, passiveRank(S, id)), [k, a] = P.src.split(':'), locked = (k === 'sanct' && !nmOpen(S)) || (k === 'xeno' && S.best < MAX_TITLE);
      const how = k === 'sanct' ? T('src_sanct').replace('{n}', locked ? '???' : nmBoss(SYMBOLS.find(x => x.id === a))[S.lang]) : k === 'xeno' ? '🛸 ' + T('xeno') + ': ' + (locked ? '???' : XENO_BOSSES[+a][S.lang]) : T('src_' + k);
      h += item(`${P.ico} ${esc(locked ? '???' : P[S.lang])}${passiveRank(S, id) ? ' ✔' : ''}`, locked ? '???' : P.d[S.lang].replace('{v}', P.val(r)), '', how); }
    h += `</div><div class="row"><button class="btn" data-close>${T('close')}</button></div>`; modal(h);
    document.querySelectorAll('[data-gt]').forEach(b => b.onclick = () => { gTab = b.dataset.gt; openGuide(); });
  }
  $('btnGuide').onclick = openGuide;
  $('fightHelp').onclick = () => { gTab = 'mech'; openGuide(); };

  $('btnCodex').onclick = () => {
    let h = `<h2>📜 ${T('codex')}</h2><div class="codex">`;
    const maxTier = tierOf(Math.min(S.best, MAX_TITLE));
    for (let ti = 0; ti < UNL; ti++) {
      if (ti > maxTier) { h += `<div class="cTier"><b>${T('unknown')}</b></div>`; break; }
      h += `<div class="cTier"><b>${ti+1}. ${esc(TIERS[ti][S.lang])}</b><div class="cGrid">`;
      for (let t = realmStart(ti); t < realmStart(ti) + realmSize(ti); t++) { const known = t <= S.best; const next = t === S.best + 1;
        h += `<div class="cItem${t === S.t ? ' cur' : ''}${known ? '' : ' locked'}" ${known ? `style="color:${titleColor(t)}"` : ''}>${known ? esc(tn(t)) : (next ? '❔ ' + T('next') : T('unknown'))}</div>`; }
      h += '</div></div>';
    }
    if (S.best > MAX_TITLE) { const lo = Math.max(MAX_TITLE + 1, S.best - 11); h += `<div class="cTier"><b>🗼 ${T('towerBest')}: ${S.best - MAX_TITLE}</b><div class="cGrid">${Array.from({ length: S.best - lo + 1 }, (_, i) => `<div class="cItem rainbow">${esc(tn(lo + i))}</div>`).join('')}</div></div>`; }
    h += `</div><div class="row">${S.ended ? `<button class="btn gold" id="replayEnd">🎬 ${T('replayEnding')}</button>` : ''}<button class="btn" data-close>${T('close')}</button></div>`;
    modal(h); if (S.ended) $('replayEnd').onclick = () => { closeModal(); playEnding(); };
  };

  $('btnRebirth').onclick = () => {
    if (S.trans) { toast('✧ ' + T('transLocked')); return; }
    if (S.t < F.REBIRTH_MIN_TITLE) { modal(`<h2>✦ ${T('rebirthTitle')}</h2><p class="muted">${T('rebirthLocked')}</p><div class="row"><button class="btn" data-close>${T('close')}</button></div>`); return; }
    const gain = F.essence(S.t);
    modal(`<h2>✦ ${T('rebirthTitle')}</h2><p>${T('rebirthDesc')}</p>
      <p class="big">💠 +${gain} ${T('essence')}</p>
      <p class="muted">${T('rebirthEffect').replace('{x}', gain).replace('{a}', F.essMult(S.E).toFixed(2)).replace('{b}', F.essMult(S.E + gain).toFixed(2)).replace('{m}', (2 + S.R))}</p>
      <div class="row"><button class="btn gold" id="doRebirth">✦ ${T('rebirthDo')}</button><button class="btn" data-close>${T('close')}</button></div>`);
    $('doRebirth').onclick = () => { if (S.trans) return; S.E += gain; S.R += 1; S.eLog = (S.eLog || []).concat([[Math.round(S.playSec), S.E]]).slice(-300); S.L = 1; S.xp = 0; S.t = 1; save(); pushLB(); closeModal(); flash('#fff', 1.2); sfx.rebirth(); refreshHUD(true);
      bigBanner('✦ ' + T('rebirthTitle').toUpperCase() + ' ✦', `${T('rebirths')}: ${S.R} · 💠 ${S.E}`); };
  };

  $('btnSettings').onclick = () => {
    modal(`<h2>⚙ ${T('settings')}</h2>
      <div class="row"><button class="btn" id="sLang">${T('lang')}: ${S.lang.toUpperCase()}</button><button class="btn" id="sMute">${T('mute')}: ${S.muted ? '🔇' : '🔊'}</button></div>
      <div class="vol"><label>🎵 ${T('music')}<input type="range" id="vM" min="0" max="1" step="0.05" value="${S.vol.m}"></label>
      <label>🔔 ${T('sfxVol')}<input type="range" id="vS" min="0" max="1" step="0.05" value="${S.vol.s}"></label>
      <label>🔥 ${T('auraVol')}<input type="range" id="vA" min="0" max="1" step="0.05" value="${S.vol.a}"></label></div>
      <p class="muted small">${Object.keys(AudioM.files).length ? T('audioFiles').replace('{n}', Object.keys(AudioM.files).length) : T('audioNone')}</p>
      <div class="row"><button class="btn" id="sCatch">✨ ${T('catchupFx')}: ${S.catchupFx ? T('on') : T('off')}</button></div>
      <div class="row"><button class="btn" id="sExp">💾 ${T('exportSave')}</button><button class="btn" id="sImp">📥 ${T('importSave')}</button></div>
      <textarea id="sBox" rows="3" style="width:100%;display:none"></textarea>
      <p class="muted small">GodK Bá Khí v${GAME_VERSION} · ${Net.mode}</p>
      <div class="row"><button class="btn red" id="sLeave">${T('leave')}</button><button class="btn" data-close>${T('close')}</button></div>`);
    $('sLang').onclick = () => { S.lang = S.lang === 'vi' ? 'en' : 'vi'; save(); refreshHUD(true); lobbyTexts(); $('btnSettings').onclick(); };
    $('sCatch').onclick = () => { S.catchupFx = !S.catchupFx; save(); $('btnSettings').onclick(); };
    $('sMute').onclick = () => { S.muted = !S.muted; AudioM.setMuted(S.muted); save(); $('btnSettings').onclick(); };
    [['vM', 'm'], ['vS', 's'], ['vA', 'a']].forEach(([id, k]) => { $(id).oninput = e => { S.vol[k] = +e.target.value; AudioM.setVol(S.vol); }; $(id).onchange = () => { save(); if (k === 's') sfx.lvl(); }; });
    $('sExp').onclick = () => { const b = $('sBox'); b.style.display = 'block'; b.value = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); b.select(); };
    $('sImp').onclick = () => { const b = $('sBox'); if (b.style.display !== 'block' || !b.value.trim()) { b.style.display = 'block'; b.value = ''; b.placeholder = T('importPrompt'); b.focus(); return; }
      try { const o = migrate(JSON.parse(decodeURIComponent(escape(atob(b.value.trim()))))); if (typeof o.t !== 'number' || typeof o.L !== 'number') throw 0; S = Object.assign(DEF(), o); save(); toast(T('importOk')); refreshHUD(true); pushLB(); closeModal(); } catch(e) { toast(T('importBad')); } };
    $('sLeave').onclick = () => $('leaveBtn').onclick();
  };
  // ---------------- v1.3 Wardrobe & unlocks ----------------
  const COS = { aura: [AURA_SKINS, 'as', 'tabAura'], nick: [NICKS, 'nk', 'tabNick'], skin: [SKINS, 'sk', 'tabSkin'] };
  let wTab = 'skin', unlockT = 0;
  function openWardrobe(){
    const [list, key] = COS[wTab];
    let h = `<h2>🎭 ${T('wardrobe')}</h2><canvas id="prevCv" width="220" height="210"></canvas>
      <div class="tabs wtabs">${Object.keys(COS).map(k => `<button data-wt="${k}" class="${k === wTab ? 'on' : ''}">${T(COS[k][2])}</button>`).join('')}</div><div class="wGrid">`;
    for (const it of list) { const ok = reqMet(S, it.req), on = S[key] === it.id; const [c, v] = reqProgress(S, it.req);
      // v1.7 no spoilers: title-locked items beyond your current realm and the final-boss reward show as ???
      const k0 = it.req[0], hide = !ok && (k0 === 'finalWins' || (k0 === 'best' && tierOf(it.req[1]) > tierOf(S.best)));
      const nm = hide ? '???' : it[S.lang], rq = k0 === 'best' ? T('reachHidden') : k0 === 'finalWins' ? T('defeatHidden') : reqText(it.req, S.lang);
      h += `<button class="wItem${on ? ' on' : ''}${ok ? '' : ' lockedW'}${hide ? ' spoil' : ''}" data-id="${it.id}" ${ok ? '' : 'disabled'}><b>${ok ? '' : '🔒 '}${esc(nm)}</b>
        <small>${on ? '✔ ' + T('equipped') : ok ? T('equip') : esc(rq) + (k0 !== 'best' && k0 !== 'finalWins' ? ` (${Math.min(c, v) >= 1000 ? Math.floor(Math.min(c, v)/1000) + 'K' : Math.floor(Math.min(c, v))}/${v >= 1000 ? v/1000 + 'K' : v})` : '')}</small></button>`; }
    h += `</div><div class="row">${S.ended ? `<button class="btn gold" id="replayEnd">🎬 ${T('replayEnding')}</button>` : ''}<button class="btn" data-close>${T('close')}</button></div>`;
    modal(h); if (S.ended) $('replayEnd').onclick = () => { closeModal(); playEnding(); }; previewChar(S.t, S.sk, S.as);
    document.querySelectorAll('[data-wt]').forEach(b => b.onclick = () => { wTab = b.dataset.wt; openWardrobe(); });
    document.querySelectorAll('.wItem:not([disabled])').forEach(b => b.onclick = () => { S[key] = b.dataset.id; save(); Net.sendMe(meNet(), true); pushLB(); openWardrobe(); });
  }
  $('btnWardrobe').onclick = openWardrobe;
  // ---------------- v1.8 Bestiary ----------------
  const WHERE = { sanct: 'whereSanct', gate: 'whereGate', tower: 'whereTower', rift: 'whereRift', roam: 'whereRoam', mirror: 'whereMirror', final: 'whereFinal' };
  function drawBossThumb(c, B, t){ const x = c.getContext('2d'), W_ = c.width, H_ = c.height; x.fillStyle = '#0a0710'; x.fillRect(0, 0, W_, H_);
    if (B.id === 'mirrorself' || B.id === 'finalmirror') { R.character(x, W_/2, H_ - 14, H_/130, { t: B.id === 'finalmirror' ? MAX_TITLE : S.t, sk: S.sk, face: -1, fx: {}, mirror: true, seed: 3 }, t); return; }
    const sz = H_*0.72; x.save(); R.bossAura(x, W_/2, H_ - 10, sz, t, 4, 0); x.restore(); R.boss(x, B.id, W_/2, H_ - 10, sz, t, { hue: B.hue, hurt: 0, atk: 0, g: 100, target: [-200, -40], fx: {} }); }
  let bRAF = null;
  function openBestiary(){
    const list = bestiaryList(), be = S.bestiary || {}, found = list.filter(b => be[b.id]).length;
    let h = `<h2>📖 ${T('bestiary')}</h2><div class="muted">${T('bDiscovered').replace('{a}', found).replace('{b}', list.length)}</div><div class="bGrid">`;
    list.forEach((B, i) => { const e = be[B.id]; h += `<button class="bItem${e ? '' : ' unk'}" data-bi="${i}" ${e ? '' : 'disabled'}><canvas width="96" height="96"></canvas><b>${e ? esc(B[S.lang]) : '???'}</b>${e ? `<small>⚔ ${e.k}</small>` : ''}</button>`; });
    h += `</div><div class="row"><button class="btn" data-close>${T('close')}</button></div>`; modal(h);
    document.querySelectorAll('.bItem').forEach(el => { const B = list[+el.dataset.bi], c = el.querySelector('canvas');
      if (be[B.id]) drawBossThumb(c, B, 1.3); else { const x = c.getContext('2d'); drawBossThumb(c, B, 1.3); x.globalCompositeOperation = 'source-atop'; x.fillStyle = '#000'; x.fillRect(0, 0, 96, 96); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#5a5070'; x.font = `900 34px ${FONT}`; x.textAlign = 'center'; x.fillText('?', 48, 60); }
      if (be[B.id]) el.onclick = () => openBossPage(B); });
  }
  function openBossPage(B){
    const e = S.bestiary[B.id];
    modal(`<h2 style="color:hsl(${B.hue},90%,70%)">${esc(B[S.lang])}</h2><canvas id="bCv" width="300" height="300" style="display:block;margin:6px auto;border-radius:12px"></canvas>
      <div class="lore">${B.intro[S.lang].map(l => `<p>“${esc(l)}”</p>`).join('')}</div>
      <table class="st">${B.trait && TRAITS[B.trait] ? `<tr><td>${T('trait')}</td><td>${TRAITS[B.trait].ico} ${TRAITS[B.trait][S.lang]}</td></tr>` : ''}<tr><td>${T('bKills').replace(': {n}', '')}</td><td>${e.k}</td></tr><tr><td>${T('bWhere')}</td><td>${T(WHERE[e.w] || 'whereGate')}</td></tr></table>
      <div class="row"><button class="btn" id="bBack">‹ ${T('bestiary')}</button><button class="btn" data-close>${T('close')}</button></div>`);
    $('bBack').onclick = openBestiary; const c = $('bCv'); cancelAnimationFrame(bRAF);
    const loop = () => { if (!document.body.contains(c)) return; drawBossThumb(c, B, time); bRAF = requestAnimationFrame(loop); }; loop();
  }
  $('btnBestiary').onclick = openBestiary;
  function unlockTick(){
    if (scene === 'lobby' || Date.now() - unlockT < 2500) return; unlockT = Date.now(); S.unlocks = S.unlocks || [];
    if (!S.unlocks.length) { for (const k in COS) for (const it of COS[k][0]) if (reqMet(S, it.req)) S.unlocks.push(k + ':' + it.id); save(); return; } // first run: no spam
    if (scene !== 'world') return; // don't cover fights / endings
    const fresh = []; for (const k in COS) for (const it of COS[k][0]) { const id = k + ':' + it.id; if (!S.unlocks.includes(id) && reqMet(S, it.req)) { S.unlocks.push(id); fresh.push([k, it]); } }
    if (!fresh.length) return; save(); sfx.find();
    if (fresh.length <= 3) fresh.forEach(([k, it]) => toast(`🎁 ${esc(T('unlockedNew').replace('{n}', it[S.lang]))} <small>(${T(COS[k][2])})</small>`, 5000));
    else toast(`🎁 ${esc(T('unlockedNew').replace('{n}', fresh.slice(0, 3).map(([, it]) => it[S.lang]).join(', ') + ` +${fresh.length - 3}`))} <small>(🎭 ${T('wardrobe')})</small>`, 6000);
  }
  $('btnSupport').onclick = () => modal(`<h2>💖 ${T('support')}</h2><div class="row col">
    <a class="btn gold" href="https://ko-fi.com/lichstream" target="_blank" rel="noopener">☕ Ko-fi — LichStream</a>
    <a class="btn red" href="https://www.youtube.com/@LichStream" target="_blank" rel="noopener">▶ YouTube — @LichStream</a></div>
    <div class="row"><button class="btn" data-close>${T('close')}</button></div>`);

  // ---------------- v1.6 Ending ----------------
  function playEnding(done){
    const el = $('ending'); const lines = ENDING[S.lang] || ENDING.en; el.innerHTML = lines.map((l, i) => `<p style="animation-delay:${0.6 + i*2.2}s" class="${i === lines.length - 1 ? 'last' : ''}">${esc(l)}</p>`).join('') + `<button class="btn" id="endSkip">${T('skip')} ›</button>`;
    el.style.display = 'flex'; sfx.rebirth(); let closed = false;
    const close = () => { if (closed) return; closed = true; el.style.display = 'none'; el.innerHTML = ''; if (done) done(); };
    $('endSkip').onclick = close; setTimeout(close, (lines.length*2.2 + 3.5)*1000);
  }
  // ---------------- Banner / flash ----------------
  let flashA = 0, flashC = '#fff';
  function flash(c, a){ flashC = c; flashA = a; }
  function bigBanner(top, main, color, cls, sub){ const b = $('banner'); b.innerHTML = `<div class="bTop">${esc(top)}</div><div class="bMain ${cls||''}" style="color:${color||'#fff'}">${esc(main)}</div>${sub ? `<div class="bSub">${esc(sub)}</div>` : ''}`;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

  // ---------------- Progress ----------------
  function gainXP(dt){
    if (capped() && S.t >= S.best) { S.xp = 0; return; }
    if (capped()) { if (scene === 'world') tryAutoBreak(); return; }
    const L0 = S.L; addXP(F.xpRate(S, me.moving, inWell(), buffOn()) * dt, scene === 'world');
    if (S.L !== L0) { sfx.lvl(); floaters.push({ x: me.x, y: me.y, txt: `${T('level')} ${S.L}`, c: '#9ff', life: 1.2 });
      if (capped() && S.t >= S.best) toast('⚠ ' + T('capReached')); }
  }
  // v2.2: every source of aura (moving, rifts, roamers, sanctum…) flows through here. Hitting the level cap of a gate you
  // have ALREADY conquered no longer wastes the rest: the gate shatters on the spot and the aura keeps flowing into the next title.
  function addXP(xp, autoTitle = true){
    const t0 = S.t; let ups = 0;
    while (xp > 0) {
      if (capped()) { if (autoTitle && S.t < S.best) { S.t++; continue; } S.xp = 0; break; }
      const need = F.xpNeed(S.L) - S.xp; if (xp >= need) { xp -= need; S.xp = 0; S.L++; ups++; } else { S.xp += xp; xp = 0; }
    }
    if (autoTitle && capped() && S.t < S.best) S.t++;
    if (capped()) S.xp = 0;
    if (S.t !== t0) { if (S.catchupFx) { if (Date.now() - skipToastT > 4000) { skipToastT = Date.now(); toast('💥 ' + T('gateSkip') + (S.t - t0 > 1 ? ` ×${S.t - t0}` : '')); } titleFx(t0, false); } else titleQuiet(); }
    return ups;
  }
  function titleUp(fromGate){
    const t0 = S.t; S.t += 1; if (S.t > S.best) { const first = S.t > MAX_TITLE && S.best <= MAX_TITLE; S.best = S.t; if (first) setTimeout(()=>toast('∞ ' + T('beyondUnlocked'), 6000), 2500); }
    S.xp = 0; titleFx(t0, fromGate);
  }
  function titleFx(t0, fromGate){ const oldTier = tierOf(t0);
    save(); pushLB(); sfx.title(); flash(titleColor(S.t), tierOf(S.t) !== oldTier ? 1 : (fromGate ? 0.5 : 0.2));
    bigBanner(tierOf(S.t) !== oldTier ? `${T('newTitle')} · ${tierName(S.t, S.lang)}` : T('newTitle'), tn(S.t), titleColor(S.t), titleCss(S.t));
    refreshHUD(true); Net.sendMe(meNet(), true);
  }
  // already-conquered gates shatter automatically if you clearly overpower them
  // v1.3 QoL: every Dungeon Gate you have already conquered is passed automatically (no fight)
  let skipToastT = 0;
  function tryAutoBreak(){
    if (S.t >= S.best || !capped()) return;
    if (!S.catchupFx) { S.t += 1; S.xp = 0; titleQuiet(); return; } // v2.2: quiet by default (no banner storm after rebirth)
    if (Date.now() - skipToastT > 4000) { skipToastT = Date.now(); toast('💥 ' + T('gateSkip')); }
    titleUp(false);
  }
  // v2.2: re-passing already-conquered gates is silent; ONE banner when you are back at your highest title (Settings can restore the old effects)
  let quietT = 0;
  function titleQuiet(){ refreshHUD(true); const now = Date.now(), done = S.t >= S.best;
    if (done || now - quietT > 3000) { quietT = now; save(); pushLB(); Net.sendMe(meNet(), true); }
    if (done) { sfx.title(); flash(titleColor(S.t), 0.5); bigBanner(T('caughtUp'), tn(S.t), titleColor(S.t), titleCss(S.t)); } }

  // ---------------- Interact / Gate ----------------
  const riftReady = i => Date.now() >= ((S.riftCD || {})[i] || 0);
  function nearTarget(){
    if (capped() && Math.hypot(me.x - GATE.x, me.y - GATE.y) < 170) return { kind: 'boss' };
    if (Date.now() >= (S.mirrorCD || 0) && Math.hypot(me.x - MIRROR_GATE.x, me.y - MIRROR_GATE.y) < 130) return { kind: 'mirror' };
    if (S.best >= MAX_TITLE && !S.xenoOpen && Math.hypot(me.x - XENO.gate[0], me.y - XENO.gate[1]) < 160 && xenoReady(0)) return { kind: 'xeno', i: 0 };
    if (onXeno()) for (const w of ['core', 'spire']) { const [ax, ay] = xenoAbs(XENO_SPOTS[w]); if (Math.hypot(me.x - ax, me.y - ay) < 170) { const i = xenoTargetIdx(w); if (i >= 0 && xenoReady(i)) return { kind: 'xeno', i }; } }
    if (S.sanctOpen && S.best >= SANCTUM.unlockTitle) for (const sym of SYMBOLS) { if (Math.hypot(me.x - SANCTUM.x - sym.dx, me.y - SANCTUM.y - sym.dy) < (sym.center ? 150 : 120)) { const st = sanctState(sym); if (st === 'ready') return { kind: 'sanct', sym }; } }
    for (let i = 0; i < RIFTS.length; i++) if (riftReady(i) && Math.hypot(me.x - RIFTS[i][0], me.y - RIFTS[i][1]) < 140) return { kind: 'rift', i };
    const pool = unlockedBosses(S.t), now = Date.now();
    for (let i = 0; i < ROAMERS.length; i++) { const r = roamerAt(i, now, pool); if (now >= ((S.roamCD || {})[i] || 0) && Math.hypot(me.x - r.x, me.y - r.y) < 150) return { kind: 'roam', i, r }; }
    return null;
  }
  function interact(){
    if (scene !== 'world') return;
    const tg = nearTarget(); if (!tg) return;
    if (tg.kind === 'boss') startBoss(); else if (tg.kind === 'xeno') startXeno(tg.i); else if (tg.kind === 'sanct') startSanct(tg.sym); else if (tg.kind === 'mirror') startMirror(); else if (tg.kind === 'roam') startRoam(tg.r); else startRift(tg.i);
  }
  $('gateBtn').onclick = interact;
  function openTranscend(){ // v2.2 Siêu Thoát
    const c = transCheck(S), base = transRecentRate(S), after = base*TRANS.mult, ok = c.r && c.x && c.log && base > 0;
    const need = [[c.r, T('transNeedR').replace('{c}', S.R).replace('{v}', TRANS.minR)], [c.x, T('transNeedX')], [c.log, T('transNeedLog').replace('{c}', c.logN).replace('{v}', TRANS.logMin).replace('{m}', TRANS.spanMin)]];
    modal(`<h2>${T('transTitle')}</h2><p>${T('transDesc')}</p>
      ${base > 0 ? `<p class="big">💠 ${T('transRate').replace('{a}', fmt(base)).replace('{b}', fmt(after)).replace('{m}', TRANS.mult)}</p>` : ''}
      ${ok ? '' : `<p class="muted">${T('transNo')}</p><ul style="text-align:left">${need.map(([o, t]) => `<li>${o ? '✔' : '✖'} ${esc(t)}</li>`).join('')}</ul>`}
      <div class="row">${ok ? `<button class="btn gold" id="doTrans">${T('transDo')}</button>` : ''}<button class="btn" data-close>${T('close')}</button></div>`);
    if (ok) $('doTrans').onclick = () => { modal(`<h2>${T('transTitle')}</h2><p class="big">${T('transSure')}</p><div class="row"><button class="btn red" id="doTrans2">${T('transYes')}</button><button class="btn" data-close>${T('close')}</button></div>`);
      $('doTrans2').onclick = () => { S.trans = 1; S.transRate = after; S.transAt = Math.round(S.playSec); S.Ef = 0; save(); pushLB(); closeModal(); refreshHUD(true); sfx.title(); flash('#fff8d8', 1.2);
        bigBanner(T('transTitle'), T('transDone'), '#ffe9a8'); Net.sendMe(meNet(), true); }; };
  }
  $('transBtn').onclick = openTranscend;
  $('xenoBtn').onclick = () => { const m = $('xenoBtn').dataset.m; if (m === 'back') { me.x = XENO.gate[0]; me.y = XENO.gate[1] + 200; } else if (m === 'go') { const [ax, ay] = xenoAbs(XENO_SPOTS.pad); me.x = ax; me.y = ay; }
    sfx.transform(); flash('#7ff8ff', 0.7); Net.sendMe(meNet(), true); };
  $('sanctBtn').onclick = () => { S.sanctMode = S.sanctMode === 'normal' ? 'cursed' : S.sanctMode === 'cursed' && nmOpen(S) ? 'nightmare' : 'normal'; save(); sfx.transform();
    flash(S.sanctMode === 'nightmare' ? '#000' : S.sanctMode === 'cursed' ? '#600020' : '#fff6c0', S.sanctMode === 'nightmare' ? 0.95 : 0.5); if (S.sanctMode === 'nightmare') bigBanner('👁', T('nmSanct'), '#ff3040'); };

  // ---------------- Fights (boss & PvP) ----------------
  let fight = null;
  function mulberry(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const bossName = (B, fi) => `${S.lang === 'vi' ? B.vi : B.en} · ${BOSS_FORMS[fi][S.lang]}`;
  function startBoss(){ const g = S.t;
    if (g >= MAX_TITLE) { // v1.8 GodK Tower
      const fl = towerFloor(g), B = towerBoss(fl), aff = towerAffixes(fl, Date.now()), ids = aff.map(a => a.id), st = Object.assign({}, F.boss(g)), guardian = fl % 10 === 0;
      if (guardian) { st.hp *= 1.3; st.atk *= 1.15; }
      if (fl >= TOWER_NEW_FROM) { st.hp *= TOWER_HELL_M; st.atk *= TOWER_HELL_M; st.def *= TOWER_HELL_M; } // v2.3: talents era
      beginBossFight({ kind: 'boss', g, B, st, form: towerForm(fl), jump: 1, bp: towerBossPas(fl, B), tower: { fl, aff: ids, guardian, hell: !!B.hell, name: towerBossName(B, fl, S.lang) } }); return; }
    beginBossFight({ kind: 'boss', g, B: bossFor(g), st: F.boss(g), form: bossForm(g), jump: isRealmEnd(g) ? 2 : 1 }); }
  function startRift(i){
    const RK = RIFT_RANKS[RIFTS[i][2]], g = S.t, b = F.boss(g), pool = unlockedBosses(g);
    const st = { hp: b.hp*RK.mult, atk: b.atk*RK.mult, def: b.def*RK.mult, crit: b.crit };
    beginBossFight({ kind: 'rift', i, g, B: pool[Math.floor(Math.random()*pool.length)], st, form: Math.min(8, RK.form + Math.floor(tierOf(g)/3)), jump: 1 });
  }
  function startRoam(r){
    const g = S.t, b = F.boss(g); const st = { hp: b.hp*ROAM_MULT, atk: b.atk*ROAM_MULT, def: b.def*ROAM_MULT, crit: b.crit };
    beginBossFight({ kind: 'roam', i: r.i, g, B: r.B, st, form: Math.min(8, 1 + Math.floor(tierOf(g)*0.8)), jump: 1 });
  }
  // ---------------- v1.9 Four Symbols Sanctum ----------------
  const sanctCursed = () => S.sanctMode === 'cursed' && sanctCursedOpen(S);
  const sanctNM = () => S.sanctMode === 'nightmare' && sanctCursedOpen(S) && nmOpen(S); // v2.0
  const sanctBossOf = sym => sanctNM() ? nmBoss(sym) : symbolBoss(sym, sanctCursed());
  const sanctRefOf = sym => sanctNM() ? nmRef(nmTier(S, sym.id) + 1, sym.center) : SANCT_REF[sanctCursed() ? 'cursed' : 'normal'][sym.center ? 1 : 0];
  function sanctState(sym){
    if (sanctNM()) { const k = nmTier(S, sym.id) + 1; if (sym.center && !SYMBOLS.filter(x => !x.center).every(x => nmTier(S, x.id) >= k)) return 'locked';
      return Date.now() < ((S.sanctCD || {})['nm_' + sym.id] || 0) ? 'cd' : 'ready'; }
    const cur = sanctCursed(), key = sym.id + (cur ? '_c' : ''), sn = S.sanct || {};
    if (S.best < SANCTUM.unlockTitle) return 'locked';
    if (sym.center && !SYMBOLS.filter(x => !x.center).every(x => sn[x.id + (cur ? '_c' : '')])) return 'locked';
    if (Date.now() < ((S.sanctCD || {})[key] || 0)) return 'cd'; return sn[key] ? 'done' : 'ready'; }
  function sanctThreat(sym){ // rough win estimate shown on the pedestal (☠☠☠ … ✓)
    const B = sanctBossOf(sym), b = applyTrait(F.boss(sanctRefOf(sym)), B), p = myStats();
    const m = (p.hp / F.dmg(b.atk, p.def)) / (b.hp / (F.dmg(p.atk, b.def)*1.15)); return m < 0.4 ? 0 : m < 0.75 ? 1 : m < 1.1 ? 2 : 3; }
  function startSanct(sym){
    const cur = sanctCursed(), nm = sanctNM(), B = sanctBossOf(sym), ref = sanctRefOf(sym), st = F.boss(ref);
    beginBossFight({ kind: 'sanct', i: sym.id, g: S.t, mechG: ref, B, st, form: nm ? 12 : cur ? 11 : (sym.center ? 10 : 9), jump: 1, nmTier: nm ? nmTier(S, sym.id) + 1 : 0 });
  }
  function startMirror(){
    const p = myStats(); const st = { hp: p.hp*MIRROR_MULT, atk: p.atk*MIRROR_MULT, def: p.def*MIRROR_MULT, crit: p.crit };
    beginBossFight({ kind: 'mirror', g: S.t, B: MIRROR_BOSS, st, form: 0, jump: 0, script: Math.random() < mirrorChance(S) });
  }
  function beginBossFight(o){
    const { g, B } = o; let st = o.st;
    // v1.9: boss trait + mechanics (tower weekly affixes, boss's own affixes)
    const aff = [...new Set([].concat(o.tower ? o.tower.aff : [], o.aff || [], B.aff || []))];
    if (o.kind !== 'mirror') st = applyTrait(st, B); st = Object.assign({}, st);
    if (aff.includes('armor')) st.def *= 2; if (aff.includes('giant')) st.hp *= 1.6; if (aff.includes('crit')) st.crit = 0.35;
    if (o.tower) o.tower.aff = aff;
    const hue = (B.hue + posOf(g)*6) % 360;
    fight = { kind: o.kind, riftI: o.i, g, B, rng: Math.random, hue, form: o.form, jump: o.jump, aBoost: 0, transformed: o.kind === 'mirror' || B.id === 'finalmirror', script: o.script, memPhase: -1,
      L: { name: S.name, t: S.t, st: myStats(), hp: 0, fx: {}, hurt: 0, atk: 0, sk: S.sk, as: S.as, pas: activePassives(S), prank: passiveRanks(S), shards: S.shards || 0 },
      Rt: { name: o.kind === 'mirror' || B.id === 'finalmirror' ? (S.lang === 'vi' ? B.vi : B.en) : bossName(B, o.form), st, hp: 0, hurt: 0, atk: 0, fx: {} },
      phase: 'intro', timer: 0, round: 0, beams: [], nums: [], intro: B.intro[S.lang], result: null, tower: o.tower || null, nmTier: o.nmTier || 0, aff: aff.length ? aff : null, enr: 1 };
    fight.L.hp = fight.L.st.hp; fight.Rt.hp = st.hp;
    if (o.tower) { const tw = o.tower; fight.Rt.name = `${tw.name} · ${BOSS_FORMS[o.form][S.lang]}`; fight.transformed = true; fight.towerBoost = Math.min(1.4, 0.2 + tw.fl/45);
      fight.intro = [T('towerFloor').replace('{n}', tw.fl)].concat(fight.intro);
      if (tw.guardian) setTimeout(() => { if (fight && fight.tower === tw) { bigBanner(T('towerGuardian'), tw.name, `hsl(${B.hue},100%,65%)`); flash('#fff', 0.5); sfx.transform(); } }, 300); }
    if (aff.includes('void')) fight.L.st = Object.assign({}, fight.L.st, { crit: 0 });
    if (['boss', 'rift', 'roam', 'sanct', 'xeno'].includes(o.kind) && B.id !== 'finalmirror') fight.mech = F.transformMech(o.mechG || g, o.kind === 'boss' && isRealmEnd(g));
    if (o.bp) { fight.Rt.pas = o.bp.pas.slice(); fight.Rt.prank = o.bp.prank; } // v2.3 Tower boss talents
    if (aff.includes('mimic') && fight.L.pas.length) { fight.Rt.pas = [fight.L.pas[0]]; fight.Rt.prank = fight.L.prank; fight.Rt.shards = S.shards || 0; } // v2.1 Assimilate
    if (o.kind === 'xeno') fight.Rt.name = S.lang === 'vi' ? B.vi : B.en;
    if (o.kind === 'sanct') fight.Rt.name = (S.lang === 'vi' ? B.vi : B.en) + (o.nmTier ? ' · ' + ROMAN(o.nmTier) : '');
    S.bestiary = S.bestiary || {}; const be = S.bestiary[B.id] || (S.bestiary[B.id] = { k: 0 }); be.w = o.tower ? 'tower' : o.kind === 'boss' ? (B.id === 'finalmirror' ? 'final' : 'gate') : o.kind;
    scene = 'fight'; $('hud').classList.add('dim'); $('fightUI').style.display = 'block'; $('fightHelp').style.display = 'block'; sfx.beat();
    Net.sendMe(Object.assign(meNet(), { mv: 0 }), true);
  }
  function startPvP(d, myRole){
    const a = d.sa, b = d.sb;
    fight = { kind: 'pvp', rng: mulberry(d.seed), myRole, did: d.id,
      L: { name: a.n, t: a.t, st: a, hp: a.hp, fx: {}, hurt: 0, atk: 0, sk: a.sk, as: a.as, pas: a.pas || [], prank: a.prank || {}, shards: a.shards || 0 },
      Rt: { name: b.n, t: b.t, st: b, hp: b.hp, fx: {}, hurt: 0, atk: 0, sk: b.sk, as: b.as, pas: b.pas || [], prank: b.prank || {}, shards: b.shards || 0 },
      phase: 'intro', timer: 0, round: 0, beams: [], nums: [], intro: [`${a.n}  ⚔  ${b.n}`, T('fightStart') + '!'], result: null , enr: 1 };
    scene = 'fight'; $('hud').classList.add('dim'); $('fightUI').style.display = 'block'; closeModal(); sfx.beat();
  }
  // v1.11: passive hooks for either side (no-op while FEATURE_PASSIVES is off: side.pas is empty)
  function pas(f, me, foe, hook, d, crit){ if (!me.pas || !me.pas.length) return hook === 'onDeath' ? false : d; const c = { f, me, foe, crit };
    for (const id of me.pas) { const P = PASSIVES[id]; if (!P || !P[hook]) continue; if (hook === 'onDeath') { if (P.onDeath(c)) return true; } else if (hook === 'onTurn') P.onTurn(c); else d = P[hook](c, d); }
    return hook === 'onDeath' ? false : d; }
  const dead = (f, me, foe) => me.hp <= 0 && !pas(f, me, foe, 'onDeath');
  function xActive(f){ const a = f.aff || []; if (!a.includes('phases')) return a; // v2.1 Nebula Sower: mechanic changes every 25% HP
    const q = Math.min(3, Math.floor((1 - Math.max(0, f.Rt.hp)/f.Rt.st.hp)*4)); if (q !== f.ph4) { f.ph4 = q; if (f.round > 1) { const X_ = XAFFIXES.find(x => x.id === XPHASES[q]); bigBanner('♻', X_.ico + ' ' + X_[S.lang], '#b080ff'); sfx.transform(); } } return a.concat([XPHASES[q]]); }
  function hitCalc(att, def, rng){ let d = F.dmg(att.atk, def.def) * (0.9 + rng()*0.2); const crit = rng() < att.crit; if (crit) d *= 2.5; return [d, crit]; }
  function fightStep(dt){
    const f = fight; f.timer += dt; f.L.hurt = Math.max(0, f.L.hurt - dt); f.Rt.hurt = Math.max(0, f.Rt.hurt - dt); f.L.atk = Math.max(0, f.L.atk - dt*2); f.Rt.atk = Math.max(0, f.Rt.atk - dt*2);
    if (f.phase === 'intro') { if (f.timer > 3.2) { f.phase = 'fight'; f.timer = 0; bigBanner('', T('fightStart'), '#f33'); } return; }
    if (f.phase === 'fight') {
      const tick = 0.5;
      while (f.timer >= tick && f.phase === 'fight') {
        f.timer -= tick; f.round++;
        const AF = f.aff || [], XA = xActive(f), noHeal = f.kind !== 'pvp' && (f.L.pas || []).includes('purify'); // v2.1: Purify blocks every boss heal
        // left attacks (v2.1: Twin Shadow = a second, separate hit; Map-2 mechanics apply per hit)
        let over = 0;
        for (const mul of ((f.L.pas || []).includes('multi') ? [1, 0.5] : [1])) {
          let [d, c] = hitCalc(f.L.st, f.Rt.st, f.rng); d *= mul; d = pas(f, f.Rt, f.L, 'onTake', pas(f, f.L, f.Rt, 'onDeal', d, c), c);
          if (AF.includes('shield') && f.Rt.hp > f.Rt.st.hp*0.5) d *= 0.5;
          if (XA.includes('quantum') && !c) d = 0;                          // Quantum Shield: only crits land
          if (XA.includes('dmgcap')) d = Math.min(d, f.Rt.st.hp*0.03);      // Damage Cap: ≤3% max HP per hit
          if (AF.includes('thorns')) { f.L.hp -= d*0.2; if (dead(f, f.L, f.Rt)) { f.L.hp = 0; over = 2; break; } }
          if (XA.includes('reflect') && !c && d > 0) { f.L.hp -= d*0.5; f.L.hurt = 0.25; if (dead(f, f.L, f.Rt)) { f.L.hp = 0; over = 2; break; } } // Reflector
          if (f.script !== undefined) { d *= f.script ? 1.3 : 0.8; if (!f.script && f.Rt.hp - d <= 0) d = Math.max(0, f.Rt.hp - 1); } f.Rt.hp -= d; f.Rt.hurt = 0.25; f.L.atk = 1;
          f.beams.push({ from: 'L', life: 0.35, crit: c }); f.nums.push({ side: 'R', v: d, crit: c, imm: d === 0, life: 1, ox: (Math.random() - 0.5)*80 }); sfx.hit();
          if (dead(f, f.Rt, f.L)) { over = 1; break; }
          if (XA.includes('absorb') && !noHeal) f.Rt.hp = Math.min(f.Rt.st.hp, f.Rt.hp + d*0.3); // Absorb
        }
        if (over) { end(over === 1); break; }
        if (f.mech && !f.mechDone && f.Rt.hp < f.Rt.st.hp*0.5) { f.mechDone = true; if (!noHeal) f.Rt.hp = Math.min(f.Rt.st.hp, f.Rt.hp + f.Rt.st.hp*f.mech[0]); f.Rt.st = Object.assign({}, f.Rt.st, { atk: f.Rt.st.atk*f.mech[1] }); f.aBoost = 1;
          if (f.transformed) { flash('#ff4060', 0.5); sfx.transform(); bigBanner(T('awaken'), f.Rt.name, '#ff6a80'); } }
        if (f.kind !== 'pvp' && !f.transformed && f.Rt.hp < f.Rt.st.hp*0.5) { f.transformed = true; f.form = Math.min(BOSS_FORMS.length - 1, f.form + f.jump); f.aBoost = 1;
          f.Rt.name = bossName(f.B, f.form) + (f.nmTier ? ' · ' + ROMAN(f.nmTier) : ''); const FF = BOSS_FORMS[f.form]; flash(`hsl(${FF.h},${FF.s}%,${FF.l}%)`, 0.7); sfx.transform();
          bigBanner(T('transform'), f.Rt.name, `hsl(${FF.h},${FF.s}%,${Math.max(60, FF.l)}%)`); }
        if (AF.includes('enrage')) f.enr *= 1.06; if (AF.includes('regen') && !noHeal) f.Rt.hp = Math.min(f.Rt.st.hp, f.Rt.hp + f.Rt.st.hp*0.03);
        // right attacks (Twin Shadow also works for a PvP opponent)
        let over2 = 0, anyCrit = false;
        for (const mul of ((f.Rt.pas || []).includes('multi') ? [1, 0.5] : [1])) {
          let [d, c] = hitCalc(f.Rt.st, f.L.st, f.rng); d *= mul; if (c && AF.includes('crit')) d *= 1.2; d *= (f.enr || 1);
          if (mul === 1 && AF.includes('twin') && f.round % 3 === 0) d *= 2;
          d = pas(f, f.L, f.Rt, 'onTake', pas(f, f.Rt, f.L, 'onDeal', d, c), c);
          if (AF.includes('leech') && !noHeal) f.Rt.hp = Math.min(f.Rt.st.hp, f.Rt.hp + d*0.3);
          if (f.script !== undefined) { d *= f.script ? 0.8 : 1.3; if (f.script && f.L.hp - d <= 0) d = Math.max(0, f.L.hp - 1); } f.L.hp -= d; f.L.hurt = 0.25; f.Rt.atk = 1; anyCrit = anyCrit || c;
          f.beams.push({ from: 'R', life: 0.35, crit: c }); f.nums.push({ side: 'L', v: d, crit: c, life: 1, ox: (Math.random() - 0.5)*80 });
          if (dead(f, f.L, f.Rt)) { over2 = 2; break; }
          if (f.Rt.hp <= 0 && dead(f, f.Rt, f.L)) { over2 = 1; break; } // reflect damage
        }
        if (f.kind !== 'pvp' && anyCrit) flash('#300', 0.6); if (f.tower) f.shake = Math.min(14, 3 + f.tower.fl/8);
        if (over2) { end(over2 === 1); break; }
        pas(f, f.L, f.Rt, 'onTurn'); pas(f, f.Rt, f.L, 'onTurn');
        if (f.round >= 70) { end(f.script !== undefined ? f.script : f.kind === 'pvp' ? (f.L.hp/f.L.st.hp >= f.Rt.hp/f.Rt.st.hp) : false); break; }
      }
      return;
    }
    if (f.phase === 'end' && f.timer > 3.5) finishFight();
  }
  function end(leftWon){
    const f = fight; f.phase = 'end'; f.timer = 0; f.result = leftWon;
    if (f.kind !== 'pvp' && leftWon && f.B && S.bestiary && S.bestiary[f.B.id]) S.bestiary[f.B.id].k++;
    if (f.kind !== 'pvp') { if (leftWon) { sfx.win(); bigBanner(T('victory'), f.Rt.name, '#ffd76a'); } else { sfx.lose(); bigBanner(f.Rt.name, T('defeat'), '#f44', '', f.tower ? T('towerFloor').replace('{n}', f.tower.fl) : f.kind === 'rift' ? T('riftLose') : f.kind === 'roam' ? T('roamCD') : f.kind === 'mirror' ? T('mirrorLose') : f.kind === 'xeno' ? T('xenoLose') : T('bossLoseHint')); } }
    else { const iWon = (f.myRole === 'a') === leftWon; if (iWon) { S.pvpW++; save(); sfx.win(); } else sfx.lose(); bigBanner(iWon ? T('victory') : T('defeat'), `${leftWon ? f.L.name : f.Rt.name} 👑`, iWon ? '#ffd76a' : '#f44'); }
  }
  function finishFight(){
    const f = fight; fight = null; scene = 'world'; $('hud').classList.remove('dim'); $('fightUI').style.display = 'none'; $('fightHelp').style.display = 'none';
    if (f.kind === 'boss') { me.x = GATE.x; me.y = GATE.y + 200; if (f.result) { S.stats.bossWins = (S.stats.bossWins || 0) + 1;
      if (f.B.id === 'finalmirror') { S.stats.finalWins = (S.stats.finalWins || 0) + 1; const first = !S.ended; S.ended = true; save(); if (first) { playEnding(() => titleUp(true)); return; } }
      titleUp(true); } }
    else if (f.kind === 'xeno') { const i = f.riftI, B = XENO_BOSSES[i]; S.xcd = S.xcd || {}; S.xcd[i] = Date.now() + (f.result ? XENO_CD_WIN : XENO_CD_LOSE);
      if (B.at === 'gate') { me.x = XENO.gate[0]; me.y = XENO.gate[1] + 170; } else { const [ax, ay] = xenoAbs(XENO_SPOTS[B.at]); me.x = ax; me.y = ay + 200; }
      if (f.result && (S.xs || 0) === i) { S.xs = i + 1; const rw = xenoRewardText(B.reward); sfx.title(); flash('#40f0ff', 0.8);
        toast('🛸 ' + T('xenoFirst').replace('{n}', B[S.lang]).replace('{r}', rw), 7000);
        if (B.reward === 'open') { S.xenoOpen = 1; setTimeout(() => bigBanner('🛸 ' + T('xeno'), T('xenoOpen'), '#7ff8ff'), 600); }
        const pid = Object.keys(PASSIVES).find(k => PASSIVES[k].src === 'xeno:' + i); if (pid) { S.passives = S.passives || []; if (!S.passives.includes(pid) && S.passives.length < passiveSlots(S)) S.passives.push(pid); }
        pushLB(); }
      else if (f.result) { const got = F.xpRate(S, true, false, false) * SANCT_XP_SEC; addXP(got); S.xeno = S.xeno || { lv: 0, xp: 0 }; S.xeno.xp += XENO_NEED(S.xeno.lv)*0.5; toast('🛸 ' + T('xenoAgain').replace('{x}', fmt(got)), 4500); }
      save(); }
    else if (f.kind === 'sanct' && f.nmTier) { const sym = SYMBOLS.find(x => x.id === f.riftI); me.x = SANCTUM.x + sym.dx*0.6; me.y = SANCTUM.y + sym.dy*0.6 + 90; // v2.0 Nightmare
      S.sanctCD = S.sanctCD || {}; S.nm = S.nm || {}; S.sanctCD['nm_' + sym.id] = Date.now() + (f.result ? SANCT_CD_WIN : SANCT_CD_LOSE);
      if (f.result && f.nmTier > nmTier(S, sym.id)) { S.nm[sym.id] = f.nmTier; const pid = Object.keys(PASSIVES).find(k => PASSIVES[k].src === 'sanct:' + sym.id), P = PASSIVES[pid], pn = P[S.lang];
        const msg = f.nmTier === 1 ? T('nmUnlockPas').replace('{n}', P.ico + ' ' + pn) : f.nmTier <= PASSIVE_RANK_MAX ? T('nmRankUp').replace('{n}', P.ico + ' ' + pn).replace('{r}', f.nmTier) : T('nmRankMax').replace('{n}', P.ico + ' ' + pn);
        if (f.nmTier === 1) { S.passives = S.passives || []; if (!S.passives.includes(pid) && S.passives.length < passiveSlots(S)) S.passives.push(pid); }
        sfx.title(); flash('#300', 0.9); toast('👁 ' + T('nmFirst').replace('{n}', ROMAN(f.nmTier)).replace('{r}', msg), 7000);
        if (sym.center && f.nmTier === 1) setTimeout(() => toast('✦ ' + T('nmSlot'), 6000), 1500);
        const got = F.xpRate(S, true, false, false) * SANCT_XP_SEC; addXP(got); pushLB(); }
      save(); }
    else if (f.kind === 'sanct') { const sym = SYMBOLS.find(x => x.id === f.riftI), key = f.B.id; me.x = SANCTUM.x + sym.dx*0.6; me.y = SANCTUM.y + sym.dy*0.6 + 90;
      S.sanctCD = S.sanctCD || {}; S.sanct = S.sanct || {}; S.sanctCD[key] = Date.now() + (f.result ? SANCT_CD_WIN : SANCT_CD_LOSE);
      if (f.result) { if (!S.sanct[key]) { S.sanct[key] = 1; const pct = Math.round(SANCT_BONUS[f.B.cursed ? 'cursed' : 'normal'][sym.center ? 1 : 0]*100); sfx.title(); toast('⛩ ' + T('sanctFirst').replace('{p}', pct), 6000); }
        else { const got = F.xpRate(S, true, false, false) * SANCT_XP_SEC; addXP(got); toast('⛩ ' + T('sanctAgain').replace('{x}', fmt(got)), 4500); }
        pushLB(); }
      save(); }
    else if (f.kind === 'mirror') { me.x = MIRROR_GATE.x; me.y = MIRROR_GATE.y + 150; S.mirrorCD = Date.now() + (f.result ? MIRROR_CD_WIN : MIRROR_CD_LOSE);
      if (f.result) { S.stats.mirrorWins = (S.stats.mirrorWins || 0) + 1; const got = (S.shards||0) < MAX_SHARDS; if (got) S.shards = (S.shards||0) + 1; toast('🪞 ' + (got ? T('mirrorWin').replace('{p}', Math.round(SHARD_BONUS*100)) : T('mirrorWinMax')), 5000); pushLB(); }
      save(); }
    else if (f.kind === 'roam') { S.roamCD = S.roamCD || {}; S.roamCD[f.riftI] = Date.now() + (f.result ? ROAM_CD : RIFT_CD_LOSE); me.y += 120;
      if (f.result) { S.stats.roamWins = (S.stats.roamWins || 0) + 1; const got = F.xpRate(S, true, false, false) * ROAM_XP_SEC; addXP(got);
        const mark = Math.random() < 0.25 && (S.marks||0) < MAX_MARKS; if (mark) S.marks = (S.marks||0) + 1;
        toast('☠ ' + (mark ? T('roamWinMark') : T('roamWin')).replace('{x}', fmt(got)), 4500); sfx.lvl(); pushLB(); }
      save(); }
    else if (f.kind === 'rift') { const [rx, ry, rk] = RIFTS[f.riftI]; me.x = rx; me.y = ry + 160; S.riftCD = S.riftCD || {};
      S.riftCD[f.riftI] = Date.now() + (f.result ? RIFT_CD_WIN : RIFT_CD_LOSE);
      if (f.result) { S.stats.riftWins = (S.stats.riftWins || 0) + 1; const RK = RIFT_RANKS[rk]; const got = F.xpRate(S, true, false, false) * RK.xpSec; const ups = addXP(got);
        const markGot = (S.marks||0) < MAX_MARKS; if (markGot) S.marks = (S.marks||0) + 1;
        toast('⛩ ' + (markGot ? T('riftWin') : T('riftMaxMarks')).replace('{x}', fmt(got)), 4500); if (ups) sfx.lvl(); pushLB(); }
      save(); }
    else if (f.myRole === 'a') setTimeout(() => Net.duelRemove(f.did), 3000);
    refreshHUD(true);
  }

  // PvP protocol (v1.3: server time, persistent request card, queue while busy, 60s cooldown after refusal)
  const duels = {}; let pendingOut = null; const inbox = {}; let pendingStart = null;
  function snap(){ const s = myStats(); return { n: S.name, t: S.t, hp: s.hp, atk: s.atk, def: s.def, crit: s.crit, sk: S.sk, as: S.as, pas: activePassives(S), prank: passiveRanks(S), shards: S.shards || 0 }; }
  const pvpCDLeft = () => Math.max(0, (S.pvpCD || 0) - Date.now());
  function pvpCooldown(msg){ S.pvpCD = Date.now() + PVP_COOLDOWN; save(); if (msg) toast('⏳ ' + msg, 4000); }
  function challenge(targetId){
    if (pvpCDLeft() > 0) { toast('⏳ ' + T('pvpCooldown').replace('{t}', mmss(pvpCDLeft()))); return; }
    if (pendingOut) { toast('⚔ ' + T('pvpWaiting')); return; }
    const id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    pendingOut = { id, at: Date.now(), seen: false };
    Net.duelCreate(id, { a: S.id, b: targetId, st: 'req', sa: snap() }); toast('⚔ ' + T('pvpWaiting'));
  }
  function renderPvpCard(){
    const el = $('pvpCard'); const now = Net.now();
    for (const k in inbox) if (now - (inbox[k].ts || now) > PVP_REQ_TTL || duels[k] && duels[k].st !== 'req') delete inbox[k];
    const ids = Object.keys(inbox); if (!ids.length || scene !== 'world') { if (el.style.display !== 'none') el.style.display = 'none'; return; }
    const d = inbox[ids[0]], left = PVP_REQ_TTL - (now - (d.ts || now));
    const key = ids[0] + ':' + Math.ceil(left/1000) + S.lang;
    if (el.dataset.k === key) return; el.dataset.k = key; el.style.display = 'block';
    el.innerHTML = `<div class="pTitle">⚔ PvP</div><div class="big">${esc(T('pvpReq').replace('{n}', d.sa.n || '?'))}</div>
      <div class="${titleCss(d.sa.t)}" style="color:${titleColor(d.sa.t)};font-weight:800">${esc(tn(d.sa.t))}</div><div class="muted small">⏳ ${mmss(left)}</div>
      <div class="row"><button class="btn red" data-acc="${esc(ids[0])}">${T('accept')}</button><button class="btn" data-dec="${esc(ids[0])}">${T('decline')}</button></div>`;
    el.querySelector('[data-acc]').onclick = () => { const id = ids[0]; delete inbox[id]; Net.duelWrite(id, { st: 'acc', sb: snap(), seed: Math.floor(Math.random()*1e9) }); el.style.display = 'none'; el.dataset.k = ''; };
    el.querySelector('[data-dec]').onclick = () => { const id = ids[0]; delete inbox[id]; Net.duelWrite(id, { st: 'dec' }); el.style.display = 'none'; el.dataset.k = ''; };
  }
  function pvpTick(){
    renderPvpCard();
    if (pendingOut && Date.now() - pendingOut.at > PVP_REQ_TTL + 2000) { const id = pendingOut.id; pendingOut = null; Net.duelRemove(id); pvpCooldown(T('pvpTimeout')); }
    if (pendingStart && scene === 'world') { const p = pendingStart; pendingStart = null; if (Net.now() - (p.d.ts || 0) < PVP_REQ_TTL + 60000) startPvP(p.d, p.role); }
  }
  Net.on('duel', (id, d) => {
    if (!d) return; d.id = id; const prev = duels[id]; duels[id] = d;
    if (d.st === 'req' && d.b === S.id && !inbox[id] && (!prev || prev.st !== 'req') && Net.now() - (d.ts || Net.now()) < PVP_REQ_TTL) {
      inbox[id] = d; sfx.find(); Net.duelWrite(id, { seen: 1 });
      if (scene !== 'world') toast('⚔ ' + esc(T('pvpReq').replace('{n}', (d.sa && d.sa.n) || '?')));
    }
    if (d.a === S.id && d.seen && pendingOut && pendingOut.id === id && !pendingOut.seen) { pendingOut.seen = true; const o = others[d.b]; toast('📨 ' + esc(T('pvpSeen').replace('{n}', o ? o.n : '?'))); }
    if (d.st === 'acc' && d.sb && d.sa && (!prev || prev.st !== 'acc')) {
      const role = d.a === S.id ? 'a' : d.b === S.id ? 'b' : null; if (!role) return;
      if (role === 'a') pendingOut = null;
      if (scene === 'world') startPvP(d, role); else pendingStart = { d, role };
    }
    if (d.st === 'dec' && d.a === S.id && pendingOut && pendingOut.id === id) { pendingOut = null; Net.duelRemove(id); pvpCooldown(T('pvpDeclinedCD')); }
  });

  // ---------------- Picking ----------------
  const w2s = (x, y) => [(x - cam.x)*cam.z + W/2, (y - cam.y)*cam.z*R.SQ + H/2];
  function pickPlayer(sx, sy){
    let best = null, bd = 50*cam.z;
    for (const id in others) { const o = others[id]; const [px, py] = w2s(o.x, o.y); const d = Math.hypot(sx - px, sy - (py - 35*cam.z)); if (d < bd) { bd = d; best = Object.assign({ id }, o); } }
    return best;
  }

  // ---------------- Update ----------------
  let saveT = 0, lbT = 0, announcedEv = -1; const roamFx = {}; const mirrorCh = { fx: {}, seed: 9 };
  // ---------------- v2.1 Hư Tinh Đảo ----------------
  const onXeno = () => S.xenoOpen && xenoOn(me.x, me.y);
  let xenoRes = 1;
  function xenoTick(dt){
    if (scene !== 'world' || !onXeno()) return; S.xeno = S.xeno || { lv: 0, xp: 0 };
    let n = 0; for (const id in others) { const o = others[id]; if (xenoOn(o.x, o.y) && Math.hypot(o.x - me.x, o.y - me.y) < 600) n++; }
    xenoRes = 1 + XENO_RATE.resPer*Math.min(XENO_RATE.resMax, n);
    S.xeno.xp += XENO_RATE.base*(me.moving ? XENO_RATE.moving : 1)*(xenoInCrater(me.x, me.y) ? XENO_RATE.crater : 1)*xenoRes*dt;
    let up = 0; while (S.xeno.xp >= XENO_NEED(S.xeno.lv)) { S.xeno.xp -= XENO_NEED(S.xeno.lv); S.xeno.lv++; up++; }
    if (up) { sfx.lvl(); floaters.push({ x: me.x, y: me.y, txt: '🛸 ' + T('xenoLv').replace('{n}', S.xeno.lv), c: '#7ff8ff', life: 1.6 }); toast('🛸 ' + T('xenoUp').replace('{n}', S.xeno.lv), 3000); save(); Net.sendMe(meNet(), true); }
  }
  const xenoAbs = ([a, b]) => [XENO.x + a, XENO.y + b];
  function xenoTargetIdx(where){ const xs = S.xs || 0; if (where === 'gate') return xs === 0 ? 0 : -1; if (where === 'spire') return xs >= 5 ? 5 : -2; return Math.max(1, Math.min(xs, 4)); }
  const xenoReady = i => Date.now() >= ((S.xcd || {})[i] || 0);
  function xenoRewardText(r){ if (r === 'open') return T('xenoOpen'); if (r === 'slot') return '✦ ' + T('xenoSlot'); if (r === 'aura') return '🎭 ' + byId(AURA_SKINS, 'xenoaura')[S.lang] + ' · ' + byId(NICKS, 'visitor')[S.lang];
    const P = PASSIVES[r]; return P ? T('nmUnlockPas').replace('{n}', P.ico + ' ' + P[S.lang]) : ''; }
  function startXeno(i){ const B = XENO_BOSSES[i], st = F.boss(B.ref);
    beginBossFight({ kind: 'xeno', i, g: S.t, mechG: B.ref, B, st, form: 11, jump: 1 }); }
  function canStand(x, y){
    if (Math.abs(x) <= R.WORLD && Math.abs(y) <= R.WORLD) return true;
    if (S.xenoOpen) { if (Math.abs(x - XENO.x) <= XENO.road && y <= -R.WORLD + 200 && y >= XENO.y + 1600) return true; if (xenoOn(x, y)) return true; } // v2.1 bridge + Xeno Isle
    if (!S.sanctOpen) return false;
    if (x >= R.WORLD - 200 && x <= SANCTUM.x && Math.abs(y - SANCTUM.y) <= SANCTUM.road) return true;
    return Math.hypot(x - SANCTUM.x, y - SANCTUM.y) <= SANCTUM.radius;
  }
  function updateWorld(dt){
    let dx = 0, dy = 0;
    if (keys['w'] || keys['arrowup']) dy -= 1; if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1; if (keys['d'] || keys['arrowright']) dx += 1;
    if (joy.on && Math.hypot(joy.dx, joy.dy) > 8) { dx = joy.dx/60; dy = joy.dy/60; }
    const m = Math.hypot(dx, dy); me.moving = m > 0.1; const prevX = me.x, prevY = me.y;
    if (me.moving) { const sp = F.speed(S.t); me.x += dx/Math.max(1, m)*sp*dt; me.y += dy/Math.max(1, m)*sp*dt; S.stats.dist = (S.stats.dist || 0) + sp*dt*Math.min(1, m); if (Math.abs(dx) > 0.1) me.face = dx > 0 ? 1 : -1; me.phase += dt*11; }
    if (!canStand(me.x, me.y)) { if (canStand(me.x, prevY)) me.y = prevY; else if (canStand(prevX, me.y)) me.x = prevX; else { me.x = prevX; me.y = prevY; } }
    if (!canStand(me.x, me.y)) { me.x = Math.max(-R.WORLD, Math.min(R.WORLD, me.x)); me.y = Math.max(-R.WORLD, Math.min(R.WORLD, me.y)); }
    xenoTick(dt);
    gainXP(dt);
    // discoveries
    WELLS.forEach(([x, y], i) => { if (!S.wells.includes(i) && Math.hypot(me.x - x, me.y - y) < 80) { S.wells.push(i); save(); sfx.find(); toast('💧 ' + T('wellFound')); } });
    STELAE.forEach(([x, y], i) => { if (!S.stelae.includes(i) && Math.hypot(me.x - x, me.y - y) < 60) { S.stelae.push(i); save(); sfx.find(); toast(`🗿 ${T('stoneFound')}<br><i>${esc(STELAE_LORE[i][S.lang])}</i>`, 7000); } });
    // v1.1 event gate + rift discovery
    const ev = eventAt(Date.now());
    if (ev.active && S.buffEv !== ev.idx) {
      if (announcedEv !== ev.idx) { announcedEv = ev.idx; sfx.find(); toast('✨ ' + esc(T('eventSpawn').replace('{n}', ev.type[S.lang])), 6000); }
      if (Math.hypot(me.x - ev.x, me.y - ev.y) < 95) { S.buffEv = ev.idx; S.stats.events = (S.stats.events || 0) + 1; S.buffUntil = Date.now() + ev.type.min*60000; if (ev.type.resetRifts) { S.riftCD = {}; setTimeout(()=>toast('🩸 ' + T('riftsReset')), 1500); }
        save(); sfx.event(); flash(`hsl(${ev.type.h},100%,70%)`, 0.9); bigBanner(ev.type[S.lang], '×5', `hsl(${ev.type.h},100%,70%)`, '', T('eventGot').replace('{m}', ev.type.min)); }
    }
    if (!S.sanctSeen && Math.hypot(me.x - SANCTUM.gate[0], me.y - SANCTUM.gate[1]) < 700) { S.sanctSeen = 1; save(); }
    if (!S.sanctOpen && S.best >= SANCTUM.unlockTitle && Math.hypot(me.x - SANCTUM.gate[0], me.y - SANCTUM.gate[1]) < 110) { S.sanctOpen = 1; save(); sfx.title(); flash('#ffe9a0', 0.8); bigBanner('⛩ ' + T('sanctum'), T('sanctRoad'), '#ffd98a'); }
    { const near = sanctCursedOpen(S) && Math.hypot(me.x - SANCTUM.x, me.y - SANCTUM.y) < 800, el = $('sanctBtn'); if (el.style.display !== (near ? 'block' : 'none')) el.style.display = near ? 'block' : 'none';
      if (near) { if (S.sanctMode === 'nightmare' && !nmOpen(S)) S.sanctMode = 'cursed'; const lbl = S.sanctMode === 'nightmare' ? '👁 ' + T('sanctNM') : '⛩ ' + (S.sanctMode === 'cursed' ? T('sanctCursedOn') : T('sanctNormal')); if (el.textContent !== lbl) el.textContent = lbl; el.classList.toggle('red', S.sanctMode !== 'normal'); } }
    { const on = onXeno(), xl = (S.xeno || {}).lv || 0, el = $('hXeno'), show = S.xenoOpen && (on || xl > 0); if (el.style.display !== (show ? 'block' : 'none')) el.style.display = show ? 'block' : 'none';
      if (show) { const tx = '🛸 ' + T('xenoLv').replace('{n}', xl); if ($('hXenoLv').textContent !== tx) $('hXenoLv').textContent = tx;
        const info = on ? [xenoInCrater(me.x, me.y) ? T('xenoCrater') : '', xenoRes > 1 ? T('xenoRes').replace('{n}', xenoRes.toFixed(2)) : ''].filter(Boolean).join(' · ') : ''; if ($('hXenoInfo').textContent !== info) $('hXenoInfo').textContent = info;
        $('xenoFill').style.width = Math.min(100, ((S.xeno || {}).xp || 0)/XENO_NEED(xl)*100) + '%'; }
      const offMap = Math.abs(me.x) > R.WORLD || Math.abs(me.y) > R.WORLD, nearGate = S.xenoOpen && Math.hypot(me.x - XENO.gate[0], me.y - XENO.gate[1]) < 260;
      const mode = S.xenoOpen && me.y < -R.WORLD && offMap ? 'back' : nearGate ? 'go' : '', b = $('xenoBtn');
      if (b.style.display !== (mode ? 'block' : 'none')) b.style.display = mode ? 'block' : 'none'; if (mode) { const l = mode === 'back' ? T('xenoBack') : T('xenoGo'); if (b.textContent !== l) b.textContent = l; b.dataset.m = mode; } }
    RIFTS.forEach(([x, y], i) => { S.riftSeen = S.riftSeen || []; if (!S.riftSeen.includes(i) && Math.hypot(me.x - x, me.y - y) < 700) { S.riftSeen.push(i); save(); } });
    // others
    for (const id in others) { const o = others[id]; const ox = o.x, oy = o.y; o.x += (o.tx - o.x)*Math.min(1, dt*10); o.y += (o.ty - o.y)*Math.min(1, dt*10);
      o.moving = !!o.mv; o.face = o.f; if (o.moving) o.phase = (o.phase||0) + dt*11; }
    Net.sendMe(meNet());
    if (S.trans && S.transRate > 0) { S.Ef = (S.Ef || 0) + S.transRate/3600*dt*(me.moving ? 1 : TRANS.stand); if (S.Ef >= 1) { const k = Math.floor(S.Ef); S.E += k; S.Ef -= k; } } // v2.2 Essence flows with aura
    { const el = $('hTrans'), txt = S.trans ? T('transHud').replace('{x}', fmt(S.transRate*(me.moving ? 1 : TRANS.stand))) + ` · 💠 ${fmt(S.E)}` : ''; if (el.textContent !== txt) { el.textContent = txt; el.style.display = txt ? 'block' : 'none'; } }
    { const [ax, ay] = xenoAbs(XENO_SPOTS.core), show = !S.trans && onXeno() && Math.hypot(me.x - ax, me.y - ay) < 420, b = $('transBtn'); if (b.style.display !== (show ? 'block' : 'none')) { b.style.display = show ? 'block' : 'none'; b.textContent = T('transDo'); } }
    S.playSec += dt; saveT += dt; lbT += dt;
    if (saveT > 5) { saveT = 0; save(); } if (lbT > 20) { lbT = 0; pushLB(); }
  }

  // ---------------- Draw world ----------------
  function drawWorld(dt){
    const tz = Math.max(0.62, 1 - tierOf(S.t)*0.035) * (W < 700 ? 0.8 : 1);
    cam.z += (tz - cam.z)*Math.min(1, dt*2);
    cam.x += (me.x - cam.x)*Math.min(1, dt*6); cam.y += (me.y - cam.y)*Math.min(1, dt*6);
    let shx = 0, shy = 0; if (me.shake) { shx = (Math.random() - 0.5)*me.shake*2; shy = (Math.random() - 0.5)*me.shake*2; }
    ctx.save(); ctx.translate(shx, shy);
    R.drawGround(ctx, cam, W, H);
    // collect drawables sorted by y
    const list = [];
    const vis = (x, y, pad=300) => Math.abs(x - cam.x) < W/2/cam.z + pad && Math.abs(y - cam.y) < H/2/cam.z/R.SQ + pad;
    WELLS.forEach(([x, y], i) => { if (vis(x, y)) list.push({ y: y - 60, f: () => { const [sx, sy] = w2s(x, y); R.well(ctx, sx, sy, cam.z, time, S.wells.includes(i)); } }); });
    for (const d of DECOR) if (vis(d.x, d.y)) list.push({ y: d.y, f: () => { const [sx, sy] = w2s(d.x, d.y); R.decor(ctx, d, sx, sy, cam.z, time); } });
    STELAE.forEach(([x, y], i) => { if (vis(x, y)) list.push({ y, f: () => { const [sx, sy] = w2s(x, y); R.stele(ctx, sx, sy, cam.z, time, S.stelae.includes(i), Math.hypot(me.x - x, me.y - y) < 200); } }); });
    RIFTS.forEach(([x, y, rk], i) => { if (vis(x, y, 300)) list.push({ y, f: () => { const [sx, sy] = w2s(x, y); const rd = riftReady(i);
      R.rift(ctx, sx, sy, cam.z, time, rk, rd, `⛩ ${T('riftGate')} · ${RIFT_RANKS[rk][S.lang]}`, rd ? '' : T('riftCD').replace('{t}', mmss(S.riftCD[i] - Date.now()))); } }); });
    { const pool = unlockedBosses(S.t), now = Date.now(); for (let i = 0; i < ROAMERS.length; i++) { const r = roamerAt(i, now, pool); if (now < ((S.roamCD || {})[i] || 0) || !vis(r.x, r.y, 300)) continue;
      list.push({ y: r.y, f: () => { const [sx, sy] = w2s(r.x, r.y); const sz = 120*cam.z; const fi = Math.min(8, 1 + Math.floor(tierOf(S.t)*0.8));
        ctx.save(); ctx.globalAlpha = 0.92; R.bossAura(ctx, sx, sy, sz, time + i, fi, 0); ctx.translate(sx, sy); if (r.face < 0) ctx.scale(-1, 1);
        R.boss(ctx, r.B.id, 0, 0, sz, time + i*3, { hue: r.B.hue, hurt: 0, atk: 0, g: S.t, target: [-300, -50], fx: (roamFx[i] = roamFx[i] || {}) }); ctx.restore();
        ctx.textAlign = 'center'; ctx.font = `700 ${Math.max(10, 12*cam.z)}px ${FONT}`; ctx.fillStyle = '#d9a6ff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 5;
        ctx.fillText(`☠ ${S.lang === 'vi' ? r.B.vi : r.B.en}`, sx, sy - sz*1.25 - 8); ctx.shadowBlur = 0; } }); } }
    mirrorCh.t = S.t; mirrorCh.sk = S.sk; mirrorCh.as = S.as;
    { const xo = S.xenoOpen, [gx, gy] = XENO.gate, nearIsle = vis(XENO.x, XENO.y, 3400); // v2.1 Xeno Isle
      if (xo && nearIsle) list.push({ y: -1e9 - 3, f: () => R.xenoBackdrop(ctx, w2s, cam.z, XENO.x, XENO.y, time, W, H) });
      if (xo && vis(XENO.x, (gy + XENO.y)/2, 3000)) list.push({ y: -1e9 - 2, f: () => R.xenoBridge(ctx, w2s, cam.z, XENO.x, -R.WORLD + 100, XENO.y + 1640, XENO.road, time) });
      if (xo && nearIsle) list.push({ y: -1e9 - 1, f: () => R.xenoIsland(ctx, w2s, cam.z, XENO.x, XENO.y, time) });
      if (vis(gx, gy, 500)) list.push({ y: gy, f: () => { const [sx, sy] = w2s(gx, gy), st = S.best < MAX_TITLE ? 'locked' : xo ? 'open' : 'ready';
        R.xenoGate(ctx, sx, sy, cam.z, time, st, st === 'locked' ? '🛸 ???' : '🛸 ' + (xo ? T('xeno') : T('xenoGate') + ' · ' + XENO_BOSSES[0][S.lang] + (xenoReady(0) ? '' : ' · ' + T('sanctCD').replace('{t}', mmss(S.xcd[0] - Date.now()))))); } });
      if (xo) for (const w of ['core', 'spire']) { const [ax, ay] = xenoAbs(XENO_SPOTS[w]); if (!vis(ax, ay, 500)) continue;
        list.push({ y: ay, f: () => { const [sx, sy] = w2s(ax, ay), i = xenoTargetIdx(w), xs = S.xs || 0, B = i >= 0 ? XENO_BOSSES[i] : null;
          const st = !B ? 'locked' : !xenoReady(i) ? 'cd' : xs > i ? 'done' : 'ready';
          const sub = !B ? T('xenoSpireLocked') : st === 'cd' ? T('sanctCD').replace('{t}', mmss(S.xcd[i] - Date.now())) : `${B[S.lang]} · ${B.aff.map(id => (XAFFIXES.find(a => a.id === id) || AFFIXES.find(a => a.id === id) || {}).ico || '').join('')}${xs > i ? ' ✔' : ''}`;
          R.xenoSpot(ctx, sx, sy, cam.z, time, w, st, '🛸 ' + T(w === 'core' ? 'xenoCore' : 'xenoSpire'), sub); } }); } }
    { const open = S.best >= SANCTUM.unlockTitle, road = !!S.sanctOpen, cur = sanctNM() ? 2 : sanctCursed(), [gx, gy] = SANCTUM.gate;
      if (road && vis((gx + SANCTUM.x)/2, gy, 1800)) list.push({ y: -1e9, f: () => { R.sanctumRoad(ctx, w2s, cam.z, gx, SANCTUM.x - SANCTUM.radius + 60, gy, time); } });
      if (road && vis(SANCTUM.x, SANCTUM.y, 900)) list.push({ y: -1e9 + 1, f: () => { const [sx, sy] = w2s(SANCTUM.x, SANCTUM.y); R.sanctumFloor(ctx, sx, sy, cam.z, time, cur); } });
      if (vis(gx, gy, 300)) list.push({ y: gy, f: () => { const [sx, sy] = w2s(gx, gy); R.sanctumGate(ctx, sx, sy, cam.z, time, open, open ? `⛩ ${T('sanctum')}` : '⛩ ???'); } });
      for (const sym of SYMBOLS) { const x = SANCTUM.x + sym.dx, y = SANCTUM.y + sym.dy; if (!road || !vis(x, y, 300)) continue;
        list.push({ y, f: () => { const [sx, sy] = w2s(x, y), st = sanctState(sym), B = sanctBossOf(sym), key = cur === 2 ? 'nm_' + sym.id : B.id, nk = nmTier(S, sym.id) + 1;
          const sub = cur === 2 && st === 'locked' ? T('nmDragonLocked').replace('{n}', ROMAN(nk)) : st === 'locked' ? (S.best < SANCTUM.unlockTitle ? T('sanctLocked') : T('sanctDragonLocked')) : st === 'cd' ? T('sanctCD').replace('{t}', mmss(S.sanctCD[key] - Date.now())) : (cur === 2 ? '👁 ' + T('nmTier').replace('{n}', ROMAN(nk)) + ' · ' : '') + (B.trait ? TRAITS[B.trait].ico + ' ' + TRAITS[B.trait][S.lang] + ' · ' : '') + ['☠☠☠', '☠☠', '☠', '✓'][sanctThreat(sym)] + ' ' + T('threat')[sanctThreat(sym)];
          R.sanctumPedestal(ctx, sx, sy, cam.z, time, sym.id, st === 'cd' && cur !== 2 && S.sanct[key] ? 'done' : st, B[S.lang], sub, cur); } }); } }
    if (vis(MIRROR_GATE.x, MIRROR_GATE.y, 300)) list.push({ y: MIRROR_GATE.y, f: () => { const [sx, sy] = w2s(MIRROR_GATE.x, MIRROR_GATE.y); const rd = Date.now() >= (S.mirrorCD || 0);
      R.mirrorGate(ctx, sx, sy, cam.z, time, rd, `🪞 ${T('mirrorGate')}`, rd ? T('mirrorChance').replace('{p}', Math.round(mirrorChance(S)*100)) : T('mirrorCD').replace('{t}', mmss(S.mirrorCD - Date.now())), mirrorCh); } });
    const evw = eventAt(Date.now()); if (evw.active && vis(evw.x, evw.y, 500)) list.push({ y: evw.y, f: () => { const [sx, sy] = w2s(evw.x, evw.y); R.eventGate(ctx, sx, sy, cam.z, time, evw, evw.type[S.lang], S.buffEv === evw.idx); } });
    if (vis(GATE.x, GATE.y, 500)) list.push({ y: GATE.y, f: () => { const [sx, sy] = w2s(GATE.x, GATE.y); R.gate(ctx, sx, sy, cam.z, time, capped()); } });
    for (const id in others) { const o = others[id]; if (!vis(o.x, o.y)) continue; list.push({ y: o.y, f: () => { const [sx, sy] = w2s(o.x, o.y); if (o.xl) R.xenoAura(ctx, sx, sy, cam.z*1.25, o.xl, time); R.character(ctx, sx, sy, cam.z*1.25, o, time); nameTag(sx, sy, o.n, o.t, false, o.nk); } }); }
    list.push({ y: me.y, f: () => { const [sx, sy] = w2s(me.x, me.y); if ((S.xeno || {}).lv) R.xenoAura(ctx, sx, sy, cam.z*1.25, S.xeno.lv, time); R.character(ctx, sx, sy, cam.z*1.25, Object.assign(me, { t: S.t, sk: S.sk, as: S.as }), time); nameTag(sx, sy, S.name, S.t, true, S.nk); } });
    list.sort((a, b) => a.y - b.y); list.forEach(o => o.f());
    // floaters
    floaters = floaters.filter(f => (f.life -= dt) > 0); ctx.textAlign = 'center'; ctx.font = `bold 14px ${FONT}`;
    for (const f of floaters) { const [sx, sy] = w2s(f.x, f.y); ctx.fillStyle = f.c; ctx.globalAlpha = Math.min(1, f.life); ctx.fillText(f.txt, sx, sy - 110*cam.z - (1.2 - f.life)*40); } ctx.globalAlpha = 1;
    ctx.restore();
    // vignette
    const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W, H)*0.35, W/2, H/2, Math.max(W, H)*0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    // gate arrow when capped
    const arrow = (wx, wy, col) => { const [gx, gy] = w2s(wx, wy); if (gx >= 0 && gx <= W && gy >= 0 && gy <= H) return; const a = Math.atan2(gy - H/2, gx - W/2); const r = Math.min(W, H)*0.38;
      ctx.save(); ctx.translate(W/2 + Math.cos(a)*r, H/2 + Math.sin(a)*r); ctx.rotate(a); ctx.globalAlpha = 0.6 + Math.sin(time*5)*0.3; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-10, -13); ctx.lineTo(-4, 0); ctx.lineTo(-10, 13); ctx.fill(); ctx.restore(); };
    if (capped()) arrow(GATE.x, GATE.y, '#ff3232');
    if (evw.active && S.buffEv !== evw.idx) arrow(evw.x, evw.y, `hsl(${evw.type.h},100%,65%)`);
    drawMinimap();
  }
  function nameTag(sx, sy, n, t, isMe, nk){
    const y = sy - 125*cam.z - Math.min(70, tierOf(t)*6)*cam.z;
    ctx.textAlign = 'center'; ctx.font = `${Math.max(10, 11*cam.z)}px ${FONT}`; const tw = Math.max(ctx.measureText(tn(t)).width, n.length*8*cam.z) + 14;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(sx - tw/2, y - 14*cam.z, tw, 32*cam.z, 6) : ctx.rect(sx - tw/2, y - 14*cam.z, tw, 32*cam.z); ctx.fill();
    ctx.font = `bold ${Math.max(10, 12*cam.z)}px ${FONT}`; ctx.fillStyle = isMe ? '#fff' : '#ddd'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.fillText(n, sx, y); ctx.font = `${Math.max(10, 11*cam.z)}px ${FONT}`; ctx.fillStyle = R.auraStyle(t).rainbow ? `hsl(${(time*90)%360},100%,70%)` : titleColor(t); ctx.fillText(tn(t), sx, y + 14*cam.z);
    if (nk && nk !== 'none') { ctx.font = `italic 700 ${Math.max(10, 11*cam.z)}px ${FONT}`; ctx.fillStyle = '#ffd98a'; ctx.fillText(`「${byId(NICKS, nk)[S.lang]}」`, sx, y - 19*cam.z); }
    ctx.shadowBlur = 0;
  }
  function drawMinimap(){
    const s = mm.width, k = s/(R.WORLD*2); mctx.fillStyle = 'rgba(8,6,12,0.85)'; mctx.fillRect(0, 0, s, s);
    const p = (x, y) => [(x + R.WORLD)*k, (y + R.WORLD)*k];
    mctx.fillStyle = '#f33'; let [x, y] = p(GATE.x, GATE.y); mctx.fillRect(x - 3, y - 3, 6, 6);
    if (S.best >= MAX_TITLE) { const [a, b] = p(XENO.gate[0], XENO.gate[1]); mctx.fillStyle = '#40f0ff'; mctx.font = 'bold 10px serif'; mctx.textAlign = 'center'; mctx.fillText('🛸', a, b + 6); }
    S.wells.forEach(i => { const [a, b] = p(...WELLS[i]); mctx.fillStyle = '#6fe'; mctx.beginPath(); mctx.arc(a, b, 3, 0, 7); mctx.fill(); });
    S.stelae.forEach(i => { const [a, b] = p(...STELAE[i]); mctx.fillStyle = '#ca6'; mctx.fillRect(a - 1.5, b - 1.5, 3, 3); });
    if (S.sanctSeen) { const [a, b] = p(SANCTUM.gate[0], SANCTUM.gate[1]); mctx.fillStyle = sanctCursed() ? '#ff2a60' : '#ffd040'; mctx.font = 'bold 10px serif'; mctx.textAlign = 'center'; mctx.fillText('⛩', a, b + 4); }
    { const [a, b] = p(MIRROR_GATE.x, MIRROR_GATE.y); mctx.fillStyle = Date.now() >= (S.mirrorCD || 0) ? '#ff6a80' : '#555'; mctx.beginPath(); mctx.ellipse(a, b, 2.5, 4, 0, 0, 7); mctx.fill(); }
    (S.riftSeen || []).forEach(i => { const [a, b] = p(RIFTS[i][0], RIFTS[i][1]); mctx.fillStyle = riftReady(i) ? RIFT_RANKS[RIFTS[i][2]].c : '#555'; mctx.save(); mctx.translate(a, b); mctx.rotate(Math.PI/4); mctx.fillRect(-3, -3, 6, 6); mctx.restore(); });
    { const pool = unlockedBosses(S.t), now = Date.now(); for (let i = 0; i < ROAMERS.length; i++) { const r = roamerAt(i, now, pool); if (now < ((S.roamCD || {})[i] || 0) || Math.hypot(r.x - me.x, r.y - me.y) > 1400) continue;
      const [a, b] = p(r.x, r.y); mctx.fillStyle = '#b060ff'; mctx.font = '9px sans-serif'; mctx.textAlign = 'center'; mctx.fillText('☠', a, b + 3); } }
    const ev = eventAt(Date.now()); if (ev.active && S.buffEv !== ev.idx) { const [a, b] = p(ev.x, ev.y); mctx.fillStyle = `hsl(${ev.type.h},100%,65%)`; mctx.beginPath(); mctx.arc(a, b, 4 + Math.sin(time*6)*1.5, 0, 7); mctx.fill(); }
    for (const id in others) { const [a, b] = p(others[id].x, others[id].y); mctx.fillStyle = titleColor(others[id].t); mctx.fillRect(a - 2, b - 2, 4, 4); }
    [x, y] = p(me.x, me.y); mctx.fillStyle = '#fff'; mctx.beginPath(); mctx.arc(x, y, 3.5, 0, 7); mctx.fill();
    mctx.strokeStyle = 'rgba(255,255,255,0.2)'; mctx.strokeRect(0.5, 0.5, s - 1, s - 1);
  }

  // ---------------- Draw fight ----------------
  function drawFight(dt){
    const f = fight, boss = f.kind !== 'pvp';
    // background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    if (boss) { bg.addColorStop(0, '#000'); bg.addColorStop(0.6, `hsl(${f.hue},40%,5%)`); bg.addColorStop(1, `hsl(${f.hue},50%,9%)`); }
    else { bg.addColorStop(0, '#07060f'); bg.addColorStop(1, '#1a1530'); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const floorY = H*0.78;
    ctx.save(); if (f.shake > 0) { ctx.translate((Math.random() - 0.5)*f.shake, (Math.random() - 0.5)*f.shake); f.shake = Math.max(0, f.shake - dt*30); }
    if (f.tower) R.towerArena(ctx, W, H, floorY, f.tower.fl, time, f.tower.guardian);
    // floor perspective lines
    ctx.strokeStyle = boss ? `hsla(${f.hue},60%,30%,0.25)` : 'rgba(150,140,255,0.15)'; ctx.lineWidth = 1;
    for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W/2 + i*30, floorY - 70); ctx.lineTo(W/2 + i*W*0.12, H); ctx.stroke(); }
    for (let i = 0; i < 8; i++) { const y = floorY - 70 + Math.pow(i/8, 2)*(H - floorY + 70); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const sc = Math.min(W, H)/520;
    const lx = W*0.24, rx = W*0.72;
    // boss / right side
    if (boss) {
      const S0_ = Math.min(H*(f.tower ? 0.72 : 0.62), W*(f.tower ? 0.5 : 0.45)) * (f.tower ? Math.min(1.12, 0.9 + f.tower.fl/150) * (f.tower.guardian ? 1.12 : 1) : (0.85 + subOf(f.g)/20*0.25) * (isRealmEnd(f.g) ? 1.15 : 1));
      const S_ = Math.min(S0_, floorY*0.74);
      // fog
      for (let i = 0; i < 4; i++) { const fx = (time*20*(i + 1) + i*300) % (W + 400) - 200; const g = ctx.createRadialGradient(fx, floorY - 40, 0, fx, floorY - 40, 260); g.addColorStop(0, `hsla(${f.hue},70%,20%,0.18)`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(fx - 260, floorY - 300, 520, 520); }
      const lunge = f.Rt.atk > 0 ? -f.Rt.atk*40 : 0;
      const flicker = Math.random() < 0.03 ? 0.2 : 1;
      ctx.globalAlpha = f.phase === 'intro' ? Math.min(1, f.timer/2.5) * flicker : (f.phase === 'end' && f.result === true ? Math.max(0, 1 - f.timer/1.8) : flicker);
      f.aBoost = Math.max(0, f.aBoost - dt*0.5);
      if (f.B.id === 'finalmirror') { // v1.6: the reflection replays every realm you walked through, one per 10% HP lost
        const ph = Math.max(0, Math.min(9, Math.floor((1 - Math.max(0, f.Rt.hp)/f.Rt.st.hp)*10))), ti = Math.round(ph*UNL/9);
        const tShow = ti >= UNL ? MAX_TITLE + 1 : realmStart(ti) + realmSize(ti) - 1;
        if (ph !== f.memPhase) { f.memPhase = ph; f.Rt.fx = {}; f.memT = 2.2; f.memName = TIERS[ti][S.lang]; if (ph > 0) { flash(titleColor(tShow), 0.6); sfx.transform(); } }
        R.character(ctx, rx + lunge*0.5, floorY, sc*1.45, { t: tShow, sk: S.sk, as: 'realm', face: -1, fx: f.Rt.fx, mirror: true, seed: 7, moving: false }, time);
        if (f.memT > 0) { f.memT -= dt; ctx.save(); ctx.globalAlpha = Math.min(1, f.memT); ctx.textAlign = 'center'; ctx.font = `800 ${Math.max(16, 22*sc)}px ${FONT}`; ctx.fillStyle = titleColor(tShow); ctx.shadowColor = '#000'; ctx.shadowBlur = 8;
          ctx.fillText('🪞 ' + T('memory').replace('{r}', f.memName), rx, floorY - 290*sc); ctx.restore(); }
      } else
      if (f.kind === 'mirror') { R.character(ctx, rx + lunge*0.5, floorY, sc*1.3, { t: S.t, sk: S.sk, as: S.as, face: -1, fx: f.Rt.fx, mirror: true, seed: 7, moving: false }, time); } else {
      ctx.save(); ctx.globalAlpha *= 1; R.bossAura(ctx, rx + lunge, floorY, S_, time, f.form, Math.max(f.aBoost, f.towerBoost || 0)); ctx.restore();
      R.boss(ctx, f.B.id, rx + lunge, floorY, S_, time, { hue: f.hue, hurt: f.Rt.hurt, atk: f.Rt.atk, g: f.g, target: [lx - rx, -S_*0.3], fx: f.Rt.fx }); }
      ctx.globalAlpha = 1;
      if (f.Rt.hurt > 0) burn(rx, floorY - S_*0.5, S_*0.3);
      if (f.result === true && f.phase === 'end' && f.timer < 1.8) burn(rx, floorY - S_*0.5, S_*0.5);
    } else {
      R.character(ctx, rx - (f.Rt.atk > 0 ? f.Rt.atk*30 : 0), floorY, sc*1.3, { t: f.Rt.t, moving: false, fx: f.Rt.fx, face: -1, seed: 2, sk: f.Rt.sk, as: f.Rt.as }, time);
    }
    // left = player / challenger
    R.character(ctx, lx + (f.L.atk > 0 ? f.L.atk*30 : 0), floorY, sc*1.3, { t: f.L.t, moving: false, fx: f.L.fx, face: 1, seed: 1, sk: f.L.sk, as: f.L.as }, time);
    if (f.L.hurt > 0) { ctx.fillStyle = 'rgba(255,0,0,0.12)'; ctx.fillRect(0, 0, W, H); }
    // beams
    f.beams = f.beams.filter(b => (b.life -= dt) > 0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const b of f.beams) { const fromL = b.from === 'L'; const x0 = fromL ? lx + 20 : rx - 20, x1 = fromL ? rx : lx; const y0 = floorY - 60*sc, y1 = floorY - (fromL && boss ? H*0.25 : 60*sc);
      const col = fromL ? R.auraColor(f.L.t, time, null, f.L.fx.A) : (boss ? `hsl(${f.hue},100%,45%)` : R.auraColor(f.Rt.t, time, null, f.Rt.fx.A)); const w_ = (b.crit ? 14 : 6)*sc*(b.life/0.35);
      ctx.strokeStyle = col; ctx.lineWidth = w_; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(x0, y0);
      for (let i = 1; i <= 8; i++) ctx.lineTo(x0 + (x1 - x0)*i/8, y0 + (y1 - y0)*i/8 + (i < 8 ? (Math.random() - 0.5)*20*sc : 0)); ctx.stroke();
      ctx.lineWidth = w_*0.35; ctx.strokeStyle = '#fff'; ctx.stroke(); }
    ctx.restore();
    // numbers
    f.nums = f.nums.filter(n => (n.life -= dt) > 0); ctx.textAlign = 'center';
    for (const n of f.nums) { const x = n.side === 'R' ? rx : lx; ctx.font = `bold ${(n.crit ? 30 : 20)*Math.max(0.8, sc)}px ${FONT}`; ctx.fillStyle = n.crit ? '#ffcc33' : (n.side === 'L' ? '#ff5050' : '#fff');
      ctx.globalAlpha = Math.min(1, n.life*2); ctx.fillText(n.imm ? T('immune') : (n.crit ? '✴' : '') + fmt(n.v), x + (n.ox||0), floorY - 200*sc - (1 - n.life)*60); } ctx.globalAlpha = 1;
    // vignette + flicker for boss
    if (boss) { const vg = ctx.createRadialGradient(W*0.5, H*0.55, Math.min(W, H)*0.2, W*0.5, H*0.55, Math.max(W, H)*0.7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.92)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      if (Math.random() < 0.02) { ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H); }
      if (f.nmTier) { ctx.fillStyle = `rgba(70,0,12,${0.22 + Math.sin(time*0.9)*0.06})`; ctx.fillRect(0, 0, W, H); if (Math.random() < 0.012) { ctx.fillStyle = 'rgba(160,0,20,0.35)'; ctx.fillRect(0, 0, W, H); } } // v2.0 nightmare tint
      // film grain
      for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.05})`; ctx.fillRect(Math.random()*W, Math.random()*H, 2, 2); }
      if (f.phase === 'fight' && Math.floor(time*1.2) !== f._beat) { f._beat = Math.floor(time*1.2); sfx.beat(); } }
    ctx.restore();
    // v1.8 affix chips
    { const chips = []; if (f.kind !== 'pvp' && f.B && f.B.trait && TRAITS[f.B.trait]) { const TT = TRAITS[f.B.trait]; chips.push([`${TT.ico} ${TT[S.lang]}`, '#ffb020', 'rgba(50,30,0,0.8)']); }
      (f.aff || []).forEach(id => { const A = AFFIXES.find(a => a.id === id) || XAFFIXES.find(a => a.id === id); if (A) chips.push([`${A.ico} ${A[S.lang]}`, XAFFIXES.includes(A) ? '#40f0ff' : '#ff5060', XAFFIXES.includes(A) ? 'rgba(0,25,40,0.8)' : 'rgba(40,0,10,0.75)']); });
      if (f.ph4 !== undefined) { const X_ = XAFFIXES.find(a => a.id === XPHASES[f.ph4]); chips.push([`♻ → ${X_.ico} ${X_[S.lang]}`, '#c080ff', 'rgba(25,0,40,0.8)']); }
      if ((f.Rt.pas || []).length) { const tw = f.tower; f.Rt.pas.forEach(id => { const P = PASSIVES[id]; if (P) chips.push([`${tw ? '😈' : '🧬'} ${P.ico} ${P[S.lang]}${tw ? ' ' + ROMAN((f.Rt.prank || {})[id] || 1) : ''}`, tw ? '#ff7040' : '#40f0ff', tw ? 'rgba(40,10,0,0.8)' : 'rgba(0,25,40,0.8)']); }); }
      if (f.mech) chips.push([`🔱 ${T('mechTransform').replace('{h}', Math.round(f.mech[0]*100)).replace('{a}', Math.round((f.mech[1] - 1)*100))}${f.mechDone ? ' ✓' : ''}`, '#c080ff', 'rgba(25,0,40,0.75)']);
      { const lp = f.L.pas || []; ctx.textAlign = 'left'; ctx.font = `600 12px ${FONT}`; lp.forEach((id, i) => { const P = PASSIVES[id]; if (!P) return; const r = (f.L.prank || {})[id] || 1, txt = `${P.ico} ${P[S.lang]} ${ROMAN(r)}${id === 'rebirth' && f.L.fx.reborn ? ' ✓' : ''}`, w = ctx.measureText(txt).width + 16, x = 16, y = 100 + i*24;
        ctx.fillStyle = 'rgba(0,20,30,0.75)'; ctx.fillRect(x, y - 15, w, 20); ctx.strokeStyle = '#60e0ff'; ctx.strokeRect(x, y - 15, w, 20); ctx.fillStyle = '#d8f8ff'; ctx.fillText(txt, x + 8, y); }); }
      ctx.textAlign = 'right'; ctx.font = `600 12px ${FONT}`; chips.forEach(([txt, bc, bg], i) => { const w = ctx.measureText(txt).width + 16, x = W - 16, y = 100 + i*24;
        ctx.fillStyle = bg; ctx.fillRect(x - w, y - 15, w, 20); ctx.strokeStyle = bc; ctx.strokeRect(x - w, y - 15, w, 20); ctx.fillStyle = '#ffe8d0'; ctx.fillText(txt, x - 8, y); }); }
    if (f.tower) { ctx.textAlign = 'center'; ctx.font = `900 ${Math.max(14, 18*sc)}px ${FONT}`; ctx.fillStyle = `hsl(${(260 + Math.floor((f.tower.fl - 1)/10)*37) % 360},100%,75%)`; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
      ctx.fillText(f.tower.fl >= TOWER_NEW_FROM && f.tower.fl <= HELL_TO ? '🔥 ' + T('hellFloor').replace('{n}', f.tower.fl) : '🗼 ' + T('towerFloor').replace('{n}', f.tower.fl), W/2, 30); ctx.shadowBlur = 0;
      if (f.tower.hell) { const gr = ctx.createLinearGradient(0, H*0.55, 0, H); gr.addColorStop(0, 'rgba(120,10,0,0)'); gr.addColorStop(1, `rgba(200,40,0,${0.35 + Math.sin(time*2)*0.08})`); ctx.fillStyle = gr; ctx.fillRect(0, H*0.55, W, H*0.45);
        for (let i = 0; i < 24; i++) { const ph = (time*0.4 + i/24) % 1; ctx.fillStyle = `rgba(255,${120 + (i % 5)*20},40,${1 - ph})`; ctx.fillRect((i*137) % W, H - ph*H*0.6, 3, 3); } } }
    if (f.kind === 'xeno') { ctx.textAlign = 'center'; ctx.font = `900 ${Math.max(14, 18*sc)}px ${FONT}`; ctx.fillStyle = '#7ff8ff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
      ctx.fillText('🛸 ' + T('xeno') + ' · ' + T(XENO_BOSSES[f.riftI].at === 'gate' ? 'xenoGate' : XENO_BOSSES[f.riftI].at === 'spire' ? 'xenoSpire' : 'xenoCore'), W/2, 30); ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(0,40,60,${0.18 + Math.sin(time*0.7)*0.05})`; ctx.fillRect(0, 0, W, H); }
    if (f.kind === 'sanct') { ctx.textAlign = 'center'; ctx.font = `900 ${Math.max(14, 18*sc)}px ${FONT}`; ctx.fillStyle = f.nmTier ? '#ff3040' : f.B.cursed ? '#ff4a7a' : '#ffd98a'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
      ctx.fillText(f.nmTier ? '👁 ' + T('nmSanct') + ' · ' + T('nmTier').replace('{n}', ROMAN(f.nmTier)) : '⛩ ' + T('sanctum') + (f.B.cursed ? ' · ' + T('sanctCursedOn') : ''), W/2, 30); ctx.shadowBlur = 0; }
    // intro text
    if (f.phase === 'intro') { ctx.textAlign = 'center'; ctx.font = `italic ${Math.max(16, 22*sc)}px ${FONT}`;
      f.intro.forEach((line, i) => { const t0 = i*1.3; const vis_ = Math.max(0, Math.min(line.length, Math.floor((f.timer - t0)*28))); ctx.fillStyle = boss ? '#d8c8c8' : '#fff'; ctx.fillText(line.slice(0, vis_), W/2, H*0.18 + i*34*sc); }); }
    // bars
    const bar = (x, y, w, hp, max, name, t, isBoss) => { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(x, y, w, 14); ctx.fillStyle = isBoss ? '#a00' : '#3c3'; ctx.fillRect(x, y, w*Math.max(0, hp/max), 14);
      ctx.strokeStyle = '#000'; ctx.strokeRect(x, y, w, 14); ctx.fillStyle = '#fff'; ctx.font = `bold 13px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText(name, x, y - 6);
      ctx.textAlign = 'right'; ctx.font = `11px ${FONT}`; ctx.fillStyle = isBoss ? '#f88' : titleColor(t); ctx.fillText(isBoss ? (f.kind === 'rift' ? '⛩ ' + RIFT_RANKS[RIFTS[f.riftI][2]][S.lang] : f.kind === 'roam' ? '☠ ' + T('roamName') : f.kind === 'mirror' ? '🪞 ' + T('mirrorChance').replace('{p}', Math.round(mirrorChance(S)*100)) : '') : tn(t), x + w, y - 6); ctx.fillStyle = '#ddd'; ctx.fillText(`${fmt(Math.max(0, hp))} / ${fmt(max)}`, x + w, y + 28); };
    const bw = Math.min(320, W*0.4);
    bar(16, 40, bw, f.L.hp, f.L.st.hp, f.L.name, f.L.t, false);
    bar(W - bw - 16, 40, bw, f.Rt.hp, f.Rt.st.hp, f.Rt.name, f.Rt.t, boss);
  }
  function burn(x, y, r){ ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const a = Math.random()*7, d = Math.random()*r;
    ctx.fillStyle = `hsla(${20 + Math.random()*30},100%,${50 + Math.random()*30}%,0.6)`; ctx.beginPath(); ctx.arc(x + Math.cos(a)*d, y + Math.sin(a)*d, 3 + Math.random()*8, 0, 7); ctx.fill(); } ctx.restore(); }

  // ---------------- Lobby background ----------------
  const lobbyChar = { moving: false, fx: {}, face: 1, seed: 0 };
  function drawLobby(){
    ctx.fillStyle = '#06050a'; ctx.fillRect(0, 0, W, H);
    const t = Math.max(1, S.best >= 1 ? S.t : 1); lobbyChar.t = t; lobbyChar.sk = S.sk; lobbyChar.as = S.as;
    R.character(ctx, W > 980 ? W*0.82 : W/2, H*0.9, Math.min(2.4, H/330), lobbyChar, time);
  }

  // ---------------- Main loop ----------------
  let last = performance.now();
  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last)/1000); last = now; time += dt;
    AudioM.music(scene === 'lobby' ? 'lobby' : scene === 'fight' && fight ? (fight.kind === 'pvp' ? 'pvp' : 'fight') : 't' + Math.min(UNL, tierOf(S.t)));
    AudioM.aura(Math.min(UNL, tierOf(S.t)), me.moving, scene === 'world');
    pvpTick(); unlockTick();
    if (scene === 'lobby') drawLobby();
    else if (scene === 'world') { updateWorld(dt); drawWorld(dt); refreshHUD(false); }
    else if (scene === 'fight') { fightStep(dt); if (fight) drawFight(dt); else drawWorld(dt); Net.sendMe(Object.assign(meNet(), { mv: 0 })); }
    if (flashA > 0) { ctx.fillStyle = flashC; ctx.globalAlpha = Math.min(1, flashA); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; flashA -= dt*1.5; }
  }

  // ---------------- Boot ----------------
  (async () => {
    lobbyTexts();
    await Net.init(S.id);
    AudioM.probe().catch(()=>{});
    lobbyTexts(); refreshRooms(); setInterval(() => { if (scene === 'lobby') refreshRooms(); }, 5000);
    requestAnimationFrame(frame);
  })();
  addEventListener('beforeunload', () => { save(); Net.leave(); });
})();
