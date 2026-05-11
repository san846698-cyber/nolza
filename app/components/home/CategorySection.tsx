"use client";

import { useLocale } from "@/hooks/useLocale";
import GameTile from "./GameTile";
import type { Category, Game } from "@/lib/games-home";

export default function CategorySection({
  cat,
  index,
  games,
}: {
  cat: Category;
  index: number;
  games: Game[];
}) {
  const { t } = useLocale();

  return (
    <section id={cat.id} data-cat={cat.id} className="scroll-mt-[68px]">
      <div className="mx-auto max-w-col px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-baseline gap-3 mb-6 sm:mb-8">
          <span className="font-fraunces italic font-light text-2xl text-home-muted leading-none">
            {String(index).padStart(2, "0")}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight leading-none m-0 text-home-ink">
            {t(cat.labelKo, cat.labelEn)}
          </h2>
          <span className="font-fraunces italic font-light text-sm text-home-muted ml-1">
            / {cat.labelEn.toLowerCase()}
          </span>
          <span className="ml-auto font-mono text-[11px] text-home-muted">
            {String(games.length).padStart(2, "0")}
          </span>
        </div>
        <p className="font-fraunces italic text-home-ink-2 text-sm mb-6 pb-4 border-b border-home-hairline max-w-[44ch]">
          {t(cat.subKo, cat.subEn)}
        </p>

        <div className="grid gap-[var(--tile-gap,16px)] grid-cols-2 sm:grid-cols-3">
          {games.map((g, i) => (
            <GameTile key={g.id} game={g} no={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
