import type { FootballTestConfig } from "./engine";
import { FOOTBALL_KR_CONFIG } from "./kr";
import { FOOTBALL_GLOBAL_CONFIG } from "./global";

// 축구 테스트 레지스트리 — API 라우트/OG 가 testId 로 설정을 조회한다.
export const FOOTBALL_CONFIGS: Record<string, FootballTestConfig> = {
  [FOOTBALL_KR_CONFIG.id]: FOOTBALL_KR_CONFIG,
  [FOOTBALL_GLOBAL_CONFIG.id]: FOOTBALL_GLOBAL_CONFIG,
};

export function getFootballConfig(id: string | undefined): FootballTestConfig | null {
  return id ? FOOTBALL_CONFIGS[id] ?? null : null;
}
