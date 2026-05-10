"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Q = { ko: string; en: string; weight: number };

const QUESTIONS: Q[] = [
  { ko: "불닭볶음면 한 봉지를 다 먹을 수 있다", en: "I can finish a whole pack of Buldak Ramen", weight: 2 },
  { ko: "청양고추를 날 것으로 먹을 수 있다", en: "I can eat raw 청양고추 (cheongyang pepper)", weight: 3 },
  { ko: "마라탕 5단계 이상 먹어봤다", en: "I've eaten 마라탕 (mala tang) at level 5+", weight: 2 },
  { ko: "김치 없으면 식사가 허전하다", en: "A meal feels empty without kimchi", weight: 1 },
  { ko: "고추기름을 일부러 음식에 더 넣는다", en: "I add chili oil to spice up dishes", weight: 1 },
  { ko: "엽기떡볶이 매운맛을 즐긴다", en: "I enjoy spicy 떡볶이 (Yeopgi)", weight: 2 },
  { ko: "땀이 안 나도록 매운 걸 잘 먹는다", en: "I eat spicy food without breaking a sweat", weight: 3 },
  { ko: "외국 친구가 매운 걸 못 먹어서 답답한 적 있다", en: "I've been frustrated by foreign friends who can't handle spicy", weight: 1 },
  { ko: "신라면이 \"안 매운\" 축에 속한다", en: "I think Shin Ramyun isn't even spicy", weight: 2 },
  { ko: "매운 음식 먹다가 울어본 적 \"없다\"", en: "I've never cried from spicy food", weight: 3 },
];

type Level = 1 | 2 | 3 | 4 | 5;

const LEVELS: Record<Level, { ko: string; en: string; emoji: string; desc: { ko: string; en: string } }> = {
  1: {
    ko: "순한맛 초보", en: "Mild Beginner", emoji: "🥛",
    desc: { ko: "물도 매워하실 듯요. 우유 많이 챙기세요.", en: "Even water seems spicy. Keep milk close." },
  },
  2: {
    ko: "보통 맵부심", en: "Moderate", emoji: "🌶️",
    desc: { ko: "한국 평균 정도. 신라면은 거뜬.", en: "Korean average. Shin Ramyun is fine." },
  },
  3: {
    ko: "한국인 정상", en: "True Korean", emoji: "🌶️🌶️",
    desc: { ko: "정통 한국인의 매운맛 내성.", en: "Authentic Korean spice tolerance." },
  },
  4: {
    ko: "매운맛 마니아", en: "Spice Master", emoji: "🌶️🌶️🌶️",
    desc: { ko: "친구들이 \"미친 거 아니야?\"라고 합니다.", en: "Friends ask if you're insane." },
  },
  5: {
    ko: "김치의 신", en: "God of Kimchi", emoji: "🌶️🌶️🌶️🌶️",
    desc: { ko: "용암을 마시고 다닐 수도 있습니다.", en: "You could probably drink lava." },
  },
};

function getLevel(score: number, max: number): Level {
  const ratio = score / max;
  if (ratio >= 0.85) return 5;
  if (ratio >= 0.65) return 4;
  if (ratio >= 0.45) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

export default function KimchiSpicy() {
  const [lang, setLang] = useState<"en" | "ko">("en");
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const max = QUESTIONS.reduce((s, q) => s + q.weight, 0);
  const score = QUESTIONS.reduce(
    (s, q, i) => (answers[i] ? s + q.weight : s),
    0,
  );

  const level = useMemo(() => (done ? getLevel(score, max) : null), [done, score, max]);

  const totalAnswered = Object.keys(answers).length;

  const handleShare = async () => {
    if (!level) return;
    const data = LEVELS[level];
    const text =
      lang === "en"
        ? `My Korean Spice Level: ${data.emoji} ${data.en} (Lv.${level}/5) → nolza.fun/games/kimchi-spicy`
        : `내 매운맛 레벨: ${data.emoji} ${data.ko} (Lv.${level}/5) → nolza.fun/games/kimchi-spicy`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const t = (en: string, ko: string) => (lang === "en" ? en : ko);

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border" style={{ backgroundColor: "rgba(255, 59, 48, 0.06)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <button
            type="button"
            onClick={() => setLang((l) => (l === "en" ? "ko" : "en"))}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-accent"
          >
            {lang === "en" ? "🌐 한국어" : "🌐 EN"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("Korean Spice Level", "김치 매운맛 레벨")} 🌶️
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "Test your tolerance against the heat of Korean cuisine.",
              "한국 매운 음식 내성을 테스트해보세요.",
            )}
          </p>
        </header>

        {!done ? (
          <>
            <div className="space-y-2">
              {QUESTIONS.map((q, i) => {
                const v = answers[i];
                return (
                  <div key={i} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm md:text-base">{t(q.en, q.ko)}</span>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [i]: true }))}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                            v === true ? "bg-accent text-white" : "border border-border text-gray-400 hover:text-accent"
                          }`}
                        >
                          ✓ {t("YES", "YES")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [i]: false }))}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                            v === false ? "bg-bg text-gray-300 ring-2 ring-gray-500" : "border border-border text-gray-400 hover:text-white"
                          }`}
                        >
                          ✕ NO
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setDone(true)}
              disabled={totalAnswered < QUESTIONS.length}
              className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90 disabled:opacity-30"
            >
              {t("Show Results", "결과 보기")} ({totalAnswered}/{QUESTIONS.length})
            </button>
          </>
        ) : (
          level && (
            <>
              <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
                <div className="text-7xl">{LEVELS[level].emoji}</div>
                <div className="mt-4 text-xs text-accent">
                  {t("Your Spice Level", "당신의 레벨")}
                </div>
                <div className="mt-1 text-3xl font-black md:text-5xl">
                  Lv.{level}/5 — {t(LEVELS[level].en, LEVELS[level].ko)}
                </div>
                <p className="mt-4 text-base text-gray-300 md:text-lg">
                  {t(LEVELS[level].desc.en, LEVELS[level].desc.ko)}
                </p>
              </div>
              <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                <div className="text-xs text-gray-500">
                  {t("Korean Spicy Tier List", "한국 매운맛 음식 티어")}
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>🌶️ Lv.1 — {t("Mild kimchi soup", "순한 김치찌개")}</li>
                  <li>🌶️🌶️ Lv.2 — {t("Shin Ramyun", "신라면")}</li>
                  <li>🌶️🌶️🌶️ Lv.3 — {t("Yeopgi 떡볶이", "엽기떡볶이")}</li>
                  <li>🌶️🌶️🌶️🌶️ Lv.4 — {t("Buldak 2x", "불닭볶음면 2배")}</li>
                  <li>🌶️🌶️🌶️🌶️🌶️ Lv.5 — {t("Raw 청양고추", "청양고추 생식")}</li>
                </ul>
              </section>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => { setAnswers({}); setDone(false); }}
                  className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
                >
                  ↻ {t("Try Again", "다시")}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  {copied ? "✓" : "📋"} {t("Share Result", "공유")}
                </button>
              </div>
            </>
          )
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
