import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MBTI 심층 분석 — Deep MBTI Analysis";
export default function Image() {
  return gameOgImage("mbti-depth");
}
