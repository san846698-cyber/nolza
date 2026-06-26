import { animeDefaultOg } from "@/lib/anime-og";
import { CYBERPUNK_CONFIG } from "@/lib/cyberpunk-test";

export const runtime = "nodejs";
export const alt = "사이버펑크 엣지러너 캐릭터 테스트 — Cyberpunk: Edgerunners Character Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return animeDefaultOg(CYBERPUNK_CONFIG);
}
