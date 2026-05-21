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
      <section className="home-recommendations" aria-labelledby="home-recommendations-title">
        <div className="home-recommendations__head">
          <p>{t("오늘 바로 해보기", "Start here")}</p>
          <h2 id="home-recommendations-title">
            {t("인기 테스트와 추천 콘텐츠", "Popular tests and recommended picks")}
          </h2>
          <span>
            {t(
              "처음 방문했다면 결과를 읽고 바로 공유하기 좋은 테스트부터 골라보세요. 짧게 끝나지만 친구와 비교할 이야깃거리가 남는 콘텐츠를 먼저 모았습니다.",
              "If you are new, start with tests that are quick to finish and easy to share. These picks leave you with a result worth comparing with friends.",
            )}
          </span>
        </div>
        {HOME_RAILS.map((rail) => (
          <CuratedRail key={rail.id} rail={rail} />
        ))}
      </section>
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
      <HomePublisherContent />
    </main>
  );
}
