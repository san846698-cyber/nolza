export type DeepMilestone = {
  depth: number;
  title: { ko: string; en: string };
  fact: { ko: string; en: string };
  pressure?: { ko: string; en: string };
  visual: "surface" | "diver" | "light" | "twilight" | "dark" | "wreck" | "creature" | "trench";
  side: "left" | "right";
};

export const MAX_DEEP_SEA_DEPTH = 10984;

export const DEEP_SEA_MILESTONES: DeepMilestone[] = [
  {
    depth: 0,
    title: { ko: "해수면", en: "Ocean Surface" },
    fact: {
      ko: "빛과 파도가 가장 선명한 출발점입니다. 아래로 내려갈수록 색은 하나씩 사라집니다.",
      en: "The journey starts in bright surface water. As you descend, colors begin to vanish one by one.",
    },
    visual: "surface",
    side: "left",
  },
  {
    depth: 10,
    title: { ko: "스노클링 깊이", en: "Snorkeling Depth" },
    fact: {
      ko: "아직 사람의 몸이 바다를 친근하게 느끼는 구간입니다. 수면의 소리도 가까이 들립니다.",
      en: "This is still a human-friendly layer, close enough to hear and feel the surface above.",
    },
    pressure: { ko: "약 2기압", en: "About 2 atmospheres" },
    visual: "diver",
    side: "right",
  },
  {
    depth: 40,
    title: { ko: "일반 다이빙 한계", en: "Recreational Diving Limit" },
    fact: {
      ko: "일반 레저 다이빙이 조심스럽게 멈추는 깊이입니다. 여기부터 바다는 여행지가 아니라 환경이 됩니다.",
      en: "A common recreational diving limit. Beyond here, the ocean feels less like a destination and more like an environment.",
    },
    pressure: { ko: "약 5기압", en: "About 5 atmospheres" },
    visual: "diver",
    side: "left",
  },
  {
    depth: 100,
    title: { ko: "햇빛이 약해지는 구간", en: "Sunlight Starts Fading" },
    fact: {
      ko: "붉은색은 거의 사라지고 푸른빛만 남습니다. 익숙한 물체도 낯선 그림자로 보이기 시작합니다.",
      en: "Red light is nearly gone; blue dominates. Familiar shapes begin to look like silhouettes.",
    },
    pressure: { ko: "약 11기압", en: "About 11 atmospheres" },
    visual: "light",
    side: "right",
  },
  {
    depth: 200,
    title: { ko: "빛이 거의 사라지는 곳", en: "The Twilight Zone" },
    fact: {
      ko: "광합성은 어려워지고 생물들은 더 느리게, 더 조용하게 움직입니다.",
      en: "Photosynthesis becomes difficult, and life moves more slowly and quietly.",
    },
    pressure: { ko: "약 21기압", en: "About 21 atmospheres" },
    visual: "twilight",
    side: "left",
  },
  {
    depth: 1000,
    title: { ko: "완전한 어둠", en: "Total Darkness Begins" },
    fact: {
      ko: "햇빛은 닿지 않습니다. 여기서부터 빛은 생물이 직접 만드는 신호가 됩니다.",
      en: "Sunlight no longer reaches this depth. From here, light is something living things produce themselves.",
    },
    pressure: { ko: "약 101기압", en: "About 101 atmospheres" },
    visual: "dark",
    side: "right",
  },
  {
    depth: 3800,
    title: { ko: "타이타닉이 잠든 깊이", en: "Titanic Wreck Depth" },
    fact: {
      ko: "대서양의 타이타닉 난파선이 놓인 깊이와 비슷합니다. 인간의 이야기도 여기서는 천천히 분해됩니다.",
      en: "Roughly the depth of the Titanic wreck in the Atlantic. Even human stories decompose slowly here.",
    },
    pressure: { ko: "약 381기압", en: "About 381 atmospheres" },
    visual: "wreck",
    side: "left",
  },
  {
    depth: 6000,
    title: { ko: "심해 생물의 세계", en: "Deep Sea World" },
    fact: {
      ko: "차갑고 어두운 세계지만 비어 있지는 않습니다. 느린 생명들이 압력 속에서 자기 방식으로 살아갑니다.",
      en: "Cold and dark does not mean empty. Slow forms of life keep surviving under immense pressure.",
    },
    pressure: { ko: "약 601기압", en: "About 601 atmospheres" },
    visual: "creature",
    side: "right",
  },
  {
    depth: 10984,
    title: { ko: "챌린저 딥", en: "Challenger Deep" },
    fact: {
      ko: "마리아나 해구의 가장 깊은 지점 중 하나입니다. 산을 뒤집어 넣어도 수면까지 닿기 어렵습니다.",
      en: "One of the deepest known points of the Mariana Trench. Even an inverted mountain would struggle to reach the surface.",
    },
    pressure: { ko: "약 1,100기압", en: "About 1,100 atmospheres" },
    visual: "trench",
    side: "left",
  },
];
