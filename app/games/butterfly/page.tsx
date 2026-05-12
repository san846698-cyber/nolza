"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Phase = "idle" | "running" | "done";
type Outcome = "shower" | "typhoon" | "snow" | "sunny" | "wild";

const OUTCOMES: { weight: number; outcome: Outcome; ko: string; en: string }[] = [
  { weight: 30, outcome: "shower", ko: "작은 소나기", en: "Light shower" },
  { weight: 30, outcome: "typhoon", ko: "태풍", en: "Typhoon" },
  { weight: 20, outcome: "snow", ko: "갑작스러운 눈", en: "Sudden snowfall" },
  { weight: 10, outcome: "sunny", ko: "맑음 유지", en: "Stays sunny" },
  { weight: 10, outcome: "wild", ko: "예측 불가능한 사건", en: "Unpredictable event" },
];

function pickOutcome(): Outcome {
  const total = OUTCOMES.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const s of OUTCOMES) {
    if (r < s.weight) return s.outcome;
    r -= s.weight;
  }
  return "shower";
}

const TIMELINE = [
  { t: 0, key: "flap" },
  { t: 3, key: "wind" },
  { t: 8, key: "cloud" },
  { t: 15, key: "rain" },
  { t: 25, key: "rainHeavy" },
  { t: 40, key: "lightning" },
  { t: 60, key: "storm" },
  { t: 90, key: "calm" },
  { t: 120, key: "rainbow" },
] as const;

function ButterflySVG({ flapping }: { flapping: boolean }) {
  return (
    <svg viewBox="0 0 120 100" width="180" height="150">
      <g className={flapping ? "butterfly-flap" : ""}>
        <path
          d="M 60 50 Q 30 20 15 35 Q 10 55 30 65 Q 50 60 60 50 Z"
          fill="#a89cf0"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <path
          d="M 60 50 Q 30 70 20 80 Q 30 90 50 75 Q 60 65 60 50 Z"
          fill="#7a6cb8"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <path
          d="M 60 50 Q 90 20 105 35 Q 110 55 90 65 Q 70 60 60 50 Z"
          fill="#a89cf0"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <path
          d="M 60 50 Q 90 70 100 80 Q 90 90 70 75 Q 60 65 60 50 Z"
          fill="#7a6cb8"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <ellipse cx="60" cy="50" rx="2.5" ry="22" fill="#0a0a1a" />
        <line x1="60" y1="30" x2="56" y2="20" stroke="#0a0a1a" strokeWidth="1.5" />
        <line x1="60" y1="30" x2="64" y2="20" stroke="#0a0a1a" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function CloudSVG() {
  return (
    <svg viewBox="0 0 200 100" width="180" height="90">
      <path
        d="M 30 70 Q 10 70 15 50 Q 20 30 50 35 Q 60 15 90 25 Q 120 10 140 35 Q 175 30 175 60 Q 185 75 165 80 L 35 80 Q 20 80 30 70 Z"
        fill="rgba(180, 180, 200, 0.5)"
        stroke="rgba(255, 255, 255, 0.2)"
      />
    </svg>
  );
}

function RainbowSVG() {
  return (
    <svg viewBox="0 0 300 150" width="320" height="160">
      {["#FF3B30", "#FF9500", "#FFD60A", "#34C759", "#007AFF", "#AF52DE"].map((c, i) => (
        <path
          key={c}
          d={`M ${20 + i * 6} 150 Q 150 ${-20 + i * 12} ${280 - i * 6} 150`}
          stroke={c}
          strokeWidth="6"
          fill="none"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

function Snowflakes() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 3,
        size: 4 + Math.random() * 6,
      })),
    [],
  );
  return (
    <>
      {flakes.map((f, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            borderRadius: 9999,
            background: "rgba(255, 255, 255, 0.85)",
            animation: `butterflyRain ${f.duration}s linear infinite`,
            animationDelay: `${f.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function Raindrops({ count }: { count: number }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.7 + Math.random() * 0.5,
        height: 14 + Math.random() * 14,
      })),
    [count],
  );
  return (
    <>
      {drops.map((d, i) => (
        <div
          key={i}
          className="butterfly-raindrop"
          style={{
            left: `${d.left}%`,
            height: d.height,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </>
  );
}

export default function ButterflyGame() {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    if (phase !== "running") return;
    startRef.current = performance.now();
    let raf: number | null = null;
    const tick = () => {
      const t = (performance.now() - startRef.current) / 1000;
      setElapsed(t);
      const next = new Set<string>();
      for (const e of TIMELINE) if (t >= e.t) next.add(e.key);
      setActive(next);
      if (t >= 130) {
        setPhase("done");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [phase]);

  const start = () => {
    setOutcome(pickOutcome());
    setActive(new Set());
    setElapsed(0);
    setPhase("running");
  };

  const reset = () => {
    setPhase("idle");
    setActive(new Set());
    setElapsed(0);
    setOutcome(null);
  };

  const handleShare = async () => {
    if (!outcome) return;
    const o = OUTCOMES.find((x) => x.outcome === outcome)!;
    const text = t(
      `나비 한 마리가 ${elapsed.toFixed(0)}초 만에 ${o.ko}을(를) 만들었다 → nolza.fun/games/butterfly`,
      `One butterfly created ${o.en} in ${elapsed.toFixed(0)}s → nolza.fun/games/butterfly`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Outcome-driven event modifiers
  const showRain = active.has("rain") && outcome !== "snow" && outcome !== "sunny";
  const showSnow = active.has("rain") && outcome === "snow";
  const showStorm = active.has("storm") && (outcome === "typhoon" || outcome === "wild");
  const showLightning = active.has("lightning") && outcome !== "sunny";
  const showRainbow = active.has("rainbow") && (outcome === "shower" || outcome === "sunny");
  const heavy = active.has("rainHeavy") && outcome !== "sunny";

  return (
    <main
      className={`page-in min-h-screen relative overflow-hidden ${showStorm ? "butterfly-storm" : ""}`}
      style={{
        backgroundColor: "#0a0a1a",
        color: "#dde0f0",
        fontFamily: "var(--font-noto-sans-kr)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">
        ←
      </Link>
      {/* Timeline indicator (right side) */}
      {phase !== "idle" && (
        <div
          className="tabular-nums"
          style={{
            position: "fixed",
            right: 20,
            top: 80,
            fontSize: 14,
            color: "#667",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-inter)",
          }}
        >
          {elapsed.toFixed(1)}s
        </div>
      )}

      {/* Visual scene */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(320px, 58svh, 640px)", minHeight: 0 }}
      >
        {/* Lightning flash */}
        {showLightning && <div className="butterfly-lightning" />}

        {/* Wind particles */}
        {active.has("wind") &&
          Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="butterfly-wind"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${20 + (i * 11) % 60}%`,
                width: 30 + (i % 3) * 10,
                height: 1.5,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1.5 + (i % 4) * 0.3}s`,
              }}
            />
          ))}

        {/* Cloud */}
        {active.has("cloud") && (
          <div
            className="fade-in"
            style={{ position: "absolute", top: "8%", left: "10%" }}
          >
            <CloudSVG />
          </div>
        )}
        {(active.has("cloud") && (heavy || showStorm)) && (
          <div
            className="fade-in"
            style={{ position: "absolute", top: "16%", right: "6%" }}
          >
            <CloudSVG />
          </div>
        )}

        {/* Rain */}
        {showRain && <Raindrops count={heavy ? 80 : 30} />}

        {/* Snow */}
        {showSnow && <Snowflakes />}

        {/* Rainbow */}
        {showRainbow && (
          <div
            className="fade-in"
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <RainbowSVG />
          </div>
        )}

        {/* Butterfly center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: phase === "idle" ? "pointer" : "default",
          }}
          onClick={phase === "idle" ? start : undefined}
        >
          <ButterflySVG flapping={phase === "running" && elapsed < 8} />
          {phase === "idle" && (
            <div
              className="text-center fade-in"
              style={{
                marginTop: 24,
                fontSize: 16,
                color: "#aab",
                letterSpacing: "0.15em",
              }}
            >
              {t("날개를 클릭하세요", "Click the wings")}
            </div>
          )}
        </div>
      </div>

      {/* Result + share */}
      {phase === "done" && outcome && (
        <div className="text-center fade-in" style={{ padding: "32px 24px" }}>
          <div
            style={{
              fontSize: 13,
              color: "#667",
              letterSpacing: "0.3em",
            }}
          >
            {t("결과", "RESULT")} · {elapsed.toFixed(0)}s
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 32,
              fontWeight: 600,
              color: "#dde0f0",
            }}
          >
            {locale === "ko"
              ? OUTCOMES.find((x) => x.outcome === outcome)!.ko
              : OUTCOMES.find((x) => x.outcome === outcome)!.en}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-full"
              style={{
                background: "transparent",
                border: "1px solid #334",
                color: "#aab",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
              }}
            >
              ↻ {t("다시", "AGAIN")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full"
              style={{
                background: "#a89cf0",
                color: "#0a0a1a",
                padding: "10px 28px",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.15em",
              }}
            >
              {copied ? "✓ COPIED" : t("공유하기", "SHARE")}
            </button>
          </div>
        </div>
      )}

      {/* Science explanation */}
      <section
        className="mx-auto max-w-2xl"
        style={{ padding: "48px 24px", color: "#aab" }}
      >
        <div
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#9aa",
            fontFamily:
              locale === "ko"
                ? "var(--font-noto-sans-kr)"
                : "var(--font-inter)",
          }}
        >
          {t(
            "1972년 기상학자 에드워드 로렌츠는 \"브라질에서 나비가 날개를 펄럭이면 텍사스에서 토네이도가 일어날 수 있는가?\"라는 질문을 던졌습니다. 이것이 카오스 이론의 시작이었습니다. 작은 변화가 시간이 지나면서 거대하고 예측 불가능한 결과를 만들어내는 비선형 시스템의 특성을 보여주는 사고 실험으로, 기상 예보가 일정 기간 이상 정확할 수 없는 이유이기도 합니다.",
            "In 1972, meteorologist Edward Lorenz asked, \"Does the flap of a butterfly's wings in Brazil set off a tornado in Texas?\" This question sparked chaos theory. It illustrates how small changes in nonlinear systems can produce massive, unpredictable consequences over time, and is precisely why weather forecasts beyond a certain horizon are inherently unreliable.",
          )}
        </div>
      </section>

      <AdMobileSticky />
    </main>
  );
}
