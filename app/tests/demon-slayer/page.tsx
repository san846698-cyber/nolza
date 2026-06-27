import type { Metadata } from "next";
import { buildAnimeMetadata } from "@/lib/anime-test";
import { DEMON_SLAYER_CONFIG } from "@/lib/demon-slayer-test";
import DemonSlayerClient from "./DemonSlayerClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildAnimeMetadata(DEMON_SLAYER_CONFIG, sp.s, sp.lang);
}

export default function DemonSlayerPage() {
  return <DemonSlayerClient />;
}
