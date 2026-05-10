"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

const KOREAN_AVG = 2.8;
const WORLD_AVG = 5.1;
const STORAGE_KEY = "nolza-silence-best";

export default function SilenceGame() {
  const { t } = useLocale();
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [best, setBest] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const startTimeRef = useRef<number>(0);
  const bestRef = useRef(0);

  // Load best
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const v = parseFloat(saved);
        if (!isNaN(v)) {
          setBest(v);
          bestRef.current = v;
        }
      }
    } catch {}
  }, []);

  // Timer loop — runs forever, no goal
  useEffect(() => {
    startTimeRef.current = performance.now();
    let raf: number | null = null;
    const tick = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      setTimer(elapsed);
      // Best updates silently as current attempt exceeds it
      if (elapsed > bestRef.current) {
        bestRef.current = elapsed;
        setBest(elapsed);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  // Detect any input → reset
  useEffect(() => {
    let lastMouse: { x: number; y: number } | null = null;
    let lastOri: { a: number; b: number; g: number } | null = null;

    const isAllowed = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return !!el?.closest?.("[data-allow]");
    };

    const triggerReset = () => {
      // Persist the just-finished attempt (best in ref is already current)
      try {
        localStorage.setItem(STORAGE_KEY, String(bestRef.current));
      } catch {}
      setAttempts((a) => a + 1);
      startTimeRef.current = performance.now();
      setTimer(0);
      setFlashKey((k) => k + 1);
    };

    const onMove = (e: MouseEvent) => {
      if (isAllowed(e.target)) {
        lastMouse = { x: e.clientX, y: e.clientY };
        return;
      }
      if (lastMouse) {
        const dx = Math.abs(e.clientX - lastMouse.x);
        const dy = Math.abs(e.clientY - lastMouse.y);
        if (dx > 1 || dy > 1) triggerReset();
      }
      lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      if (isAllowed(e.target)) return;
      triggerReset();
    };
    const onScroll = () => triggerReset();
    const onKey = () => triggerReset();
    const onTouchStart = (e: TouchEvent) => {
      if (isAllowed(e.target)) return;
      triggerReset();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isAllowed(e.target)) return;
      triggerReset();
    };
    const onOri = (e: DeviceOrientationEvent) => {
      const a = e.alpha ?? 0,
        b = e.beta ?? 0,
        g = e.gamma ?? 0;
      if (lastOri) {
        const da = Math.abs(a - lastOri.a);
        const db = Math.abs(b - lastOri.b);
        const dg = Math.abs(g - lastOri.g);
        if (da > 5 || db > 5 || dg > 5) triggerReset();
      }
      lastOri = { a, b, g };
    };
    const onBlur = () => triggerReset();
    const onVis = () => {
      if (document.visibilityState !== "visible") triggerReset();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("deviceorientation", onOri);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("deviceorientation", onOri);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const handleShare = async () => {
    const text = t(
      `나 놀자.fun에서 ${best.toFixed(1)}초 버텼다 → nolza.fun/games/silence`,
      `I lasted ${best.toFixed(1)}s on nolza.fun → nolza.fun/games/silence`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const showResult = attempts >= 1;

  return (
    <main
      className="page-in min-h-screen relative"
      style={{
        backgroundColor: "#ffffff",
        color: "#999",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        userSelect: "none",
      }}
    >
      <Link
        href="/"
        className="back-arrow"
        aria-label="home"
        data-allow
        style={{ color: "#bbb" }}
      >
        ←
      </Link>
      <div data-allow>
      </div>

      {flashKey > 0 && <div key={flashKey} className="silence-flash" />}

      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-center" style={{ fontWeight: 300 }}>
          <div style={{ fontSize: 24, color: "#999" }}>
            {t("아무것도 하지 마세요", "Do nothing")}
          </div>
          <div style={{ fontSize: 16, marginTop: 6, color: "#bbb" }}>
            {t("해냈습니다", "You did it")}
          </div>
        </div>

        <div
          className="tabular-nums"
          style={{
            marginTop: 36,
            fontSize: 16,
            color: "#ccc",
            fontWeight: 300,
            fontFamily: "var(--font-inter)",
          }}
        >
          {timer.toFixed(1)}s
        </div>
      </div>

      {/* Result panel — appears after any reset */}
      {showResult && (
        <div
          data-allow
          className="fade-in"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 56,
            textAlign: "center",
            fontSize: 13,
            color: "#bbb",
            letterSpacing: "0.05em",
          }}
        >
          <div style={{ marginBottom: 10 }}>
            {t(
              `한국인 평균: ${KOREAN_AVG}초 · 전세계 평균: ${WORLD_AVG}초`,
              `Korean avg: ${KOREAN_AVG}s · Global avg: ${WORLD_AVG}s`,
            )}
          </div>
          <button
            type="button"
            onClick={handleShare}
            data-allow
            style={{
              background: "transparent",
              border: "1px solid #ddd",
              color: "#888",
              padding: "6px 18px",
              borderRadius: 9999,
              fontSize: 13,
              letterSpacing: "0.15em",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            {copied ? "✓" : t("공유", "Share")}
          </button>
        </div>
      )}

      {/* Always-visible best — bottom-right, 11px #ddd */}
      <div
        data-allow
        data-mobile-ad-lift="16"
        className="tabular-nums"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          fontSize: 13,
          color: "#ddd",
          fontFamily: "var(--font-inter)",
          letterSpacing: "0.03em",
        }}
      >
        best: {best.toFixed(1)}s
      </div>

      <AdMobileSticky />
    </main>
  );
}
