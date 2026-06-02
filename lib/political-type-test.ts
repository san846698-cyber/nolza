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

export type PoliticalAgreementValue = 1 | 2 | 3 | 4 | 5;

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
};

export type PoliticalAnswer = {
  questionId: string;
  agreement: PoliticalAgreementValue;
  score: number;
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
  title: { ko: "???? ???", en: "Political Orientation Test" },
  subtitle: {
    ko: "?? ??? ?? ???? ?????",
    en: "What standards do you use to judge society?",
  },
  description: {
    ko: "?? ??? ?? ??? ???, ??, ??, ??, ??, ??, ?? ?? ??? ??? ??? ????? ???? ??????.",
    en: "This test does not measure party support or voting intent. It reads how strongly you agree with social values like freedom, order, fairness, welfare, responsibility, and change.",
  },
  disclaimer: {
    ko: "? ???? ?? ??? ?? ??? ???? ???, ?? ??? ???? ???? ??? ???? ?? ??????.",
    en: "This test does not measure party support or voting intent. It is a light self-reflection tool about how you view social issues.",
  },
  start: { ko: "??? ????", en: "Start the test" },
  resultLabel: { ko: "?? ????", en: "Your orientation" },
  share: { ko: "?? ????", en: "Share result" },
  copied: { ko: "?? ???", en: "Link copied" },
  retry: { ko: "?? ???", en: "Retake" },
  questionCount: { ko: "24??", en: "24 statements" },
  time: { ko: "? 5?", en: "About 5 min" },
  valueBased: { ko: "?? ??", en: "Agreement scale" },
} satisfies Record<string, LocalizedText>;

export const POLITICAL_AGREEMENT_OPTIONS: PoliticalAgreementOption[] = [
  { value: 1, label: { ko: "?? ???", en: "Strongly disagree" } },
  { value: 2, label: { ko: "???", en: "Disagree" } },
  { value: 3, label: { ko: "????", en: "Neutral" } },
  { value: 4, label: { ko: "???", en: "Agree" } },
  { value: 5, label: { ko: "?? ???", en: "Strongly agree" } },
] satisfies PoliticalAgreementOption[];

export const POLITICAL_SPECTRUM_LABELS = [
  { ko: "??", en: "Far left" },
  { ko: "??", en: "Progressive" },
  { ko: "??", en: "Center" },
  { ko: "??", en: "Conservative" },
  { ko: "??", en: "Far right" },
] satisfies LocalizedText[];

export const POLITICAL_QUESTIONS: PoliticalQuestion[] = [
  {
    id: "pt_01",
    theme: "tax/welfare tradeoff",
    statement: {
      ko: "??? ?? ?????? ??? ??? ???? ??? ????? ??.",
      en: "Even if taxes rise a little, systems that protect vulnerable people should be strengthened.",
    },
    direction: "progressive",
    dimension: "welfareMarket",
  },
  {
    id: "pt_02",
    theme: "freedom vs order",
    statement: {
      ko: "??? ??? ???? ?? ??? ??? ? ?????.",
      en: "The faster society changes, the more important basic order and rules become.",
    },
    direction: "conservative",
    dimension: "freedomOrder",
  },
  {
    id: "pt_03",
    theme: "tradition vs diversity",
    statement: {
      ko: "??? ??? ?????, ??? ?? ??? ????? ???? ??.",
      en: "Traditional values matter, but diverse ways of living should be institutionally recognized.",
    },
    direction: "progressive",
    dimension: "changeStability",
  },
  {
    id: "pt_04",
    theme: "welfare vs market",
    statement: {
      ko: "??? ??? ?? ?? ?????? ??? ??? ??? ???? ??.",
      en: "The state should respect the choices of individuals and businesses rather than intervening too much in markets.",
    },
    direction: "conservative",
    dimension: "welfareMarket",
  },
  {
    id: "pt_05",
    theme: "equality vs competition",
    statement: {
      ko: "??? ??? ?? ?? ??? ???, ???? ??? ???? ??.",
      en: "Competitive outcomes do not all need to be equal, but the starting line should be as fair as possible.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_06",
    theme: "change vs stability",
    statement: {
      ko: "??? ??? ?? ?? ???? ??? ?? ??? ?? ??.",
      en: "When social conflict grows, stability sometimes needs to come before change.",
    },
    direction: "conservative",
    dimension: "changeStability",
  },
  {
    id: "pt_07",
    theme: "education/opportunity",
    statement: {
      ko: "??? ??? ?? ???? ??? ?? ?? ???? ??? ??? ? ???? ??.",
      en: "Public systems should take more responsibility so education and opportunity do not vary greatly by family income or region.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_08",
    theme: "security vs civil liberties",
    statement: {
      ko: "?? ??? ????? ?? ??? ???? ?? ???? ? ??.",
      en: "For crime prevention, some limits on freedom can be acceptable.",
    },
    direction: "conservative",
    dimension: "freedomOrder",
  },
  {
    id: "pt_09",
    theme: "government intervention vs personal choice",
    statement: {
      ko: "??, ??, ???? ?? ?? ??? ??? ?? ??? ???? ??.",
      en: "For basics like housing, healthcare, and education, government should guarantee minimum standards.",
    },
    direction: "progressive",
    dimension: "welfareMarket",
  },
  {
    id: "pt_10",
    theme: "individual responsibility vs social responsibility",
    statement: {
      ko: "??? ? ??? ??? ???? ??? ? ?? ???? ??.",
      en: "People should be more responsible than society for the results of their own choices.",
    },
    direction: "conservative",
    dimension: "individualSocial",
  },
  {
    id: "pt_11",
    theme: "labor/business balance",
    statement: {
      ko: "??? ???? ????? ???? ???? ?? ??? ??? ??? ????.",
      en: "Business autonomy matters, but institutional protection is needed so workers do not lose bargaining power.",
    },
    direction: "progressive",
    dimension: "welfareMarket",
  },
  {
    id: "pt_12",
    theme: "culture/social norms",
    statement: {
      ko: "?? ??? ?? ??? ??? ????? ?? ? ??? ??? ???? ??.",
      en: "Long-standing social norms should be respected for their reasons and roles before being changed.",
    },
    direction: "conservative",
    dimension: "changeStability",
  },
  {
    id: "pt_13",
    theme: "security vs civil liberties",
    statement: {
      ko: "??? ??? ??? ???? ??? ? ??? ??.",
      en: "Freedom of expression matters most when it includes uncomfortable opinions.",
    },
    direction: "progressive",
    dimension: "freedomOrder",
  },
  {
    id: "pt_14",
    theme: "welfare vs market",
    statement: {
      ko: "??? ????? ?? ???? ??? ??? ??? ??? ?? ???? ??.",
      en: "Welfare is necessary, but it should require self-reliance and responsibility so it does not create long-term dependence.",
    },
    direction: "conservative",
    dimension: "individualSocial",
  },
  {
    id: "pt_15",
    theme: "fairness of outcome",
    statement: {
      ko: "??? ??? ??? ??? ??? ????? ?? ??? ?? ???? ??.",
      en: "Even if opportunities look fair, repeated outcome gaps mean the system itself should be re-examined.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_16",
    theme: "fairness of opportunity",
    statement: {
      ko: "???? ?? ??? ???? ???? ?? ???, ?? ?? ??? ??? ?? ??? ? ??.",
      en: "Fairness comes from applying the same rules to everyone, and standards should not change often because outcomes differ.",
    },
    direction: "conservative",
    dimension: "individualSocial",
  },
  {
    id: "pt_17",
    theme: "public safety vs personal freedom",
    statement: {
      ko: "?? ?? ??? ???? ??? ?? ??? ???? ??? ??.",
      en: "Public safety policies should be judged strictly for risks to privacy and civil rights.",
    },
    direction: "progressive",
    dimension: "freedomOrder",
  },
  {
    id: "pt_18",
    theme: "competition vs equality",
    statement: {
      ko: "??? ??? ????? ??? ???? ??? ?? ??? ????? ? ??.",
      en: "Competition is an important force for social progress and should not be weakened by excessive demands for equality.",
    },
    direction: "conservative",
    dimension: "welfareMarket",
  },
  {
    id: "pt_19",
    theme: "social responsibility",
    statement: {
      ko: "??? ?? ???? ??? ??, ??, ?? ?? ?? ??? ??? ??? ??.",
      en: "If failure is blamed only on individuals, structural causes like education, employment, and regional gaps are easily missed.",
    },
    direction: "progressive",
    dimension: "individualSocial",
  },
  {
    id: "pt_20",
    theme: "personal choice",
    statement: {
      ko: "??? ?? ???? ?? ??? ???? ???? ??? ??? ????.",
      en: "When the state manages lifestyles or consumption choices too much, individual freedom weakens.",
    },
    direction: "conservative",
    dimension: "freedomOrder",
  },
  {
    id: "pt_21",
    theme: "change vs stability",
    statement: {
      ko: "?? ??? ??? ???? ???? ???? ??? ??? ??? ? ??.",
      en: "Outdated institutions sometimes need bold change, even with conflict, for society to move forward.",
    },
    direction: "progressive",
    dimension: "changeStability",
  },
  {
    id: "pt_22",
    theme: "tax/market tradeoff",
    statement: {
      ko: "??? ??? ??? ??? ??? ?? ????? ? ??? ??? ???.",
      en: "Lower taxes and broader private choice create a healthier society in the long run.",
    },
    direction: "conservative",
    dimension: "welfareMarket",
  },
  {
    id: "pt_23",
    theme: "diversity/social norms",
    statement: {
      ko: "?? ??? ???? ?? ??? ???? ?? ??? ??? ? ??? ??.",
      en: "Social institutions should be able to protect minority lives in practice, not only the average way of living.",
    },
    direction: "progressive",
    dimension: "changeStability",
  },
  {
    id: "pt_24",
    theme: "pragmatism vs principle",
    statement: {
      ko: "??? ?? ???? ??? ??, ?? ??, ??? ???? ? ????.",
      en: "In policy, tested procedure, budget responsibility, and long-term stability matter more than good intentions.",
    },
    direction: "conservative",
    dimension: "changeStability",
  },
];

export const POLITICAL_RESULTS: PoliticalResult[] = [
  {
    id: "strong-progressive",
    title: { ko: "강한 진보형", en: "Strong Progressive" },
    englishLabel: "Strong Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 강한 진보", en: "Spectrum position: far-left / progressive" },
    min: -100,
    max: -65,
    summary: {
      ko: "변화와 평등을 강하게 중시하는 타입입니다.",
      en: "You strongly prioritize change and equality.",
    },
    description: [
      {
        ko: "당신은 사회 문제가 개인의 선택만으로 설명되지 않는다고 보는 편입니다. 출발선, 제도, 권력의 불균형, 소수자의 권리처럼 잘 보이지 않는 구조를 먼저 살피고, 불평등이 반복된다면 사회가 적극적으로 개입해야 한다고 느낍니다.",
        en: "You tend not to explain social problems through individual choice alone. You look first at starting lines, institutions, power imbalances, and rights that may be easy to overlook.",
      },
      {
        ko: "이 성향은 변화를 미루는 말에 쉽게 설득되지 않습니다. 누군가에게는 급진적으로 보일 수 있지만, 당신에게 중요한 것은 이미 불편을 겪는 사람들의 현실을 더 이상 ‘나중 문제’로 두지 않는 것입니다.",
        en: "This orientation is not easily persuaded by calls to delay change. Others may see it as intense, but for you the key is not treating people's current hardship as a future issue.",
      },
    ],
    basis: {
      ko: "사회의 약한 지점, 권리 보호, 구조적 불평등, 빠른 제도 개선을 기준으로 판단합니다.",
      en: "You judge through vulnerable points in society, rights protection, structural inequality, and institutional reform.",
    },
    strength: {
      ko: "소외된 사람의 관점을 놓치지 않고, 당연하게 여겨진 규칙을 다시 질문하는 힘이 있습니다.",
      en: "You notice overlooked people and question rules others may treat as natural.",
    },
    caution: {
      ko: "변화의 방향이 옳아 보여도 실행 과정의 부담, 속도, 반발을 과소평가하면 설득력이 약해질 수 있습니다.",
      en: "Even when change is justified, underestimating costs, pace, and resistance can weaken persuasion.",
    },
    friendLine: {
      ko: "“너는 누가 빠져 있는지 제일 먼저 보는 사람 같아.”",
      en: "\"You are the first person to notice who is being left out.\"",
    },
    conversationStyle: {
      ko: "가치와 권리의 원칙을 분명히 말하되, 상대가 걱정하는 현실적 비용도 숫자와 사례로 함께 다루는 방식이 잘 맞습니다.",
      en: "State values and rights clearly, then address practical costs with examples and numbers.",
    },
    finalLine: {
      ko: "당신에게 정치는 멈춘 세상을 조금 더 공정하게 움직이게 하는 일입니다.",
      en: "For you, politics is about moving a stalled society toward fairness.",
    },
    accent: "#2563eb",
  },
  {
    id: "moderate-progressive",
    title: { ko: "온건 진보형", en: "Moderate Progressive" },
    englishLabel: "Moderate Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 중도 진보", en: "Spectrum position: center-left" },
    min: -64,
    max: -35,
    summary: {
      ko: "사회 변화와 약자 보호를 중시하지만 현실적인 균형도 함께 보는 타입입니다.",
      en: "You value social change and protection for vulnerable people while keeping practical balance in view.",
    },
    description: [
      {
        ko: "당신은 사회가 개인에게만 책임을 돌리면 중요한 원인을 놓친다고 봅니다. 복지, 교육, 노동, 다양성 같은 이슈에서 제도적 보완이 필요하다는 쪽에 마음이 기울지만, 변화가 실제로 작동하는 방식도 중요하게 봅니다.",
        en: "You think society misses important causes when it places responsibility only on individuals. You lean toward institutional support while still caring about how change works in practice.",
      },
      {
        ko: "그래서 당신의 진보성은 구호보다 설계에 가깝습니다. 바꿔야 할 것은 바꾸되, 기준과 절차를 세워 반발을 줄이고 오래 지속되는 변화를 만드는 쪽을 선호합니다.",
        en: "Your progressivism is closer to design than slogans. You prefer changes that come with standards and procedures so they can last.",
      },
    ],
    basis: {
      ko: "약자 보호, 기회 보정, 제도 개선, 실현 가능한 속도를 함께 기준으로 삼습니다.",
      en: "You judge through protection, opportunity correction, institutional improvement, and feasible pace.",
    },
    strength: {
      ko: "원칙과 현실 사이에서 다리를 놓으며, 급한 갈등을 정책 언어로 정리할 수 있습니다.",
      en: "You bridge principles and reality, turning conflicts into policy language.",
    },
    caution: {
      ko: "균형을 잡으려다 핵심 가치가 흐려지면, 강한 입장을 기대하는 사람에게는 답답하게 보일 수 있습니다.",
      en: "If balance blurs your core values, people expecting a strong stance may find you hesitant.",
    },
    friendLine: {
      ko: "“너는 바꾸자는 쪽인데, 어떻게 바꿀지도 같이 묻는 스타일이야.”",
      en: "\"You want change, but you also ask how to make it work.\"",
    },
    conversationStyle: {
      ko: "문제 제기와 실행 계획을 함께 말할 때 설득력이 가장 큽니다.",
      en: "You are most persuasive when you pair problem-framing with an implementation plan.",
    },
    finalLine: {
      ko: "당신에게 정치는 더 나은 방향으로 천천히, 그러나 분명히 옮겨가는 과정입니다.",
      en: "For you, politics is a steady movement toward a better direction.",
    },
    accent: "#3b82f6",
  },
  {
    id: "practical-progressive",
    title: { ko: "실용 진보형", en: "Practical Progressive" },
    englishLabel: "Practical Progressive",
    spectrumPosition: { ko: "스펙트럼 위치: 진보 성향 실용", en: "Spectrum position: left-leaning pragmatic" },
    min: -34,
    max: -15,
    summary: {
      ko: "실제 효과를 보면서도 사회적 책임과 개선을 중요하게 보는 타입입니다.",
      en: "You care about practical effects while still valuing social responsibility and improvement.",
    },
    description: [
      {
        ko: "당신은 대체로 사회가 더 공정해져야 한다는 쪽에 가깝습니다. 다만 모든 문제를 큰 이념으로만 풀기보다, 지금 작동할 수 있는 해법과 실제로 도움이 되는 변화를 먼저 확인하려 합니다.",
        en: "You generally lean toward a fairer society, but you do not want every problem solved only through big ideology. You first check what can work now.",
      },
      {
        ko: "이 성향은 진보적 문제의식과 현실 감각을 같이 갖습니다. 누군가에게는 ‘조금 조심스러운 진보’처럼 보일 수 있지만, 당신은 효과 없는 옳은 말보다 작게라도 움직이는 개선을 더 신뢰합니다.",
        en: "This orientation combines progressive concerns with practical realism. You may look cautious, but you trust small working improvements more than correct words with no effect.",
      },
    ],
    basis: {
      ko: "개선 가능성, 정책 효과, 약자 보호, 사회적 비용의 균형을 기준으로 판단합니다.",
      en: "You judge through improvement potential, policy effect, protection, and social cost.",
    },
    strength: {
      ko: "갈등이 큰 주제에서도 ‘그래서 지금 무엇을 할 수 있는가’를 묻는 현실 감각이 있습니다.",
      en: "You ask what can be done now, even on heated issues.",
    },
    caution: {
      ko: "효과를 중시하다 보면 가치의 방향을 충분히 설명하지 못해, 입장이 애매하다는 말을 들을 수 있습니다.",
      en: "Because you focus on effect, you may not explain your values clearly enough and can seem ambiguous.",
    },
    friendLine: {
      ko: "“너는 진보 쪽인데, 말보다 작동하는 해법을 더 따지는 편이야.”",
      en: "\"You lean progressive, but you care more about workable fixes than slogans.\"",
    },
    conversationStyle: {
      ko: "논쟁보다 사례, 데이터, 단계적 개선안을 중심으로 이야기할 때 잘 맞습니다.",
      en: "You do best with examples, data, and step-by-step improvements rather than abstract debate.",
    },
    finalLine: {
      ko: "당신에게 정치는 완벽한 답보다 실제로 나아지는 장면을 만드는 일입니다.",
      en: "For you, politics is less about perfect answers and more about visible improvement.",
    },
    accent: "#0ea5e9",
  },
  {
    id: "centrist-pragmatist",
    title: { ko: "중도 실용형", en: "Centrist Pragmatist" },
    englishLabel: "Centrist Pragmatist",
    spectrumPosition: { ko: "스펙트럼 위치: 중도", en: "Spectrum position: center" },
    min: -14,
    max: 14,
    summary: {
      ko: "좌우 어느 한쪽보다 상황과 결과를 기준으로 판단하는 타입입니다.",
      en: "You judge more by context and outcome than by either side of the spectrum.",
    },
    description: [
      {
        ko: "당신은 정치적 입장을 정할 때 진영보다 실제 효과를 먼저 봅니다. 어떤 정책이 진보적으로 보여도 현실성이 부족하다고 느끼면 쉽게 동의하지 않고, 보수적으로 보여도 사회 안정에 필요하다고 판단하면 받아들일 수 있습니다.",
        en: "When forming a political view, you look at real effects before camps. If a progressive-looking policy lacks realism you hesitate, and if a conservative-looking policy supports stability you may accept it.",
      },
      {
        ko: "이런 성향은 갈등이 큰 이슈에서 균형감을 만들어주지만, 때로는 주변 사람들에게 입장이 모호해 보일 수 있습니다. 당신에게 중요한 것은 어느 편에 서는가보다, 실제로 괜찮은 결과를 만드는가에 더 가깝습니다.",
        en: "This can bring balance to divisive issues, but it may look unclear to people who want a firm side. What matters to you is whether the result works.",
      },
    ],
    basis: {
      ko: "상황, 비용, 효과, 균형, 지속 가능성을 기준으로 판단합니다.",
      en: "You judge through context, cost, effect, balance, and sustainability.",
    },
    strength: {
      ko: "진영 언어에 덜 휘둘리고, 서로 다른 입장의 장단점을 비교하는 능력이 있습니다.",
      en: "You are less pulled by camp language and can compare strengths and weaknesses across views.",
    },
    caution: {
      ko: "너무 중립을 지키려 하면 분명한 피해나 불공정 앞에서도 판단을 늦춘다는 인상을 줄 수 있습니다.",
      en: "If you protect neutrality too much, you may seem slow to judge clear harm or unfairness.",
    },
    friendLine: {
      ko: "“너는 어느 쪽이냐보다 이게 실제로 되냐를 먼저 묻는 사람이지.”",
      en: "\"You ask whether it actually works before asking which side it belongs to.\"",
    },
    conversationStyle: {
      ko: "찬반 토론보다 조건부 판단, 비교표, 현실적 대안 정리가 잘 맞습니다.",
      en: "Conditional judgment, comparison tables, and realistic alternatives fit you better than pure pro/con debate.",
    },
    finalLine: {
      ko: "당신에게 정치는 깃발보다 판단력을 요구하는 현실의 문제입니다.",
      en: "For you, politics is a real-world problem that asks for judgment more than flags.",
    },
    accent: "#64748b",
  },
  {
    id: "practical-conservative",
    title: { ko: "실용 보수형", en: "Practical Conservative" },
    englishLabel: "Practical Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 보수 성향 실용", en: "Spectrum position: right-leaning pragmatic" },
    min: 15,
    max: 34,
    summary: {
      ko: "안정과 현실성을 중시하지만 필요한 변화에도 열려 있는 타입입니다.",
      en: "You value stability and realism while remaining open to necessary change.",
    },
    description: [
      {
        ko: "당신은 사회가 너무 빠르게 바뀔 때 생기는 부작용을 중요하게 봅니다. 제도, 시장, 공동체 규범은 쉽게 흔들면 안 된다고 느끼지만, 문제가 반복되고 실질적 개선책이 분명하다면 변화 자체를 거부하지는 않습니다.",
        en: "You pay attention to side effects when society changes too quickly. Institutions, markets, and norms should not be shaken lightly, but you do not reject change when problems repeat and solutions are clear.",
      },
      {
        ko: "이 성향은 보수적 안정감과 실용적 조정력을 함께 가집니다. 당신은 ‘지키자’는 말만큼 ‘무엇을 어떻게 고치면 부담이 적은가’도 중요하게 생각합니다.",
        en: "This orientation combines conservative stability with practical adjustment. For you, protecting what works and improving with limited disruption belong together.",
      },
    ],
    basis: {
      ko: "사회 안정, 실행 가능성, 개인 책임, 점진적 개선을 기준으로 판단합니다.",
      en: "You judge through social stability, feasibility, personal responsibility, and gradual improvement.",
    },
    strength: {
      ko: "정책의 의도보다 실제 부담과 부작용을 먼저 점검해 무리한 결정을 막는 힘이 있습니다.",
      en: "You check burdens and side effects before intentions, helping prevent rushed decisions.",
    },
    caution: {
      ko: "조심스러움이 커지면 이미 어려움을 겪는 사람에게 변화가 너무 늦게 도착할 수 있습니다.",
      en: "If caution grows too strong, change may arrive too late for people already struggling.",
    },
    friendLine: {
      ko: "“너는 보수 쪽이지만 필요한 건 고치자는 말도 꽤 빨리 하는 편이야.”",
      en: "\"You lean conservative, but you still say we should fix what really needs fixing.\"",
    },
    conversationStyle: {
      ko: "큰 구호보다 리스크, 예산, 단계, 책임 소재가 분명한 대화가 잘 맞습니다.",
      en: "You prefer clear discussion of risk, budget, stages, and responsibility over broad slogans.",
    },
    finalLine: {
      ko: "당신에게 정치는 흔들지 말아야 할 것과 고쳐야 할 것을 가르는 일입니다.",
      en: "For you, politics is separating what should be protected from what should be repaired.",
    },
    accent: "#f97316",
  },
  {
    id: "moderate-conservative",
    title: { ko: "온건 보수형", en: "Moderate Conservative" },
    englishLabel: "Moderate Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 중도 보수", en: "Spectrum position: center-right" },
    min: 35,
    max: 64,
    summary: {
      ko: "질서와 전통을 중요하게 보지만 극단적인 대립은 원하지 않는 타입입니다.",
      en: "You value order and tradition while avoiding extreme confrontation.",
    },
    description: [
      {
        ko: "당신은 사회가 유지되는 데 필요한 규칙, 책임, 신뢰를 중요하게 봅니다. 복지나 변화도 필요할 수 있지만, 그것이 개인의 노력, 공동체 질서, 시장의 활력을 약하게 만들면 오래가기 어렵다고 느낍니다.",
        en: "You value the rules, responsibility, and trust that keep society functioning. Welfare or change may be needed, but you worry when they weaken effort, order, or economic vitality.",
      },
      {
        ko: "당신의 보수성은 무조건적인 반대라기보다 신중함에 가깝습니다. 익숙한 제도와 문화가 가진 안정감을 중요하게 여기고, 새로운 시도는 검증과 책임을 거친 뒤 받아들이는 편입니다.",
        en: "Your conservatism is closer to caution than automatic opposition. You value the stability of familiar systems and culture, accepting new attempts after proof and responsibility.",
      },
    ],
    basis: {
      ko: "질서, 책임, 전통, 시장 활력, 검증된 절차를 기준으로 판단합니다.",
      en: "You judge through order, responsibility, tradition, market vitality, and tested procedure.",
    },
    strength: {
      ko: "변화의 속도와 부작용을 현실적으로 보고, 공동체가 감당할 수 있는 기준을 찾습니다.",
      en: "You realistically assess the pace and side effects of change and look for standards society can handle.",
    },
    caution: {
      ko: "기존 질서가 누군가에게는 이미 불리한 구조일 수 있다는 점을 놓치면 방어적으로 보일 수 있습니다.",
      en: "If you miss that existing order can already disadvantage some people, you may seem defensive.",
    },
    friendLine: {
      ko: "“너는 갑자기 바꾸자는 말에 바로 브레이크를 거는 타입이야.”",
      en: "\"You are the person who taps the brakes when someone says to change everything fast.\"",
    },
    conversationStyle: {
      ko: "원칙, 책임, 장기적 안정성을 중심으로 차분하게 비교하는 대화가 잘 맞습니다.",
      en: "Calm comparison around principles, responsibility, and long-term stability suits you.",
    },
    finalLine: {
      ko: "당신에게 정치는 사회가 무너지지 않게 고치는 기술입니다.",
      en: "For you, politics is the craft of repair without collapse.",
    },
    accent: "#ef4444",
  },
  {
    id: "strong-conservative",
    title: { ko: "강한 보수형", en: "Strong Conservative" },
    englishLabel: "Strong Conservative",
    spectrumPosition: { ko: "스펙트럼 위치: 강한 보수", en: "Spectrum position: far-right / conservative" },
    min: 65,
    max: 100,
    summary: {
      ko: "사회 안정, 책임, 질서, 전통의 가치를 강하게 중시하는 타입입니다.",
      en: "You strongly prioritize social stability, responsibility, order, and tradition.",
    },
    description: [
      {
        ko: "당신은 사회가 오래 쌓아온 규칙과 질서를 쉽게 흔들어서는 안 된다고 봅니다. 자유와 복지는 중요할 수 있지만, 그것이 책임감과 공동체 신뢰를 약하게 만들면 결국 모두에게 손해가 된다고 느낍니다.",
        en: "You believe society should not easily shake rules and order built over time. Freedom and welfare can matter, but if they weaken responsibility and trust, everyone eventually pays the cost.",
      },
      {
        ko: "이 성향은 강한 안정 지향을 가집니다. 변화 요구가 많아질수록 당신은 ‘무엇이 사회를 지탱해왔는가’를 먼저 묻고, 빠른 변화보다 검증된 기준과 분명한 책임을 선호합니다.",
        en: "This orientation has a strong stability focus. When calls for change grow louder, you first ask what has held society together and prefer tested standards and clear responsibility.",
      },
    ],
    basis: {
      ko: "질서 유지, 개인 책임, 전통적 규범, 국가와 제도의 안정성을 기준으로 판단합니다.",
      en: "You judge through order, individual responsibility, traditional norms, and institutional stability.",
    },
    strength: {
      ko: "혼란 속에서도 기준을 세우고, 사회가 감당할 수 없는 속도의 변화를 경계하는 힘이 있습니다.",
      en: "You set standards during confusion and guard against changes that society may not be able to absorb.",
    },
    caution: {
      ko: "안정을 중시하는 언어가 고통받는 사람의 현실을 작게 보이게 만들면, 대화가 단절될 수 있습니다.",
      en: "If language of stability makes people's hardship seem small, conversation can break down.",
    },
    friendLine: {
      ko: "“너는 질서가 무너지면 좋은 의도도 오래 못 간다고 보는 사람이야.”",
      en: "\"You think even good intentions cannot last if order collapses.\"",
    },
    conversationStyle: {
      ko: "책임, 질서, 지속 가능성을 분명히 말하되, 상대가 말하는 피해의 현실도 먼저 인정할 때 잘 맞습니다.",
      en: "You do best when you clearly discuss responsibility and sustainability while first recognizing the real harm others mention.",
    },
    finalLine: {
      ko: "당신에게 정치는 바꾸기 전에 무엇을 지켜야 하는지 묻는 일입니다.",
      en: "For you, politics asks what must be protected before anything is changed.",
    },
    accent: "#dc2626",
  },
];

const MAX_STATEMENT_SCORE = 2;
const MAX_RAW_SCORE = POLITICAL_QUESTIONS.reduce(
  (sum, question) => sum + (question.weight ?? 1) * MAX_STATEMENT_SCORE,
  0,
);
const RESULT_ORDER = POLITICAL_RESULTS.map((result) => result.id);

export function localized(locale: "ko" | "en", copy: LocalizedText): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export function normalizePoliticalScore(rawScore: number): number {
  return Math.max(-100, Math.min(100, Math.round((rawScore / MAX_RAW_SCORE) * 100)));
}

export function spectrumPercent(score: number): number {
  return Math.max(0, Math.min(100, (score + 100) / 2));
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
  const agreementOffset = agreement - 3;
  const directionMultiplier =
    question.direction === "progressive" ? -1 : question.direction === "conservative" ? 1 : 0;
  const score = agreementOffset * directionMultiplier * (question.weight ?? 1);

  return {
    questionId: question.id,
    agreement,
    score,
    dimensions: {
      [question.dimension]: score,
    },
  };
}

export function calculatePoliticalResult(answers: PoliticalAnswer[]): {
  rawScore: number;
  normalizedScore: number;
  result: PoliticalResult;
  dimensions: Record<PoliticalDimension, number>;
} {
  const dimensions: Record<PoliticalDimension, number> = {
    freedomOrder: 0,
    welfareMarket: 0,
    changeStability: 0,
    individualSocial: 0,
  };

  const rawScore = answers.reduce((sum, answer) => {
    for (const [dimension, value] of Object.entries(answer.dimensions) as Array<[PoliticalDimension, number]>) {
      dimensions[dimension] += value;
    }
    return sum + answer.score;
  }, 0);

  const normalizedScore = normalizePoliticalScore(rawScore);

  return {
    rawScore,
    normalizedScore,
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
