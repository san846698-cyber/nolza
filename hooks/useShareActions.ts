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
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { share?: unknown }).share === "function"
      ) {
        await (
          navigator as Navigator & {
            share: (data: SharePayload) => Promise<void>;
          }
        ).share({
          title: payload.title,
          text: payload.text,
          url,
        });
        flash(setShared);
        return;
      }
      await writeClipboard(fullText);
      flash(setCopied);
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      setFailed(true);
    }
  }, [flash, fullText, payload.text, payload.title, url]);

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
