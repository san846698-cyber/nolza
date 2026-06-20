export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ZeroStudio?: ZeroToStudioBrowserClient;
    ZeroToStudio?: ZeroToStudioBrowserClient;
  }
}

type ZeroToStudioBrowserClient = {
  track?: (
    eventType: "page_view" | "screen_view",
    properties?: Record<string, unknown>,
    options?: { pageUrl?: string; screenName?: string; platform?: "web" },
  ) => Promise<boolean>;
};

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const ZERO_TO_STUDIO_PROJECT_ID =
  process.env.NEXT_PUBLIC_ZERO_TO_STUDIO_PROJECT_ID ?? "";
export const ZERO_TO_STUDIO_ENDPOINT =
  process.env.NEXT_PUBLIC_ZERO_TO_STUDIO_ENDPOINT ?? "https://www.zerotostudio.com";
export const ZERO_TO_STUDIO_FEEDBACK_SLUG =
  process.env.NEXT_PUBLIC_ZERO_TO_STUDIO_FEEDBACK_SLUG ?? "nolza";

export function isAnalyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID && !GA_MEASUREMENT_ID.startsWith("G-XXXX"));
}

export function isZeroToStudioEnabled(): boolean {
  return Boolean(ZERO_TO_STUDIO_PROJECT_ID && ZERO_TO_STUDIO_ENDPOINT);
}

function cleanParams(params: AnalyticsParams = {}): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  ) as Record<string, string | number | boolean>;
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}): void {
  const cleanedParams = cleanParams(params);

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("event", eventName, cleanedParams);
    } catch {
      // Analytics must never break the product experience.
    }
  }

  trackZeroToStudioSignal(eventName, cleanedParams);
}

export function trackPageView(url: string): void {
  trackGooglePageView(url);
  trackZeroToStudioPageView(url);
}

export function trackGooglePageView(url: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "page_view", pageViewParams(url));
  } catch {
    // Ignore analytics failures.
  }
}

export function trackZeroToStudioPageView(url: string): void {
  const client = getZeroToStudioClient();
  if (!client?.track) {
    trackZeroToStudioPageViewDirect(url);
    return;
  }
  try {
    void client.track("page_view", pageViewParams(url), {
      pageUrl: `${window.location.origin}${url}`,
      platform: "web",
    });
  } catch {
    // Ignore analytics failures.
  }
}

function trackZeroToStudioPageViewDirect(url: string): void {
  if (typeof window === "undefined" || !isZeroToStudioEnabled()) return;

  try {
    const endpoint = `${ZERO_TO_STUDIO_ENDPOINT.replace(/\/$/, "")}/api/track`;
    const payload = {
      projectId: ZERO_TO_STUDIO_PROJECT_ID,
      eventType: "page_view",
      platform: "web",
      pageUrl: `${window.location.origin}${url}`,
      properties: pageViewParams(url),
    };

    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Ignore analytics failures.
  }
}

function trackZeroToStudioSignal(
  eventName: string,
  params: Record<string, string | number | boolean>,
): void {
  const client = getZeroToStudioClient();
  if (!client?.track) return;
  try {
    void client.track(
      "screen_view",
      {
        signal: eventName,
        ...params,
      },
      {
        screenName: eventName,
        platform: "web",
      },
    );
  } catch {
    // Ignore analytics failures.
  }
}

function getZeroToStudioClient() {
  if (typeof window === "undefined") return null;
  return window.ZeroStudio ?? window.ZeroToStudio ?? null;
}

function pageViewParams(url: string) {
  return {
    page_path: url,
    page_location: `${window.location.origin}${url}`,
    page_title: document.title,
    source: "nolza.fun",
  };
}

export function trackTestStart(testId: string, testName?: string): void {
  trackEvent("test_start", { test_id: testId, test_name: testName });
}

export function trackQuestionAnswered(testId: string, questionIndex: number): void {
  trackEvent("question_answered", { test_id: testId, question_index: questionIndex });
}

export function trackResultView(testId: string, resultName?: string): void {
  trackEvent("result_view", { test_id: testId, result_name: resultName });
}

export function trackRetryClick(contentId: string, contentType?: string): void {
  trackEvent("retry_click", { content_id: contentId, content_type: contentType });
}

export function trackShareClick(
  contentId: string,
  contentType?: string,
  resultName?: string,
): void {
  trackEvent("share_click", {
    content_id: contentId,
    content_type: contentType,
    result_name: resultName,
  });
}

export function trackGameStart(gameId: string, gameName?: string): void {
  trackEvent("game_start", { game_id: gameId, game_name: gameName });
}

export function trackGameComplete(
  gameId: string,
  params: { score?: number | string; level?: number | string; duration?: number | string } = {},
): void {
  trackEvent("game_complete", {
    game_id: gameId,
    score: params.score,
    level: params.level,
    duration: params.duration,
  });
}

export function trackRecommendationClick(
  sourceId: string,
  targetId: string,
  targetType?: string,
): void {
  trackEvent("recommendation_click", {
    source_id: sourceId,
    target_id: targetId,
    target_type: targetType,
  });
}
