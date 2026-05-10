import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "애착 유형 테스트 — Attachment Style";
export default function Image() {
  return gameOgImage("attachment");
}
