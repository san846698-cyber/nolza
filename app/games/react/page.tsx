"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

const TRIALS = 5;
const KOREAN_AVG = 250;

type Phase = "idle" | "waiting" | "go" | "tooEarly" | "showResult" | "done";

function getGrade(avg: number, t: (k: string, e: string) => string): { tier: string; tone: string } {
  if (avg < 180) return { tier: t("사람 아니에요?", "Are you human?"), tone: "#FFD60A" };
  if (avg < 220) return { tier: t("프로게이머급 👾", "Pro gamer level 👾"), tone: "#00FF88" };
  if (avg < 260) return { tier: t("평균 이상", "Above average"), tone: "#34C759" };
  if (avg < 320) return { tier: t("평균", "Average"), tone: "#fff" };
  return { tier: t("조금 느려요", "A bit slow"), tone: "#FF9F0A" };
}

export default function ReactGame() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const startRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTrial = () => {
    setPhase("waiting");
    setLast(null);
    const delay = 1200 + Math.random() * 2800;
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  };

  // Critical: pointerdown fires the moment of press — not after release.
  const press = () => {
    if (phase === "done") return;
    if (phase === "idle" || phase === "showResult" || phase === "tooEarly") {
      if (times.length >= TRIALS) return;
      startTrial();
      return;
    }
    if (phase === "waiting") {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      setPhase("tooEarly");
      return;
    }
    if (phase === "go") {
      const reaction = Math.round(performance.now() - startRef.current);
      const next = [...times, reaction];
      setLast(reaction);
      setTimes(next);
      if (next.length >= TRIALS) setPhase("done");
      else setPhase("showResult");
    }
  };

  const reset = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    setTimes([]);
    setLast(null);
    setPhase("idle");
  };

  const avg =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;
  const grade = avg > 0 ? getGrade(avg, t) : null;

  // Color & content per phase
  let bg = "#fafafa";
  let fg = "#0a0a0a";
  let mainText = "";
  let subText = "";
  let mainSize = 96;

  if (phase === "idle") {
    bg = "#fafafa"; fg = "#0a0a0a";
    mainText = "TAP";
    subText = t("준비되면 화면 어디든 누르세요", "Tap anywhere when ready");
    mainSize = 120;
  } else if (phase === "waiting") {
    bg = "#FF3B30"; fg = "#fff";
    mainText = t("기다리세요...", "Wait...");
    subText = t("초록색이 되는 순간 누르세요", "Tap the moment it turns green");
    mainSize = 88;
  } else if (phase === "go") {
    bg = "#00FF88"; fg = "#0a0a0a";
    mainText = t("지금!", "NOW!");
    subText = "";
    mainSize = 200;
  } else if (phase === "tooEarly") {
    bg = "#1a0000"; fg = "#FF3B30";
    mainText = t("너무 빨랐어요", "Too early!");
    subText = t("다시 누르면 시작합니다", "Tap to restart");
    mainSize = 72;
  } else if (phase === "showResult") {
    bg = "#0a0a0a"; fg = "#fff";
    mainText = `${last}`;
    subText = `${times.length} / ${TRIALS} · ${t("누르면 다음", "tap for next")}`;
    mainSize = 144;
  } else if (phase === "done" && grade) {
    bg = "#0a0a0a"; fg = grade.tone;
    mainText = `${avg}`;
    subText = grade.tier;
    mainSize = 160;
  }

  const showMs = phase === "showResult" || phase === "done";

  return (
    <main
      onPointerDown={press}
      className="page-in relative min-h-screen select-none"
      style={{
        backgroundColor: bg,
        color: fg,
        transition: "background-color 0.08s ease",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        cursor: phase === "done" ? "default" : "pointer",
        touchAction: "manipulation",
      }}
    >
      {/* Back arrow — pointerdown does not bubble to main */}
      <Link
        href="/"
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="home"
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          fontSize: 22,
          color: fg,
          opacity: 0.55,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
      >
        ←
      </Link>
      <div onPointerDown={(e) => e.stopPropagation()}>
      </div>

      {/* Trial counter — top-center to avoid LocaleToggle overlap */}
      <div
        className="pointer-events-none fixed z-50 tabular-nums"
        style={{
          left: "50%",
          top: 22,
          transform: "translateX(-50%)",
          fontSize: 15,
          fontWeight: 700,
          color: fg,
          opacity: 0.5,
          letterSpacing: "0.1em",
        }}
      >
        <span style={{ color: fg }}>{times.length}</span>
        <span style={{ marginLeft: 4 }}>/ {TRIALS}</span>
      </div>

      {/* Main centered content */}
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div
          className="tabular-nums"
          style={{
            fontSize: mainSize,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            transition: "font-size 0.12s ease",
          }}
        >
          {mainText}
          {showMs && (
            <span
              style={{
                fontSize: mainSize * 0.32,
                fontWeight: 700,
                opacity: 0.5,
                marginLeft: 8,
              }}
            >
              ms
            </span>
          )}
        </div>

        {subText && (
          <p
            className="mt-5"
            style={{
              fontSize: 16,
              opacity: phase === "go" ? 0 : 0.75,
              fontWeight: 500,
            }}
          >
            {subText}
          </p>
        )}

        {phase === "done" && grade && (
          <>
            <p
              className="mt-3"
              style={{ fontSize: 15, opacity: 0.45, color: "#fff" }}
            >
              {t("한국인 평균", "Korean average")} {KOREAN_AVG}ms · {t("차이", "diff")}{" "}
              <span style={{ color: avg < KOREAN_AVG ? "#00FF88" : "#FF9F0A" }}>
                {avg < KOREAN_AVG ? "" : "+"}
                {avg - KOREAN_AVG}ms
              </span>
            </p>

            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-14 rounded-full transition-colors"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                padding: "12px 36px",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {t("다시", "AGAIN")}
            </button>
          </>
        )}

        {/* Trial dots — only visible after first trial, hidden in waiting/go */}
        {times.length > 0 &&
          phase !== "waiting" &&
          phase !== "go" &&
          phase !== "done" && (
            <div className="mt-12 flex gap-2 tabular-nums">
              {Array.from({ length: TRIALS }).map((_, i) => {
                const has = i < times.length;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 56,
                      height: 32,
                      fontSize: 13,
                      fontWeight: 700,
                      background: has ? fg : "transparent",
                      color: has ? bg : fg,
                      border: `1px solid ${fg}`,
                      opacity: has ? 0.9 : 0.3,
                    }}
                  >
                    {has ? times[i] : i + 1}
                  </div>
                );
              })}
            </div>
          )}
      </div>
      {phase === "done" && (
        <div className="mx-auto max-w-3xl px-5 pb-12 md:px-8">
          <AdBottom />
        </div>
      )}
      <AdMobileSticky />
    </main>
  );
}
