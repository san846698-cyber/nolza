"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const TOTAL_BUDGET_JO = 638;

type Category = {
  key: string;
  name: string;
  emoji: string;
  actual: number;
};

const CATEGORIES: Category[] = [
  { key: "welfare", name: "보건·복지·고용", emoji: "🏥", actual: 250 },
  { key: "education", name: "교육", emoji: "📚", actual: 100 },
  { key: "general", name: "일반·지방행정", emoji: "🏛️", actual: 100 },
  { key: "defense", name: "국방", emoji: "🛡️", actual: 60 },
  { key: "rd", name: "R&D", emoji: "🔬", actual: 30 },
  { key: "industry", name: "산업·중소기업", emoji: "🏭", actual: 28 },
  { key: "soc", name: "SOC (인프라)", emoji: "🏗️", actual: 26 },
  { key: "agri", name: "농림·수산", emoji: "🌾", actual: 22 },
  { key: "env", name: "환경", emoji: "🌳", actual: 13 },
  { key: "diplomacy", name: "외교·통일", emoji: "🌏", actual: 9 },
];

function fmt(jo: number): string {
  return `${jo.toFixed(0)}조원`;
}

export default function SpendPresident() {
  const [allocations, setAllocations] = useState<Record<string, number>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.key, 0])),
  );
  const [copied, setCopied] = useState(false);

  const total = useMemo(
    () => Object.values(allocations).reduce((s, v) => s + v, 0),
    [allocations],
  );
  const remaining = TOTAL_BUDGET_JO - total;
  const overBudget = remaining < 0;

  const setAlloc = (key: string, v: number) => {
    setAllocations((a) => ({ ...a, [key]: Math.max(0, v) }));
  };

  const reset = () => {
    setAllocations(Object.fromEntries(CATEGORIES.map((c) => [c.key, 0])));
  };

  const setActual = () => {
    setAllocations(Object.fromEntries(CATEGORIES.map((c) => [c.key, c.actual])));
  };

  const handleShare = async () => {
    const top = CATEGORIES.map((c) => ({
      name: c.name,
      v: allocations[c.key],
    }))
      .sort((a, b) => b.v - a.v)[0];
    const text = `내가 대통령이라면 ${top.name}에 ${fmt(top.v)}을 쓴다. 638조 중 ${fmt(total)} 사용 → nolza.fun/games/spendpresident`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-5 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              ← 놀자.fun으로 돌아가기
            </Link>
            <div className="text-right">
              <div className="text-xs text-gray-500">남은 예산</div>
              <div
                className={`text-xl font-black tabular-nums md:text-2xl ${
                  overBudget ? "text-accent" : "text-emerald-400"
                }`}
              >
                {remaining > 0 ? "+" : ""}
                {fmt(remaining)}
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-card">
            <div
              className={`h-full transition-[width] ${
                overBudget ? "bg-accent" : "bg-emerald-400"
              }`}
              style={{ width: `${Math.min(100, (total / TOTAL_BUDGET_JO) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            대통령 <span className="text-accent">예산 다 써봐</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            대한민국 1년 예산 638조원을 어떻게 분배할까요?
          </p>
        </header>

        <section className="flex flex-col gap-3">
          {CATEGORIES.map((c) => {
            const v = allocations[c.key];
            const actualPct = (c.actual / TOTAL_BUDGET_JO) * 100;
            return (
              <div key={c.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <span className="text-2xl font-black tabular-nums text-accent">
                    {fmt(v)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={400}
                  step={1}
                  value={v}
                  onChange={(e) => setAlloc(c.key, Number(e.target.value))}
                  className="mt-3 w-full accent-[#FF3B30]"
                />
                <div className="mt-2 text-xs text-gray-500">
                  실제 정부: {fmt(c.actual)} ({actualPct.toFixed(1)}%)
                  {v !== c.actual && (
                    <span
                      className={`ml-2 ${v > c.actual ? "text-accent" : "text-sky-400"}`}
                    >
                      ({v > c.actual ? "+" : ""}{(v - c.actual).toFixed(0)}조)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ↻ 초기화
          </button>
          <button type="button" onClick={setActual} className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            🏛️ 실제 정부 예산으로
          </button>
          <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
            {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
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
