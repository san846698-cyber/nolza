"use client";

import AnimeTestClient from "@/app/components/anime/AnimeTestClient";
import { JUJUTSU_KAISEN_CONFIG } from "@/lib/jujutsu-kaisen-test";

export default function JujutsuKaisenClient() {
  return <AnimeTestClient config={JUJUTSU_KAISEN_CONFIG} />;
}
