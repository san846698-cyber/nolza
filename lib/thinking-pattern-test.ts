export type ThinkingPatternId =
  | "catastrophizing"
  | "all-or-nothing"
  | "mind-reading"
  | "overgeneralization"
  | "emotional-reasoning"
  | "should-statements"
  | "discounting-positive"
  | "personalization"
  | "balanced-perspective";

export type LocalText = {
  ko: string;
  en: string;
};

export type ThinkingChoice = {
  id: string;
  text: LocalText;
  weights: Partial<Record<ThinkingPatternId, number>>;
};

export type ThinkingQuestion = {
  id: string;
  prompt: LocalText;
  choices: ThinkingChoice[];
};

export type ThinkingResult = {
  id: ThinkingPatternId;
  title: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  flow: LocalText;
  reframe: LocalText;
  strength: LocalText;
  caution: LocalText;
  shareLine: LocalText;
};

export type ThinkingAnswer = {
  questionId: string;
  choiceId: string;
  weights: Partial<Record<ThinkingPatternId, number>>;
};

export const THINKING_RESULTS: ThinkingResult[] = [
  {
    id: "catastrophizing",
    title: { ko: "파국화", en: "Catastrophizing" },
    oneLiner: {
      ko: "작은 불안이 금방 최악의 시나리오로 커지는 사람",
      en: "Small uncertainty can quickly become the worst-case scenario.",
    },
    description: {
      ko: "당신은 문제가 생기면 최악의 경우를 먼저 떠올리는 편입니다. 이는 겁이 많아서라기보다, 마음이 미리 대비책을 찾으려는 방식일 수 있어요.",
      en: "When something feels uncertain, your mind may jump to what could go wrong. It is less about being weak and more about trying to prepare before getting hurt.",
    },
    flow: {
      ko: "작은 신호를 보면 마음이 빠르게 다음 위험을 계산하고, 아직 일어나지 않은 장면까지 먼저 그려볼 수 있어요.",
      en: "A small signal can make your mind map the next risk and picture scenes that have not happened yet.",
    },
    reframe: {
      ko: "지금 불안하다는 사실이, 반드시 나쁜 일이 일어난다는 증거는 아닐 수 있어요.",
      en: "Feeling anxious right now is not proof that something bad is definitely happening.",
    },
    strength: {
      ko: "위험을 빨리 감지하고 준비하려는 힘이 있습니다.",
      en: "You notice risk early and prepare quickly.",
    },
    caution: {
      ko: "가능성 하나를 확정된 결말처럼 느끼면 마음이 너무 빨리 지칠 수 있습니다.",
      en: "One possibility can start feeling like a fixed ending, which can exhaust you.",
    },
    shareLine: {
      ko: "나는 생각이 꼬일 때 파국화가 먼저 켜지는 타입이래.",
      en: "My thinking tends to turn on catastrophizing first.",
    },
  },
  {
    id: "all-or-nothing",
    title: { ko: "흑백논리", en: "All-or-Nothing Thinking" },
    oneLiner: {
      ko: "성공 아니면 실패처럼 느끼기 쉬운 사람",
      en: "Things can feel like either success or failure, with little middle ground.",
    },
    description: {
      ko: "당신은 중간 지대보다 확실한 결과를 먼저 보는 편입니다. 잘하고 싶다는 기준이 강해서, 애매한 성과나 작은 실수도 크게 느껴질 수 있어요.",
      en: "You may see clear outcomes before nuance. Because your standards matter, a partial success or small mistake can feel much bigger than it is.",
    },
    flow: {
      ko: "한 부분이 마음에 들지 않으면 전체가 흔들린 것처럼 느껴지고, '괜찮은 편'이라는 평가가 잘 들어오지 않을 수 있어요.",
      en: "When one part feels off, the whole thing can seem ruined, and 'good enough' may not register easily.",
    },
    reframe: {
      ko: "완벽하지 않은 결과도 실패가 아니라, 조정 가능한 중간 단계일 수 있어요.",
      en: "An imperfect result may be an adjustable middle step, not a failure.",
    },
    strength: {
      ko: "기준이 분명하고 대충 넘기지 않는 힘이 있습니다.",
      en: "You have clear standards and do not settle carelessly.",
    },
    caution: {
      ko: "중간 성과를 인정하지 못하면 시작과 지속이 모두 어려워질 수 있습니다.",
      en: "If you cannot accept middle progress, both starting and continuing become harder.",
    },
    shareLine: {
      ko: "나는 흑백논리 쪽으로 생각이 꼬일 때가 있대.",
      en: "My thinking sometimes gets caught in all-or-nothing mode.",
    },
  },
  {
    id: "mind-reading",
    title: { ko: "마음읽기", en: "Mind Reading" },
    oneLiner: {
      ko: "상대가 날 어떻게 생각할지 먼저 추측하는 사람",
      en: "You quickly guess what others might be thinking about you.",
    },
    description: {
      ko: "당신은 상대의 표정, 말투, 답장 속도에서 의미를 빠르게 찾는 편입니다. 눈치가 빠른 장점도 있지만, 확인되지 않은 추측이 마음을 무겁게 만들 수 있어요.",
      en: "You read meaning quickly from expressions, tone, and response time. That sensitivity can be useful, but unconfirmed guesses may become heavy.",
    },
    flow: {
      ko: "상대가 별말을 하지 않아도 '혹시 나를 이상하게 봤나?' 같은 생각이 먼저 지나갈 수 있습니다.",
      en: "Even without clear evidence, thoughts like 'Did they judge me?' may appear first.",
    },
    reframe: {
      ko: "내가 읽은 분위기는 단서일 수 있지만, 아직 확인된 사실은 아닐 수 있어요.",
      en: "The mood you sensed may be a clue, but it may not be confirmed fact yet.",
    },
    strength: {
      ko: "분위기와 사람의 미묘한 변화를 잘 알아차립니다.",
      en: "You notice subtle changes in people and atmosphere.",
    },
    caution: {
      ko: "추측이 쌓이면 실제 대화보다 머릿속 대화가 더 커질 수 있습니다.",
      en: "Too many guesses can make the conversation in your head louder than the real one.",
    },
    shareLine: {
      ko: "나는 마음읽기 습관이 강한 편이래.",
      en: "I have a strong mind-reading thinking habit.",
    },
  },
  {
    id: "overgeneralization",
    title: { ko: "과잉일반화", en: "Overgeneralization" },
    oneLiner: {
      ko: "한 번의 일이 전체처럼 느껴지는 사람",
      en: "One event can start feeling like the whole pattern.",
    },
    description: {
      ko: "당신은 한 번의 실패나 실망이 앞으로도 계속될 것처럼 느껴질 수 있습니다. 마음이 비슷한 상처를 빠르게 연결하기 때문에 생기는 생각 습관일 수 있어요.",
      en: "One failure or disappointment may feel like it will keep repeating. Your mind quickly connects similar hurts into a larger pattern.",
    },
    flow: {
      ko: "한 번 어긋난 일이 생기면 '역시 나는 늘 이래'처럼 과거와 미래가 한꺼번에 붙을 수 있습니다.",
      en: "When one thing goes wrong, the past and future may attach to it: 'This always happens to me.'",
    },
    reframe: {
      ko: "이번 일이 반복처럼 느껴져도, 아직 모든 경우를 증명한 것은 아닐 수 있어요.",
      en: "Even if this feels like a pattern, it may not prove every future case.",
    },
    strength: {
      ko: "비슷한 흐름을 빨리 감지하고 패턴을 찾는 힘이 있습니다.",
      en: "You detect patterns and repeated signals quickly.",
    },
    caution: {
      ko: "한 장면이 너무 커지면 새로운 가능성을 보기 어려워질 수 있습니다.",
      en: "If one scene grows too large, it becomes harder to see new possibilities.",
    },
    shareLine: {
      ko: "나는 한 번의 일을 크게 확장해서 보는 타입이래.",
      en: "I tend to expand one event into a bigger pattern.",
    },
  },
  {
    id: "emotional-reasoning",
    title: { ko: "감정적 추론", en: "Emotional Reasoning" },
    oneLiner: {
      ko: "불안하니까 진짜 위험한 것처럼 느끼는 사람",
      en: "When you feel anxious, the danger can feel real.",
    },
    description: {
      ko: "당신은 감정이 강하게 올라오면 그 감정을 현실의 증거처럼 느낄 때가 있습니다. 마음이 보내는 신호가 선명해서, 사실과 감정의 거리가 가까워질 수 있어요.",
      en: "When a feeling becomes strong, it may start to feel like evidence. Your emotional signals are vivid, so facts and feelings can move close together.",
    },
    flow: {
      ko: "불편함이 올라오면 '내가 이렇게 느끼는 데는 이유가 있을 거야'라는 생각이 먼저 힘을 얻을 수 있습니다.",
      en: "When discomfort rises, the thought 'If I feel this way, there must be a reason' can become convincing.",
    },
    reframe: {
      ko: "감정은 중요한 신호지만, 모든 신호가 그대로 결론이 되지는 않을 수 있어요.",
      en: "A feeling is an important signal, but not every signal needs to become a conclusion.",
    },
    strength: {
      ko: "자신의 감정 변화를 빠르게 알아차립니다.",
      en: "You notice emotional changes quickly.",
    },
    caution: {
      ko: "감정이 강한 날에는 사실 확인보다 결론이 먼저 날 수 있습니다.",
      en: "On emotionally intense days, conclusions may arrive before fact-checking.",
    },
    shareLine: {
      ko: "나는 감정이 강하면 그게 사실처럼 느껴지는 타입이래.",
      en: "When my emotions get strong, they can feel like facts.",
    },
  },
  {
    id: "should-statements",
    title: { ko: "당위진술", en: "Should Statements" },
    oneLiner: {
      ko: "“나는 반드시 그래야 해”에 자주 묶이는 사람",
      en: "You can get tied to 'I should' and 'I must.'",
    },
    description: {
      ko: "당신은 자신에게 높은 기준을 두고, 그 기준에서 벗어나면 쉽게 압박을 느낄 수 있습니다. 책임감과 성실함이 강한 만큼 '해야 한다'는 말이 마음을 조일 때가 있어요.",
      en: "You hold yourself to high standards, and stepping away from them can feel pressuring. Your responsibility is real, but 'should' can become tight.",
    },
    flow: {
      ko: "쉬고 싶거나 실수했을 때도 '이러면 안 되는데'라는 문장이 먼저 떠오를 수 있습니다.",
      en: "Even when you need rest or make a mistake, 'I should not be like this' may appear first.",
    },
    reframe: {
      ko: "해야 한다는 말 뒤에, 정말 원하는 것과 지금 가능한 것을 따로 물어봐도 괜찮아요.",
      en: "Behind 'I should,' it is okay to ask what you truly want and what is possible right now.",
    },
    strength: {
      ko: "책임감이 있고 기준을 지키려는 힘이 있습니다.",
      en: "You are responsible and try to honor your standards.",
    },
    caution: {
      ko: "기준이 너무 단단하면 나를 돌보는 선택까지 잘못처럼 느껴질 수 있습니다.",
      en: "If standards become too rigid, even caring for yourself can feel wrong.",
    },
    shareLine: {
      ko: "나는 ‘해야 한다’에 자주 묶이는 타입이래.",
      en: "I often get tied to 'I should.'",
    },
  },
  {
    id: "discounting-positive",
    title: { ko: "긍정 무시", en: "Discounting the Positive" },
    oneLiner: {
      ko: "잘한 건 당연하고, 부족한 것만 크게 보이는 사람",
      en: "Good things feel expected, while flaws look bigger.",
    },
    description: {
      ko: "당신은 좋은 결과나 칭찬을 쉽게 받아들이지 못하고, 부족한 부분을 더 크게 볼 수 있습니다. 더 잘하고 싶은 마음이 강해서 성과가 마음에 오래 머물지 못할 때가 있어요.",
      en: "You may struggle to receive good results or praise, while flaws stand out more. Wanting to do better can make achievements pass by too quickly.",
    },
    flow: {
      ko: "칭찬을 들어도 '운이 좋았어' 혹은 '그 정도는 당연해'라고 넘기고, 부족했던 장면을 더 오래 붙잡을 수 있습니다.",
      en: "Even after praise, you may think 'I was lucky' or 'That was expected,' while holding onto what was lacking.",
    },
    reframe: {
      ko: "부족한 점을 보는 눈과 별개로, 잘한 부분도 실제로 존재한 결과일 수 있어요.",
      en: "Seeing what was lacking does not erase the real parts you did well.",
    },
    strength: {
      ko: "더 나아질 지점을 세밀하게 찾는 힘이 있습니다.",
      en: "You can spot precise areas for improvement.",
    },
    caution: {
      ko: "좋은 결과를 계속 지우면 자신감이 쌓일 자리가 줄어들 수 있습니다.",
      en: "If you keep erasing good results, confidence has less room to build.",
    },
    shareLine: {
      ko: "나는 잘한 건 넘기고 부족한 것만 보는 타입이래.",
      en: "I tend to skip what I did well and focus on what was missing.",
    },
  },
  {
    id: "personalization",
    title: { ko: "개인화", en: "Personalization" },
    oneLiner: {
      ko: "일이 잘못되면 내 책임부터 떠올리는 사람",
      en: "When something goes wrong, you first look for your own responsibility.",
    },
    description: {
      ko: "당신은 상황의 여러 원인 중에서도 내 탓을 먼저 찾는 편일 수 있습니다. 책임감이 강하기 때문에 생기는 습관이지만, 모든 일을 혼자 떠안게 만들 수도 있어요.",
      en: "Among many possible causes, you may look for your own fault first. It can come from responsibility, but it may also make you carry too much alone.",
    },
    flow: {
      ko: "분위기가 어색해지거나 일이 틀어지면 '내가 뭘 잘못했나?'라는 질문이 빠르게 올라올 수 있습니다.",
      en: "When the mood shifts or something goes wrong, 'What did I do wrong?' can rise quickly.",
    },
    reframe: {
      ko: "내가 영향을 준 부분이 있을 수는 있지만, 모든 원인이 나 하나로 모이진 않을 수 있어요.",
      en: "You may have influenced part of it, but not every cause has to point only to you.",
    },
    strength: {
      ko: "자신의 역할을 돌아보고 관계를 책임 있게 다루려는 힘이 있습니다.",
      en: "You reflect on your role and try to handle relationships responsibly.",
    },
    caution: {
      ko: "내 몫이 아닌 일까지 떠안으면 마음이 쉽게 무거워질 수 있습니다.",
      en: "Taking on what is not yours can make your mind heavy.",
    },
    shareLine: {
      ko: "나는 일이 틀어지면 내 탓부터 생각하는 타입이래.",
      en: "When things go wrong, I tend to blame myself first.",
    },
  },
  {
    id: "balanced-perspective",
    title: { ko: "균형 판단형", en: "Balanced Perspective" },
    oneLiner: {
      ko: "생각이 흔들려도 바로 결론 내리지 않는 사람",
      en: "You can feel unsettled without rushing to a conclusion.",
    },
    description: {
      ko: "당신은 불편한 상황에서도 한 번의 신호만으로 전체를 판단하지 않으려는 편입니다. 감정이 올라와도 잠시 멈추고, 아직 모르는 정보가 있다는 것을 인정할 수 있습니다.",
      en: "Even when a situation feels uncomfortable, you tend not to judge the whole picture from one signal. You can pause, notice your feelings, and leave room for missing context.",
    },
    flow: {
      ko: "마음이 흔들릴 때도 '아직은 모른다'는 문장을 중간에 둘 수 있습니다. 그래서 생각이 너무 빨리 한쪽으로 치우치는 것을 줄이는 편입니다.",
      en: "When your mind starts moving, you can place 'I do not know yet' in the middle. That helps your thoughts avoid swinging too far too fast.",
    },
    reframe: {
      ko: "지금 판단할 정보가 부족할 수도 있습니다. 조금 더 보고, 필요한 만큼만 확인해도 괜찮습니다.",
      en: "There may not be enough information to judge yet. It is okay to wait, observe, and check only what is needed.",
    },
    strength: {
      ko: "상황을 크게 키우기 전에 한 번 멈추는 힘이 있습니다.",
      en: "You can pause before making a situation larger than it is.",
    },
    caution: {
      ko: "차분함이 감정 무시로 바뀌지 않도록, 불편함이 반복될 때는 이유를 살펴보는 것이 좋습니다.",
      en: "Just make sure calmness does not become ignoring your feelings when the same discomfort keeps repeating.",
    },
    shareLine: {
      ko: "나는 생각이 꼬일 때도 일단 판단을 보류하는 균형 판단형이래.",
      en: "My thinking pattern is Balanced Perspective. I tend to pause before jumping to conclusions.",
    },
  },
];

export const THINKING_QUESTIONS: ThinkingQuestion[] = [
  {
    id: "late-reply",
    prompt: { ko: "친구가 평소보다 답장이 늦습니다. 가장 먼저 가까운 생각은?", en: "A friend replies later than usual. What thought comes closest first?" },
    choices: [
      { id: "a", text: { ko: "나중에 답하겠지 하고 내 할 일을 한다", en: "I assume they will reply later and keep doing my own thing." }, weights: { "balanced-perspective": 2 } },
      { id: "b", text: { ko: "내가 뭔가 잘못했나 먼저 걱정된다", en: "I first worry that I may have done something wrong." }, weights: { personalization: 2, "mind-reading": 1 } },
      { id: "c", text: { ko: "바쁜 걸 수도 있지만 묘하게 신경 쓰인다", en: "They may be busy, but it still bothers me a little." }, weights: { "emotional-reasoning": 2 } },
      { id: "d", text: { ko: "답장이 늦은 이유를 여러 가지로 계속 추측한다", en: "I keep guessing different reasons for the late reply." }, weights: { "mind-reading": 2, catastrophizing: 1 } },
    ],
  },
  {
    id: "cold-feedback",
    prompt: { ko: "열심히 한 일에 대해 예상보다 차가운 피드백을 들었습니다. 당신의 반응은?", en: "You receive colder feedback than expected on something you worked hard on. How do you react?" },
    choices: [
      { id: "a", text: { ko: "감정은 잠깐 두고, 쓸 수 있는 피드백만 골라본다", en: "I pause my feelings and look for the useful parts of the feedback." }, weights: { "balanced-perspective": 2 } },
      { id: "b", text: { ko: "결국 실패한 거라고 느껴진다", en: "It feels like I failed altogether." }, weights: { "all-or-nothing": 2 } },
      { id: "c", text: { ko: "그 사람이 나를 별로 좋게 보지 않는 것 같다", en: "It feels like they do not see me positively." }, weights: { "mind-reading": 2 } },
      { id: "d", text: { ko: "왜 더 완벽하게 준비하지 못했는지 자책한다", en: "I blame myself for not preparing more perfectly." }, weights: { "should-statements": 2, personalization: 1 } },
    ],
  },
  {
    id: "group-silence",
    prompt: { ko: "단체 대화방에서 내 말에 반응이 거의 없었습니다. 가장 가까운 생각은?", en: "In a group chat, almost nobody reacts to what you said. What thought comes closest?" },
    choices: [
      { id: "a", text: { ko: "내 말이 분위기를 망친 것 같다", en: "It feels like I ruined the mood." }, weights: { personalization: 2 } },
      { id: "b", text: { ko: "사람들이 바빴을 수도 있다고 보고 다음 흐름을 기다린다", en: "I assume people may be busy and wait for the conversation to move on." }, weights: { "balanced-perspective": 2 } },
      { id: "c", text: { ko: "다들 나를 어색하게 생각하는 것 같다", en: "It feels like everyone finds me awkward." }, weights: { "mind-reading": 2, overgeneralization: 1 } },
      { id: "d", text: { ko: "한 번 이런 일이 있으면 앞으로도 계속 그럴 것 같다", en: "If it happened once, it feels like it will keep happening." }, weights: { overgeneralization: 2 } },
    ],
  },
  {
    id: "small-mistake",
    prompt: { ko: "사람들 앞에서 작은 실수를 했습니다. 머릿속에 가장 먼저 남는 생각은?", en: "You make a small mistake in front of others. What thought stays first?" },
    choices: [
      { id: "a", text: { ko: "민망하지만 작은 실수라고 보고 다시 흐름을 잡는다", en: "It is embarrassing, but I treat it as a small mistake and get back on track." }, weights: { "balanced-perspective": 2 } },
      { id: "b", text: { ko: "사람들이 그 장면을 계속 기억할 것 같다", en: "It feels like people will keep remembering that moment." }, weights: { "mind-reading": 2 } },
      { id: "c", text: { ko: "나는 이런 데서 늘 약한 것 같다", en: "It feels like I am always bad at situations like this." }, weights: { overgeneralization: 2 } },
      { id: "d", text: { ko: "실수하지 말았어야 한다고 계속 되뇌인다", en: "I keep telling myself I should not have made that mistake." }, weights: { "should-statements": 2 } },
    ],
  },
  {
    id: "ambiguous-face",
    prompt: { ko: "상대의 표정이 평소보다 굳어 보였습니다. 당신의 생각은?", en: "Someone's expression looks stiffer than usual. What do you think?" },
    choices: [
      { id: "a", text: { ko: "내가 뭔가 잘못 말했나 떠올린다", en: "I wonder whether I said something wrong." }, weights: { personalization: 2 } },
      { id: "b", text: { ko: "그 사람 컨디션일 수도 있다고 보고 더 지켜본다", en: "I consider that it may be their condition and wait for more context." }, weights: { "balanced-perspective": 2 } },
      { id: "c", text: { ko: "나를 불편해하는 신호처럼 느껴진다", en: "It feels like a sign that they are uncomfortable with me." }, weights: { "mind-reading": 2, "emotional-reasoning": 1 } },
      { id: "d", text: { ko: "괜히 불안하니까 실제로 문제가 있는 것 같다", en: "Because I feel anxious, it seems like something is actually wrong." }, weights: { "emotional-reasoning": 2 } },
    ],
  },
  {
    id: "deadline-stress",
    prompt: { ko: "해야 할 일이 몰려서 마음이 급해졌습니다. 가장 가까운 반응은?", en: "Tasks pile up and you feel rushed. What reaction comes closest?" },
    choices: [
      { id: "a", text: { ko: "이러다 전부 망칠 것 같다는 생각이 든다", en: "I feel like I am going to mess everything up." }, weights: { catastrophizing: 2 } },
      { id: "b", text: { ko: "할 수 있는 일부터 작게 나눠서 처리한다", en: "I break it down and handle what I can do first." }, weights: { "balanced-perspective": 2 } },
      { id: "c", text: { ko: "이 정도도 못 하면 안 된다고 나를 몰아붙인다", en: "I push myself, thinking I should be able to handle even this." }, weights: { "should-statements": 2 } },
      { id: "d", text: { ko: "지금 느끼는 압박감이 상황 전체를 더 크게 보이게 한다", en: "The pressure I feel makes the whole situation look bigger." }, weights: { "emotional-reasoning": 2 } },
    ],
  },
  {
    id: "praise",
    prompt: { ko: "누군가 당신을 칭찬했습니다. 가장 가까운 반응은?", en: "Someone praises you. What reaction comes closest?" },
    choices: [
      { id: "a", text: { ko: "어색해도 고맙다고 받고 넘긴다", en: "Even if it feels awkward, I accept it and say thank you." }, weights: { "balanced-perspective": 2 } },
      { id: "b", text: { ko: "그 정도는 누구나 할 수 있는 일이라고 생각한다", en: "I think anyone could have done that much." }, weights: { "discounting-positive": 2 } },
      { id: "c", text: { ko: "진심인지 예의상 하는 말인지 먼저 의심한다", en: "I first wonder if they mean it or are just being polite." }, weights: { "mind-reading": 2 } },
      { id: "d", text: { ko: "잘한 것보다 부족했던 부분이 먼저 떠오른다", en: "I first think of what was lacking rather than what went well." }, weights: { "discounting-positive": 2, "should-statements": 1 } },
    ],
  },
  {
    id: "plan-failed",
    prompt: { ko: "계획했던 일이 뜻대로 되지 않았습니다. 당신의 생각은?", en: "A plan does not go the way you hoped. What do you think?" },
    choices: [
      { id: "a", text: { ko: "역시 나는 이런 일을 잘 못하는 것 같다", en: "It feels like I am just not good at this kind of thing." }, weights: { overgeneralization: 2 } },
      { id: "b", text: { ko: "다음에도 비슷하게 안 될 것 같아 걱정된다", en: "I worry that it will go similarly badly next time." }, weights: { catastrophizing: 2 } },
      { id: "c", text: { ko: "계획이 틀어진 부분만 보고 다시 조정한다", en: "I look at the part that changed and adjust the plan." }, weights: { "balanced-perspective": 2 } },
      { id: "d", text: { ko: "내가 더 잘했으면 막을 수 있었을 것 같다", en: "It feels like I could have prevented it if I had done better." }, weights: { personalization: 2 } },
    ],
  },
  {
    id: "left-out",
    prompt: { ko: "친구들이 나 없이 만난 걸 나중에 알았습니다. 가장 가까운 생각은?", en: "You later find out friends met without you. What thought comes closest?" },
    choices: [
      { id: "a", text: { ko: "나를 일부러 뺀 것 같다는 생각이 든다", en: "It feels like they intentionally left me out." }, weights: { "mind-reading": 2 } },
      { id: "b", text: { ko: "아직 이유를 모르니 먼저 확인해본다", en: "I do not know the reason yet, so I check before deciding." }, weights: { "balanced-perspective": 2 } },
      { id: "c", text: { ko: "한 번 빠졌으니 앞으로도 멀어질 것 같다", en: "Since I was left out once, it feels like we will keep drifting apart." }, weights: { overgeneralization: 2, catastrophizing: 1 } },
      { id: "d", text: { ko: "내가 불편한 사람이어서 그런 것 같다", en: "It feels like it happened because I am uncomfortable to be around." }, weights: { personalization: 2 } },
    ],
  },
  {
    id: "conflict",
    prompt: { ko: "가까운 사람과 의견이 부딪혔습니다. 당신의 머릿속은?", en: "You clash with someone close to you. What happens in your head?" },
    choices: [
      { id: "a", text: { ko: "관계가 예전처럼 돌아가지 못할까 봐 걱정된다", en: "I worry the relationship may not go back to how it was." }, weights: { catastrophizing: 2 } },
      { id: "b", text: { ko: "내가 참았어야 했나 생각한다", en: "I wonder if I should have just held it in." }, weights: { "should-statements": 2, personalization: 1 } },
      { id: "c", text: { ko: "대화가 흔들릴 수도 있다고 보고 시간을 두고 정리한다", en: "I accept that conversations can get tense and take time to sort it out." }, weights: { "balanced-perspective": 2 } },
      { id: "d", text: { ko: "이 사람이 나를 좋게 보지 않게 된 것 같다", en: "It feels like this person no longer sees me positively." }, weights: { "mind-reading": 2 } },
    ],
  },
  {
    id: "new-try",
    prompt: { ko: "새로운 일을 시작하려고 합니다. 가장 먼저 드는 생각은?", en: "You are about to start something new. What thought comes first?" },
    choices: [
      { id: "a", text: { ko: "처음부터 잘할 필요는 없다고 보고 작게 시작한다", en: "I remind myself I do not need to be good from the start and begin small." }, weights: { "balanced-perspective": 2 } },
      { id: "b", text: { ko: "잘하지 못하면 시작한 의미가 없을 것 같다", en: "If I cannot do it well, it feels like there is no point starting." }, weights: { "all-or-nothing": 2 } },
      { id: "c", text: { ko: "준비가 충분하지 않으면 시작하면 안 될 것 같다", en: "It feels like I should not start unless I am fully prepared." }, weights: { "should-statements": 2 } },
      { id: "d", text: { ko: "조금 잘해도 부족한 점만 보일 것 같다", en: "Even if I do somewhat well, I feel like I will only see what is lacking." }, weights: { "discounting-positive": 2 } },
    ],
  },
  {
    id: "tired-day",
    prompt: { ko: "오늘 유난히 예민하고 지친 날입니다. 당신의 해석은?", en: "Today you feel especially sensitive and tired. How do you interpret it?" },
    choices: [
      { id: "a", text: { ko: "피곤한 날이라 그럴 수 있다고 보고 무리하지 않는다", en: "I see it as a tired day and try not to push too hard." }, weights: { "balanced-perspective": 2 } },
      { id: "b", text: { ko: "내가 너무 약한 사람 같아서 신경 쓰인다", en: "It bothers me because I feel like I am too weak." }, weights: { "should-statements": 2, personalization: 1 } },
      { id: "c", text: { ko: "이 감정이 강하니 뭔가 큰 문제가 있는 것 같다", en: "Because the feeling is strong, it seems like there must be a big problem." }, weights: { "emotional-reasoning": 2 } },
      { id: "d", text: { ko: "요즘 계속 이럴 것 같아 걱정된다", en: "I worry that I will keep feeling this way." }, weights: { overgeneralization: 2, catastrophizing: 1 } },
    ],
  },
];


export function calculateThinkingResult(answers: ThinkingAnswer[]): ThinkingResult {
  const scores = new Map<ThinkingPatternId, number>();
  for (const result of THINKING_RESULTS) scores.set(result.id, 0);

  for (const answer of answers) {
    for (const [id, value] of Object.entries(answer.weights) as Array<[ThinkingPatternId, number]>) {
      scores.set(id, (scores.get(id) ?? 0) + value);
    }
  }

  let winner = THINKING_RESULTS[0];
  let bestScore = -Infinity;
  for (const result of THINKING_RESULTS) {
    const score = scores.get(result.id) ?? 0;
    if (score > bestScore) {
      winner = result;
      bestScore = score;
    }
  }
  return winner;
}

export function getThinkingResultById(id: string | null | undefined): ThinkingResult | null {
  if (!id) return null;
  return THINKING_RESULTS.find((result) => result.id === id) ?? null;
}
