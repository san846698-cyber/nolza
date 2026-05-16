export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export function isAnalyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID && !GA_MEASUREMENT_ID.startsWith("G-XXXX"));
}

function cleanParams(params: AnalyticsParams = {}): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  ) as Record<string, string | number | boolean>;
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", eventName, cleanParams(params));
  } catch {
    // Analytics must never break the product experience.
  }
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: `${window.location.origin}${url}`,
      page_title: document.title,
    });
  } catch {
    // Ignore analytics failures.
  }
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
