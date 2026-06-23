import { renderFootballOg } from "@/lib/football/og";
import { FOOTBALL_KR_CONFIG } from "@/lib/football/kr";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(req: Request) {
  return renderFootballOg(FOOTBALL_KR_CONFIG, new URL(req.url));
}
