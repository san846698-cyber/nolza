// 게임 플레이 성향 테스트 공용 코어 (발로란트 · 배그 · 오버워치 등).
// 롤 테스트와 동일한 플로우/채점을 설정(config) 기반으로 재사용한다.
import type { Metadata } from "next";
import { decodeSharePayload } from "@/lib/share-result";

export type PlaystyleMedia = "art" | "emoji" | "role";

export type PlaystyleType = {
  ko: string;
  en: string;
  desc: string;
  tags: string[];
  pair: string; // "닮은 요원/영웅" 값 또는 "주무기" 값
  img?: string; // media "art": public 경로 파일 베이스명
  emoji?: string; // media "emoji"
  role?: string; // media "role": 탱/딜/힐
};

export type PlaystyleQuestion = {
  q: string;
  answers: { label: string; types: string[] }[];
};

// 전 화면 다크 네이비 카드는 공통 고정. 게임별로는 악센트 색만 분기한다.
export type PlaystyleTheme = {
  accent: string; // 게임 악센트 (롤 골드 / 발로 레드 / 배그·옵치 오렌지)
  accentInk: string; // 악센트 버튼 위 글자색 (대비 확보)
};

export type PlaystyleConfig = {
  id: string; // "valorant-playstyle"
  path: string; // "/tests/valorant-playstyle"
  testName: string; // analytics 이름
  gameLabel: string; // "발로란트" (공유/타이틀용, 인트로 타이틀 1행 "{gameLabel} 플레이"로도 사용)
  titleKo: string; // 메타 제목
  metaDescription: string;
  eyebrowPill: string; // 인트로 상단 영문 필 (예: "SUMMONER TEST")
  introSub: string;
  introDesc: string;
  introTypeLine: string; // "엔트리·작전·클러치…" 6종 요약
  pairLabel: string; // "닮은 요원" / "주무기" / "닮은 영웅"
  media: PlaystyleMedia;
  artBase?: string; // "/images/tests/valorant/art"
  artExt?: string; // 아트 확장자 (롤=jpg / 발로=png), 기본 png
  notice: string; // 저작권/디스클레이머
  tiebreak: string[];
  types: Record<string, PlaystyleType>;
  questions: PlaystyleQuestion[];
  theme: PlaystyleTheme;
  roleColors?: Record<string, string>; // media "role" 전용 (역할→색)
  roleEmoji?: Record<string, string>; // media "role" 전용 (역할→이모지)
  ogKicker: string; // "VALORANT PLAYSTYLE TEST"
  ogDefault: { title: string; sub: string; line: string };
  ogDescriptionDefault: string;
  recommendIds: string[];
};

export type PlaystyleSharePayload = {
  v: 1;
  resultId: string;
};

// 공통 채점 (롤과 동일): 최고점, 동점이면 tiebreak 우선순위.
export function scorePlaystyle(picks: string[][], tiebreak: string[]): string {
  const s: Record<string, number> = {};
  for (const k of tiebreak) s[k] = 0;
  picks.forEach((arr) => arr.forEach((t) => { s[t] = (s[t] ?? 0) + 1; }));
  let best = tiebreak[0];
  for (const k of tiebreak) if (s[k] > s[best]) best = k;
  return best;
}

export function isTypeKey(config: PlaystyleConfig, key: string | null | undefined): key is string {
  return Boolean(key) && Object.prototype.hasOwnProperty.call(config.types, key as string);
}

export function resolveResultKey(
  config: PlaystyleConfig,
  sParam: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(sParam) ? sParam[0] : sParam;
  const payload = decodeSharePayload<{ v?: number; resultId?: string }>(raw ?? null);
  return payload && isTypeKey(config, payload.resultId) ? (payload.resultId as string) : null;
}

// 한국어 보조사 은/는: 마지막 글자 받침 유무로 선택('주무기'→는, '닮은 챔피언'→은).
function topicParticle(word: string): string {
  if (!word) return "은";
  const code = word.charCodeAt(word.length - 1);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 === 0 ? "는" : "은";
  return "은";
}

// 결과별 OG/메타를 만드는 공용 generateMetadata 헬퍼.
export function buildPlaystyleMetadata(
  config: PlaystyleConfig,
  sParam: string | string[] | undefined,
): Metadata {
  const key = resolveResultKey(config, sParam);
  const type = key ? config.types[key] : null;
  const ogImage = key ? `${config.path}/result-og?type=${key}` : `${config.path}/result-og`;
  const ogTitle = type
    ? `내 ${config.gameLabel} 성향: ${type.ko} (${type.pair})`
    : config.titleKo;
  const ogDescription = type
    ? `나는 ${type.ko}! ${config.pairLabel}${topicParticle(config.pairLabel)} ${type.pair}. 너의 진짜 ${config.gameLabel} 스타일은?`
    : config.ogDescriptionDefault;

  return {
    title: config.titleKo,
    description: config.metaDescription,
    alternates: { canonical: config.path },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: config.path,
      siteName: "nolza.fun",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      locale: "ko_KR",
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
