import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "도박 심리학 — Psychology of Gambling";
export default function Image() {
  return gameOgImage("gambling");
}
