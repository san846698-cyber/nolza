"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SENTENCES = [
  "안녕하세요",
  "사랑합니다",
  "감사합니다",
  "행복하세요",
  "오늘도 화이팅",
];

type Point = { x: number; y: number };

function getGrade(score: number) {
  if (score >= 85) return { label: "🖋️ 달필! 명필가급", tone: "text-emerald-400" };
  if (score >= 65) return { label: "✍️ 보통 글씨", tone: "text-yellow-300" };
  if (score >= 40) return { label: "✏️ 살짝 악필", tone: "text-orange-400" };
  return { label: "💀 판독 불가", tone: "text-accent" };
}

const FAMOUS_BAD = [
  { name: "김연아", note: "의외로 단정한 글씨" },
  { name: "유재석", note: "악필로 유명함" },
  { name: "이영자", note: "달필" },
];

export default function HandwritingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[][]>([]);
  const drawingRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const [target, setTarget] = useState(SENTENCES[0]);
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#141414";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.font = "bold 56px sans-serif";
      ctx.fillStyle = "#222";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(target, rect.width / 2, rect.height / 2);
    }
  }, [target]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    if (startTimeRef.current === null) startTimeRef.current = performance.now();
    const rect = canvas.getBoundingClientRect();
    pointsRef.current.push([{
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }]);
    drawStroke();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const last = pointsRef.current[pointsRef.current.length - 1];
    last.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    drawStroke();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const drawStroke = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const last = pointsRef.current[pointsRef.current.length - 1];
    if (!last || last.length < 2) return;
    const a = last[last.length - 2];
    const b = last[last.length - 1];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };

  const reset = () => {
    pointsRef.current = [];
    startTimeRef.current = null;
    setScore(null);
    setupCanvas();
  };

  const compute = () => {
    const strokes = pointsRef.current;
    if (strokes.length === 0) return;
    const totalLen = strokes.reduce((s, stroke) => {
      let len = 0;
      for (let i = 1; i < stroke.length; i++) {
        len += Math.hypot(
          stroke[i].x - stroke[i - 1].x,
          stroke[i].y - stroke[i - 1].y,
        );
      }
      return s + len;
    }, 0);
    const elapsed = startTimeRef.current
      ? (performance.now() - startTimeRef.current) / 1000
      : 1;
    const lengthScore = Math.min(60, totalLen / 10);
    const speedScore = elapsed < 1 ? 0 : Math.min(20, 20 - Math.abs(elapsed - 5) * 2);
    const strokeScore = Math.min(20, strokes.length * 2);
    const jitter = (Math.random() - 0.5) * 15;
    const final = Math.max(
      5,
      Math.min(99, Math.round(lengthScore + speedScore + strokeScore + jitter)),
    );
    setScore(final);
  };

  const handleShare = async () => {
    if (score === null) return;
    const grade = getGrade(score);
    const text = `내 악필 점수 ${score}점 (${grade.label}) → nolza.fun/games/handwriting`;
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
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            내 <span className="text-accent">악필 점수</span>는?
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            아래 글자를 따라 써보세요. 점수는 재미용 추정치입니다.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
          <div className="mb-3 flex flex-wrap gap-2">
            {SENTENCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setTarget(s);
                  reset();
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  target === s
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-bg text-gray-400 hover:border-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative aspect-[2/1] w-full">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ touchAction: "none" }}
              className="absolute inset-0 h-full w-full cursor-crosshair rounded-xl border border-border bg-card"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={reset} className="flex-1 rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
              ↻ 지우기
            </button>
            <button type="button" onClick={compute} className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
              📝 채점하기
            </button>
          </div>
        </div>

        {score !== null && (
          <>
            <div className="mt-6 rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-xs text-accent">결과</div>
              <div className="mt-2 text-6xl font-black tabular-nums md:text-7xl">
                {score}<span className="text-3xl text-gray-500">점</span>
              </div>
              <div className={`mt-2 text-xl font-bold md:text-2xl ${getGrade(score).tone}`}>
                {getGrade(score).label}
              </div>
            </div>
            <section className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="text-xs text-gray-500">유명인 악필 비교</div>
              <ul className="mt-3 space-y-1 text-sm">
                {FAMOUS_BAD.map((f) => (
                  <li key={f.name}>
                    <span className="font-bold">{f.name}</span>{" "}
                    <span className="text-gray-400">— {f.note}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="mt-8 flex justify-center">
              <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
