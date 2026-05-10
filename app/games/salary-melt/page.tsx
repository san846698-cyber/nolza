"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Expense = { ko: string; en: string; pct: number };

const EXPENSES: Expense[] = [
  { ko: "월세", en: "Rent", pct: 0.30 },
  { ko: "카드값", en: "Credit Card", pct: 0.18 },
  { ko: "식비", en: "Food", pct: 0.18 },
  { ko: "세금", en: "Tax", pct: 0.13 },
  { ko: "교통비", en: "Transport", pct: 0.06 },
  { ko: "통신비", en: "Phone", pct: 0.04 },
];

const RESERVED = EXPENSES.reduce((s, e) => s + e.pct, 0);
const COMPRESS = 60;

function fmt(n: number): string {
  return Math.floor(n).toLocaleString("ko-KR");
}

export default function SalaryMelt() {
  const { locale, t } = useLocale();
  const [salary, setSalary] = useState(3_000_000);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [flash, setFlash] = useState(false);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const flashedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed * 1000;
    const tick = () => {
      const e = (performance.now() - startRef.current) / 1000;
      if (e >= COMPRESS) {
        setElapsed(COMPRESS);
        setRunning(false);
        if (!flashedRef.current) {
          setFlash(true);
          flashedRef.current = true;
          setTimeout(() => setFlash(false), 600);
        }
        return;
      }
      setElapsed(e);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  const ratio = Math.min(1, elapsed / COMPRESS);
  const totalSpent = salary * ratio * RESERVED;
  const remaining = Math.max(0, salary - totalSpent);
  const ended = elapsed >= COMPRESS;

  const breakdown = useMemo(() =>
    EXPENSES.map((e) => ({
      ...e,
      remaining: Math.max(0, salary * e.pct - salary * e.pct * ratio),
      perSec: (salary * e.pct) / COMPRESS,
    })),
    [salary, ratio],
  );

  const start = () => { flashedRef.current = false; setElapsed(0); setRunning(true); };
  const reset = () => { setRunning(false); setElapsed(0); flashedRef.current = false; };

  // Color shifts redder as ratio increases
  const remainingColor = useMemo(() => {
    const r = Math.floor(255 - 60 * (1 - ratio));
    return `rgb(${r}, ${Math.floor(60 * (1 - ratio))}, ${Math.floor(60 * (1 - ratio))})`;
  }, [ratio]);

  return (
    <main
      className="relative min-h-screen page-in"
      style={{ backgroundColor: "#1a0000", color: "#fff" }}
    >
      {flash && <div className="red-flash" />}
      <Link href="/" className="back-arrow dark" aria-label={t("홈으로", "Home")}>
        ←
      </Link>
      <div className="mx-auto" style={{ maxWidth: 1000, padding: "64px 32px 0" }}>
        <AdTop />
      </div>

      <div className="mx-auto flex flex-col" style={{ maxWidth: 720, padding: "0 32px 80px", minHeight: "calc(100vh - 200px)" }}>
        <h1
          className="text-center"
          style={{
            fontSize: 14,
            color: "#9a3030",
            letterSpacing: "0.5em",
            fontWeight: 600,
            marginTop: 24,
          }}
        >
          SALARY · MELT
        </h1>

        <div className="mt-14 text-center">
          <div
            style={{
              fontSize: 16,
              color: "#7a2020",
              letterSpacing: "0.2em",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            {t("남은 금액", "Remaining")}
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: ended ? "#FF3B30" : remainingColor,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              transition: "color 0.3s",
            }}
          >
            ₩ {fmt(remaining)}
          </div>
          <div
            className="mt-3"
            style={{
              fontSize: 16,
              color: "#9a3030",
              animation: running ? "pageInLift 0.001s, pop 1s ease-in-out infinite" : undefined,
            }}
          >
            {ended
              ? t("이번 달도 끝났습니다 👋", "Another month gone 👋")
              : running
                ? t("녹는 중...", "Melting...")
                : t("시작하기", "Start")}
          </div>
        </div>

        {!running && !ended && (
          <div className="mt-12 mx-auto w-full" style={{ maxWidth: 420 }}>
            <label
              style={{
                fontSize: 15,
                color: "#7a2020",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {t("월급", "Monthly Salary")}
            </label>
            <div
              className="mt-3 tabular-nums text-center"
              style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}
            >
              ₩ {fmt(salary)}
            </div>
            <input
              type="range"
              min={1_500_000}
              max={20_000_000}
              step={100_000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-4 w-full"
              style={{ accentColor: "#FF3B30" }}
            />
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={start}
                className="btn-press"
                style={{
                  background: "#FF3B30",
                  color: "white",
                  padding: "0 36px",
                  height: 52,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(255,59,48,0.35)",
                }}
              >
                {t("월급 받기 ▸", "RECEIVE SALARY ▸")}
              </button>
            </div>
          </div>
        )}

        {(running || ended) && (
          <ul
            className="mt-12 mx-auto w-full"
            style={{ maxWidth: 560 }}
          >
            {breakdown.map((e) => (
              <li
                key={e.ko}
                className="flex items-center justify-between"
                style={{
                  minHeight: 64,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  color: "#c98080",
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 500 }}>
                  {locale === "ko" ? e.ko : e.en}
                </span>
                <span className="tabular-nums" style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
                    ₩ {fmt(e.remaining)}
                  </span>
                  <span
                    style={{
                      color: "#FF3B30",
                      fontSize: 16,
                    }}
                  >
                    -{fmt(e.perSec)}/s
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {ended && (
          <button
            type="button"
            onClick={reset}
            className="mt-10 mx-auto rounded-full btn-press"
            style={{
              background: "transparent",
              border: "1px solid #5a1010",
              color: "#c98080",
              padding: "12px 32px",
              fontSize: 16,
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            {t("다시", "AGAIN")}
          </button>
        )}
      </div>

      <div className="mx-auto" style={{ maxWidth: 1000, padding: "0 32px 64px" }}>
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
