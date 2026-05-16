"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { AdBottom, AdMobileSticky } from "@/app/components/Ads";
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
  STOIC_QUESTIONS,
  calculateStoicResult,
  getStoicResultById,
  type StoicAnswer,
  type StoicChoice,
  type StoicControlId,
  type StoicResult,
} from "@/lib/stoic-control-test";

type Phase = "intro" | "quiz" | "result";
type StoicSharePayload = {
  v: 1;
  resultId: StoicControlId;
  locale?: SimpleLocale;
};

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export default function StoicControlTestClient(): ReactElement {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StoicAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<StoicResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<StoicSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getStoicResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(STOIC_QUESTIONS.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentQuestion = STOIC_QUESTIONS[questionIndex];
  const result = useMemo(() => sharedResult ?? calculateStoicResult(answers), [answers, sharedResult]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / STOIC_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase === "result" && result) {
      trackResultView("stoic-control", result.id);
    }
  }, [phase, result]);

  const start = useCallback(() => {
    trackTestStart("stoic-control", "Stoic Control Test");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareStatus("");
    window.history.replaceState(null, "", "/tests/stoic-control");
  }, []);

  const choose = useCallback((choice: StoicChoice) => {
    trackQuestionAnswered("stoic-control", questionIndex + 1);
    const nextAnswer: StoicAnswer = {
      questionId: currentQuestion.id,
      choiceId: choice.id,
      weights: choice.weights,
    };
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);
    setShareStatus("");
    if (questionIndex >= STOIC_QUESTIONS.length - 1) {
      const nextResult = calculateStoicResult(nextAnswers);
      const url = buildShareUrl("/tests/stoic-control", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies StoicSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
  }, [answers, currentQuestion.id, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("stoic-control", "test", result.id);
    const url = buildShareUrl("/tests/stoic-control", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies StoicSharePayload);
    const title = t(locale, "스토아 철학 테스트 결과", "Stoic Control Test Result");
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
    <main className="stoic-test">
      <section className="stoic-shell">
        <nav className="stoic-back">
          <Link href="/">{t(locale, "← Nolza.fun으로 돌아가기", "← Back to Nolza.fun")}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="stoic-hero">
            <div className="hero-copy">
              <p className="eyebrow">{t(locale, "스토아 철학 테스트 · STOIC CONTROL", "PHILOSOPHY TEST · STOIC CONTROL")}</p>
              <h1>{t(locale, "스토아 철학 테스트", "Stoic Control Test")}</h1>
              <p className="subtitle">
                {t(
                  locale,
                  "불안할 때, 나는 무엇을 붙잡으려 할까요?",
                  "What do you try to hold onto when you feel anxious?",
                )}
              </p>
              <p className="description">
                {t(
                  locale,
                  "통제할 수 있는 것과 없는 것을 구분하는 나의 마음 습관을 알아보세요.",
                  "Explore how you separate what you can control from what you cannot.",
                )}
              </p>
              <button type="button" onClick={start} className="primary">
                {t(locale, "테스트 시작하기", "Start the test")}
              </button>
              <p className="meta-line">{t(locale, "12문항 · 약 3분", "12 questions · about 3 min")}</p>
              <p className="notice">
                {t(
                  locale,
                  "이 테스트는 철학에서 영감을 받은 재미용 자기이해 콘텐츠입니다.",
                  "This is a philosophy-inspired entertainment and self-reflection test.",
                )}
              </p>
            </div>
          </section>
        ) : (
          <section className="stoic-card">
            <div className="progress-head">
              <span>{phase === "result" ? t(locale, "결과", "Result") : t(locale, "질문", "Question")}</span>
              <strong>{phase === "result" ? "12/12" : `${questionIndex + 1}/12`}</strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <>
                <h2>{text(locale, currentQuestion.prompt)}</h2>
                <div className="answers">
                  {currentQuestion.choices.map((choice) => (
                    <button key={choice.id} type="button" onClick={() => choose(choice)} className="answer">
                      <span>{choice.id.toUpperCase()}</span>
                      <strong>{text(locale, choice.text)}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <ResultView locale={locale} result={result} shared={Boolean(sharedResult)} onRetry={start} onShare={share} shareStatus={shareStatus} />
            )}
          </section>
        )}
      </section>

      {phase === "result" && (
      <RecommendedGames
        currentId="stoic-control"
        ids={["thinking-pattern", "value-conflict", "defense-mechanism"]}
        title={{ ko: "다음 자기이해 테스트", en: "Try These Next" }}
      />
      )}
      <AdBottom />
      <AdMobileSticky />

      <style jsx global>{`
        .stoic-test {
          min-height: 100vh;
          color: #24231f;
          background:
            radial-gradient(circle at 18% 14%, rgba(150, 113, 68, 0.15), transparent 29rem),
            radial-gradient(circle at 86% 8%, rgba(104, 118, 102, 0.14), transparent 30rem),
            linear-gradient(180deg, #f6efe4 0%, #e9dfcf 58%, #f7ecda 100%);
          padding: 24px clamp(16px, 4vw, 44px) 56px;
        }
        .stoic-shell {
          width: min(100%, 1040px);
          margin: 0 auto 34px;
        }
        .stoic-back {
          margin-bottom: 18px;
          font-size: 14px;
        }
        .stoic-back a {
          color: rgba(36, 35, 31, 0.68);
          text-decoration: none;
          font-weight: 800;
        }
        .stoic-hero,
        .stoic-card {
          border: 1px solid rgba(71, 56, 35, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255, 253, 247, 0.91), rgba(235, 222, 199, 0.75)),
            #f8efdf;
          box-shadow: 0 30px 80px rgba(19, 17, 14, 0.28);
        }
        .stoic-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: min(720px, calc(100vh - 116px));
          padding: clamp(34px, 6vw, 76px) clamp(22px, 5vw, 60px);
          overflow: hidden;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }
        .stoic-hero .hero-copy {
          width: min(100%, 720px);
          text-align: center;
        }
        .eyebrow,
        .progress-head span {
          margin: 0 0 12px;
          color: #896538;
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
          max-width: 680px;
          margin-inline: auto;
          font-size: clamp(38px, 6.4vw, 70px);
          word-break: keep-all;
          overflow-wrap: normal;
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
          margin-left: auto;
          margin-right: auto;
          color: rgba(36, 35, 31, 0.74);
          line-height: 1.72;
          word-break: keep-all;
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
          color: #80603b;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }
        .notice {
          margin: 10px 0 0;
          color: rgba(36, 35, 31, 0.52);
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
          background: linear-gradient(135deg, #967144, #4f5b4c);
          box-shadow: 0 18px 36px rgba(79, 91, 76, 0.22);
        }
        .secondary {
          color: #2c241b;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(71, 56, 35, 0.18);
        }
        .primary:hover,
        .secondary:hover,
        .answer:hover {
          transform: translateY(-2px);
        }
        .stoic-card {
          padding: clamp(24px, 4vw, 46px);
        }
        .progress-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .progress-head span {
          margin: 0;
        }
        .progress-head strong {
          color: #73593a;
          font-size: 15px;
        }
        .progress-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(71, 56, 35, 0.12);
        }
        .progress-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #9b7445, #717c83);
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
          border: 1px solid rgba(71, 56, 35, 0.16);
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
          border-color: rgba(137, 101, 56, 0.42);
          box-shadow: 0 18px 34px rgba(89, 66, 39, 0.13);
        }
        .result {
          display: grid;
          gap: 22px;
        }
        .shared-label {
          width: max-content;
          border: 1px solid rgba(137, 101, 56, 0.24);
          border-radius: 999px;
          background: rgba(137, 101, 56, 0.08);
          color: #73512d;
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
          font-size: clamp(32px, 5.6vw, 58px);
        }
        .one-liner {
          margin: 0;
          color: #73512d;
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
          border: 1px solid rgba(71, 56, 35, 0.15);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.62);
          padding: 16px;
        }
        .result-box span {
          display: block;
          margin-bottom: 8px;
          color: #73512d;
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
          .answers,
          .result-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .stoic-test {
            padding-inline: 14px;
          }
          .stoic-hero,
          .stoic-card {
            border-radius: 24px;
          }
          .stoic-hero {
            min-height: auto;
            padding-top: 18px;
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

function ResultView({
  locale,
  result,
  shared,
  onRetry,
  onShare,
  shareStatus,
}: {
  locale: SimpleLocale;
  result: StoicResult;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  return (
    <section className="result">
      {shared ? <span className="shared-label">{t(locale, "공유된 결과", "Shared Result")}</span> : null}
      <div className="result-title">
        <p className="eyebrow">{t(locale, "놓지 못하는 통제", "Control You Hold Onto")}</p>
        <h2>{text(locale, result.title)}</h2>
        <p className="one-liner">{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>
      <div className="result-grid">
        <div className="result-box">
          <span>{t(locale, "통제할 수 없는 것", "Not Fully in Your Control")}</span>
          <p>{text(locale, result.cannotControl)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "선택할 수 있는 것", "What You Can Choose")}</span>
          <p>{text(locale, result.canChoose)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "오늘의 한 문장", "Today's Reflection")}</span>
          <p>{text(locale, result.reflection)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "작은 힌트", "Small Hint")}</span>
          <p>{text(locale, result.hint)}</p>
        </div>
      </div>
      <div className="result-actions">
        <button type="button" className="primary" onClick={onShare}>
          {t(locale, "결과 공유하기", "Share result")}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            trackRetryClick("stoic-control", "test");
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
