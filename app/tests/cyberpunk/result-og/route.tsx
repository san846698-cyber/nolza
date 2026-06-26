import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { CYBERPUNK_CONFIG } from "@/lib/cyberpunk-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type");
  const result = getAnimeResult(CYBERPUNK_CONFIG, type);
  return result ? animeResultOg(CYBERPUNK_CONFIG, result.key) : animeDefaultOg(CYBERPUNK_CONFIG);
}
