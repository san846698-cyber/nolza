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
      { id: "a", text: { ko: "바로 달려가지 않고 내 템포를 지킨 뒤 자연스럽게 답한다", en: "I do not rush in; I keep my pace and reply naturally." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "좋아서 티가 나도 상관없다는 듯 빠르고 밝게 답한다", en: "I reply quickly and warmly, even if my excitement shows." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "답장 길이, 이모지, 말투까지 계산하느라 한참 고른다", en: "I spend time calculating length, emojis, and tone." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "마음이 들킬까 봐 일부러 짧고 무심한 톤을 고른다", en: "I choose a short, casual tone so my feelings do not show." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "아무렇지 않은 척 듣지만 그 사람 얘기는 하나도 놓치지 않는다", en: "I act casual, but I do not miss a single detail about them." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "친구처럼 놀리거나 농담하며 티 안 나게 끼어든다", en: "I jump in with teasing or jokes so it feels friendly, not romantic." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "표정이 먼저 반응해서 주변 사람이 바로 눈치챈다", en: "My face reacts first, and people around me notice right away." }, weights: { "obvious-crush": 2 } },
      { id: "d", text: { ko: "관심 없는 사람처럼 시선을 돌리고 다른 주제로 넘긴다", en: "I look away like I do not care and move to another topic." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "조용히 도와주고 그 사람이 고마워한 순간을 오래 간직한다", en: "I help quietly and keep the moment they thanked me for a long time." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "필요한 것보다 더 빨리 나서서 내 마음이 티 난다", en: "I jump in faster than necessary, and my feelings show." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "“이 정도는 해준다” 하며 장난스럽게 친구처럼 돕는다", en: "I help with a playful “I can do this much” friend vibe." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "너무 적극적으로 보일까 봐 일부러 한 박자 늦게 움직인다", en: "I move a beat late so I do not look too eager." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "웃으며 넘기지만 속으로는 들킨 포인트를 곱씹는다", en: "I laugh it off, but inside I replay exactly what gave me away." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "아니라고 크게 부정하는데 그 반응이 더 티 난다", en: "I deny it loudly, and the denial makes it more obvious." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "“그냥 친한 거야”라며 장난 섞어 친구 포지션으로 숨긴다", en: "I joke that we are just close and hide behind the friend position." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "눈을 피하고 “무슨 소리야” 하며 바로 화제를 바꾼다", en: "I look away, say “what are you talking about,” and change the subject." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "짧게 고맙다고 하고 나중에 그 말투와 표정을 계속 복기한다", en: "I say a short thanks, then keep replaying their tone and expression later." }, weights: { "reply-overthinker": 2, "quiet-observer": 1 } },
      { id: "b", text: { ko: "기분 좋아진 게 얼굴에 바로 떠서 숨기기 어렵다", en: "My happiness goes straight to my face, and it is hard to hide." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "“뭐야 갑자기?”처럼 장난으로 받아서 분위기를 가볍게 만든다", en: "I answer with a playful “what was that?” to keep it light." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "너무 설레기 싫어서 의미를 크게 두지 않으려 애쓴다", en: "I try not to give it too much meaning because I do not want to get swept up." }, weights: { "waiting-moment": 2, "acting-cold": 1 } },
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
      { id: "a", text: { ko: "괜찮은 신호로만 받아들이고 오늘은 더 밀어붙이지 않는다", en: "I take it as a nice signal and do not push further today." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "농담을 이어 받아 둘만 아는 장난처럼 분위기를 만든다", en: "I keep the joke going so it feels like a little shared bit." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "왜 내 말에만 반응했는지 캡처하듯 머릿속에 저장한다", en: "I mentally screenshot why they reacted only to my message." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "그 짧은 반응 하나로 혼자 썸 시작 장면을 상상한다", en: "I turn that tiny reaction into the opening scene of a crush story." }, weights: { "secret-drama": 2 } },
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
      { id: "a", text: { ko: "짧게 지나가도 옷차림, 표정, 말투를 조용히 기억한다", en: "Even if I pass by briefly, I quietly remember their look, expression, and tone." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "놀라서 목소리가 높아지고 인사가 괜히 길어진다", en: "I get surprised, my voice lifts, and the greeting gets longer." }, weights: { "obvious-crush": 2 } },
      { id: "c", text: { ko: "“어 여기서 뭐 해?” 하며 일부러 친한 친구처럼 군다", en: "I act like a casual friend with a playful “what are you doing here?”" }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "심장이 뛴 걸 들킬까 봐 눈을 피하고 빠르게 지나간다", en: "I avoid eye contact and pass quickly so my nerves do not show." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "바쁜가 보다 하고 내 하루를 계속 살려 한다", en: "I assume they are busy and try to keep living my own day." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "늦은 시간, 문장 길이, 말투까지 연결해서 의미를 찾는다", en: "I connect the delay, message length, and tone to find meaning." }, weights: { "reply-overthinker": 2 } },
      { id: "c", text: { ko: "포기하려던 마음이 답장 하나에 다시 확 살아난다", en: "One reply brings back the feelings I was trying to give up." }, weights: { "cant-let-go": 2 } },
      { id: "d", text: { ko: "상처받은 티 내기 싫어 나도 일부러 천천히 답한다", en: "I reply slowly too because I do not want to look hurt." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "겉으론 조용한데 그 웃는 장면이 오래 마음에 남는다", en: "I stay quiet outside, but that laughing scene stays with me." }, weights: { "quiet-observer": 2, "cant-let-go": 1 } },
      { id: "b", text: { ko: "둘 사이의 거리감과 표정을 보며 혼자 추리한다", en: "I privately investigate their distance and expressions." }, weights: { "reply-overthinker": 2 } },
      { id: "c", text: { ko: "괜히 더 웃기고 밝게 굴며 질투 아닌 척한다", en: "I act funnier and brighter, pretending it is not jealousy." }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "친한 사람일 수도 있다고 보고 섣불리 결론 내리지 않는다", en: "I remind myself they may just be close and avoid jumping to conclusions." }, weights: { "waiting-moment": 2 } },
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
      { id: "a", text: { ko: "정리했다고 믿었는데 한마디에 다시 마음이 돌아간다", en: "I thought I was done, but one word pulls my heart back." }, weights: { "cant-let-go": 2 } },
      { id: "b", text: { ko: "반갑지만 또 앞서가지 않으려고 속도를 늦춘다", en: "I am glad, but slow myself down so I do not get ahead of things again." }, weights: { "waiting-moment": 2 } },
      { id: "c", text: { ko: "왜 하필 지금 말 걸었는지 혼자 여러 버전을 상상한다", en: "I imagine multiple versions of why they spoke to me right now." }, weights: { "secret-drama": 2 } },
      { id: "d", text: { ko: "흔들린 걸 들키기 싫어 일부러 더 담담하게 대한다", en: "I act extra calm because I do not want them to see I am shaken." }, weights: { "acting-cold": 2 } },
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
      { id: "a", text: { ko: "말을 많이 하기보다 그 사람의 표정과 분위기를 조용히 본다", en: "Instead of talking much, I quietly watch their expression and mood." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "어색해질까 봐 가벼운 농담으로 친구 같은 공기를 만든다", en: "I use a light joke to make the air feel friendly instead of awkward." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "좋아서 리액션이 커지고 목소리까지 밝아진다", en: "Because I like them, my reactions get bigger and my voice brightens." }, weights: { "obvious-crush": 2 } },
      { id: "d", text: { ko: "말 없는 몇 초까지 ‘어색한가, 편한가’ 분석한다", en: "I analyze even a few quiet seconds: is it awkward or comfortable?" }, weights: { "reply-overthinker": 2 } },
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
      { id: "a", text: { ko: "조용히 보고 좋아하는 색, 장소, 취향 같은 걸 기억한다", en: "I quietly notice and remember their colors, places, or preferences." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "그 글이 누구에게 보여주려는 건지 혼자 해석한다", en: "I privately interpret who they might have wanted to show that post to." }, weights: { "reply-overthinker": 2 } },
      { id: "c", text: { ko: "사진 한 장으로 오늘 하루와 마음 상태까지 상상한다", en: "From one photo, I imagine their whole day and mood." }, weights: { "secret-drama": 2 } },
      { id: "d", text: { ko: "좋아하는 건 저장만 하고 당장 의미를 키우진 않는다", en: "I save what I like about it but do not make the meaning bigger right away." }, weights: { "waiting-moment": 2 } },
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
      { id: "a", text: { ko: "바로 나서서 도와주다 보니 관심이 너무 선명하게 드러난다", en: "I step in right away, and my interest becomes very obvious." }, weights: { "obvious-crush": 2 } },
      { id: "b", text: { ko: "필요한지 먼저 살피고 티 안 나게 조용히 도울 방법을 찾는다", en: "I observe first and find a quiet way to help without making it obvious." }, weights: { "quiet-observer": 2 } },
      { id: "c", text: { ko: "친구처럼 툭 도와주고 “밥 사라” 같은 장난으로 덮는다", en: "I help like a friend and cover it with a joke like “you owe me food.”" }, weights: { "friend-disguise": 2 } },
      { id: "d", text: { ko: "도와주고 싶지만 너무 앞서 보일까 봐 자연스러운 타이밍을 기다린다", en: "I want to help, but wait for a natural opening so I do not seem too eager." }, weights: { "waiting-moment": 2 } },
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
      { id: "a", text: { ko: "어느 문장부터 따뜻해졌는지 계속 되짚어본다", en: "I keep tracing which sentence made the conversation feel warmer." }, weights: { "reply-overthinker": 2 } },
      { id: "b", text: { ko: "이 대화가 우리 사이의 첫 장면일지도 모른다고 상상한다", en: "I imagine this conversation might be the first scene between us." }, weights: { "secret-drama": 2 } },
      { id: "c", text: { ko: "신난 게 답장 속도와 길이에 그대로 묻어난다", en: "My excitement shows directly in reply speed and length." }, weights: { "obvious-crush": 2 } },
      { id: "d", text: { ko: "좋지만 오늘은 여기까지 두고 다음 흐름을 기다린다", en: "It feels good, but I leave it here today and wait for the next flow." }, weights: { "waiting-moment": 2 } },
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
      { id: "a", text: { ko: "말하고 싶지만 오늘은 신호만 남기고 다음 타이밍을 본다", en: "I want to say it, but leave only a signal today and watch the next timing." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "진심 반 농담 반으로 던져서 상대 반응을 살핀다", en: "I throw it half-sincere, half-joking and watch their reaction." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "갑자기 너무 가까워지는 느낌이 들어 한 발 물러선다", en: "It suddenly feels too close, so I take a step back." }, weights: { "acting-cold": 2 } },
      { id: "d", text: { ko: "조심해도 목소리와 눈빛에서 좋아하는 티가 난다", en: "Even when I try to be careful, my voice and eyes show I like them." }, weights: { "obvious-crush": 2 } },
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
      { id: "a", text: { ko: "티는 안 내지만 그 사람의 취향과 패턴을 조용히 많이 알게 된다", en: "I do not show it, but quietly learn a lot about their tastes and patterns." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "친구처럼 가까워질수록 고백하기 더 애매해진다", en: "The closer I get as a friend, the harder it becomes to confess." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "정리하려 해도 작은 친절 하나에 다시 마음이 붙잡힌다", en: "Even when I try to move on, one small kindness pulls me back." }, weights: { "cant-let-go": 2 } },
      { id: "d", text: { ko: "현실은 조용한데 머릿속에서는 이미 여러 장면이 이어진다", en: "Reality stays quiet, but in my head several scenes keep unfolding." }, weights: { "secret-drama": 2 } },
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
