import { animeDefaultOg } from "@/lib/anime-og";
import { ATTACK_ON_TITAN_CONFIG } from "@/lib/attack-on-titan-test";

export const runtime = "nodejs";
export const alt = "진격의 거인 캐릭터 테스트 — Attack on Titan Character Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return animeDefaultOg(ATTACK_ON_TITAN_CONFIG);
}
