import type { Metadata } from "next";
import { buildAnimeMetadata } from "@/lib/anime-test";
import { CHAINSAW_MAN_CONFIG } from "@/lib/chainsaw-man-test";
import ChainsawManClient from "./ChainsawManClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildAnimeMetadata(CHAINSAW_MAN_CONFIG, sp.s);
}

export default function ChainsawManPage() {
  return <ChainsawManClient />;
}
