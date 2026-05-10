"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";
import {
  QUESTIONS,
  LEVELS,
  DIMENSION_INTROS,
  computeResult,
  comboTagline,
  type Dimension,
  type FullResult,
  type DimResult,
} from "./data";

type Phase = "intro" | "transition" | "quiz" | "result";

const BEST_KEY = "nolza-mbti-depth-best";

export default function MbtiDepthGame() {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const start = () => {
    setAnswers([]);
    setQIdx(0);
    setPhase("transition"); // first dimension intro before any question
  };

  const proceedFromTransition = () => {
    setPhase("quiz");
  };

  const select = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);

    if (next.length >= QUESTIONS.length) {
      try {
        localStorage.setItem(BEST_KEY, JSON.stringify(next));
      } catch {}
      setPhase("result");
      return;
    }

    const nextIdx = next.length;
    const justAnswered = QUESTIONS[nextIdx - 1];
    const upcoming = QUESTIONS[nextIdx];
    setQIdx(nextIdx);

    // If we're entering a new dimension, show its intro screen first.
    if (upcoming.dimension !== justAnswered.dimension) {
      setPhase("transition");
    }
  };

  const restart = () => {
    setAnswers([]);
    setQIdx(0);
    setPhase("intro");
  };

  const back = () => {
    if (qIdx === 0) return;
    setAnswers(answers.slice(0, -1));
    setQIdx(qIdx - 1);
    // If the previous question is in a different dimension, the user is
    // crossing back over a section boundary — keep them in quiz, no transition.
    setPhase("quiz");
  };

  const result = useMemo<FullResult | null>(
    () => (phase === "result" ? computeResult(answers) : null),
    [phase, answers],
  );

  const handleShare = async () => {
    if (!result) return;
    const text = t(
      `내 MBTI 심층 분석 결과:\n${result.code}\n${result.detail}\n"${comboTagline(result, "ko")}"\n너도 해봐 → nolza.fun/games/mbti-depth`,
      `My deep MBTI result:\n${result.code}\n${result.detail}\n"${comboTagline(result, "en")}"\nTry it → nolza.fun/games/mbti-depth`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const current = QUESTIONS[qIdx];

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← {t("놀자.fun으로 돌아가기", "Back to Nolza.fun")}
          </Link>
          {phase === "quiz" || phase === "transition" ? (
            <div className="text-xs text-gray-500">
              <span className="font-medium text-white">{qIdx + 1}</span>
              <span className="mx-1">/</span>
              <span>{QUESTIONS.length}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              {t("28문항 심층", "28 deep questions")}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-8 md:px-8">
        <AdTop />
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-8">
        {phase === "intro" && <IntroView onStart={start} t={t} />}
        {phase === "transition" && current && (
          <TransitionView
            dimension={current.dimension}
            locale={locale}
            t={t}
            onContinue={proceedFromTransition}
          />
        )}
        {phase === "quiz" && current && (
          <QuizView
            questionIdx={qIdx}
            total={QUESTIONS.length}
            question={current}
            locale={locale}
            t={t}
            onSelect={select}
            onBack={back}
          />
        )}
        {phase === "result" && result && (
          <ResultView
            result={result}
            locale={locale}
            t={t}
            onRestart={restart}
            onShare={handleShare}
            copied={copied}
          />
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent"
          >
            ← {t("놀자.fun으로 돌아가기", "Back to Nolza.fun")}
          </Link>
        </div>

        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}

// ─────────────────────────── Intro ───────────────────────────

function IntroView({
  t,
  onStart,
}: {
  t: (ko: string, en: string) => string;
  onStart: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl whitespace-pre-line">
        {t(
          "당신의 MBTI,\n진짜로 분석해드립니다",
          "Your MBTI,\nbut make it specific",
        )}
      </h1>

      <div className="mt-6 text-base font-medium text-accent md:text-lg">
        {t("4가지 지표 × 4단계 = 256가지 결과", "4 axes × 4 levels = 256 results")}
      </div>

      <p className="mt-8 max-w-md text-base leading-relaxed text-gray-400 md:text-lg">
        {t(
          "MBTI는 알지만 내가 어느 정도인지 몰랐던 것. 이제 알게 됩니다.",
          "You know your MBTI — but how extreme are you on each axis? Now you'll find out.",
        )}
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-12 rounded-full bg-accent px-12 py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-100"
      >
        {t("시작하기", "Start")} →
      </button>
    </section>
  );
}

function TransitionView({
  dimension,
  locale,
  t,
  onContinue,
}: {
  dimension: Dimension;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  onContinue: () => void;
}) {
  const intro = DIMENSION_INTROS[dimension];
  return (
    <section
      key={dimension}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      style={{ animation: "mbtiFade 0.5s ease-out" }}
    >
      <style jsx>{`
        @keyframes mbtiFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="text-xs uppercase tracking-[0.32em] text-accent">
        {intro.ordinal[locale]}
      </div>

      <h2 className="mt-6 font-serif text-4xl font-black text-white md:text-6xl">
        {intro.title[locale]}
      </h2>

      <p className="mt-8 max-w-md font-serif italic text-lg text-gray-300 md:text-2xl">
        {intro.question[locale]}
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-12 rounded-full border border-accent px-10 py-3 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white"
      >
        {t("계속하기", "Continue")} →
      </button>
    </section>
  );
}

// ─────────────────────────── Quiz ───────────────────────────

function QuizView({
  questionIdx,
  total,
  question,
  locale,
  t,
  onSelect,
  onBack,
}: {
  questionIdx: number;
  total: number;
  question: (typeof QUESTIONS)[number];
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  onSelect: (score: number) => void;
  onBack: () => void;
}) {
  const dimLabel = (() => {
    switch (question.dimension) {
      case "EI": return t("외향 / 내향", "Extrovert / Introvert");
      case "SN": return t("감각 / 직관", "Sensing / Intuition");
      case "TF": return t("사고 / 감정", "Thinking / Feeling");
      case "JP": return t("판단 / 인식", "Judging / Perceiving");
    }
  })();

  const progress = ((questionIdx + 1) / total) * 100;

  return (
    <section key={question.id} className="animate-[fade_0.35s_ease-out]">
      <style jsx>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-card">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.22em] text-gray-500">
          {dimLabel}
        </span>
        <span className="text-gray-500">
          Q{questionIdx + 1} / {total}
        </span>
      </div>

      <div className="text-xs uppercase tracking-[0.18em] text-accent/80">
        {question.category[locale]}
      </div>
      <h2 className="mt-3 font-serif text-xl font-bold leading-snug text-white md:text-3xl">
        {question.prompt[locale]}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.score)}
            className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-accent hover:bg-bg md:p-6"
          >
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-bold text-gray-400 group-hover:border-accent group-hover:text-accent">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-base text-gray-200 group-hover:text-white md:text-lg">
                {opt.label[locale]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {questionIdx > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="mt-6 text-xs text-gray-500 hover:text-accent"
        >
          ← {t("이전 문항", "Previous question")}
        </button>
      )}
    </section>
  );
}

// ─────────────────────────── Result ───────────────────────────

function ResultView({
  result,
  locale,
  t,
  onRestart,
  onShare,
  copied,
}: {
  result: FullResult;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  const dims: DimResult[] = [result.E, result.S, result.T, result.J];
  return (
    <section className="animate-[fade_0.35s_ease-out]">
      <style jsx>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
        <div className="text-xs uppercase tracking-[0.28em] text-accent">
          {t("심층 분석 결과", "Deep analysis")}
        </div>
        <div className="mt-3 font-serif text-5xl font-black tracking-tight text-white md:text-7xl">
          {result.code}
        </div>
        <div className="mt-3 font-mono text-sm text-gray-300 md:text-base">
          {result.detail}
        </div>
        <div className="mt-4 font-serif italic text-base text-accent md:text-lg">
          “{comboTagline(result, locale)}”
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {dims.map((d) => {
          const info = LEVELS[d.side][d.level];
          return (
            <div
              key={d.dimension}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl font-black text-accent">
                  {d.side}
                  {d.level}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  {dimensionLabel(d.dimension, t)}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-xl font-bold text-white md:text-2xl">
                {info.title[locale]}
              </h3>

              <DetailBlock
                kicker={t("이런 사람이에요", "Who you are")}
                body={info.persona[locale]}
                tone="neutral"
              />
              <DetailBlock
                kicker={t("현실 팩폭", "Reality check")}
                body={info.factCheck[locale]}
                tone="warn"
              />
              <DetailBlock
                kicker={t("의외의 장점", "Hidden strength")}
                body={info.hiddenStrength[locale]}
                tone="neutral"
              />
              <DetailBlock
                kicker={t("이런 상황에서 빛납니다", "Where you shine")}
                body={info.shines[locale]}
                tone="accent"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
        >
          ↻ {t("다시 하기", "Try Again")}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
        >
          {copied
            ? t("✓ 복사됐어요", "✓ Copied")
            : `📋 ${t("결과 공유하기", "Share Result")}`}
        </button>
      </div>
    </section>
  );
}

function dimensionLabel(
  dim: "EI" | "SN" | "TF" | "JP",
  t: (ko: string, en: string) => string,
): string {
  switch (dim) {
    case "EI": return t("외향 / 내향", "Extroversion / Introversion");
    case "SN": return t("감각 / 직관", "Sensing / Intuition");
    case "TF": return t("사고 / 감정", "Thinking / Feeling");
    case "JP": return t("판단 / 인식", "Judging / Perceiving");
  }
}

function DetailBlock({
  kicker,
  body,
  tone,
}: {
  kicker: string;
  body: string;
  tone: "neutral" | "warn" | "accent";
}) {
  const kickerColor =
    tone === "warn"
      ? "text-accent"
      : tone === "accent"
      ? "text-accent"
      : "text-gray-400";
  const bodyColor =
    tone === "warn" ? "text-gray-200" : "text-gray-300";
  return (
    <div className="mt-5 border-t border-border/60 pt-4">
      <div
        className={`text-[11px] uppercase tracking-[0.22em] font-semibold ${kickerColor}`}
      >
        {kicker}
      </div>
      <p
        className={`mt-2 text-sm leading-relaxed ${bodyColor} md:text-base whitespace-pre-line`}
      >
        {body}
      </p>
    </div>
  );
}
