"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Dot = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
};

const RADIUS = 8;

export default function InertiaGame() {
  const { locale, t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const dragRef = useRef<{ id: number; sx: number; sy: number } | null>(null);
  const dragLineRef = useRef<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const idCounterRef = useRef<number>(1);
  const pushCountRef = useRef<number>(0);
  const [dotCount, setDotCount] = useState(1);
  const [pushes, setPushes] = useState(0);
  const [hint, setHint] = useState(true);
  const [copied, setCopied] = useState(false);

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
      // Initialize dot in center if empty
      if (dotsRef.current.length === 0) {
        dotsRef.current.push({
          id: idCounterRef.current++,
          x: rect.width / 2,
          y: rect.height / 2,
          vx: 0,
          vy: 0,
          trail: [],
        });
        setDotCount(1);
      }
    };
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    let raf: number | null = null;
    const tick = () => {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      // Trail fade
      ctx.fillStyle = "rgba(8, 8, 8, 0.18)";
      ctx.fillRect(0, 0, W, H);

      for (const d of dotsRef.current) {
        d.x += d.vx;
        d.y += d.vy;
        // Reflect off walls
        if (d.x < RADIUS) {
          d.x = RADIUS;
          d.vx = -d.vx;
        }
        if (d.x > W - RADIUS) {
          d.x = W - RADIUS;
          d.vx = -d.vx;
        }
        if (d.y < RADIUS) {
          d.y = RADIUS;
          d.vy = -d.vy;
        }
        if (d.y > H - RADIUS) {
          d.y = H - RADIUS;
          d.vy = -d.vy;
        }

        // Trail
        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 30) d.trail.shift();

        // Draw trail
        if (d.trail.length > 1) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(d.trail[0].x, d.trail[0].y);
          for (let i = 1; i < d.trail.length; i++) {
            ctx.lineTo(d.trail[i].x, d.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw dot
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drag indicator
      if (dragLineRef.current) {
        const { x1, y1, x2, y2 } = dragLineRef.current;
        ctx.strokeStyle = "rgba(255, 200, 100, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Find nearest dot
    let target: Dot | null = null;
    let bestDist = Infinity;
    for (const d of dotsRef.current) {
      const dist = Math.hypot(d.x - x, d.y - y);
      if (dist < bestDist && dist < 60) {
        target = d;
        bestDist = dist;
      }
    }
    if (!target) return;
    canvas.setPointerCapture(e.pointerId);
    dragRef.current = { id: target.id, sx: x, sy: y };
    dragLineRef.current = { x1: target.x, y1: target.y, x2: x, y2: y };
    setHint(false);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const d = dotsRef.current.find((x) => x.id === dragRef.current!.id);
    if (d) {
      dragLineRef.current = { x1: d.x, y1: d.y, x2: x, y2: y };
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const d = dotsRef.current.find((x) => x.id === dragRef.current!.id);
    if (d) {
      // Velocity = vector from dot to release point, scaled
      const dx = x - d.x;
      const dy = y - d.y;
      const scale = 0.06;
      d.vx += dx * scale;
      d.vy += dy * scale;
    }
    pushCountRef.current++;
    setPushes(pushCountRef.current);
    // 3rd push onward: spawn extra dot
    if (pushCountRef.current >= 3 && d) {
      const newDot: Dot = {
        id: idCounterRef.current++,
        x: d.x,
        y: d.y,
        vx: -d.vx + (Math.random() - 0.5) * 4,
        vy: -d.vy + (Math.random() - 0.5) * 4,
        trail: [],
      };
      dotsRef.current = [...dotsRef.current, newDot].slice(-40);
      setDotCount(dotsRef.current.length);
    }
    dragRef.current = null;
    dragLineRef.current = null;
  };

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dotsRef.current = [
      {
        id: idCounterRef.current++,
        x: rect.width / 2,
        y: rect.height / 2,
        vx: 0,
        vy: 0,
        trail: [],
      },
    ];
    pushCountRef.current = 0;
    setDotCount(1);
    setPushes(0);
    setHint(true);
  };

  const handleShare = async () => {
    const text = t(
      `관성으로 점 ${dotCount}개 만들었다 → nolza.fun/games/inertia`,
      `Created ${dotCount} dots with inertia → nolza.fun/games/inertia`,
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
        backgroundColor: "#080808",
        color: "#888",
        fontFamily: "var(--font-noto-sans-kr)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">
        ←
      </Link>
      {/* Stats */}
      <div
        className="fixed left-0 right-0 top-0 z-30 pointer-events-none px-6 py-4 flex justify-between tabular-nums"
        style={{ fontSize: 13, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}
      >
        <span>{t("점", "Dots")} · {dotCount}</span>
        <span>{t("밀기", "Pushes")} · {pushes}</span>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full"
        style={{ height: "70vh", minHeight: 480, marginTop: 56 }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            touchAction: "none",
            background: "#080808",
          }}
        />
        {hint && (
          <div
            className="pointer-events-none fade-in"
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 16,
              color: "#555",
              letterSpacing: "0.2em",
            }}
          >
            {t("점을 드래그해서 밀어보세요", "Drag a dot to push it")}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="text-center" style={{ padding: "16px" }}>
        <button
          type="button"
          onClick={reset}
          className="rounded-full"
          style={{
            background: "transparent",
            border: "1px solid #333",
            color: "#888",
            padding: "8px 24px",
            fontSize: 14,
            letterSpacing: "0.15em",
          }}
        >
          ↻ {t("처음으로", "RESET")}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="ml-2 rounded-full"
          style={{
            background: "#fff",
            color: "#080808",
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
        style={{ padding: "32px 24px 48px", color: "#888" }}
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
            "뉴턴의 운동 제1법칙(관성의 법칙): 외부에서 힘이 가해지지 않는 한, 정지한 물체는 정지 상태를 유지하고, 운동하는 물체는 같은 속도와 방향으로 계속 운동합니다. 우주 공간에서 발사된 인공위성이나 보이저호가 영원히 움직이는 이유, 그리고 자동차가 급정거할 때 우리 몸이 앞으로 쏠리는 이유가 모두 이 법칙 때문입니다.",
            "Newton's First Law of Motion (the law of inertia): an object at rest stays at rest, and an object in motion continues at the same velocity and direction unless acted upon by an external force. This is why satellites and probes like Voyager travel forever through space, and why your body lurches forward when a car brakes suddenly.",
          )}
        </p>
      </section>

      <AdMobileSticky />
    </main>
  );
}
