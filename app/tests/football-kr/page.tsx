import type { Metadata } from "next";
import { buildFootballMetadata } from "@/lib/football/engine";
import { FOOTBALL_KR_CONFIG } from "@/lib/football/kr";
import FootballGridClient from "@/app/components/football/FootballGridClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildFootballMetadata(FOOTBALL_KR_CONFIG, sp.s);
}

export default function FootballKrPage() {
  return <FootballGridClient config={FOOTBALL_KR_CONFIG} />;
}
