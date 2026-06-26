import type { Metadata } from "next";
import { buildAnimeMetadata } from "@/lib/anime-test";
import { JUJUTSU_KAISEN_CONFIG } from "@/lib/jujutsu-kaisen-test";
import JujutsuKaisenClient from "./JujutsuKaisenClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildAnimeMetadata(JUJUTSU_KAISEN_CONFIG, sp.s);
}

export default function JujutsuKaisenPage() {
  return <JujutsuKaisenClient />;
}
