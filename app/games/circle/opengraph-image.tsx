import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "완벽한 원 그리기 — Draw a Perfect Circle";
export default function Image() {
  return gameOgImage("circle");
}
