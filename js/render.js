// GodK Bá Khí — rendering: 2.5D world, stickman poses, tiered auras, creepy bosses
'use strict';
const R = (() => {
  const SQ = 0.62; // vertical squash for 2.5D ground
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function hash(x, y){ let h = (x*374761393 + y*668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
  function noise1(x){ const i = Math.floor(x), f = x - i, a = hash(i, 7), b = hash(i+1, 7); const u = f*f*(3-2*f); return a + (b-a)*u; }
  const hsl = (h, s, l, a=1) => `hsla(${h},${s}%,${l}%,${a})`;

  // ---------------- Aura styles per tier ----------------
  // core hue/sat/light, outer hue; feature flags
  const AURA = [
    { h:210, s:15, l:90, oh:210, os:20, size:0.75, alpha:0.35, tongues:5 },                                   // 1 Awakening: faint white
    { h:205, s:95, l:65, oh:225, os:100, size:0.95, alpha:0.55, tongues:7, embers:1 },                       // 2 Superior: blue ki
    { h:48,  s:100,l:60, oh:38, os:100, size:1.15, alpha:0.7, tongues:9, embers:2, sparks:1, lightningFrom:10, pulse:1 }, // 3 Royal: golden
    { h:50,  s:60, l:88, oh:45, os:100, size:1.3, alpha:0.75, tongues:9, embers:2, halo:1, pillar:1, pulse:1 },   // 4 Divine: white gold
    { h:265, s:90, l:65, oh:220, os:100, size:1.45, alpha:0.8, tongues:11, stars:1, nebula:1, pulse:1 },      // 5 Cosmic
    { h:0,   s:100,l:62, oh:0,  os:100, size:1.6, alpha:0.8, tongues:11, rainbow:1, infinity:1, embers:2, pulse:1 }, // 6 Infinite
    { h:355, s:100,l:50, oh:0,  os:100, size:1.75, alpha:0.9, tongues:13, darkCore:1, lightning:1, cracks:1, shake:1, pulse:1 }, // 7 Absolute
    { h:185, s:100,l:75, oh:200, os:100, size:1.9, alpha:0.85, tongues:13, rings:1, glitch:1, lightning:1, pulse:1 },  // 8 Transcendent
    { h:45,  s:100,l:85, oh:40, os:100, size:2.05, alpha:0.95, tongues:15, rays:1, wings:1, halo:1, embers:3, pulse:1 }, // 9 Supreme
    { h:275, s:90, l:55, oh:285, os:100, size:2.25, alpha:1, tongues:15, void:1, inward:1, runes:1, lightning:1, pulse:1 }, // 10 Unfathomable
    { h:42,  s:100,l:68, oh:22, os:100, size:2.4, alpha:1, tongues:17, eclipse:1, embers:3, lightning:1, pulse:1 },                          // 11 Beyond the Unlimited: black-sun eclipse
    { h:185, s:100,l:64, oh:200,os:100, h2:312, size:2.5, alpha:1, tongues:17, dual:1, yinyang:1, afterimage:1, lightning:1, pulse:1 },     // 12 Paradox: split cyan/magenta, yin-yang, afterimages
    { h:0,   s:100,l:74, oh:0,  os:100, size:2.6, alpha:1, tongues:19, rainbow:1, spiral:1, dragon:1, crownlight:1, eclipse:1, rays:1, pulse:1 }, // 13 Final Names: genesis storm
    { h:0,   s:100,l:68, oh:0,  os:100, size:2.65, alpha:1, tongues:19, rainbow:1, rays:1, void:1, lightning:1, halo:1, stars:1, runes:1, spiral:1, dragon:1, yinyang:1, pulse:1 }, // Layers beyond GodK
  ];
  // v1.4: second half of every realm (sub-title 11–20) awakens extra effects
  const AURA_P2 = [ { sparks:1, embers:1 }, { lightning:1, embers:2 }, { lightning:1, pillar:1 }, { wings:1 }, { comet:1 }, { rays:1 }, { afterimage:1 }, { clock:1 }, { crownlight:1 }, { eyeVoid:1 }, { dragon:1 }, { spiral:1 }, {}, {} ];

  // ---------------- Poses ----------------
  // angles from straight-down (radians); + = toward screen-right. ua/la arm upper/lower, ut/ls leg thigh/shin
  function pose(tier, time, moving, phase, sub){
    const P = { lua:-0.18, lla:-0.1, rua:0.18, rla:0.1, lut:-0.18, lls:-0.08, rut:0.18, rls:0.08, float:0, head:0, bob:0, eyes:tier>=2 };
    // convention: + = toward screen-right (character faces right; flipped when facing left)
    if (moving) {
      const s = Math.sin(phase), fl = tier >= 3 && tier !== 6;
      if (fl) { // flying dash: limbs trail behind
        Object.assign(P, { lua:-0.75-s*0.1, lla:-1.0, rua:-0.5+s*0.1, rla:-0.85, lut:-0.45+s*0.12, lls:-0.75, rut:-0.25-s*0.12, rls:-0.55, float: 8 + tier*1.5 + Math.sin(time*4)*3, head:0.15 });
      } else {
        Object.assign(P, { lua:-s*0.7, lla:-s*0.7-0.5, rua:s*0.7, rla:s*0.7+0.5, lut:s*0.65, lls:s*0.65-Math.max(0,s)*0.7, rut:-s*0.65, rls:-s*0.65-Math.max(0,-s)*0.7, bob: Math.abs(Math.cos(phase))*3 });
      }
      return P;
    }
    const br = Math.sin(time*2)*0.04;
    switch (Math.min(tier, 13)) {
      case 0: Object.assign(P, { lua:-0.15-br, lla:-0.1-br, rua:0.15+br, rla:0.1+br }); break;                                   // relaxed
      case 1: Object.assign(P, { lua:-0.3, lla:1.75, rua:0.3, rla:-1.75, lut:-0.16, rut:0.16 }); break;                       // arms crossed
      case 2: { const sh = Math.sin(time*40)*0.02; Object.assign(P, { lua:-0.6-sh, lla:0.55, rua:0.6+sh, rla:-0.55, lut:-0.55, lls:-0.05, rut:0.55, rls:0.05, bob:-5 + Math.sin(time*30)*0.8 }); break; } // power-up stance, fists at hips
      case 3: Object.assign(P, { lua:-0.95-br, lla:-1.35, rua:0.95+br, rla:1.35, lut:-0.06, lls:-0.02, rut:0.06, rls:0.02, float: 10 + Math.sin(time*1.6)*4 }); break; // divine palms up
      case 4: Object.assign(P, { lua:-0.5, lla:-1.0, rua:0.5, rla:1.0, lut:-1.35, lls:1.95, rut:1.35, rls:-1.95, float: 22 + Math.sin(time*1.3)*5 }); break;         // meditation
      case 5: Object.assign(P, { lua:-1.52-br, lla:-1.55, rua:1.52+br, rla:1.55, lut:-0.07, lls:-0.12, rut:0.07, rls:0.12, float: 18 + Math.sin(time*1.5)*5 }); break; // cosmic T-float
      case 6: Object.assign(P, { lua:-0.25, lla:-0.05, rua:2.8, rla:3.05, lut:-0.32, rut:0.32, head:0.15 }); break;                                                  // fist to the sky
      case 7: Object.assign(P, { lua:-0.3, lla:0.7, rua:0.3, rla:-0.7, lut:-0.04, rut:0.04, lls:-0.08, rls:0.08, float: 24 + Math.sin(time*1.1)*4 }); break;           // master: hands behind back
      case 8: Object.assign(P, { lua:-2.35, lla:-2.6, rua:2.35, rla:2.6, lut:-0.06, lls:0.2, rut:0.06, rls:-0.2, float: 32 + Math.sin(time*1.2)*6, head:-0.25 }); break; // V to the heavens
      case 9: Object.assign(P, { lua:-0.08-br, lla:-0.04, rua:0.08+br, rla:0.04, lut:-0.04, lls:0.12, rut:0.04, rls:-0.12, float: 36 + Math.sin(time*0.9)*7, head:0.35 }); break; // limp void float
      case 10: Object.assign(P, { lua:-0.35, lla:0.9, rua:1.55, rla:1.6, lut:-0.1, lls:0.1, rut:0.12, rls:-0.05, float: 42 + Math.sin(time*1.1)*5, head:-0.1 }); break; // eclipse: palm thrust forward
      case 11: Object.assign(P, { lua:-0.7, lla:2.3, rua:0.7, rla:-2.3, lut:-1.3, lls:1.95, rut:1.3, rls:-1.95, float: 46 + Math.sin(time*0.8)*6, head:0.05 }); break; // paradox: floating meditation, prayer hands
      case 12: Object.assign(P, { lua:-2.0, lla:-2.2, rua:2.0, rla:2.2, lut:-0.04, lls:0.3, rut:0.04, rls:-0.3, float: 50 + Math.sin(time*0.9)*7, head:-0.35 }); break; // final: arms open to the sky
      default: Object.assign(P, { lua:-0.3, lla:1.75, rua:0.3, rla:-1.75, lut:-0.05, lls:0.15, rut:0.05, rls:-0.15, float: 48 + Math.sin(time)*6 }); // layers: floating arms crossed
    }
    return P;
  }

  function limb(ctx, x, y, a1, a2, len){
    const x1 = x + Math.sin(a1)*len, y1 = y + Math.cos(a1)*len;
    const x2 = x1 + Math.sin(a2)*len, y2 = y1 + Math.cos(a2)*len;
    ctx.moveTo(x, y); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
    return [x2, y2];
  }

  function stickman(ctx, x, y, sc, P, opt){
    // x,y = feet ground point on screen
    const H = 62*sc, lw = Math.max(2, 3.6*sc);
    const fy = y - (P.float||0)*sc - (P.bob||0)*sc;
    const hipY = fy - H*0.46, neckY = fy - H*0.86, headR = H*0.12;
    const col = opt.color || '#f2f2f2';
    const hx0 = x + Math.sin(P.head||0)*H*0.06, hy0 = neckY - H*0.114 + Math.abs(P.head||0)*H*0.036;
    const geo = { x, fy, hipY, neckY, shY: neckY + H*0.05, H, sc, headR, hx: hx0, hy: hy0, P };
    if (opt.before) opt.before(geo);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    const legL = H*0.24, armL = H*0.2;
    limb(ctx, x, hipY, P.lut, P.lls, legL); limb(ctx, x, hipY, P.rut, P.rls, legL);
    ctx.moveTo(x, hipY); ctx.lineTo(x, neckY);
    const shY = neckY + H*0.05;
    limb(ctx, x, shY, P.lua, P.lla, armL); limb(ctx, x, shY, P.rua, P.rla, armL);
    if (opt.outline !== false) { ctx.strokeStyle = opt.outlineColor || 'rgba(0,0,0,0.85)'; ctx.lineWidth = lw + 3*sc; ctx.stroke(); }
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    if (opt.glow) { ctx.shadowColor = opt.glow; ctx.shadowBlur = 12*sc; }
    ctx.stroke();
    // head
    const hx = x + Math.sin(P.head||0)*headR*0.5, hy = neckY - headR*0.95 + Math.abs(P.head||0)*headR*0.3;
    ctx.beginPath(); ctx.arc(hx, hy, headR, 0, TAU);
    ctx.fillStyle = opt.headFill || '#151515'; ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    if (opt.eyes) {
      ctx.fillStyle = opt.eyes; ctx.shadowColor = opt.eyes; ctx.shadowBlur = 8*sc;
      const ex = (opt.face||1)*headR*0.25;
      ctx.fillRect(hx + ex - headR*0.42, hy - headR*0.15, headR*0.3, headR*0.16);
      ctx.fillRect(hx + ex + headR*0.12, hy - headR*0.15, headR*0.3, headR*0.16);
      ctx.shadowBlur = 0;
    }
    if (opt.smile) { ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1, lw*0.5); ctx.beginPath(); ctx.arc(hx, hy + headR*0.1, headR*0.55, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke(); }
    ctx.restore();
    if (opt.after) opt.after(geo);
    return { headX: hx, headY: hy, cy: (fy + neckY)/2, top: hy - headR, fy };
  }

  // ---------------- Aura ----------------
  const skinCache = {};
  const p2Cache = {};
  function realmAura(t){ const ti = tierOf(t); if (subOf(t) < 11 || !AURA_P2[ti] || !Object.keys(AURA_P2[ti]).length) return AURA[ti]; return p2Cache[ti] || (p2Cache[ti] = Object.assign({}, AURA[ti], AURA_P2[ti])); }
  function auraStyle(t, as){ const base = realmAura(t); if (!as || as === 'realm' || typeof AURA_SKINS === 'undefined') return base;
    const k = tierOf(t) + ':' + (subOf(t) >= 11 ? 2 : 1) + ':' + as; if (skinCache[k]) return skinCache[k]; const sk = AURA_SKINS.find(a => a.id === as); if (!sk || !sk.over) return base;
    return (skinCache[k] = Object.assign({ size: base.size, alpha: Math.max(0.6, base.alpha), tongues: base.tongues, pulse: base.pulse }, sk.over)); }
  function auraColor(t, time, light, A_){ const A = A_ || auraStyle(t); const h = A.rainbow ? (time*90) % 360 : A.h; return hsl(h, A.s, light||A.l); }

  function flameShape(ctx, cx, cy, w, h, time, tongues, seed, amp){
    ctx.beginPath();
    const N = 64;
    for (let i = 0; i <= N; i++) {
      const a = i / N * TAU; // 0 = right, going clockwise (screen)
      const ca = Math.cos(a), sa = Math.sin(a);
      let r = 1 + 0.12*(noise1(a*3 + time*3 + seed) - 0.5);
      if (sa < 0.2) { // upper half -> tongues
        const up = Math.min(1, (0.2 - sa));
        const sp = Math.pow(Math.max(0, Math.sin(a*tongues + time*(6+seed%3) + seed)), 3);
        r += up * (0.25 + sp*amp + 0.25*noise1(a*7 - time*5 + seed));
      }
      const px = cx + ca*w*r*(sa < 0 ? 0.85 : 1), py = cy + sa*h*r*(sa < 0 ? 1.25 : 0.65);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  }

  // ch: { parts:[], lastLight, ... } per-character fx state
  function auraBack(ctx, x, y, sc, t, time, moving, ch, P){
    const A = ch.A || auraStyle(t), tier = tierOf(t), sub = subOf(t);
    const k = (A.size + sub*0.012*Math.min(tier+1, 10)) * sc * (moving ? 1.08 : 1);
    const fl = (P.float||0)*sc;
    const cx = x, cy = y - fl - 34*sc, w = 30*k, h = 46*k;
    const intensity = Math.min(1, A.alpha * (0.55 + sub/40));
    const hue = A.rainbow ? (time*90) % 360 : A.h, ohue = A.rainbow ? (time*90+60) % 360 : A.oh;
    ctx.save();
    // ground glow
    ctx.globalCompositeOperation = A.void ? 'source-over' : 'lighter';
    let g = ctx.createRadialGradient(x, y, 0, x, y, w*2.2);
    g.addColorStop(0, A.void ? 'rgba(10,0,20,0.55)' : hsl(hue, A.s, A.l, 0.35*intensity)); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, w*2.2, w*2.2*SQ, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    // cracks
    if (A.cracks) {
      ctx.strokeStyle = hsl(5, 100, 55, 0.6); ctx.lineWidth = 2*sc; ctx.shadowColor = '#f00'; ctx.shadowBlur = 10;
      for (let i = 0; i < 7; i++) { const a = i/7*TAU + 0.3; let px = x, py = y; ctx.beginPath(); ctx.moveTo(px, py);
        for (let j = 1; j <= 4; j++) { const rr = j*w*0.55; px = x + Math.cos(a + (hash(i,j)-0.5)*0.6)*rr; py = y + Math.sin(a + (hash(i,j)-0.5)*0.6)*rr*SQ; ctx.lineTo(px, py); } ctx.stroke(); }
      ctx.shadowBlur = 0;
    }
    // shockwave pulse
    if (A.pulse && !moving) {
      const ph = (time*0.7) % 1; ctx.strokeStyle = hsl(hue, A.s, A.l, (1-ph)*0.5*intensity); ctx.lineWidth = 3*sc;
      ctx.beginPath(); ctx.ellipse(x, y, w*(0.6+ph*3), w*(0.6+ph*3)*SQ, 0, 0, TAU); ctx.stroke();
    }
    // void disc
    if (A.void) {
      ctx.globalCompositeOperation = 'source-over';
      const vr = w*1.55; const vg = ctx.createRadialGradient(cx, cy, vr*0.2, cx, cy, vr);
      vg.addColorStop(0, 'rgba(0,0,0,0.95)'); vg.addColorStop(0.75, 'rgba(10,0,25,0.85)'); vg.addColorStop(0.92, hsl(ohue, 100, 60, 0.7)); vg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(cx, cy, vr, 0, TAU); ctx.fill();
      ctx.strokeStyle = hsl(ohue, 100, 70, 0.6); ctx.lineWidth = 2*sc;
      ctx.beginPath(); ctx.ellipse(cx, cy, vr*1.25, vr*0.25, time*0.3, 0, TAU); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
    }
    // rays
    if (A.rays) {
      const n = 14, rr = h*2.6;
      for (let i = 0; i < n; i++) { const a = i/n*TAU + time*0.25; ctx.fillStyle = hsl(A.rainbow ? (hue + i*25)%360 : 48, 100, 80, 0.10*intensity);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a-0.07)*rr, cy + Math.sin(a-0.07)*rr); ctx.lineTo(cx + Math.cos(a+0.07)*rr, cy + Math.sin(a+0.07)*rr); ctx.fill(); }
    }
    // light pillar
    if (A.pillar) { const pg = ctx.createLinearGradient(0, cy - h*6, 0, y); pg.addColorStop(0, 'rgba(255,250,220,0)'); pg.addColorStop(1, hsl(50, 100, 85, 0.25*intensity));
      ctx.fillStyle = pg; ctx.fillRect(cx - w*0.5, cy - h*6, w, y - (cy - h*6)); }
    // nebula
    if (A.nebula) { for (let i = 0; i < 3; i++) { const a = time*0.4 + i*2.1; const ng = ctx.createRadialGradient(cx + Math.cos(a)*w*0.6, cy + Math.sin(a)*h*0.4, 0, cx + Math.cos(a)*w*0.6, cy + Math.sin(a)*h*0.4, w*1.5);
      ng.addColorStop(0, hsl([280, 200, 320][i], 90, 60, 0.18)); ng.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = ng; ctx.fillRect(cx - w*3, cy - h*3, w*6, h*6); } }
    // wings
    if (A.wings) {
      ctx.strokeStyle = hsl(48, 100, 88, 0.55*intensity); ctx.lineWidth = 2.2*sc;
      const flap = Math.sin(time*1.8)*0.12;
      for (const side of [-1, 1]) for (let i = 0; i < 9; i++) {
        const a = -Math.PI/2 + side*(0.35 + i*0.13 + flap); const len = h*(1.9 - i*0.11);
        ctx.beginPath(); ctx.moveTo(cx + side*4*sc, cy - h*0.25); ctx.quadraticCurveTo(cx + side*len*0.5, cy - h*0.9 - len*0.2 + i*6*sc, cx + Math.cos(a)*len*1.2*side*side + side*len*0.35, cy - h*0.25 + Math.sin(a)*len*0.5 + i*7*sc); ctx.stroke();
      }
    }
    // flame layers
    const layers = [ [1.35, 0.3], [1.0, 0.45], [0.72, 0.6] ];
    if (A.dual) { // v1.4 paradox: two-colour split aura
      layers.forEach(([s, a], i) => { for (const side of [-1, 1]) { ctx.save(); ctx.beginPath(); ctx.rect(side < 0 ? cx - 1e4 : cx, cy - 1e4, 1e4, 2e4); ctx.clip();
        flameShape(ctx, cx, cy, w*s, h*s, time*(1 + i*0.25)*(side < 0 ? 1 : -1), A.tongues, i*1.7 + (side < 0 ? 0 : 5), 0.65 + Math.min(tier, 10)*0.06);
        const hh = side < 0 ? A.h : A.h2; const fg = ctx.createRadialGradient(cx, cy + h*0.15, 0, cx, cy, h*s*1.9);
        fg.addColorStop(0, hsl(hh, 100, 70, a*0.15)); fg.addColorStop(0.45, hsl(hh, 100, 66, a*0.95*intensity)); fg.addColorStop(0.8, hsl(hh, 100, 45, a*0.4)); fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg; ctx.fill(); ctx.restore(); } });
    } else
    layers.forEach(([s, a], i) => {
      flameShape(ctx, cx, cy, w*s, h*s, time*(1 + i*0.25), A.tongues, i*1.7 + (ch.seed||0), 0.55 + Math.min(tier, 10)*0.06);
      const fg = ctx.createRadialGradient(cx, cy + h*0.15, 0, cx, cy, h*s*1.9);
      const bright = A.l > 80 ? 0.55 : 1;
      if (A.darkCore) { fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(0.35, hsl(hue, A.s, 45, a*intensity)); fg.addColorStop(1, hsl(ohue, A.os, 20, 0)); }
      else if (A.void) { fg.addColorStop(0, hsl(ohue, 100, 70, a*0.5*intensity)); fg.addColorStop(1, hsl(hue, 100, 30, 0)); }
      else { fg.addColorStop(0, hsl(hue, A.s, A.l, a*0.12*intensity*bright)); fg.addColorStop(0.3, hsl(hue, A.s, Math.min(95, A.l + 10), a*0.55*intensity*bright));
        fg.addColorStop(0.5, hsl(ohue, A.os, A.l, a*0.95*intensity*bright)); fg.addColorStop(0.8, hsl(ohue, A.os, A.l*0.7, a*0.4*intensity*bright)); fg.addColorStop(1, hsl(ohue, A.os, A.l*0.6, 0)); }
      ctx.fillStyle = fg; ctx.fill();
    });
    // dark flame core for void tiers
    if (A.void || A.darkCore) {
      ctx.globalCompositeOperation = 'source-over';
      flameShape(ctx, cx, cy + h*0.05, w*0.85, h*0.85, time*1.3, A.tongues, 9 + (ch.seed||0), 0.7);
      ctx.fillStyle = A.void ? 'rgba(5,0,12,0.55)' : 'rgba(20,0,0,0.35)'; ctx.fill();
      ctx.strokeStyle = hsl(ohue, 100, 65, 0.7); ctx.lineWidth = 1.5*sc; ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
    }
    // halo
    if (A.halo) { ctx.strokeStyle = hsl(A.rainbow ? hue : 48, 100, 80, 0.85); ctx.lineWidth = 3*sc; ctx.shadowColor = '#ffe9a0'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.ellipse(cx, cy - h*0.95, 13*sc, 4*sc, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    // rings (transcendent)
    if (A.rings) for (let i = 0; i < 3; i++) { const ph = ((time*0.5 + i/3) % 1); ctx.strokeStyle = hsl(190, 100, 80, (1-ph)*0.6); ctx.lineWidth = 2*sc;
      ctx.beginPath(); ctx.ellipse(cx, cy, w*(0.8+ph*2.4), h*(0.25+ph*0.8), (i-1)*0.5, 0, TAU); ctx.stroke(); }
    // stars orbit back half
    if (A.stars) orbitStars(ctx, cx, cy, w, h, time, sc, true);
    if (A.infinity) infinity(ctx, cx, cy, w, h, time, sc, hue, true);
    if (R.auraExtra) R.auraExtra(ctx, A, cx, cy, w, h, sc, time, hue, true, x, y);
    ctx.restore();
    // particles
    fxParticles(ctx, x, y, cx, cy, w, h, sc, A, time, moving, ch, hue, intensity);
  }

  function auraFront(ctx, x, y, sc, t, time, moving, ch, P){
    const A = ch.A || auraStyle(t), tier = tierOf(t), sub = subOf(t);
    const k = (A.size + sub*0.012*Math.min(tier+1, 10)) * sc * (moving ? 1.08 : 1);
    const fl = (P.float||0)*sc, cx = x, cy = y - fl - 34*sc, w = 30*k, h = 46*k;
    const hue = A.rainbow ? (time*90) % 360 : A.h;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // thin front flame veil
    flameShape(ctx, cx, cy + h*0.1, w*0.75, h*0.7, time*1.6, A.tongues, 3 + (ch.seed||0), 0.4);
    ctx.fillStyle = hsl(hue, A.s, Math.min(95, A.l + 10), 0.10 * A.alpha); ctx.fill();
    if (A.stars) orbitStars(ctx, cx, cy, w, h, time, sc, false);
    if (A.infinity) infinity(ctx, cx, cy, w, h, time, sc, hue, false);
    if (R.auraExtra) R.auraExtra(ctx, A, cx, cy, w, h, sc, time, hue, false, x, y);
    // lightning
    const lightningOn = A.lightning || (A.lightningFrom && sub >= A.lightningFrom);
    if (lightningOn) {
      if (!ch.bolts || time - ch.boltT > 0.09) { ch.boltT = time; ch.bolts = []; const nb = 1 + Math.floor(Math.random()*(2 + tier/3));
        for (let b = 0; b < nb; b++) { const pts = []; let px = cx + rnd(-w, w), py = cy + rnd(-h, h*0.4); for (let i = 0; i < 6; i++) { pts.push([px, py]); px += rnd(-12, 12)*sc; py += rnd(-14, 14)*sc; } ch.bolts.push(pts); } }
      ctx.strokeStyle = A.h > 330 || A.h < 20 ? 'rgba(255,80,80,0.9)' : (tier === 2 ? 'rgba(180,230,255,0.95)' : hsl(hue, 100, 85, 0.9));
      ctx.lineWidth = 1.6*sc; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 8;
      for (const pts of ch.bolts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
      ctx.shadowBlur = 0;
    }
    if (A.runes) { ctx.font = `${12*sc}px serif`; ctx.fillStyle = hsl(A.rainbow ? hue : 285, 100, 75, 0.8); ctx.textAlign = 'center';
      const R_ = ['卍','∞','Ω','玄','霸','氣','無','虛','☯','神'];
      for (let i = 0; i < 10; i++) { const a = time*0.6 + i/10*TAU; ctx.fillText(R_[i], cx + Math.cos(a)*w*1.6, cy + Math.sin(a)*w*1.6*0.35 - h*0.2); } }
    if (A.glitch && Math.random() < 0.25) { for (let i = 0; i < 3; i++) { ctx.fillStyle = `rgba(${Math.random()<0.5?'0,255,255':'255,0,120'},0.25)`; ctx.fillRect(cx + rnd(-w, w), cy + rnd(-h, h), rnd(10, 40)*sc, rnd(2, 6)*sc); } }
    ctx.restore();
  }

  function orbitStars(ctx, cx, cy, w, h, time, sc, back){
    for (let i = 0; i < 9; i++) { const a = time*(0.8 + (i%3)*0.3) + i*0.7; const s = Math.sin(a); if ((s < 0) !== back) continue;
      const px = cx + Math.cos(a)*w*1.5, py = cy + s*w*0.45 + (i%3 - 1)*h*0.35; const r = (1.5 + (i%3))*sc*(back ? 0.7 : 1.1);
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#bcd'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); }
    ctx.shadowBlur = 0;
  }
  function infinity(ctx, cx, cy, w, h, time, sc, hue, back){
    ctx.lineWidth = 2.5*sc;
    for (let i = 0; i < 60; i++) { const t0 = i/60*TAU + time; const d = 1 + Math.sin(t0)**2;
      const px = cx + w*1.6*Math.cos(t0)/d, pz = Math.sin(t0)*Math.cos(t0)/d; const py = cy - h*0.1 + pz*w*0.9;
      if ((Math.sin(t0*0.5 + time) < 0) !== back) continue;
      ctx.fillStyle = hsl((hue + i*6) % 360, 100, 70, 0.8); ctx.fillRect(px - sc, py - sc, 2.5*sc, 2.5*sc); }
  }

  function fxParticles(ctx, x, y, cx, cy, w, h, sc, A, time, moving, ch, hue, intensity){
    ch.parts = ch.parts || [];
    const rate = (A.embers || 0.5) * (moving ? 1.5 : 1) * (A.inward ? 2 : 1);
    if (Math.random() < rate * 0.6) {
      if (A.inward) { const a = rnd(0, TAU), r = w*2.5; ch.parts.push({ x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r*0.7, vx: 0, vy: 0, life: 1, in: 1 }); }
      else ch.parts.push({ x: cx + rnd(-w*0.8, w*0.8), y: y - rnd(0, h*0.3), vx: rnd(-10, 10), vy: -rnd(40, 90)*(1 + A.size*0.3), life: 1 });
    }
    if ((A.petals || A.frost) && Math.random() < 0.5) ch.parts.push({ x: cx + rnd(-w*1.6, w*1.6), y: cy - h*1.4, vx: rnd(-20, 20), vy: rnd(25, 55), life: 1.4, kind: A.petals ? 'petal' : 'flake', rot: rnd(0, 6) });
    if (A.wisps) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const ph = (time*0.9 + i/9) % 1, wx = cx + Math.sin(i*2.3 + time*0.7)*w*0.9, wy = cy + h*0.6 - ph*h*2;
        ctx.strokeStyle = hsl(i%2 ? A.oh : A.h, A.s + 20, 88, (1 - ph)*0.7); ctx.lineWidth = 2*sc; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + Math.sin(time*3 + i)*6*sc, wy - 14*sc, wx, wy - 28*sc); ctx.stroke(); }
      ctx.restore(); }
    ctx.save(); ctx.globalCompositeOperation = A.inward ? 'source-over' : 'lighter';
    for (let i = ch.parts.length - 1; i >= 0; i--) { const p = ch.parts[i];
      if (p.kind) { p.x += p.vx/60 + Math.sin(time*2 + i)*0.4; p.y += p.vy/60; p.life -= 0.012; p.rot += 0.05; ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.kind === 'petal' ? `rgba(255,180,210,${Math.min(1, p.life)})` : `rgba(220,245,255,${Math.min(1, p.life)})`;
        if (p.kind === 'petal') { ctx.beginPath(); ctx.ellipse(0, 0, 4*sc, 2.2*sc, 0, 0, TAU); ctx.fill(); } else { ctx.fillRect(-2*sc, -0.6*sc, 4*sc, 1.2*sc); ctx.fillRect(-0.6*sc, -2*sc, 1.2*sc, 4*sc); }
        ctx.restore(); if (p.life <= 0) ch.parts.splice(i, 1); continue; }
      if (p.in) { p.x += (cx - p.x)*0.06; p.y += (cy - p.y)*0.06; p.life -= 0.02; ctx.fillStyle = hsl(A.oh, 100, 65, p.life); }
      else { p.x += p.vx/60; p.y += p.vy/60; p.life -= 0.018; ctx.fillStyle = hsl(A.rainbow ? (hue + i*20)%360 : A.oh, A.os, Math.min(95, A.l + 15), p.life*intensity); }
      ctx.fillRect(p.x - 1.5*sc, p.y - 1.5*sc, 3*sc, 3*sc);
      if (p.life <= 0) ch.parts.splice(i, 1); }
    if (ch.parts.length > 110) ch.parts.splice(0, ch.parts.length - 110);
    if (A.sparks && Math.random() < 0.3) { ctx.strokeStyle = 'rgba(255,255,210,0.9)'; ctx.lineWidth = 1.2*sc; const sx = cx + rnd(-w, w), sy = cy + rnd(-h, h*0.5); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + rnd(-6, 6)*sc, sy + rnd(-6, 6)*sc); ctx.stroke(); }
    ctx.restore();
  }

  // draw full character (aura + stickman + nametag)
  function character(ctx, x, y, sc, c, time){
    const t = c.t, tier = tierOf(t); c.fx = c.fx || {};
    c.fx.A = auraStyle(t, c.as);
    const SK = (typeof SKINS !== 'undefined' && c.sk) ? (SKINS.find(k => k.id === c.sk) || null) : null;
    const P = pose(tier, time + (c.seed||0), c.moving, c.phase||0, subOf(t));
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, 16*sc*(1 - Math.min(0.5, (P.float||0)/120)), 6*sc, 0, 0, TAU); ctx.fill();
    auraBack(ctx, x, y, sc, t, time + (c.seed||0), c.moving, c.fx, P);
    const A = c.fx.A;
    const isVoid = A.void && t <= MAX_TITLE && !(SK && SK.body);
    ctx.save(); if (c.face < 0) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); }
    if (A.afterimage) { ctx.save(); for (let k = 1; k <= 2; k++) { const o = Math.sin(time*1.7 + k*2)*10*k*sc; ctx.globalAlpha = 0.28/k;
      stickman(ctx, x + o, y - Math.cos(time*1.3 + k)*4*sc, sc, P, { color: hsl(k === 1 ? A.h : (A.h2 || A.oh), 100, 70), outline: false, headFill: 'rgba(0,0,0,0)' }); } ctx.restore(); }
    if (A.glitch && Math.random() < 0.3) { const o = rnd(2, 5)*sc; stickman(ctx, x - o, y, sc, P, { color: 'rgba(0,255,255,0.5)' }); stickman(ctx, x + o, y, sc, P, { color: 'rgba(255,0,140,0.5)' }); }
    const eye = tier >= 2 ? (isVoid ? '#fff' : auraColor(t, time, 80, A)) : null;
    const acc = SK ? SK.acc : [], hair = tier >= 2 ? auraColor(t, time, 70, A) : '#1a1a1a';
    const MR = c.mirror; // v1.5: your Reflection (dark copy, red eyes, a smile)
    const g = stickman(ctx, x, y, sc, P, { outlineColor: MR ? 'rgba(255,40,70,0.9)' : SK && SK.outline ? SK.outline : (isVoid ? 'rgba(200,140,255,0.8)' : null), color: MR ? '#0a0a10' : SK && SK.body ? SK.body : (isVoid ? '#0a0010' : (tier >= 8 ? '#fffbe8' : '#f2f2f2')),
      headFill: MR ? '#000' : isVoid ? '#000' : '#121212', eyes: MR ? '#ff2a40' : (acc.includes('shades') || acc.includes('fox')) ? null : eye, glow: MR ? '#ff2040' : tier >= 3 ? auraColor(t, time, null, A) : null, smile: c.smile || MR,
      before: acc.length && R.skinBack ? geo => R.skinBack(ctx, geo, acc, time, hair) : null, after: acc.length && R.skinFront ? geo => R.skinFront(ctx, geo, acc, time, hair, eye) : null });
    ctx.restore();
    auraFront(ctx, x, y, sc, t, time + (c.seed||0), c.moving, c.fx, P);
    if (A.shake && !c.moving) c.shake = 1.5; else c.shake = 0;
    return g;
  }

  // ---------------- World ----------------
  function groundColor(wx, wy){
    const d = Math.hypot(wx, wy), ang = Math.atan2(wy, wx);
    const biome = Math.floor(((ang + Math.PI) / TAU) * 6) % 6;
    const n = hash(Math.floor(wx/100), Math.floor(wy/100));
    const base = [ [28, 22, 18], [16, 24, 30], [30, 26, 16], [22, 16, 30], [16, 28, 22], [30, 16, 18] ][biome];
    const k = 1 - Math.min(0.55, d/9000) + (n - 0.5)*0.12;
    const center = d < 700 ? (1 - d/700) : 0;
    return `rgb(${Math.floor(base[0]*k + 20*center)},${Math.floor(base[1]*k + 18*center)},${Math.floor(base[2]*k + 26*center)})`;
  }

  function drawGround(ctx, cam, W, H){
    const T = 100, z = cam.z;
    const x0 = Math.floor((cam.x - W/2/z)/T) - 1, x1 = Math.floor((cam.x + W/2/z)/T) + 1;
    const y0 = Math.floor((cam.y - H/2/z/SQ)/T) - 1, y1 = Math.floor((cam.y + H/2/z/SQ)/T) + 1;
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      const wx = tx*T, wy = ty*T; if (Math.abs(wx) > WORLD || Math.abs(wy) > WORLD) { ctx.fillStyle = '#050307'; }
      else ctx.fillStyle = groundColor(wx, wy);
      const sx = (wx - cam.x)*z + W/2, sy = (wy - cam.y)*z*SQ + H/2;
      ctx.fillRect(Math.floor(sx), Math.floor(sy), Math.ceil(T*z) + 1, Math.ceil(T*z*SQ) + 1);
    }
    // grid lines for 2.5D feel
    ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let tx = x0; tx <= x1; tx++) { const sx = (tx*T - cam.x)*z + W/2; ctx.moveTo(sx, 0); ctx.lineTo(sx, H); }
    for (let ty = y0; ty <= y1; ty++) { const sy = (ty*T - cam.y)*z*SQ + H/2; ctx.moveTo(0, sy); ctx.lineTo(W, sy); }
    ctx.stroke();
  }

  const WORLD = 4000;
  function genDecor(){
    const out = []; let s = 1337; const r = () => (s = (s*16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 900; i++) { const x = (r()*2 - 1)*WORLD, y = (r()*2 - 1)*WORLD; if (Math.hypot(x, y) < 350) continue;
      const ty = ['rock','rock','tree','pillar','crystal','grass','grass','skull','torch'][Math.floor(r()*9)]; out.push({ x, y, ty, s: 0.6 + r()*0.9, h: r() }); }
    return out;
  }

  function decor(ctx, d, sx, sy, z, time){
    const s = d.s*z;
    switch (d.ty) {
      case 'rock': ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(sx, sy, 22*s, 8*s, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = `hsl(${20 + d.h*30},8%,${22 + d.h*10}%)`; ctx.beginPath(); ctx.moveTo(sx - 20*s, sy); ctx.lineTo(sx - 14*s, sy - 18*s); ctx.lineTo(sx + 2*s, sy - 26*s); ctx.lineTo(sx + 18*s, sy - 12*s); ctx.lineTo(sx + 20*s, sy); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(sx - 14*s, sy - 18*s); ctx.lineTo(sx + 2*s, sy - 26*s); ctx.lineTo(sx, sy - 10*s); ctx.fill(); break;
      case 'tree': ctx.strokeStyle = '#1b1411'; ctx.lineWidth = 5*s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - 60*s);
        ctx.moveTo(sx, sy - 38*s); ctx.lineTo(sx - 20*s, sy - 62*s); ctx.moveTo(sx, sy - 48*s); ctx.lineTo(sx + 18*s, sy - 72*s); ctx.moveTo(sx - 20*s, sy - 62*s); ctx.lineTo(sx - 28*s, sy - 66*s); ctx.stroke(); break;
      case 'pillar': ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(sx, sy, 16*s, 6*s, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#3a3540'; ctx.fillRect(sx - 11*s, sy - (50 + d.h*50)*s, 22*s, (50 + d.h*50)*s); ctx.fillStyle = '#4c4652'; ctx.fillRect(sx - 14*s, sy - (54 + d.h*50)*s, 28*s, 7*s);
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(sx + 3*s, sy - (50 + d.h*50)*s, 8*s, (50 + d.h*50)*s); break;
      case 'crystal': { const hue = 180 + d.h*120; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy - 15*s, 0, sx, sy - 15*s, 40*s);
        g.addColorStop(0, `hsla(${hue},100%,60%,0.25)`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 40*s, sy - 55*s, 80*s, 80*s); ctx.restore();
        ctx.fillStyle = `hsla(${hue},80%,55%,0.85)`; ctx.beginPath(); ctx.moveTo(sx - 7*s, sy); ctx.lineTo(sx, sy - 34*s); ctx.lineTo(sx + 7*s, sy); ctx.fill();
        ctx.beginPath(); ctx.moveTo(sx + 3*s, sy); ctx.lineTo(sx + 12*s, sy - 20*s); ctx.lineTo(sx + 14*s, sy); ctx.fill(); break; }
      case 'grass': ctx.strokeStyle = 'rgba(90,110,70,0.35)'; ctx.lineWidth = 1.5*z; ctx.beginPath(); for (let i = -2; i <= 2; i++) { ctx.moveTo(sx + i*3*s, sy); ctx.lineTo(sx + i*5*s + Math.sin(time*2 + d.x)*2, sy - 10*s); } ctx.stroke(); break;
      case 'skull': ctx.fillStyle = '#bdb5a5'; ctx.beginPath(); ctx.arc(sx, sy - 5*s, 5*s, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.fillRect(sx - 3*s, sy - 6*s, 2*s, 2*s); ctx.fillRect(sx + 1*s, sy - 6*s, 2*s, 2*s); break;
      case 'torch': { ctx.fillStyle = '#2a1d14'; ctx.fillRect(sx - 2*s, sy - 34*s, 4*s, 34*s); const f = 0.8 + Math.sin(time*13 + d.x)*0.2;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy - 38*s, 0, sx, sy - 38*s, 70*s*f); g.addColorStop(0, 'rgba(255,150,50,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(sx - 70*s, sy - 108*s, 140*s, 140*s); ctx.fillStyle = 'rgba(255,200,90,0.9)'; ctx.beginPath(); ctx.ellipse(sx, sy - 39*s, 3*s, 6*s*f, 0, 0, TAU); ctx.fill(); ctx.restore(); break; }
    }
  }

  function gate(ctx, sx, sy, z, time, active){
    const s = z;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(sx, sy, 130*s, 40*s, 0, 0, TAU); ctx.fill();
    // portal swirl
    ctx.save(); ctx.translate(sx, sy - 95*s);
    const pg = ctx.createRadialGradient(0, 0, 5*s, 0, 0, 75*s); pg.addColorStop(0, active ? '#ff2a2a' : '#5a0010'); pg.addColorStop(0.5, '#200008'); pg.addColorStop(1, '#000');
    ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(0, 0, 58*s, 88*s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = active ? 'rgba(255,60,60,0.55)' : 'rgba(140,0,30,0.4)'; ctx.lineWidth = 2*s;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); for (let a = 0; a < 5; a += 0.15) { const r = a*11*s; const px = Math.cos(a*2 + time*(1.5 + i*0.1) + i)*r*0.66, py = Math.sin(a*2 + time*(1.5 + i*0.1) + i)*r;
      a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    // eye in the portal
    const blink = Math.abs(Math.sin(time*0.7)) > 0.97 ? 0.1 : 1;
    ctx.fillStyle = active ? '#ffdede' : '#661020'; ctx.beginPath(); ctx.ellipse(0, 0, 14*s, 7*s*blink, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, 0, 2.5*s, 6*s*blink, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // stone arch
    ctx.fillStyle = '#2b2630'; ctx.strokeStyle = '#141016'; ctx.lineWidth = 3*s;
    ctx.beginPath(); ctx.moveTo(sx - 95*s, sy); ctx.lineTo(sx - 95*s, sy - 120*s); ctx.quadraticCurveTo(sx - 90*s, sy - 215*s, sx, sy - 220*s); ctx.quadraticCurveTo(sx + 90*s, sy - 215*s, sx + 95*s, sy - 120*s);
    ctx.lineTo(sx + 95*s, sy); ctx.lineTo(sx + 68*s, sy); ctx.lineTo(sx + 68*s, sy - 110*s); ctx.quadraticCurveTo(sx + 62*s, sy - 190*s, sx, sy - 192*s); ctx.quadraticCurveTo(sx - 62*s, sy - 190*s, sx - 68*s, sy - 110*s); ctx.lineTo(sx - 68*s, sy); ctx.closePath(); ctx.fill(); ctx.stroke();
    // horns / skulls on arch
    ctx.fillStyle = '#cfc6b4'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx + k*80*s, sy - 170*s); ctx.quadraticCurveTo(sx + k*130*s, sy - 210*s, sx + k*120*s, sy - 260*s); ctx.quadraticCurveTo(sx + k*110*s, sy - 205*s, sx + k*70*s, sy - 185*s); ctx.fill(); }
    ctx.fillStyle = active ? '#ff3030' : '#801020'; ctx.font = `bold ${16*s}px serif`; ctx.textAlign = 'center'; ctx.fillText('獄', sx, sy - 200*s);
    if (active) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy - 100*s, 0, sx, sy - 100*s, 220*s); g.addColorStop(0, `rgba(255,0,0,${0.18 + Math.sin(time*4)*0.08})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 220*s, sy - 320*s, 440*s, 440*s); ctx.restore(); }
  }

  function well(ctx, sx, sy, z, time, found){
    const s = z; ctx.save();
    ctx.fillStyle = '#29242c'; ctx.beginPath(); ctx.ellipse(sx, sy, 70*s, 70*s*SQ, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 60*s); g.addColorStop(0, `rgba(120,255,220,${found ? 0.6 : 0.35})`); g.addColorStop(1, 'rgba(0,80,90,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, sy, 60*s, 60*s*SQ, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 6; i++) { const ph = (time*0.4 + i/6) % 1; ctx.fillStyle = `rgba(150,255,230,${(1-ph)*0.6})`; ctx.fillRect(sx + Math.sin(i*2.3)*40*s, sy - ph*90*s, 3*s, 3*s); }
    ctx.restore();
  }

  function stele(ctx, sx, sy, z, time, taken, near){
    const s = z; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(sx, sy, 22*s, 7*s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = taken ? '#3b3640' : '#45404e'; ctx.beginPath(); ctx.moveTo(sx - 16*s, sy); ctx.lineTo(sx - 16*s, sy - 48*s); ctx.quadraticCurveTo(sx, sy - 62*s, sx + 16*s, sy - 48*s); ctx.lineTo(sx + 16*s, sy); ctx.fill();
    ctx.fillStyle = taken ? 'rgba(120,110,140,0.5)' : `rgba(255,210,120,${0.5 + Math.sin(time*3)*0.3 + (near ? 0.3 : 0)})`; ctx.font = `${9*s}px serif`; ctx.textAlign = 'center';
    ctx.fillText('霸', sx, sy - 38*s); ctx.fillText('氣', sx, sy - 26*s); ctx.fillText('碑', sx, sy - 14*s);
  }

  // ---------------- Bosses ----------------
  function boss(ctx, id, cx, cy, S, time, v){
    // v: {hue, hurt, atk, g, target:[x,y]}
    const jit = v.hurt > 0 ? rnd(-6, 6) : 0;
    ctx.save(); ctx.translate(cx + jit, cy);
    const hurtFlash = v.hurt > 0 && Math.random() < 0.5;
    switch (id) {
      case 'hollow': bHollow(ctx, S, time, v); break;
      case 'eyes': bEyes(ctx, S, time, v); break;
      case 'king': bKing(ctx, S, time, v); break;
      case 'seraph': bSeraph(ctx, S, time, v); break;
      case 'maw': bMaw(ctx, S, time, v); break;
      case 'smile': bSmile(ctx, S, time, v); break;
      case 'judge': bJudge(ctx, S, time, v); break;
      case 'glitch': bGlitch(ctx, S, time, v); break;
      case 'unmaker': bUnmaker(ctx, S, time, v); break;
      case 'nameless': bNameless(ctx, S, time, v); break;
      default: if (R.extra && R.extra[id]) { R.extra[id](ctx, S, time, v); break; } { const ids = ['hollow','eyes','king','seraph','maw','smile','judge','glitch','unmaker','nameless']; const k = Math.floor(time/1.5) % ids.length;
        ctx.globalAlpha = 0.85; boss(ctx, ids[k], 0, 0, S, time, v); ctx.globalAlpha = 0.4; boss(ctx, ids[(k+3)%ids.length], 0, 0, S*1.1, time, v); ctx.globalAlpha = 1; }
    }
    if (hurtFlash) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,120,40,0.25)'; ctx.beginPath(); ctx.arc(0, -S*0.5, S*0.6, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function eye(ctx, x, y, r, time, tx, ty, color){
    const bl = (Math.sin(time*1.3 + x*0.1 + y*0.07) > 0.985) ? 0.1 : 1;
    ctx.fillStyle = '#e8e0d0'; ctx.beginPath(); ctx.ellipse(x, y, r, r*0.65*bl, 0, 0, TAU); ctx.fill();
    const a = Math.atan2(ty - y, tx - x); ctx.fillStyle = color || '#7a0000';
    ctx.beginPath(); ctx.arc(x + Math.cos(a)*r*0.35, y + Math.sin(a)*r*0.2, r*0.42*bl, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x + Math.cos(a)*r*0.4, y + Math.sin(a)*r*0.22, r*0.2*bl, 0, TAU); ctx.fill();
  }
  function bHollow(ctx, S, time, v){
    const twitch = Math.sin(time*23) > 0.93 ? rnd(-0.3, 0.3) : 0;
    const bl = ctx.createRadialGradient(0, -S*0.7, 0, 0, -S*0.7, S*0.75); bl.addColorStop(0, `hsla(${v.hue},30%,30%,0.55)`); bl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = bl; ctx.fillRect(-S, -S*1.5, S*2, S*1.6);
    ctx.fillStyle = '#0d0b0e'; ctx.strokeStyle = '#2a2530'; ctx.lineWidth = 2;
    // legs
    ctx.beginPath(); ctx.moveTo(-S*0.08, 0); ctx.lineTo(-S*0.05, -S*0.55); ctx.lineTo(S*0.05, -S*0.55); ctx.lineTo(S*0.08, 0); ctx.lineTo(S*0.03, 0); ctx.lineTo(0, -S*0.4); ctx.lineTo(-S*0.03, 0); ctx.fill();
    // torso
    ctx.beginPath(); ctx.moveTo(-S*0.07, -S*0.55); ctx.lineTo(-S*0.13, -S*1.05); ctx.lineTo(S*0.13, -S*1.05); ctx.lineTo(S*0.07, -S*0.55); ctx.fill();
    // ribs
    ctx.strokeStyle = 'rgba(200,190,180,0.25)'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, -S*(0.95 - i*0.07), S*0.09, 0.2, Math.PI - 0.2); ctx.stroke(); }
    // long arms to floor
    ctx.strokeStyle = '#0d0b0e'; ctx.lineWidth = S*0.035; ctx.lineCap = 'round';
    for (const k of [-1, 1]) { const sw = Math.sin(time*0.8 + k)*0.05 + (v.atk > 0 ? -k*0.6*v.atk : 0);
      ctx.beginPath(); ctx.moveTo(k*S*0.13, -S*1.02); ctx.lineTo(k*S*0.24, -S*0.55); ctx.lineTo(k*S*(0.28 + sw), S*0.02);
      ctx.stroke(); ctx.lineWidth = S*0.01; for (let f = -2; f <= 2; f++) { ctx.beginPath(); ctx.moveTo(k*S*(0.28 + sw), S*0.02); ctx.lineTo(k*S*(0.28 + sw) + f*S*0.02, S*0.12); ctx.stroke(); } ctx.lineWidth = S*0.035; }
    // head
    ctx.save(); ctx.translate(0, -S*1.15); ctx.rotate(twitch + Math.sin(time*0.5)*0.12);
    ctx.fillStyle = '#d8d2c8'; ctx.beginPath(); ctx.ellipse(0, -S*0.08, S*0.09, S*0.14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, -S*0.06, S*0.065, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(-S*0.025, -S*0.08, S*0.006, 0, TAU); ctx.arc(S*0.025, -S*0.08, S*0.006, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.restore();
  }
  function bEyes(ctx, S, time, v){
    const [tx, ty] = v.target || [-500, -100];
    const g = ctx.createRadialGradient(0, -S*0.5, S*0.1, 0, -S*0.5, S*0.65); g.addColorStop(0, `hsl(${v.hue},45%,22%)`); g.addColorStop(1, `hsl(${v.hue},50%,6%)`);
    // tendrils
    ctx.strokeStyle = `hsl(${v.hue},40%,14%)`; ctx.lineWidth = S*0.03; ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const a = Math.PI*0.1 + i/8*Math.PI*0.8; ctx.beginPath(); ctx.moveTo(Math.cos(a)*S*0.4, -S*0.5 + Math.sin(a)*S*0.4);
      ctx.quadraticCurveTo(Math.cos(a)*S*0.7 + Math.sin(time*2 + i)*S*0.1, -S*0.2 + Math.sin(a)*S*0.5, Math.cos(a)*S*0.6 + Math.sin(time*1.5 + i*2)*S*0.2, S*0.05); ctx.stroke(); }
    ctx.fillStyle = g; ctx.beginPath();
    for (let i = 0; i <= 90; i++) { const a = i/90*TAU; const r = S*0.48*(1 + 0.08*Math.sin(a*5 + time*2) + 0.05*Math.sin(a*9 - time*3)); const px = Math.cos(a)*r, py = -S*0.5 + Math.sin(a)*r*0.9; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.fill();
    const n = 13 + Math.floor((v.g%20)/3); for (let i = 0; i < n; i++) { const a = i*2.399 + hash(i, 3)*0.5, r = (0.12 + 0.88*Math.sqrt((i + 0.5)/n))*S*0.38; eye(ctx, Math.cos(a)*r, -S*0.5 + Math.sin(a)*r*0.85, S*(0.03 + hash(i, 9)*0.06), time, tx - (0), ty); }
    eye(ctx, 0, -S*0.5, S*0.11, time*0.5, tx, ty, '#a00');
  }
  function bKing(ctx, S, time, v){
    // throne
    ctx.fillStyle = '#1a1210'; ctx.fillRect(-S*0.35, -S*1.3, S*0.7, S*1.3); ctx.fillStyle = '#26190f'; ctx.fillRect(-S*0.42, -S*0.55, S*0.84, S*0.1);
    for (const k of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.25 - S*0.06, -S*1.3); ctx.lineTo(k*S*0.25, -S*1.45); ctx.lineTo(k*S*0.25 + S*0.06, -S*1.3); ctx.fill(); }
    // robe
    ctx.fillStyle = `hsl(${v.hue + 300},40%,12%)`; ctx.beginPath(); ctx.moveTo(-S*0.2, -S*0.95); ctx.lineTo(S*0.2, -S*0.95); ctx.lineTo(S*0.3, 0);
    for (let i = 0; i < 8; i++) ctx.lineTo(S*(0.3 - i*0.075), (i%2) ? -S*0.06 : 0); ctx.lineTo(-S*0.3, 0); ctx.fill();
    // ribcage
    ctx.strokeStyle = '#b8ae98'; ctx.lineWidth = S*0.012; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(0, -S*(0.85 - i*0.06), S*0.11, S*0.03, 0, 0, Math.PI); ctx.stroke(); }
    // bony arms
    ctx.lineWidth = S*0.018; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.17, -S*0.92); ctx.lineTo(k*S*0.3, -S*0.62); ctx.lineTo(k*S*(0.2 + (v.atk>0 ? 0.25 : 0)), -S*(0.56 + (v.atk>0 ? 0.3 : 0))); ctx.stroke(); }
    // skull
    const by = -S*1.08 + Math.sin(time*0.7)*S*0.01; ctx.fillStyle = '#d6cdb6'; ctx.beginPath(); ctx.arc(0, by, S*0.12, 0, TAU); ctx.fill(); ctx.fillRect(-S*0.07, by + S*0.05, S*0.14, S*0.09);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(-S*0.045, by - S*0.01, S*0.032, S*0.04, 0, 0, TAU); ctx.ellipse(S*0.045, by - S*0.01, S*0.032, S*0.04, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ff7a10'; ctx.shadowColor = '#f60'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(-S*0.045, by - S*0.01, S*0.008, 0, TAU); ctx.arc(S*0.045, by - S*0.01, S*0.008, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#000'; ctx.lineWidth = S*0.006; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*S*0.018, by + S*0.08); ctx.lineTo(i*S*0.018, by + S*0.135); ctx.stroke(); }
    // crown
    ctx.fillStyle = '#8a6a1c'; ctx.beginPath(); ctx.moveTo(-S*0.13, by - S*0.07); for (let i = 0; i <= 6; i++) ctx.lineTo(-S*0.13 + i*S*0.0433, by - S*((i%2) ? 0.12 : 0.24)); ctx.lineTo(S*0.13, by - S*0.07); ctx.fill();
    // drips
    ctx.fillStyle = '#3a0a06'; for (let i = 0; i < 5; i++) { const ph = (time*0.5 + i*0.37) % 1; ctx.beginPath(); ctx.arc(-S*0.1 + i*S*0.05, by + S*0.15 + ph*S*0.5, S*0.008, 0, TAU); ctx.fill(); }
  }
  function bSeraph(ctx, S, time, v){
    const [tx, ty] = v.target || [-500, -100];
    // rings with eyes
    for (let r = 0; r < 2; r++) { ctx.save(); ctx.translate(0, -S*0.7); ctx.rotate(time*(r ? -0.4 : 0.3)); ctx.scale(1, r ? 0.35 : 1); ctx.strokeStyle = '#8a7240'; ctx.lineWidth = S*0.03;
      ctx.beginPath(); ctx.arc(0, 0, S*(0.45 + r*0.1), 0, TAU); ctx.stroke(); ctx.restore();
      for (let i = 0; i < 8; i++) { const a = i/8*TAU + time*(r ? -0.4 : 0.3); const rr = S*(0.45 + r*0.1); eye(ctx, Math.cos(a)*rr, -S*0.7 + Math.sin(a)*rr*(r ? 0.35 : 1), S*0.03, time + i, tx, ty, '#222'); } }
    // broken wings
    ctx.strokeStyle = '#9b958a'; ctx.lineWidth = S*0.008;
    for (const k of [-1, 1]) for (let i = 0; i < 14; i++) { const a = -Math.PI/2 + k*(0.3 + i*0.09) + Math.sin(time + i)*0.03; const len = S*(0.7 - (i%3)*0.12) * (i === 6 ? 0.4 : 1);
      const th = 0.3 + i*0.09 + Math.sin(time + i)*0.03; ctx.beginPath(); ctx.moveTo(k*S*0.05, -S*0.75); ctx.lineTo(k*S*0.05 + k*Math.sin(th)*len*1.1, -S*0.75 - Math.cos(th)*len*0.8 + (i > 9 ? S*0.35 : 0)); ctx.stroke(); }
    // body
    ctx.fillStyle = '#d9d3c7'; ctx.beginPath(); ctx.moveTo(-S*0.08, -S*0.65); ctx.lineTo(S*0.08, -S*0.65); ctx.lineTo(S*0.14, -S*0.05); ctx.lineTo(-S*0.14, -S*0.05); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -S*0.78, S*0.07, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#100'; ctx.fillRect(-S*0.045, -S*0.8, S*0.09, S*0.025);
    ctx.strokeStyle = '#000'; ctx.lineWidth = S*0.008; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k*S*0.03, -S*0.775); ctx.lineTo(k*S*0.035, -S*0.68 + Math.sin(time + k)*S*0.01); ctx.stroke(); }
    // cracked halo
    ctx.strokeStyle = '#ffd36a'; ctx.lineWidth = S*0.012; ctx.shadowColor = '#fc6'; ctx.shadowBlur = 15; ctx.beginPath(); ctx.ellipse(0, -S*0.95, S*0.12, S*0.03, 0, 0.3, Math.PI*1.6); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -S*0.97, S*0.12, S*0.03, 0, Math.PI*1.7, Math.PI*2.1); ctx.stroke(); ctx.shadowBlur = 0;
  }
  function bMaw(ctx, S, time, v){
    // tentacles
    ctx.strokeStyle = `hsl(${v.hue},40%,15%)`; ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = i/12*TAU; ctx.lineWidth = S*0.04; ctx.beginPath(); ctx.moveTo(Math.cos(a)*S*0.4, -S*0.6 + Math.sin(a)*S*0.4);
      ctx.bezierCurveTo(Math.cos(a)*S*0.7, -S*0.6 + Math.sin(a)*S*0.7, Math.cos(a + Math.sin(time + i)*0.5)*S*0.9, -S*0.6 + Math.sin(a + Math.sin(time*1.3 + i))*S*0.9, Math.cos(a + Math.sin(time*0.7 + i))*S*1.05, -S*0.6 + Math.sin(a + Math.cos(time + i))*S*1.0); ctx.stroke(); }
    ctx.fillStyle = `hsl(${v.hue},30%,10%)`; ctx.beginPath(); ctx.arc(0, -S*0.6, S*0.45, 0, TAU); ctx.fill();
    // galaxy throat
    ctx.save(); ctx.translate(0, -S*0.6); ctx.rotate(time*0.6);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S*0.28); g.addColorStop(0, '#fff'); g.addColorStop(0.15, '#c8a0ff'); g.addColorStop(0.5, '#300050'); g.addColorStop(1, '#000');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, S*0.28, 0, TAU); ctx.fill();
    for (let i = 0; i < 40; i++) { const r = hash(i, 1)*S*0.26, a = hash(i, 2)*TAU + r*0.03; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(Math.cos(a)*r, Math.sin(a)*r, 2, 2); }
    // teeth rings
    for (let ring = 0; ring < 3; ring++) { const rr = S*(0.44 - ring*0.07); const n = 22 - ring*3; ctx.rotate(ring%2 ? -time*0.2 : time*0.15);
      ctx.fillStyle = ring ? '#cdbfa8' : '#e9e0cc'; for (let i = 0; i < n; i++) { const a = i/n*TAU; ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.12)*rr, Math.sin(a - 0.12)*rr); ctx.lineTo(Math.cos(a)*(rr - S*0.09), Math.sin(a)*(rr - S*0.09)); ctx.lineTo(Math.cos(a + 0.12)*rr, Math.sin(a + 0.12)*rr); ctx.fill(); } }
    ctx.restore();
  }
  function bSmile(ctx, S, time, v){
    const tilt = Math.sin(time*0.4)*0.35;
    ctx.strokeStyle = '#d7cfc2'; ctx.lineWidth = S*0.06; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(S*0.1, -S*0.3, -S*0.1, -S*0.5, 0, -S*0.6); ctx.stroke(); // long neck
    ctx.save(); ctx.translate(0, -S*0.85); ctx.rotate(tilt);
    ctx.fillStyle = '#e4ddd2'; ctx.beginPath(); ctx.ellipse(0, 0, S*0.28, S*0.32, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-S*0.09, -S*0.1, S*0.018, 0, TAU); ctx.arc(S*0.09, -S*0.1, S*0.018, 0, TAU); ctx.fill();
    // giant smile beyond face
    const w = S*(0.4 + Math.sin(time*0.8)*0.03 + (v.atk > 0 ? 0.1 : 0));
    ctx.fillStyle = '#1a0004'; ctx.beginPath(); ctx.moveTo(-w, -S*0.02); ctx.quadraticCurveTo(0, S*0.35, w, -S*0.02); ctx.quadraticCurveTo(0, S*0.18, -w, -S*0.02); ctx.fill();
    ctx.fillStyle = '#f3ecd8'; const n = 22; for (let i = 0; i < n; i++) { const t0 = i/(n-1), x = -w + t0*2*w; const yTop = -S*0.02 + (1 - Math.pow(2*t0 - 1, 2))*S*0.09, yBot = -S*0.02 + (1 - Math.pow(2*t0 - 1, 2))*S*0.165;
      ctx.fillRect(x - S*0.008, yTop, S*0.016, (yBot - yTop)*0.45); ctx.fillRect(x - S*0.008, yBot - (yBot - yTop)*0.4, S*0.016, (yBot - yTop)*0.4); }
    ctx.restore();
  }
  function bJudge(ctx, S, time, v){
    // chains
    ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = S*0.01; for (let i = -3; i <= 3; i++) { ctx.beginPath(); for (let j = 0; j < 12; j++) { const y = -S*1.6 + j*S*0.1, x = i*S*0.18 + Math.sin(time + j*0.5 + i)*S*0.01; ctx.moveTo(x, y); ctx.ellipse(x, y, S*0.012, S*0.03, 0, 0, TAU); } ctx.stroke(); }
    // mask
    ctx.fillStyle = '#efe9df'; ctx.beginPath(); ctx.ellipse(0, -S*0.85, S*0.38, S*0.5, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = S*0.008; ctx.beginPath(); ctx.moveTo(S*0.05, -S*1.35); ctx.lineTo(S*0.02, -S*1.1); ctx.lineTo(S*0.09, -S*0.95); ctx.lineTo(S*0.03, -S*0.7); ctx.lineTo(S*0.12, -S*0.5); ctx.stroke();
    ctx.fillStyle = '#000'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k*S*0.14, -S*0.95, S*0.08, S*0.05, k*0.3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#f00'; ctx.shadowColor = '#f00'; ctx.shadowBlur = 14; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k*S*0.14, -S*0.95, S*0.012, 0, TAU); ctx.fill(); } ctx.shadowBlur = 0;
    ctx.fillStyle = '#000'; ctx.fillRect(-S*0.12, -S*0.6, S*0.24, S*0.012);
    // hands
    for (const k of [-1, 1]) { const hx = k*S*(0.62 - (v.atk > 0 ? 0.3 : 0)), hy = -S*0.55 + Math.sin(time*0.8 + k)*S*0.05;
      ctx.fillStyle = '#d8d0c4'; ctx.beginPath(); ctx.ellipse(hx, hy, S*0.12, S*0.15, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#d8d0c4'; ctx.lineWidth = S*0.04; ctx.lineCap = 'round'; for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.moveTo(hx + (f - 1.5)*S*0.05, hy - S*0.1); ctx.lineTo(hx + (f - 1.5)*S*0.06, hy - S*0.3 - (f%2)*S*0.04); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(hx - k*S*0.1, hy); ctx.lineTo(hx - k*S*0.2, hy - S*0.12); ctx.stroke(); }
  }
  function bGlitch(ctx, S, time, v){
    const P = pose(0, time, false, 0, 1);
    for (const [c, o] of [['rgba(255,0,80,0.7)', -6], ['rgba(0,255,255,0.7)', 6], ['#eee', 0]]) stickman(ctx, o + rnd(-3, 3), 0, S/60, P, { color: c, headFill: '#000', eyes: '#f00' });
    for (let i = 0; i < 8; i++) { const y = -rnd(0, S*1.1); ctx.fillStyle = `rgba(${rnd(0,255)|0},${rnd(0,255)|0},${rnd(0,255)|0},0.35)`; ctx.fillRect(rnd(-S*0.4, S*0.2), y, rnd(20, S*0.5), rnd(2, 8)); }
    ctx.font = `bold ${S*0.08}px monospace`; ctx.fillStyle = Math.random() < 0.5 ? '#f0f' : '#0ff'; ctx.textAlign = 'center'; ctx.fillText(Math.random() < 0.7 ? 'ERR0R' : 'Y0U', rnd(-20, 20), -S*1.15);
  }
  function bUnmaker(ctx, S, time, v){
    ctx.strokeStyle = '#120c06'; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const k = i < 4 ? -1 : 1, j = i % 4; const ph = time*2 + i; ctx.lineWidth = S*0.025;
      const x1 = k*S*(0.25 + j*0.05), y1 = -S*(0.9 + j*0.08 + Math.sin(ph)*0.04), x2 = k*S*(0.55 + j*0.08), y2 = -S*(0.2 - j*0.05) + Math.cos(ph)*S*0.03;
      ctx.beginPath(); ctx.moveTo(0, -S*0.6); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2 + k*S*0.05, S*0.0); ctx.stroke(); }
    ctx.fillStyle = '#1d150c'; ctx.beginPath(); ctx.ellipse(0, -S*0.6, S*0.14, S*0.22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e3d8c0'; ctx.beginPath(); ctx.ellipse(0, -S*0.9, S*0.08, S*0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.fillRect(-S*0.05, -S*0.92, S*0.1, S*0.015); ctx.fillRect(-S*0.03, -S*0.85, S*0.06, S*0.04);
    // crown of hands
    ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = S*0.012;
    for (let i = 0; i < 7; i++) { const a = -Math.PI/2 + (i - 3)*0.3, bx = Math.cos(a)*S*0.1, by = -S*0.95 + Math.sin(a)*S*0.08; const ex = Math.cos(a)*S*0.25, ey = -S*0.95 + Math.sin(a)*S*0.25;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke(); for (let f = -2; f <= 2; f++) { ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(a + f*0.25)*S*0.05, ey + Math.sin(a + f*0.25)*S*0.05 + Math.sin(time*5 + i + f)*S*0.005); ctx.stroke(); } }
  }
  function bNameless(ctx, S, time, v){
    const fake = { t: Math.min(200, v.g || 181), moving: false, fx: v.fx || (v.fx = {}), face: -1, seed: 3, smile: true };
    const sc = S/62;
    // inverted black flames
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 3; i++) { flameShape(ctx, 0, -S*0.55, S*0.5*(1.2 - i*0.25), S*0.75*(1.2 - i*0.25), time*(1 + i*0.3), 13, i*2, 0.9); ctx.fillStyle = `rgba(0,0,0,${0.5 + i*0.15})`; ctx.fill(); ctx.strokeStyle = `hsla(${v.hue},100%,60%,0.5)`; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.restore();
    const P = pose(9, time, false, 0, 1);
    ctx.save(); ctx.scale(-1, 1); stickman(ctx, 0, 0, sc, P, { color: '#000', headFill: '#000', eyes: '#fff', smile: true }); ctx.restore();
  }

  return { flameShape, eye, hsl, rnd, SQ, WORLD, character, drawGround, genDecor, decor, gate, well, stele, boss, stickman, pose, auraColor, auraStyle, hash };
})();
