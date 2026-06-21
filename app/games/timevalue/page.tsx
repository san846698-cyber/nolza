"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";

const HOURS_PER_YEAR = 2080;

function fmtKRW(n: number, locale: SimpleLocale): string {
  if (locale === "ko") {
    if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(2)}억`;
    if (n >= 10_000) return `${Math.floor(n / 10_000).toLocaleString("ko-KR")}만`;
    return `${Math.round(n).toLocaleString("ko-KR")}`;
  }
  // English: show full won amount with thousands separators.
  return `${Math.round(n).toLocaleString("en-US")}`;
}

export default function TimeValueGame() {
  const { t, locale } = useLocale();
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
    const text = t(
      `내 시간 가치: 시급 ${fmtKRW(stats.perHour, "ko")}원 (분당 ${fmtKRW(stats.perMin, "ko")}원) → nolza.fun/games/timevalue`,
      `My time is worth: ₩${fmtKRW(stats.perHour, "en")}/hour (₩${fmtKRW(stats.perMin, "en")}/min) → nolza.fun/games/timevalue`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const activities = [
    { label: t("유튜브 1시간", "1 hour of YouTube"), hours: 1 },
    { label: t("잠 8시간", "8 hours of sleep"), hours: 8 },
    { label: t("출퇴근 왕복 2시간", "2 hour round-trip commute"), hours: 2 },
    { label: t("회식 3시간", "3 hour work dinner"), hours: 3 },
    { label: t("주말 8시간 게임", "8 hours of weekend gaming"), hours: 8 },
  ];

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {locale === "ko" ? (
              <>
                내 시간의 <span className="text-accent">가치</span>는?
              </>
            ) : (
              <>
                What is your time <span className="text-accent">worth</span>?
              </>
            )}
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "연봉 기준 시간당 가치를 계산합니다. (연 2,080시간 근무 가정)",
              "Calculate your hourly worth from your salary. (Assuming 2,080 working hours a year)",
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <label className="text-sm font-medium text-gray-300">{t("연봉", "Annual salary")}</label>
          <div className="mt-2 text-3xl font-black tabular-nums text-accent md:text-4xl">
            {t(`${fmtKRW(annual, "ko")}원`, `₩${fmtKRW(annual, "en")}`)}
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
            <span>{t("2천만", "₩20M")}</span>
            <span>{t("5억", "₩500M")}</span>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: t("초당", "Per second"), v: stats.perSec },
            { label: t("분당", "Per minute"), v: stats.perMin },
            { label: t("시간당", "Per hour"), v: stats.perHour },
            { label: t("하루(8h)", "Per day (8h)"), v: stats.perDay },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="mt-2 text-lg font-black tabular-nums">
                {t(`${fmtKRW(s.v, "ko")}원`, `₩${fmtKRW(s.v, "en")}`)}
              </div>
            </div>
          ))}
        </section>

        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8">
          <div className="text-xs text-accent">{t("📺 이 페이지에 머문 시간", "📺 Time spent on this page")}</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-black tabular-nums md:text-4xl">
              {t(`${Math.floor(sessionSec)}초`, `${Math.floor(sessionSec)}s`)}
            </span>
            <span className="text-base text-gray-400">{t("동안", "and you")}</span>
            <span className="text-2xl font-black tabular-nums text-accent md:text-3xl">
              {t(`${fmtKRW(sessionLost, "ko")}원`, `₩${fmtKRW(sessionLost, "en")}`)}
            </span>
            <span className="text-sm text-gray-400">{t("잃었어요", "lost")}</span>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">{t("활동별 손실 환산", "Cost of common activities")}</div>
          <ul className="mt-3 space-y-2">
            {activities.map((a) => (
              <li key={a.label} className="flex items-baseline justify-between rounded-lg bg-bg px-4 py-3">
                <span className="text-sm">{a.label}</span>
                <span className="text-base font-bold tabular-nums text-accent">
                  {t(`${fmtKRW(a.hours * stats.perHour, "ko")}원`, `₩${fmtKRW(a.hours * stats.perHour, "en")}`)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex justify-center">
          <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
            {copied ? t("✓ 복사됐어요", "✓ COPIED") : t("📋 친구에게 공유하기", "📋 Share with friends")}
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
