"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();

  // The home page and game routes both render their own toggle inside their
  // headers — skip the floating fallback so we don't show two pickers.
  if (pathname === "/" || pathname.startsWith("/games")) return null;

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
      className="btn-press"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 20,
        padding: "8px 16px",
        cursor: "pointer",
        color: "white",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.04em",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        transition: "background 0.15s ease, transform 0.1s ease",
      }}
    >
      {locale === "ko" ? "🇺🇸 EN" : "🇰🇷 KO"}
    </button>
  );
}
