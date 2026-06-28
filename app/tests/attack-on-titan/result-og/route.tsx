import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { ATTACK_ON_TITAN_CONFIG } from "@/lib/attack-on-titan-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const type = sp.get("type");
  const lang = sp.get("lang") === "en" ? "en" : "ko";
  const result = getAnimeResult(ATTACK_ON_TITAN_CONFIG, type);
  return result
    ? animeResultOg(ATTACK_ON_TITAN_CONFIG, result.key, lang)
    : animeDefaultOg(ATTACK_ON_TITAN_CONFIG, lang);
}
