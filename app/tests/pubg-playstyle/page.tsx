import type { Metadata } from "next";
import { buildPlaystyleMetadata } from "@/lib/playstyle/core";
import { PUBG_CONFIG } from "@/lib/playstyle/pubg";
import PlaystyleTestClient from "@/app/components/playstyle/PlaystyleTestClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildPlaystyleMetadata(PUBG_CONFIG, sp.s);
}

export default function PubgPlaystyleTestPage() {
  return <PlaystyleTestClient config={PUBG_CONFIG} />;
}
