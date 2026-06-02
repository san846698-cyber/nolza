"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactElement } from "react";
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
  POLITICAL_SPECTRUM_LABELS,
  POLITICAL_TEST_COPY,
  calculatePoliticalAnswer,
  calculatePoliticalResult,
  getPoliticalResultById,
  isPoliticalResultId,
  localized,
  resultMidpoint,
  spectrumPercent,
  valueMapYPercent,
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

function scoreLabel(score: number): string {
  return score > 0 ? `+${score}` : `${score}`;
}

function safeScore(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(-100, Math.min(100, Math.round(value)));
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
  }, [setLocale]);

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
          <div className="political-locale" aria-label={t(locale, "언어 선택", "Language selection")}>
            <button type="button" className={locale === "ko" ? "active" : ""} onClick={() => setLocale("ko")}>KO</button>
            <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button>
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
              <QuestionView question={currentQuestion} locale={locale} onChoose={choose} />
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
          <PoliticalValueMap locale={locale} variant="intro" />
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

function QuestionView({
  question,
  locale,
  onChoose,
}: {
  question: (typeof POLITICAL_QUESTIONS)[number];
  locale: SimpleLocale;
  onChoose: (agreement: PoliticalAgreementValue) => void;
}): ReactElement {
  return (
    <div className="political-question-view">
      <p className="political-eyebrow">{t(locale, "동의 정도", "Agreement scale")}</p>
      <h2 className="political-statement">{localized(locale, question.statement)}</h2>
      <p className="political-agreement-hint">
        {t(locale, "이 문장에 얼마나 동의하나요?", "How much do you agree with this statement?")}
      </p>
      <div className="political-agreement-scale">
        {POLITICAL_AGREEMENT_OPTIONS.map((option) => (
          <button key={option.value} type="button" onClick={() => onChoose(option.value)}>
            <span>{option.value}</span>
            <strong>{localized(locale, option.label)}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function PoliticalValueMap({
  locale,
  variant,
  leftRightScore = 0,
  orderFreedomScore = 0,
}: {
  locale: SimpleLocale;
  variant: "intro" | "result";
  leftRightScore?: number;
  orderFreedomScore?: number;
}): ReactElement {
  const showMarker = variant === "result";
  const markerStyle = {
    left: `${spectrumPercent(leftRightScore)}%`,
    top: `${valueMapYPercent(orderFreedomScore)}%`,
  } as CSSProperties;

  return (
    <section className={`political-value-map political-value-map--${variant}`}>
      <div className="political-value-map-copy">
        <span>{t(locale, "2축 가치 지도", "Two-axis value map")}</span>
        <h2>{t(locale, "좌우 성향과 자유-질서 감각", "Left-right values and freedom-order sense")}</h2>
        <p>
          {variant === "intro"
            ? t(
                locale,
                "이 테스트는 좌우 성향뿐 아니라, 자유와 질서를 바라보는 감각까지 함께 살펴봅니다.",
                "This test looks not only at left-right orientation, but also at how you balance freedom and order.",
              )
            : t(
                locale,
                "점은 당신의 응답이 만든 대략적인 위치입니다. 위로 갈수록 질서와 제도 안정, 아래로 갈수록 자유와 자율을 더 중시합니다.",
                "The marker shows the approximate position created by your answers. Higher means stronger order and institutional-stability emphasis; lower means stronger freedom and autonomy emphasis.",
              )}
        </p>
      </div>
      <div className="political-map-frame" aria-label={t(locale, "정치 가치 지도", "Political value map")}>
        <span className="political-map-axis political-map-axis--top">{t(locale, "권위/질서", "Order")}</span>
        <span className="political-map-axis political-map-axis--bottom">{t(locale, "자유/자율", "Freedom")}</span>
        <span className="political-map-axis political-map-axis--left">{t(locale, "진보", "Progressive")}</span>
        <span className="political-map-axis political-map-axis--right">{t(locale, "보수", "Conservative")}</span>
        <div className="political-map-grid">
          <span>{t(locale, "변화 + 질서", "Change + order")}</span>
          <span>{t(locale, "안정 + 질서", "Stability + order")}</span>
          <span>{t(locale, "변화 + 자유", "Change + freedom")}</span>
          <span>{t(locale, "안정 + 자유", "Stability + freedom")}</span>
          {showMarker ? (
            <i className="political-map-marker" style={markerStyle}>
              <b>{t(locale, "나", "You")}</b>
            </i>
          ) : (
            <i className="political-map-center" aria-hidden />
          )}
        </div>
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
  return (
    <article className="political-result">
      {isShared ? <p className="political-shared">{t(locale, "공유된 결과", "Shared result")}</p> : null}
      <div className="political-result-title">
        <span>{result.englishLabel}</span>
        <h2>{localized(locale, result.title)}</h2>
        <p>{localized(locale, result.summary)}</p>
      </div>

      <section className="political-spectrum" aria-label={t(locale, "정치 성향 스펙트럼", "Political spectrum")}>
        <div className="political-spectrum-head">
          <span>{localized(locale, result.spectrumPosition)}</span>
          <strong>{scoreLabel(score)}</strong>
        </div>
        <div className="political-spectrum-track">
          <i style={{ left: `${spectrumPercent(score)}%` }} />
        </div>
        <div className="political-spectrum-labels">
          {POLITICAL_SPECTRUM_LABELS.map((label) => (
            <span key={label.en}>{localized(locale, label)}</span>
          ))}
        </div>
      </section>

      <PoliticalValueMap
        locale={locale}
        variant="result"
        leftRightScore={score}
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
          <span>{t(locale, "당신이 사회를 판단하는 기준", "Your standard for judging society")}</span>
          <p>{localized(locale, result.basis)}</p>
        </section>
        <section>
          <span>{t(locale, "당신의 강점", "Your strength")}</span>
          <p>{localized(locale, result.strength)}</p>
        </section>
        <section>
          <span>{t(locale, "주의할 점", "Watch-out")}</span>
          <p>{localized(locale, result.caution)}</p>
        </section>
        <section>
          <span>{t(locale, "친구가 보면 하는 말", "What a friend might say")}</span>
          <p>{localized(locale, result.friendLine)}</p>
        </section>
        <section>
          <span>{t(locale, "당신과 잘 맞는 정치 대화 방식", "Political conversation style that fits you")}</span>
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
      linear-gradient(180deg, rgba(255,255,255,0.86), rgba(247,250,252,0.94)),
      linear-gradient(135deg, #eff6ff 0%, #fff7ed 100%);
    font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
  }
  .political-page * {
    box-sizing: border-box;
  }
  .political-topbar {
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
    font-weight: 950;
  }
  .political-locale {
    display: inline-flex;
    padding: 4px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.76);
  }
  .political-locale button {
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    padding: 8px 12px;
    font-weight: 900;
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
    border-radius: 28px;
    isolation: isolate;
  }
  .political-spectrum-art {
    position: absolute;
    right: clamp(20px, 5vw, 58px);
    top: clamp(24px, 5vw, 58px);
    width: min(36vw, 310px);
    aspect-ratio: 1.4;
    border-radius: 22px;
    opacity: 0.22;
    background:
      linear-gradient(90deg, #2563eb 0%, #f8fafc 50%, #dc2626 100%);
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
    font-weight: 950;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  .political-eyebrow {
    margin: 0 0 14px;
  }
  .political-intro h1,
  .political-card h2 {
    margin: 0;
    letter-spacing: 0;
    word-break: keep-all;
  }
  .political-intro h1 {
    max-width: 720px;
    color: #0f172a;
    font-size: clamp(2.6rem, 7vw, 5.7rem);
    line-height: 1.04;
    font-weight: 950;
  }
  .political-subtitle {
    max-width: 720px;
    margin: 18px 0 0;
    color: #1d4ed8;
    font-size: clamp(1.18rem, 2.5vw, 1.55rem);
    line-height: 1.52;
    font-weight: 900;
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
    border-left: 3px solid #2563eb;
    padding: 12px 0 12px 14px;
    color: #0f172a;
    font-size: 1.02rem;
    font-weight: 900;
    line-height: 1.64;
    word-break: keep-all;
  }
  .political-value-map {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 0.84fr) minmax(260px, 1fr);
    align-items: center;
    gap: clamp(16px, 2.5vw, 24px);
    margin: 22px 0;
    padding: clamp(16px, 2.5vw, 24px);
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 26px;
    background:
      radial-gradient(circle at 15% 15%, rgba(37, 99, 235, 0.13), transparent 32%),
      radial-gradient(circle at 86% 24%, rgba(220, 38, 38, 0.12), transparent 34%),
      linear-gradient(145deg, rgba(248, 250, 252, 0.96), rgba(255, 255, 255, 0.78)),
      rgba(255, 255, 255, 0.86);
    box-shadow: 0 22px 54px rgba(15, 23, 42, 0.11);
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
    color: #2563eb;
    font-size: 0.74rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-value-map-copy h2 {
    margin: 8px 0 8px;
    color: #0f172a;
    font-size: clamp(1.1rem, 2.2vw, 1.42rem);
    line-height: 1.34;
    font-weight: 950;
    word-break: keep-all;
  }
  .political-value-map-copy p {
    margin: 0;
    color: rgba(15, 23, 42, 0.72);
    font-size: 0.95rem;
    line-height: 1.68;
    font-weight: 720;
    word-break: keep-all;
  }
  .political-map-frame {
    position: relative;
    min-width: 0;
    padding: 36px 44px;
  }
  .political-map-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    aspect-ratio: 1;
    min-width: 0;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, 0.14);
    border-radius: 22px;
    background:
      linear-gradient(90deg, rgba(37, 99, 235, 0.2), rgba(248, 250, 252, 0.58) 50%, rgba(220, 38, 38, 0.2)),
      linear-gradient(180deg, rgba(15, 23, 42, 0.1), rgba(255, 255, 255, 0.06) 48%, rgba(14, 165, 233, 0.12)),
      repeating-linear-gradient(0deg, transparent 0 31px, rgba(15, 23, 42, 0.045) 32px 33px),
      repeating-linear-gradient(90deg, transparent 0 31px, rgba(15, 23, 42, 0.045) 32px 33px);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.78),
      inset 0 18px 60px rgba(255, 255, 255, 0.28);
  }
  .political-map-grid::before,
  .political-map-grid::after {
    content: "";
    position: absolute;
    z-index: 1;
    background: rgba(15, 23, 42, 0.26);
  }
  .political-map-grid::before {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
  }
  .political-map-grid::after {
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
  }
  .political-map-grid > span {
    position: relative;
    z-index: 2;
    display: grid;
    place-items: center;
    padding: 10px;
    color: rgba(15, 23, 42, 0.62);
    font-size: 0.73rem;
    font-weight: 900;
    line-height: 1.25;
    text-align: center;
    word-break: keep-all;
  }
  .political-map-axis {
    position: absolute;
    z-index: 3;
    color: #0f172a;
    font-size: 0.78rem;
    font-weight: 950;
    white-space: nowrap;
  }
  .political-map-axis--top,
  .political-map-axis--bottom {
    left: 50%;
    transform: translateX(-50%);
  }
  .political-map-axis--top {
    top: 8px;
  }
  .political-map-axis--bottom {
    bottom: 8px;
  }
  .political-map-axis--left,
  .political-map-axis--right {
    top: 50%;
    transform: translateY(-50%);
  }
  .political-map-axis--left {
    left: 0;
  }
  .political-map-axis--right {
    right: 0;
  }
  .political-map-marker,
  .political-map-center {
    position: absolute;
    z-index: 4;
    left: 50%;
    top: 50%;
    width: 24px;
    height: 24px;
    border: 4px solid #fff;
    border-radius: 999px;
    background:
      radial-gradient(circle at 32% 28%, #fff 0 10%, transparent 12%),
      #111827;
    box-shadow:
      0 14px 34px rgba(15, 23, 42, 0.34),
      0 0 0 10px rgba(17, 24, 39, 0.1);
    transform: translate(-50%, -50%);
  }
  .political-map-center {
    opacity: 0.32;
  }
  .political-map-marker b {
    position: absolute;
    left: 50%;
    top: calc(100% + 7px);
    transform: translateX(-50%);
    border-radius: 999px;
    padding: 4px 8px;
    background: #111827;
    color: #fff;
    font-size: 0.68rem;
    font-weight: 950;
    white-space: nowrap;
  }
  .political-disclaimer {
    width: fit-content;
    margin: 14px 0 0;
    padding: 12px 14px;
    border: 1px solid rgba(37, 99, 235, 0.14);
    border-radius: 16px;
    background: rgba(239, 246, 255, 0.8);
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
    font-weight: 900;
  }
  .political-primary,
  .political-secondary {
    min-height: 52px;
    border-radius: 999px;
    padding: 0 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 950;
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }
  .political-primary {
    border: 0;
    color: #fff;
    background: linear-gradient(135deg, #2563eb, #dc2626);
    box-shadow: 0 16px 36px rgba(37, 99, 235, 0.18);
  }
  .political-secondary {
    color: #111827;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.13);
  }
  .political-primary:hover,
  .political-secondary:hover,
  .political-agreement-scale button:hover {
    transform: translateY(-2px);
  }
  .political-guide {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin: 22px auto 0;
    width: min(100%, 960px);
    border-radius: 24px;
    padding: clamp(18px, 3vw, 28px);
  }
  .political-guide div {
    min-width: 0;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 18px;
    padding: 17px;
    background: #f8fafc;
  }
  .political-guide span {
    color: #2563eb;
    font-size: 0.73rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .political-guide h2,
  .political-faq h2 {
    margin: 8px 0 8px;
    color: #0f172a;
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
    border-radius: 24px;
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
    font-weight: 900;
    word-break: keep-all;
  }
  .political-faq p {
    margin-top: 8px;
  }
  .political-card {
    border-radius: 28px;
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
    font-weight: 950;
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
    font-weight: 950;
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
    background: linear-gradient(90deg, #2563eb, #f8fafc, #dc2626);
    transition: width 220ms ease;
  }
  .political-question-view {
    padding-top: clamp(26px, 5vw, 42px);
  }
  .political-question-view h2 {
    max-width: 850px;
    color: #0f172a;
    font-size: clamp(1.48rem, 3.5vw, 2.6rem);
    line-height: 1.34;
    font-weight: 950;
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
  .political-agreement-scale {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    margin-top: 24px;
  }
  .political-agreement-scale button {
    min-height: 92px;
    display: grid;
    place-items: center;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 999px;
    background: linear-gradient(145deg, #fff, #f8fafc);
    color: #111827;
    cursor: pointer;
    padding: 14px 10px;
    text-align: center;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
    transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }
  .political-agreement-scale button:hover {
    border-color: rgba(37, 99, 235, 0.34);
    box-shadow: 0 18px 38px rgba(15, 23, 42, 0.1);
  }
  .political-agreement-scale span {
    display: inline-grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #111827;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 950;
  }
  .political-agreement-scale strong {
    font-size: 0.9rem;
    line-height: 1.26;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .political-result {
    display: grid;
    gap: 22px;
    padding-top: 28px;
  }
  .political-shared {
    width: fit-content;
    margin: 0;
    border: 1px solid rgba(37, 99, 235, 0.18);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(37, 99, 235, 0.07);
  }
  .political-result-title h2 {
    margin-top: 8px;
    color: #0f172a;
    font-size: clamp(2.3rem, 6vw, 5.1rem);
    line-height: 1.04;
    font-weight: 950;
  }
  .political-result-title p {
    max-width: 780px;
    margin: 12px 0 0;
    color: var(--result-accent);
    font-size: clamp(1.08rem, 2.4vw, 1.36rem);
    font-weight: 900;
    line-height: 1.52;
    word-break: keep-all;
  }
  .political-spectrum {
    display: grid;
    gap: 10px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 20px;
    padding: 16px;
    background: #f8fafc;
  }
  .political-spectrum-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .political-spectrum-head span {
    color: #475569;
    font-weight: 850;
  }
  .political-spectrum-head strong {
    color: #0f172a;
    font-size: 1.22rem;
    font-weight: 950;
  }
  .political-spectrum-track {
    position: relative;
    height: 18px;
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb 0%, #e2e8f0 50%, #dc2626 100%);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
  }
  .political-spectrum-track i {
    position: absolute;
    top: 50%;
    width: 26px;
    height: 26px;
    border: 4px solid #fff;
    border-radius: 999px;
    background: #111827;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
    transform: translate(-50%, -50%);
  }
  .political-spectrum-labels {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 850;
  }
  .political-spectrum-labels span:nth-child(2),
  .political-spectrum-labels span:nth-child(3),
  .political-spectrum-labels span:nth-child(4) {
    text-align: center;
  }
  .political-spectrum-labels span:nth-child(5) {
    text-align: right;
  }
  .political-result-core {
    margin: 0;
    color: #0f172a;
    font-size: 1.12rem;
    line-height: 1.7;
    font-weight: 900;
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
    border-radius: 18px;
    background: #fff;
    padding: 17px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  }
  .political-result-grid section p {
    margin: 8px 0 0;
    color: rgba(15, 23, 42, 0.78);
    line-height: 1.68;
    font-weight: 720;
    word-break: keep-all;
  }
  .political-final-line {
    background:
      linear-gradient(135deg, rgba(37, 99, 235, 0.07), rgba(220, 38, 38, 0.07)),
      #fff !important;
  }
  .political-final-line p {
    color: #0f172a !important;
    font-size: 1.08rem;
    font-weight: 950 !important;
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
    .political-agreement-scale,
    .political-value-map,
    .political-result-grid {
      grid-template-columns: 1fr;
    }
    .political-intro,
    .political-card,
    .political-guide,
    .political-faq {
      border-radius: 22px;
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
      padding: 7px 10px;
    }
    .political-agreement-scale {
      gap: 8px;
    }
    .political-agreement-scale button {
      min-height: 58px;
      grid-template-columns: 30px 1fr;
      justify-items: start;
      padding: 14px;
      text-align: left;
      border-radius: 18px;
    }
    .political-value-map {
      gap: 14px;
      margin: 18px 0;
      padding: 14px;
      border-radius: 18px;
    }
    .political-map-frame {
      padding: 30px 32px;
    }
    .political-map-grid {
      border-radius: 14px;
    }
    .political-map-grid > span {
      padding: 8px;
      font-size: 0.66rem;
    }
    .political-map-axis {
      font-size: 0.68rem;
    }
    .political-map-marker,
    .political-map-center {
      width: 22px;
      height: 22px;
    }
    .political-primary,
    .political-secondary {
      width: 100%;
    }
    .political-spectrum-labels {
      font-size: 0.68rem;
    }
  }
`;
