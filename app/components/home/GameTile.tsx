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
  glow: string;
};

const ACCENTS: Record<HomeCatId | "default", Accent> = {
  featured: {
    ink: "#B45846",
    soft: "rgba(180, 88, 70, 0.16)",
    wash: "rgba(255, 231, 218, 0.52)",
    glow: "rgba(218, 109, 81, 0.12)",
  },
  tests: {
    ink: "#7A5AAF",
    soft: "rgba(122, 90, 175, 0.15)",
    wash: "rgba(236, 229, 251, 0.50)",
    glow: "rgba(122, 90, 175, 0.10)",
  },
  compatibility: {
    ink: "#B5525F",
    soft: "rgba(181, 82, 95, 0.16)",
    wash: "rgba(255, 226, 230, 0.50)",
    glow: "rgba(181, 82, 95, 0.11)",
  },
  "mini-games": {
    ink: "#3E7475",
    soft: "rgba(62, 116, 117, 0.15)",
    wash: "rgba(222, 243, 239, 0.50)",
    glow: "rgba(62, 116, 117, 0.10)",
  },
  default: {
    ink: "#8A623B",
    soft: "rgba(138, 98, 59, 0.14)",
    wash: "rgba(250, 239, 220, 0.48)",
    glow: "rgba(138, 98, 59, 0.10)",
  },
};

const TYPE_LABELS: Record<ContentType, { ko: string; en: string }> = {
  test: { ko: "테스트", en: "Test" },
  compatibility: { ko: "궁합", en: "Match" },
  fortune: { ko: "운세", en: "Fortune" },
  game: { ko: "게임", en: "Game" },
};

const CTA_LABELS: Record<ContentType, { ko: string; en: string }> = {
  test: { ko: "테스트하기", en: "Start" },
  compatibility: { ko: "해보기", en: "Try" },
  fortune: { ko: "해보기", en: "Try" },
  game: { ko: "플레이하기", en: "Play" },
};

function labelFor(game: Game, locale: "ko" | "en", featured = false) {
  if (featured) return locale === "ko" ? "대표 테스트" : "Featured Test";
  if (game.type && TYPE_LABELS[game.type]) return TYPE_LABELS[game.type][locale];
  return locale === "ko" ? game.ko.kicker : game.en.kicker;
}

function ctaFor(game: Game, locale: "ko" | "en") {
  if (game.type && CTA_LABELS[game.type]) return CTA_LABELS[game.type][locale];
  return locale === "ko" ? "해보기" : "Try";
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
    "--card-accent-glow": accent.glow,
  } as CSSProperties;

  return (
    <Link
      href={game.href}
      onClick={() => trackRecommendationClick("homepage", game.id, game.type)}
      style={style}
      className={[
        "group relative isolate flex h-full min-h-[326px] flex-col overflow-hidden rounded-[26px] no-underline",
        "border border-[rgba(39,30,22,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.97)_0%,rgba(255,250,242,0.94)_58%,rgba(250,239,224,0.86)_100%)]",
        "shadow-[0_18px_42px_rgba(48,35,24,0.085),0_1px_0_rgba(255,255,255,0.92)_inset]",
        "transition-[transform,box-shadow,border-color,background] duration-300 ease-[var(--home-easing)]",
        "hover:-translate-y-1 hover:border-[color:var(--card-accent-soft)] hover:bg-white hover:shadow-[0_26px_60px_rgba(48,35,24,0.14),0_1px_0_rgba(255,255,255,0.96)_inset]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--card-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-home-bg",
        featured ? "ring-1 ring-[color:var(--card-accent-soft)]" : "",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-24 rounded-b-full bg-[color:var(--card-accent-glow)] blur-2xl"
      />

      <div className="relative p-3.5 pb-0 sm:p-4 sm:pb-0">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-[rgba(39,30,22,0.075)] bg-[linear-gradient(145deg,rgba(255,255,255,0.76),var(--card-accent-wash))] shadow-[0_1px_0_rgba(255,255,255,0.82)_inset,0_14px_28px_rgba(61,43,24,0.075)]">
          <div className="absolute inset-[5px] overflow-hidden rounded-[17px] bg-home-paper">
            <div className="absolute inset-0 transition-transform duration-500 ease-[var(--home-easing)] group-hover:scale-[1.035]">
              <Thumb game={game} skin={skinKey} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,240,0.02)_0%,rgba(20,17,14,0.14)_100%)] opacity-60" />
          </div>

          <span className="absolute left-3 top-3 rounded-full border border-white/62 bg-[rgba(255,252,246,0.86)] px-2.5 py-1 font-inter text-[10.5px] font-black leading-none tracking-[0.12em] text-home-ink shadow-[0_8px_18px_rgba(44,31,18,0.08)] backdrop-blur">
            {String(no).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-[18px] pb-[18px] pt-4">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-px w-5 bg-[color:var(--card-accent)] opacity-72" />
          <span className="font-inter text-[11px] font-black uppercase tracking-[0.13em] text-[color:var(--card-accent)]">
            {labelFor(game, locale, featured)}
          </span>
        </div>

        <h3 className="m-0 text-[19px] font-black leading-[1.2] tracking-[-0.015em] text-home-ink sm:text-[20px]">
          {t(game.ko.title, game.en.title)}
        </h3>
        <p className="mt-2.5 text-[14.5px] font-semibold leading-[1.58] text-home-ink-2/78 [word-break:keep-all] [overflow-wrap:anywhere]">
          {t(game.ko.sub, game.en.sub)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {game.duration ? (
            <span className="font-inter text-[11px] font-black tracking-[0.06em] text-home-muted">
              {t(game.duration.ko, game.duration.en)}
            </span>
          ) : (
            <span aria-hidden className="h-px w-10 bg-home-hairline" />
          )}
          <span className="inline-flex h-9 items-center rounded-full border border-[color:var(--card-accent-soft)] bg-white/78 px-3.5 text-[12px] font-black text-home-ink shadow-[0_8px_18px_rgba(44,31,18,0.055)] transition-[background,color,border-color] duration-300 group-hover:border-[color:var(--card-accent)] group-hover:bg-[color:var(--card-accent)] group-hover:text-white">
            {ctaFor(game, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
