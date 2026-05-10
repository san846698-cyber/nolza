"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { GAMES, T, type CatId } from "@/lib/games-home";

const SECTION_NO: Record<CatId, string> = {
  play: "01",
  self: "02",
  sim: "03",
  world: "04",
};

const SECTION_LABEL: Record<CatId, { ko: string; en: string }> = {
  play: { ko: "도전", en: "Challenge" },
  self: { ko: "진단", en: "Know Yourself" },
  sim: { ko: "시뮬", en: "Live It" },
  world: { ko: "탐험", en: "Explore" },
};

// Games whose canvas is intentionally dark — keep chrome dark to match.
const DARK_GAME_IDS = new Set([
  "silence", "deep", "saju", "dilemma", "gambling",
  "highnote", "timeline", "asteroid", "battle-what-if",
  "aqua-fishing",
]);

// Games that hide the full header and show only a floating back button.
// (Games here either render their own topbar, or want full-bleed canvas.)
const MINIMAL_HEADER_GAME_IDS = new Set(["aqua-fishing", "traffic", "friend-match"]);

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
  const tx = T[locale];

  const fallbackTitle = id
    ? id
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")
    : "놀자";

  if (isMinimal) {
    return (
      <div data-game-shell={isDark ? "dark" : "light"} style={{ minHeight: "100vh" }}>
        <Link
          href="/"
          aria-label={locale === "ko" ? "모든 놀이로" : "All plays"}
          style={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 70,
            width: 40,
            height: 40,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.65)",
            color: "#f8fafc",
            fontSize: 22,
            lineHeight: 1,
            textDecoration: "none",
            border: "1px solid rgba(248, 250, 252, 0.2)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          ←
        </Link>
        {children}
      </div>
    );
  }

  return (
    <div
      data-game-shell={isDark ? "dark" : "light"}
      style={{ minHeight: "100vh" }}
    >
      <header className="game-shell-bar">
        <div className="game-shell-bar__inner">
          <Link href="/" className="game-shell-brand" aria-label="놀자.fun">
            <span className="game-shell-brand__name">놀자</span>
            <span className="game-shell-brand__dot">.fun</span>
          </Link>

          <div className="game-shell-meta" aria-hidden={!game}>
            {game ? (
              <>
                <span className="game-shell-meta__no">
                  {SECTION_NO[game.cat]}
                </span>
                <span className="game-shell-meta__sep" />
                <span className="game-shell-meta__title">
                  {game[locale].title}
                </span>
                <span
                  className="game-shell-meta__section"
                  style={{ marginLeft: 14 }}
                >
                  {SECTION_LABEL[game.cat][locale]}
                </span>
              </>
            ) : (
              <span className="game-shell-meta__title">{fallbackTitle}</span>
            )}
          </div>

          <div className="game-shell-actions">
            <Link href="/" className="game-shell-back">
              {locale === "ko" ? "← 모든 놀이" : "← All plays"}
            </Link>
            <button
              type="button"
              className="game-shell-toggle"
              onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
              aria-label={
                locale === "ko" ? "Switch to English" : "한국어로 전환"
              }
            >
              {locale === "ko" ? "한 / EN" : "EN / 한"}
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
