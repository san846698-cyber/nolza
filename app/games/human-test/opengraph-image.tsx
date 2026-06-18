import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "인간실격 테스트 — No Longer Human Test";
export default function Image() {
  return gameOgImage("human-test");
}
