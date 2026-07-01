"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { AdResult } from "@/app/components/Ads";
import { homeBackLabel } from "@/app/components/BrandMark";
import ResultScreen from "@/app/components/game/ResultScreen";
import ReadableQuestion from "@/app/components/game/ReadableQuestion";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  trackQuestionAnswered,
  trackResultView,
  trackRetryClick,
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
    if (phase !== "quiz") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result") trackResultView("breaking-point", result.id);
  }, [phase, result.id]);

  const start = useCallback(() => {
    trackTestStart("breaking-point", "The Moment I Turn Cold");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
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

  return (
    <main className={`breaking-page breaking-page--${phase}`} lang={locale}>
      {phase !== "quiz" && (
        <header className="breaking-topbar">
          <Link href="/" className="home-link">{homeBackLabel(locale)}</Link>
        </header>
      )}

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
        ) : phase === "quiz" ? (
          <section className="test-card" style={{ "--accent": result.accent } as CSSProperties}>
            <div className="progress-head progress-head--active">
              <Link href="/" className="test-exit-link" aria-label={homeBackLabel(locale)}>
                ←
              </Link>
              <strong>{`${questionIndex + 1} / ${BREAKING_QUESTIONS.length}`}</strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <i style={{ width: `${progress}%` }} />
            </div>

            <QuestionView question={currentQuestion} locale={locale} onChoose={choose} />
          </section>
        ) : (
          <ResultView
            locale={locale}
            result={result}
            isShared={Boolean(sharedResult)}
            onRetry={retry}
          />
        )}
      </section>

      {phase === "result" && <AdResult placement="breaking-point-result" />}
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
  onRetry,
}: {
  locale: SimpleLocale;
  result: BreakingResult;
  isShared: boolean;
  onRetry: () => void;
}) {
  const shareUrl = buildShareUrl("/tests/breaking-point", {
    v: 1,
    resultId: result.id,
    locale,
  } satisfies BreakingSharePayload);
  const shareTitle = `${BREAKING_COPY.title[locale]} · ${text(locale, result.title)}`;
  const shareText = text(locale, result.oneLiner);

  return (
    <ResultScreen
      locale={locale}
      currentGameId="breaking-point"
      tone="dark"
      accentColor={result.accent}
      gameName={BREAKING_COPY.title[locale]}
      eyebrow={isShared ? (locale === "ko" ? "공유된 결과" : "Shared result") : undefined}
      title={text(locale, result.title)}
      description={shareText}
      shareTitle={shareTitle}
      shareText={shareText}
      shareUrl={shareUrl}
      onReplay={onRetry}
      replayLabel={BREAKING_COPY.retry[locale]}
      onKakaoShare={() => shareKakao(shareTitle, shareText, shareUrl)}
      kakaoLabel={locale === "ko" ? "카카오 공유" : "Share on Kakao"}
      recommendedIds={["defense-mechanism", "scene-choice", "thinking-pattern", "value-conflict"]}
      afterCard={
        <div className="breaking-detail">
          <p className="breaking-detail__desc">{text(locale, result.description)}</p>
          <div className="breaking-detail__grid">
            <DetailBlock label={BREAKING_COPY.howYouChange[locale]} body={text(locale, result.howYouChange)} />
            <DetailBlock
              label={BREAKING_COPY.sign[locale]}
              body={text(locale, result.sign)}
              accent={result.accent}
              highlight
            />
            <DetailBlock label={BREAKING_COPY.gentleNote[locale]} body={text(locale, result.gentleNote)} />
            <DetailBlock label={BREAKING_COPY.friendComment[locale]} body={text(locale, result.friendComment)} />
          </div>
        </div>
      }
    />
  );
}

function DetailBlock({
  label,
  body,
  accent,
  highlight,
}: {
  label: string;
  body: string;
  accent?: string;
  highlight?: boolean;
}) {
  return (
    <section
      className={`breaking-detail__card${highlight ? " breaking-detail__card--highlight" : ""}`}
      style={accent ? ({ "--accent": accent } as CSSProperties) : undefined}
    >
      <span>{label}</span>
      <p>{body}</p>
    </section>
  );
}

function shareKakao(title: string, desc: string, url: string) {
  const w =
    typeof window !== "undefined"
      ? (window as unknown as {
          Kakao?: {
            isInitialized?: () => boolean;
            Share?: { sendDefault: (a: unknown) => void };
          };
        })
      : undefined;
  if (w?.Kakao?.Share && w.Kakao.isInitialized?.()) {
    try {
      w.Kakao.Share.sendDefault({
        objectType: "feed",
        content: { title, description: desc, link: { webUrl: url, mobileWebUrl: url } },
      });
      return;
    } catch {
      /* fall through */
    }
  }
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & {
    share?: (d: { title: string; text: string; url: string }) => Promise<void>;
  };
  if (typeof nav.share === "function") {
    nav.share({ title, text: desc, url }).catch(() => {
      /* user cancelled */
    });
    return;
  }
  nav.clipboard?.writeText(`${title}\n${desc}\n${url}`).catch(() => {
    /* ignore */
  });
}

const styles = `
  .breaking-page {
    min-height: 100vh;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
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
    font-weight: 800;
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
    font-weight: 800;
  }
  .locale-switch button.active {
    background: #f4eadc;
    color: #211815;
  }
  .breaking-shell {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: clamp(34px, 5vh, 60px) 0 74px;
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
    border-radius: 14px;
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
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .eyebrow {
    margin: 0 0 16px;
  }
  h1,
  h2 {
    margin: 0;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  h1 {
    max-width: 720px;
    color: #fff2e2;
    font-size: clamp(2rem, 6vw, 3.5rem);
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
    font-weight: 800;
    letter-spacing: 0.04em;
  }
  .primary,
  .secondary {
    min-height: 52px;
    border-radius: 10px;
    padding: 0 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 800;
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
    margin-top: clamp(10px, 2vh, 24px);
    padding: clamp(24px, 5vw, 48px);
    border-radius: 14px;
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
  .progress-head--active {
    min-height: 38px;
  }
  .test-exit-link {
    display: inline-grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    color: rgba(244, 234, 220, 0.74);
    background: rgba(244, 234, 220, 0.08);
    border: 1px solid rgba(244, 234, 220, 0.14);
    text-decoration: none;
    font-size: 19px;
    font-weight: 800;
    line-height: 1;
  }
  .progress-head strong {
    color: rgba(244, 234, 220, 0.74);
    font-weight: 800;
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
    border-radius: 10px;
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
    font-weight: 800;
  }
  .choices strong {
    font-size: 1rem;
    line-height: 1.48;
    word-break: keep-all;
  }
  .breaking-detail {
    width: min(100%, 620px);
    margin: 28px auto 0;
    text-align: left;
  }
  .breaking-detail__desc {
    margin: 0 0 20px;
    color: rgba(244, 234, 220, 0.82);
    font-size: 1.02rem;
    line-height: 1.8;
    font-weight: 680;
    word-break: keep-all;
  }
  .breaking-detail__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .breaking-detail__card {
    border: 1px solid rgba(244, 234, 220, 0.14);
    border-radius: 14px;
    background:
      linear-gradient(135deg, rgba(244, 234, 220, 0.11), rgba(244, 234, 220, 0.045)),
      rgba(0, 0, 0, 0.16);
    padding: 18px;
  }
  .breaking-detail__card span {
    color: #d7a36f;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .breaking-detail__card p {
    margin: 9px 0 0;
    color: rgba(244, 234, 220, 0.84);
    line-height: 1.72;
    font-weight: 700;
    word-break: keep-all;
  }
  .breaking-detail__card--highlight {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), rgba(244, 234, 220, 0.045)),
      rgba(0, 0, 0, 0.18);
    border-color: color-mix(in srgb, var(--accent) 34%, transparent);
  }
  .breaking-detail__card--highlight p {
    color: #fff2e2;
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    font-size: clamp(1.04rem, 2.4vw, 1.24rem);
    font-weight: 800;
  }
  @media (max-width: 760px) {
    .intro,
    .test-card {
      border-radius: 14px;
    }
    .choices,
    .breaking-detail__grid {
      grid-template-columns: 1fr;
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
