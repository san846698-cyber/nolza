// 축구선수 성향 테스트 공용 엔진 — 2축: 포지션 직접 선택(축1) × 스타일 5문항(축2) = 25명.
// LCK 프로 테스트와 동일한 플로우. 한국/글로벌 두 테스트가 이 엔진+설정을 공유한다.
// 닮은 선수는 사진 없이 "유니폼(직접 그린 SVG) + 등번호 + 국기"로만 표기 → 저작권·초상권 안전.
import type { Metadata } from "next";
import { decodeSharePayload } from "@/lib/share-result";

export type FbStyleKey = "A" | "B" | "C" | "D" | "E";

export type FbPosition = { key: string; ko: string; en?: string };

export type FbPlayer = {
  key: string; // 테스트 내 고유 키 (예: "son")
  name: string;
  nameEn?: string; // 영문 표기 (예: "Son Heung-min") — 영어 로케일에서 사용
  pos: string; // 포지션 키
  style: FbStyleKey;
  flag: string; // 국기 SVG 코드 → /images/flags/{flag}.svg
  jersey: string; // 등번호
  desc: string;
  descEn?: string;
  tags: string[];
  tagsEn?: string[];
};

export type FbQuestion = {
  q: string;
  qEn?: string;
  answers: { label: string; labelEn?: string; styles: FbStyleKey[] }[];
};

export type FootballTestConfig = {
  id: string;
  path: string;
  testName: string;
  eyebrowPill: string;
  accent: string;
  accentInk: string;
  titleKo: string;
  metaDescription: string;
  introTitleTop: string; // 인트로 타이틀 1행 (예: "한국 축구선수")
  introSub: string;
  introDesc: string;
  positions: FbPosition[];
  styles: Record<FbStyleKey, string>;
  styleTie: FbStyleKey[];
  grid: Record<string, Record<FbStyleKey, string>>; // grid[포지션][스타일] = 선수 키
  players: Record<string, FbPlayer>;
  questions: FbQuestion[];
  notice: string;
  recommendIds: string[];
  statsEndpoint: string; // 결과 집계(월드컵 랭킹) API
  ogKicker: string;
  ogDefault: { title: string; sub: string; line: string };
  ogDescriptionDefault: string;
  // OG/공유 카드 모티프 — 이모지(⚽ + 국기/지구본) + 테마 배경(한국=레드 / 글로벌=블루).
  ogMotif?: string; // 보조 이모지 (예: "🇰🇷" / "🌍")
  ogTheme?: { bg: string; accent: string };
  // ── 영어(en) 선택 필드: localized=true 인 테스트만 영어로 렌더(없으면 한국어 폴백) ──
  localized?: boolean;
  stylesEn?: Record<FbStyleKey, string>;
  titleEn?: string;
  metaDescriptionEn?: string;
  introTitleTopEn?: string;
  introSubEn?: string;
  introDescEn?: string;
  noticeEn?: string;
  ogKickerEn?: string;
  ogDefaultEn?: { title: string; sub: string; line: string };
  ogDescriptionDefaultEn?: string;
};

export type FootballSharePayload = { v: 1; resultId: string; lang?: "en" };

// ── 공용 포지션 / 스타일 / 문항 (두 테스트 공유) ──
export const FB_POSITIONS: FbPosition[] = [
  { key: "gk", ko: "골키퍼", en: "Goalkeeper" },
  { key: "cb", ko: "중앙 수비수", en: "Center-Back" },
  { key: "fb", ko: "측면 수비수", en: "Full-Back" },
  { key: "mf", ko: "미드필더", en: "Midfielder" },
  { key: "fw", ko: "공격수", en: "Forward" },
];

export const FB_STYLES: Record<FbStyleKey, string> = {
  A: "공격적 주도형",
  B: "안정적 정통파",
  C: "빅매치 클러치형",
  D: "창의적 기술형",
  E: "헌신적 일꾼형",
};

export const FB_STYLES_EN: Record<FbStyleKey, string> = {
  A: "Attacking Leader",
  B: "Steady Classic",
  C: "Big-Game Clutch",
  D: "Creative Maestro",
  E: "Relentless Workhorse",
};

export const FB_STYLE_TIE: FbStyleKey[] = ["A", "B", "C", "D", "E"];

export const FB_QUESTIONS: FbQuestion[] = [
  {
    q: "너의 플레이 성향에 가장 가까운 건?",
    qEn: "Which best matches your playstyle?",
    answers: [
      { label: "공격적으로 직접 해결한다", labelEn: "Take charge and decide it myself", styles: ["A"] },
      { label: "안정적이고 꾸준하게 간다", labelEn: "Steady and consistent, every game", styles: ["B"] },
      { label: "큰 경기일수록 폭발한다", labelEn: "I rise to the occasion in big games", styles: ["C"] },
      { label: "창의적으로 기회를 만든다", labelEn: "Create chances with flair and craft", styles: ["D"] },
      { label: "팀을 위해 궂은일을 도맡는다", labelEn: "Take on the hard yards for the team", styles: ["E"] },
    ],
  },
  {
    q: "위기 상황, 너의 선택은?",
    qEn: "Crisis moment — what do you do?",
    answers: [
      { label: "앞장서서 먼저 돌파한다", labelEn: "Step up and break the line first", styles: ["A"] },
      { label: "침착하게 평소처럼 한다", labelEn: "Stay calm and do what I always do", styles: ["B"] },
      { label: "한 방으로 판을 뒤집는다", labelEn: "Turn it around with one moment", styles: ["C"] },
      { label: "예상 못한 플레이를 던진다", labelEn: "Pull out something unexpected", styles: ["D"] },
      { label: "몸을 던져 팀을 지킨다", labelEn: "Put my body on the line for the team", styles: ["E"] },
    ],
  },
  {
    q: "가장 듣고 싶은 칭찬은?",
    qEn: "What praise do you most want to hear?",
    answers: [
      { label: "\"결정력 미쳤다\"", labelEn: "\"Your finishing is lethal\"", styles: ["A"] },
      { label: "\"한결같이 잘한다\"", labelEn: "\"So consistent, every game\"", styles: ["B"] },
      { label: "\"큰 경기에 강하다\"", labelEn: "\"You show up when it matters\"", styles: ["C"] },
      { label: "\"발재간·시야가 예술이다\"", labelEn: "\"Your touch and vision are art\"", styles: ["D"] },
      { label: "\"팀의 기둥이다\"", labelEn: "\"You're the glue holding this team together\"", styles: ["E"] },
    ],
  },
  {
    q: "훈련에서 가장 공들이는 부분은?",
    qEn: "What do you grind most in training?",
    answers: [
      { label: "마무리·득점 능력", labelEn: "Finishing and scoring", styles: ["A"] },
      { label: "기본기와 꾸준함", labelEn: "Fundamentals and consistency", styles: ["B"] },
      { label: "큰 경기 대비", labelEn: "Preparing for the big games", styles: ["C"] },
      { label: "새로운 기술·창의 플레이", labelEn: "New tricks and unconventional play", styles: ["D"] },
      { label: "체력과 궂은일", labelEn: "Stamina and the hard yards", styles: ["E"] },
    ],
  },
  {
    q: "너를 한마디로 표현하면?",
    qEn: "Sum yourself up in one line:",
    answers: [
      { label: "\"공격이 최선의 수비\"", labelEn: "\"Attack is the best defense\"", styles: ["A"] },
      { label: "\"꾸준함이 곧 재능\"", labelEn: "\"Consistency is a talent\"", styles: ["B"] },
      { label: "\"무대가 클수록 강하다\"", labelEn: "\"The bigger the stage, the better\"", styles: ["C"] },
      { label: "\"남들 안 하는 걸 한다\"", labelEn: "\"I see spaces others don't\"", styles: ["D"] },
      { label: "\"묵묵히 제 몫을 한다\"", labelEn: "\"I quietly do my job\"", styles: ["E"] },
    ],
  },
];

// ── 채점 (LCK 와 동일): 스타일 최다 득표, 동점이면 styleTie 우선순위 ──
export function scoreStyle(picks: FbStyleKey[][], tie: FbStyleKey[]): FbStyleKey {
  const c: Record<string, number> = {};
  for (const k of tie) c[k] = 0;
  picks.forEach((arr) => arr.forEach((k) => { c[k] = (c[k] ?? 0) + 1; }));
  let best = tie[0];
  for (const k of tie) if (c[k] > c[best]) best = k;
  return best;
}

export function gridResult(config: FootballTestConfig, pos: string, picks: FbStyleKey[][]): string {
  return config.grid[pos][scoreStyle(picks, config.styleTie)];
}

export function isPosKey(config: FootballTestConfig, v: string | null | undefined): v is string {
  return Boolean(v) && config.positions.some((p) => p.key === v);
}

export function isPlayerKey(config: FootballTestConfig, v: string | null | undefined): v is string {
  return Boolean(v) && Object.prototype.hasOwnProperty.call(config.players, v as string);
}

export function posKo(config: FootballTestConfig, pos: string): string {
  return config.positions.find((p) => p.key === pos)?.ko ?? "";
}

// 포지션 라벨(로케일 반영). en=true 이고 영문이 있으면 영문, 없으면 한국어 폴백.
export function posLabel(config: FootballTestConfig, pos: string, en: boolean): string {
  const p = config.positions.find((entry) => entry.key === pos);
  if (!p) return "";
  return en ? p.en ?? p.ko : p.ko;
}

// 스타일 라벨(로케일 반영).
export function styleLabel(config: FootballTestConfig, style: FbStyleKey, en: boolean): string {
  return en && config.stylesEn ? config.stylesEn[style] : config.styles[style];
}

// 선수명(로케일 반영).
export function playerName(player: FbPlayer, en: boolean): string {
  return en ? player.nameEn ?? player.name : player.name;
}

export function resolveResultKey(
  config: FootballTestConfig,
  sParam: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(sParam) ? sParam[0] : sParam;
  const payload = decodeSharePayload<{ v?: number; resultId?: string }>(raw ?? null);
  return payload && isPlayerKey(config, payload.resultId) ? (payload.resultId as string) : null;
}

// 공유 페이로드의 lang 을 읽어 영어 로케일 여부 판정 (localized 테스트에서만 유효).
export function resolveEn(
  config: FootballTestConfig,
  sParam: string | string[] | undefined,
): boolean {
  if (!config.localized) return false;
  const raw = Array.isArray(sParam) ? sParam[0] : sParam;
  const payload = decodeSharePayload<{ lang?: string }>(raw ?? null);
  return payload?.lang === "en";
}

export function buildFootballMetadata(
  config: FootballTestConfig,
  sParam: string | string[] | undefined,
): Metadata {
  const key = resolveResultKey(config, sParam);
  const en = resolveEn(config, sParam);
  const player = key ? config.players[key] : null;
  const langQuery = en ? "&lang=en" : "";
  const ogImage = key
    ? `${config.path}/result-og?key=${key}${langQuery}`
    : `${config.path}/result-og${en ? "?lang=en" : ""}`;

  const title = en ? config.titleEn ?? config.titleKo : config.titleKo;
  const description = en
    ? config.metaDescriptionEn ?? config.metaDescription
    : config.metaDescription;

  let ogTitle: string;
  let ogDescription: string;
  if (player) {
    const name = playerName(player, en);
    const pos = posLabel(config, player.pos, en);
    const style = styleLabel(config, player.style, en);
    ogTitle = en
      ? `You play like ${name} — ${pos} · ${style}`
      : `나랑 닮은 선수: ${name} (${pos} · ${style})`;
    ogDescription = en
      ? `I play like ${name}! ${pos} · ${style}. Who do you play like?`
      : `나랑 닮은 축구선수는 ${name}! ${pos} · ${style}. 너랑 닮은 선수는?`;
  } else {
    ogTitle = title;
    ogDescription = en
      ? config.ogDescriptionDefaultEn ?? config.ogDescriptionDefault
      : config.ogDescriptionDefault;
  }

  return {
    title,
    description,
    alternates: { canonical: config.path },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: config.path,
      siteName: "nolza.fun",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      locale: en ? "en_US" : "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}
