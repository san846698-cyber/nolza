"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { AdBottom, AdMobileSticky } from "@/app/components/Ads";
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
  SCENE_COPY,
  SCENE_QUESTIONS,
  calculateSceneResult,
  getSceneResultById,
  type SceneChoice,
  type SceneResult,
  type SceneResultId,
} from "@/lib/scene-choice-test";

type Phase = "intro" | "quiz" | "result";
type SceneSharePayload = {
  v: 1;
  resultId: SceneResultId;
  locale?: SimpleLocale;
};

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

export default function SceneChoiceTestClient() {
  const { locale, setLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SceneChoice[]>([]);
  const [sharedResult, setSharedResult] = useState<SceneResult | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const payload = decodeSharePayload<SceneSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getSceneResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(SCENE_QUESTIONS.length - 1);
        setAnswers([]);
        if (payload.locale === "ko" || payload.locale === "en") setLocale(payload.locale);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
    // This restore should only inspect the URL from the initial page entry.
    // During normal completion we write a share URL with replaceState, but that
    // should not convert the freshly completed result into a shared result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = SCENE_QUESTIONS[questionIndex];
  const calculated = useMemo(() => calculateSceneResult(answers), [answers]);
  const result = sharedResult ?? calculated.result;
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / SCENE_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase === "result") trackResultView("scene-choice", result.id);
  }, [phase, result.id]);

  const start = useCallback(() => {
    trackTestStart("scene-choice", "The Scene You Notice First");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareCopied(false);
    if (window.location.search) window.history.replaceState(null, "", "/tests/scene-choice");
  }, []);

  const retry = useCallback(() => {
    trackRetryClick("scene-choice", "test");
    start();
  }, [start]);

  const choose = useCallback((choice: SceneChoice) => {
    trackQuestionAnswered("scene-choice", questionIndex + 1);
    const nextAnswers = [...answers, choice];
    setAnswers(nextAnswers);
    setShareCopied(false);

    if (questionIndex >= SCENE_QUESTIONS.length - 1) {
      const nextResult = calculateSceneResult(nextAnswers).result;
      const url = buildShareUrl("/tests/scene-choice", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies SceneSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }

    setQuestionIndex((value) => value + 1);
  }, [answers, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("scene-choice", "test", result.id);
    const url = buildShareUrl("/tests/scene-choice", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies SceneSharePayload);
    const shareText = result.shareText[locale];
    const title = SCENE_COPY.title[locale];

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
    <main className="scene-page" lang={locale}>
      <header className="scene-topbar">
        <Link href="/" className="home-link">nolza.fun</Link>
      </header>

      <section className="scene-shell">
        {phase === "intro" ? (
          <section className="intro">
            <p className="eyebrow">{SCENE_COPY.badge[locale]}</p>
            <h1>{SCENE_COPY.title[locale]}</h1>
            <p className="subtitle">{SCENE_COPY.subtitle[locale]}</p>
            <p className="description">{SCENE_COPY.description[locale]}</p>
            <div className="intro-chips" aria-label={locale === "ko" ? "테스트 정보" : "Test info"}>
              <span>{locale === "ko" ? "12장면" : "12 scenes"}</span>
              <span>{locale === "ko" ? "약 4분" : "About 4 min"}</span>
              <span>{locale === "ko" ? "장면 선택" : "Scene choice"}</span>
            </div>
            <button type="button" className="primary" onClick={start}>
              {SCENE_COPY.start[locale]}
            </button>
            <p className="meta-line">{SCENE_COPY.meta[locale]}</p>
            <p className="disclaimer">{SCENE_COPY.disclaimer[locale]}</p>
          </section>
        ) : (
          <section className="scene-card" style={{ "--accent": result.accent } as CSSProperties}>
            <div className="progress-head">
              <span>{phase === "result" ? SCENE_COPY.resultLabel[locale] : SCENE_COPY.questionCount[locale]}</span>
              <strong>
                {phase === "result"
                  ? `${SCENE_QUESTIONS.length}/${SCENE_QUESTIONS.length}`
                  : `${questionIndex + 1}/${SCENE_QUESTIONS.length}`}
              </strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <i style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <QuestionView
                locale={locale}
                question={currentQuestion}
                onChoose={choose}
              />
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
        <RecommendedGames
          currentId="scene-choice"
          ids={["defense-mechanism", "thinking-pattern", "value-conflict"]}
          title={SCENE_COPY.related}
        />
      )}

      <AdBottom />
      <AdMobileSticky />
      <style jsx>{styles}</style>
    </main>
  );
}

function QuestionView({
  locale,
  question,
  onChoose,
}: {
  locale: SimpleLocale;
  question: (typeof SCENE_QUESTIONS)[number];
  onChoose: (choice: SceneChoice) => void;
}) {
  return (
    <div className="question-view">
      <ReadableQuestion
        situation={text(locale, question.scene)}
        prompt={text(locale, question.prompt)}
        locale={locale}
        situationLabel={text(locale, question.title)}
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
  result: SceneResult;
  isShared: boolean;
  onShare: () => void;
  onRetry: () => void;
  shareCopied: boolean;
}) {
  return (
    <article className="result-view">
      {isShared && (
        <p className="shared-label">{locale === "ko" ? "공유된 결과" : "Shared result"}</p>
      )}
      <div className="result-title">
        <span>{locale === "ko" ? result.title.en : result.title.ko}</span>
        <h2>{text(locale, result.title)}</h2>
        <p>{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>

      <div className="result-sections">
        <section>
          <span>{SCENE_COPY.noticesFirst[locale]}</span>
          <p>{text(locale, result.noticesFirst)}</p>
        </section>
        <section>
          <span>{SCENE_COPY.reveals[locale]}</span>
          <p>{text(locale, result.reveals)}</p>
        </section>
        <section>
          <span>{SCENE_COPY.strength[locale]}</span>
          <p>{text(locale, result.strength)}</p>
        </section>
        <section>
          <span>{SCENE_COPY.watchOut[locale]}</span>
          <p>{text(locale, result.watchOut)}</p>
        </section>
      </div>

      <section className="friend-question">
        <span>{SCENE_COPY.friendQuestion[locale]}</span>
        <p>“{text(locale, result.friendQuestion)}”</p>
      </section>

      <div className="actions">
        <button type="button" className="primary" onClick={onShare}>
          {shareCopied ? SCENE_COPY.copied[locale] : SCENE_COPY.share[locale]}
        </button>
        <button type="button" className="secondary" onClick={onRetry}>
          {SCENE_COPY.retry[locale]}
        </button>
      </div>
    </article>
  );
}

const styles = `
  .scene-page {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    color: #f7ead4;
    background:
      linear-gradient(180deg, rgba(247, 234, 212, 0.04), transparent 36%),
      linear-gradient(150deg, #171512 0%, #242018 52%, #3d3024 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
  }
  .scene-topbar {
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
    color: #f7ead4;
    text-decoration: none;
    font-weight: 950;
    letter-spacing: 0.04em;
  }
  .locale-switch {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    background: rgba(247, 234, 212, 0.08);
    border: 1px solid rgba(247, 234, 212, 0.14);
  }
  .locale-switch button {
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(247, 234, 212, 0.68);
    cursor: pointer;
    padding: 8px 12px;
    font-weight: 900;
  }
  .locale-switch button.active {
    background: #f7ead4;
    color: #221a13;
  }
  .scene-shell {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: 26px 0 74px;
    position: relative;
    z-index: 1;
  }
  .intro,
  .scene-card {
    border: 1px solid rgba(247, 234, 212, 0.16);
    box-shadow: 0 34px 100px rgba(0, 0, 0, 0.28);
  }
  .intro {
    width: min(100%, 780px);
    min-height: min(650px, calc(100vh - 140px));
    display: grid;
    align-content: center;
    justify-items: start;
    overflow: hidden;
    position: relative;
    margin: clamp(16px, 5vh, 54px) auto 0;
    padding: clamp(32px, 6vw, 64px);
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(247, 234, 212, 0.105), rgba(247, 234, 212, 0.045)),
      rgba(18, 14, 11, 0.62);
  }
  .eyebrow,
  .scene-label,
  .progress-head span,
  .result-title span,
  .result-sections span,
  .friend-question span,
  .shared-label {
    color: #ddb878;
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
    color: #fff3df;
    font-size: clamp(2.35rem, 6.4vw, 5.35rem);
    line-height: 1.06;
    word-break: keep-all;
  }
  .subtitle {
    max-width: 700px;
    margin: 22px 0 0;
    color: #ddb878;
    font-size: clamp(1.12rem, 2.6vw, 1.45rem);
    font-weight: 850;
    line-height: 1.55;
    word-break: keep-all;
  }
  .description,
  .disclaimer,
  .meta-line {
    max-width: 690px;
    line-height: 1.72;
    word-break: keep-all;
  }
  .description {
    margin: 14px 0 28px;
    color: rgba(247, 234, 212, 0.78);
    font-size: 1.02rem;
    font-weight: 650;
  }
  .disclaimer {
    margin: 10px 0 0;
    color: rgba(247, 234, 212, 0.52);
    font-size: 0.9rem;
    font-weight: 650;
  }
  .meta-line {
    margin: 13px 0 0;
    color: rgba(221, 184, 120, 0.78);
    font-size: 0.86rem;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .primary,
  .secondary {
    min-height: 52px;
    border: 0;
    border-radius: 999px;
    padding: 0 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 950;
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }
  .primary {
    color: #21170f;
    background: linear-gradient(135deg, #f5d49b, #c98b43);
    box-shadow: 0 18px 40px rgba(201, 139, 67, 0.28);
  }
  .secondary {
    color: #f7ead4;
    background: rgba(247, 234, 212, 0.08);
    border: 1px solid rgba(247, 234, 212, 0.22);
  }
  .primary:hover,
  .secondary:hover,
  .choices button:hover {
    transform: translateY(-2px);
  }
  .scene-card {
    padding: clamp(24px, 5vw, 48px);
    border-radius: 32px;
    background:
      radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 28rem),
      linear-gradient(145deg, rgba(247, 234, 212, 0.12), rgba(255, 255, 255, 0.045)),
      rgba(22, 18, 14, 0.7);
    backdrop-filter: blur(18px);
  }
  .progress-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .progress-head strong {
    color: rgba(247, 234, 212, 0.72);
    font-weight: 950;
  }
  .progress-bar {
    height: 8px;
    overflow: hidden;
    margin-top: 12px;
    border-radius: 999px;
    background: rgba(247, 234, 212, 0.12);
  }
  .progress-bar i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #f5d49b, var(--accent));
    transition: width 220ms ease;
  }
  .question-view {
    padding-top: 34px;
  }
  .scene-label {
    display: inline-flex;
    margin-bottom: 14px;
  }
  .scene-text {
    max-width: 760px;
    margin: 0;
    color: rgba(247, 234, 212, 0.86);
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    font-size: clamp(1.25rem, 3vw, 2rem);
    line-height: 1.62;
    word-break: keep-all;
  }
  .question-view h2 {
    margin: 26px 0 18px;
    color: #ddb878;
    font-size: clamp(1.28rem, 3vw, 2rem);
    line-height: 1.35;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .choices button {
    min-height: 82px;
    display: grid;
    grid-template-columns: 34px 1fr;
    align-items: center;
    gap: 12px;
    border: 1px solid rgba(247, 234, 212, 0.16);
    border-radius: 20px;
    background:
      linear-gradient(135deg, rgba(247, 234, 212, 0.105), rgba(247, 234, 212, 0.04)),
      rgba(0, 0, 0, 0.16);
    color: #f7ead4;
    cursor: pointer;
    padding: 16px;
    text-align: left;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }
  .choices button:hover {
    border-color: color-mix(in srgb, var(--accent) 62%, #f7ead4);
    background: rgba(247, 234, 212, 0.13);
  }
  .choices span {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(247, 234, 212, 0.14);
    color: #f5d49b;
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
    gap: 22px;
    padding-top: 30px;
  }
  .shared-label {
    width: max-content;
    margin: 0;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(247, 234, 212, 0.09);
    border: 1px solid rgba(247, 234, 212, 0.16);
  }
  .result-title {
    display: grid;
    gap: 10px;
  }
  .result-title h2 {
    color: #fff3df;
    font-size: clamp(2.35rem, 7vw, 5.3rem);
    line-height: 1.04;
    word-break: keep-all;
  }
  .result-title p {
    margin: 0;
    color: #ddb878;
    font-size: clamp(1.08rem, 2.4vw, 1.35rem);
    font-weight: 950;
    line-height: 1.48;
    word-break: keep-all;
  }
  .result-description {
    max-width: 820px;
    margin: 0;
    color: rgba(247, 234, 212, 0.84);
    font-size: 1.06rem;
    line-height: 1.82;
    font-weight: 690;
    word-break: keep-all;
  }
  .result-sections {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .result-sections section,
  .friend-question {
    padding: 17px;
    border-radius: 20px;
    border: 1px solid rgba(247, 234, 212, 0.12);
    background: rgba(0, 0, 0, 0.18);
  }
  .result-sections p,
  .friend-question p {
    margin: 9px 0 0;
    color: rgba(247, 234, 212, 0.82);
    line-height: 1.7;
    font-weight: 690;
    word-break: keep-all;
  }
  .friend-question {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent), rgba(247, 234, 212, 0.045)),
      rgba(0, 0, 0, 0.18);
    border-color: color-mix(in srgb, var(--accent) 36%, transparent);
  }
  .friend-question p {
    color: #fff3df;
    font-size: clamp(1.05rem, 2.4vw, 1.25rem);
    font-weight: 950;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  @media (max-width: 760px) {
    .scene-shell,
    .scene-topbar {
      width: min(100% - 28px, 1040px);
    }
    .intro,
    .scene-card {
      border-radius: 24px;
    }
    .intro {
      min-height: auto;
      padding-top: 28px;
    }
    .choices,
    .result-sections {
      grid-template-columns: 1fr;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
    }
    .primary,
    .secondary {
      width: 100%;
    }
  }
`;
