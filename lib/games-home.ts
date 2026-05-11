// Real game catalog for the home page.
// Only games that actually exist under /app/games/ are included here.

export type Lang = "ko" | "en";
// Category criteria:
//   play  — 손맛/반응/타이밍/퍼즐. 입력 정확도가 결과를 좌우 (skill & reflex)
//   self  — 결과가 "당신은 X" 형태인 자기 진단 (personal verdict)
//   sim   — 가상 시나리오를 살아보는 체험형 (roleplay / simulation)
//   world — 세상의 데이터/역사/규모를 시각화 (knowledge & discovery)
export type CatId = "play" | "self" | "sim" | "world";
export type FontKind = "serif" | "sans" | "mono";

// Tile-level personality. `paper` is the default fallback for any game
// whose `skin` is undefined, so migration can be incremental.
export type Skin =
  | "paper"
  | "block"
  | "hand"
  | "pixel"
  | "mono"
  | "sticker";

export type Tone = 1 | 2 | 3 | 4 | 5;

export interface Category {
  id: CatId;
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
    subKo: "손맛으로 도전하세요 — 반응, 타이밍, 정확도.",
    subEn: "Reflex, timing, precision. Your hand decides.",
  },
  {
    id: "self",
    labelKo: "진단",
    labelEn: "Know Yourself",
    subKo: '결과가 "당신은 X" 형태인 자기 진단들.',
    subEn: 'Tests that end with "You are…"',
  },
  {
    id: "sim",
    labelKo: "시뮬",
    labelEn: "Live It",
    subKo: "가상의 시나리오를 직접 살아보는 체험.",
    subEn: "Step into a scenario and live it out.",
  },
  {
    id: "world",
    labelKo: "탐험",
    labelEn: "Explore",
    subKo: "세상의 규모와 역사, 데이터로 보기.",
    subEn: "The shape of the world — at scale.",
  },
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
  thumb?: string;
  // New tile-level fields (optional during migration; default `paper`).
  skin?: Skin;
  tone?: Tone;
  art?: string;
}

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
    tagline_top: "한국 인터넷 놀이터",
    title_sub:
      "손맛으로 도전하고, 자신을 진단하고, 시나리오를 체험하고, 세상을 탐험해보세요.",
    section: {
      play: "도전",
      self: "진단",
      sim: "시뮬",
      world: "탐험",
    },
    section_en: {
      play: "01 CHALLENGE",
      self: "02 KNOW YOURSELF",
      sim: "03 LIVE IT",
      world: "04 EXPLORE",
    },
    play: "놀이 시작",
    today: "오늘",
    todays_pick_label: "오늘의 추천 — TODAY'S PICKS",
    footer_made: "서울에서 만든 — 놀자.fun © 2025",
    hero_count: "PLAYS · 4 CATEGORIES",
    count_unit: "편",
  },
  en: {
    nav: { games: "Games", about: "About" },
    tagline_top: "A Korean internet playground",
    title_sub:
      "Test your reflexes, know yourself, live a scenario, and explore the world.",
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
    footer_made: "Made in Seoul — nolza.fun © 2025",
    hero_count: "PLAYS · 4 CATEGORIES",
    count_unit: "plays",
  },
};

// Palettes — borrowed from the original design language.
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
  // §01 도전 — 손맛/반응/타이밍/퍼즐. 입력 정확도가 결과를 좌우.
  {
    id: "react", href: "/games/react", cat: "play", no: "01",
    ko: { title: "반응속도", sub: "초록불이 켜지면 — 지금!", kicker: "Reaction time" },
    en: { title: "Reaction Speed", sub: "Tap the second it turns green", kicker: "Reaction time" },
    palette: P.forest, font: "mono", thumb: "/thumbnails/react.png",
    skin: "pixel", art: "react",
  },
  {
    id: "timesense", href: "/games/timesense", cat: "play", no: "02",
    ko: { title: "시간 감각", sub: "10초 — 눈을 감고 맞춰보세요", kicker: "시간의 무게" },
    en: { title: "Time Sense", sub: "Close your eyes. Stop at 10s.", kicker: "Internal clock" },
    palette: P.paperBlue, font: "serif", thumb: "/thumbnails/timesense.png",
    skin: "mono",
  },
  {
    id: "circle", href: "/games/circle", cat: "play", no: "03",
    ko: { title: "완벽한 원 그리기", sub: "한 번에 그릴수록 인생도 둥글어진다", kicker: "손맛 정확도" },
    en: { title: "Draw a Perfect Circle", sub: "One stroke, one chance", kicker: "Precision by hand" },
    palette: P.paperBlue, font: "serif", thumb: "/thumbnails/circle.png",
    skin: "hand", tone: 2,
  },
  {
    id: "silence", href: "/games/silence", cat: "play", no: "04",
    ko: { title: "SILENCE", sub: "아무것도 하지 마세요", kicker: "5분 침묵 챌린지" },
    en: { title: "SILENCE.", sub: "Do absolutely nothing", kicker: "5-minute silence challenge" },
    palette: P.void, font: "sans", thumb: "/thumbnails/silence.png",
    skin: "mono",
  },
  {
    id: "ppalli", href: "/games/ppalli", cat: "play", no: "05",
    ko: { title: "빨리빨리", sub: "할아버지가 재촉합니다", kicker: "한국식 속도전" },
    en: { title: "Ppalli-ppalli", sub: "Grandpa is impatient", kicker: "Korean velocity" },
    palette: P.tape, font: "sans", thumb: "/thumbnails/ppalli.png",
    skin: "block", tone: 3,
  },
  {
    id: "password", href: "/games/password", cat: "play", no: "06",
    ko: { title: "한국판 비밀번호 게임", sub: "규칙은 점점 이상해진다", kicker: "조건의 미로" },
    en: { title: "Korean Password Game", sub: "Rules get weirder by the rule", kicker: "A maze of conditions" },
    palette: P.tape, font: "mono", thumb: "/thumbnails/password.png",
    skin: "pixel",
  },
  {
    id: "traffic", href: "/games/traffic", cat: "play", no: "07",
    ko: { title: "교통 지옥", sub: "빨간 차를 꺼내줘", kicker: "슬라이딩 블록 퍼즐 15레벨" },
    en: { title: "Traffic Hell", sub: "Get the red car out", kicker: "15 sliding-block puzzles" },
    palette: P.ijyDark, font: "mono", thumb: "/thumbnails/traffic.png",
    skin: "block", tone: 1,
  },
  {
    id: "highnote", href: "/games/highnote", cat: "play", no: "08",
    ko: { title: "고음 챌린지", sub: "당신은 어디까지 올라가나요", kicker: "마이크 ON" },
    en: { title: "High Note Challenge", sub: "How high can you really go?", kicker: "Mic on" },
    palette: P.emberDark, font: "sans", thumb: "/thumbnails/highnote.jpg",
    skin: "block", tone: 5,
  },
  {
    id: "aqua-fishing", href: "/games/aqua-fishing", cat: "play", no: "09",
    ko: { title: "심해 낚시", sub: "수면부터 심연까지 50종", kicker: "캐스팅 & 릴링" },
    en: { title: "Aqua Fishing", sub: "50 species from surface to abyss", kicker: "Cast & reel" },
    palette: P.deepSea, font: "sans", thumb: "/thumbnails/aqua-fishing.png",
    skin: "sticker",
  },

  // §02 진단 — 결과가 "당신은 X" 형태인 자기 진단.
  {
    id: "kbti", href: "/games/kbti", cat: "self", no: "10",
    ko: { title: "KBTI", sub: "한국식 성격 유형", kicker: "MBTI의 한국어 버전" },
    en: { title: "KBTI", sub: "A Korean personality test", kicker: "MBTI, but Korean" },
    palette: P.tape, font: "sans", thumb: "/thumbnails/kbti.jpg",
    skin: "block", tone: 2, art: "kbti",
  },
  {
    id: "mbti-depth", href: "/games/mbti-depth", cat: "self", no: "11",
    ko: { title: "MBTI 심층 분석", sub: "당신의 MBTI, 더 깊이", kicker: "4지표 × 4단계 = 256가지" },
    en: { title: "Deep MBTI Analysis", sub: "Your MBTI, but make it specific", kicker: "4 axes × 4 levels = 256 results" },
    palette: P.ink, font: "serif", thumb: "/thumbnails/mbti-depth.jpg",
    skin: "paper",
  },
  {
    id: "attachment", href: "/games/attachment", cat: "self", no: "12",
    ko: { title: "애착 유형 테스트", sub: "나는 왜 이렇게 사랑할까", kicker: "16문항 진단" },
    en: { title: "Attachment Style", sub: "Why do I love this way?", kicker: "16-item test" },
    palette: P.thread, font: "serif", thumb: "/thumbnails/attachment.jpg",
    skin: "hand", tone: 3,
  },
  {
    id: "dilemma", href: "/games/dilemma", cat: "self", no: "13",
    ko: { title: "도덕적 딜레마", sub: "당신이라면 어떻게", kicker: "윤리적 질문" },
    en: { title: "Moral Dilemma", sub: "What would you do?", kicker: "Ethical questions" },
    palette: P.ink, font: "serif", thumb: "/thumbnails/dilemma.png",
    skin: "sticker",
  },
  {
    id: "average", href: "/games/average", cat: "self", no: "14",
    ko: { title: "평균이 되어라", sub: "튀지 말고, 너무 처지지도 말고", kicker: "한국식 평균값" },
    en: { title: "Be Average", sub: "Don't stand out, don't fall behind", kicker: "The Korean mean" },
    palette: P.paper, font: "sans", thumb: "/thumbnails/average.png",
    skin: "paper",
  },
  {
    id: "nunchi", href: "/games/nunchi", cat: "self", no: "15",
    ko: { title: "눈치 측정기", sub: "공기를 읽는 한국인의 감각", kicker: "사회적 센서" },
    en: { title: "Nunchi-meter", sub: "The Korean art of reading the room", kicker: "Social radar" },
    palette: P.paper, font: "sans", thumb: "/thumbnails/nunchi.png",
    skin: "hand", tone: 1,
  },
  {
    id: "ahmolla", href: "/games/ahmolla", cat: "self", no: "16",
    ko: { title: "아 몰라", sub: "고민이 깊어지면, 결국 그냥…", kicker: "결정 회피" },
    en: { title: "Ah, Whatever", sub: "When thinking fails, choose chaos", kicker: "Decision fatigue" },
    palette: P.thread, font: "sans", thumb: "/thumbnails/ahmolla.png",
    skin: "block", tone: 3,
  },
  {
    id: "saju", href: "/games/saju", cat: "self", no: "17",
    ko: { title: "사주 풀이", sub: "당신의 여덟 글자", kicker: "명리학 입문" },
    en: { title: "Saju Reading", sub: "Your eight characters", kicker: "Eastern astrology" },
    palette: P.saju, font: "serif", thumb: "/thumbnails/saju.jpg",
    skin: "sticker",
  },
  {
    id: "kdrama-couple", href: "/games/kdrama-couple", cat: "self", no: "18",
    ko: { title: "K드라마 커플", sub: "나의 운명적 케미는", kicker: "서사 매칭 테스트" },
    en: { title: "Your K-Drama Couple", sub: "What's your fated trope?", kicker: "Narrative matchmaker" },
    palette: P.rosegold, font: "serif", thumb: "/thumbnails/kdrama-couple.png",
    skin: "hand", tone: 3,
  },
  {
    id: "joseon-couple", href: "/games/joseon-couple", cat: "self", no: "19",
    ko: { title: "조선시대 커플", sub: "그 시절, 나의 인연", kicker: "전통 인연 매칭" },
    en: { title: "Joseon Couple", sub: "Your destined match, 500 years ago", kicker: "Joseon matchmaker" },
    palette: P.thread, font: "serif", thumb: "/thumbnails/joseon-couple.jpg",
    skin: "paper",
  },
  {
    id: "friend-match", href: "/games/friend-match", cat: "self", no: "20",
    ko: { title: "우리 사이, 하늘이 정해놨다", sub: "두 사람의 생년월일로 보는 궁합", kicker: "사주 기반 친구 궁합" },
    en: { title: "Written in the Stars", sub: "Saju compatibility for two birth years", kicker: "Friend-match reading" },
    palette: P.saju, font: "serif", thumb: "/thumbnails/friend-match.png",
    skin: "sticker",
  },
  {
    id: "battle-what-if", href: "/games/battle-what-if", cat: "self", no: "22",
    ko: { title: "전쟁의 갈림길", sub: "한니발이라면 어떻게 했을까", kicker: "지휘 성향 진단" },
    en: { title: "Crossroads of War", sub: "What would Hannibal have done?", kicker: "Command-style assessment" },
    palette: P.war, font: "serif", thumb: "/thumbnails/battle-what-if.jpg",
    skin: "block", tone: 4,
  },

  // §03 시뮬 — 가상 시나리오를 살아보는 체험형.
  {
    id: "ijy", href: "/games/ijy", cat: "sim", no: "23",
    ko: { title: "이재용 돈 다 써봐", sub: "재벌 총수의 하루", kicker: "재벌 시뮬레이터" },
    en: { title: "Spend Lee Jae-yong's Money", sub: "A day as a chaebol heir", kicker: "Chaebol simulator" },
    palette: P.ijyDark, font: "serif", thumb: "/thumbnails/ijy.png",
    skin: "block", tone: 1, art: "ijy",
  },
  {
    id: "salary-melt", href: "/games/salary-melt", cat: "sim", no: "24",
    ko: { title: "월급 실시간 소멸", sub: "카드값 → 월세 → 0원", kicker: "한국인의 25일" },
    en: { title: "Salary, Melting", sub: "Watch your paycheck vanish", kicker: "25 days of a Korean" },
    palette: P.receipt, font: "mono", thumb: "/thumbnails/salary.png",
    skin: "mono",
  },
  {
    id: "joseon", href: "/games/joseon", cat: "sim", no: "25",
    ko: { title: "조선시대 나라면", sub: "양반? 상민? 노비?", kicker: "신분제 시뮬" },
    en: { title: "If I Lived in Joseon", sub: "Yangban, commoner, or slave?", kicker: "Class-system sim" },
    palette: P.paperGold, font: "serif", thumb: "/thumbnails/joseon.jpg",
    skin: "paper",
  },
  {
    id: "asteroid", href: "/games/asteroid", cat: "sim", no: "26",
    ko: { title: "소행성 발사대", sub: "지구를 망쳐보자", kicker: "내 동네에 떨어뜨리면" },
    en: { title: "Asteroid Launcher", sub: "Ruin the Earth", kicker: "What if it hit your hometown?" },
    palette: P.cosmos, font: "sans", thumb: "/thumbnails/asteroid.jpg",
    skin: "pixel",
  },
  {
    id: "gambling", href: "/games/gambling", cat: "sim", no: "27",
    ko: { title: "도박 심리학", sub: "이길 것 같은 그 느낌의 정체", kicker: "왜 우리는 베팅하는가" },
    en: { title: "Psychology of Gambling", sub: "The feeling of 'I'll win this time'", kicker: "Why we bet" },
    palette: P.ink, font: "serif", thumb: "/thumbnails/gambling.jpg",
    skin: "block", tone: 3,
  },

  // §04 탐험 — 세상의 데이터/역사/규모를 시각화.
  {
    id: "deep", href: "/games/deep", cat: "world", no: "28",
    ko: { title: "마리아나 해구", sub: "11,034m 아래로", kicker: "심해 스크롤" },
    en: { title: "Mariana Trench", sub: "11,034 m straight down", kicker: "A deep-sea scroll" },
    palette: P.deepSea, font: "sans", thumb: "/thumbnails/deep.png",
    skin: "pixel",
  },
  {
    id: "scale", href: "/games/scale", cat: "world", no: "29",
    ko: { title: "크기 비교", sub: "개미부터 우주까지", kicker: "스케일의 우주" },
    en: { title: "Scale of Things", sub: "From an ant to the universe", kicker: "A cosmic ruler" },
    palette: P.cosmos, font: "mono", thumb: "/thumbnails/scale.png",
    skin: "mono", art: "scale",
  },
  {
    id: "timeline", href: "/games/timeline", cat: "world", no: "30",
    ko: { title: "세계사 타임라인", sub: "수메르부터 오늘까지", kicker: "한 줄로 본 인류사" },
    en: { title: "World History Timeline", sub: "Sumer to today", kicker: "Humanity, on one line" },
    palette: P.emberDark, font: "serif", thumb: "/thumbnails/timeline.jpg",
    skin: "sticker",
  },
  {
    id: "probability", href: "/games/probability", cat: "world", no: "31",
    ko: { title: "확률 체험기", sub: "1%가 얼마나 자주 일어나는지", kicker: "직감과 진실" },
    en: { title: "Probability Lab", sub: "How often is 1%, really?", kicker: "Gut vs. math" },
    palette: P.paperBlue, font: "mono", thumb: "/thumbnails/probability.jpg",
    skin: "pixel",
  },
  {
    id: "auction", href: "/games/auction", cat: "world", no: "32",
    ko: { title: "유물 감정사", sub: "역사의 가격을 맞혀라", kicker: "공룡 화석부터 아인슈타인 편지까지" },
    en: { title: "The Appraiser", sub: "Guess what history sold for", kicker: "From T-rex bones to Einstein's letters" },
    palette: P.paperGold, font: "serif", thumb: "/thumbnails/auction.jpg",
    skin: "paper", art: "auction",
  },
  {
    id: "rewind", href: "/games/rewind", cat: "world", no: "33",
    ko: { title: "한국말 되감기", sub: "문장을 시간 속으로 되감아 보세요", kicker: "1447년까지" },
    en: { title: "Korean Rewind", sub: "Rewind a sentence through Korean history", kicker: "All the way to 1447" },
    palette: P.paperGold, font: "serif", thumb: "/thumbnails/rewind.jpg",
    skin: "hand", tone: 2, art: "rewind",
  },
  {
    id: "korean-name", href: "/games/korean-name", cat: "world", no: "34",
    ko: { title: "한국 이름 생성기", sub: "당신만의 한글 이름", kicker: "이름의 의미" },
    en: { title: "Korean Name Generator", sub: "Your own name in Hangul", kicker: "What names mean" },
    palette: P.paperGold, font: "sans", thumb: "/thumbnails/korean-name.jpg",
    skin: "hand", tone: 1,
  },
];
