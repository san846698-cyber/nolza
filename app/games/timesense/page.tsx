"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

const ROUNDS = [3, 7, 15, 30, 60];
const STORAGE_KEY = "nolza-timesense-best";

type Phase = "ready" | "running" | "result" | "done";
type RoundResult = { target: number; actual: number; acc: number };
type T = (ko: string, en: string) => string;

function roundAccuracy(target: number, actual: number): number {
  const error = Math.abs(actual - target);
  const ratio = error / target;
  return Math.max(0, 100 - ratio * 100);
}

function roundMessage(target: number, actual: number, t: T): string {
  const diff = actual - target;
  const ratio = Math.abs(diff) / target;
  if (ratio < 0.05) return t("거의 완벽해요", "Nearly perfect");
  if (diff < 0 && ratio > 0.15) return t("너무 빨리 누름", "Pressed too early");
  if (diff > 0 && ratio > 0.2) return t("딴 생각 하셨죠? 🤔", "Daydreaming? 🤔");
  if (diff < 0) return t("조금 빨랐어요", "A bit early");
  return t("조금 늦었어요", "A bit late");
}

function totalTier(avg: number, t: T): { title: string; desc: string; tone: string } {
  if (avg >= 90) {
    return {
      title: t("시간을 지배하는 자", "Master of time"),
      desc: t("초 단위 감각이 거의 스톱워치입니다. 이 정도면 눈 감고도 꽤 정확해요.", "Your seconds are nearly stopwatch-level. Even with eyes closed, you are very precise."),
      tone: "#FFD60A",
    };
  }
  if (avg >= 75) {
    return {
      title: t("인간 스톱워치", "Human stopwatch"),
      desc: t("크게 흔들리지 않는 안정적인 시간 감각입니다. 집중하면 더 무서워질 타입이에요.", "A steady internal clock. With focus, this gets dangerous."),
      tone: "#00FF88",
    };
  }
  if (avg >= 60) {
    return {
      title: t("감각은 꽤 좋은 편", "Pretty good time sense"),
      desc: t("완벽하진 않아도 흐름은 잘 잡습니다. 중간중간 한 박자만 다듬으면 좋아요.", "Not perfect, but you catch the flow. A little tuning would help."),
      tone: "#9BE15D",
    };
  }
  if (avg >= 45) {
    return {
      title: t("시간과 살짝 어긋난 사람", "Slightly out of sync"),
      desc: t("몸속 시계가 아주 살짝 늦거나 빨랐습니다. 감은 있는데 리듬이 흔들렸어요.", "Your inner clock ran a little early or late. The sense is there, but the rhythm wobbled."),
      tone: "#FFD60A",
    };
  }
  if (avg >= 30) {
    return {
      title: t("시계가 필요한 타입", "Needs a clock"),
      desc: t("시간 감각이 살짝 흔들렸어요. 44% 근처라면 칭찬보다 리듬 재정비가 먼저입니다.", "Your time sense wobbled. Around 44%, this needs rhythm tuning before praise."),
      tone: "#FF9F0A",
    };
  }
  return {
    title: t("시간 감각이 산책 나감", "Time sense went for a walk"),
    desc: t("몸속 시계가 잠깐 외출했습니다. 다시 하면 의외로 금방 돌아올 수 있어요.", "Your internal clock stepped out for a moment. A retry may bring it back quickly."),
    tone: "#FF453A",
  };
}

export default function TimeSenseGame() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [best, setBest] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const v = parseFloat(saved);
        if (!isNaN(v)) setBest(v);
      }
    } catch {}
  }, []);

  const target = ROUNDS[round];

  const start = () => {
    startRef.current = performance.now();
    setPhase("running");
  };

  const stop = () => {
    if (phase !== "running") return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const acc = roundAccuracy(target, elapsed);
    setResults((prev) => [...prev, { target, actual: elapsed, acc }]);
    setPhase("result");
  };

  const advance = () => {
    if (round + 1 >= ROUNDS.length) {
      setPhase("done");
    } else {
      setRound((r) => r + 1);
      setPhase("ready");
    }
  };

  const restart = () => {
    setRound(0);
    setResults([]);
    setPhase("ready");
  };

  const overall = useMemo(
    () =>
      results.length > 0
        ? results.reduce((s, r) => s + r.acc, 0) / results.length
        : 0,
    [results],
  );

  // Save best on done
  useEffect(() => {
    if (phase === "done" && results.length === ROUNDS.length) {
      const avg =
        results.reduce((s, r) => s + r.acc, 0) / results.length;
      if (best === null || avg > best) {
        setBest(avg);
        try { localStorage.setItem(STORAGE_KEY, String(avg)); } catch {}
      }
    }
  }, [phase, results, best]);

  const handleShare = async () => {
    const tier = totalTier(overall, t);
    const text = t(
      `내 시간 감각 정확도 ${overall.toFixed(1)}%, 결과는 "${tier.title}" → nolza.fun/games/timesense`,
      `My time sense accuracy: ${overall.toFixed(1)}%. Result: "${tier.title}" → nolza.fun/games/timesense`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  /* ── RUNNING: completely dark ── */
  if (phase === "running") {
    return (
      <div
        onPointerDown={stop}
        className="page-in"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000000",
          cursor: "pointer",
          touchAction: "manipulation",
          zIndex: 100,
        }}
      >
        <div className="flex min-h-screen items-center justify-center">
          <span
            style={{
              fontSize: 13,
              color: "#222",
              letterSpacing: "0.4em",
              fontFamily: "var(--font-inter)",
            }}
          >
            {t("완전히 어두워집니다 · 멈추기는 화면 누름", "COMPLETE DARKNESS · TAP TO STOP")}
          </span>
        </div>
      </div>
    );
  }

  /* ── RESULT (per round) ── */
  if (phase === "result") {
    const r = results[results.length - 1];
    const accColor =
      r.acc >= 90 ? "#00FF88" : r.acc >= 70 ? "#FFD60A" : "#FF9F0A";
    return (
      <main
        className="page-in min-h-screen"
        style={{
          backgroundColor: "#0a0a0a",
          color: "#fff",
          fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        }}
      >
        <Link href="/" className="back-arrow dark" aria-label="home">←</Link>
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <div className="text-center fade-in">
            <div style={{ fontSize: 13, color: "#666", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {t("라운드", "Round")} {round + 1} · {t("목표 시간", "Target")} {r.target}s
            </div>
            <div
              className="tabular-nums"
              style={{
                marginTop: 16,
                fontSize: 96,
                fontWeight: 200,
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {r.actual.toFixed(2)}
              <span style={{ fontSize: 32, color: "#666", fontWeight: 300 }}>s</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 16, color: "#999" }}>
              {t("정확도", "Accuracy")}{" "}
              <span style={{ color: accColor, fontWeight: 600 }}>
                {r.acc.toFixed(1)}%
              </span>
            </div>
            <div style={{ marginTop: 24, fontSize: 16, color: "#aaa" }}>
              {roundMessage(r.target, r.actual, t)}
            </div>
            <button
              type="button"
              onClick={advance}
              className="mt-12 rounded-full"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                padding: "12px 32px",
                fontSize: 14,
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              {round + 1 >= ROUNDS.length ? t("결과 보기", "RESULTS") : t("다음 라운드", "NEXT ROUND")} ▸
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── DONE ── */
  if (phase === "done") {
    const tier = totalTier(overall, t);
    return (
      <main
        className="page-in min-h-screen"
        style={{
          backgroundColor: "#0a0a0a",
          color: "#fff",
          fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        }}
      >
        <Link href="/" className="back-arrow dark" aria-label="home">←</Link>
        <div className="mx-auto max-w-md px-6" style={{ paddingTop: 100, paddingBottom: 80 }}>
          <div className="text-center">
            <div style={{ fontSize: 13, color: "#666", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {t("최종 정확도", "Final Accuracy")}
            </div>
            <div
              className="tabular-nums"
              style={{
                marginTop: 24,
                fontSize: 96,
                fontWeight: 200,
                color: tier.tone,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {overall.toFixed(0)}
              <span style={{ fontSize: 36, color: "#444", fontWeight: 300 }}>%</span>
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: "clamp(23px, 6vw, 34px)",
                fontWeight: 800,
                color: tier.tone,
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
              }}
            >
              {tier.title}
            </div>
            <div
              style={{
                margin: "12px auto 0",
                maxWidth: 360,
                fontSize: 15,
                color: "#aaa",
                lineHeight: 1.65,
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
              }}
            >
              {tier.desc}
            </div>
          </div>

          <ul style={{ marginTop: 56 }}>
            {results.map((r, i) => {
              const c = r.acc >= 90 ? "#00FF88" : r.acc >= 70 ? "#FFD60A" : "#FF9F0A";
              return (
                <li
                  key={i}
                  className="flex items-baseline justify-between"
                  style={{
                    paddingTop: 14,
                    paddingBottom: 14,
                    borderBottom: "1px solid #1a1a1a",
                  }}
                >
                  <span style={{ fontSize: 15, color: "#999" }}>
                    {t("라운드", "Round")} {i + 1} · {r.target}s
                  </span>
                  <span className="tabular-nums" style={{ fontSize: 16 }}>
                    <span style={{ color: "#fff", fontWeight: 600 }}>
                      {r.actual.toFixed(2)}s
                    </span>
                    <span style={{ marginLeft: 12, color: c, fontWeight: 600 }}>
                      {r.acc.toFixed(0)}%
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          {best !== null && (
            <div
              className="mt-6 text-center"
              style={{ fontSize: 13, color: "#666", letterSpacing: "0.1em" }}
            >
              {t("최고", "BEST")} · <span style={{ color: "#999" }}>{best.toFixed(1)}%</span>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={restart}
              className="rounded-full"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#aaa",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              ↻ {t("다시", "AGAIN")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full"
              style={{
                background: "#fff",
                color: "#0a0a0a",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {copied ? "✓ COPIED" : t("공유하기", "SHARE")}
            </button>
          </div>
          <AdBottom />
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  /* ── READY ── */
  return (
    <main
      className="page-in min-h-screen"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fff",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">←</Link>
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-center">
          <div style={{ fontSize: 13, color: "#666", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            {t("라운드", "Round")} {round + 1} / {ROUNDS.length}
          </div>
          <div
            className="tabular-nums"
            style={{
              marginTop: 24,
              fontSize: 144,
              fontWeight: 200,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {target}
            <span style={{ fontSize: 56, color: "#444", marginLeft: 8, fontWeight: 300 }}>
              s
            </span>
          </div>
          <p
            className="max-w-sm mx-auto"
            style={{ marginTop: 28, fontSize: 16, color: "#999", lineHeight: 1.6 }}
          >
            {t(
              "정확히 이 시간을 느껴보세요.",
              "Try to feel this exact duration.",
            )}
            <br />
            {t(
              "START 누르면 화면이 꺼져요. 시간이 됐다 싶을 때 화면을 누르세요.",
              "Tap START — the screen goes dark. Tap again when you think time's up.",
            )}
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-12 rounded-full"
            style={{
              background: "#fff",
              color: "#0a0a0a",
              padding: "14px 40px",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.25em",
              cursor: "pointer",
            }}
          >
            {t("시작", "START")} ▸
          </button>

          <div className="mt-10 flex justify-center gap-1.5">
            {ROUNDS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 9999,
                  background: i < round ? "#666" : i === round ? "#fff" : "#222",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <AdMobileSticky />
    </main>
  );
}
