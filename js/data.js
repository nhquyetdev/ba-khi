// GodK Bá Khí v1.0 — data: titles, tiers, bosses, i18n, formulas
'use strict';
const GAME_VERSION = '2.3';
const ASCEND_FROM = 30, ASCEND_K = 0.013, R1_END = 25, R1_HP = 0.96; // v1.11.2: gate 26+ = exactly v2.2 difficulty; only realm 1 (1–25) eased // v1.11: gates 1–200 = original difficulty; Boss Ascension + Transformation only from gate 201
const FONT = "'Be Vietnam Pro', 'Segoe UI', Roboto, Arial, sans-serif";
const SAVE_KEY = 'godk_ba_khi_save_v1';

const TIERS = [
  { en: 'Awakening Aura', vi: 'Khởi Nguyên Khí Chất' },
  { en: 'Superior Aura', vi: 'Khí Chất Vượt Trội' },
  { en: 'Royal Aura', vi: 'Quyền Uy Hoàng Tộc' },
  { en: 'Divine Aura', vi: 'Thần Tính Thức Tỉnh' },
  { en: 'Cosmic Aura', vi: 'Thống Trị Tinh Không' },
  { en: 'Infinite Aura', vi: 'Vượt Khỏi Giới Hạn Hữu Hạn' },
  { en: 'Absolute Aura', vi: 'Quyền Năng Tuyệt Đối' },
  { en: 'Transcendent Aura', vi: 'Siêu Việt Mọi Quy Luật' },
  { en: 'Supreme Existence', vi: 'Tồn Tại Tối Thượng' },
  { en: 'Unfathomable Aura', vi: 'Vượt Ngoài Mọi Khái Niệm' },
  { en: 'Beyond the Unlimited', vi: 'Vượt Vô Lượng' },        // v1.4: 201–220
  { en: 'Paradox Aura', vi: 'Bá Khí Nghịch Lý' },             // 221–240
  { en: 'The Final Names', vi: 'Danh Xưng Tối Hậu' },         // 241–250
  { en: 'Realm Beyond GodK', vi: 'Cõi Vượt GodK' },           // 251+ (layers)
];

// [EN, VI] — v1.0–v1.4 list (250). v1.5 inserts 5 titles into each of the first 10 realms → see TITLES below.
const TITLES_V14 = [
['Faint','Mờ Nhạt'],['Dim','Lờ Mờ'],['Weak','Yếu Ớt'],['Mild','Ôn Hòa'],['Subtle','Tinh Tế'],
['Gentle','Dịu Dàng'],['Calm','Tĩnh Lặng'],['Steady','Vững Vàng'],['Bright','Sáng Ngời'],['Clear','Trong Trẻo'],
['Vivid','Sống Động'],['Radiant','Rạng Rỡ'],['Glowing','Tỏa Sáng'],['Shining','Lấp Lánh'],['Brilliant','Chói Lọi'],
['Dazzling','Lóa Mắt'],['Striking','Nổi Bật'],['Impressive','Ấn Tượng'],['Majestic','Uy Nghi'],['Extraordinary','Phi Phàm'],
['Elite','Tinh Anh'],['Noble','Cao Quý'],['Exalted','Tôn Quý'],['Supreme','Tối Cao'],['Dominant','Áp Đảo'],
['Overwhelming','Bá Đạo'],['Intimidating','Uy Hiếp'],['Fearsome','Đáng Sợ'],['Formidable','Ghê Gớm'],['Invincible','Bất Khả Chiến Bại'],
['Unyielding','Bất Khuất'],['Unbreakable','Bất Hoại'],['Unrivaled','Vô Song'],['Peerless','Vô Địch'],['Legendary','Huyền Thoại'],
['Mythical','Thần Thoại'],['Fabled','Truyền Kỳ'],['Ancient','Thượng Cổ'],['Primordial','Hồng Hoang'],['Transcendent','Siêu Phàm'],
['Knight','Kỵ Sĩ'],['Commander','Thống Lĩnh'],['Warlord','Chiến Vương'],['Conqueror','Kẻ Chinh Phạt'],['Overlord','Bá Chủ'],
['Sovereign','Quân Chủ'],['Monarch','Quốc Vương'],['King','Vua'],['High King','Đại Vương'],['Emperor','Hoàng Đế'],
['Grand Emperor','Đại Hoàng Đế'],['Supreme Emperor','Chí Tôn Hoàng Đế'],['Eternal Emperor','Vĩnh Hằng Đế'],['Celestial Emperor','Thiên Đế'],['Divine Emperor','Thần Đế'],
['God Emperor','Thần Hoàng'],['Emperor of Eternity','Đế Vĩnh Cửu'],['Emperor of Creation','Đế Sáng Thế'],['Emperor of All','Vạn Đế Chi Đế'],['Absolute Emperor','Tuyệt Đối Đế'],
['Saint','Thánh Nhân'],['Sacred','Linh Thiêng'],['Hallowed','Thánh Hóa'],['Blessed','Thiên Phúc'],['Holy','Thần Thánh'],
['Divine','Thần Tính'],['Deity','Thần Linh'],['Demigod','Bán Thần'],['God','Thần'],['High God','Thượng Thần'],
['Archgod','Chủ Thần'],['Supreme God','Chí Tôn Thần'],['Primordial God','Hồng Hoang Thần'],['Eternal God','Vĩnh Hằng Thần'],['Celestial God','Thiên Giới Thần'],
['God of Gods','Thần Của Chư Thần'],['Divine Sovereign','Thần Quân'],['Omnipotent','Toàn Năng'],['Almighty','Vạn Năng'],['Absolute Divinity','Tuyệt Đối Thần Tính'],
['Astral','Tinh Tú'],['Stellar','Hằng Tinh'],['Lunar','Nguyệt Hoa'],['Solar','Thái Dương'],['Nebular','Tinh Vân'],
['Galactic','Ngân Hà'],['Universal','Vũ Trụ'],['Cosmic','Càn Khôn'],['Supercosmic','Siêu Vũ Trụ'],['Interstellar','Liên Tinh Hệ'],
['Multiversal','Đa Vũ Trụ'],['Hyperversal','Siêu Đa Vũ Trụ'],['Omniversal','Toàn Đa Vũ Trụ'],['Eternal Cosmos','Vũ Trụ Vĩnh Hằng'],['Infinite Cosmos','Vũ Trụ Vô Tận'],
['Cosmic Sovereign','Càn Khôn Quân Chủ'],['Universe Lord','Chúa Tể Vũ Trụ'],['Galaxy Emperor','Ngân Hà Đế'],['Cosmic Emperor','Vũ Trụ Đế'],['Supreme Cosmos','Tối Thượng Càn Khôn'],
['Endless','Bất Tận'],['Boundless','Vô Biên'],['Limitless','Vô Giới Hạn'],['Infinite','Vô Cùng'],['Infinity','Vô Hạn'],
['Eternal','Vĩnh Hằng'],['Everlasting','Trường Tồn'],['Timeless','Phi Thời Gian'],['Deathless','Bất Diệt'],['Immortal','Bất Tử'],
['Undying','Bất Hủ'],['Unending','Vô Chung'],['Unbounded','Vô Thúc'],['Unrestricted','Vô Câu'],['Absolute','Tuyệt Đối'],
['Infinite Sovereign','Vô Hạn Quân Chủ'],['Eternal Overlord','Vĩnh Hằng Bá Chủ'],['Boundless Emperor','Vô Biên Đế'],['Infinite Monarch','Vô Hạn Quốc Vương'],['Lord of Infinity','Chúa Tể Vô Hạn'],
['Supreme Absolute','Tối Thượng Tuyệt Đối'],['Absolute One','Tuyệt Đối Nhất'],['The Unrivaled','Kẻ Vô Song'],['The Unconquerable','Kẻ Bất Khả Chinh Phục'],['The Undisputed','Kẻ Không Ai Tranh'],
['The Unfathomable','Kẻ Khôn Lường'],['The Unknowable','Kẻ Bất Khả Tri'],['The Unimaginable','Kẻ Không Thể Tưởng'],['The Unattainable','Kẻ Bất Khả Đạt'],['The Unreachable','Kẻ Bất Khả Chạm'],
['Omnipresent','Toàn Tại'],['Omniscient','Toàn Tri'],['Omnipotent','Toàn Năng Chân Chính'],['Omniversal Lord','Chúa Tể Toàn Vũ'],['Absolute Monarch','Tuyệt Đối Quốc Vương'],
['Absolute Sovereign','Tuyệt Đối Quân Chủ'],['Absolute Overlord','Tuyệt Đối Bá Chủ'],['Absolute Ruler','Tuyệt Đối Thống Trị'],['Absolute Existence','Tồn Tại Tuyệt Đối'],['The Absolute','Đấng Tuyệt Đối'],
['Beyond','Vượt Ngoài'],['Otherworldly','Dị Giới'],['Transcendent','Siêu Việt'],['Transcendental','Siêu Nghiệm'],['Extradimensional','Ngoại Chiều'],
['Higher Being','Thượng Thể'],['Higher Existence','Thượng Tồn'],['Beyond Reality','Vượt Thực Tại'],['Beyond Time','Siêu Thời Gian'],['Beyond Space','Vượt Không Gian'],
['Beyond Dimensions','Vượt Chiều Không'],['Beyond Infinity','Vượt Vô Hạn'],['Beyond Eternity','Vượt Vĩnh Hằng'],['Reality Breaker','Phá Thực Tại'],['Law Creator','Lập Pháp Tắc'],
['Fate Controller','Chưởng Vận Mệnh'],['Dimension Ruler','Chủ Chiều Không'],['Reality Sovereign','Thực Tại Quân Chủ'],['Transcendent Emperor','Siêu Việt Đế'],['The Beyond','Đấng Vượt Ngoài'],
['Origin','Bản Nguyên'],['Genesis','Khởi Nguyên'],['Primordial Origin','Hồng Hoang Bản Nguyên'],['First Existence','Tồn Tại Đầu Tiên'],['The First','Đấng Đầu Tiên'],
['Creator','Đấng Sáng Tạo'],['World Forger','Kẻ Rèn Thế Giới'],['Reality Creator','Kẻ Tạo Thực Tại'],['Cosmic Architect','Kiến Trúc Sư Vũ Trụ'],['Supreme Creator','Tối Thượng Sáng Tạo'],
['Origin Sovereign','Bản Nguyên Quân Chủ'],['Eternal Origin','Bản Nguyên Vĩnh Hằng'],['Absolute Origin','Bản Nguyên Tuyệt Đối'],['Source of All','Cội Nguồn Vạn Vật'],['Beginning of All','Khởi Đầu Vạn Vật'],
['End of All','Kết Thúc Vạn Vật'],['The One Above All','Đấng Trên Vạn Vật'],['The One Beyond All','Đấng Ngoài Vạn Vật'],['Supreme Existence','Tồn Tại Tối Thượng'],['The Ultimate','Cực Hạn Tối Chung'],
['Nameless','Vô Danh'],['Unwritten','Vô Tự'],['Uncreated','Phi Tạo'],['Unrestricted One','Đấng Vô Câu'],['Infinite Nothingness','Hư Vô Vô Tận'],
['Eternal Nothingness','Hư Vô Vĩnh Hằng'],['Primordial Chaos','Hỗn Độn Nguyên Thủy'],['Absolute Void','Hư Không Tuyệt Đối'],['Endless Void','Hư Không Bất Tận'],['Infinite Paradox','Nghịch Lý Vô Hạn'],
['Beyond Omniverse','Vượt Toàn Đa Vũ Trụ'],['Beyond Existence','Vượt Tồn Tại'],['Beyond Nonexistence','Vượt Phi Tồn Tại'],['The Unbound','Kẻ Vô Ràng Buộc'],['The Unknowable One','Đấng Bất Khả Tri'],
['The Eternal One','Đấng Vĩnh Hằng'],['The Infinite One','Đấng Vô Hạn'],['The Supreme One','Đấng Tối Thượng'],['The Absolute One','Đấng Tuyệt Đối Nhất'],['THE UNLIMITED','VÔ LƯỢNG CHÍ TÔN'],
// v1.4 — Tier 11: Beyond the Unlimited (201–220)
['Unlimited Emperor','Vô Lượng Hoàng Đế'],['Unlimited Sovereign','Vô Lượng Quân Chủ'],['Eclipse','Nhật Thực'],['Black Sun','Hắc Nhật'],['Corona','Vầng Nhật Hoa'],
['Infinity Emperor','Vô Hạn Hoàng Đế'],['Boundless Sovereign','Vô Biên Quân Chủ'],['Limitless One','Đấng Vô Giới Hạn'],['Eternal Flame','Ngọn Lửa Vĩnh Hằng'],['Omniversal Emperor','Toàn Đa Vũ Trụ Đế'],
['Absolute Infinity','Vô Hạn Tuyệt Đối'],['Transcendent Sovereign','Siêu Việt Quân Chủ'],['Star Eater','Kẻ Nuốt Tinh Tú'],['Dimension Devourer','Kẻ Nuốt Chiều Không'],['Throne Beyond Thrones','Ngai Vượt Mọi Ngai'],
['King of God-Kings','Vua Của Chư Thần Vương'],['The Unwritten Law','Pháp Tắc Vô Tự'],['The Last Light','Ánh Sáng Cuối Cùng'],['The Unlimited Eclipse','Nhật Thực Vô Lượng'],['Beyond the Unlimited','Vượt Vô Lượng'],
// Tier 12: Paradox Aura (221–240)
['Paradox','Nghịch Lý'],['Living Paradox','Nghịch Lý Sống'],['Mirror of Fate','Gương Định Mệnh'],['Reverse Time','Nghịch Thời'],['Before the Beginning','Trước Khởi Đầu'],
['After the End','Sau Kết Thúc'],['Yin-Yang Sovereign','Âm Dương Quân Chủ'],['Order and Chaos','Trật Tự Và Hỗn Độn'],['Being and Nothing','Hữu Và Vô'],['The Contradiction','Kẻ Mâu Thuẫn'],
['Paradox Emperor','Nghịch Lý Hoàng Đế'],['Nothingness Sovereign','Hư Vô Quân Chủ'],['Genesis Breaker','Kẻ Phá Khởi Nguyên'],['Origin Eater','Kẻ Nuốt Bản Nguyên'],['Truth Beyond Truth','Chân Lý Vượt Chân Lý'],
['The Impossible','Điều Bất Khả'],['The Answer','Lời Giải'],['The Question','Câu Hỏi'],['Infinite Recursion','Đệ Quy Vô Tận'],['The Absolute Paradox','Nghịch Lý Tuyệt Đối'],
// Tier 13: The Final Names (241–250)
['Genesis Storm','Bão Khởi Nguyên'],['Origin of Origins','Bản Nguyên Của Bản Nguyên'],['Above All That Is Above','Trên Cả Vạn Trên'],['Higher Than The One Above All','Trên Cả Đấng Trên Vạn Vật'],['The Name of Names','Danh Của Mọi Danh'],
['Aura Itself','Chính Là Bá Khí'],['The Final Aura','Bá Khí Tối Hậu'],['Beyond Words','Vượt Ngôn Từ'],['The Last Title','Danh Hiệu Cuối Cùng'],['GODK','GODK · BÁ KHÍ CHI THẦN'],
];
// v1.5: +50 titles placed between old ones (after old positions 3, 7, 11, 15, 18 of each realm) → realms 1–10 have 25 titles
const INSERT_AFTER = [3, 7, 11, 15, 18];
const INSERTS = [
  [['Flickering','Chập Chờn'],['Composed','Điềm Tĩnh'],['Spirited','Hăng Hái'],['Blazing','Bừng Cháy'],['Commanding','Uy Phong']],
  [['Venerable','Đáng Kính'],['Menacing','Sát Khí'],['Ironclad','Mình Đồng Da Sắt'],['Epic','Sử Thi'],['Immemorial','Vạn Cổ']],
  [['Marshal','Nguyên Soái'],['Tyrant','Bạo Chúa'],['Emperor of Ten Thousand Years','Vạn Tuế Đế'],['Heaven\'s Mandate','Thiên Mệnh Đế'],['Emperor of Emperors','Đế Của Chư Đế']],
  [['Anointed','Thánh Ấn'],['Ascendant','Phi Thăng'],['Elder God','Cổ Thần'],['Star God','Tinh Thần'],['Godhead','Thần Cách']],
  [['Starlit','Tinh Quang'],['Quasar','Chuẩn Tinh'],['Supernova','Siêu Tân Tinh'],['Black Hole','Hố Đen'],['Big Bang','Vụ Nổ Lớn']],
  [['Countless','Vô Số'],['Ageless','Bất Lão'],['Reincarnated','Luân Hồi'],['Infinite Will','Ý Chí Vô Hạn'],['Endless Emperor','Bất Tận Đế']],
  [['The Unstoppable','Kẻ Không Thể Cản'],['The Unseen','Kẻ Vô Hình'],['All-Seeing','Toàn Kiến'],['Absolute Judge','Tuyệt Đối Phán Quan'],['Absolute Will','Ý Chí Tuyệt Đối']],
  [['Ethereal','Hư Ảo'],['Fourth Dimension','Chiều Thứ Tư'],['Beyond Fate','Vượt Định Mệnh'],['Karma Breaker','Phá Nhân Quả'],['Truth Sovereign','Chân Lý Quân Chủ']],
  [['Seed of Worlds','Hạt Giống Thế Giới'],['Star Forger','Kẻ Rèn Sao'],['Ancestor of Gods','Thủy Tổ Chư Thần'],['Alpha and Omega','Khởi Thủy Và Chung Kết'],['The All','Vạn Hữu']],
  [['Unspoken','Vô Ngôn'],['Chaos Lord','Chúa Tể Hỗn Độn'],['Outer Void','Ngoại Hư Không'],['The Silent One','Đấng Tịch Lặng'],['The Only One','Đấng Duy Nhất']],
];
const TITLES = (() => { const out = []; for (let r = 0; r < 10; r++) for (let k = 1; k <= 20; k++) { out.push(TITLES_V14[r*20 + k - 1]); const ix = INSERT_AFTER.indexOf(k); if (ix >= 0) out.push(INSERTS[r][ix]); }
  return out.concat(TITLES_V14.slice(200)); })();
// old (≤ v1.4) title number → new number (used to migrate saves and old requirements)
function OT(t){ if (t > 200) return t + 50; const r = Math.floor((t - 1)/20), k = (t - 1)%20 + 1; return r*25 + k + INSERT_AFTER.filter(a => a < k).length; }
const MAX_TITLE = TITLES.length; // 300 (v1.5)
const REALM_START = [1, 26, 51, 76, 101, 126, 151, 176, 201, 226, 251, 271, 291, 301];
const realmStart = ti => REALM_START[Math.min(ti, 13)];
const realmSize = ti => ti >= 13 ? 20 : REALM_START[ti + 1] - REALM_START[ti];
const isRealmEnd = g => g <= MAX_TITLE && g === realmStart(tierOf(g)) + realmSize(tierOf(g)) - 1;
const posOf = t => t > MAX_TITLE ? 20 : t - realmStart(tierOf(t)) + 1;
const UNL = 13; // tier index of the endless layers

// Layers beyond THE UNLIMITED (title 201+)
const LAYER_WORDS = [
  ['Emperor','Hoàng Đế'],['Sovereign','Quân Chủ'],['Infinity','Vô Hạn'],['Boundless','Vô Biên'],['Limitless','Vô Giới Hạn'],
  ['Eternal','Vĩnh Hằng'],['Omniversal','Toàn Đa Vũ Trụ'],['Absolute','Tuyệt Đối'],['Transcendent','Siêu Việt'],['Origin','Bản Nguyên'],
  ['Genesis','Khởi Nguyên'],['Paradox','Nghịch Lý'],['Nothingness','Hư Vô'],['The One Above All','Đấng Trên Vạn Vật'],['Unlimited','Vô Lượng'],
];
function roman(n){const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const [v,r] of m){while(n>=v){s+=r;n-=v;}}return s;}
function titleName(t, lang){
  const L = lang==='vi'?1:0;
  if (t <= MAX_TITLE) return TITLES[t-1][L];
  const k = t - MAX_TITLE; // v1.8: GodK Tower — title 300+N = cleared floor N
  return lang==='vi' ? `GODK ✦ Tháp Tầng ${k}` : `GODK ✦ Tower Floor ${k}`;
}
function tierOf(t){ if (t > MAX_TITLE) return UNL; let i = 12; while (i > 0 && t < REALM_START[i]) i--; return i; }
function subOf(t){ if (t > MAX_TITLE) return 20; const ti = tierOf(t); return Math.max(1, Math.ceil(posOf(t) / realmSize(ti) * 20)); } // normalised 1..20 (visuals)
function tierName(t, lang){ return TIERS[tierOf(t)][lang==='vi'?'vi':'en']; }

// ---------- Formulas (tuned by simulation: ~8h to THE UNLIMITED) ----------
const LV_PER_TITLE = 3;
const F = {
  levelCap: t => LV_PER_TITLE * t,
  xpNeed: L => Math.floor(4 * Math.pow(L, 1.3) + 12), // v1.1: ×2 to offset events/rifts
  xpRate: (s, moving, inWell, buff) => (1 + s.R) * (1 + 0.08 * s.L) * (moving ? 2 : 1) * (inWell ? 1.5 : 1) * (1 + 0.05 * (s.stelae ? s.stelae.length : 0)) * (1 + 0.01 * (s.marks || 0)) * (buff ? 5 : 1),
  statMult: (t, E, M, Sh, Sb) => F.essMult(E) * Math.pow(1.01, t) * (1 + 0.005 * (M || 0)) * (1 + SHARD_BONUS * (Sh || 0)) * (1 + (Sb || 0)),
  stats(L, t, E, M, Sh, Sb){ const m = F.statMult(t, E, M, Sh, Sb); return { hp: (120 + 30*L)*m, atk: (12 + 3.2*L)*m, def: (3 + 0.7*L)*m, crit: 0.10 + Math.min(0.15, E*0.0005) }; },
  boss(g){ const L = LV_PER_TITLE*g; const b = F.stats(L, g, 0); const D = 0.85*Math.pow(1.017, g)*(isRealmEnd(g) && g > R1_END ? 1.5 : 1)*(g > 250 ? 1.15 : 1)*(g === MAX_TITLE - 1 ? 1.5 : 1)*F.ascend(g); // v1.5 (+v1.6 final gate ×1.5): 300 titles (~21h active, ~9 rebirths)
    return { hp: b.hp*D*1.6*F.r1hp(g), atk: b.atk*D*0.7, def: b.def*D, crit: 0.08 }; },
  // v1.11.1: realm 1 (before rebirth unlocks) — boss HP −4% per gate from gate 11 and no realm-end ×1.5 at gate 25 → ~50% win with 0 Essence, 0 Marks
  r1hp: g => g > 10 && g <= R1_END ? Math.pow(R1_HP, g - 10) : 1,
  // v2.1: player stats are NEVER lowered — Essence is linear again (+3.5% per point). Difficulty comes from the bosses instead.
  essMult: E => 1 + 0.035 * (E || 0),
  // Boss Ascension (v2.1 curve, kept in v1.11.2): e^(0.013·(g−30)) from gate 31 — fitted by fight simulation
  ascend: g => g > ASCEND_FROM ? Math.exp(ASCEND_K * (g - ASCEND_FROM)) : 1, // ×1.8 @75, ×4.1 @139, ×9.1 @200, ×33 @300 (v2.1/v2.2 curve)
  // Real transformation: below 50% HP the boss heals and hits harder once (gate 26+). Realm-end gates: stronger.
  transformMech: (g, realmEnd) => g <= R1_END ? null : realmEnd ? [0.25, 1.35] : [0.15, 1.2],
  essence: t => Math.floor(Math.pow(t, 1.5) / 5), // v1.5: /5 → more rebirths
  dmg: (a, d) => a*a/(a+d),
  REBIRTH_MIN_TITLE: 25, // end of realm 1
  speed: t => Math.min(520, 260 + 0.87*t), // a little faster every title (520 at 300)
};

// ---------- Bosses (one archetype per tier; each gate is a variant) ----------
const BOSSES = [
  { id:'hollow',   en:'The Hollow',          vi:'Kẻ Rỗng',              hue: 0,
    intro:{en:['Something tall is standing in the dark.','It has been waiting. It has no face.'],vi:['Có thứ gì đó rất cao đứng trong bóng tối.','Nó đã chờ. Nó không có mặt.']}},
  { id:'eyes',     en:'Mother of Eyes',      vi:'Mẹ Của Những Con Mắt', hue: 340,
    intro:{en:['The walls are breathing.','Every eye opens at once.'],vi:['Những bức tường đang thở.','Tất cả con mắt cùng mở ra.']}},
  { id:'king',     en:'The Rotting King',    vi:'Vua Thối Rữa',         hue: 45,
    intro:{en:['A crown rusts on a skull that still smiles.','Kneel, it whispers. Everyone kneels.'],vi:['Vương miện rỉ sét trên chiếc sọ vẫn còn cười.','Quỳ xuống, nó thì thầm. Ai cũng đã quỳ.']}},
  { id:'seraph',   en:'The Fallen Seraph',   vi:'Thiên Sứ Sa Đọa',      hue: 50,
    intro:{en:['Be not afraid, says a voice with too many mouths.','Its wings are made of eyes.'],vi:['Đừng sợ, giọng nói có quá nhiều miệng cất lên.','Đôi cánh của nó làm bằng mắt.']}},
  { id:'maw',      en:'The Star Devourer',   vi:'Kẻ Nuốt Sao',          hue: 270,
    intro:{en:['The stars here go out one by one.','Something is chewing.'],vi:['Những vì sao ở đây tắt dần từng ngôi.','Có thứ gì đó đang nhai.']}},
  { id:'smile',    en:'The Endless Smile',   vi:'Nụ Cười Bất Tận',      hue: 300,
    intro:{en:['It is smiling at you.','It has been smiling for a very, very long time.'],vi:['Nó đang cười với bạn.','Nó đã cười như vậy rất, rất lâu rồi.']}},
  { id:'judge',    en:'The Judge',           vi:'Kẻ Phán Xét',          hue: 0,
    intro:{en:['A cracked mask fills the sky.','You have been found guilty of existing.'],vi:['Một chiếc mặt nạ nứt vỡ che kín bầu trời.','Ngươi bị kết tội vì đã tồn tại.']}},
  { id:'glitch',   en:'ERR0R',               vi:'LỖI',                hue: 180,
    intro:{en:['R E A L I T Y  failed to load.','It is wearing your shape. Badly.'],vi:['T H Ự C  T Ạ I  không thể tải.','Nó đang mặc hình dạng của bạn. Rất tệ.']}},
  { id:'unmaker',  en:'The Unmaker',         vi:'Kẻ Hủy Tạo',           hue: 40,
    intro:{en:['It unmakes the first light.','Its crown is made of hands.'],vi:['Nó xóa đi tia sáng đầu tiên.','Vương miện của nó làm từ những bàn tay.']}},
  { id:'nameless', en:'The Nameless',        vi:'Kẻ Không Tên',         hue: 260,
    intro:{en:['It looks exactly like you.','Except it is smiling.'],vi:['Nó trông giống hệt bạn.','Chỉ khác là nó đang cười.']}},
  { id:'echo',     en:'Echo of the Unlimited', vi:'Dư Âm Vô Lượng',      hue: 0,
    intro:{en:['Beyond the last name, something still answers.','It is everything you defeated. At once.'],vi:['Sau cái tên cuối cùng, vẫn có thứ đáp lời.','Nó là tất cả những gì bạn từng đánh bại. Cùng lúc.']}},
];
// v1.1: 12 extra bosses mixed into every tier so gates don't repeat
const EXTRA_BOSSES = [
  { id:'doll',      en:'The Porcelain Doll',   vi:'Búp Bê Sứ',           hue: 330, intro:{en:['Something is sitting very still.','Its strings go up into the dark.'],vi:['Có thứ gì đó ngồi im phăng phắc.','Những sợi dây của nó dẫn lên bóng tối.']}},
  { id:'bride',     en:'The Drowned Bride',    vi:'Cô Dâu Chết Đuối',    hue: 190, intro:{en:['Water drips from the ceiling.','She is still waiting at the altar.'],vi:['Nước nhỏ giọt từ trần.','Cô ấy vẫn đang chờ trước lễ đường.']}},
  { id:'scarecrow', en:'The Scarecrow',        vi:'Bù Nhìn',             hue: 30,  intro:{en:['The crows went quiet.','The scarecrow was not here a second ago.'],vi:['Lũ quạ im bặt.','Con bù nhìn vừa nãy đâu có ở đây.']}},
  { id:'moth',      en:'The Moth Queen',       vi:'Nữ Hoàng Bướm Đêm',   hue: 40,  intro:{en:['Your aura is a light.','And she loves the light.'],vi:['Bá khí của bạn là một ngọn đèn.','Và nàng yêu ánh sáng.']}},
  { id:'crawler',   en:'The Crawler',          vi:'Kẻ Bò Ngược',         hue: 100, intro:{en:['Something is walking on its hands.','Backwards. Toward you.'],vi:['Có thứ gì đó đang bò bằng tay.','Ngửa người. Về phía bạn.']}},
  { id:'plague',    en:'The Plague Doctor',    vi:'Bác Sĩ Dịch Hạch',    hue: 120, intro:{en:['A green lantern swings in the fog.','You are the disease, it says.'],vi:['Một chiếc đèn lồng xanh lắc lư trong sương.','Ngươi chính là dịch bệnh, nó nói.']}},
  { id:'clock',     en:'The Last Clock',       vi:'Đồng Hồ Tận Thế',     hue: 45,  intro:{en:['Tick.','The hands are looking at you.'],vi:['Tích tắc.','Hai cây kim đang nhìn bạn.']}},
  { id:'twins',     en:'The Twins',            vi:'Song Sinh Dính Liền', hue: 0,   intro:{en:['Two voices. One body.','They finish each other\'s screams.'],vi:['Hai giọng nói. Một cơ thể.','Chúng hét nối tiếp nhau.']}},
  { id:'wendigo',   en:'The Antlered One',     vi:'Quỷ Sừng Hươu',       hue: 15,  intro:{en:['It is always hungry.','It has been following your footprints.'],vi:['Nó luôn đói.','Nó đã lần theo dấu chân bạn.']}},
  { id:'jester',    en:'The Jester',           vi:'Gã Hề',               hue: 280, intro:{en:['Bells ring in the dark.','Want to hear a joke? You.'],vi:['Tiếng chuông leng keng trong bóng tối.','Muốn nghe chuyện cười không? Chính là ngươi.']}},
  { id:'weaver',    en:'The Weaver',           vi:'Kẻ Dệt Tơ',           hue: 260, intro:{en:['The web is made of auras.','Yours would look lovely in it.'],vi:['Mạng nhện được dệt từ bá khí.','Bá khí của ngươi sẽ rất đẹp trong đó.']}},
  { id:'tree',      en:'The Whispering Tree',  vi:'Cây Thì Thầm',        hue: 90,  intro:{en:['The bark has faces.','All of them are whispering your name.'],vi:['Vỏ cây có những khuôn mặt.','Tất cả đều thì thầm tên bạn.']}},
  // v1.2 — folklore & more
  { id:'jiangshi',  en:'The Hopping Corpse',   vi:'Cương Thi',           hue: 140, intro:{en:['Thump. Thump. Thump.','The paper charm on its face is peeling off.'],vi:['Thịch. Thịch. Thịch.','Lá bùa trên mặt nó đang bong ra.']}},
  { id:'malai',     en:'The Floating Head',    vi:'Ma Lai',              hue: 0,   intro:{en:['A head drifts out of the dark.','The body was left somewhere else.'],vi:['Một cái đầu trôi ra từ bóng tối.','Cơ thể đã bị bỏ lại ở nơi khác.']}},
  { id:'ongke',     en:'The Sack Man',         vi:'Ông Kẹ',              hue: 30,  intro:{en:['Children used to hear about him.','The sack is moving.'],vi:['Trẻ con từng được dọa về lão.','Cái bao đang cựa quậy.']}},
  { id:'nun',       en:'The Faceless Nun',     vi:'Nữ Tu Không Mặt',     hue: 220, intro:{en:['Candles light themselves.','She is praying. For you.'],vi:['Những ngọn nến tự bốc cháy.','Bà ta đang cầu nguyện. Cho bạn.']}},
  { id:'hound',     en:'The Night Hound',      vi:'Chó Săn Bóng Đêm',    hue: 0,   intro:{en:['Breathing behind you.','Too many eyes for one dog.'],vi:['Có tiếng thở sau lưng.','Quá nhiều mắt cho một con chó.']}},
  // v1.3
  { id:'bonedragon',en:'The Bone Dragon',      vi:'Rồng Xương',          hue: 30,  intro:{en:['Something old uncoils in the dark.','It remembers being a god.'],vi:['Có thứ gì đó rất cổ xưa trườn ra từ bóng tối.','Nó còn nhớ mình từng là thần.']}},
  { id:'wisps',     en:'The Will-o\'-Wisps',   vi:'Ma Trơi',             hue: 160, intro:{en:['Little lights are floating closer.','Together, they make a face.'],vi:['Những đốm sáng nhỏ trôi lại gần.','Cùng nhau, chúng tạo thành một khuôn mặt.']}},
  { id:'lakebeast', en:'The Lake Beast',       vi:'Thủy Quái',           hue: 180, intro:{en:['The floor is water now.','Something big is breathing under it.'],vi:['Nền đất đã hóa thành nước.','Có thứ gì đó rất lớn đang thở bên dưới.']}},
  { id:'samurai',   en:'The Headless Samurai', vi:'Võ Sĩ Không Đầu',     hue: 0,   intro:{en:['A blade is drawn slowly.','It is still looking for its head.'],vi:['Một lưỡi kiếm được rút ra chậm rãi.','Nó vẫn đang đi tìm cái đầu của mình.']}},
  { id:'reaper',    en:'The Reaper',           vi:'Thần Chết',           hue: 270, intro:{en:['Your name is on its list.','It is crossing it out.'],vi:['Tên bạn có trong danh sách của nó.','Nó đang gạch bỏ.']}},
  { id:'tvhead',    en:'The Broadcast',        vi:'Người Đầu TV',        hue: 120, intro:{en:['Static fills the room.','You are on TV.'],vi:['Tiếng nhiễu sóng tràn ngập căn phòng.','Bạn đang lên sóng.']}},
  { id:'golem',     en:'The Cursed Golem',     vi:'Người Đá Nguyền',     hue: 25,  intro:{en:['The runes are glowing.','The mountain stood up.'],vi:['Những ký tự cổ đang phát sáng.','Ngọn núi đã đứng dậy.']}},
  { id:'oni',       en:'The Red Oni',          vi:'Quỷ Đỏ',              hue: 0,   intro:{en:['Drums in the distance.','It laughs like thunder.'],vi:['Tiếng trống vọng lại từ xa.','Nó cười như sấm.']}},
  // v1.4
  { id:'hydra',     en:'The Nine-Headed Serpent', vi:'Cửu Đầu Xà',       hue: 120, intro:{en:['Cut one head…','…and you will understand why it is smiling.'],vi:['Chặt một cái đầu…','…rồi bạn sẽ hiểu vì sao nó cười.']}},
  { id:'puppeteer', en:'The Puppeteer',        vi:'Kẻ Giật Dây',          hue: 300, intro:{en:['You feel a string tied to your wrist.','Someone above is pulling.'],vi:['Bạn cảm thấy một sợi dây buộc vào cổ tay.','Có ai đó ở trên đang kéo.']}},
  { id:'sphinx',    en:'The Silent Sphinx',    vi:'Nhân Sư Câm',          hue: 45,  intro:{en:['It asks a riddle without a mouth.','You already gave the wrong answer.'],vi:['Nó ra câu đố mà không có miệng.','Bạn đã trả lời sai từ trước.']}},
  // v1.5 — murim & folklore
  { id:'demoncult', en:'The Heavenly Demon',   vi:'Thiên Ma Giáo Chủ',    hue: 0,   intro:{en:['The Demon Cult kneels as one.','Its master has never lost a duel.'],vi:['Cả Ma Giáo đồng loạt quỳ xuống.','Giáo chủ của chúng chưa từng thua một trận.']}},
  { id:'bloodsword',en:'The Blood Sword Demon',vi:'Huyết Kiếm Ma',        hue: 350, intro:{en:['The sword is drinking.','The swordsman died long ago.'],vi:['Thanh kiếm đang uống máu.','Kiếm khách đã chết từ lâu.']}},
  { id:'boneghost', en:'The White Bone Demon', vi:'Bạch Cốt Tinh',        hue: 60,  intro:{en:['A kind old voice calls you closer.','Its bones are showing through the smile.'],vi:['Một giọng nói hiền từ gọi bạn lại gần.','Xương lộ ra qua nụ cười.']}},
  { id:'wuchang',   en:'Black and White Impermanence', vi:'Hắc Bạch Vô Thường', hue: 0, intro:{en:['Two officials of the underworld.','They have come with your name written down.'],vi:['Hai sứ giả của âm phủ.','Họ mang theo tên bạn đã được ghi sẵn.']}},
  { id:'tiangou',   en:'The Moon-Eating Hound',vi:'Thiên Cẩu Nuốt Nguyệt', hue: 20,  intro:{en:['The moon is being eaten.','Something is still hungry.'],vi:['Mặt trăng đang bị nuốt.','Có thứ vẫn còn đói.']}},
  { id:'mirror',    en:'The Broken Mirror',    vi:'Gương Vỡ',            hue: 200, intro:{en:['Your reflection is late.','It moved first.'],vi:['Hình phản chiếu của bạn bị chậm.','Nó đã cử động trước.']}},
];
// v1.2 — exclusive bosses of the Realm of the Unlimited (title 201+)
const UNLIMITED_BOSSES = [
  { id:'eyegod',   en:'The Eye Above All',   vi:'Thiên Nhãn Vô Lượng',  hue: 45,  intro:{en:['The sky opens.','It was an eyelid.'],vi:['Bầu trời mở ra.','Hóa ra đó là mí mắt.']}},
  { id:'geometer', en:'The Geometer',        vi:'Kẻ Đo Hư Không',       hue: 180, intro:{en:['Space folds into cubes.','Something is measuring you.'],vi:['Không gian gấp lại thành khối.','Có thứ gì đó đang đo đạc bạn.']}},
  { id:'glyph',    en:'The Name Eater',      vi:'Kẻ Nuốt Tên',          hue: 300, intro:{en:['Letters fall off your title.','It is hungry for names.'],vi:['Từng chữ rơi khỏi danh hiệu của bạn.','Nó đói những cái tên.']}},
];
// v1.4 — signature bosses of the three new realms (gate 220, 240 and the final gate 249)
const HIGH_BOSSES = [
  { id:'eclipseking', en:'The Eclipse King',   vi:'Nhật Thực Ma Vương',   hue: 40,  intro:{en:['The sun goes black.','Something wears it like a crown.'],vi:['Mặt trời hóa đen.','Có kẻ đội nó như một vương miện.']}},
  { id:'paradox',     en:'The Paradox',        vi:'Kẻ Nghịch Lý',         hue: 185, intro:{en:['It is losing. It is winning.','It is both of you.'],vi:['Nó đang thua. Nó đang thắng.','Nó là cả hai người.']}},
  { id:'firstgod',    en:'The First GodK',     vi:'Thần Bá Khí Nguyên Thủy', hue: 0, intro:{en:['Before every aura, there was one.','It has been waiting 250 titles for you.'],vi:['Trước mọi luồng bá khí, đã có một luồng đầu tiên.','Nó đã chờ bạn suốt 250 danh hiệu.']}},
];
// v1.5 — the Mirror Gate: a copy of YOU, slightly stronger. Winning is pure luck (20%).
const MIRROR_BOSS = { id:'mirrorself', en:'Your Reflection', vi:'Bóng Gương Của Ngươi', hue: 350, intro:{en:['It knows every move you will make.','It is you. Slightly better. Only luck can save you.'],vi:['Nó biết trước mọi đòn ngươi sẽ ra.','Nó chính là ngươi, chỉ nhỉnh hơn một chút. Chỉ may mắn mới cứu được ngươi.']}};
// v1.6: harder — 12% base, −0.8% per Mirror Shard you own (it copies them too), min 4%; reflection ×1.05; longer cooldowns
const MIRROR_GATE = { x: -650, y: 1150 }, MIRROR_MULT = 1.05, MIRROR_CD_WIN = 15*60*1000, MIRROR_CD_LOSE = 3*60*1000, MAX_SHARDS = 10, SHARD_BONUS = 0.06; // v2.2: +6% per shard (was 3%)
const mirrorChance = S => Math.max(0.04, 0.12 - 0.008*(S.shards || 0));
// v1.6 FINAL BOSS (gate 299 → GODK): your last reflection; replays every realm you walked through as it loses HP. Pure stat check (no luck).
const FINAL_MIRROR = { id:'finalmirror', en:'The Last Reflection', vi:'Bóng Gương Tối Hậu', hue: 0, intro:{en:['Three hundred titles. One mirror.','It remembers every step you took.'],vi:['Ba trăm danh hiệu. Một tấm gương.','Nó nhớ từng bước ngươi đã đi.']}};
const ENDING = {
  en:['The mirror shatters into three hundred pieces.','Each piece is a title you once carried.','Faint. Emperor. God. Cosmos. Infinity. Paradox.','You did not defeat it.','You became it.','— GODK —'],
  vi:['Tấm gương vỡ thành ba trăm mảnh.','Mỗi mảnh là một danh hiệu ngươi từng mang.','Mờ Nhạt. Hoàng Đế. Thần. Càn Khôn. Vô Hạn. Nghịch Lý.','Ngươi không đánh bại nó.','Ngươi đã trở thành nó.','— GODK —'],
};
const ALL_BOSSES = BOSSES.concat(EXTRA_BOSSES, UNLIMITED_BOSSES, HIGH_BOSSES);
// Goku-style forms: aura color + name suffix; bosses transform at 50% HP
const BOSS_FORMS = [
  { en:'Dormant',        vi:'Ngủ Yên',          h:270, s:25,  l:55 },
  { en:'Awakened',       vi:'Thức Tỉnh',        h:0,   s:85,  l:55 },
  { en:'Enraged',        vi:'Cuồng Nộ',         h:22,  s:100, l:55, sparks:1 },
  { en:'Ascended',       vi:'Siêu Cấp',         h:48,  s:100, l:60, sparks:1 },
  { en:'Ascended II',    vi:'Siêu Cấp II',      h:50,  s:100, l:62, sparks:1, bolt:1 },
  { en:'Ascended III',   vi:'Siêu Cấp III',     h:44,  s:100, l:58, bolt:1, big:1 },
  { en:'Crimson God',    vi:'Huyết Thần',       h:352, s:100, l:56, bolt:1, big:1 },
  { en:'Azure God',      vi:'Lam Thần',         h:198, s:100, l:62, bolt:1, big:1 },
  { en:'Silver Instinct', vi:'Bản Năng Vô Cực',  h:220, s:20,  l:88, bolt:1, big:1 },
  { en:'Void Form',      vi:'Hư Vô Hình',       h:285, s:90,  l:50, bolt:1, big:1, dark:1 },
  { en:'Eclipse Form',   vi:'Nhật Thực Hình',   h:40,  s:100, l:62, bolt:1, big:1, eclipse:1 },   // v1.4
  { en:'Paradox Form',   vi:'Nghịch Lý Hình',   h:185, s:100, l:62, bolt:1, big:1, dual:1, h2:310 },
  { en:'GodK Form',      vi:'Hình Thái GodK',   h:0,   s:100, l:68, bolt:1, big:1, rainbow:1 },
];
function bossFor(g){
  const n = EXTRA_BOSSES.length;
  if (g >= MAX_TITLE) return towerBoss(towerFloor(g));
  const ti = tierOf(g);
  if (ti >= 10) { // v1.4 realms 201–250
    if (g === MAX_TITLE - 1) return FINAL_MIRROR;
    if (g === MAX_TITLE - 2) return HIGH_BOSSES[2];
    if (isRealmEnd(g)) return HIGH_BOSSES[ti - 10];
    const pool = [HIGH_BOSSES[ti - 10]].concat(UNLIMITED_BOSSES, EXTRA_BOSSES.filter(b => ['hydra','puppeteer','sphinx','reaper','bonedragon'].includes(b.id)), [BOSSES[9], BOSSES[10]]);
    return pool[(g*5) % pool.length];
  }
  if (isRealmEnd(g)) return BOSSES[ti];
  if (g === 1) return BOSSES[0]; // the first gate is always The Hollow
  const pool = [BOSSES[ti]]; for (let k = 0; k < 6; k++) pool.push(EXTRA_BOSSES[(ti*6 + k) % n]);
  if (ti > 0) pool.push(BOSSES[ti - 1]);
  pool.push(ti > 0 ? TRAIT_BOSSES[ti % 3] : EXTRA_BOSSES[6 % n]); if (ti >= 3) pool.push(ARCHANGELS[ti % 2]); // v1.9 · v1.11.1: realm 1 gets a plain boss instead of a trait boss (pool stays 8 so stride 7 still cycles)
  return pool[(g*7) % pool.length]; // stride coprime with pool size so every boss appears
}
function bossForm(g){ if (g >= MAX_TITLE) return towerForm(towerFloor(g)); const ti = tierOf(g); if (g === MAX_TITLE - 1) return BOSS_FORMS.length - 1; if (ti >= 10) return Math.min(BOSS_FORMS.length - 2, 9 + Math.min(3, ti - 10)); return Math.min(8, Math.floor(ti*0.8 + ((subOf(g) - 1)/7))); }
function unlockedBosses(t){ const ti = Math.min(9, tierOf(t)); const out = BOSSES.slice(0, ti + 1).concat(EXTRA_BOSSES.slice(0, Math.min(EXTRA_BOSSES.length, ti*6 + 6)));
  return t > 200 ? out.concat(UNLIMITED_BOSSES, [BOSSES[10]], t > 220 ? HIGH_BOSSES.slice(0, Math.min(3, tierOf(t) - 9)) : []) : out; }

// v1.2: Wandering Horrors roam the open map (positions from the shared clock → everyone sees them in the same place)
const ROAMERS = [ [1800,-1800,600], [-2000,-300,700], [300,1800,650], [-900,-2600,500], [2900,1300,600], [-2900,3100,500] ];
const ROAM_PERIOD = 10*60*1000, ROAM_CD = 6*60*1000, ROAM_MULT = 0.6, ROAM_XP_SEC = 60;
function roamerAt(i, now, pool){
  const [hx, hy, r] = ROAMERS[i], per = Math.floor(now / ROAM_PERIOD), t = now / 1000;
  const x = hx + Math.cos(t/41 + i*1.7)*r + Math.sin(t/13 + i)*r*0.25, y = hy + Math.sin(t/57 + i*2.3)*r*0.8;
  let h = ((per + 1) * 2654435761 + i*97) >>> 0; h = (h ^ (h >>> 15)) >>> 0;
  return { i, x, y, key: per*10 + i, B: pool[h % pool.length], face: Math.cos(t/41 + i*1.7 + Math.PI/2) > 0 ? 1 : -1 };
}

// v1.1: Rift Gates scattered on the map (optional bosses with rewards)
const RIFT_RANKS = [
  { en:'Bronze', vi:'Đồng',  c:'#d08a4a', h:28,  mult:0.5, xpSec:45,  form:1 },
  { en:'Silver', vi:'Bạc',   c:'#cfd8e6', h:210, mult:0.75, xpSec:75,  form:3 },
  { en:'Gold',   vi:'Vàng',  c:'#ffd24a', h:48,  mult:1.1, xpSec:120, form:5 },
  { en:'Blood',  vi:'Huyết', c:'#ff3a3a', h:0,   mult:1.6, xpSec:180, form:6 },
];
const RIFTS = [ [1250,-700,0],[-1100,1300,0],[2600,300,1],[-2400,-1200,1],[600,2700,1],[-300,-3300,2],[3400,2900,2],[-3500,2600,3] ];
const RIFT_CD_WIN = 8*60*1000, RIFT_CD_LOSE = 60*1000, MAX_MARKS = 60;

// v1.1: ×5 aura event gates — global schedule from the clock so every player sees the same one
const EVENT_TYPES = [
  { en:'Golden Gate',     vi:'Cổng Hoàng Kim',   h:48,  min:3 },
  { en:'Blood Moon Gate', vi:'Cổng Huyết Nguyệt', h:355, min:3, resetRifts:1 },
  { en:'Starfall Gate',   vi:'Cổng Tinh Hà',     h:220, min:4 },
];
const EVENT_PERIOD = 15*60*1000, EVENT_OPEN = 3*60*1000;
function eventAt(now){
  const idx = Math.floor(now / EVENT_PERIOD), start = idx*EVENT_PERIOD;
  let h = (idx * 2654435761) >>> 0; const r = () => ((h = (h*1103515245 + 12345) >>> 0) / 4294967296);
  const a = r()*Math.PI*2, d = 500 + r()*2500;
  return { idx, type: EVENT_TYPES[idx % EVENT_TYPES.length], x: Math.round(Math.cos(a)*d), y: Math.round(Math.sin(a)*d),
    active: now - start < EVENT_OPEN, endsAt: start + EVENT_OPEN, nextAt: start + EVENT_PERIOD };
}

// ---------- World secrets ----------
const STELAE_LORE = [
  {en:'"Aura is not power. Aura is the refusal to be small."', vi:'"Bá khí không phải sức mạnh. Bá khí là không chịu nhỏ bé."'},
  {en:'"Those who walk burn twice as bright as those who wait."', vi:'"Kẻ bước đi cháy sáng gấp đôi kẻ đứng chờ."'},
  {en:'"The gate does not open for the strong. It opens for the stronger."', vi:'"Cánh cổng không mở cho kẻ mạnh. Nó mở cho kẻ mạnh hơn."'},
  {en:'"To be reborn is to lose everything, except what matters."', vi:'"Tái sinh là mất tất cả, trừ điều quan trọng."'},
  {en:'"Some wells still remember the first aura."', vi:'"Vài giếng cổ vẫn nhớ luồng bá khí đầu tiên."'},
  {en:'"An emperor is only a king who refused to stop."', vi:'"Hoàng đế chỉ là một vị vua không chịu dừng lại."'},
  {en:'"The gods were once like you. Then they kept walking."', vi:'"Thần linh từng như ngươi. Rồi họ cứ bước tiếp."'},
  {en:'"Beyond the stars there is a number that does not end."', vi:'"Vượt qua các vì sao là một con số không có tận cùng."'},
  {en:'"Every boss behind the gate was once a challenger."', vi:'"Mỗi quái vật sau cánh cổng từng là kẻ thách đấu."'},
  {en:'"Even the Nameless had a name, once."', vi:'"Ngay cả Kẻ Không Tên, từng có một cái tên."'},
  {en:'"THE UNLIMITED is not the end. It is the floor."', vi:'"VÔ LƯỢNG không phải điểm kết. Nó chỉ là nền móng."'},
  {en:'"You found this. Most never look."', vi:'"Ngươi đã tìm thấy nơi này. Hầu hết chẳng bao giờ tìm."'},
];

// ---------- i18n ----------
const I18N = {
  en: {
    tagline:'Farm your aura. Break the gates. Become unlimited.',
    yourName:'Your name', createRoom:'Create Room', joinRoom:'Join', roomCode:'Room code', openRooms:'Open rooms', noRooms:'No open rooms yet — create one!',
    soloNote:'Firebase not set → Local mode (other tabs in this browser can join).', onlineNote:'Online mode',
    room:'Room', players:'Players', leaderboard:'Leaderboard', roomTab:'Room', globalTab:'World',
    level:'Lv', capReached:'Your aura can grow no further. Go to the Dungeon Gate.', gateHint:'Dungeon Gate', enterGate:'Press E / tap to enter the Gate',
    moving:'Moving ×2', standing:'Standing ×1', well:'Aura Well ×1.5', auraPerSec:'Aura/s',
    codex:'Codex', rebirth:'Rebirth', stats:'Stats', settings:'Settings', support:'Support me', close:'Close', leave:'Leave room',
    hp:'HP', atk:'Aura Power', def:'Resolve', crit:'Crit', rebirths:'Rebirths', essence:'Essence', xpBonus:'Aura gain bonus', stelae:'Ancient Stelae',
    unknown:'???', locked:'Not yet discovered',
    rebirthTitle:'Rebirth', rebirthDesc:'Your level and aura title return to the beginning. In exchange you keep forever:',
    rebirthGain:'Essence gained', rebirthDo:'Be Reborn', rebirthLocked:'Something sleeps inside you. Grow stronger to awaken it.',
    rebirthEffect:'+{x} permanent Essence: all stats ×{a} → ×{b}, aura gain ×{m} total', essBonus:'Essence bonus', sanctRoad:'The road to the Sanctum has opened!', sanctUnknown:'???',
    fightStart:'FIGHT', victory:'VICTORY', defeat:'DEFEAT', newTitle:'NEW AURA TITLE', gateBroken:'Gate shattered',
    bossLoseHint:'Too weak. Level is capped — perhaps it is time to be reborn…',
    inspect:'Inspect', challenge:'Challenge (PvP)', pvpReq:'{n} challenges you to a duel!', accept:'Accept', decline:'Decline', pvpDeclined:'Duel declined.', pvpWaiting:'Waiting for answer…',
    pvpWins:'Duel wins', hiddenLv:'Their aura is too far above yours to read.',
    lang:'Language', mute:'Sound', exportSave:'Export save', importSave:'Import save', importPrompt:'Paste save code:', saved:'Saved', importOk:'Save imported!', importBad:'Invalid save code.',
    you:'You', host:'Host', tier:'Tier', next:'Next', joinFail:'Room not found or full.',
    stoneFound:'Ancient Stele found! Aura gain +5% forever.', wellFound:'You found an Aura Well.',
    controls:'WASD / Arrows / joystick to move · E to enter gates · tap a player to inspect',
    beyondUnlocked:'You reached the end of all names. The layers beyond await.',
    riftGate:'Rift Gate', riftCD:'Reopens in {t}', enterRift:'Enter Rift Gate', riftWin:'Rift conquered! +1 Conquest Mark · +{x} aura', riftMaxMarks:'Rift conquered! +{x} aura (Marks maxed)', riftLose:'The rift spat you out. Try again in 1 minute.',
    marks:'Conquest Marks', markEffect:'each: +1% aura gain, +0.5% all stats',
    eventSpawn:'{n} has opened somewhere! Step inside for ×5 aura!', eventGot:'AURA ×5 for {m} minutes!', eventNext:'Next event in {t}', eventLeft:'{n} closes in {t}', buff:'×5 Aura', riftsReset:'Blood Moon: all Rift Gates reopened!',
    transform:'TRANSFORMATION!',
    wardrobe:'Wardrobe', tabAura:'Auras', tabNick:'Nicknames', tabSkin:'Skins', equipped:'Equipped', equip:'Equip', locked:'Locked', unlockedNew:'Unlocked: {n}!', nickname:'Nickname', skin:'Skin', auraStyle:'Aura',
    pvpCooldown:'Duel requests on cooldown: {t}', pvpSeen:'{n} received your challenge…', pvpTimeout:'No answer. You can challenge again in 1 minute.', pvpDeclinedCD:'Duel declined. You can challenge again in 1 minute.', pvpBusy:'They are busy fighting — the request will wait.',
    gateSkip:'Conquered gate — passed automatically', speed:'Speed',
    trait:'Trait', mechTransform:'Transformation: heals {h}% HP, +{a}% attack at half HP', awaken:'AWAKENING', sanctum:'Four Symbols Sanctum', sanctLocked:'Sealed — reach realm 4 to break the seal', sanctEnter:'Challenge', sanctDragonLocked:'Defeat the Four Symbols first', sanctFirst:'First clear! +{p}% all stats forever', sanctAgain:'Defeated again! +{x} aura', threat:['Deadly','Very hard','Hard','Within reach'], sanctCD:'Resting ({t})', sanctCursedOn:'Curse mode', sanctNormal:'Normal', sanctCursedLocked:'The curse awakens after GODK and the Yellow Dragon', sanctBonus:'Sanctum blessing', sanctPath:'Sanctum Path', sanctNM:'Nightmare mode', hellFloor:'Hell · Floor {n}', bossTalents:'Boss talents', bossTalentsD:'From Tower floor 81 (Hell) bosses carry talents just like yours (see the Talents tab). Their rank rises with the floor. Shown on the HUD before you enter.', deformed:'Deformed', xeno:'Xeno Isle', xenoLocked:'Reach GODK to answer the signal', xenoGate:'Xeno Gate', xenoChallenge:'Challenge', xenoOpen:'The bridge to Xeno Isle has appeared!', xenoBack:'⇄ Back to Map 1 gate', xenoGo:'🛸 To Xeno Isle', xenoLv:'Xeno Lv {n}', xenoUp:'Xeno level {n}! +1% crit, +2% all stats', xenoCrater:'Crystal crater ×3', xenoRes:'Resonance ×{n}', xenoCore:'Mothership Core', xenoSpire:'Signal Spire', xenoNext:'Next: {n}', xenoDone:'All cleared', xenoReward:'Reward: {r}', xenoSlot:'+1 talent slot', xenoFirst:'Defeated {n}! {r}', xenoAgain:'Defeated again! +{x} aura', xenoBonus:'Xeno bonus', immune:'IMMUNE', guide:'Handbook', gStats:'Stats', gTraits:'Boss traits', gMech:'Boss mechanics', gTalent:'Talents', gCounter:'How to deal with it', gHow:'How to get', xenoSpireLocked:'Clear the Mothership Core first', xenoLose:'Stats alone will not win this. Open 📘 Handbook → Boss mechanics to read what it does.', caughtUp:'Back to your peak', catchupFx:'Title effects when re-passing old gates', on:'On', off:'Off', trans:'Transcend', transTitle:'✧ TRANSCENDENCE', transDesc:'Leave the cycle of rebirth forever. You keep EVERYTHING (stats, Essence, titles, Tower floor). From then on the aura you farm flows straight into Essence — no more climbing back from title 1.', transRate:'Your recent rebirth speed: {a} Essence/hour → after Transcending: {b} Essence/hour (×{m}), while farming (moving ×1, standing ×0.5).', transNeedR:'Rebirths: {c}/{v}', transNeedLog:'Measuring your rebirth speed: {c}/{v} rebirths since v2.2 (over ≥ {m} min)', transNeedX:'Defeat the Watcher in the Mothership Core', transNo:'Not yet — conditions:', transDo:'✧ Transcend', transSure:'This cannot be undone. Rebirth will be gone forever. Transcend?', transYes:'Yes, transcend', transDone:'You have transcended. Essence now flows with your aura.', transHud:'✧ +{x} Essence/h', transLocked:'Transcended — rebirth is gone', nmTier:'Nightmare {n}', nmDragonLocked:'All four must survive Nightmare {n} first', nmFirst:'Nightmare {n} survived! {r}', nmUnlockPas:'New talent: {n}', nmRankUp:'{n} → rank {r}', nmRankMax:'{n} is at max rank', nmSlot:'+1 talent slot!', talents:'Talents', talentSlots:'Slots {a}/{b}', talentHint:'Talents work in every fight (boss, tower, sanctum, PvP). Tap to equip / remove.', talentLocked:'Locked', talentRank:'Rank {r}/{m}', talentFull:'All slots are full — remove one first', src_sanct:'Nightmare Sanctum: survive Nightmare I of {n}', src_mirror:'Own 10 Mirror Shards', src_gear:'Equipment (coming soon)', nmSanct:'Nightmare Sanctum', nmTiers:'Nightmare tiers',
    towerFloor:'GodK Tower · Floor {n}', towerGuardian:'TOWER GUARDIAN', affixes:'This week', towerBest:'Tower: highest floor', towerNext:'Next floor {n}: {a}', weeklyReset:'Affixes change in {t}',
    bestiary:'Bestiary', bDiscovered:'Discovered {a} / {b}', bKills:'Defeated: {n}', bSeen:'Encountered', bWhere:'Found at', bLocked:'Not yet encountered',
    whereGate:'Dungeon Gate', whereTower:'GodK Tower', whereRift:'Rift Gate', whereRoam:'Wandering', whereMirror:'Mirror Gate', whereFinal:'Final Gate', whereSanct:'Four Symbols Sanctum',
    reachHidden:'Reach title ???', defeatHidden:'Defeat ???',
    memory:'Memory: {r}', replayEnding:'Watch the ending again', skip:'Skip',
    mirrorGate:'Mirror Gate', enterMirror:'Face your Reflection', mirrorChance:'Win chance: {p}%', mirrorWin:'You defeated yourself! +1 Mirror Shard (+{p}% all stats)', mirrorWinMax:'You defeated yourself again! (Shards maxed)', mirrorLose:'Your Reflection won. The mirror will open again in 3 minutes.', shards:'Mirror Shards', mirrorCD:'The mirror is clouded ({t})',
    roamName:'Wandering Horror', roamWin:'Horror banished! +{x} aura', roamWinMark:'Horror banished! +{x} aura · +1 Conquest Mark', challengeRoam:'Fight', roamCD:'It will return…',
    music:'Music', sfxVol:'Effects', auraVol:'Aura sound', audioFiles:'Custom audio files found: {n}', audioNone:'Using built-in chill music (put files in /audio to replace)',
  },
  vi: {
    tagline:'Cày bá khí. Phá cổng ngục. Trở thành vô lượng.',
    yourName:'Tên của bạn', createRoom:'Tạo Phòng', joinRoom:'Vào', roomCode:'Mã phòng', openRooms:'Phòng đang mở', noRooms:'Chưa có phòng nào — hãy tạo phòng!',
    soloNote:'Chưa cài Firebase → Chế độ Local (các tab khác cùng trình duyệt có thể vào).', onlineNote:'Chế độ Online',
    room:'Phòng', players:'Người chơi', leaderboard:'Bảng xếp hạng', roomTab:'Phòng', globalTab:'Thế giới',
    level:'Cấp', capReached:'Bá khí đã chạm giới hạn. Hãy đến Cổng Ngục.', gateHint:'Cổng Ngục', enterGate:'Nhấn E / chạm để vào Cổng',
    moving:'Di chuyển ×2', standing:'Đứng yên ×1', well:'Giếng Bá Khí ×1.5', auraPerSec:'Bá khí/s',
    codex:'Danh Hiệu', rebirth:'Tái Sinh', stats:'Chỉ Số', settings:'Cài Đặt', support:'Ủng hộ', close:'Đóng', leave:'Rời phòng',
    hp:'Sinh lực', atk:'Bá lực', def:'Ý chí', crit:'Bạo kích', rebirths:'Số lần tái sinh', essence:'Tinh hoa', xpBonus:'Thưởng bá khí', stelae:'Bia Cổ',
    unknown:'???', locked:'Chưa khám phá',
    rebirthTitle:'Tái Sinh', rebirthDesc:'Cấp độ và danh hiệu trở về khởi điểm. Đổi lại bạn giữ vĩnh viễn:',
    rebirthGain:'Tinh hoa nhận được', rebirthDo:'Tái Sinh', rebirthLocked:'Có thứ gì đó đang ngủ trong bạn. Mạnh hơn nữa để đánh thức nó.',
    rebirthEffect:'+{x} Tinh hoa vĩnh viễn: mọi chỉ số ×{a} → ×{b}, bá khí ×{m} tổng', essBonus:'Thưởng Tinh hoa', sanctRoad:'Con đường tới Thánh Địa đã mở!', sanctUnknown:'???',
    fightStart:'CHIẾN', victory:'CHIẾN THẮNG', defeat:'THẤT BẠI', newTitle:'DANH HIỆU MỚI', gateBroken:'Cổng đã vỡ',
    bossLoseHint:'Quá yếu. Cấp đã chạm trần — có lẽ đã đến lúc tái sinh…',
    inspect:'Xem', challenge:'Thách đấu (PvP)', pvpReq:'{n} thách đấu bạn!', accept:'Nhận', decline:'Từ chối', pvpDeclined:'Đối thủ từ chối.', pvpWaiting:'Đang chờ trả lời…',
    pvpWins:'Thắng PvP', hiddenLv:'Bá khí của họ vượt quá xa bạn, không thể nhìn thấu.',
    lang:'Ngôn ngữ', mute:'Âm thanh', exportSave:'Xuất save', importSave:'Nhập save', importPrompt:'Dán mã save:', saved:'Đã lưu', importOk:'Đã nhập save!', importBad:'Mã save không hợp lệ.',
    you:'Bạn', host:'Chủ phòng', tier:'Cảnh giới', next:'Tiếp', joinFail:'Không tìm thấy phòng hoặc phòng đã đầy.',
    stoneFound:'Tìm thấy Bia Cổ! Bá khí +5% vĩnh viễn.', wellFound:'Bạn đã tìm thấy Giếng Bá Khí.',
    controls:'WASD / Mũi tên / joystick để di chuyển · E để vào cổng · chạm vào người chơi để xem',
    beyondUnlocked:'Bạn đã chạm tới tận cùng mọi danh xưng. Các tầng phía sau đang chờ.',
    riftGate:'Cổng Hoang', riftCD:'Mở lại sau {t}', enterRift:'Vào Cổng Hoang', riftWin:'Chinh phục Cổng Hoang! +1 Ấn Chinh Phục · +{x} bá khí', riftMaxMarks:'Chinh phục Cổng Hoang! +{x} bá khí (Ấn đã tối đa)', riftLose:'Cổng Hoang đã đẩy bạn ra. Thử lại sau 1 phút.',
    marks:'Ấn Chinh Phục', markEffect:'mỗi ấn: +1% bá khí, +0.5% mọi chỉ số',
    eventSpawn:'{n} đã mở ra đâu đó! Bước vào để nhận ×5 bá khí!', eventGot:'BÁ KHÍ ×5 trong {m} phút!', eventNext:'Sự kiện tiếp theo sau {t}', eventLeft:'{n} đóng sau {t}', buff:'×5 Bá Khí', riftsReset:'Huyết Nguyệt: mọi Cổng Hoang đã mở lại!',
    transform:'BIẾN HÌNH!',
    wardrobe:'Tủ Đồ', tabAura:'Hào quang', tabNick:'Biệt hiệu', tabSkin:'Trang phục', equipped:'Đang dùng', equip:'Dùng', locked:'Chưa mở', unlockedNew:'Mở khóa: {n}!', nickname:'Biệt hiệu', skin:'Trang phục', auraStyle:'Hào quang',
    pvpCooldown:'Thách đấu đang hồi: {t}', pvpSeen:'{n} đã nhận được lời thách đấu…', pvpTimeout:'Không có phản hồi. Có thể thách đấu lại sau 1 phút.', pvpDeclinedCD:'Đối thủ từ chối. Có thể thách đấu lại sau 1 phút.', pvpBusy:'Đối thủ đang đánh boss — lời mời sẽ chờ.',
    gateSkip:'Cổng đã chinh phục — tự động vượt qua', speed:'Tốc độ',
    trait:'Đặc tính', mechTransform:'Biến hình: còn nửa máu thì hồi {h}% máu, +{a}% công', awaken:'THỨC TỈNH', sanctum:'Tứ Tượng Thánh Địa', sanctLocked:'Đang phong ấn — đạt cảnh giới 4 để phá ấn', sanctEnter:'Khiêu chiến', sanctDragonLocked:'Hạ đủ Tứ Tượng trước', sanctFirst:'Lần đầu chinh phục! +{p}% mọi chỉ số vĩnh viễn', sanctAgain:'Lại chiến thắng! +{x} bá khí', threat:['Chết chắc','Rất khó','Khó','Vừa sức'], sanctCD:'Đang nghỉ ({t})', sanctCursedOn:'Chế độ Nguyền Rủa', sanctNormal:'Thường', sanctCursedLocked:'Lời nguyền thức tỉnh sau GODK và Hoàng Long', sanctBonus:'Phúc lành Thánh Địa', sanctPath:'Đường Thánh Địa', sanctNM:'Chế độ Ác Mộng', hellFloor:'Địa Ngục · Tầng {n}', bossTalents:'Thiên phú của boss', bossTalentsD:'Từ tầng 81 Tháp (Địa Ngục), boss mang thiên phú giống của ngươi (xem tab Thiên phú). Hạng tăng theo tầng. Hiện trên HUD trước khi vào.', deformed:'Dị Dạng', xeno:'Hư Tinh Đảo', xenoLocked:'Đạt GODK để đáp lại tín hiệu', xenoGate:'Cổng Hư Tinh', xenoChallenge:'Khiêu chiến', xenoOpen:'Cây cầu tới Hư Tinh Đảo đã hiện ra!', xenoBack:'⇄ Về Cổng Map 1', xenoGo:'🛸 Tới Hư Tinh Đảo', xenoLv:'Hư Tinh cấp {n}', xenoUp:'Hư Tinh cấp {n}! +1% bạo kích, +2% mọi chỉ số', xenoCrater:'Hố Tinh Thể ×3', xenoRes:'Cộng hưởng ×{n}', xenoCore:'Lõi Mẫu Hạm', xenoSpire:'Tháp Tín Hiệu', xenoNext:'Tiếp theo: {n}', xenoDone:'Đã chinh phục hết', xenoReward:'Thưởng: {r}', xenoSlot:'+1 ô thiên phú', xenoFirst:'Đã hạ {n}! {r}', xenoAgain:'Lại chiến thắng! +{x} bá khí', xenoBonus:'Thưởng Hư Tinh', immune:'MIỄN', guide:'Sổ Tay', gStats:'Chỉ số', gTraits:'Đặc tính boss', gMech:'Cơ chế boss', gTalent:'Thiên phú', gCounter:'Cách giải', gHow:'Cách nhận', xenoSpireLocked:'Chinh phục Lõi Mẫu Hạm trước', xenoLose:'Chỉ số thôi chưa đủ. Mở 📘 Sổ Tay → Cơ chế boss để xem nó làm gì.', caughtUp:'Trở lại đỉnh cao', catchupFx:'Hiệu ứng danh hiệu khi vượt lại cổng cũ', on:'Bật', off:'Tắt', trans:'Siêu Thoát', transTitle:'✧ SIÊU THOÁT', transDesc:'Rời khỏi vòng luân hồi mãi mãi. Ngươi giữ lại TẤT CẢ (chỉ số, Tinh hoa, danh hiệu, tầng Tháp). Từ đó bá khí ngươi farm sẽ chảy thẳng thành Tinh hoa — không phải leo lại từ danh hiệu 1 nữa.', transRate:'Tốc độ tái sinh gần đây của ngươi: {a} Tinh hoa/giờ → sau Siêu Thoát: {b} Tinh hoa/giờ (×{m}), khi đang farm (di chuyển ×1, đứng yên ×0.5).', transNeedR:'Số lần tái sinh: {c}/{v}', transNeedLog:'Đang đo tốc độ tái sinh: {c}/{v} lần tái sinh từ v2.2 (trong ≥ {m} phút)', transNeedX:'Hạ Kẻ Quan Sát ở Lõi Mẫu Hạm', transNo:'Chưa đủ điều kiện:', transDo:'✧ Siêu Thoát', transSure:'Không thể hoàn tác. Tái sinh sẽ biến mất vĩnh viễn. Siêu Thoát?', transYes:'Đồng ý Siêu Thoát', transDone:'Ngươi đã Siêu Thoát. Tinh hoa giờ chảy theo bá khí.', transHud:'✧ +{x} Tinh hoa/giờ', transLocked:'Đã Siêu Thoát — không còn tái sinh', nmTier:'Ác Mộng {n}', nmDragonLocked:'Cả 4 Tứ Tượng phải vượt Ác Mộng {n} trước', nmFirst:'Vượt qua Ác Mộng {n}! {r}', nmUnlockPas:'Thiên phú mới: {n}', nmRankUp:'{n} → hạng {r}', nmRankMax:'{n} đã đạt hạng tối đa', nmSlot:'+1 ô thiên phú!', talents:'Thiên Phú', talentSlots:'Ô {a}/{b}', talentHint:'Thiên phú có tác dụng ở mọi trận (cổng, tháp, thánh địa, PvP). Bấm để trang bị / gỡ.', talentLocked:'Chưa mở', talentRank:'Hạng {r}/{m}', talentFull:'Hết ô — gỡ bớt một thiên phú trước', src_sanct:'Thánh Địa Ác Mộng: vượt Ác Mộng I của {n}', src_mirror:'Sở hữu 10 Mảnh Gương', src_gear:'Trang bị (sắp ra mắt)', nmSanct:'Thánh Địa Ác Mộng', nmTiers:'Bậc Ác Mộng',
    towerFloor:'Tháp GodK · Tầng {n}', towerGuardian:'HỘ VỆ THÁP', affixes:'Tuần này', towerBest:'Tháp: tầng cao nhất', towerNext:'Tầng {n}: {a}', weeklyReset:'Đổi hiệu ứng sau {t}',
    bestiary:'Bách Khoa Boss', bDiscovered:'Đã gặp {a} / {b}', bKills:'Đã hạ: {n}', bSeen:'Đã chạm trán', bWhere:'Xuất hiện ở', bLocked:'Chưa gặp',
    whereGate:'Cổng Ngục', whereTower:'Tháp GodK', whereRift:'Cổng Hoang', whereRoam:'Tà Ảnh lang thang', whereMirror:'Cổng Gương', whereFinal:'Cổng Cuối', whereSanct:'Tứ Tượng Thánh Địa',
    reachHidden:'Đạt danh hiệu ???', defeatHidden:'Đánh bại ???',
    memory:'Ký ức: {r}', replayEnding:'Xem lại màn kết', skip:'Bỏ qua',
    mirrorGate:'Cổng Gương', enterMirror:'Đối mặt Bóng Gương', mirrorChance:'Cơ hội thắng: {p}%', mirrorWin:'Ngươi đã thắng chính mình! +1 Mảnh Gương (+{p}% mọi chỉ số)', mirrorWinMax:'Ngươi lại thắng chính mình! (Mảnh Gương đã tối đa)', mirrorLose:'Bóng Gương đã thắng. Gương sẽ mở lại sau 3 phút.', shards:'Mảnh Gương', mirrorCD:'Gương đang mờ ({t})',
    roamName:'Tà Ảnh Lang Thang', roamWin:'Đã xua tan Tà Ảnh! +{x} bá khí', roamWinMark:'Đã xua tan Tà Ảnh! +{x} bá khí · +1 Ấn Chinh Phục', challengeRoam:'Giao chiến', roamCD:'Nó sẽ quay lại…',
    music:'Nhạc nền', sfxVol:'Hiệu ứng', auraVol:'Âm hào quang', audioFiles:'Đã nhận file âm thanh riêng: {n}', audioNone:'Đang dùng nhạc chill có sẵn (bỏ file vào thư mục /audio để thay)',
  }
};


// ===================== v1.3 cosmetics =====================
// requirement: [kind, value]; kinds: free, best (highest title), R (rebirths), pvpW, bossWins, riftWins, roamWins, events, wells, stelae, marks, dist
const REQ_TEXT = {
  free: { en:'Free', vi:'Miễn phí' }, best: { en:'Reach realm {c} (title #{v})', vi:'Đạt cảnh giới {c} (danh hiệu #{v})' }, R: { en:'Rebirth {v} times', vi:'Tái sinh {v} lần' },
  pvpW: { en:'Win {v} PvP duels', vi:'Thắng {v} trận PvP' }, bossWins: { en:'Defeat {v} Dungeon Gate bosses', vi:'Hạ {v} boss Cổng Ngục' }, riftWins: { en:'Conquer {v} Rift Gates', vi:'Chinh phục {v} Cổng Hoang' },
  roamWins: { en:'Banish {v} Wandering Horrors', vi:'Xua tan {v} Tà Ảnh' }, events: { en:'Enter {v} ×5 event gates', vi:'Vào {v} cổng sự kiện ×5' }, wells: { en:'Find {v} Aura Wells', vi:'Tìm {v} Giếng Bá Khí' },
  stelae: { en:'Find {v} Ancient Stelae', vi:'Tìm {v} Bia Cổ' }, sanctN: { en:'Conquer the Four Symbols Sanctum', vi:'Chinh phục Tứ Tượng Thánh Địa' }, sanctC: { en:'Break the Sanctum curse', vi:'Phá lời nguyền Thánh Địa' }, nmAll: { en:'Survive Nightmare {v} on all Five Symbols', vi:'Vượt Ác Mộng bậc {v} ở cả 5 Tứ Tượng' }, trans: { en:'Transcend', vi:'Siêu Thoát' }, xs: { en:'Defeat the Nebula Sower on Xeno Isle', vi:'Hạ Kẻ Gieo Hạt Tinh Vân ở Hư Tinh Đảo' }, xl: { en:'Reach Xeno level {v}', vi:'Đạt Hư Tinh cấp {v}' }, finalWins: { en:'Defeat the Last Reflection', vi:'Đánh bại Bóng Gương Tối Hậu' }, mirrorWins: { en:'Defeat your Reflection {v} times', vi:'Đánh bại Bóng Gương {v} lần' }, marks: { en:'Own {v} Conquest Marks', vi:'Sở hữu {v} Ấn Chinh Phục' }, dist: { en:'Travel {v} distance', vi:'Di chuyển quãng đường {v}' },
};
function reqProgress(S, req){ const st = S.stats || {}; const [k, v] = req;
  const cur = k === 'trans' ? (S.trans ? 1 : 0) : k === 'xs' ? (S.xs || 0) : k === 'xl' ? ((S.xeno || {}).lv || 0) : k === 'nmAll' ? Math.min(...SYMBOLS.map(x => (S.nm||{})[x.id] || 0)) : k === 'sanctN' ? SYMBOLS.filter(x => (S.sanct||{})[x.id]).length : k === 'sanctC' ? SYMBOLS.filter(x => (S.sanct||{})[x.id + '_c']).length : k === 'free' ? 1 : k === 'best' ? S.best : k === 'R' ? S.R : k === 'pvpW' ? S.pvpW : k === 'wells' ? (S.wells||[]).length : k === 'stelae' ? (S.stelae||[]).length : k === 'marks' ? (S.marks||0) : (st[k] || 0);
  return [cur, k === 'free' ? 1 : v]; }
function reqMet(S, req){ const [c, v] = reqProgress(S, req); return c >= v; }
function reqText(req, lang){ const [k, v] = req; return REQ_TEXT[k][lang].replace('{v}', k === 'dist' ? (v/1000) + 'K' : v).replace('{c}', k === 'best' ? (tierOf(v) + 1) : ''); }

// Aura styles (override the realm aura colour/effects; the realm still decides the size)
const AURA_SKINS = [
  { id:'realm',    en:'Realm Aura',        vi:'Hào Quang Cảnh Giới',  req:['free',0] },
  { id:'instinct', en:'Silver Instinct',   vi:'Bản Năng Vô Cực',      req:['pvpW',5],     over:{ h:215, s:30, l:90, oh:255, os:70, wisps:1, rings:1, embers:1 } },
  { id:'golden',   en:'Golden Warrior',    vi:'Chiến Binh Hoàng Kim', req:['best',OT(41)],    over:{ h:50, s:100, l:60, oh:40, os:100, sparks:1, lightningFrom:1, embers:2 } },
  { id:'azure',    en:'Azure Divinity',    vi:'Lam Thần',             req:['best',OT(61)],    over:{ h:195, s:100, l:62, oh:210, os:100, embers:2, halo:1 } },
  { id:'rose',     en:'Rose Divinity',     vi:'Hồng Thần',            req:['R',2],        over:{ h:330, s:90, l:66, oh:300, os:90, embers:2, sparks:1 } },
  { id:'berserk',  en:'Berserk',           vi:'Cuồng Bạo',            req:['bossWins',50],over:{ h:0, s:100, l:48, oh:350, os:100, darkCore:1, lightning:1, cracks:1 } },
  { id:'frost',    en:'Frost Prison',      vi:'Băng Ngục',            req:['wells',5],    over:{ h:190, s:80, l:85, oh:200, os:90, frost:1 } },
  { id:'thunder',  en:'Thunder God',       vi:'Lôi Thần',             req:['riftWins',15],over:{ h:56, s:100, l:70, oh:220, os:100, lightning:1, sparks:1 } },
  { id:'shadow',   en:'Shadow Flame',      vi:'Hắc Viêm',             req:['roamWins',15],over:{ h:275, s:80, l:45, oh:285, os:100, darkCore:1, inward:1 } },
  { id:'sakura',   en:'Sakura Storm',      vi:'Bão Anh Đào',          req:['events',5],   over:{ h:335, s:80, l:80, oh:345, os:90, petals:1 } },
  { id:'jade',     en:'Jade Dragon',       vi:'Ngọc Long',            req:['stelae',12],  over:{ h:150, s:85, l:58, oh:165, os:100, embers:2, runes:1 } },
  { id:'galaxy',   en:'Galaxy',            vi:'Thiên Hà',             req:['R',5],        over:{ h:250, s:90, l:62, oh:290, os:100, stars:1, nebula:1 } },
  { id:'ego',      en:'Destroyer Ego',     vi:'Bản Ngã Hủy Diệt',     req:['pvpW',20],    over:{ h:285, s:90, l:55, oh:300, os:100, darkCore:1, lightning:1, embers:2 } },
  { id:'solar',    en:'Solar Flare',       vi:'Thái Dương Hỏa',       req:['best',OT(150)],   over:{ h:30, s:100, l:62, oh:15, os:100, rays:1, embers:3 } },
  { id:'shattered',en:'Shattered Mirror',  vi:'Gương Vỡ Vô Lượng',    req:['finalWins',1],over:{ h:350, s:85, l:72, oh:195, os:90, glass:1, afterimage:1, lightning:1, halo:1, embers:2 } }, // v1.6 final-boss reward
  { id:'foursym',  en:'Four Symbols',      vi:'Tứ Tượng Hộ Thể',      req:['sanctN',5],   over:{ h:48, s:100, l:62, oh:165, os:100, foursym:1, embers:2, halo:1 } },
  { id:'cursedking',en:'Cursed Emperor',   vi:'Huyết Long Nguyền',    req:['sanctC',5],   over:{ h:285, s:90, l:45, oh:350, os:100, darkCore:1, foursym:2, lightning:1, embers:3 } },
  { id:'nightmare',en:'Thousand Eyes',     vi:'Vạn Nhãn Ác Mộng',     req:['nmAll',3],    over:{ h:355, s:90, l:42, oh:340, os:100, darkCore:1, nmEyes:1, embers:2 } }, // v2.0 Nightmare Sanctum
  { id:'xenoaura', en:'Xeno Signal',       vi:'Tín Hiệu Hư Tinh',     req:['xs',6],       over:{ h:180, s:100, l:60, oh:285, os:100, xenoRing:1, stars:1, sparks:1 } }, // v2.1 Xeno Isle
  { id:'transcend',en:'Transcendence',     vi:'Siêu Thoát',           req:['trans',1],    over:{ h:48, s:60, l:88, oh:200, os:90, halo:1, rays:1, stars:1, wisps:1, rings:1 } }, // v2.2
  { id:'prism',    en:'Prism Unlimited',   vi:'Vô Lượng Lăng Kính',   req:['best',OT(200)],   over:{ h:0, s:100, l:65, oh:0, os:100, rainbow:1, rays:1, halo:1, stars:1 } },
];
// Nicknames (secondary titles shown above your name)
const NICKS = [
  { id:'none',        en:'(none)',              vi:'(không)',               req:['free',0] },
  { id:'instinct',    en:'Silver Instinct',     vi:'Bản Năng Vô Cực',       req:['pvpW',5] },
  { id:'duelist',     en:'Undefeated Duelist',  vi:'Kẻ Bất Bại',            req:['pvpW',10] },
  { id:'reborn',      en:'The Reborn',          vi:'Kẻ Tái Sinh',           req:['R',1] },
  { id:'phoenix',     en:'Phoenix',             vi:'Bất Tử Điểu',           req:['R',3] },
  { id:'cycle',       en:'Endless Cycle',       vi:'Luân Hồi Vô Tận',       req:['R',6] },
  { id:'slayer',      en:'Boss Slayer',         vi:'Đồ Tể Boss',            req:['bossWins',100] },
  { id:'breaker',     en:'Gate Breaker',        vi:'Kẻ Phá Cổng',           req:['riftWins',10] },
  { id:'hunter',      en:'Horror Hunter',       vi:'Thợ Săn Tà Ảnh',        req:['roamWins',10] },
  { id:'wanderer',    en:'Wanderer',            vi:'Kẻ Lữ Hành',            req:['dist',300000] },
  { id:'scholar',     en:'Stele Reader',        vi:'Người Đọc Bia',         req:['stelae',12] },
  { id:'wellkeeper',  en:'Well Keeper',         vi:'Thủy Linh',             req:['wells',5] },
  { id:'chaser',      en:'Event Chaser',        vi:'Kẻ Săn Sự Kiện',        req:['events',10] },
  { id:'marklord',    en:'Mark Lord',           vi:'Ấn Chủ',                req:['marks',60] },
  { id:'emperor',     en:'Aura Emperor',        vi:'Hoàng Đế Bá Khí',       req:['best',OT(50)] },
  { id:'god',         en:'Aura God',            vi:'Thần Bá Khí',           req:['best',OT(69)] },
  { id:'cosmic',      en:'Lord of the Stars',   vi:'Chúa Tể Tinh Không',    req:['best',OT(97)] },
  { id:'unlimited',   en:'Master of the Unlimited', vi:'Vô Lượng Chi Chủ',  req:['best',OT(200)] },
  { id:'eclipse',     en:'Eclipse Bearer',      vi:'Kẻ Mang Nhật Thực',     req:['best',OT(203)] },
  { id:'paradox',     en:'Living Paradox',      vi:'Nghịch Lý Sống',        req:['best',OT(222)] },
  { id:'godk',        en:'GodK',                vi:'GodK',                  req:['best',MAX_TITLE] },
  { id:'dragonslayer',en:'Dragon Emperor\'s Bane', vi:'Kẻ Hạ Hoàng Long',  req:['sanctN',5] },
  { id:'cursebreaker',en:'Curse Breaker',        vi:'Kẻ Phá Lời Nguyền',  req:['sanctC',5] },
  { id:'transcended', en:'The Transcended',   vi:'Kẻ Siêu Thoát',     req:['trans',1] },
  { id:'visitor',    en:'Visitor from the Void', vi:'Kẻ Đến Từ Hư Tinh', req:['xs',6] },
  { id:'resonant',   en:'Resonant',            vi:'Cộng Hưởng',        req:['xl',50] },
  { id:'nmsurvivor', en:'Nightmare Survivor',   vi:'Kẻ Sống Sót Ác Mộng', req:['nmAll',1] },
  { id:'nmlord',     en:'Lord of Nightmares',   vi:'Chúa Tể Ác Mộng',    req:['nmAll',5] },
  { id:'mirrorbreaker',en:'Mirror Breaker',     vi:'Kẻ Vượt Gương',         req:['finalWins',1] },
  { id:'self',        en:'Self-Conqueror',      vi:'Kẻ Vượt Qua Chính Mình', req:['mirrorWins',1] },
  { id:'mirrormaster',en:'Master of Mirrors',   vi:'Chủ Nhân Của Gương',    req:['mirrorWins',5] },
  { id:'murimlord',   en:'Murim Lord',          vi:'Võ Lâm Minh Chủ',       req:['pvpW',25] },
];
// Character skins (body colour + accessories)
const SKINS = [
  { id:'classic',  en:'Classic',          vi:'Cổ Điển',            req:['free',0],      acc:[] },
  { id:'headband', en:'Fighter Headband', vi:'Đai Võ Sĩ',          req:['free',0],      acc:['headband'] },
  { id:'scarf',    en:'Red Scarf',        vi:'Khăn Quàng Đỏ',      req:['free',0],      acc:['scarf'] },
  { id:'nonla',    en:'Conical Hat',      vi:'Nón Lá',             req:['free',0],      acc:['nonla'] },
  { id:'spiky',    en:'Spiky Hair',       vi:'Tóc Dựng',           req:['best',OT(21)],     acc:['spiky'] },
  { id:'shades',   en:'Cool Shades',      vi:'Kính Râm',           req:['events',3],    acc:['shades'] },
  { id:'sword',    en:'Wandering Blade',  vi:'Kiếm Khách',         req:['pvpW',3],      acc:['sword', 'headband'] },
  { id:'ninja',    en:'Ninja',            vi:'Ninja',              req:['riftWins',5],  acc:['ninja'], body:'#2a2f3a' },
  { id:'fox',      en:'Fox Mask',         vi:'Mặt Nạ Hồ Ly',       req:['roamWins',5],  acc:['fox'] },
  { id:'horns',    en:'Demon Horns',      vi:'Sừng Quỷ',           req:['bossWins',30], acc:['horns'], body:'#ffb0a0' },
  { id:'crown',    en:'King\'s Crown',    vi:'Vương Miện',         req:['best',OT(48)],     acc:['crown', 'cape'] },
  { id:'halo',     en:'Seraph',           vi:'Thiên Sứ',           req:['best',OT(61)],     acc:['halo', 'wings'] },
  { id:'shadow',   en:'Shadow Self',      vi:'Bóng Tối',           req:['R',4],         acc:[], body:'#0b0b10', outline:'#cfc6ff' },
  { id:'gold',     en:'Golden Body',      vi:'Thân Hoàng Kim',     req:['best',OT(100)],    acc:['cape'], body:'#ffd34a' },
  { id:'cosmic',   en:'Starborn',         vi:'Thân Tinh Tú',       req:['best',OT(150)],    acc:['starbody'], body:'#1d2560', outline:'#9fb4ff' },
  { id:'emperor',  en:'Unlimited Emperor',vi:'Hoàng Đế Vô Lượng',  req:['best',OT(200)],    acc:['crown', 'cape', 'halo'], body:'#fff6d8' },
  { id:'thena',    en:'Thena\'s Murim',   vi:'Thena\'s Murim',     req:['pvpW',15],     acc:['murim'], body:'#f7f2e8' }, // v1.5 murim swordsman
];
const byId = (arr, id) => arr.find(x => x.id === id) || arr[0];
const PVP_COOLDOWN = 60*1000, PVP_REQ_TTL = 45*1000;


// ===================== v1.8 GodK Tower (endgame after title 300) =====================
// The gate fight at title g (g ≥ 300) is Tower Floor g − 299. Every 10th floor: a Tower Guardian. Weekly affixes.
const towerFloor = g => g - MAX_TITLE + 1;
const TOWER_GUARDIANS = [
  { id:'warden',     en:'The Tower Warden',        vi:'Kẻ Gác Tháp',            hue: 30,  intro:{en:['Every key to this tower hangs from its chains.','None of them open the way back.'],vi:['Mọi chìa khóa của tòa tháp treo trên xiềng xích của nó.','Không chiếc nào mở được đường quay về.']}},
  { id:'skydragon',  en:'The Celestial Dragon Emperor', vi:'Thiên Long Đế',      hue: 45,  intro:{en:['Thunder rolls inside the tower.','A dragon older than the sky opens one eye.'],vi:['Sấm rền vang bên trong tòa tháp.','Một con rồng già hơn cả bầu trời mở một mắt.']}},
  { id:'asura',      en:'The Thousand-Armed Asura',vi:'Thiên Thủ A Tu La',       hue: 0,   intro:{en:['Three faces. A thousand hands.','Every hand holds a weapon that once killed a god.'],vi:['Ba khuôn mặt. Nghìn cánh tay.','Mỗi bàn tay cầm một món vũ khí từng giết một vị thần.']}},
  { id:'titan',      en:'The Star-Forged Titan',   vi:'Tinh Thần Cự Nhân',       hue: 220, intro:{en:['Its body is a constellation.','It was built to hold the sky up. Now it wants to drop it.'],vi:['Thân thể nó là một chòm sao.','Nó được tạo ra để chống trời. Giờ nó muốn thả trời xuống.']}},
  { id:'leviathan',  en:'The Void Leviathan',      vi:'Hư Không Cự Kình',        hue: 260, intro:{en:['The floor is gone. So is the sky.','Something vast is swimming through nothing.'],vi:['Mặt sàn biến mất. Bầu trời cũng vậy.','Có thứ gì khổng lồ đang bơi trong hư không.']}},
  { id:'othergodk',  en:'GodK of Another World',   vi:'GodK Dị Giới',            hue: 0,   intro:{en:['In another world, someone also reached 300.','They did not stop there.'],vi:['Ở một thế giới khác, có kẻ cũng đã đạt 300.','Kẻ đó đã không dừng lại.']}},
];
// floors 70 and 80: the cursed archangels (defined below) join the guardian rotation
function towerBoss(fl){
  if (fl >= TOWER_NEW_FROM && fl <= HELL_TO) return hellBoss(fl); // v2.3 floors 81–100: Hell
  if (fl % 10 === 0) return TOWER_GUARDIANS[(fl/10 - 1) % TOWER_GUARDIANS.length];
  const pool = HIGH_BOSSES.concat(UNLIMITED_BOSSES, [BOSSES[9], BOSSES[10]], EXTRA_BOSSES.filter(b => ['demoncult','bloodsword','reaper','bonedragon','hydra','sphinx','oni','tiangou'].includes(b.id)));
  let h = (fl*2654435761) >>> 0; return pool[h % pool.length];
}
const towerCycle = fl => Math.floor((fl - 1)/(TOWER_GUARDIANS.length*10)); // guardians return stronger each full cycle
const towerForm = fl => [9, 10, 11, 12][Math.min(3, Math.floor((fl - 1)/15))];
function towerBossName(B, fl, lang){ const n = lang === 'vi' ? B.vi : B.en; if (B.hell) return n; const c = towerCycle(fl); return c > 0 ? `${n} ${roman(c + 1)}` : n; }

// Weekly affixes — same for every player (week index from the shared clock)
const AFFIXES = [
  { id:'regen',  en:'Regeneration', vi:'Hồi Sinh',     ico:'💚', d:{en:'Boss heals 3% max HP every turn', vi:'Boss hồi 3% máu tối đa mỗi lượt'} },
  { id:'thorns', en:'Thorns',       vi:'Phản Đòn',     ico:'🌵', d:{en:'Reflects 20% of damage taken', vi:'Phản lại 20% sát thương nhận vào'} },
  { id:'crit',   en:'Deadly',       vi:'Chí Mạng',     ico:'🎯', d:{en:'Boss crit 35%, crits ×3', vi:'Boss bạo kích 35%, bạo kích ×3'} },
  { id:'shield', en:'Aegis',        vi:'Khiên Thần',   ico:'🛡', d:{en:'Takes 50% damage while above half HP', vi:'Chỉ nhận 50% sát thương khi còn trên nửa máu'} },
  { id:'leech',  en:'Lifesteal',    vi:'Hút Máu',      ico:'🩸', d:{en:'Heals 30% of damage dealt', vi:'Hồi 30% sát thương gây ra'} },
  { id:'enrage', en:'Enrage',       vi:'Cuồng Nộ',     ico:'🔥', d:{en:'+6% attack every turn', vi:'+6% tấn công mỗi lượt'} },
  { id:'armor',  en:'Adamant',      vi:'Kim Cương',    ico:'💎', d:{en:'Defense ×2', vi:'Phòng thủ ×2'} },
  { id:'twin',   en:'Double Strike',vi:'Song Kích',    ico:'⚔', d:{en:'Every 3rd turn the boss strikes twice', vi:'Mỗi 3 lượt boss đánh 2 lần'} },
  { id:'void',   en:'Void Aura',    vi:'Hư Vô',        ico:'🌀', d:{en:'Your crit chance is 0', vi:'Bạn không thể bạo kích'} },
  { id:'giant',  en:'Colossal',     vi:'Khổng Lồ',     ico:'🗿', d:{en:'Boss HP ×1.6', vi:'Máu boss ×1.6'} },
];
const WEEK_MS = 7*24*3600*1000, WEEK_EPOCH = Date.UTC(2026, 10, 23); // weeks start Monday
const weekIndex = now => Math.floor((now - WEEK_EPOCH) / WEEK_MS);
function towerAffixes(fl, now){
  const n = fl < 10 ? 1 : fl < 30 ? 2 : 3, w = weekIndex(now); let h = ((w + 7) * 2246822519 ^ fl * 3266489917) >>> 0;
  const out = [], ids = AFFIXES.map((_, i) => i);
  for (let i = 0; i < n; i++) { h = (h * 1103515245 + 12345) >>> 0; out.push(AFFIXES[ids.splice(h % ids.length, 1)[0]]); }
  return out;
}

// Bestiary: every boss in the game (new arrays added later appear automatically)
const bestiaryList = () => BOSSES.concat(EXTRA_BOSSES, typeof TRAIT_BOSSES !== 'undefined' ? TRAIT_BOSSES.concat(ARCHANGELS) : [], UNLIMITED_BOSSES, HIGH_BOSSES, [MIRROR_BOSS, FINAL_MIRROR], TOWER_GUARDIANS, typeof SYMBOLS !== 'undefined' ? SYMBOLS.concat(SYMBOLS.map(x => symbolBoss(x, 1)), typeof NM_BOSSES !== 'undefined' ? NM_BOSSES : [], typeof XENO_BOSSES !== 'undefined' ? XENO_BOSSES : [], typeof HELL_ALL !== 'undefined' ? HELL_ALL : []) : []);


// ===================== v1.9 boss TRAITS =====================
// multipliers on hp / atk / def (balanced by simulation: ~15–20% harder; archangels ~30% harder)
const TRAITS = {
  hp:      { ico:'❤', en:'Colossal HP',      vi:'Máu cực cao',     m:[2.2, 0.7, 0.85] },
  def:     { ico:'🛡', en:'Iron Defense',     vi:'Thủ cực cao',     m:[1.15, 0.75, 3.6] },
  atk:     { ico:'⚔', en:'Brutal Attack',    vi:'Công cực cao',    m:[0.65, 1.75, 0.85] },
  archatk: { ico:'🗡', en:'Annihilating Attack', vi:'Công hủy diệt', m:[0.7, 2.1, 0.9] },
  archdef: { ico:'🏰', en:'Unbreakable Defense', vi:'Thủ bất hoại',  m:[1.5, 0.65, 5.0] },
};
function applyTrait(st, B){ const T_ = B && B.trait && TRAITS[B.trait]; if (!T_) return st; const [h, a, d] = T_.m; return Object.assign({}, st, { hp: st.hp*h, atk: st.atk*a, def: st.def*d }); }
const TRAIT_BOSSES = [
  { id:'lich',     trait:'hp',  en:'The Undying Lich King', vi:'Bất Diệt Thi Vương', hue: 160, intro:{en:['It has died a thousand times.','It did not notice.'],vi:['Nó đã chết cả nghìn lần.','Nó chẳng hề để ý.']}},
  { id:'ironarmor',trait:'def', en:'The Iron Demon God',    vi:'Thiết Giáp Ma Thần',  hue: 210, intro:{en:['A fortress learned to walk.','Your strikes ring like bells on its armor.'],vi:['Một tòa thành đã học cách bước đi.','Đòn đánh của ngươi vang như chuông trên giáp nó.']}},
  { id:'berserker',trait:'atk', en:'The Mad Blade Demon',   vi:'Cuồng Đao Quỷ',      hue: 0,   intro:{en:['It does not defend.','It does not need to.'],vi:['Nó không phòng thủ.','Nó không cần phải thế.']}},
];
const ARCHANGELS = [
  { id:'archwrath', trait:'archatk', en:'Archangel of Ruin',     vi:'Thiên Sứ Hủy Diệt', hue: 45,  intro:{en:['Six wings. One flaming sword.','Judgement does not miss.'],vi:['Sáu cánh. Một thanh kiếm lửa.','Phán quyết không bao giờ trượt.']}},
  { id:'archward',  trait:'archdef', en:'Archangel of the Aegis',vi:'Thiên Sứ Thủ Hộ',   hue: 200, intro:{en:['A wall of light stands before you.','Nothing has ever passed it.'],vi:['Một bức tường ánh sáng chắn trước mặt.','Chưa thứ gì từng vượt qua.']}},
];
// cursed archangels — Tower Guardians of floors 70 and 80
const CURSED_ARCHANGELS = [
  { id:'archwrath_c', base:'archwrath', cursed:1, trait:'archatk', aff:['enrage'], en:'Fallen Archangel of Ruin', vi:'Thiên Sứ Hủy Diệt · Nguyền Rủa', hue: 0, intro:{en:['Its halo has turned to thorns.','Its sword now burns black.'],vi:['Vầng hào quang đã hóa thành gai.','Thanh kiếm giờ cháy lửa đen.']}},
  { id:'archward_c',  base:'archward',  cursed:1, trait:'archdef', aff:['regen'],  en:'Fallen Archangel of the Aegis', vi:'Thiên Sứ Thủ Hộ · Nguyền Rủa', hue: 280, intro:{en:['The wall of light is bleeding.','It will not fall. It cannot.'],vi:['Bức tường ánh sáng đang rỉ máu.','Nó sẽ không ngã. Nó không thể ngã.']}},
];
TOWER_GUARDIANS.push(...CURSED_ARCHANGELS);

// ===================== v1.9 Four Symbols Sanctum (super dungeon) =====================
// v2.0: the Sanctum lies OUTSIDE the square map (east). The gate is inside; the road appears only after you qualify and step through it.
const SANCTUM = { x: 6100, y: -2600, gate: [3860, -2600], unlockTitle: 76, road: 130, radius: 600 };
const SYMBOLS = [ // dx, dy from sanctum center; aff = signature mechanic
  { id:'azure',   dx:  0,   dy:-380, trait:'hp',  aff:['leech'],  en:'Azure Dragon of the East',   vi:'Thanh Long',  hue: 165, intro:{en:['Spring wind. Endless scales.','It drinks the life from everything it touches.'],vi:['Gió xuân. Vảy dài bất tận.','Nó hút sinh khí của mọi thứ nó chạm vào.']}},
  { id:'tiger',   dx:  430, dy:   0, trait:'atk', aff:['twin'],   en:'White Tiger of the West',    vi:'Bạch Hổ',     hue: 0,   intro:{en:['Autumn steel. A roar like a blade.','It strikes twice before you blink.'],vi:['Thép mùa thu. Tiếng gầm như lưỡi đao.','Nó vồ hai lần trước khi ngươi kịp chớp mắt.']}},
  { id:'phoenix', dx:  0,   dy: 380, trait:null,  aff:['regen','crit'], en:'Vermilion Bird of the South', vi:'Chu Tước', hue: 15,  intro:{en:['Summer fire. Wings of the sun.','Every ember of it is reborn.'],vi:['Lửa mùa hạ. Đôi cánh mặt trời.','Mỗi tàn lửa của nó đều tái sinh.']}},
  { id:'tortoise',dx: -430, dy:   0, trait:'def', aff:['shield'], en:'Black Tortoise of the North', vi:'Huyền Vũ',    hue: 200, intro:{en:['Winter water. A shell older than mountains.','A serpent coils around it, watching.'],vi:['Nước mùa đông. Mai rùa già hơn núi non.','Một con rắn quấn quanh nó, theo dõi.']}},
  { id:'yellowdragon', dx: 0, dy: 0, center:1, trait:'hp', aff:['enrage','armor'], en:'Yellow Dragon of the Center', vi:'Hoàng Long', hue: 48, intro:{en:['The four bow their heads.','The Emperor of all dragons descends to the center.'],vi:['Tứ Tượng cúi đầu.','Hoàng đế của muôn rồng giáng xuống trung tâm.']}},
];
// v1.9b: FIXED strength (gate-boss equivalent title) — no longer scales with your current title, so rebirthing can't trivialise it.
// v1.9.2: calibrated on POWER vs play time with the strongest strategy (rebirth every ~2 min), not on rebirth count:
// Four Symbols ~12h, Yellow Dragon ~16h, cursed Symbols ~28h, cursed Dragon ~36h. Players who only rebirth when stuck: ~18h / ~29h / >45h.
const SANCT_REF = { normal: [218, 252], cursed: [330, 346] }; // [four symbols, Yellow Dragon] — v2.1: fight-accurate sim incl. mechanics + Boss Ascension
const SANCT_CD_WIN = 10*60*1000, SANCT_CD_LOSE = 90*1000, SANCT_XP_SEC = 150;
const SANCT_BONUS = { normal: [0.05, 0.15], cursed: [0.10, 0.30] }; // v2.2 buff (was 2/5 · 4/10 %) // permanent all-stat bonus on first clear (each symbol / dragon)
const symbolBoss = (sym, cursed) => cursed ? Object.assign({}, sym, { id: sym.id + '_c', base: sym.id, cursed: 1, aff: sym.aff.concat(['void']), en: sym.en.replace(/ of the .*/, '') + ' · Cursed', vi: sym.vi + ' · Nguyền Rủa', intro: { en: ['A curse has soaked into the ' + (sym.center ? 'emperor' : 'guardian') + '.', 'Its eyes are no longer its own.'], vi: ['Lời nguyền đã ngấm vào ' + (sym.center ? 'vị hoàng đế' : 'vị thủ vệ') + '.', 'Đôi mắt ấy không còn là của nó nữa.'] } }) : sym;
function sanctBonus(S){ const s = S.sanct || {}; let b = 0; for (const sym of SYMBOLS) { if (s[sym.id]) b += SANCT_BONUS.normal[sym.center ? 1 : 0]; if (s[sym.id + '_c']) b += SANCT_BONUS.cursed[sym.center ? 1 : 0]; } return b; }
const sanctCursedOpen = S => S.best >= MAX_TITLE && !!(S.sanct || {}).yellowdragon;

// ======================================================================================================
// v1.11 FOUNDATION — equipment & player passives. DATA + PLUMBING ONLY: both features are OFF.
// Nothing here changes the game while FEATURE_GEAR / FEATURE_PASSIVES are false. See GHI-CHU (v1.12).
// ======================================================================================================
const FEATURE_GEAR = false, FEATURE_PASSIVES = true; // v2.0: passives ON (gear still off)
const GEAR_SLOTS = ['weapon', 'armor', 'charm'];
const GEAR_RARITY = [ // stat budget multiplier per rarity (for future drops)
  { id:'common',    en:'Common',    vi:'Thường',     col:'#c8c8c8', m:1.0 },
  { id:'rare',      en:'Rare',      vi:'Hiếm',       col:'#5aa9ff', m:1.6 },
  { id:'epic',      en:'Epic',      vi:'Sử Thi',     col:'#c070ff', m:2.4 },
  { id:'legend',    en:'Legendary', vi:'Huyền Thoại', col:'#ffb040', m:3.5 },
  { id:'godk',      en:'GodK',      vi:'GodK',       col:'#ff5a8a', m:5.0 },
];
// Gear item shape (S.gear.inv / S.gear.slots[slot]):
//   { uid, slot:'weapon'|'armor'|'charm', rar:'rare', lv:<gate it dropped at>, st:{ hp:0.05, atk:0, def:0, crit:0 }, pas:'lifesteal'|null }
//   st = additive % bonuses (0.05 = +5%), multiplied on top of everything else; crit is flat (+0.02 = +2%).
function gearMult(S){
  const out = { hp: 1, atk: 1, def: 1, crit: 0 };
  if (!FEATURE_GEAR || !S.gear || !S.gear.slots) return out;
  for (const sl of GEAR_SLOTS) { const it = S.gear.slots[sl]; if (!it || !it.st) continue;
    out.hp *= 1 + (it.st.hp || 0); out.atk *= 1 + (it.st.atk || 0); out.def *= 1 + (it.st.def || 0); out.crit += it.st.crit || 0; }
  return out;
}
// Player passives ("Thiên Phú"). Same idea as boss AFFIXES but as hooks, so either side of a fight can carry them.
// Hooks (all optional), c = { f: fight, me: side, foe: side }:
//   onDeal(c, d) → new outgoing damage · onTake(c, d) → new incoming damage · onTurn(c) · onDeath(c) → true = survive
// v2.0: passives are ON. Ranks come from the Nightmare Sanctum (rank = highest Nightmare tier survived on that symbol, max 10).
const PASSIVE_RANK_MAX = 10;
const prk = (c, id) => Math.max(1, Math.min(PASSIVE_RANK_MAX, (c.me.prank && c.me.prank[id]) || 1));
const PASSIVES = {
  lifesteal: { ico:'🐉', en:'Corpse Dragon\'s Thirst', vi:'Long Thi Hút Huyết', src:'sanct:azure',
    d:{ en:'Heal {v}% of damage dealt', vi:'Hồi {v}% sát thương gây ra' }, val: r => 5 + (r - 1),
    onDeal: (c, d) => { if (!(c.foe.pas || []).includes('purify')) c.me.hp = Math.min(c.me.st.hp, c.me.hp + d*(5 + prk(c, 'lifesteal') - 1)/100); return d; } },
  tigerfang:  { ico:'🐯', en:'Faceless Fang', vi:'Nanh Vô Diện', src:'sanct:tiger',
    d:{ en:'Every 4th hit deals ×{v}', vi:'Mỗi đòn thứ 4 gây ×{v}' }, val: r => (2 + 0.1*(r - 1)).toFixed(1),
    onDeal: (c, d) => (c.f.round % 4 === 0 ? d*(2 + 0.1*(prk(c, 'tigerfang') - 1)) : d) },
  rebirth:    { ico:'🔥', en:'Ashen Rebirth', vi:'Tro Tàn Niết Bàn', src:'sanct:phoenix',
    d:{ en:'Once per fight, survive a lethal blow with {v}% HP', vi:'Mỗi trận 1 lần: sống lại với {v}% máu' }, val: r => 30 + 3*(r - 1),
    onDeath: c => { if (c.me.fx.reborn) return false; c.me.fx.reborn = 1; c.me.hp = c.me.st.hp*(30 + 3*(prk(c, 'rebirth') - 1))/100; return true; } },
  shell:      { ico:'🐢', en:'Grave Shell', vi:'Mai Mộ Phần', src:'sanct:tortoise',
    d:{ en:'Take {v}% less damage above half HP', vi:'Nhận ít hơn {v}% sát thương khi trên nửa máu' }, val: r => (20 + 1.5*(r - 1)).toFixed(1).replace('.0', ''),
    onTake: (c, d) => (c.me.hp > c.me.st.hp*0.5 ? d*(1 - (20 + 1.5*(prk(c, 'shell') - 1))/100) : d) },
  eyes:       { ico:'👁', en:'Thousand-Eyed Sight', vi:'Vạn Nhãn Khóa Mục', src:'sanct:yellowdragon',
    d:{ en:'Your critical hits deal ×{v} instead of ×2.5', vi:'Đòn bạo kích của ngươi gây ×{v} thay vì ×2.5' }, val: r => (3 + 0.1*(r - 1)).toFixed(1),
    onDeal: (c, d) => (c.crit ? d*(3 + 0.1*(prk(c, 'eyes') - 1))/2.5 : d) },
  reflect:    { ico:'🪞', en:'Mirror Reflection', vi:'Phản Chiếu', src:'mirror',
    d:{ en:'Reflect {v}% of damage taken', vi:'Phản {v}% sát thương nhận' }, val: () => 10,
    onTake: (c, d) => { c.foe.hp -= d*0.01*(c.me.shards || 0); return d; } },
  purify:     { ico:'🧪', en:'Purify', vi:'Tịnh Hóa', src:'xeno:1',
    d:{ en:'Enemies cannot heal (Regeneration, Lifesteal, Absorb, transformation heal)', vi:'Kẻ địch không thể hồi máu (Hồi Sinh, Hút Máu, Hấp Thụ, hồi máu khi biến hình)' }, val: () => '' },
  multi:      { ico:'👥', en:'Twin Shadow', vi:'Song Ảnh', src:'xeno:2',
    d:{ en:'Every turn, a shadow strikes once more for 50% damage (a separate hit)', vi:'Mỗi lượt một bóng ảnh đánh thêm 1 đòn 50% sát thương (tính là đòn riêng)' }, val: () => '' },
  pierce:     { ico:'🗡', en:'Armor Pierce', vi:'Xuyên Giáp', src:'xeno:4',
    d:{ en:'Ignore 30% of enemy Resolve', vi:'Bỏ qua 30% Ý chí đối thủ' }, val: () => 30,
    onDeal: (c, d) => d*(1 + 0.3*c.foe.st.def/(c.me.st.atk + c.foe.st.def)) }, // approx of a²/(a+0.7d)
};
const passiveSlots = S => 2 + (((S.nm || {}).yellowdragon || 0) >= 1 ? 1 : 0) + ((S.xs || 0) >= 4 ? 1 : 0); // 3rd slot: survive Nightmare I of the Yellow Dragon
function passiveRank(S, id){ const P = PASSIVES[id]; if (!P) return 0; const [k, a] = P.src.split(':');
  if (k === 'xeno') return (S.xs || 0) > +a ? 1 : 0;
  if (k === 'sanct') return Math.min(PASSIVE_RANK_MAX, (S.nm || {})[a] || 0); if (k === 'mirror') return (S.shards || 0) >= MAX_SHARDS ? 1 : 0; return 0; }
const passiveRanks = S => { const o = {}; for (const id in PASSIVES) { const r = passiveRank(S, id); if (r) o[id] = r; } return o; };
const activePassives = S => FEATURE_PASSIVES ? (S.passives || []).filter(id => PASSIVES[id] && passiveRank(S, id) > 0).slice(0, passiveSlots(S)) : [];

// ======================================================================================================
// v2.0 NIGHTMARE SANCTUM — opens after all five cursed Symbols. Endless tiers per symbol; new horror bosses.
// Tier k strength = gate-boss equivalent NM_REF + NM_STEP·(k−1). Calibrated (tools/sim/nm2.py): casual ~50h / spam ~30h for tier I.
// ======================================================================================================
const NM_REF = [378, 390], NM_STEP = 8;
const NM_BOSSES = [
  { id:'nm_azure', base:'azure', nm:1, trait:'hp', aff:['leech','regen','void'], hue: 110, en:'The Corpse Dragon', vi:'Long Thi',
    intro:{ en:['The spring wind smells of rot.','It sheds its flesh like old scales — and keeps coming.'], vi:['Gió xuân bốc mùi tử khí.','Nó lột thịt như lột vảy cũ — và vẫn bò tới.'] } },
  { id:'nm_tiger', base:'tiger', nm:1, trait:'atk', aff:['twin','enrage','void'], hue: 0, en:'The Faceless Tiger', vi:'Hổ Vô Diện',
    intro:{ en:['It has no eyes. It has no face.','It has a mouth. A human one.'], vi:['Nó không có mắt. Không có mặt.','Nó chỉ có một cái miệng. Miệng người.'] } },
  { id:'nm_phoenix', base:'phoenix', nm:1, trait:null, aff:['regen','crit','giant','void'], hue: 25, en:'The Ashen Bird', vi:'Chu Tước Tro Tàn',
    intro:{ en:['Its feathers burned away long ago.','The candles on its wings are still lit.'], vi:['Lông của nó đã cháy rụi từ lâu.','Những ngọn nến trên cánh nó vẫn còn cháy.'] } },
  { id:'nm_tortoise', base:'tortoise', nm:1, trait:'def', aff:['shield','thorns','void'], hue: 160, en:'The Grave Tortoise', vi:'Huyền Vũ Mộ Phần',
    intro:{ en:['Its shell is a graveyard.','Something under the stones is still knocking.'], vi:['Mai của nó là một nghĩa địa.','Có thứ gì dưới những tấm bia vẫn đang gõ cửa.'] } },
  { id:'nm_yellowdragon', base:'yellowdragon', center:1, nm:1, trait:'hp', aff:['enrage','armor','crit','void'], hue: 50, en:'The Thousand-Eyed Dragon', vi:'Hoàng Long Vạn Nhãn',
    intro:{ en:['Every scale is an eye.','Every eye has already seen how you die.'], vi:['Mỗi chiếc vảy là một con mắt.','Con mắt nào cũng đã thấy ngươi chết thế nào.'] } },
];
const nmBoss = sym => Object.assign({}, NM_BOSSES.find(b => b.base === sym.id), { dx: sym.dx, dy: sym.dy });
const nmOpen = S => SYMBOLS.every(x => (S.sanct || {})[x.id + '_c']);
const nmTier = (S, id) => (S.nm || {})[id] || 0;
const nmRef = (k, center) => NM_REF[center ? 1 : 0] + NM_STEP*(k - 1);
const ROMAN = n => { const v = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let o = ''; for (const [a, b] of v) while (n >= a) { o += b; n -= a; } return o; };


// ======================================================================================================
// v2.1 HƯ TINH ĐẢO (Xeno Isle) — Map 2. North of the square map. Opens at GODK after beating the Gatekeeper.
// Bosses are PASSIVE CHECKS: their mechanics cannot be beaten by raw stats alone (tools/sim/xsim.py + xcal.py).
// ======================================================================================================
const XENO = { x: 1200, y: -9400, gate: [1200, -3860], road: 150, crater: 260 };
const XENO_SPOTS = { core: [0, 0], spire: [0, -1520], pad: [0, 1380], craters: [[-1200, 0], [1200, 0]] }; // relative to XENO
function xenoOn(x, y){ // island = union of shapes (cross like the reference picture)
  const dx = x - XENO.x, dy = y - XENO.y;
  if (Math.hypot(dx, dy) <= 720) return true;
  if (dx >= -520 && dx <= 520 && dy >= 500 && dy <= 1650) return true;            // south stem + landing pad
  if (dx >= -460 && dx <= 460 && dy >= -1750 && dy <= -500) return true;          // north stem + spire
  for (const k of [-1, 1]) { const ex = (dx - k*1150)/720, ey = dy/500; if (ex*ex + ey*ey <= 1) return true; } // west / east lobes
  return false;
}
const xenoInCrater = (x, y) => XENO_SPOTS.craters.some(([a, b]) => Math.hypot(x - XENO.x - a, y - XENO.y - b) < XENO.crater);
const XENO_NEED = l => 300*Math.pow(1.08, l);         // Hư Tinh points for the next level (≈ lv 25 after 1h in a crater, lv 50 after 8h)
const XENO_RATE = { base: 1, moving: 2, crater: 3, resPer: 0.25, resMax: 3 };
const xenoMult = S => 1 + 0.02*((S.xeno || {}).lv || 0);  // +2% all stats per level
const xenoCrit = S => 0.01*((S.xeno || {}).lv || 0);      // +1% crit per level (total crit capped at 95%)
const XENO_CD_WIN = 10*60*1000, XENO_CD_LOSE = 90*1000;
// Map-2 boss mechanics (not in the weekly Tower rotation)
const XAFFIXES = [
  { id:'quantum', en:'Quantum Shield', vi:'Lá Chắn Lượng Tử', ico:'🔷', d:{ en:'Only takes damage from CRITICAL hits', vi:'Chỉ nhận sát thương từ đòn BẠO KÍCH' } },
  { id:'absorb',  en:'Absorb',         vi:'Hấp Thụ',          ico:'🌀', d:{ en:'Heals 30% of the damage it takes', vi:'Hồi 30% sát thương nó nhận vào' } },
  { id:'dmgcap',  en:'Damage Cap',     vi:'Giới Hạn Sát Thương', ico:'🧱', d:{ en:'No single hit can deal more than 3% of its max HP', vi:'Mỗi đòn gây tối đa 3% máu tối đa của nó' } },
  { id:'reflect', en:'Reflector',      vi:'Phản Xạ',          ico:'🔁', d:{ en:'Reflects 50% of NON-critical damage back at you', vi:'Phản lại ngươi 50% sát thương KHÔNG bạo kích' } },
  { id:'mimic',   en:'Assimilate',     vi:'Đồng Hóa',         ico:'🧬', d:{ en:'Copies your FIRST equipped talent and uses it against you', vi:'Sao chép thiên phú ĐẦU TIÊN ngươi trang bị và dùng nó chống lại ngươi' } },
  { id:'phases',  en:'Shifting Phases', vi:'Đổi Pha',         ico:'♻', d:{ en:'Every 25% HP lost: Quantum Shield → Absorb → Damage Cap → Reflector', vi:'Mỗi 25% máu mất đi: Lá Chắn Lượng Tử → Hấp Thụ → Giới Hạn Sát Thương → Phản Xạ' } },
];
const XPHASES = ['quantum', 'absorb', 'dmgcap', 'reflect'];
const XENO_BOSSES = [ // index = order in the chain (S.xs = how many cleared)
  { id:'xg_tripod',  ref:302, trait:'def', aff:['quantum'],            hue: 190, at:'gate',  en:'The Disc Warden', vi:'Kẻ Gác Đĩa', reward:'open',
    intro:{ en:['Three legs. One red eye.','It only answers to precision.'], vi:['Ba chân. Một mắt đỏ.','Nó chỉ chịu thua trước sự chính xác.'] } },
  { id:'x_watcher',  ref:314, trait:null,  aff:['mimic','regen'],      hue: 150, at:'core',  en:'The Watcher', vi:'Kẻ Quan Sát', reward:'purify',
    intro:{ en:['It has been watching you since the bridge.','Now it knows what you are made of.'], vi:['Nó đã theo dõi ngươi từ lúc qua cầu.','Giờ nó biết ngươi được làm từ gì.'] } },
  { id:'x_parasite', ref:320, trait:'hp',  aff:['absorb','leech'],     hue: 300, at:'core',  en:'The Void Parasite', vi:'Ký Sinh Hư Không', reward:'multi',
    intro:{ en:['Every wound you give it becomes food.','Starve it.'], vi:['Mỗi vết thương ngươi gây ra đều thành thức ăn.','Hãy bỏ đói nó.'] } },
  { id:'x_hive',     ref:318, trait:null,  aff:['dmgcap','twin'],      hue: 60,  at:'core',  en:'The Hive Mother', vi:'Mẫu Thể Tổ Ong', reward:'slot',
    intro:{ en:['One blow will never be enough.','A thousand drones hum in agreement.'], vi:['Một đòn sẽ không bao giờ đủ.','Nghìn con drone vo ve đồng tình.'] } },
  { id:'x_mimicry',  ref:326, trait:'def', aff:['reflect','armor'],    hue: 210, at:'core',  en:'The Assimilation Engine', vi:'Cỗ Máy Đồng Hóa', reward:'pierce',
    intro:{ en:['Liquid metal. A perfect mirror for brute force.','Only precision gets through.'], vi:['Kim loại lỏng. Tấm gương hoàn hảo cho sức mạnh thô bạo.','Chỉ sự chính xác mới xuyên qua được.'] } },
  { id:'x_sower',    ref:332, trait:null,  aff:['phases','enrage'],    hue: 270, at:'spire', en:'The Nebula Sower', vi:'Kẻ Gieo Hạt Tinh Vân', reward:'aura',
    intro:{ en:['It planted the stars you were born under.','It came back for the harvest.'], vi:['Nó đã gieo những vì sao ngươi sinh ra dưới đó.','Giờ nó quay lại để gặt.'] } },
];

// ======================================================================================================
// v2.1 HANDBOOK (Sổ Tay) — explains every stat, trait, mechanic and talent, with a hint on how to deal with it.
// ======================================================================================================
const GUIDE_STATS = [
  { ico:'❤', k:'hp',  d:{ en:'Your health in auto-battles. At 0 you lose.', vi:'Máu của ngươi trong trận tự động. Về 0 là thua.' } },
  { ico:'🔥', k:'atk', d:{ en:'Damage per hit. Damage = Power² / (Power + enemy Resolve).', vi:'Sát thương mỗi đòn. Sát thương = Bá lực² / (Bá lực + Ý chí đối thủ).' } },
  { ico:'🛡', k:'def', d:{ en:'Reduces damage you take (same formula, from the enemy side).', vi:'Giảm sát thương ngươi nhận (cùng công thức, từ phía đối thủ).' } },
  { ico:'✴', k:'crit', d:{ en:'Chance to land a critical hit (×2.5 damage). Base 10%, +Essence up to 25%, + Xeno levels (max 95%). Key for Quantum Shield and Reflector.', vi:'Tỉ lệ bạo kích (×2.5 sát thương). Gốc 10%, Tinh hoa thêm tới 25%, + cấp Hư Tinh (tối đa 95%). Then chốt khi gặp Lá Chắn Lượng Tử và Phản Xạ.' } },
  { ico:'💠', k:'essence', d:{ en:'Earned by rebirthing. Each point = +3.5% all stats, forever.', vi:'Nhận khi tái sinh. Mỗi điểm = +3.5% mọi chỉ số, vĩnh viễn.' } },
  { ico:'⛩', k:'marks', d:{ en:'Conquest Marks from Wild Gates: +0.5% stats and +1% aura gain each (max 60).', vi:'Ấn Chinh Phục từ Cổng Hoang: mỗi ấn +0.5% chỉ số và +1% bá khí (tối đa 60).' } },
  { ico:'🪞', k:'shards', d:{ en:'Mirror Shards from the Mirror Gate: +6% all stats each (max 10). 10 shards unlock the Reflection talent.', vi:'Mảnh Gương từ Cổng Gương: mỗi mảnh +6% mọi chỉ số (tối đa 10). Đủ 10 mảnh mở thiên phú Phản Chiếu.' } },
  { ico:'⛩', k:'sanctBonus', d:{ en:'Permanent bonus from first clears in the Four Symbols Sanctum.', vi:'Thưởng vĩnh viễn khi lần đầu hạ boss ở Tứ Tượng Thánh Địa.' } },
  { ico:'✧', k:'trans', d:{ en:'Transcendence (Xeno Isle core, needs 200 rebirths): one-time choice. Rebirth disappears; everything is kept; farming aura gives Essence directly at 125% of your own recent rebirth speed.', vi:'Siêu Thoát (Lõi Mẫu Hạm, cần 200 lần tái sinh): lựa chọn một lần. Mất tái sinh; giữ nguyên mọi thứ; farm bá khí nhận thẳng Tinh hoa với 125% tốc độ tái sinh gần đây của chính ngươi.' } },
  { ico:'🛸', k:'xenoBonus', d:{ en:'Xeno level: farm aura on Xeno Isle (×3 in crystal craters, faster near other players). Each level +1% crit and +2% all stats.', vi:'Cấp Hư Tinh: farm bá khí trên Hư Tinh Đảo (×3 trong Hố Tinh Thể, nhanh hơn khi đứng gần người khác). Mỗi cấp +1% bạo kích và +2% mọi chỉ số.' } },
];
// v2.2: no 'how to counter' text in the Handbook — it only explains what each thing is (player request).


// ======================================================================================================
// v2.2 SIÊU THOÁT (Transcendence) — simple version, no skill tree.
// One-time, at the Mothership Core. Keeps everything. Rebirth is gone; aura farming adds Essence directly at
// TRANS.mult × the player's OWN recent rebirth Essence rate (measured from S.eLog), so it is always faster than
// continuing to rebirth and never lowers anything.
// ======================================================================================================
const TRANS = { minR: 200, needXs: 2, mult: 1.25, logMin: 10, spanMin: 20, windowSec: 3*3600, stand: 0.5 };
function transRecentRate(S){ // Essence per hour from the rebirth log (last 3h of play)
  const L = (S.eLog || []).filter(e => e[0] >= S.playSec - TRANS.windowSec); if (L.length < 2) return 0;
  const [t0, e0] = L[0], [t1, e1] = L[L.length - 1]; return t1 > t0 ? (e1 - e0)/(t1 - t0)*3600 : 0; }
function transCheck(S){ const L = (S.eLog || []).filter(e => e[0] >= S.playSec - TRANS.windowSec), span = L.length > 1 ? (L[L.length - 1][0] - L[0][0])/60 : 0;
  return { r: (S.R || 0) >= TRANS.minR, x: (S.xs || 0) >= TRANS.needXs, log: L.length >= TRANS.logMin && span >= TRANS.spanMin, logN: L.length, span }; }


// ======================================================================================================
// v2.3 GODK TOWER — HELL (floors 81–100). Floors 1–80 are UNCHANGED.
// From floor 81 bosses carry TALENTS (same hooks as the player's) and are ×TOWER_HELL_M stronger.
// Calibrated (tools/sim/tsim.py + tcal2.py): a player with Xeno levels + their best 3–4 talents reaches each
// floor at the SAME play time as the old tower (no talents, no Xeno): floor 81 ≈ 50h, 90 ≈ 66h, 100 ≈ 75h (casual).
// Without talents those floors are ~0% → hard-stuck → farm talents (Nightmare / Xeno Isle) → come back.
// ======================================================================================================
const TOWER_NEW_FROM = 81, HELL_TO = 100, TOWER_HELL_M = 2.9, DEFORMED_EVERY = 4;
const HELL_BOSSES = [
  { id:'h_oxhead',    hell:1, hue: 15,  pas:['shell','tigerfang'], en:'Ox-Head', vi:'Ngưu Đầu',
    intro:{ en:['Iron hooves on the bridge of the dead.','It drags the souls who are late.'], vi:['Móng sắt nện trên cầu Nại Hà.','Nó lôi đi những linh hồn đến trễ.'] } },
  { id:'h_horseface', hell:1, hue: 30,  pas:['multi','lifesteal'], en:'Horse-Face', vi:'Mã Diện',
    intro:{ en:['A long face. A longer spear.','It never misses a name on the list.'], vi:['Mặt dài. Ngọn giáo còn dài hơn.','Nó chưa từng bỏ sót một cái tên trong sổ.'] } },
  { id:'h_mengpo',    hell:1, hue: 140, pas:['purify','rebirth'],  en:'Lady Meng', vi:'Mạnh Bà',
    intro:{ en:['"Drink, child. You will not need to remember."','The soup is still warm.'], vi:['"Uống đi con. Con sẽ không cần nhớ gì nữa."','Bát canh vẫn còn ấm.'] } },
  { id:'h_hungry',    hell:1, hue: 90,  pas:['lifesteal','rebirth'], en:'Hungry Ghost', vi:'Quỷ Đói',
    intro:{ en:['A mouth as small as a needle.','A hunger as wide as the sea.'], vi:['Cái miệng nhỏ như lỗ kim.','Cơn đói rộng như biển cả.'] } },
  { id:'h_yaksha',    hell:1, hue: 200, pas:['tigerfang','pierce'], en:'Yaksha', vi:'Dạ Xoa',
    intro:{ en:['Blue skin. Fangs like daggers.','It guards the gate you are trying to break.'], vi:['Da xanh. Nanh như dao găm.','Nó canh chính cánh cổng ngươi đang muốn phá.'] } },
];
const HELL_GUARDS = {
  90:  { id:'h_judge', hell:1, hue: 0,  pas:['shell','rebirth','purify'], en:'The Infernal Judge', vi:'Phán Quan',
    intro:{ en:['The Ledger of Life and Death lies open.','Your name is already written. In red.'], vi:['Sổ Sinh Tử đã mở sẵn.','Tên ngươi đã được viết. Bằng mực đỏ.'] } },
  100: { id:'h_yama',  hell:1, hue: 350, pas:['rebirth','multi','shell','purify'], en:'King Yama', vi:'Diêm La Vương',
    intro:{ en:['The Ten Courts fall silent.','The King of Hell rises from his throne — for you.'], vi:['Thập Điện im phăng phắc.','Diêm La Vương đứng dậy khỏi ngai — vì ngươi.'] } },
};
const DEFORMED_EXTRA = ['multi', 'shell', 'rebirth', 'lifesteal', 'tigerfang'];
const hellDeformed = B => Object.assign({}, B, { id: B.id + '_d', base: B.id, deformed: 1, en: B.en + ' · Deformed', vi: B.vi + ' · Dị Dạng',
  pas: B.pas.concat([DEFORMED_EXTRA.find(x => !B.pas.includes(x))]),
  intro: { en: ['It came back wrong.', B.intro.en[1]], vi: ['Nó quay về… sai hình dạng.', B.intro.vi[1]] } });
const HELL_ALL = HELL_BOSSES.concat(HELL_BOSSES.map(hellDeformed), [HELL_GUARDS[90], HELL_GUARDS[100]]);
function hellBoss(fl){
  if (HELL_GUARDS[fl]) return HELL_GUARDS[fl];
  const h = ((fl*2654435761) >>> 0), B = HELL_BOSSES[h % HELL_BOSSES.length];
  return (h >>> 8) % DEFORMED_EVERY === 0 ? hellDeformed(B) : B;
}
const TOWER_PAS_POOL = ['shell', 'rebirth', 'multi', 'lifesteal', 'tigerfang', 'purify', 'pierce'];
function towerBossPas(fl, B){ // talents a Tower boss carries (none below floor 81)
  if (fl < TOWER_NEW_FROM) return null;
  const rank = Math.min(PASSIVE_RANK_MAX, 1 + Math.floor((fl - TOWER_NEW_FROM)/2));
  let pas = B.pas ? B.pas.slice() : null;
  if (!pas) { let h = (fl*40503) >>> 0; const ids = TOWER_PAS_POOL.slice(); pas = []; for (let i = 0; i < (fl % 10 === 0 ? 3 : 2); i++) { h = (h*1103515245 + 12345) >>> 0; pas.push(ids.splice(h % ids.length, 1)[0]); } } // floors > 100
  const prank = {}; pas.forEach(id => prank[id] = rank); return { pas, prank, rank };
}
