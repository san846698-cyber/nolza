"use client";

import { useLocale } from "@/hooks/useLocale";
import { T } from "@/lib/games-home";

export function HomeFooter() {
  const { locale } = useLocale();
  const tx = T[locale];

  return (
    <footer
      style={{
        borderTop: "1px solid var(--home-hairline)",
        padding: "40px clamp(20px, 4vw, 56px)",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 12,
        color: "var(--home-muted)",
        letterSpacing: "0.08em",
      }}
    >
      <div>{tx.footer_made}</div>
      <div style={{ display: "flex", gap: 22 }}>
        <a
          href="mailto:hello@nolza.fun"
          style={{ color: "var(--home-muted)", textDecoration: "none" }}
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
