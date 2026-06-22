import type { Metadata } from "next";
import { decodeSharePayload } from "@/lib/share-result";
import { LCK_PLAYERS, LCK_PATH, LCK_STYLES, isLckPlayerKey, posKo } from "@/lib/playstyle/lck";
import LckTestClient from "./LckTestClient";

const koTitle = "LCK 프로게이머 성향 테스트 | 너랑 닮은 LCK 선수는?";
const koDescription =
  "주 포지션 고르고 5문항만! 너의 플레이 성향과 똑 닮은 LCK 프로게이머를 찾아주는 테스트. 포지션별 5명, 총 25명.";
const DEFAULT_OG = `${LCK_PATH}/result-og`;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function resolveKey(sParam: string | string[] | undefined): string | null {
  const raw = Array.isArray(sParam) ? sParam[0] : sParam;
  const payload = decodeSharePayload<{ v?: number; resultId?: string }>(raw ?? null);
  return payload && isLckPlayerKey(payload.resultId) ? (payload.resultId as string) : null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const key = resolveKey(sp.s);
  const p = key ? LCK_PLAYERS[key] : null;

  const ogTitle = p ? `너는 ${p.name}상! | LCK 프로게이머 성향 테스트` : koTitle;
  const ogDescription = p
    ? `나랑 닮은 LCK 프로는 ${p.name} (${posKo(p.pos)} · ${LCK_STYLES[p.style]}). 너랑 닮은 선수는?`
    : koDescription;
  const ogImage = key ? `${DEFAULT_OG}?type=${key}` : DEFAULT_OG;

  return {
    title: koTitle,
    description: koDescription,
    alternates: { canonical: LCK_PATH },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: LCK_PATH,
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

export default function LckProTestPage() {
  return <LckTestClient />;
}
