"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { T } from "@/lib/games-home";

export function HomeHeader() {
  const { locale, setLocale } = useLocale();
  const tx = T[locale];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--home-bg) 88%, transparent)",
        backdropFilter: "saturate(140%) blur(12px)",
        WebkitBackdropFilter: "saturate(140%) blur(12px)",
        borderBottom: "1px solid var(--home-hairline)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "14px clamp(20px, 4vw, 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            textDecoration: "none",
            color: "var(--home-ink)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-noto-serif-kr), serif",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "-0.02em",
            }}
          >
            놀자
          </span>
          <span
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 18,
              color: "var(--home-muted)",
            }}
          >
            .fun
          </span>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
          }}
        >
          <Link href="/" style={{ color: "var(--home-ink-2)", textDecoration: "none" }}>
            {tx.nav.games}
          </Link>
          <a
            href="#about"
            style={{ color: "var(--home-ink-2)", textDecoration: "none" }}
          >
            {tx.nav.about}
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              padding: "7px 12px",
              border: "1px solid var(--home-hairline-strong)",
              background: "transparent",
              color: "var(--home-ink)",
              cursor: "pointer",
            }}
          >
            {locale === "ko" ? "한 / EN" : "EN / 한"}
          </button>
        </div>
      </div>
    </header>
  );
}
