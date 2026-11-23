// GodK Bá Khí v1.0 — data: titles, tiers, bosses, i18n, formulas
'use strict';
const GAME_VERSION = '1.2';
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
  { en: 'Realm of the Unlimited', vi: 'Cõi Vô Lượng' },
];

// [EN, VI] — index 0 = title 1
const TITLES = [
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
];
const MAX_TITLE = TITLES.length; // 200

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
  const k = t - MAX_TITLE; const w = LAYER_WORDS[(k-1)%LAYER_WORDS.length]; const c = Math.floor((k-1)/LAYER_WORDS.length)+1;
  return lang==='vi' ? `VÔ LƯỢNG ✦ Tầng ${w[1]} ${roman(c)}` : `THE UNLIMITED ✦ ${w[0]} Layer ${roman(c)}`;
}
function tierOf(t){ return t > MAX_TITLE ? 10 : Math.floor((t-1)/20); }
function subOf(t){ return t > MAX_TITLE ? 20 : ((t-1)%20)+1; } // 1..20
function tierName(t, lang){ return TIERS[tierOf(t)][lang==='vi'?'vi':'en']; }

// ---------- Formulas (tuned by simulation: ~8h to THE UNLIMITED) ----------
const LV_PER_TITLE = 3;
const F = {
  levelCap: t => LV_PER_TITLE * t,
  xpNeed: L => Math.floor(4 * Math.pow(L, 1.3) + 12), // v1.1: ×2 to offset events/rifts
  xpRate: (s, moving, inWell, buff) => (1 + s.R) * (1 + 0.08 * s.L) * (moving ? 2 : 1) * (inWell ? 1.5 : 1) * (1 + 0.05 * (s.stelae ? s.stelae.length : 0)) * (1 + 0.01 * (s.marks || 0)) * (buff ? 5 : 1),
  statMult: (t, E, M) => (1 + 0.035 * E) * Math.pow(1.01, t) * (1 + 0.005 * (M || 0)),
  stats(L, t, E, M){ const m = F.statMult(t, E, M); return { hp: (120 + 30*L)*m, atk: (12 + 3.2*L)*m, def: (3 + 0.7*L)*m, crit: 0.10 + Math.min(0.15, E*0.0005) }; },
  boss(g){ const L = LV_PER_TITLE*g; const b = F.stats(L, g, 0); const D = 0.7*Math.pow(1.017, g)*(g%20===0 ? 1.5 : 1);
    return { hp: b.hp*D*1.6, atk: b.atk*D*0.7, def: b.def*D, crit: 0.08 }; },
  essence: t => Math.floor(Math.pow(t, 1.5) / 3),
  dmg: (a, d) => a*a/(a+d),
  REBIRTH_MIN_TITLE: 20,
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
  { id:'mirror',    en:'The Broken Mirror',    vi:'Gương Vỡ',            hue: 200, intro:{en:['Your reflection is late.','It moved first.'],vi:['Hình phản chiếu của bạn bị chậm.','Nó đã cử động trước.']}},
];
// v1.2 — exclusive bosses of the Realm of the Unlimited (title 201+)
const UNLIMITED_BOSSES = [
  { id:'eyegod',   en:'The Eye Above All',   vi:'Thiên Nhãn Vô Lượng',  hue: 45,  intro:{en:['The sky opens.','It was an eyelid.'],vi:['Bầu trời mở ra.','Hóa ra đó là mí mắt.']}},
  { id:'geometer', en:'The Geometer',        vi:'Kẻ Đo Hư Không',       hue: 180, intro:{en:['Space folds into cubes.','Something is measuring you.'],vi:['Không gian gấp lại thành khối.','Có thứ gì đó đang đo đạc bạn.']}},
  { id:'glyph',    en:'The Name Eater',      vi:'Kẻ Nuốt Tên',          hue: 300, intro:{en:['Letters fall off your title.','It is hungry for names.'],vi:['Từng chữ rơi khỏi danh hiệu của bạn.','Nó đói những cái tên.']}},
];
const ALL_BOSSES = BOSSES.concat(EXTRA_BOSSES, UNLIMITED_BOSSES);
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
  { en:'Ultra Instinct', vi:'Bản Năng Vô Cực',  h:220, s:20,  l:88, bolt:1, big:1 },
  { en:'Void Form',      vi:'Hư Vô Hình',       h:285, s:90,  l:50, bolt:1, big:1, dark:1 },
];
function bossFor(g){
  const n = EXTRA_BOSSES.length;
  if (g >= MAX_TITLE) { const pool = [BOSSES[10]].concat(UNLIMITED_BOSSES); return (g % 5 === 4) ? ALL_BOSSES[(g*7) % ALL_BOSSES.length] : pool[g % pool.length]; }
  const ti = tierOf(g); if (g % 20 === 0) return BOSSES[ti];
  const pool = [BOSSES[ti]]; for (let k = 0; k < 5; k++) pool.push(EXTRA_BOSSES[(ti*5 + k) % n]);
  if (ti > 0) pool.push(BOSSES[ti - 1]);
  return pool[(g*5) % pool.length]; // step 5 so neighbouring gates differ
}
function bossForm(g){ const ti = Math.min(9, tierOf(g)); return Math.min(8, Math.floor(ti*0.8 + (((g - 1) % 20)/7))); }
function unlockedBosses(t){ const ti = Math.min(9, tierOf(t)); const out = BOSSES.slice(0, ti + 1).concat(EXTRA_BOSSES.slice(0, Math.min(EXTRA_BOSSES.length, ti*5 + 5)));
  return t > MAX_TITLE ? out.concat(UNLIMITED_BOSSES, [BOSSES[10]]) : out; }

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
    rebirthEffect:'+{x} permanent Essence (each = +3.5% all stats), aura gain ×{m} total',
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
    rebirthEffect:'+{x} Tinh hoa vĩnh viễn (mỗi điểm = +3.5% mọi chỉ số), bá khí ×{m} tổng',
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
    roamName:'Tà Ảnh Lang Thang', roamWin:'Đã xua tan Tà Ảnh! +{x} bá khí', roamWinMark:'Đã xua tan Tà Ảnh! +{x} bá khí · +1 Ấn Chinh Phục', challengeRoam:'Giao chiến', roamCD:'Nó sẽ quay lại…',
    music:'Nhạc nền', sfxVol:'Hiệu ứng', auraVol:'Âm hào quang', audioFiles:'Đã nhận file âm thanh riêng: {n}', audioNone:'Đang dùng nhạc chill có sẵn (bỏ file vào thư mục /audio để thay)',
  }
};
