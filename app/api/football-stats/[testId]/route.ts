import { NextResponse } from "next/server";
import { getFootballConfig } from "@/lib/football/registry";
import { getResultCounts, incrementResult, isStatsEnabled } from "@/lib/kv-stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMPTY = { enabled: false, counts: {}, total: 0 } as const;

function withTotal(counts: Record<string, number>) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { enabled: true, counts, total };
}

type Ctx = { params: Promise<{ testId: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { testId } = await params;
  const config = getFootballConfig(testId);
  if (!config) return NextResponse.json({ error: "unknown test" }, { status: 404 });
  if (!isStatsEnabled()) return NextResponse.json(EMPTY);
  try {
    return NextResponse.json(withTotal(await getResultCounts(config.id)));
  } catch {
    return NextResponse.json(EMPTY);
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const { testId } = await params;
  const config = getFootballConfig(testId);
  if (!config) return NextResponse.json({ error: "unknown test" }, { status: 404 });
  if (!isStatsEnabled()) return NextResponse.json(EMPTY);
  let resultId = "";
  try {
    const body = (await req.json()) as { resultId?: string };
    resultId = String(body.resultId ?? "");
  } catch {
    // 잘못된 본문 → 아래 검증에서 400
  }
  if (!Object.prototype.hasOwnProperty.call(config.players, resultId)) {
    return NextResponse.json({ error: "invalid resultId" }, { status: 400 });
  }
  try {
    await incrementResult(config.id, resultId);
    return NextResponse.json(withTotal(await getResultCounts(config.id)));
  } catch {
    return NextResponse.json(EMPTY);
  }
}
