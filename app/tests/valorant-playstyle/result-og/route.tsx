import { renderPlaystyleOg } from "@/lib/playstyle/og";
import { VALORANT_CONFIG } from "@/lib/playstyle/valorant";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  return renderPlaystyleOg(VALORANT_CONFIG, new URL(req.url));
}
