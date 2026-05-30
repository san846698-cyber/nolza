"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { AdResult } from "@/app/components/Ads";
import { homeBackLabel } from "@/app/components/BrandMark";
import RecommendedGames from "@/app/components/game/RecommendedGames";
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
  calculateStoicResult,
  getStoicResultById,
  type StoicAnswer,
  type StoicControlId,
  type StoicResult,
} from "@/lib/stoic-control-test";

type Phase = "intro" | "quiz" | "result";
type StoicSharePayload = {
  v: 1;
  resultId: StoicControlId;
  locale?: SimpleLocale;
};

type StoicStatement = {
  id: string;
  text: {
    ko: string;
    en: string;
  };
  weights: Partial<Record<StoicControlId, number>>;
};

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

const STOIC_STATEMENTS: StoicStatement[] = [
  {
    id: "sc_l01",
    text: {
      ko: "당황스러운 일이 생기면, 먼저 내가 지금 통제할 수 있는 것부터 정리하려 한다.",
      en: "When something unsettling happens, I first sort out what I can actually control right now.",
    },
    weights: { "present-action": 2 },
  },
  {
    id: "sc_l02",
    text: {
      ko: "불안할수록 모든 가능성을 통제하려고 머릿속으로 여러 시나리오를 반복한다.",
      en: "The more anxious I feel, the more I replay possible scenarios in my head to control what may happen.",
    },
    weights: { future: 2 },
  },
  {
    id: "sc_l03",
    text: {
      ko: "선택을 한 뒤에도 사람들이 나를 어떻게 볼지 오래 신경 쓰인다.",
      en: "Even after making a choice, I keep thinking about how people may see me.",
    },
    weights: { "others-opinion": 2 },
  },
  {
    id: "sc_l04",
    text: {
      ko: "감정이 흔들리면, 흔들렸다는 사실 자체를 들키고 싶지 않다.",
      en: "When I feel shaken, I do not want others to notice that I was shaken at all.",
    },
    weights: { emotions: 2 },
  },
  {
    id: "sc_l05",
    text: {
      ko: "결과가 나오기 전부터 잘될지 망칠지를 계속 머릿속으로 판정한다.",
      en: "Before the result arrives, I keep judging in my head whether it will go well or fail.",
    },
    weights: { outcome: 2 },
  },
  {
    id: "sc_l06",
    text: {
      ko: "상대의 답장이 늦어지면, 관계의 온도가 달라진 것 같아 마음이 불편해진다.",
      en: "When someone replies late, I feel uneasy as if the temperature of the relationship has changed.",
    },
    weights: { relationships: 2 },
  },
  {
    id: "sc_l07",
    text: {
      ko: "작은 실수도 내가 아직 부족한 사람이라는 증거처럼 느껴질 때가 있다.",
      en: "Even a small mistake can feel like proof that I am still not good enough.",
    },
    weights: { "perfect-self": 2 },
  },
  {
    id: "sc_l08",
    text: {
      ko: "이미 지나간 장면도 ‘그때 다르게 말했어야 했는데’ 하며 오래 되감는다.",
      en: "I often rewind scenes that already passed, thinking I should have said something differently.",
    },
    weights: { past: 2 },
  },
  {
    id: "sc_l09",
    text: {
      ko: "상황이 복잡해질수록, 완벽한 답보다 지금 가능한 다음 행동 하나를 찾으려 한다.",
      en: "When things get complicated, I try to find one possible next action rather than the perfect answer.",
    },
    weights: { "present-action": 2 },
  },
  {
    id: "sc_l10",
    text: {
      ko: "아직 일어나지 않은 문제까지 대비해야 마음이 조금 놓인다.",
      en: "I feel a little safer only after preparing for problems that have not happened yet.",
    },
    weights: { future: 2 },
  },
  {
    id: "sc_l11",
    text: {
      ko: "내 의도보다 내 행동이 어떻게 해석될지가 먼저 떠오를 때가 많다.",
      en: "I often think first about how my action will be interpreted, rather than what I intended.",
    },
    weights: { "others-opinion": 2 },
  },
  {
    id: "sc_l12",
    text: {
      ko: "화나거나 서운해도, 일단 빨리 정리하고 평정심을 되찾아야 한다고 느낀다.",
      en: "Even when I am angry or hurt, I feel I should quickly organize myself and regain composure.",
    },
    weights: { emotions: 2 },
  },
  {
    id: "sc_l13",
    text: {
      ko: "과정에 최선을 다했어도, 결과가 애매하면 내가 실패한 것처럼 느껴진다.",
      en: "Even if I did my best in the process, an unclear result can still feel like my failure.",
    },
    weights: { outcome: 2 },
  },
  {
    id: "sc_l14",
    text: {
      ko: "관계가 어색해지면, 내가 무엇을 해야 다시 괜찮아질지 계속 계산한다.",
      en: "When a relationship feels awkward, I keep calculating what I should do to make it okay again.",
    },
    weights: { relationships: 2 },
  },
  {
    id: "sc_l15",
    text: {
      ko: "준비가 덜 된 모습을 보이면, 사람들이 나를 가볍게 볼까 봐 긴장된다.",
      en: "If I show an unfinished side of myself, I worry people may take me less seriously.",
    },
    weights: { "perfect-self": 2 },
  },
  {
    id: "sc_l16",
    text: {
      ko: "지난 선택을 떠올리며, 지금의 정보로 과거의 나를 엄하게 평가할 때가 있다.",
      en: "I sometimes judge my past self harshly using information I only have now.",
    },
    weights: { past: 2 },
  },
  {
    id: "sc_l17",
    text: {
      ko: "불확실한 상황에서도 내가 할 수 있는 작은 책임을 찾으면 마음이 안정된다.",
      en: "Even in uncertainty, finding one small responsibility I can take helps me feel steadier.",
    },
    weights: { "present-action": 2 },
  },
  {
    id: "sc_l18",
    text: {
      ko: "계획이 틀어질 가능성을 생각하지 않으면 오히려 더 불안해진다.",
      en: "If I do not think about how a plan might go wrong, I feel even more anxious.",
    },
    weights: { future: 2 },
  },
  {
    id: "sc_l19",
    text: {
      ko: "사람들이 나를 오해할 것 같으면, 행동하기 전부터 마음이 좁아진다.",
      en: "When I think people may misunderstand me, my mind tightens before I even act.",
    },
    weights: { "others-opinion": 2 },
  },
  {
    id: "sc_l20",
    text: {
      ko: "내 안에 감정이 남아 있어도 겉으로는 이미 괜찮은 사람처럼 보이고 싶다.",
      en: "Even when emotion remains inside me, I want to look like someone who is already fine.",
    },
    weights: { emotions: 2 },
  },
  {
    id: "sc_l21",
    text: {
      ko: "결과가 내 손을 떠난 뒤에도, 마음은 계속 결과를 붙잡고 있다.",
      en: "Even after the result has left my hands, my mind keeps holding onto it.",
    },
    weights: { outcome: 2 },
  },
  {
    id: "sc_l22",
    text: {
      ko: "상대의 기분이나 거리감이 변하면, 내가 관계를 놓친 것처럼 느껴진다.",
      en: "When someone’s mood or distance changes, it can feel like I have lost hold of the relationship.",
    },
    weights: { relationships: 2 },
  },
  {
    id: "sc_l23",
    text: {
      ko: "나답게 성장하고 싶지만, 부족한 모습을 허용하는 일은 여전히 어렵다.",
      en: "I want to grow in my own way, but allowing my unfinished parts is still difficult.",
    },
    weights: { "perfect-self": 2 },
  },
  {
    id: "sc_l24",
    text: {
      ko: "후회가 올라오면, 과거를 바꿀 수 없다는 사실을 받아들이기까지 시간이 걸린다.",
      en: "When regret rises, it takes time for me to accept that the past cannot be changed.",
    },
    weights: { past: 2 },
  },
];

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

function remapLikertWeights(statement: StoicStatement, value: number): Partial<Record<StoicControlId, number>> {
  const weights: Partial<Record<StoicControlId, number>> = {};
  const agreement = (value - 1) / 6;
  for (const [id, weight] of Object.entries(statement.weights) as Array<[StoicControlId, number]>) {
    weights[id] = (weights[id] ?? 0) + weight * agreement;
  }
  return weights;
}

export default function StoicControlTestClient(): ReactElement {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StoicAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<StoicResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  useEffect(() => {
    const payload = decodeSharePayload<StoicSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getStoicResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(STOIC_STATEMENTS.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentStatement = STOIC_STATEMENTS[questionIndex];
  const result = useMemo(() => sharedResult ?? calculateStoicResult(answers), [answers, sharedResult]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / STOIC_STATEMENTS.length) * 100;

  useEffect(() => {
    if (phase === "intro") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result" && result) {
      trackResultView("stoic-control", result.id);
    }
  }, [phase, result]);

  const start = useCallback(() => {
    trackTestStart("stoic-control", "Stoic Control Test");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareStatus("");
    setSelectedValue(null);
    window.history.replaceState(null, "", "/tests/stoic-control");
  }, []);

  const choose = useCallback(() => {
    if (selectedValue === null) return;
    trackQuestionAnswered("stoic-control", questionIndex + 1);
    const nextAnswer: StoicAnswer = {
      questionId: currentStatement.id,
      choiceId: `likert:${currentStatement.id}:${selectedValue}`,
      weights: remapLikertWeights(currentStatement, selectedValue),
    };
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);
    setShareStatus("");
    setSelectedValue(null);

    if (questionIndex >= STOIC_STATEMENTS.length - 1) {
      const nextResult = calculateStoicResult(nextAnswers);
      const url = buildShareUrl("/tests/stoic-control", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies StoicSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }

    setQuestionIndex((value) => value + 1);
  }, [answers, currentStatement, locale, questionIndex, selectedValue]);

  const share = useCallback(async () => {
    trackShareClick("stoic-control", "test", result.id);
    const url = buildShareUrl("/tests/stoic-control", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies StoicSharePayload);
    const title = t(locale, "스토아 철학 테스트 결과", "Stoic Control Test Result");
    const body = text(locale, result.shareLine);
    try {
      if (navigator.share) {
        await navigator.share({ title, text: body, url });
        setShareStatus(t(locale, "공유 창을 열었어요.", "Share sheet opened."));
        return;
      }
      await navigator.clipboard.writeText(`${body}\n${url}`);
      setShareStatus(t(locale, "결과 링크를 복사했어요.", "Result link copied."));
    } catch {
      try {
        await navigator.clipboard.writeText(`${body}\n${url}`);
        setShareStatus(t(locale, "결과 링크를 복사했어요.", "Result link copied."));
      } catch {
        setShareStatus(t(locale, "복사에 실패했어요. 주소창의 링크를 직접 복사해주세요.", "Copy failed. Please copy the URL from the address bar."));
      }
    }
  }, [locale, result]);

  return (
    <main className={`stoic-test stoic-test--${phase}`}>
      <section className="stoic-shell">
        {phase !== "quiz" && (
          <nav className="stoic-back">
            <Link href="/">{homeBackLabel(locale)}</Link>
          </nav>
        )}

        {phase === "intro" ? (
          <section className="stoic-hero">
            <div className="hero-copy">
              <p className="eyebrow">{t(locale, "스토아 철학 테스트 · STOIC CONTROL", "PHILOSOPHY TEST · STOIC CONTROL")}</p>
              <h1>{t(locale, "스토아 철학 테스트", "Stoic Control Test")}</h1>
              <p className="subtitle">
                {t(
                  locale,
                  "불안할 때, 나는 무엇을 붙잡으려 할까요?",
                  "What do you try to hold onto when you feel anxious?",
                )}
              </p>
              <p className="description">
                {t(
                  locale,
                  "통제할 수 있는 것과 없는 것을 구분하는 나의 마음 습관을 24개의 짧은 문장으로 살펴보세요.",
                  "Explore how you separate what you can control from what you cannot through 24 short statements.",
                )}
              </p>
              <div className="intro-chips" aria-label={t(locale, "테스트 정보", "Test info")}>
                <span>{t(locale, "24문장", "24 statements")}</span>
                <span>{t(locale, "약 4분", "About 4 min")}</span>
                <span>{t(locale, "철학 기반", "Philosophy lens")}</span>
              </div>
              <button type="button" onClick={start} className="primary">
                {t(locale, "테스트 시작하기", "Start the test")}
              </button>
              <p className="notice">
                {t(
                  locale,
                  "이 테스트는 전문적인 진단이 아닌, 심리학과 철학 개념을 바탕으로 만든 재미용 자기이해 콘텐츠입니다.",
                  "This is not a professional diagnosis. It is an entertainment and self-reflection experience based on psychology/philosophy concepts.",
                )}
              </p>
            </div>
          </section>
        ) : (
          <section className="stoic-card">
            <div className={`progress-head ${phase === "quiz" ? "progress-head--active" : ""}`}>
              {phase === "quiz" ? (
                <Link href="/" className="test-exit-link" aria-label={homeBackLabel(locale)}>
                  ←
                </Link>
              ) : (
                <span>{t(locale, "결과", "Result")}</span>
              )}
              <strong>
                {phase === "result"
                  ? `${STOIC_STATEMENTS.length} / ${STOIC_STATEMENTS.length}`
                  : `${questionIndex + 1} / ${STOIC_STATEMENTS.length}`}
              </strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <SingleStatementLikert
                locale={locale}
                onSelect={setSelectedValue}
                onSubmit={choose}
                selectedValue={selectedValue}
                statement={currentStatement}
              />
            ) : (
              <ResultView locale={locale} result={result} shared={Boolean(sharedResult)} onRetry={start} onShare={share} shareStatus={shareStatus} />
            )}
          </section>
        )}
      </section>

      {phase === "result" && (
        <>
          <AdResult placement="stoic-control-result" />
          <RecommendedGames
            currentId="stoic-control"
            ids={["thinking-pattern", "value-conflict", "defense-mechanism"]}
            title={{ ko: "다음 자기이해 테스트", en: "Try These Next" }}
          />
        </>
      )}

      <style jsx global>{`
        .stoic-test {
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: hidden;
          overflow-y: auto;
          color: #24231f;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.48), transparent 34%),
            linear-gradient(180deg, #f6efe4 0%, #e9dfcf 58%, #f7ecda 100%);
          padding: 24px clamp(16px, 4vw, 44px) 56px;
        }
        .stoic-shell {
          width: min(100%, 1040px);
          margin: 0 auto 34px;
          padding-top: clamp(10px, 2.5vh, 28px);
        }
        .stoic-back {
          margin-bottom: 18px;
          font-size: 14px;
        }
        .stoic-back a {
          color: rgba(36, 35, 31, 0.68);
          text-decoration: none;
          font-weight: 800;
        }
        .stoic-hero,
        .stoic-card {
          border: 1px solid rgba(71, 56, 35, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255, 253, 247, 0.91), rgba(235, 222, 199, 0.75)),
            #f8efdf;
          box-shadow: 0 30px 80px rgba(19, 17, 14, 0.28);
        }
        .stoic-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(100%, 840px);
          margin: 0 auto;
          min-height: min(720px, calc(100vh - 116px));
          padding: clamp(34px, 6vw, 76px) clamp(22px, 5vw, 60px);
          overflow: hidden;
        }
        .stoic-hero .hero-copy {
          width: min(100%, 720px);
          text-align: center;
        }
        .eyebrow,
        .progress-head span,
        .stoic-single-likert__kicker {
          margin: 0 0 12px;
          color: #896538;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        h1,
        h2 {
          margin: 0;
          letter-spacing: 0;
          line-height: 1.12;
          font-family: var(--font-noto-serif-kr), "Noto Serif KR", serif;
        }
        h1 {
          max-width: 680px;
          margin-inline: auto;
          font-size: clamp(38px, 6.4vw, 70px);
          word-break: keep-all;
          overflow-wrap: normal;
        }
        .subtitle,
        .description,
        .notice {
          max-width: 660px;
          margin-left: auto;
          margin-right: auto;
          color: rgba(36, 35, 31, 0.74);
          line-height: 1.72;
          word-break: keep-all;
        }
        .subtitle {
          margin: 18px 0 0;
          font-size: clamp(18px, 2.3vw, 23px);
          font-weight: 800;
        }
        .description {
          margin: 14px 0 28px;
          font-size: 16.5px;
        }
        .notice {
          margin: 10px 0 0;
          color: rgba(36, 35, 31, 0.52);
          font-size: 14px;
        }
        .primary,
        .secondary {
          border: 0;
          cursor: pointer;
          min-height: 52px;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 16px;
          font-weight: 900;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .primary {
          color: #fff9ee;
          background: linear-gradient(135deg, #967144, #4f5b4c);
          box-shadow: 0 18px 36px rgba(79, 91, 76, 0.22);
        }
        .secondary {
          color: #2c241b;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(71, 56, 35, 0.18);
        }
        .primary:hover,
        .secondary:hover {
          transform: translateY(-2px);
        }
        .stoic-card {
          margin-top: clamp(12px, 3vh, 28px);
          padding: clamp(24px, 4vw, 46px);
        }
        .progress-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .progress-head--active {
          min-height: 38px;
        }
        .test-exit-link {
          display: inline-grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          color: rgba(36, 35, 31, 0.68);
          background: rgba(255, 255, 255, 0.42);
          border: 1px solid rgba(71, 56, 35, 0.12);
          text-decoration: none;
          font-size: 19px;
          font-weight: 900;
          line-height: 1;
        }
        .progress-head span {
          margin: 0;
        }
        .progress-head strong {
          color: #73593a;
          font-size: 15px;
        }
        .progress-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(71, 56, 35, 0.12);
        }
        .progress-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #9b7445, #717c83);
          transition: width 220ms ease;
        }
        .stoic-single-likert {
          display: grid;
          gap: 24px;
          padding-top: clamp(30px, 6vw, 58px);
        }
        .stoic-single-likert__intro {
          display: grid;
          gap: 14px;
          max-width: 780px;
          margin-inline: auto;
          text-align: center;
        }
        .stoic-single-likert__kicker {
          margin: 0;
        }
        .stoic-single-likert h2 {
          margin: 0;
          color: #211d18;
          font-size: clamp(26px, 4.8vw, 46px);
          line-height: 1.32;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        .stoic-single-likert__help {
          margin: 0;
          color: rgba(36, 35, 31, 0.62);
          font-size: 15px;
          font-weight: 700;
          line-height: 1.55;
        }
        .stoic-single-likert__labels {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          max-width: 720px;
          width: 100%;
          margin: 8px auto 0;
          color: rgba(36, 35, 31, 0.64);
          font-size: 13px;
          font-weight: 850;
          line-height: 1.4;
        }
        .stoic-single-likert__labels span:nth-child(1) {
          text-align: left;
        }
        .stoic-single-likert__labels span:nth-child(2) {
          text-align: center;
        }
        .stoic-single-likert__labels span:nth-child(3) {
          text-align: right;
        }
        .stoic-single-likert__scale {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 10px;
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
        }
        .stoic-single-likert__scale button {
          aspect-ratio: 1;
          min-width: 0;
          border: 1px solid rgba(71, 56, 35, 0.18);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          color: #493827;
          cursor: pointer;
          font-size: clamp(15px, 3.6vw, 18px);
          font-weight: 950;
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, background 160ms ease, color 160ms ease;
        }
        .stoic-single-likert__scale button:hover,
        .stoic-single-likert__scale button.is-selected {
          transform: translateY(-2px);
          border-color: rgba(79, 91, 76, 0.5);
          background: linear-gradient(135deg, #967144, #4f5b4c);
          color: #fff9ee;
          box-shadow: 0 14px 28px rgba(79, 91, 76, 0.18);
        }
        .stoic-single-likert__next {
          justify-self: center;
          min-width: min(100%, 260px);
          margin-top: 4px;
        }
        .stoic-single-likert__next:disabled {
          cursor: not-allowed;
          transform: none;
          opacity: 0.48;
          box-shadow: none;
        }
        .result {
          display: grid;
          gap: 22px;
        }
        .shared-label {
          width: max-content;
          border: 1px solid rgba(137, 101, 56, 0.24);
          border-radius: 999px;
          background: rgba(137, 101, 56, 0.08);
          color: #73512d;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 900;
        }
        .result-title {
          display: grid;
          gap: 10px;
        }
        .result-title h2 {
          margin: 0;
          font-size: clamp(32px, 5.6vw, 58px);
        }
        .one-liner {
          margin: 0;
          color: #73512d;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 900;
        }
        .result-description {
          margin: 0;
          color: rgba(33, 29, 24, 0.8);
          font-size: 18px;
          line-height: 1.82;
        }
        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .result-box {
          border: 1px solid rgba(71, 56, 35, 0.15);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.62);
          padding: 16px;
        }
        .result-box span {
          display: block;
          margin-bottom: 8px;
          color: #73512d;
          font-size: 13px;
          font-weight: 900;
        }
        .result-box p {
          margin: 0;
          color: #211d18;
          font-size: 15.5px;
          line-height: 1.6;
          font-weight: 700;
        }
        .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .share-status {
          margin: 0;
          color: rgba(33, 29, 24, 0.68);
          font-size: 14px;
        }
        @media (max-width: 780px) {
          body:has(.stoic-test--quiz) .locale-floating-toggle {
            opacity: 0.28;
            transform: scale(0.84);
          }
          .result-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .stoic-test {
            padding-inline: 14px;
          }
          .stoic-hero,
          .stoic-card {
            border-radius: 24px;
          }
          .stoic-hero {
            min-height: auto;
            padding-top: 18px;
          }
          .stoic-single-likert {
            gap: 20px;
            padding-top: 30px;
          }
          .stoic-single-likert h2 {
            font-size: clamp(24px, 7vw, 31px);
            line-height: 1.38;
          }
          .stoic-single-likert__labels {
            font-size: 12px;
          }
          .stoic-single-likert__scale {
            gap: 6px;
          }
          .primary,
          .secondary {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

function SingleStatementLikert({
  locale,
  onSelect,
  onSubmit,
  selectedValue,
  statement,
}: {
  locale: SimpleLocale;
  onSelect: (value: number) => void;
  onSubmit: () => void;
  selectedValue: number | null;
  statement: StoicStatement;
}): ReactElement {
  return (
    <section className="stoic-single-likert" aria-label={t(locale, "7점 척도 응답", "7-point scale")}>
      <div className="stoic-single-likert__intro">
        <p className="stoic-single-likert__kicker">{t(locale, "지금의 내 반응", "Inner response")}</p>
        <h2>{text(locale, statement.text)}</h2>
        <p className="stoic-single-likert__help">
          {t(locale, "이 문장이 나와 얼마나 가까운지 선택하세요.", "Choose how closely this statement feels like you.")}
        </p>
      </div>
      <div className="stoic-single-likert__labels" aria-hidden="true">
        <span>{t(locale, "1 전혀 아니다", "1 Strongly disagree")}</span>
        <span>{t(locale, "4 보통이다", "4 Neutral")}</span>
        <span>{t(locale, "7 매우 그렇다", "7 Strongly agree")}</span>
      </div>
      <div className="stoic-single-likert__scale" role="radiogroup" aria-label={text(locale, statement.text)}>
        {SCALE_VALUES.map((value) => (
          <button
            aria-checked={selectedValue === value}
            className={selectedValue === value ? "is-selected" : ""}
            key={value}
            onClick={() => onSelect(value)}
            role="radio"
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <button
        className="primary stoic-single-likert__next"
        disabled={selectedValue === null}
        onClick={onSubmit}
        type="button"
      >
        {t(locale, "다음 문장", "Next statement")}
      </button>
    </section>
  );
}

function ResultView({
  locale,
  result,
  shared,
  onRetry,
  onShare,
  shareStatus,
}: {
  locale: SimpleLocale;
  result: StoicResult;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  return (
    <section className="result">
      {shared ? <span className="shared-label">{t(locale, "공유된 결과", "Shared Result")}</span> : null}
      <div className="result-title">
        <p className="eyebrow">{t(locale, "붙잡고 있는 통제", "Control You Hold Onto")}</p>
        <h2>{text(locale, result.title)}</h2>
        <p className="one-liner">{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>
      <div className="result-box result-basis">
        <span>{t(locale, "테스트 기준", "How this test works")}</span>
        <p>
          {t(
            locale,
            "이 테스트는 심리와 철학 개념을 일상 상황으로 쉽게 풀어낸 자기이해 콘텐츠입니다. 결과는 참고용이며 전문적인 진단이나 상담을 대체하지 않습니다.",
            "This test translates psychology/philosophy concepts into everyday situations. Results are for self-reflection only and do not replace professional diagnosis or counseling.",
          )}
        </p>
      </div>
      <div className="result-grid">
        <div className="result-box">
          <span>{t(locale, "통제할 수 없는 것", "Not Fully in Your Control")}</span>
          <p>{text(locale, result.cannotControl)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "선택할 수 있는 것", "What You Can Choose")}</span>
          <p>{text(locale, result.canChoose)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "오늘의 문장", "Today's Reflection")}</span>
          <p>{text(locale, result.reflection)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "작은 힌트", "Small Hint")}</span>
          <p>{text(locale, result.hint)}</p>
        </div>
      </div>
      <div className="result-actions">
        <button type="button" className="primary" onClick={onShare}>
          {t(locale, "결과 공유하기", "Share result")}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            trackRetryClick("stoic-control", "test");
            onRetry();
          }}
        >
          {shared ? t(locale, "나도 해보기", "Try it myself") : t(locale, "다시 하기", "Retry")}
        </button>
        {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
      </div>
    </section>
  );
}
