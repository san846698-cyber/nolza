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
  /** When provided, the primary action becomes a Kakao share button. */
  onKakaoShare?: () => void;
  kakaoLabel?: string;
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
  onKakaoShare,
}: ResultActionsProps) {
  const share = useShareActions({ title, text, url });
  const isKo = locale === "ko";
  const handleReplay = () => {
    if (contentId) trackRetryClick(contentId, contentType);
    onReplay?.();
  };
  const handleShare = () => {
    if (contentId) trackShareClick(contentId, contentType, resultName);
    share.shareResult();
  };
  const handleKakao = () => {
    if (contentId) trackShareClick(contentId, contentType, resultName);
    onKakaoShare?.();
  };

  return (
    <div className={`result-actions ${compact ? "result-actions--compact" : ""}`}>
      {onKakaoShare ? (
        <button type="button" className="result-actions__btn result-actions__btn--kakao btn-press" onClick={handleKakao}>
          {isKo ? "\uCE5C\uAD6C\uC5D0\uAC8C \uACF5\uC720\uD558\uAE30" : "Share with friends"}
        </button>
      ) : (
        <button type="button" className="result-actions__btn result-actions__btn--primary result-actions__btn--share btn-press" onClick={handleShare}>
          {share.shared
            ? isKo ? "\uACF5\uC720\uB428" : "Shared"
            : share.copied
              ? isKo ? "\uB9C1\uD06C \uBCF5\uC0AC\uB428!" : "Link copied!"
              : isKo ? "\uCE5C\uAD6C\uC5D0\uAC8C \uACF5\uC720\uD558\uAE30" : "Share with friends"}
        </button>
      )}
      {onReplay && (
        <button type="button" className="result-actions__btn result-actions__btn--secondary btn-press" onClick={handleReplay}>
          {replayLabel ?? (isKo ? "\uB2E4\uC2DC \uBD84\uC11D\uD558\uAE30" : "Analyze again")}
        </button>
      )}
      {share.failed && (
        <span className="result-actions__note">
          {isKo ? "\uACF5\uC720\uAC00 \uB9C9\uD614\uC5B4\uC694. \uC8FC\uC18C\uCC3D \uB9C1\uD06C\uB97C \uBCF5\uC0AC\uD574 \uC8FC\uC138\uC694." : "Sharing failed. Please copy the address bar link."}
        </span>
      )}
    </div>
  );
}
