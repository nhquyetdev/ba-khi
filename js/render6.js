// GodK Bá Khí v1.5 — murim/folklore bosses, Mirror Gate, "Thena's Murim" skin
'use strict';
(() => {
  const TAU = Math.PI*2, { rnd, eye } = R, X = R.extra;

  X.demoncult = (ctx, S, time, v) => {
    const sway = Math.sin(time*0.9)*S*0.01;
    ctx.fillStyle = '#120608'; ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.85); ctx.lineTo(S*0.12, -S*0.85); ctx.lineTo(S*0.32, 0); for (let i = 0; i < 8; i++) ctx.lineTo(S*(0.32 - i*0.08), (i%2) ? -S*0.05 : 0); ctx.lineTo(-S*0.32, 0); ctx.fill(); // black robe
    ctx.strokeStyle = '#b0101c'; ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.85); ctx.lineTo(-S*0.32, 0); ctx.moveTo(S*0.12, -S*0.85); ctx.lineTo(S*0.32, 0); ctx.moveTo(0, -S*0.85); ctx.lineTo(0, -S*0.45); ctx.stroke();
    ctx.fillStyle = '#b0101c'; ctx.fillRect(-S*0.13, -S*0.5, S*0.26, S*0.04); // sash
    // long white hair flowing
    ctx.fillStyle = '#e8e8ee'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*1.02); ctx.quadraticCurveTo(-S*0.3 + sway, -S*0.7, -S*0.28 + sway*2, -S*0.35); ctx.lineTo(-S*0.18, -S*0.4); ctx.quadraticCurveTo(-S*0.12, -S*0.8, -S*0.04, -S*0.9); ctx.fill();
    ctx.fillStyle = '#e2d8cc'; ctx.beginPath(); ctx.ellipse(0, -S*0.95, S*0.075, S*0.095, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8e8ee'; ctx.beginPath(); ctx.arc(0, -S*0.99, S*0.08, Math.PI*1.05, Math.PI*1.95); ctx.fill();
    ctx.fillStyle = '#ff1a2a'; ctx.shadowColor = '#f00'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.ellipse(-S*0.03, -S*0.95, S*0.016, S*0.008, 0.2, 0, TAU); ctx.ellipse(S*0.03, -S*0.95, S*0.016, S*0.008, -0.2, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#b0101c'; ctx.beginPath(); ctx.moveTo(-S*0.01, -S*1.06); ctx.lineTo(0, -S*1.0); ctx.lineTo(S*0.01, -S*1.06); ctx.fill(); // demon mark
    ctx.strokeStyle = '#120608'; ctx.lineWidth = S*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(S*0.12, -S*0.78); ctx.lineTo(S*0.3, -S*0.6 - (v.atk > 0 ? S*0.15 : 0)); ctx.moveTo(-S*0.12, -S*0.78); ctx.lineTo(-S*0.14, -S*0.52); ctx.stroke(); // hands behind
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const a = time*1.3 + i*2.1; ctx.fillStyle = 'rgba(255,30,50,0.35)'; ctx.beginPath(); ctx.arc(S*0.3 + Math.cos(a)*S*0.05, -S*0.6 + Math.sin(a)*S*0.05, S*0.04, 0, TAU); ctx.fill(); } ctx.restore(); // demonic qi in palm
  };
  X.bloodsword = (ctx, S, time, v) => {
    // a skeletal swordsman in rags, the sword glowing red and pulling the body
    const pull = v.atk > 0 ? -S*0.15 : Math.sin(time*1.3)*S*0.02;
    ctx.fillStyle = 'rgba(60,10,14,0.85)'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.8); ctx.lineTo(S*0.1, -S*0.8); ctx.lineTo(S*0.2, -S*0.15); ctx.lineTo(S*0.05, -S*0.22); ctx.lineTo(-S*0.05, -S*0.12); ctx.lineTo(-S*0.18, -S*0.2); ctx.fill();
    ctx.strokeStyle = '#d4c9b4'; ctx.lineWidth = S*0.022; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.05, -S*0.2); ctx.lineTo(-S*0.1, 0); ctx.moveTo(S*0.05, -S*0.2); ctx.lineTo(S*0.1, 0); ctx.stroke();
    ctx.fillStyle = '#d4c9b4'; ctx.beginPath(); ctx.arc(0, -S*0.9, S*0.07, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.025, -S*0.91, S*0.017, 0, TAU); ctx.arc(S*0.025, -S*0.91, S*0.017, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.ellipse(0, -S*0.97, S*0.16, S*0.03, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-S*0.07, -S*0.98); ctx.lineTo(0, -S*1.08); ctx.lineTo(S*0.07, -S*0.98); ctx.fill(); // bamboo hat
    ctx.save(); ctx.translate(-S*0.15 + pull, -S*0.6); ctx.rotate(-1.3 + Math.sin(time*2)*0.05);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,20,40,0.5)'; ctx.lineWidth = S*0.05; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.75); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = '#ffccd0'; ctx.lineWidth = S*0.016; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.75); ctx.stroke(); ctx.strokeStyle = '#3a0508'; ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.moveTo(0, S*0.02); ctx.lineTo(0, S*0.14); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = '#d4c9b4'; ctx.lineWidth = S*0.018; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.75); ctx.lineTo(-S*0.15 + pull, -S*0.6); ctx.stroke();
    ctx.fillStyle = 'rgba(200,0,20,0.8)'; for (let i = 0; i < 6; i++) { const ph = (time*0.9 + i*0.17) % 1; ctx.beginPath(); ctx.arc(-S*0.15 + pull + Math.sin(i*5)*S*0.05, -S*0.6 + ph*S*0.6, S*0.008, 0, TAU); ctx.fill(); }
  };
  X.boneghost = (ctx, S, time, v) => {
    const flick = Math.sin(time*0.7) > 0.4; // shifts between a kind old woman and a skeleton
    ctx.fillStyle = flick ? '#c8c2b4' : '#5a5040'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.8); ctx.lineTo(S*0.08, -S*0.8); ctx.lineTo(S*0.22, 0); ctx.lineTo(-S*0.22, 0); ctx.fill();
    if (flick) { ctx.strokeStyle = '#8a8070'; ctx.lineWidth = S*0.012; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, -S*(0.72 - i*0.07), S*0.08, 0.2, Math.PI - 0.2); ctx.stroke(); } }
    ctx.fillStyle = flick ? '#efe9da' : '#d9c9a8'; ctx.beginPath(); ctx.ellipse(0, -S*0.9, S*0.08, S*0.1, 0, 0, TAU); ctx.fill();
    if (flick) { ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-S*0.03, -S*0.92, S*0.02, S*0.026, 0, 0, TAU); ctx.ellipse(S*0.03, -S*0.92, S*0.02, S*0.026, 0, 0, TAU); ctx.fill(); ctx.fillRect(-S*0.03, -S*0.84, S*0.06, S*0.012);
      for (let i = -2; i <= 2; i++) { ctx.fillRect(i*S*0.012, -S*0.85, 1, S*0.02); } }
    else { ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-S*0.03, -S*0.92, S*0.012, Math.PI, TAU); ctx.arc(S*0.03, -S*0.92, S*0.012, Math.PI, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -S*0.86, S*0.03, 0.1, Math.PI - 0.1); ctx.stroke(); }
    ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.arc(0, -S*0.99, S*0.05, Math.PI, TAU); ctx.fill(); // grey bun
    ctx.strokeStyle = '#6a5a40'; ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.moveTo(S*0.16, -S*0.55); ctx.lineTo(S*0.2, 0); ctx.stroke(); // cane
    ctx.strokeStyle = flick ? '#c8c2b4' : '#5a5040'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo(S*0.06, -S*0.72); ctx.lineTo(S*0.16, -S*0.55 - (v.atk > 0 ? S*0.12 : 0)); ctx.stroke();
  };
  X.wuchang = (ctx, S, time, v) => {
    for (const [k, robe, face, tongue, hat] of [[-1, '#f0efe9', '#e8e4da', '#c01020', '一見生財'], [1, '#141414', '#2a2a2a', null, '天下太平']]) {
      const x = k*S*0.2, bob = Math.sin(time*1.4 + k)*S*0.02;
      ctx.save(); ctx.translate(x, -bob);
      ctx.fillStyle = robe; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.78); ctx.lineTo(S*0.06, -S*0.78); ctx.lineTo(S*0.14, 0); ctx.lineTo(-S*0.14, 0); ctx.fill();
      ctx.fillStyle = face; ctx.beginPath(); ctx.ellipse(0, -S*0.86, S*0.06, S*0.075, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = robe; ctx.beginPath(); ctx.moveTo(-S*0.07, -S*0.9); ctx.lineTo(S*0.07, -S*0.9); ctx.lineTo(S*0.05, -S*1.3); ctx.lineTo(-S*0.05, -S*1.3); ctx.fill(); // tall hat
      ctx.fillStyle = k < 0 ? '#222' : '#ddd'; ctx.font = `700 ${S*0.032}px ${FONT}`; ctx.textAlign = 'center';
      for (let i = 0; i < 4; i++) ctx.fillText(hat[i], 0, -S*(1.22 - i*0.075));
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.022, -S*0.88, S*0.009, 0, TAU); ctx.arc(S*0.022, -S*0.88, S*0.009, 0, TAU); ctx.fill();
      if (tongue) { ctx.fillStyle = tongue; ctx.beginPath(); ctx.moveTo(-S*0.012, -S*0.83); ctx.lineTo(S*0.012, -S*0.83); ctx.lineTo(S*0.008, -S*0.62 + Math.sin(time*2)*S*0.01); ctx.lineTo(-S*0.008, -S*0.62); ctx.fill(); } // long red tongue
      ctx.strokeStyle = '#777'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { ctx.moveTo(k*S*0.08, -S*0.55 + i*S*0.05); ctx.ellipse(k*S*0.08, -S*0.55 + i*S*0.05, S*0.01, S*0.02, 0, 0, TAU); } ctx.stroke(); // shackle chain
      ctx.restore();
    }
  };
  X.tiangou = (ctx, S, time, v) => {
    const my = -S*1.0; // the moon being eaten
    ctx.fillStyle = '#f6efd8'; ctx.beginPath(); ctx.arc(S*0.25, my, S*0.16, 0, TAU); ctx.fill();
    ctx.fillStyle = '#060406'; ctx.beginPath(); ctx.arc(S*0.25 - S*0.12 - Math.sin(time*0.4)*S*0.03, my, S*0.17, 0, TAU); ctx.fill();
    ctx.fillStyle = `hsl(${v.hue},40%,12%)`; // giant hound silhouette
    ctx.beginPath(); ctx.moveTo(-S*0.5, 0); ctx.lineTo(-S*0.42, -S*0.4); ctx.quadraticCurveTo(-S*0.2, -S*0.7, S*0.02, -S*0.78); ctx.lineTo(S*0.08, -S*0.95); ctx.lineTo(S*0.12, -S*0.8); ctx.lineTo(S*0.2, -S*0.9);
    ctx.lineTo(S*0.2, -S*0.76); ctx.lineTo(S*0.42 + (v.atk > 0 ? S*0.1 : 0), -S*0.7); ctx.lineTo(S*0.3, -S*0.6); ctx.lineTo(S*0.12, -S*0.58); ctx.lineTo(S*0.05, -S*0.3); ctx.lineTo(S*0.12, 0); ctx.lineTo(-S*0.05, 0); ctx.lineTo(-S*0.12, -S*0.28); ctx.lineTo(-S*0.3, -S*0.3); ctx.lineTo(-S*0.32, 0); ctx.fill();
    ctx.fillStyle = '#ffb020'; ctx.shadowColor = '#f90'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(S*0.18, -S*0.75, S*0.014, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#eee'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(S*(0.25 + i*0.04), -S*0.66); ctx.lineTo(S*(0.27 + i*0.04), -S*0.62); ctx.lineTo(S*(0.29 + i*0.04), -S*0.66); ctx.fill(); }
    ctx.strokeStyle = `hsl(${v.hue},40%,12%)`; ctx.lineWidth = S*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.45, -S*0.35); ctx.quadraticCurveTo(-S*0.7, -S*0.5, -S*0.6 + Math.sin(time*3)*S*0.05, -S*0.75); ctx.stroke(); // tail
  };

  // ---------------- Mirror Gate on the map ----------------
  R.mirrorGate = (ctx, sx, sy, z, time, ready, label, sub, ch) => {
    const s = z;
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(sx, sy, 60*s, 18*s, 0, 0, TAU); ctx.fill();
    const cy = sy - 85*s, w = 42*s, h = 75*s;
    ctx.fillStyle = '#3a2e1a'; ctx.beginPath(); ctx.ellipse(sx, cy, w + 7*s, h + 7*s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#c9a24a'; ctx.lineWidth = 2*s; ctx.stroke();
    const g = ctx.createLinearGradient(sx - w, cy - h, sx + w, cy + h); g.addColorStop(0, ready ? '#b8ccd8' : '#555'); g.addColorStop(0.5, ready ? '#3c4b56' : '#222'); g.addColorStop(1, ready ? '#9ab0bd' : '#444');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, cy, w, h, 0, 0, TAU); ctx.fill();
    if (ready && ch) { ctx.save(); ctx.beginPath(); ctx.ellipse(sx, cy, w, h, 0, 0, TAU); ctx.clip(); ctx.globalAlpha = 0.85;
      R.character(ctx, sx, cy + h*0.75, s*1.0, Object.assign(ch, { face: -1, mirror: true, moving: false }), time); ctx.restore(); }
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5*s; ctx.beginPath(); ctx.moveTo(sx - w*0.5, cy - h*0.6); ctx.lineTo(sx - w*0.2, cy - h*0.75); ctx.stroke();
    if (ready) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(sx, cy, 0, sx, cy, h*1.6); gl.addColorStop(0, `rgba(255,40,70,${0.12 + Math.sin(time*2)*0.06})`); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(sx - h*1.6, cy - h*1.6, h*3.2, h*3.2); ctx.restore(); }
    ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 5; ctx.font = `800 ${Math.max(11, 13*z)}px ${FONT}`; ctx.fillStyle = ready ? '#ff8a9a' : '#888'; ctx.fillText(label, sx, cy - h - 14*s);
    if (sub) { ctx.font = `600 ${Math.max(10, 11*z)}px ${FONT}`; ctx.fillStyle = '#ccc'; ctx.fillText(sub, sx, cy - h - 14*s + 15*z); } ctx.shadowBlur = 0;
  };

  // ---------------- "Thena's Murim" skin ----------------
  const baseBack = R.skinBack, baseFront = R.skinFront;
  R.skinBack = (ctx, g, acc, time, hair) => {
    if (acc.includes('murim')) { const s = g.sc, wv = Math.sin(time*2.6);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // long ponytail flowing behind
      ctx.strokeStyle = '#141018'; ctx.lineWidth = 3.2*s; ctx.beginPath(); ctx.moveTo(g.hx - g.headR*0.6, g.hy - g.headR*0.8);
      for (let i = 1; i <= 6; i++) ctx.lineTo(g.hx - g.headR*0.6 - i*3.2*s, g.hy - g.headR*0.6 + i*3.4*s + Math.sin(time*4 + i*0.8)*i*0.8*s); ctx.stroke();
      // sword with blue tassel across the back
      ctx.save(); ctx.translate(g.x - 2*s, (g.shY + g.hipY)/2); ctx.rotate(0.85); ctx.strokeStyle = '#2b3a55'; ctx.lineWidth = 3*s; ctx.beginPath(); ctx.moveTo(0, -17*s); ctx.lineTo(0, 15*s); ctx.stroke();
      ctx.strokeStyle = '#d8c070'; ctx.lineWidth = 2*s; ctx.beginPath(); ctx.moveTo(-3.5*s, -17*s); ctx.lineTo(3.5*s, -17*s); ctx.stroke(); ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2.2*s; ctx.beginPath(); ctx.moveTo(0, -18*s); ctx.lineTo(0, -25*s); ctx.stroke();
      ctx.strokeStyle = '#3a7bff'; ctx.lineWidth = 1.2*s; ctx.beginPath(); ctx.moveTo(0, -25*s); ctx.lineTo(-2*s + wv*2*s, -31*s); ctx.moveTo(0, -25*s); ctx.lineTo(1*s + wv*2*s, -32*s); ctx.stroke(); ctx.restore();
      // white murim robe with blue trim, flowing
      ctx.fillStyle = 'rgba(248,245,238,0.95)'; ctx.strokeStyle = '#2d5fd0'; ctx.lineWidth = 1.4*s;
      ctx.beginPath(); ctx.moveTo(g.x - 5*s, g.shY - 1*s); ctx.lineTo(g.x + 5*s, g.shY - 1*s); ctx.lineTo(g.x + 9*s + wv*1.5*s, g.hipY + 10*s); ctx.lineTo(g.x + 2*s, g.hipY + 12*s); ctx.lineTo(g.x - 3*s, g.hipY + 11*s);
      ctx.lineTo(g.x - 12*s - wv*2.5*s, g.hipY + 13*s); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#2d5fd0'; ctx.beginPath(); ctx.moveTo(g.x - 4*s, g.shY); ctx.lineTo(g.x + 3*s, g.shY + 8*s); ctx.stroke(); // collar crossing
      ctx.fillStyle = '#1f3f9a'; ctx.fillRect(g.x - 6*s, g.hipY - 2*s, 12*s, 3.2*s); // sash
      ctx.strokeStyle = '#1f3f9a'; ctx.lineWidth = 1.4*s; ctx.beginPath(); ctx.moveTo(g.x - 5*s, g.hipY); ctx.lineTo(g.x - 10*s - wv*2*s, g.hipY + 8*s); ctx.stroke(); // sash tail
      ctx.restore(); }
    baseBack(ctx, g, acc, time, hair);
  };
  R.skinFront = (ctx, g, acc, time, hair, eyeCol) => {
    baseFront(ctx, g, acc, time, hair, eyeCol);
    if (acc.includes('murim')) { const s = g.sc, r = g.headR, hx = g.hx, hy = g.hy; ctx.save();
      ctx.fillStyle = '#141018'; ctx.beginPath(); ctx.arc(hx, hy - r*0.1, r*1.05, Math.PI*1.02, Math.PI*1.98); ctx.fill(); // hair top
      ctx.beginPath(); ctx.moveTo(hx + r*0.95, hy - r*0.3); ctx.quadraticCurveTo(hx + r*1.25, hy + r*0.3, hx + r*0.95, hy + r*0.9); ctx.lineTo(hx + r*0.75, hy - r*0.1); ctx.fill(); // side lock
      ctx.beginPath(); ctx.ellipse(hx - r*0.2, hy - r*1.25, r*0.35, r*0.28, 0, 0, TAU); ctx.fill(); // topknot
      ctx.fillStyle = '#c9a24a'; ctx.fillRect(hx - r*0.45, hy - r*1.1, r*0.5, r*0.14); // hair pin
      ctx.strokeStyle = '#2d5fd0'; ctx.lineWidth = 1.6*s; ctx.beginPath(); ctx.moveTo(hx - r*0.9, hy - r*0.55); ctx.lineTo(hx + r*0.95, hy - r*0.55); ctx.stroke(); // headband
      ctx.beginPath(); ctx.moveTo(hx - r*0.9, hy - r*0.55); ctx.lineTo(hx - r*0.9 - 6*s, hy - r*0.2 + Math.sin(time*5)*2*s); ctx.moveTo(hx - r*0.9, hy - r*0.55); ctx.lineTo(hx - r*0.9 - 7*s, hy + Math.sin(time*5 + 1)*2*s); ctx.stroke();
      ctx.restore(); }
  };
})();
