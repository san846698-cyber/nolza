"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { homeBackLabel } from "@/app/components/BrandMark";
import ReadableQuestion from "@/app/components/game/ReadableQuestion";
import ResultScreen from "@/app/components/game/ResultScreen";
import { QuestionTransition } from "@/app/components/motion/Motion";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  trackQuestionAnswered,
  trackResultView,
  trackRetryClick,
  trackTestStart,
} from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  POLITICAL_AGREEMENT_OPTIONS,
  POLITICAL_QUESTIONS,
  POLITICAL_TEST_COPY,
  calculatePoliticalAnswer,
  calculatePoliticalResult,
  getPoliticalAxisInterpretation,
  getPoliticalResultById,
  isPoliticalResultId,
  localized,
  resultMidpoint,
  spectrumPercent,
  type PoliticalAnswer,
  type PoliticalAgreementValue,
  type PoliticalResult,
  type PoliticalResultId,
} from "@/lib/political-type-test";

type Phase = "intro" | "quiz" | "result";

type PoliticalSharePayload = {
  v: 1;
  resultId: PoliticalResultId;
  score: number;
  orderFreedomScore?: number;
  locale?: SimpleLocale;
};

const TEST_ID = "political-type";
const TEST_PATH = "/tests/political-type";

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function safeScore(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(-100, Math.min(100, Math.round(value)));
}

function politicalAxisTag(locale: SimpleLocale, score: number): string {
  if (score <= -33) return t(locale, "진보 성향", "progressive-leaning");
  if (score >= 33) return t(locale, "보수 성향", "conservative-leaning");
  return t(locale, "중도 성향", "center-leaning");
}

function orderFreedomTag(locale: SimpleLocale, score: number): string {
  if (score >= 14) return t(locale, "질서 우선", "order first");
  if (score <= -14) return t(locale, "자유 우선", "freedom first");
  return t(locale, "자유와 질서 균형", "balanced freedom and order");
}

function resultBarPercent(value: number, neutral: boolean): number {
  if (value === 0 || neutral) return 50;
  return spectrumPercent(value);
}

export default function PoliticalTypeTestClient(): ReactElement {
  const { locale, setLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PoliticalAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<{ result: PoliticalResult; score: number; orderFreedomScore: number } | null>(null);

  useEffect(() => {
    const payload = decodeSharePayload<PoliticalSharePayload>(new URLSearchParams(window.location.search).get("s"));
    if (payload?.v !== 1 || !isPoliticalResultId(payload.resultId)) return;

    const result = getPoliticalResultById(payload.resultId);
    if (!result) return;

    const restoreId = window.setTimeout(() => {
      setSharedResult({
        result,
        score: safeScore(payload.score, resultMidpoint(result)),
        orderFreedomScore: safeScore(payload.orderFreedomScore, 0),
      });
      setPhase("result");
      setQuestionIndex(POLITICAL_QUESTIONS.length - 1);
      setAnswers([]);
      if (payload.locale === "ko" || payload.locale === "en") setLocale(payload.locale);
    }, 0);

    return () => window.clearTimeout(restoreId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = POLITICAL_QUESTIONS[questionIndex];
  const calculated = useMemo(() => calculatePoliticalResult(answers), [answers]);
  const result = sharedResult?.result ?? calculated.result;
  const score = sharedResult?.score ?? calculated.normalizedScore;
  const orderFreedomScore = sharedResult?.orderFreedomScore ?? calculated.orderFreedomScore;
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / POLITICAL_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase !== "quiz") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result") trackResultView(TEST_ID, result.id);
  }, [phase, result.id]);

  const start = useCallback(() => {
    trackTestStart(TEST_ID, POLITICAL_TEST_COPY.title.en);
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    if (window.location.search) window.history.replaceState(null, "", TEST_PATH);
  }, []);

  const retry = useCallback(() => {
    trackRetryClick(TEST_ID, "test");
    start();
  }, [start]);

  const choose = useCallback((agreement: PoliticalAgreementValue) => {
    trackQuestionAnswered(TEST_ID, questionIndex + 1);
    const nextAnswers = [
      ...answers,
      calculatePoliticalAnswer(currentQuestion, agreement),
    ];

    setAnswers(nextAnswers);
    setSharedResult(null);

    if (questionIndex >= POLITICAL_QUESTIONS.length - 1) {
      const next = calculatePoliticalResult(nextAnswers);
      const url = buildShareUrl(TEST_PATH, {
        v: 1,
        resultId: next.result.id,
        score: next.normalizedScore,
        orderFreedomScore: next.orderFreedomScore,
        locale,
      } satisfies PoliticalSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }

    setQuestionIndex((value) => value + 1);
  }, [answers, currentQuestion, locale, questionIndex]);

  const shareUrl = useMemo(
    () =>
      buildShareUrl(TEST_PATH, {
        v: 1,
        resultId: result.id,
        score,
        orderFreedomScore,
        locale,
      } satisfies PoliticalSharePayload),
    [result.id, score, orderFreedomScore, locale],
  );

  const shareText = locale === "ko"
    ? `나는 ${result.title.ko} (${result.englishLabel})\n정치성향 테스트: 나는 사회를 어떤 기준으로 판단할까?`
    : `I got ${result.englishLabel} on the Political Orientation Test.`;

  const rootStyle = {
    "--accent": "#2563eb",
    "--result-accent": result.accent,
  } as CSSProperties;

  return (
    <main className="anime-test" data-test="political" style={rootStyle} lang={locale}>
      <section className="anime-shell">
        <nav className="anime-back">
          <Link href="/">{homeBackLabel(locale)}</Link>
          <div className="political-locale" aria-label={t(locale, "언어 선택", "Language selection")}>
            <button
              type="button"
              className={locale === "ko" ? "active" : ""}
              onClick={() => setLocale("ko")}
            >
              KO
            </button>
            <button
              type="button"
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
          </div>
        </nav>

        {phase === "intro" ? (
          <IntroView locale={locale} onStart={start} />
        ) : phase === "quiz" && currentQuestion ? (
          <section className="anime-card">
            <div className="anime-prog">
              <span>{t(locale, "질문", "Question")}</span>
              <strong>
                {questionIndex + 1}/{POLITICAL_QUESTIONS.length}
              </strong>
            </div>
            <div className="anime-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>
            <QuestionTransition motionKey={questionIndex}>
              <ReadableQuestion prompt={localized(locale, currentQuestion.statement)} locale={locale} />
              <QuestionScale key={currentQuestion.id} locale={locale} onChoose={choose} />
            </QuestionTransition>
          </section>
        ) : (
          <ResultScreen
            locale={locale}
            currentGameId={TEST_ID}
            eyebrow={
              Boolean(sharedResult)
                ? t(locale, "공유된 결과", "Shared result")
                : POLITICAL_TEST_COPY.resultLabel[locale]
            }
            gameName={POLITICAL_TEST_COPY.title[locale]}
            title={localized(locale, result.title)}
            description={localized(locale, result.summary)}
            details={[
              localized(locale, getPoliticalAxisInterpretation(score, orderFreedomScore).label),
              `${t(locale, "당신이 먼저 묻는 질문", "You first ask")} · ${localized(locale, result.basis)}`,
              `${t(locale, "강점", "Strength")} · ${localized(locale, result.strength)}`,
            ]}
            tone="navy"
            accentColor={result.accent}
            shareTitle={POLITICAL_TEST_COPY.title[locale]}
            shareText={shareText}
            shareUrl={shareUrl}
            onReplay={retry}
            replayLabel={sharedResult ? t(locale, "나도 해보기", "Try it myself") : POLITICAL_TEST_COPY.retry[locale]}
          >
            <PoliticalResultDetail
              locale={locale}
              result={result}
              score={score}
              orderFreedomScore={orderFreedomScore}
            />
          </ResultScreen>
        )}
      </section>

      <style jsx global>{styles}</style>
    </main>
  );
}

function IntroView({ locale, onStart }: { locale: SimpleLocale; onStart: () => void }): ReactElement {
  return (
    <>
      <section className="anime-hero">
        <span className="anime-eyebrow">{t(locale, "사회 가치관 테스트", "Social Values Test")}</span>
        <h1 className="anime-title">{POLITICAL_TEST_COPY.title[locale]}</h1>
        <p className="anime-sub">{POLITICAL_TEST_COPY.subtitle[locale]}</p>
        <p className="anime-desc">{POLITICAL_TEST_COPY.description[locale]}</p>
        <p className="political-intro-note">
          {t(
            locale,
            "이 테스트는 좌우 성향뿐 아니라, 자유와 질서를 바라보는 감각까지 함께 살펴봅니다.",
            "This test looks not only at left-right orientation, but also at how you balance freedom and order.",
          )}
        </p>
        <div className="anime-chips" aria-label={t(locale, "테스트 정보", "Test info")}>
          <span>{POLITICAL_TEST_COPY.questionCount[locale]}</span>
          <span>{POLITICAL_TEST_COPY.time[locale]}</span>
          <span>{POLITICAL_TEST_COPY.valueBased[locale]}</span>
        </div>
        <button type="button" className="anime-cta" onClick={onStart}>
          {POLITICAL_TEST_COPY.start[locale]}
        </button>
        <p className="anime-notice">{POLITICAL_TEST_COPY.disclaimer[locale]}</p>
      </section>

      <section className="political-guide" aria-label={t(locale, "테스트 안내", "Test guide")}>
        <div>
          <span>{t(locale, "What it measures", "What it measures")}</span>
          <h2>{t(locale, "이 테스트가 보는 것", "What this test measures")}</h2>
          <p>
            {t(
              locale,
              "좌우 성향뿐 아니라 자유와 질서, 평등과 경쟁, 복지와 시장, 변화와 안정, 개인 책임과 사회 책임을 함께 살펴봅니다.",
              "It looks at what you agree with when facing social issues: freedom or order, equality or competition, welfare or market, change or stability, individual or social responsibility.",
            )}
          </p>
        </div>
        <div>
          <span>{t(locale, "How to read", "How to read")}</span>
          <h2>{t(locale, "결과 해석 방법", "How to interpret the result")}</h2>
          <p>
            {t(
              locale,
              "각 문항은 동의 정도에 따라 좌우 축과 자유-질서 축에 반영됩니다. 좌우 점수는 기존 7가지 결과 유형을 정하고, 두 번째 축은 가치 지도의 위치를 보여줍니다.",
              "Each statement contributes by agreement level. The left-right score determines the existing seven result types, while the second axis places you on the value map.",
            )}
          </p>
        </div>
        <div>
          <span>{t(locale, "What it is not", "What it is not")}</span>
          <h2>{t(locale, "이 테스트가 보지 않는 것", "What this test does not measure")}</h2>
          <p>
            {t(
              locale,
              "정당 지지, 투표 의향, 정치인 선호, 특정 선거 판단을 묻지 않습니다. 결과는 조언이나 추천이 아니라 가치관을 읽어보는 콘텐츠입니다.",
              "It does not ask about party support, voting intent, politician preference, or election choices. Results are a values reflection, not advice or recommendation.",
            )}
          </p>
        </div>
      </section>

      <section className="political-faq" aria-label={t(locale, "자주 묻는 질문", "FAQ")}>
        <h2>{t(locale, "짧은 FAQ", "Short FAQ")}</h2>
        <details open>
          <summary>{t(locale, "이 결과가 내 실제 정치 입장을 정확히 말하나요?", "Does this result precisely define my politics?")}</summary>
          <p>{t(locale, "아닙니다. 제한된 문항으로 읽어보는 경향성입니다. 실제 입장은 주제, 경험, 정보에 따라 달라질 수 있습니다.", "No. It is a tendency based on limited questions. Real views can change by topic, experience, and information.")}</p>
        </details>
        <details>
          <summary>{t(locale, "투표 조언인가요?", "Is this voting advice?")}</summary>
          <p>{t(locale, "아닙니다. 누구를 지지하거나 어떤 선택을 하라고 말하지 않습니다.", "No. It does not tell you whom to support or what choice to make.")}</p>
        </details>
        <details>
          <summary>{t(locale, "친구와 비교해도 괜찮나요?", "Can I compare this with friends?")}</summary>
          <p>{t(locale, "가능합니다. 다만 결과를 낙인이나 조롱으로 쓰지 말고, 서로가 사회를 보는 기준을 이해하는 대화로 쓰는 것이 좋습니다.", "Yes. Use it to understand each other's standards, not to label or mock anyone.")}</p>
        </details>
      </section>
    </>
  );
}

function QuestionScale({
  locale,
  onChoose,
}: {
  locale: SimpleLocale;
  onChoose: (agreement: PoliticalAgreementValue) => void;
}): ReactElement {
  const [selected, setSelected] = useState<PoliticalAgreementValue | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChoose = useCallback((agreement: PoliticalAgreementValue) => {
    if (selected !== null) return;
    setSelected(agreement);
    timeoutRef.current = window.setTimeout(() => {
      onChoose(agreement);
    }, 170);
  }, [onChoose, selected]);

  return (
    <div className="political-scale-block">
      <p className="political-agreement-hint">
        {t(locale, "이 문장에 얼마나 동의하나요?", "How much do you agree with this statement?")}
      </p>
      <div className="political-scale-wrap" aria-label={t(locale, "동의 응답 선택", "Agreement response selection")}>
        <span className="political-scale-end political-scale-end--agree">{t(locale, "그렇다", "Agree")}</span>
        <div className="political-agreement-scale">
          {POLITICAL_AGREEMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`political-scale-dot ${selected === option.value ? "selected" : ""}`}
              onClick={() => handleChoose(option.value)}
              aria-label={localized(locale, option.label)}
              aria-pressed={selected === option.value}
              disabled={selected !== null}
            >
              <span aria-hidden />
              <strong>{localized(locale, option.label)}</strong>
            </button>
          ))}
        </div>
        <span className="political-scale-end political-scale-end--disagree">{t(locale, "그렇지 않다", "Disagree")}</span>
      </div>
    </div>
  );
}

function PoliticalResultBars({
  locale,
  score,
  orderFreedomScore,
}: {
  locale: SimpleLocale;
  score: number;
  orderFreedomScore: number;
}): ReactElement {
  const leftRightReading = politicalAxisTag(locale, score);
  const orderFreedomReading = orderFreedomTag(locale, orderFreedomScore);
  const bars = [
    {
      label: t(locale, "좌우 성향", "Left-right tendency"),
      value: score,
      neutral: score > -33 && score < 33,
      reading: leftRightReading,
      left: t(locale, "진보", "Progressive"),
      center: t(locale, "중도", "Center"),
      right: t(locale, "보수", "Conservative"),
    },
    {
      label: t(locale, "자유-질서 성향", "Freedom-order tendency"),
      value: orderFreedomScore,
      neutral: orderFreedomScore > -14 && orderFreedomScore < 14,
      reading: orderFreedomReading,
      left: t(locale, "자유 중시", "Freedom first"),
      center: t(locale, "균형", "Balance"),
      right: t(locale, "질서 중시", "Order first"),
    },
  ];

  return (
    <section className="political-result-bars" aria-label={t(locale, "성향 점수 요약", "Tendency score summary")}>
      <div className="political-result-bars-head">
        <span>{t(locale, "성향 요약", "Tendency summary")}</span>
        <h3>{t(locale, "복잡한 지도 대신 핵심 축만 보여드립니다", "The key axes, without the complex map")}</h3>
        <p>
          {t(
            locale,
            "결과 유형은 그대로 유지하고, 좌우 성향과 자유-질서 감각만 간단한 막대로 정리했습니다.",
            "The result type stays the same, with left-right tendency and freedom-order preference summarized as simple bars.",
          )}
        </p>
      </div>
      <div className="political-result-bar-list">
        {bars.map((bar) => (
          <div className="political-result-bar-card" key={bar.label}>
            <div className="political-result-bar-top">
              <span>{bar.label}</span>
              <strong>{bar.reading}</strong>
            </div>
            <div className="political-result-bar-track">
              <i style={{ left: `${resultBarPercent(bar.value, bar.neutral)}%` }} />
            </div>
            <div className="political-result-bar-labels">
              <span>{bar.left}</span>
              <span>{bar.center}</span>
              <span>{bar.right}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PoliticalResultDetail({
  locale,
  result,
  score,
  orderFreedomScore,
}: {
  locale: SimpleLocale;
  result: PoliticalResult;
  score: number;
  orderFreedomScore: number;
}): ReactElement {
  const axisInterpretation = getPoliticalAxisInterpretation(score, orderFreedomScore);

  return (
    <div className="political-detail">
      <strong className="political-axis-summary">{localized(locale, axisInterpretation.label)}</strong>

      <PoliticalResultBars
        locale={locale}
        score={score}
        orderFreedomScore={orderFreedomScore}
      />

      <div className="political-result-copy">
        {result.description.map((paragraph) => (
          <p key={paragraph.ko}>{localized(locale, paragraph)}</p>
        ))}
      </div>

      <div className="political-result-grid">
        <section>
          <span>{t(locale, "당신의 숨은 기준", "Your hidden standard")}</span>
          <p>{localized(locale, axisInterpretation.detail)}</p>
        </section>
        <section>
          <span>{t(locale, "당신이 가장 먼저 묻는 질문", "The first question you ask")}</span>
          <p>{localized(locale, result.basis)}</p>
        </section>
        <section>
          <span>{t(locale, "당신이 강한 지점", "Where you are strong")}</span>
          <p>{localized(locale, result.strength)}</p>
        </section>
        <section>
          <span>{t(locale, "팩트폭행 / 주의할 점", "Reality check / watch-out")}</span>
          <p>{localized(locale, result.caution)}</p>
        </section>
        <section>
          <span>{t(locale, "친구가 보면 하는 말", "What a friend might say")}</span>
          <p>{localized(locale, result.friendLine)}</p>
        </section>
        <section>
          <span>{t(locale, "당신을 설득하는 방식", "What persuades you")}</span>
          <p>{localized(locale, result.conversationStyle)}</p>
        </section>
        <section className="political-final-line">
          <span>{t(locale, "마지막 한 줄", "Final line")}</span>
          <p>{localized(locale, result.finalLine)}</p>
        </section>
      </div>

      <p className="political-disclaimer political-disclaimer--result">{POLITICAL_TEST_COPY.disclaimer[locale]}</p>
    </div>
  );
}

// 애니 테스트 디자인 시스템(.anime-*) 위에 얹는 정치 테스트 전용 조정.
// 기본 다크/글래스는 globals.css의 .anime-test 및 .anime-test[data-test="political"]에서 상속.
// 여기서는 애니 시스템에 없는 요소(언어 토글, 동의 척도, 결과 2축 막대/그리드)만 다룬다.
const styles = `
  /* 상단 언어 토글 — anime-back 안에 우측 정렬 */
  .anime-test[data-test="political"] .anime-back {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .anime-test[data-test="political"] .political-locale {
    display: inline-flex;
    padding: 4px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
  }
  .anime-test[data-test="political"] .political-locale button {
    min-width: 44px;
    min-height: 40px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(243, 246, 250, 0.7);
    cursor: pointer;
    padding: 6px 12px;
    font-weight: 800;
    font-size: 13px;
    transition: background 150ms ease, color 150ms ease;
  }
  .anime-test[data-test="political"] .political-locale button.active {
    background: var(--accent);
    color: #08090a;
  }

  /* 인트로 노트 — anime-desc/notice 사이의 강조 문장 */
  .anime-test[data-test="political"] .political-intro-note {
    max-width: 620px;
    margin: 0 0 26px;
    padding: 12px 0 12px 16px;
    border-left: 3px solid var(--accent);
    color: var(--ink-2);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.64;
    word-break: keep-all;
  }

  /* 인트로 안내(guide) + FAQ — 다크 글래스 카드 */
  .anime-test[data-test="political"] .political-guide,
  .anime-test[data-test="political"] .political-faq {
    width: min(100%, 820px);
    margin: 16px auto 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background: rgba(10, 12, 14, 0.62);
    backdrop-filter: blur(16px) saturate(1.05);
    -webkit-backdrop-filter: blur(14px) saturate(1.05);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 20px 50px -30px rgba(0, 0, 0, 0.85);
    padding: clamp(18px, 3vw, 28px);
  }
  .anime-test[data-test="political"] .political-guide {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .anime-test[data-test="political"] .political-guide div {
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 17px;
    background: var(--surface-1);
  }
  .anime-test[data-test="political"] .political-guide span {
    color: var(--accent);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .anime-test[data-test="political"] .political-guide h2,
  .anime-test[data-test="political"] .political-faq h2 {
    margin: 8px 0 8px;
    color: var(--ink);
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: 1.08rem;
    line-height: 1.32;
    word-break: keep-all;
  }
  .anime-test[data-test="political"] .political-guide p,
  .anime-test[data-test="political"] .political-faq p {
    margin: 0;
    color: var(--ink-3);
    font-size: 0.95rem;
    line-height: 1.7;
    font-weight: 600;
    word-break: keep-all;
  }
  .anime-test[data-test="political"] .political-faq details {
    border-top: 1px solid var(--border);
    padding: 14px 0;
  }
  .anime-test[data-test="political"] .political-faq details:first-of-type {
    border-top: 0;
  }
  .anime-test[data-test="political"] .political-faq summary {
    cursor: pointer;
    color: var(--ink);
    font-weight: 800;
    word-break: keep-all;
  }
  .anime-test[data-test="political"] .political-faq p {
    margin-top: 8px;
  }

  /* ── 동의 척도(Likert) — 슬릭한 anime-card 안의 정제된 행 ── */
  .anime-test[data-test="political"] .political-scale-block {
    margin-top: 4px;
  }
  .anime-test[data-test="political"] .political-agreement-hint {
    margin: 0 0 clamp(18px, 3vw, 26px);
    color: var(--accent);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.02em;
    line-height: 1.5;
    word-break: keep-all;
  }
  .anime-test[data-test="political"] .political-scale-wrap {
    display: grid;
    grid-template-columns: minmax(60px, 0.16fr) minmax(0, 1fr) minmax(78px, 0.18fr);
    align-items: start;
    gap: clamp(10px, 2vw, 18px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: clamp(18px, 3vw, 26px);
    background: rgba(10, 12, 14, 0.32);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  .anime-test[data-test="political"] .political-scale-end {
    padding-top: 11px;
    color: var(--ink-3);
    font-size: clamp(0.8rem, 1.2vw, 0.92rem);
    font-weight: 800;
    line-height: 1.25;
    white-space: nowrap;
  }
  .anime-test[data-test="political"] .political-scale-end--disagree {
    text-align: right;
  }
  .anime-test[data-test="political"] .political-agreement-scale {
    --scale-dot-size: 42px;
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    align-items: start;
    justify-items: center;
    gap: clamp(6px, 1.2vw, 12px);
    min-width: 0;
  }
  .anime-test[data-test="political"] .political-agreement-scale::before {
    content: "";
    position: absolute;
    left: calc(var(--scale-dot-size) / 2);
    right: calc(var(--scale-dot-size) / 2);
    top: calc(var(--scale-dot-size) / 2 - 1px);
    height: 2px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    pointer-events: none;
  }
  .anime-test[data-test="political"] .political-scale-dot {
    --dot-color: var(--accent);
    --dot-border: rgba(255, 255, 255, 0.22);
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 11px;
    width: 100%;
    min-width: 0;
    min-height: 96px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 0;
    text-align: center;
    transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease;
  }
  .anime-test[data-test="political"] .political-scale-dot:disabled {
    cursor: default;
    opacity: 0.72;
  }
  .anime-test[data-test="political"] .political-scale-dot.selected:disabled {
    opacity: 1;
  }
  .anime-test[data-test="political"] .political-scale-dot span {
    display: block;
    position: relative;
    z-index: 1;
    width: var(--scale-dot-size);
    height: var(--scale-dot-size);
    border: 2px solid var(--dot-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 0 0 7px rgba(255, 255, 255, 0.03);
    transition: background 180ms ease, border-color 180ms ease, box-shadow 200ms ease, transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .anime-test[data-test="political"] .political-scale-dot strong {
    display: block;
    min-height: 2.8em;
    max-width: 78px;
    color: var(--ink-3);
    font-size: clamp(0.66rem, 1.05vw, 0.78rem);
    line-height: 1.28;
    font-weight: 700;
    word-break: keep-all;
  }
  .anime-test[data-test="political"] .political-scale-dot:not(:disabled):hover {
    transform: translateY(-3px);
  }
  .anime-test[data-test="political"] .political-scale-dot:not(:disabled):active {
    transform: translateY(-1px) scale(0.97);
  }
  .anime-test[data-test="political"] .political-scale-dot:hover span,
  .anime-test[data-test="political"] .political-scale-dot:focus-visible span,
  .anime-test[data-test="political"] .political-scale-dot.selected span {
    background: var(--dot-color);
    border-color: var(--dot-color);
    box-shadow:
      inset 0 0 0 7px rgba(10, 12, 14, 0.55),
      0 12px 26px color-mix(in srgb, var(--dot-color) 30%, transparent),
      0 0 0 5px color-mix(in srgb, var(--dot-color) 14%, transparent);
  }
  .anime-test[data-test="political"] .political-scale-dot.selected span {
    transform: scale(1.08);
  }
  .anime-test[data-test="political"] .political-scale-dot.selected {
    transform: translateY(-2px);
  }
  .anime-test[data-test="political"] .political-scale-dot.selected strong {
    color: var(--ink);
  }
  .anime-test[data-test="political"] .political-scale-dot:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--accent) 45%, transparent);
    outline-offset: 6px;
    border-radius: 999px;
  }

  /* ── 결과 상세 — ResultScreen 카드 children으로 렌더 ── */
  .result-screen--navy .political-detail {
    display: grid;
    gap: 20px;
    margin-top: 22px;
    text-align: left;
  }
  .result-screen--navy .political-axis-summary {
    justify-self: center;
    width: fit-content;
    border: 1px solid color-mix(in srgb, var(--rs-accent, #2563eb) 40%, rgba(255, 255, 255, 0.2));
    border-radius: 999px;
    padding: 8px 14px;
    background: color-mix(in srgb, var(--rs-accent, #2563eb) 16%, transparent);
    color: #f3f6fa;
    font-size: clamp(0.9rem, 1.8vw, 1.05rem);
    font-weight: 800;
    line-height: 1.32;
    text-align: center;
    word-break: keep-all;
  }

  /* 2축 스펙트럼 막대 (좌우 / 자유-질서) — 공유 카드의 중심부 */
  .result-screen--navy .political-result-bars {
    display: grid;
    gap: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    padding: clamp(16px, 2.5vw, 22px);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
  .result-screen--navy .political-result-bars-head {
    display: grid;
    gap: 6px;
  }
  .result-screen--navy .political-result-bars-head span {
    color: rgba(243, 246, 250, 0.72);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .result-screen--navy .political-result-bars-head h3 {
    margin: 0;
    color: #f3f6fa;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: clamp(1.02rem, 2.1vw, 1.28rem);
    line-height: 1.3;
    word-break: keep-all;
  }
  .result-screen--navy .political-result-bars-head p {
    margin: 0;
    color: rgba(243, 246, 250, 0.62);
    font-size: 0.92rem;
    line-height: 1.6;
    word-break: keep-all;
  }
  .result-screen--navy .political-result-bar-list {
    display: grid;
    gap: 12px;
  }
  .result-screen--navy .political-result-bar-card {
    position: relative;
    display: grid;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
  }
  .result-screen--navy .political-result-bar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .result-screen--navy .political-result-bar-top span {
    color: rgba(243, 246, 250, 0.72);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .result-screen--navy .political-result-bar-top strong {
    color: #f3f6fa;
    font-size: 0.94rem;
    font-weight: 800;
    text-align: right;
    word-break: keep-all;
  }
  /* 좌우 축: 파랑(진보) -> 빨강(보수) */
  .result-screen--navy .political-result-bar-card:nth-child(1) .political-result-bar-track {
    background: linear-gradient(90deg, #1d4ed8 0%, #6366f1 50%, #dc2626 100%);
  }
  /* 자유-질서 축: 톤 다운된 파랑 -> 크림슨 */
  .result-screen--navy .political-result-bar-card:nth-child(2) .political-result-bar-track {
    background: linear-gradient(90deg, #60a5fa 0%, #a5b4fc 50%, #fb7185 100%);
  }
  .result-screen--navy .political-result-bar-track {
    position: relative;
    height: 14px;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  }
  .result-screen--navy .political-result-bar-track i {
    position: absolute;
    top: 50%;
    width: 22px;
    height: 22px;
    border: 4px solid #fff;
    border-radius: 999px;
    background: #0f172a;
    box-shadow: 0 9px 22px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(15, 23, 42, 0.4);
    transform: translate(-50%, -50%);
    transition: left 620ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .result-screen--navy .political-result-bar-labels {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    color: rgba(243, 246, 250, 0.6);
    font-size: 0.78rem;
    font-weight: 800;
  }
  .result-screen--navy .political-result-bar-labels span:first-child {
    color: #93b4fb;
  }
  .result-screen--navy .political-result-bar-labels span:nth-child(2) {
    text-align: center;
  }
  .result-screen--navy .political-result-bar-labels span:last-child {
    text-align: right;
    color: #fb9aa5;
  }

  /* 결과 본문 카피 + 상세 그리드 */
  .result-screen--navy .political-result-copy {
    display: grid;
    gap: 12px;
    text-align: left;
  }
  .result-screen--navy .political-result-copy p {
    margin: 0;
    color: rgba(243, 246, 250, 0.82);
    font-size: 1rem;
    line-height: 1.8;
    font-weight: 500;
    word-break: keep-all;
  }
  .result-screen--navy .political-result-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .result-screen--navy .political-result-grid section {
    min-width: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    padding: 16px;
    text-align: left;
  }
  .result-screen--navy .political-result-grid section span {
    color: var(--rs-accent, #93b4fb);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  .result-screen--navy .political-result-grid section p {
    margin: 8px 0 0;
    color: rgba(243, 246, 250, 0.8);
    line-height: 1.68;
    font-weight: 500;
    word-break: keep-all;
  }
  .result-screen--navy .political-final-line {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--rs-accent, #2563eb) 22%, transparent), rgba(255, 255, 255, 0.03)) !important;
  }
  .result-screen--navy .political-final-line p {
    color: #f3f6fa !important;
    font-size: 1.05rem;
    font-weight: 800 !important;
  }
  .result-screen--navy .political-disclaimer--result {
    margin: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.03);
    color: rgba(243, 246, 250, 0.6);
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.6;
    word-break: keep-all;
    text-align: left;
  }

  @media (max-width: 780px) {
    .anime-test[data-test="political"] .political-guide {
      grid-template-columns: 1fr;
    }
    .result-screen--navy .political-result-grid {
      grid-template-columns: 1fr;
    }
    .anime-test[data-test="political"] .political-scale-wrap {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "agree disagree"
        "scale scale";
      gap: 12px;
    }
    .anime-test[data-test="political"] .political-scale-end--agree {
      grid-area: agree;
      text-align: left;
      padding-top: 0;
    }
    .anime-test[data-test="political"] .political-scale-end--disagree {
      grid-area: disagree;
      text-align: right;
      padding-top: 0;
    }
    .anime-test[data-test="political"] .political-agreement-scale {
      grid-area: scale;
    }
  }
  @media (max-width: 520px) {
    .anime-test[data-test="political"] .political-agreement-scale {
      --scale-dot-size: 34px;
      gap: 4px;
    }
    .anime-test[data-test="political"] .political-scale-dot {
      min-height: 84px;
      gap: 8px;
    }
    .anime-test[data-test="political"] .political-scale-dot strong {
      max-width: 48px;
      font-size: 0.6rem;
      line-height: 1.18;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .anime-test[data-test="political"] .political-scale-dot,
    .anime-test[data-test="political"] .political-scale-dot span,
    .result-screen--navy .political-result-bar-track i {
      transition: none !important;
    }
  }
`;
