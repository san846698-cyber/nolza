import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "K팝 바이어스 토너먼트 — K-Pop Bias Tournament";
export default function Image() {
  return gameOgImage("bias");
}
