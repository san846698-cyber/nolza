"use client";

import type { ReactNode } from "react";
import type { SimpleLocale } from "@/hooks/useLocale";
import { ShareCard } from "../ShareCard";
import RecommendedGames from "./RecommendedGames";
import ResultActions from "./ResultActions";

/** Card gradient theme per game family. */
export type ResultTone =
  | "light"
  | "dark"
  | "paper"
  | "navy"
  | "burgundy"
  | "midnight"
  | "rosegold"
  | "forest";

type ResultScreenProps = {
  locale: SimpleLocale;
  currentGameId: string;
  /** Small category tag shown above the title. */
  eyebrow?: string;
  /** Game name shown in the card header (top-right). */
  gameName?: string;
  /** Large emoji shown above the title. */
  emoji?: string;
  title: string;
  score?: string;
  scoreLabel?: string;
  description: string;
  /** Rendered as rounded tag pills. */
  details?: string[];
  /** Rendered INSIDE the captured card (becomes part of the saved image). */
  children?: ReactNode;
  /** Rendered BELOW the card, before the action buttons (NOT captured). */
  afterCard?: ReactNode;
  onReplay?: () => void;
  replayLabel?: string;
  shareTitle: string;
  shareText: string;
  shareUrl?: string;
  /** When provided, the primary share action becomes a Kakao button. */
  onKakaoShare?: () => void;
  kakaoLabel?: string;
  recommendedIds?: string[];
  tone?: ResultTone;
};

/** Background colour passed to html-to-image so the saved PNG isn't transparent. */
const TONE_CAPTURE_BG: Record<ResultTone, string> = {
  light: "#fbf7ee",
  paper: "#fbf7ee",
  navy: "#1A1A2E",
  dark: "#1A1A2E",
  midnight: "#08081A",
  burgundy: "#3D0A1E",
  rosegold: "#2E0E1A",
  forest: "#15241A",
};

export default function ResultScreen({
  locale,
  currentGameId,
  eyebrow,
  gameName,
  emoji,
  title,
  score,
  scoreLabel,
  description,
  details = [],
  children,
  afterCard,
  onReplay,
  replayLabel,
  shareTitle,
  shareText,
  shareUrl,
  onKakaoShare,
  kakaoLabel,
  recommendedIds,
  tone = "light",
}: ResultScreenProps) {
  const isLight = tone === "light" || tone === "paper";
  const brandLabel = locale === "ko" ? "놀자.fun" : "nolza.fun";

  return (
    <section className={`result-screen result-screen--${tone}`} aria-live="polite">
      <ShareCard
        filename={`nolza-${currentGameId}-result`}
        locale={locale}
        backgroundColor={TONE_CAPTURE_BG[tone]}
      >
        {({ cardRef }) => (
          <div ref={cardRef} className="result-screen__card" id="result-card">
            {/* Header: brand + game name */}
            <div className="result-screen__header">
              <span className="result-screen__brandmark">{brandLabel}</span>
              {gameName && (
                <span className="result-screen__gamename">{gameName}</span>
              )}
            </div>

            {emoji && (
              <div className="result-screen__emoji" aria-hidden>
                {emoji}
              </div>
            )}

            {eyebrow && <div className="result-screen__eyebrow">{eyebrow}</div>}
            <h2 className="result-screen__title">{title}</h2>

            {score && (
              <div className="result-screen__score">
                <span>{score}</span>
                {scoreLabel && <small>{scoreLabel}</small>}
              </div>
            )}

            <div className="result-screen__divider" aria-hidden />

            <p className="result-screen__desc">{description}</p>

            {details.length > 0 && (
              <ul className="result-screen__details">
                {details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {children}

            <div className="result-screen__brand">
              {isLight ? "nolza.fun" : "nolza.fun · 결과 카드"}
            </div>
          </div>
        )}
      </ShareCard>

      {afterCard}

      <ResultActions
        locale={locale}
        title={shareTitle}
        text={shareText}
        url={shareUrl}
        onReplay={onReplay}
        replayLabel={replayLabel}
        contentId={currentGameId}
        contentType="result"
        resultName={title}
        onKakaoShare={onKakaoShare}
        kakaoLabel={kakaoLabel}
      />

      <RecommendedGames currentId={currentGameId} ids={recommendedIds} />
    </section>
  );
}
