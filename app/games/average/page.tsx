"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Q = {
  ko: string;
  en: string;
  min: number;
  max: number;
  step: number;
  answer: number;
  unitKo: string;
  unitEn: string;
  sourceKo: string;
  sourceEn: string;
  init: number;
};

const QUESTIONS: Q[] = [
  { ko: "오늘 몇 시간 잤어요?", en: "How many hours did you sleep?", min: 0, max: 12, step: 0.1, answer: 6.8, unitKo: "h", unitEn: "h", sourceKo: "통계청 시간활용조사", sourceEn: "Statistics Korea Time-Use Survey", init: 7 },
  { ko: "하루 스마트폰 몇 시간?", en: "Daily phone usage?", min: 0, max: 16, step: 0.1, answer: 4.2, unitKo: "h", unitEn: "h", sourceKo: "방통위 미디어이용행태조사", sourceEn: "KCC Media Use Survey", init: 4 },
  { ko: "한 달 커피 몇 잔?", en: "Monthly coffee cups?", min: 0, max: 100, step: 1, answer: 12.3, unitKo: "잔", unitEn: "cups", sourceKo: "관세청 커피 수입량 추정", sourceEn: "Korea Customs coffee imports", init: 30 },
  { ko: "하루 걸음 수?", en: "Daily steps?", min: 0, max: 20000, step: 100, answer: 5200, unitKo: "보", unitEn: "steps", sourceKo: "보건복지부 신체활동 조사", sourceEn: "MOHW Physical Activity Survey", init: 7000 },
  { ko: "한 달 외식 몇 번?", en: "Monthly dining out?", min: 0, max: 30, step: 1, answer: 8.4, unitKo: "회", unitEn: "times", sourceKo: "보건사회연구원 식생활 조사", sourceEn: "KIHASA Diet Survey", init: 10 },
  { ko: "유튜브 하루 몇 분?", en: "Daily YouTube minutes?", min: 0, max: 300, step: 5, answer: 72, unitKo: "분", unitEn: "min", sourceKo: "와이즈앱 분석 자료", sourceEn: "Wise App analytics", init: 60 },
  { ko: "한 달 독서 몇 권?", en: "Monthly books read?", min: 0, max: 10, step: 0.1, answer: 0.8, unitKo: "권", unitEn: "books", sourceKo: "국민독서실태조사", sourceEn: "National Reading Survey", init: 1 },
  { ko: "하루 물 몇 잔?", en: "Daily glasses of water?", min: 0, max: 15, step: 0.1, answer: 4.1, unitKo: "잔", unitEn: "glasses", sourceKo: "보건복지부 영양조사", sourceEn: "MOHW Nutrition Survey", init: 5 },
  { ko: "주당 운동 몇 회?", en: "Weekly exercise sessions?", min: 0, max: 7, step: 0.1, answer: 1.3, unitKo: "회", unitEn: "times", sourceKo: "국민체력 100 통계", sourceEn: "National Fitness 100", init: 2 },
  { ko: "카카오톡 하루 몇 개?", en: "Daily KakaoTalk messages?", min: 0, max: 500, step: 1, answer: 47, unitKo: "개", unitEn: "msgs", sourceKo: "카카오 IR 자료 추정", sourceEn: "Kakao IR estimate", init: 50 },
];

function tier(acc: number, t: (k: string, e: string) => string): string {
  if (acc >= 90) return t("당신은 완벽한 평균 한국인입니다 🇰🇷", "You're the perfect average Korean 🇰🇷");
  if (acc >= 70) return t("꽤 평균적인 한국인이네요", "Pretty average Korean");
  if (acc >= 50) return t("당신은 특이한 한국인이에요", "You're an unusual Korean");
  return t("당신... 한국인 맞아요? 👀", "Are you... actually Korean? 👀");
}

function formatVal(v: number, q: Q): string {
  if (q.step < 1) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
}

export default function AverageGame() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState<number>(QUESTIONS[0].init);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (answers.length < QUESTIONS.length) return null;
    const accs = answers.map((a, i) => {
      const q = QUESTIONS[i];
      const error = Math.abs(a - q.answer);
      const ratio = error / q.answer;
      return Math.max(0, 100 - ratio * 50);
    });
    const overall = accs.reduce((s, x) => s + x, 0) / accs.length;
    return { accs, overall };
  }, [answers]);

  const next = () => {
    const newAnswers = [...answers, current];
    setAnswers(newAnswers);
    if (newAnswers.length < QUESTIONS.length) {
      setStep((s) => s + 1);
      setCurrent(QUESTIONS[newAnswers.length].init);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setCurrent(QUESTIONS[0].init);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = t(
      `나 한국인 평균과 ${result.overall.toFixed(1)}% 일치 → nolza.fun/games/average`,
      `${result.overall.toFixed(1)}% match with Korean average → nolza.fun/games/average`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (result) {
    return (
      <main
        className="page-in min-h-screen"
        style={{
          backgroundColor: "#f8f8f8",
          color: "#1a1a1a",
          fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        }}
      >
        <Link href="/" className="back-arrow" aria-label="home" style={{ color: "#666" }}>
          ←
        </Link>
        <div className="mx-auto max-w-2xl px-6" style={{ paddingTop: 100, paddingBottom: 80 }}>
          <div className="text-center">
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#999", textTransform: "uppercase" }}>
              {t("한국인 평균과 일치", "Match with Korean Average")}
            </div>
            <div
              className="tabular-nums"
              style={{
                marginTop: 28,
                fontSize: 96,
                fontWeight: 200,
                color: "#1a1a1a",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {result.overall.toFixed(0)}
              <span style={{ fontSize: 36, color: "#bbb", marginLeft: 4, fontWeight: 300 }}>%</span>
            </div>
            <div style={{ marginTop: 24, fontSize: 16, color: "#444", fontWeight: 500 }}>
              {tier(result.overall, t)}
            </div>
          </div>

          <ul style={{ marginTop: 64 }}>
            {QUESTIONS.map((q, i) => {
              const yourAnswer = answers[i];
              const acc = result.accs[i];
              return (
                <li
                  key={i}
                  style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span style={{ fontSize: 16, color: "#1a1a1a", fontWeight: 500 }}>
                      {locale === "ko" ? q.ko : q.en}
                    </span>
                    <span
                      className="tabular-nums shrink-0"
                      style={{
                        fontSize: 14,
                        color: acc >= 80 ? "#16a34a" : acc >= 50 ? "#888" : "#FF3B30",
                        fontWeight: 600,
                      }}
                    >
                      {acc.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-3 tabular-nums" style={{ fontSize: 14 }}>
                    <span style={{ color: "#999" }}>
                      {t("내 답", "Yours")}:{" "}
                      <span style={{ color: "#FF3B30", fontWeight: 600 }}>
                        {formatVal(yourAnswer, q)}
                        {locale === "ko" ? q.unitKo : q.unitEn}
                      </span>
                    </span>
                    <span style={{ color: "#999" }}>
                      {t("평균", "Avg")}:{" "}
                      <span style={{ color: "#1a1a1a", fontWeight: 600 }}>
                        {q.answer}
                        {locale === "ko" ? q.unitKo : q.unitEn}
                      </span>
                    </span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "#bbb" }}>
                    {t("출처", "Source")} · {locale === "ko" ? q.sourceKo : q.sourceEn}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={restart}
              className="rounded-full"
              style={{
                background: "transparent",
                border: "1px solid #ccc",
                color: "#666",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              ↻ {t("다시", "AGAIN")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full"
              style={{
                background: "#1a1a1a",
                color: "white",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {copied ? "✓ COPIED" : t("공유하기", "SHARE")}
            </button>
          </div>
          <AdBottom />
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  const q = QUESTIONS[step];

  return (
    <main
      className="page-in min-h-screen"
      style={{
        backgroundColor: "#f8f8f8",
        color: "#1a1a1a",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
      }}
    >
      <Link href="/" className="back-arrow" aria-label="home" style={{ color: "#666" }}>
        ←
      </Link>
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <AdTop />
      </div>

      <div className="mx-auto flex max-w-xl flex-col justify-center px-6 pb-16" style={{ minHeight: "calc(100svh - 220px)" }}>
        <div className="text-center fade-in" key={step}>
          <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#999" }}>
            {step + 1} / {QUESTIONS.length}
          </div>
          <h1
            style={{
              marginTop: 24,
              fontSize: 26,
              fontWeight: 500,
              color: "#1a1a1a",
              lineHeight: 1.4,
            }}
          >
            {locale === "ko" ? q.ko : q.en}
          </h1>

          <div
            className="tabular-nums"
            style={{
              marginTop: 56,
              fontSize: 80,
              fontWeight: 200,
              color: "#FF3B30",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {formatVal(current, q)}
            <span style={{ fontSize: 28, color: "#bbb", marginLeft: 8, fontWeight: 300 }}>
              {locale === "ko" ? q.unitKo : q.unitEn}
            </span>
          </div>

          <input
            type="range"
            min={q.min}
            max={q.max}
            step={q.step}
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
            className="mt-12 w-full"
            style={{ accentColor: "#FF3B30" }}
          />
          <div
            className="mt-2 flex justify-between tabular-nums"
            style={{ fontSize: 13, color: "#bbb" }}
          >
            <span>{q.min}{locale === "ko" ? q.unitKo : q.unitEn}</span>
            <span>{q.max.toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}{locale === "ko" ? q.unitKo : q.unitEn}</span>
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-12 rounded-full"
            style={{
              background: "#1a1a1a",
              color: "white",
              padding: "12px 36px",
              fontSize: 14,
              letterSpacing: "0.2em",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {step + 1 >= QUESTIONS.length ? t("결과 보기", "RESULTS") : t("다음", "NEXT")} ▸
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: i < step ? "#1a1a1a" : i === step ? "#FF3B30" : "#ddd",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>
      <AdMobileSticky />
    </main>
  );
}
