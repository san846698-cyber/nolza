import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { JUJUTSU_KAISEN_CONFIG } from "@/lib/jujutsu-kaisen-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type");
  const result = getAnimeResult(JUJUTSU_KAISEN_CONFIG, type);
  return result ? animeResultOg(JUJUTSU_KAISEN_CONFIG, result.key) : animeDefaultOg(JUJUTSU_KAISEN_CONFIG);
}
