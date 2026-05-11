import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0d",
        card: "#141414",
        border: "#222222",
        accent: "#FF3B30",
        // Home redesign palette — namespaced under `home-*` and `cat-*` /
        // `skin-*` so dark game pages keep using the existing dark tokens.
        home: {
          bg: "var(--home-bg)",
          paper: "var(--home-paper)",
          ink: "var(--home-ink)",
          "ink-2": "var(--home-ink-2)",
          muted: "var(--home-muted)",
          hairline: "var(--home-hairline)",
          "hairline-strong": "var(--home-hairline-strong)",
          injoo: "var(--home-injoo)",
        },
        cat: {
          play: "var(--cat-play)",
          self: "var(--cat-self)",
          sim: "var(--cat-sim)",
          world: "var(--cat-world)",
        },
        skin: {
          "block-1": "var(--skin-block-1)",
          "block-2": "var(--skin-block-2)",
          "block-3": "var(--skin-block-3)",
          "block-4": "var(--skin-block-4)",
          "block-5": "var(--skin-block-5)",
          "hand-1": "var(--skin-hand-1)",
          "hand-2": "var(--skin-hand-2)",
          "hand-3": "var(--skin-hand-3)",
          "pixel-bg": "var(--skin-pixel-bg)",
          "pixel-fg": "var(--skin-pixel-fg)",
          "pixel-accent": "var(--skin-pixel-accent)",
          sticker: "var(--skin-sticker-bg)",
          mono: "var(--skin-mono-bg)",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
        serif: ["var(--font-noto-serif-kr)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        inter: ["var(--font-inter)", "sans-serif"],
        fraunces: ["var(--font-fraunces)", "serif"],
        hand: ["var(--font-gaegu)", "var(--font-caveat)", "cursive"],
        pixel: ["var(--font-press-start)", "monospace"],
      },
      maxWidth: {
        col: "780px",
      },
    },
  },
  plugins: [],
};

export default config;
