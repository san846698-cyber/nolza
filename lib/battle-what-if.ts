// Hub catalog for the Battle What-If game series.
// Each entry is a battle that gets its own deep branching game.
// Only Cannae is implemented in v1; others are placeholders.

export type LocalizedString = { ko: string; en: string };

export interface BattleEntry {
  id: "hannibal" | "red-cliffs" | "hansando" | "waterloo" | "midway";
  era: LocalizedString;
  title: LocalizedString;
  commander: LocalizedString;
  tagline: LocalizedString;
  available: boolean;
  href?: string;
}

export const BATTLE_ENTRIES: BattleEntry[] = [
  {
    id: "hannibal",
    era: { ko: "기원전 218–216년", en: "218–216 BCE" },
    title: { ko: "한니발 — 이탈리아 원정", en: "Hannibal — Italian Campaign" },
    commander: { ko: "한니발 바르카", en: "Hannibal Barca" },
    tagline: {
      ko: "알프스부터 칸나에까지. 다섯 번의 갈림길에서 당신은 한니발이라면 어떻게 했을까.",
      en: "From the Alps to Cannae. At five forks, what would you have done?",
    },
    available: true,
    href: "/games/battle-what-if/hannibal",
  },
  {
    id: "red-cliffs",
    era: { ko: "208년", en: "208 CE" },
    title: { ko: "적벽대전", en: "Battle of Red Cliffs" },
    commander: { ko: "주유", en: "Zhou Yu" },
    tagline: {
      ko: "장강 북안의 80만 자칭 대군. 동남풍은 며칠뿐이다.",
      en: "800,000 claimed across the Yangtze. The southeast wind blows for days only.",
    },
    available: true,
    href: "/games/battle-what-if/red-cliffs",
  },
  {
    id: "hansando",
    era: { ko: "1592년", en: "1592" },
    title: { ko: "한산도대첩", en: "Battle of Hansando" },
    commander: { ko: "이순신", en: "Yi Sun-sin" },
    tagline: {
      ko: "좁은 해협, 넓은 바다, 학익진을 펼 곳을 골라야 한다.",
      en: "Narrow strait or open sea — pick where the crane wing can spread.",
    },
    available: true,
    href: "/games/battle-what-if/hansando",
  },
  {
    id: "waterloo",
    era: { ko: "1815년", en: "1815" },
    title: { ko: "워털루 전투", en: "Battle of Waterloo" },
    commander: { ko: "나폴레옹 보나파르트", en: "Napoleon Bonaparte" },
    tagline: {
      ko: "100일 천하의 마지막 날. 진창과 그루시의 행방.",
      en: "The last day of the Hundred Days. Mud, and Grouchy's whereabouts.",
    },
    available: true,
    href: "/games/battle-what-if/waterloo",
  },
  {
    id: "midway",
    era: { ko: "1942년", en: "1942" },
    title: { ko: "미드웨이 해전", en: "Battle of Midway" },
    commander: { ko: "체스터 니미츠", en: "Chester Nimitz" },
    tagline: {
      ko: "암호 해독반의 정보. 항모 셋, 일본은 넷.",
      en: "Cryptanalysis vs intuition. Three carriers to their four.",
    },
    available: true,
    href: "/games/battle-what-if/midway",
  },
];
