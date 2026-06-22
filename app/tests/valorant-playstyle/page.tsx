import type { Metadata } from "next";
import { buildPlaystyleMetadata } from "@/lib/playstyle/core";
import { VALORANT_CONFIG } from "@/lib/playstyle/valorant";
import PlaystyleTestClient from "@/app/components/playstyle/PlaystyleTestClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildPlaystyleMetadata(VALORANT_CONFIG, sp.s);
}

export default function ValorantPlaystyleTestPage() {
  return <PlaystyleTestClient config={VALORANT_CONFIG} />;
}
