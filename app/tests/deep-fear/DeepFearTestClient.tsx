"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
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
  DEEP_FEAR_COPY,
  DEEP_FEAR_QUESTIONS,
  calculateDeepFearResult,
  getDeepFearResultById,
  localized,
  type DeepFearChoice,
  type DeepFearDimension,
  type DeepFearResult,
} from "@/lib/deep-fear-test";

type Phase = "intro" | "quiz" | "result";
type DeepFearSharePayload = {
  v: 1;
  resultId: DeepFearDimension;
  locale?: SimpleLocale;
};

const TEST_ID = "deep-fear";
const TEST_PATH = "/tests/deep-fear";

export default function DeepFearTestClient() {
  const { locale, setLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DeepFearChoice[]>([]);
  const [sharedResult, setSharedResult] = useState<DeepFearResult | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const payload = decodeSharePayload<DeepFearSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getDeepFearResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(DEEP_FEAR_QUESTIONS.length - 1);
        setAnswers([]);
        if (payload.locale === "ko" || payload.locale === "en") setLocale(payload.locale);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = DEEP_FEAR_QUESTIONS[questionIndex];
  const calculated = useMemo(() => calculateDeepFearResult(answers), [answers]);
  const result = sharedResult ?? calculated.result;
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / DEEP_FEAR_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase !== "quiz") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result") trackResultView(TEST_ID, result.id);
  }, [phase, result.id]);

  const start = useCallback(() => {
    trackTestStart(TEST_ID, DEEP_FEAR_COPY.title.en);
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareCopied(false);
    if (window.location.search) window.history.replaceState(null, "", TEST_PATH);
  }, []);

  const retry = useCallback(() => {
    trackRetryClick(TEST_ID, "test");
    start();
  }, [start]);

  const choose = useCallback((choice: DeepFearChoice) => {
    trackQuestionAnswered(TEST_ID, questionIndex + 1);
    const nextAnswers = [...answers, choice];
    setAnswers(nextAnswers);
    setShareCopied(false);

    if (questionIndex >= DEEP_FEAR_QUESTIONS.length - 1) {
      const nextResult = calculateDeepFearResult(nextAnswers).result;
      const url = buildShareUrl(TEST_PATH, {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies DeepFearSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }

    setQuestionIndex((value) => value + 1);
  }, [answers, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick(TEST_ID, "test", result.id);
    const url = buildShareUrl(TEST_PATH, {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies DeepFearSharePayload);
    const shareText = locale === "ko"
      ? `나는 "${result.title.ko}" 유형이 나왔어.\n당신 안의 가장 깊은 공포는?`
      : `I got "${result.title.en}" on What Is Your Deepest Fear?`;
    const title = DEEP_FEAR_COPY.title[locale];

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
    <main className={`deep-fear-page deep-fear-page--${phase}`} lang={locale}>
      {phase !== "quiz" && (
        <header className="topbar">
          <Link href="/" className="home-link">{homeBackLabel(locale)}</Link>
          <div className="locale-switch" aria-label={locale === "ko" ? "언어 선택" : "Language selection"}>
            <button type="button" className={locale === "ko" ? "active" : ""} onClick={() => setLocale("ko")}>KO</button>
            <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button>
          </div>
        </header>
      )}

      <section className="shell" style={{ "--accent": result.accent } as CSSProperties}>
        {phase === "intro" ? (
          <IntroView locale={locale} onStart={start} />
        ) : (
          <section className={`test-surface test-surface--${phase}`}>
            <div className={`progress-head ${phase === "quiz" ? "progress-head--active" : ""}`}>
              {phase === "quiz" ? (
                <Link href="/" className="test-exit-link" aria-label={homeBackLabel(locale)}>
                  ←
                </Link>
              ) : (
                <span>{DEEP_FEAR_COPY.resultLabel[locale]}</span>
              )}
              <strong>
                {phase === "result"
                  ? `${DEEP_FEAR_QUESTIONS.length} / ${DEEP_FEAR_QUESTIONS.length}`
                  : `${questionIndex + 1} / ${DEEP_FEAR_QUESTIONS.length}`}
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
          <AdResult placement="deep-fear-result" />
          <RecommendedGames
            currentId="deep-fear"
            ids={["breaking-point", "defense-mechanism", "thinking-pattern", "scene-choice"]}
            title={DEEP_FEAR_COPY.related}
          />
        </>
      )}
      <style jsx>{styles}</style>
    </main>
  );
}

function IntroView({ locale, onStart }: { locale: SimpleLocale; onStart: () => void }) {
  return (
    <section className="intro">
      <div className="intro-mark" aria-hidden>
        <span />
      </div>
      <div className="intro-copy-panel">
        <p className="eyebrow">{DEEP_FEAR_COPY.badge[locale]}</p>
        <h1>{DEEP_FEAR_COPY.title[locale]}</h1>
        <p className="subtitle">{DEEP_FEAR_COPY.subtitle[locale]}</p>
        <p className="description">{DEEP_FEAR_COPY.description[locale]}</p>
        <p className="disclaimer">{DEEP_FEAR_COPY.disclaimer[locale]}</p>
        <div className="intro-chips" aria-label={locale === "ko" ? "테스트 정보" : "Test info"}>
          <span>{locale === "ko" ? "16문항" : "16 questions"}</span>
          <span>{locale === "ko" ? "약 4분" : "About 4 min"}</span>
          <span>{locale === "ko" ? "심리 호러" : "Quiet horror"}</span>
        </div>
        <button type="button" className="primary" onClick={onStart}>
          {DEEP_FEAR_COPY.start[locale]}
        </button>
      </div>
    </section>
  );
}

function QuestionView({
  question,
  locale,
  onChoose,
}: {
  question: (typeof DEEP_FEAR_QUESTIONS)[number];
  locale: SimpleLocale;
  onChoose: (choice: DeepFearChoice) => void;
}) {
  return (
    <div className="question-view">
      <div className="question-copy">
        <div className="question-situation">
          <span>{DEEP_FEAR_COPY.situationLabel[locale]}</span>
          <p>{localized(locale, question.situation)}</p>
        </div>
        <div className="question-prompt">
          <span>{DEEP_FEAR_COPY.promptLabel[locale]}</span>
          <h2>{localized(locale, question.prompt)}</h2>
        </div>
      </div>
      <div className="choices">
        {question.choices.map((choice, index) => (
          <button key={choice.id} type="button" onClick={() => onChoose(choice)}>
            <span>{String.fromCharCode(65 + index)}</span>
            <strong>{localized(locale, choice.text)}</strong>
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
  result: DeepFearResult;
  isShared: boolean;
  onShare: () => void;
  onRetry: () => void;
  shareCopied: boolean;
}) {
  return (
    <article className="result-view">
      {isShared && <p className="shared-label">{locale === "ko" ? "공유된 결과" : "Shared result"}</p>}
      <div className="result-hero">
        <span>{result.englishLabel}</span>
        <h2>{localized(locale, result.title)}</h2>
        <p>{localized(locale, result.hook)}</p>
      </div>
      <p className="result-description">{localized(locale, result.description)}</p>

      <div className="result-grid">
        <section className="result-scene">
          <span>{DEEP_FEAR_COPY.scene[locale]}</span>
          <p>{localized(locale, result.scene)}</p>
        </section>
        <section>
          <span>{DEEP_FEAR_COPY.quietMoment[locale]}</span>
          <p>{localized(locale, result.quietMoment)}</p>
        </section>
        <section>
          <span>{DEEP_FEAR_COPY.facing[locale]}</span>
          <p>{localized(locale, result.facing)}</p>
        </section>
        <section className="final-card">
          <span>{DEEP_FEAR_COPY.finalLine[locale]}</span>
          <p>{localized(locale, result.finalLine)}</p>
        </section>
      </div>

      <div className="actions">
        <button type="button" className="primary" onClick={onShare}>
          {shareCopied ? DEEP_FEAR_COPY.copied[locale] : DEEP_FEAR_COPY.share[locale]}
        </button>
        <button type="button" className="secondary" onClick={onRetry}>
          {DEEP_FEAR_COPY.retry[locale]}
        </button>
      </div>
    </article>
  );
}

const styles = `
  .deep-fear-page {
    min-height: 100vh;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    color: #f3e6d6;
    background:
      radial-gradient(circle at 16% 8%, rgba(159, 61, 78, 0.25), transparent 28rem),
      radial-gradient(circle at 82% 0%, rgba(80, 104, 116, 0.2), transparent 26rem),
      linear-gradient(180deg, rgba(243, 230, 214, 0.035), transparent 36%),
      linear-gradient(145deg, #050506 0%, #101014 48%, #1e1719 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
  }
  .deep-fear-page::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255,255,255,0.014) 1px, transparent 1px);
    background-size: 54px 54px;
    mask-image: linear-gradient(180deg, black, transparent 78%);
  }
  .topbar {
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
    color: #f3e6d6;
    text-decoration: none;
    font-weight: 950;
    letter-spacing: 0.04em;
  }
  .locale-switch {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    background: rgba(243, 230, 214, 0.08);
    border: 1px solid rgba(243, 230, 214, 0.14);
  }
  .locale-switch button {
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(243, 230, 214, 0.68);
    cursor: pointer;
    padding: 8px 12px;
    font-weight: 900;
  }
  .locale-switch button.active {
    background: #f3e6d6;
    color: #131012;
  }
  .shell {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: clamp(28px, 5vh, 58px) 0 74px;
    position: relative;
    z-index: 1;
  }
  .intro {
    width: min(100%, 800px);
    min-height: min(650px, calc(100vh - 140px));
    display: grid;
    align-content: center;
    justify-items: start;
    position: relative;
    overflow: hidden;
    margin: clamp(12px, 5vh, 52px) auto 0;
    padding: clamp(32px, 6vw, 66px);
    border: 1px solid rgba(243, 230, 214, 0.15);
    border-radius: 28px;
    background:
      linear-gradient(90deg, rgba(5, 5, 6, 0.88), rgba(5, 5, 6, 0.54) 58%, rgba(5, 5, 6, 0.78)),
      radial-gradient(circle at 82% 20%, rgba(196, 154, 97, 0.12), transparent 18rem),
      url("/thumbnails-generated/deep-fear-banner.png") center / cover,
      linear-gradient(180deg, rgba(243, 230, 214, 0.09), rgba(243, 230, 214, 0.035)),
      rgba(5, 5, 6, 0.68);
    box-shadow: 0 34px 100px rgba(0, 0, 0, 0.38);
  }
  .intro-mark {
    position: absolute;
    right: clamp(28px, 7vw, 72px);
    top: clamp(28px, 7vw, 66px);
    width: clamp(120px, 18vw, 210px);
    aspect-ratio: 0.68;
    border: 1px solid rgba(243, 230, 214, 0.2);
    border-radius: 999px;
    opacity: 0.64;
  }
  .intro-mark span {
    position: absolute;
    inset: 18%;
    border: 1px solid rgba(243, 230, 214, 0.13);
    border-radius: inherit;
  }
  .eyebrow,
  .progress-head span,
  .result-hero span,
  .result-grid span,
  .shared-label {
    color: #c49a61;
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
    max-width: 740px;
    color: #fff4e6;
    font-size: clamp(2.35rem, 6.2vw, 5.2rem);
    line-height: 1.06;
    word-break: keep-all;
  }
  .subtitle {
    max-width: 680px;
    margin: 22px 0 0;
    color: #c49a61;
    font-size: clamp(1.08rem, 2.5vw, 1.38rem);
    font-weight: 850;
    line-height: 1.56;
    word-break: keep-all;
  }
  .description,
  .disclaimer {
    max-width: 700px;
    line-height: 1.74;
    word-break: keep-all;
  }
  .description {
    margin: 14px 0 26px;
    color: rgba(243, 230, 214, 0.78);
    font-size: 1.02rem;
    font-weight: 650;
  }
  .disclaimer {
    margin: 12px 0 0;
    color: rgba(243, 230, 214, 0.52);
    font-size: 0.9rem;
    font-weight: 650;
  }
  .intro-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 22px;
  }
  .intro-chips span {
    border: 1px solid rgba(243, 230, 214, 0.16);
    border-radius: 999px;
    background: rgba(243, 230, 214, 0.07);
    padding: 8px 11px;
    color: rgba(243, 230, 214, 0.74);
    font-size: 0.82rem;
    font-weight: 900;
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
    color: #140f10;
    background: linear-gradient(135deg, #ead3a7, #b75b62);
    box-shadow: 0 14px 34px rgba(183, 91, 98, 0.28);
  }
  .secondary {
    color: #f3e6d6;
    background: rgba(243, 230, 214, 0.08);
    border: 1px solid rgba(243, 230, 214, 0.22);
  }
  .primary:hover,
  .secondary:hover,
  .choices button:hover {
    transform: translateY(-2px);
  }
  .test-surface {
    position: relative;
    margin-top: clamp(4px, 1.2vh, 14px);
  }
  .test-surface--result {
    padding: clamp(24px, 5vw, 48px);
    border: 1px solid rgba(243, 230, 214, 0.15);
    border-radius: 30px;
    background:
      radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 28rem),
      linear-gradient(145deg, rgba(243, 230, 214, 0.11), rgba(255, 255, 255, 0.035)),
      rgba(7, 7, 8, 0.78);
    box-shadow: 0 34px 100px rgba(0, 0, 0, 0.34);
  }
  .progress-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
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
    color: rgba(243, 230, 214, 0.74);
    background: rgba(243, 230, 214, 0.08);
    border: 1px solid rgba(243, 230, 214, 0.14);
    text-decoration: none;
    font-size: 19px;
    font-weight: 950;
    line-height: 1;
  }
  .progress-head strong {
    color: rgba(243, 230, 214, 0.74);
    font-weight: 950;
  }
  .progress-bar {
    height: 8px;
    overflow: hidden;
    margin-top: 12px;
    border-radius: 999px;
    background: rgba(243, 230, 214, 0.12);
  }
  .progress-bar i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ead3a7, var(--accent));
    transition: width 220ms ease;
  }
  .question-view {
    padding-top: clamp(22px, 4vh, 34px);
  }
  .question-copy {
    display: grid;
    gap: 18px;
  }
  .question-situation {
    max-width: 840px;
    border-left: 2px solid color-mix(in srgb, var(--accent) 66%, #ead3a7);
    padding-left: 16px;
  }
  .question-situation span,
  .question-prompt span {
    display: inline-flex;
    margin-bottom: 9px;
    color: #c49a61;
    font-size: 0.75rem;
    font-weight: 950;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .question-situation p {
    margin: 0;
    color: rgba(255, 245, 232, 0.86);
    font-size: clamp(1rem, 1.7vw, 1.15rem);
    line-height: 1.72;
    font-weight: 720;
    word-break: keep-all;
  }
  .question-prompt h2 {
    max-width: 820px;
    color: #fff4e6;
    font-size: clamp(1.42rem, 3vw, 2.2rem);
    line-height: 1.42;
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
    border: 1px solid rgba(243, 230, 214, 0.16);
    border-radius: 20px;
    background:
      linear-gradient(135deg, rgba(243, 230, 214, 0.105), rgba(243, 230, 214, 0.04)),
      rgba(0, 0, 0, 0.18);
    color: #f3e6d6;
    cursor: pointer;
    padding: 16px;
    text-align: left;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }
  .choices button:hover {
    border-color: color-mix(in srgb, var(--accent) 62%, #f3e6d6);
    background: rgba(243, 230, 214, 0.13);
  }
  .choices span {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(243, 230, 214, 0.14);
    color: #ead3a7;
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
    border: 1px solid rgba(196, 154, 97, 0.28);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(196, 154, 97, 0.09);
  }
  .result-hero h2 {
    margin-top: 10px;
    color: #fff4e6;
    font-size: clamp(2.2rem, 5.4vw, 4.8rem);
    line-height: 1.06;
    word-break: keep-all;
  }
  .result-hero p {
    max-width: 760px;
    margin: 14px 0 0;
    color: #c49a61;
    font-size: clamp(1.07rem, 2.3vw, 1.3rem);
    font-weight: 850;
    line-height: 1.58;
    word-break: keep-all;
  }
  .result-description {
    max-width: 880px;
    margin: 0;
    color: rgba(243, 230, 214, 0.82);
    font-size: 1.03rem;
    line-height: 1.84;
    font-weight: 680;
    word-break: keep-all;
  }
  .result-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .result-grid section {
    border: 1px solid rgba(243, 230, 214, 0.14);
    border-radius: 22px;
    background:
      linear-gradient(135deg, rgba(243, 230, 214, 0.1), rgba(243, 230, 214, 0.035)),
      rgba(0, 0, 0, 0.18);
    padding: 18px;
  }
  .result-grid section p {
    margin: 9px 0 0;
    color: rgba(243, 230, 214, 0.84);
    line-height: 1.72;
    font-weight: 700;
    word-break: keep-all;
  }
  .result-scene,
  .final-card {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 19%, transparent), rgba(243, 230, 214, 0.04)),
      rgba(0, 0, 0, 0.2) !important;
    border-color: color-mix(in srgb, var(--accent) 34%, transparent) !important;
  }
  .final-card p {
    color: #fff4e6 !important;
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
  @media (min-width: 900px) and (max-height: 820px) {
    .shell {
      padding-top: 18px;
    }
    .question-view {
      padding-top: 22px;
    }
    .question-copy {
      gap: 14px;
    }
    .choices {
      margin-top: 18px;
    }
    .choices button {
      min-height: 84px;
      padding: 14px;
    }
  }
  @media (max-width: 760px) {
    .intro,
    .test-surface--result {
      border-radius: 24px;
    }
    .intro-mark {
      opacity: 0.28;
      right: 22px;
      top: 22px;
      width: 112px;
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
    .topbar,
    .shell {
      width: min(100% - 24px, 1040px);
    }
    .intro,
    .test-surface--result {
      padding: 24px 18px;
    }
    .shell {
      padding-top: max(18px, env(safe-area-inset-top));
      padding-bottom: 54px;
    }
    .question-view {
      padding-top: 22px;
    }
    .choices button {
      min-height: 82px;
      padding: 14px;
    }
  }

  .deep-fear-page {
    color: #f6eadb;
    background:
      radial-gradient(circle at 18% 12%, rgba(151, 67, 76, 0.2), transparent 28rem),
      radial-gradient(circle at 88% 8%, rgba(195, 154, 97, 0.12), transparent 24rem),
      linear-gradient(180deg, rgba(255, 244, 230, 0.035), transparent 38%),
      linear-gradient(145deg, #050506 0%, #0c0c0f 42%, #171113 100%);
  }
  .deep-fear-page::before {
    background:
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255,255,255,0.012) 1px, transparent 1px),
      radial-gradient(circle at 50% 22%, transparent 0 18rem, rgba(0,0,0,0.28) 44rem);
    background-size: 64px 64px, 64px 64px, auto;
  }
  .deep-fear-page .shell {
    width: min(1120px, calc(100% - 32px));
  }
  .deep-fear-page--intro .intro {
    width: min(100%, 980px);
    min-height: min(680px, calc(100svh - 126px));
    border-radius: 34px;
    border-color: rgba(246, 234, 219, 0.18);
    padding: clamp(30px, 6vw, 72px);
    background:
      linear-gradient(90deg, rgba(4, 4, 5, 0.64) 0%, rgba(5, 5, 6, 0.42) 46%, rgba(8, 8, 10, 0.2) 74%, rgba(5, 5, 6, 0.4) 100%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.24)),
      radial-gradient(circle at 78% 32%, rgba(196, 154, 97, 0.16), transparent 18rem),
      url("/thumbnails-generated/deep-fear-banner.png") center / cover,
      #08080a;
    box-shadow:
      0 38px 110px rgba(0, 0, 0, 0.48),
      inset 0 1px 0 rgba(246, 234, 219, 0.09);
  }
  .deep-fear-page--intro .intro::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.08) 48%, transparent 100%),
      linear-gradient(180deg, rgba(255, 244, 230, 0.055), transparent 34%),
      radial-gradient(circle at 50% 108%, transparent 0 22rem, rgba(0, 0, 0, 0.18) 38rem);
  }
  .deep-fear-page--intro .intro > * {
    position: relative;
    z-index: 1;
  }
  .deep-fear-page--intro .intro-copy-panel {
    width: min(100%, 720px);
    display: grid;
    justify-items: start;
    padding: clamp(22px, 4vw, 38px);
    border: 1px solid rgba(255, 244, 230, 0.2);
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(9, 9, 12, 0.74), rgba(8, 6, 8, 0.58)),
      rgba(5, 5, 8, 0.62);
    box-shadow:
      0 28px 70px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 244, 230, 0.08);
    backdrop-filter: blur(16px) saturate(1.1);
  }
  .deep-fear-page--intro .intro-mark {
    right: clamp(26px, 6vw, 74px);
    top: clamp(24px, 6vw, 62px);
    width: clamp(88px, 14vw, 168px);
    border-color: rgba(246, 234, 219, 0.13);
    opacity: 0.42;
  }
  .deep-fear-page h1 {
    max-width: 760px;
    font-size: clamp(2.45rem, 6vw, 5rem);
    line-height: 1.08;
    color: #fff3e4;
    text-shadow: 0 18px 46px rgba(0, 0, 0, 0.58);
  }
  .deep-fear-page .subtitle {
    max-width: 720px;
    color: #ffdca3;
    text-shadow: 0 10px 26px rgba(0, 0, 0, 0.56);
  }
  .deep-fear-page .description {
    max-width: 720px;
    color: rgba(255, 246, 235, 0.94);
    text-shadow: 0 8px 24px rgba(0, 0, 0, 0.58);
  }
  .deep-fear-page .intro-chips span {
    border-color: rgba(255, 244, 230, 0.22);
    background: rgba(255, 244, 230, 0.1);
    color: rgba(255, 244, 230, 0.82);
    backdrop-filter: blur(12px);
  }
  .deep-fear-page .primary {
    min-height: 56px;
    border: 1px solid rgba(255, 244, 230, 0.14);
    background:
      linear-gradient(135deg, #ead3a7, #9b4d55 58%, #4b2028);
    box-shadow:
      0 18px 42px rgba(155, 77, 85, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }
  .deep-fear-page .disclaimer {
    max-width: 680px;
    margin: 12px 0 22px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #f8e7d0;
    font-size: 0.9rem;
    font-weight: 800;
    line-height: 1.62;
    text-shadow: 0 8px 22px rgba(0, 0, 0, 0.68);
  }
  .deep-fear-page--quiz .shell {
    min-height: calc(100svh - 20px);
    display: grid;
    align-items: center;
    padding-block: clamp(16px, 4vh, 38px);
  }
  .deep-fear-page--quiz .test-surface {
    width: min(100%, 980px);
    margin-inline: auto;
    padding: clamp(18px, 4vw, 38px);
    border: 1px solid rgba(246, 234, 219, 0.14);
    border-radius: 32px;
    background:
      radial-gradient(circle at 12% 12%, rgba(196, 154, 97, 0.09), transparent 20rem),
      linear-gradient(145deg, rgba(246, 234, 219, 0.09), rgba(246, 234, 219, 0.025)),
      rgba(7, 7, 8, 0.78);
    box-shadow:
      0 38px 110px rgba(0, 0, 0, 0.46),
      inset 0 1px 0 rgba(246, 234, 219, 0.08);
    backdrop-filter: blur(16px);
  }
  .deep-fear-page--quiz .progress-head {
    min-height: 38px;
  }
  .deep-fear-page--quiz .progress-bar {
    height: 4px;
    margin-top: 10px;
    background: rgba(246, 234, 219, 0.1);
  }
  .deep-fear-page--quiz .progress-bar i {
    background: linear-gradient(90deg, #d6b482, #7e3d46);
  }
  .deep-fear-page--quiz .question-view {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(300px, 0.74fr);
    align-items: start;
    gap: clamp(20px, 4vw, 44px);
    padding-top: clamp(24px, 5vw, 46px);
  }
  .deep-fear-page--quiz .question-copy {
    gap: clamp(18px, 3vw, 26px);
  }
  .deep-fear-page--quiz .question-situation {
    max-width: none;
    border-left: 0;
    border-radius: 24px;
    padding: clamp(18px, 3vw, 26px);
    background:
      linear-gradient(135deg, rgba(246, 234, 219, 0.08), rgba(246, 234, 219, 0.025)),
      rgba(0, 0, 0, 0.22);
    box-shadow: inset 0 0 0 1px rgba(246, 234, 219, 0.1);
  }
  .deep-fear-page--quiz .question-situation p {
    color: rgba(255, 244, 230, 0.9);
    font-size: clamp(1.02rem, 1.9vw, 1.24rem);
    line-height: 1.78;
    font-weight: 720;
  }
  .deep-fear-page--quiz .question-prompt h2 {
    max-width: 760px;
    color: #fff3e4;
    font-size: clamp(1.46rem, 3.5vw, 2.54rem);
    line-height: 1.35;
    text-shadow: 0 16px 42px rgba(0, 0, 0, 0.38);
  }
  .deep-fear-page--quiz .choices {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 0;
  }
  .deep-fear-page--quiz .choices button {
    min-height: 74px;
    grid-template-columns: 32px 1fr;
    border-radius: 18px;
    border-color: rgba(246, 234, 219, 0.13);
    padding: 14px 16px;
    background:
      linear-gradient(90deg, rgba(246, 234, 219, 0.07), rgba(246, 234, 219, 0.025)),
      rgba(0, 0, 0, 0.24);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
  }
  .deep-fear-page--quiz .choices button:hover {
    border-color: rgba(214, 180, 130, 0.48);
    background:
      linear-gradient(90deg, rgba(214, 180, 130, 0.15), rgba(126, 61, 70, 0.08)),
      rgba(0, 0, 0, 0.26);
  }
  .deep-fear-page--quiz .choices span {
    width: 30px;
    height: 30px;
    border: 1px solid rgba(214, 180, 130, 0.28);
    background: rgba(214, 180, 130, 0.1);
    color: #e8cf9e;
  }
  .deep-fear-page--quiz .choices strong {
    color: rgba(255, 244, 230, 0.9);
    font-size: clamp(0.96rem, 1.55vw, 1.08rem);
    line-height: 1.55;
  }
  .deep-fear-page--result .shell {
    width: min(1120px, calc(100% - 32px));
  }
  .deep-fear-page--result .test-surface--result {
    border-radius: 34px;
    border-color: rgba(246, 234, 219, 0.16);
    padding: clamp(22px, 5vw, 56px);
    background:
      radial-gradient(circle at 86% 9%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 28rem),
      linear-gradient(145deg, rgba(246, 234, 219, 0.1), rgba(246, 234, 219, 0.028)),
      rgba(7, 7, 8, 0.82);
  }
  .deep-fear-page--result .result-view {
    gap: clamp(20px, 3vw, 30px);
  }
  .deep-fear-page--result .result-hero {
    border-bottom: 1px solid rgba(246, 234, 219, 0.12);
    padding-bottom: clamp(18px, 3vw, 28px);
  }
  .deep-fear-page--result .result-hero h2 {
    max-width: 860px;
    font-size: clamp(2.15rem, 5.6vw, 5rem);
  }
  .deep-fear-page--result .result-hero p {
    max-width: 840px;
    color: #d6b482;
  }
  .deep-fear-page--result .result-description {
    max-width: 920px;
    color: rgba(246, 234, 219, 0.86);
    font-size: clamp(1rem, 1.6vw, 1.12rem);
  }
  .deep-fear-page--result .result-grid {
    gap: 14px;
  }
  .deep-fear-page--result .result-grid section {
    border-radius: 24px;
    border-color: rgba(246, 234, 219, 0.14);
    background:
      linear-gradient(135deg, rgba(246, 234, 219, 0.085), rgba(246, 234, 219, 0.025)),
      rgba(0, 0, 0, 0.2);
  }
  .deep-fear-page--result .result-grid section p {
    color: rgba(246, 234, 219, 0.86);
  }
  .deep-fear-page--result .final-card {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 24%, transparent), rgba(214, 180, 130, 0.08)),
      rgba(0, 0, 0, 0.22) !important;
  }
  @media (max-width: 820px) {
    .deep-fear-page--quiz .question-view {
      grid-template-columns: 1fr;
    }
    .deep-fear-page--quiz .choices {
      margin-top: 2px;
    }
  }
  @media (max-width: 520px) {
    .deep-fear-page .topbar,
    .deep-fear-page .shell {
      width: min(100% - 22px, 1120px);
    }
    .deep-fear-page--intro .intro,
    .deep-fear-page--quiz .test-surface,
    .deep-fear-page--result .test-surface--result {
      border-radius: 24px;
      padding: 22px 16px;
    }
    .deep-fear-page--quiz .question-view {
      padding-top: 22px;
      gap: 16px;
    }
    .deep-fear-page--quiz .choices button {
      min-height: 68px;
      padding: 13px;
    }
    .deep-fear-page--result .result-grid {
      grid-template-columns: 1fr;
    }
  }
`;
