import type { SimpleLocale } from "@/hooks/useLocale";

export type LocalizedText = {
  ko: string;
  en: string;
};

export type DeepFearDimension =
  | "abandonment"
  | "exposure"
  | "lossOfControl"
  | "distrust"
  | "unfamiliarSelf"
  | "repetition"
  | "forgotten"
  | "uncannyFamiliar";

export type DeepFearChoice = {
  id: string;
  text: LocalizedText;
  scores: Partial<Record<DeepFearDimension, number>>;
};

export type DeepFearQuestion = {
  id: string;
  situation: LocalizedText;
  prompt: LocalizedText;
  choices: DeepFearChoice[];
};

export type DeepFearResult = {
  id: DeepFearDimension;
  title: LocalizedText;
  englishLabel: string;
  hook: LocalizedText;
  description: LocalizedText;
  scene: LocalizedText;
  quietMoment: LocalizedText;
  facing: LocalizedText;
  finalLine: LocalizedText;
  accent: string;
};

export const DEEP_FEAR_COPY = {
  title: { ko: "당신 안의 가장 깊은 공포는?", en: "What Is Your Deepest Fear?" },
  altTitle: { ko: "당신이 가장 무서워하는 것은 사실 무엇일까?", en: "What are you truly afraid of?" },
  badge: { ko: "심리 호러 테스트", en: "Psychological Horror Test" },
  subtitle: {
    ko: "귀신보다 오래 남는 것은, 어떤 장면이 아니라 그 장면에서 내가 느끼는 마음입니다.",
    en: "The fear that stays longest is not a monster, but the feeling a scene leaves inside you.",
  },
  description: {
    ko: "일상 속 조금 불편한 장면들을 지나며 당신 안쪽에 숨어 있는 공포의 모양을 조용히 찾아봅니다.",
    en: "Move through subtly unsettling everyday scenes and find the shape of fear that hides beneath your reactions.",
  },
  disclaimer: {
    ko: "진단이 아닌 자기이해용 콘텐츠입니다. 불편함이 커지면 잠시 쉬어가세요.",
    en: "This is self-reflection content, not a diagnosis. Pause whenever it feels too heavy.",
  },
  start: { ko: "문을 열고 들어가기", en: "Open the door" },
  questionCount: { ko: "질문", en: "Question" },
  situationLabel: { ko: "상황", en: "Situation" },
  promptLabel: { ko: "질문", en: "Question" },
  resultLabel: { ko: "당신 안의 공포", en: "Your hidden fear" },
  scene: { ko: "당신이 무서워하는 장면", en: "The scene that frightens you" },
  quietMoment: { ko: "이 공포가 조용히 나타나는 순간", en: "When this fear appears quietly" },
  facing: { ko: "이 공포와 마주하는 방법", en: "How to face this fear" },
  finalLine: { ko: "마지막 문장", en: "Final line" },
  share: { ko: "결과 공유하기", en: "Share result" },
  copied: { ko: "링크 복사됨", en: "Link copied" },
  retry: { ko: "다시 들어가기", en: "Retake" },
  related: { ko: "이 테스트도 이어서 보기", en: "Try these next" },
} satisfies Record<string, LocalizedText>;

export const DEEP_FEAR_RESULTS: DeepFearResult[] = [
  {
    id: "abandonment",
    title: { ko: "버려지는 공포", en: "Fear of Abandonment" },
    englishLabel: "Fear of Abandonment",
    hook: {
      ko: "당신에게 가장 무서운 장면은 누군가 갑자기 사라지는 순간입니다.",
      en: "The scariest scene for you is the quiet moment someone disappears.",
    },
    description: {
      ko: "이 공포는 큰 이별보다 작은 기척에서 먼저 움직입니다. 답장이 늦어지고, 말투가 조금 식고, 약속이 가볍게 밀릴 때 마음은 이미 오래된 복도를 걷기 시작합니다. 당신은 붙잡고 싶은 마음을 숨기려 하지만, 사실 가장 두려운 것은 혼자 남는 일이 아니라 내가 중요하지 않았다는 결론입니다.",
      en: "This fear moves before any dramatic goodbye. A delayed reply, a colder tone, a postponed plan can make your mind walk an old hallway. What frightens you is not simply being alone, but the thought that you may not have mattered.",
    },
    scene: {
      ko: "불 꺼진 현관에 혼자 서 있는데, 방금까지 들리던 발소리가 문밖에서 멀어집니다.",
      en: "You stand in a dark entryway as footsteps that were just nearby fade beyond the door.",
    },
    quietMoment: {
      ko: "상대가 별뜻 없이 바빠 보일 때도 마음 한쪽에서는 이미 작별을 준비합니다.",
      en: "Even when someone is simply busy, a part of you starts preparing for goodbye.",
    },
    facing: {
      ko: "떠날지 모르는 사람을 붙드는 대신, 지금 내 곁에 실제로 남아 있는 신호를 천천히 확인해보세요.",
      en: "Instead of holding on to someone who may leave, slowly check the signs that they are still here.",
    },
    finalLine: {
      ko: "문이 닫히는 소리보다 오래 남는 것은, 내가 그 문 앞에 혼자 있었다는 기억입니다.",
      en: "What remains longer than the closing door is the memory of standing before it alone.",
    },
    accent: "#b75b62",
  },
  {
    id: "exposure",
    title: { ko: "들키는 공포", en: "Fear of Being Exposed" },
    englishLabel: "Fear of Being Exposed",
    hook: {
      ko: "당신은 어둠보다, 누군가 내 안쪽을 정확히 보는 순간을 더 무서워합니다.",
      en: "You fear being seen too clearly more than you fear the dark.",
    },
    description: {
      ko: "당신은 겉으로는 꽤 잘 정리된 사람처럼 보일 수 있습니다. 그래서 더 무섭습니다. 누군가 농담처럼 던진 한마디가 숨겨둔 마음에 닿으면, 갑자기 방 안의 조명이 너무 밝아진 것처럼 느껴집니다. 이 공포는 비난보다 노출에 가깝습니다. 내가 감춰온 결핍, 질투, 욕심, 약함이 누군가의 눈에 이름 붙여질까 봐 두려운 것입니다.",
      en: "You may look composed on the outside, which makes this fear sharper. When a casual comment touches something hidden, the room suddenly feels too bright. This is less about blame than exposure: the fear that your lack, envy, desire, or weakness will be named by someone else.",
    },
    scene: {
      ko: "친구가 웃으며 말합니다. '너 그런 척하는 거, 가끔 보여.' 그 순간 방 안이 조용해집니다.",
      en: "A friend laughs and says, 'Sometimes I can tell when you're pretending.' The room goes quiet.",
    },
    quietMoment: {
      ko: "사소한 질문 하나에도 방어적으로 설명이 길어질 때 이 공포가 고개를 듭니다.",
      en: "It appears when one small question makes you explain yourself too much.",
    },
    facing: {
      ko: "들킨다는 느낌이 올라올 때, 정말 폭로된 것과 내가 먼저 겁먹은 것을 구분해보세요.",
      en: "When you feel exposed, separate what was actually revealed from what you feared they might see.",
    },
    finalLine: {
      ko: "가장 밝은 조명은 가끔 가장 깊은 그림자를 만듭니다.",
      en: "The brightest light sometimes makes the deepest shadow.",
    },
    accent: "#c49a61",
  },
  {
    id: "lossOfControl",
    title: { ko: "통제력을 잃는 공포", en: "Fear of Losing Control" },
    englishLabel: "Fear of Losing Control",
    hook: {
      ko: "당신에게 공포는 예상 밖의 일이 아니라, 내가 나를 붙잡지 못하는 감각입니다.",
      en: "For you, fear is not surprise. It is the feeling that you can no longer hold yourself together.",
    },
    description: {
      ko: "당신은 불확실한 상황보다 그 안에서 무너질지도 모르는 자신을 더 경계합니다. 계획이 틀어지고, 감정이 커지고, 누군가 내 리듬을 흔들 때 마음은 빠르게 비상등을 켭니다. 이 공포는 모든 것을 완벽히 다루고 싶다는 욕심이 아니라, 한 번 풀리면 다시 정리할 수 없을 것 같다는 오래된 긴장입니다.",
      en: "You are not only wary of uncertainty; you are wary of who you might become inside it. When plans break, emotions swell, or someone disrupts your rhythm, your mind turns on every alarm. This is not perfectionism as much as the fear that once things unravel, you may not be able to gather them again.",
    },
    scene: {
      ko: "엘리베이터가 층 사이에서 멈추고, 아무 버튼도 반응하지 않습니다.",
      en: "The elevator stops between floors, and none of the buttons respond.",
    },
    quietMoment: {
      ko: "예상보다 일이 조금만 늦어져도 머릿속에서는 이미 모든 경우의 수가 폭주합니다.",
      en: "When something runs slightly late, every possible outcome begins racing in your head.",
    },
    facing: {
      ko: "모든 상황을 붙잡기보다, 지금 조절 가능한 아주 작은 행동 하나를 먼저 선택하세요.",
      en: "Instead of controlling the whole situation, choose one small action you can actually guide now.",
    },
    finalLine: {
      ko: "손에서 놓친 것이 전부 떨어지는 것은 아닙니다.",
      en: "Not everything you release will fall apart.",
    },
    accent: "#6f91a6",
  },
  {
    id: "distrust",
    title: { ko: "아무도 믿을 수 없는 공포", en: "Fear of Distrust" },
    englishLabel: "Fear of Distrust",
    hook: {
      ko: "당신은 낯선 사람보다 익숙한 사람의 미세한 변화가 더 무섭습니다.",
      en: "You fear tiny changes in familiar people more than strangers.",
    },
    description: {
      ko: "이 공포는 '모두가 나를 해칠 것'이라는 극단보다 조용합니다. 가까운 사람이 방금 한 말이 정말 진심인지, 웃음 뒤에 다른 의미가 있는지, 내가 모르는 대화가 이미 끝났는지 자꾸 확인하고 싶어집니다. 당신의 마음은 위험을 피하려고 사람의 표정과 침묵을 너무 오래 읽습니다.",
      en: "This fear is quieter than believing everyone will hurt you. You keep wondering whether a close person's words were sincere, whether a smile held another meaning, or whether some conversation ended without you. Your mind reads expressions and silences too carefully because it wants to avoid danger.",
    },
    scene: {
      ko: "방금까지 다정하던 사람이 당신이 들어오자 말을 멈추고 휴대폰을 뒤집어 놓습니다.",
      en: "Someone who was warm a moment ago stops talking when you enter and turns their phone face down.",
    },
    quietMoment: {
      ko: "상대의 말보다 말하지 않은 부분이 더 크게 들릴 때 이 공포가 시작됩니다.",
      en: "It begins when what someone does not say sounds louder than what they do.",
    },
    facing: {
      ko: "확신이 없을 때 마음속 추리를 사실처럼 굳히기 전에, 확인 가능한 단서를 하나만 더 보세요.",
      en: "When you lack certainty, look for one checkable clue before turning your suspicion into fact.",
    },
    finalLine: {
      ko: "닫힌 문보다 무서운 것은, 안에서 누가 웃었는지 모르는 일입니다.",
      en: "Scarier than a closed door is not knowing who laughed behind it.",
    },
    accent: "#8d719b",
  },
  {
    id: "unfamiliarSelf",
    title: { ko: "내가 나를 모르게 되는 공포", en: "Fear of the Unfamiliar Self" },
    englishLabel: "Fear of the Unfamiliar Self",
    hook: {
      ko: "당신은 세상이 이상해지는 것보다 내가 낯설어지는 순간을 더 무서워합니다.",
      en: "You fear the moment you become strange to yourself more than the world becoming strange.",
    },
    description: {
      ko: "가끔 당신은 자신의 반응을 보고 놀랍니다. 왜 그런 말이 나왔는지, 왜 그 장면에서 마음이 식었는지, 왜 괜찮다고 생각한 일이 오래 남는지 스스로도 설명하기 어렵습니다. 이 공포의 중심에는 '내가 알고 있던 나는 일부였을 뿐일지도 모른다'는 불편한 가능성이 있습니다.",
      en: "Sometimes your own reactions surprise you. You cannot explain why those words came out, why you went cold, or why something you thought was fine stayed with you. At the center is the uncomfortable possibility that the person you knew was only part of you.",
    },
    scene: {
      ko: "거울 속 표정이 분명 내 얼굴인데, 내가 짓고 있는 표정 같지 않습니다.",
      en: "The face in the mirror is yours, but the expression does not feel like one you made.",
    },
    quietMoment: {
      ko: "내가 한 말이 뒤늦게 낯설게 들리거나, 내 감정의 이유를 찾지 못할 때 나타납니다.",
      en: "It appears when your own words sound unfamiliar afterward, or when you cannot find the reason for your feeling.",
    },
    facing: {
      ko: "낯선 반응을 바로 부정하지 말고, 그것이 지금의 나에게 무엇을 알려주려는지 적어보세요.",
      en: "Do not reject an unfamiliar reaction immediately. Write down what it may be trying to tell you.",
    },
    finalLine: {
      ko: "가장 낯선 방은 언제나 내 안쪽에 먼저 생깁니다.",
      en: "The strangest room usually appears inside you first.",
    },
    accent: "#7f9b83",
  },
  {
    id: "repetition",
    title: { ko: "끝나지 않는 반복의 공포", en: "Fear of Endless Repetition" },
    englishLabel: "Fear of Endless Repetition",
    hook: {
      ko: "당신은 갑작스러운 비극보다 같은 장면이 다시 돌아오는 일을 더 무서워합니다.",
      en: "You fear the same scene returning more than a sudden tragedy.",
    },
    description: {
      ko: "어떤 상처는 한 번으로 끝나지 않습니다. 비슷한 말투, 비슷한 밤, 비슷한 실수 앞에서 마음은 '또 시작됐다'고 속삭입니다. 이 공포는 미래가 무서운 것이 아니라, 미래가 결국 과거와 같은 모양으로 돌아올까 봐 무서운 것입니다.",
      en: "Some wounds do not end after one time. A similar tone, a similar night, a similar mistake makes your mind whisper, 'Here it comes again.' This fear is not about the future itself, but the future returning in the exact shape of the past.",
    },
    scene: {
      ko: "분명 처음 오는 골목인데, 벽의 얼룩과 가로등 위치까지 예전 꿈과 똑같습니다.",
      en: "You are sure this alley is new, yet the stain on the wall and the streetlight match an old dream.",
    },
    quietMoment: {
      ko: "작은 실수가 예전의 더 큰 실패를 전부 다시 불러올 때 나타납니다.",
      en: "It appears when a small mistake summons an older, larger failure.",
    },
    facing: {
      ko: "반복되는 감각을 느낄 때, 이번 장면에서 달라진 점 하나를 의식적으로 찾아보세요.",
      en: "When repetition rises, deliberately find one thing that is different in this scene.",
    },
    finalLine: {
      ko: "같은 문처럼 보여도, 이번에는 손잡이가 조금 다를 수 있습니다.",
      en: "Even if it looks like the same door, the handle may be different this time.",
    },
    accent: "#9f6b4f",
  },
  {
    id: "forgotten",
    title: { ko: "기억에서 지워지는 공포", en: "Fear of Being Forgotten" },
    englishLabel: "Fear of Being Forgotten",
    hook: {
      ko: "당신은 사라지는 것보다, 사라진 뒤 아무도 알아차리지 못하는 일이 무섭습니다.",
      en: "You fear not vanishing, but vanishing without anyone noticing.",
    },
    description: {
      ko: "이 공포는 존재의 흔적에 예민합니다. 내가 한 말이 기억되지 않고, 함께 보낸 시간이 쉽게 대체되고, 사진 속 내 자리가 흐려질 때 마음은 조용히 식습니다. 당신이 바라는 것은 거창한 인정이 아니라, 내가 여기 있었다는 작고 정확한 기억입니다.",
      en: "This fear is sensitive to traces of existence. When your words are not remembered, shared time is easily replaced, or your place in a photo feels blurred, something quietly cools inside. You do not need grand recognition, only a small accurate memory that you were here.",
    },
    scene: {
      ko: "오래된 단체 사진을 보는데, 이상하게 당신이 서 있던 자리만 빛이 바래 있습니다.",
      en: "You look at an old group photo, and the place where you stood is strangely faded.",
    },
    quietMoment: {
      ko: "누군가 중요한 대화를 잊었을 때, 당신은 그 사람의 기억에서 내 자리가 얼마나 작은지 생각합니다.",
      en: "When someone forgets an important conversation, you wonder how small your place is in their memory.",
    },
    facing: {
      ko: "남의 기억 속 자리만 확인하기보다, 내 삶에 내가 남긴 흔적을 직접 기록해보세요.",
      en: "Instead of checking only your place in others' memories, record the traces you leave in your own life.",
    },
    finalLine: {
      ko: "가장 조용한 실종은 이름이 불리지 않는 방식으로 일어납니다.",
      en: "The quietest disappearance happens when your name is no longer called.",
    },
    accent: "#8fa0b4",
  },
  {
    id: "uncannyFamiliar",
    title: { ko: "가까운 사람이 낯설어지는 공포", en: "Fear of the Familiar Becoming Strange" },
    englishLabel: "Fear of the Familiar Becoming Strange",
    hook: {
      ko: "당신에게 가장 섬뜩한 것은 모르는 얼굴이 아니라, 너무 잘 아는 얼굴의 낯선 표정입니다.",
      en: "What unsettles you most is not an unknown face, but a strange expression on a familiar one.",
    },
    description: {
      ko: "가까운 사람은 마음의 지형처럼 익숙합니다. 그래서 아주 작은 변화가 더 크게 흔들립니다. 말투가 한 박자 늦고, 눈빛이 잠깐 비어 있고, 평소와 같은 문장을 전혀 다른 사람처럼 말할 때 당신의 세계는 살짝 기울어집니다. 이 공포는 관계의 끝보다, 내가 알던 사람이 이미 멀리 가버렸을지도 모른다는 감각에 가깝습니다.",
      en: "Close people become part of your inner landscape, so tiny changes shake you more. A delayed tone, a blank look, a familiar sentence spoken like a different person can tilt your world. This fear is not only losing the relationship, but sensing that the person you knew may already be far away.",
    },
    scene: {
      ko: "가장 친한 사람이 평소처럼 당신의 이름을 부르는데, 그 목소리만 낯선 사람 같습니다.",
      en: "Your closest person says your name as usual, but their voice sounds like a stranger's.",
    },
    quietMoment: {
      ko: "익숙한 사람이 갑자기 감정적으로 멀게 느껴지는 순간, 마음은 이유를 찾기 시작합니다.",
      en: "When a familiar person suddenly feels emotionally distant, your mind begins searching for a reason.",
    },
    facing: {
      ko: "상대가 낯설게 느껴질 때, 그 사람 전체를 잃었다고 단정하지 말고 지금의 거리만 확인해보세요.",
      en: "When someone feels strange, do not decide you have lost them entirely. Check only the distance of this moment.",
    },
    finalLine: {
      ko: "익숙함이 깨질 때, 방 안의 공기는 먼저 다른 이름을 갖습니다.",
      en: "When familiarity cracks, even the air in the room receives another name.",
    },
    accent: "#b07d8c",
  },
];

export const DEEP_FEAR_QUESTIONS: DeepFearQuestion[] = [
  {
    id: "df_01",
    situation: {
      ko: "늦은 밤, 집에 혼자 있는데 방 안 어딘가에서 아주 작은 소리가 납니다. 분명 아무도 없다고 생각했지만, 그 소리는 멈추지 않습니다.",
      en: "Late at night, you are alone at home when a tiny sound comes from somewhere in the room. You are sure no one is there, but the sound does not stop.",
    },
    prompt: { ko: "이 순간 가장 먼저 드는 생각은?", en: "What is your first thought?" },
    choices: [
      { id: "a", text: { ko: "누군가 나를 보고 있는 것 같아 움직이지 못한다.", en: "It feels like someone is watching me, so I freeze." }, scores: { distrust: 3 } },
      { id: "b", text: { ko: "내가 잘못 들은 거라고 생각하며 일부러 무시한다.", en: "I tell myself I misheard and deliberately ignore it." }, scores: { exposure: 2, lossOfControl: 1 } },
      { id: "c", text: { ko: "소리의 정체를 확인하지 않으면 더 불안해질 것 같다.", en: "I need to identify the sound or I will feel more anxious." }, scores: { lossOfControl: 3 } },
      { id: "d", text: { ko: "이상하게도 그 소리가 오래전 기억과 연결된 것처럼 느껴진다.", en: "Strangely, the sound feels connected to an old memory." }, scores: { repetition: 3 } },
    ],
  },
  {
    id: "df_02",
    situation: {
      ko: "친한 사람이 평소보다 짧게 답장을 보냈습니다. 이모티콘도 없고, 다음 말도 이어지지 않습니다.",
      en: "A close person replies shorter than usual. There is no emoji, and the conversation does not continue.",
    },
    prompt: { ko: "가장 가까운 반응은?", en: "Which reaction feels closest?" },
    choices: [
      { id: "a", text: { ko: "이제 나에게 마음이 식은 건 아닌지 먼저 걱정한다.", en: "I first worry that they may be losing interest in me." }, scores: { abandonment: 3 } },
      { id: "b", text: { ko: "혹시 내가 이상한 말을 해서 들킨 것처럼 느낀다.", en: "I wonder if I said something strange and exposed myself." }, scores: { exposure: 3 } },
      { id: "c", text: { ko: "바쁜 걸 수도 있다고 정리하지만, 계속 시간대를 확인한다.", en: "I explain it as busyness, but keep checking the time." }, scores: { lossOfControl: 2, distrust: 1 } },
      { id: "d", text: { ko: "대화가 곧 사라질 것 같아 이전 메시지를 다시 읽는다.", en: "It feels like the conversation may disappear, so I reread old messages." }, scores: { forgotten: 3 } },
    ],
  },
  {
    id: "df_03",
    situation: {
      ko: "엘리베이터가 층 사이에서 멈추고, 내부 조명이 한 번 깜빡입니다. 안내 방송은 나오지 않습니다.",
      en: "The elevator stops between floors, and the light flickers once. There is no announcement.",
    },
    prompt: { ko: "그 안에서 가장 견디기 어려운 감각은?", en: "What is hardest to endure inside it?" },
    choices: [
      { id: "a", text: { ko: "버튼이 통하지 않는다는 사실 때문에 숨이 막힌다.", en: "The fact that the buttons do nothing makes it hard to breathe." }, scores: { lossOfControl: 3 } },
      { id: "b", text: { ko: "누군가 일부러 나를 여기에 가둔 것 같다는 생각이 든다.", en: "I think someone may have trapped me here on purpose." }, scores: { distrust: 3 } },
      { id: "c", text: { ko: "이 장면을 전에도 겪은 것처럼 이상하게 익숙하다.", en: "It feels strangely familiar, as if I have been here before." }, scores: { repetition: 3 } },
      { id: "d", text: { ko: "구조되어도 이 순간의 내가 조금 달라질 것 같아 무섭다.", en: "Even if I get out, I fear this moment will change something in me." }, scores: { unfamiliarSelf: 3 } },
    ],
  },
  {
    id: "df_04",
    situation: {
      ko: "모임에 늦게 들어가자 사람들이 동시에 웃음을 멈춥니다. 누군가 '아무것도 아니야'라고 말합니다.",
      en: "You enter a gathering late, and everyone stops laughing at once. Someone says, 'It was nothing.'",
    },
    prompt: { ko: "마음속에서 가장 먼저 커지는 것은?", en: "What grows first inside you?" },
    choices: [
      { id: "a", text: { ko: "내가 없는 사이 내 얘기를 했을지도 모른다는 의심.", en: "The suspicion that they were talking about me while I was gone." }, scores: { distrust: 3 } },
      { id: "b", text: { ko: "내가 숨기던 모습이 이미 보였을지도 모른다는 수치심.", en: "Shame that they may have already seen what I hide." }, scores: { exposure: 3 } },
      { id: "c", text: { ko: "내가 이 자리에서 점점 없어지는 사람 같다는 느낌.", en: "The feeling that I am slowly disappearing from this group." }, scores: { forgotten: 3 } },
      { id: "d", text: { ko: "괜찮은 척 웃지만 집에 가면 계속 되감아볼 것 같다.", en: "I smile like I am fine, but I know I will replay it later." }, scores: { repetition: 2, abandonment: 1 } },
    ],
  },
  {
    id: "df_05",
    situation: {
      ko: "오래된 사진첩을 넘기는데 한 장의 사진에서 당신 얼굴만 흐릿합니다. 다른 사람들은 모두 선명합니다.",
      en: "You flip through an old album and find one photo where only your face is blurred. Everyone else is clear.",
    },
    prompt: { ko: "무엇이 가장 섬뜩하게 느껴지나요?", en: "What feels most unsettling?" },
    choices: [
      { id: "a", text: { ko: "내가 그 기억에서 혼자 빠져나간 것 같다.", en: "It feels like I alone slipped out of that memory." }, scores: { forgotten: 3 } },
      { id: "b", text: { ko: "사진 속 내가 정말 나였는지 확신이 안 든다.", en: "I am not sure the person in the photo was really me." }, scores: { unfamiliarSelf: 3 } },
      { id: "c", text: { ko: "누군가 일부러 내 얼굴을 지운 것 같아 불안하다.", en: "I worry someone erased my face on purpose." }, scores: { distrust: 3 } },
      { id: "d", text: { ko: "그때도 나는 사람들 옆에 있었지만 혼자였던 것 같다.", en: "Even then, I may have been beside people but still alone." }, scores: { abandonment: 3 } },
    ],
  },
  {
    id: "df_06",
    situation: {
      ko: "며칠째 같은 꿈을 꿉니다. 복도 끝의 문 앞까지 가면 항상 알람이 울리고, 문은 열리지 않습니다.",
      en: "For days, you have the same dream. You reach the door at the end of a hallway, then your alarm rings before it opens.",
    },
    prompt: { ko: "꿈에서 깬 뒤 가장 남는 감각은?", en: "What remains after waking?" },
    choices: [
      { id: "a", text: { ko: "오늘 밤에도 같은 곳으로 돌아갈 것 같아 지친다.", en: "I feel exhausted because I may return there tonight." }, scores: { repetition: 3 } },
      { id: "b", text: { ko: "문 안에 내가 감당하지 못할 내가 있을 것 같다.", en: "Behind the door may be a version of me I cannot handle." }, scores: { unfamiliarSelf: 3 } },
      { id: "c", text: { ko: "문이 열리지 않는 상황을 내가 통제할 수 없어 답답하다.", en: "I am frustrated that I cannot control whether the door opens." }, scores: { lossOfControl: 3 } },
      { id: "d", text: { ko: "누군가 일부러 내가 열기 직전에 깨우는 것 같다.", en: "It feels like someone wakes me right before I open it." }, scores: { distrust: 2, exposure: 1 } },
    ],
  },
  {
    id: "df_07",
    situation: {
      ko: "가장 가까운 사람이 평소와 같은 말을 하는데, 목소리의 온도만 이상하게 다릅니다.",
      en: "The person closest to you says the usual words, but the temperature of their voice is strangely different.",
    },
    prompt: { ko: "당신을 가장 불안하게 하는 것은?", en: "What makes you most uneasy?" },
    choices: [
      { id: "a", text: { ko: "내가 알던 사람이 이미 멀어진 것 같은 느낌.", en: "The feeling that the person I knew has already moved far away." }, scores: { uncannyFamiliar: 3 } },
      { id: "b", text: { ko: "곧 나를 떠날 준비를 하는 신호처럼 느껴진다.", en: "It feels like a sign they are preparing to leave me." }, scores: { abandonment: 3 } },
      { id: "c", text: { ko: "왜 달라졌는지 알아내지 못하면 견디기 어렵다.", en: "I cannot stand not knowing why they changed." }, scores: { lossOfControl: 2, distrust: 1 } },
      { id: "d", text: { ko: "내가 뭔가를 잘못해서 저 표정을 끌어낸 것 같다.", en: "I feel like I did something wrong and caused that expression." }, scores: { exposure: 2, abandonment: 1 } },
    ],
  },
  {
    id: "df_08",
    situation: {
      ko: "달력에 기억나지 않는 일정이 적혀 있습니다. 제목은 짧게 '확인할 것'이라고만 되어 있습니다.",
      en: "A calendar event you do not remember appears. Its title simply says, 'Check this.'",
    },
    prompt: { ko: "어떤 생각이 가장 먼저 떠오르나요?", en: "What thought comes first?" },
    choices: [
      { id: "a", text: { ko: "내가 적어놓고도 기억하지 못한다는 사실이 무섭다.", en: "It scares me that I wrote it and cannot remember." }, scores: { unfamiliarSelf: 3 } },
      { id: "b", text: { ko: "확인하지 않으면 일이 커질 것 같아 바로 찾기 시작한다.", en: "I start searching immediately because it may get worse if I ignore it." }, scores: { lossOfControl: 3 } },
      { id: "c", text: { ko: "누군가 내 일정에 손을 댄 것 같아 주변을 의심한다.", en: "I suspect someone touched my calendar." }, scores: { distrust: 3 } },
      { id: "d", text: { ko: "예전에 놓친 어떤 일이 다시 돌아온 것 같다.", en: "It feels like something I once missed has returned." }, scores: { repetition: 3 } },
    ],
  },
  {
    id: "df_09",
    situation: {
      ko: "어두운 복도를 지나가는데, 방금 지나친 방의 불이 뒤늦게 켜집니다.",
      en: "As you walk down a dark hallway, the light in a room you just passed turns on behind you.",
    },
    prompt: { ko: "몸이 먼저 반응하는 쪽은?", en: "How does your body react first?" },
    choices: [
      { id: "a", text: { ko: "뒤돌아보면 안 될 것 같아 그대로 멈춘다.", en: "I freeze because turning around feels dangerous." }, scores: { distrust: 2, uncannyFamiliar: 1 } },
      { id: "b", text: { ko: "불이 왜 켜졌는지 확인해야 마음이 놓일 것 같다.", en: "I need to know why it turned on before I can calm down." }, scores: { lossOfControl: 3 } },
      { id: "c", text: { ko: "내가 지나간 흔적이 누군가에게 확인된 것 같다.", en: "It feels like someone noticed the trace I left behind." }, scores: { exposure: 3 } },
      { id: "d", text: { ko: "이 복도를 전에도 이렇게 걸었던 기억이 떠오른다.", en: "I remember walking this hallway like this before." }, scores: { repetition: 3 } },
    ],
  },
  {
    id: "df_10",
    situation: {
      ko: "중요한 파일이 사라졌습니다. 분명 저장했고, 아무도 컴퓨터를 쓰지 않았습니다.",
      en: "An important file is gone. You are sure you saved it, and no one else used the computer.",
    },
    prompt: { ko: "가장 가까운 마음은?", en: "Which feeling is closest?" },
    choices: [
      { id: "a", text: { ko: "내가 실수했다는 사실을 인정하면 무너질 것 같다.", en: "If I admit I made a mistake, I might fall apart." }, scores: { lossOfControl: 2, exposure: 1 } },
      { id: "b", text: { ko: "내 기억이 믿을 수 없어진 느낌이 제일 무섭다.", en: "The scariest part is that I cannot trust my memory." }, scores: { unfamiliarSelf: 3 } },
      { id: "c", text: { ko: "내가 한 일이 흔적 없이 사라졌다는 점이 허무하다.", en: "It feels empty that my work vanished without a trace." }, scores: { forgotten: 3 } },
      { id: "d", text: { ko: "누군가 내 뒤에서 일부러 지운 것 같아 확인하고 싶다.", en: "I want to check whether someone erased it behind my back." }, scores: { distrust: 3 } },
    ],
  },
  {
    id: "df_11",
    situation: {
      ko: "누군가 당신에게 말합니다. '너 예전에도 똑같이 그랬어.' 그런데 당신은 그 장면이 기억나지 않습니다.",
      en: "Someone says, 'You did the exact same thing before.' But you do not remember that scene.",
    },
    prompt: { ko: "그 말에서 가장 무서운 부분은?", en: "What part of that sentence scares you most?" },
    choices: [
      { id: "a", text: { ko: "내가 모르는 내가 반복해서 나타난다는 느낌.", en: "The feeling that an unknown version of me keeps appearing." }, scores: { unfamiliarSelf: 3 } },
      { id: "b", text: { ko: "같은 실수를 계속 되풀이하고 있다는 피로감.", en: "The exhaustion of repeating the same mistake." }, scores: { repetition: 3 } },
      { id: "c", text: { ko: "상대가 나를 이미 포기했을지도 모른다는 불안.", en: "The anxiety that they may have already given up on me." }, scores: { abandonment: 3 } },
      { id: "d", text: { ko: "내 약점이 상대에게 정확히 들킨 것 같은 느낌.", en: "The feeling that my weakness has been precisely exposed." }, scores: { exposure: 3 } },
    ],
  },
  {
    id: "df_12",
    situation: {
      ko: "오래된 채팅방을 열었는데, 당신이 보낸 메시지만 모두 사라져 있습니다.",
      en: "You open an old chat room, and only the messages you sent are gone.",
    },
    prompt: { ko: "가장 먼저 차가워지는 생각은?", en: "Which thought turns cold first?" },
    choices: [
      { id: "a", text: { ko: "내가 그 관계에 남긴 것이 아무것도 없어진 것 같다.", en: "It feels like nothing I left in that relationship remains." }, scores: { forgotten: 3 } },
      { id: "b", text: { ko: "상대가 나를 지우고 싶었던 건 아닌지 생각한다.", en: "I wonder if the other person wanted to erase me." }, scores: { abandonment: 2, distrust: 1 } },
      { id: "c", text: { ko: "내가 보낸 말들이 누군가에게 보여졌을까 봐 불안하다.", en: "I worry that what I wrote may have been seen by someone." }, scores: { exposure: 3 } },
      { id: "d", text: { ko: "대화가 지워진 이유를 끝까지 알아내야 할 것 같다.", en: "I feel I must find out why the messages disappeared." }, scores: { lossOfControl: 3 } },
    ],
  },
  {
    id: "df_13",
    situation: {
      ko: "가족처럼 익숙한 사람이 당신을 잠깐 낯선 사람 보듯 바라봅니다. 곧 평소처럼 웃지만, 그 표정이 남습니다.",
      en: "Someone as familiar as family looks at you briefly as if you were a stranger. They smile normally afterward, but the expression remains.",
    },
    prompt: { ko: "가장 오래 남는 느낌은?", en: "What stays the longest?" },
    choices: [
      { id: "a", text: { ko: "내가 알던 사람이 잠깐 사라진 것 같았다.", en: "It felt as if the person I knew vanished for a moment." }, scores: { uncannyFamiliar: 3 } },
      { id: "b", text: { ko: "그 사람에게 내 존재감이 희미해진 것 같았다.", en: "It felt like my presence had become faint to them." }, scores: { forgotten: 3 } },
      { id: "c", text: { ko: "내가 보이면 안 되는 모습으로 보인 것 같았다.", en: "It felt like they saw a version of me they should not have seen." }, scores: { exposure: 3 } },
      { id: "d", text: { ko: "이 관계가 언젠가 이렇게 식을 것 같아 두려웠다.", en: "I feared this relationship might someday grow cold like that." }, scores: { abandonment: 3 } },
    ],
  },
  {
    id: "df_14",
    situation: {
      ko: "분명 잠그고 나온 문이 열려 있습니다. 안쪽은 조용하고, 물건은 그대로입니다.",
      en: "A door you definitely locked is open. Inside is quiet, and nothing seems moved.",
    },
    prompt: { ko: "가장 먼저 확인하고 싶은 것은?", en: "What do you want to check first?" },
    choices: [
      { id: "a", text: { ko: "내가 정말 잠갔는지 내 기억부터 의심한다.", en: "I first doubt my own memory of locking it." }, scores: { unfamiliarSelf: 2, lossOfControl: 1 } },
      { id: "b", text: { ko: "누가 들어왔다면 무엇을 봤을지부터 떠오른다.", en: "I think first about what someone might have seen if they came in." }, scores: { exposure: 3 } },
      { id: "c", text: { ko: "아무것도 사라지지 않았다는 점이 오히려 더 불안하다.", en: "The fact that nothing is missing makes me more uneasy." }, scores: { distrust: 3 } },
      { id: "d", text: { ko: "예전에도 비슷한 느낌을 받은 적이 있어 심장이 내려앉는다.", en: "My heart drops because I have felt something similar before." }, scores: { repetition: 3 } },
    ],
  },
  {
    id: "df_15",
    situation: {
      ko: "어릴 때 살던 동네를 지나가는데, 가게 간판과 벽의 금까지 너무 그대로입니다.",
      en: "You pass through a childhood neighborhood, and the store signs and cracks in the walls are almost exactly the same.",
    },
    prompt: { ko: "그 익숙함이 불편한 이유는?", en: "Why does the familiarity feel uncomfortable?" },
    choices: [
      { id: "a", text: { ko: "나는 변했는데 그곳만 그대로라 다시 갇힌 기분이 든다.", en: "I have changed, but the place has not, so I feel trapped again." }, scores: { repetition: 3 } },
      { id: "b", text: { ko: "그곳의 나를 지금의 내가 제대로 기억하지 못하는 것 같다.", en: "It feels like my current self cannot properly remember who I was there." }, scores: { unfamiliarSelf: 3 } },
      { id: "c", text: { ko: "나 없이도 모든 것이 너무 잘 남아 있어 이상하게 외롭다.", en: "Everything remained too well without me, and it feels lonely." }, scores: { abandonment: 2, forgotten: 1 } },
      { id: "d", text: { ko: "곧 누군가 예전의 나를 알아볼까 봐 긴장된다.", en: "I tense up as if someone may recognize the old me." }, scores: { exposure: 3 } },
    ],
  },
  {
    id: "df_16",
    situation: {
      ko: "휴대폰에 저장한 적 없는 음성 메모가 있습니다. 재생하자, 당신과 아주 비슷한 목소리가 짧게 말합니다. '다시 여기야.'",
      en: "There is a voice memo on your phone that you never saved. When you play it, a voice very similar to yours says, 'Here again.'",
    },
    prompt: { ko: "가장 가까운 공포는?", en: "Which fear is closest?" },
    choices: [
      { id: "a", text: { ko: "내 안에 내가 모르는 목소리가 있다는 느낌.", en: "The feeling that there is a voice inside me I do not know." }, scores: { unfamiliarSelf: 3 } },
      { id: "b", text: { ko: "이 일이 처음이 아니라는 말처럼 들려서 무섭다.", en: "It scares me because it sounds like this is not the first time." }, scores: { repetition: 3 } },
      { id: "c", text: { ko: "누군가 내 목소리를 훔쳐 나를 흉내 낸 것 같다.", en: "It feels like someone stole my voice and imitated me." }, scores: { distrust: 2, exposure: 1 } },
      { id: "d", text: { ko: "이걸 들어도 아무에게 설명할 수 없을 것 같아 외롭다.", en: "I feel lonely because I could not explain this to anyone." }, scores: { abandonment: 2, forgotten: 1 } },
    ],
  },
];

const RESULT_ORDER = DEEP_FEAR_RESULTS.map((result) => result.id);

export function getDeepFearResultById(id: DeepFearDimension | undefined): DeepFearResult | undefined {
  return DEEP_FEAR_RESULTS.find((result) => result.id === id);
}

export function calculateDeepFearResult(answers: DeepFearChoice[]): {
  result: DeepFearResult;
  scores: Record<DeepFearDimension, number>;
} {
  const scores = Object.fromEntries(RESULT_ORDER.map((id) => [id, 0])) as Record<DeepFearDimension, number>;

  for (const answer of answers) {
    for (const [dimension, value] of Object.entries(answer.scores) as [DeepFearDimension, number][]) {
      scores[dimension] += value;
    }
  }

  const winningId = RESULT_ORDER.reduce((best, current) => {
    if (scores[current] > scores[best]) return current;
    return best;
  }, RESULT_ORDER[0]);

  return {
    result: getDeepFearResultById(winningId) ?? DEEP_FEAR_RESULTS[0],
    scores,
  };
}

export function localized(locale: SimpleLocale, copy: LocalizedText): string {
  return locale === "ko" ? copy.ko : copy.en;
}
