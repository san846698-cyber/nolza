"use client";

import { useShareActions } from "@/hooks/useShareActions";
import type { SimpleLocale } from "@/hooks/useLocale";

type ResultActionsProps = {
  locale: SimpleLocale;
  title: string;
  text: string;
  url?: string;
  onReplay?: () => void;
  replayLabel?: string;
  compact?: boolean;
};

export default function ResultActions({
  locale,
  title,
  text,
  url,
  onReplay,
  replayLabel,
  compact = false,
}: ResultActionsProps) {
  const share = useShareActions({ title, text, url });
  const isKo = locale === "ko";

  return (
    <div className={`result-actions ${compact ? "result-actions--compact" : ""}`}>
      {onReplay && (
        <button type="button" className="result-actions__btn result-actions__btn--primary btn-press" onClick={onReplay}>
          {replayLabel ?? (isKo ? "한 판 더" : "Replay")}
        </button>
      )}
      <button type="button" className="result-actions__btn btn-press" onClick={share.copyLink}>
        {share.copied ? (isKo ? "링크 복사됨" : "Link copied") : (isKo ? "링크 복사" : "Copy link")}
      </button>
      <button type="button" className="result-actions__btn result-actions__btn--share btn-press" onClick={share.shareResult}>
        {share.shared
          ? isKo ? "공유됨" : "Shared"
          : share.copied
            ? isKo ? "공유문 복사됨" : "Share text copied"
            : isKo ? "친구한테 던지기" : "Send to a friend"}
      </button>
      {share.failed && (
        <span className="result-actions__note">
          {isKo ? "공유가 막혔어요. 주소창 링크를 복사해 주세요." : "Sharing failed. Please copy the address bar link."}
        </span>
      )}
    </div>
  );
}
