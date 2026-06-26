import { animeDefaultOg, animeResultOg } from "@/lib/anime-og";
import { getAnimeResult } from "@/lib/anime-test";
import { CHAINSAW_MAN_CONFIG } from "@/lib/chainsaw-man-test";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type");
  const result = getAnimeResult(CHAINSAW_MAN_CONFIG, type);
  return result ? animeResultOg(CHAINSAW_MAN_CONFIG, result.key) : animeDefaultOg(CHAINSAW_MAN_CONFIG);
}
