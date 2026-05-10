"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Gen = "X세대" | "밀레니얼" | "Z세대" | "알파세대";

type Item = { q: string; for: Gen[] };

const ITEMS: Item[] = [
  { q: "삐삐 써봤다", for: ["X세대", "밀레니얼"] },
  { q: "공중전화 써봤다", for: ["X세대", "밀레니얼"] },
  { q: "MP3 플레이어 갖고 있었다", for: ["밀레니얼"] },
  { q: "싸이월드 미니홈피 했다", for: ["밀레니얼"] },
  { q: "다마고치 키워봤다", for: ["X세대", "밀레니얼"] },
  { q: "플로피 디스크 본 적 있다", for: ["X세대"] },
  { q: "카카오톡 없던 시절을 기억한다", for: ["X세대", "밀레니얼"] },
  { q: "아이폰 처음 나왔을 때 기억한다", for: ["X세대", "밀레니얼"] },
  { q: "유튜브가 한국에서 막 시작될 때를 기억한다", for: ["밀레니얼"] },
  { q: "중·고등학생 때 카카오톡으로 친구들과 채팅했다", for: ["Z세대"] },
  { q: "초등학생 때 인스타그램 했다", for: ["Z세대", "알파세대"] },
  { q: "줌(Zoom)으로 수업 들어봤다", for: ["Z세대", "알파세대"] },
  { q: "코로나19 때 학년이었다", for: ["Z세대", "알파세대"] },
  { q: "스마트폰 없던 시기를 기억한다", for: ["X세대", "밀레니얼"] },
  { q: "워크맨/CDP 사용해봤다", for: ["X세대", "밀레니얼"] },
  { q: "DDR(펌프) 게임장 갔었다", for: ["X세대", "밀레니얼"] },
  { q: "어렸을 때부터 유튜브 키즈 봤다", for: ["알파세대"] },
  { q: "버디버디·네이트온 메신저 썼다", for: ["X세대", "밀레니얼"] },
];

const GEN_INFO: Record<Gen, { range: string; emoji: string; desc: string }> = {
  X세대: {
    range: "1965~1980",
    emoji: "📼",
    desc: "오렌지족·압구정 문화. 서태지가 등장했을 때 학생이었어요.",
  },
  밀레니얼: {
    range: "1981~1995",
    emoji: "🎮",
    desc: "PC통신 → 인터넷 보급기. 카카오톡 등장이 충격이었던 세대.",
  },
  Z세대: {
    range: "1996~2012",
    emoji: "📱",
    desc: "디지털 네이티브. 인스타·틱톡 짧은 영상에 익숙해요.",
  },
  알파세대: {
    range: "2013~",
    emoji: "🐣",
    desc: "AI·태블릿과 함께 자라는 첫 세대.",
  },
};

export default function WhatGenerationGame() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!done) return null;
    const counts: Record<Gen, number> = { X세대: 0, 밀레니얼: 0, Z세대: 0, 알파세대: 0 };
    ITEMS.forEach((item, i) => {
      if (answers[i]) {
        for (const g of item.for) counts[g]++;
      }
    });
    const max = Math.max(...Object.values(counts));
    if (max === 0) return { gen: "알파세대" as Gen, counts };
    const winner = (Object.entries(counts) as [Gen, number][])
      .filter(([, v]) => v === max)
      .map(([g]) => g)[0];
    return { gen: winner, counts };
  }, [answers, done]);

  const set = (i: number, v: boolean) => {
    setAnswers((a) => ({ ...a, [i]: v }));
  };

  const reset = () => {
    setAnswers({});
    setDone(false);
  };

  const total = Object.keys(answers).length;

  const handleShare = async () => {
    if (!result) return;
    const text = `세대 공감 테스트 결과: 나는 ${result.gen}로 판명됨 ${GEN_INFO[result.gen].emoji} → nolza.fun/games/whatgeneration`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          {!done && (
            <div className="text-xs text-gray-500">
              <span className="font-medium text-white">{total}</span> / {ITEMS.length}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            세대별 <span className="text-accent">공감 테스트</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            해봤다 / 못해봤다 빠르게 골라보세요. 마지막에 세대를 판명해드려요.
          </p>
        </header>

        {!result && (
          <>
            <div className="space-y-2">
              {ITEMS.map((item, i) => {
                const v = answers[i];
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm md:text-base">{item.q}</span>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => set(i, true)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                            v === true
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "border border-border text-gray-400 hover:text-emerald-300"
                          }`}
                        >
                          ✓ 해봤다
                        </button>
                        <button
                          type="button"
                          onClick={() => set(i, false)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                            v === false
                              ? "bg-accent/20 text-accent"
                              : "border border-border text-gray-400 hover:text-accent"
                          }`}
                        >
                          ✗ 못해봤다
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
              disabled={total < ITEMS.length}
              className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90 disabled:opacity-30"
            >
              결과 보기 → ({total}/{ITEMS.length})
            </button>
          </>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
              <div className="text-7xl md:text-8xl">{GEN_INFO[result.gen].emoji}</div>
              <div className="mt-4 text-xs text-accent">
                {GEN_INFO[result.gen].range}
              </div>
              <div className="mt-1 text-4xl font-black md:text-6xl">{result.gen}</div>
              <p className="mt-4 text-base text-gray-300 md:text-lg">
                {GEN_INFO[result.gen].desc}
              </p>
            </div>
            <section className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="text-xs text-gray-500">세대별 점수</div>
              <ul className="mt-3 space-y-2">
                {(Object.entries(result.counts) as [Gen, number][]).map(([g, v]) => (
                  <li key={g} className="flex items-baseline justify-between rounded-lg bg-bg px-4 py-2">
                    <span className="text-sm">{g}</span>
                    <span className="text-base font-bold tabular-nums text-accent">{v}점</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={reset} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ 다시 하기
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </>
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
