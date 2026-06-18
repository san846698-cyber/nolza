"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { AdResult } from "@/app/components/Ads";
import { homeBackLabel } from "@/app/components/BrandMark";
import RecommendedGames from "@/app/components/game/RecommendedGames";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  trackQuestionAnswered,
  trackResultView,
  trackRetryClick,
  trackShareClick,
  trackTestStart,
} from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  THINKING_QUESTIONS,
  calculateThinkingResult,
  getThinkingResultById,
  type ThinkingAnswer,
  type ThinkingChoice,
  type ThinkingPatternId,
  type ThinkingResult,
} from "@/lib/thinking-pattern-test";

type Phase = "intro" | "quiz" | "result";
type ThinkingSharePayload = {
  v: 1;
  resultId: ThinkingPatternId;
  locale?: SimpleLocale;
};

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

type ThinkingStatement = {
  id: string;
  sourceQuestionId: string;
  context: {
    ko: string;
    en: string;
  };
  choice: ThinkingChoice;
};

function promptContext(prompt: { ko: string; en: string }): { ko: string; en: string } {
  const clean = (value: string): string => {
    const firstLine = value.split("\n")[0]?.trim() ?? value.trim();
    return firstLine
      .replace(/\s*당신에게 가장 가까운 반응은\?$/, "")
      .replace(/\s*당신은 어떤 생각이 먼저 드나요\?$/, "")
      .replace(/\s*What reaction feels closest\?$/, "")
      .replace(/\s*What comes closest\?$/, "")
      .trim();
  };
  return {
    ko: clean(prompt.ko),
    en: clean(prompt.en),
  };
}

const THINKING_STATEMENT_KEYS = [
  "tp_01:a",
  "tp_01:b",
  "tp_01:c",
  "tp_01:d",
  "tp_02:b",
  "tp_02:c",
  "tp_02:d",
  "tp_03:b",
  "tp_03:c",
  "tp_03:d",
  "tp_04:b",
  "tp_04:c",
  "tp_04:d",
  "tp_05:a",
  "tp_05:b",
  "tp_05:c",
  "tp_05:d",
  "tp_06:b",
  "tp_06:c",
  "tp_06:d",
  "tp_07:a",
  "tp_07:b",
  "tp_07:c",
  "tp_07:d",
] as const;

const THINKING_STATEMENTS: ThinkingStatement[] = THINKING_STATEMENT_KEYS.map((key) => {
  const [questionId, choiceId] = key.split(":");
  const question = THINKING_QUESTIONS.find((item) => item.id === questionId);
  const choice = question?.choices.find((item) => item.id === choiceId);
  if (!question || !choice) {
    throw new Error(`Missing thinking-pattern statement: ${key}`);
  }
  return {
    id: key,
    sourceQuestionId: question.id,
    context: promptContext(question.prompt),
    choice,
  };
});

const THINKING_DIM_COLORS: Record<ThinkingPatternId, string> = {
  catastrophizing: "#d97706",
  "all-or-nothing": "#7c3aed",
  "mind-reading": "#2563eb",
  overgeneralization: "#dc2626",
  "emotional-reasoning": "#db2777",
  "should-statements": "#9333ea",
  "discounting-positive": "#0f766e",
  personalization: "#ea580c",
  "balanced-perspective": "#16a34a",
};

const LIKERT_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#64748b", "#14b8a6", "#3b82f6", "#8b5cf6"];

function primaryPattern(weights: Partial<Record<ThinkingPatternId, number>>): ThinkingPatternId {
  let winner: ThinkingPatternId = "balanced-perspective";
  let best = -Infinity;
  for (const [id, score] of Object.entries(weights) as Array<[ThinkingPatternId, number]>) {
    if (score > best) {
      winner = id;
      best = score;
    }
  }
  return winner;
}

function remapLikertWeights(choice: ThinkingChoice, value: number): Partial<Record<ThinkingPatternId, number>> {
  const weights: Partial<Record<ThinkingPatternId, number>> = {};
  const agreement = (value - 1) / 6;
  for (const [id, score] of Object.entries(choice.weights) as Array<[ThinkingPatternId, number]>) {
    weights[id] = (weights[id] ?? 0) + score * agreement;
  }
  return weights;
}

export default function ThinkingPatternTestClient(): ReactElement {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ThinkingAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<ThinkingResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<ThinkingSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getThinkingResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(THINKING_STATEMENTS.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentStatement = THINKING_STATEMENTS[questionIndex];
  const result = useMemo(() => sharedResult ?? calculateThinkingResult(answers), [answers, sharedResult]);

  useEffect(() => {
    if (phase !== "quiz") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result" && result) {
      trackResultView("thinking-pattern", result.id);
    }
  }, [phase, result]);

  const start = useCallback(() => {
    trackTestStart("thinking-pattern", "Thinking Pattern Test");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareStatus("");
    window.history.replaceState(null, "", "/tests/thinking-pattern");
  }, []);

  const choose = useCallback((value: number) => {
    trackQuestionAnswered("thinking-pattern", questionIndex + 1);
    const nextAnswer: ThinkingAnswer = {
      questionId: currentStatement.sourceQuestionId,
      choiceId: `likert:${currentStatement.id}:${value}`,
      weights: remapLikertWeights(currentStatement.choice, value),
    };
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);
    setShareStatus("");
    if (questionIndex >= THINKING_STATEMENTS.length - 1) {
      const nextResult = calculateThinkingResult(nextAnswers);
      const url = buildShareUrl("/tests/thinking-pattern", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies ThinkingSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
  }, [answers, currentStatement.choice, currentStatement.id, currentStatement.sourceQuestionId, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("thinking-pattern", "test", result.id);
    const url = buildShareUrl("/tests/thinking-pattern", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies ThinkingSharePayload);
    const title = t(locale, "인지왜곡 테스트 결과", "Thinking Pattern Test Result");
    const body = text(locale, result.shareLine);
    try {
      if (navigator.share) {
        await navigator.share({ title, text: body, url });
        setShareStatus(t(locale, "공유 창을 열었어요.", "Share sheet opened."));
        return;
      }
      await navigator.clipboard.writeText(`${body}\n${url}`);
      setShareStatus(t(locale, "결과 링크를 복사했어요.", "Result link copied."));
    } catch {
      try {
        await navigator.clipboard.writeText(`${body}\n${url}`);
        setShareStatus(t(locale, "결과 링크를 복사했어요.", "Result link copied."));
      } catch {
        setShareStatus(t(locale, "복사에 실패했어요. 주소창의 링크를 직접 복사해주세요.", "Copy failed. Please copy the URL from the address bar."));
      }
    }
  }, [locale, result]);

  return (
    <main className={`thinking-test thinking-test--${phase}`}>
      <section className="thinking-shell">
        {phase !== "quiz" && (
          <nav className="thinking-back">
            <Link href="/">{homeBackLabel(locale)}</Link>
          </nav>
        )}

        {phase === "intro" ? (
          <section className="thinking-hero">
            <div className="hero-copy">
              <p className="eyebrow">{t(locale, "인지왜곡 테스트", "Thinking Pattern Test")}</p>
              <h1>{t(locale, "인지왜곡 테스트", "Cognitive Distortion Test")}</h1>
              <p className="subtitle">
                {t(
                  locale,
                  "내 생각은 어디서 자주 꼬일까요?",
                  "Where does your thinking get twisted?",
                )}
              </p>
              <p className="description">
                {t(
                  locale,
                  "애매한 순간에 생각이 어디로 먼저 흐르는지 가볍게 확인해보세요.",
                  "See where your thoughts tend to go first in ambiguous moments.",
                )}
              </p>
              <div className="intro-chips" aria-label={t(locale, "테스트 정보", "Test info")}>
                <span>{t(locale, "24문장", "24 statements")}</span>
                <span>{t(locale, "약 4분", "About 4 min")}</span>
                <span>{t(locale, "생각 패턴", "Thinking pattern")}</span>
              </div>
              <button type="button" onClick={start} className="primary">
                {t(locale, "테스트 시작하기", "Start the test")}
              </button>
              <p className="notice">
                {t(
                  locale,
                  "이 테스트는 전문적인 진단이 아닌, 심리학/철학 개념을 바탕으로 만든 재미용 자기이해 콘텐츠입니다.",
                  "This is not a professional diagnosis. It is an entertainment and self-reflection experience based on psychology/philosophy concepts.",
                )}
              </p>
            </div>
          </section>
        ) : phase === "quiz" ? (
          <ThinkingAttachmentQuizView
            key={currentStatement.id}
            locale={locale}
            onAnswer={choose}
            onBack={() => {
              setPhase("intro");
              setQuestionIndex(0);
              setAnswers([]);
              setShareStatus("");
            }}
            questionIdx={questionIndex}
            statement={currentStatement}
            total={THINKING_STATEMENTS.length}
          />
        ) : (
          <section className="thinking-card">
            <div className="progress-head">
              <span>{t(locale, "결과", "Result")}</span>
              <strong>
                {THINKING_STATEMENTS.length} / {THINKING_STATEMENTS.length}
              </strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <span style={{ width: "100%" }} />
            </div>

            <ResultView locale={locale} result={result} shared={Boolean(sharedResult)} onRetry={start} onShare={share} shareStatus={shareStatus} />
          </section>
        )}
      </section>

      {phase === "result" && (
        <>
          <AdResult placement="thinking-pattern-result" />
          <RecommendedGames
            currentId="thinking-pattern"
            ids={["value-conflict", "stoic-control", "defense-mechanism"]}
            title={{ ko: "다음 자기이해 테스트", en: "Try These Next" }}
          />
        </>
      )}

      <style jsx global>{`
        .thinking-test {
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: hidden;
          overflow-y: auto;
          color: #24232a;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.55), transparent 34%),
            linear-gradient(180deg, #fbf7ee 0%, #f0e8dc 58%, #f8f0e6 100%);
          padding: 24px clamp(16px, 4vw, 44px) 56px;
        }
        .thinking-shell {
          width: min(100%, 1040px);
          margin: 0 auto 34px;
          padding-top: clamp(10px, 2.5vh, 28px);
        }
        .thinking-back {
          margin-bottom: 18px;
          font-size: 14px;
        }
        .thinking-back a {
          color: rgba(36, 35, 42, 0.68);
          text-decoration: none;
          font-weight: 800;
        }
        .thinking-hero,
        .thinking-card {
          border: 1px solid rgba(68, 53, 35, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255, 253, 247, 0.91), rgba(239, 225, 202, 0.75)),
            #f8f0e2;
          box-shadow: 0 30px 80px rgba(19, 17, 14, 0.28);
        }
        .thinking-hero {
          display: flex;
          align-items: center;
          width: min(100%, 840px);
          margin: 0 auto;
          min-height: min(720px, calc(100vh - 116px));
          padding: clamp(34px, 6vw, 76px) clamp(22px, 5vw, 60px);
          overflow: hidden;
        }
        .thinking-hero .hero-copy {
          width: min(100%, 720px);
        }
        .eyebrow,
        .progress-head span {
          margin: 0 0 12px;
          color: #6f5aa6;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        h1,
        h2 {
          margin: 0;
          letter-spacing: 0;
          line-height: 1.12;
          font-family: var(--font-noto-serif-kr), "Noto Serif KR", serif;
        }
        h1 {
          max-width: 720px;
          font-size: clamp(38px, 6.4vw, 70px);
        }
        h2 {
          margin: 28px 0 22px;
          font-size: clamp(25px, 4vw, 40px);
          color: #211d18;
        }
        .subtitle,
        .description,
        .meta-line,
        .notice {
          max-width: 660px;
          color: rgba(36, 35, 42, 0.74);
          line-height: 1.72;
        }
        .subtitle {
          margin: 18px 0 0;
          font-size: clamp(18px, 2.3vw, 23px);
          font-weight: 800;
        }
        .description {
          margin: 14px 0 28px;
          font-size: 16.5px;
        }
        .meta-line {
          margin: 13px 0 0;
          color: #6f5aa6;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }
        .notice {
          margin: 10px 0 0;
          color: rgba(36, 35, 42, 0.52);
          font-size: 14px;
        }
        .primary,
        .secondary {
          border: 0;
          cursor: pointer;
          min-height: 52px;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 16px;
          font-weight: 900;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .primary {
          color: #fff9ee;
          background: linear-gradient(135deg, #7962bd, #4b5675);
          box-shadow: 0 18px 36px rgba(76, 83, 120, 0.22);
        }
        .secondary {
          color: #2c241b;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(68, 53, 35, 0.18);
        }
        .primary:hover,
        .secondary:hover,
        .answer:hover {
          transform: translateY(-2px);
        }
        .thinking-card {
          margin-top: clamp(12px, 3vh, 28px);
          padding: clamp(24px, 4vw, 46px);
        }
        .thinking-test--quiz {
          padding: 0;
          background: linear-gradient(180deg, #fbf7ee 0%, #f0e8dc 58%, #f8f0e6 100%);
        }
        .thinking-test--quiz .thinking-shell {
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .thinking-flow-shell {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .thinking-flow-topbar {
          position: relative;
          z-index: 25;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 40px;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 650;
        }
        .thinking-flow-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          background: transparent;
          color: rgba(42, 42, 42, 0.7);
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 6px 0;
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .thinking-flow-back:hover {
          color: #24232a;
          transform: translateX(-2px);
        }
        .thinking-flow-counter {
          color: rgba(42, 42, 42, 0.65);
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .thinking-flow-body {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: clamp(28px, 6vh, 56px);
          padding: 24px;
        }
        .thinking-flow-question-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .thinking-flow-kicker {
          margin: 0 0 12px;
          color: rgba(111, 90, 166, 0.78);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .thinking-flow-context {
          max-width: 720px;
          margin: 0 0 18px;
          padding: 12px 18px;
          border: 1px solid rgba(111, 90, 166, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.56);
          color: rgba(42, 42, 42, 0.72);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: clamp(14px, 1.8vw, 16px);
          font-weight: 750;
          line-height: 1.5;
          text-align: center;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        .thinking-flow-question {
          max-width: 800px;
          margin: 0;
          padding: 0 28px;
          color: #24232a;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: clamp(24px, 3.2vw, 34px);
          font-weight: 820;
          line-height: 1.42;
          letter-spacing: 0;
          text-align: center;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        .thinking-flow-subtext {
          max-width: 680px;
          margin: 12px 0 0;
          padding: 0 28px;
          color: rgba(42, 42, 42, 0.62);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: clamp(15px, 1.8vw, 17px);
          line-height: 1.62;
          text-align: center;
          word-break: keep-all;
        }
        .thinking-flow-likert-area {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .thinking-flow-scale-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          width: 100%;
          padding: 0 16px;
        }
        .thinking-flow-likert-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          max-width: 600px;
        }
        .thinking-flow-likert-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          min-width: 0;
          border-width: 2.5px;
          border-style: solid;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 22px;
          font-weight: 760;
          padding: 0;
          transition: background 0.2s ease, opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .thinking-flow-likert-btn:hover {
          transform: scale(1.08);
        }
        .thinking-flow-scale-labels {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: min(100%, 600px);
          gap: 8px;
          color: rgba(42, 42, 42, 0.58);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 760;
          line-height: 1.35;
        }
        .thinking-flow-scale-labels span:nth-child(2) {
          text-align: center;
        }
        .thinking-flow-scale-labels span:nth-child(3) {
          text-align: right;
        }
        .thinking-side-rail {
          position: fixed;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 25;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .thinking-side-rail-track {
          position: relative;
          width: 2px;
          background: #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .thinking-side-rail-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transition: height 0.4s cubic-bezier(0.22, 0.9, 0.35, 1), background 0.3s ease;
        }
        .thinking-side-rail-dot {
          position: relative;
          border-radius: 50%;
          transition: all 0.25s ease;
        }
        .thinking-side-rail-label {
          position: absolute;
          right: 22px;
          top: 50%;
          transform: translateY(-50%);
          color: #8b8f99;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .thinking-mobile-progress {
          display: none;
        }
        .thinking-flow-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          color: #24232a;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }
        .progress-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .progress-head--active {
          min-height: 38px;
        }
        .test-exit-link {
          display: inline-grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          color: rgba(36, 35, 42, 0.68);
          background: rgba(255, 255, 255, 0.42);
          border: 1px solid rgba(68, 53, 35, 0.12);
          text-decoration: none;
          font-size: 19px;
          font-weight: 900;
          line-height: 1;
        }
        .progress-head span {
          margin: 0;
        }
        .progress-head strong {
          color: #7d5534;
          font-size: 15px;
        }
        .progress-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(68, 53, 35, 0.12);
        }
        .progress-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #9f6530, #6d6f9f);
          transition: width 220ms ease;
        }
        .answers {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .answer {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: start;
          border: 1px solid rgba(68, 53, 35, 0.16);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.62);
          color: #211d18;
          cursor: pointer;
          padding: 18px;
          text-align: left;
          box-shadow: 0 12px 28px rgba(40, 32, 24, 0.08);
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        }
        .answer span {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #24211c;
          color: #fff4e3;
          font-size: 13px;
          font-weight: 900;
        }
        .answer strong {
          font-size: 16px;
          line-height: 1.55;
        }
        .answer:hover {
          border-color: rgba(159, 101, 48, 0.42);
          box-shadow: 0 18px 34px rgba(89, 66, 39, 0.13);
        }
        .result {
          display: grid;
          gap: 22px;
        }
        .shared-label {
          width: max-content;
          border: 1px solid rgba(159, 101, 48, 0.24);
          border-radius: 999px;
          background: rgba(159, 101, 48, 0.08);
          color: #81522a;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 900;
        }
        .result-title {
          display: grid;
          gap: 10px;
        }
        .result-title h2 {
          margin: 0;
          font-size: clamp(34px, 6vw, 64px);
        }
        .one-liner {
          margin: 0;
          color: #81522a;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 900;
        }
        .result-description {
          margin: 0;
          color: rgba(33, 29, 24, 0.8);
          font-size: 18px;
          line-height: 1.82;
        }
        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .result-box {
          border: 1px solid rgba(68, 53, 35, 0.15);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.62);
          padding: 16px;
        }
        .result-box span {
          display: block;
          margin-bottom: 8px;
          color: #81522a;
          font-size: 13px;
          font-weight: 900;
        }
        .result-box p {
          margin: 0;
          color: #211d18;
          font-size: 15.5px;
          line-height: 1.6;
          font-weight: 700;
        }
        .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .share-status {
          margin: 0;
          color: rgba(33, 29, 24, 0.68);
          font-size: 14px;
        }
        @media (max-width: 780px) {
          body:has(.thinking-test--quiz) .locale-floating-toggle {
            opacity: 0.28;
            transform: scale(0.84);
          }
          .thinking-side-rail {
            display: none;
          }
          .thinking-mobile-progress {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(42, 42, 42, 0.06);
            z-index: 40;
          }
          .thinking-mobile-progress-fill {
            height: 100%;
            transition: width 0.4s cubic-bezier(0.22, 0.9, 0.35, 1), background 0.3s ease;
          }
          .answers,
          .result-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .thinking-test {
            padding-inline: 14px;
          }
          .thinking-hero,
          .thinking-card {
            border-radius: 24px;
          }
          .thinking-hero {
            min-height: auto;
            padding-top: 18px;
          }
          .thinking-flow-topbar {
            padding: 18px 22px;
            font-size: 14px;
          }
          .thinking-flow-counter,
          .thinking-flow-back {
            font-size: 14px;
          }
          .thinking-flow-body {
            gap: 34px;
            padding: 24px 12px 32px;
          }
          .thinking-flow-question {
            padding: 0 18px;
            font-size: 22px;
            line-height: 1.45;
          }
          .thinking-flow-context {
            max-width: 360px;
            border-radius: 18px;
            padding: 10px 13px;
            font-size: 13.5px;
          }
          .thinking-flow-subtext {
            margin-top: 10px;
            padding: 0 18px;
            font-size: 14.5px;
            line-height: 1.58;
          }
          .thinking-flow-likert-row {
            gap: 8px;
            max-width: 384px;
          }
          .thinking-flow-likert-btn {
            width: 48px;
            height: 48px;
            border-width: 2px;
            font-size: 16px;
          }
          .thinking-flow-scale-labels {
            width: min(100%, 384px);
            font-size: 11.5px;
          }
          .primary,
          .secondary {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

function ThinkingAttachmentQuizView({
  locale,
  onAnswer,
  onBack,
  questionIdx,
  statement,
  total,
}: {
  locale: SimpleLocale;
  onAnswer: (value: number) => void;
  onBack: () => void;
  questionIdx: number;
  statement: ThinkingStatement;
  total: number;
}): ReactElement {
  const dim = primaryPattern(statement.choice.weights);
  const progress = (questionIdx + 1) / total;

  return (
    <section className="thinking-flow-shell">
      <ThinkingMobileProgress value={progress} dim={dim} />
      <ThinkingSideRail currentIdx={questionIdx} total={total} currentDim={dim} />
      <ThinkingQuestionBackground idx={questionIdx} />

      <div className="thinking-flow-topbar">
        <button
          type="button"
          onClick={onBack}
          className="thinking-flow-back"
          aria-label={t(locale, "나가기", "Exit test")}
        >
          <span aria-hidden>←</span>
          <span>{t(locale, "나가기", "Exit")}</span>
        </button>
        <span className="thinking-flow-counter tabular-nums">
          {questionIdx + 1} / {total}
        </span>
      </div>

      <div className="thinking-flow-body">
        <div className="thinking-flow-question-area">
          <p className="thinking-flow-kicker">{t(locale, "지금 떠오르는 생각", "Current thought")}</p>
          <p className="thinking-flow-context">{text(locale, statement.context)}</p>
          <h2 key={`thinking-statement-${statement.id}`} className="thinking-flow-question">
            {text(locale, statement.choice.text)}
          </h2>
          <p className="thinking-flow-subtext">
            {t(locale, "이 문장이 내 반응과 얼마나 가까운지 골라주세요.", "Choose how closely this statement matches your reaction.")}
          </p>
        </div>

        <div className="thinking-flow-likert-area">
          <ThinkingLikertScale
            key={`thinking-scale-${statement.id}`}
            locale={locale}
            onAnswer={onAnswer}
          />
        </div>
      </div>
    </section>
  );
}

function ThinkingSideRail({
  currentIdx,
  currentDim,
  total,
}: {
  currentIdx: number;
  currentDim: ThinkingPatternId;
  total: number;
}): ReactElement {
  const color = THINKING_DIM_COLORS[currentDim] ?? "#8b5cf6";
  const dotSpacing = 20;
  const trackHeight = (total - 1) * dotSpacing;
  const fillHeight = total > 1 ? (currentIdx / (total - 1)) * trackHeight : 0;

  return (
    <div className="thinking-side-rail" aria-hidden>
      <div className="thinking-side-rail-track" style={{ height: trackHeight }}>
        <div className="thinking-side-rail-fill" style={{ height: fillHeight, background: color }} />
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIdx;
          const isDone = i < currentIdx;
          const size = isCurrent ? 14 : 10;
          const dotColor = isCurrent ? color : isDone ? "#6b7280" : "#d1d5db";
          return (
            <div
              key={i}
              className="thinking-side-rail-dot"
              style={{
                width: size,
                height: size,
                background: dotColor,
                marginTop: i === 0 ? 0 : dotSpacing - size,
                boxShadow: isCurrent ? `0 0 0 4px ${color}22` : undefined,
              }}
            >
              {isCurrent && (
                <span className="thinking-side-rail-label tabular-nums">
                  {currentIdx + 1} / {total}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThinkingMobileProgress({ dim, value }: { dim: ThinkingPatternId; value: number }): ReactElement {
  const color = THINKING_DIM_COLORS[dim] ?? "#8b5cf6";
  return (
    <div className="thinking-mobile-progress" aria-hidden>
      <div
        className="thinking-mobile-progress-fill"
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }}
      />
    </div>
  );
}

function ThinkingLikertScale({
  locale,
  onAnswer,
}: {
  locale: SimpleLocale;
  onAnswer: (value: number) => void;
}): ReactElement {
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const endpoints = locale === "ko" ? ["전혀 아니다", "보통이다", "매우 그렇다"] : ["Strongly disagree", "Neutral", "Strongly agree"];

  const handleClick = useCallback(
    (value: number) => {
      if (pendingValue !== null) return;
      setPendingValue(value);
      window.setTimeout(() => onAnswer(value), 300);
    },
    [onAnswer, pendingValue],
  );

  return (
    <div className="thinking-flow-scale-wrap">
      <div className="thinking-flow-likert-row" role="radiogroup" aria-label={t(locale, "7점 척도", "7-point scale")}>
        {Array.from({ length: 7 }, (_, i) => {
          const value = i + 1;
          const color = LIKERT_COLORS[i];
          const isSelected = pendingValue === value;
          const dimmed = pendingValue !== null && !isSelected;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              aria-checked={isSelected}
              aria-label={`${value}`}
              className={`thinking-flow-likert-btn${isSelected ? " is-selected" : ""}`}
              role="radio"
              style={{
                borderColor: color,
                background: isSelected ? color : "transparent",
                color: isSelected ? "#fff" : color,
                opacity: dimmed ? 0.3 : 1,
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                boxShadow: isSelected ? `0 4px 16px ${color}66` : "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              {value}
            </button>
          );
        })}
      </div>
      <div className="thinking-flow-scale-labels" aria-hidden>
        <span>1 {endpoints[0]}</span>
        <span>4 {endpoints[1]}</span>
        <span>7 {endpoints[2]}</span>
      </div>
    </div>
  );
}

function ThinkingQuestionBackground({ idx }: { idx: number }): ReactElement {
  const rotate = (idx % 5) * 18;
  return (
    <svg className="thinking-flow-bg" viewBox="0 0 800 800" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2" transform={`rotate(${rotate} 400 400)`}>
        <circle cx="400" cy="400" r="240" />
        <circle cx="400" cy="400" r="150" />
        <path d="M160 400h480M400 160v480M230 230l340 340M570 230 230 570" />
      </g>
    </svg>
  );
}

function ResultView({
  locale,
  result,
  shared,
  onRetry,
  onShare,
  shareStatus,
}: {
  locale: SimpleLocale;
  result: ThinkingResult;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  return (
    <section className="result">
      {shared ? <span className="shared-label">{t(locale, "공유된 결과", "Shared Result")}</span> : null}
      <div className="result-title">
        <p className="eyebrow">{t(locale, "나의 생각 습관", "My Thinking Habit")}</p>
        <h2>{text(locale, result.title)}</h2>
        <p className="one-liner">{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>
      <div className="result-box result-basis">
        <span>{t(locale, "테스트 기준", "How this test works")}</span>
        <p>
          {t(
            locale,
            "이 테스트는 심리학/철학 개념을 일상 상황으로 쉽게 풀어낸 자기이해 콘텐츠입니다. 결과는 참고용이며 전문적인 진단이나 상담을 대체하지 않습니다.",
            "This test translates psychology/philosophy concepts into everyday situations. Results are for self-reflection only and do not replace professional diagnosis or counseling.",
          )}
        </p>
      </div>
      <div className="result-grid">
        <div className="result-box">
          <span>{t(locale, "생각이 이렇게 흐를 수 있어요", "How It Can Flow")}</span>
          <p>{text(locale, result.flow)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "조금 다르게 볼 수 있는 문장", "A Gentler Reframe")}</span>
          <p>{text(locale, result.reframe)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "강점", "Strength")}</span>
          <p>{text(locale, result.strength)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "조심할 점", "Caution")}</span>
          <p>{text(locale, result.caution)}</p>
        </div>
      </div>
      <div className="result-actions">
        <button type="button" className="primary" onClick={onShare}>
          {t(locale, "친구에게 공유하기", "Share with friends")}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            trackRetryClick("thinking-pattern", "test");
            onRetry();
          }}
        >
          {shared ? t(locale, "나도 해보기", "Try it myself") : t(locale, "다시 하기", "Retry")}
        </button>
        {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
      </div>
    </section>
  );
}
