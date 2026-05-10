import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "조선시대 나라면 — If I Lived in Joseon";
export default function Image() {
  return gameOgImage("joseon");
}
