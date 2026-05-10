import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "도덕적 딜레마 — Moral Dilemma";
export default function Image() {
  return gameOgImage("dilemma");
}
