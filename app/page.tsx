"use client";

import { useLocale } from "@/hooks/useLocale";
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
        <HomeFooter />
      </div>
    </main>
  );
}

function HomeFooter() {
  const { t } = useLocale();
  return (
    <footer className="mx-auto max-w-col px-4 sm:px-6 mt-16 sm:mt-20 pt-9 pb-14 border-t border-home-hairline flex flex-wrap justify-between gap-4 font-inter text-xs text-home-muted tracking-wide">
      <span>nolza · 2026 · studio4any@gmail.com</span>
      <span className="font-hand text-[22px] text-home-ink-2">
        {t("서울에서 만들었어요", "made with care in Seoul")}
      </span>
    </footer>
  );
}
