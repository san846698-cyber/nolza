import { animeDefaultOg } from "@/lib/anime-og";
import { JUJUTSU_KAISEN_CONFIG } from "@/lib/jujutsu-kaisen-test";

export const runtime = "nodejs";
export const alt = "주술회전 캐릭터 테스트 — Jujutsu Kaisen Character Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return animeDefaultOg(JUJUTSU_KAISEN_CONFIG);
}
