"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import BrandMark, { brandText, homeBackLabel } from "@/app/components/BrandMark";
import PublisherContent from "@/app/components/PublisherContent";
import { GAMES, type CatId } from "@/lib/games-home";

const SECTION_NO: Record<CatId, string> = {
  play: "01",
  self: "02",
  sim: "03",
  world: "04",
};

const SECTION_LABEL: Record<CatId, { ko: string; en: string }> = {
  play: { ko: "도전", en: "Challenge" },
  self: { ko: "진단", en: "Know Yourself" },
  sim: { ko: "체험", en: "Live It" },
  world: { ko: "탐험", en: "Explore" },
};

const DARK_GAME_IDS = new Set([
  "silence",
  "deep",
  "saju",
  "dilemma",
  "gambling",
  "highnote",
  "timeline",
  "asteroid",
  "battle-what-if",
  "aqua-fishing",
]);

const MINIMAL_HEADER_GAME_IDS = new Set([
  "aqua-fishing",
  "traffic",
  "friend-match",
  "react",
  "attachment",
  "kbti",
  "ahmolla",
]);

const NO_LAYOUT_CHROME_GAME_IDS = new Set(["auction", "mbti-depth"]);

function getSectionLabel(id: string, cat: CatId, locale: "ko" | "en") {
  if (id === "korean-name") {
    return locale === "ko" ? " · 이름 테스트" : " · Name Test";
  }
  return SECTION_LABEL[cat][locale];
}

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname() || "";
  const segments = pathname.replace(/^\/games\/?/, "").split("/").filter(Boolean);
  const id = segments[0] ?? "";
  const game = GAMES.find((g) => g.id === id);
  const isDark = DARK_GAME_IDS.has(id);
  const isMinimal = MINIMAL_HEADER_GAME_IDS.has(id);
  const isNoChrome = NO_LAYOUT_CHROME_GAME_IDS.has(id);

  if (isNoChrome) {
    return (
      <div data-game-shell={isDark ? "dark" : "light"} style={{ minHeight: "100svh" }}>
        {children}
        <PublisherContent />
      </div>
    );
  }

  const fallbackTitle = id
    ? id
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")
    : "놀이";

  if (isMinimal) {
    const floatingBtnBase: React.CSSProperties = {
      position: "fixed",
      zIndex: 70,
      height: 44,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      background: "rgba(15, 23, 42, 0.65)",
      color: "#f8fafc",
      lineHeight: 1,
      textDecoration: "none",
      border: "1px solid rgba(248, 250, 252, 0.2)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      cursor: "pointer",
      fontFamily: "var(--font-inter), sans-serif",
    };

    return (
      <div data-game-shell={isDark ? "dark" : "light"} style={{ minHeight: "100svh" }}>
        <Link
          href="/"
          aria-label={brandText(locale)}
          className="game-shell-floating-brand"
          style={{
            ...floatingBtnBase,
            top: "max(12px, calc(env(safe-area-inset-top, 0px) + 8px))",
            left: "50%",
            transform: "translateX(-50%)",
            width: "auto",
            padding: "0 14px",
            fontSize: 18,
            fontWeight: 900,
            color: isDark ? "#f8fafc" : "#1f1b16",
            background: isDark ? "rgba(15, 23, 42, 0.65)" : "rgba(255, 253, 247, 0.78)",
          }}
        >
          <BrandMark locale={locale} />
        </Link>
        <Link
          href="/"
          aria-label={homeBackLabel(locale)}
          className="game-shell-floating-back"
          style={{
            ...floatingBtnBase,
            top: "max(12px, calc(env(safe-area-inset-top, 0px) + 8px))",
            left: "max(12px, calc(env(safe-area-inset-left, 0px) + 8px))",
            width: "auto",
            padding: "0 14px",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {homeBackLabel(locale)}
        </Link>
        <button
          type="button"
          className="game-shell-floating-toggle"
          onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
          style={{
            ...floatingBtnBase,
            top: "max(12px, calc(env(safe-area-inset-top, 0px) + 8px))",
            left:
              locale === "ko"
                ? "max(132px, calc(env(safe-area-inset-left, 0px) + 128px))"
                : "max(190px, calc(env(safe-area-inset-left, 0px) + 186px))",
            padding: "0 12px",
            minWidth: 44,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          한 / EN
        </button>
        {children}
        <PublisherContent />
      </div>
    );
  }

  return (
    <div data-game-shell={isDark ? "dark" : "light"} style={{ minHeight: "100svh" }}>
      <header className="game-shell-bar">
        <div className="game-shell-bar__inner">
          <Link href="/" className="game-shell-brand" aria-label={brandText(locale)}>
            <BrandMark locale={locale} className="brand-mark--shell" />
          </Link>

          <div className="game-shell-meta" aria-hidden={!game}>
            {game ? (
              <>
                <span className="game-shell-meta__no">{SECTION_NO[game.cat]}</span>
                <span className="game-shell-meta__sep" />
                <span className="game-shell-meta__title">{game[locale].title}</span>
                <span className="game-shell-meta__section" style={{ marginLeft: 14 }}>
                  {getSectionLabel(id, game.cat, locale)}
                </span>
              </>
            ) : (
              <span className="game-shell-meta__title">{fallbackTitle}</span>
            )}
          </div>

          <div className="game-shell-actions">
            <Link href="/" className="game-shell-back">
              {homeBackLabel(locale)}
            </Link>
            <button
              type="button"
              className="game-shell-toggle"
              onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
              aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
            >
              한 / EN
            </button>
          </div>
        </div>
      </header>

      {children}
      <PublisherContent />
    </div>
  );
}
