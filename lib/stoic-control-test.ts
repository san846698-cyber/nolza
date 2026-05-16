export type StoicControlId =
  | "others-opinion"
  | "future"
  | "emotions"
  | "outcome"
  | "relationships"
  | "perfect-self"
  | "past";

export type LocalText = {
  ko: string;
  en: string;
};

export type StoicChoice = {
  id: string;
  text: LocalText;
  weights: Partial<Record<StoicControlId, number>>;
};

export type StoicQuestion = {
  id: string;
  prompt: LocalText;
  choices: StoicChoice[];
};

export type StoicResult = {
  id: StoicControlId;
  title: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  cannotControl: LocalText;
  canChoose: LocalText;
  reflection: LocalText;
  hint: LocalText;
  shareLine: LocalText;
};

export type StoicAnswer = {
  questionId: string;
  choiceId: string;
  weights: Partial<Record<StoicControlId, number>>;
};

export const STOIC_RESULTS: StoicResult[] = [
  {
    id: "others-opinion",
    title: { ko: "타인의 평가를 통제하려는 사람", en: "Trying to Control How Others See You" },
    oneLiner: {
      ko: "남들이 나를 어떻게 볼지에 마음이 오래 머무는 사람",
      en: "Your mind lingers on how others may see you.",
    },
    description: {
      ko: "당신은 자신의 행동보다 그 행동이 어떻게 보일지를 먼저 생각할 때가 있습니다. 좋은 인상을 남기고 싶은 마음이 크지만, 그만큼 타인의 시선이 마음의 방향을 자주 흔들 수 있어요.",
      en: "You may think about how your actions will look before thinking about the actions themselves. Wanting to leave a good impression is natural, but other people's gaze can pull your mind around.",
    },
    cannotControl: {
      ko: "타인이 나를 완전히 이해하는 방식, 그들의 평가, 그날의 기분.",
      en: "How fully others understand you, their judgments, and their mood that day.",
    },
    canChoose: {
      ko: "내가 지키고 싶은 태도, 설명할 수 있는 만큼의 말, 이후의 행동.",
      en: "The attitude you keep, the words you can offer, and what you do next.",
    },
    reflection: {
      ko: "타인의 평가는 내 손 안에 완전히 들어오지 않습니다. 내가 다룰 수 있는 것은 내가 선택한 태도와 행동입니다.",
      en: "Other people's opinions never fully sit in your hands. What you can handle is the attitude and action you choose.",
    },
    hint: {
      ko: "오늘은 ‘어떻게 보일까?’보다 ‘나는 어떤 태도로 행동하고 싶은가?’를 먼저 물어보세요.",
      en: "Today, ask 'What attitude do I want to act from?' before 'How will this look?'",
    },
    shareLine: {
      ko: "나는 타인의 평가를 놓기 어려운 스토아 타입이래.",
      en: "My Stoic control pattern is trying to control how others see me.",
    },
  },
  {
    id: "future",
    title: { ko: "미래를 통제하려는 사람", en: "Trying to Control the Future" },
    oneLiner: {
      ko: "아직 오지 않은 일을 머릿속에서 여러 번 살아보는 사람",
      en: "You live through future scenarios many times in your head.",
    },
    description: {
      ko: "당신은 미래의 변수들을 미리 계산하며 불안을 줄이려는 편입니다. 준비하는 힘은 좋지만, 아직 오지 않은 일을 너무 오래 붙잡으면 오늘의 에너지까지 먼저 써버릴 수 있어요.",
      en: "You try to reduce anxiety by calculating future variables in advance. Preparation is useful, but holding the future too tightly can spend today's energy early.",
    },
    cannotControl: {
      ko: "모든 변수, 타이밍, 우연, 아직 일어나지 않은 사람들의 선택.",
      en: "Every variable, timing, chance, and choices people have not made yet.",
    },
    canChoose: {
      ko: "오늘 할 수 있는 준비, 확인할 수 있는 정보, 지금의 작은 행동.",
      en: "Today's preparation, information you can check, and the small action available now.",
    },
    reflection: {
      ko: "미래 전체는 내 것이 아니지만, 오늘의 준비는 내 것입니다.",
      en: "The whole future is not yours, but today's preparation is.",
    },
    hint: {
      ko: "머릿속 시나리오를 하나 줄이고, 실제로 할 수 있는 작은 준비 하나를 적어보세요.",
      en: "Put down one mental scenario and write one small preparation you can actually do.",
    },
    shareLine: {
      ko: "나는 아직 오지 않은 미래를 자꾸 붙잡는 타입이래.",
      en: "My Stoic control pattern is trying to control the future.",
    },
  },
  {
    id: "emotions",
    title: { ko: "감정을 통제하려는 사람", en: "Trying to Control Your Emotions" },
    oneLiner: {
      ko: "흔들리면 안 된다고 스스로를 다그치는 사람",
      en: "You push yourself not to be shaken.",
    },
    description: {
      ko: "당신은 감정이 올라오는 것 자체를 약함처럼 느낄 때가 있습니다. 그래서 불안, 서운함, 화를 빨리 정리하려 하지만, 감정은 명령만으로 바로 사라지지는 않아요.",
      en: "You may treat the arrival of emotion as weakness. You try to quickly organize anxiety, hurt, or anger, but emotions do not disappear by command.",
    },
    cannotControl: {
      ko: "감정이 처음 올라오는 속도, 몸의 긴장, 순간적인 흔들림.",
      en: "The first rise of emotion, body tension, and the first moment of being shaken.",
    },
    canChoose: {
      ko: "감정 뒤에 이어질 말과 행동, 쉬어갈 시간, 나를 다루는 방식.",
      en: "The words and actions after the feeling, a pause, and how you treat yourself.",
    },
    reflection: {
      ko: "감정은 명령으로 사라지지 않습니다. 다만 감정 뒤의 행동은 선택할 수 있습니다.",
      en: "Emotions do not vanish by command. But the action after an emotion can be chosen.",
    },
    hint: {
      ko: "‘이 감정이 없어져야 해’보다 ‘이 감정이 있는 채로 무엇을 선택할까?’를 물어보세요.",
      en: "Instead of 'This feeling must disappear,' ask 'What can I choose while this feeling is here?'",
    },
    shareLine: {
      ko: "나는 감정까지 통제하려다 지치는 타입이래.",
      en: "My Stoic control pattern is trying to control my emotions.",
    },
  },
  {
    id: "outcome",
    title: { ko: "결과를 통제하려는 사람", en: "Trying to Control the Outcome" },
    oneLiner: {
      ko: "과정보다 결과가 마음을 더 크게 흔드는 사람",
      en: "The outcome shakes you more than the process.",
    },
    description: {
      ko: "당신은 노력보다 결과가 어떻게 나올지를 더 오래 붙잡을 수 있습니다. 잘하고 싶은 마음이 큰 만큼, 아직 나오지 않은 결과가 현재의 마음까지 크게 흔들 때가 있어요.",
      en: "You may hold onto the outcome longer than the effort itself. Because you care about doing well, an unfinished result can disturb the present.",
    },
    cannotControl: {
      ko: "최종 평가, 상대의 반응, 운과 환경, 결과가 나오는 방식.",
      en: "Final evaluation, other people's reactions, luck, context, and how results arrive.",
    },
    canChoose: {
      ko: "과정에 들이는 성실함, 마무리의 태도, 결과 뒤의 다음 행동.",
      en: "Your sincerity in the process, your attitude at the finish, and the next action after the result.",
    },
    reflection: {
      ko: "결과는 여러 조건의 합이지만, 과정에 담는 태도는 내 선택입니다.",
      en: "An outcome is a sum of many conditions; the attitude you put into the process is yours.",
    },
    hint: {
      ko: "오늘의 기준을 결과가 아니라 ‘내가 과정에 무엇을 담았는가’로 한 번 바꿔보세요.",
      en: "Try measuring today by what you put into the process, not only by the result.",
    },
    shareLine: {
      ko: "나는 결과를 놓기 어려운 스토아 타입이래.",
      en: "My Stoic control pattern is trying to control the outcome.",
    },
  },
  {
    id: "relationships",
    title: { ko: "관계의 흐름을 통제하려는 사람", en: "Trying to Control Relationships" },
    oneLiner: {
      ko: "멀어지는 느낌을 견디기 어려운 사람",
      en: "Distance in relationships is hard for you to sit with.",
    },
    description: {
      ko: "당신은 관계의 거리, 답장, 분위기 변화를 오래 신경 쓰는 편입니다. 가까움을 소중히 여기기 때문에 작은 변화도 크게 느껴질 수 있어요.",
      en: "You may spend a long time thinking about distance, replies, and shifts in mood. Because closeness matters to you, small changes can feel large.",
    },
    cannotControl: {
      ko: "상대의 마음, 답장 속도, 관계가 흘러가는 모든 속도.",
      en: "The other person's heart, reply speed, and every pace of the relationship.",
    },
    canChoose: {
      ko: "내 진심을 전하는 방식, 나의 경계, 기다리는 동안 나를 돌보는 태도.",
      en: "How you express sincerity, your boundaries, and how you care for yourself while waiting.",
    },
    reflection: {
      ko: "상대의 마음은 소유할 수 없지만, 나의 진심과 경계는 선택할 수 있습니다.",
      en: "You cannot possess another person's heart, but you can choose your sincerity and boundaries.",
    },
    hint: {
      ko: "상대의 반응을 붙잡기 전에, 내가 지금 지키고 싶은 관계의 태도를 먼저 정리해보세요.",
      en: "Before holding onto their reaction, name the relationship attitude you want to keep.",
    },
    shareLine: {
      ko: "나는 관계의 흐름을 통제하고 싶어지는 타입이래.",
      en: "My Stoic control pattern is trying to control relationships.",
    },
  },
  {
    id: "perfect-self",
    title: { ko: "완벽한 나를 통제하려는 사람", en: "Trying to Control Your Perfect Self" },
    oneLiner: {
      ko: "실수 없는 나를 만들려다 지치는 사람",
      en: "You get tired trying to become someone who never slips.",
    },
    description: {
      ko: "당신은 부족한 모습을 보이는 것을 쉽게 받아들이지 못할 수 있습니다. 더 나은 사람이 되고 싶은 마음이 강하지만, 완벽한 나만 허락하려 하면 숨 쉴 공간이 줄어들어요.",
      en: "You may struggle to accept showing your unfinished parts. Wanting to improve is meaningful, but allowing only a perfect self can shrink your breathing room.",
    },
    cannotControl: {
      ko: "실수 없는 인간이 되는 것, 매 순간 흔들리지 않는 모습, 모두에게 완성되어 보이는 일.",
      en: "Becoming a person without mistakes, never being shaken, and appearing complete to everyone.",
    },
    canChoose: {
      ko: "실수 뒤의 회복, 배우려는 태도, 나를 너무 거칠게 대하지 않는 방식.",
      en: "Recovery after mistakes, a learning attitude, and a less harsh way of treating yourself.",
    },
    reflection: {
      ko: "인간은 완성품이 아니라 훈련 중인 존재입니다.",
      en: "A human being is not a finished product, but a being in practice.",
    },
    hint: {
      ko: "오늘은 완벽한 내가 아니라, 회복 가능한 나를 기준으로 삼아보세요.",
      en: "Today, measure yourself by being recoverable, not perfect.",
    },
    shareLine: {
      ko: "나는 완벽한 나를 통제하려다 지치는 타입이래.",
      en: "My Stoic control pattern is trying to control my perfect self.",
    },
  },
  {
    id: "past",
    title: { ko: "지나간 일을 통제하려는 사람", en: "Trying to Control the Past" },
    oneLiner: {
      ko: "이미 지난 장면을 마음속에서 계속 고쳐 쓰는 사람",
      en: "You keep rewriting scenes that have already passed.",
    },
    description: {
      ko: "당신은 과거의 말, 선택, 실수를 자주 다시 떠올릴 수 있습니다. 그때 다르게 했더라면 어땠을지 생각하며, 이미 지나간 장면을 마음속에서 여러 번 고쳐 쓰는 편이에요.",
      en: "You may often replay old words, choices, and mistakes. Your mind rewrites scenes that already passed, wondering what would have happened if you had acted differently.",
    },
    cannotControl: {
      ko: "이미 끝난 말, 지나간 선택, 그때의 분위기와 반응.",
      en: "Words already spoken, choices already made, and the mood and reactions of that moment.",
    },
    canChoose: {
      ko: "그 일을 해석하는 방식, 다음에 다르게 해볼 작은 선택, 오늘의 방향.",
      en: "How you interpret it, the small choice you can try next time, and today's direction.",
    },
    reflection: {
      ko: "과거는 바꿀 수 없지만, 그 일을 해석하는 방식은 조금씩 달라질 수 있습니다.",
      en: "The past cannot be changed, but the way you interpret it can slowly change.",
    },
    hint: {
      ko: "후회가 올라오면 ‘그때의 나에게 정보가 지금만큼 있었나?’를 조용히 물어보세요.",
      en: "When regret rises, ask gently: 'Did I know then what I know now?'",
    },
    shareLine: {
      ko: "나는 지나간 일을 마음속에서 자주 고쳐 쓰는 타입이래.",
      en: "My Stoic control pattern is trying to control the past.",
    },
  },
];

export const STOIC_QUESTIONS: StoicQuestion[] = [
  {
    id: "waiting-result",
    prompt: {
      ko: "중요한 결과를 기다리는 중입니다. 가장 먼저 가까운 반응은?",
      en: "You are waiting for an important result. What reaction feels closest first?",
    },
    choices: [
      { id: "a", text: { ko: "지금 내가 할 수 있는 것부터 정리한다", en: "I organize what I can do right now." }, weights: { outcome: 1 } },
      { id: "b", text: { ko: "결과가 어떻게 나올지 계속 시뮬레이션한다", en: "I keep running scenarios about how it might turn out." }, weights: { future: 2 } },
      { id: "c", text: { ko: "사람들이 나를 어떻게 볼지 신경 쓰인다", en: "I worry about how people will see me." }, weights: { "others-opinion": 2 } },
      { id: "d", text: { ko: "부족했던 부분이 자꾸 떠오른다", en: "I keep thinking about what I may have lacked." }, weights: { "perfect-self": 1, outcome: 1 } },
    ],
  },
  {
    id: "plan-changed",
    prompt: {
      ko: "계획했던 일이 갑자기 틀어졌습니다. 무엇이 가장 불편한가요?",
      en: "A plan suddenly changes. What feels most uncomfortable?",
    },
    choices: [
      { id: "a", text: { ko: "바뀐 상황에 맞춰 다음 선택을 생각한다", en: "I think about the next choice that fits the changed situation." }, weights: { future: 1 } },
      { id: "b", text: { ko: "앞으로 더 꼬이면 어떡하지 먼저 걱정된다", en: "I first worry about what if things keep going wrong." }, weights: { future: 2 } },
      { id: "c", text: { ko: "준비한 과정이 의미 없어지는 것 같아 속상하다", en: "I feel upset that my preparation may become meaningless." }, weights: { outcome: 2 } },
      { id: "d", text: { ko: "당황한 티가 날까 봐 신경 쓰인다", en: "I worry that people will notice I am flustered." }, weights: { "others-opinion": 2 } },
    ],
  },
  {
    id: "misunderstood",
    prompt: {
      ko: "누군가 당신을 오해한 것 같습니다. 가장 먼저 드는 생각은?",
      en: "Someone seems to have misunderstood you. What thought comes first?",
    },
    choices: [
      { id: "a", text: { ko: "필요하면 차분히 설명하면 된다고 생각한다", en: "I think I can explain calmly if needed." }, weights: { relationships: 1 } },
      { id: "b", text: { ko: "그 사람이 나를 이상하게 볼까 봐 걱정된다", en: "I worry they will see me strangely." }, weights: { "others-opinion": 2 } },
      { id: "c", text: { ko: "그때 말을 다르게 했어야 했다고 되짚는다", en: "I replay how I should have said it differently." }, weights: { past: 2 } },
      { id: "d", text: { ko: "감정이 올라오지 않게 스스로를 눌러본다", en: "I try to hold myself down so emotion does not rise." }, weights: { emotions: 2 } },
    ],
  },
  {
    id: "late-reply",
    prompt: {
      ko: "가까운 사람이 평소보다 답장이 늦습니다. 가장 먼저 드는 생각은?",
      en: "Someone close replies later than usual. What thought comes first?",
    },
    choices: [
      { id: "a", text: { ko: "바쁜가 보다 하고 크게 의미를 두지 않는다", en: "I assume they may be busy and do not read too much into it." }, weights: { relationships: 1 } },
      { id: "b", text: { ko: "앞으로 계속 이렇게 될까 봐 불안하다", en: "I worry it may keep being like this." }, weights: { future: 2 } },
      { id: "c", text: { ko: "그 사람이 나를 어떻게 생각하는지 신경 쓰인다", en: "I wonder what they think of me." }, weights: { "others-opinion": 1, relationships: 1 } },
      { id: "d", text: { ko: "이런 일에 흔들리는 내 감정이 불편하다", en: "I feel uncomfortable that I am affected by this." }, weights: { emotions: 2 } },
    ],
  },
  {
    id: "mistake",
    prompt: {
      ko: "사람들 앞에서 작은 실수를 했습니다. 무엇이 가장 신경 쓰이나요?",
      en: "You make a small mistake in front of people. What bothers you most?",
    },
    choices: [
      { id: "a", text: { ko: "한 번의 실수일 뿐이라고 보고 다음을 생각한다", en: "I see it as one mistake and think about what comes next." }, weights: { outcome: 1 } },
      { id: "b", text: { ko: "사람들이 그 장면을 어떻게 기억할지 걱정된다", en: "I worry how people will remember that moment." }, weights: { "others-opinion": 2 } },
      { id: "c", text: { ko: "왜 그랬는지 장면을 계속 되감는다", en: "I keep rewinding why I did that." }, weights: { past: 2 } },
      { id: "d", text: { ko: "실수 없는 사람처럼 보이고 싶었다는 생각이 든다", en: "I realize I wanted to look like someone who does not make mistakes." }, weights: { "perfect-self": 2 } },
    ],
  },
  {
    id: "future-unknown",
    prompt: {
      ko: "앞일이 잘 보이지 않는 시기입니다. 당신은 보통 어떻게 반응하나요?",
      en: "You are in a season where the future is unclear. How do you usually respond?",
    },
    choices: [
      { id: "a", text: { ko: "오늘 할 수 있는 작은 준비부터 해본다", en: "I start with one small preparation I can do today." }, weights: { future: 1 } },
      { id: "b", text: { ko: "가능한 경우의 수를 머릿속에서 계속 계산한다", en: "I keep calculating all possible outcomes in my head." }, weights: { future: 2 } },
      { id: "c", text: { ko: "불안해하지 말아야 한다고 스스로를 다그친다", en: "I push myself not to feel anxious." }, weights: { emotions: 2 } },
      { id: "d", text: { ko: "완벽히 준비되지 않으면 움직이면 안 될 것 같다", en: "I feel I should not move until I am perfectly ready." }, weights: { "perfect-self": 2 } },
    ],
  },
  {
    id: "relationship-distance",
    prompt: {
      ko: "가까운 사람과의 분위기가 예전 같지 않습니다. 당신은 보통 어떻게 반응하나요?",
      en: "The mood with someone close does not feel the same as before. How do you usually react?",
    },
    choices: [
      { id: "a", text: { ko: "아직 판단할 정보가 부족하다고 보고 조금 지켜본다", en: "I wait a little because there may not be enough information yet." }, weights: { relationships: 1 } },
      { id: "b", text: { ko: "관계가 멀어지는 신호는 아닌지 걱정된다", en: "I worry it may be a sign the relationship is drifting." }, weights: { relationships: 2 } },
      { id: "c", text: { ko: "내가 뭘 잘못했는지 지난 대화를 떠올린다", en: "I replay old conversations to see what I did wrong." }, weights: { past: 1, relationships: 1 } },
      { id: "d", text: { ko: "아무렇지 않은 척 감정을 숨긴다", en: "I hide my feelings and act unaffected." }, weights: { emotions: 2 } },
    ],
  },
  {
    id: "past-regret",
    prompt: {
      ko: "실수한 장면이 자꾸 떠오릅니다. 당신의 가장 가까운 반응은?",
      en: "A mistake keeps coming back to mind. What reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "이미 지난 일이라 보고 다음에 다르게 해보려 한다", en: "I see it as something already past and try to do differently next time." }, weights: { past: 1 } },
      { id: "b", text: { ko: "그때로 돌아가 고치고 싶다는 생각이 든다", en: "I wish I could go back and fix it." }, weights: { past: 2 } },
      { id: "c", text: { ko: "그 일 때문에 지금의 결과까지 망가진 것 같다", en: "It feels like that moment damaged the current outcome too." }, weights: { outcome: 1, past: 1 } },
      { id: "d", text: { ko: "그때도 더 완벽했어야 했다고 나를 몰아붙인다", en: "I push myself that I should have been better even then." }, weights: { "perfect-self": 2 } },
    ],
  },
  {
    id: "public-work",
    prompt: {
      ko: "내 작업이나 선택이 사람들에게 공개됩니다. 무엇이 가장 신경 쓰이나요?",
      en: "Your work or choice will be seen by others. What matters most to you?",
    },
    choices: [
      { id: "a", text: { ko: "내가 납득할 만큼 했는지 먼저 확인한다", en: "I first check whether I did it in a way I can stand behind." }, weights: { outcome: 1 } },
      { id: "b", text: { ko: "사람들이 나를 어떤 사람으로 볼지 신경 쓰인다", en: "I care what kind of person people will think I am." }, weights: { "others-opinion": 2 } },
      { id: "c", text: { ko: "결과가 기대만큼 나오지 않으면 어떡할지 걱정된다", en: "I worry what if the result does not meet expectations." }, weights: { outcome: 2 } },
      { id: "d", text: { ko: "부족한 모습이 드러나면 안 된다는 압박이 크다", en: "I feel pressure not to reveal anything lacking." }, weights: { "perfect-self": 2 } },
    ],
  },
  {
    id: "emotion-rises",
    prompt: {
      ko: "대화 중 감정이 예상보다 크게 올라옵니다. 가장 가까운 생각은?",
      en: "During a conversation, your emotions rise more than expected. What thought feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "잠깐 멈추고 말하는 방식을 고르려 한다", en: "I pause for a moment and choose how to speak." }, weights: { emotions: 1 } },
      { id: "b", text: { ko: "감정이 티 나지 않게 바로 정리하려 한다", en: "I try to organize it immediately so it does not show." }, weights: { emotions: 2 } },
      { id: "c", text: { ko: "이렇게 흔들리면 안 된다고 스스로를 다그친다", en: "I scold myself for being this shaken." }, weights: { emotions: 1, "perfect-self": 1 } },
      { id: "d", text: { ko: "내 감정을 상대가 어떻게 볼지 걱정된다", en: "I worry how the other person will see my emotion." }, weights: { "others-opinion": 2 } },
    ],
  },
  {
    id: "effort",
    prompt: {
      ko: "내가 노력한 만큼 결과가 나오지 않았습니다. 가장 신경 쓰이는 부분은?",
      en: "The result did not match your effort. What bothers you most?",
    },
    choices: [
      { id: "a", text: { ko: "아쉬워도 과정에서 얻은 것을 먼저 정리한다", en: "Even if I feel disappointed, I first organize what I gained from the process." }, weights: { outcome: 1 } },
      { id: "b", text: { ko: "결과가 좋지 않으면 과정도 의미 없어 보인다", en: "If the result is not good, the process feels meaningless too." }, weights: { outcome: 2 } },
      { id: "c", text: { ko: "다른 사람들이 내 노력을 인정해줄지 신경 쓰인다", en: "I care whether other people will recognize my effort." }, weights: { "others-opinion": 2 } },
      { id: "d", text: { ko: "아직 부족한 점만 계속 보인다", en: "I keep seeing only what is still lacking." }, weights: { "perfect-self": 2 } },
    ],
  },
  {
    id: "quiet-night",
    prompt: {
      ko: "밤에 혼자 있을 때 생각이 길어집니다. 가장 자주 돌아오는 생각은?",
      en: "At night alone, your thoughts get longer. What returns most often?",
    },
    choices: [
      { id: "a", text: { ko: "오늘은 여기까지라고 생각하고 쉬려고 한다", en: "I tell myself this is enough for today and try to rest." }, weights: { emotions: 1 } },
      { id: "b", text: { ko: "이미 지나간 말과 선택이 다시 떠오른다", en: "Words and choices that already passed return to mind." }, weights: { past: 2 } },
      { id: "c", text: { ko: "내일 이후에 벌어질 가능성을 계속 생각한다", en: "I keep thinking about what might happen tomorrow and after." }, weights: { future: 2 } },
      { id: "d", text: { ko: "사람들과의 미묘한 거리나 분위기가 마음에 남는다", en: "Subtle distance or mood with people stays with me." }, weights: { relationships: 2 } },
    ],
  },
  {
    id: "feedback-wait",
    prompt: { ko: "중요한 피드백을 기다리는 중입니다. 당신은 주로 어디에 마음이 가나요?", en: "You are waiting for important feedback. Where does your mind usually go?" },
    choices: [
      { id: "a", text: { ko: "지금 할 수 있는 다음 행동을 하나 정한다", en: "I choose one next action I can take now." }, weights: { outcome: 1, future: 1 } },
      { id: "b", text: { ko: "상대가 나를 어떻게 평가할지 계속 떠올린다", en: "I keep imagining how they will evaluate me." }, weights: { "others-opinion": 2 } },
      { id: "c", text: { ko: "앞으로 일이 어떻게 흘러갈지 계속 계산한다", en: "I keep calculating how things may unfold from here." }, weights: { future: 2 } },
      { id: "d", text: { ko: "불안해하는 내 마음부터 통제하려고 한다", en: "I first try to control my anxious feelings." }, weights: { emotions: 2 } },
    ],
  },
  {
    id: "boundary-text",
    prompt: { ko: "누군가에게 가능한 범위를 말해야 합니다. 가장 가까운 반응은?", en: "You need to tell someone what you can and cannot do. What feels closest?" },
    choices: [
      { id: "a", text: { ko: "내가 선택할 수 있는 범위를 차분히 말한다", en: "I calmly state the range I can choose." }, weights: { relationships: 1, outcome: 1 } },
      { id: "b", text: { ko: "이기적으로 보일까 봐 계속 신경 쓰인다", en: "I keep worrying that I may look selfish." }, weights: { "others-opinion": 2 } },
      { id: "c", text: { ko: "완벽한 문장을 찾느라 말을 미루게 된다", en: "I delay speaking while looking for the perfect wording." }, weights: { "perfect-self": 2 } },
      { id: "d", text: { ko: "비슷한 상황에서 어긋났던 기억이 떠오른다", en: "I remember a similar situation that went wrong." }, weights: { past: 2 } },
    ],
  },
  {
    id: "cancelled-plan",
    prompt: { ko: "기대하던 약속이 갑자기 취소됐습니다. 당신은?", en: "A plan you were looking forward to is suddenly cancelled. What do you do?" },
    choices: [
      { id: "a", text: { ko: "아쉬움은 두고, 오늘 저녁을 어떻게 보낼지 정한다", en: "I let the disappointment be there and decide how to spend the evening." }, weights: { future: 1, emotions: 1 } },
      { id: "b", text: { ko: "상대가 나를 덜 중요하게 보는 건 아닌지 걱정된다", en: "I worry they may not see me as important." }, weights: { relationships: 2, "others-opinion": 1 } },
      { id: "c", text: { ko: "앞으로도 계속 이렇게 될까 봐 신경 쓰인다", en: "I worry this may keep happening in the future." }, weights: { future: 2 } },
      { id: "d", text: { ko: "서운한 티가 나지 않게 감정을 눌러본다", en: "I try to hold down my feelings so disappointment does not show." }, weights: { emotions: 2 } },
    ],
  },
  {
    id: "old-choice",
    prompt: { ko: "예전 선택이 문득 떠오르며 마음이 복잡해집니다. 당신은?", en: "An old choice suddenly returns to mind and makes you feel complicated. What do you do?" },
    choices: [
      { id: "a", text: { ko: "이미 지난 일에서 배울 점과 지금 할 일을 나눈다", en: "I separate what I can learn from the past from what I can do now." }, weights: { past: 1, outcome: 1 } },
      { id: "b", text: { ko: "그때 다르게 했어야 했다는 장면을 계속 돌려본다", en: "I keep replaying how I should have done it differently." }, weights: { past: 2 } },
      { id: "c", text: { ko: "그 선택이 앞으로도 영향을 줄까 봐 걱정된다", en: "I worry that choice may keep affecting the future." }, weights: { future: 2 } },
      { id: "d", text: { ko: "그때의 내가 더 완벽했어야 한다고 느낀다", en: "I feel that my past self should have been more perfect." }, weights: { "perfect-self": 2 } },
    ],
  },
];
export function calculateStoicResult(answers: StoicAnswer[]): StoicResult {
  const scores = new Map<StoicControlId, number>();
  for (const result of STOIC_RESULTS) scores.set(result.id, 0);

  for (const answer of answers) {
    for (const [id, value] of Object.entries(answer.weights) as Array<[StoicControlId, number]>) {
      scores.set(id, (scores.get(id) ?? 0) + value);
    }
  }

  let winner = STOIC_RESULTS[0];
  let bestScore = -Infinity;
  for (const result of STOIC_RESULTS) {
    const score = scores.get(result.id) ?? 0;
    if (score > bestScore) {
      winner = result;
      bestScore = score;
    }
  }
  return winner;
}

export function getStoicResultById(id: string | null | undefined): StoicResult | null {
  if (!id) return null;
  return STOIC_RESULTS.find((result) => result.id === id) ?? null;
}
