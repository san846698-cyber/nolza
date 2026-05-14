"use client";

import Link from "next/link";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactElement,
} from "react";
import { AdBottom } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Loc = "ko" | "en";
type RoleStyle = "female" | "male" | "random" | "neutral";
type PersonKey = "first" | "second";

type ProtagonistInput = {
  name: string;
  role: RoleStyle;
};

type RoleOption = {
  value: RoleStyle;
  ko: string;
  en: string;
  hintKo: string;
  hintEn: string;
};

type CharacterRole = {
  title: string;
  line: string;
  tag: string;
};

type DramaResult = {
  title: string;
  score: number;
  genre: string;
  relationship: string;
  trailerHook: string;
  synopsis: string;
  viewingPoints: string[];
  dynamicFlavor: string;
  firstRole: CharacterRole;
  secondRole: CharacterRole;
  firstMeeting: string;
  conflict: string;
  famousLine: string;
  viewerComments: string[];
  endingTeaser: string;
  shipReason: string;
  shareSummary: string;
};

const BG = "#080609";
const PANEL = "rgba(255,255,255,0.055)";
const PANEL_STRONG = "rgba(255,255,255,0.09)";
const INK = "#fff8f4";
const SUBTLE = "rgba(255,248,244,0.68)";
const MUTED = "rgba(255,248,244,0.48)";
const ROSE = "#f2c6bd";
const ROSE_STRONG = "#ffded8";
const ROSE_DIM = "rgba(242,198,189,0.28)";
const LINE = "rgba(242,198,189,0.16)";
const SANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "female",
    ko: "여성",
    en: "Female",
    hintKo: "여주/여성 캐릭터 톤",
    hintEn: "Female lead energy",
  },
  {
    value: "male",
    ko: "남성",
    en: "Male",
    hintKo: "남주/남성 캐릭터 톤",
    hintEn: "Male lead energy",
  },
  {
    value: "random",
    ko: "상관없음 / 랜덤",
    en: "Random",
    hintKo: "성별 고정 없이 드라마틱하게",
    hintEn: "Playful, not fixed",
  },
  {
    value: "neutral",
    ko: "중립",
    en: "Neutral",
    hintKo: "성별 없는 캐릭터/세계관 역할",
    hintEn: "Neutral story role",
  },
];

const FEMALE_ROLES: CharacterRole[] = [
  {
    title: "재벌가에 휘말린 평범한 주인공",
    line: "평범하게 살고 싶었는데, 이상하게 회장님 집안 비밀의 중심에 서게 됩니다.",
    tag: "생활력 만렙 여주",
  },
  {
    title: "전생을 기억하는 신비로운 인물",
    line: "처음 만난 얼굴인데도 자꾸 오래전 약속이 떠오르는 사람입니다.",
    tag: "전생 서사 담당",
  },
  {
    title: "차갑지만 상처 많은 상속녀",
    line: "말은 차갑게 하는데, 혼자 있을 때는 누구보다 오래 흔들립니다.",
    tag: "냉온차 반전",
  },
  {
    title: "모든 걸 알고 있는 첫사랑",
    line: "한 번 웃으면 과거 회상 3회분이 자동으로 열리는 존재입니다.",
    tag: "첫사랑 재등장",
  },
  {
    title: "운명을 바꾸는 작가",
    line: "자기가 쓴 문장이 현실이 되는 바람에 사랑도 장르도 통제 불가가 됩니다.",
    tag: "세계관 조작자",
  },
  {
    title: "시간을 건너온 인물",
    line: "미래를 조금 알고 있지만, 마음만큼은 매번 예측에 실패합니다.",
    tag: "타임슬립 핵심",
  },
];

const MALE_ROLES: CharacterRole[] = [
  {
    title: "냉미남 재벌 3세",
    line: "표정은 영하 12도인데, 좋아하는 사람 앞에서는 카드보다 우산을 먼저 꺼냅니다.",
    tag: "대표님 계열",
  },
  {
    title: "상처 많은 검사",
    line: "정의감으로 버티지만, 사실 가장 오래 숨긴 사건은 자기 마음입니다.",
    tag: "법정 멜로",
  },
  {
    title: "천년을 산 도깨비",
    line: "오래 산 만큼 이별도 많이 겪었고, 그래서 이번 사랑이 더 무섭습니다.",
    tag: "불멸 서사",
  },
  {
    title: "기억을 잃은 왕세자",
    line: "현대에 떨어져도 말투만큼은 사극 16부작을 놓지 못합니다.",
    tag: "궁중 타임슬립",
  },
  {
    title: "과거를 숨긴 보디가드",
    line: "지키는 일은 잘하지만, 정작 자기 마음은 방어에 실패합니다.",
    tag: "경호 로맨스",
  },
  {
    title: "첫사랑을 못 잊은 남자주인공",
    line: "잊었다고 말하는 장면마다 OST가 더 크게 깔리는 타입입니다.",
    tag: "미련 남주",
  },
  {
    title: "인간이 되고 싶은 신비로운 존재",
    line: "사람처럼 살고 싶었는데, 사랑 때문에 진짜 사람이 되고 싶어집니다.",
    tag: "판타지 남주",
  },
];

const NEUTRAL_ROLES: CharacterRole[] = [
  {
    title: "시간을 건너온 존재",
    line: "시대가 바뀌어도 이상하게 같은 사람에게 계속 도착합니다.",
    tag: "시간 이탈자",
  },
  {
    title: "운명을 기록하는 인물",
    line: "남의 결말은 다 아는데, 자기 마음의 다음 회차만 모릅니다.",
    tag: "운명 기록자",
  },
  {
    title: "전생의 기억을 가진 사람",
    line: "처음 보는 사람에게서 오래된 계절의 냄새를 알아차립니다.",
    tag: "기억 보유자",
  },
  {
    title: "비밀을 숨긴 동거인",
    line: "같은 집에 살게 된 건 계약이었지만, 감정은 계약서에 없었습니다.",
    tag: "동거 계약",
  },
  {
    title: "세계관의 균형을 깨는 인물",
    line: "등장하는 순간부터 주변 인물의 계획과 시청자의 심박수를 동시에 망칩니다.",
    tag: "변수 그 자체",
  },
  {
    title: "계약 관계에서 시작된 운명",
    line: "처음엔 조건이 중요했는데, 6화쯤 되면 조건보다 눈빛이 더 위험해집니다.",
    tag: "계약 서사",
  },
];

const GENRES = [
  "판타지 로맨스",
  "오피스 로맨스",
  "재벌가 멜로",
  "타임슬립 로맨스",
  "법정 멜로",
  "힐링 청춘물",
  "미스터리 로맨스",
  "계약 동거 로코",
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(items: T[], seed: string, salt: string): T {
  return items[hashStr(`${seed}:${salt}`) % items.length];
}

function displayName(name: string, fallback: string): string {
  const trimmed = name.trim();
  return trimmed || fallback;
}

function rolePool(role: RoleStyle, seed: string): CharacterRole[] {
  if (role === "female") return FEMALE_ROLES;
  if (role === "male") return MALE_ROLES;
  if (role === "neutral") return NEUTRAL_ROLES;

  const mode = hashStr(seed) % 3;
  if (mode === 0) return NEUTRAL_ROLES;
  if (mode === 1) return FEMALE_ROLES;
  return MALE_ROLES;
}

function roleLabel(role: RoleStyle, loc: Loc): string {
  const option = ROLE_OPTIONS.find((item) => item.value === role) ?? ROLE_OPTIONS[2];
  return loc === "ko" ? option.ko : option.en;
}

function relationshipFor(a: ProtagonistInput, b: ProtagonistInput, seed: string): string {
  const sameKnown = a.role === b.role && (a.role === "male" || a.role === "female");
  const hasNeutral = a.role === "neutral" || b.role === "neutral";
  const hasRandom = a.role === "random" || b.role === "random";

  if (sameKnown) {
    return pick(
      [
        "서로를 제일 잘 이해해서 더 자주 싸우는 운명 공동체",
        "친구인 척 시작했지만 눈빛으로 이미 장르가 바뀐 관계",
        "세상은 둘을 설명하지 못하지만 시청자는 2화부터 확신한 관계",
      ],
      seed,
      "same-known",
    );
  }

  if (hasNeutral) {
    return pick(
      [
        "계약서에는 없었지만 세계관이 강제로 밀어주는 운명",
        "정체보다 마음이 먼저 들켜버린 미스터리 로맨스",
        "서로의 비밀을 알게 된 뒤부터 안전거리가 사라진 관계",
      ],
      seed,
      "neutral-relation",
    );
  }

  if (hasRandom) {
    return pick(
      [
        "랜덤처럼 보였지만 작가가 1화부터 복선을 깔아둔 관계",
        "처음엔 최악의 조합인데 댓글창이 먼저 알아본 케미",
        "장르가 갈피를 못 잡을수록 더 맛있어지는 관계",
      ],
      seed,
      "random-relation",
    );
  }

  return pick(
    [
      "서로를 최악이라고 생각하지만 6화쯤 시청자가 결혼 날짜를 잡는 관계",
      "말은 안 통하는데 눈빛으로 12부작을 끌고 가는 관계",
      "오해로 시작해서 구원 서사로 끝나는 정통 K-드라마 관계",
    ],
    seed,
    "classic-relation",
  );
}

function buildTitle(a: string, b: string, seed: string): string {
  const titles = [
    `${a}와 ${b}의 운명 편성표`,
    `${a}와 ${b}: 비가 오면 시작되는 장면`,
    `${a}와 ${b}의 12부작 계약서`,
    `${a}와 ${b}, 그해의 OST`,
    `${a}와 ${b}: 다음 생에도 1화`,
    `${a}와 ${b}의 눈빛 재방송`,
  ];
  return pick(titles, seed, "title");
}

function buildFirstMeeting(a: string, b: string, result: DramaResultDraft, seed: string): string {
  return pick(
    [
      `${a}는 비 오는 횡단보도에서 ${b}의 휴대폰을 대신 주워줍니다. 첫 만남은 재난에 가까웠지만, 이상하게도 그 순간부터 OST가 깔리기 시작합니다.`,
      `${a}와 ${b}는 잘못 배달된 계약서 한 장 때문에 같은 장소에 불려옵니다. 둘 다 "말도 안 돼"라고 하지만 카메라는 이미 슬로모션을 켭니다.`,
      `${a}는 엘리베이터 정전 속에서 ${b}와 갇힙니다. 대화는 삐걱대는데, 비상등 아래 눈빛만큼은 과하게 선명합니다.`,
      `${a}가 가장 숨기고 싶은 순간을 ${b}가 정확히 목격합니다. 최악의 타이밍인데, 시청자는 그게 첫 장면이라는 걸 압니다.`,
    ],
    seed + result.genre,
    "meeting",
  );
}

type DramaResultDraft = {
  genre: string;
  relationship: string;
};

function buildConflict(a: string, b: string, firstRole: CharacterRole, secondRole: CharacterRole, seed: string): string {
  return pick(
    [
      `${firstRole.tag}인 ${a}의 비밀과 ${secondRole.tag}인 ${b}의 선택이 정면으로 부딪힙니다. 둘 다 상대를 지키려다 상대에게 제일 큰 상처를 줍니다.`,
      `${a}는 떠나야 안전하고, ${b}는 붙잡아야 후회하지 않습니다. 문제는 두 사람 모두 말을 예쁘게 못 해서 9화 내내 시청자가 답답해진다는 점입니다.`,
      `중반부에는 과거의 오해가 터집니다. ${a}는 설명을 포기하고, ${b}는 모른 척하려 하지만 눈빛이 너무 정직합니다.`,
      `${a}와 ${b}는 같은 목표를 향해 가지만 방법이 완전히 다릅니다. 그래서 싸울 때마다 장면은 예쁘고 댓글창은 난리 납니다.`,
    ],
    seed,
    "conflict",
  );
}

function buildFamousLine(a: string, b: string, seed: string): string {
  return pick(
    [
      `${a}: "나는 너를 피하려고 했는데, 장면마다 네가 있었어."`,
      `${b}: "이게 우연이면, 우연도 너무 성실한 거 아니야?"`,
      `${a}: "나한테 오지 마. 근데 정말 안 오면 나 무너져."`,
      `${b}: "우리가 말이 안 되는 건 아는데, 그래서 더 기억나."`,
      `${a}: "이번 생에서 안 되면, 다음 회차라도 잡을게."`,
    ],
    seed,
    "line",
  );
}

function buildShipReason(a: string, b: string, seed: string): string {
  return pick(
    [
      `${a}와 ${b}는 대화보다 침묵이 더 시끄러운 커플입니다. 붙어 있으면 싸우고 떨어지면 화면 온도가 내려가서 시청자가 둘을 계속 붙여놓고 싶어 합니다.`,
      `두 사람은 서로를 바꾸려고 하지 않는데, 이상하게 함께 있으면 조금씩 나아집니다. 이게 바로 댓글창에서 "이건 사랑이다"가 나오는 포인트입니다.`,
      `${a}는 ${b} 앞에서만 방어가 느슨해지고, ${b}는 ${a} 앞에서만 진심을 숨기지 못합니다. 보는 사람 입장에선 이보다 명확한 고백이 없습니다.`,
      `서사가 무겁다가도 둘이 한 화면에 잡히면 갑자기 로코가 됩니다. 장르를 흔드는 케미라 시청자가 끊기 어렵습니다.`,
    ],
    seed,
    "ship",
  );
}

function buildTrailerHook(a: string, b: string, firstRole: CharacterRole, secondRole: CharacterRole, seed: string): string {
  return pick(
    [
      `${firstRole.tag}와 ${secondRole.tag}, 서로를 피하려는 순간마다 운명이 더 가까이 밀어붙인다.`,
      `${a}는 숨기고, ${b}는 알아차린다. 두 사람의 비밀이 밝혀지는 순간 로맨스가 시작된다.`,
      `이번 생에서 놓친 장면을 다음 장면에서 다시 붙잡을 수 있을까?`,
      `기억하는 사람과 모른 척하는 사람의 가장 위험한 로맨스.`,
      `서로를 구하려는 순간, 가장 숨기고 싶던 과거가 동시에 깨어난다.`,
    ],
    seed,
    "trailer",
  );
}

function buildSynopsis(
  a: string,
  b: string,
  genre: string,
  relationship: string,
  firstRole: CharacterRole,
  secondRole: CharacterRole,
  firstMeeting: string,
  seed: string,
): string {
  const pull = pick(
    [
      `처음엔 서로를 최악의 타이밍에 나타난 변수라고 생각하지만, 이상하게도 가장 위험한 순간마다 서로를 먼저 구하게 된다.`,
      `두 사람은 피해야 안전한 관계였지만, 한 번 마주친 뒤부터 모든 사건의 끝이 다시 서로에게 돌아온다.`,
      `말은 차갑게 밀어내도 비 오는 날 우산은 늘 한쪽으로 기울고, OST는 둘의 마음을 먼저 들킨다.`,
      `서로의 약점을 가장 정확히 알아본 탓에 더 자주 상처 주지만, 결국 가장 먼저 달려가는 사람도 서로다.`,
    ],
    seed,
    "synopsis-pull",
  );
  const conflictHook = pick(
    [
      `숨겨진 과거, 반복되는 오해, 그리고 끝내 말하지 못한 고백이 ${genre}의 한가운데서 폭발한다.`,
      `${relationship}라는 설정은 3화 엔딩부터 흔들리고, 8화 회상 장면에서 시청자는 이미 모든 복선을 알아차린다.`,
      `${firstRole.tag}와 ${secondRole.tag}라는 정체가 부딪히는 순간, 이 로맨스는 단순한 설렘이 아니라 구원 서사가 된다.`,
      `두 사람이 가까워질수록 진실은 더 위험해지고, 멀어질수록 화면의 온도는 이상하게 내려간다.`,
    ],
    seed,
    "synopsis-conflict",
  );
  const finalHook = pick(
    [
      `이 드라마는 '${a}와 ${b}가 서로의 결말을 바꿀 수 있을까'를 끝까지 묻게 만드는 이야기다.`,
      `결국 시청자는 둘이 행복해지는 장면 하나를 보려고 16부작을 밤새 달리게 된다.`,
      `그리고 마지막 10초, 처음 만났던 장면의 의미가 완전히 달라진다.`,
      `이번 생에서 안 되면 다음 생에서라도, 라는 말이 농담이 아니게 되는 이야기다.`,
    ],
    seed,
    "synopsis-final",
  );

  return `${firstRole.title} ${a}는 어느 날 ${secondRole.title} ${b}와 마주친다. ${firstMeeting} ${pull} ${conflictHook} ${finalHook}`;
}

function buildViewingPoints(a: string, b: string, firstRole: CharacterRole, secondRole: CharacterRole, seed: string): string[] {
  return [
    pick(
      [
        `1화부터 오해로 시작하지만 3화 엔딩에서 시청자가 먼저 눈치채는 관계성`,
        `${a}의 차가운 말과 ${b}의 흔들리는 표정이 동시에 잡히는 클로즈업`,
        `처음엔 사건처럼 보이다가 점점 고백처럼 변하는 장면 배치`,
      ],
      seed,
      "point-1",
    ),
    pick(
      [
        `${firstRole.tag}와 ${secondRole.tag}가 부딪힐 때마다 장르가 멜로로 기우는 맛`,
        `말보다 눈빛으로 서사가 쌓여서 대사 없는 장면이 더 크게 터지는 타입`,
        `서로 상처 주면서도 제일 먼저 달려가는 정석 구원 서사`,
      ],
      seed,
      "point-2",
    ),
    pick(
      [
        `8화쯤 터지는 과거 회상 장면과 마지막 회 댓글창 폭발 엔딩`,
        `비 오는 날 우산 각도 하나로 관계 변화를 설명하는 K-드라마식 디테일`,
        `시즌2를 외치게 만드는 마지막 10초짜리 떡밥`,
      ],
      seed,
      "point-3",
    ),
  ];
}

function buildDynamicFlavor(a: string, b: string, relationship: string, seed: string): string {
  return pick(
    [
      `${relationship}. 겉으로는 서로를 밀어내지만, 이미 화면 밖에서는 OST가 먼저 깔린 관계입니다.`,
      `${a}와 ${b}는 대화는 자꾸 엇갈리는데 눈빛만큼은 16부작을 혼자 끌고 갑니다.`,
      `혐관처럼 시작해 구원서사로 넘어가는 정석 루트입니다. 둘 다 괜찮은 척하지만 카메라는 거짓말을 못 합니다.`,
      `서로 상처 주는 말은 잘하는데, 정작 무너지는 순간에는 가장 먼저 달려가는 타입입니다.`,
    ],
    seed,
    "dynamic-flavor",
  );
}

function buildViewerComments(a: string, b: string, seed: string): string[] {
  return [
    pick(
      [
        `"둘이 싸우는데 왜 내가 설레죠?"`,
        `"작가님 제발 이번 생에는 행복하게 해주세요."`,
        `"이 장면에서 OST 들어오는 순간 끝났음."`,
      ],
      seed,
      "comment-1",
    ),
    pick(
      [
        `"${a} 눈빛 때문에 오늘도 잠 못 잠."`,
        `"${b}가 모든 걸 알고 있었다는 게 진짜 미쳤다."`,
        `"둘이 말 안 하는데 내가 다 알아들음."`,
      ],
      seed,
      "comment-2",
    ),
    pick(
      [
        `"이 정도면 넷플릭스 16부작 가능."`,
        `"제발 외전 주세요. 둘이 행복한 것만 2시간 보여주세요."`,
        `"9화 엔딩 보고 소리 지른 사람 저뿐인가요?"`,
      ],
      seed,
      "comment-3",
    ),
  ];
}

function buildEndingTeaser(a: string, b: string, seed: string): string {
  return pick(
    [
      `마지막 회에서 ${a}와 ${b}는 처음 만났던 장소로 돌아갑니다. 그런데 이번에는 한 사람이 모든 기억을 가지고 있습니다.`,
      `엔딩은 해피엔딩처럼 보이지만, 마지막 10초 때문에 모두가 시즌2를 외치게 됩니다.`,
      `${a}가 고백을 미루는 순간, ${b}의 시간이 다시 움직이기 시작합니다.`,
      `둘 중 한 사람은 떠나야 하고, 다른 한 사람은 잡아야 합니다. 그런데 카메라는 끝까지 대답을 보여주지 않습니다.`,
    ],
    seed,
    "ending-teaser",
  );
}

function buildResult(first: ProtagonistInput, second: ProtagonistInput): DramaResult {
  const a = displayName(first.name, "주인공 A");
  const b = displayName(second.name, "주인공 B");
  const seed = `${a}:${first.role}:${b}:${second.role}`;
  const firstRole = pick(rolePool(first.role, `${seed}:first`), seed, "first-role");
  const secondRole = pick(rolePool(second.role, `${seed}:second`), seed, "second-role");
  const genre = pick(GENRES, seed, "genre");
  const score = 78 + (hashStr(seed + ":score") % 22);
  const relationship = relationshipFor(first, second, seed);
  const title = buildTitle(a, b, seed);
  const draft = { genre, relationship };
  const firstMeeting = buildFirstMeeting(a, b, draft, seed);
  const conflict = buildConflict(a, b, firstRole, secondRole, seed);
  const famousLine = buildFamousLine(a, b, seed);
  const shipReason = buildShipReason(a, b, seed);
  const trailerHook = buildTrailerHook(a, b, firstRole, secondRole, seed);
  const synopsis = buildSynopsis(a, b, genre, relationship, firstRole, secondRole, firstMeeting, seed);
  const viewingPoints = buildViewingPoints(a, b, firstRole, secondRole, seed);
  const dynamicFlavor = buildDynamicFlavor(a, b, relationship, seed);
  const viewerComments = buildViewerComments(a, b, seed);
  const endingTeaser = buildEndingTeaser(a, b, seed);
  const shareSummary = `우리 드라마 제목이 '${title}'래. 케미 ${score}점, 장르는 ${genre}. ${a}랑 ${b} 줄거리 은근 넷플릭스 16부작 가능...`;

  return {
    title,
    score,
    genre,
    relationship,
    trailerHook,
    synopsis,
    viewingPoints,
    dynamicFlavor,
    firstRole,
    secondRole,
    firstMeeting,
    conflict,
    famousLine,
    viewerComments,
    endingTeaser,
    shipReason,
    shareSummary,
  };
}

function makeEnglishSummary(result: DramaResult, a: string, b: string): string {
  return `Our K-Drama title is "${result.title}". Chemistry ${result.score}, genre ${result.genre}. ${a} and ${b} sound dangerously bingeable.`;
}

export default function KdramaCouplePage(): ReactElement {
  const { locale } = useLocale();
  const loc = locale === "en" ? "en" : "ko";
  const [first, setFirst] = useState<ProtagonistInput>({ name: "", role: "female" });
  const [second, setSecond] = useState<ProtagonistInput>({ name: "", role: "male" });
  const [submitted, setSubmitted] = useState<{ first: ProtagonistInput; second: ProtagonistInput } | null>(null);
  const [copied, setCopied] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const result = useMemo(() => {
    if (!submitted) return null;
    return buildResult(submitted.first, submitted.second);
  }, [submitted]);

  const t = useCallback((ko: string, en: string) => (loc === "ko" ? ko : en), [loc]);

  const canSubmit = first.name.trim().length > 0 && second.name.trim().length > 0;

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!canSubmit) {
        firstInputRef.current?.focus();
        return;
      }
      setCopied(false);
      setSubmitted({
        first: { name: first.name.trim(), role: first.role },
        second: { name: second.name.trim(), role: second.role },
      });
    },
    [canSubmit, first, second],
  );

  const reset = useCallback(() => {
    setSubmitted(null);
    setCopied(false);
    window.setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  const share = useCallback(async () => {
    if (!result || !submitted) return;
    const a = displayName(submitted.first.name, "A");
    const b = displayName(submitted.second.name, "B");
    const text = loc === "ko" ? result.shareSummary : makeEnglishSummary(result, a, b);
    const url = `${window.location.origin}/games/kdrama-couple`;

    try {
      if (navigator.share) {
        await navigator.share({ title: result.title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
      }
      setCopied(true);
    } catch {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  }, [loc, result, submitted]);

  const copyLink = useCallback(async () => {
    if (!result || !submitted) return;
    const a = displayName(submitted.first.name, "A");
    const b = displayName(submitted.second.name, "B");
    const text = loc === "ko" ? result.shareSummary : makeEnglishSummary(result, a, b);
    const url = `${window.location.origin}/games/kdrama-couple`;
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [loc, result, submitted]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(144,41,64,0.36), transparent 36%), linear-gradient(180deg, #12070b 0%, #080609 42%, #050405 100%)",
        color: INK,
        fontFamily: SANS,
        paddingBottom: 92,
      }}
    >
      <style>{`
        .kdc-shell {
          width: min(1060px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 28px 0 56px;
        }
        .kdc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 42px;
        }
        .kdc-logo {
          color: ${INK};
          text-decoration: none;
          font-family: ${SERIF};
          font-size: 21px;
          font-weight: 800;
        }
        .kdc-form-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
          align-items: stretch;
        }
        .kdc-role-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }
        .kdc-result-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 18px;
          align-items: start;
        }
        .kdc-section-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .kdc-role-card,
        .kdc-button {
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
        }
        .kdc-role-card:hover,
        .kdc-button:hover {
          transform: translateY(-1px);
        }
        @media (max-width: 760px) {
          .kdc-shell {
            width: min(100vw - 28px, 560px);
            padding-top: 18px;
          }
          .kdc-header {
            margin-bottom: 28px;
          }
          .kdc-form-grid,
          .kdc-result-grid,
          .kdc-section-grid {
            grid-template-columns: 1fr;
          }
          .kdc-role-grid {
            gap: 8px;
          }
          .kdc-mobile-stack {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .kdc-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="kdc-shell">
        <header className="kdc-header">
          <Link href="/" className="kdc-logo" aria-label="nolza.fun">
            놀자.fun
          </Link>
          <Link
            href="/games/kdrama"
            style={{
              color: ROSE,
              textDecoration: "none",
              border: `1px solid ${LINE}`,
              borderRadius: 999,
              padding: "9px 13px",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {t("다른 K-드라마 테스트", "More K-drama games")}
          </Link>
        </header>

        {!result ? (
          <IntroForm
            first={first}
            second={second}
            setFirst={setFirst}
            setSecond={setSecond}
            firstInputRef={firstInputRef}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            t={t}
            loc={loc}
          />
        ) : (
          <ResultView
            first={submitted?.first ?? first}
            second={submitted?.second ?? second}
            result={result}
            onReset={reset}
            onShare={share}
            onCopy={copyLink}
            copied={copied}
            t={t}
            loc={loc}
          />
        )}
      </div>
    </main>
  );
}

function IntroForm({
  first,
  second,
  setFirst,
  setSecond,
  firstInputRef,
  canSubmit,
  onSubmit,
  t,
  loc,
}: {
  first: ProtagonistInput;
  second: ProtagonistInput;
  setFirst: (value: ProtagonistInput) => void;
  setSecond: (value: ProtagonistInput) => void;
  firstInputRef: React.RefObject<HTMLInputElement | null>;
  canSubmit: boolean;
  onSubmit: (event: FormEvent) => void;
  t: (ko: string, en: string) => string;
  loc: Loc;
}): ReactElement {
  return (
    <section>
      <div style={{ maxWidth: 760, marginBottom: 28 }}>
        <div style={eyebrowStyle}>{t("K-드라마 커플 분석", "K-Drama Couple")}</div>
        <h1
          style={{
            margin: "10px 0 14px",
            fontFamily: SERIF,
            fontSize: "clamp(38px, 7vw, 76px)",
            lineHeight: 0.96,
            letterSpacing: 0,
          }}
        >
          {t("둘의 12부작은 어떤 장르일까", "What drama would they become?")}
        </h1>
        <p style={{ margin: 0, color: SUBTLE, fontSize: 17, lineHeight: 1.75, wordBreak: "keep-all" }}>
          {t(
            "이름과 역할 스타일을 고르면 성별에 어색하게 끼워 맞추지 않고, 더 자연스러운 K-드라마 커플 서사를 만들어줍니다.",
            "Pick each name and role style, then get a couple result that avoids awkward trope mismatches.",
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} style={panelStyle}>
        <div className="kdc-form-grid">
          <PersonEditor
            label={t("첫 번째 주인공", "First protagonist")}
            placeholder={t("이름 입력", "Enter name")}
            value={first}
            onChange={setFirst}
            inputRef={firstInputRef}
            personKey="first"
            loc={loc}
          />
          <PersonEditor
            label={t("두 번째 주인공", "Second protagonist")}
            placeholder={t("이름 입력", "Enter name")}
            value={second}
            onChange={setSecond}
            personKey="second"
            loc={loc}
          />
        </div>

        <div
          className="kdc-mobile-stack"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            marginTop: 22,
          }}
        >
          <p style={{ margin: 0, color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            {t("순서: 이름 → 역할 스타일 → 이름 → 역할 스타일 → 분석 시작", "Flow: name, role, name, role, start analysis")}
          </p>
          <button
            className="kdc-button"
            type="submit"
            disabled={!canSubmit}
            style={{
              ...primaryButton,
              opacity: canSubmit ? 1 : 0.46,
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {t("드라마 분석 시작", "Start analysis")}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 22 }}>
        <AdBottom />
      </div>
    </section>
  );
}

function PersonEditor({
  label,
  placeholder,
  value,
  onChange,
  inputRef,
  personKey,
  loc,
}: {
  label: string;
  placeholder: string;
  value: ProtagonistInput;
  onChange: (value: ProtagonistInput) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  personKey: PersonKey;
  loc: Loc;
}): ReactElement {
  return (
    <fieldset
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: 16,
        minWidth: 0,
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <legend
        style={{
          padding: "0 8px",
          color: ROSE_STRONG,
          fontFamily: SERIF,
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        {label}
      </legend>

      <input
        ref={inputRef}
        value={value.name}
        onChange={(event) => onChange({ ...value, name: event.target.value })}
        placeholder={placeholder}
        autoComplete={personKey === "first" ? "given-name" : "off"}
        style={inputStyle}
      />

      <div className="kdc-role-grid" style={{ marginTop: 12 }}>
        {ROLE_OPTIONS.map((option) => {
          const selected = value.role === option.value;
          return (
            <button
              key={option.value}
              className="kdc-role-card"
              type="button"
              onClick={() => onChange({ ...value, role: option.value })}
              aria-pressed={selected}
              style={{
                textAlign: "left",
                minHeight: 78,
                borderRadius: 8,
                border: `1px solid ${selected ? ROSE : LINE}`,
                background: selected
                  ? "linear-gradient(135deg, rgba(242,198,189,0.2), rgba(255,255,255,0.08))"
                  : "rgba(255,255,255,0.04)",
                color: INK,
                padding: "12px 12px",
                cursor: "pointer",
                boxShadow: selected ? "0 10px 26px rgba(242,198,189,0.12)" : "none",
                touchAction: "manipulation",
              }}
            >
              <span style={{ display: "block", fontWeight: 900, fontSize: 15 }}>
                {loc === "ko" ? option.ko : option.en}
              </span>
              <span style={{ display: "block", marginTop: 5, color: SUBTLE, fontSize: 12, lineHeight: 1.35 }}>
                {loc === "ko" ? option.hintKo : option.hintEn}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ResultView({
  first,
  second,
  result,
  onReset,
  onShare,
  onCopy,
  copied,
  t,
  loc,
}: {
  first: ProtagonistInput;
  second: ProtagonistInput;
  result: DramaResult;
  onReset: () => void;
  onShare: () => void;
  onCopy: () => void;
  copied: boolean;
  t: (ko: string, en: string) => string;
  loc: Loc;
}): ReactElement {
  const a = displayName(first.name, "A");
  const b = displayName(second.name, "B");

  return (
    <section>
      <div className="kdc-result-grid">
        <aside style={panelStyle}>
          <div style={eyebrowStyle}>{t("드라마 제목", "Drama title")}</div>
          <h1
            style={{
              margin: "12px 0 18px",
              fontFamily: SERIF,
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: 0,
            }}
          >
            {result.title}
          </h1>
          <p
            style={{
              margin: "0 0 18px",
              color: INK,
              fontFamily: SERIF,
              fontSize: 20,
              lineHeight: 1.55,
              wordBreak: "keep-all",
            }}
          >
            {result.trailerHook}
          </p>

          <div style={scoreBoxStyle}>
            <span style={{ color: MUTED, fontSize: 13, fontWeight: 800 }}>
              {t("커플 케미 점수", "Couple chemistry")}
            </span>
            <strong style={{ fontSize: 54, lineHeight: 1, color: ROSE_STRONG }}>{result.score}</strong>
            <span style={{ color: SUBTLE, fontSize: 14 }}>/ 100</span>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            <MiniFact label={t("장르", "Genre")} value={result.genre} />
            <MiniFact label={t("두 사람의 관계", "Relationship")} value={result.relationship} />
          </div>

          <div className="kdc-mobile-stack" style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="kdc-button" type="button" onClick={onShare} style={primaryButton}>
              {t("친구에게 보내기", "Send to friend")}
            </button>
            <button className="kdc-button" type="button" onClick={onCopy} style={secondaryButton}>
              {copied ? t("복사 완료", "Copied") : t("링크 복사", "Copy link")}
            </button>
            <button className="kdc-button" type="button" onClick={onReset} style={secondaryButton}>
              {t("다시 하기", "Replay")}
            </button>
          </div>
        </aside>

        <div style={{ display: "grid", gap: 14 }}>
          <HeroResultSection title={t("한 줄 예고편", "Trailer hook")} body={result.trailerHook} />
          <HeroResultSection title={t("줄거리", "Synopsis")} body={result.synopsis} large />

          <div className="kdc-section-grid">
            <RoleCard
              eyebrow={`${a} · ${roleLabel(first.role, loc)}`}
              role={result.firstRole}
            />
            <RoleCard
              eyebrow={`${b} · ${roleLabel(second.role, loc)}`}
              role={result.secondRole}
            />
          </div>

          <BulletSection title={t("시청 포인트", "Why watch")} items={result.viewingPoints} />
          <ResultSection title={t("관계성 맛", "Couple dynamic")} body={result.dynamicFlavor} />
          <ResultSection title={t("첫 만남", "First meeting")} body={result.firstMeeting} />
          <ResultSection title={t("중반부 위기", "Midpoint crisis")} body={result.conflict} />
          <ResultSection title={t("명대사", "Famous line")} body={result.famousLine} quote />
          <BulletSection title={t("댓글 반응", "Viewer comments")} items={result.viewerComments} />
          <ResultSection title={t("시청자 반응", "Why viewers ship them")} body={result.shipReason} />
          <ResultSection title={t("엔딩 스포 없는 예고", "Ending teaser")} body={result.endingTeaser} />
          <ResultSection title={t("공유 멘트", "Shareable summary")} body={loc === "ko" ? result.shareSummary : makeEnglishSummary(result, a, b)} />

          <section style={cardStyle}>
            <div style={eyebrowStyle}>{t("다른 K-드라마 테스트", "More K-drama tests")}</div>
            <div className="kdc-mobile-stack" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <Link href="/games/kdrama" style={linkButtonStyle}>
                {t("K-드라마 취향 테스트", "K-drama taste test")}
              </Link>
              <Link href="/games/kdrama-trope" style={linkButtonStyle}>
                {t("K-드라마 클리셰 테스트", "K-drama trope test")}
              </Link>
            </div>
          </section>

          <div style={{ marginTop: 4 }}>
            <AdBottom />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroResultSection({
  title,
  body,
  large = false,
}: {
  title: string;
  body: string;
  large?: boolean;
}): ReactElement {
  return (
    <section
      style={{
        ...cardStyle,
        background: `linear-gradient(180deg, rgba(242,198,189,0.1), ${PANEL})`,
      }}
    >
      <div style={eyebrowStyle}>{title}</div>
      <p
        style={{
          margin: "12px 0 0",
          color: INK,
          fontFamily: large ? SERIF : SANS,
          fontSize: large ? 19 : 18,
          lineHeight: large ? 1.9 : 1.65,
          wordBreak: "keep-all",
        }}
      >
        {body}
      </p>
    </section>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }): ReactElement {
  return (
    <section style={cardStyle}>
      <div style={eyebrowStyle}>{title}</div>
      <ul
        style={{
          margin: "12px 0 0",
          padding: 0,
          listStyle: "none",
          display: "grid",
          gap: 9,
        }}
      >
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            style={{
              color: INK,
              lineHeight: 1.62,
              wordBreak: "keep-all",
              border: `1px solid ${LINE}`,
              borderRadius: 8,
              padding: "11px 12px",
              background: "rgba(0,0,0,0.16)",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RoleCard({ eyebrow, role }: { eyebrow: string; role: CharacterRole }): ReactElement {
  return (
    <article style={cardStyle}>
      <div style={eyebrowStyle}>{eyebrow}</div>
      <h2 style={{ margin: "9px 0 9px", color: ROSE_STRONG, fontFamily: SERIF, fontSize: 23, lineHeight: 1.22 }}>
        {role.title}
      </h2>
      <p style={{ margin: 0, color: SUBTLE, lineHeight: 1.68, wordBreak: "keep-all" }}>{role.line}</p>
    </article>
  );
}

function ResultSection({ title, body, quote = false }: { title: string; body: string; quote?: boolean }): ReactElement {
  return (
    <section style={cardStyle}>
      <div style={eyebrowStyle}>{title}</div>
      <p
        style={{
          margin: "10px 0 0",
          color: quote ? INK : SUBTLE,
          fontFamily: quote ? SERIF : SANS,
          fontSize: quote ? 20 : 16,
          lineHeight: quote ? 1.6 : 1.76,
          wordBreak: "keep-all",
        }}
      >
        {quote ? `"${body}"` : body}
      </p>
    </section>
  );
}

function MiniFact({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: "12px 13px",
        background: "rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ color: MUTED, fontSize: 12, fontWeight: 800, marginBottom: 5 }}>{label}</div>
      <div style={{ color: INK, fontSize: 15, lineHeight: 1.5, wordBreak: "keep-all" }}>{value}</div>
    </div>
  );
}

const panelStyle: CSSProperties = {
  background: `linear-gradient(180deg, ${PANEL_STRONG}, ${PANEL})`,
  border: `1px solid ${LINE}`,
  borderRadius: 10,
  padding: "clamp(18px, 4vw, 30px)",
  boxShadow: "0 28px 80px rgba(0,0,0,0.34)",
};

const cardStyle: CSSProperties = {
  background: PANEL,
  border: `1px solid ${LINE}`,
  borderRadius: 10,
  padding: "20px",
  boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
};

const eyebrowStyle: CSSProperties = {
  color: ROSE,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 54,
  boxSizing: "border-box",
  border: `1px solid ${LINE}`,
  borderRadius: 8,
  background: "rgba(255,255,255,0.07)",
  color: INK,
  outline: "none",
  padding: "0 15px",
  fontSize: 17,
  fontWeight: 800,
  fontFamily: SANS,
};

const scoreBoxStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto auto",
  alignItems: "end",
  gap: 8,
  borderTop: `1px solid ${LINE}`,
  borderBottom: `1px solid ${LINE}`,
  padding: "18px 0",
};

const primaryButton: CSSProperties = {
  border: "none",
  borderRadius: 8,
  background: "linear-gradient(135deg, #ffd8d1, #f0b8ae)",
  color: "#130709",
  padding: "15px 20px",
  fontSize: 14,
  fontWeight: 950,
  cursor: "pointer",
  touchAction: "manipulation",
  whiteSpace: "nowrap",
};

const secondaryButton: CSSProperties = {
  border: `1px solid ${ROSE_DIM}`,
  borderRadius: 8,
  background: "rgba(255,255,255,0.04)",
  color: ROSE_STRONG,
  padding: "15px 18px",
  fontSize: 14,
  fontWeight: 900,
  cursor: "pointer",
  touchAction: "manipulation",
  whiteSpace: "nowrap",
};

const linkButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  border: `1px solid ${ROSE_DIM}`,
  borderRadius: 8,
  background: "rgba(255,255,255,0.04)",
  color: ROSE_STRONG,
  padding: "0 15px",
  fontSize: 14,
  fontWeight: 900,
  textDecoration: "none",
  wordBreak: "keep-all",
};
