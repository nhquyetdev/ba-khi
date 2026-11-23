// GodK Bá Khí v1.2 — audio: chill generative music per realm, aura sound, custom files from /audio
'use strict';
const AudioM = (() => {
  let ac = null, master, musicBus, sfxBus, auraBus, revIn, delayIn;
  const vol = { m: 0.5, s: 0.8, a: 0.5 }; let muted = false;
  const files = {}; // key -> url (found in /audio)
  const FILE_KEYS = ['bgm/lobby', 'bgm/fight', 'bgm/pvp', 'bgm/unlimited', 'bgm/default', ...Array.from({ length: 10 }, (_, i) => `bgm/tier${i + 1}`),
    'sfx/aura', ...Array.from({ length: 10 }, (_, i) => `sfx/aura_tier${i + 1}`), 'sfx/levelup', 'sfx/title', 'sfx/hit', 'sfx/hurt', 'sfx/win', 'sfx/lose', 'sfx/transform', 'sfx/event', 'sfx/find', 'sfx/rebirth'];
  const EXTS = ['mp3'];

  // ---------- probe /audio folder ----------
  async function probe(){
    if (location.protocol === 'file:') return 0;
    // optional manifest: audio/files.json = ["bgm/tier1.ogg", "sfx/aura.wav", ...] for other formats
    try { const r = await fetch('audio/files.json', { cache: 'no-cache' }); if (r.ok) { const list = await r.json(); list.forEach(f => { const k = f.replace(/\.[a-z0-9]+$/i, ''); files[k] = 'audio/' + f; }); return Object.keys(files).length; } } catch(_){}
    const jobs = [];
    for (const k of FILE_KEYS) jobs.push((async () => { for (const e of EXTS) { const url = `audio/${k}.${e}`;
      try { const r = await fetch(url, { method: 'HEAD', cache: 'no-cache' }); if (r.ok && !(r.headers.get('content-type')||'').includes('text/html')) { files[k] = url; return; } } catch(_){} } })());
    await Promise.all(jobs); return Object.keys(files).length;
  }

  // ---------- context ----------
  function ensure(){
    if (ac) { if (ac.state === 'suspended') ac.resume(); return ac; }
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
    master = ac.createGain(); master.gain.value = muted ? 0 : 1;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; master.connect(comp); comp.connect(ac.destination);
    musicBus = ac.createGain(); sfxBus = ac.createGain(); auraBus = ac.createGain();
    [musicBus, sfxBus, auraBus].forEach(b => b.connect(master)); applyVol();
    // reverb (generated impulse)
    const conv = ac.createConvolver(), len = ac.sampleRate*3, buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random()*2 - 1)*Math.pow(1 - i/len, 2.6); }
    conv.buffer = buf; revIn = ac.createGain(); revIn.gain.value = 0.55; revIn.connect(conv); const rOut = ac.createGain(); rOut.gain.value = 0.6; conv.connect(rOut); rOut.connect(musicBus);
    // echo
    delayIn = ac.createGain(); const dl = ac.createDelay(2); dl.delayTime.value = 0.42; const fb = ac.createGain(); fb.gain.value = 0.38; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    delayIn.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(musicBus); lp.connect(revIn);
    noiseBuf = ac.createBuffer(1, ac.sampleRate*2, ac.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random()*2 - 1;
    setInterval(tick, 60);
    if (pendingTrack) { const k = pendingTrack; pendingTrack = null; music(k); }
    return ac;
  }
  let noiseBuf = null;
  function applyVol(){ if (!ac) return; const t = ac.currentTime; musicBus.gain.setTargetAtTime(vol.m*0.55, t, 0.1); sfxBus.gain.setTargetAtTime(vol.s, t, 0.05); auraBus.gain.setTargetAtTime(vol.a*0.6, t, 0.1);
    master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.05); if (fileEl) fileEl.volume = muted ? 0 : vol.m*0.7*fileFade; if (auraEl) auraEl.volume = muted ? 0 : vol.a*auraLevel; }

  // ---------- tiny synth ----------
  const n2f = n => 440*Math.pow(2, (n - 69)/12);
  function env(g, t, a, peak, d){ g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function voice(type, f, t, a, peak, d, cutoff, dest, detune=0){
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; o.detune.value = detune;
    let out = o; if (cutoff) { const fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = cutoff; o.connect(fl); out = fl; }
    out.connect(g); env(g, t, a, peak, d); (dest || [musicBus]).forEach(x => g.connect(x)); o.start(t); o.stop(t + a + d + 0.05);
  }
  function noiseHit(t, hp, peak, d, dest){ const s = ac.createBufferSource(); s.buffer = noiseBuf; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const g = ac.createGain();
    s.connect(f); f.connect(g); env(g, t, 0.004, peak, d); g.connect(dest || musicBus); s.start(t, Math.random()*1.5); s.stop(t + d + 0.05); }
  function kick(t, peak){ const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18); env(g, t, 0.005, peak, 0.32); o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + 0.4); }

  // ---------- realm themes ----------
  const SC = { maj:[0,2,4,5,7,9,11], min:[0,2,3,5,7,8,10], dor:[0,2,3,5,7,9,10], lyd:[0,2,4,6,7,9,11], phr:[0,1,3,5,7,8,10], mix:[0,2,4,5,7,9,10], whole:[0,2,4,6,8,10] };
  const THEMES = {
    t0:  { root: 60, sc: 'maj', prog: [0,5,3,4], bpm: 72, pad: 'sine',     cut: 1400, pluck: 'triangle', arp: 0.35, lofi: 1, bell: 0.05 },
    t1:  { root: 57, sc: 'min', prog: [0,5,2,6], bpm: 75, pad: 'triangle', cut: 1200, pluck: 'sine',     arp: 0.4,  lofi: 1, bell: 0.08 },
    t2:  { root: 62, sc: 'dor', prog: [0,3,0,6], bpm: 78, pad: 'sawtooth', cut: 900,  pluck: 'triangle', arp: 0.35, lofi: 1, bass: 1 },
    t3:  { root: 65, sc: 'lyd', prog: [0,1,0,6], bpm: 64, pad: 'sine',     cut: 2200, pluck: 'sine',     arp: 0.25, bell: 0.3, choir: 1 },
    t4:  { root: 64, sc: 'min', prog: [0,5,3,6], bpm: 60, pad: 'triangle', cut: 1600, pluck: 'sine',     arp: 0.45, bell: 0.2, echo: 1, high: 1 },
    t5:  { root: 67, sc: 'maj', prog: [0,2,3,0], bpm: 80, pad: 'sine',     cut: 2000, pluck: 'triangle', arp: 0.7,  sixteenth: 1, echo: 1, bell: 0.1 },
    t6:  { root: 49, sc: 'phr', prog: [0,1,0,6], bpm: 62, pad: 'sawtooth', cut: 600,  pluck: 'triangle', arp: 0.2,  lofi: 1, drone: 1, bass: 1 },
    t7:  { root: 71, sc: 'lyd', prog: [0,1,0,1], bpm: 68, pad: 'sine',     cut: 2600, pluck: 'sine',     arp: 0.5,  bell: 0.45, echo: 1, high: 1 },
    t8:  { root: 63, sc: 'maj', prog: [0,4,5,3], bpm: 70, pad: 'sine',     cut: 2400, pluck: 'sine',     arp: 0.3,  bell: 0.25, choir: 1, echo: 1 },
    t9:  { root: 50, sc: 'whole', prog: [0,2,4,1], bpm: 50, pad: 'triangle', cut: 800, pluck: 'sine',    arp: 0.15, drone: 1, bell: 0.15, echo: 1 },
    t10: { root: 60, sc: 'lyd', prog: [0,3,1,4], bpm: 66, pad: 'sine',     cut: 2400, pluck: 'triangle', arp: 0.5,  bell: 0.3, choir: 1, echo: 1, shift: 1 },
    lobby:{ root: 57, sc: 'dor', prog: [0,3,5,4], bpm: 70, pad: 'triangle', cut: 1100, pluck: 'sine',    arp: 0.3,  lofi: 1, bell: 0.06 },
    fight:{ root: 38, sc: 'phr', prog: [0,0,1,0], bpm: 92, pad: 'sawtooth', cut: 500,  pluck: 'square',   arp: 0.12, drone: 1, pulse: 1, heart: 1 },
    pvp:  { root: 52, sc: 'min', prog: [0,5,6,4], bpm: 104, pad: 'sawtooth', cut: 1300, pluck: 'triangle', arp: 0.55, lofi: 1, bass: 1, drive: 1 },
  };
  const note = (th, deg, oct=0) => { const sc = SC[th.sc]; const n = sc.length; const o = Math.floor(deg/n); return th.root + sc[((deg % n) + n) % n] + 12*(o + oct); };

  let cur = null, curKey = null, step = 0, nextT = 0, pendingTrack = null, shiftSc = 0;
  let fileEl = null, fileFade = 1, fileKey = null;
  function fileFor(key){ if (key === 'lobby') return files['bgm/lobby'] || files['bgm/default'];
    if (key === 'fight') return files['bgm/fight']; if (key === 'pvp') return files['bgm/pvp'] || files['bgm/fight'];
    if (key === 't10') return files['bgm/unlimited'] || files['bgm/tier10'] || files['bgm/default'];
    const m = /^t(\d+)$/.exec(key); if (m) return files[`bgm/tier${+m[1] + 1}`] || files['bgm/default']; return null; }
  function music(key){
    if (!ac) { pendingTrack = key; return; }
    if (key === curKey) return; curKey = key;
    const url = fileFor(key);
    if (fileEl) { const old = fileEl; fileEl = null; let v = old.volume; const iv = setInterval(() => { v -= 0.05; if (v <= 0) { old.pause(); clearInterval(iv); } else old.volume = v; }, 60); }
    if (url) { cur = null; fileEl = new Audio(url); fileEl.loop = true; fileFade = 0; fileEl.volume = 0; fileEl.play().catch(()=>{}); fileKey = url;
      const iv = setInterval(() => { fileFade = Math.min(1, fileFade + 0.05); if (fileEl) fileEl.volume = muted ? 0 : vol.m*0.7*fileFade; if (fileFade >= 1) clearInterval(iv); }, 80); return; }
    cur = THEMES[key] || THEMES.t0; step = 0; nextT = ac.currentTime + 0.3;
  }
  function tick(){
    if (!ac || !cur || muted || vol.m <= 0.001) { if (ac) nextT = ac.currentTime + 0.1; return; }
    const th = cur, beat = 60/th.bpm, s8 = beat/2;
    while (nextT < ac.currentTime + 0.35) {
      const t = nextT, bar = Math.floor(step/8), inBar = step % 8;
      const thx = th.shift ? Object.assign({}, th, { sc: ['lyd','maj','mix','dor','min'][Math.floor(bar/8) % 5] }) : th;
      const chordDeg = th.prog[Math.floor(bar/2) % th.prog.length];
      const dests = [musicBus, revIn].concat(th.echo ? [delayIn] : []);
      if (inBar === 0 && bar % 2 === 0) { // new chord: pad
        const dur = beat*8;
        [0, 2, 4, 6].forEach((k, i) => { if (i === 3 && Math.random() < 0.5) return; const f = n2f(note(thx, chordDeg + k, -1));
          voice(th.pad, f, t, th.choir ? 1.6 : 0.9, 0.05, dur, th.cut, [musicBus, revIn], -7); voice(th.pad, f, t, th.choir ? 1.6 : 0.9, 0.05, dur, th.cut, [musicBus, revIn], 7); });
        if (th.drone) voice('sawtooth', n2f(note(thx, 0, -2)), t, 2, 0.06, dur, 260, [musicBus]);
      }
      if ((th.bass || th.lofi) && (inBar === 0 || inBar === 5)) voice('sine', n2f(note(thx, chordDeg, -2)), t, 0.01, th.bass ? 0.22 : 0.14, beat*1.6, 400, [musicBus]);
      if (th.lofi) { if (inBar === 0 || inBar === 5) kick(t, th.drive ? 0.32 : 0.22); if (inBar % 2 === 1 || th.drive) noiseHit(t, 7000, th.drive ? 0.035 : 0.025, 0.05); if (inBar === 4) noiseHit(t, 1800, 0.05, 0.12); }
      if (th.pulse) { voice('sawtooth', n2f(note(thx, 0, -1)), t, 0.01, 0.07, s8*0.8, 500, [musicBus]); }
      if (th.heart && (inBar === 0 || inBar === 1)) kick(t, 0.35);
      const subs = th.sixteenth ? 2 : 1;
      for (let k = 0; k < subs; k++) { const tt = t + k*s8/2;
        if (Math.random() < th.arp) { const d = chordDeg + [0, 2, 4, 7, 9][Math.floor(Math.random()*5)]; voice(th.pluck, n2f(note(thx, d, th.high ? 1 : 0)), tt, 0.008, 0.07, 0.7, 2600, dests); } }
      if (th.bell && Math.random() < th.bell/2) { const f = n2f(note(thx, chordDeg + [0, 2, 4][Math.floor(Math.random()*3)], 1)); voice('sine', f, t, 0.005, 0.05, 2.4, 0, dests); voice('sine', f*2.76, t, 0.005, 0.015, 1.2, 0, dests); }
      nextT += s8; step++;
    }
  }

  // ---------- aura sound ----------
  let auraNodes = null, auraEl = null, auraLevel = 0, auraTier = -1, crackT = 0;
  function aura(tier, moving, on){
    if (!ac) return;
    const target = on ? Math.min(1, 0.18 + tier*0.07) * (moving ? 1.25 : 1) : 0;
    const url = files[`sfx/aura_tier${Math.min(10, tier + 1)}`] || files['sfx/aura'];
    if (url) {
      if (auraNodes) { auraNodes.g.gain.setTargetAtTime(0, ac.currentTime, 0.2); }
      if (!auraEl || auraEl._src !== url) { if (auraEl) auraEl.pause(); auraEl = new Audio(url); auraEl._src = url; auraEl.loop = true; auraEl.play().catch(()=>{}); }
      auraEl.playbackRate = files[`sfx/aura_tier${Math.min(10, tier + 1)}`] ? 1 : 0.8 + Math.min(10, tier)*0.04;
      auraLevel += (target - auraLevel)*0.1; auraEl.volume = muted ? 0 : Math.max(0, Math.min(1, vol.a*auraLevel)); return;
    }
    if (!auraNodes) { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.8; const lp = ac.createBiquadFilter(); lp.type = 'lowpass';
      const hum = ac.createOscillator(); hum.type = 'sine'; const hg = ac.createGain(); hg.gain.value = 0.25; const lfo = ac.createOscillator(); lfo.frequency.value = 0.35; const lg = ac.createGain(); lg.gain.value = 0.25;
      const g = ac.createGain(); g.gain.value = 0; s.connect(bp); bp.connect(lp); lp.connect(g); hum.connect(hg); hg.connect(g); lfo.connect(lg); lg.connect(g.gain); g.connect(auraBus);
      s.start(); hum.start(); lfo.start(); auraNodes = { bp, lp, hum, g }; }
    if (tier !== auraTier) { auraTier = tier; const t = ac.currentTime;
      auraNodes.bp.frequency.setTargetAtTime([300, 420, 520, 900, 600, 760, 220, 1200, 1500, 160, 700][Math.min(10, tier)], t, 0.4);
      auraNodes.lp.frequency.setTargetAtTime(900 + tier*300, t, 0.4); auraNodes.hum.frequency.setTargetAtTime([0, 55, 65, 98, 73, 82, 41, 110, 130, 36, 49][Math.min(10, tier)] || 0.001, t, 0.4); }
    auraNodes.g.gain.setTargetAtTime(target*0.35, ac.currentTime, 0.25);
    // electric crackles for lightning tiers
    if (on && [2, 6, 7, 9, 10].includes(tier) && ac.currentTime > crackT) { crackT = ac.currentTime + 0.15 + Math.random()*0.6; noiseHit(ac.currentTime, 3000, 0.05*target, 0.04, auraBus); }
  }

  // ---------- sfx ----------
  function sfx(name){ const url = files['sfx/' + name]; if (!url) return false; const a = new Audio(url); a.volume = muted ? 0 : vol.s; a.play().catch(()=>{}); return true; }
  function tone(f, d, type='sine', v=0.15, slide=0){ if (!ac || muted) return; const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f*slide), ac.currentTime + d); g.gain.value = v; g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.connect(g); g.connect(sfxBus); o.start(); o.stop(ac.currentTime + d); }

  return { probe, ensure, music, aura, sfx, tone, files,
    setVol(o){ Object.assign(vol, o); applyVol(); }, setMuted(m){ muted = !!m; applyVol(); }, get vol(){ return vol; }, get key(){ return curKey; } };
})();
