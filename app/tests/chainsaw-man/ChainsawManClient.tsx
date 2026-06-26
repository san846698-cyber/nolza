"use client";

import AnimeTestClient from "@/app/components/anime/AnimeTestClient";
import { CHAINSAW_MAN_CONFIG } from "@/lib/chainsaw-man-test";

export default function ChainsawManClient() {
  return <AnimeTestClient config={CHAINSAW_MAN_CONFIG} />;
}
