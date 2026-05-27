// ═══════════════════════════════════════════════════════════
// Attachment Style Test
// 25 questions · 4 dimensions · 4 types · serious/fun mode
// ═══════════════════════════════════════════════════════════

export type Dimension = "anxiety" | "avoidance" | "dependency" | "trust";
export type AttachmentTypeId = "secure" | "anxious" | "avoidant" | "disorganized";

export type Question = {
  id: number;
  ko: string;
  en: string;
  /** Soft, emotional sub-prompt shown beneath the question (per-question). */
  subKo: string;
  subEn: string;
  dim: Dimension;
};

export type AttachmentTypeText = {
  name: string;
  serious: string;
  strengths: string[];
  watchOut: string;
  fun: string;
  shareText: string;
};

export type AttachmentType = {
  id: AttachmentTypeId;
  emoji: string;
  color: string;
  bg: string;
  ko: AttachmentTypeText;
  en: AttachmentTypeText;
};

// ═══════════════════════════════════════════════════════════
// Questions (25)
// ═══════════════════════════════════════════════════════════

export const QUESTIONS: Question[] = [
  {
    id: 1,
    dim: "anxiety",
    ko: "가까운 사람이 평소보다 조용하면, 오늘 나를 대하는 마음이 달라졌는지 먼저 신경 쓰인다",
    en: "When someone close is quieter than usual, I first wonder whether their feeling toward me changed today",
    subKo: "상대의 작은 반응이 내 안정감에 얼마나 영향을 주나요",
    subEn: "How much do small reactions affect your sense of safety?",
  },
  {
    id: 2,
    dim: "avoidance",
    ko: "친한 사람이 갑자기 더 깊은 이야기를 나누려 하면, 고맙지만 한 걸음 물러서고 싶어진다",
    en: "When someone close suddenly wants a deeper conversation, I appreciate it but want to step back",
    subKo: "가까움이 편안함인지 부담인지 살펴보세요",
    subEn: "Notice whether closeness feels comforting or heavy",
  },
  {
    id: 3,
    dim: "anxiety",
    ko: "좋은 시간을 보낸 뒤에도, 헤어진 후 답장이 차분하면 내가 뭔가 실수했는지 되짚게 된다",
    en: "Even after a warm time together, a calmer reply afterward makes me replay whether I did something wrong",
    subKo: "좋았던 장면 뒤에도 확인이 필요한지 살펴보세요",
    subEn: "Notice whether you still need reassurance after a good moment",
  },
  {
    id: 4,
    dim: "avoidance",
    ko: "내가 힘든 일을 말하려는 순간, 괜히 분위기가 무거워질까 봐 말을 줄인다",
    en: "When I am about to share something hard, I say less because it might make the mood heavy",
    subKo: "마음을 꺼내는 속도가 관계마다 다를 수 있어요",
    subEn: "Everyone opens up at a different pace",
  },
  {
    id: 5,
    dim: "anxiety",
    ko: "상대방이 다정하게 대해도, 그 마음이 오래 갈지 확인하고 싶어진다",
    en: "Even when they are kind, I want reassurance that the feeling will last",
    subKo: "안정감은 순간보다 지속성에서 오기도 해요",
    subEn: "Security often comes from consistency, not one moment",
  },
  {
    id: 6,
    dim: "avoidance",
    ko: "가까운 사람과 좋은 시간을 보낸 뒤에도, 혼자 회복할 시간이 꼭 필요하다",
    en: "Even after a good time with someone close, I need time alone to recover",
    subKo: "혼자 있는 시간이 관계를 피하는 것과 같지는 않아요",
    subEn: "Alone time is not always avoidance",
  },
  {
    id: 7,
    dim: "dependency",
    ko: "중요한 일이 생기면 혼자 정리하기보다 상대방과 먼저 나누고 싶다",
    en: "When something important happens, I want to share it with them before sorting it out alone",
    subKo: "기댄다는 것은 연결을 확인하는 방식일 수 있어요",
    subEn: "Leaning can be a way of feeling connected",
  },
  {
    id: 8,
    dim: "avoidance",
    ko: "관계가 좋아질수록 기대가 커지는 게 부담스러워 일부러 마음을 조금 낮춘다",
    en: "As a relationship gets better, I lower my expectations because bigger hopes feel risky",
    subKo: "기대를 낮추는 마음도 나를 지키려는 움직임이에요",
    subEn: "Lowering expectations can be a protective move",
  },
  {
    id: 9,
    dim: "anxiety",
    ko: "서운한 일이 생기면, 관계가 괜찮다는 말을 직접 듣고 나서야 마음이 놓인다",
    en: "When I feel hurt, I relax only after hearing directly that the relationship is okay",
    subKo: "확인은 때로 마음을 다시 연결하는 신호가 돼요",
    subEn: "Reassurance can feel like a signal of reconnection",
  },
  {
    id: 10,
    dim: "anxiety",
    ko: "내가 먼저 연락하는 일이 계속되면, 나만 관계를 붙잡고 있는 것처럼 느껴질 때가 있다",
    en: "When I keep reaching out first, I sometimes feel like I am the only one holding the relationship",
    subKo: "관계의 균형감이 안정감에 영향을 줄 수 있어요",
    subEn: "A sense of balance can affect security",
  },
  {
    id: 11,
    dim: "dependency",
    ko: "가까운 사람이 원하면 내 계획을 바꾸는 일이 자연스럽게 느껴진다",
    en: "When someone close wants something, changing my own plans can feel natural",
    subKo: "맞춰주는 마음과 내 리듬 사이를 살펴보세요",
    subEn: "Notice the line between adjusting and losing your rhythm",
  },
  {
    id: 12,
    dim: "anxiety",
    ko: "상대방의 기분이 가라앉아 보이면, 내 하루의 분위기도 같이 무거워진다",
    en: "When they seem down, my own day also starts to feel heavy",
    subKo: "가까운 관계에서는 감정의 거리가 짧아질 수 있어요",
    subEn: "In close relationships, emotional distance can feel shorter",
  },
  {
    id: 13,
    dim: "trust",
    ko: "갈등이 생겨도 서로 진심을 확인하면 다시 가까워질 수 있다고 느낀다",
    en: "Even after conflict, I feel we can become close again if we understand each other's sincerity",
    subKo: "갈등 이후 다시 연결되는 방식을 떠올려보세요",
    subEn: "Think about how reconnection works after conflict",
  },
  {
    id: 14,
    dim: "avoidance",
    ko: "상대방이 나를 더 많이 알고 싶어 할수록, 어느 정도는 감춰두고 싶어진다",
    en: "The more they want to know me, the more I want to keep some parts private",
    subKo: "가까움에도 나만의 속도가 필요할 수 있어요",
    subEn: "Closeness may still need your own pace",
  },
  {
    id: 15,
    dim: "trust",
    ko: "상대방이 잠시 서툴게 행동해도, 한 번의 일로 관계 전체를 판단하지는 않는다",
    en: "Even if they act clumsily once, I do not judge the whole relationship by that one moment",
    subKo: "안정감은 한 장면보다 전체 흐름을 보게 해요",
    subEn: "Security helps you see the whole flow, not one scene",
  },
  {
    id: 16,
    dim: "trust",
    ko: "내가 원하는 거리나 도움이 있을 때, 상대방에게 비교적 분명하게 말할 수 있다",
    en: "When I need space or support, I can usually say it clearly",
    subKo: "관계 안에서 필요한 것을 말하는 힘을 봅니다",
    subEn: "This looks at how you name what you need",
  },
  {
    id: 17,
    dim: "anxiety",
    ko: "상대방이 다른 관계에 마음을 많이 쓰는 것 같으면, 내 자리가 줄어든 것처럼 느껴진다",
    en: "When they seem deeply invested elsewhere, I feel my place with them has become smaller",
    subKo: "내 자리의 감각이 안정감과 연결될 수 있어요",
    subEn: "A sense of your place can connect to security",
  },
  {
    id: 18,
    dim: "trust",
    ko: "도움이 필요할 때 부탁해도 관계가 부담스러워지지 않을 거라고 느낀다",
    en: "When I need help, I feel asking will not make the relationship too heavy",
    subKo: "기댈 수 있다는 믿음은 관계의 중요한 안정감이에요",
    subEn: "Being able to lean is a key kind of security",
  },
  {
    id: 19,
    dim: "avoidance",
    ko: "상대방이 감정적으로 자주 기대오면, 잘 받아주고 싶어도 숨이 막히는 느낌이 든다",
    en: "When they often lean on me emotionally, I want to be there but start feeling suffocated",
    subKo: "돌봐주고 싶은 마음과 내 공간 사이의 긴장입니다",
    subEn: "This is the tension between care and space",
  },
  {
    id: 20,
    dim: "avoidance",
    ko: "관계가 안정적이어도 내 일정과 공간은 따로 지켜져야 편하다",
    en: "Even when a relationship is stable, I feel better when my own schedule and space are protected",
    subKo: "독립감이 있어야 가까움도 편해질 수 있어요",
    subEn: "Independence can make closeness feel easier",
  },
  {
    id: 21,
    dim: "anxiety",
    ko: "갈등이 생기면, 상대방이 멀어질까 봐 내가 먼저 맞추려는 마음이 커진다",
    en: "When conflict happens, I feel a strong urge to adjust first so they do not pull away",
    subKo: "갈등 후 연결을 회복하려는 방식이 드러나요",
    subEn: "This shows how you try to reconnect after conflict",
  },
  {
    id: 22,
    dim: "anxiety",
    ko: "상대의 말투나 연락 패턴이 달라지면, 직접 확인하지 않으면 마음이 오래 불편하다",
    en: "When their tone or contact pattern changes, I stay uneasy unless I check directly",
    subKo: "불안할 때 직접 확인해야 안정되는지 봅니다",
    subEn: "Notice whether direct checking is what restores security",
  },
  {
    id: 23,
    dim: "trust",
    ko: "상대방이 바쁘거나 지쳐 있어도, 기본적으로 내 편이라는 감각은 유지된다",
    en: "Even when they are busy or tired, I can still feel they are basically on my side",
    subKo: "상황과 관계 자체를 구분할 수 있는지 살펴보세요",
    subEn: "This looks at separating the situation from the relationship",
  },
  {
    id: 24,
    dim: "dependency",
    ko: "마음이 무거운 날에는 혼자 버티기보다 가까운 사람에게 기대고 싶다",
    en: "On emotionally heavy days, I want to lean on someone close rather than carry it alone",
    subKo: "확인받을 때 안정되는지, 혼자 회복되는지 떠올려보세요",
    subEn: "Do you stabilize through reassurance or by recovering alone?",
  },
  {
    id: 25,
    dim: "trust",
    ko: "친밀감이 깊어질수록 나를 숨기기보다 조금씩 더 편하게 보여줄 수 있다",
    en: "As intimacy deepens, I can gradually show myself more comfortably instead of hiding",
    subKo: "깊어지는 관계가 부담인지 안정인지 느껴보세요",
    subEn: "Notice whether deeper closeness feels safe or burdensome",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

// ═══════════════════════════════════════════════════════════
// Likert (7-point) — only endpoint labels are shown
// ═══════════════════════════════════════════════════════════

export const LIKERT_MAX = 7;
export const LIKERT_MID = 4;

export const LIKERT_ENDPOINT_KO = ["전혀 아니다", "매우 그렇다"];
export const LIKERT_ENDPOINT_EN = ["Strongly disagree", "Strongly agree"];

// Each scale point's color — red → gray → blue
export const LIKERT_COLORS: string[] = [
  "#ef4444",
  "#f97316",
  "#fb923c",
  "#d1d5db",
  "#60a5fa",
  "#3b82f6",
  "#1d4ed8",
];

// ═══════════════════════════════════════════════════════════
// Target — who the user is thinking of
// ═══════════════════════════════════════════════════════════

export type TargetId = "partner" | "friend" | "parent";

export type TargetMeta = {
  id: TargetId;
  emoji: string;
  ko: { title: string; subtitle: string; noun: string; relation: string };
  en: { title: string; subtitle: string; noun: string; relation: string };
};

export const TARGETS: Record<TargetId, TargetMeta> = {
  partner: {
    id: "partner",
    emoji: "💕",
    ko: {
      title: "연인 / 배우자",
      subtitle: "현재 또는 가장 최근 연인",
      noun: "연인",
      relation: "연인 관계",
    },
    en: {
      title: "Partner / Spouse",
      subtitle: "Your current or most recent partner",
      noun: "partner",
      relation: "romantic relationships",
    },
  },
  friend: {
    id: "friend",
    emoji: "🫂",
    ko: {
      title: "가장 친한 친구",
      subtitle: "지금 가장 가까운 친구",
      noun: "친구",
      relation: "친구 관계",
    },
    en: {
      title: "Best friend",
      subtitle: "Your closest friend right now",
      noun: "best friend",
      relation: "close friendships",
    },
  },
  parent: {
    id: "parent",
    emoji: "👪",
    ko: {
      title: "부모님",
      subtitle: "더 가깝게 느껴지는 분",
      noun: "부모님",
      relation: "부모님과의 관계",
    },
    en: {
      title: "Parent",
      subtitle: "Whichever feels closer",
      noun: "parent",
      relation: "your relationship with your parent",
    },
  },
};

export const TARGET_ORDER: TargetId[] = ["partner", "friend", "parent"];

// Detect whether a Hangul noun ends in a vowel (no batchim).
function endsInVowel(noun: string): boolean {
  const last = noun[noun.length - 1];
  if (!last) return false;
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 === 0;
}

function withParticle(
  noun: string,
  particle: "이가" | "은는" | "을를",
): string {
  const vowel = endsInVowel(noun);
  if (particle === "이가") return noun + (vowel ? "가" : "이");
  if (particle === "은는") return noun + (vowel ? "는" : "은");
  return noun + (vowel ? "를" : "을");
}

export function applyTargetKo(text: string, target: TargetId): string {
  const noun = TARGETS[target].ko.noun;
  return text
    .replace(/상대방이/g, withParticle(noun, "이가"))
    .replace(/상대방은/g, withParticle(noun, "은는"))
    .replace(/상대방을/g, withParticle(noun, "을를"))
    .replace(/상대방의/g, `${noun}의`)
    .replace(/상대방에게/g, `${noun}에게`)
    .replace(/상대방/g, noun);
}

export function applyTargetEn(text: string, target: TargetId): string {
  const noun = TARGETS[target].en.noun;
  return text
    .replace(/my partner's/g, `my ${noun}'s`)
    .replace(/my partner/g, `my ${noun}`)
    .replace(/your partner's/g, `your ${noun}'s`)
    .replace(/your partner/g, `your ${noun}`);
}

export function applyTarget(
  question: Question,
  target: TargetId,
  locale: "ko" | "en",
): string {
  return locale === "ko"
    ? applyTargetKo(question.ko, target)
    : applyTargetEn(question.en, target);
}

export function applyTargetToSubtext(
  question: Question,
  target: TargetId,
  locale: "ko" | "en",
): string {
  return locale === "ko"
    ? applyTargetKo(question.subKo, target)
    : applyTargetEn(question.subEn, target);
}

// ═══════════════════════════════════════════════════════════
// Types (4)
// ═══════════════════════════════════════════════════════════

export const TYPES: Record<AttachmentTypeId, AttachmentType> = {
  secure: {
    id: "secure",
    emoji: "🟢",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    ko: {
      name: "안정감을 느끼면 깊이 연결되는 타입",
      serious: `당신은 관계가 흔들려도 한 장면만으로 전체를 판단하지 않으려는 편입니다. 가까운 사람이 잠시 서툴거나 바빠도, 기본적인 신뢰가 유지되면 마음이 크게 흔들리지 않습니다.

가까워지는 것도, 혼자 있는 것도 비교적 자연스럽게 받아들입니다. 갈등이 생겨도 관계가 끝났다고 느끼기보다 다시 연결할 방법을 찾으려 합니다.

이 결과는 완벽하다는 뜻이 아닙니다. 당신도 때로 불안하고, 때로는 혼자 있고 싶을 수 있어요. 다만 관계의 안정감을 회복하는 속도가 비교적 빠른 편에 가깝습니다.`,
      strengths: [
        "감정 표현이 자연스러워요",
        "갈등을 건강하게 해결해요",
        "상대방을 신뢰하고 신뢰받아요",
        "혼자와 함께, 둘 다 괜찮아요",
      ],
      watchOut:
        "상대방이 관계의 안정감을 자주 확인해야 하는 사람이라면, 당신의 차분함이 때로는 무심함처럼 보일 수 있어요. 내 리듬만 믿기보다 상대가 안심하는 방식을 함께 살펴보는 것이 좋습니다.",
      fun: `안정형.
관계가 잠깐 삐끗해도 바로 끝장이라고 보진 않음.
혼자 있을 때도 괜찮고, 같이 있을 때도 괜찮음.
가까움이 안정감으로 느껴지는 쪽.`,
      shareText: `나의 애착 유형: 안정감을 느끼면 깊이 연결되는 타입 🟢
'가까움이 편하고, 갈등 후에도 다시 연결하려는 편.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Deeply Connected When Secure",
      serious: `You tend not to judge an entire relationship by one imperfect moment. If basic trust remains, a quiet day or awkward moment does not immediately shake your sense of connection.

Closeness and alone time can both feel natural. When conflict happens, you are more likely to look for a way back into connection than assume the relationship is broken.

This does not mean you are perfect. You can still feel anxious or need space. It simply suggests you recover a sense of relational safety relatively well.`,
      strengths: [
        "Natural emotional expression",
        "Healthy conflict resolution",
        "Trust and be trusted",
        "Comfortable alone and together",
      ],
      watchOut:
        "If someone close needs frequent reassurance, your calm may sometimes read as indifference. It can help to notice what helps them feel safe too.",
      fun: `Secure type.
Doesn't treat one awkward moment as the end.
Fine alone, fine together.
Closeness feels like safety.`,
      shareText: `My attachment style: Deeply Connected When Secure 🟢
'Closeness feels safe, and conflict can reconnect.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
  anxious: {
    id: "anxious",
    emoji: "🔴",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    ko: {
      name: "가까워지고 싶지만 확인이 필요한 타입",
      serious: `당신은 가까운 관계에서 상대의 온도 변화에 민감한 편입니다. 다정한 순간이 있어도 그 마음이 계속 이어질지 확인하고 싶어질 수 있어요.

상대가 잠시 조용해지거나 관계의 리듬이 달라지면, 마음속 안정감이 흔들릴 수 있습니다. 그래서 직접적인 말, 반복되는 다정함, 관계가 괜찮다는 신호가 중요하게 느껴집니다.

이건 사랑을 못 믿는다는 뜻이 아니라, 연결이 끊기지 않았다는 감각을 자주 확인해야 마음이 편해지는 쪽에 가깝다는 뜻입니다.`,
      strengths: [
        "감정이 풍부하고 깊이 사랑해요",
        "관계에 온 마음을 다해요",
        "상대방의 감정 변화를 잘 감지해요",
        "헌신적이에요",
      ],
      watchOut:
        "확인이 필요할 때마다 바로 묻기보다, 먼저 내가 무엇 때문에 불안해졌는지 한 번만 구체적으로 이름 붙여보세요. 그러면 상대에게도 더 정확하게 말할 수 있습니다.",
      fun: `불안형.
괜찮다는 말 한마디에 마음이 확 놓임.
다정함이 좋고, 지속되는 다정함은 더 좋음.
연결되어 있다는 감각이 중요한 타입.`,
      shareText: `나의 애착 유형: 가까워지고 싶지만 확인이 필요한 타입 🔴
'연결되어 있다는 신호가 있어야 마음이 놓이는 편.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Close, But Needs Reassurance",
      serious: `You are sensitive to changes in warmth and rhythm. Even after kind moments, you may want to know whether that care will continue.

When someone close becomes quiet or the relationship rhythm shifts, your sense of safety can shake. Direct words, consistent kindness, and signals that the relationship is okay matter a lot.

This does not mean you cannot trust love. It means you feel steadier when connection is made visible and repeated.`,
      strengths: [
        "Rich emotions, loves deeply",
        "Fully committed to relationships",
        "Perceptive of partner's emotional shifts",
        "Deeply devoted",
      ],
      watchOut:
        "Before asking for reassurance immediately, try naming what made you feel unsafe. It can make your request clearer and easier to receive.",
      fun: `Anxious type.
A simple 'we're okay' can settle everything.
Kindness is good.
Consistent kindness is better.`,
      shareText: `My attachment style: Close, But Needs Reassurance 🔴
'I feel safe when connection is clear.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
  avoidant: {
    id: "avoidant",
    emoji: "🔵",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    ko: {
      name: "혼자만의 거리가 있어야 편한 타입",
      serious: `당신은 가까운 관계에서도 자기만의 공간과 속도가 필요합니다. 상대를 싫어해서가 아니라, 너무 빠른 친밀감이 오면 마음이 먼저 긴장할 수 있어요.

감정을 바로 꺼내기보다 혼자 정리한 뒤 말하는 편일 수 있습니다. 상대가 자주 기대오면 잘 받아주고 싶으면서도 내 리듬이 사라지는 느낌이 들 수 있습니다.

이 결과는 차갑다는 뜻이 아닙니다. 가까워지는 속도를 직접 조절해야 관계가 더 편안해지는 쪽에 가깝습니다.`,
      strengths: [
        "독립적이고 자기 의존적이에요",
        "감정에 휩쓸리지 않아요",
        "자신만의 공간과 취미가 있어요",
        "냉정하게 상황을 볼 수 있어요",
      ],
      watchOut:
        "혼자 정리할 시간이 필요하다면 그냥 사라지기보다, '잠깐 생각할 시간이 필요해'처럼 짧게 알려주는 것이 관계를 덜 불안하게 만듭니다.",
      fun: `회피형.
좋아해도 내 공간은 필요함.
깊은 얘기는 천천히 해야 편함.
속도 조절이 있어야 오래 가까워지는 타입.`,
      shareText: `나의 애착 유형: 혼자만의 거리가 있어야 편한 타입 🔵
'내 속도가 지켜질 때 더 오래 가까워지는 편.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Needs Space To Feel Close",
      serious: `You need your own pace and space even in close relationships. It is not that you dislike connection; fast intimacy can simply make your system tense.

You may prefer to process feelings alone before speaking. When someone leans on you often, you may want to be there but also feel your own rhythm disappearing.

This does not mean you are cold. It means closeness feels safer when you can control the pace.`,
      strengths: [
        "Independent and self-reliant",
        "Not swept away by emotions",
        "Has own space and interests",
        "Can assess situations calmly",
      ],
      watchOut:
        "If you need time alone, saying 'I need a little time to think' can protect both your space and the other person's sense of safety.",
      fun: `Avoidant type.
Likes closeness, but slowly.
Needs space to stay present.
Pace matters more than intensity.`,
      shareText: `My attachment style: Needs Space To Feel Close 🔵
'I stay closer when my pace is respected.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
  disorganized: {
    id: "disorganized",
    emoji: "🟣",
    color: "#9333ea",
    bg: "rgba(147,51,234,0.08)",
    ko: {
      name: "가까움과 독립 사이를 오가는 타입",
      serious: `당신은 가까워지고 싶은 마음과 내 공간을 지키고 싶은 마음이 함께 움직일 수 있습니다. 어느 날은 더 연결되고 싶고, 어느 날은 같은 가까움이 부담스럽게 느껴질 수 있어요.

상대의 반응이 따뜻하면 안심되지만, 친밀감이 너무 빠르게 깊어지면 다시 속도를 늦추고 싶어질 수 있습니다. 그래서 관계 안에서 확인과 거리 조절이 번갈아 필요할 때가 있습니다.

이 결과는 모순적이라는 뜻이 아닙니다. 당신에게는 연결의 욕구와 자기 보호의 욕구가 동시에 중요하다는 뜻에 가깝습니다.`,
      strengths: [
        "감정의 깊이가 남달라요",
        "공감 능력이 뛰어나요",
        "복잡한 감정을 이해해요",
        "변화하려는 의지가 강해요",
      ],
      watchOut:
        "마음이 갑자기 가까워졌다가 멀어질 때는, 지금 필요한 것이 확인인지 휴식인지 먼저 구분해보세요. 그 한 문장이 관계의 혼란을 줄여줄 수 있습니다.",
      fun: `혼란형.
가까워지고 싶음.
근데 내 공간도 필요함.
확인받고 싶다가도 갑자기 숨 쉴 틈이 필요해짐.
속도 조절이 핵심.`,
      shareText: `나의 애착 유형: 가까움과 독립 사이를 오가는 타입 🟣
'연결되고 싶지만, 내 속도도 지키고 싶은 편.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Between Closeness And Independence",
      serious: `Your desire for closeness and your need for space can move at the same time. Some days you want more connection; other days the same closeness can feel like too much.

Warm responses can soothe you, but if intimacy deepens too quickly, you may want to slow the pace again. Reassurance and space can both feel necessary.

This does not mean you are contradictory. It means connection and self-protection both matter strongly to you.`,
      strengths: [
        "Extraordinary emotional depth",
        "Strong empathy",
        "Understands complexity",
        "Strong desire to grow and change",
      ],
      watchOut:
        "When you suddenly want to move closer or pull back, try naming whether you need reassurance or rest. That single distinction can reduce confusion.",
      fun: `Disorganized type.
Wants closeness.
Also needs air.
Reassurance and space both matter.
The pace is everything.`,
      shareText: `My attachment style: Between Closeness And Independence 🟣
'I want connection, but I need my pace too.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
};

export const TYPE_ORDER: AttachmentTypeId[] = [
  "secure",
  "anxious",
  "avoidant",
  "disorganized",
];

// ═══════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════

export type Scores = Record<Dimension, number>; // average 1-5

export function computeScores(answers: number[]): Scores {
  const sum: Record<Dimension, number> = {
    anxiety: 0,
    avoidance: 0,
    dependency: 0,
    trust: 0,
  };
  const count: Record<Dimension, number> = {
    anxiety: 0,
    avoidance: 0,
    dependency: 0,
    trust: 0,
  };
  QUESTIONS.forEach((q, i) => {
    const a = answers[i];
    if (typeof a === "number" && a >= 1 && a <= LIKERT_MAX) {
      sum[q.dim] += a;
      count[q.dim] += 1;
    }
  });
  return {
    anxiety: count.anxiety > 0 ? sum.anxiety / count.anxiety : LIKERT_MID,
    avoidance: count.avoidance > 0 ? sum.avoidance / count.avoidance : LIKERT_MID,
    dependency: count.dependency > 0 ? sum.dependency / count.dependency : LIKERT_MID,
    trust: count.trust > 0 ? sum.trust / count.trust : LIKERT_MID,
  };
}

export function determineType(scores: Scores): AttachmentTypeId {
  const highAnx = scores.anxiety >= LIKERT_MID;
  const highAvo = scores.avoidance >= LIKERT_MID;
  if (!highAnx && !highAvo) return "secure";
  if (highAnx && !highAvo) return "anxious";
  if (!highAnx && highAvo) return "avoidant";
  return "disorganized";
}

// match% — how clearly the user fits the type's archetypal corner
export function computeMatch(scores: Scores, type: AttachmentTypeId): number {
  const ideals: Record<AttachmentTypeId, [number, number]> = {
    secure: [1, 1],
    anxious: [LIKERT_MAX, 1],
    avoidant: [1, LIKERT_MAX],
    disorganized: [LIKERT_MAX, LIKERT_MAX],
  };
  const [ax, av] = ideals[type];
  const dx = scores.anxiety - ax;
  const dy = scores.avoidance - av;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const span = LIKERT_MAX - 1; // 6 for 7-point scale
  const maxDist = Math.sqrt(2 * span * span); // diagonal of full grid
  const pct = 100 - (dist / maxDist) * 65;
  return Math.max(35, Math.min(99, Math.round(pct)));
}

// ═══════════════════════════════════════════════════════════
// Compatibility (10 unique pairings)
// ═══════════════════════════════════════════════════════════

export type Compatibility = {
  rating: 1 | 2 | 3 | 4 | 5;
  ko: string;
  en: string;
};

function pairKey(a: AttachmentTypeId, b: AttachmentTypeId): string {
  const order = TYPE_ORDER;
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  return ai <= bi ? `${a}-${b}` : `${b}-${a}`;
}

const COMPAT_TABLE: Record<string, Compatibility> = {
  "secure-secure": {
    rating: 5,
    ko: "이상적인 조합. 서로 안정감을 줘요.",
    en: "Ideal match. Both bring calm and security.",
  },
  "secure-anxious": {
    rating: 4,
    ko: "안정형이 불안형을 안심시켜줄 수 있어요. 근데 안정형이 지치지 않게 주의해요.",
    en: "Secure can soothe anxious. Just watch that secure doesn't get drained.",
  },
  "secure-avoidant": {
    rating: 4,
    ko: "안정형의 여유가 회피형이 열릴 공간을 만들어줘요.",
    en: "Secure's calm gives avoidant the space to slowly open up.",
  },
  "secure-disorganized": {
    rating: 3,
    ko: "안정형의 일관성이 혼란형에게 큰 도움이 돼요.",
    en: "Secure's steadiness can be a lifeline for disorganized.",
  },
  "anxious-anxious": {
    rating: 2,
    ko: "둘 다 확인을 원하는데 줄 사람이 없어요.",
    en: "Both want reassurance. Neither can give enough of it.",
  },
  "anxious-avoidant": {
    rating: 1,
    ko: "가장 흔하고 가장 힘든 조합. 불안형이 다가올수록 회피형이 물러나요.",
    en: "The classic painful pair. The closer anxious gets, the further avoidant pulls.",
  },
  "anxious-disorganized": {
    rating: 2,
    ko: "감정이 격렬해요. 서로 상처를 줄 수 있어요.",
    en: "Intense emotions on both sides. Mutual wounds are easy to make.",
  },
  "avoidant-avoidant": {
    rating: 3,
    ko: "서로 공간을 존중해요. 근데 너무 멀어질 수 있어요.",
    en: "Respect for each other's space. But you might just drift apart.",
  },
  "avoidant-disorganized": {
    rating: 2,
    ko: "회피형의 거리두기가 혼란형의 불안을 자극해요.",
    en: "Avoidant's distance triggers disorganized's deepest fears.",
  },
  "disorganized-disorganized": {
    rating: 1,
    ko: "카오스. 근데 서로를 가장 깊이 이해해요.",
    en: "Chaos. But also the deepest mutual understanding.",
  },
};

export function getCompatibility(
  a: AttachmentTypeId,
  b: AttachmentTypeId,
): Compatibility {
  return COMPAT_TABLE[pairKey(a, b)];
}
