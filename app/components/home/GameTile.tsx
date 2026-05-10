"use client";

import Link from "next/link";
import { useState } from "react";
import type { Game, Lang } from "@/lib/games-home";
import { T } from "@/lib/games-home";
import { Thumb } from "./Thumb";

interface Props {
  game: Game;
  lang: Lang;
}

function titleFontFamily(lang: Lang, font: Game["font"]) {
  if (lang === "ko") {
    return font === "serif"
      ? "var(--font-noto-serif-kr), serif"
      : "var(--font-noto-sans-kr), sans-serif";
  }
  return font === "serif"
    ? "var(--font-fraunces), serif"
    : "var(--font-inter), sans-serif";
}

export function GameTile({ game, lang }: Props) {
  const t = game[lang];
  const p = game.palette;
  const tx = T[lang];
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={game.href}
      prefetch={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: p.bg,
        color: p.ink,
        border: `1px solid ${p.line}`,
        transition: "all 0.5s var(--home-easing)",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover
          ? `0 24px 48px -18px rgba(20,17,14,0.28), 0 0 0 1px ${p.accent}40`
          : "0 1px 2px rgba(20,17,14,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          padding: "20px 22px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 28,
            color: p.sub,
            lineHeight: 1,
          }}
        >
          {game.no}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 9,
            letterSpacing: "0.25em",
            color: p.sub,
            textTransform: "uppercase",
            textAlign: "right",
          }}
        >
          {t.kicker}
        </div>
      </div>

      <div
        style={{
          height: 180,
          margin: "14px 0 0",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.6s var(--home-easing)",
          transform: hover ? "scale(1.04)" : "scale(1)",
        }}
      >
        <Thumb src={game.thumb} alt={t.title} palette={p} no={game.no} kicker={t.kicker} />
      </div>

      <div
        style={{
          padding: "20px 22px 22px",
          borderTop: `1px solid ${p.line}`,
          marginTop: "auto",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: titleFontFamily(lang, game.font),
            fontWeight: game.font === "serif" ? 700 : 600,
            fontSize: "clamp(20px, 2.2vw, 26px)",
            lineHeight: 1.15,
            letterSpacing: lang === "ko" ? "-0.02em" : "-0.015em",
            color: p.ink,
          }}
        >
          {t.title}
        </h3>
        <p style={{ margin: "6px 0 14px", color: p.sub, fontSize: 13 }}>{t.sub}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 11,
            color: p.sub,
            letterSpacing: "0.08em",
          }}
        >
          <span
            style={{
              color: p.accent,
              fontWeight: 600,
              transition: "transform 0.3s",
              transform: hover ? "translateX(6px)" : "none",
            }}
          >
            {tx.play} →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeatureTile({ game, lang }: Props) {
  const t = game[lang];
  const p = game.palette;
  const tx = T[lang];
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={game.href}
      prefetch={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        background: p.bg,
        color: p.ink,
        border: `1px solid ${p.line}`,
        position: "relative",
        overflow: "hidden",
        minHeight: 380,
        textDecoration: "none",
        transition: "all 0.5s var(--home-easing)",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover
          ? `0 36px 72px -24px rgba(20,17,14,0.35), 0 0 0 1px ${p.accent}40`
          : "0 1px 2px rgba(20,17,14,0.06)",
      }}
    >
      <div className="home-grain" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
        }}
      >
        <div
          style={{
            padding: "clamp(24px, 3vw, 40px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontStyle: "italic",
                  fontSize: 32,
                  fontWeight: 300,
                  color: p.sub,
                }}
              >
                {game.no}
              </span>
              <span style={{ height: 1, flex: 1, background: p.line }} />
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: p.accent,
                }}
              >
                {tx.today}&apos;S PICK
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: p.sub,
                marginBottom: 20,
              }}
            >
              {t.kicker}
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: titleFontFamily(lang, game.font),
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: p.ink,
              }}
            >
              {t.title}
            </h2>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: "clamp(15px, 1.4vw, 17px)",
                color: p.sub,
                maxWidth: "90%",
                lineHeight: 1.55,
              }}
            >
              {t.sub}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: p.accent,
                color: p.bg,
                padding: "14px 22px",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.05em",
                transition: "transform 0.3s var(--home-easing)",
                transform: hover ? "translateX(4px)" : "none",
              }}
            >
              {tx.play} →
            </span>
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: hover ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.7s var(--home-easing)",
            }}
          >
            <Thumb src={game.thumb} alt={t.title} palette={p} no={game.no} kicker={t.kicker} />
          </div>
        </div>
      </div>
    </Link>
  );
}
