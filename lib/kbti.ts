// ═══════════════════════════════════════════════════════════
// KBTI — Korean-meme Personality Test (single universal flow)
// 20 questions · 21 types (incl. hidden 치맥) · 10 dimensions
// ═══════════════════════════════════════════════════════════

export type Dimension =
  | "action"
  | "avoid"
  | "nunchi"
  | "energy"
  | "perfection"
  | "reality"
  | "emotion"
  | "planning"
  | "obsession"
  | "justify";

export type Level = "L" | "M" | "H";
export type Category = "daily" | "relationship" | "self";

export type Choice = {
  ko: string;
  en: string;
  effects: { dim: Dimension; level: Level }[];
};

export type Question = {
  ko: string;
  en: string;
  choices: [Choice, Choice, Choice];
};

export type KbtiTypeText = {
  code: string;
  title: string;
  oneliner: string;
  detail: string;
  strengths: string;
  watchOut: string;
  howOthersSee: string;
  /** 이런 상황에서 빛납니다 — concrete scenarios where this type wins. */
  shines: string;
  /** 한마디 — closing line, ambiguous between comfort and a final jab. */
  closing: string;
};

export type KbtiType = {
  id: string;
  emoji: string;
  category: Category;
  ko: KbtiTypeText;
  en: KbtiTypeText;
  match: { dim: Dimension; level: Level }[];
};

const eff = (dim: Dimension, level: Level) => ({ dim, level });

// ═══════════════════════════════════════════════════════════
// Questions (20)
// ═══════════════════════════════════════════════════════════

export const QUESTIONS: Question[] = [
  {
    ko: "카톡이 왔다. 읽었다. 지금 나는:",
    en: "A KakaoTalk message arrived. You read it. Now you:",
    choices: [
      {
        ko: "바로 답장한다. 안 읽은 게 더 불편",
        en: "Reply immediately. Unread is worse than reply.",
        effects: [eff("action", "H")],
      },
      {
        ko: "나중에 하려다 결국 까먹는다",
        en: "Plan to reply later. Eventually forget.",
        effects: [eff("justify", "M")],
      },
      {
        ko: "그냥 안 한다. 볼 때 됐으면 연락 온다",
        en: "Just don't. If urgent, they'll reach out again.",
        effects: [eff("avoid", "H")],
      },
    ],
  },
  {
    ko: "배달 앱을 열었다:",
    en: "You opened the delivery app:",
    choices: [
      {
        ko: "먹고 싶은 거 바로 시킨다",
        en: "Order what you want immediately.",
        effects: [eff("action", "H")],
      },
      {
        ko: "30분 고민하다 그냥 닫는다",
        en: "Browse 30 minutes, close it.",
        effects: [eff("perfection", "H")],
      },
      {
        ko: "고민하다 지쳐서 라면 끓인다",
        en: "Get tired browsing, boil ramen instead.",
        effects: [eff("avoid", "H")],
      },
    ],
  },
  {
    ko: "오늘 하기로 한 일이 있다. 근데 하기 싫다:",
    en: "Something you planned to do today. You don't feel like it:",
    choices: [
      {
        ko: "그냥 한다. 미루면 더 힘들어짐",
        en: "Just do it. Procrastinating only makes it worse.",
        effects: [eff("action", "H")],
      },
      {
        ko: "조금 있다 하려다 자정이 됐다",
        en: "Plan to start in a bit. Suddenly midnight.",
        effects: [eff("justify", "H")],
      },
      {
        ko: "내일의 나에게 맡긴다",
        en: "Leave it to tomorrow-me.",
        effects: [eff("justify", "H")],
      },
    ],
  },
  {
    ko: "약속 시간 10분 전이다. 나는:",
    en: "10 minutes before the meetup. You:",
    choices: [
      {
        ko: "이미 도착해서 기다리는 중",
        en: "Already there, waiting.",
        effects: [eff("planning", "H")],
      },
      {
        ko: "지금 출발하는 중 (항상 이 타이밍)",
        en: "Just leaving now (always this exact timing).",
        effects: [eff("justify", "H")],
      },
      {
        ko: "아직 집에 있다",
        en: "Still at home.",
        effects: [eff("reality", "L")],
      },
    ],
  },
  {
    ko: "유튜브를 켰다. 한 개만 보려 했는데:",
    en: "Opened YouTube. Was going to watch just one:",
    choices: [
      {
        ko: "딱 한 개 보고 껐다",
        en: "Watched one, closed it.",
        effects: [eff("action", "H")],
      },
      {
        ko: "보다 보니 2시간이 지났다",
        en: "Two hours later…",
        effects: [eff("obsession", "M")],
      },
      {
        ko: "알고리즘이 나를 새벽까지 데려갔다",
        en: "The algorithm took me until dawn.",
        effects: [eff("obsession", "H")],
      },
    ],
  },
  {
    ko: "운동을 시작하려 한다:",
    en: "About to start working out:",
    choices: [
      {
        ko: "이미 하고 있다",
        en: "Already doing it.",
        effects: [eff("action", "H")],
      },
      {
        ko: "다음 달부터 헬스장 끊을 예정",
        en: "Joining the gym next month.",
        effects: [eff("justify", "H")],
      },
      {
        ko: "생각만 3년째 한다",
        en: "Three years of just thinking about it.",
        effects: [eff("reality", "L")],
      },
    ],
  },
  {
    ko: "단톡방에 갑자기 정적이 흘렀다:",
    en: "The group chat goes silent:",
    choices: [
      {
        ko: "눈치채고 조용히 있는다",
        en: "Read the mood and stay quiet.",
        effects: [eff("nunchi", "H")],
      },
      {
        ko: "뭔가 올려서 분위기 바꾼다",
        en: "Drop something to liven it up.",
        effects: [eff("energy", "H")],
      },
      {
        ko: "눈치 못 채고 영상 링크 공유했다",
        en: "Don't notice. Share a random video link.",
        effects: [eff("nunchi", "L")],
      },
    ],
  },
  {
    ko: "친구가 솔직한 의견을 물었다. 말하면 상처받을 것 같다:",
    en: "A friend asks for an honest opinion. Honesty would sting:",
    choices: [
      {
        ko: "솔직하게 말한다. 그게 진짜 친구",
        en: "Tell the truth. That's what real friends do.",
        effects: [eff("emotion", "H")],
      },
      {
        ko: "돌려서 말한다",
        en: "Soften it.",
        effects: [eff("nunchi", "M")],
      },
      {
        ko: "\"좋은 것 같은데?\" 한다",
        en: "\"Looks good I guess?\"",
        effects: [eff("avoid", "H")],
      },
    ],
  },
  {
    ko: "오늘 하루가 너무 힘들었다. 나는:",
    en: "Hard day. You:",
    choices: [
      {
        ko: "혼자 있으면서 충전한다",
        en: "Recharge alone.",
        effects: [eff("energy", "L")],
      },
      {
        ko: "친구한테 털어놓는다",
        en: "Vent to a friend.",
        effects: [eff("emotion", "H")],
      },
      {
        ko: "먹는다",
        en: "Eat.",
        effects: [eff("justify", "M")],
      },
    ],
  },
  {
    ko: "새벽 2시다. 내일 중요한 일이 있다:",
    en: "It's 2AM. Big day tomorrow:",
    choices: [
      {
        ko: "당연히 잔다. 컨디션이 중요",
        en: "Sleep, obviously. Condition matters.",
        effects: [eff("planning", "H")],
      },
      {
        ko: "조금만 더 하다 자려는데 어느새 4시",
        en: "Just a bit more… suddenly 4AM.",
        effects: [eff("justify", "H")],
      },
      {
        ko: "밤새운다. 어차피 잠이 안 온다",
        en: "All-nighter. Couldn't sleep anyway.",
        effects: [eff("reality", "L")],
      },
    ],
  },
  {
    ko: "하고 싶은 말이 있다. 근데 말하기 어렵다:",
    en: "You have something to say. But it's hard:",
    choices: [
      {
        ko: "그냥 말한다. 안 하면 더 답답",
        en: "Just say it. Bottling up is worse.",
        effects: [eff("emotion", "H")],
      },
      {
        ko: "돌려서 말하다 결국 못 한다",
        en: "Try to soften it, end up saying nothing.",
        effects: [eff("nunchi", "M")],
      },
      {
        ko: "집에 와서 혼자 시뮬레이션 10번 돌린다",
        en: "Run 10 mental simulations at home.",
        effects: [eff("avoid", "H")],
      },
    ],
  },
  {
    ko: "계획이 갑자기 취소됐다:",
    en: "Plans got cancelled at the last minute:",
    choices: [
      {
        ko: "아쉽지만 다음 계획 세운다",
        en: "Bummer, but make a new plan.",
        effects: [eff("planning", "H")],
      },
      {
        ko: "사실 내심 좋다. 집에 있을 수 있다",
        en: "Secretly thrilled. Get to stay home.",
        effects: [eff("energy", "L")],
      },
      {
        ko: "멍하니 있다가 배달 시킨다",
        en: "Stare at the wall, order delivery.",
        effects: [eff("reality", "L")],
      },
    ],
  },
  {
    ko: "내가 실수를 했다:",
    en: "You made a mistake:",
    choices: [
      {
        ko: "바로 인정하고 사과한다",
        en: "Own it. Apologize immediately.",
        effects: [eff("emotion", "H")],
      },
      {
        ko: "상황 설명을 먼저 한다",
        en: "Explain the situation first.",
        effects: [eff("nunchi", "M")],
      },
      {
        ko: "어쩔 수 없었다고 생각한다",
        en: "Decide there was nothing you could've done.",
        effects: [eff("justify", "H")],
      },
    ],
  },
  {
    ko: "SNS를 열었다:",
    en: "Opened social media:",
    choices: [
      {
        ko: "목적 있을 때만 본다",
        en: "Only when there's a purpose.",
        effects: [eff("action", "H")],
      },
      {
        ko: "보다 보니 1시간이 지났다",
        en: "An hour later…",
        effects: [eff("obsession", "M")],
      },
      {
        ko: "하루에 수십 번 새로고침한다",
        en: "Refresh dozens of times a day.",
        effects: [eff("obsession", "H")],
      },
    ],
  },
  {
    ko: "누군가 나한테 화가 난 것 같다:",
    en: "Someone seems upset with you:",
    choices: [
      {
        ko: "직접 물어본다. 확인해야 함",
        en: "Ask directly. Need to confirm.",
        effects: [eff("emotion", "H")],
      },
      {
        ko: "눈치 보면서 상황 살핀다",
        en: "Watch their reactions, gauge it.",
        effects: [eff("nunchi", "H")],
      },
      {
        ko: "모른 척한다. 알아서 풀리겠지",
        en: "Pretend not to notice. It'll resolve.",
        effects: [eff("avoid", "H")],
      },
    ],
  },
  {
    ko: "새해 목표를 세웠다. 지금은:",
    en: "About those New Year resolutions:",
    choices: [
      {
        ko: "잘 지키고 있다",
        en: "Sticking to them.",
        effects: [eff("planning", "H")],
      },
      {
        ko: "2월에 이미 수정했다",
        en: "Adjusted them by February.",
        effects: [eff("justify", "H")],
      },
      {
        ko: "세웠었는지도 기억이 가물가물하다",
        en: "Don't really remember setting them.",
        effects: [eff("reality", "L")],
      },
    ],
  },
  {
    ko: "잠들기 전 폰을 본다:",
    en: "Phone use before sleep:",
    choices: [
      {
        ko: "안 본다. 수면이 중요",
        en: "Don't. Sleep matters.",
        effects: [eff("action", "H")],
      },
      {
        ko: "조금만 보다 자려는데 새벽이 됐다",
        en: "Just a bit more… suddenly dawn.",
        effects: [eff("obsession", "H")],
      },
      {
        ko: "이게 수면 루틴이다",
        en: "This is my sleep routine.",
        effects: [eff("justify", "H")],
      },
    ],
  },
  {
    ko: "거울을 봤다:",
    en: "Looked in the mirror:",
    choices: [
      {
        ko: "오늘도 나쁘지 않다",
        en: "Not bad today.",
        effects: [eff("reality", "H")],
      },
      {
        ko: "살 좀 빼야 하는데... (매일 이 생각)",
        en: "Should lose weight… (daily thought).",
        effects: [eff("justify", "H")],
      },
      {
        ko: "빠르게 지나친다",
        en: "Walk past quickly.",
        effects: [eff("avoid", "H")],
      },
    ],
  },
  {
    ko: "갑자기 '나 지금 뭐 하고 있지' 생각이 든다:",
    en: "Suddenly: \"What am I even doing?\"",
    choices: [
      {
        ko: "거의 없다. 지금 잘 하고 있음",
        en: "Rarely. Doing fine right now.",
        effects: [eff("reality", "H")],
      },
      {
        ko: "가끔 온다. 금방 털어낸다",
        en: "Sometimes. Shake it off quickly.",
        effects: [eff("reality", "M")],
      },
      {
        ko: "하루에 3번 이상 온다",
        en: "More than three times a day.",
        effects: [eff("reality", "L")],
      },
    ],
  },
  {
    ko: "이 테스트를 하는 이유:",
    en: "Why are you taking this test?",
    choices: [
      {
        ko: "진짜로 나를 알고 싶어서",
        en: "Genuinely want to know myself.",
        effects: [eff("perfection", "H")],
      },
      {
        ko: "심심해서",
        en: "Bored.",
        effects: [eff("reality", "M")],
      },
      {
        ko: "하다 보니 여기까지 왔다",
        en: "Got here somehow.",
        effects: [eff("justify", "H")],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

export const TYPES: KbtiType[] = [
  // ─── Daily (14) ───────────────────────────────────────
  {
    id: "nuppro",
    emoji: "🛌",
    category: "daily",
    ko: {
      code: "눕프로",
      title: "The 누워서 프로",
      oneliner:
        "누워있다.\n근데 핸드폰으로 다 한다.\n쇼핑, 업무, 인간관계.\n이게 효율이다.\n일어날 이유가 없다.",
      detail:
        "당신에게 수평은 삶의 기본값이에요.\n누워서 못 하는 일이 없어요.\n배달 주문, 카톡 답장, 회의 참석.\n심지어 운동도 누워서 하는 방법을 찾아요.\n'일어나면 더 잘할 수 있을 것 같은데'\n라는 생각은 누워서 해요.",
      strengths:
        "재택근무 시대의 진정한 승자예요.\n이동 에너지를 아껴서\n생각에 집중할 수 있어요.\n누워있는 동안 아이디어가 나와요.",
      watchOut: "허리요.",
      howOthersSee:
        "항상 누워있는데\n왜인지 다 되어있어요.\n비결이 뭔지 아무도 몰라요.",
      shines:
        "재택근무 시대요. 회의도, 보고도, 업무도 누워서. 카메라 끄고 잘만 돌아가요.\n장마, 한파, 미세먼지 — 밖에 안 나가는 게 정답인 날들. 당신은 이미 정답을 알고 있어요.\n팬데믹 격리 같은 상황? 그냥 평소처럼 살면 돼요. 변할 게 없어요.",
      closing:
        "일어날 필요가 없으면 일어나지 마세요.\n근데 가끔은 햇빛 좀 보세요. 식물도 광합성을 해요.",
    },
    en: {
      code: "NUP-PRO",
      title: "The Horizontal Pro",
      oneliner:
        "Lying down.\nBut handling everything on the phone.\nShopping, work, relationships.\nThis is efficiency.\nNo reason to get up.",
      detail:
        "Horizontal is your default state.\nThere's nothing you can't do lying down.\nFood orders, messages, even meetings.\nYou've found a way to exercise lying down too.\nThe thought 'I could do more if I got up'\nalso happens while lying down.",
      strengths:
        "The true winner of the remote work era.\nSaving movement energy for thinking.\nIdeas come while lying down.",
      watchOut: "Your back.",
      howOthersSee:
        "Always lying down\nbut somehow everything gets done.\nNo one knows how.",
      shines:
        "The remote-work era. Meetings lying down, reports lying down, work lying down. Camera off, runs fine.\nMonsoon, cold snaps, fine-dust days — when staying inside is the right answer, you already knew.\nPandemic isolation? Keep living normally. Nothing changes for you.",
      closing:
        "If you don't need to get up, don't.\nBut step into sunlight sometimes — even plants photosynthesize.",
    },
    match: [eff("action", "L"), eff("avoid", "H"), eff("justify", "H")],
  },
  {
    id: "mujichul",
    emoji: "🏦",
    category: "daily",
    ko: {
      code: "무지출",
      title: "The 무지출 챌린저",
      oneliner:
        "오늘도 무지출이다.\n어제도 무지출이었다.\n그저께는 편의점 갔는데\n거기서 1500원 썼다.\n그날은 실패한 날이다.",
      detail:
        "당신에게 소비는 전쟁이에요.\n무지출 달성한 날은\n무언가를 이긴 것 같은 기분이에요.\n근데 그 기분을 자축하려다가\n뭔가 사게 돼요.\n그래서 내일 다시 무지출 챌린지를 해요.",
      strengths:
        "진짜 위기 상황에서 당신은 안 무너져요.\n평소에 아껴놨으니까요.\n경제 관념이 확실해서\n나중에 남들이 후회할 때\n당신만 안 후회해요.",
      watchOut:
        "무지출이 목표가 되면\n삶의 질이 같이 0원이 될 수 있어요.\n가끔은 써도 돼요. 진짜로요.",
      howOthersSee:
        "밥 먹자고 하면 '나 오늘 무지출인데'\n라고 해서 같이 밥 못 먹어요.\n근데 당신 통장은 부러워요.",
      shines:
        "월말이 다가올 때. 다들 통장 잔고 보고 한숨 쉴 때 당신만 여유로워요.\n금리 인상기, 경제 불황기. 남들 허리띠 졸라매기 시작할 때 당신은 이미 졸라매고 살아왔어요. 적응할 게 없어요.\n비상금이 필요한 순간. 당신은 늘 가지고 있어요.",
      closing:
        "통장 잔고는 늘어나는데, 인생의 잔고는 어떤가요?",
    },
    en: {
      code: "MU-JI-CHUL",
      title: "The Zero-Spend Challenger",
      oneliner:
        "Zero spending today.\nZero spending yesterday.\nDay before, went to the convenience store.\nSpent 1,500 won.\nThat was a failed day.",
      detail:
        "Spending is a war for you.\nDays with zero spending feel like a victory.\nBut celebrating that feeling\nleads to buying something.\nSo tomorrow you start the challenge again.",
      strengths:
        "In real financial crises, you don't break.\nBecause you've been saving all along.\nWhen others regret their spending,\nyou won't.",
      watchOut:
        "When zero spending becomes the goal,\nquality of life can also go to zero.\nIt's okay to spend sometimes. Really.",
      howOthersSee:
        "When we suggest food you say\n'I'm doing zero spending today'\nso we can't eat together.\nBut we're jealous of your bank account.",
      shines:
        "End of the month. Everyone else stares at their bank balance — you stay calm.\nRate hikes, recession. While others tighten their belts, your belt has been tight forever. Nothing to adapt to.\nWhen emergency cash matters, you always have it.",
      closing:
        "Your account balance keeps growing.\nWhat about your life's balance?",
    },
    match: [eff("planning", "H"), eff("justify", "H"), eff("obsession", "H")],
  },
  {
    id: "njob",
    emoji: "💼",
    category: "daily",
    ko: {
      code: "N잡",
      title: "The N잡러",
      oneliner:
        "본업이 있다.\n부업이 있다.\n부부업이 있다.\n부부부업을 알아보는 중이다.\n잠은 나중에 자면 된다.",
      detail:
        "당신의 시간표는\n일반인이 보면 숨이 막혀요.\n오전엔 본업, 오후엔 프리랜서,\n저녁엔 유튜브 편집, 새벽엔 블로그.\n왜 이렇게 사냐고요?\n월급이 너무 적거든요.\n아니면 불안하거든요.\n아마 둘 다일 거예요.",
      strengths:
        "경기가 나빠져도 당신은 괜찮아요.\n수입원이 여러 개니까요.\n한 가지가 흔들려도\n다른 게 받쳐줘요.\n그 사실이 당신을 자게 해줘요.",
      watchOut:
        "몸이 자본이에요.\n번아웃 오면 N잡 다 망가져요.\n가끔은 아무것도 안 하는 날이\n가장 생산적인 날이에요.",
      howOthersSee:
        "'요즘 뭐해?'라고 물으면\n대답이 너무 길어서\n듣다가 지쳐요.\n근데 대단하긴 해요.",
      shines:
        "회사가 갑자기 망했어요. 일반인은 멘붕인데 당신은 '아, 다른 거 더 키우면 되겠네'예요. 충격이 작아요.\n특정 분야가 사양산업이 됐을 때. 당신은 다른 발이 두 개나 더 있어요. 환승이 빨라요.\n경제 전체가 흔들리는 시기. 분산이 정답인 시대예요. 당신은 이미 그 답대로 살고 있어요.",
      closing:
        "다 잘하고 있어요.\n잠도 잘 자고 있나요?",
    },
    en: {
      code: "N-JOB",
      title: "The Multi-Hyphenate",
      oneliner:
        "Main job: yes.\nSide job: yes.\nSide-side job: yes.\nResearching another one.\nSleep can wait.",
      detail:
        "Your schedule makes normal people\nfeel suffocated just looking at it.\nMorning: main job. Afternoon: freelance.\nEvening: YouTube editing. Dawn: blog.\nWhy live like this?\nThe salary is too low.\nOr you're anxious about the future.\nProbably both.",
      strengths:
        "When the economy gets bad, you're okay.\nMultiple income streams.\nIf one shakes, others hold.\nThat's what lets you sleep.",
      watchOut:
        "Your body is your capital.\nBurnout breaks all the jobs at once.\nSometimes a day of nothing\nis the most productive day.",
      howOthersSee:
        "When we ask 'what are you up to lately'\nthe answer is so long\nwe get tired listening.\nBut it's genuinely impressive.",
      shines:
        "Your main job suddenly collapses. Normal people panic — you think 'okay, I'll grow the others.' The hit is small.\nWhen one industry sunsets, you've already got two more legs. Fast pivot.\nWhen the whole economy shakes, diversification is the answer. You've been living that answer.",
      closing:
        "You're doing it all.\nBut are you sleeping?",
    },
    match: [eff("action", "H"), eff("obsession", "H"), eff("planning", "H")],
  },
  {
    id: "nuwo",
    emoji: "🛏️",
    category: "daily",
    ko: {
      code: "누워",
      title: "The 수평 라이프",
      oneliner: "3시간째인데 알고리즘이 날 잡았다.",
      detail:
        "당신은 눕는 순간 세계와 계약을 맺어요.\n처음엔 잠깐 쉬려는 거예요. 진짜로요.\n근데 폰을 집어드는 순간, 혹은\n유튜브 자동재생이 시작되는 순간,\n당신은 이미 다른 시간대로 넘어간 거예요.\n\n3시간이 5분처럼 느껴지는 그 감각.\n일어나야 한다는 걸 알면서도\n'다음 영상만 보고'를 반복하는 그 패턴.\n이건 게으른 게 아니에요. 뇌가\n즉각적인 보상에 반응하는 거예요.\n문제는 그 보상이 아무것도 남기지\n않는다는 거예요.\n\n하루가 끝날 때 '오늘 뭐 했지?' 하는\n그 공허함을 알고 있죠?\n그게 누적되면 무거워집니다.",
      strengths:
        "진짜로 쉬어야 할 타이밍을\n본능적으로 알아요. 억지로 뭔가를\n하다가 번아웃 나는 사람들이 있는데\n당신은 그런 경우가 적어요.\n그리고 누워서도 생각이 많아서\n뜻밖의 아이디어가 나오기도 해요.",
      watchOut:
        "폰을 손에 들고 눕지 마세요.\n정말로요. 충전 코드를 침대에서\n멀리 두는 것만으로 패턴이 바뀌어요.\n알고리즘은 당신을 위해 설계된 게\n아니에요. 당신의 시간을 먹으려고\n설계된 거예요.",
      howOthersSee:
        "연락하면 잘 받는데 먼저 연락은\n잘 안 해요. 약속을 잡으면 나타나는데\n주도적으로 잡지는 않아요.\n있어도 그만 없어도 그만처럼 보일 수 있는데\n실제로는 그렇지 않잖아요.",
      shines:
        "장마철, 한파, 폭설. 밖에 안 나가는 게 합리적인 모든 날에 당신은 가장 효율적이에요.\n명절 같은 가족 이벤트 — '자고 있다'가 가장 안전한 핑계예요. 자연스럽게 써요.\n번아웃 직전 신호를 빨리 잡아채요. 일어나지 않는 게 답일 때를 본능적으로 알아요.",
      closing:
        "쉬는 것도 능력이에요.\n근데 매일은 그냥 누워있는 거예요.",
    },
    en: {
      code: "NU-WO",
      title: "The Horizontal Life",
      oneliner: "Hour 3. The algorithm has me.",
      detail:
        "The moment you lie down,\nyou make a contract with the universe.\nAt first, you just want a short break.\nReally. But the moment you pick up\nyour phone or the autoplay starts,\nyou've already crossed into a different\ntimezone.\n\nThree hours feeling like five minutes.\nKnowing you need to get up but\ndoing 'just one more video' on repeat.\nThis isn't laziness — your brain is\nresponding to immediate rewards.\nThe problem is those rewards\nleave nothing behind.\n\nYou know that emptiness at the end\nof the day when you think 'what did I\nactually do?' That accumulates.",
      strengths:
        "You instinctively know when\nyou truly need rest. Some people push\nthrough until burnout — you rarely do.\nAnd lying down with a busy mind\nsometimes produces unexpected ideas.",
      watchOut:
        "Don't lie down with your phone.\nSeriously. Just putting the charger\naway from the bed changes the pattern.\nThe algorithm wasn't designed for you.\nIt was designed to consume your time.",
      howOthersSee:
        "You respond when contacted\nbut rarely initiate. You show up when\nplans are made but don't make them.\nYou might come across as indifferent,\nbut that's not really who you are.",
      shines:
        "Monsoon, cold snaps, blizzards. On every day when staying in is rational, you live most efficiently.\nFamily holidays — 'sleeping' is the safest excuse. It comes naturally to you.\nYou catch pre-burnout signals early. You instinctively know when not getting up is the answer.",
      closing:
        "Resting is a skill.\nBut every day is just lying down.",
    },
    match: [eff("action", "L"), eff("avoid", "H"), eff("justify", "H")],
  },
  {
    id: "iksip",
    emoji: "📵",
    category: "daily",
    ko: {
      code: "읽씹",
      title: "The 읽씹 마스터",
      oneliner: "읽었다. 그리고 잊었다. 미안하다. 또 한다.",
      detail:
        "당신은 카톡을 읽는 순간\n머릿속에서 뭔가를 합니다.\n답장을 구성하거나, 나중에 해야지\n생각하거나, 지금 당장은 에너지가\n없다고 느끼거나. 그 결과가\n읽씹이에요.\n\n악의는 없어요. 진짜로요.\n근데 받는 사람 입장에서는\n'내가 뭔가 잘못했나?', '무시당한 건가?',\n'왜 읽고 안 해?' 30분을 고민하게 만들어요.\n\n특히 가까운 사람일수록 더 읽씹을\n많이 하는 경향이 있어요.\n편하니까요. 근데 그 편함이\n상대방에겐 상처가 될 수 있어요.",
      strengths:
        "답장할 때는 진심을 담아요.\n빠르게 형식적으로 보내는 사람보다\n늦게 보내더라도 의미 있는 말을 하는\n경우가 많아요. 그 무게감을\n알아보는 사람들이 있어요.",
      watchOut:
        "읽은 순간 30초만 써서 보내는 연습을\n해보세요. 완벽한 답장이 아니어도 돼요.\n'ㅇㅇ 나중에 자세히 얘기하자'도\n충분해요. 읽었다는 신호만으로도\n상대방은 안심합니다.",
      howOthersSee:
        "당신 친구들은 이미 알고 있어요.\n'얘는 원래 그래'라고 이해하는 척하지만\n가끔은 진짜 서운합니다.\n그 서운함을 말하지 않는 게\n당신을 더 이해해주는 거예요.",
      shines:
        "단톡방 200명짜리 회사 그룹챗요. 알람 무음 + 읽씹 콤보로 정신 건강을 지킬 수 있어요. 답해야 할 사람만 답해도 돼요.\n진짜 중요한 일만 골라낼 수 있어요. 모든 메시지에 휘둘리지 않아요.\n장기 프로젝트, 즉답이 안 중요한 일에서 깊이 있는 결과물이 나와요.",
      closing:
        "답장은 늦게라도 하긴 해요.\n그게 당신 나름의 사랑이에요.",
    },
    en: {
      code: "IK-SSIP",
      title: "The Read-and-Ignore Master",
      oneliner: "Read it. Forgot to reply. Sorry. Will do it again.",
      detail:
        "The moment you read a message,\nsomething happens in your head.\nYou compose a reply mentally, think\n'I'll do it later,' or feel like you\ndon't have the energy right now.\nThe result is leaving them on read.\n\nNo malice. Genuinely.\nBut for the person waiting, it means\n30 minutes of 'did I do something wrong?'\n'Am I being ignored?' 'Why read and not reply?'\n\nYou tend to ghost the people closest to you\nmost often. Because they feel safe.\nBut that safety can become a wound for them.",
      strengths:
        "When you do reply, you mean it.\nMore often than not, your late replies\ncarry more weight than others' quick,\nhollow ones. Some people notice that.",
      watchOut:
        "Try spending just 30 seconds replying\nthe moment you read it.\nIt doesn't have to be perfect.\n'Yeah let's talk more later' is enough.\nJust signaling that you saw it\nis enough to ease their mind.",
      howOthersSee:
        "Your friends already know.\nThey say 'that's just how they are'\nand pretend to understand,\nbut sometimes they're genuinely hurt.\nThe fact that they don't say it\nis them being extra understanding of you.",
      shines:
        "Coworker group chats with 200 people. Mute + read-and-ignore combo protects your mental health. The right people will reply.\nYou filter what's actually important. Not pulled by every notification.\nLong-haul projects where instant reply doesn't matter — that's where your depth shows.",
      closing:
        "You do reply eventually.\nThat's love, in your own way.",
    },
    match: [eff("avoid", "H"), eff("emotion", "L"), eff("action", "L")],
  },
  {
    id: "ppalli",
    emoji: "⚡",
    category: "daily",
    ko: {
      code: "빨리",
      title: "The 빨리빨리 인간",
      oneliner: "엘리베이터 닫힘 버튼 연타. 본인도 늦음.",
      detail:
        "당신의 몸은 항상 현재보다\n한 발 앞서 있어요. 걸을 때는\n앞사람이 느리고, 기다릴 때는\n시간이 느리고, 누군가 설명할 때는\n요점이 너무 늦게 나와요.\n\n이 빠름이 많은 것을 가능하게 해줬어요.\n남들이 망설일 때 이미 행동했고,\n남들이 준비할 때 이미 끝냈어요.\n\n근데 아이러니하게도 당신 자신은\n종종 늦어요. 빠르게 살면서도\n약속 시간은 늘 빠듯하고,\n중요한 걸 놓치고 나서야 알게 되는\n경우도 있어요. 속도가 빠른 게 아니라\n마음이 급한 거거든요.",
      strengths:
        "위기 상황에서 진가가 나와요.\n남들이 패닉할 때 당신은 이미 움직이고 있어요.\n결단력이 필요한 순간, 빠른 판단이 필요한 순간,\n당신을 이길 수 있는 사람이 많지 않아요.",
      watchOut:
        "빠름이 놓치게 만드는 것들이 있어요.\n대화 중 상대방이 아직 말하는데\n이미 대답을 준비하고 있진 않나요?\n듣는 척하면서 다음 할 말을 생각하는 것,\n그게 관계에서 가장 큰 문제가 돼요.",
      howOthersSee:
        "함께 있으면 에너지가 넘치고 믿음직해요.\n근데 가끔 같이 있으면 피곤합니다.\n당신의 속도를 따라가는 게\n버거운 사람들이 있어요.\n천천히 걸어도 괜찮은 날이 있어요.",
      shines:
        "응급실, 콜센터, 라이브 방송 — 1초의 망설임이 손해인 자리에서 당신은 본능이에요.\n버스 환승 1분 남았을 때, 당신만 도착해요.\n새 메뉴, 새 트렌드, 새 기술 — 남들 망설일 때 당신은 이미 시도하고 있어요.",
      closing:
        "빠른 게 죄는 아니에요.\n근데 가끔은 천천히 가도 돼요. 인생은 길어요.",
    },
    en: {
      code: "PPALLI",
      title: "The Hurry-Up Human",
      oneliner: "Mashing the close button. Also always late.",
      detail:
        "Your body is always one step ahead\nof the present. Walking, everyone else\nis too slow. Waiting, time itself\nis too slow. When someone explains\nsomething, they're taking too long\nto get to the point.\n\nThis speed has enabled a lot.\nYou acted when others hesitated,\nfinished when others were still preparing.\n\nBut ironically, you're often late yourself.\nLiving fast but always cutting it close,\nsometimes missing what matters\nuntil after it's gone.\nIt's not that you're fast —\nyou're just always in a rush.",
      strengths:
        "Your true value shows in crises.\nWhile others panic, you're already moving.\nIn moments requiring quick decisions\nor fast judgment, few can match you.",
      watchOut:
        "Speed makes you miss things.\nIn conversations, are you already\npreparing your response while they're\nstill talking? Pretending to listen\nwhile planning what to say next —\nthat's your biggest relationship issue.",
      howOthersSee:
        "Being around you feels energetic\nand reliable. But sometimes exhausting.\nSome people struggle to match your pace.\nIt's okay to walk slowly sometimes.",
      shines:
        "ER, call center, live broadcast — places where one second of hesitation costs. You become pure instinct.\nOne minute to bus transfer? Only you make it.\nNew menus, trends, tech — while others hesitate, you're already trying it.",
      closing:
        "Fast isn't a sin.\nBut it's okay to slow down sometimes. Life is long.",
    },
    match: [eff("action", "H"), eff("nunchi", "L"), eff("perfection", "L")],
  },
  {
    id: "jamsu",
    emoji: "🌊",
    category: "daily",
    ko: {
      code: "잠수",
      title: "The 잠수함",
      oneliner: "살아있다. 그냥 사람이 싫어졌다.",
      detail:
        "당신에게 잠수는 선택이 아니라\n필요예요. 사람들과 함께 있다 보면\n어느 순간 에너지가 바닥나는 게 느껴지고,\n그 순간 모든 연락이 버겁게 느껴져요.\n\n사라지는 게 가장 쉬운 해결책이에요.\n설명하지 않아도 되고,\n이해시키지 않아도 되고,\n그냥 존재하지 않으면 되니까요.\n\n문제는 돌아왔을 때예요.\n아무것도 아닌 척 'ㅋㅋ 나 살아있어'로\n돌아오지만, 당신이 없는 동안\n걱정했던 사람들의 마음을\n잘 모르는 것 같아요.",
      strengths:
        "혼자만의 시간에 정말 깊이 생각해요.\n그 시간에서 나온 아이디어나 결정이\n다른 사람들보다 더 단단한 경우가 많아요.\n자기 자신을 잘 아는 사람이에요.",
      watchOut:
        "잠수 전에 짧게라도 말해줘요.\n'좀 쉬어야 할 것 같아'라는 한 마디가\n2주간의 걱정을 막아줘요.\n설명 전부 안 해도 돼요. 신호만 줘도 돼요.",
      howOthersSee:
        "당신을 좋아하는 사람들은\n당신의 잠수를 '또 그러네'하면서도\n기다려요. 근데 그 기다림에도\n한계가 있어요. 당신이 소중하다면\n그 사람들도 소중하게 대해줘요.",
      shines:
        "관계가 너무 꼬였을 때, 잠수가 모두에게 가장 덜 상처 가는 선택일 때가 있어요. 당신은 그 분기점을 본능적으로 알아요.\n혼자 회복돼야 하는 종류의 인간이에요. 며칠 사라졌다 돌아오는 게 길게 보면 더 건강해요.\n극도의 스트레스 상황. 당신의 잠수 본능이 번아웃을 막아줘요.",
      closing:
        "당신은 사라진 게 아니에요. 충전 중이에요.\n근데 누가 그걸 알아요?",
    },
    en: {
      code: "JAM-SU",
      title: "The Submarine",
      oneliner: "Still alive. Just needed to avoid everyone.",
      detail:
        "For you, disappearing isn't a choice —\nit's a need. Being around people drains\nyou to a point where every notification\nfeels overwhelming.\n\nVanishing is the easiest solution.\nNo explanations needed,\nno need to make anyone understand,\njust stop existing in people's worlds.\n\nThe problem is coming back.\nYou return with a casual 'lol hey I'm alive'\nlike nothing happened, seemingly unaware\nof the worry you left behind.",
      strengths:
        "You think deeply during solitude.\nIdeas and decisions that come out of\nthat time tend to be more solid\nthan most people's. You know yourself well.",
      watchOut:
        "Before disappearing, say something short.\n'I need some time to recharge'\nprevents two weeks of worry.\nYou don't have to explain everything.\nJust give a signal.",
      howOthersSee:
        "People who care about you\nwait through your disappearances,\nthinking 'there they go again.'\nBut that waiting has limits.\nIf they matter to you, show it.",
      shines:
        "When relationships have tangled too far, ghosting can be the least painful exit for everyone. You know that fork instinctively.\nYou heal alone. Disappearing for days and coming back is healthier long-term.\nExtreme-stress moments — your ghosting instinct prevents burnout.",
      closing:
        "You haven't disappeared. You're recharging.\nBut who knows that?",
    },
    match: [eff("avoid", "H"), eff("energy", "L"), eff("emotion", "L")],
  },
  {
    id: "yashik",
    emoji: "🍗",
    category: "daily",
    ko: {
      code: "야식",
      title: "The 야식 수호자",
      oneliner: "배달비가 문제였다. 결국 3만원 시켰다.",
      detail:
        "밤 11시. 자야 한다는 걸 알아요.\n근데 배가 고파요. 아니, 정확히는\n배가 고픈 건지 심심한 건지\n외로운 건지 잘 모르겠어요.\n그냥 뭔가 먹고 싶어요.\n\n배달 앱을 열어요. 최소 주문 금액이\n1만 5천원이에요. 1만 5천원어치를\n고르다 보니 2만원이 됐어요.\n이왕 이렇게 된 거 하나 더 시켜요.\n3만원이 됐어요. 배달비까지 3만 3천원.\n\n먹으면서 행복해요. 다 먹고 나서\n후회해요. 근데 맛있었어요.\n내일은 안 시키기로 해요.\n내일 밤 11시에 이 생각이 납니다.",
      strengths:
        "당신은 지금 이 순간을 즐길 줄 알아요.\n미래를 너무 걱정하거나\n과거를 너무 곱씹지 않아요.\n야식이 상징하는 그 즉흥성이\n일상을 유연하게 만들어줘요.",
      watchOut:
        "야식의 문제는 음식이 아니에요.\n자기 전 배달을 시키는 순간들을\n잘 살펴보면, 대부분 뭔가 해소되지 않은\n감정이 있을 때예요. 그 감정이 뭔지\n한 번쯤 들여다보는 게 도움이 돼요.",
      howOthersSee:
        "같이 있으면 재밌어요.\n즉흥적이고 지금 이 순간에 충실하거든요.\n'야 치킨 시키자'를 외칠 수 있는\n사람이 주변에 있으면 삶이 풍요로워져요.",
      shines:
        "스트레스가 한계 직전, 야식 한 끼가 진짜 정신 건강을 지켜줘요. 당신은 그 타이밍을 알아요.\n친구가 힘들 때 '치킨 시키자' 한 마디로 분위기를 바꿀 수 있어요. 위로가 되는 사람이에요.\n새벽 감성, 야간 작업, 마감 직전 — 당신의 시간대예요.",
      closing:
        "야식은 당신의 선택이에요. 위장도 당신 거고요.\n둘 다 사랑해주세요.",
    },
    en: {
      code: "YA-SHIK",
      title: "The Late-Night Snack Guardian",
      oneliner: "The delivery minimum was the problem. Ordered 30,000 won worth.",
      detail:
        "11PM. You know you should sleep.\nBut you're hungry. Or maybe bored.\nOr lonely. Hard to tell exactly.\nYou just want something.\n\nOpen the delivery app. Minimum order\nis 15,000 won. Picking items gets you\nto 20,000. Might as well add one more.\n30,000. Plus delivery fee, 33,000.\n\nHappy while eating. Regret after.\nBut it was good.\nDecide not to do it tomorrow.\nRemember this feeling at 11PM tomorrow.",
      strengths:
        "You know how to enjoy the present.\nYou don't over-worry about the future\nor over-analyze the past.\nThat spontaneity, symbolized by\nlate-night snacks, keeps life flexible.",
      watchOut:
        "The issue isn't the food.\nLook carefully at the moments you order\nlate at night — most of the time,\nthere's an unresolved feeling underneath.\nIt's worth looking at what that feeling is.",
      howOthersSee:
        "You're fun to be around.\nSpontaneous and present in the moment.\nHaving someone who can just say\n'let's get chicken' makes life richer.",
      shines:
        "Just before stress hits the limit, one late-night meal genuinely guards mental health. You know that timing.\nWhen a friend's struggling, 'let's order chicken' shifts everything. You're a comforting presence.\nDawn vibes, night shifts, pre-deadline crunch — your timezone.",
      closing:
        "Late-night food is your choice. Your stomach is yours too.\nLove them both.",
    },
    match: [eff("obsession", "H"), eff("justify", "H"), eff("planning", "L")],
  },
  {
    id: "galdeung",
    emoji: "💬",
    category: "daily",
    ko: {
      code: "갈등",
      title: "The 속앓이 전문가",
      oneliner: "할 말이 있다. 집에 와서 혼자 했다.",
      detail:
        "당신 머릿속에는 항상 하지 못한\n말들이 쌓여있어요. 그 자리에서\n말하지 못하고 집에 돌아와서\n혼자 완벽한 대화를 시뮬레이션해요.\n\n'이때 이렇게 말했어야 했는데.'\n'왜 그냥 넘어갔지.'\n'다음엔 꼭 말해야지.'\n\n근데 다음에도 같아요. 상대방 앞에 서면\n그 모든 시뮬레이션이 사라지고\n'ㅇㅋ'나 '아니에요 괜찮아요'가 나와요.\n\n이건 용기 부족이 아니에요.\n상대방이 상처받을까봐,\n분위기가 어색해질까봐,\n관계가 틀어질까봐 생기는 배려예요.\n근데 그 배려가 당신 자신을\n조금씩 지치게 만들고 있어요.",
      strengths:
        "당신이 말하기로 결심했을 때는\n정말 신중하게 고른 말이에요.\n그래서 당신의 말에는 무게가 있어요.\n함부로 내뱉지 않는 사람이라는 걸\n주변에서 알고 있어요.",
      watchOut:
        "참는 게 미덕이 아닐 때가 있어요.\n특히 반복적으로 같은 상황이 생긴다면\n말하지 않는 것이 결국 관계를\n더 크게 망가뜨려요. 완벽하게\n말하지 않아도 돼요. 더듬더듬해도\n말하는 게 훨씬 나아요.",
      howOthersSee:
        "편하고 갈등이 없는 사람이에요.\n근데 가끔 뭘 생각하는지 모르겠다는\n말을 듣지 않나요? 당신이 괜찮다고 해도\n진짜 괜찮은 건지 알 수 없을 때가 있어요.",
      shines:
        "팀 분위기 보존이 중요한 일에서 당신의 참는 능력이 평화를 만들어요.\n복잡한 협상요. 즉시 반응하지 않고 머릿속에서 5수 앞을 보는 사람이 이겨요.\n글로 쓰는 모든 일. 못 한 말이 글로는 너무 잘 써져요. 거기에 진짜 당신이 있어요.",
      closing:
        "참는 거 그만해요.\n한 번만이라도 말해보면 세상은 안 무너져요.",
    },
    en: {
      code: "GAL-DEUNG",
      title: "The Internal Wrestler",
      oneliner: "Had something to say. Said it alone at home.",
      detail:
        "There are always unspoken words\npiling up in your head.\nUnable to say them in the moment,\nyou go home and simulate the perfect\nconversation alone.\n\n'I should have said this.'\n'Why did I just let it go.'\n'Next time I'll definitely say it.'\n\nBut next time is the same.\nStanding in front of them,\nall those simulations vanish and out comes\n'okay' or 'no it's fine.'\n\nThis isn't a lack of courage.\nIt's consideration — fear of hurting them,\nmaking things awkward, damaging the relationship.\nBut that consideration is slowly\nwearing you down.",
      strengths:
        "When you do decide to speak,\nthe words are carefully chosen.\nSo your words carry weight.\nPeople around you know you\ndon't speak carelessly.",
      watchOut:
        "Staying silent isn't always virtuous.\nEspecially when the same situation\nkeeps repeating — not speaking\neventually damages the relationship more.\nYou don't have to say it perfectly.\nStumbling through it is far better\nthan not saying it at all.",
      howOthersSee:
        "You're comfortable to be around —\nno conflict, no drama.\nBut do people sometimes say they can't\ntell what you're thinking?\nEven when you say you're fine,\nit's hard to know if you really are.",
      shines:
        "Where team harmony matters, your endurance creates peace.\nComplex negotiations — the person who doesn't react instantly and thinks five moves ahead wins.\nAnything that lives in writing. The words you couldn't say in person flow perfectly on paper. That's where the real you lives.",
      closing:
        "Stop holding it in.\nTry saying it once. The world doesn't collapse.",
    },
    match: [eff("emotion", "L"), eff("avoid", "H"), eff("nunchi", "H")],
  },
  {
    id: "chulhak",
    emoji: "🌌",
    category: "daily",
    ko: {
      code: "철학",
      title: "The 새벽 철학자",
      oneliner: "새벽 2시 실존적 고민. 결론: 배달.",
      detail:
        "당신의 뇌는 쉬는 법을 잘 몰라요.\n특히 밤에. 조용해지면 생각이 시작돼요.\n'나는 왜 사는 걸까', '이게 맞는 삶인가',\n'10년 후 나는 어디에 있을까' —\n이런 질문들이 자정이 넘으면\n자동으로 켜지는 것 같아요.\n\n이 생각들이 깊고 진지하다는 건 알아요.\n근데 동시에 결론이 나는 경우가\n거의 없다는 것도 알고 있죠.\n생각은 무한히 이어지고,\n배가 고파지고, 배달 시키고,\n먹으면 좀 나아지고, 자는 거예요.\n\n이 패턴이 나쁜 건 아니에요.\n근데 그 생각들이 그냥 사라지게 두기엔\n아까울 때가 있어요.",
      strengths:
        "혼자 깊이 생각할 수 있는 사람이에요.\n그 사유의 깊이가 대화에서 나와요.\n피상적인 것에 만족하지 않고\n본질을 파고드는 성향이\n당신을 특별하게 만들어요.",
      watchOut:
        "생각이 행동을 대체하지 않게 해요.\n고민하는 것과 실제로 변화하는 건 달라요.\n새벽 2시에 나온 그 생각들을\n아침에 적어두는 것만으로도\n뭔가 달라질 수 있어요.",
      howOthersSee:
        "대화가 깊어서 좋은데 가끔 무거워요.\n밝은 척을 잘 하지만\n가끔 혼자 너무 많은 걸 짊어지는 것 같아요.\n조금 내려놓아도 괜찮아요.",
      shines:
        "긴 글, 긴 영상, 긴 사색이 자산인 일. 모두가 짧은 콘텐츠 만들 때 당신은 깊이로 차별화돼요.\n인생의 중요한 결정 — 결혼, 이직, 이민. 깊이 생각해야 후회가 없는 자리에서 빛나요.\n친구가 진짜 힘들 때, 당신과의 대화가 답이 돼요. 가벼운 위로가 안 통하는 순간이 있어요.",
      closing:
        "생각이 많은 게 약점이 아니에요.\n행동이 적은 게 약점이에요.",
    },
    en: {
      code: "CHUL-HAK",
      title: "The 2AM Philosopher",
      oneliner: "2AM existential crisis. Resolution: delivery.",
      detail:
        "Your brain doesn't know how to rest.\nEspecially at night. When it gets quiet,\nthinking starts. 'Why do I exist,'\n'Is this the right life,' 'Where will I be\nin 10 years' — these questions seem to\nauto-start after midnight.\n\nYou know these thoughts are deep\nand genuine. But you also know\nthey almost never reach conclusions.\nThoughts spiral endlessly,\nhunger appears, you order food,\neating helps, you sleep.\n\nThis pattern isn't bad.\nBut sometimes those thoughts deserve\nmore than just fading away.",
      strengths:
        "You can think deeply alone.\nThat depth shows up in conversation.\nYour refusal to settle for surface-level\nthings and drive to find the core\nmakes you genuinely interesting.",
      watchOut:
        "Don't let thinking replace action.\nPondering and actually changing are different.\nWriting down those 2AM thoughts\nin the morning is a small start\nthat can change something.",
      howOthersSee:
        "Conversations with you run deep —\nthat's a gift, but sometimes heavy.\nYou're good at seeming lighthearted,\nbut sometimes you seem to carry too much alone.\nIt's okay to put some of it down.",
      shines:
        "Long-form work — long writing, long videos, long thinking. While everyone makes short content, your depth differentiates.\nMajor life decisions — marriage, career switch, emigration. Deep thought prevents future regret. You shine here.\nWhen a friend is genuinely struggling, talking to you becomes the answer. The moments where light comfort fails.",
      closing:
        "Thinking too much isn't your weakness.\nActing too little is.",
    },
    match: [eff("perfection", "H"), eff("reality", "L"), eff("energy", "L")],
  },
  {
    id: "wanbyuk",
    emoji: "📐",
    category: "daily",
    ko: {
      code: "완벽",
      title: "The 완벽주의 시작 못하는 사람",
      oneliner: "완벽한 시작을 준비하다 마감이 됐다.",
      detail:
        "당신은 시작 전에 모든 것이\n완벽히 갖춰져야 한다고 느껴요.\n완벽한 환경, 완벽한 컨디션,\n완벽한 시간 — 이 세 가지가\n동시에 맞아야 시작할 수 있어요.\n\n근데 그 조건이 동시에 맞는 날은\n거의 오지 않아요.\n그래서 시작을 못 해요.\n시작을 못 하는 동안에도\n계획을 세우고, 준비를 하고,\n환경을 갖추는 일은 계속해요.\n\n그게 하는 것처럼 느껴지거든요.\n근데 실제로 결과물은 없어요.\n완벽주의가 당신의 가장 큰 적이에요.",
      strengths:
        "일단 시작하면 퀄리티가 달라요.\n기준이 높기 때문에 완성된 것의\n수준이 남들과 달라요.\n한 번 엔진이 걸리면\n아무도 따라오지 못해요.",
      watchOut:
        "완벽한 시작은 없어요.\n정말로요. 지금 당장 60점짜리로\n시작하세요. 하다 보면 90점이 돼요.\n처음부터 100점을 기다리면\n영원히 0점입니다.",
      howOthersSee:
        "믿음직하고 꼼꼼한 사람이에요.\n맡기면 잘 한다는 걸 알아요.\n근데 가끔 답답해요.\n더 빨리 시작하면 더 좋을 것 같은데\n왜 안 하는지 이해를 못 해요.",
      shines:
        "디테일이 결정적인 일 — 의료, 법률, 정밀 공학. 당신의 기준이 사고를 막아요.\n남들이 80점에 만족할 때 90점을 만들어내는 자리. 그 차이가 보이는 분야에서 당신만 보여요.\n장인의 영역. 시간 충분한 환경에서 한 분야를 깊이 파는 일.",
      closing:
        "완벽한 시작은 없어요.\n시작한 게 완벽한 거예요.",
    },
    en: {
      code: "WAN-BYUK",
      title: "The Can't-Start Perfectionist",
      oneliner: "Preparing for the perfect start until the deadline passed.",
      detail:
        "You feel like everything needs\nto be perfectly in place before starting.\nPerfect environment, perfect condition,\nperfect timing — all three must align\nbefore you can begin.\n\nBut that alignment almost never happens.\nSo you don't start.\nWhile not starting, you keep planning,\npreparing, setting up the environment.\n\nIt feels like doing something.\nBut there's no actual output.\nYour perfectionism is your biggest enemy.",
      strengths:
        "Once you actually start,\nthe quality is different.\nBecause your standards are high,\nwhat you finish operates at a different level.\nOnce the engine starts,\nno one can keep up.",
      watchOut:
        "There is no perfect start.\nGenuinely. Start right now at 60%.\nIt becomes 90% as you go.\nWaiting for 100% from the beginning\nmeans staying at 0% forever.",
      howOthersSee:
        "You're reliable and thorough.\nPeople know if they give it to you,\nit'll be done well. But sometimes\nthey get frustrated — they can see\nyou'd be better off starting sooner\nand can't understand why you don't.",
      shines:
        "Where details decide everything — medicine, law, precision engineering. Your standards prevent disasters.\nPlaces where the gap between 80% and 90% matters. In fields where that difference shows, only you do.\nCraftsman territory. Long-horizon work where you go deep on one thing.",
      closing:
        "There is no perfect start.\nStarting is the perfect part.",
    },
    match: [eff("perfection", "H"), eff("action", "L"), eff("planning", "H")],
  },
  {
    id: "injeung",
    emoji: "📸",
    category: "daily",
    ko: {
      code: "인증",
      title: "The 인증샷 수집가",
      oneliner: "먹기 전에 찍었다. 다 식었다.",
      detail:
        "당신에게 경험은 두 단계예요.\n실제로 경험하는 것과\n그것을 기록하는 것.\n그리고 솔직히 말하면 두 번째가\n첫 번째를 조금 방해하고 있어요.\n\n음식이 나왔어요. 먹기 전에 찍어요.\n노을이 예뻐요. 폰을 꺼내요.\n운동 끝났어요. 인증샷 찍어요.\n\n이게 나쁜 건 아니에요.\n기록하고 싶은 마음은 진짜니까요.\n근데 가끔 그 순간 안에 있는 것보다\n그 순간을 증명하는 데 더 집중하는\n자신을 발견하지 않나요?",
      strengths:
        "기억력이 좋아요. 사진으로 남긴\n그 순간들이 나중에 소중해져요.\n그리고 주변 사람들의 좋은 순간도\n잘 기록해줘요. 그게 진짜 선물이에요.",
      watchOut:
        "폰을 내려놓고 그냥 먹어보세요.\n그냥 봐보세요. 그냥 있어보세요.\n기록되지 않은 순간도\n충분히 존재할 수 있어요.",
      howOthersSee:
        "같이 있으면 추억이 잘 남아요.\n나중에 사진을 공유해줄 때\n'이때 이랬구나' 하고 새삼 고마워져요.\n근데 가끔 같이 있는데 같이 없는 것 같아요.",
      shines:
        "콘텐츠 크리에이터, 마케팅, 기록이 자산인 일. 평소대로 살아도 결과물이 쌓여요.\n친구들 결혼식, 여행, 졸업식. 당신이 찍어준 사진이 평생 추억이 돼요.\n장기 프로젝트의 비포-애프터 기록. 변화가 보여야 하는 모든 일.",
      closing:
        "기록되지 않은 순간도 살아있어요.\n가끔은 폰을 내려놓아도 돼요.",
    },
    en: {
      code: "IN-JEUNG",
      title: "The Receipt Photographer",
      oneliner: "Shot before eating. It got cold.",
      detail:
        "For you, experience has two phases:\nactually experiencing it, and recording it.\nAnd honestly, the second\nis interfering with the first a little.\n\nFood arrives. Shoot before eating.\nBeautiful sunset. Out comes the phone.\nFinished workout. Proof shot.\n\nThis isn't bad — the desire to capture\nis genuine. But sometimes don't you find\nyourself more focused on documenting\nthe moment than being in it?",
      strengths:
        "Your memory is good — those captured\nmoments become precious later.\nAnd you document the good moments\nof people around you too.\nThat's a genuine gift to them.",
      watchOut:
        "Put the phone down and just eat.\nJust watch. Just be there.\nUndocumented moments can exist\njust as fully as captured ones.",
      howOthersSee:
        "Memories last well when you're around.\nWhen you share photos later,\npeople think 'oh that's right, that happened'\nand feel grateful. But sometimes you're\nphysically present but somehow not there.",
      shines:
        "Content creator work, marketing, anywhere documentation is the asset. Just living normally builds outputs.\nFriends' weddings, trips, graduations. The photos you take become lifelong memories for them.\nBefore-and-after records on long projects. Anywhere change needs to be seen.",
      closing:
        "Undocumented moments are still alive.\nSometimes it's okay to put the phone down.",
    },
    match: [eff("justify", "H"), eff("nunchi", "H"), eff("energy", "H")],
  },
  {
    id: "aljanj",
    emoji: "🤷",
    category: "daily",
    ko: {
      code: "알잖",
      title: "The 알면서 하는 사람",
      oneliner: "알면서 한다. 후회도 안다. 또 한다.",
      detail:
        "당신은 스스로에게 매우 솔직해요.\n야식이 나쁘다는 거 알아요.\n운동 안 하면 후회할 거 알아요.\n돈을 써버리면 다음 달이 힘들 거 알아요.\n\n근데 해요.\n\n이게 자기통제력 부족인 것만은 아니에요.\n인간이 장기적 이익보다 단기적 쾌락을\n선택하도록 설계되어 있기도 하고,\n당신은 그 사실에 특히 솔직한 거예요.\n\n자기기만이 없다는 건 장점이에요.\n'몰랐어'라고 하지 않으니까요.\n근데 알면서 계속 같은 선택을 하면\n'알고 있음'이 아무 의미가 없어져요.",
      strengths:
        "자기 자신을 정확하게 봐요.\n그 정직함이 중요한 결정에서 나와요.\n남들이 자기합리화할 때\n당신은 있는 그대로를 봐요.",
      watchOut:
        "'알면서 한다'가 패턴이 되면\n의지력이 아니라 구조를 바꿔야 해요.\n야식을 시키지 않으려면\n배달 앱을 지우는 게\n'오늘은 참아야지'보다 훨씬 효과적이에요.",
      howOthersSee:
        "솔직하고 위선이 없는 사람이에요.\n'나 이거 나쁜 거 알아'라고 말하면서\n하는 모습이 오히려 인간적으로 보여요.\n꾸미지 않는 솔직함이 매력이에요.",
      shines:
        "AA 그룹, 자기개발 모임 같은 자리. 자기기만 없는 솔직함이 진짜 변화를 만들어요.\n중독, 습관 문제를 다루는 일. 자신에게 정직한 사람이 남도 정직하게 도와줄 수 있어요.\n진심이 필요한 대화. 당신은 가식이 없어서 신뢰를 받아요.",
      closing:
        "알면서 하는 건 인간이에요.\n알고도 안 멈추는 건 다른 얘기예요.",
    },
    en: {
      code: "AL-JANJ",
      title: "The Knowingly-Anyway Type",
      oneliner: "Knows it's wrong. Knows they'll regret. Does it anyway.",
      detail:
        "You're very honest with yourself.\nYou know late-night food is bad.\nKnow you'll regret skipping exercise.\nKnow spending now makes next month hard.\n\nBut you do it anyway.\n\nThis isn't purely a self-control problem.\nHumans are wired to choose short-term\npleasure over long-term benefit,\nand you're just particularly honest about it.\n\nNo self-deception is a strength —\nyou don't say 'I didn't know.'\nBut if you keep making the same choice\nwhile knowing, 'knowing' becomes meaningless.",
      strengths:
        "You see yourself accurately.\nThat honesty shows up in important decisions.\nWhen others rationalize,\nyou see things as they are.",
      watchOut:
        "When 'knowing and doing it anyway'\nbecomes a pattern, you need to change\nthe structure, not just willpower.\nDeleting the delivery app is far more\neffective than 'I should resist tonight.'",
      howOthersSee:
        "You're honest and without pretense.\nSaying 'I know this is bad' while doing it\nactually comes across as very human.\nThat unpolished honesty is genuinely attractive.",
      shines:
        "AA-style groups, self-improvement circles. Honesty without self-deception creates real change.\nWork around addiction or habit problems. Someone honest with themselves can help others honestly.\nConversations where sincerity matters. You're trusted because you don't pretend.",
      closing:
        "Doing it knowingly is human.\nDoing it knowingly forever is a different story.",
    },
    match: [eff("justify", "H"), eff("reality", "M"), eff("action", "L")],
  },
  {
    id: "nunting",
    emoji: "👀",
    category: "daily",
    ko: {
      code: "눈팅",
      title: "The 눈팅 전문가",
      oneliner: "모든 걸 알고 있다. 존재는 아무도 모른다.",
      detail:
        "당신은 디지털 세계의 투명인간이에요.\n좋아요를 누르지 않아요.\n댓글을 달지 않아요.\n이야기를 올리지 않아요.\n그냥 봐요.\n\n근데 다 알고 있어요.\n누가 누구랑 사귀는지,\n누가 여행을 갔는지,\n누가 요즘 힘들어 보이는지.\n\n이 관찰력은 진짜 능력이에요.\n근데 그 정보가 당신 안에서만 순환해요.\n세상은 당신이 보고 있다는 걸 몰라요.\n그리고 당신이 어떤 사람인지도 몰라요.",
      strengths:
        "사람들을 깊이 이해하고 있어요.\n오래 관찰했기 때문에 처음 만난 사람도\n금방 파악이 돼요. 그 이해가\n중요한 순간에 힘이 돼요.",
      watchOut:
        "세상을 관찰하는 것에서\n참여하는 것으로 한 발 나가보세요.\n좋아요 하나가 생각보다 큰 일이에요.\n댓글 하나가 누군가에게 큰 의미가 돼요.",
      howOthersSee:
        "잘 모르겠어요. 당신을.\n있는 것 같은데 없는 것 같고,\n알 것 같은데 모르겠어요.\n조금 더 보여줘도 괜찮아요.",
      shines:
        "리서치, 시장 분석, 트렌드 파악 — 보는 사람의 눈이 자산인 일. 당신은 이미 다 알고 있어요.\n신제품 출시 직전의 사용자 인사이트. 댓글은 안 달지만 트렌드는 누구보다 빨리 캐치해요.\n조용히 누군가의 변화를 알아채는 일. 친구가 진짜 힘들 때 당신만 알아봐요.",
      closing:
        "보고만 있어도 돼요.\n근데 가끔은 좋아요 하나만 눌러줘도 누군가의 하루가 달라져요.",
    },
    en: {
      code: "NUN-TING",
      title: "The Lurker",
      oneliner: "Knows everything. No one knows you exist.",
      detail:
        "You're a ghost in the digital world.\nNo likes. No comments. No stories.\nJust watching.\n\nBut you know everything.\nWho's dating who, who just traveled,\nwho seems to be struggling lately.\n\nThis observation is real ability.\nBut that information only circulates\ninside you. The world doesn't know\nyou're watching. And doesn't know\nwho you are either.",
      strengths:
        "You understand people deeply.\nHaving watched for so long, you read\neven new people quickly. That understanding\nbecomes a strength in important moments.",
      watchOut:
        "Try moving from observing\nto participating, one step.\nA single like matters more than you think.\nOne comment can mean a great deal\nto someone.",
      howOthersSee:
        "We're not sure. About you.\nYou seem to be there but also not.\nSeem familiar but also not.\nIt's okay to show a little more.",
      shines:
        "Research, market analysis, trend-spotting — work where the watcher's eye is the asset. You already know everything.\nPre-launch user insight. You don't comment, but you catch trends faster than anyone.\nQuietly noticing someone's change. When a friend is really struggling, only you notice.",
      closing:
        "Just watching is fine.\nBut one like can change someone's day.",
    },
    match: [eff("nunchi", "H"), eff("emotion", "L"), eff("energy", "L")],
  },

  // ─── Relationship (3) ─────────────────────────────────
  {
    id: "bunsuk",
    emoji: "🔍",
    category: "relationship",
    ko: {
      code: "분석",
      title: "The 카톡 분석가",
      oneliner: "'ㅇㅇ' 30분 분석 후 'ㅇㅋ' 답장.",
      detail:
        "카톡 하나가 당신에게 미니 논문이에요.\n온점의 유무, 이모티콘의 종류,\n답장 속도, 단어 선택 —\n이 모든 게 데이터예요.\n\n'ㅇㅇ' → 무뚝뚝함? 바쁨? 화남?\n'ㅇㅇ.' → 온점이 있다. 확실히 화났다.\n'ㅇㅋ' → 한글이다. 아직 괜찮다.\n'ok' → 영어다. 격식 차리는 건가.\n\n이 분석이 때로는 정확해요.\n근데 대부분은 과잉해석이에요.\n상대방은 그냥 바빠서 짧게 쓴 거예요.\n당신이 분석하는 동안\n상대방은 이미 잊어버렸을 거예요.",
      strengths:
        "사람에 대한 관심이 진짜예요.\n그 세심함이 실제로 상대방을\n깊이 이해하게 만들어요.\n분석이 아니라 이해로 연결될 때\n당신은 최고의 친구, 최고의 파트너가 돼요.",
      watchOut:
        "메시지보다 직접 목소리를 들으면\n당신의 분석 에너지가 절반으로 줄어요.\n'무슨 뜻이야?'라고 물어보는 것이\n30분 분석보다 정확하고 빨라요.",
      howOthersSee:
        "당신이 나를 신경 쓴다는 걸 느껴요.\n근데 가끔 너무 많이 신경 쓰는 것 같아서\n부담이 될 때도 있어요.\n조금 가볍게 대해줘도 괜찮아요.",
      shines:
        "관계 코칭, 상담, 갈등 중재. 미세한 신호를 읽는 능력이 직업이 돼요.\n팀 다이내믹 관찰이 중요한 PM, 인사 직무. 당신이 보는 게 남들에겐 안 보여요.\n복잡한 인간관계에서 의도를 정확히 파악해야 할 때. 정치가 있는 자리에서도 살아남아요.",
      closing:
        "분석은 이해를 위한 거예요.\n의심을 위한 게 아니에요.",
    },
    en: {
      code: "BUN-SUK",
      title: "The Text Analyst",
      oneliner: "30 minutes analyzing 'ok'. Replied 'ok'.",
      detail:
        "Each message is a mini-thesis to you.\nPresence of period, type of emoji,\nreply speed, word choice —\nall data points.\n\n'ok' → Blunt? Busy? Upset?\n'ok.' → Period. Definitely upset.\n'OK' → Capitalized. Being formal?\n'kk' → Casual. Still fine.\n\nSometimes this analysis is accurate.\nBut mostly it's over-interpretation.\nThey were just busy and typed fast.\nBy the time you finish analyzing,\nthey've already forgotten they replied.",
      strengths:
        "Your interest in people is genuine.\nThat attention actually helps you\nunderstand others deeply.\nWhen analysis connects to understanding,\nyou become the best friend, the best partner.",
      watchOut:
        "Hearing their voice instead of\nreading messages cuts your analysis\nenergy in half. Asking 'what do you mean?'\nis more accurate and faster\nthan 30 minutes of analysis.",
      howOthersSee:
        "We can feel that you care about us.\nBut sometimes it feels like too much,\nand that can be a little heavy.\nIt's okay to be a bit lighter with us.",
      shines:
        "Relationship coaching, counseling, conflict mediation. Reading micro-signals becomes your career.\nPM and HR roles where reading team dynamics matters. What you see, others miss.\nComplex relationships where intent must be read precisely. You survive political environments.",
      closing:
        "Analysis is for understanding.\nNot for suspicion.",
    },
    match: [eff("obsession", "H"), eff("perfection", "H"), eff("reality", "L")],
  },
  {
    id: "chaga",
    emoji: "🧊",
    category: "relationship",
    ko: {
      code: "차가",
      title: "The 좋아하면서 차가운 척",
      oneliner: "좋다. 근데 절대 티 안 낸다.",
      detail:
        "당신 안에는 따뜻한 감정이 있어요.\n진짜로요. 좋아하는 사람이 생기면\n심장이 뛰고, 친한 친구가 힘들면\n같이 마음이 아프고,\n소중한 사람을 잃으면 한동안 무너져요.\n\n근데 그게 밖으로 나오지 않아요.\n오히려 좋아할수록 더 차가워져요.\n관심이 생길수록 더 무관심한 척해요.\n이게 쿨한 게 아니에요.\n두려운 거예요.\n\n먼저 표현했다가 거절당하는 것,\n마음을 줬다가 상처받는 것,\n약해보이는 것 — 이게 무서운 거예요.\n그래서 차가운 척으로 스스로를 보호해요.",
      strengths:
        "당신의 따뜻함을 아는 사람들은\n그게 얼마나 특별한 건지 알아요.\n쉽게 주지 않기 때문에 받았을 때\n더 소중하게 느껴져요.\n당신의 마음은 희소해서 가치 있어요.",
      watchOut:
        "차가운 척하다 기회를 놓치는 경우가\n있어요. 상대방이 포기하고 떠났는데\n당신은 아직 마음이 있는 경우요.\n표현하지 않은 마음은\n상대방이 알 수 없어요.",
      howOthersSee:
        "처음엔 차갑고 무관심해 보여요.\n근데 친해지면 완전히 달라요.\n그 반전이 당신의 매력이에요.\n처음 장벽만 넘으면 최고의 사람이에요.",
      shines:
        "처음 보는 사람한테 휘둘리지 않는 자리. 면접관, 협상가, 평가자 — 감정을 안 보여야 유리한 직무.\n경계가 필요한 관계에서 당신의 거리감이 자기 보호가 돼요.\n위기에서 차분함을 유지하는 능력. 다들 흥분할 때 당신만 차가워서 결정을 잘 내려요.",
      closing:
        "차가운 척하다 그 사람 떠나면\n후회는 당신만 해요.",
    },
    en: {
      code: "CHA-GA",
      title: "The Cold Pretender",
      oneliner: "Feelings: real. Expression: zero.",
      detail:
        "There's warmth inside you.\nGenuinely. When you like someone,\nyour heart beats faster. When a close friend\nstruggles, you hurt too.\nWhen you lose someone precious,\nyou're undone for a while.\n\nBut none of that comes out.\nIn fact, the more you like someone,\nthe colder you act. The more you're drawn to them,\nthe more indifferent you seem.\nThis isn't being cool.\nIt's being afraid.\n\nBeing rejected after expressing first,\ngetting hurt after giving your heart,\nappearing weak — that's what's scary.\nSo you protect yourself by acting cold.",
      strengths:
        "People who know your warmth\nknow how special it is.\nBecause you don't give it easily,\nreceiving it feels more precious.\nYour heart is valuable because it's rare.",
      watchOut:
        "There are cases where acting cold\nmeans missing the chance.\nThey've already moved on but you\nstill have feelings. Unexpressed feelings\nare invisible to the other person.",
      howOthersSee:
        "First impression: cold and indifferent.\nGet close and everything changes.\nThat contrast is your charm.\nOnce people get past the initial wall,\nyou're one of the best.",
      shines:
        "Roles where you can't be swayed by strangers — interviewer, negotiator, evaluator. Showing nothing is the advantage.\nIn relationships needing boundaries, your distance is self-protection.\nStaying calm in crisis. While everyone heats up, you stay cold and decide well.",
      closing:
        "Keep pretending to be cold.\nIf they leave, only you regret it.",
    },
    match: [eff("emotion", "L"), eff("nunchi", "H"), eff("justify", "H")],
  },
  {
    id: "jipchak",
    emoji: "📱",
    category: "relationship",
    ko: {
      code: "집착",
      title: "The 마지막 접속 관찰자",
      oneliner: "마지막 접속 2분 전. 아직 답장 없음. 죽은 건가.",
      detail:
        "당신이 누군가를 신경 쓸 때는\n진심으로 신경 써요. 반쪽짜리 관심이\n없어요. 마지막 접속을 확인하고,\n읽음 표시를 확인하고,\n프로필 사진이 바뀌었는지 확인해요.\n\n이게 집착처럼 보일 수 있지만\n사실은 그 사람이 그만큼 중요하다는\n거예요. 중요하지 않은 사람은\n신경도 안 쓰이니까요.\n\n문제는 그 강도가 때로 상대방을\n숨막히게 할 수 있다는 거예요.\n혹은 그 확인들이 당신 자신을\n불안하게 만든다는 거예요.\n마지막 접속 시간이 당신의 기분을\n결정하게 되는 순간, 뭔가 잘못된 거예요.",
      strengths:
        "당신이 챙기는 사람들은\n진짜로 챙김을 받는 느낌이에요.\n생일을 기억하고, 힘들 때 연락하고,\n작은 것도 기억해요.\n그 세심함을 소중히 여기는 사람들이\n당신 곁에 있어요.",
      watchOut:
        "상대방의 마지막 접속 시간은\n당신에 대한 답이 아니에요.\n그들에게도 그들의 삶이 있어요.\n당신을 생각하지 않는 10분이\n당신을 싫어한다는 뜻이 아니에요.",
      howOthersSee:
        "많이 챙겨줘서 고마워요.\n근데 가끔은 조금 무거울 때가 있어요.\n아무 이유 없이 그냥 바쁠 때도 있거든요.\n그럴 때 이해해주면 더 편하게 있을 수 있어요.",
      shines:
        "관계, 프로젝트, 작품에 깊이 몰입해야 하는 일. 적당히가 아니라 끝까지 가야 하는 자리.\n섬세함이 결과를 좌우하는 일 — 작가, 큐레이터, 기획자. 당신의 집중이 디테일을 만들어요.\n친한 사람의 위기 상황. 당신처럼 끝까지 챙기는 사람은 드물어요.",
      closing:
        "마지막 접속 시간이 당신의 기분을 결정하는 순간,\n폰을 내려놓아 봐요.",
    },
    en: {
      code: "JIP-CHAK",
      title: "The Last-Seen Watcher",
      oneliner: "Last seen 2 min ago. No reply. Are they okay?????",
      detail:
        "When you care about someone,\nyou care completely. No half-measures.\nChecking last seen, checking read receipts,\nnoticing if their profile picture changed.\n\nThis can look like obsession but\nit's actually proof of how much\nthat person matters to you.\nPeople you don't care about don't\noccupy your mind at all.\n\nThe problem is that intensity can\nsometimes suffocate the other person.\nOr those checks make you anxious.\nThe moment their last-seen time\ndetermines your mood — something's off.",
      strengths:
        "The people you take care of\ngenuinely feel taken care of.\nYou remember birthdays, reach out\nwhen they're struggling, remember small details.\nThe people who value that thoughtfulness\nare around you.",
      watchOut:
        "Their last seen time is not an answer\nabout you. They have their own life.\n10 minutes of not thinking about you\ndoesn't mean they don't like you.",
      howOthersSee:
        "Thank you for taking care of us so much.\nBut sometimes it feels a little heavy.\nSometimes we're just busy, no reason.\nBeing understood in those moments\nmakes it easier to stay close.",
      shines:
        "Relationships, projects, works that require deep immersion. Where 'good enough' doesn't cut it.\nWork where attention to detail decides outcomes — writers, curators, planners. Your focus creates the detail.\nA close person's crisis. Someone who stays till the end like you is rare.",
      closing:
        "The moment last-seen time decides your mood,\nput the phone down.",
    },
    match: [eff("obsession", "H"), eff("reality", "L"), eff("perfection", "H")],
  },

  // ─── Self-Development (3) ─────────────────────────────
  {
    id: "byuk",
    emoji: "⚡",
    category: "self",
    ko: {
      code: "벼락",
      title: "The 벼락치기 신",
      oneliner: "시험 전날이 제일 집중된다. 이건 전략이다. (아니다)",
      detail:
        "당신의 뇌는 마감이 있어야 작동해요.\n여유가 있으면 일이 손에 잡히지 않아요.\n기한이 멀면 시작이 안 되고,\n기한이 가까워지면 갑자기 집중이 돼요.\n\n이걸 스스로 정당화하는 방법도 알고 있어요.\n'나는 원래 압박을 받아야 잘 된다',\n'벼락치기가 오히려 효율적이다' —\n이 말들이 어느 정도는 맞기도 해요.\n\n근데 솔직히 말하면, 벼락치기로 만든 것은\n여유 있게 만든 것보다 퀄리티가 낮아요.\n당신도 알고 있을 거예요.\n그 잠재력이 온전히 나오지 않은 결과물을\n계속 내고 있는 거예요.",
      strengths:
        "진짜 위기 상황에서 당신은 달라요.\n남들이 패닉할 때 당신의 뇌는\n이제야 제대로 켜지거든요.\n실제로 급한 상황을 구한 경험이\n분명히 있을 거예요.",
      watchOut:
        "인위적으로 마감을 만들어보세요.\n실제 마감보다 3일 앞선 마감을\n스스로 설정하는 거예요.\n당신의 뇌를 속이는 거예요.\n생각보다 잘 돼요.",
      howOthersSee:
        "항상 마지막에 나타나서\n해결하고 사라지는 사람이에요.\n믿음직하긴 한데 가끔 조마조마해요.\n이번엔 진짜 못 하는 거 아닌가 싶어서요.",
      shines:
        "응급, 위기, 마감 직전. 다들 떨고 있을 때 당신의 뇌가 그제야 켜져요.\n압박 속에서 빛나는 직무 — 응급의, 라이브 PD, 사고 수습. 평온하면 못 돌아가는 환경.\n단기 집중이 필요한 모든 일. 당신은 24시간을 1년처럼 써요.",
      closing:
        "벼락치기로도 일은 돼요.\n근데 그게 매번 되는 건 아니에요.",
    },
    en: {
      code: "BYUK",
      title: "The Last-Minute God",
      oneliner: "Most focused the night before. This is strategy. (It's not.)",
      detail:
        "Your brain requires a deadline to function.\nWith plenty of time, you can't get started.\nFar from the deadline, nothing happens.\nClose to the deadline, focus appears.\n\nYou have ways to justify this:\n'I work better under pressure,'\n'Last-minute is actually more efficient' —\nthese have some truth to them.\n\nBut honestly, last-minute work\nis lower quality than work done with time.\nYou probably know this.\nYou keep producing results that don't\nfully show what you're capable of.",
      strengths:
        "In real crisis, you're different.\nWhile others panic, your brain\nfinally fully activates.\nYou've definitely had moments where\nyou saved a situation at the last minute.",
      watchOut:
        "Create artificial deadlines.\nSet one for yourself 3 days before\nthe real deadline. Trick your brain.\nIt works better than you'd expect.",
      howOthersSee:
        "You always show up at the last moment,\nsolve it, and disappear. Reliable,\nbut sometimes people watch nervously,\nwondering if this time you really won't make it.",
      shines:
        "Emergencies, crises, final moments. While everyone trembles, your brain finally turns on.\nRoles that thrive under pressure — ER doc, live producer, incident response. Environments where calm doesn't work.\nAnything requiring short-burst focus. You use 24 hours like a year.",
      closing:
        "Last-minute works.\nUntil the day it doesn't.",
    },
    match: [eff("justify", "H"), eff("planning", "L"), eff("action", "M")],
  },
  {
    id: "toejun",
    emoji: "📝",
    category: "self",
    ko: {
      code: "퇴준",
      title: "The 퇴사/탈출 준비생",
      oneliner: "사직서를 오늘만 100번 썼다. 월급날이 됐다.",
      detail:
        "당신은 지금 있는 곳이 맞지 않는다는 걸\n느끼고 있어요. 아침에 일어나기 싫고,\n출근길이 무겁고, 회의실에 앉으면\n여기서 뭐하고 있는 건지 싶어요.\n\n그 감각은 진짜예요. 무시하면 안 돼요.\n\n근데 떠나지 못하는 이유도 있어요.\n생활비, 모아둔 게 없음,\n아직 때가 아닌 것 같음,\n다음이 더 나쁠 수도 있음.\n\n이 이유들도 다 진짜예요.\n\n그래서 오늘도 마음속으로만 사직서를 쓰고\n월급날이 되면 다음 달까지만 더 하기로 해요.\n이 패턴이 1년이 됐는지,\n3년이 됐는지 세어봤어요?",
      strengths:
        "현실을 감당하는 힘이 있어요.\n버텨야 할 때 버틸 수 있는 사람이에요.\n그 힘이 올바른 방향을 찾으면\n무서운 사람이 됩니다.",
      watchOut:
        "떠나는 것보다 준비하는 것에 집중해요.\n사직서를 내기 전에 다음을 만들어야 해요.\n그 준비가 없이 버티는 것만 하다 보면\n에너지가 전부 소진돼요.",
      howOthersSee:
        "힘들어 보이는데 괜찮다고 해요.\n물어볼 때마다 '곧 나올 거야'라고 해요.\n친한 사람들은 걱정이 돼요.\n혼자 다 감당하려 하지 않아도 돼요.",
      shines:
        "현실을 정확히 보는 능력이 자산인 일. 컨설턴트, 분석가, 평가자.\n변화의 시점을 본능적으로 아는 사람. 떠나야 할 때를 정확히 봐요.\n남들이 안주할 때 당신은 의문을 품어요. 그 의문이 큰 변화의 시작이에요.",
      closing:
        "사직서를 쓰는 게 아니라 다음을 쓰세요.\n그게 진짜 퇴사 준비예요.",
    },
    en: {
      code: "TOE-JUN",
      title: "The Mental Resigner",
      oneliner: "Written the resignation 100 times today. Payday happened.",
      detail:
        "You feel that where you are\nisn't right for you. Dreading waking up,\nheavy commute, sitting in meetings\nwondering what you're doing there.\n\nThat feeling is real. Don't ignore it.\n\nBut there are reasons you haven't left.\nBills, not enough saved, doesn't feel\nlike the right time, the next place\nmight be worse.\n\nThose reasons are also real.\n\nSo you write the resignation in your head,\npayday comes, and you decide one more month.\nHave you counted how long this pattern\nhas been going — one year? Three?",
      strengths:
        "You have the strength to handle reality.\nYou can hold on when you need to.\nThat strength, pointed in the right direction,\nbecomes something formidable.",
      watchOut:
        "Focus on preparing more than leaving.\nBefore you resign, you need to build\nwhat comes next. Just enduring without\nthat preparation drains all your energy.",
      howOthersSee:
        "You look like you're struggling\nbut say you're fine. Every time someone asks,\n'I'll be out soon.' People who care\nabout you are worried.\nYou don't have to handle it all alone.",
      shines:
        "Roles where seeing reality clearly is the asset. Consultant, analyst, evaluator.\nThe person who instinctively knows when to leave. You see the right moment.\nWhile others settle, you ask questions. That questioning is the start of bigger change.",
      closing:
        "Don't write a resignation. Write what's next.\nThat's the real prep.",
    },
    match: [eff("reality", "L"), eff("justify", "H"), eff("obsession", "H")],
  },
  {
    id: "nunchi",
    emoji: "👁️",
    category: "self",
    ko: {
      code: "눈치",
      title: "The 눈치 100단",
      oneliner: "다 알고 있다. 아무 말 안 한다.",
      detail:
        "당신은 방에 들어서는 순간\n분위기를 읽어요. 누가 오늘 기분이 안 좋은지,\n누가 누구를 불편해하는지,\n어떤 말을 하면 안 되는지 —\n말하지 않아도 그냥 알아요.\n\n이 능력은 타고난 거예요.\n오랜 관찰과 경험으로 쌓인 거기도 하고요.\n\n근데 이 능력이 때로 당신을 지치게 해요.\n모든 걸 읽으면서 그에 맞게 행동하고,\n말을 고르고, 분위기를 맞추다 보면\n정작 당신 자신이 뭘 원하는지\n잊어버리게 돼요.",
      strengths:
        "위기 상황에서 가장 적절한 말을 해요.\n갈등을 부드럽게 풀어요.\n그 자리에서 모두가 편할 수 있게 해요.\n그 능력 덕분에 당신 주변에\n사람들이 오래 머물러요.",
      watchOut:
        "당신의 필요도 중요해요.\n항상 분위기에 맞추다 보면\n정작 당신이 원하는 걸 말할 기회가 없어요.\n가끔은 분위기를 깨도 괜찮아요.\n진짜 당신을 보고 싶어하는 사람들이 있어요.",
      howOthersSee:
        "같이 있으면 편해요. 항상.\n근데 당신이 힘든 건지 모를 때가 있어요.\n괜찮지 않을 때 괜찮다고 하는 것 같아서요.\n말해줘요. 들을 준비가 되어있어요.",
      shines:
        "외교, 영업, 호스피탈리티 — 사람을 읽어야 하는 모든 직업.\n다양한 관계자가 얽힌 자리에서 당신만 모두를 만족시킬 수 있어요.\n갈등의 한가운데서 진짜 문제를 보는 사람. 다들 표면을 볼 때 당신은 이미 본질을 봐요.",
      closing:
        "남의 분위기 다 맞춰주는 사람이\n정작 자기 분위기는 못 챙겨요.",
    },
    en: {
      code: "NUN-CHI",
      title: "The Mood Master",
      oneliner: "Knows everything. Says nothing.",
      detail:
        "The moment you enter a room,\nyou read it. Who's having a bad day,\nwho's uncomfortable with who,\nwhat shouldn't be said —\nyou just know without being told.\n\nThis ability is partly innate,\npartly built through long observation.\n\nBut this ability sometimes exhausts you.\nReading everything, acting accordingly,\nchoosing words carefully, matching the mood —\nin the middle of all that,\nyou sometimes forget what you actually want.",
      strengths:
        "In difficult moments, you say\nexactly the right thing.\nYou soften conflicts.\nYou make everyone feel comfortable.\nBecause of that ability, people tend\nto stay around you for a long time.",
      watchOut:
        "Your needs matter too.\nAlways matching the mood means\nyou never get a chance to say\nwhat you actually want.\nSometimes it's okay to break the atmosphere.\nThere are people who want to see\nthe real you.",
      howOthersSee:
        "It's always comfortable being with you.\nBut we sometimes can't tell when\nyou're struggling. You seem to say\nyou're fine even when you're not.\nTell us. We're ready to listen.",
      shines:
        "Diplomacy, sales, hospitality — any job that requires reading people.\nIn rooms with many stakeholders, only you can satisfy everyone.\nThe person who sees the real problem in the middle of conflict. While others see surface, you already see the core.",
      closing:
        "The person who matches everyone's vibe\nrarely tends to their own.",
    },
    match: [eff("nunchi", "H"), eff("emotion", "L"), eff("avoid", "H")],
  },
];

// ═══════════════════════════════════════════════════════════
// Hidden type — 치맥 (triggered by Q9=C AND Q12=C)
// Q9 (index 8): 먹는다  ·  Q12 (index 11): 멍하니 있다가 배달 시킨다
// ═══════════════════════════════════════════════════════════

export const HIDDEN_CHIMAEK: KbtiType = {
  id: "chimaek",
  emoji: "🍗",
  category: "daily",
  ko: {
    code: "치맥",
    title: "The 치맥 해결사",
    oneliner: "치킨과 맥주로 안 되는 게 없다. (있다)",
    detail:
      "당신에게는 치맥이 철학이에요.\n단순한 음식이 아니라\n삶의 태도예요.\n\n힘든 하루가 끝났다.\n치킨을 시켰다.\n맥주를 열었다.\n그 순간 하루의 무게가 조금 가벼워졌다.\n\n이게 실제로 문제를 해결하지 않는다는 걸\n알고 있어요. 내일 아침에 일어나면\n어제의 문제가 그대로 있을 거예요.\n\n근데 오늘 밤만큼은 괜찮아요.\n그리고 그게 때로는 충분해요.\n오늘 하루를 버틴 자신에게\n치맥 한 세트는 아깝지 않아요.",
    strengths:
      "같이 있으면 기분이 좋아져요.\n치맥 한 자리에 불러주는 사람이\n주변에 있다는 것만으로도\n하루가 달라지거든요.\n당신이 그 역할을 하고 있어요.",
    watchOut:
      "치맥으로 넘어가는 감정들이 있어요.\n해소되지 않고 쌓이면\n나중에 더 크게 와요.\n오늘 치맥 한 잔 하면서\n뭘 잊으려 했는지 한번 생각해봐요.",
    howOthersSee:
      "당신이 있으면 분위기가 살아나요.\n'치킨 먹자'는 말 하나가\n모두를 기분 좋게 만들어요.\n당신은 사람들을 모으는 사람이에요.",
    shines:
      "팀이 무너지기 직전, 당신의 '치맥 가자' 한 마디가 분위기를 살려요.\n장례식, 이별, 큰 실패 후 — 말로 위로가 안 되는 순간 당신의 존재 자체가 위로가 돼요.\n번아웃 직전인 친구를 알아채는 능력. 당신만 데리고 갈 수 있는 자리가 있어요.",
    closing:
      "치맥은 위로예요.\n근데 매일이 위로가 필요하면 다른 게 진짜 문제예요.",
  },
  en: {
    code: "CHI-MAEK",
    title: "The Chimaek Healer",
    oneliner: "Chicken and beer solves everything. (It doesn't.)",
    detail:
      "Chicken and beer is your philosophy.\nNot just food — a way of life.\n\nHard day ends.\nOrdered chicken.\nCracked open a beer.\nThe weight of the day got a little lighter.\n\nYou know this doesn't actually solve anything.\nTomorrow morning the same problems\nwill still be there.\n\nBut tonight is okay.\nAnd sometimes that's enough.\nFor someone who made it through today,\na set of chicken and beer is well-earned.",
    strengths:
      "People feel better around you.\nHaving someone who'll say 'let's get chicken'\nchanges someone's whole day.\nYou're that person for the people around you.",
    watchOut:
      "There are feelings getting bypassed\nby the chicken and beer.\nUnresolved and accumulated,\nthey come back bigger later.\nWhile having your chicken and beer tonight,\nthink about what you're trying to forget.",
    howOthersSee:
      "The atmosphere comes alive when you're there.\nA simple 'let's get chicken'\nputs everyone in a better mood.\nYou're someone who brings people together.",
    shines:
      "Just before a team collapses, your 'let's get chicken and beer' brings it back.\nFunerals, breakups, major failures — moments when words can't comfort, your presence does.\nNoticing a pre-burnout friend. There's a place only you can take them.",
    closing:
      "Chicken and beer is comfort.\nBut if you need comfort every day, something else is the real problem.",
  },
  match: [],
};

// ═══════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════

export type AnswerLetter = "A" | "B" | "C";
export type Profile = Record<Dimension, number>;

export function emptyProfile(): Profile {
  return {
    action: 0,
    avoid: 0,
    nunchi: 0,
    energy: 0,
    perfection: 0,
    reality: 0,
    emotion: 0,
    planning: 0,
    obsession: 0,
    justify: 0,
  };
}

export function buildQuestionList(): Question[] {
  return QUESTIONS;
}

export function buildProfile(answers: AnswerLetter[]): Profile {
  const profile = emptyProfile();
  answers.forEach((letter, i) => {
    const q = QUESTIONS[i];
    if (!q) return;
    const idx = letter === "A" ? 0 : letter === "B" ? 1 : 2;
    const choice = q.choices[idx];
    if (!choice) return;
    for (const e of choice.effects) {
      profile[e.dim] += 1;
    }
  });
  return profile;
}

const MAX_PER_DIM = 6; // rough upper bound on picks for one dimension across 20 questions

function conditionScore(profile: Profile, dim: Dimension, level: Level): number {
  const v = Math.min(MAX_PER_DIM, profile[dim]);
  const norm = v / MAX_PER_DIM; // 0..1
  if (level === "H") return norm;
  if (level === "L") return 1 - norm;
  return 1 - 2 * Math.abs(norm - 0.5);
}

export function scoreType(type: KbtiType, profile: Profile): number {
  if (type.match.length === 0) return 0;
  let s = 0;
  for (const c of type.match) s += conditionScore(profile, c.dim, c.level);
  return (s / type.match.length) * 100;
}

export type MatchResult = {
  type: KbtiType;
  match: number; // 0..100
  hidden: boolean;
};

export function pickResult(answers: AnswerLetter[]): MatchResult {
  // Hidden 치맥: Q9 (index 8) = C AND Q12 (index 11) = C.
  if (answers[8] === "C" && answers[11] === "C") {
    return { type: HIDDEN_CHIMAEK, match: 100, hidden: true };
  }

  const profile = buildProfile(answers);
  let best: { type: KbtiType; score: number } = { type: TYPES[0], score: -1 };
  for (const t of TYPES) {
    const sc = scoreType(t, profile);
    if (sc > best.score) best = { type: t, score: sc };
  }
  return { type: best.type, match: Math.round(best.score), hidden: false };
}

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const TOTAL_TYPES = TYPES.length + 1; // +1 hidden
