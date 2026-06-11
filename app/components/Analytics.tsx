"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import {
  GA_MEASUREMENT_ID,
  isAnalyticsEnabled,
  isZeroToStudioEnabled,
  trackGooglePageView,
  trackZeroToStudioPageView,
} from "@/lib/analytics";

const analyticsEnabled = isAnalyticsEnabled();
const zeroToStudioEnabled = isZeroToStudioEnabled();

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastGooglePageView = useRef("");
  const lastZeroToStudioPageView = useRef("");

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (analyticsEnabled && lastGooglePageView.current !== url) {
      trackGooglePageView(url);
      lastGooglePageView.current = url;
    }

    if (zeroToStudioEnabled && lastZeroToStudioPageView.current !== url) {
      trackZeroToStudioPageView(url);
      lastZeroToStudioPageView.current = url;
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  if (!analyticsEnabled && !zeroToStudioEnabled) return null;

  return (
    <>
      {analyticsEnabled ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
