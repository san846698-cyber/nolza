import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "한국판 비밀번호 게임 — Korean Password Game";
export default function Image() {
  return gameOgImage("password");
}
