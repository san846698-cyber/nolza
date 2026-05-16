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
    <section id={cat.id} data-cat={cat.id} className="scroll-mt-[74px]">
      <div className="mx-auto max-w-col px-4 py-8 sm:px-6 sm:py-9 lg:px-6 lg:py-8">
        <div className="mb-5 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 block font-mono text-[11px] font-black uppercase tracking-[0.18em] text-home-muted">
            {String(index).padStart(2, "0")}
            </span>
            <h2 className="m-0 font-serif text-[28px] font-black leading-none tracking-[-0.025em] text-home-ink sm:text-[32px]">
              {t(cat.labelKo, cat.labelEn)}
            </h2>
            <p className="mt-2.5 max-w-[56ch] text-[14.5px] font-medium leading-relaxed text-home-ink-2/76 sm:text-[15px]">
              {t(cat.subKo, cat.subEn)}
            </p>
          </div>
          <span className="w-max rounded-full border border-home-hairline bg-white/52 px-3 py-1.5 font-mono text-[11px] font-black tracking-[0.08em] text-home-muted">
            {String(games.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[18px] lg:grid-cols-3">
          {games.map((g, i) => (
            <GameTile key={g.id} game={g} no={i + 1} featured={cat.id === "featured"} />
          ))}
        </div>
      </div>
    </section>
  );
}
