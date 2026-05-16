"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type FooterLocale = "ko" | "en" | "ja";

const CONTACT_EMAIL = "studio4any@gmail.com";
const STORAGE_KEY = "nolza_locale";
const LOCALE_CHANGE_EVENT = "nolza:locale-change";

const footerCopy: Record<
  FooterLocale,
  {
    aria: string;
    operated: string;
    contact: string;
    links: Array<{ href: string; label: string }>;
  }
> = {
  ko: {
    aria: "사이트 푸터",
    operated: "운영: Studio4Any",
    contact: "문의",
    links: [
      { href: "/about", label: "소개" },
      { href: "/contact", label: "문의" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/terms", label: "이용약관" },
    ],
  },
  en: {
    aria: "Site footer",
    operated: "Operated by Studio4Any",
    contact: "Contact",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  ja: {
    aria: "サイトフッター",
    operated: "運営: Studio4Any",
    contact: "お問い合わせ",
    links: [
      { href: "/about", label: "サイト紹介" },
      { href: "/contact", label: "お問い合わせ" },
      { href: "/privacy", label: "プライバシーポリシー" },
      { href: "/terms", label: "利用規約" },
    ],
  },
};

function normalizeLocale(value: unknown): FooterLocale | null {
  return value === "ko" || value === "en" || value === "ja" ? value : null;
}

function detectLocale(): FooterLocale {
  if (typeof window === "undefined") return "ko";
  try {
    const stored = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Ignore storage failures.
  }
  const language = navigator.language?.slice(0, 2).toLowerCase();
  if (language === "en") return "en";
  if (language === "ja") return "ja";
  return "ko";
}

export default function SiteFooter() {
  const pathname = usePathname() ?? "";
  const [locale, setLocale] = useState<FooterLocale>("ko");
  const isCompact = pathname.startsWith("/games/") || pathname.startsWith("/tests/");

  useEffect(() => {
    const refreshLocale = () => setLocale(detectLocale());
    const timer = window.setTimeout(refreshLocale, 0);

    const onCustom = (event: Event) => {
      const next = normalizeLocale((event as CustomEvent).detail);
      if (next) setLocale(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = normalizeLocale(event.newValue);
      if (next) setLocale(next);
    };

    window.addEventListener(LOCALE_CHANGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(LOCALE_CHANGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const copy = footerCopy[locale];

  return (
    <footer
      className={isCompact ? "site-footer site-footer--compact" : "site-footer"}
      aria-label={copy.aria}
      lang={locale}
    >
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>Nolza.fun</strong>
          <span>{copy.operated}</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {copy.contact}: {CONTACT_EMAIL}
          </a>
        </div>
        <nav className="site-footer__links" aria-label={copy.aria}>
          {copy.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="site-footer__copy">
          &copy; 2026 Nolza.fun / Studio4Any. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
