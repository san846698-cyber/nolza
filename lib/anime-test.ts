import type { Metadata } from "next";
import type { ResultTone } from "@/app/components/game/ResultScreen";
import { decodeSharePayload } from "@/lib/share-result";

// 일본 애니 "캐릭터 유형 테스트" 공용 엔진 — 데이터 설정(config) 기반으로 3개 테스트가 재사용.
// 비주얼은 캐릭터 이름 + 시그니처 색 + 이모지 카드(오리지널). 저작권 자산 0개.
export type LocalText = { ko: string; en: string };

export type AnimeResult = {
  key: string;
  name: LocalText;
  oneLiner: LocalText;
  description: LocalText;
  strength: LocalText;
  weakPoint: LocalText;
  friendSays: LocalText;
  shareLine: LocalText;
  emoji: string;
  color: string; // 시그니처 색 (hex)
  image?: string; // 오리지널 아트 파일명 (예: "tanjiro.webp") — 없으면 이모지 폴백
};

export type AnimeChoice = {
  id: string;
  text: LocalText;
  weights: Record<string, number>;
  // 히든(레어) 결과 트리거용 가중치. "극단(완벽/최강/무자비/초연)" 선택지에만 부여.
  // 일반 weights 와 독립적으로 합산되며, 임계값 이상이면 config.hidden 으로 오버라이드된다.
  hiddenWeight?: number;
  // 복수 히든 지원: 히든 결과 key별 가중치(예: { yoriichi: 1 } / { muzan: 1 }).
  // 트랙(히든 key)별로 독립 합산되어 각자 임계값을 넘으면 해당 히든으로 오버라이드된다.
  hiddenWeights?: Record<string, number>;
};
export type AnimeQuestion = { id: string; prompt: LocalText; choices: AnimeChoice[] };
export type AnimeAnswer = {
  questionId: string;
  choiceId: string;
  weights: Record<string, number>;
  hiddenWeight?: number;
  hiddenWeights?: Record<string, number>;
};

export type AnimeTestConfig = {
  testId: string;
  path: string; // "/tests/demon-slayer"
  tone: ResultTone; // ResultScreen 카드 톤
  accent: string; // 인트로/OG 강조색 (hex)
  ogBg: string; // OG/인트로 그라데이션
  eyebrow: LocalText; // "나의 귀멸 캐릭터"
  gameName: LocalText; // "귀멸의 칼날" (ResultScreen gameName)
  title: LocalText; // 인트로 H1 / 메타 제목
  subtitle: LocalText;
  description: LocalText;
  metaTitle: LocalText;
  metaDescription: LocalText;
  ogKicker: string; // "DEMON SLAYER CHARACTER TEST"
  // 정적 공유 표지(OG) 이미지 경로(예: "/images/tests/demon-slayer/cover.jpg").
  // 미지정 시 동적 opengraph-image 라우트 사용.
  coverImage?: string;
  results: AnimeResult[];
  // 히든(레어) 결과 — results[] 에는 포함하지 않는다(인트로/기본 OG/통계 노출 X, 서프라이즈 유지).
  // calculateAnimeResult 가 hiddenWeight 합 ≥ hiddenThreshold 일 때만 이 결과로 오버라이드한다.
  hidden?: AnimeResult;
  // 복수 히든(레어) 결과 — 트랙(히든 key)별 hiddenWeights 합이 임계값을 넘으면 오버라이드.
  // 여러 트랙이 동시에 임계값을 넘으면 점수가 높은 쪽, 동점이면 배열 순서가 빠른 쪽.
  hiddens?: AnimeResult[];
  // 히든 발동 임계값. 미지정 시 DEFAULT_HIDDEN_THRESHOLD 사용.
  hiddenThreshold?: number;
  questions: AnimeQuestion[];
  recommendedIds: string[];
};

// 히든 기본 임계값: 극단 선택지 5개 중 4개(각 hiddenWeight 1) 이상 고른 "몰빵" 패턴에서만 발동.
// 균등 무작위 응답 기준 발동률 ≈ 1.6% (C(5,4)·(1/4)^4·(3/4)+(1/4)^5 = 16/1024).
export const DEFAULT_HIDDEN_THRESHOLD = 4;

export type AnimeSharePayload = { v: 1; resultId: string; locale?: "ko" | "en" };

export function statsEndpoint(testId: string): string {
  return `/api/test-stats/${testId}`;
}

export function resultImageSrc(testId: string, key: string): string {
  return `/images/tests/${testId}/${key}.webp`;
}

// 키 조회는 일반 results[] + config.hidden 둘 다 본다(공유 복원/OG/통계가 히든도 자동 해석).
export function getAnimeResult(
  config: AnimeTestConfig,
  key: string | null | undefined,
): AnimeResult | null {
  if (!key) return null;
  if (config.hidden && config.hidden.key === key) return config.hidden;
  const fromHiddens = config.hiddens?.find((h) => h.key === key);
  if (fromHiddens) return fromHiddens;
  return config.results.find((r) => r.key === key) ?? null;
}

// 채점:
//  ① 일반 weights 합산 최대 = winner. 동점이면 config.results 순서가 빠른 쪽(안정적 tie-break).
//  ② hiddenWeight 합산이 임계값 이상이면 config.hidden 으로 오버라이드(레어). 일반 밸런스와 독립.
export function calculateAnimeResult(
  config: AnimeTestConfig,
  answers: AnimeAnswer[],
): AnimeResult {
  const scores = new Map<string, number>();
  for (const r of config.results) scores.set(r.key, 0);
  // 히든 트랙별 점수(히든 key → 합). legacy hiddenWeight 는 config.hidden.key 트랙에 더한다.
  const hiddenScores = new Map<string, number>();
  const legacyHiddenKey = config.hidden?.key;
  for (const a of answers) {
    for (const [k, v] of Object.entries(a.weights)) {
      if (scores.has(k)) scores.set(k, (scores.get(k) ?? 0) + v);
    }
    if (a.hiddenWeight && legacyHiddenKey) {
      hiddenScores.set(legacyHiddenKey, (hiddenScores.get(legacyHiddenKey) ?? 0) + a.hiddenWeight);
    }
    if (a.hiddenWeights) {
      for (const [k, v] of Object.entries(a.hiddenWeights)) {
        hiddenScores.set(k, (hiddenScores.get(k) ?? 0) + v);
      }
    }
  }
  let winner = config.results[0];
  let best = -Infinity;
  for (const r of config.results) {
    const s = scores.get(r.key) ?? 0;
    if (s > best) {
      best = s;
      winner = r;
    }
  }
  // 히든 후보: config.hiddens[] + (legacy) config.hidden. 임계값 넘은 것 중 최고점, 동점이면 앞 순서.
  const threshold = config.hiddenThreshold ?? DEFAULT_HIDDEN_THRESHOLD;
  const candidates: AnimeResult[] = [
    ...(config.hiddens ?? []),
    ...(config.hidden ? [config.hidden] : []),
  ];
  let bestHidden: AnimeResult | null = null;
  let bestHiddenScore = -Infinity;
  for (const h of candidates) {
    const s = hiddenScores.get(h.key) ?? 0;
    if (s >= threshold && s > bestHiddenScore) {
      bestHiddenScore = s;
      bestHidden = h;
    }
  }
  if (bestHidden) return bestHidden;
  return winner;
}

export function resolveSharedResultId(
  config: AnimeTestConfig,
  sParam: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(sParam) ? sParam[0] : sParam;
  const payload = decodeSharePayload<{ v?: number; resultId?: string }>(raw ?? null);
  const r = payload && payload.v === 1 ? getAnimeResult(config, payload.resultId) : null;
  return r ? r.key : null;
}

// 페이지 generateMetadata 용: ?s= 디코딩 → per-result OG 이미지 URL 분기.
export function buildAnimeMetadata(
  config: AnimeTestConfig,
  sParam: string | string[] | undefined,
  langParam?: string | string[] | undefined,
): Metadata {
  // ?lang=en 이면 영어로 강제(외국 공유용). 그 외엔 한국어 기본.
  const rawLang = Array.isArray(langParam) ? langParam[0] : langParam;
  const lang: "ko" | "en" = rawLang === "en" ? "en" : "ko";
  const pick = (t: LocalText) => t[lang];
  const key = resolveSharedResultId(config, sParam);
  const result = key ? getAnimeResult(config, key) : null;
  // OG 이미지: 영어면 동적 영어 카드(result-og?lang=en)로, 한국어 기본은 정적 coverImage.
  const ogImage = key
    ? `${config.path}/result-og?type=${key}${lang === "en" ? "&lang=en" : ""}`
    : lang === "en"
      ? `${config.path}/result-og?lang=en`
      : config.coverImage ?? `${config.path}/opengraph-image`;
  const ogTitle = result
    ? `${pick(config.eyebrow)}: ${pick(result.name)}`
    : pick(config.metaTitle);
  const ogDescription = result
    ? `${pick(result.oneLiner)} | ${pick(config.title)}`
    : pick(config.metaDescription);

  return {
    title: pick(config.metaTitle),
    description: pick(config.metaDescription),
    alternates: { canonical: config.path },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: config.path,
      siteName: "nolza.fun",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      locale: lang === "en" ? "en_US" : "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: result ? `${config.eyebrow.en}: ${result.name.en}` : config.metaTitle.en,
      description: result ? result.oneLiner.en : config.metaDescription.en,
      images: [ogImage],
    },
  };
}
