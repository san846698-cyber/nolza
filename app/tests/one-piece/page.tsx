import type { Metadata } from "next";
import { buildAnimeMetadata } from "@/lib/anime-test";
import { ONE_PIECE_CONFIG } from "@/lib/one-piece-test";
import OnePieceClient from "./OnePieceClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildAnimeMetadata(ONE_PIECE_CONFIG, sp.s, sp.lang);
}

export default function OnePiecePage() {
  return <OnePieceClient />;
}
