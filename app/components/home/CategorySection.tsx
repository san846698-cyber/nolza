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
    <section
      id={cat.id}
      data-cat={cat.id}
      className="scroll-mt-[57px]"
    >
      <div className="mx-auto max-w-col px-4 py-10 sm:px-6 sm:py-14 lg:px-7">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="mb-8 flex items-end gap-4 sm:mb-10 sm:gap-5">
          {/* Big number — decorative */}
          <span
            className="hidden select-none font-serif font-black leading-none sm:block"
            aria-hidden
            style={{
              fontSize: "clamp(64px, 8vw, 96px)",
              color: "var(--border)",
              lineHeight: "0.9",
            }}
          >
            {String(index).padStart(2, "0")}
          </span>

          <div className="flex-1">
            {/* Mobile number */}
            <span
              className="mb-2 block font-inter text-[11px] font-black uppercase tracking-[0.2em] sm:hidden"
              style={{ color: "var(--accent-warm)" }}
            >
              {String(index).padStart(2, "0")}
            </span>

            <h2
              className="m-0 font-serif font-bold leading-[1.1] tracking-[-0.02em] [word-break:keep-all]"
              style={{
                fontSize: "clamp(24px, 4vw, 38px)",
                color: "var(--text-primary)",
              }}
            >
              {t(cat.labelKo, cat.labelEn)}
            </h2>

            <p
              className="mt-2 text-[14px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(cat.subKo, cat.subEn)}
            </p>
          </div>

          {/* Game count badge */}
          <span
            className="mb-0.5 shrink-0 self-end rounded-full border px-3 py-1 font-inter text-[11px] font-bold"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              background: "#FFFFFF",
            }}
          >
            {String(games.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Game grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {games.map((g, i) => (
            <GameTile
              key={g.id}
              game={g}
              no={i + 1}
              featured={cat.id === "featured"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
