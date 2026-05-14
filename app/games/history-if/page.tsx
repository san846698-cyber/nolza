"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type LocalText = { ko: string; en: string };
type MetricKey = "stability" | "freedom" | "technology" | "diversity" | "inequality";
type FocusKey = "power" | "trade" | "culture" | "survival";
type StageKey = "1년 후" | "10년 후" | "50년 후" | "100년 후" | "현재";

type Stage = {
  key: StageKey;
  title: LocalText;
  cause: LocalText;
  body: LocalText;
  headline: LocalText;
  dashboard: Partial<Record<MetricKey, number>>;
};

type Scenario = {
  id: string;
  title: LocalText;
  premise: LocalText;
  original: LocalText;
  divergence: LocalText;
  marker: LocalText;
  warning?: LocalText;
  stages: Stage[];
  experiential: {
    textbook: LocalText;
    daily: LocalText;
    map: LocalText;
    job: LocalText;
    vanished: LocalText;
    culture: LocalText;
    korea: LocalText;
  };
  baseMetrics: Record<MetricKey, number>;
  koreaPosition: LocalText;
  life: LocalText;
  verdict: LocalText;
};

type Focus = {
  id: FocusKey;
  label: LocalText;
  description: LocalText;
  modifier: Partial<Record<MetricKey, number>>;
  title: LocalText;
  verdictTail: LocalText;
};

const BG = "#12100d";
const PANEL = "#1b1712";
const PAPER = "#f4ecd8";
const PAPER_DEEP = "#fff8e7";
const INK = "#241a14";
const MUTED = "#6f6250";
const LINE = "rgba(36,26,20,0.16)";
const GOLD = "#d6ad72";
const ACCENT = "#a45f2a";
const BLUE = "#3c6272";
const RED = "#8e3d2f";

const METRIC_LABEL: Record<MetricKey, LocalText> = {
  stability: { ko: "안정성", en: "Stability" },
  freedom: { ko: "자유도", en: "Freedom" },
  technology: { ko: "기술 수준", en: "Technology" },
  diversity: { ko: "문화 다양성", en: "Cultural diversity" },
  inequality: { ko: "경제 불평등", en: "Economic inequality" },
};

const FOCUSES: Focus[] = [
  {
    id: "power",
    label: { ko: "군사력과 통제가 세계질서를 지배한다", en: "Military power hardens the world order" },
    description: { ko: "국가와 제국이 안보를 이유로 사회를 더 강하게 묶습니다.", en: "States use security to bind society more tightly." },
    modifier: { stability: 8, freedom: -18, technology: 4, diversity: -8, inequality: 10 },
    title: { ko: "철의 질서가 오래 지속된 세계", en: "A world where iron order lasts" },
    verdictTail: { ko: "질서는 빨리 세워졌지만 개인의 숨 쉴 공간은 좁아졌습니다.", en: "Order rises quickly, while personal space shrinks." },
  },
  {
    id: "trade",
    label: { ko: "무역과 기술 경쟁이 더 빨라진다", en: "Trade and technology accelerate" },
    description: { ko: "항구, 표준, 금융, 기술자가 새 타임라인의 주인공이 됩니다.", en: "Ports, standards, finance, and engineers become central." },
    modifier: { stability: 2, freedom: 4, technology: 18, diversity: 4, inequality: 12 },
    title: { ko: "기술은 빨라졌지만 격차도 커진 세계", en: "A faster world with wider gaps" },
    verdictTail: { ko: "새 기회가 늘었지만 따라잡지 못한 지역의 비용도 커졌습니다.", en: "Opportunity expands, but lagging regions pay a higher cost." },
  },
  {
    id: "culture",
    label: { ko: "문화권이 완전히 달라진다", en: "Cultural zones shift dramatically" },
    description: { ko: "언어, 교과서, 유행, 종교와 예술의 중심이 다르게 굳어집니다.", en: "Language, textbooks, trends, religion, and art settle differently." },
    modifier: { stability: -2, freedom: 8, technology: 2, diversity: 18, inequality: -2 },
    title: { ko: "익숙한 이름이 낯설어진 세계", en: "A world where familiar names feel foreign" },
    verdictTail: { ko: "지도보다 사람들의 기억과 정체성이 더 크게 바뀌었습니다.", en: "Memory and identity change more than the map itself." },
  },
  {
    id: "survival",
    label: { ko: "작은 나라들이 생존 전략을 바꾼다", en: "Smaller countries rewrite survival strategy" },
    description: { ko: "완충국, 중립도시, 기술동맹이 거대 세력 사이에서 새 규칙을 만듭니다.", en: "Buffer states, neutral cities, and tech alliances write new rules." },
    modifier: { stability: 6, freedom: 6, technology: 8, diversity: 8, inequality: -6 },
    title: { ko: "국경보다 도시와 동맹이 강해진 세계", en: "A world where cities and alliances outweigh borders" },
    verdictTail: { ko: "강대국만의 시대가 아니라 틈새 전략의 시대가 되었습니다.", en: "This becomes an age of niche strategy, not only great powers." },
  },
];

const SCENARIOS: Scenario[] = [
  {
    id: "axis-win",
    title: { ko: "제2차 세계대전에서 추축국이 승리했다면", en: "What if the Axis had won World War II?" },
    premise: { ko: "승리 판타지가 아니라, 폭력적 질서가 만든 장기적 균열과 인간 비용을 따라갑니다.", en: "Not a victory fantasy, but a look at the cracks and human cost of violent order." },
    original: { ko: "실제 역사에서는 연합국의 산업력, 해상 보급, 정보전, 소련 전선의 소모전이 추축국 팽창을 꺾었습니다.", en: "In real history, Allied industry, logistics, intelligence, and attrition broke Axis expansion." },
    divergence: { ko: "1942년, 대서양 보급선이 무너지지 않고 동부전선이 장기 교착에 빠집니다.", en: "In 1942, Atlantic supply does not collapse for the Axis and the Eastern Front freezes into stalemate." },
    marker: { ko: "1942년, 보급선이 무너지지 않았다.", en: "1942: the supply line does not break." },
    warning: { ko: "이 시나리오는 억압·점령·폭력의 결과를 비판적으로 다룹니다.", en: "This scenario treats oppression, occupation, and violence critically." },
    stages: [
      { key: "1년 후", title: { ko: "점령지의 첫 번째 균열", en: "The first cracks in occupied zones" }, cause: { ko: "군사적 승리가 행정 안정으로 바로 이어지지 않습니다.", en: "Military success does not become administrative stability." }, body: { ko: "도시는 조용해 보이지만 밤마다 지하 인쇄물과 암호 방송이 돌기 시작합니다. 사람들은 국경보다 검문소의 위치를 먼저 외웁니다.", en: "Cities look quiet, but underground pamphlets and coded broadcasts spread at night." }, headline: { ko: "망명 방송, 세 번째 비밀 주파수로 이동", en: "Exile broadcast moves to third secret frequency" }, dashboard: { stability: 34, freedom: 18, technology: 42, diversity: 24, inequality: 72 } },
      { key: "10년 후", title: { ko: "감시 산업의 비대화", en: "Surveillance becomes an industry" }, cause: { ko: "저항을 막기 위한 통제가 경제 구조를 바꿉니다.", en: "Control against resistance reshapes the economy." }, body: { ko: "민간 기술보다 신분증, 검열 장비, 군수 물류가 빠르게 발전합니다. 학교의 세계지도는 자주 바뀌지만, 학생들은 빈칸에 그려진 저항의 이름을 더 오래 기억합니다.", en: "Identification systems, censorship tools, and military logistics advance faster than civilian life." }, headline: { ko: "대륙 통행증 갱신 대기, 주요 도시에서 40일 넘겨", en: "Continental pass renewal waits exceed 40 days" }, dashboard: { stability: 42, freedom: 14, technology: 48, diversity: 20, inequality: 80 } },
      { key: "50년 후", title: { ko: "닫힌 질서의 경제 피로", en: "Economic fatigue of a closed order" }, cause: { ko: "강압 체제는 유지 비용을 계속 키웁니다.", en: "Coercive systems keep raising maintenance costs." }, body: { ko: "시장에는 물건보다 허가증이 먼저 필요합니다. 젊은 세대는 공식 역사보다 조부모의 낮은 목소리로 들은 이야기를 더 믿습니다.", en: "Permits matter before goods. Younger generations trust family whispers more than official history." }, headline: { ko: "금지 문학 데이터베이스, 또다시 해외에서 복원", en: "Banned literature archive restored abroad again" }, dashboard: { stability: 36, freedom: 20, technology: 54, diversity: 26, inequality: 84 } },
      { key: "100년 후", title: { ko: "지도는 고정됐지만 사회는 흔들립니다", en: "The map hardens, society shakes" }, cause: { ko: "길어진 억압은 기억을 지우지 못하고 다른 언어로 남깁니다.", en: "Prolonged oppression fails to erase memory." }, body: { ko: "대도시는 거대한 기념물로 채워졌지만, 사람들은 작은 상징을 통해 서로를 확인합니다. 농담 하나가 정치적 암호가 됩니다.", en: "Cities fill with monuments, while tiny symbols become ways to recognize one another." }, headline: { ko: "학생 시위, '기억할 권리'를 새 구호로 채택", en: "Student protests adopt 'the right to remember'" }, dashboard: { stability: 30, freedom: 28, technology: 58, diversity: 34, inequality: 78 } },
      { key: "현재", title: { ko: "평화가 아니라 긴 봉쇄의 현재", en: "A present of long containment, not peace" }, cause: { ko: "폭력으로 만든 질서는 끊임없는 저항을 낳습니다.", en: "Order built by violence creates lasting resistance." }, body: { ko: "뉴스 앱의 국제면은 반란, 망명, 제재, 비밀 재판으로 가득합니다. 사람들은 여행 계획보다 검열 우회법을 먼저 검색합니다.", en: "News feeds are full of rebellion, exile, sanctions, and secret trials." }, headline: { ko: "국제 인권 감시망, 점령지 기록 1억 건 공개", en: "Human-rights network releases 100 million occupation records" }, dashboard: { stability: 28, freedom: 32, technology: 60, diversity: 38, inequality: 76 } },
    ],
    experiential: {
      textbook: { ko: "20세기의 전쟁은 끝난 것이 아니라, 여러 세대에 걸친 통제와 저항의 시대로 이어졌다.", en: "The twentieth-century war did not end; it became generations of control and resistance." },
      daily: { ko: "당신의 하루는 뉴스보다 검열 알림을 먼저 확인하는 것으로 시작합니다. 농담, 음악, 책장에 꽂힌 제목까지 정치적 의미를 가질 수 있습니다.", en: "Your day starts by checking censorship alerts before the news." },
      map: { ko: "유럽과 대서양 주변의 국경선보다 점령 행정구역과 저항 거점이 더 중요해집니다.", en: "Occupation zones and resistance nodes matter more than borders." },
      job: { ko: "암호 기록 복원가, 망명 법률가, 검열 우회 엔지니어", en: "Cipher archivist, exile lawyer, censorship-bypass engineer" },
      vanished: { ko: "자유로운 국제 학술 교류와 대중 여행 문화", en: "Open academic exchange and mass travel culture" },
      culture: { ko: "금지곡을 짧게 인용하는 지하 공연 문화", en: "Underground performances quoting banned songs" },
      korea: { ko: "한반도는 강대국 통제와 저항 네트워크가 맞물린 위험한 완충지대가 됩니다.", en: "Korea becomes a dangerous buffer where control and resistance networks overlap." },
    },
    baseMetrics: { stability: 28, freedom: 32, technology: 60, diversity: 38, inequality: 76 },
    koreaPosition: { ko: "위험한 완충지대", en: "Dangerous buffer zone" },
    life: { ko: "당신은 말을 아끼고, 파일 이름을 숨기고, 믿을 수 있는 사람에게만 진짜 뉴스를 보냅니다.", en: "You speak carefully, hide file names, and share real news only with trusted people." },
    verdict: { ko: "제국은 커졌지만 사람들의 일상은 작아진 세계입니다.", en: "Empires grow, while everyday life becomes smaller." },
  },
  {
    id: "mongol-europe",
    title: { ko: "칭기즈 칸의 후계 세력이 유럽 깊숙이 진격했다면", en: "What if Mongol successor states pushed deeper into Europe?" },
    premise: { ko: "한 번 더 길어진 원정이 유럽의 성곽, 세금, 외교, 무역 감각을 어떻게 앞당겼는지 시뮬레이션합니다.", en: "Simulates how a longer campaign changes walls, taxes, diplomacy, and trade." },
    original: { ko: "실제 역사에서 몽골군은 동유럽을 강타했지만 후계 문제와 보급 한계로 깊은 진격을 멈췄습니다.", en: "In real history, succession politics and logistics halted the Mongol advance." },
    divergence: { ko: "대칸 계승 혼란이 늦어지고 초원 보급망이 중부 유럽까지 안정적으로 이어집니다.", en: "The succession crisis is delayed and steppe logistics hold into Central Europe." },
    marker: { ko: "1241년, 귀환 명령이 늦어졌다.", en: "1241: the order to return is delayed." },
    stages: [
      { key: "1년 후", title: { ko: "도시들의 생존 협상", en: "Cities negotiate survival" }, cause: { ko: "기존 기사 중심 전투가 충격을 받습니다.", en: "Knight-centered warfare is shocked." }, body: { ko: "도시 의회는 조공, 동맹, 성벽 보강 중 무엇을 택할지 밤새 토론합니다. 문장보다 통행증과 말 사료가 더 중요한 외교 문서가 됩니다.", en: "City councils debate tribute, alliance, and walls overnight." }, headline: { ko: "빈 상인조합, 초원 사절단과 통행권 협상", en: "Vienna merchants negotiate passage with steppe envoys" }, dashboard: { stability: 38, freedom: 46, technology: 42, diversity: 52, inequality: 58 } },
      { key: "10년 후", title: { ko: "세금과 성벽의 시대", en: "Age of taxes and walls" }, cause: { ko: "방어 비용이 국가 제도를 밀어 올립니다.", en: "Defense costs push state systems forward." }, body: { ko: "왕들은 세금 장부를 정교하게 만들고, 도시는 성벽 기술자를 최고의 인재로 대우합니다. 외교관은 라틴어만큼 초원식 관습을 배웁니다.", en: "Kings refine tax registers and cities treat wall engineers as elite talent." }, headline: { ko: "중부 유럽 12개 도시, 공동 성벽 기금 창설", en: "Twelve Central European cities form wall fund" }, dashboard: { stability: 50, freedom: 42, technology: 50, diversity: 58, inequality: 60 } },
      { key: "50년 후", title: { ko: "동서 교역의 현실주의", en: "Pragmatism of east-west trade" }, cause: { ko: "공포는 거래 방식까지 바꿉니다.", en: "Fear changes the method of trade." }, body: { ko: "유럽의 상인은 더 멀리 가기 위해 더 빨리 계산합니다. 지도 제작, 보험, 통역 학교가 도시의 새 자랑이 됩니다.", en: "Merchants calculate faster to travel farther. Mapping, insurance, and interpreter schools become civic pride." }, headline: { ko: "대륙 우편로, 흑해에서 라인강까지 연결", en: "Continental postal route links Black Sea to Rhine" }, dashboard: { stability: 58, freedom: 50, technology: 58, diversity: 66, inequality: 56 } },
      { key: "100년 후", title: { ko: "중앙집권이 빨라진 유럽", en: "Europe centralizes earlier" }, cause: { ko: "생존을 위해 왕권과 도시가 서로를 필요로 합니다.", en: "Kings and cities need each other to survive." }, body: { ko: "봉건적 명예보다 병참과 회계가 중요해집니다. 기사는 전설 속 인물로 남고, 실제 권력은 세금과 도로를 관리하는 사람에게 이동합니다.", en: "Logistics and accounting matter more than feudal honor." }, headline: { ko: "왕립 회계학교, 기사학교 입학생 수 추월", en: "Royal accounting schools surpass knight academies" }, dashboard: { stability: 64, freedom: 54, technology: 62, diversity: 62, inequality: 54 } },
      { key: "현재", title: { ko: "성벽보다 네트워크가 강한 유럽", en: "Networks outgrow walls" }, cause: { ko: "초기 충격이 행정과 무역 표준을 바꿨습니다.", en: "The early shock changed administration and trade standards." }, body: { ko: "현재의 유럽은 성곽 유산보다 교역 규약을 더 자랑합니다. 학교에서는 전쟁보다 통행권 협정의 역사를 길게 배웁니다.", en: "Modern Europe boasts trade protocols more than castle heritage." }, headline: { ko: "유럽 무역권, 세 번째 대륙 철도 협정 체결", en: "European trade zone signs third continental rail treaty" }, dashboard: { stability: 66, freedom: 58, technology: 66, diversity: 64, inequality: 52 } },
    ],
    experiential: {
      textbook: { ko: "13세기의 충격은 유럽을 무너뜨리기보다 세금과 외교의 속도를 바꾸었다.", en: "The thirteenth-century shock changed Europe's speed of taxation and diplomacy." },
      daily: { ko: "당신은 여행 앱에서 국경보다 도시동맹 통행권을 먼저 확인합니다. 학교에서는 기사 서사보다 물류 혁신을 더 오래 배웁니다.", en: "You check city-league travel rights before borders." },
      map: { ko: "중부 유럽의 성곽 도시와 흑해-라인강 교역축이 가장 달라집니다.", en: "Fortified Central Europe and the Black Sea-Rhine trade axis change most." },
      job: { ko: "통행권 설계사, 도시동맹 회계사, 문화권 협상가", en: "Passage-right designer, city-league accountant, cultural negotiator" },
      vanished: { ko: "기사 한 명이 전장을 바꾼다는 오래된 환상", en: "The old fantasy that one knight changes the battlefield" },
      culture: { ko: "초원식 문양과 유럽 길드 상징이 섞인 상업 축제", en: "Trade festivals mixing steppe patterns and guild symbols" },
      korea: { ko: "고려와 유라시아 연결망의 기억이 더 강한 외교 자산으로 남습니다.", en: "Korea's memory of Eurasian links becomes a stronger diplomatic asset." },
    },
    baseMetrics: { stability: 66, freedom: 58, technology: 66, diversity: 64, inequality: 52 },
    koreaPosition: { ko: "유라시아 연결망의 동쪽 거점", en: "Eastern node of a Eurasian network" },
    life: { ko: "당신은 여러 문화권의 날짜와 통행 규칙을 자연스럽게 확인하며 살아갑니다.", en: "You naturally check multiple cultural calendars and travel rules." },
    verdict: { ko: "공포가 남긴 것은 폐허만이 아니라 더 빠른 제도와 교역 감각이었습니다.", en: "Fear leaves not only ruins, but faster institutions and trade instincts." },
  },
  {
    id: "rome-lasts",
    title: { ko: "로마 제국이 무너지지 않았다면", en: "What if the Roman Empire had never collapsed?" },
    premise: { ko: "영원한 황금기가 아니라, 거대한 관료제가 오래 살아남으며 만든 느린 현대화를 봅니다.", en: "Not eternal golden age, but slow modernization under a surviving bureaucracy." },
    original: { ko: "서로마는 재정 압박, 군사 의존, 정치 불안, 이주 압력 속에서 5세기에 붕괴했습니다.", en: "The Western Empire collapsed under fiscal, military, political, and migration pressure." },
    divergence: { ko: "세금 개혁과 지방 자치 타협이 성공하고 군 지휘권 승계가 안정화됩니다.", en: "Tax reform and provincial compromise succeed; military succession stabilizes." },
    marker: { ko: "로마의 권력 승계가 안정화되었다.", en: "Roman succession stabilizes." },
    stages: [
      { key: "1년 후", title: { ko: "붕괴 대신 타협", en: "Compromise instead of collapse" }, cause: { ko: "중앙정부가 지방 귀족을 완전히 누르지 않고 제도 안으로 끌어들입니다.", en: "The center brings provincial elites into the system." }, body: { ko: "로마법은 끊기지 않고 이어집니다. 사람들은 황제가 바뀌어도 세금 고지서 양식이 그대로라는 사실에서 이상한 안정감을 느낍니다.", en: "Roman law continues. People find odd comfort in unchanged tax forms." }, headline: { ko: "갈리아 지방회의, 새 자치세 협정 승인", en: "Gallic council approves new autonomous tax pact" }, dashboard: { stability: 62, freedom: 42, technology: 44, diversity: 46, inequality: 62 } },
      { key: "10년 후", title: { ko: "도로와 장부가 살아남습니다", en: "Roads and registers survive" }, cause: { ko: "행정망이 유지되며 상업의 단절이 줄어듭니다.", en: "Administrative continuity reduces commercial rupture." }, body: { ko: "상인은 왕국별 관문 대신 제국 규격의 도량형을 사용합니다. 대신 새로운 생각은 허가와 심사를 통과해야 합니다.", en: "Merchants use imperial standards instead of kingdom-by-kingdom rules." }, headline: { ko: "서방 제국 도로세, 항만 보수 재원으로 전환", en: "Western road tax redirected to port maintenance" }, dashboard: { stability: 70, freedom: 40, technology: 50, diversity: 44, inequality: 64 } },
      { key: "50년 후", title: { ko: "중세가 다른 모양이 됩니다", en: "The Middle Ages take another shape" }, cause: { ko: "분권의 폭발이 약해지고 제국 내부 개혁 정치가 커집니다.", en: "Fragmentation weakens and reform politics grow inside empire." }, body: { ko: "영주의 성보다 법정과 회계청이 지역의 중심이 됩니다. 라틴어는 오래 버티고, 지역 언어는 더 천천히 자기 이름을 얻습니다.", en: "Courts and audit offices matter more than castles." }, headline: { ko: "제국 시민권 개정안, 지방어 교육 조항 포함", en: "Citizenship reform includes local-language clauses" }, dashboard: { stability: 76, freedom: 44, technology: 56, diversity: 48, inequality: 60 } },
      { key: "100년 후", title: { ko: "안정이 혁신을 늦춥니다", en: "Stability slows experiments" }, cause: { ko: "붕괴가 없으니 급진적 새 질서도 덜 등장합니다.", en: "No collapse also means fewer radical new orders." }, body: { ko: "사람들은 안전한 도로를 좋아하지만, 젊은 기술자들은 '허가받은 미래'에 답답함을 느낍니다. 제국은 오래 버티는 대신 느리게 변합니다.", en: "Safe roads are loved, but engineers feel trapped in a permitted future." }, headline: { ko: "기계조합, 제국 특허 심사 기간 단축 요구", en: "Machine guild demands shorter imperial patent reviews" }, dashboard: { stability: 80, freedom: 46, technology: 60, diversity: 50, inequality: 58 } },
      { key: "현재", title: { ko: "제국은 살아남고 개인은 작아진 현재", en: "The empire survives; individuals feel smaller" }, cause: { ko: "제도 연속성은 세계를 질서 있게 만들지만 답답함도 남깁니다.", en: "Continuity creates order and frustration." }, body: { ko: "당신의 신분증에는 도시보다 제국 행정권역이 먼저 표시됩니다. 뉴스는 선거보다 개혁 칙령과 지방 협상으로 가득합니다.", en: "Your ID shows imperial district before city. News is full of reform decrees and provincial negotiations." }, headline: { ko: "제국 원로원, 32번째 행정권역 조정안 표결", en: "Imperial senate votes on 32nd district reform" }, dashboard: { stability: 82, freedom: 48, technology: 64, diversity: 52, inequality: 56 } },
    ],
    experiential: {
      textbook: { ko: "로마는 끝나지 않았고, 유럽의 갈등은 제국 밖 전쟁보다 제국 안 개혁으로 이동했다.", en: "Rome did not end; European conflict moved into imperial reform." },
      daily: { ko: "당신은 여전히 라틴어 약어가 붙은 공문을 받습니다. 편리한 표준은 많지만, 무엇이든 바꾸려면 절차가 깁니다.", en: "You still receive documents with Latin abbreviations; standards are convenient, procedures long." },
      map: { ko: "서유럽의 국경 대신 거대한 행정권역과 도로망이 지도 중심이 됩니다.", en: "Huge administrative districts and road networks replace many borders." },
      job: { ko: "제국 데이터 서기관, 도로망 감사관, 시민권 조정 변호사", en: "Imperial data clerk, road auditor, citizenship lawyer" },
      vanished: { ko: "작은 왕국들의 경쟁에서 나온 빠른 실험 일부", en: "Some fast experiments born from small-state rivalry" },
      culture: { ko: "라틴식 공휴일과 지역 축제가 겹친 장기 달력 문화", en: "Long calendar culture mixing Latin holidays and local festivals" },
      korea: { ko: "한국은 유럽식 제국 표준과 동아시아 질서 사이에서 법·무역 번역 능력을 키웁니다.", en: "Korea grows as a translator between imperial European standards and East Asian order." },
    },
    baseMetrics: { stability: 82, freedom: 48, technology: 64, diversity: 52, inequality: 56 },
    koreaPosition: { ko: "표준 번역과 무역 조정의 중견국", en: "Middle power of standards translation" },
    life: { ko: "당신은 안정적인 제도 속에서 살지만, 작은 규칙 하나를 바꾸는 데 긴 청원 절차를 거칩니다.", en: "You live inside stable institutions but need long petitions to change small rules." },
    verdict: { ko: "붕괴가 사라진 대신 변화의 속도도 느려진 세계입니다.", en: "Collapse disappears, and so does much of the speed of change." },
  },
  {
    id: "korea-unifies",
    title: { ko: "한반도가 더 일찍 통일 정부를 세웠다면", en: "What if Korea had formed a unified government earlier?" },
    premise: { ko: "분단의 상처를 가볍게 만들지 않고, 조기 통합이 정치·가족·산업·외교를 어떻게 바꿨는지 봅니다.", en: "A careful simulation of earlier unity across politics, families, industry, and diplomacy." },
    original: { ko: "실제 역사에서 한반도는 해방 직후 국제 질서와 이념 대립 속에서 분단과 전쟁을 겪었습니다.", en: "In real history, Korea endured division and war amid post-liberation rivalry." },
    divergence: { ko: "1940년대 후반, 국제 감시 아래 남북 정치 세력이 불완전한 공동 과도정부를 구성합니다.", en: "In the late 1940s, northern and southern forces form an imperfect joint provisional government." },
    marker: { ko: "1948년, 공동 과도정부가 먼저 출범했다.", en: "1948: a joint provisional government launches first." },
    stages: [
      { key: "1년 후", title: { ko: "전쟁 대신 헌정 위기", en: "Constitutional crisis instead of war" }, cause: { ko: "갈등은 사라지지 않고 제도 안으로 밀려 들어옵니다.", en: "Conflict moves into institutions rather than disappearing." }, body: { ko: "거리에는 격렬한 시위가 있고 국회는 밤새 열립니다. 그래도 가족들은 편지를 검문선 너머로 보내지 않아도 됩니다.", en: "Streets protest and parliament runs overnight, but families do not send letters across a border." }, headline: { ko: "공동정부, 토지개혁 표결 앞두고 밤샘 협상", en: "Joint government negotiates land reform overnight" }, dashboard: { stability: 42, freedom: 58, technology: 40, diversity: 64, inequality: 60 } },
      { key: "10년 후", title: { ko: "산업망과 항만이 연결됩니다", en: "Industry and ports connect" }, cause: { ko: "군사비 일부가 전력망·철도·교육으로 이동합니다.", en: "Some military spending shifts to power grids, rail, and education." }, body: { ko: "북부의 공업 기반과 남부의 항만 상업망이 어색하지만 강하게 연결됩니다. 취업 공고에는 평양, 부산, 원산, 인천이 같은 표에 등장합니다.", en: "Northern industry and southern ports connect awkwardly but powerfully." }, headline: { ko: "한반도 종단 전력망 1단계 개통", en: "First phase of peninsula power grid opens" }, dashboard: { stability: 54, freedom: 62, technology: 54, diversity: 68, inequality: 54 } },
      { key: "50년 후", title: { ko: "상처는 작아졌지만 논쟁은 오래갑니다", en: "Fewer wounds, longer arguments" }, cause: { ko: "다른 체제 경험이 의회와 지역정치에 남습니다.", en: "Different political experiences remain in parliament and local politics." }, body: { ko: "학교 수학여행은 금강산과 제주를 모두 갑니다. 가족사는 덜 찢어졌지만, 선거철마다 과거 청산과 지역 균형이 가장 뜨거운 쟁점이 됩니다.", en: "School trips include both Geumgangsan and Jeju; elections focus on reconciliation and balance." }, headline: { ko: "동서 지역균형 예산안, 사상 최대 토론 시간 기록", en: "Regional balance budget breaks debate record" }, dashboard: { stability: 66, freedom: 68, technology: 68, diversity: 74, inequality: 48 } },
      { key: "100년 후", title: { ko: "완충지대에서 협상국가로", en: "From buffer to negotiation state" }, cause: { ko: "강대국 사이의 압박은 남지만 선택지가 넓어집니다.", en: "Great-power pressure remains, but choices widen." }, body: { ko: "한국은 군사분계선 대신 철도 회랑과 에너지 중재 회의로 뉴스에 등장합니다. 외교관은 위기관리와 산업 표준을 동시에 다룹니다.", en: "Korea appears in news through rail corridors and energy mediation instead of a military line." }, headline: { ko: "서울-신의주-대륙 철도, 새 물류 표준 채택", en: "Seoul-Sinuiju continental rail adopts new logistics standard" }, dashboard: { stability: 72, freedom: 72, technology: 76, diversity: 76, inequality: 44 } },
      { key: "현재", title: { ko: "상처는 적지만 숙제가 많은 현재", en: "A present with fewer wounds and many assignments" }, cause: { ko: "통합은 끝이 아니라 오래 가는 조율 능력입니다.", en: "Unity is not an end; it is long-term coordination." }, body: { ko: "당신의 가족 앨범에는 끊어진 세대가 적습니다. 대신 뉴스는 지역 균형, 언어 차이, 통합 복지 같은 현실적 숙제로 가득합니다.", en: "Your family album has fewer broken generations, while news is full of balance, dialect, and welfare debates." }, headline: { ko: "통합 80주년 여론조사, '가장 큰 성취는 가족 왕래'", en: "80th unity poll: family travel named greatest achievement" }, dashboard: { stability: 76, freedom: 74, technology: 78, diversity: 78, inequality: 42 } },
    ],
    experiential: {
      textbook: { ko: "조기 통합은 갈등을 없애지 않았지만, 전쟁의 상처를 정치적 협상의 숙제로 바꾸었다.", en: "Early unity did not remove conflict, but changed war wounds into political assignments." },
      daily: { ko: "당신은 부산 친구와 평양 친구를 같은 단톡방에 두고, 명절에는 어느 노선을 타야 덜 막힐지 고민합니다.", en: "You have friends in Busan and Pyongyang in one chat and choose holiday rail routes." },
      map: { ko: "휴전선 대신 철도·전력·산업 회랑이 한반도 지도의 중심선이 됩니다.", en: "Rail, power, and industrial corridors replace the ceasefire line." },
      job: { ko: "지역통합 기획자, 대륙철도 물류 매니저, 방언 콘텐츠 제작자", en: "Regional integration planner, continental rail logistics manager, dialect-content producer" },
      vanished: { ko: "오랜 이산가족의 규모와 군사분계선 중심의 일상", en: "The scale of separated families and border-centered daily life" },
      culture: { ko: "북부 록과 남부 댄스가 섞인 통합 대중음악", en: "Popular music mixing northern rock and southern dance" },
      korea: { ko: "한국은 분단의 상징보다 조율 능력이 강한 중견 협상국으로 보입니다.", en: "Korea is seen as a negotiating middle power rather than a symbol of division." },
    },
    baseMetrics: { stability: 76, freedom: 74, technology: 78, diversity: 78, inequality: 42 },
    koreaPosition: { ko: "동북아 협상과 물류의 중심국", en: "Northeast Asian negotiation and logistics hub" },
    life: { ko: "당신은 더 넓은 이동권을 누리지만, 통합 사회의 복잡한 정치 토론을 매일 마주합니다.", en: "You enjoy wider mobility while facing complex integration politics daily." },
    verdict: { ko: "눈물은 줄었지만 조율의 난이도는 높아진 세계입니다.", en: "A world with fewer tears and harder coordination." },
  },
  {
    id: "east-asia-industrial",
    title: { ko: "산업혁명이 동아시아에서 먼저 시작됐다면", en: "What if the Industrial Revolution began in East Asia first?" },
    premise: { ko: "증기기관 하나가 아니라 항구, 금융, 기술자, 제도 변화가 함께 움직인 세계입니다.", en: "Not one steam engine, but ports, finance, engineers, and institutions moving together." },
    original: { ko: "실제 산업혁명은 영국의 석탄, 임금 구조, 금융, 무역, 특허 문화가 맞물리며 시작됐습니다.", en: "In real history, Britain's coal, wages, finance, trade, and patent culture converged." },
    divergence: { ko: "동아시아 해상 제한이 완화되고 조선·일본·중국 상인과 기술자가 증기·방직·인쇄 자동화를 먼저 연결합니다.", en: "Maritime limits loosen and East Asian merchants and engineers connect steam, textiles, and printing first." },
    marker: { ko: "동아시아에서 증기기관이 먼저 상용화되었다.", en: "Steam engines commercialize in East Asia first." },
    stages: [
      { key: "1년 후", title: { ko: "항구 도시가 먼저 뜁니다", en: "Port cities move first" }, cause: { ko: "기술은 시장과 항구를 만나야 속도가 납니다.", en: "Technology accelerates when it meets markets and ports." }, body: { ko: "부두에는 새 기계 소리가 퍼지고, 기술자는 장인과 상인 사이의 인기 직업이 됩니다. 관료들은 이 변화를 금지할지 제도화할지 고민합니다.", en: "Machine sounds spread across docks; engineers become desirable between artisans and merchants." }, headline: { ko: "동아시아 항구연합, 증기선 안전 규격 첫 발표", en: "East Asian port league releases first steamship safety standard" }, dashboard: { stability: 54, freedom: 56, technology: 70, diversity: 62, inequality: 54 } },
      { key: "10년 후", title: { ko: "기술 시험과 상업 학교", en: "Technical exams and commercial schools" }, cause: { ko: "새 산업은 새 출세 경로를 만듭니다.", en: "New industry creates new paths to success." }, body: { ko: "과거시험 옆에 기계·회계·항해 시험이 생깁니다. 사농공상의 오래된 위계는 완전히 사라지진 않지만 매일 흔들립니다.", en: "Machine, accounting, and navigation exams appear beside classical tracks." }, headline: { ko: "한성 기술학교 경쟁률, 성균관 일부 과정 추월", en: "Hanseong technical school outcompetes some classical tracks" }, dashboard: { stability: 60, freedom: 62, technology: 82, diversity: 70, inequality: 58 } },
      { key: "50년 후", title: { ko: "세계 표준의 방향이 바뀝니다", en: "Global standards point east" }, cause: { ko: "먼저 만든 규격이 무역의 언어가 됩니다.", en: "Early standards become the language of trade." }, body: { ko: "유럽 상인은 동아시아 항구의 규칙을 배웁니다. 보험, 선박금융, 기계 부품 이름이 한자 문화권 용어를 따라갑니다.", en: "European merchants learn East Asian port rules; finance and machine parts follow East Asian terms." }, headline: { ko: "동아시아 기술 표준, 전 세계 스마트 기기의 기본 규격이 되다", en: "East Asian technical standard becomes default for global smart devices" }, dashboard: { stability: 66, freedom: 66, technology: 90, diversity: 76, inequality: 62 } },
      { key: "100년 후", title: { ko: "도시가 신분보다 강해집니다", en: "Cities grow stronger than old status" }, cause: { ko: "산업 도시는 사람의 정체성과 계층 이동을 바꿉니다.", en: "Industrial cities change identity and mobility." }, body: { ko: "가문보다 어느 항구 학교를 나왔는지가 더 중요해집니다. 동시에 공장 노동과 도시 빈곤이라는 새 문제가 커집니다.", en: "Port schools matter more than lineage, while factory labor and urban poverty grow." }, headline: { ko: "동아시아 5대 항구, 노동시간 협약 공동 채택", en: "Five East Asian ports adopt joint labor-hour pact" }, dashboard: { stability: 68, freedom: 70, technology: 94, diversity: 78, inequality: 66 } },
      { key: "현재", title: { ko: "동아시아가 산업 표준을 쥔 현재", en: "A present where East Asia holds industrial standards" }, cause: { ko: "근대화가 수입 충격이 아니라 수출된 규칙이 됩니다.", en: "Modernity becomes an exported rule, not an imported shock." }, body: { ko: "당신의 스마트 기기 기본 규격과 금융 앱 용어는 동아시아 해상도시에서 시작됐습니다. 세계사는 '개항당한 동아시아'보다 '규칙을 쓴 동아시아'를 먼저 배웁니다.", en: "Your device standards and finance terms began in East Asian port cities." }, headline: { ko: "부산-상하이-나가사키 표준회의, 차세대 에너지 규격 발표", en: "Busan-Shanghai-Nagasaki standards council announces next energy protocol" }, dashboard: { stability: 70, freedom: 72, technology: 96, diversity: 82, inequality: 64 } },
    ],
    experiential: {
      textbook: { ko: "근대 세계의 표준은 대서양이 아니라 동아시아 항구의 기계와 장부에서 먼저 정리되었다.", en: "Modern standards formed first in the machines and ledgers of East Asian ports." },
      daily: { ko: "당신은 세계 공용 기술 용어에서 익숙한 한자어와 한국어식 약어를 자주 봅니다. 해외 직장인은 동아시아 표준 자격증을 따려고 공부합니다.", en: "You often see familiar East Asian terms in global tech language." },
      map: { ko: "부산, 상하이, 나가사키, 광저우 같은 항구 도시가 세계 경제 지도의 굵은 점이 됩니다.", en: "Busan, Shanghai, Nagasaki, and Guangzhou become bold dots on the world economy map." },
      job: { ko: "표준 외교관, 항구도시 데이터 설계자, 증기문화 큐레이터", en: "Standards diplomat, port-city data architect, steam-culture curator" },
      vanished: { ko: "근대는 서구에서만 온다는 오래된 서사", en: "The old story that modernity only came from the West" },
      culture: { ko: "공장 장인 정신과 선비식 기록 문화가 섞인 기술 축제", en: "Tech festivals mixing craft discipline and scholarly record culture" },
      korea: { ko: "한국은 동아시아 표준권의 핵심 항구·기술 국가로 더 일찍 부상합니다.", en: "Korea rises earlier as a key port and technology state in an East Asian standards sphere." },
    },
    baseMetrics: { stability: 70, freedom: 72, technology: 96, diversity: 82, inequality: 64 },
    koreaPosition: { ko: "동아시아 산업 표준권의 핵심 노드", en: "Core node of East Asian industrial standards" },
    life: { ko: "당신은 빠른 기술 발전의 편리함을 누리지만, 도시 경쟁과 기술 자격 압박도 크게 느낍니다.", en: "You enjoy fast technology, but feel pressure from urban competition and credentials." },
    verdict: { ko: "기술의 중심이 동쪽 항구에서 먼저 켜진 세계입니다.", en: "A world where the light of technology turns on first in eastern ports." },
  },
];

function pick(text: LocalText, locale: string) {
  return locale === "en" ? text.en : text.ko;
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function metricTone(key: MetricKey, value: number) {
  if (key === "inequality") return value > 65 ? RED : value > 45 ? ACCENT : BLUE;
  return value > 70 ? BLUE : value > 45 ? ACCENT : RED;
}

export default function HistoryIfPage() {
  const { locale, t } = useLocale();
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id);
  const [focusId, setFocusId] = useState<FocusKey>("survival");
  const [step, setStep] = useState<"select" | "divergence" | "simulate" | "result">("select");
  const [stageIndex, setStageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => SCENARIOS.find((scenario) => scenario.id === selectedId) ?? SCENARIOS[0],
    [selectedId],
  );
  const focus = useMemo(() => FOCUSES.find((item) => item.id === focusId) ?? FOCUSES[0], [focusId]);
  const currentStage = selected.stages[stageIndex];

  const metrics = useMemo(() => {
    const stageDash = step === "simulate" ? currentStage.dashboard : step === "result" ? selected.stages[selected.stages.length - 1].dashboard : {};
    const merged = { ...selected.baseMetrics, ...stageDash };
    return (Object.keys(METRIC_LABEL) as MetricKey[]).reduce(
      (acc, key) => {
        acc[key] = clamp((merged[key] ?? selected.baseMetrics[key]) + (focus.modifier[key] ?? 0));
        return acc;
      },
      {} as Record<MetricKey, number>,
    );
  }, [currentStage, focus, selected, step]);

  const resultTitle = pick(focus.title, locale);
  const progress = step === "select" ? 0 : step === "divergence" ? 12 : step === "result" ? 100 : 24 + ((stageIndex + 1) / selected.stages.length) * 62;

  const resetScenario = (id: string) => {
    setSelectedId(id);
    setFocusId("survival");
    setStep("divergence");
    setStageIndex(0);
  };

  const next = () => {
    if (step === "select") {
      setStep("divergence");
      return;
    }
    if (step === "divergence") {
      setStep("simulate");
      setStageIndex(0);
      return;
    }
    if (step === "simulate" && stageIndex < selected.stages.length - 1) {
      setStageIndex((value) => value + 1);
      return;
    }
    setStep("result");
  };

  const jumpToPresent = () => {
    setStep("simulate");
    setStageIndex(selected.stages.length - 1);
  };

  const share = async () => {
    const text = t(
      `내가 시뮬레이션한 IF 역사: '${resultTitle}'\n이 세계에서 한국은 ${selected.koreaPosition.ko}, 나는 ${selected.life.ko}\n역사 하나 바꿨더니 현재가 이렇게 됨… nolza.fun/games/history-if`,
      `My alternate-history simulation: '${resultTitle}'\nKorea is ${selected.koreaPosition.en}; my life: ${selected.life.en}\nOne historical change rewrote the present… nolza.fun/games/history-if`,
    );
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main
      className="page-in"
      style={{
        minHeight: "100svh",
        background: BG,
        color: PAPER,
        fontFamily: "var(--font-noto-serif-kr), serif",
        overflowX: "clip",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">←</Link>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "84px 20px 88px" }}>
        <header style={{ marginBottom: 24 }}>
          <p style={eyebrowStyle}>{t("대체 타임라인 시뮬레이터", "Alternate timeline simulator")}</p>
          <h1 style={{ margin: "8px 0 0", maxWidth: 760, fontSize: "clamp(40px, 9vw, 72px)", lineHeight: 1.02, letterSpacing: 0, fontWeight: 900 }}>
            {t("역사에 IF가 있다면", "If History Had an If")}
          </h1>
          <p style={{ margin: "16px 0 0", maxWidth: 780, color: "rgba(244,236,216,0.72)", fontSize: "clamp(16px, 4vw, 20px)", lineHeight: 1.7, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
            {t(
              "한 사건을 바꾸고, 시간이 흐르며 정치·경제·문화·기술·일상이 어떻게 흔들리는지 단계별로 따라가 보세요.",
              "Change one event and step through how politics, economy, culture, technology, and daily life ripple forward.",
            )}
          </p>
          <p style={{ margin: "14px 0 0", maxWidth: 820, color: "rgba(244,236,216,0.62)", fontSize: 13, lineHeight: 1.65, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
            {t(
              "이 콘텐츠는 역사적 상상 실험이며, 특정 사상·전쟁·폭력·제국주의를 미화하지 않습니다.",
              "This is a historical thought experiment and does not glorify any ideology, war, violence, or imperialism.",
            )}
          </p>
        </header>

  <TimelineProgress progress={progress} label={step === "result" ? t("현재 도착", "Arrived at present") : currentStage ? currentStage.key : t("분기 선택", "Choose branch")} />

        <section className="history-if-shell">
          <aside className="scenario-rail">
            <div style={{ display: "grid", gap: 10 }}>
              {SCENARIOS.map((scenario, index) => {
                const active = scenario.id === selected.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => resetScenario(scenario.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: active ? `1px solid ${GOLD}` : "1px solid rgba(244,236,216,0.14)",
                      background: active ? "rgba(214,173,114,0.16)" : "rgba(244,236,216,0.05)",
                      color: PAPER,
                      padding: "15px 15px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontFamily: "var(--font-noto-sans-kr), sans-serif",
                      minHeight: 104,
                    }}
                  >
                    <span style={{ display: "block", color: GOLD, fontSize: 13, fontWeight: 900 }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong style={{ display: "block", marginTop: 7, fontSize: 17, lineHeight: 1.35 }}>
                      {pick(scenario.title, locale)}
                    </strong>
                    <span style={{ display: "block", marginTop: 7, color: "rgba(244,236,216,0.62)", fontSize: 13, lineHeight: 1.5 }}>
                      {pick(scenario.premise, locale)}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <article
            style={{
              minWidth: 0,
              background: PAPER,
              color: INK,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
              overflow: "hidden",
              boxShadow: "0 26px 90px rgba(0,0,0,0.28)",
            }}
          >
            {step === "select" && (
              <StartPanel selected={selected} locale={locale} t={t} onStart={next} />
            )}
            {step === "divergence" && (
              <DivergencePanel
                selected={selected}
                locale={locale}
                t={t}
                focusId={focusId}
                setFocusId={setFocusId}
                onNext={next}
                onJump={jumpToPresent}
              />
            )}
            {step === "simulate" && (
              <SimulationPanel
                scenario={selected}
                stage={currentStage}
                stageIndex={stageIndex}
                metrics={metrics}
                locale={locale}
                t={t}
                onNext={next}
                onJump={jumpToPresent}
                onReset={() => setStep("divergence")}
              />
            )}
            {step === "result" && (
              <ResultPanel
                scenario={selected}
                focus={focus}
                metrics={metrics}
                locale={locale}
                t={t}
                copied={copied}
                onShare={share}
                onRestart={() => {
                  setStep("divergence");
                  setStageIndex(0);
                }}
              />
            )}
          </article>
        </section>
        <AdBottom />
      </div>
      <AdMobileSticky />
      <style jsx>{`
        .history-if-shell {
          display: grid;
          grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
          gap: 20px;
          align-items: start;
        }
        .scenario-rail {
          position: sticky;
          top: 88px;
        }
        @media (max-width: 900px) {
          .history-if-shell {
            grid-template-columns: 1fr;
          }
          .scenario-rail {
            position: static;
          }
        }
      `}</style>
    </main>
  );
}

function StartPanel({
  selected,
  locale,
  t,
  onStart,
}: {
  selected: Scenario;
  locale: string;
  t: (ko: string, en: string) => string;
  onStart: () => void;
}) {
  return (
    <div style={{ padding: "clamp(26px, 5vw, 46px)" }}>
      <p style={{ ...paperEyebrowStyle, color: ACCENT }}>{t("시나리오 선택됨", "Scenario selected")}</p>
      <h2 style={mainTitleStyle}>{pick(selected.title, locale)}</h2>
      <p style={leadStyle}>{pick(selected.premise, locale)}</p>
      <div style={simNoticeStyle}>
        <strong>{t("시뮬레이션 방식", "How it works")}</strong>
        <span>
          {t(
            "실제 흐름과 달라진 한 순간을 확인한 뒤, 1년 후부터 현재까지 변화가 순서대로 열립니다.",
            "Check the original path and one changed moment, then reveal the timeline from year 1 to the present.",
          )}
        </span>
      </div>
      <button type="button" onClick={onStart} style={primaryButtonStyle}>
        {t("역사가 갈라진 순간 보기", "Open the divergence")}
      </button>
    </div>
  );
}

function DivergencePanel({
  selected,
  locale,
  t,
  focusId,
  setFocusId,
  onNext,
  onJump,
}: {
  selected: Scenario;
  locale: string;
  t: (ko: string, en: string) => string;
  focusId: FocusKey;
  setFocusId: (id: FocusKey) => void;
  onNext: () => void;
  onJump: () => void;
}) {
  return (
    <div>
      <div style={{ padding: "clamp(24px, 5vw, 42px)", borderBottom: `1px solid ${LINE}` }}>
        <p style={paperEyebrowStyle}>{t("역사가 갈라진 순간", "The moment history splits")}</p>
        <h2 style={mainTitleStyle}>{pick(selected.marker, locale)}</h2>
        {selected.warning && <p style={warningStyle}>{pick(selected.warning, locale)}</p>}
      </div>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${LINE}` }}>
        <InfoCard label={t("원래 흐름", "Original path")} body={pick(selected.original, locale)} />
        <InfoCard label={t("바뀐 사건", "Changed event")} body={pick(selected.divergence, locale)} strong />
      </div>
      <div style={{ padding: "clamp(22px, 5vw, 38px)" }}>
        <h3 style={{ margin: 0, fontSize: "clamp(22px, 5vw, 30px)", lineHeight: 1.25 }}>
          {t("이 세계는 어떤 방향으로 굳어질까요?", "Which direction does this world harden into?")}
        </h3>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {FOCUSES.map((focus) => {
            const active = focus.id === focusId;
            return (
              <button
                key={focus.id}
                type="button"
                onClick={() => setFocusId(focus.id)}
                style={{
                  minHeight: 116,
                  textAlign: "left",
                  border: active ? `2px solid ${ACCENT}` : `1px solid ${LINE}`,
                  background: active ? "rgba(164,95,42,0.12)" : "rgba(255,255,255,0.36)",
                  color: INK,
                  borderRadius: 8,
                  padding: 14,
                  cursor: "pointer",
                  fontFamily: "var(--font-noto-sans-kr), sans-serif",
                }}
              >
                <strong style={{ display: "block", fontSize: 15, lineHeight: 1.4 }}>{pick(focus.label, locale)}</strong>
                <span style={{ display: "block", marginTop: 8, color: MUTED, fontSize: 13, lineHeight: 1.55 }}>
                  {pick(focus.description, locale)}
                </span>
              </button>
            );
          })}
        </div>
        <div style={buttonRowStyle}>
          <button type="button" onClick={onNext} style={primaryButtonStyle}>
            {t("1년 후로 이동", "Move to year 1")}
          </button>
          <button type="button" onClick={onJump} style={secondaryButtonStyle}>
            {t("현재까지 시뮬레이션", "Simulate to present")}
          </button>
        </div>
      </div>
      <ResponsiveStyle />
    </div>
  );
}

function SimulationPanel({
  scenario,
  stage,
  stageIndex,
  metrics,
  locale,
  t,
  onNext,
  onJump,
  onReset,
}: {
  scenario: Scenario;
  stage: Stage;
  stageIndex: number;
  metrics: Record<MetricKey, number>;
  locale: string;
  t: (ko: string, en: string) => string;
  onNext: () => void;
  onJump: () => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div style={{ padding: "clamp(22px, 5vw, 38px)", borderBottom: `1px solid ${LINE}` }}>
        <p style={paperEyebrowStyle}>{t("타임라인 시뮬레이션", "Timeline simulation")}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {scenario.stages.map((item, index) => (
            <span
              key={item.key}
              style={{
                display: "inline-flex",
                minHeight: 30,
                alignItems: "center",
                borderRadius: 999,
                padding: "0 11px",
                background: index === stageIndex ? INK : "rgba(36,26,20,0.08)",
                color: index === stageIndex ? PAPER : MUTED,
                fontSize: 13,
                fontWeight: 900,
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
              }}
            >
              {stage.key}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: "clamp(24px, 5vw, 42px)" }}>
        <div className="stage-card">
          <div style={{ color: ACCENT, fontSize: 14, fontWeight: 900, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
            {stage.key}
          </div>
          <h2 style={{ margin: "10px 0 0", fontSize: "clamp(28px, 7vw, 48px)", lineHeight: 1.1 }}>{pick(stage.title, locale)}</h2>
          <p style={{ ...leadStyle, marginTop: 14 }}>{pick(stage.cause, locale)}</p>
          <p style={{ margin: "16px 0 0", color: INK, fontSize: "clamp(16px, 4vw, 18px)", lineHeight: 1.85, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
            {pick(stage.body, locale)}
          </p>
          <div style={{ marginTop: 18, borderLeft: `4px solid ${ACCENT}`, padding: "12px 14px", background: "rgba(164,95,42,0.09)" }}>
            <strong style={{ display: "block", color: ACCENT, fontSize: 13, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
              {t("이 세계의 뉴스 헤드라인", "News headline in this world")}
            </strong>
            <span style={{ display: "block", marginTop: 5, fontSize: 18, lineHeight: 1.5, fontWeight: 900 }}>
              {pick(stage.headline, locale)}
            </span>
          </div>
        </div>
        <Dashboard metrics={metrics} locale={locale} t={t} />
        <div style={buttonRowStyle}>
          <button type="button" onClick={onNext} style={primaryButtonStyle}>
            {stageIndex >= scenario.stages.length - 1 ? t("당신이 도착한 타임라인 보기", "See the final timeline") : t("다음 변화 보기", "Reveal next change")}
          </button>
          <button type="button" onClick={onJump} style={secondaryButtonStyle}>
            {t("현재까지 이동", "Jump to present")}
          </button>
          <button type="button" onClick={onReset} style={secondaryButtonStyle}>
            {t("다른 분기 선택", "Choose another branch")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  scenario,
  focus,
  metrics,
  locale,
  t,
  copied,
  onShare,
  onRestart,
}: {
  scenario: Scenario;
  focus: Focus;
  metrics: Record<MetricKey, number>;
  locale: string;
  t: (ko: string, en: string) => string;
  copied: boolean;
  onShare: () => void;
  onRestart: () => void;
}) {
  return (
    <div style={{ background: PAPER_DEEP }}>
      <div style={{ padding: "clamp(24px, 5vw, 42px)", borderBottom: `1px solid ${LINE}` }}>
        <p style={paperEyebrowStyle}>{t("당신이 도착한 타임라인", "Your alternate timeline")}</p>
        <h2 style={mainTitleStyle}>{pick(focus.title, locale)}</h2>
        <p style={leadStyle}>{pick(scenario.verdict, locale)} {pick(focus.verdictTail, locale)}</p>
      </div>
      <div style={{ padding: "clamp(22px, 5vw, 38px)" }}>
        <Dashboard metrics={metrics} locale={locale} t={t} />
        <div className="result-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 18 }}>
          <ExperienceCard title={t("이 세계의 교과서 한 문장", "Textbook sentence")} body={pick(scenario.experiential.textbook, locale)} />
          <ExperienceCard title={t("이 세계에서 당신의 일상", "Your daily life")} body={pick(scenario.experiential.daily, locale)} />
          <ExperienceCard title={t("지도에서 가장 달라진 곳", "Most changed place on the map")} body={pick(scenario.experiential.map, locale)} />
          <ExperienceCard title={t("가장 크게 바뀐 직업", "Most changed jobs")} body={pick(scenario.experiential.job, locale)} />
          <ExperienceCard title={t("사라졌을 수도 있는 것", "What may have disappeared")} body={pick(scenario.experiential.vanished, locale)} />
          <ExperienceCard title={t("새로 생겼을 수도 있는 문화", "New culture that may appear")} body={pick(scenario.experiential.culture, locale)} />
          <ExperienceCard title={t("현재의 한국은?", "Korea in this present")} body={pick(scenario.experiential.korea, locale)} wide />
        </div>

        <div style={{ marginTop: 18, padding: "20px", border: `1.5px solid ${INK}`, borderRadius: 8, background: PAPER, boxShadow: "inset 0 0 0 4px rgba(255,248,231,0.9)" }}>
          <p style={{ ...paperEyebrowStyle, marginBottom: 8 }}>RESULT CARD</p>
          <h3 style={{ margin: 0, fontSize: "clamp(26px, 7vw, 42px)", lineHeight: 1.12 }}>{pick(focus.title, locale)}</h3>
          <p style={{ margin: "12px 0 0", color: MUTED, fontSize: 16, lineHeight: 1.7, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
            {t("한국의 위치", "Korea's position")}: <strong style={{ color: INK }}>{pick(scenario.koreaPosition, locale)}</strong>
            <br />
            {t("나의 일상", "My life")}: {pick(scenario.life, locale)}
          </p>
          <p style={{ margin: "12px 0 0", color: ACCENT, fontWeight: 900, fontSize: 17, lineHeight: 1.55 }}>
            {pick(scenario.verdict, locale)}
          </p>
        </div>

        <div style={buttonRowStyle}>
          <button type="button" onClick={onShare} style={primaryButtonStyle}>
            {copied ? t("복사 완료", "Copied") : t("결과 공유", "Share result")}
          </button>
          <button type="button" onClick={onRestart} style={secondaryButtonStyle}>
            {t("다른 방향으로 다시 시뮬레이션", "Simulate another direction")}
          </button>
        </div>
      </div>
      <ResponsiveStyle />
    </div>
  );
}

function Dashboard({ metrics, locale, t }: { metrics: Record<MetricKey, number>; locale: string; t: (ko: string, en: string) => string }) {
  return (
    <section style={{ marginTop: 18, border: `1px solid ${LINE}`, borderRadius: 8, background: "rgba(255,255,255,0.38)", padding: 16 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 18, lineHeight: 1.3 }}>{t("대체세계 상태판", "Alternate-world dashboard")}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {(Object.keys(METRIC_LABEL) as MetricKey[]).map((key) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontFamily: "var(--font-noto-sans-kr), sans-serif", fontSize: 13, fontWeight: 900, color: MUTED }}>
              <span>{pick(METRIC_LABEL[key], locale)}</span>
              <span>{metrics[key]}</span>
            </div>
            <div style={{ height: 9, marginTop: 5, borderRadius: 999, background: "rgba(36,26,20,0.12)", overflow: "hidden" }}>
              <div style={{ width: `${metrics[key]}%`, height: "100%", background: metricTone(key, metrics[key]), borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineProgress({ progress, label }: { progress: number; label: string }) {
  return (
    <div style={{ margin: "0 0 18px", padding: "14px 16px", border: "1px solid rgba(244,236,216,0.14)", borderRadius: 10, background: PANEL }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "rgba(244,236,216,0.72)", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
        <span>SIMULATION</span>
        <span>{label}</span>
      </div>
      <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: "rgba(244,236,216,0.12)", overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${GOLD}, ${ACCENT})`, transition: "width 260ms ease" }} />
      </div>
    </div>
  );
}

function InfoCard({ label, body, strong = false }: { label: string; body: string; strong?: boolean }) {
  return (
    <section style={{ padding: "clamp(20px, 4vw, 30px)", borderRight: `1px solid ${LINE}`, background: strong ? "rgba(164,95,42,0.08)" : "transparent" }}>
      <h3 style={{ margin: 0, color: ACCENT, fontSize: 15, fontWeight: 900, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
        {label}
      </h3>
      <p style={{ margin: "10px 0 0", color: MUTED, fontSize: 16, lineHeight: 1.75, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
        {body}
      </p>
    </section>
  );
}

function ExperienceCard({ title, body, wide = false }: { title: string; body: string; wide?: boolean }) {
  return (
    <section style={{ gridColumn: wide ? "1 / -1" : undefined, border: `1px solid ${LINE}`, borderRadius: 8, padding: 16, background: "rgba(255,255,255,0.42)" }}>
      <h3 style={{ margin: 0, color: ACCENT, fontSize: 15, lineHeight: 1.35, fontFamily: "var(--font-noto-sans-kr), sans-serif", fontWeight: 900 }}>
        {title}
      </h3>
      <p style={{ margin: "8px 0 0", color: MUTED, fontSize: 15, lineHeight: 1.7, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
        {body}
      </p>
    </section>
  );
}

function ResponsiveStyle() {
  return (
    <style jsx>{`
      @media (max-width: 720px) {
        .two-col,
        .result-grid {
          grid-template-columns: 1fr !important;
        }
        .result-grid > section {
          grid-column: auto !important;
        }
      }
    `}</style>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: GOLD,
  fontSize: 14,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const paperEyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const mainTitleStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: "clamp(30px, 7vw, 54px)",
  lineHeight: 1.08,
  letterSpacing: 0,
};

const leadStyle: CSSProperties = {
  margin: "16px 0 0",
  color: MUTED,
  fontSize: "clamp(16px, 4vw, 19px)",
  lineHeight: 1.75,
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const warningStyle: CSSProperties = {
  margin: "14px 0 0",
  padding: "10px 12px",
  border: `1px solid rgba(142,61,47,0.26)`,
  borderRadius: 8,
  background: "rgba(142,61,47,0.08)",
  color: RED,
  fontSize: 14,
  lineHeight: 1.6,
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const simNoticeStyle: CSSProperties = {
  margin: "20px 0",
  display: "grid",
  gap: 6,
  border: `1px solid ${LINE}`,
  borderRadius: 8,
  padding: 16,
  color: MUTED,
  fontSize: 15,
  lineHeight: 1.65,
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const buttonRowStyle: CSSProperties = {
  marginTop: 20,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 48,
  border: "none",
  borderRadius: 8,
  background: INK,
  color: PAPER,
  padding: "0 20px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 48,
  border: `1px solid ${LINE}`,
  borderRadius: 8,
  background: "rgba(255,255,255,0.45)",
  color: INK,
  padding: "0 18px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};
