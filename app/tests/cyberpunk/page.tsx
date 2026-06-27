import type { Metadata } from "next";
import { buildAnimeMetadata } from "@/lib/anime-test";
import { CYBERPUNK_CONFIG } from "@/lib/cyberpunk-test";
import CyberpunkClient from "./CyberpunkClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildAnimeMetadata(CYBERPUNK_CONFIG, sp.s, sp.lang);
}

export default function CyberpunkPage() {
  return <CyberpunkClient />;
}
