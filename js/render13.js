// GodK Bá Khí v2.5 — Quỷ Môn Quan (the Ghost Gate, south of Map 1) + the new SKULL AURA.
// R.skullAura: worn by the two gate guardians on the map (and by players with the "Ghost Gate" aura skin: A.skulls).
// R.hellGate: the sealed stone gate to Map 3 (Hell); opens into a swirling crimson portal once both guardians fall.
'use strict';
(() => {
  const TAU = Math.PI*2, hash = (i, k) => { const x = Math.sin(i*127.1 + k*311.7)*43758.5453; return x - Math.floor(x); };
  const hsl = (h, s, l, a) => `hsla(${h},${s}%,${l}%,${a})`;

  // one skull: cranium + cheekbones + jaw, hollow eyes with soul-fire, nose, teeth
  function skull(ctx, x, y, r, a, hue, eyeGlow){
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a;
    ctx.fillStyle = '#ece4d4'; ctx.beginPath(); ctx.arc(0, -r*0.15, r, Math.PI*0.88, Math.PI*2.12); // cranium
    ctx.lineTo(r*0.72, r*0.45); ctx.lineTo(r*0.38, r*0.62); ctx.lineTo(-r*0.38, r*0.62); ctx.lineTo(-r*0.72, r*0.45); ctx.closePath(); ctx.fill();
    ctx.fillRect(-r*0.45, r*0.55, r*0.9, r*0.32); // jaw
    ctx.fillStyle = '#140608';
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*r*0.38, r*0.02, r*0.26, r*0.3, k*0.25, 0, TAU); ctx.fill(); } // sockets
    ctx.beginPath(); ctx.moveTo(0, r*0.25); ctx.lineTo(-r*0.1, r*0.45); ctx.lineTo(r*0.1, r*0.45); ctx.fill(); // nose
    ctx.strokeStyle = '#140608'; ctx.lineWidth = Math.max(1, r*0.07); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*r*0.16, r*0.58); ctx.lineTo(i*r*0.16, r*0.86); ctx.stroke(); } // teeth
    if (eyeGlow) { ctx.globalCompositeOperation = 'lighter'; for (const k of [-1, 1]) { const g = ctx.createRadialGradient(k*r*0.38, r*0.04, 0, k*r*0.38, r*0.04, r*0.34); g.addColorStop(0, hsl(hue, 100, 70, 1)); g.addColorStop(1, hsl(hue, 100, 40, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(k*r*0.38, r*0.04, r*0.34, 0, TAU); ctx.fill(); } }
    ctx.restore();
  }
  R.skull = skull;

  // big boss-size aura: smoky soul-fire column, a giant ghost skull above, an orbit of skulls, skulls rising and fading
  R.skullAura = (ctx, sx, sy, S, time, hue) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(sx, sy - S*0.6, S*0.1, sx, sy - S*0.6, S*1.2); g.addColorStop(0, hsl(hue, 100, 45, 0.35)); g.addColorStop(1, hsl(hue, 100, 20, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, sy - S*0.6, S*1.0, S*1.25, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 9; i++) { const x = sx + (i/8 - 0.5)*S*1.3, h = S*(0.7 + 0.35*Math.sin(time*5 + i*1.9) + hash(i, 4)*0.3); // soul-fire tongues
      const fg = ctx.createLinearGradient(x, sy, x, sy - h); fg.addColorStop(0, hsl(hue, 100, 55, 0.55)); fg.addColorStop(1, hsl(hue, 100, 30, 0)); ctx.fillStyle = fg;
      ctx.beginPath(); ctx.moveTo(x - S*0.09, sy); ctx.quadraticCurveTo(x + Math.sin(time*4 + i)*S*0.08, sy - h*0.6, x, sy - h); ctx.quadraticCurveTo(x + S*0.05, sy - h*0.5, x + S*0.09, sy); ctx.fill(); }
    ctx.restore();
    const pulse = 0.5 + 0.5*Math.sin(time*2); // giant ghost skull looming over the guardian
    skull(ctx, sx, sy - S*1.75 + Math.sin(time*1.3)*S*0.04, S*0.32, 0.18 + 0.12*pulse, hue, true);
    const orbit = []; for (let i = 0; i < 7; i++) { const a = time*0.9 + i*TAU/7; orbit.push([Math.sin(a), sx + Math.cos(a)*S*0.85, sy - S*0.65 + Math.sin(a)*S*0.22, i]); }
    orbit.sort((p, q) => p[0] - q[0]); for (const [d, x, y, i] of orbit) skull(ctx, x, y, S*(0.07 + 0.025*d), 0.45 + 0.4*d, hue, d > 0); // orbit (depth-sorted)
    for (let i = 0; i < 6; i++) { const p = (time*0.35 + i/6) % 1, x = sx + (hash(i, 7) - 0.5)*S*1.4 + Math.sin(time*2 + i)*S*0.05; skull(ctx, x, sy - S*0.2 - p*S*1.7, S*(0.05 + 0.03*p), (1 - p)*0.7, hue, true); } // rising souls
  };

  // player aura skin "Ghost Gate" (A.skulls): small orbit of skulls + rising soul skulls
  const baseExtra = R.auraExtra;
  R.auraExtra = (ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy) => {
    if (baseExtra) baseExtra(ctx, A, cx, cy, w, h, sc, time, hue, back, fx, fy); if (!A.skulls) return;
    const sh = A.oh || 130;
    for (let i = 0; i < 6; i++) { const a = time*1.1 + i*TAU/6, d = Math.sin(a); if ((d < 0) !== back) continue; skull(ctx, cx + Math.cos(a)*w*2.3, cy - h*0.1 + d*w*0.5, 11*sc*(1 + 0.25*d), 0.6 + 0.35*d, sh, !back); } // orbit
    if (back) { const pu = 0.5 + 0.5*Math.sin(time*2); skull(ctx, cx, cy - h*1.55 + Math.sin(time*1.3)*3*sc, 24*sc, 0.22 + 0.15*pu, sh, true); return; } // ghost skull looming above
    for (let i = 0; i < 4; i++) { const p = (time*0.5 + i/4) % 1; skull(ctx, cx + (hash(i, 9) - 0.5)*w*2.2, cy + h*0.5 - p*h*2.2, 8*sc*(0.7 + 0.5*p), (1 - p)*0.7, sh, true); } // rising souls
  };

  // the gate itself
  R.hellGate = (ctx, sx, sy, z, time, open, label, sub) => {
    const S = 200*z, top = sy - S*1.5;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(sx, sy + S*0.04, S*1.1, S*0.16, 0, 0, TAU); ctx.fill(); // shadow
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(sx, sy - S*0.6, 0, sx, sy - S*0.6, S*1.3); gl.addColorStop(0, `rgba(255,40,10,${open ? 0.45 : 0.2 + 0.06*Math.sin(time*2)})`); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(sx - S*1.4, top - S*0.3, S*2.8, S*2); ctx.restore();
    // inner: sealed darkness, or an open swirling portal
    ctx.save(); ctx.beginPath(); ctx.rect(sx - S*0.55, top + S*0.32, S*1.1, S*1.18); ctx.clip();
    ctx.fillStyle = '#0a0204'; ctx.fillRect(sx - S*0.55, top + S*0.32, S*1.1, S*1.18);
    if (open) { const cx = sx, cy = sy - S*0.6; ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 26; i++) { const a = time*1.4 + i*0.55, r = S*(0.05 + i*0.024); ctx.strokeStyle = `rgba(255,${60 + i*4},20,${0.55 - i*0.018})`; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.arc(cx, cy, r, a, a + 2.2); ctx.stroke(); }
      const c = ctx.createRadialGradient(cx, cy, 0, cx, cy, S*0.25); c.addColorStop(0, 'rgba(255,220,160,0.9)'); c.addColorStop(1, 'rgba(255,40,0,0)'); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, S*0.25, 0, TAU); ctx.fill(); }
    else { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const p = (time*0.25 + i/4) % 1; R.skull(ctx, sx + (hash(i, 3) - 0.5)*S*0.6, sy - p*S*1.1, S*0.06, (1 - p)*0.35, 0, true); } }
    ctx.restore();
    // stone pillars with stacked skulls
    for (const k of [-1, 1]) { const px = sx + k*S*0.7;
      ctx.fillStyle = '#2a1c1c'; ctx.fillRect(px - S*0.16, top + S*0.2, S*0.32, S*1.3); ctx.fillStyle = '#3a2626'; ctx.fillRect(px - S*0.16, top + S*0.2, S*0.08, S*1.3);
      ctx.fillStyle = '#1a1010'; ctx.fillRect(px - S*0.2, sy - S*0.12, S*0.4, S*0.12);
      for (let j = 0; j < 4; j++) R.skull(ctx, px, top + S*(0.45 + j*0.28), S*0.07, 0.9, 0, j === 0 || open);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let f = 0; f < 5; f++) { const h = S*(0.14 + 0.06*Math.sin(time*7 + f + k)); ctx.fillStyle = `rgba(255,${90 + f*20},20,0.5)`; ctx.beginPath(); ctx.moveTo(px - S*0.06 + f*S*0.03, top + S*0.2); ctx.quadraticCurveTo(px + Math.sin(time*5 + f)*S*0.04, top + S*0.2 - h*0.7, px - S*0.045 + f*S*0.03, top + S*0.2 - h); ctx.lineTo(px - S*0.03 + f*S*0.03, top + S*0.2); ctx.fill(); } ctx.restore(); } // braziers
    // curved lintel + plaque 鬼門關
    ctx.fillStyle = '#1e1212'; ctx.beginPath(); ctx.moveTo(sx - S*1.05, top + S*0.12); ctx.quadraticCurveTo(sx, top - S*0.05, sx + S*1.05, top + S*0.12); ctx.lineTo(sx + S*0.95, top + S*0.3); ctx.lineTo(sx - S*0.95, top + S*0.3); ctx.fill();
    ctx.strokeStyle = '#8a1a10'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#5a0a08'; ctx.fillRect(sx - S*0.26, top + S*0.08, S*0.52, S*0.2); ctx.strokeStyle = '#d8a030'; ctx.strokeRect(sx - S*0.26, top + S*0.08, S*0.52, S*0.2);
    ctx.fillStyle = '#ffcf60'; ctx.font = `900 ${S*0.13}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('鬼門關', sx, top + S*0.185); ctx.textBaseline = 'alphabetic';
    R.skull(ctx, sx, top - S*0.02, S*0.1, 1, 0, true);
    // chains across the seal
    if (!open) { ctx.strokeStyle = '#6a6060'; ctx.lineWidth = S*0.018; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx - S*0.55, top + S*(0.55 + (k + 1)*0.3)); ctx.quadraticCurveTo(sx, top + S*(0.75 + (k + 1)*0.3), sx + S*0.55, top + S*(0.55 + (k + 1)*0.3)); ctx.stroke(); }
      ctx.fillStyle = '#b08a30'; ctx.fillRect(sx - S*0.06, top + S*0.78, S*0.12, S*0.14); ctx.fillStyle = '#300'; ctx.fillRect(sx - S*0.015, top + S*0.83, S*0.03, S*0.05); } // padlock
    // labels
    ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.font = `800 ${Math.max(12, 16*z)}px ${FONT}`; ctx.fillStyle = '#ff6a50'; ctx.fillText(label, sx, sy + S*0.24);
    ctx.font = `600 ${Math.max(10, 12*z)}px ${FONT}`; ctx.fillStyle = '#e0b0a0'; ctx.fillText(sub, sx, sy + S*0.24 + Math.max(14, 17*z));
    ctx.restore();
  };
})();
