import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "마리아나 해구 — Mariana Trench";
export default function Image() {
  return gameOgImage("deep");
}
