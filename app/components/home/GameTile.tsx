"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { trackRecommendationClick } from "@/lib/analytics";
import Thumb from "./Thumb";
import type { ContentType, Game, HomeCatId, Skin } from "@/lib/games-home";

/* ── Category accent colours (pill + CTA text) ─────────────────────── */
const CAT_ACCENT: Record<HomeCatId | "default", string> = {
  featured:     "#2D5BE3",
  tests:        "#7C3AED",
  compatibility: "#DB2777",
  "mini-games": "#0891B2",
  default:      "#2D5BE3",
};

const TYPE_LABELS: Record<ContentType, { ko: string; en: string }> = {
  test:          { ko: "테스트",   en: "Test" },
  compatibility: { ko: "궁합",     en: "Match" },
  fortune:       { ko: "운세",     en: "Fortune" },
  game:          { ko: "게임",     en: "Game" },
};

const CTA_LABELS: Record<ContentType, { ko: string; en: string }> = {
  test:          { ko: "시작하기", en: "Start" },
  compatibility: { ko: "해보기",   en: "Try" },
  fortune:       { ko: "해보기",   en: "Try" },
  game:          { ko: "플레이",   en: "Play" },
};

function labelFor(game: Game, locale: "ko" | "en", featured = false) {
  if (featured) return locale === "ko" ? "대표 테스트" : "Featured";
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
  const accentColor = CAT_ACCENT[game.category ?? "default"] ?? CAT_ACCENT.default;

  const pillStyle: CSSProperties = {
    background: `${accentColor}12`,
    color: accentColor,
    border: `1px solid ${accentColor}28`,
  };
  const ctaStyle: CSSProperties = { color: accentColor };

  return (
    <Link
      href={game.href}
      onClick={() => trackRecommendationClick("homepage", game.id, game.type)}
      className={[
        "group relative isolate flex h-full flex-col overflow-hidden no-underline",
        "bg-white",
        "transition-[transform,box-shadow] duration-300",
        "hover:-translate-y-1",
      ].join(" ")}
      style={{
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow-hover)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow)")
      }
    >
      {/* ── Thumbnail 16:9 ──────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-[var(--easing)] group-hover:scale-[1.04]">
          <Thumb game={game} skin={skinKey} />
        </div>

        {/* Number badge */}
        <span
          className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 font-inter text-[10px] font-black leading-none tracking-[0.1em] backdrop-blur"
          style={{
            background: "rgba(255,255,255,0.88)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {String(no).padStart(2, "0")}
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Category pill */}
        <span
          className="mb-3 inline-block w-fit rounded-full px-2.5 py-1 font-inter text-[10.5px] font-black uppercase tracking-[0.1em]"
          style={pillStyle}
        >
          {labelFor(game, locale, featured)}
        </span>

        {/* Title */}
        <h3
          className="m-0 font-serif text-[18px] font-bold leading-[1.3] tracking-[-0.01em] sm:text-[19px] [word-break:keep-all]"
          style={{ color: "var(--text-primary)" }}
        >
          {t(game.ko.title, game.en.title)}
        </h3>

        {/* Description */}
        <p
          className="mt-2 flex-1 text-[13.5px] leading-[1.62] [word-break:keep-all] [overflow-wrap:anywhere]"
          style={{ color: "var(--text-secondary)" }}
        >
          {t(game.ko.sub, game.en.sub)}
        </p>

        {/* Footer row */}
        <div
          className="mt-4 flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {game.duration ? (
            <span
              className="font-inter text-[11px] font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(game.duration.ko, game.duration.en)}
            </span>
          ) : (
            <span aria-hidden className="w-4" />
          )}
          <span
            className="font-inter text-[12px] font-bold transition-transform duration-200 group-hover:translate-x-0.5"
            style={ctaStyle}
          >
            {ctaFor(game, locale)} →
          </span>
        </div>
      </div>
    </Link>
  );
}
