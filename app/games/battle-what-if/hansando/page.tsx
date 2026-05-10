import type { Metadata } from "next";
import { decodePicks, evaluate } from "@/lib/hansando";
import HansandoGame from "./HansandoGame";

const ROUTE = "/games/battle-what-if/hansando";

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
      title: "이순신이라면 — 한산도의 다섯 갈림길 | 놀자.fun",
      description:
        "일본 수군 73척 앞에서, 이순신의 다섯 갈림길. 당신의 지휘 유형은?",
      openGraph: {
        title: "이순신이라면 — 한산도의 다섯 갈림길",
        description:
          "Five forks at Hansando before 73 Japanese ships. What's your command type?",
        url: ROUTE,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "이순신이라면 — 한산도의 다섯 갈림길",
        description:
          "Five forks at Hansando before 73 Japanese ships. What's your command type?",
      },
    };
  }

  const { archetype, commanderMatchCount } = evaluate(picks);
  const title = `${archetype.name.ko} · 이순신과 ${commanderMatchCount}/5 일치`;
  const desc = `친구의 지휘 유형: ${archetype.name.ko}. 당신은 이순신이라면 어떻게 했을까?`;
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
  return <HansandoGame initialPicks={picks} />;
}
