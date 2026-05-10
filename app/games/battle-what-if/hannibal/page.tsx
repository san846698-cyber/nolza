import type { Metadata } from "next";
import { decodePicks, evaluate } from "@/lib/hannibal";
import HannibalGame from "./HannibalGame";

const ROUTE = "/games/battle-what-if/hannibal";

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
      title: "한니발이라면 — 당신의 지휘 성향 | 놀자.fun",
      description:
        "알프스부터 칸나에까지 — 한니발의 다섯 갈림길에서 당신은 어떻게 했을까. 사료 기반 지휘 성향 진단.",
      openGraph: {
        title: "한니발이라면 — 당신의 지휘 성향",
        description:
          "알프스부터 칸나에까지, 다섯 번의 갈림길. 당신의 지휘 유형은?",
        url: ROUTE,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "한니발이라면 — 당신의 지휘 성향",
        description:
          "알프스부터 칸나에까지, 다섯 번의 갈림길. 당신의 지휘 유형은?",
      },
    };
  }

  const { archetype, commanderMatchCount } = evaluate(picks);
  const title = `${archetype.name.ko} · 한니발과 ${commanderMatchCount}/5 일치`;
  const desc = `친구의 지휘 유형: ${archetype.name.ko}. 당신은 한니발이라면 어떻게 했을까?`;
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
  return <HannibalGame initialPicks={picks} />;
}
