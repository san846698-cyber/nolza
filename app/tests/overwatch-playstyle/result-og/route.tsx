import { renderPlaystyleOg } from "@/lib/playstyle/og";
import { OVERWATCH_CONFIG } from "@/lib/playstyle/overwatch";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  return renderPlaystyleOg(OVERWATCH_CONFIG, new URL(req.url));
}
