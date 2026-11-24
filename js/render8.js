// GodK Bá Khí v1.9 — trait bosses, Archangels, Four Symbols + Yellow Dragon, cursed variants, Sanctum map
'use strict';
(() => {
  const TAU = Math.PI*2, { rnd, eye } = R, X = R.extra;
  const C = (v, n, c) => v.cursed ? c : n;
  const glow = (ctx, x, y, r, rgba) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };

  // ---------------- trait bosses ----------------
  X.lich = (ctx, S, time, v) => {
    const fl = Math.sin(time*1.2)*S*0.02;
    ctx.save(); ctx.translate(0, -fl);
    ctx.fillStyle = '#16201a'; ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.88); ctx.lineTo(S*0.12, -S*0.88); ctx.lineTo(S*0.3, -S*0.02); for (let i = 0; i < 8; i++) ctx.lineTo(S*(0.3 - i*0.075), (i%2) ? -S*0.1 : -S*0.02); ctx.lineTo(-S*0.3, -S*0.02); ctx.fill();
    ctx.strokeStyle = '#4fe08a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.88); ctx.lineTo(-S*0.3, -S*0.02); ctx.moveTo(S*0.12, -S*0.88); ctx.lineTo(S*0.3, -S*0.02); ctx.stroke();
    ctx.fillStyle = '#d8d0bc'; ctx.beginPath(); ctx.arc(0, -S*0.97, S*0.085, 0, TAU); ctx.fill(); ctx.fillRect(-S*0.05, -S*0.93, S*0.1, S*0.07);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-S*0.032, -S*0.98, S*0.022, S*0.028, 0, 0, TAU); ctx.ellipse(S*0.032, -S*0.98, S*0.022, S*0.028, 0, 0, TAU); ctx.fill();
    glow(ctx, -S*0.032, -S*0.98, S*0.04, 'rgba(80,255,140,0.9)'); glow(ctx, S*0.032, -S*0.98, S*0.04, 'rgba(80,255,140,0.9)');
    ctx.fillStyle = '#7a6a2a'; ctx.beginPath(); ctx.moveTo(-S*0.09, -S*1.04); for (let i = 0; i <= 6; i++) ctx.lineTo(-S*0.09 + i*S*0.03, -S*((i%2) ? 1.08 : 1.17)); ctx.lineTo(S*0.09, -S*1.04); ctx.fill();
    // staff with skull + green soul flame
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo(S*0.26, -S*0.05); ctx.lineTo(S*0.22, -S*1.15); ctx.stroke();
    ctx.fillStyle = '#d8d0bc'; ctx.beginPath(); ctx.arc(S*0.22, -S*1.18, S*0.035, 0, TAU); ctx.fill();
    for (let i = 0; i < 8; i++) { const ph = (time*1.4 + i/8) % 1; ctx.fillStyle = `rgba(90,255,150,${(1 - ph)*0.8})`; ctx.beginPath(); ctx.arc(S*0.22 + Math.sin(time*5 + i)*S*0.02, -S*1.22 - ph*S*0.2, S*0.02*(1 - ph), 0, TAU); ctx.fill(); }
    // phylactery orbiting
    const a = time*1.3, px = Math.cos(a)*S*0.42, py = -S*0.6 + Math.sin(a)*S*0.12; glow(ctx, px, py, S*0.08, 'rgba(80,255,140,0.7)'); ctx.fillStyle = '#9ff0c0'; ctx.beginPath(); ctx.moveTo(px, py - S*0.04); ctx.lineTo(px + S*0.025, py); ctx.lineTo(px, py + S*0.04); ctx.lineTo(px - S*0.025, py); ctx.fill();
    ctx.restore();
  };
  X.ironarmor = (ctx, S, time, v) => {
    const br = Math.sin(time*0.9)*S*0.006;
    ctx.fillStyle = '#3a4250'; ctx.fillRect(-S*0.2, -S*0.35, S*0.15, S*0.35); ctx.fillRect(S*0.05, -S*0.35, S*0.15, S*0.35);
    ctx.fillStyle = '#4a5466'; ctx.fillRect(-S*0.34, -S*1.0 + br, S*0.68, S*0.66);
    ctx.fillStyle = '#9aa6b8'; for (let y = 0; y < 6; y++) for (let x = 0; x < 7; x++) { ctx.beginPath(); ctx.arc(-S*0.3 + x*S*0.1, -S*0.96 + y*S*0.11 + br, S*0.008, 0, TAU); ctx.fill(); } // rivets
    ctx.strokeStyle = '#2a303a'; ctx.lineWidth = 3; for (let y = 1; y < 6; y++) { ctx.beginPath(); ctx.moveTo(-S*0.34, -S*1.0 + y*S*0.11 + br); ctx.lineTo(S*0.34, -S*1.0 + y*S*0.11 + br); ctx.stroke(); }
    ctx.fillStyle = '#3a4250'; ctx.fillRect(-S*0.13, -S*1.22 + br, S*0.26, S*0.22); ctx.fillStyle = '#6ac0ff'; ctx.shadowColor = '#4af'; ctx.shadowBlur = 14; ctx.fillRect(-S*0.09, -S*1.13 + br, S*0.18, S*0.02); ctx.shadowBlur = 0;
    ctx.fillStyle = '#c8ccd4'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.11, -S*1.2 + br); ctx.quadraticCurveTo(k*S*0.3, -S*1.3, k*S*0.25, -S*1.48); ctx.quadraticCurveTo(k*S*0.2, -S*1.3, k*S*0.06, -S*1.22 + br); ctx.fill(); }
    // tower shield
    const sx = -S*0.42 - (v.atk > 0 ? S*0.08 : 0); ctx.fillStyle = '#5a6478'; ctx.beginPath(); ctx.moveTo(sx - S*0.15, -S*1.05); ctx.lineTo(sx + S*0.15, -S*1.05); ctx.lineTo(sx + S*0.15, -S*0.25); ctx.lineTo(sx, -S*0.1); ctx.lineTo(sx - S*0.15, -S*0.25); ctx.fill();
    ctx.strokeStyle = '#c0c8d8'; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx, -S*0.95); ctx.lineTo(sx, -S*0.3); ctx.moveTo(sx - S*0.1, -S*0.7); ctx.lineTo(sx + S*0.1, -S*0.7); ctx.stroke();
  };
  X.berserker = (ctx, S, time, v) => {
    const sh = Math.sin(time*9)*S*0.004, sw = v.atk > 0 ? 1.3 : Math.sin(time*2.5)*0.15;
    ctx.strokeStyle = '#8a1a14'; ctx.lineWidth = S*0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.38); ctx.lineTo(-S*0.15, -S*0.18); ctx.lineTo(-S*0.12, 0); ctx.moveTo(S*0.06, -S*0.38); ctx.lineTo(S*0.16, -S*0.2); ctx.lineTo(S*0.14, 0); ctx.stroke();
    ctx.fillStyle = '#a82218'; ctx.beginPath(); ctx.moveTo(-S*0.16, -S*0.85 + sh); ctx.lineTo(S*0.16, -S*0.85 + sh); ctx.lineTo(S*0.09, -S*0.38); ctx.lineTo(-S*0.09, -S*0.38); ctx.fill();
    ctx.strokeStyle = '#3a0505'; ctx.lineWidth = 1.5; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-S*0.1 + i*S*0.05, -S*0.8); ctx.lineTo(-S*0.05 + i*S*0.05, -S*0.55); ctx.stroke(); } // scars
    ctx.fillStyle = '#c02a1c'; ctx.beginPath(); ctx.arc(0, -S*0.93 + sh, S*0.075, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1a0505'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-S*0.08 + i*S*0.02, -S*0.97); ctx.lineTo(-S*0.12 + i*S*0.035 + Math.sin(time*6 + i)*S*0.01, -S*1.13); ctx.lineTo(-S*0.06 + i*S*0.02, -S*0.98); ctx.fill(); } // wild hair
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-S*0.028, -S*0.94, S*0.012, 0, TAU); ctx.arc(S*0.028, -S*0.94, S*0.012, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(-S*0.04, -S*0.89, S*0.08, S*0.012);
    for (const k of [-1, 1]) { ctx.save(); ctx.translate(k*S*0.18, -S*0.78); ctx.rotate(k*(0.9 + (k > 0 ? sw : -sw*0.6)));
      ctx.strokeStyle = '#a82218'; ctx.lineWidth = S*0.04; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, S*0.28); ctx.stroke();
      ctx.fillStyle = '#c8ccd0'; ctx.beginPath(); ctx.moveTo(-S*0.03, S*0.26); ctx.lineTo(S*0.03, S*0.26); ctx.lineTo(S*0.12, S*0.72); ctx.lineTo(-S*0.05, S*0.7); ctx.fill();
      ctx.fillStyle = 'rgba(160,0,0,0.6)'; ctx.fillRect(-S*0.03, S*0.5, S*0.1, S*0.08); ctx.restore(); }
  };

  // ---------------- Archangels ----------------
  function wings(ctx, S, time, cx, cy, n, colA, colB, spread, fold){
    for (const k of [-1, 1]) for (let w = 0; w < n; w++) { const base = -Math.PI/2 + k*(0.35 + w*0.55)*spread + Math.sin(time*1.3 + w)*0.05 + k*fold;
      for (let f = 0; f < 9; f++) { const a = base + k*f*0.07, len = S*(0.75 - w*0.12 - f*0.03); ctx.fillStyle = f%2 ? colA : colB;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx + Math.cos(a - k*0.2)*len*0.6, cy + Math.sin(a - k*0.2)*len*0.6, cx + Math.cos(a)*len, cy + Math.sin(a)*len); ctx.lineTo(cx + Math.cos(a + k*0.05)*len*0.85, cy + Math.sin(a + k*0.05)*len*0.85); ctx.closePath(); ctx.fill(); } }
  }
  X.archwrath = (ctx, S, time, v) => {
    const cy = -S*0.85;
    glow(ctx, 0, cy, S*0.9, C(v, 'rgba(255,200,90,0.35)', 'rgba(255,20,60,0.6)'));
    wings(ctx, S, time, 0, cy, 3, C(v, 'rgba(255,235,170,0.85)', 'rgba(120,0,30,0.95)'), C(v, 'rgba(255,210,120,0.75)', 'rgba(230,30,70,0.85)'), 1, 0);
    ctx.fillStyle = C(v, '#e0b040', '#2a0a12'); ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.92); ctx.lineTo(S*0.12, -S*0.92); ctx.lineTo(S*0.2, 0); for (let i = 0; i < 6; i++) ctx.lineTo(S*(0.2 - i*0.08), (i%2) ? -S*0.06 : 0); ctx.lineTo(-S*0.2, 0); ctx.fill();
    ctx.fillStyle = C(v, '#fff2c8', '#3a1a24'); ctx.fillRect(-S*0.11, -S*0.92, S*0.22, S*0.3);
    ctx.fillStyle = C(v, '#f4e8d0', '#cfc0c8'); ctx.beginPath(); ctx.ellipse(0, -S*1.0, S*0.065, S*0.08, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C(v, '#ffb020', '#ff1030'); ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12; ctx.fillRect(-S*0.04, -S*1.01, S*0.025, S*0.01); ctx.fillRect(S*0.015, -S*1.01, S*0.025, S*0.01); ctx.shadowBlur = 0;
    if (v.cursed) { ctx.strokeStyle = '#6a0a1a'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { const a = i/10*TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a)*S*0.1, -S*1.15 + Math.sin(a)*S*0.03); ctx.lineTo(Math.cos(a)*S*0.15, -S*1.15 + Math.sin(a)*S*0.05 - S*0.03); ctx.stroke(); } }
    else { ctx.strokeStyle = '#ffe58a'; ctx.lineWidth = 3; ctx.shadowColor = '#fd5'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(0, -S*1.15, S*0.11, S*0.03, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    // flaming sword raised
    const sw = v.atk > 0 ? -0.2 : -0.6 + Math.sin(time*1.4)*0.05; ctx.save(); ctx.translate(S*0.13, -S*0.85); ctx.rotate(sw);
    ctx.strokeStyle = C(v, '#e0b040', '#2a0a12'); ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.12); ctx.stroke();
    for (let i = 0; i < 26; i++) { const k = i/26, y = -S*0.15 - k*S*0.65; ctx.fillStyle = v.cursed ? `rgba(${120 - k*80},0,${40 + k*40},0.85)` : `hsla(${40 - k*30},100%,${60 + Math.sin(time*12 + i)*10}%,0.85)`;
      ctx.beginPath(); ctx.ellipse(Math.sin(time*9 + i)*S*0.008, y, S*0.03*(1 - k*0.5), S*0.04, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#fff'; ctx.fillRect(-S*0.006, -S*0.78, S*0.012, S*0.63); ctx.restore();
  };
  X.archward = (ctx, S, time, v) => {
    const cy = -S*0.85;
    glow(ctx, 0, cy, S*0.9, C(v, 'rgba(140,200,255,0.35)', 'rgba(190,40,255,0.6)'));
    wings(ctx, S, time, 0, cy, 3, C(v, 'rgba(225,240,255,0.85)', 'rgba(110,30,150,0.95)'), C(v, 'rgba(180,215,255,0.75)', 'rgba(210,90,255,0.8)'), 0.8, 0.35); // wings wrapping forward
    ctx.fillStyle = C(v, '#d8e4f4', '#2a1a34'); ctx.beginPath(); ctx.moveTo(-S*0.11, -S*0.92); ctx.lineTo(S*0.11, -S*0.92); ctx.lineTo(S*0.18, 0); ctx.lineTo(-S*0.18, 0); ctx.fill();
    ctx.fillStyle = C(v, '#f4e8d0', '#cfc0c8'); ctx.beginPath(); ctx.ellipse(0, -S*1.0, S*0.065, S*0.08, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C(v, '#7ac8ff', '#c040ff'); ctx.fillRect(-S*0.04, -S*1.01, S*0.025, S*0.01); ctx.fillRect(S*0.015, -S*1.01, S*0.025, S*0.01);
    if (v.cursed) { ctx.fillStyle = '#7a0a1a'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.028, -S*1.0); ctx.lineTo(k*S*0.033, -S*0.9 + Math.sin(time*2 + k)*S*0.01); ctx.lineTo(k*S*0.023, -S*0.9); ctx.fill(); } } // bleeding eyes
    else { ctx.strokeStyle = '#cfe8ff'; ctx.lineWidth = 3; ctx.shadowColor = '#8cf'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(0, -S*1.15, S*0.11, S*0.03, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    // great shield of light in front
    const sx = -S*0.18 - (v.atk > 0 ? S*0.08 : 0), sy = -S*0.55; ctx.save(); ctx.translate(sx, sy);
    const g = ctx.createLinearGradient(0, -S*0.42, 0, S*0.42); g.addColorStop(0, C(v, '#f0f8ff', '#4a2060')); g.addColorStop(1, C(v, '#7aa8d8', '#1a0820'));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-S*0.2, -S*0.4); ctx.lineTo(S*0.2, -S*0.4); ctx.lineTo(S*0.2, S*0.15); ctx.lineTo(0, S*0.42); ctx.lineTo(-S*0.2, S*0.15); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C(v, '#ffe58a', '#a02040'); ctx.lineWidth = 4; ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -S*0.02, S*0.1, 0, TAU); ctx.moveTo(0, -S*0.22); ctx.lineTo(0, S*0.18); ctx.moveTo(-S*0.14, -S*0.02); ctx.lineTo(S*0.14, -S*0.02); ctx.stroke();
    if (v.cursed) { ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(S*0.05, -S*0.4); ctx.lineTo(-S*0.03, -S*0.1); ctx.lineTo(S*0.06, S*0.1); ctx.lineTo(0, S*0.35); ctx.stroke(); }
    ctx.restore();
  };

  // ---------------- Four Symbols ----------------
  function eastDragon(ctx, S, time, v, pal, big){
    const N = big ? 58 : 46, pts = [];
    for (let i = 0; i < N; i++) { const k = i/(N - 1); pts.push([Math.sin(k*(big ? 8 : 7) + time*1.1)*S*(big ? 0.5 : 0.42)*(1 - k*0.25), -S*(1.2 - k*1.1) + Math.cos(k*5 + time)*S*0.04]); }
    for (let i = N - 1; i > 0; i--) { const [x, y] = pts[i], r = S*((big ? 0.1 : 0.08) - i*(big ? 0.0013 : 0.0012));
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r); g.addColorStop(0, pal[0]); g.addColorStop(0.55, pal[1]); g.addColorStop(1, pal[2]); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      if (i % 3 === 0) { ctx.fillStyle = pal[3]; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r*0.4, y - r*1.7); ctx.lineTo(x + r*0.6, y - r*0.9); ctx.fill(); } }
    for (const i of big ? [9, 20, 32, 44] : [10, 24]) { const [x, y] = pts[i]; ctx.strokeStyle = pal[1]; ctx.lineWidth = S*0.02; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - S*0.12, y + S*0.08);
      for (let f = -2; f <= 2; f++) { if (!big && Math.abs(f) > 1) continue; ctx.moveTo(x - S*0.12, y + S*0.08); ctx.lineTo(x - S*0.16, y + S*0.08 + f*S*0.022); } ctx.stroke(); }
    const [hx, hy] = pts[0]; ctx.save(); ctx.translate(hx, hy); ctx.scale(-(big ? 1.25 : 1), big ? 1.25 : 1);
    ctx.fillStyle = pal[1]; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.07); ctx.quadraticCurveTo(S*0.18, -S*0.1, S*0.26, -S*0.02); ctx.lineTo(S*0.24, S*0.04); ctx.quadraticCurveTo(S*0.12, S*(0.07 + (v.atk > 0 ? 0.06 : 0)), -S*0.05, S*0.07); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(S*(0.08 + i*0.035), S*0.02); ctx.lineTo(S*(0.095 + i*0.035), S*0.045); ctx.lineTo(S*(0.11 + i*0.035), S*0.02); ctx.fill(); }
    ctx.strokeStyle = pal[4]; ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.moveTo(-S*0.03, -S*0.06); ctx.quadraticCurveTo(-S*0.15, -S*0.25, -S*0.05, -S*0.3); ctx.moveTo(S*0.02, -S*0.07); ctx.quadraticCurveTo(-S*0.05, -S*0.28, S*0.06, -S*0.32); ctx.stroke();
    ctx.strokeStyle = pal[4]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(S*0.24, 0); ctx.quadraticCurveTo(S*0.4, S*0.05 + Math.sin(time*3)*S*0.05, S*0.45, S*0.15); ctx.stroke();
    ctx.fillStyle = pal[5]; ctx.shadowColor = pal[5]; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(S*0.1, -S*0.04, S*0.025, S*0.012, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
    return pts;
  }
  X.azure = (ctx, S, time, v) => {
    ctx.fillStyle = C(v, 'rgba(120,220,200,0.15)', 'rgba(60,0,80,0.25)'); for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(-S*0.5 + i*S*0.2, -S*1.3 + Math.sin(time*0.6 + i)*S*0.03, S*0.2, S*0.06, 0, 0, TAU); ctx.fill(); }
    eastDragon(ctx, S, time, v, C(v, ['#c8fff0', '#1fb89a', '#0a5a4a', '#7affd8', '#e8fff8', '#ff3a3a'], ['#c090d0', '#3a1050', '#100418', '#8a2050', '#d0a0e0', '#ff1030']), false);
    for (let i = 0; i < 8; i++) { const ph = (time*0.5 + i/8) % 1; ctx.fillStyle = C(v, `rgba(180,255,220,${1 - ph})`, `rgba(200,80,255,${1 - ph})`); ctx.beginPath(); ctx.ellipse(Math.sin(i*4)*S*0.5, -S*0.2 - ph*S, S*0.01, S*0.018, i, 0, TAU); ctx.fill(); } // falling leaves
  };
  X.yellowdragon = (ctx, S, time, v) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 20; i++) { const a = i/20*TAU + time*0.15; ctx.fillStyle = C(v, 'rgba(255,220,120,0.07)', 'rgba(180,0,60,0.08)'); ctx.beginPath(); ctx.moveTo(0, -S*0.7);
      ctx.lineTo(Math.cos(a - 0.05)*S*1.5, -S*0.7 + Math.sin(a - 0.05)*S*1.5); ctx.lineTo(Math.cos(a + 0.05)*S*1.5, -S*0.7 + Math.sin(a + 0.05)*S*1.5); ctx.fill(); } ctx.restore();
    const pts = eastDragon(ctx, S, time, v, C(v, ['#fff8d0', '#f0c020', '#8a6008', '#ff8a20', '#fff0c0', '#ff2020'], ['#e0a0a0', '#5a0820', '#1a0208', '#3a0010', '#c08080', '#ff00ff']), true);
    const [hx, hy] = pts[0]; ctx.strokeStyle = C(v, '#fff0a0', '#ff2050'); ctx.lineWidth = 3; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 16; ctx.beginPath(); ctx.ellipse(hx + S*0.05, hy - S*0.3, S*0.09, S*0.025, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; // crown of light
    const px = hx - S*0.4, py = hy + Math.sin(time*2)*S*0.05; glow(ctx, px, py, S*0.2, C(v, 'rgba(255,240,180,0.7)', 'rgba(255,0,80,0.6)')); ctx.fillStyle = C(v, '#fff8e0', '#300010'); ctx.beginPath(); ctx.arc(px, py, S*0.05, 0, TAU); ctx.fill();
  };
  X.tiger = (ctx, S, time, v) => {
    const br = Math.sin(time*2)*S*0.01, pounce = v.atk > 0 ? -S*0.12 : 0, body = C(v, '#f4f2ee', '#4a3a50'), stripe = C(v, '#141414', '#c01040');
    ctx.save(); ctx.translate(pounce, 0);
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(S*0.1, -S*0.32 + br, S*0.36, S*0.16, -0.05, 0, TAU); ctx.fill();
    for (const [x, d] of [[-0.18, 1], [-0.06, -1], [0.28, 1], [0.38, -1]]) { ctx.strokeStyle = body; ctx.lineWidth = S*0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x*S, -S*0.28); ctx.lineTo(x*S + d*S*0.02, -S*0.03); ctx.stroke(); }
    ctx.strokeStyle = stripe; ctx.lineWidth = S*0.018; for (let i = 0; i < 7; i++) { const x = -S*0.15 + i*S*0.07; ctx.beginPath(); ctx.moveTo(x, -S*0.46 + br); ctx.quadraticCurveTo(x + S*0.03, -S*0.36, x - S*0.01, -S*0.26); ctx.stroke(); }
    ctx.strokeStyle = body; ctx.lineWidth = S*0.035; ctx.beginPath(); ctx.moveTo(S*0.44, -S*0.38); ctx.quadraticCurveTo(S*0.62, -S*0.5, S*0.56 + Math.sin(time*3)*S*0.05, -S*0.72); ctx.stroke();
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(-S*0.28, -S*0.48 + br, S*0.15, S*0.13, 0, 0, TAU); ctx.fill();
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-S*0.28 + k*S*0.08, -S*0.58); ctx.lineTo(-S*0.28 + k*S*0.12, -S*0.68); ctx.lineTo(-S*0.28 + k*S*0.02, -S*0.6); ctx.fill(); }
    ctx.fillStyle = stripe; ctx.font = `900 ${S*0.07}px serif`; ctx.textAlign = 'center'; ctx.fillText('王', -S*0.28, -S*0.53 + br);
    ctx.fillStyle = C(v, '#7affc0', '#ff1030'); ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12; ctx.beginPath(); ctx.ellipse(-S*0.33, -S*0.48 + br, S*0.022, S*0.01, 0.2, 0, TAU); ctx.ellipse(-S*0.23, -S*0.48 + br, S*0.022, S*0.01, -0.2, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(-S*0.28, -S*0.4 + br, S*0.06, S*0.02 + (v.atk > 0 ? S*0.03 : 0), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-S*0.28 + k*S*0.035, -S*0.41); ctx.lineTo(-S*0.28 + k*S*0.03, -S*0.36); ctx.lineTo(-S*0.28 + k*S*0.02, -S*0.41); ctx.fill(); }
    ctx.restore();
    for (let i = 0; i < 4; i++) { ctx.strokeStyle = C(v, 'rgba(220,240,255,0.5)', 'rgba(255,30,80,0.5)'); ctx.lineWidth = 2; const y = -S*(0.2 + i*0.15); ctx.beginPath(); ctx.moveTo(-S*0.6, y); ctx.lineTo(-S*0.6 + ((time*2 + i*0.3) % 1)*S*0.4, y - S*0.04); ctx.stroke(); } // wind blades
  };
  X.phoenix = (ctx, S, time, v) => {
    const cy = -S*0.75, fl = Math.sin(time*2.2)*0.18;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const k of [-1, 1]) for (let f = 0; f < 14; f++) { const a = -Math.PI/2 + k*(0.25 + f*0.12 + fl), len = S*(0.7 - Math.abs(f - 5)*0.035);
      const g = ctx.createLinearGradient(0, cy, Math.cos(a)*len*k*k, cy + Math.sin(a)*len); g.addColorStop(0, C(v, 'rgba(255,240,160,0.9)', 'rgba(120,0,160,0.9)')); g.addColorStop(1, C(v, 'rgba(255,60,0,0.15)', 'rgba(20,0,30,0.1)'));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, cy); ctx.quadraticCurveTo(k*len*0.4, cy - len*0.3, Math.cos(a)*len*(k < 0 ? 1 : 1) + (k > 0 ? 0 : 0), cy + Math.sin(a)*len); ctx.lineTo(Math.cos(a + k*0.06)*len*0.85, cy + Math.sin(a + k*0.06)*len*0.85); ctx.fill(); }
    for (let i = 0; i < 5; i++) { const a = Math.PI/2 + (i - 2)*0.18 + Math.sin(time*1.5 + i)*0.08, len = S*(0.7 + (i === 2 ? 0.2 : 0)); ctx.strokeStyle = C(v, `hsla(${20 + i*10},100%,60%,0.8)`, `hsla(${280 + i*8},80%,45%,0.8)`); ctx.lineWidth = S*0.02;
      ctx.beginPath(); ctx.moveTo(0, cy + S*0.15); ctx.quadraticCurveTo(Math.cos(a)*len*0.5 + Math.sin(time*2 + i)*S*0.08, cy + S*0.15 + Math.sin(a)*len*0.5, Math.cos(a)*len, cy + S*0.15 + Math.sin(a)*len*0.8); ctx.stroke();
      ctx.fillStyle = C(v, '#ffe060', '#ff2060'); ctx.beginPath(); ctx.arc(Math.cos(a)*len, cy + S*0.15 + Math.sin(a)*len*0.8, S*0.025, 0, TAU); ctx.fill(); } // tail plumes
    ctx.restore();
    ctx.fillStyle = C(v, '#e83a10', '#2a0a30'); ctx.beginPath(); ctx.ellipse(0, cy + S*0.05, S*0.08, S*0.15, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-S*0.02, cy - S*0.14, S*0.05, S*0.06, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C(v, '#ffd040', '#c0c0c0'); ctx.beginPath(); ctx.moveTo(-S*0.06, cy - S*0.15); ctx.lineTo(-S*0.13, cy - S*0.12); ctx.lineTo(-S*0.06, cy - S*0.11); ctx.fill();
    ctx.strokeStyle = C(v, '#ffd040', '#a020ff'); ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(0, cy - S*0.19); ctx.quadraticCurveTo(S*0.04 + i*S*0.02, cy - S*0.3, S*0.08 + i*S*0.03, cy - S*0.28 - i*S*0.02); ctx.stroke(); }
    ctx.fillStyle = C(v, '#fff', '#ff1030'); ctx.beginPath(); ctx.arc(-S*0.035, cy - S*0.15, S*0.01, 0, TAU); ctx.fill();
    for (let i = 0; i < 12; i++) { const ph = (time*0.7 + i/12) % 1; ctx.fillStyle = C(v, `rgba(255,${150 + i*8},40,${1 - ph})`, `rgba(160,40,220,${1 - ph})`); ctx.fillRect(Math.sin(i*3.3)*S*0.4, cy + S*0.4 - ph*S*0.9, 3, 3); } // embers
  };
  X.tortoise = (ctx, S, time, v) => {
    const shell = C(v, '#1e3a40', '#1a0a20'), skin = C(v, '#3a5a50', '#3a2a40'), sn = C(v, '#2a4a6a', '#4a1030');
    ctx.fillStyle = 'rgba(80,160,200,0.18)'; ctx.beginPath(); ctx.ellipse(0, -S*0.02, S*0.7, S*0.08, 0, 0, TAU); ctx.fill(); // water
    ctx.strokeStyle = skin; ctx.lineWidth = S*0.08; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.3, -S*0.2); ctx.lineTo(k*S*0.42, -S*0.02); ctx.stroke(); }
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(-S*0.5, -S*0.32, S*0.1, S*0.08, -0.2, 0, TAU); ctx.fill(); ctx.fillStyle = C(v, '#9cf', '#f13'); ctx.beginPath(); ctx.arc(-S*0.54, -S*0.34, S*0.012, 0, TAU); ctx.fill();
    ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, -S*0.3, S*0.45, S*0.3, 0, Math.PI, TAU); ctx.lineTo(S*0.45, -S*0.22); ctx.lineTo(-S*0.45, -S*0.22); ctx.fill();
    ctx.strokeStyle = C(v, '#6ac0c8', '#a03070'); ctx.lineWidth = 2; for (let r = 0; r < 3; r++) for (let i = 0; i < 4 + r; i++) { const cx = -S*0.3 + i*S*(0.6/(3 + r)) + (r ? S*0.05 : 0), cy = -S*0.32 - (2 - r)*S*0.08, hs = S*0.06;
      ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k/6*TAU; ctx.lineTo(cx + Math.cos(a)*hs, cy + Math.sin(a)*hs*0.6); } ctx.closePath(); ctx.stroke(); }
    // serpent coiled around the shell
    ctx.strokeStyle = sn; ctx.lineWidth = S*0.045; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const k = i/40, a = k*TAU*1.3 + time*0.5; const x = Math.cos(a)*S*0.42*(1 - k*0.2), y = -S*0.3 + Math.sin(a)*S*0.22 - k*S*0.35; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    const ha = TAU*1.3 + time*0.5, hx = Math.cos(ha)*S*0.34, hy = -S*0.3 + Math.sin(ha)*S*0.22 - S*0.35 - (v.atk > 0 ? S*0.08 : 0);
    ctx.fillStyle = sn; ctx.beginPath(); ctx.ellipse(hx, hy, S*0.06, S*0.04, 0, 0, TAU); ctx.fill(); ctx.fillStyle = C(v, '#ffe040', '#ff1030'); ctx.beginPath(); ctx.arc(hx - S*0.02, hy - S*0.01, S*0.01, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#c33'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx - S*0.06, hy); ctx.lineTo(hx - S*0.1, hy - S*0.01); ctx.moveTo(hx - S*0.06, hy); ctx.lineTo(hx - S*0.1, hy + S*0.015); ctx.stroke();
  };

  // ---------------- cursed variants: same body with cursed palette + chains, miasma, sigil ----------------
  function curseOverlay(ctx, S, time){
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 16; i++) { const ph = (time*0.35 + i/16) % 1; ctx.fillStyle = `rgba(150,0,${120 + (i%3)*30},${(1 - ph)*0.35})`; ctx.beginPath(); ctx.arc(Math.sin(i*2.7)*S*0.5, -ph*S*1.3, S*0.05*(0.5 + ph), 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.save(); ctx.translate(0, -S*0.6); ctx.rotate(time*0.3); ctx.strokeStyle = 'rgba(255,30,70,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, S*0.62, 0, TAU); ctx.stroke();
    for (let i = 0; i < 5; i++) { const a = i/5*TAU, b = (i + 2)/5*TAU; ctx.moveTo(Math.cos(a)*S*0.62, Math.sin(a)*S*0.62); ctx.lineTo(Math.cos(b)*S*0.62, Math.sin(b)*S*0.62); } ctx.stroke(); ctx.restore(); // curse pentagram
    ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 3; for (const [x0, y0, x1, y1] of [[-0.7, -1.3, 0.4, 0.0], [0.7, -1.25, -0.35, 0.0]]) { ctx.beginPath(); for (let i = 0; i <= 14; i++) { const k = i/14, x = (x0 + (x1 - x0)*k)*S, y = (y0 + (y1 - y0)*k)*S + Math.sin(time + k*6)*S*0.01; ctx.moveTo(x, y); ctx.ellipse(x, y, S*0.012, S*0.02, Math.atan2(y1 - y0, x1 - x0), 0, TAU); } ctx.stroke(); }
  }
  for (const id of ['azure', 'tiger', 'phoenix', 'tortoise', 'yellowdragon', 'archwrath', 'archward']) X[id + '_c'] = (ctx, S, time, v) => { X[id](ctx, S, time, Object.assign({}, v, { cursed: 1 })); curseOverlay(ctx, S, time); };

  // ---------------- "Four Symbols" aura skins ----------------
  const baseExtra = R.auraExtra;
  R.auraExtra = (ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy) => {
    baseExtra(ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy);
    if (!A.foursym) return; const cols = A.foursym === 2 ? ['#a020ff', '#ff1040', '#6a00a0', '#ff3070'] : ['#2fe0b0', '#f4f4f4', '#ff5020', '#3a80ff'], ch = A.foursym === 2 ? ['咒', '咒', '咒', '咒'] : ['青', '白', '朱', '玄'];
    ctx.save(); for (let i = 0; i < 4; i++) { const a = time*0.9 + i*TAU/4, d = Math.sin(a); if ((d < 0) !== back) continue; const px = cx + Math.cos(a)*w*1.6, py = cy - h*0.1 + d*w*0.45;
      ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(px, py, 0, px, py, 14*sc); g.addColorStop(0, cols[i]); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 14*sc, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#fff'; ctx.font = `900 ${10*sc}px serif`; ctx.textAlign = 'center'; ctx.fillText(ch[i], px, py + 3.5*sc); }
    ctx.restore();
  };

  // ---------------- Sanctum on the map ----------------
  R.sanctumPath = (ctx, w2s, z, from, to, open, time) => { // flagstone path branching off to the sanctum
    const n = 34; for (let i = 0; i <= n; i++) { const k = i/n, x = from[0] + (to[0] - from[0])*k + Math.sin(k*9)*60, y = from[1] + (to[1] - from[1])*k + Math.cos(k*7)*40; const [sx, sy] = w2s(x, y);
      ctx.fillStyle = open ? 'rgba(120,110,95,0.75)' : 'rgba(70,60,80,0.6)'; ctx.beginPath(); ctx.ellipse(sx, sy, 26*z, 11*z, (i%3)*0.3, 0, TAU); ctx.fill(); }
  };
  R.sanctumGate = (ctx, sx, sy, z, time, open, label) => { // torii-like gate at the start of the branch
    const s = z; ctx.fillStyle = '#7a1414'; ctx.fillRect(sx - 70*s, sy - 150*s, 12*s, 150*s); ctx.fillRect(sx + 58*s, sy - 150*s, 12*s, 150*s);
    ctx.fillRect(sx - 90*s, sy - 160*s, 180*s, 14*s); ctx.fillRect(sx - 78*s, sy - 128*s, 156*s, 9*s); ctx.fillStyle = '#1a0a0a'; ctx.fillRect(sx - 95*s, sy - 168*s, 190*s, 8*s);
    if (!open) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(160,60,255,${0.18 + Math.sin(time*2)*0.06})`; ctx.fillRect(sx - 58*s, sy - 128*s, 116*s, 128*s); ctx.restore();
      ctx.strokeStyle = 'rgba(200,150,255,0.8)'; ctx.lineWidth = 2*s; ctx.beginPath(); ctx.moveTo(sx - 58*s, sy - 128*s); ctx.lineTo(sx + 58*s, sy); ctx.moveTo(sx + 58*s, sy - 128*s); ctx.lineTo(sx - 58*s, sy); ctx.stroke(); }
    ctx.textAlign = 'center'; ctx.font = `800 ${Math.max(11, 14*z)}px ${FONT}`; ctx.fillStyle = open ? '#ffd98a' : '#b9a0e0'; ctx.shadowColor = '#000'; ctx.shadowBlur = 5; ctx.fillText(label, sx, sy - 180*s); ctx.shadowBlur = 0;
  };
  R.sanctumFloor = (ctx, sx, sy, z, time, cursed) => { // big octagonal platform
    ctx.save(); ctx.translate(sx, sy); ctx.scale(1, R.SQ);
    ctx.fillStyle = cursed ? '#1a0e22' : '#2a2620'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i/8*TAU + TAU/16; ctx.lineTo(Math.cos(a)*560*z, Math.sin(a)*560*z); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = cursed ? 'rgba(255,40,90,0.5)' : 'rgba(255,215,120,0.45)'; ctx.lineWidth = 4*z; ctx.stroke();
    ctx.rotate(time*0.05); ctx.lineWidth = 2*z; for (const r of [470, 380]) { ctx.beginPath(); ctx.arc(0, 0, r*z, 0, TAU); ctx.stroke(); }
    ctx.fillStyle = ctx.strokeStyle; ctx.font = `bold ${30*z}px serif`; ctx.textAlign = 'center'; const t8 = '☰☱☲☳☴☵☶☷'; for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i/8*TAU); ctx.fillText(t8[i], 0, -420*z); ctx.restore(); }
    ctx.restore();
  };
  const SYM_CH = { azure: '青', tiger: '白', phoenix: '朱', tortoise: '玄', yellowdragon: '黃' }, SYM_COL = { azure: '#2fe0b0', tiger: '#f0f0f0', phoenix: '#ff5020', tortoise: '#4a8aff', yellowdragon: '#ffd040' };
  R.sanctumPedestal = (ctx, sx, sy, z, time, id, state, label, sub, cursed) => { // state: 'ready' | 'done' | 'cd' | 'locked'
    const s = z*(id === 'yellowdragon' ? 1.35 : 1), col = cursed ? '#ff2a60' : SYM_COL[id];
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(sx, sy, 60*s, 20*s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#3a3530'; ctx.beginPath(); ctx.moveTo(sx - 46*s, sy); ctx.lineTo(sx - 36*s, sy - 40*s); ctx.lineTo(sx + 36*s, sy - 40*s); ctx.lineTo(sx + 46*s, sy); ctx.fill();
    ctx.fillStyle = '#4a443c'; ctx.beginPath(); ctx.ellipse(sx, sy - 40*s, 36*s, 12*s, 0, 0, TAU); ctx.fill();
    const oy = sy - 85*s + Math.sin(time*2 + (SYMBOLS.findIndex(q => q.id === id) + 1)*1.7)*5*s, on = state === 'ready'; // phase from the symbol, not screen x (fixes jitter while moving)
    if (state !== 'locked') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, oy, 0, sx, oy, (on ? 70 : 40)*s); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = on ? 0.6 + Math.sin(time*3)*0.2 : 0.3; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, oy, 70*s, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = state === 'locked' ? '#2a2630' : '#0c0a10'; ctx.beginPath(); ctx.arc(sx, oy, 24*s, 0, TAU); ctx.fill(); ctx.strokeStyle = state === 'locked' ? '#555' : col; ctx.lineWidth = 3*s; ctx.stroke();
    ctx.fillStyle = state === 'locked' ? '#555' : col; ctx.font = `900 ${26*s}px serif`; ctx.textAlign = 'center'; ctx.fillText(state === 'done' ? '✔' : SYM_CH[id], sx, oy + 9*s);
    ctx.font = `800 ${Math.max(11, 13*z)}px ${FONT}`; ctx.fillStyle = state === 'locked' ? '#888' : col; ctx.shadowColor = '#000'; ctx.shadowBlur = 5; ctx.fillText(label, sx, oy - 36*s);
    if (sub) { ctx.font = `600 ${Math.max(10, 11*z)}px ${FONT}`; ctx.fillStyle = '#ccc'; ctx.fillText(sub, sx, oy - 36*s + 15*z); } ctx.shadowBlur = 0;
  };
})();

// v2.0 — straight stone road leaving the map eastward to the Sanctum (drawn only once opened)
(() => {
  R.sanctumRoad = (ctx, w2s, z, x0, x1, y, time) => {
    const [ax, ay] = w2s(x0, y - 120), [bx, by] = w2s(x1, y + 120);
    ctx.fillStyle = '#17131c'; ctx.fillRect(ax, ay, bx - ax, by - ay);                  // dark causeway over the void
    ctx.strokeStyle = 'rgba(255,215,120,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, ay); ctx.moveTo(ax, by); ctx.lineTo(bx, by); ctx.stroke();
    for (let x = x0; x < x1; x += 70) { const [sx, sy] = w2s(x, y); ctx.fillStyle = 'rgba(120,110,95,0.85)'; ctx.beginPath(); ctx.ellipse(sx, sy, 30*z, 13*z, 0, 0, Math.PI*2); ctx.fill(); }
    for (let x = x0 + 140; x < x1; x += 280) for (const k of [-1, 1]) { const [sx, sy] = w2s(x, y + k*125), f = 0.8 + Math.sin(time*9 + x)*0.2; // lanterns
      ctx.fillStyle = '#3a2a1a'; ctx.fillRect(sx - 2*z, sy - 30*z, 4*z, 30*z); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy - 34*z, 0, sx, sy - 34*z, 40*z*f);
      g.addColorStop(0, 'rgba(255,190,90,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 40*z, sy - 74*z, 80*z, 80*z); ctx.restore(); }
  };
})();
