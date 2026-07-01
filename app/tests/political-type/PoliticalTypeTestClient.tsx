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
  // 중도 구간이라도 실제 점수 위치를 반영해 마커가 움직이게 한다(가운데 고정 방지).
  void neutral;
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
  /* --- tokens --- */
  .political-page {
    --pol-bg: #fbfcfd;
    --pol-surface: #ffffff;
    --pol-fg: #0b1220;
    --pol-muted: #667085;
    --pol-border: #e6e8ee;
    --pol-border-strong: #d5d9e2;
    --pol-blue: #2563eb;
    --pol-blue-ink: #1d4ed8;
    --pol-red: #e11d48;
    --pol-ring: rgba(37, 99, 235, 0.18);
    --pol-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06);
    --pol-shadow-md: 0 4px 6px -2px rgba(16, 24, 40, 0.04), 0 12px 24px -6px rgba(16, 24, 40, 0.10);
    --pol-radius: 16px;
    --pol-radius-sm: 12px;

    min-height: 100vh;
    min-height: 100svh;
    overflow-x: hidden;
    color: var(--pol-fg);
    background:
      radial-gradient(60% 40% at 8% -6%, rgba(37, 99, 235, 0.05), transparent 60%),
      radial-gradient(60% 40% at 96% -2%, rgba(225, 29, 72, 0.045), transparent 60%),
      var(--pol-bg);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .political-page * { box-sizing: border-box; }
  /* 설문 배경: 파랑↔빨강 은은한 대각 그라데이션(빨강/파랑 반반, 가독성 위해 옅게).
     이미지로 바꾸고 싶으면 bg-spectrum.jpg 를 넣고 url(...)로 교체 가능. */
  .political-page--quiz {
    background:
      linear-gradient(130deg, rgba(37, 99, 235, 0.16) 0%, rgba(124, 58, 237, 0.06) 48%, rgba(220, 38, 38, 0.16) 100%),
      var(--pol-bg);
  }

  /* --- top bar --- */
  .political-topbar {
    position: relative;
    z-index: 30;
    width: min(1080px, calc(100% - 32px));
    margin: 0 auto;
    padding: 20px 0 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .political-home {
    color: var(--pol-muted);
    text-decoration: none;
    font-weight: 700;
    font-size: 0.92rem;
    transition: color 0.15s ease;
  }
  .political-home:hover { color: var(--pol-fg); }
  .political-locale {
    position: relative;
    z-index: 40;
    display: inline-flex;
    gap: 2px;
    padding: 4px;
    border: 1px solid var(--pol-border);
    border-radius: 999px;
    background: var(--pol-surface);
    box-shadow: var(--pol-shadow-sm);
  }
  .political-locale button {
    min-width: 42px;
    min-height: 34px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--pol-muted);
    cursor: pointer;
    padding: 6px 12px;
    font-weight: 700;
    font-size: 0.82rem;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .political-locale button.active { background: var(--pol-fg); color: #fff; }

  /* --- shell + shared card surfaces --- */
  .political-shell {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: clamp(24px, 4.5vh, 52px) 0 72px;
    display: grid;
    gap: 20px;
  }
  .political-intro,
  .political-card,
  .political-guide,
  .political-faq {
    border: 1px solid var(--pol-border);
    background: var(--pol-surface);
    border-radius: var(--pol-radius);
    box-shadow: var(--pol-shadow-md);
  }

  /* --- buttons --- */
  .political-primary {
    appearance: none;
    border: 0;
    cursor: pointer;
    border-radius: 12px;
    padding: 15px 26px;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(100deg, #1d4ed8 0%, #7c3aed 50%, #dc2626 100%);
    box-shadow: 0 1px 2px rgba(16,24,40,0.12), inset 0 1px 0 rgba(255,255,255,0.18);
    transition: transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease;
  }
  .political-primary:hover { filter: brightness(1.07); box-shadow: 0 10px 24px -8px rgba(124,58,237,0.5); }
  .political-primary:active { transform: translateY(1px); }
  .political-secondary {
    appearance: none;
    cursor: pointer;
    border-radius: 12px;
    padding: 14px 22px;
    font-size: 0.98rem;
    font-weight: 700;
    color: var(--pol-fg);
    background: var(--pol-surface);
    border: 1px solid var(--pol-border-strong);
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .political-secondary:hover { background: #f6f7f9; border-color: var(--pol-muted); }

  /* --- intro --- */
  .political-intro {
    position: relative;
    overflow: hidden;
    padding: clamp(26px, 4vw, 52px);
  }
  .political-spectrum-art { display: none; } /* 지저분한 배너 이미지 제거 */
  .political-intro-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 0.92fr);
    align-items: center;
    gap: clamp(26px, 4vw, 48px);
  }
  .political-intro-copy { min-width: 0; }
  .political-eyebrow,
  .political-progress-head span,
  .political-result-title span,
  .political-result-grid span,
  .political-shared {
    color: #475569;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
  }
  .political-eyebrow { margin: 0 0 12px; }
  .political-intro h1 {
    margin: 0;
    max-width: 640px;
    color: var(--pol-fg);
    font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif;
    font-size: clamp(30px, 5vw, 50px);
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.025em;
    word-break: keep-all;
  }
  .political-subtitle {
    max-width: 640px;
    margin: 16px 0 0;
    color: var(--pol-fg);
    font-size: clamp(1.1rem, 2.2vw, 1.4rem);
    line-height: 1.5;
    font-weight: 700;
    word-break: keep-all;
  }
  .political-description {
    max-width: 640px;
    margin: 14px 0;
    color: var(--pol-muted);
    font-size: 1.02rem;
    line-height: 1.7;
    font-weight: 500;
    word-break: keep-all;
  }
  .political-intro-note {
    max-width: 620px;
    margin: 0 0 22px;
    border: 1px solid var(--pol-border);
    border-left: 3px solid var(--pol-blue);
    border-radius: 10px;
    padding: 13px 16px;
    background: #f7f9ff;
    color: var(--pol-fg);
    font-size: 0.98rem;
    font-weight: 600;
    line-height: 1.6;
    word-break: keep-all;
  }
  .political-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }
  .political-chips span {
    border: 1px solid var(--pol-border);
    border-radius: 999px;
    padding: 7px 14px;
    background: var(--pol-surface);
    color: var(--pol-muted);
    font-size: 0.82rem;
    font-weight: 600;
  }
  .political-disclaimer {
    max-width: 640px;
    margin: 16px 0 0;
    color: var(--pol-muted);
    font-size: 0.85rem;
    line-height: 1.6;
    word-break: keep-all;
  }

  /* --- intro axis preview panel (오른쪽) --- */
  .political-intro-axis-panel {
    min-width: 0;
    border: 1px solid var(--pol-border);
    border-radius: var(--pol-radius);
    background: linear-gradient(180deg, #fbfcfe, #f5f7fb);
    padding: clamp(20px, 2.6vw, 28px);
  }
  .political-intro-axis-head { margin-bottom: 16px; }
  .political-intro-axis-head span {
    color: var(--pol-blue-ink);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-intro-axis-head h2 {
    margin: 8px 0 0;
    color: var(--pol-fg);
    font-size: clamp(1.15rem, 2.2vw, 1.5rem);
    line-height: 1.25;
    font-weight: 800;
    letter-spacing: -0.01em;
    word-break: keep-all;
  }
  .political-intro-axis-cards { display: grid; gap: 12px; }
  .political-intro-axis-card {
    border: 1px solid var(--pol-border);
    border-radius: var(--pol-radius-sm);
    background: var(--pol-surface);
    padding: 16px 18px;
    box-shadow: var(--pol-shadow-sm);
  }
  .political-intro-axis-card:nth-child(1) { border-top: 2px solid var(--pol-blue); }
  .political-intro-axis-card:nth-child(2) { border-top: 2px solid var(--pol-red); }
  .political-intro-axis-card span {
    color: var(--pol-muted);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .political-intro-axis-card h3,
  .political-intro-axis-card h4,
  .political-intro-axis-card strong {
    display: block;
    margin: 6px 0 6px;
    color: var(--pol-fg);
    font-size: 1.02rem;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-intro-axis-card p {
    margin: 0;
    color: var(--pol-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    font-weight: 500;
    word-break: keep-all;
  }

  /* --- guide + faq --- */
  .political-guide {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
    padding: clamp(24px, 3vw, 34px);
  }
  .political-guide > div span {
    color: var(--pol-blue-ink);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-guide h2 {
    margin: 8px 0 8px;
    color: var(--pol-fg);
    font-size: 1.08rem;
    font-weight: 800;
    line-height: 1.3;
    word-break: keep-all;
  }
  .political-guide p {
    margin: 0;
    color: var(--pol-muted);
    font-size: 0.94rem;
    line-height: 1.68;
    font-weight: 500;
    word-break: keep-all;
  }
  .political-faq {
    padding: clamp(22px, 3vw, 30px);
    display: grid;
    gap: 4px;
  }
  .political-faq > h2,
  .political-faq > span {
    color: var(--pol-fg);
    font-size: 1.05rem;
    font-weight: 800;
    margin: 0 0 8px;
  }
  .political-faq details {
    border-top: 1px solid var(--pol-border);
    padding: 6px 0;
  }
  .political-faq summary {
    cursor: pointer;
    list-style: none;
    padding: 12px 2px;
    color: var(--pol-fg);
    font-size: 0.98rem;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    word-break: keep-all;
  }
  .political-faq summary::-webkit-details-marker { display: none; }
  .political-faq summary::after { content: "+"; color: var(--pol-muted); font-weight: 700; }
  .political-faq details[open] summary::after { content: "−"; }
  .political-faq details p {
    margin: 0 2px 12px;
    color: var(--pol-muted);
    font-size: 0.92rem;
    line-height: 1.7;
    word-break: keep-all;
  }

  /* --- quiz / result card + progress --- */
  .political-card { padding: clamp(24px, 3.5vw, 40px); }
  .political-progress-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }
  .political-progress-head strong {
    color: var(--pol-muted);
    font-size: 0.9rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .political-exit {
    width: 36px;
    height: 36px;
    border: 1px solid var(--pol-border);
    border-radius: 10px;
    background: var(--pol-surface);
    color: var(--pol-muted);
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .political-exit:hover { background: #f6f7f9; color: var(--pol-fg); }
  .political-progress {
    height: 8px;
    border-radius: 999px;
    background: #eef0f4;
    overflow: hidden;
    margin-bottom: 30px;
  }
  .political-progress i {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #1d4ed8, #7c3aed 55%, #dc2626);
    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* --- question + likert scale --- */
  .political-question-view { text-align: center; }
  .political-statement {
    margin: 8px auto 12px;
    max-width: 680px;
    color: var(--pol-fg);
    font-size: clamp(1.5rem, 3.6vw, 2.15rem);
    line-height: 1.34;
    font-weight: 800;
    letter-spacing: -0.02em;
    word-break: keep-all;
  }
  .political-agreement-hint {
    margin: 0 0 30px;
    color: var(--pol-muted);
    font-size: 1rem;
    font-weight: 600;
  }
  .political-scale-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 26px;
    border-radius: 22px;
    border: 1px solid var(--pol-border);
    background: linear-gradient(90deg, rgba(37,99,235,0.09), rgba(255,255,255,0.30) 50%, rgba(225,29,72,0.09));
  }
  .political-scale-end { display: none; }
  .political-agreement-scale {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: clamp(6px, 1.4vw, 16px);
  }
  .political-scale-dot {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 4px;
    min-width: 46px;
  }
  .political-scale-dot > span {
    width: 46px;
    height: 46px;
    border-radius: 999px;
    border: 3px solid #ffffff;
    background: #cbd5e1;
    box-shadow: 0 4px 12px rgba(16, 24, 40, 0.16);
    transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
  }
  /* 파랑(그렇다) → 빨강(그렇지 않다) 스펙트럼: 색만 채우고 크기는 전부 동일(완벽 대칭) */
  .political-scale-dot:nth-child(1) > span { background: #1d4ed8; }
  .political-scale-dot:nth-child(2) > span { background: #3b82f6; }
  .political-scale-dot:nth-child(3) > span { background: #93b4fb; }
  .political-scale-dot:nth-child(4) > span { background: #cbd5e1; }
  .political-scale-dot:nth-child(5) > span { background: #fca5b4; }
  .political-scale-dot:nth-child(6) > span { background: #f43f5e; }
  .political-scale-dot:nth-child(7) > span { background: #dc2626; }
  .political-scale-dot:hover > span {
    background: #111827;
    border-color: #ffffff;
    transform: translateY(-4px) scale(1.08);
    box-shadow: 0 12px 24px rgba(16, 24, 40, 0.28);
  }
  .political-scale-dot.selected > span {
    background: #0f172a;
    border-color: #ffffff;
    transform: scale(1.18);
    box-shadow: 0 0 0 6px rgba(15, 23, 42, 0.16), 0 10px 20px rgba(16, 24, 40, 0.30);
  }
  .political-scale-dot strong {
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--pol-muted);
    max-width: 80px;
    line-height: 1.25;
    word-break: keep-all;
  }
  .political-scale-dot.selected strong { color: var(--pol-fg); }
  .political-scale-dot:disabled { cursor: default; }
  .political-scale-dot:disabled:not(.selected) { opacity: 0.5; }

  /* --- result --- */
  .political-result { display: grid; gap: 26px; }
  .political-result-title { text-align: center; display: grid; gap: 10px; }
  .political-result-title h2 {
    margin: 0;
    color: var(--pol-fg);
    font-size: clamp(1.7rem, 4vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    word-break: keep-all;
  }
  .political-axis-summary {
    justify-self: center;
    border: 1px solid var(--pol-border);
    border-radius: 999px;
    padding: 7px 16px;
    background: #f7f9ff;
    color: var(--pol-blue-ink);
    font-size: 0.88rem;
    font-weight: 700;
  }
  .political-result-title p {
    margin: 0 auto;
    max-width: 620px;
    color: var(--pol-muted);
    font-size: 1.02rem;
    line-height: 1.7;
    word-break: keep-all;
  }

  /* result spectrum bars */
  .political-result-bars {
    border: 1px solid var(--pol-border);
    border-radius: var(--pol-radius);
    background: #fbfcfe;
    padding: clamp(20px, 3vw, 28px);
    display: grid;
    gap: 18px;
  }
  .political-result-bars-head span {
    color: var(--pol-blue-ink);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-result-bars-head h3 {
    margin: 8px 0 6px;
    color: var(--pol-fg);
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1.35;
    word-break: keep-all;
  }
  .political-result-bars-head p {
    margin: 0;
    color: var(--pol-muted);
    font-size: 0.92rem;
    line-height: 1.65;
    word-break: keep-all;
  }
  .political-result-bar-list { display: grid; gap: 20px; }
  .political-result-bar-card {
    border: 1px solid var(--pol-border);
    border-radius: var(--pol-radius-sm);
    background: var(--pol-surface);
    padding: 18px 20px;
    box-shadow: var(--pol-shadow-sm);
  }
  .political-result-bar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }
  .political-result-bar-top span { color: var(--pol-muted); font-size: 0.86rem; font-weight: 700; }
  .political-result-bar-top strong { color: var(--pol-fg); font-size: 0.94rem; font-weight: 800; }
  .political-result-bar-track {
    position: relative;
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--pol-blue) 0%, #c9cdd6 50%, var(--pol-red) 100%);
  }
  .political-result-bar-track i {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: var(--pol-fg);
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(16,24,40,0.28);
  }
  .political-result-bar-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .political-result-bar-labels span { color: var(--pol-muted); font-size: 0.78rem; font-weight: 600; }
  .political-result-bar-labels span:first-child { color: var(--pol-blue-ink); }
  .political-result-bar-labels span:last-child { color: var(--pol-red); }

  .political-result-core {
    margin: 0;
    color: var(--pol-fg);
    font-size: 1.06rem;
    line-height: 1.7;
    font-weight: 600;
    word-break: keep-all;
  }
  .political-result-copy { display: grid; gap: 12px; }
  .political-result-copy p {
    margin: 0;
    color: var(--pol-muted);
    font-size: 0.98rem;
    line-height: 1.75;
    word-break: keep-all;
  }
  .political-result-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .political-result-grid > div {
    border: 1px solid var(--pol-border);
    border-radius: var(--pol-radius-sm);
    background: var(--pol-surface);
    padding: 16px 18px;
  }
  .political-result-grid strong {
    display: block;
    margin: 6px 0 4px;
    color: var(--pol-fg);
    font-size: 0.98rem;
    font-weight: 800;
    word-break: keep-all;
  }
  .political-result-grid p {
    margin: 0;
    color: var(--pol-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    word-break: keep-all;
  }
  .political-final-line {
    margin: 0;
    padding: 16px 18px;
    border-radius: var(--pol-radius-sm);
    background: #f7f9ff;
    border: 1px solid var(--pol-border);
    color: var(--pol-fg);
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.6;
    text-align: center;
    word-break: keep-all;
  }
  .political-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .political-actions .political-primary,
  .political-actions .political-secondary { min-width: 180px; }

  /* --- responsive --- */
  @media (max-width: 860px) {
    .political-intro-layout { grid-template-columns: 1fr; }
    .political-guide { grid-template-columns: 1fr; gap: 16px; }
    .political-result-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .political-scale-wrap { padding: 20px 12px; gap: 10px; }
    .political-agreement-scale { gap: 4px; }
    .political-scale-dot { min-width: 34px; padding: 2px; gap: 8px; }
    .political-scale-dot > span { width: 32px; height: 32px; }
    .political-scale-dot strong { font-size: 0.6rem; max-width: 46px; }
    .political-scale-end { display: none; }
    .political-actions .political-primary,
    .political-actions .political-secondary { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .political-page *,
    .political-progress i { transition: none !important; }
  }
`;
