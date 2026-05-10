"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

/* ============================================================================
   Theme — cinematic black + rose gold (Netflix-original feel)
   ============================================================================ */

const ROSE = "#e8c4b8";
const ROSE_BRIGHT = "#f3d4c8";
const ROSE_DIM = "rgba(232,196,184,0.5)";
const ROSE_FAINT = "rgba(232,196,184,0.18)";
const BG = "#0a0a0a";
const PAPER = "rgba(255,255,255,0.04)";
const PAPER_2 = "rgba(255,255,255,0.06)";
const INK = "#ffffff";
const INK_2 = "rgba(255,255,255,0.78)";
const SUBTLE = "rgba(255,255,255,0.45)";
const RULE = "rgba(232,196,184,0.18)";

// Backwards-compatible aliases used elsewhere in the file.
const ACCENT = ROSE;
const ACCENT_DIM = ROSE_DIM;

/* ============================================================================
   Types
   ============================================================================ */

type Gender = "male" | "female";

type GeneratedName = {
  display: string;
  pronunciation: string;
};

type DialogueLine = { who: 1 | 2; text: string };

type Genre = {
  key: string;
  name: string;
  emoji: string;
  meeting: (a: string, b: string) => string;
  signatureScene: (a: string, b: string) => string;
  lines: (a: string, b: string) => DialogueLine[];
};

/* ============================================================================
   Korean name pools
   ============================================================================ */

const KO_MALE: GeneratedName[] = [
  { display: "준서", pronunciation: "Jun-seo" },
  { display: "민준", pronunciation: "Min-jun" },
  { display: "서준", pronunciation: "Seo-jun" },
  { display: "도윤", pronunciation: "Do-yun" },
  { display: "시우", pronunciation: "Si-u" },
  { display: "주원", pronunciation: "Ju-won" },
  { display: "하준", pronunciation: "Ha-jun" },
  { display: "지호", pronunciation: "Ji-ho" },
  { display: "준우", pronunciation: "Jun-u" },
  { display: "도현", pronunciation: "Do-hyeon" },
  { display: "선우", pronunciation: "Seon-u" },
  { display: "우진", pronunciation: "U-jin" },
  { display: "민재", pronunciation: "Min-jae" },
  { display: "현우", pronunciation: "Hyeon-u" },
  { display: "지훈", pronunciation: "Ji-hun" },
  { display: "준혁", pronunciation: "Jun-hyeok" },
  { display: "승우", pronunciation: "Seung-u" },
  { display: "재원", pronunciation: "Jae-won" },
  { display: "한결", pronunciation: "Han-gyeol" },
  { display: "윤호", pronunciation: "Yun-ho" },
  { display: "성민", pronunciation: "Seong-min" },
  { display: "태양", pronunciation: "Tae-yang" },
  { display: "건우", pronunciation: "Geon-u" },
  { display: "민혁", pronunciation: "Min-hyeok" },
  { display: "재민", pronunciation: "Jae-min" },
  { display: "승현", pronunciation: "Seung-hyeon" },
];

const KO_FEMALE: GeneratedName[] = [
  { display: "서연", pronunciation: "Seo-yeon" },
  { display: "민서", pronunciation: "Min-seo" },
  { display: "하은", pronunciation: "Ha-eun" },
  { display: "지우", pronunciation: "Ji-u" },
  { display: "수아", pronunciation: "Su-a" },
  { display: "지유", pronunciation: "Ji-yu" },
  { display: "채원", pronunciation: "Chae-won" },
  { display: "수빈", pronunciation: "Su-bin" },
  { display: "지민", pronunciation: "Ji-min" },
  { display: "지아", pronunciation: "Ji-a" },
  { display: "하린", pronunciation: "Ha-rin" },
  { display: "나은", pronunciation: "Na-eun" },
  { display: "예은", pronunciation: "Ye-eun" },
  { display: "소율", pronunciation: "So-yul" },
  { display: "아린", pronunciation: "A-rin" },
  { display: "다은", pronunciation: "Da-eun" },
  { display: "예린", pronunciation: "Ye-rin" },
  { display: "수연", pronunciation: "Su-yeon" },
  { display: "지현", pronunciation: "Ji-hyeon" },
  { display: "유나", pronunciation: "Yu-na" },
  { display: "서아", pronunciation: "Seo-a" },
  { display: "하윤", pronunciation: "Ha-yun" },
  { display: "예나", pronunciation: "Ye-na" },
  { display: "채윤", pronunciation: "Chae-yun" },
  { display: "나연", pronunciation: "Na-yeon" },
  { display: "서윤", pronunciation: "Seo-yun" },
];

/* ============================================================================
   Female-name lists for gender detection
   ============================================================================ */

const FEMALE_EN = new Set(
  [
    "emma","sophia","sofia","maria","mia","olivia","isabella","ava","charlotte",
    "amelia","harper","evelyn","abigail","emily","elizabeth","mila","ella","avery",
    "camila","aria","scarlett","victoria","madison","luna","grace","chloe",
    "penelope","layla","riley","zoey","nora","lily","eleanor","hannah","lillian",
    "addison","aubrey","ellie","stella","natalie","zoe","leah","hazel","violet",
    "aurora","savannah","audrey","brooklyn","bella","claire","skylar","lucy",
    "paisley","anna","sara","sarah","caroline","ruby","ariana","jasmine","cora",
    "jade","allison","gabriella","rachel","kayla","megan","lauren","jessica",
    "ashley","amy","alice","daisy","rose","mary","laura","julia","diana","helen",
    "katherine","catherine","kate","katie","jenny","jennie","lisa","ariel",
    "iris","jane","kelly","betty","carol","linda","susan","rebecca","vanessa",
  ].map((s) => s.toLowerCase()),
);

const FEMALE_KO = new Set([
  ...KO_FEMALE.map((n) => n.display),
  "유진","수현","민지","하영","서영","지영","수영","혜진","미진","은지",
  "나영","주연","유리","수정","현정","은정","민정","해린","혜린","아영",
]);

/* ============================================================================
   Helpers
   ============================================================================ */

function isHangul(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0xac00 && c <= 0xd7a3) return true;
  }
  return false;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededIndex(seed: string, salt: string, n: number): number {
  if (n <= 0) return 0;
  return hashStr(seed + ":" + salt) % n;
}

/** Pick `n` distinct items from a pool, deterministic by seed. */
function pickN<T>(pool: T[], seed: string, salt: string, n: number): T[] {
  const indexed = pool.map((_, i) => ({
    i,
    h: hashStr(seed + ":" + salt + ":" + i),
  }));
  indexed.sort((a, b) => a.h - b.h);
  return indexed.slice(0, Math.min(n, pool.length)).map((x) => pool[x.i]);
}

function detectGender(name: string): Gender {
  const trimmed = name.trim();
  if (!trimmed) return "female";
  if (isHangul(trimmed)) {
    if (FEMALE_KO.has(trimmed)) return "female";
    return hashStr(trimmed) % 2 === 0 ? "male" : "female";
  }
  const ascii = trimmed.toLowerCase().split(/\s+/)[0].replace(/[^a-z]/g, "");
  if (FEMALE_EN.has(ascii)) return "female";
  return hashStr(ascii) % 2 === 0 ? "male" : "female";
}

function makeKoreanName(input: string, gender: Gender): GeneratedName {
  const trimmed = input.trim();
  if (isHangul(trimmed)) {
    return { display: trimmed, pronunciation: "" };
  }
  const pool = gender === "male" ? KO_MALE : KO_FEMALE;
  return pool[seededIndex(trimmed, gender + ":name", pool.length)];
}

/* ============================================================================
   Drama content — long stories, signature scenes, lines, by genre
   ============================================================================ */

const DRAMA_TITLE_SUFFIXES = [
  "봄날",
  "어느 날",
  "우리 사이",
  "그 여름",
  "첫사랑",
  "운명처럼",
  "별이 되어",
  "사랑한 기억",
  "두 번의 설렘",
  "당신이었으면",
];

const GENRES: Genre[] = [
  /* ── 재벌 로맨스 ───────────────────────────────────────────────────── */
  {
    key: "chaebol",
    name: "재벌 로맨스",
    emoji: "👔",
    meeting: (a, b) => `${a}은 한일그룹 회장의 외아들.
모든 게 다 가진 그였지만,
오직 하나, 자기 마음만은 알 수 없었다.

그날도 비서가 잡아둔 약속을 무시하고
회사를 빠져나와 골목 카페에 들렀다.

"아메리카노 한 잔이요."
"네, 잠시만요…"

쟁반을 들고 오던 ${b}가
무언가에 걸려 휘청였다.
뜨거운 커피가 ${a}의 셔츠를 적셨다.

"어머, 죄송합니다! 정말 죄송합니다!"
${b}는 새파랗게 질려 휴지를 쥐고 닦았다.
${a}은 처음으로 사람의 손이
이렇게 떨릴 수도 있다는 걸 알았다.

"…괜찮아요."

그 한마디가 어색해서
이상하게 심장이 빨라졌다.`,
    signatureScene: (a, b) => `비 오는 날 밤.
${a}은 고급 우산을 들고 나타났다.

"왜 여기 있어요?"
"…비 맞는 거 싫어서."

${b}는 알고 있었다.
그가 비가 싫은 게 아니라
자신이 비 맞는 게 싫었다는 걸.

그날 밤 ${a}의 우산 아래
두 사람의 거리가 좁혀졌다.`,
    lines: () => [
      { who: 1, text: "내가 뭘 해줄 수 있을지 몰라도, 네 곁에 있고 싶어." },
      { who: 2, text: "돈 말고요?" },
      { who: 1, text: "…응, 돈 말고." },
    ],
  },

  /* ── 학원 로맨스 ───────────────────────────────────────────────────── */
  {
    key: "school",
    name: "학원 로맨스",
    emoji: "🎒",
    meeting: (a, b) => `${a}이 서울로 전학 온 첫날.
3학년 7반 교실 문을 열었을 때
모두의 시선이 ${a}에게 향했다.

"…안녕하세요. 잘 부탁드립니다."

선생님은 빈자리를 가리켰다.
하필 그 자리는 학교에서 가장 까칠하기로 유명한
${b} 옆자리였다.

${a}이 의자를 빼는 순간
${b}가 차갑게 말했다.

"여기, 내 가방 자리인데요."

교실이 조용해졌다.
${a}은 멈칫했다가, 작게 웃었다.

"그럼 같이 써요. 옆에 앉으면 되잖아요."

${b}가 처음으로 누군가에게
말문이 막힌 순간이었다.`,
    signatureScene: (a, b) => `수능 100일 전.
교실에 혼자 남아 문제를 풀던 ${b}.
문이 살짝 열렸다.

"야, 매점 안 갈래?"
${a}이 빵 두 개를 들고 들어왔다.

"난 공부해야 해."
"그럼 같이 먹자. 공부하면서."

${a}은 옆자리에 앉아
${b}의 빵을 한 입씩 떼어 줬다.
말없이, 같은 문제집을 같이 풀었다.

100일이 지나도, 졸업해도,
${b}는 그 빵 맛을 잊지 못했다.`,
    lines: () => [
      { who: 1, text: "졸업하면 우리 다시 못 보겠지?" },
      { who: 2, text: "그러게." },
      { who: 1, text: "…같은 대학 가면 어때?" },
      { who: 2, text: "…너 때문에 공부 두 배로 해야겠다." },
    ],
  },

  /* ── 직장 로맨스 ───────────────────────────────────────────────────── */
  {
    key: "office",
    name: "직장 로맨스",
    emoji: "💼",
    meeting: (a, b) => `${a}은 입사 3년차 평사원.
오늘부터 새 팀장이 온다고 했다.
그게 누군지는 아직 몰랐다.

회의실 문이 열리고
${b}가 들어왔다. 차가운 눈빛, 깔끔한 정장.

"안녕하세요. 오늘부터 이 팀을 맡게 된 ${b}입니다."

${a}은 멍하니 봤다.
어제 술집에서 옆자리에 앉아 같이 욕했던 사람.
'우리 회사 새 팀장 진짜 별로래' 라고
같이 깔깔거렸던 그 사람이었다.

${b}도 ${a}을 보고
순간 표정이 굳었다.

회의가 끝난 뒤 ${a}이 다가갔다.
"…저, 어제 일은…"
"기억 안 나는 걸로 합시다."

그날부터 ${a}의 야근이 시작됐다.`,
    signatureScene: (a, b) => `송년회 회식 날.
${b}가 너무 많이 마셨다.

${a}은 묵묵히 ${b}를 부축해
택시에 태워 보냈다.
다음 날 출근한 ${b}는 모르고 있었다.

${a}이 자기 집 앞까지 따라가서
새벽 6시까지 차에 앉아
잘 들어갔는지 지켜본 걸.

"팀장님, 어제 잘 들어가셨어요?"
"…네."
"팀장님은요?"
"…저도요."

거짓말. ${a}은 한숨도 못 잤다.`,
    lines: () => [
      { who: 2, text: "저 이 회사 그만둘 거예요." },
      { who: 1, text: "…" },
      { who: 2, text: "왜 아무 말도 안 해요?" },
      { who: 1, text: "…가지 마." },
    ],
  },

  /* ── 운명적 재회 ───────────────────────────────────────────────────── */
  {
    key: "reunion",
    name: "운명적 재회",
    emoji: "🌙",
    meeting: (a, b) => `10년 전 봄.
${a}은 ${b}에게 마지막으로 말했다.
"미안해. 잠깐만 떨어져 있자."
그 '잠깐'은 10년이 됐다.

${a}은 출장을 끝내고 돌아온 길이었다.
공항에서 짐을 끌고 카페에 들어선 순간—
유리창 너머로, 누군가가 노트북을 펼치고 앉아 있었다.

심장이 멈췄다.
10년 전 그 옆모습 그대로였다.
${b}였다.

자리에서 일어나려는 ${b}와 눈이 마주쳤다.
${b}도 멈췄다.
서로 한 마디도 못 했다.

"…잘 지냈어?"
${a}이 먼저 말을 꺼냈다.
${b}는 잠시 말이 없다가, 옅게 웃었다.
"너는?"

10년이 지났는데
한 마디면 어제 같았다.`,
    signatureScene: (a, b) => `우연히 같은 영화관, 같은 영화.
어두운 객석, 옆자리.
${a}과 ${b}.

영화가 시작되고 5분 만에
${b}가 작게 울기 시작했다.
10년 전, 두 사람이 함께 보러 갔던
바로 그 영화였다.

${a}은 아무 말도 안 했다.
다만 손수건을 ${b}의 손에
조용히 쥐어줄 뿐이었다.

엔딩 크레딧이 올라갈 때,
${b}는 ${a}의 손에
손수건과 함께 자신의 손을 함께 쥐었다.`,
    lines: () => [
      { who: 1, text: "10년이 지났는데 왜 아직도 이러는 거야." },
      { who: 2, text: "저도 몰라요. 그러니까 더 무서워요." },
    ],
  },

  /* ── 판타지 로맨스 ─────────────────────────────────────────────────── */
  {
    key: "fantasy",
    name: "판타지 로맨스",
    emoji: "✨",
    meeting: (a, b) => `${a}은 천 년을 살아온 구미호였다.
인간들 사이에서 평범한 척 살았지만
누구에게도 마음을 열지 않았다.

천 년 동안 사랑한 인간들은 모두
${a}을 두고 먼저 떠났으니까.

그런데 ${b}는 달랐다.

처음 만난 날, 가로등 아래서
${b}가 ${a}에게 우산을 씌워줬다.
"비 맞으면 감기 걸려요."

${a}은 웃었다.
"저는 감기 안 걸려요."
"…사람인데 왜 감기 안 걸려요?"

순간 ${a}의 눈동자가 금색으로 변했다.
${b}는 한 발짝도 물러서지 않았다.
오히려 천천히 손을 뻗어
${a}의 뺨을 만졌다.

"아… 진짜 사람이 아니구나."
"…무섭지 않아요?"
"아니요. 슬퍼 보여요."

천 년 만에 ${a}은 알았다.
누군가 자신을 알아봐 주는 게
이렇게 따뜻한 일이라는 걸.`,
    signatureScene: (a, b) => `보름달이 뜬 밤.
${a}의 정체가 들켜버린 날.

마을 사람들은 ${a}을 쫓아왔다.
"요괴다! 잡아라!"

${a}은 도망쳤다.
산속, 절벽 끝.

뒤따라온 ${b}가 헐떡이며
${a} 앞을 막아섰다.

"비키세요. 다칩니다."
"안 비켜요."
"…죽고 싶어요?"
"당신을 잃는 게 죽는 것보다 무서워요."

${a}의 금색 눈에서
처음으로 눈물이 떨어졌다.`,
    lines: () => [
      { who: 1, text: "100년 후엔 당신이 없을 텐데." },
      { who: 2, text: "그래서 더 많이 사랑해 두려고요." },
      { who: 1, text: "…나만 남게 될 거예요." },
      { who: 2, text: "그땐 추억으로 살아요." },
    ],
  },

  /* ── 시간여행 로맨스 ───────────────────────────────────────────────── */
  {
    key: "timetravel",
    name: "시간여행 로맨스",
    emoji: "⏰",
    meeting: (a, b) => `2045년. ${a}은 실수로
타임머신의 버튼을 눌렀다.

도착한 곳은 2025년 서울.
낯선 거리에서 길을 잃은 ${a}에게
처음 말을 건 사람이 바로 ${b}였다.

"괜찮아요? 많이 당황해 보여서요."

${a}은 아무 말도 할 수 없었다.
20년 후 미래에서
매일 보던 사진 속 그 얼굴이었으니까.

"저… 혹시 이름이 ${b} 맞죠?"
"어떻게 알았어요?"

이제 ${a}에게는 두 가지 선택이 남았다.
미래로 돌아가거나.
여기 남거나.`,
    signatureScene: (a, b) => `${a}이 미래로 돌아가야 하는 날.

"기억 못 하게 될 거예요.
 우리가 만난 것도, 이 시간도."
"그래도 괜찮아요."
"왜요?"
"…당신이 행복하면 됐으니까."

타임머신이 빛을 내며 사라졌다.
${b}는 텅 빈 골목에 혼자 남겨졌다.

그리고 20년 후.
낯선 사람이 ${b} 앞에 나타났다.

"저… 혹시 저 알아요?"
${a}이었다. 기억을 잃은 채로.`,
    lines: () => [
      { who: 1, text: "과거를 바꾸면 안 된다는 거 알아. 그래도 당신만큼은 지키고 싶었어." },
      { who: 2, text: "바보." },
      { who: 1, text: "응." },
    ],
  },

  /* ── 의사 로맨스 ───────────────────────────────────────────────────── */
  {
    key: "doctor",
    name: "의사 로맨스",
    emoji: "🏥",
    meeting: (a, b) => `새벽 3시.
응급실에 환자가 실려 들어왔다.

${a}은 당직 의사.
열다섯 시간째 깨어 있었지만
이 순간만큼은 흔들릴 수 없었다.

"심정지! CPR 시작합니다!"

마침 그날 첫 출근한 신입 간호사 ${b}가
바로 옆에서 보조했다.
${b}의 손은 떨렸지만 정확했다.

긴 사투 끝에 환자가 살아났다.

수술실 밖, 둘은 말없이 벽에 기대 섰다.
${a}이 먼저 입을 열었다.

"…오늘 잘했어요."
"아니에요. 의사 선생님이 다 하신 거잖아요."
"그럼 같이 한 거예요."

${b}는 그 말에 처음으로
긴장이 풀려서 웃었다.
${a}은 그 웃음을 오래 기억하게 될 거였다.`,
    signatureScene: (a, b) => `${a}이 큰 수술을 앞둔 날.
5시간짜리 대수술.

${b}는 평소처럼 수술실 앞에서
${a}에게 물 한 컵을 건넸다.

"…긴장 풀어요."
"…티 났어요?"
"평소엔 안 떨던 손이 떨리잖아요."

${a}은 잠시 ${b}를 봤다.
"…수술 끝나면, 같이 라면 먹을래요?"
"갑자기요?"
"무사히 끝나야 갈 수 있는 곳이라서."

5시간 뒤, 두 사람은 라면집에 있었다.`,
    lines: () => [
      { who: 1, text: "당신, 환자 아니죠?" },
      { who: 2, text: "왜요?" },
      { who: 1, text: "환자한테 이런 마음 가지면 제 면허 박탈이라." },
      { who: 2, text: "…그럼 박탈당하세요." },
    ],
  },

  /* ── 형사 로맨스 ───────────────────────────────────────────────────── */
  {
    key: "detective",
    name: "형사 로맨스",
    emoji: "🔍",
    meeting: (a, b) => `${a}은 강력반 형사 5년차.
오늘 잡으러 온 용의자는
신원 미상의 정체불명 인물이었다.

골목길 끝, 가로등 아래에서
${a}은 그 사람과 마주쳤다.
${b}였다.

"움직이지 마. 손 들어."

${b}는 천천히 손을 들었다.
하지만 표정은 너무 침착했다.
용의자라기엔 너무, 너무 깨끗한 눈빛이었다.

"당신… 수상해요."
"형사님이 더 수상한데요?"
"…뭐?"
"한밤중에 골목길에서 모르는 사람한테
 총 들이미는 게 정상이에요?"

순간 ${a}은 깨달았다.
이 사람은 그날의 진짜 범인이 아니었다.
다만 누군가의 누명을 대신 쓰고 있었다.

그리고 그날부터 ${a}은
이 이상한 용의자를
지키기로 마음먹었다.`,
    signatureScene: (a, b) => `진짜 범인을 잡으러 가는 날.
${a}은 ${b}를 안전한 곳에 두려 했다.

"여기 있어. 끝나면 데리러 올게."
"같이 가요."
"안 돼."
"왜요?"
"…당신을 잃을까봐 무서워서."

순간 ${b}가 ${a}을 끌어안았다.
"그러면 더 같이 가야죠.
 혼자 가다 죽으면, 나는 어떻게 살아요."

${a}은 처음으로
형사로서가 아니라
한 사람으로서 ${b}에게 안겼다.`,
    lines: () => [
      { who: 1, text: "이번 사건 끝나면 사표 낼 거야." },
      { who: 2, text: "왜요?" },
      { who: 1, text: "이런 일 하면서 당신 옆에 있으면 안 될 것 같아서." },
      { who: 2, text: "…내가 옆에 있을 사람을 정해요?" },
    ],
  },
];

/* ============================================================================
   Chemistry pool — pick 3 by seed
   ============================================================================ */

const CHEMISTRY_POOL: string[] = [
  "한 명이 차갑고 한 명이 따뜻한 정반대 케미예요. 🧊🔥",
  "둘 다 감정 표현이 서툴러서 눈빛으로 대화하는 커플이에요. 👀",
  "티격태격하지만 위기 앞에서 항상 서로를 선택하는 사이예요. ⚡",
  "한 명이 먼저 좋아하고 다른 한 명이 나중에 깨닫는 구조예요. 💭",
  "어릴 때부터 알던 소꿉친구가 연인이 되는 케미예요. 🧸",
  "운명처럼 계속 마주치는 붉은 실로 연결된 두 사람이에요. 🔴",
];

/* ============================================================================
   Supporting characters (3 fixed roles, names interpolated)
   ============================================================================ */

function buildSupporting(a: string, b: string): { role: string; desc: string }[] {
  return [
    {
      role: `${a}의 절친`,
      desc: "두 사람의 사랑을 누구보다 먼저 알아채는 촉 100단 친구",
    },
    {
      role: `${b}의 전 연인`,
      desc: "가장 결정적인 순간에 나타나 위기를 만드는 캐릭터",
    },
    {
      role: "둘을 이어주는 조력자",
      desc: "우연인 척 두 사람을 계속 같은 장소에 데려다 놓는 운명의 설계자",
    },
  ];
}

/* ============================================================================
   Endings & OST
   ============================================================================ */

const ENDINGS = [
  { emoji: "🌸", name: "해피엔딩",   line: "두 사람은 결국 함께했다" },
  { emoji: "🌧",  name: "새드엔딩",   line: "아름다웠기에 더 아팠다" },
  { emoji: "🌅", name: "열린결말",   line: "그게 끝이 아니었다" },
  { emoji: "📺", name: "시즌2 예정", line: "이야기는 계속된다" },
];

const OST_MOODS = [
  { emoji: "🎹", name: "잔잔한 피아노 발라드" },
  { emoji: "🎵", name: "신나는 청춘 OST" },
  { emoji: "🎻", name: "애절한 현악 선율" },
  { emoji: "🎸", name: "설레는 어쿠스틱 기타" },
];

/* ============================================================================
   Result builder
   ============================================================================ */

type CoupleResult = {
  name1Korean: GeneratedName;
  name2Korean: GeneratedName;
  gender1: Gender;
  gender2: Gender;
  title: string;
  compatibility: number;
  hearts: string;
  genre: Genre;
  meeting: string;
  signatureScene: string;
  lines: DialogueLine[];
  chemistry: string[];
  supporting: { role: string; desc: string }[];
  nickname: string;
  ending: (typeof ENDINGS)[number];
  ost: (typeof OST_MOODS)[number];
};

function buildHearts(score: number): string {
  if (score >= 90) return "💕💕💕💕💕";
  if (score >= 80) return "💕💕💕💕🤍";
  return "💕💕💕🤍🤍";
}

function buildNickname(a: string, b: string): string {
  const a1 = a.trim().slice(0, 1);
  const b1 = b.trim().slice(0, 1);
  if (!a1 || !b1) return "우리 커플";
  return `${a1}${b1} 커플`;
}

function buildResult(name1: string, name2: string): CoupleResult {
  const seed = name1 + "|" + name2;
  const gender1 = detectGender(name1);
  const gender2 = detectGender(name2);
  const ko1 = makeKoreanName(name1, gender1);
  const ko2 = makeKoreanName(name2, gender2);

  const titleSuffix = DRAMA_TITLE_SUFFIXES[seededIndex(seed, "title", DRAMA_TITLE_SUFFIXES.length)];
  const title = `${ko1.display}과 ${ko2.display}의 ${titleSuffix}`;

  const compatibility = 70 + (hashStr(seed + ":compat") % 30);
  const hearts = buildHearts(compatibility);

  const genre = GENRES[seededIndex(seed, "genre", GENRES.length)];

  return {
    name1Korean: ko1,
    name2Korean: ko2,
    gender1,
    gender2,
    title,
    compatibility,
    hearts,
    genre,
    meeting: genre.meeting(ko1.display, ko2.display),
    signatureScene: genre.signatureScene(ko1.display, ko2.display),
    lines: genre.lines(ko1.display, ko2.display),
    chemistry: pickN(CHEMISTRY_POOL, seed, "chem", 3),
    supporting: buildSupporting(ko1.display, ko2.display),
    nickname: buildNickname(ko1.display, ko2.display),
    ending: ENDINGS[seededIndex(seed, "ending", ENDINGS.length)],
    ost: OST_MOODS[seededIndex(seed, "ost", OST_MOODS.length)],
  };
}

/* ============================================================================
   Page
   ============================================================================ */

type Phase = "input" | "result";

export default function KdramaCouplePage(): ReactElement {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("input");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [submitted1, setSubmitted1] = useState("");
  const [submitted2, setSubmitted2] = useState("");
  const [copied, setCopied] = useState(false);
  const input1Ref = useRef<HTMLInputElement | null>(null);

  const result = useMemo<CoupleResult | null>(() => {
    if (!submitted1 || !submitted2) return null;
    return buildResult(submitted1, submitted2);
  }, [submitted1, submitted2]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    });
  }, [phase]);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const a = name1.trim();
      const b = name2.trim();
      if (!a || !b) {
        if (!a) input1Ref.current?.focus();
        return;
      }
      setSubmitted1(a);
      setSubmitted2(b);
      setPhase("result");
    },
    [name1, name2],
  );

  const handleReset = useCallback(() => {
    setName1("");
    setName2("");
    setSubmitted1("");
    setSubmitted2("");
    setCopied(false);
    setPhase("input");
    setTimeout(() => input1Ref.current?.focus(), 50);
  }, []);

  const onShare = useCallback(async () => {
    if (!result) return;
    const text = t(
      `우리가 K드라마 커플이라면 🎬\n` +
        `제목: ${result.title}\n` +
        `궁합: ${result.compatibility}점 ${result.hearts}\n` +
        `장르: ${result.genre.emoji} ${result.genre.name}\n` +
        `엔딩: ${result.ending.emoji} ${result.ending.name}\n` +
        `→ nolza.fun/games/kdrama-couple`,
      `If we were a K-drama couple 🎬\n` +
        `Title: ${result.title}\n` +
        `Compatibility: ${result.compatibility} ${result.hearts}\n` +
        `Genre: ${result.genre.emoji} ${result.genre.name}\n` +
        `Ending: ${result.ending.emoji} ${result.ending.name}\n` +
        `→ nolza.fun/games/kdrama-couple`,
    );
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        color: INK,
        fontFamily: "var(--font-noto-serif-kr), 'Noto Sans KR', serif",
        position: "relative",
        paddingBottom: 100,
        overflow: "hidden",
      }}
    >
      {/* Cinematic background — distant city silhouette at low opacity */}
      <CityBackdrop />

      {/* Subtle vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 30%, transparent 0%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          fontSize: 18,
          color: ROSE,
          textDecoration: "none",
          background: "rgba(10,10,10,0.7)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${RULE}`,
          letterSpacing: "0.06em",
        }}
      >
        ←
      </Link>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "input" ? "center" : "flex-start",
          padding: "70px 20px 20px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
        }}
      >
        {phase === "input" && (
          <InputView
            name1={name1}
            name2={name2}
            setName1={setName1}
            setName2={setName2}
            onSubmit={handleSubmit}
            input1Ref={input1Ref}
            t={t}
          />
        )}

        {phase === "result" && result && (
          <ResultView
            originalName1={submitted1}
            originalName2={submitted2}
            result={result}
            copied={copied}
            onShare={onShare}
            onReset={handleReset}
            t={t}
          />
        )}
      </div>

      {/* Cinematic animation keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes kdcReveal {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.kdc-reveal {
  opacity: 0;
  animation: kdcReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--kdc-i, 0) * 110ms);
}
@keyframes kdcSlideUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.kdc-slide-up {
  animation: kdcSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
@keyframes kdcLetterIn {
  from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.kdc-letter {
  display: inline-block;
  opacity: 0;
  animation: kdcLetterIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--kdc-l, 0) * 35ms);
}
@keyframes kdcCreditsRoll {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-100vh); }
}
.kdc-credits-out {
  animation: kdcCreditsRoll 0.7s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@keyframes kdcCity {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.07; }
}
.kdc-city {
  animation: kdcCity 8s ease-in-out infinite;
}
`,
        }}
      />

      <AdMobileSticky />
    </main>
  );
}

/* ============================================================================
   Input view
   ============================================================================ */

function InputView({
  name1,
  name2,
  setName1,
  setName2,
  onSubmit,
  input1Ref,
  t,
}: {
  name1: string;
  name2: string;
  setName1: (v: string) => void;
  setName2: (v: string) => void;
  onSubmit: (e?: FormEvent) => void;
  input1Ref: React.RefObject<HTMLInputElement | null>;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const ready = name1.trim() && name2.trim();
  const titleKo = "우리가 K드라마\n커플이라면?";
  const titleEn = "What if we were\na K-drama couple?";
  const titleText = t(titleKo, titleEn);

  return (
    <div
      className="kdc-slide-up"
      style={{ maxWidth: 480, width: "100%", textAlign: "center" }}
    >
      {/* Top kicker */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          letterSpacing: "0.6em",
          fontWeight: 500,
          color: ROSE,
          opacity: 0.5,
          marginBottom: 36,
          textTransform: "uppercase",
        }}
      >
        K-Drama Couple
      </div>

      {/* Main title — letter-by-letter fade */}
      <h1
        style={{
          fontFamily: "var(--font-noto-serif-kr), serif",
          fontSize: "clamp(34px, 7vw, 52px)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: INK,
          marginBottom: 22,
          whiteSpace: "pre-line",
        }}
      >
        {titleText.split("").map((ch, i) => (
          <span
            key={`${i}-${ch}`}
            className="kdc-letter"
            style={{ ["--kdc-l" as string]: String(i) }}
          >
            {ch === "\n" ? <br /> : ch}
          </span>
        ))}
      </h1>

      {/* Subline */}
      <p
        style={{
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
          fontSize: 13,
          color: INK,
          opacity: 0.5,
          letterSpacing: "0.04em",
          marginBottom: 40,
        }}
      >
        {t(
          "두 이름의 케미스트리를 분석합니다",
          "Analyzing the chemistry between two names",
        )}
      </p>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <Input
          inputRef={input1Ref}
          placeholder={t("첫 번째 주인공", "First lead")}
          value={name1}
          onChange={setName1}
        />

        {/* Quote-mark divider */}
        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            margin: "2px 0",
            color: ROSE,
          }}
        >
          <span
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(232,196,184,0.35))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-noto-serif-kr), serif",
              fontSize: 28,
              fontWeight: 400,
              opacity: 0.7,
              transform: "translateY(-4px)",
              letterSpacing: "-0.02em",
            }}
          >
            ❝&nbsp;❞
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, rgba(232,196,184,0.35))",
            }}
          />
        </div>

        <Input
          placeholder={t("두 번째 주인공", "Second lead")}
          value={name2}
          onChange={setName2}
        />

        <button
          type="submit"
          disabled={!ready}
          style={{
            ...primaryButton,
            marginTop: 22,
            opacity: ready ? 1 : 0.35,
            cursor: ready ? "pointer" : "not-allowed",
          }}
        >
          {t("우리 드라마 시작", "Begin our drama")}{" "}
          <span style={{ marginLeft: 4 }}>→</span>
        </button>
      </form>

      <p
        style={{
          marginTop: 32,
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.6,
          letterSpacing: "0.04em",
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        {t(
          "영문 이름은 한국 이름으로 자동 캐스팅됩니다",
          "English names are auto-cast into Korean leads",
        )}
      </p>
    </div>
  );
}

/* ============================================================================
   City silhouette backdrop
   ============================================================================ */

function CityBackdrop(): ReactElement {
  return (
    <div
      aria-hidden
      className="kdc-city"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        opacity: 0.05,
        pointerEvents: "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto",
        backgroundPosition: "center bottom",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMax slice"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "60vh",
        }}
      >
        <defs>
          <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c4b8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8c4b8" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <g fill="url(#bldg)">
          {/* Stylized Seoul-ish skyline */}
          <rect x="0" y="280" width="60" height="120" />
          <rect x="55" y="240" width="80" height="160" />
          <rect x="130" y="260" width="50" height="140" />
          <rect x="175" y="180" width="100" height="220" />
          <rect x="270" y="220" width="55" height="180" />
          <rect x="320" y="160" width="90" height="240" />
          <rect x="405" y="240" width="60" height="160" />
          <rect x="460" y="200" width="70" height="200" />
          <rect x="525" y="120" width="40" height="280" />
          <polygon points="545,90 565,80 565,120 545,120" />
          <rect x="560" y="150" width="80" height="250" />
          <rect x="635" y="220" width="55" height="180" />
          <rect x="685" y="180" width="100" height="220" />
          <rect x="780" y="240" width="50" height="160" />
          <rect x="825" y="200" width="70" height="200" />
          <rect x="890" y="140" width="55" height="260" />
          <polygon points="905,110 925,100 925,140 905,140" />
          <rect x="940" y="180" width="80" height="220" />
          <rect x="1015" y="220" width="60" height="180" />
          <rect x="1070" y="160" width="90" height="240" />
          <rect x="1155" y="240" width="45" height="160" />
        </g>
      </svg>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}): ReactElement {
  return (
    <input
      ref={inputRef}
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={30}
      style={{
        background: "rgba(255,255,255,0.05)",
        color: INK,
        border: `1px solid ${ROSE_FAINT}`,
        borderRadius: 4,
        padding: "18px 20px",
        fontSize: 16,
        outline: "none",
        fontFamily: "var(--font-noto-serif-kr), serif",
        fontWeight: 500,
        letterSpacing: "0.02em",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "center",
        transition: "border-color 200ms ease, background 200ms ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = ROSE;
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = ROSE_FAINT;
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
    />
  );
}

/* ============================================================================
   Result view
   ============================================================================ */

function ResultView({
  originalName1,
  originalName2,
  result,
  copied,
  onShare,
  onReset,
  t,
}: {
  originalName1: string;
  originalName2: string;
  result: CoupleResult;
  copied: boolean;
  onShare: () => void;
  onReset: () => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const a = result.name1Korean.display;
  const b = result.name2Korean.display;

  // Stagger index helper for reveal animation
  let revealIdx = 0;
  const stagger = (): React.CSSProperties => ({
    ["--kdc-i" as string]: String(revealIdx++),
  });

  return (
    <div className="kdc-slide-up" style={{ maxWidth: 600, width: "100%" }}>
      {/* ── Poster hero ─────────────────────────────────────────────── */}
      <div
        className="kdc-reveal"
        style={{
          ...stagger(),
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          border: `1px solid ${ROSE_FAINT}`,
          borderRadius: 4,
          padding: "44px 28px 36px",
          textAlign: "center",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top corner mark */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            letterSpacing: "0.5em",
            color: ROSE,
            opacity: 0.6,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          A nolza original
        </div>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            letterSpacing: "0.4em",
            color: SUBTLE,
            marginBottom: 28,
            textTransform: "uppercase",
          }}
        >
          {t("주연", "Starring")}
        </div>

        {/* Lead names — billed actor style */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 26,
          }}
        >
          <CoupleName name={a} original={originalName1} />
          <div
            aria-hidden
            style={{
              color: ROSE,
              fontSize: 14,
              letterSpacing: "0.5em",
              opacity: 0.55,
              fontFamily: "var(--font-noto-serif-kr), serif",
            }}
          >
            &
          </div>
          <CoupleName name={b} original={originalName2} />
        </div>

        {/* Drama title */}
        <div
          style={{
            margin: "30px 0 6px",
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: "clamp(26px, 5vw, 36px)",
            fontWeight: 700,
            lineHeight: 1.25,
            color: INK,
            letterSpacing: "-0.02em",
            wordBreak: "keep-all",
          }}
        >
          {result.title}
        </div>

        {/* Genre tag */}
        <div
          style={{
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 16px",
            border: `1px solid ${ROSE_FAINT}`,
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            letterSpacing: "0.32em",
            color: ROSE,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span aria-hidden>{result.genre.emoji}</span>
          <span>{result.genre.name}</span>
        </div>

        {/* Compatibility — film score style */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: `1px solid ${ROSE_FAINT}`,
            display: "flex",
            justifyContent: "center",
            gap: 28,
            alignItems: "baseline",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 9.5,
                letterSpacing: "0.4em",
                color: SUBTLE,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {t("궁합", "Chemistry")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-serif-kr), serif",
                fontSize: 44,
                fontWeight: 300,
                color: ROSE,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {result.compatibility}
              <span
                style={{
                  fontSize: 14,
                  marginLeft: 4,
                  color: SUBTLE,
                  letterSpacing: "0.06em",
                }}
              >
                / 100
              </span>
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: ROSE_FAINT }} />
          <div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 9.5,
                letterSpacing: "0.4em",
                color: SUBTLE,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {t("팬덤 이름", "Ship Name")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-serif-kr), serif",
                fontSize: 22,
                fontWeight: 600,
                color: INK,
                letterSpacing: "-0.01em",
              }}
            >
              {result.nickname}
            </div>
          </div>
        </div>
      </div>

      {/* ── 첫 만남 ───────────────────────────────────────────────────── */}
      <SectionDivider
        title={t("첫 만남", "First Meeting")}
        en="EP. 01 — FIRST MEETING"
        stagger={stagger}
      />
      <Section stagger={stagger}>
        <Story text={result.meeting} />
      </Section>

      {/* ── 명장면 ───────────────────────────────────────────────────── */}
      <SectionDivider
        title={t("명장면", "Signature Scene")}
        en="EP. 07 — SIGNATURE SCENE"
        stagger={stagger}
      />
      <Section stagger={stagger}>
        <Story text={result.signatureScene} accent />
      </Section>

      {/* ── 케미 분석 ──────────────────────────────────────────────── */}
      <SectionDivider
        title={t("두 사람의 케미", "Chemistry")}
        en="CHEMISTRY"
        stagger={stagger}
      />
      <Section stagger={stagger}>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {result.chemistry.map((c, i) => (
            <li
              key={i}
              style={{
                background: PAPER_2,
                border: `1px solid ${RULE}`,
                borderRadius: 12,
                padding: "12px 14px",
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
                fontSize: 16,
                color: INK,
                lineHeight: 1.6,
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 조연들 ───────────────────────────────────────────────────── */}
      <SectionDivider
        title={t("조연진", "Supporting Cast")}
        en="SUPPORTING CAST"
        stagger={stagger}
      />
      <Section stagger={stagger}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.supporting.map((s, i) => (
            <div
              key={i}
              style={{
                background: PAPER_2,
                border: `1px solid ${RULE}`,
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-noto-serif-kr), serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: ACCENT,
                  marginBottom: 4,
                }}
              >
                {s.role}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-noto-sans-kr), sans-serif",
                  fontSize: 15,
                  color: INK,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 명대사 ───────────────────────────────────────────────────── */}
      <SectionDivider
        title={t("명대사", "Signature Lines")}
        en="SIGNATURE LINES"
        stagger={stagger}
      />
      <Section stagger={stagger}>
        <Dialogue lines={result.lines} name1={a} name2={b} />
      </Section>

      {/* ── 엔딩 + OST ──────────────────────────────────────────────── */}
      <SectionDivider
        title={t("엔딩 & OST", "Ending & OST")}
        en="ENDING & OST"
        stagger={stagger}
      />
      <div
        className="kdc-reveal"
        style={{
          ...stagger(),
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <SmallCard
          eyebrow={t("엔딩", "ENDING")}
          title={`${result.ending.emoji} ${result.ending.name}`}
          line={result.ending.line}
        />
        <SmallCard
          eyebrow={t("OST 분위기", "OST VIBE")}
          title={`${result.ost.emoji} ${result.ost.name}`}
          line=""
        />
      </div>

      {/* ── Buttons ─────────────────────────────────────────────────── */}
      <div
        className="kdc-reveal"
        style={{
          ...stagger(),
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 24,
        }}
      >
        <button type="button" onClick={onShare} style={primaryButton}>
          {copied ? "COPIED" : `📢 ${t("우리 드라마 공유하기", "Share our drama")}`}
        </button>
        <button type="button" onClick={onReset} style={secondaryButton}>
          ↺ {t("다시 하기", "Try Again")}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   UI helpers
   ============================================================================ */

function CoupleName({
  name,
  original,
}: {
  name: string;
  original: string;
}): ReactElement {
  const showOriginal = original && original.trim() !== name;
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--font-noto-serif-kr), serif",
          fontSize: "clamp(32px, 6vw, 44px)",
          fontWeight: 700,
          color: INK,
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
        }}
      >
        {name}
      </div>
      {showOriginal && (
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: ROSE,
            opacity: 0.65,
            marginTop: 6,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          {original}
        </div>
      )}
    </div>
  );
}

function SectionDivider({
  title,
  en,
  stagger,
}: {
  title: string;
  en: string;
  stagger: () => React.CSSProperties;
}): ReactElement {
  return (
    <div
      className="kdc-reveal"
      style={{
        ...stagger(),
        display: "flex",
        alignItems: "center",
        gap: 18,
        margin: "44px 4px 16px",
      }}
    >
      <div style={{ flex: 1, height: 1, background: ROSE_FAINT }} />
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: ROSE,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {en || title}
      </div>
      <div style={{ flex: 1, height: 1, background: ROSE_FAINT }} />
    </div>
  );
}

function Section({
  stagger,
  children,
}: {
  stagger: () => React.CSSProperties;
  children: React.ReactNode;
}): ReactElement {
  return (
    <div
      className="kdc-reveal"
      style={{
        ...stagger(),
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${ROSE_FAINT}`,
        borderRadius: 4,
        padding: "26px 24px",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Story({ text, accent = false }: { text: string; accent?: boolean }): ReactElement {
  return (
    <div
      style={{
        fontFamily: "var(--font-noto-serif-kr), serif",
        fontSize: 16,
        color: accent ? INK : INK_2,
        lineHeight: 2.05,
        whiteSpace: "pre-wrap",
        wordBreak: "keep-all",
        letterSpacing: "-0.005em",
      }}
    >
      {text}
    </div>
  );
}

function Dialogue({
  lines,
  name1,
  name2,
}: {
  lines: DialogueLine[];
  name1: string;
  name2: string;
}): ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {lines.map((l, i) => {
        const speaker = l.who === 1 ? name1 : name2;
        return (
          <div
            key={i}
            style={{
              borderLeft: `2px solid ${ROSE}`,
              paddingLeft: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                color: ROSE,
                letterSpacing: "0.32em",
                fontWeight: 600,
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              {speaker}
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-serif-kr), serif",
                fontSize: 17,
                color: INK,
                lineHeight: 1.7,
                wordBreak: "keep-all",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              &ldquo;{l.text}&rdquo;
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SmallCard({
  eyebrow,
  title,
  line,
}: {
  eyebrow: string;
  title: string;
  line: string;
}): ReactElement {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${ROSE_FAINT}`,
        borderRadius: 4,
        padding: "20px 18px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: "0.4em",
          color: ROSE,
          opacity: 0.7,
          fontWeight: 600,
          marginBottom: 10,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: "var(--font-noto-serif-kr), serif",
          fontSize: 17,
          fontWeight: 600,
          color: INK,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      {line && (
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: SUBTLE,
            lineHeight: 1.55,
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontStyle: "italic",
          }}
        >
          &ldquo;{line}&rdquo;
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Shared button styles
   ============================================================================ */

const primaryButton: React.CSSProperties = {
  background: "linear-gradient(135deg, #e8c4b8 0%, #f3d4c8 50%, #d8b0a3 100%)",
  color: "#0a0a0a",
  border: "none",
  padding: "16px 32px",
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.18em",
  cursor: "pointer",
  touchAction: "manipulation",
  boxShadow: "0 8px 28px rgba(232,196,184,0.18)",
  fontFamily: "var(--font-noto-serif-kr), serif",
  textTransform: "uppercase",
};

const secondaryButton: React.CSSProperties = {
  background: "transparent",
  color: ROSE,
  border: `1px solid ${ROSE_DIM}`,
  padding: "16px 28px",
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.2em",
  cursor: "pointer",
  touchAction: "manipulation",
  fontFamily: "var(--font-noto-serif-kr), serif",
  textTransform: "uppercase",
};
