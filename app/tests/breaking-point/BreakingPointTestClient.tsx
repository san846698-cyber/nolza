"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { AdResult } from "@/app/components/Ads";
import { homeBackLabel } from "@/app/components/BrandMark";
import RecommendedGames from "@/app/components/game/RecommendedGames";
import ReadableQuestion from "@/app/components/game/ReadableQuestion";
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
  BREAKING_COPY,
  BREAKING_QUESTIONS,
  calculateBreakingResult,
  getBreakingResultById,
  type BreakingChoice,
  type BreakingDimension,
  type BreakingResult,
} from "@/lib/breaking-point-test";

type Phase = "intro" | "quiz" | "result";
type BreakingSharePayload = {
  v: 1;
  resultId: BreakingDimension;
  locale?: SimpleLocale;
};

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export default function BreakingPointTestClient() {
  const { locale, setLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<BreakingChoice[]>([]);
  const [sharedResult, setSharedResult] = useState<BreakingResult | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const payload = decodeSharePayload<BreakingSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getBreakingResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(BREAKING_QUESTIONS.length - 1);
        setAnswers([]);
        if (payload.locale === "ko" || payload.locale === "en") setLocale(payload.locale);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = BREAKING_QUESTIONS[questionIndex];
  const calculated = useMemo(() => calculateBreakingResult(answers), [answers]);
  const result = sharedResult ?? calculated.result;
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / BREAKING_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase === "result") trackResultView("breaking-point", result.id);
  }, [phase, result.id]);

  const start = useCallback(() => {
    trackTestStart("breaking-point", "The Moment I Turn Cold");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareCopied(false);
    if (window.location.search) window.history.replaceState(null, "", "/tests/breaking-point");
  }, []);

  const retry = useCallback(() => {
    trackRetryClick("breaking-point", "test");
    start();
  }, [start]);

  const choose = useCallback((choice: BreakingChoice) => {
    trackQuestionAnswered("breaking-point", questionIndex + 1);
    const nextAnswers = [...answers, choice];
    setAnswers(nextAnswers);
    setShareCopied(false);

    if (questionIndex >= BREAKING_QUESTIONS.length - 1) {
      const nextResult = calculateBreakingResult(nextAnswers).result;
      const url = buildShareUrl("/tests/breaking-point", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies BreakingSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }

    setQuestionIndex((value) => value + 1);
  }, [answers, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("breaking-point", "test", result.id);
    const url = buildShareUrl("/tests/breaking-point", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies BreakingSharePayload);
    const shareText = locale === "ko"
      ? `나는 “나를 차갑게 만드는 순간” 테스트에서 「${result.title.ko}」 나왔다.\n이거 좀 맞는 듯.`
      : `I got "${result.title.en}" on The Moment I Turn Cold.\nThis feels pretty accurate.`;
    const title = BREAKING_COPY.title[locale];

    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText, url });
        return;
      }
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1800);
    } catch {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 1800);
      } catch {
        setShareCopied(false);
      }
    }
  }, [locale, result]);

  return (
    <main className="breaking-page" lang={locale}>
      <header className="breaking-topbar">
        <Link href="/" className="home-link">{homeBackLabel(locale)}</Link>
      </header>

      <section className="breaking-shell">
        {phase === "intro" ? (
          <section className="intro">
            <p className="eyebrow">{BREAKING_COPY.badge[locale]}</p>
            <h1>{BREAKING_COPY.title[locale]}</h1>
            <p className="subtitle">{BREAKING_COPY.subtitle[locale]}</p>
            <p className="description">{BREAKING_COPY.description[locale]}</p>
            <div className="intro-chips" aria-label={locale === "ko" ? "테스트 정보" : "Test info"}>
              <span>{locale === "ko" ? "16문항" : "16 questions"}</span>
              <span>{locale === "ko" ? "약 4분" : "About 4 min"}</span>
              <span>{locale === "ko" ? "감정 경계" : "Emotional boundary"}</span>
            </div>
            <button type="button" className="primary" onClick={start}>
              {BREAKING_COPY.start[locale]}
            </button>
            <p className="disclaimer">{BREAKING_COPY.disclaimer[locale]}</p>
          </section>
        ) : (
          <section className="test-card" style={{ "--accent": result.accent } as CSSProperties}>
            <div className="progress-head">
              <span>{phase === "result" ? BREAKING_COPY.resultLabel[locale] : BREAKING_COPY.questionCount[locale]}</span>
              <strong>
                {phase === "result"
                  ? `${BREAKING_QUESTIONS.length}/${BREAKING_QUESTIONS.length}`
                  : `${questionIndex + 1}/${BREAKING_QUESTIONS.length}`}
              </strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <i style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <QuestionView question={currentQuestion} locale={locale} onChoose={choose} />
            ) : (
              <ResultView
                locale={locale}
                result={result}
                isShared={Boolean(sharedResult)}
                onShare={share}
                onRetry={retry}
                shareCopied={shareCopied}
              />
            )}
          </section>
        )}
      </section>

      {phase === "result" && (
        <>
          <AdResult placement="breaking-point-result" />
          <RecommendedGames
            currentId="breaking-point"
            ids={["defense-mechanism", "scene-choice", "thinking-pattern", "value-conflict"]}
            title={BREAKING_COPY.related}
          />
        </>
      )}
      <style jsx>{styles}</style>
    </main>
  );
}

function QuestionView({
  question,
  locale,
  onChoose,
}: {
  question: (typeof BREAKING_QUESTIONS)[number];
  locale: SimpleLocale;
  onChoose: (choice: BreakingChoice) => void;
}) {
  return (
    <div className="question-view">
      <ReadableQuestion
        prompt={text(locale, question.prompt)}
        locale={locale}
      />
      <div className="choices">
        {question.choices.map((choice, index) => (
          <button key={choice.id} type="button" onClick={() => onChoose(choice)}>
            <span>{String.fromCharCode(65 + index)}</span>
            <strong>{text(locale, choice.text)}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultView({
  locale,
  result,
  isShared,
  onShare,
  onRetry,
  shareCopied,
}: {
  locale: SimpleLocale;
  result: BreakingResult;
  isShared: boolean;
  onShare: () => void;
  onRetry: () => void;
  shareCopied: boolean;
}) {
  return (
    <article className="result-view">
      {isShared && <p className="shared-label">{locale === "ko" ? "공유된 결과" : "Shared result"}</p>}
      <div className="result-title">
        <span>{locale === "ko" ? result.title.en : result.title.ko}</span>
        <h2>{text(locale, result.title)}</h2>
        <p>{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>

      <div className="result-grid">
        <section>
          <span>{BREAKING_COPY.howYouChange[locale]}</span>
          <p>{text(locale, result.howYouChange)}</p>
        </section>
        <section className="signal-card">
          <span>{BREAKING_COPY.sign[locale]}</span>
          <p>{text(locale, result.sign)}</p>
        </section>
        <section>
          <span>{BREAKING_COPY.gentleNote[locale]}</span>
          <p>{text(locale, result.gentleNote)}</p>
        </section>
        <section>
          <span>{BREAKING_COPY.friendComment[locale]}</span>
          <p>{text(locale, result.friendComment)}</p>
        </section>
      </div>

      <div className="actions">
        <button type="button" className="primary" onClick={onShare}>
          {shareCopied ? BREAKING_COPY.copied[locale] : BREAKING_COPY.share[locale]}
        </button>
        <button type="button" className="secondary" onClick={onRetry}>
          {BREAKING_COPY.retry[locale]}
        </button>
      </div>
    </article>
  );
}

const styles = `
  .breaking-page {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    color: #f4eadc;
    background:
      linear-gradient(180deg, rgba(244, 234, 220, 0.035), transparent 34%),
      linear-gradient(145deg, #12100f 0%, #211b18 52%, #302720 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
  }
  .breaking-topbar {
    width: min(1080px, calc(100% - 32px));
    margin: 0 auto;
    padding: 18px 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: relative;
    z-index: 2;
  }
  .home-link {
    color: #f4eadc;
    text-decoration: none;
    font-weight: 950;
    letter-spacing: 0.04em;
  }
  .locale-switch {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    background: rgba(244, 234, 220, 0.08);
    border: 1px solid rgba(244, 234, 220, 0.14);
  }
  .locale-switch button {
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(244, 234, 220, 0.68);
    cursor: pointer;
    padding: 8px 12px;
    font-weight: 900;
  }
  .locale-switch button.active {
    background: #f4eadc;
    color: #211815;
  }
  .breaking-shell {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: 26px 0 74px;
    position: relative;
    z-index: 1;
  }
  .intro,
  .test-card {
    border: 1px solid rgba(244, 234, 220, 0.16);
    box-shadow: 0 34px 100px rgba(0, 0, 0, 0.3);
  }
  .intro {
    width: min(100%, 780px);
    min-height: min(650px, calc(100vh - 140px));
    display: grid;
    align-content: center;
    justify-items: start;
    position: relative;
    overflow: hidden;
    margin: clamp(16px, 5vh, 54px) auto 0;
    padding: clamp(32px, 6vw, 64px);
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(244, 234, 220, 0.105), rgba(244, 234, 220, 0.045)),
      rgba(16, 13, 12, 0.62);
  }
  .eyebrow,
  .question-kicker,
  .progress-head span,
  .result-title span,
  .result-grid span,
  .shared-label {
    color: #d7a36f;
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .eyebrow {
    margin: 0 0 16px;
  }
  h1,
  h2 {
    margin: 0;
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    letter-spacing: 0;
  }
  h1 {
    max-width: 720px;
    color: #fff2e2;
    font-size: clamp(2.35rem, 6.4vw, 5.35rem);
    line-height: 1.06;
    word-break: keep-all;
  }
  .subtitle {
    max-width: 700px;
    margin: 22px 0 0;
    color: #d7a36f;
    font-size: clamp(1.12rem, 2.6vw, 1.45rem);
    font-weight: 850;
    line-height: 1.55;
    word-break: keep-all;
  }
  .description,
  .disclaimer,
  .meta-line {
    max-width: 700px;
    line-height: 1.72;
    word-break: keep-all;
  }
  .description {
    margin: 14px 0 28px;
    color: rgba(244, 234, 220, 0.78);
    font-size: 1.02rem;
    font-weight: 650;
  }
  .disclaimer {
    margin: 10px 0 0;
    color: rgba(244, 234, 220, 0.52);
    font-size: 0.9rem;
    font-weight: 650;
  }
  .meta-line {
    margin: 13px 0 0;
    color: rgba(215, 163, 111, 0.86);
    font-size: 0.86rem;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .primary,
  .secondary {
    min-height: 52px;
    border-radius: 999px;
    padding: 0 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 950;
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
  }
  .primary {
    border: 0;
    color: #211410;
    background: linear-gradient(135deg, #efd1a0, #d86c54);
    box-shadow: 0 14px 34px rgba(216, 108, 84, 0.26);
  }
  .secondary {
    color: #f4eadc;
    background: rgba(244, 234, 220, 0.08);
    border: 1px solid rgba(244, 234, 220, 0.22);
  }
  .primary:hover,
  .secondary:hover,
  .choices button:hover {
    transform: translateY(-2px);
  }
  .test-card {
    padding: clamp(24px, 5vw, 48px);
    border-radius: 32px;
    background:
      radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 28rem),
      linear-gradient(145deg, rgba(244, 234, 220, 0.12), rgba(255, 255, 255, 0.045)),
      rgba(20, 16, 14, 0.75);
    backdrop-filter: blur(18px);
  }
  .progress-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .progress-head strong {
    color: rgba(244, 234, 220, 0.74);
    font-weight: 950;
  }
  .progress-bar {
    height: 8px;
    overflow: hidden;
    margin-top: 12px;
    border-radius: 999px;
    background: rgba(244, 234, 220, 0.12);
  }
  .progress-bar i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #efd1a0, var(--accent));
    transition: width 220ms ease;
  }
  .question-view {
    padding-top: 34px;
  }
  .question-kicker {
    margin: 0 0 14px;
  }
  .question-view h2 {
    max-width: 820px;
    color: #fff2e2;
    font-size: clamp(1.45rem, 3.4vw, 2.35rem);
    line-height: 1.48;
    word-break: keep-all;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 24px;
  }
  .choices button {
    min-height: 92px;
    display: grid;
    grid-template-columns: 34px 1fr;
    align-items: center;
    gap: 12px;
    border: 1px solid rgba(244, 234, 220, 0.16);
    border-radius: 20px;
    background:
      linear-gradient(135deg, rgba(244, 234, 220, 0.105), rgba(244, 234, 220, 0.04)),
      rgba(0, 0, 0, 0.16);
    color: #f4eadc;
    cursor: pointer;
    padding: 16px;
    text-align: left;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }
  .choices button:hover {
    border-color: color-mix(in srgb, var(--accent) 62%, #f4eadc);
    background: rgba(244, 234, 220, 0.13);
  }
  .choices span {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(244, 234, 220, 0.14);
    color: #efd1a0;
    font-size: 0.8rem;
    font-weight: 950;
  }
  .choices strong {
    font-size: 1rem;
    line-height: 1.48;
    word-break: keep-all;
  }
  .result-view {
    display: grid;
    gap: 24px;
    padding-top: 30px;
  }
  .shared-label {
    width: max-content;
    margin: 0;
    border: 1px solid rgba(215, 163, 111, 0.28);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(215, 163, 111, 0.09);
  }
  .result-title h2 {
    margin-top: 10px;
    color: #fff2e2;
    font-size: clamp(2.3rem, 6vw, 5rem);
    line-height: 1.04;
    word-break: keep-all;
  }
  .result-title p {
    max-width: 740px;
    margin: 14px 0 0;
    color: #d7a36f;
    font-size: clamp(1.08rem, 2.4vw, 1.34rem);
    font-weight: 850;
    line-height: 1.55;
    word-break: keep-all;
  }
  .result-description {
    max-width: 840px;
    margin: 0;
    color: rgba(244, 234, 220, 0.82);
    font-size: 1.04rem;
    line-height: 1.82;
    font-weight: 680;
    word-break: keep-all;
  }
  .result-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .result-grid section {
    border: 1px solid rgba(244, 234, 220, 0.14);
    border-radius: 22px;
    background:
      linear-gradient(135deg, rgba(244, 234, 220, 0.11), rgba(244, 234, 220, 0.045)),
      rgba(0, 0, 0, 0.16);
    padding: 18px;
  }
  .result-grid section p {
    margin: 9px 0 0;
    color: rgba(244, 234, 220, 0.84);
    line-height: 1.72;
    font-weight: 700;
    word-break: keep-all;
  }
  .signal-card {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), rgba(244, 234, 220, 0.045)),
      rgba(0, 0, 0, 0.18) !important;
    border-color: color-mix(in srgb, var(--accent) 34%, transparent) !important;
  }
  .signal-card p {
    color: #fff2e2 !important;
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    font-size: clamp(1.04rem, 2.4vw, 1.24rem);
    font-weight: 900 !important;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }
  .actions button {
    min-width: 172px;
  }
  @media (max-width: 760px) {
    .intro,
    .test-card {
      border-radius: 24px;
    }
    .choices,
    .result-grid {
      grid-template-columns: 1fr;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
    }
    .actions button {
      width: 100%;
    }
  }
  @media (max-width: 480px) {
    .breaking-topbar,
    .breaking-shell {
      width: min(100% - 24px, 1040px);
    }
    .intro,
    .test-card {
      padding: 24px 18px;
    }
    .choices button {
      min-height: 82px;
    }
  }
`;
