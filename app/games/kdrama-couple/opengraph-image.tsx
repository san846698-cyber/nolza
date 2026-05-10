import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "K드라마 커플 — Your K-Drama Couple";
export default function Image() {
  return gameOgImage("kdrama-couple");
}
