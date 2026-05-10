import type { Metadata } from "next";
import { decodePicks, evaluate } from "@/lib/red-cliffs";
import RedCliffsGame from "./RedCliffsGame";

const ROUTE = "/games/battle-what-if/red-cliffs";

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
      title: "주유라면 — 적벽의 다섯 갈림길 | 놀자.fun",
      description:
        "조조의 80만 대군 앞에서, 주유의 다섯 갈림길. 당신의 지휘 유형은?",
      openGraph: {
        title: "주유라면 — 적벽의 다섯 갈림길",
        description:
          "Five forks at Red Cliffs as Cao Cao's army camps across the river. What's your command type?",
        url: ROUTE,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "주유라면 — 적벽의 다섯 갈림길",
        description:
          "Five forks at Red Cliffs as Cao Cao's army camps across the river. What's your command type?",
      },
    };
  }

  const { archetype, commanderMatchCount } = evaluate(picks);
  const title = `${archetype.name.ko} · 주유와 ${commanderMatchCount}/5 일치`;
  const desc = `친구의 지휘 유형: ${archetype.name.ko}. 당신은 주유라면 어떻게 했을까?`;
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
  return <RedCliffsGame initialPicks={picks} />;
}
