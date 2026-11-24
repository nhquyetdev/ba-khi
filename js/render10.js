// GodK Bá Khí v2.1 — Hư Tinh Đảo (Xeno Isle): gate + UFO, bridge, floating island, alien bosses, Xeno aura
'use strict';
(() => {
  const TAU = Math.PI*2, { eye } = R, X = R.extra, hash = (i, k) => { const x = Math.sin(i*127.1 + k*311.7)*43758.5453; return x - Math.floor(x); };
  const glow = (ctx, x, y, r, rgba) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };
  const CY = '#3fe6ff';

  // ---------------- UFO + gate on Map 1 ----------------
  function ufo(ctx, x, y, s, time, beam){
    if (beam) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y, 0, y + 180*s); g.addColorStop(0, 'rgba(120,255,255,0.45)'); g.addColorStop(1, 'rgba(120,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30*s, y + 8*s); ctx.lineTo(x + 30*s, y + 8*s); ctx.lineTo(x + 75*s, y + 180*s); ctx.lineTo(x - 75*s, y + 180*s); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#5a6a78'; ctx.beginPath(); ctx.ellipse(x, y, 90*s, 22*s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#8a9aa8'; ctx.beginPath(); ctx.ellipse(x, y - 4*s, 90*s, 16*s, 0, Math.PI, TAU); ctx.fill();
    const g = ctx.createRadialGradient(x - 10*s, y - 26*s, 2, x, y - 14*s, 40*s); g.addColorStop(0, 'rgba(220,255,255,0.95)'); g.addColorStop(1, 'rgba(60,200,230,0.5)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - 14*s, 38*s, 28*s, 0, Math.PI, TAU); ctx.fill();
    for (let i = 0; i < 10; i++) { const a = i/10*TAU + time*1.5, lx = x + Math.cos(a)*78*s, ly = y + Math.sin(a)*12*s; if (Math.sin(a) < -0.2) continue; const on = (i + Math.floor(time*6)) % 3 === 0;
      ctx.fillStyle = on ? '#fff6a0' : '#40f0ff'; ctx.beginPath(); ctx.arc(lx, ly, 4*s, 0, TAU); ctx.fill(); if (on) glow(ctx, lx, ly, 12*s, 'rgba(255,240,150,0.7)'); }
  }
  R.xenoGate = (ctx, sx, sy, z, time, state, label) => { // state: 'locked' | 'ready' (gatekeeper) | 'open'
    const s = z; ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(sx, sy, 110*s, 30*s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#7a8a98'; ctx.lineWidth = 12*s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(sx, sy - 90*s, 75*s, 95*s, 0, Math.PI*0.92, Math.PI*2.08); ctx.stroke(); // metal arch
    ctx.strokeStyle = state === 'locked' ? 'rgba(120,140,160,0.6)' : CY; ctx.lineWidth = 3*s; ctx.shadowColor = CY; ctx.shadowBlur = state === 'locked' ? 0 : 14; ctx.stroke(); ctx.shadowBlur = 0;
    if (state !== 'locked') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy - 80*s, 0, sx, sy - 80*s, 80*s); g.addColorStop(0, `rgba(80,240,255,${0.35 + Math.sin(time*3)*0.12})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, sy - 85*s, 66*s, 88*s, 0, 0, TAU); ctx.fill(); ctx.restore();
      for (let i = 0; i < 3; i++) { const r = ((time*0.6 + i/3) % 1); ctx.strokeStyle = `rgba(140,255,255,${1 - r})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy - 85*s, 66*s*r, 88*s*r, 0, 0, TAU); ctx.stroke(); } }
    ufo(ctx, sx, sy - 250*s + Math.sin(time*1.4)*8*s, s*0.9, time, state !== 'locked');
    ctx.textAlign = 'center'; ctx.font = `800 ${Math.max(11, 14*z)}px ${FONT}`; ctx.fillStyle = state === 'locked' ? '#9ab' : '#9ff8ff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 5; ctx.fillText(label, sx, sy - 300*s); ctx.shadowBlur = 0;
  };

  // ---------------- bridge of light over the void ----------------
  R.xenoBridge = (ctx, w2s, z, x, y0, y1, half, time) => {
    const [ax, ay] = w2s(x - half, y1), [bx, by] = w2s(x + half, y0);
    ctx.fillStyle = 'rgba(8,20,30,0.85)'; ctx.fillRect(ax, ay, bx - ax, by - ay);
    ctx.strokeStyle = 'rgba(80,240,255,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, by); ctx.moveTo(bx, ay); ctx.lineTo(bx, by); ctx.stroke();
    for (let y = y0; y > y1; y -= 90) { const [sx, sy] = w2s(x, y), ph = ((-y/90 + time*3) % 6 + 6) % 6; ctx.fillStyle = `rgba(80,240,255,${ph < 1 ? 0.55 : 0.15})`; ctx.fillRect(sx - half*z*0.8, sy - 3*z, half*z*1.6, 6*z); }
  };

  // ---------------- the island ----------------
  const shapes = [ ['c', 0, 0, 720], ['r', -520, 500, 520, 1650], ['r', -460, -1750, 460, -500], ['e', -1150, 0, 720, 500], ['e', 1150, 0, 720, 500] ];
  function shapePath(ctx, w2s, cx, cy, sh, dy){
    ctx.beginPath();
    if (sh[0] === 'c' || sh[0] === 'e') { const rx = sh[3], ry = sh[0] === 'c' ? sh[3] : sh[4]; for (let i = 0; i <= 40; i++) { const a = i/40*TAU, j = 1 + (hash(i % 40, sh[1] + 7) - 0.5)*0.05; const [x, y] = w2s(cx + sh[1] + Math.cos(a)*rx*j, cy + sh[2] + Math.sin(a)*ry*j); i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy); } }
    else { const [, X0, Y0, X1, Y1] = sh, pts = [], N = 10; // jagged rocky edge instead of a hard rectangle
      for (let i = 0; i < N; i++) pts.push([X0 + (X1 - X0)*i/N, Y0 + (hash(i, X0) - 0.5)*70]);
      for (let i = 0; i < N; i++) pts.push([X1 + (hash(i, Y1) - 0.5)*70, Y0 + (Y1 - Y0)*i/N]);
      for (let i = 0; i < N; i++) pts.push([X1 - (X1 - X0)*i/N, Y1 + (hash(i, X1) - 0.5)*70]);
      for (let i = 0; i < N; i++) pts.push([X0 + (hash(i, Y0) - 0.5)*70, Y1 - (Y1 - Y0)*i/N]);
      pts.forEach(([px, py], i) => { const [x, y] = w2s(cx + px, cy + py); i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy); }); }
    ctx.closePath();
  }
  const islets = Array.from({ length: 16 }, (_, i) => { const a = hash(i, 1)*TAU, d = 1500 + hash(i, 2)*900; return [Math.cos(a)*d*1.2, Math.sin(a)*d*0.9, 60 + hash(i, 3)*110]; });
  R.xenoBackdrop = (ctx, w2s, z, cx, cy, time, W, H) => { // nebula + stars around the island
    for (let i = 0; i < 7; i++) { const [sx, sy] = w2s(cx + (hash(i, 4) - 0.5)*5200, cy + (hash(i, 5) - 0.5)*4400); glow(ctx, sx, sy, (700 + hash(i, 6)*600)*z, `rgba(${40 + i*6},${90 + i*12},255,0.22)`); }
    ctx.fillStyle = '#cfefff'; for (let i = 0; i < 140; i++) { const [sx, sy] = w2s(cx + (hash(i, 8) - 0.5)*6000, cy + (hash(i, 9) - 0.5)*5000); if (sx < -5 || sx > W + 5 || sy < -5 || sy > H + 5) continue; const tw = 0.4 + Math.sin(time*2 + i)*0.4; ctx.globalAlpha = tw; ctx.fillRect(sx, sy, 2, 2); } ctx.globalAlpha = 1;
  };
  R.xenoIsland = (ctx, w2s, z, cx, cy, time) => {
    const cliff = 46*z;
    for (const [ix, iy, r] of islets) { const pts = [['c', ix, iy, r]]; ctx.fillStyle = '#0c2a3a'; shapePath(ctx, w2s, cx, cy, pts[0], cliff*0.6); ctx.fill(); ctx.strokeStyle = CY; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#04060a'; shapePath(ctx, w2s, cx, cy, pts[0], 0); ctx.fill(); }
    ctx.fillStyle = '#0b2a3c'; for (const sh of shapes) { shapePath(ctx, w2s, cx, cy, sh, cliff); ctx.fill(); }                  // cliff body
    ctx.strokeStyle = 'rgba(63,230,255,0.85)'; ctx.lineWidth = 3; for (const sh of shapes) { shapePath(ctx, w2s, cx, cy, sh, cliff); ctx.stroke(); }
    ctx.strokeStyle = CY; ctx.lineWidth = 7; ctx.shadowColor = CY; ctx.shadowBlur = 12; for (const sh of shapes) { shapePath(ctx, w2s, cx, cy, sh, 0); ctx.stroke(); } ctx.shadowBlur = 0; // glowing rim
    ctx.fillStyle = '#04060a'; for (const sh of shapes) { shapePath(ctx, w2s, cx, cy, sh, 0); ctx.fill(); }                      // top surface covers inner half of the rim
    for (let i = 0; i < 70; i++) { const x = cx + (hash(i, 11) - 0.5)*3600, y = cy + (hash(i, 12) - 0.5)*3600; if (!xenoOn(x, y) || xenoInCrater(x, y) || Math.hypot(x - cx, y - cy) < 360) continue; // crystal pillars
      const [sx, sy] = w2s(x, y), h = (14 + hash(i, 13)*26)*z; ctx.fillStyle = '#0e3a4c'; ctx.fillRect(sx - 4*z, sy - h, 8*z, h); ctx.fillStyle = '#9ff8ff'; ctx.fillRect(sx - 4*z, sy - h, 8*z, 3*z); glow(ctx, sx, sy - h, 10*z, 'rgba(120,255,255,0.35)'); }
    for (const [a, b] of XENO_SPOTS.craters) { for (let r = 1; r <= 3; r++) { ctx.strokeStyle = `rgba(63,230,255,${0.7 - r*0.15})`; ctx.lineWidth = 2; const [sx, sy] = w2s(cx + a, cy + b); ctx.beginPath(); ctx.ellipse(sx, sy, XENO.crater*z*r/3, XENO.crater*z*r/3*R.SQ, 0, 0, TAU); ctx.stroke(); }
      const [sx, sy] = w2s(cx + a, cy + b), bob = Math.sin(time*2 + a)*6*z; glow(ctx, sx, sy - 30*z + bob, 60*z, 'rgba(255,255,150,0.6)'); ctx.fillStyle = '#ffffc0'; ctx.beginPath(); ctx.arc(sx, sy - 30*z + bob, 12*z, 0, TAU); ctx.fill(); }
    { const [sx, sy] = w2s(cx, cy); for (let r = 1; r <= 4; r++) { ctx.strokeStyle = `rgba(63,230,255,${0.75 - r*0.13})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(sx, sy, 90*z*r, 90*z*r*R.SQ, 0, 0, TAU); ctx.stroke(); } } // core crater contours
    { const [px, py] = w2s(cx + XENO_SPOTS.pad[0], cy + XENO_SPOTS.pad[1]); ctx.strokeStyle = 'rgba(255,240,150,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(px, py, 150*z, 150*z*R.SQ, 0, 0, TAU); ctx.stroke(); // landing pad
      for (let i = 0; i < 8; i++) { const a = i/8*TAU, on = (i + Math.floor(time*4)) % 2; ctx.fillStyle = on ? '#fff3a0' : '#a08a30'; ctx.beginPath(); ctx.arc(px + Math.cos(a)*150*z, py + Math.sin(a)*150*z*R.SQ, 4*z, 0, TAU); ctx.fill(); } }
    { const [qx, qy] = w2s(cx, cy - 500); const [ex, ey] = w2s(cx, cy + XENO_SPOTS.spire[1] + 150); ctx.strokeStyle = 'rgba(63,230,255,0.5)'; ctx.lineWidth = 4*z; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(ex, ey); ctx.stroke(); } // path to the spire
  };
  R.xenoSpot = (ctx, sx, sy, z, time, kind, state, label, sub) => { // core / spire beacon. state: 'ready' | 'cd' | 'locked' | 'done'
    const s = z*(kind === 'spire' ? 1.3 : 1), col = state === 'locked' ? '#566' : kind === 'spire' ? '#c890ff' : CY;
    if (kind === 'spire') { ctx.strokeStyle = col; ctx.lineWidth = 6*s; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const k = i/60, a = k*TAU*3 + time*0.4, r = (90 - k*70)*s; const x = sx + Math.cos(a)*r, y = sy - k*260*s + Math.sin(a)*r*0.35; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } // spiral spire
    else { ctx.fillStyle = '#0b1a24'; ctx.beginPath(); ctx.ellipse(sx, sy, 70*s, 22*s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#16303e'; ctx.fillRect(sx - 30*s, sy - 70*s, 60*s, 70*s); }
    const oy = sy - (kind === 'spire' ? 300 : 110)*s + Math.sin(time*2)*6*s;
    if (state !== 'locked') glow(ctx, sx, oy, (state === 'ready' ? 90 : 50)*s, kind === 'spire' ? 'rgba(200,140,255,0.7)' : 'rgba(80,240,255,0.7)');
    ctx.fillStyle = '#041018'; ctx.beginPath(); ctx.arc(sx, oy, 26*s, 0, TAU); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3*s; ctx.stroke();
    ctx.fillStyle = col; ctx.font = `900 ${24*s}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(state === 'done' ? '✔' : '🛸', sx, oy + 8*s);
    ctx.font = `800 ${Math.max(11, 13*z)}px ${FONT}`; ctx.shadowColor = '#000'; ctx.shadowBlur = 5; ctx.fillText(label, sx, oy - 40*s); if (sub) { ctx.font = `600 ${Math.max(10, 11*z)}px ${FONT}`; ctx.fillStyle = '#cde'; ctx.fillText(sub, sx, oy - 40*s + 15*z); } ctx.shadowBlur = 0;
  };

  // ---------------- Xeno aura overlay on characters (grows with Xeno level) ----------------
  R.xenoAura = (ctx, sx, sy, z, lv, time) => {
    if (!lv) return; const s = z, cy = sy - 40*s, tier = lv >= 50 ? 3 : lv >= 25 ? 2 : lv >= 10 ? 1 : 0;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 2 + tier; i++) { const r = ((time*0.5 + i/(2 + tier)) % 1); ctx.strokeStyle = `rgba(80,240,255,${(1 - r)*0.6})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, (20 + r*70)*s, (20 + r*70)*s*R.SQ, 0, 0, TAU); ctx.stroke(); } // signal rings
    if (tier >= 1) for (let i = 0; i < 6 + tier*4; i++) { const a = time*(1 + (i % 3)*0.4) + i*2.1, rr = (28 + (i % 4)*8)*s, x = sx + Math.cos(a)*rr, y = cy + Math.sin(a*1.3)*rr*0.8; ctx.fillStyle = i % 2 ? 'rgba(120,255,255,0.9)' : 'rgba(210,150,255,0.9)'; ctx.fillRect(x - 1.5, y - 1.5, 3, 3); } // quantum particles
    if (tier >= 2) { ctx.strokeStyle = 'rgba(200,150,255,0.45)'; ctx.lineWidth = 1.5; for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= 30; i++) { const a = i/30*TAU, r = (46 + k*6 + Math.sin(a*5 + time*3 + k)*5)*s; const x = sx + Math.cos(a)*r, y = cy + Math.sin(a)*r*0.95; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } } // warped space
    if (tier >= 3) { glow(ctx, sx, cy, 70*s, 'rgba(120,80,255,0.25)'); for (let i = 0; i < 3; i++) { const a = time*0.8 + i*TAU/3; ufoMini(ctx, sx + Math.cos(a)*55*s, cy - 30*s + Math.sin(a)*14*s, s*0.18, time); } } // tiny escort saucers
    ctx.restore();
  };
  function ufoMini(ctx, x, y, s, time){ ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#9ab'; ctx.beginPath(); ctx.ellipse(x, y, 90*s, 20*s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(160,255,255,0.9)'; ctx.beginPath(); ctx.ellipse(x, y - 10*s, 36*s, 26*s, 0, Math.PI, TAU); ctx.fill(); ctx.globalCompositeOperation = 'lighter'; }
  // aura skin "Xeno Signal" (A.xenoRing): a ring of rotating alien glyphs
  const baseExtra = R.auraExtra;
  R.auraExtra = (ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy) => {
    baseExtra(ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy); if (!A.xenoRing) return;
    const gl = '⏃⏚⌇⍜⎍⟒⋏⌰⍀'; ctx.save(); ctx.font = `700 ${11*sc}px serif`; ctx.textAlign = 'center';
    for (let i = 0; i < 9; i++) { const a = time*0.7 + i*TAU/9, d = Math.sin(a); if ((d < 0) !== back) continue; ctx.fillStyle = i % 2 ? '#7ff8ff' : '#d0a0ff'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.fillText(gl[i], cx + Math.cos(a)*w*1.5, cy - h*0.1 + d*w*0.4); }
    ctx.restore();
  };

  // =================== Alien bosses (original designs) ===================
  // 1. Kẻ Gác Đĩa — tripod warden with one red scanning eye and a hex quantum shield
  X.xg_tripod = (ctx, S, time, v) => {
    const [tx, ty] = (v && v.target) || [-300, -60], bob = Math.sin(time*1.3)*S*0.015, hy = -S*0.95 + bob;
    for (const [lx, ph] of [[-0.42, 0], [0.42, 1.2], [0.05, 2.4]]) { const k = Math.sin(time*1.1 + ph)*S*0.02; ctx.strokeStyle = '#6a7684'; ctx.lineWidth = S*0.035; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(lx*0.3*S, hy + S*0.08); ctx.quadraticCurveTo(lx*S*1.1, -S*0.62 + k, lx*S, 0); ctx.stroke(); ctx.strokeStyle = '#3fe6ff'; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.fillStyle = '#4a5664'; ctx.beginPath(); ctx.ellipse(0, hy, S*0.28, S*0.13, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#8898a8'; ctx.beginPath(); ctx.ellipse(0, hy - S*0.04, S*0.24, S*0.08, 0, Math.PI, TAU); ctx.fill();
    const a = Math.atan2(ty - hy, tx), ex = Math.cos(a)*S*0.12, ey = hy + Math.sin(a)*S*0.04; ctx.fillStyle = '#100'; ctx.beginPath(); ctx.arc(ex, ey, S*0.05, 0, TAU); ctx.fill(); ctx.fillStyle = '#ff2030'; ctx.beginPath(); ctx.arc(ex, ey, S*0.03, 0, TAU); ctx.fill(); glow(ctx, ex, ey, S*0.1, 'rgba(255,30,40,0.8)');
    const sw = Math.sin(time*1.6)*0.5; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,40,40,0.12)'; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - S*1.2, ey + S*(0.4 + sw)); ctx.lineTo(ex - S*1.2, ey + S*(0.7 + sw)); ctx.fill(); ctx.restore(); // scan beam
    ctx.save(); ctx.strokeStyle = `rgba(80,200,255,${0.35 + Math.sin(time*3)*0.15})`; ctx.lineWidth = 1.5; const R0 = S*0.62; // hex quantum shield
    for (let i = 0; i < 18; i++) { const a2 = i/18*TAU, cx = Math.cos(a2)*R0*0.8, cy = -S*0.6 + Math.sin(a2)*R0; ctx.beginPath(); for (let k2 = 0; k2 < 6; k2++) { const b = k2/6*TAU; ctx.lineTo(cx + Math.cos(b)*S*0.06, cy + Math.sin(b)*S*0.06); } ctx.closePath(); ctx.stroke(); }
    ctx.restore(); if (v.hurt > 0) glow(ctx, 0, -S*0.6, S*0.7, 'rgba(120,220,255,0.35)');
  };
  // 2. Kẻ Quan Sát — big-headed floating grey, black eyes; it copies you (ghost silhouette behind)
  X.x_watcher = (ctx, S, time, v) => {
    const fl = Math.sin(time*1.2)*S*0.04, hy = -S*0.95 + fl;
    glow(ctx, 0, hy, S*0.7, 'rgba(120,255,180,0.18)');
    ctx.save(); ctx.globalAlpha = 0.25 + Math.sin(time*2)*0.1; ctx.strokeStyle = '#9fffc8'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.arc(S*0.28, -S*0.95, S*0.07, 0, TAU); ctx.moveTo(S*0.28, -S*0.88); ctx.lineTo(S*0.28, -S*0.55); ctx.lineTo(S*0.2, -S*0.3); ctx.moveTo(S*0.28, -S*0.55); ctx.lineTo(S*0.36, -S*0.3); ctx.moveTo(S*0.2, -S*0.78); ctx.lineTo(S*0.36, -S*0.78); ctx.stroke(); ctx.restore(); // copied stickman echo
    ctx.fillStyle = '#9aa29c'; ctx.beginPath(); ctx.moveTo(-S*0.06, hy + S*0.18); ctx.lineTo(S*0.06, hy + S*0.18); ctx.lineTo(S*0.045, hy + S*0.6); ctx.lineTo(-S*0.045, hy + S*0.6); ctx.fill(); // thin body
    ctx.strokeStyle = '#9aa29c'; ctx.lineWidth = S*0.016; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.05, hy + S*0.25); ctx.quadraticCurveTo(k*S*0.18, hy + S*0.4, k*S*0.16 + Math.sin(time*2 + k)*S*0.02, hy + S*0.55); ctx.stroke(); }
    const g = ctx.createRadialGradient(-S*0.05, hy - S*0.08, S*0.02, 0, hy, S*0.24); g.addColorStop(0, '#c8d0ca'); g.addColorStop(1, '#6a726c'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, hy + S*0.18); ctx.bezierCurveTo(-S*0.12, hy + S*0.14, -S*0.24, hy - S*0.02, -S*0.2, hy - S*0.14); ctx.bezierCurveTo(-S*0.16, hy - S*0.3, S*0.16, hy - S*0.3, S*0.2, hy - S*0.14); ctx.bezierCurveTo(S*0.24, hy - S*0.02, S*0.12, hy + S*0.14, 0, hy + S*0.18); ctx.fill(); // huge head
    for (const k of [-1, 1]) { ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(k*S*0.085, hy - S*0.02, S*0.065, S*0.035, k*0.5, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(160,255,200,0.7)'; ctx.beginPath(); ctx.arc(k*S*0.07, hy - S*0.035, S*0.008, 0, TAU); ctx.fill(); } // black almond eyes
    ctx.strokeStyle = '#3a403c'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-S*0.015, hy + S*0.1); ctx.lineTo(S*0.015, hy + S*0.1); ctx.stroke();
  };
  // 3. Ký Sinh Hư Không — pulsing flesh mass with glowing tentacles, mouths feeding on damage
  X.x_parasite = (ctx, S, time, v) => {
    const pul = 1 + Math.sin(time*2.4)*0.05 + (v.hurt > 0 ? 0.06 : 0);
    for (let i = 0; i < 9; i++) { const a = -Math.PI*0.1 - i/8*Math.PI*0.8 - Math.PI*0.05, len = S*(0.5 + hash(i, 3)*0.3); ctx.strokeStyle = '#5a1a4a'; ctx.lineWidth = S*0.035*(1 - i*0.03); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -S*0.45);
      let px = 0, py = -S*0.45; for (let k = 1; k <= 8; k++) { const t = k/8, x = Math.cos(a)*len*t + Math.sin(time*2 + i + t*4)*S*0.06*t, y = -S*0.45 + Math.sin(a)*len*t*0.9; ctx.lineTo(x, y); px = x; py = y; } ctx.stroke(); glow(ctx, px, py, S*0.05, 'rgba(255,80,230,0.7)'); }
    const g = ctx.createRadialGradient(-S*0.1, -S*0.55, S*0.03, 0, -S*0.42, S*0.42*pul); g.addColorStop(0, '#d070c0'); g.addColorStop(0.6, '#7a2a6a'); g.addColorStop(1, '#2a0828'); ctx.fillStyle = g;
    ctx.beginPath(); for (let i = 0; i <= 30; i++) { const a = i/30*TAU, r = S*0.36*pul*(1 + Math.sin(a*5 + time*2)*0.06); ctx.lineTo(Math.cos(a)*r, -S*0.42 + Math.sin(a)*r*0.85); } ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) { const a = i*1.7 + 0.4, x = Math.cos(a)*S*0.18, y = -S*0.42 + Math.sin(a)*S*0.15, o = (Math.sin(time*3 + i) + 1)*0.5; ctx.fillStyle = '#200010'; ctx.beginPath(); ctx.ellipse(x, y, S*0.05, S*0.02 + o*S*0.025, a, 0, TAU); ctx.fill(); // feeding mouths
      ctx.fillStyle = '#f0e0e8'; for (let t = -2; t <= 2; t++) { ctx.beginPath(); ctx.arc(x + t*S*0.015, y - S*0.012, S*0.005, 0, TAU); ctx.fill(); } }
    if (v.hurt > 0) glow(ctx, 0, -S*0.42, S*0.5, 'rgba(255,80,230,0.4)'); // it drinks the hit
  };
  // 4. Mẫu Thể Tổ Ong — hive mother: segmented abdomen, crown of drones
  X.x_hive = (ctx, S, time, v) => {
    for (let i = 0; i < 4; i++) { const y = -S*0.15 - i*S*0.17, r = S*(0.3 - i*0.04); ctx.fillStyle = i % 2 ? '#4a3a10' : '#d0a020'; ctx.beginPath(); ctx.ellipse(S*0.15, y, r, S*0.1, 0.2, 0, TAU); ctx.fill(); // abdomen
      ctx.strokeStyle = '#1a1000'; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.fillStyle = '#2a2208'; ctx.beginPath(); ctx.ellipse(-S*0.12, -S*0.85, S*0.14, S*0.16, 0, 0, TAU); ctx.fill(); // head
    for (const k of [-1, 1]) { ctx.fillStyle = '#e8c040'; ctx.beginPath(); ctx.ellipse(-S*0.12 + k*S*0.07, -S*0.88, S*0.05, S*0.07, k*0.3, 0, TAU); ctx.fill(); // compound eyes
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; for (let a = 0; a < 6; a++) { ctx.beginPath(); ctx.arc(-S*0.12 + k*S*0.07 + Math.cos(a)*S*0.025, -S*0.88 + Math.sin(a)*S*0.035, S*0.008, 0, TAU); ctx.fill(); } }
    ctx.strokeStyle = '#2a2208'; ctx.lineWidth = S*0.012; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-S*0.12 + k*S*0.05, -S*0.98); ctx.quadraticCurveTo(-S*0.12 + k*S*0.2, -S*1.2, -S*0.12 + k*S*0.12, -S*1.28); ctx.stroke(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,240,180,0.25)'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(S*0.05 + k*S*0.18, -S*0.75, S*0.32, S*0.1, k*(0.5 + Math.sin(time*30)*0.15), 0, TAU); ctx.fill(); } ctx.restore(); // buzzing wings
    for (let i = 0; i < 14; i++) { const a = time*(1.5 + (i % 3)*0.5) + i*0.45, r = S*(0.6 + (i % 4)*0.1), x = Math.cos(a)*r, y = -S*0.7 + Math.sin(a*1.4)*r*0.5; ctx.fillStyle = '#e0b030'; ctx.beginPath(); ctx.ellipse(x, y, S*0.025, S*0.015, a, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x - S*0.01, y - S*0.02, S*0.02, S*0.008); } // drones
  };
  // 5. Cỗ Máy Đồng Hóa — liquid-metal humanoid that keeps reshaping; mirror sheen
  X.x_mimicry = (ctx, S, time, v) => {
    const g = ctx.createLinearGradient(-S*0.3, -S*1.2, S*0.3, 0); g.addColorStop(0, '#e8f0ff'); g.addColorStop(0.35, '#7a8aa0'); g.addColorStop(0.6, '#f4f8ff'); g.addColorStop(1, '#3a4658');
    ctx.fillStyle = g; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const k = i/40, a = k*TAU; const wob = Math.sin(a*4 + time*2.5)*0.05 + Math.sin(a*7 - time*1.7)*0.03;
      const rx = S*(0.2 + wob)*(1 + Math.max(0, Math.sin(a))*0.4), ry = S*0.55; ctx.lineTo(Math.cos(a)*rx, -S*0.6 + Math.sin(a)*ry); } ctx.closePath(); ctx.fill(); // fluid body
    ctx.beginPath(); ctx.ellipse(0, -S*1.18 + Math.sin(time*2)*S*0.02, S*0.11, S*0.13, 0, 0, TAU); ctx.fill(); // head
    ctx.fillStyle = 'rgba(60,240,255,0.9)'; ctx.fillRect(-S*0.07, -S*1.2, S*0.14, S*0.015); glow(ctx, 0, -S*1.2, S*0.1, 'rgba(60,240,255,0.6)'); // visor
    for (const k of [-1, 1]) { const arm = v.atk > 0 && k < 0 ? 1 : 0; ctx.strokeStyle = '#9aa8bc'; ctx.lineWidth = S*0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(k*S*0.18, -S*0.95);
      ctx.quadraticCurveTo(k*S*0.38, -S*0.75 + Math.sin(time*2 + k)*S*0.05, k*S*(0.35 + arm*0.25), -S*(0.45 + arm*0.3)); ctx.stroke();
      if (k < 0) { ctx.fillStyle = '#d8e4f4'; ctx.beginPath(); ctx.moveTo(k*S*(0.35 + arm*0.25), -S*(0.45 + arm*0.3)); ctx.lineTo(k*S*(0.6 + arm*0.25), -S*(0.4 + arm*0.3)); ctx.lineTo(k*S*(0.36 + arm*0.25), -S*(0.38 + arm*0.3)); ctx.fill(); } } // arm reshaped into a blade
    for (let i = 0; i < 5; i++) { const ph = (time*0.6 + i/5) % 1; ctx.fillStyle = `rgba(200,220,255,${1 - ph})`; ctx.beginPath(); ctx.arc(Math.sin(i*2)*S*0.15, -S*0.1 + ph*S*0.1, S*0.02*(1 - ph), 0, TAU); ctx.fill(); } // dripping metal
    if (v.hurt > 0) { ctx.strokeStyle = 'rgba(120,240,255,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -S*0.6, S*0.7, -0.8, 0.8); ctx.stroke(); } // reflection flash
  };
  // 6. Kẻ Gieo Hạt Tinh Vân — cosmic sower: cloak of nebula, scatters star-seeds, ringed halo
  X.x_sower = (ctx, S, time, v) => {
    glow(ctx, 0, -S*0.8, S*1.1, 'rgba(140,90,255,0.25)');
    ctx.save(); ctx.translate(0, -S*0.95); ctx.rotate(time*0.2); ctx.strokeStyle = 'rgba(200,170,255,0.6)'; ctx.lineWidth = 2; for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.ellipse(0, 0, S*(0.35 + r*0.12), S*(0.1 + r*0.04), r*0.6, 0, TAU); ctx.stroke(); } ctx.restore(); // orbital halo
    const g = ctx.createLinearGradient(0, -S*1.0, 0, 0); g.addColorStop(0, '#2a1060'); g.addColorStop(0.5, '#3a1a8a'); g.addColorStop(1, '#0a0420');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.95); ctx.quadraticCurveTo(-S*0.5, -S*0.4, -S*0.45 + Math.sin(time)*S*0.03, 0); ctx.lineTo(S*0.45 + Math.sin(time + 1)*S*0.03, 0); ctx.quadraticCurveTo(S*0.5, -S*0.4, S*0.12, -S*0.95); ctx.fill(); // nebula cloak
    for (let i = 0; i < 30; i++) { const x = (hash(i, 1) - 0.5)*S*0.8*(hash(i, 2)), y = -hash(i, 3)*S*0.9; ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(time*3 + i)*0.4})`; ctx.fillRect(x, y, 2, 2); } // stars inside the cloak
    ctx.fillStyle = '#05020c'; ctx.beginPath(); ctx.ellipse(0, -S*1.05, S*0.11, S*0.13, 0, 0, TAU); ctx.fill(); // hood void
    for (const k of [-1, 1]) { ctx.fillStyle = '#fff8d0'; ctx.beginPath(); ctx.arc(k*S*0.035, -S*1.06, S*0.012, 0, TAU); ctx.fill(); glow(ctx, k*S*0.035, -S*1.06, S*0.04, 'rgba(255,240,180,0.8)'); }
    const hx = -S*0.42, hy = -S*0.6 + (v.atk > 0 ? -S*0.1 : 0); ctx.strokeStyle = '#3a1a8a'; ctx.lineWidth = S*0.04; ctx.beginPath(); ctx.moveTo(-S*0.15, -S*0.8); ctx.lineTo(hx, hy); ctx.stroke(); // sowing hand
    for (let i = 0; i < 10; i++) { const ph = (time*0.8 + i/10) % 1, x = hx - ph*S*0.6 + Math.sin(i*3)*S*0.05, y = hy + ph*ph*S*0.5; ctx.fillStyle = i % 2 ? '#c8a0ff' : '#80f0ff'; ctx.beginPath(); ctx.arc(x, y, S*0.012*(1 - ph*0.5), 0, TAU); ctx.fill(); glow(ctx, x, y, S*0.03, 'rgba(180,160,255,0.5)'); } // star seeds
  };
})();
