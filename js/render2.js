// GodK Bá Khí v1.1 — extra bosses, boss auras (Goku-style forms), Rift Gates, Event Gates
'use strict';
(() => {
  const TAU = Math.PI*2, { hsl, rnd, eye, flameShape } = R;

  // ---------- Boss aura (drawn behind the boss) ----------
  R.bossAura = (ctx, cx, cy, S, time, fi, boost) => {
    const F_ = BOSS_FORMS[Math.max(0, Math.min(BOSS_FORMS.length - 1, fi))];
    const k = (F_.big ? 1.25 : 1) * (1 + (boost||0)*0.35);
    const w = S*0.42*k, h = S*0.62*k, ay = cy - S*0.55;
    ctx.save(); ctx.globalCompositeOperation = F_.dark ? 'source-over' : 'lighter';
    // ground glow
    const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w*1.8); gg.addColorStop(0, F_.dark ? 'rgba(20,0,40,0.6)' : hsl(F_.h, F_.s, F_.l, 0.35)); gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(cx, cy, w*1.8, w*0.5, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    [[1.3, 0.28], [1.0, 0.4], [0.7, 0.5]].forEach(([sc, a], i) => {
      flameShape(ctx, cx, ay, w*sc, h*sc, time*(1.1 + i*0.3), 11, 4 + i*1.9, 0.75);
      const g = ctx.createRadialGradient(cx, ay + h*0.2, 0, cx, ay, h*sc*1.9);
      if (F_.dark) { g.addColorStop(0, hsl(F_.h, 100, 65, a*0.5)); g.addColorStop(1, 'rgba(0,0,0,0)'); }
      else { g.addColorStop(0, hsl(F_.h, F_.s, F_.l, a*0.15)); g.addColorStop(0.45, hsl(F_.h, F_.s, Math.min(92, F_.l + 12), a)); g.addColorStop(0.8, hsl(F_.h, F_.s, F_.l*0.7, a*0.4)); g.addColorStop(1, 'rgba(0,0,0,0)'); }
      ctx.fillStyle = g; ctx.fill();
    });
    if (F_.dark) { ctx.globalCompositeOperation = 'source-over'; flameShape(ctx, cx, ay, w*0.95, h*0.95, time*1.4, 13, 9, 0.8); ctx.fillStyle = 'rgba(5,0,12,0.5)'; ctx.fill(); ctx.strokeStyle = hsl(F_.h, 100, 65, 0.7); ctx.lineWidth = 2; ctx.stroke(); ctx.globalCompositeOperation = 'lighter'; }
    // rising embers
    for (let i = 0; i < 18; i++) { const ph = (time*0.6 + i*0.137) % 1; ctx.fillStyle = hsl(F_.h, F_.s, Math.min(95, F_.l + 20), (1 - ph)*0.8);
      ctx.fillRect(cx + Math.sin(i*12.9898)*w*0.9, cy - ph*h*2.2, 3, 3); }
    if (F_.sparks && Math.random() < 0.6) { ctx.strokeStyle = 'rgba(255,255,220,0.9)'; ctx.lineWidth = 1.5; for (let i = 0; i < 3; i++) { const sx = cx + rnd(-w, w), sy = ay + rnd(-h, h*0.6); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + rnd(-10, 10), sy + rnd(-10, 10)); ctx.stroke(); } }
    if (F_.bolt) { ctx.strokeStyle = F_.dark ? 'rgba(200,120,255,0.9)' : (F_.h > 330 || F_.h < 20 ? 'rgba(255,90,90,0.95)' : 'rgba(190,235,255,0.95)'); ctx.lineWidth = 2; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 10;
      const nb = 2 + Math.floor(Math.random()*3); for (let b = 0; b < nb; b++) { let px = cx + rnd(-w, w), py = ay + rnd(-h, h*0.5); ctx.beginPath(); ctx.moveTo(px, py); for (let j = 0; j < 6; j++) { px += rnd(-18, 18); py += rnd(-20, 20); ctx.lineTo(px, py); } ctx.stroke(); } ctx.shadowBlur = 0; }
    ctx.restore();
  };

  // ---------- 12 extra bosses (origin = feet center, S = height) ----------
  const X = R.extra = {};
  X.doll = (ctx, S, time, v) => {
    const tilt = Math.sin(time*0.6)*0.25 + (Math.sin(time*17) > 0.95 ? 0.5 : 0);
    ctx.strokeStyle = 'rgba(220,220,220,0.35)'; ctx.lineWidth = 1; for (const x of [-0.18, 0, 0.18]) { ctx.beginPath(); ctx.moveTo(x*S, -S*2); ctx.lineTo(x*S*0.6, -S*0.85); ctx.stroke(); }
    ctx.fillStyle = `hsl(${v.hue},35%,22%)`; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.7); ctx.lineTo(S*0.08, -S*0.7); ctx.lineTo(S*0.28, -S*0.12); ctx.lineTo(-S*0.28, -S*0.12); ctx.fill(); // dress
    ctx.strokeStyle = '#e8e2d8'; ctx.lineWidth = S*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.12); ctx.lineTo(-S*0.09, 0); ctx.moveTo(S*0.08, -S*0.12); ctx.lineTo(S*0.1, 0);
    ctx.moveTo(-S*0.08, -S*0.62); ctx.lineTo(-S*0.22, -S*0.4 - (v.atk > 0 ? S*0.2 : 0)); ctx.moveTo(S*0.08, -S*0.62); ctx.lineTo(S*0.2, -S*0.42); ctx.stroke();
    ctx.save(); ctx.translate(0, -S*0.82); ctx.rotate(tilt);
    ctx.fillStyle = '#3a1a0a'; ctx.beginPath(); ctx.arc(0, -S*0.02, S*0.15, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = '#efe9e0'; ctx.beginPath(); ctx.arc(0, 0, S*0.13, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.05, -S*0.01, S*0.035, 0, TAU); ctx.arc(S*0.05, -S*0.01, S*0.035, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-S*0.045, -S*0.02, S*0.006, 0, TAU); ctx.arc(S*0.055, -S*0.02, S*0.006, 0, TAU); ctx.fill();
    ctx.fillStyle = '#9a0010'; ctx.beginPath(); ctx.ellipse(0, S*0.07, S*0.025, S*0.012, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(S*0.02, -S*0.13); ctx.lineTo(S*0.05, -S*0.05); ctx.lineTo(S*0.03, S*0.02); ctx.lineTo(S*0.07, S*0.1); ctx.stroke();
    ctx.restore();
  };
  X.bride = (ctx, S, time, v) => {
    const sway = Math.sin(time*0.7)*S*0.02;
    ctx.fillStyle = 'rgba(235,240,245,0.92)'; ctx.beginPath(); ctx.moveTo(-S*0.07 + sway, -S*0.72); ctx.lineTo(S*0.07 + sway, -S*0.72); ctx.lineTo(S*0.3, 0);
    for (let i = 0; i < 10; i++) ctx.lineTo(S*(0.3 - i*0.06), (i%2) ? -S*0.04 : S*0.01); ctx.lineTo(-S*0.3, 0); ctx.fill();
    ctx.fillStyle = 'rgba(200,220,230,0.35)'; ctx.beginPath(); ctx.moveTo(-S*0.12 + sway, -S*0.95); ctx.quadraticCurveTo(-S*0.4, -S*0.4, -S*0.35, -S*0.05); ctx.lineTo(S*0.35, -S*0.05); ctx.quadraticCurveTo(S*0.4, -S*0.4, S*0.12 + sway, -S*0.95); ctx.fill(); // veil
    ctx.fillStyle = '#d9dde0'; ctx.beginPath(); ctx.arc(sway, -S*0.83, S*0.09, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#050505'; ctx.lineWidth = S*0.012; for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(sway + i*S*0.011, -S*0.92); ctx.quadraticCurveTo(sway + i*S*0.016 + Math.sin(time + i)*S*0.01, -S*0.7, sway + i*S*0.02, -S*0.45 - Math.abs(i)*S*0.01); ctx.stroke(); } // hair covers face
    ctx.strokeStyle = '#d9dde0'; ctx.lineWidth = S*0.022; ctx.lineCap = 'round'; const reach = v.atk > 0 ? S*0.3 : S*0.12;
    ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.66); ctx.lineTo(-S*0.15 - reach, -S*0.6); ctx.stroke();
    ctx.lineWidth = S*0.006; for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.moveTo(-S*0.15 - reach, -S*0.6); ctx.lineTo(-S*0.21 - reach, -S*0.62 + f*S*0.012); ctx.stroke(); }
    ctx.fillStyle = 'rgba(120,170,190,0.7)'; for (let i = 0; i < 6; i++) { const ph = (time*0.8 + i*0.23) % 1; ctx.fillRect(-S*0.2 + i*S*0.08, -S*0.3 + ph*S*0.3, 2, 5); }
  };
  X.scarecrow = (ctx, S, time, v) => {
    ctx.fillStyle = '#3a2614'; ctx.fillRect(-S*0.025, -S*1.05, S*0.05, S*1.05); ctx.fillRect(-S*0.45, -S*0.78, S*0.9, S*0.04);
    ctx.fillStyle = `hsl(${v.hue},25%,22%)`; ctx.beginPath(); ctx.moveTo(-S*0.42, -S*0.8); ctx.lineTo(S*0.42, -S*0.8); ctx.lineTo(S*0.2, -S*0.35); ctx.lineTo(-S*0.2, -S*0.35); ctx.fill();
    ctx.strokeStyle = '#b89a50'; ctx.lineWidth = 2; for (let i = 0; i < 14; i++) { const x = -S*0.45 + (i%7)*S*0.15*(i < 7 ? 1 : 0) + (i >= 7 ? S*0.3 : 0); ctx.beginPath(); ctx.moveTo(i < 7 ? -S*0.42 : S*0.42, -S*0.78); ctx.lineTo((i < 7 ? -S*0.5 : S*0.5) + rnd(-3, 3), -S*0.7 + (i%7)*S*0.015); ctx.stroke(); }
    ctx.fillStyle = '#a8895a'; ctx.beginPath(); ctx.ellipse(0, -S*0.93, S*0.13, S*0.15, Math.sin(time*0.5)*0.15, 0, TAU); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*1.05); ctx.lineTo(S*0.1, -S*1.08); ctx.lineTo(S*0.02, -S*1.25); ctx.fill(); ctx.fillRect(-S*0.18, -S*1.07, S*0.36, S*0.03); // hat
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.05, -S*0.96, S*0.022, 0, TAU); ctx.arc(S*0.05, -S*0.96, S*0.022, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ffde55'; ctx.shadowColor = '#fd5'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(-S*0.05, -S*0.96, S*0.006, 0, TAU); ctx.arc(S*0.05, -S*0.96, S*0.006, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.88); ctx.quadraticCurveTo(0, -S*0.83, S*0.08, -S*0.88); ctx.stroke();
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*S*0.02, -S*0.9); ctx.lineTo(i*S*0.02, -S*0.84); ctx.stroke(); }
    ctx.fillStyle = '#080808'; for (let i = 0; i < 4; i++) { const a = time*0.9 + i*1.6; const cx = Math.cos(a)*S*0.5, cy = -S*1.2 + Math.sin(a*1.3)*S*0.12; const fl = Math.sin(time*12 + i)*S*0.025;
      ctx.beginPath(); ctx.moveTo(cx - S*0.05, cy - fl); ctx.lineTo(cx, cy + S*0.01); ctx.lineTo(cx + S*0.05, cy - fl); ctx.lineTo(cx, cy - S*0.005); ctx.fill(); }
  };
  X.moth = (ctx, S, time, v) => {
    const fl = Math.sin(time*3)*0.12;
    for (const k of [-1, 1]) { ctx.save(); ctx.translate(0, -S*0.6); ctx.scale(k, 1); ctx.rotate(fl);
      const g = ctx.createLinearGradient(0, 0, S*0.6, 0); g.addColorStop(0, `hsl(${v.hue},30%,30%)`); g.addColorStop(1, `hsl(${v.hue},25%,14%)`); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(0, -S*0.05); ctx.bezierCurveTo(S*0.3, -S*0.55, S*0.7, -S*0.45, S*0.62, -S*0.1); ctx.bezierCurveTo(S*0.55, S*0.05, S*0.3, S*0.05, 0, S*0.02); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, S*0.02); ctx.bezierCurveTo(S*0.25, S*0.05, S*0.45, S*0.25, S*0.3, S*0.4); ctx.bezierCurveTo(S*0.15, S*0.38, S*0.05, S*0.2, 0, S*0.1); ctx.fill();
      eye(ctx, S*0.38, -S*0.22, S*0.08, time, -500*k, 0, '#3a2a00'); ctx.restore(); }
    ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.ellipse(0, -S*0.5, S*0.06, S*0.22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d8cfc0'; ctx.beginPath(); ctx.arc(0, -S*0.76, S*0.07, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.025, -S*0.77, S*0.022, 0, TAU); ctx.arc(S*0.025, -S*0.77, S*0.022, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 2; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.03, -S*0.82); ctx.quadraticCurveTo(k*S*0.12, -S*1.0, k*S*0.2, -S*0.98); ctx.stroke(); }
    ctx.fillStyle = 'rgba(230,220,180,0.5)'; for (let i = 0; i < 25; i++) { const ph = (time*0.3 + i*0.07) % 1; ctx.fillRect(Math.sin(i*7.1)*S*0.6, -S*0.9 + ph*S, 2, 2); }
  };
  X.crawler = (ctx, S, time, v) => {
    const b = Math.sin(time*2)*S*0.02, step = Math.sin(time*5)*S*0.03;
    ctx.strokeStyle = '#c8c0b0'; ctx.lineWidth = S*0.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-S*0.3, -S*0.5 + b); ctx.quadraticCurveTo(0, -S*0.85 + b, S*0.3, -S*0.5 + b); ctx.stroke(); // arched torso
    ctx.beginPath(); ctx.moveTo(-S*0.3, -S*0.5 + b); ctx.lineTo(-S*0.42 + step, -S*0.25); ctx.lineTo(-S*0.45 + step, 0); ctx.moveTo(-S*0.3, -S*0.5 + b); ctx.lineTo(-S*0.2 - step, -S*0.25); ctx.lineTo(-S*0.22 - step, 0); ctx.stroke(); // arms
    ctx.beginPath(); ctx.moveTo(S*0.3, -S*0.5 + b); ctx.lineTo(S*0.38 - step, -S*0.3); ctx.lineTo(S*0.45 - step, 0); ctx.moveTo(S*0.3, -S*0.5 + b); ctx.lineTo(S*0.22 + step, -S*0.28); ctx.lineTo(S*0.25 + step, 0); ctx.stroke(); // legs
    ctx.save(); ctx.translate(-S*0.36, -S*0.4 + b); ctx.rotate(Math.PI + Math.sin(time*9)*0.08);
    ctx.fillStyle = '#c8c0b0'; ctx.beginPath(); ctx.ellipse(0, 0, S*0.08, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.03, -S*0.02, S*0.018, 0, TAU); ctx.arc(S*0.03, -S*0.02, S*0.018, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, S*0.05, S*0.03, S*0.035 + (v.atk > 0 ? S*0.02 : 0), 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#100'; ctx.beginPath(); ctx.ellipse(-S*0.36, -S*0.33 + b, S*0.012, S*0.04, 0, 0, TAU); ctx.fill(); // hanging drool
  };
  X.plague = (ctx, S, time, v) => {
    ctx.fillStyle = '#0c0c0c'; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.82); ctx.lineTo(S*0.1, -S*0.82); ctx.lineTo(S*0.3, 0); ctx.lineTo(-S*0.3, 0); ctx.fill();
    ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.ellipse(0, -S*0.86, S*0.1, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e0d6c0'; ctx.beginPath(); ctx.moveTo(-S*0.04, -S*0.88); ctx.quadraticCurveTo(-S*0.3, -S*0.85, -S*0.38, -S*0.7); ctx.quadraticCurveTo(-S*0.2, -S*0.78, -S*0.02, -S*0.8); ctx.fill(); // beak
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(-S*0.18, -S*0.99, S*0.36, S*0.03); ctx.fillRect(-S*0.09, -S*1.15, S*0.18, S*0.17); // hat
    ctx.fillStyle = '#4f4'; ctx.shadowColor = '#3f3'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(-S*0.035, -S*0.9, S*0.018, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    const sw = Math.sin(time*1.5)*0.3; const lx = S*0.25 + Math.sin(sw)*S*0.08, ly = -S*0.35 + Math.cos(sw)*S*0.05;
    ctx.strokeStyle = '#222'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(S*0.12, -S*0.6); ctx.lineTo(S*0.25, -S*0.5); ctx.lineTo(lx, ly - S*0.06); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, S*0.3); g.addColorStop(0, 'rgba(90,255,90,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(lx - S*0.3, ly - S*0.3, S*0.6, S*0.6); ctx.restore();
    ctx.fillStyle = '#7f7'; ctx.fillRect(lx - S*0.025, ly - S*0.04, S*0.05, S*0.07);
    ctx.fillStyle = 'rgba(90,200,90,0.12)'; for (let i = 0; i < 6; i++) { const ph = (time*0.2 + i/6) % 1; ctx.beginPath(); ctx.arc(Math.sin(i*3)*S*0.4, -ph*S*0.3, S*0.1*(1 + ph), 0, TAU); ctx.fill(); }
  };
  X.clock = (ctx, S, time, v) => {
    const cy = -S*0.65, r = S*0.42;
    ctx.save(); ctx.translate(0, cy);
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate((i - 1)*r*0.9, r*0.85 - (i%2)*r*0.2); ctx.rotate(time*(i%2 ? -0.5 : 0.5)); ctx.fillStyle = '#3a2d14';
      for (let t = 0; t < 10; t++) { ctx.rotate(TAU/10); ctx.fillRect(-S*0.02, -r*0.42, S*0.04, S*0.06); } ctx.beginPath(); ctx.arc(0, 0, r*0.35, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#e7dcc0'; ctx.strokeStyle = '#5a4520'; ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a2a10'; ctx.font = `bold ${S*0.06}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const nums = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI']; nums.forEach((n, i) => { const a = i/12*TAU - Math.PI/2; ctx.fillText(Math.random() < 0.02 ? '?' : n, Math.cos(a)*r*0.8, Math.sin(a)*r*0.8); });
    const tick = Math.floor(time); const ha = tick*0.52, ma = time*2.2;
    for (const [a, len, er] of [[ha, r*0.5, S*0.05], [ma, r*0.72, S*0.04]]) { ctx.strokeStyle = '#1a0f05'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a)*len, Math.sin(a)*len); ctx.stroke(); eye(ctx, Math.cos(a)*len, Math.sin(a)*len, er, time, -600, 0); }
    ctx.restore(); ctx.textBaseline = 'alphabetic';
  };
  X.twins = (ctx, S, time, v) => {
    ctx.fillStyle = `hsl(${v.hue},20%,16%)`; ctx.beginPath(); ctx.moveTo(-S*0.2, -S*0.78); ctx.lineTo(S*0.2, -S*0.78); ctx.lineTo(S*0.22, 0); ctx.lineTo(-S*0.22, 0); ctx.fill();
    ctx.strokeStyle = '#d6cebf'; ctx.lineWidth = S*0.025; ctx.lineCap = 'round';
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.2, -S*0.72); ctx.lineTo(k*S*0.34, -S*0.45); ctx.lineTo(k*S*(0.3 + (v.atk > 0 ? 0.18 : 0)), -S*0.25); ctx.stroke(); }
    for (const k of [-1, 1]) { const t = Math.sin(time*(k > 0 ? 1.1 : 0.8) + k)*0.3 + k*0.35;
      ctx.save(); ctx.translate(k*S*0.09, -S*0.82); ctx.rotate(t); ctx.fillStyle = '#e3dccd'; ctx.beginPath(); ctx.ellipse(0, -S*0.09, S*0.085, S*0.11, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.03, -S*0.11, S*0.015, 0, TAU); ctx.arc(S*0.03, -S*0.11, S*0.015, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -S*0.04, S*0.025, S*0.03 + Math.abs(Math.sin(time*3 + k))*S*0.02, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = '#5a0a0a'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 8; i++) { ctx.moveTo(-S*0.015, -S*0.78 + i*S*0.03); ctx.lineTo(S*0.015, -S*0.765 + i*S*0.03); } ctx.stroke(); // stitches
  };
  X.wendigo = (ctx, S, time, v) => {
    ctx.strokeStyle = '#1a1512'; ctx.lineWidth = S*0.035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-S*0.05, 0); ctx.lineTo(-S*0.06, -S*0.5); ctx.moveTo(S*0.05, 0); ctx.lineTo(S*0.06, -S*0.5); ctx.stroke();
    ctx.fillStyle = '#1a1512'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.5); ctx.lineTo(-S*0.12, -S*1.05); ctx.lineTo(S*0.12, -S*1.05); ctx.lineTo(S*0.08, -S*0.5); ctx.fill();
    ctx.strokeStyle = 'rgba(210,200,180,0.35)'; ctx.lineWidth = 1.5; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(0, -S*(0.98 - i*0.07), S*0.1, 0.3, Math.PI - 0.3); ctx.stroke(); }
    ctx.strokeStyle = '#1a1512'; ctx.lineWidth = S*0.025; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.12, -S*1.0); ctx.lineTo(k*S*0.22, -S*0.6); ctx.lineTo(k*S*(0.2 + (v.atk > 0 ? 0.25 : 0)), -S*0.2); ctx.stroke(); }
    ctx.fillStyle = '#e2d8c2'; ctx.beginPath(); ctx.moveTo(-S*0.07, -S*1.2); ctx.lineTo(S*0.07, -S*1.2); ctx.lineTo(S*0.03, -S*1.05); ctx.lineTo(-S*0.03, -S*1.05); ctx.fill(); // deer skull
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-S*0.03, -S*1.16, S*0.018, S*0.025, 0, 0, TAU); ctx.ellipse(S*0.03, -S*1.16, S*0.018, S*0.025, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-S*0.03, -S*1.16, S*0.004, 0, TAU); ctx.arc(S*0.03, -S*1.16, S*0.004, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#cfc3a8'; ctx.lineWidth = S*0.012; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.05, -S*1.2); ctx.lineTo(k*S*0.15, -S*1.4); ctx.lineTo(k*S*0.28, -S*1.5); ctx.moveTo(k*S*0.1, -S*1.3); ctx.lineTo(k*S*0.2, -S*1.32); ctx.moveTo(k*S*0.15, -S*1.4); ctx.lineTo(k*S*0.13, -S*1.55); ctx.moveTo(k*S*0.22, -S*1.46); ctx.lineTo(k*S*0.3, -S*1.38); ctx.stroke(); }
  };
  X.jester = (ctx, S, time, v) => {
    const bob = Math.abs(Math.sin(time*3))*S*0.04;
    ctx.save(); ctx.translate(0, -bob);
    ctx.fillStyle = `hsl(${v.hue},60%,25%)`; ctx.fillRect(-S*0.14, -S*0.7, S*0.14, S*0.55); ctx.fillStyle = '#111'; ctx.fillRect(0, -S*0.7, S*0.14, S*0.55);
    ctx.strokeStyle = '#ddd'; ctx.lineWidth = S*0.025; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.15); ctx.lineTo(-S*0.12, bob); ctx.moveTo(S*0.08, -S*0.15); ctx.lineTo(S*0.14, bob);
    ctx.moveTo(-S*0.14, -S*0.65); ctx.lineTo(-S*0.3, -S*0.45 + Math.sin(time*4)*S*0.1); ctx.moveTo(S*0.14, -S*0.65); ctx.lineTo(S*0.3, -S*0.5 - Math.sin(time*4)*S*0.1); ctx.stroke();
    ctx.fillStyle = '#eee'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*S*0.04, -S*0.7); ctx.lineTo(i*S*0.04 + S*0.02, -S*0.66); ctx.lineTo(i*S*0.04 + S*0.04, -S*0.7); ctx.fill(); } // collar
    ctx.fillStyle = '#f1ece4'; ctx.beginPath(); ctx.ellipse(0, -S*0.8, S*0.1, S*0.11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.04, -S*0.86); ctx.lineTo(k*S*0.06, -S*0.83); ctx.lineTo(k*S*0.04, -S*0.79); ctx.lineTo(k*S*0.02, -S*0.83); ctx.fill(); }
    ctx.fillStyle = '#8a0010'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.77); ctx.quadraticCurveTo(0, -S*0.68, S*0.08, -S*0.77); ctx.quadraticCurveTo(0, -S*0.72, -S*0.08, -S*0.77); ctx.fill();
    for (const k of [-1, 1]) { ctx.fillStyle = k < 0 ? `hsl(${v.hue},60%,30%)` : '#151515'; ctx.beginPath(); ctx.moveTo(0, -S*0.9); ctx.quadraticCurveTo(k*S*0.1, -S*1.05, k*S*0.22, -S*0.95 + Math.sin(time*3 + k)*S*0.03); ctx.lineTo(k*S*0.08, -S*0.88); ctx.fill();
      ctx.fillStyle = '#e8c040'; ctx.beginPath(); ctx.arc(k*S*0.22, -S*0.95 + Math.sin(time*3 + k)*S*0.03, S*0.018, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  X.weaver = (ctx, S, time, v) => {
    ctx.strokeStyle = 'rgba(220,220,235,0.18)'; ctx.lineWidth = 1; const cx = 0, cy = -S*0.8;
    for (let i = 0; i < 12; i++) { const a = i/12*TAU; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a)*S, cy + Math.sin(a)*S); ctx.stroke(); }
    for (let r = 1; r < 7; r++) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const a = i/12*TAU; const px = cx + Math.cos(a)*r*S*0.14, py = cy + Math.sin(a)*r*S*0.14; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    ctx.strokeStyle = '#0d0a10'; ctx.lineWidth = S*0.02; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const k = i < 4 ? -1 : 1, j = i%4, ph = Math.sin(time*3 + i)*0.05; ctx.beginPath(); ctx.moveTo(0, -S*0.55);
      ctx.lineTo(k*S*(0.25 + j*0.05), -S*(0.85 - j*0.12 + ph)); ctx.lineTo(k*S*(0.45 + j*0.04), -S*(0.3 - j*0.12) + S*ph); ctx.stroke(); }
    ctx.fillStyle = '#16101a'; ctx.beginPath(); ctx.ellipse(0, -S*0.42, S*0.16, S*0.2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = `hsl(${v.hue},60%,40%)`; ctx.beginPath(); ctx.moveTo(0, -S*0.5); ctx.lineTo(S*0.05, -S*0.4); ctx.lineTo(0, -S*0.32); ctx.lineTo(-S*0.05, -S*0.4); ctx.fill();
    ctx.fillStyle = '#d8d0c6'; ctx.beginPath(); ctx.ellipse(0, -S*0.66, S*0.08, S*0.1, 0, 0, TAU); ctx.fill(); // human face
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.03, -S*0.68, S*0.014, 0, TAU); ctx.arc(S*0.03, -S*0.68, S*0.014, 0, TAU); ctx.arc(-S*0.015, -S*0.72, S*0.008, 0, TAU); ctx.arc(S*0.015, -S*0.72, S*0.008, 0, TAU); ctx.fill();
    ctx.fillStyle = '#300'; ctx.fillRect(-S*0.025, -S*0.62, S*0.05, S*0.012);
  };
  X.tree = (ctx, S, time, v) => {
    ctx.fillStyle = '#1e1610'; ctx.beginPath(); ctx.moveTo(-S*0.2, 0); ctx.quadraticCurveTo(-S*0.1, -S*0.5, -S*0.14, -S*0.95); ctx.lineTo(S*0.14, -S*0.95); ctx.quadraticCurveTo(S*0.1, -S*0.5, S*0.2, 0); ctx.fill();
    ctx.strokeStyle = '#1e1610'; ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const k = i%2 ? 1 : -1; ctx.lineWidth = S*(0.04 - i*0.004); const sw = Math.sin(time*0.8 + i)*S*0.03; ctx.beginPath(); ctx.moveTo(k*S*0.08, -S*(0.75 + i*0.04));
      ctx.quadraticCurveTo(k*S*(0.3 + i*0.03), -S*(1.0 + i*0.05), k*S*(0.45 + i*0.02) + sw, -S*(0.9 + i*0.08) + (v.atk > 0 ? S*0.1 : 0)); ctx.stroke(); }
    for (let i = 0; i < 5; i++) { ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo((i - 2)*S*0.07, -S*0.02); ctx.quadraticCurveTo((i - 2)*S*0.15, S*0.02, (i - 2)*S*0.22, S*0.01); ctx.stroke(); }
    const faces = [[-0.04, -0.75], [0.05, -0.55], [-0.06, -0.35], [0.06, -0.18]];
    faces.forEach(([fx, fy], i) => { const x = fx*S, y = fy*S, r = S*0.05; ctx.fillStyle = '#2c2218'; ctx.beginPath(); ctx.ellipse(x, y, r, r*1.2, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#c8ff60'; ctx.shadowColor = '#9f3'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(x - r*0.35, y - r*0.2, r*0.12, 0, TAU); ctx.arc(x + r*0.35, y - r*0.2, r*0.12, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y + r*0.4, r*0.25, r*(0.2 + Math.abs(Math.sin(time*2 + i))*0.25), 0, 0, TAU); ctx.fill(); });
  };

  // ---------- Rift Gate on the map ----------
  R.rift = (ctx, sx, sy, z, time, rank, ready, label, sub) => {
    const RK = RIFT_RANKS[rank], s = z*(0.85 + rank*0.1);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(sx, sy, 75*s, 24*s, 0, 0, TAU); ctx.fill();
    // standing stones
    ctx.fillStyle = '#2b2730'; for (let i = 0; i < 6; i++) { const a = i/6*TAU + 0.3, px = sx + Math.cos(a)*68*s, py = sy + Math.sin(a)*22*s; if (Math.sin(a) < 0) { ctx.fillRect(px - 6*s, py - 34*s, 12*s, 34*s); } }
    // portal ring
    const pr = 46*s, cy = sy - 62*s;
    if (ready) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, cy, 0, sx, cy, pr*2.2); g.addColorStop(0, `hsla(${RK.h},100%,60%,${0.35 + Math.sin(time*3)*0.1})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(sx - pr*2.2, cy - pr*2.2, pr*4.4, pr*4.4); ctx.globalCompositeOperation = 'source-over'; }
    const pg = ctx.createRadialGradient(sx, cy, 2, sx, cy, pr); pg.addColorStop(0, ready ? '#fff' : '#333'); pg.addColorStop(0.3, ready ? `hsl(${RK.h},90%,45%)` : '#1a1a1a'); pg.addColorStop(1, '#050208');
    ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(sx, cy, pr*0.75, pr, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = ready ? RK.c : '#444'; ctx.lineWidth = 4*s; ctx.stroke();
    if (ready) { ctx.strokeStyle = `hsla(${RK.h},100%,75%,0.6)`; ctx.lineWidth = 1.5*s; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(sx, cy, pr*0.75*(0.3 + ((time*0.5 + i/4) % 1)*0.7), pr*(0.3 + ((time*0.5 + i/4) % 1)*0.7), 0, 0, TAU); ctx.stroke(); } }
    ctx.fillStyle = '#2b2730'; for (let i = 0; i < 6; i++) { const a = i/6*TAU + 0.3, px = sx + Math.cos(a)*68*s, py = sy + Math.sin(a)*22*s; if (Math.sin(a) >= 0) ctx.fillRect(px - 6*s, py - 34*s, 12*s, 34*s); }
    ctx.textAlign = 'center'; ctx.font = `800 ${Math.max(11, 13*z)}px ${FONT}`; ctx.fillStyle = ready ? RK.c : '#888'; ctx.shadowColor = '#000'; ctx.shadowBlur = 5;
    ctx.fillText(label, sx, cy - pr - 12*s); if (sub) { ctx.font = `600 ${Math.max(10, 11*z)}px ${FONT}`; ctx.fillStyle = '#bbb'; ctx.fillText(sub, sx, cy - pr - 12*s + 15*z); }
    ctx.restore();
  };

  // ---------- Event Gate (×5) ----------
  R.eventGate = (ctx, sx, sy, z, time, ev, label, taken) => {
    const h = ev.type.h, s = z, cy = sy - 90*s;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // light pillar + rays
    const pg = ctx.createLinearGradient(0, cy - 600*s, 0, sy); pg.addColorStop(0, `hsla(${h},100%,70%,0)`); pg.addColorStop(1, `hsla(${h},100%,70%,${taken ? 0.1 : 0.35})`);
    ctx.fillStyle = pg; ctx.fillRect(sx - 40*s, cy - 600*s, 80*s, sy - cy + 600*s);
    for (let i = 0; i < 16; i++) { const a = i/16*TAU + time*0.4; ctx.fillStyle = `hsla(${h},100%,75%,${taken ? 0.04 : 0.1})`; ctx.beginPath(); ctx.moveTo(sx, cy);
      ctx.lineTo(sx + Math.cos(a - 0.06)*220*s, cy + Math.sin(a - 0.06)*220*s); ctx.lineTo(sx + Math.cos(a + 0.06)*220*s, cy + Math.sin(a + 0.06)*220*s); ctx.fill(); }
    const g = ctx.createRadialGradient(sx, cy, 0, sx, cy, 70*s); g.addColorStop(0, '#fff'); g.addColorStop(0.35, `hsla(${h},100%,65%,0.9)`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, cy, 52*s, 72*s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = `hsla(${h},100%,80%,0.9)`; ctx.lineWidth = 4*s; ctx.beginPath(); ctx.ellipse(sx, cy, 52*s, 72*s, 0, 0, TAU); ctx.stroke();
    for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(sx, cy); ctx.rotate(time*(0.8 + i*0.4)*(i%2 ? -1 : 1)); ctx.strokeStyle = `hsla(${(h + i*30)%360},100%,75%,0.6)`; ctx.lineWidth = 2*s;
      ctx.beginPath(); ctx.ellipse(0, 0, (62 + i*10)*s, (20 + i*6)*s, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    for (let i = 0; i < 14; i++) { const ph = (time*0.5 + i/14) % 1; ctx.fillStyle = `hsla(${h},100%,80%,${1 - ph})`; ctx.fillRect(sx + Math.sin(i*5.3)*60*s, sy - ph*200*s, 3*s, 3*s); }
    ctx.restore();
    ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.font = `900 ${Math.max(18, 30*z)}px ${FONT}`; ctx.fillStyle = `hsl(${h},100%,75%)`; ctx.fillText('×5', sx, cy - 85*s);
    ctx.font = `700 ${Math.max(11, 13*z)}px ${FONT}`; ctx.fillStyle = '#fff'; ctx.fillText(label, sx, cy - 110*s); ctx.shadowBlur = 0;
  };
})();
