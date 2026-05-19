export type CrushTypeId =
  | "quiet-observer"
  | "friend-disguise"
  | "reply-overthinker"
  | "acting-cold"
  | "secret-drama"
  | "waiting-moment"
  | "obvious-crush"
  | "cant-let-go";

export type LocalText = {
  ko: string;
  en: string;
};

export type CrushChoice = {
  id: string;
  text: LocalText;
  weights: Partial<Record<CrushTypeId, number>>;
};

export type CrushQuestion = {
  id: string;
  targetDimension: string;
  rationale: string;
  prompt: LocalText;
  choices: CrushChoice[];
};

export type CrushResult = {
  id: CrushTypeId;
  title: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  strength: LocalText;
  weakPoint: LocalText;
  friendSays: LocalText;
  shareLine: LocalText;
};

export type CrushAnswer = {
  questionId: string;
  choiceId: string;
  weights: Partial<Record<CrushTypeId, number>>;
};

export const CRUSH_RESULTS: CrushResult[] = [
  {
    id: "quiet-observer",
    title: { ko: "조용한 관찰자형", en: "Quiet Observer" },
    oneLiner: { ko: "티 안 내는 척하지만, 사실 가장 많이 보고 있는 사람", en: "You look calm, but you notice everything." },
    description: {
      ko: "당신은 좋아하는 사람이 생기면 티를 크게 내기보다 조용히 관찰하는 쪽에 가깝습니다. 상대의 말투, 표정, 답장 속도, 사소한 습관까지 이상하게 오래 기억합니다. 겉으로는 평온해 보여도 마음속에서는 이미 작은 단서들이 차곡차곡 쌓이고 있어요.",
      en: "When you like someone, you tend to watch quietly rather than make it obvious. Their tone, expressions, reply speed, and tiny habits stay in your mind. You may look calm outside, but inside you are collecting little signals one by one.",
    },
    strength: { ko: "상대의 작은 변화를 잘 알아차립니다.", en: "You notice small changes others miss." },
    weakPoint: { ko: "너무 오래 관찰하다가 다가갈 타이밍을 놓칠 수 있습니다.", en: "You may observe for so long that the moment to move passes." },
    friendSays: { ko: "너 티 안 나는 줄 알지? 근데 은근 다 보고 있잖아.", en: "You think no one can tell, but you are quietly watching everything." },
    shareLine: { ko: "나는 짝사랑하면 조용한 관찰자형이래. 티 안 나는 줄 알았는데?", en: "My crush type is Quiet Observer. I thought I was subtle." },
  },
  {
    id: "friend-disguise",
    title: { ko: "친한 친구 위장형", en: "Friend Disguise Type" },
    oneLiner: { ko: "좋아하는 마음을 장난과 편한 척으로 숨기는 사람", en: "You hide your feelings behind jokes and casual energy." },
    description: {
      ko: "당신은 좋아하는 마음이 들킬까 봐 오히려 더 편한 친구처럼 행동하는 타입입니다. 장난을 치고, 아무렇지 않은 척하고, 친한 척하지만 사실 가장 많이 신경 쓰는 사람은 그 사람일 가능성이 큽니다.",
      en: "You often act like an easygoing friend because you do not want your feelings to show. You joke around and pretend it is nothing, but the person you are paying the most attention to is probably them.",
    },
    strength: { ko: "자연스럽게 가까워지는 데 강합니다.", en: "You are good at getting closer naturally." },
    weakPoint: { ko: "너무 친구처럼 굴다가 진심이 전달되지 않을 수 있습니다.", en: "Acting too friendly can make your real feelings hard to read." },
    friendSays: { ko: "너 좋아하면 더 친구처럼 굴잖아.", en: "When you like someone, you act even more like a friend." },
    shareLine: { ko: "나는 좋아하면 친구인 척하는 타입이래. 좀 찔림.", en: "Apparently I disguise my crush as friendship. That hits." },
  },
  {
    id: "reply-overthinker",
    title: { ko: "답장 해석 과몰입형", en: "Reply Overthinker" },
    oneLiner: { ko: "답장 하나로 하루 기분이 바뀌는 사람", en: "One reply can change your whole day." },
    description: {
      ko: "당신은 좋아하는 사람의 답장 하나에도 의미를 찾는 타입입니다. “ㅋㅋ”가 몇 개인지, 이모티콘이 있는지, 답장이 빨랐는지 느렸는지까지 마음에 남습니다. 감이 좋은 편일 수 있지만, 가끔은 너무 많은 의미를 혼자 만들어낼 수도 있어요.",
      en: "You find meaning in even a single reply from your crush. Timing, emojis, punctuation, and tone all stay with you. Your instincts can be sharp, but sometimes your mind builds more meaning than the moment actually holds.",
    },
    strength: { ko: "상대의 반응에 민감하고 섬세합니다.", en: "You are sensitive to subtle emotional signals." },
    weakPoint: { ko: "작은 신호를 너무 크게 해석할 수 있습니다.", en: "You may read too much into small signals." },
    friendSays: { ko: "너 답장 하나로 하루 기분 바뀌잖아.", en: "Your mood really changes from one message." },
    shareLine: { ko: "나는 답장 하나로 논문 쓰는 짝사랑 과몰입형 나왔다.", en: "I got Reply Overthinker. One text and I write a thesis." },
  },
  {
    id: "acting-cold",
    title: { ko: "일부러 차가워지는 형", en: "Acting Cold Type" },
    oneLiner: { ko: "좋아할수록 오히려 무심한 척하는 사람", en: "The more you care, the colder you may seem." },
    description: {
      ko: "당신은 마음이 들킬까 봐 오히려 차분하거나 무심하게 행동할 수 있습니다. 관심이 없는 척하지만 사실은 누구보다 신경 쓰고 있을 때가 많습니다. 가까워지고 싶은 마음과 들키고 싶지 않은 마음이 동시에 움직이는 타입입니다.",
      en: "You may act calm or distant because you do not want your feelings exposed. You can seem uninterested while secretly caring a lot. Wanting to get closer and wanting to stay hidden move at the same time.",
    },
    strength: { ko: "감정을 쉽게 드러내지 않고 자신을 지킬 수 있습니다.", en: "You can protect yourself by not revealing feelings too quickly." },
    weakPoint: { ko: "상대가 정말 관심 없는 줄 오해할 수 있습니다.", en: "The other person may think you really do not care." },
    friendSays: { ko: "너 관심 있을수록 더 티 안 내려고 하잖아.", en: "The more you like someone, the harder you try not to show it." },
    shareLine: { ko: "나는 좋아할수록 차가워지는 타입이래. 망했다.", en: "I act colder when I like someone. Great." },
  },
  {
    id: "secret-drama",
    title: { ko: "혼자 드라마 찍는 형", en: "Secret Drama Type" },
    oneLiner: { ko: "아무 일도 없었는데 마음속에서는 이미 로맨스가 시작된 사람", en: "Nothing happened, but your inner drama already started." },
    description: {
      ko: "당신은 작은 순간 하나에도 장면을 만들어내는 타입입니다. 우연히 눈이 마주치거나, 짧은 말 한마디를 들어도 머릿속에서는 이미 여러 가능성이 펼쳐집니다. 상상력이 풍부한 만큼 설렘도 크지만, 현실과 상상이 가끔 섞일 수 있어요.",
      en: "You can turn a tiny moment into a full scene. A glance or a short sentence can open several possibilities in your head. Your imagination makes crushes exciting, but fantasy and reality can sometimes blur.",
    },
    strength: { ko: "감정이 풍부하고 설렘을 크게 느낍니다.", en: "You feel excitement deeply and vividly." },
    weakPoint: { ko: "상상 속 이야기와 실제 상황을 헷갈릴 수 있습니다.", en: "You may confuse your inner story with what actually happened." },
    friendSays: { ko: "너 아무 일 없어도 머릿속에서는 이미 8화까지 갔잖아.", en: "Nothing happened, but your mind is already on episode eight." },
    shareLine: { ko: "나는 혼자 드라마 찍는 짝사랑형 나왔다. 부정 못 함.", en: "I got Secret Drama Type. I cannot deny it." },
  },
  {
    id: "waiting-moment",
    title: { ko: "기회만 기다리는 타이밍형", en: "Waiting for the Moment" },
    oneLiner: { ko: "다가가고 싶지만 타이밍을 오래 보는 사람", en: "You want to get closer, but you wait for the right timing." },
    description: {
      ko: "당신은 바로 직진하기보다 자연스럽게 가까워질 기회를 기다리는 타입입니다. 갑작스럽게 다가가는 것보다, 우연한 대화나 좋은 분위기를 중요하게 생각합니다. 다만 완벽한 타이밍을 기다리다가 기회가 지나갈 수 있습니다.",
      en: "You prefer waiting for a natural chance instead of rushing forward. A good mood, a casual conversation, and the right opening matter to you. But waiting for perfect timing can sometimes let the moment pass.",
    },
    strength: { ko: "무리하지 않고 자연스럽게 가까워지는 데 강합니다.", en: "You can move closer without forcing things." },
    weakPoint: { ko: "기다리기만 하다가 아무 일도 안 생길 수 있습니다.", en: "If you only wait, nothing may happen." },
    friendSays: { ko: "너 타이밍 본다면서 계속 대기 중이잖아.", en: "You keep waiting for timing and stay in standby mode." },
    shareLine: { ko: "나는 기회만 기다리는 타입이래. 근데 그 기회가 안 옴.", en: "I wait for the moment. The moment is apparently delayed." },
  },
  {
    id: "obvious-crush",
    title: { ko: "너무 티 나는 직진형", en: "Obvious Crush Type" },
    oneLiner: { ko: "숨기려고 해도 표정과 행동에서 다 티 나는 사람", en: "Even when you hide it, your face gives you away." },
    description: {
      ko: "당신은 좋아하는 마음을 숨기려 해도 표정, 말투, 행동에서 티가 나는 타입입니다. 본인은 잘 감췄다고 생각해도 주변 사람들은 이미 눈치챘을 수 있어요. 솔직하고 따뜻한 매력이 있지만, 가끔은 너무 빨리 마음이 드러날 수 있습니다.",
      en: "Even when you try to hide your feelings, they show in your face, tone, and actions. You may think you are being subtle, but people around you might already know. Your warmth is charming, though your feelings can appear quickly.",
    },
    strength: { ko: "진심이 잘 전달되고 따뜻한 인상을 줍니다.", en: "Your sincerity comes through clearly." },
    weakPoint: { ko: "마음이 너무 빨리 드러나서 스스로 민망해질 수 있습니다.", en: "Your feelings may show before you are ready." },
    friendSays: { ko: "너 이미 표정에서 다 들켰어.", en: "Your face already told everyone." },
    shareLine: { ko: "나는 짝사랑하면 너무 티 나는 직진형이래. 이미 다 들켰을 듯.", en: "I got Obvious Crush Type. Everyone probably knows." },
  },
  {
    id: "cant-let-go",
    title: { ko: "마음 접는 척 못 접는 형", en: "Can't Let Go Type" },
    oneLiner: { ko: "포기한다고 해놓고 작은 신호 하나에 다시 흔들리는 사람", en: "You say you are done, then one small signal pulls you back." },
    description: {
      ko: "당신은 마음을 접어야겠다고 생각하면서도 작은 친절이나 우연한 대화에 다시 흔들리는 타입입니다. 이성적으로는 정리하려고 하지만, 마음은 생각보다 천천히 움직입니다. 쉽게 좋아하지 않는 대신, 한 번 마음이 가면 오래 남을 수 있어요.",
      en: "You may decide to give up, but one small kindness or casual conversation can pull you back. Rationally, you try to move on, but your heart moves slowly. You may not like someone easily, but once you do, it stays.",
    },
    strength: { ko: "마음이 깊고 쉽게 가볍게 넘기지 않습니다.", en: "Your feelings are deep and not easily shallow." },
    weakPoint: { ko: "정리해야 할 마음을 오래 붙잡을 수 있습니다.", en: "You may hold onto feelings longer than you should." },
    friendSays: { ko: "너 포기한다더니 말 한마디에 다시 흔들리잖아.", en: "You said you were done, then one word changed everything." },
    shareLine: { ko: "나는 마음 접는 척 못 접는 타입이래. 진짜 너무함.", en: "I got Can't Let Go Type. Honestly unfair." },
  },
];

export const CRUSH_QUESTIONS: CrushQuestion[] = [
  {
    id: "message-arrives",
    targetDimension: "timingControl / obviousCrush / replyInterpretation / emotionalMasking",
    rationale: "A first-message moment reveals whether the user manages timing, shows visible warmth, analyzes tone, or masks interest without asking directly.",
    prompt: {
      ko: "좋아하는 사람에게서 메시지가 왔습니다. 아직 답장을 누르기 전입니다.\n당신에게 가장 가까운 반응은?",
      en: "You get a message from your crush. You have not replied yet.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "지금 바로 답하기보다 잠깐 숨 고르고 자연스럽게 보낸다", en: "I pause for a moment and reply naturally instead of instantly." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "나도 모르게 답장이 빨라지고 말투가 밝아진다", en: "Without noticing, I reply quickly and my tone gets brighter." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "문장 하나하나를 다시 보며 어떤 톤이 좋을지 생각한다", en: "I reread each line and think about the right tone." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "너무 티 날까 봐 일부러 짧고 담백하게 보낸다", en: "I keep it short and plain so it does not show too much." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "name-in-conversation",
    targetDimension: "quietAttention / friendDisguise / obviousCrush / emotionalMasking",
    rationale: "Hearing the crush's name in a casual setting shows whether attention stays hidden, becomes playful, becomes visible, or gets covered.",
    prompt: {
      ko: "좋아하는 사람의 이름이 대화 중에 갑자기 나왔습니다.\n당신에게 가장 가까운 반응은?",
      en: "Your crush's name suddenly comes up in conversation.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "별일 아닌 척하지만 귀가 먼저 그쪽으로 열린다", en: "I act casual, but my ears immediately tune in." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "괜히 장난스럽게 반응하며 분위기를 가볍게 만든다", en: "I react playfully to keep the mood light." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "나도 모르게 표정이 바뀌어서 친구가 눈치챈다", en: "My face changes before I notice, and a friend catches it." }, weights: { "obvious-crush": 2 } },
      { id: "d", text: { ko: "일부러 관심 없는 척 다른 이야기로 넘긴다", en: "I pretend not to care and move to another topic." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "small-favor",
    targetDimension: "quietMemory / obviousCrush / friendDisguise / emotionalMasking",
    rationale: "A small favor measures how the user approaches closeness through memory, visible eagerness, casual friendliness, or delayed response.",
    prompt: {
      ko: "그 사람이 작은 부탁을 했습니다. 사실 누구나 해줄 수 있는 일입니다.\n당신에게 가장 가까운 반응은?",
      en: "They ask for a small favor. It is something anyone could help with.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "자연스럽게 도와주지만 속으로 오래 기억한다", en: "I help naturally, but remember it for a long time." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "필요 이상으로 빨리 움직였다가 스스로 민망해진다", en: "I move a little too quickly and feel embarrassed afterward." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "친구처럼 장난치며 도와준다", en: "I help while joking like a friend." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "너무 티 날까 봐 일부러 한 박자 늦게 반응한다", en: "I respond a beat late so it does not look too obvious." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "friend-asks",
    targetDimension: "quietMasking / obviousCrush / friendDisguise / avoidance",
    rationale: "A friend's sudden question reveals how the user protects or leaks feelings when observed by others.",
    prompt: {
      ko: "친구가 “너 걔 좋아하지?”라고 갑자기 물었습니다.\n당신에게 가장 가까운 반응은?",
      en: "A friend suddenly asks, “You like them, don't you?”\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "웃으면서 넘기지만 속으로는 당황한다", en: "I laugh it off, but inside I panic a little." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "너무 강하게 부정해서 오히려 더 수상해진다", en: "I deny it so strongly that it becomes more suspicious." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "“아니 그냥 친한 거지” 하고 친구 모드로 포장한다", en: "I say, “No, we're just close,” and frame it as friendship." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "대답을 피하고 다른 이야기로 넘긴다", en: "I avoid answering and change the subject." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "unexpected-compliment",
    targetDimension: "replyInterpretation / obviousCrush / friendDisguise / timingControl",
    rationale: "Unexpected praise shows whether the user stores meaning, reacts visibly, jokes it away, or keeps the moment proportionate.",
    prompt: {
      ko: "그 사람에게서 예상치 못한 칭찬을 들었습니다.\n당신에게 가장 가까운 반응은?",
      en: "They unexpectedly compliment you.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "고맙다고만 말하지만 그 문장을 하루 종일 떠올린다", en: "I only say thanks, but replay the sentence all day." }, weights: { "reply-overthinker": 2, "quiet-observer": 1 } },
      { id: "b", text: { ko: "바로 표정이 밝아져서 숨기기 어렵다", en: "My face lights up immediately, and it is hard to hide." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "괜히 장난스럽게 받아치며 티를 줄인다", en: "I answer playfully to make it feel less obvious." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "의미를 너무 크게 두지 않으려고 일부러 넘긴다", en: "I intentionally let it pass so I do not over-interpret it." }, weights: { "waiting-moment": 2, "acting-cold": 1 } },
    ],
  },
  {
    id: "group-chat-reaction",
    targetDimension: "balancedTiming / friendDisguise / replyInterpretation / secretFantasy",
    rationale: "A small public reaction in a group chat captures how the user handles ambiguous attention without making the pattern obvious.",
    prompt: {
      ko: "단체 대화방에서 그 사람이 당신의 말에만 짧게 반응했습니다.\n당신에게 가장 가까운 반응은?",
      en: "In a group chat, they briefly react only to your message.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "좋은 반응으로 받아들이고 더 크게 만들지는 않는다", en: "I take it as a nice response and do not make it bigger." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "바로 농담을 이어가며 분위기를 가볍게 만든다", en: "I keep the joke going and make the mood lighter." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "그 반응이 어떤 의미인지 계속 곱씹는다", en: "I keep thinking about what that reaction meant." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "대화 흐름을 다시 보며 혼자 작은 장면을 만든다", en: "I reread the flow and build a small scene in my head." }, weights: { "secret-drama": 2 } },
    ],
  },
  {
    id: "unexpected-meeting",
    targetDimension: "quietObservation / obviousCrush / friendDisguise / emotionalMasking",
    rationale: "An unprepared meeting makes body language, friendly cover, and masking patterns easier to infer indirectly.",
    prompt: {
      ko: "준비하지 못한 순간에 그 사람을 마주쳤습니다.\n당신에게 가장 가까운 반응은?",
      en: "You run into them at a moment when you are not prepared.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "짧게 인사하고 지나가지만 표정과 분위기는 오래 기억한다", en: "I greet them briefly and pass by, but remember their expression and mood." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "당황해서 말투나 목소리가 평소와 달라진다", en: "I get flustered, and my voice or tone changes." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "일부러 편한 친구처럼 인사하고 장난친다", en: "I intentionally greet them like a casual friend and joke around." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "긴장한 티가 날까 봐 눈을 피하고 지나간다", en: "I avoid eye contact and pass by so my nerves do not show." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "late-reply",
    targetDimension: "balancedTiming / replyInterpretation / cannotLetGo / emotionalMasking",
    rationale: "A delayed reply is ambiguous enough to distinguish calm pacing, over-interpretation, renewed attachment, and defensive distance.",
    prompt: {
      ko: "그 사람의 답장이 평소보다 늦게 왔습니다.\n당신에게 가장 가까운 반응은?",
      en: "Their reply comes later than usual.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "바빴을 수 있다고 보고 내 일로 돌아간다", en: "I assume they may have been busy and return to my own things." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "늦어진 이유와 말투를 계속 연결해본다", en: "I keep connecting the delay with their tone." }, weights: { "reply-overthinker": 2 } },
      { id: "c", text: { ko: "정리하려던 중인데 답장 하나에 다시 기대하게 된다", en: "I was trying to move on, but one reply makes me hope again." }, weights: { "cant-let-go": 2 } },
      { id: "d", text: { ko: "나도 바로 답하지 않고 거리를 맞추려 한다", en: "I do not reply right away either and try to match the distance." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "seen-with-someone",
    targetDimension: "quietHurt / replyInterpretation / friendDisguise / balancedPerspective",
    rationale: "Seeing the crush with someone else tests whether the user stores hurt, analyzes the scene, performs normality, or keeps the context balanced.",
    prompt: {
      ko: "그 사람이 다른 사람과 꽤 편하게 웃고 있는 모습을 봤습니다.\n당신에게 가장 가까운 반응은?",
      en: "You see them laughing comfortably with someone else.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "티 내지 않지만 그 장면이 오래 남는다", en: "I do not show it, but the scene stays with me." }, weights: { "quiet-observer": 2, "cant-let-go": 1 } },
      { id: "b", text: { ko: "둘 사이가 어떤 분위기인지 자꾸 해석하게 된다", en: "I keep interpreting the mood between them." }, weights: { "reply-overthinker": 2 } },
      { id: "c", text: { ko: "괜히 더 밝게 굴며 아무렇지 않은 척한다", en: "I act brighter than usual and pretend it is nothing." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "그럴 수 있다고 보고 섣불리 의미를 붙이지 않는다", en: "I accept that it can happen and avoid adding meaning too quickly." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "trying-to-give-up",
    targetDimension: "cannotLetGo / balancedTiming / secretFantasy / emotionalMasking",
    rationale: "A renewed contact after deciding to move on reveals whether feelings reattach, stay paced, become imagined, or get covered.",
    prompt: {
      ko: "마음을 접으려고 했는데, 그 사람이 먼저 말을 걸었습니다.\n당신에게 가장 가까운 반응은?",
      en: "You were trying to move on, but they speak to you first.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "정리한 줄 알았는데 다시 설렌다", en: "I thought I had moved on, but I feel excited again." }, weights: { "cant-let-go": 2 } },
      { id: "b", text: { ko: "반갑지만 상황을 천천히 보려고 한다", en: "I am glad, but try to read the situation slowly." }, weights: { "waiting-moment": 2 } },
      { id: "c", text: { ko: "이 타이밍에 말을 건 이유를 혼자 오래 상상한다", en: "I keep imagining why they chose this timing." }, weights: { "secret-drama": 2 } },
      { id: "d", text: { ko: "흔들리는 게 싫어서 일부러 담담하게 군다", en: "I act calm on purpose because I do not want to be shaken." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "alone-together",
    targetDimension: "quietAttention / friendDisguise / obviousCrush / replyInterpretation",
    rationale: "A quiet moment alone exposes whether the user goes inward, uses friendliness, visibly reacts, or monitors the mood.",
    prompt: {
      ko: "잠깐 둘만 남게 되었습니다. 어색하지는 않지만 평소보다 조용합니다.\n당신에게 가장 가까운 반응은?",
      en: "You briefly end up alone together. It is not awkward, but quieter than usual.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "무슨 말을 할지 고르느라 조용해진다", en: "I get quiet while choosing what to say." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "어색함을 줄이려고 가벼운 농담을 꺼낸다", en: "I bring up a light joke to reduce the awkwardness." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "평소보다 리액션이 커져서 스스로도 느낀다", en: "My reactions get bigger than usual, and I notice it too." }, weights: { "obvious-crush": 2 } },
      { id: "d", text: { ko: "침묵의 의미까지 신경 쓰이기 시작한다", en: "I start paying attention even to the meaning of the silence." }, weights: { "reply-overthinker": 2 } },
    ],
  },
  {
    id: "social-post",
    targetDimension: "quietObservation / replyInterpretation / secretFantasy / balancedTiming",
    rationale: "A neutral social post is ambiguous enough to show whether the user stores details, over-reads intention, imagines a story, or keeps it light.",
    prompt: {
      ko: "그 사람이 올린 평범한 게시물을 보았습니다.\n당신에게 가장 가까운 반응은?",
      en: "You see an ordinary post they uploaded.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "조용히 보고 작은 취향을 기억해둔다", en: "I quietly notice it and remember a small preference." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "누구를 향한 말인지 괜히 생각하게 된다", en: "I start wondering who the post might be for." }, weights: { "reply-overthinker": 2 } },
      { id: "c", text: { ko: "사진 한 장으로 혼자 장면을 이어 붙인다", en: "I build a whole scene from one photo." }, weights: { "secret-drama": 2 } },
      { id: "d", text: { ko: "그냥 지나가되 다음 대화 소재로만 가볍게 남겨둔다", en: "I let it pass, but keep it lightly as a possible conversation topic." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "extra-helpful",
    targetDimension: "obviousCrush / quietObservation / friendDisguise / timingControl",
    rationale: "Helping when not required reveals whether the user becomes visibly present, quietly assesses need, hides it as friendliness, or waits for natural timing.",
    prompt: {
      ko: "그 사람이 곤란해 보이는 순간을 봤습니다. 당장 당신이 나서지 않아도 되는 상황입니다.\n당신에게 가장 가까운 반응은?",
      en: "You see them looking stuck. You do not necessarily need to step in.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "필요 이상으로 도와주고 나서야 내가 티 냈다는 걸 깨닫는다", en: "I help more than necessary and only later realize I made it obvious." }, weights: { "obvious-crush": 2 } },
      { id: "b", text: { ko: "먼저 상황을 살피고 정말 필요할 때만 돕는다", en: "I watch first and help only if it is really needed." }, weights: { "quiet-observer": 2 } },
      { id: "c", text: { ko: "친구처럼 툭 도와주고 장난으로 넘긴다", en: "I help casually like a friend and turn it into a joke." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "주변 흐름을 보며 자연스럽게 도울 타이밍을 기다린다", en: "I read the room and wait for a natural timing to help." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "reply-tone-change",
    targetDimension: "replyInterpretation / secretFantasy / obviousCrush / balancedTiming",
    rationale: "A slightly warmer message exchange captures interpretation, private fantasy, visible excitement, and proportionate pacing.",
    prompt: {
      ko: "그 사람과 메시지를 주고받다 보니 분위기가 조금 좋아진 것 같습니다.\n당신에게 가장 가까운 반응은?",
      en: "While messaging them, the mood seems to get a little warmer.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "말투가 바뀐 지점을 계속 확인한다", en: "I keep checking where their tone changed." }, weights: { "reply-overthinker": 2 } },
      { id: "b", text: { ko: "이 대화가 시작점일지도 모른다는 상상을 한다", en: "I imagine this conversation might be a beginning." }, weights: { "secret-drama": 2 } },
      { id: "c", text: { ko: "신나서 답장이 점점 빨라지고 길어진다", en: "I get excited, so my replies become faster and longer." }, weights: { "obvious-crush": 2 } },
      { id: "d", text: { ko: "좋게 느끼지만 오늘은 이 정도로 자연스럽게 둔다", en: "It feels nice, but I leave it naturally at this point today." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "almost-confession",
    targetDimension: "timingControl / friendDisguise / emotionalMasking / obviousCrush",
    rationale: "A nearly-confessional moment tests whether the user waits, jokes around, withdraws, or leaks feeling through tone.",
    prompt: {
      ko: "분위기가 좋아서 마음을 조금 말해도 될 것 같은 순간이 왔습니다.\n당신에게 가장 가까운 반응은?",
      en: "The mood feels good enough that you could say a little of how you feel.\nWhat reaction feels closest?",
    },
    choices: [
      { id: "a", text: { ko: "오늘 바로 말하기보다 다음 흐름을 더 본다", en: "I watch the next flow rather than saying it today." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "진심처럼 들릴까 봐 농담 섞어 돌려 말한다", en: "I wrap it in a joke so it does not sound too sincere." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "갑자기 부담스러워져서 한 발 물러선다", en: "I suddenly feel pressured and take a step back." }, weights: { "acting-cold": 2 } },
      { id: "d", text: { ko: "조심하려 해도 말투에서 좋아하는 티가 조금 난다", en: "Even while being careful, my tone gives away a little that I like them." }, weights: { "obvious-crush": 2 } },
    ],
  },
  {
    id: "long-crush",
    targetDimension: "quietObservation / friendDisguise / cannotLetGo / secretFantasy",
    rationale: "A longer crush reveals the pattern that accumulates over time: observing, disguising as friendship, failing to let go, or building an inner story.",
    prompt: {
      ko: "짝사랑이 길어질수록 당신에게 자주 생기는 일은?",
      en: "As a crush lasts longer, what happens to you most often?",
    },
    choices: [
      { id: "a", text: { ko: "그 사람에 대해 아는 것이 조용히 많아진다", en: "I quietly end up knowing more and more about them." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "친한 척하다 보니 진심을 꺼낼 타이밍이 더 어려워진다", en: "Acting close makes it harder to find the timing to be honest." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "포기하려다가 작은 신호에 계속 다시 흔들린다", en: "I try to give up, then keep getting pulled back by small signals." }, weights: { "cant-let-go": 2 } },
      { id: "d", text: { ko: "아무 일 없는 날에도 혼자 상상을 이어간다", en: "Even on uneventful days, I keep imagining scenes on my own." }, weights: { "secret-drama": 2 } },
    ],
  },
];


export function calculateCrushResult(answers: CrushAnswer[]): CrushResult {
  const scores = new Map<CrushTypeId, number>();
  for (const result of CRUSH_RESULTS) scores.set(result.id, 0);

  for (const answer of answers) {
    for (const [id, value] of Object.entries(answer.weights) as Array<[CrushTypeId, number]>) {
      scores.set(id, (scores.get(id) ?? 0) + value);
    }
  }

  let winner = CRUSH_RESULTS[0];
  let bestScore = -Infinity;
  for (const result of CRUSH_RESULTS) {
    const score = scores.get(result.id) ?? 0;
    if (score > bestScore) {
      winner = result;
      bestScore = score;
    }
  }
  return winner;
}

export function getCrushResultById(id: string | null | undefined): CrushResult | null {
  if (!id) return null;
  return CRUSH_RESULTS.find((result) => result.id === id) ?? null;
}
