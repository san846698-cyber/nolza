"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AdBottom } from "@/app/components/Ads";
import { usePersistentTestSession } from "@/hooks/usePersistentTestSession";
import {
  trackQuestionAnswered,
  trackResultView,
  trackRetryClick,
  trackShareClick,
  trackTestStart,
} from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  DEFENSE_COPY,
  DEFENSE_QUESTIONS,
  calculateDefenseResult,
  type DefenseAnswer,
  type DefenseLocale,
  type DefenseMechanismId,
  type DefenseResult,
} from "@/lib/defense-mechanism-test";

type Phase = "intro" | "quiz" | "loading" | "result";
type DefenseSession = {
  phase: Phase;
  questionIndex: number;
  answers: DefenseAnswer[];
};
type DefenseSharePayload = {
  v: 1;
  answers: string[];
  locale?: DefenseLocale;
};

const STORAGE_KEY = "nolza_locale";
const SESSION_KEY = "nolza:test:defense-mechanism:v1";
const LOCALE_CHANGE_EVENT = "nolza:locale-change";
const INITIAL_SESSION: DefenseSession = {
  phase: "intro",
  questionIndex: 0,
  answers: [],
};

const relatedTests = [
  {
    href: "/games/attachment",
    title: { ko: "애착 유형 테스트", en: "Attachment Style" },
    sub: { ko: "나는 왜 이렇게 사랑할까", en: "Why do I love this way?" },
  },
  {
    href: "/games/dilemma",
    title: { ko: "도덕 딜레마", en: "Moral Dilemma" },
    sub: { ko: "내 선택의 기준 보기", en: "See what guides your choices" },
  },
];

const resultKeyLabels: Record<DefenseMechanismId, Record<DefenseLocale, string>> = {
  humor: { ko: "유머화", en: "Humor" },
  rationalization: { ko: "합리화", en: "Rationalization" },
  avoidance: { ko: "회피", en: "Avoidance" },
  intellectualization: { ko: "지성화", en: "Intellectualization" },
  sublimation: { ko: "승화", en: "Sublimation" },
  suppression: { ko: "억압", en: "Suppression" },
  projection: { ko: "투사", en: "Projection" },
  reactionFormation: { ko: "반동형성", en: "Reaction Formation" },
};

function normalizeLocale(value: unknown): DefenseLocale | null {
  return value === "ko" || value === "en" ? value : null;
}

function initialLocale(): DefenseLocale {
  if (typeof window === "undefined") return "ko";
  try {
    const stored = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Keep Korean as the site default when storage is unavailable.
  }
  const language = navigator.language?.slice(0, 2).toLowerCase();
  return language === "en" ? "en" : "ko";
}

function publishLocale(locale: DefenseLocale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore private browsing storage failures.
  }
  try {
    window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }));
  } catch {
    // Page-local language still works in older browsers.
  }
}

function isDefenseSession(value: unknown): value is DefenseSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<DefenseSession>;
  const validPhase =
    session.phase === "intro" ||
    session.phase === "quiz" ||
    session.phase === "loading" ||
    session.phase === "result";
  const questionIndex = session.questionIndex;
  return (
    validPhase &&
    Number.isInteger(questionIndex) &&
    typeof questionIndex === "number" &&
    questionIndex >= 0 &&
    questionIndex < DEFENSE_QUESTIONS.length &&
    Array.isArray(session.answers)
  );
}

export default function DefenseMechanismTestClient() {
  const [locale, setLocaleState] = useState<DefenseLocale>("ko");
  const [session, setSession, resetSession] = usePersistentTestSession(
    SESSION_KEY,
    INITIAL_SESSION,
    { validate: isDefenseSession },
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [isSharedResult, setIsSharedResult] = useState(false);
  const answerPendingRef = useRef(false);
  const answerTimerRef = useRef<number | null>(null);
  const { phase, questionIndex, answers } = session;

  useEffect(() => {
    // Keep the first server render Korean-first, then sync with the saved site locale.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(initialLocale());

    const onCustom = (event: Event) => {
      const next = normalizeLocale((event as CustomEvent).detail);
      if (next) setLocaleState(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = normalizeLocale(event.newValue);
      if (next) setLocaleState(next);
    };

    window.addEventListener(LOCALE_CHANGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LOCALE_CHANGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const payload = decodeSharePayload<DefenseSharePayload>(params.get("s"));
    if (!payload || payload.v !== 1 || !Array.isArray(payload.answers)) return;
    const restoredAnswers: DefenseAnswer[] = [];
    DEFENSE_QUESTIONS.forEach((question, index) => {
      const id = payload.answers[index];
      const answer = question.answers.find((item) => item.id === id);
      if (answer) restoredAnswers.push(answer);
    });
    if (restoredAnswers.length !== DEFENSE_QUESTIONS.length) return;
    const restoreId = window.setTimeout(() => {
      setSelectedId(null);
      answerPendingRef.current = false;
      resetSession({
        phase: "result",
        questionIndex: DEFENSE_QUESTIONS.length - 1,
        answers: restoredAnswers,
      });
      setIsSharedResult(true);
    }, 0);
    return () => window.clearTimeout(restoreId);
  }, [resetSession]);

  const setLocale = (next: DefenseLocale) => {
    setLocaleState(next);
    publishLocale(next);
  };

  const currentQuestion = DEFENSE_QUESTIONS[questionIndex];
  const calculated = useMemo(() => calculateDefenseResult(answers), [answers]);

  useEffect(() => {
    return () => {
      if (answerTimerRef.current !== null) {
        window.clearTimeout(answerTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => {
      setSession((current) =>
        current.phase === "loading" ? { ...current, phase: "result" } : current,
      );
    }, 850);
    return () => window.clearTimeout(timer);
  }, [phase, setSession]);

  useEffect(() => {
    if (phase === "result") {
      trackResultView("defense-mechanism", calculated.result.id);
    }
  }, [calculated.result.id, phase]);

  const start = () => {
    trackTestStart("defense-mechanism", "Defense Mechanism Test");
    if (answerTimerRef.current !== null) window.clearTimeout(answerTimerRef.current);
    answerTimerRef.current = null;
    setSelectedId(null);
    answerPendingRef.current = false;
    setShareCopied(false);
    setIsSharedResult(false);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/tests/defense-mechanism");
    }
    resetSession({ phase: "quiz", questionIndex: 0, answers: [] });
  };

  const retry = () => {
    trackRetryClick("defense-mechanism", "test");
    if (answerTimerRef.current !== null) window.clearTimeout(answerTimerRef.current);
    answerTimerRef.current = null;
    setSelectedId(null);
    answerPendingRef.current = false;
    setShareCopied(false);
    setIsSharedResult(false);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/tests/defense-mechanism");
    }
    resetSession(INITIAL_SESSION);
  };

  const chooseAnswer = (answer: DefenseAnswer) => {
    if (selectedId || answerPendingRef.current) return;
    trackQuestionAnswered("defense-mechanism", questionIndex + 1);
    answerPendingRef.current = true;
    setSelectedId(answer.id);
    answerTimerRef.current = window.setTimeout(() => {
      setSession((current) => {
        if (current.phase !== "quiz") return current;
        const nextAnswers = [...current.answers, answer];
        if (current.questionIndex >= DEFENSE_QUESTIONS.length - 1) {
          return { ...current, answers: nextAnswers, phase: "loading" };
        }
        return {
          ...current,
          answers: nextAnswers,
          questionIndex: current.questionIndex + 1,
        };
      });
      setSelectedId(null);
      answerPendingRef.current = false;
      answerTimerRef.current = null;
    }, 210);
  };

  const shareResult = async () => {
    const result = calculated.result;
    trackShareClick("defense-mechanism", "test", result.id);
    const url = buildShareUrl("/tests/defense-mechanism", {
      v: 1,
      answers: answers.map((answer) => answer.id),
      locale,
    });
    const text = `${result.shareLine[locale]}\n${result.name[locale]} · ${result.oneLiner[locale]}\n${url}`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: DEFENSE_COPY.title[locale],
          text,
          url,
        });
        return;
      } catch {
        // User-cancelled share sheets should fall back quietly.
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareCopied(false);
    }
  };

  return (
    <main className="defense-page" lang={locale}>
      <header className="defense-topbar">
        <Link href="/" className="home-link">
          nolza.fun
        </Link>
        <div className="locale-switch" aria-label={DEFENSE_COPY.languageLabel[locale]}>
          {(["ko", "en"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={locale === item ? "active" : ""}
              onClick={() => setLocale(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {phase === "intro" && <Intro locale={locale} onStart={start} />}
      {phase === "quiz" && currentQuestion && (
        <Quiz
          locale={locale}
          questionIndex={questionIndex}
          question={currentQuestion}
          selectedId={selectedId}
          onChoose={chooseAnswer}
        />
      )}
      {phase === "loading" && <Loading locale={locale} />}
      {phase === "result" && (
        <Result
          locale={locale}
          result={calculated.result}
          scores={calculated.scores}
          onRetry={retry}
          onShare={shareResult}
          shareCopied={shareCopied}
          isSharedResult={isSharedResult}
        />
      )}

      <AdBottom />
      <style jsx>{styles}</style>
    </main>
  );
}

function Intro({ locale, onStart }: { locale: DefenseLocale; onStart: () => void }) {
  return (
    <section className="hero">
      <div className="hero-content">
      <div className="kicker">
        <span>{DEFENSE_COPY.badge[locale]}</span>
        <i />
        <span>DEFENSE MECHANISM</span>
      </div>
      <h1>{DEFENSE_COPY.title[locale]}</h1>
      <p>{DEFENSE_COPY.subtitle[locale]}</p>
      <p className="supporting-line">
        {locale === "ko"
          ? "마음이 스스로를 지키는 방식을 조용히 들여다보는 시간"
          : "A quiet look at the ways your mind tries to keep you safe."}
      </p>

      <button type="button" className="primary" onClick={onStart}>
        {DEFENSE_COPY.start[locale]}
      </button>
      <small className="meta-line">
        {locale === "ko" ? "16문항 · 약 4분" : "16 questions · about 4 min"}
      </small>
      <small className="disclaimer">{DEFENSE_COPY.disclaimer[locale]}</small>
      </div>
    </section>
  );
}

function Quiz({
  locale,
  questionIndex,
  question,
  selectedId,
  onChoose,
}: {
  locale: DefenseLocale;
  questionIndex: number;
  question: (typeof DEFENSE_QUESTIONS)[number];
  selectedId: string | null;
  onChoose: (answer: DefenseAnswer) => void;
}) {
  const progress = ((questionIndex + 1) / DEFENSE_QUESTIONS.length) * 100;

  return (
    <section className="quiz">
      <div className="progress">
        <div>
          <span>{DEFENSE_COPY.questionCount[locale]}</span>
          <strong>
            {questionIndex + 1}/{DEFENSE_QUESTIONS.length}
          </strong>
        </div>
        <i style={{ width: `${progress}%` }} />
      </div>

      <article className="question-card">
        <span className="scene-label">{locale === "ko" ? "상황" : "Scene"}</span>
        <p className="scene">{question.scene[locale]}</p>
        <h2>{question.question[locale]}</h2>
        <div className="answers">
          {question.answers.map((answer, index) => (
            <button
              key={answer.id}
              type="button"
              className={selectedId === answer.id ? "selected" : ""}
              onClick={() => onChoose(answer)}
              disabled={Boolean(selectedId)}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{answer.text[locale]}</strong>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function Loading({ locale }: { locale: DefenseLocale }) {
  return (
    <section className="loading-screen" aria-live="polite">
      <div className="loading-card">
        <div className="breathing-dot" aria-hidden />
        <p>{DEFENSE_COPY.resultLoading[locale]}</p>
      </div>
    </section>
  );
}

function Result({
  locale,
  result,
  scores,
  onRetry,
  onShare,
  shareCopied,
  isSharedResult,
}: {
  locale: DefenseLocale;
  result: DefenseResult;
  scores: Record<DefenseMechanismId, number>;
  onRetry: () => void;
  onShare: () => void;
  shareCopied: boolean;
  isSharedResult: boolean;
}) {
  const secondaryName = locale === "ko" ? result.name.en : result.name.ko;
  const maxScore = Math.max(...Object.values(scores), 1);

  return (
    <section className="result-wrap" style={{ "--accent": result.accent } as CSSProperties}>
      <article className="result-card">
        <div className="result-top">
          <span>
            {isSharedResult
              ? locale === "ko"
                ? "공유된 결과"
                : "Shared Result"
              : DEFENSE_COPY.resultLabel[locale]}
          </span>
          <strong>{secondaryName}</strong>
        </div>
        <h2>{result.name[locale]}</h2>
        <p className="one-liner">{result.oneLiner[locale]}</p>
        <p className="description">{result.description[locale]}</p>

        <div className="insight-grid">
          <section>
            <span>{DEFENSE_COPY.strength[locale]}</span>
            <p>{result.strength[locale]}</p>
          </section>
          <section>
            <span>{DEFENSE_COPY.weakPoint[locale]}</span>
            <p>{result.weakPoint[locale]}</p>
          </section>
          <section>
            <span>{DEFENSE_COPY.whenHelps[locale]}</span>
            <p>{result.whenHelps[locale]}</p>
          </section>
          <section>
            <span>{DEFENSE_COPY.carefulWhen[locale]}</span>
            <p>{result.carefulWhen[locale]}</p>
          </section>
        </div>

        <section className="deep-insights">
          <h3>{DEFENSE_COPY.deeperTitle[locale]}</h3>
          <div className="deep-stack">
            <section className="deep-section">
              <span>{DEFENSE_COPY.innerProcess[locale]}</span>
              <p>{result.innerProcess[locale]}</p>
            </section>
            <section className="deep-section">
              <span>{DEFENSE_COPY.outwardLook[locale]}</span>
              <p>{result.outwardLook[locale]}</p>
            </section>
            <blockquote className="inner-quote">
              <span>{DEFENSE_COPY.innerQuote[locale]}</span>
              <p>{result.innerQuote[locale]}</p>
            </blockquote>
            <section className="deep-section">
              <span>{DEFENSE_COPY.protectiveReason[locale]}</span>
              <p>{result.protectiveReason[locale]}</p>
            </section>
            <section className="deep-section">
              <span>{DEFENSE_COPY.repeatedPattern[locale]}</span>
              <p>{result.repeatedPattern[locale]}</p>
            </section>
            <section className="deep-section practice-card">
              <span>{DEFENSE_COPY.gentlePractice[locale]}</span>
              <p>{result.gentlePractice[locale]}</p>
            </section>
          </div>
        </section>

        <section className="score-section">
          <h3>{DEFENSE_COPY.scoreTitle[locale]}</h3>
          <div className="score-list">
            {(Object.entries(scores) as Array<[DefenseMechanismId, number]>).map(([key, value]) => (
              <div key={key}>
                <span>{resultKeyLabels[key][locale]}</span>
                <i style={{ width: `${Math.max(6, (value / maxScore) * 100)}%` }} />
              </div>
            ))}
          </div>
        </section>

        <footer>nolza.fun · Defense Mechanism Test · Entertainment only</footer>
      </article>

      <div className="actions" data-share-card-skip="true">
        <button type="button" className="share" onClick={onShare}>
          {shareCopied ? DEFENSE_COPY.copied[locale] : DEFENSE_COPY.share[locale]}
        </button>
        <button type="button" onClick={onRetry}>
          {isSharedResult
            ? locale === "ko"
              ? "나도 해보기"
              : "Try it myself"
            : DEFENSE_COPY.retry[locale]}
        </button>
      </div>

      <nav className="related" aria-label={DEFENSE_COPY.related[locale]}>
        <h2>{DEFENSE_COPY.related[locale]}</h2>
        <div>
          {relatedTests.map((item) => (
            <Link key={item.href} href={item.href}>
              <strong>{item.title[locale]}</strong>
              <span>{item.sub[locale]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}

const styles = `
  .defense-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    color: #f8efe2;
    background:
      radial-gradient(circle at 50% 22%, rgba(255, 175, 117, 0.16), transparent 31%),
      radial-gradient(circle at 12% 8%, rgba(242, 200, 121, 0.12), transparent 32%),
      linear-gradient(145deg, #101820 0%, #171714 48%, #0b111a 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
  }
  .defense-topbar {
    width: min(1080px, calc(100% - 32px));
    margin: 0 auto;
    padding: 18px 0 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: relative;
    z-index: 2;
  }
  .home-link {
    color: #f8efe2;
    text-decoration: none;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .locale-switch {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    background: rgba(248, 239, 226, 0.08);
    border: 1px solid rgba(248, 239, 226, 0.12);
  }
  .locale-switch button {
    min-height: 38px;
    min-width: 54px;
    padding: 0 13px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(248, 239, 226, 0.68);
    font-weight: 850;
    cursor: pointer;
  }
  .locale-switch button.active {
    color: #17130f;
    background: #f8efe2;
  }
  .hero,
  .loading-screen,
  .result-wrap {
    width: min(1080px, calc(100% - 32px));
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .quiz {
    width: min(860px, calc(100% - 32px));
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .hero {
    min-height: calc(100vh - 74px);
    display: grid;
    place-items: center;
    padding: 26px 0 64px;
    overflow: hidden;
    text-align: center;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    width: min(760px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: heroReveal 680ms cubic-bezier(0.2, 0.82, 0.28, 1) both;
  }
  .kicker {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    color: #ffd995;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .kicker i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(248, 239, 226, 0.46);
  }
  h1 {
    max-width: 780px;
    margin: 18px auto 14px;
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    font-size: clamp(2.45rem, 8.4vw, 5.4rem);
    line-height: 1.06;
    letter-spacing: 0;
  }
  .hero-content > p {
    max-width: 690px;
    margin: 0 auto;
    color: rgba(248, 239, 226, 0.8);
    font-size: clamp(1.04rem, 2.4vw, 1.22rem);
    line-height: 1.75;
    font-weight: 700;
    word-break: keep-all;
  }
  .hero-content .supporting-line {
    max-width: 560px;
    margin-top: 12px;
    color: rgba(248, 239, 226, 0.58);
    font-size: clamp(0.96rem, 1.8vw, 1.06rem);
    line-height: 1.7;
    font-weight: 650;
  }
  .hero .journal-preview {
    display: none;
  }
  .journal-preview {
    width: min(100%, 720px);
    margin: 26px 0 22px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .journal-card {
    min-height: 132px;
    padding: 18px;
    border-radius: 22px;
    border: 1px solid rgba(248, 239, 226, 0.14);
    background: linear-gradient(145deg, rgba(248, 239, 226, 0.1), rgba(248, 239, 226, 0.055));
    backdrop-filter: blur(14px);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.18);
  }
  .journal-card span {
    color: #f2c879;
    font-size: 0.82rem;
    font-weight: 950;
  }
  .journal-card strong {
    display: block;
    margin-top: 13px;
    font-family: var(--font-noto-serif-kr), serif;
    font-size: 1.34rem;
    line-height: 1.2;
  }
  .journal-card p {
    margin: 9px 0 0;
    color: rgba(248, 239, 226, 0.62);
    line-height: 1.55;
    font-weight: 700;
  }
  .card-two {
    background: rgba(168, 184, 232, 0.11);
  }
  .primary,
  .actions button {
    min-height: 52px;
    border: 0;
    border-radius: 999px;
    padding: 0 22px;
    font-weight: 950;
    cursor: pointer;
    color: #17130f;
    background: linear-gradient(135deg, #f2c879, #a8b8e8);
    box-shadow: 0 16px 36px rgba(242, 200, 121, 0.2);
    transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
  }
  .primary:hover,
  .actions button:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(242, 200, 121, 0.24);
  }
  .primary:focus-visible,
  .actions button:focus-visible {
    outline: 3px solid rgba(242, 200, 121, 0.36);
    outline-offset: 3px;
  }
  .hero .primary {
    width: min(100%, 244px);
    min-height: 62px;
    padding: 0 34px;
    margin-top: 30px;
    border-radius: 999px;
    font-size: 1.02rem;
    background: linear-gradient(135deg, #ffe5ab 0%, #f2c879 42%, #ff9876 100%);
    box-shadow:
      0 18px 44px rgba(255, 159, 121, 0.28),
      0 0 0 1px rgba(255, 255, 255, 0.18) inset;
    transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
  }
  .hero .primary:hover,
  .hero .primary:focus-visible {
    transform: translateY(-2px);
    box-shadow:
      0 22px 54px rgba(255, 159, 121, 0.36),
      0 0 0 2px rgba(255, 255, 255, 0.22) inset;
    outline: none;
  }
  .hero .primary:active {
    transform: translateY(0) scale(0.99);
    filter: saturate(0.96);
  }
  .disclaimer {
    margin-top: 18px;
    max-width: 590px;
    color: rgba(248, 239, 226, 0.48);
    font-weight: 750;
    line-height: 1.55;
    text-align: center;
    word-break: keep-all;
  }
  .meta-line {
    display: block;
    margin-top: 12px;
    color: rgba(255, 217, 149, 0.76);
    font-size: 0.86rem;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .hero-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .quiz {
    padding: 24px 0 68px;
  }
  .progress {
    margin: 12px 0 14px;
  }
  .progress div {
    display: flex;
    justify-content: space-between;
    color: rgba(248, 239, 226, 0.78);
    font-weight: 900;
  }
  .progress span {
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .progress > i {
    display: block;
    height: 7px;
    margin-top: 9px;
    border-radius: 999px;
    background: linear-gradient(90deg, #f2c879, #a8b8e8, #9ed7c5);
    transition: width 260ms ease;
  }
  .question-card,
  .loading-card,
  .result-card,
  .related {
    border: 1px solid rgba(248, 239, 226, 0.13);
    background: rgba(248, 239, 226, 0.08);
    border-radius: 30px;
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(18px);
  }
  .question-card {
    padding: clamp(20px, 3.2vw, 30px);
    border-radius: 26px;
    background:
      linear-gradient(145deg, rgba(248, 239, 226, 0.105), rgba(12, 17, 28, 0.24)),
      rgba(248, 239, 226, 0.045);
  }
  .scene-label,
  .result-top span,
  .insight-grid span,
  .deep-section span,
  .inner-quote span,
  .score-list span {
    color: rgba(248, 239, 226, 0.6);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .scene {
    margin: 9px 0 13px;
    max-width: 700px;
    color: rgba(248, 239, 226, 0.84);
    font-size: clamp(0.98rem, 2vw, 1.08rem);
    line-height: 1.66;
    font-weight: 760;
    word-break: keep-all;
  }
  .question-card h2 {
    margin: 0 0 20px;
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    font-size: clamp(1.42rem, 3.4vw, 2.12rem);
    line-height: 1.32;
    letter-spacing: 0;
    word-break: keep-all;
  }
  .answers {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .answers button {
    min-height: 88px;
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: center;
    gap: 11px;
    border: 1px solid rgba(248, 239, 226, 0.15);
    border-radius: 18px;
    background: rgba(12, 17, 28, 0.28);
    color: #f8efe2;
    text-align: left;
    padding: 14px 15px;
    cursor: pointer;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
  }
  .answers button:not(:disabled):hover,
  .answers button.selected {
    transform: translateY(-2px);
    border-color: rgba(242, 200, 121, 0.58);
    background: rgba(242, 200, 121, 0.12);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
  }
  .answers button:disabled {
    cursor: default;
  }
  .answers button span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: rgba(248, 239, 226, 0.1);
    color: #f2c879;
    font-size: 0.78rem;
    font-weight: 950;
  }
  .answers strong {
    display: block;
    font-size: 0.96rem;
    line-height: 1.48;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .loading-screen {
    min-height: calc(100vh - 120px);
    display: grid;
    place-items: center;
    padding: 50px 0 90px;
  }
  .loading-card {
    width: min(100%, 520px);
    display: grid;
    place-items: center;
    gap: 18px;
    padding: 44px 24px;
    text-align: center;
  }
  .breathing-dot {
    width: 64px;
    height: 64px;
    border-radius: 999px;
    background: radial-gradient(circle, #f2c879 0%, #a8b8e8 72%);
    animation: breathe 1.3s infinite ease-in-out;
  }
  .loading-card p {
    margin: 0;
    color: rgba(248, 239, 226, 0.78);
    font-size: 1.08rem;
    font-weight: 850;
  }
  .result-wrap {
    padding: 34px 0 84px;
  }
  .result-card {
    position: relative;
    overflow: hidden;
    padding: clamp(23px, 5vw, 44px);
  }
  .result-card:before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 82% 8%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 34%),
      linear-gradient(135deg, rgba(248,239,226,0.03), transparent);
    pointer-events: none;
  }
  .result-card > * {
    position: relative;
  }
  .result-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .result-top strong {
    color: var(--accent);
    font-size: 0.96rem;
    font-weight: 950;
  }
  .result-card h2 {
    margin: 20px 0 8px;
    font-family: var(--font-noto-serif-kr), var(--font-fraunces), serif;
    font-size: clamp(2.35rem, 9vw, 5rem);
    line-height: 1.02;
    letter-spacing: 0;
  }
  .one-liner {
    margin: 0;
    color: var(--accent);
    font-size: clamp(1.04rem, 2.4vw, 1.22rem);
    font-weight: 900;
    line-height: 1.5;
  }
  .description {
    max-width: 780px;
    margin: 18px 0 0;
    color: rgba(248, 239, 226, 0.8);
    line-height: 1.78;
    font-weight: 740;
    word-break: keep-all;
  }
  .insight-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 22px;
  }
  .insight-grid section {
    padding: 16px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(248, 239, 226, 0.1);
  }
  .insight-grid p {
    margin: 9px 0 0;
    color: rgba(248, 239, 226, 0.8);
    line-height: 1.68;
    font-weight: 710;
    word-break: keep-all;
  }
  .deep-insights {
    margin-top: 26px;
  }
  .deep-insights h3,
  .score-section h3 {
    margin: 0 0 14px;
    color: #f8efe2;
    font-size: 1.02rem;
    line-height: 1.35;
    font-weight: 950;
    letter-spacing: 0;
  }
  .deep-stack {
    display: grid;
    gap: 12px;
  }
  .deep-section,
  .inner-quote {
    margin: 0;
    padding: 17px 18px;
    border-radius: 20px;
    background: rgba(12, 17, 28, 0.24);
    border: 1px solid rgba(248, 239, 226, 0.1);
  }
  .deep-section p,
  .inner-quote p {
    margin: 9px 0 0;
    color: rgba(248, 239, 226, 0.82);
    line-height: 1.74;
    font-weight: 710;
    word-break: keep-all;
  }
  .inner-quote {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), rgba(248, 239, 226, 0.045)),
      rgba(0, 0, 0, 0.18);
    border-color: color-mix(in srgb, var(--accent) 34%, transparent);
  }
  .inner-quote p {
    color: #fff4dd;
    font-size: clamp(1.02rem, 2.4vw, 1.22rem);
    font-weight: 900;
  }
  .practice-card {
    background:
      linear-gradient(135deg, rgba(248, 239, 226, 0.105), color-mix(in srgb, var(--accent) 16%, transparent)),
      rgba(0, 0, 0, 0.16);
    border-color: color-mix(in srgb, var(--accent) 28%, transparent);
  }
  .score-section {
    margin-top: 26px;
    padding-top: 20px;
    border-top: 1px solid rgba(248, 239, 226, 0.11);
  }
  .score-list {
    display: grid;
    gap: 10px;
    margin-top: 0;
  }
  .score-list div {
    display: grid;
    grid-template-columns: minmax(112px, 180px) 1fr;
    align-items: center;
    gap: 12px;
  }
  .score-list i {
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent), #f8efe2);
  }
  .result-card footer {
    margin-top: 24px;
    color: rgba(248, 239, 226, 0.46);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin: 26px 0 30px;
  }
  .actions button {
    min-width: 168px;
    padding: 0 28px;
    font-size: 0.98rem;
  }
  .actions .share {
    background: linear-gradient(135deg, #f1c979 0%, #d79a50 52%, #c97958 100%);
    box-shadow: 0 18px 42px rgba(215, 154, 80, 0.28);
  }
  .actions button:not(.share) {
    color: #f8efe2;
    background: rgba(248, 239, 226, 0.075);
    border: 1px solid rgba(248, 239, 226, 0.22);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }
  .actions button:not(.share):hover {
    background: rgba(248, 239, 226, 0.13);
    border-color: rgba(248, 239, 226, 0.36);
  }
  .related {
    padding: 22px;
  }
  .related h2 {
    margin: 0 0 14px;
    font-size: 1.18rem;
    letter-spacing: 0;
  }
  .related div {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .related a {
    min-height: 92px;
    padding: 15px;
    border-radius: 18px;
    color: #f8efe2;
    text-decoration: none;
    background: rgba(0, 0, 0, 0.17);
    border: 1px solid rgba(248, 239, 226, 0.1);
  }
  .related strong {
    display: block;
    line-height: 1.35;
  }
  .related span {
    display: block;
    margin-top: 7px;
    color: rgba(248, 239, 226, 0.58);
    font-size: 0.86rem;
    font-weight: 700;
    line-height: 1.45;
  }
  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(0.86); opacity: 0.62; }
    50% { transform: scale(1); opacity: 1; }
  }
  @media (max-width: 760px) {
    .defense-topbar {
      align-items: flex-start;
      flex-direction: column;
      padding-top: 14px;
    }
    .locale-switch {
      width: 100%;
      justify-content: space-between;
    }
    .locale-switch button {
      flex: 1;
    }
    .hero {
      min-height: auto;
      padding: 40px 0 50px;
      text-align: left;
      place-items: start;
    }
    .hero-content {
      align-items: flex-start;
    }
    .kicker {
      justify-content: flex-start;
    }
    h1 {
      font-size: clamp(2.25rem, 12vw, 3.65rem);
    }
    .journal-preview {
      grid-template-columns: 1fr;
      gap: 10px;
      margin: 22px 0 18px;
    }
    .journal-card {
      min-height: auto;
      padding: 16px;
      border-radius: 20px;
    }
    .answers,
    .insight-grid,
    .related div {
      grid-template-columns: 1fr;
    }
    .answers button {
      min-height: 74px;
      border-radius: 17px;
      padding: 13px 14px;
    }
    .hero .primary {
      width: 100%;
      margin-left: 0;
      min-height: 58px;
    }
    .hero-actions {
      width: 100%;
      align-items: stretch;
      text-align: center;
    }
    .meta-line,
    .disclaimer {
      text-align: left;
    }
    .quiz {
      width: min(100% - 28px, 860px);
      padding: 18px 0 56px;
    }
    .question-card {
      padding: 18px;
      border-radius: 22px;
    }
    .question-card h2 {
      margin-bottom: 16px;
    }
    .score-list div {
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
`;
