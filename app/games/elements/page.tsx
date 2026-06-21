"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

const BASE_ELEMENTS = ["김치", "밥", "불", "물"] as const;

// English display names for every element. The Korean string stays the
// canonical internal key (used in EMOJI, RECIPES and localStorage); this
// map only controls what an English-locale user sees on screen.
const NAME_EN: Record<string, string> = {
  김치: "Kimchi", 밥: "Rice", 불: "Fire", 물: "Water",
  묵은지: "Aged Kimchi", 떡: "Rice Cake", 닭: "Chicken", 김: "Seaweed",
  김치볶음밥: "Kimchi Fried Rice", 김치찌개: "Kimchi Stew", 김치국: "Kimchi Soup", 누룽지: "Scorched Rice",
  죽: "Porridge", 증기: "Steam",
  김치찜: "Braised Kimchi", 부대찌개: "Army Stew", 집밥: "Home Cooking", 묵은지찌개: "Aged Kimchi Stew",
  숭늉: "Scorched Rice Tea", 면: "Noodles", 찐빵: "Steamed Bun", 떡볶이: "Tteokbokki",
  라면: "Ramyeon", 비빔면: "Spicy Mixed Noodles", 회: "Sashimi", 김밥: "Gimbap",
  치킨: "Fried Chicken", 맥주: "Beer", 소주: "Soju", 김치죽: "Kimchi Porridge",
  김치라면: "Kimchi Ramyeon", 떡라면: "Rice Cake Ramyeon", 초밥: "Sushi", 안주: "Bar Snack",
  치맥: "Chicken & Beer", 술: "Booze", 폭탄주: "Boilermaker", 생맥: "Draft Beer",
  회식: "Company Dinner", 야식: "Late-Night Snack", 직장인: "Office Worker", 친구: "Friend",
  모임: "Gathering", 파티: "Party", 노래방: "Karaoke", 가족: "Family",
  사랑: "Love", 행복: "Happiness", 한국인: "Korean",
  부장님: "Boss", 갓생: "God-Tier Life", 한국: "Korea", 한강: "Han River",
  서울: "Seoul", 강남: "Gangnam", "K-POP": "K-POP", 한류: "Korean Wave",
  매운맛: "Spicy Flavor", 한국혼: "Korean Spirit", 한식: "Korean Food", 한정식: "Korean Course Meal",
  한국정서: "Korean Sentiment",
  비: "Rain", 파전: "Scallion Pancake", 막걸리: "Makgeolli", 한강라면: "Han River Ramyeon",
};

// Localized element name for display. Falls back to the Korean key if no
// English name is registered.
function elementName(name: string, locale: "ko" | "en"): string {
  if (locale === "ko") return name;
  return NAME_EN[name] ?? name;
}

const EMOJI: Record<string, string> = {
  김치: "🌶️", 밥: "🍚", 불: "🔥", 물: "💧",
  묵은지: "🥬", 떡: "🍡", 닭: "🐔", 김: "🌿",
  김치볶음밥: "🍳", 김치찌개: "🍲", 김치국: "🥣", 누룽지: "🍘",
  죽: "🥣", 증기: "☁️",
  김치찜: "🥘", 부대찌개: "🍳", 집밥: "🏠", 묵은지찌개: "🍲",
  숭늉: "🍵", 면: "🍝", 찐빵: "🥟", 떡볶이: "🌶️",
  라면: "🍜", 비빔면: "🍝", 회: "🐟", 김밥: "🍙",
  치킨: "🍗", 맥주: "🍺", 소주: "🍶", 김치죽: "🥣",
  김치라면: "🍜", 떡라면: "🍜", 초밥: "🍣", 안주: "🍢",
  치맥: "🍻", 술: "🥃", 폭탄주: "💣", 생맥: "🍺",
  회식: "🎉", 야식: "🌙", 직장인: "🧑‍💼", 친구: "🧑‍🤝‍🧑",
  모임: "🎊", 파티: "🎉", 노래방: "🎤", 가족: "👪",
  사랑: "❤️", 행복: "🌈", 한국인: "🇰🇷",
  부장님: "🤵", 갓생: "✨", 한국: "🇰🇷", 한강: "🌉",
  서울: "🏙️", 강남: "💎", "K-POP": "🎵", 한류: "🌏",
  매운맛: "🥵", 한국혼: "❤️‍🔥", 한식: "🍱", 한정식: "🍽️",
  한국정서: "🍃",
  비: "🌧️", 파전: "🥞", 막걸리: "🍶", 한강라면: "🍜",
};

const RECIPES: Record<string, string> = {
  "김치|김치": "묵은지", "밥|밥": "떡", "불|불": "닭", "물|물": "김",
  "김치|밥": "김치볶음밥", "김치|불": "김치찌개", "김치|물": "김치국",
  "밥|불": "누룽지", "밥|물": "죽", "불|물": "증기",

  "김치|김치찌개": "김치찜",
  "김치찌개|김치찌개": "부대찌개",
  "김치찌개|밥": "집밥",
  "김치찌개|묵은지": "묵은지찌개",
  "누룽지|물": "숭늉",
  "떡|떡": "면",
  "떡|증기": "찐빵",
  "김치찌개|떡": "떡볶이",
  "면|불": "라면",
  "김치|면": "비빔면",
  "김|김": "회",
  "김|밥": "김밥",
  "닭|불": "치킨",
  "물|증기": "맥주",
  "물|불": "소주",
  "김치|죽": "김치죽",

  "김치|라면": "김치라면",
  "라면|떡": "떡라면",
  "밥|회": "초밥",
  "김치|치킨": "안주",
  "맥주|치킨": "치맥",
  "맥주|소주": "술",
  "소주|소주": "폭탄주",
  "맥주|맥주": "생맥",
  "술|안주": "회식",
  "밥|술": "야식",
  "회식|회식": "직장인",
  "치맥|치맥": "친구",
  "친구|친구": "모임",
  "모임|술": "파티",
  "파티|회식": "노래방",
  "집밥|집밥": "가족",
  "가족|친구": "사랑",
  "사랑|치맥": "행복",
  "김치|행복": "한국인",

  "술|직장인": "부장님",
  "직장인|행복": "갓생",
  "한국인|한국인": "한국",
  "물|한국": "한강",
  "한강|한국": "서울",
  "서울|서울": "강남",
  "노래방|한국": "K-POP",
  "K-POP|한국": "한류",
  "김치|떡볶이": "매운맛",
  "매운맛|한국인": "한국혼",
  "묵은지|집밥": "한식",
  "한식|한식": "한정식",
  "한국|한식": "한국정서",

  "증기|증기": "비",
  "김|비": "파전",
  "술|파전": "막걸리",
  "라면|한강": "한강라면",
};

const STORAGE_KEY = "nolza-elements-discovered";
const TOTAL_DISCOVERABLE = Object.keys(EMOJI).length;

function recipeKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

export default function ElementsGame() {
  const { t, locale } = useLocale();
  const [discovered, setDiscovered] = useState<string[]>([...BASE_ELEMENTS]);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    a: string;
    b: string;
    result: string | null;
    isNew: boolean;
    nonce: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          // Only merge saved names that still exist in the EMOJI map. This
          // keeps stale or invalid entries from inflating progress past 100%.
          const valid = arr.filter(
            (name) => typeof name === "string" && name in EMOJI,
          );
          const merged = Array.from(new Set([...BASE_ELEMENTS, ...valid]));
          setDiscovered(merged);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discovered));
    } catch {}
  }, [discovered]);

  const onClickElement = (name: string) => {
    if (selected === null) {
      setSelected(name);
      return;
    }
    const key = recipeKey(selected, name);
    const result = RECIPES[key] ?? null;
    const isNew = result !== null && !discovered.includes(result);
    setLastResult({
      a: selected,
      b: name,
      result,
      isNew,
      nonce: Date.now(),
    });
    if (result && isNew) {
      setDiscovered((d) => [...d, result]);
    }
    setSelected(null);
  };

  const reset = () => setSelected(null);

  const resetAll = () => {
    if (!confirm(t("모든 발견을 초기화할까요?", "Reset all discoveries?"))) return;
    setDiscovered([...BASE_ELEMENTS]);
    setSelected(null);
    setLastResult(null);
  };

  const progress = useMemo(
    () => (discovered.length / TOTAL_DISCOVERABLE) * 100,
    [discovered.length],
  );

  const handleShare = async () => {
    const text = t(
      `나 놀자.fun에서 한국 원소 ${discovered.length}개 조합 발견했다 (${progress.toFixed(0)}%) → nolza.fun/games/elements`,
      `I discovered ${discovered.length} Korean element combos on nolza.fun (${progress.toFixed(0)}%) → nolza.fun/games/elements`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{discovered.length}</span>
            <span className="mx-1">/</span>
            <span>{TOTAL_DISCOVERABLE}</span>
            <span className="ml-2 text-gray-600">({progress.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("한국 ", "Korean ")}
            <span className="text-accent">
              {t("원소 조합", "Element Crafting")}
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "두 원소를 차례로 클릭해서 조합해보세요. 김치 + 불 = ?",
              "Tap two elements one after another to combine them. Kimchi + Fire = ?",
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-gray-500">{t("조합대", "Crafting bench")}</div>
            <div className="flex items-center gap-3 text-center">
              <div className="min-w-[100px] rounded-xl border border-border bg-bg px-4 py-3">
                {selected ? (
                  <>
                    <div className="text-3xl">{EMOJI[selected] ?? "❓"}</div>
                    <div className="mt-1 text-sm font-medium">
                      {elementName(selected, locale)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl text-gray-700">＋</div>
                    <div className="mt-1 text-xs text-gray-600">
                      {t("선택하세요", "Pick one")}
                    </div>
                  </>
                )}
              </div>
              <div className="text-2xl text-accent">＋</div>
              <div className="min-w-[100px] rounded-xl border border-border bg-bg px-4 py-3 opacity-60">
                <div className="text-3xl text-gray-700">？</div>
                <div className="mt-1 text-xs text-gray-600">
                  {t("두번째", "Second")}
                </div>
              </div>
            </div>
            {selected && (
              <button
                type="button"
                onClick={reset}
                className="text-xs text-gray-500 hover:text-accent"
              >
                {t("선택 취소", "Cancel selection")}
              </button>
            )}
          </div>

          {lastResult && (
            <div
              key={lastResult.nonce}
              className="palette-enter mt-5 rounded-xl border border-border bg-bg p-4 text-center"
            >
              <div className="text-xs text-gray-500">{t("최근 시도", "Last attempt")}</div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm md:text-base">
                <span>{EMOJI[lastResult.a]} {elementName(lastResult.a, locale)}</span>
                <span className="text-gray-500">+</span>
                <span>{EMOJI[lastResult.b]} {elementName(lastResult.b, locale)}</span>
                <span className="text-gray-500">=</span>
                {lastResult.result ? (
                  <span className={lastResult.isNew ? "font-bold text-accent" : "font-bold text-white"}>
                    {EMOJI[lastResult.result]} {elementName(lastResult.result, locale)}
                    {lastResult.isNew && <span className="ml-1">✨</span>}
                  </span>
                ) : (
                  <span className="text-gray-500">{t("??? (조합 없음)", "??? (no combo)")}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-300">
              {t("발견한 원소", "Discovered elements")} ({discovered.length})
            </h2>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-gray-500 hover:text-accent"
            >
              {t("초기화", "Reset")}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {discovered.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onClickElement(name)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  selected === name
                    ? "border-accent bg-accent/10 scale-105"
                    : "border-border bg-card hover:border-accent"
                }`}
              >
                <div className="text-2xl md:text-3xl">{EMOJI[name] ?? "❓"}</div>
                <div className="mt-1 truncate text-xs font-medium md:text-sm">
                  {elementName(name, locale)}
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
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
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
