export type MemeEraId = "early" | "cyworld" | "community2010" | "shortform" | "ai" | "omnivore";

export type MemeLocale = "ko" | "en";
export type LocalizedText = Record<MemeLocale, string>;
export type LocalizedList = Record<MemeLocale, string[]>;

export type MemeAnswer = {
  id: string;
  text: LocalizedText;
  caption: LocalizedText;
  era: Exclude<MemeEraId, "omnivore">;
  correct: boolean;
  feedback: LocalizedText;
};

export type MemeQuestion = {
  id: string;
  kind: "era" | "meaning" | "platform" | "timeline" | "plausible" | "generation";
  category: string;
  question: LocalizedText;
  clue: LocalizedText;
  mood: LocalizedText;
  answers: MemeAnswer[];
};

export type MemeAgeResult = {
  id: MemeEraId;
  name: LocalizedText;
  memeAge: LocalizedText;
  emoji: string;
  accent: string;
  description: LocalizedText;
  traits: LocalizedList;
  shareLine: LocalizedText;
  verdict: LocalizedText;
  timeline: LocalizedList;
  groupChatRole: LocalizedText;
  modernProof: LocalizedList;
};

export const ERA_LABELS: Record<Exclude<MemeEraId, "omnivore">, LocalizedText> = {
  early: { ko: "초기 인터넷", en: "Early internet" },
  cyworld: { ko: "2000년대 감성", en: "2000s vibe" },
  community2010: { ko: "2010년대 드립", en: "2010s humor" },
  shortform: { ko: "숏폼 밈", en: "Short-form memes" },
  ai: { ko: "AI 밈", en: "AI memes" },
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
    name: { ko: "초기 인터넷 영혼", en: "Early Internet Soul" },
    memeAge: { ko: "2003년 인터넷 생존자", en: "2003 internet survivor" },
    emoji: "⌨",
    accent: "#3cff9b",
    description: {
      ko: "게시판, 댓글 타래, 출처 찾기 감각이 살아 있습니다. 유행을 그냥 소비하기보다 어디서 왔고 왜 웃긴지까지 보는 타입입니다.",
      en: "Forums, comment threads, and a knack for tracking down sources are alive in you. Rather than just consuming a trend, you look at where it came from and why it's funny.",
    },
    traits: {
      ko: ["원본 집착", "댓글 맥락 강함", "오래된 말투 감지"],
      en: ["Original-obsessed", "Strong on comment context", "Spots old-school slang"],
    },
    shareLine: {
      ko: "내 밈 나이는 초기 인터넷 영혼이었다. 접속음이 들리는 사람?",
      en: "My meme age is Early Internet Soul. Anyone else still hear the dial-up sound?",
    },
    verdict: {
      ko: "밈을 단순한 농담보다 인터넷 역사의 흔적으로 읽습니다.",
      en: "You read memes less as simple jokes and more as traces of internet history.",
    },
    timeline: {
      ko: ["낡은 게시판 감성을 잘 압니다.", "짧은 반응보다 맥락 있는 댓글을 좋아합니다.", "요즘 유행도 보지만 출처가 더 궁금합니다."],
      en: ["You know the feel of old forums.", "You prefer context-rich comments over quick reactions.", "You watch current trends but care more about the source."],
    },
    groupChatRole: {
      ko: "조용하다가 너무 오래된 레퍼런스로 모두를 멈칫하게 만드는 사람.",
      en: "Quiet until you drop a reference so old it makes the whole chat pause.",
    },
    modernProof: {
      ko: ["원본 감별", "댓글 흐름 읽기", "인터넷 고고학"],
      en: ["Spotting the original", "Reading comment flow", "Internet archaeology"],
    },
  },
  cyworld: {
    id: "cyworld",
    name: { ko: "2000년대 감성 토박이", en: "2000s Sentiment Native" },
    memeAge: { ko: "2007년 미니홈피 감성러", en: "2007 minihompy sentimentalist" },
    emoji: "♪",
    accent: "#ff8bb8",
    description: {
      ko: "말투보다 분위기, 농담보다 감정선을 먼저 봅니다. BGM이 깔릴 것 같은 문장과 살짝 민망한 감성을 알아보는 사람입니다.",
      en: "You notice the mood before the wording, the emotion before the joke. You recognize sentences that feel like they need a background track, and that slightly cringey-sweet feeling.",
    },
    traits: {
      ko: ["감성 문구 반응", "추억 보정", "프로필 문장 감별"],
      en: ["Reacts to sentimental lines", "Nostalgia goggles", "Reads profile-status vibes"],
    },
    shareLine: {
      ko: "내 밈 나이는 2007년 감성 토박이래. 괜히 배경음악 깔림.",
      en: "My meme age is a 2007 sentiment native. I can already hear the background music.",
    },
    verdict: {
      ko: "웃기다가도 갑자기 마음이 촉촉해지는 감성형 인터넷 인간입니다.",
      en: "You're a feelings-first internet person who can go from laughing to misty-eyed in a second.",
    },
    timeline: {
      ko: ["방명록과 미니홈피의 온도를 압니다.", "허세와 진심 사이의 문장을 구분합니다.", "추억형 콘텐츠에 꽤 약합니다."],
      en: ["You know the warmth of guestbooks and minihompies.", "You can tell posturing from sincerity in a line.", "You're pretty weak to nostalgia content."],
    },
    groupChatRole: {
      ko: "드립 중간에 갑자기 '근데 이거 좀 슬프다'고 말하는 사람.",
      en: "The one who, mid-joke, suddenly says \"but honestly this is kind of sad.\"",
    },
    modernProof: {
      ko: ["감성 저장", "문장 분위기 캐치", "추억형 밈 강함"],
      en: ["Saving the feels", "Catching a sentence's mood", "Strong on nostalgia memes"],
    },
  },
  community2010: {
    id: "community2010",
    name: { ko: "2010년대 드립 장인", en: "2010s Banter Master" },
    memeAge: { ko: "2016년 커뮤니티 드립러", en: "2016 community jokester" },
    emoji: "ㅋㅋ",
    accent: "#ffd43b",
    description: {
      ko: "짧게 치고 빠지는 말투, 과장된 리액션, 친구끼리 전염되는 드립에 강합니다. 밈을 보면 바로 응용할 생각부터 납니다.",
      en: "You're strong on hit-and-run one-liners, exaggerated reactions, and jokes that spread between friends. See a meme and your first thought is how to remix it.",
    },
    traits: {
      ko: ["응용 빠름", "단톡방 화력", "말투 전염"],
      en: ["Quick to remix", "Group-chat firepower", "Contagious slang"],
    },
    shareLine: {
      ko: "내 밈 나이는 2010년대 드립 장인. 반박은 받지만 안 들음.",
      en: "My meme age is 2010s Banter Master. I'll take your rebuttal but I'm not listening.",
    },
    verdict: {
      ko: "조용한 대화에 바로 드립을 투입하는 실전형 밈러입니다.",
      en: "You're a battle-tested meme user who drops a punchline into any quiet chat.",
    },
    timeline: {
      ko: ["말투 밈을 빨리 흡수합니다.", "친구들 사이에서 변형 드립을 잘 만듭니다.", "설명보다 타이밍을 믿습니다."],
      en: ["You absorb slang memes fast.", "You're good at coining variations among friends.", "You trust timing over explanation."],
    },
    groupChatRole: {
      ko: "이상한 말투를 제일 먼저 시작하고 나중엔 모두가 따라 하게 만듭니다.",
      en: "The first to start a weird way of talking that everyone ends up copying.",
    },
    modernProof: {
      ko: ["순발력", "유행어 응용", "단톡방 전파력"],
      en: ["Quick wit", "Remixing buzzwords", "Group-chat reach"],
    },
  },
  shortform: {
    id: "shortform",
    name: { ko: "숏폼 밈 적응 완료형", en: "Short-Form Adapted" },
    memeAge: { ko: "2024년 숏폼 네이티브", en: "2024 short-form native" },
    emoji: "▶",
    accent: "#61d9ff",
    description: {
      ko: "밈을 긴 글보다 자막, 사운드, 컷 편집으로 이해합니다. 유행의 속도가 빨라도 크게 당황하지 않는 알고리즘 친화형입니다.",
      en: "You understand memes through captions, sounds, and cuts rather than long text. You're algorithm-friendly and don't panic even when trends move fast.",
    },
    traits: {
      ko: ["3초 판단", "자막 감각", "트렌드 전환 빠름"],
      en: ["3-second judgment", "Caption instinct", "Fast trend switching"],
    },
    shareLine: {
      ko: "내 밈 나이는 숏폼 적응 완료형. 여기 4초부터 봐.",
      en: "My meme age is Short-Form Adapted. Watch from the 4-second mark.",
    },
    verdict: {
      ko: "짧은 장면 하나로 웃긴지 판단하는 속도형 밈 감각입니다.",
      en: "You have speed-tuned meme instincts that judge funny from a single short clip.",
    },
    timeline: {
      ko: ["짧은 영상 자막에 강합니다.", "사운드와 반복 구조를 잘 기억합니다.", "긴 설명은 조금 피곤합니다."],
      en: ["You're strong on short-video captions.", "You remember sounds and repeating structures well.", "Long explanations tire you a little."],
    },
    groupChatRole: {
      ko: "영상 링크를 던지고 정확히 몇 초부터 봐야 하는지 알려주는 사람.",
      en: "The one who drops a video link and tells you exactly which second to start at.",
    },
    modernProof: {
      ko: ["숏폼 문법", "빠른 스크롤", "자막 리듬"],
      en: ["Short-form grammar", "Fast scrolling", "Caption rhythm"],
    },
  },
  ai: {
    id: "ai",
    name: { ko: "AI 밈 신인류", en: "AI Meme New Species" },
    memeAge: { ko: "2026년 미래형 밈 생명체", en: "2026 future meme lifeform" },
    emoji: "AI",
    accent: "#b197fc",
    description: {
      ko: "맥락 없는 상황극, 이상한 조합, 설명하기 어려운 웃음을 빨리 받아들입니다. 새 밈 문법이 나와도 일단 즐기고 봅니다.",
      en: "You quickly accept context-free skits, strange mashups, and humor that's hard to explain. When a new meme grammar shows up, you just enjoy it first.",
    },
    traits: {
      ko: ["이상한 조합 강함", "새 문법 흡수", "맥락 없는 웃음"],
      en: ["Strong on weird mashups", "Absorbs new grammar", "Laughs without context"],
    },
    shareLine: {
      ko: "내 밈 나이는 AI 밈 신인류. 인간 밈을 조금 초월함.",
      en: "My meme age is AI Meme New Species. I've slightly transcended human memes.",
    },
    verdict: {
      ko: "출처보다 조합의 이상함을 즐기는 미래형 인터넷 인간입니다.",
      en: "You're a future internet person who enjoys the strangeness of the mashup over the source.",
    },
    timeline: {
      ko: ["설명하기 어려운 밈을 빨리 받아들입니다.", "AI식 상황극에도 거부감이 적습니다.", "새 유행을 일단 저장합니다."],
      en: ["You quickly accept memes that are hard to explain.", "You're rarely put off by AI-style skits.", "You save new trends first and ask later."],
    },
    groupChatRole: {
      ko: "아무도 이해 못 한 밈을 먼저 웃고 일주일 뒤 모두가 따라오게 만드는 사람.",
      en: "The one who laughs first at a meme nobody gets, and a week later everyone catches up.",
    },
    modernProof: {
      ko: ["AI 상황극", "초현실 조합", "새 문법 적응"],
      en: ["AI skits", "Surreal mashups", "Adapting to new grammar"],
    },
  },
  omnivore: {
    id: "omnivore",
    name: { ko: "세대 초월 인터넷 인간", en: "Cross-Generation Internet Human" },
    memeAge: { ko: "전 시대 밈 잡식형", en: "All-era meme omnivore" },
    emoji: "∞",
    accent: "#45ffb0",
    description: {
      ko: "옛 커뮤니티부터 숏폼과 AI 밈까지 넓게 알아봅니다. 특정 세대 하나에 갇히기보다 인터넷 문화의 변화를 통째로 즐기는 타입입니다.",
      en: "You recognize everything from old communities to short-form and AI memes. Rather than being stuck in one generation, you enjoy the whole evolution of internet culture.",
    },
    traits: {
      ko: ["넓은 밈 스펙트럼", "세대 넘나듦", "맥락과 속도 둘 다 강함"],
      en: ["Wide meme spectrum", "Crosses generations", "Strong on context and speed"],
    },
    shareLine: {
      ko: "내 밈 나이는 세대 초월형. 인터넷을 너무 오래, 너무 넓게 봄.",
      en: "My meme age is cross-generation. I've watched the internet too long and too wide.",
    },
    verdict: {
      ko: "밈을 시대별 언어처럼 읽는 인터넷 잡식형입니다.",
      en: "You're an internet omnivore who reads memes like the language of each era.",
    },
    timeline: {
      ko: ["오래된 감성도 최신 문법도 알아봅니다.", "밈의 시대 차이를 꽤 정확히 구분합니다.", "친구 세대가 달라도 대화가 됩니다."],
      en: ["You recognize both old vibes and the latest grammar.", "You can tell memes apart by era pretty accurately.", "You can talk memes with friends of any generation."],
    },
    groupChatRole: {
      ko: "어느 세대 드립이 나와도 설명하거나 받아칠 수 있는 통역자.",
      en: "The translator who can explain or fire back at any generation's joke.",
    },
    modernProof: {
      ko: ["넓은 인식폭", "시대 구분", "밈 통역"],
      en: ["Broad recognition", "Telling eras apart", "Meme translation"],
    },
  },
};

const answer = (
  id: string,
  text: LocalizedText,
  caption: LocalizedText,
  era: Exclude<MemeEraId, "omnivore">,
  correct: boolean,
  feedback: LocalizedText,
): MemeAnswer => ({ id, text, caption, era, correct, feedback });

export const MEME_QUESTIONS: MemeQuestion[] = [
  {
    id: "era-minihompy",
    kind: "era",
    category: "ERA GUESS",
    question: { ko: "이 감성의 전성기는?", en: "When did this vibe peak?" },
    clue: {
      ko: "프로필 문구를 고치고, 배경음악을 고르고, 방명록 답글을 기다리던 밤.",
      en: "Nights spent editing your profile status, picking background music, and waiting for guestbook replies.",
    },
    mood: { ko: "시대 맞히기", en: "Guess the era" },
    answers: [
      answer("a", { ko: "초기 게시판 시대", en: "Early forum era" }, { ko: "거칠고 텍스트 중심", en: "Rough and text-centric" }, "early", false, { ko: "조금 더 감성적이고 프로필 중심인 시대예요.", en: "This is a more sentimental, profile-centered era." }),
      answer("b", { ko: "2000년대 미니홈피 감성", en: "2000s minihompy vibe" }, { ko: "BGM과 방명록의 시대", en: "Age of BGM and guestbooks" }, "cyworld", true, { ko: "정답! 이건 미니홈피와 감성 문구의 공기가 강합니다.", en: "Correct! This has the strong air of minihompies and sentimental status lines." }),
      answer("c", { ko: "2010년대 단톡방 드립", en: "2010s group-chat banter" }, { ko: "말투 전염의 시대", en: "Age of contagious slang" }, "community2010", false, { ko: "2010년대보다는 더 개인 페이지 감성이 강해요.", en: "This leans more personal-page than 2010s group chat." }),
      answer("d", { ko: "숏폼 댓글 밈", en: "Short-form comment memes" }, { ko: "알고리즘 스크롤 시대", en: "Age of algorithmic scrolling" }, "shortform", false, { ko: "숏폼보다 훨씬 느리고 감성적인 인터넷이에요.", en: "This internet is much slower and more sentimental than short-form." }),
    ],
  },
  {
    id: "meaning-sarcasm",
    kind: "meaning",
    category: "MEANING",
    question: { ko: "“진짜 대단하다…”의 인터넷식 느낌으로 가장 가까운 것은?", en: "What's the closest internet read on \"truly amazing…\"?" },
    clue: {
      ko: "칭찬처럼 보이지만, 문맥상 이미 모두가 눈치챈 상황.",
      en: "It looks like praise, but in context everyone already gets what's really going on.",
    },
    mood: { ko: "말맛 판독", en: "Decode the tone" },
    answers: [
      answer("a", { ko: "진심 칭찬", en: "Genuine praise" }, { ko: "정직한 리액션", en: "An honest reaction" }, "cyworld", false, { ko: "문장만 보면 칭찬이지만 인터넷에서는 표정이 숨어 있어요.", en: "On the surface it's praise, but online there's a hidden face behind it." }),
      answer("b", { ko: "비꼼 섞인 감탄", en: "Sarcastic admiration" }, { ko: "말끝의 점 세 개가 힌트", en: "The trailing dots are the hint" }, "community2010", true, { ko: "정답! 말줄임표와 맥락이 만나면 비꼼이 됩니다.", en: "Correct! When an ellipsis meets the context, it turns into sarcasm." }),
      answer("c", { ko: "정보 요청", en: "Asking for info" }, { ko: "더 알려달라는 뜻", en: "Wanting to know more" }, "early", false, { ko: "정보 요청보다는 감정 반응에 가까워요.", en: "This is closer to an emotional reaction than a request for info." }),
      answer("d", { ko: "AI가 쓴 문장", en: "A line written by AI" }, { ko: "너무 매끄러움", en: "Too smooth" }, "ai", false, { ko: "AI 문장이라기보다는 사람 냄새 나는 비꼼이에요.", en: "Less like an AI line, more like sarcasm with a human touch." }),
    ],
  },
  {
    id: "platform-forum",
    kind: "platform",
    category: "CONTEXT",
    question: { ko: "이런 말투가 가장 잘 어울리는 곳은?", en: "Where does this way of talking fit best?" },
    clue: {
      ko: "긴 글보다 제목과 댓글 흐름이 더 중요하고, 안쪽 사람만 아는 약속이 많다.",
      en: "The title and comment flow matter more than long posts, and there are lots of in-group rules only insiders know.",
    },
    mood: { ko: "플랫폼 맞히기", en: "Guess the platform" },
    answers: [
      answer("a", { ko: "초창기 커뮤니티 게시판", en: "Early community forums" }, { ko: "제목과 댓글이 세계관", en: "Titles and comments are the whole world" }, "early", true, { ko: "정답! 게시판 문화는 제목, 댓글, 내부 약속으로 굴러갑니다.", en: "Correct! Forum culture runs on titles, comments, and inside rules." }),
      answer("b", { ko: "감성 프로필 페이지", en: "Sentimental profile pages" }, { ko: "나를 꾸미는 공간", en: "A space to decorate yourself" }, "cyworld", false, { ko: "프로필보다는 토론과 댓글 흐름이 강해요.", en: "This is more about discussion and comment flow than profiles." }),
      answer("c", { ko: "숏폼 추천 피드", en: "Short-form recommendation feed" }, { ko: "영상이 중심", en: "Video at the center" }, "shortform", false, { ko: "영상보다 텍스트 게시판에 가까운 힌트예요.", en: "The hint points to a text forum more than video." }),
      answer("d", { ko: "AI 챗봇 대화", en: "AI chatbot conversation" }, { ko: "즉석 생성 대화", en: "On-the-fly generated chat" }, "ai", false, { ko: "AI 대화보다 오래된 커뮤니티 내부 문법입니다.", en: "This is the inside grammar of an older community, not AI chat." }),
    ],
  },
  {
    id: "timeline-oldest",
    kind: "timeline",
    category: "OLDEST",
    question: { ko: "다음 중 가장 오래된 인터넷 감성은?", en: "Which of these is the oldest internet vibe?" },
    clue: {
      ko: "이미지를 떠올리지 말고, 말투와 공간의 나이를 맞혀보세요.",
      en: "Don't picture an image; guess by the age of the tone and the space.",
    },
    mood: { ko: "타임라인 감각", en: "Timeline sense" },
    answers: [
      answer("a", { ko: "방명록에 오늘 기분 남기기", en: "Leaving today's mood in a guestbook" }, { ko: "감성 홈피", en: "Sentimental homepage" }, "cyworld", false, { ko: "오래됐지만, 게시판 원시 감성보다는 뒤쪽이에요.", en: "It's old, but it comes after the primal forum vibe." }),
      answer("b", { ko: "게시판 제목으로 낚고 댓글에서 완성하기", en: "Baiting with a forum title and finishing in the comments" }, { ko: "텍스트 커뮤니티", en: "Text community" }, "early", true, { ko: "정답! 텍스트 게시판 감성이 가장 오래된 축에 가깝습니다.", en: "Correct! The text-forum vibe sits near the oldest end." }),
      answer("c", { ko: "친구끼리 말투 따라 하기", en: "Friends copying each other's slang" }, { ko: "단톡방 전염", en: "Group-chat contagion" }, "community2010", false, { ko: "이건 모바일 메신저와 함께 강해진 감성이에요.", en: "This vibe grew strong alongside mobile messengers." }),
      answer("d", { ko: "알고리즘이 밀어준 사운드 따라 하기", en: "Copying a sound the algorithm pushed" }, { ko: "숏폼 유행", en: "Short-form trend" }, "shortform", false, { ko: "가장 최신 쪽에 가까워요.", en: "This is closer to the newest end." }),
    ],
  },
  {
    id: "plausible-old",
    kind: "plausible",
    category: "REAL OR FAKE",
    question: { ko: "가장 옛 인터넷 감성에 있을 법한 표현은?", en: "Which line sounds most like the oldest internet vibe?" },
    clue: {
      ko: "너무 최신 말투 말고, 조금 투박하고 텍스트 게시판 같은 것을 고르세요.",
      en: "Don't pick the most modern phrasing; choose the slightly rough, text-forum-like one.",
    },
    mood: { ko: "가짜 말투 감별", en: "Spot the fake tone" },
    answers: [
      answer("a", { ko: "이거 완전 알고리즘 탔네", en: "Wow, this totally rode the algorithm" }, { ko: "추천 피드 시대", en: "Recommendation-feed era" }, "shortform", false, { ko: "알고리즘이라는 말맛은 훨씬 최신입니다.", en: "The word \"algorithm\" as slang is much more recent." }),
      answer("b", { ko: "님들 이거 저만 웃김?", en: "Hey all, is it just me who finds this funny?" }, { ko: "게시판식 호출", en: "Forum-style call-out" }, "early", true, { ko: "정답! '님들'로 게시판 사람들을 부르는 감성이 강해요.", en: "Correct! Calling out the forum crowd with \"hey all\" is a strong old-school vibe." }),
      answer("c", { ko: "이 사운드 저장해둬야 함", en: "Gotta save this sound" }, { ko: "숏폼 사운드", en: "Short-form sound" }, "shortform", false, { ko: "사운드 저장은 숏폼 쪽 문법이에요.", en: "Saving a sound is short-form grammar." }),
      answer("d", { ko: "프롬프트 다시 넣어봐", en: "Try the prompt again" }, { ko: "AI 생성 문법", en: "AI generation grammar" }, "ai", false, { ko: "이건 너무 미래형입니다.", en: "This one is way too future." }),
    ],
  },
  {
    id: "generation-caption",
    kind: "generation",
    category: "GENERATION",
    question: { ko: "“여기 4초부터 봐”는 어느 세대에 가까울까?", en: "Which generation is \"watch from the 4-second mark\" closest to?" },
    clue: {
      ko: "영상 전체보다 특정 순간, 특정 자막, 특정 사운드가 핵심입니다.",
      en: "A specific moment, caption, or sound matters more than the whole video.",
    },
    mood: { ko: "세대 판정", en: "Call the generation" },
    answers: [
      answer("a", { ko: "2000년대 감성 세대", en: "2000s sentiment generation" }, { ko: "분위기와 BGM", en: "Mood and BGM" }, "cyworld", false, { ko: "BGM 감성은 맞지만 4초 지시는 숏폼 문법이에요.", en: "The BGM vibe fits, but \"the 4-second mark\" is short-form grammar." }),
      answer("b", { ko: "2010년대 커뮤니티 세대", en: "2010s community generation" }, { ko: "드립 응용", en: "Remixing jokes" }, "community2010", false, { ko: "드립은 있지만 영상 타임코드 감각이 더 강합니다.", en: "There's banter, but the video-timecode sense is stronger." }),
      answer("c", { ko: "숏폼/클립 세대", en: "Short-form / clip generation" }, { ko: "초 단위 하이라이트", en: "Second-by-second highlights" }, "shortform", true, { ko: "정답! 특정 초부터 보라는 말은 클립 문화에 딱 맞아요.", en: "Correct! Telling someone which second to start at fits clip culture perfectly." }),
      answer("d", { ko: "초기 게시판 세대", en: "Early forum generation" }, { ko: "텍스트 중심", en: "Text-centric" }, "early", false, { ko: "초기 게시판은 영상 타임코드보다 텍스트 흐름이 중심이에요.", en: "Early forums centered on text flow, not video timecodes." }),
    ],
  },
  {
    id: "meaning-resignation",
    kind: "meaning",
    category: "MEANING",
    question: { ko: "“아 몰라 그냥 해”의 밈 느낌은?", en: "What's the meme feel of \"ugh whatever, just do it\"?" },
    clue: {
      ko: "정확한 해결보다, 고민 끝에 포기한 듯 밀고 가는 분위기.",
      en: "Not a precise solution, but the vibe of pushing ahead like you've given up after overthinking.",
    },
    mood: { ko: "감정 맞히기", en: "Name the feeling" },
    answers: [
      answer("a", { ko: "밈화된 체념", en: "Meme-ified resignation" }, { ko: "포기했는데 추진함", en: "Gave up but charging ahead" }, "community2010", true, { ko: "정답! 체념과 실행이 같이 있는 말맛입니다.", en: "Correct! It's the tone where resignation and action sit together." }),
      answer("b", { ko: "정중한 요청", en: "A polite request" }, { ko: "예의 바른 부탁", en: "A courteous ask" }, "cyworld", false, { ko: "너무 정중한 쪽은 아니에요.", en: "It's not the overly polite side." }),
      answer("c", { ko: "기술 설명", en: "A technical explanation" }, { ko: "방법 안내", en: "How-to guidance" }, "early", false, { ko: "정보 설명보다 감정 반응입니다.", en: "It's an emotional reaction more than an info explainer." }),
      answer("d", { ko: "AI 오류 메시지", en: "An AI error message" }, { ko: "시스템 실패", en: "System failure" }, "ai", false, { ko: "오류보다는 인간적인 결정 피로에 가까워요.", en: "It's closer to human decision fatigue than an error." }),
    ],
  },
  {
    id: "platform-shortform",
    kind: "platform",
    category: "CONTEXT",
    question: { ko: "“이 자막 뜨는 순간 이미 웃김”은 어디에 가장 어울릴까?", en: "Where does \"the moment this caption pops up it's already funny\" fit best?" },
    clue: {
      ko: "영상의 내용보다 편집 템포와 자막 타이밍이 먼저 보입니다.",
      en: "The edit tempo and caption timing catch your eye before the video's content.",
    },
    mood: { ko: "공간 맞히기", en: "Guess the space" },
    answers: [
      answer("a", { ko: "숏폼 댓글 밈", en: "Short-form comment memes" }, { ko: "자막과 컷 편집", en: "Captions and cut editing" }, "shortform", true, { ko: "정답! 자막 타이밍 자체가 웃음 포인트인 세계예요.", en: "Correct! It's a world where the caption timing itself is the punchline." }),
      answer("b", { ko: "옛 게시판 공지", en: "Old forum notices" }, { ko: "텍스트 규칙", en: "Text rules" }, "early", false, { ko: "공지보다는 영상 편집 감각입니다.", en: "This is video-editing sense, not a notice board." }),
      answer("c", { ko: "미니홈피 방명록", en: "Minihompy guestbook" }, { ko: "감성 답글", en: "Sentimental replies" }, "cyworld", false, { ko: "방명록보다는 훨씬 빠른 영상 문법이에요.", en: "This is much faster video grammar than a guestbook." }),
      answer("d", { ko: "AI 프롬프트 공유방", en: "AI prompt-sharing room" }, { ko: "생성 조건", en: "Generation conditions" }, "ai", false, { ko: "AI보다는 숏폼 편집 감각이 중심입니다.", en: "The core is short-form editing sense, not AI." }),
    ],
  },
  {
    id: "ai-context",
    kind: "generation",
    category: "AI MEME",
    question: { ko: "“왜 웃긴지 모르겠는데 계속 보게 됨”이 가장 어울리는 최신 감성은?", en: "Which latest vibe fits \"I don't know why it's funny but I keep watching\"?" },
    clue: {
      ko: "이상한 조합, 불완전한 상황극, 묘하게 꿈같은 장면.",
      en: "Strange mashups, half-formed skits, oddly dreamlike scenes.",
    },
    mood: { ko: "미래 밈 감각", en: "Future-meme sense" },
    answers: [
      answer("a", { ko: "AI 생성 밈 감성", en: "AI-generated meme vibe" }, { ko: "이상한데 중독됨", en: "Weird but addictive" }, "ai", true, { ko: "정답! 설명하기 어려운 이상함이 AI 밈의 핵심일 때가 많아요.", en: "Correct! Hard-to-explain weirdness is often the core of an AI meme." }),
      answer("b", { ko: "초기 게시판 공지", en: "Early forum notices" }, { ko: "규칙 중심", en: "Rule-centric" }, "early", false, { ko: "공지 감성보다는 초현실 조합에 가까워요.", en: "It's closer to surreal mashups than a notice vibe." }),
      answer("c", { ko: "미니홈피 감성글", en: "Minihompy diary posts" }, { ko: "감정 중심", en: "Emotion-centric" }, "cyworld", false, { ko: "감성글보다는 이상한 상황극입니다.", en: "It's a weird skit more than a sentimental post." }),
      answer("d", { ko: "2010년대 말장난", en: "2010s wordplay" }, { ko: "언어유희 중심", en: "Pun-centric" }, "community2010", false, { ko: "말장난보다 이미지 없는 초현실 문법에 가까워요.", en: "It's closer to image-free surreal grammar than wordplay." }),
    ],
  },
  {
    id: "timeline-newest",
    kind: "timeline",
    category: "NEWEST",
    question: { ko: "다음 중 가장 최신 인터넷 감성은?", en: "Which of these is the newest internet vibe?" },
    clue: {
      ko: "낡은 순서가 아니라, 요즘에 가까운 문법을 고르세요.",
      en: "Don't go by oldest order; pick the grammar closest to now.",
    },
    mood: { ko: "최신 감각 체크", en: "Newness check" },
    answers: [
      answer("a", { ko: "방명록에 감성 문구 남기기", en: "Leaving a sentimental line in a guestbook" }, { ko: "2000s", en: "2000s" }, "cyworld", false, { ko: "이건 꽤 오래된 감성입니다.", en: "This is a pretty old vibe." }),
      answer("b", { ko: "댓글에서 원본 출처 찾기", en: "Tracking the original source in the comments" }, { ko: "게시판", en: "Forum" }, "early", false, { ko: "원본 찾기는 오래된 인터넷 탐구에 가까워요.", en: "Hunting for the original is closer to old-school internet sleuthing." }),
      answer("c", { ko: "AI에게 이상한 상황극을 다시 생성시키기", en: "Having AI regenerate a weird skit" }, { ko: "생성 밈", en: "Generative memes" }, "ai", true, { ko: "정답! 생성형 도구와 밈이 섞인 최신 문법입니다.", en: "Correct! It's the newest grammar, where generative tools blend with memes." }),
      answer("d", { ko: "친구끼리 유행어 변형하기", en: "Friends remixing buzzwords" }, { ko: "단톡방", en: "Group chat" }, "community2010", false, { ko: "여전히 살아 있지만 최신 축은 AI 생성 쪽이에요.", en: "It's still alive, but the newest end is the AI-generated side." }),
    ],
  },
  {
    id: "meaning-old-school",
    kind: "meaning",
    category: "OLD SCHOOL",
    question: { ko: "“원본 어디서 봄?”이라는 반응이 가장 강한 사람은?", en: "Who reacts hardest with \"where'd you see the original?\"" },
    clue: {
      ko: "웃기기 전에 출처, 맥락, 최초 게시물을 먼저 찾고 싶어 합니다.",
      en: "Before laughing, they want to find the source, the context, and the first post.",
    },
    mood: { ko: "인터넷 고고학", en: "Internet archaeology" },
    answers: [
      answer("a", { ko: "초기 인터넷 영혼", en: "Early Internet Soul" }, { ko: "출처와 맥락을 파는 사람", en: "Someone who digs into source and context" }, "early", true, { ko: "정답! 원본 추적은 고전 인터넷 감각이 강합니다.", en: "Correct! Chasing the original is a strongly classic-internet instinct." }),
      answer("b", { ko: "숏폼 네이티브", en: "Short-form native" }, { ko: "일단 넘기고 보는 사람", en: "Someone who swipes first" }, "shortform", false, { ko: "숏폼은 출처보다 속도가 먼저일 때가 많아요.", en: "For short-form, speed often comes before the source." }),
      answer("c", { ko: "AI 밈 신인류", en: "AI Meme New Species" }, { ko: "출처보다 생성이 중요", en: "Generation matters more than source" }, "ai", false, { ko: "AI 밈은 원본 추적이 흐려지는 편이에요.", en: "With AI memes, tracking the original tends to blur." }),
      answer("d", { ko: "감성 홈피러", en: "Sentimental homepage user" }, { ko: "분위기부터 보는 사람", en: "Someone who reads the mood first" }, "cyworld", false, { ko: "감성 홈피러는 출처보다 분위기에 더 반응합니다.", en: "The sentimental homepage type reacts to mood more than source." }),
    ],
  },
  {
    id: "final-generation",
    kind: "generation",
    category: "FINAL ROUND",
    question: { ko: "밈을 가장 잘 즐기는 방식은?", en: "What's the best way to enjoy memes?" },
    clue: {
      ko: "정답은 하나지만, 당신의 선택은 결과에도 살짝 흔적을 남깁니다.",
      en: "There's one correct answer, but your choice also leaves a small mark on the result.",
    },
    mood: { ko: "최종 라운드", en: "Final round" },
    answers: [
      answer("a", { ko: "시대별 말투와 플랫폼을 구분하며 보기", en: "Telling apart the tone and platform of each era" }, { ko: "밈 연대기형", en: "Meme-chronicler type" }, "early", true, { ko: "정답! 이 테스트의 핵심은 시대 문법을 구분하는 감각이에요.", en: "Correct! The heart of this test is the sense for telling era grammars apart." }),
      answer("b", { ko: "좋아하는 감성만 저장하기", en: "Saving only the vibes you love" }, { ko: "추억 보관형", en: "Nostalgia-keeper type" }, "cyworld", false, { ko: "좋은 방식이지만 퀴즈 정답은 시대 구분 쪽입니다.", en: "A nice approach, but the quiz answer is telling eras apart." }),
      answer("c", { ko: "친구한테 바로 보내고 반응 보기", en: "Sending it to a friend and watching their reaction" }, { ko: "전파형", en: "Spreader type" }, "community2010", false, { ko: "밈답지만, 이번 라운드는 인식 능력 체크예요.", en: "Very meme of you, but this round checks recognition." }),
      answer("d", { ko: "이상하면 일단 웃기", en: "If it's weird, just laugh first" }, { ko: "미래 적응형", en: "Future-adapter type" }, "ai", false, { ko: "좋은 자세지만, 정답은 시대 구분입니다.", en: "Good attitude, but the answer is telling eras apart." }),
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
