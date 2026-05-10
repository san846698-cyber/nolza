"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Question = {
  id: number;
  ko: { a: string; b: string };
  en: { a: string; b: string };
  emojiA: string;
  emojiB: string;
};

const QUESTIONS: Question[] = [
  { id: 1, ko: { a: "치킨", b: "피자" }, en: { a: "Chicken", b: "Pizza" }, emojiA: "🍗", emojiB: "🍕" },
  { id: 2, ko: { a: "카카오톡", b: "문자" }, en: { a: "KakaoTalk", b: "SMS" }, emojiA: "💬", emojiB: "✉️" },
  { id: 3, ko: { a: "여름", b: "겨울" }, en: { a: "Summer", b: "Winter" }, emojiA: "☀️", emojiB: "❄️" },
  { id: 4, ko: { a: "짜장면", b: "짬뽕" }, en: { a: "Jjajangmyeon", b: "Jjamppong" }, emojiA: "🍜", emojiB: "🌶️" },
  { id: 5, ko: { a: "버스", b: "지하철" }, en: { a: "Bus", b: "Subway" }, emojiA: "🚌", emojiB: "🚇" },
  { id: 6, ko: { a: "아이유", b: "블랙핑크" }, en: { a: "IU", b: "BLACKPINK" }, emojiA: "🎤", emojiB: "💖" },
  { id: 7, ko: { a: "삼성", b: "애플" }, en: { a: "Samsung", b: "Apple" }, emojiA: "📱", emojiB: "🍎" },
  { id: 8, ko: { a: "라면", b: "김밥" }, en: { a: "Ramen", b: "Kimbap" }, emojiA: "🍜", emojiB: "🍙" },
  { id: 9, ko: { a: "된장찌개", b: "김치찌개" }, en: { a: "Doenjang Stew", b: "Kimchi Stew" }, emojiA: "🍲", emojiB: "🌶️" },
  { id: 10, ko: { a: "수능 망함", b: "취업 안됨" }, en: { a: "Bombed the SAT", b: "Can't find a job" }, emojiA: "📚", emojiB: "💼" },
  { id: 11, ko: { a: "서울", b: "제주" }, en: { a: "Seoul", b: "Jeju" }, emojiA: "🏙️", emojiB: "🏝️" },
  { id: 12, ko: { a: "민초", b: "반민초" }, en: { a: "Mint Choc Yes", b: "Mint Choc No" }, emojiA: "🍃", emojiB: "🍫" },
  { id: 13, ko: { a: "탕수육 부먹", b: "탕수육 찍먹" }, en: { a: "Sauce on top", b: "Sauce on side" }, emojiA: "💧", emojiB: "🥢" },
  { id: 14, ko: { a: "아침형 인간", b: "저녁형 인간" }, en: { a: "Morning person", b: "Night owl" }, emojiA: "🌅", emojiB: "🌙" },
  { id: 15, ko: { a: "MBTI 믿음", b: "안 믿음" }, en: { a: "Believe MBTI", b: "Don't believe" }, emojiA: "🔮", emojiB: "🤨" },
  { id: 16, ko: { a: "혼밥", b: "단체밥" }, en: { a: "Eat alone", b: "Eat together" }, emojiA: "🍱", emojiB: "🍽️" },
  { id: 17, ko: { a: "코노", b: "노래방" }, en: { a: "Coin karaoke", b: "Group karaoke" }, emojiA: "🎵", emojiB: "🎤" },
  { id: 18, ko: { a: "치맥", b: "소맥" }, en: { a: "Chicken + beer", b: "Soju + beer" }, emojiA: "🍻", emojiB: "🥃" },
  { id: 19, ko: { a: "에어컨 24도", b: "에어컨 26도" }, en: { a: "AC at 24°C", b: "AC at 26°C" }, emojiA: "🥶", emojiB: "🥵" },
  { id: 20, ko: { a: "퇴근 칼퇴", b: "야근+택시비" }, en: { a: "Leave on time", b: "Overtime + taxi" }, emojiA: "🏃", emojiB: "🚖" },
];

type Vote = { a: number; b: number };
const VOTES_KEY = "nolza-balance-votes";
const CHOICES_KEY = "nolza-balance-choices";

function loadVotes(): Record<number, Vote> {
  try {
    const saved = localStorage.getItem(VOTES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const seed: Record<number, Vote> = {};
  for (const q of QUESTIONS) {
    seed[q.id] = {
      a: 50 + Math.floor(Math.random() * 200),
      b: 50 + Math.floor(Math.random() * 200),
    };
  }
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(seed));
  } catch {}
  return seed;
}

function loadChoices(): Record<number, "a" | "b"> {
  try {
    const saved = localStorage.getItem(CHOICES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

export default function BalanceGame() {
  const { locale, t } = useLocale();
  const [idx, setIdx] = useState(0);
  const [votes, setVotes] = useState<Record<number, Vote>>({});
  const [choices, setChoices] = useState<Record<number, "a" | "b">>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVotes(loadVotes());
    setChoices(loadChoices());
  }, []);

  const current = QUESTIONS[idx];
  const tally = (current && votes[current.id]) ?? { a: 0, b: 0 };
  const total = tally.a + tally.b;
  const pctA = total > 0 ? (tally.a / total) * 100 : 50;
  const pctB = 100 - pctA;
  const userChoice = current ? choices[current.id] : undefined;

  const vote = (choice: "a" | "b") => {
    if (!current || userChoice) return;
    const newTally = { ...tally, [choice]: tally[choice] + 1 };
    const newVotes = { ...votes, [current.id]: newTally };
    const newChoices = { ...choices, [current.id]: choice };
    setVotes(newVotes);
    setChoices(newChoices);
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(newVotes));
      localStorage.setItem(CHOICES_KEY, JSON.stringify(newChoices));
    } catch {}
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) setDone(true);
    else setIdx((i) => i + 1);
  };

  const restart = () => {
    setIdx(0);
    setDone(false);
  };

  const majorityScore = useMemo(() => {
    let count = 0;
    for (const q of QUESTIONS) {
      const v = votes[q.id];
      const c = choices[q.id];
      if (!v || !c) continue;
      const aWin = v.a >= v.b;
      const userWithMajority = (aWin && c === "a") || (!aWin && c === "b");
      if (userWithMajority) count++;
    }
    return count;
  }, [votes, choices]);

  const handleShare = async () => {
    const text = t(
      `한국형 밸런스 게임: ${QUESTIONS.length}문제 중 다수결과 ${majorityScore}개 일치 → nolza.fun/games/balance`,
      `Korean Balance Game: matched majority on ${majorityScore} of ${QUESTIONS.length} → nolza.fun/games/balance`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (done) {
    const totalAnswered = Object.keys(choices).length;
    return (
      <main className="min-h-screen bg-bg pb-32">
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              ← {t("놀자.fun으로 돌아가기", "Back to Nolza.fun")}
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">{t("밸런스 게임 완료", "Balance Game Complete")}</div>
            <div className="mt-3 text-5xl font-black md:text-6xl">
              <span className="tabular-nums">{majorityScore}</span>
              <span className="text-2xl text-gray-500">/{QUESTIONS.length}</span>
            </div>
            <div className="mt-4 text-base text-gray-300 md:text-lg">
              {t(
                `${totalAnswered}개 응답 중 다수결과 ${majorityScore}개 일치`,
                `Matched majority on ${majorityScore} of ${totalAnswered} answers`,
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                ↻ {t("다시 하기", "Try Again")}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                {copied
                  ? t("✓ 복사됐어요", "✓ Copied")
                  : `📋 ${t("결과 공유하기", "Share Result")}`}
              </button>
            </div>
            <AdBottom />
          </div>
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  if (!current) return <main className="min-h-screen bg-bg" />;

  const labels = locale === "ko" ? current.ko : current.en;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← {t("놀자.fun으로 돌아가기", "Back to Nolza.fun")}
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{idx + 1}</span>
            <span className="mx-1">/</span>
            <span>{QUESTIONS.length}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-8 md:px-8">
        <AdTop />
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            <span className="text-accent">{t("밸런스", "Balance")}</span>{" "}
            {t("게임", "Game")}
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "둘 중 하나만 골라야 합니다. 당신의 선택은?",
              "Pick one of the two. What's your choice?",
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-center text-xs text-gray-500">Q{idx + 1}</div>
          <div className="mt-3 text-center text-xl font-bold md:text-2xl">
            {t("VS 밸런스 게임", "VS Balance")}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {(["a", "b"] as const).map((side) => {
              const label = side === "a" ? labels.a : labels.b;
              const emoji = side === "a" ? current.emojiA : current.emojiB;
              const pct = side === "a" ? pctA : pctB;
              const isUserChoice = userChoice === side;
              const showResult = userChoice !== undefined;
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => vote(side)}
                  disabled={showResult}
                  className={`relative flex-1 overflow-hidden rounded-2xl border p-6 text-center transition-all md:p-8 ${
                    isUserChoice
                      ? "border-accent bg-accent/10"
                      : showResult
                      ? "border-border bg-bg opacity-70"
                      : "border-border bg-bg hover:border-accent"
                  }`}
                >
                  {showResult && (
                    <div
                      className={`absolute inset-y-0 left-0 ${
                        isUserChoice ? "bg-accent/20" : "bg-white/5"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative">
                    <div className="text-5xl md:text-6xl">{emoji}</div>
                    <div className="mt-3 text-lg font-bold md:text-xl">{label}</div>
                    {showResult && (
                      <div className="mt-2 text-sm tabular-nums text-gray-300">
                        {pct.toFixed(1)}%
                        {isUserChoice && (
                          <span className="ml-2 text-accent">
                            ← {t("내 선택", "Your pick")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {userChoice && (
            <div className="mt-6 rounded-xl bg-bg p-4 text-center text-sm text-gray-300">
              {(() => {
                const aWin = tally.a >= tally.b;
                const withMajority =
                  (aWin && userChoice === "a") || (!aWin && userChoice === "b");
                const totalText = total.toLocaleString(
                  locale === "ko" ? "ko-KR" : "en-US",
                );
                if (withMajority) {
                  return t(
                    `🎯 다수파입니다 (${totalText}명 중)`,
                    `🎯 You're with the majority (out of ${totalText})`,
                  );
                }
                return t(
                  `🌹 소수파입니다 (${totalText}명 중)`,
                  `🌹 You're with the minority (out of ${totalText})`,
                );
              })()}
            </div>
          )}

          {userChoice && (
            <button
              type="button"
              onClick={next}
              className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90"
            >
              {idx + 1 >= QUESTIONS.length
                ? `${t("결과 보기", "See Results")} →`
                : `${t("다음", "Next")} →`}
            </button>
          )}

          {!userChoice && (
            <button
              type="button"
              onClick={next}
              className="mt-6 w-full rounded-full border border-border bg-bg py-3 text-sm font-medium text-gray-400 hover:border-accent hover:text-accent"
            >
              {t("스킵", "Skip")} →
            </button>
          )}
        </div>

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
