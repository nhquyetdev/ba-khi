// GodK Bá Khí v1.2 — folklore bosses + exclusive bosses of the Realm of the Unlimited
'use strict';
(() => {
  const TAU = Math.PI*2, { rnd, eye } = R, X = R.extra;

  X.jiangshi = (ctx, S, time, v) => {
    const hop = Math.abs(Math.sin(time*2.6))*S*0.12;
    ctx.save(); ctx.translate(0, -hop);
    ctx.fillStyle = '#16301f'; ctx.beginPath(); ctx.moveTo(-S*0.13, -S*0.78); ctx.lineTo(S*0.13, -S*0.78); ctx.lineTo(S*0.17, -S*0.02); ctx.lineTo(-S*0.17, -S*0.02); ctx.fill(); // robe
    ctx.fillStyle = '#c49a2a'; ctx.fillRect(-S*0.17, -S*0.32, S*0.34, S*0.03); ctx.fillRect(-S*0.02, -S*0.78, S*0.04, S*0.76);
    ctx.fillStyle = '#9fb59a'; for (const k of [-1, 1]) { ctx.fillRect(k > 0 ? S*0.0 : -S*0.36, -S*0.7, S*0.36, S*0.06); ctx.fillStyle = '#16301f'; ctx.fillRect(k > 0 ? S*0.0 : -S*0.36, -S*0.71, S*0.2, S*0.08); ctx.fillStyle = '#9fb59a'; } // arms straight out
    ctx.fillStyle = '#b9c8b2'; ctx.beginPath(); ctx.ellipse(0, -S*0.88, S*0.085, S*0.1, 0, 0, TAU); ctx.fill(); // face
    ctx.fillStyle = '#111'; ctx.fillRect(-S*0.12, -S*1.0, S*0.24, S*0.05); ctx.beginPath(); ctx.ellipse(0, -S*1.0, S*0.09, S*0.05, 0, Math.PI, TAU); ctx.fill(); // qing hat
    ctx.fillStyle = '#d33'; ctx.beginPath(); ctx.arc(0, -S*1.07, S*0.015, 0, TAU); ctx.fill();
    const flap = Math.sin(time*7)*0.12; ctx.save(); ctx.translate(0, -S*0.97); ctx.rotate(flap); // talisman
    ctx.fillStyle = '#f3d54a'; ctx.fillRect(-S*0.04, 0, S*0.08, S*0.2); ctx.strokeStyle = '#b00'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i < 5; i++) { ctx.moveTo(-S*0.025, S*0.03 + i*S*0.035); ctx.lineTo(S*0.025, S*0.045 + i*S*0.035); } ctx.moveTo(0, S*0.02); ctx.lineTo(0, S*0.18); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#e8ffe0'; ctx.shadowColor = '#8f8'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(-S*0.05, -S*0.75, S*0.006, 0, TAU); ctx.arc(S*0.05, -S*0.75, S*0.006, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 0, S*0.18*(1 - hop/S), S*0.04, 0, 0, TAU); ctx.fill();
  };
  X.malai = (ctx, S, time, v) => {
    const fy = -S*0.8 + Math.sin(time*1.3)*S*0.06, fx = Math.sin(time*0.7)*S*0.06;
    // glowing dangling strands
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) { ctx.strokeStyle = `hsla(${(v.hue + i*8)%360},90%,55%,0.55)`; ctx.lineWidth = S*0.008 + (i%3)*1; ctx.beginPath(); ctx.moveTo(fx + (i - 4)*S*0.012, fy + S*0.1);
      ctx.bezierCurveTo(fx + (i - 4)*S*0.03 + Math.sin(time*2 + i)*S*0.05, fy + S*0.35, fx + (i - 4)*S*0.04 + Math.cos(time*1.6 + i)*S*0.08, fy + S*0.55, fx + (i - 4)*S*0.05 + Math.sin(time + i)*S*0.1, fy + S*0.78); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = '#060406'; ctx.beginPath(); ctx.moveTo(fx - S*0.12, fy - S*0.05); ctx.quadraticCurveTo(fx - S*0.25, fy + S*0.35, fx - S*0.18 + Math.sin(time)*S*0.03, fy + S*0.5);
    ctx.lineTo(fx + S*0.18 + Math.sin(time + 1)*S*0.03, fy + S*0.5); ctx.quadraticCurveTo(fx + S*0.25, fy + S*0.35, fx + S*0.12, fy - S*0.05); ctx.fill(); // hair
    ctx.fillStyle = '#d8d2c4'; ctx.beginPath(); ctx.ellipse(fx, fy, S*0.1, S*0.13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#060406'; ctx.beginPath(); ctx.arc(fx, fy - S*0.06, S*0.115, Math.PI*1.05, Math.PI*1.95); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(fx - S*0.04, fy - S*0.01, S*0.022, S*0.03, 0, 0, TAU); ctx.ellipse(fx + S*0.04, fy - S*0.01, S*0.022, S*0.03, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#f33'; ctx.beginPath(); ctx.arc(fx - S*0.04, fy - S*0.01, S*0.006, 0, TAU); ctx.arc(fx + S*0.04, fy - S*0.01, S*0.006, 0, TAU); ctx.fill();
    ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(fx, fy + S*0.07, S*0.03, S*0.02 + (v.atk > 0 ? S*0.03 : 0), 0, 0, TAU); ctx.fill();
  };
  X.ongke = (ctx, S, time, v) => {
    const sway = Math.sin(time*0.9)*0.05;
    ctx.save(); ctx.rotate(sway*0.3);
    ctx.fillStyle = '#17120e'; ctx.beginPath(); ctx.moveTo(-S*0.18, 0); ctx.lineTo(-S*0.22, -S*0.7); ctx.quadraticCurveTo(-S*0.05, -S*1.05, S*0.2, -S*0.88); ctx.lineTo(S*0.18, 0); ctx.fill(); // hunched coat
    ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.moveTo(S*0.04, -S*1.0); ctx.lineTo(S*0.36, -S*0.98); ctx.lineTo(S*0.2, -S*1.18); ctx.fill(); // hat
    ctx.fillStyle = '#c9b89a'; ctx.beginPath(); ctx.ellipse(S*0.2, -S*0.9, S*0.06, S*0.07, 0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(S*0.18, -S*0.91, S*0.012, 0, TAU); ctx.arc(S*0.23, -S*0.89, S*0.012, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(S*0.16, -S*0.86); ctx.quadraticCurveTo(S*0.21, -S*0.82, S*0.26, -S*0.86); ctx.stroke();
    ctx.restore();
    // sack with eyes
    const sx = -S*0.32, sy = -S*0.38 + Math.sin(time*1.8)*S*0.01; const wob = Math.sin(time*6)*S*0.015;
    ctx.strokeStyle = '#17120e'; ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.moveTo(-S*0.16, -S*0.72); ctx.lineTo(sx + S*0.05, sy - S*0.22); ctx.stroke();
    ctx.fillStyle = '#6b5636'; ctx.beginPath(); ctx.moveTo(sx - S*0.02, sy - S*0.22); ctx.quadraticCurveTo(sx - S*0.25 + wob, sy, sx - S*0.15, sy + S*0.3); ctx.lineTo(sx + S*0.2, sy + S*0.3); ctx.quadraticCurveTo(sx + S*0.25 - wob, sy, sx + S*0.08, sy - S*0.22); ctx.fill();
    for (let i = 0; i < 5; i++) eye(ctx, sx + Math.sin(i*2.1)*S*0.1, sy + Math.cos(i*1.7)*S*0.12 + S*0.05, S*0.022, time + i, v.target ? v.target[0] : -400, -100, '#600');
  };
  X.nun = (ctx, S, time, v) => {
    ctx.fillStyle = '#0c0c10'; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.82); ctx.lineTo(S*0.06, -S*0.82); ctx.lineTo(S*0.26, 0); ctx.lineTo(-S*0.26, 0); ctx.fill();
    ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.72); ctx.lineTo(S*0.1, -S*0.72); ctx.lineTo(S*0.05, -S*0.6); ctx.lineTo(-S*0.05, -S*0.6); ctx.fill(); // collar
    ctx.fillStyle = '#0c0c10'; ctx.beginPath(); ctx.ellipse(0, -S*0.86, S*0.12, S*0.14, 0, 0, TAU); ctx.fill(); // veil
    ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.ellipse(0, -S*0.85, S*0.075, S*0.095, 0, 0, TAU); ctx.fill(); // featureless face
    if (v.atk > 0 || Math.sin(time*0.8) > 0.96) { ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, -S*0.82, S*0.03, S*0.05, 0, 0, TAU); ctx.fill(); } // mouth opens
    ctx.strokeStyle = '#d6cfc2'; ctx.lineWidth = S*0.018; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.6); ctx.lineTo(0, -S*0.48); ctx.lineTo(S*0.08, -S*0.6); ctx.stroke(); // praying hands
    ctx.fillStyle = '#c9a24a'; ctx.fillRect(-S*0.006, -S*0.5, S*0.012, S*0.1); ctx.fillRect(-S*0.03, -S*0.47, S*0.06, S*0.012); // cross-like charm
    for (let i = 0; i < 7; i++) { const a = -Math.PI*0.95 + i/6*Math.PI*0.9, cx = Math.cos(a)*S*0.5, cy = -S*0.15 + Math.sin(a)*S*0.2 + S*0.12; // candles
      ctx.fillStyle = '#e8e0cc'; ctx.fillRect(cx - S*0.012, cy - S*0.06, S*0.024, S*0.06);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const f = 1 + Math.sin(time*11 + i)*0.2; const g = ctx.createRadialGradient(cx, cy - S*0.08, 0, cx, cy - S*0.08, S*0.06*f);
      g.addColorStop(0, 'rgba(255,200,90,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(cx - S*0.08, cy - S*0.16, S*0.16, S*0.16); ctx.restore(); }
  };
  X.hound = (ctx, S, time, v) => {
    const br = Math.sin(time*3)*S*0.01, lunge = v.atk > 0 ? -S*0.1 : 0;
    ctx.save(); ctx.translate(lunge, 0);
    ctx.fillStyle = '#07060a'; ctx.beginPath(); ctx.moveTo(-S*0.45, -S*0.42); // body
    for (let i = 0; i <= 12; i++) { const x = -S*0.45 + i*S*0.075; ctx.lineTo(x, -S*0.5 - br - (i%2 ? S*0.04 : 0) - Math.sin(i*0.4)*S*0.05); }
    ctx.lineTo(S*0.45, -S*0.3); ctx.lineTo(S*0.35, -S*0.2); ctx.lineTo(-S*0.4, -S*0.22); ctx.fill();
    ctx.strokeStyle = '#07060a'; ctx.lineWidth = S*0.035; ctx.lineCap = 'round'; const st = Math.sin(time*4)*S*0.02;
    for (const [x, d] of [[-0.35, 1], [-0.22, -1], [0.22, 1], [0.34, -1]]) { ctx.beginPath(); ctx.moveTo(x*S, -S*0.25); ctx.lineTo(x*S + st*d, -S*0.1); ctx.lineTo(x*S - S*0.02, 0); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(S*0.42, -S*0.42); ctx.quadraticCurveTo(S*0.6, -S*0.62, S*0.55 + Math.sin(time*5)*S*0.03, -S*0.75); ctx.lineWidth = S*0.02; ctx.stroke(); // tail
    ctx.fillStyle = '#07060a'; ctx.beginPath(); ctx.moveTo(-S*0.42, -S*0.5); ctx.lineTo(-S*0.72, -S*0.4); ctx.lineTo(-S*0.7, -S*0.3); ctx.lineTo(-S*0.42, -S*0.28); ctx.fill(); // snout
    ctx.beginPath(); ctx.moveTo(-S*0.45, -S*0.5); ctx.lineTo(-S*0.42, -S*0.66); ctx.lineTo(-S*0.36, -S*0.52); ctx.fill(); ctx.beginPath(); ctx.moveTo(-S*0.38, -S*0.5); ctx.lineTo(-S*0.33, -S*0.64); ctx.lineTo(-S*0.29, -S*0.5); ctx.fill();
    ctx.fillStyle = '#eee'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-S*0.7 + i*S*0.045, -S*0.33); ctx.lineTo(-S*0.68 + i*S*0.045, -S*0.29); ctx.lineTo(-S*0.66 + i*S*0.045, -S*0.33); ctx.fill(); }
    ctx.fillStyle = '#ff2a2a'; ctx.shadowColor = '#f00'; ctx.shadowBlur = 10;
    for (let i = 0; i < 7; i++) { const ex = -S*0.58 + (i%4)*S*0.07 + (i > 3 ? S*0.03 : 0), ey = -S*0.44 + (i > 3 ? S*0.05 : 0); ctx.beginPath(); ctx.arc(ex, ey, S*(0.008 + (i%2)*0.004), 0, TAU); ctx.fill(); }
    ctx.shadowBlur = 0; ctx.restore();
  };
  X.mirror = (ctx, S, time, v) => {
    const cx = 0, cy = -S*0.62, w = S*0.36, h = S*0.58;
    ctx.fillStyle = '#4a3a1a'; ctx.beginPath(); ctx.ellipse(cx, cy, w + S*0.04, h + S*0.04, 0, 0, TAU); ctx.fill();
    const g = ctx.createLinearGradient(cx - w, cy - h, cx + w, cy + h); g.addColorStop(0, '#9fb6c4'); g.addColorStop(0.5, '#38474f'); g.addColorStop(1, '#8aa0ad');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, w, h, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, w, h, 0, 0, TAU); ctx.clip();
    // reflected "you" — offset in each shard
    const P = R.pose(0, time - 0.4, false, 0, 1);
    const shards = [[-0.3, -0.5, 0.06], [0.2, -0.2, -0.08], [-0.1, 0.3, 0.12], [0.25, 0.45, -0.04]];
    shards.forEach(([ox, oy, rot], i) => { ctx.save(); ctx.translate(cx + ox*w*0.2, cy + h*0.6 + oy*S*0.05); ctx.rotate(rot); R.stickman(ctx, 0, 0, S/80, P, { color: 'rgba(20,20,25,0.7)', headFill: '#111', eyes: i === 1 ? '#f22' : null, smile: i === 2, outline: false }); ctx.restore(); });
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.5; ctx.beginPath(); const ix = cx + S*0.04, iy = cy - S*0.06;
    for (let i = 0; i < 9; i++) { const a = i/9*TAU + 0.2; let px = ix, py = iy; ctx.moveTo(px, py); for (let j = 1; j <= 3; j++) { px = ix + Math.cos(a + (R.hash(i, j) - 0.5)*0.5)*j*S*0.13; py = iy + Math.sin(a + (R.hash(i, j) - 0.5)*0.5)*j*S*0.18; ctx.lineTo(px, py); } }
    ctx.stroke(); ctx.restore();
    if (v.atk > 0) { ctx.fillStyle = 'rgba(200,230,255,0.8)'; for (let i = 0; i < 10; i++) { ctx.beginPath(); const px = cx - rnd(0, S*0.6), py = cy + rnd(-h, h); ctx.moveTo(px, py); ctx.lineTo(px - S*0.04, py + S*0.01); ctx.lineTo(px - S*0.01, py + S*0.04); ctx.fill(); } }
  };

  // ---------- Realm of the Unlimited ----------
  X.eyegod = (ctx, S, time, v) => {
    const cy = -S*0.75, [tx, ty] = v.target || [-500, -100];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let r = 0; r < 4; r++) { ctx.strokeStyle = `hsla(${(45 + r*20)%360},100%,65%,${0.5 - r*0.1})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, cy, S*(0.55 + r*0.1), S*(0.22 + r*0.05), time*(r%2 ? 0.3 : -0.2) + r, 0, TAU); ctx.stroke(); }
    ctx.restore();
    for (let i = 0; i < 6; i++) { const a = i/6*TAU + time*0.25, hx = Math.cos(a)*S*0.62, hy = cy + Math.sin(a)*S*0.42; // orbiting hands
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + Math.PI/2); ctx.fillStyle = '#e8dfc8'; ctx.beginPath(); ctx.ellipse(0, 0, S*0.04, S*0.05, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#e8dfc8'; ctx.lineWidth = S*0.014; ctx.lineCap = 'round'; for (let f = -1.5; f <= 1.5; f++) { ctx.beginPath(); ctx.moveTo(f*S*0.018, -S*0.03); ctx.lineTo(f*S*0.022, -S*0.1); ctx.stroke(); } ctx.restore(); }
    const blink = Math.sin(time*0.5) > 0.97 ? 0.1 : 1;
    ctx.fillStyle = '#2a1a08'; ctx.beginPath(); ctx.ellipse(0, cy, S*0.42, S*0.26, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#f4ecd6'; ctx.beginPath(); ctx.ellipse(0, cy, S*0.38, S*0.22*blink, 0, 0, TAU); ctx.fill();
    const a = Math.atan2(ty - cy, tx); const px = Math.cos(a)*S*0.12, py = cy + Math.sin(a)*S*0.05;
    const ig = ctx.createRadialGradient(px, py, 0, px, py, S*0.16); ig.addColorStop(0, '#000'); ig.addColorStop(0.35, '#000'); ig.addColorStop(0.4, '#ffd34a'); ig.addColorStop(0.75, '#a04800'); ig.addColorStop(1, '#3a1400');
    ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(px, py, S*0.16, S*0.16*blink, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(160,20,20,0.6)'; ctx.lineWidth = 1; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(S*(i%2 ? 0.37 : -0.37), cy + (i - 4)*S*0.02); ctx.quadraticCurveTo(S*(i%2 ? 0.25 : -0.25), cy + (i - 4)*S*0.03 + S*0.03, S*(i%2 ? 0.2 : -0.2), cy + (i - 4)*S*0.025); ctx.stroke(); }
  };
  X.geometer = (ctx, S, time, v) => {
    const cy = -S*0.7;
    const cube = (x, y, z0, s, rot, col) => { const pts = []; for (let i = 0; i < 8; i++) { let px = (i & 1 ? 1 : -1)*s, py = (i & 2 ? 1 : -1)*s, pz = (i & 4 ? 1 : -1)*s;
      const c1 = Math.cos(rot), s1 = Math.sin(rot), c2 = Math.cos(rot*0.7), s2 = Math.sin(rot*0.7); [px, pz] = [px*c1 - pz*s1, px*s1 + pz*c1]; [py, pz] = [py*c2 - pz*s2, py*s2 + pz*c2]; pts.push([x + px, y + py]); }
      ctx.strokeStyle = col; ctx.beginPath(); for (const [a, b] of [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]]) { ctx.moveTo(...pts[a]); ctx.lineTo(...pts[b]); } ctx.stroke(); };
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2;
    cube(0, cy, 0, S*0.22, time*0.6, 'hsla(180,100%,70%,0.9)'); cube(0, cy, 0, S*0.34, -time*0.4, 'hsla(200,100%,60%,0.5)'); cube(0, cy, 0, S*0.12, time*1.3, 'hsla(160,100%,80%,0.9)');
    for (let i = 0; i < 8; i++) { const a = i/8*TAU + time*0.5; cube(Math.cos(a)*S*0.6, cy + Math.sin(a)*S*0.25, 0, S*0.04, time*2 + i, 'hsla(190,100%,70%,0.7)'); }
    ctx.strokeStyle = 'hsla(180,100%,60%,0.25)'; ctx.lineWidth = 1; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(i*S*0.1, -S*1.4); ctx.lineTo(i*S*0.1 + Math.sin(time + i)*S*0.05, 0); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, cy, S*0.05, 0, TAU); ctx.fill(); ctx.fillStyle = '#0ff'; ctx.beginPath(); ctx.arc(0, cy, S*0.012, 0, TAU); ctx.fill();
  };
  X.glyph = (ctx, S, time, v) => {
    const cy = -S*0.65, chars = 'VÔLƯỢNGCHÍTÔNTHEUNLIMITED霸氣無名∞Ω';
    ctx.fillStyle = '#000'; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const a = i/60*TAU, r = S*0.28*(1 + 0.12*Math.sin(a*6 + time*3)); const px = Math.cos(a)*r, py = cy + Math.sin(a)*r*1.5; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.fill();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 46; i++) { const a = i*2.399 + time*(0.3 + (i%5)*0.08), r = S*(0.3 + (i%9)*0.05) * (1 - ((time*0.15 + i*0.03) % 1)*0.6);
      ctx.font = `700 ${S*(0.03 + (i%4)*0.012)}px ${FONT}`; ctx.fillStyle = `hsla(${(300 + i*7)%360},90%,${60 + (i%3)*10}%,0.85)`; ctx.fillText(chars[i % chars.length], Math.cos(a)*r, cy + Math.sin(a)*r*1.2); }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-S*0.06, cy - S*0.08, S*0.02, 0, TAU); ctx.arc(S*0.06, cy - S*0.08, S*0.02, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, cy, S*0.12, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke();
    ctx.textBaseline = 'alphabetic';
  };
})();
