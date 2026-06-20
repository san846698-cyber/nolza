"use client";

import type { ReactNode } from "react";
import type { SimpleLocale } from "@/hooks/useLocale";
import { ShareCard } from "../ShareCard";
import RecommendedGames from "./RecommendedGames";
import ResultActions from "./ResultActions";

/** Card theme per game family (clean solid colors — no gradients). */
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
  eyebrow?: string;
  gameName?: string;
  emoji?: string;
  title: string;
  score?: string;
  scoreLabel?: string;
  description: string;
  details?: string[];
  children?: ReactNode;
  afterCard?: ReactNode;
  onReplay?: () => void;
  replayLabel?: string;
  shareTitle: string;
  shareText: string;
  shareUrl?: string;
  onKakaoShare?: () => void;
  kakaoLabel?: string;
  recommendedIds?: string[];
  tone?: ResultTone;
};

const TONE: Record<ResultTone, { bg: string; accent: string }> = {
  light: { bg: "#ffffff", accent: "#4f46e5" },
  paper: { bg: "#ffffff", accent: "#4f46e5" },
  navy: { bg: "#0f172a", accent: "#818cf8" },
  dark: { bg: "#0d0d0d", accent: "#f87171" },
  burgundy: { bg: "#1e1b4b", accent: "#a5b4fc" },
  midnight: { bg: "#0c0a1f", accent: "#e6c878" },
  rosegold: { bg: "#2a0e1e", accent: "#fda4af" },
  forest: { bg: "#0b1f17", accent: "#6ee7b7" },
};

const TONE_CAPTURE_BG = Object.fromEntries(
  Object.entries(TONE).map(([k, v]) => [k, v.bg]),
) as Record<ResultTone, string>;

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
  const tk = TONE[tone];

  const c = isLight
    ? {
        bg: tk.bg,
        fg: "#1b1726",
        sub: "#6b7280",
        line: "#ececf3",
        accent: tk.accent,
        chipBg: "#f5f3ff",
        chipFg: "#4f46e5",
        chipBorder: "#e7e5ff",
        shadow: "0 18px 44px rgba(17,14,40,0.10)",
        border: "1px solid #efeef5",
      }
    : {
        bg: tk.bg,
        fg: "#ffffff",
        sub: "rgba(255,255,255,0.72)",
        line: "rgba(255,255,255,0.16)",
        accent: tk.accent,
        chipBg: "rgba(255,255,255,0.08)",
        chipFg: "rgba(255,255,255,0.92)",
        chipBorder: "rgba(255,255,255,0.16)",
        shadow: "0 22px 50px rgba(17,14,40,0.30)",
        border: "none",
      };

  return (
    <section className={`result-screen result-screen--${tone}`} aria-live="polite">
      <ShareCard
        filename={`nolza-${currentGameId}-result`}
        locale={locale}
        backgroundColor={TONE_CAPTURE_BG[tone]}
      >
        {({ cardRef }) => (
          <div
            ref={cardRef}
            id="result-card"
            className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] px-7 py-9 text-center sm:px-9"
            style={{
              background: c.bg,
              color: c.fg,
              boxShadow: c.shadow,
              border: c.border,
              fontFamily: "var(--font-pretendard)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[15px] font-extrabold tracking-tight" style={{ color: c.fg }}>
                {brandLabel}
              </span>
              {gameName && (
                <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: c.sub }}>
                  {gameName}
                </span>
              )}
            </div>

            {emoji && (
              <div className="mb-3 text-[clamp(46px,12vw,64px)] leading-none" aria-hidden>
                {emoji}
              </div>
            )}

            {eyebrow && (
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: c.accent }}>
                {eyebrow}
              </div>
            )}

            <h2 className="mt-2 text-[clamp(28px,7.5vw,40px)] font-extrabold leading-[1.15] tracking-[-0.03em] [word-break:keep-all]">
              {title}
            </h2>

            {score && (
              <div className="mt-4 flex items-baseline justify-center gap-1.5" style={{ color: c.accent }}>
                <span className="text-[clamp(50px,14vw,76px)] font-extrabold leading-none tracking-[-0.04em]">
                  {score}
                </span>
                {scoreLabel && (
                  <small className="text-[clamp(15px,4vw,20px)] font-bold">{scoreLabel}</small>
                )}
              </div>
            )}

            <div className="mx-auto my-6 h-px w-12 rounded" style={{ background: c.line }} aria-hidden />

            <p className="mx-auto max-w-[34ch] text-[clamp(14px,3.4vw,16px)] leading-[1.75] [word-break:keep-all]" style={{ color: c.sub }}>
              {description}
            </p>

            {details.length > 0 && (
              <ul className="mt-5 flex list-none flex-wrap justify-center gap-2 p-0">
                {details.map((item) => (
                  <li
                    key={item}
                    className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
                    style={{ background: c.chipBg, color: c.chipFg, border: `1px solid ${c.chipBorder}` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {children}

            <div className="mt-7 text-[11px] font-medium" style={{ color: c.sub }}>
              nolza.fun
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
