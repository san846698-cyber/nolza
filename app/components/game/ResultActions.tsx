"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useShareActions, type ShareChannelId } from "@/hooks/useShareActions";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const shareWrapRef = useRef<HTMLDivElement>(null);

  const track = () => {
    if (contentId) trackShareClick(contentId, contentType, resultName);
  };

  const handleReplay = () => {
    if (contentId) trackRetryClick(contentId, contentType);
    onReplay?.();
  };
  const handleKakao = () => {
    track();
    onKakaoShare?.();
  };

  // 공유 버튼 → 커스텀 메뉴 토글. (네이티브 공유 시트 + 해외 소셜 채널 + 링크 복사)
  const toggleMenu = () => setMenuOpen((v) => !v);
  const handleNative = () => {
    track();
    setMenuOpen(false);
    share.shareResult();
  };
  const handleChannel = (id: ShareChannelId) => {
    track();
    setMenuOpen(false);
    // anchor 기본 동작(새 탭)으로 채널 열림 — preventDefault 하지 않음.
    void id;
  };
  const handleCopy = () => {
    track();
    setMenuOpen(false);
    share.copyLink();
  };

  // 바깥 클릭 / Esc 로 메뉴 닫기.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (shareWrapRef.current && !shareWrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const shareBtnLabel = share.shared
    ? isKo ? "공유됨" : "Shared"
    : share.copied
      ? isKo ? "링크 복사됨!" : "Link copied!"
      : isKo ? "친구에게 공유하기" : "Share with friends";

  return (
    <div className={`result-actions ${compact ? "result-actions--compact" : ""}`}>
      {onKakaoShare ? (
        <button type="button" className="result-actions__btn result-actions__btn--kakao btn-press" onClick={handleKakao}>
          {isKo ? "친구에게 공유하기" : "Share with friends"}
        </button>
      ) : (
        <div ref={shareWrapRef} style={{ position: "relative", display: "flex" }}>
          <button
            type="button"
            className="result-actions__btn result-actions__btn--primary result-actions__btn--share btn-press"
            onClick={toggleMenu}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            {shareBtnLabel}
          </button>

          {menuOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: 0,
                minWidth: 220,
                background: "#ffffff",
                color: "#1a1a1a",
                borderRadius: 14,
                boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
                border: "1px solid rgba(0,0,0,0.08)",
                padding: 6,
                zIndex: 50,
              }}
            >
              {share.supportsNativeShare && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleNative}
                  style={menuItemStyle}
                  className="btn-press"
                >
                  <span style={{ ...dotStyle, background: "#6b7280" }}>＋</span>
                  {isKo ? "다른 앱으로 공유…" : "More apps…"}
                </button>
              )}

              {share.channels.map((c) => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => handleChannel(c.id)}
                  style={{ ...menuItemStyle, textDecoration: "none" }}
                  className="btn-press"
                >
                  <span style={{ ...dotStyle, background: c.color }} />
                  {c.label}
                </a>
              ))}

              <button
                type="button"
                role="menuitem"
                onClick={handleCopy}
                style={menuItemStyle}
                className="btn-press"
              >
                <span style={{ ...dotStyle, background: "#9ca3af" }}>🔗</span>
                {isKo ? "링크 복사" : "Copy link"}
              </button>
            </div>
          )}
        </div>
      )}

      {onReplay && (
        <button type="button" className="result-actions__btn result-actions__btn--secondary btn-press" onClick={handleReplay}>
          {replayLabel ?? (isKo ? "다시 분석하기" : "Analyze again")}
        </button>
      )}
      {share.failed && (
        <span className="result-actions__note">
          {isKo ? "공유가 막혔어요. 주소창 링크를 복사해 주세요." : "Sharing failed. Please copy the address bar link."}
        </span>
      )}
    </div>
  );
}

const menuItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 12px",
  border: "none",
  background: "transparent",
  borderRadius: 9,
  fontSize: 15,
  fontWeight: 700,
  color: "#1a1a1a",
  cursor: "pointer",
  textAlign: "left",
};

const dotStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: "50%",
  color: "#fff",
  fontSize: 12,
  flexShrink: 0,
};
