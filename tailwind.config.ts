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
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
        serif: ["var(--font-noto-serif-kr)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
