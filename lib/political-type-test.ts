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
    max: -70,
    summary: {
      ko: "변화와 평등, 권리 보호를 강하게 우선하는 성향입니다.",
      en: "You strongly prioritize change, equality, and rights protection.",
    },
    description: [
      {
        ko: "당신은 사회 문제를 개인의 선택만으로 설명하기 어렵다고 보는 편입니다. 출발선의 차이, 제도적 장벽, 권력의 불균형, 소수자의 권리처럼 잘 보이지 않는 구조를 먼저 살핍니다.",
        en: "You tend not to explain social problems through individual choice alone. You look first at starting lines, institutional barriers, power imbalance, and rights that may be overlooked.",
      },
      {
        ko: "변화가 불편하더라도 지금의 불평등이 반복된다면 제도가 더 적극적으로 개입해야 한다고 느낍니다. 그래서 타협보다 방향의 선명함을 중시할 때가 많습니다.",
        en: "Even when change is uncomfortable, you feel institutions should act when inequality keeps repeating. You often value clarity of direction more than easy compromise.",
      },
    ],
    basis: {
      ko: "사회적 약자 보호, 구조적 불평등, 권리 보장, 빠른 제도 개선을 중요한 판단 기준으로 삼습니다.",
      en: "You judge through protection for vulnerable people, structural inequality, rights, and institutional reform.",
    },
    strength: {
      ko: "보이지 않는 피해와 배제된 사람을 빨리 알아차리고, 당연하게 여겨진 규칙을 다시 질문합니다.",
      en: "You notice overlooked harm and question rules others may treat as natural.",
    },
    caution: {
      ko: "변화의 방향이 옳아 보여도 실행 비용, 속도, 반발을 작게 보면 설득력이 약해질 수 있습니다.",
      en: "Even when change is justified, underestimating cost, pace, and resistance can weaken persuasion.",
    },
    friendLine: {
      ko: "너는 누가 빠져 있는지 제일 먼저 보는 사람 같아.",
      en: "You are the first person to notice who is being left out.",
    },
    conversationStyle: {
      ko: "가치와 권리를 분명히 말하되, 상대가 걱정하는 비용과 현실 조건을 함께 다룰 때 가장 설득력이 있습니다.",
      en: "State values and rights clearly, then address practical costs and constraints.",
    },
    finalLine: {
      ko: "당신에게 정치란 멈춘 사회를 조금 더 공정하게 움직이게 하는 일입니다.",
      en: "For you, politics is about moving a stalled society toward fairness.",
    },
    accent: "#2563eb",
  },
  {
    id: "moderate-progressive",
    title: { ko: "온건 진보형", en: "Moderate Progressive" },
    englishLabel: "Moderate Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 중도 진보", en: "Spectrum position: center-left" },
    min: -69,
    max: -38,
    summary: {
      ko: "사회 변화와 보호의 필요성을 인정하면서 현실적 균형도 함께 보는 성향입니다.",
      en: "You value social change and protection while keeping practical balance in view.",
    },
    description: [
      {
        ko: "당신은 복지, 교육, 노동, 다양성 같은 이슈에서 제도적 보완이 필요하다는 쪽에 마음이 기울지만, 변화가 실제로 작동하는 방식도 중요하게 봅니다.",
        en: "You lean toward institutional support on welfare, education, labor, and diversity, while caring about how change works in practice.",
      },
      {
        ko: "구호보다 설계를 선호합니다. 바꾸어야 할 것은 바꾸되 기준과 절차를 세워 오래 지속되는 변화를 만들고 싶어합니다.",
        en: "You prefer design over slogans. You want changes that come with standards and procedures so they can last.",
      },
    ],
    basis: {
      ko: "약자 보호, 기회 보정, 제도 개선, 실현 가능한 속도를 함께 기준으로 봅니다.",
      en: "You judge through protection, opportunity correction, institutional improvement, and feasible pace.",
    },
    strength: {
      ko: "원칙과 현실 사이에서 다리를 놓고, 뜨거운 갈등을 정책 언어로 정리할 수 있습니다.",
      en: "You bridge principles and reality, turning conflicts into policy language.",
    },
    caution: {
      ko: "균형을 찾다가 핵심 가치가 흐려지면 강한 입장을 기대하는 사람에게는 애매하게 보일 수 있습니다.",
      en: "If balance blurs your core values, people expecting a strong stance may find you hesitant.",
    },
    friendLine: {
      ko: "너는 바꾸자는 쪽인데, 어떻게 바꿀지도 같이 묻는 스타일이야.",
      en: "You want change, but you also ask how to make it work.",
    },
    conversationStyle: {
      ko: "문제 제기와 실행 계획을 함께 말할 때 가장 강합니다.",
      en: "You are most persuasive when you pair problem-framing with an implementation plan.",
    },
    finalLine: {
      ko: "당신에게 정치란 나은 방향으로 천천히, 그러나 분명하게 가는 과정입니다.",
      en: "For you, politics is a steady movement toward a better direction.",
    },
    accent: "#3b82f6",
  },
  {
    id: "practical-progressive",
    title: { ko: "실용 진보형", en: "Practical Progressive" },
    englishLabel: "Practical Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 진보 성향 실용", en: "Spectrum position: left-leaning pragmatic" },
    min: -37,
    max: -11,
    summary: {
      ko: "사회적 책임과 개선을 중시하지만 실제 효과를 먼저 확인하는 성향입니다.",
      en: "You care about social responsibility and improvement while checking practical effects first.",
    },
    description: [
      {
        ko: "당신은 대체로 사회가 더 공정해져야 한다는 쪽에 가깝습니다. 다만 모든 문제를 큰 이념으로만 풀기보다 지금 작동할 수 있는 방법을 먼저 확인합니다.",
        en: "You generally lean toward a fairer society, but you do not want every problem solved only through big ideology. You first check what can work now.",
      },
      {
        ko: "작은 개선이라도 실제 효과가 있다면 의미 있다고 봅니다. 말보다 결과, 선언보다 실행을 더 신뢰하는 편입니다.",
        en: "You trust working improvements, even small ones. You rely more on outcomes than declarations.",
      },
    ],
    basis: {
      ko: "개선 가능성, 정책 효과, 약자 보호, 사회적 비용의 균형을 기준으로 판단합니다.",
      en: "You judge through improvement potential, policy effect, protection, and social cost.",
    },
    strength: {
      ko: "뜨거운 주제에서도 그래서 지금 무엇을 할 수 있는가를 묻는 현실 감각이 있습니다.",
      en: "You ask what can be done now, even on heated issues.",
    },
    caution: {
      ko: "효과를 중시하다 보면 가치의 방향을 충분히 설명하지 못해 입장이 애매하다는 말을 들을 수 있습니다.",
      en: "Because you focus on effect, you may not explain your values clearly enough and can seem ambiguous.",
    },
    friendLine: {
      ko: "너는 진보 쪽인데 말보다 작동하는 해법을 더 믿는 사람이지.",
      en: "You lean progressive, but you care more about workable fixes than slogans.",
    },
    conversationStyle: {
      ko: "사례, 데이터, 단계적 실행안을 가져올 때 대화가 잘 풀립니다.",
      en: "Examples, data, and phased action plans make your conversations work best.",
    },
    finalLine: {
      ko: "당신에게 정치란 더 나은 사회를 실제로 굴러가게 만드는 일입니다.",
      en: "For you, politics is making a better society actually work.",
    },
    accent: "#0ea5e9",
  },
  {
    id: "centrist-pragmatist",
    title: { ko: "중도 실용형", en: "Centrist Pragmatist" },
    englishLabel: "Centrist Pragmatist",
    spectrumPosition: { ko: "스펙트럼 위치: 중도", en: "Spectrum position: center" },
    min: -10,
    max: 10,
    summary: {
      ko: "한쪽 이념보다 맥락, 효과, 균형을 우선하는 성향입니다.",
      en: "You prioritize context, effect, and balance over a single ideological side.",
    },
    description: [
      {
        ko: "당신은 어떤 주제에서는 변화가 필요하다고 느끼고, 다른 주제에서는 안정과 책임이 더 중요하다고 봅니다. 그래서 문제별로 판단을 달리하는 편입니다.",
        en: "On some topics you feel change is needed; on others, stability and responsibility matter more. You tend to judge issue by issue.",
      },
      {
        ko: "이 성향은 회색지대에 머문다는 뜻이 아니라, 한 가지 답으로 모든 문제를 풀기 어렵다고 보는 태도에 가깝습니다.",
        en: "This is not simply staying in a gray zone. It is closer to believing one answer cannot solve every issue.",
      },
    ],
    basis: {
      ko: "맥락, 실행 가능성, 균형, 부작용, 사회적 합의를 기준으로 봅니다.",
      en: "You judge through context, feasibility, balance, side effects, and consensus.",
    },
    strength: {
      ko: "극단적 주장 사이에서 쟁점을 정리하고 현실적인 접점을 찾는 데 강합니다.",
      en: "You are good at organizing issues between strong claims and finding realistic contact points.",
    },
    caution: {
      ko: "너무 오래 판단을 유보하면 중요한 순간에 책임을 피하는 것처럼 보일 수 있습니다.",
      en: "If you suspend judgment too long, you may seem to avoid responsibility at important moments.",
    },
    friendLine: {
      ko: "너는 어느 편인지보다 이게 실제로 맞는지부터 묻는 사람 같아.",
      en: "You ask whether something actually works before asking which side it belongs to.",
    },
    conversationStyle: {
      ko: "양쪽의 우려를 먼저 정리하고, 기준을 세운 뒤 결론을 말할 때 설득력이 높습니다.",
      en: "You persuade best when you name both sides' concerns, set standards, and then state a conclusion.",
    },
    finalLine: {
      ko: "당신에게 정치란 편을 고르는 일보다 기준을 세우는 일에 가깝습니다.",
      en: "For you, politics is closer to setting standards than picking a side.",
    },
    accent: "#64748b",
  },
  {
    id: "practical-conservative",
    title: { ko: "실용 보수형", en: "Practical Conservative" },
    englishLabel: "Practical Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 보수 성향 실용", en: "Spectrum position: right-leaning pragmatic" },
    min: 11,
    max: 37,
    summary: {
      ko: "안정과 책임을 중시하되 필요한 변화는 실용적으로 받아들이는 성향입니다.",
      en: "You value stability and responsibility while accepting necessary change pragmatically.",
    },
    description: [
      {
        ko: "당신은 사회가 너무 빠르게 흔들리는 것을 경계합니다. 하지만 기존 방식이 효과를 잃었거나 현실과 맞지 않는다면 고칠 필요도 인정합니다.",
        en: "You are cautious about society changing too quickly, but you accept reform when old methods lose effect or no longer fit reality.",
      },
      {
        ko: "핵심은 책임과 지속 가능성입니다. 변화가 있더라도 감당 가능한 속도와 명확한 기준을 원합니다.",
        en: "Your core is responsibility and sustainability. Even when change is needed, you want manageable pace and clear standards.",
      },
    ],
    basis: {
      ko: "사회 안정, 책임, 비용, 지속 가능성, 검증된 절차를 기준으로 판단합니다.",
      en: "You judge through stability, responsibility, cost, sustainability, and tested procedure.",
    },
    strength: {
      ko: "좋은 의도만으로는 부족하다는 점을 짚고, 오래 버틸 수 있는 해법을 찾습니다.",
      en: "You point out that good intentions are not enough and look for solutions that can last.",
    },
    caution: {
      ko: "안정을 강조하다가 문제를 겪는 사람의 절박함이 작게 보이면 대화가 막힐 수 있습니다.",
      en: "If stability makes people's urgency seem small, conversation can stall.",
    },
    friendLine: {
      ko: "너는 바꾸더라도 먼저 망가지지 않는 방법을 찾는 사람이지.",
      en: "You want change only after finding a way not to break things.",
    },
    conversationStyle: {
      ko: "원칙과 비용을 말하기 전에 상대가 겪는 현실을 먼저 인정할 때 가장 좋습니다.",
      en: "You do best when you recognize others' reality before discussing principles and costs.",
    },
    finalLine: {
      ko: "당신에게 정치란 고쳐야 할 것과 지켜야 할 것을 함께 가르는 일입니다.",
      en: "For you, politics is separating what must be fixed from what must be protected.",
    },
    accent: "#f97316",
  },
  {
    id: "moderate-conservative",
    title: { ko: "온건 보수형", en: "Moderate Conservative" },
    englishLabel: "Moderate Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 중도 보수", en: "Spectrum position: center-right" },
    min: 38,
    max: 69,
    summary: {
      ko: "사회 안정, 책임, 질서를 중시하지만 대화와 조정의 여지를 남기는 성향입니다.",
      en: "You value stability, responsibility, and order while leaving room for dialogue and adjustment.",
    },
    description: [
      {
        ko: "당신은 자유와 복지도 중요하다고 보지만, 그것이 공동체의 책임감과 질서를 약하게 만들면 모두에게 비용이 생긴다고 느낍니다.",
        en: "You believe freedom and welfare can matter, but if they weaken responsibility and order, everyone pays a cost.",
      },
      {
        ko: "급격한 변화보다는 검증된 기준, 예측 가능한 절차, 공동체가 감당할 수 있는 속도를 선호합니다.",
        en: "You prefer tested standards, predictable procedure, and a pace society can absorb over rapid change.",
      },
    ],
    basis: {
      ko: "질서, 개인 책임, 공동체 신뢰, 제도 안정성을 기준으로 판단합니다.",
      en: "You judge through order, individual responsibility, social trust, and institutional stability.",
    },
    strength: {
      ko: "혼란 속에서도 기준을 세우고 변화의 부작용을 현실적으로 봅니다.",
      en: "You set standards during confusion and realistically assess side effects of change.",
    },
    caution: {
      ko: "기존 질서가 누군가에게 이미 불리한 구조일 수 있다는 점을 놓치면 방어적으로 보일 수 있습니다.",
      en: "If you miss that existing order can disadvantage some people, you may seem defensive.",
    },
    friendLine: {
      ko: "너는 갑자기 바꾸자는 말에 바로 브레이크를 거는 타입이야.",
      en: "You are the person who taps the brakes when someone says to change everything fast.",
    },
    conversationStyle: {
      ko: "책임, 질서, 지속 가능성을 차분히 비교하는 대화가 잘 맞습니다.",
      en: "Calm comparison around responsibility, order, and sustainability suits you.",
    },
    finalLine: {
      ko: "당신에게 정치란 사회가 무너지지 않게 고치는 기술입니다.",
      en: "For you, politics is the craft of repair without collapse.",
    },
    accent: "#ef4444",
  },
  {
    id: "strong-conservative",
    title: { ko: "강한 보수형", en: "Strong Conservative" },
    englishLabel: "Strong Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 강한 보수", en: "Spectrum position: far-right / conservative" },
    min: 70,
    max: 100,
    summary: {
      ko: "사회 안정, 책임, 질서, 전통적 가치를 강하게 우선하는 성향입니다.",
      en: "You strongly prioritize social stability, responsibility, order, and tradition.",
    },
    description: [
      {
        ko: "당신은 사회가 오래 쌓아온 규칙과 질서를 쉽게 흔들어서는 안 된다고 봅니다. 좋은 의도라도 책임감과 공동체 신뢰를 약하게 만들면 모두에게 손해가 된다고 느낍니다.",
        en: "You believe society should not easily shake rules and order built over time. Even good intentions can cause harm if they weaken responsibility and trust.",
      },
      {
        ko: "변화 요구가 커질수록 당신은 무엇이 사회를 지탱해왔는가를 먼저 묻고, 검증된 기준과 명확한 책임을 선호합니다.",
        en: "When calls for change grow louder, you first ask what has held society together and prefer tested standards and clear responsibility.",
      },
    ],
    basis: {
      ko: "질서 유지, 개인 책임, 전통적 규범, 국가와 제도의 안정성을 기준으로 판단합니다.",
      en: "You judge through order, individual responsibility, traditional norms, and institutional stability.",
    },
    strength: {
      ko: "혼란 속에서도 기준을 세우고 사회가 감당하기 어려운 변화 속도를 경계합니다.",
      en: "You set standards during confusion and guard against changes that society may not be able to absorb.",
    },
    caution: {
      ko: "안정을 중시하는 언어가 고통받는 사람의 현실을 작게 보이게 만들면 대화가 단절될 수 있습니다.",
      en: "If language of stability makes people's hardship seem small, conversation can break down.",
    },
    friendLine: {
      ko: "너는 질서가 무너지면 좋은 의도도 오래 못 간다고 보는 사람이야.",
      en: "You think even good intentions cannot last if order collapses.",
    },
    conversationStyle: {
      ko: "책임과 지속 가능성을 말하되, 상대가 말하는 현실적 피해를 먼저 인정할 때 더 설득력 있습니다.",
      en: "You do best when you discuss responsibility and sustainability while first recognizing the real harm others mention.",
    },
    finalLine: {
      ko: "당신에게 정치란 바꾸기 전에 무엇을 지켜야 하는지 묻는 일입니다.",
      en: "For you, politics asks what must be protected before anything is changed.",
    },
    accent: "#dc2626",
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
