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
      <div className="mx-auto max-w-col px-4 py-9 sm:px-6 sm:py-11 lg:px-6 lg:py-10">
        <div className="mb-5 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 block font-inter text-[11px] font-black uppercase tracking-[0.18em] text-home-coral/80">
            {String(index).padStart(2, "0")}
            </span>
            <h2 className="m-0 font-serif text-[28px] font-black leading-[1.05] tracking-[-0.02em] text-home-ink sm:text-[34px]">
              {t(cat.labelKo, cat.labelEn)}
            </h2>
            <p className="mt-2.5 max-w-[58ch] text-[14.5px] font-medium leading-relaxed text-home-ink-2/72 sm:text-[15px]">
              {t(cat.subKo, cat.subEn)}
            </p>
          </div>
          <span className="w-max rounded-full border border-home-hairline bg-white/68 px-3.5 py-1.5 font-inter text-[11px] font-black tracking-[0.08em] text-home-muted shadow-[0_10px_24px_rgba(48,35,24,0.045)]">
            {String(games.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 lg:gap-5">
          {games.map((g, i) => (
            <GameTile key={g.id} game={g} no={i + 1} featured={cat.id === "featured"} />
          ))}
        </div>
      </div>
    </section>
  );
}
