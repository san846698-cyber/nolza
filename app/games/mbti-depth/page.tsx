"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { ShareCard } from "../../components/ShareCard";
import RecommendedGames from "../../components/game/RecommendedGames";
import ResultActions from "../../components/game/ResultActions";
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
}: {
  result: FullResult;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  onRestart: () => void;
}) {
  const dims: DimResult[] = [result.E, result.S, result.T, result.J];
  const tagline = comboTagline(result, locale);
  const summary = t(
    `${result.code}는 '${tagline}' 쪽에 가깝습니다. 핵심은 ${LEVELS[result.E.side][result.E.level].title.ko}, ${LEVELS[result.S.side][result.S.level].title.ko}, ${LEVELS[result.T.side][result.T.level].title.ko}, ${LEVELS[result.J.side][result.J.level].title.ko}의 조합이에요. 그래서 겉보기보다 훨씬 입체적이고, 잘 맞는 환경에서는 집중력과 판단력이 꽤 선명하게 드러납니다.`,
    `${result.code} leans into '${tagline}'. The core blend is ${LEVELS[result.E.side][result.E.level].title.en}, ${LEVELS[result.S.side][result.S.level].title.en}, ${LEVELS[result.T.side][result.T.level].title.en}, and ${LEVELS[result.J.side][result.J.level].title.en}. You are more layered than a four-letter code suggests, and the right environment brings out real clarity.`,
  );
  const strengthLine = firstSentence(
    LEVELS[result.T.side][result.T.level].hiddenStrength[locale],
  );
  const watchLine = firstSentence(
    LEVELS[result.J.side][result.J.level].factCheck[locale],
  );
  const shareText = t(
    `내 MBTI 심층분석 결과: ${result.code} / 강점: ${strengthLine} / 주의할 점: ${watchLine}\n설명이 너무 구체적이라 좀 찔림...\nhttps://nolza.fun/games/mbti-depth`,
    `My deep MBTI result: ${result.code} / Strength: ${strengthLine} / Watch-out: ${watchLine}\nThis is oddly specific...\nhttps://nolza.fun/games/mbti-depth`,
  );

  return (
    <ShareCard
      filename={`nolza-mbti-depth-${result.code}`}
      locale={locale}
      backgroundColor="#0f0f11"
      buttonLabel={{ ko: "분석 카드 저장", en: "Save analysis card" }}
      buttonClassName="mx-auto mt-4 flex rounded-full border border-accent px-6 py-3 text-sm font-bold text-accent hover:bg-accent hover:text-white"
    >
      {({ cardRef }) => (
        <section className="mbti-depth-result animate-[fade_0.35s_ease-out]">
          <style jsx global>{`
            @keyframes fade {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .mbti-depth-result .result-actions__btn {
              border-color: rgba(255, 255, 255, 0.18);
              background: rgba(255, 255, 255, 0.055);
              color: #f4f4f4;
            }
            .mbti-depth-result .result-actions__btn--primary {
              border-color: #ff3b30;
              background: #ff3b30;
              color: #fff;
            }
            .mbti-depth-result .result-actions__btn--share {
              border-color: #ff3b30;
              color: #ff3b30;
            }
            .mbti-depth-result .recommended-games__head,
            .mbti-depth-result .recommended-games__item {
              color: #f4f4f4;
            }
            .mbti-depth-result .recommended-games__item {
              border-color: rgba(255, 255, 255, 0.12);
              background: rgba(255, 255, 255, 0.055);
            }
            .mbti-depth-result .recommended-games__head small,
            .mbti-depth-result .recommended-games__item em {
              color: #ff3b30;
            }
          `}</style>

          <div ref={cardRef} className="rounded-[24px] border border-accent/35 bg-[#0f0f11] p-5 shadow-2xl shadow-black/30 md:p-8">
            <div className="rounded-[20px] border border-accent/40 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.22),transparent_32rem),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 text-center md:p-10">
              <div className="text-xs font-black uppercase tracking-[0.26em] text-accent">
                {t("MBTI 심층분석 결과", "Deep MBTI analysis")}
              </div>
              <div className="mt-4 font-serif text-6xl font-black tracking-normal text-white md:text-8xl">
                {result.code}
              </div>
              <div className="mt-3 font-mono text-sm text-gray-300 md:text-base">
                {result.detail}
              </div>
              <div className="mt-5 font-serif text-xl font-bold italic leading-snug text-accent md:text-2xl">
                “{tagline}”
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
                {summary}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {dims.map((d) => (
                <DimensionBar key={d.dimension} dim={d} locale={locale} t={t} />
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InsightCard
                label={t("강점", "Strengths")}
                body={LEVELS[result.T.side][result.T.level].hiddenStrength[locale]}
              />
              <InsightCard
                label={t("주의할 점", "Watch-outs")}
                body={LEVELS[result.J.side][result.J.level].factCheck[locale]}
              />
              <InsightCard
                label={t("공부 / 일 스타일", "Work / study style")}
                body={`${LEVELS[result.S.side][result.S.level].shines[locale]}\n\n${LEVELS[result.J.side][result.J.level].shines[locale]}`}
              />
              <InsightCard
                label={t("관계 스타일", "Relationship style")}
                body={`${LEVELS[result.E.side][result.E.level].persona[locale]}\n\n${LEVELS[result.T.side][result.T.level].persona[locale]}`}
              />
              <InsightCard
                label={t("스트레스 받을 때", "Under stress")}
                body={t(
                  `${watchLine} 이럴 때는 결론을 바로 내리기보다, 지금 내가 피곤한 건지 진짜 싫은 건지 먼저 분리해보는 게 좋습니다.`,
                  `${watchLine} In those moments, separate "I am tired" from "I truly dislike this" before deciding.`,
                )}
              />
              <InsightCard
                label={t("잘 맞는 환경", "Best environment")}
                body={t(
                  "혼자 집중할 시간과 함께 검증할 사람이 둘 다 있는 환경. 즉흥만 있거나 규칙만 있는 곳보다, 선택권이 있는 구조에서 가장 잘 살아납니다.",
                  "An environment with both solo focus time and people to test ideas with. You do best with structure that still leaves room for choice.",
                )}
              />
            </div>

            <div className="mt-6 grid gap-6">
              {dims.map((d) => {
                const info = LEVELS[d.side][d.level];
                return (
                  <div
                    key={d.dimension}
                    className="rounded-2xl border border-border bg-card p-5 md:p-7"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="font-mono text-2xl font-black text-accent">
                        {d.side}
                        {d.level}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
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
                      tone="accent"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center gap-5">
            <ResultActions
              locale={locale}
              title={t("MBTI 심층분석 결과", "Deep MBTI result")}
              text={shareText}
              url="/games/mbti-depth"
              onReplay={onRestart}
              replayLabel={t("다시 분석하기", "Analyze again")}
            />
            <RecommendedGames
              currentId="mbti-depth"
              ids={["kbti", "attachment", "defense-mechanism"]}
              title={{ ko: "다음에 해볼 진단", en: "Try these next" }}
            />
          </div>
        </section>
      )}
    </ShareCard>
  );
}

function firstSentence(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? normalized;
}

function DimensionBar({
  dim,
  locale,
  t,
}: {
  dim: DimResult;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
}) {
  const info = LEVELS[dim.side][dim.level];
  const strength = Math.min(100, Math.round((Math.abs(dim.rawAvg) / 4) * 100));
  const [left, right] = dimensionEnds(dim.dimension, t);
  const leansLeft = ["E", "S", "T", "J"].includes(dim.side);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
            {dimensionLabel(dim.dimension, t)}
          </div>
          <div className="mt-1 text-base font-bold text-white">
            {dim.side}
            {dim.level} · {info.title[locale]}
          </div>
        </div>
        <div className="font-mono text-sm font-bold text-accent">
          {strength}%
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-[11px] font-semibold text-gray-500">
        <span>{left}</span>
        <div className="h-2 overflow-hidden rounded-full bg-bg">
          <div
            className="h-full rounded-full bg-accent"
            style={{
              width: `${Math.max(18, strength)}%`,
              marginLeft: leansLeft ? 0 : "auto",
            }}
          />
        </div>
        <span>{right}</span>
      </div>
    </div>
  );
}

function InsightCard({ label, body }: { label: string; body: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
        {label}
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-300 md:text-base">
        {body}
      </p>
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

function dimensionEnds(
  dim: "EI" | "SN" | "TF" | "JP",
  t: (ko: string, en: string) => string,
): [string, string] {
  switch (dim) {
    case "EI": return [t("외향", "E"), t("내향", "I")];
    case "SN": return [t("감각", "S"), t("직관", "N")];
    case "TF": return [t("사고", "T"), t("감정", "F")];
    case "JP": return [t("판단", "J"), t("인식", "P")];
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
