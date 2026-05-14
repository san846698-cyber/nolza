"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-3027162336323004";
const SLOT_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";
const SLOT_BOTTOM = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? "";
const SLOT_MOBILE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE ?? "";
const SLOT_SIDE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE ?? "8829770332";

type AdPageType =
  | "homepage"
  | "content"
  | "test"
  | "mini-game"
  | "simulation"
  | "result";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const TEST_GAME_PATHS = new Set([
  "/games/kbti",
  "/games/mbti-depth",
  "/games/attachment",
  "/games/kdrama-couple",
  "/games/korean-name",
  "/games/korean-pronunciation",
  "/games/kpop",
  "/games/kpop-position",
  "/games/nunchi",
  "/games/saju",
  "/games/skintype",
  "/games/spicy",
  "/games/whatgeneration",
]);

const SIMULATION_GAME_PATHS = new Set([
  "/games/asteroid",
  "/games/aqua-fishing",
  "/games/circle",
  "/games/deep",
  "/games/inertia",
  "/games/resonance",
  "/games/scale",
  "/games/seoul-map",
  "/games/traffic",
]);

function pushAd() {
  try {
    if (typeof window !== "undefined") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch {
    // AdSense can fail when blocked by extensions or an invalid slot.
  }
}

function pageTypeForPath(pathname: string): AdPageType {
  if (pathname === "/") return "homepage";
  if (pathname.includes("/share-card")) return "result";
  if (!pathname.startsWith("/games/")) return "content";
  if (SIMULATION_GAME_PATHS.has(pathname)) return "simulation";
  if (TEST_GAME_PATHS.has(pathname)) return "test";
  return "mini-game";
}

function useAdPageType(): AdPageType {
  const pathname = usePathname() ?? "/";
  return useMemo(() => pageTypeForPath(pathname), [pathname]);
}

function canUseSideRails(pageType: AdPageType) {
  return pageType === "homepage" || pageType === "content";
}

// Real-ad mode: only render slots when a valid AdSense client id is set.
// Until then the components collapse so placeholder boxes never disrupt games.
export const HAS_REAL_ADS =
  CLIENT_ID.length > 0 && !CLIENT_ID.startsWith("ca-pub-XXX");

function AdFrame({
  children,
  className,
  maxWidth,
  minHeight,
  zone,
}: {
  children: React.ReactNode;
  className: string;
  maxWidth: number;
  minHeight: number;
  zone: "top" | "bottom" | "mobile-bottom";
}) {
  const pageType = useAdPageType();
  return (
    <div
      className={`ad-safe-zone ${className}`}
      data-ad-page-type={pageType}
      data-ad-zone={zone}
      style={{
        width: "100%",
        maxWidth,
        minHeight,
        marginInline: "auto",
      }}
    >
      {children}
    </div>
  );
}

export function AdTop() {
  useEffect(() => {
    if (HAS_REAL_ADS && SLOT_TOP) pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_TOP) return null;
  return (
    <AdFrame
      className="ad-inline ad-inline--top"
      maxWidth={728}
      minHeight={90}
      zone="top"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 728,
          height: 90,
          background: "transparent",
        }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_TOP}
      />
    </AdFrame>
  );
}

export function AdBottom() {
  useEffect(() => {
    if (HAS_REAL_ADS && SLOT_BOTTOM) pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_BOTTOM) return null;
  return (
    <AdFrame
      className="ad-inline ad-inline--bottom"
      maxWidth={336}
      minHeight={280}
      zone="bottom"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 336,
          height: 280,
          background: "transparent",
        }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_BOTTOM}
      />
    </AdFrame>
  );
}

// Historical name kept for existing pages. It is now an inline mobile-safe
// block, so it cannot cover controls, maps, canvases, result cards, or CTAs.
export function AdMobileSticky() {
  useEffect(() => {
    if (HAS_REAL_ADS && SLOT_MOBILE) pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_MOBILE) return null;
  return (
    <AdFrame
      className="ad-mobile-inline md:hidden"
      maxWidth={320}
      minHeight={50}
      zone="mobile-bottom"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: 320,
          maxWidth: "100%",
          height: 50,
          background: "transparent",
        }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_MOBILE}
      />
    </AdFrame>
  );
}

export function AdSideRails() {
  const pageType = useAdPageType();
  const railsAllowed = canUseSideRails(pageType);
  const [viewportAllowsRails, setViewportAllowsRails] = useState(false);
  const safeForRails = railsAllowed && viewportAllowsRails;

  useEffect(() => {
    if (!railsAllowed) return;

    const update = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const contentMax = pageType === "homepage" ? 1320 : 1120;
      const railWidth = 160;
      const railGutter = 24;
      const minimumSafeWidth = contentMax + railWidth * 2 + railGutter * 5;
      setViewportAllowsRails(
        viewportWidth >= Math.max(1760, minimumSafeWidth) &&
          viewportHeight >= 760,
      );
    };

    const frame = window.requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [pageType, railsAllowed]);

  useEffect(() => {
    if (!HAS_REAL_ADS || !SLOT_SIDE || !safeForRails) return;
    pushAd();
    pushAd();
  }, [safeForRails]);

  if (!HAS_REAL_ADS || !SLOT_SIDE || !safeForRails) return null;

  return (
    <div className="ad-side-rails" data-ad-page-type={pageType}>
      <aside className="ad-side-rail ad-side-rail--left">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: 160, height: 600 }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={SLOT_SIDE}
        />
      </aside>
      <aside className="ad-side-rail ad-side-rail--right">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: 160, height: 600 }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={SLOT_SIDE}
        />
      </aside>
    </div>
  );
}
