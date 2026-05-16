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

export const VALUE_RESULTS: ValueResult[] = [
  {
    id: "freedom-stability",
    title: { ko: "?? vs ??", en: "Freedom vs Stability" },
    oneLiner: { ko: "??? ???, ???? ??? ?? ??", en: "You want to leave, but you do not want to fall apart." },
    description: {
      ko: "??? ??? ???? ??? ?? ?????, ??? ??? ??? ?? ?? ??? ?????. ??? ??? ? ??? ? ??? ??? ??? ? ?? ???? ???.",
      en: "You are drawn to new possibilities, but you do not easily let go of the base you have built. Even when change excites you, you calculate how much it might shake your daily life and relationships.",
    },
    conflictStructure: {
      ko: "?? ?? ??? ? ?? ??? ??? ?? ???. ??? ?? ??? ?? ?? ???, ??? ???, ?? ??? ??? ??? ??? ?? ???. ??? ??? ?? ??? ???? ?? ??? ?? ?????.",
      en: "One side of you wants to step into something wider. Another side wants to protect your stability, familiar people, and the rhythm you already know. Your heart packs a bag, while your feet keep checking the ground.",
    },
    commonThought: { ko: "??? ?? ??, ?? ?? ?? ? ??? ?????", en: "I want to try it, but what if I lose what I already have?" },
    friendComment: { ko: "? ?? ??? ???? ?? ???? ? ? ???.", en: "You always say you want to leave, but you never quite let go of the stable thing." },
    neededSentence: { ko: "??? ??? ?? ?? ???? ?? ???, ??? ?? ????? ?? ? ? ?? ???? ???.", en: "You do not need perfect certainty before moving. You can build one small fallback and take one step." },
    strength: { ko: "???? ???? ??? ???. ??? ????? ?????? ?? ?? ? ?? ??? ?? ????.", en: "You can see both possibility and practical risk, so you tend to look for choices that can last." },
    risk: { ko: "??? ???? ??? ???? ??, ?? ??? ??? ?? ??? ? ????.", en: "If you wait until you feel fully ready, the direction you truly want may keep getting delayed." },
    moment: { ko: "??, ??, ??? ???? ?? ??? ??? ? ?? ?? ??? ?? ?????.", en: "It often appears before choices that could shake your base, such as changing work, moving, or beginning a new relationship." },
    hint: { ko: "??? ?? ??, ???? ??? ? ?? ?? ??? ?? ?????.", en: "Instead of total safety, define one small fallback that lets you move." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ??? ???, ???? ??? ?? ??????? ? ?? ?.", en: "My Value Conflict result is Freedom vs Stability. I want to move, but I do not want to fall apart... painfully accurate." },
  },
  {
    id: "recognition-independence",
    title: { ko: "?? vs ??", en: "Recognition vs Independence" },
    oneLiner: { ko: "???? ???, ???? ??? ?? ??", en: "You want to be seen, but not controlled." },
    description: {
      ko: "??? ????? ???? ?? ??? ???, ??? ?? ??? ?? ?? ??? ????. ??? ?? ???, ? ??? ??? ??? ???? ??????.",
      en: "You want to be recognized, but you do not want to live by other people's expectations. Praise gives you energy, but it becomes suffocating when it starts choosing your direction.",
    },
    conflictStructure: {
      ko: "??? ???? ??? ?? ??? ?? ????. ??? ? ??? ? ??? ??, ? ??? ? ?? ?? ??? ?????. ??? ??? ?????, ?? ??? ??? ?? ?? ?????.",
      en: "Being noticed gives you energy. But when that attention becomes the standard, your choices stop feeling fully yours. You want to do well, while staying alert to becoming someone others designed.",
    },
    commonThought: { ko: "?? ???? ????, ? ??? ?? ?? ?? ??.", en: "I want them to think well of me, but I do not want to live for their expectations." },
    friendComment: { ko: "? ????? ??????, ?? ???? ? ?? ?????.", en: "You like being praised, but you hate when people try to define you." },
    neededSentence: { ko: "??? ??? ??? ??? ?? ????? ?? ?? ????. ??? ??? ??? ?? ?? ???.", en: "Wanting recognition does not mean you are not independent. The final line of the standard can still be yours." },
    strength: { ko: "??? ??? ?? ??? ?? ??? ???? ?? ?? ????.", en: "You can read other people's expectations while trying to keep your own standard." },
    risk: { ko: "???? ?? ??? ???? ?? ?? ??? ??? ?? ???? ? ????.", en: "The stronger the need for approval becomes, the harder it may be to notice what you truly want." },
    moment: { ko: "??, ??, ???? ?? ??? ??? ?? ???? ??? ?????.", en: "It appears around evaluation, achievement, and expectations from family or peers." },
    hint: { ko: "??? ?? ?? ?? ?? ??? ?? ??? ?? ?????.", en: "Write separately what you want to hear from others and what you want to protect for yourself." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ???? ??? ???? ?? ??? ?? ??.", en: "My Value Conflict result is Recognition vs Independence. I want to be seen, but not controlled... very me." },
  },
  {
    id: "truth-peace",
    title: { ko: "?? vs ??", en: "Truth vs Peace" },
    oneLiner: { ko: "???? ???, ???? ?? ??? ?? ??", en: "You want honesty, but not unnecessary conflict." },
    description: {
      ko: "??? ??? ??? ???, ? ?? ??? ???? ??? ? ???? ????. ??? ??? ????, ??? ??? ????? ? ?????.",
      en: "You want to say what is true, but you are careful because honesty can disturb a relationship or mood. Holding it in feels heavy, yet saying it may hurt someone.",
    },
    conflictStructure: {
      ko: "???? ?? ??? ??? ??? ??? ??? ??? ?????. ??? ??? ?? ??? ?? ??? ???, ?? ??? ???? ???? ???? ?? ????.",
      en: "To you, words are not just information; they change the emotional temperature of a relationship. Even when you know the truth, you pause to sense how much honesty is safe for everyone involved.",
    },
    commonThought: { ko: "??? ?? ? ???, ?? ??? ??? ?????", en: "I should say it, but what if I ruin the mood?" },
    friendComment: { ko: "? ??? ? ?? ? ? ?? ??? ?? ???.", en: "You rehearse uncomfortable conversations in your head so much." },
    neededSentence: { ko: "??? ??? ?? ??? ??? ?? ????. ???? ??? ??? ??? ? ????.", en: "Words that protect peace and words that hide truth are not the same. You can be gentle and still be honest." },
    strength: { ko: "??? ??? ?? ??? ?? ?????. ??? ?? ?? ?? ?? ???? ????.", en: "You consider both emotional temperature and the weight of words, which gives you a careful kind of honesty." },
    risk: { ko: "??? ???? ??? ??? ?? ???, ???? ? ? ???? ?? ? ????.", en: "If you keep postponing important truths to preserve peace, distance may grow quietly." },
    moment: { ko: "??, ??, ? ??? ????? ??? ?? ?? ? ? ?? ?????.", en: "It appears when an uncomfortable but necessary conversation is waiting." },
    hint: { ko: "??? ? ?? ????, ??? ?? ? ?? ???? ?? ??????.", en: "Instead of dropping the whole truth at once, start with a sentence the other person can receive." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ???? ??? ??? ?? ?? ??????? ??.", en: "My Value Conflict result is Truth vs Peace. I want to be honest, but I hate breaking the mood... accurate." },
  },
  {
    id: "growth-rest",
    title: { ko: "?? vs ??", en: "Growth vs Rest" },
    oneLiner: { ko: "? ???? ???, ?? ?? ?? ??", en: "You want to grow, but you are already tired." },
    description: {
      ko: "??? ???? ?? ??? ????, ??? ?? ?? ??? ?????. ??? ??? ? ??, ?? ??? ?? ?? ??? ? ?? ??? ????.",
      en: "You strongly want to improve, but you also deeply need rest. Stopping feels like falling behind, while continuing feels like wearing yourself down.",
    },
    conflictStructure: {
      ko: "?? ??? ? ??? ?? ??? ?? ?????. ??? ? ??? ???? ?? ??? ????? ????, ?? ??? ???? ?? ? ??? ? ?? ?? ?? ????.",
      en: "Your desire to improve is very clear. But as it grows, rest can start feeling like laziness, and the list of things to do can sound louder than the signals from your body.",
    },
    commonThought: { ko: "??? ?? ? ???, ?? ?? ?? ??? ? ??.", en: "I know I need rest, but if I rest now, it feels like I am the only one stopping." },
    friendComment: { ko: "? ??? ?? ???? ????? ?? ?? ????.", en: "Even when you rest, you are already planning the next thing in your head." },
    neededSentence: { ko: "??? ??? ??? ???, ?? ???? ?? ?????.", en: "Rest is not the opposite of growth; it is one way to make growth last." },
    strength: { ko: "?? ???? ?? ???? ??, ? ????? ?? ????.", en: "You do not give up on your potential easily." },
    risk: { ko: "?? ??? ???? ???, ?? ???? ???? ??? ?????.", en: "If rest feels like failure, it becomes easier to burn out even on things you care about." },
    moment: { ko: "??, ?, ????, ???? ???? ??? ???? ?? ?????.", en: "It appears in areas that require consistency, like study, work, self-improvement, or exercise." },
    hint: { ko: "??? ??? ??? ???? ??? ???? ?????.", en: "Put rest on the schedule as something that protects tomorrow's energy." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ? ???? ??? ?? ?? ?? ??? ???.", en: "My Value Conflict result is Growth vs Rest. I want to improve, but I am already tired... that hit." },
  },
  {
    id: "love-pride",
    title: { ko: "?? vs ???", en: "Love vs Pride" },
    oneLiner: { ko: "???? ???, ?? ???? ??? ?? ??", en: "You want to reach out, but not lose yourself first." },
    description: {
      ko: "??? ???? ??? ????, ??? ???? ??? ?? ???? ????. ??? ?? ??? ? ????, ???? ??? ?? ????? ????.",
      en: "You can care deeply about someone, but you do not easily drop your pride or boundaries. Because your feelings matter, you become careful; because you do not want to be hurt, you become firm first.",
    },
    conflictStructure: {
      ko: "??? ??? ?? ?? ?? ??? ?? ?????. ????? ?? ??? ????, ?? ?? ?? ??? ????? ? ??? ??? ?????.",
      en: "Giving your heart is never a casual thing for you. The closer you want to get, the more you check whether you are giving too much of yourself away.",
    },
    commonThought: { ko: "?? ?? ???? ?? ? ??? ??? ????", en: "If I reach out first, will it look like I lost?" },
    friendComment: { ko: "? ???? ? ???? ?? ????. ?? ? ? ?.", en: "When you care, you act like you do not. But honestly, it shows." },
    neededSentence: { ko: "?? ???? ?? ?? ??? ?? ????. ??? ??? ??? ??? ??? ??? ??? ?????.", en: "Reaching out first does not mean lowering yourself. Sometimes it is not giving up pride; it is saving the connection." },
    strength: { ko: "?? ???? ??? ?? ???? ???? ????.", en: "You try not to lose yourself inside relationships." },
    risk: { ko: "???? ????? ??? ????? ????? ?? ? ????.", en: "Your self-protection may look like distance to the other person." },
    moment: { ko: "??, ??, ??, ?? ?????? ??? ??? ?? ??? ?????.", en: "It appears when you need to reveal your heart: apologizing, reconciling, confessing, or texting first." },
    hint: { ko: "??? ????, ? ??? ?? ??? ??? ????? ? ??????.", en: "Remember that you can express care while still keeping a boundary." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ???? ???. ???? ??? ?? ???? ?? ??? ??.", en: "My Value Conflict result is Love vs Pride. I want to reach out, but not lose myself first... ouch." },
  },
  {
    id: "perfect-start",
    title: { ko: "?? vs ??", en: "Perfection vs Starting" },
    oneLiner: { ko: "??? ??? ??? ??? ???? ??", en: "You start late because you want to do it well." },
    description: {
      ko: "??? ???? ???, ??? ???? ???? ?? ??? ??? ?? ????. ??? ?? ?? ?? ??? ????, ? ??? ???? ??? ?? ? ????.",
      en: "You want to begin, but often hesitate because you feel unprepared. Your standards help you imagine a strong result, but that image can make the first step feel heavy.",
    },
    conflictStructure: {
      ko: "?? ??? ?? ??? ??? ???? ????. ??? ? ???? ?? ????, ?? ??? ? ??? ?? ???? ???? ????.",
      en: "Inside you, the finished version is already vivid. The problem is that the image is so clear, it becomes hard to allow the awkward first version to exist.",
    },
    commonThought: { ko: "?? ? ???? ???? ? ? ? ???.", en: "It does not feel ready enough to begin yet." },
    friendComment: { ko: "? ??? ?? ????, ???? ?? ??? ?? ?? ??.", en: "Once you start, you do well. You just set the bar way too high before beginning." },
    neededSentence: { ko: "??? ???? ??? ??? ????? ?? ?????.", en: "A first draft is not a failed final version. It is the entrance to the final version." },
    strength: { ko: "?? ??? ??, ??? ?? ???? ?????.", en: "You care about quality and do not want to do things carelessly." },
    risk: { ko: "??? ??? ???? ?? ?? ??? ?? ?? ? ????.", en: "Waiting for perfect readiness may keep delaying the start itself." },
    moment: { ko: "? ????, ???, ?? ??, ???? ?? ??? ?? ?????.", en: "It appears before new projects, writing, study plans, or public attempts." },
    hint: { ko: "??? ??? ? ?? ??? ??????. ? ??? ?? ???? ???.", en: "Separate the standard for the final version from the standard for the first try." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ??? ??? ??? ???? ??? ?? ? ?.", en: "My Value Conflict result is Perfection vs Starting. I start late because I want to do it well... cannot deny it." },
  },
  {
    id: "responsibility-freedom",
    title: { ko: "?? vs ??", en: "Responsibility vs Freedom" },
    oneLiner: { ko: "???? ???, ?? ?? ?? ??? ??", en: "You want to run, but cannot abandon what you carry." },
    description: {
      ko: "??? ???? ???, ??? ?? ?? ???? ?? ???? ????. ?? ??? ??? ????? ? ??? ???, ??? ??? ?? ?? ? ?? ?? ?????.",
      en: "You want freedom, but you cannot easily ignore the people and responsibilities you carry. Even when you want rest, you worry someone may struggle if you step away.",
    },
    conflictStructure: {
      ko: "??? ??? ????? ???? ?? ?????. ?? ??? ?? ?????, ?? ?? ??? ?? ???? ??? ?? ?? ?? ??? ??? ?????.",
      en: "You dream of freedom, but you quickly imagine the space you would leave behind. Before your mind gets far, responsibility catches your ankle.",
    },
    commonThought: { ko: "?? ? ??? ???, ?? ? ?? ?? ???", en: "I want to step away too, but if I do not do it, who will?" },
    friendComment: { ko: "? ???? ???? ?? ?? ? ??? ???.", en: "You say you want freedom, but you still carry things to the end." },
    neededSentence: { ko: "???? ??? ?? ?? ?? ?? ?? ??? ?? ????.", en: "Being responsible does not mean carrying every weight alone." },
    strength: { ko: "?? ? ?? ???? ?? ?? ????.", en: "You have the strength to remain dependable." },
    risk: { ko: "? ?? ?? ???? ?????, ??? ????? ??? ? ????.", en: "If you carry what is not yours, freedom may start to feel like guilt." },
    moment: { ko: "??, ?, ?? ??? ?? ??? ? ? ? ?? ??? ?????.", en: "It appears when family, team, or relationships make you feel like you cannot step out." },
    hint: { ko: "??? ??? ??? ???, ????? ? ??? ?? ?????.", en: "Instead of asking whether to abandon responsibility, define which part is truly yours." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ???? ??? ?? ? ? ?? ??? ?? ??.", en: "My Value Conflict result is Responsibility vs Freedom. I want to run, but I cannot drop what I carry... too real." },
  },
  {
    id: "stability-change",
    title: { ko: "?? vs ??", en: "Stability vs Change" },
    oneLiner: { ko: "??? ????, ???? ? ? ? ?? ??", en: "Things are okay now, but staying the same feels uneasy." },
    description: {
      ko: "??? ???? ??? ????, ??? ???? ??? ???? ? ?? ??? ????. ??? ??? ?????, ? ??? ?? ?? ??? ? ?????.",
      en: "You want stability, yet you feel uneasy that without change you may become stuck. You value your current peace, but worry it may make you smaller over time.",
    },
    conflictStructure: {
      ko: "??? ???? ??? ???, ?? ?? ???? ?? ??? ?????. ??? ??? ??? ?????, ?? ????? ??? ??? ?? ????.",
      en: "You dislike change that breaks things, but time with nothing changing also makes you uneasy. You want to protect the present, while another part keeps searching for new air.",
    },
    commonThought: { ko: "?? ??? ???, ?? ???? ?? ?? ?? ? ???", en: "Things are not bad now, but what if I am the only one standing still?" },
    friendComment: { ko: "? ???? ? ?????? ?? ??????.", en: "You like stability, but you get restless inside it so fast." },
    neededSentence: { ko: "? ??? ???? ???. ?? ?? ??? ?? ??? ??? ? ????.", en: "It does not have to be a huge change. One small experiment can loosen the feeling of being stuck." },
    strength: { ko: "??? ??? ??? ???? ?? ?????.", en: "You can see both the value of the present and the possibility of the future." },
    risk: { ko: "??? ?? ??? ?? ???? ?? ??? ?? ? ????.", en: "Both staying and changing may feel uncertain, creating decision fatigue." },
    moment: { ko: "?? ??, ?, ??? ???? ??? ??? ??? ? ?????.", en: "It appears when life, work, or relationships are not bad, but still feel quietly tight." },
    hint: { ko: "? ???? ?? ??? ?? ??? ??? ??? ??? ?? ? ????.", en: "Try a small experiment before a major change; it lets stability and change coexist." },
    shareLine: { ko: "?? ??? ?? ????? ??? vs ??? ???. ??? ???? ???? ? ? ? ?? ??? ??.", en: "My Value Conflict result is Stability vs Change. Things are okay, but staying the same feels wrong... yep." },
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

export const VALUE_QUESTIONS: ValueQuestion[] = [
  {
    id: "new-opportunity",
    prompt: { ko: "새로운 기회가 생겼지만, 지금의 안정적인 생활을 흔들 수 있습니다. 당신의 반응은?", en: "A new opportunity appears, but it could shake your stable life. How do you react?" },
    choices: [
      { id: "a", text: { ko: "무엇이 바뀌고 무엇을 지킬 수 있는지 먼저 비교한다", en: "I first compare what would change and what I could still protect." }, weights: { "balanced-negotiator": 2, "freedom-stability": 1 } },
      { id: "b", text: { ko: "불안해도 한번 움직여보고 싶다", en: "Even if I feel nervous, I want to try moving." }, weights: { "freedom-stability": 2, "stability-change": 1 } },
      { id: "c", text: { ko: "주변 사람들이 어떻게 볼지 신경 쓰인다", en: "I worry about how people around me will see it." }, weights: { "recognition-independence": 2 } },
      { id: "d", text: { ko: "완벽히 준비될 때까지 기다리고 싶다", en: "I want to wait until I am perfectly ready." }, weights: { "perfect-start": 2 } },
    ],
  },
  {
    id: "honest-friend",
    prompt: { ko: "친구에게 솔직히 말해야 할 일이 생겼지만, 말하면 분위기가 불편해질 수 있습니다. 당신은?", en: "You need to be honest with a friend, but it may make the mood uncomfortable. What do you do?" },
    choices: [
      { id: "a", text: { ko: "그래도 진짜 생각은 말해야 한다고 느낀다", en: "I feel that I still need to say what I really think." }, weights: { "truth-peace": 2 } },
      { id: "b", text: { ko: "관계가 상하지 않게 부드럽게 넘기고 싶다", en: "I want to pass it gently so the relationship is not hurt." }, weights: { "truth-peace": 2, "love-pride": 1 } },
      { id: "c", text: { ko: "차분한 타이밍을 잡고 필요한 만큼만 말한다", en: "I choose a calm moment and say only what needs to be said." }, weights: { "balanced-negotiator": 2, "truth-peace": 1 } },
      { id: "d", text: { ko: "그냥 내가 참는 편이 낫다고 생각한다", en: "I think it may be better if I just hold it in." }, weights: { "truth-peace": 1, "growth-rest": 1 } },
    ],
  },
  {
    id: "tired-but-behind",
    prompt: { ko: "쉬고 싶은데, 동시에 뒤처지는 느낌도 듭니다. 당신에게 가까운 쪽은?", en: "You want to rest, but you also feel like you are falling behind. What feels closest?" },
    choices: [
      { id: "a", text: { ko: "오늘 회복할 만큼 쉬고, 다음에 할 일을 작게 정한다", en: "I rest enough for today and set one small next step." }, weights: { "balanced-negotiator": 2, "growth-rest": 1 } },
      { id: "b", text: { ko: "쉬면 안 될 것 같아서 계속 밀어붙인다", en: "I feel like I should not rest, so I keep pushing." }, weights: { "growth-rest": 2, "responsibility-freedom": 1 } },
      { id: "c", text: { ko: "더 나아지고 싶은 마음 때문에 멈추기 어렵다", en: "It is hard to stop because I want to improve." }, weights: { "growth-rest": 2 } },
      { id: "d", text: { ko: "완벽하게 해내지 못할까 봐 시작부터 부담된다", en: "I feel pressured from the start because I may not do it perfectly." }, weights: { "perfect-start": 2 } },
    ],
  },
  {
    id: "text-first",
    prompt: { ko: "소중한 사람에게 먼저 연락하고 싶지만, 자존심도 조금 걸립니다. 당신은?", en: "You want to message someone important first, but your pride gets in the way. What do you do?" },
    choices: [
      { id: "a", text: { ko: "보고 싶으면 먼저 말할 수 있다고 생각한다", en: "I think I can reach out first if I miss them." }, weights: { "love-pride": 2 } },
      { id: "b", text: { ko: "감정이 가라앉은 뒤 자연스럽게 연락한다", en: "I wait until my feelings settle and reach out naturally." }, weights: { "balanced-negotiator": 2, "love-pride": 1 } },
      { id: "c", text: { ko: "내가 먼저 굽히는 것처럼 보일까 봐 망설인다", en: "I hesitate because it may look like I am giving in first." }, weights: { "love-pride": 2, "recognition-independence": 1 } },
      { id: "d", text: { ko: "상대가 먼저 다가오기를 기다린다", en: "I wait for the other person to come closer first." }, weights: { "love-pride": 1, "truth-peace": 1 } },
    ],
  },
  {
    id: "public-work",
    prompt: { ko: "사람들에게 보여줄 일을 시작하려고 합니다. 가장 큰 마음은?", en: "You are about to start something others will see. What feeling is strongest?" },
    choices: [
      { id: "a", text: { ko: "작게 공개해보고 반응을 보며 고친다", en: "I share a small version first and improve it after seeing the response." }, weights: { "balanced-negotiator": 2, "perfect-start": 1 } },
      { id: "b", text: { ko: "남들이 어떻게 평가할지 계속 신경 쓰인다", en: "I keep worrying about how others will evaluate it." }, weights: { "recognition-independence": 2 } },
      { id: "c", text: { ko: "내 방식대로 하고 싶지만 인정도 받고 싶다", en: "I want to do it my way, but I also want recognition." }, weights: { "recognition-independence": 2 } },
      { id: "d", text: { ko: "완벽하지 않으면 아직 보여주면 안 될 것 같다", en: "If it is not perfect, I feel like I should not show it yet." }, weights: { "perfect-start": 2 } },
    ],
  },
  {
    id: "team-duty",
    prompt: { ko: "맡은 일이 많아 도망치고 싶지만, 나를 믿는 사람들도 있습니다. 당신은?", en: "You have many responsibilities and want to run away, but people are relying on you. What do you do?" },
    choices: [
      { id: "a", text: { ko: "내가 맡은 건 끝까지 해야 한다고 느낀다", en: "I feel I must finish what I took on." }, weights: { "responsibility-freedom": 2 } },
      { id: "b", text: { ko: "잠깐이라도 벗어나 숨 쉴 시간이 필요하다", en: "I need even a brief moment away to breathe." }, weights: { "responsibility-freedom": 1, "growth-rest": 2 } },
      { id: "c", text: { ko: "맡을 수 있는 것과 나눠야 할 것을 구분한다", en: "I separate what I can handle from what needs to be shared." }, weights: { "balanced-negotiator": 2, "responsibility-freedom": 1 } },
      { id: "d", text: { ko: "기대에 못 미칠까 봐 더 무리한다", en: "I push harder because I am afraid of falling short of expectations." }, weights: { "recognition-independence": 1, "responsibility-freedom": 2 } },
    ],
  },
  {
    id: "comfortable-life",
    prompt: { ko: "지금 생활은 나쁘지 않지만, 이대로 괜찮은지 자꾸 생각납니다. 당신은?", en: "Your current life is not bad, but you keep wondering whether this is enough. What do you do?" },
    choices: [
      { id: "a", text: { ko: "지금 가진 안정이 흔들릴까 봐 쉽게 바꾸지 못한다", en: "I cannot change easily because my current stability may shake." }, weights: { "stability-change": 2, "freedom-stability": 1 } },
      { id: "b", text: { ko: "작은 변화를 하나 넣어보고 느낌을 확인한다", en: "I try one small change and see how it feels." }, weights: { "balanced-negotiator": 2, "stability-change": 1 } },
      { id: "c", text: { ko: "이대로 멈춰버릴까 봐 불안하다", en: "I feel anxious that I may stay stuck like this." }, weights: { "stability-change": 2 } },
      { id: "d", text: { ko: "새로운 가능성을 찾아 떠나고 싶다", en: "I want to leave and look for new possibilities." }, weights: { "freedom-stability": 2 } },
    ],
  },
  {
    id: "recognized-path",
    prompt: { ko: "사람들이 기대하는 길과 내가 원하는 길이 다릅니다. 당신에게 가까운 반응은?", en: "The path people expect and the path you want are different. What reaction comes closest?" },
    choices: [
      { id: "a", text: { ko: "내 길을 가고 싶지만 실망시킬까 봐 신경 쓰인다", en: "I want to go my way, but I worry about disappointing people." }, weights: { "recognition-independence": 2 } },
      { id: "b", text: { ko: "인정받지 못해도 내 선택을 지키고 싶다", en: "Even if I am not recognized, I want to keep my choice." }, weights: { "recognition-independence": 2, "freedom-stability": 1 } },
      { id: "c", text: { ko: "내가 원하는 이유를 정리한 뒤 차분히 설명한다", en: "I organize my reasons and explain them calmly." }, weights: { "balanced-negotiator": 2, "recognition-independence": 1 } },
      { id: "d", text: { ko: "기대에 맞추는 편이 더 안전하다고 느낀다", en: "It feels safer to meet expectations." }, weights: { "recognition-independence": 1, "freedom-stability": 1 } },
    ],
  },
  {
    id: "unfair-moment",
    prompt: { ko: "불공평하다고 느끼는 상황이 생겼지만, 말하면 갈등이 커질 수 있습니다. 당신은?", en: "Something feels unfair, but saying so may create conflict. What do you do?" },
    choices: [
      { id: "a", text: { ko: "분위기가 불편해져도 사실은 짚어야 한다고 느낀다", en: "Even if the mood becomes uncomfortable, I feel the truth should be addressed." }, weights: { "truth-peace": 2 } },
      { id: "b", text: { ko: "감정이 가라앉은 뒤 필요한 부분만 말한다", en: "After my feelings settle, I say only the part that needs to be said." }, weights: { "balanced-negotiator": 2, "truth-peace": 1 } },
      { id: "c", text: { ko: "괜히 문제 만드는 사람처럼 보일까 봐 망설인다", en: "I hesitate because I may look like the person creating a problem." }, weights: { "truth-peace": 1, "recognition-independence": 2 } },
      { id: "d", text: { ko: "그냥 넘어가면 평화는 지킬 수 있다고 생각한다", en: "If I let it pass, at least peace can be kept." }, weights: { "truth-peace": 2 } },
    ],
  },
  {
    id: "big-plan",
    prompt: { ko: "하고 싶은 일이 있지만, 아직 준비가 부족해 보입니다. 당신은?", en: "There is something you want to do, but you do not feel ready yet. What do you do?" },
    choices: [
      { id: "a", text: { ko: "완벽해질 때까지 시작을 미루고 싶다", en: "I want to delay starting until it is perfect." }, weights: { "perfect-start": 2 } },
      { id: "b", text: { ko: "부족해도 작은 버전부터 시작해본다", en: "Even if it is imperfect, I start with a small version." }, weights: { "balanced-negotiator": 2, "perfect-start": 1 } },
      { id: "c", text: { ko: "지금 시작하지 않으면 계속 제자리일까 봐 걱정된다", en: "I worry that if I do not start now, I will stay stuck." }, weights: { "stability-change": 2 } },
      { id: "d", text: { ko: "잘하고 싶은 마음이 오히려 시작을 무겁게 만든다", en: "Wanting to do well makes starting feel heavier." }, weights: { "perfect-start": 2, "growth-rest": 1 } },
    ],
  },
  {
    id: "someone-important",
    prompt: { ko: "소중한 사람과 마음이 엇갈린 느낌이 듭니다. 가장 가까운 반응은?", en: "It feels like your heart and someone important's heart are out of sync. What reaction comes closest?" },
    choices: [
      { id: "a", text: { ko: "다가가고 싶지만 먼저 약해지는 것 같아 망설인다", en: "I want to approach, but I hesitate because it feels like becoming vulnerable first." }, weights: { "love-pride": 2 } },
      { id: "b", text: { ko: "관계가 깨지지 않게 조심스럽게 굴고 싶다", en: "I want to act carefully so the relationship does not break." }, weights: { "truth-peace": 1, "love-pride": 2 } },
      { id: "c", text: { ko: "내 마음을 지키면서도 필요한 말은 해보고 싶다", en: "I want to protect my heart while still saying what needs to be said." }, weights: { "balanced-negotiator": 2, "love-pride": 1 } },
      { id: "d", text: { ko: "상대가 먼저 마음을 보여주길 기다린다", en: "I wait for the other person to show their heart first." }, weights: { "love-pride": 2 } },
    ],
  },
  {
    id: "future-self",
    prompt: { ko: "몇 년 뒤의 나를 생각하면 마음이 복잡해집니다. 가장 가까운 생각은?", en: "When you think of yourself a few years from now, your mind feels complicated. What thought comes closest?" },
    choices: [
      { id: "a", text: { ko: "지금도 의미 있고, 작은 조정부터 해도 된다고 본다", en: "I see that now still matters, and I can start with small adjustments." }, weights: { "balanced-negotiator": 2 } },
      { id: "b", text: { ko: "지금처럼 안정적인 게 가장 중요하다", en: "Staying stable like now feels most important." }, weights: { "freedom-stability": 2, "stability-change": 1 } },
      { id: "c", text: { ko: "지금보다 더 성장하지 못하면 불안할 것 같다", en: "I feel anxious if I cannot grow beyond where I am now." }, weights: { "growth-rest": 2, "stability-change": 1 } },
      { id: "d", text: { ko: "책임만 늘고 자유가 줄어들까 봐 걱정된다", en: "I worry that responsibility will grow while freedom shrinks." }, weights: { "responsibility-freedom": 2 } },
    ],
  },
  {
    id: "career-offer",
    prompt: { ko: "익숙한 자리와 새롭지만 불확실한 제안 사이에서 고민합니다. 가장 가까운 선택은?", en: "You are choosing between a familiar place and a new but uncertain offer. What feels closest?" },
    choices: [
      { id: "a", text: { ko: "잃을 것과 얻을 것을 적어보고 작은 안전장치를 만든다", en: "I list what I may lose and gain, then create a small safety net." }, weights: { "balanced-negotiator": 2, "freedom-stability": 1 } },
      { id: "b", text: { ko: "불안해도 새로운 쪽으로 한번 움직이고 싶다", en: "Even with anxiety, I want to move toward the new option." }, weights: { "stability-change": 2, "freedom-stability": 1 } },
      { id: "c", text: { ko: "어느 선택이 더 인정받을지 자꾸 생각한다", en: "I keep thinking about which choice will be more respected." }, weights: { "recognition-independence": 2 } },
      { id: "d", text: { ko: "준비가 완벽해질 때까지 결정을 미루고 싶다", en: "I want to delay the decision until I feel perfectly ready." }, weights: { "perfect-start": 2 } },
    ],
  },
  {
    id: "rest-weekend",
    prompt: { ko: "쉬기로 한 주말에 성장에 도움이 될 기회가 생겼습니다. 당신은?", en: "On a weekend you planned to rest, an opportunity for growth appears. What do you do?" },
    choices: [
      { id: "a", text: { ko: "이번에는 회복을 지키는 것도 필요하다고 본다", en: "I see that protecting recovery matters this time." }, weights: { "growth-rest": 2 } },
      { id: "b", text: { ko: "힘들어도 놓치면 뒤처질 것 같아 참여한다", en: "Even if I am tired, I join because missing it may set me back." }, weights: { "growth-rest": 2, "responsibility-freedom": 1 } },
      { id: "c", text: { ko: "일부만 참여하고 나머지 시간은 쉬는 식으로 조정한다", en: "I join only part of it and keep the rest of the time for rest." }, weights: { "balanced-negotiator": 2 } },
      { id: "d", text: { ko: "내가 맡은 일이나 기대를 저버리는 느낌이 든다", en: "It feels like I am failing a duty or expectation." }, weights: { "responsibility-freedom": 2 } },
    ],
  },
  {
    id: "apology-message",
    prompt: { ko: "가까운 사람에게 먼저 사과하거나 말을 걸어야 할지 고민됩니다. 당신은?", en: "You wonder whether to apologize or reach out first to someone close. What feels closest?" },
    choices: [
      { id: "a", text: { ko: "관계를 위해 필요한 말은 부드럽게 해본다", en: "For the relationship, I try saying what needs to be said gently." }, weights: { "love-pride": 1, "truth-peace": 1 } },
      { id: "b", text: { ko: "먼저 다가가면 내가 진 것처럼 보일까 봐 망설인다", en: "I hesitate because reaching out first may look like losing." }, weights: { "love-pride": 2 } },
      { id: "c", text: { ko: "분위기를 깨지 않으려 조금 더 기다리고 싶다", en: "I want to wait a little longer so I do not disturb the peace." }, weights: { "truth-peace": 2 } },
      { id: "d", text: { ko: "짧게 마음을 전하고 상대의 반응을 기다린다", en: "I share my heart briefly and wait for their response." }, weights: { "balanced-negotiator": 2, "love-pride": 1 } },
    ],
  },
  {
    id: "unfinished-project",
    prompt: { ko: "작업물이 완벽하진 않지만 사람들에게 보여줄 수는 있습니다. 당신의 선택은?", en: "Your work is not perfect, but it is ready enough to show. What do you choose?" },
    choices: [
      { id: "a", text: { ko: "작게 공개하고 반응을 보며 고친다", en: "I share a small version and improve it after seeing reactions." }, weights: { "balanced-negotiator": 2, "perfect-start": 1 } },
      { id: "b", text: { ko: "부족한 부분이 보이면 아직 시작하면 안 될 것 같다", en: "If I can see flaws, it feels like I should not start yet." }, weights: { "perfect-start": 2 } },
      { id: "c", text: { ko: "지금 바꾸지 않으면 계속 같은 자리에 있을 것 같다", en: "If I do not change now, I may stay in the same place." }, weights: { "stability-change": 2 } },
      { id: "d", text: { ko: "믿을 만한 사람에게 먼저 보여주고 의견을 듣는다", en: "I first show it to someone I trust and listen to their thoughts." }, weights: { "recognition-independence": 1, "balanced-negotiator": 1 } },
    ],
  },
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
