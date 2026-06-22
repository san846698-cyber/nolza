// LCK 프로게이머 성향 테스트 — 포지션 선택(축1) × 스타일 5문항(축2) = 25명.
// 결과/페르소나는 확정 데이터. 사진 경로/폴백은 한 곳에서 관리(통보 시 1줄로 전부 내림).

export type LckPosKey = "top" | "jng" | "mid" | "adc" | "sup";
export type LckStyleKey = "A" | "B" | "C" | "D" | "E";

export type LckPosition = { key: LckPosKey; ko: string };
export const LCK_POSITIONS: LckPosition[] = [
  { key: "top", ko: "탑" },
  { key: "jng", ko: "정글" },
  { key: "mid", ko: "미드" },
  { key: "adc", ko: "원딜" },
  { key: "sup", ko: "서폿" },
];

export const LCK_STYLES: Record<LckStyleKey, string> = {
  A: "공격적 캐리",
  B: "안정적 에이스",
  C: "빅게임 한타형",
  D: "창의적 두뇌·변수",
  E: "헌신적 만능 일꾼",
};

// grid[포지션][스타일] = 선수 키
export const LCK_GRID: Record<LckPosKey, Record<LckStyleKey, string>> = {
  top: { A: "khan", B: "kiin", C: "marin", D: "smeb", E: "zeus" },
  jng: { A: "canyon", B: "score", C: "ambition", D: "peanut", E: "bengi" },
  mid: { A: "chovy", B: "faker", C: "pawn", D: "zeka", E: "showmaker" },
  adc: { A: "imp", B: "ruler", C: "bang", D: "deft", E: "pray" },
  sup: { A: "madlife", B: "corejj", C: "keria", D: "mata", E: "wolf" },
};

export const LCK_STYLE_TIE: LckStyleKey[] = ["A", "B", "C", "D", "E"];

export type LckPlayer = {
  key: string;
  name: string;
  pos: LckPosKey;
  style: LckStyleKey;
  desc: string;
  tags: string[];
};

export const LCK_PLAYERS: Record<string, LckPlayer> = {
  // ── 탑 ──
  khan: { key: "khan", name: "칸", pos: "top", style: "A", desc: "공격적 캐리 탑의 대명사. 라인전 폭딜과 슈퍼플레이로 판을 가른 지배적 탑.", tags: ["#캐리탑", "#라인전지배", "#슈퍼플레이", "#공격성"] },
  kiin: { key: "kiin", name: "기인", pos: "top", style: "B", desc: "메타 안 타는 꾸준함의 표본. 오랜 세월 정상급을 지킨 안정의 아이콘.", tags: ["#꾸준함", "#안정", "#롱런", "#장인"] },
  marin: { key: "marin", name: "마린", pos: "top", style: "C", desc: "2015 월즈 우승 주역. 큰 무대에서 폭발하는 빅게임 탑.", tags: ["#월즈우승", "#빅게임", "#클러치", "#큰무대"] },
  smeb: { key: "smeb", name: "스멥", pos: "top", style: "D", desc: "2회 LCK MVP. 넓은 챔프폭으로 무엇이든 캐리한 천재형 탑.", tags: ["#2회MVP", "#만능챔폭", "#캐리", "#천재"] },
  zeus: { key: "zeus", name: "제우스", pos: "top", style: "E", desc: "탱·캐리 다 소화하는 우승 청부 탑. 팀을 위해 뭐든 하는 만능.", tags: ["#우승청부", "#탱·캐리", "#팀중심", "#적응"] },

  // ── 정글 ──
  canyon: { key: "canyon", name: "캐니언", pos: "jng", style: "A", desc: "갓캐니언. 지능과 공격성을 겸비한 캐리 정글의 표준.", tags: ["#갓캐니언", "#캐리정글", "#지능적", "#맵리딩"] },
  score: { key: "score", name: "스코어", pos: "jng", style: "B", desc: "롱제비티의 상징. 오랜 세월 꾸준했던 운영형 베테랑.", tags: ["#롱런", "#운영", "#베테랑", "#꾸준"] },
  ambition: { key: "ambition", name: "앰비션", pos: "jng", style: "C", desc: "2017 월즈 우승. 큰 경기 한타에서 빛난 클러치 정글.", tags: ["#월즈우승", "#한타", "#클러치", "#빅게임"] },
  peanut: { key: "peanut", name: "피넛", pos: "jng", style: "D", desc: "여러 팀에서 우승. 어떤 스타일도 소화하는 만능 변수형.", tags: ["#만능", "#변수", "#다재다능", "#우승콜렉터"] },
  bengi: { key: "bengi", name: "벵기", pos: "jng", style: "E", desc: "3회 월즈 우승, 페이커 옆을 지킨 헌신의 정글. 화려함보다 팀.", tags: ["#3회월즈", "#헌신", "#팀우선", "#전략"] },

  // ── 미드 ──
  chovy: { key: "chovy", name: "쵸비", pos: "mid", style: "A", desc: "라인전·메카닉의 정점. 압살하는 캐리형 미드.", tags: ["#라인전괴물", "#메카닉", "#캐리", "#완벽주의"] },
  faker: { key: "faker", name: "페이커", pos: "mid", style: "B", desc: "이견 없는 GOAT. 꾸준함·멘탈·클러치의 대명사.", tags: ["#GOAT", "#멘탈갑", "#클러치", "#꾸준함의황제"] },
  pawn: { key: "pawn", name: "폰", pos: "mid", style: "C", desc: "2014 월즈 우승. 전성기 페이커를 꺾은 빅게임 플레이어.", tags: ["#월즈우승", "#빅게임", "#페이커킬러", "#큰무대"] },
  zeka: { key: "zeka", name: "제카", pos: "mid", style: "D", desc: "2022 월즈 우승·결승 MVP. 폭발적인 한타 하드캐리, 큰 무대일수록 강해지는 빅게임 플레이어.", tags: ["#월즈우승", "#결승MVP", "#한타하드캐리", "#빅게임"] },
  showmaker: { key: "showmaker", name: "쇼메이커", pos: "mid", style: "E", desc: "2020 월즈 우승. 넓은 챔프폭의 만능 에이스.", tags: ["#월즈우승", "#만능챔폭", "#에이스", "#캐리"] },

  // ── 원딜 ──
  imp: { key: "imp", name: "임프", pos: "adc", style: "A", desc: "2014 월즈. 공격적 포지셔닝으로 한타를 터뜨린 캐리형 원딜.", tags: ["#월즈우승", "#공격적", "#한타", "#캐리"] },
  ruler: { key: "ruler", name: "룰러", pos: "adc", style: "B", desc: "완벽한 포지셔닝과 침착함. 한타의 신, 안정+캐리.", tags: ["#한타의신", "#포지셔닝", "#안정+캐리", "#침착"] },
  bang: { key: "bang", name: "뱅", pos: "adc", style: "C", desc: "2회 월즈 우승(T1). 큰 경기에서 증명한 빅게임 원딜.", tags: ["#2회월즈", "#빅게임", "#T1레전드", "#클러치"] },
  deft: { key: "deft", name: "데프트", pos: "adc", style: "D", desc: "2022 월즈 우승. 영리한 운영과 롱제비티의 레전드.", tags: ["#월즈우승", "#영리함", "#롱런", "#노장클러치"] },
  pray: { key: "pray", name: "프레이", pos: "adc", style: "E", desc: "꾸준함과 안정의 베테랑. 묵묵히 팀을 받친 만능.", tags: ["#꾸준", "#안정", "#베테랑", "#팀중심"] },

  // ── 서폿 ──
  madlife: { key: "madlife", name: "매드라이프", pos: "sup", style: "A", desc: "훅의 신, 이니시의 선구자. 공격적 플레이메이킹의 원조.", tags: ["#훅의신", "#이니시", "#선구자", "#공격적"] },
  corejj: { key: "corejj", name: "코어장전", pos: "sup", style: "B", desc: "2017 월즈. 안정적 운영과 시야의 에이스.", tags: ["#월즈우승", "#안정", "#시야", "#운영"] },
  keria: { key: "keria", name: "케리아", pos: "sup", style: "C", desc: "천재 플레이메이커. 창의적 변수로 큰 경기를 흔든다.", tags: ["#천재", "#창의적", "#변수", "#플레이메이커"] },
  mata: { key: "mata", name: "마타", pos: "sup", style: "D", desc: "2014 월즈 MVP. 전략·시야·샷콜의 두뇌, 서폿의 GOAT급.", tags: ["#월즈MVP", "#두뇌", "#샷콜", "#전략"] },
  wolf: { key: "wolf", name: "울프", pos: "sup", style: "E", desc: "2회 월즈 우승(T1). 헌신과 유틸의 만능 서폿.", tags: ["#2회월즈", "#헌신", "#유틸", "#만능"] },
};

export type LckQuestion = { q: string; answers: { label: string; styles: LckStyleKey[] }[] };
export const LCK_QUESTIONS: LckQuestion[] = [
  {
    q: "너의 플레이 성향은?",
    answers: [
      { label: "공격적으로 직접 캐리", styles: ["A"] },
      { label: "안정적이고 꾸준하게", styles: ["B"] },
      { label: "큰 경기·한타에서 폭발", styles: ["C"] },
      { label: "똑똑하게 변수 창출", styles: ["D"] },
      { label: "팀에 맞춰 헌신·적응", styles: ["E"] },
    ],
  },
  {
    q: "위기 상황에서 너는?",
    answers: [
      { label: "먼저 들이박는다", styles: ["A"] },
      { label: "침착하게 평소처럼", styles: ["B"] },
      { label: "한 방으로 뒤집는다", styles: ["C"] },
      { label: "예상 못한 수를 던진다", styles: ["D"] },
      { label: "팀을 살리고 받친다", styles: ["E"] },
    ],
  },
  {
    q: "연습·준비 스타일은?",
    answers: [
      { label: "공격 패턴 갈고닦기", styles: ["A"] },
      { label: "꾸준히 기본기", styles: ["B"] },
      { label: "큰 경기 대비", styles: ["C"] },
      { label: "새 픽·전략 실험", styles: ["D"] },
      { label: "팀에 맞춰 뭐든", styles: ["E"] },
    ],
  },
  {
    q: "듣고 싶은 칭찬은?",
    answers: [
      { label: "\"캐리 미쳤다\"", styles: ["A"] },
      { label: "\"역시 꾸준하다\"", styles: ["B"] },
      { label: "\"큰 경기에 강하다\"", styles: ["C"] },
      { label: "\"진짜 창의적이다\"", styles: ["D"] },
      { label: "\"팀의 기둥이다\"", styles: ["E"] },
    ],
  },
  {
    q: "너를 표현하는 말은?",
    answers: [
      { label: "\"공격이 최선의 수비\"", styles: ["A"] },
      { label: "\"꾸준함이 곧 재능\"", styles: ["B"] },
      { label: "\"무대가 클수록 강하다\"", styles: ["C"] },
      { label: "\"남들 안 하는 걸 한다\"", styles: ["D"] },
      { label: "\"묵묵히 제 몫\"", styles: ["E"] },
    ],
  },
];

export function scoreLckStyle(picks: LckStyleKey[][]): LckStyleKey {
  const c: Record<LckStyleKey, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  picks.forEach((arr) => arr.forEach((k) => { c[k] += 1; }));
  let best: LckStyleKey = LCK_STYLE_TIE[0];
  for (const k of LCK_STYLE_TIE) if (c[k] > c[best]) best = k;
  return best;
}

export function lckResult(pos: LckPosKey, picks: LckStyleKey[][]): string {
  return LCK_GRID[pos][scoreLckStyle(picks)];
}

export function isLckPosKey(v: string | null | undefined): v is LckPosKey {
  return v === "top" || v === "jng" || v === "mid" || v === "adc" || v === "sup";
}

export function isLckPlayerKey(v: string | null | undefined): v is string {
  return Boolean(v) && Object.prototype.hasOwnProperty.call(LCK_PLAYERS, v as string);
}

export function posKo(pos: LckPosKey): string {
  return LCK_POSITIONS.find((p) => p.key === pos)?.ko ?? "";
}

// ── 이미지/저작권 (한 곳에서 관리) ──
// 실제 선수 사진을 쓰되, 통보 시 LCK_USE_PHOTOS=false 한 줄로 전부 끄고 텍스트/챔프 폴백으로 전환.
export const LCK_USE_PHOTOS = true;
export const LCK_PHOTO_BASE = "/images/tests/lck/players"; // {playerKey}.jpg — 사장님이 직접 소싱해 업로드
export const LCK_CHAMP_BASE = "/images/tests/lck/champ"; // 보험 폴백: {playerKey}.jpg (시그니처 챔프 아트)

export const LCK_NOTICE =
  "비공식 팬 콘텐츠이며, 해당 선수·구단·리그와 무관합니다. 모든 권리는 각 권리자에게 있습니다.";

export const LCK_PATH = "/tests/lck-pro";
export const LCK_ID = "lck-pro";
export const LCK_ACCENT = "#C8AA6E";
export const LCK_ACCENT_INK = "#1c1505";
