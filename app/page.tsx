"use client";

import HomeHeader from "./components/home/Header";
import JumpNav from "./components/home/JumpNav";
import CategorySection from "./components/home/CategorySection";
import CuratedRail from "./components/home/CuratedRail";
import HomePublisherContent from "./components/home/HomePublisherContent";
import { useLocale } from "@/hooks/useLocale";
import {
  HOME_CATEGORY_GAME_IDS,
  HOME_RAILS,
  PUBLIC_CATEGORIES,
  gamesByIds,
} from "@/lib/games-home";

export default function Home() {
  const { t } = useLocale();
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
      <section className="home-recommendations" aria-labelledby="home-recommendations-title">
        <div className="home-recommendations__head">
          <p>{t("테스트 안내", "Test guide")}</p>
          <h2 id="home-recommendations-title">
            {t("nolza.fun에서 즐길 수 있는 테스트", "What you can play on nolza.fun")}
          </h2>
          <span>
            {t(
              "결과를 읽고 공유하기 좋은 대표 콘텐츠만 짧게 묶었습니다. 위의 전체 목록에서 바로 시작하고, 아래 안내는 어떤 테스트를 고를지 가볍게 참고해보세요.",
              "A short guide to the kinds of results you can share here. Start from the full list above, then use these notes when you want a quick pick.",
            )}
          </span>
        </div>
        {HOME_RAILS.map((rail) => (
          <CuratedRail key={rail.id} rail={rail} />
        ))}
      </section>
      <HomePublisherContent />
    </main>
  );
}
