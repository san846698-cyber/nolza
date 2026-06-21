"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Food = { name: string; name_en: string; emoji: string; kcal: number };

const FOODS: Food[] = [
  { name: "삼각김밥", name_en: "Triangle Kimbap", emoji: "🍙", kcal: 200 },
  { name: "라면", name_en: "Ramyeon", emoji: "🍜", kcal: 500 },
  { name: "치킨 한 마리", name_en: "Whole Fried Chicken", emoji: "🍗", kcal: 2700 },
  { name: "치킨 1조각", name_en: "Fried Chicken (1 pc)", emoji: "🍗", kcal: 270 },
  { name: "삼겹살 1인분", name_en: "Pork Belly (1 serving)", emoji: "🥓", kcal: 700 },
  { name: "비빔밥", name_en: "Bibimbap", emoji: "🍱", kcal: 500 },
  { name: "김밥 한 줄", name_en: "Kimbap (1 roll)", emoji: "🍙", kcal: 450 },
  { name: "떡볶이 1인분", name_en: "Tteokbokki (1 serving)", emoji: "🌶️", kcal: 600 },
  { name: "순대 1인분", name_en: "Sundae (1 serving)", emoji: "🌭", kcal: 350 },
  { name: "튀김 1개", name_en: "Fritter (1 pc)", emoji: "🍤", kcal: 150 },
  { name: "김치찌개", name_en: "Kimchi Stew", emoji: "🍲", kcal: 480 },
  { name: "된장찌개", name_en: "Doenjang Stew", emoji: "🍲", kcal: 350 },
  { name: "갈비탕", name_en: "Galbitang", emoji: "🍜", kcal: 450 },
  { name: "냉면", name_en: "Naengmyeon", emoji: "🍜", kcal: 510 },
  { name: "비빔국수", name_en: "Bibim Guksu", emoji: "🍝", kcal: 470 },
  { name: "햄버거", name_en: "Hamburger", emoji: "🍔", kcal: 550 },
  { name: "피자 1조각", name_en: "Pizza (1 slice)", emoji: "🍕", kcal: 350 },
  { name: "탕수육", name_en: "Sweet & Sour Pork", emoji: "🥡", kcal: 800 },
  { name: "짜장면", name_en: "Jjajangmyeon", emoji: "🍜", kcal: 700 },
  { name: "짬뽕", name_en: "Jjamppong", emoji: "🍜", kcal: 600 },
  { name: "초밥 8개", name_en: "Sushi (8 pc)", emoji: "🍣", kcal: 360 },
  { name: "아메리카노", name_en: "Americano", emoji: "☕", kcal: 5 },
  { name: "라떼", name_en: "Latte", emoji: "☕", kcal: 220 },
  { name: "프라푸치노", name_en: "Frappuccino", emoji: "🥤", kcal: 380 },
  { name: "버블티", name_en: "Bubble Tea", emoji: "🥤", kcal: 320 },
  { name: "콜라 500ml", name_en: "Cola (500ml)", emoji: "🥤", kcal: 210 },
  { name: "맥주 1캔", name_en: "Beer (1 can)", emoji: "🍺", kcal: 150 },
  { name: "소주 1병", name_en: "Soju (1 bottle)", emoji: "🍶", kcal: 540 },
  { name: "막걸리 1병", name_en: "Makgeolli (1 bottle)", emoji: "🥃", kcal: 350 },
  { name: "와인 1잔", name_en: "Wine (1 glass)", emoji: "🍷", kcal: 125 },
  { name: "초코파이", name_en: "Choco Pie", emoji: "🍪", kcal: 170 },
  { name: "도넛", name_en: "Donut", emoji: "🍩", kcal: 250 },
  { name: "케이크 1조각", name_en: "Cake (1 slice)", emoji: "🎂", kcal: 350 },
  { name: "아이스크림", name_en: "Ice Cream", emoji: "🍦", kcal: 220 },
  { name: "초콜릿바", name_en: "Chocolate Bar", emoji: "🍫", kcal: 250 },
  { name: "감자튀김 (M)", name_en: "French Fries (M)", emoji: "🍟", kcal: 380 },
  { name: "샐러드", name_en: "Salad", emoji: "🥗", kcal: 200 },
  { name: "바나나", name_en: "Banana", emoji: "🍌", kcal: 90 },
  { name: "사과", name_en: "Apple", emoji: "🍎", kcal: 80 },
  { name: "삶은 계란", name_en: "Boiled Egg", emoji: "🥚", kcal: 75 },
  { name: "닭가슴살", name_en: "Chicken Breast", emoji: "🍗", kcal: 165 },
  { name: "고구마", name_en: "Sweet Potato", emoji: "🍠", kcal: 110 },
  { name: "쌀밥 1공기", name_en: "Steamed Rice (1 bowl)", emoji: "🍚", kcal: 300 },
  { name: "김치 1접시", name_en: "Kimchi (1 plate)", emoji: "🥬", kcal: 30 },
  { name: "곱창 1인분", name_en: "Gopchang (1 serving)", emoji: "🥩", kcal: 750 },
  { name: "막국수", name_en: "Makguksu", emoji: "🍜", kcal: 550 },
  { name: "수박 1조각", name_en: "Watermelon (1 slice)", emoji: "🍉", kcal: 50 },
  { name: "팥빙수", name_en: "Patbingsu", emoji: "🍧", kcal: 600 },
  { name: "마라탕", name_en: "Malatang", emoji: "🥘", kcal: 800 },
  { name: "토스트", name_en: "Toast", emoji: "🍞", kcal: 250 },
];

const KCAL_PER_KM = 50;
const WALK_KMH = 5;
const DAILY_RECOMMENDED = 2000;

export default function CaloriesGame() {
  const { t, locale } = useLocale();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const numLocale = locale === "ko" ? "ko-KR" : "en-US";

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
    const text = t(
      `오늘 ${total.toLocaleString("ko-KR")}kcal 먹었다 🍗 (걸어서 ${walkKm.toFixed(1)}km 소모) → nolza.fun/games/calories`,
      `I ate ${total.toLocaleString("en-US")} kcal today 🍗 (that's a ${walkKm.toFixed(1)}km walk to burn off) → nolza.fun/games/calories`,
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
        <div className="mx-auto max-w-5xl px-5 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              {t("← 놀자 홈으로", "← Back to nolza")}
            </Link>
            <div className="text-right">
              <div className="text-xs text-gray-500">{t("총 칼로리", "Total calories")}</div>
              <div className="text-2xl font-black tabular-nums text-accent md:text-3xl">
                {total.toLocaleString(numLocale)}
                <span className="ml-1 text-sm text-gray-500">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("오늘 먹은 거 ", "Today's ")}
            <span className="text-accent">{t("칼로리", "Calories")}</span>
            {t("", " I Ate")}
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              `먹은 음식을 클릭해서 더하세요. ${FOODS.length}가지 한국 음식 데이터.`,
              `Tap what you ate to add it up. ${FOODS.length} Korean food items.`,
            )}
          </p>
        </header>

        {total > 0 && (
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
              <div className="text-xs text-accent">{t("소모하려면 걷기 🚶", "Walk to burn it off 🚶")}</div>
              <div className="mt-2 text-2xl font-black tabular-nums">
                {walkKm.toFixed(1)}km
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {t(`약 ${walkHours.toFixed(1)}시간 (5km/h)`, `About ${walkHours.toFixed(1)} hrs (5km/h)`)}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs text-gray-500">{t("며칠치 식사 🍱", "Days of meals 🍱")}</div>
              <div className="mt-2 text-2xl font-black tabular-nums">
                {t(`${daysOfMeals.toFixed(1)}일치`, `${daysOfMeals.toFixed(1)} days`)}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {t("일일 권장 2,000kcal 기준", "Based on 2,000 kcal/day")}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs text-gray-500">{t("치킨 환산 🍗", "In fried chicken 🍗")}</div>
              <div className="mt-2 text-2xl font-black tabular-nums">
                {t(`${(total / 2700).toFixed(2)}마리`, `${(total / 2700).toFixed(2)} birds`)}
              </div>
              <div className="mt-1 text-xs text-gray-400">{t("치킨 1마리 ≈ 2,700kcal", "1 whole chicken ≈ 2,700 kcal")}</div>
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
                  {t(f.name, f.name_en)}
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
            {t("↻ 초기화", "↻ Reset")}
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={total === 0}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-30"
          >
            {copied
              ? t("✓ 복사됐어요", "✓ Copied")
              : t("📋 친구에게 공유하기", "📋 Share with friends")}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent"
          >
            {t("← 놀자 홈으로", "← Back to nolza")}
          </Link>
        </div>
      </div>
    </main>
  );
}
