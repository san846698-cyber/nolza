"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { homeBackLabel } from "@/app/components/BrandMark";
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
  const [shareCopied, setShareCopied] = useState(false);

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
    setShareCopied(false);
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
    setShareCopied(false);

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

  const share = useCallback(async () => {
    trackShareClick(TEST_ID, "test", result.id);
    const url = buildShareUrl(TEST_PATH, {
      v: 1,
      resultId: result.id,
      score,
      orderFreedomScore,
      locale,
    } satisfies PoliticalSharePayload);
    const shareText = locale === "ko"
      ? `나는 ${result.title.ko} (${result.englishLabel})\n정치성향 테스트: 나는 사회를 어떤 기준으로 판단할까?`
      : `I got ${result.englishLabel} on the Political Orientation Test.`;
    const title = POLITICAL_TEST_COPY.title[locale];

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
  }, [locale, orderFreedomScore, result, score]);

  return (
    <main className={`political-page political-page--${phase}`} lang={locale}>
      {phase !== "quiz" && (
        <header className="political-topbar">
          <Link href="/" className="political-home">{homeBackLabel(locale)}</Link>
          <div className="political-locale" aria-label={t(locale, "언어 선택", "Language selection")} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={locale === "ko" ? "active" : ""}
              onClick={(event) => {
                event.stopPropagation();
                setLocale("ko");
              }}
            >
              KO
            </button>
            <button
              type="button"
              className={locale === "en" ? "active" : ""}
              onClick={(event) => {
                event.stopPropagation();
                setLocale("en");
              }}
            >
              EN
            </button>
          </div>
        </header>
      )}

      <section className="political-shell">
        {phase === "intro" ? (
          <IntroView locale={locale} onStart={start} />
        ) : (
          <section className="political-card" style={{ "--result-accent": result.accent } as CSSProperties}>
            <div className={`political-progress-head ${phase === "quiz" ? "political-progress-head--quiz" : ""}`}>
              {phase === "quiz" ? (
                <button
                  type="button"
                  className="political-exit"
                  onClick={() => {
                    setPhase("intro");
                    setQuestionIndex(0);
                    setAnswers([]);
                    setSharedResult(null);
                  }}
                  aria-label={t(locale, "처음 화면으로", "Back to intro")}
                >
                  ×
                </button>
              ) : (
                <span>{POLITICAL_TEST_COPY.resultLabel[locale]}</span>
              )}
              <strong>
                {phase === "result"
                  ? `${POLITICAL_QUESTIONS.length} / ${POLITICAL_QUESTIONS.length}`
                  : `${questionIndex + 1} / ${POLITICAL_QUESTIONS.length}`}
              </strong>
            </div>
            <div className="political-progress" aria-hidden>
              <i style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <QuestionView key={currentQuestion.id} question={currentQuestion} locale={locale} onChoose={choose} />
            ) : (
              <ResultView
                locale={locale}
                result={result}
                score={score}
                orderFreedomScore={orderFreedomScore}
                isShared={Boolean(sharedResult)}
                onRetry={retry}
                onShare={share}
                shareCopied={shareCopied}
              />
            )}
          </section>
        )}
      </section>

      <style jsx global>{styles}</style>
    </main>
  );
}

function IntroView({ locale, onStart }: { locale: SimpleLocale; onStart: () => void }): ReactElement {
  return (
    <>
      <section className="political-intro">
        <div className="political-spectrum-art" aria-hidden>
          <span />
          <i />
        </div>
        <div className="political-intro-layout">
          <div className="political-intro-copy">
            <p className="political-eyebrow">{t(locale, "사회 가치관 테스트", "Social Values Test")}</p>
            <h1>{POLITICAL_TEST_COPY.title[locale]}</h1>
            <p className="political-subtitle">{POLITICAL_TEST_COPY.subtitle[locale]}</p>
            <p className="political-description">{POLITICAL_TEST_COPY.description[locale]}</p>
            <p className="political-intro-note">
              {t(
                locale,
                "이 테스트는 좌우 성향뿐 아니라, 자유와 질서를 바라보는 감각까지 함께 살펴봅니다.",
                "This test looks not only at left-right orientation, but also at how you balance freedom and order.",
              )}
            </p>
            <div className="political-chips" aria-label={t(locale, "테스트 정보", "Test info")}>
              <span>{POLITICAL_TEST_COPY.questionCount[locale]}</span>
              <span>{POLITICAL_TEST_COPY.time[locale]}</span>
              <span>{POLITICAL_TEST_COPY.valueBased[locale]}</span>
            </div>
            <button type="button" className="political-primary" onClick={onStart}>
              {POLITICAL_TEST_COPY.start[locale]}
            </button>
            <p className="political-disclaimer">{POLITICAL_TEST_COPY.disclaimer[locale]}</p>
          </div>
          <PoliticalIntroAxisPanel locale={locale} />
        </div>
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

function PoliticalIntroAxisPanel({ locale }: { locale: SimpleLocale }): ReactElement {
  const axisCards = [
    {
      label: t(locale, "좌우축", "Left-right axis"),
      title: t(locale, "변화와 안정", "Change and stability"),
      text: t(
        locale,
        "왼쪽은 제도 변화와 사회적 책임을 더 먼저 봅니다. 오른쪽은 안정, 책임, 기존 질서가 흔들리지 않는지를 더 먼저 봅니다.",
        "The left side reads issues through change and social responsibility. The right side first checks stability, responsibility, and whether existing order can hold.",
      ),
    },
    {
      label: t(locale, "자유-질서축", "Freedom-order axis"),
      title: t(locale, "개인의 자유와 사회 질서", "Personal freedom and social order"),
      text: t(
        locale,
        "아래쪽은 개인의 선택권과 자율성을 더 중시합니다. 위쪽은 공동체 신뢰, 규칙, 예측 가능한 질서를 더 중시합니다.",
        "The lower side values personal choice and autonomy. The upper side values social trust, rules, and predictable order.",
      ),
    },
    {
      label: t(locale, "결과 위치", "Result position"),
      title: t(locale, "끝나면 두 축으로 정리됩니다", "Your result is summarized on two axes"),
      text: t(
        locale,
        "테스트를 마치면 좌우 성향과 자유-질서 성향을 두 개의 간단한 막대로 보여줍니다.",
        "After the test, two simple bars show your left-right tendency and your freedom-order tendency.",
      ),
    },
  ];

  return (
    <aside className="political-intro-axis-panel" aria-label={t(locale, "2축 결과 안내", "Two-axis result guide")}>
      <div className="political-intro-axis-head">
        <span>{t(locale, "결과는 이렇게 읽습니다", "How to read the result")}</span>
        <h2>{t(locale, "결과는 더 단순하게 보여드립니다", "The result stays simple")}</h2>
        <p>
          {t(
            locale,
            "시작 화면에서는 기준만 가볍게 확인하고, 답변이 끝난 뒤 결과 유형과 두 개의 성향 막대로 정리합니다.",
            "On the start screen, review the standards briefly. After your answers, the result type and two tendency bars summarize your pattern.",
          )}
        </p>
      </div>
      <div className="political-intro-axis-cards">
        {axisCards.map((card) => (
          <article key={card.label} className="political-intro-axis-card">
            <span>{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}

function QuestionView({
  question,
  locale,
  onChoose,
}: {
  question: (typeof POLITICAL_QUESTIONS)[number];
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
    <div className="political-question-view">
      <p className="political-eyebrow">{t(locale, "동의 정도", "Agreement scale")}</p>
      <h2 className="political-statement">{localized(locale, question.statement)}</h2>
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

function ResultView({
  locale,
  result,
  score,
  orderFreedomScore,
  isShared,
  onRetry,
  onShare,
  shareCopied,
}: {
  locale: SimpleLocale;
  result: PoliticalResult;
  score: number;
  orderFreedomScore: number;
  isShared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareCopied: boolean;
}): ReactElement {
  const axisInterpretation = getPoliticalAxisInterpretation(score, orderFreedomScore);

  return (
    <article className="political-result">
      {isShared ? <p className="political-shared">{t(locale, "공유된 결과", "Shared result")}</p> : null}
      <div className="political-result-title">
        <span>{result.englishLabel}</span>
        <h2>{localized(locale, result.title)}</h2>
        <strong className="political-axis-summary">{localized(locale, axisInterpretation.label)}</strong>
        <p>{localized(locale, result.summary)}</p>
      </div>

      <PoliticalResultBars
        locale={locale}
        score={score}
        orderFreedomScore={orderFreedomScore}
      />

      <p className="political-result-core">{localized(locale, result.summary)}</p>
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

      <div className="political-actions">
        <button type="button" className="political-primary" onClick={onShare}>
          {shareCopied ? POLITICAL_TEST_COPY.copied[locale] : POLITICAL_TEST_COPY.share[locale]}
        </button>
        <button type="button" className="political-secondary" onClick={onRetry}>
          {POLITICAL_TEST_COPY.retry[locale]}
        </button>
      </div>
    </article>
  );
}

const styles = `
  .political-page {
    min-height: 100vh;
    min-height: 100svh;
    overflow-x: hidden;
    color: #111827;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.88), rgba(247,250,252,0.96)),
      linear-gradient(135deg, #f0fdfa 0%, #f8fafc 48%, #fafaf9 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
  }
  .political-page * {
    box-sizing: border-box;
  }
  .political-topbar {
    position: relative;
    z-index: 30;
    width: min(1080px, calc(100% - 32px));
    margin: 0 auto;
    padding: 18px 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .political-home {
    color: #334155;
    text-decoration: none;
    font-weight: 800;
  }
  .political-locale {
    position: relative;
    z-index: 40;
    display: inline-flex;
    padding: 4px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.76);
    pointer-events: auto;
    touch-action: manipulation;
  }
  .political-locale button {
    min-width: 44px;
    min-height: 44px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    padding: 8px 12px;
    font-weight: 800;
    touch-action: manipulation;
  }
  .political-locale button.active {
    background: #111827;
    color: #fff;
  }
  .political-shell {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: clamp(28px, 5vh, 58px) 0 70px;
  }
  .political-intro,
  .political-card,
  .political-guide,
  .political-faq {
    border: 1px solid rgba(15, 23, 42, 0.09);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 26px 72px rgba(15, 23, 42, 0.1);
  }
  .political-intro {
    position: relative;
    overflow: hidden;
    display: grid;
    align-content: center;
    width: min(100%, 1040px);
    margin: 0 auto;
    padding: clamp(26px, 5vw, 58px);
    border-radius: 14px;
    isolation: isolate;
  }
  .political-spectrum-art {
    position: absolute;
    right: clamp(20px, 5vw, 58px);
    top: clamp(24px, 5vw, 58px);
    width: min(36vw, 310px);
    aspect-ratio: 1.4;
    border-radius: 22px;
    opacity: 0.3;
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.08), rgba(255, 255, 255, 0.18)),
      url("/thumbnails-generated/political-type-banner.png") center / cover;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
  }
  .political-spectrum-art span {
    position: absolute;
    inset: 18%;
    border: 2px solid rgba(15, 23, 42, 0.35);
    border-radius: 999px;
  }
  .political-spectrum-art i {
    position: absolute;
    left: 50%;
    top: 12%;
    width: 3px;
    height: 76%;
    border-radius: 999px;
    background: #111827;
  }
  .political-intro-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 0.88fr) minmax(360px, 1.12fr);
    align-items: center;
    gap: clamp(24px, 4vw, 46px);
  }
  .political-intro-copy {
    min-width: 0;
  }
  .political-eyebrow,
  .political-progress-head span,
  .political-result-title span,
  .political-result-grid span,
  .political-shared {
    color: #475569;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  .political-eyebrow {
    margin: 0 0 14px;
  }
  .political-intro h1,
  .political-card h2 {
    margin: 0;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    letter-spacing: -0.02em;
    word-break: keep-all;
  }
  .political-intro h1 {
    max-width: 720px;
    color: #0f172a;
    font-size: clamp(32px, 6vw, 56px);
    line-height: 1.04;
    font-weight: 800;
  }
  .political-subtitle {
    max-width: 720px;
    margin: 18px 0 0;
    color: #0f766e;
    font-size: clamp(1.18rem, 2.5vw, 1.55rem);
    line-height: 1.52;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-description,
  .political-disclaimer,
  .political-guide p,
  .political-faq p {
    max-width: 730px;
    line-height: 1.72;
    word-break: keep-all;
  }
  .political-description {
    margin: 14px 0 14px;
    color: rgba(15, 23, 42, 0.76);
    font-size: 1.03rem;
    font-weight: 650;
  }
  .political-intro-note {
    max-width: 640px;
    margin: 0 0 22px;
    border-left: 3px solid #0f766e;
    padding: 12px 0 12px 14px;
    color: #0f172a;
    font-size: 1.02rem;
    font-weight: 800;
    line-height: 1.64;
    word-break: keep-all;
  }
  .political-value-map {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 0.76fr) minmax(320px, 1fr);
    align-items: center;
    gap: clamp(18px, 2.8vw, 30px);
    margin: 22px 0;
    padding: clamp(18px, 2.8vw, 30px);
    border: 1px solid rgba(30, 41, 59, 0.16);
    border-radius: 14px;
    background:
      radial-gradient(circle at 14% 12%, rgba(15, 118, 110, 0.1), transparent 34%),
      radial-gradient(circle at 90% 18%, rgba(120, 113, 108, 0.12), transparent 36%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(244, 242, 236, 0.94)),
      #fbfaf7;
    box-shadow:
      0 28px 70px rgba(15, 23, 42, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
  .political-value-map--intro {
    margin: 0;
    grid-template-columns: 1fr;
    align-self: stretch;
  }
  .political-value-map--result {
    margin: 0;
  }
  .political-value-map-copy {
    min-width: 0;
  }
  .political-value-map-copy span {
    color: #0f766e;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-value-map-copy h2 {
    margin: 8px 0 8px;
    color: #0f172a;
    font-size: clamp(1.1rem, 2.2vw, 1.42rem);
    line-height: 1.34;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-value-map-copy p {
    margin: 0;
    color: rgba(15, 23, 42, 0.72);
    font-size: 0.95rem;
    line-height: 1.68;
    font-weight: 650;
    word-break: keep-all;
  }
  .political-map-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .political-map-tags span {
    width: auto;
    border: 1px solid rgba(30, 41, 59, 0.14);
    border-radius: 999px;
    padding: 8px 11px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(242, 244, 241, 0.94));
    color: #1f2933;
    font-size: 0.82rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: 0;
    text-transform: none;
    word-break: keep-all;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  }
  .political-map-frame {
    position: relative;
    min-width: 0;
    display: grid;
    gap: 14px;
    padding: 44px 50px 18px;
    border: 1px solid rgba(30, 41, 59, 0.14);
    border-radius: 14px;
    background:
      radial-gradient(circle at 20% 12%, rgba(15, 118, 110, 0.09), transparent 34%),
      linear-gradient(180deg, #fbfaf7, #efede6);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 20px 48px rgba(15, 23, 42, 0.12);
  }
  .political-map-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    aspect-ratio: 1;
    min-width: 0;
    overflow: visible;
    border: 1px solid rgba(30, 41, 59, 0.24);
    border-radius: 14px;
    background:
      repeating-linear-gradient(0deg, transparent 0 11.8%, rgba(30, 41, 59, 0.06) 11.95% 12.1%),
      repeating-linear-gradient(90deg, transparent 0 11.8%, rgba(30, 41, 59, 0.06) 11.95% 12.1%),
      linear-gradient(90deg, rgba(15, 118, 110, 0.15), rgba(255, 255, 255, 0.62) 50%, rgba(120, 113, 108, 0.16)),
      linear-gradient(180deg, rgba(31, 41, 55, 0.15), rgba(255, 255, 255, 0.34) 50%, rgba(20, 184, 166, 0.12)),
      #f8f7f3;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.84),
      inset 0 18px 42px rgba(255, 255, 255, 0.34),
      0 22px 48px rgba(15, 23, 42, 0.14);
  }
  .political-map-grid::before,
  .political-map-grid::after {
    content: "";
    position: absolute;
    z-index: 3;
    background: rgba(17, 24, 39, 0.62);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.54);
  }
  .political-map-grid::before {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
  }
  .political-map-grid::after {
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
  }
  .political-map-grid > span {
    position: relative;
    z-index: 2;
    display: grid;
    place-items: start;
    padding: 15px;
    color: rgba(31, 41, 51, 0.7);
    font-size: 0.78rem;
    font-weight: 800;
    line-height: 1.18;
    text-align: left;
    word-break: keep-all;
    opacity: 0.7;
    transition: opacity 160ms ease, background 160ms ease, box-shadow 160ms ease;
  }
  .political-map-grid > span:nth-child(1) {
    background: linear-gradient(135deg, rgba(15, 118, 110, 0.13), rgba(255, 255, 255, 0.2));
  }
  .political-map-grid > span:nth-child(2) {
    background: linear-gradient(225deg, rgba(120, 113, 108, 0.14), rgba(255, 255, 255, 0.2));
  }
  .political-map-grid > span:nth-child(3) {
    background: linear-gradient(45deg, rgba(20, 184, 166, 0.11), rgba(255, 255, 255, 0.22));
  }
  .political-map-grid > span:nth-child(4) {
    background: linear-gradient(315deg, rgba(87, 83, 78, 0.12), rgba(255, 255, 255, 0.22));
  }
  .political-map-grid > span.active {
    opacity: 1;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--result-accent, #0f766e) 26%, rgba(255, 255, 255, 0.66)), rgba(255, 255, 255, 0.5));
    color: #111827;
    box-shadow:
      inset 0 0 0 2px color-mix(in srgb, var(--result-accent, #0f766e) 54%, rgba(17, 24, 39, 0.16)),
      inset 0 0 54px color-mix(in srgb, var(--result-accent, #0f766e) 17%, transparent);
  }
  .political-map-axis {
    position: absolute;
    z-index: 5;
    border: 1px solid rgba(30, 41, 59, 0.16);
    border-radius: 999px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.94);
    color: #172026;
    font-size: 0.77rem;
    font-weight: 800;
    white-space: nowrap;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  }
  .political-map-axis--top,
  .political-map-axis--bottom {
    left: 50%;
    transform: translateX(-50%);
  }
  .political-map-axis--top {
    top: 14px;
  }
  .political-map-axis--bottom {
    bottom: 14px;
  }
  .political-map-axis--left,
  .political-map-axis--right {
    top: 50%;
    transform: translateY(-50%);
  }
  .political-map-axis--left {
    left: 10px;
  }
  .political-map-axis--right {
    right: 10px;
  }
  .political-map-marker,
  .political-map-center {
    position: absolute;
    z-index: 8;
    left: 50%;
    top: 50%;
    width: 46px;
    height: 46px;
    border: 6px solid #fff;
    border-radius: 999px;
    background: #0f172a;
    box-shadow:
      0 16px 30px rgba(15, 23, 42, 0.34),
      0 0 0 3px color-mix(in srgb, var(--result-accent, #0f766e) 22%, transparent);
    transform: translate(-50%, -50%);
  }
  .political-map-center {
    opacity: 0.36;
  }
  .political-map-marker b {
    position: absolute;
    left: 50%;
    top: calc(100% + 10px);
    transform: translateX(-50%);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    padding: 7px 10px;
    background: #111827;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.3);
  }
  .political-map-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2px;
  }
  .political-map-stats span {
    min-height: 34px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(30, 41, 59, 0.13);
    border-radius: 999px;
    padding: 8px 11px;
    background: rgba(255, 255, 255, 0.86);
    color: rgba(31, 41, 55, 0.72);
    font-size: 0.78rem;
    font-weight: 850;
    line-height: 1.15;
    word-break: keep-all;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  }
  .political-map-stats strong {
    color: #111827;
    font-weight: 800;
  }
  .political-disclaimer {
    width: fit-content;
    margin: 14px 0 0;
    padding: 12px 14px;
    border: 1px solid rgba(15, 118, 110, 0.16);
    border-radius: 14px;
    background: rgba(240, 253, 250, 0.82);
    color: #475569;
    font-size: 0.92rem;
    font-weight: 750;
  }
  .political-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 22px;
  }
  .political-chips span {
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 999px;
    background: #f8fafc;
    color: #334155;
    padding: 8px 11px;
    font-size: 0.84rem;
    font-weight: 800;
  }
  .political-primary,
  .political-secondary {
    min-height: 52px;
    border-radius: 10px;
    padding: 0 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 800;
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }
  .political-primary {
    border: 0;
    color: #fff;
    background: linear-gradient(135deg, #0f766e, #111827);
    box-shadow: 0 16px 36px rgba(15, 118, 110, 0.2);
  }
  .political-secondary {
    color: #111827;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.13);
  }
  .political-primary:hover,
  .political-secondary:hover {
    transform: translateY(-2px);
  }
  .political-guide {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin: 22px auto 0;
    width: min(100%, 960px);
    border-radius: 14px;
    padding: clamp(18px, 3vw, 28px);
  }
  .political-guide div {
    min-width: 0;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 14px;
    padding: 17px;
    background: #f8fafc;
  }
  .political-guide span {
    color: #0f766e;
    font-size: 0.73rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-guide h2,
  .political-faq h2 {
    margin: 8px 0 8px;
    color: #0f172a;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: 1.12rem;
    line-height: 1.32;
    word-break: keep-all;
  }
  .political-guide p,
  .political-faq p {
    margin: 0;
    color: rgba(15, 23, 42, 0.72);
    font-weight: 650;
  }
  .political-faq {
    width: min(100%, 960px);
    margin: 16px auto 0;
    border-radius: 14px;
    padding: clamp(18px, 3vw, 28px);
  }
  .political-faq details {
    border-top: 1px solid rgba(15, 23, 42, 0.08);
    padding: 14px 0;
  }
  .political-faq details:first-of-type {
    border-top: 0;
  }
  .political-faq summary {
    cursor: pointer;
    color: #111827;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-faq p {
    margin-top: 8px;
  }
  .political-card {
    border-radius: 14px;
    padding: clamp(22px, 4.5vw, 46px);
  }
  .political-progress-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .political-progress-head strong {
    color: #475569;
    font-weight: 800;
  }
  .political-exit {
    display: inline-grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 999px;
    background: #fff;
    color: #334155;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 800;
    line-height: 1;
  }
  .political-progress {
    height: 8px;
    overflow: hidden;
    margin-top: 12px;
    border-radius: 999px;
    background: #e2e8f0;
  }
  .political-progress i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #0f766e, #e2e8f0, #a16207);
    transition: width 220ms ease;
  }
  .political-question-view {
    padding-top: clamp(26px, 5vw, 42px);
  }
  .political-question-view h2 {
    max-width: 850px;
    color: #0f172a;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: clamp(1.48rem, 3.5vw, 2.6rem);
    line-height: 1.34;
    letter-spacing: -0.02em;
    font-weight: 800;
  }
  .political-statement {
    overflow-wrap: anywhere;
    word-break: keep-all;
  }
  .political-agreement-hint {
    margin: 16px 0 0;
    color: #64748b;
    font-size: 1rem;
    font-weight: 850;
    line-height: 1.5;
    word-break: keep-all;
  }
  .political-scale-wrap {
    display: grid;
    grid-template-columns: minmax(62px, 0.16fr) minmax(0, 1fr) minmax(78px, 0.18fr);
    align-items: start;
    gap: clamp(12px, 2vw, 20px);
    margin-top: clamp(30px, 5vw, 46px);
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 14px;
    padding: clamp(20px, 3vw, 28px);
    background: #fff;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.055);
  }
  .political-scale-end {
    padding-top: 11px;
    color: #475569;
    font-size: clamp(0.8rem, 1.2vw, 0.94rem);
    font-weight: 850;
    line-height: 1.25;
    white-space: nowrap;
  }
  .political-scale-end--agree {
    color: #475569;
  }
  .political-scale-end--disagree {
    color: #475569;
    text-align: right;
  }
  .political-agreement-scale {
    --scale-dot-size: 44px;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    align-items: start;
    justify-items: center;
    gap: clamp(6px, 1.2vw, 12px);
    min-width: 0;
    position: relative;
  }
  .political-agreement-scale::before {
    content: "";
    position: absolute;
    left: calc(var(--scale-dot-size) / 2);
    right: calc(var(--scale-dot-size) / 2);
    top: calc(var(--scale-dot-size) / 2 - 1px);
    height: 2px;
    border-radius: 999px;
    background: #d8dee7;
    pointer-events: none;
  }
  .political-scale-dot {
    --dot-color: #0f766e;
    --dot-border: #b8c2cf;
    --dot-fill: #ffffff;
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 11px;
    width: 100%;
    min-width: 0;
    min-height: 96px;
    border: 0;
    background: transparent;
    color: #334155;
    cursor: pointer;
    padding: 0;
    text-align: center;
    transition: transform 160ms ease, opacity 160ms ease;
  }
  .political-scale-dot:disabled {
    cursor: default;
    opacity: 0.78;
  }
  .political-scale-dot.selected:disabled {
    opacity: 1;
  }
  .political-scale-dot span {
    display: block;
    position: relative;
    z-index: 1;
    width: var(--scale-dot-size);
    height: var(--scale-dot-size);
    border: 2px solid var(--dot-border);
    border-radius: 999px;
    background: var(--dot-fill);
    box-shadow:
      inset 0 0 0 8px #f8fafc,
      0 8px 18px rgba(15, 23, 42, 0.06);
    transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  }
  .political-scale-dot strong {
    display: block;
    min-height: 2.8em;
    max-width: 78px;
    color: rgba(15, 23, 42, 0.68);
    font-size: clamp(0.68rem, 1.05vw, 0.8rem);
    line-height: 1.28;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-scale-dot:hover span,
  .political-scale-dot:focus-visible span,
  .political-scale-dot.selected span {
    background: var(--dot-color);
    border-color: var(--dot-color);
    box-shadow:
      inset 0 0 0 8px rgba(255, 255, 255, 0.92),
      0 12px 26px color-mix(in srgb, var(--dot-color) 18%, transparent),
      0 0 0 5px color-mix(in srgb, var(--dot-color) 10%, transparent);
  }
  .political-scale-dot:focus-visible {
    outline: 3px solid rgba(15, 23, 42, 0.18);
    outline-offset: 6px;
    border-radius: 999px;
  }
  .political-scale-dot.selected strong {
    color: #0f172a;
  }
  .political-result {
    display: grid;
    gap: 22px;
    padding-top: 28px;
  }
  .political-shared {
    width: fit-content;
    margin: 0;
    border: 1px solid rgba(15, 118, 110, 0.18);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(15, 118, 110, 0.07);
  }
  .political-result-title h2 {
    margin-top: 8px;
    color: #0f172a;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: clamp(2rem, 5vw, 54px);
    line-height: 1.04;
    letter-spacing: -0.02em;
    font-weight: 800;
  }
  .political-result-title p {
    max-width: 780px;
    margin: 12px 0 0;
    color: var(--result-accent);
    font-size: clamp(1.08rem, 2.4vw, 1.36rem);
    font-weight: 800;
    line-height: 1.52;
    word-break: keep-all;
  }
  .political-axis-summary {
    display: inline-flex;
    width: fit-content;
    margin-top: 12px;
    border: 1px solid color-mix(in srgb, var(--result-accent) 22%, transparent);
    border-radius: 999px;
    padding: 8px 12px;
    background: color-mix(in srgb, var(--result-accent) 8%, white);
    color: #0f172a;
    font-size: clamp(0.92rem, 1.8vw, 1.08rem);
    font-weight: 800;
    line-height: 1.32;
    word-break: keep-all;
  }
  .political-result-bars {
    display: grid;
    gap: 14px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 14px;
    padding: clamp(16px, 2.5vw, 22px);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94)),
      #fff;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.07);
  }
  .political-result-bars-head {
    display: grid;
    gap: 6px;
  }
  .political-result-bars-head span,
  .political-result-bar-top span {
    color: #475569;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-result-bars-head h3 {
    margin: 0;
    color: #0f172a;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: clamp(1.08rem, 2.1vw, 1.34rem);
    line-height: 1.3;
    letter-spacing: 0;
    word-break: keep-all;
  }
  .political-result-bars-head p {
    margin: 0;
    color: rgba(15, 23, 42, 0.68);
    font-size: 0.94rem;
    line-height: 1.6;
    word-break: keep-all;
  }
  .political-result-bar-list {
    display: grid;
    gap: 10px;
  }
  .political-result-bar-card {
    position: relative;
    display: grid;
    gap: 10px;
    border: 1px solid rgba(15, 23, 42, 0.09);
    border-radius: 14px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.82);
  }
  .political-result-bar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .political-result-bar-top strong {
    color: #0f172a;
    font-size: 0.94rem;
    font-weight: 800;
    text-align: right;
    word-break: keep-all;
  }
  .political-result-bar-track {
    position: relative;
    height: 14px;
    border-radius: 999px;
    background:
      linear-gradient(90deg, #0f766e 0%, #e5e7eb 50%, #57534e 100%);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }
  .political-result-bar-track i {
    position: absolute;
    top: 50%;
    width: 22px;
    height: 22px;
    border: 4px solid #fff;
    border-radius: 999px;
    background: #111827;
    box-shadow: 0 9px 22px rgba(15, 23, 42, 0.24);
    transform: translate(-50%, -50%);
  }
  .political-result-bar-labels {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    color: #64748b;
    font-size: 0.78rem;
    font-weight: 850;
  }
  .political-result-bar-labels span:nth-child(2) {
    text-align: center;
  }
  .political-result-bar-labels span:nth-child(3) {
    text-align: right;
  }
  .political-result-core {
    margin: 0;
    color: #0f172a;
    font-size: 1.12rem;
    line-height: 1.7;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-result-copy {
    display: grid;
    gap: 12px;
    max-width: 900px;
  }
  .political-result-copy p {
    margin: 0;
    color: rgba(15, 23, 42, 0.78);
    font-size: 1.03rem;
    line-height: 1.82;
    font-weight: 650;
    word-break: keep-all;
  }
  .political-result-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .political-result-grid section {
    min-width: 0;
    border: 1px solid rgba(15, 23, 42, 0.09);
    border-radius: 14px;
    background: #fff;
    padding: 17px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  }
  .political-result-grid section p {
    margin: 8px 0 0;
    color: rgba(15, 23, 42, 0.78);
    line-height: 1.68;
    font-weight: 650;
    word-break: keep-all;
  }
  .political-final-line {
    background:
      linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(161, 98, 7, 0.07)),
      #fff !important;
  }
  .political-final-line p {
    color: #0f172a !important;
    font-size: 1.08rem;
    font-weight: 800 !important;
  }
  .political-disclaimer--result {
    margin: 0;
  }
  .political-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  @media (max-width: 780px) {
    .political-intro-layout,
    .political-guide,
    .political-value-map,
    .political-result-grid {
      grid-template-columns: 1fr;
    }
    .political-intro,
    .political-card,
    .political-guide,
    .political-faq {
      border-radius: 14px;
    }
    .political-spectrum-art {
      opacity: 0.12;
    }
    .political-value-map {
      padding: 16px;
    }
    .political-value-map--intro {
      margin-top: 8px;
    }
    .political-map-frame {
      padding: 32px 38px;
    }
  }
  @media (max-width: 520px) {
    .political-topbar,
    .political-shell {
      width: min(100% - 24px, 1040px);
    }
    .political-topbar {
      padding-top: max(12px, calc(env(safe-area-inset-top, 0px) + 10px));
      padding-bottom: 10px;
      align-items: flex-start;
      gap: 10px;
    }
    .political-home {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      max-width: calc(100% - 116px);
    }
    .political-locale {
      flex: 0 0 auto;
      min-height: 52px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
    }
    .political-shell {
      padding-top: 20px;
      padding-bottom: 54px;
    }
    .political-intro,
    .political-card {
      padding: 22px 18px;
    }
    .political-intro {
      min-height: auto;
    }
    .political-locale button {
      min-width: 46px;
      min-height: 44px;
      padding: 7px 10px;
    }
    .political-scale-wrap {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "agree disagree"
        "scale scale";
      gap: 12px;
      padding: 16px 12px 14px;
      border-radius: 14px;
    }
    .political-scale-end--agree {
      grid-area: agree;
      text-align: left;
    }
    .political-scale-end--disagree {
      grid-area: disagree;
      text-align: right;
    }
    .political-scale-end {
      padding-top: 0;
      font-size: 0.82rem;
    }
    .political-agreement-scale {
      grid-area: scale;
      --scale-dot-size: 34px;
      gap: 4px;
    }
    .political-scale-dot {
      gap: 8px;
      min-height: 82px;
    }
    .political-scale-dot strong {
      max-width: 48px;
      font-size: 0.6rem;
      line-height: 1.18;
    }
    .political-value-map {
      gap: 14px;
      margin: 18px 0;
      padding: 14px;
      border-radius: 14px;
    }
    .political-map-frame {
      padding: 42px 34px 16px;
      border-radius: 14px;
    }
    .political-map-grid {
      border-radius: 14px;
    }
    .political-map-grid > span {
      padding: 10px;
      font-size: 0.64rem;
    }
    .political-map-axis {
      padding: 4px 7px;
      font-size: 0.66rem;
    }
    .political-map-axis--top {
      top: 12px;
    }
    .political-map-axis--bottom {
      bottom: 10px;
    }
    .political-map-axis--left {
      left: 6px;
    }
    .political-map-axis--right {
      right: 6px;
    }
    .political-map-marker,
    .political-map-center {
      width: 34px;
      height: 34px;
      border-width: 4px;
    }
    .political-map-marker b {
      left: 50%;
      top: calc(100% + 8px);
      transform: translateX(-50%);
      font-size: 0.66rem;
    }
    .political-map-stats {
      gap: 6px;
    }
    .political-map-stats span {
      min-height: 32px;
      padding: 7px 9px;
      font-size: 0.7rem;
    }
    .political-primary,
    .political-secondary {
      width: 100%;
    }
  }

  .political-page {
    background:
      radial-gradient(circle at 14% 8%, rgba(20, 184, 166, 0.12), transparent 24rem),
      radial-gradient(circle at 86% 6%, rgba(100, 116, 139, 0.12), transparent 26rem),
      linear-gradient(180deg, #fbfdfc 0%, #f4f7f6 46%, #eef3f1 100%);
  }
  .political-page--intro .political-shell,
  .political-page--result .political-shell {
    width: min(1180px, calc(100% - 32px));
  }
  .political-intro {
    border: 0;
    background: transparent;
    box-shadow: none;
  }
  .political-spectrum-art {
    inset: auto clamp(22px, 4vw, 54px) clamp(22px, 4vw, 54px) auto;
    width: min(32vw, 280px);
    opacity: 0.42;
    filter: saturate(0.78);
  }
  .political-intro-layout {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
    gap: clamp(28px, 4.5vw, 54px);
    align-items: center;
  }
  .political-intro h1 {
    max-width: 640px;
    font-size: clamp(32px, 6vw, 56px);
    line-height: 1.08;
    color: #101828;
  }
  .political-subtitle {
    max-width: 620px;
    color: #24645f;
  }
  .political-intro-note {
    border-left: 0;
    border-radius: 14px;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(255, 255, 255, 0.86));
    color: #203333;
  }
  .political-primary {
    min-height: 56px;
    padding-inline: 28px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background:
      linear-gradient(135deg, #132f34, #0f766e);
    box-shadow:
      0 18px 38px rgba(15, 118, 110, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }
  .political-intro-copy .political-primary {
    min-width: min(100%, 260px);
    min-height: 60px;
    font-size: 1rem;
  }
  .political-intro-axis-panel {
    position: relative;
    display: grid;
    gap: 16px;
    align-self: center;
    border: 1px solid rgba(30, 41, 59, 0.14);
    border-radius: 14px;
    padding: clamp(18px, 3vw, 26px);
    background:
      radial-gradient(circle at 12% 8%, rgba(15, 118, 110, 0.1), transparent 34%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(244, 241, 233, 0.92)),
      #fbfaf7;
    box-shadow:
      0 24px 62px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  .political-intro-axis-head {
    display: grid;
    gap: 8px;
    padding-bottom: 4px;
  }
  .political-intro-axis-head span,
  .political-intro-axis-card span {
    color: #25635f;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-intro-axis-head h2 {
    margin: 0;
    color: #101828;
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: clamp(1.28rem, 2.4vw, 1.75rem);
    line-height: 1.22;
    letter-spacing: 0;
    word-break: keep-all;
  }
  .political-intro-axis-head p,
  .political-intro-axis-card p {
    margin: 0;
    color: rgba(15, 23, 42, 0.68);
    font-size: 0.93rem;
    line-height: 1.62;
    word-break: keep-all;
  }
  .political-intro-axis-cards {
    display: grid;
    gap: 10px;
  }
  .political-intro-axis-card {
    display: grid;
    gap: 6px;
    border: 1px solid rgba(30, 41, 59, 0.1);
    border-radius: 14px;
    padding: 14px 15px;
    background: rgba(255, 255, 255, 0.7);
  }
  .political-intro-axis-card strong {
    color: #172033;
    font-size: 1rem;
    line-height: 1.28;
    word-break: keep-all;
  }
  .political-value-map {
    border-radius: 14px;
    border: 1px solid rgba(30, 41, 59, 0.22);
    background:
      radial-gradient(circle at 12% 8%, rgba(15, 118, 110, 0.13), transparent 32%),
      radial-gradient(circle at 92% 14%, rgba(120, 113, 108, 0.15), transparent 36%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(239, 236, 228, 0.96)),
      #fbfaf7;
    box-shadow:
      0 32px 82px rgba(15, 23, 42, 0.18),
      0 1px 0 rgba(255, 255, 255, 0.74),
      inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }
  .political-value-map--intro {
    min-height: 560px;
    align-content: space-between;
    padding: clamp(20px, 3.2vw, 32px);
  }
  .political-value-map--result {
    grid-template-columns: minmax(250px, 0.56fr) minmax(340px, 1fr);
    padding: clamp(20px, 3vw, 34px);
    background:
      radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--result-accent) 14%, transparent), transparent 34%),
      linear-gradient(135deg, color-mix(in srgb, var(--result-accent) 10%, white), rgba(255, 255, 255, 0.96)),
      #fbfaf7;
  }
  .political-value-map-copy span {
    color: #25635f;
  }
  .political-value-map-copy h2 {
    font-size: clamp(1.18rem, 2.2vw, 1.62rem);
  }
  .political-map-frame {
    display: grid;
    gap: 14px;
    padding: 48px 54px 20px;
    border: 1px solid rgba(30, 41, 59, 0.18);
    border-radius: 14px;
    background:
      radial-gradient(circle at 20% 12%, rgba(15, 118, 110, 0.12), transparent 34%),
      linear-gradient(180deg, #fbfaf7, #ebe8df);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 0 rgba(30, 41, 59, 0.06),
      0 22px 52px rgba(15, 23, 42, 0.15);
  }
  .political-map-grid {
    border-radius: 14px;
    border: 2px solid rgba(30, 41, 59, 0.3);
    background:
      repeating-linear-gradient(0deg, transparent 0 11.7%, rgba(30, 41, 59, 0.08) 11.9% 12.08%),
      repeating-linear-gradient(90deg, transparent 0 11.7%, rgba(30, 41, 59, 0.08) 11.9% 12.08%),
      linear-gradient(90deg, rgba(15, 118, 110, 0.21), rgba(255, 255, 255, 0.58) 50%, rgba(120, 113, 108, 0.21)),
      linear-gradient(180deg, rgba(31, 41, 55, 0.21), rgba(255, 255, 255, 0.32) 50%, rgba(20, 184, 166, 0.17)),
      #f8f7f3;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.86),
      inset 0 20px 46px rgba(255, 255, 255, 0.26),
      0 26px 60px rgba(15, 23, 42, 0.2);
  }
  .political-map-grid::before,
  .political-map-grid::after {
    background: rgba(17, 24, 39, 0.76);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.56),
      0 0 24px rgba(15, 23, 42, 0.14);
  }
  .political-map-grid::before {
    width: 2px;
  }
  .political-map-grid::after {
    height: 2px;
  }
  .political-map-grid > span {
    align-items: start;
    justify-items: start;
    place-items: start;
    padding: 14px;
    color: rgba(17, 24, 39, 0.78);
    font-size: 0.8rem;
    font-weight: 800;
    text-align: left;
    opacity: 0.82;
  }
  .political-map-grid > span:nth-child(1) {
    background: linear-gradient(135deg, rgba(15, 118, 110, 0.18), rgba(255, 255, 255, 0.22));
  }
  .political-map-grid > span:nth-child(2) {
    background: linear-gradient(225deg, rgba(120, 113, 108, 0.18), rgba(255, 255, 255, 0.22));
  }
  .political-map-grid > span:nth-child(3) {
    background: linear-gradient(45deg, rgba(20, 184, 166, 0.15), rgba(255, 255, 255, 0.22));
  }
  .political-map-grid > span:nth-child(4) {
    background: linear-gradient(315deg, rgba(87, 83, 78, 0.16), rgba(255, 255, 255, 0.22));
  }
  .political-map-grid > span.active {
    color: #0f172a;
    opacity: 1;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--result-accent, #0f766e) 36%, rgba(255, 255, 255, 0.66)), rgba(255, 255, 255, 0.48));
    box-shadow:
      inset 0 0 0 3px color-mix(in srgb, var(--result-accent, #0f766e) 60%, rgba(17, 24, 39, 0.18)),
      inset 0 0 70px color-mix(in srgb, var(--result-accent, #0f766e) 24%, transparent);
  }
  .political-map-axis {
    border: 1px solid rgba(30, 41, 59, 0.24);
    border-radius: 999px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.97);
    color: #172026;
    font-size: 0.78rem;
    box-shadow:
      0 12px 26px rgba(15, 23, 42, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  .political-map-marker,
  .political-map-center {
    width: 46px;
    height: 46px;
    border-width: 6px;
    background: #101828;
    box-shadow:
      0 16px 34px rgba(15, 23, 42, 0.38),
      0 0 0 3px color-mix(in srgb, var(--result-accent, #0f766e) 24%, transparent);
  }
  .political-page--quiz {
    background:
      radial-gradient(circle at 14% 10%, rgba(20, 184, 166, 0.12), transparent 24rem),
      linear-gradient(135deg, #f8fbfa 0%, #eef4f2 100%) !important;
  }
  .political-page--quiz .political-shell {
    width: min(100% - 32px, 1040px) !important;
    min-height: calc(100svh - 26px) !important;
  }
  .political-page--quiz .political-card {
    border-radius: 14px !important;
    padding: clamp(22px, 4.5vw, 54px) !important;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.92)),
      #fff !important;
    box-shadow:
      0 34px 92px rgba(15, 23, 42, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
  }
  .political-page--quiz .political-progress {
    height: 6px !important;
    background: rgba(15, 23, 42, 0.08) !important;
  }
  .political-page--quiz .political-progress i {
    background: linear-gradient(90deg, #134e4a, #0f766e) !important;
  }
  .political-page--quiz .political-question-view {
    max-width: 880px !important;
    margin-inline: auto !important;
    padding-top: clamp(30px, 6vw, 58px) !important;
    text-align: center !important;
  }
  .political-page--quiz .political-question-view h2 {
    font-size: clamp(1.5rem, 3.4vw, 2.7rem) !important;
    line-height: 1.32 !important;
    font-weight: 800 !important;
  }
  .political-page--quiz .political-scale-wrap {
    max-width: 840px !important;
    margin-top: clamp(30px, 5vw, 50px) !important;
    display: grid !important;
    grid-template-columns: minmax(80px, 0.18fr) minmax(0, 1fr) minmax(80px, 0.18fr) !important;
    gap: clamp(10px, 2vw, 18px) !important;
    border-radius: 14px !important;
    border-color: rgba(15, 23, 42, 0.1) !important;
    padding: clamp(18px, 3vw, 28px) !important;
    background: #fff !important;
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.07) !important;
  }
  .political-page--quiz .political-agreement-scale {
    position: relative !important;
    --scale-dot-size: 44px;
    min-height: 96px !important;
    align-items: start !important;
  }
  .political-page--quiz .political-agreement-scale::before {
    left: calc(var(--scale-dot-size) / 2) !important;
    right: calc(var(--scale-dot-size) / 2) !important;
    top: calc(var(--scale-dot-size) / 2 - 1px) !important;
    height: 2px !important;
    border: 0 !important;
    background: #d8dee7 !important;
    box-shadow: none !important;
  }
  .political-page--quiz .political-scale-dot {
    min-height: 96px !important;
    gap: 11px !important;
    padding-top: 0 !important;
  }
  .political-page--quiz .political-scale-dot span {
    width: var(--scale-dot-size) !important;
    height: var(--scale-dot-size) !important;
    border: 2px solid var(--dot-border) !important;
    background: #fff !important;
    box-shadow:
      0 8px 18px rgba(15, 23, 42, 0.06),
      inset 0 0 0 8px #f8fafc !important;
  }
  .political-page--quiz .political-scale-dot:hover span,
  .political-page--quiz .political-scale-dot:focus-visible span,
  .political-page--quiz .political-scale-dot.selected span {
    background: var(--dot-color) !important;
    border-color: var(--dot-color) !important;
    box-shadow:
      0 12px 26px color-mix(in srgb, var(--dot-color) 18%, transparent),
      0 0 0 5px color-mix(in srgb, var(--dot-color) 10%, transparent),
      inset 0 0 0 8px rgba(255, 255, 255, 0.92) !important;
  }
  .political-result {
    gap: 24px;
  }
  .political-result-title h2 {
    max-width: 860px;
    font-size: clamp(2rem, 5vw, 54px);
  }
  @media (max-width: 780px) {
    .political-intro-layout,
    .political-value-map--result {
      grid-template-columns: 1fr;
    }
    .political-value-map--intro {
      min-height: auto;
    }
    .political-page--quiz .political-scale-wrap {
      grid-template-columns: 1fr 1fr !important;
      grid-template-areas:
        "agree disagree"
        "scale scale" !important;
    }
  }
  @media (max-width: 520px) {
    .political-page--quiz .political-shell {
      width: min(100% - 20px, 1040px) !important;
    }
    .political-page--quiz .political-card {
      border-radius: 14px !important;
      padding: 18px 14px !important;
    }
    .political-page--quiz .political-agreement-scale {
      --scale-dot-size: 34px;
      min-height: 82px !important;
      gap: 4px !important;
    }
    .political-page--quiz .political-agreement-scale::before {
      top: calc(var(--scale-dot-size) / 2 - 1px) !important;
      height: 2px !important;
    }
    .political-page--quiz .political-scale-dot {
      min-height: 82px !important;
    }
    .political-map-frame {
      padding: 34px 34px;
    }
  }
`;
