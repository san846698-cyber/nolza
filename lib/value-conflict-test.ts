export type ValueConflictId =
  | "freedom-stability"
  | "recognition-independence"
  | "truth-peace"
  | "growth-rest"
  | "love-pride"
  | "perfect-start"
  | "responsibility-freedom"
  | "stability-change"
  | "balanced-negotiator";

export type LocalText = {
  ko: string;
  en: string;
};

export type ValueChoice = {
  id: string;
  text: LocalText;
  weights: Partial<Record<ValueConflictId, number>>;
};

export type ValueQuestion = {
  id: string;
  targetDimension: string;
  rationale: string;
  prompt: LocalText;
  choices: ValueChoice[];
};

export type ValueResult = {
  id: ValueConflictId;
  title: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  conflictStructure: LocalText;
  commonThought: LocalText;
  friendComment: LocalText;
  neededSentence: LocalText;
  strength: LocalText;
  risk: LocalText;
  moment: LocalText;
  hint: LocalText;
  shareLine: LocalText;
};

export type ValueAnswer = {
  questionId: string;
  choiceId: string;
  weights: Partial<Record<ValueConflictId, number>>;
};

const RAW_VALUE_RESULTS: ValueResult[] = [
  {
    id: "freedom-stability",
    title: { ko: "자유 vs 안정", en: "Freedom vs Stability" },
    oneLiner: { ko: "떠나고 싶지만, 무너지기는 싫은 사람", en: "You want to leave, but you do not want to fall apart." },
    description: {
      ko: "당신은 새로운 가능성에 끌리지만, 이미 쌓아온 생활의 기반도 쉽게 놓지 않습니다. 변화가 설레는 순간에도 그것이 일상과 관계를 얼마나 흔들지 함께 계산하는 편입니다.",
      en: "You are drawn to new possibilities, but you do not easily let go of the base you have built. Even when change excites you, you calculate how much it might shake your daily life and relationships.",
    },
    conflictStructure: {
      ko: "마음 한쪽은 더 넓은 곳으로 나아가고 싶어 합니다. 다른 한쪽은 안정, 익숙한 사람들, 이미 만들어둔 리듬을 지키고 싶어 합니다. 마음은 짐을 싸지만, 발은 계속 땅을 확인합니다.",
      en: "One side of you wants to step into something wider. Another side wants to protect your stability, familiar people, and the rhythm you already know. Your heart packs a bag, while your feet keep checking the ground.",
    },
    commonThought: { ko: "해보고는 싶은데, 지금 가진 걸 잃으면 어떡하지?", en: "I want to try it, but what if I lose what I already have?" },
    friendComment: { ko: "너는 떠나고 싶다고 말하면서도, 안정적인 건 끝까지 붙잡는 편이야.", en: "You always say you want to leave, but you never quite let go of the stable thing." },
    neededSentence: { ko: "완벽히 안전해진 뒤에 움직일 필요는 없습니다. 작은 대비책 하나를 만들고, 한 걸음부터 옮겨도 됩니다.", en: "You do not need perfect certainty before moving. You can build one small fallback and take one step." },
    strength: { ko: "가능성과 현실적 위험을 동시에 볼 수 있어 오래 버틸 수 있는 선택을 찾는 힘이 있습니다.", en: "You can see both possibility and practical risk, so you tend to look for choices that can last." },
    risk: { ko: "완전히 준비된 느낌을 기다리다 보면, 진짜 원하는 방향이 계속 뒤로 밀릴 수 있습니다.", en: "If you wait until you feel fully ready, the direction you truly want may keep getting delayed." },
    moment: { ko: "직장, 이사, 관계의 시작처럼 생활의 기반이 흔들릴 수 있는 선택 앞에서 자주 나타납니다.", en: "It often appears before choices that could shake your base, such as changing work, moving, or beginning a new relationship." },
    hint: { ko: "완전한 안전 대신, 움직일 수 있게 해주는 최소한의 안전장치를 정해보세요.", en: "Instead of total safety, define one small fallback that lets you move." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 자유 vs 안정이 나왔다. 움직이고 싶은데 무너지기는 싫은 타입이라니 좀 아프게 맞음.", en: "My Value Conflict result is Freedom vs Stability. I want to move, but I do not want to fall apart... painfully accurate." },
  },
  {
    id: "recognition-independence",
    title: { ko: "인정 vs 독립", en: "Recognition vs Independence" },
    oneLiner: { ko: "사랑받고 싶지만, 휘둘리고 싶지는 않은 사람", en: "You want to be seen, but not controlled." },
    description: {
      ko: "당신은 타인의 반응을 무시하지 않습니다. 다만 인정받기 위해 내 기준을 너무 많이 양보하는 순간에는 마음이 불편해집니다.",
      en: "You want to be recognized, but you do not want to live by other people's expectations. Praise gives you energy, but it becomes suffocating when it starts choosing your direction.",
    },
    conflictStructure: {
      ko: "누군가의 기대에 맞추면 관계는 부드러워지지만, 내 선택이 작아지는 느낌이 듭니다. 반대로 내 뜻을 세우면 자유롭지만, 멀어질까 봐 마음 한구석이 조심스러워집니다.",
      en: "Being noticed gives you energy. But when that attention becomes the standard, your choices stop feeling fully yours. You want to do well, while staying alert to becoming someone others designed.",
    },
    commonThought: { ko: "좋게 보이고 싶긴 한데, 내가 사라지는 느낌은 싫어.", en: "I want them to think well of me, but I do not want to live for their expectations." },
    friendComment: { ko: "너는 칭찬을 좋아하면서도, 누가 시키는 대로만 하라고 하면 바로 답답해하잖아.", en: "You like being praised, but you hate when people try to define you." },
    neededSentence: { ko: "인정받고 싶은 마음은 약점이 아닙니다. 다만 인정과 허락을 구분하면 선택이 훨씬 가벼워집니다.", en: "Wanting recognition does not mean you are not independent. The final line of the standard can still be yours." },
    strength: { ko: "관계의 분위기를 읽는 감각이 좋고, 동시에 자기 기준을 잃지 않으려는 힘이 있습니다.", en: "You can read other people's expectations while trying to keep your own standard." },
    risk: { ko: "거절당할까 봐 지나치게 맞추면, 나중에는 상대보다 스스로에게 더 서운해질 수 있습니다.", en: "The stronger the need for approval becomes, the harder it may be to notice what you truly want." },
    moment: { ko: "평가, 부탁, 가족이나 가까운 사람의 기대가 걸린 선택 앞에서 두드러집니다.", en: "It appears around evaluation, achievement, and expectations from family or peers." },
    hint: { ko: "상대가 좋아할 선택과 내가 감당할 수 있는 선택을 따로 적어보세요.", en: "Write separately what you want to hear from others and what you want to protect for yourself." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 인정 vs 독립이 나왔다. 사랑받고 싶은데 휘둘리긴 싫은 타입이라니 너무 나 같음.", en: "My Value Conflict result is Recognition vs Independence. I want to be seen, but not controlled... very me." },
  },
  {
    id: "truth-peace",
    title: { ko: "진실 vs 평화", en: "Truth vs Peace" },
    oneLiner: { ko: "솔직하고 싶지만, 관계가 깨지는 건 두려운 사람", en: "You want honesty, but not unnecessary conflict." },
    description: {
      ko: "당신에게는 사실을 바로잡고 싶은 마음과, 지금의 분위기를 지키고 싶은 마음이 함께 있습니다. 그래서 말해야 할 때를 오래 고르는 편입니다.",
      en: "You want to say what is true, but you are careful because honesty can disturb a relationship or mood. Holding it in feels heavy, yet saying it may hurt someone.",
    },
    conflictStructure: {
      ko: "진실을 말하면 속은 시원하지만 누군가 상처받을 수 있습니다. 조용히 넘어가면 평화는 지켜지지만 내 안에는 찝찝함이 남습니다. 당신은 그 사이에서 말의 온도와 타이밍을 계속 재봅니다.",
      en: "To you, words are not just information; they change the emotional temperature of a relationship. Even when you know the truth, you pause to sense how much honesty is safe for everyone involved.",
    },
    commonThought: { ko: "말해야 하는 건 아는데, 지금 말하면 너무 커지지 않을까?", en: "I should say it, but what if I ruin the mood?" },
    friendComment: { ko: "너는 그냥 넘어가는 것 같아도, 속으로는 계속 정리하고 있더라.", en: "You rehearse uncomfortable conversations in your head so much." },
    neededSentence: { ko: "평화를 지키는 것과 침묵하는 것은 다릅니다. 부드럽게 말해도 충분히 진실할 수 있습니다.", en: "Words that protect peace and words that hide truth are not the same. You can be gentle and still be honest." },
    strength: { ko: "상대의 감정과 상황의 흐름을 함께 고려하기 때문에, 불필요한 충돌을 줄이는 힘이 있습니다.", en: "You consider both emotional temperature and the weight of words, which gives you a careful kind of honesty." },
    risk: { ko: "너무 오래 참고 넘기면, 나중에는 더 작은 말도 크게 터질 수 있습니다.", en: "If you keep postponing important truths to preserve peace, distance may grow quietly." },
    moment: { ko: "오해, 거짓말, 불편한 농담, 관계의 선을 넘는 말 앞에서 자주 드러납니다.", en: "It appears when an uncomfortable but necessary conversation is waiting." },
    hint: { ko: "상대를 이기려는 말이 아니라, 관계를 지키기 위해 필요한 사실 한 문장부터 꺼내보세요.", en: "Instead of dropping the whole truth at once, start with a sentence the other person can receive." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 진실 vs 평화가 나왔다. 솔직하고 싶은데 분위기 깨지는 건 싫은 사람.", en: "My Value Conflict result is Truth vs Peace. I want to be honest, but I hate breaking the mood... accurate." },
  },
  {
    id: "growth-rest",
    title: { ko: "성장 vs 휴식", en: "Growth vs Rest" },
    oneLiner: { ko: "더 나아지고 싶지만, 계속 버티기만 할 수는 없는 사람", en: "You want to grow, but you are already tired." },
    description: {
      ko: "당신은 지금보다 나아지고 싶은 욕구가 큽니다. 하지만 몸과 마음이 보내는 피로 신호도 무시하기 어렵습니다.",
      en: "You strongly want to improve, but you also deeply need rest. Stopping feels like falling behind, while continuing feels like wearing yourself down.",
    },
    conflictStructure: {
      ko: "성장은 당신에게 중요한 의미를 줍니다. 동시에 휴식은 무너뜨리지 않고 오래 가기 위한 조건입니다. 당신 안에서는 더 밀어붙이고 싶은 마음과 잠시 멈춰야 한다는 감각이 계속 줄다리기를 합니다.",
      en: "Your desire to improve is very clear. But as it grows, rest can start feeling like laziness, and the list of things to do can sound louder than the signals from your body.",
    },
    commonThought: { ko: "쉬어야 하는 건 아는데, 쉬면 뒤처질 것 같아.", en: "I know I need rest, but if I rest now, it feels like I am the only one stopping." },
    friendComment: { ko: "너는 쉬는 중에도 뭔가 해야 할 것 같다고 말하잖아.", en: "Even when you rest, you are already planning the next thing in your head." },
    neededSentence: { ko: "휴식은 성장의 반대가 아닙니다. 오래 가기 위해 리듬을 되찾는 시간입니다.", en: "Rest is not the opposite of growth; it is one way to make growth last." },
    strength: { ko: "자기 발전에 대한 감각이 살아 있고, 스스로를 더 좋은 방향으로 이끌려는 힘이 있습니다.", en: "You do not give up on your potential easily." },
    risk: { ko: "휴식을 죄책감으로만 느끼면, 결국 성장을 위한 에너지도 함께 줄어듭니다.", en: "If rest feels like failure, it becomes easier to burn out even on things you care about." },
    moment: { ko: "번아웃 직전, 새 목표를 세우는 순간, 쉬는 날에도 마음이 바쁜 때 나타납니다.", en: "It appears in areas that require consistency, like study, work, self-improvement, or exercise." },
    hint: { ko: "오늘의 성장을 ‘더 하기’가 아니라 ‘회복해서 유지하기’로 바꿔보세요.", en: "Put rest on the schedule as something that protects tomorrow's energy." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 성장 vs 휴식이 나왔다. 쉬어야 하는데 뒤처질까 봐 쉬지를 못하는 타입.", en: "My Value Conflict result is Growth vs Rest. I want to improve, but I am already tired... that hit." },
  },
  {
    id: "love-pride",
    title: { ko: "사랑 vs 자존심", en: "Love vs Pride" },
    oneLiner: { ko: "다가가고 싶지만, 먼저 무너지고 싶지는 않은 사람", en: "You want to reach out, but not lose yourself first." },
    description: {
      ko: "당신은 마음이 있는 사람에게 쉽게 무심해지지 못합니다. 다만 내 마음이 가벼워 보이거나, 내가 더 매달리는 사람처럼 보이는 것은 조심합니다.",
      en: "You can care deeply about someone, but you do not easily drop your pride or boundaries. Because your feelings matter, you become careful; because you do not want to be hurt, you become firm first.",
    },
    conflictStructure: {
      ko: "사랑은 가까이 가고 싶게 만들지만, 자존심은 나를 지키라고 말합니다. 그래서 당신은 연락 한 번, 사과 한마디, 표현 하나에도 마음의 무게를 많이 재는 편입니다.",
      en: "Giving your heart is never a casual thing for you. The closer you want to get, the more you check whether you are giving too much of yourself away.",
    },
    commonThought: { ko: "보고 싶은데, 내가 먼저 그러면 너무 지는 것 같아.", en: "If I reach out first, will it look like I lost?" },
    friendComment: { ko: "너는 마음은 큰데 티를 낼 때까지 시간이 오래 걸려.", en: "When you care, you act like you do not. But honestly, it shows." },
    neededSentence: { ko: "마음을 표현한다고 해서 당신의 가치가 낮아지는 것은 아닙니다. 다만 표현의 방식은 당신답게 고르면 됩니다.", en: "Reaching out first does not mean lowering yourself. Sometimes it is not giving up pride; it is saving the connection." },
    strength: { ko: "관계 안에서도 자신을 잃지 않으려는 감각이 있고, 쉽게 휩쓸리지 않는 힘이 있습니다.", en: "You try not to lose yourself inside relationships." },
    risk: { ko: "자존심을 보호하느라 필요한 표현까지 늦추면, 상대는 마음이 없는 줄 오해할 수 있습니다.", en: "Your self-protection may look like distance to the other person." },
    moment: { ko: "연락, 사과, 고백, 화해처럼 먼저 손을 내밀어야 하는 순간에 자주 나타납니다.", en: "It appears when you need to reveal your heart: apologizing, reconciling, confessing, or texting first." },
    hint: { ko: "이기는 표현보다 진짜 마음을 덜 다치게 전하는 표현을 찾아보세요.", en: "Remember that you can express care while still keeping a boundary." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 사랑 vs 자존심이 나왔다. 다가가고 싶은데 먼저 지는 느낌은 싫은 타입.", en: "My Value Conflict result is Love vs Pride. I want to reach out, but not lose myself first... ouch." },
  },
  {
    id: "perfect-start",
    title: { ko: "완벽 vs 시작", en: "Perfection vs Starting" },
    oneLiner: { ko: "제대로 하고 싶어서, 시작이 늦어지는 사람", en: "You start late because you want to do it well." },
    description: {
      ko: "당신은 대충 시작하는 것보다 잘 준비된 시작을 선호합니다. 그래서 기준이 높아질수록 첫걸음이 더 무거워질 때가 있습니다.",
      en: "You want to begin, but often hesitate because you feel unprepared. Your standards help you imagine a strong result, but that image can make the first step feel heavy.",
    },
    conflictStructure: {
      ko: "완벽함은 결과를 지키고 싶다는 마음에서 옵니다. 시작은 불완전함을 감수해야 가능해집니다. 당신 안에서는 잘하고 싶은 마음과 일단 해봐야 알 수 있다는 감각이 부딪힙니다.",
      en: "Inside you, the finished version is already vivid. The problem is that the image is so clear, it becomes hard to allow the awkward first version to exist.",
    },
    commonThought: { ko: "조금만 더 준비하고 시작하면 더 잘할 수 있을 것 같은데.", en: "It does not feel ready enough to begin yet." },
    friendComment: { ko: "너는 시작하기 전 자료조사만 해도 이미 프로젝트 하나야.", en: "Once you start, you do well. You just set the bar way too high before beginning." },
    neededSentence: { ko: "완벽한 시작보다 수정할 수 있는 첫 버전이 더 멀리 데려갈 때가 많습니다.", en: "A first draft is not a failed final version. It is the entrance to the final version." },
    strength: { ko: "기준이 분명하고, 결과물의 완성도를 끝까지 끌어올리는 힘이 있습니다.", en: "You care about quality and do not want to do things carelessly." },
    risk: { ko: "처음부터 완벽하려고 하면 경험으로 배울 기회를 놓칠 수 있습니다.", en: "Waiting for perfect readiness may keep delaying the start itself." },
    moment: { ko: "새로운 일, 창작, 공부, 프로젝트를 시작하기 직전에 특히 강하게 나타납니다.", en: "It appears before new projects, writing, study plans, or public attempts." },
    hint: { ko: "오늘은 완성본이 아니라 ‘고칠 수 있는 초안’을 목표로 잡아보세요.", en: "Separate the standard for the final version from the standard for the first try." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 완벽 vs 시작이 나왔다. 제대로 하려다가 시작이 늦어지는 사람.", en: "My Value Conflict result is Perfection vs Starting. I start late because I want to do it well... cannot deny it." },
  },
  {
    id: "responsibility-freedom",
    title: { ko: "책임 vs 자유", en: "Responsibility vs Freedom" },
    oneLiner: { ko: "맡은 것을 지키고 싶지만, 숨 쉴 공간도 필요한 사람", en: "You want to run, but cannot abandon what you carry." },
    description: {
      ko: "당신은 책임을 가볍게 여기지 않습니다. 그래서 누군가 기대하거나 의지하는 상황에서 쉽게 빠져나오지 못합니다.",
      en: "You want freedom, but you cannot easily ignore the people and responsibilities you carry. Even when you want rest, you worry someone may struggle if you step away.",
    },
    conflictStructure: {
      ko: "책임은 당신에게 신뢰와 의미를 줍니다. 하지만 자유는 당신이 소진되지 않기 위해 꼭 필요한 숨구멍입니다. 당신은 해야 할 일과 내가 살 수 있는 공간 사이에서 균형을 찾으려 합니다.",
      en: "You dream of freedom, but you quickly imagine the space you would leave behind. Before your mind gets far, responsibility catches your ankle.",
    },
    commonThought: { ko: "내가 안 하면 안 될 것 같은데, 이대로는 너무 답답해.", en: "I want to step away too, but if I do not do it, who will?" },
    friendComment: { ko: "너는 힘들어도 맡은 건 끝까지 하려고 하잖아.", en: "You say you want freedom, but you still carry things to the end." },
    neededSentence: { ko: "책임을 다한다는 것은 모든 것을 혼자 짊어진다는 뜻이 아닙니다.", en: "Being responsible does not mean carrying every weight alone." },
    strength: { ko: "신뢰를 오래 쌓는 힘이 있고, 쉽게 도망치지 않는 안정감이 있습니다.", en: "You have the strength to remain dependable." },
    risk: { ko: "도움을 요청하지 못하면 책임감이 결국 원망으로 바뀔 수 있습니다.", en: "If you carry what is not yours, freedom may start to feel like guilt." },
    moment: { ko: "팀, 가족, 관계, 일정처럼 나를 필요로 하는 일이 겹칠 때 나타납니다.", en: "It appears when family, team, or relationships make you feel like you cannot step out." },
    hint: { ko: "지켜야 할 책임과 나눌 수 있는 책임을 구분해보세요.", en: "Instead of asking whether to abandon responsibility, define which part is truly yours." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 책임 vs 자유가 나왔다. 맡은 건 지키고 싶은데 숨 쉴 공간도 필요한 타입.", en: "My Value Conflict result is Responsibility vs Freedom. I want to run, but I cannot drop what I carry... too real." },
  },
  {
    id: "stability-change",
    title: { ko: "안정 vs 변화", en: "Stability vs Change" },
    oneLiner: { ko: "익숙함이 편하지만, 이대로만 살고 싶지는 않은 사람", en: "Things are okay now, but staying the same feels uneasy." },
    description: {
      ko: "당신은 안정된 리듬에서 힘을 얻습니다. 하지만 같은 자리에 너무 오래 머무르면 마음 한쪽에서 변화의 신호가 올라옵니다.",
      en: "You want stability, yet you feel uneasy that without change you may become stuck. You value your current peace, but worry it may make you smaller over time.",
    },
    conflictStructure: {
      ko: "안정은 당신을 지탱합니다. 변화는 당신을 깨웁니다. 당신은 지금의 삶을 무너뜨리지 않으면서도, 조금 다른 가능성을 열고 싶어 합니다.",
      en: "You dislike change that breaks things, but time with nothing changing also makes you uneasy. You want to protect the present, while another part keeps searching for new air.",
    },
    commonThought: { ko: "지금도 나쁘지 않은데, 계속 이렇게만 가도 괜찮을까?", en: "Things are not bad now, but what if I am the only one standing still?" },
    friendComment: { ko: "너는 편한 걸 좋아하지만, 가끔 갑자기 뭔가 바꾸고 싶어 하더라.", en: "You like stability, but you get restless inside it so fast." },
    neededSentence: { ko: "변화는 꼭 모든 것을 뒤엎는 방식일 필요가 없습니다. 작은 실험도 충분한 변화가 될 수 있습니다.", en: "It does not have to be a huge change. One small experiment can loosen the feeling of being stuck." },
    strength: { ko: "기반을 지키면서도 새로운 가능성을 살피는 균형감이 있습니다.", en: "You can see both the value of the present and the possibility of the future." },
    risk: { ko: "불편함을 피하려고만 하면, 필요한 변화까지 너무 늦게 알아차릴 수 있습니다.", en: "Both staying and changing may feel uncertain, creating decision fatigue." },
    moment: { ko: "일상이 안정됐지만 마음이 답답하거나, 새 선택지가 반복해서 떠오를 때 나타납니다.", en: "It appears when life, work, or relationships are not bad, but still feel quietly tight." },
    hint: { ko: "큰 결정을 내리기 전, 일주일짜리 작은 변화부터 시험해보세요.", en: "Try a small experiment before a major change; it lets stability and change coexist." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 안정 vs 변화가 나왔다. 익숙함은 좋은데 이대로만 살고 싶지는 않은 사람.", en: "My Value Conflict result is Stability vs Change. Things are okay, but staying the same feels wrong... yep." },
  },
  {
    id: "balanced-negotiator",
    title: { ko: "균형 조율형", en: "Balanced Negotiator" },
    oneLiner: { ko: "흔들려도 바로 한쪽으로 치우치지 않는 사람", en: "You can feel pulled without immediately choosing an extreme." },
    description: {
      ko: "당신은 중요한 선택 앞에서 감정과 현실을 함께 보려는 사람입니다. 확신이 없다고 해서 멈추기만 하지 않고, 불안하다고 해서 무작정 뛰어들지도 않습니다.",
      en: "You try to hold both feeling and reality when decisions matter. Lack of certainty does not always freeze you, and anxiety does not always push you into a rushed move.",
    },
    conflictStructure: {
      ko: "당신 안의 갈등은 어느 한 가치가 너무 강해서라기보다, 여러 가치를 동시에 존중하려는 데서 생깁니다. 그래서 선택이 늦어질 때도 있지만, 대신 쉽게 후회할 결정을 줄이는 편입니다.",
      en: "Your conflict often comes from respecting several values at once rather than being ruled by only one. That can slow your decisions, but it also helps you avoid choices you would regret too quickly.",
    },
    commonThought: { ko: "지금 당장 결론 내리기보다, 조금 더 보고 정해도 되지 않을까?", en: "Maybe I do not have to decide this instantly. I can watch a little more." },
    friendComment: { ko: "너는 바로 확정 안 하고, 일단 상황을 좀 보잖아.", en: "You usually do not decide immediately. You watch the situation first." },
    neededSentence: { ko: "모든 답을 한 번에 정하지 않아도 됩니다. 작은 확인과 작은 선택을 반복해도 충분히 앞으로 갈 수 있습니다.", en: "You do not have to settle every answer at once. Small checks and small choices can still move you forward." },
    strength: { ko: "극단으로 치우치기 전에 상황을 넓게 보는 힘이 있습니다.", en: "You can look at the wider situation before leaning too far into an extreme." },
    risk: { ko: "너무 오래 조율하다 보면 선택 자체가 늦어질 수 있습니다.", en: "If you keep negotiating internally for too long, the choice itself may be delayed." },
    moment: { ko: "정보가 아직 부족하거나, 사람과 현실이 모두 걸려 있는 선택 앞에서 자주 나타납니다.", en: "This often appears when information is incomplete or when both people and practical reality are involved." },
    hint: { ko: "정답 하나를 찾기보다, 지금 확인할 수 있는 가장 작은 기준부터 정해보세요.", en: "Instead of searching for one perfect answer, define the smallest standard you can check right now." },
    shareLine: { ko: "나는 가치관 갈등 테스트에서 균형 조율형 나왔다. 바로 결론 내리기보다 상황을 보는 타입이라는데 좀 맞는 듯.", en: "My Value Conflict result is Balanced Negotiator. I tend to watch the situation before deciding, which feels pretty accurate." },
  },
];

type ValueResultKoCopy = {
  [K in Exclude<keyof ValueResult, "id">]: string;
};

const VALUE_RESULT_KO_COPY = {
  "freedom-stability": {
    title: "자유 vs 안정",
    oneLiner: "떠나고 싶지만, 무너지기는 싫은 사람",
    description:
      "당신은 새로운 가능성에 끌리지만, 이미 쌓아온 생활의 기반도 쉽게 놓지 않습니다. 변화가 설레는 순간에도 그것이 일상과 관계를 얼마나 흔들지 함께 계산하는 편입니다.",
    conflictStructure:
      "마음 한쪽은 더 넓은 곳으로 나아가고 싶어 합니다. 다른 한쪽은 안정, 익숙한 사람들, 이미 만들어둔 리듬을 지키고 싶어 합니다. 마음은 짐을 싸지만, 발은 계속 땅을 확인합니다.",
    commonThought: "해보고는 싶은데, 지금 가진 걸 잃으면 어떡하지?",
    friendComment: "너는 떠나고 싶다고 말하면서도, 안정적인 건 끝까지 붙잡는 편이야.",
    neededSentence:
      "완벽히 안전해진 뒤에 움직일 필요는 없습니다. 작은 대비책 하나를 만들고, 한 걸음부터 옮겨도 됩니다.",
    strength:
      "가능성과 현실적 위험을 동시에 볼 수 있어 오래 버틸 수 있는 선택을 찾는 힘이 있습니다.",
    risk: "완전히 준비된 느낌을 기다리다 보면, 진짜 원하는 방향이 계속 뒤로 밀릴 수 있습니다.",
    moment: "직장, 이사, 관계의 시작처럼 생활의 기반이 흔들릴 수 있는 선택 앞에서 자주 나타납니다.",
    hint: "완전한 안전 대신, 움직일 수 있게 해주는 최소한의 안전장치를 정해보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 자유 vs 안정이 나왔다. 움직이고 싶은데 무너지기는 싫은 타입이라니 좀 아프게 맞음.",
  },
  "recognition-independence": {
    title: "인정 vs 독립",
    oneLiner: "사랑받고 싶지만, 휘둘리고 싶지는 않은 사람",
    description:
      "당신은 타인의 반응을 무시하지 않습니다. 다만 인정받기 위해 내 기준을 너무 많이 양보하는 순간에는 마음이 불편해집니다.",
    conflictStructure:
      "누군가의 기대에 맞추면 관계는 부드러워지지만, 내 선택이 작아지는 느낌이 듭니다. 반대로 내 뜻을 세우면 자유롭지만, 멀어질까 봐 마음 한구석이 조심스러워집니다.",
    commonThought: "좋게 보이고 싶긴 한데, 내가 사라지는 느낌은 싫어.",
    friendComment: "너는 칭찬을 좋아하면서도, 누가 시키는 대로만 하라고 하면 바로 답답해하잖아.",
    neededSentence:
      "인정받고 싶은 마음은 약점이 아닙니다. 다만 인정과 허락을 구분하면 선택이 훨씬 가벼워집니다.",
    strength:
      "관계의 분위기를 읽는 감각이 좋고, 동시에 자기 기준을 잃지 않으려는 힘이 있습니다.",
    risk: "거절당할까 봐 지나치게 맞추면, 나중에는 상대보다 스스로에게 더 서운해질 수 있습니다.",
    moment: "평가, 부탁, 가족이나 가까운 사람의 기대가 걸린 선택 앞에서 두드러집니다.",
    hint: "상대가 좋아할 선택과 내가 감당할 수 있는 선택을 따로 적어보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 인정 vs 독립이 나왔다. 사랑받고 싶은데 휘둘리긴 싫은 타입이라니 너무 나 같음.",
  },
  "truth-peace": {
    title: "진실 vs 평화",
    oneLiner: "솔직하고 싶지만, 관계가 깨지는 건 두려운 사람",
    description:
      "당신에게는 사실을 바로잡고 싶은 마음과, 지금의 분위기를 지키고 싶은 마음이 함께 있습니다. 그래서 말해야 할 때를 오래 고르는 편입니다.",
    conflictStructure:
      "진실을 말하면 속은 시원하지만 누군가 상처받을 수 있습니다. 조용히 넘어가면 평화는 지켜지지만 내 안에는 찝찝함이 남습니다. 당신은 그 사이에서 말의 온도와 타이밍을 계속 재봅니다.",
    commonThought: "말해야 하는 건 아는데, 지금 말하면 너무 커지지 않을까?",
    friendComment: "너는 그냥 넘어가는 것 같아도, 속으로는 계속 정리하고 있더라.",
    neededSentence:
      "평화를 지키는 것과 침묵하는 것은 다릅니다. 부드럽게 말해도 충분히 진실할 수 있습니다.",
    strength:
      "상대의 감정과 상황의 흐름을 함께 고려하기 때문에, 불필요한 충돌을 줄이는 힘이 있습니다.",
    risk: "너무 오래 참고 넘기면, 나중에는 더 작은 말도 크게 터질 수 있습니다.",
    moment: "오해, 거짓말, 불편한 농담, 관계의 선을 넘는 말 앞에서 자주 드러납니다.",
    hint: "상대를 이기려는 말이 아니라, 관계를 지키기 위해 필요한 사실 한 문장부터 꺼내보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 진실 vs 평화가 나왔다. 솔직하고 싶은데 분위기 깨지는 건 싫은 사람.",
  },
  "growth-rest": {
    title: "성장 vs 휴식",
    oneLiner: "더 나아지고 싶지만, 계속 버티기만 할 수는 없는 사람",
    description:
      "당신은 지금보다 나아지고 싶은 욕구가 큽니다. 하지만 몸과 마음이 보내는 피로 신호도 무시하기 어렵습니다.",
    conflictStructure:
      "성장은 당신에게 중요한 의미를 줍니다. 동시에 휴식은 무너뜨리지 않고 오래 가기 위한 조건입니다. 당신 안에서는 더 밀어붙이고 싶은 마음과 잠시 멈춰야 한다는 감각이 계속 줄다리기를 합니다.",
    commonThought: "쉬어야 하는 건 아는데, 쉬면 뒤처질 것 같아.",
    friendComment: "너는 쉬는 중에도 뭔가 해야 할 것 같다고 말하잖아.",
    neededSentence:
      "휴식은 성장의 반대가 아닙니다. 오래 가기 위해 리듬을 되찾는 시간입니다.",
    strength:
      "자기 발전에 대한 감각이 살아 있고, 스스로를 더 좋은 방향으로 이끌려는 힘이 있습니다.",
    risk: "휴식을 죄책감으로만 느끼면, 결국 성장을 위한 에너지도 함께 줄어듭니다.",
    moment: "번아웃 직전, 새 목표를 세우는 순간, 쉬는 날에도 마음이 바쁜 때 나타납니다.",
    hint: "오늘의 성장을 ‘더 하기’가 아니라 ‘회복해서 유지하기’로 바꿔보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 성장 vs 휴식이 나왔다. 쉬어야 하는데 뒤처질까 봐 쉬지를 못하는 타입.",
  },
  "love-pride": {
    title: "사랑 vs 자존심",
    oneLiner: "다가가고 싶지만, 먼저 무너지고 싶지는 않은 사람",
    description:
      "당신은 마음이 있는 사람에게 쉽게 무심해지지 못합니다. 다만 내 마음이 가벼워 보이거나, 내가 더 매달리는 사람처럼 보이는 것은 조심합니다.",
    conflictStructure:
      "사랑은 가까이 가고 싶게 만들지만, 자존심은 나를 지키라고 말합니다. 그래서 당신은 연락 한 번, 사과 한마디, 표현 하나에도 마음의 무게를 많이 재는 편입니다.",
    commonThought: "보고 싶은데, 내가 먼저 그러면 너무 지는 것 같아.",
    friendComment: "너는 마음은 큰데 티를 낼 때까지 시간이 오래 걸려.",
    neededSentence:
      "마음을 표현한다고 해서 당신의 가치가 낮아지는 것은 아닙니다. 다만 표현의 방식은 당신답게 고르면 됩니다.",
    strength:
      "관계 안에서도 자신을 잃지 않으려는 감각이 있고, 쉽게 휩쓸리지 않는 힘이 있습니다.",
    risk: "자존심을 보호하느라 필요한 표현까지 늦추면, 상대는 마음이 없는 줄 오해할 수 있습니다.",
    moment: "연락, 사과, 고백, 화해처럼 먼저 손을 내밀어야 하는 순간에 자주 나타납니다.",
    hint: "이기는 표현보다 진짜 마음을 덜 다치게 전하는 표현을 찾아보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 사랑 vs 자존심이 나왔다. 다가가고 싶은데 먼저 지는 느낌은 싫은 타입.",
  },
  "perfect-start": {
    title: "완벽 vs 시작",
    oneLiner: "제대로 하고 싶어서, 시작이 늦어지는 사람",
    description:
      "당신은 대충 시작하는 것보다 잘 준비된 시작을 선호합니다. 그래서 기준이 높아질수록 첫걸음이 더 무거워질 때가 있습니다.",
    conflictStructure:
      "완벽함은 결과를 지키고 싶다는 마음에서 옵니다. 시작은 불완전함을 감수해야 가능해집니다. 당신 안에서는 잘하고 싶은 마음과 일단 해봐야 알 수 있다는 감각이 부딪힙니다.",
    commonThought: "조금만 더 준비하고 시작하면 더 잘할 수 있을 것 같은데.",
    friendComment: "너는 시작하기 전 자료조사만 해도 이미 프로젝트 하나야.",
    neededSentence:
      "완벽한 시작보다 수정할 수 있는 첫 버전이 더 멀리 데려갈 때가 많습니다.",
    strength:
      "기준이 분명하고, 결과물의 완성도를 끝까지 끌어올리는 힘이 있습니다.",
    risk: "처음부터 완벽하려고 하면 경험으로 배울 기회를 놓칠 수 있습니다.",
    moment: "새로운 일, 창작, 공부, 프로젝트를 시작하기 직전에 특히 강하게 나타납니다.",
    hint: "오늘은 완성본이 아니라 ‘고칠 수 있는 초안’을 목표로 잡아보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 완벽 vs 시작이 나왔다. 제대로 하려다가 시작이 늦어지는 사람.",
  },
  "responsibility-freedom": {
    title: "책임 vs 자유",
    oneLiner: "맡은 것을 지키고 싶지만, 숨 쉴 공간도 필요한 사람",
    description:
      "당신은 책임을 가볍게 여기지 않습니다. 그래서 누군가 기대하거나 의지하는 상황에서 쉽게 빠져나오지 못합니다.",
    conflictStructure:
      "책임은 당신에게 신뢰와 의미를 줍니다. 하지만 자유는 당신이 소진되지 않기 위해 꼭 필요한 숨구멍입니다. 당신은 해야 할 일과 내가 살 수 있는 공간 사이에서 균형을 찾으려 합니다.",
    commonThought: "내가 안 하면 안 될 것 같은데, 이대로는 너무 답답해.",
    friendComment: "너는 힘들어도 맡은 건 끝까지 하려고 하잖아.",
    neededSentence:
      "책임을 다한다는 것은 모든 것을 혼자 짊어진다는 뜻이 아닙니다.",
    strength:
      "신뢰를 오래 쌓는 힘이 있고, 쉽게 도망치지 않는 안정감이 있습니다.",
    risk: "도움을 요청하지 못하면 책임감이 결국 원망으로 바뀔 수 있습니다.",
    moment: "팀, 가족, 관계, 일정처럼 나를 필요로 하는 일이 겹칠 때 나타납니다.",
    hint: "지켜야 할 책임과 나눌 수 있는 책임을 구분해보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 책임 vs 자유가 나왔다. 맡은 건 지키고 싶은데 숨 쉴 공간도 필요한 타입.",
  },
  "stability-change": {
    title: "안정 vs 변화",
    oneLiner: "익숙함이 편하지만, 이대로만 살고 싶지는 않은 사람",
    description:
      "당신은 안정된 리듬에서 힘을 얻습니다. 하지만 같은 자리에 너무 오래 머무르면 마음 한쪽에서 변화의 신호가 올라옵니다.",
    conflictStructure:
      "안정은 당신을 지탱합니다. 변화는 당신을 깨웁니다. 당신은 지금의 삶을 무너뜨리지 않으면서도, 조금 다른 가능성을 열고 싶어 합니다.",
    commonThought: "지금도 나쁘지 않은데, 계속 이렇게만 가도 괜찮을까?",
    friendComment: "너는 편한 걸 좋아하지만, 가끔 갑자기 뭔가 바꾸고 싶어 하더라.",
    neededSentence:
      "변화는 꼭 모든 것을 뒤엎는 방식일 필요가 없습니다. 작은 실험도 충분한 변화가 될 수 있습니다.",
    strength:
      "기반을 지키면서도 새로운 가능성을 살피는 균형감이 있습니다.",
    risk: "불편함을 피하려고만 하면, 필요한 변화까지 너무 늦게 알아차릴 수 있습니다.",
    moment: "일상이 안정됐지만 마음이 답답하거나, 새 선택지가 반복해서 떠오를 때 나타납니다.",
    hint: "큰 결정을 내리기 전, 일주일짜리 작은 변화부터 시험해보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 안정 vs 변화가 나왔다. 익숙함은 좋은데 이대로만 살고 싶지는 않은 사람.",
  },
  "balanced-negotiator": {
    title: "균형 조율형",
    oneLiner: "흔들려도 바로 한쪽으로 치우치지 않는 사람",
    description:
      "당신은 중요한 선택 앞에서 감정과 현실을 함께 보려는 사람입니다. 확신이 없다고 해서 멈추기만 하지 않고, 불안하다고 해서 무작정 뛰어들지도 않습니다.",
    conflictStructure:
      "당신 안의 갈등은 어느 한 가치가 너무 강해서라기보다, 여러 가치를 동시에 존중하려는 데서 생깁니다. 그래서 선택이 늦어질 때도 있지만, 대신 쉽게 후회할 결정을 줄이는 편입니다.",
    commonThought: "지금 당장 결론 내리기보다, 조금 더 보고 정해도 되지 않을까?",
    friendComment: "너는 바로 확정 안 하고, 일단 상황을 좀 보잖아.",
    neededSentence:
      "모든 답을 한 번에 정하지 않아도 됩니다. 작은 확인과 작은 선택을 반복해도 충분히 앞으로 갈 수 있습니다.",
    strength: "극단으로 치우치기 전에 상황을 넓게 보는 힘이 있습니다.",
    risk: "너무 오래 조율하다 보면 선택 자체가 늦어질 수 있습니다.",
    moment: "정보가 아직 부족하거나, 사람과 현실이 모두 걸려 있는 선택 앞에서 자주 나타납니다.",
    hint: "정답 하나를 찾기보다, 지금 확인할 수 있는 가장 작은 기준부터 정해보세요.",
    shareLine:
      "나는 가치관 갈등 테스트에서 균형 조율형 나왔다. 바로 결론 내리기보다 상황을 보는 타입이라는데 좀 맞는 듯.",
  },
} satisfies Record<ValueConflictId, ValueResultKoCopy>;

export const VALUE_RESULTS: ValueResult[] = RAW_VALUE_RESULTS.map((result) => {
  const copy = VALUE_RESULT_KO_COPY[result.id];
  return {
    ...result,
    title: { ...result.title, ko: copy.title },
    oneLiner: { ...result.oneLiner, ko: copy.oneLiner },
    description: { ...result.description, ko: copy.description },
    conflictStructure: { ...result.conflictStructure, ko: copy.conflictStructure },
    commonThought: { ...result.commonThought, ko: copy.commonThought },
    friendComment: { ...result.friendComment, ko: copy.friendComment },
    neededSentence: { ...result.neededSentence, ko: copy.neededSentence },
    strength: { ...result.strength, ko: copy.strength },
    risk: { ...result.risk, ko: copy.risk },
    moment: { ...result.moment, ko: copy.moment },
    hint: { ...result.hint, ko: copy.hint },
    shareLine: { ...result.shareLine, ko: copy.shareLine },
  };
});

export const VALUE_QUESTIONS: ValueQuestion[] = [
  {
    "id": "vc_01",
    "targetDimension": "freedom/stability/recognition/perfection/change",
    "rationale": "A tempting opportunity creates a practical dilemma where movement, safety, approval, and readiness all compete.",
    "prompt": {
      "ko": "새로운 기회가 생겼지만 지금의 안정적인 생활이 흔들릴 수 있습니다. 주변에서는 조심하라고 말하고, 마음 한쪽은 계속 끌립니다. 당신에게 가장 가까운 반응은?",
      "en": "A new opportunity appears, but it could shake your stable life. People around you tell you to be careful, while part of you keeps feeling drawn to it. What comes closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "끌리지만 지금 생활에서 흔들릴 부분부터 계산한다",
          "en": "I feel drawn to it, but first calculate what it could shake in my current life."
        },
        "weights": {
          "freedom-stability": 2,
          "stability-change": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "불안해도 작게라도 새 방향을 열어보고 싶다",
          "en": "Even if I feel nervous, I want to open a small path in the new direction."
        },
        "weights": {
          "stability-change": 2,
          "freedom-stability": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "주변 사람들이 어떻게 볼지 신경 쓰인다",
          "en": "I worry about how people around me will see it."
        },
        "weights": {
          "recognition-independence": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "준비가 충분해질 때까지 기다리고 싶다",
          "en": "I want to wait until I feel fully prepared."
        },
        "weights": {
          "perfect-start": 2
        }
      }
    ]
  },
  {
    "id": "vc_02",
    "targetDimension": "truth/peace/love/pride",
    "rationale": "An honest conversation tests whether the user prioritizes clarity, harmony, connection, or self-protection.",
    "prompt": {
      "ko": "친한 사람에게 솔직히 말해야 할 일이 생겼습니다. 말하지 않으면 계속 신경 쓰이고, 말하면 분위기가 어색해질 수 있습니다. 당신은?",
      "en": "You need to be honest with someone close. If you say nothing, it will stay on your mind; if you say it, the mood may turn awkward. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "불편해도 사실은 짚고 넘어가야 한다고 느낀다",
          "en": "Even if it is uncomfortable, I feel the truth needs to be named."
        },
        "weights": {
          "truth-peace": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "관계가 상하지 않게 부드럽게 돌려 말한다",
          "en": "I say it gently so the relationship is not hurt."
        },
        "weights": {
          "truth-peace": 1,
          "love-pride": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "감정이 가라앉은 뒤 필요한 만큼만 말한다",
          "en": "I wait until my feelings settle and say only what is needed."
        },
        "weights": {
          "balanced-negotiator": 2,
          "truth-peace": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "먼저 말하면 내가 더 매달리는 것처럼 보일까 봐 망설인다",
          "en": "I hesitate because speaking first may make me look too attached."
        },
        "weights": {
          "love-pride": 2
        }
      }
    ]
  },
  {
    "id": "vc_03",
    "targetDimension": "growth/rest/responsibility/start",
    "rationale": "A weekend tension between recovery and improvement shows which value becomes harder to put down.",
    "prompt": {
      "ko": "주말에 쉬고 싶지만, 놓치면 아쉬울 공부 모임도 있습니다. 몸은 지쳐 있고 뒤처질까 봐 불안합니다. 당신에게 가까운 쪽은?",
      "en": "You want to rest on the weekend, but there is a study session you might regret missing. Your body is tired, and your mind worries about falling behind. What feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "오늘은 회복이 먼저라 보고 쉬는 쪽을 고른다",
          "en": "I decide recovery comes first today and choose rest."
        },
        "weights": {
          "growth-rest": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "피곤해도 성장할 기회를 놓치고 싶지 않다",
          "en": "Even tired, I do not want to miss a chance to grow."
        },
        "weights": {
          "growth-rest": 2,
          "responsibility-freedom": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "짧게만 참여하고 나머지 시간은 비워둔다",
          "en": "I join briefly and leave the rest of the time open."
        },
        "weights": {
          "balanced-negotiator": 2,
          "growth-rest": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "충분히 준비하지 못한 상태로 가는 게 더 부담스럽다",
          "en": "Going without enough preparation feels more stressful."
        },
        "weights": {
          "perfect-start": 2
        }
      }
    ]
  },
  {
    "id": "vc_04",
    "targetDimension": "recognition/independence/stability/freedom",
    "rationale": "A socially expected path versus a desired path reveals tension between approval and self-direction.",
    "prompt": {
      "ko": "사람들이 기대하는 길과 내가 끌리는 길이 다릅니다. 기대를 저버리면 신경 쓰이고, 계속 맞추는 것도 답답합니다. 당신은?",
      "en": "The path people expect from you and the path you feel drawn to are different. Disappointing them bothers you, but continuing to fit their expectations feels stifling. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "내 길을 가고 싶지만 실망시킬까 봐 신경 쓰인다",
          "en": "I want to go my own way, but I worry about disappointing them."
        },
        "weights": {
          "recognition-independence": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "인정받지 못해도 내가 선택한 방향을 지키고 싶다",
          "en": "Even without approval, I want to keep the direction I chose."
        },
        "weights": {
          "recognition-independence": 2,
          "freedom-stability": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내 이유를 정리해서 차분히 설명해본다",
          "en": "I organize my reasons and explain them calmly."
        },
        "weights": {
          "balanced-negotiator": 2,
          "recognition-independence": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "아직은 안전한 길에 맞추는 편이 낫다고 느낀다",
          "en": "For now, following the safer path feels better."
        },
        "weights": {
          "freedom-stability": 2
        }
      }
    ]
  },
  {
    "id": "vc_05",
    "targetDimension": "love/pride/truth/peace",
    "rationale": "Texting first after distance measures care, pride, directness, and relational caution indirectly.",
    "prompt": {
      "ko": "중요한 사람과 며칠째 연락이 뜸합니다. 먼저 말을 걸고 싶지만, 괜히 나만 신경 쓰는 것처럼 보일까 봐 걸립니다. 당신은?",
      "en": "Communication with someone important has been quiet for days. You want to message first, but you worry it may look like you are the only one who cares. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "보고 싶으면 먼저 말할 수도 있다고 생각한다",
          "en": "If I miss them, I think I can say it first."
        },
        "weights": {
          "love-pride": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "감정이 앞서지 않도록 조금 더 기다린다",
          "en": "I wait a little longer so my feelings do not rush me."
        },
        "weights": {
          "balanced-negotiator": 1,
          "love-pride": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "먼저 숙이는 것처럼 보일까 봐 메시지를 지운다",
          "en": "I delete the message because it may look like I am giving in first."
        },
        "weights": {
          "love-pride": 2,
          "recognition-independence": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "어색하더라도 지금의 거리감을 솔직히 말한다",
          "en": "Even if it is awkward, I honestly name the distance I feel."
        },
        "weights": {
          "truth-peace": 2,
          "love-pride": 1
        }
      }
    ]
  },
  {
    "id": "vc_06",
    "targetDimension": "perfection/start/recognition/growth/change",
    "rationale": "Making unfinished work visible tests standards, fear of evaluation, and action-readiness.",
    "prompt": {
      "ko": "만들던 결과물이 거의 완성됐지만 아직 부족한 부분이 보입니다. 누군가에게 보여주면 도움이 될 수도 있고, 부끄러울 수도 있습니다. 당신은?",
      "en": "Something you are making is almost done, but you still see weak parts. Showing it to someone could help, or it could feel embarrassing. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "작게 보여주고 반응을 보며 고친다",
          "en": "I show a small version and improve it from the response."
        },
        "weights": {
          "balanced-negotiator": 2,
          "perfect-start": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "평가가 신경 쓰여 조금 더 다듬고 싶다",
          "en": "Because evaluation bothers me, I want to polish it more."
        },
        "weights": {
          "recognition-independence": 1,
          "perfect-start": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "부족해도 일단 밖으로 꺼내야 다음으로 간다",
          "en": "Even if it is imperfect, putting it out helps me move forward."
        },
        "weights": {
          "perfect-start": 2,
          "stability-change": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내 기준에 못 미치면 보여주는 게 어렵다",
          "en": "If it does not meet my standard, showing it is hard."
        },
        "weights": {
          "perfect-start": 2
        }
      }
    ]
  },
  {
    "id": "vc_07",
    "targetDimension": "responsibility/freedom/rest/recognition",
    "rationale": "A load-bearing moment distinguishes duty, relief, negotiation, and expectation pressure.",
    "prompt": {
      "ko": "맡은 일이 많아 잠깐 빠지고 싶지만, 나를 믿고 있는 사람들도 있습니다. 당신에게 가장 가까운 반응은?",
      "en": "You have many responsibilities and want to step away briefly, but people are relying on you. What comes closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "내가 맡은 건 끝까지 해야 한다고 느낀다",
          "en": "I feel I should finish what I took on."
        },
        "weights": {
          "responsibility-freedom": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "짧게라도 벗어날 시간이 필요하다",
          "en": "I need even a short time away."
        },
        "weights": {
          "responsibility-freedom": 1,
          "growth-rest": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내가 할 몫과 나눠야 할 몫을 구분해본다",
          "en": "I separate what is mine from what needs to be shared."
        },
        "weights": {
          "balanced-negotiator": 2,
          "responsibility-freedom": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "기대를 못 맞출까 봐 조금 무리하게 된다",
          "en": "I push myself because I worry about falling short of expectations."
        },
        "weights": {
          "recognition-independence": 1,
          "responsibility-freedom": 2
        }
      }
    ]
  },
  {
    "id": "vc_08",
    "targetDimension": "stability/change/freedom",
    "rationale": "A life that is not bad but feels tight reveals whether stability is comfort, fear, or stagnation.",
    "prompt": {
      "ko": "지금 생활은 나쁘지 않습니다. 그런데 이대로 괜찮은지 자꾸 생각이 납니다. 당신에게 가까운 쪽은?",
      "en": "Your current life is not bad. Still, you keep wondering whether staying like this is enough. What feels closest?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "지금 가진 안정이 흔들릴까 봐 크게 바꾸기 어렵다",
          "en": "It is hard to change much because my current stability may shake."
        },
        "weights": {
          "stability-change": 2,
          "freedom-stability": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "작은 변화를 하나 넣어보고 싶다",
          "en": "I want to add one small change."
        },
        "weights": {
          "balanced-negotiator": 2,
          "stability-change": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "이대로 멈춰버릴까 봐 불안하다",
          "en": "I feel anxious that I might become stuck like this."
        },
        "weights": {
          "stability-change": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "새로운 가능성을 찾아 떠나고 싶다",
          "en": "I want to leave and look for new possibilities."
        },
        "weights": {
          "freedom-stability": 2,
          "stability-change": 1
        }
      }
    ]
  },
  {
    "id": "vc_09",
    "targetDimension": "truth/peace/recognition/responsibility",
    "rationale": "An unfair moment creates a dilemma among speaking up, preserving peace, and public image.",
    "prompt": {
      "ko": "불공평하다고 느껴지는 상황이 생겼습니다. 말하면 갈등이 커질 수 있고, 그냥 넘기면 계속 찝찝할 것 같습니다. 당신은?",
      "en": "Something feels unfair. If you speak up, conflict may grow; if you let it pass, it may keep bothering you. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "분위기가 불편해져도 사실은 짚어야 한다고 느낀다",
          "en": "Even if the mood gets uncomfortable, I feel the truth should be addressed."
        },
        "weights": {
          "truth-peace": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "감정이 가라앉은 뒤 필요한 부분만 말한다",
          "en": "After my feelings settle, I say only the part that needs to be said."
        },
        "weights": {
          "balanced-negotiator": 2,
          "truth-peace": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "문제 만드는 사람처럼 보일까 봐 망설인다",
          "en": "I hesitate because I may look like the one creating a problem."
        },
        "weights": {
          "recognition-independence": 2,
          "truth-peace": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "평화를 지키는 것도 내 역할일 수 있다고 생각한다",
          "en": "I think keeping the peace may also be my role."
        },
        "weights": {
          "truth-peace": 1,
          "responsibility-freedom": 1
        }
      }
    ]
  },
  {
    "id": "vc_10",
    "targetDimension": "growth/rest/perfection/start",
    "rationale": "Starting a learning routine while tired tests growth drive, rest permission, and readiness standards.",
    "prompt": {
      "ko": "배우고 싶은 것이 생겼지만 이미 하루가 빡빡합니다. 시작하면 좋을 것 같고, 쉬지 못할까 봐 걱정도 됩니다. 당신은?",
      "en": "There is something you want to learn, but your days are already packed. Starting sounds good, and not resting worries you too. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "이번에는 쉬는 시간을 지키는 게 먼저라고 본다",
          "en": "This time, protecting rest comes first."
        },
        "weights": {
          "growth-rest": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "작게라도 시작해두면 흐름이 생길 것 같다",
          "en": "If I start small, a rhythm may form."
        },
        "weights": {
          "perfect-start": 1,
          "growth-rest": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "제대로 할 시간이 없으면 시작이 부담스럽다",
          "en": "If I cannot do it properly, starting feels burdensome."
        },
        "weights": {
          "perfect-start": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "일주일만 실험해보고 몸 상태를 보려 한다",
          "en": "I want to try it for a week and check how my body feels."
        },
        "weights": {
          "balanced-negotiator": 2,
          "growth-rest": 1
        }
      }
    ]
  },
  {
    "id": "vc_11",
    "targetDimension": "love/pride/truth/peace",
    "rationale": "Repairing awkwardness with someone close tests warmth, self-respect, and gentle honesty.",
    "prompt": {
      "ko": "가까운 사람과 작은 일로 어색해졌습니다. 먼저 풀고 싶지만, 나만 조급해 보일까 봐 멈칫합니다. 당신은?",
      "en": "A small issue has made things awkward with someone close. You want to smooth it over first, but you pause because it may look like only you are eager. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "관계가 중요하면 먼저 손을 내밀 수 있다",
          "en": "If the relationship matters, I can reach out first."
        },
        "weights": {
          "love-pride": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "상대도 생각할 시간을 갖게 조금 둔다",
          "en": "I give the other person some time to think too."
        },
        "weights": {
          "balanced-negotiator": 1,
          "truth-peace": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "내가 먼저 낮아지는 느낌이 들어 쉽게 못 한다",
          "en": "It feels like I am lowering myself first, so it is hard."
        },
        "weights": {
          "love-pride": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "어색한 이유를 조심스럽게 물어본다",
          "en": "I carefully ask what made things awkward."
        },
        "weights": {
          "truth-peace": 2,
          "love-pride": 1
        }
      }
    ]
  },
  {
    "id": "vc_12",
    "targetDimension": "recognition/independence/truth/peace",
    "rationale": "Hearing others discuss one’s choice reveals approval sensitivity and self-authorship.",
    "prompt": {
      "ko": "내 선택을 두고 사람들이 이런저런 말을 하는 것 같습니다. 크게 틀린 말은 아니지만 계속 신경이 쓰입니다. 당신은?",
      "en": "People seem to be talking about your choice. What they say may not be completely wrong, but it keeps bothering you. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "내 기준이 흔들리지 않게 선택한 이유를 다시 확인한다",
          "en": "I revisit my reasons so my own standard does not shake."
        },
        "weights": {
          "recognition-independence": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "평가가 계속 떠올라 방향을 바꿔야 하나 고민한다",
          "en": "Their evaluation keeps coming up, and I wonder if I should change direction."
        },
        "weights": {
          "recognition-independence": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "필요한 의견만 걸러 듣고 나머지는 내려놓는다",
          "en": "I take only the useful feedback and let the rest go."
        },
        "weights": {
          "balanced-negotiator": 2
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "오해가 있으면 조용히 바로잡고 싶다",
          "en": "If there is a misunderstanding, I want to correct it quietly."
        },
        "weights": {
          "truth-peace": 1,
          "recognition-independence": 1
        }
      }
    ]
  },
  {
    "id": "vc_13",
    "targetDimension": "responsibility/freedom/stability/change",
    "rationale": "Caring for someone while delaying one’s own plan tests responsibility boundaries.",
    "prompt": {
      "ko": "누군가를 챙기느라 내 계획이 자꾸 밀립니다. 상대에게 필요한 일인 건 알지만, 내 시간도 점점 사라지는 느낌입니다. 당신은?",
      "en": "Your own plans keep getting delayed because you are taking care of someone. You know they need help, but your time feels like it is disappearing. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "내가 맡은 일이라면 끝까지 책임지고 싶다",
          "en": "If I took it on, I want to stay responsible to the end."
        },
        "weights": {
          "responsibility-freedom": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "내 시간을 되찾을 경계를 정해야겠다고 느낀다",
          "en": "I feel I need to set a boundary to reclaim my time."
        },
        "weights": {
          "responsibility-freedom": 2,
          "freedom-stability": 1
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "갑자기 바꾸기보다 가능한 범위부터 줄인다",
          "en": "Rather than changing suddenly, I reduce what I can first."
        },
        "weights": {
          "balanced-negotiator": 2,
          "stability-change": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "내가 빠지면 상황이 흔들릴까 봐 쉽게 못 놓는다",
          "en": "I cannot let go easily because things may shake if I step away."
        },
        "weights": {
          "responsibility-freedom": 2,
          "freedom-stability": 1
        }
      }
    ]
  },
  {
    "id": "vc_14",
    "targetDimension": "perfection/start/recognition",
    "rationale": "A rough first draft tests whether action is blocked by quality standards or visibility concerns.",
    "prompt": {
      "ko": "초안은 나왔지만 아직 거칠고 어색합니다. 지금 손을 떼면 앞으로 나아갈 수 있고, 더 다듬으면 안심될 것 같습니다. 당신은?",
      "en": "You have a draft, but it is still rough and awkward. Letting it go now would move you forward; polishing it more would feel reassuring. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "어색해도 초안은 초안으로 두고 다음 단계로 간다",
          "en": "Even if it is awkward, I let the draft be a draft and move on."
        },
        "weights": {
          "perfect-start": 2
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "조금 더 다듬어야 내 기준에 맞을 것 같다",
          "en": "I feel I need to polish it more to meet my standard."
        },
        "weights": {
          "perfect-start": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "다른 사람이 볼 부분만 먼저 정리한다",
          "en": "I clean up the parts others will see first."
        },
        "weights": {
          "balanced-negotiator": 2,
          "recognition-independence": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "부족한 모습으로 보이는 게 가장 걸린다",
          "en": "What bothers me most is being seen while it is still lacking."
        },
        "weights": {
          "recognition-independence": 2,
          "perfect-start": 1
        }
      }
    ]
  },
  {
    "id": "vc_15",
    "targetDimension": "stability/change/freedom/growth/rest",
    "rationale": "Imagining future self turns abstract values into concrete life direction pressure.",
    "prompt": {
      "ko": "몇 달 뒤의 나를 떠올렸을 때, 지금과 비슷해도 괜찮을지 잘 모르겠습니다. 그렇다고 무리하게 바꾸고 싶지도 않습니다. 당신은?",
      "en": "When you imagine yourself months from now, you are not sure whether being the same would feel okay. But you also do not want to force a major change. What do you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "큰 변화보다 지금 지킬 수 있는 리듬을 먼저 본다",
          "en": "Rather than a big change, I first look at the rhythm I can protect now."
        },
        "weights": {
          "freedom-stability": 2,
          "growth-rest": 1
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "작더라도 새로운 방향 하나를 열어두고 싶다",
          "en": "Even if it is small, I want to open one new direction."
        },
        "weights": {
          "stability-change": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "나를 더 자유롭게 만드는 선택이 무엇인지 생각한다",
          "en": "I think about which choice would make me freer."
        },
        "weights": {
          "freedom-stability": 2,
          "responsibility-freedom": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "쉬어야 할지 더 밀어붙여야 할지부터 헷갈린다",
          "en": "First I feel torn between resting and pushing harder."
        },
        "weights": {
          "growth-rest": 2
        }
      }
    ]
  },
  {
    "id": "vc_16",
    "targetDimension": "balanced negotiation across love/truth/peace/freedom/stability",
    "rationale": "A final two-option dilemma checks whether the user can negotiate competing values without collapsing into one extreme.",
    "prompt": {
      "ko": "두 선택지가 있습니다. 하나는 끌리지만 불안하고, 다른 하나는 안전하지만 아쉽습니다. 지금 당장 결정해야 한다면?",
      "en": "There are two options. One draws your heart but feels uncertain; the other is safe but leaves some regret. If you had to decide now, what would you do?"
    },
    "choices": [
      {
        "id": "a",
        "text": {
          "ko": "작게 실험해볼 방법을 찾아 둘 사이를 좁힌다",
          "en": "I look for a small experiment that narrows the gap between the two."
        },
        "weights": {
          "balanced-negotiator": 3
        }
      },
      {
        "id": "b",
        "text": {
          "ko": "불안해도 계속 끌리는 쪽을 고른다",
          "en": "Even with anxiety, I choose the direction my heart keeps leaning toward."
        },
        "weights": {
          "freedom-stability": 1,
          "stability-change": 2
        }
      },
      {
        "id": "c",
        "text": {
          "ko": "후회가 남아도 지금 무너지지 않는 쪽을 고른다",
          "en": "Even with some regret, I choose the option that will not destabilize me now."
        },
        "weights": {
          "freedom-stability": 2,
          "stability-change": 1
        }
      },
      {
        "id": "d",
        "text": {
          "ko": "누구에게 어떤 말을 해야 덜 찝찝할지 먼저 본다",
          "en": "I first consider what I need to say to whom so less remains unresolved."
        },
        "weights": {
          "truth-peace": 1,
          "love-pride": 1,
          "balanced-negotiator": 1
        }
      }
    ]
  }
];

export function calculateValueResult(answers: ValueAnswer[]): ValueResult {
  const scores = new Map<ValueConflictId, number>();
  for (const result of VALUE_RESULTS) scores.set(result.id, 0);

  for (const answer of answers) {
    for (const [id, value] of Object.entries(answer.weights) as Array<[ValueConflictId, number]>) {
      scores.set(id, (scores.get(id) ?? 0) + value);
    }
  }

  let winner = VALUE_RESULTS[0];
  let bestScore = -Infinity;
  for (const result of VALUE_RESULTS) {
    const score = scores.get(result.id) ?? 0;
    if (score > bestScore) {
      winner = result;
      bestScore = score;
    }
  }
  return winner;
}

export function getValueResultById(id: string | null | undefined): ValueResult | null {
  if (!id) return null;
  return VALUE_RESULTS.find((result) => result.id === id) ?? null;
}
