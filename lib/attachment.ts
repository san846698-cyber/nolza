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
    ko: "상대방이 나를 떠날까봐 걱정될 때가 있다",
    en: "I sometimes worry that my partner will leave me",
    subKo: "두려움도 사랑의 일부일 때가 있어요",
    subEn: "Fear can be part of love sometimes",
  },
  {
    id: 2,
    dim: "avoidance",
    ko: "너무 가까워지면 불편하게 느껴진다",
    en: "Getting too close feels uncomfortable",
    subKo: "거리감은 자기 보호의 한 형태예요",
    subEn: "Distance is a form of self-protection",
  },
  {
    id: 3,
    dim: "anxiety",
    ko: "상대방이 답장이 늦으면 불안해진다",
    en: "I get anxious when my partner is slow to reply",
    subKo: "기다림 속에서 마음이 어떻게 움직이나요",
    subEn: "How does your heart move while waiting",
  },
  {
    id: 4,
    dim: "avoidance",
    ko: "감정을 표현하는 게 어렵게 느껴진다",
    en: "Expressing my emotions feels difficult",
    subKo: "표현하지 못한 감정도 진짜예요",
    subEn: "Unspoken feelings are still real",
  },
  {
    id: 5,
    dim: "anxiety",
    ko: "상대방이 나를 정말 좋아하는지 확신이 안 설 때가 많다",
    en: "I'm often unsure whether my partner really likes me",
    subKo: "확신은 어디에서 오는 걸까요",
    subEn: "Where does certainty come from",
  },
  {
    id: 6,
    dim: "avoidance",
    ko: "혼자 있는 게 편하다",
    en: "I feel comfortable being alone",
    subKo: "지금 이 순간, 솔직하게 답해주세요",
    subEn: "Be honest with yourself in this moment",
  },
  {
    id: 7,
    dim: "dependency",
    ko: "상대방에게 내 모든 것을 보여주고 싶다",
    en: "I want to show my partner everything about me",
    subKo: "나를 보여준다는 것의 무게",
    subEn: "The weight of being fully seen",
  },
  {
    id: 8,
    dim: "avoidance",
    ko: "상대방이 나를 실망시킬까봐 처음부터 기대를 안 한다",
    en: "I avoid getting my hopes up so I won't be disappointed",
    subKo: "기대하지 않는 것도 사랑하는 방식일까",
    subEn: "Is avoiding hope a way of loving",
  },
  {
    id: 9,
    dim: "anxiety",
    ko: "사랑받고 있다는 확신이 자주 필요하다",
    en: "I often need reassurance that I'm loved",
    subKo: "확인받고 싶은 마음은 자연스러워요",
    subEn: "Needing reassurance is natural",
  },
  {
    id: 10,
    dim: "anxiety",
    ko: "상대방이 나를 원하는 것보다 내가 상대방을 더 원한다고 느낀다",
    en: "I feel like I want them more than they want me",
    subKo: "사랑의 균형은 늘 흔들려요",
    subEn: "Love's balance always shifts",
  },
  {
    id: 11,
    dim: "dependency",
    ko: "관계에서 나를 잃는 것 같은 느낌이 들 때가 있다",
    en: "Sometimes I feel like I lose myself in relationships",
    subKo: "사랑 속에서 나는 어디에 있나요",
    subEn: "Where are you within love",
  },
  {
    id: 12,
    dim: "anxiety",
    ko: "상대방의 기분에 내 기분이 크게 영향을 받는다",
    en: "My partner's mood strongly affects my mood",
    subKo: "감정은 함께 흐르는 강물이에요",
    subEn: "Emotions flow like a shared river",
  },
  {
    id: 13,
    dim: "trust",
    ko: "진정으로 나를 이해해줄 사람이 있을 거라 믿는다",
    en: "I believe someone who truly understands me exists",
    subKo: "믿음은 작은 문에서 시작돼요",
    subEn: "Trust begins with a small door",
  },
  {
    id: 14,
    dim: "avoidance",
    ko: "상대방이 가까이 오려 할 때 물러서고 싶어진다",
    en: "When someone tries to get close, I want to step back",
    subKo: "물러서는 것도 본능이에요",
    subEn: "Pulling back is also instinct",
  },
  {
    id: 15,
    dim: "trust",
    ko: "관계가 잘 될 거라는 믿음이 있다",
    en: "I believe relationships can work out",
    subKo: "희망은 답이 아닌 자세예요",
    subEn: "Hope is a stance, not an answer",
  },
  {
    id: 16,
    dim: "trust",
    ko: "내 필요와 감정을 상대방에게 솔직하게 말할 수 있다",
    en: "I can honestly tell my partner what I need and feel",
    subKo: "솔직함에는 용기가 필요해요",
    subEn: "Honesty takes courage",
  },
  {
    id: 17,
    dim: "anxiety",
    ko: "상대방이 다른 사람과 친하게 지내면 불안해진다",
    en: "I feel anxious when my partner is close with others",
    subKo: "질투는 사랑의 그림자예요",
    subEn: "Jealousy is love's shadow",
  },
  {
    id: 18,
    dim: "trust",
    ko: "도움이 필요할 때 상대방에게 편하게 말할 수 있다",
    en: "I can comfortably ask my partner for help",
    subKo: "기대는 것도 사랑의 한 모습이에요",
    subEn: "Leaning on someone is also love",
  },
  {
    id: 19,
    dim: "avoidance",
    ko: "상대방이 너무 의존하면 숨이 막힌다",
    en: "When my partner is too dependent, I feel suffocated",
    subKo: "내 공간을 지키고 싶은 마음",
    subEn: "Wanting your own space",
  },
  {
    id: 20,
    dim: "avoidance",
    ko: "혼자서도 충분히 행복할 수 있다",
    en: "I can be perfectly happy on my own",
    subKo: "혼자의 시간은 나를 알아가는 시간",
    subEn: "Alone time is time to know yourself",
  },
  {
    id: 21,
    dim: "anxiety",
    ko: "관계가 잘못되면 항상 내 탓인 것 같다",
    en: "When things go wrong, I feel it's always my fault",
    subKo: "모든 게 내 탓은 아니에요",
    subEn: "Not everything is your fault",
  },
  {
    id: 22,
    dim: "anxiety",
    ko: "상대방의 작은 행동 하나에도 의미를 찾으려 한다",
    en: "I read meaning into my partner's smallest gestures",
    subKo: "작은 것들에서 마음을 읽으려 하나요",
    subEn: "Reading meaning in small things",
  },
  {
    id: 23,
    dim: "trust",
    ko: "상대방이 내 곁에 있어줄 거라 믿는다",
    en: "I trust that my partner will be there for me",
    subKo: "곁에 있어준다는 것의 의미",
    subEn: "What it means to stay close",
  },
  {
    id: 24,
    dim: "dependency",
    ko: "감정적으로 힘들 때 상대방에게 기대고 싶다",
    en: "When I'm struggling, I want to lean on my partner",
    subKo: "약함을 보여주는 게 두려운가요",
    subEn: "Is showing weakness scary",
  },
  {
    id: 25,
    dim: "trust",
    ko: "관계에서 있는 그대로의 내 모습을 보여줄 수 있다",
    en: "I can show my true self in relationships",
    subKo: "있는 그대로가 가장 사랑스러워요",
    subEn: "Being yourself is the most loved version",
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
      name: "안정형",
      serious: `안정형 애착을 가진 사람은 관계에서 편안함을 느낍니다. 가까워지는 것이 자연스럽고 혼자 있는 것도 괜찮습니다.

당신은 상대방을 신뢰하고 자신도 신뢰받을 수 있다고 믿어요. 갈등이 생겨도 대화로 풀 수 있다는 믿음이 있습니다.

어린 시절 일관되고 따뜻한 양육 환경에서 자란 경우가 많아요. 감정을 표현하고 받는 것이 자연스럽게 느껴집니다.

이 유형은 관계에서 가장 건강한 패턴을 보여요. 근데 안정형이라고 해서 항상 완벽한 건 아니에요. 때로 불안하고 때로 거리를 두고 싶을 수 있어요. 그게 정상이에요.`,
      strengths: [
        "감정 표현이 자연스러워요",
        "갈등을 건강하게 해결해요",
        "상대방을 신뢰하고 신뢰받아요",
        "혼자와 함께, 둘 다 괜찮아요",
      ],
      watchOut:
        "안정형은 불안정한 애착 유형의 파트너를 만나면 지칠 수 있어요. 상대방의 패턴을 이해하고 경계를 지키는 것도 중요해요.",
      fun: `안정형.
연락 안 해도 믿음.
싸워도 대화로 풀음.
이게 되는 사람이야?
실존하는 유형 맞음.
근데 주변에 별로 없음.`,
      shareText: `나의 애착 유형: 안정형 🟢
'연락 안 해도 믿음. 싸워도 대화로 풀음.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Secure",
      serious: `Securely attached people feel comfortable in relationships. Getting close feels natural, and being alone is fine too.

You trust your partner and believe you're worthy of being trusted. When conflict arises, you believe it can be resolved through conversation.

This often develops from consistent, warm caregiving in childhood. Expressing and receiving emotions feels natural to you.

This is the healthiest attachment pattern. But secure doesn't mean perfect — you still feel anxious sometimes, still want distance sometimes. That's completely normal.`,
      strengths: [
        "Natural emotional expression",
        "Healthy conflict resolution",
        "Trust and be trusted",
        "Comfortable alone and together",
      ],
      watchOut:
        "Secure types can get exhausted by insecurely attached partners. Understanding their patterns and maintaining boundaries matters.",
      fun: `Secure type.
Trusts without constant reassurance.
Resolves conflict through talking.
This person actually exists.
Just rare.`,
      shareText: `My attachment style: Secure 🟢
'Trusts without reassurance. Talks it out.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
  anxious: {
    id: "anxious",
    emoji: "🔴",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    ko: {
      name: "불안형",
      serious: `불안형 애착을 가진 사람은 관계에서 강렬한 감정을 느껴요. 사랑하는 사람 곁에 있고 싶지만 그 사람이 정말 날 사랑하는지 확신이 서지 않아요.

답장이 늦으면 최악의 상황을 상상하고, 상대방의 작은 행동에도 큰 의미를 찾으려 해요. 이게 과민반응이라는 걸 알면서도 멈추기가 어려워요.

이 패턴은 어린 시절 불일관된 양육에서 비롯되는 경우가 많아요. '언제 사랑받을지 모른다'는 경험이 계속 확인을 구하는 행동으로 이어져요.

당신의 감정은 과장된 게 아니에요. 다만 그 강도가 때로 관계를 힘들게 만들 수 있어요.`,
      strengths: [
        "감정이 풍부하고 깊이 사랑해요",
        "관계에 온 마음을 다해요",
        "상대방의 감정 변화를 잘 감지해요",
        "헌신적이에요",
      ],
      watchOut:
        "확인을 구하는 행동이 반복되면 상대방이 지칠 수 있어요. 불안할 때 상대방에게 달려가기 전에 잠깐 스스로 달래는 연습이 도움이 돼요.",
      fun: `불안형.
답장 3분 늦음. 이미 이별 시나리오 완성.
'괜찮아?' 문자 보내고 싶음.
안 보냄. 10분 참음.
보냄.
'응 바빴어' 옴.
안도. 5분 후 또 불안.`,
      shareText: `나의 애착 유형: 불안형 🔴
'답장 3분 늦음. 이미 이별 시나리오 완성.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Anxious",
      serious: `Anxiously attached people feel intense emotions in relationships. You desperately want to be close but can't quite believe your partner truly loves you.

Late replies trigger worst-case thinking. You read meaning into small gestures. You know you're overreacting, but you can't stop.

This pattern often comes from inconsistent caregiving in childhood — not knowing when love would come led to constant reassurance-seeking.

Your feelings aren't exaggerated. But their intensity can sometimes make relationships exhausting.`,
      strengths: [
        "Rich emotions, loves deeply",
        "Fully committed to relationships",
        "Perceptive of partner's emotional shifts",
        "Deeply devoted",
      ],
      watchOut:
        "Constant reassurance-seeking can exhaust partners. When anxiety spikes, try soothing yourself before reaching out — it takes practice but helps.",
      fun: `Anxious type.
Reply is 3 minutes late.
Already wrote the breakup speech internally.
Wants to text 'you okay?'
Doesn't. Waits 10 minutes.
Texts.
Gets 'yeah was busy.'
Relief. Anxious again 5 minutes later.`,
      shareText: `My attachment style: Anxious 🔴
'Reply 3 min late. Already wrote the breakup speech.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
  avoidant: {
    id: "avoidant",
    emoji: "🔵",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    ko: {
      name: "회피형",
      serious: `회피형 애착을 가진 사람은 독립성을 매우 중요하게 여겨요. 가까워지는 것이 불편하고 상대방이 너무 의존하면 숨이 막혀요.

감정 표현이 어렵고, 상대방이 감정적으로 다가오면 거리를 두고 싶어져요. 이게 상대방을 거부하는 게 아니라 자신을 보호하는 방식이에요.

어린 시절 감정을 표현했을 때 무시되거나 부담스럽게 여겨진 경험이 있는 경우가 많아요. 그래서 감정은 혼자 처리하는 것이 더 안전하다는 걸 배웠어요.

당신도 사랑받고 싶어요. 다만 그 방식이 다를 뿐이에요.`,
      strengths: [
        "독립적이고 자기 의존적이에요",
        "감정에 휩쓸리지 않아요",
        "자신만의 공간과 취미가 있어요",
        "냉정하게 상황을 볼 수 있어요",
      ],
      watchOut:
        "거리를 두는 게 습관이 되면 정말 원하는 관계도 놓칠 수 있어요. 불편해도 조금씩 표현하는 연습이 관계를 바꿉니다.",
      fun: `회피형.
좋아함. 근데 티 안 냄.
상대방이 다가옴. 한 발 물러남.
상대방이 포기함. 아쉬움.
혼자가 편함. 근데 외로움.
이 모순 속에서 삼.
잘 지내고 있음.`,
      shareText: `나의 애착 유형: 회피형 🔵
'좋아함. 근데 티 안 냄. 다가오면 물러남.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Avoidant",
      serious: `Avoidantly attached people place high value on independence. Getting too close feels uncomfortable, and neediness from partners feels suffocating.

Expressing emotions is hard. When someone comes in emotionally, you pull back. This isn't rejection — it's self-protection.

Often comes from childhood experiences where expressing emotions was dismissed or seen as burdensome. You learned: handle feelings alone, it's safer.

You want love too. You just show and receive it differently.`,
      strengths: [
        "Independent and self-reliant",
        "Not swept away by emotions",
        "Has own space and interests",
        "Can assess situations calmly",
      ],
      watchOut:
        "Habitual distancing can cause you to lose relationships you actually wanted. Practicing small expressions of feeling, even when uncomfortable, changes things.",
      fun: `Avoidant type.
Likes someone. Doesn't show it.
Person gets closer. Steps back.
Person gives up. Sad about it.
Comfortable alone. But lonely.
Living inside this contradiction.
Fine though.`,
      shareText: `My attachment style: Avoidant 🔵
'Likes you. Doesn't show it. You get close, they step back.'
What's yours? → nolza.fun/games/attachment`,
    },
  },
  disorganized: {
    id: "disorganized",
    emoji: "🟣",
    color: "#9333ea",
    bg: "rgba(147,51,234,0.08)",
    ko: {
      name: "혼란형",
      serious: `혼란형 애착은 가장 복잡한 유형이에요. 가까워지고 싶은 마음과 가까워지는 게 두려운 마음이 동시에 존재해요.

사랑받고 싶어요. 근데 상처받는 게 두려워요. 그래서 다가갔다가 밀어내고, 밀어냈다가 다시 다가가요. 본인도 이 패턴이 왜 반복되는지 이해하기 어려울 수 있어요.

이 유형은 어린 시절 가장 믿었던 사람에게 상처를 받은 경험과 관련이 있는 경우가 많아요. 사랑하는 사람이 동시에 두려운 존재였던 경험.

이건 당신의 잘못이 아니에요. 그리고 변할 수 있어요.`,
      strengths: [
        "감정의 깊이가 남달라요",
        "공감 능력이 뛰어나요",
        "복잡한 감정을 이해해요",
        "변화하려는 의지가 강해요",
      ],
      watchOut:
        "이 패턴은 혼자 바꾸기 어려울 수 있어요. 전문가의 도움이 진짜 큰 차이를 만들어요. 용기를 내는 게 약한 게 아니에요.",
      fun: `혼란형.
좋아함. 두려움. 다가감.
무서워짐. 밀어냄.
후회함. 다시 다가감.
상대방: 어지럽다.
나: 나도 어지럽다.
그래도 사랑하고 싶음.`,
      shareText: `나의 애착 유형: 혼란형 🟣
'다가갔다가 밀어냄. 밀어냈다가 다시 다가감.'
너는? → nolza.fun/games/attachment`,
    },
    en: {
      name: "Disorganized",
      serious: `Disorganized attachment is the most complex. The desire to get close and the fear of getting close exist simultaneously.

You want to be loved. But you're terrified of being hurt. So you move toward, then push away, push away, then reach back out. Even you might not understand why this keeps happening.

This pattern is often linked to childhood experiences of being hurt by the people you trusted most — when the source of love was also the source of fear.

This isn't your fault. And it can change.`,
      strengths: [
        "Extraordinary emotional depth",
        "Strong empathy",
        "Understands complexity",
        "Strong desire to grow and change",
      ],
      watchOut:
        "This pattern can be hard to change alone. Professional support makes a real difference. Seeking help isn't weakness — it's courage.",
      fun: `Disorganized type.
Likes them. Scared. Gets closer.
Gets scared. Pushes away.
Regrets it. Reaches back out.
Partner: dizzy.
Me: also dizzy.
Still wants love though.`,
      shareText: `My attachment style: Disorganized 🟣
'Gets close. Pushes away. Reaches back. Repeat.'
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
