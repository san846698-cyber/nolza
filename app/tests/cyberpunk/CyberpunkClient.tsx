"use client";

import AnimeTestClient from "@/app/components/anime/AnimeTestClient";
import { CYBERPUNK_CONFIG } from "@/lib/cyberpunk-test";

export default function CyberpunkClient() {
  return <AnimeTestClient config={CYBERPUNK_CONFIG} />;
}
