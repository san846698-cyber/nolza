import type { Metadata } from "next";
import { buildPlaystyleMetadata } from "@/lib/playstyle/core";
import { LOL_CONFIG } from "@/lib/playstyle/lol";
import PlaystyleTestClient from "@/app/components/playstyle/PlaystyleTestClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildPlaystyleMetadata(LOL_CONFIG, sp.s);
}

export default function LolPlaystyleTestPage() {
  return <PlaystyleTestClient config={LOL_CONFIG} />;
}
