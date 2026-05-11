import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "우리 사이, 하늘이 정해놨다 — Friend Match";
export default function Image() {
  return gameOgImage("friend-match");
}
