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
import { ShareCard } from "../../components/ShareCard";
import { useLocale } from "@/hooks/useLocale";
import { trackResultView, trackRetryClick, trackShareClick, trackTestStart } from "@/lib/analytics";

/* ============================================================================
   Theme — fortune-teller's chamber: deep navy + gold + crimson
   ============================================================================ */

const ACCENT = "#E8D39A"; // refined soft gold
const ACCENT_DIM = "rgba(232,211,154,0.58)";
const ACCENT_DEEP = "#B99454"; // antique gold
const CRIMSON = "#7B1F31"; // deep wine accent
const BG = "#070812";
const PAPER = "rgba(255,255,255,0.045)";
const PAPER_2 = "rgba(232,211,154,0.085)";
const INK = "#f5f0e0"; // 크림
const SUBTLE = "rgba(245,240,224,0.55)";
const RULE = "rgba(232,211,154,0.2)";

/* ============================================================================
   Types
   ============================================================================ */

type Gender = "male" | "female";

type GeneratedName = {
  display: string;
  pronunciation: string;
};

type SajuPillar = {
  stem: typeof STEMS[number];
  branch: typeof BRANCHES[number];
};

type SajuResult = {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  hour: SajuPillar | null;
  elementCounts: Record<ElementKey, number>;
  dominant: ElementKey;
  weakest: ElementKey;
};

/* ============================================================================
   Saju constants — 천간 (Heavenly Stems) & 지지 (Earthly Branches)
   ============================================================================ */

type ElementKey = "목" | "화" | "토" | "금" | "수";

const ELEMENT_INFO: Record<
  ElementKey,
  { ko: string; en: string; emoji: string; hanja: string; color: string }
> = {
  목: { ko: "목", en: "Wood",  emoji: "🌳", hanja: "木", color: "#3aae5a" },
  화: { ko: "화", en: "Fire",  emoji: "🔥", hanja: "火", color: "#e74c3c" },
  토: { ko: "토", en: "Earth", emoji: "⛰️", hanja: "土", color: "#d4a64a" },
  금: { ko: "금", en: "Metal", emoji: "🔩", hanja: "金", color: "#c5c5c5" },
  수: { ko: "수", en: "Water", emoji: "💧", hanja: "水", color: "#3a82c9" },
};

const STEMS: ReadonlyArray<{
  ko: string;
  hanja: string;
  element: ElementKey;
  yinyang: "양" | "음";
}> = [
  { ko: "갑", hanja: "甲", element: "목", yinyang: "양" },
  { ko: "을", hanja: "乙", element: "목", yinyang: "음" },
  { ko: "병", hanja: "丙", element: "화", yinyang: "양" },
  { ko: "정", hanja: "丁", element: "화", yinyang: "음" },
  { ko: "무", hanja: "戊", element: "토", yinyang: "양" },
  { ko: "기", hanja: "己", element: "토", yinyang: "음" },
  { ko: "경", hanja: "庚", element: "금", yinyang: "양" },
  { ko: "신", hanja: "辛", element: "금", yinyang: "음" },
  { ko: "임", hanja: "壬", element: "수", yinyang: "양" },
  { ko: "계", hanja: "癸", element: "수", yinyang: "음" },
];

const BRANCHES: ReadonlyArray<{
  ko: string;
  hanja: string;
  element: ElementKey;
  animal: string;
  animalEn: string;
  emoji: string;
  hourRange: string;
}> = [
  { ko: "자", hanja: "子", element: "수", animal: "쥐",     animalEn: "Rat",     emoji: "🐭", hourRange: "23:00–01:00" },
  { ko: "축", hanja: "丑", element: "토", animal: "소",     animalEn: "Ox",      emoji: "🐮", hourRange: "01:00–03:00" },
  { ko: "인", hanja: "寅", element: "목", animal: "호랑이", animalEn: "Tiger",   emoji: "🐯", hourRange: "03:00–05:00" },
  { ko: "묘", hanja: "卯", element: "목", animal: "토끼",   animalEn: "Rabbit",  emoji: "🐰", hourRange: "05:00–07:00" },
  { ko: "진", hanja: "辰", element: "토", animal: "용",     animalEn: "Dragon",  emoji: "🐲", hourRange: "07:00–09:00" },
  { ko: "사", hanja: "巳", element: "화", animal: "뱀",     animalEn: "Snake",   emoji: "🐍", hourRange: "09:00–11:00" },
  { ko: "오", hanja: "午", element: "화", animal: "말",     animalEn: "Horse",   emoji: "🐴", hourRange: "11:00–13:00" },
  { ko: "미", hanja: "未", element: "토", animal: "양",     animalEn: "Sheep",   emoji: "🐑", hourRange: "13:00–15:00" },
  { ko: "신", hanja: "申", element: "금", animal: "원숭이", animalEn: "Monkey",  emoji: "🐵", hourRange: "15:00–17:00" },
  { ko: "유", hanja: "酉", element: "금", animal: "닭",     animalEn: "Rooster", emoji: "🐔", hourRange: "17:00–19:00" },
  { ko: "술", hanja: "戌", element: "토", animal: "개",     animalEn: "Dog",     emoji: "🐶", hourRange: "19:00–21:00" },
  { ko: "해", hanja: "亥", element: "수", animal: "돼지",   animalEn: "Pig",     emoji: "🐷", hourRange: "21:00–23:00" },
];

/* ============================================================================
   Day-stem (일간) personality readings
   ============================================================================ */

type DayStemReading = {
  trait: string;
  advice: string;
  luckyColor: string;
  luckyDirection: string;
  luckyNumber: string;
};

const DAY_STEM_READINGS: Record<string, DayStemReading> = {
  갑: {
    trait:
      "큰 나무처럼 곧고 강한 리더십. 정직과 추진력이 무기이며 한번 결정하면 끝까지 갑니다.",
    advice: "고집보다 유연함을 더하면 더 큰 그릇이 됩니다.",
    luckyColor: "청록색",
    luckyDirection: "동쪽",
    luckyNumber: "3, 8",
  },
  을: {
    trait:
      "유연한 풀잎처럼 부드럽지만 끈기가 있습니다. 섬세한 감각과 인간관계가 강점.",
    advice: "타인의 시선보다 자신의 길에 집중할 때 빛납니다.",
    luckyColor: "연두색",
    luckyDirection: "동쪽",
    luckyNumber: "3, 8",
  },
  병: {
    trait:
      "태양처럼 밝고 활기찬 기운. 사람을 끌어당기는 매력의 중심에 섭니다.",
    advice: "에너지를 분산하지 말고 한 곳에 집중해보세요.",
    luckyColor: "붉은색",
    luckyDirection: "남쪽",
    luckyNumber: "2, 7",
  },
  정: {
    trait:
      "촛불처럼 따뜻하고 섬세한 마음. 깊이 있는 통찰력과 따뜻한 배려심이 무기.",
    advice: "내면의 빛을 믿고 자신감을 가지세요.",
    luckyColor: "주홍색",
    luckyDirection: "남쪽",
    luckyNumber: "2, 7",
  },
  무: {
    trait:
      "큰 산처럼 든든하고 신뢰받는 사람. 어떤 폭풍에도 흔들리지 않는 안정감.",
    advice: "변화를 두려워하지 말고 새로운 도전도 해보세요.",
    luckyColor: "황토색",
    luckyDirection: "중앙",
    luckyNumber: "5, 10",
  },
  기: {
    trait:
      "기름진 땅처럼 풍요로움을 만드는 사람. 실속과 인내심이 두드러집니다.",
    advice: "지나친 신중함은 기회를 놓칠 수 있습니다.",
    luckyColor: "베이지색",
    luckyDirection: "중앙",
    luckyNumber: "5, 10",
  },
  경: {
    trait:
      "강철처럼 단단하고 명쾌한 성격. 결단력과 정의감이 남다릅니다.",
    advice: "부드러움을 더하면 사람들이 더 가까이 옵니다.",
    luckyColor: "흰색·은색",
    luckyDirection: "서쪽",
    luckyNumber: "4, 9",
  },
  신: {
    trait:
      "보석처럼 빛나는 재능과 미적 감각. 예리한 판단력과 세련된 취향의 소유자.",
    advice: "완벽주의를 조금 내려놓으면 더 자유로워집니다.",
    luckyColor: "은색·금색",
    luckyDirection: "서쪽",
    luckyNumber: "4, 9",
  },
  임: {
    trait:
      "큰 강물처럼 깊고 흐름이 있는 사람. 지혜와 적응력이 뛰어나며 큰 그림을 봅니다.",
    advice: "방향이 흐트러질 때는 잠시 멈추고 정비하세요.",
    luckyColor: "검은색·남색",
    luckyDirection: "북쪽",
    luckyNumber: "1, 6",
  },
  계: {
    trait:
      "맑은 빗물처럼 순수하고 직관이 발달했습니다. 예술적 감각과 영감이 풍부.",
    advice: "감정에 휩쓸리기보다 명상으로 중심을 잡으세요.",
    luckyColor: "남색",
    luckyDirection: "북쪽",
    luckyNumber: "1, 6",
  },
};

/* ============================================================================
   Zodiac year-sign brief readings
   ============================================================================ */

const ZODIAC_BRIEF: Record<string, string> = {
  쥐: "재치와 적응력의 해. 영리하게 기회를 잡습니다.",
  소: "근면함과 인내의 해. 천천히 그러나 확실하게.",
  호랑이: "용맹함과 카리스마. 모험을 즐기는 사람.",
  토끼: "다정하고 예술적인 감각. 평화를 사랑합니다.",
  용: "야망과 카리스마의 결정체. 큰 일을 도모합니다.",
  뱀: "지혜와 직관의 해. 깊이 있는 통찰력의 소유자.",
  말: "자유와 활력. 한 자리에 머물지 않는 사람.",
  양: "온유함과 창의성. 다정하고 예술적인 영혼.",
  원숭이: "재치와 영리함. 어떤 상황에서도 길을 찾습니다.",
  닭: "정직과 성실의 해. 약속을 무겁게 여깁니다.",
  개: "충실함과 정의감. 가까운 사람을 끝까지 지킵니다.",
  돼지: "관대함과 풍요로움. 사람을 좋아하는 따뜻함.",
};

/* ============================================================================
   Extended saju reading content
   ============================================================================ */

const OVERVIEW_BY_STEM: Record<string, string> = {
  갑:
    "갑목(甲木) 일주의 사주는 큰 나무가 하늘을 향해 곧게 뻗어가는 형상이오. 한번 마음을 정하면 좀처럼 굽히지 않으며, 자기 길을 묵묵히 걸어가는 굳건함이 천성입니다.\n\n사람들 사이에서 자연스럽게 중심이 되는 운명을 타고났으나, 그만큼 책임의 무게도 큰 사주입니다. 인생 전반부에는 자기 입지를 다지는 데 시간을 쓰고, 후반부로 갈수록 결실이 보이는 흐름이오.\n\n다만 갑목은 외풍에 흔들리면 안에서부터 부러지기 쉬우니, 마음의 뿌리를 깊이 두는 일이 평생의 과제입니다. 가족과 의리 있는 인연이 두 번째 뿌리가 되어줄 것이오.",
  을:
    "을목(乙木) 일주는 부드러운 풀잎과 덩굴처럼 유연하지만 절대 꺾이지 않는 끈기를 품은 사주이오. 강해 보이려 애쓰지 않는데도, 시간이 지나면 누구보다 멀리 가 있는 자신을 발견하게 됩니다.\n\n섬세한 감각과 인간관계의 기술이 타고난 무기이니, 사람과 사람 사이를 잇는 자리에서 두각을 드러냅니다. 인생 중반에 한 번의 큰 변곡점이 있고, 그 시기를 지난 뒤 비로소 진짜 자기 자리를 찾는 사주이오.\n\n약점은 자기 마음보다 남의 시선을 먼저 읽는다는 점입니다. 평생 자기 안의 목소리에 귀 기울이는 연습이 필요하리다.",
  병:
    "병화(丙火) 일주는 한낮의 태양처럼 환하게 사방을 비추는 기운을 타고났소. 모이는 자리마다 자연스레 중심에 서고, 사람을 끌어당기는 자기장의 소유자입니다.\n\n표현하지 않으면 답답해하는 성격이라 일찍부터 무언가를 드러내고 발산하는 일을 하게 될 운입니다. 인생 초반부터 두각을 드러내지만, 30대 중반에 한 번 식는 시기를 거치고 다시 일어서는 이중 상승의 사주이오.\n\n다만 모든 것을 다 비추다 보니 정작 자기 그늘은 못 보는 것이 약점이외다. 가까운 사람의 그림자를 알아채는 마음이 평생 따라 자라야 합니다.",
  정:
    "정화(丁火) 일주는 어둠 속의 촛불처럼 따뜻하고 정확한 빛을 내는 사주이오. 큰 무대보다 한 사람의 마음을 비추는 일에서 진가를 발휘합니다.\n\n예민한 통찰력으로 남이 못 보는 것을 보고, 그걸 말없이 도와주는 사람입니다. 그래서 평생 곁에 좋은 인연이 끊이지 않으나, 정작 자신은 외로움을 깊게 느끼는 모순을 안고 사오.\n\n인생의 큰 흐름은 30대 후반부터 진가를 발휘하는 늦타입이외다. 일찍 뭐가 안 됐다고 조급해할 필요 없으니, 자기 빛을 꺼뜨리지 않는 것이 가장 중요한 평생의 숙제입니다.",
  무:
    "무토(戊土) 일주는 우뚝 솟은 큰 산처럼 흔들림 없는 무게중심을 가진 사주이외다. 폭풍이 몰아쳐도 그 자리에서 뿌리내리는 사람으로 알려집니다.\n\n주변 사람이 위기에 빠지면 자연스레 의지하는 사람이 당신이오. 책임감과 신뢰가 평생 따라다니는 무토의 운명입니다. 다만 너무 무거운 짐을 혼자 지려는 경향이 있어, 자기 어깨를 가끔 비워줘야 합니다.\n\n인생 흐름은 천천히 그러나 단단하게 쌓이는 형국이오. 큰 도약은 40대 이후이며, 그때 비로소 다른 사람들이 못 따라오는 자리에 서 있을 것이외다.",
  기:
    "기토(己土) 일주는 기름진 논밭처럼 풍요를 만들어내는 사주이오. 화려하지 않지만 누가 봐도 알아차릴 수 있는 든든함이 있습니다.\n\n실속과 인내가 천성이라 한걸음씩 모은 것이 시간이 지나면 큰 산을 이루는 흐름입니다. 사람을 키우고 무언가를 양육하는 자리에 잘 어울리는 사주이외다.\n\n약점은 지나친 신중함이 도약의 기회를 놓칠 수 있다는 점입니다. 인생에 두세 번은 도박이 필요한 순간이 오니, 그때만큼은 머리보다 가슴을 따라야 합니다.",
  경:
    "경금(庚金) 일주는 강철처럼 단단하고 경계가 명확한 사주이오. 옳고 그름을 분명히 가르는 결단력과 정의감이 천부적 무기입니다.\n\n한번 결정한 것은 좀처럼 바꾸지 않으며, 그래서 신뢰는 단단하나 변통이 어려운 면도 있소. 인생 중반에 큰 결단의 시기가 오는데, 그 결정이 평생을 좌우하는 분기점이 될 것이외다.\n\n약점은 지나친 단호함이 사람을 다치게 할 수 있다는 점입니다. 강한 칼은 부드러운 천에 싸여 있을 때 가장 빛나는 법이외다.",
  신:
    "신금(辛金) 일주는 보석처럼 빛나는 미적 감각과 예리함을 타고난 사주이오. 사물의 본질을 꿰뚫는 안목, 세련된 취향, 그리고 감춰진 결을 읽는 직관이 무기입니다.\n\n남이 그저 지나치는 것을 보석으로 만드는 능력자이며, 무엇을 만지든 격이 달라지는 사람입니다. 다만 완벽함을 추구하다 자기 자신을 깎아내는 약점이 있으니, 적절히 멈추는 법을 익혀야 하오.\n\n인생 흐름은 30대 후반에 진가를 인정받기 시작하여 50대까지 꾸준히 상승하는 형국이외다.",
  임:
    "임수(壬水) 일주는 큰 강물처럼 흐르고 깊은 사주이외다. 표면은 잔잔하나 안에는 헤아릴 수 없는 깊이가 있고, 가만히 있는 듯하지만 멈추지 않는 사람입니다.\n\n지혜와 적응력이 뛰어나고 큰 그림을 보는 안목이 있으니, 시야가 넓어야 하는 자리에서 빛납니다. 다만 흐름이 흐트러질 때는 자기 길을 잃기 쉬워 정기적으로 멈춰 정비하는 시간이 필요하오.\n\n인생의 큰 변동은 임수에게 자연스러운 일이며, 그 변동이 오히려 더 큰 바다로 나가는 길이 됩니다.",
  계:
    "계수(癸水) 일주는 맑은 빗물처럼 순수하고 깊은 직관을 가진 사주이외다. 영감과 감수성이 풍부하여 예술과 영성에 친화적인 운명을 타고났소.\n\n남이 못 보는 결을 읽고, 보이지 않는 것을 알아채는 능력이 있으나, 그만큼 외부 자극에 영향을 많이 받기에 보호받는 환경이 평생 중요합니다.\n\n인생 흐름은 잔잔하다가 어느 순간 폭우처럼 쏟아지는 시기가 두세 번 오는 형국이오. 그 시기를 잘 활용하면 평범한 인생이 특별한 인생으로 바뀝니다.",
};

const STRENGTHS_BY_STEM: Record<string, string[]> = {
  갑: [
    "한번 결심하면 끝까지 가는 추진력 — 다른 이들이 중간에 포기할 때 당신은 이미 결승점을 보고 있다.",
    "정직함이 곧 무기 — 거짓이 통하지 않는 자리에서 신뢰의 중심이 된다.",
    "위기에서 더 단단해지는 뿌리 — 큰일 앞에서 흔들리지 않는 사람이 곁에 있다는 것만으로 주변에 평안을 준다.",
  ],
  을: [
    "사람을 읽는 섬세함 — 대화 한두 마디로 상대의 진심을 알아챈다.",
    "유연한 적응력 — 어떤 환경에 던져져도 결국 뿌리를 내린다.",
    "꺾이지 않는 부드러움 — 강한 바람도 결국 풀잎은 살아남는다.",
  ],
  병: [
    "타고난 분위기 메이커 — 모이는 자리마다 활기가 살아난다.",
    "사람을 끌어당기는 매력 — 처음 만난 사람도 마음을 열게 한다.",
    "큰 무대에서 발휘되는 카리스마 — 시선이 모이는 곳일수록 더 빛난다.",
  ],
  정: [
    "남이 못 보는 결을 읽는 통찰 — 사람의 마음을 정확히 짚는다.",
    "오래 가는 정 — 한번 곁을 준 사람을 끝까지 챙기는 깊이.",
    "위기에 진가가 드러나는 침착함 — 패닉 한가운데서도 등불이 된다.",
  ],
  무: [
    "흔들림 없는 신뢰감 — 모두가 의지할 수 있는 단단한 어른.",
    "무거운 책임을 견디는 힘 — 큰일을 맡길 수 있는 사람.",
    "장기적인 안목 — 당장이 아닌 10년 뒤를 보는 시선.",
  ],
  기: [
    "사람과 일을 키우는 양육의 재능 — 손에 닿으면 자라난다.",
    "실속을 챙기는 현실감각 — 화려함보다 내실을 본다.",
    "끈기와 인내 — 시간을 자기 편으로 만드는 자질.",
  ],
  경: [
    "결단력 — 머뭇거림 없이 옳은 길로 간다.",
    "정의감과 일관성 — 원칙이 흔들리지 않는다.",
    "위기 대응 능력 — 가장 차가운 머리로 가장 뜨거운 순간을 푼다.",
  ],
  신: [
    "타고난 미적 감각 — 무엇을 만지든 격이 올라간다.",
    "본질을 꿰뚫는 안목 — 가짜와 진짜를 한눈에 가른다.",
    "세련된 취향 — 자기 분야에서 기준이 되는 사람.",
  ],
  임: [
    "넓은 시야 — 큰 그림과 흐름을 동시에 본다.",
    "뛰어난 적응력 — 환경이 바뀔수록 진가가 드러난다.",
    "깊은 지혜 — 한 마디로 핵심을 짚는 통찰.",
  ],
  계: [
    "예리한 직관 — 보이지 않는 것을 먼저 안다.",
    "예술적 감수성 — 평범한 것에서 비범한 것을 본다.",
    "정신적 깊이 — 영감과 의미를 다루는 자리에서 빛난다.",
  ],
};

const WEAKNESSES_BY_STEM: Record<string, string[]> = {
  갑: [
    "고집 — 한번 마음먹으면 잘 굽히지 않으니 사람을 잃을 수도 있소.",
    "융통성 부족 — 직진만 하다 보면 우회로를 놓치기 쉽소.",
    "혼자 짊어지는 버릇 — 도와달라는 말이 잘 안 나오니 안에서 쌓여 부러지기 쉽소.",
  ],
  을: [
    "남의 시선에 흔들림 — 자기 마음보다 남의 평가를 먼저 보오.",
    "결단의 망설임 — 가능성을 너무 많이 보다 결국 시기를 놓치기 쉽소.",
    "거절 못하는 약함 — 다 받아들이다 보면 자기 자리가 사라지오.",
  ],
  병: [
    "에너지 낭비 — 모든 곳에 빛을 비추다 정작 자기 일은 못 끝내오.",
    "변덕 — 흥미가 떨어지면 빠르게 식는 면이 있소.",
    "인정 욕구 — 박수가 끊기면 의욕도 같이 식소.",
  ],
  정: [
    "감정 과부하 — 남의 감정을 다 흡수하니 자기가 무거워지오.",
    "외로움 — 정작 자기 마음은 잘 안 드러내니 깊은 곳이 비어 있소.",
    "지나친 배려 — 자기 욕구를 자꾸 뒤로 미루니 어느 순간 폭발하오.",
  ],
  무: [
    "변화에 둔감 — 너무 단단해서 바뀌어야 할 때를 놓치오.",
    "무뚝뚝함 — 표현이 적으니 가까운 사람이 답답해할 수 있소.",
    "무거움 — 모든 책임을 자기에게 끌어오니 인생이 늘 무겁소.",
  ],
  기: [
    "지나친 신중함 — 머뭇거리다 큰 기회를 놓치오.",
    "잔걱정 — 일어나지도 않은 일을 미리 떠안소.",
    "양보 과잉 — 자기 몫을 챙기는 데 어색한 면이 있소.",
  ],
  경: [
    "단호함이 만드는 거리 — 잘라내는 말이 사람을 멀어지게 하오.",
    "융통성 부족 — 흑백 너머의 회색을 잘 못 다루오.",
    "자기 검열의 부재 — 옳다고 믿으면 멈추지 않으니 가끔 사고가 나오.",
  ],
  신: [
    "완벽주의 — 자기 자신을 갈아내며 가오.",
    "예민함 — 거친 환경에 노출되면 빠르게 소진되오.",
    "거리 두기 — 진심을 잘 안 보이니 외로워지오.",
  ],
  임: [
    "방향성 흔들림 — 시야가 넓다 보니 한 곳에 머물지 못하오.",
    "감정의 깊이 — 한번 가라앉으면 빠져나오기 어렵소.",
    "통제 욕구 — 큰 흐름을 보다 보니 작은 부분도 다 잡으려 하오.",
  ],
  계: [
    "외부 자극에 약함 — 좋고 나쁨이 다 깊게 박히오.",
    "현실 감각 부족 — 영감을 따라가다 실무를 놓치기 쉽소.",
    "감정 기복 — 같은 하루에도 여러 번 흔들리오.",
  ],
};

const RELATIONSHIP_BY_STEM: Record<string, string> = {
  갑: "리더의 자리에 자연스레 앉지만, 친밀해지기까지는 시간이 걸리오. 깊이 들어온 사람에겐 평생 등을 내주는 의리파입니다.",
  을: "주변의 분위기를 부드럽게 만드는 사람이오. 갈등을 잘 풀고 사람을 잇는 다리가 되니, 곁에 사람이 끊이지 않습니다.",
  병: "어디 가든 분위기 메이커이오. 첫인상이 강렬하나, 그 뒤를 깊게 끌고 가는 데는 별도의 노력이 필요하다 보소.",
  정: "단짝이 한두 명, 그러나 그 깊이는 누구보다 진하오. 1:1 관계에서 가장 빛나는 유형입니다.",
  무: "말은 적지만 곁에 있어 주는 사람으로 알려지오. '의지하는 형'이라기보다 '의지받는 형'으로 자리잡습니다.",
  기: "묵묵히 챙겨주는 사람이오. 화려한 친구는 아니지만 떠나지 않는 친구로 평생 자리합니다.",
  경: "원칙이 분명해 신뢰를 사지만, 처음엔 차갑게 보이는 면이 있소. 시간이 지나면 가장 단단한 우정이 됩니다.",
  신: "취향이 잘 맞는 사람과 깊이 통하오. 인간관계가 넓진 않으나 정선된 사람들로 곁이 채워집니다.",
  임: "처음 보는 사람도 편하게 만드는 흐름이 있소. 다양한 분야의 사람을 두루 알게 됩니다.",
  계: "감정의 결이 비슷한 사람과 깊게 통하오. 영혼이 맞는 친구를 평생 한두 명 얻는 유형입니다.",
};

const LOVE_BY_STEM: Record<string, { style: string; ideal: string; warning: string; timing: string }> = {
  갑: {
    style: "한번 사랑하면 직진하는 형이오. 표현이 서툴러도 행동으로 다 보이니 진심이 의심받지 않소.",
    ideal: "자기 길이 분명한 사람, 흔들리지 않는 사람과 잘 맞소. 의지하기보다 함께 서는 인연을 만나야 하오.",
    warning: "자기 방식만 고집하면 상대를 외롭게 하오. 가끔 굽히는 법을 배워야 사랑이 길어집니다.",
    timing: "30대 초반에 인연이 분명해지는 흐름이외다. 그 전엔 인연이 와도 알아보지 못할 가능성이 있소.",
  },
  을: {
    style: "맞춰주는 사랑을 잘 하오. 상대의 분위기를 읽고 거기에 따라 부드럽게 흐르오.",
    ideal: "당신의 섬세함을 알아봐 주는 사람이 좋소. 거친 사람보다 결이 비슷한 인연이 평생 갑니다.",
    warning: "다 맞춰주다 자기를 잃기 쉬우니, 가끔 '나는 어떤가'를 묻는 시간이 필요하오.",
    timing: "20대 후반과 30대 초반 사이에 큰 인연이 옵니다. 늦은 인연일수록 깊고 단단합니다.",
  },
  병: {
    style: "사랑에 빠지면 표현이 풍부하고 화려하오. 상대를 빛나게 만드는 재주가 있소.",
    ideal: "자기 빛이 있는 사람과 만나야 하오. 당신의 빛에만 기대는 사람은 당신을 소진시킵니다.",
    warning: "처음의 뜨거움이 식기 전에 깊이를 만들어야 하오. 안 그러면 짧고 강한 인연이 반복되오.",
    timing: "사랑은 일찍 옵니다. 20대 초중반부터 인연이 활발하지만, 진짜 인연은 30대 초반에 알아봅니다.",
  },
  정: {
    style: "조용하지만 한결같은 사랑을 하오. 표현은 적어도 사랑은 깊으니 상대가 알아채기까지 시간이 걸리오.",
    ideal: "마음을 알아주는 사람, 말 없는 배려를 알아채는 사람과 평생 갑니다.",
    warning: "자기 마음을 안 드러내다 상대가 떠나는 일이 있소. 한 번은 먼저 다가가는 용기가 필요합니다.",
    timing: "30대 중후반 — 늦지만 깊은 인연이 운명적으로 옵니다. 일찍 안 되더라도 조급할 필요 없소.",
  },
  무: {
    style: "묵직한 사랑을 하오. 한번 마음을 정하면 좀처럼 흔들리지 않으니 평생을 같이 갈 사람을 만납니다.",
    ideal: "감정 표현이 분명한 사람이 좋소. 당신이 표현이 적으니 상대가 채워줘야 균형이 맞습니다.",
    warning: "감정을 너무 안 보이니 상대가 사랑받는다고 못 느낄 때가 있소. 표현 연습이 필요합니다.",
    timing: "30대 중반 이후에 안정된 인연이 자리잡소. 그 전 인연은 연습이라 보면 됩니다.",
  },
  기: {
    style: "은근하고 따뜻한 사랑을 하오. 상대를 자라게 하는 사랑, 키워주는 사랑이오.",
    ideal: "자기 성장을 중요하게 여기는 사람과 잘 맞소. 함께 자라는 인연이 평생 갑니다.",
    warning: "자기보다 상대를 먼저 챙기는 패턴이 굳어지면 지치오. 받는 연습도 필요합니다.",
    timing: "20대 후반에 만난 인연이 30대 후반까지 자라 결실로 가는 흐름입니다.",
  },
  경: {
    style: "단호하고 분명한 사랑을 하오. 모호한 관계를 못 견디니 시작과 끝이 명확합니다.",
    ideal: "당신의 단호함을 안전하다 느끼는 사람이 좋소. 흔들리는 사람과는 부딪힙니다.",
    warning: "사랑에도 칼날이 들어가기 쉬우니 부드러움 한 겹이 필요합니다.",
    timing: "30대 초반 — 일이 안정될 때 사랑도 안정됩니다. 일과 사랑이 함께 가는 사주입니다.",
  },
  신: {
    style: "취향이 분명한 사랑을 하오. 평범한 사랑은 잘 끌리지 않으니 결이 맞는 사람을 기다립니다.",
    ideal: "미적 감각이 있는 사람, 결이 섬세한 인연과 잘 어울립니다.",
    warning: "완벽을 기대하면 사람이 안 옵니다. 70%만 맞아도 가까이 두는 연습이 필요합니다.",
    timing: "늦은 인연 사주이외다. 30대 후반 ~ 40대 초반에 평생 갈 인연이 옵니다.",
  },
  임: {
    style: "깊고 흐르는 사랑을 하오. 처음엔 가벼워 보이지만 안에는 큰 강이 흐르고 있습니다.",
    ideal: "다양한 모습을 받아주는 사람, 변화를 같이 가는 사람과 잘 맞습니다.",
    warning: "흐름이 자유롭다 보니 한곳에 묶이는 게 어색할 수 있소. 안정의 가치도 익혀야 합니다.",
    timing: "큰 변동기가 사랑을 가져옵니다. 이직·이사·졸업 같은 변곡점이 인연의 문이 되오.",
  },
  계: {
    style: "감성적이고 직관적인 사랑을 하오. 말보다 분위기로 통하는 인연을 만납니다.",
    ideal: "당신의 깊이를 두려워하지 않는 사람이 좋소. 표면적인 관계는 오래 못 갑니다.",
    warning: "감정 기복이 사랑을 흔들 수 있으니 자기 중심을 잡는 연습이 평생의 숙제입니다.",
    timing: "운명적인 만남이 한 번에 옵니다. 그게 언제일지는 알기 어렵지만, 만나면 즉시 알아채는 사주입니다.",
  },
};

const WEALTH_BY_STEM: Record<string, string> = {
  갑:
    "재물은 자기가 만든 자리에서 들어오는 사주이오. 회사에 묶여 받는 돈보다 자기 이름을 걸고 만드는 돈이 진짜입니다. 30대 후반부터 재물 그릇이 커지기 시작하여 50대에 안정됩니다. 다만 한 곳에 너무 오래 묶어두면 흐름이 막히니, 정기적으로 굴리는 일이 중요하오.",
  을:
    "재물이 한꺼번에 들어오기보다 여러 갈래로 흐르는 형국입니다. 본업 외에 부수입이 자연스럽게 따라붙으니 N잡 사주이외다. 큰 재물은 30대 후반과 40대 중반 두 번 옵니다. 사람을 통해 들어오는 돈이라 인간관계가 곧 재물입니다.",
  병:
    "재물보다 명예가 먼저 오는 사주이외다. 이름이 알려지면 돈은 따라오니, 재물 자체를 좇기보다 자기 이름값을 키우는 일에 집중해야 하오. 30대에 재물 운이 강하게 들어오나, 그만큼 새는 곳도 많으니 관리자가 한 명 있어야 합니다.",
  정:
    "큰 재물보다 안정된 흐름의 사주이오. 한꺼번에 큰 돈이 들어오는 일은 드물지만, 평생 굶지 않는 단단한 재운이 있습니다. 30대 후반부터 자기 분야에서 인정받으며 재물이 따라옵니다. 빌려주는 돈은 반드시 못 받는 셈치고 줘야 하오.",
  무:
    "큰 산처럼 천천히 그러나 든든하게 쌓이는 재운입니다. 한 곳에 오래 머물수록 재물이 쌓이는 사주이외다. 부동산 운이 특히 좋으니, 자기 자리(집)를 갖는 일이 평생의 큰 자산이 됩니다. 큰 재물은 40대 중반 이후 본격화됩니다.",
  기:
    "꾸준히 모으는 형의 재운입니다. 한꺼번에 들어오기보다 매일매일 쌓이는 흐름이오. 모은 돈이 평생을 지탱합니다. 재물을 굴려서 늘리는 데 능하니 작은 사업이나 임대에 운이 따릅니다. 50대 이후 재물이 본격적으로 결실을 맺습니다.",
  경:
    "결단으로 만드는 재물의 사주이외다. 큰 결정 한 번이 평생 재물을 좌우합니다. 망설이지 않고 움직일 때 재물이 따르니, 직감이 오면 빠르게 움직여야 합니다. 30대 중반에 큰 결단의 시기가 오는데, 그때를 놓치지 마소.",
  신:
    "정선된 재물의 사주이오. 큰 돈보다 가치 있는 돈을 만드는 사람입니다. 예술·디자인·전문직 등 자기 격을 인정받는 분야에서 재물이 옵니다. 40대 이후 진가가 인정되며 재물도 같이 자랍니다.",
  임:
    "흐르는 재물의 사주이외다. 큰 돈이 들어왔다 나가기를 반복하나, 시간이 지나면 결국 큰 강을 이룹니다. 한 곳에 묶지 말고 굴리며 사는 사주이오. 해외와 인연이 있으니 외국 관련 재물이 들어옵니다.",
  계:
    "예측 불가의 재물 흐름입니다. 가만히 있다가 한 번에 큰 돈이 들어오는 시기가 두세 번 옵니다. 평소엔 검소하게 살다 그 시기에 모든 걸 거는 사주이외다. 영감과 직관에 따른 투자가 운이 따릅니다.",
};

const CAREER_BY_STEM: Record<string, { fields: string; talent: string; success: string }> = {
  갑: {
    fields: "법률, 정치, 경영, 건축, 교육 등 사람을 이끄는 자리. 자기 사업도 좋소.",
    talent: "리더십, 추진력, 책임감",
    success: "자기 이름을 걸고 무언가를 짓는 일에서 가장 빛납니다. 회사원보다 창업가의 그릇이오.",
  },
  을: {
    fields: "디자인, 카피라이팅, 브랜딩, 인사, 상담 등 사람·감각을 다루는 분야.",
    talent: "섬세함, 인간관계, 표현력",
    success: "사람과 사람 사이를 잇는 자리에서 두각을 드러냅니다. 중간자 역할에서 진가가 나옵니다.",
  },
  병: {
    fields: "방송, 연예, 강의, 영업, 마케팅 등 자기를 드러내는 직업.",
    talent: "표현력, 카리스마, 에너지",
    success: "무대가 넓을수록 빛납니다. 사람들 앞에 서는 일이 천직이외다.",
  },
  정: {
    fields: "상담, 의료, 연구, 작가, 큐레이터 등 깊이 있는 전문직.",
    talent: "통찰력, 집중력, 깊은 사고",
    success: "오래 한 분야를 파면 그 분야의 권위자가 됩니다. 전문성으로 살아가는 운입니다.",
  },
  무: {
    fields: "공직, 대기업, 부동산, 금융, 토목·건설 등 묵직하고 안정된 분야.",
    talent: "신뢰감, 책임감, 인내",
    success: "조직에서 시간이 지날수록 자리가 단단해집니다. 임원의 그릇이외다.",
  },
  기: {
    fields: "교육, 농업·식품, 인사, 가정의학 등 사람·생명을 키우는 분야.",
    talent: "양육 본능, 인내, 실무능력",
    success: "사람을 키우는 자리에서 자기도 함께 자랍니다. 멘토·교육자의 그릇입니다.",
  },
  경: {
    fields: "법조, 군경, 외과, 감사, 컨설팅 등 결단이 필요한 자리.",
    talent: "결단력, 정의감, 분석력",
    success: "차가운 머리가 필요한 자리에서 누구보다 정확합니다. 위기 해결사의 그릇입니다.",
  },
  신: {
    fields: "예술, 디자인, 보석, 패션, 큐레이션 등 미적 감각을 다루는 분야.",
    talent: "미적 안목, 정밀함, 취향",
    success: "한 분야의 거장이 되는 그릇이오. 자기 결을 끝까지 갈고닦으면 권위자가 됩니다.",
  },
  임: {
    fields: "무역, 외교, 미디어, 출판, 학자 등 시야가 넓은 분야.",
    talent: "통찰, 적응력, 큰 그림",
    success: "여러 분야를 가로지르는 자리에서 빛납니다. 한 분야 전문가보다 종합 사색가의 그릇입니다.",
  },
  계: {
    fields: "예술, 영성, 심리, 작가, 카운슬러 등 영감과 감수성을 다루는 분야.",
    talent: "직관, 영감, 깊은 감수성",
    success: "남이 못 보는 것을 보는 자리에서 빛납니다. 평범한 직장보다 자기 작업이 어울리오.",
  },
};

const HEALTH_BY_DOMINANT: Record<ElementKey, string> = {
  목: "간과 담(쓸개)에 주의하소. 목기가 강하면 분노와 스트레스가 간을 다치게 하기 쉽소. 봄철 환절기 컨디션 관리가 평생의 숙제이외다. 푸른 채소와 신맛이 도움이 됩니다.",
  화: "심장과 소장에 주의하소. 화기가 강하면 불면과 흥분으로 심장에 무리가 가오. 여름철 더위와 카페인 과다를 조심해야 합니다. 쓴맛(쑥, 도라지)과 충분한 수면이 약입니다.",
  토: "위와 비장에 주의하소. 토기가 강하면 소화 장애와 만성 피로가 따라붙소. 단 음식 과다와 불규칙한 식사가 가장 큰 적입니다. 단맛(꿀, 호박)과 규칙적인 식생활이 약입니다.",
  금: "폐와 대장에 주의하소. 금기가 강하면 호흡기와 피부가 약점입니다. 환절기 감기와 알레르기를 평생 안고 가는 사주이외다. 매운맛(생강, 마늘)과 깊은 호흡이 약입니다.",
  수: "신장과 방광에 주의하소. 수기가 강하면 비뇨기 계통과 허리에 무리가 가기 쉽소. 차가운 음식과 과음이 가장 큰 적입니다. 짠맛(미역, 다시마)과 따뜻한 물이 약입니다.",
};

const YEARLY_BY_ZODIAC: Record<string, { overall: string; goodMonths: string; badMonths: string }> = {
  쥐: {
    overall: "올해는 변화의 흐름이 강한 해이외다. 작년의 답답함이 풀리고 새로운 기회가 열리니, 망설이지 말고 결단해야 하오. 인간관계에서 큰 인연이 들어옵니다.",
    goodMonths: "3월, 6월, 11월",
    badMonths: "5월, 9월",
  },
  소: {
    overall: "올해는 안정 위에 한 발 더 나가는 해이외다. 그동안 쌓아온 것이 결실로 보이기 시작하니 인내가 보상받습니다. 다만 큰 결단은 하반기로 미루는 게 좋습니다.",
    goodMonths: "4월, 8월, 12월",
    badMonths: "2월, 7월",
  },
  호랑이: {
    overall: "올해는 도약의 해이외다. 지난 2년의 정체가 풀리고 본격적으로 자기 자리를 만들어가는 시기입니다. 단, 너무 빨리 가다 무리할 수 있으니 페이스 조절이 필요하오.",
    goodMonths: "5월, 9월, 12월",
    badMonths: "3월, 7월",
  },
  토끼: {
    overall: "올해는 부드럽지만 분명한 성장의 해이외다. 큰 변동보다 작은 결정들이 쌓여 의미있는 변화를 만듭니다. 사랑과 인연에 좋은 시기입니다.",
    goodMonths: "4월, 7월, 10월",
    badMonths: "1월, 8월",
  },
  용: {
    overall: "올해는 큰 그림을 그릴 해이외다. 지금 시작하는 일이 5년 후 큰 결실이 됩니다. 다만 화려함을 좇다 실속을 놓칠 수 있으니 두 번 점검하소.",
    goodMonths: "3월, 6월, 11월",
    badMonths: "5월, 10월",
  },
  뱀: {
    overall: "올해는 깊이 들어가는 해이외다. 표면이 아닌 본질을 다루는 시기, 지금까지의 경험이 응축되어 직관이 더욱 선명해집니다.",
    goodMonths: "5월, 8월, 11월",
    badMonths: "2월, 6월",
  },
  말: {
    overall: "올해는 멈추지 말고 달릴 해이외다. 한곳에 묶이면 답답해지니 변화를 두려워하지 말고 새 무대로 나가야 합니다.",
    goodMonths: "4월, 7월, 10월",
    badMonths: "1월, 9월",
  },
  양: {
    overall: "올해는 자기 작품을 만드는 해이외다. 창의력과 감수성이 돋보이는 시기, 예술·창작 관련 운이 강하게 들어옵니다.",
    goodMonths: "5월, 9월, 12월",
    badMonths: "3월, 8월",
  },
  원숭이: {
    overall: "올해는 재치가 통하는 해이외다. 어려운 상황에서 길을 찾는 능력이 빛나며, 인간관계에서 새로운 기회가 열립니다.",
    goodMonths: "3월, 7월, 11월",
    badMonths: "5월, 10월",
  },
  닭: {
    overall: "올해는 정직이 보상받는 해이외다. 그동안의 성실함이 누군가에게 인정되어 새로운 자리가 열립니다.",
    goodMonths: "4월, 8월, 12월",
    badMonths: "2월, 6월",
  },
  개: {
    overall: "올해는 의리가 결실로 돌아오는 해이외다. 가까운 사람들과의 관계가 더욱 단단해지며, 함께 일하는 자리에서 운이 강합니다.",
    goodMonths: "3월, 6월, 11월",
    badMonths: "1월, 9월",
  },
  돼지: {
    overall: "올해는 풍요가 따르는 해이외다. 재물과 인연이 함께 들어오는 시기이니 베풀수록 더 많이 들어옵니다.",
    goodMonths: "5월, 9월, 12월",
    badMonths: "2월, 7월",
  },
};

const FINAL_ADVICE_BY_STEM: Record<string, string> = {
  갑: "그대의 뿌리는 깊고 줄기는 곧으나, 가지를 너무 많이 펼치면 뿌리가 흔들리오. 한 길에 깊이 들어갈 때 가장 큰 그늘을 만든다는 것을 잊지 마소.",
  을: "그대는 약한 듯 가장 강한 사람이오. 부드러움이 곧 무기임을 평생 잊지 말고, 자기 결을 따르는 길에서 멈추지 마소.",
  병: "그대의 빛은 모두를 비출 만큼 크오. 다만 자기 그늘 한 평을 남겨두소. 그 그늘 속에서 진짜 자기를 만나게 되오.",
  정: "그대의 빛은 작아 보이나 가장 정확하오. 큰 무대를 욕심내지 마시고 한 사람의 마음을 비추는 일을 평생 하소.",
  무: "그대는 산이외다. 산은 움직이지 않아도 모두가 그 자리에 의지하오. 가끔은 산도 흔들리는 법, 자기 흔들림을 부정하지 마소.",
  기: "그대는 땅이외다. 땅은 모든 것을 받아들이고 키우오. 다만 자기 자신도 키우는 것을 잊지 마소.",
  경: "그대의 칼은 정확하나, 칼은 칼집 안에 있을 때 가장 빛나오. 모든 것을 베지 말고 베어야 할 것만 베소.",
  신: "그대는 보석이외다. 보석은 갈고닦을수록 빛나나, 자기 자신을 너무 깎지는 마소. 적당히 멈추는 법도 배워야 하오.",
  임: "그대는 강물이외다. 흐르는 것이 본성이니 멈추려 하지 마소. 다만 어느 바다로 갈지 가끔은 멈춰서 보는 시간이 필요하오.",
  계: "그대는 빗물이외다. 보이지 않는 곳으로 스며들어 새 생명을 키우는 운명이오. 자기 깊이를 두려워하지 말고 그대로 살아가소.",
};

/* ============================================================================
   Build extended reading by combining stem + dominant + zodiac
   ============================================================================ */

type ExtendedReading = {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  love: { style: string; ideal: string; warning: string; timing: string };
  wealth: string;
  career: { fields: string; talent: string; success: string };
  health: string;
  yearly: { overall: string; goodMonths: string; badMonths: string };
  finalAdvice: string;
};

function buildExtendedReading(saju: SajuResult): ExtendedReading {
  const stem = saju.day.stem.ko;
  const animal = saju.year.branch.animal;
  return {
    overview: OVERVIEW_BY_STEM[stem],
    strengths: STRENGTHS_BY_STEM[stem],
    weaknesses: WEAKNESSES_BY_STEM[stem],
    relationships: RELATIONSHIP_BY_STEM[stem],
    love: LOVE_BY_STEM[stem],
    wealth: WEALTH_BY_STEM[stem],
    career: CAREER_BY_STEM[stem],
    health: HEALTH_BY_DOMINANT[saju.dominant],
    yearly: YEARLY_BY_ZODIAC[animal],
    finalAdvice: FINAL_ADVICE_BY_STEM[stem],
  };
}

/* ============================================================================
   Korean name generation pools (for foreign user flow)
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
  { display: "지후", pronunciation: "Ji-hu" },
  { display: "준우", pronunciation: "Jun-u" },
  { display: "도현", pronunciation: "Do-hyeon" },
  { display: "선우", pronunciation: "Seon-u" },
  { display: "우진", pronunciation: "U-jin" },
  { display: "민재", pronunciation: "Min-jae" },
  { display: "현우", pronunciation: "Hyeon-u" },
  { display: "지훈", pronunciation: "Ji-hun" },
  { display: "준혁", pronunciation: "Jun-hyeok" },
  { display: "승우", pronunciation: "Seung-u" },
  { display: "승민", pronunciation: "Seung-min" },
  { display: "재원", pronunciation: "Jae-won" },
  { display: "한결", pronunciation: "Han-gyeol" },
  { display: "윤호", pronunciation: "Yun-ho" },
  { display: "성민", pronunciation: "Seong-min" },
  { display: "진우", pronunciation: "Jin-u" },
  { display: "태양", pronunciation: "Tae-yang" },
  { display: "건우", pronunciation: "Geon-u" },
  { display: "민혁", pronunciation: "Min-hyeok" },
  { display: "정우", pronunciation: "Jeong-u" },
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
  { display: "민아", pronunciation: "Min-a" },
  { display: "하윤", pronunciation: "Ha-yun" },
  { display: "예나", pronunciation: "Ye-na" },
  { display: "소아", pronunciation: "So-a" },
  { display: "채윤", pronunciation: "Chae-yun" },
  { display: "지은", pronunciation: "Ji-eun" },
  { display: "나연", pronunciation: "Na-yeon" },
  { display: "서윤", pronunciation: "Seo-yun" },
  { display: "유진", pronunciation: "Yu-jin" },
];

function seededIndex(input: string, salt: string, n: number): number {
  if (n <= 0) return 0;
  let seed = 0;
  const s = input.trim() + ":" + salt;
  for (let i = 0; i < s.length; i++) seed = (seed + s.charCodeAt(i)) | 0;
  return Math.abs(seed) % n;
}

function generateKoreanName(input: string, gender: Gender): GeneratedName {
  const pool = gender === "male" ? KO_MALE : KO_FEMALE;
  return pool[seededIndex(input, gender + ":name", pool.length)];
}

/* ============================================================================
   Saju calculation
   Note: Simplified solar-calendar based calculation. For entertainment only —
   real saju uses lunar calendar and solar terms (절기) for boundaries.
   ============================================================================ */

function hourToBranchIdx(hour24: number): number {
  // 자(子) = 23–01 = index 0
  if (hour24 === 23) return 0;
  return Math.floor((hour24 + 1) / 2);
}

function yearGanji(year: number): { ko: string; hanja: string } {
  // Same convention as calcSaju's year-pillar: 4 BCE = 갑자년.
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  const branchIdx = ((year - 4) % 12 + 12) % 12;
  return {
    ko: `${STEMS[stemIdx].ko}${BRANCHES[branchIdx].ko}`,
    hanja: `${STEMS[stemIdx].hanja}${BRANCHES[branchIdx].hanja}`,
  };
}

function calcSaju(
  year: number,
  month: number, // 0-indexed (0 = Jan)
  day: number,
  hour: number | null,
): SajuResult {
  // Year pillar: stems cycle every 10 years, branches every 12.
  // Reference: 4 BCE = 갑자년 (year stem 0, branch 0). So (year - 4) mod gives index.
  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  const yearBranchIdx = ((year - 4) % 12 + 12) % 12;

  // Month pillar (simplified): solar month → branch starting at 寅 for Feb.
  // Jan(0)=丑(1), Feb(1)=寅(2), ..., Dec(11)=子(0)
  const monthBranchIdx = ((month + 1) % 12 + 12) % 12;
  // Month stem: derives from year stem in real saju via 五虎遁. Simplified to:
  const monthStemIdx = ((yearStemIdx * 2 + monthBranchIdx) % 10 + 10) % 10;

  // Day pillar: count days from 1900-01-01 with offsets calibrated so
  // 2024-01-01 → 戊子 (stem index 4, branch index 0), a known reference.
  const epoch = Date.UTC(1900, 0, 1);
  const target = Date.UTC(year, month, day);
  const days = Math.floor((target - epoch) / 86400000);
  const dayStemIdx = ((days + 4) % 10 + 10) % 10;
  const dayBranchIdx = ((days + 10) % 12 + 12) % 12;

  // Hour pillar
  let hourPillar: SajuPillar | null = null;
  if (hour !== null && hour >= 0 && hour <= 23) {
    const hourBranchIdx = hourToBranchIdx(hour);
    // Hour stem: derives from day stem via 五鼠遁. Simplified:
    const hourStemIdx = (((dayStemIdx % 5) * 2 + hourBranchIdx) % 10 + 10) % 10;
    hourPillar = {
      stem: STEMS[hourStemIdx],
      branch: BRANCHES[hourBranchIdx],
    };
  }

  const result: SajuResult = {
    year:  { stem: STEMS[yearStemIdx],  branch: BRANCHES[yearBranchIdx] },
    month: { stem: STEMS[monthStemIdx], branch: BRANCHES[monthBranchIdx] },
    day:   { stem: STEMS[dayStemIdx],   branch: BRANCHES[dayBranchIdx] },
    hour:  hourPillar,
    elementCounts: { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 },
    dominant: "목",
    weakest: "목",
  };

  // Tally elements across stems & branches
  const pillars: SajuPillar[] = [result.year, result.month, result.day];
  if (result.hour) pillars.push(result.hour);
  for (const p of pillars) {
    result.elementCounts[p.stem.element] += 1;
    result.elementCounts[p.branch.element] += 1;
  }
  const entries = Object.entries(result.elementCounts) as [ElementKey, number][];
  result.dominant = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  result.weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];

  return result;
}

/* ============================================================================
   Page
   ============================================================================ */

type Phase =
  | "lang"        // Step 1: Korean or international visitor?
  | "ko-form"     // Step 2A: Korean — name + DOB + time
  | "fr-name"     // Step 2B-1: Foreign — name + gender input
  | "fr-bridge"   // Step 2B-2: Show generated Korean name
  | "fr-form"     // Step 2B-3: DOB + time
  | "result";     // Step 3: Saju reading

type FormState = {
  name: string;
  year: string;
  month: string;
  day: string;
  hour: string;        // "0"–"23" or "" for unknown
  unknownHour: boolean;
};

const TODAY_YEAR = new Date().getFullYear();

export default function SajuPage(): ReactElement {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("lang");
  const [isKorean, setIsKorean] = useState<boolean | null>(null);

  // Foreign-flow inputs
  const [foreignName, setForeignName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [generatedName, setGeneratedName] = useState<GeneratedName | null>(null);

  // Final saju form
  const [form, setForm] = useState<FormState>({
    name: "",
    year: "",
    month: "",
    day: "",
    hour: "",
    unknownHour: false,
  });

  const [result, setResult] = useState<SajuResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset to top on phase change
  useEffect(() => {
    requestAnimationFrame(() => {
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    });
  }, [phase]);

  useEffect(() => {
    if (result) {
      trackResultView("saju", `${result.day.stem.element}-${result.dominant}`);
    }
  }, [result]);

  /* ── Step 1 handlers ─────────────────────────────────────────────────── */

  const pickKorean = useCallback(() => {
    setIsKorean(true);
    setPhase("ko-form");
  }, []);

  const pickForeign = useCallback(() => {
    setIsKorean(false);
    setPhase("fr-name");
  }, []);

  /* ── Foreign flow handlers ───────────────────────────────────────────── */

  const submitForeignName = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (!foreignName.trim() || !gender) return;
      const generated = generateKoreanName(foreignName, gender);
      setGeneratedName(generated);
      setForm((f) => ({ ...f, name: generated.display }));
      setPhase("fr-bridge");
    },
    [foreignName, gender],
  );

  const proceedToFrForm = useCallback(() => {
    setPhase("fr-form");
  }, []);

  /* ── Saju submit ─────────────────────────────────────────────────────── */

  const submitSaju = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const y = parseInt(form.year, 10);
      const m = parseInt(form.month, 10);
      const d = parseInt(form.day, 10);
      const h = form.unknownHour || form.hour === "" ? null : parseInt(form.hour, 10);
      if (
        !form.name.trim() ||
        !Number.isFinite(y) ||
        !Number.isFinite(m) ||
        !Number.isFinite(d) ||
        y < 1900 ||
        y > TODAY_YEAR ||
        m < 1 ||
        m > 12 ||
        d < 1 ||
        d > 31
      ) {
        return;
      }
      const r = calcSaju(y, m - 1, d, h);
      trackTestStart("saju", "Saju Reading");
      setResult(r);
      setPhase("result");
    },
    [form],
  );

  /* ── Reset ───────────────────────────────────────────────────────────── */

  const handleReset = useCallback(() => {
    trackRetryClick("saju", "fortune");
    setPhase("lang");
    setIsKorean(null);
    setForeignName("");
    setGender(null);
    setGeneratedName(null);
    setForm({ name: "", year: "", month: "", day: "", hour: "", unknownHour: false });
    setResult(null);
    setCopied(false);
  }, []);

  /* ── Share ───────────────────────────────────────────────────────────── */

  const onShare = useCallback(async () => {
    if (!result) return;
    trackShareClick("saju", "fortune", `${result.day.stem.element}-${result.dominant}`);
    const reading = DAY_STEM_READINGS[result.day.stem.ko];
    const ext = buildExtendedReading(result);
    // First sentence of the overview as the "타고난 기질" hook.
    const traitLine = ext.overview.split("\n")[0];
    // First sentence of yearly outlook.
    const yearLine = ext.yearly.overall.split(".")[0] + ".";
    const text = t(
      `내 사주풀이 결과:\n` +
        `타고난 기질 — ${traitLine}\n` +
        `올해 운세 — ${yearLine}\n` +
        `→ nolza.fun/games/saju`,
      `My saju reading:\n` +
        `Nature — ${reading.trait}\n` +
        `${new Date().getFullYear()} — ${yearLine}\n` +
        `→ nolza.fun/games/saju`,
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
  }, [result, t]);

  /* ── Step indicator ──────────────────────────────────────────────────── */

  const stepNum =
    phase === "lang" ? 1 :
    phase === "ko-form" ? 2 :
    phase === "fr-name" ? 2 :
    phase === "fr-bridge" ? 3 :
    phase === "fr-form" ? 4 :
    /* result */ (isKorean ? 3 : 5);
  const totalSteps = isKorean === false ? 5 : isKorean === true ? 3 : 3;

  return (
    <main
      style={{
        minHeight: "100svh",
        background: BG,
        color: INK,
        fontFamily: "var(--font-noto-serif-kr), 'Noto Sans KR', serif",
        position: "relative",
        paddingBottom: 100,
        backgroundImage:
          "radial-gradient(circle at 18% 8%, rgba(154,127,255,0.14), transparent 38%)," +
          "radial-gradient(circle at 82% 78%, rgba(185,148,84,0.13), transparent 48%)," +
          "linear-gradient(135deg, rgba(7,8,18,0.98), rgba(18,12,36,0.98))",
        overflow: "hidden",
      }}
    >
      <Starfield />
      <BaguaCorner />
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
          borderRadius: 999,
          fontSize: 22,
          color: ACCENT_DIM,
          textDecoration: "none",
          background: "rgba(10,10,26,0.7)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${RULE}`,
        }}
      >
        ←
      </Link>
      {/* Step indicator */}
      <div
        style={{
          position: "fixed",
          top: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
        aria-label={`Step ${stepNum} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            style={{
              width: n === stepNum ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: n <= stepNum ? ACCENT : "rgba(240,232,216,0.18)",
              transition: "width 0.25s ease, background 0.25s ease",
            }}
          />
        ))}
      </div>

      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "lang" ? "center" : "flex-start",
          padding: "80px 20px 20px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
        }}
      >
        {phase === "lang" && (
          <LanguageStep onPickKorean={pickKorean} onPickForeign={pickForeign} t={t} />
        )}

        {phase === "ko-form" && (
          <SajuForm
            heading={
              <>
                사주를 풀어볼까요?
                <br />
                <span style={{ fontSize: "0.65em", color: SUBTLE }}>
                  Let&apos;s read your saju
                </span>
              </>
            }
            form={form}
            setForm={setForm}
            onSubmit={submitSaju}
            allowName
          />
        )}

        {phase === "fr-name" && (
          <ForeignNameStep
            name={foreignName}
            setName={setForeignName}
            gender={gender}
            setGender={setGender}
            onSubmit={submitForeignName}
          />
        )}

        {phase === "fr-bridge" && generatedName && (
          <BridgeStep
            originalName={foreignName}
            koreanName={generatedName}
            onProceed={proceedToFrForm}
          />
        )}

        {phase === "fr-form" && generatedName && (
          <SajuForm
            heading={
              <>
                <span style={{ color: ACCENT }}>{generatedName.display}</span>
                의 사주
                <br />
                <span style={{ fontSize: "0.65em", color: SUBTLE }}>
                  Reading for {generatedName.display}
                </span>
              </>
            }
            form={form}
            setForm={setForm}
            onSubmit={submitSaju}
            allowName={false}
          />
        )}

        {phase === "result" && result && (
          <ResultView
            name={form.name}
            originalName={!isKorean ? foreignName : null}
            result={result}
            copied={copied}
            onShare={onShare}
            onReset={handleReset}
          />
        )}
      </div>

      <AdMobileSticky />
    </main>
  );
}

/* ============================================================================
   Step 1 — Language / origin
   ============================================================================ */

const SAJU_ENTRY_PARTICLES = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: (index * 37 + 11) % 100,
  top: (index * 53 + 7) % 100,
  size: 2 + (index % 3),
  delay: (index % 7) * -0.85,
  duration: 7 + (index % 5) * 1.4,
}));

function LanguageStep({
  onPickKorean,
  onPickForeign,
  t,
}: {
  onPickKorean: () => void;
  onPickForeign: () => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const choices = [
    {
      key: "korean",
      label: t("네, 한국인이에요", "Yes, I\u2019m Korean"),
      detail: t("바로 사주 리딩으로 들어갈게요.", "Start the reading with your birth details."),
      onClick: onPickKorean,
    },
    {
      key: "international",
      label: t("해외에서 오셨어요", "I\u2019m visiting from abroad"),
      detail: t(
        "먼저 리딩에 어울리는 한국 이름을 만들어드릴게요.",
        "Receive a Korean name for your reading first.",
      ),
      onClick: onPickForeign,
    },
  ];

  return (
    <section
      className="saju-entry"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        display: "grid",
        placeItems: "center",
        padding: "24px 0 44px",
      }}
    >
      <div className="saju-entry__glow" aria-hidden />
      <div className="saju-entry__constellation" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="saju-entry__particles" aria-hidden>
        {SAJU_ENTRY_PARTICLES.map((particle) => (
          <i
            key={particle.id}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div
        className="saju-entry__card"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          overflow: "hidden",
          borderRadius: 32,
          border: "1px solid rgba(232,211,154,0.26)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.035))",
          boxShadow:
            "0 28px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          padding: "clamp(28px, 5.4vw, 44px)",
          textAlign: "center",
        }}
      >
        <div className="saju-entry__halo" aria-hidden>
          <span />
          <span />
        </div>

        <div className="saju-entry__eyebrow">
          {t("별빛 사주 리딩", "CELESTIAL SAJU READING")}
        </div>

        <div className="saju-entry__mark" aria-hidden>
          <span />
          <b />
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 8vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            margin: "14px 0 10px",
            color: "#fff7df",
            textShadow: "0 0 34px rgba(232,211,154,0.22)",
          }}
        >
          {t("한국인이신가요?", "Are you Korean?")}
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 4vw, 18px)",
            color: "rgba(245,240,224,0.72)",
            margin: "0 auto 28px",
            lineHeight: 1.65,
            maxWidth: 420,
            fontFamily: "var(--font-noto-sans-kr), sans-serif",
          }}
        >
          {t("당신에게 맞는 흐름을 선택해주세요.", "Choose the path that fits you.")}
        </p>

        <div className="saju-entry__choices">
          {choices.map((choice) => (
            <button
              key={choice.key}
              type="button"
              onClick={choice.onClick}
              className="saju-entry__choice"
            >
              <span className="saju-entry__choice-orbit" aria-hidden />
              <span>
                <strong>{choice.label}</strong>
                <small>{choice.detail}</small>
              </span>
            </button>
          ))}
        </div>

        <p className="saju-entry__helper">
          {t(
            "해외 방문자는 먼저 사주에 사용할 한국 이름을 만들어드릴게요.",
            "International visitors can receive a Korean name before the reading.",
          )}
        </p>
      </div>

      <style jsx>{`
        .saju-entry__glow {
          position: absolute;
          inset: 10% 4% 0;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 44%, rgba(232, 211, 154, 0.17), transparent 34%),
            radial-gradient(circle at 18% 18%, rgba(126, 99, 255, 0.16), transparent 32%),
            radial-gradient(circle at 82% 72%, rgba(129, 206, 255, 0.12), transparent 34%);
          filter: blur(12px);
          animation: saju-breathe 7s ease-in-out infinite;
        }

        .saju-entry__constellation {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.48;
        }

        .saju-entry__constellation span {
          position: absolute;
          height: 1px;
          width: min(220px, 36vw);
          background: linear-gradient(90deg, transparent, rgba(232, 211, 154, 0.34), transparent);
          transform-origin: center;
        }

        .saju-entry__constellation span:nth-child(1) {
          top: 18%;
          left: 4%;
          transform: rotate(-18deg);
        }

        .saju-entry__constellation span:nth-child(2) {
          top: 22%;
          right: 0;
          transform: rotate(24deg);
        }

        .saju-entry__constellation span:nth-child(3) {
          bottom: 18%;
          left: 18%;
          transform: rotate(9deg);
        }

        .saju-entry__particles i {
          position: absolute;
          z-index: 1;
          display: block;
          border-radius: 999px;
          background: rgba(255, 246, 218, 0.86);
          box-shadow: 0 0 18px rgba(232, 211, 154, 0.42);
          animation: saju-float linear infinite;
          pointer-events: none;
        }

        .saju-entry__card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 0%, rgba(232, 211, 154, 0.14), transparent 42%),
            linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.07) 44%, transparent 55%);
          pointer-events: none;
        }

        .saju-entry__halo {
          position: absolute;
          inset: 26px;
          pointer-events: none;
          opacity: 0.56;
        }

        .saju-entry__halo span {
          position: absolute;
          left: 50%;
          top: 76px;
          width: 174px;
          height: 174px;
          border-radius: 999px;
          border: 1px solid rgba(232, 211, 154, 0.2);
          transform: translateX(-50%);
          animation: saju-orbit 18s linear infinite;
        }

        .saju-entry__halo span:nth-child(2) {
          width: 220px;
          height: 220px;
          border-color: rgba(143, 126, 255, 0.16);
          animation-duration: 28s;
          animation-direction: reverse;
        }

        .saju-entry__eyebrow {
          position: relative;
          z-index: 1;
          color: ${ACCENT};
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .saju-entry__mark {
          position: relative;
          z-index: 1;
          width: 78px;
          height: 78px;
          margin: 20px auto 0;
          border-radius: 999px;
          border: 1px solid rgba(232, 211, 154, 0.42);
          background:
            radial-gradient(circle, rgba(255, 247, 223, 0.92) 0 4px, transparent 5px),
            radial-gradient(circle, rgba(232, 211, 154, 0.2), rgba(255,255,255,0.035) 62%, transparent 64%);
          box-shadow:
            0 0 44px rgba(232, 211, 154, 0.24),
            inset 0 0 24px rgba(255,255,255,0.08);
        }

        .saju-entry__mark span,
        .saju-entry__mark b {
          position: absolute;
          inset: 13px;
          border-radius: 999px;
          border: 1px solid rgba(232, 211, 154, 0.24);
          transform: rotate(28deg) scaleX(1.35);
        }

        .saju-entry__mark b {
          inset: 21px;
          transform: rotate(-38deg) scaleX(1.75);
          border-color: rgba(144, 191, 255, 0.24);
        }

        .saju-entry__choices {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 12px;
          margin: 0 auto;
          max-width: 500px;
        }

        .saju-entry__choice {
          min-height: 74px;
          border: 1px solid rgba(232, 211, 154, 0.25);
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(232, 211, 154, 0.12), rgba(255,255,255,0.045)),
            rgba(8, 9, 22, 0.62);
          color: #fff8e7;
          cursor: pointer;
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 14px;
          align-items: center;
          padding: 16px 18px;
          text-align: left;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
          touch-action: manipulation;
          font-family: var(--font-noto-sans-kr), 'Inter', sans-serif;
        }

        .saju-entry__choice:hover,
        .saju-entry__choice:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(232, 211, 154, 0.62);
          background:
            linear-gradient(135deg, rgba(232, 211, 154, 0.2), rgba(142, 125, 255, 0.08)),
            rgba(8, 9, 22, 0.72);
          box-shadow:
            0 16px 42px rgba(0,0,0,0.32),
            0 0 28px rgba(232,211,154,0.14),
            inset 0 1px 0 rgba(255,255,255,0.18);
          outline: none;
        }

        .saju-entry__choice:active {
          transform: translateY(0);
        }

        .saju-entry__choice-orbit {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid rgba(232, 211, 154, 0.42);
          background: radial-gradient(circle, rgba(232,211,154,0.9) 0 3px, transparent 4px);
          box-shadow: 0 0 20px rgba(232,211,154,0.2);
        }

        .saju-entry__choice strong {
          display: block;
          font-size: clamp(16px, 4vw, 19px);
          line-height: 1.35;
          letter-spacing: 0;
        }

        .saju-entry__choice small {
          display: block;
          margin-top: 5px;
          color: rgba(245,240,224,0.62);
          font-size: 13px;
          line-height: 1.45;
        }

        .saju-entry__helper {
          position: relative;
          z-index: 1;
          margin: 22px auto 0;
          max-width: 430px;
          color: rgba(245,240,224,0.62);
          font-size: 14px;
          line-height: 1.65;
          font-family: var(--font-noto-sans-kr), sans-serif;
        }

        @keyframes saju-breathe {
          0%, 100% { opacity: 0.72; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        @keyframes saju-float {
          0% { opacity: 0; transform: translate3d(0, 16px, 0); }
          18% { opacity: 0.72; }
          100% { opacity: 0; transform: translate3d(8px, -42px, 0); }
        }

        @keyframes saju-orbit {
          from { transform: translateX(-50%) rotate(0deg) scaleX(1.38); }
          to { transform: translateX(-50%) rotate(360deg) scaleX(1.38); }
        }

        @media (max-width: 540px) {
          .saju-entry {
            padding: 12px 0 42px;
          }

          .saju-entry__card {
            border-radius: 26px;
          }

          .saju-entry__choice {
            min-height: 74px;
            border-radius: 18px;
            padding: 14px 15px;
          }

          .saju-entry__halo {
            inset: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .saju-entry__glow,
          .saju-entry__particles i,
          .saju-entry__halo span {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ============================================================================
   Step 2B-1 — Foreign name input
   ============================================================================ */

function ForeignNameStep({
  name,
  setName,
  gender,
  setGender,
  onSubmit,
}: {
  name: string;
  setName: (v: string) => void;
  gender: Gender | null;
  setGender: (g: Gender) => void;
  onSubmit: (e?: FormEvent) => void;
}): ReactElement {
  return (
    <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
      <Eyebrow>STEP 2  ·  먼저 한국 이름을 만들어드릴게요</Eyebrow>
      <h1 style={titleStyle}>What&apos;s your name?</h1>
      <p style={subtitleStyle}>당신의 이름은?</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
        <input
          type="text"
          inputMode="text"
          autoComplete="given-name"
          placeholder="Enter your name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          style={inputStyle}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <GenderTile selected={gender === "male"}    onClick={() => setGender("male")}   emoji="👨" en="Male"   ko="남성" />
          <GenderTile selected={gender === "female"}  onClick={() => setGender("female")} emoji="👩" en="Female" ko="여성" />
        </div>

        <button type="submit" style={{ ...primaryButtonStyle, opacity: name.trim() && gender ? 1 : 0.4 }} disabled={!name.trim() || !gender}>
          GENERATE  ·  생성하기
        </button>
      </form>
    </div>
  );
}

function GenderTile({
  selected,
  onClick,
  emoji,
  en,
  ko,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  en: string;
  ko: string;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected ? PAPER_2 : PAPER,
        border: `1px solid ${selected ? ACCENT : RULE}`,
        borderRadius: 14,
        padding: "16px 12px",
        cursor: "pointer",
        touchAction: "manipulation",
        color: INK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      <span style={{ fontSize: 26 }} aria-hidden>{emoji}</span>
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            letterSpacing: "0.18em",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          {en.toUpperCase()}
        </div>
        <div style={{ fontSize: 14, color: SUBTLE, marginTop: 2 }}>{ko}</div>
      </div>
    </button>
  );
}

/* ============================================================================
   Step 2B-2 — Bridge: show generated Korean name
   ============================================================================ */

function BridgeStep({
  originalName,
  koreanName,
  onProceed,
}: {
  originalName: string;
  koreanName: GeneratedName;
  onProceed: () => void;
}): ReactElement {
  return (
    <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
      <Eyebrow>STEP 3  ·  당신의 한국 이름</Eyebrow>
      <p
        style={{
          fontSize: 15,
          color: SUBTLE,
          marginBottom: 18,
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        &ldquo;{originalName}&rdquo;님의 한국 이름은…
      </p>

      <div
        style={{
          background: PAPER,
          border: `1px solid ${ACCENT}`,
          borderRadius: 24,
          padding: "44px 24px 36px",
          boxShadow: "0 18px 60px rgba(255,215,0,0.12)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: "clamp(48px, 13vw, 80px)",
            fontWeight: 700,
            lineHeight: 1.05,
            color: ACCENT,
            letterSpacing: "-0.02em",
            textShadow: "0 0 40px rgba(255,215,0,0.3)",
          }}
        >
          {koreanName.display}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: SUBTLE,
            letterSpacing: "0.05em",
          }}
        >
          &ldquo;{koreanName.pronunciation}&rdquo;
        </div>
      </div>

      <button type="button" onClick={onProceed} style={primaryButtonStyle}>
        이 이름으로 사주 보기  ·  READ MY SAJU
      </button>

      <p
        style={{
          marginTop: 18,
          fontSize: 13,
          color: "rgba(240,232,216,0.4)",
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        다음 단계에서 생년월일과 시간을 입력해주세요
      </p>
    </div>
  );
}

/* ============================================================================
   Saju form (used by both Korean and foreign flows)
   ============================================================================ */

function SajuForm({
  heading,
  form,
  setForm,
  onSubmit,
  allowName,
}: {
  heading: React.ReactNode;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e?: FormEvent) => void;
  allowName: boolean;
}): ReactElement {
  return (
    <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
      <Eyebrow>{allowName ? "STEP 2" : "STEP 4"}  ·  생년월일과 시간</Eyebrow>
      <h1 style={titleStyle}>{heading}</h1>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24, textAlign: "left" }}>
        {allowName && (
          <Field label="이름  ·  Name">
            <input
              type="text"
              inputMode="text"
              autoComplete="given-name"
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={20}
              style={inputStyle}
            />
          </Field>
        )}

        <Field label="생년월일  ·  Date of Birth">
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr 0.9fr", gap: 8 }}>
            <input
              type="number"
              inputMode="numeric"
              placeholder="YYYY"
              min={1900}
              max={TODAY_YEAR}
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value.replace(/[^\d]/g, "") }))}
              style={inputStyle}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="MM"
              min={1}
              max={12}
              value={form.month}
              onChange={(e) => setForm((f) => ({ ...f, month: e.target.value.replace(/[^\d]/g, "") }))}
              style={inputStyle}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="DD"
              min={1}
              max={31}
              value={form.day}
              onChange={(e) => setForm((f) => ({ ...f, day: e.target.value.replace(/[^\d]/g, "") }))}
              style={inputStyle}
            />
          </div>
        </Field>

        <Field label="태어난 시간  ·  Birth Hour">
          <HourPicker
            value={form.unknownHour ? "" : form.hour}
            disabled={form.unknownHour}
            onChange={(hour) =>
              setForm((f) => ({
                ...f,
                hour,
                unknownHour: hour === "" ? f.unknownHour : false,
              }))
            }
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              fontSize: 15,
              color: SUBTLE,
              cursor: "pointer",
              fontFamily: "var(--font-noto-sans-kr), sans-serif",
            }}
          >
            <input
              type="checkbox"
              checked={form.unknownHour}
              onChange={(e) =>
                setForm((f) => ({ ...f, unknownHour: e.target.checked }))
              }
              style={{ accentColor: ACCENT }}
            />
            시간을 모르겠어요  ·  Unknown
          </label>
        </Field>

        <button
          type="submit"
          style={{
            ...primaryButtonStyle,
            marginTop: 8,
            opacity:
              form.year && form.month && form.day && (form.unknownHour || form.hour) && (allowName ? form.name.trim() : true)
                ? 1
                : 0.4,
          }}
          disabled={
            !form.year ||
            !form.month ||
            !form.day ||
            !(form.unknownHour || form.hour) ||
            (allowName && !form.name.trim())
          }
        >
          🔮  사주 보기  ·  READ MY FORTUNE
        </button>
      </form>

      <p
        style={{
          marginTop: 18,
          fontSize: 13,
          color: "rgba(240,232,216,0.35)",
          lineHeight: 1.6,
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        ※ 양력 기준 간이 계산. 정밀 풀이는 음력·절기를 반영해야 합니다 — 재미로 보세요
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): ReactElement {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          letterSpacing: "0.18em",
          color: ACCENT_DIM,
          fontWeight: 700,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function HourPicker({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (hour: string) => void;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const options = BRANCHES.map((branch, index) => {
    const hourCenter = index === 0 ? 0 : index * 2 - 1;
    return {
      value: String(hourCenter),
      label: `${branch.hourRange} · ${branch.ko}시 (${branch.animal} ${branch.emoji})`,
    };
  });
  const selected = options.find((option) => option.value === value);

  return (
    <div ref={pickerRef} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        style={{
          ...inputStyle,
          width: "100%",
          minHeight: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          color: selected ? INK : "rgba(245,240,224,0.48)",
        }}
      >
        <span>{selected?.label ?? "시간을 선택하세요"}</span>
        <span
          aria-hidden
          style={{
            color: ACCENT,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
        >
          ▾
        </span>
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            maxHeight: 260,
            overflowY: "auto",
            padding: 6,
            border: `1px solid ${RULE}`,
            borderRadius: 16,
            background: "#111321",
            boxShadow: "0 18px 42px rgba(0,0,0,0.38)",
          }}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  minHeight: 42,
                  padding: "10px 12px",
                  border: 0,
                  borderRadius: 12,
                  background: active ? PAPER_2 : "transparent",
                  color: active ? ACCENT : INK,
                  textAlign: "left",
                  fontFamily: "var(--font-noto-sans-kr), sans-serif",
                  fontSize: 14,
                  fontWeight: active ? 800 : 600,
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Result view
   ============================================================================ */

/* ============================================================================
   Atmospheric backdrop — starfield + 팔괘
   ============================================================================ */

function Starfield(): ReactElement {
  // Deterministic star positions so SSR matches client.
  const stars = useMemo(() => {
    const arr: { x: number; y: number; r: number; o: number }[] = [];
    let s = 12345;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < 80; i++) {
      arr.push({
        x: rand() * 100,
        y: rand() * 100,
        r: 0.3 + rand() * 1.2,
        o: 0.2 + rand() * 0.6,
      });
    }
    return arr;
  }, []);
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        opacity: 0.4,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r * 0.15}
            fill={ACCENT}
            opacity={s.o * 0.4}
          />
        ))}
      </svg>
    </div>
  );
}

function BaguaCorner(): ReactElement {
  // Eight trigrams arranged in a faint ring at top.
  const TRIGRAMS = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 0,
        display: "flex",
        gap: 14,
        opacity: 0.08,
        pointerEvents: "none",
        fontFamily: "serif",
        fontSize: 26,
        color: ACCENT,
        letterSpacing: "0.2em",
      }}
    >
      {TRIGRAMS.map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </div>
  );
}

function ResultView({
  name,
  originalName,
  result,
  copied,
  onShare,
  onReset,
}: {
  name: string;
  originalName: string | null;
  result: SajuResult;
  copied: boolean;
  onShare: () => void;
  onReset: () => void;
}): ReactElement {
  const { locale } = useLocale();
  const showEn = locale !== "ko";
  const dayReading = DAY_STEM_READINGS[result.day.stem.ko];
  const yearAnimal = result.year.branch.animal;
  const zodiacBrief = ZODIAC_BRIEF[yearAnimal] ?? "";
  const dominantInfo = ELEMENT_INFO[result.dominant];
  const weakestInfo = ELEMENT_INFO[result.weakest];

  return (
    <ShareCard
      filename={`nolza-saju-${name}`}
      locale={locale}
      backgroundColor={BG}
      buttonLabel={{ ko: "사주 이미지 저장", en: "Save saju image" }}
      buttonStyle={{
        padding: "12px 22px",
        borderRadius: 999,
        border: `1px solid ${ACCENT}`,
        background: "transparent",
        color: ACCENT,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.18em",
        cursor: "pointer",
        minHeight: 44,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {({ cardRef }) => (
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div ref={cardRef} style={{ background: BG, padding: "4px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Eyebrow>SAJU READING</Eyebrow>
        <h1 style={{ ...titleStyle, color: ACCENT }}>{name}</h1>
        {originalName && (
          <p
            style={{
              fontSize: 15,
              color: SUBTLE,
              marginTop: 4,
              fontFamily: "var(--font-noto-sans-kr), sans-serif",
            }}
          >
            ({originalName})
          </p>
        )}
        <p style={{ ...subtitleStyle, marginTop: 8 }}>의 사주</p>
      </div>

      {/* Four pillars */}
      <div
        style={{
          background: PAPER,
          border: `1px solid ${ACCENT}`,
          borderRadius: 22,
          padding: "26px 16px 22px",
          boxShadow: "0 18px 50px rgba(255,215,0,0.1)",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            letterSpacing: "0.32em",
            color: ACCENT_DIM,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          四柱 · FOUR PILLARS
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 6,
          }}
        >
          <PillarCol label="시(時)" labelEn="Hour"  pillar={result.hour} dim={!result.hour} />
          <PillarCol label="일(日)" labelEn="Day"   pillar={result.day} highlight />
          <PillarCol label="월(月)" labelEn="Month" pillar={result.month} />
          <PillarCol label="년(年)" labelEn="Year"  pillar={result.year} />
        </div>
      </div>

      {/* Day stem (most important) */}
      <Section title="일간(日干) — 당신의 본질" en="Your Day Stem">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background: ELEMENT_INFO[result.day.stem.element].color + "33",
              border: `1px solid ${ELEMENT_INFO[result.day.stem.element].color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontFamily: "var(--font-noto-serif-kr), serif",
              fontWeight: 700,
              color: ACCENT,
            }}
          >
            {result.day.stem.hanja}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>
              {result.day.stem.ko} ({result.day.stem.hanja}) ·{" "}
              {ELEMENT_INFO[result.day.stem.element].emoji}{" "}
              {ELEMENT_INFO[result.day.stem.element].en}
            </div>
            <div style={{ fontSize: 14, color: SUBTLE, marginTop: 2 }}>
              {result.day.stem.yinyang} · {result.day.stem.element}({ELEMENT_INFO[result.day.stem.element].hanja})의 기운
            </div>
          </div>
        </div>
        <p style={{ fontSize: 16, color: INK, lineHeight: 1.7 }}>{dayReading.trait}</p>
        <p style={{ fontSize: 15, color: SUBTLE, lineHeight: 1.7, marginTop: 8 }}>
          💡 {dayReading.advice}
        </p>
      </Section>

      {/* Five elements balance */}
      <Section title="오행 균형" en="Five Elements Balance">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {(Object.keys(ELEMENT_INFO) as ElementKey[]).map((key) => {
            const info = ELEMENT_INFO[key];
            const count = result.elementCounts[key];
            const max = Math.max(...Object.values(result.elementCounts), 1);
            return (
              <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 24 }} aria-hidden>{info.emoji}</div>
                <div style={{ fontSize: 13, color: ACCENT, fontWeight: 700 }}>
                  {info.ko}({info.hanja})
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 60,
                    background: "rgba(240,232,216,0.06)",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "flex-end",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${(count / max) * 100}%`,
                      background: info.color,
                      transition: "height 0.6s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: 13, color: SUBTLE, fontFamily: "'Inter', sans-serif" }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 15, color: INK, lineHeight: 1.7, marginTop: 14 }}>
          {dominantInfo.emoji} <strong style={{ color: ACCENT }}>{dominantInfo.ko}({dominantInfo.hanja})</strong>의 기운이 가장 강합니다.{" "}
          {weakestInfo.emoji} <strong style={{ color: SUBTLE }}>{weakestInfo.ko}({weakestInfo.hanja})</strong>은(는) 보완이 필요해요.
        </p>
      </Section>

      {/* Zodiac */}
      <Section title="띠 — 태어난 해의 동물" en="Your Zodiac Animal">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 48 }} aria-hidden>
            {result.year.branch.emoji}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>
              {yearAnimal}띠 · {result.year.branch.animalEn}
            </div>
            <div style={{ fontSize: 14, color: SUBTLE, marginTop: 2 }}>
              {result.year.stem.ko}{result.year.branch.ko}년 ·{" "}
              {result.year.stem.hanja}{result.year.branch.hanja}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 16, color: INK, lineHeight: 1.7, marginTop: 10 }}>
          {zodiacBrief}
        </p>
      </Section>

      {/* Lucky data */}
      <Section title="행운 정보" en="Lucky">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <Lucky label="행운의 색" en="Color"     value={dayReading.luckyColor} />
          <Lucky label="행운의 방위" en="Direction" value={dayReading.luckyDirection} />
          <Lucky label="행운의 숫자" en="Number"    value={dayReading.luckyNumber} />
        </div>
      </Section>

      {/* ── Extended reading ─────────────────────────────────────── */}
      <ExtendedSections result={result} />
          </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 28,
        }}
      >
        <button type="button" onClick={onShare} style={primaryButtonStyle}>
          {copied ? "COPIED" : "공유  ·  SHARE"}
        </button>
        <button type="button" onClick={onReset} style={secondaryButtonStyle}>
          ↺ 다시 보기
        </button>
      </div>
        </div>
      )}
    </ShareCard>
  );
}

function PillarCol({
  label,
  labelEn,
  pillar,
  highlight = false,
  dim = false,
}: {
  label: string;
  labelEn: string;
  pillar: SajuPillar | null;
  highlight?: boolean;
  dim?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        textAlign: "center",
        opacity: dim ? 0.35 : 1,
        background: highlight ? "rgba(255,215,0,0.06)" : "transparent",
        borderRadius: 10,
        padding: "8px 4px",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: highlight ? ACCENT : ACCENT_DIM,
          fontWeight: 700,
          marginBottom: 8,
          fontFamily: "var(--font-noto-serif-kr), serif",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 9,
          color: SUBTLE,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.18em",
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        {labelEn}
      </div>
      {pillar ? (
        <>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: ACCENT,
              fontFamily: "var(--font-noto-serif-kr), serif",
              lineHeight: 1,
              textShadow: "0 0 16px rgba(255,215,0,0.25)",
            }}
          >
            {pillar.stem.hanja}
          </div>
          <div style={{ fontSize: 13, color: SUBTLE, marginTop: 2 }}>
            {pillar.stem.ko}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: INK,
              fontFamily: "var(--font-noto-serif-kr), serif",
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            {pillar.branch.hanja}
          </div>
          <div style={{ fontSize: 13, color: SUBTLE, marginTop: 2 }}>
            {pillar.branch.ko} {pillar.branch.emoji}
          </div>
        </>
      ) : (
        <div
          style={{
            fontSize: 24,
            color: SUBTLE,
            fontFamily: "var(--font-noto-serif-kr), serif",
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          —
        </div>
      )}
    </div>
  );
}

function ExtendedSections({ result }: { result: SajuResult }): ReactElement {
  const { locale } = useLocale();
  const showEn = locale !== "ko";
  const ext = useMemo(() => buildExtendedReading(result), [result]);

  return (
    <>
      {/* 총운 */}
      <Section title="총운(總運) — 운명의 큰 흐름" en="OVERVIEW">
        <Paragraph text={ext.overview} />
      </Section>

      {/* 성격과 기질 */}
      <Section title="성격과 기질(性格)" en="CHARACTER">
        <SubLabel>장점</SubLabel>
        <BulletList items={ext.strengths} dot={ACCENT} />
        <SubLabel style={{ marginTop: 16 }}>단점</SubLabel>
        <BulletList items={ext.weaknesses} dot={CRIMSON} />
        <SubLabel style={{ marginTop: 16 }}>대인관계</SubLabel>
        <Paragraph text={ext.relationships} />
      </Section>

      {/* 애정운 */}
      <Section title="애정운(愛情運)" en="LOVE">
        <SubLabel>연애 스타일</SubLabel>
        <Paragraph text={ext.love.style} />
        <SubLabel style={{ marginTop: 14 }}>이상형</SubLabel>
        <Paragraph text={ext.love.ideal} />
        <SubLabel style={{ marginTop: 14 }}>주의할 점</SubLabel>
        <Paragraph text={ext.love.warning} />
        <SubLabel style={{ marginTop: 14 }}>좋은 인연의 시기</SubLabel>
        <Paragraph text={ext.love.timing} />
      </Section>

      {/* 재물운 */}
      <Section title="재물운(財運)" en="WEALTH">
        <Paragraph text={ext.wealth} />
      </Section>

      {/* 직업운 */}
      <Section title="직업·적성운(職業運)" en="CAREER">
        <SubLabel>잘 맞는 분야</SubLabel>
        <Paragraph text={ext.career.fields} />
        <SubLabel style={{ marginTop: 14 }}>타고난 재능</SubLabel>
        <Paragraph text={ext.career.talent} />
        <SubLabel style={{ marginTop: 14 }}>성공의 방향</SubLabel>
        <Paragraph text={ext.career.success} />
      </Section>

      {/* 건강운 */}
      <Section title="건강운(健康運)" en="HEALTH">
        <Paragraph text={ext.health} />
      </Section>

      {/* 올해 운세 (자동 갱신) */}
      <Section
        title={(() => {
          const y = new Date().getFullYear();
          const g = yearGanji(y);
          return `${g.ko}년 운세 (${y})`;
        })()}
        en="THIS YEAR"
      >
        <Paragraph text={ext.yearly.overall} />
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <div
            style={{
              background: "rgba(255,215,0,0.06)",
              border: `1px solid ${RULE}`,
              borderRadius: 8,
              padding: "12px 12px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: ACCENT,
                letterSpacing: "0.32em",
                fontWeight: 700,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {showEn ? "GOOD MONTHS" : "좋은 달"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-serif-kr), serif",
                fontSize: 16,
                color: INK,
                fontWeight: 600,
              }}
            >
              ☼ {ext.yearly.goodMonths}
            </div>
          </div>
          <div
            style={{
              background: "rgba(139,0,0,0.12)",
              border: `1px solid rgba(139,0,0,0.4)`,
              borderRadius: 8,
              padding: "12px 12px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#ff8888",
                letterSpacing: "0.32em",
                fontWeight: 700,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {showEn ? "BE CAREFUL" : "주의할 달"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-serif-kr), serif",
                fontSize: 16,
                color: INK,
                fontWeight: 600,
              }}
            >
              ☾ {ext.yearly.badMonths}
            </div>
          </div>
        </div>
      </Section>

      {/* 인생 조언 */}
      <Section title="인생의 한마디(訓)" en="LIFE ADVICE">
        <div
          style={{
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: 17,
            color: INK,
            lineHeight: 1.95,
            fontStyle: "italic",
            borderLeft: `2px solid ${ACCENT}`,
            paddingLeft: 16,
            wordBreak: "keep-all",
          }}
        >
          {ext.finalAdvice}
        </div>
      </Section>
    </>
  );
}

function Paragraph({ text }: { text: string }): ReactElement {
  return (
    <p
      style={{
        fontFamily: "var(--font-noto-serif-kr), serif",
        fontSize: 15.5,
        color: INK,
        lineHeight: 1.9,
        whiteSpace: "pre-wrap",
        wordBreak: "keep-all",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}

function SubLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}): ReactElement {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 10,
        letterSpacing: "0.32em",
        color: ACCENT_DEEP,
        fontWeight: 700,
        marginBottom: 8,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BulletList({
  items,
  dot,
}: {
  items: string[];
  dot: string;
}): ReactElement {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: 15,
            color: INK,
            lineHeight: 1.75,
            wordBreak: "keep-all",
          }}
        >
          <span
            aria-hidden
            style={{
              color: dot,
              fontWeight: 700,
              flexShrink: 0,
              paddingTop: 2,
            }}
          >
            ◆
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  en,
  children,
}: {
  title: string;
  en: string;
  children: React.ReactNode;
}): ReactElement {
  const { locale } = useLocale();
  const showEn = locale !== "ko";
  return (
    <div
      style={{
        background: PAPER,
        border: `1px solid ${RULE}`,
        borderRadius: 18,
        padding: "20px 18px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: 15,
            fontWeight: 700,
            color: ACCENT,
          }}
        >
          {title}
        </div>
        {showEn && (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: "0.2em",
              color: ACCENT_DIM,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {en}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Lucky({
  label,
  en,
  value,
}: {
  label: string;
  en: string;
  value: string;
}): ReactElement {
  const { locale } = useLocale();
  const showEn = locale !== "ko";
  return (
    <div
      style={{
        background: "rgba(255,215,0,0.05)",
        border: `1px solid ${RULE}`,
        borderRadius: 12,
        padding: "12px 10px",
        textAlign: "center",
      }}
    >
      {showEn && (
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 9,
            color: ACCENT_DIM,
            letterSpacing: "0.18em",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {en}
        </div>
      )}
      <div style={{ fontSize: 13, color: SUBTLE, marginBottom: 6 }}>{label}</div>
      <div
        style={{
          fontFamily: "var(--font-noto-serif-kr), serif",
          fontSize: 16,
          fontWeight: 700,
          color: ACCENT,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================================================================
   Shared styles & UI helpers
   ============================================================================ */

const titleStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
  marginBottom: 6,
  marginTop: 10,
  color: ACCENT,
  fontFamily: "var(--font-noto-serif-kr), serif",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 16,
  color: SUBTLE,
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const inputStyle: React.CSSProperties = {
  background: PAPER,
  color: INK,
  border: `1px solid ${RULE}`,
  borderRadius: 12,
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  width: "100%",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #fff1bd 0%, #d7b56e 48%, #95713a 100%)",
  color: "#080914",
  border: "1px solid rgba(255,255,255,0.24)",
  padding: "18px 32px",
  borderRadius: 999,
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: "0.16em",
  cursor: "pointer",
  touchAction: "manipulation",
  boxShadow:
    "0 16px 42px rgba(185,148,84,0.24), inset 0 1px 0 rgba(255,255,255,0.45)",
  fontFamily: "'Inter', sans-serif",
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  color: INK,
  border: `1px solid ${RULE}`,
  padding: "18px 32px",
  borderRadius: 999,
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: "0.16em",
  cursor: "pointer",
  touchAction: "manipulation",
  fontFamily: "'Inter', sans-serif",
  backdropFilter: "blur(10px)",
};

function Eyebrow({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div
      style={{
        color: ACCENT,
        fontSize: 14,
        letterSpacing: "0.24em",
        fontWeight: 700,
        marginBottom: 12,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </div>
  );
}
