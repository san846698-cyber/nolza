"use client";

import { useEffect } from "react";

/**
 * AdSense 광고 슬롯.
 * 실제 운영 시 아래 환경 변수를 설정하면 자동으로 광고가 활성화됨.
 *   NEXT_PUBLIC_ADSENSE_CLIENT       (ex: ca-pub-1234567890123456)
 *   NEXT_PUBLIC_ADSENSE_SLOT_TOP
 *   NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM
 *   NEXT_PUBLIC_ADSENSE_SLOT_MOBILE
 * 미설정 상태에서는 컴포넌트가 null을 반환하여 회색 placeholder가 보이지 않음.
 */
const CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-3027162336323004";
const SLOT_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";
const SLOT_BOTTOM = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? "";
const SLOT_MOBILE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE ?? "";
const SLOT_SIDE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE ?? "8829770332";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function pushAd() {
  try {
    if (typeof window !== "undefined") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch {
    // AdSense not loaded or invalid client id — ignore.
  }
}

// Real-ad mode: only render the slot when a valid AdSense client id is set.
// Until then, AdTop/AdBottom collapse to nothing rather than showing a grey box
// that breaks every game's design.
export const HAS_REAL_ADS =
  CLIENT_ID.length > 0 && !CLIENT_ID.startsWith("ca-pub-XXX");

/* 728×90 leaderboard — 게임 UI 상단 */
export function AdTop() {
  useEffect(() => {
    if (HAS_REAL_ADS && SLOT_TOP) pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_TOP) return null;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 728,
        margin: "0 auto 16px",
        minHeight: 90,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: 728, height: 90, background: "transparent" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_TOP}
      />
    </div>
  );
}

/* 336×280 rectangle — 게임 UI 하단 (결과/공유 아래) */
export function AdBottom() {
  useEffect(() => {
    if (HAS_REAL_ADS && SLOT_BOTTOM) pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_BOTTOM) return null;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 336,
        margin: "24px auto 0",
        minHeight: 280,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: 336, height: 280, background: "transparent" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_BOTTOM}
      />
    </div>
  );
}

/* 320×50 mobile sticky — 화면 하단 고정 (모바일에서만) */
export function AdMobileSticky() {
  useEffect(() => {
    if (HAS_REAL_ADS && SLOT_MOBILE) pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_MOBILE) return null;
  return (
    <div
      className="ad-mobile-sticky flex md:hidden items-center justify-center"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 60,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 50,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: 320, height: 50, background: "transparent" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_MOBILE}
      />
    </div>
  );
}

export function AdSideRails() {
  useEffect(() => {
    if (!HAS_REAL_ADS || !SLOT_SIDE) return;
    pushAd();
    pushAd();
  }, []);
  if (!HAS_REAL_ADS || !SLOT_SIDE) return null;

  return (
    <div className="ad-side-rails">
      <aside className="ad-side-rail ad-side-rail--left">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: 160, minHeight: 600 }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={SLOT_SIDE}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
      <aside className="ad-side-rail ad-side-rail--right">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: 160, minHeight: 600 }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={SLOT_SIDE}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    </div>
  );
}
