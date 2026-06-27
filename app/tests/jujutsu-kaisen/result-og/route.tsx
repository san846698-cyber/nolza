import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { JUJUTSU_KAISEN_CONFIG } from "@/lib/jujutsu-kaisen-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const type = sp.get("type");
  const lang = sp.get("lang") === "en" ? "en" : "ko";
  const result = getAnimeResult(JUJUTSU_KAISEN_CONFIG, type);
  return result ? animeResultOg(JUJUTSU_KAISEN_CONFIG, result.key, lang) : animeDefaultOg(JUJUTSU_KAISEN_CONFIG, lang);
}
