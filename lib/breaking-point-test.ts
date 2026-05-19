export type BreakingLocale = "ko" | "en";

export type LocalizedText = {
  ko: string;
  en: string;
};

export type BreakingDimension =
  | "repeatedDisrespect"
  | "misunderstoodSincerity"
  | "violatedBoundary"
  | "overloadedResponsibility"
  | "betrayedTrust"
  | "delayedRecognition"
  | "uncontrollableChaos"
  | "abandonedFeeling";

export type BreakingChoice = {
  id: string;
  text: LocalizedText;
  scores: Partial<Record<BreakingDimension, number>>;
};

export type BreakingQuestion = {
  id: string;
  prompt: LocalizedText;
  choices: BreakingChoice[];
};

export type BreakingResult = {
  id: BreakingDimension;
  title: LocalizedText;
  oneLiner: LocalizedText;
  description: LocalizedText;
  howYouChange: LocalizedText;
  sign: LocalizedText;
  gentleNote: LocalizedText;
  friendComment: LocalizedText;
  shareLine: LocalizedText;
  accent: string;
};

export const BREAKING_COPY = {
  languageLabel: { ko: "언어 선택", en: "Language selection" },
  title: { ko: "나를 차갑게 만드는 순간", en: "The Moment I Turn Cold" },
  badge: { ko: "심리 테스트", en: "Psychology Test" },
  subtitle: { ko: "평소의 내가 달라지는 지점은 어디일까요?", en: "Where does your usual self begin to change?" },
  description: {
    ko: "사람은 한 번의 사건보다, 반복되는 감각에 더 깊게 변할 때가 있습니다. 나를 차갑게 만들고 마음의 기준선을 바꾸는 순간을 알아보세요.",
    en: "Sometimes people do not change because of one event, but because of a feeling repeated too many times. Discover what makes you turn cold and shift your inner boundary.",
  },
  disclaimer: {
    ko: "이 테스트는 전문적인 진단이 아닌, 심리학적 자기이해를 위한 재미용 콘텐츠입니다.",
    en: "This is not a professional diagnosis. It is an entertainment and self-reflection experience.",
  },
  start: { ko: "테스트 시작하기", en: "Start the test" },
  meta: { ko: "16문항 · 약 4분", en: "16 questions · about 4 min" },
  questionCount: { ko: "질문", en: "Question" },
  resultLabel: { ko: "나의 기준선", en: "My Inner Line" },
  howYouChange: { ko: "당신이 변하는 방식", en: "How you change" },
  sign: { ko: "위험 신호", en: "Warning sign" },
  gentleNote: { ko: "조금 더 나를 지키는 방법", en: "A gentler way to protect yourself" },
  friendComment: { ko: "친구가 보면 할 말", en: "What a friend might say" },
  share: { ko: "결과 공유하기", en: "Share result" },
  copied: { ko: "링크 복사됨", en: "Link copied" },
  retry: { ko: "다시 하기", en: "Retry" },
  related: { ko: "이 테스트도 해보세요", en: "Try These Next" },
} satisfies Record<string, LocalizedText>;

export const BREAKING_QUESTIONS: BreakingQuestion[] = [
  {
    id: "bp_01",
    prompt: {
      ko: "며칠 동안 계속 부탁을 들어줬는데, 상대는 당연하다는 듯 다시 부탁합니다. 당신에게 가장 가까운 반응은?",
      en: "You have helped someone several times over a few days, and they ask again as if it is expected. What feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "이번에도 도와주지만, 마음속에서 선을 하나 긋는다", en: "I help again, but I draw a quiet line inside." }, scores: { violatedBoundary: 3 } },
      { id: "b", text: { ko: "바로 거절하기보다 지금 내 상황을 설명해본다", en: "Rather than refusing right away, I explain my situation." }, scores: { misunderstoodSincerity: 1, violatedBoundary: 1 } },
      { id: "c", text: { ko: "겉으로는 괜찮다고 하지만, 이후에는 먼저 나서지 않는다", en: "I say it is fine, but I stop stepping forward first afterward." }, scores: { repeatedDisrespect: 2, abandonedFeeling: 1 } },
      { id: "d", text: { ko: "상대도 급했을 수 있다고 보고 상황을 조금 더 본다", en: "I assume they may have been pressed too, and watch a little longer." }, scores: { overloadedResponsibility: 1 } },
    ],
  },
  {
    id: "bp_02",
    prompt: {
      ko: "오래 준비한 일을 끝냈지만, 주변 사람들은 별다른 반응 없이 다음 일을 이야기합니다. 당신에게 가장 가까운 반응은?",
      en: "You finish something you prepared for a long time, but people move on to the next task with little reaction. What comes closest?",
    },
    choices: [
      { id: "a", text: { ko: "인정받지 못해 아쉽다는 생각이 먼저 든다", en: "I first feel disappointed that the effort was not recognized." }, scores: { delayedRecognition: 3 } },
      { id: "b", text: { ko: "결과보다 다음 할 일을 정리하려고 한다", en: "I try to organize the next task rather than dwell on the result." }, scores: { overloadedResponsibility: 1, uncontrollableChaos: 1 } },
      { id: "c", text: { ko: "티 내지 않지만 조금 서운해서 의욕이 식는다", en: "I do not show it, but I feel a little hurt and lose some motivation." }, scores: { abandonedFeeling: 2, delayedRecognition: 1 } },
      { id: "d", text: { ko: "내가 너무 기대했나 싶어 넘기려 한다", en: "I wonder if I expected too much and try to let it pass." }, scores: { repeatedDisrespect: 1 } },
    ],
  },
  {
    id: "bp_03",
    prompt: {
      ko: "가까운 사람이 당신의 말을 반복해서 가볍게 넘깁니다. 당신에게 가장 가까운 반응은?",
      en: "Someone close keeps brushing off what you say. What feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "처음에는 넘어가지만, 어느 순간 말하고 싶지 않아진다", en: "I let it pass at first, but eventually I stop wanting to talk." }, scores: { repeatedDisrespect: 3 } },
      { id: "b", text: { ko: "한 번은 분명하게 짚고 넘어가려고 한다", en: "I try to clearly point it out at least once." }, scores: { violatedBoundary: 1, misunderstoodSincerity: 1 } },
      { id: "c", text: { ko: "내가 너무 예민한 건지 이유를 찾아본다", en: "I wonder if I am being too sensitive and look for reasons." }, scores: { misunderstoodSincerity: 1 } },
      { id: "d", text: { ko: "대화의 흐름을 바꿔 분위기를 유지한다", en: "I shift the conversation to keep the mood steady." }, scores: { abandonedFeeling: 1 } },
    ],
  },
  {
    id: "bp_04",
    prompt: {
      ko: "진심으로 한 행동이 몇 번이나 다른 의도로 받아들여졌습니다. 이번에도 설명할 기회는 있지만 이미 지친 느낌입니다.",
      en: "Your sincere actions have been misread several times. You could explain again, but you already feel tired.",
    },
    choices: [
      { id: "a", text: { ko: "오해를 풀고 싶지만, 마음을 보여주는 일이 무겁게 느껴진다", en: "I want to clear it up, but showing my heart feels heavy." }, scores: { misunderstoodSincerity: 3 } },
      { id: "b", text: { ko: "핵심만 짧게 설명하고, 더 이상 내 의도를 계속 증명하지는 않는다", en: "I explain only the core point and stop trying to keep proving my intent." }, scores: { violatedBoundary: 1 } },
      { id: "c", text: { ko: "또 설명해야 한다는 사실 때문에 마음의 온도가 내려간다", en: "Having to explain again makes my warmth drop." }, scores: { repeatedDisrespect: 1, misunderstoodSincerity: 2 } },
      { id: "d", text: { ko: "이번에도 상대가 받아들인 맥락을 한 번은 생각해본다", en: "I still consider the context that made them read it that way." }, scores: { abandonedFeeling: 1 } },
    ],
  },
  {
    id: "bp_05",
    prompt: {
      ko: "팀에서 빈자리가 생기면 늘 당신이 메우게 됩니다. 아무도 강요하지 않았지만, 모두가 자연스럽게 기대하는 분위기입니다.",
      en: "Whenever there is a gap in the team, you end up filling it. Nobody forces you, but everyone seems to expect it naturally.",
    },
    choices: [
      { id: "a", text: { ko: "이번에도 맡지만 속으로는 무게가 확 느껴진다", en: "I take it on again, but the weight hits me inside." }, scores: { overloadedResponsibility: 3 } },
      { id: "b", text: { ko: "내가 할 수 있는 범위를 먼저 정리해 말한다", en: "I first state what I can realistically handle." }, scores: { violatedBoundary: 2 } },
      { id: "c", text: { ko: "왜 항상 나부터 떠올리는지 계속 신경 쓰인다", en: "It keeps bothering me that I am always the first person they think of." }, scores: { repeatedDisrespect: 2, overloadedResponsibility: 1 } },
      { id: "d", text: { ko: "상황이 급하니 우선 정리하고 나중에 이야기하려 한다", en: "Since things are urgent, I organize it first and talk later." }, scores: { uncontrollableChaos: 1, overloadedResponsibility: 1 } },
    ],
  },
  {
    id: "bp_06",
    prompt: {
      ko: "믿고 맡긴 이야기가 다른 사람에게까지 전해진 것 같습니다. 상대는 큰일 아니라고 말합니다.",
      en: "A story you trusted someone with seems to have reached another person. They say it was not a big deal.",
    },
    choices: [
      { id: "a", text: { ko: "그 순간부터 마음속에서 상대의 위치가 달라진다", en: "From that moment, their place in my mind changes." }, scores: { betrayedTrust: 3 } },
      { id: "b", text: { ko: "어디까지 전해졌는지 차분히 확인하려 한다", en: "I calmly check how far it went." }, scores: { uncontrollableChaos: 1, betrayedTrust: 1 } },
      { id: "c", text: { ko: "내가 중요하게 여긴 걸 가볍게 보는 느낌이 든다", en: "It feels like they are treating something important to me lightly." }, scores: { repeatedDisrespect: 2, betrayedTrust: 1 } },
      { id: "d", text: { ko: "일단 더는 개인적인 이야기를 하지 않겠다고 정한다", en: "I decide not to share personal things with them for now." }, scores: { violatedBoundary: 1, betrayedTrust: 2 } },
    ],
  },
  {
    id: "bp_07",
    prompt: {
      ko: "상황이 계속 바뀌고, 기준도 매번 다릅니다. 당신은 맞추려고 하지만 무엇에 맞춰야 할지 점점 흐려집니다.",
      en: "The situation keeps changing, and the standard shifts every time. You try to adapt, but it becomes unclear what you are adapting to.",
    },
    choices: [
      { id: "a", text: { ko: "기준을 먼저 정하지 않으면 더는 움직이기 어렵다", en: "If the standard is not clarified first, it is hard for me to keep moving." }, scores: { uncontrollableChaos: 3 } },
      { id: "b", text: { ko: "불확실한 부분과 확실한 부분을 나눠본다", en: "I separate what is uncertain from what is clear." }, scores: { uncontrollableChaos: 2 } },
      { id: "c", text: { ko: "계속 바뀌는 흐름 때문에 점점 여유가 없어진다", en: "The constant changes leave me with less and less room to breathe." }, scores: { overloadedResponsibility: 1, uncontrollableChaos: 2 } },
      { id: "d", text: { ko: "다들 혼란스러울 수 있으니 조금 더 지켜본다", en: "Everyone may be confused, so I watch a bit longer." }, scores: { abandonedFeeling: 1 } },
    ],
  },
  {
    id: "bp_08",
    prompt: {
      ko: "사람들 사이에 있지만, 정작 내 마음을 묻는 사람은 없습니다. 대화는 이어지는데 이상하게 혼자 남은 느낌입니다.",
      en: "You are among people, but nobody asks what is going on inside you. The conversation continues, yet you feel strangely alone.",
    },
    choices: [
      { id: "a", text: { ko: "말을 줄이고, 기대도 조금 줄이게 된다", en: "I speak less and lower my expectations a little." }, scores: { abandonedFeeling: 3 } },
      { id: "b", text: { ko: "한 사람에게라도 구체적으로 말해볼까 생각한다", en: "I consider telling at least one person more specifically." }, scores: { misunderstoodSincerity: 1, abandonedFeeling: 1 } },
      { id: "c", text: { ko: "분위기를 깨고 싶지 않아 평소처럼 반응한다", en: "I respond as usual because I do not want to disturb the mood." }, scores: { abandonedFeeling: 2 } },
      { id: "d", text: { ko: "내가 표현을 충분히 안 했을 수도 있다고 본다", en: "I consider that maybe I have not expressed enough." }, scores: { misunderstoodSincerity: 1 } },
    ],
  },
  {
    id: "bp_09",
    prompt: {
      ko: "상대가 약속을 자주 바꿉니다. 사정은 늘 이해가 되지만, 당신의 일정은 계속 뒤로 밀립니다.",
      en: "Someone often changes plans. Their reasons always make sense, but your own schedule keeps getting pushed back.",
    },
    choices: [
      { id: "a", text: { ko: "이해는 하지만 내 시간을 가볍게 보는 느낌이 든다", en: "I understand, but it feels like my time is being treated lightly." }, scores: { repeatedDisrespect: 2, violatedBoundary: 2 } },
      { id: "b", text: { ko: "다음부터는 가능한 시간과 아닌 시간을 분명히 말한다", en: "Next time, I clearly state what time works and what does not." }, scores: { violatedBoundary: 3 } },
      { id: "c", text: { ko: "그 사람과의 약속에는 기대를 덜 하게 된다", en: "I lower my expectations around plans with them." }, scores: { betrayedTrust: 1, abandonedFeeling: 1 } },
      { id: "d", text: { ko: "요즘 사정이 많은가 보다 하고 한 번 더 넘긴다", en: "I assume they have a lot going on and let it pass once more." }, scores: { misunderstoodSincerity: 1 } },
    ],
  },
  {
    id: "bp_10",
    prompt: {
      ko: "당신이 계속 챙겨온 일이 잘 굴러가자, 사람들은 그것이 원래 쉬운 일처럼 말합니다.",
      en: "Something you have been carefully maintaining starts running well, and people talk as if it was easy all along.",
    },
    choices: [
      { id: "a", text: { ko: "내가 들인 시간이 지워지는 느낌이 든다", en: "It feels like the time I put in is being erased." }, scores: { delayedRecognition: 3 } },
      { id: "b", text: { ko: "과정을 알아주지 않아도 결과가 남았다고 생각한다", en: "Even if they do not see the process, I tell myself the result remains." }, scores: { delayedRecognition: 1 } },
      { id: "c", text: { ko: "다음에는 내가 한 일을 조금 더 기록해두려 한다", en: "Next time, I want to keep a clearer record of what I did." }, scores: { uncontrollableChaos: 1, delayedRecognition: 1 } },
      { id: "d", text: { ko: "앞으로는 조용히 더 해주고 싶지 않아진다", en: "I no longer want to quietly keep doing more." }, scores: { repeatedDisrespect: 2, violatedBoundary: 1 } },
    ],
  },
  {
    id: "bp_11",
    prompt: {
      ko: "힘든 이야기를 꺼낼 때마다 상대는 곧 자기 이야기로 넘어갑니다. 악의는 없어 보이지만, 이번에는 말문이 막힙니다.",
      en: "Whenever you bring up something hard, they soon turn it into their own story. It does not seem intentional, but this time something in you stops.",
    },
    choices: [
      { id: "a", text: { ko: "내 이야기를 꺼낼 수 있는 자리로 느껴지지 않게 된다", en: "This no longer feels like a place where my story can be brought out." }, scores: { abandonedFeeling: 3 } },
      { id: "b", text: { ko: "이번에는 말해보지만, 예전처럼 길게 기대하지는 않는다", en: "This time I say something, but I do not expect as much as before." }, scores: { misunderstoodSincerity: 2 } },
      { id: "c", text: { ko: "상대도 자기 힘든 게 컸을 수 있다고 한 번은 생각한다", en: "I still consider that their own difficulty may have felt big too." }, scores: { abandonedFeeling: 1 } },
      { id: "d", text: { ko: "듣고는 있지만, 이 관계에서 내 위치를 다시 정하게 된다", en: "I keep listening, but I start redefining my place in this relationship." }, scores: { repeatedDisrespect: 1, abandonedFeeling: 2 } },
    ],
  },
  {
    id: "bp_12",
    prompt: {
      ko: "중요한 순간에 기대했던 사람이 당신 편에 서지 않았습니다. 이유는 들었지만 쉽게 괜찮아지지 않습니다.",
      en: "At an important moment, someone you expected to stand with you did not. You heard their reason, but your heart does not return easily.",
    },
    choices: [
      { id: "a", text: { ko: "이후에는 그 사람에게 기대는 기준이 달라진다", en: "After that, the standard for relying on them changes." }, scores: { betrayedTrust: 3 } },
      { id: "b", text: { ko: "그 순간 내가 무엇을 기대했는지 먼저 정리한다", en: "I first sort out what I had expected in that moment." }, scores: { betrayedTrust: 1, misunderstoodSincerity: 1 } },
      { id: "c", text: { ko: "그 사람도 어려웠을 수 있지만, 다시 기대하기는 어렵다", en: "They may have had their own difficulty, but it becomes hard to rely on them again." }, scores: { betrayedTrust: 2, abandonedFeeling: 1 } },
      { id: "d", text: { ko: "바로 판단하지 않고 다음 행동까지 보려 한다", en: "I try not to judge immediately and watch what they do next." }, scores: { betrayedTrust: 1 } },
    ],
  },
  {
    id: "bp_13",
    prompt: {
      ko: "함께 정해야 할 일이 자꾸 미뤄지고, 그때마다 당신만 기다리는 상황이 반복됩니다.",
      en: "A decision you need to make together keeps getting delayed, and you are repeatedly the one left waiting.",
    },
    choices: [
      { id: "a", text: { ko: "내 시간이 계속 대기 상태가 되는 느낌에 마음이 식는다", en: "My warmth drops when my time keeps being left on standby." }, scores: { violatedBoundary: 3 } },
      { id: "b", text: { ko: "언제까지 정해야 하는지 기준을 먼저 잡아보려 한다", en: "I try to set a clear point for when the decision needs to be made." }, scores: { violatedBoundary: 1, uncontrollableChaos: 1 } },
      { id: "c", text: { ko: "내가 기다리는 건 당연하게 여겨진다고 느낀다", en: "It feels like my waiting is being treated as expected." }, scores: { repeatedDisrespect: 2 } },
      { id: "d", text: { ko: "이번에도 내가 정리해야 하나 싶어 지친다", en: "I get tired wondering if I have to organize it again this time." }, scores: { overloadedResponsibility: 1, violatedBoundary: 1 } },
    ],
  },
  {
    id: "bp_14",
    prompt: {
      ko: "여러 사람이 각자 다른 말을 하며 결정을 미룹니다. 결국 정리하는 사람은 또 당신이 될 것 같습니다.",
      en: "Several people keep saying different things and delaying a decision. It looks like you will end up organizing it again.",
    },
    choices: [
      { id: "a", text: { ko: "또 내가 맡게 될 것 같아 시작하기 전부터 지친다", en: "It feels like I will carry it again, so I get tired before it even starts." }, scores: { overloadedResponsibility: 3 } },
      { id: "b", text: { ko: "결정 기준을 한 문장으로 정리해보자고 한다", en: "I suggest summarizing the decision standard in one sentence." }, scores: { uncontrollableChaos: 2 } },
      { id: "c", text: { ko: "정리가 안 된 흐름이 오래 이어지는 게 가장 답답하다", en: "The most frustrating part is the disorder continuing too long." }, scores: { uncontrollableChaos: 3 } },
      { id: "d", text: { ko: "내가 다 하지 않도록 역할을 먼저 나눈다", en: "I divide roles first so I do not do everything." }, scores: { violatedBoundary: 1, overloadedResponsibility: 2 } },
    ],
  },
  {
    id: "bp_15",
    prompt: {
      ko: "당신의 성장을 오래 지켜본 사람이, 여전히 예전의 당신처럼 대합니다. 웃어넘길 수 있지만 마음에 걸립니다.",
      en: "Someone who has seen your growth for a long time still treats you like your old self. You could laugh it off, but it bothers you.",
    },
    choices: [
      { id: "a", text: { ko: "내가 변한 만큼 봐주지 않는다는 느낌이 든다", en: "It feels like they are not seeing how much I have changed." }, scores: { delayedRecognition: 3 } },
      { id: "b", text: { ko: "내가 달라진 부분을 담담하게 말해보고 싶다", en: "I want to calmly name what has changed in me." }, scores: { misunderstoodSincerity: 1, delayedRecognition: 1 } },
      { id: "c", text: { ko: "그 사람 앞에서는 더 보여주고 싶지 않아진다", en: "I no longer want to show more of myself around them." }, scores: { repeatedDisrespect: 1, delayedRecognition: 2 } },
      { id: "d", text: { ko: "그 사람이 익숙한 이미지로 보는 걸 수도 있다고 넘긴다", en: "I let it pass, thinking they may be seeing an old familiar image." }, scores: { delayedRecognition: 1 } },
    ],
  },
  {
    id: "bp_16",
    prompt: {
      ko: "오랫동안 괜찮다고 말해왔지만, 어느 날 같은 장면이 반복되자 더는 예전처럼 반응하고 싶지 않습니다. 당신에게 가까운 쪽은?",
      en: "You have said you were fine for a long time, but one day the same scene repeats and you no longer want to respond the old way. What feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "크게 말하기보다 허용 범위를 다시 정한다", en: "Rather than making a big statement, I redefine what I will allow." }, scores: { repeatedDisrespect: 1, betrayedTrust: 1, abandonedFeeling: 1 } },
      { id: "b", text: { ko: "내가 지킬 수 있는 선을 이번에는 분명히 말한다", en: "This time, I clearly say what line I need to protect." }, scores: { violatedBoundary: 2, misunderstoodSincerity: 1 } },
      { id: "c", text: { ko: "내 어깨에 계속 올라온 책임을 더 이상 당연하게 두지 않는다", en: "I stop allowing responsibility that kept landing on me to be treated as normal." }, scores: { overloadedResponsibility: 2, delayedRecognition: 1 } },
      { id: "d", text: { ko: "무엇이 반복될 때 내가 변하는지 차분히 확인한다", en: "I calmly check what repeated pattern changes me." }, scores: { uncontrollableChaos: 1, betrayedTrust: 1 } },
    ],
  },
];

export const BREAKING_RESULTS: Record<BreakingDimension, BreakingResult> = {
  repeatedDisrespect: {
    id: "repeatedDisrespect",
    title: { ko: "반복된 무시", en: "Repeated Disrespect" },
    oneLiner: { ko: "한 번의 상처보다, 계속 가볍게 여겨지는 감각에 무너지는 사람", en: "You are changed less by one hurt than by the feeling of being repeatedly taken lightly." },
    description: {
      ko: "당신은 한 번의 차가운 말보다, 반복해서 가볍게 여겨지는 감각에 더 크게 흔들립니다. 처음에는 이해하려고 하고, 두 번째에는 넘기려고 하지만, 같은 일이 계속되면 마음속 기준선이 조용히 바뀝니다.",
      en: "You are shaken more by the repeated feeling of being treated lightly than by one cold word. At first you try to understand, then you try to let it pass, but if it keeps happening, your inner line quietly moves.",
    },
    howYouChange: {
      ko: "당신은 크게 소란스러워지기보다 허용 범위를 다시 정합니다. 어느 날 갑자기 차가워진 것처럼 보이지만, 사실은 오래전부터 마음의 기준선을 조금씩 옮기고 있었을 가능성이 큽니다.",
      en: "You tend to create quiet distance rather than become loud. It may look sudden from the outside, but inside you may have been organizing your feelings for a long time.",
    },
    sign: { ko: "“내가 계속 이렇게까지 해야 하나?”", en: "“Do I really have to keep going this far?”" },
    gentleNote: {
      ko: "무시당했다는 감각이 들 때는 바로 관계를 끊기보다, 먼저 내가 어디까지 괜찮고 어디서부터 힘든지 말로 꺼내보는 것이 도움이 될 수 있습니다.",
      en: "When you feel taken lightly, it can help to name where you are okay and where it starts becoming too much before you fully pull away.",
    },
    friendComment: { ko: "너 갑자기 차가워진 게 아니라, 오래 참다가 정리한 거잖아.", en: "You did not suddenly turn cold. You were patient for a long time, then you sorted it out inside." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「반복된 무시」가 나왔다. 이거 좀 맞는 듯.", en: "I got “Repeated Disrespect” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#d39a64",
  },
  misunderstoodSincerity: {
    id: "misunderstoodSincerity",
    title: { ko: "이해받지 못한 진심", en: "Misunderstood Sincerity" },
    oneLiner: { ko: "좋은 의도가 다르게 해석될 때 가장 깊게 지치는 사람", en: "You tire most deeply when your sincere intention is read the wrong way." },
    description: {
      ko: "당신은 결과보다 의도를 중요하게 생각합니다. 그래서 내가 진심으로 한 말이나 행동이 오해받을 때, 단순한 서운함보다 더 깊은 피로를 느낄 수 있습니다.",
      en: "You care deeply about intention. When words or actions you meant sincerely are misunderstood, you may feel a deeper fatigue than simple disappointment.",
    },
    howYouChange: {
      ko: "처음에는 설명하려고 하지만, 계속 오해받는다고 느끼면 설명의 기준이 달라집니다. 마음을 보여주는 것이 의미 없다고 느껴지는 순간, 당신은 더 이상 같은 방식으로 열려 있지 않게 됩니다.",
      en: "At first you try to explain. But if misunderstanding repeats, you speak less. When showing your heart starts to feel pointless, you begin to close quietly.",
    },
    sign: { ko: "“내가 그런 뜻으로 한 게 아닌데.”", en: "“That is not what I meant.”" },
    gentleNote: {
      ko: "모든 진심이 바로 이해되지는 않습니다. 하지만 반복해서 오해되는 관계라면, 설명보다 경계가 먼저 필요할 수도 있습니다.",
      en: "Not every sincere feeling is understood immediately. But in a relationship where you are repeatedly misread, a boundary may matter more than another explanation.",
    },
    friendComment: { ko: "너 설명하다 지치면 갑자기 아무 말도 안 하잖아.", en: "When you get tired of explaining, you suddenly stop talking." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「이해받지 못한 진심」이 나왔다. 이거 좀 맞는 듯.", en: "I got “Misunderstood Sincerity” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#b98f72",
  },
  violatedBoundary: {
    id: "violatedBoundary",
    title: { ko: "존중받지 못한 경계", en: "Violated Boundary" },
    oneLiner: { ko: "다정하지만, 선을 넘는 순간 매우 단단해지는 사람", en: "You can be warm, but become very firm when your boundary is crossed." },
    description: {
      ko: "당신은 웬만하면 맞춰주고 넘어가려는 편일 수 있습니다. 하지만 누군가 당신의 시간, 마음, 공간을 당연하게 여길 때, 그 다정함은 빠르게 단단한 벽으로 바뀔 수 있습니다.",
      en: "You may usually try to adjust and move on. But when someone treats your time, feelings, or space as something they can freely access, that warmth can quickly become a firm wall.",
    },
    howYouChange: {
      ko: "당신은 처음부터 차갑지 않습니다. 오히려 오래 참는 편에 가깝습니다. 하지만 선을 넘었다고 느낀 순간부터는 설명보다 허용 범위를 다시 정하는 일이 먼저 나올 수 있습니다.",
      en: "You are not cold from the beginning. You often hold on for quite a while. But once you feel a line has been crossed, distance may come before explanation.",
    },
    sign: { ko: "“내가 편해서가 아니라, 네가 선을 넘은 거야.”", en: "“It is not that I am difficult. You crossed a line.”" },
    gentleNote: {
      ko: "경계는 차가움이 아니라 나를 지키는 방식입니다. 다만 상대가 알아차릴 수 있도록 조금 더 일찍 표현하는 것이 관계를 덜 다치게 할 수 있습니다.",
      en: "A boundary is not coldness; it is a way to protect yourself. Expressing it a little earlier can keep the relationship from getting more hurt.",
    },
    friendComment: { ko: "너 괜찮다고 말할 때가 제일 안 괜찮을 때 있음.", en: "Sometimes when you say you are fine, that is when you are least fine." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「존중받지 못한 경계」가 나왔다. 이거 좀 맞는 듯.", en: "I got “Violated Boundary” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#d86c54",
  },
  overloadedResponsibility: {
    id: "overloadedResponsibility",
    title: { ko: "책임의 과부하", en: "Overloaded Responsibility" },
    oneLiner: { ko: "모든 책임이 내 어깨에 올라온다고 느낄 때 무너지는 사람", en: "You change when every responsibility seems to land on your shoulders." },
    description: {
      ko: "당신은 책임감이 강한 편입니다. 그래서 필요한 순간에는 먼저 나서고, 부족한 부분을 채우려 합니다. 하지만 그 역할이 반복되어 모두가 당신의 어깨를 기본값처럼 여기기 시작하면, 어느 순간 마음속에서 무거운 피로가 쌓입니다.",
      en: "You likely have a strong sense of responsibility. You step forward when needed and fill the gaps. But when that role repeats and everyone starts leaning on you, a heavy fatigue builds inside.",
    },
    howYouChange: {
      ko: "처음에는 더 잘하려고 합니다. 하지만 너무 오래 버티면 감정이 사라진 사람처럼 차분해지거나, 갑자기 모든 걸 내려놓고 싶어질 수 있습니다.",
      en: "At first you try to do even better. But if you hold it for too long, you may become strangely calm, or suddenly want to put everything down.",
    },
    sign: { ko: "“왜 항상 내가 해야 하지?”", en: "“Why does it always have to be me?”" },
    gentleNote: {
      ko: "책임감은 강점이지만, 모든 것을 떠안는 것은 강함이 아니라 고립이 될 수 있습니다. 나눌 수 있는 책임은 나누는 연습이 필요합니다.",
      en: "Responsibility is a strength, but carrying everything can become isolation rather than strength. Practice sharing what can be shared.",
    },
    friendComment: { ko: "너 책임감으로 버티다가 갑자기 사라질 때 있잖아.", en: "You hold on through responsibility, then sometimes disappear all at once." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「책임의 과부하」가 나왔다. 이거 좀 맞는 듯.", en: "I got “Overloaded Responsibility” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#caa56a",
  },
  betrayedTrust: {
    id: "betrayedTrust",
    title: { ko: "배신당한 신뢰", en: "Betrayed Trust" },
    oneLiner: { ko: "한 번 마음을 열었기 때문에, 무너질 때 더 깊게 닫히는 사람", en: "Because you opened your heart, you close more deeply when trust breaks." },
    description: {
      ko: "당신은 누구에게나 쉽게 기대는 타입은 아닐 수 있습니다. 그래서 한 번 믿고 마음을 열었던 사람이 그 신뢰를 가볍게 다룰 때, 단순한 실망보다 관계 안의 위치가 바뀌는 감각을 더 크게 느낍니다.",
      en: "You may not rely on just anyone. So when someone you trusted and opened up to treats that trust lightly, you feel a deeper disconnection than ordinary disappointment.",
    },
    howYouChange: {
      ko: "당신은 바로 화내기보다 상대에게 허용하던 자리를 다시 정합니다. 어제까지 가까웠던 사람이 어느 날부터 다시 멀리 있는 사람처럼 느껴질 수 있습니다.",
      en: "Rather than reacting immediately, you quietly change that person’s place inside. Someone who felt close yesterday may suddenly feel far away.",
    },
    sign: { ko: "“내가 너를 믿었기 때문에 더 아픈 거야.”", en: "“It hurts more because I trusted you.”" },
    gentleNote: {
      ko: "신뢰가 깨졌을 때 바로 모든 관계를 끝내지 않아도 됩니다. 하지만 다시 믿기 위해 필요한 조건이 무엇인지 스스로 분명히 하는 것이 중요합니다.",
      en: "You do not have to end everything immediately when trust breaks. But it matters to know what conditions you need before trusting again.",
    },
    friendComment: { ko: "너 마음 열기까지 오래 걸려서, 닫힐 때도 진짜 깊게 닫히는 편이야.", en: "It takes you time to open up, so when you close, you close deeply." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「배신당한 신뢰」가 나왔다. 이거 좀 맞는 듯.", en: "I got “Betrayed Trust” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#8d7896",
  },
  delayedRecognition: {
    id: "delayedRecognition",
    title: { ko: "계속 미뤄진 인정", en: "Delayed Recognition" },
    oneLiner: { ko: "노력은 쌓였는데 아무도 알아주지 않을 때 식어가는 사람", en: "You cool down when effort keeps piling up unseen." },
    description: {
      ko: "당신은 반드시 칭찬을 받아야 움직이는 사람은 아닙니다. 하지만 내가 오래 들인 노력과 변화가 계속 당연한 것으로 취급될 때, 마음속 동력이 조금씩 약해질 수 있습니다.",
      en: "You are not someone who needs praise for every step. But when long effort and quiet change are repeatedly treated as obvious, your inner drive can slowly weaken.",
    },
    howYouChange: {
      ko: "처음에는 더 잘하면 알아봐 주겠지 생각합니다. 하지만 인정이 계속 미뤄지면, 어느 순간 더 이상 증명하고 싶은 마음의 온도가 내려갈 수 있습니다.",
      en: "At first you think they may notice if you do better. But when recognition keeps being delayed, you may eventually stop wanting to prove anything.",
    },
    sign: { ko: "“내가 이만큼 해도 결국 당연한 거구나.”", en: "“Even after all this, it is just expected.”" },
    gentleNote: {
      ko: "인정받고 싶은 마음은 약함이 아닙니다. 다만 모든 기준을 타인의 반응에만 두면, 내가 이룬 변화까지 작게 느껴질 수 있습니다.",
      en: "Wanting recognition is not weakness. But if every standard depends on others’ reactions, even your real growth can start to feel small.",
    },
    friendComment: { ko: "너 인정 안 받으면 화내기보다 조용히 열정이 식는 타입이야.", en: "When you are not recognized, you do not always complain; your fire quietly cools." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「계속 미뤄진 인정」이 나왔다. 이거 좀 맞는 듯.", en: "I got “Delayed Recognition” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#d1b35f",
  },
  uncontrollableChaos: {
    id: "uncontrollableChaos",
    title: { ko: "통제할 수 없는 혼란", en: "Uncontrollable Chaos" },
    oneLiner: { ko: "예측할 수 없는 상황이 계속될 때 가장 빠르게 지치는 사람", en: "You tire fastest when unpredictability continues too long." },
    description: {
      ko: "당신은 질서와 흐름이 어느 정도 보일 때 힘을 잘 쓰는 사람입니다. 하지만 말이 계속 바뀌고, 기준이 흔들리고, 상황이 예측할 수 없이 흐르면 마음의 여유가 빠르게 줄어듭니다.",
      en: "You use your energy well when some structure and flow are visible. But when words keep changing, standards shake, and things remain unpredictable, your emotional room shrinks quickly.",
    },
    howYouChange: {
      ko: "처음에는 적응하려고 합니다. 하지만 혼란이 반복되면 당신은 감정보다 기준을 먼저 세우려 하고, 그 과정에서 허용 범위가 빠르게 좁아질 수 있습니다.",
      en: "At first you try to adapt. But if confusion repeats, you start building structure before dealing with feelings, and you may look firm or distant in the process.",
    },
    sign: { ko: "“기준이 뭐야? 뭘 맞추라는 거야?”", en: "“What is the standard? What am I supposed to match?”" },
    gentleNote: {
      ko: "혼란 속에서 구조를 찾는 능력은 큰 강점입니다. 다만 모든 상황을 완전히 통제하려고 하면 스스로가 먼저 지칠 수 있습니다.",
      en: "Finding structure inside confusion is a real strength. Just remember that trying to fully control every situation can exhaust you first.",
    },
    friendComment: { ko: "너 기준이 계속 바뀌면 표정부터 딱 굳어짐.", en: "When the standard keeps changing, your face gets still first." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「통제할 수 없는 혼란」이 나왔다. 이거 좀 맞는 듯.", en: "I got “Uncontrollable Chaos” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#6f8b8d",
  },
  abandonedFeeling: {
    id: "abandonedFeeling",
    title: { ko: "혼자 남겨진 감각", en: "The Feeling of Being Left Alone" },
    oneLiner: { ko: "사람들 사이에 있어도 혼자라고 느낄 때 조용히 닫히는 사람", en: "You close quietly when you feel alone, even among people." },
    description: {
      ko: "당신은 단순히 혼자 있는 것을 두려워하는 사람이 아닙니다. 문제는 함께 있는데도 아무도 내 마음을 보지 못한다고 느낄 때입니다. 그 감각이 반복되면 당신은 말보다 침묵을 선택하게 됩니다.",
      en: "You are not simply afraid of being alone. The harder part is feeling unseen even when you are with others. If that repeats, you begin choosing silence over more words.",
    },
    howYouChange: {
      ko: "처음에는 더 이해받으려고 노력합니다. 하지만 계속 혼자라고 느끼면 어느 순간 기대의 기준을 낮추고, 이 관계에서 내 마음을 어디까지 꺼낼지 다시 정하게 됩니다.",
      en: "At first you try harder to be understood. But if you keep feeling alone, you may lower your expectations and stop showing your heart.",
    },
    sign: { ko: "“같이 있는데 왜 혼자인 것 같지?”", en: "“Why do I feel alone when we are together?”" },
    gentleNote: {
      ko: "혼자라는 감각이 들 때, 모든 사람이 나를 외면한다고 단정하기보다 한 사람에게라도 조금 더 구체적으로 마음을 꺼내보는 것이 도움이 될 수 있습니다.",
      en: "When you feel alone, it can help to tell one person a little more specifically before deciding that nobody sees you.",
    },
    friendComment: { ko: "너 말 안 하는 날은 진짜 괜찮은 게 아니라 기대를 줄인 날 같아.", en: "When you go quiet, it does not always mean you are fine. It often means you lowered your expectations." },
    shareLine: { ko: "나는 “나를 차갑게 만드는 순간” 테스트에서 「혼자 남겨진 감각」이 나왔다. 이거 좀 맞는 듯.", en: "I got “Abandoned Feeling” on The Moment I Turn Cold. This feels pretty accurate." },
    accent: "#7b8ca6",
  },
};

export function calculateBreakingResult(choices: BreakingChoice[]): {
  result: BreakingResult;
  scores: Record<BreakingDimension, number>;
} {
  const scores: Record<BreakingDimension, number> = {
    repeatedDisrespect: 0,
    misunderstoodSincerity: 0,
    violatedBoundary: 0,
    overloadedResponsibility: 0,
    betrayedTrust: 0,
    delayedRecognition: 0,
    uncontrollableChaos: 0,
    abandonedFeeling: 0,
  };

  choices.forEach((choice, index) => {
    for (const [dimension, value] of Object.entries(choice.scores) as Array<[BreakingDimension, number]>) {
      scores[dimension] += (value ?? 0) * 10 + index;
    }
  });

  const winner = (Object.entries(scores) as Array<[BreakingDimension, number]>).sort(
    ([aKey, aValue], [bKey, bValue]) => bValue - aValue || aKey.localeCompare(bKey),
  )[0][0];

  return {
    result: BREAKING_RESULTS[winner],
    scores,
  };
}

export function getBreakingResultById(id: unknown): BreakingResult | null {
  if (typeof id !== "string") return null;
  return BREAKING_RESULTS[id as BreakingDimension] ?? null;
}
