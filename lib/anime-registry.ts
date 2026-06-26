import type { AnimeTestConfig } from "@/lib/anime-test";
import { DEMON_SLAYER_CONFIG } from "@/lib/demon-slayer-test";
import { JUJUTSU_KAISEN_CONFIG } from "@/lib/jujutsu-kaisen-test";
import { CHAINSAW_MAN_CONFIG } from "@/lib/chainsaw-man-test";
import { CYBERPUNK_CONFIG } from "@/lib/cyberpunk-test";

// testId → config (stats API / 공용 조회용).
export const ANIME_TESTS: Record<string, AnimeTestConfig> = {
  [DEMON_SLAYER_CONFIG.testId]: DEMON_SLAYER_CONFIG,
  [JUJUTSU_KAISEN_CONFIG.testId]: JUJUTSU_KAISEN_CONFIG,
  [CHAINSAW_MAN_CONFIG.testId]: CHAINSAW_MAN_CONFIG,
  [CYBERPUNK_CONFIG.testId]: CYBERPUNK_CONFIG,
};

export function getAnimeConfig(testId: string | undefined): AnimeTestConfig | null {
  return testId ? ANIME_TESTS[testId] ?? null : null;
}
