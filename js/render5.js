// GodK Bá Khí v1.4 — high-realm aura effects (eclipse, paradox, genesis…), boss forms 10–12, 6 new bosses
'use strict';
(() => {
  const TAU = Math.PI*2, { hsl, rnd, eye } = R, X = R.extra;

  // ---------------- extra aura effects (called from auraBack / auraFront) ----------------
  R.auraExtra = (ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy) => {
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    if (back) {
      if (A.eclipse) { // black sun with a burning corona behind the head
        const ex = cx, ey = cy - h*0.62, r = w*0.55;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 28; i++) { const a = i/28*TAU + time*0.15, len = r*(1.5 + 0.5*Math.sin(time*3 + i*1.7));
          ctx.strokeStyle = hsl(A.rainbow ? (hue + i*12)%360 : 38 + (i%3)*8, 100, 62, 0.55); ctx.lineWidth = 2.2*sc; ctx.beginPath(); ctx.moveTo(ex + Math.cos(a)*r*1.02, ey + Math.sin(a)*r*1.02); ctx.lineTo(ex + Math.cos(a)*len, ey + Math.sin(a)*len); ctx.stroke(); }
        const cg = ctx.createRadialGradient(ex, ey, r*0.95, ex, ey, r*1.6); cg.addColorStop(0, 'rgba(255,210,130,0.55)'); cg.addColorStop(0.3, 'rgba(255,130,40,0.22)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(ex, ey, r*1.6, 0, TAU); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#030203'; ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(255,240,200,0.95)'; ctx.lineWidth = 1.5*sc; ctx.stroke();
        for (let i = 0; i < 3; i++) { const a = time*0.9 + i*TAU/3, px = cx + Math.cos(a)*w*1.6, py = cy + Math.sin(a)*w*0.45; // mini suns
          if (Math.sin(a) > 0) continue; const g = ctx.createRadialGradient(px, py, 0, px, py, 7*sc); g.addColorStop(0, '#fff'); g.addColorStop(0.4, '#ffb030'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 7*sc, 0, TAU); ctx.fill(); }
      }
      if (A.yinyang) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(time*0.5); const r = w*1.45; ctx.globalAlpha = 0.28;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI/2, Math.PI/2); ctx.arc(0, r/2, r/2, Math.PI/2, -Math.PI/2, true); ctx.arc(0, -r/2, r/2, Math.PI/2, -Math.PI/2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI/2, -Math.PI/2); ctx.arc(0, -r/2, r/2, -Math.PI/2, Math.PI/2, true); ctx.arc(0, r/2, r/2, -Math.PI/2, Math.PI/2); ctx.fill();
        ctx.globalAlpha = 0.5; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, -r/2, r*0.12, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, r/2, r*0.12, 0, TAU); ctx.fill(); ctx.restore(); }
      if (A.spiral) { ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let arm = 0; arm < 3; arm++) for (let i = 0; i < 40; i++) { const k = i/40, a = arm*TAU/3 + k*5 + time*0.6, r = w*(0.4 + k*2.4);
          ctx.fillStyle = hsl(A.rainbow ? (hue + i*6 + arm*60)%360 : (A.h + i*3)%360, 100, 75, (1 - k)*0.7); const px = cx + Math.cos(a)*r, py = cy + Math.sin(a)*r*0.42;
          ctx.fillRect(px - 1.4*sc, py - 1.4*sc, 2.8*sc*(1.2 - k), 2.8*sc*(1.2 - k)); } ctx.restore(); }
      if (A.clock) { ctx.save(); ctx.translate(cx, cy - h*0.2); const r = w*1.7; ctx.strokeStyle = hsl(hue, 100, 80, 0.45); ctx.lineWidth = 1.5*sc; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
        for (let i = 0; i < 12; i++) { const a = i/12*TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.88, Math.sin(a)*r*0.88); ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); ctx.stroke(); }
        ctx.lineWidth = 2.5*sc; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-time*1.2)*r*0.8, Math.sin(-time*1.2)*r*0.8); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-time*0.1)*r*0.5, Math.sin(-time*0.1)*r*0.5); ctx.stroke(); ctx.restore(); }
      if (A.eyeVoid) { const blink = Math.sin(time*0.6) > 0.95 ? 0.1 : 1, ey = cy - h*1.0; ctx.fillStyle = 'rgba(235,225,255,0.9)'; ctx.beginPath(); ctx.ellipse(cx, ey, w*0.38, w*0.14*blink, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = hsl(A.oh, 100, 55); ctx.beginPath(); ctx.arc(cx + Math.sin(time*0.7)*w*0.1, ey, w*0.11*blink, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(cx + Math.sin(time*0.7)*w*0.1, ey, w*0.045*blink, 0, TAU); ctx.fill(); }
    }
    if (A.dragon) drawDragon(ctx, A, cx, cy, w, h, sc, time, hue, back);
    if (A.comet) { for (let i = 0; i < 3; i++) { const a = time*1.4 + i*TAU/3; if ((Math.sin(a) < 0) !== back) continue; const px = cx + Math.cos(a)*w*1.7, py = cy + Math.sin(a)*w*0.5 - h*0.1;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 10; k++) { const aa = a - k*0.07; ctx.fillStyle = hsl(A.h, 100, 80, (1 - k/10)*0.8); ctx.beginPath(); ctx.arc(cx + Math.cos(aa)*w*1.7, cy + Math.sin(aa)*w*0.5 - h*0.1, (4 - k*0.3)*sc, 0, TAU); ctx.fill(); } ctx.restore(); } }
    if (A.crownlight && !back) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hy = cy - h*1.05, r = 16*sc; ctx.strokeStyle = hsl(A.rainbow ? hue : 48, 100, 80, 0.9); ctx.lineWidth = 2.2*sc; ctx.shadowColor = '#fff3b0'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.ellipse(cx, hy, r, r*0.3, 0, 0, TAU); ctx.stroke(); for (let i = 0; i < 9; i++) { const a = i/9*TAU + time*0.4; if (Math.sin(a) > 0.3) continue; const px = cx + Math.cos(a)*r, py = hy + Math.sin(a)*r*0.3;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - (8 + (i%2)*6)*sc); ctx.stroke(); } ctx.restore(); }
    ctx.restore();
  };
  function drawDragon(ctx, A, cx, cy, w, h, sc, time, hue, back){
    const N = 34; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = N - 1; i >= 0; i--) { const a = time*1.1 - i*0.16, depth = Math.sin(a); if ((depth < 0) !== back) continue;
      const px = cx + Math.cos(a)*w*1.55, py = cy - h*0.2 + Math.sin(a)*w*0.45 + Math.sin(time*2 + i*0.4)*h*0.25 - i*0.4*sc, r = (i === 0 ? 7 : 5.5 - i*0.12)*sc*(back ? 0.85 : 1.1);
      ctx.fillStyle = hsl(A.rainbow ? (hue + i*8)%360 : (A.oh + i*2)%360, 100, i === 0 ? 85 : 70, 0.85 - i*0.015); ctx.beginPath(); ctx.arc(px, py, Math.max(1, r), 0, TAU); ctx.fill();
      if (i === 0) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px + Math.cos(a + 1.6)*3*sc, py - 2*sc, 1.6*sc, 0, TAU); ctx.fill();
        ctx.strokeStyle = hsl(A.rainbow ? hue : A.h, 100, 85, 0.8); ctx.lineWidth = 1.2*sc; ctx.beginPath(); ctx.moveTo(px, py - 4*sc); ctx.lineTo(px - 6*sc, py - 12*sc); ctx.moveTo(px, py - 4*sc); ctx.lineTo(px + 4*sc, py - 13*sc); ctx.stroke(); } }
    ctx.restore();
  }

  // ---------------- boss forms 10–12 (eclipse, paradox split, rainbow GodK) ----------------
  const baseBossAura = R.bossAura;
  R.bossAura = (ctx, cx, cy, S, time, fi, boost) => {
    const i = Math.max(0, Math.min(BOSS_FORMS.length - 1, fi)), F_ = BOSS_FORMS[i];
    if (F_.eclipse) { const ey = cy - S*1.05, r = S*0.16; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx, ey, r*0.9, cx, ey, r*2.4);
      g.addColorStop(0, 'rgba(255,210,120,0.9)'); g.addColorStop(0.3, 'rgba(255,120,30,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, ey, r*2.4, 0, TAU); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#020102'; ctx.beginPath(); ctx.arc(cx, ey, r, 0, TAU); ctx.fill(); }
    if (F_.rainbow) { const h0 = F_.h; F_.h = (time*90) % 360; baseBossAura(ctx, cx, cy, S, time, i, boost); F_.h = h0; return; }
    if (F_.dual) { const h0 = F_.h; for (const side of [-1, 1]) { ctx.save(); ctx.beginPath(); ctx.rect(side < 0 ? cx - 1e4 : cx, cy - 1e4, 1e4, 2e4); ctx.clip(); F_.h = side < 0 ? h0 : F_.h2;
      baseBossAura(ctx, cx, cy, S, time*(side < 0 ? 1 : 1.13), i, boost); ctx.restore(); } F_.h = h0; return; }
    baseBossAura(ctx, cx, cy, S, time, i, boost);
  };

  // ---------------- new bosses ----------------
  X.hydra = (ctx, S, time, v) => {
    ctx.fillStyle = `hsl(${v.hue},35%,14%)`; ctx.beginPath(); ctx.ellipse(0, -S*0.2, S*0.32, S*0.2, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 9; i++) { const base = -S*0.25 + (i - 4)*S*0.06, sw = Math.sin(time*1.6 + i*0.8)*S*0.08, hx = (i - 4)*S*0.11 + sw, hy = -S*(0.75 + Math.abs(i - 4)*-0.04 + Math.sin(time*2 + i)*0.04) - (v.atk > 0 && i%3 === 0 ? S*0.1 : 0);
      ctx.strokeStyle = `hsl(${v.hue},35%,${16 + (i%3)*4}%)`; ctx.lineWidth = S*0.045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo((i - 4)*S*0.04, -S*0.3); ctx.quadraticCurveTo(base + sw*2, -S*0.5, hx, hy); ctx.stroke();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate((i - 4)*0.12); ctx.fillStyle = `hsl(${v.hue},35%,20%)`; ctx.beginPath(); ctx.ellipse(0, 0, S*0.05, S*0.035, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffe040'; ctx.beginPath(); ctx.arc(-S*0.018, -S*0.01, S*0.008, 0, TAU); ctx.arc(S*0.018, -S*0.01, S*0.008, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#c33'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, S*0.03); ctx.lineTo(-S*0.01, S*0.06); ctx.moveTo(0, S*0.03); ctx.lineTo(S*0.01, S*0.06); ctx.stroke(); ctx.restore(); }
  };
  X.puppeteer = (ctx, S, time, v) => {
    // cross bar & strings up into the dark, little puppets dangling
    const bx = 0, by = -S*1.25; ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo(bx - S*0.3, by + Math.sin(time)*S*0.02); ctx.lineTo(bx + S*0.3, by - Math.sin(time)*S*0.02); ctx.stroke();
    ctx.fillStyle = '#0b0910'; ctx.beginPath(); ctx.ellipse(0, -S*1.45, S*0.25, S*0.18, 0, 0, TAU); ctx.fill(); // looming hood above
    ctx.fillStyle = '#e8e0d2'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.08, -S*1.42, S*0.03, S*0.015, 0, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 4; i++) { const px = -S*0.36 + i*S*0.24, py = -S*0.5 + Math.sin(time*2 + i)*S*0.05;
      ctx.strokeStyle = 'rgba(230,230,230,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px*0.8, by); ctx.lineTo(px, py - S*0.12); ctx.stroke();
      const P = R.pose(0, time + i, true, time*6 + i, 1); ctx.save(); ctx.translate(px, py + S*0.2); ctx.rotate(Math.sin(time*2.3 + i)*0.25);
      R.stickman(ctx, 0, 0, S/180, P, { color: '#c9b8a6', headFill: '#3a1010', eyes: i === 2 ? '#f22' : null, outline: false }); ctx.restore(); }
    for (const k of [-1, 1]) { ctx.strokeStyle = '#d8d0c2'; ctx.lineWidth = S*0.015; ctx.beginPath(); ctx.moveTo(k*S*0.2, -S*1.38); ctx.lineTo(k*S*0.3, by); ctx.stroke(); }
  };
  X.sphinx = (ctx, S, time, v) => {
    ctx.fillStyle = '#b08a4a'; ctx.beginPath(); ctx.moveTo(-S*0.5, 0); ctx.lineTo(-S*0.45, -S*0.3); ctx.quadraticCurveTo(-S*0.1, -S*0.42, S*0.1, -S*0.35); ctx.lineTo(S*0.45, -S*0.06); ctx.lineTo(S*0.45, 0); ctx.fill(); // body
    ctx.fillStyle = '#9a7840'; ctx.fillRect(S*0.1, -S*0.08, S*0.4, S*0.08); // paws
    ctx.fillStyle = '#2a4a8a'; ctx.beginPath(); ctx.moveTo(S*0.02, -S*0.85); ctx.lineTo(S*0.3, -S*0.85); ctx.lineTo(S*0.36, -S*0.35); ctx.lineTo(-S*0.04, -S*0.35); ctx.fill(); // headdress
    ctx.strokeStyle = '#e6c24a'; ctx.lineWidth = S*0.012; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(S*0.0 + i*S*0.002, -S*(0.8 - i*0.08)); ctx.lineTo(S*0.34, -S*(0.8 - i*0.08)); ctx.stroke(); }
    ctx.fillStyle = '#c89a58'; ctx.beginPath(); ctx.ellipse(S*0.16, -S*0.62, S*0.11, S*0.15, 0, 0, TAU); ctx.fill(); // face, no mouth
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(S*0.12, -S*0.66, S*0.022, S*0.012, 0, 0, TAU); ctx.ellipse(S*0.21, -S*0.66, S*0.022, S*0.012, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = `hsla(${v.hue},100%,70%,${0.6 + Math.sin(time*3)*0.3})`; ctx.beginPath(); ctx.arc(S*0.12, -S*0.66, S*0.006, 0, TAU); ctx.arc(S*0.21, -S*0.66, S*0.006, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#8a6a38'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(S*0.08, -S*0.54); ctx.lineTo(S*0.25, -S*0.54); ctx.stroke(); // sealed mouth
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(S*(0.11 + i*0.05), -S*0.56); ctx.lineTo(S*(0.11 + i*0.05), -S*0.52); ctx.stroke(); }
    ctx.font = `700 ${S*0.06}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = `hsla(${v.hue},100%,75%,${0.4 + Math.sin(time*2)*0.3})`; ctx.fillText('?', S*0.16 + Math.sin(time)*S*0.2, -S*1.0 + Math.cos(time*1.3)*S*0.05);
  };
  X.eclipseking = (ctx, S, time, v) => {
    const ey = -S*1.18, r = S*0.2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 24; i++) { const a = i/24*TAU + time*0.2, len = r*(1.6 + 0.5*Math.sin(time*4 + i)); ctx.strokeStyle = `hsla(${35 + (i%3)*8},100%,60%,0.7)`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*r, ey + Math.sin(a)*r); ctx.lineTo(Math.cos(a)*len, ey + Math.sin(a)*len); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, ey, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffe9b0'; ctx.lineWidth = 2; ctx.stroke(); // the black sun is its crown
    ctx.fillStyle = '#120a04'; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.9); ctx.lineTo(S*0.1, -S*0.9); ctx.lineTo(S*0.34, 0); for (let i = 0; i < 8; i++) ctx.lineTo(S*(0.34 - i*0.085), (i%2) ? -S*0.06 : 0); ctx.lineTo(-S*0.34, 0); ctx.fill();
    ctx.strokeStyle = '#c8901a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.9); ctx.lineTo(-S*0.34, 0); ctx.moveTo(S*0.1, -S*0.9); ctx.lineTo(S*0.34, 0); ctx.stroke();
    ctx.fillStyle = '#d9c9a0'; ctx.beginPath(); ctx.ellipse(0, -S*0.98, S*0.08, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-S*0.03, -S*1.0, S*0.02, S*0.025, 0, 0, TAU); ctx.ellipse(S*0.03, -S*1.0, S*0.02, S*0.025, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ffb020'; ctx.shadowColor = '#fa0'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(-S*0.03, -S*1.0, S*0.007, 0, TAU); ctx.arc(S*0.03, -S*1.0, S*0.007, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#c8901a'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo(S*0.12, -S*0.75); ctx.lineTo(S*0.3 + (v.atk > 0 ? S*0.15 : 0), -S*0.45); ctx.stroke();
    ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.arc(S*0.3 + (v.atk > 0 ? S*0.15 : 0), -S*0.45, S*0.03, 0, TAU); ctx.fill();
  };
  X.paradox = (ctx, S, time, v) => {
    const P = R.pose(11, time, false, 0, 1), P2 = R.pose(8, time + 1, false, 0, 1);
    for (const [side, pose, col, h] of [[-1, P, '#e9fbff', 185], [1, P2, '#1a0010', 312]]) { ctx.save(); ctx.beginPath(); ctx.rect(side < 0 ? -1e4 : 0, -1e4, 1e4, 2e4); ctx.clip();
      ctx.translate(0, 0); R.stickman(ctx, 0, -S*0.05, S/90, side < 0 ? P : P2, { color: col, headFill: side < 0 ? '#000' : '#fff', eyes: `hsl(${h},100%,70%)`, outlineColor: `hsl(${h},100%,60%)`, smile: side > 0 }); ctx.restore(); }
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(0, -S*1.4); ctx.lineTo(0, 0); ctx.stroke(); ctx.setLineDash([]);
    for (let i = 0; i < 12; i++) { const ph = (time*0.3 + i/12) % 1; ctx.fillStyle = i%2 ? 'rgba(120,240,255,0.7)' : 'rgba(255,80,200,0.7)'; ctx.fillRect((i%2 ? 1 : -1)*S*0.3*(1 - ph), -S*0.2 - ph*S, 3, 3); }
  };
  X.firstgod = (ctx, S, time, v) => {
    const hue = (time*60) % 360;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18; i++) { const a = i/18*TAU + time*0.2; ctx.fillStyle = `hsla(${(hue + i*20)%360},100%,70%,0.08)`; ctx.beginPath(); ctx.moveTo(0, -S*0.7);
      ctx.lineTo(Math.cos(a - 0.06)*S*1.4, -S*0.7 + Math.sin(a - 0.06)*S*1.4); ctx.lineTo(Math.cos(a + 0.06)*S*1.4, -S*0.7 + Math.sin(a + 0.06)*S*1.4); ctx.fill(); } ctx.restore();
    const P = R.pose(12, time, false, 0, 1); P.float = 12; const sc = S/95;
    R.stickman(ctx, 0, 0, sc, P, { color: '#fff8e0', headFill: '#000', eyes: `hsl(${hue},100%,75%)`, glow: `hsl(${hue},100%,70%)`, outlineColor: `hsl(${hue},100%,55%)` });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `hsl(${hue},100%,80%)`; ctx.lineWidth = 3; ctx.shadowColor = '#fff'; ctx.shadowBlur = 20;
    const hy = -62*sc*(0.86 + 0.114) - (P.float||0)*sc - 62*sc*0.25; ctx.beginPath(); ctx.ellipse(0, hy, S*0.13, S*0.035, 0, 0, TAU); ctx.stroke();
    for (let i = 0; i < 4; i++) { const a = time*0.8 + i*TAU/4; ctx.beginPath(); ctx.ellipse(0, -S*0.45, S*(0.45 + i*0.08), S*(0.15 + i*0.03), a*0.3, 0, TAU); ctx.globalAlpha = 0.35; ctx.stroke(); }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.font = `900 ${S*0.07}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = `hsla(${hue},100%,80%,0.8)`; ctx.fillText('霸 氣', 0, -S*0.95);
  };
})();
