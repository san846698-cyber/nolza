export type LocalizedText = {
  ko: string;
  en: string;
};

export type PoliticalResultId =
  | "strong-progressive"
  | "moderate-progressive"
  | "practical-progressive"
  | "centrist-pragmatist"
  | "practical-conservative"
  | "moderate-conservative"
  | "strong-conservative";

export type PoliticalDimension =
  | "freedomOrder"
  | "welfareMarket"
  | "changeStability"
  | "individualSocial";

export type PoliticalStatementDirection = "progressive" | "conservative" | "centrist";

export type PoliticalAgreementValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PoliticalAgreementOption = {
  value: PoliticalAgreementValue;
  label: LocalizedText;
};

export type PoliticalQuestion = {
  id: string;
  theme: string;
  statement: LocalizedText;
  direction: PoliticalStatementDirection;
  dimension: PoliticalDimension;
  weight?: number;
  orderFreedomWeight?: number;
};

export type PoliticalAnswer = {
  questionId: string;
  agreement: PoliticalAgreementValue;
  score: number;
  orderFreedomScore: number;
  dimensions: Partial<Record<PoliticalDimension, number>>;
};

export type PoliticalResult = {
  id: PoliticalResultId;
  title: LocalizedText;
  englishLabel: string;
  spectrumPosition: LocalizedText;
  min: number;
  max: number;
  summary: LocalizedText;
  description: LocalizedText[];
  basis: LocalizedText;
  strength: LocalizedText;
  caution: LocalizedText;
  friendLine: LocalizedText;
  conversationStyle: LocalizedText;
  finalLine: LocalizedText;
  accent: string;
};

export type PoliticalAxisInterpretation = {
  label: LocalizedText;
  detail: LocalizedText;
};

export const POLITICAL_TEST_COPY = {
  title: { ko: "정치성향 테스트", en: "Political Orientation Test" },
  subtitle: {
    ko: "나는 사회를 어떤 기준으로 판단할까?",
    en: "What standards do you use to judge society?",
  },
  description: {
    ko: "정당 지지나 투표 성향이 아니라 자유, 질서, 공정, 복지, 책임, 변화처럼 사회를 바라보는 가치 기준을 문장 동의 방식으로 살펴봅니다.",
    en: "This test does not measure party support or voting intent. It reads how strongly you agree with social values like freedom, order, fairness, welfare, responsibility, and change.",
  },
  disclaimer: {
    ko: "이 테스트는 정당 지지나 투표 성향을 측정하지 않으며, 사회 이슈를 바라보는 가치관을 가볍게 읽어보는 콘텐츠입니다.",
    en: "This test does not measure party support or voting intent. It is a light self-reflection tool about how you view social issues.",
  },
  start: { ko: "테스트 시작하기", en: "Start the test" },
  resultLabel: { ko: "나의 정치성향", en: "Your orientation" },
  share: { ko: "결과 공유하기", en: "Share result" },
  copied: { ko: "링크 복사됨", en: "Link copied" },
  retry: { ko: "다시 해보기", en: "Retake" },
  questionCount: { ko: "24문항", en: "24 statements" },
  time: { ko: "약 5분", en: "About 5 min" },
  valueBased: { ko: "동의 척도", en: "Agreement scale" },
} satisfies Record<string, LocalizedText>;

export const POLITICAL_AGREEMENT_OPTIONS: PoliticalAgreementOption[] = [
  { value: 1, label: { ko: "매우 그렇다", en: "Strongly agree" } },
  { value: 2, label: { ko: "그렇다", en: "Agree" } },
  { value: 3, label: { ko: "약간 그렇다", en: "Slightly agree" } },
  { value: 4, label: { ko: "중립", en: "Neutral" } },
  { value: 5, label: { ko: "약간 그렇지 않다", en: "Slightly disagree" } },
  { value: 6, label: { ko: "그렇지 않다", en: "Disagree" } },
  { value: 7, label: { ko: "매우 그렇지 않다", en: "Strongly disagree" } },
] satisfies PoliticalAgreementOption[];

export const POLITICAL_SPECTRUM_LABELS = [
  { ko: "강한 진보", en: "Far left" },
  { ko: "진보", en: "Progressive" },
  { ko: "중도", en: "Center" },
  { ko: "보수", en: "Conservative" },
  { ko: "강한 보수", en: "Far right" },
] satisfies LocalizedText[];

export const POLITICAL_QUESTIONS: PoliticalQuestion[] = [
  {
    id: "pt_01",
    theme: "tax/welfare tradeoff",
    statement: {
      ko: "세금이 조금 늘어나더라도 사회적 약자를 보호하는 제도는 강화되어야 한다.",
      en: "Even if taxes rise a little, systems that protect vulnerable people should be strengthened.",
    },
    direction: "progressive",
    dimension: "welfareMarket",
  },
  {
    id: "pt_02",
    theme: "freedom vs order",
    statement: {
      ko: "사회가 빠르게 변할수록 기본 질서와 규칙은 더 중요해진다.",
      en: "The faster society changes, the more important basic order and rules become.",
    },
    direction: "conservative",
    dimension: "freedomOrder",
    orderFreedomWeight: 1,
  },
  {
    id: "pt_03",
    theme: "tradition vs diversity",
    statement: {
      ko: "전통적 가치도 중요하지만, 다양한 삶의 방식을 제도적으로 인정해야 한다.",
      en: "Traditional values matter, but diverse ways of living should be institutionally recognized.",
    },
    direction: "progressive",
    dimension: "changeStability",
    orderFreedomWeight: -1,
  },
  {
    id: "pt_04",
    theme: "welfare vs market",
    statement: {
      ko: "국가는 시장에 너무 많이 개입하기보다 개인과 기업의 선택을 존중해야 한다.",
      en: "The state should respect the choices of individuals and businesses rather than intervening too much in markets.",
    },
    direction: "conservative",
    dimension: "welfareMarket",
    orderFreedomWeight: -1,
  },
  {
    id: "pt_05",
    theme: "equality vs competition",
    statement: {
      ko: "경쟁의 결과가 모두 같을 필요는 없지만, 출발선은 최대한 공정해야 한다.",
      en: "Competitive outcomes do not all need to be equal, but the starting line should be as fair as possible.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_06",
    theme: "change vs stability",
    statement: {
      ko: "사회적 갈등이 커질 때는 변화보다 안정이 먼저 필요할 때가 있다.",
      en: "When social conflict grows, stability sometimes needs to come before change.",
    },
    direction: "conservative",
    dimension: "changeStability",
    orderFreedomWeight: 1,
  },
  {
    id: "pt_07",
    theme: "education/opportunity",
    statement: {
      ko: "교육과 기회는 가정 형편이나 지역에 따라 크게 달라지지 않도록 공공이 더 책임져야 한다.",
      en: "Public systems should take more responsibility so education and opportunity do not vary greatly by family income or region.",
    },
    direction: "progressive",
    dimension: "individualSocial",
    orderFreedomWeight: 0.5,
  },
  {
    id: "pt_08",
    theme: "security vs civil liberties",
    statement: {
      ko: "범죄 예방을 위해서라면 일부 자유가 제한되는 것도 받아들일 수 있다.",
      en: "For crime prevention, some limits on freedom can be acceptable.",
    },
    direction: "conservative",
    dimension: "freedomOrder",
    orderFreedomWeight: 1,
  },
  {
    id: "pt_09",
    theme: "government intervention vs personal choice",
    statement: {
      ko: "주거, 의료, 교육처럼 삶의 기본 조건은 정부가 최소 기준을 보장해야 한다.",
      en: "For basics like housing, healthcare, and education, government should guarantee minimum standards.",
    },
    direction: "progressive",
    dimension: "welfareMarket",
    orderFreedomWeight: 0.5,
  },
  {
    id: "pt_10",
    theme: "individual responsibility vs social responsibility",
    statement: {
      ko: "개인의 선택 결과는 사회보다 본인이 더 크게 책임져야 한다.",
      en: "People should be more responsible than society for the results of their own choices.",
    },
    direction: "conservative",
    dimension: "individualSocial",
    orderFreedomWeight: -0.5,
  },
  {
    id: "pt_11",
    theme: "labor/business balance",
    statement: {
      ko: "기업의 자율성도 중요하지만 노동자가 협상력을 잃지 않도록 제도적 보호가 필요하다.",
      en: "Business autonomy matters, but institutional protection is needed so workers do not lose bargaining power.",
    },
    direction: "progressive",
    dimension: "welfareMarket",
    orderFreedomWeight: 0.5,
  },
  {
    id: "pt_12",
    theme: "culture/social norms",
    statement: {
      ko: "오래 유지된 사회 규범은 함부로 바꾸기보다 먼저 그 이유와 역할을 존중해야 한다.",
      en: "Long-standing social norms should be respected for their reasons and roles before being changed.",
    },
    direction: "conservative",
    dimension: "changeStability",
    orderFreedomWeight: 1,
  },
  {
    id: "pt_13",
    theme: "security vs civil liberties",
    statement: {
      ko: "표현의 자유는 불편한 의견까지 포함할 때 의미가 있다.",
      en: "Freedom of expression matters most when it includes uncomfortable opinions.",
    },
    direction: "progressive",
    dimension: "freedomOrder",
    orderFreedomWeight: -1,
  },
  {
    id: "pt_14",
    theme: "welfare vs market",
    statement: {
      ko: "복지는 필요하지만 오래 의존하게 만들지 않도록 자립과 책임을 함께 요구해야 한다.",
      en: "Welfare is necessary, but it should require self-reliance and responsibility so it does not create long-term dependence.",
    },
    direction: "conservative",
    dimension: "individualSocial",
    orderFreedomWeight: 0.5,
  },
  {
    id: "pt_15",
    theme: "fairness of outcome",
    statement: {
      ko: "기회가 공정해 보여도 결과의 격차가 반복된다면 제도 자체를 다시 점검해야 한다.",
      en: "Even if opportunities look fair, repeated outcome gaps mean the system itself should be re-examined.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_16",
    theme: "fairness of opportunity",
    statement: {
      ko: "공정함은 같은 규칙을 모두에게 적용하는 데서 나오며, 결과 차이 때문에 기준을 자주 바꾸면 안 된다.",
      en: "Fairness comes from applying the same rules to everyone, and standards should not change often because outcomes differ.",
    },
    direction: "conservative",
    dimension: "individualSocial",
    orderFreedomWeight: 0.5,
  },
  {
    id: "pt_17",
    theme: "public safety vs personal freedom",
    statement: {
      ko: "공공 안전 정책은 사생활과 시민권 침해 위험까지 엄격하게 따져야 한다.",
      en: "Public safety policies should be judged strictly for risks to privacy and civil rights.",
    },
    direction: "progressive",
    dimension: "freedomOrder",
    orderFreedomWeight: -1,
  },
  {
    id: "pt_18",
    theme: "competition vs equality",
    statement: {
      ko: "경쟁은 사회를 발전시키는 중요한 힘이므로 지나친 평등 요구로 약해져서는 안 된다.",
      en: "Competition is an important force for social progress and should not be weakened by excessive demands for equality.",
    },
    direction: "conservative",
    dimension: "welfareMarket",
    orderFreedomWeight: -0.5,
  },
  {
    id: "pt_19",
    theme: "social responsibility",
    statement: {
      ko: "실패를 개인 탓으로만 돌리면 교육, 고용, 지역 격차 같은 구조적 원인을 놓치기 쉽다.",
      en: "If failure is blamed only on individuals, structural causes like education, employment, and regional gaps are easily missed.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_20",
    theme: "personal choice",
    statement: {
      ko: "국가가 생활 방식이나 소비 선택을 지나치게 관리하면 개인의 자유가 약해진다.",
      en: "When the state manages lifestyles or consumption choices too much, individual freedom weakens.",
    },
    direction: "conservative",
    dimension: "freedomOrder",
    orderFreedomWeight: -1,
  },
  {
    id: "pt_21",
    theme: "change vs stability",
    statement: {
      ko: "낡은 제도는 갈등이 있더라도 과감하게 바꾸어야 사회가 앞으로 나아갈 수 있다.",
      en: "Outdated institutions sometimes need bold change, even with conflict, for society to move forward.",
    },
    direction: "progressive",
    dimension: "changeStability",
    orderFreedomWeight: -0.5,
  },
  {
    id: "pt_22",
    theme: "tax/market tradeoff",
    statement: {
      ko: "세금을 낮추고 민간의 선택 폭을 넓히는 편이 장기적으로 더 건강한 사회를 만든다.",
      en: "Lower taxes and broader private choice create a healthier society in the long run.",
    },
    direction: "conservative",
    dimension: "welfareMarket",
    orderFreedomWeight: -1,
  },
  {
    id: "pt_23",
    theme: "diversity/social norms",
    statement: {
      ko: "사회 제도는 평균적인 삶뿐 아니라 소수자의 삶도 실제로 보호할 수 있어야 한다.",
      en: "Social institutions should be able to protect minority lives in practice, not only the average way of living.",
    },
    direction: "progressive",
    dimension: "changeStability",
    orderFreedomWeight: -0.5,
  },
  {
    id: "pt_24",
    theme: "pragmatism vs principle",
    statement: {
      ko: "정책은 좋은 의도보다 검증된 절차, 예산 책임, 장기적 안정성이 더 중요하다.",
      en: "In policy, tested procedure, budget responsibility, and long-term stability matter more than good intentions.",
    },
    direction: "conservative",
    dimension: "changeStability",
    orderFreedomWeight: 1,
  },
];

export const POLITICAL_RESULTS: PoliticalResult[] = [
  {
    id: "strong-progressive",
    title: { ko: "강한 진보형", en: "Strong Progressive" },
    englishLabel: "Strong Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 강한 진보", en: "Spectrum position: far-left / progressive" },
    min: -100,
    max: -63,
    summary: {
      ko: "당신은 질서보다 누가 밀려났는지를 먼저 봅니다.",
      en: "You notice who got pushed out before you defend the order.",
    },
    description: [
      {
        ko: "당신은 문제를 “개인이 더 노력하면 된다”로 끝내는 말을 잘 믿지 않습니다. 먼저 봅니다. 누가 처음부터 불리했는지. 어떤 규칙이 누구에게만 더 무거운지.",
        en: "You do not easily accept “people should just try harder” as an answer. You first look at who started behind and which rules weigh more heavily on some people.",
      },
      {
        ko: "반복되는 불평등 앞에서 “조금 더 기다리자”는 말은 당신에게 약하게 들립니다. 안정이 모두에게 같은 안정은 아니라고 보기 때문입니다. 누군가에게 안정은 편안함이고, 누군가에게는 계속 참으라는 말입니다.",
        en: "When inequality keeps repeating, “let’s wait longer” sounds weak to you. Stability is not the same for everyone. For some it is comfort; for others it is being told to endure.",
      },
    ],
    basis: {
      ko: "당신은 정치 이슈를 볼 때 “누가 계속 밖에 남는가?”를 먼저 묻습니다. “그건 개인이 알아서 할 문제다”라는 말을 특히 싫어합니다.",
      en: "When you see a political issue, you first ask, “Who is still left outside?” You especially dislike “That is just an individual problem.”",
    },
    strength: {
      ko: "남들이 지나치는 피해를 빨리 봅니다. 익숙한 규칙도 그냥 넘기지 않습니다. “그 익숙함 때문에 손해 본 사람은 없나?”를 묻습니다.",
      en: "You notice harm that others pass over. You do not accept familiar rules automatically. You ask who paid for that familiarity.",
    },
    caution: {
      ko: "변화가 필요한 건 잘 봅니다. 하지만 그 변화의 비용을 누가 감당하는지는 늦게 볼 수 있습니다. 따라오지 못하는 사람을 너무 빨리 무심한 사람으로 볼 때도 있습니다.",
      en: "You see when change is needed. But you can notice late who has to absorb the cost. Sometimes you judge people who cannot keep up as indifferent too quickly.",
    },
    friendLine: {
      ko: "너는 “현실적으로 어렵다” 들으면 바로 “그 현실은 누구한테만 어려운데?” 묻는 타입.",
      en: "When you hear “that is unrealistic,” you ask, “Unrealistic for whom?”",
    },
    conversationStyle: {
      ko: "실제 피해 사례와 분명한 원칙에 설득됩니다. 예산과 실행 순서까지 같이 있으면 더 강하게 반응합니다.",
      en: "You are persuaded by real harm and clear principles. You respond even more when budget and execution order are included.",
    },
    finalLine: {
      ko: "당신에게 정치란, 참으라는 말 뒤에 누가 오래 갇혀 있었는지 묻는 일입니다.",
      en: "For you, politics asks who has been trapped behind “be patient.”",
    },
    accent: "#0f766e",
  },
  {
    id: "moderate-progressive",
    title: { ko: "온건 진보형", en: "Moderate Progressive" },
    englishLabel: "Moderate Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 중도 진보", en: "Spectrum position: center-left" },
    min: -62,
    max: -33,
    summary: {
      ko: "당신은 바꾸되, 오래 버틸 방식으로 바꾸고 싶어합니다.",
      en: "You want change, but you want it built to last.",
    },
    description: [
      {
        ko: "당신은 사회가 개인에게만 책임을 넘기면 안 된다고 봅니다. 복지, 교육, 노동, 다양성 문제에서 제도 보완이 필요하다고 느낍니다.",
        en: "You do not think society should leave everything to individuals. On welfare, education, labor, and diversity, you see the need for better systems.",
      },
      {
        ko: "하지만 구호만으로는 부족합니다. 누가 비용을 내는지, 누가 운영하는지, 오래 유지될 수 있는지까지 봐야 마음이 놓입니다.",
        en: "But slogans are not enough for you. You need to know who pays, who runs it, and whether it can last.",
      },
    ],
    basis: {
      ko: "당신은 “좋은 방향인 건 알겠는데, 계속 굴러갈 수 있나?”를 먼저 묻습니다. “일단 바꾸고 보자”는 말을 싫어합니다.",
      en: "You first ask, “I get the direction, but can it keep working?” You dislike “Let’s just change it first.”",
    },
    strength: {
      ko: "뜨거운 문제를 실행 계획으로 바꿀 줄 압니다. “불공정하다”에서 멈추지 않고, 어떤 기준이 있어야 덜 흔들리는지 봅니다.",
      en: "You can turn a heated problem into an execution plan. You do not stop at “this is unfair”; you look for standards that keep the fix stable.",
    },
    caution: {
      ko: "현실성을 챙기다 보면 절박한 사람에게는 너무 느려 보일 수 있습니다. 말은 진보적인데 결론은 조심스러워서 애매하게 보일 때가 있습니다.",
      en: "Because you care about feasibility, urgent people may see you as too slow. Your words can sound progressive while your conclusion feels cautious.",
    },
    friendLine: {
      ko: "너는 바꾸자는 편인데 꼭 “그래서 운영은 누가 해?” 묻는 사람임.",
      en: "You want change, but you always ask, “So who runs it?”",
    },
    conversationStyle: {
      ko: "피해 사례와 실행 계획이 같이 있을 때 설득됩니다. 원칙은 좋지만, 현실의 마찰을 숨기면 믿지 않습니다.",
      en: "You are persuaded when harm examples come with an execution plan. You like principles, but you do not trust people who hide friction.",
    },
    finalLine: {
      ko: "당신에게 정치란, 좋은 방향을 실제로 지속 가능한 제도로 바꾸는 일입니다.",
      en: "For you, politics turns a good direction into a system that can actually last.",
    },
    accent: "#168a7d",
  },
  {
    id: "practical-progressive",
    title: { ko: "실용 진보형", en: "Practical Progressive" },
    englishLabel: "Practical Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 진보 성향 실용", en: "Spectrum position: left-leaning pragmatic" },
    min: -32,
    max: -7,
    summary: {
      ko: "당신은 착한 말보다 실제로 바뀌는 구조를 봅니다.",
      en: "You care less about kind words and more about what actually changes.",
    },
    description: [
      {
        ko: "당신은 사회가 더 공정해져야 한다는 쪽에 가깝습니다. 교육, 노동, 지역, 안전망이 사람의 선택지를 좁힌다는 점을 잘 봅니다.",
        en: "You lean toward making society fairer. You notice how education, labor, region, and safety nets limit people’s choices.",
      },
      {
        ko: "다만 좋은 말만으로는 움직이지 않습니다. 작게라도 실제 피해를 줄이면 의미가 있고, 큰 개혁이라도 작동하지 않으면 고쳐야 한다고 봅니다.",
        en: "But good words alone do not move you. A small fix matters if it reduces real harm, and a big reform needs repair if it does not work.",
      },
    ],
    basis: {
      ko: "당신은 “이게 실제로 누구 삶을 바꾸는데?”를 먼저 묻습니다. “좋은 의도니까 괜찮다”는 말을 싫어합니다.",
      en: "You first ask, “Whose life does this actually change?” You dislike “It is fine because the intention is good.”",
    },
    strength: {
      ko: "논쟁이 뜨거워져도 “그래서 다음 조치는 뭐야?”라고 묻습니다. 방향은 잃지 않지만, 결과가 나쁘면 고칠 줄 압니다.",
      en: "Even when debate gets hot, you ask, “So what is next?” You keep your direction, but you can fix the plan when results are bad.",
    },
    caution: {
      ko: "현실적 타협을 하다 보면 양쪽 모두에게 애매하다는 말을 들을 수 있습니다. 효과만 말하다가 왜 그 변화가 필요한지 설명이 약해질 때가 있습니다.",
      en: "Practical compromise can make both sides call you unclear. When you talk only about effects, you may under-explain why the change matters.",
    },
    friendLine: {
      ko: "너는 진보인데 “그래서 현장에서 먹히냐?”를 꼭 묻는 타입.",
      en: "You lean progressive, but you always ask, “Does it work on the ground?”",
    },
    conversationStyle: {
      ko: "사례, 숫자, 시범 결과에 설득됩니다. 실패했을 때 어떻게 고칠지 말하는 사람을 더 믿습니다.",
      en: "Examples, numbers, and pilot results persuade you. You trust people who can say how they will fix failure.",
    },
    finalLine: {
      ko: "당신에게 정치란, 좋은 의도가 실제로 좋은 결과가 되는지 끝까지 확인하는 일입니다.",
      en: "For you, politics checks whether good intentions become good outcomes.",
    },
    accent: "#2f7d73",
  },
  {
    id: "centrist-pragmatist",
    title: { ko: "중도 실용형", en: "Centrist Pragmatist" },
    englishLabel: "Centrist Pragmatist",
    spectrumPosition: { ko: "스펙트럼 위치: 중도", en: "Spectrum position: center" },
    min: -6,
    max: 6,
    summary: {
      ko: "당신은 편보다 조건을 먼저 따집니다.",
      en: "You check the conditions before choosing a side.",
    },
    description: [
      {
        ko: "당신은 어떤 이슈에서는 변화가 필요하다고 봅니다. 다른 이슈에서는 속도가 너무 빠르다고 느낍니다. 그래서 편부터 고르지 않습니다.",
        en: "On some issues, you think change is needed. On others, the pace feels too fast. So you do not pick a side first.",
      },
      {
        ko: "당신에게 중도는 아무 생각이 없다는 뜻이 아닙니다. 사안마다 기준을 다시 세우겠다는 뜻입니다. 그래서 대화가 길어집니다. 대신 허술한 결론을 잘 걸러냅니다.",
        en: "For you, the center does not mean having no view. It means setting the standard again for each issue. That makes conversations longer, but it filters weak conclusions.",
      },
    ],
    basis: {
      ko: "당신은 “이 경우엔 어떤 기준이 맞는데?”를 먼저 묻습니다. “둘 중 하나만 골라”라는 말을 싫어합니다.",
      en: "You first ask, “Which standard fits this case?” You dislike “Just pick one side.”",
    },
    strength: {
      ko: "양쪽이 싸울 때 쟁점을 분해합니다. 감정 싸움으로 흐르면 “지금 기준이 뭐지?”라고 물어 대화를 다시 세웁니다.",
      en: "When both sides fight, you break the issue apart. When it turns emotional, you ask, “What is the standard here?”",
    },
    caution: {
      ko: "균형을 잡는다고 하지만, 중요한 순간에는 입장을 피하는 사람처럼 보일 수 있습니다. 피해가 이미 생긴 상황에서는 침묵도 선택처럼 보입니다.",
      en: "You call it balance, but at important moments it can look like avoiding a position. When harm is already happening, silence can look like a choice.",
    },
    friendLine: {
      ko: "너는 중립이 아니라, 마지막에 제일 피곤한 질문 하는 사람임.",
      en: "You are not just neutral. You ask the most exhausting final question.",
    },
    conversationStyle: {
      ko: "비교 가능한 기준과 예상 부작용에 설득됩니다. 기준을 세운 뒤 책임 있게 선택하는 사람을 신뢰합니다.",
      en: "Comparable standards and expected side effects persuade you. You trust people who set criteria and then choose responsibly.",
    },
    finalLine: {
      ko: "당신에게 정치란, 어느 편이 맞느냐보다 어떤 기준이 끝까지 버티느냐를 묻는 일입니다.",
      en: "For you, politics asks which standard can survive the whole problem, not just which side sounds right.",
    },
    accent: "#475569",
  },
  {
    id: "practical-conservative",
    title: { ko: "실용 보수형", en: "Practical Conservative" },
    englishLabel: "Practical Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 보수 성향 실용", en: "Spectrum position: right-leaning pragmatic" },
    min: 7,
    max: 32,
    summary: {
      ko: "당신은 바꾸더라도 망가지지 않는 순서를 먼저 찾습니다.",
      en: "Even when changing things, you look for the order that will not break them.",
    },
    description: [
      {
        ko: "당신은 좋은 의도만으로 사회가 굴러간다고 믿지 않습니다. 복지나 규제가 필요할 수는 있습니다. 하지만 비용과 책임이 흐려지면 오래 못 간다고 봅니다.",
        en: "You do not believe society runs on good intentions alone. Welfare or regulation may be needed, but if cost and responsibility get blurry, it will not last.",
      },
      {
        ko: "기존 방식을 무조건 지키자는 쪽은 아닙니다. 다만 바꾸자는 말이 나오면 바로 봅니다. 무엇을 잃는지. 실패하면 누가 책임지는지.",
        en: "You do not automatically defend the old way. But when change is proposed, you immediately ask what could be lost and who is responsible if it fails.",
      },
    ],
    basis: {
      ko: "당신은 “그래서 누가 책임질 건데?”를 먼저 묻습니다. “일단 지원부터 늘리자”는 말을 싫어합니다.",
      en: "You first ask, “So who is responsible?” You dislike “Let’s expand support first.”",
    },
    strength: {
      ko: "좋은 의도에 휩쓸리지 않습니다. 실행 비용과 부작용을 봅니다. 고칠 건 고치되, 망가지지 않는 순서를 찾는 데 강합니다.",
      en: "You do not get swept up by good intentions. You see cost and side effects. You are strong at finding an order that fixes things without breaking them.",
    },
    caution: {
      ko: "현실을 잘 봅니다. 하지만 기존 질서가 이미 누군가에게 불리하다는 점을 작게 볼 수 있습니다. 신중함이 방어처럼 보일 때가 있습니다.",
      en: "You read reality well. But you can underestimate that the existing order already hurts some people. Your caution can look like defense.",
    },
    friendLine: {
      ko: "너는 결국 “그래서 누가 책임질 건데?”부터 묻는 사람임.",
      en: "You are the one who asks, “So who is responsible?”",
    },
    conversationStyle: {
      ko: "실행 가능성, 비용, 책임이 분명한 말에 설득됩니다. 상대의 절박함을 먼저 인정하는 현실론에는 더 잘 반응합니다.",
      en: "Feasibility, cost, and responsibility persuade you. You respond better when realism first acknowledges urgency.",
    },
    finalLine: {
      ko: "당신에게 정치란, 고치기 전에 무엇이 무너지면 안 되는지 계산하는 일입니다.",
      en: "For you, politics calculates what must not collapse before anything is repaired.",
    },
    accent: "#7c6a46",
  },
  {
    id: "moderate-conservative",
    title: { ko: "온건 보수형", en: "Moderate Conservative" },
    englishLabel: "Moderate Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 중도 보수", en: "Spectrum position: center-right" },
    min: 33,
    max: 62,
    summary: {
      ko: "당신은 자유도 좋지만, 신뢰가 무너지면 다 같이 비싸진다고 봅니다.",
      en: "You value freedom, but you think everything gets more expensive when trust collapses.",
    },
    description: [
      {
        ko: "당신은 자유와 복지를 무조건 반대하지 않습니다. 다만 그것이 책임감과 규칙을 약하게 만들면 결국 모두가 비용을 낸다고 봅니다.",
        en: "You do not automatically reject freedom or welfare. But if they weaken responsibility and rules, you think everyone pays the cost.",
      },
      {
        ko: "변화가 필요하다는 말에는 동의할 수 있습니다. 하지만 규칙이 자주 바뀌고 책임의 경계가 흐려지면 쉽게 믿지 않습니다.",
        en: "You can agree that change is needed. But if rules keep moving and responsibility gets blurred, you do not trust it easily.",
      },
    ],
    basis: {
      ko: "당신은 “이게 책임감과 신뢰를 약하게 만들지는 않나?”를 먼저 묻습니다. “불편해도 사회를 위해 참아야 한다”는 말을 싫어합니다.",
      en: "You first ask, “Will this weaken responsibility and trust?” You dislike “Everyone should endure it for society.”",
    },
    strength: {
      ko: "혼란스러운 논쟁에서 기준을 세웁니다. 감정적으로 결론이 날 때 “다음에도 같은 기준을 적용할 수 있나?”를 묻습니다.",
      en: "You set standards in messy debates. When people reach emotional conclusions, you ask whether the same standard can apply next time.",
    },
    caution: {
      ko: "기존 질서가 이미 누군가에게 불리할 수 있습니다. 이 점을 놓치면 방어적으로 보입니다. 책임을 강조하는 말이 “네가 더 버텼어야지”처럼 들릴 수 있습니다.",
      en: "The existing order may already disadvantage some people. If you miss that, you look defensive. Talking about responsibility can sound like “you should have endured more.”",
    },
    friendLine: {
      ko: "너는 바꾸자는 말 나오면 바로 “기준은 뭐야?” 하는 타입.",
      en: "When people say “change it,” you ask, “What is the standard?”",
    },
    conversationStyle: {
      ko: "공동체 신뢰, 책임의 경계, 장기 유지 가능성에 설득됩니다. 추상적 원칙보다 실제 부작용을 보여주는 말이 잘 먹힙니다.",
      en: "Social trust, responsibility boundaries, and long-term durability persuade you. Real side effects work better than abstract principles.",
    },
    finalLine: {
      ko: "당신은 자유도 보호도, 신뢰가 무너지면 오래가지 못한다고 봅니다.",
      en: "You think freedom and protection cannot last when trust collapses.",
    },
    accent: "#8a6f3f",
  },
  {
    id: "strong-conservative",
    title: { ko: "강한 보수형", en: "Strong Conservative" },
    englishLabel: "Strong Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 강한 보수", en: "Spectrum position: far-right / conservative" },
    min: 63,
    max: 100,
    summary: {
      ko: "당신은 변화보다 질서가 먼저 무너지지 않는지를 봅니다.",
      en: "Before change, you ask whether order is about to crack.",
    },
    description: [
      {
        ko: "당신은 오래 버틴 규칙과 질서를 쉽게 흔드는 일을 강하게 경계합니다. 좋은 말도 책임감과 질서를 약하게 만들면 위험하다고 봅니다.",
        en: "You strongly distrust shaking rules and order that have lasted. Even good words feel dangerous if they weaken responsibility and order.",
      },
      {
        ko: "당신은 “좋은 의도”라는 명분이 너무 쉽게 쓰인다고 느낍니다. 제도는 한번 흔들리면 되돌리기 어렵습니다. 그래서 검증된 절차와 분명한 책임을 강하게 요구합니다.",
        en: "You feel “good intention” is used too easily as a reason. Institutions are hard to rebuild once shaken, so you strongly demand tested procedure and clear responsibility.",
      },
    ],
    basis: {
      ko: "당신은 “그거 한번 열면 누가 닫아?”를 먼저 묻습니다. “시대가 바뀌었으니 그냥 따라와야지”라는 말을 싫어합니다.",
      en: "You first ask, “Once that door opens, who closes it?” You dislike “Times changed, so just keep up.”",
    },
    strength: {
      ko: "좋은 의도에 휩쓸리기보다 그 다음 책임을 봅니다. 사회가 감당하기 어려운 변화 속도를 빨리 감지합니다.",
      en: "You look at the next responsibility instead of getting swept up by good intent. You quickly sense when change is moving faster than society can absorb.",
    },
    caution: {
      ko: "안정이라는 이름으로 누군가의 절박함을 너무 빨리 개인 책임으로 정리할 수 있습니다. 질서를 지키려는 말이 “네 문제는 네가 만든 것”처럼 들릴 수 있습니다.",
      en: "In the name of stability, you can turn someone’s urgency into personal responsibility too quickly. Your language of order can sound like “you caused your own problem.”",
    },
    friendLine: {
      ko: "좋은 뜻인 건 알겠는데, 그거 열면 누가 닫아? 이 말 꼭 하는 타입.",
      en: "You always say, “I get the good intent, but who closes that door?”",
    },
    conversationStyle: {
      ko: "명확한 책임, 검증된 절차, 장기 안정성에 설득됩니다. 다만 실제 피해를 먼저 인정하는 사람에게 더 마음을 엽니다.",
      en: "Clear responsibility, tested procedure, and long-term stability persuade you. You listen better when real harm is acknowledged first.",
    },
    finalLine: {
      ko: "당신은 변화보다, 변화 이후에도 사회가 버틸 수 있는지를 먼저 봅니다.",
      en: "Before change, you first ask whether society can still hold afterward.",
    },
    accent: "#795f36",
  },
];

const AGREEMENT_NEUTRAL_VALUE = 4;
const MAX_STATEMENT_SCORE = 3;
const MAX_LEFT_RIGHT_RAW_SCORE = POLITICAL_QUESTIONS.reduce(
  (sum, question) => sum + (question.weight ?? 1) * MAX_STATEMENT_SCORE,
  0,
);
const MAX_ORDER_FREEDOM_RAW_SCORE = POLITICAL_QUESTIONS.reduce(
  (sum, question) => sum + Math.abs(question.orderFreedomWeight ?? 0) * MAX_STATEMENT_SCORE,
  0,
);
const RESULT_ORDER = POLITICAL_RESULTS.map((result) => result.id);

export function localized(locale: "ko" | "en", copy: LocalizedText): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export function normalizePoliticalScore(rawScore: number): number {
  return Math.max(-100, Math.min(100, Math.round((rawScore / MAX_LEFT_RIGHT_RAW_SCORE) * 100)));
}

export function normalizeOrderFreedomScore(rawScore: number): number {
  if (!MAX_ORDER_FREEDOM_RAW_SCORE) return 0;
  return Math.max(-100, Math.min(100, Math.round((rawScore / MAX_ORDER_FREEDOM_RAW_SCORE) * 100)));
}

export function spectrumPercent(score: number): number {
  return Math.max(0, Math.min(100, (score + 100) / 2));
}

export function valueMapYPercent(score: number): number {
  return Math.max(0, Math.min(100, (100 - score) / 2));
}

export function getPoliticalResultById(id: PoliticalResultId | string | undefined): PoliticalResult | undefined {
  return POLITICAL_RESULTS.find((result) => result.id === id);
}

export function getPoliticalResultByScore(score: number): PoliticalResult {
  return (
    POLITICAL_RESULTS.find((result) => score >= result.min && score <= result.max) ??
    POLITICAL_RESULTS.find((result) => result.id === "centrist-pragmatist") ??
    POLITICAL_RESULTS[3]
  );
}

export function getPoliticalAxisInterpretation(
  leftRightScore: number,
  orderFreedomScore: number,
): PoliticalAxisInterpretation {
  const ideology =
    leftRightScore <= -63
      ? { ko: "강한 진보형", en: "Strong progressive" }
      : leftRightScore <= -33
        ? { ko: "온건 진보형", en: "Moderate progressive" }
        : leftRightScore <= -7
          ? { ko: "실용 진보형", en: "Practical progressive" }
          : leftRightScore >= 63
            ? { ko: "강한 보수형", en: "Strong conservative" }
            : leftRightScore >= 33
              ? { ko: "온건 보수형", en: "Moderate conservative" }
              : leftRightScore >= 7
                ? { ko: "실용 보수형", en: "Practical conservative" }
                : { ko: "중도 실용형", en: "Centrist pragmatist" };

  const axis =
    orderFreedomScore >= 36
      ? { ko: "질서·안정 우선", en: "order and stability first" }
      : orderFreedomScore >= 14
        ? { ko: "안정 지향", en: "stability-leaning" }
        : orderFreedomScore <= -36
          ? { ko: "자유·자율 우선", en: "freedom and autonomy first" }
          : orderFreedomScore <= -14
            ? { ko: "자유 성향", en: "freedom-leaning" }
            : { ko: "균형 감각", en: "balanced on freedom and order" };

  const detail =
    orderFreedomScore >= 14
      ? {
          ko: "당신은 변화가 필요하다는 말보다, 그 변화가 사회를 얼마나 흔들지 먼저 봅니다. 좋은 의도라도 기준과 책임이 무너지면 오래가지 못한다고 느낍니다.",
          en: "Before accepting the need for change, you first ask how much it will shake society. Even good intentions feel weak to you if standards and responsibility fall apart.",
        }
      : orderFreedomScore <= -14
        ? {
            ko: "당신은 정책의 목적보다, 그 정책이 개인의 선택을 얼마나 좁히는지 먼저 봅니다. 사회를 위한다는 말이 자유를 너무 쉽게 밀어내면 불편해집니다.",
            en: "Before the purpose of a policy, you notice how much it narrows personal choice. You become uneasy when “for society” pushes freedom aside too easily.",
          }
        : {
            ko: "당신은 자유와 질서 중 하나만 고정해서 믿지 않습니다. 사안마다 무엇을 지켜야 하고 무엇을 풀어야 하는지 다시 따집니다.",
            en: "You do not always put freedom or order first. You re-check what needs protection and what needs loosening case by case.",
          };

  return {
    label: {
      ko: `${ideology.ko} · ${axis.ko}`,
      en: `${ideology.en} · ${axis.en}`,
    },
    detail,
  };
}

export function calculatePoliticalAnswer(
  question: PoliticalQuestion,
  agreement: PoliticalAgreementValue,
): PoliticalAnswer {
  const agreementOffset = AGREEMENT_NEUTRAL_VALUE - agreement;
  const directionMultiplier =
    question.direction === "progressive" ? -1 : question.direction === "conservative" ? 1 : 0;
  const score = agreementOffset * directionMultiplier * (question.weight ?? 1);
  const orderFreedomScore = agreementOffset * (question.orderFreedomWeight ?? 0);

  return {
    questionId: question.id,
    agreement,
    score,
    orderFreedomScore,
    dimensions: {
      [question.dimension]: score,
    },
  };
}

export function calculatePoliticalResult(answers: PoliticalAnswer[]): {
  rawScore: number;
  rawOrderFreedomScore: number;
  normalizedScore: number;
  orderFreedomScore: number;
  result: PoliticalResult;
  dimensions: Record<PoliticalDimension, number>;
} {
  const dimensions: Record<PoliticalDimension, number> = {
    freedomOrder: 0,
    welfareMarket: 0,
    changeStability: 0,
    individualSocial: 0,
  };

  let rawOrderFreedomScore = 0;

  const rawScore = answers.reduce((sum, answer) => {
    for (const [dimension, value] of Object.entries(answer.dimensions) as Array<[PoliticalDimension, number]>) {
      dimensions[dimension] += value;
    }
    rawOrderFreedomScore += answer.orderFreedomScore;
    return sum + answer.score;
  }, 0);

  const normalizedScore = normalizePoliticalScore(rawScore);
  const orderFreedomScore = normalizeOrderFreedomScore(rawOrderFreedomScore);

  return {
    rawScore,
    rawOrderFreedomScore,
    normalizedScore,
    orderFreedomScore,
    result: getPoliticalResultByScore(normalizedScore),
    dimensions,
  };
}

export function resultMidpoint(result: PoliticalResult): number {
  return Math.round((result.min + result.max) / 2);
}

export function isPoliticalResultId(value: unknown): value is PoliticalResultId {
  return typeof value === "string" && RESULT_ORDER.includes(value as PoliticalResultId);
}
