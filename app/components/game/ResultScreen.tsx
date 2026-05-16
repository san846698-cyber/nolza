"use client";

import type { ReactNode } from "react";
import type { SimpleLocale } from "@/hooks/useLocale";
import { ShareCard } from "../ShareCard";
import RecommendedGames from "./RecommendedGames";
import ResultActions from "./ResultActions";

type ResultScreenProps = {
  locale: SimpleLocale;
  currentGameId: string;
  eyebrow?: string;
  title: string;
  score?: string;
  scoreLabel?: string;
  description: string;
  details?: string[];
  children?: ReactNode;
  onReplay?: () => void;
  replayLabel?: string;
  shareTitle: string;
  shareText: string;
  shareUrl?: string;
  recommendedIds?: string[];
  tone?: "light" | "dark" | "paper";
};

export default function ResultScreen({
  locale,
  currentGameId,
  eyebrow,
  title,
  score,
  scoreLabel,
  description,
  details = [],
  children,
  onReplay,
  replayLabel,
  shareTitle,
  shareText,
  shareUrl,
  recommendedIds,
  tone = "light",
}: ResultScreenProps) {
  return (
    <section className={`result-screen result-screen--${tone}`} aria-live="polite">
      <ShareCard
        filename={`nolza-${currentGameId}-result`}
        locale={locale}
        backgroundColor={tone === "dark" ? "#141414" : "#fbf7ee"}
        buttonLabel={{ ko: "결과 카드 저장", en: "Save result card" }}
        buttonClassName="result-screen__image-btn btn-press"
      >
        {({ cardRef }) => (
          <div ref={cardRef} className="result-screen__card">
            {eyebrow && <div className="result-screen__eyebrow">{eyebrow}</div>}
            <h2 className="result-screen__title">{title}</h2>
            {score && (
              <div className="result-screen__score">
                <span>{score}</span>
                {scoreLabel && <small>{scoreLabel}</small>}
              </div>
            )}
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
              {locale === "ko" ? "nolza.fun · 결과 카드" : "nolza.fun · result card"}
            </div>
          </div>
        )}
      </ShareCard>

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
      />

      <RecommendedGames currentId={currentGameId} ids={recommendedIds} />
    </section>
  );
}
