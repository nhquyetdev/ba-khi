// GodK Bá Khí v1.3 — 8 more bosses + character skin accessories
'use strict';
(() => {
  const TAU = Math.PI*2, { rnd, eye } = R, X = R.extra;

  X.bonedragon = (ctx, S, time, v) => {
    const seg = 16, pts = [];
    for (let i = 0; i < seg; i++) { const k = i/(seg - 1); pts.push([S*(0.45 - k*0.95) + Math.sin(time*1.5 + k*5)*S*0.05, -S*(0.95 - k*0.75) + Math.sin(time*2 + k*7)*S*0.08*k]); }
    ctx.strokeStyle = '#d9cfb8'; ctx.lineCap = 'round';
    for (let i = seg - 1; i > 0; i--) { const [x, y] = pts[i], w = S*(0.05 - i*0.0022); ctx.lineWidth = w*0.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(...pts[i - 1]); ctx.stroke();
      ctx.lineWidth = Math.max(1, w*0.18); ctx.beginPath(); ctx.moveTo(x, y - w*1.6); ctx.lineTo(x, y + w*1.6); ctx.stroke(); } // ribs
    for (const k of [-1, 1]) { ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.moveTo(pts[3][0], pts[3][1]); ctx.lineTo(pts[3][0] - S*0.15, pts[3][1] + S*0.35 + k*S*0.05); ctx.lineTo(pts[3][0] - S*0.22, pts[3][1] + S*0.5); ctx.stroke(); } // claws
    const [hx, hy] = pts[0]; ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.2 + Math.sin(time)*0.1);
    ctx.fillStyle = '#e4dbc4'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.06); ctx.lineTo(-S*0.38, -S*0.02); ctx.lineTo(-S*0.36, S*0.03); ctx.lineTo(-S*0.06, S*0.06); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-S*0.08, S*0.05); ctx.lineTo(-S*0.33, S*(0.07 + (v.atk > 0 ? 0.1 : 0.02))); ctx.lineTo(-S*0.06, S*0.1); ctx.fill(); // jaw
    ctx.strokeStyle = '#e4dbc4'; ctx.lineWidth = S*0.015; ctx.beginPath(); ctx.moveTo(0, -S*0.05); ctx.quadraticCurveTo(S*0.12, -S*0.2, S*0.2, -S*0.15); ctx.moveTo(0, -S*0.03); ctx.quadraticCurveTo(S*0.1, -S*0.12, S*0.22, -S*0.05); ctx.stroke();
    ctx.fillStyle = '#ff6a00'; ctx.shadowColor = '#f60'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(-S*0.13, -S*0.02, S*0.014, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
  };
  X.wisps = (ctx, S, time, v) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const face = [[-0.1, -0.75], [0.1, -0.75], [-0.14, -0.55], [-0.07, -0.5], [0, -0.48], [0.07, -0.5], [0.14, -0.55]];
    for (let i = 0; i < 34; i++) { let x, y; if (i < face.length) { x = face[i][0]*S + Math.sin(time*2 + i)*S*0.01; y = face[i][1]*S + Math.cos(time*2 + i)*S*0.01; }
      else { const a = i*2.4 + time*0.4, r = S*(0.25 + (i%5)*0.04); x = Math.cos(a)*r; y = -S*0.65 + Math.sin(a)*r*1.1; }
      const r = S*(i < face.length ? 0.05 : 0.025)*(1 + Math.sin(time*5 + i)*0.2); const g = ctx.createRadialGradient(x, y, 0, x, y, r*2.5);
      g.addColorStop(0, `hsla(${v.hue + (i%3)*20},100%,80%,0.95)`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r*2.5, y - r*2.5, r*5, r*5); }
    ctx.restore();
  };
  X.lakebeast = (ctx, S, time, v) => {
    const rise = Math.sin(time*0.8)*S*0.04;
    ctx.fillStyle = `hsl(${v.hue},40%,8%)`; ctx.beginPath(); ctx.ellipse(0, -S*0.02, S*0.75, S*0.12, 0, 0, TAU); ctx.fill(); // water
    ctx.strokeStyle = 'rgba(120,200,210,0.35)'; ctx.lineWidth = 1.5; for (let i = 0; i < 4; i++) { const ph = (time*0.4 + i/4) % 1; ctx.beginPath(); ctx.ellipse(0, -S*0.02, S*(0.3 + ph*0.45), S*(0.05 + ph*0.07), 0, 0, TAU); ctx.globalAlpha = 1 - ph; ctx.stroke(); } ctx.globalAlpha = 1;
    for (let i = 0; i < 5; i++) { const k = i < 2 ? -1 : 1, bx = k*S*(0.35 + (i%2)*0.15); ctx.strokeStyle = `hsl(${v.hue},30%,18%)`; ctx.lineWidth = S*0.04; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(bx, -S*0.02); ctx.bezierCurveTo(bx, -S*0.4, bx + Math.sin(time + i)*S*0.2, -S*0.5, bx + Math.sin(time*1.3 + i)*S*0.15, -S*(0.6 + (i%3)*0.1)); ctx.stroke(); }
    ctx.fillStyle = `hsl(${v.hue},30%,14%)`; ctx.beginPath(); ctx.moveTo(-S*0.32, -S*0.02); ctx.quadraticCurveTo(-S*0.35, -S*0.8 - rise, 0, -S*0.85 - rise); ctx.quadraticCurveTo(S*0.35, -S*0.8 - rise, S*0.32, -S*0.02); ctx.fill();
    const [tx, ty] = v.target || [-500, -100];
    for (let i = 0; i < 7; i++) eye(ctx, Math.sin(i*1.9)*S*0.16, -S*(0.45 + (i%4)*0.08) - rise, S*(0.025 + (i%3)*0.01), time + i, tx, ty, '#0a5');
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, -S*0.22 - rise, S*0.16, S*(0.04 + (v.atk > 0 ? 0.06 : 0)), 0, 0, TAU); ctx.fill();
  };
  X.samurai = (ctx, S, time, v) => {
    const st = Math.sin(time*1.2)*0.03;
    ctx.fillStyle = '#5a0f10'; ctx.fillRect(-S*0.14, -S*0.8, S*0.28, S*0.4); // chest armor
    ctx.strokeStyle = '#2a0506'; ctx.lineWidth = 1.5; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-S*0.14, -S*0.78 + i*S*0.065); ctx.lineTo(S*0.14, -S*0.78 + i*S*0.065); ctx.stroke(); }
    ctx.fillStyle = '#3a0a0b'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.14, -S*0.8); ctx.lineTo(k*S*0.3, -S*0.75); ctx.lineTo(k*S*0.26, -S*0.6); ctx.lineTo(k*S*0.13, -S*0.65); ctx.fill(); } // shoulder plates
    ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.moveTo(-S*0.15, -S*0.4); ctx.lineTo(S*0.15, -S*0.4); ctx.lineTo(S*0.22, -S*0.12); ctx.lineTo(-S*0.22, -S*0.12); ctx.fill(); // skirt
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = S*0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.14); ctx.lineTo(-S*0.12, 0); ctx.moveTo(S*0.08, -S*0.14); ctx.lineTo(S*0.12, 0); ctx.stroke();
    ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(0, -S*0.81, S*0.06, S*0.02, 0, 0, TAU); ctx.fill(); // no head
    ctx.fillStyle = 'rgba(80,0,0,0.6)'; for (let i = 0; i < 6; i++) { const ph = (time + i*0.3) % 1.5; ctx.beginPath(); ctx.arc(Math.sin(i*3)*S*0.03, -S*0.82 - ph*S*0.15, S*0.008*(1.5 - ph), 0, TAU); ctx.fill(); } // smoke
    ctx.save(); ctx.translate(-S*0.22, -S*0.5); ctx.rotate(-1.1 + st + (v.atk > 0 ? -0.9 : 0)); // katana
    ctx.strokeStyle = '#ddd'; ctx.lineWidth = S*0.018; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.6); ctx.stroke(); ctx.strokeStyle = '#7a5a10'; ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.moveTo(0, S*0.05); ctx.lineTo(0, S*0.18); ctx.stroke();
    ctx.restore(); ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = S*0.035; ctx.beginPath(); ctx.moveTo(-S*0.2, -S*0.66); ctx.lineTo(-S*0.22, -S*0.5); ctx.moveTo(S*0.2, -S*0.66); ctx.lineTo(S*0.18, -S*0.45); ctx.stroke();
  };
  X.reaper = (ctx, S, time, v) => {
    const fl = Math.sin(time*1.4)*S*0.03;
    ctx.save(); ctx.translate(0, -fl);
    ctx.fillStyle = '#08070a'; ctx.beginPath(); ctx.moveTo(0, -S*1.05); ctx.quadraticCurveTo(-S*0.2, -S*1.0, -S*0.22, -S*0.6);
    for (let i = 0; i <= 8; i++) ctx.lineTo(-S*0.3 + i*S*0.075, -S*0.05 + (i%2 ? -S*0.06 : 0) + Math.sin(time*3 + i)*S*0.02); ctx.lineTo(S*0.22, -S*0.6); ctx.quadraticCurveTo(S*0.2, -S*1.0, 0, -S*1.05); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, -S*0.86, S*0.09, S*0.11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d8d0c2'; ctx.beginPath(); ctx.ellipse(0, -S*0.85, S*0.06, S*0.075, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-S*0.022, -S*0.87, S*0.016, S*0.02, 0, 0, TAU); ctx.ellipse(S*0.022, -S*0.87, S*0.016, S*0.02, 0, 0, TAU); ctx.fill(); ctx.fillRect(-S*0.02, -S*0.81, S*0.04, S*0.01);
    ctx.fillStyle = `hsl(${v.hue},100%,70%)`; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(-S*0.022, -S*0.87, S*0.005, 0, TAU); ctx.arc(S*0.022, -S*0.87, S*0.005, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    const sw = v.atk > 0 ? -1.2 : Math.sin(time*0.8)*0.1; ctx.save(); ctx.translate(-S*0.2, -S*0.55); ctx.rotate(sw);
    ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = S*0.018; ctx.beginPath(); ctx.moveTo(0, S*0.45); ctx.lineTo(0, -S*0.55); ctx.stroke();
    ctx.fillStyle = '#c8ccd4'; ctx.beginPath(); ctx.moveTo(0, -S*0.55); ctx.quadraticCurveTo(-S*0.35, -S*0.6, -S*0.5, -S*0.35); ctx.quadraticCurveTo(-S*0.3, -S*0.5, 0, -S*0.48); ctx.fill(); ctx.restore();
    ctx.restore();
  };
  X.tvhead = (ctx, S, time, v) => {
    ctx.fillStyle = '#16161a'; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.72); ctx.lineTo(S*0.1, -S*0.72); ctx.lineTo(S*0.14, -S*0.3); ctx.lineTo(-S*0.14, -S*0.3); ctx.fill(); // suit
    ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.moveTo(-S*0.03, -S*0.72); ctx.lineTo(0, -S*0.6); ctx.lineTo(S*0.03, -S*0.72); ctx.fill(); ctx.fillStyle = '#900'; ctx.fillRect(-S*0.008, -S*0.68, S*0.016, S*0.12);
    ctx.strokeStyle = '#16161a'; ctx.lineWidth = S*0.035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.3); ctx.lineTo(-S*0.09, 0); ctx.moveTo(S*0.08, -S*0.3); ctx.lineTo(S*0.09, 0);
    ctx.moveTo(-S*0.1, -S*0.68); ctx.lineTo(-S*0.18, -S*0.4); ctx.moveTo(S*0.1, -S*0.68); ctx.lineTo(S*0.2 + (v.atk > 0 ? S*0.15 : 0), -S*0.45); ctx.stroke();
    ctx.fillStyle = '#4a4036'; ctx.fillRect(-S*0.17, -S*1.0, S*0.34, S*0.28); // TV
    ctx.strokeStyle = '#222'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-S*0.05, -S*1.0); ctx.lineTo(-S*0.12, -S*1.12); ctx.moveTo(S*0.05, -S*1.0); ctx.lineTo(S*0.12, -S*1.1); ctx.stroke();
    const sx = -S*0.14, sy = -S*0.97, sw = S*0.24, sh = S*0.22;
    for (let i = 0; i < 70; i++) { const g = Math.random()*255|0; ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(sx + Math.random()*sw, sy + Math.random()*sh, S*0.012, S*0.006); }
    if (Math.sin(time*0.9) > 0.3) { ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.beginPath(); ctx.arc(sx + sw*0.35, sy + sh*0.4, S*0.02, 0, TAU); ctx.arc(sx + sw*0.65, sy + sh*0.4, S*0.02, 0, TAU); ctx.fill();
      ctx.fillRect(sx + sw*0.3, sy + sh*0.7, sw*0.4, S*0.01); }
    ctx.fillStyle = '#7f7'; ctx.fillRect(S*0.14, -S*0.8, S*0.012, S*0.012);
  };
  X.golem = (ctx, S, time, v) => {
    const blk = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - w/2 + w*0.08, y - h/2); ctx.lineTo(x + w/2, y - h/2 + h*0.06); ctx.lineTo(x + w/2 - w*0.05, y + h/2); ctx.lineTo(x - w/2, y + h/2 - h*0.05); ctx.fill(); };
    const br = Math.sin(time*1.1)*S*0.01;
    blk(-S*0.12, -S*0.12, S*0.14, S*0.24, '#3b3530'); blk(S*0.12, -S*0.12, S*0.14, S*0.24, '#3b3530');
    blk(0, -S*0.5 + br, S*0.5, S*0.42, '#4a433c'); blk(0, -S*0.8 + br, S*0.2, S*0.18, '#544b43');
    for (const k of [-1, 1]) { blk(k*S*0.35, -S*0.55 + br, S*0.16, S*0.2, '#3f3933'); blk(k*S*(0.38 + (v.atk > 0 && k < 0 ? 0.15 : 0)), -S*0.3 + br, S*0.18, S*0.22, '#3b3530'); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = 0.6 + Math.sin(time*3)*0.3; ctx.strokeStyle = `hsla(${v.hue},100%,60%,${gl})`; ctx.lineWidth = 2; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(-S*0.15, -S*0.6 + br); ctx.lineTo(-S*0.05, -S*0.45 + br); ctx.lineTo(S*0.08, -S*0.62 + br); ctx.lineTo(S*0.15, -S*0.4 + br); ctx.moveTo(0, -S*0.65 + br); ctx.lineTo(0, -S*0.35 + br); ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle; ctx.fillRect(-S*0.06, -S*0.83 + br, S*0.035, S*0.02); ctx.fillRect(S*0.025, -S*0.83 + br, S*0.035, S*0.02); ctx.restore();
  };
  X.oni = (ctx, S, time, v) => {
    ctx.fillStyle = '#8a1410'; ctx.beginPath(); ctx.moveTo(-S*0.2, -S*0.78); ctx.lineTo(S*0.2, -S*0.78); ctx.lineTo(S*0.24, -S*0.35); ctx.lineTo(-S*0.24, -S*0.35); ctx.fill();
    ctx.fillStyle = '#d8b02a'; ctx.fillRect(-S*0.25, -S*0.4, S*0.5, S*0.06); ctx.fillStyle = '#222'; for (let i = 0; i < 6; i++) ctx.fillRect(-S*0.25 + i*S*0.09, -S*0.4, S*0.04, S*0.06); // tiger loincloth
    ctx.strokeStyle = '#8a1410'; ctx.lineWidth = S*0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.12, -S*0.35); ctx.lineTo(-S*0.15, 0); ctx.moveTo(S*0.12, -S*0.35); ctx.lineTo(S*0.15, 0); ctx.moveTo(S*0.2, -S*0.72); ctx.lineTo(S*0.32, -S*0.45); ctx.stroke();
    ctx.save(); ctx.translate(-S*0.24, -S*0.7); ctx.rotate(-0.4 + (v.atk > 0 ? -0.9 : Math.sin(time)*0.1)); ctx.lineWidth = S*0.06; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, S*0.25); ctx.stroke();
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-S*0.035, -S*0.5, S*0.07, S*0.5); ctx.fillStyle = '#bbb'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(S*0.035, -S*0.45 + i*S*0.09, S*0.014, 0, TAU); ctx.arc(-S*0.035, -S*0.45 + i*S*0.09, S*0.014, 0, TAU); ctx.fill(); } ctx.restore(); // kanabo club
    ctx.fillStyle = '#b01a14'; ctx.beginPath(); ctx.ellipse(0, -S*0.9, S*0.13, S*0.14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#efe6c8'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.07, -S*1.0); ctx.quadraticCurveTo(k*S*0.13, -S*1.15, k*S*0.06, -S*1.22); ctx.lineTo(k*S*0.03, -S*1.02); ctx.fill(); }
    ctx.fillStyle = '#ffe14a'; ctx.beginPath(); ctx.ellipse(-S*0.05, -S*0.93, S*0.03, S*0.02, 0.3, 0, TAU); ctx.ellipse(S*0.05, -S*0.93, S*0.03, S*0.02, -0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.05, -S*0.93, S*0.008, 0, TAU); ctx.arc(S*0.05, -S*0.93, S*0.008, 0, TAU); ctx.fill();
    ctx.fillStyle = '#300'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.84); ctx.quadraticCurveTo(0, -S*(0.78 - (v.atk > 0 ? 0.04 : 0)), S*0.08, -S*0.84); ctx.fill();
    ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.06, -S*0.84); ctx.lineTo(k*S*0.05, -S*0.89); ctx.lineTo(k*S*0.04, -S*0.84); ctx.fill(); }
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(0, -S*1.0, S*0.11, Math.PI, TAU); ctx.fill();
  };

  // ---------------- Character skin accessories ----------------
  // geo: x, fy, hipY, neckY, shY, H, sc, headR, hx, hy (drawn in facing-right space: "behind" = -x)
  R.skinBack = (ctx, g, acc, time, hair) => {
    const s = g.sc; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (acc.includes('cape')) { const wv = Math.sin(time*3)*4*s; ctx.fillStyle = '#9a1020'; ctx.strokeStyle = '#e0b040'; ctx.lineWidth = 1.5*s;
      ctx.beginPath(); ctx.moveTo(g.x - 5*s, g.shY); ctx.lineTo(g.x + 4*s, g.shY); ctx.quadraticCurveTo(g.x - 4*s, g.hipY, g.x - 10*s + wv, g.fy - 3*s); ctx.lineTo(g.x - 26*s + wv*1.5, g.fy - 6*s); ctx.quadraticCurveTo(g.x - 18*s, g.hipY - 6*s, g.x - 5*s, g.shY); ctx.fill(); ctx.stroke(); }
    if (acc.includes('wings')) { ctx.strokeStyle = 'rgba(255,250,225,0.85)'; ctx.lineWidth = 1.6*s; const fl = Math.sin(time*2.5)*0.15;
      for (let i = 0; i < 5; i++) { const a = -2.2 - i*0.18 + fl; ctx.beginPath(); ctx.moveTo(g.x - 2*s, g.shY + 3*s); ctx.quadraticCurveTo(g.x - 14*s, g.shY - 10*s + i*3*s, g.x + Math.cos(a)*(26 - i*2)*s, g.shY + Math.sin(a)*(18 - i*2)*s + i*5*s); ctx.stroke(); } }
    if (acc.includes('sword')) { ctx.save(); ctx.translate(g.x - 3*s, (g.shY + g.hipY)/2); ctx.rotate(-0.75); ctx.strokeStyle = '#222'; ctx.lineWidth = 3*s; ctx.beginPath(); ctx.moveTo(0, -16*s); ctx.lineTo(0, 16*s); ctx.stroke();
      ctx.strokeStyle = '#c9a24a'; ctx.lineWidth = 2*s; ctx.beginPath(); ctx.moveTo(-3*s, -16*s); ctx.lineTo(3*s, -16*s); ctx.stroke(); ctx.strokeStyle = '#8a1a1a'; ctx.lineWidth = 2.4*s; ctx.beginPath(); ctx.moveTo(0, -17*s); ctx.lineTo(0, -24*s); ctx.stroke(); ctx.restore(); }
    if (acc.includes('scarf')) { ctx.strokeStyle = '#d21f2a'; ctx.lineWidth = 3*s; ctx.beginPath(); ctx.moveTo(g.x - 2*s, g.neckY + 2*s);
      for (let i = 1; i <= 6; i++) ctx.lineTo(g.x - 2*s - i*4.5*s, g.neckY + 2*s + i*1.5*s + Math.sin(time*6 + i*0.9)*i*0.7*s); ctx.stroke(); }
    if (acc.includes('headband')) { ctx.strokeStyle = '#c8102e'; ctx.lineWidth = 1.8*s; for (const o of [0, 3]) { ctx.beginPath(); ctx.moveTo(g.hx - g.headR*0.8, g.hy - g.headR*0.35);
      for (let i = 1; i <= 4; i++) ctx.lineTo(g.hx - g.headR*0.8 - i*3.5*s, g.hy - g.headR*0.35 + o*s*0.5 + Math.sin(time*7 + i + o)*i*0.6*s); ctx.stroke(); } }
    ctx.restore();
  };
  R.skinFront = (ctx, g, acc, time, hair, eyeCol) => {
    const s = g.sc, r = g.headR, hx = g.hx, hy = g.hy; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (acc.includes('spiky')) { ctx.fillStyle = hair; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1.2*s; ctx.beginPath(); ctx.moveTo(hx - r*1.05, hy - r*0.1);
      const sp = [[-1.5, -1.3], [-0.8, -0.95], [-0.7, -2.1], [-0.2, -1.1], [0.3, -2.3], [0.5, -1.0], [1.3, -1.8], [1.0, -0.6], [1.5, -0.6]];
      sp.forEach(([a, b]) => ctx.lineTo(hx + a*r, hy + b*r + Math.sin(time*8 + a)*0.6*s)); ctx.lineTo(hx + r*1.05, hy - r*0.1); ctx.quadraticCurveTo(hx, hy - r*1.4, hx - r*1.05, hy - r*0.1); ctx.fill(); ctx.stroke(); }
    if (acc.includes('headband')) { ctx.fillStyle = '#c8102e'; ctx.fillRect(hx - r*1.02, hy - r*0.5, r*2.04, r*0.32); }
    if (acc.includes('nonla')) { ctx.fillStyle = '#e2cc86'; ctx.strokeStyle = '#8a7238'; ctx.lineWidth = 1*s; ctx.beginPath(); ctx.moveTo(hx - r*2.3, hy - r*0.45); ctx.lineTo(hx, hy - r*2.4); ctx.lineTo(hx + r*2.3, hy - r*0.45); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); for (let i = 1; i < 4; i++) { const k = i/4; ctx.moveTo(hx - r*2.3*k, hy - r*(2.4 - 1.95*k)); ctx.lineTo(hx + r*2.3*k, hy - r*(2.4 - 1.95*k)); } ctx.stroke();
      ctx.strokeStyle = '#6a5428'; ctx.beginPath(); ctx.moveTo(hx - r*0.8, hy - r*0.4); ctx.quadraticCurveTo(hx, hy + r*1.4, hx + r*0.8, hy - r*0.4); ctx.stroke(); }
    if (acc.includes('crown')) { ctx.fillStyle = '#ffcf3a'; ctx.strokeStyle = '#8a6a00'; ctx.lineWidth = 1*s; ctx.beginPath(); ctx.moveTo(hx - r*0.9, hy - r*0.75);
      [[-0.9, -1.8], [-0.45, -1.1], [0, -2.0], [0.45, -1.1], [0.9, -1.8], [0.9, -0.75]].forEach(([a, b]) => ctx.lineTo(hx + a*r, hy + b*r)); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e0204a'; ctx.beginPath(); ctx.arc(hx, hy - r*1.05, r*0.15, 0, TAU); ctx.fill(); }
    if (acc.includes('horns')) { ctx.fillStyle = '#2a0a0a'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + k*r*0.45, hy - r*0.75); ctx.quadraticCurveTo(hx + k*r*1.4, hy - r*1.3, hx + k*r*1.1, hy - r*2.1); ctx.quadraticCurveTo(hx + k*r*0.9, hy - r*1.2, hx + k*r*0.1, hy - r*0.95); ctx.fill(); } }
    if (acc.includes('halo')) { ctx.strokeStyle = '#ffe58a'; ctx.lineWidth = 2*s; ctx.shadowColor = '#ffd84a'; ctx.shadowBlur = 10*s; ctx.beginPath(); ctx.ellipse(hx, hy - r*1.9, r*0.95, r*0.3, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    if (acc.includes('shades')) { ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(hx - r*0.1, hy - r*0.32, r*0.95, r*0.42, r*0.15) : ctx.rect(hx - r*0.1, hy - r*0.32, r*0.95, r*0.42); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(hx + r*0.12, hy - r*0.22, r*0.25, r*0.07); ctx.strokeStyle = '#050505'; ctx.lineWidth = 1.2*s; ctx.beginPath(); ctx.moveTo(hx - r*0.1, hy - r*0.15); ctx.lineTo(hx - r*0.95, hy - r*0.25); ctx.stroke(); }
    if (acc.includes('ninja')) { ctx.fillStyle = '#1b1f28'; ctx.beginPath(); ctx.arc(hx, hy, r*1.02, -0.05*Math.PI, 1.05*Math.PI); ctx.fill(); ctx.fillRect(hx - r*1.02, hy - r*0.75, r*2.04, r*0.3);
      ctx.fillStyle = '#9aa3b5'; ctx.fillRect(hx - r*0.35, hy - r*0.74, r*0.7, r*0.28); if (eyeCol) { ctx.fillStyle = eyeCol; ctx.fillRect(hx + r*0.05, hy - r*0.32, r*0.5, r*0.14); } }
    if (acc.includes('fox')) { ctx.fillStyle = '#f6f1e8'; ctx.beginPath(); ctx.moveTo(hx - r*0.9, hy - r*0.4); ctx.lineTo(hx - r*0.75, hy - r*1.5); ctx.lineTo(hx - r*0.2, hy - r*0.9); ctx.lineTo(hx + r*0.3, hy - r*0.9); ctx.lineTo(hx + r*0.75, hy - r*1.5);
      ctx.lineTo(hx + r*0.95, hy - r*0.3); ctx.lineTo(hx + r*1.25, hy + r*0.3); ctx.lineTo(hx, hy + r*0.95); ctx.lineTo(hx - r*0.9, hy + r*0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#c8102e'; ctx.beginPath(); ctx.moveTo(hx - r*0.3, hy - r*0.25); ctx.lineTo(hx + r*0.05, hy - r*0.05); ctx.lineTo(hx - r*0.3, hy - r*0.05); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx + r*0.45, hy - r*0.25); ctx.lineTo(hx + r*0.8, hy - r*0.05); ctx.lineTo(hx + r*0.45, hy - r*0.05); ctx.fill();
      ctx.fillRect(hx - r*0.06, hy - r*0.85, r*0.12, r*0.35); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(hx + r*1.1, hy + r*0.25, r*0.08, 0, TAU); ctx.fill(); }
    if (acc.includes('starbody')) { ctx.fillStyle = '#fff'; for (let i = 0; i < 6; i++) { const tw = 0.5 + Math.sin(time*4 + i*1.7)*0.5; ctx.globalAlpha = tw; const yy = g.neckY + (g.hipY - g.neckY)*(i/5); ctx.fillRect(g.x - 1*s + Math.sin(i*2)*1.5*s, yy, 1.6*s, 1.6*s); } ctx.globalAlpha = 1; }
    ctx.restore();
  };
})();
