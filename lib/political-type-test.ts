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

export type PoliticalChoice = {
  id: string;
  text: LocalizedText;
  score: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  dimensions: Partial<Record<PoliticalDimension, number>>;
};

export type PoliticalQuestion = {
  id: string;
  theme: string;
  prompt: LocalizedText;
  choices: PoliticalChoice[];
};

export type PoliticalAnswer = {
  questionId: string;
  choiceId: string;
  score: PoliticalChoice["score"];
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
    ko: "정당 지지나 투표 성향이 아니라, 자유, 질서, 공정, 복지, 책임, 변화 같은 사회적 가치를 어떻게 바라보는지 알아보는 테스트입니다.",
    en: "This test does not measure party support or voting intent. It looks at how you think about values like freedom, order, fairness, welfare, responsibility, and change.",
  },
  disclaimer: {
    ko: "이 테스트는 정당 지지나 투표 성향을 측정하지 않으며, 사회 이슈를 바라보는 가치관을 가볍게 읽어보기 위한 콘텐츠입니다.",
    en: "This test does not measure party support or voting intent. It is a light self-reflection tool about how you view social issues.",
  },
  start: { ko: "테스트 시작하기", en: "Start the test" },
  resultLabel: { ko: "나의 정치성향", en: "Your orientation" },
  share: { ko: "결과 공유하기", en: "Share result" },
  copied: { ko: "링크 복사됨", en: "Link copied" },
  retry: { ko: "다시 해보기", en: "Retake" },
  questionCount: { ko: "16문항", en: "16 questions" },
  time: { ko: "약 4분", en: "About 4 min" },
  valueBased: { ko: "가치 기반", en: "Value-based" },
} satisfies Record<string, LocalizedText>;

export const POLITICAL_SPECTRUM_LABELS = [
  { ko: "극좌", en: "Far left" },
  { ko: "진보", en: "Progressive" },
  { ko: "중도", en: "Center" },
  { ko: "보수", en: "Conservative" },
  { ko: "극우", en: "Far right" },
] satisfies LocalizedText[];

export const POLITICAL_QUESTIONS: PoliticalQuestion[] = [
  {
    id: "pt_01",
    theme: "freedom vs order",
    prompt: {
      ko: "동네에서 밤늦게까지 열리는 거리 축제를 두고 민원이 많습니다. 당신은 어떤 기준을 가장 중요하게 보나요?",
      en: "A neighborhood street festival runs late into the night and draws many complaints. What standard matters most to you?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "표현과 문화 활동의 자유가 우선이다. 불편은 대화와 보완으로 줄여야 한다.", en: "Freedom of expression and culture comes first; inconvenience should be reduced through dialogue and adjustments." },
        score: -3,
        dimensions: { freedomOrder: -3 },
      },
      {
        id: "b",
        text: { ko: "축제는 유지하되 시간, 소음, 동선 규칙을 더 섬세하게 정해야 한다.", en: "Keep the festival, but set clearer rules for hours, noise, and movement." },
        score: -1,
        dimensions: { freedomOrder: -1 },
      },
      {
        id: "c",
        text: { ko: "주민의 일상과 질서가 흔들리지 않도록 허가 기준을 더 엄격히 해야 한다.", en: "Make permits stricter so residents' daily lives and order are not disrupted." },
        score: 1,
        dimensions: { freedomOrder: 1 },
      },
      {
        id: "d",
        text: { ko: "공공장소에서는 공동체 규칙이 먼저다. 늦은 시간 행사는 강하게 제한해야 한다.", en: "Shared spaces need community rules first; late-night events should be strongly limited." },
        score: 3,
        dimensions: { freedomOrder: 3 },
      },
    ],
  },
  {
    id: "pt_02",
    theme: "equality vs competition",
    prompt: {
      ko: "교육 기회가 부족한 지역 학생들을 지원하는 새 제도가 논의됩니다. 어떤 방향이 더 설득력 있나요?",
      en: "A new policy is proposed to support students in under-resourced areas. Which direction feels most persuasive?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "출발선 차이를 줄이기 위해 추가 지원과 우선 배정이 필요하다.", en: "Extra support and priority allocation are needed to reduce starting-line gaps." },
        score: -3,
        dimensions: { individualSocial: -3 },
      },
      {
        id: "b",
        text: { ko: "지원은 필요하지만 선발의 공정성과 투명성도 함께 지켜야 한다.", en: "Support is needed, but fairness and transparency in selection must also be protected." },
        score: -1,
        dimensions: { individualSocial: -1 },
      },
      {
        id: "c",
        text: { ko: "기본 지원은 하되, 최종 기회는 개인의 노력과 성취를 중심으로 줘야 한다.", en: "Offer basic support, but final opportunities should focus on effort and achievement." },
        score: 1,
        dimensions: { individualSocial: 1 },
      },
      {
        id: "d",
        text: { ko: "경쟁 기준을 흐리면 전체 신뢰가 흔들린다. 동일한 기준을 유지해야 한다.", en: "If competition standards become unclear, trust weakens. Keep the same standards for everyone." },
        score: 3,
        dimensions: { individualSocial: 3 },
      },
    ],
  },
  {
    id: "pt_03",
    theme: "welfare vs market",
    prompt: {
      ko: "경기 침체로 생계가 흔들리는 가구가 늘고 있습니다. 정부의 역할은 어디까지여야 할까요?",
      en: "More households are becoming financially unstable during a downturn. How far should government support go?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "삶의 기본선은 사회가 함께 보장해야 한다. 복지 지출을 늘릴 수 있다.", en: "Society should guarantee a basic floor of life, even if welfare spending rises." },
        score: -3,
        dimensions: { welfareMarket: -3 },
      },
      {
        id: "b",
        text: { ko: "취약한 사람에게 집중 지원하고, 회복 이후 자립으로 이어지게 해야 한다.", en: "Focus support on vulnerable people and connect it to independence after recovery." },
        score: -1,
        dimensions: { welfareMarket: -1 },
      },
      {
        id: "c",
        text: { ko: "긴급 지원은 하되, 시장과 일자리 회복을 막지 않는 선이 중요하다.", en: "Emergency support is fine, but it should not slow market and job recovery." },
        score: 1,
        dimensions: { welfareMarket: 1 },
      },
      {
        id: "d",
        text: { ko: "지속적인 지원 확대는 의존과 부담을 만든다. 민간 활력 회복이 우선이다.", en: "Expanded ongoing support can create dependence and burden; restoring private-sector vitality comes first." },
        score: 3,
        dimensions: { welfareMarket: 3 },
      },
    ],
  },
  {
    id: "pt_04",
    theme: "change vs stability",
    prompt: {
      ko: "오래된 주거 지역을 빠르게 재개발하자는 제안이 나왔습니다. 당신의 판단에 가까운 것은?",
      en: "A proposal calls for fast redevelopment of an old residential area. Which judgment is closest to yours?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "낡은 구조를 바꾸지 않으면 불평등과 안전 문제가 계속된다. 과감한 변화가 필요하다.", en: "Without changing outdated structures, inequality and safety issues continue. Bold change is needed." },
        score: -3,
        dimensions: { changeStability: -3 },
      },
      {
        id: "b",
        text: { ko: "변화는 필요하지만 원주민 보호와 공공성 기준을 먼저 세워야 한다.", en: "Change is needed, but resident protection and public-interest standards should come first." },
        score: -1,
        dimensions: { changeStability: -1 },
      },
      {
        id: "c",
        text: { ko: "개선은 하되 지역의 생활 질서와 재산권이 갑자기 흔들리면 안 된다.", en: "Improve the area, but do not suddenly disrupt local routines and property rights." },
        score: 1,
        dimensions: { changeStability: 1 },
      },
      {
        id: "d",
        text: { ko: "급한 변화는 부작용이 크다. 안정적인 절차와 기존 공동체 보존이 우선이다.", en: "Fast change brings major side effects; stable procedure and preserving the existing community come first." },
        score: 3,
        dimensions: { changeStability: 3 },
      },
    ],
  },
  {
    id: "pt_05",
    theme: "individual responsibility vs social responsibility",
    prompt: {
      ko: "한 청년이 계속 일자리를 구하지 못하고 있습니다. 사회는 이 문제를 어떻게 봐야 할까요?",
      en: "A young person keeps failing to find work. How should society view this problem?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "개인의 문제로만 보면 구조가 보이지 않는다. 교육, 지역, 채용 관행을 함께 봐야 한다.", en: "If we see only the individual, we miss the structure. Education, region, and hiring practices matter too." },
        score: -3,
        dimensions: { individualSocial: -3 },
      },
      {
        id: "b",
        text: { ko: "구조적 지원과 개인의 준비가 같이 필요하다. 둘 중 하나만 말하면 부족하다.", en: "Structural support and individual preparation are both needed; either one alone is incomplete." },
        score: -1,
        dimensions: { individualSocial: -1 },
      },
      {
        id: "c",
        text: { ko: "환경의 영향은 있지만, 결국 선택과 꾸준함의 책임도 분명히 봐야 한다.", en: "Environment matters, but personal choices and consistency also need to be taken seriously." },
        score: 1,
        dimensions: { individualSocial: 1 },
      },
      {
        id: "d",
        text: { ko: "사회가 모든 실패를 대신 설명해줄 수 없다. 개인의 책임과 태도가 핵심이다.", en: "Society cannot explain every failure away. Personal responsibility and attitude are central." },
        score: 3,
        dimensions: { individualSocial: 3 },
      },
    ],
  },
  {
    id: "pt_06",
    theme: "security vs civil liberties",
    prompt: {
      ko: "범죄 예방을 위해 공공장소의 감시 장비와 데이터 활용을 늘리자는 제안이 있습니다.",
      en: "A proposal suggests expanding surveillance equipment and data use in public spaces to prevent crime.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "안전도 중요하지만 시민의 자유와 사생활 침해 위험을 더 엄격히 봐야 한다.", en: "Safety matters, but risks to civil liberties and privacy deserve stricter scrutiny." },
        score: -3,
        dimensions: { freedomOrder: -3 },
      },
      {
        id: "b",
        text: { ko: "필요한 경우만 제한적으로 쓰고, 감시 권한을 감시하는 장치가 있어야 한다.", en: "Use it only in limited cases, with oversight over surveillance power itself." },
        score: -1,
        dimensions: { freedomOrder: -1 },
      },
      {
        id: "c",
        text: { ko: "위험이 큰 곳에서는 안전을 위해 데이터 활용을 넓힐 수 있다.", en: "In higher-risk areas, data use can be expanded for public safety." },
        score: 1,
        dimensions: { freedomOrder: 1 },
      },
      {
        id: "d",
        text: { ko: "범죄를 막는 것이 먼저다. 규정만 명확하면 감시 인프라 확대가 필요하다.", en: "Preventing crime comes first; with clear rules, surveillance infrastructure should expand." },
        score: 3,
        dimensions: { freedomOrder: 3 },
      },
    ],
  },
  {
    id: "pt_07",
    theme: "tradition vs diversity",
    prompt: {
      ko: "학교 행사에서 전통적인 가족 형태만 전제로 한 프로그램이 논란이 됩니다.",
      en: "A school event program assumes only a traditional family structure and becomes controversial.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "다양한 가족과 삶의 형태가 존중되도록 프로그램을 적극적으로 바꿔야 한다.", en: "The program should actively change to respect diverse families and ways of life." },
        score: -3,
        dimensions: { changeStability: -2, individualSocial: -1 },
      },
      {
        id: "b",
        text: { ko: "누구도 배제되지 않도록 표현을 넓히되, 갈등을 키우지 않는 방식이 좋다.", en: "Broaden the language so no one is excluded, while avoiding unnecessary conflict." },
        score: -1,
        dimensions: { changeStability: -1 },
      },
      {
        id: "c",
        text: { ko: "배려는 필요하지만 오래 이어진 문화와 표현을 쉽게 문제 삼으면 안 된다.", en: "Consideration is needed, but long-standing culture and language should not be treated as wrong too easily." },
        score: 1,
        dimensions: { changeStability: 1 },
      },
      {
        id: "d",
        text: { ko: "전통적인 기준은 공동체를 묶는 역할을 한다. 급하게 바꾸기보다 지켜야 한다.", en: "Traditional standards help hold a community together; protect them rather than changing quickly." },
        score: 3,
        dimensions: { changeStability: 3 },
      },
    ],
  },
  {
    id: "pt_08",
    theme: "pragmatism vs ideology",
    prompt: {
      ko: "어떤 정책이 당신의 평소 가치관과 조금 다르지만 실제 효과가 좋아 보입니다.",
      en: "A policy differs somewhat from your usual values, but its practical effects look good.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "효과가 좋아도 기본 가치와 권리 원칙을 흔들면 쉽게 받아들이기 어렵다.", en: "Even with good effects, it is hard to accept if it weakens core values and rights." },
        score: -2,
        dimensions: { freedomOrder: -2 },
      },
      {
        id: "b",
        text: { ko: "원칙을 보완하면서도 실제 효과가 있다면 검토할 수 있다.", en: "If principles can be protected and the effect is real, it is worth considering." },
        score: -1,
        dimensions: { changeStability: -1 },
      },
      {
        id: "c",
        text: { ko: "이념보다 결과가 중요하다. 현장에서 작동한다면 시도해볼 수 있다.", en: "Results matter more than ideology. If it works in practice, try it." },
        score: 1,
        dimensions: { changeStability: 1 },
      },
      {
        id: "d",
        text: { ko: "정책은 사회의 기본 방향을 만든다. 익숙한 질서와 원칙을 쉽게 바꾸면 안 된다.", en: "Policy shapes society's direction. Familiar order and principles should not change easily." },
        score: 2,
        dimensions: { changeStability: 2 },
      },
    ],
  },
  {
    id: "pt_09",
    theme: "government intervention vs personal choice",
    prompt: {
      ko: "건강을 위해 특정 상품의 판매 방식이나 광고를 더 강하게 규제하자는 주장이 나옵니다.",
      en: "Some argue for stricter rules on how certain products are sold or advertised for public health.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "개인의 선택은 사회 환경의 영향을 받는다. 유해한 구조는 정부가 조정해야 한다.", en: "Personal choice is shaped by social conditions; harmful structures should be adjusted by government." },
        score: -3,
        dimensions: { welfareMarket: -2, freedomOrder: -1 },
      },
      {
        id: "b",
        text: { ko: "정보 표시와 취약층 보호처럼 명확한 부분부터 개입하는 것이 좋다.", en: "Start with clear interventions like information labels and protection for vulnerable groups." },
        score: -1,
        dimensions: { welfareMarket: -1 },
      },
      {
        id: "c",
        text: { ko: "정보는 제공하되 선택은 개인에게 남겨야 한다. 과한 규제는 피해야 한다.", en: "Provide information, but leave choices to individuals. Avoid excessive regulation." },
        score: 1,
        dimensions: { welfareMarket: 1 },
      },
      {
        id: "d",
        text: { ko: "국가가 생활 선택을 지나치게 관리하면 자유와 시장 모두 약해진다.", en: "If the state manages lifestyle choices too much, both freedom and markets weaken." },
        score: 3,
        dimensions: { welfareMarket: 3 },
      },
    ],
  },
  {
    id: "pt_10",
    theme: "fairness of opportunity vs fairness of outcome",
    prompt: {
      ko: "공공 장학금을 설계해야 합니다. 무엇이 더 공정한 방식일까요?",
      en: "You need to design a public scholarship. Which approach is fairer?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "결과가 계속 불평등하다면 지원 규모와 선발 기준을 바꿔야 한다.", en: "If outcomes remain unequal, change the scale of support and selection criteria." },
        score: -3,
        dimensions: { individualSocial: -3 },
      },
      {
        id: "b",
        text: { ko: "기회가 부족했던 학생에게 가산점을 주되, 기본 역량 기준은 유지한다.", en: "Give additional consideration to students with fewer opportunities while keeping basic ability standards." },
        score: -1,
        dimensions: { individualSocial: -1 },
      },
      {
        id: "c",
        text: { ko: "출발선은 돕더라도 최종 평가는 동일한 기준으로 하는 편이 공정하다.", en: "Help with the starting line, but final evaluation should use the same standard." },
        score: 1,
        dimensions: { individualSocial: 1 },
      },
      {
        id: "d",
        text: { ko: "공정은 같은 규칙에서 나온다. 결과 차이를 이유로 기준을 바꾸면 안 된다.", en: "Fairness comes from equal rules. Do not change standards because outcomes differ." },
        score: 3,
        dimensions: { individualSocial: 3 },
      },
    ],
  },
  {
    id: "pt_11",
    theme: "public safety vs personal freedom",
    prompt: {
      ko: "밤 시간 공원 이용을 제한하면 안전은 좋아질 수 있지만 시민 자유는 줄어듭니다.",
      en: "Restricting nighttime park use may improve safety but reduce personal freedom.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "공공공간은 시민의 자유로운 이용이 기본이다. 제한은 최후 수단이어야 한다.", en: "Free public use is the default for shared spaces. Restrictions should be a last resort." },
        score: -3,
        dimensions: { freedomOrder: -3 },
      },
      {
        id: "b",
        text: { ko: "위험 구역만 조명, 순찰, 안내를 보강하고 전면 제한은 피한다.", en: "Improve lighting, patrols, and guidance in risky areas, but avoid blanket restrictions." },
        score: -1,
        dimensions: { freedomOrder: -1 },
      },
      {
        id: "c",
        text: { ko: "반복 사고가 있다면 특정 시간대 제한은 현실적인 선택일 수 있다.", en: "If incidents repeat, limits during certain hours can be a realistic option." },
        score: 1,
        dimensions: { freedomOrder: 1 },
      },
      {
        id: "d",
        text: { ko: "안전이 확보되지 않은 자유는 오래 지속되기 어렵다. 질서 있는 제한이 필요하다.", en: "Freedom without safety is hard to sustain; orderly limits are needed." },
        score: 3,
        dimensions: { freedomOrder: 3 },
      },
    ],
  },
  {
    id: "pt_12",
    theme: "tax/welfare tradeoff",
    prompt: {
      ko: "복지 확대를 위해 세금을 더 걷자는 제안이 나왔습니다. 당신의 반응은?",
      en: "A proposal suggests raising taxes to expand welfare. What is your response?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "사회 안전망이 약하면 모두가 불안해진다. 부담을 나눠 더 넓게 보장해야 한다.", en: "Weak safety nets make everyone insecure. Share the burden and broaden protection." },
        score: -3,
        dimensions: { welfareMarket: -3 },
      },
      {
        id: "b",
        text: { ko: "증세가 가능하려면 대상, 효과, 낭비 방지 기준을 분명히 해야 한다.", en: "Tax increases are possible if targets, effects, and waste controls are clear." },
        score: -1,
        dimensions: { welfareMarket: -1 },
      },
      {
        id: "c",
        text: { ko: "필요한 복지는 인정하지만 세금 부담이 경제 의욕을 꺾지 않아야 한다.", en: "Necessary welfare is valid, but tax burden should not weaken economic motivation." },
        score: 1,
        dimensions: { welfareMarket: 1 },
      },
      {
        id: "d",
        text: { ko: "세금 확대는 신중해야 한다. 복지보다 성장과 효율을 먼저 회복해야 한다.", en: "Tax expansion needs caution. Growth and efficiency should recover before welfare expansion." },
        score: 3,
        dimensions: { welfareMarket: 3 },
      },
    ],
  },
  {
    id: "pt_13",
    theme: "labor/business balance",
    prompt: {
      ko: "플랫폼 노동자의 보호를 강화하면 기업 비용은 늘고 서비스 가격도 오를 수 있습니다.",
      en: "Stronger protection for platform workers may raise business costs and service prices.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "편리함이 노동자의 불안정 위에 서 있으면 안 된다. 보호 기준을 강화해야 한다.", en: "Convenience should not rest on worker insecurity. Protection standards should be strengthened." },
        score: -3,
        dimensions: { welfareMarket: -2, individualSocial: -1 },
      },
      {
        id: "b",
        text: { ko: "최소 보호를 보장하면서 업종별 부담을 단계적으로 조정해야 한다.", en: "Guarantee minimum protections and adjust burdens by industry in stages." },
        score: -1,
        dimensions: { welfareMarket: -1 },
      },
      {
        id: "c",
        text: { ko: "보호는 필요하지만 기업이 감당할 수 있어야 일자리도 유지된다.", en: "Protection is needed, but jobs remain only if businesses can handle the cost." },
        score: 1,
        dimensions: { welfareMarket: 1 },
      },
      {
        id: "d",
        text: { ko: "과한 규제는 일자리와 혁신을 줄인다. 시장의 자율 조정이 더 중요하다.", en: "Excessive regulation reduces jobs and innovation. Market adjustment matters more." },
        score: 3,
        dimensions: { welfareMarket: 3 },
      },
    ],
  },
  {
    id: "pt_14",
    theme: "education/opportunity",
    prompt: {
      ko: "사교육 격차를 줄이기 위해 학교 수업과 방과후 프로그램에 더 많은 예산을 투입하려 합니다.",
      en: "More budget may go into school classes and after-school programs to reduce private tutoring gaps.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "교육 격차는 세대 간 불평등으로 이어진다. 공교육 투자를 크게 늘려야 한다.", en: "Education gaps become intergenerational inequality. Public education investment should rise significantly." },
        score: -3,
        dimensions: { individualSocial: -2, welfareMarket: -1 },
      },
      {
        id: "b",
        text: { ko: "지원은 늘리되 성과를 확인하고 지역별로 필요한 곳에 집중해야 한다.", en: "Increase support, but track outcomes and focus on areas that need it most." },
        score: -1,
        dimensions: { individualSocial: -1 },
      },
      {
        id: "c",
        text: { ko: "공교육 개선은 좋지만 가정의 선택과 학교 간 경쟁도 존중해야 한다.", en: "Improving public education is good, but family choice and school competition should be respected." },
        score: 1,
        dimensions: { individualSocial: 1 },
      },
      {
        id: "d",
        text: { ko: "예산 투입보다 책임 있는 학습 태도와 학교 운영 효율이 먼저다.", en: "Responsible learning attitudes and efficient school management come before more spending." },
        score: 3,
        dimensions: { individualSocial: 3 },
      },
    ],
  },
  {
    id: "pt_15",
    theme: "social norms/culture",
    prompt: {
      ko: "새로운 문화적 표현이 빠르게 퍼지며 세대 간 불편함과 갈등이 생깁니다.",
      en: "A new cultural expression spreads quickly and creates discomfort between generations.",
    },
    choices: [
      {
        id: "a",
        text: { ko: "사회는 다양한 표현을 더 넓게 받아들이며 바뀌어야 한다.", en: "Society should change by accepting a wider range of expression." },
        score: -3,
        dimensions: { changeStability: -3 },
      },
      {
        id: "b",
        text: { ko: "새 표현을 인정하되 서로의 불편함을 설명할 수 있는 대화가 필요하다.", en: "Recognize new expression, but create dialogue where people can explain discomfort." },
        score: -1,
        dimensions: { changeStability: -1 },
      },
      {
        id: "c",
        text: { ko: "변화는 가능하지만 공동체가 오래 지켜온 예의와 기준도 존중해야 한다.", en: "Change is possible, but long-held manners and standards should also be respected." },
        score: 1,
        dimensions: { changeStability: 1 },
      },
      {
        id: "d",
        text: { ko: "사회 규범이 너무 빨리 흔들리면 혼란이 커진다. 검증된 기준을 지켜야 한다.", en: "If social norms shift too quickly, confusion grows. Proven standards should be protected." },
        score: 3,
        dimensions: { changeStability: 3 },
      },
    ],
  },
  {
    id: "pt_16",
    theme: "leadership and institutions",
    prompt: {
      ko: "위기 상황에서 리더와 제도는 어떤 모습이어야 한다고 생각하나요?",
      en: "In a crisis, what should leadership and institutions look like?",
    },
    choices: [
      {
        id: "a",
        text: { ko: "권력은 시민의 감시 아래 있어야 한다. 절차와 권리 보호가 위기 때 더 중요하다.", en: "Power must remain under civic oversight. Procedure and rights matter even more in crisis." },
        score: -3,
        dimensions: { freedomOrder: -2, changeStability: -1 },
      },
      {
        id: "b",
        text: { ko: "빠른 대응과 견제 장치가 함께 있어야 한다. 어느 한쪽만으로는 위험하다.", en: "Fast response and checks on power must coexist; either one alone is risky." },
        score: -1,
        dimensions: { freedomOrder: -1 },
      },
      {
        id: "c",
        text: { ko: "위기에는 일관된 지휘와 제도 신뢰가 중요하다. 사후 검증으로 보완할 수 있다.", en: "In crisis, consistent command and trust in institutions matter; later review can correct issues." },
        score: 1,
        dimensions: { freedomOrder: 1, changeStability: 1 },
      },
      {
        id: "d",
        text: { ko: "혼란을 막으려면 강한 책임자와 명확한 질서가 필요하다.", en: "To prevent disorder, strong leadership and clear order are needed." },
        score: 3,
        dimensions: { freedomOrder: 3, changeStability: 1 },
      },
    ],
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

const MAX_RAW_SCORE = POLITICAL_QUESTIONS.length * 3;
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
