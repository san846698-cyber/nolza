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
    ko: "이 테스트는 진단이 아닌 재미용 자기이해 콘텐츠입니다.",
    en: "This is for entertainment and self-reflection only. It is not a diagnosis.",
  },
  questionCount: { ko: "질문", en: "Question" },
  resultLoading: { ko: "당신의 보호 방식을 정리하는 중...", en: "Organizing your protection pattern..." },
  saveImage: { ko: "이미지로 저장", en: "Save as image" },
  resultLabel: { ko: "나의 방어기제", en: "My Defense Mechanism" },
  strength: { ko: "강점", en: "Strength" },
  weakPoint: { ko: "조심할 점", en: "Watch out" },
  whenHelps: { ko: "도움이 되는 순간", en: "When it helps" },
  carefulWhen: { ko: "주의할 순간", en: "Be careful when" },
  shareLine: { ko: "공유 문장", en: "Share line" },
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
      ko: "아무렇지 않은 척 지나가며 버티는 사람",
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
      ko: "괜찮은 척하다가 나중에 한꺼번에 지칠 수 있습니다.",
      en: "You may seem fine until exhaustion catches up later.",
    },
    whenHelps: {
      ko: "마감, 책임, 급한 일이 있어서 잠시 마음을 접어두어야 할 때 도움이 됩니다.",
      en: "It helps when a deadline or responsibility needs your focus right now.",
    },
    carefulWhen: {
      ko: "계속 괜찮다고 말하지만 사소한 일에도 금방 지치는 상태입니다.",
      en: "Be careful when you keep saying you are fine, but tiny things drain you quickly.",
    },
    shareLine: {
      ko: "나는 억압 타입이래. 괜찮은 척이 너무 자동임.",
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
      ko: "당신은 불안하거나 예민해졌을 때 상대의 말투, 표정, 반응에서 신호를 찾으려는 편입니다. 때로는 내 안의 걱정이 상대의 마음처럼 느껴질 수 있어요. 이건 관계를 중요하게 생각한다는 뜻이기도 하지만, 확인되지 않은 추측은 나를 더 지치게 만들 수 있습니다.",
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
      ko: "당신은 마음이 들키는 것이 불편할 때 오히려 반대로 행동할 수 있습니다. 좋아하면서 무심한 척하거나, 서운하면서 괜찮은 척하거나, 불안하면서 더 강한 척하는 식입니다. 이 방식은 마음을 숨기는 데 도움이 되지만, 가까운 사람에게는 오해를 만들 수 있어요.",
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
    shareLine: {
      ko: "나는 반동형성 타입이래. 진짜 마음이랑 반대로 행동할 때 있음.",
      en: "I got Reaction Formation. Sometimes I act opposite to what I feel.",
    },
    accent: "#f6b5d5",
  },
};

export const DEFENSE_QUESTIONS: DefenseQuestion[] = [
  {
    id: "friend-hurt",
    scene: { ko: "친구가 별생각 없이 한 말에 살짝 기분이 상했습니다.", en: "A friend says something casually, and it hurts your feelings a little." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "웃으며 농담으로 넘기지만 속으로는 조금 남는다", en: "I laugh it off with a joke, though it stays with me a little." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "상대도 별뜻 없었을 거라고 보고 일단 넘긴다", en: "I assume they probably meant nothing by it and let it pass for now." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "잠깐 거리를 두고 마음을 가라앉힌다", en: "I take a little distance and let my feelings settle." }, scores: { avoidance: 1, suppression: 1 } },
      { id: "d", text: { ko: "왜 그 말이 신경 쓰였는지 차분히 생각해본다", en: "I calmly think about why that comment bothered me." }, scores: { intellectualization: 2 } },
    ],
  },
  {
    id: "criticism",
    scene: { ko: "열심히 준비한 일에 대해 예상보다 차가운 평가를 들었습니다.", en: "You receive colder feedback than expected on something you prepared carefully." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "괜히 웃으며 '역시 쉽지 않네' 하고 넘긴다", en: "I smile and say, 'Yeah, it is not easy,' to lighten it." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "평가가 나온 이유를 머릿속으로 정리한다", en: "I organize the reasons for the feedback in my head." }, scores: { intellectualization: 2 } },
      { id: "c", text: { ko: "당분간 그 일 이야기는 하고 싶지 않다", en: "I do not want to talk about it for a while." }, scores: { avoidance: 2 } },
      { id: "d", text: { ko: "쓸 수 있는 부분만 골라 다음 계획에 반영한다", en: "I take only the useful parts and apply them to the next plan." }, scores: { sublimation: 2 } },
    ],
  },
  {
    id: "group-chat",
    scene: { ko: "단체 대화방에서 내 말이 어색하게 넘어가고 아무도 반응하지 않았습니다.", en: "In a group chat, your message passes awkwardly and nobody responds." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "바로 다른 농담을 던져 분위기를 바꾼다", en: "I throw in another joke to change the mood." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "사람들이 바빴을 수도 있다고 보고 크게 의미를 두지 않는다", en: "I assume people may have been busy and do not read too much into it." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "대화방을 잠시 안 보고 다른 일을 한다", en: "I stop looking at the chat for a while and do something else." }, scores: { avoidance: 2 } },
      { id: "d", text: { ko: "내가 어떤 말을 해서 분위기가 바뀌었는지 되짚어본다", en: "I review what I said and how the mood changed." }, scores: { intellectualization: 2 } },
    ],
  },
  {
    id: "postponed-plan",
    scene: { ko: "가까운 사람이 약속을 가볍게 미뤘고, 당신은 조금 서운했습니다.", en: "Someone close casually postpones a plan, and you feel a bit disappointed." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "'나 버려졌네?'처럼 장난스럽게 표현한다", en: "I joke, like 'Wow, I have been abandoned.'" }, scores: { humor: 2 } },
      { id: "b", text: { ko: "상대에게도 사정이 있었을 거라고 생각한다", en: "I think they probably had their own reason." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "괜찮다고 말하고 혼자 시간을 보낸다", en: "I say it is okay and spend time alone." }, scores: { suppression: 1, avoidance: 1 } },
      { id: "d", text: { ko: "서운한 이유를 정리한 뒤 필요하면 차분히 말한다", en: "I sort out why I feel hurt and calmly say it if needed." }, scores: { intellectualization: 1, sublimation: 1 } },
    ],
  },
  {
    id: "embarrassing-mistake",
    scene: { ko: "실수한 뒤 얼굴이 뜨거워질 만큼 민망한 순간이 있었습니다.", en: "After making a mistake, you feel embarrassed enough for your face to heat up." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "먼저 웃기게 말해서 상황을 가볍게 만든다", en: "I make a funny comment first to lighten the situation." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "누구나 실수할 수 있다고 스스로 납득시킨다", en: "I remind myself that anyone can make mistakes." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "그 장면을 떠올리지 않으려고 다른 일에 집중한다", en: "I focus on something else so I do not replay the scene." }, scores: { suppression: 2 } },
      { id: "d", text: { ko: "다음에는 어떻게 하면 덜 실수할지 정리한다", en: "I figure out how to make it less likely next time." }, scores: { sublimation: 2 } },
    ],
  },
  {
    id: "task-pressure",
    scene: { ko: "해야 할 일이 너무 많아 마음이 압박감으로 꽉 찼습니다.", en: "You have so much to do that your mind feels packed with pressure." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "힘든 와중에도 농담하면서 버틴다", en: "I keep going by joking even while it is hard." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "지금 힘든 건 당연하다고 이유를 정리한다", en: "I organize why it makes sense that I feel overwhelmed." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "잠깐 미루고 아무 생각 안 하려고 한다", en: "I put it off briefly and try not to think." }, scores: { avoidance: 2 } },
      { id: "d", text: { ko: "목록을 만들고 우선순위를 정한다", en: "I make a list and set priorities." }, scores: { intellectualization: 1, sublimation: 1 } },
    ],
  },
  {
    id: "boundary-request",
    scene: { ko: "누군가 당신의 선을 넘는 부탁을 했고, 거절하기가 불편했습니다.", en: "Someone asks for something that crosses your boundary, and saying no feels uncomfortable." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "장난스럽게 돌려 말하며 분위기를 부드럽게 만든다", en: "I say it indirectly with a playful tone to soften the mood." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "상대 사정은 이해하지만, 가능한 범위를 차분히 말한다", en: "I understand their situation but calmly say what I can actually do." }, scores: { rationalization: 1, intellectualization: 1 } },
      { id: "c", text: { ko: "답장을 늦추거나 상황을 피한다", en: "I delay replying or avoid the situation." }, scores: { avoidance: 2 } },
      { id: "d", text: { ko: "오히려 괜찮은 척하며 더 친절하게 군다", en: "I act extra kind as if it is totally fine." }, scores: { reactionFormation: 2 } },
    ],
  },
  {
    id: "short-reply",
    scene: { ko: "상대의 짧은 답장 때문에 마음이 불안해졌습니다.", en: "A short reply from someone makes you feel uneasy." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "'아 나 차인 듯?' 하고 농담처럼 말한다", en: "I joke, 'Wow, I got rejected.'" }, scores: { humor: 2 } },
      { id: "b", text: { ko: "바빠서 짧게 답했을 거라고 생각한다", en: "I think they probably replied briefly because they were busy." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "답장을 더 보내지 않고 잠시 물러난다", en: "I do not send another message and step back for a while." }, scores: { avoidance: 1, suppression: 1 } },
      { id: "d", text: { ko: "답장 패턴을 떠올리며 의미를 분석한다", en: "I analyze the meaning by thinking of their reply patterns." }, scores: { intellectualization: 2 } },
    ],
  },
  {
    id: "disappointed-person",
    scene: { ko: "믿었던 사람이 당신의 기대와 다르게 행동했습니다.", en: "Someone you trusted acts differently from what you expected." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "실망한 마음을 농담처럼 말한다", en: "I express disappointment as a joke." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "그 사람 입장에서는 그럴 수 있다고 이유를 찾는다", en: "I look for why it may have made sense from their side." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "당분간 거리를 두며 마음을 정리한다", en: "I take distance for a while and sort out my feelings." }, scores: { avoidance: 1, suppression: 1 } },
      { id: "d", text: { ko: "내가 어떤 기대를 했는지 먼저 분석한다", en: "I first analyze what expectation I had." }, scores: { intellectualization: 2 } },
    ],
  },
  {
    id: "hide-pain",
    scene: { ko: "힘든 일이 있었지만 주변 사람들에게 티 내고 싶지 않았습니다.", en: "Something hard happened, but you do not want people around you to notice." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "더 밝게 농담하면서 평소처럼 행동한다", en: "I act brighter and joke around as usual." }, scores: { humor: 1, reactionFormation: 2 } },
      { id: "b", text: { ko: "지금은 말하지 않는 게 낫다고 스스로 납득한다", en: "I convince myself it is better not to talk about it right now." }, scores: { rationalization: 2, suppression: 1 } },
      { id: "c", text: { ko: "연락을 줄이고 혼자 있으려 한다", en: "I reduce contact and try to be alone." }, scores: { avoidance: 2 } },
      { id: "d", text: { ko: "감정보다 상황을 먼저 정리하려고 한다", en: "I try to organize the situation before the emotion." }, scores: { intellectualization: 2 } },
    ],
  },
  {
    id: "misunderstood",
    scene: { ko: "누군가 당신을 오해했고, 해명하고 싶지만 감정이 먼저 올라왔습니다.", en: "Someone misunderstands you, and you want to explain, but your emotions rise first." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "농담 섞어서 분위기를 풀고 말한다", en: "I mix in humor to soften the mood before explaining." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "상대가 그렇게 생각한 이유도 있을 거라고 본다", en: "I assume they may have had a reason to think that." }, scores: { rationalization: 2 } },
      { id: "c", text: { ko: "일단 대화를 피하고 시간이 지난 뒤 말한다", en: "I avoid the conversation for now and talk later." }, scores: { avoidance: 2 } },
      { id: "d", text: { ko: "오해가 생긴 지점을 차분히 정리한다", en: "I calmly organize where the misunderstanding started." }, scores: { intellectualization: 2 } },
    ],
  },
  {
    id: "work-through-sadness",
    scene: { ko: "속상한 마음이 있는데도 당장 해야 할 일이 남아 있습니다.", en: "You feel upset, but there is still something you need to do right now." },
    question: { ko: "당신의 가장 가까운 반응은?", en: "What reaction feels closest?" },
    answers: [
      { id: "a", text: { ko: "농담이라도 하면서 분위기를 버틴다", en: "I use even small jokes to get through the mood." }, scores: { humor: 2 } },
      { id: "b", text: { ko: "지금은 할 일을 먼저 하는 게 맞다고 생각한다", en: "I think it makes sense to handle what must be done first." }, scores: { rationalization: 1, suppression: 1 } },
      { id: "c", text: { ko: "감정은 잠시 밀어두고 아예 안 보려 한다", en: "I push the feeling aside and try not to look at it." }, scores: { suppression: 2 } },
      { id: "d", text: { ko: "마음이 흔들리는 이유와 할 일을 분리해서 본다", en: "I separate why my heart is shaken from what I need to do." }, scores: { intellectualization: 2 } },
    ],
  },
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
