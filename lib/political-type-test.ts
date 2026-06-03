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
        ko: "당신은 사회 문제를 개인의 노력 부족으로 너무 빨리 정리하는 말을 의심합니다. 누가 같은 출발선에 서지 못했는지, 어떤 규칙이 특정 사람에게만 더 비싸게 작동하는지, 권리라는 말이 실제 생활까지 내려왔는지를 먼저 봅니다.",
        en: "You are suspicious when social problems are explained too quickly as lack of effort. You first ask who never had the same starting line, which rules cost some people more, and whether rights actually reach daily life.",
      },
      {
        ko: "좋은 의도만으로 충분하다고 믿는 것은 아니지만, 반복되는 불평등 앞에서 기다리자는 말에는 쉽게 설득되지 않습니다. 안정이 누군가에게는 편안함이고 누군가에게는 계속 참으라는 명령일 수 있다고 보기 때문에, 변화의 비용보다 방치의 비용을 더 크게 느낄 때가 많습니다.",
        en: "You do not think good intentions are enough, but you are rarely persuaded by calls to wait in the face of repeated inequality. Because stability can mean comfort for some and forced patience for others, you often feel the cost of inaction more sharply than the cost of change.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “이 규칙이 누구를 보호하고, 누구를 계속 밖에 세워두는가?” 싫어하는 말은 “그건 개인이 알아서 할 문제다.”입니다.",
      en: "Your first reaction is: “Who does this rule protect, and who does it keep outside?” The sentence you hate is: “That is just an individual problem.”",
    },
    strength: {
      ko: "대화에서 남들이 지나친 피해 사례를 붙잡아 구조의 문제로 끌어올립니다. 다수가 익숙하다는 이유로 넘어가는 규칙에도 “그 익숙함의 비용은 누가 냈지?”라고 묻는 힘이 있습니다.",
      en: "In conversation, you catch the harm others skip over and connect it to the structure behind it. When people defend a rule because it is familiar, you can ask who paid the price for that familiarity.",
    },
    caution: {
      ko: "변화의 필요성을 잘 보지만, 그 변화의 비용을 누가 감당하는지는 늦게 볼 수 있습니다. 옳은 방향이라는 확신이 강해질수록, 속도를 따라오지 못하는 사람까지 무지하거나 무심한 쪽으로 묶어버릴 위험이 있습니다.",
      en: "You see the need for change clearly, but you may notice late who has to absorb its cost. The more certain you are about the right direction, the easier it becomes to treat people who cannot keep up as ignorant or indifferent.",
    },
    friendLine: {
      ko: "너는 정치 얘기하면 남들이 “현실적으로 어렵다” 할 때 “그 현실은 누구한테만 어려운데?”부터 묻는 타입이야.",
      en: "When people say something is “realistically difficult,” you are the one asking, “Difficult for whom, exactly?”",
    },
    conversationStyle: {
      ko: "원칙과 피해 사례가 분명한 대화에 강합니다. 다만 상대를 설득하려면 감정의 정당성뿐 아니라 예산, 절차, 전환 과정에서 생기는 부담까지 같이 보여줄 때 훨씬 세집니다.",
      en: "You respond well to conversations with clear principles and concrete harm. To persuade others, you become much stronger when you also name budgets, procedures, and the burdens created during transition.",
    },
    finalLine: {
      ko: "당신에게 정치란, 참으라는 말 뒤에 누가 오래 갇혀 있었는지 묻는 일입니다.",
      en: "For you, politics asks who has been trapped behind the word “be patient.”",
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
        ko: "당신은 복지, 교육, 노동, 다양성 같은 이슈에서 개인에게만 책임을 넘기는 방식이 부족하다고 느낍니다. 다만 변화가 선한 말로만 추진되면 금방 지치거나 반발을 부를 수 있다는 것도 압니다.",
        en: "On welfare, education, labor, and diversity, you often feel it is not enough to push responsibility back onto individuals. At the same time, you know change built only on moral language can quickly exhaust people or provoke resistance.",
      },
      {
        ko: "당신에게 중요한 것은 방향과 설계가 같이 가는지입니다. 좋은 의도, 사회적 보호, 공정한 기회에 끌리지만 그 정책이 사람들의 생활에서 어떻게 굴러갈지, 누가 비용을 내고 누가 책임지는지까지 확인해야 마음이 놓입니다.",
        en: "What matters to you is whether direction and design move together. You are drawn to good intent, social protection, and fair opportunity, but you need to see how a policy works in daily life, who pays for it, and who remains accountable.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “좋은 방향인 건 알겠는데, 이걸 계속 유지할 구조가 있는가?” 싫어하는 말은 “일단 바꾸고 보자.”입니다.",
      en: "Your first reaction is: “I see the direction, but is there a structure that can sustain it?” The sentence you hate is: “Let’s just change it first.”",
    },
    strength: {
      ko: "감정이 뜨거운 주제에서도 문제 제기를 실행 계획으로 번역할 줄 압니다. “이건 불공정하다”에서 멈추지 않고, 어떤 기준과 절차가 있어야 덜 흔들리는지까지 생각합니다.",
      en: "Even on heated issues, you can translate moral concern into an implementation plan. You do not stop at “this is unfair”; you think about the standards and procedures needed to keep the fix from wobbling.",
    },
    caution: {
      ko: "균형을 잡으려다 보면, 절박한 사람에게는 너무 느리게 보일 수 있습니다. 현실성을 챙기는 사이 핵심 가치가 흐려지면 “결국 좋은 말만 하고 후퇴하는 사람”처럼 읽힐 수 있습니다.",
      en: "Because you try to keep balance, people in urgent situations may see you as too slow. If feasibility blurs your core value, you can look like someone who says the right thing and then retreats.",
    },
    friendLine: {
      ko: "너는 바꾸자는 편인데, 회의 끝나기 전에 꼭 “그래서 운영은 누가 해?”라고 묻는 사람임.",
      en: "You are pro-change, but before the meeting ends you always ask, “So who is actually running this?”",
    },
    conversationStyle: {
      ko: "감정 호소만 있는 대화보다 피해 사례, 제도 설계, 단계별 실행안이 함께 있을 때 설득됩니다. 원칙을 말하되 현실의 마찰을 숨기지 않는 사람에게 신뢰를 줍니다.",
      en: "You are persuaded less by emotion alone and more by harm examples, institutional design, and phased action. You trust people who state principles without hiding real-world friction.",
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
        ko: "당신은 사회가 개인에게만 책임을 넘기면 중요한 원인을 놓친다고 봅니다. 교육, 노동, 지역, 안전망 같은 조건이 사람의 선택지를 좁힌다는 데 민감하지만, 모든 답을 거대한 구호로 처리하는 것도 좋아하지 않습니다.",
        en: "You think society misses important causes when it leaves everything to individual responsibility. You are sensitive to how education, labor, region, and safety nets narrow choices, but you do not like turning every answer into a grand slogan.",
      },
      {
        ko: "당신은 개혁의 방향을 보되, 작동하지 않는 개혁에는 오래 머물지 않습니다. 좋은 의도라도 결과가 나쁘면 고쳐야 하고, 작은 개선이라도 실제 피해를 줄이면 의미가 있다고 판단합니다.",
        en: "You see the direction of reform, but you do not stay loyal to reforms that do not work. Even good intent needs correction when outcomes are poor, and even small improvements matter if they reduce real harm.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “이게 실제로 누구의 삶을 얼마나 바꾸는가?” 싫어하는 말은 “좋은 의도니까 괜찮다.”입니다.",
      en: "Your first reaction is: “Whose life does this actually change, and by how much?” The sentence you hate is: “It is fine because the intention is good.”",
    },
    strength: {
      ko: "논쟁이 뜨거워져도 “그래서 다음 조치는 뭐야?”라고 묻습니다. 이념의 방향을 완전히 버리지 않으면서도, 데이터와 현장 반응으로 주장을 조정할 줄 압니다.",
      en: "Even when the debate gets hot, you ask, “So what is the next step?” You do not abandon your direction, but you can adjust claims based on data and real-world response.",
    },
    caution: {
      ko: "개혁의 방향은 보지만, 현실적 타협을 하다 보면 양쪽 모두에게 애매하다는 말을 들을 수 있습니다. 효과를 좇는 태도가 지나치면, 왜 그 효과가 필요한지에 대한 가치 설명이 약해질 수 있습니다.",
      en: "You see the reform direction, but practical compromise can make both sides call you ambiguous. If you chase effect too hard, your explanation of why that effect matters can become thin.",
    },
    friendLine: {
      ko: "너는 진보 성향인데, 예쁜 문구보다 “그래서 현장에서 먹히냐?”를 더 믿는 타입이야.",
      en: "You lean progressive, but you trust “does it work on the ground?” more than a beautiful slogan.",
    },
    conversationStyle: {
      ko: "실제 피해 사례와 숫자, 시범 적용 결과, 단계별 보완책이 있는 대화에서 설득됩니다. 이상만 말하는 사람보다 실패했을 때 어떻게 고칠지 말하는 사람을 더 신뢰합니다.",
      en: "You are persuaded by real harm examples, numbers, pilot results, and phased fixes. You trust people who can say how they will repair failure more than people who speak only in ideals.",
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
        ko: "당신은 어떤 이슈에서는 변화가 늦었다고 느끼고, 다른 이슈에서는 속도가 너무 빠르다고 느낍니다. 그래서 정치 이야기를 들을 때 “누가 말했는가”보다 “이 경우에는 어떤 기준이 맞는가”를 먼저 확인합니다.",
        en: "On some issues you feel change is overdue; on others, the pace feels too fast. So in political conversations, you check which standard fits this case before asking who said it.",
      },
      {
        ko: "당신에게 중도는 아무 생각이 없다는 뜻이 아니라, 한 가지 문장으로 모든 문제를 처리하지 않겠다는 태도에 가깝습니다. 자유, 책임, 복지, 경쟁, 질서, 변화 중 무엇이 우선인지 매번 다시 따지기 때문에 대화가 길어질 때가 많습니다.",
        en: "For you, the center is not the absence of thought. It is the refusal to solve every issue with one sentence. You keep re-checking whether freedom, responsibility, welfare, competition, order, or change should come first, which can make your conversations long.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “이 사안에서는 원칙보다 결과가 중요한가, 결과보다 원칙이 중요한가?” 싫어하는 말은 “둘 중 하나만 골라.”입니다.",
      en: "Your first reaction is: “In this case, should principle outrank outcome, or outcome outrank principle?” The sentence you hate is: “Just pick one side.”",
    },
    strength: {
      ko: "양쪽이 서로를 몰아붙일 때 쟁점을 분해하고 숨은 전제를 꺼냅니다. 감정 싸움으로 흐르는 자리에서 “지금 우리가 다투는 기준이 뭐지?”라고 물어 대화를 다시 세울 수 있습니다.",
      en: "When both sides push each other into corners, you break the issue apart and expose hidden assumptions. In a conversation turning into emotional combat, you can ask, “What standard are we actually fighting over?”",
    },
    caution: {
      ko: "균형을 잡는다고 말하지만, 중요한 순간에는 입장을 유보하는 사람처럼 보일 수 있습니다. 모든 조건을 다 따진 뒤에야 움직이면, 이미 피해를 겪는 사람에게는 침묵도 선택처럼 보입니다.",
      en: "You say you are balancing, but at important moments you can look like someone withholding a position. If you move only after every condition is checked, people already facing harm may read your silence as a choice.",
    },
    friendLine: {
      ko: "너는 중립이라기보다, 양쪽 말 다 듣고 마지막에 제일 피곤한 질문 하는 사람임.",
      en: "You are not just neutral. You listen to both sides and then ask the most exhausting question in the room.",
    },
    conversationStyle: {
      ko: "감정 호소보다 비교 가능한 기준, 예상되는 부작용, 실제 실행 가능성이 있는 대화에서 설득됩니다. 단, 결론을 너무 미루는 사람보다 기준을 세운 뒤 책임 있게 선택하는 사람에게 더 끌립니다.",
      en: "You are persuaded by comparable standards, expected side effects, and feasibility more than emotional appeal. Still, you respect people who set criteria and choose responsibly more than people who delay forever.",
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
        ko: "당신은 사회가 좋은 의도만으로 운영되지 않는다고 봅니다. 복지, 규제, 제도 개편이 필요할 수는 있지만, 비용과 책임 구조가 흐려지면 결국 오래 버티지 못한다고 느낍니다.",
        en: "You do not think society runs on good intentions alone. Welfare, regulation, and institutional reform may be necessary, but if cost and accountability become blurry, you doubt the system can last.",
      },
      {
        ko: "기존 질서를 무조건 옹호하는 편은 아닙니다. 다만 바꾸자는 말이 나올 때마다 “무엇을 잃을 수 있는가”, “실패하면 누가 책임지는가”, “이 방식이 다음 세대까지 감당 가능한가”를 확인해야 마음이 놓입니다.",
        en: "You do not defend the existing order automatically. But whenever change is proposed, you need to ask what could be lost, who is accountable if it fails, and whether the approach remains bearable for the next generation.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “좋은 의도 뒤에 숨은 비용은 누가 내는가?” 싫어하는 말은 “일단 지원부터 늘리자.”입니다.",
      en: "Your first reaction is: “Who pays the hidden cost behind the good intention?” The sentence you hate is: “Let’s expand support first.”",
    },
    strength: {
      ko: "회의에서 모두가 방향에 취해 있을 때 실행 비용과 부작용을 꺼내 분위기를 현실로 돌립니다. 비판만 하는 게 아니라, 고칠 건 고치되 무너지지 않게 가는 경로를 찾는 데 강합니다.",
      en: "When everyone in the room is carried away by direction, you bring up cost and side effects and return the discussion to reality. You are strong at finding a path that fixes what is broken without breaking the rest.",
    },
    caution: {
      ko: "현실을 잘 보지만, 때로는 기존 질서가 이미 누군가에게 불리하다는 사실을 과소평가할 수 있습니다. 안정이라는 말이 계속 유지되는 불공정까지 덮어버리면, 당신의 신중함은 방어처럼 보입니다.",
      en: "You read reality well, but you can underestimate that the existing order may already disadvantage some people. If stability covers ongoing unfairness, your caution starts to look like defense.",
    },
    friendLine: {
      ko: "너는 정치 얘기하면 감정보다 “그래서 누가 책임질 건데?”부터 묻는 타입이야.",
      en: "In political talk, you ask “So who is responsible for this?” before you ask how everyone feels.",
    },
    conversationStyle: {
      ko: "이상보다 실행 가능성, 감정 호소보다 비용과 책임이 분명한 대화에서 설득됩니다. 다만 상대의 절박함을 먼저 인정해주는 사람이 말하는 현실론에는 훨씬 귀를 엽니다.",
      en: "You are persuaded by feasibility, cost, and accountability more than ideals or emotional appeal. But you listen much better to realism that first acknowledges the other person’s urgency.",
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
        ko: "당신은 자유와 복지의 필요성을 부정하지 않습니다. 다만 그것이 책임감, 규칙 준수, 공동체 신뢰를 약하게 만들면 결국 성실하게 버텨온 사람들에게 비용이 돌아간다고 느낍니다.",
        en: "You do not reject freedom or welfare. But when they weaken responsibility, rule-following, and social trust, you feel the cost often returns to people who have been carrying their part faithfully.",
      },
      {
        ko: "급격한 변화보다 예측 가능한 절차와 검증된 기준을 선호합니다. 변화가 필요하다는 말에는 동의할 수 있어도, 그 변화가 규칙을 자주 바꾸고 책임의 경계를 흐리면 쉽게 마음을 주지 않습니다.",
        en: "You prefer predictable procedure and tested standards over rapid change. You may agree that change is needed, but if it keeps moving the rules and blurring responsibility, you do not trust it easily.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “이 선택이 공동체의 책임감과 신뢰를 약하게 만들지는 않는가?” 싫어하는 말은 “불편해도 사회를 위해 참아야 한다.”입니다.",
      en: "Your first reaction is: “Will this weaken responsibility and trust in the community?” The sentence you hate is: “Even if it is uncomfortable, everyone should endure it for society.”",
    },
    strength: {
      ko: "분위기가 한쪽으로 쏠릴 때도 기준과 절차를 붙잡습니다. 대화에서 “이게 다음 상황에도 같은 기준으로 적용될 수 있나?”를 물어 감정적 결론을 견제합니다.",
      en: "Even when the room tilts one way, you hold onto standards and procedure. In conversation, you check emotional conclusions by asking whether the same standard can apply to the next case.",
    },
    caution: {
      ko: "기존 질서가 누군가에게 이미 불리한 구조일 수 있다는 점을 놓치면 방어적으로 보일 수 있습니다. 책임을 강조하는 말이 반복되면, 상대에게는 “네가 더 버텼어야지”라는 뜻으로 들릴 수 있습니다.",
      en: "If you miss that the existing order may already disadvantage some people, you can look defensive. Repeated language about responsibility can sound to others like, “You should have endured more.”",
    },
    friendLine: {
      ko: "너는 갑자기 바꾸자는 말 나오면 바로 “그럼 기준은 뭐야?” 하고 브레이크 밟는 타입이야.",
      en: "When someone says to change things fast, you hit the brakes and ask, “Then what is the standard?”",
    },
    conversationStyle: {
      ko: "공동체 신뢰, 책임의 경계, 지속 가능성을 차분히 비교하는 대화가 잘 맞습니다. 추상적인 원칙보다 실제 부작용과 장기 유지 가능성을 보여주는 설명에 설득됩니다.",
      en: "You fit best with calm comparison around social trust, boundaries of responsibility, and sustainability. You are persuaded less by abstract principles than by real side effects and long-term durability.",
    },
    finalLine: {
      ko: "당신에게 정치란, 자유와 보호가 공동체의 신뢰 위에서만 오래 간다는 사실을 확인하는 일입니다.",
      en: "For you, politics checks whether freedom and protection can last on top of shared trust.",
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
        ko: "당신은 사회가 오래 버텨온 규칙과 관습을 쉽게 흔드는 일에 강한 경계심이 있습니다. 자유와 복지라는 말이 중요하더라도, 그것이 책임감과 질서를 약하게 만들면 결국 가장 평범하게 규칙을 지켜온 사람들이 손해를 본다고 느낍니다.",
        en: "You are strongly wary of shaking rules and norms that have held society together for a long time. Even when freedom and welfare sound important, you feel that weakening responsibility and order ultimately harms ordinary people who kept the rules.",
      },
      {
        ko: "당신은 좋은 의도라는 명분이 너무 쉽게 쓰이는 것을 싫어합니다. 제도는 한번 흔들리면 되돌리기 어렵고, 책임의 기준이 흐려지면 공동체 전체가 느슨해진다고 보기 때문에 검증된 절차와 분명한 책임을 강하게 요구합니다.",
        en: "You dislike how easily good intention can become a justification. Because institutions are hard to rebuild once shaken and responsibility weakens when standards blur, you strongly demand tested procedure and clear accountability.",
      },
    ],
    basis: {
      ko: "가장 먼저 반응하는 질문은 이것입니다. “자유를 제한하거나 질서를 바꾸는 명분이 너무 쉽게 쓰이는 건 아닌가?” 싫어하는 말은 “시대가 바뀌었으니 그냥 따라와야지.”입니다.",
      en: "Your first reaction is: “Is the justification for limiting freedom or changing order being used too easily?” The sentence you hate is: “Times changed, so just keep up.”",
    },
    strength: {
      ko: "혼란스러운 논쟁에서도 기준을 세우고, 사회가 감당할 수 없는 변화 속도를 빨리 감지합니다. 남들이 선한 의도에 집중할 때도 “그 다음 책임은 어디로 가나?”를 묻는 힘이 있습니다.",
      en: "Even in messy debates, you set standards and quickly sense when the pace of change may exceed what society can absorb. When others focus on good intent, you can ask where responsibility goes next.",
    },
    caution: {
      ko: "안정이라는 이름으로, 누군가의 절박함을 너무 빨리 개인 책임으로 정리할 수 있습니다. 질서를 지키려는 언어가 고통을 겪는 사람에게는 “네 문제는 네가 만든 것”처럼 들릴 수 있다는 점을 놓치면 대화가 바로 닫힙니다.",
      en: "In the name of stability, you can classify someone’s urgency as personal responsibility too quickly. If your language of order sounds like “you caused your own problem” to someone in pain, the conversation closes fast.",
    },
    friendLine: {
      ko: "너는 정치 얘기하면 “좋은 뜻인 건 알겠는데, 그거 한번 열면 누가 닫아?”부터 묻는 사람임.",
      en: "In political talk, you are the one saying, “I get the good intent, but once that door opens, who closes it?”",
    },
    conversationStyle: {
      ko: "감정 호소보다 명확한 책임, 검증된 절차, 장기 안정성을 보여주는 대화에서 설득됩니다. 다만 상대의 실제 피해를 먼저 인정한 뒤 질서를 말하는 사람에게 훨씬 더 마음을 엽니다.",
      en: "You are persuaded by clear responsibility, tested procedure, and long-term stability more than emotional appeal. But you open up much more to people who acknowledge real harm before talking about order.",
    },
    finalLine: {
      ko: "당신에게 정치란, 바꾸기 전에 무엇을 지켜야 사회가 계속 버티는지 묻는 일입니다.",
      en: "For you, politics asks what society must protect before it can keep standing through change.",
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
          ko: "좌우 성향과 별개로, 사회 변화가 있을 때 예측 가능성·제도 안정·공동체 신뢰를 함께 확인하려는 경향이 있습니다.",
          en: "Beyond left-right orientation, you tend to check predictability, institutional stability, and social trust when society changes.",
        }
      : orderFreedomScore <= -14
        ? {
            ko: "좌우 성향과 별개로, 사회 이슈를 볼 때 개인의 선택권·표현의 자유·자율성을 먼저 확인하려는 경향이 있습니다.",
            en: "Beyond left-right orientation, you tend to check personal choice, expression, and autonomy first when reading social issues.",
          }
        : {
            ko: "좌우 성향과 별개로, 자유와 질서 중 하나만 고정적으로 앞세우기보다 이슈별 조건을 나누어 보려는 경향이 있습니다.",
            en: "Beyond left-right orientation, you tend to separate issue conditions instead of always prioritizing either freedom or order.",
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
