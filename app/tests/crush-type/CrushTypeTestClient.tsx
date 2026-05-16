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
  CRUSH_QUESTIONS,
  calculateCrushResult,
  getCrushResultById,
  type CrushAnswer,
  type CrushChoice,
  type CrushResult,
  type CrushTypeId,
} from "@/lib/crush-type-test";

type Phase = "intro" | "quiz" | "result";
type CrushSharePayload = {
  v: 1;
  resultId: CrushTypeId;
  locale?: SimpleLocale;
};

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export default function CrushTypeTestClient(): ReactElement {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<CrushAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<CrushResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<CrushSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getCrushResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(CRUSH_QUESTIONS.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentQuestion = CRUSH_QUESTIONS[questionIndex];
  const result = useMemo(() => sharedResult ?? calculateCrushResult(answers), [answers, sharedResult]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / CRUSH_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase === "result" && result) {
      trackResultView("crush-type", result.id);
    }
  }, [phase, result]);

  const start = useCallback(() => {
    trackTestStart("crush-type", "Crush Type Test");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareStatus("");
    window.history.replaceState(null, "", "/tests/crush-type");
  }, []);

  const choose = useCallback((choice: CrushChoice) => {
    trackQuestionAnswered("crush-type", questionIndex + 1);
    const nextAnswer: CrushAnswer = {
      questionId: currentQuestion.id,
      choiceId: choice.id,
      weights: choice.weights,
    };
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);
    setShareStatus("");
    if (questionIndex >= CRUSH_QUESTIONS.length - 1) {
      const nextResult = calculateCrushResult(nextAnswers);
      const url = buildShareUrl("/tests/crush-type", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies CrushSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
  }, [answers, currentQuestion.id, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("crush-type", "test", result.id);
    const url = buildShareUrl("/tests/crush-type", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies CrushSharePayload);
    const title = t(locale, "짝사랑 유형 테스트 결과", "Crush Type Test Result");
    const body = t(locale, result.shareLine.ko, result.shareLine.en);
    try {
      if (navigator.share) {
        await navigator.share({ title, text: body, url });
        setShareStatus(t(locale, "공유 창을 열었습니다.", "Share sheet opened."));
        return;
      }
      await navigator.clipboard.writeText(`${body}\n${url}`);
      setShareStatus(t(locale, "결과 링크를 복사했습니다.", "Result link copied."));
    } catch {
      try {
        await navigator.clipboard.writeText(`${body}\n${url}`);
        setShareStatus(t(locale, "결과 링크를 복사했습니다.", "Result link copied."));
      } catch {
        setShareStatus(t(locale, "링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.", "Copy failed. Please copy the URL from the address bar."));
      }
    }
  }, [locale, result]);

  return (
    <main className="crush-test">
      <section className="shell">
        <nav className="back">
          <Link href="/">{t(locale, "← 놀자 홈으로", "← Back to Nolza.fun")}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="hero-card">
            <div className="hero-copy">
              <p className="eyebrow">{t(locale, "짝사랑 유형 테스트", "Crush Type Test")}</p>
              <h1>{t(locale, "좋아하는 사람 앞에서 나는 왜 이상해질까?", "Why Do I Act Weird Around My Crush?")}</h1>
              <p className="subtitle">
                {t(
                  locale,
                  "짝사랑할 때 드러나는 나의 숨겨진 연애 패턴을 알아보세요.",
                  "Discover your hidden pattern when you like someone.",
                )}
              </p>
              <p className="description">
                {t(
                  locale,
                  "답장 하나, 눈빛 하나, 말투 하나에도 괜히 마음이 흔들릴 때가 있죠. 당신은 좋아하는 사람 앞에서 어떤 사람이 되는지 확인해보세요.",
                  "A reply, a look, a small change in tone — suddenly everything feels meaningful. Find out what kind of person you become around your crush.",
                )}
              </p>
              <button type="button" onClick={start} className="primary">
                {t(locale, "테스트 시작하기", "Start the test")}
              </button>
              <p className="notice">{t(locale, "이 테스트는 재미용입니다. 실제 상대의 마음을 판단하지 않아요.", "This test is for fun. It does not determine anyone's real feelings.")}</p>
            </div>
            <div className="signal-art" aria-hidden>
              <span className="bubble bubble-one">...</span>
              <span className="bubble bubble-two">?</span>
              <span className="thread" />
              <span className="heart" />
            </div>
          </section>
        ) : (
          <section className="quiz-card">
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
        currentId="crush-type"
        ids={["joseon-couple", "kdrama-couple", "friend-match", "defense-mechanism"]}
        title={{ ko: "다음에 해볼 테스트", en: "Try These Next" }}
      />
      )}
      <AdBottom />
      <AdMobileSticky />

      <style jsx global>{`
        .crush-test {
          min-height: 100vh;
          color: #2b1720;
          background:
            radial-gradient(circle at 18% 8%, rgba(255, 169, 132, 0.28), transparent 28rem),
            radial-gradient(circle at 82% 12%, rgba(172, 128, 255, 0.2), transparent 30rem),
            linear-gradient(180deg, #241423 0%, #3a2230 35%, #fff1df 35%, #fff7eb 100%);
          padding: 24px clamp(16px, 4vw, 44px) 56px;
        }

        .shell {
          width: min(100%, 1040px);
          margin: 0 auto 34px;
        }

        .back {
          margin-bottom: 18px;
          font-size: 14px;
        }

        .back a {
          color: rgba(255, 247, 235, 0.88);
          text-decoration: none;
        }

        .hero-card,
        .quiz-card {
          border: 1px solid rgba(92, 48, 49, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 239, 219, 0.62)),
            #fff7eb;
          box-shadow: 0 30px 80px rgba(33, 15, 21, 0.28);
        }

        .hero-card {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 28px;
          align-items: center;
          padding: clamp(28px, 5vw, 64px);
          overflow: hidden;
        }

        .hero-copy {
          position: relative;
          z-index: 1;
        }

        .eyebrow,
        .progress-head span {
          margin: 0 0 12px;
          color: #ba3a58;
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
          color: #2a1720;
        }

        .subtitle,
        .description,
        .notice {
          max-width: 640px;
          color: rgba(43, 23, 32, 0.74);
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

        .notice {
          margin: 16px 0 0;
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
          color: #fffaf4;
          background: linear-gradient(135deg, #d84462, #9e2547);
          box-shadow: 0 18px 36px rgba(158, 37, 71, 0.28);
        }

        .secondary {
          color: #381d28;
          background: rgba(255, 255, 255, 0.68);
          border: 1px solid rgba(92, 48, 49, 0.18);
        }

        .primary:hover,
        .secondary:hover,
        .answer:hover {
          transform: translateY(-2px);
        }

        .signal-art {
          position: relative;
          min-height: 380px;
        }

        .heart {
          position: absolute;
          width: 154px;
          height: 154px;
          left: 50%;
          top: 52%;
          transform: translate(-50%, -50%) rotate(45deg);
          border-radius: 42px 44px 30px 44px;
          background: linear-gradient(135deg, #ff6d7e, #c83c64);
          box-shadow: 0 22px 56px rgba(200, 60, 100, 0.32), inset 0 2px 0 rgba(255, 255, 255, 0.36);
        }

        .heart::before,
        .heart::after {
          content: "";
          position: absolute;
          width: 154px;
          height: 154px;
          border-radius: 50%;
          background: inherit;
        }

        .heart::before {
          left: -76px;
          top: 0;
        }

        .heart::after {
          left: 0;
          top: -76px;
        }

        .bubble {
          position: absolute;
          z-index: 2;
          display: grid;
          place-items: center;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.74);
          color: #ba3a58;
          font-weight: 900;
          box-shadow: 0 18px 40px rgba(77, 38, 47, 0.18);
        }

        .bubble-one {
          width: 110px;
          height: 76px;
          left: 12%;
          top: 16%;
        }

        .bubble-two {
          width: 74px;
          height: 74px;
          right: 12%;
          bottom: 20%;
          font-size: 34px;
        }

        .thread {
          position: absolute;
          inset: 10% 8% 8%;
          border: 1px solid rgba(186, 58, 88, 0.24);
          border-radius: 48% 52% 44% 56%;
          transform: rotate(-12deg);
        }

        .quiz-card {
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
          color: #7a3f4e;
          font-size: 15px;
        }

        .progress-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(92, 48, 49, 0.12);
        }

        .progress-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #d84462, #ff9b74);
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
          border: 1px solid rgba(92, 48, 49, 0.16);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.58);
          color: #301922;
          cursor: pointer;
          padding: 18px;
          text-align: left;
          box-shadow: 0 12px 28px rgba(78, 38, 47, 0.08);
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        }

        .answer span {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #321a25;
          color: #fff4eb;
          font-size: 13px;
          font-weight: 900;
        }

        .answer strong {
          font-size: 16px;
          line-height: 1.55;
        }

        .answer:hover {
          border-color: rgba(216, 68, 98, 0.42);
          box-shadow: 0 18px 34px rgba(158, 37, 71, 0.13);
        }

        .result {
          display: grid;
          gap: 22px;
        }

        .shared-label {
          width: max-content;
          border: 1px solid rgba(216, 68, 98, 0.24);
          border-radius: 999px;
          background: rgba(216, 68, 98, 0.08);
          color: #9e2547;
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
          color: #ba3a58;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 900;
        }

        .result-description {
          margin: 0;
          color: rgba(43, 23, 32, 0.8);
          font-size: 18px;
          line-height: 1.82;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .result-box {
          border: 1px solid rgba(92, 48, 49, 0.15);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.58);
          padding: 16px;
        }

        .result-box span {
          display: block;
          margin-bottom: 8px;
          color: #ba3a58;
          font-size: 13px;
          font-weight: 900;
        }

        .result-box p {
          margin: 0;
          color: #301922;
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
          color: rgba(43, 23, 32, 0.68);
          font-size: 14px;
        }

        @media (max-width: 780px) {
          .hero-card {
            grid-template-columns: 1fr;
          }

          .signal-art {
            min-height: 260px;
            order: -1;
          }

          .answers,
          .result-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .crush-test {
            padding-inline: 14px;
          }

          .hero-card,
          .quiz-card {
            border-radius: 24px;
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
  result: CrushResult;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  return (
    <section className="result">
      {shared ? <span className="shared-label">{t(locale, "공유된 결과", "Shared Result")}</span> : null}
      <div className="result-title">
        <p className="eyebrow">{t(locale, "나의 짝사랑 유형", "My Crush Type")}</p>
        <h2>{text(locale, result.title)}</h2>
        <p className="one-liner">{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>
      <div className="result-grid">
        <div className="result-box">
          <span>{t(locale, "강점", "Strength")}</span>
          <p>{text(locale, result.strength)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "주의할 점", "Weak Point")}</span>
          <p>{text(locale, result.weakPoint)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "친구가 보면 할 말", "What Friends Would Say")}</span>
          <p>{text(locale, result.friendSays)}</p>
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
            trackRetryClick("crush-type", "test");
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
