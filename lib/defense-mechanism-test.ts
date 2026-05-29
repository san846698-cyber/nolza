export type DefenseLocale = "ko" | "en";

export type DefenseMechanismId =
  | "humor"
  | "rationalization"
  | "avoidance"
  | "intellectualization"
  | "sublimation"
  | "suppression"
  | "projection"
  | "reactionFormation";

export type LocalizedText = Record<DefenseLocale, string>;
export type DefenseScore = Partial<Record<DefenseMechanismId, number>>;

export type DefenseAnswer = {
  id: string;
  text: LocalizedText;
  scores: DefenseScore;
};

export type DefenseQuestion = {
  id: string;
  targetDimension: string;
  rationale: string;
  scene: LocalizedText;
  question: LocalizedText;
  answers: DefenseAnswer[];
};

export type DefenseResult = {
  id: DefenseMechanismId;
  name: LocalizedText;
  oneLiner: LocalizedText;
  description: LocalizedText;
  strength: LocalizedText;
  weakPoint: LocalizedText;
  whenHelps: LocalizedText;
  carefulWhen: LocalizedText;
  innerProcess: LocalizedText;
  outwardLook: LocalizedText;
  innerQuote: LocalizedText;
  protectiveReason: LocalizedText;
  repeatedPattern: LocalizedText;
  gentlePractice: LocalizedText;
  shareLine: LocalizedText;
  accent: string;
};

export const DEFENSE_RESULT_ORDER: DefenseMechanismId[] = [
  "humor",
  "rationalization",
  "avoidance",
  "intellectualization",
  "sublimation",
  "suppression",
  "projection",
  "reactionFormation",
];

export const DEFENSE_COPY = {
  languageLabel: { ko: "언어 선택", en: "Language selection" },
  badge: { ko: "심리 테스트", en: "Psychology Test" },
  title: { ko: "방어기제 테스트", en: "Defense Mechanism Test" },
  subtitle: {
    ko: "불편한 마음이 올라올 때, 나는 어떤 방식으로 나를 보호할까요?",
    en: "How do you protect yourself when uncomfortable feelings come up?",
  },
  start: { ko: "테스트 시작하기", en: "Start the test" },
  disclaimer: {
    ko: "이 테스트는 전문적인 진단이 아닌, 심리학/철학 개념을 바탕으로 만든 재미용 자기이해 콘텐츠입니다.",
    en: "This is not a professional diagnosis. It is an entertainment and self-reflection experience based on psychology/philosophy concepts.",
  },
  questionCount: { ko: "질문", en: "Question" },
  resultLoading: { ko: "당신의 보호 방식을 정리하는 중...", en: "Organizing your protection pattern..." },
  resultLabel: { ko: "나의 방어기제", en: "My Defense Mechanism" },
  strength: { ko: "강점", en: "Strength" },
  weakPoint: { ko: "조심할 점", en: "Watch out" },
  whenHelps: { ko: "도움이 되는 순간", en: "When it helps" },
  carefulWhen: { ko: "주의할 순간", en: "Be careful when" },
  deeperTitle: { ko: "조금 더 들여다보면", en: "A closer look" },
  innerProcess: { ko: "내 마음이 이렇게 움직여요", en: "How your mind moves" },
  outwardLook: { ko: "겉으로 보이는 모습", en: "How it may look outside" },
  innerQuote: { ko: "속으로 자주 하는 말", en: "What you may say inside" },
  protectiveReason: { ko: "이 방식이 나를 지켜주는 이유", en: "Why this protects you" },
  repeatedPattern: { ko: "하지만 오래 반복되면", en: "If it repeats for too long" },
  gentlePractice: { ko: "조금 더 편해지는 연습", en: "A small practice" },
  scoreTitle: { ko: "방어기제 경향", en: "Defense tendency" },
  share: { ko: "결과 공유하기", en: "Share result" },
  copied: { ko: "링크 복사됨", en: "Link copied" },
  retry: { ko: "다시 하기", en: "Retry" },
  related: { ko: "다음 추천 테스트", en: "Recommended next" },
} satisfies Record<string, LocalizedText>;

export const DEFENSE_RESULTS: Record<DefenseMechanismId, DefenseResult> = {
  humor: {
    id: "humor",
    name: { ko: "유머화", en: "Humor" },
    oneLiner: {
      ko: "아픈 걸 웃긴 말로 바꿔서 버티는 사람",
      en: "You turn discomfort into jokes so it becomes easier to carry.",
    },
    description: {
      ko: "당신은 불편하거나 힘든 상황에서도 분위기를 무겁게 만들기보다 웃음으로 넘기려는 편입니다. 농담은 단순한 회피가 아니라, 당신이 감정을 다루는 방식일 수 있어요. 다만 너무 오래 웃음으로만 넘기면 진짜 속마음이 묻힐 수 있습니다.",
      en: "When things feel uncomfortable or heavy, you often make them lighter through humor. Joking may be your way of making emotions easier to handle. But if everything becomes a joke, your real feelings can stay hidden for too long.",
    },
    strength: {
      ko: "분위기를 부드럽게 만들고, 무거운 감정을 다루기 쉽게 바꿉니다.",
      en: "You soften the mood and make heavy feelings easier to approach.",
    },
    weakPoint: {
      ko: "진짜 속마음을 말해야 할 순간에도 농담으로 넘길 수 있습니다.",
      en: "You may joke even when your real feelings need to be spoken plainly.",
    },
    whenHelps: {
      ko: "긴장이 너무 올라가서 모두가 굳어 있을 때, 작은 웃음으로 숨 쉴 틈을 만들 수 있습니다.",
      en: "When tension is high, a little humor can create space to breathe.",
    },
    carefulWhen: {
      ko: "상대가 진지한 대화를 원하거나, 나도 사실은 위로가 필요한 순간입니다.",
      en: "Be careful when someone wants a serious conversation, or when you actually need comfort.",
    },
    innerProcess: {
      ko: "상처를 받거나 민망할 때, 당신의 마음은 먼저 분위기를 가볍게 만들 방법을 찾습니다. 웃음이 생기면 감정의 무게가 조금 줄어들고, 나도 상대도 덜 불편해진다고 느끼기 때문입니다.",
      en: "When you feel hurt or embarrassed, your mind quickly looks for a way to make the mood lighter. If people can laugh, the feeling seems less heavy and everyone feels a little safer.",
    },
    outwardLook: {
      ko: "겉으로는 밝고 센스 있으며 분위기를 잘 풀어주는 사람처럼 보일 수 있습니다. 하지만 속으로는 웃으면서도 방금 받은 상처를 혼자 붙잡고 있을 때가 있어요.",
      en: "You may look bright, witty, and good at easing tension. Inside, though, you may still be holding the hurt while everyone else thinks the moment has passed.",
    },
    innerQuote: {
      ko: "“일단 웃기게 넘기자. 너무 심각해지면 더 이상해질 것 같아.”",
      en: "\"Let me make it funny first. If it gets too serious, it will feel even stranger.\"",
    },
    protectiveReason: {
      ko: "유머는 감정을 바로 드러내지 않아도 마음을 보호할 수 있게 해줍니다. 웃음이라는 완충재가 있어서 불편한 말이나 상황을 조금 더 견딜 수 있게 됩니다.",
      en: "Humor lets you protect your feelings without exposing them right away. It creates a cushion between you and an uncomfortable moment.",
    },
    repeatedPattern: {
      ko: "하지만 계속 웃음으로만 넘기면, 주변 사람들은 당신이 정말 괜찮다고 믿을 수 있습니다. 정작 필요한 위로나 사과를 받을 기회가 줄어들 수 있어요.",
      en: "But if every hard feeling becomes a joke, people may believe you are truly fine. You may miss the comfort or apology you actually needed.",
    },
    gentlePractice: {
      ko: "농담을 한 뒤에 마음속으로 한 번만 물어보세요. “웃기게 말했지만, 사실 나는 뭐가 조금 아팠지?”",
      en: "After the joke, ask yourself once: \"I made it funny, but what actually hurt a little?\"",
    },
    shareLine: {
      ko: "나는 힘들 때 유머화로 버티는 타입이래.",
      en: "Apparently, I get through hard moments with humor.",
    },
    accent: "#f2c879",
  },
  rationalization: {
    id: "rationalization",
    name: { ko: "합리화", en: "Rationalization" },
    oneLiner: {
      ko: "괜찮은 이유를 만들어서 마음을 납득시키는 사람",
      en: "You protect yourself by finding reasons that make things feel acceptable.",
    },
    description: {
      ko: "당신은 상처받거나 실패했을 때 감정에 바로 빠지기보다, 그럴듯한 이유를 찾아 마음을 정리하려는 편입니다. 이 방식은 흔들림을 줄여주지만, 가끔은 진짜 서운함이나 실망을 너무 빨리 덮어버릴 수 있어요.",
      en: "When you feel hurt or disappointed, you often look for reasonable explanations before sinking into the feeling. This can steady you, but it may also cover up sadness or disappointment too quickly.",
    },
    strength: {
      ko: "상황을 납득 가능한 형태로 정리하는 힘이 있습니다.",
      en: "You can organize confusing situations into something understandable.",
    },
    weakPoint: {
      ko: "진짜 감정을 인정하기 전에 이유부터 만들 수 있습니다.",
      en: "You may build reasons before admitting what you truly feel.",
    },
    whenHelps: {
      ko: "실수나 거절 이후에 마음이 너무 흔들리지 않도록 균형을 잡아야 할 때 도움이 됩니다.",
      en: "It helps after mistakes or rejection, when you need a steadier view.",
    },
    carefulWhen: {
      ko: "괜찮은 이유는 많은데 마음은 계속 서운한 상태라면, 설명보다 감정이 먼저일 수 있습니다.",
      en: "If you have many reasons but still feel hurt, the feeling may need attention first.",
    },
    innerProcess: {
      ko: "상처를 받거나 실망했을 때, 당신의 마음은 감정보다 먼저 이유를 찾으려 합니다. 상황을 납득 가능한 형태로 바꾸면 흔들림이 줄어들기 때문입니다.",
      en: "When you feel hurt or disappointed, your mind often looks for reasons before it fully feels the emotion. Turning the situation into something understandable helps you feel steadier.",
    },
    outwardLook: {
      ko: "겉으로는 이해심 있고 차분해 보일 수 있습니다. 하지만 속으로는 아직 서운한 마음이 남아 있는데도, 괜찮은 이유를 먼저 만들고 있을 수 있어요.",
      en: "You may seem understanding and calm. Inside, however, you may still feel hurt while already building reasons for why it was probably okay.",
    },
    innerQuote: {
      ko: "“그럴 만한 이유가 있었겠지. 내가 너무 크게 받아들인 걸 수도 있어.”",
      en: "\"There was probably a reason. Maybe I am taking it too seriously.\"",
    },
    protectiveReason: {
      ko: "이 방식은 감정이 한꺼번에 무너지지 않도록 도와줍니다. 이유를 찾는 동안 마음은 잠시 균형을 되찾고, 상황을 더 견딜 수 있는 형태로 바꿉니다.",
      en: "This keeps emotion from collapsing all at once. While you search for reasons, your mind regains balance and makes the situation more bearable.",
    },
    repeatedPattern: {
      ko: "하지만 모든 감정을 이유로만 정리하려 하면, 진짜 서운함이나 실망을 인정할 시간이 부족해질 수 있습니다. 마음은 납득했는데 감정은 아직 남아 있는 상태가 될 수 있어요.",
      en: "But if every feeling is handled only through reasons, sadness or disappointment may not get enough room. Your mind may accept it while your feelings are still there.",
    },
    gentlePractice: {
      ko: "이유를 찾은 뒤에는 “그래서 나는 실제로 어떤 감정을 느꼈지?”라고 한 번만 더 물어보세요.",
      en: "After finding the reason, ask once more: \"So what did I actually feel?\"",
    },
    shareLine: {
      ko: "나는 합리화 타입 나왔다. 괜찮은 이유를 찾는 데 너무 빠름.",
      en: "I got Rationalization. I find acceptable reasons a little too quickly.",
    },
    accent: "#9ed7c5",
  },
  avoidance: {
    id: "avoidance",
    name: { ko: "회피", en: "Avoidance" },
    oneLiner: {
      ko: "힘든 감정을 잠시 보이지 않는 곳으로 밀어두는 사람",
      en: "You step away from what feels too heavy until you can face it.",
    },
    description: {
      ko: "당신은 감정적으로 부담스러운 상황에서 잠시 거리를 두는 편입니다. 바로 마주하지 않는 것은 약함이 아니라, 스스로를 보호하려는 방식일 수 있어요. 다만 미뤄둔 감정은 언젠가 다시 돌아올 수 있습니다.",
      en: "You tend to create distance from emotionally heavy situations. Not facing something immediately can be a way of protecting yourself. Still, postponed feelings can return later.",
    },
    strength: {
      ko: "감정이 너무 커지기 전에 자신을 보호할 수 있습니다.",
      en: "You can protect yourself before feelings become overwhelming.",
    },
    weakPoint: {
      ko: "중요한 문제를 오래 미루면 더 커질 수 있습니다.",
      en: "If important issues are delayed for too long, they can grow heavier.",
    },
    whenHelps: {
      ko: "감정이 너무 커서 지금 당장 대화하면 더 상처가 될 것 같을 때 도움이 됩니다.",
      en: "It helps when talking right away would only make things sharper.",
    },
    carefulWhen: {
      ko: "피하는 동안 문제를 해결했다고 느끼지만, 실제로는 아무것도 정리되지 않았을 때입니다.",
      en: "Be careful when avoiding feels like solving, but nothing has actually been resolved.",
    },
    innerProcess: {
      ko: "마음이 감당하기 어려운 장면을 만나면, 당신은 먼저 거리를 만들려 합니다. 잠깐 보지 않고, 듣지 않고, 생각하지 않으면 감정이 덜 커질 것 같기 때문입니다.",
      en: "When a situation feels too much to hold, your mind tries to create distance first. Not looking, not hearing, or not thinking can make the feeling seem smaller for a while.",
    },
    outwardLook: {
      ko: "겉으로는 조용히 물러나거나 아무렇지 않은 척하는 사람처럼 보일 수 있습니다. 주변 사람은 당신이 관심이 없거나 정리가 끝났다고 오해할 수도 있어요.",
      en: "You may look quiet, distant, or unaffected. Others might mistake your distance for indifference or assume you have already moved on.",
    },
    innerQuote: {
      ko: "“지금은 못 보겠어. 조금만 나중에 생각하자.”",
      en: "\"I cannot look at this right now. I will think about it later.\"",
    },
    protectiveReason: {
      ko: "회피는 마음이 너무 뜨거워졌을 때 잠시 식힐 시간을 줍니다. 바로 마주하면 더 다칠 것 같은 순간에 스스로를 보호하는 멈춤 버튼이 됩니다.",
      en: "Avoidance gives your mind time to cool down when everything feels too hot. It can be a pause button when facing it immediately would hurt more.",
    },
    repeatedPattern: {
      ko: "하지만 계속 미루기만 하면 감정은 사라지기보다 쌓일 수 있습니다. 어느 날 사소한 일에 갑자기 크게 흔들리는 이유가 될 수 있어요.",
      en: "But if things are only postponed, feelings may pile up instead of disappearing. Later, a small moment can suddenly feel much bigger.",
    },
    gentlePractice: {
      ko: "피하고 싶을 때는 완전히 닫기보다 “10분만 쉬고 다시 볼게”처럼 돌아올 시간을 작게 정해보세요.",
      en: "When you want to avoid something, try setting a small return point: \"I will rest for ten minutes, then look again.\"",
    },
    shareLine: {
      ko: "나는 회피 타입 나왔다. 일단 안 보고 마음을 살림.",
      en: "I got Avoidance. First I look away, then I survive.",
    },
    accent: "#a8b8e8",
  },
  intellectualization: {
    id: "intellectualization",
    name: { ko: "지성화", en: "Intellectualization" },
    oneLiner: {
      ko: "감정보다 분석으로 버티는 사람",
      en: "You handle emotions by turning them into something you can analyze.",
    },
    description: {
      ko: "당신은 힘든 상황에서도 감정에 휩쓸리기보다 원인, 구조, 논리, 맥락을 먼저 보려는 편입니다. 분석은 당신에게 안정감을 줍니다. 하지만 모든 감정을 설명하려고 하면, 정작 느껴야 할 감정은 뒤로 밀릴 수 있어요.",
      en: "Even in difficult moments, you tend to look for causes, patterns, logic, and context before letting emotion take over. Analysis gives you stability, but if every feeling must be explained, the feeling itself can be delayed.",
    },
    strength: {
      ko: "혼란스러운 상황을 차분하게 분석할 수 있습니다.",
      en: "You can calmly analyze situations that feel messy or confusing.",
    },
    weakPoint: {
      ko: "감정을 이해하려다 감정을 느끼는 일을 미룰 수 있습니다.",
      en: "You may postpone feeling something because you are busy understanding it.",
    },
    whenHelps: {
      ko: "복잡한 갈등에서 한 걸음 떨어져 원인과 선택지를 봐야 할 때 도움이 됩니다.",
      en: "It helps when complex conflict needs distance, structure, and options.",
    },
    carefulWhen: {
      ko: "내 마음을 논리적으로 설명할 수는 있는데, 몸은 계속 긴장해 있을 때입니다.",
      en: "Be careful when your mind can explain everything, but your body still feels tense.",
    },
    innerProcess: {
      ko: "불편한 감정이 올라오면, 당신의 마음은 그것을 바로 느끼기보다 구조와 원인으로 바꾸려 합니다. 감정을 분석 가능한 대상으로 만들면 덜 휩쓸린다고 느끼기 때문입니다.",
      en: "When discomfort rises, your mind turns it into structure and causes before fully feeling it. If emotion becomes something to analyze, it feels less likely to sweep you away.",
    },
    outwardLook: {
      ko: "겉으로는 침착하고 이성적이며 설명을 잘하는 사람처럼 보일 수 있습니다. 하지만 속으로는 감정보다 해석이 너무 빨리 앞서가고 있을 수 있어요.",
      en: "You may look calm, reasonable, and articulate. Inside, interpretation may be moving faster than the actual feeling.",
    },
    innerQuote: {
      ko: "“왜 이런 반응이 나왔는지 먼저 이해해야 해.”",
      en: "\"I need to understand why this reaction happened first.\"",
    },
    protectiveReason: {
      ko: "지성화는 감정과 나 사이에 안전한 거리를 만들어줍니다. 생각으로 다루는 동안 마음은 덜 노출되고, 상황을 통제할 수 있다는 감각을 얻습니다.",
      en: "Intellectualization creates a safer distance between you and the feeling. While you think it through, you feel less exposed and more in control.",
    },
    repeatedPattern: {
      ko: "하지만 계속 분석만 하면 감정은 이해됐지만 느껴지지 않은 채 남을 수 있습니다. 머리는 정리됐는데 몸과 마음은 아직 긴장한 상태가 될 수 있어요.",
      en: "But if you only analyze, the feeling may be understood without being felt. Your mind may be organized while your body is still tense.",
    },
    gentlePractice: {
      ko: "정리한 뒤에는 “설명은 됐고, 지금 내 몸은 어디가 긴장돼 있지?”라고 확인해보세요.",
      en: "After organizing the facts, ask: \"The explanation is clear, but where does my body still feel tense?\"",
    },
    shareLine: {
      ko: "나는 지성화 타입이래. 감정도 분석부터 함.",
      en: "I got Intellectualization. Even feelings get analyzed first.",
    },
    accent: "#8bd3ff",
  },
  sublimation: {
    id: "sublimation",
    name: { ko: "승화", en: "Sublimation" },
    oneLiner: {
      ko: "힘든 에너지를 일, 목표, 창작으로 바꾸는 사람",
      en: "You turn difficult feelings into work, growth, or creation.",
    },
    description: {
      ko: "당신은 불안, 분노, 슬픔 같은 감정을 그냥 터뜨리기보다 무언가 생산적인 방향으로 바꾸려는 편입니다. 공부, 일, 운동, 창작, 목표 달성이 감정을 처리하는 통로가 될 수 있어요. 다만 성취만으로 마음을 달래려 하면 쉬는 법을 잊을 수 있습니다.",
      en: "You often turn anxiety, anger, or sadness into something productive. Work, study, exercise, creation, or goals can become channels for your feelings. But if achievement is the only comfort, rest can become hard to allow.",
    },
    strength: {
      ko: "힘든 감정을 성장과 결과로 바꾸는 힘이 있습니다.",
      en: "You can transform difficult feelings into growth and tangible results.",
    },
    weakPoint: {
      ko: "쉬어야 할 때도 계속 무언가를 해야 한다고 느낄 수 있습니다.",
      en: "You may feel you must keep doing something even when rest is needed.",
    },
    whenHelps: {
      ko: "가만히 있으면 감정이 더 커질 때, 손에 잡히는 행동이 마음의 통로가 됩니다.",
      en: "It helps when action gives your feelings somewhere useful to go.",
    },
    carefulWhen: {
      ko: "성과는 나왔는데 마음은 여전히 돌봄을 기다리고 있을 때입니다.",
      en: "Be careful when the work is finished, but your heart still needs care.",
    },
    innerProcess: {
      ko: "힘든 감정이 생기면, 당신의 마음은 그것을 멈춰 세우기보다 어딘가에 쓰려고 합니다. 불안, 분노, 서운함도 목표나 작업으로 옮겨가면 덜 막막하게 느껴집니다.",
      en: "When difficult feelings appear, your mind tries to use them instead of freezing. Anxiety, anger, or hurt can feel less overwhelming when moved into a goal or task.",
    },
    outwardLook: {
      ko: "겉으로는 성실하고 생산적인 사람처럼 보일 수 있습니다. 힘든 일이 있어도 뭔가를 해내고 있어서, 주변은 당신이 잘 버티고 있다고 생각할 수 있어요.",
      en: "You may look diligent and productive. Because you keep doing things even when it is hard, people may assume you are handling everything well.",
    },
    innerQuote: {
      ko: "“가만히 있으면 더 힘드니까, 뭐라도 하자.”",
      en: "\"If I stay still, it will feel worse. Let me do something.\"",
    },
    protectiveReason: {
      ko: "승화는 감정의 에너지를 망가지지 않는 방향으로 흘려보내게 해줍니다. 마음이 복잡할 때도 움직일 수 있는 길을 만들어줍니다.",
      en: "Sublimation lets emotional energy move in a direction that does not break you. It gives your mind somewhere useful to go.",
    },
    repeatedPattern: {
      ko: "하지만 계속 결과로만 감정을 처리하면, 쉬어야 할 때도 스스로를 몰아붙일 수 있습니다. 성취는 남았지만 마음은 아직 쉬지 못했을 수 있어요.",
      en: "But if feelings are processed only through results, you may push yourself even when you need rest. The achievement may be real while your heart still needs care.",
    },
    gentlePractice: {
      ko: "무언가를 해낸 뒤에는 “이제 결과 말고 내 마음도 잠깐 챙겨도 된다”고 말해보세요.",
      en: "After finishing something, try saying: \"The result is done. My feelings can have a moment too.\"",
    },
    shareLine: {
      ko: "나는 승화 타입 나왔다. 힘든 걸 결과물로 바꾸는 편.",
      en: "I got Sublimation. I tend to turn hard feelings into results.",
    },
    accent: "#d2b6ff",
  },
  suppression: {
    id: "suppression",
    name: { ko: "억압", en: "Suppression" },
    oneLiner: {
      ko: "감정을 잠시 접어두고 눈앞의 일을 먼저 해내는 사람",
      en: "You push feelings aside so you can keep going.",
    },
    description: {
      ko: "당신은 감정이 흔들려도 당장 해야 할 일을 멈추지 않으려는 편입니다. 일단 버티고, 지나가고, 나중에 생각하려고 합니다. 이 방식은 위기에서 강해 보이게 만들지만, 쌓인 감정이 늦게 찾아올 수 있어요.",
      en: "Even when your feelings are shaken, you try not to stop what must be done. You endure first and think later. This can make you steady in a crisis, but delayed feelings may arrive all at once.",
    },
    strength: {
      ko: "당장 해야 할 일을 해내는 힘이 있습니다.",
      en: "You can keep functioning when something still needs to be done.",
    },
    weakPoint: {
      ko: "접어둔 감정이 나중에 한꺼번에 피로로 돌아올 수 있습니다.",
      en: "You may seem fine until exhaustion catches up later.",
    },
    whenHelps: {
      ko: "마감, 책임, 급한 일이 있어서 잠시 마음을 접어두어야 할 때 도움이 됩니다.",
      en: "It helps when a deadline or responsibility needs your focus right now.",
    },
    carefulWhen: {
      ko: "겉으로는 기능하고 있지만 사소한 일에도 금방 에너지가 닳는 상태입니다.",
      en: "Be careful when you keep saying you are fine, but tiny things drain you quickly.",
    },
    innerProcess: {
      ko: "감정이 올라와도 당신의 마음은 우선 해야 할 일을 앞에 둡니다. 지금 무너지면 안 된다고 느껴서, 마음을 잠시 접어두고 기능하는 쪽을 선택합니다.",
      en: "Even when feelings rise, your mind puts the next responsibility first. You may choose to function now because falling apart does not feel possible.",
    },
    outwardLook: {
      ko: "겉으로는 침착하고 책임감 있어 보일 수 있습니다. 하지만 속으로는 처리하지 못한 감정을 잠시 뒤쪽에 보관해두고 있을 때가 있어요.",
      en: "You may look calm and responsible. Inside, though, you may be quietly pushing aside feelings that are not actually okay.",
    },
    innerQuote: {
      ko: "“지금은 일단 괜찮아야 해. 나중에 생각하자.”",
      en: "\"I need to be okay for now. I can think about it later.\"",
    },
    protectiveReason: {
      ko: "억압은 당장 해야 할 일을 해낼 수 있게 도와줍니다. 감정이 너무 크게 올라와도 삶의 리듬을 완전히 멈추지 않게 붙잡아줍니다.",
      en: "Suppression helps you get through what must be done. It keeps life from stopping completely when feelings become intense.",
    },
    repeatedPattern: {
      ko: "하지만 계속 밀어두면 작은 일에도 쉽게 지칠 수 있습니다. 감정은 사라진 것이 아니라 처리될 차례를 기다리고 있었을 수 있어요.",
      en: "But if everything is pushed away, small things can become strangely draining. The feeling may not be gone; it may simply be waiting.",
    },
    gentlePractice: {
      ko: "하루가 끝난 뒤 “오늘 잠시 접어둔 감정이 있었나?”를 짧게 떠올려보세요.",
      en: "At the end of the day, briefly ask: \"Was there a moment when pretending to be okay took effort?\"",
    },
    shareLine: {
      ko: "나는 억압 타입이래. 감정을 잠깐 접어두고 버티는 편.",
      en: "I got Suppression. Acting fine is almost automatic.",
    },
    accent: "#f0a7a1",
  },
  projection: {
    id: "projection",
    name: { ko: "투사", en: "Projection" },
    oneLiner: {
      ko: "내 불안을 상대의 반응에서 먼저 발견하는 사람",
      en: "You may notice your own worries through what you think others are feeling.",
    },
    description: {
      ko: "당신은 불안하거나 예민해졌을 때 바깥의 신호를 촘촘히 읽으려는 편입니다. 때로는 내 안의 걱정이 상대의 마음처럼 느껴질 수 있어요. 이 방식은 상처를 빨리 피하려는 마음의 경보 장치처럼 작동하지만, 확인되지 않은 추측은 나를 더 지치게 만들 수 있습니다.",
      en: "When you feel anxious or sensitive, you may search for signals in another person’s tone, face, or reaction. Sometimes your worry can feel like their opinion. This can mean you care deeply about relationships, but unchecked guesses can be tiring.",
    },
    strength: {
      ko: "관계의 작은 변화에 민감하고 섬세합니다.",
      en: "You are sensitive to small shifts in relationships.",
    },
    weakPoint: {
      ko: "상대의 마음을 너무 빨리 추측할 수 있습니다.",
      en: "You may guess what someone feels before checking what is true.",
    },
    whenHelps: {
      ko: "상대의 미묘한 변화가 실제로 중요한 신호일 때, 빠르게 분위기를 알아차릴 수 있습니다.",
      en: "It helps when subtle shifts really matter and need to be noticed.",
    },
    carefulWhen: {
      ko: "확인하지 않은 생각이 사실처럼 느껴져서 혼자 지칠 때입니다.",
      en: "Be careful when an unconfirmed thought starts to feel like a fact.",
    },
    innerProcess: {
      ko: "불안하거나 예민해질 때, 당신의 마음은 부족한 정보를 바깥의 신호로 채우려 합니다. 내 안의 걱정이 상대의 분위기에서 먼저 보이는 것처럼 느껴질 수 있습니다.",
      en: "When you feel anxious or sensitive, your mind reads outside reactions more closely. Your own worry may seem to appear first in another person's tone or expression.",
    },
    outwardLook: {
      ko: "겉으로는 눈치가 빠르고 분위기를 잘 읽는 사람처럼 보일 수 있습니다. 하지만 때로는 확인되지 않은 신호까지 너무 진지하게 받아들이고 있을 수 있어요.",
      en: "You may look perceptive and quick to read the room. At times, though, you may treat unconfirmed signals as more certain than they are.",
    },
    innerQuote: {
      ko: "“저 사람 지금 나한테 불편한가? 뭔가 달라진 것 같은데.”",
      en: "\"Are they uncomfortable with me? Something feels different.\"",
    },
    protectiveReason: {
      ko: "투사는 관계에서 위험을 빨리 알아차리게 해줍니다. 상처받기 전에 대비하려는 마음의 경보 장치처럼 작동합니다.",
      en: "Projection can work like an alarm system in relationships. It helps you prepare before you get hurt.",
    },
    repeatedPattern: {
      ko: "하지만 오래 반복되면 내 불안과 상대의 실제 마음이 섞일 수 있습니다. 확인하지 않은 생각이 사실처럼 굳어질 수 있어요.",
      en: "But if it repeats for too long, your worry and the other person's actual feelings can blur together. A guess can start to feel like a fact.",
    },
    gentlePractice: {
      ko: "추측이 강해질 때는 “이건 확인한 사실일까, 내가 걱정해서 느끼는 걸까?”라고 나눠보세요.",
      en: "When a guess feels strong, ask: \"Did I confirm this, or am I feeling it because I am worried?\"",
    },
    shareLine: {
      ko: "나는 투사 타입 나왔다. 상대 반응에서 내 불안을 읽는 편.",
      en: "I got Projection. I sometimes read my own worry in other people’s reactions.",
    },
    accent: "#ffd18f",
  },
  reactionFormation: {
    id: "reactionFormation",
    name: { ko: "반동형성", en: "Reaction Formation" },
    oneLiner: {
      ko: "진짜 마음과 반대로 행동하며 자신을 지키는 사람",
      en: "You sometimes protect yourself by acting opposite to what you feel.",
    },
    description: {
      ko: "당신은 마음이 들키는 것이 불편할 때 오히려 반대로 행동할 수 있습니다. 좋아하면서 무심하게 굴거나, 서운할수록 더 태연하게 보이려 하고, 불안할수록 더 단단한 모습을 꺼내는 식입니다. 이 방식은 마음을 숨기는 데 도움이 되지만, 가까운 사람에게는 오해를 만들 수 있어요.",
      en: "When showing your real feelings feels uncomfortable, you may act in the opposite direction. You might seem indifferent when you care, fine when you are hurt, or extra strong when you are nervous. It can hide your heart, but it may confuse people close to you.",
    },
    strength: {
      ko: "감정을 바로 드러내지 않고 자신을 보호할 수 있습니다.",
      en: "You can protect yourself by not revealing feelings too quickly.",
    },
    weakPoint: {
      ko: "진짜 마음과 행동이 달라져 관계가 헷갈릴 수 있습니다.",
      en: "Your actions may differ from your feelings, making relationships confusing.",
    },
    whenHelps: {
      ko: "마음이 너무 쉽게 들킬 것 같아 잠시 표정을 관리해야 할 때 도움이 됩니다.",
      en: "It helps when you need a moment before revealing something vulnerable.",
    },
    carefulWhen: {
      ko: "상대가 내 반대 행동을 진짜 뜻으로 받아들이기 시작할 때입니다.",
      en: "Be careful when others start believing the opposite act is your real meaning.",
    },
    innerProcess: {
      ko: "마음을 들키는 것이 불편할 때, 당신은 실제 감정과 반대되는 행동을 먼저 꺼낼 수 있습니다. 좋아할수록 무심해지고, 상처받을수록 더 태연한 얼굴을 만들 수 있어요.",
      en: "When revealing your feelings feels uncomfortable, you may first act in the opposite direction. The more you care, the more indifferent you may seem; the more hurt you are, the more fine you may act.",
    },
    outwardLook: {
      ko: "겉으로는 쿨하거나 강한 사람처럼 보일 수 있습니다. 하지만 가까운 사람은 당신의 진짜 마음을 읽기 어려워 혼란스러울 수 있습니다.",
      en: "You may look cool or strong. But people close to you may feel confused because your real feelings are hard to read.",
    },
    innerQuote: {
      ko: "“티 내면 지는 것 같아. 아무렇지 않은 척하자.”",
      en: "\"If I show it, I lose. Let me act like it does not matter.\"",
    },
    protectiveReason: {
      ko: "반동형성은 마음을 너무 빨리 노출하지 않게 지켜줍니다. 거절당하거나 약해 보일까 봐 두려운 순간에 자신을 단단하게 세워줍니다.",
      en: "Reaction formation keeps your heart from being exposed too quickly. It helps you stand firm when rejection or vulnerability feels scary.",
    },
    repeatedPattern: {
      ko: "하지만 계속 반대로 행동하면, 사람들이 당신의 진짜 마음과 멀어질 수 있습니다. 원하는 것과 전혀 다른 반응을 받게 될 수도 있어요.",
      en: "But if you keep acting opposite to what you feel, people may move farther from your real heart. You may receive the opposite of what you actually wanted.",
    },
    gentlePractice: {
      ko: "완전히 드러내기 어렵다면 “사실 조금 신경 쓰였어”처럼 아주 작은 진심부터 꺼내보세요.",
      en: "If full honesty feels hard, try a small truth first: \"Actually, that bothered me a little.\"",
    },
    shareLine: {
      ko: "나는 반동형성 타입이래. 진짜 마음이랑 반대로 행동할 때 있음.",
      en: "I got Reaction Formation. Sometimes I act opposite to what I feel.",
    },
    accent: "#f6b5d5",
  },
};

export const DEFENSE_QUESTIONS: DefenseQuestion[] = [
  {
    "id": "dm_01",
    "targetDimension": "suppression/humor/rationalization/intellectualization",
    "rationale": "Mild social hurt reveals the first protective move without naming defense styles.",
    "scene": {
      "ko": "친구가 별생각 없이 한 말에 조금 기분이 상했습니다. 바로 티 내기엔 애매한 분위기입니다.",
      "en": "A friend says something casually, and you feel a little hurt. It feels awkward to show it right away."
    },
    "question": {
      "ko": "당신에게 가장 가까운 반응은?",
      "en": "What reaction feels closest?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "상처 난 티는 숨기고 평소처럼 답하되 말수가 줄어든다.",
          "en": "I hide that it hurt and reply normally, but with fewer words."
        },
        "scores": {
          "suppression": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "분위기를 깨기 싫어 더 가볍게 농담한다.",
          "en": "I joke even more lightly because I do not want to break the mood."
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "그럴 뜻은 아니었을 거라고 이유를 붙여 넘긴다.",
          "en": "I add a reason like they probably did not mean it and let it pass."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "왜 그 말에 기분이 상했는지 혼자 차분히 되짚어본다.",
          "en": "I calmly replay why that comment bothered me."
        },
        "scores": {
          "intellectualization": 2
        }
      }
    ]
  },
  {
    "id": "dm_02",
    "targetDimension": "humor/rationalization/avoidance/intellectualization",
    "rationale": "Feedback after effort creates disappointment while keeping all answer options socially plausible.",
    "scene": {
      "ko": "열심히 준비한 발표가 끝난 뒤, 상대가 “나쁘진 않은데 기대보다는 평범했어”라고 말했습니다. 분위기는 어색하지 않지만 조금 실망했습니다.",
      "en": "After a presentation you worked hard on, someone says, “It was not bad, just more ordinary than I expected.” The mood is not awkward, but the words stay."
    },
    "question": {
      "ko": "그날 저녁 당신에게 가장 가까운 모습은?",
      "en": "What are you most likely to do that evening?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "“역시 내가 너무 기대했나 봐” 하며 웃긴 이야기처럼 바꿔 말한다.",
          "en": "I turn it into a funny story, like “I guess I hyped myself up too much.”"
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "말투가 거칠진 않았다고 스스로 납득해본다.",
          "en": "I tell myself their tone was not harsh and try to accept it."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "당분간 그 발표 이야기는 꺼내고 싶지 않다.",
          "en": "I do not want to bring up that presentation for a while."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "구성, 예시, 말투 중 무엇이 약했는지 뜯어본다.",
          "en": "I break down whether the structure, examples, or delivery felt weak."
        },
        "scores": {
          "intellectualization": 2
        }
      }
    ]
  },
  {
    "id": "dm_03",
    "targetDimension": "projection/reactionFormation/suppression/rationalization",
    "rationale": "Ambiguous short replies invite interpretation, overcompensation, or contained hurt.",
    "scene": {
      "ko": "가까운 사람이 평소보다 짧게 답했습니다. 바쁜 날일 수도 있지만, 어딘가 차갑게 느껴집니다.",
      "en": "Someone close replies more briefly than usual. They may be busy, but it feels a little cold."
    },
    "question": {
      "ko": "가장 자연스러운 반응은?",
      "en": "What feels most natural?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "내 불편함이 티 나지 않게 평소보다 더 밝게 답한다.",
          "en": "I reply even brighter than usual so my discomfort does not show."
        },
        "scores": {
          "reactionFormation": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "괜히 묻지 말자고 마음을 누르고 평소처럼 답한다.",
          "en": "I tell myself not to ask and reply as usual while holding it in."
        },
        "scores": {
          "suppression": 2,
          "rationalization": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "상대가 이미 나를 불편해하는 것 같다고 느낀다.",
          "en": "It feels like the other person is already uncomfortable with me."
        },
        "scores": {
          "projection": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "바쁜 날이라 짧았을 거라고 이유를 붙인다.",
          "en": "I explain it as a busy day and give the short reply a reason."
        },
        "scores": {
          "rationalization": 2
        }
      }
    ]
  },
  {
    "id": "dm_04",
    "targetDimension": "sublimation/suppression/avoidance/intellectualization",
    "rationale": "Deadline pressure shows whether discomfort becomes action, containment, distance, or analysis.",
    "scene": {
      "ko": "마감이 가까운데 이미 지쳐 있습니다. 주변에서는 “이번 건 네가 잘하잖아”라고 기대합니다.",
      "en": "A deadline is close, and you already feel drained. People around you say, “You are good at this one.”"
    },
    "question": {
      "ko": "그 순간 가장 가까운 행동은?",
      "en": "What action feels closest in that moment?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "힘든 티는 미루고 오늘 끝낼 한 가지만 잡는다.",
          "en": "I set aside how hard it feels and pick one thing to finish today."
        },
        "scores": {
          "suppression": 1,
          "intellectualization": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "답답함을 동력 삼아 결과물을 더 다듬는다.",
          "en": "I use the frustration as fuel to refine the work."
        },
        "scores": {
          "sublimation": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "잠깐 다른 일을 하며 그 생각에서 벗어나려 한다.",
          "en": "I do something else for a while to get away from the thought."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "기대, 마감, 체력 중 뭐가 부담인지 분리해본다.",
          "en": "I separate whether the pressure is expectation, deadline, or fatigue."
        },
        "scores": {
          "intellectualization": 2
        }
      }
    ]
  },
  {
    "id": "dm_05",
    "targetDimension": "humor/rationalization/avoidance/intellectualization",
    "rationale": "A small embarrassed moment tests whether the user lightens, explains, avoids, or analyzes the feeling.",
    "scene": {
      "ko": "실수한 장면을 누군가 가볍게 농담으로 언급했습니다. 분위기는 웃고 있지만 당신은 조금 민망해졌습니다.",
      "en": "Someone lightly jokes about a mistake you made. The mood is playful, but you feel a little embarrassed."
    },
    "question": {
      "ko": "가장 가까운 반응은?",
      "en": "What reaction feels closest?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "나도 웃으며 더 웃긴 말로 넘긴다.",
          "en": "I laugh too and turn it into an even funnier line."
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "장난 분위기였으니 깊게 받을 일은 아니라고 넘긴다.",
          "en": "I tell myself it was just a joking mood and not something to take deeply."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "그 장면은 잠시 생각하지 않으려 한다.",
          "en": "I try not to think about that scene for a while."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "어떤 말이 민망함을 키웠는지 혼자 짚어본다.",
          "en": "I privately identify which part of the joke made it feel embarrassing."
        },
        "scores": {
          "intellectualization": 2
        }
      }
    ]
  },
  {
    "id": "dm_06",
    "targetDimension": "sublimation/rationalization/avoidance/humor",
    "rationale": "Embarrassment in public is a compact scenario for protective coping.",
    "scene": {
      "ko": "사람들 앞에서 작은 실수를 했고, 몇 명이 웃었습니다. 악의는 없어 보이지만 얼굴이 뜨거워집니다.",
      "en": "You make a small mistake in front of people, and a few laugh. It does not seem malicious, but your face gets hot."
    },
    "question": {
      "ko": "이후 당신에게 가장 가까운 모습은?",
      "en": "What are you most likely to do after?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "“오늘 예능감 있네”처럼 먼저 웃어넘긴다.",
          "en": "I laugh first, saying something like “I am very entertaining today.”"
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "누구나 실수한다고 생각하며 장면을 줄이려 한다.",
          "en": "I remind myself everyone makes mistakes and try to shrink the scene."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "다음에는 같은 실수를 안 하게 작은 규칙을 만든다.",
          "en": "I make a small rule so I do not repeat it next time."
        },
        "scores": {
          "sublimation": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "그 자리를 빨리 벗어나고 싶어진다.",
          "en": "I want to leave the situation quickly."
        },
        "scores": {
          "avoidance": 2
        }
      }
    ]
  },
  {
    "id": "dm_07",
    "targetDimension": "projection/intellectualization/suppression/reactionFormation",
    "rationale": "Being misunderstood separates explanation, contained emotion, projection, and opposite behavior.",
    "scene": {
      "ko": "상대가 당신의 말을 다르게 받아들였습니다. 바로 설명하고 싶지만 감정도 같이 올라옵니다.",
      "en": "Someone takes your words differently than intended. You want to explain, but emotion rises too."
    },
    "question": {
      "ko": "가장 먼저 하게 되는 쪽은?",
      "en": "What do you tend to do first?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "오해가 생긴 지점을 차분히 정리해 말하려 한다.",
          "en": "I try to calmly explain where the misunderstanding started."
        },
        "scores": {
          "intellectualization": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "감정이 티 나지 않게 잠깐 말을 아낀다.",
          "en": "I hold back for a moment so my emotion does not show."
        },
        "scores": {
          "suppression": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "상대가 애초에 나를 안 좋게 보려는 것 같다고 느낀다.",
          "en": "It feels like they were already trying to see me negatively."
        },
        "scores": {
          "projection": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "괜히 더 부드럽게 굴며 불편하지 않은 척한다.",
          "en": "I act even softer, as if I am not uncomfortable."
        },
        "scores": {
          "reactionFormation": 2
        }
      }
    ]
  },
  {
    "id": "dm_08",
    "targetDimension": "avoidance/suppression/rationalization/sublimation",
    "rationale": "Immediate disappointment after a small public dismissal tests distancing, containment, explanation, and productive redirection.",
    "scene": {
      "ko": "모임에서 당신의 의견이 별다른 반응 없이 바로 넘어갔습니다. 큰일은 아니지만 그 순간 조금 서운합니다.",
      "en": "In a group setting, your opinion is passed over with little reaction. It is not a huge deal, but you feel a little hurt in the moment."
    },
    "question": {
      "ko": "당신에게 가까운 반응은?",
      "en": "What reaction feels closest?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "속상한 티를 숨기고 자리에 계속 앉아 있는다.",
          "en": "I hide that I am hurt and stay in the moment."
        },
        "scores": {
          "suppression": 1,
          "avoidance": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "회의 흐름상 깊게 다룰 시간이 없었을 거라고 생각한다.",
          "en": "I tell myself the flow probably did not allow time to discuss it."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "그 뒤로는 듣는 쪽으로 빠지고 말을 아낀다.",
          "en": "After that, I step into listening mode and speak less."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "나중에 더 짧고 분명하게 말할 방법을 메모해둔다.",
          "en": "I note a clearer, shorter way to say it next time."
        },
        "scores": {
          "sublimation": 2
        }
      }
    ]
  },
  {
    "id": "dm_09",
    "targetDimension": "intellectualization/humor/projection/rationalization",
    "rationale": "Silent reaction to an idea gives multiple non-obvious defensive paths.",
    "scene": {
      "ko": "회의에서 낸 의견에 반응이 거의 없었습니다. 누군가 반대하진 않았지만 공기가 잠깐 멈춘 것 같습니다.",
      "en": "You share an idea in a meeting and almost no one reacts. Nobody disagrees, but the room seems to pause."
    },
    "question": {
      "ko": "가장 먼저 드는 쪽은?",
      "en": "What comes up first?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "말이 너무 진지했나 싶어 가볍게 한마디를 덧붙인다.",
          "en": "I add a light comment because maybe I sounded too serious."
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "다들 바로 반응할 만큼 익숙한 주제가 아니었다고 본다.",
          "en": "I assume the topic was not familiar enough for people to react right away."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내 의견을 별로라고 여긴 것 같아 위축된다.",
          "en": "I tense up because it feels like they thought my idea was weak."
        },
        "scores": {
          "projection": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "질문 순서와 설명 흐름 중 어디서 끊겼는지 본다.",
          "en": "I review where the sequence of questions or explanation flow broke."
        },
        "scores": {
          "intellectualization": 2
        }
      }
    ]
  },
  {
    "id": "dm_10",
    "targetDimension": "sublimation/suppression/avoidance/reactionFormation",
    "rationale": "Private sadness with immediate obligations tests what the user does with emotional energy.",
    "scene": {
      "ko": "속상한 일이 있었지만 바로 해야 할 일이 남아 있습니다. 주변에는 티 내고 싶지 않습니다.",
      "en": "Something upsetting happened, but there is still something you need to do. You do not want people around you to notice."
    },
    "question": {
      "ko": "당신에게 가장 가까운 모습은?",
      "en": "What are you most likely to do?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "일단 감정은 접어두고 해야 할 일부터 끝낸다.",
          "en": "I put the feeling aside and finish what needs to be done first."
        },
        "scores": {
          "suppression": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "그 에너지를 정리, 운동, 작업 같은 데로 돌린다.",
          "en": "I channel that energy into organizing, exercise, or work."
        },
        "scores": {
          "sublimation": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "평소보다 더 밝게 굴며 아무 일 없는 척한다.",
          "en": "I act brighter than usual as if nothing happened."
        },
        "scores": {
          "reactionFormation": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "가능하면 연락을 줄이고 혼자 있고 싶다.",
          "en": "If possible, I reduce contact and want to be alone."
        },
        "scores": {
          "avoidance": 2
        }
      }
    ]
  },
  {
    "id": "dm_11",
    "targetDimension": "rationalization/projection/intellectualization/suppression",
    "rationale": "Social comparison invites protective explanations without asking about envy.",
    "scene": {
      "ko": "당신이 원하던 기회를 다른 사람이 먼저 얻었습니다. 축하할 일인데 마음 한쪽이 복잡합니다.",
      "en": "Someone else gets an opportunity you wanted first. It is good news, but part of you feels complicated."
    },
    "question": {
      "ko": "가장 가까운 반응은?",
      "en": "What reaction feels closest?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "내가 아직 준비가 덜 됐던 거라고 이유를 찾는다.",
          "en": "I tell myself I probably was not ready enough yet."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "그 사람이 은근히 나를 의식할 것 같다고 느낀다.",
          "en": "It feels like they may be quietly aware of me."
        },
        "scores": {
          "projection": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "부러운 마음은 접어두고 축하부터 한다.",
          "en": "I set the envy aside and congratulate them first."
        },
        "scores": {
          "suppression": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내가 원했던 게 정확히 무엇인지 다시 정리한다.",
          "en": "I reorganize what exactly I had wanted."
        },
        "scores": {
          "intellectualization": 2
        }
      }
    ]
  },
  {
    "id": "dm_12",
    "targetDimension": "humor/avoidance/reactionFormation/sublimation",
    "rationale": "Awkward conflict lets humor, retreat, overkindness, and repair-oriented action compete.",
    "scene": {
      "ko": "작은 의견 차이로 분위기가 굳었습니다. 다들 큰 문제는 아닌 척하지만 공기가 어색합니다.",
      "en": "A small disagreement makes the mood stiff. Everyone acts like it is not a big deal, but the air is awkward."
    },
    "question": {
      "ko": "당신이 가장 하기 쉬운 행동은?",
      "en": "What are you most likely to do?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "짧은 농담으로 공기를 조금 풀어본다.",
          "en": "I use a short joke to loosen the air a little."
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "일단 그 대화에서 빠져나와 시간을 둔다.",
          "en": "I step away from that conversation for now and give it time."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "방금 전보다 더 친절하게 굴며 아무렇지 않은 척한다.",
          "en": "I act even kinder than before as if nothing happened."
        },
        "scores": {
          "reactionFormation": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "불편한 에너지를 문제 해결 쪽으로 돌린다.",
          "en": "I turn the uncomfortable energy toward solving the issue."
        },
        "scores": {
          "sublimation": 2
        }
      }
    ]
  },
  {
    "id": "dm_13",
    "targetDimension": "suppression/intellectualization/rationalization/projection",
    "rationale": "A lingering family comment evokes restrained emotion, analysis, explanation, or projected intent.",
    "scene": {
      "ko": "가족의 한마디에 생각보다 서운했습니다. 대놓고 상처 주려던 말은 아닌 것 같습니다.",
      "en": "A family member’s comment stays longer than expected. It probably was not meant to hurt you directly."
    },
    "question": {
      "ko": "보통 당신은 어떻게 하나요?",
      "en": "What do you usually do?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "그 자리에서는 감정을 접어두고 넘긴다.",
          "en": "I act fine and let it pass in the moment."
        },
        "scores": {
          "suppression": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "어떤 단어가 나를 찔렀는지 혼자 짚어본다.",
          "en": "I privately identify which word or phrase hit me."
        },
        "scores": {
          "intellectualization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "원래 그런 식으로 말하는 사람이라고 생각한다.",
          "en": "I think that is just how they talk."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "나를 낮게 본 것 같다고 느낀다.",
          "en": "It feels like there was some part of them looking down on me."
        },
        "scores": {
          "projection": 2
        }
      }
    ]
  },
  {
    "id": "dm_14",
    "targetDimension": "sublimation/avoidance/humor/reactionFormation",
    "rationale": "Unexpected rejection tests whether pain becomes action, distance, lightness, or opposite behavior.",
    "scene": {
      "ko": "가볍게 제안한 일이 거절되었습니다. 이유는 이해되지만 괜히 민망하고 아쉽습니다.",
      "en": "A casual suggestion you made gets declined. The reason makes sense, but you still feel embarrassed and disappointed."
    },
    "question": {
      "ko": "가장 가까운 반응은?",
      "en": "What reaction feels closest?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "“거절당했다”는 식으로 가볍게 웃어넘긴다.",
          "en": "I lightly joke, “I got rejected.”"
        },
        "scores": {
          "humor": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "비슷한 제안을 당분간 하지 않게 된다.",
          "en": "I avoid making similar suggestions for a while."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "아쉬운 에너지를 다른 계획을 세우는 데 쓴다.",
          "en": "I use the disappointed energy to make another plan."
        },
        "scores": {
          "sublimation": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "전혀 아쉽지 않은 것처럼 더 쿨하게 군다.",
          "en": "I act extra cool, as if I am not disappointed at all."
        },
        "scores": {
          "reactionFormation": 2
        }
      }
    ]
  },
  {
    "id": "dm_15",
    "targetDimension": "intellectualization/suppression/rationalization/sublimation",
    "rationale": "Receiving mixed evaluation reveals whether user processes emotion through logic, containment, meaning, or action.",
    "scene": {
      "ko": "칭찬과 아쉬운 피드백을 함께 들었습니다. 좋은 말도 있었지만 부족한 한 부분이 계속 떠오릅니다.",
      "en": "You receive praise and critical feedback together. There were good words too, but one weak part keeps returning."
    },
    "question": {
      "ko": "그 뒤 당신에게 가까운 쪽은?",
      "en": "What are you most likely to do after?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "감정은 미루고 칭찬과 수정점을 표처럼 나눈다.",
          "en": "I postpone the emotion and split praise and revisions like a table."
        },
        "scores": {
          "intellectualization": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "좋은 말도 있었으니 괜찮다고 스스로 납득한다.",
          "en": "I tell myself it is okay because there was praise too."
        },
        "scores": {
          "rationalization": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "속상함은 숨긴 채 바로 수정 파일을 연다.",
          "en": "I hide that it hurt and immediately open the revision file."
        },
        "scores": {
          "suppression": 1,
          "sublimation": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "그 한 부분을 개선할 구체적인 연습을 바로 만든다.",
          "en": "I immediately create a specific practice to improve that one part."
        },
        "scores": {
          "sublimation": 2
        }
      }
    ]
  },
  {
    "id": "dm_16",
    "targetDimension": "projection/reactionFormation/avoidance/rationalization",
    "rationale": "An immediate interruption in conversation invites hidden threat reading, opposite behavior, withdrawal, or explanation.",
    "scene": {
      "ko": "대화 중 상대가 당신의 말을 끊고 다른 주제로 넘어갔습니다. 일부러 그런 것 같지는 않지만 불편함이 남습니다.",
      "en": "During a conversation, someone cuts off your words and moves to another topic. It does not seem intentional, but discomfort remains."
    },
    "question": {
      "ko": "가장 가까운 반응은?",
      "en": "What reaction feels closest?"
    },
    "answers": [
      {
        "id": "a",
        "text": {
          "ko": "상대가 내 말을 중요하게 듣지 않는 것 같다고 느낀다.",
          "en": "It feels like they are not really valuing what I said."
        },
        "scores": {
          "projection": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "불편한 마음과 반대로 더 밝게 반응한다.",
          "en": "I respond more brightly than I feel."
        },
        "scores": {
          "reactionFormation": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "잠깐 대화에서 빠져 감정을 가라앉힌다.",
          "en": "I step back from the conversation for a moment to settle myself."
        },
        "scores": {
          "avoidance": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "상대가 급하게 떠올린 말이 있었을 거라고 생각한다.",
          "en": "I assume they probably had something urgent on their mind."
        },
        "scores": {
          "rationalization": 2
        }
      }
    ]
  }
];

export function calculateDefenseResult(answers: DefenseAnswer[]) {
  const scores = DEFENSE_RESULT_ORDER.reduce<Record<DefenseMechanismId, number>>(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<DefenseMechanismId, number>,
  );
  const lastWeightedHit = DEFENSE_RESULT_ORDER.reduce<Record<DefenseMechanismId, number>>(
    (acc, id) => {
      acc[id] = -1;
      return acc;
    },
    {} as Record<DefenseMechanismId, number>,
  );

  answers.forEach((selected, index) => {
    let highestWeight = 0;
    Object.values(selected.scores).forEach((value) => {
      highestWeight = Math.max(highestWeight, value ?? 0);
    });

    Object.entries(selected.scores).forEach(([key, value]) => {
      const id = key as DefenseMechanismId;
      scores[id] += value ?? 0;
      if ((value ?? 0) === highestWeight) lastWeightedHit[id] = index;
    });
  });

  const winner = DEFENSE_RESULT_ORDER.reduce<DefenseMechanismId>((best, id) => {
    if (scores[id] > scores[best]) return id;
    if (scores[id] < scores[best]) return best;
    if (lastWeightedHit[id] > lastWeightedHit[best]) return id;
    return best;
  }, DEFENSE_RESULT_ORDER[0]);

  return {
    result: DEFENSE_RESULTS[winner],
    scores,
  };
}
