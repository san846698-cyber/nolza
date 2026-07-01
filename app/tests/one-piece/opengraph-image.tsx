import { animeDefaultOg } from "@/lib/anime-og";
import { ONE_PIECE_CONFIG } from "@/lib/one-piece-test";

export const runtime = "nodejs";
export const alt = "원피스 캐릭터 테스트 — One Piece Character Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return animeDefaultOg(ONE_PIECE_CONFIG);
}
