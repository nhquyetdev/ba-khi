// GodK Bá Khí v2.4 — GodK Tower floor 125: Thiên Đạo Nữ Đế (The Heavenly Dao Empress).
// Original design: white/gold/violet gown, long black hair, phoenix crown, golden eyes, rune halo, light ribbons, scepter.
// v.fx.qs = armor left (0..1) · v.fx.qe = enraged · v.fx.qr = revived (white hair, crimson light)
'use strict';
(() => {
  const TAU = Math.PI*2, X = R.extra;
  const glow = (ctx, x, y, r, rgba) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };
  const RUNES = '天道不可逆命定終局';

  X.q_empress = (ctx, S, time, v) => {
    const fx = (v && v.fx) || {}, en = !!fx.qe, rv = !!fx.qr, qs = fx.qs === undefined ? 1 : fx.qs;
    const gold = rv ? '#ffb0a0' : '#ffd870', light = rv ? 'rgba(255,70,60,' : en ? 'rgba(255,130,60,' : 'rgba(255,225,140,';
    const fl = Math.sin(time*1.3)*S*0.03, br = Math.sin(time*0.9)*S*0.006; // she floats
    ctx.save(); ctx.translate(0, -S*0.06 + fl); ctx.scale(0.8, 0.8); // fits the arena (halo + crown stay on screen)

    // ---- ground light + rotating rune halo ----
    glow(ctx, 0, -S*0.85, S*1.25, light + '0.22)');
    ctx.save(); ctx.translate(0, -S*1.12); ctx.rotate(time*0.25);
    ctx.strokeStyle = light + '0.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, S*0.42, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, S*0.5, 0, TAU); ctx.stroke();
    ctx.fillStyle = gold; ctx.font = `700 ${S*0.055}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < RUNES.length; i++) { const a = i*TAU/RUNES.length; ctx.save(); ctx.rotate(a); ctx.fillText(RUNES[i], 0, -S*0.46); ctx.restore(); }
    for (let i = 0; i < 12; i++) { const a = i*TAU/12; ctx.beginPath(); ctx.moveTo(Math.cos(a)*S*0.52, Math.sin(a)*S*0.52); ctx.lineTo(Math.cos(a)*S*(0.62 + 0.04*Math.sin(time*3 + i)), Math.sin(a)*S*(0.62 + 0.04*Math.sin(time*3 + i))); ctx.strokeStyle = light + '0.5)'; ctx.stroke(); } // rays
    ctx.restore(); ctx.textBaseline = 'alphabetic';

    // ---- light ribbons behind her ----
    for (const k of [-1, 1]) for (let j = 0; j < 2; j++) {
      ctx.strokeStyle = j ? 'rgba(190,150,255,0.55)' : light + '0.6)'; ctx.lineWidth = S*(0.025 - j*0.008); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(k*S*0.12, -S*0.88);
      for (let t = 1; t <= 6; t++) ctx.lineTo(k*S*(0.12 + t*0.1), -S*0.88 + t*S*0.1 + Math.sin(time*2 + t*0.8 + j + k)*S*0.06); ctx.stroke(); }

    // ---- long hair (back) ----
    const hy = -S*1.12 + br, hair = rv ? '#f2eee8' : '#0e0a18';
    ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-S*0.13, hy - S*0.06);
    ctx.bezierCurveTo(-S*0.24, hy + S*0.3, -S*0.2 + Math.sin(time*1.4)*S*0.03, hy + S*0.6, -S*0.26 + Math.sin(time*1.2)*S*0.05, hy + S*0.82);
    ctx.lineTo(S*0.26 + Math.sin(time*1.3)*S*0.05, hy + S*0.82); ctx.bezierCurveTo(S*0.2, hy + S*0.6, S*0.24, hy + S*0.3, S*0.13, hy - S*0.06); ctx.fill();

    // ---- gown: violet underskirt, white/gold overgown ----
    const gw = S*(0.42 + 0.02*Math.sin(time*1.7));
    ctx.fillStyle = rv ? '#4a0a18' : '#2a1450'; ctx.beginPath(); ctx.moveTo(-gw, S*0.05); ctx.quadraticCurveTo(0, -S*0.02 + Math.sin(time*2)*S*0.02, gw, S*0.05); ctx.lineTo(S*0.1, -S*0.62); ctx.lineTo(-S*0.1, -S*0.62); ctx.fill();
    const gg = ctx.createLinearGradient(0, -S*0.95, 0, 0); gg.addColorStop(0, '#fffaf0'); gg.addColorStop(1, rv ? '#e8b0b0' : '#e6dcff');
    ctx.fillStyle = gg; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.04, -S*0.62); ctx.lineTo(k*gw*0.95, S*0.03); ctx.quadraticCurveTo(k*gw*0.55, -S*0.03, k*S*0.16, -S*0.02); ctx.lineTo(k*S*0.1, -S*0.62); ctx.fill(); }
    ctx.strokeStyle = gold; ctx.lineWidth = 2; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.06, -S*0.6); ctx.lineTo(k*gw*0.95, S*0.03); ctx.stroke(); }
    // bodice
    ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.6); ctx.lineTo(-S*0.13, -S*0.9 + br); ctx.lineTo(S*0.13, -S*0.9 + br); ctx.lineTo(S*0.1, -S*0.6); ctx.fill();
    ctx.fillStyle = gold; ctx.fillRect(-S*0.11, -S*0.64, S*0.22, S*0.035); // gold sash
    ctx.beginPath(); ctx.moveTo(0, -S*0.86); ctx.lineTo(S*0.03, -S*0.8); ctx.lineTo(0, -S*0.74); ctx.lineTo(-S*0.03, -S*0.8); ctx.fill(); glow(ctx, 0, -S*0.8, S*0.06, light + '0.9)'); // heart jewel
    // shoulder pauldrons (feather-like)
    for (const k of [-1, 1]) for (let i = 0; i < 3; i++) { ctx.fillStyle = i % 2 ? '#fffaf0' : gold; ctx.beginPath(); ctx.ellipse(k*S*(0.15 + i*0.03), -S*(0.88 - i*0.03) + br, S*0.07, S*0.022, k*(0.4 + i*0.25), 0, TAU); ctx.fill(); }

    // ---- arms: left hand raised in a mudra, right holds the scepter ----
    const atk = v && v.atk > 0;
    ctx.strokeStyle = '#f3e2d6'; ctx.lineWidth = S*0.032; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-S*0.15, -S*0.86 + br); ctx.lineTo(-S*0.26, -S*0.7); ctx.lineTo(atk ? -S*0.42 : -S*0.3, atk ? -S*0.82 : -S*0.92); ctx.stroke();
    glow(ctx, atk ? -S*0.42 : -S*0.3, atk ? -S*0.82 : -S*0.94, S*(atk ? 0.18 : 0.08), light + '0.9)');
    const sx = S*0.28, sy = -S*0.62; ctx.beginPath(); ctx.moveTo(S*0.15, -S*0.86 + br); ctx.lineTo(S*0.25, -S*0.72); ctx.lineTo(sx, sy); ctx.stroke();
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(atk ? 0.5 : 0.08 + Math.sin(time)*0.04);
    ctx.strokeStyle = gold; ctx.lineWidth = S*0.016; ctx.beginPath(); ctx.moveTo(0, S*0.5); ctx.lineTo(0, -S*0.5); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -S*0.58, S*0.07, 0, TAU); ctx.stroke();
    for (let i = 0; i < 4; i++) { const a = time*1.5 + i*TAU/4; ctx.beginPath(); ctx.moveTo(0, -S*0.58); ctx.lineTo(Math.cos(a)*S*0.1, -S*0.58 + Math.sin(a)*S*0.1); ctx.stroke(); }
    glow(ctx, 0, -S*0.58, S*0.14, light + '1)'); ctx.restore();

    // ---- face ----
    ctx.fillStyle = '#f6e6dc'; ctx.beginPath(); ctx.moveTo(-S*0.085, hy - S*0.04); ctx.quadraticCurveTo(-S*0.09, hy + S*0.07, 0, hy + S*0.115); ctx.quadraticCurveTo(S*0.09, hy + S*0.07, S*0.085, hy - S*0.04); ctx.quadraticCurveTo(0, hy - S*0.13, -S*0.085, hy - S*0.04); ctx.fill();
    ctx.fillStyle = '#f6e6dc'; ctx.fillRect(-S*0.025, hy + S*0.09, S*0.05, S*0.06); // neck
    const ec = en || rv ? '#ff3a2a' : '#ffcf40';
    for (const k of [-1, 1]) { ctx.fillStyle = ec; ctx.beginPath(); ctx.ellipse(k*S*0.036, hy + S*0.01, S*0.019, S*0.008, k*-0.15, 0, TAU); ctx.fill(); glow(ctx, k*S*0.036, hy + S*0.01, S*0.04, en || rv ? 'rgba(255,50,30,0.8)' : 'rgba(255,210,80,0.7)');
      ctx.strokeStyle = '#140a10'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(k*S*0.015, hy - S*0.002); ctx.lineTo(k*S*0.062, hy - S*0.006); ctx.stroke(); // sharp lashes
      ctx.beginPath(); ctx.moveTo(k*S*0.018, hy - S*0.022); ctx.lineTo(k*S*0.06, hy - S*0.03); ctx.stroke(); } // calm, cold brows
    ctx.fillStyle = '#c03040'; ctx.beginPath(); ctx.ellipse(0, hy + S*0.065, S*0.016, S*0.006, 0, 0, TAU); ctx.fill(); // lips
    ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(0, hy - S*0.07); ctx.lineTo(S*0.008, hy - S*0.05); ctx.lineTo(0, hy - S*0.035); ctx.lineTo(-S*0.008, hy - S*0.05); ctx.fill(); // forehead mark
    // front hair: bangs + side locks
    ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-S*0.1, hy + S*0.04); ctx.quadraticCurveTo(-S*0.11, hy - S*0.12, 0, hy - S*0.13); ctx.quadraticCurveTo(S*0.11, hy - S*0.12, S*0.1, hy + S*0.04); ctx.quadraticCurveTo(S*0.07, hy - S*0.06, S*0.02, hy - S*0.075); ctx.quadraticCurveTo(0, hy - S*0.06, -S*0.02, hy - S*0.075); ctx.quadraticCurveTo(-S*0.07, hy - S*0.06, -S*0.1, hy + S*0.04); ctx.fill();
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.09, hy - S*0.02); ctx.quadraticCurveTo(k*S*0.12, hy + S*0.15, k*S*(0.1 + 0.01*Math.sin(time*2 + k)), hy + S*0.3); ctx.lineTo(k*S*0.075, hy + S*0.1); ctx.fill(); }

    // ---- phoenix crown ----
    ctx.fillStyle = gold; const cy = hy - S*0.12;
    ctx.beginPath(); ctx.moveTo(-S*0.08, cy + S*0.02); for (let i = 0; i <= 6; i++) { const x = -S*0.08 + i*S*0.16/6, h = (i === 3 ? 0.16 : i % 2 ? 0.07 : 0.11)*S; ctx.lineTo(x, cy - h); if (i < 6) ctx.lineTo(x + S*0.0133, cy - S*0.02); } ctx.lineTo(S*0.08, cy + S*0.02); ctx.fill();
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.07, cy - S*0.02); ctx.quadraticCurveTo(k*S*0.2, cy - S*0.12, k*S*0.26, cy - S*0.04 + Math.sin(time*2)*S*0.01); ctx.quadraticCurveTo(k*S*0.17, cy - S*0.04, k*S*0.07, cy + S*0.01); ctx.fill(); } // phoenix wings
    ctx.fillStyle = en || rv ? '#ff3040' : '#a070ff'; ctx.beginPath(); ctx.arc(0, cy - S*0.07, S*0.018, 0, TAU); ctx.fill(); glow(ctx, 0, cy - S*0.07, S*0.05, en || rv ? 'rgba(255,40,60,0.9)' : 'rgba(180,130,255,0.9)');

    // ---- embers/stars drifting up ----
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { const p = (time*0.25 + i/14) % 1, x = Math.sin(i*12.9898)*S*0.55 + Math.sin(time + i)*S*0.03, y = -p*S*1.6; ctx.fillStyle = light + (0.8*(1 - p)).toFixed(2) + ')'; ctx.beginPath(); ctx.arc(x, y, S*0.008*(1 + (i % 3)), 0, TAU); ctx.fill(); }
    ctx.restore();

    // ---- Heaven Armor: golden hex shell while it holds ----
    if (qs > 0) { ctx.save(); ctx.globalAlpha = 0.25 + 0.45*qs; ctx.strokeStyle = '#fff2b0'; ctx.lineWidth = 1.5; const rr = S*0.075;
      ctx.beginPath(); ctx.ellipse(0, -S*0.62, S*0.62, S*0.78, 0, 0, TAU); ctx.save(); ctx.clip();
      for (let r = -9; r <= 9; r++) for (let c = -6; c <= 6; c++) { const x = c*rr*1.75 + (r & 1)*rr*0.875, y = -S*0.62 + r*rr*1.5; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i*TAU/6 + TAU/12; ctx.lineTo(x + Math.cos(a)*rr*0.9, y + Math.sin(a)*rr*0.9); } ctx.closePath(); ctx.stroke(); }
      ctx.restore(); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, -S*0.62, S*0.62, S*0.78, 0, 0, TAU); ctx.stroke();
      const sh = (time*0.6) % 1; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,240,180,0.18)'; ctx.fillRect(-S*0.62, -S*1.4 + sh*S*1.56, S*1.24, S*0.06); ctx.restore(); }
    if (en || rv) glow(ctx, 0, -S*0.7, S*0.9, rv ? 'rgba(255,40,40,0.25)' : 'rgba(255,90,30,0.2)');
    ctx.restore();
  };
})();
