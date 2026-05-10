"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Point = { x: number; y: number };
type Result = { accuracy: number; center: Point; radius: number };

const STORAGE_KEY = "nolza-circle-best";
const MIN_POINTS = 20;
const MIN_RADIUS = 20;

function calculateAccuracy(points: Point[]): Result | null {
  if (points.length < MIN_POINTS) return null;
  let sx = 0, sy = 0;
  for (const p of points) { sx += p.x; sy += p.y; }
  const cx = sx / points.length;
  const cy = sy / points.length;
  const radii = points.map((p) => Math.hypot(p.x - cx, p.y - cy));
  const avgR = radii.reduce((s, r) => s + r, 0) / radii.length;
  if (avgR < MIN_RADIUS) return null;
  const variance = radii.reduce((s, r) => s + (r - avgR) ** 2, 0) / radii.length;
  const stddev = Math.sqrt(variance);
  const cv = stddev / avgR;
  const angles = points.map((p) => Math.atan2(p.y - cy, p.x - cx)).sort((a, b) => a - b);
  let maxGap = angles[0] + 2 * Math.PI - angles[angles.length - 1];
  for (let i = 1; i < angles.length; i++) {
    maxGap = Math.max(maxGap, angles[i] - angles[i - 1]);
  }
  const coverage = Math.max(0, 1 - maxGap / Math.PI);
  const accuracy = Math.max(0, Math.min(100, (1 - cv) * 100 * coverage));
  return { accuracy, center: { x: cx, y: cy }, radius: avgR };
}

function tier(acc: number, t: (k: string, e: string) => string): string {
  if (acc >= 95) return t("완벽에 가깝습니다... 혹시 컴퓨터세요?", "Near perfect... Are you a robot?");
  if (acc >= 85) return t("대단해요! 상위 1%입니다 👑", "Amazing! Top 1% 👑");
  if (acc >= 60) return t("보통이에요. 한 번 더?", "Average. Try again?");
  return t("...다시 도전해보세요 😅", "...Try again 😅");
}

export default function CircleGame() {
  const { t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const resultRef = useRef<Result | null>(null);
  const drawingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const bestRef = useRef<number | null>(null);

  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    const points = pointsRef.current;
    if (points.length >= 2) {
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
    const r = resultRef.current;
    if (r) {
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(r.center.x, r.center.y, r.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      draw();
    });
  }, [draw]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }, [draw]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const n = parseFloat(saved);
      if (!isNaN(n)) { bestRef.current = n; setBest(n); }
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  const reset = useCallback(() => {
    pointsRef.current = [];
    resultRef.current = null;
    drawingRef.current = false;
    setResult(null);
    setHasStarted(false);
    draw();
  }, [draw]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    pointsRef.current = [];
    resultRef.current = null;
    setResult(null);
    setHasStarted(true);
    const rect = canvas.getBoundingClientRect();
    pointsRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    scheduleRedraw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const last = pointsRef.current[pointsRef.current.length - 1];
    if (last && Math.hypot(x - last.x, y - last.y) < 1.5) return;
    pointsRef.current.push({ x, y });
    scheduleRedraw();
  };

  const finish = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    const r = calculateAccuracy(pointsRef.current);
    resultRef.current = r;
    setResult(r);
    if (r && r.accuracy > (bestRef.current ?? 0)) {
      bestRef.current = r.accuracy;
      setBest(r.accuracy);
      try { localStorage.setItem(STORAGE_KEY, String(r.accuracy)); } catch {}
    }
    scheduleRedraw();
  };

  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: "#fafafa", color: "#1a1a1a" }}
    >
      <Link href="/" className="back-arrow" aria-label={t("홈으로", "Home")} style={{ color: "#1a1a1a" }}>
        ←
      </Link>
      <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
        <AdTop />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-5 pb-12 md:px-8" style={{ minHeight: "calc(100vh - 200px)" }}>
        <h1
          className="text-center"
          style={{ fontSize: 22, fontWeight: 300, letterSpacing: "0.1em", color: "#888" }}
        >
          {t("완벽한 원 그리기", "PERFECT CIRCLE")}
        </h1>

        <div className="relative mt-8 w-full max-w-[560px]">
          <div className="relative aspect-square w-full">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={finish}
              onPointerCancel={finish}
              onPointerLeave={finish}
              style={{ touchAction: "none", borderRadius: 8 }}
              className="absolute inset-0 h-full w-full cursor-crosshair bg-white"
            />
            {!hasStarted && !result && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span
                  className="font-light"
                  style={{ fontSize: 64, color: "#e5e5e5", letterSpacing: "0.1em" }}
                >
                  {t("그리기", "Draw")}
                </span>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-10 text-center fade-in">
            <div style={{ fontSize: 13, color: "#999", letterSpacing: "0.2em", marginBottom: 8, textTransform: "uppercase" }}>
              {t("정확도", "Accuracy")}
            </div>
            <div
              className="tabular-nums"
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: "#1a1a1a",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {result.accuracy.toFixed(1)}
              <span style={{ fontSize: 36, color: "#bbb", marginLeft: 4 }}>%</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 16, color: "#555", fontWeight: 500 }}>
              {tier(result.accuracy, t)}
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label={t("다시 그리기", "Draw again")}
              className="mt-6 rounded-full px-6 py-2 transition-colors"
              style={{
                fontSize: 15,
                color: "#888",
                border: "1px solid #ddd",
                fontWeight: 400,
              }}
            >
              ↻ {t("다시 그리기", "Draw Again")}
            </button>
          </div>
        )}

        {best !== null && !result && (
          <div
            className="mt-6 tabular-nums"
            style={{ fontSize: 14, color: "#bbb", letterSpacing: "0.1em" }}
          >
            {t("최고 기록", "BEST")} · {best.toFixed(1)}%
          </div>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-5 pb-12 md:px-8">
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
