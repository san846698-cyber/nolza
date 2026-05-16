"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AdBottom } from "@/app/components/Ads";
import { ShareCard } from "@/app/components/ShareCard";
import { usePersistentTestSession } from "@/hooks/usePersistentTestSession";
import {
  ERA_LABELS,
  MEME_QUESTIONS,
  calculateMemeResult,
  type MemeAnswer,
  type MemeAgeResult,
  type MemeEraId,
} from "@/lib/meme-age-test";

type Phase = "intro" | "quiz" | "result";
type MemeSession = {
  phase: Phase;
  questionIndex: number;
  answers: MemeAnswer[];
};

const SESSION_KEY = "nolza:test:meme-age:v2";
const INITIAL_SESSION: MemeSession = {
  phase: "intro",
  questionIndex: 0,
  answers: [],
};

const C = {
  bg: "#16112a",
  paper: "#fff7dc",
  ink: "#1d1232",
  neon: "#45ffb0",
  pink: "#ff5fa8",
  blue: "#61d9ff",
  yellow: "#ffe45e",
};

const RECOMMENDED = [
  { href: "/games/kbti", title: "KBTI", sub: "한국형 성격 테스트" },
  { href: "/games/whatgeneration", title: "세대 테스트", sub: "나는 어느 감성 세대?" },
  { href: "/tests/defense-mechanism", title: "방어기제 테스트", sub: "내 마음의 보호 방식" },
];

function isMemeSession(value: unknown): value is MemeSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<MemeSession>;
  const validPhase =
    session.phase === "intro" ||
    session.phase === "quiz" ||
    session.phase === "result";
  const questionIndex = session.questionIndex;
  return (
    validPhase &&
    Number.isInteger(questionIndex) &&
    typeof questionIndex === "number" &&
    questionIndex >= 0 &&
    questionIndex < MEME_QUESTIONS.length &&
    Array.isArray(session.answers) &&
    session.answers.every((answer) => (
      answer &&
      typeof answer === "object" &&
      typeof (answer as Partial<MemeAnswer>).id === "string" &&
      typeof (answer as Partial<MemeAnswer>).correct === "boolean" &&
      typeof (answer as Partial<MemeAnswer>).era === "string"
    ))
  );
}

export default function MemeAgeTestClient() {
  const [session, setSession, resetSession] = usePersistentTestSession(
    SESSION_KEY,
    INITIAL_SESSION,
    { validate: isMemeSession },
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const answerPendingRef = useRef(false);
  const answerTimerRef = useRef<number | null>(null);
  const { phase, questionIndex, answers } = session;

  const currentQuestion = MEME_QUESTIONS[questionIndex];
  const progress = ((questionIndex + (phase === "result" ? 1 : 0)) / MEME_QUESTIONS.length) * 100;
  const calculated = useMemo(() => calculateMemeResult(answers), [answers]);
  const currentStreak = useMemo(() => getCurrentStreak(answers), [answers]);
  const bestStreak = useMemo(() => getBestStreak(answers), [answers]);

  useEffect(() => {
    return () => {
      if (answerTimerRef.current !== null) {
        window.clearTimeout(answerTimerRef.current);
      }
    };
  }, []);

  const start = () => {
    if (answerTimerRef.current !== null) window.clearTimeout(answerTimerRef.current);
    answerTimerRef.current = null;
    setSelectedId(null);
    answerPendingRef.current = false;
    setShareCopied(false);
    resetSession({ phase: "quiz", questionIndex: 0, answers: [] });
  };

  const chooseAnswer = (answer: MemeAnswer) => {
    if (selectedId || answerPendingRef.current) return;
    answerPendingRef.current = true;
    setSelectedId(answer.id);
    answerTimerRef.current = window.setTimeout(() => {
      setSession((current) => {
        if (current.phase !== "quiz") return current;
        const nextAnswers = [...current.answers, answer];
        if (current.questionIndex >= MEME_QUESTIONS.length - 1) {
          return { ...current, answers: nextAnswers, phase: "result" };
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
    }, 1050);
  };

  const shareResult = async () => {
    const result = calculated.result;
    const url = typeof window !== "undefined" ? window.location.href : "https://nolza.fun/tests/meme-age";
    const text = `${result.shareLine}\n${result.name} (${result.memeAge})\n${url}`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "당신의 밈 나이는 몇 살?",
          text,
          url,
        });
        return;
      } catch {
        // The user may have dismissed the share sheet. Clipboard fallback below.
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
    <main className="meme-age-page">
      <div className="meme-bg" aria-hidden>
        <span className="meme-dot meme-dot--one" />
        <span className="meme-dot meme-dot--two" />
        <span className="meme-cursor">▸</span>
      </div>

      <header className="meme-topbar">
        <Link href="/" className="meme-home">
          nolza.fun
        </Link>
        <span>Korean Internet Meme Age Test</span>
      </header>

      <div className="meme-shell">
        {phase === "intro" ? (
          <IntroScreen onStart={start} />
        ) : phase === "quiz" ? (
          <QuizScreen
            question={currentQuestion}
            index={questionIndex}
            progress={progress}
            streak={currentStreak}
            selectedId={selectedId}
            onChoose={chooseAnswer}
          />
        ) : (
          <ResultScreen
            result={calculated.result}
            scores={calculated.scores}
            correctCount={calculated.correctCount}
            accuracy={calculated.accuracy}
            strongestEra={calculated.strongestEra}
            weakestEra={calculated.weakestEra}
            bestStreak={bestStreak}
            onReplay={start}
            onShare={shareResult}
            shareCopied={shareCopied}
          />
        )}
      </div>

      <AdBottom />
      <style jsx>{styles}</style>
    </main>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="meme-intro">
      <div className="retro-window" aria-hidden>
        <div className="retro-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="retro-screen">
          <b>MEME AGE</b>
          <span>2003</span>
          <span>2007</span>
          <span>2016</span>
          <span>2024</span>
          <span>2026</span>
        </div>
      </div>

      <div className="meme-chip">12문항 · 저작권 안전 텍스트 퀴즈</div>
      <h1>당신의 밈 나이는 몇 살?</h1>
      <p>
        디시, 싸이월드, 급식체, 숏폼 밈까지.
        <br />
        당신은 어느 시대 인터넷 사람인지 맞혀보세요.
      </p>
      <p className="meme-note">설문이 아닙니다. 직접 맞히면서 당신의 인터넷 세대를 확인해보세요.</p>
      <button type="button" className="meme-primary btn-press" onClick={onStart}>
        밈 나이 테스트 시작하기
      </button>
      <div className="meme-hints" aria-label="테스트 구성">
        <span>초기 인터넷</span>
        <span>2000s 감성</span>
        <span>2010s 드립</span>
        <span>숏폼·AI 밈</span>
      </div>
    </section>
  );
}

function QuizScreen({
  question,
  index,
  progress,
  streak,
  selectedId,
  onChoose,
}: {
  question: (typeof MEME_QUESTIONS)[number];
  index: number;
  progress: number;
  streak: number;
  selectedId: string | null;
  onChoose: (answer: MemeAnswer) => void;
}) {
  const selected = question.answers.find((answer) => answer.id === selectedId);
  const feedbackText = selected?.feedback
    .replace(/^정답!\s*/, "")
    .replace(/^아쉽다!\s*/, "");

  return (
    <section className="quiz-wrap">
      <div className="progress-card">
        <div>
          <span>{question.category}</span>
          <strong>
            {index + 1}/{MEME_QUESTIONS.length}
          </strong>
        </div>
        <i style={{ width: `${progress}%` }} />
      </div>

      <article className="question-card">
        <span>{question.mood}</span>
        <h2>{question.question}</h2>
        <p className="meme-clue">{question.clue}</p>
        <div className="streak-line">
          <b>ROUND {index + 1}</b>
          <b>STREAK {streak}</b>
        </div>
        <div className="answers">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              type="button"
              className={[
                selectedId === answer.id ? "selected" : "",
                selectedId && answer.correct ? "is-correct" : "",
                selectedId === answer.id && !answer.correct ? "is-wrong" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onChoose(answer)}
              disabled={Boolean(selectedId)}
            >
              <strong>{answer.text}</strong>
              <small>{answer.caption}</small>
            </button>
          ))}
        </div>
        {selected ? (
          <div className={selected.correct ? "feedback correct" : "feedback wrong"} role="status">
            <strong>{selected.correct ? "정답!" : "아쉽다!"}</strong>
            <span>{feedbackText}</span>
          </div>
        ) : null}
      </article>
    </section>
  );
}

function ResultScreen({
  result,
  scores,
  correctCount,
  accuracy,
  strongestEra,
  weakestEra,
  bestStreak,
  onReplay,
  onShare,
  shareCopied,
}: {
  result: MemeAgeResult;
  scores: Record<Exclude<MemeEraId, "omnivore">, number>;
  correctCount: number;
  accuracy: number;
  strongestEra: Exclude<MemeEraId, "omnivore">;
  weakestEra: Exclude<MemeEraId, "omnivore">;
  bestStreak: number;
  onReplay: () => void;
  onShare: () => void;
  shareCopied: boolean;
}) {
  return (
    <section className="result-wrap">
      <ShareCard
        filename={`nolza-meme-age-${result.id}`}
        backgroundColor={C.bg}
        buttonLabel={{ ko: "결과 이미지 저장", en: "Save result image" }}
        buttonClassName="meme-save-button btn-press"
      >
        {() => (
          <article className="result-card" style={{ "--accent": result.accent } as CSSProperties}>
            <div className="result-badge">MEME AGE RESULT</div>
            <div className="result-emoji">{result.emoji}</div>
            <h2>{result.name}</h2>
            <p className="meme-age">{result.memeAge}</p>
            <p className="description">{result.description}</p>

            <div className="result-stats">
              <article>
                <span>정답률</span>
                <strong>{accuracy}%</strong>
                <p>{correctCount}/{MEME_QUESTIONS.length}문항 정답</p>
              </article>
              <article>
                <span>최고 연속 정답</span>
                <strong>{bestStreak}</strong>
                <p>밈 감각 콤보</p>
              </article>
              <article>
                <span>가장 강한 시대</span>
                <strong>{ERA_LABELS[strongestEra]}</strong>
                <p>가장 잘 알아본 감성</p>
              </article>
              <article>
                <span>약한 시대</span>
                <strong>{ERA_LABELS[weakestEra]}</strong>
                <p>다음 복습 구간</p>
              </article>
            </div>

            <div className="trait-list">
              {result.traits.map((trait) => (
                <span key={trait}>{trait}</span>
              ))}
            </div>

            <div className="split-grid">
              <article>
                <span>판정</span>
                <p>{result.verdict}</p>
              </article>
              <article>
                <span>단톡방 포지션</span>
                <p>{result.groupChatRole}</p>
              </article>
            </div>

            <div className="timeline-box">
              <span>당신의 밈 타임라인</span>
              {result.timeline.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <div className="score-board">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key}>
                  <span>{ERA_LABELS[key as Exclude<MemeEraId, "omnivore">]}</span>
                  <i style={{ width: `${Math.min(100, value * 34)}%` }} />
                </div>
              ))}
            </div>

            <div className="share-line">
              <span>공유 멘트</span>
              <strong>{result.shareLine}</strong>
            </div>

            <footer>nolza.fun · 당신의 밈 나이는 몇 살?</footer>
          </article>
        )}
      </ShareCard>

      <div className="actions" data-share-card-skip="true">
        <button type="button" className="action primary btn-press" onClick={onShare}>
          {shareCopied ? "공유 문구 복사됨" : "친구에게 공유하기"}
        </button>
        <button type="button" className="action btn-press" onClick={onReplay}>
          다시 하기
        </button>
      </div>

      <nav className="recommended" data-share-card-skip="true" aria-label="추천 테스트">
        <h3>다음에 해볼 만한 테스트</h3>
        <div>
          {RECOMMENDED.map((item) => (
            <Link key={item.href} href={item.href}>
              <strong>{item.title}</strong>
              <span>{item.sub}</span>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}

function getCurrentStreak(answers: MemeAnswer[]) {
  let streak = 0;
  for (let i = answers.length - 1; i >= 0; i -= 1) {
    if (!answers[i].correct) break;
    streak += 1;
  }
  return streak;
}

function getBestStreak(answers: MemeAnswer[]) {
  let best = 0;
  let current = 0;
  answers.forEach((answer) => {
    if (answer.correct) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });
  return best;
}

const styles = `
  .meme-age-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at 12% 8%, rgba(69, 255, 176, 0.18), transparent 28%),
      radial-gradient(circle at 88% 16%, rgba(255, 95, 168, 0.22), transparent 30%),
      linear-gradient(135deg, #16112a 0%, #211846 54%, #32143a 100%);
    color: #fff7dc;
    padding: 18px;
  }
  .meme-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.75;
  }
  .meme-bg:before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 30px 30px;
  }
  .meme-dot {
    position: absolute;
    border-radius: 999px;
    filter: blur(0.5px);
  }
  .meme-dot--one {
    width: 260px;
    height: 260px;
    left: -80px;
    top: 18%;
    background: rgba(69, 255, 176, 0.16);
  }
  .meme-dot--two {
    width: 320px;
    height: 320px;
    right: -100px;
    bottom: 10%;
    background: rgba(255, 95, 168, 0.16);
  }
  .meme-cursor {
    position: absolute;
    right: 12%;
    top: 22%;
    color: #ffe45e;
    font-size: 54px;
    transform: rotate(-18deg);
  }
  .meme-topbar,
  .meme-shell {
    position: relative;
    z-index: 1;
    width: min(980px, 100%);
    margin: 0 auto;
  }
  .meme-topbar {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    padding: 8px 0 18px;
    font-weight: 900;
  }
  .meme-home {
    color: #fff7dc;
    text-decoration: none;
  }
  .meme-topbar span {
    color: rgba(255, 247, 220, 0.68);
    font-size: 0.8rem;
    letter-spacing: 0.1em;
  }
  .meme-intro {
    min-height: calc(100svh - 150px);
    display: grid;
    place-items: center;
    align-content: center;
    text-align: center;
    padding: clamp(28px, 7vw, 72px) 0;
  }
  .retro-window {
    width: min(100%, 480px);
    border: 3px solid #1d1232;
    border-radius: 18px;
    overflow: hidden;
    background: #fff7dc;
    color: #1d1232;
    box-shadow: 10px 10px 0 #000, 0 24px 80px rgba(0,0,0,0.28);
    transform: rotate(-1.5deg);
  }
  .retro-bar {
    height: 38px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    border-bottom: 3px solid #1d1232;
    background: #ff5fa8;
  }
  .retro-bar span {
    width: 12px;
    height: 12px;
    border: 2px solid #1d1232;
    border-radius: 50%;
    background: #ffe45e;
  }
  .retro-screen {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 22px;
    background:
      linear-gradient(90deg, rgba(29,18,50,0.05) 1px, transparent 1px),
      linear-gradient(rgba(29,18,50,0.05) 1px, transparent 1px),
      #fff7dc;
    background-size: 16px 16px;
  }
  .retro-screen b {
    grid-column: 1 / -1;
    font-family: var(--font-press-start), var(--font-inter), sans-serif;
    color: #1d1232;
    font-size: clamp(16px, 4.8vw, 30px);
    line-height: 1.35;
  }
  .retro-screen span {
    border: 2px solid #1d1232;
    border-radius: 12px;
    background: #fff;
    padding: 9px 6px;
    font-size: 12px;
    font-weight: 900;
  }
  .meme-chip {
    margin-top: clamp(34px, 7vw, 54px);
    display: inline-flex;
    min-height: 34px;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    border-radius: 999px;
    background: rgba(69, 255, 176, 0.14);
    color: #45ffb0;
    font-weight: 900;
  }
  h1 {
    margin: 16px 0 12px;
    max-width: 820px;
    font-size: clamp(2.7rem, 9vw, 6rem);
    line-height: 0.95;
    letter-spacing: 0;
    text-shadow: 5px 5px 0 #000;
  }
  .meme-intro p {
    margin: 0;
    color: rgba(255,247,220,0.8);
    font-size: clamp(1.06rem, 2.5vw, 1.24rem);
    line-height: 1.75;
    font-weight: 800;
  }
  .meme-intro .meme-note {
    margin-top: 12px;
    color: rgba(69,255,176,0.88);
    font-size: 0.98rem;
    line-height: 1.55;
  }
  .meme-primary,
  .action {
    min-height: 54px;
    border: 3px solid #1d1232;
    border-radius: 18px;
    background: #45ffb0;
    color: #1d1232;
    padding: 0 22px;
    font-weight: 950;
    box-shadow: 6px 6px 0 #000;
    cursor: pointer;
  }
  .meme-primary {
    margin-top: 24px;
  }
  .meme-hints {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 22px;
  }
  .meme-hints span {
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255,247,220,0.22);
    background: rgba(255,255,255,0.08);
    color: rgba(255,247,220,0.72);
    font-size: 0.86rem;
    font-weight: 800;
  }
  .quiz-wrap,
  .result-wrap {
    padding: clamp(20px, 4vw, 54px) 0 76px;
  }
  .progress-card,
  .question-card,
  .result-card,
  .recommended {
    border: 3px solid #1d1232;
    border-radius: 24px;
    background: #fff7dc;
    color: #1d1232;
    box-shadow: 10px 10px 0 #000;
  }
  .progress-card {
    padding: 18px;
    margin-bottom: 18px;
  }
  .progress-card div {
    display: flex;
    justify-content: space-between;
    font-weight: 900;
  }
  .progress-card span {
    color: rgba(29,18,50,0.62);
  }
  .progress-card i {
    display: block;
    height: 10px;
    margin-top: 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, #45ffb0, #ff5fa8, #ffe45e);
    transition: width 240ms ease;
  }
  .question-card {
    padding: clamp(20px, 5vw, 42px);
  }
  .question-card > span {
    color: #ff5fa8;
    font-size: 0.84rem;
    font-weight: 950;
    letter-spacing: 0.08em;
  }
  .question-card h2 {
    margin: 12px 0 22px;
    font-size: clamp(1.5rem, 5vw, 2.8rem);
    line-height: 1.2;
    letter-spacing: 0;
  }
  .meme-clue {
    margin: -8px 0 18px;
    border: 2px dashed rgba(29,18,50,0.24);
    border-radius: 18px;
    background: rgba(69,255,176,0.12);
    padding: 14px 16px;
    color: rgba(29,18,50,0.74);
    font-size: clamp(1rem, 2.5vw, 1.12rem);
    line-height: 1.6;
    font-weight: 850;
  }
  .streak-line {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
    color: rgba(29,18,50,0.56);
    font-size: 0.76rem;
    letter-spacing: 0.12em;
  }
  .answers {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .answers button {
    min-height: 102px;
    border: 2px solid #1d1232;
    border-radius: 18px;
    background: white;
    color: #1d1232;
    text-align: left;
    padding: 16px;
    cursor: pointer;
    transition: transform 180ms ease, background 180ms ease;
  }
  .answers button:hover,
  .answers button.selected {
    background: #ffe45e;
    transform: translateY(-2px);
  }
  .answers button.is-correct {
    background: #45ffb0;
    box-shadow: inset 0 0 0 3px rgba(29,18,50,0.16);
  }
  .answers button.is-wrong {
    background: #ffd3e6;
    opacity: 0.86;
  }
  .answers button:disabled {
    cursor: default;
  }
  .answers strong,
  .answers small {
    display: block;
  }
  .answers strong {
    font-size: 1rem;
    line-height: 1.45;
  }
  .answers small {
    margin-top: 8px;
    color: rgba(29,18,50,0.62);
    font-weight: 800;
  }
  .feedback {
    margin-top: 16px;
    display: grid;
    gap: 4px;
    border: 2px solid #1d1232;
    border-radius: 18px;
    padding: 14px 16px;
    color: #1d1232;
    font-weight: 900;
    animation: feedback-pop 180ms ease-out;
  }
  .feedback.correct {
    background: #45ffb0;
  }
  .feedback.wrong {
    background: #ffd3e6;
  }
  .feedback span {
    color: rgba(29,18,50,0.72);
    line-height: 1.55;
  }
  @keyframes feedback-pop {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .result-card {
    position: relative;
    overflow: hidden;
    padding: clamp(24px, 5vw, 44px);
  }
  .result-card:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 86% 8%, var(--accent), transparent 26%);
    opacity: 0.24;
  }
  .result-card > * {
    position: relative;
  }
  .result-badge {
    display: inline-flex;
    padding: 9px 12px;
    border-radius: 999px;
    background: #1d1232;
    color: #45ffb0;
    font-size: 0.75rem;
    font-weight: 950;
    letter-spacing: 0.12em;
  }
  .result-emoji {
    margin-top: 24px;
    font-size: 3.6rem;
    font-weight: 950;
  }
  .result-card h2 {
    margin: 10px 0 6px;
    font-size: clamp(2.2rem, 8vw, 4.8rem);
    line-height: 1;
    letter-spacing: 0;
  }
  .meme-age {
    margin: 0 0 14px;
    color: var(--accent);
    font-size: 1.24rem;
    font-weight: 950;
  }
  .description {
    max-width: 720px;
    color: rgba(29,18,50,0.75);
    line-height: 1.8;
    font-weight: 760;
  }
  .trait-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 18px 0;
  }
  .result-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin: 20px 0 18px;
  }
  .result-stats article {
    border: 2px solid rgba(29,18,50,0.16);
    border-radius: 18px;
    background: rgba(255,255,255,0.66);
    padding: 14px;
  }
  .result-stats span {
    display: block;
    color: rgba(29,18,50,0.54);
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.08em;
  }
  .result-stats strong {
    display: block;
    margin-top: 7px;
    font-size: clamp(1.25rem, 4vw, 2rem);
    line-height: 1.1;
  }
  .result-stats p {
    margin: 6px 0 0;
    color: rgba(29,18,50,0.62);
    font-size: 0.78rem;
    font-weight: 850;
    line-height: 1.4;
  }
  .trait-list span {
    border: 2px solid #1d1232;
    border-radius: 999px;
    background: white;
    padding: 8px 12px;
    font-size: 0.88rem;
    font-weight: 900;
  }
  .split-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .split-grid > article,
  .timeline-box,
  .score-board,
  .share-line {
    border: 2px solid rgba(29,18,50,0.16);
    border-radius: 18px;
    background: rgba(255,255,255,0.58);
    padding: 16px;
  }
  .split-grid span,
  .timeline-box span,
  .share-line span {
    color: rgba(29,18,50,0.58);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.08em;
  }
  .split-grid p,
  .timeline-box p {
    margin: 8px 0 0;
    color: rgba(29,18,50,0.74);
    line-height: 1.65;
    font-weight: 740;
  }
  .timeline-box,
  .score-board,
  .share-line {
    margin-top: 14px;
  }
  .score-board {
    display: grid;
    gap: 10px;
  }
  .score-board div {
    display: grid;
    gap: 6px;
  }
  .score-board span {
    color: rgba(29,18,50,0.58);
    font-size: 0.76rem;
    font-weight: 950;
    text-transform: uppercase;
  }
  .score-board i {
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent), #45ffb0);
  }
  .share-line strong {
    display: block;
    margin-top: 8px;
    font-size: 1.08rem;
    line-height: 1.55;
  }
  .result-card footer {
    margin-top: 24px;
    color: rgba(29,18,50,0.52);
    font-size: 0.82rem;
    font-weight: 900;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin: 24px 0;
  }
  .action.primary {
    background: #ff5fa8;
  }
  .action:not(.primary) {
    background: #fff7dc;
  }
  .recommended {
    padding: 22px;
  }
  .recommended h3 {
    margin: 0 0 14px;
    font-size: 1.15rem;
  }
  .recommended div {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .recommended a {
    color: #1d1232;
    text-decoration: none;
    border: 2px solid #1d1232;
    border-radius: 16px;
    background: white;
    padding: 14px;
  }
  .recommended span {
    display: block;
    margin-top: 6px;
    color: rgba(29,18,50,0.62);
    font-size: 0.86rem;
    font-weight: 750;
  }
  @media (max-width: 700px) {
    .meme-age-page {
      padding-inline: 12px;
    }
    .meme-topbar {
      align-items: flex-start;
      flex-direction: column;
    }
    .answers,
    .result-stats,
    .split-grid,
    .recommended div {
      grid-template-columns: 1fr;
    }
    .meme-primary,
    .action {
      width: 100%;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
`;
