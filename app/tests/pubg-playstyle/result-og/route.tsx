import { renderPlaystyleOg } from "@/lib/playstyle/og";
import { PUBG_CONFIG } from "@/lib/playstyle/pubg";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  return renderPlaystyleOg(PUBG_CONFIG, new URL(req.url));
}
