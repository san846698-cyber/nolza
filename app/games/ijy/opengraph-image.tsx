import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "이재용 돈 다 써봐 — Spend Lee Jae-yong's Money";
export default function Image() {
  return gameOgImage("ijy");
}
