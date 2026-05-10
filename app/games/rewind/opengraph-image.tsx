import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "한국말 되감기 — Korean Rewind";
export default function Image() {
  return gameOgImage("rewind");
}
