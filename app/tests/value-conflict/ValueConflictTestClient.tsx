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
  VALUE_QUESTIONS,
  calculateValueResult,
  getValueResultById,
  type ValueAnswer,
  type ValueChoice,
  type ValueConflictId,
  type ValueResult,
} from "@/lib/value-conflict-test";

type Phase = "intro" | "quiz" | "result";
type ValueSharePayload = {
  v: 1;
  resultId: ValueConflictId;
  locale?: SimpleLocale;
};

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export default function ValueConflictTestClient(): ReactElement {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ValueAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<ValueResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<ValueSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getValueResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(VALUE_QUESTIONS.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentQuestion = VALUE_QUESTIONS[questionIndex];
  const result = useMemo(() => sharedResult ?? calculateValueResult(answers), [answers, sharedResult]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / VALUE_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase === "result" && result) {
      trackResultView("value-conflict", result.id);
    }
  }, [phase, result]);

  const start = useCallback(() => {
    trackTestStart("value-conflict", "Value Conflict Test");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareStatus("");
    window.history.replaceState(null, "", "/tests/value-conflict");
  }, []);

  const choose = useCallback((choice: ValueChoice) => {
    trackQuestionAnswered("value-conflict", questionIndex + 1);
    const nextAnswer: ValueAnswer = {
      questionId: currentQuestion.id,
      choiceId: choice.id,
      weights: choice.weights,
    };
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);
    setShareStatus("");
    if (questionIndex >= VALUE_QUESTIONS.length - 1) {
      const nextResult = calculateValueResult(nextAnswers);
      const url = buildShareUrl("/tests/value-conflict", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies ValueSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
  }, [answers, currentQuestion.id, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("value-conflict", "test", result.id);
    const url = buildShareUrl("/tests/value-conflict", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies ValueSharePayload);
    const title = t(locale, "가치관 갈등 테스트 결과", "Value Conflict Test Result");
    const body = t(locale, result.shareLine.ko, result.shareLine.en);
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
        setShareStatus(t(locale, "링크 복사에 실패했어요. 주소창의 링크를 복사해주세요.", "Copy failed. Please copy the URL from the address bar."));
      }
    }
  }, [locale, result]);

  return (
    <main className="value-test">
      <section className="value-shell">
        <nav className="value-back">
          <Link href="/">{t(locale, "← 놀자 홈으로", "← Back to Nolza.fun")}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="value-hero">
            <div className="hero-copy">
              <p className="eyebrow">{t(locale, "가치관 갈등 테스트", "Value Conflict Test")}</p>
              <h1>{t(locale, "당신 안에서 충돌하는 두 가지 가치는?", "What Two Values Are Fighting Inside You?")}</h1>
              <p className="subtitle">
                {t(
                  locale,
                  "결정을 어렵게 만드는 마음속 가치의 충돌을 알아보세요.",
                  "Discover the inner value conflict that makes decisions harder.",
                )}
              </p>
              <p className="description">
                {t(
                  locale,
                  "자유를 원하지만 안정도 포기하기 어렵고, 솔직하고 싶지만 평화를 깨고 싶지 않을 때가 있습니다. 당신 안에서 가장 자주 부딪히는 두 가지 가치를 확인해보세요.",
                  "Sometimes you are not confused because you want nothing. You are conflicted because two important values matter at the same time.",
                )}
              </p>
              <button type="button" onClick={start} className="primary">
                {t(locale, "테스트 시작하기", "Start the test")}
              </button>
              <p className="meta-line">{t(locale, "16문항 · 약 4분", "16 questions · about 4 min")}</p>
              <p className="notice">{t(locale, "이 테스트는 재미용 자기이해 콘텐츠입니다.", "This test is for entertainment and self-reflection only.")}</p>
            </div>
          </section>
        ) : (
          <section className="value-card">
            <div className="progress-head">
              <span>{phase === "result" ? t(locale, "결과", "Result") : t(locale, "질문", "Question")}</span>
              <strong>
                {phase === "result"
                  ? `${VALUE_QUESTIONS.length}/${VALUE_QUESTIONS.length}`
                  : `${questionIndex + 1}/${VALUE_QUESTIONS.length}`}
              </strong>
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
        currentId="value-conflict"
        ids={["thinking-pattern", "stoic-control", "defense-mechanism"]}
        title={{ ko: "다음 자기이해 테스트", en: "Try These Next" }}
      />
      )}
      <AdBottom />
      <AdMobileSticky />

      <style jsx global>{`
        .value-test {
          min-height: 100vh;
          color: #211d18;
          background:
            radial-gradient(circle at 18% 12%, rgba(176, 116, 39, 0.16), transparent 28rem),
            radial-gradient(circle at 86% 8%, rgba(103, 123, 151, 0.18), transparent 30rem),
            linear-gradient(180deg, #fbf4e7 0%, #f4e7d2 54%, #f8efe1 100%);
          padding: 24px clamp(16px, 4vw, 44px) 56px;
        }
        .value-shell {
          width: min(100%, 1040px);
          margin: 0 auto 34px;
        }
        .value-back {
          margin-bottom: 18px;
          font-size: 14px;
        }
        .value-back a {
          color: rgba(33, 29, 24, 0.68);
          text-decoration: none;
          font-weight: 800;
        }
        .value-hero,
        .value-card {
          border: 1px solid rgba(68, 53, 35, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255, 253, 247, 0.9), rgba(238, 224, 198, 0.72)),
            #f7efe1;
          box-shadow: 0 30px 80px rgba(19, 17, 14, 0.28);
        }
        .value-hero {
          display: flex;
          align-items: center;
          min-height: min(720px, calc(100vh - 116px));
          padding: clamp(34px, 6vw, 76px) clamp(22px, 5vw, 60px);
          overflow: hidden;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }
        .value-hero .hero-copy {
          width: min(100%, 720px);
        }
        .eyebrow,
        .progress-head span {
          margin: 0 0 12px;
          color: #9b6a23;
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
          font-size: clamp(38px, 6.5vw, 72px);
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
          max-width: 650px;
          color: rgba(33, 29, 24, 0.74);
          line-height: 1.72;
        }
        .subtitle {
          margin: 18px 0 0;
          font-size: clamp(18px, 2.3vw, 23px);
          font-weight: 800;
        }
        .description {
          margin: 14px 0 30px;
          font-size: 16.5px;
        }
        .meta-line {
          margin: 13px 0 0;
          color: #8f5d1e;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }
        .notice {
          margin: 10px 0 0;
          color: rgba(33, 29, 24, 0.52);
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
          background: linear-gradient(135deg, #a66d25, #6b4a28);
          box-shadow: 0 18px 36px rgba(112, 73, 32, 0.22);
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
        .value-card {
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
          color: #7d5b28;
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
          background: linear-gradient(90deg, #9f6a25, #6d83a8);
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
          border-color: rgba(159, 106, 37, 0.42);
          box-shadow: 0 18px 34px rgba(89, 66, 39, 0.13);
        }
        .result {
          display: grid;
          gap: 22px;
        }
        .shared-label {
          width: max-content;
          border: 1px solid rgba(159, 106, 37, 0.24);
          border-radius: 999px;
          background: rgba(159, 106, 37, 0.08);
          color: #815516;
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
          color: #815516;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 900;
        }
        .result-description {
          margin: 0;
          color: rgba(33, 29, 24, 0.8);
          font-size: 18px;
          line-height: 1.82;
        }
        .result-depth {
          display: grid;
          gap: 12px;
        }
        .result-feature {
          border: 1px solid rgba(159, 106, 37, 0.18);
          border-radius: 20px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(252, 240, 219, 0.62));
          padding: 18px;
          box-shadow: 0 18px 44px rgba(89, 66, 39, 0.08);
        }
        .result-feature span,
        .result-quote span {
          display: block;
          margin-bottom: 8px;
          color: #815516;
          font-size: 13px;
          font-weight: 900;
        }
        .result-feature p {
          margin: 0;
          color: rgba(33, 29, 24, 0.84);
          font-size: 16.5px;
          line-height: 1.72;
          font-weight: 700;
        }
        .result-quote-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .result-quote {
          border: 1px solid rgba(68, 53, 35, 0.14);
          border-radius: 18px;
          background: rgba(36, 33, 28, 0.045);
          padding: 16px;
        }
        .result-quote p {
          margin: 0;
          color: #211d18;
          font-size: 16px;
          line-height: 1.62;
          font-weight: 900;
        }
        .result-quote--friend {
          background: rgba(159, 106, 37, 0.08);
        }
        .needed-sentence {
          border-left: 4px solid #9f6a25;
          background: rgba(255, 255, 255, 0.56);
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
          color: #815516;
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
          .result-grid,
          .result-quote-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .value-test {
            padding-inline: 14px;
          }
          .value-hero,
          .value-card {
            border-radius: 24px;
          }
          .value-hero {
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
  result: ValueResult;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  return (
    <section className="result">
      {shared ? <span className="shared-label">{t(locale, "공유된 결과", "Shared Result")}</span> : null}
      <div className="result-title">
        <p className="eyebrow">{t(locale, "나의 가치관 갈등", "My Value Conflict")}</p>
        <h2>{text(locale, result.title)}</h2>
        <p className="one-liner">{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>
      <div className="result-depth">
        <div className="result-feature">
          <span>{t(locale, "당신 안의 갈등 구조", "Your Inner Conflict Pattern")}</span>
          <p>{text(locale, result.conflictStructure)}</p>
        </div>
        <div className="result-quote-grid">
          <div className="result-quote">
            <span>{t(locale, "자주 하는 생각", "A Thought You Often Have")}</span>
            <p>“{text(locale, result.commonThought)}”</p>
          </div>
          <div className="result-quote result-quote--friend">
            <span>{t(locale, "친구가 보면 할 말", "What a Friend Might Say")}</span>
            <p>“{text(locale, result.friendComment)}”</p>
          </div>
        </div>
      </div>
      <div className="result-grid">
        <div className="result-box">
          <span>{t(locale, "강점", "Strength")}</span>
          <p>{text(locale, result.strength)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "조심할 점", "Risk")}</span>
          <p>{text(locale, result.risk)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "자주 나타나는 순간", "Where It Appears")}</span>
          <p>{text(locale, result.moment)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "조금 편해지는 힌트", "A Hint That Helps")}</span>
          <p>{text(locale, result.hint)}</p>
        </div>
        <div className="result-box needed-sentence">
          <span>{t(locale, "이 유형에게 필요한 한 문장", "One Sentence This Type Needs")}</span>
          <p>{text(locale, result.neededSentence)}</p>
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
            trackRetryClick("value-conflict", "test");
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
