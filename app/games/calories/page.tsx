"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Food = { name: string; emoji: string; kcal: number };

const FOODS: Food[] = [
  { name: "삼각김밥", emoji: "🍙", kcal: 200 },
  { name: "라면", emoji: "🍜", kcal: 500 },
  { name: "치킨 한 마리", emoji: "🍗", kcal: 2700 },
  { name: "치킨 1조각", emoji: "🍗", kcal: 270 },
  { name: "삼겹살 1인분", emoji: "🥓", kcal: 700 },
  { name: "비빔밥", emoji: "🍱", kcal: 500 },
  { name: "김밥 한 줄", emoji: "🍙", kcal: 450 },
  { name: "떡볶이 1인분", emoji: "🌶️", kcal: 600 },
  { name: "순대 1인분", emoji: "🌭", kcal: 350 },
  { name: "튀김 1개", emoji: "🍤", kcal: 150 },
  { name: "김치찌개", emoji: "🍲", kcal: 480 },
  { name: "된장찌개", emoji: "🍲", kcal: 350 },
  { name: "갈비탕", emoji: "🍜", kcal: 450 },
  { name: "냉면", emoji: "🍜", kcal: 510 },
  { name: "비빔국수", emoji: "🍝", kcal: 470 },
  { name: "햄버거", emoji: "🍔", kcal: 550 },
  { name: "피자 1조각", emoji: "🍕", kcal: 350 },
  { name: "탕수육", emoji: "🥡", kcal: 800 },
  { name: "짜장면", emoji: "🍜", kcal: 700 },
  { name: "짬뽕", emoji: "🍜", kcal: 600 },
  { name: "초밥 8개", emoji: "🍣", kcal: 360 },
  { name: "아메리카노", emoji: "☕", kcal: 5 },
  { name: "라떼", emoji: "☕", kcal: 220 },
  { name: "프라푸치노", emoji: "🥤", kcal: 380 },
  { name: "버블티", emoji: "🥤", kcal: 320 },
  { name: "콜라 500ml", emoji: "🥤", kcal: 210 },
  { name: "맥주 1캔", emoji: "🍺", kcal: 150 },
  { name: "소주 1병", emoji: "🍶", kcal: 540 },
  { name: "막걸리 1병", emoji: "🥃", kcal: 350 },
  { name: "와인 1잔", emoji: "🍷", kcal: 125 },
  { name: "초코파이", emoji: "🍪", kcal: 170 },
  { name: "도넛", emoji: "🍩", kcal: 250 },
  { name: "케이크 1조각", emoji: "🎂", kcal: 350 },
  { name: "아이스크림", emoji: "🍦", kcal: 220 },
  { name: "초콜릿바", emoji: "🍫", kcal: 250 },
  { name: "감자튀김 (M)", emoji: "🍟", kcal: 380 },
  { name: "샐러드", emoji: "🥗", kcal: 200 },
  { name: "바나나", emoji: "🍌", kcal: 90 },
  { name: "사과", emoji: "🍎", kcal: 80 },
  { name: "삶은 계란", emoji: "🥚", kcal: 75 },
  { name: "닭가슴살", emoji: "🍗", kcal: 165 },
  { name: "고구마", emoji: "🍠", kcal: 110 },
  { name: "쌀밥 1공기", emoji: "🍚", kcal: 300 },
  { name: "김치 1접시", emoji: "🥬", kcal: 30 },
  { name: "곱창 1인분", emoji: "🥩", kcal: 750 },
  { name: "막국수", emoji: "🍜", kcal: 550 },
  { name: "수박 1조각", emoji: "🍉", kcal: 50 },
  { name: "팥빙수", emoji: "🍧", kcal: 600 },
  { name: "마라탕", emoji: "🥘", kcal: 800 },
  { name: "토스트", emoji: "🍞", kcal: 250 },
];

const KCAL_PER_KM = 50;
const WALK_KMH = 5;
const DAILY_RECOMMENDED = 2000;

export default function CaloriesGame() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const total = useMemo(
    () => FOODS.reduce((s, f) => s + (counts[f.name] ?? 0) * f.kcal, 0),
    [counts],
  );

  const walkKm = total / KCAL_PER_KM;
  const walkHours = walkKm / WALK_KMH;
  const daysOfMeals = total / DAILY_RECOMMENDED;

  const inc = (name: string) =>
    setCounts((c) => ({ ...c, [name]: (c[name] ?? 0) + 1 }));
  const dec = (name: string) =>
    setCounts((c) => {
      const v = (c[name] ?? 0) - 1;
      const next = { ...c };
      if (v <= 0) delete next[name];
      else next[name] = v;
      return next;
    });

  const reset = () => setCounts({});

  const handleShare = async () => {
    const text = `오늘 ${total.toLocaleString("ko-KR")}kcal 먹었다 🍗 (걸어서 ${walkKm.toFixed(1)}km 소모) → nolza.fun/games/calories`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-5 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              ← 놀자.fun으로 돌아가기
            </Link>
            <div className="text-right">
              <div className="text-xs text-gray-500">총 칼로리</div>
              <div className="text-2xl font-black tabular-nums text-accent md:text-3xl">
                {total.toLocaleString("ko-KR")}
                <span className="ml-1 text-sm text-gray-500">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            오늘 먹은 거 <span className="text-accent">칼로리</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            먹은 음식을 클릭해서 더하세요. {FOODS.length}가지 한국 음식 데이터.
          </p>
        </header>

        {total > 0 && (
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
              <div className="text-xs text-accent">소모하려면 걷기 🚶</div>
              <div className="mt-2 text-2xl font-black tabular-nums">
                {walkKm.toFixed(1)}km
              </div>
              <div className="mt-1 text-xs text-gray-400">
                약 {walkHours.toFixed(1)}시간 (5km/h)
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs text-gray-500">며칠치 식사 🍱</div>
              <div className="mt-2 text-2xl font-black tabular-nums">
                {daysOfMeals.toFixed(1)}일치
              </div>
              <div className="mt-1 text-xs text-gray-400">
                일일 권장 2,000kcal 기준
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs text-gray-500">치킨 환산 🍗</div>
              <div className="mt-2 text-2xl font-black tabular-nums">
                {(total / 2700).toFixed(2)}마리
              </div>
              <div className="mt-1 text-xs text-gray-400">치킨 1마리 ≈ 2,700kcal</div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {FOODS.map((f) => {
            const count = counts[f.name] ?? 0;
            return (
              <div
                key={f.name}
                className={`rounded-xl border p-3 text-center transition-colors ${
                  count > 0
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card"
                }`}
              >
                <div className="text-3xl">{f.emoji}</div>
                <div className="mt-1 truncate text-xs font-medium md:text-sm">
                  {f.name}
                </div>
                <div className="mt-1 text-xs text-gray-500">{f.kcal}kcal</div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => dec(f.name)}
                    disabled={count === 0}
                    className="h-7 w-7 rounded-md border border-border bg-bg text-sm font-bold disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="min-w-[20px] text-sm font-bold tabular-nums">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => inc(f.name)}
                    className="h-7 w-7 rounded-md bg-accent text-sm font-bold text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            disabled={total === 0}
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent disabled:opacity-30"
          >
            ↻ 초기화
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={total === 0}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-30"
          >
            {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent"
          >
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
