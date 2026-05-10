"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";
import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  TYPES,
  TYPE_ORDER,
  TARGETS,
  TARGET_ORDER,
  LIKERT_MAX,
  LIKERT_COLORS,
  LIKERT_ENDPOINT_KO,
  LIKERT_ENDPOINT_EN,
  applyTarget,
  applyTargetToSubtext,
  computeScores,
  determineType,
  computeMatch,
  getCompatibility,
  type AttachmentTypeId,
  type Scores,
  type TargetId,
} from "@/lib/attachment";

const BG = "#faf8f3"; // cream — used for intro/target/quiz
const ACCENT = "#4f46e5"; // indigo — non-typed accent
const INK = "#2a2a2a";
const SUBTLE = "rgba(42,42,42,0.6)";
const RULE = "rgba(42,42,42,0.12)";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";
const INTER = "var(--font-inter), 'Inter', sans-serif";

// ─────────────────────────────────────────────────────────────
// Per-type theming — drives the entire result screen
// ─────────────────────────────────────────────────────────────

type Theme = {
  bg: string;        // page gradient
  name: string;      // dark headline color
  accent: string;    // mid accent (SVG primary stroke)
  accentLight: string; // softer accent
  ringBg: string;    // 10% tint for badges/dots
  ringBorder: string; // 30% tint
};

const TYPE_THEME: Record<AttachmentTypeId, Theme> = {
  secure: {
    bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    name: "#065f46",
    accent: "#10b981",
    accentLight: "#34d399",
    ringBg: "rgba(16,185,129,0.1)",
    ringBorder: "rgba(16,185,129,0.3)",
  },
  anxious: {
    bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
    name: "#9f1239",
    accent: "#f43f5e",
    accentLight: "#fb7185",
    ringBg: "rgba(244,63,94,0.1)",
    ringBorder: "rgba(244,63,94,0.3)",
  },
  avoidant: {
    bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    name: "#1e3a8a",
    accent: "#3b82f6",
    accentLight: "#60a5fa",
    ringBg: "rgba(59,130,246,0.1)",
    ringBorder: "rgba(59,130,246,0.3)",
  },
  disorganized: {
    bg: "linear-gradient(135deg, #faf5ff, #ede9fe)",
    name: "#4c1d95",
    accent: "#8b5cf6",
    accentLight: "#a78bfa",
    ringBg: "rgba(139,92,246,0.1)",
    ringBorder: "rgba(139,92,246,0.3)",
  },
};

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.8)",
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
};

type Phase = "intro" | "target" | "quiz" | "result";
type Mode = "serious" | "fun";

const STATS_KEY = "nolza_attachment_stats_v2";

type Stats = {
  total: number;
  byType: Record<string, number>;
};

function defaultStats(): Stats {
  return { total: 0, byType: {} };
}

function loadStats(): Stats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stats>;
      return {
        total: typeof parsed.total === "number" ? parsed.total : 0,
        byType: parsed.byType ?? {},
      };
    }
  } catch {
    /* ignore */
  }
  return defaultStats();
}

function saveStat(stats: Stats, typeId: string): Stats {
  const next: Stats = {
    total: stats.total + 1,
    byType: { ...stats.byType, [typeId]: (stats.byType[typeId] ?? 0) + 1 },
  };
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export default function AttachmentPage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [target, setTarget] = useState<TargetId | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [stats, setStats] = useState<Stats>(defaultStats());
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>("serious");
  const [partnerType, setPartnerType] = useState<AttachmentTypeId | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [phase, questionIdx]);

  const scores: Scores | null = useMemo(() => {
    if (answers.length < TOTAL_QUESTIONS) return null;
    return computeScores(answers);
  }, [answers]);

  const typeId: AttachmentTypeId | null = useMemo(() => {
    if (!scores) return null;
    return determineType(scores);
  }, [scores]);

  const handleStart = useCallback(() => {
    setAnswers([]);
    setQuestionIdx(0);
    setMode("serious");
    setPartnerType(null);
    setPartnerName("");
    setShowPartnerModal(false);
    setTarget(null);
    setPhase("target");
  }, []);

  const handlePickTarget = useCallback((id: TargetId) => {
    setTarget(id);
    setAnswers([]);
    setQuestionIdx(0);
    setPhase("quiz");
  }, []);

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);
      if (newAnswers.length >= TOTAL_QUESTIONS) {
        const computedScores = computeScores(newAnswers);
        const computedType = determineType(computedScores);
        setStats((prev) => saveStat(prev, computedType));
        setPhase("result");
      } else {
        setQuestionIdx((i) => i + 1);
      }
    },
    [answers],
  );

  const handleBack = useCallback(() => {
    if (answers.length > 0) {
      setAnswers((prev) => prev.slice(0, -1));
      setQuestionIdx((i) => Math.max(0, i - 1));
    } else {
      setPhase("target");
    }
  }, [answers.length]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setQuestionIdx(0);
    setAnswers([]);
    setTarget(null);
  }, []);

  const handleShare = useCallback(async () => {
    if (!typeId) return;
    const text =
      locale === "ko" ? TYPES[typeId].ko.shareText : TYPES[typeId].en.shareText;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [typeId, locale]);

  const pageBg =
    phase === "result" && typeId ? TYPE_THEME[typeId].bg : BG;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: pageBg,
        color: INK,
        fontFamily: SERIF,
        position: "relative",
        paddingBottom: phase === "result" ? 100 : 0,
        transition: "background 0.4s ease",
      }}
    >
      <Link
        href="/"
        aria-label={t("놀자.fun으로 돌아가기", "Back to Nolza.fun")}
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: "rgba(42,42,42,0.6)",
          textDecoration: "none",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${RULE}`,
        }}
      >
        ←
      </Link>

      {phase === "quiz" && target ? (
        <QuizView
          questionIdx={questionIdx}
          total={TOTAL_QUESTIONS}
          target={target}
          onAnswer={handleAnswer}
          onBack={handleBack}
          t={t}
          locale={locale}
        />
      ) : (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: phase === "result" ? "flex-start" : "center",
            padding:
              phase === "result" ? "60px 20px 20px" : "70px 20px 20px",
            boxSizing: "border-box",
          }}
        >
          {phase === "intro" && <Intro onStart={handleStart} t={t} />}

          {phase === "target" && (
            <TargetSelect onPick={handlePickTarget} t={t} locale={locale} />
          )}

          {phase === "result" && typeId && scores && target && (
            <ResultView
              typeId={typeId}
              target={target}
              scores={scores}
              stats={stats}
              mode={mode}
              onModeChange={setMode}
              onRestart={handleRestart}
              onShare={handleShare}
              copied={copied}
              partnerType={partnerType}
              partnerName={partnerName}
              showPartnerModal={showPartnerModal}
              onPartnerTypeChange={setPartnerType}
              onPartnerNameChange={setPartnerName}
              onOpenPartnerModal={() => setShowPartnerModal(true)}
              onClosePartnerModal={() => setShowPartnerModal(false)}
              t={t}
              locale={locale}
            />
          )}
        </div>
      )}

      {phase === "result" && <AdMobileSticky />}

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes attReveal {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.att-reveal {
  opacity: 0;
  animation: attReveal 0.55s cubic-bezier(0.22,0.9,0.35,1) forwards;
  animation-delay: calc(var(--i, 0) * 110ms + 200ms);
}
@keyframes attDrop {
  from { opacity: 0; transform: translateY(-24px) scale(0.92); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.att-drop {
  opacity: 0;
  animation: attDrop 0.7s cubic-bezier(0.18,0.85,0.3,1) forwards;
}
@keyframes attSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.att-spin {
  animation: attSpin 20s linear infinite;
  transform-origin: center;
}
@keyframes attFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.att-fade {
  animation: attFadeIn 0.4s ease-out;
}
@keyframes attQuestionIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.att-question {
  animation: attQuestionIn 0.3s ease-out;
}
@keyframes attDotPulse {
  0%   { transform: scale(1); }
  60%  { transform: scale(1.18); }
  100% { transform: scale(1.12); }
}
.att-dot-selected {
  animation: attDotPulse 0.25s ease-out forwards;
}
@keyframes attCaretBlink {
  0%, 50%   { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.att-caret {
  display: inline-block;
  width: 2px;
  margin-left: 4px;
  animation: attCaretBlink 0.9s steps(1) infinite;
}
@keyframes attModalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.att-modal {
  animation: attModalIn 0.3s cubic-bezier(0.22,0.9,0.35,1);
}
@keyframes attOverlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.att-overlay {
  animation: attOverlayIn 0.25s ease-out;
}
.att-strength-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.2s ease;
}
.att-strength-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
}

/* Intro — full-screen with background decorations */
.att-intro-bg-blur-tr {
  position: fixed;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #c7d2fe 0%, transparent 70%);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}
.att-intro-bg-blur-bl {
  position: fixed;
  bottom: -150px;
  left: -150px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ddd6fe 0%, transparent 70%);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}
.att-intro-watermark {
  position: fixed;
  left: -20px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center;
  font-size: 120px;
  font-weight: 900;
  color: rgba(0,0,0,0.03);
  white-space: nowrap;
  letter-spacing: -4px;
  font-family: ${INTER};
  pointer-events: none;
  z-index: 0;
  user-select: none;
}
.att-intro-content {
  position: relative;
  z-index: 1;
}
@media (max-width: 768px) {
  .att-intro-watermark {
    font-size: 72px;
    letter-spacing: -2px;
    left: -40px;
  }
  .att-intro-bg-blur-tr {
    width: 400px;
    height: 400px;
    top: -120px;
    right: -120px;
  }
  .att-intro-bg-blur-bl {
    width: 280px;
    height: 280px;
    bottom: -100px;
    left: -100px;
  }
}
@media (max-width: 640px) {
  .att-intro-title {
    font-size: 36px !important;
    letter-spacing: -1px !important;
  }
}

/* Target select cards — editorial list */
.att-target-card {
  position: relative;
}
.att-target-card::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -1px;
  height: 1px;
  background: ${INK};
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.att-target-card:hover {
  background: transparent !important;
}
.att-target-card:hover::after {
  transform: scaleX(1);
}
.att-target-card:hover .att-target-num {
  color: ${INK};
}
.att-target-card:hover .att-target-arrow {
  color: ${INK};
  transform: translateX(8px);
}
@media (max-width: 768px) {
  .att-target-shell {
    padding: 0 8px;
  }
}
@media (max-width: 640px) {
  .att-target-title {
    font-size: 32px !important;
    letter-spacing: -1px !important;
  }
  .att-target-card {
    padding: 22px 4px !important;
    gap: 20px !important;
  }
  .att-target-num {
    font-size: 22px !important;
    min-width: 36px !important;
  }
}

/* Quiz layout — top bar + space-around body + side rail */
.att-quiz-shell {
  min-height: 100vh;
  min-height: 100svh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.att-quiz-topbar {
  position: relative;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  font-family: ${INTER};
  font-size: 16px;
  font-weight: 600;
}
.att-quiz-body {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 0 24px;
}
.att-quiz-question-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.att-quiz-question {
  font-size: 40px;
  line-height: 1.5;
  font-weight: 700;
  letter-spacing: -0.01em;
  max-width: 800px;
  text-align: center;
  font-family: ${SERIF};
  color: ${INK};
  margin: 0;
  padding: 0 40px;
}
.att-quiz-subtext {
  font-family: ${SERIF};
  font-size: 18px;
  font-style: italic;
  color: #9ca3af;
  text-align: center;
  margin-top: 14px;
  letter-spacing: 0.01em;
  max-width: 600px;
  line-height: 1.55;
  padding: 0 40px;
}
.att-quiz-likert-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.att-quiz-likert-btn {
  width: 72px;
  height: 72px;
  font-size: 22px;
  font-weight: 700;
  border-radius: 50%;
  border-width: 2.5px;
  border-style: solid;
}
.att-quiz-likert-row {
  gap: 16px;
}
.att-quiz-counter {
  font-family: ${INTER};
  font-size: 16px;
  font-weight: 600;
  color: rgba(42,42,42,0.65);
  letter-spacing: 0.02em;
}
.att-quiz-back {
  background: transparent;
  border: none;
  color: rgba(42,42,42,0.7);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${INTER};
  padding: 6px 0;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.18s ease, transform 0.18s ease;
}
.att-quiz-back:hover {
  color: ${INK};
  transform: translateX(-2px);
}
.att-quiz-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  z-index: 0;
}
.att-quiz-content {
  position: relative;
  z-index: 1;
}
.att-side-rail {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.att-side-rail-track {
  position: relative;
  width: 2px;
  background: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.att-side-rail-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: height 0.4s cubic-bezier(0.22,0.9,0.35,1), background 0.3s ease;
}
.att-side-rail-dot {
  position: relative;
  border-radius: 50%;
  transition: all 0.25s ease;
}
.att-side-rail-label {
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  font-family: ${INTER};
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  white-space: nowrap;
  letter-spacing: 0.04em;
}
.att-mobile-progress {
  display: none;
}
@media (max-width: 768px) {
  .att-side-rail {
    display: none;
  }
  .att-mobile-progress {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(42,42,42,0.06);
    z-index: 40;
  }
  .att-mobile-progress-fill {
    height: 100%;
    transition: width 0.4s cubic-bezier(0.22,0.9,0.35,1), background 0.3s ease;
  }
}
@media (max-width: 640px) {
  .att-quiz-topbar {
    padding: 18px 22px;
    font-size: 14px;
  }
  .att-quiz-counter {
    font-size: 14px;
  }
  .att-quiz-back {
    font-size: 14px;
  }
  .att-quiz-question {
    font-size: 24px;
    padding: 0 18px;
  }
  .att-quiz-subtext {
    font-size: 14px;
    margin-top: 10px;
    padding: 0 18px;
  }
  .att-quiz-likert-btn {
    width: 48px;
    height: 48px;
    font-size: 16px;
    border-width: 2px;
  }
  .att-quiz-likert-row {
    gap: 8px;
  }
}
`,
        }}
      />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Per-question abstract background — 5 patterns, very low opacity
// ─────────────────────────────────────────────────────────────

function QuestionBackground({ idx }: { idx: number }): ReactElement {
  const pick = idx % 5;

  if (pick === 0) {
    return (
      <svg
        className="att-quiz-bg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <circle cx="180" cy="180" r="220" fill="none" stroke="#000" strokeWidth="2" />
        <circle cx="640" cy="620" r="280" fill="none" stroke="#000" strokeWidth="2" />
      </svg>
    );
  }

  if (pick === 1) {
    return (
      <svg
        className="att-quiz-bg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          d="M -50 500 C 200 300 400 700 600 400 S 900 200 900 500"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <path
          d="M -50 600 C 200 400 400 800 600 500 S 900 300 900 600"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
          strokeDasharray="4 10"
        />
      </svg>
    );
  }

  if (pick === 2) {
    return (
      <svg
        className="att-quiz-bg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {[40, 100, 170, 250, 340, 440, 550].map((r, i) => (
          <circle
            key={i}
            cx="700"
            cy="120"
            r={r}
            fill="none"
            stroke="#000"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    );
  }

  if (pick === 3) {
    return (
      <svg
        className="att-quiz-bg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {Array.from({ length: 36 }).map((_, i) => {
          const x = (i * 137) % 760 + 20;
          const y = (i * 191) % 760 + 20;
          const r = 4 + ((i * 7) % 10);
          return <circle key={i} cx={x} cy={y} r={r} fill="#000" />;
        })}
      </svg>
    );
  }

  // pick === 4 — vertical waves
  return (
    <svg
      className="att-quiz-bg"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 100 + i * 100;
        return (
          <path
            key={i}
            d={`M ${x} -50 Q ${x + 30} 200 ${x} 400 T ${x} 850`}
            fill="none"
            stroke="#000"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// Intro
// ═══════════════════════════════════════════════════════════

function Intro({
  onStart,
  t,
}: {
  onStart: () => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  return (
    <>
      {/* Background decorations — fill the entire viewport */}
      <div className="att-intro-bg-blur-tr" aria-hidden />
      <div className="att-intro-bg-blur-bl" aria-hidden />
      <div className="att-intro-watermark" aria-hidden>
        Attachment Style Test
      </div>

      {/* Centered content */}
      <div
        className="att-intro-content"
        style={{ maxWidth: 720, width: "100%", textAlign: "center" }}
      >
        <div
          className="att-reveal"
          style={{
            ["--i" as string]: "0",
            color: ACCENT,
            fontSize: 16,
            letterSpacing: "0.32em",
            fontWeight: 700,
            marginBottom: 28,
            fontFamily: INTER,
          }}
        >
          ATTACHMENT · {t("애착 유형 테스트", "ATTACHMENT STYLE TEST")}
        </div>
        <h1
          className="att-reveal att-intro-title"
          style={{
            ["--i" as string]: "1",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-2px",
            lineHeight: 1.15,
            margin: 0,
            color: INK,
            fontFamily: SERIF,
          }}
        >
          {t("당신의 애착 유형은?", "What's Your Attachment Style?")}
        </h1>
        <p
          className="att-reveal"
          style={{
            ["--i" as string]: "2",
            fontSize: 20,
            color: "#6b7280",
            marginTop: 16,
            marginBottom: 0,
            lineHeight: 1.6,
            fontFamily: SERIF,
          }}
        >
          {t(
            "관계에서 나타나는 당신의 패턴을 알아보세요",
            "Discover your pattern in relationships",
          )}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="att-reveal"
          style={{
            ["--i" as string]: "3",
            background: ACCENT,
            color: "#fff",
            border: "none",
            padding: "20px 48px",
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.08em",
            cursor: "pointer",
            fontFamily: SERIF,
            marginTop: 48,
            boxShadow: "0 14px 36px rgba(79,70,229,0.32)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 18px 42px rgba(79,70,229,0.42)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 14px 36px rgba(79,70,229,0.32)";
          }}
        >
          {t("시작하기", "Start")}
        </button>

        <p
          className="att-reveal"
          style={{
            ["--i" as string]: "4",
            marginTop: 20,
            marginBottom: 0,
            fontSize: 15,
            color: "rgba(42,42,42,0.5)",
            letterSpacing: "0.04em",
            fontFamily: INTER,
          }}
        >
          {t(`${TOTAL_QUESTIONS}문항 · 약 5분`, `${TOTAL_QUESTIONS} questions · 5 min`)}
        </p>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Target select
// ═══════════════════════════════════════════════════════════

function TargetSelect({
  onPick,
  t,
  locale,
}: {
  onPick: (id: TargetId) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <>
      {/* Background decoration — same family as intro */}
      <div className="att-intro-bg-blur-tr" aria-hidden />

      <div
        className="att-intro-content att-target-shell"
        style={{
          maxWidth: 680,
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          className="att-reveal"
          style={{
            ["--i" as string]: "0",
            color: SUBTLE,
            fontSize: 11,
            letterSpacing: "0.28em",
            fontWeight: 500,
            marginBottom: 28,
            fontFamily: INTER,
            textTransform: "uppercase",
          }}
        >
          {t("1단계 / 2단계", "Step 1 of 2")}
        </div>
        <h2
          className="att-reveal att-target-title"
          style={{
            ["--i" as string]: "1",
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.18,
            margin: 0,
            marginBottom: 14,
            color: INK,
            fontFamily: SERIF,
          }}
        >
          {t("누구를 떠올리며 답할까요?", "Who are you thinking of?")}
        </h2>
        <p
          className="att-reveal"
          style={{
            ["--i" as string]: "2",
            fontSize: 15,
            color: SUBTLE,
            marginTop: 0,
            marginBottom: 56,
            lineHeight: 1.55,
            fontFamily: INTER,
            letterSpacing: "0.01em",
          }}
        >
          {t(
            "선택한 관계에 맞춰 25문항이 미세하게 달라집니다.",
            "The 25 questions adapt to the relationship you choose.",
          )}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: `1px solid ${RULE}`,
          }}
        >
          {TARGET_ORDER.map((id, i) => {
            const meta = TARGETS[id];
            const text = locale === "ko" ? meta.ko : meta.en;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onPick(id)}
                className="att-reveal att-target-card"
                style={
                  {
                    ["--i" as string]: String(i + 3),
                    background: "transparent",
                    border: "none",
                    borderBottom: `1px solid ${RULE}`,
                    color: INK,
                    padding: "28px 4px",
                    cursor: "pointer",
                    fontFamily: SERIF,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 28,
                  } as React.CSSProperties
                }
              >
                <span
                  className="att-target-num"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: 26,
                    color: SUBTLE,
                    lineHeight: 1,
                    minWidth: 44,
                    flex: "0 0 auto",
                    transition: "color 0.3s ease",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.25,
                    }}
                  >
                    {text.title}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: SUBTLE,
                      lineHeight: 1.5,
                      fontFamily: INTER,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {text.subtitle}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="att-target-arrow"
                  style={{
                    flex: "0 0 auto",
                    color: SUBTLE,
                    fontSize: 18,
                    fontFamily: INTER,
                    transition: "transform 0.35s ease, color 0.3s ease",
                  }}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Quiz — single question, 7-point Likert with auto-advance
// ═══════════════════════════════════════════════════════════

function QuizView({
  questionIdx,
  total,
  target,
  onAnswer,
  onBack,
  t,
  locale,
}: {
  questionIdx: number;
  total: number;
  target: TargetId;
  onAnswer: (value: number) => void;
  onBack: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const question = QUESTIONS[questionIdx];
  if (!question) return <></>;
  const text = applyTarget(question, target, locale);
  const subtext = applyTargetToSubtext(question, target, locale);
  const endpoints = locale === "ko" ? LIKERT_ENDPOINT_KO : LIKERT_ENDPOINT_EN;
  const progress = (questionIdx + 1) / total;

  const currentDim = question.dim;

  return (
    <div className="att-quiz-shell">
      {/* Mobile-only top progress bar */}
      <MobileProgressBar value={progress} dim={currentDim} />

      {/* Desktop-only right vertical rail */}
      <SideRail
        currentIdx={questionIdx}
        total={total}
        currentDim={currentDim}
      />

      <QuestionBackground idx={questionIdx} />

      {/* Top bar — back (left) + counter (right) */}
      <div className="att-quiz-topbar">
        <button
          type="button"
          onClick={onBack}
          className="att-quiz-back"
          aria-label={t("이전 질문", "Previous question")}
        >
          <span aria-hidden>←</span>
          <span>{t("이전", "Back")}</span>
        </button>
      </div>

      {/* Body — question + likert with space-around */}
      <div className="att-quiz-body">
        <div className="att-quiz-question-area">
          <h2 key={`q-${questionIdx}`} className="att-quiz-question att-question">
            {text}
          </h2>
          <p key={`s-${questionIdx}`} className="att-quiz-subtext att-question">
            {subtext}
          </p>
        </div>

        <div className="att-quiz-likert-area att-quiz-content">
          <LikertScale
            key={`scale-${questionIdx}`}
            onAnswer={onAnswer}
            endpoints={endpoints}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Right-side vertical progress rail (desktop) + mobile top bar
// ═══════════════════════════════════════════════════════════

const DIM_COLORS: Record<string, string> = {
  anxiety: "#f43f5e",
  avoidance: "#3b82f6",
  dependency: "#8b5cf6",
  trust: "#10b981",
};

function SideRail({
  currentIdx,
  total,
  currentDim,
}: {
  currentIdx: number;
  total: number;
  currentDim: string;
}): ReactElement {
  const currentColor = DIM_COLORS[currentDim] ?? ACCENT;
  const dotSpacing = 20;
  const trackHeight = (total - 1) * dotSpacing;
  const fillHeight = total > 1 ? (currentIdx / (total - 1)) * trackHeight : 0;

  return (
    <div className="att-side-rail" aria-hidden>
      <div
        className="att-side-rail-track"
        style={{ height: trackHeight }}
      >
        <div
          className="att-side-rail-fill"
          style={{ height: fillHeight, background: currentColor }}
        />
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIdx;
          const isDone = i < currentIdx;
          const size = isCurrent ? 14 : 10;
          const dotColor = isCurrent
            ? currentColor
            : isDone
              ? "#6b7280"
              : "#d1d5db";
          return (
            <div
              key={i}
              className="att-side-rail-dot"
              style={{
                width: size,
                height: size,
                background: dotColor,
                marginTop: i === 0 ? 0 : dotSpacing - size,
                boxShadow: isCurrent
                  ? `0 0 0 4px ${currentColor}22`
                  : undefined,
              }}
            >
              {isCurrent && (
                <span className="att-side-rail-label tabular-nums">
                  {currentIdx + 1} / {total}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileProgressBar({
  value,
  dim,
}: {
  value: number;
  dim: string;
}): ReactElement {
  const color = DIM_COLORS[dim] ?? ACCENT;
  return (
    <div className="att-mobile-progress" aria-hidden>
      <div
        className="att-mobile-progress-fill"
        style={{
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          background: color,
        }}
      />
    </div>
  );
}

function LikertScale({
  onAnswer,
  endpoints,
}: {
  onAnswer: (value: number) => void;
  endpoints: string[];
}): ReactElement {
  const [pendingValue, setPendingValue] = useState<number | null>(null);

  const handleClick = useCallback(
    (value: number) => {
      if (pendingValue !== null) return;
      setPendingValue(value);
      window.setTimeout(() => onAnswer(value), 300);
    },
    [pendingValue, onAnswer],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        width: "100%",
        padding: "0 16px",
      }}
    >
      <div
        className="att-quiz-likert-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 600,
        }}
      >
        {Array.from({ length: LIKERT_MAX }, (_, i) => {
          const value = i + 1;
          const color = LIKERT_COLORS[i];
          const isSelected = pendingValue === value;
          const dimmed = pendingValue !== null && !isSelected;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              aria-label={`${value}`}
              className={`att-quiz-likert-btn${isSelected ? " att-dot-selected" : ""}`}
              style={{
                minWidth: 0,
                borderColor: color,
                background: isSelected ? color : "transparent",
                cursor: pendingValue !== null ? "default" : "pointer",
                padding: 0,
                opacity: dimmed ? 0.3 : 1,
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                transition:
                  "background 0.2s ease, opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: isSelected
                  ? `0 4px 16px ${color}66`
                  : "0 2px 6px rgba(0,0,0,0.04)",
                fontFamily: INTER,
                color: isSelected ? "#fff" : color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                if (pendingValue !== null) return;
                e.currentTarget.style.background = `${color}22`;
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                if (pendingValue !== null) return;
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {value}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 540,
          fontSize: 15,
          color: SUBTLE,
          fontFamily: SERIF,
          letterSpacing: "0.01em",
        }}
      >
        <span>{endpoints[0]}</span>
        <span>{endpoints[1]}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Result
// ═══════════════════════════════════════════════════════════

function ResultView({
  typeId,
  target,
  scores,
  stats,
  mode,
  onModeChange,
  onRestart,
  onShare,
  copied,
  partnerType,
  partnerName,
  showPartnerModal,
  onPartnerTypeChange,
  onPartnerNameChange,
  onOpenPartnerModal,
  onClosePartnerModal,
  t,
  locale,
}: {
  typeId: AttachmentTypeId;
  target: TargetId;
  scores: Scores;
  stats: Stats;
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
  partnerType: AttachmentTypeId | null;
  partnerName: string;
  showPartnerModal: boolean;
  onPartnerTypeChange: (t: AttachmentTypeId | null) => void;
  onPartnerNameChange: (n: string) => void;
  onOpenPartnerModal: () => void;
  onClosePartnerModal: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const type = TYPES[typeId];
  const theme = TYPE_THEME[typeId];
  const targetMeta = TARGETS[target];
  const targetText = locale === "ko" ? targetMeta.ko : targetMeta.en;
  const txt = locale === "ko" ? type.ko : type.en;
  const match = computeMatch(scores, typeId);

  const myCount = stats.byType[typeId] ?? 0;
  const total = Math.max(1, stats.total);
  const samePct = Math.round((myCount / total) * 100);

  let staggerIdx = 0;
  const stagger = (): React.CSSProperties => ({
    ["--i" as string]: String(staggerIdx++),
  });

  return (
    <div style={{ maxWidth: 560, width: "100%" }}>
      {/* Eyebrow — relation context */}
      <div
        className="att-reveal"
        style={{
          ...stagger(),
          textAlign: "center",
          color: theme.name,
          fontSize: 13,
          letterSpacing: "0.3em",
          fontWeight: 700,
          marginBottom: 8,
          fontFamily: INTER,
          opacity: 0.7,
        }}
      >
        {locale === "ko"
          ? `${targetMeta.emoji} ${targetText.relation.toUpperCase()}`
          : `${targetMeta.emoji} ${targetText.relation.toUpperCase()}`}
      </div>

      {/* SVG visual — drops in */}
      <div
        className="att-drop"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <TypeVisual typeId={typeId} />
      </div>

      {/* Type name + EN subtitle */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: theme.name,
            margin: 0,
            minHeight: 56,
          }}
        >
          <TypingText text={txt.name} startDelay={500} speedMs={75} />
        </h1>
        <div
          className="att-reveal"
          style={{
            ...stagger(),
            marginTop: 14,
            fontFamily: INTER,
            fontSize: 16,
            fontWeight: 300,
            letterSpacing: "0.25em",
            opacity: 0.5,
            color: theme.name,
            textTransform: "uppercase",
          }}
        >
          {locale === "ko" ? type.en.name : type.ko.name}
        </div>
      </div>

      {/* Match badge */}
      <div
        className="att-reveal"
        style={{
          ...stagger(),
          display: "flex",
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        <div
          className="tabular-nums"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            background: theme.ringBg,
            border: `1px solid ${theme.ringBorder}`,
            borderRadius: 999,
            color: theme.name,
            fontFamily: INTER,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.16em",
          }}
        >
          <span style={{ textTransform: "uppercase" }}>
            {t("매치율", "Match")}
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              background: theme.accent,
              opacity: 0.6,
            }}
          />
          <span>{match}%</span>
        </div>
      </div>

      {/* Mode toggle pill */}
      <div
        className="att-reveal"
        style={{
          ...stagger(),
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <ModeTogglePill mode={mode} onChange={onModeChange} t={t} />
      </div>

      {/* Mode body */}
      {mode === "serious" ? (
        <div className="att-fade" key="serious">
          <GlassSection
            label={t("이런 사람이에요", "WHO YOU ARE")}
            theme={theme}
            stagger={stagger}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 15,
                lineHeight: 1.9,
                color: "#374151",
                whiteSpace: "pre-line",
              }}
            >
              {txt.serious}
            </div>
          </GlassSection>

          <GlassSection
            label={t("강점", "STRENGTHS")}
            theme={theme}
            stagger={stagger}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 10,
              }}
            >
              {txt.strengths.map((s, i) => (
                <div
                  key={i}
                  className="att-strength-card"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    border: `1px solid ${theme.ringBorder}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "default",
                  }}
                >
                  <span
                    style={{
                      flex: "0 0 auto",
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: theme.accent,
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: INTER,
                      boxShadow: `0 4px 10px ${theme.accent}44`,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "#374151",
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </GlassSection>

          <GlassSection
            label={t("주의할 점", "WATCH OUT FOR")}
            theme={theme}
            stagger={stagger}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 15,
                lineHeight: 1.85,
                color: "#374151",
              }}
            >
              {txt.watchOut}
            </div>
          </GlassSection>
        </div>
      ) : (
        <div className="att-fade" key="fun">
          <div
            className="att-reveal"
            style={{
              ...stagger(),
              ...glassCard,
              padding: "30px 26px",
              fontFamily: SERIF,
              fontSize: 18,
              lineHeight: 1.8,
              color: theme.name,
              fontWeight: 500,
              whiteSpace: "pre-line",
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            {txt.fun}
          </div>
          <div
            className="att-reveal"
            style={{
              ...stagger(),
              textAlign: "center",
              fontSize: 15,
              color: SUBTLE,
              fontStyle: "italic",
              marginBottom: 22,
              fontFamily: SERIF,
            }}
          >
            {t(
              "공유하고 싶으면 아래 버튼을 눌러주세요",
              "Tap share below if this is too accurate",
            )}
          </div>
        </div>
      )}

      {/* Quadrant chart */}
      <GlassSection
        label={t("애착 지도", "ATTACHMENT MAP")}
        theme={theme}
        stagger={stagger}
      >
        <QuadrantChart scores={scores} typeId={typeId} t={t} locale={locale} />
      </GlassSection>

      {/* Distribution */}
      {stats.total > 0 && (
        <GlassSection
          label={t("이 기기의 유형 분포", "TYPE DISTRIBUTION")}
          theme={theme}
          stagger={stagger}
        >
          <Distribution stats={stats} myType={typeId} locale={locale} />
          <div
            style={{
              textAlign: "center",
              fontSize: 14,
              color: SUBTLE,
              marginTop: 14,
              fontFamily: INTER,
            }}
          >
            {t(
              `${stats.total}회 플레이 중 ${samePct}%가 같은 유형`,
              `${samePct}% of ${stats.total} plays got the same type`,
            )}
          </div>
        </GlassSection>
      )}

      {/* Compatibility */}
      <GlassSection
        label={t("이 유형과의 궁합", "COMPATIBILITY")}
        theme={theme}
        stagger={stagger}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TYPE_ORDER.map((otherId) => {
            const other = TYPES[otherId];
            const compat = getCompatibility(typeId, otherId);
            const otherName = locale === "ko" ? other.ko.name : other.en.name;
            const otherTheme = TYPE_THEME[otherId];
            return (
              <div
                key={otherId}
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: `1px solid ${theme.ringBorder}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#374151",
                      fontFamily: SERIF,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: otherTheme.accent,
                      }}
                    />
                    <span>{otherName}</span>
                  </div>
                  <Stars rating={compat.rating} />
                </div>
                <div
                  style={{
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: SUBTLE,
                    fontFamily: SERIF,
                  }}
                >
                  {locale === "ko" ? compat.ko : compat.en}
                </div>
              </div>
            );
          })}
        </div>
      </GlassSection>

      {/* Big share button */}
      <div
        className="att-reveal"
        style={{
          ...stagger(),
          marginTop: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button
          type="button"
          onClick={onShare}
          style={{
            background: theme.accent,
            color: "#fff",
            border: "none",
            padding: "16px 32px",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: SERIF,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            boxShadow: `0 12px 30px ${theme.accent}55`,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 16px 36px ${theme.accent}66`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 12px 30px ${theme.accent}55`;
          }}
        >
          <ShareUpIcon />
          <span>{copied ? t("✓ 복사됨", "✓ Copied") : t("결과 공유하기", "Share result")}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          style={{
            background: "transparent",
            border: "none",
            color: SUBTLE,
            fontSize: 15,
            cursor: "pointer",
            fontFamily: SERIF,
            padding: "4px 8px",
            marginTop: 4,
          }}
        >
          ↺ {t("다시 하기", "Try Again")}
        </button>
      </div>

      {showPartnerModal && (
        <PartnerModal
          myTypeId={typeId}
          theme={theme}
          target={target}
          partnerType={partnerType}
          partnerName={partnerName}
          onPartnerTypeChange={onPartnerTypeChange}
          onPartnerNameChange={onPartnerNameChange}
          onClose={onClosePartnerModal}
          t={t}
          locale={locale}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Type-specific abstract SVG visuals
// ═══════════════════════════════════════════════════════════

function TypeVisual({ typeId }: { typeId: AttachmentTypeId }): ReactElement {
  const size = 160;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 200 200",
  };
  const className = "att-spin";

  if (typeId === "secure") {
    return (
      <svg {...common} className={className} aria-hidden>
        <ellipse
          cx="102"
          cy="100"
          rx="25"
          ry="40"
          fill="#10b981"
          opacity="0.2"
        />
        <circle
          cx="90"
          cy="100"
          r="60"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          opacity="0.6"
        />
        <circle
          cx="115"
          cy="100"
          r="60"
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          opacity="0.4"
        />
      </svg>
    );
  }

  if (typeId === "anxious") {
    return (
      <svg {...common} className={className} aria-hidden>
        <circle
          cx="80"
          cy="100"
          r="55"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3"
          opacity="0.7"
        />
        <circle
          cx="140"
          cy="100"
          r="40"
          fill="none"
          stroke="#fb7185"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d="M 130 80 Q 105 100 130 120"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (typeId === "avoidant") {
    return (
      <svg {...common} className={className} aria-hidden>
        <circle
          cx="75"
          cy="100"
          r="55"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          opacity="0.6"
        />
        <circle
          cx="145"
          cy="100"
          r="55"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          opacity="0.4"
        />
      </svg>
    );
  }

  // disorganized
  return (
    <svg {...common} className={className} aria-hidden>
      <circle
        cx="100"
        cy="100"
        r="50"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        opacity="0.5"
        strokeDasharray="8 4"
      />
      <circle
        cx="100"
        cy="100"
        r="30"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2"
        opacity="0.4"
        strokeDasharray="4 8"
      />
      <circle cx="100" cy="75" r="8" fill="#8b5cf6" opacity="0.7" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// Typing text — reveals character-by-character with caret
// ═══════════════════════════════════════════════════════════

function TypingText({
  text,
  startDelay = 200,
  speedMs = 70,
}: {
  text: string;
  startDelay?: number;
  speedMs?: number;
}): ReactElement {
  const [revealed, setRevealed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRevealed("");
    setDone(false);
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    const startTimer = window.setTimeout(() => {
      if (cancelled) return;
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setRevealed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speedMs);
    }, startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, startDelay, speedMs]);

  return (
    <>
      {revealed}
      {!done && (
        <span
          aria-hidden
          className="att-caret"
          style={{
            background: "currentColor",
            height: "0.85em",
            verticalAlign: "baseline",
          }}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Mode toggle (pill)
// ═══════════════════════════════════════════════════════════

function ModeTogglePill({
  mode,
  onChange,
  t,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const items: { id: Mode; label: string }[] = [
    { id: "serious", label: t("😊 진지 모드", "😊 Serious") },
    { id: "fun", label: t("😄 재미 모드", "😄 Fun") },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        background: "rgba(0,0,0,0.05)",
        borderRadius: 999,
        padding: 4,
        gap: 0,
      }}
    >
      {items.map((item) => {
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            style={{
              padding: "8px 18px",
              border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? INK : SUBTLE,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: SERIF,
              boxShadow: active ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Glass section — header (dot + small caps label) + glass card
// ═══════════════════════════════════════════════════════════

function GlassSection({
  label,
  children,
  theme,
  stagger,
}: {
  label: string;
  children: React.ReactNode;
  theme: Theme;
  stagger: () => React.CSSProperties;
}): ReactElement {
  return (
    <>
      <div
        className="att-reveal"
        style={{
          ...stagger(),
          display: "flex",
          alignItems: "center",
          gap: 10,
          margin: "26px 6px 12px",
        }}
      >
        <span
          aria-hidden
          style={{
            flex: "0 0 auto",
            width: 8,
            height: 8,
            borderRadius: 999,
            background: theme.accent,
            boxShadow: `0 0 0 4px ${theme.ringBg}`,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.3em",
            color: theme.name,
            textTransform: "uppercase",
            fontFamily: INTER,
            opacity: 0.85,
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="att-reveal"
        style={{
          ...stagger(),
          ...glassCard,
          padding: "22px 22px",
        }}
      >
        {children}
      </div>
    </>
  );
}

function Stars({ rating }: { rating: number }): ReactElement {
  return (
    <div
      style={{
        fontSize: 14,
        letterSpacing: "1px",
        fontFamily: INTER,
        color: "#d8546b",
        flex: "0 0 auto",
      }}
    >
      {"★".repeat(rating)}
      <span style={{ color: "rgba(216,84,107,0.25)" }}>
        {"★".repeat(5 - rating)}
      </span>
    </div>
  );
}

function ShareUpIcon(): ReactElement {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 18V5" />
      <path d="m6 11 6-6 6 6" />
      <path d="M5 21h14" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// Quadrant chart — 2 axes, anxiety (Y) × avoidance (X)
// ═══════════════════════════════════════════════════════════

function QuadrantChart({
  scores,
  typeId,
  t,
  locale,
}: {
  scores: Scores;
  typeId: AttachmentTypeId;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const size = 240;
  const pad = 32;
  const span = LIKERT_MAX - 1; // 6
  const inner = size - pad * 2; // 176
  const cx = size / 2;
  const cy = size / 2;

  const xAt = (avoidance: number) => pad + ((avoidance - 1) / span) * inner;
  const yAt = (anxiety: number) =>
    pad + ((LIKERT_MAX - anxiety) / span) * inner;

  const userX = xAt(scores.avoidance);
  const userY = yAt(scores.anxiety);

  const corners: {
    id: AttachmentTypeId;
    x: number;
    y: number;
    align: "start" | "end";
    vAlign: "top" | "bottom";
  }[] = [
    { id: "secure", x: xAt(1), y: yAt(1), align: "start", vAlign: "bottom" },
    { id: "anxious", x: xAt(1), y: yAt(LIKERT_MAX), align: "start", vAlign: "top" },
    {
      id: "avoidant",
      x: xAt(LIKERT_MAX),
      y: yAt(1),
      align: "end",
      vAlign: "bottom",
    },
    {
      id: "disorganized",
      x: xAt(LIKERT_MAX),
      y: yAt(LIKERT_MAX),
      align: "end",
      vAlign: "top",
    },
  ];

  const myTheme = TYPE_THEME[typeId];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          background: "rgba(255,255,255,0.55)",
          border: `1px solid ${myTheme.ringBorder}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* crosshair */}
          <line
            x1={pad}
            y1={cy}
            x2={size - pad}
            y2={cy}
            stroke="rgba(42,42,42,0.15)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <line
            x1={cx}
            y1={pad}
            x2={cx}
            y2={size - pad}
            stroke="rgba(42,42,42,0.15)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />

          {/* lines from user to each corner */}
          {corners.map((c) => (
            <line
              key={`line-${c.id}`}
              x1={userX}
              y1={userY}
              x2={c.x}
              y2={c.y}
              stroke={c.id === typeId ? myTheme.accent : "rgba(42,42,42,0.15)"}
              strokeWidth={c.id === typeId ? 1.5 : 1}
              strokeDasharray={c.id === typeId ? "0" : "2 4"}
              opacity={c.id === typeId ? 0.6 : 0.5}
            />
          ))}

          {/* corner type dots */}
          {corners.map((c) => (
            <circle
              key={`dot-${c.id}`}
              cx={c.x}
              cy={c.y}
              r={c.id === typeId ? 6 : 4}
              fill={c.id === typeId ? TYPE_THEME[c.id].accent : "rgba(42,42,42,0.35)"}
            />
          ))}

          {/* user position — outer ring + filled dot */}
          <circle
            cx={userX}
            cy={userY}
            r={14}
            fill={myTheme.accent}
            opacity={0.18}
          />
          <circle
            cx={userX}
            cy={userY}
            r={7}
            fill={myTheme.accent}
            stroke="#fff"
            strokeWidth={2}
          />
        </svg>

        {/* corner labels (HTML overlays for proper text rendering) */}
        {corners.map((c) => {
          const ct = TYPES[c.id];
          const name = locale === "ko" ? ct.ko.name : ct.en.name;
          const isMe = c.id === typeId;
          const offsetX = c.align === "start" ? 6 : -6;
          const offsetY = c.vAlign === "top" ? 8 : -8;
          return (
            <div
              key={`label-${c.id}`}
              style={{
                position: "absolute",
                left: c.x + offsetX,
                top: c.y + offsetY,
                transform: `translate(${
                  c.align === "end" ? "-100%" : "0%"
                }, ${c.vAlign === "bottom" ? "-100%" : "0%"})`,
                fontFamily: SERIF,
                fontSize: 13,
                fontWeight: isMe ? 700 : 500,
                color: isMe ? TYPE_THEME[c.id].name : "rgba(42,42,42,0.55)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {name}
            </div>
          );
        })}

        {/* axis labels — outer */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 13,
            color: "rgba(42,42,42,0.45)",
            fontFamily: INTER,
            letterSpacing: "0.2em",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          ↑ {t("불안", "Anxiety")}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 12,
            fontSize: 13,
            color: "rgba(42,42,42,0.45)",
            fontFamily: INTER,
            letterSpacing: "0.2em",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {t("회피", "Avoidance")} →
        </div>
      </div>

      <div
        style={{
          fontSize: 14,
          color: SUBTLE,
          fontFamily: SERIF,
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.55,
        }}
      >
        {t(
          "당신의 위치는 색칠된 점이에요. 가까운 코너의 유형에 가까울수록 그 패턴이 강해요.",
          "Your dot shows your position. The closer to a corner, the stronger that pattern.",
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Distribution
// ═══════════════════════════════════════════════════════════

function Distribution({
  stats,
  myType,
  locale,
}: {
  stats: Stats;
  myType: AttachmentTypeId;
  locale: "ko" | "en";
}): ReactElement {
  const total = Math.max(1, stats.total);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {TYPE_ORDER.map((id) => {
        const type = TYPES[id];
        const theme = TYPE_THEME[id];
        const count = stats.byType[id] ?? 0;
        const pct = Math.round((count / total) * 100);
        const isMe = id === myType;
        return (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: SERIF,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                width: 86,
                fontSize: 15,
                fontWeight: isMe ? 700 : 500,
                color: isMe ? theme.name : "#374151",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: theme.accent,
                }}
              />
              <span>{locale === "ko" ? type.ko.name : type.en.name}</span>
            </div>
            <div
              style={{
                flex: 1,
                height: 8,
                background: "rgba(42,42,42,0.06)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: theme.accent,
                  opacity: isMe ? 1 : 0.45,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <div
              className="tabular-nums"
              style={{
                flex: "0 0 auto",
                width: 36,
                textAlign: "right",
                fontSize: 15,
                fontWeight: 600,
                color: isMe ? theme.name : SUBTLE,
                fontFamily: INTER,
              }}
            >
              {pct}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Partner modal
// ═══════════════════════════════════════════════════════════

function PartnerModal({
  myTypeId,
  theme,
  target,
  partnerType,
  partnerName,
  onPartnerTypeChange,
  onPartnerNameChange,
  onClose,
  t,
  locale,
}: {
  myTypeId: AttachmentTypeId;
  theme: Theme;
  target: TargetId;
  partnerType: AttachmentTypeId | null;
  partnerName: string;
  onPartnerTypeChange: (t: AttachmentTypeId | null) => void;
  onPartnerNameChange: (n: string) => void;
  onClose: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const me = TYPES[myTypeId];
  const targetMeta = TARGETS[target];
  const targetNoun =
    locale === "ko" ? targetMeta.ko.noun : targetMeta.en.noun;

  return (
    <div
      className="att-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,20,30,0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        className="att-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...glassCard,
          background: "rgba(255,255,255,0.95)",
          maxWidth: 440,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "24px 22px",
          position: "relative",
        }}
      >
        <button
          type="button"
          aria-label={t("닫기", "Close")}
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "none",
            background: "rgba(0,0,0,0.05)",
            color: SUBTLE,
            fontSize: 18,
            cursor: "pointer",
            fontFamily: INTER,
          }}
        >
          ×
        </button>

        <div
          style={{
            color: theme.name,
            fontSize: 13,
            letterSpacing: "0.3em",
            fontWeight: 700,
            fontFamily: INTER,
            opacity: 0.7,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {t("궁합 확인", "Check compatibility")}
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: INK,
            marginBottom: 18,
          }}
        >
          {locale === "ko"
            ? `${targetNoun}의 유형을 골라주세요`
            : `Pick your ${targetNoun}'s type`}
        </h3>

        <label
          style={{
            display: "block",
            fontSize: 13,
            letterSpacing: "0.2em",
            fontWeight: 700,
            color: SUBTLE,
            marginBottom: 8,
            fontFamily: INTER,
            textTransform: "uppercase",
          }}
        >
          {locale === "ko"
            ? `${targetNoun} 이름 (선택)`
            : `${targetNoun}'s name (optional)`}
        </label>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => onPartnerNameChange(e.target.value.slice(0, 20))}
          placeholder={t("예: 민수", "e.g. Alex")}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            border: `1px solid ${RULE}`,
            borderRadius: 12,
            background: "rgba(255,255,255,0.7)",
            color: INK,
            fontFamily: SERIF,
            boxSizing: "border-box",
            marginBottom: 18,
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.accent;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = RULE;
          }}
        />

        <label
          style={{
            display: "block",
            fontSize: 13,
            letterSpacing: "0.2em",
            fontWeight: 700,
            color: SUBTLE,
            marginBottom: 8,
            fontFamily: INTER,
            textTransform: "uppercase",
          }}
        >
          {locale === "ko" ? `${targetNoun} 유형` : `${targetNoun}'s type`}
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {TYPE_ORDER.map((id) => {
            const tp = TYPES[id];
            const tt = TYPE_THEME[id];
            const active = partnerType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onPartnerTypeChange(id)}
                style={{
                  padding: "14px 10px",
                  border: `1.5px solid ${active ? tt.accent : RULE}`,
                  background: active ? tt.ringBg : "transparent",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontFamily: SERIF,
                  fontSize: 16,
                  fontWeight: active ? 700 : 500,
                  color: active ? tt.name : INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: tt.accent,
                  }}
                />
                <span>{locale === "ko" ? tp.ko.name : tp.en.name}</span>
              </button>
            );
          })}
        </div>

        {partnerType && (
          <PartnerCompatResult
            myType={myTypeId}
            partnerType={partnerType}
            partnerName={partnerName}
            target={target}
            t={t}
            locale={locale}
          />
        )}

        <div
          style={{
            marginTop: 18,
            fontSize: 13,
            color: SUBTLE,
            fontFamily: INTER,
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          {locale === "ko"
            ? `당신은 ${me.ko.name} ${me.emoji}`
            : `You are ${me.en.name} ${me.emoji}`}
        </div>
      </div>
    </div>
  );
}

function PartnerCompatResult({
  myType,
  partnerType,
  partnerName,
  target,
  t,
  locale,
}: {
  myType: AttachmentTypeId;
  partnerType: AttachmentTypeId;
  partnerName: string;
  target: TargetId;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const partner = TYPES[partnerType];
  const partnerTheme = TYPE_THEME[partnerType];
  const compat = getCompatibility(myType, partnerType);
  const targetMeta = TARGETS[target];
  const targetNoun =
    locale === "ko" ? targetMeta.ko.noun : targetMeta.en.noun;
  const partnerLabel = partnerName.trim() || targetNoun;
  const partnerTypeName =
    locale === "ko" ? partner.ko.name : partner.en.name;

  return (
    <div
      className="att-fade"
      style={{
        background: partnerTheme.ringBg,
        border: `1px solid ${partnerTheme.ringBorder}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: partnerTheme.name,
            fontFamily: SERIF,
            lineHeight: 1.4,
          }}
        >
          {partnerLabel} · {partnerTypeName} {partner.emoji}
        </div>
        <Stars rating={compat.rating} />
      </div>
      <div
        style={{
          fontSize: 16,
          lineHeight: 1.65,
          color: "#374151",
          fontFamily: SERIF,
        }}
      >
        {locale === "ko" ? compat.ko : compat.en}
      </div>
      <div
        style={{
          fontSize: 13,
          color: SUBTLE,
          fontFamily: INTER,
          letterSpacing: "0.06em",
          marginTop: 2,
        }}
      >
        {t("당신 × 상대", "You × them").toUpperCase()}
      </div>
    </div>
  );
}
