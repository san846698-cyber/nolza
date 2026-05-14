"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import GameIntro from "../../components/game/GameIntro";
import ResultScreen from "../../components/game/ResultScreen";
import { useLocale } from "@/hooks/useLocale";

type Point = { x: number; y: number };
type Result = { accuracy: number; center: Point; radius: number };

const STORAGE_KEY = "nolza-circle-best";
const MIN_POINTS = 20;
const MIN_RADIUS = 20;
const DRAW_START_THRESHOLD = 6;

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

function circleVerdict(acc: number, t: (k: string, e: string) => string) {
  if (acc >= 95) {
    return {
      title: t("수학 선생님 묵념형", "Math Teacher Nods"),
      desc: t("거의 원입니다. 컴퍼스가 살짝 긴장했습니다.", "Nearly a circle. The compass is nervous."),
      detail: t("수학 선생님이 조용히 고개를 끄덕였습니다.", "A math teacher silently nodded."),
    };
  }
  if (acc >= 85) {
    return {
      title: t("달걀도 인정한 원", "Egg-approved Circle"),
      desc: t("완벽하진 않지만 달걀도 이 정도면 원이라고 해줍니다.", "Not perfect, but even an egg would approve."),
      detail: t("손목에 예술가와 제도공이 같이 살고 있습니다.", "Your wrist contains both artist and draftsman."),
    };
  }
  if (acc >= 60) {
    return {
      title: t("원과 감자 사이", "Between Circle and Potato"),
      desc: t("이건 원이라기보다 둥근 의견에 가깝습니다.", "Less a circle, more a rounded opinion."),
      detail: t("다시 그리면 갑자기 천재가 될 가능성이 있습니다.", "One more try could suddenly look genius."),
    };
  }
  return {
    title: t("자유분방한 감자", "Free-spirited Potato"),
    desc: t("원이라고 주장하면 주변에서 잠깐 조용해질 수 있습니다.", "Call it a circle and the room may go quiet for a second."),
    detail: t("그래도 한 번에 끝까지 그린 추진력은 인정합니다.", "Still, the commitment to finish the stroke is real."),
  };
}

export default function CircleGame() {
  const { locale, t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const resultRef = useRef<Result | null>(null);
  const drawingRef = useRef(false);
  const strokeStartedRef = useRef(false);
  const startPointRef = useRef<Point | null>(null);
  const rafRef = useRef<number | null>(null);
  const bestRef = useRef<number | null>(null);

  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);

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
    if (rect.width <= 0 || rect.height <= 0) return;
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
    if (!introDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frame = requestAnimationFrame(setupCanvas);
    const observer = new ResizeObserver(setupCanvas);
    observer.observe(canvas);
    window.addEventListener("resize", setupCanvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", setupCanvas);
    };
  }, [introDone, setupCanvas]);

  const reset = useCallback(() => {
    pointsRef.current = [];
    resultRef.current = null;
    drawingRef.current = false;
    strokeStartedRef.current = false;
    startPointRef.current = null;
    setResult(null);
    setHasStarted(false);
    setIntroDone(true);
    draw();
  }, [draw]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    strokeStartedRef.current = false;
    pointsRef.current = [];
    resultRef.current = null;
    setResult(null);
    const rect = canvas.getBoundingClientRect();
    startPointRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const start = startPointRef.current;
    if (!strokeStartedRef.current) {
      if (!start || Math.hypot(x - start.x, y - start.y) < DRAW_START_THRESHOLD) return;
      strokeStartedRef.current = true;
      setHasStarted(true);
      pointsRef.current.push(start, { x, y });
      scheduleRedraw();
      return;
    }
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
    startPointRef.current = null;
    if (!strokeStartedRef.current) {
      pointsRef.current = [];
      setHasStarted(false);
      scheduleRedraw();
      return;
    }
    strokeStartedRef.current = false;
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

  if (!introDone) {
    return (
      <main
        className="min-h-screen page-in flex items-center justify-center px-5 py-16"
        style={{ backgroundColor: "#fafafa", color: "#1a1a1a" }}
      >
        <GameIntro
          eyebrow={t("CHALLENGE · 손맛 정확도", "CHALLENGE · PRECISION")}
          title={t("완벽한 원 그리기", "Draw a Perfect Circle")}
          hook={t("한 획으로 원을 그리면 정확도를 바로 계산합니다.", "Draw one stroke and get an instant accuracy score.")}
          howTo={t("손가락을 떼는 순간 결과가 나와요. 그린 선과 기준 원이 같이 남아서 캡처하기 좋습니다.", "Lift your finger to score. Your stroke and the reference circle stay visible for screenshots.")}
          meta={[t("약 10초", "10 sec"), t("한 번의 선", "One stroke"), t("공유하기 쉬움", "Easy to share")]}
          startLabel={t("캔버스 열기", "Open canvas")}
          onStart={() => setIntroDone(true)}
          tone="light"
        />
        <AdMobileSticky />
      </main>
    );
  }

  const verdict = result ? circleVerdict(result.accuracy, t) : null;
  const shareText = result
    ? t(
        `내 완벽한 원 정확도는 ${result.accuracy.toFixed(1)}%. ${verdict?.title} 나왔다. 너도 그려봐.`,
        `My perfect-circle accuracy is ${result.accuracy.toFixed(1)}%. Result: ${verdict?.title}. Try drawing yours.`,
      )
    : "";

  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: "#fafafa", color: "#1a1a1a" }}
    >
      <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
        <AdTop />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-5 pb-12 md:px-8" style={{ minHeight: "calc(100svh - 200px)" }}>
        <h1
          className="text-center"
          style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.08em", color: "#1a1a1a" }}
        >
          {t("완벽한 원 그리기", "PERFECT CIRCLE")}
        </h1>
        <p className="mt-3 text-center" style={{ color: "#777", fontSize: 14, lineHeight: 1.6, wordBreak: "keep-all" }}>
          {t("한 번에 그으세요. 손가락을 떼는 순간 채점됩니다.", "Draw in one stroke. Lift to score instantly.")}
        </p>

        <div
          className="relative mt-7 w-full max-w-[560px]"
          style={{
            border: "1px solid #e7e2d6",
            borderRadius: 8,
            background: "#fffaf0",
            padding: 8,
            boxShadow: "0 18px 44px -32px rgba(20,17,14,0.34)",
          }}
        >
          <div
            className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1"
            style={{ color: "#777", fontSize: 12, fontWeight: 800, letterSpacing: "0.04em" }}
          >
            <span>{t("한 획만 인정", "ONE STROKE")}</span>
            <span className="tabular-nums">
              {best !== null ? `${t("최고", "BEST")} ${best.toFixed(1)}%` : t("첫 도전", "FIRST TRY")}
            </span>
          </div>
          <div className="relative aspect-square w-full">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={finish}
              onPointerCancel={finish}
              onPointerLeave={finish}
              style={{
                touchAction: "none",
                borderRadius: 8,
                border: "1px solid #eee8dc",
                boxShadow: "inset 0 0 0 1px rgba(20,17,14,0.03)",
              }}
              className="absolute inset-0 h-full w-full cursor-crosshair bg-white"
            />
            {!hasStarted && !result && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span
                  className="font-light"
                  style={{ fontSize: "clamp(38px, 11vw, 64px)", color: "#e5e5e5", letterSpacing: "0.08em" }}
                >
                  {t("그리기", "Draw")}
                </span>
              </div>
            )}
          </div>
          {!result && (
            <div className="px-1 pt-2 text-center" style={{ color: "#999", fontSize: 12, lineHeight: 1.5 }}>
              {t("삐뚤어져도 괜찮습니다. 결과 멘트가 더 냉정할 뿐입니다.", "Crooked is allowed. The result copy will simply be more honest.")}
            </div>
          )}
        </div>

        {result && (
          <div className="mt-10 text-center fade-in" data-share-card-skip="true">
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
          </div>
        )}

        {result && verdict && (
          <ResultScreen
            locale={locale}
            currentGameId="circle"
            eyebrow={t("원형 검사 결과", "Circle report")}
            title={verdict.title}
            score={result.accuracy.toFixed(1)}
            scoreLabel="%"
            description={verdict.desc}
            details={[
              verdict.detail,
              best !== null
                ? t(`내 최고 기록은 ${best.toFixed(1)}%입니다. 오늘의 손목 컨디션이 기록되었습니다.`, `Your best is ${best.toFixed(1)}%. Wrist condition logged.`)
                : t("첫 기록입니다. 아직 손목의 세계관이 열리는 중입니다.", "First record. Your wrist lore is just beginning."),
              t("위 캔버스에 당신의 선과 기준 원이 같이 남아 있어요.", "Your stroke and the guide circle remain on the canvas above."),
            ]}
            shareTitle={t("완벽한 원 그리기 결과", "Perfect Circle result")}
            shareText={shareText}
            shareUrl="/games/circle"
            onReplay={reset}
            replayLabel={t("다시 그리기", "Draw again")}
            recommendedIds={["react", "timesense", "kbti"]}
            tone="light"
          />
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
