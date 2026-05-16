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
    prompt: { ko: "좋아하는 사람에게서 메시지가 왔습니다. 가장 가까운 반응은?", en: "You get a message from your crush. What reaction feels closest?" },
    choices: [
      { id: "a", text: { ko: "지금 답하기 애매하면 조금 있다 차분히 답한다", en: "If now feels awkward, I wait a bit and reply calmly." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "평소처럼 장난스럽게 답하려고 한다", en: "I try to reply playfully like usual." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "답장 속도와 말투부터 신경 쓰인다", en: "I immediately notice reply speed and tone." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "티 안 나게 짧고 차분하게 답한다", en: "I reply briefly and calmly so it does not show." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "group-chat-reaction",
    prompt: { ko: "그 사람이 단체 대화방에서 내 말에만 반응했습니다. 당신은?", en: "They react only to your message in a group chat. What do you do?" },
    choices: [
      { id: "a", text: { ko: "좋게 반응했구나 하고 자연스럽게 넘긴다", en: "I take it as a nice reaction and let it pass naturally." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "바로 장난을 이어가며 분위기를 탄다", en: "I continue the joke and ride the mood." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "이게 무슨 의미인지 계속 생각한다", en: "I keep thinking about what it means." }, weights: { "reply-overthinker": 2, "secret-drama": 1 } },
      { id: "d", text: { ko: "괜히 더 무심하게 행동한다", en: "I act extra indifferent for no reason." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "unexpected-meeting",
    prompt: { ko: "우연히 마주쳤는데 준비가 하나도 안 된 상태입니다. 당신은?", en: "You unexpectedly run into them when you are not ready at all. What do you do?" },
    choices: [
      { id: "a", text: { ko: "당황해도 평소처럼 짧게 인사한다", en: "Even if I am flustered, I greet them normally and briefly." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "일부러 편하게 인사하고 장난친다", en: "I greet them casually on purpose and joke around." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "그 순간을 하루 종일 다시 떠올린다", en: "I replay that moment all day." }, weights: { "secret-drama": 2 } },
      { id: "d", text: { ko: "오히려 눈을 피하고 차갑게 지나간다", en: "I avoid eye contact and pass by coldly instead." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "late-reply",
    prompt: { ko: "그 사람이 답장을 평소보다 늦게 했습니다. 당신의 반응은?", en: "They reply later than usual. What is your reaction?" },
    choices: [
      { id: "a", text: { ko: "바쁜가 보다 하고 내 할 일을 한다", en: "I assume they are busy and keep doing my own thing." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "별일 아닌 척 친구처럼 농담한다", en: "I joke like a friend and pretend it is nothing." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "왜 늦었는지 온갖 가능성을 생각한다", en: "I think of every possible reason they replied late." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "나도 일부러 늦게 답한다", en: "I intentionally reply late too." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "friend-asks",
    prompt: { ko: "친구가 '너 혹시 걔 좋아해?'라고 물었습니다. 당신은?", en: "A friend asks, 'Do you like them?' What do you do?" },
    choices: [
      { id: "a", text: { ko: "너무 놀랐지만 침착한 척한다", en: "I am shocked but pretend to stay calm." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "'야 아니거든?' 하고 웃으면서 넘긴다", en: "I laugh and say, 'No way.'" }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "아직 확실하지 않다고 편하게 넘긴다", en: "I casually say I am not sure yet and let it pass." }, weights: { "waiting-moment": 2 } },
      { id: "d", text: { ko: "갑자기 더 무심하게 굴기 시작한다", en: "I suddenly start acting more indifferent." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "chance",
    prompt: { ko: "그 사람과 가까워질 수 있는 기회가 생겼습니다. 당신은?", en: "You get a chance to become closer to them. What do you do?" },
    choices: [
      { id: "a", text: { ko: "자연스럽게 상황을 지켜보며 움직인다", en: "I watch the situation and move naturally." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "친구처럼 편하게 다가간다", en: "I approach comfortably like a friend." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "이 기회가 무슨 의미인지 먼저 생각한다", en: "I first think about what this chance means." }, weights: { "reply-overthinker": 1, "secret-drama": 1 } },
      { id: "d", text: { ko: "들킬까 봐 괜히 거리를 둔다", en: "I keep some distance because I am afraid it will show." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "remembered-taste",
    prompt: { ko: "그 사람이 내 취향을 기억해줬습니다. 당신은?", en: "They remember your taste. What do you do?" },
    choices: [
      { id: "a", text: { ko: "고맙게 받고 자연스럽게 넘긴다", en: "I appreciate it and let the moment pass naturally." }, weights: { "waiting-moment": 2 } },
      { id: "b", text: { ko: "장난스럽게 '오 기억력 뭐야?' 하고 반응한다", en: "I playfully say, 'Wow, what a memory.'" }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "혹시 나한테 관심 있나 생각한다", en: "I wonder if they may be interested in me." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "너무 좋아 보일까 봐 반응을 줄인다", en: "I reduce my reaction so I do not look too happy." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "trying-to-give-up",
    prompt: { ko: "포기하려고 마음먹었는데, 그 사람이 먼저 말을 걸었습니다. 당신은?", en: "You decide to give up, but they talk to you first. What do you do?" },
    choices: [
      { id: "a", text: { ko: "다시 마음이 흔들리지만 티 내지 않는다", en: "My heart wavers again, but I do not show it." }, weights: { "cant-let-go": 2, "quiet-observer": 1 } },
      { id: "b", text: { ko: "평소처럼 친구처럼 대한다", en: "I treat them like a friend as usual." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "그 한마디 때문에 다시 가능성을 생각한다", en: "That one sentence makes me consider the possibility again." }, weights: { "cant-let-go": 2, "secret-drama": 1 } },
      { id: "d", text: { ko: "감정이 올라와도 상황을 보고 천천히 반응한다", en: "Even if feelings come up, I watch the situation and respond slowly." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "alone-together",
    prompt: { ko: "둘이 잠깐 단둘이 있게 되었습니다. 당신은?", en: "You briefly end up alone together. What do you do?" },
    choices: [
      { id: "a", text: { ko: "말을 고르느라 조용해질 수 있다", en: "I may get quiet while choosing my words." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "조금 어색해도 평소처럼 대화한다", en: "Even if it is a little awkward, I talk like usual." }, weights: { "waiting-moment": 2 } },
      { id: "c", text: { ko: "분위기 하나하나가 신경 쓰인다", en: "Every tiny mood shift catches my attention." }, weights: { "reply-overthinker": 1, "secret-drama": 1 } },
      { id: "d", text: { ko: "긴장해서 오히려 무심해 보인다", en: "I get nervous and end up looking indifferent." }, weights: { "acting-cold": 2 } },
    ],
  },
  {
    id: "talking-with-someone-else",
    prompt: { ko: "그 사람이 다른 사람과 친하게 이야기하는 걸 봤습니다. 당신은?", en: "You see them talking warmly with someone else. What do you do?" },
    choices: [
      { id: "a", text: { ko: "티는 안 내지만 마음에 오래 남는다", en: "I do not show it, but it stays in my mind." }, weights: { "quiet-observer": 2, "cant-let-go": 1 } },
      { id: "b", text: { ko: "괜히 장난치며 아무렇지 않은 척한다", en: "I joke around and pretend it is nothing." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "나랑은 어떤 차이가 있는지 생각한다", en: "I think about what is different compared with me." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "그럴 수 있다고 보고 내 감정을 크게 키우지 않는다", en: "I accept that it can happen and try not to inflate my feelings." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "too-early",
    prompt: { ko: "고백은 아직 너무 이르다고 느껴질 때, 당신은?", en: "When confession feels much too early, what do you do?" },
    choices: [
      { id: "a", text: { ko: "상대의 마음을 더 관찰한다", en: "I observe their feelings more." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "친구처럼 더 가까워지려고 한다", en: "I try to become closer like a friend." }, weights: { "friend-disguise": 2 } },
      { id: "c", text: { ko: "작은 신호들을 모아 확신을 얻고 싶다", en: "I want to collect small signals until I feel sure." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "지금은 속도를 늦추고 자연스럽게 지낸다", en: "For now, I slow down and keep things natural." }, weights: { "waiting-moment": 2 } },
    ],
  },
  {
    id: "long-crush",
    prompt: { ko: "짝사랑이 길어질수록 당신에게 가장 자주 생기는 일은?", en: "As a crush lasts longer, what happens to you most often?" },
    choices: [
      { id: "a", text: { ko: "상대에 대해 아는 게 점점 많아진다", en: "I gradually know more and more about them." }, weights: { "quiet-observer": 2 } },
      { id: "b", text: { ko: "친구처럼 굴다 보니 더 헷갈린다", en: "Acting like a friend makes things more confusing." }, weights: { "friend-disguise": 2, "cant-let-go": 1 } },
      { id: "c", text: { ko: "답장과 행동을 계속 분석하게 된다", en: "I keep analyzing replies and actions." }, weights: { "reply-overthinker": 2 } },
      { id: "d", text: { ko: "내 마음을 확인하되 일상은 유지하려고 한다", en: "I acknowledge my feelings while trying to keep my daily life steady." }, weights: { "waiting-moment": 2 } },
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
