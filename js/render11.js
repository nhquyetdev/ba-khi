// GodK Bá Khí v2.3 — GodK Tower: HELL (floors 81–100). Ox-Head, Horse-Face, Lady Meng, Hungry Ghost, Yaksha,
// the Infernal Judge, King Yama + "Deformed" variants.
'use strict';
(() => {
  const TAU = Math.PI*2, { eye } = R, X = R.extra, hash = (i, k) => { const x = Math.sin(i*127.1 + k*311.7)*43758.5453; return x - Math.floor(x); };
  const glow = (ctx, x, y, r, rgba) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };
  function hellfire(ctx, S, time, n, w){ // flames licking up from the ground
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) { const x = (i/(n - 1) - 0.5)*S*w, h = S*(0.15 + 0.12*Math.sin(time*6 + i*1.7) + hash(i, 3)*0.1);
      const g = ctx.createLinearGradient(x, 0, x, -h); g.addColorStop(0, 'rgba(255,120,20,0.6)'); g.addColorStop(1, 'rgba(255,40,0,0)'); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x - S*0.04, 0); ctx.quadraticCurveTo(x + Math.sin(time*5 + i)*S*0.03, -h*0.6, x, -h); ctx.quadraticCurveTo(x + S*0.02, -h*0.5, x + S*0.04, 0); ctx.fill(); }
    ctx.restore();
  }
  function body(ctx, S, col, dark, br, wide){ // muscular demon torso + legs
    ctx.fillStyle = dark; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.05, -S*0.45); ctx.lineTo(k*S*0.2, -S*0.45); ctx.lineTo(k*S*0.17, 0); ctx.lineTo(k*S*0.07, 0); ctx.fill(); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-S*0.26*wide, -S*0.95 + br); ctx.quadraticCurveTo(0, -S*1.02 + br, S*0.26*wide, -S*0.95 + br); ctx.lineTo(S*0.18, -S*0.42); ctx.lineTo(-S*0.18, -S*0.42); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -S*0.9 + br); ctx.lineTo(0, -S*0.5); ctx.moveTo(-S*0.12, -S*0.78); ctx.quadraticCurveTo(0, -S*0.72, S*0.12, -S*0.78); ctx.stroke(); // abs
    ctx.fillStyle = '#2a1a10'; ctx.fillRect(-S*0.2, -S*0.48, S*0.4, S*0.07); // belt
  }

  // ---------------- Ngưu Đầu — Ox-Head with a trident and chains ----------------
  X.h_oxhead = (ctx, S, time, v) => {
    const br = Math.sin(time*1.6)*S*0.008, swing = v.atk > 0 ? -0.9 : -0.2 + Math.sin(time*1.2)*0.05; hellfire(ctx, S, time, 7, 1.2);
    body(ctx, S, '#8a2a1a', '#4a1208', br, 1.1);
    ctx.save(); ctx.translate(S*0.28, -S*0.9); ctx.rotate(swing); ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.moveTo(0, S*0.5); ctx.lineTo(0, -S*0.55); ctx.stroke(); // trident
    ctx.strokeStyle = '#b8b8c0'; ctx.lineWidth = S*0.02; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.5); ctx.lineTo(S*0.1, -S*0.5); for (const x of [-0.1, 0, 0.1]) { ctx.moveTo(x*S, -S*0.5); ctx.lineTo(x*S, -S*(x ? 0.68 : 0.75)); } ctx.stroke(); ctx.restore();
    ctx.strokeStyle = '#8a2a1a'; ctx.lineWidth = S*0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(S*0.24, -S*0.92); ctx.lineTo(S*0.3, -S*0.7); ctx.moveTo(-S*0.24, -S*0.92); ctx.lineTo(-S*0.32, -S*0.6); ctx.stroke(); // arms
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 10; i++) { const t = i/10, x = -S*0.32 - t*S*0.25, y = -S*0.6 + Math.sin(t*3 + time*2)*S*0.05 + t*S*0.5; ctx.moveTo(x, y); ctx.arc(x, y, S*0.012, 0, TAU); } ctx.stroke(); // dragging chain
    const hy = -S*1.1 + br; ctx.fillStyle = '#3a1a10'; ctx.beginPath(); ctx.ellipse(0, hy, S*0.13, S*0.12, 0, 0, TAU); ctx.fill(); // ox head
    ctx.beginPath(); ctx.ellipse(-S*0.03, hy + S*0.08, S*0.09, S*0.07, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#c0a080'; ctx.beginPath(); ctx.ellipse(-S*0.04, hy + S*0.1, S*0.06, S*0.04, 0, 0, TAU); ctx.fill(); // muzzle
    ctx.strokeStyle = '#d8c060'; ctx.lineWidth = S*0.012; ctx.beginPath(); ctx.arc(-S*0.04, hy + S*0.14, S*0.025, 0, Math.PI); ctx.stroke(); // nose ring
    ctx.strokeStyle = '#e8e0c8'; ctx.lineWidth = S*0.03; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.1, hy - S*0.06); ctx.quadraticCurveTo(k*S*0.28, hy - S*0.08, k*S*0.26, hy - S*0.26); ctx.stroke(); } // horns
    ctx.fillStyle = '#ff3010'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k*S*0.06 - S*0.02, hy - S*0.02, S*0.015, 0, TAU); ctx.fill(); glow(ctx, k*S*0.06 - S*0.02, hy - S*0.02, S*0.04, 'rgba(255,60,20,0.8)'); }
  };
  // ---------------- Mã Diện — Horse-Face with a halberd ----------------
  X.h_horseface = (ctx, S, time, v) => {
    const br = Math.sin(time*1.5 + 1)*S*0.008, thrust = v.atk > 0 ? -S*0.18 : 0; hellfire(ctx, S, time, 7, 1.2);
    body(ctx, S, '#3a3a48', '#1a1a24', br, 1.0);
    ctx.fillStyle = '#5a1a14'; ctx.beginPath(); ctx.moveTo(-S*0.3, -S*0.95); ctx.lineTo(-S*0.38, -S*0.75); ctx.lineTo(-S*0.2, -S*0.82); ctx.fill(); ctx.beginPath(); ctx.moveTo(S*0.3, -S*0.95); ctx.lineTo(S*0.38, -S*0.75); ctx.lineTo(S*0.2, -S*0.82); ctx.fill(); // pauldrons
    ctx.save(); ctx.translate(thrust, 0); ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = S*0.025; ctx.beginPath(); ctx.moveTo(S*0.25, -S*0.3); ctx.lineTo(-S*0.6, -S*0.95); ctx.stroke(); // halberd shaft
    ctx.fillStyle = '#c8ccd4'; ctx.beginPath(); ctx.moveTo(-S*0.6, -S*0.95); ctx.lineTo(-S*0.72, -S*1.05); ctx.lineTo(-S*0.56, -S*1.02); ctx.lineTo(-S*0.5, -S*1.15); ctx.lineTo(-S*0.52, -S*0.98); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#e8e0d0'; ctx.fillRect(-S*0.25, -S*0.9, S*0.05, S*0.04); // banner tag
    const hy = -S*1.12 + br; ctx.save(); ctx.translate(0, hy); ctx.rotate(-0.25);
    ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.moveTo(-S*0.06, -S*0.12); ctx.quadraticCurveTo(S*0.1, -S*0.14, S*0.05, S*0.05); ctx.lineTo(-S*0.02, S*0.22); ctx.quadraticCurveTo(-S*0.12, S*0.2, -S*0.1, S*0.05); ctx.closePath(); ctx.fill(); // long horse face
    ctx.fillStyle = '#1a0a05'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(S*0.04 - i*S*0.004, -S*0.13 + i*S*0.035); ctx.lineTo(S*0.14 + Math.sin(time*3 + i)*S*0.02, -S*0.1 + i*S*0.04); ctx.lineTo(S*0.05, -S*0.1 + i*S*0.035); ctx.fill(); } // mane
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.06, S*0.19, S*0.012, 0, TAU); ctx.arc(-S*0.01, S*0.2, S*0.012, 0, TAU); ctx.fill(); // nostrils
    ctx.fillStyle = '#ffe040'; ctx.beginPath(); ctx.arc(-S*0.05, -S*0.03, S*0.016, 0, TAU); ctx.fill(); glow(ctx, -S*0.05, -S*0.03, S*0.04, 'rgba(255,220,60,0.8)');
    ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.moveTo(-S*0.02, -S*0.12); ctx.lineTo(-S*0.04, -S*0.22); ctx.lineTo(S*0.02, -S*0.13); ctx.fill(); ctx.restore(); // ear
  };
  // ---------------- Mạnh Bà — Lady Meng with the soup of forgetting ----------------
  X.h_mengpo = (ctx, S, time, v) => {
    const sway = Math.sin(time*0.9)*S*0.01;
    ctx.fillStyle = '#2a2a34'; ctx.beginPath(); ctx.moveTo(-S*0.3, 0); ctx.quadraticCurveTo(-S*0.28, -S*0.6, -S*0.05 + sway, -S*0.85); ctx.quadraticCurveTo(S*0.12, -S*0.8, S*0.2, -S*0.55); ctx.lineTo(S*0.28, 0); ctx.fill(); // hunched robe
    ctx.strokeStyle = '#4a4a58'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-S*0.2 + i*S*0.12, -S*0.05); ctx.lineTo(-S*0.15 + i*S*0.1, -S*0.6); ctx.stroke(); }
    const hx = -S*0.02 + sway, hy = -S*0.92; ctx.fillStyle = '#c8c0b0'; ctx.beginPath(); ctx.ellipse(hx, hy, S*0.08, S*0.09, 0.2, 0, TAU); ctx.fill(); // wrinkled face
    ctx.fillStyle = '#e8e8f0'; ctx.beginPath(); ctx.ellipse(hx + S*0.03, hy - S*0.06, S*0.09, S*0.06, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(hx + S*0.08, hy - S*0.08, S*0.035, 0, TAU); ctx.fill(); // white hair bun
    ctx.strokeStyle = '#6a6050'; ctx.lineWidth = 1; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(hx, hy + S*0.02 + i*S*0.015, S*0.04, 0.3, Math.PI - 0.3); ctx.stroke(); }
    ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.arc(hx - S*0.03, hy - S*0.01, S*0.008, 0, TAU); ctx.arc(hx + S*0.02, hy - S*0.01, S*0.008, 0, TAU); ctx.fill();
    ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(hx - S*0.005, hy + S*0.045, S*0.025, S*0.008 + Math.max(0, Math.sin(time*1.3))*S*0.01, 0, 0, TAU); ctx.fill(); // mumbling
    const bx = -S*0.3, by = -S*0.55 + (v.atk > 0 ? -S*0.08 : 0); ctx.strokeStyle = '#2a2a34'; ctx.lineWidth = S*0.03; ctx.beginPath(); ctx.moveTo(-S*0.1, -S*0.7); ctx.lineTo(bx + S*0.05, by + S*0.02); ctx.stroke();
    ctx.fillStyle = '#8a5a30'; ctx.beginPath(); ctx.moveTo(bx - S*0.1, by); ctx.quadraticCurveTo(bx, by + S*0.09, bx + S*0.1, by); ctx.fill(); ctx.fillStyle = '#40ff90'; ctx.beginPath(); ctx.ellipse(bx, by, S*0.1, S*0.025, 0, 0, TAU); ctx.fill(); // bowl of glowing soup
    for (let i = 0; i < 7; i++) { const ph = (time*0.5 + i/7) % 1; ctx.fillStyle = `rgba(80,255,150,${(1 - ph)*0.45})`; ctx.beginPath(); ctx.arc(bx + Math.sin(time*2 + i*2)*S*0.05, by - ph*S*0.45, S*0.03*(0.5 + ph), 0, TAU); ctx.fill(); } // steam of forgetting
    glow(ctx, bx, by, S*0.2, 'rgba(60,255,140,0.35)');
    ctx.fillStyle = '#5a1a14'; ctx.fillRect(S*0.25, -S*0.65, S*0.06, S*0.1); glow(ctx, S*0.28, -S*0.6, S*0.1, 'rgba(255,80,40,0.6)'); // paper lantern
  };
  // ---------------- Quỷ Đói — Hungry Ghost: needle neck, swollen belly ----------------
  X.h_hungry = (ctx, S, time, v) => {
    const fl = Math.sin(time*1.3)*S*0.03; ctx.save(); ctx.translate(0, -fl);
    ctx.fillStyle = 'rgba(120,160,110,0.25)'; ctx.beginPath(); ctx.moveTo(-S*0.15, -S*0.15); for (let i = 0; i <= 8; i++) ctx.lineTo(-S*0.15 + i*S*0.0375, -S*0.15 + (i % 2 ? S*0.12 : 0) + Math.sin(time*3 + i)*S*0.02); ctx.lineTo(S*0.15, -S*0.15); ctx.fill(); // wispy tail
    const g = ctx.createRadialGradient(-S*0.05, -S*0.45, S*0.03, 0, -S*0.38, S*0.3); g.addColorStop(0, '#b8c4a8'); g.addColorStop(1, '#5a6a50'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -S*0.38, S*0.26, S*0.24, 0, 0, TAU); ctx.fill(); // swollen belly
    ctx.strokeStyle = 'rgba(40,50,30,0.5)'; ctx.lineWidth = 1.2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, -S*0.38, S*(0.08 + i*0.035), -2.4, -0.7); ctx.stroke(); }
    ctx.strokeStyle = '#8a9a78'; ctx.lineWidth = S*0.014; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.12, -S*0.55); ctx.lineTo(k*S*0.3, -S*0.5 + Math.sin(time*2 + k)*S*0.04); ctx.lineTo(k*S*0.36, -S*0.32); ctx.stroke(); } // stick arms
    ctx.strokeStyle = '#8a9a78'; ctx.lineWidth = S*0.01; ctx.beginPath(); ctx.moveTo(0, -S*0.6); ctx.lineTo(0, -S*0.86); ctx.stroke(); // needle-thin neck
    const hy = -S*0.94; ctx.fillStyle = '#a8b498'; ctx.beginPath(); ctx.ellipse(0, hy, S*0.09, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.035, hy - S*0.015, S*0.022, S*0.03, 0, 0, TAU); ctx.fill(); } // hollow eyes
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, hy + S*0.05, S*0.008, 0, TAU); ctx.fill(); // needle mouth
    const fo = v.atk > 0 ? 1.6 : 1; for (let i = 0; i < 6; i++) { const ph = (time*1.5 + i/6) % 1; ctx.fillStyle = `rgba(255,${150 - ph*100},40,${1 - ph})`; ctx.beginPath(); ctx.arc(Math.sin(i*2.3 + time*4)*S*0.02*fo, hy + S*0.06 + ph*S*0.12*fo, S*0.012*(1 - ph)*fo, 0, TAU); ctx.fill(); } // fire from its mouth
    ctx.restore();
  };
  // ---------------- Dạ Xoa — Yaksha: blue skin, wild hair, spiked club ----------------
  X.h_yaksha = (ctx, S, time, v) => {
    const br = Math.sin(time*1.8)*S*0.01, sw = v.atk > 0 ? 1.4 : 0.3 + Math.sin(time*1.3)*0.1; hellfire(ctx, S, time, 6, 1.1);
    body(ctx, S, '#2a5a9a', '#14305a', br, 1.15);
    ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.moveTo(-S*0.22, -S*0.5); ctx.lineTo(S*0.22, -S*0.5); ctx.lineTo(S*0.16, -S*0.3); ctx.lineTo(-S*0.16, -S*0.3); ctx.fill(); // loincloth
    ctx.save(); ctx.translate(S*0.27, -S*0.88); ctx.rotate(sw); ctx.strokeStyle = '#2a5a9a'; ctx.lineWidth = S*0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, S*0.25); ctx.stroke();
    ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.moveTo(-S*0.03, S*0.22); ctx.lineTo(S*0.03, S*0.22); ctx.lineTo(S*0.07, S*0.65); ctx.lineTo(-S*0.07, S*0.65); ctx.fill(); // club
    ctx.fillStyle = '#c8ccd4'; for (let i = 0; i < 6; i++) { const y = S*(0.35 + i*0.05); ctx.beginPath(); ctx.moveTo(S*0.05, y); ctx.lineTo(S*0.1, y - S*0.015); ctx.lineTo(S*0.05, y - S*0.03); ctx.fill(); ctx.beginPath(); ctx.moveTo(-S*0.05, y); ctx.lineTo(-S*0.1, y - S*0.015); ctx.lineTo(-S*0.05, y - S*0.03); ctx.fill(); } ctx.restore();
    const hy = -S*1.1 + br; ctx.fillStyle = '#2a5a9a'; ctx.beginPath(); ctx.ellipse(0, hy, S*0.12, S*0.13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#c03018'; for (let i = 0; i < 12; i++) { const a = -Math.PI*0.95 + i/11*Math.PI*0.9; ctx.beginPath(); ctx.moveTo(Math.cos(a)*S*0.1, hy + Math.sin(a)*S*0.1); ctx.lineTo(Math.cos(a)*S*(0.24 + hash(i, 1)*0.08) + Math.sin(time*4 + i)*S*0.02, hy + Math.sin(a)*S*(0.24 + hash(i, 2)*0.06)); ctx.lineTo(Math.cos(a + 0.15)*S*0.1, hy + Math.sin(a + 0.15)*S*0.1); ctx.fill(); } // wild red hair
    ctx.fillStyle = '#ffe040'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.045, hy - S*0.02, S*0.03, S*0.02, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(k*S*0.045, hy - S*0.02, S*0.01, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffe040'; } // bulging eyes
    ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(0, hy + S*0.06, S*0.06, S*0.025 + (v.atk > 0 ? S*0.02 : 0), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.04, hy + S*0.045); ctx.lineTo(k*S*0.045, hy + S*0.1); ctx.lineTo(k*S*0.025, hy + S*0.05); ctx.fill(); } // fangs
  };
  // ---------------- Phán Quan — the Infernal Judge: red robe, winged hat, brush + Ledger of Life and Death ----------------
  X.h_judge = (ctx, S, time, v) => {
    const br = Math.sin(time*1.1)*S*0.006; hellfire(ctx, S, time, 9, 1.5);
    ctx.fillStyle = '#8a1010'; ctx.beginPath(); ctx.moveTo(-S*0.32, 0); ctx.lineTo(-S*0.24, -S*0.95 + br); ctx.lineTo(S*0.24, -S*0.95 + br); ctx.lineTo(S*0.32, 0); ctx.fill(); // red official robe
    ctx.fillStyle = '#d8a030'; ctx.fillRect(-S*0.2, -S*0.6, S*0.4, S*0.06); ctx.fillStyle = '#1a1010'; ctx.fillRect(-S*0.08, -S*0.9, S*0.16, S*0.25); // belt + rank badge
    ctx.fillStyle = '#d8a030'; ctx.font = `900 ${S*0.08}px serif`; ctx.textAlign = 'center'; ctx.fillText('判', 0, -S*0.73);
    const hy = -S*1.06 + br; ctx.fillStyle = '#c86a50'; ctx.beginPath(); ctx.ellipse(0, hy, S*0.1, S*0.11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.moveTo(-S*0.1, hy - S*0.06); ctx.lineTo(S*0.1, hy - S*0.06); ctx.lineTo(S*0.08, hy - S*0.17); ctx.lineTo(-S*0.08, hy - S*0.17); ctx.fill(); // official hat
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.2, hy - S*0.1, S*0.1, S*0.02, k*0.1, 0, TAU); ctx.fill(); } // hat wings
    ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.moveTo(-S*0.06, hy + S*0.06); ctx.quadraticCurveTo(0, hy + S*0.3, S*0.06, hy + S*0.06); ctx.fill(); // long black beard
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.02, hy - S*0.04); ctx.lineTo(k*S*0.07, hy - S*0.025); ctx.stroke(); } // furious brows
    ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k*S*0.045, hy - S*0.005, S*0.012, 0, TAU); ctx.fill(); }
    const lx = -S*0.36, ly = -S*0.7; ctx.fillStyle = '#f0e6c8'; ctx.fillRect(lx - S*0.12, ly - S*0.14, S*0.24, S*0.18); ctx.strokeStyle = '#5a3010'; ctx.lineWidth = 2; ctx.strokeRect(lx - S*0.12, ly - S*0.14, S*0.24, S*0.18); // the ledger
    ctx.fillStyle = '#a01010'; for (let i = 0; i < 6; i++) ctx.fillRect(lx - S*0.1 + i*S*0.035, ly - S*0.12, S*0.012, S*0.14*(0.6 + hash(i, 2)*0.4)); // names in red
    const bw = v.atk > 0 ? -0.6 : 0.2 + Math.sin(time*2)*0.1; ctx.save(); ctx.translate(S*0.28, -S*0.8); ctx.rotate(bw); ctx.strokeStyle = '#3a2010'; ctx.lineWidth = S*0.018; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -S*0.3); ctx.stroke(); ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.moveTo(-S*0.015, -S*0.3); ctx.lineTo(0, -S*0.38); ctx.lineTo(S*0.015, -S*0.3); ctx.fill(); ctx.restore(); // brush
    glow(ctx, 0, -S*0.6, S*0.8, 'rgba(255,40,20,0.15)');
  };
  // ---------------- Diêm La Vương — King Yama on his throne ----------------
  X.h_yama = (ctx, S, time, v) => {
    const br = Math.sin(time*0.8)*S*0.006; hellfire(ctx, S, time, 13, 2.0);
    glow(ctx, 0, -S*0.9, S*1.1, 'rgba(255,60,20,0.25)');
    ctx.fillStyle = '#2a0a0a'; ctx.beginPath(); ctx.moveTo(-S*0.5, 0); ctx.lineTo(-S*0.5, -S*1.3); ctx.quadraticCurveTo(0, -S*1.5, S*0.5, -S*1.3); ctx.lineTo(S*0.5, 0); ctx.fill(); // throne back
    ctx.strokeStyle = '#d8a030'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#d8a030'; ctx.font = `900 ${S*0.12}px serif`; ctx.textAlign = 'center'; ctx.fillText('閻', 0, -S*1.27);
    ctx.fillStyle = '#5a0a0a'; ctx.beginPath(); ctx.moveTo(-S*0.36, 0); ctx.lineTo(-S*0.28, -S*0.92 + br); ctx.lineTo(S*0.28, -S*0.92 + br); ctx.lineTo(S*0.36, 0); ctx.fill(); // imperial robe
    ctx.strokeStyle = '#d8a030'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -S*0.9); ctx.lineTo(0, 0); ctx.stroke();
    ctx.fillStyle = '#d8a030'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, -S*0.75 + i*S*0.2, S*0.035, 0, TAU); ctx.fill(); } // dragon buttons
    const hy = -S*1.05 + br; ctx.fillStyle = '#b05a40'; ctx.beginPath(); ctx.ellipse(0, hy, S*0.12, S*0.13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#101010'; ctx.beginPath(); ctx.moveTo(-S*0.09, hy + S*0.06); ctx.quadraticCurveTo(0, hy + S*0.38, S*0.09, hy + S*0.06); ctx.fill(); // great beard
    ctx.fillStyle = '#ffd040'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.045, hy - S*0.01, S*0.022, S*0.012, 0, 0, TAU); ctx.fill(); glow(ctx, k*S*0.045, hy - S*0.01, S*0.05, 'rgba(255,200,40,0.8)'); }
    ctx.fillStyle = '#101010'; ctx.fillRect(-S*0.16, hy - S*0.2, S*0.32, S*0.06); ctx.fillStyle = '#d8a030'; ctx.fillRect(-S*0.18, hy - S*0.22, S*0.36, S*0.02); // flat-topped crown (mũ miện)
    for (let i = 0; i < 6; i++) { const x = -S*0.16 + i*S*0.064, sw = Math.sin(time*2 + i)*S*0.005; ctx.strokeStyle = '#d8a030'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, hy - S*0.2); ctx.lineTo(x + sw, hy - S*0.08); ctx.stroke(); ctx.fillStyle = '#ff4030'; ctx.beginPath(); ctx.arc(x + sw, hy - S*0.07, S*0.008, 0, TAU); ctx.fill(); } // jade tassels
    const tx = S*0.32, ty = -S*0.75 + (v.atk > 0 ? -S*0.12 : 0); ctx.fillStyle = '#e8d8a8'; ctx.fillRect(tx - S*0.03, ty - S*0.22, S*0.06, S*0.3); ctx.fillStyle = '#a01010'; ctx.font = `900 ${S*0.05}px serif`; ctx.fillText('死', tx, ty - S*0.05); // tablet of judgement
    for (let i = 0; i < 8; i++) { const a = time*0.6 + i*TAU/8, x = Math.cos(a)*S*0.75, y = -S*0.8 + Math.sin(a)*S*0.18; ctx.fillStyle = 'rgba(160,220,255,0.6)'; ctx.beginPath(); ctx.ellipse(x, y, S*0.025, S*0.04, 0, 0, TAU); ctx.fill(); } // circling souls
  };

  // ---------------- "Deformed" variants: the same demon, come back wrong ----------------
  function deform(base){ return (ctx, S, time, v) => {
    ctx.save(); ctx.globalAlpha = 0.35; ctx.translate(Math.sin(time*7)*S*0.06, 0); ctx.transform(1, 0, Math.sin(time*1.7)*0.25, 1, 0, 0); X[base](ctx, S*1.05, time + 0.4, v); ctx.restore(); // ghost double
    ctx.save(); ctx.transform(1, 0, Math.sin(time*1.1)*0.08, 1 + Math.sin(time*2.3)*0.03, 0, 0); X[base](ctx, S, time, v); ctx.restore();
    ctx.strokeStyle = 'rgba(90,0,20,0.85)'; ctx.lineWidth = S*0.02; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const k = i - 1, sx = k*S*0.15, sy = -S*0.75; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.bezierCurveTo(sx + k*S*0.3, sy - S*0.2, sx + k*S*0.45 + Math.sin(time*3 + i)*S*0.05, sy + S*0.1, sx + k*S*0.55, sy + S*0.3); ctx.stroke(); } // extra twisted limbs
    for (let i = 0; i < 7; i++) eye(ctx, (hash(i, 1) - 0.5)*S*0.45, -S*(0.4 + hash(i, 2)*0.6), S*(0.025 + hash(i, 3)*0.03), time + i, -300, 0, '#a00010'); // eyes where eyes should not be
    if (Math.random() < 0.08) { ctx.fillStyle = 'rgba(255,0,40,0.25)'; ctx.fillRect(-S*0.6, -S*(0.3 + Math.random()), S*1.2, S*0.04); } // glitch scanline
  }; }
  for (const id of ['h_oxhead', 'h_horseface', 'h_mengpo', 'h_hungry', 'h_yaksha']) X[id + '_d'] = deform(id);
})();
