"use client";

import type { CatId, Lang } from "@/lib/games-home";
import { GAMES, T } from "@/lib/games-home";
import { GameTile } from "./GameTile";
import { useLocale } from "@/hooks/useLocale";

interface Props {
  cat: CatId;
}

export function CategorySection({ cat }: Props) {
  const { locale } = useLocale();
  const tx = T[locale];
  const games = GAMES.filter((g) => g.cat === cat);

  if (games.length === 0) return null;

  return (
    <section
      style={{
        padding: "clamp(40px, 6vw, 96px) clamp(20px, 4vw, 56px)",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 40,
          paddingBottom: 18,
          borderBottom: "1px solid var(--home-hairline)",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "var(--home-muted)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {tx.section_en[cat]}
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily:
                locale === "ko"
                  ? "var(--font-noto-serif-kr), serif"
                  : "var(--font-fraunces), serif",
              fontWeight: locale === "ko" ? 700 : 400,
              fontStyle: locale === "ko" ? "normal" : "italic",
              fontSize: "clamp(36px, 5vw, 56px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--home-ink)",
            }}
          >
            {tx.section[cat]}
          </h2>
        </div>
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--home-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {games.length} {tx.count_unit}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
          gap: 20,
        }}
      >
        {games.map((g) => (
          <GameTile key={g.id} game={g} lang={locale as Lang} />
        ))}
      </div>
    </section>
  );
}
