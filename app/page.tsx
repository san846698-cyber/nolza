"use client";

import HomeHeader from "./components/home/Header";
import JumpNav from "./components/home/JumpNav";
import CategorySection from "./components/home/CategorySection";
import { CATEGORIES, GAMES } from "@/lib/games-home";

export default function Home() {
  return (
    <main id="top" data-home>
      <HomeHeader />
      <JumpNav categories={CATEGORIES} />
      <div className="pb-24">
        {CATEGORIES.map((cat, i) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            index={i + 1}
            games={GAMES.filter((g) => g.cat === cat.id)}
          />
        ))}
      </div>
    </main>
  );
}
