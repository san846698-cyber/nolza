import type { Metadata } from "next";
import { buildFootballMetadata } from "@/lib/football/engine";
import { FOOTBALL_GLOBAL_CONFIG } from "@/lib/football/global";
import FootballGridClient from "@/app/components/football/FootballGridClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildFootballMetadata(FOOTBALL_GLOBAL_CONFIG, sp.s);
}

export default function FootballGlobalPage() {
  return <FootballGridClient config={FOOTBALL_GLOBAL_CONFIG} />;
}
