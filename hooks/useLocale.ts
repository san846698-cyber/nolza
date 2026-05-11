"use client";

import { useEffect, useState } from "react";

export type SimpleLocale = "ko" | "en";

const STORAGE_KEY = "nolza_locale";
const LOCALE_CHANGE_EVENT = "nolza:locale-change";

// Default-language policy: the site is Korean-first. A saved choice in
// localStorage wins. Otherwise we only switch to English when the browser
// clearly prefers English (navigator.language / navigator.languages starts
// with "en"). Every other locale — including the Korean default and any
// other regional language — falls back to Korean so the site reads in its
// primary language by default.
function detect(): SimpleLocale {
  if (typeof window === "undefined") return "ko";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  const langs: string[] = [];
  if (typeof navigator !== "undefined") {
    if (Array.isArray(navigator.languages)) langs.push(...navigator.languages);
    if (navigator.language) langs.push(navigator.language);
  }
  for (const raw of langs) {
    const code = (raw || "").slice(0, 2).toLowerCase();
    if (code === "ko") return "ko";
    if (code === "en") return "en";
  }
  return "ko";
}

export function useLocale() {
  const [locale, setLocaleState] = useState<SimpleLocale>("ko");

  useEffect(() => {
    setLocaleState(detect());

    // In-tab broadcast: every useLocale instance hears the same custom event,
    // so toggling in one component updates every other consumer immediately.
    const onCustom = (e: Event) => {
      const next = (e as CustomEvent<SimpleLocale>).detail;
      if (next === "ko" || next === "en") setLocaleState(next);
    };
    // Cross-tab sync via the standard storage event.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "ko" || e.newValue === "en")) {
        setLocaleState(e.newValue);
      }
    };

    window.addEventListener(LOCALE_CHANGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LOCALE_CHANGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setLocale = (next: SimpleLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    try {
      window.dispatchEvent(
        new CustomEvent<SimpleLocale>(LOCALE_CHANGE_EVENT, { detail: next }),
      );
    } catch {
      /* ignore */
    }
  };

  const t = (ko: string, en: string): string => (locale === "ko" ? ko : en);

  return { locale, setLocale, t };
}
