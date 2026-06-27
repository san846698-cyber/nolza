"use client";

import type { CSSProperties, ReactNode } from "react";
import type { SimpleLocale } from "@/hooks/useLocale";
import { ShareCard } from "../ShareCard";
import RecommendedGames from "./RecommendedGames";
import ResultActions from "./ResultActions";
import { m, revealVariants, useReducedMotion } from "../motion/Motion";

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
  /** Per-result accent color (hex) — tints the card. Used by anime tests. */
  accentColor?: string;
  /** Large hero visual at the top of the card (replaces emoji). Used by anime tests. */
  heroMedia?: ReactNode;
  /** Result-reveal animation (card scale/fade + stagger). Off for mini-games. */
  reveal?: boolean;
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
  accentColor,
  heroMedia,
  reveal = true,
}: ResultScreenProps) {
  const isLight = tone === "light" || tone === "paper";
  const brandLabel = locale === "ko" ? "nolza.fun" : "nolza.fun";
  const reduce = useReducedMotion();
  const { container, item } = revealVariants(reveal && !reduce);

  return (
    <section
      className={`result-screen result-screen--${tone}${accentColor ? " result-screen--accent" : ""}`}
      aria-live="polite"
    >
      <ShareCard
        filename={`nolza-${currentGameId}-result`}
        locale={locale}
        backgroundColor={TONE_CAPTURE_BG[tone]}
        showButton
        buttonLabel={{ ko: "결과 이미지 저장", en: "Save result card" }}
        buttonClassName="result-screen__save-img btn-press"
        buttonStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "fit-content",
          margin: "18px auto 0",
          padding: "13px 26px",
          borderRadius: 999,
          border: "1.5px solid currentColor",
          background: "transparent",
          color: "inherit",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.03em",
          cursor: "pointer",
          minHeight: 46,
        }}
      >
        {({ cardRef }) => (
          <m.div
            ref={cardRef}
            className="result-screen__card"
            id="result-card"
            style={accentColor ? ({ "--rs-accent": accentColor } as CSSProperties) : undefined}
            initial="initial"
            animate="animate"
            variants={container}
          >
            {/* Header: brand + game name */}
            <div className="result-screen__header">
              <span className="result-screen__brandmark">{brandLabel}</span>
              {gameName && (
                <span className="result-screen__gamename">{gameName}</span>
              )}
            </div>

            {heroMedia ? (
              <m.div className="result-screen__hero" variants={item}>
                {heroMedia}
              </m.div>
            ) : (
              emoji && (
                <m.div className="result-screen__emoji" aria-hidden variants={item}>
                  {emoji}
                </m.div>
              )
            )}

            {eyebrow && <m.div className="result-screen__eyebrow" variants={item}>{eyebrow}</m.div>}
            <m.h2 className="result-screen__title" variants={item}>{title}</m.h2>

            {score && (
              <m.div className="result-screen__score" variants={item}>
                <span>{score}</span>
                {scoreLabel && <small>{scoreLabel}</small>}
              </m.div>
            )}

            <div className="result-screen__divider" aria-hidden />

            <m.p className="result-screen__desc" variants={item}>{description}</m.p>

            {details.length > 0 && (
              <m.ul className="result-screen__details" variants={item}>
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </m.ul>
            )}

            {children}

            <div className="result-screen__brand">
              {isLight ? "nolza.fun" : "nolza.fun · 결과 카드"}
            </div>
          </m.div>
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
