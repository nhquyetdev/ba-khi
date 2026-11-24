// GodK Bá Khí v2.0 — Nightmare Sanctum: five horror bosses, nightmare floor / pedestals, "Thousand Eyes" aura
'use strict';
(() => {
  const TAU = Math.PI*2, { eye } = R, X = R.extra;
  const glow = (ctx, x, y, r, rgba) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };
  const hash = (i, k) => { const x = Math.sin(i*127.1 + k*311.7)*43758.5453; return x - Math.floor(x); };
  const tgt = v => (v && v.target) || [-300, -60];
  // drifting dread particles shared by every nightmare boss (black ash + red motes rising)
  function dread(ctx, S, time, col){
    for (let i = 0; i < 18; i++) { const ph = (time*0.25 + hash(i, 1)) % 1, x = (hash(i, 2) - 0.5)*S*1.4 + Math.sin(time + i)*S*0.03, y = -ph*S*1.5;
      ctx.fillStyle = i % 3 ? `rgba(10,6,8,${(1 - ph)*0.7})` : `rgba(${col},${(1 - ph)*0.6})`; ctx.beginPath(); ctx.arc(x, y, S*(0.006 + hash(i, 3)*0.012), 0, TAU); ctx.fill(); }
  }
  function drip(ctx, x, y, len, w, time, k, col){ // a slow drip hanging from (x,y)
    const ph = (time*0.5 + k) % 1, l = len*(0.4 + ph*0.6); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w*0.3, y + l*0.7, x, y + l); ctx.quadraticCurveTo(x + w*0.3, y + l*0.7, x + w, y); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y + l, w*0.9, 0, TAU); ctx.fill();
  }

  // ---------------- 1. Long Thi — the Corpse Dragon (bones, rotting flesh, eyes along the spine) ----------------
  X.nm_azure = (ctx, S, time, v) => {
    const [tx, ty] = tgt(v), N = 44, pts = [];
    glow(ctx, 0, -S*0.6, S*0.9, 'rgba(70,140,60,0.25)');
    for (let i = 0; i < N; i++) { const k = i/(N - 1); pts.push([Math.sin(k*6.5 + time*0.9)*S*0.44*(1 - k*0.2), -S*(1.15 - k*1.08) + Math.cos(k*4 + time*0.8)*S*0.05]); }
    for (let i = N - 1; i > 0; i--) { const [x, y] = pts[i], r = S*(0.075 - i*0.0011);
      if (i % 2 === 0) { ctx.strokeStyle = '#bdb39a'; ctx.lineWidth = Math.max(1, r*0.22); ctx.lineCap = 'round'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s*r*1.6, y + r*0.4, x + s*r*1.1, y + r*1.9); ctx.stroke(); } } // ribs
      const rot = hash(i, 5) < 0.45; ctx.fillStyle = rot ? '#3c4a34' : '#d4cab0'; ctx.beginPath(); ctx.ellipse(x, y, r, r*0.8, 0, 0, TAU); ctx.fill(); // vertebra or rotting flesh
      ctx.fillStyle = rot ? '#24301e' : '#a49a80'; ctx.beginPath(); ctx.arc(x, y, r*0.35, 0, TAU); ctx.fill();
      ctx.fillStyle = '#e0d6bc'; ctx.beginPath(); ctx.moveTo(x - r*0.2, y - r*0.6); ctx.lineTo(x, y - r*1.5); ctx.lineTo(x + r*0.2, y - r*0.6); ctx.fill(); // spinal spike
      if (rot && i % 3 === 0) drip(ctx, x, y + r*0.6, S*0.06, r*0.18, time, hash(i, 7), 'rgba(60,90,40,0.8)');
      if (i % 5 === 2) eye(ctx, x + r*0.2, y - r*0.1, r*0.55, time + i, tx - x, ty - y, '#7a1010'); } // eyes growing out of the spine
    for (const i of [10, 26]) { const [x, y] = pts[i]; ctx.strokeStyle = '#bdb39a'; ctx.lineWidth = S*0.014; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - S*0.11, y + S*0.1); // skeletal claws
      for (let f = -1; f <= 1; f++) { ctx.moveTo(x - S*0.11, y + S*0.1); ctx.lineTo(x - S*0.16, y + S*0.1 + f*S*0.03); } ctx.stroke(); }
    // skull head
    const [hx, hy] = pts[0], open = v.atk > 0 ? 0.08 : 0.02 + Math.sin(time*2)*0.01; ctx.save(); ctx.translate(hx, hy); ctx.scale(-1.15, 1.15);
    ctx.fillStyle = '#d8cfb4'; ctx.beginPath(); ctx.moveTo(-S*0.07, -S*0.08); ctx.quadraticCurveTo(S*0.12, -S*0.12, S*0.27, -S*0.03); ctx.lineTo(S*0.25, 0); ctx.lineTo(-S*0.05, S*0.01); ctx.closePath(); ctx.fill(); // upper skull
    ctx.beginPath(); ctx.moveTo(-S*0.03, S*0.02); ctx.lineTo(S*0.22, S*(0.02 + open)); ctx.lineTo(S*0.2, S*(0.05 + open)); ctx.lineTo(-S*0.04, S*0.06); ctx.fill(); // jaw
    ctx.fillStyle = '#efe8d4'; for (let i = 0; i < 7; i++) { const x = S*(0.04 + i*0.03); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + S*0.008, S*0.03); ctx.lineTo(x + S*0.016, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, S*(0.03 + open)); ctx.lineTo(x + S*0.008, S*(0.005 + open)); ctx.lineTo(x + S*0.016, S*(0.03 + open)); ctx.fill(); }
    ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.ellipse(S*0.08, -S*0.06, S*0.035, S*0.022, 0.2, 0, TAU); ctx.fill(); // eye socket
    glow(ctx, S*0.08, -S*0.06, S*0.06, 'rgba(110,255,90,0.9)');
    ctx.strokeStyle = '#8a8068'; ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.moveTo(-S*0.04, -S*0.07); ctx.quadraticCurveTo(-S*0.2, -S*0.24, -S*0.12, -S*0.34); ctx.moveTo(S*0.0, -S*0.09); ctx.quadraticCurveTo(-S*0.08, -S*0.28, S*0.02, -S*0.36); ctx.stroke(); // broken horns
    ctx.restore();
    dread(ctx, S, time, '120,220,90');
  };

  // ---------------- 2. Hổ Vô Diện — the Faceless Tiger (no eyes, a human mouth, too-long limbs) ----------------
  X.nm_tiger = (ctx, S, time, v) => {
    const br = Math.sin(time*1.6)*S*0.008, lunge = v.atk > 0 ? -S*0.14 : 0, skin = '#d6cdc4', shade = '#9a8e84';
    glow(ctx, 0, -S*0.5, S*0.8, 'rgba(150,0,20,0.18)');
    ctx.save(); ctx.translate(lunge, 0);
    // too-long, too-thin legs with backward knees
    for (const [x, d, ph] of [[-0.22, 1, 0], [-0.08, -1, 1.5], [0.3, 1, 3], [0.42, -1, 4.5]]) { const k = Math.sin(time*1.2 + ph)*0.04;
      ctx.strokeStyle = shade; ctx.lineWidth = S*0.028; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x*S, -S*0.5); ctx.lineTo(x*S + d*S*(0.1 + k), -S*0.27); ctx.lineTo(x*S - d*S*0.03, 0); ctx.stroke();
      ctx.strokeStyle = '#2a1a1a'; ctx.lineWidth = 1.5; for (let f = -1; f <= 1; f++) { ctx.beginPath(); ctx.moveTo(x*S - d*S*0.03, 0); ctx.lineTo(x*S - d*S*0.03 + f*S*0.025, S*0.012); ctx.stroke(); } }
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(S*0.1, -S*0.56 + br, S*0.38, S*0.13, -0.04, 0, TAU); ctx.fill(); // emaciated body
    ctx.strokeStyle = 'rgba(80,60,55,0.5)'; ctx.lineWidth = 1.5; for (let i = 0; i < 6; i++) { const x = -S*0.08 + i*S*0.06; ctx.beginPath(); ctx.moveTo(x, -S*0.5 + br); ctx.quadraticCurveTo(x + S*0.02, -S*0.47, x + S*0.01, -S*0.44); ctx.stroke(); } // visible ribs
    ctx.strokeStyle = '#8a0a14'; ctx.lineWidth = S*0.012; for (let i = 0; i < 6; i++) { const x = -S*0.12 + i*S*0.08; ctx.beginPath(); ctx.moveTo(x, -S*0.67 + br); ctx.lineTo(x + S*0.03, -S*0.58); ctx.lineTo(x - S*0.005, -S*0.5); ctx.stroke(); // stripes are claw wounds
      if (i % 2 === 0) drip(ctx, x - S*0.005, -S*0.5, S*0.05, S*0.006, time, i*0.3, 'rgba(120,0,15,0.85)'); }
    ctx.strokeStyle = shade; ctx.lineWidth = S*0.016; ctx.beginPath(); ctx.moveTo(S*0.47, -S*0.58); ctx.bezierCurveTo(S*0.7, -S*0.62, S*0.62, -S*0.95, S*0.78 + Math.sin(time*2)*S*0.05, -S*1.05); ctx.stroke(); // hairless tail
    // the head: smooth, eyeless, with a wide human mouth
    const hx = -S*0.36, hy = -S*0.7 + br + Math.sin(time*0.7)*S*0.01, tilt = Math.sin(time*0.5)*0.12 + (v.hurt > 0 ? 0.3 : 0);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt);
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, 0, S*0.15, S*0.17, 0, 0, TAU); ctx.fill();
    const sh = ctx.createRadialGradient(-S*0.04, -S*0.06, S*0.02, 0, 0, S*0.17); sh.addColorStop(0, 'rgba(255,255,255,0.25)'); sh.addColorStop(1, 'rgba(60,40,40,0.35)'); ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(0, 0, S*0.15, S*0.17, 0, 0, TAU); ctx.fill();
    const mo = v.atk > 0 ? S*0.06 : S*0.022 + Math.sin(time*1.3)*S*0.006; // mouth opens on attack
    ctx.fillStyle = '#6a0a14'; ctx.beginPath(); ctx.moveTo(-S*0.12, S*0.04); ctx.quadraticCurveTo(0, S*0.04 + mo*2.2, S*0.12, S*0.04); ctx.quadraticCurveTo(0, S*0.06 - mo*0.3, -S*0.12, S*0.04); ctx.fill(); // gums
    ctx.fillStyle = '#f4efe2'; for (let i = 0; i < 12; i++) { const x = -S*0.105 + i*S*0.019, top = S*0.045 + Math.abs(x)*0.05; ctx.fillRect(x, top, S*0.016, S*0.02); ctx.fillRect(x, top + mo*1.5 - S*0.008, S*0.016, S*0.016); } // human teeth, two rows
    ctx.strokeStyle = 'rgba(70,40,40,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-S*0.125, S*0.03); ctx.quadraticCurveTo(-S*0.14, S*0.0, -S*0.13, -S*0.02); ctx.moveTo(S*0.125, S*0.03); ctx.quadraticCurveTo(S*0.14, S*0.0, S*0.13, -S*0.02); ctx.stroke(); // smile lines
    ctx.restore(); ctx.restore();
    dread(ctx, S, time, '200,20,40');
  };

  // ---------------- 3. Chu Tước Tro Tàn — the Ashen Bird (charred bones, wax wings, candles) ----------------
  X.nm_phoenix = (ctx, S, time, v) => {
    const cy = -S*0.78, fl = Math.sin(time*1.4)*0.12;
    glow(ctx, 0, cy, S*0.8, 'rgba(255,120,40,0.18)');
    for (const k of [-1, 1]) for (let f = 0; f < 6; f++) { // wing bones (finger-like) with dripping wax and candles at the tips
      const a = -Math.PI/2 + k*(0.45 + f*0.22 + fl), len = S*(0.66 - Math.abs(f - 2)*0.05), ex = Math.cos(a)*len, ey = cy + Math.sin(a)*len, mx = Math.cos(a - k*0.25)*len*0.5, my = cy + Math.sin(a - k*0.25)*len*0.5;
      ctx.strokeStyle = '#4a3a32'; ctx.lineWidth = S*0.026; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = '#8a7462'; ctx.lineWidth = S*0.008; ctx.stroke();
      for (let m = 0; m < 3; m++) { const q = 0.35 + m*0.22, wx = mx + (ex - mx)*q, wy = my + (ey - my)*q; ctx.fillStyle = 'rgba(70,55,48,0.55)'; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + k*S*0.03, wy + S*0.05 + Math.sin(time*2 + m + f)*S*0.01); ctx.lineTo(wx - k*S*0.01, wy + S*0.035); ctx.fill(); } // tattered skin membrane
      ctx.strokeStyle = `rgba(255,${90 + f*15},20,${0.55 + Math.sin(time*6 + f)*0.25})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mx*0.6, cy + (my - cy)*0.6); ctx.lineTo(mx, my); ctx.lineTo(ex*0.85, cy + (ey - cy)*0.85); ctx.stroke(); // ember cracks
      if (f % 2 === 0) { const wx = mx + (ex - mx)*0.7, wy = my + (ey - my)*0.7; ctx.fillStyle = 'rgba(235,225,200,0.9)'; ctx.beginPath(); ctx.ellipse(wx, wy, S*0.018, S*0.012, a, 0, TAU); ctx.fill(); drip(ctx, wx, wy + S*0.006, S*0.07, S*0.012, time, f*0.2 + k, 'rgba(235,225,200,0.9)'); } // melted wax pooling on the bone
      ctx.fillStyle = '#e8e0c8'; ctx.fillRect(ex - S*0.009, ey - S*0.05, S*0.018, S*0.05); // candle
      const fh = S*(0.03 + Math.sin(time*14 + f*2 + k)*0.008); ctx.fillStyle = '#ffcf60'; ctx.beginPath(); ctx.ellipse(ex, ey - S*0.05 - fh*0.5, S*0.008, fh*0.6, 0, 0, TAU); ctx.fill(); glow(ctx, ex, ey - S*0.06, S*0.05, 'rgba(255,170,60,0.7)'); }
    ctx.fillStyle = '#1e1614'; ctx.beginPath(); ctx.ellipse(0, cy + S*0.06, S*0.06, S*0.16, 0, 0, TAU); ctx.fill(); // charred ribcage
    ctx.strokeStyle = '#3a2a22'; ctx.lineWidth = S*0.01; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, cy + i*S*0.035 - S*0.02, S*0.06, 0.2, Math.PI - 0.2); ctx.stroke(); }
    glow(ctx, 0, cy + S*0.06, S*0.07, 'rgba(255,90,20,0.55)'); // the last ember inside the ribs
    for (let i = 0; i < 4; i++) { const a = Math.PI/2 + (i - 1.5)*0.2, len = S*0.45; ctx.strokeStyle = '#2a201c'; ctx.lineWidth = S*0.01; ctx.beginPath(); ctx.moveTo(0, cy + S*0.2); ctx.quadraticCurveTo(Math.cos(a)*len*0.5 + Math.sin(time + i)*S*0.04, cy + S*0.2 + len*0.5, Math.cos(a)*len, cy + S*0.2 + Math.sin(a)*len*0.9); ctx.stroke(); } // bare tail quills
    // bird skull
    const hx = -S*0.02, hy = cy - S*0.2 - (v.atk > 0 ? S*0.03 : 0); ctx.fillStyle = '#d8ccb0'; ctx.beginPath(); ctx.ellipse(hx, hy, S*0.055, S*0.05, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx - S*0.04, hy - S*0.01); ctx.lineTo(hx - S*0.16, hy + S*0.03 + (v.atk > 0 ? S*0.02 : 0)); ctx.lineTo(hx - S*0.04, hy + S*0.02); ctx.fill(); // beak
    ctx.fillStyle = '#0a0606'; ctx.beginPath(); ctx.arc(hx - S*0.012, hy - S*0.005, S*0.02, 0, TAU); ctx.fill();
    const ff = S*(0.018 + Math.sin(time*16)*0.004); ctx.fillStyle = '#ffd070'; ctx.beginPath(); ctx.ellipse(hx - S*0.012, hy - S*0.01, S*0.006, ff, 0, 0, TAU); ctx.fill(); glow(ctx, hx - S*0.012, hy - S*0.01, S*0.04, 'rgba(255,160,40,0.8)'); // candle flame in the socket
    for (let i = 0; i < 16; i++) { const ph = (time*0.3 + hash(i, 4)) % 1; ctx.fillStyle = `rgba(140,135,130,${(1 - ph)*0.7})`; ctx.fillRect((hash(i, 6) - 0.5)*S*1.2, -S*1.3 + ph*S*1.35, 2.5, 2.5); } // falling ash
  };

  // ---------------- 4. Huyền Vũ Mộ Phần — the Grave Tortoise (a graveyard on its back, hands from the soil) ----------------
  X.nm_tortoise = (ctx, S, time, v) => {
    const [tx, ty] = tgt(v);
    ctx.fillStyle = 'rgba(20,40,30,0.35)'; ctx.beginPath(); ctx.ellipse(0, -S*0.02, S*0.75, S*0.09, 0, 0, TAU); ctx.fill(); // fog
    ctx.strokeStyle = '#3a3a30'; ctx.lineWidth = S*0.08; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.33, -S*0.2); ctx.lineTo(k*S*0.45, -S*0.02); ctx.stroke(); }
    // skull head on a long neck
    const nx = -S*0.62, ny = -S*0.32 - (v.atk > 0 ? S*0.06 : 0) + Math.sin(time*0.8)*S*0.015; ctx.strokeStyle = '#3a3a30'; ctx.lineWidth = S*0.06; ctx.beginPath(); ctx.moveTo(-S*0.38, -S*0.22); ctx.quadraticCurveTo(-S*0.5, -S*0.36, nx, ny); ctx.stroke();
    ctx.fillStyle = '#cfc6ae'; ctx.beginPath(); ctx.ellipse(nx, ny, S*0.075, S*0.06, -0.2, 0, TAU); ctx.fill(); ctx.fillStyle = '#0a0a08'; ctx.beginPath(); ctx.arc(nx - S*0.02, ny - S*0.01, S*0.016, 0, TAU); ctx.fill(); glow(ctx, nx - S*0.02, ny - S*0.01, S*0.04, 'rgba(90,255,200,0.8)');
    // burial mound shell
    const g = ctx.createLinearGradient(0, -S*0.62, 0, -S*0.2); g.addColorStop(0, '#2a2620'); g.addColorStop(1, '#14120e'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, -S*0.24, S*0.48, S*0.36, 0, Math.PI, TAU); ctx.lineTo(S*0.48, -S*0.18); ctx.lineTo(-S*0.48, -S*0.18); ctx.fill();
    for (const [x, y, h, tilt] of [[-0.28, -0.42, 0.12, -0.2], [-0.08, -0.56, 0.15, 0.06], [0.14, -0.53, 0.13, 0.15], [0.32, -0.38, 0.1, 0.3]]) { // tombstones
      ctx.save(); ctx.translate(x*S, y*S); ctx.rotate(tilt); ctx.fillStyle = '#6a6a62'; ctx.beginPath(); ctx.moveTo(-S*0.04, 0); ctx.lineTo(-S*0.04, -h*S + S*0.02); ctx.quadraticCurveTo(0, -h*S - S*0.02, S*0.04, -h*S + S*0.02); ctx.lineTo(S*0.04, 0); ctx.fill();
      ctx.fillStyle = '#3a3a34'; ctx.font = `900 ${S*0.04}px serif`; ctx.textAlign = 'center'; ctx.fillText('墓', 0, -h*S*0.45); ctx.restore(); }
    for (let i = 0; i < 3; i++) { const x = -S*0.2 + i*S*0.2, y = -S*0.48 + Math.abs(i - 1)*S*0.07; ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + S*0.005, y - S*0.06); ctx.stroke(); // incense
      for (let j = 0; j < 4; j++) { const ph = (time*0.4 + j/4 + i*0.3) % 1; ctx.fillStyle = `rgba(200,200,190,${(1 - ph)*0.25})`; ctx.beginPath(); ctx.arc(x + Math.sin(time*2 + j)*S*0.02, y - S*0.06 - ph*S*0.2, S*0.015*(1 + ph), 0, TAU); ctx.fill(); } }
    for (let i = 0; i < 4; i++) { const k = i/3, x = -S*0.36 + k*S*0.72, base = -S*0.2 - Math.sin(k*Math.PI)*S*0.16, reach = (Math.sin(time*1.1 + i*1.7)*0.5 + 0.5)*S*0.1 + (v.atk > 0 ? S*0.06 : 0); // pale hands clawing out of the soil
      ctx.strokeStyle = '#bfb8a8'; ctx.lineWidth = S*0.016; ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x + S*0.01, base - S*0.05 - reach); ctx.stroke();
      ctx.lineWidth = S*0.006; for (let f = -2; f <= 2; f++) { ctx.beginPath(); ctx.moveTo(x + S*0.01, base - S*0.05 - reach); ctx.lineTo(x + S*0.01 + f*S*0.012, base - S*0.08 - reach + Math.abs(f)*S*0.008); ctx.stroke(); } }
    // bone serpent coiled around the mound
    ctx.fillStyle = '#c8c0a6'; for (let i = 0; i <= 34; i++) { const k = i/34, a = k*TAU*1.15 + time*0.45, x = Math.cos(a)*S*0.44*(1 - k*0.25), y = -S*0.3 + Math.sin(a)*S*0.2 - k*S*0.38; ctx.beginPath(); ctx.ellipse(x, y, S*0.022*(1 - k*0.3), S*0.016, a, 0, TAU); ctx.fill(); }
    const ha = TAU*1.15 + time*0.45, sx = Math.cos(ha)*S*0.33, sy = -S*0.3 + Math.sin(ha)*S*0.2 - S*0.38 - (v.atk > 0 ? S*0.07 : 0); ctx.beginPath(); ctx.ellipse(sx, sy, S*0.05, S*0.032, 0, 0, TAU); ctx.fill();
    eye(ctx, sx - S*0.015, sy - S*0.006, S*0.014, time, tx - sx, ty - sy, '#0a5a40');
    for (let i = 0; i < 6; i++) { const a = time*0.6 + i*TAU/6, x = Math.cos(a)*S*0.6, y = -S*0.55 + Math.sin(a*1.3)*S*0.25; glow(ctx, x, y, S*0.06, 'rgba(90,220,255,0.55)'); ctx.fillStyle = 'rgba(200,255,255,0.9)'; ctx.beginPath(); ctx.arc(x, y, S*0.008, 0, TAU); ctx.fill(); } // will-o'-wisps (ma trơi)
  };

  // ---------------- 5. Hoàng Long Vạn Nhãn — the Thousand-Eyed Dragon (pale flesh covered in eyes) ----------------
  X.nm_yellowdragon = (ctx, S, time, v) => {
    const [tx, ty] = tgt(v), N = 52, pts = [];
    ctx.save(); ctx.translate(0, -S*0.72); ctx.rotate(time*0.12); for (let i = 0; i < 14; i++) { const a = i/14*TAU, x = Math.cos(a)*S*0.95, y = Math.sin(a)*S*0.95; eye(ctx, x, y, S*0.03, time + i, tx - x, ty + S*0.72 - y, '#b08000'); } ctx.restore(); // halo of eyes
    glow(ctx, 0, -S*0.7, S*1.0, 'rgba(255,200,80,0.18)');
    for (let i = 0; i < N; i++) { const k = i/(N - 1); pts.push([Math.sin(k*7.5 + time*0.8)*S*0.5*(1 - k*0.22), -S*(1.22 - k*1.14) + Math.cos(k*5 + time*0.9)*S*0.05]); }
    for (let i = N - 1; i > 0; i--) { const [x, y] = pts[i], r = S*(0.1 - i*0.0013);
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r); g.addColorStop(0, '#efe2b8'); g.addColorStop(0.6, '#c8b27a'); g.addColorStop(1, '#5a4a28'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); // sickly pale flesh
    }
    for (let i = N - 2; i > 0; i -= 2) { const [x, y] = pts[i], r = S*(0.1 - i*0.0013); // every scale is an eye (drawn after the body so none is hidden)
      eye(ctx, x + (hash(i, 1) - 0.5)*r*0.6, y + (hash(i, 2) - 0.5)*r*0.5, r*(0.42 + hash(i, 3)*0.2), time + i*0.7, tx - x, ty - y, i % 6 === 0 ? '#7a0000' : '#a07000'); }
    for (const i of [9, 21, 33, 45]) { const [x, y] = pts[i]; ctx.strokeStyle = '#8a7848'; ctx.lineWidth = S*0.02; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - S*0.13, y + S*0.09);
      for (let f = -2; f <= 2; f++) { ctx.moveTo(x - S*0.13, y + S*0.09); ctx.lineTo(x - S*0.17, y + S*0.09 + f*S*0.022); } ctx.stroke(); }
    // head: no face — one enormous eye splitting open vertically, ringed by teeth
    const [hx, hy] = pts[0]; ctx.save(); ctx.translate(hx, hy); const hs = 1.35;
    ctx.fillStyle = '#d8c690'; ctx.beginPath(); ctx.ellipse(0, 0, S*0.16*hs, S*0.12*hs, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#f4efe2'; for (let i = 0; i < 16; i++) { const a = i/16*TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a)*S*0.1*hs, Math.sin(a)*S*0.08*hs); ctx.lineTo(Math.cos(a + 0.12)*S*0.07*hs, Math.sin(a + 0.12)*S*0.055*hs); ctx.lineTo(Math.cos(a + 0.24)*S*0.1*hs, Math.sin(a + 0.24)*S*0.08*hs); ctx.fill(); } // ring of teeth
    const op = v.atk > 0 ? 1 : 0.75 + Math.sin(time*0.9)*0.25; ctx.fillStyle = '#e8e0d0'; ctx.beginPath(); ctx.ellipse(0, 0, S*0.045*hs*op, S*0.065*hs, 0, 0, TAU); ctx.fill();
    const a = Math.atan2(ty - hy, tx - hx); ctx.fillStyle = '#c00000'; ctx.beginPath(); ctx.arc(Math.cos(a)*S*0.015*hs, Math.sin(a)*S*0.02*hs, S*0.028*hs*op, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(Math.cos(a)*S*0.018*hs, Math.sin(a)*S*0.024*hs, S*0.006*hs, S*0.022*hs*op, 0, 0, TAU); ctx.fill(); // slit pupil
    glow(ctx, 0, 0, S*0.12*hs, 'rgba(255,40,40,0.25)');
    ctx.strokeStyle = '#8a7848'; ctx.lineWidth = S*0.014; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.08, -S*0.1); ctx.quadraticCurveTo(k*S*0.22, -S*0.3, k*S*0.12, -S*0.42); ctx.stroke(); } // horns
    ctx.restore();
    dread(ctx, S, time, '255,200,60');
  };

  // ---------------- Nightmare Sanctum floor & pedestals (cursed === 2) ----------------
  const baseFloor = R.sanctumFloor, basePed = R.sanctumPedestal;
  R.sanctumFloor = (ctx, sx, sy, z, time, cursed) => {
    if (cursed !== 2) return baseFloor(ctx, sx, sy, z, time, cursed);
    ctx.save(); ctx.translate(sx, sy); ctx.scale(1, R.SQ);
    ctx.fillStyle = '#0a0406'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i/8*TAU + TAU/16; ctx.lineTo(Math.cos(a)*560*z, Math.sin(a)*560*z); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(200,0,30,0.55)'; ctx.lineWidth = 4*z; ctx.stroke();
    ctx.strokeStyle = 'rgba(140,0,20,0.5)'; ctx.lineWidth = 2*z; for (let i = 0; i < 12; i++) { let a = hash(i, 1)*TAU, r = 60*z; ctx.beginPath(); ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r); // blood-red cracks
      for (let j = 0; j < 6; j++) { a += (hash(i, j + 3) - 0.5)*0.6; r += 75*z; ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); } ctx.stroke(); }
    const op = Math.max(0, Math.sin(time*0.35))**3; // the floor eye slowly opens
    ctx.fillStyle = '#1a0a0c'; ctx.beginPath(); ctx.ellipse(0, 0, 230*z, 230*z*(0.08 + op*0.42), 0, 0, TAU); ctx.fill();
    if (op > 0.05) { ctx.fillStyle = '#d8cfc0'; ctx.beginPath(); ctx.ellipse(0, 0, 210*z, 210*z*op*0.42, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#7a0010'; ctx.beginPath(); ctx.arc(0, 0, 90*z*Math.min(1, op*1.5), 0, TAU); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, 0, 14*z, 70*z*Math.min(1, op*1.5), 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  R.sanctumPedestal = (ctx, sx, sy, z, time, id, state, label, sub, cursed) => {
    basePed(ctx, sx, sy, z, time, id, state, label, sub, cursed === 2 ? 1 : cursed);
    if (cursed !== 2 || state === 'locked') return;
    const s = z*(id === 'yellowdragon' ? 1.35 : 1), oy = sy - 85*s + Math.sin(time*2 + (SYMBOLS.findIndex(q => q.id === id) + 1)*1.7)*5*s; // an eye opens inside the orb
    ctx.fillStyle = '#0c0204'; ctx.beginPath(); ctx.arc(sx, oy, 22*s, 0, TAU); ctx.fill(); eye(ctx, sx, oy, 17*s, time*0.7 + sx*0.001, 0, 1e5, '#c00010');
    for (let i = 0; i < 3; i++) drip(ctx, sx - 30*s + i*30*s, sy - 40*s, 18*s, 3*s, time, i*0.33 + hash(sx|0, i), 'rgba(120,0,15,0.85)');
  };

  // ---------------- "Thousand Eyes" aura: eyes blink open around the wearer ----------------
  const baseExtra = R.auraExtra;
  R.auraExtra = (ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy) => {
    baseExtra(ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy);
    if (!A.nmEyes) return;
    for (let i = 0; i < 9; i++) { const a = time*0.5 + i*TAU/9, d = Math.sin(a); if ((d < 0) !== back) continue; const px = cx + Math.cos(a)*w*1.7, py = cy - h*0.2 + d*w*0.35 + Math.sin(time*1.3 + i)*h*0.08;
      const op = Math.max(0, Math.sin(time*0.8 + i*1.9)); if (op < 0.1) continue; ctx.save(); ctx.globalAlpha = Math.min(1, op*1.5);
      glow(ctx, px, py, 12*sc, 'rgba(255,0,30,0.45)'); ctx.fillStyle = '#e8e0d0'; ctx.beginPath(); ctx.ellipse(px, py, 7*sc, 4.5*sc*op, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#b00010'; ctx.beginPath(); ctx.arc(px + Math.cos(time + i)*2*sc, py, 3*sc*op, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(px + Math.cos(time + i)*2.2*sc, py, 1.4*sc*op, 0, TAU); ctx.fill(); ctx.restore(); }
  };
})();
