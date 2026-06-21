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
import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Combo = { id: number; name: string; name_en: string; emoji: string };
type Choice = "tried" | "never" | "no_thanks";
type Tally = { tried: number; never: number; no_thanks: number };

const COMBOS: Combo[] = [
  { id: 1, name: "라면 + 밥", name_en: "Ramyeon + rice", emoji: "🍜🍚" },
  { id: 2, name: "치킨 + 콜라", name_en: "Fried chicken + cola", emoji: "🍗🥤" },
  { id: 3, name: "삼겹살 + 소주", name_en: "Pork belly + soju", emoji: "🥓🍶" },
  { id: 4, name: "떡볶이 + 순대", name_en: "Tteokbokki + sundae", emoji: "🌶️🌭" },
  { id: 5, name: "짜장면 + 짬뽕 (짬짜면)", name_en: "Jjajangmyeon + jjamppong (jjamjjamyeon)", emoji: "🍜🍝" },
  { id: 6, name: "맥주 + 치킨 (치맥)", name_en: "Beer + fried chicken (chimaek)", emoji: "🍻🍗" },
  { id: 7, name: "김밥 + 라면", name_en: "Gimbap + ramyeon", emoji: "🍙🍜" },
  { id: 8, name: "피자 + 김치", name_en: "Pizza + kimchi", emoji: "🍕🥬" },
  { id: 9, name: "수박 + 소금", name_en: "Watermelon + salt", emoji: "🍉🧂" },
  { id: 10, name: "비빔밥 + 짜파게티", name_en: "Bibimbap + Chapagetti", emoji: "🍱🍜" },
  { id: 11, name: "삼겹살 + 냉면", name_en: "Pork belly + naengmyeon", emoji: "🥓🍜" },
  { id: 12, name: "민트초코 + 아메리카노", name_en: "Mint choco + americano", emoji: "🍫☕" },
  { id: 13, name: "햄버거 + 김치", name_en: "Burger + kimchi", emoji: "🍔🥬" },
  { id: 14, name: "초밥 + 김치찌개", name_en: "Sushi + kimchi stew", emoji: "🍣🍲" },
  { id: 15, name: "떡볶이 + 우유", name_en: "Tteokbokki + milk", emoji: "🌶️🥛" },
  { id: 16, name: "탕수육 + 부먹/찍먹", name_en: "Sweet & sour pork: sauce-poured or dipped", emoji: "🥡🥢" },
  { id: 17, name: "라면 + 떡", name_en: "Ramyeon + rice cakes", emoji: "🍜🍡" },
  { id: 18, name: "삼겹살 + 파인애플", name_en: "Pork belly + pineapple", emoji: "🥓🍍" },
  { id: 19, name: "막걸리 + 파전", name_en: "Makgeolli + pajeon", emoji: "🍶🥞" },
  { id: 20, name: "찌개 + 누룽지", name_en: "Stew + scorched-rice crust", emoji: "🍲🍘" },
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

function getStyle(triedRatio: number, t: (ko: string, en: string) => string): string {
  if (triedRatio >= 0.7) return t("🌟 모험가형", "🌟 The Adventurer");
  if (triedRatio >= 0.4) return t("🍱 평범한 미식가", "🍱 The Everyday Foodie");
  if (triedRatio >= 0.2) return t("🥢 보수적인 입맛", "🥢 The Conservative Palate");
  return t("😅 까다로운 분", "😅 The Picky Eater");
}

export default function FoodCombineGame() {
  const { t, locale } = useLocale();
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
  const triedRatio = COMBOS.length > 0 ? triedCount / COMBOS.length : 0;

  const handleShare = async () => {
    const text = t(
      `이상한 음식 조합 ${triedCount}/${COMBOS.length}개 먹어봤다 (${getStyle(triedRatio, t)}) → nolza.fun/games/foodcombine`,
      `I've tried ${triedCount}/${COMBOS.length} weird food combos (${getStyle(triedRatio, t)}) → nolza.fun/games/foodcombine`,
    );
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
              {t("← 놀자 홈으로", "← Back to nolza home")}
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">{t("당신의 식성", "Your taste type")}</div>
            <div className="mt-3 text-5xl font-black md:text-6xl">{getStyle(triedRatio, t)}</div>
            <div className="mt-4 text-base text-gray-400">
              {locale === "ko" ? (
                <>
                  {COMBOS.length}개 중 <span className="text-accent font-bold">{triedCount}개</span> 먹어봤어요
                </>
              ) : (
                <>
                  You&apos;ve tried <span className="text-accent font-bold">{triedCount}</span> of {COMBOS.length}
                </>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                {t("↻ 다시 보기", "↻ Start over")}
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? t("✓ 복사됐어요", "✓ COPIED") : t("📋 친구에게 공유하기", "📋 Share with friends")}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!current) return <main className="min-h-screen bg-bg" />;

  const buttons: { key: Choice; label: string; color: string }[] = [
    { key: "tried", label: t("✅ 먹어봤다", "✅ Tried it"), color: "border-emerald-500/40 hover:border-emerald-500" },
    { key: "never", label: t("🤔 안 먹어봤다", "🤔 Never tried"), color: "border-yellow-400/40 hover:border-yellow-400" },
    { key: "no_thanks", label: t("🙅 먹기 싫다", "🙅 No thanks"), color: "border-accent/40 hover:border-accent" },
  ];

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{idx + 1}</span> / {COMBOS.length}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {locale === "ko" ? (
              <>
                이 조합 <span className="text-accent">먹어봤어?</span>
              </>
            ) : (
              <>
                Have you <span className="text-accent">tried this combo?</span>
              </>
            )}
          </h1>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-center">
            <div className="text-7xl">{current.emoji}</div>
            <div className="mt-4 text-2xl font-black md:text-3xl">{t(current.name, current.name_en)}</div>
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
                        {isMine && <span className="ml-2 text-accent">{t("← 내 답", "← My answer")}</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-center text-xs text-gray-500">
                {locale === "ko"
                  ? `총 ${total.toLocaleString("ko-KR")}명 응답`
                  : `${total.toLocaleString("en-US")} responses`}
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
            {idx + 1 >= COMBOS.length
              ? t("결과 보기 →", "See results →")
              : userChoice
                ? t("다음 →", "Next →")
                : t("스킵 →", "Skip →")}
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
