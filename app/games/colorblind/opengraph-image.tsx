import { gameOgImage } from "@/lib/og-template";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "nolza.fun — colorblind";
export default function Image() {
  return gameOgImage("colorblind");
}
