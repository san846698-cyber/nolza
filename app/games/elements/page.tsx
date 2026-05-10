"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const BASE_ELEMENTS = ["김치", "밥", "불", "물"] as const;

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
          const merged = Array.from(new Set([...BASE_ELEMENTS, ...arr]));
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
    if (!confirm("모든 발견을 초기화할까요?")) return;
    setDiscovered([...BASE_ELEMENTS]);
    setSelected(null);
    setLastResult(null);
  };

  const progress = useMemo(
    () => (discovered.length / TOTAL_DISCOVERABLE) * 100,
    [discovered.length],
  );

  const handleShare = async () => {
    const text = `나 놀자.fun에서 한국 원소 ${discovered.length}개 조합 발견했다 (${progress.toFixed(0)}%) → nolza.fun/games/elements`;
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
            ← 놀자.fun으로 돌아가기
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
            한국 <span className="text-accent">원소 조합</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            두 원소를 차례로 클릭해서 조합해보세요. 김치 + 불 = ?
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-gray-500">조합대</div>
            <div className="flex items-center gap-3 text-center">
              <div className="min-w-[100px] rounded-xl border border-border bg-bg px-4 py-3">
                {selected ? (
                  <>
                    <div className="text-3xl">{EMOJI[selected] ?? "❓"}</div>
                    <div className="mt-1 text-sm font-medium">{selected}</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl text-gray-700">＋</div>
                    <div className="mt-1 text-xs text-gray-600">선택하세요</div>
                  </>
                )}
              </div>
              <div className="text-2xl text-accent">＋</div>
              <div className="min-w-[100px] rounded-xl border border-border bg-bg px-4 py-3 opacity-60">
                <div className="text-3xl text-gray-700">？</div>
                <div className="mt-1 text-xs text-gray-600">두번째</div>
              </div>
            </div>
            {selected && (
              <button
                type="button"
                onClick={reset}
                className="text-xs text-gray-500 hover:text-accent"
              >
                선택 취소
              </button>
            )}
          </div>

          {lastResult && (
            <div
              key={lastResult.nonce}
              className="palette-enter mt-5 rounded-xl border border-border bg-bg p-4 text-center"
            >
              <div className="text-xs text-gray-500">최근 시도</div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm md:text-base">
                <span>{EMOJI[lastResult.a]} {lastResult.a}</span>
                <span className="text-gray-500">+</span>
                <span>{EMOJI[lastResult.b]} {lastResult.b}</span>
                <span className="text-gray-500">=</span>
                {lastResult.result ? (
                  <span className={lastResult.isNew ? "font-bold text-accent" : "font-bold text-white"}>
                    {EMOJI[lastResult.result]} {lastResult.result}
                    {lastResult.isNew && <span className="ml-1">✨</span>}
                  </span>
                ) : (
                  <span className="text-gray-500">??? (조합 없음)</span>
                )}
              </div>
            </div>
          )}
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-300">발견한 원소 ({discovered.length})</h2>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-gray-500 hover:text-accent"
            >
              초기화
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
                  {name}
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
