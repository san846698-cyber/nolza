"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const HOURS_PER_YEAR = 2080;

function fmtKRW(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(2)}억`;
  if (n >= 10_000) return `${Math.floor(n / 10_000).toLocaleString("ko-KR")}만`;
  return `${Math.round(n).toLocaleString("ko-KR")}`;
}

export default function TimeValueGame() {
  const [annual, setAnnual] = useState(50_000_000);
  const [sessionStart] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const perHour = annual / HOURS_PER_YEAR;
    const perMin = perHour / 60;
    const perSec = perMin / 60;
    const perDay = perHour * 8;
    return { perHour, perMin, perSec, perDay };
  }, [annual]);

  const sessionSec = (now - sessionStart) / 1000;
  const sessionLost = sessionSec * stats.perSec;

  const handleShare = async () => {
    const text = `내 시간 가치: 시급 ${fmtKRW(stats.perHour)}원 (분당 ${fmtKRW(stats.perMin)}원) → nolza.fun/games/timevalue`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const activities = [
    { label: "유튜브 1시간", hours: 1 },
    { label: "잠 8시간", hours: 8 },
    { label: "출퇴근 왕복 2시간", hours: 2 },
    { label: "회식 3시간", hours: 3 },
    { label: "주말 8시간 게임", hours: 8 },
  ];

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
            내 시간의 <span className="text-accent">가치</span>는?
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            연봉 기준 시간당 가치를 계산합니다. (연 2,080시간 근무 가정)
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <label className="text-sm font-medium text-gray-300">연봉</label>
          <div className="mt-2 text-3xl font-black tabular-nums text-accent md:text-4xl">
            {fmtKRW(annual)}원
          </div>
          <input
            type="range"
            min={20_000_000}
            max={500_000_000}
            step={1_000_000}
            value={annual}
            onChange={(e) => setAnnual(Number(e.target.value))}
            className="mt-4 w-full accent-[#FF3B30]"
          />
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>2천만</span>
            <span>5억</span>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "초당", v: stats.perSec },
            { label: "분당", v: stats.perMin },
            { label: "시간당", v: stats.perHour },
            { label: "하루(8h)", v: stats.perDay },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="mt-2 text-lg font-black tabular-nums">
                {fmtKRW(s.v)}원
              </div>
            </div>
          ))}
        </section>

        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8">
          <div className="text-xs text-accent">📺 이 페이지에 머문 시간</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-black tabular-nums md:text-4xl">
              {Math.floor(sessionSec)}초
            </span>
            <span className="text-base text-gray-400">동안</span>
            <span className="text-2xl font-black tabular-nums text-accent md:text-3xl">
              {fmtKRW(sessionLost)}원
            </span>
            <span className="text-sm text-gray-400">잃었어요</span>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">활동별 손실 환산</div>
          <ul className="mt-3 space-y-2">
            {activities.map((a) => (
              <li key={a.label} className="flex items-baseline justify-between rounded-lg bg-bg px-4 py-3">
                <span className="text-sm">{a.label}</span>
                <span className="text-base font-bold tabular-nums text-accent">
                  {fmtKRW(a.hours * stats.perHour)}원
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex justify-center">
          <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
            {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
