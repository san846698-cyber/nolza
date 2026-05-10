import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "전쟁의 갈림길 — Crossroads of War";
export default function Image() {
  return gameOgImage("battle-what-if");
}
