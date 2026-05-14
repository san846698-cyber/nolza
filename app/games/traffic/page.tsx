"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { LEVELS, GRID, EXIT_ROW, type Car } from "@/lib/traffic/levels";
import { solve } from "@/lib/traffic/solver";
import s from "./traffic.module.css";

const BEST_KEY = "nolza-traffic-best";

type DragState = {
  carId: string;
  pointerStart: number; // pointer pos in pixels along axis
  origPos: number; // car's variable axis pos at drag start
  axis: "x" | "y";
};

function loadBest(): Record<number, number> {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}
function saveBest(b: Record<number, number>) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(b));
  } catch {}
}

function cloneCars(cars: Car[]): Car[] {
  return cars.map((c) => ({ ...c }));
}

/** Compute the inclusive [min, max] valid axis position for a car, given other cars. */
function computeRange(car: Car, others: Car[]): [number, number] {
  // Build occupancy of cells *not* occupied by this car.
  const grid: boolean[][] = Array.from({ length: GRID }, () =>
    Array(GRID).fill(false),
  );
  for (const o of others) {
    if (o.id === car.id) continue;
    if (o.orientation === "h") {
      for (let i = 0; i < o.length; i++) grid[o.y][o.x + i] = true;
    } else {
      for (let i = 0; i < o.length; i++) grid[o.y + i][o.x] = true;
    }
  }
  if (car.orientation === "h") {
    let minX = car.x;
    while (minX > 0 && !grid[car.y][minX - 1]) minX--;
    let maxX = car.x;
    while (maxX + car.length < GRID && !grid[car.y][maxX + car.length]) maxX++;
    return [minX, maxX];
  } else {
    let minY = car.y;
    while (minY > 0 && !grid[minY - 1][car.x]) minY--;
    let maxY = car.y;
    while (maxY + car.length < GRID && !grid[maxY + car.length][car.x]) maxY++;
    return [minY, maxY];
  }
}

export default function TrafficGame() {
  const { t } = useLocale();
  const [levelIdx, setLevelIdx] = useState(0);
  const [cars, setCars] = useState<Car[]>(() => cloneCars(LEVELS[0].cars));
  const [moves, setMoves] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [won, setWon] = useState(false);
  const [bests, setBests] = useState<Record<number, number>>({});
  const [hintMoves, setHintMoves] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bumpCarId, setBumpCarId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<Car[]>(cars);
  const dragRef = useRef<DragState | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [draggingCarId, setDraggingCarId] = useState<string | null>(null);

  useEffect(() => {
    carsRef.current = cars;
  }, [cars]);

  function playMoveSound() {
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      /* audio failure is non-fatal */
    }
  }

  function playWinSound() {
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      // Three-note rising arpeggio.
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const t0 = now + i * 0.08;
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.exponentialRampToValueAtTime(0.14, t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.24);
      });
    } catch {
      /* ignore */
    }
  }

  const level = LEVELS[levelIdx];
  const isFinal = levelIdx === LEVELS.length - 1;

  useEffect(() => {
    setBests(loadBest());
  }, []);

  // Reset state when level changes.
  useEffect(() => {
    setCars(cloneCars(LEVELS[levelIdx].cars));
    setMoves(0);
    setExiting(false);
    setWon(false);
    setShowHint(false);
    setHintMoves(null);
  }, [levelIdx]);

  function getCellSize(): number {
    const el = boardRef.current;
    if (!el) return 0;
    return el.getBoundingClientRect().width / GRID;
  }

  function onPointerDown(e: React.PointerEvent, car: Car) {
    if (exiting || won) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const cellSize = getCellSize();
    if (cellSize === 0) return;
    dragRef.current = {
      carId: car.id,
      pointerStart: car.orientation === "h" ? e.clientX : e.clientY,
      origPos: car.orientation === "h" ? car.x : car.y,
      axis: car.orientation === "h" ? "x" : "y",
    };
    setDraggingCarId(car.id);
    setBumpCarId(null);
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const cellSize = getCellSize();
    if (cellSize === 0) return;
    const cur = d.axis === "x" ? e.clientX : e.clientY;
    const deltaCells = Math.round((cur - d.pointerStart) / cellSize);
    setCars((prev) => {
      const car = prev.find((c) => c.id === d.carId);
      if (!car) return prev;
      const desired = d.origPos + deltaCells;
      const [min, max] = computeRange(car, prev);
      const newPos = Math.max(min, Math.min(max, desired));
      const curAxis = car.orientation === "h" ? car.x : car.y;
      if (newPos === curAxis) return prev;
      const next = prev.map((c) => {
        if (c.id !== d.carId) return c;
        if (c.orientation === "h") return { ...c, x: newPos };
        return { ...c, y: newPos };
      });
      carsRef.current = next;
      return next;
    });
  }

  function onPointerUp() {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setDraggingCarId(null);
    const car = carsRef.current.find((c) => c.id === d.carId);
    if (!car) return;
    const finalPos = car.orientation === "h" ? car.x : car.y;
    if (finalPos !== d.origPos) {
      setMoves((m) => m + 1);
      playMoveSound();
      // Win check: player car at exit
      if (
        d.carId === "R" &&
        car.orientation === "h" &&
        car.y === EXIT_ROW &&
        car.x + car.length === GRID
      ) {
        triggerWin();
      }
    } else {
      setBumpCarId(d.carId);
      window.setTimeout(() => setBumpCarId(null), 260);
    }
  }

  function triggerWin() {
    setExiting(true);
    playWinSound();
    setTimeout(() => {
      setWon(true);
      setBests((prev) => {
        const cur = prev[level.id];
        if (cur === undefined || moves + 1 < cur) {
          const next = { ...prev, [level.id]: moves + 1 };
          saveBest(next);
          return next;
        }
        return prev;
      });
    }, 750);
  }

  function reset() {
    setCars(cloneCars(level.cars));
    setMoves(0);
    setExiting(false);
    setWon(false);
  }

  function nextLevel() {
    if (levelIdx + 1 < LEVELS.length) setLevelIdx(levelIdx + 1);
  }

  function prevLevel() {
    if (levelIdx > 0) setLevelIdx(levelIdx - 1);
  }

  function toggleHint() {
    if (showHint) {
      setShowHint(false);
      return;
    }
    if (hintMoves === null) {
      const result = solve(level.cars);
      setHintMoves(result?.moves ?? null);
    }
    setShowHint(true);
  }

  async function share() {
    const url = "https://nolza.fun/games/traffic";
    const my = moves;
    const text = t(
      `레벨 ${level.id}을 ${my}번 만에 클리어했어요! 🚗\n${url}`,
      `I cleared level ${level.id} in ${my} moves! 🚗\n${url}`,
    );
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: t("교통 지옥 클리어!", "Traffic Hell cleared!"),
          text,
          url,
        });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  // Force re-render on resize so cars re-position.
  const [, setResizeTick] = useState(0);
  useEffect(() => {
    const onResize = () => setResizeTick((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const playerBest = bests[level.id];

  return (
    <div className={s.shell}>
      <header className={s.topbar}>
        <Link href="/" className={s.back}>
          ← {t("놀자.fun", "nolza.fun")}
        </Link>
        <div className={s.title}>
          {t("교통 지옥", "Traffic Hell")}
        </div>
        <div className={s.counter}>
          {levelIdx + 1}/{LEVELS.length}
        </div>
      </header>

      <main className={s.main}>
        <div className={s.headRow}>
          <div>
            <div className={s.levelLabel}>{t("레벨", "Level")}</div>
            <div className={s.levelNumber}>
              {String(level.id).padStart(2, "0")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className={s.levelLabel}>{t("이동", "Moves")}</div>
            <div className={s.movesNum}>{moves}</div>
          </div>
        </div>
        <div className={s.hudCards}>
          <div>
            <span>{t("기록", "Best")}</span>
            <b>{playerBest ?? "—"}</b>
          </div>
          <div>
            <span>{t("출구", "Exit")}</span>
            <b>{t("오른쪽", "Right")}</b>
          </div>
          <div>
            <span>{t("퍼즐", "Puzzle")}</span>
            <b>{levelIdx + 1}/{LEVELS.length}</b>
          </div>
        </div>

        <div className={s.boardWrap} ref={boardRef}>
          <div className={s.exitLane} aria-hidden>
            <span>{t("출구", "EXIT")}</span>
          </div>
          <div
            className={s.grid}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className={s.exit} aria-hidden>
              <span>→</span>
            </div>
            {cars.map((car) => {
              const isPlayer = car.id === "R";
              const xPos = isPlayer && exiting ? GRID + 0.5 : car.x;
              const wCells = car.orientation === "h" ? car.length : 1;
              const hCells = car.orientation === "v" ? car.length : 1;
              return (
                <div
                  key={car.id}
                  className={s.car}
                  data-player={isPlayer}
                  data-orient={car.orientation}
                  data-exiting={isPlayer && exiting}
                  data-dragging={draggingCarId === car.id}
                  data-bump={bumpCarId === car.id}
                  style={{
                    left: `calc(${xPos} * 100% / ${GRID} + 3px)`,
                    top: `calc(${car.y} * 100% / ${GRID} + 3px)`,
                    width: `calc(${wCells} * 100% / ${GRID} - 6px)`,
                    height: `calc(${hCells} * 100% / ${GRID} - 6px)`,
                    background: car.color,
                  }}
                  onPointerDown={(e) => onPointerDown(e, car)}
                >
                  <div className={s.carGlow} />
                  <div className={s.windshield} />
                  <div className={s.hood} />
                  <div className={s.wheels}>
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={s.headlights}>
                    <span />
                    <span />
                  </div>
                  {isPlayer && <div className={s.meBadge}>ME</div>}
                </div>
              );
            })}
          </div>
        </div>

        {showHint && hintMoves !== null && (
          <div className={s.hint}>
            {t("최적", "Optimal")}:{" "}
            <span className={s.hintNum}>{hintMoves}</span>{" "}
            {t("번", "moves")}
            {playerBest !== undefined && (
              <>
                {" · "}
                {t("내 기록", "Best")}:{" "}
                <span className={s.hintNum}>{playerBest}</span>{" "}
                {t("번", "moves")}
              </>
            )}
          </div>
        )}

        <div className={s.controls}>
          <button
            type="button"
            className={s.btn}
            onClick={prevLevel}
            disabled={levelIdx === 0}
          >
            <span>‹</span>{t("이전", "Prev")}
          </button>
          <button type="button" className={s.btn} onClick={reset}>
            <span>↺</span>{t("다시", "Retry")}
          </button>
          <button type="button" className={s.btn} onClick={toggleHint}>
            <span>?</span>{t("힌트", "Hint")}
          </button>
          <button
            type="button"
            className={s.btn}
            onClick={() => setShowSelect(true)}
          >
            <span>▦</span>{t("레벨", "Levels")}
          </button>
          <button
            type="button"
            className={s.btn}
            onClick={nextLevel}
            disabled={levelIdx >= LEVELS.length - 1}
          >
            {t("다음", "Next")}<span>›</span>
          </button>
        </div>
      </main>

      {showSelect && (
        <div
          className={s.winOverlay}
          onClick={() => setShowSelect(false)}
        >
          <div
            className={s.selectCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.selectTitle}>
              {t("레벨 선택", "Choose a Level")}
            </div>
            <div className={s.selectSub}>
              {t(
                "원하는 레벨로 바로 이동할 수 있어요.",
                "Jump to any level you like.",
              )}
            </div>
            <div className={s.levelGrid}>
              {LEVELS.map((lv, idx) => {
                const best = bests[lv.id];
                const cleared = best !== undefined;
                const current = idx === levelIdx;
                return (
                  <button
                    key={lv.id}
                    type="button"
                    className={s.levelTile}
                    data-current={current}
                    data-cleared={cleared}
                    onClick={() => {
                      setLevelIdx(idx);
                      setShowSelect(false);
                    }}
                  >
                    <span>{String(lv.id).padStart(2, "0")}</span>
                    {cleared && (
                      <span className={s.tileBest}>{best}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className={s.selectClose}
              onClick={() => setShowSelect(false)}
            >
              {t("닫기", "Close")}
            </button>
          </div>
        </div>
      )}

      {won && (
        <div className={s.winOverlay} onClick={(e) => e.stopPropagation()}>
          <div className={s.winCard}>
            <div className={s.confetti} aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={s.winEmoji}>🚗</div>
            <div className={s.winTitle}>{t("클리어!", "Cleared!")}</div>
            {isFinal && (
              <div className={s.winSpecial}>
                {t(
                  "당신은 상위 0.1%입니다",
                  "You're in the top 0.1%",
                )}
              </div>
            )}
            <div className={s.winStats}>
              {t("레벨", "Level")} <b>{level.id}</b>
              {" · "}
              {t("이동", "Moves")} <b>{moves}</b>
              <br />
              {hintMoves !== null && (
                <>
                  {t("최적", "Optimal")} <b>{hintMoves}</b>
                  {playerBest !== undefined && playerBest !== moves && (
                    <>
                      {" · "}
                      {t("기록", "Best")} <b>{Math.min(playerBest, moves)}</b>
                    </>
                  )}
                </>
              )}
              {hintMoves === null && playerBest !== undefined && (
                <>
                  {t("기록", "Best")} <b>{Math.min(playerBest, moves)}</b>
                </>
              )}
            </div>
            <div className={s.winActions}>
              <button type="button" className={s.btn} onClick={reset}>
                <span>↺</span>{t("다시 하기", "Retry")}
              </button>
              <button type="button" className={s.btn} onClick={share}>
                {copied
                  ? t("복사됨", "Copied")
                  : <><span>↗</span>{t("공유하기", "Share")}</>}
              </button>
              {!isFinal && (
                <button
                  type="button"
                  className={s.btnPrimary}
                  onClick={nextLevel}
                >
                  {t("다음 레벨", "Next Level")}<span>›</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
