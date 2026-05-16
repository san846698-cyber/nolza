"use client";

import HomeHeader from "./components/home/Header";
import JumpNav from "./components/home/JumpNav";
import CategorySection from "./components/home/CategorySection";
import {
  HOME_CATEGORY_GAME_IDS,
  PUBLIC_CATEGORIES,
  gamesByIds,
} from "@/lib/games-home";

export default function Home() {
  const sections = PUBLIC_CATEGORIES.map((cat) => ({
    cat,
    games: gamesByIds(HOME_CATEGORY_GAME_IDS[cat.id] ?? []),
  })).filter((section) => section.games.length > 0);

  return (
    <main id="top" data-home>
      <HomeHeader />
      <JumpNav categories={sections.map((section) => section.cat)} />
      <div className="pb-12 sm:pb-16">
        {sections.map(({ cat, games }, i) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            index={i + 1}
            games={games}
          />
        ))}
      </div>
    </main>
  );
}
