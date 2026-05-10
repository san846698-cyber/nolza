"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

const GRID = 10;
const TOTAL = GRID * GRID;
const SCATTER_PER_CLICK = 3;

type Dot = {
  id: number;
  ox: number; // ordered position 0-1
  oy: number;
  x: number;
  y: number;
  scattered: number; // 0 = ordered, increases each scatter
};

function makeInitialDots(): Dot[] {
  return Array.from({ length: TOTAL }, (_, i) => {
    const col = i % GRID;
    const row = Math.floor(i / GRID);
    const ox = (col + 0.5) / GRID;
    const oy = (row + 0.5) / GRID;
    return { id: i, ox, oy, x: ox, y: oy, scattered: 0 };
  });
}

export default function EntropyGame() {
  const { locale, t } = useLocale();
  const [dots, setDots] = useState<Dot[]>(() => makeInitialDots());
  const [resists, setResists] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    let raf: number | null = null;
    const tick = () => {
      if (done) return;
      setElapsed((performance.now() - startRef.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [done]);

  // Average scattered (chaos meter 0-1)
  const chaos = useMemo(() => {
    if (dots.length === 0) return 0;
    const total = dots.reduce(
      (s, d) => s + Math.min(1, Math.hypot(d.x - d.ox, d.y - d.oy) / 0.6),
      0,
    );
    return total / dots.length;
  }, [dots]);

  const click = (dot: Dot) => {
    if (done) return;
    setResists((r) => r + 1);
    setDots((prev) => {
      // Reset clicked dot
      const next = prev.map((d) =>
        d.id === dot.id ? { ...d, x: d.ox, y: d.oy, scattered: 0 } : d,
      );
      // Scatter 3 random other dots
      for (let i = 0; i < SCATTER_PER_CLICK; i++) {
        const idx = Math.floor(Math.random() * next.length);
        const d = next[idx];
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.05 + Math.random() * 0.18;
        const nx = Math.max(0.02, Math.min(0.98, d.x + Math.cos(angle) * dist));
        const ny = Math.max(0.02, Math.min(0.98, d.y + Math.sin(angle) * dist));
        next[idx] = { ...d, x: nx, y: ny, scattered: d.scattered + 1 };
      }
      return next;
    });
  };

  const surrender = () => {
    setDone(true);
  };

  const restart = () => {
    setDots(makeInitialDots());
    setResists(0);
    setElapsed(0);
    setDone(false);
    startRef.current = performance.now();
  };

  const handleShare = async () => {
    const text = t(
      `나 우주에 ${elapsed.toFixed(0)}초 저항했다 (졌다) → nolza.fun/games/entropy`,
      `I resisted the universe for ${elapsed.toFixed(0)}s (lost) → nolza.fun/games/entropy`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Background darkens with chaos
  const bgL = Math.max(0, 0.06 - chaos * 0.06);
  const bgColor = `rgb(${Math.floor(bgL * 255)}, ${Math.floor(bgL * 255)}, ${Math.floor(bgL * 255)})`;

  return (
    <main
      className="page-in min-h-screen"
      style={{
        backgroundColor: bgColor,
        color: "#aaa",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        transition: "background-color 0.4s",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">
        ←
      </Link>
      <div className="mx-auto max-w-3xl px-6 pt-20">
        {/* Counters */}
        <div
          className="flex justify-between tabular-nums"
          style={{ fontSize: 14, color: "#666", letterSpacing: "0.15em" }}
        >
          <span style={{ textTransform: "uppercase" }}>{t("저항", "Resisted")} · {resists}</span>
          <span>{elapsed.toFixed(1)}s</span>
        </div>

        {/* Dot grid (square aspect) */}
        <div
          className="relative mt-8 mx-auto"
          style={{
            width: "100%",
            maxWidth: 480,
            aspectRatio: "1 / 1",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 8,
          }}
        >
          {dots.map((d) => {
            const op = Math.max(0.1, 1 - d.scattered * 0.15);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => click(d)}
                disabled={done}
                aria-label={`dot-${d.id}`}
                style={{
                  position: "absolute",
                  left: `${d.x * 100}%`,
                  top: `${d.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: `rgba(255, 255, 255, ${op})`,
                  border: "none",
                  padding: 0,
                  cursor: done ? "default" : "pointer",
                  transition: "left 0.4s ease, top 0.4s ease, background 0.4s",
                }}
              />
            );
          })}
        </div>

        {/* Action area */}
        <div className="mt-10 text-center">
          {!done ? (
            <button
              type="button"
              onClick={surrender}
              className="rounded-full"
              style={{
                background: "transparent",
                border: "1px solid #444",
                color: "#888",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              {t("우주에 항복하기", "Surrender to the universe")}
            </button>
          ) : (
            <div className="fade-in">
              <div
                className="tabular-nums"
                style={{
                  fontSize: 56,
                  fontWeight: 200,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                }}
              >
                {elapsed.toFixed(1)}s
              </div>
              <div style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
                {t(`${resists}번 저항했지만`, `You resisted ${resists} times, but`)}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 16,
                  color: "#bbb",
                  fontWeight: 500,
                }}
              >
                {t("우주는 항상 이깁니다.", "The universe always wins.")}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-full"
                  style={{
                    background: "transparent",
                    border: "1px solid #444",
                    color: "#888",
                    padding: "10px 24px",
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
                    background: "#fff",
                    color: "#000",
                    padding: "10px 24px",
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
        </div>
      </div>

      {/* Science */}
      <section
        className="mx-auto max-w-2xl"
        style={{ padding: "48px 24px", color: "#888" }}
      >
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#888",
            fontFamily:
              locale === "ko"
                ? "var(--font-noto-sans-kr)"
                : "var(--font-inter)",
          }}
        >
          {t(
            "열역학 제2법칙: 모든 자연현상은 무질서도(엔트로피)가 증가하는 방향으로 진행됩니다. 우주는 항상 더 무질서해지려 하며, 이것은 시간이 한 방향으로만 흐르는 이유이기도 합니다. 깨진 컵이 저절로 다시 붙지 않고, 식은 커피가 다시 뜨거워지지 않는 이유가 바로 엔트로피의 법칙 때문입니다.",
            "The Second Law of Thermodynamics states that entropy always increases. The universe naturally tends toward disorder, and this is why time only flows forward. A shattered cup never spontaneously reassembles, and cooled coffee never reheats itself — these everyday observations are direct consequences of the law of entropy.",
          )}
        </p>
      </section>

      <AdMobileSticky />
    </main>
  );
}
