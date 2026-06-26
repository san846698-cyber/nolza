"use client";

import AnimeTestClient from "@/app/components/anime/AnimeTestClient";
import { DEMON_SLAYER_CONFIG } from "@/lib/demon-slayer-test";

export default function DemonSlayerClient() {
  return <AnimeTestClient config={DEMON_SLAYER_CONFIG} />;
}
