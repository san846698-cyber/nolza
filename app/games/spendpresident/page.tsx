"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

const TOTAL_BUDGET_JO = 638;

type Category = {
  key: string;
  name: string;
  name_en: string;
  emoji: string;
  actual: number;
};

const CATEGORIES: Category[] = [
  { key: "welfare", name: "보건·복지·고용", name_en: "Health, Welfare & Employment", emoji: "🏥", actual: 250 },
  { key: "education", name: "교육", name_en: "Education", emoji: "📚", actual: 100 },
  { key: "general", name: "일반·지방행정", name_en: "General & Local Administration", emoji: "🏛️", actual: 100 },
  { key: "defense", name: "국방", name_en: "Defense", emoji: "🛡️", actual: 60 },
  { key: "rd", name: "R&D", name_en: "R&D", emoji: "🔬", actual: 30 },
  { key: "industry", name: "산업·중소기업", name_en: "Industry & Small Business", emoji: "🏭", actual: 28 },
  { key: "soc", name: "SOC (인프라)", name_en: "SOC (Infrastructure)", emoji: "🏗️", actual: 26 },
  { key: "agri", name: "농림·수산", name_en: "Agriculture & Fisheries", emoji: "🌾", actual: 22 },
  { key: "env", name: "환경", name_en: "Environment", emoji: "🌳", actual: 13 },
  { key: "diplomacy", name: "외교·통일", name_en: "Foreign Affairs & Unification", emoji: "🌏", actual: 9 },
];

function fmt(jo: number, locale: "ko" | "en"): string {
  return locale === "ko"
    ? `${jo.toFixed(0)}조원`
    : `${jo.toFixed(0)} trillion won`;
}

export default function SpendPresident() {
  const { t, locale } = useLocale();
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
      name: locale === "ko" ? c.name : c.name_en,
      v: allocations[c.key],
    }))
      .sort((a, b) => b.v - a.v)[0];
    const text = t(
      `내가 대통령이라면 ${top.name}에 ${fmt(top.v, "ko")}을 쓴다. 638조 중 ${fmt(total, "ko")} 사용 → nolza.fun/games/spendpresident`,
      `If I were president, I'd spend ${fmt(top.v, "en")} on ${top.name}. Used ${fmt(total, "en")} of 638 trillion → nolza.fun/games/spendpresident`,
    );
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
              {t("← 놀자 홈으로", "← Back to nolza home")}
            </Link>
            <div className="text-right">
              <div className="text-xs text-gray-500">{t("남은 예산", "Remaining budget")}</div>
              <div
                className={`text-xl font-black tabular-nums md:text-2xl ${
                  overBudget ? "text-accent" : "text-emerald-400"
                }`}
              >
                {remaining > 0 ? "+" : ""}
                {fmt(remaining, locale)}
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
            {t("대통령 ", "President: ")}
            <span className="text-accent">
              {t("예산 다 써봐", "Spend the Whole Budget")}
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "대한민국 1년 예산 638조원을 어떻게 분배할까요?",
              "How would you allocate Korea's 638-trillion-won annual budget?",
            )}
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
                    <span className="font-medium">
                      {locale === "ko" ? c.name : c.name_en}
                    </span>
                  </div>
                  <span className="text-2xl font-black tabular-nums text-accent">
                    {fmt(v, locale)}
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
                  {t("실제 정부", "Actual government")}: {fmt(c.actual, locale)} ({actualPct.toFixed(1)}%)
                  {v !== c.actual && (
                    <span
                      className={`ml-2 ${v > c.actual ? "text-accent" : "text-sky-400"}`}
                    >
                      ({v > c.actual ? "+" : ""}{(v - c.actual).toFixed(0)}{t("조", " trillion")})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("↻ 초기화", "↻ Reset")}
          </button>
          <button type="button" onClick={setActual} className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("🏛️ 실제 정부 예산으로", "🏛️ Use actual government budget")}
          </button>
          <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
            {copied
              ? t("✓ 복사됐어요", "✓ Copied")
              : t("📋 친구에게 공유하기", "📋 Share with friends")}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
