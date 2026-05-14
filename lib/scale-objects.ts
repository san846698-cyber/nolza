export type ScaleKind =
  | "atom"
  | "dna"
  | "cell"
  | "ant"
  | "bee"
  | "mouse"
  | "human"
  | "whale"
  | "skyscraper"
  | "mountain"
  | "moon"
  | "earth"
  | "sun"
  | "galaxy";

export type ScaleObj = {
  id: string;
  kind: ScaleKind;
  m: number;
  sizeKo: string;
  sizeEn: string;
  name: string;
  en: string;
  categoryKo: string;
  categoryEn: string;
  desc: string;
  descEn: string;
  accent: string;
};

export const SCALE_OBJECTS: ScaleObj[] = [
  {
    id: "hydrogen-atom",
    kind: "atom",
    m: 1e-10,
    sizeKo: "0.1 nm",
    sizeEn: "0.1 nm",
    name: "수소 원자",
    en: "Hydrogen Atom",
    categoryKo: "원자",
    categoryEn: "Atomic scale",
    desc: "우주에서 가장 흔한 원소. 거의 모든 별의 시작점입니다.",
    descEn: "The most abundant element in the universe, and the starting point of stars.",
    accent: "#9bc8ff",
  },
  {
    id: "dna",
    kind: "dna",
    m: 2e-9,
    sizeKo: "2 nm",
    sizeEn: "2 nm",
    name: "DNA 이중나선",
    en: "DNA Double Helix",
    categoryKo: "분자",
    categoryEn: "Molecular scale",
    desc: "생명의 설계도가 들어 있는, 눈에 보이지 않는 분자 사다리입니다.",
    descEn: "A molecular ladder holding the instructions for life.",
    accent: "#b8a3ff",
  },
  {
    id: "red-blood-cell",
    kind: "cell",
    m: 8e-6,
    sizeKo: "8 μm",
    sizeEn: "8 micrometers",
    name: "적혈구",
    en: "Red Blood Cell",
    categoryKo: "세포",
    categoryEn: "Cellular scale",
    desc: "산소를 운반하는 작은 원반. 우리 몸속을 초당 수백만 개씩 흐릅니다.",
    descEn: "A tiny oxygen carrier flowing through the body by the millions.",
    accent: "#d76d66",
  },
  {
    id: "ant",
    kind: "ant",
    m: 5e-3,
    sizeKo: "0.5 cm",
    sizeEn: "0.5 cm",
    name: "개미",
    en: "Ant",
    categoryKo: "곤충",
    categoryEn: "Insect scale",
    desc: "작지만 놀라운 힘을 지닌 생물. 일부 개미는 자기 몸무게의 몇 배를 옮깁니다.",
    descEn: "Small, precise, and strong. Some ants carry many times their body weight.",
    accent: "#8c6d4f",
  },
  {
    id: "honeybee",
    kind: "bee",
    m: 1.5e-2,
    sizeKo: "1.5 cm",
    sizeEn: "1.5 cm",
    name: "꿀벌",
    en: "Honeybee",
    categoryKo: "곤충",
    categoryEn: "Insect scale",
    desc: "꿀벌은 작지만, 인간의 식량 생태계에 거대한 영향을 줍니다.",
    descEn: "A honeybee is tiny, but its pollination supports a huge part of human food systems.",
    accent: "#d3a93b",
  },
  {
    id: "mouse",
    kind: "mouse",
    m: 9e-2,
    sizeKo: "9 cm",
    sizeEn: "9 cm",
    name: "생쥐",
    en: "House Mouse",
    categoryKo: "소형 포유류",
    categoryEn: "Small mammal",
    desc: "작은 몸으로 빠르게 움직이며, 인간과 가장 가까운 생태계 틈새에 적응했습니다.",
    descEn: "A small mammal adapted to the narrow spaces around human life.",
    accent: "#8f8a84",
  },
  {
    id: "human",
    kind: "human",
    m: 1.7,
    sizeKo: "1.7 m",
    sizeEn: "1.7 m",
    name: "사람",
    en: "Adult Human",
    categoryKo: "인간 스케일",
    categoryEn: "Human scale",
    desc: "세포와 행성 사이의 거대한 스케일 한가운데에 우리가 서 있습니다.",
    descEn: "The human body sits in the middle of a vast scale between cells and planets.",
    accent: "#445c72",
  },
  {
    id: "blue-whale",
    kind: "whale",
    m: 30,
    sizeKo: "30 m",
    sizeEn: "30 m",
    name: "대왕고래",
    en: "Blue Whale",
    categoryKo: "거대 생물",
    categoryEn: "Megafauna",
    desc: "지구에 살았던 것으로 알려진 가장 큰 동물입니다.",
    descEn: "The blue whale is the largest animal known to have lived on Earth.",
    accent: "#2d6f8f",
  },
  {
    id: "burj-khalifa",
    kind: "skyscraper",
    m: 828,
    sizeKo: "828 m",
    sizeEn: "828 m",
    name: "부르즈 할리파",
    en: "Burj Khalifa",
    categoryKo: "건축물",
    categoryEn: "Architecture",
    desc: "인간이 만든 수직 구조물이 도시의 하늘선을 어디까지 밀어 올렸는지 보여줍니다.",
    descEn: "A marker of how far human architecture has pushed the skyline upward.",
    accent: "#b78b5d",
  },
  {
    id: "everest",
    kind: "mountain",
    m: 8849,
    sizeKo: "8,849 m",
    sizeEn: "8,849 m",
    name: "에베레스트",
    en: "Mount Everest",
    categoryKo: "지형",
    categoryEn: "Geography",
    desc: "지구 표면에서 가장 높은 지점. 대기와 인간의 한계가 동시에 드러납니다.",
    descEn: "The highest point on Earth, where atmosphere and human limits both thin out.",
    accent: "#7f8b76",
  },
  {
    id: "moon",
    kind: "moon",
    m: 3.4742e6,
    sizeKo: "3,474 km",
    sizeEn: "3,474 km",
    name: "달",
    en: "The Moon",
    categoryKo: "천체",
    categoryEn: "Celestial body",
    desc: "밤하늘에서는 가까워 보이지만, 이미 대륙과 행성의 스케일을 넘어섭니다.",
    descEn: "It looks near in the night sky, yet it belongs to planetary scale.",
    accent: "#b8b5aa",
  },
  {
    id: "earth",
    kind: "earth",
    m: 1.2742e7,
    sizeKo: "12,742 km",
    sizeEn: "12,742 km",
    name: "지구",
    en: "Earth",
    categoryKo: "행성",
    categoryEn: "Planet",
    desc: "우리에게는 거대하지만, 태양 앞에서는 작은 푸른 점에 가깝습니다.",
    descEn: "Earth feels enormous to us, but it is tiny compared to the Sun.",
    accent: "#3d8b78",
  },
  {
    id: "sun",
    kind: "sun",
    m: 1.39e9,
    sizeKo: "139만 km",
    sizeEn: "1.39 million km",
    name: "태양",
    en: "The Sun",
    categoryKo: "항성",
    categoryEn: "Star",
    desc: "태양계 질량의 99% 이상을 품은 거대한 핵융합로입니다.",
    descEn: "The Sun contains more than 99% of the mass in our solar system.",
    accent: "#d39c45",
  },
  {
    id: "milky-way",
    kind: "galaxy",
    m: 9.461e20,
    sizeKo: "10만 광년",
    sizeEn: "100,000 light-years",
    name: "우리은하",
    en: "Milky Way Galaxy",
    categoryKo: "은하",
    categoryEn: "Galaxy",
    desc: "수천억 개의 별이 모인 구조. 태양도 이 거대한 소용돌이의 작은 점입니다.",
    descEn: "A structure of hundreds of billions of stars; the Sun is only one point in its spiral.",
    accent: "#8a7cff",
  },
];
