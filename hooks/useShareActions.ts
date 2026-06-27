"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SharePayload = {
  title: string;
  text: string;
  url?: string;
};

/** Social channels offered in the desktop fallback menu, ordered by global share volume. */
export type ShareChannelId =
  | "whatsapp"
  | "facebook"
  | "x"
  | "telegram"
  | "reddit"
  | "line";

const SHARE_CHANNEL_ORDER: ShareChannelId[] = [
  "whatsapp",
  "facebook",
  "x",
  "telegram",
  "reddit",
  "line",
];

export const SHARE_CHANNEL_META: Record<
  ShareChannelId,
  { label: string; color: string }
> = {
  whatsapp: { label: "WhatsApp", color: "#25D366" },
  facebook: { label: "Facebook", color: "#1877F2" },
  x: { label: "X", color: "#000000" },
  telegram: { label: "Telegram", color: "#229ED9" },
  reddit: { label: "Reddit", color: "#FF4500" },
  line: { label: "LINE", color: "#06C755" },
};

function channelHref(id: ShareChannelId, payload: SharePayload, url: string): string {
  const u = encodeURIComponent(url);
  const text = encodeURIComponent(payload.text);
  const title = encodeURIComponent(payload.title);
  const textUrl = encodeURIComponent([payload.text, url].filter(Boolean).join("\n"));
  switch (id) {
    case "whatsapp":
      return `https://wa.me/?text=${textUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "x":
      return `https://twitter.com/intent/tweet?text=${text}&url=${u}`;
    case "telegram":
      return `https://t.me/share/url?url=${u}&text=${text}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${u}&title=${title}`;
    case "line":
      return `https://social-plugins.line.me/lineit/share?url=${u}`;
  }
}

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

  const [supportsNativeShare, setSupportsNativeShare] = useState(false);

  const url = useMemo(() => currentUrl(payload.url), [payload.url]);
  const fullText = useMemo(
    () => [payload.text, url].filter(Boolean).join("\n"),
    [payload.text, url],
  );

  // 클라이언트에서만 Web Share 지원 여부 판정(SSR hydration mismatch 방지).
  useEffect(() => {
    setSupportsNativeShare(
      typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { share?: unknown }).share === "function",
    );
  }, []);

  // 데스크탑 폴백 메뉴용 채널 링크 — 해외 공유량 많은 순.
  const channels = useMemo(
    () =>
      SHARE_CHANNEL_ORDER.map((id) => ({
        id,
        label: SHARE_CHANNEL_META[id].label,
        color: SHARE_CHANNEL_META[id].color,
        href: channelHref(id, payload, url),
      })),
    [payload, url],
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
    supportsNativeShare,
    channels,
    copyLink,
    copyText,
    shareResult,
  };
}
