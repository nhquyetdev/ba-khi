// GodK Bá Khí v1.8 — GodK Tower: 6 Tower Guardians + tower arena backdrop
'use strict';
(() => {
  const TAU = Math.PI*2, { rnd, eye } = R, X = R.extra;
  const glow = (ctx, x, y, r, col, a) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };

  X.warden = (ctx, S, time, v) => {
    const br = Math.sin(time*1.1)*S*0.008;
    // chains with keys behind
    for (let i = 0; i < 7; i++) { const x0 = -S*0.45 + i*S*0.15, sw = Math.sin(time*1.3 + i)*S*0.04; ctx.strokeStyle = '#4a4238'; ctx.lineWidth = 2;
      ctx.beginPath(); for (let j = 0; j < 10; j++) { const y = -S*1.45 + j*S*0.06, x = x0 + sw*(j/10); ctx.moveTo(x, y); ctx.ellipse(x, y, S*0.008, S*0.018, 0, 0, TAU); } ctx.stroke();
      const kx = x0 + sw, ky = -S*0.85 + (i%3)*S*0.05; ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(kx, ky, S*0.018, 0, TAU); ctx.fill(); ctx.fillRect(kx - S*0.004, ky, S*0.008, S*0.06); ctx.fillRect(kx, ky + S*0.04, S*0.014, S*0.008); }
    // legs & body plates
    ctx.fillStyle = '#26282e'; ctx.fillRect(-S*0.16, -S*0.32, S*0.11, S*0.32); ctx.fillRect(S*0.05, -S*0.32, S*0.11, S*0.32);
    ctx.fillStyle = '#33363e'; ctx.beginPath(); ctx.moveTo(-S*0.28, -S*0.95 + br); ctx.lineTo(S*0.28, -S*0.95 + br); ctx.lineTo(S*0.22, -S*0.3); ctx.lineTo(-S*0.22, -S*0.3); ctx.fill();
    ctx.strokeStyle = '#5a5e68'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-S*0.26 + i*0.01*S, -S*(0.85 - i*0.12) + br); ctx.lineTo(S*0.26 - i*0.01*S, -S*(0.85 - i*0.12) + br); ctx.stroke(); }
    // pauldrons
    ctx.fillStyle = '#41454e'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.32, -S*0.9 + br, S*0.12, S*0.08, k*0.3, 0, TAU); ctx.fill(); }
    // arms; right holds a giant key
    ctx.strokeStyle = '#26282e'; ctx.lineWidth = S*0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.32, -S*0.85 + br); ctx.lineTo(-S*0.38, -S*0.45); ctx.moveTo(S*0.32, -S*0.85 + br); ctx.lineTo(S*0.4, -S*0.55); ctx.stroke();
    ctx.save(); ctx.translate(S*0.42, -S*0.55); ctx.rotate(-0.5 + (v.atk > 0 ? -1.1 : Math.sin(time)*0.05));
    ctx.fillStyle = '#d8b04a'; ctx.fillRect(-S*0.02, -S*0.75, S*0.04, S*0.8); ctx.beginPath(); ctx.arc(0, -S*0.82, S*0.09, 0, TAU); ctx.fill();
    ctx.fillStyle = '#26282e'; ctx.beginPath(); ctx.arc(0, -S*0.82, S*0.045, 0, TAU); ctx.fill(); ctx.fillStyle = '#d8b04a'; ctx.fillRect(S*0.02, -S*0.1, S*0.1, S*0.04); ctx.fillRect(S*0.02, -S*0.2, S*0.07, S*0.04); ctx.restore();
    // helmet with burning slit
    ctx.fillStyle = '#2b2e35'; ctx.beginPath(); ctx.moveTo(-S*0.11, -S*0.96 + br); ctx.lineTo(-S*0.12, -S*1.18 + br); ctx.quadraticCurveTo(0, -S*1.3 + br, S*0.12, -S*1.18 + br); ctx.lineTo(S*0.11, -S*0.96 + br); ctx.fill();
    ctx.fillStyle = '#ff8a20'; ctx.shadowColor = '#f80'; ctx.shadowBlur = 16; ctx.fillRect(-S*0.08, -S*1.1 + br, S*0.16, S*0.018); ctx.shadowBlur = 0;
    ctx.fillStyle = '#5a5e68'; ctx.beginPath(); ctx.moveTo(-S*0.02, -S*1.27 + br); ctx.lineTo(0, -S*1.42 + br); ctx.lineTo(S*0.02, -S*1.27 + br); ctx.fill();
  };

  X.skydragon = (ctx, S, time, v) => {
    // storm clouds
    ctx.fillStyle = 'rgba(40,36,60,0.7)'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(-S*0.6 + i*S*0.2, -S*1.35 + Math.sin(time*0.5 + i)*S*0.02, S*0.18, S*0.07, 0, 0, TAU); ctx.fill(); }
    if (Math.sin(time*3.1) > 0.9) { ctx.strokeStyle = '#fff6c0'; ctx.lineWidth = 2.5; ctx.shadowColor = '#ff0'; ctx.shadowBlur = 15; let x = rnd(-S*0.5, S*0.5), y = -S*1.3; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 6; i++) { x += rnd(-S*0.06, S*0.06); y += S*0.12; ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0; }
    // serpentine body
    const N = 46, pts = []; for (let i = 0; i < N; i++) { const k = i/(N - 1); pts.push([Math.sin(k*7 + time*1.2)*S*0.42*(1 - k*0.3), -S*(1.15 - k*1.05) + Math.cos(k*5 + time)*S*0.04]); }
    for (let i = N - 1; i > 0; i--) { const [x, y] = pts[i], r = S*(0.085 - i*0.0013);
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r); g.addColorStop(0, '#fff0a0'); g.addColorStop(0.5, '#e0a020'); g.addColorStop(1, '#8a5008'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      if (i % 3 === 0) { ctx.fillStyle = '#ff5a20'; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r*0.4, y - r*1.6); ctx.lineTo(x + r*0.6, y - r*0.9); ctx.fill(); } } // dorsal fins
    // claws
    for (const i of [10, 24]) { const [x, y] = pts[i]; ctx.strokeStyle = '#c88a18'; ctx.lineWidth = S*0.02; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - S*0.12, y + S*0.08); for (let f = -1; f <= 1; f++) { ctx.moveTo(x - S*0.12, y + S*0.08); ctx.lineTo(x - S*0.16, y + S*0.08 + f*S*0.03); } ctx.stroke(); }
    // head
    const [hx, hy] = pts[0]; ctx.save(); ctx.translate(hx, hy); ctx.scale(-1, 1);
    ctx.fillStyle = '#e8b030'; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.07); ctx.quadraticCurveTo(S*0.18, -S*0.1, S*0.26, -S*0.02); ctx.lineTo(S*0.24, S*0.04); ctx.quadraticCurveTo(S*0.12, S*(0.07 + (v.atk > 0 ? 0.06 : 0)), -S*0.05, S*0.07); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(S*(0.08 + i*0.035), S*0.02); ctx.lineTo(S*(0.095 + i*0.035), S*0.045); ctx.lineTo(S*(0.11 + i*0.035), S*0.02); ctx.fill(); }
    ctx.strokeStyle = '#f6e6c0'; ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.moveTo(-S*0.03, -S*0.06); ctx.quadraticCurveTo(-S*0.15, -S*0.25, -S*0.05, -S*0.3); ctx.moveTo(S*0.02, -S*0.07); ctx.quadraticCurveTo(-S*0.05, -S*0.28, S*0.06, -S*0.32); ctx.stroke(); // antlers
    ctx.strokeStyle = 'rgba(255,240,200,0.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(S*0.24, S*0.0); ctx.quadraticCurveTo(S*0.4, S*0.05 + Math.sin(time*3)*S*0.05, S*0.45, S*0.15); ctx.moveTo(S*0.22, S*0.03); ctx.quadraticCurveTo(S*0.35, S*0.15, S*0.38, S*0.25 + Math.cos(time*3)*S*0.04); ctx.stroke(); // whiskers
    ctx.fillStyle = '#ff2020'; ctx.shadowColor = '#f00'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(S*0.1, -S*0.04, S*0.025, S*0.012, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
    // pearl
    const px = hx - S*0.35, py = hy + Math.sin(time*2)*S*0.04; glow(ctx, px, py, S*0.15, 'rgba(180,230,255,A)', 0.6); ctx.fillStyle = '#e8f6ff'; ctx.beginPath(); ctx.arc(px, py, S*0.04, 0, TAU); ctx.fill();
  };

  X.asura = (ctx, S, time, v) => {
    // flame ring halo
    ctx.save(); ctx.translate(0, -S*0.75); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 40; i++) { const a = i/40*TAU + time*0.3, r = S*0.55, f = 1 + Math.sin(time*6 + i*1.3)*0.15; ctx.fillStyle = `hsla(${10 + (i%4)*8},100%,55%,0.55)`;
      ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.08)*r, Math.sin(a - 0.08)*r); ctx.lineTo(Math.cos(a)*r*1.18*f, Math.sin(a)*r*1.18*f); ctx.lineTo(Math.cos(a + 0.08)*r, Math.sin(a + 0.08)*r); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,180,60,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, S*0.55, 0, TAU); ctx.stroke(); ctx.restore();
    // twelve arms with weapons
    const weap = ['sword','trident','axe','bow','wheel','bell','sword','vajra','spear','axe','wheel','lotus'];
    for (let i = 0; i < 12; i++) { const k = i < 6 ? -1 : 1, j = i%6, a = k*(0.35 + j*0.32) + Math.sin(time*1.5 + i)*0.06 + (v.atk > 0 && j === 2 ? -k*0.5 : 0);
      const sx = k*S*0.12, sy = -S*0.78 + j*S*0.03, ex = sx + Math.sin(a)*S*0.42, ey = sy - Math.cos(a)*S*0.42*0.7;
      ctx.strokeStyle = '#a83020'; ctx.lineWidth = S*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ex)/2 + k*S*0.05, (sy + ey)/2 + S*0.06, ex, ey); ctx.stroke();
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(a); ctx.strokeStyle = '#e8e0c8'; ctx.fillStyle = '#e8c860'; ctx.lineWidth = 2;
      const w = weap[i]; ctx.beginPath();
      if (w === 'sword' || w === 'spear') { ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.16); ctx.stroke(); }
      else if (w === 'trident' || w === 'vajra') { ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.14); ctx.moveTo(-S*0.03, -S*0.1); ctx.lineTo(-S*0.03, -S*0.15); ctx.moveTo(S*0.03, -S*0.1); ctx.lineTo(S*0.03, -S*0.15); ctx.stroke(); }
      else if (w === 'axe') { ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -S*0.12); ctx.quadraticCurveTo(S*0.06, -S*0.1, S*0.04, -S*0.05); ctx.fill(); }
      else if (w === 'wheel') { ctx.arc(0, -S*0.05, S*0.04, 0, TAU); ctx.stroke(); }
      else if (w === 'bow') { ctx.arc(0, -S*0.05, S*0.06, -1.2, 1.2); ctx.stroke(); }
      else { ctx.arc(0, -S*0.04, S*0.025, 0, TAU); ctx.fill(); } ctx.restore(); }
    // body
    ctx.fillStyle = '#b83a24'; ctx.beginPath(); ctx.moveTo(-S*0.14, -S*0.82); ctx.lineTo(S*0.14, -S*0.82); ctx.lineTo(S*0.12, -S*0.4); ctx.lineTo(-S*0.12, -S*0.4); ctx.fill();
    ctx.fillStyle = '#2a1060'; ctx.beginPath(); ctx.moveTo(-S*0.16, -S*0.42); ctx.lineTo(S*0.16, -S*0.42); ctx.lineTo(S*0.24, 0); ctx.lineTo(-S*0.24, 0); ctx.fill();
    ctx.fillStyle = '#e8c860'; ctx.fillRect(-S*0.17, -S*0.44, S*0.34, S*0.03);
    // three faces
    const face = (x, y, r, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#c84a30'; ctx.beginPath(); ctx.ellipse(0, 0, r*0.8, r, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffe14a'; ctx.beginPath(); ctx.ellipse(-r*0.32, -r*0.15, r*0.2, r*0.1, 0.3, 0, TAU); ctx.ellipse(r*0.32, -r*0.15, r*0.2, r*0.1, -0.3, 0, TAU); ctx.ellipse(0, -r*0.55, r*0.08, r*0.14, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-r*0.32, -r*0.15, r*0.05, 0, TAU); ctx.arc(r*0.32, -r*0.15, r*0.05, 0, TAU); ctx.fill();
      ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(0, r*0.45, r*0.3, r*0.12 + (v.atk > 0 ? r*0.1 : 0), 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*r*0.2, r*0.38); ctx.lineTo(k*r*0.14, r*0.6); ctx.lineTo(k*r*0.08, r*0.38); ctx.fill(); } ctx.restore(); };
    face(-S*0.13, -S*0.9, S*0.07, -0.5); face(S*0.13, -S*0.9, S*0.07, 0.5); face(0, -S*0.93, S*0.09, 0);
    ctx.fillStyle = '#e8c860'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*1.0); for (let i = 0; i <= 6; i++) ctx.lineTo(-S*0.08 + i*S*0.0267, -S*((i%2) ? 1.05 : 1.14)); ctx.lineTo(S*0.08, -S*1.0); ctx.fill();
  };

  X.titan = (ctx, S, time, v) => {
    const J = { head:[0,-1.15], neck:[0,-1.0], ls:[-0.22,-0.95], rs:[0.22,-0.95], le:[-0.35,-0.65], re:[0.34,-1.08], lh:[-0.32,-0.38], rh:[0.22,-1.22], hip:[0,-0.48], lk:[-0.14,-0.24], rk:[0.14,-0.24], lf:[-0.18,0], rf:[0.18,0], chest:[0,-0.78] };
    const p = k => { const [x, y] = J[k]; return [x*S + Math.sin(time + x*9)*S*0.006, y*S + Math.cos(time*1.2 + y*7)*S*0.006]; };
    // translucent body shape
    ctx.fillStyle = 'rgba(30,50,120,0.35)'; ctx.beginPath(); ctx.moveTo(...p('ls')); ctx.lineTo(...p('rs')); ctx.lineTo(S*0.16, -S*0.48); ctx.lineTo(...p('rk')); ctx.lineTo(...p('rf')); ctx.lineTo(...p('lf')); ctx.lineTo(...p('lk')); ctx.lineTo(-S*0.16, -S*0.48); ctx.closePath(); ctx.fill();
    // constellation lines
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(150,190,255,0.7)'; ctx.lineWidth = 1.6;
    for (const [a, b] of [['head','neck'],['neck','ls'],['neck','rs'],['ls','le'],['le','lh'],['rs','re'],['re','rh'],['neck','chest'],['chest','hip'],['hip','lk'],['lk','lf'],['hip','rk'],['rk','rf'],['ls','chest'],['rs','chest']]) { ctx.beginPath(); ctx.moveTo(...p(a)); ctx.lineTo(...p(b)); ctx.stroke(); }
    for (const k in J) { const [x, y] = p(k), tw = 0.6 + Math.sin(time*4 + x)*0.4; glow(ctx, x, y, S*0.06, 'rgba(160,200,255,A)', 0.6*tw); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, S*0.012*(k === 'head' ? 2 : 1), 0, TAU); ctx.fill(); }
    // planet held overhead
    const [px, py] = p('rh'), pr = S*0.16; const pg = ctx.createRadialGradient(px - pr*0.3, py - pr*0.4 - pr, 0, px, py - pr, pr); pg.addColorStop(0, '#ffcf8a'); pg.addColorStop(0.6, '#c0602a'); pg.addColorStop(1, '#401808');
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py - pr, pr, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,170,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(px, py - pr, pr*1.6, pr*0.35, -0.3, 0, TAU); ctx.stroke(); ctx.restore();
    // eyes
    const [hx, hy] = p('head'); ctx.fillStyle = '#e8f4ff'; ctx.shadowColor = '#8cf'; ctx.shadowBlur = 12; ctx.fillRect(hx - S*0.04, hy - S*0.005, S*0.03, S*0.01); ctx.fillRect(hx + S*0.01, hy - S*0.005, S*0.03, S*0.01); ctx.shadowBlur = 0;
  };

  X.leviathan = (ctx, S, time, v) => {
    const by = -S*0.7 + Math.sin(time*0.6)*S*0.04, L = S*1.1, H = S*0.42;
    ctx.save(); ctx.translate(0, by);
    // body silhouette
    const body = () => { ctx.beginPath(); ctx.moveTo(-L*0.55, 0); ctx.quadraticCurveTo(-L*0.45, -H*0.75, 0, -H*0.7); ctx.quadraticCurveTo(L*0.45, -H*0.6, L*0.6, -H*0.05 + Math.sin(time)*H*0.1);
      ctx.lineTo(L*0.85, -H*0.45 + Math.sin(time*1.2)*H*0.2); ctx.lineTo(L*0.75, 0); ctx.lineTo(L*0.85, H*0.4 + Math.sin(time*1.2)*H*0.2); ctx.lineTo(L*0.6, H*0.08); ctx.quadraticCurveTo(L*0.3, H*0.55, -L*0.1, H*0.5); ctx.quadraticCurveTo(-L*0.5, H*0.45, -L*0.55, 0); };
    body(); ctx.fillStyle = '#05030c'; ctx.fill(); ctx.save(); body(); ctx.clip();
    for (let i = 0; i < 70; i++) { const x = (R.hash(i, 1) - 0.5)*L*1.5, y = (R.hash(i, 2) - 0.5)*H*1.3; ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7*Math.abs(Math.sin(time*2 + i))})`; ctx.fillRect(x, y, 1.6, 1.6); }
    const ng = ctx.createRadialGradient(0, 0, 0, 0, 0, L*0.6); ng.addColorStop(0, 'rgba(140,60,255,0.35)'); ng.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = ng; ctx.fillRect(-L, -H, L*2, H*2); ctx.restore();
    ctx.strokeStyle = 'rgba(180,120,255,0.85)'; ctx.lineWidth = 2; body(); ctx.stroke();
    // fins
    ctx.fillStyle = 'rgba(20,10,40,0.9)'; ctx.beginPath(); ctx.moveTo(-L*0.05, H*0.4); ctx.quadraticCurveTo(-L*0.1, H*0.9, L*0.1 + Math.sin(time)*L*0.05, H*0.95); ctx.lineTo(L*0.1, H*0.45); ctx.fill(); ctx.stroke();
    // eye & maw
    eye(ctx, -L*0.38, -H*0.15, S*0.045, time, -600, 0, '#a040ff');
    ctx.strokeStyle = 'rgba(200,150,255,0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-L*0.55, 0); ctx.quadraticCurveTo(-L*0.3, H*(0.15 + (v.atk > 0 ? 0.15 : 0)), -L*0.1, H*0.1); ctx.stroke();
    for (let i = 0; i < 6; i++) { const ph = (time*0.4 + i/6) % 1; ctx.fillStyle = `rgba(200,150,255,${1 - ph})`; ctx.beginPath(); ctx.arc(-L*0.2 + i*L*0.08, -H*0.75 - ph*H*0.8, 2 + ph*3, 0, TAU); ctx.fill(); } // void bubbles
    ctx.restore();
  };

  X.othergodk = (ctx, S, time, v) => {
    const hue = (time*70) % 360, sc = S/135;
    // six wings of light
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const k of [-1, 1]) for (let w = 0; w < 3; w++) for (let f = 0; f < 7; f++) { const a = -Math.PI/2 + k*(0.5 + w*0.45 + f*0.06) + Math.sin(time*1.4 + w)*0.05, len = S*(0.6 - w*0.1 - f*0.02);
      ctx.strokeStyle = `hsla(${(hue + w*40 + f*8)%360},100%,75%,0.45)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -S*0.75); ctx.quadraticCurveTo(k*len*0.5, -S*0.75 - len*0.6, Math.cos(a)*len*k*k + k*Math.abs(Math.cos(a))*len*0.4, -S*0.75 + Math.sin(a)*len*0.8); ctx.stroke(); }
    ctx.restore();
    R.character(ctx, 0, 0, sc, v.fx ? Object.assign(v.fx.__ch || (v.fx.__ch = { fx: {}, seed: 4 }), { t: MAX_TITLE + 100, face: -1, moving: false, sk: 'emperor', as: 'realm', mirror: false }) : { t: MAX_TITLE + 100, fx: {}, face: -1 }, time);
  };

  // ---------- tower arena backdrop (behind fighters) ----------
  R.towerArena = (ctx, W, H, floorY, fl, time, guardian) => {
    const band = Math.floor((fl - 1)/10), hue = (260 + band*37) % 360, inten = Math.min(1, 0.35 + fl/80);
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, `hsl(${hue},45%,4%)`); bg.addColorStop(0.65, `hsl(${hue},55%,${8 + inten*6}%)`); bg.addColorStop(1, `hsl(${hue},60%,${12 + inten*6}%)`);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // rising pillars receding upward
    for (let i = 0; i < 6; i++) { const x = W*(0.06 + i*0.176), w = W*0.05; const g = ctx.createLinearGradient(0, 0, 0, floorY); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `hsla(${hue},30%,18%,0.9)`);
      ctx.fillStyle = g; ctx.fillRect(x - w/2, 0, w, floorY); ctx.fillStyle = `hsla(${hue},90%,65%,${0.25 + 0.2*Math.sin(time*2 + i)})`; for (let r = 0; r < 4; r++) ctx.fillRect(x - w*0.3, floorY - (r + 1)*H*0.14 - (time*30 % (H*0.14)), w*0.6, 2); }
    // energy column rising (stronger with height)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cg = ctx.createLinearGradient(W*0.5 - W*0.12, 0, W*0.5 + W*0.12, 0); cg.addColorStop(0, 'rgba(0,0,0,0)'); cg.addColorStop(0.5, `hsla(${hue},100%,60%,${0.06 + inten*0.1})`); cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg; ctx.fillRect(W*0.38, 0, W*0.24, floorY);
    for (let i = 0; i < 30 + fl; i++) { if (i > 120) break; const ph = ((time*0.25 + R.hash(i, 3)) % 1); ctx.fillStyle = `hsla(${(hue + i*5)%360},100%,75%,${(1 - ph)*0.7})`; ctx.fillRect(R.hash(i, 4)*W, floorY - ph*floorY, 2, 2 + inten*3); }
    ctx.restore();
    // floor runic circle
    ctx.save(); ctx.translate(W*0.5, floorY + 10); ctx.scale(1, 0.22); ctx.rotate(time*0.1); ctx.strokeStyle = `hsla(${hue},100%,65%,${0.25 + inten*0.25})`; ctx.lineWidth = 3;
    for (const r of [W*0.42, W*0.34]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); } ctx.font = `bold ${W*0.025}px serif`; ctx.fillStyle = ctx.strokeStyle; ctx.textAlign = 'center';
    const rn = '霸氣塔神無限極天道'; for (let i = 0; i < 18; i++) { const a = i/18*TAU; ctx.save(); ctx.rotate(a); ctx.fillText(rn[i % rn.length], 0, -W*0.38); ctx.restore(); } ctx.restore();
    if (guardian) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `hsla(${hue},100%,60%,${0.05 + Math.sin(time*3)*0.03})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  };
})();
