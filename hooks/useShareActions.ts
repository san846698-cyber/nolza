"use client";

import { useCallback, useMemo, useState } from "react";

type SharePayload = {
  title: string;
  text: string;
  url?: string;
};

function currentUrl(fallback?: string): string {
  if (typeof window === "undefined") return fallback ?? "https://nolza.fun";
  if (!fallback) return window.location.href;
  if (/^https?:\/\//.test(fallback)) return fallback;
  return `${window.location.origin}${fallback.startsWith("/") ? fallback : `/${fallback}`}`;
}

async function writeClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the selection-based copy path below.
    }
  }

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    try {
      if (document.execCommand("copy")) return;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  throw new Error("clipboard-unavailable");
}

export function useShareActions(payload: SharePayload) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [failed, setFailed] = useState(false);

  const url = useMemo(() => currentUrl(payload.url), [payload.url]);
  const fullText = useMemo(
    () => [payload.text, url].filter(Boolean).join("\n"),
    [payload.text, url],
  );

  const flash = useCallback((setter: (value: boolean) => void) => {
    setter(true);
    window.setTimeout(() => setter(false), 1800);
  }, []);

  const copyLink = useCallback(async () => {
    setFailed(false);
    try {
      await writeClipboard(url);
      flash(setCopied);
    } catch {
      setFailed(true);
    }
  }, [flash, url]);

  const copyText = useCallback(async () => {
    setFailed(false);
    try {
      await writeClipboard(fullText);
      flash(setCopied);
    } catch {
      setFailed(true);
    }
  }, [flash, fullText]);

  const shareResult = useCallback(async () => {
    setFailed(false);
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    const shareData: SharePayload = { title: payload.title, text: payload.text, url };
    // Web Share API 를 지원하면 기기 종류와 무관하게 항상 네이티브 공유 시트를 띄운다.
    // iOS·iPadOS(맥 UA로 보고됨)·맥 Safari/Chrome 에서 인스타·카톡·디코 등 설치된 앱이 시트에 뜬다.
    // 미지원 브라우저(데스크탑 Firefox 등)에서만 링크 복사로 폴백.
    const shareFn = (nav as Navigator & { share?: (d: SharePayload) => Promise<void> })?.share;
    const canShareFn = (nav as Navigator & { canShare?: (d: ShareData) => boolean })?.canShare;
    const canNativeShare =
      typeof shareFn === "function" &&
      (typeof canShareFn !== "function" || canShareFn.call(nav, shareData));
    try {
      if (canNativeShare && shareFn) {
        await shareFn.call(nav, shareData);
        flash(setShared);
        return;
      }
      await writeClipboard(url);
      flash(setCopied);
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      // 공유 실패 시에도 링크 복사로 폴백 — 항상 뭔가 되게.
      try {
        await writeClipboard(url);
        flash(setCopied);
      } catch {
        setFailed(true);
      }
    }
  }, [flash, payload.text, payload.title, url]);

  return {
    copied,
    shared,
    failed,
    url,
    copyLink,
    copyText,
    shareResult,
  };
}
