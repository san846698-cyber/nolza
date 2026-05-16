"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AdBottom } from "@/app/components/Ads";
import { ShareCard } from "@/app/components/ShareCard";
import { usePersistentTestSession } from "@/hooks/usePersistentTestSession";
import {
  SIGNAL_COPY,
  SIGNAL_LOCALE_LABELS,
  SIGNAL_PERSPECTIVES,
  SIGNAL_SCENARIOS,
  calculateSignalResult,
  type PerspectiveId,
  type SignalChoice,
  type SignalLocale,
  type SignalResult,
  type SignalScores,
} from "@/lib/kr-jp-signal-test";

type Phase = "intro" | "quiz" | "result";
type SignalSession = {
  phase: Phase;
  perspective: PerspectiveId | null;
  questionIndex: number;
  answers: SignalChoice[];
};

const STORAGE_KEY = "nolza_locale";
const SESSION_KEY = "nolza:test:kr-jp-signal:v1";
const LOCALE_CHANGE_EVENT = "nolza:locale-change";
const INITIAL_SESSION: SignalSession = {
  phase: "intro",
  perspective: null,
  questionIndex: 0,
  answers: [],
};

const relatedTests = [
  { href: "/tests/defense-mechanism", title: { ko: "방어기제 테스트", en: "Defense Mechanism Test", ja: "防衛機制診断" }, sub: { ko: "내 마음의 보호 방식", en: "How your mind protects you", ja: "心の守り方" } },
  { href: "/games/friend-match", title: { ko: "친구 궁합", en: "Friend Match", ja: "友達相性" }, sub: { ko: "이름과 생년으로 보는 케미", en: "Name and birth-year chemistry", ja: "名前と生年で見る相性" } },
];

const dimensionLabels: Record<keyof SignalScores, Record<SignalLocale, string>> = {
  signalSense: { ko: "과몰입 방지", en: "Signal sense", ja: "深読み防止" },
  cultureContext: { ko: "문화 맥락", en: "Culture context", ja: "文化文脈" },
  directnessBalance: { ko: "직진/완곡 균형", en: "Directness balance", ja: "直球/遠回しのバランス" },
  overthinking: { ko: "추리 과열", en: "Overthinking", ja: "深読み度" },
};

function verdictText(locale: SignalLocale, readingScore: number) {
  if (locale === "ko") return readingScore >= 70 ? "안정적" : readingScore >= 48 ? "주의 깊음" : "로딩 중";
  if (locale === "ja") return readingScore >= 70 ? "安定" : readingScore >= 48 ? "慎重" : "読解中";
  return readingScore >= 70 ? "CLEAR" : readingScore >= 48 ? "MIXED" : "LOADING";
}

function publishLocale(locale: SignalLocale) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore private browsing storage failures.
  }
  try {
    window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }));
  } catch {
    // Older browsers can keep the page-local language without broadcast.
  }
}

function initialLocale(): SignalLocale {
  if (typeof window === "undefined") return "ko";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en" || stored === "ja") return stored;
  } catch {
    // ignore
  }
  return "ko";
}

function isSignalSession(value: unknown): value is SignalSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<SignalSession>;
  const validPhase =
    session.phase === "intro" ||
    session.phase === "quiz" ||
    session.phase === "result";
  const validPerspective =
    session.perspective === null ||
    SIGNAL_PERSPECTIVES.some((item) => item.id === session.perspective);
  const questionIndex = session.questionIndex;
  return (
    validPhase &&
    validPerspective &&
    Number.isInteger(questionIndex) &&
    typeof questionIndex === "number" &&
    questionIndex >= 0 &&
    questionIndex < SIGNAL_SCENARIOS.length &&
    Array.isArray(session.answers)
  );
}

export default function KrJpSignalTestClient() {
  const [locale, setLocaleState] = useState<SignalLocale>("ko");
  const [session, setSession, resetSession] = usePersistentTestSession(
    SESSION_KEY,
    INITIAL_SESSION,
    { validate: isSignalSession },
  );
  const [selected, setSelected] = useState<SignalChoice | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const { phase, perspective, questionIndex, answers } = session;

  useEffect(() => {
    setLocaleState(initialLocale());
  }, []);

  const setLocale = (next: SignalLocale) => {
    setLocaleState(next);
    publishLocale(next);
  };

  const scenario = SIGNAL_SCENARIOS[questionIndex];
  const result = useMemo(() => calculateSignalResult(answers, perspective), [answers, perspective]);

  const setPerspective = (value: PerspectiveId) => {
    setSession((current) => ({ ...current, perspective: value }));
  };

  const start = () => {
    setSelected(null);
    setShareCopied(false);
    resetSession({
      phase: "quiz",
      perspective,
      questionIndex: 0,
      answers: [],
    });
  };

  const restart = () => {
    setSelected(null);
    setShareCopied(false);
    resetSession({
      phase: "intro",
      perspective,
      questionIndex: 0,
      answers: [],
    });
  };

  const choose = (choice: SignalChoice) => {
    if (!selected) setSelected(choice);
  };

  const next = () => {
    if (!selected) return;
    const choice = selected;
    setSelected(null);
    setSession((current) => {
      if (current.phase !== "quiz") return current;
      const nextAnswers = [...current.answers, choice];
      if (current.questionIndex >= SIGNAL_SCENARIOS.length - 1) {
        return { ...current, answers: nextAnswers, phase: "result" };
      }
      return {
        ...current,
        answers: nextAnswers,
        questionIndex: current.questionIndex + 1,
      };
    });
  };

  const shareResult = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://nolza.fun/tests/kr-jp-signal";
    const text = `${result.result.shareLine[locale]}\n${result.result.name[locale]} · ${result.readingScore}/100\n${url}`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: SIGNAL_COPY.title[locale], text, url });
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
    <main className="signal-page" lang={locale}>
      <div className="ambient" aria-hidden>
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="chat-line chat-line-a" />
        <span className="chat-line chat-line-b" />
      </div>

      <header className="topbar">
        <Link href="/" className="home-link">
          nolza.fun
        </Link>
        <div className="locale-switch" aria-label="Language">
          {(Object.keys(SIGNAL_LOCALE_LABELS) as SignalLocale[]).map((item) => (
            <button
              key={item}
              type="button"
              className={locale === item ? "active" : ""}
              onClick={() => setLocale(item)}
            >
              {SIGNAL_LOCALE_LABELS[item]}
            </button>
          ))}
        </div>
      </header>

      {phase === "intro" && (
        <Intro locale={locale} perspective={perspective} setPerspective={setPerspective} onStart={start} />
      )}

      {phase === "quiz" && scenario && (
        <Quiz
          locale={locale}
          questionIndex={questionIndex}
          scenario={scenario}
          selected={selected}
          onChoose={choose}
          onNext={next}
        />
      )}

      {phase === "result" && (
        <Result
          locale={locale}
          result={result.result}
          readingScore={result.readingScore}
          scores={result.scores}
          correctCount={result.correctCount}
          onRetry={restart}
          onShare={shareResult}
          shareCopied={shareCopied}
        />
      )}

      <AdBottom />
      <style jsx>{styles}</style>
    </main>
  );
}

function Intro({
  locale,
  perspective,
  setPerspective,
  onStart,
}: {
  locale: SignalLocale;
  perspective: PerspectiveId | null;
  setPerspective: (value: PerspectiveId) => void;
  onStart: () => void;
}) {
  return (
    <section className="hero">
      <div className="kicker">
        <span>KR</span>
        <i />
        <span>JP</span>
        <i />
        <span>SIGNAL TEST</span>
      </div>
      <h1>{SIGNAL_COPY.title[locale]}</h1>
      <p>{SIGNAL_COPY.subtitle[locale]}</p>

      <div className="dm-preview" aria-hidden>
        <div className="bubble left">また今度ね</div>
        <div className="translation-chip">
          {SIGNAL_COPY.meaningLabel[locale]} · {locale === "ko" ? "다음에 보자" : locale === "ja" ? "また別の機会に" : "Maybe next time"}
        </div>
        <div className="bubble right">언제 밥 한번 먹자</div>
        <div className="typing">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="panel">
        <span>{SIGNAL_COPY.perspectiveTitle[locale]}</span>
        <div className="perspectives">
          {SIGNAL_PERSPECTIVES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={perspective === item.id ? "selected" : ""}
              onClick={() => setPerspective(item.id)}
            >
              <strong>{item.label[locale]}</strong>
              <small>{item.caption[locale]}</small>
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="primary" disabled={!perspective} onClick={onStart}>
        {SIGNAL_COPY.start[locale]}
      </button>
      <small className="disclaimer">{SIGNAL_COPY.disclaimer[locale]}</small>
    </section>
  );
}

function Quiz({
  locale,
  questionIndex,
  scenario,
  selected,
  onChoose,
  onNext,
}: {
  locale: SignalLocale;
  questionIndex: number;
  scenario: (typeof SIGNAL_SCENARIOS)[number];
  selected: SignalChoice | null;
  onChoose: (choice: SignalChoice) => void;
  onNext: () => void;
}) {
  const progress = ((questionIndex + 1) / SIGNAL_SCENARIOS.length) * 100;

  return (
    <section className="quiz">
      <div className="progress">
        <div>
          <span>{SIGNAL_COPY.questionCount[locale]}</span>
          <strong>
            {questionIndex + 1}/{SIGNAL_SCENARIOS.length}
          </strong>
        </div>
        <i style={{ width: `${progress}%` }} />
      </div>

      <article className="question-card">
        <span className="theme">{scenario.theme[locale]}</span>
        <p className="situation">{scenario.situation[locale]}</p>
        <div className="phrase-card">
          <blockquote>{scenario.phrase}</blockquote>
          <p>
            <span>{SIGNAL_COPY.meaningLabel[locale]}</span>
            {scenario.meaning[locale]}
          </p>
        </div>
        <h2>{scenario.question[locale]}</h2>
        <div className="choices">
          {scenario.choices.map((choiceItem) => {
            const isSelected = selected?.id === choiceItem.id;
            const isBest = choiceItem.id === scenario.bestChoiceId;
            return (
              <button
                key={choiceItem.id}
                type="button"
                className={isSelected ? "chosen" : ""}
                onClick={() => onChoose(choiceItem)}
                disabled={Boolean(selected)}
              >
                <strong>{choiceItem.label[locale]}</strong>
                <small>{choiceItem.tone[locale]}</small>
                {selected && isBest && <em>{SIGNAL_COPY.best[locale]}</em>}
              </button>
            );
          })}
        </div>
      </article>

      {selected && (
        <aside className="explanation">
          <span>{SIGNAL_COPY.explanationLabel[locale]}</span>
          <p>{scenario.explanation[locale]}</p>
          <button type="button" className="primary" onClick={onNext}>
            {questionIndex >= SIGNAL_SCENARIOS.length - 1 ? SIGNAL_COPY.finish[locale] : SIGNAL_COPY.next[locale]}
          </button>
        </aside>
      )}
    </section>
  );
}

function Result({
  locale,
  result,
  readingScore,
  scores,
  correctCount,
  onRetry,
  onShare,
  shareCopied,
}: {
  locale: SignalLocale;
  result: SignalResult;
  readingScore: number;
  scores: SignalScores;
  correctCount: number;
  onRetry: () => void;
  onShare: () => void;
  shareCopied: boolean;
}) {
  return (
    <section className="result-wrap" style={{ "--accent": result.accent } as CSSProperties}>
      <ShareCard
        filename={`nolza-kr-jp-signal-${result.id}`}
        buttonLabel={{ ko: SIGNAL_COPY.saveImage.ko, en: SIGNAL_COPY.saveImage.en }}
        locale={locale === "ko" ? "ko" : "en"}
      >
        {() => (
          <article className="result-card">
            <div className="result-top">
              <span>{SIGNAL_COPY.resultLabel[locale]}</span>
              <strong>{readingScore}/100</strong>
            </div>
            <h2>{result.name[locale]}</h2>
            <p className="subtitle">{result.subtitle[locale]}</p>

            <div className="score-row">
              <div>
                <span>{SIGNAL_COPY.scoreLabel[locale]}</span>
                <strong>{correctCount}/{SIGNAL_SCENARIOS.length}</strong>
              </div>
              <div>
                <span>{locale === "ko" ? "판정" : locale === "ja" ? "判定" : "Verdict"}</span>
                <strong>{verdictText(locale, readingScore)}</strong>
              </div>
            </div>

            <p className="description">{result.description[locale]}</p>

            <div className="analysis-grid">
              <section>
                <span>{locale === "ko" ? "강점" : locale === "ja" ? "強み" : "Strength"}</span>
                <p>{result.strength[locale]}</p>
              </section>
              <section>
                <span>{locale === "ko" ? "약점" : locale === "ja" ? "弱点" : "Weak point"}</span>
                <p>{result.weakPoint[locale]}</p>
              </section>
            </div>

            <div className="meters">
              {(Object.keys(scores) as Array<keyof SignalScores>).map((key) => (
                <div key={key} className="meter">
                  <div>
                    <span>{dimensionLabels[key][locale]}</span>
                    <strong>{scores[key]}</strong>
                  </div>
                  <i style={{ width: `${Math.min(100, scores[key] * 4)}%` }} />
                </div>
              ))}
            </div>

            <div className="advice">
              <span>{locale === "ko" ? "가벼운 팁" : locale === "ja" ? "小さなヒント" : "Small tip"}</span>
              <p>{result.advice[locale]}</p>
            </div>

            <div className="share-line">
              <span>{locale === "ko" ? "공유 멘트" : locale === "ja" ? "シェア文" : "Share line"}</span>
              <p>{result.shareLine[locale]}</p>
            </div>
            <footer>nolza.fun · KR JP Signal Test</footer>
          </article>
        )}
      </ShareCard>

      <div className="actions" data-share-card-skip="true">
        <button type="button" className="share" onClick={onShare}>
          {shareCopied ? SIGNAL_COPY.copied[locale] : SIGNAL_COPY.share[locale]}
        </button>
        <button type="button" onClick={onRetry}>
          {SIGNAL_COPY.retry[locale]}
        </button>
      </div>

      <nav className="related">
        <h2>{SIGNAL_COPY.related[locale]}</h2>
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
  .signal-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    color: #f7f3ea;
    background:
      radial-gradient(circle at 16% 8%, rgba(251, 191, 36, 0.17), transparent 34%),
      radial-gradient(circle at 86% 18%, rgba(125, 211, 252, 0.16), transparent 30%),
      linear-gradient(135deg, #12111a 0%, #201d30 48%, #111827 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), "Noto Sans JP", system-ui, sans-serif;
  }
  .ambient {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.88;
  }
  .orb {
    position: absolute;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    filter: blur(0.2px);
  }
  .orb-a {
    left: -84px;
    top: 18%;
    width: 260px;
    height: 260px;
    background: rgba(251, 191, 36, 0.12);
  }
  .orb-b {
    right: -80px;
    bottom: 12%;
    width: 300px;
    height: 300px;
    background: rgba(110, 231, 183, 0.1);
  }
  .chat-line {
    position: absolute;
    width: 190px;
    height: 54px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.05);
  }
  .chat-line-a {
    right: 9%;
    top: 18%;
  }
  .chat-line-b {
    left: 7%;
    bottom: 16%;
  }
  .topbar {
    width: min(1080px, calc(100% - 32px));
    margin: 0 auto;
    padding: 22px 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: relative;
    z-index: 2;
  }
  .home-link {
    color: #f7f3ea;
    text-decoration: none;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .locale-switch {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .locale-switch button {
    min-height: 38px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(247, 243, 234, 0.72);
    font-weight: 850;
    cursor: pointer;
  }
  .locale-switch button.active {
    color: #17151f;
    background: #f7f3ea;
  }
  .hero,
  .quiz,
  .result-wrap {
    width: min(960px, calc(100% - 32px));
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .hero {
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px 0 72px;
  }
  .kicker {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fbbf24;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.14em;
  }
  .kicker i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(247, 243, 234, 0.5);
  }
  h1 {
    max-width: 760px;
    margin: 18px 0 14px;
    font-size: clamp(2.3rem, 8vw, 5.4rem);
    line-height: 1.02;
    letter-spacing: 0;
  }
  .hero > p {
    max-width: 680px;
    margin: 0;
    color: rgba(247, 243, 234, 0.76);
    font-size: clamp(1.03rem, 2.4vw, 1.22rem);
    line-height: 1.75;
    font-weight: 700;
  }
  .dm-preview {
    width: min(100%, 640px);
    margin: 28px 0;
    padding: 18px;
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.11);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 26px 70px rgba(0, 0, 0, 0.2);
  }
  .bubble {
    width: fit-content;
    max-width: 80%;
    padding: 13px 16px;
    border-radius: 18px;
    font-weight: 900;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .bubble.left {
    background: rgba(255, 255, 255, 0.12);
  }
  .bubble.right {
    margin-left: auto;
    margin-top: 12px;
    color: #17151f;
    background: linear-gradient(135deg, #fbbf24, #7dd3fc);
  }
  .translation-chip {
    width: fit-content;
    max-width: 92%;
    margin-top: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    color: rgba(247, 243, 234, 0.78);
    background: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.82rem;
    font-weight: 800;
  }
  .typing {
    width: 70px;
    margin-top: 12px;
    display: flex;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }
  .typing span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(247, 243, 234, 0.65);
    animation: blink 1.4s infinite ease-in-out;
  }
  .typing span:nth-child(2) { animation-delay: 0.12s; }
  .typing span:nth-child(3) { animation-delay: 0.24s; }
  .panel,
  .question-card,
  .explanation,
  .result-card,
  .related {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.08);
    border-radius: 28px;
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(18px);
  }
  .panel {
    padding: 18px;
  }
  .panel > span,
  .theme,
  .explanation > span,
  .result-top span,
  .score-row span,
  .analysis-grid span,
  .advice span,
  .share-line span,
  .meter span {
    color: rgba(247, 243, 234, 0.62);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .perspectives {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .perspectives button,
  .choices button {
    min-height: 98px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    background: rgba(15, 23, 42, 0.44);
    color: #f7f3ea;
    text-align: left;
    padding: 16px;
    cursor: pointer;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }
  .perspectives button:hover,
  .choices button:not(:disabled):hover {
    transform: translateY(-2px);
    border-color: rgba(251, 191, 36, 0.52);
  }
  .perspectives button.selected,
  .choices button.chosen {
    border-color: #fbbf24;
    background: rgba(251, 191, 36, 0.14);
  }
  .perspectives strong,
  .choices strong {
    display: block;
    font-size: 1rem;
    line-height: 1.5;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .perspectives small,
  .choices small {
    display: block;
    margin-top: 8px;
    color: rgba(247, 243, 234, 0.62);
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.5;
  }
  .primary,
  .actions button {
    min-height: 52px;
    border: 0;
    border-radius: 999px;
    padding: 0 22px;
    font-weight: 950;
    cursor: pointer;
    color: #17151f;
    background: linear-gradient(135deg, #fbbf24, #7dd3fc);
    box-shadow: 0 16px 36px rgba(251, 191, 36, 0.24);
  }
  .hero .primary {
    width: fit-content;
    margin-top: 22px;
  }
  .primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .disclaimer {
    margin-top: 14px;
    color: rgba(247, 243, 234, 0.58);
    font-weight: 700;
  }
  .quiz {
    padding: 34px 0 80px;
  }
  .progress {
    margin: 18px 0;
  }
  .progress div {
    display: flex;
    justify-content: space-between;
    color: rgba(247, 243, 234, 0.72);
    font-weight: 900;
  }
  .progress > i {
    display: block;
    height: 8px;
    margin-top: 10px;
    border-radius: 999px;
    background: linear-gradient(90deg, #fbbf24, #7dd3fc);
    transition: width 260ms ease;
  }
  .question-card {
    padding: clamp(22px, 4vw, 36px);
  }
  .situation {
    margin: 12px 0 14px;
    color: rgba(247, 243, 234, 0.78);
    font-size: clamp(1rem, 2.4vw, 1.12rem);
    font-weight: 800;
    line-height: 1.7;
  }
  .phrase-card {
    margin: 0 0 20px;
    padding: 16px;
    border-radius: 22px;
    background: rgba(8, 13, 27, 0.48);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .phrase-card blockquote {
    width: fit-content;
    max-width: 100%;
    margin: 0 0 10px;
    padding: 13px 16px;
    border-radius: 18px 18px 18px 6px;
    color: #17151f;
    background: linear-gradient(135deg, #fef3c7, #bae6fd);
    font-size: clamp(1.18rem, 4vw, 1.6rem);
    font-weight: 950;
    line-height: 1.45;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .phrase-card p {
    margin: 0;
    color: rgba(247, 243, 234, 0.78);
    font-weight: 800;
    line-height: 1.65;
  }
  .phrase-card p span {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    margin-right: 8px;
    padding: 0 9px;
    border-radius: 999px;
    color: #17151f;
    background: #fbbf24;
    font-size: 0.76rem;
    font-weight: 950;
  }
  .question-card h2 {
    margin: 12px 0 22px;
    font-size: clamp(1.34rem, 4vw, 2.1rem);
    line-height: 1.4;
    letter-spacing: 0;
    word-break: keep-all;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .choices button {
    position: relative;
  }
  .choices button:disabled {
    cursor: default;
  }
  .choices em {
    display: inline-block;
    margin-top: 12px;
    color: #17151f;
    background: #6ee7b7;
    border-radius: 999px;
    padding: 6px 10px;
    font-style: normal;
    font-size: 0.78rem;
    font-weight: 950;
  }
  .explanation {
    margin-top: 16px;
    padding: 22px;
  }
  .explanation p {
    margin: 10px 0 18px;
    color: rgba(247, 243, 234, 0.8);
    line-height: 1.75;
    font-weight: 700;
  }
  .result-wrap {
    padding: 34px 0 84px;
  }
  .result-card {
    padding: clamp(22px, 5vw, 42px);
    overflow: hidden;
    position: relative;
  }
  .result-card:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 80% 8%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 36%);
    pointer-events: none;
  }
  .result-card > * {
    position: relative;
  }
  .result-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }
  .result-top strong {
    color: var(--accent);
    font-size: clamp(1.4rem, 5vw, 2.4rem);
  }
  .result-card h2 {
    margin: 18px 0 8px;
    font-size: clamp(2rem, 8vw, 4.4rem);
    line-height: 1.08;
    letter-spacing: 0;
  }
  .subtitle,
  .description {
    color: rgba(247, 243, 234, 0.82);
    line-height: 1.75;
    font-weight: 750;
  }
  .score-row,
  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }
  .score-row div,
  .analysis-grid section,
  .advice,
  .share-line {
    padding: 16px;
    border-radius: 18px;
    background: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .score-row strong {
    display: block;
    margin-top: 6px;
    font-size: 1.35rem;
  }
  .analysis-grid p,
  .advice p,
  .share-line p {
    margin: 8px 0 0;
    color: rgba(247, 243, 234, 0.8);
    line-height: 1.65;
    font-weight: 700;
  }
  .meters {
    display: grid;
    gap: 12px;
    margin-top: 18px;
  }
  .meter div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }
  .meter > i {
    display: block;
    height: 9px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent), #fbbf24);
  }
  .advice,
  .share-line {
    margin-top: 18px;
  }
  footer {
    margin-top: 24px;
    color: rgba(247, 243, 234, 0.48);
    font-size: 0.82rem;
    font-weight: 900;
    letter-spacing: 0.12em;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin: 18px 0 26px;
  }
  .actions button:not(.share) {
    color: #f7f3ea;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: none;
  }
  .related {
    padding: 22px;
  }
  .related h2 {
    margin: 0 0 14px;
    font-size: 1.2rem;
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
    color: #f7f3ea;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .related span {
    display: block;
    margin-top: 7px;
    color: rgba(247, 243, 234, 0.58);
    font-size: 0.86rem;
    font-weight: 700;
  }
  @keyframes blink {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-4px); opacity: 1; }
  }
  @media (max-width: 760px) {
    .topbar {
      align-items: flex-start;
      flex-direction: column;
    }
    .hero {
      min-height: auto;
      padding-top: 30px;
    }
    .locale-switch {
      width: 100%;
      justify-content: space-between;
    }
    .locale-switch button {
      flex: 1;
    }
    .perspectives,
    .choices,
    .score-row,
    .analysis-grid,
    .related div {
      grid-template-columns: 1fr;
    }
    .perspectives button,
    .choices button {
      min-height: 86px;
    }
    .hero .primary,
    .explanation .primary {
      width: 100%;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
`;
