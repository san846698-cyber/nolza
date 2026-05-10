import { ImageResponse } from "next/og";
import { GAMES, T, type Game, type Palette } from "@/lib/games-home";

export const OG_SIZE = { width: 1200, height: 630 } as const;

// Home pseudo-game used when slug === "home"
const HOME_PALETTE: Palette = {
  bg: "#0E0F12",
  paper: "#15171C",
  ink: "#F2EDE0",
  accent: "#E5C76B",
  sub: "#8A8478",
  line: "rgba(242,237,224,0.10)",
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700&display=swap";

let serifFontPromise: Promise<ArrayBuffer> | null = null;

// Load Noto Serif KR (700) directly from Google's static CDN.
// We resolve the .woff2 URL via the CSS file then fetch the binary.
async function loadSerifFont(): Promise<ArrayBuffer | null> {
  if (!serifFontPromise) {
    serifFontPromise = (async () => {
      const cssRes = await fetch(FONT_URL, {
        headers: {
          // Force a UA Google serves woff2 to.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
      });
      const css = await cssRes.text();
      // Pick the last (latin) src url for broad coverage.
      const match = css.match(/src:\s*url\((https:[^)]+\.woff2)\)/g);
      if (!match || match.length === 0) throw new Error("no font url");
      const last = match[match.length - 1];
      const url = last.match(/url\((https:[^)]+)\)/)![1];
      const fontRes = await fetch(url);
      return await fontRes.arrayBuffer();
    })();
  }
  try {
    return await serifFontPromise;
  } catch {
    serifFontPromise = null;
    return null;
  }
}

function findGame(slug: string): {
  no: string;
  kicker: string;
  titleKo: string;
  titleEn: string;
  sub: string;
  palette: Palette;
} {
  if (slug === "home") {
    return {
      no: "—",
      kicker: T.ko.tagline_top,
      titleKo: "놀자.fun",
      titleEn: "nolza.fun",
      sub: T.ko.title_sub,
      palette: HOME_PALETTE,
    };
  }
  const game: Game | undefined = GAMES.find(
    (g) => g.id === slug || g.href === `/games/${slug}`,
  );
  if (!game) {
    return {
      no: "—",
      kicker: "nolza.fun",
      titleKo: slug,
      titleEn: "",
      sub: "",
      palette: HOME_PALETTE,
    };
  }
  return {
    no: game.no,
    kicker: `${game.ko.kicker} · ${game.en.kicker}`,
    titleKo: game.ko.title,
    titleEn: game.en.title,
    sub: game.ko.sub,
    palette: game.palette,
  };
}

// A faint dotted "paper grain" overlay achieved with a CSS radial-gradient.
function grain(ink: string): string {
  // Convert the ink color to a low-alpha rgba dot.
  // We just use ink at ~6% via color-mix-style fallback.
  return `radial-gradient(${ink}10 1px, transparent 1px)`;
}

export async function gameOgImage(slug: string) {
  const { no, kicker, titleKo, titleEn, sub, palette } = findGame(slug);
  const font = await loadSerifFont();

  const isDark = isDarkBg(palette.bg);
  const accentInk = palette.accent;
  const corner = isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.04)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 88px",
          background: palette.bg,
          color: palette.ink,
          fontFamily: '"NotoSerifKR", serif',
          position: "relative",
        }}
      >
        {/* grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: grain(palette.ink),
            backgroundSize: "6px 6px",
            opacity: 0.5,
            display: "flex",
          }}
        />
        {/* corner block */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 280,
            height: 280,
            background: corner,
            display: "flex",
          }}
        />

        {/* Top: number + kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 22,
            color: accentInk,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "6px 14px",
              border: `2px solid ${accentInk}`,
              borderRadius: 4,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
            }}
          >
            № {no}
          </div>
          <div style={{ display: "flex", color: palette.sub }}>{kicker}</div>
        </div>

        {/* Middle: title */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: titleKo.length > 12 ? 96 : 120,
              fontWeight: 700,
              color: palette.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {titleKo}
          </div>
          {titleEn ? (
            <div
              style={{
                marginTop: 18,
                fontSize: 40,
                fontWeight: 500,
                color: accentInk,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                display: "flex",
                fontStyle: "italic",
              }}
            >
              {titleEn}
            </div>
          ) : null}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Sub line */}
        {sub ? (
          <div
            style={{
              fontSize: 32,
              color: palette.ink,
              opacity: 0.82,
              lineHeight: 1.35,
              display: "flex",
              maxWidth: "85%",
              zIndex: 1,
            }}
          >
            {sub}
          </div>
        ) : null}

        {/* Bottom row: hairline + wordmark */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${palette.line}`,
            paddingTop: 22,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: palette.sub,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            놀자 · A KOREAN INTERNET PLAYGROUND
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: accentInk,
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontFamily: "monospace",
            }}
          >
            nolza.fun
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font
        ? [
            {
              name: "NotoSerifKR",
              data: font,
              style: "normal",
              weight: 700,
            },
          ]
        : undefined,
    },
  );
}

function isDarkBg(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length < 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.5;
}
