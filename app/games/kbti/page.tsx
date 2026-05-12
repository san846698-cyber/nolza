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
import { ShareCard } from "../../components/ShareCard";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  buildQuestionList,
  pickResult,
  TOTAL_QUESTIONS,
  TOTAL_TYPES,
  type AnswerLetter,
  type MatchResult,
} from "@/lib/kbti";

const BG = "#0d0d0d";
const PAPER = "#1a1a1a";
const PAPER_2 = "#222";
const ACCENT = "#C60C30"; // Korean flag red
const ACCENT_DIM = "rgba(198,12,48,0.65)";
const INK = "#f4f4f4";
const SUBTLE = "rgba(244,244,244,0.55)";
const RULE = "rgba(255,255,255,0.08)";
const SANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";

type Phase = "intro" | "quiz" | "result";

const STATS_KEY = "nolza_kbti_stats_v3";

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

export default function KbtiPage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerLetter[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [stats, setStats] = useState<Stats>(defaultStats());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [phase]);

  const questions = useMemo(() => buildQuestionList(), []);

  const handleStart = useCallback(() => {
    setAnswers([]);
    setQuestionIdx(0);
    setResult(null);
    setPhase("quiz");
  }, []);

  const handleAnswer = useCallback(
    (letter: AnswerLetter) => {
      const newAnswers = [...answers, letter];
      setAnswers(newAnswers);
      if (newAnswers.length >= questions.length) {
        const r = pickResult(newAnswers);
        setResult(r);
        setStats((prev) => saveStat(prev, r.type.id));
        setPhase("result");
      } else {
        setQuestionIdx((i) => i + 1);
      }
    },
    [answers, questions.length],
  );

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setQuestionIdx(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const tk = result.type;
    const text = t(
      `나의 KBTI: ${tk.ko.code} - ${tk.ko.title}\n'${tk.ko.oneliner}'\n너도 해봐 → nolza.fun/games/kbti`,
      `My KBTI: ${tk.en.code} - ${tk.en.title}\n'${tk.en.oneliner}'\nTry it → nolza.fun/games/kbti`,
    );
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result, t]);

  return (
    <main
      style={{
        minHeight: "100svh",
        background: BG,
        color: INK,
        fontFamily: SANS,
        position: "relative",
        paddingBottom: 100,
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
          color: "rgba(244,244,244,0.6)",
          textDecoration: "none",
          background: "rgba(13,13,13,0.7)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${RULE}`,
        }}
      >
        ←
      </Link>

      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "result" ? "flex-start" : "center",
          padding: "70px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        {phase === "intro" && <Intro onStart={handleStart} t={t} />}

        {phase === "quiz" && (
          <QuizView
            questionIdx={questionIdx}
            total={questions.length}
            question={questions[questionIdx]}
            onAnswer={handleAnswer}
            t={t}
            locale={locale}
          />
        )}

        {phase === "result" && result && (
          <ResultView
            result={result}
            stats={stats}
            onRestart={handleRestart}
            onShare={handleShare}
            copied={copied}
            t={t}
            locale={locale}
          />
        )}
      </div>

      <AdMobileSticky />

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes kbtiReveal {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.kbti-reveal {
  opacity: 0;
  animation: kbtiReveal 0.45s ease-out forwards;
  animation-delay: calc(var(--i, 0) * 90ms);
}
@keyframes chimaekTwinkle {
  0%, 100% { opacity: 0.85; transform: scale(1) rotate(-4deg); }
  50%      { opacity: 1;    transform: scale(1.18) rotate(4deg); }
}
.chimaek-twinkle {
  display: inline-block;
  animation: chimaekTwinkle 1.6s ease-in-out infinite;
  filter: drop-shadow(0 0 14px rgba(255,200,80,0.55));
}
`,
        }}
      />
    </main>
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
    <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
      <div
        className="kbti-reveal"
        style={{
          ["--i" as string]: "0",
          color: ACCENT,
          fontSize: 13,
          letterSpacing: "0.32em",
          fontWeight: 700,
          marginBottom: 18,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        KBTI · {t("한국형 성격 테스트", "KOREAN PERSONALITY TEST")}
      </div>
      <h1
        className="kbti-reveal"
        style={{
          ["--i" as string]: "1",
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.12,
          marginBottom: 16,
        }}
      >
        {t("MBTI는 질렸다.", "Tired of MBTI?")}
        <br />
        <span style={{ color: ACCENT }}>
          {t("KBTI가 왔다.", "KBTI is here.")}
        </span>
      </h1>
      <p
        className="kbti-reveal"
        style={{
          ["--i" as string]: "2",
          fontSize: 16,
          color: SUBTLE,
          marginBottom: 38,
          letterSpacing: "0.02em",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {t(
          `${TOTAL_QUESTIONS}문항 · ${TOTAL_TYPES}가지 유형 · 약 3분`,
          `${TOTAL_QUESTIONS} questions · ${TOTAL_TYPES} types · 3 min`,
        )}
      </p>

      <button
        type="button"
        onClick={onStart}
        className="kbti-reveal"
        style={{
          ["--i" as string]: "3",
          background: ACCENT,
          color: "#fff",
          border: "none",
          padding: "16px 40px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.14em",
          cursor: "pointer",
          fontFamily: SANS,
          boxShadow: `0 12px 32px rgba(198,12,48,0.42)`,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 16px 38px rgba(198,12,48,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(198,12,48,0.42)";
        }}
      >
        {t("시작하기", "Start")}
      </button>

      <p
        className="kbti-reveal"
        style={{
          ["--i" as string]: "4",
          marginTop: 28,
          fontSize: 14,
          color: "rgba(244,244,244,0.4)",
          lineHeight: 1.7,
        }}
      >
        {t(
          "결과 보는 순간 \"이거 나잖아 ㅋㅋㅋ\"",
          "The moment you see your result: \"That's literally me lol.\"",
        )}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Quiz
// ═══════════════════════════════════════════════════════════

function QuizView({
  questionIdx,
  total,
  question,
  onAnswer,
  t,
  locale,
}: {
  questionIdx: number;
  total: number;
  question: ReturnType<typeof buildQuestionList>[number] | undefined;
  onAnswer: (letter: AnswerLetter) => void;
  t: (ko: string, en: string) => string;
  locale: SimpleLocale;
}): ReactElement {
  if (!question) return <></>;
  const progress = ((questionIdx + 1) / total) * 100;

  return (
    <div style={{ maxWidth: 540, width: "100%" }}>
      {/* Progress */}
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            letterSpacing: "0.18em",
            color: SUBTLE,
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span>KBTI</span>
          <span className="tabular-nums">
            {questionIdx + 1} / {total}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 3,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: ACCENT,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2
        key={questionIdx}
        className="kbti-reveal"
        style={
          {
            ["--i" as string]: "0",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            marginBottom: 28,
            color: INK,
          } as React.CSSProperties
        }
      >
        {locale === "ko" ? question.ko : question.en}
      </h2>

      {/* Choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(["A", "B", "C"] as const).map((letter, i) => {
          const choice = question.choices[i];
          return (
            <button
              key={`${questionIdx}-${letter}`}
              type="button"
              onClick={() => onAnswer(letter)}
              className="kbti-reveal"
              style={
                {
                  ["--i" as string]: String(i + 1),
                  background: PAPER,
                  border: `1px solid ${RULE}`,
                  color: INK,
                  borderRadius: 14,
                  padding: "16px 18px",
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: SANS,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  lineHeight: 1.5,
                  transition: "border-color 0.15s, background 0.15s",
                } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.background = "rgba(198,12,48,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = RULE;
                e.currentTarget.style.background = PAPER;
              }}
            >
              <span
                style={{
                  flex: "0 0 auto",
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${RULE}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: ACCENT_DIM,
                  letterSpacing: "0.05em",
                }}
              >
                {letter}
              </span>
              <span style={{ flex: 1 }}>
                {locale === "ko" ? choice.ko : choice.en}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Result
// ═══════════════════════════════════════════════════════════

function ResultView({
  result,
  stats,
  onRestart,
  onShare,
  copied,
  t,
  locale,
}: {
  result: MatchResult;
  stats: Stats;
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
  t: (ko: string, en: string) => string;
  locale: SimpleLocale;
}): ReactElement {
  const { type, match, hidden } = result;
  const myCount = stats.byType[type.id] ?? 0;
  const total = Math.max(1, stats.total);
  const samePct = Math.round((myCount / total) * 100);

  let revealIdx = 0;
  const stagger = (): React.CSSProperties => ({
    ["--i" as string]: String(revealIdx++),
  });

  const txt = locale === "ko" ? type.ko : type.en;
  const altTxt = locale === "ko" ? type.en : type.ko;

  return (
    <ShareCard
      filename={`nolza-kbti-${(locale === "ko" ? type.ko.code : type.en.code).replace(/\s+/g, "")}`}
      locale={locale === "ko" ? "ko" : "en"}
      backgroundColor={BG}
      buttonLabel={{ ko: "결과 이미지 저장", en: "Save result image" }}
      buttonStyle={{
        padding: "12px 22px",
        borderRadius: 999,
        border: `1px solid ${ACCENT}`,
        background: "transparent",
        color: ACCENT,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.18em",
        cursor: "pointer",
        minHeight: 44,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {({ cardRef }) => (
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div ref={cardRef} style={{ background: BG, padding: "4px 0" }}>
      {/* Eyebrow */}
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          textAlign: "center",
          color: ACCENT,
          fontSize: 13,
          letterSpacing: "0.32em",
          fontWeight: 700,
          marginBottom: 12,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {hidden
          ? t("🍗 숨겨진 유형 발견", "🍗 HIDDEN TYPE UNLOCKED")
          : t("당신의 KBTI 유형", "YOUR KBTI TYPE")}
      </div>

      {/* Hero card — emoji + code + title + match% */}
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          background: PAPER,
          border: `1px solid ${ACCENT}`,
          borderRadius: 22,
          padding: "32px 22px 26px",
          textAlign: "center",
          marginBottom: 14,
          boxShadow: `0 18px 50px rgba(198,12,48,0.18)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -40,
            background:
              "radial-gradient(circle at 50% 30%, rgba(198,12,48,0.18), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 56, marginBottom: 4 }}>
            {hidden ? (
              <span className="chimaek-twinkle">{type.emoji}</span>
            ) : (
              type.emoji
            )}
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: ACCENT,
            }}
          >
            {locale === "ko" ? type.ko.code : type.en.code}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 16,
              color: SUBTLE,
              fontFamily: locale === "ko" ? "'Inter', sans-serif" : SANS,
              letterSpacing: "0.04em",
            }}
          >
            {altTxt.code}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 16,
              color: INK,
              fontWeight: 600,
              lineHeight: 1.45,
              padding: "0 8px",
            }}
          >
            {txt.title}
          </div>
          {!hidden && (
            <div
              className="tabular-nums"
              style={{
                marginTop: 16,
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: ACCENT_DIM,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {t("매치율", "Match")} · {match}%
            </div>
          )}
        </div>
      </div>

      {/* One-liner — the most pointed sentence */}
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          background: "rgba(198,12,48,0.08)",
          border: `1px solid ${ACCENT_DIM}`,
          borderRadius: 14,
          padding: "18px 22px",
          fontSize: 17,
          lineHeight: 1.5,
          color: INK,
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 22,
          letterSpacing: "-0.005em",
          whiteSpace: "pre-line",
        }}
      >
        “{txt.oneliner}”
      </div>

      {/* Section: 이런 사람이에요 */}
      <ResultSection
        label={t("이런 사람이에요", "WHO YOU ARE")}
        body={txt.detail}
        stagger={stagger}
      />

      {/* Section: 주변 사람들이 보는 당신 */}
      <ResultSection
        label={t("주변 사람들이 보는 당신", "HOW OTHERS SEE YOU")}
        body={txt.howOthersSee}
        stagger={stagger}
        accent="#9bb8ff"
      />

      {/* Section: 의외의 장점 */}
      <ResultSection
        label={t("의외의 장점", "HIDDEN STRENGTHS")}
        body={txt.strengths}
        stagger={stagger}
        accent="#7bdba0"
      />

      {/* Section: 이건 조심하세요 */}
      <ResultSection
        label={t("이건 조심하세요", "WATCH OUT FOR")}
        body={txt.watchOut}
        stagger={stagger}
        accent="#ff9b6b"
      />

      {/* Section: 이런 상황에서 빛납니다 */}
      <ResultSection
        label={t("이런 상황에서 빛납니다", "WHERE YOU SHINE")}
        body={txt.shines}
        stagger={stagger}
        accent="#ffd166"
      />

      {/* Closing — one final pointed line */}
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          marginTop: 32,
          marginBottom: 12,
          padding: "22px 22px",
          borderTop: `1px solid ${ACCENT_DIM}`,
          borderBottom: `1px solid ${ACCENT_DIM}`,
          fontSize: 16,
          lineHeight: 1.7,
          color: INK,
          fontStyle: "italic",
          textAlign: "center",
          fontWeight: 500,
          letterSpacing: "-0.005em",
          whiteSpace: "pre-line",
          opacity: 0.92,
        }}
      >
        — {txt.closing} —
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div
          className="kbti-reveal"
          style={{
            ...stagger(),
            textAlign: "center",
            fontSize: 14,
            color: SUBTLE,
            margin: "8px 0 22px",
            lineHeight: 1.6,
          }}
        >
          {t(
            `이 기기 ${stats.total}회 플레이 중 ${samePct}%가 같은 유형`,
            `${samePct}% of ${stats.total} plays on this device got the same type`,
          )}
        </div>
      )}

          </div>
      {/* Buttons */}
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button type="button" onClick={onShare} style={primaryBtn}>
          {copied
            ? t("✓ 복사됨", "✓ Copied")
            : t("결과 공유하기", "Share result")}
        </button>
        <button type="button" onClick={onRestart} style={secondaryBtn}>
          ↺ {t("다시 하기", "Try Again")}
        </button>
      </div>
        </div>
      )}
    </ShareCard>
  );
}

function ResultSection({
  label,
  body,
  stagger,
  accent,
}: {
  label: string;
  body: string;
  stagger: () => React.CSSProperties;
  accent?: string;
}): ReactElement {
  const accentColor = accent ?? ACCENT_DIM;
  return (
    <>
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          display: "flex",
          alignItems: "center",
          gap: 10,
          margin: "26px 4px 12px",
        }}
      >
        <span
          aria-hidden
          style={{
            flex: "0 0 auto",
            height: 1,
            width: 22,
            background: accentColor,
            opacity: 0.55,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: accentColor,
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {label}
        </span>
        <span
          aria-hidden
          style={{
            flex: 1,
            height: 1,
            background: accentColor,
            opacity: 0.2,
          }}
        />
      </div>
      <div
        className="kbti-reveal"
        style={{
          ...stagger(),
          background: PAPER_2,
          border: `1px solid ${RULE}`,
          borderRadius: 14,
          padding: "20px 22px",
          fontSize: 15,
          lineHeight: 1.85,
          color: INK,
          whiteSpace: "pre-line",
        }}
      >
        {body}
      </div>
    </>
  );
}

const primaryBtn: React.CSSProperties = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  padding: "14px 28px",
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0.12em",
  cursor: "pointer",
  fontFamily: SANS,
  boxShadow: "0 8px 22px rgba(198,12,48,0.4)",
};

const secondaryBtn: React.CSSProperties = {
  background: "transparent",
  color: INK,
  border: `1px solid ${RULE}`,
  padding: "14px 24px",
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: SANS,
};
