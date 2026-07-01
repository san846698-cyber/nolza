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
    // 공유 링크의 ?lang= 가 최우선 — 외국 공유 링크(?lang=en)는 영어로 강제.
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === "ko" || urlLang === "en") return urlLang;
  } catch {
    /* ignore */
  }
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

// 영어 모드를 URL(?lang=en)에 반영한다. 주소창을 복사하거나 네이티브 공유로
// 현재 페이지를 보내도 항상 영어 OG 카드가 뜨도록 하기 위함(공유 신뢰성).
// history.replaceState 라 새로고침/히스토리 추가 없이 조용히 갱신한다.
function syncLangParam(locale: SimpleLocale) {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const current = url.searchParams.get("lang");
    if (locale === "en") {
      if (current === "en") return;
      url.searchParams.set("lang", "en");
    } else {
      if (current == null) return;
      url.searchParams.delete("lang");
    }
    window.history.replaceState(window.history.state, "", url.toString());
  } catch {
    /* ignore */
  }
}

export function useLocale() {
  const [locale, setLocaleState] = useState<SimpleLocale>("ko");

  useEffect(() => {
    const detected = detect();
    setLocaleState(detected);
    // 영어로 판정되면 URL 에도 ?lang=en 을 반영해 공유 링크가 영어로 뜨게 한다.
    if (detected === "en") syncLangParam("en");

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
    // 토글로 언어를 바꾸면 URL 의 ?lang 도 맞춰 갱신(영어면 추가, 한국어면 제거).
    syncLangParam(next);
  };

  const t = (ko: string, en: string): string => (locale === "ko" ? ko : en);

  return { locale, setLocale, t };
}
