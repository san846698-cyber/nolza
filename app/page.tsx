"use client";

import { useState, useEffect } from "react";
import HomeHeader from "./components/home/Header";
import JumpNav from "./components/home/JumpNav";
import CategorySection from "./components/home/CategorySection";
import HomePublisherContent from "./components/home/HomePublisherContent";
import {
  HOME_CATEGORY_GAME_IDS,
  PUBLIC_CATEGORIES,
  gamesByIds,
} from "@/lib/games-home";

export default function Home() {
  const sections = PUBLIC_CATEGORIES.map((cat) => ({
    cat,
    games: gamesByIds(HOME_CATEGORY_GAME_IDS[cat.id] ?? []),
  }))
    .filter((section) => section.games.length > 0)
    .map((section, i) => ({ ...section, index: i + 1 }));

  // 섹션 필터. "all" = 전체 표시, 그 외 = 해당 섹션만.
  const [selected, setSelected] = useState<string>("all");
  const visible =
    selected === "all"
      ? sections
      : sections.filter((section) => section.cat.id === selected);

  // 특정 섹션 선택 시, 그 섹션을 고정 네비 바로 아래로 스크롤(점프 없이 한눈에).
  // rAF로 필터 후 레이아웃이 잡힌 뒤 스크롤(타이밍 안정화).
  useEffect(() => {
    if (selected === "all") return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(selected);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [selected]);

  return (
    <main id="top" data-home>
      <HomeHeader />
      <JumpNav
        categories={sections.map((section) => section.cat)}
        active={selected}
        onSelect={setSelected}
      />
      <div className="pb-12 sm:pb-16">
        {visible.map(({ cat, games, index }) => (
          <CategorySection key={cat.id} cat={cat} index={index} games={games} />
        ))}
      </div>
      <HomePublisherContent />
    </main>
  );
}
