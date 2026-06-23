import { renderFootballOg } from "@/lib/football/og";
import { FOOTBALL_GLOBAL_CONFIG } from "@/lib/football/global";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  return renderFootballOg(FOOTBALL_GLOBAL_CONFIG, new URL(req.url));
}
