"use client";

import { useLocale } from "@/hooks/useLocale";
import GameTile from "./GameTile";
import type { Game, HomeCategory } from "@/lib/games-home";

export default function CategorySection({
  cat,
  index,
  games,
}: {
  cat: HomeCategory;
  index: number;
  games: Game[];
}) {
  const { t } = useLocale();

  return (
    <section id={cat.id} data-cat={cat.id} className="scroll-mt-[68px]">
      <div className="mx-auto max-w-col px-4 sm:px-6 lg:px-7 py-8 sm:py-[44px]">
        <div className="flex items-baseline gap-2.5 sm:gap-3.5 mb-3.5 sm:mb-5">
          <span className="font-fraunces italic font-light text-[25px] sm:text-[30px] text-home-muted leading-none">
            {String(index).padStart(2, "0")}
          </span>
          <h2 className="font-serif font-bold text-[27px] sm:text-[34px] tracking-tight leading-none m-0 text-home-ink">
            {t(cat.labelKo, cat.labelEn)}
          </h2>
          <span className="hidden sm:inline font-fraunces italic font-light text-[14px] text-home-muted ml-1">
            / {cat.labelEn.toLowerCase()}
          </span>
          <span className="ml-auto font-mono text-[12px] font-semibold text-home-ink-2">
            {String(games.length).padStart(2, "0")}
          </span>
        </div>
        <p className="font-fraunces italic text-home-ink-2 text-[14.5px] sm:text-[15.5px] leading-relaxed mb-5 sm:mb-6 pb-3.5 border-b border-home-hairline max-w-[58ch]">
          {t(cat.subKo, cat.subEn)}
        </p>

        <div className="grid gap-3.5 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {games.map((g, i) => (
            <GameTile key={g.id} game={g} no={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
