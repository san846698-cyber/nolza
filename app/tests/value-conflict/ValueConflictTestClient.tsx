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
  calculateValueResult,
  getValueResultById,
  type ValueAnswer,
  type ValueConflictId,
  type ValueResult,
} from "@/lib/value-conflict-test";

type Phase = "intro" | "quiz" | "result";
type ValueSharePayload = {
  v: 1;
  resultId: ValueConflictId;
  locale?: SimpleLocale;
};

type ValueStatement = {
  id: string;
  text: {
    ko: string;
    en: string;
  };
  weights: Partial<Record<ValueConflictId, number>>;
};

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;
const LIKERT_COLORS = ["#b4573c", "#c8803f", "#d4aa54", "#9fa45b", "#6b966b", "#598b94", "#5c6fa8"] as const;
const VALUE_DIM_COLORS: Record<ValueConflictId, string> = {
  "freedom-stability": "#c8803f",
  "recognition-independence": "#5c6fa8",
  "truth-peace": "#b4573c",
  "growth-rest": "#6b966b",
  "love-pride": "#d4aa54",
  "perfect-start": "#8c6a57",
  "responsibility-freedom": "#598b94",
  "stability-change": "#9fa45b",
  "balanced-negotiator": "#8b6aae",
};

const VALUE_STATEMENTS: ValueStatement[] = [
  {
    id: "vc_l01",
    text: {
      ko: "새로운 선택지가 생기면, 설렘보다 지금의 생활이 얼마나 흔들릴지를 먼저 계산한다.",
      en: "When a new option appears, I first calculate how much it might shake my current life before I feel excited.",
    },
    weights: { "freedom-stability": 2 },
  },
  {
    id: "vc_l02",
    text: {
      ko: "떠나고 싶은 마음이 있어도, 내가 이미 쌓아온 안정이 무너질까 봐 쉽게 움직이지 못한다.",
      en: "Even when I want to move on, I hesitate because I may lose the stability I have built.",
    },
    weights: { "freedom-stability": 2 },
  },
  {
    id: "vc_l03",
    text: {
      ko: "변화를 선택하고 싶지만, 내 일상과 관계를 지킬 최소한의 안전장치가 필요하다.",
      en: "I want to choose change, but I need at least one fallback that protects my routine and relationships.",
    },
    weights: { "freedom-stability": 2 },
  },
  {
    id: "vc_l04",
    text: {
      ko: "내 선택이 틀렸다고 보일까 봐, 주변 사람들의 시선이 오래 마음에 남는다.",
      en: "I keep thinking about how others may see my choice, especially if it might look wrong.",
    },
    weights: { "recognition-independence": 2 },
  },
  {
    id: "vc_l05",
    text: {
      ko: "인정받고 싶은 마음은 있지만, 그 기대에 맞추다 보면 내가 사라질 것 같아 불편하다.",
      en: "I want recognition, but I feel uneasy when meeting expectations starts to erase me.",
    },
    weights: { "recognition-independence": 2 },
  },
  {
    id: "vc_l06",
    text: {
      ko: "칭찬은 좋지만, 그 칭찬이 다음 선택의 기준이 되는 순간 답답해진다.",
      en: "Praise feels good, but it becomes suffocating when it turns into the standard for my next choice.",
    },
    weights: { "recognition-independence": 2 },
  },
  {
    id: "vc_l07",
    text: {
      ko: "사실을 말해야 한다는 걸 알면서도, 그 말 때문에 분위기가 깨질까 봐 오래 망설인다.",
      en: "Even when I know I should tell the truth, I hesitate because it may break the mood.",
    },
    weights: { "truth-peace": 2 },
  },
  {
    id: "vc_l08",
    text: {
      ko: "관계를 지키려고 넘긴 말들이 시간이 지나면 내 안에서 더 크게 남는다.",
      en: "The things I let pass to protect a relationship often become louder inside me later.",
    },
    weights: { "truth-peace": 2 },
  },
  {
    id: "vc_l09",
    text: {
      ko: "솔직하고 싶지만, 상대가 받을 수 있는 말의 온도까지 함께 고민한다.",
      en: "I want to be honest, but I also think about how gently the other person can receive it.",
    },
    weights: { "truth-peace": 2 },
  },
  {
    id: "vc_l10",
    text: {
      ko: "쉬고 싶다는 생각이 들어도, 멈추는 순간 뒤처지는 사람처럼 느껴진다.",
      en: "Even when I want to rest, stopping makes me feel like I am falling behind.",
    },
    weights: { "growth-rest": 2 },
  },
  {
    id: "vc_l11",
    text: {
      ko: "더 나아지고 싶은 마음이 커질수록, 몸과 마음이 보내는 피로 신호를 무시하게 된다.",
      en: "The more I want to improve, the more I ignore the fatigue signals from my body and mind.",
    },
    weights: { "growth-rest": 2 },
  },
  {
    id: "vc_l12",
    text: {
      ko: "나를 성장시키는 일이어도, 계속 버티기만 하면 결국 무너질 수 있다는 걸 안다.",
      en: "Even when something helps me grow, I know I may break down if all I do is endure.",
    },
    weights: { "growth-rest": 2 },
  },
  {
    id: "vc_l13",
    text: {
      ko: "먼저 다가가고 싶어도, 내가 더 매달리는 사람처럼 보일까 봐 마음을 숨긴다.",
      en: "Even when I want to reach out first, I hide it because I may look like the one who cares more.",
    },
    weights: { "love-pride": 2 },
  },
  {
    id: "vc_l14",
    text: {
      ko: "관계를 지키고 싶지만, 그 과정에서 내 자존심과 경계까지 내려놓고 싶지는 않다.",
      en: "I want to protect the relationship, but I do not want to drop my pride and boundaries to do it.",
    },
    weights: { "love-pride": 2 },
  },
  {
    id: "vc_l15",
    text: {
      ko: "준비가 완벽하지 않으면 시작해도 괜찮다는 말을 믿기 어렵다.",
      en: "If I am not fully ready, it is hard to believe that starting is still okay.",
    },
    weights: { "perfect-start": 2 },
  },
  {
    id: "vc_l16",
    text: {
      ko: "처음부터 잘하고 싶어서, 막상 첫 번째 버전을 세상에 꺼내는 일이 오래 걸린다.",
      en: "Because I want to do it well from the beginning, it takes me a long time to show the first version.",
    },
    weights: { "perfect-start": 2 },
  },
  {
    id: "vc_l17",
    text: {
      ko: "내가 빠지면 일이 무너질 것 같아서, 쉬고 싶어도 책임을 먼저 붙잡는다.",
      en: "When I think things may fall apart without me, I hold onto responsibility even when I want to rest.",
    },
    weights: { "responsibility-freedom": 2 },
  },
  {
    id: "vc_l18",
    text: {
      ko: "자유롭게 살고 싶지만, 누군가에게 남겨질 부담을 생각하면 마음이 쉽게 가벼워지지 않는다.",
      en: "I want to live freely, but thinking about the burden left to others keeps my heart from feeling light.",
    },
    weights: { "responsibility-freedom": 2 },
  },
  {
    id: "vc_l19",
    text: {
      ko: "내 몫이 아닌 일까지 떠안고 있다는 걸 알면서도, 손을 놓는 순간 죄책감이 올라온다.",
      en: "Even when I know I am carrying more than my share, guilt rises the moment I let go.",
    },
    weights: { "responsibility-freedom": 2 },
  },
  {
    id: "vc_l20",
    text: {
      ko: "지금이 나쁘지 않아도, 계속 이대로만 살면 내가 작아질 것 같다는 불안이 있다.",
      en: "Even when things are not bad now, I worry that staying the same may make me smaller.",
    },
    weights: { "stability-change": 2 },
  },
  {
    id: "vc_l21",
    text: {
      ko: "안정적인 삶은 소중하지만, 너무 익숙한 리듬 안에서는 숨이 막힐 때가 있다.",
      en: "A stable life matters to me, but sometimes the familiar rhythm starts to feel tight.",
    },
    weights: { "stability-change": 2 },
  },
  {
    id: "vc_l22",
    text: {
      ko: "큰 변화는 두렵지만, 아주 작은 실험이라도 하지 않으면 마음이 답답해진다.",
      en: "Big change scares me, but if I do not try even a small experiment, my heart feels stuck.",
    },
    weights: { "stability-change": 2 },
  },
  {
    id: "vc_l23",
    text: {
      ko: "두 가치가 충돌할 때, 바로 정답을 고르기보다 둘 사이의 작은 타협점을 먼저 찾는다.",
      en: "When two values collide, I look for a small bridge between them before choosing one answer.",
    },
    weights: { "balanced-negotiator": 2 },
  },
  {
    id: "vc_l24",
    text: {
      ko: "불안하더라도, 지금과 다른 가능성을 아주 작게라도 열어두고 싶다.",
      en: "Even with anxiety, I want to leave at least a small opening for a possibility different from now.",
    },
    weights: { "balanced-negotiator": 2 },
  },
];

function t(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, copy: { ko: string; en: string }): string {
  return locale === "ko" ? copy.ko : copy.en;
}

function remapLikertWeights(statement: ValueStatement, value: number): Partial<Record<ValueConflictId, number>> {
  const weights: Partial<Record<ValueConflictId, number>> = {};
  const agreement = (value - 1) / 6;
  for (const [id, weight] of Object.entries(statement.weights) as Array<[ValueConflictId, number]>) {
    weights[id] = (weights[id] ?? 0) + weight * agreement;
  }
  return weights;
}

function primaryValueDimension(weights: Partial<Record<ValueConflictId, number>>): ValueConflictId {
  const entries = Object.entries(weights) as Array<[ValueConflictId, number]>;
  return entries.reduce<ValueConflictId>((best, [id, value]) => (value > (weights[best] ?? -Infinity) ? id : best), entries[0]?.[0] ?? "balanced-negotiator");
}

export default function ValueConflictTestClient(): ReactElement {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ValueAnswer[]>([]);
  const [sharedResult, setSharedResult] = useState<ValueResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<ValueSharePayload>(new URLSearchParams(window.location.search).get("s"));
    const result = getValueResultById(payload?.resultId);
    if (payload?.v === 1 && result) {
      const restoreId = window.setTimeout(() => {
        setSharedResult(result);
        setPhase("result");
        setQuestionIndex(VALUE_STATEMENTS.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentStatement = VALUE_STATEMENTS[questionIndex];
  const result = useMemo(() => sharedResult ?? calculateValueResult(answers), [answers, sharedResult]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / VALUE_STATEMENTS.length) * 100;

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
      trackResultView("value-conflict", result.id);
    }
  }, [phase, result]);

  const start = useCallback(() => {
    trackTestStart("value-conflict", "Value Conflict Test");
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedResult(null);
    setShareStatus("");
    window.history.replaceState(null, "", "/tests/value-conflict");
  }, []);

  const choose = useCallback((value: number) => {
    trackQuestionAnswered("value-conflict", questionIndex + 1);
    const nextAnswer: ValueAnswer = {
      questionId: currentStatement.id,
      choiceId: `likert:${currentStatement.id}:${value}`,
      weights: remapLikertWeights(currentStatement, value),
    };
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);
    setShareStatus("");

    if (questionIndex >= VALUE_STATEMENTS.length - 1) {
      const nextResult = calculateValueResult(nextAnswers);
      const url = buildShareUrl("/tests/value-conflict", {
        v: 1,
        resultId: nextResult.id,
        locale,
      } satisfies ValueSharePayload);
      window.history.replaceState(null, "", url);
      setPhase("result");
      return;
    }

    setQuestionIndex((value) => value + 1);
  }, [answers, currentStatement, locale, questionIndex]);

  const share = useCallback(async () => {
    trackShareClick("value-conflict", "test", result.id);
    const url = buildShareUrl("/tests/value-conflict", {
      v: 1,
      resultId: result.id,
      locale,
    } satisfies ValueSharePayload);
    const title = t(locale, "가치관 갈등 테스트 결과", "Value Conflict Test Result");
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
    <main className={`value-test value-test--${phase}`}>
      <section className="value-shell">
        {phase !== "quiz" && (
          <nav className="value-back">
            <Link href="/">{homeBackLabel(locale)}</Link>
          </nav>
        )}

        {phase === "intro" ? (
          <section className="value-hero">
            <div className="hero-copy">
              <p className="eyebrow">{t(locale, "심리 테스트", "Psychology Test")}</p>
              <h1>{t(locale, "가치관 갈등 테스트", "Value Conflict Test")}</h1>
              <p className="subtitle">
                {t(locale, "내 안에서 자주 부딪히는 두 가치는 무엇일까요?", "What two values are fighting inside you?")}
              </p>
              <p className="description">
                {t(
                  locale,
                  "자유와 안정, 책임과 욕망, 시선과 확신 사이에서 흔들리는 마음을 24개의 짧은 문장으로 살펴보세요.",
                  "Explore the values that pull against each other inside you through 24 short statements.",
                )}
              </p>
              <div className="intro-chips" aria-label={t(locale, "테스트 정보", "Test info")}>
                <span>{t(locale, "24문장", "24 statements")}</span>
                <span>{t(locale, "약 4분", "About 4 min")}</span>
                <span>{t(locale, "가치 충돌", "Value conflict")}</span>
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
        ) : phase === "quiz" ? (
          <ValueFlowQuizView
            key={currentStatement.id}
            locale={locale}
            onAnswer={choose}
            onBack={() => {
              setPhase("intro");
              setQuestionIndex(0);
              setAnswers([]);
              setShareStatus("");
            }}
            questionIdx={questionIndex}
            statement={currentStatement}
            total={VALUE_STATEMENTS.length}
          />
        ) : (
          <section className="value-card">
            <div className="progress-head">
              <span>{t(locale, "결과", "Result")}</span>
              <strong>
                {VALUE_STATEMENTS.length} / {VALUE_STATEMENTS.length}
              </strong>
            </div>
            <div className="progress-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

            <ResultView locale={locale} result={result} shared={Boolean(sharedResult)} onRetry={start} onShare={share} shareStatus={shareStatus} />
          </section>
        )}
      </section>

      {phase === "result" && (
        <>
          <AdResult placement="value-conflict-result" />
          <RecommendedGames
            currentId="value-conflict"
            ids={["thinking-pattern", "stoic-control", "defense-mechanism"]}
            title={{ ko: "다음 자기이해 테스트", en: "Try These Next" }}
          />
        </>
      )}

      <style jsx global>{`
        .value-test {
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: hidden;
          overflow-y: auto;
          color: #211d18;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.52), transparent 34%),
            linear-gradient(180deg, #fbf4e7 0%, #f4e7d2 54%, #f8efe1 100%);
          padding: 24px clamp(16px, 4vw, 44px) 56px;
        }
        .value-shell {
          width: min(100%, 1040px);
          margin: 0 auto 34px;
          padding-top: clamp(10px, 2.5vh, 28px);
        }
        .value-back {
          margin-bottom: 18px;
          font-size: 14px;
        }
        .value-back a {
          color: rgba(33, 29, 24, 0.68);
          text-decoration: none;
          font-weight: 800;
        }
        .value-hero,
        .value-card {
          border: 1px solid rgba(68, 53, 35, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255, 253, 247, 0.9), rgba(238, 224, 198, 0.72)),
            #f7efe1;
          box-shadow: 0 30px 80px rgba(19, 17, 14, 0.28);
        }
        .value-hero {
          display: flex;
          align-items: center;
          width: min(100%, 840px);
          margin: 0 auto;
          min-height: min(720px, calc(100vh - 116px));
          padding: clamp(34px, 6vw, 76px) clamp(22px, 5vw, 60px);
          overflow: hidden;
        }
        .value-hero .hero-copy {
          width: min(100%, 720px);
        }
        .eyebrow,
        .progress-head span,
        .value-single-likert__kicker {
          margin: 0 0 12px;
          color: #9b6a23;
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
          max-width: 720px;
          font-size: clamp(38px, 6.5vw, 72px);
          word-break: keep-all;
        }
        .subtitle,
        .description,
        .notice {
          max-width: 650px;
          color: rgba(33, 29, 24, 0.74);
          line-height: 1.72;
          word-break: keep-all;
        }
        .subtitle {
          margin: 18px 0 0;
          font-size: clamp(18px, 2.3vw, 23px);
          font-weight: 800;
        }
        .description {
          margin: 14px 0 30px;
          font-size: 16.5px;
        }
        .notice {
          margin: 10px 0 0;
          color: rgba(33, 29, 24, 0.52);
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
          background: linear-gradient(135deg, #a66d25, #6b4a28);
          box-shadow: 0 18px 36px rgba(112, 73, 32, 0.22);
        }
        .secondary {
          color: #2c241b;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(68, 53, 35, 0.18);
        }
        .primary:hover,
        .secondary:hover {
          transform: translateY(-2px);
        }
        .value-card {
          margin-top: clamp(12px, 3vh, 28px);
          padding: clamp(24px, 4vw, 46px);
        }
        .value-test--quiz {
          padding: 0;
          background: linear-gradient(180deg, #fbf6ee 0%, #f1e5d5 58%, #f8efe2 100%);
        }
        .value-test--quiz .value-shell {
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .value-flow-shell {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .value-flow-topbar {
          position: relative;
          z-index: 25;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 40px;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
        }
        .value-flow-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          background: transparent;
          color: rgba(33, 29, 24, 0.7);
          cursor: pointer;
          font: inherit;
          padding: 6px 0;
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .value-flow-back:hover {
          color: #211d18;
          transform: translateX(-2px);
        }
        .value-flow-counter {
          color: rgba(33, 29, 24, 0.66);
          font-weight: 750;
        }
        .value-flow-body {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: clamp(28px, 6vh, 56px);
          padding: 24px;
        }
        .value-flow-question-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .value-flow-kicker {
          margin: 0 0 12px;
          color: rgba(155, 106, 35, 0.8);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .value-flow-question {
          max-width: 840px;
          margin: 0;
          padding: 0 28px;
          color: #211d18;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: clamp(24px, 3.2vw, 34px);
          font-weight: 820;
          line-height: 1.42;
          text-align: center;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        .value-flow-subtext {
          max-width: 680px;
          margin: 12px 0 0;
          padding: 0 28px;
          color: rgba(33, 29, 24, 0.62);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: clamp(15px, 1.8vw, 17px);
          line-height: 1.62;
          text-align: center;
          word-break: keep-all;
        }
        .value-flow-likert-area {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .value-flow-scale-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          width: 100%;
          padding: 0 16px;
        }
        .value-flow-likert-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          max-width: 600px;
        }
        .value-flow-likert-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          min-width: 0;
          border-width: 2.5px;
          border-style: solid;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 22px;
          font-weight: 760;
          padding: 0;
          transition: background 0.2s ease, opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .value-flow-likert-btn:hover {
          transform: scale(1.08);
        }
        .value-flow-scale-labels {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: min(100%, 600px);
          gap: 8px;
          color: rgba(33, 29, 24, 0.58);
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 760;
          line-height: 1.35;
        }
        .value-flow-scale-labels span:nth-child(2) {
          text-align: center;
        }
        .value-flow-scale-labels span:nth-child(3) {
          text-align: right;
        }
        .value-side-rail {
          position: fixed;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 25;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .value-side-rail-track {
          position: relative;
          width: 2px;
          background: #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .value-side-rail-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transition: height 0.4s cubic-bezier(0.22, 0.9, 0.35, 1), background 0.3s ease;
        }
        .value-side-rail-dot {
          position: relative;
          border-radius: 50%;
          transition: all 0.25s ease;
        }
        .value-side-rail-label {
          position: absolute;
          right: 22px;
          top: 50%;
          transform: translateY(-50%);
          color: #8b8f99;
          font-family: var(--font-inter), var(--font-noto-sans-kr), system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .value-mobile-progress {
          display: none;
        }
        .value-flow-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          color: #211d18;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
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
          color: rgba(33, 29, 24, 0.68);
          background: rgba(255, 255, 255, 0.42);
          border: 1px solid rgba(68, 53, 35, 0.12);
          text-decoration: none;
          font-size: 19px;
          font-weight: 900;
          line-height: 1;
        }
        .progress-head span {
          margin: 0;
        }
        .progress-head strong {
          color: #7d5b28;
          font-size: 15px;
        }
        .progress-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(68, 53, 35, 0.12);
        }
        .progress-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #9f6a25, #6d83a8);
          transition: width 220ms ease;
        }
        .value-single-likert {
          display: grid;
          gap: 24px;
          padding-top: clamp(30px, 6vw, 58px);
        }
        .value-single-likert__intro {
          display: grid;
          gap: 14px;
          max-width: 780px;
          margin-inline: auto;
          text-align: center;
        }
        .value-single-likert__kicker {
          margin: 0;
        }
        .value-single-likert h2 {
          margin: 0;
          color: #211d18;
          font-size: clamp(26px, 4.8vw, 46px);
          line-height: 1.32;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        .value-single-likert__help {
          margin: 0;
          color: rgba(33, 29, 24, 0.62);
          font-size: 15px;
          font-weight: 700;
          line-height: 1.55;
        }
        .value-single-likert__labels {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          max-width: 720px;
          width: 100%;
          margin: 8px auto 0;
          color: rgba(33, 29, 24, 0.64);
          font-size: 13px;
          font-weight: 850;
          line-height: 1.4;
        }
        .value-single-likert__labels span:nth-child(1) {
          text-align: left;
        }
        .value-single-likert__labels span:nth-child(2) {
          text-align: center;
        }
        .value-single-likert__labels span:nth-child(3) {
          text-align: right;
        }
        .value-single-likert__scale {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 10px;
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
        }
        .value-single-likert__scale button {
          aspect-ratio: 1;
          min-width: 0;
          border: 1px solid rgba(68, 53, 35, 0.18);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          color: #4b3420;
          cursor: pointer;
          font-size: clamp(15px, 3.6vw, 18px);
          font-weight: 950;
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, background 160ms ease, color 160ms ease;
        }
        .value-single-likert__scale button:hover,
        .value-single-likert__scale button.is-selected {
          transform: translateY(-2px);
          border-color: rgba(109, 131, 168, 0.52);
          background: linear-gradient(135deg, #a66d25, #6d83a8);
          color: #fff9ee;
          box-shadow: 0 14px 28px rgba(112, 73, 32, 0.18);
        }
        .value-single-likert__next {
          justify-self: center;
          min-width: min(100%, 260px);
          margin-top: 4px;
        }
        .value-single-likert__next:disabled {
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
          border: 1px solid rgba(159, 106, 37, 0.24);
          border-radius: 999px;
          background: rgba(159, 106, 37, 0.08);
          color: #815516;
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
          font-size: clamp(34px, 6vw, 64px);
        }
        .one-liner {
          margin: 0;
          color: #815516;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 900;
        }
        .result-description {
          margin: 0;
          color: rgba(33, 29, 24, 0.8);
          font-size: 18px;
          line-height: 1.82;
        }
        .result-depth {
          display: grid;
          gap: 12px;
        }
        .result-feature {
          border: 1px solid rgba(159, 106, 37, 0.18);
          border-radius: 20px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(252, 240, 219, 0.62));
          padding: 18px;
          box-shadow: 0 18px 44px rgba(89, 66, 39, 0.08);
        }
        .result-feature span,
        .result-quote span {
          display: block;
          margin-bottom: 8px;
          color: #815516;
          font-size: 13px;
          font-weight: 900;
        }
        .result-feature p {
          margin: 0;
          color: rgba(33, 29, 24, 0.84);
          font-size: 16.5px;
          line-height: 1.72;
          font-weight: 700;
        }
        .result-quote-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .result-quote {
          border: 1px solid rgba(68, 53, 35, 0.14);
          border-radius: 18px;
          background: rgba(36, 33, 28, 0.045);
          padding: 16px;
        }
        .result-quote p {
          margin: 0;
          color: #211d18;
          font-size: 16px;
          line-height: 1.62;
          font-weight: 900;
        }
        .result-quote--friend {
          background: rgba(159, 106, 37, 0.08);
        }
        .needed-sentence {
          border-left: 4px solid #9f6a25;
          background: rgba(255, 255, 255, 0.56);
        }
        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .result-box {
          border: 1px solid rgba(68, 53, 35, 0.15);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.62);
          padding: 16px;
        }
        .result-box span {
          display: block;
          margin-bottom: 8px;
          color: #815516;
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
          body:has(.value-test--quiz) .locale-floating-toggle {
            opacity: 0.28;
            transform: scale(0.84);
          }
          .value-side-rail {
            display: none;
          }
          .value-mobile-progress {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 40;
            width: 100%;
            height: 4px;
            background: rgba(229, 231, 235, 0.9);
          }
          .value-mobile-progress-fill {
            height: 100%;
            transition: width 0.35s ease, background 0.25s ease;
          }
          .value-flow-topbar {
            padding: 16px 20px 10px;
            font-size: 14px;
          }
          .value-flow-body {
            justify-content: center;
            gap: 34px;
            padding: 16px 12px 34px;
          }
          .value-flow-question {
            max-width: 400px;
            padding: 0 12px;
            font-size: clamp(22px, 6vw, 28px);
            line-height: 1.48;
          }
          .value-flow-subtext {
            padding: 0 16px;
            font-size: 14px;
          }
          .value-flow-likert-row {
            gap: 7px;
            max-width: 384px;
          }
          .value-flow-likert-btn {
            width: 48px;
            height: 48px;
            border-width: 2px;
            font-size: 16px;
          }
          .value-flow-scale-labels {
            width: min(100%, 384px);
            font-size: 11.5px;
          }
          .result-grid,
          .result-quote-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .value-test {
            padding-inline: 14px;
          }
          .value-hero,
          .value-card {
            border-radius: 24px;
          }
          .value-hero {
            min-height: auto;
            padding-top: 18px;
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

function ValueFlowQuizView({
  locale,
  onAnswer,
  onBack,
  questionIdx,
  statement,
  total,
}: {
  locale: SimpleLocale;
  onAnswer: (value: number) => void;
  onBack: () => void;
  questionIdx: number;
  statement: ValueStatement;
  total: number;
}): ReactElement {
  const dim = primaryValueDimension(statement.weights);
  const progress = (questionIdx + 1) / total;

  return (
    <section className="value-flow-shell">
      <ValueMobileProgress value={progress} dim={dim} />
      <ValueSideRail currentIdx={questionIdx} total={total} currentDim={dim} />
      <ValueQuestionBackground idx={questionIdx} />

      <div className="value-flow-topbar">
        <button type="button" onClick={onBack} className="value-flow-back" aria-label={t(locale, "나가기", "Exit test")}>
          <span aria-hidden>←</span>
          <span>{t(locale, "나가기", "Exit")}</span>
        </button>
        <span className="value-flow-counter tabular-nums">
          {questionIdx + 1} / {total}
        </span>
      </div>

      <div className="value-flow-body">
        <div className="value-flow-question-area">
          <p className="value-flow-kicker">{t(locale, "지금의 내 갈등", "Inner conflict")}</p>
          <h2 key={`value-statement-${statement.id}`} className="value-flow-question">
            {text(locale, statement.text)}
          </h2>
          <p className="value-flow-subtext">
            {t(locale, "이 문장이 내 반응과 얼마나 가까운지 골라주세요.", "Choose how closely this statement matches your reaction.")}
          </p>
        </div>

        <div className="value-flow-likert-area">
          <ValueLikertScale key={`value-scale-${statement.id}`} locale={locale} onAnswer={onAnswer} />
        </div>
      </div>
    </section>
  );
}

function ValueSideRail({
  currentIdx,
  currentDim,
  total,
}: {
  currentIdx: number;
  currentDim: ValueConflictId;
  total: number;
}): ReactElement {
  const color = VALUE_DIM_COLORS[currentDim] ?? "#8b6aae";
  const dotSpacing = 20;
  const trackHeight = (total - 1) * dotSpacing;
  const fillHeight = total > 1 ? (currentIdx / (total - 1)) * trackHeight : 0;

  return (
    <div className="value-side-rail" aria-hidden>
      <div className="value-side-rail-track" style={{ height: trackHeight }}>
        <div className="value-side-rail-fill" style={{ height: fillHeight, background: color }} />
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIdx;
          const isDone = i < currentIdx;
          const size = isCurrent ? 14 : 10;
          const dotColor = isCurrent ? color : isDone ? "#6b7280" : "#d1d5db";
          return (
            <div
              key={i}
              className="value-side-rail-dot"
              style={{
                width: size,
                height: size,
                background: dotColor,
                marginTop: i === 0 ? 0 : dotSpacing - size,
                boxShadow: isCurrent ? `0 0 0 4px ${color}22` : undefined,
              }}
            >
              {isCurrent && (
                <span className="value-side-rail-label tabular-nums">
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

function ValueMobileProgress({ dim, value }: { dim: ValueConflictId; value: number }): ReactElement {
  const color = VALUE_DIM_COLORS[dim] ?? "#8b6aae";
  return (
    <div className="value-mobile-progress" aria-hidden>
      <div className="value-mobile-progress-fill" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  );
}

function ValueLikertScale({
  locale,
  onAnswer,
}: {
  locale: SimpleLocale;
  onAnswer: (value: number) => void;
}): ReactElement {
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const endpoints = locale === "ko" ? ["전혀 아니다", "보통이다", "매우 그렇다"] : ["Strongly disagree", "Neutral", "Strongly agree"];

  const handleClick = useCallback(
    (value: number) => {
      if (pendingValue !== null) return;
      setPendingValue(value);
      window.setTimeout(() => onAnswer(value), 300);
    },
    [onAnswer, pendingValue],
  );

  return (
    <div className="value-flow-scale-wrap">
      <div className="value-flow-likert-row" role="radiogroup" aria-label={t(locale, "7점 척도", "7-point scale")}>
        {SCALE_VALUES.map((value, i) => {
          const color = LIKERT_COLORS[i];
          const isSelected = pendingValue === value;
          const dimmed = pendingValue !== null && !isSelected;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              aria-checked={isSelected}
              aria-label={`${value}`}
              className={`value-flow-likert-btn${isSelected ? " is-selected" : ""}`}
              role="radio"
              style={{
                borderColor: color,
                background: isSelected ? color : "transparent",
                color: isSelected ? "#fff" : color,
                opacity: dimmed ? 0.3 : 1,
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                boxShadow: isSelected ? `0 4px 16px ${color}66` : "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              {value}
            </button>
          );
        })}
      </div>
      <div className="value-flow-scale-labels" aria-hidden>
        <span>1 {endpoints[0]}</span>
        <span>4 {endpoints[1]}</span>
        <span>7 {endpoints[2]}</span>
      </div>
    </div>
  );
}

function ValueQuestionBackground({ idx }: { idx: number }): ReactElement {
  const rotate = (idx % 5) * 18;
  return (
    <svg className="value-flow-bg" viewBox="0 0 800 800" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2" transform={`rotate(${rotate} 400 400)`}>
        <circle cx="400" cy="400" r="245" />
        <circle cx="400" cy="400" r="154" />
        <path d="M160 400h480M400 160v480M230 230l340 340M570 230 230 570" />
      </g>
    </svg>
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
  result: ValueResult;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  return (
    <section className="result">
      {shared ? <span className="shared-label">{t(locale, "공유된 결과", "Shared Result")}</span> : null}
      <div className="result-title">
        <p className="eyebrow">{t(locale, "나의 가치관 갈등", "My Value Conflict")}</p>
        <h2>{text(locale, result.title)}</h2>
        <p className="one-liner">{text(locale, result.oneLiner)}</p>
      </div>
      <p className="result-description">{text(locale, result.description)}</p>
      <div className="result-feature result-basis">
        <span>{t(locale, "테스트 기준", "How this test works")}</span>
        <p>
          {t(
            locale,
            "이 테스트는 심리와 철학 개념을 일상 상황으로 쉽게 풀어낸 자기이해 콘텐츠입니다. 결과는 참고용이며 전문적인 진단이나 상담을 대체하지 않습니다.",
            "This test translates psychology/philosophy concepts into everyday situations. Results are for self-reflection only and do not replace professional diagnosis or counseling.",
          )}
        </p>
      </div>
      <div className="result-depth">
        <div className="result-feature">
          <span>{t(locale, "내 안의 갈등 구조", "Your Inner Conflict Pattern")}</span>
          <p>{text(locale, result.conflictStructure)}</p>
        </div>
        <div className="result-quote-grid">
          <div className="result-quote">
            <span>{t(locale, "자주 하는 생각", "A Thought You Often Have")}</span>
            <p>{text(locale, result.commonThought)}</p>
          </div>
          <div className="result-quote result-quote--friend">
            <span>{t(locale, "친구가 보면 할 말", "What a Friend Might Say")}</span>
            <p>{text(locale, result.friendComment)}</p>
          </div>
        </div>
      </div>
      <div className="result-grid">
        <div className="result-box">
          <span>{t(locale, "강점", "Strength")}</span>
          <p>{text(locale, result.strength)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "조심할 점", "Risk")}</span>
          <p>{text(locale, result.risk)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "자주 나타나는 순간", "Where It Appears")}</span>
          <p>{text(locale, result.moment)}</p>
        </div>
        <div className="result-box">
          <span>{t(locale, "조금 편해지는 힌트", "A Hint That Helps")}</span>
          <p>{text(locale, result.hint)}</p>
        </div>
        <div className="result-box needed-sentence">
          <span>{t(locale, "이 유형에게 필요한 한 문장", "One Sentence This Type Needs")}</span>
          <p>{text(locale, result.neededSentence)}</p>
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
            trackRetryClick("value-conflict", "test");
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
