import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "한국 이름 생성기 — Korean Name Generator";
export default function Image() {
  return gameOgImage("korean-name");
}
