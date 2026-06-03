"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();

  const hasPageToggle =
    pathname === "/" ||
    pathname.startsWith("/games") ||
    pathname.startsWith("/tests/political-type") ||
    pathname === "/tests/kr-jp-signal" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/terms";

  if (hasPageToggle) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        setLocale(locale === "ko" ? "en" : "ko");
      }}
      aria-label={locale === "ko" ? "Switch to English" : "Switch to Korean"}
      className="locale-floating-toggle btn-press"
    >
      한 / EN
    </button>
  );
}
