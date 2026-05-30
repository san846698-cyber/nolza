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
      { id: "a", text: { ko: "이번엔 어렵다고 말해야겠다고 선을 딱 정한다", en: "I decide this is where I need to clearly say it is too much." }, scores: { violatedBoundary: 3 } },
      { id: "b", text: { ko: "거절처럼 들릴까 봐 내 일정과 사정을 길게 설명한다", en: "I explain my schedule and situation carefully so it does not sound like simple refusal." }, scores: { misunderstoodSincerity: 1, violatedBoundary: 1 } },
      { id: "c", text: { ko: "겉으론 알겠다고 하지만 다음부터 먼저 챙기지는 않는다", en: "I say okay on the outside, but stop being the first to take care of it." }, scores: { repeatedDisrespect: 2, abandonedFeeling: 1 } },
      { id: "d", text: { ko: "다들 급한가 보다 하고 또 내가 메우는 쪽으로 생각한다", en: "I assume everyone is pressed and start thinking I should fill the gap again." }, scores: { overloadedResponsibility: 1 } },
    ],
  },
  {
    id: "bp_02",
    prompt: {
      ko: "오래 준비한 일을 끝냈지만, 주변 사람들은 별다른 반응 없이 다음 일을 이야기합니다. 당신에게 가장 가까운 반응은?",
      en: "You finish something you prepared for a long time, but people move on to the next task with little reaction. What comes closest?",
    },
    choices: [
      { id: "a", text: { ko: "아무도 알아주지 않은 게 서운해서 힘이 확 빠진다", en: "I feel hurt that no one noticed, and my energy drops at once." }, scores: { delayedRecognition: 3 } },
      { id: "b", text: { ko: "감정은 미루고 바로 다음 일정과 할 일을 정리한다", en: "I delay the feeling and immediately organize the next schedule and tasks." }, scores: { overloadedResponsibility: 1, uncontrollableChaos: 1 } },
      { id: "c", text: { ko: "티는 안 내지만 다음엔 내 노력을 덜 보여주고 싶어진다", en: "I do not show it, but next time I want to reveal less of my effort." }, scores: { abandonedFeeling: 2, delayedRecognition: 1 } },
      { id: "d", text: { ko: "내가 인정받길 너무 바랐나 싶어 스스로 넘기려 한다", en: "I wonder if I wanted recognition too much and try to let it pass." }, scores: { repeatedDisrespect: 1 } },
    ],
  },
  {
    id: "bp_03",
    prompt: {
      ko: "가까운 사람이 당신의 말을 반복해서 가볍게 넘깁니다. 당신에게 가장 가까운 반응은?",
      en: "Someone close keeps brushing off what you say. What feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "처음엔 넘기지만 반복되면 ‘말해도 소용없네’ 싶어진다", en: "I let it pass at first, but after repeats I feel there is no point talking." }, scores: { repeatedDisrespect: 3 } },
      { id: "b", text: { ko: "이번 말은 그냥 넘기지 말아달라고 차분히 말한다", en: "I calmly say I do not want this one brushed off." }, scores: { violatedBoundary: 1, misunderstoodSincerity: 1 } },
      { id: "c", text: { ko: "내가 예민하게 받아들인 건지 맥락을 다시 따져본다", en: "I check the context again to see if I am taking it too sensitively." }, scores: { misunderstoodSincerity: 1 } },
      { id: "d", text: { ko: "웃으며 넘기고 내 얘기는 접은 채 상대가 편한 주제로 돌린다", en: "I smile it off, put my story away, and move to a topic they prefer." }, scores: { abandonedFeeling: 1 } },
    ],
  },
  {
    id: "bp_04",
    prompt: {
      ko: "진심으로 한 행동이 몇 번이나 다른 의도로 받아들여졌습니다. 이번에도 설명할 기회는 있지만 이미 지친 느낌입니다.",
      en: "Your sincere actions have been misread several times. You could explain again, but you already feel tired.",
    },
    choices: [
      { id: "a", text: { ko: "좋은 마음이 또 다르게 읽힌 게 억울하고 답답하다", en: "It feels unfair and frustrating that my good intent was misread again." }, scores: { misunderstoodSincerity: 3 } },
      { id: "b", text: { ko: "핵심만 설명하고 내 의도를 계속 증명하는 건 멈춘다", en: "I explain only the core point and stop repeatedly proving my intent." }, scores: { violatedBoundary: 1 } },
      { id: "c", text: { ko: "또 설명해야 한다는 생각에 정이 조금 식는 걸 느낀다", en: "The thought of explaining again makes my warmth drop a little." }, scores: { repeatedDisrespect: 1, misunderstoodSincerity: 2 } },
      { id: "d", text: { ko: "이번에도 내 마음을 나만 알고 있는 느낌이라 조용해진다", en: "It feels like I am the only one who knows my heart, so I go quiet." }, scores: { abandonedFeeling: 1 } },
    ],
  },
  {
    id: "bp_05",
    prompt: {
      ko: "팀에서 빈자리가 생기면 늘 당신이 메우게 됩니다. 아무도 강요하지 않았지만, 모두가 자연스럽게 기대하는 분위기입니다.",
      en: "Whenever there is a gap in the team, you end up filling it. Nobody forces you, but everyone seems to expect it naturally.",
    },
    choices: [
      { id: "a", text: { ko: "또 맡는 순간 ‘결국 나구나’ 싶어서 속이 무거워진다", en: "The moment I take it on again, I feel, “of course it is me,” and get heavy inside." }, scores: { overloadedResponsibility: 3 } },
      { id: "b", text: { ko: "이번에 내가 가능한 범위와 불가능한 범위를 먼저 말한다", en: "I state what I can and cannot take on this time." }, scores: { violatedBoundary: 2 } },
      { id: "c", text: { ko: "왜 빈자리는 늘 나부터 떠올리는지 서운함이 쌓인다", en: "It hurts that I am always the first person they think of for gaps." }, scores: { repeatedDisrespect: 2, overloadedResponsibility: 1 } },
      { id: "d", text: { ko: "일단 흐트러진 걸 수습하고, 감정은 나중으로 미룬다", en: "I first stabilize what is messy and push the feeling to later." }, scores: { uncontrollableChaos: 1, overloadedResponsibility: 1 } },
    ],
  },
  {
    id: "bp_06",
    prompt: {
      ko: "믿고 맡긴 이야기가 다른 사람에게까지 전해진 것 같습니다. 상대는 큰일 아니라고 말합니다.",
      en: "A story you trusted someone with seems to have reached another person. They say it was not a big deal.",
    },
    choices: [
      { id: "a", text: { ko: "믿었던 만큼 상처가 커서 그 사람에게 열 수 있는 범위가 줄어든다", en: "Because I trusted them, it hurts more, and the range I can open to them shrinks." }, scores: { betrayedTrust: 3 } },
      { id: "b", text: { ko: "감정부터 터뜨리기 전에 어디까지 전해졌는지 확인한다", en: "Before reacting emotionally, I check how far the story spread." }, scores: { uncontrollableChaos: 1, betrayedTrust: 1 } },
      { id: "c", text: { ko: "내가 중요하게 맡긴 걸 ‘별거 아닌 것’으로 본 게 서운하다", en: "It hurts that they treated something important to me as no big deal." }, scores: { repeatedDisrespect: 2, betrayedTrust: 1 } },
      { id: "d", text: { ko: "이후에는 개인적인 이야기는 여기까지라고 마음속 선을 긋는다", en: "After this, I draw an inner line around what personal stories I will share." }, scores: { violatedBoundary: 1, betrayedTrust: 2 } },
    ],
  },
  {
    id: "bp_07",
    prompt: {
      ko: "상황이 계속 바뀌고, 기준도 매번 다릅니다. 당신은 맞추려고 하지만 무엇에 맞춰야 할지 점점 흐려집니다.",
      en: "The situation keeps changing, and the standard shifts every time. You try to adapt, but it becomes unclear what you are adapting to.",
    },
    choices: [
      { id: "a", text: { ko: "기준이 정리되지 않으면 더 움직이기 어렵다고 분명히 말하고 싶다", en: "I want to clearly say I cannot keep moving unless the standard is set." }, scores: { uncontrollableChaos: 3 } },
      { id: "b", text: { ko: "확정된 것과 추측인 것을 나눠 적으며 머리를 정리한다", en: "I sort my head by writing what is confirmed and what is only a guess." }, scores: { uncontrollableChaos: 2 } },
      { id: "c", text: { ko: "계속 바뀌는 흐름을 맞추다 보니 내가 다 떠안는 느낌이 든다", en: "Trying to match constant changes makes me feel like I am carrying it all." }, scores: { overloadedResponsibility: 1, uncontrollableChaos: 2 } },
      { id: "d", text: { ko: "나만 혼란스러운 게 아닐 거라며 조금 더 지켜본다", en: "I tell myself I am probably not the only confused one and watch a little longer." }, scores: { abandonedFeeling: 1 } },
    ],
  },
  {
    id: "bp_08",
    prompt: {
      ko: "사람들 사이에 있지만, 정작 내 마음을 묻는 사람은 없습니다. 대화는 이어지는데 이상하게 혼자 남은 느낌입니다.",
      en: "You are among people, but nobody asks what is going on inside you. The conversation continues, yet you feel strangely alone.",
    },
    choices: [
      { id: "a", text: { ko: "마음이 바로 쓸쓸해져서 말을 줄이고 기대도 접는다", en: "I immediately feel lonely, speak less, and drop the expectation." }, scores: { abandonedFeeling: 3 } },
      { id: "b", text: { ko: "한 사람에게라도 ‘나 사실 좀 힘들어’라고 말해볼까 고민한다", en: "I consider telling at least one person, “I am actually having a hard time.”" }, scores: { misunderstoodSincerity: 1, abandonedFeeling: 1 } },
      { id: "c", text: { ko: "웃고 맞장구치지만 내 이야기는 마음속으로 다시 넣는다", en: "I smile and react, but put my own story back inside." }, scores: { abandonedFeeling: 2 } },
      { id: "d", text: { ko: "내가 충분히 티를 안 냈으니 아무도 몰랐을 수 있다고 생각한다", en: "I think maybe no one knew because I did not show it clearly enough." }, scores: { misunderstoodSincerity: 1 } },
    ],
  },
  {
    id: "bp_09",
    prompt: {
      ko: "상대가 약속을 자주 바꿉니다. 사정은 늘 이해가 되지만, 당신의 일정은 계속 뒤로 밀립니다.",
      en: "Someone often changes plans. Their reasons always make sense, but your own schedule keeps getting pushed back.",
    },
    choices: [
      { id: "a", text: { ko: "이해는 되지만 내 시간은 계속 뒤로 밀려도 되는 건가 싶다", en: "I understand, but I wonder if my time is always allowed to be pushed back." }, scores: { repeatedDisrespect: 2, violatedBoundary: 2 } },
      { id: "b", text: { ko: "다음엔 가능한 시간과 안 되는 시간을 처음부터 분명히 말한다", en: "Next time, I state available and unavailable times clearly from the start." }, scores: { violatedBoundary: 3 } },
      { id: "c", text: { ko: "겉으론 맞춰주지만 그 사람과의 약속에는 마음을 덜 둔다", en: "I adjust on the outside, but invest less in plans with them." }, scores: { betrayedTrust: 1, abandonedFeeling: 1 } },
      { id: "d", text: { ko: "사정이 많겠지 하고 또 한 번 상대 입장을 설명해준다", en: "I explain it again from their side, thinking they must have a lot going on." }, scores: { misunderstoodSincerity: 1 } },
    ],
  },
  {
    id: "bp_10",
    prompt: {
      ko: "당신이 계속 챙겨온 일이 잘 굴러가자, 사람들은 그것이 원래 쉬운 일처럼 말합니다.",
      en: "Something you have been carefully maintaining starts running well, and people talk as if it was easy all along.",
    },
    choices: [
      { id: "a", text: { ko: "내가 들인 시간과 버틴 과정이 통째로 지워진 것 같아 서운하다", en: "It hurts because the time and effort I carried feel erased." }, scores: { delayedRecognition: 3 } },
      { id: "b", text: { ko: "알아주지 않아도 결과는 남았다고 스스로 의미를 붙인다", en: "I give it meaning myself: even if no one sees it, the result remains." }, scores: { delayedRecognition: 1 } },
      { id: "c", text: { ko: "다음엔 내가 한 일을 보이게 기록해둬야겠다고 생각한다", en: "I think I should make a clearer record of what I did next time." }, scores: { uncontrollableChaos: 1, delayedRecognition: 1 } },
      { id: "d", text: { ko: "앞으로는 아무 말 없이 더 해주는 역할을 그만두고 싶어진다", en: "I no longer want to keep silently doing more." }, scores: { repeatedDisrespect: 2, violatedBoundary: 1 } },
    ],
  },
  {
    id: "bp_11",
    prompt: {
      ko: "힘든 이야기를 꺼낼 때마다 상대는 곧 자기 이야기로 넘어갑니다. 악의는 없어 보이지만, 이번에는 말문이 막힙니다.",
      en: "Whenever you bring up something hard, they soon turn it into their own story. It does not seem intentional, but this time something in you stops.",
    },
    choices: [
      { id: "a", text: { ko: "내 얘기는 여기서 닿지 않겠다고 느껴 말문이 닫힌다", en: "I feel my story will not land here, so my words shut down." }, scores: { abandonedFeeling: 3 } },
      { id: "b", text: { ko: "이번엔 ‘내 얘기 조금만 더 들어줘’라고 짧게 말해본다", en: "This time I briefly try saying, “please hear my story a little longer.”" }, scores: { misunderstoodSincerity: 2 } },
      { id: "c", text: { ko: "상대도 자기 일이 많이 벅찼을 수 있다고 이해하려 한다", en: "I try to understand that their own situation may have been overwhelming too." }, scores: { abandonedFeeling: 1 } },
      { id: "d", text: { ko: "또 내 차례가 사라졌구나 싶어 웃고 듣기만 한다", en: "I feel my turn disappeared again, so I smile and only listen." }, scores: { repeatedDisrespect: 1, abandonedFeeling: 2 } },
    ],
  },
  {
    id: "bp_12",
    prompt: {
      ko: "중요한 순간에 기대했던 사람이 당신 편에 서지 않았습니다. 이유는 들었지만 쉽게 괜찮아지지 않습니다.",
      en: "At an important moment, someone you expected to stand with you did not. You heard their reason, but your heart does not return easily.",
    },
    choices: [
      { id: "a", text: { ko: "다음 중요한 순간엔 그 사람을 믿고 기대하지 않게 된다", en: "For the next important moment, I stop relying on them." }, scores: { betrayedTrust: 3 } },
      { id: "b", text: { ko: "내가 그 순간 무엇을 기대했는지 먼저 말로 정리한다", en: "I first put into words exactly what I expected in that moment." }, scores: { betrayedTrust: 1, misunderstoodSincerity: 1 } },
      { id: "c", text: { ko: "이유는 이해해도 그때 혼자 남겨진 느낌이 계속 아프다", en: "I understand the reason, but the feeling of being left alone still hurts." }, scores: { betrayedTrust: 2, abandonedFeeling: 1 } },
      { id: "d", text: { ko: "한 번으로 결론 내리지 않으려고 다음 행동까지 지켜본다", en: "I watch their next actions so I do not conclude from one moment." }, scores: { betrayedTrust: 1 } },
    ],
  },
  {
    id: "bp_13",
    prompt: {
      ko: "함께 정해야 할 일이 자꾸 미뤄지고, 그때마다 당신만 기다리는 상황이 반복됩니다.",
      en: "A decision you need to make together keeps getting delayed, and you are repeatedly the one left waiting.",
    },
    choices: [
      { id: "a", text: { ko: "내 시간을 계속 붙잡아두는 느낌이라 마음이 차갑게 식는다", en: "My warmth cools because it feels like my time keeps being held hostage." }, scores: { violatedBoundary: 3 } },
      { id: "b", text: { ko: "언제까지 결정할지 마감선을 먼저 정하자고 말한다", en: "I say we should first set a deadline for the decision." }, scores: { violatedBoundary: 1, uncontrollableChaos: 1 } },
      { id: "c", text: { ko: "내가 기다리는 건 당연한 일처럼 여겨지는 게 서운하다", en: "It hurts that my waiting seems to be treated as something expected." }, scores: { repeatedDisrespect: 2 } },
      { id: "d", text: { ko: "결국 이번에도 내가 정리해야 할 것 같아 지친다", en: "I get tired because it feels like I will have to organize it again." }, scores: { overloadedResponsibility: 1, violatedBoundary: 1 } },
    ],
  },
  {
    id: "bp_14",
    prompt: {
      ko: "여러 사람이 각자 다른 말을 하며 결정을 미룹니다. 결국 정리하는 사람은 또 당신이 될 것 같습니다.",
      en: "Several people keep saying different things and delaying a decision. It looks like you will end up organizing it again.",
    },
    choices: [
      { id: "a", text: { ko: "또 내가 떠안을 것 같아 시작도 전에 피곤해진다", en: "I feel tired before it starts because I think I will carry it again." }, scores: { overloadedResponsibility: 3 } },
      { id: "b", text: { ko: "우선 결정 기준을 한 문장으로 합의하자고 제안한다", en: "I suggest first agreeing on the decision standard in one sentence." }, scores: { uncontrollableChaos: 2 } },
      { id: "c", text: { ko: "흐름이 정리되지 않고 늘어지는 게 제일 견디기 어렵다", en: "The hardest part is the messy flow dragging on without structure." }, scores: { uncontrollableChaos: 3 } },
      { id: "d", text: { ko: "내가 전부 하지 않도록 역할부터 나누고 선을 잡는다", en: "I divide roles first and set a line so I do not do everything." }, scores: { violatedBoundary: 1, overloadedResponsibility: 2 } },
    ],
  },
  {
    id: "bp_15",
    prompt: {
      ko: "당신의 성장을 오래 지켜본 사람이, 여전히 예전의 당신처럼 대합니다. 웃어넘길 수 있지만 마음에 걸립니다.",
      en: "Someone who has seen your growth for a long time still treats you like your old self. You could laugh it off, but it bothers you.",
    },
    choices: [
      { id: "a", text: { ko: "열심히 달라졌는데 아직도 예전 나로만 보는 게 상처다", en: "It hurts that they still see the old me after I have worked to change." }, scores: { delayedRecognition: 3 } },
      { id: "b", text: { ko: "내가 달라진 부분을 감정적이지 않게 한번 말해보고 싶다", en: "I want to calmly name what has changed in me without sounding emotional." }, scores: { misunderstoodSincerity: 1, delayedRecognition: 1 } },
      { id: "c", text: { ko: "그 사람 앞에서는 더 보여줘도 소용없을 것 같아 닫힌다", en: "I close off because it feels pointless to show more of myself around them." }, scores: { repeatedDisrespect: 1, delayedRecognition: 2 } },
      { id: "d", text: { ko: "익숙한 이미지가 남아 있어서 그런 거라고 스스로 넘겨본다", en: "I try to let it pass by telling myself they are seeing an old familiar image." }, scores: { delayedRecognition: 1 } },
    ],
  },
  {
    id: "bp_16",
    prompt: {
      ko: "오랫동안 괜찮다고 말해왔지만, 어느 날 같은 장면이 반복되자 더는 예전처럼 반응하고 싶지 않습니다. 당신에게 가까운 쪽은?",
      en: "You have said you were fine for a long time, but one day the same scene repeats and you no longer want to respond the old way. What feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "아무 말 없이 마음속 거리를 벌리고 허용 범위를 줄인다", en: "Without saying much, I widen the inner distance and shrink what I allow." }, scores: { repeatedDisrespect: 1, betrayedTrust: 1, abandonedFeeling: 1 } },
      { id: "b", text: { ko: "이번에는 내가 지킬 선을 구체적으로 말하고 멈춰 세운다", en: "This time, I clearly name the line I need to protect and stop it there." }, scores: { violatedBoundary: 2, misunderstoodSincerity: 1 } },
      { id: "c", text: { ko: "계속 내 어깨에 올라온 책임을 더는 당연하게 받지 않는다", en: "I stop accepting the responsibility that kept landing on my shoulders as normal." }, scores: { overloadedResponsibility: 2, delayedRecognition: 1 } },
      { id: "d", text: { ko: "어떤 장면이 몇 번 반복됐는지 적어보고 감정을 정리한다", en: "I write down which scenes repeated and how often, then sort my feelings." }, scores: { uncontrollableChaos: 1, betrayedTrust: 1 } },
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
