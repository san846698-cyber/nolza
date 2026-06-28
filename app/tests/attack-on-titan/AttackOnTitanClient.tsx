"use client";

import AnimeTestClient from "@/app/components/anime/AnimeTestClient";
import { ATTACK_ON_TITAN_CONFIG } from "@/lib/attack-on-titan-test";

export default function AttackOnTitanClient() {
  return <AnimeTestClient config={ATTACK_ON_TITAN_CONFIG} />;
}
