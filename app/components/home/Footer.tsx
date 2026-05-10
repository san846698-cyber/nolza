"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { T } from "@/lib/games-home";

export function HomeFooter() {
  const { locale } = useLocale();
  const tx = T[locale];

  const linkStyle = {
    color: "var(--home-muted)",
    textDecoration: "none",
  } as const;

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
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
        <Link href="/about" style={linkStyle}>
          {locale === "ko" ? "소개" : "About"}
        </Link>
        <Link href="/privacy" style={linkStyle}>
          {locale === "ko" ? "개인정보" : "Privacy"}
        </Link>
        <Link href="/terms" style={linkStyle}>
          {locale === "ko" ? "약관" : "Terms"}
        </Link>
        <a href="mailto:studio4any@gmail.com" style={linkStyle}>
          Contact
        </a>
      </div>
    </footer>
  );
}
