// 결과 통계 집계 — Upstash / Vercel KV 의 REST API 를 SDK 없이 fetch 로 직접 호출.
// 환경변수(KV_REST_API_URL / KV_REST_API_TOKEN)가 없으면 모든 함수가 안전하게 비어있는 값을
// 반환하므로, 키 미설정 상태에서도 빌드·런타임이 깨지지 않고 UI 는 "집계 중"으로 폴백한다.
// 가짜 수치는 절대 만들지 않는다 — 실제 누적된 값만 노출한다.

const KV_URL =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

export type StatsCounts = Record<string, number>;

export function isStatsEnabled(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

async function kv(command: string[]): Promise<unknown> {
  if (!isStatsEnabled()) return null;
  const path = command.map(encodeURIComponent).join("/");
  const res = await fetch(`${KV_URL}/${path}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${command[0]} failed: ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result ?? null;
}

function key(testId: string): string {
  return `stats:${testId}`;
}

// 결과 1건 누적 (HINCRBY stats:{testId} {resultId} 1)
export async function incrementResult(testId: string, resultId: string): Promise<void> {
  await kv(["hincrby", key(testId), resultId, "1"]);
}

// 전체 결과 카운트 (HGETALL stats:{testId} → [field, val, field, val, ...])
export async function getResultCounts(testId: string): Promise<StatsCounts> {
  const raw = await kv(["hgetall", key(testId)]);
  const counts: StatsCounts = {};
  if (Array.isArray(raw)) {
    for (let i = 0; i + 1 < raw.length; i += 2) {
      const field = String(raw[i]);
      const n = Number(raw[i + 1]);
      if (Number.isFinite(n)) counts[field] = n;
    }
  }
  return counts;
}
