import type { Metadata } from "next";
import { decodePicks, evaluate } from "@/lib/waterloo";
import WaterlooGame from "./WaterlooGame";

const ROUTE = "/games/battle-what-if/waterloo";

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
      title: "나폴레옹이라면 — 워털루의 다섯 갈림길 | 놀자.fun",
      description:
        "100일 천하의 마지막 날, 나폴레옹의 다섯 갈림길. 당신의 지휘 유형은? / Five forks on the last day of the Hundred Days. What's your command type?",
      openGraph: {
        title: "나폴레옹이라면 — 워털루의 다섯 갈림길",
        description:
          "100일 천하의 마지막 날, 다섯 번의 결단. 당신의 지휘 유형은?",
        url: ROUTE,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "나폴레옹이라면 — 워털루의 다섯 갈림길",
        description:
          "100일 천하의 마지막 날, 다섯 번의 결단. 당신의 지휘 유형은?",
      },
    };
  }

  const { archetype, commanderMatchCount } = evaluate(picks);
  const title = `${archetype.name.ko} · 나폴레옹과 ${commanderMatchCount}/5 일치`;
  const desc = `친구의 지휘 유형: ${archetype.name.ko}. 당신은 나폴레옹이라면 어떻게 했을까?`;
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
  return <WaterlooGame initialPicks={picks} />;
}
