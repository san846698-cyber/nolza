"use client";

import { HomeHeader } from "./components/home/Header";
import { HomeHero } from "./components/home/Hero";
import { HomeTicker } from "./components/home/Ticker";
import { CategorySection } from "./components/home/CategorySection";
import { HomeFooter } from "./components/home/Footer";

export default function Home() {
  return (
    <main data-home>
      <HomeHeader />
      <HomeHero />
      <HomeTicker />

      <CategorySection cat="play" />
      <CategorySection cat="self" />
      <CategorySection cat="sim" />
      <CategorySection cat="world" />

      <HomeFooter />
    </main>
  );
}
