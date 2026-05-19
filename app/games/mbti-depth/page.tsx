"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { ShareCard } from "../../components/ShareCard";
import RecommendedGames from "../../components/game/RecommendedGames";
import ResultActions from "../../components/game/ResultActions";
import { useLocale } from "@/hooks/useLocale";
import BrandMark, { brandText, homeBackLabel } from "@/app/components/BrandMark";
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
  const { locale, setLocale, t } = useLocale();
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
    <main className="mbti-depth-page min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-4xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {homeBackLabel(locale)}
          </Link>
          <Link href="/" className="justify-self-center text-white" aria-label={brandText(locale)}>
            <BrandMark locale={locale} className="brand-mark--shell" />
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            className="rounded-full border border-border px-3 py-2 text-xs font-bold tracking-[0.12em] text-gray-300 hover:border-accent hover:text-accent"
            aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
          >
            한 / EN
          </button>
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
      <h1 className="font-serif text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl whitespace-pre-line [word-break:keep-all]">
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
      <h2 className="mt-4 max-w-3xl text-2xl font-extrabold leading-snug text-white md:text-3xl">
        {question.prompt[locale]}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.score)}
            className="group rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-accent hover:bg-bg md:p-5"
          >
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-bold text-gray-400 group-hover:border-accent group-hover:text-accent">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-base leading-relaxed text-gray-200 group-hover:text-white md:text-[17px]">
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
  const summary = mainTypeSummary(result, locale);
  const axisCards = dims.map((d) => ({
    dim: d,
    info: LEVELS[d.side][d.level],
    copy: axisShortCopy(d, locale),
  }));
  const strengthLine = firstSentence(
    LEVELS[result.T.side][result.T.level].hiddenStrength[locale],
  );
  const watchLine = firstSentence(
    LEVELS[result.J.side][result.J.level].factCheck[locale],
  );
  const friendLines = friendCommentLines(result, locale);
  const shareText = t(
    `나는 MBTI 심층 분석에서 ${result.code} · ${tagline} 나왔다.\n${result.detail} 조합이라는데 꽤 맞는 듯.\n너도 해봐.\nhttps://nolza.fun/games/mbti-depth`,
    `I got ${result.code} · ${tagline} on the Deep MBTI Analysis.\nApparently my mix is ${result.detail}, and it feels pretty accurate.\nTry yours too.\nhttps://nolza.fun/games/mbti-depth`,
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
              background: linear-gradient(135deg, #ff654f 0%, #d93d2f 48%, #d89a50 100%);
              color: #fffaf0;
            }
            .mbti-depth-result .result-actions__btn--share {
              border-color: #ff3b30;
              color: #fffaf0;
            }
            .mbti-depth-result .recommended-games__head,
            .mbti-depth-result .recommended-games__item {
              color: #f4f4f4;
            }
            .mbti-depth-result .recommended-games {
              border-color: rgba(255, 255, 255, 0.16);
              background:
                radial-gradient(circle at 18% 0%, rgba(255, 59, 48, 0.18), transparent 25rem),
                linear-gradient(135deg, rgba(255, 255, 255, 0.095), rgba(255, 255, 255, 0.045));
            }
            .mbti-depth-result .recommended-games__item {
              border-color: rgba(255, 255, 255, 0.14);
              background: rgba(255, 255, 255, 0.075);
            }
            .mbti-depth-result .recommended-games__head small,
            .mbti-depth-result .recommended-games__item em {
              color: #fff7e8;
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
              <div className="mt-5 font-serif text-xl font-bold italic leading-snug text-accent md:text-2xl">
                “{tagline}”
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
                {summary}
              </p>
            </div>

            <section className="mt-6 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5 md:p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                {t("결과를 읽는 방법", "How to read this result")}
              </div>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-300 md:text-base">
                <p>
                  {t(
                    `${result.code}는 당신의 큰 방향을 보여줍니다. ${result.detail}는 각 축 안에서 당신이 어떤 방식으로 그 성향을 보이는지 더 자세히 나눈 세부 코드입니다.`,
                    `${result.code} shows your broad direction. ${result.detail} breaks each letter into a more specific subtype for that axis.`,
                  )}
                </p>
                <p>
                  {t(
                    "예를 들어 I라고 해서 모두 같은 내향은 아닙니다. I1은 경계선에 가까운 내향이고, I2는 혼자 있어야 에너지가 회복되는 충전형 내향에 가깝습니다.",
                    "For example, not every I is the same kind of introversion. I1 is closer to a borderline introvert, while I2 is a recharging introvert who needs alone time to recover.",
                  )}
                </p>
                <p>
                  {t(
                    "퍼센트는 정답률이 아니라 한쪽으로 얼마나 기울었는지 보여주는 참고값입니다. 낮은 기울기는 틀렸다는 뜻이 아니라, 반대 성향도 상황에 따라 함께 나타날 수 있다는 뜻입니다.",
                    "Percentages are not accuracy scores. They show how strongly you tilted toward one side. A lower tilt does not mean the result is wrong; it means the opposite side may also show up depending on the situation.",
                  )}
                </p>
                <p>
                  {t(
                    "경계선이란 한쪽 성향이 압도적으로 강한 것이 아니라, 상황에 따라 반대 성향도 꽤 자주 나타난다는 뜻입니다.",
                    "Borderline means one side is not overwhelmingly strong, and the opposite tendency can appear fairly often depending on context.",
                  )}
                </p>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 className="font-serif text-xl font-bold text-white md:text-2xl">
                  {t("당신의 4가지 핵심 축", "Your four core axes")}
                </h2>
                <span className="hidden text-xs font-semibold text-gray-500 sm:inline">
                  {result.detail}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {axisCards.map(({ dim, info, copy }) => (
                  <section key={dim.dimension} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-mono text-xl font-black text-accent">
                        {dim.side}{dim.level}
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                        {dimensionLabel(dim.dimension, t)}
                      </div>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-bold text-white">
                      {info.title[locale]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">
                      {copy.short}
                    </p>
                  </section>
                ))}
              </div>
            </section>

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
                body={t(
                  `${result.E.side}${result.E.level} 성향 때문에 사람을 만나는 방식에는 에너지 조절이 중요하고, ${result.T.side}${result.T.level} 성향 때문에 마음과 판단 기준을 함께 살피는 편입니다.`,
                  `Your ${result.E.side}${result.E.level} pattern makes energy management important in relationships, while your ${result.T.side}${result.T.level} pattern means you read both feelings and judgment standards.`,
                )}
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
                const copy = axisShortCopy(d, locale);
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
                      kicker={t("이 뜻이에요", "What this means")}
                      body={copy.meaning}
                      tone="neutral"
                    />
                    <DetailBlock
                      kicker={t("겉으로는 이렇게 보여요", "How it appears")}
                      body={copy.appears}
                      tone="neutral"
                    />
                    <DetailBlock
                      kicker={t("현실 체크", "Reality check")}
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

            <section className="mt-6">
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 className="font-serif text-xl font-bold text-white md:text-2xl">
                  {t("방향성 참고값", "Direction reference")}
                </h2>
                <span className="text-xs font-semibold text-gray-500">
                  {t("정답률이 아니라 기울기입니다", "Tilt, not an accuracy score")}
                </span>
              </div>
              <div className="grid gap-3">
                {dims.map((d) => (
                  <DimensionBar key={d.dimension} dim={d} locale={locale} t={t} />
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5 md:p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                {t("친구가 보면 할 말", "What a friend might say")}
              </div>
              <div className="mt-4 grid gap-3">
                {friendLines.map((line) => (
                  <p key={line} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-gray-200 md:text-base">
                    “{line}”
                  </p>
                ))}
              </div>
            </section>
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
              title={{ ko: "이 테스트도 해보세요", en: "Try These Next" }}
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

function mainTypeSummary(result: FullResult, locale: "ko" | "en"): string {
  const energy = result.E.side === "I"
    ? {
        ko: "혼자 있거나 익숙한 사람과 있을 때 에너지를 회복하고",
        en: "You recover energy through solitude or familiar company",
      }
    : {
        ko: "사람들과 연결될 때 에너지가 살아나고",
        en: "You come alive through connection with people",
      };
  const perception = result.S.side === "N"
    ? {
        ko: "눈앞의 사실보다 그 안에 숨은 의미와 가능성을 먼저 봅니다",
        en: "and you notice hidden meaning and possibility before plain facts.",
      }
    : {
        ko: "추상적인 가능성보다 지금 보이는 사실과 실제 흐름을 먼저 봅니다",
        en: "and you notice concrete facts and practical flow before abstract possibility.",
      };
  const decision = result.T.side === "F"
    ? {
        ko: "판단할 때는 논리도 보지만, 최종적으로는 사람과 의미를 쉽게 배제하지 않는 편입니다.",
        en: "When deciding, you use logic too, but you do not easily leave people and meaning out of the final call.",
      }
    : {
        ko: "판단할 때는 마음도 보지만, 최종적으로는 기준과 구조를 분명히 하려는 편입니다.",
        en: "When deciding, you notice feelings too, but you usually try to clarify standards and structure.",
      };
  const lifestyle = result.J.side === "P"
    ? {
        ko: "계획은 필요할 때 세우되, 가능성을 열어둔 채 움직일 때 더 자연스럽습니다.",
        en: "You can plan when needed, but you feel more natural when possibilities stay open.",
      }
    : {
        ko: "가능성을 보더라도, 결국 정리된 계획과 예측 가능한 흐름이 있을 때 더 안정됩니다.",
        en: "Even when you see possibilities, you feel steadier with a clear plan and predictable flow.",
      };

  return locale === "ko"
    ? `${energy.ko}, ${perception.ko}. ${decision.ko} ${lifestyle.ko}`
    : `${energy.en}, ${perception.en} ${decision.en} ${lifestyle.en}`;
}

function axisShortCopy(dim: DimResult, locale: "ko" | "en") {
  const code = `${dim.side}${dim.level}`;
  const isBorderline = dim.level === 1;
  const ko: Record<string, { short: string; meaning: string; appears: string }> = {
    E: {
      short: isBorderline ? "사람에게 열려 있지만 혼자 있는 시간도 필요한 타입" : "사람과 연결될 때 에너지가 살아나는 타입",
      meaning: "외부 자극과 대화 속에서 생각이 정리되고 에너지가 살아납니다.",
      appears: "활발해 보일 수 있지만, 모든 사람에게 같은 속도로 가까워지는 것은 아닙니다.",
    },
    I: {
      short: isBorderline ? "혼자만의 시간이 필요하지만 사람을 피하는 것은 아닌 타입" : "혼자 있어야 에너지가 회복되는 타입",
      meaning: "조용한 시간은 단순한 휴식이 아니라 마음과 생각을 다시 충전하는 방식입니다.",
      appears: "사람을 싫어하는 것이 아니라, 만남 뒤에는 회복 시간이 필요해 보일 수 있습니다.",
    },
    S: {
      short: isBorderline ? "현실 감각과 가능성 사이를 오가는 타입" : "구체적인 사실과 실제 흐름을 먼저 보는 타입",
      meaning: "눈앞에 있는 정보, 경험, 실제로 작동하는 방식을 중요하게 봅니다.",
      appears: "뜬구름 잡는 말보다 바로 확인 가능한 근거를 찾는 사람처럼 보일 수 있습니다.",
    },
    N: {
      short: isBorderline ? "가능성을 보지만 현실 감각도 함께 쓰는 타입" : "가능성과 의미를 먼저 떠올리는 타입",
      meaning: "보이는 것 자체보다 그 안에 숨어 있는 패턴, 의미, 다음 가능성을 먼저 떠올립니다.",
      appears: "대화 중에 연결고리를 빠르게 만들고, 아직 일어나지 않은 경우의 수를 자주 말할 수 있습니다.",
    },
    T: {
      short: isBorderline ? "분석과 공감을 함께 쓰는 타입" : "기준과 논리로 판단을 정리하는 타입",
      meaning: "판단할 때 감정에 휩쓸리기보다 기준, 원인, 결과를 먼저 확인하려 합니다.",
      appears: "차갑다기보다 정리하려는 사람처럼 보일 수 있고, 감정 표현이 늦게 따라올 수 있습니다.",
    },
    F: {
      short: isBorderline ? "공감과 분석을 함께 쓰는 타입" : "사람과 의미를 중심에 두고 판단하는 타입",
      meaning: "결정할 때 효율만큼이나 사람의 마음, 관계의 맥락, 의미를 중요하게 봅니다.",
      appears: "부드럽고 배려 깊어 보이지만, 속으로는 꽤 현실적인 기준도 함께 세울 수 있습니다.",
    },
    J: {
      short: isBorderline ? "정리하고 싶지만 즉흥성도 꽤 남아 있는 타입" : "계획과 마감선이 있을 때 안정되는 타입",
      meaning: "할 일을 정리하고 예측 가능한 흐름을 만들 때 마음이 편해집니다.",
      appears: "주변에서는 준비성이 있어 보일 수 있지만, 계획이 흔들리면 피로가 빨리 올라올 수 있습니다.",
    },
    P: {
      short: isBorderline ? "열어두고 싶지만 필요할 땐 정리도 하는 타입" : "가능성을 열어두며 움직이는 타입",
      meaning: "처음부터 닫힌 결론을 내리기보다, 상황을 보면서 선택지를 조정하는 쪽이 자연스럽습니다.",
      appears: "유연하고 즉흥적으로 보일 수 있지만, 정리되지 않은 상태가 길어지면 본인도 지칠 수 있습니다.",
    },
  };
  const en: Record<string, { short: string; meaning: string; appears: string }> = {
    E: {
      short: isBorderline ? "Open to people, but still needs personal space" : "Energized by connection and outside stimulation",
      meaning: "Your thoughts and energy often come alive through conversation, activity, and outside input.",
      appears: "You may seem outgoing, but you do not necessarily become close to everyone at the same speed.",
    },
    I: {
      short: isBorderline ? "Needs alone time without avoiding people entirely" : "Recovers energy through time alone",
      meaning: "Quiet time is not just rest for you; it is how your mind and energy reset.",
      appears: "You may not dislike people, but you can need recovery time after social plans.",
    },
    S: {
      short: isBorderline ? "Moves between practicality and possibility" : "Notices concrete facts and practical flow first",
      meaning: "You value what is visible, proven, experienced, and likely to work in real life.",
      appears: "You may look for evidence before buying into abstract ideas.",
    },
    N: {
      short: isBorderline ? "Sees possibility while keeping some practical sense" : "Notices possibility and meaning first",
      meaning: "You often notice patterns, symbols, future angles, and hidden meaning before the obvious facts.",
      appears: "You may connect ideas quickly and talk about possibilities that have not happened yet.",
    },
    T: {
      short: isBorderline ? "Uses both analysis and empathy" : "Organizes decisions through logic and standards",
      meaning: "You try to check standards, causes, and consequences before getting swept up in emotion.",
      appears: "You may seem composed or direct, with emotional expression arriving later.",
    },
    F: {
      short: isBorderline ? "Uses both empathy and analysis" : "Decides with people and meaning in view",
      meaning: "Efficiency matters, but people, relational context, and meaning are hard for you to leave out.",
      appears: "You may seem warm and considerate while still holding practical standards inside.",
    },
    J: {
      short: isBorderline ? "Likes some order, but still has room for spontaneity" : "Feels steadier with plans and deadlines",
      meaning: "Your mind relaxes when tasks are organized and the next step is predictable.",
      appears: "You may look prepared, but sudden changes can drain you faster than people expect.",
    },
    P: {
      short: isBorderline ? "Keeps options open, but can organize when needed" : "Moves by keeping possibilities open",
      meaning: "You prefer adjusting choices as the situation unfolds rather than closing the answer too early.",
      appears: "You can look flexible and spontaneous, though long-term disorder can still tire you out.",
    },
  };

  return (locale === "ko" ? ko : en)[dim.side] ?? {
    short: code,
    meaning: code,
    appears: code,
  };
}

function friendCommentLines(result: FullResult, locale: "ko" | "en"): string[] {
  const linesKo = [
    result.E.side === "I"
      ? "너 혼자 있는 시간 없으면 바로 방전되잖아."
      : "너 사람 만나면 갑자기 에너지 올라오는 편이잖아.",
    result.S.side === "N"
      ? "아이디어는 많은데 정리까지 가는 데 시간이 걸릴 때가 있어."
      : "너는 말보다 실제로 되는지부터 확인하려고 하잖아.",
    result.T.side === "F"
      ? "감성적인데 가끔 의외로 현실적으로 판단해."
      : "차분하게 분석하는데, 은근히 사람 마음도 신경 써.",
  ];
  const linesEn = [
    result.E.side === "I"
      ? "You run out of battery fast when you do not get alone time."
      : "You suddenly light up when you are around people.",
    result.S.side === "N"
      ? "You have a lot of ideas, but organizing them can take a while."
      : "You always want to know whether it actually works first.",
    result.T.side === "F"
      ? "You are emotional, but sometimes surprisingly practical."
      : "You analyze calmly, but you still notice how people feel.",
  ];
  return locale === "ko" ? linesKo : linesEn;
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
  const leftValue = Math.round(((dim.rawAvg + 4) / 8) * 100);
  const rightValue = 100 - leftValue;
  const leansLeft = ["E", "S", "T", "J"].includes(dim.side);
  const tilt = strength < 38
    ? t("약한 기울기", "soft tilt")
    : strength < 63
    ? t("중간 기울기", "moderate tilt")
    : t("뚜렷한 기울기", "clear tilt");
  const sideName = sideLabel(dim.side, t);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
            {dimensionLabel(dim.dimension, t)}
          </div>
          <div className="mt-1 text-base font-bold text-white">
            {dim.side}
            {dim.level} · {sideName} {t("쪽", "side")} {tilt}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            {info.title[locale]} · {t("숫자는 정답률이 아니라 이 축에서 한쪽으로 기운 정도입니다.", "This number is not an accuracy score; it shows how much this axis tilted.")}
          </p>
        </div>
        <div className="shrink-0 text-right font-mono text-xs font-bold text-gray-300">
          <div>{left} {leftValue}%</div>
          <div>{right} {rightValue}%</div>
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

function sideLabel(
  side: string,
  t: (ko: string, en: string) => string,
): string {
  switch (side) {
    case "E": return t("외향", "E");
    case "I": return t("내향", "I");
    case "S": return t("감각", "S");
    case "N": return t("직관", "N");
    case "T": return t("사고", "T");
    case "F": return t("감정", "F");
    case "J": return t("판단", "J");
    case "P": return t("인식", "P");
    default: return side;
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
