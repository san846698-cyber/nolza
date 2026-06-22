import type { Metadata } from "next";
import { buildPlaystyleMetadata } from "@/lib/playstyle/core";
import { OVERWATCH_CONFIG } from "@/lib/playstyle/overwatch";
import PlaystyleTestClient from "@/app/components/playstyle/PlaystyleTestClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildPlaystyleMetadata(OVERWATCH_CONFIG, sp.s);
}

export default function OverwatchPlaystyleTestPage() {
  return <PlaystyleTestClient config={OVERWATCH_CONFIG} />;
}
