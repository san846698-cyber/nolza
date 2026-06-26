import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { DEMON_SLAYER_CONFIG } from "@/lib/demon-slayer-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type");
  const result = getAnimeResult(DEMON_SLAYER_CONFIG, type);
  return result ? animeResultOg(DEMON_SLAYER_CONFIG, result.key) : animeDefaultOg(DEMON_SLAYER_CONFIG);
}
