import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { ONE_PIECE_CONFIG } from "@/lib/one-piece-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const type = sp.get("type");
  const lang = sp.get("lang") === "en" ? "en" : "ko";
  const result = getAnimeResult(ONE_PIECE_CONFIG, type);
  return result ? animeResultOg(ONE_PIECE_CONFIG, result.key, lang) : animeDefaultOg(ONE_PIECE_CONFIG, lang);
}
