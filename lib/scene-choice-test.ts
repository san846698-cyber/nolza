export type SceneLocale = "ko" | "en";

export type SceneDimension =
  | "freedomChange"
  | "memoryAttachment"
  | "safetyStability"
  | "hiddenThreat"
  | "recognitionMeaning"
  | "controlOrder"
  | "curiosityUnknown"
  | "emotionalDepth";

export type LocalizedText = {
  ko: string;
  en: string;
};

export type SceneChoice = {
  id: string;
  text: LocalizedText;
  scores: Partial<Record<SceneDimension, number>>;
};

export type SceneQuestion = {
  id: string;
  title: LocalizedText;
  scene: LocalizedText;
  prompt: LocalizedText;
  choices: SceneChoice[];
};

export type SceneResultId =
  | "open-window"
  | "letter"
  | "fading-light"
  | "door-shadow"
  | "crack"
  | "distant-sound"
  | "closed-drawer"
  | "empty-chair";

export type SceneResult = {
  id: SceneResultId;
  title: LocalizedText;
  oneLiner: LocalizedText;
  description: LocalizedText;
  noticesFirst: LocalizedText;
  reveals: LocalizedText;
  strength: LocalizedText;
  watchOut: LocalizedText;
  friendQuestion: LocalizedText;
  shareText: LocalizedText;
  accent: string;
};

export const SCENE_COPY = {
  languageLabel: { ko: "언어 선택", en: "Language selection" },
  title: { ko: "무의식 장면 테스트", en: "The Scene You Notice First" },
  badge: { ko: "심리 테스트", en: "Psychology Test" },
  subtitle: {
    ko: "낯선 장면 속에서, 당신의 마음은 무엇을 먼저 발견할까요?",
    en: "In an unfamiliar scene, what does your mind notice first?",
  },
  description: {
    ko: "같은 장면을 보아도 사람마다 먼저 보는 것은 다릅니다. 당신이 고르는 장면의 조각들로, 마음이 자주 향하는 방향을 읽어보세요.",
    en: "People do not see the same scene in the same way. Choose the details that draw your attention and discover your symbolic inner pattern.",
  },
  disclaimer: {
    ko: "이 테스트는 전문적인 진단이 아닌, 투사적 이야기 기법에서 영감을 받은 재미용 자기이해 콘텐츠입니다.",
    en: "This is not a professional diagnosis. It is an entertainment and self-reflection experience inspired by projective storytelling techniques.",
  },
  start: { ko: "장면 열어보기", en: "Open the scene" },
  questionCount: { ko: "장면", en: "Scene" },
  resultLabel: { ko: "나의 내면 장면", en: "My Inner Scene" },
  noticesFirst: { ko: "당신의 시선이 향하는 곳", en: "Where your attention goes" },
  reveals: { ko: "이 장면이 말해주는 것", en: "What this scene suggests" },
  strength: { ko: "당신의 강점", en: "Your strength" },
  watchOut: { ko: "조심할 점", en: "Watch out for" },
  friendQuestion: { ko: "친구에게 물어볼 질문", en: "Question to ask a friend" },
  share: { ko: "결과 공유하기", en: "Share result" },
  copied: { ko: "링크 복사됨", en: "Link copied" },
  retry: { ko: "다시 하기", en: "Retry" },
  related: { ko: "다음 추천 테스트", en: "Recommended next" },
  meta: { ko: "12장면 · 약 4분", en: "12 scenes · about 4 min" },
} satisfies Record<string, LocalizedText>;

export const SCENE_QUESTIONS: SceneQuestion[] = [
  {
    id: "unfamiliar-room",
    title: { ko: "낯선 방", en: "The Unfamiliar Room" },
    scene: {
      ko: "낯선 방에 들어왔습니다. 방 안은 조용하고, 오래 머문 사람의 흔적만 희미하게 남아 있습니다.",
      en: "You enter an unfamiliar room. It is quiet, and only faint traces of someone who stayed there remain.",
    },
    prompt: { ko: "가장 먼저 눈에 들어오는 것은?", en: "What catches your eye first?" },
    choices: [
      { id: "a", text: { ko: "밖으로 나갈 수 있는 열린 창", en: "The open window leading outside" }, scores: { freedomChange: 3 } },
      { id: "b", text: { ko: "누군가 남긴 책상 위 편지", en: "The letter someone left on the desk" }, scores: { memoryAttachment: 3 } },
      { id: "c", text: { ko: "곧 꺼질 듯한 조명의 밝기", en: "The light about to fade out" }, scores: { safetyStability: 3 } },
      { id: "d", text: { ko: "문 뒤에서 움직인 듯한 그림자", en: "The shadow that seems to move behind the door" }, scores: { hiddenThreat: 3 } },
    ],
  },
  {
    id: "rainy-alley",
    title: { ko: "비가 그친 골목", en: "The Alley After Rain" },
    scene: {
      ko: "비가 그친 골목 끝에 오래된 가게 하나가 불을 켜고 있습니다. 바닥에는 물빛이 조용히 흔들립니다.",
      en: "At the end of an alley after rain, an old shop keeps its light on. Reflections tremble quietly on the ground.",
    },
    prompt: { ko: "가장 먼저 신경 쓰이는 것은?", en: "What draws your attention first?" },
    choices: [
      { id: "a", text: { ko: "아직 누군가 있는 듯한 문틈의 빛", en: "Light through the door, as if someone is still there" }, scores: { recognitionMeaning: 2, curiosityUnknown: 1 } },
      { id: "b", text: { ko: "방금 지나간 사람의 유리창 손자국", en: "Fingerprints from someone who just passed" }, scores: { memoryAttachment: 2, emotionalDepth: 1 } },
      { id: "c", text: { ko: "다가올지 모르는 골목 끝 사람", en: "The person at the alley end who may come closer" }, scores: { hiddenThreat: 3 } },
      { id: "d", text: { ko: "주인을 기다리는 젖은 우산", en: "The wet umbrella waiting for its owner" }, scores: { safetyStability: 2, memoryAttachment: 1 } },
    ],
  },
  {
    id: "night-train",
    title: { ko: "밤 기차", en: "The Night Train" },
    scene: {
      ko: "밤 기차 안, 모두가 잠든 것처럼 조용합니다. 객실은 흔들리고 창밖의 불빛만 길게 지나갑니다.",
      en: "Inside a night train, everything is quiet as if everyone has fallen asleep. The carriage sways and lights slide past the window.",
    },
    prompt: { ko: "당신의 시선이 먼저 머무는 곳은?", en: "Where does your gaze rest first?" },
    choices: [
      { id: "a", text: { ko: "어딘가로 지나가는 창밖 불빛", en: "The lights passing toward somewhere outside" }, scores: { freedomChange: 2, curiosityUnknown: 1 } },
      { id: "b", text: { ko: "주인이 돌아올 것 같은 빈 좌석의 가방", en: "The bag on an empty seat whose owner may return" }, scores: { recognitionMeaning: 2, memoryAttachment: 1 } },
      { id: "c", text: { ko: "다음 역을 예고하는 먼 안내 방송", en: "The distant announcement hinting at the next stop" }, scores: { curiosityUnknown: 3 } },
      { id: "d", text: { ko: "안쪽을 확인하고 싶은 닫힌 객실 문", en: "The closed carriage door I want to check" }, scores: { controlOrder: 2, hiddenThreat: 1 } },
    ],
  },
  {
    id: "old-study",
    title: { ko: "오래된 서재", en: "The Old Study" },
    scene: {
      ko: "오래된 서재에 들어왔습니다. 책들은 조용히 쌓여 있고, 창문은 조금 열려 있습니다.",
      en: "You enter an old study. Books are stacked in silence, and the window is slightly open.",
    },
    prompt: { ko: "가장 먼저 확인하고 싶은 것은?", en: "What do you want to check first?" },
    choices: [
      { id: "a", text: { ko: "지금 방 밖으로 이어지는 열린 창", en: "The open window leading out of the room" }, scores: { freedomChange: 3 } },
      { id: "b", text: { ko: "누가 무엇을 쓰다 멈춘 펼친 노트", en: "The open notebook where someone stopped writing" }, scores: { recognitionMeaning: 2, controlOrder: 1 } },
      { id: "c", text: { ko: "읽던 자리를 잃어버린 책갈피", en: "The bookmark that lost its page" }, scores: { memoryAttachment: 2, emotionalDepth: 1 } },
      { id: "d", text: { ko: "무언가 숨었을 듯한 어두운 책장 사이", en: "The dark shelf gap where something may hide" }, scores: { hiddenThreat: 2, curiosityUnknown: 1 } },
    ],
  },
  {
    id: "small-harbor",
    title: { ko: "새벽 항구", en: "The Harbor at Dawn" },
    scene: {
      ko: "새벽의 작은 항구에 혼자 서 있습니다. 물결은 낮고, 아직 출발하지 않은 배들이 조용히 묶여 있습니다.",
      en: "You stand alone at a small harbor at dawn. The water is low, and boats that have not left yet are tied in silence.",
    },
    prompt: { ko: "가장 먼저 기억에 남는 것은?", en: "What do you remember first?" },
    choices: [
      { id: "a", text: { ko: "곧 떠날 것 같은 먼 배의 불빛", en: "The far boat light that may soon leave" }, scores: { curiosityUnknown: 2, freedomChange: 1 } },
      { id: "b", text: { ko: "배를 붙잡아두는 묶인 밧줄", en: "The tied rope holding the boat in place" }, scores: { controlOrder: 2, safetyStability: 1 } },
      { id: "c", text: { ko: "물결에 흔들리는 달빛", en: "Moonlight trembling on the water" }, scores: { emotionalDepth: 3 } },
      { id: "d", text: { ko: "누군가 앉았을 것 같은 빈 의자", en: "The empty chair someone may have sat in" }, scores: { memoryAttachment: 2, emotionalDepth: 1 } },
    ],
  },
  {
    id: "left-room",
    title: { ko: "누군가 떠난 방", en: "The Room Someone Left" },
    scene: {
      ko: "누군가 떠난 방에 들어왔습니다. 모든 것은 정리된 듯하지만, 방 안에는 방금 전까지의 온기가 남아 있습니다.",
      en: "You enter a room someone has left. Everything seems arranged, but the warmth of a recent presence remains.",
    },
    prompt: { ko: "가장 먼저 눈에 들어오는 것은?", en: "What do you notice first?" },
    choices: [
      { id: "a", text: { ko: "차마 버리지 못한 접힌 편지", en: "The folded letter someone could not throw away" }, scores: { memoryAttachment: 3 } },
      { id: "b", text: { ko: "떠날 준비가 끝난 닫힌 여행 가방", en: "The closed suitcase ready to leave" }, scores: { controlOrder: 1, freedomChange: 2 } },
      { id: "c", text: { ko: "방금 놓고 간 듯 따뜻한 찻잔", en: "The warm teacup someone just left" }, scores: { emotionalDepth: 2, safetyStability: 1 } },
      { id: "d", text: { ko: "벽에 남은 빈 액자 자리", en: "The empty frame mark left on the wall" }, scores: { recognitionMeaning: 2, memoryAttachment: 1 } },
    ],
  },
  {
    id: "empty-theater",
    title: { ko: "빈 극장", en: "The Empty Theater" },
    scene: {
      ko: "공연이 끝난 극장에 조명이 희미하게 남아 있습니다. 객석은 비어 있고 무대 위에는 작은 소품 하나만 놓여 있습니다.",
      en: "A theater after a performance still holds a dim light. The seats are empty and one small prop remains on stage.",
    },
    prompt: { ko: "무엇이 가장 오래 기억에 남나요?", en: "What do you remember longest?" },
    choices: [
      { id: "a", text: { ko: "무대 한가운데의 빈 의자", en: "The empty chair at center stage" }, scores: { emotionalDepth: 2, memoryAttachment: 1 } },
      { id: "b", text: { ko: "객석 맨 뒤의 열린 문", en: "The open door at the back" }, scores: { freedomChange: 2, hiddenThreat: 1 } },
      { id: "c", text: { ko: "바닥에 떨어진 대본 한 장", en: "A script page on the floor" }, scores: { recognitionMeaning: 3 } },
      { id: "d", text: { ko: "꺼지기 직전의 무대 조명", en: "The stage light about to go out" }, scores: { safetyStability: 3 } },
    ],
  },
  {
    id: "glasshouse",
    title: { ko: "유리 온실", en: "The Glasshouse" },
    scene: {
      ko: "오래 방치된 유리 온실에 들어왔습니다. 식물은 자라났지만, 유리에는 작은 금이 가 있습니다.",
      en: "You enter an abandoned glasshouse. Plants have grown wild, but a small crack runs through the glass.",
    },
    prompt: { ko: "가장 먼저 확인하게 되는 것은?", en: "What do you check first?" },
    choices: [
      { id: "a", text: { ko: "유리의 작은 균열", en: "The small crack in the glass" }, scores: { safetyStability: 3 } },
      { id: "b", text: { ko: "밖으로 뻗은 식물 줄기", en: "A plant stem reaching outside" }, scores: { freedomChange: 2, curiosityUnknown: 1 } },
      { id: "c", text: { ko: "안쪽에 놓인 잠긴 서랍", en: "A locked drawer inside" }, scores: { controlOrder: 1, memoryAttachment: 2 } },
      { id: "d", text: { ko: "어디선가 들리는 물소리", en: "The sound of water from somewhere" }, scores: { curiosityUnknown: 2, emotionalDepth: 1 } },
    ],
  },
  {
    id: "late-library",
    title: { ko: "늦은 도서관", en: "The Late Library" },
    scene: {
      ko: "문 닫을 시간이 지난 도서관에 불 하나가 남아 있습니다. 누군가 급히 떠난 듯한 자리가 보입니다.",
      en: "A single light remains in a library after closing time. One desk looks as if someone left in a hurry.",
    },
    prompt: { ko: "당신이 먼저 다가갈 곳은?", en: "Where would you move first?" },
    choices: [
      { id: "a", text: { ko: "책상 아래의 그림자", en: "The shadow under the desk" }, scores: { hiddenThreat: 3 } },
      { id: "b", text: { ko: "펼쳐진 책의 밑줄", en: "The underlined sentence in an open book" }, scores: { recognitionMeaning: 3 } },
      { id: "c", text: { ko: "정리되지 않은 의자", en: "The chair left out of place" }, scores: { controlOrder: 2, safetyStability: 1 } },
      { id: "d", text: { ko: "창밖의 멀어진 발소리", en: "Footsteps fading outside the window" }, scores: { curiosityUnknown: 3 } },
    ],
  },
  {
    id: "fog-bridge",
    title: { ko: "안개 낀 다리", en: "The Foggy Bridge" },
    scene: {
      ko: "안개가 낀 다리 위에 서 있습니다. 건너편은 희미하고, 난간 아래로 물소리만 낮게 들립니다.",
      en: "You stand on a bridge in fog. The far side is faint, and water murmurs below the railing.",
    },
    prompt: { ko: "가장 먼저 의식되는 것은?", en: "What are you aware of first?" },
    choices: [
      { id: "a", text: { ko: "건너편에서 희미하게 움직이는 빛", en: "A faint moving light across the bridge" }, scores: { curiosityUnknown: 2, freedomChange: 1 } },
      { id: "b", text: { ko: "난간의 흔들리는 금속음", en: "The rail's trembling metal sound" }, scores: { safetyStability: 2, hiddenThreat: 1 } },
      { id: "c", text: { ko: "다리 바닥의 오래된 균열", en: "An old crack in the bridge floor" }, scores: { safetyStability: 3 } },
      { id: "d", text: { ko: "뒤돌아가도 남아 있을 발자국", en: "Footprints that would remain if you turned back" }, scores: { memoryAttachment: 2, emotionalDepth: 1 } },
    ],
  },
  {
    id: "stairwell",
    title: { ko: "조용한 계단", en: "The Quiet Stairwell" },
    scene: {
      ko: "낡은 건물의 계단참에 서 있습니다. 위층에서는 아주 작은 소리가 들리고, 아래층은 어둡게 잠겨 있습니다.",
      en: "You stand on the landing of an old building. A small sound comes from upstairs, while downstairs is locked in darkness.",
    },
    prompt: { ko: "어느 쪽이 더 마음에 걸리나요?", en: "Which detail stays with you?" },
    choices: [
      { id: "a", text: { ko: "위층에서 들리는 작은 소리", en: "The small sound upstairs" }, scores: { curiosityUnknown: 3 } },
      { id: "b", text: { ko: "아래층으로 내려가는 어둠", en: "The darkness leading downstairs" }, scores: { hiddenThreat: 2, emotionalDepth: 1 } },
      { id: "c", text: { ko: "벽에 붙은 오래된 안내문", en: "The old notice on the wall" }, scores: { recognitionMeaning: 2, controlOrder: 1 } },
      { id: "d", text: { ko: "손잡이에 남은 체온", en: "Warmth left on the handrail" }, scores: { memoryAttachment: 2, emotionalDepth: 1 } },
    ],
  },
  {
    id: "snowfield",
    title: { ko: "눈 덮인 들판", en: "The Snowfield" },
    scene: {
      ko: "눈이 덮인 들판에 혼자 서 있습니다. 멀리 작은 집이 보이고, 발밑에는 아직 지워지지 않은 길이 있습니다.",
      en: "You stand alone in a snow-covered field. A small house is visible far away, and a path remains under your feet.",
    },
    prompt: { ko: "가장 먼저 따라가고 싶은 것은?", en: "What would you follow first?" },
    choices: [
      { id: "a", text: { ko: "멀리 있는 작은 집의 불빛", en: "The light of the small house far away" }, scores: { safetyStability: 1, curiosityUnknown: 2 } },
      { id: "b", text: { ko: "눈 위에 남은 발자국", en: "Footprints left in the snow" }, scores: { memoryAttachment: 2, recognitionMeaning: 1 } },
      { id: "c", text: { ko: "아무도 밟지 않은 하얀 길", en: "The untouched white path" }, scores: { freedomChange: 3 } },
      { id: "d", text: { ko: "바람이 만든 낮은 울음소리", en: "The low sound made by the wind" }, scores: { emotionalDepth: 2, hiddenThreat: 1 } },
    ],
  },
];

export const SCENE_RESULTS: Record<SceneResultId, SceneResult> = {
  "open-window": {
    id: "open-window",
    title: { ko: "틈을 발견하는 가능성 탐험가", en: "The One Who Notices the Open Window" },
    oneLiner: { ko: "막힌 장면에서도 빠져나갈 방향과 다음 가능성을 먼저 보는 타입입니다.", en: "You notice possibility even inside a closed room." },
    description: {
      ko: "당신의 마음은 막힌 공간 안에서도 출구와 가능성을 먼저 찾습니다. 지금 있는 곳보다 아직 가지 않은 곳에 시선이 먼저 닿는 사람입니다.",
      en: "Your mind looks for exits and possibilities even in a closed space. Your attention often reaches the place you have not gone yet before it fully settles where you are.",
    },
    noticesFirst: {
      ko: "당신은 장면 속에서 열린 틈, 바깥으로 이어지는 길, 아직 선택되지 않은 방향을 빠르게 알아차립니다.",
      en: "You quickly notice openings, paths outward, and directions that have not been chosen yet.",
    },
    reveals: {
      ko: "지금의 답보다 다음 가능성에 마음이 먼저 움직이는 편입니다. 답답함을 느끼면 새로운 환경, 다른 선택지, 아직 남은 여지를 찾습니다.",
      en: "Your attention often moves toward the next possibility before the current answer. When something feels tight, you look for another setting, option, or remaining space.",
    },
    strength: { ko: "막힌 상황에서도 변화의 통로를 찾아내는 힘이 있습니다.", en: "You can find a path for change even when a situation feels closed." },
    watchOut: { ko: "너무 빨리 떠날 방향을 찾다 보면, 지금 장면 안에 남은 의미를 놓칠 수 있습니다.", en: "If you look for the way out too quickly, you may miss meaning that still exists where you are." },
    friendQuestion: { ko: "나 답답하면 바로 다른 가능성부터 찾는 편이야?", en: "When I feel stuck, do I start looking for other possibilities first?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “틈을 발견하는 가능성 탐험가”가 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Open Window” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#c89455",
  },
  letter: {
    id: "letter",
    title: { ko: "남은 문장을 오래 읽는 사람", en: "The One Who Notices the Letter" },
    oneLiner: { ko: "끝난 장면에서도 아직 말해지지 않은 마음을 먼저 찾는 타입입니다.", en: "You notice the feelings that were left unsaid." },
    description: {
      ko: "당신은 사건보다 그 안에 남겨진 마음을 먼저 읽는 사람입니다. 말하지 못한 감정, 끝나지 않은 관계, 오래 남은 문장에 민감합니다.",
      en: "You often read the feeling left inside an event before the event itself. Unspoken emotions, unfinished relationships, and sentences that linger are easy for you to notice.",
    },
    noticesFirst: { ko: "당신의 시선은 사라진 사람의 흔적, 접힌 말, 아직 끝나지 않은 문장에 머뭅니다.", en: "Your gaze rests on traces of people, folded words, and sentences that do not feel finished." },
    reveals: { ko: "관계의 온도와 말하지 못한 마음을 중요하게 느낍니다. 무엇이 일어났는지보다 누가 어떤 마음으로 남았는지를 먼저 생각합니다.", en: "You care about the emotional temperature of relationships. You may wonder who was left with what feeling before asking what simply happened." },
    strength: { ko: "사람 사이의 미묘한 여운을 잘 읽고, 마음의 맥락을 놓치지 않습니다.", en: "You are good at reading emotional traces and keeping the human context in view." },
    watchOut: { ko: "상대가 남긴 조각을 오래 붙잡다가, 내 마음의 현재 시간을 늦게 확인할 수 있습니다.", en: "You may hold onto another person's traces for so long that you check your own present feeling late." },
    friendQuestion: { ko: "나는 끝난 일에서도 남은 말이나 감정을 오래 생각하는 편이야?", en: "Do I keep thinking about leftover words or feelings even after something ends?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “남은 문장을 오래 읽는 사람”이 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Letter” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#ad6f62",
  },
  "fading-light": {
    id: "fading-light",
    title: { ko: "분위기의 밝기를 재는 사람", en: "The One Who Notices the Fading Light" },
    oneLiner: { ko: "공간과 사람의 에너지가 약해지는 순간을 빠르게 감지하는 타입입니다.", en: "You notice when the atmosphere begins to fade." },
    description: {
      ko: "당신은 분위기의 변화와 에너지의 소진을 빠르게 감지합니다. 겉으로는 괜찮아 보여도 무언가 약해지고 있는 순간을 먼저 알아차립니다.",
      en: "You quickly sense changes in atmosphere and fading energy. Even when things look fine on the surface, you notice when something is getting weaker.",
    },
    noticesFirst: { ko: "빛의 세기, 말의 힘, 공간의 온도처럼 서서히 약해지는 신호가 먼저 들어옵니다.", en: "You first notice quiet signs of fading: the strength of light, the weight of words, the temperature of a room." },
    reveals: { ko: "안정감과 회복의 리듬을 중요하게 여깁니다. 무언가가 너무 오래 버티고 있거나, 곧 쉬어야 할 때를 잘 알아차립니다.", en: "Stability and recovery matter to you. You can sense when something has been holding on too long or needs rest soon." },
    strength: { ko: "무리하기 전에 에너지를 점검하고, 분위기를 부드럽게 회복시키는 감각이 있습니다.", en: "You can check energy before things are overextended and help restore the mood gently." },
    watchOut: { ko: "작은 피로 신호를 너무 크게 읽으면, 아직 남아 있는 힘까지 과소평가할 수 있습니다.", en: "If you read every small sign of fatigue too strongly, you may underestimate the strength that still remains." },
    friendQuestion: { ko: "나는 분위기가 지치거나 약해지는 걸 남들보다 빨리 알아차려?", en: "Do I notice when the mood is getting tired before others do?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “분위기의 밝기를 재는 사람”이 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Fading Light” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#d6a747",
  },
  "door-shadow": {
    id: "door-shadow",
    title: { ko: "닫힌 문 뒤를 살피는 감지자", en: "The One Who Notices the Shadow Behind the Door" },
    oneLiner: { ko: "장면이 설명되기 전부터 숨은 기척과 애매한 위험을 읽는 타입입니다.", en: "You notice hidden signals before the scene explains itself." },
    description: {
      ko: "당신은 보이는 것보다 숨겨진 신호에 먼저 반응합니다. 조심성이 많아서라기보다, 놓치면 안 되는 위험과 애매한 분위기를 빠르게 감지하는 편입니다.",
      en: "You react to hidden signals before obvious ones. It is not simply caution; you tend to sense unclear tension or risk that should not be missed.",
    },
    noticesFirst: { ko: "닫힌 문, 그림자, 말해지지 않은 기척처럼 아직 드러나지 않은 부분에 시선이 갑니다.", en: "Your attention goes to closed doors, shadows, and presences that have not fully appeared yet." },
    reveals: { ko: "확실하지 않은 장면에서 마음이 먼저 주변을 살핍니다. 안전한지, 무엇이 빠졌는지, 누가 침묵하고 있는지를 확인하려 합니다.", en: "In uncertain scenes, your mind scans the surroundings first. You want to know whether it is safe, what is missing, and who is silent." },
    strength: { ko: "남들이 지나치는 위험 신호나 어색한 공기를 빠르게 읽습니다.", en: "You can read warning signs and awkward tension that others may pass by." },
    watchOut: { ko: "모든 그림자를 위협으로 보면, 궁금함이나 가능성까지 긴장으로 느낄 수 있습니다.", en: "If every shadow becomes a threat, curiosity and possibility may also feel tense." },
    friendQuestion: { ko: "나는 분위기가 애매하면 숨은 위험부터 보는 편이야?", en: "When the mood is unclear, do I look for hidden risks first?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “닫힌 문 뒤를 살피는 감지자”가 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Shadow Behind the Door” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#746b8f",
  },
  crack: {
    id: "crack",
    title: { ko: "멀쩡함 속 균열을 보는 사람", en: "The One Who Notices the Crack" },
    oneLiner: { ko: "겉으로 괜찮아 보여도 오래 버틸 구조인지 먼저 확인하는 타입입니다.", en: "You notice what might break beneath the surface." },
    description: {
      ko: "당신은 겉으로 멀쩡해 보이는 것 안의 작은 균열을 잘 봅니다. 관계든 상황이든, 무너지기 전의 작은 흔들림을 먼저 알아차리는 사람입니다.",
      en: "You are good at seeing the small crack inside what looks intact. In relationships or situations, you notice the early tremor before anything collapses.",
    },
    noticesFirst: { ko: "작은 금, 어긋난 물건, 불안정한 구조처럼 장면을 지탱하는 부분의 흔들림이 먼저 보입니다.", en: "You notice small fractures, misplaced objects, and instability in the parts holding the scene together." },
    reveals: { ko: "당신에게는 ‘괜찮아 보이는가’보다 ‘계속 버틸 수 있는가’가 더 중요하게 느껴질 수 있습니다.", en: "For you, the question may be less 'Does it look fine?' and more 'Can it keep holding?'" },
    strength: { ko: "문제가 커지기 전에 구조를 점검하고, 오래 버틸 수 있는 방식을 찾습니다.", en: "You can inspect the structure before problems grow and look for what can last." },
    watchOut: { ko: "균열을 너무 빨리 찾다 보면, 아직 단단한 부분의 힘을 충분히 믿지 못할 수 있습니다.", en: "If you search for cracks too quickly, you may not fully trust the parts that are still solid." },
    friendQuestion: { ko: "나는 겉으로 괜찮아 보여도 작은 불안정함을 먼저 찾는 편이야?", en: "Do I notice small instability even when things look fine?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “멀쩡함 속 균열을 보는 사람”이 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Crack” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#8c745a",
  },
  "distant-sound": {
    id: "distant-sound",
    title: { ko: "먼 신호에 먼저 끌리는 사람", en: "The One Who Hears the Distant Sound" },
    oneLiner: { ko: "눈앞의 답보다 아직 오지 않은 변화의 예고에 마음이 먼저 움직이는 타입입니다.", en: "You are drawn to signals that have not arrived yet." },
    description: {
      ko: "당신의 마음은 눈앞의 것보다 아직 오지 않은 신호에 끌립니다. 설명되지 않은 가능성, 멀리서 다가오는 변화에 민감합니다.",
      en: "Your mind is drawn to signals that have not fully arrived. You are sensitive to unexplained possibility and change coming from far away.",
    },
    noticesFirst: { ko: "멀리서 들리는 소리, 희미한 움직임, 아직 설명되지 않은 방향이 먼저 마음에 남습니다.", en: "Distant sounds, faint movement, and unexplained directions stay in your mind first." },
    reveals: { ko: "당신은 현재 장면의 정답보다 다음 장면의 예고에 더 끌릴 수 있습니다. 호기심이 마음을 앞으로 데려갑니다.", en: "You may be more drawn to the hint of the next scene than the answer in the current one. Curiosity pulls your mind forward." },
    strength: { ko: "새로운 가능성의 기척을 잘 포착하고, 아직 이름 붙지 않은 방향을 상상할 수 있습니다.", en: "You can catch the first signs of new possibility and imagine directions that do not have names yet." },
    watchOut: { ko: "멀리 있는 신호에 집중하다 보면, 가까이에 있는 감정이나 약속을 늦게 볼 수 있습니다.", en: "If you focus on distant signals, you may notice nearby feelings or commitments late." },
    friendQuestion: { ko: "나는 눈앞의 일보다 곧 올 변화에 더 먼저 끌리는 편이야?", en: "Am I drawn to coming changes before what is right in front of me?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “먼 신호에 먼저 끌리는 사람”이 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Hears the Distant Sound” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#587a8e",
  },
  "closed-drawer": {
    id: "closed-drawer",
    title: { ko: "닫힌 마음의 손잡이를 보는 사람", en: "The One Who Notices the Closed Drawer" },
    oneLiner: { ko: "겉말보다 아직 꺼내지 못한 이야기와 조심스러운 마음에 끌리는 타입입니다.", en: "You are drawn to the feelings people keep closed." },
    description: {
      ko: "당신은 드러난 말보다 숨겨둔 마음에 더 끌립니다. 사람의 표면보다, 말하지 못한 이야기와 조용히 닫아둔 감정을 읽으려 합니다.",
      en: "You are more drawn to hidden feelings than obvious words. You try to read the stories people could not say and the emotions quietly closed away.",
    },
    noticesFirst: { ko: "잠긴 서랍, 닫힌 가방, 정리된 표면 아래에 남아 있는 개인적인 흔적을 먼저 봅니다.", en: "You first notice locked drawers, closed bags, and private traces beneath a tidy surface." },
    reveals: { ko: "겉으로 보이는 답보다 그 사람이 왜 숨겼는지, 무엇을 아직 꺼내지 못했는지를 궁금해합니다.", en: "You wonder why something was hidden and what could not be brought out yet, more than accepting the visible answer." },
    strength: { ko: "겉말 뒤의 조심스러운 마음을 배려하고, 쉽게 단정하지 않는 깊이가 있습니다.", en: "You can respect careful feelings behind surface words and avoid quick judgment." },
    watchOut: { ko: "모든 닫힌 것을 열어야 할 이야기로 느끼면, 상대의 침묵을 쉬게 두기 어려울 수 있습니다.", en: "If every closed thing feels like a story to open, it may be hard to let another person's silence rest." },
    friendQuestion: { ko: "나는 사람들이 숨겨둔 마음을 자꾸 읽으려고 하는 편이야?", en: "Do I often try to read the feelings people keep hidden?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “닫힌 마음의 손잡이를 보는 사람”이 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Closed Drawer” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#6c665f",
  },
  "empty-chair": {
    id: "empty-chair",
    title: { ko: "빈자리의 온도를 느끼는 사람", en: "The One Who Notices the Empty Chair" },
    oneLiner: { ko: "있는 것만큼이나 빠진 것과 남겨진 자리를 강하게 느끼는 타입입니다.", en: "You feel the meaning of what is absent." },
    description: {
      ko: "당신은 존재하는 것만큼이나 비어 있는 자리를 강하게 느끼는 사람입니다. 누가 없는지, 무엇이 빠졌는지, 왜 그 자리가 남아 있는지를 먼저 생각합니다.",
      en: "You feel empty spaces as strongly as visible things. You first wonder who is missing, what has been left out, and why that place remains.",
    },
    noticesFirst: { ko: "빈 의자, 남겨진 자리, 말없이 비어 있는 공간처럼 부재의 모양이 먼저 마음에 들어옵니다.", en: "You first notice empty chairs, unfilled places, and silent spaces shaped by absence." },
    reveals: { ko: "소속감, 기다림, 외로움의 결을 섬세하게 느낍니다. 장면 안에서 보이지 않는 사람의 자리를 상상합니다.", en: "You sense belonging, waiting, and loneliness with detail. Inside a scene, you imagine the place of someone unseen." },
    strength: { ko: "빠진 부분을 알아차리고, 누군가의 빈자리를 쉽게 지나치지 않는 다정함이 있습니다.", en: "You notice what is missing and carry a tenderness that does not ignore someone's empty place." },
    watchOut: { ko: "부재를 너무 깊게 느끼면, 지금 곁에 있는 것의 온도를 늦게 받을 수 있습니다.", en: "If you feel absence too deeply, you may receive the warmth of what is present a little late." },
    friendQuestion: { ko: "나는 누가 없거나 무엇이 빠졌는지를 먼저 느끼는 편이야?", en: "Do I first notice who is missing or what is absent?" },
    shareText: { ko: "나는 무의식 장면 테스트에서 “빈자리의 온도를 느끼는 사람”이 나왔다. 너는 어떤 장면을 먼저 볼까?", en: "I got “The One Who Notices the Empty Chair” on The Scene You Notice First. What scene would you notice first?" },
    accent: "#9a6f7d",
  },
};

const RESULT_BY_DIMENSION: Record<SceneDimension, SceneResultId> = {
  freedomChange: "open-window",
  memoryAttachment: "letter",
  safetyStability: "fading-light",
  hiddenThreat: "door-shadow",
  recognitionMeaning: "crack",
  controlOrder: "closed-drawer",
  curiosityUnknown: "distant-sound",
  emotionalDepth: "empty-chair",
};

export function calculateSceneResult(choices: SceneChoice[]): {
  result: SceneResult;
  scores: Record<SceneDimension, number>;
} {
  const scores: Record<SceneDimension, number> = {
    freedomChange: 0,
    memoryAttachment: 0,
    safetyStability: 0,
    hiddenThreat: 0,
    recognitionMeaning: 0,
    controlOrder: 0,
    curiosityUnknown: 0,
    emotionalDepth: 0,
  };

  for (const choice of choices) {
    for (const [dimension, value] of Object.entries(choice.scores) as Array<[SceneDimension, number]>) {
      scores[dimension] += value;
    }
  }

  const winningDimension = (Object.entries(scores) as Array<[SceneDimension, number]>).sort(
    ([aKey, aValue], [bKey, bValue]) => bValue - aValue || aKey.localeCompare(bKey),
  )[0][0];

  return {
    result: SCENE_RESULTS[RESULT_BY_DIMENSION[winningDimension]],
    scores,
  };
}

export function getSceneResultById(id: unknown): SceneResult | null {
  if (typeof id !== "string") return null;
  return SCENE_RESULTS[id as SceneResultId] ?? null;
}
