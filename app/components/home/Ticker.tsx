"use client";

import Link from "next/link";
import { GAMES } from "@/lib/games-home";
import { useLocale } from "@/hooks/useLocale";

export function HomeTicker() {
  const { locale } = useLocale();
  const items = [...GAMES, ...GAMES];

  return (
    <div
      className="home-ticker-track"
      style={{
        borderTop: "1px solid var(--home-hairline)",
        borderBottom: "1px solid var(--home-hairline)",
        overflow: "hidden",
        background: "var(--home-bg-soft)",
        padding: "10px 0",
        position: "relative",
      }}
    >
      <div
        className="home-ticker-scroll"
        style={{ display: "flex", whiteSpace: "nowrap", width: "200%" }}
      >
        {items.map((g, i) => (
          <Link
            key={`${g.id}-${i}`}
            href={g.href}
            prefetch={false}
            className="home-ticker-link"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--home-ink-2)",
              padding: "0 22px",
              display: "inline-flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 13,
                letterSpacing: "0.04em",
                color: "var(--home-injoo)",
                textTransform: "none",
              }}
            >
              {g.no}
            </span>
            <span>{g[locale].title}</span>
            <span
              aria-hidden
              style={{ marginLeft: 14, color: "var(--home-hairline-strong)" }}
            >
              ·
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
