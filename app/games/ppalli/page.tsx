"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

const ROUND_TIMES = [4000, 3000, 2500, 2000, 1500, 1000, 700, 500, 400, 300];
const STORAGE_KEY = "nolza-ppalli-best";

function timeForRound(round: number): number {
  if (round <= 0) return ROUND_TIMES[0];
  if (round - 1 < ROUND_TIMES.length) return ROUND_TIMES[round - 1];
  return 250;
}

function bgForRound(round: number): string {
  if (round <= 2) return "#ffffff";
  if (round <= 4) return "#fff8f8";
  if (round <= 6) return "#ffeded";
  if (round <= 8) return "#ffd8d8";
  if (round <= 10) return "#ffbfbf";
  return "#ff9a9a";
}

type Stage = 0 | 1 | 2 | 3 | 4 | 5;

function moodStage(round: number): Stage {
  if (round <= 2) return 0;
  if (round <= 4) return 1;
  if (round <= 6) return 2;
  if (round <= 8) return 3;
  if (round <= 10) return 4;
  return 5;
}

function shoutSize(round: number): number {
  return Math.min(28 + round * 3, 72);
}

function shoutColor(round: number): string {
  if (round <= 3) return "#1a1a1a";
  if (round <= 6) return "#FF6B5C";
  return "#FF3B30";
}

/* ─── Grandfather: 6 stage SVG (relaxed → dead) ─── */
function Grandfather({
  stage,
  size = 180,
}: {
  stage: Stage;
  size?: number;
}) {
  // Face color per stage
  const faceColor =
    stage <= 2
      ? "white"
      : stage === 3
      ? "#FFEDED"
      : stage === 4
      ? "#FFB8B8"
      : "#FF7A7A";

  // Body shake intensity
  const shakeClass =
    stage === 3
      ? "ppalli-body-shake-1"
      : stage === 4
      ? "ppalli-body-shake-2"
      : stage === 5
      ? "ppalli-body-shake-3"
      : "";

  // Sweat drops - position list per stage
  const sweats: { x: number; y: number }[] =
    stage === 2
      ? [{ x: 118, y: 42 }]
      : stage === 3
      ? [
          { x: 118, y: 42 },
          { x: 38, y: 50 },
          { x: 122, y: 64 },
        ]
      : stage === 4
      ? [
          { x: 118, y: 42 },
          { x: 38, y: 50 },
          { x: 122, y: 64 },
          { x: 35, y: 32 },
          { x: 128, y: 88 },
        ]
      : stage === 5
      ? [
          { x: 118, y: 42 },
          { x: 38, y: 50 },
          { x: 122, y: 64 },
          { x: 35, y: 32 },
          { x: 128, y: 88 },
          { x: 22, y: 70 },
          { x: 138, y: 110 },
        ]
      : [];

  return (
    <svg
      viewBox="-10 -20 170 200"
      width={size}
      height={size * 1.2}
      style={{ overflow: "visible" }}
    >
      <g className={shakeClass}>
        {/* head */}
        <circle
          cx="75"
          cy="60"
          r="38"
          fill={faceColor}
          stroke="#1a1a1a"
          strokeWidth="2.5"
          style={{ transition: "fill 0.3s ease" }}
        />

        {/* HAIR — variants */}
        {stage <= 2 && (
          <path
            d="M 50 30 Q 60 22 75 24 Q 90 22 100 30"
            stroke="#1a1a1a"
            strokeWidth="2"
            fill="none"
          />
        )}
        {stage === 3 && (
          <g stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round">
            <line x1="60" y1="22" x2="58" y2="10" />
            <line x1="68" y1="20" x2="68" y2="6" />
            <line x1="75" y1="20" x2="75" y2="4" />
            <line x1="82" y1="20" x2="82" y2="6" />
            <line x1="90" y1="22" x2="92" y2="10" />
          </g>
        )}
        {stage === 4 && (
          <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
            <line x1="55" y1="28" x2="42" y2="8" />
            <line x1="63" y1="22" x2="58" y2="2" />
            <line x1="72" y1="20" x2="70" y2="-4" />
            <line x1="78" y1="20" x2="80" y2="-4" />
            <line x1="87" y1="22" x2="92" y2="2" />
            <line x1="95" y1="28" x2="108" y2="8" />
          </g>
        )}
        {stage === 5 && (
          <g stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round">
            <line x1="48" y1="32" x2="32" y2="6" />
            <line x1="58" y1="24" x2="48" y2="-2" />
            <line x1="66" y1="22" x2="62" y2="-8" />
            <line x1="73" y1="20" x2="73" y2="-12" />
            <line x1="80" y1="20" x2="84" y2="-10" />
            <line x1="89" y1="22" x2="98" y2="-6" />
            <line x1="98" y1="24" x2="115" y2="0" />
            <line x1="103" y1="32" x2="120" y2="10" />
          </g>
        )}

        {/* EYEBROWS — variants */}
        {stage === 0 && (
          <>
            <line
              x1="50"
              y1="48"
              x2="68"
              y2="46"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="48"
              x2="82"
              y2="46"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
          </>
        )}
        {stage === 1 && (
          <>
            <line
              x1="50"
              y1="44"
              x2="68"
              y2="40"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="44"
              x2="82"
              y2="40"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
          </>
        )}
        {stage === 2 && (
          <>
            <line
              x1="48"
              y1="40"
              x2="68"
              y2="36"
              stroke="#1a1a1a"
              strokeWidth="2.5"
            />
            <line
              x1="102"
              y1="40"
              x2="82"
              y2="36"
              stroke="#1a1a1a"
              strokeWidth="2.5"
            />
          </>
        )}
        {stage === 3 && (
          <>
            <path
              d="M 46 38 Q 58 28 70 36"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 104 38 Q 92 28 80 36"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
            />
          </>
        )}
        {stage === 4 && (
          <>
            <path
              d="M 44 36 Q 56 22 70 34"
              stroke="#1a1a1a"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M 106 36 Q 94 22 80 34"
              stroke="#1a1a1a"
              strokeWidth="3"
              fill="none"
            />
          </>
        )}
        {stage === 5 && (
          <>
            <path
              d="M 44 38 L 70 36"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 106 38 L 80 36"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
            />
          </>
        )}

        {/* GLASSES — disappear at stage 5 */}
        {stage <= 4 && (
          <>
            <circle
              cx="60"
              cy="58"
              r="9"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            <circle
              cx="90"
              cy="58"
              r="9"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            <line
              x1="69"
              y1="58"
              x2="81"
              y2="58"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
          </>
        )}

        {/* EYES — variants */}
        {stage === 0 && (
          <>
            <circle cx="60" cy="58" r="2" fill="#1a1a1a" />
            <circle cx="90" cy="58" r="2" fill="#1a1a1a" />
          </>
        )}
        {stage === 1 && (
          <>
            <circle cx="60" cy="58" r="3" fill="#1a1a1a" />
            <circle cx="90" cy="58" r="3" fill="#1a1a1a" />
          </>
        )}
        {stage === 2 && (
          <>
            <circle
              cx="60"
              cy="58"
              r="6"
              fill="white"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <circle cx="60" cy="58" r="2" fill="#1a1a1a" />
            <circle
              cx="90"
              cy="58"
              r="6"
              fill="white"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <circle cx="90" cy="58" r="2" fill="#1a1a1a" />
          </>
        )}
        {stage === 3 && (
          <>
            <circle
              cx="60"
              cy="58"
              r="7"
              fill="white"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <circle cx="60" cy="58" r="1.3" fill="#1a1a1a" />
            <circle
              cx="90"
              cy="58"
              r="7"
              fill="white"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <circle cx="90" cy="58" r="1.3" fill="#1a1a1a" />
          </>
        )}
        {stage === 4 && (
          <>
            {/* Star eyes */}
            <text
              x="60"
              y="64"
              fontSize="18"
              textAnchor="middle"
              fill="#FF3B30"
              fontWeight="900"
            >
              ★
            </text>
            <text
              x="90"
              y="64"
              fontSize="18"
              textAnchor="middle"
              fill="#FF3B30"
              fontWeight="900"
            >
              ★
            </text>
          </>
        )}
        {stage === 5 && (
          <>
            {/* X eyes */}
            <line
              x1="55"
              y1="53"
              x2="65"
              y2="63"
              stroke="#1a1a1a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="65"
              y1="53"
              x2="55"
              y2="63"
              stroke="#1a1a1a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="85"
              y1="53"
              x2="95"
              y2="63"
              stroke="#1a1a1a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="53"
              x2="85"
              y2="63"
              stroke="#1a1a1a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}

        {/* MUSTACHE */}
        <path
          d="M 58 76 Q 75 80 92 76"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />

        {/* MOUTH — variants */}
        {stage === 0 && (
          <path
            d="M 60 84 Q 75 92 90 84"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transition: "d 0.3s" }}
          />
        )}
        {stage === 1 && (
          <ellipse
            cx="75"
            cy="86"
            rx="5"
            ry="6"
            fill="white"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
        )}
        {stage === 2 && (
          <ellipse
            cx="75"
            cy="87"
            rx="8"
            ry="9"
            fill="#1a1a1a"
          />
        )}
        {stage === 3 && (
          <ellipse cx="75" cy="89" rx="9" ry="13" fill="#1a1a1a" />
        )}
        {stage === 4 && (
          <>
            <ellipse cx="75" cy="89" rx="11" ry="15" fill="#1a1a1a" />
            {/* tongue */}
            <ellipse cx="75" cy="100" rx="6" ry="8" fill="#FF6B6B" />
          </>
        )}
        {stage === 5 && (
          <>
            {/* dead mouth */}
            <ellipse cx="75" cy="88" rx="8" ry="10" fill="#1a1a1a" />
            {/* soul wisp escaping upward */}
            <path
              d="M 75 78 Q 70 65 75 50 Q 80 35 75 20"
              fill="none"
              stroke="#aab5c4"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle
              cx="75"
              cy="14"
              r="6"
              fill="#cdd5e0"
              stroke="#aab5c4"
              strokeWidth="1"
            />
            <circle cx="73" cy="13" r="0.8" fill="#1a1a1a" />
            <circle cx="77" cy="13" r="0.8" fill="#1a1a1a" />
            <path
              d="M 70 18 Q 75 22 80 18"
              fill="none"
              stroke="#aab5c4"
              strokeWidth="1"
            />
          </>
        )}

        {/* BODY */}
        <line
          x1="75"
          y1="100"
          x2="75"
          y2="160"
          stroke="#1a1a1a"
          strokeWidth="2.5"
        />
        {/* ARM pointing */}
        <line
          x1="75"
          y1="120"
          x2="125"
          y2="100"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* HAND */}
        <path
          d="M 122 96 L 138 96 L 138 106 L 122 106 Z"
          fill="#F4D7B5"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line
          x1="138"
          y1="100"
          x2="146"
          y2="98"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* MOTION lines (faster as stage rises) */}
        {stage >= 1 && (
          <g
            stroke={stage >= 4 ? "#FF3B30" : stage >= 2 ? "#FF6B5C" : "#1a1a1a"}
            strokeWidth={1.5 + stage * 0.3}
            strokeLinecap="round"
          >
            <line x1="148" y1="86" x2="142" y2="92" />
            <line x1="150" y1="100" x2="142" y2="100" />
            <line x1="148" y1="114" x2="142" y2="108" />
            {stage >= 3 && (
              <>
                <line x1="155" y1="78" x2="148" y2="82" />
                <line x1="155" y1="120" x2="148" y2="116" />
              </>
            )}
          </g>
        )}

        {/* SWEAT DROPS */}
        {sweats.map((s, i) => (
          <path
            key={i}
            d={`M ${s.x} ${s.y - 4} Q ${s.x - 3} ${s.y + 1} ${s.x} ${s.y + 5} Q ${s.x + 3} ${s.y + 1} ${s.x} ${s.y - 4} Z`}
            fill="#5BA9F5"
            stroke="#1a1a1a"
            strokeWidth="0.8"
          />
        ))}
      </g>
    </svg>
  );
}

export default function PpalliGame() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<
    "idle" | "playing" | "fail" | "milestone" | "countdown"
  >("idle");
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const startRef = useRef(0);
  const milestoneShownRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const v = parseInt(saved, 10);
        if (!isNaN(v)) setBest(v);
      }
    } catch {}
  }, []);

  // Round timer
  useEffect(() => {
    if (phase !== "playing") return;
    const total = timeForRound(round);
    startRef.current = performance.now();
    setTimeLeft(total);
    let raf: number | null = null;
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const left = total - elapsed;
      if (left <= 0) {
        setTimeLeft(0);
        setPhase("fail");
        return;
      }
      setTimeLeft(left);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [phase, round]);

  // Update best when fail (final reached round)
  useEffect(() => {
    if (phase !== "fail") return;
    if (best === null || round > best) setBest(round);
  }, [phase, round, best]);

  // Persist best
  useEffect(() => {
    if (best === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(best));
    } catch {}
  }, [best]);

  // Milestone at round 10
  useEffect(() => {
    if (round === 10 && phase === "playing" && !milestoneShownRef.current) {
      milestoneShownRef.current = true;
      setPhase("milestone");
    }
  }, [round, phase]);

  // Countdown 3 → 2 → 1 → resume playing
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(3);
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          setPhase("playing");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const start = () => {
    milestoneShownRef.current = false;
    setRound(1);
    setPhase("playing");
  };

  const tap = () => {
    if (phase !== "playing") return;
    setRound((r) => r + 1);
  };

  const handleShare = async () => {
    const r = phase === "fail" ? round : best ?? round;
    const text = t(
      `나 빨리빨리 ${r}라운드까지 버텼다 → nolza.fun/games/ppalli`,
      `I survived round ${r} of Ppalli Ppalli → nolza.fun/games/ppalli`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const bg = phase === "idle" ? "#ffffff" : bgForRound(round);
  const stage =
    phase === "fail" ? moodStage(round) : phase === "playing" || phase === "milestone" || phase === "countdown" ? moodStage(round) : 0;
  const total = timeForRound(round);
  const ratio = total > 0 ? timeLeft / total : 0;

  /* ── IDLE / start screen ── */
  if (phase === "idle") {
    return (
      <main
        className="page-in min-h-screen"
        style={{
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          fontFamily: "var(--font-noto-sans-kr)",
        }}
      >
        <Link
          href="/"
          className="back-arrow"
          aria-label="home"
          style={{ color: "#888" }}
        >
          ←
        </Link>
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <Grandfather stage={0} size={180} />
          <div
            className="text-center"
            style={{
              marginTop: 32,
              fontSize: 56,
              fontWeight: 900,
              color: "#FF3B30",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {t("빨리빨리!", "Ppalli Ppalli!")}
          </div>
          <div
            className="text-center"
            style={{
              marginTop: 8,
              fontSize: 16,
              color: "#888",
              letterSpacing: "0.2em",
              fontFamily: "var(--font-inter)",
            }}
          >
            {t("PPALLI PPALLI!", "(quick quick!)")}
          </div>
          <p
            className="text-center"
            style={{
              marginTop: 24,
              fontSize: 15,
              color: "#888",
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            {t(
              "제한 시간 안에 버튼을 눌러야 합니다.",
              "Tap the button within the time limit.",
            )}
            <br />
            {t(
              "라운드가 올라갈수록 시간이 짧아져요.",
              "Each round gives you less time.",
            )}
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-10 rounded-full"
            style={{
              background: "#FF3B30",
              color: "white",
              padding: "14px 44px",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.25em",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(255,59,48,0.25)",
            }}
          >
            {t("시작", "START")} ▸
          </button>

          {best !== null && (
            <>
              <div
                className="tabular-nums mt-10"
                style={{
                  fontSize: 13,
                  color: "#bbb",
                  letterSpacing: "0.15em",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {t("최고 기록 · 라운드", "BEST · ROUND")} {best}
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="mt-3 rounded-full"
                style={{
                  background: "transparent",
                  border: "1px solid #ddd",
                  color: "#888",
                  padding: "8px 22px",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {copied ? t("✓ 복사됨", "✓ Copied") : t("📋 공유하기", "📋 Share")}
              </button>
            </>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-6 pb-12">
          <AdBottom />
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  /* ── PLAYING / FAIL / MILESTONE / COUNTDOWN ── */
  return (
    <main
      className="page-in min-h-screen"
      style={{
        backgroundColor: bg,
        color: "#1a1a1a",
        fontFamily: "var(--font-noto-sans-kr)",
        transition: "background-color 0.3s ease",
      }}
    >
      <Link
        href="/"
        className="back-arrow"
        aria-label="home"
        style={{ color: "#888" }}
      >
        ←
      </Link>
      {phase === "fail" && <div className="ppalli-fail-flash" />}

      {/* Top: round + timer bar (hidden on fail) */}
      {phase !== "fail" && (
        <div className="fixed left-0 right-0 top-0 z-30">
          <div
            style={{
              height: 4,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="h-full transition-none"
              style={{
                width: `${ratio * 100}%`,
                backgroundColor:
                  ratio > 0.5 ? "#34C759" : ratio > 0.25 ? "#FF9F0A" : "#FF3B30",
              }}
            />
          </div>
          <div
            className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4"
            style={{ fontSize: 13, color: "#888", letterSpacing: "0.2em" }}
          >
            <span style={{ fontFamily: "var(--font-inter)", textTransform: "uppercase" }}>
              {t("라운드", "Round")} {round}
            </span>
            <span
              className="tabular-nums"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {(timeLeft / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        {phase !== "fail" ? (
          <>
            <Grandfather stage={stage} size={140} />
            <div
              className="text-center"
              style={{
                marginTop: 24,
                fontSize: shoutSize(round),
                fontWeight: 900,
                color: shoutColor(round),
                letterSpacing: "-0.04em",
                lineHeight: 1,
                transition: "all 0.2s ease",
              }}
            >
              {t("빨리빨리!", "Ppalli Ppalli!")}
            </div>
            <button
              type="button"
              onPointerDown={tap}
              className="mt-12 rounded-full"
              style={{
                background: "#1a1a1a",
                color: "white",
                padding: "32px 64px",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                touchAction: "manipulation",
                userSelect: "none",
              }}
            >
              {t("탭!", "TAP")}
            </button>
          </>
        ) : (
          /* FAIL screen — no auto-restart, share + restart buttons */
          <div className="text-center fade-in" style={{ maxWidth: 360 }}>
            <Grandfather stage={5} size={140} />
            <div
              style={{
                marginTop: 24,
                fontSize: 32,
                fontWeight: 800,
                color: "#FF3B30",
                lineHeight: 1.2,
              }}
            >
              {t("너무 느려요!", "Too slow!")}
            </div>
            <div
              className="tabular-nums"
              style={{
                marginTop: 16,
                fontSize: 18,
                color: "#1a1a1a",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: 36, color: "#FF3B30", fontWeight: 900 }}>
                {round}
              </span>
              <span style={{ marginLeft: 6 }}>{t("라운드까지 버텼습니다", "rounds survived")}</span>
            </div>
            {best !== null && best === round && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#888",
                  letterSpacing: "0.2em",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {t("신기록 🏆", "NEW BEST 🏆")}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={start}
                className="rounded-full"
                style={{
                  background: "#1a1a1a",
                  color: "white",
                  padding: "12px 32px",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                }}
              >
                ↻ {t("다시 시작", "Restart")}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full"
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  color: "#666",
                  padding: "12px 32px",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                }}
              >
                {copied ? t("✓ 복사됨", "✓ Copied") : t("📋 공유하기", "📋 Share")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Milestone overlay — paused, waits for user */}
      {phase === "milestone" && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="text-center">
            <div style={{ fontSize: 64 }}>🇰🇷</div>
            <h2
              style={{
                marginTop: 24,
                fontSize: 32,
                fontWeight: 800,
                color: "#1a1a1a",
                lineHeight: 1.3,
              }}
            >
              {t("당신은 진정한 한국인입니다 🇰🇷", "You're a true Korean 🇰🇷")}
            </h2>
            <div
              style={{
                marginTop: 12,
                fontSize: 15,
                color: "#888",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-inter)",
              }}
            >
              {t("10라운드 달성", "ROUND 10 ACHIEVED")}
            </div>
            <button
              type="button"
              onClick={() => setPhase("countdown")}
              className="mt-10 rounded-full"
              style={{
                background: "#FF3B30",
                color: "white",
                padding: "14px 40px",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.25em",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(255,59,48,0.25)",
              }}
            >
              {t("계속하기", "CONTINUE")} ▸
            </button>
          </div>
        </div>
      )}

      {/* Countdown overlay — 3..2..1 then resume */}
      {phase === "countdown" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            key={countdown}
            className="number-bump tabular-nums text-center"
            style={{
              fontSize: 200,
              fontWeight: 200,
              color: "#FF3B30",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-inter)",
            }}
          >
            {countdown}
          </div>
        </div>
      )}
      <AdMobileSticky />
    </main>
  );
}
