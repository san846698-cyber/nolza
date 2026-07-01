"use client";

import AnimeTestClient from "@/app/components/anime/AnimeTestClient";
import { ONE_PIECE_CONFIG } from "@/lib/one-piece-test";

export default function OnePieceClient() {
  return <AnimeTestClient config={ONE_PIECE_CONFIG} />;
}
