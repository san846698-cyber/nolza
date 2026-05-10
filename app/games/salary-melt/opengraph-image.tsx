import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "월급 실시간 소멸 — Salary, Melting";
export default function Image() {
  return gameOgImage("salary-melt");
}
