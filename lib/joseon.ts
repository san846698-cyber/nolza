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

type LocalizedText = { ko: string; en: string };

export type JoseonResultSection = {
  title: LocalizedText;
  items: LocalizedText[];
};

export type RichJoseonResult = {
  title: LocalizedText;
  summary: LocalizedText;
  keywords: LocalizedText[];
  identityNote: LocalizedText;
  story: LocalizedText;
  sections: JoseonResultSection[];
  shareTraits: LocalizedText[];
  shareLine: LocalizedText;
};

type JoseonProfile = {
  titles: LocalizedText[];
  summaries: LocalizedText[];
  identityNotes: LocalizedText[];
  keywords: LocalizedText[];
  childhood: (ctx: FateContext, locale: "ko" | "en") => string;
  society: (ctx: FateContext, locale: "ko" | "en") => string;
  event: (ctx: FateContext, locale: "ko" | "en") => string;
  legacy: (ctx: FateContext, locale: "ko" | "en") => string;
  sections: JoseonResultSection[];
  shareTraits: LocalizedText[];
  shareLine: LocalizedText;
};

const jobFlavorKo: Record<string, string> = {
  세자: "말 한마디가 곧 회의 안건이 되는 자리",
  공주: "궁궐 안팎의 예법과 분위기를 동시에 읽어야 하는 자리",
  왕세손: "어른들의 기대와 궁중 소문을 동시에 견디는 자리",
  "정3품 벼슬": "공문서 한 장으로 집안 분위기까지 바꾸는 자리",
  "지방 현감": "백성의 민원과 윗선의 눈치를 같이 처리하는 자리",
  "성균관 유생": "공부하는 척하면서도 정치판의 기류를 익히는 자리",
  수문장: "문 하나를 지키지만 사실 궁궐 전체의 긴장을 읽는 자리",
  기마병: "먼저 달려가고 가장 늦게 물러나는 자리",
  수군: "바람, 물살, 상관의 표정까지 읽어야 살아남는 자리",
  의관: "맥을 짚는 척하며 사람의 불안까지 읽는 자리",
  역관: "말 한마디로 국경의 분위기를 바꾸는 자리",
  화원: "붓으로 기록하고 눈빛으로 비밀을 저장하는 자리",
  악사: "장단을 맞추다가 궁중의 흐름까지 외우는 자리",
  보부상: "봇짐 하나로 전국 소문을 업데이트하는 자리",
  "시전 상인": "한양 물가와 사람 마음을 동시에 계산하는 자리",
  객주: "사람, 물건, 소문이 모두 지나가는 길목의 자리",
  소작농: "적은 것으로도 계절을 버티는 실전형 자리",
  자작농: "땅의 표정과 집안 살림을 동시에 책임지는 자리",
  어부: "물때와 사람 때를 같이 읽어야 하는 자리",
  관기: "재주와 품격으로 관아의 공기를 바꾸는 자리",
  사기: "작은 방 안에서도 큰 소문을 만드는 자리",
  행수기생: "예술과 사람 관리가 모두 필요한 총괄형 자리",
  "외거 노비": "밖의 사정과 안의 규칙을 모두 알아야 하는 자리",
  "솔거 노비": "집안의 하루를 실제로 굴러가게 만드는 자리",
  관노비: "관아의 잡무 속에서 제일 많은 정보를 듣는 자리",
};

function jobFlavor(ctx: FateContext, locale: "ko" | "en"): string {
  if (locale === "ko") return jobFlavorKo[ctx.profession.ko] ?? `${ctx.profession.ko}의 자리`;
  return `a role where being a ${ctx.profession.en} meant reading the room before anyone else`;
}

function pickLocalized(rng: () => number, items: LocalizedText[]): LocalizedText {
  return pickFromArray(rng, items);
}

function localizedItems(items: [string, string][]): LocalizedText[] {
  return items.map(([ko, en]) => ({ ko, en }));
}

const JOSEON_PROFILES: Record<SocialClass, JoseonProfile> = {
  royal: {
    titles: localizedItems([
      ["궁궐 정치판을 읽는 왕실형 인간", "Palace-born reader of power"],
      ["왕보다 눈치 빠른 궁중 생존자", "The royal survivor with sharper instincts than the throne"],
      ["화려함 뒤에서 판을 짜는 왕족", "The royal strategist behind the silk curtain"],
    ]),
    summaries: localizedItems([
      ["겉으로는 우아하지만, 속으로는 궁궐 회의록을 실시간 분석하는 사람입니다.", "Elegant outside, quietly analyzing every palace agenda inside."],
      ["한마디를 하기 전에 누가 들을지부터 계산하는 타입입니다.", "You calculate who is listening before saying a word."],
    ]),
    identityNotes: localizedItems([
      ["예법은 갑옷, 침묵은 방패인 궁중형 인물", "Ritual as armor, silence as a shield"],
      ["화려한 자리보다 살아남는 판단력이 더 강한 사람", "More survival instinct than decorative grandeur"],
    ]),
    keywords: localizedItems([
      ["궁중 눈치", "Palace instincts"],
      ["품격 있는 계산", "Elegant calculation"],
      ["정치적 침묵", "Political silence"],
      ["의전 장인", "Protocol master"],
      ["왕실 생존력", "Royal resilience"],
    ]),
    childhood: (ctx, locale) =>
      locale === "ko"
        ? `${ctx.residence.ko}에서 태어난 당신은 걸음마보다 먼저 절하는 법을 배웠습니다. 어릴 때부터 웃는 얼굴 뒤에 숨은 어른들의 계산을 읽었고, 떡 하나를 받더라도 누가 보고 있는지 확인하는 아이였습니다.`
        : `Born in ${ctx.residence.en}, you learned court bows almost before walking. Even as a child, you sensed the calculations behind adult smiles.`,
    society: (ctx, locale) =>
      locale === "ko"
        ? `당신의 직함은 ${ctx.profession.ko}, 정확히 말하면 ${jobFlavor(ctx, "ko")}였습니다. 조선 사회에서 당신은 높은 담장 안에 있었지만, 그 담장은 보호막인 동시에 감시망이었습니다.`
        : `Your role was ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. The palace walls protected you and watched you at the same time.`,
    event: (ctx, locale) =>
      locale === "ko"
        ? `${ctx.event.ko} 무렵, 궁궐 안에는 하루에도 몇 번씩 소문이 뒤집혔습니다. 당신은 괜히 먼저 나서지 않았고, 대신 누가 누구의 이름을 피하는지 기억했습니다. 그 덕분에 한 번은 잔치 자리의 좌석 배치만 보고 큰 정치적 충돌을 미리 막았다는 이야기가 전해집니다.`
        : `Around ${ctx.event.en}, palace rumors shifted several times a day. You avoided loud moves and instead remembered which names people avoided.`,
    legacy: (_ctx, locale) =>
      locale === "ko"
        ? "후대에는 당신을 두고 '권력을 탐하지 않는다고 말했지만 자리 배치는 누구보다 정확히 본 사람'이라 기록했습니다. 왕관보다 오래 남은 것은 당신의 조용한 판단력이었습니다."
        : "Later generations remembered you as someone who claimed not to seek power, yet understood every seating chart perfectly.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["예의 바르지만 속으로는 모든 기류를 읽음", "Polite, but reading every current"], ["말을 아끼는 대신 표정을 저장함", "Stores expressions instead of talking"], ["위험한 칭찬과 안전한 침묵을 구분함", "Knows dangerous praise from safe silence"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["권력자 앞에서는 한 박자 늦게 웃음", "Laughs half a beat late before power"], ["소문은 듣되 출처는 절대 남기지 않음", "Hears rumors, leaves no source"], ["궁궐 행사는 의전보다 사람 배치를 봄", "Reads people placement before protocol"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["저분은 조용한데 이상하게 다 알고 계신다.", "They are quiet, but somehow know everything."], ["괜히 말 걸면 내 속마음까지 들킬 것 같다.", "If I speak too much, they may read my mind."], ["웃는 얼굴이 제일 무섭다.", "That calm smile is the scariest part."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["회의실 자리 배치만 보고 조직도를 파악하는 사람", "Reads the org chart from meeting seats"], ["단톡방에서는 조용하지만 모든 갈등의 흐름을 아는 타입", "Quiet in group chat, aware of every conflict"], ["권력욕은 없다고 말하지만 일정표는 은근히 챙김", "Claims no ambition, quietly checks the calendar"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["입이 무겁고 약속을 지키는 책사", "A discreet strategist"], ["농담으로 긴장을 풀 줄 아는 궁중 친구", "A palace friend who breaks tension with wit"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["말 많은 친척", "Talkative relatives"], ["칭찬으로 함정을 파는 대신", "Officials who trap with compliments"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["소인은 모르옵니다, 라고 말한 사람이 제일 많이 알고 있었다더라.", "The one saying 'I know nothing' knew the most."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["가문을 살린 건 칼도 금도 아니라 눈치였다.", "The house survived by instinct, not gold or swords."]]) },
    ],
    shareTraits: localizedItems([["궁중 눈치", "Palace instincts"], ["조용한 전략", "Quiet strategy"], ["품격 생존", "Elegant survival"]]),
    shareLine: { ko: "내가 조선시대에 태어났다면 '궁궐 정치판을 읽는 왕실형 인간'이었대요. 조용한데 다 알고 있음...", en: "My Joseon result says I would have been a palace strategist. Quiet, but knows everything..." },
  },
  yangban: {
    titles: localizedItems([
      ["글로 운명을 바꾼 사대부", "The scholar who changed fate with words"],
      ["왕보다 눈치 빠른 책사형 선비", "The scholar-strategist with royal-level instincts"],
      ["조용히 판을 읽는 생존형 선비", "The quiet scholar who survives by reading the room"],
    ]),
    summaries: localizedItems([
      ["당신은 붓 하나로 집안의 분위기를 바꾸는 사람입니다.", "You change the mood of a whole household with one brush."],
      ["겉으로는 유교적 침착함, 속으로는 이미 한양 정치판 분석 중입니다.", "Calm outside, already analyzing Hanyang politics inside."],
    ]),
    identityNotes: localizedItems([
      ["문장력과 눈치로 가문을 지키는 선비", "A scholar protecting the house with prose and tact"],
      ["낙방도 훗날 큰 뜻의 숨 고르기로 포장하는 타입", "Can rebrand failure as preparation for greatness"],
    ]),
    keywords: localizedItems([["문장력", "Writing"], ["눈치", "Tact"], ["체면 관리", "Face management"], ["조용한 야망", "Quiet ambition"], ["가문 브랜딩", "Family branding"]]),
    childhood: (ctx, locale) =>
      locale === "ko"
        ? `${ctx.residence.ko}의 책 냄새 나는 집에서 태어난 당신은 어릴 때부터 글씨보다 사람 눈치를 먼저 익혔습니다. 서당에서는 얌전한 척했지만, 훈장님의 기분과 옆자리 아이의 약점을 동시에 파악하고 있었습니다.`
        : `Born in a book-scented house in ${ctx.residence.en}, you learned people before calligraphy.`,
    society: (ctx, locale) =>
      locale === "ko"
        ? `당신은 ${ctx.profession.ko}, 즉 ${jobFlavor(ctx, "ko")}에 가까운 사람이었습니다. 조선 사회에서 예의는 기본값이었고, 당신은 그 예의를 방패처럼 쓰면서도 속으로는 늘 다음 수를 계산했습니다.`
        : `You became a ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. Ritual was your baseline, strategy your second language.`,
    event: (ctx, locale) =>
      locale === "ko"
        ? `${ctx.event.ko} 때에는 모두가 우왕좌왕했지만, 당신은 먼저 붓을 들었습니다. 상소문인지 가족 단톡방 공지문인지 모를 문장으로 사람들을 진정시켰고, 한 번의 낙방쯤은 '큰 뜻을 위한 숨 고르기'로 포장했습니다.`
        : `During ${ctx.event.en}, others panicked while you reached for the brush first. Even failure became 'a pause before a greater purpose.'`,
    legacy: (_ctx, locale) =>
      locale === "ko"
        ? "후손들은 당신의 글을 읽고 말합니다. '이 조상님, 권력욕은 없다더니 문장마다 은근히 자리 욕심이 보인다.' 그래도 가문이 위기를 넘긴 순간마다 당신의 문장이 있었습니다."
        : "Your descendants read your writings and notice the ambition hidden between polite lines.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["예의는 지키지만 속으로는 계산이 빠름", "Polite, but quick with calculations"], ["정면승부보다 분위기 파악을 선호함", "Prefers reading the room to direct conflict"], ["말 한마디로 위기를 넘기는 타입", "Escapes crises with one sentence"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["권력자 앞에서는 조용히 고개를 끄덕임", "Nods quietly before power"], ["중요한 정보는 절대 놓치지 않음", "Never misses key information"], ["판이 기울 때 정확히 움직임", "Moves exactly when the board tilts"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["저 사람은 조용한데 이상하게 늘 살아남는다.", "Quiet, but always survives."], ["괜히 척지는 순간 내가 손해 볼 것 같다.", "Crossing them feels expensive."], ["술자리에서는 말이 없는데 다음 날 모든 소문을 알고 있다.", "Silent at drinks, informed by morning."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["회의 때는 말이 적지만 끝나고 가장 정확한 요약을 내놓는 사람", "Says little in meetings, writes the best recap"], ["팀플에서 마지막에 판 정리하는 사람", "The teammate who organizes the final board"], ["조용한 전략가", "Quiet strategist"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["말귀 빠른 역관", "A sharp interpreter"], ["실속 있는 상인", "A practical merchant"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["명분만 앞세우는 고집 센 선비", "A stubborn scholar obsessed with pretext"], ["상소문을 캡처하듯 외우는 정적", "A rival who remembers every petition"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["저 선비는 붓으로 싸우는데 칼보다 아프다더라.", "That scholar fights with a brush, and it hurts more than a blade."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["글씨는 단정했고 속마음은 꽤 복잡했다.", "The handwriting was neat. The mind was not simple."]]) },
    ],
    shareTraits: localizedItems([["문장력", "Writing"], ["눈치", "Tact"], ["조용한 야망", "Quiet ambition"]]),
    shareLine: { ko: "내가 조선시대에 태어났다면 '글로 운명을 바꾼 사대부'였대요. 근데 설명이 은근히 맞음...", en: "My Joseon result says I was a scholar who changed fate with words. Weirdly accurate..." },
  },
  military: {
    titles: localizedItems([["위기 앞에서 먼저 움직이는 무관", "The officer who moves first in crisis"], ["칼보다 판단이 빠른 전장형 인간", "Battlefield type with judgment faster than the blade"], ["나라보다 먼저 현장을 챙긴 실전파", "The field-first defender"]]),
    summaries: localizedItems([["당신은 말보다 행동이 먼저 나가지만, 의외로 판세 계산도 빠른 타입입니다.", "You act before talking, yet read the field fast."], ["위기 상황에서 갑자기 침착해지는 실전형 사람입니다.", "You become strangely calm when crisis arrives."]]),
    identityNotes: localizedItems([["기세와 책임감으로 버티는 현장 지휘형", "Field commander driven by nerve and duty"], ["위험한 순간에 존재감이 커지는 사람", "Someone who grows larger in dangerous moments"]]),
    keywords: localizedItems([["현장감", "Field sense"], ["책임감", "Duty"], ["빠른 판단", "Quick judgment"], ["정면 돌파", "Direct action"], ["의리", "Loyalty"]]),
    childhood: (ctx, locale) => locale === "ko" ? `${ctx.residence.ko}에서 자란 당신은 책상 앞보다 마당에서 더 빛났습니다. 어릴 때부터 몸이 먼저 반응했고, 싸움 구경을 하러 간 줄 알았더니 어느새 말리는 쪽에 서 있었습니다.` : `Growing up in ${ctx.residence.en}, you shone more in the yard than at the desk.`,
    society: (ctx, locale) => locale === "ko" ? `당신의 길은 ${ctx.profession.ko}, ${jobFlavor(ctx, "ko")}였습니다. 조선에서 무관은 늘 공을 세워도 문관보다 덜 주목받았지만, 정작 일이 터지면 모두가 당신을 찾았습니다.` : `Your path was ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. Less praised than civil officials, but everyone looked for you when things broke.`,
    event: (ctx, locale) => locale === "ko" ? `${ctx.event.ko}이 닥쳤을 때, 당신은 회의가 길어지는 순간 이미 신발끈을 묶고 있었습니다. 한 번은 모두가 후퇴를 말할 때 길목을 지켜 사람들을 빼냈고, 그날 이후 마을 아이들은 장난감 칼을 들고 당신 흉내를 냈습니다.` : `When ${ctx.event.en} arrived, you were tying your boots while others were still debating.`,
    legacy: (_ctx, locale) => locale === "ko" ? "기록에는 짧게 남았지만, 살아남은 사람들의 기억에는 길게 남았습니다. 후손들은 당신을 두고 '말은 투박했지만 결정적 순간에 제일 믿을 만한 사람'이라 부릅니다." : "Records were brief, but survivors remembered you at length.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["돌려 말하는 걸 답답해함", "Finds indirect speech frustrating"], ["사람을 말보다 행동으로 판단함", "Judges by action over words"], ["위기 때 오히려 표정이 안정됨", "Looks calmer in crisis"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["먼저 움직여 길을 확보함", "Moves first to secure the path"], ["상관의 말보다 현장의 소리를 믿음", "Trusts the field over formal orders"], ["내 사람은 끝까지 챙김", "Protects their people to the end"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["툭툭대도 결국 제일 먼저 와준다.", "Grumbles, but arrives first."], ["저 사람 있으면 왠지 길이 생긴다.", "When they are here, a path appears."], ["보고서는 짧은데 결과는 확실하다.", "Short reports, clear results."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["문제 터지면 슬랙보다 먼저 현장 가는 사람", "Goes to the scene before writing in Slack"], ["말보다 실행으로 신뢰 얻는 타입", "Earns trust through action"], ["위기관리 담당", "Crisis handler"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["뒤에서 판을 정리해주는 책사", "A strategist who organizes the rear"], ["정보 빠른 역관", "A fast-informed interpreter"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["책임은 안 지고 명령만 긴 사람", "People with long orders and no responsibility"], ["공은 가져가고 위험은 넘기는 상관", "Superiors who take credit and pass danger"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["저 무관은 회의 끝나기 전에 이미 해결하고 온다더라.", "That officer solves it before the meeting ends."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["화려한 말은 없었지만 피난길의 방향이 되었다.", "No fancy words, but became the road out."]]) },
    ],
    shareTraits: localizedItems([["빠른 판단", "Quick judgment"], ["현장감", "Field sense"], ["의리", "Loyalty"]]),
    shareLine: { ko: "내 조선시대 결과는 '위기 앞에서 먼저 움직이는 무관'. 회의보다 실행이 빠른 타입이라는데 좀 찔림.", en: "My Joseon result: the officer who moves first in crisis. Too accurate." },
  },
  jungin: {
    titles: localizedItems([["궁궐 밖 정보통", "The information broker outside the palace"], ["재주로 판을 뒤집는 중인 전문가", "The skilled specialist who changes the board"], ["말과 기술로 살아남은 실력파", "The talent-first survivor"]]),
    summaries: localizedItems([["신분보다 실력, 명분보다 결과로 존재감을 만드는 사람입니다.", "You build presence through skill, not status."], ["겉으로는 실무자지만 사실 흐름을 제일 정확히 압니다.", "Looks like staff, knows the flow best."]]),
    identityNotes: localizedItems([["재주와 정보력으로 인정받는 전문가형", "A specialist recognized through skill and information"], ["높은 자리보다 정확한 실력을 믿는 사람", "Trusts exact skill more than lofty titles"]]),
    keywords: localizedItems([["실력주의", "Merit"], ["정보력", "Information"], ["번역 능력", "Translation"], ["손기술", "Craft"], ["현실감각", "Practical sense"]]),
    childhood: (ctx, locale) => locale === "ko" ? `${ctx.residence.ko}에서 태어난 당신은 어릴 때부터 질문이 많았습니다. 어른들이 '그건 네가 몰라도 된다'고 하면, 당신은 더 조용히 알아냈습니다.` : `Born in ${ctx.residence.en}, you were a child of questions. If adults said you needn't know, you learned quietly.`,
    society: (ctx, locale) => locale === "ko" ? `당신은 ${ctx.profession.ko}, ${jobFlavor(ctx, "ko")}였습니다. 양반은 아니었지만 궁궐과 관아는 당신 같은 사람 없이는 제대로 돌아가지 않았습니다.` : `You were a ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. The state did not run without people like you.`,
    event: (ctx, locale) => locale === "ko" ? `${ctx.event.ko} 때, 사람들은 명분을 외쳤지만 당신은 필요한 도구와 정확한 말을 준비했습니다. 특히 어느 날 잘못 전달될 뻔한 말 한마디를 바로잡아 큰 오해를 막았고, 그 뒤로 관아 사람들은 당신 앞에서 함부로 아는 척하지 않았습니다.` : `During ${ctx.event.en}, while others shouted principles, you prepared the right tools and exact words.`,
    legacy: (_ctx, locale) => locale === "ko" ? "후손들은 당신을 두고 '직함은 작아 보여도 실제 권한은 손끝에 있었다'고 말합니다. 조용한 전문성이 당신의 이름을 오래 남겼습니다." : "Your descendants say the title looked small, but real power sat in your hands.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["아는 척보다 정확한 답을 좋아함", "Prefers accuracy to showing off"], ["사람 말의 빈칸을 잘 읽음", "Reads gaps in speech"], ["실수는 조용히 고치고 공은 크게 바라지 않음", "Fixes mistakes quietly"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["정보를 정리해 필요한 순간에 꺼냄", "Stores information for the right moment"], ["실력으로 함부로 못 대하게 만듦", "Uses skill to earn respect"], ["윗사람 말도 사실관계는 확인함", "Fact-checks even superiors"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["저 사람 없으면 일이 안 돌아간다.", "Nothing works without them."], ["말은 부드러운데 정정은 정확하다.", "Soft voice, precise correction."], ["진짜 핵심은 저 사람이 알고 있다.", "They know the real point."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["회사에서 시스템 제일 잘 아는 실무자", "The person who knows the system best"], ["회의 끝나고 진짜 액션아이템 정리하는 사람", "Writes the real action items after meetings"], ["조용한 핵심 인재", "Quiet key talent"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["실무를 존중하는 양반", "A noble who respects skill"], ["소문 빠른 객주", "A well-informed brokerage host"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["체면 때문에 오류를 인정 못 하는 사람", "People who cannot admit errors"], ["실무는 모르고 말만 큰 사람", "Loud people with no practical knowledge"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["관아의 진짜 비밀번호는 저 사람이 알고 있다더라.", "They know the office's real password."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["족보보다 업무 매뉴얼에 이름이 남을 사람.", "Belongs in the manual more than the genealogy."]]) },
    ],
    shareTraits: localizedItems([["정보력", "Information"], ["실력", "Skill"], ["현실감각", "Practical sense"]]),
    shareLine: { ko: "조선시대 내 결과는 '궁궐 밖 정보통'. 조용한데 시스템 제일 잘 아는 사람이라네요.", en: "My Joseon result: the information broker outside the palace." },
  },
  merchant: {
    titles: localizedItems([["한양을 접수한 실속파 상인", "The practical merchant who took Hanyang"], ["장터를 뒤흔든 말발 천재", "The silver-tongued genius of the market"], ["손익과 사람 마음을 같이 읽는 장사꾼", "The trader who reads profit and people"]]),
    summaries: localizedItems([["당신은 계산이 빠르지만, 사람 마음값까지 넣어 계산하는 타입입니다.", "You calculate fast, including the price of feelings."], ["위기를 할인 행사처럼 포장해 기회로 바꾸는 사람입니다.", "You package crisis like a sale and turn it into opportunity."]]),
    identityNotes: localizedItems([["말발과 실속으로 판을 키우는 상인형", "A merchant type who grows the board with talk and practicality"], ["돈만 보는 게 아니라 사람의 흐름을 보는 사람", "Reads people flow, not just money"]]),
    keywords: localizedItems([["말발", "Persuasion"], ["실속", "Practicality"], ["계산력", "Calculation"], ["네트워크", "Network"], ["위기 세일즈", "Crisis sales"]]),
    childhood: (ctx, locale) => locale === "ko" ? `${ctx.residence.ko}의 길목에서 자란 당신은 숫자보다 먼저 흥정을 배웠습니다. 어릴 때부터 사탕 하나를 나눠 먹어도 누가 더 만족했는지 계산하는 묘한 재주가 있었습니다.` : `Growing up near the roads of ${ctx.residence.en}, you learned bargaining before numbers.`,
    society: (ctx, locale) => locale === "ko" ? `당신은 ${ctx.profession.ko}, ${jobFlavor(ctx, "ko")}였습니다. 조선에서 상인은 늘 낮게 평가받기도 했지만, 정작 사람들의 하루는 당신이 가져온 물건과 소문으로 굴러갔습니다.` : `You were a ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. Merchants were underrated, yet daily life moved through your goods and rumors.`,
    event: (ctx, locale) => locale === "ko" ? `${ctx.event.ko}에는 길이 막히고 값이 흔들렸습니다. 하지만 당신은 '지금 사면 훗날 귀해진다'는 말로 사람들을 설득했고, 한 번은 비 오는 장날에 팔리지 않던 물건을 '하늘이 인증한 방수 시험'이라며 전부 팔아버렸습니다.` : `During ${ctx.event.en}, roads closed and prices shook. You sold uncertainty as future value.`,
    legacy: (_ctx, locale) => locale === "ko" ? "후손들은 당신을 두고 '장부에는 숫자를, 사람들 기억에는 말맛을 남긴 조상'이라 합니다. 당신의 진짜 유산은 돈보다 넓은 거래망이었습니다." : "Your legacy was a network wider than money and a pitch people still remember.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["친절하지만 머릿속 장부는 항상 열려 있음", "Kind, but the ledger is always open"], ["손해 보는 척하면서 다음 거래를 봄", "Looks like losing, plans the next trade"], ["사람 취향을 빨리 파악함", "Reads preferences fast"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["소문을 물건보다 먼저 확보함", "Secures rumors before goods"], ["거절도 다음 거래의 밑밥으로 씀", "Uses rejection as future bait"], ["위기에는 품목보다 경로를 바꿈", "Changes routes before products in crisis"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["분명 비싸게 샀는데 기분은 좋다.", "I overpaid, yet feel good."], ["저 사람은 장터보다 사람 마음을 판다.", "They sell to hearts, not markets."], ["소문이 물건보다 빨리 온다.", "Their rumors arrive before their goods."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["중고거래 설명글을 너무 잘 쓰는 사람", "Writes dangerously good marketplace listings"], ["회의에서 예산 얘기 나오면 갑자기 또렷해지는 타입", "Sharpens when budget appears"], ["네트워킹 천재", "Networking genius"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["실무 빠른 중인", "A practical specialist"], ["정직한 농민", "An honest farmer"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["계약서를 대충 보는 사람", "People who skim contracts"], ["말만 번지르르한 경쟁 상인", "Glossy rival merchants"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["저 상인은 빈 수레도 스토리 붙여서 팔 수 있다더라.", "They could sell an empty cart with the right story."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["가문 최초의 마케팅 담당자.", "The family's first marketer."]]) },
    ],
    shareTraits: localizedItems([["말발", "Persuasion"], ["계산력", "Calculation"], ["네트워크", "Network"]]),
    shareLine: { ko: "조선시대 내 결과는 '한양을 접수한 실속파 상인'. 말발이랑 계산력으로 살아남는 타입이라네요.", en: "My Joseon result: the practical merchant who took Hanyang." },
  },
  farmer: {
    titles: localizedItems([["계절을 이기는 생활력 장인", "The life-force master who beats the seasons"], ["땅의 기분까지 읽는 현실형 인간", "The practical soul who reads the land"], ["조용히 집안을 살리는 근성파", "The steady one who keeps the household alive"]]),
    summaries: localizedItems([["당신은 화려하진 않아도 결국 모두가 기대는 단단한 사람입니다.", "Not flashy, but everyone eventually leans on you."], ["말보다 손이 먼저 움직이고, 결과로 신뢰를 얻는 타입입니다.", "Hands move before words; trust comes through results."]]),
    identityNotes: localizedItems([["계절과 살림을 버티는 생활형 인재", "A practical talent who endures seasons and household needs"], ["작은 자원을 오래 쓰는 현실 감각의 소유자", "Turns little resources into long survival"]]),
    keywords: localizedItems([["생활력", "Life force"], ["근성", "Grit"], ["현실감각", "Practicality"], ["꾸준함", "Steadiness"], ["살림 지능", "Household intelligence"]]),
    childhood: (ctx, locale) => locale === "ko" ? `${ctx.residence.ko} 근처에서 자란 당신은 하늘 색만 보고도 어른들의 표정이 왜 굳는지 알았습니다. 어린 시절 장난감보다 중요한 것은 내일 비가 올지, 집에 쌀이 얼마나 남았는지였습니다.` : `Growing up near ${ctx.residence.en}, you read adult worries from the color of the sky.`,
    society: (ctx, locale) => locale === "ko" ? `당신은 ${ctx.profession.ko}, ${jobFlavor(ctx, "ko")}였습니다. 조선의 큰 이야기는 궁궐에서 쓰였지만, 실제 하루하루는 당신 같은 사람들이 버틴 땅 위에서 이어졌습니다.` : `You were a ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. Grand history was written at court, but daily life stood on people like you.`,
    event: (ctx, locale) => locale === "ko" ? `${ctx.event.ko}에도 계절은 멈추지 않았습니다. 모두가 큰일을 말할 때 당신은 씨앗, 물, 식구들의 끼니를 챙겼습니다. 한 번은 잔칫날이 엉망이 될 뻔했지만, 당신이 남은 재료로 뚝딱 차린 밥상 때문에 마을 싸움이 밥 먹다가 풀렸다는 이야기가 있습니다.` : `Even during ${ctx.event.en}, the seasons did not stop. You kept seed, water, and meals in order.`,
    legacy: (_ctx, locale) => locale === "ko" ? "후손들은 당신을 '기록에는 작게 나오지만 집안의 오늘을 만든 사람'이라 기억합니다. 당신이 남긴 것은 논밭보다 더 단단한 버티는 법이었습니다." : "Your descendants remember you as the person who made the family's today possible.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["말보다 몸이 먼저 움직임", "Acts before talking"], ["작은 낭비를 잘 못 참음", "Cannot stand small waste"], ["사람의 진심을 오래 보고 판단함", "Judges sincerity over time"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["계절보다 반 박자 먼저 준비함", "Prepares half a beat before the season"], ["큰소리보다 매일의 루틴을 믿음", "Trusts routine over loud claims"], ["내 사람 먹이는 일을 최우선으로 둠", "Feeds their people first"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["저 사람 손만 거치면 뭐든 쓸모가 생긴다.", "Everything becomes useful in their hands."], ["화려하진 않아도 제일 든든하다.", "Not flashy, but most reliable."], ["싸우다가도 저 집 밥 먹으면 풀린다.", "Their table can end an argument."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["월급날 전까지 냉장고 파먹기 고수", "A master of surviving until payday"], ["팀에서 아무도 안 챙긴 기본기를 챙기는 사람", "Handles basics everyone forgot"], ["생활력 만렙", "Max-level practical life skill"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["정직한 상인", "An honest merchant"], ["허세 없는 무관", "A grounded officer"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["입으로만 돕는 사람", "People who help only with words"], ["남의 수고를 당연하게 여기는 사람", "People who take effort for granted"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["저 집은 아무리 힘들어도 밥 냄새가 먼저 난다더라.", "That house smells of food before it speaks of hardship."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["우리 집 버티는 힘은 여기서 시작됐다.", "Our family's endurance began here."]]) },
    ],
    shareTraits: localizedItems([["생활력", "Life force"], ["꾸준함", "Steadiness"], ["살림 지능", "Practical intelligence"]]),
    shareLine: { ko: "조선시대 내 결과는 '계절을 이기는 생활력 장인'. 화려하진 않은데 제일 든든한 타입이래요.", en: "My Joseon result: the life-force master who beats the seasons." },
  },
  gisaeng: {
    titles: localizedItems([["시와 소문을 다루는 예술가", "The artist of poetry and rumor"], ["한양의 분위기를 바꾼 말맛 천재", "The wit that changed Hanyang's mood"], ["재주로 이름을 남긴 무대형 인간", "The stage-born talent remembered by skill"]]),
    summaries: localizedItems([["당신은 분위기를 읽고, 말 한 줄로 방 안의 권력을 바꾸는 사람입니다.", "You read the room and change its power with one line."], ["예술성에 눈치와 기억력까지 붙은 고급형 타입입니다.", "Artistic, perceptive, and dangerously observant."]]),
    identityNotes: localizedItems([["예술과 정보 감각으로 존재감을 남긴 인물", "A presence made through art and information"], ["가볍게 웃지만 중요한 말은 절대 흘리지 않는 사람", "Laughs lightly, remembers serious words"]]),
    keywords: localizedItems([["예술감각", "Artistry"], ["분위기 장악", "Mood control"], ["기억력", "Memory"], ["말맛", "Wit"], ["품격", "Poise"]]),
    childhood: (ctx, locale) => locale === "ko" ? `${ctx.residence.ko}에서 자란 당신은 어릴 때부터 소리와 표정에 예민했습니다. 누가 박자를 놓치는지, 누가 거짓 웃음을 짓는지 금방 알아차렸습니다.` : `Growing up in ${ctx.residence.en}, you were sensitive to rhythm and expression from childhood.`,
    society: (ctx, locale) => locale === "ko" ? `당신은 ${ctx.profession.ko}, ${jobFlavor(ctx, "ko")}였습니다. 조선 사회의 제약 속에서도 당신은 시, 노래, 말솜씨로 자기 이름을 또렷하게 남겼습니다.` : `You were a ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. Within Joseon's limits, your art made your name clear.`,
    event: (ctx, locale) => locale === "ko" ? `${ctx.event.ko} 무렵, 사람들의 마음은 쉽게 거칠어졌습니다. 당신은 잔치 자리에서 한 곡조로 분위기를 눌렀고, 어느 날 술기운에 새어 나온 위험한 말을 시 한 구절로 덮어 누군가의 체면을 살렸습니다.` : `Around ${ctx.event.en}, tempers sharpened. You cooled rooms with song and covered danger with wit.`,
    legacy: (_ctx, locale) => locale === "ko" ? "후대에는 당신을 두고 '노래보다 더 오래 남은 것은 그 사람의 감각'이라 말합니다. 누군가는 아직도 당신의 시 한 줄을 자기 이야기처럼 읽습니다." : "Later people say your sense lasted longer than the songs themselves.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["웃으면서도 방 안의 서열을 파악함", "Smiles while mapping hierarchy"], ["상대가 듣고 싶은 말과 들어야 할 말을 구분함", "Knows wanted words from needed words"], ["감정 표현은 섬세하지만 중심은 단단함", "Expressive, but centered"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["예술을 방패이자 무기로 씀", "Uses art as shield and weapon"], ["소문은 기억하되 함부로 팔지 않음", "Remembers rumors, sells none cheaply"], ["분위기를 바꿔 위기를 넘김", "Changes the mood to escape danger"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["저 사람 앞에서는 허세가 오래 못 간다.", "Pretension cannot last before them."], ["한마디가 시 같은데 뼈가 있다.", "Every line is poetic and sharp."], ["웃다가 정신 차리면 내가 다 말하고 있다.", "I laugh, then realize I confessed everything."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["분위기 살리는 크리에이터", "A creator who controls the mood"], ["단톡방 한 줄로 공기 바꾸는 사람", "Changes group chat air with one line"], ["센스 있는 진행자", "A tasteful host"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["예술을 존중하는 선비", "A scholar who respects art"], ["비밀을 지키는 중인", "A specialist who keeps secrets"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["재주를 가볍게 소비하려는 사람", "People who consume talent lightly"], ["술기운에 선 넘는 사람", "People who cross lines while drunk"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["저 사람 시 한 줄에 양반 셋이 조용해졌다더라.", "One line of their poetry silenced three nobles."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["이름은 작게 적혔어도 감각은 크게 남았다.", "The name was written small; the sense remained large."]]) },
    ],
    shareTraits: localizedItems([["예술감각", "Artistry"], ["말맛", "Wit"], ["분위기 장악", "Mood control"]]),
    shareLine: { ko: "조선시대 내 결과는 '시와 소문을 다루는 예술가'. 분위기 읽는 능력은 인정...", en: "My Joseon result: the artist of poetry and rumor." },
  },
  nobi: {
    titles: localizedItems([["조용히 판을 읽는 생존 지능형", "The quiet survivor with sharp social intelligence"], ["집안의 흐름을 실제로 움직인 숨은 실력자", "The hidden force who kept the house moving"], ["낮은 자리에서 가장 넓게 본 사람", "The one who saw widest from a hard place"]]),
    summaries: localizedItems([["당신은 불리한 조건에서도 사람과 상황을 읽어 자기 길을 만드는 사람입니다.", "You build a path by reading people even from unfair conditions."], ["겉으로는 물러서지만, 중요한 정보와 기술은 절대 놓치지 않습니다.", "You step back outwardly, but never miss key information or skill."]]),
    identityNotes: localizedItems([["제약 속에서도 품위와 지혜를 잃지 않는 사람", "Dignified and wise under restriction"], ["보이지 않는 곳에서 실제 하루를 굴리는 인물", "The person who quietly keeps daily life moving"]]),
    keywords: localizedItems([["생존 지능", "Survival intelligence"], ["눈치", "Social reading"], ["손재주", "Practical skill"], ["회복력", "Resilience"], ["숨은 영향력", "Hidden influence"]]),
    childhood: (ctx, locale) => locale === "ko" ? `${ctx.residence.ko}에서 태어난 당신은 어릴 때부터 말보다 표정을 먼저 배웠습니다. 누가 화났는지, 언제 조용히 물러나야 하는지, 어디에 작은 기회가 숨어 있는지 누구보다 빨리 알았습니다.` : `Born in ${ctx.residence.en}, you learned expressions before words and found small openings faster than anyone.`,
    society: (ctx, locale) => locale === "ko" ? `당신은 ${ctx.profession.ko}, ${jobFlavor(ctx, "ko")}였습니다. 신분의 제약은 컸지만, 당신은 그 안에서 기술과 기억력, 사람 읽는 감각을 갈고닦았습니다.` : `You were a ${ctx.profession.en}, ${jobFlavor(ctx, "en")}. The limits were real, yet you honed skill, memory, and social reading.`,
    event: (ctx, locale) => locale === "ko" ? `${ctx.event.ko} 때, 위에서는 큰 명분을 말했지만 아래에서는 실제로 먹고살 길을 찾아야 했습니다. 당신은 흩어진 사람들을 챙기고, 필요한 물건을 빼놓지 않았고, 한 번은 모두가 잃어버린 줄 알았던 문서를 찾아 집안 전체의 위기를 막았습니다.` : `During ${ctx.event.en}, grand causes were spoken above while survival had to be solved below. You found what others lost.`,
    legacy: (_ctx, locale) => locale === "ko" ? "후손들은 당신을 낮은 말로 기억하지 않습니다. 오히려 '가장 어려운 자리에서 가장 오래 버틴 사람'이라 부릅니다. 당신의 유산은 굴욕이 아니라 회복력과 실전 지혜입니다." : "Your descendants do not remember you through humiliation, but as the one who endured the hardest place with dignity.",
    sections: [
      { title: { ko: "조선에서의 성격", en: "Personality in Joseon" }, items: localizedItems([["말은 아껴도 관찰은 깊음", "Few words, deep observation"], ["상대의 기분 변화를 빨리 감지함", "Detects mood shifts fast"], ["작은 기술을 자기 무기로 만듦", "Turns small skills into tools"]]) },
      { title: { ko: "당신의 생존 전략", en: "Survival strategy" }, items: localizedItems([["나서기보다 필요한 순간에 정확히 움직임", "Moves exactly when needed"], ["정보를 흘리지 않고 기억해 둠", "Keeps information in memory"], ["내 사람에게는 조용히 도움을 남김", "Leaves quiet help for their people"]]) },
      { title: { ko: "주변 사람들의 평가", en: "What people say" }, items: localizedItems([["저 사람 없으면 집안 하루가 안 굴러간다.", "The household cannot run without them."], ["조용한데 제일 많이 알고 있다.", "Quiet, yet knows the most."], ["부탁하면 어떻게든 방법을 찾아낸다.", "Ask them, and a way appears."]]) },
      { title: { ko: "현대로 치면", en: "Modern version" }, items: localizedItems([["조직의 비공식 운영체제 같은 사람", "The unofficial operating system of a team"], ["단톡방은 조용하지만 상황은 다 알고 있는 사람", "Quiet in group chat, knows everything"], ["위기 때 필요한 물건을 이미 챙겨둔 타입", "Already packed what crisis needs"]]) },
      { title: { ko: "잘 맞는 인물", en: "Best match" }, items: localizedItems([["사람을 신분보다 태도로 보는 인물", "Someone who sees attitude before rank"], ["실속 있고 의리 있는 상인", "A practical, loyal merchant"]]) },
      { title: { ko: "조심해야 할 인물", en: "Watch out for" }, items: localizedItems([["남의 수고를 당연히 여기는 사람", "People who treat effort as owed"], ["비밀을 가볍게 떠드는 사람", "People careless with secrets"]]) },
      { title: { ko: "한 줄 유언비어", en: "Rumor line" }, items: localizedItems([["저 사람은 몰라서 가만있는 게 아니라 다 알아서 가만있다더라.", "They are not silent from ignorance, but from knowing enough."]]) },
      { title: { ko: "후손들의 평가", en: "Descendants say" }, items: localizedItems([["어려운 자리에서도 품위를 잃지 않은 조상.", "An ancestor who kept dignity in a hard place."]]) },
    ],
    shareTraits: localizedItems([["생존 지능", "Survival intelligence"], ["눈치", "Social reading"], ["회복력", "Resilience"]]),
    shareLine: { ko: "조선시대 내 결과는 '조용히 판을 읽는 생존 지능형'. 낮은 자리에서도 제일 많이 아는 타입이래요.", en: "My Joseon result: the quiet survivor with sharp social intelligence." },
  },
};

export function buildRichJoseonResult(ctx: FateContext): RichJoseonResult {
  const profile = JOSEON_PROFILES[ctx.cls.id];
  const title = pickLocalized(ctx.rng, profile.titles);
  const summary = pickLocalized(ctx.rng, profile.summaries);
  const identityNote = pickLocalized(ctx.rng, profile.identityNotes);
  const keywords = [...profile.keywords]
    .sort(() => ctx.rng() - 0.5)
    .slice(0, 4);
  const story = {
    ko: [
      profile.childhood(ctx, "ko"),
      profile.society(ctx, "ko"),
      profile.event(ctx, "ko"),
      profile.legacy(ctx, "ko"),
    ].join("\n\n"),
    en: [
      profile.childhood(ctx, "en"),
      profile.society(ctx, "en"),
      profile.event(ctx, "en"),
      profile.legacy(ctx, "en"),
    ].join("\n\n"),
  };

  return {
    title,
    summary,
    keywords,
    identityNote,
    story,
    sections: profile.sections,
    shareTraits: profile.shareTraits,
    shareLine: profile.shareLine,
  };
}

// ─── Fate story per class+gender ─────────────────────────────
export function buildFateStory(ctx: FateContext, locale: "ko" | "en"): string {
  return buildRichJoseonResult(ctx).story[locale];
}

export function buildLegacyFateStory(ctx: FateContext, locale: "ko" | "en"): string {
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
