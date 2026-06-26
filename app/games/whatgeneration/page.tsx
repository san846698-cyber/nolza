"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Gen = "X세대" | "밀레니얼" | "Z세대" | "알파세대";

type Item = { q: string; q_en: string; for: Gen[] };

const ITEMS: Item[] = [
  { q: "삐삐 써봤다", q_en: "I've used a pager", for: ["X세대", "밀레니얼"] },
  { q: "공중전화 써봤다", q_en: "I've used a payphone", for: ["X세대", "밀레니얼"] },
  { q: "MP3 플레이어 갖고 있었다", q_en: "I owned an MP3 player", for: ["밀레니얼"] },
  { q: "싸이월드 미니홈피 했다", q_en: "I had a Cyworld minihompy", for: ["밀레니얼"] },
  { q: "다마고치 키워봤다", q_en: "I raised a Tamagotchi", for: ["X세대", "밀레니얼"] },
  { q: "플로피 디스크 본 적 있다", q_en: "I've seen a floppy disk", for: ["X세대"] },
  { q: "카카오톡 없던 시절을 기억한다", q_en: "I remember the days before KakaoTalk", for: ["X세대", "밀레니얼"] },
  { q: "아이폰 처음 나왔을 때 기억한다", q_en: "I remember when the iPhone first came out", for: ["X세대", "밀레니얼"] },
  { q: "유튜브가 한국에서 막 시작될 때를 기억한다", q_en: "I remember when YouTube was just launching in Korea", for: ["밀레니얼"] },
  { q: "중·고등학생 때 카카오톡으로 친구들과 채팅했다", q_en: "I chatted with friends on KakaoTalk in middle/high school", for: ["Z세대"] },
  { q: "초등학생 때 인스타그램 했다", q_en: "I was on Instagram in elementary school", for: ["Z세대", "알파세대"] },
  { q: "줌(Zoom)으로 수업 들어봤다", q_en: "I've taken classes over Zoom", for: ["Z세대", "알파세대"] },
  { q: "코로나19 때 학년이었다", q_en: "I was in school during COVID-19", for: ["Z세대", "알파세대"] },
  { q: "스마트폰 없던 시기를 기억한다", q_en: "I remember a time without smartphones", for: ["X세대", "밀레니얼"] },
  { q: "워크맨/CDP 사용해봤다", q_en: "I've used a Walkman or CD player", for: ["X세대", "밀레니얼"] },
  { q: "DDR(펌프) 게임장 갔었다", q_en: "I went to arcades for DDR (Pump It Up)", for: ["X세대", "밀레니얼"] },
  { q: "어렸을 때부터 유튜브 키즈 봤다", q_en: "I watched YouTube Kids from a young age", for: ["알파세대"] },
  { q: "버디버디·네이트온 메신저 썼다", q_en: "I used BuddyBuddy or NateOn messenger", for: ["X세대", "밀레니얼"] },
];

const GEN_LABEL: Record<Gen, { ko: string; en: string }> = {
  X세대: { ko: "X세대", en: "Gen X" },
  밀레니얼: { ko: "밀레니얼", en: "Millennial" },
  Z세대: { ko: "Z세대", en: "Gen Z" },
  알파세대: { ko: "알파세대", en: "Gen Alpha" },
};

const GEN_INFO: Record<Gen, { range: string; emoji: string; desc: string; desc_en: string }> = {
  X세대: {
    range: "1965~1980",
    emoji: "📼",
    desc: "오렌지족·압구정 문화. 서태지가 등장했을 때 학생이었어요.",
    desc_en: "The Orange Tribe and Apgujeong scene. You were a student when Seo Taiji burst onto the stage.",
  },
  밀레니얼: {
    range: "1981~1995",
    emoji: "🎮",
    desc: "PC통신 → 인터넷 보급기. 카카오톡 등장이 충격이었던 세대.",
    desc_en: "From dial-up PC networks to the spread of the internet. The generation floored by KakaoTalk's debut.",
  },
  Z세대: {
    range: "1996~2012",
    emoji: "📱",
    desc: "디지털 네이티브. 인스타·틱톡 짧은 영상에 익숙해요.",
    desc_en: "Digital natives, right at home with Instagram and TikTok short videos.",
  },
  알파세대: {
    range: "2013~",
    emoji: "🐣",
    desc: "AI·태블릿과 함께 자라는 첫 세대.",
    desc_en: "The first generation growing up alongside AI and tablets.",
  },
};

export default function WhatGenerationGame() {
  const { t, locale } = useLocale();
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
    const genLabel = locale === "ko" ? GEN_LABEL[result.gen].ko : GEN_LABEL[result.gen].en;
    const text = t(
      `세대 공감 테스트 결과: 나는 ${genLabel}로 판명됨 ${GEN_INFO[result.gen].emoji} → nolza.fun/games/whatgeneration`,
      `Generation vibe check result: I'm a ${genLabel} ${GEN_INFO[result.gen].emoji} → nolza.fun/games/whatgeneration`,
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
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← nolza 홈으로", "← Back to nolza home")}
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
            {t("세대별 ", "Generation ")}<span className="text-accent">{t("공감 테스트", "vibe check")}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "해봤다 / 못해봤다 빠르게 골라보세요. 마지막에 세대를 판명해드려요.",
              "Quickly tap Done it / Never for each one. We'll reveal your generation at the end.",
            )}
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
                      <span className="text-sm md:text-base">{t(item.q, item.q_en)}</span>
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
                          {t("✓ 해봤다", "✓ Done it")}
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
                          {t("✗ 못해봤다", "✗ Never")}
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
              {t("결과 보기 →", "See result →")} ({total}/{ITEMS.length})
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
              <div className="mt-1 text-4xl font-black md:text-6xl">
                {t(GEN_LABEL[result.gen].ko, GEN_LABEL[result.gen].en)}
              </div>
              <p className="mt-4 text-base text-gray-300 md:text-lg">
                {t(GEN_INFO[result.gen].desc, GEN_INFO[result.gen].desc_en)}
              </p>
            </div>
            <section className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="text-xs text-gray-500">{t("세대별 점수", "Score by generation")}</div>
              <ul className="mt-3 space-y-2">
                {(Object.entries(result.counts) as [Gen, number][]).map(([g, v]) => (
                  <li key={g} className="flex items-baseline justify-between rounded-lg bg-bg px-4 py-2">
                    <span className="text-sm">{t(GEN_LABEL[g].ko, GEN_LABEL[g].en)}</span>
                    <span className="text-base font-bold tabular-nums text-accent">{t(`${v}점`, `${v} pts`)}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={reset} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                {t("↻ 다시 하기", "↻ Try again")}
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? t("✓ 복사됐어요", "✓ Copied") : t("📋 친구에게 공유하기", "📋 Share with friends")}
              </button>
            </div>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← nolza 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
