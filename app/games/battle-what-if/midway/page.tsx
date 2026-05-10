import type { Metadata } from "next";
import { decodePicks, evaluate } from "@/lib/midway";
import MidwayGame from "./MidwayGame";

const ROUTE = "/games/battle-what-if/midway";

type SearchParams = { p?: string | string[] };

function pickParam(p: string | string[] | undefined): string | undefined {
  if (Array.isArray(p)) return p[0];
  return p ?? undefined;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const code = pickParam(sp.p);
  const picks = decodePicks(code ?? null);

  if (!picks) {
    return {
      title: "니미츠라면 — 미드웨이의 다섯 갈림길 | 놀자.fun",
      description:
        "항모 셋, 일본은 넷. 니미츠의 다섯 갈림길. 당신의 지휘 유형은?",
      openGraph: {
        title: "니미츠라면 — 미드웨이의 다섯 갈림길",
        description:
          "암호 해독과 직관 사이, 다섯 번의 결단. 당신의 지휘 유형은?",
        url: ROUTE,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "니미츠라면 — 미드웨이의 다섯 갈림길",
        description:
          "암호 해독과 직관 사이, 다섯 번의 결단. 당신의 지휘 유형은?",
      },
    };
  }

  const { archetype, commanderMatchCount } = evaluate(picks);
  const title = `${archetype.name.ko} · 니미츠와 ${commanderMatchCount}/5 일치`;
  const desc = `친구의 지휘 유형: ${archetype.name.ko}. 당신은 니미츠라면 어떻게 했을까?`;
  const sharedUrl = `${ROUTE}?p=${code}`;

  return {
    title: `${title} | 놀자.fun`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: sharedUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const code = pickParam(sp.p);
  const picks = decodePicks(code ?? null) ?? undefined;
  return <MidwayGame initialPicks={picks} />;
}
