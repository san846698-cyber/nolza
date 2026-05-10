export type Gender = "male" | "female";

export type SocialClass =
  | "royal"
  | "yangban"
  | "military"
  | "jungin"
  | "merchant"
  | "farmer"
  | "gisaeng"
  | "nobi";

export type ClassInfo = {
  id: SocialClass;
  emoji: string;
  ko: string;
  en: string;
  weight: number;
  story: { ko: string; en: string };
};

export const CLASSES: ClassInfo[] = [
  {
    id: "royal",
    emoji: "👑",
    ko: "왕족",
    en: "Royalty",
    weight: 3,
    story: {
      ko: "당신은 왕실의 피를 이었습니다. 화려한 궁궐에서 태어났지만 그만큼 무거운 운명을 짊어졌습니다.",
      en: "You were born of royal blood. A life in the magnificent palace — and the weight of a kingdom on your shoulders.",
    },
  },
  {
    id: "yangban",
    emoji: "📚",
    ko: "사대부 양반",
    en: "Yangban Noble",
    weight: 15,
    story: {
      ko: "글과 예를 아는 선비 가문. 과거 시험이 당신의 운명을 결정합니다.",
      en: "A noble family of letters and ritual. The civil service exam decided your fate.",
    },
  },
  {
    id: "military",
    emoji: "⚔️",
    ko: "무관",
    en: "Military Officer",
    weight: 10,
    story: {
      ko: "칼을 잡고 나라를 지키는 사람. 전쟁터에서 이름을 떨쳤습니다.",
      en: "A sworn defender of the kingdom. Your name rang out across the battlefield.",
    },
  },
  {
    id: "jungin",
    emoji: "📖",
    ko: "중인",
    en: "Middle Class",
    weight: 15,
    story: {
      ko: "의관, 역관, 화원... 신분은 높지 않아도 재주로 인정받습니다.",
      en: "Physician, interpreter, court painter — recognized for talent, not birth.",
    },
  },
  {
    id: "merchant",
    emoji: "💰",
    ko: "상인",
    en: "Merchant",
    weight: 15,
    story: {
      ko: "팔도를 돌아다니며 장사하는 사람. 돈이 곧 힘이었습니다.",
      en: "A trader crossing all eight provinces. Coin was your power.",
    },
  },
  {
    id: "farmer",
    emoji: "🌾",
    ko: "농민",
    en: "Farmer",
    weight: 25,
    story: {
      ko: "땅을 일구며 사는 평범한 백성. 가장 많은 사람들의 삶이었습니다.",
      en: "A common person tilling the land — the life most people lived.",
    },
  },
  {
    id: "gisaeng",
    emoji: "🌸",
    ko: "기생",
    en: "Gisaeng (Artist)",
    weight: 7,
    story: {
      ko: "노래와 춤, 시로 이름을 날렸습니다. 많은 선비들이 당신의 시를 흠모했습니다.",
      en: "Renowned for song, dance, and poetry. Scholars admired your every verse.",
    },
  },
  {
    id: "nobi",
    emoji: "😔",
    ko: "노비",
    en: "Servant",
    weight: 10,
    story: {
      ko: "힘든 신분이었지만 당신은 남몰래 글을 깨치고 특별한 재주를 숨기고 있었습니다.",
      en: "A hard station — but you secretly learned to read and hid a remarkable gift.",
    },
  },
];

export type JoseonName = { display: string; hanja: string };

export const MALE_NAMES: JoseonName[] = [
  { display: "도준", hanja: "道俊" },
  { display: "한결", hanja: "漢結" },
  { display: "성윤", hanja: "成允" },
  { display: "치원", hanja: "致遠" },
  { display: "익준", hanja: "益俊" },
  { display: "명환", hanja: "明煥" },
  { display: "재원", hanja: "載源" },
  { display: "봉길", hanja: "奉吉" },
  { display: "덕수", hanja: "德壽" },
  { display: "광해", hanja: "光海" },
  { display: "충무", hanja: "忠武" },
  { display: "학규", hanja: "鶴圭" },
];

export const FEMALE_NAMES: JoseonName[] = [
  { display: "월향", hanja: "月香" },
  { display: "춘심", hanja: "春心" },
  { display: "옥련", hanja: "玉蓮" },
  { display: "채영", hanja: "彩英" },
  { display: "단심", hanja: "丹心" },
  { display: "매화", hanja: "梅花" },
  { display: "소월", hanja: "素月" },
  { display: "향란", hanja: "香蘭" },
  { display: "연화", hanja: "蓮花" },
  { display: "복순", hanja: "福順" },
  { display: "정임", hanja: "貞任" },
  { display: "은혜", hanja: "恩惠" },
];

export const FOREIGN_NAMES_MAP: Record<string, JoseonName> = {
  john: { display: "조준", hanja: "趙俊" },
  michael: { display: "민호", hanja: "敏鎬" },
  david: { display: "대원", hanja: "大原" },
  james: { display: "재명", hanja: "在明" },
  william: { display: "위렴", hanja: "威廉" },
  thomas: { display: "도마", hanja: "道馬" },
  lucas: { display: "낙수", hanja: "樂水" },
  daniel: { display: "단열", hanja: "丹烈" },
  robert: { display: "노벽", hanja: "魯碧" },
  charles: { display: "차열", hanja: "車烈" },
  emma: { display: "옥련", hanja: "玉蓮" },
  sarah: { display: "서연", hanja: "瑞蓮" },
  emily: { display: "임녀", hanja: "林女" },
  sophia: { display: "소화", hanja: "素花" },
  olivia: { display: "옥리", hanja: "玉俐" },
  mia: { display: "미아", hanja: "美兒" },
  isabella: { display: "이새별", hanja: "離塞別" },
  ava: { display: "아화", hanja: "雅花" },
  charlotte: { display: "차련", hanja: "且蓮" },
  amelia: { display: "아미라", hanja: "雅美羅" },
};

export type Residence = { ko: string; en: string };

export const RESIDENCES: Residence[] = [
  { ko: "한양 북촌", en: "Hanyang Bukchon" },
  { ko: "한양 남촌", en: "Hanyang Namchon" },
  { ko: "경주", en: "Gyeongju" },
  { ko: "전주", en: "Jeonju" },
  { ko: "개성", en: "Gaeseong" },
  { ko: "평양", en: "Pyongyang" },
  { ko: "제주", en: "Jeju" },
  { ko: "동래", en: "Dongnae" },
];

export type HistoricalEvent = { ko: string; en: string };

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  { ko: "임진왜란 (1592)", en: "Imjin War (1592)" },
  { ko: "병자호란 (1636)", en: "Manchu Invasion (1636)" },
  { ko: "홍경래의 난 (1811)", en: "Hong Gyeongnae Rebellion (1811)" },
  { ko: "동학농민운동 (1894)", en: "Donghak Peasant Revolution (1894)" },
  { ko: "태평성대 (정조시대)", en: "Golden Age (King Jeongjo's Era)" },
];

// ─── Profession by class ─────────────────────────────────────
export const PROFESSIONS: Record<SocialClass, { ko: string; en: string }[]> = {
  royal: [
    { ko: "세자", en: "crown prince" },
    { ko: "공주", en: "princess" },
    { ko: "왕세손", en: "royal grandson" },
  ],
  yangban: [
    { ko: "정3품 벼슬", en: "government official" },
    { ko: "지방 현감", en: "local magistrate" },
    { ko: "성균관 유생", en: "Sungkyunkwan scholar" },
  ],
  military: [
    { ko: "수문장", en: "gate commander" },
    { ko: "기마병", en: "cavalry officer" },
    { ko: "수군", en: "naval officer" },
  ],
  jungin: [
    { ko: "의관", en: "court physician" },
    { ko: "역관", en: "court interpreter" },
    { ko: "화원", en: "court painter" },
    { ko: "악사", en: "court musician" },
  ],
  merchant: [
    { ko: "보부상", en: "traveling peddler" },
    { ko: "시전 상인", en: "marketplace trader" },
    { ko: "객주", en: "brokerage host" },
  ],
  farmer: [
    { ko: "소작농", en: "tenant farmer" },
    { ko: "자작농", en: "landowning farmer" },
    { ko: "어부", en: "fisherman" },
  ],
  gisaeng: [
    { ko: "관기", en: "court gisaeng" },
    { ko: "사기", en: "private gisaeng" },
    { ko: "행수기생", en: "senior gisaeng" },
  ],
  nobi: [
    { ko: "외거 노비", en: "resident bondservant" },
    { ko: "솔거 노비", en: "household bondservant" },
    { ko: "관노비", en: "government bondservant" },
  ],
};

// ─── Hash & RNG ──────────────────────────────────────────────
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) || 1;
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickFromArray<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function pickClass(rng: () => number, gender: Gender): ClassInfo {
  const pool = CLASSES.filter((c) => c.id !== "gisaeng" || gender === "female");
  const totalWeight = pool.reduce((s, c) => s + c.weight, 0);
  let r = rng() * totalWeight;
  for (const c of pool) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
}

export function pickJoseonName(
  rng: () => number,
  gender: Gender,
  originalName: string,
): JoseonName {
  const lower = originalName.trim().toLowerCase();
  if (/^[a-z\s'-]+$/.test(lower)) {
    const exact = FOREIGN_NAMES_MAP[lower];
    if (exact) return exact;
  }
  const pool = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
  return pickFromArray(rng, pool);
}

export type FateContext = {
  cls: ClassInfo;
  gender: Gender;
  joseonName: JoseonName;
  residence: Residence;
  event: HistoricalEvent;
  profession: { ko: string; en: string };
  rng: () => number;
};

// ─── Fate story per class+gender ─────────────────────────────
export function buildFateStory(ctx: FateContext, locale: "ko" | "en"): string {
  const { cls, gender, residence, event, profession, rng } = ctx;
  const r = residence[locale];
  const ev = event[locale];
  const job = profession[locale];

  if (cls.id === "yangban" && gender === "male") {
    const exam = pickFromArray(
      rng,
      locale === "ko"
        ? ["낙방", "여러 번의 도전", "합격"]
        : ["failing", "many attempts at", "passing"],
    );
    const wartime = pickFromArray(
      rng,
      locale === "ko"
        ? ["의병장으로", "피란길에", "벼슬길에서"]
        : ["led a militia", "fled to the countryside", "served the king faithfully"],
    );
    return locale === "ko"
      ? `${r}에서 태어난 사대부 집안의 아들. 어린 시절부터 글을 좋아했고 스무 살에 처음 과거에 응시했습니다.\n\n${exam} 끝에 ${job}이(가) 되었습니다.\n\n${ev} 시기에는 ${wartime} 그 시대를 보냈습니다.\n\n후손들이 아직도 당신의 이름을 기억합니다.`
      : `Born into a noble Yangban family in ${r}. You devoted your youth to studying the Confucian classics, dreaming of passing the Gwageo civil exam.\n\nAfter ${exam} the exam, you became a ${job}.\n\nDuring ${ev}, you ${wartime}.\n\nYour descendants still remember your name.`;
  }

  if (cls.id === "yangban" && gender === "female") {
    return locale === "ko"
      ? `${r}의 사대부 집안에서 태어났습니다. 어머니께 예와 시문을 배웠고, 좋은 가문에 시집을 갔습니다.\n\n비록 바깥일에 나설 수는 없었지만, 한문 시 한 편 한 편이 후세에 전해졌습니다.\n\n${ev}을(를) 조용히 견뎌냈습니다.`
      : `Born into a Yangban family in ${r}. Your mother taught you ritual and verse, and you married into a good house.\n\nThough the outer world was closed to you, your hanja poems passed down through the centuries.\n\nYou quietly endured ${ev}.`;
  }

  if (cls.id === "military" && gender === "male") {
    const enemy = pickFromArray(
      rng,
      locale === "ko"
        ? ["임진왜란의 왜군", "북방 여진족", "남쪽 해적"]
        : ["Japanese invaders", "northern nomads", "pirates"],
    );
    return locale === "ko"
      ? `어릴 때부터 당신은 책보다 활과 칼을 더 좋아했습니다.\n\n무과에 합격해 조선의 자랑스러운 ${job}이(가) 되었습니다.\n\n${enemy}와(과) 맞서 싸웠고, 이순신 장군과 어깨를 나란히 했을지도 모릅니다.\n\n당신의 이름은 역사에 새겨졌습니다.`
      : `From childhood, you preferred the bow and sword over books.\n\nPassing the military exam, you became one of Joseon's proud ${job}s.\n\nYou fought against ${enemy}, and may have stood shoulder to shoulder with Admiral Yi Sun-sin himself.\n\nYour name was carved in history.`;
  }

  if (cls.id === "military" && gender === "female") {
    return locale === "ko"
      ? `무관 집안에서 태어났습니다. 활을 다루는 솜씨가 보통이 아니었으나, 시대는 당신을 칼 대신 바느질로 이끌었습니다.\n\n그래도 가문의 무예는 당신을 통해 자식들에게 이어졌습니다.\n\n${ev} 무렵 ${r}에서 살았습니다.`
      : `Born into a military family. Your archery was uncommonly fine, but the times bound you to the needle, not the sword.\n\nStill, your family's martial arts passed through you to your children.\n\nYou lived in ${r} during ${ev}.`;
  }

  if (cls.id === "gisaeng") {
    return locale === "ko"
      ? `${r}에서 가장 유명한 기생이었습니다.\n\n시와 노래, 거문고 솜씨가 보통이 아니어서 많은 선비들이 당신의 예술에 빠졌습니다.\n\n그 시대 다른 여인들과 달리, 당신은 글을 자유롭게 읽고 썼습니다.\n\n당신의 시 한 편이 어딘가에 아직 남아 발견되기를 기다리고 있을지도 모릅니다.`
      : `You were the most celebrated Gisaeng in all of ${r}.\n\nYour poetry, songs, and gayageum skills were unmatched. Many scholars fell in love with your art.\n\nUnlike most women of your time, you could read and write freely.\n\nYour poems may still exist somewhere, waiting to be found.`;
  }

  if (cls.id === "merchant") {
    return locale === "ko"
      ? `${r}을(를) 거점으로 팔도를 누비는 ${job}이었습니다. 비단과 인삼, 도자기와 종이 — 무엇이든 사고팔며 부를 쌓았습니다.\n\n${ev} 시기에는 위기를 기회로 바꿔 더 큰 상단을 일구었습니다.`
      : `Based in ${r}, you crossed all eight provinces as a ${job}. Silk and ginseng, porcelain and paper — anything to buy and sell.\n\nDuring ${ev} you turned crisis into opportunity, growing your house into a great trading firm.`;
  }

  if (cls.id === "farmer" && gender === "male") {
    const region = pickFromArray(
      rng,
      locale === "ko"
        ? ["경상도", "전라도", "충청도"]
        : ["Gyeongsang", "Jeolla", "Chungcheong"],
    );
    return locale === "ko"
      ? `${region}의 어느 마을에 살던 평범한 ${job}.\n\n봄에 씨를 뿌리고 가을에 거두는 삶. 단순하지만 정직했습니다.\n\n그래도 당신의 손에서 그 어떤 양반의 밥상보다 맛있는 쌀이 나왔습니다.\n\n매일 저녁 가족이 둘러앉아 함께 밥을 먹었습니다. 그것으로 충분했습니다.`
      : `A humble ${job} in a village of ${region} province. Planting in spring, harvesting in fall.\n\nSimple but honest life.\n\nYet from your hands came rice finer than any noble's table.\n\nYour family ate together every evening. That was enough.`;
  }

  if (cls.id === "farmer" && gender === "female") {
    return locale === "ko"
      ? `${r} 인근 마을에서 태어나 ${job}의 아내로 살았습니다. 새벽부터 밤까지 일했지만, 당신이 끓인 된장국 냄새는 마을 끝까지 퍼졌다고 합니다.\n\n${ev}을(를) 가족과 함께 견뎌냈습니다.`
      : `Born near ${r}, you lived as a ${job}'s wife. From dawn to dusk you worked, yet the scent of your doenjang stew was said to reach the village's edge.\n\nYou endured ${ev} together with your family.`;
  }

  if (cls.id === "jungin") {
    return locale === "ko"
      ? `${r}에서 ${job}으로 일했습니다. 양반은 아니었지만 그 어떤 양반보다 깊은 학문과 기술을 가졌습니다.\n\n${ev} 시기, 당신의 손이 많은 사람의 운명을 바꿨습니다.`
      : `In ${r} you served as a ${job}. Not a yangban, but learned and skilled beyond many of them.\n\nDuring ${ev}, your hands changed many fates.`;
  }

  if (cls.id === "nobi") {
    return locale === "ko"
      ? `힘든 운명이었지만, 당신은 남몰래 글을 깨치고 책을 읽었습니다.\n\n숨어서 읽은 책들이 결국 당신을 자유롭게 했습니다.\n\n다른 삶이었다면 당신은 위대한 학자가 되었을 것입니다.\n\n어쩌면, 이미 그러했는지도 모릅니다.`
      : `A difficult fate, yet you secretly taught yourself to read.\n\nBooks you read in hiding eventually set you free.\n\nIn another life, you would have been a great scholar.\n\nPerhaps you already were.`;
  }

  if (cls.id === "royal") {
    return locale === "ko"
      ? `당신은 왕실의 피를 이어받고 태어났습니다.\n\n궁궐은 당신의 집이었고, 동시에 당신의 새장이었습니다.\n\n매끼 식사가 정치적 선언이었고, 모든 혼인은 협상이었습니다. 그러나 당신은 한 나라의 무게를 어깨에 짊어졌습니다.\n\n역사는 당신의 이름을 기억합니다.`
      : `Born with royal blood in your veins.\n\nThe palace was your home, but it was also your cage.\n\nEvery meal was a political statement. Every marriage was a negotiation. Yet you carried the weight of an entire nation on your shoulders.\n\nHistory remembers your name.`;
  }

  return locale === "ko"
    ? `${r}에서 ${cls.ko}으로 평생을 살았습니다. ${ev} 시기를 묵묵히 견뎌냈습니다.`
    : `You lived your life in ${r} as a ${cls.en}. You quietly endured the era of ${ev}.`;
}

// ─── Couple flow ─────────────────────────────────────────────
export type LoveStyleKey = "letters" | "secret" | "blessing" | "runaway";
export type EndingKey = "together" | "separated" | "reunion" | "legend";

export const LOVE_STYLES: Record<LoveStyleKey, { ko: string; en: string }> = {
  letters: { ko: "편지로 마음을 전했습니다", en: "You expressed love through letters" },
  secret: { ko: "몰래 만남을 이어갔습니다", en: "You met in secret" },
  blessing: { ko: "부모님 허락을 받았습니다", en: "You received your parents' blessing" },
  runaway: {
    ko: "모든 것을 버리고 도망쳤습니다",
    en: "You left everything behind and ran away",
  },
};

export const ENDINGS: Record<EndingKey, { ko: string; en: string }> = {
  together: { ko: "백년해로 했습니다 💕", en: "You grew old together 💕" },
  separated: {
    ko: "이별했지만 평생 그리워했습니다 🌧",
    en: "Separated but never forgotten 🌧",
  },
  reunion: { ko: "재회했습니다 🌸", en: "You found each other again 🌸" },
  legend: { ko: "전설이 되었습니다 ✨", en: "You became a legend ✨" },
};

export type CoupleStoryKey =
  | "yangban-gisaeng"
  | "yangban-yangban"
  | "merchant-farmer"
  | "military-yangban"
  | "yangban-nobi"
  | "royal-yangban"
  | "merchant-merchant"
  | "farmer-farmer"
  | "jungin-jungin"
  | "default";

export type CoupleStory = {
  key: CoupleStoryKey;
  title: { ko: string; en: string };
  meeting: {
    ko: (a: string, b: string) => string;
    en: (a: string, b: string) => string;
  };
  loveStyle: LoveStyleKey;
  ending: EndingKey;
  baseScore: number;
};

export function classifyCouple(
  c1: SocialClass,
  c2: SocialClass,
  g1: Gender,
  g2: Gender,
): CoupleStoryKey {
  const m = g1 === "male" ? c1 : g2 === "male" ? c2 : c1;
  const f = g1 === "female" ? c1 : g2 === "female" ? c2 : c2;

  if (m === "yangban" && f === "gisaeng") return "yangban-gisaeng";
  if (m === "yangban" && f === "yangban") return "yangban-yangban";
  if (m === "merchant" && f === "farmer") return "merchant-farmer";
  if (m === "military" && f === "yangban") return "military-yangban";
  if (m === "yangban" && f === "nobi") return "yangban-nobi";
  if (m === "royal" && f === "yangban") return "royal-yangban";
  if (m === "merchant" && f === "merchant") return "merchant-merchant";
  if (m === "farmer" && f === "farmer") return "farmer-farmer";
  if (m === "jungin" && f === "jungin") return "jungin-jungin";
  if (f === "yangban" && m === "gisaeng") return "yangban-gisaeng";
  if (f === "merchant" && m === "farmer") return "merchant-farmer";
  if (f === "military" && m === "yangban") return "military-yangban";
  if (f === "yangban" && m === "nobi") return "yangban-nobi";
  if (f === "royal" && m === "yangban") return "royal-yangban";
  return "default";
}

export const COUPLE_STORIES: Record<CoupleStoryKey, CoupleStory> = {
  "yangban-gisaeng": {
    key: "yangban-gisaeng",
    title: { ko: "신분을 초월한 사랑", en: "A Love That Defied Boundaries" },
    meeting: {
      ko: (a, b) =>
        `신분을 초월한 사랑.\n\n${a}은(는) ${b}이(가) 쓴 시 한 편에 마음을 빼앗겼습니다. 집안의 거센 반대에도 불구하고 ${b}의 손을 잡았습니다.\n\n달 밝은 밤마다 두 사람은 몰래 만나 시와 약속을 주고받았습니다. 그 시대에는 이루어질 수 없는 사랑이었지만, 두 사람은 끝까지 서로를 선택했습니다.\n\n그들의 이야기는 세대를 넘어 속삭여지는 전설이 되었습니다.`,
      en: (a, b) =>
        `A love that defied social boundaries.\n\n${a} was captivated by a single poem written by ${b}. Despite his family's fierce opposition, he took ${b}'s hand.\n\nThey met secretly under the full moon, exchanging poems and promises. An impossible love in their time. Yet they chose each other anyway.\n\nTheir story became a legend whispered through generations.`,
    },
    loveStyle: "secret",
    ending: "legend",
    baseScore: 88,
  },
  "yangban-yangban": {
    key: "yangban-yangban",
    title: { ko: "정해진 인연", en: "A Promised Match" },
    meeting: {
      ko: (a, b) =>
        `부모님이 정해주신 혼처. 처음에는 어색한 침묵만이 방을 채웠습니다.\n\n그러나 ${a}은(는) ${b}에게 매일 시 한 편씩을 써 보냈습니다. 천천히, 두 사람 사이의 벽이 허물어졌습니다.\n\n의무로 시작된 인연이 진심 어린 사랑으로 피어났습니다. 두 사람은 약속한 대로 함께 늙어갔습니다.`,
      en: (a, b) =>
        `An arranged marriage by their parents. At first, awkward silences filled the room.\n\nBut ${a} wrote ${b} a poem every day. Slowly, the walls came down.\n\nWhat began as duty blossomed into true love. They grew old together, just as promised.`,
    },
    loveStyle: "letters",
    ending: "together",
    baseScore: 92,
  },
  "merchant-farmer": {
    key: "merchant-farmer",
    title: { ko: "길 위의 만남", en: "Met on the Road" },
    meeting: {
      ko: (a, b) =>
        `${a}이(가) 장사 길에 들른 어느 마을에서 ${b}을(를) 만났습니다.\n\n재산도, 신분도 없었습니다. 그저 서로의 손을 잡고 같은 길을 걷는 두 사람뿐이었습니다.\n\n무에서 모든 것을 함께 일구었습니다. 그것이 그들의 전부였습니다.`,
      en: (a, b) =>
        `${a} met ${b} during his travels across the country.\n\nNo wealth, no status. Just two hands intertwined walking the same road.\n\nThey built everything from nothing. And it was everything.`,
    },
    loveStyle: "blessing",
    ending: "together",
    baseScore: 78,
  },
  "military-yangban": {
    key: "military-yangban",
    title: { ko: "전쟁터의 약속", en: "A Promise from the Battlefield" },
    meeting: {
      ko: (a, b) =>
        `${a}이(가) 전쟁터로 떠났습니다. ${b}은(는) 매일 새벽 무사 귀환을 빌었습니다.\n\n${a}의 갑옷 안에는 ${b}이(가) 수놓은 손수건이 있었습니다. 그것이 그가 살아남아야 할 이유였습니다.\n\n마침내 그가 돌아왔을 때, 말은 필요 없었습니다. 눈물과 마주 잡은 손이 전부였습니다.`,
      en: (a, b) =>
        `${a} left for the battlefield. ${b} prayed for his safe return every dawn.\n\nIn his armor, ${a} kept a handkerchief embroidered by ${b}. It was his reason to survive.\n\nWhen he finally returned, no words were needed. Just tears and held hands.`,
    },
    loveStyle: "letters",
    ending: "reunion",
    baseScore: 84,
  },
  "yangban-nobi": {
    key: "yangban-nobi",
    title: { ko: "금기의 사랑", en: "Forbidden Love" },
    meeting: {
      ko: (a, b) =>
        `${a}의 집안 노비였던 ${b}. 같은 책을 몰래 나눠 읽으며 두 사람의 마음이 책장 위에서 닿았습니다.\n\n신분의 벽은 너무 높았습니다. 결국 두 사람은 모든 것을 버리고 산속으로 도망쳤습니다.\n\n그들의 이름은 한 시대를 넘어, 후세까지 전해지는 전설이 되었습니다.`,
      en: (a, b) =>
        `${b}, a bondservant in ${a}'s household. They shared the same book in secret, and their hearts met across its pages.\n\nThe walls of class were too high. In the end, they abandoned everything and fled into the mountains.\n\nTheir names became a legend, carried beyond their era and passed down through the generations.`,
    },
    loveStyle: "runaway",
    ending: "legend",
    baseScore: 73,
  },
  "royal-yangban": {
    key: "royal-yangban",
    title: { ko: "궁궐의 정략혼", en: "A Palace Alliance" },
    meeting: {
      ko: (a, b) =>
        `${a}은(는) 왕실의 일원, ${b}은(는) 명문 사대부 가문의 자제였습니다.\n\n정략혼이었지만 두 사람 사이에 진심이 자랐습니다.\n\n예법을 함께 따르며, 한 시대를 함께 다스리는 동반자가 되었습니다.`,
      en: (a, b) =>
        `${a} was of the royal house, ${b} of a great Yangban family.\n\nA political match — yet true affection took root between them.\n\nFollowing the rituals together, they presided over an entire era as one.`,
    },
    loveStyle: "blessing",
    ending: "together",
    baseScore: 86,
  },
  "merchant-merchant": {
    key: "merchant-merchant",
    title: { ko: "장사꾼 부부", en: "A Merchant Pair" },
    meeting: {
      ko: (a, b) =>
        `${a}와(과) ${b}은(는) 같은 시전에서 자주 마주쳤습니다.\n\n흥정 끝에 마음을 주고받았고, 함께 일하며 정을 키웠습니다.\n\n팔도에 이름난 상단을 함께 일구었습니다.`,
      en: (a, b) =>
        `${a} and ${b} crossed paths often at the same market street.\n\nAfter many trades, they traded hearts. Working side by side, their bond grew stronger.\n\nTogether they built a trading house famous across all eight provinces.`,
    },
    loveStyle: "blessing",
    ending: "together",
    baseScore: 82,
  },
  "farmer-farmer": {
    key: "farmer-farmer",
    title: { ko: "한 뼘 땅의 사랑", en: "Love on a Patch of Land" },
    meeting: {
      ko: (a, b) =>
        `같은 마을에서 자라 같은 들판에서 일했습니다.\n\n${a}와(과) ${b}은(는) 어릴 때부터 정해진 사이였습니다.\n\n부모님의 축복 속에 혼인하여, 손주들에게 둘러싸여 백년을 함께 살았습니다.`,
      en: (a, b) =>
        `Raised in the same village, working the same fields.\n\n${a} and ${b} were meant for each other from childhood.\n\nMarried with their parents' blessing, they lived a long life surrounded by grandchildren.`,
    },
    loveStyle: "blessing",
    ending: "together",
    baseScore: 90,
  },
  "jungin-jungin": {
    key: "jungin-jungin",
    title: { ko: "재주가 만든 인연", en: "A Bond Forged by Skill" },
    meeting: {
      ko: (a, b) =>
        `${a}와(과) ${b}은(는) 같은 관청에서 일하며 서로의 솜씨에 감탄했습니다.\n\n편지를 주고받으며 학문과 예를 함께 나누었습니다.\n\n두 사람의 자식들 또한 뛰어난 재주꾼이 되었습니다.`,
      en: (a, b) =>
        `${a} and ${b} worked in the same bureau, each admiring the other's craft.\n\nThey exchanged letters, sharing learning and ritual together.\n\nTheir children grew into masters of their own crafts.`,
    },
    loveStyle: "letters",
    ending: "together",
    baseScore: 87,
  },
  default: {
    key: "default",
    title: { ko: "보통의 사랑", en: "An Ordinary Love" },
    meeting: {
      ko: (a, b) =>
        `${a}와(과) ${b}은(는) 같은 시대를 살았고, 어느 봄날 처음 마주쳤습니다.\n\n부모님의 허락을 받아 평범하지만 따뜻한 가정을 꾸렸습니다.`,
      en: (a, b) =>
        `${a} and ${b} lived in the same age, and met one spring day.\n\nWith their parents' blessing, they built an ordinary — and warm — home.`,
    },
    loveStyle: "blessing",
    ending: "together",
    baseScore: 75,
  },
};
