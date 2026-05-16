"use client";

import { useShareActions } from "@/hooks/useShareActions";
import type { SimpleLocale } from "@/hooks/useLocale";
import { trackRetryClick, trackShareClick } from "@/lib/analytics";

type ResultActionsProps = {
  locale: SimpleLocale;
  title: string;
  text: string;
  url?: string;
  onReplay?: () => void;
  replayLabel?: string;
  compact?: boolean;
  contentId?: string;
  contentType?: string;
  resultName?: string;
};

export default function ResultActions({
  locale,
  title,
  text,
  url,
  onReplay,
  replayLabel,
  compact = false,
  contentId,
  contentType = "result",
  resultName,
}: ResultActionsProps) {
  const share = useShareActions({ title, text, url });
  const isKo = locale === "ko";
  const handleReplay = () => {
    if (contentId) trackRetryClick(contentId, contentType);
    onReplay?.();
  };
  const handleCopy = () => {
    if (contentId) trackShareClick(contentId, contentType, resultName);
    share.copyLink();
  };
  const handleShare = () => {
    if (contentId) trackShareClick(contentId, contentType, resultName);
    share.shareResult();
  };

  return (
    <div className={`result-actions ${compact ? "result-actions--compact" : ""}`}>
      <button type="button" className="result-actions__btn result-actions__btn--primary result-actions__btn--share btn-press" onClick={handleShare}>
        {share.shared
          ? isKo ? "\uACF5\uC720\uB428" : "Shared"
          : share.copied
            ? isKo ? "\uACF5\uC720 \uBB38\uAD6C \uBCF5\uC0AC\uB428" : "Share text copied"
            : isKo ? "\uACB0\uACFC \uACF5\uC720\uD558\uAE30" : "Share result"}
      </button>
      {onReplay && (
        <button type="button" className="result-actions__btn result-actions__btn--secondary btn-press" onClick={handleReplay}>
          {replayLabel ?? (isKo ? "\uB2E4\uC2DC \uD558\uAE30" : "Try again")}
        </button>
      )}
      <button type="button" className="result-actions__btn result-actions__btn--secondary btn-press" onClick={handleCopy}>
        {share.copied ? (isKo ? "\uB9C1\uD06C \uBCF5\uC0AC\uB428" : "Link copied") : (isKo ? "\uB9C1\uD06C \uBCF5\uC0AC\uD558\uAE30" : "Copy link")}
      </button>
      {share.failed && (
        <span className="result-actions__note">
          {isKo ? "\uACF5\uC720\uAC00 \uB9C9\uD614\uC5B4\uC694. \uC8FC\uC18C\uCC3D \uB9C1\uD06C\uB97C \uBCF5\uC0AC\uD574 \uC8FC\uC138\uC694." : "Sharing failed. Please copy the address bar link."}
        </span>
      )}
    </div>
  );
}
