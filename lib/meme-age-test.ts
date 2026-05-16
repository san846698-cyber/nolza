export type MemeEraId = "early" | "cyworld" | "community2010" | "shortform" | "ai" | "omnivore";

export type MemeAnswer = {
  id: string;
  text: string;
  caption: string;
  era: Exclude<MemeEraId, "omnivore">;
  correct: boolean;
  feedback: string;
};

export type MemeQuestion = {
  id: string;
  kind: "era" | "meaning" | "platform" | "timeline" | "plausible" | "generation";
  category: string;
  question: string;
  clue: string;
  mood: string;
  answers: MemeAnswer[];
};

export type MemeAgeResult = {
  id: MemeEraId;
  name: string;
  memeAge: string;
  emoji: string;
  accent: string;
  description: string;
  traits: string[];
  shareLine: string;
  verdict: string;
  timeline: string[];
  groupChatRole: string;
  modernProof: string[];
};

export const ERA_LABELS: Record<Exclude<MemeEraId, "omnivore">, string> = {
  early: "초기 인터넷",
  cyworld: "2000년대 감성",
  community2010: "2010년대 드립",
  shortform: "숏폼 밈",
  ai: "AI 밈",
};

export const MEME_RESULT_ORDER: Exclude<MemeEraId, "omnivore">[] = [
  "early",
  "cyworld",
  "community2010",
  "shortform",
  "ai",
];

export const MEME_RESULTS: Record<MemeEraId, MemeAgeResult> = {
  early: {
    id: "early",
    name: "초기 인터넷 영혼",
    memeAge: "2003년 인터넷 생존자",
    emoji: "⌨",
    accent: "#3cff9b",
    description:
      "게시판, 댓글 타래, 출처 찾기 감각이 살아 있습니다. 유행을 그냥 소비하기보다 어디서 왔고 왜 웃긴지까지 보는 타입입니다.",
    traits: ["원본 집착", "댓글 맥락 강함", "오래된 말투 감지"],
    shareLine: "내 밈 나이는 초기 인터넷 영혼이었다. 접속음이 들리는 사람?",
    verdict: "밈을 단순한 농담보다 인터넷 역사의 흔적으로 읽습니다.",
    timeline: ["낡은 게시판 감성을 잘 압니다.", "짧은 반응보다 맥락 있는 댓글을 좋아합니다.", "요즘 유행도 보지만 출처가 더 궁금합니다."],
    groupChatRole: "조용하다가 너무 오래된 레퍼런스로 모두를 멈칫하게 만드는 사람.",
    modernProof: ["원본 감별", "댓글 흐름 읽기", "인터넷 고고학"],
  },
  cyworld: {
    id: "cyworld",
    name: "2000년대 감성 토박이",
    memeAge: "2007년 미니홈피 감성러",
    emoji: "♪",
    accent: "#ff8bb8",
    description:
      "말투보다 분위기, 농담보다 감정선을 먼저 봅니다. BGM이 깔릴 것 같은 문장과 살짝 민망한 감성을 알아보는 사람입니다.",
    traits: ["감성 문구 반응", "추억 보정", "프로필 문장 감별"],
    shareLine: "내 밈 나이는 2007년 감성 토박이래. 괜히 배경음악 깔림.",
    verdict: "웃기다가도 갑자기 마음이 촉촉해지는 감성형 인터넷 인간입니다.",
    timeline: ["방명록과 미니홈피의 온도를 압니다.", "허세와 진심 사이의 문장을 구분합니다.", "추억형 콘텐츠에 꽤 약합니다."],
    groupChatRole: "드립 중간에 갑자기 '근데 이거 좀 슬프다'고 말하는 사람.",
    modernProof: ["감성 저장", "문장 분위기 캐치", "추억형 밈 강함"],
  },
  community2010: {
    id: "community2010",
    name: "2010년대 드립 장인",
    memeAge: "2016년 커뮤니티 드립러",
    emoji: "ㅋㅋ",
    accent: "#ffd43b",
    description:
      "짧게 치고 빠지는 말투, 과장된 리액션, 친구끼리 전염되는 드립에 강합니다. 밈을 보면 바로 응용할 생각부터 납니다.",
    traits: ["응용 빠름", "단톡방 화력", "말투 전염"],
    shareLine: "내 밈 나이는 2010년대 드립 장인. 반박은 받지만 안 들음.",
    verdict: "조용한 대화에 바로 드립을 투입하는 실전형 밈러입니다.",
    timeline: ["말투 밈을 빨리 흡수합니다.", "친구들 사이에서 변형 드립을 잘 만듭니다.", "설명보다 타이밍을 믿습니다."],
    groupChatRole: "이상한 말투를 제일 먼저 시작하고 나중엔 모두가 따라 하게 만듭니다.",
    modernProof: ["순발력", "유행어 응용", "단톡방 전파력"],
  },
  shortform: {
    id: "shortform",
    name: "숏폼 밈 적응 완료형",
    memeAge: "2024년 숏폼 네이티브",
    emoji: "▶",
    accent: "#61d9ff",
    description:
      "밈을 긴 글보다 자막, 사운드, 컷 편집으로 이해합니다. 유행의 속도가 빨라도 크게 당황하지 않는 알고리즘 친화형입니다.",
    traits: ["3초 판단", "자막 감각", "트렌드 전환 빠름"],
    shareLine: "내 밈 나이는 숏폼 적응 완료형. 여기 4초부터 봐.",
    verdict: "짧은 장면 하나로 웃긴지 판단하는 속도형 밈 감각입니다.",
    timeline: ["짧은 영상 자막에 강합니다.", "사운드와 반복 구조를 잘 기억합니다.", "긴 설명은 조금 피곤합니다."],
    groupChatRole: "영상 링크를 던지고 정확히 몇 초부터 봐야 하는지 알려주는 사람.",
    modernProof: ["숏폼 문법", "빠른 스크롤", "자막 리듬"],
  },
  ai: {
    id: "ai",
    name: "AI 밈 신인류",
    memeAge: "2026년 미래형 밈 생명체",
    emoji: "AI",
    accent: "#b197fc",
    description:
      "맥락 없는 상황극, 이상한 조합, 설명하기 어려운 웃음을 빨리 받아들입니다. 새 밈 문법이 나와도 일단 즐기고 봅니다.",
    traits: ["이상한 조합 강함", "새 문법 흡수", "맥락 없는 웃음"],
    shareLine: "내 밈 나이는 AI 밈 신인류. 인간 밈을 조금 초월함.",
    verdict: "출처보다 조합의 이상함을 즐기는 미래형 인터넷 인간입니다.",
    timeline: ["설명하기 어려운 밈을 빨리 받아들입니다.", "AI식 상황극에도 거부감이 적습니다.", "새 유행을 일단 저장합니다."],
    groupChatRole: "아무도 이해 못 한 밈을 먼저 웃고 일주일 뒤 모두가 따라오게 만드는 사람.",
    modernProof: ["AI 상황극", "초현실 조합", "새 문법 적응"],
  },
  omnivore: {
    id: "omnivore",
    name: "세대 초월 인터넷 인간",
    memeAge: "전 시대 밈 잡식형",
    emoji: "∞",
    accent: "#45ffb0",
    description:
      "옛 커뮤니티부터 숏폼과 AI 밈까지 넓게 알아봅니다. 특정 세대 하나에 갇히기보다 인터넷 문화의 변화를 통째로 즐기는 타입입니다.",
    traits: ["넓은 밈 스펙트럼", "세대 넘나듦", "맥락과 속도 둘 다 강함"],
    shareLine: "내 밈 나이는 세대 초월형. 인터넷을 너무 오래, 너무 넓게 봄.",
    verdict: "밈을 시대별 언어처럼 읽는 인터넷 잡식형입니다.",
    timeline: ["오래된 감성도 최신 문법도 알아봅니다.", "밈의 시대 차이를 꽤 정확히 구분합니다.", "친구 세대가 달라도 대화가 됩니다."],
    groupChatRole: "어느 세대 드립이 나와도 설명하거나 받아칠 수 있는 통역자.",
    modernProof: ["넓은 인식폭", "시대 구분", "밈 통역"],
  },
};

const answer = (
  id: string,
  text: string,
  caption: string,
  era: Exclude<MemeEraId, "omnivore">,
  correct: boolean,
  feedback: string,
): MemeAnswer => ({ id, text, caption, era, correct, feedback });

export const MEME_QUESTIONS: MemeQuestion[] = [
  {
    id: "era-minihompy",
    kind: "era",
    category: "ERA GUESS",
    question: "이 감성의 전성기는?",
    clue: "프로필 문구를 고치고, 배경음악을 고르고, 방명록 답글을 기다리던 밤.",
    mood: "시대 맞히기",
    answers: [
      answer("a", "초기 게시판 시대", "거칠고 텍스트 중심", "early", false, "조금 더 감성적이고 프로필 중심인 시대예요."),
      answer("b", "2000년대 미니홈피 감성", "BGM과 방명록의 시대", "cyworld", true, "정답! 이건 미니홈피와 감성 문구의 공기가 강합니다."),
      answer("c", "2010년대 단톡방 드립", "말투 전염의 시대", "community2010", false, "2010년대보다는 더 개인 페이지 감성이 강해요."),
      answer("d", "숏폼 댓글 밈", "알고리즘 스크롤 시대", "shortform", false, "숏폼보다 훨씬 느리고 감성적인 인터넷이에요."),
    ],
  },
  {
    id: "meaning-sarcasm",
    kind: "meaning",
    category: "MEANING",
    question: "“진짜 대단하다…”의 인터넷식 느낌으로 가장 가까운 것은?",
    clue: "칭찬처럼 보이지만, 문맥상 이미 모두가 눈치챈 상황.",
    mood: "말맛 판독",
    answers: [
      answer("a", "진심 칭찬", "정직한 리액션", "cyworld", false, "문장만 보면 칭찬이지만 인터넷에서는 표정이 숨어 있어요."),
      answer("b", "비꼼 섞인 감탄", "말끝의 점 세 개가 힌트", "community2010", true, "정답! 말줄임표와 맥락이 만나면 비꼼이 됩니다."),
      answer("c", "정보 요청", "더 알려달라는 뜻", "early", false, "정보 요청보다는 감정 반응에 가까워요."),
      answer("d", "AI가 쓴 문장", "너무 매끄러움", "ai", false, "AI 문장이라기보다는 사람 냄새 나는 비꼼이에요."),
    ],
  },
  {
    id: "platform-forum",
    kind: "platform",
    category: "CONTEXT",
    question: "이런 말투가 가장 잘 어울리는 곳은?",
    clue: "긴 글보다 제목과 댓글 흐름이 더 중요하고, 안쪽 사람만 아는 약속이 많다.",
    mood: "플랫폼 맞히기",
    answers: [
      answer("a", "초창기 커뮤니티 게시판", "제목과 댓글이 세계관", "early", true, "정답! 게시판 문화는 제목, 댓글, 내부 약속으로 굴러갑니다."),
      answer("b", "감성 프로필 페이지", "나를 꾸미는 공간", "cyworld", false, "프로필보다는 토론과 댓글 흐름이 강해요."),
      answer("c", "숏폼 추천 피드", "영상이 중심", "shortform", false, "영상보다 텍스트 게시판에 가까운 힌트예요."),
      answer("d", "AI 챗봇 대화", "즉석 생성 대화", "ai", false, "AI 대화보다 오래된 커뮤니티 내부 문법입니다."),
    ],
  },
  {
    id: "timeline-oldest",
    kind: "timeline",
    category: "OLDEST",
    question: "다음 중 가장 오래된 인터넷 감성은?",
    clue: "이미지를 떠올리지 말고, 말투와 공간의 나이를 맞혀보세요.",
    mood: "타임라인 감각",
    answers: [
      answer("a", "방명록에 오늘 기분 남기기", "감성 홈피", "cyworld", false, "오래됐지만, 게시판 원시 감성보다는 뒤쪽이에요."),
      answer("b", "게시판 제목으로 낚고 댓글에서 완성하기", "텍스트 커뮤니티", "early", true, "정답! 텍스트 게시판 감성이 가장 오래된 축에 가깝습니다."),
      answer("c", "친구끼리 말투 따라 하기", "단톡방 전염", "community2010", false, "이건 모바일 메신저와 함께 강해진 감성이에요."),
      answer("d", "알고리즘이 밀어준 사운드 따라 하기", "숏폼 유행", "shortform", false, "가장 최신 쪽에 가까워요."),
    ],
  },
  {
    id: "plausible-old",
    kind: "plausible",
    category: "REAL OR FAKE",
    question: "가장 옛 인터넷 감성에 있을 법한 표현은?",
    clue: "너무 최신 말투 말고, 조금 투박하고 텍스트 게시판 같은 것을 고르세요.",
    mood: "가짜 말투 감별",
    answers: [
      answer("a", "이거 완전 알고리즘 탔네", "추천 피드 시대", "shortform", false, "알고리즘이라는 말맛은 훨씬 최신입니다."),
      answer("b", "님들 이거 저만 웃김?", "게시판식 호출", "early", true, "정답! '님들'로 게시판 사람들을 부르는 감성이 강해요."),
      answer("c", "이 사운드 저장해둬야 함", "숏폼 사운드", "shortform", false, "사운드 저장은 숏폼 쪽 문법이에요."),
      answer("d", "프롬프트 다시 넣어봐", "AI 생성 문법", "ai", false, "이건 너무 미래형입니다."),
    ],
  },
  {
    id: "generation-caption",
    kind: "generation",
    category: "GENERATION",
    question: "“여기 4초부터 봐”는 어느 세대에 가까울까?",
    clue: "영상 전체보다 특정 순간, 특정 자막, 특정 사운드가 핵심입니다.",
    mood: "세대 판정",
    answers: [
      answer("a", "2000년대 감성 세대", "분위기와 BGM", "cyworld", false, "BGM 감성은 맞지만 4초 지시는 숏폼 문법이에요."),
      answer("b", "2010년대 커뮤니티 세대", "드립 응용", "community2010", false, "드립은 있지만 영상 타임코드 감각이 더 강합니다."),
      answer("c", "숏폼/클립 세대", "초 단위 하이라이트", "shortform", true, "정답! 특정 초부터 보라는 말은 클립 문화에 딱 맞아요."),
      answer("d", "초기 게시판 세대", "텍스트 중심", "early", false, "초기 게시판은 영상 타임코드보다 텍스트 흐름이 중심이에요."),
    ],
  },
  {
    id: "meaning-resignation",
    kind: "meaning",
    category: "MEANING",
    question: "“아 몰라 그냥 해”의 밈 느낌은?",
    clue: "정확한 해결보다, 고민 끝에 포기한 듯 밀고 가는 분위기.",
    mood: "감정 맞히기",
    answers: [
      answer("a", "밈화된 체념", "포기했는데 추진함", "community2010", true, "정답! 체념과 실행이 같이 있는 말맛입니다."),
      answer("b", "정중한 요청", "예의 바른 부탁", "cyworld", false, "너무 정중한 쪽은 아니에요."),
      answer("c", "기술 설명", "방법 안내", "early", false, "정보 설명보다 감정 반응입니다."),
      answer("d", "AI 오류 메시지", "시스템 실패", "ai", false, "오류보다는 인간적인 결정 피로에 가까워요."),
    ],
  },
  {
    id: "platform-shortform",
    kind: "platform",
    category: "CONTEXT",
    question: "“이 자막 뜨는 순간 이미 웃김”은 어디에 가장 어울릴까?",
    clue: "영상의 내용보다 편집 템포와 자막 타이밍이 먼저 보입니다.",
    mood: "공간 맞히기",
    answers: [
      answer("a", "숏폼 댓글 밈", "자막과 컷 편집", "shortform", true, "정답! 자막 타이밍 자체가 웃음 포인트인 세계예요."),
      answer("b", "옛 게시판 공지", "텍스트 규칙", "early", false, "공지보다는 영상 편집 감각입니다."),
      answer("c", "미니홈피 방명록", "감성 답글", "cyworld", false, "방명록보다는 훨씬 빠른 영상 문법이에요."),
      answer("d", "AI 프롬프트 공유방", "생성 조건", "ai", false, "AI보다는 숏폼 편집 감각이 중심입니다."),
    ],
  },
  {
    id: "ai-context",
    kind: "generation",
    category: "AI MEME",
    question: "“왜 웃긴지 모르겠는데 계속 보게 됨”이 가장 어울리는 최신 감성은?",
    clue: "이상한 조합, 불완전한 상황극, 묘하게 꿈같은 장면.",
    mood: "미래 밈 감각",
    answers: [
      answer("a", "AI 생성 밈 감성", "이상한데 중독됨", "ai", true, "정답! 설명하기 어려운 이상함이 AI 밈의 핵심일 때가 많아요."),
      answer("b", "초기 게시판 공지", "규칙 중심", "early", false, "공지 감성보다는 초현실 조합에 가까워요."),
      answer("c", "미니홈피 감성글", "감정 중심", "cyworld", false, "감성글보다는 이상한 상황극입니다."),
      answer("d", "2010년대 말장난", "언어유희 중심", "community2010", false, "말장난보다 이미지 없는 초현실 문법에 가까워요."),
    ],
  },
  {
    id: "timeline-newest",
    kind: "timeline",
    category: "NEWEST",
    question: "다음 중 가장 최신 인터넷 감성은?",
    clue: "낡은 순서가 아니라, 요즘에 가까운 문법을 고르세요.",
    mood: "최신 감각 체크",
    answers: [
      answer("a", "방명록에 감성 문구 남기기", "2000s", "cyworld", false, "이건 꽤 오래된 감성입니다."),
      answer("b", "댓글에서 원본 출처 찾기", "게시판", "early", false, "원본 찾기는 오래된 인터넷 탐구에 가까워요."),
      answer("c", "AI에게 이상한 상황극을 다시 생성시키기", "생성 밈", "ai", true, "정답! 생성형 도구와 밈이 섞인 최신 문법입니다."),
      answer("d", "친구끼리 유행어 변형하기", "단톡방", "community2010", false, "여전히 살아 있지만 최신 축은 AI 생성 쪽이에요."),
    ],
  },
  {
    id: "meaning-old-school",
    kind: "meaning",
    category: "OLD SCHOOL",
    question: "“원본 어디서 봄?”이라는 반응이 가장 강한 사람은?",
    clue: "웃기기 전에 출처, 맥락, 최초 게시물을 먼저 찾고 싶어 합니다.",
    mood: "인터넷 고고학",
    answers: [
      answer("a", "초기 인터넷 영혼", "출처와 맥락을 파는 사람", "early", true, "정답! 원본 추적은 고전 인터넷 감각이 강합니다."),
      answer("b", "숏폼 네이티브", "일단 넘기고 보는 사람", "shortform", false, "숏폼은 출처보다 속도가 먼저일 때가 많아요."),
      answer("c", "AI 밈 신인류", "출처보다 생성이 중요", "ai", false, "AI 밈은 원본 추적이 흐려지는 편이에요."),
      answer("d", "감성 홈피러", "분위기부터 보는 사람", "cyworld", false, "감성 홈피러는 출처보다 분위기에 더 반응합니다."),
    ],
  },
  {
    id: "final-generation",
    kind: "generation",
    category: "FINAL ROUND",
    question: "밈을 가장 잘 즐기는 방식은?",
    clue: "정답은 하나지만, 당신의 선택은 결과에도 살짝 흔적을 남깁니다.",
    mood: "최종 라운드",
    answers: [
      answer("a", "시대별 말투와 플랫폼을 구분하며 보기", "밈 연대기형", "early", true, "정답! 이 테스트의 핵심은 시대 문법을 구분하는 감각이에요."),
      answer("b", "좋아하는 감성만 저장하기", "추억 보관형", "cyworld", false, "좋은 방식이지만 퀴즈 정답은 시대 구분 쪽입니다."),
      answer("c", "친구한테 바로 보내고 반응 보기", "전파형", "community2010", false, "밈답지만, 이번 라운드는 인식 능력 체크예요."),
      answer("d", "이상하면 일단 웃기", "미래 적응형", "ai", false, "좋은 자세지만, 정답은 시대 구분입니다."),
    ],
  },
];

export function calculateMemeResult(answers: MemeAnswer[]) {
  const correctByEra = MEME_RESULT_ORDER.reduce<Record<Exclude<MemeEraId, "omnivore">, number>>((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Record<Exclude<MemeEraId, "omnivore">, number>);

  const seenByEra = MEME_RESULT_ORDER.reduce<Record<Exclude<MemeEraId, "omnivore">, number>>((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Record<Exclude<MemeEraId, "omnivore">, number>);

  MEME_QUESTIONS.forEach((question) => {
    const correct = question.answers.find((item) => item.correct);
    if (correct) seenByEra[correct.era] += 1;
  });

  answers.forEach((selected) => {
    if (selected.correct) correctByEra[selected.era] += 1;
  });

  const correctCount = answers.filter((answer) => answer.correct).length;
  const accuracy = Math.round((correctCount / MEME_QUESTIONS.length) * 100);

  const strongestEra = MEME_RESULT_ORDER.reduce((best, id) => {
    if (correctByEra[id] > correctByEra[best]) return id;
    return best;
  }, "early");

  const weakestEra = MEME_RESULT_ORDER.reduce((worst, id) => {
    const currentRate = seenByEra[id] ? correctByEra[id] / seenByEra[id] : 1;
    const worstRate = seenByEra[worst] ? correctByEra[worst] / seenByEra[worst] : 1;
    if (currentRate < worstRate) return id;
    return worst;
  }, "early");

  const nonZeroEraCount = MEME_RESULT_ORDER.filter((id) => correctByEra[id] > 0).length;
  const resultId: MemeEraId =
    accuracy >= 75 && nonZeroEraCount >= 4 ? "omnivore" : strongestEra;

  return {
    result: MEME_RESULTS[resultId],
    scores: correctByEra,
    correctCount,
    accuracy,
    strongestEra,
    weakestEra,
  };
}
