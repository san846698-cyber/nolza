"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Note = {
  id: number;
  time: number;
  hit: boolean | null;
  rating: "PERFECT" | "GOOD" | "MISS" | null;
};

const DURATION = 30;
const TRAVEL_TIME = 1.6;
const PERFECT_MS = 100;
const GOOD_MS = 250;
const PERFECT_SCORE = 100;
const GOOD_SCORE = 50;

function generateBeats(): Note[] {
  const arr: Note[] = [];
  let id = 0;
  let t = 1.0;
  while (t < DURATION) {
    arr.push({ id: id++, time: t, hit: null, rating: null });
    t += 0.55 + Math.random() * 0.35;
  }
  return arr;
}

function getTier(score: number, max: number): { ko: string; en: string; tone: string } {
  const r = score / max;
  if (r >= 0.95) return { ko: "탑 아이돌급 🌟", en: "TOP IDOL 🌟", tone: "text-pink-300" };
  if (r >= 0.8) return { ko: "데뷔 가능 ⭐", en: "READY TO DEBUT ⭐", tone: "text-yellow-300" };
  if (r >= 0.6) return { ko: "연습생급 💃", en: "TRAINEE 💃", tone: "text-emerald-400" };
  if (r >= 0.4) return { ko: "춤 좀 추네 🕺", en: "GOT MOVES 🕺", tone: "text-sky-400" };
  return { ko: "조금만 더! 🎵", en: "KEEP TRYING 🎵", tone: "text-orange-400" };
}

export default function KpopDanceGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [latestRating, setLatestRating] = useState<{ rating: string; key: number } | null>(null);
  const [lang, setLang] = useState<"en" | "ko">("en");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(0);
  const startRef = useRef<number>(0);
  const notesRef = useRef<Note[]>([]);
  const rafRef = useRef<number | null>(null);

  const totalNotes = notesRef.current.length;
  const maxScore = totalNotes * PERFECT_SCORE;

  const start = () => {
    const fresh = generateBeats();
    notesRef.current = fresh;
    setNotes(fresh);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLatestRating(null);
    setPhase("playing");
    startRef.current = performance.now();

    const tick = () => {
      const t = (performance.now() - startRef.current) / 1000;
      setNow(t);

      // mark missed notes
      for (const n of notesRef.current) {
        if (n.hit === null && t - n.time > GOOD_MS / 1000) {
          n.hit = false;
          n.rating = "MISS";
          setCombo(0);
        }
      }

      if (t >= DURATION + TRAVEL_TIME) {
        setPhase("done");
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const tap = () => {
    if (phase !== "playing") return;
    const t = (performance.now() - startRef.current) / 1000;
    let target: Note | null = null;
    let bestDiff = Infinity;
    for (const n of notesRef.current) {
      if (n.hit !== null) continue;
      const diff = Math.abs(n.time - t);
      if (diff < bestDiff) {
        target = n;
        bestDiff = diff;
      }
    }
    if (!target || bestDiff * 1000 > GOOD_MS) {
      setCombo(0);
      setLatestRating({ rating: "MISS", key: Date.now() });
      return;
    }
    const isPerfect = bestDiff * 1000 < PERFECT_MS;
    target.hit = true;
    target.rating = isPerfect ? "PERFECT" : "GOOD";
    setScore((s) => s + (isPerfect ? PERFECT_SCORE : GOOD_SCORE));
    setCombo((c) => {
      const next = c + 1;
      setMaxCombo((m) => Math.max(m, next));
      return next;
    });
    setLatestRating({ rating: isPerfect ? "PERFECT" : "GOOD", key: Date.now() });
  };

  const reset = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setNow(0);
    setNotes([]);
    notesRef.current = [];
  };

  const tier = phase === "done" ? getTier(score, maxScore) : null;

  const handleShare = async () => {
    if (!tier) return;
    const text =
      lang === "en"
        ? `K-Pop Dance Challenge: ${score}/${maxScore} (${tier.en}) → nolza.fun/games/kpop-dance`
        : `K팝 댄스 ${score}/${maxScore}점 (${tier.ko}) → nolza.fun/games/kpop-dance`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const t = (en: string, ko: string) => (lang === "en" ? en : ko);

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border" style={{ backgroundColor: "rgba(255, 111, 181, 0.04)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <button
            type="button"
            onClick={() => setLang((l) => (l === "en" ? "ko" : "en"))}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-pink-300"
          >
            {lang === "en" ? "🌐 한국어" : "🌐 EN"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("K-Pop Dance ", "K팝 댄스 ")}
            <span style={{ color: "#FF6FB5" }}>{t("Challenge", "챌린지")}</span> 💃
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "Tap (or press SPACE) when notes hit the line. 30 seconds.",
              "노트가 라인에 닿을 때 탭(또는 스페이스). 30초.",
            )}
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-xs text-gray-500">SCORE</div>
            <div className="mt-1 text-2xl font-black tabular-nums" style={{ color: "#FF6FB5" }}>
              {score}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-xs text-gray-500">COMBO</div>
            <div className="mt-1 text-2xl font-black tabular-nums">{combo}x</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-xs text-gray-500">{t("TIME", "시간")}</div>
            <div className="mt-1 text-2xl font-black tabular-nums">
              {phase === "playing" ? Math.max(0, DURATION - now).toFixed(1) : DURATION.toFixed(0)}s
            </div>
          </div>
        </div>

        <div className="relative mt-5 h-[400px] overflow-hidden rounded-2xl border border-border bg-card">
          {phase === "playing" &&
            notes.map((n) => {
              if (n.hit !== null && n.rating === "MISS") return null;
              const noteTime = n.time;
              const startVisible = noteTime - TRAVEL_TIME;
              if (now < startVisible) return null;
              const progress = (now - startVisible) / TRAVEL_TIME;
              if (progress > 1.05) return null;
              const top = `${progress * 100}%`;
              if (n.hit === true) return null;
              return (
                <div
                  key={n.id}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    top,
                    width: 60,
                    height: 60,
                    backgroundColor: "#FF6FB5",
                    boxShadow: "0 0 20px rgba(255, 111, 181, 0.6)",
                  }}
                />
              );
            })}

          <div
            className="absolute left-0 right-0 border-y-2"
            style={{ top: "calc(100% - 32px)", height: 4, borderColor: "#FF6FB5" }}
          />

          {latestRating && (
            <div
              key={latestRating.key}
              className="palette-enter absolute left-1/2 top-1/3 -translate-x-1/2 text-3xl font-black"
              style={{
                color:
                  latestRating.rating === "PERFECT"
                    ? "#FFD60A"
                    : latestRating.rating === "GOOD"
                    ? "#34C759"
                    : "#FF3B30",
              }}
            >
              {latestRating.rating}
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={start}
                className="rounded-full px-8 py-4 text-lg font-bold text-white hover:opacity-90"
                style={{ backgroundColor: "#FF6FB5" }}
              >
                ▶ {t("START", "시작")}
              </button>
            </div>
          )}

          {phase === "done" && tier && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <div className="text-xs" style={{ color: "#FF6FB5" }}>
                  {t("FINAL SCORE", "최종 점수")}
                </div>
                <div className="mt-2 text-5xl font-black tabular-nums">
                  {score}<span className="text-2xl text-gray-500">/{maxScore}</span>
                </div>
                <div className={`mt-3 text-2xl font-bold ${tier.tone}`}>
                  {t(tier.en, tier.ko)}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Max Combo: {maxCombo}
                </div>
              </div>
            </div>
          )}
        </div>

        {phase === "playing" && (
          <button
            type="button"
            onClick={tap}
            onTouchStart={(e) => {
              e.preventDefault();
              tap();
            }}
            className="mt-5 w-full rounded-2xl py-8 text-2xl font-black text-white hover:opacity-90"
            style={{ backgroundColor: "#FF6FB5" }}
          >
            {t("TAP", "탭")} ✨
          </button>
        )}

        {phase === "done" && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-pink-300"
            >
              ↻ {t("Try Again", "다시 도전")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              style={{ backgroundColor: "#FF6FB5" }}
            >
              {copied ? "✓" : "📋"} {t("Share", "공유")}
            </button>
          </div>
        )}

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
