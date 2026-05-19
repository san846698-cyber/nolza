"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { trackRecommendationClick } from "@/lib/analytics";
import Thumb from "./Thumb";
import type { ContentType, Game, HomeCatId, Skin } from "@/lib/games-home";

type Accent = {
  ink: string;
  soft: string;
  wash: string;
};

const ACCENTS: Record<HomeCatId | "default", Accent> = {
  featured: {
    ink: "#9A5A2C",
    soft: "rgba(154, 90, 44, 0.15)",
    wash: "rgba(255, 232, 200, 0.42)",
  },
  tests: {
    ink: "#7B5CB1",
    soft: "rgba(123, 92, 177, 0.14)",
    wash: "rgba(238, 232, 251, 0.42)",
  },
  compatibility: {
    ink: "#A84F45",
    soft: "rgba(168, 79, 69, 0.14)",
    wash: "rgba(255, 229, 223, 0.42)",
  },
  "mini-games": {
    ink: "#3D6C70",
    soft: "rgba(61, 108, 112, 0.14)",
    wash: "rgba(222, 241, 238, 0.42)",
  },
  default: {
    ink: "#7D5A34",
    soft: "rgba(125, 90, 52, 0.13)",
    wash: "rgba(250, 241, 224, 0.38)",
  },
};

const TYPE_LABELS: Record<ContentType, { ko: string; en: string }> = {
  test: { ko: "테스트", en: "Test" },
  compatibility: { ko: "관계", en: "Match" },
  fortune: { ko: "운세", en: "Fortune" },
  game: { ko: "게임", en: "Game" },
};

function labelFor(game: Game, locale: "ko" | "en") {
  if (game.type && TYPE_LABELS[game.type]) return TYPE_LABELS[game.type][locale];
  return locale === "ko" ? game.ko.kicker : game.en.kicker;
}

export default function GameTile({
  game,
  no,
  featured = false,
}: {
  game: Game;
  no: number;
  featured?: boolean;
}) {
  const { locale, t } = useLocale();
  const skinKey: Skin = game.skin ?? "paper";
  const accent = ACCENTS[game.category ?? "default"] ?? ACCENTS.default;
  const style = {
    "--card-accent": accent.ink,
    "--card-accent-soft": accent.soft,
    "--card-accent-wash": accent.wash,
  } as CSSProperties;

  return (
    <Link
      href={game.href}
      onClick={() => trackRecommendationClick("homepage", game.id, game.type)}
      style={style}
      className={[
        "group relative isolate flex min-h-[270px] flex-col overflow-hidden rounded-[24px] no-underline sm:min-h-[260px] lg:min-h-[246px]",
        "border border-[rgba(39,30,22,0.075)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94)_0%,rgba(255,251,244,0.88)_58%,rgba(252,243,229,0.78)_100%)]",
        "shadow-[0_14px_34px_rgba(48,35,24,0.075),0_1px_0_rgba(255,255,255,0.9)_inset]",
        "transition-[transform,box-shadow,border-color,background] duration-300 ease-[var(--home-easing)]",
        "hover:-translate-y-1 hover:border-[color:var(--card-accent-soft)] hover:bg-white hover:shadow-[0_24px_54px_rgba(48,35,24,0.13),0_1px_0_rgba(255,255,255,0.94)_inset]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-home-bg",
        featured ? "ring-1 ring-[color:var(--card-accent-soft)]" : "",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_22%_0%,var(--card-accent-wash),transparent_64%)] opacity-80"
      />

      <div className="relative p-3 pb-0 sm:p-3.5 sm:pb-0 lg:p-3 lg:pb-0">
        <div
          className={[
            "relative overflow-hidden rounded-[20px] border border-[rgba(39,30,22,0.075)]",
            "bg-[linear-gradient(145deg,rgba(255,255,255,0.72),var(--card-accent-wash))]",
            "aspect-[16/8.8] shadow-[0_1px_0_rgba(255,255,255,0.80)_inset,0_12px_26px_rgba(61,43,24,0.07)] lg:aspect-[16/7.9]",
          ].join(" ")}
        >
          <div className="absolute inset-[5px] overflow-hidden rounded-[15px] bg-home-paper">
            <div className="absolute inset-0 transition-transform duration-500 ease-[var(--home-easing)] group-hover:scale-[1.035]">
              <Thumb game={game} skin={skinKey} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,240,0.04)_0%,rgba(20,17,14,0.10)_100%)] opacity-70" />
          </div>

          <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-[rgba(255,252,246,0.84)] px-2.5 py-1 font-inter text-[10.5px] font-black leading-none tracking-[0.12em] text-home-ink shadow-[0_8px_18px_rgba(44,31,18,0.08)] backdrop-blur">
            {String(no).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-[18px] sm:pb-[18px] lg:px-4 lg:pb-4 lg:pt-3">
        <div className="mb-2 flex items-center gap-2 lg:mb-1.5">
          <span className="h-px w-5 bg-[color:var(--card-accent)] opacity-70" />
          <span className="font-inter text-[10.5px] font-black uppercase tracking-[0.14em] text-[color:var(--card-accent)]">
            {labelFor(game, locale)}
          </span>
        </div>

        <h3 className="m-0 font-serif text-[18.5px] font-bold leading-[1.18] tracking-[-0.01em] text-home-ink sm:text-[19px] lg:text-[18.5px]">
          {t(game.ko.title, game.en.title)}
        </h3>
        <p className="mt-2 text-[13.75px] font-medium leading-[1.55] text-home-ink-2/78 [word-break:keep-all] [overflow-wrap:anywhere] sm:text-[14px] lg:text-[13.5px]">
          {t(game.ko.sub, game.en.sub)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4 lg:pt-3">
          {game.duration ? (
            <span className="font-inter text-[11px] font-bold tracking-[0.06em] text-home-muted">
              {t(game.duration.ko, game.duration.en)}
            </span>
          ) : (
            <span aria-hidden className="h-px w-10 bg-home-hairline" />
          )}
          <span className="inline-flex h-9 items-center rounded-full border border-[color:var(--card-accent-soft)] bg-white/76 px-3.5 text-[12px] font-black text-home-ink shadow-[0_8px_18px_rgba(44,31,18,0.055)] transition-colors duration-300 group-hover:bg-[color:var(--card-accent)] group-hover:text-white lg:h-8 lg:text-[11.5px]">
            {locale === "ko" ? "열기" : "Open"}
          </span>
        </div>
      </div>
    </Link>
  );
}
