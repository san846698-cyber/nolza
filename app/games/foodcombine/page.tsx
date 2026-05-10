"use client";

/**
 * Supabase 스키마 (실서비스 시):
 *   CREATE TABLE foodcombine_votes (
 *     id BIGSERIAL PRIMARY KEY,
 *     combo_id INT NOT NULL,
 *     choice TEXT NOT NULL CHECK (choice IN ('tried','never','no_thanks')),
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 * 현재는 localStorage 시드 + 즉시 반영입니다.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Combo = { id: number; name: string; emoji: string };
type Choice = "tried" | "never" | "no_thanks";
type Tally = { tried: number; never: number; no_thanks: number };

const COMBOS: Combo[] = [
  { id: 1, name: "라면 + 밥", emoji: "🍜🍚" },
  { id: 2, name: "치킨 + 콜라", emoji: "🍗🥤" },
  { id: 3, name: "삼겹살 + 소주", emoji: "🥓🍶" },
  { id: 4, name: "떡볶이 + 순대", emoji: "🌶️🌭" },
  { id: 5, name: "짜장면 + 짬뽕 (짬짜면)", emoji: "🍜🍝" },
  { id: 6, name: "맥주 + 치킨 (치맥)", emoji: "🍻🍗" },
  { id: 7, name: "김밥 + 라면", emoji: "🍙🍜" },
  { id: 8, name: "피자 + 김치", emoji: "🍕🥬" },
  { id: 9, name: "수박 + 소금", emoji: "🍉🧂" },
  { id: 10, name: "비빔밥 + 짜파게티", emoji: "🍱🍜" },
  { id: 11, name: "삼겹살 + 냉면", emoji: "🥓🍜" },
  { id: 12, name: "민트초코 + 아메리카노", emoji: "🍫☕" },
  { id: 13, name: "햄버거 + 김치", emoji: "🍔🥬" },
  { id: 14, name: "초밥 + 김치찌개", emoji: "🍣🍲" },
  { id: 15, name: "떡볶이 + 우유", emoji: "🌶️🥛" },
  { id: 16, name: "탕수육 + 부먹/찍먹", emoji: "🥡🥢" },
  { id: 17, name: "라면 + 떡", emoji: "🍜🍡" },
  { id: 18, name: "삼겹살 + 파인애플", emoji: "🥓🍍" },
  { id: 19, name: "막걸리 + 파전", emoji: "🍶🥞" },
  { id: 20, name: "찌개 + 누룽지", emoji: "🍲🍘" },
];

const VOTES_KEY = "nolza-foodcombine-votes";
const CHOICES_KEY = "nolza-foodcombine-choices";

function loadVotes(): Record<number, Tally> {
  try {
    const saved = localStorage.getItem(VOTES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const seed: Record<number, Tally> = {};
  for (const c of COMBOS) {
    seed[c.id] = {
      tried: 30 + Math.floor(Math.random() * 200),
      never: 20 + Math.floor(Math.random() * 100),
      no_thanks: 10 + Math.floor(Math.random() * 80),
    };
  }
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(seed));
  } catch {}
  return seed;
}

function loadChoices(): Record<number, Choice> {
  try {
    const saved = localStorage.getItem(CHOICES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function getStyle(triedRatio: number): string {
  if (triedRatio >= 0.7) return "🌟 모험가형";
  if (triedRatio >= 0.4) return "🍱 평범한 미식가";
  if (triedRatio >= 0.2) return "🥢 보수적인 입맛";
  return "😅 까다로운 분";
}

export default function FoodCombineGame() {
  const [idx, setIdx] = useState(0);
  const [votes, setVotes] = useState<Record<number, Tally>>({});
  const [choices, setChoices] = useState<Record<number, Choice>>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVotes(loadVotes());
    setChoices(loadChoices());
  }, []);

  const current = COMBOS[idx];
  const tally = (current && votes[current.id]) ?? { tried: 0, never: 0, no_thanks: 0 };
  const total = tally.tried + tally.never + tally.no_thanks;
  const userChoice = current ? choices[current.id] : undefined;

  const vote = (c: Choice) => {
    if (!current || userChoice) return;
    const newTally: Tally = { ...tally, [c]: tally[c] + 1 };
    const newVotes = { ...votes, [current.id]: newTally };
    const newChoices = { ...choices, [current.id]: c };
    setVotes(newVotes);
    setChoices(newChoices);
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(newVotes));
      localStorage.setItem(CHOICES_KEY, JSON.stringify(newChoices));
    } catch {}
  };

  const next = () => {
    if (idx + 1 >= COMBOS.length) setDone(true);
    else setIdx((i) => i + 1);
  };

  const restart = () => {
    setIdx(0);
    setDone(false);
  };

  const triedCount = Object.values(choices).filter((c) => c === "tried").length;
  const triedRatio = Object.keys(choices).length > 0
    ? triedCount / Object.keys(choices).length
    : 0;

  const handleShare = async () => {
    const text = `이상한 음식 조합 ${triedCount}/${COMBOS.length}개 먹어봤다 (${getStyle(triedRatio)}) → nolza.fun/games/foodcombine`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (done) {
    return (
      <main className="min-h-screen bg-bg pb-32">
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              ← 놀자.fun으로 돌아가기
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">당신의 식성</div>
            <div className="mt-3 text-5xl font-black md:text-6xl">{getStyle(triedRatio)}</div>
            <div className="mt-4 text-base text-gray-400">
              {COMBOS.length}개 중 <span className="text-accent font-bold">{triedCount}개</span> 먹어봤어요
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ 다시 보기
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!current) return <main className="min-h-screen bg-bg" />;

  const buttons: { key: Choice; label: string; color: string }[] = [
    { key: "tried", label: "✅ 먹어봤다", color: "border-emerald-500/40 hover:border-emerald-500" },
    { key: "never", label: "🤔 안 먹어봤다", color: "border-yellow-400/40 hover:border-yellow-400" },
    { key: "no_thanks", label: "🙅 먹기 싫다", color: "border-accent/40 hover:border-accent" },
  ];

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{idx + 1}</span> / {COMBOS.length}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            이 조합 <span className="text-accent">먹어봤어?</span>
          </h1>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-center">
            <div className="text-7xl">{current.emoji}</div>
            <div className="mt-4 text-2xl font-black md:text-3xl">{current.name}</div>
          </div>

          {!userChoice ? (
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {buttons.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => vote(b.key)}
                  className={`rounded-xl border-2 bg-bg px-4 py-4 text-base font-bold transition-colors ${b.color}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              {buttons.map((b) => {
                const v = tally[b.key];
                const pct = total > 0 ? (v / total) * 100 : 0;
                const isMine = userChoice === b.key;
                return (
                  <div
                    key={b.key}
                    className={`relative overflow-hidden rounded-xl border px-4 py-3 ${
                      isMine ? "border-accent" : "border-border"
                    }`}
                  >
                    <div
                      className={`absolute inset-y-0 left-0 ${isMine ? "bg-accent/20" : "bg-white/5"}`}
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="text-sm font-medium">{b.label}</span>
                      <span className="text-sm tabular-nums text-gray-300">
                        {pct.toFixed(1)}%
                        {isMine && <span className="ml-2 text-accent">← 내 답</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-center text-xs text-gray-500">
                총 {total.toLocaleString("ko-KR")}명 응답
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={next}
            className={`mt-6 w-full rounded-full py-3 text-base font-bold ${
              userChoice
                ? "bg-accent text-white hover:opacity-90"
                : "border border-border bg-bg text-gray-400 hover:border-accent hover:text-accent"
            }`}
          >
            {idx + 1 >= COMBOS.length ? "결과 보기 →" : userChoice ? "다음 →" : "스킵 →"}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
