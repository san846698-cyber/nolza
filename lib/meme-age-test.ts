export type MemeEraId = "survivor" | "cyworld" | "school" | "shorts" | "ai";

export type MemeScore = Partial<Record<MemeEraId, number>>;

export type MemeAnswer = {
  id: string;
  text: string;
  caption: string;
  scores: MemeScore;
};

export type MemeQuestion = {
  id: string;
  category: string;
  question: string;
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

export const MEME_RESULT_ORDER: MemeEraId[] = [
  "survivor",
  "cyworld",
  "school",
  "shorts",
  "ai",
];

export const MEME_RESULTS: Record<MemeEraId, MemeAgeResult> = {
  survivor: {
    id: "survivor",
    name: "원시 인터넷 생존자",
    memeAge: "2003년 인터넷 영혼",
    emoji: "⌨",
    accent: "#3cff9b",
    description:
      "당신은 인터넷이 아직 거칠고 낯설던 시절의 감성을 알고 있습니다. 요즘 밈도 보긴 하지만, 마음속 고향은 게시판, 댓글 드립, 오래된 짤방 감성입니다.",
    traits: ["오래된 드립을 기억함", "인터넷 문화의 변화에 민감함", "요즘 밈을 보면 가끔 피곤함"],
    shareLine: "나는 2003년 인터넷 영혼이었다... 너는 몇 년도 밈 인간?",
    verdict: "밈을 단순히 웃긴 것으로만 보지 않고, 시대의 공기까지 같이 읽는 타입입니다.",
    timeline: [
      "게시판 제목만 봐도 분위기를 감지합니다.",
      "짧은 웃음보다 오래 남는 댓글 드립을 좋아합니다.",
      "요즘 유행도 보긴 보지만 마음속에는 오래된 접속음이 울립니다.",
    ],
    groupChatRole: "단톡방에서 조용하다가 갑자기 너무 오래된 드립을 던져 모두를 당황하게 만듭니다.",
    modernProof: ["새 플랫폼에도 적응하지만 정감은 옛날", "댓글창의 공기부터 읽음", "유행보다 맥락을 먼저 봄"],
  },
  cyworld: {
    id: "cyworld",
    name: "싸이월드 감성러",
    memeAge: "2007년 감성 인터넷러",
    emoji: "♪",
    accent: "#ff8bb8",
    description:
      "당신은 감성, 허세, BGM, 미니홈피 분위기를 이해하는 사람입니다. 밈을 단순한 웃음이 아니라 시대의 감정으로 받아들입니다.",
    traits: ["감성 드립에 약함", "추억 보정이 강함", "인터넷을 감정 표현 공간으로 봄"],
    shareLine: "내 밈 나이는 2007년 감성 인터넷러래. 너무 찔리는데?",
    verdict: "웃기다가도 갑자기 추억 보정으로 마음이 촉촉해지는 타입입니다.",
    timeline: [
      "밈을 보면 그 시절 말투와 배경음악까지 같이 떠올립니다.",
      "장난 속에 감정이 얹혀 있으면 바로 반응합니다.",
      "빠르게 사라지는 유행보다 분위기가 있는 드립을 선호합니다.",
    ],
    groupChatRole: "웃긴 얘기 중 갑자기 '근데 이거 약간 슬프다'고 말해 채팅방의 온도를 바꿉니다.",
    modernProof: ["프로필 문구를 신중하게 고름", "추억형 콘텐츠에 약함", "짤보다 분위기를 먼저 봄"],
  },
  school: {
    id: "school",
    name: "급식체 마스터",
    memeAge: "2016년 드립 폭격기",
    emoji: "ㅋㅋ",
    accent: "#ffd43b",
    description:
      "당신은 빠르게 치고 빠지는 드립에 강합니다. 말장난, 과장된 리액션, 친구들끼리만 통하는 유행어에 익숙합니다.",
    traits: ["반응 속도가 빠름", "드립을 보면 바로 응용함", "친구 단톡방에서 강함"],
    shareLine: "나는 2016년 드립 폭격기 나왔다. 반박 가능?",
    verdict: "대화가 조용해지는 순간 즉시 드립을 투입하는 실전형 밈러입니다.",
    timeline: [
      "친구가 한마디 던지면 바로 변형 드립을 만듭니다.",
      "말장난과 과장된 리액션을 두려워하지 않습니다.",
      "단톡방의 텐션이 떨어지면 자동으로 출동합니다.",
    ],
    groupChatRole: "이상한 말투를 제일 먼저 시작하고, 나중에는 모두가 따라 하게 만듭니다.",
    modernProof: ["짧은 반응에 강함", "유행어 응용이 빠름", "친구끼리만 통하는 코드에 강함"],
  },
  shorts: {
    id: "shorts",
    name: "쇼츠 밈 네이티브",
    memeAge: "2024년 숏폼 인간",
    emoji: "▶",
    accent: "#61d9ff",
    description:
      "당신은 밈을 긴 글보다 영상, 사운드, 짧은 자막으로 이해합니다. 유행이 바뀌는 속도에 익숙하고, 3초 안에 웃긴지 판단합니다.",
    traits: ["숏폼 감각이 좋음", "빠른 유행에 강함", "긴 설명을 싫어함"],
    shareLine: "내 밈 나이는 2024년 숏폼 인간이었다. 너무 정확해서 무서움.",
    verdict: "긴 설명보다 컷 편집, 자막, 사운드 한 박자로 웃음을 판단하는 타입입니다.",
    timeline: [
      "처음 3초 안에 재미가 없으면 마음이 멀어집니다.",
      "밈은 보는 것보다 알고리즘에 흘러 들어오는 것에 가깝습니다.",
      "긴 글 설명보다 한 줄 자막을 더 신뢰합니다.",
    ],
    groupChatRole: "영상 링크를 던지고 '여기 4초부터 봐'라고 정확히 지시합니다.",
    modernProof: ["숏폼 사운드를 잘 기억함", "짧은 자막에 강함", "트렌드 전환이 빠름"],
  },
  ai: {
    id: "ai",
    name: "AI 밈 합성체",
    memeAge: "2026년 미래형 밈 생명체",
    emoji: "AI",
    accent: "#b197fc",
    description:
      "당신은 기존 밈보다 이상하고 새로운 조합에 끌립니다. AI 이미지, 이상한 상황극, 뜬금없는 세계관 밈을 자연스럽게 받아들입니다.",
    traits: ["이상한 밈에 강함", "맥락 없는 유머를 잘 이해함", "새 유행을 빨리 흡수함"],
    shareLine: "나는 2026년 AI 밈 합성체래. 인간 밈을 초월함.",
    verdict: "맥락이 없어도 재미만 있으면 바로 받아들이는 미래형 밈 감각입니다.",
    timeline: [
      "설명할 수 없는데 웃긴 조합을 좋아합니다.",
      "밈의 출처보다 이상한 세계관이 더 중요합니다.",
      "새로운 유행이 오면 일단 흡수하고 봅니다.",
    ],
    groupChatRole: "아무도 이해 못 한 밈을 먼저 웃고, 일주일 뒤 모두가 이해하게 됩니다.",
    modernProof: ["이상한 조합에 면역 있음", "AI식 상황극에 강함", "새로운 밈 문법을 빨리 배움"],
  },
};

const answer = (
  id: string,
  text: string,
  caption: string,
  scores: MemeScore,
): MemeAnswer => ({ id, text, caption, scores });

export const MEME_QUESTIONS: MemeQuestion[] = [
  {
    id: "first-vibe",
    category: "인터넷 시대감",
    question: "인터넷 밈을 볼 때 가장 먼저 보는 것은?",
    mood: "웃기긴 한데, 어느 시대 냄새가 나나요?",
    answers: [
      answer("a", "댓글 흐름과 게시판 분위기", "밈은 맥락이 생명", { survivor: 3, cyworld: 1 }),
      answer("b", "그때의 감성과 추억", "살짝 촉촉해야 함", { cyworld: 3 }),
      answer("c", "친구들이 바로 따라 할 수 있는지", "실전 응용 중요", { school: 3 }),
      answer("d", "3초 안에 터지는지", "길면 졌다", { shorts: 2, ai: 1 }),
    ],
  },
  {
    id: "reaction",
    category: "반응 방식",
    question: "친구가 갑자기 이상한 드립을 쳤을 때 당신의 반응은?",
    mood: "단톡방 순발력 테스트",
    answers: [
      answer("a", "일단 원본 출처부터 떠올린다", "자료형 밈 인간", { survivor: 3 }),
      answer("b", "감성적으로 받아서 한 문장 얹는다", "여운 담당", { cyworld: 3 }),
      answer("c", "바로 변형해서 받아친다", "드립 릴레이 시작", { school: 3 }),
      answer("d", "이상하면 이상할수록 좋다", "맥락은 나중 문제", { ai: 3, shorts: 1 }),
    ],
  },
  {
    id: "platform-home",
    category: "플랫폼 감각",
    question: "가장 익숙한 인터넷 공간의 느낌은?",
    mood: "당신의 마음속 홈 화면",
    answers: [
      answer("a", "낡은 게시판과 댓글 타래", "고전 인터넷", { survivor: 3 }),
      answer("b", "프로필, 배경음악, 방명록", "감성 저장소", { cyworld: 3 }),
      answer("c", "친구 단톡방과 학교식 유행어", "실시간 드립장", { school: 3 }),
      answer("d", "쇼츠, 릴스, 추천 알고리즘", "스크롤 세계", { shorts: 3, ai: 1 }),
    ],
  },
  {
    id: "old-slang",
    category: "옛날 말투",
    question: "오래된 인터넷 말투를 보면 드는 생각은?",
    mood: "추억 보정이 켜졌나요?",
    answers: [
      answer("a", "이 맛이지", "원본 감성 보존", { survivor: 3 }),
      answer("b", "갑자기 배경음악이 들리는 기분", "미니홈피 감성", { cyworld: 3 }),
      answer("c", "요즘식으로 바꾸면 더 웃길 듯", "응용 본능", { school: 2, shorts: 1 }),
      answer("d", "이걸 AI랑 섞으면 더 이상해질 듯", "미래형 합성", { ai: 3 }),
    ],
  },
  {
    id: "shortform",
    category: "숏폼 문화",
    question: "짧은 영상 밈에서 가장 중요한 것은?",
    mood: "3초 안에 승부",
    answers: [
      answer("a", "원본 맥락과 댓글 반응", "깊게 파야 함", { survivor: 2 }),
      answer("b", "감정선과 분위기", "재미에도 결이 있음", { cyworld: 2 }),
      answer("c", "바로 따라 하기 쉬운 말투", "친구 전파력", { school: 2 }),
      answer("d", "자막, 사운드, 컷 타이밍", "숏폼 네이티브", { shorts: 3, ai: 1 }),
    ],
  },
  {
    id: "ai-meme",
    category: "AI 밈",
    question: "AI가 만든 이상한 상황극 밈을 보면?",
    mood: "맥락 없는 웃음 견딜 수 있나요?",
    answers: [
      answer("a", "일단 왜 웃긴지 구조를 분석한다", "고전 분석가", { survivor: 2 }),
      answer("b", "이상한데 묘하게 감성 있음", "감성 회로 작동", { cyworld: 1, ai: 2 }),
      answer("c", "친구한테 바로 보낼 각", "반응 테스트", { school: 1, shorts: 2 }),
      answer("d", "좋다. 더 이상해져도 된다", "AI 밈 적응 완료", { ai: 3 }),
    ],
  },
  {
    id: "group-chat",
    category: "단톡방 역할",
    question: "단톡방에서 당신의 밈 역할은?",
    mood: "채팅방 생태계 포지션",
    answers: [
      answer("a", "가끔 오래된 레퍼런스로 판을 흔든다", "숨은 고수", { survivor: 3 }),
      answer("b", "웃기다가도 감성 멘트를 얹는다", "분위기 전환", { cyworld: 3 }),
      answer("c", "말투를 전염시키는 사람", "드립 확산자", { school: 3 }),
      answer("d", "새 밈 링크를 가장 먼저 던진다", "트렌드 정찰병", { shorts: 2, ai: 2 }),
    ],
  },
  {
    id: "comment-culture",
    category: "댓글 문화",
    question: "재밌는 댓글을 볼 때 당신은?",
    mood: "밈은 댓글에서 완성된다",
    answers: [
      answer("a", "본문보다 댓글이 진짜라고 생각한다", "게시판 혈통", { survivor: 3 }),
      answer("b", "댓글의 말투에서 시대 감성을 본다", "감성 채집", { cyworld: 2 }),
      answer("c", "바로 친구한테 복붙하고 싶다", "실전 전파", { school: 2, shorts: 1 }),
      answer("d", "캡처보다 영상 반응으로 보고 싶다", "숏폼 반응형", { shorts: 3 }),
    ],
  },
  {
    id: "speed",
    category: "유행 속도",
    question: "밈 유행이 너무 빨리 바뀔 때 당신은?",
    mood: "업데이트 압박",
    answers: [
      answer("a", "굳이 다 따라갈 필요는 없다고 생각", "고전파", { survivor: 3 }),
      answer("b", "그래도 추억 밈이 제일 오래 간다", "감성파", { cyworld: 3 }),
      answer("c", "친구들이 쓰면 바로 따라간다", "적응 빠름", { school: 3 }),
      answer("d", "바뀌는 속도까지 콘텐츠라고 생각", "알고리즘 친화", { shorts: 2, ai: 2 }),
    ],
  },
  {
    id: "meme-format",
    category: "밈 형식",
    question: "당신이 가장 좋아하는 밈 형식은?",
    mood: "짤, 말투, 영상, 세계관",
    answers: [
      answer("a", "짧고 강한 댓글 드립", "원문 맛", { survivor: 3 }),
      answer("b", "감성적인 상황 설명", "여운 맛", { cyworld: 3 }),
      answer("c", "친구끼리 쓰는 말투 밈", "전염 맛", { school: 3 }),
      answer("d", "맥락 없는 이상한 세계관", "미래 맛", { ai: 3, shorts: 1 }),
    ],
  },
  {
    id: "teasing",
    category: "드립 응용",
    question: "친구가 유행어를 늦게 배워왔을 때?",
    mood: "놀릴까, 설명할까",
    answers: [
      answer("a", "그 유행의 역사부터 설명한다", "강의 시작", { survivor: 3 }),
      answer("b", "괜히 추억 얘기로 빠진다", "회상 시작", { cyworld: 3 }),
      answer("c", "바로 놀리면서 새 드립을 만든다", "단톡방 화력", { school: 3 }),
      answer("d", "이미 다음 유행으로 넘어갔다고 말한다", "속도전", { shorts: 2, ai: 1 }),
    ],
  },
  {
    id: "final-pick",
    category: "최종 감각",
    question: "나에게 밈이란?",
    mood: "밈 철학 한 줄",
    answers: [
      answer("a", "인터넷 역사의 화석 같은 것", "보존 가치", { survivor: 3 }),
      answer("b", "그 시대 사람들의 감정 기록", "감성 기록", { cyworld: 3 }),
      answer("c", "친구들과 순간적으로 노는 언어", "소통 도구", { school: 3 }),
      answer("d", "계속 변이하는 이상한 생명체", "미래 생물", { shorts: 1, ai: 3 }),
    ],
  },
];

export function calculateMemeResult(answers: MemeAnswer[]) {
  const scores = MEME_RESULT_ORDER.reduce<Record<MemeEraId, number>>((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Record<MemeEraId, number>);

  answers.forEach((selected) => {
    Object.entries(selected.scores).forEach(([key, value]) => {
      scores[key as MemeEraId] += value ?? 0;
    });
  });

  const winner = MEME_RESULT_ORDER.reduce<MemeEraId>((best, id) => {
    if (scores[id] > scores[best]) return id;
    return best;
  }, "survivor");

  return {
    result: MEME_RESULTS[winner],
    scores,
  };
}
