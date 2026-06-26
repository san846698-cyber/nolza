import { animeDefaultOg } from "@/lib/anime-og";
import { DEMON_SLAYER_CONFIG } from "@/lib/demon-slayer-test";

export const runtime = "nodejs";
export const alt = "귀멸의 칼날 캐릭터 테스트 — Demon Slayer Character Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return animeDefaultOg(DEMON_SLAYER_CONFIG);
}
