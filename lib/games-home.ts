export type Lang = "ko" | "en";
export type CatId = "play" | "self" | "sim" | "world";
export type HomeCatId = "featured" | "tests" | "compatibility" | "mini-games";
export type ContentType = "test" | "compatibility" | "fortune" | "game";
export type FontKind = "serif" | "sans" | "mono";

export type Skin =
  | "paper"
  | "block"
  | "hand"
  | "pixel"
  | "mono"
  | "sticker";

export type Tone = 1 | 2 | 3 | 4 | 5;
export type GameLabel = "popular" | "recommended" | "new" | "quick" | "share";

export interface Category {
  id: CatId;
  labelKo: string;
  labelEn: string;
  subKo: string;
  subEn: string;
}

export interface HomeCategory {
  id: HomeCatId;
  labelKo: string;
  labelEn: string;
  subKo: string;
  subEn: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "play",
    labelKo: "도전",
    labelEn: "Challenge",
    subKo: "반사신경, 타이밍, 정확도. 손끝으로 바로 즐기는 게임.",
    subEn: "Reflex, timing, precision. Your hand decides.",
  },
  {
    id: "self",
    labelKo: "진단",
    labelEn: "Know Yourself",
    subKo: "성격, 궁합, 감각을 가볍게 확인하는 테스트.",
    subEn: "Tests that end with a playful verdict about you.",
  },
  {
    id: "sim",
    labelKo: "시뮬레이션",
    labelEn: "Live It",
    subKo: "가상의 상황 속으로 들어가 선택하고 살아보는 경험.",
    subEn: "Step into a scenario and live it out.",
  },
  {
    id: "world",
    labelKo: "탐험",
    labelEn: "Explore",
    subKo: "세상의 규모, 역사, 데이터, 지식을 인터랙티브하게 보기.",
    subEn: "The shape of the world, explored through data and interaction.",
  },
];

export const PUBLIC_CATEGORIES: HomeCategory[] = [
  {
    id: "featured",
    labelKo: "추천 콘텐츠",
    labelEn: "Featured",
    subKo: "처음 왔다면 여기서 시작하기 좋은 대표 테스트와 놀이.",
    subEn: "Start here with the most shareable tests and plays.",
  },
  {
    id: "tests",
    labelKo: "테스트",
    labelEn: "Tests",
    subKo: "나를 이상하게 잘 맞히는 심리, 성격, 문화 감각 테스트.",
    subEn: "Psychology, personality, and culture tests that feel weirdly accurate.",
  },
  {
    id: "compatibility",
    labelKo: "궁합 & 관계",
    labelEn: "Compatibility & Relationships",
    subKo: "친구, 연인, 드라마 속 인연처럼 함께 보기 좋은 결과.",
    subEn: "Relationship and compatibility results to read together.",
  },
  {
    id: "mini-games",
    labelKo: "미니게임",
    labelEn: "Mini Games",
    subKo: "짧고 가볍게 즐기는 브라우저 게임",
    subEn: "Quick browser games you can play anytime.",
  },
];

export const FUTURE_TESTS = [
  { ko: "도덕 나침반 테스트", en: "Moral Compass Test" },
  { ko: "의사결정 스타일 테스트", en: "Decision Style Test" },
];

export interface Palette {
  bg: string;
  paper: string;
  ink: string;
  accent: string;
  sub: string;
  line: string;
}

export interface GameCopy {
  title: string;
  sub: string;
  kicker: string;
}

export interface Game {
  id: string;
  href: string;
  cat: CatId;
  no: string;
  ko: GameCopy;
  en: GameCopy;
  palette: Palette;
  font: FontKind;
  type?: ContentType;
  category?: HomeCatId;
  thumb?: string;
  skin?: Skin;
  tone?: Tone;
  art?: string;
  labels?: GameLabel[];
  duration?: { ko: string; en: string };
}

export const LABEL_TEXT: Record<GameLabel, { ko: string; en: string }> = {
  popular: { ko: "인기", en: "Popular" },
  recommended: { ko: "추천", en: "Pick" },
  new: { ko: "신규", en: "New" },
  quick: { ko: "30초", en: "Quick" },
  share: { ko: "공유각", en: "Shareable" },
};

export const T: Record<Lang, {
  nav: { games: string; about: string };
  tagline_top: string;
  title_sub: string;
  section: Record<CatId, string>;
  section_en: Record<CatId, string>;
  play: string;
  today: string;
  todays_pick_label: string;
  footer_made: string;
  hero_count: string;
  count_unit: string;
}> = {
  ko: {
    nav: { games: "게임", about: "소개" },
    tagline_top: "이상하게 나를 잘 맞히는 테스트 놀이터",
    title_sub:
      "궁합, 심리, 운세, 밈 감각까지. 친구와 연인에게 보내기 좋은 결과형 테스트를 모았습니다.",
    section: {
      play: "도전",
      self: "진단",
      sim: "시뮬레이션",
      world: "탐험",
    },
    section_en: {
      play: "01 CHALLENGE",
      self: "02 KNOW YOURSELF",
      sim: "03 LIVE IT",
      world: "04 EXPLORE",
    },
    play: "시작하기",
    today: "오늘",
    todays_pick_label: "오늘의 추천",
    footer_made: "Studio4Any가 만드는 Nolza.fun",
    hero_count: "VIRAL TESTS · SHAREABLE RESULTS",
    count_unit: "개",
  },
  en: {
    nav: { games: "Games", about: "About" },
    tagline_top: "Fun tests that feel weirdly accurate.",
    title_sub:
      "Compatibility, psychology, fortune-style fun, and culture tests made to share.",
    section: {
      play: "Challenge",
      self: "Know Yourself",
      sim: "Live It",
      world: "Explore",
    },
    section_en: {
      play: "01 CHALLENGE",
      self: "02 KNOW YOURSELF",
      sim: "03 LIVE IT",
      world: "04 EXPLORE",
    },
    play: "Play",
    today: "TODAY",
    todays_pick_label: "TODAY'S PICKS",
    footer_made: "Made by Studio4Any for Nolza.fun",
    hero_count: "VIRAL TESTS · SHAREABLE RESULTS",
    count_unit: "plays",
  },
};

const P = {
  ijyDark: {
    bg: "#0A0A0B",
    paper: "#111114",
    ink: "#F2EDE0",
    accent: "#E5C76B",
    sub: "#8A8478",
    line: "rgba(242,237,224,0.1)",
  } as Palette,
  receipt: {
    bg: "#F1EDE3",
    paper: "#FBF7EE",
    ink: "#1A1410",
    accent: "#B2102B",
    sub: "#6B6258",
    line: "rgba(20,20,20,0.12)",
  } as Palette,
  void: {
    bg: "#0D0D0D",
    paper: "#0D0D0D",
    ink: "#F5F5F5",
    accent: "#F5F5F5",
    sub: "#666666",
    line: "rgba(245,245,245,0.15)",
  } as Palette,
  paper: {
    bg: "#F4EFE4",
    paper: "#FBF7EE",
    ink: "#14110E",
    accent: "#B2102B",
    sub: "#6B6258",
    line: "rgba(20,17,14,0.12)",
  } as Palette,
  paperBlue: {
    bg: "#F4EFE4",
    paper: "#FBF7EE",
    ink: "#14110E",
    accent: "#1B3B5F",
    sub: "#6B6258",
    line: "rgba(20,17,14,0.12)",
  } as Palette,
  paperGold: {
    bg: "#F4EBD8",
    paper: "#FAF3E0",
    ink: "#2B1F12",
    accent: "#B08B3E",
    sub: "#7A6248",
    line: "rgba(43,31,18,0.15)",
  } as Palette,
  ink: {
    bg: "#1A1B2E",
    paper: "#22243C",
    ink: "#E8E6F0",
    accent: "#9B8AFF",
    sub: "#7B7995",
    line: "rgba(232,230,240,0.12)",
  } as Palette,
  thread: {
    bg: "#F8F3E6",
    paper: "#FFFCF2",
    ink: "#3B2A1F",
    accent: "#C25A4E",
    sub: "#7A6555",
    line: "rgba(59,42,31,0.15)",
  } as Palette,
  tape: {
    bg: "#FFF1E6",
    paper: "#FFFAF3",
    ink: "#5A2E1F",
    accent: "#FF6B35",
    sub: "#B07050",
    line: "rgba(90,46,31,0.15)",
  } as Palette,
  deepSea: {
    bg: "#02101F",
    paper: "#06203A",
    ink: "#E8F1FF",
    accent: "#5DD9FF",
    sub: "#6B8AAE",
    line: "rgba(232,241,255,0.12)",
  } as Palette,
  cosmos: {
    bg: "#0B0F1A",
    paper: "#11172A",
    ink: "#F0F0FF",
    accent: "#FFD166",
    sub: "#6E7491",
    line: "rgba(240,240,255,0.1)",
  } as Palette,
  saju: {
    bg: "#0F0A14",
    paper: "#1A1224",
    ink: "#F5E6FF",
    accent: "#C9A66B",
    sub: "#8A7A95",
    line: "rgba(245,230,255,0.12)",
  } as Palette,
  drama: {
    bg: "#FFF0F3",
    paper: "#FFF8FA",
    ink: "#3B0F1A",
    accent: "#D9446B",
    sub: "#A8728A",
    line: "rgba(59,15,26,0.15)",
  } as Palette,
  forest: {
    bg: "#0A4D2E",
    paper: "#0E5938",
    ink: "#F4F1E8",
    accent: "#FFD700",
    sub: "#A8C9B5",
    line: "rgba(244,241,232,0.18)",
  } as Palette,
  emberDark: {
    bg: "#1A0E08",
    paper: "#241612",
    ink: "#FFE8C4",
    accent: "#FF7A3D",
    sub: "#B5896E",
    line: "rgba(255,232,196,0.12)",
  } as Palette,
  paperRed: {
    bg: "#FFF6E8",
    paper: "#FFFBF0",
    ink: "#3D2410",
    accent: "#D9501E",
    sub: "#9C7A55",
    line: "rgba(61,36,16,0.15)",
  } as Palette,
  war: {
    bg: "#1A1410",
    paper: "#241A14",
    ink: "#F4ECD8",
    accent: "#C9A66B",
    sub: "#A89880",
    line: "rgba(244,236,216,0.18)",
  } as Palette,
  rosegold: {
    bg: "#0A0A0A",
    paper: "#141414",
    ink: "#FFFFFF",
    accent: "#E8C4B8",
    sub: "#A89A95",
    line: "rgba(232,196,184,0.18)",
  } as Palette,
};

export const GAMES: Game[] = [
  {
    id: "react", href: "/games/react", cat: "play", no: "01",
    ko: { title: "반응속도", sub: "초록불이 켜지는 순간 탭하세요", kicker: "Reaction time" },
    en: { title: "Reaction Speed", sub: "Tap the second it turns green", kicker: "Reaction time" },
    type: "game", category: "mini-games",
    palette: P.forest, font: "mono", thumb: "/thumbnails-generated/react.png",
    skin: "pixel", art: "react", labels: ["popular", "quick"], duration: { ko: "약 20초", en: "20 sec" },
  },
  {
    id: "timesense", href: "/games/timesense", cat: "play", no: "02",
    ko: { title: "시간 감각", sub: "눈을 감고 10초를 맞혀보세요", kicker: "내 안의 시계" },
    en: { title: "Time Sense", sub: "Close your eyes. Stop at 10s.", kicker: "Internal clock" },
    type: "game", category: "mini-games",
    palette: P.paperBlue, font: "serif", thumb: "/thumbnails-generated/timesense.png",
    skin: "mono", labels: ["quick"], duration: { ko: "약 15초", en: "15 sec" },
  },
  {
    id: "circle", href: "/games/circle", cat: "play", no: "03",
    ko: { title: "완벽한 원 그리기", sub: "한 번에 그릴수록 인생이 편안해집니다", kicker: "손끝 정확도" },
    en: { title: "Draw a Perfect Circle", sub: "One stroke, one chance", kicker: "Precision by hand" },
    type: "game", category: "mini-games",
    palette: P.paperBlue, font: "serif", thumb: "/thumbnails-generated/circle.png",
    skin: "hand", tone: 2, labels: ["recommended", "quick", "share"], duration: { ko: "약 10초", en: "10 sec" },
  },
  {
    id: "silence", href: "/games/silence", cat: "play", no: "04",
    ko: { title: "SILENCE", sub: "아무것도 하지 마세요", kicker: "5분 침묵 챌린지" },
    en: { title: "SILENCE.", sub: "Do absolutely nothing", kicker: "5-minute silence challenge" },
    type: "game", category: "mini-games",
    palette: P.void, font: "sans", thumb: "/thumbnails-generated/silence.png",
    skin: "mono",
  },
  {
    id: "ppalli", href: "/games/ppalli", cat: "play", no: "05",
    ko: { title: "빨리빨리", sub: "한국 생활 압박 상황을 처리하세요", kicker: "속도 시뮬레이션" },
    en: { title: "Ppalli-ppalli", sub: "Handle Korean speed-pressure scenes", kicker: "Korean urgency sim" },
    type: "game", category: "mini-games",
    palette: P.tape, font: "sans", thumb: "/thumbnails-generated/ppalli.png",
    skin: "block", tone: 3,
  },
  {
    id: "password", href: "/games/password", cat: "play", no: "06",
    ko: { title: "한국식 비밀번호 게임", sub: "규칙은 점점 이상해집니다", kicker: "조건의 미로" },
    en: { title: "Korean Password Game", sub: "Rules get weirder by the rule", kicker: "A maze of conditions" },
    type: "game", category: "mini-games",
    palette: P.tape, font: "mono", thumb: "/thumbnails-generated/password.png",
    skin: "pixel", labels: ["popular", "share"],
  },
  {
    id: "traffic", href: "/games/traffic", cat: "play", no: "07",
    ko: { title: "교통 지옥", sub: "빨간 차를 출구로 빼내보세요", kicker: "15개 주차 퍼즐" },
    en: { title: "Traffic Hell", sub: "Get the red car out", kicker: "15 sliding-block puzzles" },
    type: "game", category: "mini-games",
    palette: P.ijyDark, font: "mono", thumb: "/thumbnails-generated/traffic.png",
    skin: "block", tone: 1,
  },
  {
    id: "highnote", href: "/games/highnote", cat: "play", no: "08",
    ko: { title: "고음 챌린지", sub: "당신의 목소리는 어디까지 올라갈까요", kicker: "마이크 ON" },
    en: { title: "High Note Challenge", sub: "How high can you really go?", kicker: "Mic on" },
    type: "game", category: "mini-games",
    palette: P.emberDark, font: "sans", thumb: "/thumbnails-generated/highnote.png",
    skin: "block", tone: 5,
  },
  {
    id: "aqua-fishing", href: "/games/aqua-fishing", cat: "play", no: "09",
    ko: { title: "심해 낚시", sub: "수면부터 심연까지 50종을 낚아보세요", kicker: "캐스팅과 릴링" },
    en: { title: "Aqua Fishing", sub: "50 species from surface to abyss", kicker: "Cast & reel" },
    type: "game", category: "mini-games",
    palette: P.deepSea, font: "sans", thumb: "/thumbnails-generated/aqua-fishing.png",
    skin: "sticker",
  },
  {
    id: "kbti", href: "/games/kbti", cat: "self", no: "10",
    ko: { title: "KBTI", sub: "한국식 성격 유형", kicker: "MBTI의 한국식 버전" },
    en: { title: "KBTI", sub: "A Korean personality test", kicker: "MBTI, but Korean" },
    type: "test", category: "tests",
    palette: P.tape, font: "sans", thumb: "/thumbnails-generated/kbti.png",
    skin: "block", tone: 2, art: "kbti", labels: ["popular", "share"],
  },
  {
    id: "mbti-depth", href: "/games/mbti-depth", cat: "self", no: "11",
    ko: { title: "MBTI 심층 분석", sub: "당신의 MBTI를 더 구체적으로", kicker: "256가지 결과" },
    en: { title: "Deep MBTI Analysis", sub: "Your MBTI, but make it specific", kicker: "4 axes x 4 levels = 256 results" },
    type: "test", category: "tests",
    palette: P.ink, font: "serif", thumb: "/thumbnails-generated/mbti-depth.png",
    skin: "paper",
  },
  {
    id: "attachment", href: "/games/attachment", cat: "self", no: "12",
    ko: { title: "애착 유형 테스트", sub: "나는 왜 이렇게 사랑할까", kicker: "16문항 진단" },
    en: { title: "Attachment Style", sub: "Why do I love this way?", kicker: "16-item test" },
    type: "test", category: "tests",
    palette: P.thread, font: "serif", thumb: "/thumbnails-generated/attachment.png",
    skin: "hand", tone: 3,
  },
  {
    id: "dilemma", href: "/games/dilemma", cat: "self", no: "13",
    ko: { title: "도덕적 딜레마", sub: "당신이라면 어떻게 할까요", kicker: "윤리 질문" },
    en: { title: "Moral Dilemma", sub: "What would you do?", kicker: "Ethical questions" },
    type: "test", category: "tests",
    palette: P.ink, font: "serif", thumb: "/thumbnails-generated/dilemma.png",
    skin: "sticker",
  },
  {
    id: "average", href: "/games/average", cat: "self", no: "14",
    ko: { title: "평균이 되어라", sub: "튀지 말고, 뒤처지지도 말고", kicker: "한국식 평균감" },
    en: { title: "Be Average", sub: "Don't stand out, don't fall behind", kicker: "The Korean mean" },
    palette: P.paper, font: "sans", thumb: "/thumbnails-generated/average.png",
    skin: "paper", labels: ["quick"],
  },
  {
    id: "nunchi", href: "/games/nunchi", cat: "self", no: "15",
    ko: { title: "눈치 측정기", sub: "공기를 읽는 감각", kicker: "사회적 레이더" },
    en: { title: "Nunchi-meter", sub: "The Korean art of reading the room", kicker: "Social radar" },
    type: "test", category: "tests",
    palette: P.paper, font: "sans", thumb: "/thumbnails-generated/nunchi.png",
    skin: "hand", tone: 1, labels: ["share"],
  },
  {
    id: "ahmolla", href: "/games/ahmolla", cat: "self", no: "16",
    ko: { title: "아 몰라", sub: "고민이 깊어지면 결국 그냥", kicker: "결정 피로" },
    en: { title: "Ah, Whatever", sub: "When thinking fails, choose chaos", kicker: "Decision fatigue" },
    type: "game", category: "mini-games",
    palette: P.thread, font: "sans", thumb: "/thumbnails-generated/ahmolla.png",
    skin: "block", tone: 3, labels: ["quick", "share"],
  },
  {
    id: "saju", href: "/games/saju", cat: "self", no: "17",
    ko: { title: "사주 리딩", sub: "당신의 여덟 글자", kicker: "명리학 입문" },
    en: { title: "Saju Reading", sub: "Your eight characters", kicker: "Eastern astrology" },
    type: "fortune", category: "featured",
    palette: P.saju, font: "serif", thumb: "/thumbnails-generated/saju.png",
    skin: "sticker", labels: ["popular", "share"],
  },
  {
    id: "kdrama-couple", href: "/games/kdrama-couple", cat: "self", no: "18",
    ko: { title: "K드라마 커플", sub: "나의 운명적 케미는", kicker: "서사 매칭 테스트" },
    en: { title: "Your K-Drama Couple", sub: "What's your fated trope?", kicker: "Narrative matchmaker" },
    type: "compatibility", category: "compatibility",
    palette: P.rosegold, font: "serif", thumb: "/thumbnails-generated/kdrama-couple.png",
    skin: "hand", tone: 3, labels: ["share"],
  },
  {
    id: "crush-type", href: "/tests/crush-type", cat: "self", no: "18B",
    ko: { title: "짝사랑 유형 테스트", sub: "좋아하는 사람 앞에서 나는 어떤 사람이 될까?", kicker: "관계 테스트" },
    en: { title: "Crush Type Test", sub: "What kind of person do you become around your crush?", kicker: "Relationship test" },
    type: "compatibility", category: "compatibility",
    palette: P.rosegold, font: "serif", thumb: "/thumbnails-generated/crush-type.png",
    skin: "paper", tone: 3, labels: ["new", "share"], duration: { ko: "약 3분", en: "3 min" },
  },
  {
    id: "value-conflict", href: "/tests/value-conflict", cat: "self", no: "18C",
    ko: { title: "가치관 갈등 테스트", sub: "당신 안에서 가장 자주 충돌하는 두 가지 가치는?", kicker: "심리 테스트" },
    en: { title: "Value Conflict Test", sub: "What two values are fighting inside you?", kicker: "Psychology Test" },
    type: "test", category: "tests",
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/value-conflict-painted.png",
    skin: "paper", tone: 3, labels: ["new", "recommended", "share"], duration: { ko: "약 4분", en: "4 min" },
  },
  {
    id: "thinking-pattern", href: "/tests/thinking-pattern", cat: "self", no: "18D",
    ko: { title: "인지왜곡 테스트", sub: "내 생각은 어디서 자주 꼬일까?", kicker: "심리 테스트" },
    en: { title: "Thinking Pattern Test", sub: "Where does your thinking get twisted?", kicker: "Psychology Test" },
    type: "test", category: "tests",
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/thinking-pattern-painted.png",
    skin: "paper", tone: 3, labels: ["new", "share"], duration: { ko: "약 4분", en: "4 min" },
  },
  {
    id: "stoic-control", href: "/tests/stoic-control", cat: "self", no: "18E",
    ko: { title: "스토아 철학 테스트", sub: "불안할 때, 나는 무엇을 붙잡으려 할까요?", kicker: "철학 테스트" },
    en: { title: "Stoic Control Test", sub: "What are you trying too hard to control?", kicker: "Philosophy Test" },
    type: "test", category: "tests",
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/stoic-control-painted.png",
    skin: "paper", tone: 3, labels: ["new", "share"], duration: { ko: "약 4분", en: "4 min" },
  },
  {
    id: "joseon-couple", href: "/games/joseon-couple", cat: "self", no: "19",
    ko: { title: "조선시대 커플", sub: "그 시절 나의 인연", kicker: "전통 인연 매칭" },
    en: { title: "Joseon Couple", sub: "Your destined match, 500 years ago", kicker: "Joseon matchmaker" },
    type: "compatibility", category: "compatibility",
    palette: P.thread, font: "serif", thumb: "/thumbnails-generated/joseon-couple.png",
    skin: "paper",
  },
  {
    id: "friend-match", href: "/games/friend-match", cat: "self", no: "20",
    ko: { title: "우리 사이, 하늘이 정했다", sub: "두 사람의 생년월일로 보는 궁합", kicker: "사주 기반 친구 궁합" },
    en: { title: "Written in the Stars", sub: "Saju compatibility for two birth years", kicker: "Friend-match reading" },
    type: "compatibility", category: "compatibility",
    palette: P.saju, font: "serif", thumb: "/thumbnails-generated/friend-match.png",
    skin: "sticker",
  },
  {
    id: "defense-mechanism", href: "/tests/defense-mechanism", cat: "self", no: "21",
    ko: { title: "방어기제 테스트", sub: "힘들 때 내 마음은 어떤 방식으로 나를 보호할까?", kicker: "심리 테스트" },
    en: { title: "Defense Mechanism Test", sub: "How does your mind protect you when things feel heavy?", kicker: "Psychology Test" },
    type: "test", category: "tests",
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/defense-mechanism-painted.png",
    skin: "paper", tone: 2, labels: ["new", "recommended", "share"], duration: { ko: "약 4분", en: "4 min" },
  },
  {
    id: "meme-age", href: "/tests/meme-age", cat: "self", no: "22",
    ko: { title: "밈 나이 테스트", sub: "인터넷 감성으로 알아보는 당신의 세대", kicker: "밈 추리 퀴즈" },
    en: { title: "Meme Age Test", sub: "Guess your internet generation", kicker: "Meme guessing quiz" },
    type: "test", category: "tests",
    palette: P.ink, font: "sans", thumb: "/thumbnails-generated/meme-age.png",
    skin: "pixel", tone: 4, labels: ["new", "quick", "share"], duration: { ko: "약 2분", en: "2 min" },
  },
  {
    id: "kr-jp-signal", href: "/tests/kr-jp-signal", cat: "self", no: "23",
    ko: { title: "이거 호감임? 문화차이임?", sub: "한일 말투와 답장 신호 판독 테스트", kicker: "한일 문화 신호 테스트" },
    en: { title: "Signal or Culture Difference?", sub: "Read Korea-Japan replies and social distance", kicker: "KR-JP signal test" },
    type: "test", category: "tests",
    palette: P.rosegold, font: "sans", thumb: "/thumbnails-generated/kr-jp-signal.png",
    skin: "sticker", tone: 3, labels: ["new", "quick", "share"], duration: { ko: "약 3분", en: "3 min" },
  },
  {
    id: "battle-what-if", href: "/games/battle-what-if", cat: "self", no: "24",
    ko: { title: "전쟁의 갈림길", sub: "전장의 결정을 직접 내려보세요", kicker: "지휘 성향 진단" },
    en: { title: "Crossroads of War", sub: "What would Hannibal have done?", kicker: "Command-style assessment" },
    type: "game", category: "mini-games",
    palette: P.war, font: "serif", thumb: "/thumbnails-generated/battle-what-if.png",
    skin: "block", tone: 4, labels: ["new"],
  },
  {
    id: "ijy", href: "/games/ijy", cat: "sim", no: "24",
    ko: { title: "재벌 회장님 체험", sub: "하루에 총수를 살아보기", kicker: "재벌 시뮬레이션" },
    en: { title: "Spend Lee Jae-yong's Money", sub: "A day as a chaebol heir", kicker: "Chaebol simulator" },
    type: "game", category: "mini-games",
    palette: P.ijyDark, font: "serif", thumb: "/thumbnails-generated/ijy.png",
    skin: "block", tone: 1, art: "ijy", labels: ["recommended", "share"],
  },
  {
    id: "salary-melt", href: "/games/salary-melt", cat: "sim", no: "25",
    ko: { title: "월급 실시간 소멸", sub: "카드값 앞에서 녹아내리는 월급", kicker: "직장인의 25일" },
    en: { title: "Salary, Melting", sub: "Watch your paycheck vanish", kicker: "25 days of a Korean" },
    palette: P.receipt, font: "mono", thumb: "/thumbnails-generated/salary.png",
    skin: "mono",
  },
  {
    id: "joseon", href: "/games/joseon", cat: "self", no: "26",
    ko: { title: "조선시대 나의 일대기", sub: "이름 하나로 써보는 나의 조선시대 인생 기록", kicker: "가상 조선 생애 기록" },
    en: { title: "My Life in Joseon", sub: "A fictional Joseon-era life record from your name.", kicker: "Name-based biography" },
    type: "test", category: "tests",
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/joseon.png",
    skin: "paper",
  },
  {
    id: "asteroid", href: "/games/asteroid", cat: "sim", no: "27",
    ko: { title: "소행성 발사대", sub: "지구에 소행성을 떨어뜨리면?", kicker: "우주 재난 시뮬레이션" },
    en: { title: "Asteroid Launcher", sub: "Ruin the Earth", kicker: "What if it hit your hometown?" },
    palette: P.cosmos, font: "sans", thumb: "/thumbnails-generated/asteroid.png",
    skin: "pixel",
  },
  {
    id: "gambling", href: "/games/gambling", cat: "sim", no: "28",
    ko: { title: "도박 심리학", sub: "이번엔 딸 것 같은 그 느낌의 정체", kicker: "확률과 심리 실험" },
    en: { title: "Psychology of Gambling", sub: "The feeling of 'I'll win this time'", kicker: "Why we bet" },
    type: "game", category: "mini-games",
    palette: P.ink, font: "serif", thumb: "/thumbnails-generated/gambling.png",
    skin: "block", tone: 3,
  },
  {
    id: "deep", href: "/games/deep", cat: "world", no: "29",
    ko: { title: "마리아나 해구", sub: "심해 11,000m까지 내려가보기", kicker: "심해 스크롤" },
    en: { title: "Mariana Trench", sub: "A scroll descent to 11,000m", kicker: "A deep-sea scroll" },
    palette: P.deepSea, font: "sans", thumb: "/thumbnails-generated/deep.png",
    skin: "pixel",
  },
  {
    id: "timeline", href: "/games/timeline", cat: "world", no: "30",
    ko: { title: "세계사 타임라인", sub: "수메르부터 오늘까지", kicker: "한 줄로 보는 인류" },
    en: { title: "World History Timeline", sub: "Sumer to today", kicker: "Humanity, on one line" },
    palette: P.emberDark, font: "serif", thumb: "/thumbnails-generated/timeline.png",
    skin: "sticker",
  },
  {
    id: "history-if", href: "/games/history-if", cat: "world", no: "31",
    ko: { title: "역사에 IF가 있다면", sub: "한 사건이 바꾼 다른 현재", kicker: "대체역사 실험실" },
    en: { title: "If History Had an If", sub: "One changed event, another world", kicker: "Alternate-history lab" },
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/timeline.png",
    skin: "paper", labels: ["new", "share"],
  },
  {
    id: "probability", href: "/games/probability", cat: "world", no: "32",
    ko: { title: "확률 체험기", sub: "1%는 얼마나 자주 일어날까", kicker: "직감과 수학" },
    en: { title: "Probability Lab", sub: "How often is 1%, really?", kicker: "Gut vs. math" },
    palette: P.paperBlue, font: "mono", thumb: "/thumbnails-generated/probability.png",
    skin: "pixel",
  },
  {
    id: "auction", href: "/games/auction", cat: "world", no: "33",
    ko: { title: "경매 감정사", sub: "역사 속 물건의 가격을 맞혀보세요", kicker: "공룡 뼈부터 편지까지" },
    en: { title: "The Appraiser", sub: "Guess what history sold for", kicker: "From T-rex bones to Einstein's letters" },
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/auction.png",
    skin: "paper", art: "auction", labels: ["recommended"],
  },
  {
    id: "rewind", href: "/games/rewind", cat: "world", no: "34",
    ko: { title: "한국말 되감기", sub: "문장을 시간 속으로 되감아보세요", kicker: "1447년까지" },
    en: { title: "Korean Rewind", sub: "Rewind a sentence through Korean history", kicker: "All the way to 1447" },
    palette: P.paperGold, font: "serif", thumb: "/thumbnails-generated/rewind.png",
    skin: "hand", tone: 2, art: "rewind",
  },
  {
    id: "korean-name", href: "/games/korean-name", cat: "world", no: "35",
    ko: { title: "한국 이름 생성기", sub: "당신만의 한글 이름", kicker: "이름의 의미" },
    en: { title: "Korean Name Generator", sub: "Your own name in Hangul", kicker: "What names mean" },
    type: "test", category: "tests",
    palette: P.paperGold, font: "sans", thumb: "/thumbnails-generated/korean-name.png",
    skin: "hand", tone: 1,
  },
];

export type HomeRailId = "today" | "quick" | "share";

export interface HomeRail {
  id: HomeRailId;
  titleKo: string;
  titleEn: string;
  subKo: string;
  subEn: string;
  gameIds: string[];
}

export const HOME_RAILS: HomeRail[] = [
  {
    id: "today",
    titleKo: "오늘의 추천",
    titleEn: "Today's Picks",
    subKo: "처음 왔다면 여기서 시작하세요. 결과를 보고 바로 공유하고 싶은 테스트들입니다.",
    subEn: "Start here if you are new. These results are built to send to someone.",
    gameIds: ["saju", "value-conflict", "joseon-couple", "defense-mechanism"],
  },
  {
    id: "quick",
    titleKo: "가볍게 해보는 심리 테스트",
    titleEn: "Quick Psychology Tests",
    subKo: "부담 없이 시작하지만 결과는 묘하게 오래 남는 테스트.",
    subEn: "Low friction, strangely memorable results.",
    gameIds: ["stoic-control", "thinking-pattern", "value-conflict", "defense-mechanism", "attachment", "mbti-depth", "dilemma", "kbti"],
  },
  {
    id: "share",
    titleKo: "친구와 연인에게 보내기 좋은 테스트",
    titleEn: "Send to Friends or Couples",
    subKo: "혼자 봐도 좋고, 둘이 보면 더 재밌는 결과형 테스트.",
    subEn: "Good alone, better when two people compare results.",
    gameIds: ["crush-type", "joseon-couple", "kdrama-couple", "friend-match", "saju"],
  },
];

export const HOMEPAGE_HIDDEN_GAME_IDS = new Set([
  "battle-what-if",
  "ppalli",
  "scale",
  "deep",
  "timeline",
  "history-if",
  "probability",
  "auction",
  "rewind",
  "asteroid",
  "gambling",
  "meme-age",
  "kr-jp-signal",
  "nunchi",
]);

export const HOME_CATEGORY_GAME_IDS: Partial<Record<HomeCatId, string[]>> = {
  featured: [
    "saju",
    "defense-mechanism",
    "joseon-couple",
  ],
  tests: [
    "stoic-control",
    "thinking-pattern",
    "value-conflict",
    "defense-mechanism",
    "attachment",
    "mbti-depth",
    "dilemma",
    "kbti",
    "joseon",
    "korean-name",
  ],
  compatibility: [
    "crush-type",
    "friend-match",
    "joseon-couple",
    "kdrama-couple",
  ],
  "mini-games": [
    "aqua-fishing",
    "traffic",
    "ahmolla",
    "silence",
    "password",
    "circle",
    "react",
    "timesense",
    "highnote",
    "ijy",
  ],
};

export const PUBLIC_HOME_GAME_COUNT = Array.from(
  new Set(Object.values(HOME_CATEGORY_GAME_IDS).flat()),
).length;

export function gamesByIds(ids: string[]): Game[] {
  return ids
    .map((id) => GAMES.find((game) => game.id === id))
    .filter((game): game is Game => Boolean(game));
}
