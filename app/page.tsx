"use client";

import HomeHeader from "./components/home/Header";
import JumpNav from "./components/home/JumpNav";
import CategorySection from "./components/home/CategorySection";
import {
  FUTURE_TESTS,
  HOME_CATEGORY_GAME_IDS,
  PUBLIC_CATEGORIES,
  gamesByIds,
} from "@/lib/games-home";
import { useLocale } from "@/hooks/useLocale";

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
      <div className="pb-20">
        {sections.map(({ cat, games }, i) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            index={i + 1}
            games={games}
          />
        ))}
        <section className="mx-auto max-w-col px-4 pb-7 sm:px-6 lg:px-7">
          <div className="border border-home-hairline bg-home-paper px-4 py-5 shadow-[0_18px_48px_-34px_rgba(20,17,14,0.34)] sm:px-6 sm:py-6">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-home-ink-2">
                  {t("COMING SOON", "COMING SOON")}
                </p>
                <h2 className="mt-1.5 font-serif text-[25px] font-bold tracking-tight text-home-ink sm:text-[31px]">
                  {t("다음 테스트 준비 중", "More Tests in Progress")}
                </h2>
              </div>
              <p className="max-w-[44ch] font-fraunces text-[14.5px] italic leading-relaxed text-home-ink-2 sm:text-[15px]">
                {t(
                  "심리, 관계, 철학 테스트를 중심으로 더 선명하게 다듬고 있습니다.",
                  "Nolza is moving toward psychology, relationships, and philosophy-inspired tests.",
                )}
              </p>
            </div>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {FUTURE_TESTS.map((test) => (
                <div
                  key={test.ko}
                  className="flex min-h-[50px] items-center justify-between gap-2.5 border border-home-hairline bg-home-bg px-3.5 py-2.5"
                >
                  <span className="text-[14px] font-bold leading-snug text-home-ink sm:text-[14.75px]">
                    {t(test.ko, test.en)}
                  </span>
                  <em className="shrink-0 font-mono text-[10.5px] font-bold not-italic tracking-[0.14em] text-home-muted">
                    SOON
                  </em>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
