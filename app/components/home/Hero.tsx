"use client";

import { useLocale } from "@/hooks/useLocale";
import { GAMES, T } from "@/lib/games-home";

function formatDate(locale: "ko" | "en") {
  const d = new Date();
  if (locale === "ko") {
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function HomeHero() {
  const { locale } = useLocale();
  const tx = T[locale];
  const total = GAMES.length;
  const cats = new Set(GAMES.map((g) => g.cat)).size;

  return (
    <section
      style={{
        position: "relative",
        padding:
          "clamp(36px, 7vw, 88px) clamp(20px, 4vw, 56px) clamp(28px, 4vw, 56px)",
        maxWidth: 1440,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "end",
        gap: "clamp(20px, 4vw, 56px)",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily:
            locale === "ko"
              ? "var(--font-noto-serif-kr), serif"
              : "var(--font-fraunces), serif",
          fontWeight: locale === "ko" ? 700 : 300,
          fontStyle: locale === "ko" ? "normal" : "italic",
          fontSize: "clamp(56px, 10vw, 148px)",
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          color: "var(--home-ink)",
        }}
      >
        {locale === "ko" ? (
          <>
            심심하면
            <br />
            <span
              style={{
                color: "var(--home-injoo)",
                fontStyle: "italic",
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 300,
              }}
            >
              놀자.
            </span>
          </>
        ) : (
          <>
            When you&apos;re
            <br />
            <span style={{ color: "var(--home-injoo)" }}>bored.</span>
          </>
        )}
      </h1>

      <aside
        className="home-hero-meta"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 16,
          paddingBottom: 8,
          minWidth: 180,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--home-muted)",
          }}
        >
          {formatDate(locale)}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--home-ink)",
          }}
        >
          <span style={{ fontSize: 56, lineHeight: 1, letterSpacing: "-0.04em" }}>
            {String(total).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontStyle: "normal",
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--home-muted)",
            }}
          >
            {locale === "ko" ? "편의 놀이" : "plays live"}
          </span>
        </div>

        <div
          style={{
            height: 1,
            width: 80,
            background: "var(--home-hairline-strong)",
          }}
        />

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--home-muted)",
            textAlign: "right",
            maxWidth: 220,
            lineHeight: 1.6,
          }}
        >
          {tx.tagline_top}
          <br />
          <span style={{ color: "var(--home-ink-2)" }}>
            {cats} · {locale === "ko" ? "카테고리" : "chapters"}
          </span>
        </div>
      </aside>
    </section>
  );
}
