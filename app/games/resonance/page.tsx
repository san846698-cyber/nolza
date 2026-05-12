"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Wave = { id: number; phase: number; amp: number; freq: number; born: number };

const BASE_FREQ = 1.2;
const BASE_AMP = 30;

export default function ResonanceGame() {
  const { locale, t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavesRef = useRef<Wave[]>([
    { id: 0, phase: 0, amp: BASE_AMP, freq: BASE_FREQ, born: 0 },
  ]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const idCounterRef = useRef<number>(1);
  const [maxAmp, setMaxAmp] = useState(BASE_AMP);
  const [feedback, setFeedback] = useState<"" | "PERFECT" | "GOOD" | "MISS">("");
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [waveCount, setWaveCount] = useState(1);
  const [resonating, setResonating] = useState(false);
  const [silent, setSilent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Setup canvas + animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    startRef.current = performance.now();

    const tick = () => {
      const t = (performance.now() - startRef.current) / 1000;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);

      const cy = H / 2;
      let maxThisFrame = 0;

      // Combined wave
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(100, 200, 255, 0.85)";
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        let y = 0;
        for (const w of wavesRef.current) {
          const phase = (x / W) * Math.PI * 2 * w.freq + w.phase + t * 1.4;
          y += Math.sin(phase) * w.amp;
        }
        if (Math.abs(y) > maxThisFrame) maxThisFrame = Math.abs(y);
        if (x === 0) ctx.moveTo(x, cy + y);
        else ctx.lineTo(x, cy + y);
      }
      ctx.stroke();

      // Update peak meter
      if (maxThisFrame > maxAmp) setMaxAmp(maxThisFrame);

      // Resonance / silence detection
      const resAmp = maxThisFrame > Math.min(H * 0.42, 280);
      if (resAmp !== resonating) setResonating(resAmp);
      const silenceState = maxThisFrame < 4 && wavesRef.current.length > 1;
      if (silenceState !== silent) setSilent(silenceState);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", setupCanvas);
    };
  }, [maxAmp, resonating, silent]);

  // Tap handler — adds wave with timing-based result
  const tap = () => {
    const t = (performance.now() - startRef.current) / 1000;
    // Compute current main wave phase
    const main = wavesRef.current[0];
    const phaseAtCenter = (Math.PI * main.freq + main.phase + t * 1.4) % (Math.PI * 2);
    // Distance to peak (sin = 1 at π/2)
    const distToPeak = Math.min(
      Math.abs(phaseAtCenter - Math.PI / 2),
      Math.abs(phaseAtCenter - Math.PI / 2 - Math.PI * 2),
      Math.abs(phaseAtCenter - Math.PI / 2 + Math.PI * 2),
    );
    let result: "PERFECT" | "GOOD" | "MISS";
    let phaseShift = 0;
    let ampMul = 1;
    if (distToPeak < 0.3) {
      result = "PERFECT";
      phaseShift = main.phase;
      ampMul = 1.4;
    } else if (distToPeak < 0.8) {
      result = "GOOD";
      phaseShift = main.phase;
      ampMul = 1.1;
    } else {
      result = "MISS";
      phaseShift = main.phase + Math.PI; // anti-phase
      ampMul = 0.7;
    }
    const newWave: Wave = {
      id: idCounterRef.current++,
      phase: phaseShift,
      amp: BASE_AMP * ampMul,
      freq: BASE_FREQ,
      born: t,
    };
    wavesRef.current = [...wavesRef.current, newWave].slice(-12);
    setWaveCount(wavesRef.current.length);
    setFeedback(result);
    setFeedbackKey((k) => k + 1);
    setTimeout(() => setFeedback(""), 600);
  };

  // Spacebar listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const reset = () => {
    wavesRef.current = [
      { id: 0, phase: 0, amp: BASE_AMP, freq: BASE_FREQ, born: 0 },
    ];
    idCounterRef.current = 1;
    setWaveCount(1);
    setMaxAmp(BASE_AMP);
    startRef.current = performance.now();
  };

  const handleShare = async () => {
    const text = t(
      `공명 최대 진폭 ${Math.round(maxAmp)}px 달성 → nolza.fun/games/resonance`,
      `Achieved max resonance amplitude ${Math.round(maxAmp)}px → nolza.fun/games/resonance`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main
      className="page-in min-h-screen"
      style={{
        backgroundColor: "#000510",
        color: "#aac",
        fontFamily: "var(--font-noto-sans-kr)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">
        ←
      </Link>
      {/* Stats */}
      <div
        className="fixed left-0 right-0 top-0 z-30 pointer-events-none px-6 py-4 flex justify-between tabular-nums"
        style={{ fontSize: 13, color: "#456", letterSpacing: "0.15em", textTransform: "uppercase" }}
      >
        <span>{t("파동", "Waves")} · {waveCount}</span>
        <span>{t("최대 진폭", "Max")} · {Math.round(maxAmp)}px</span>
      </div>

      {/* Canvas */}
      <div
        className={`relative w-full ${resonating ? "resonance-active" : ""}`}
        style={{ height: "clamp(280px, 50svh, 560px)", minHeight: 0 }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            e.preventDefault();
            tap();
          }}
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        />
        {/* Resonance / silence indicator */}
        {resonating && (
          <div
            key={`res-${feedbackKey}`}
            className="fade-in"
            style={{
              position: "absolute",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 16,
              color: "#7df",
              fontWeight: 700,
              letterSpacing: "0.3em",
            }}
          >
            {t("완벽한 공명!", "PERFECT RESONANCE!")}
          </div>
        )}
        {silent && (
          <div
            className="fade-in"
            style={{
              position: "absolute",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 16,
              color: "#456",
              fontWeight: 500,
              letterSpacing: "0.3em",
            }}
          >
            {t("침묵", "SILENCE")}
          </div>
        )}

        {/* Feedback chips */}
        {feedback && (
          <div
            key={feedbackKey}
            className="fade-in"
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 32,
              fontWeight: 900,
              color:
                feedback === "PERFECT"
                  ? "#FFD60A"
                  : feedback === "GOOD"
                  ? "#34C759"
                  : "#FF3B30",
              letterSpacing: "-0.02em",
            }}
          >
            {feedback}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="text-center" style={{ padding: "24px 16px" }}>
        <p style={{ fontSize: 16, color: "#789" }}>
          {t(
            "탭하거나 스페이스바를 눌러 파동을 추가하세요",
            "Tap or press space to add a wave",
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-full"
          style={{
            background: "transparent",
            border: "1px solid #234",
            color: "#789",
            padding: "8px 24px",
            fontSize: 14,
            letterSpacing: "0.15em",
          }}
        >
          ↻ {t("처음부터", "RESET")}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="ml-2 mt-4 rounded-full"
          style={{
            background: "#7df",
            color: "#000510",
            padding: "8px 24px",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          {copied ? "✓ COPIED" : t("공유", "SHARE")}
        </button>
      </div>

      {/* Science */}
      <section
        className="mx-auto max-w-2xl"
        style={{ padding: "32px 24px 48px", color: "#788" }}
      >
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#788",
            fontFamily:
              locale === "ko"
                ? "var(--font-noto-sans-kr)"
                : "var(--font-inter)",
          }}
        >
          {t(
            "공명은 물체가 자신의 고유 진동수와 같은 주파수에서 외부 힘을 받을 때 진폭이 급격히 커지는 현상입니다. 1940년 미국 워싱턴주의 타코마 다리(Tacoma Narrows Bridge)는 시속 64km의 약한 바람에도 공명이 발생해 수개월 만에 무너졌습니다. 공명은 소리, 빛, 전파, 건축물, 심지어 분자 결합에 이르기까지 자연 현상의 모든 영역에 존재합니다.",
            "Resonance occurs when an object is driven at its natural frequency, causing amplitude to grow dramatically. In 1940, the Tacoma Narrows Bridge in Washington collapsed within months of opening due to wind-induced resonance — at winds of just 40 mph. Resonance pervades all of nature, from sound and light to radio waves, architecture, and even molecular bonds.",
          )}
        </p>
      </section>

      <AdMobileSticky />
    </main>
  );
}
