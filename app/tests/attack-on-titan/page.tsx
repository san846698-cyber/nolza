import type { Metadata } from "next";
import { buildAnimeMetadata } from "@/lib/anime-test";
import { ATTACK_ON_TITAN_CONFIG } from "@/lib/attack-on-titan-test";
import AttackOnTitanClient from "./AttackOnTitanClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildAnimeMetadata(ATTACK_ON_TITAN_CONFIG, sp.s, sp.lang);
}

export default function AttackOnTitanPage() {
  return <AttackOnTitanClient />;
}
