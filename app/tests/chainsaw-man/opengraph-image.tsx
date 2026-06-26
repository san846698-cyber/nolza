import { animeDefaultOg } from "@/lib/anime-og";
import { CHAINSAW_MAN_CONFIG } from "@/lib/chainsaw-man-test";

export const runtime = "nodejs";
export const alt = "체인소맨 캐릭터 테스트 — Chainsaw Man Character Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return animeDefaultOg(CHAINSAW_MAN_CONFIG);
}
