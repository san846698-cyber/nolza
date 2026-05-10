import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "평균이 되어라 — Be Average";
export default function Image() {
  return gameOgImage("average");
}
