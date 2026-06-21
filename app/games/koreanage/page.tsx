"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

const AGE_EVENTS: { age: number; event: { ko: string; en: string } }[] = [
  { age: 14, event: { ko: "법정 SNS 가입 가능 (카카오톡 등)", en: "Legal minimum age to sign up for social media (KakaoTalk, etc.)" } },
  { age: 17, event: { ko: "운전면허 시험 응시 (오토)", en: "Eligible to take the driver's license test (automatic)" } },
  { age: 18, event: { ko: "선거권 (대통령·국회의원)", en: "Voting rights (president and National Assembly)" } },
  { age: 19, event: { ko: "술·담배 가능, 청소년 보호법 해제", en: "Alcohol and tobacco allowed; no longer covered by the Youth Protection Act" } },
  { age: 20, event: { ko: "본격 성인 (만 20세 = 한국 21살)", en: "Fully an adult (age 20 international = 21 Korean)" } },
  { age: 25, event: { ko: "남성 군 입대 마지노선 (대학원 진학 등 변수)", en: "Latest typical age for men's military enlistment (grad school and other factors apply)" } },
  { age: 30, event: { ko: "청년 정책 일부 종료 (만 19~34세 등)", en: "Some youth benefit programs end (typically ages 19–34)" } },
  { age: 35, event: { ko: "청년 주택 청약 가점 등 변동", en: "Changes to youth housing-subscription points and similar perks" } },
];

function calculate(birth: Date) {
  const now = new Date();
  const yearDiff = now.getFullYear() - birth.getFullYear();
  const passedBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  const manAge = passedBirthday ? yearDiff : yearDiff - 1;
  const yeonAge = yearDiff;
  const koreanAge = yeonAge + 1;
  return { manAge, yeonAge, koreanAge };
}

export default function KoreanAgeGame() {
  const { t } = useLocale();
  const [birthInput, setBirthInput] = useState("");
  const [submitted, setSubmitted] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [showExpat, setShowExpat] = useState(false);

  const ages = useMemo(
    () => (submitted ? calculate(submitted) : null),
    [submitted],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthInput) return;
    const d = new Date(birthInput);
    if (isNaN(d.getTime())) return;
    setSubmitted(d);
  };

  const handleShare = async () => {
    if (!ages) return;
    const text = t(
      `만 ${ages.manAge}세 / 한국 ${ages.koreanAge}살 / 연 ${ages.yeonAge}세 → nolza.fun/games/koreanage`,
      `International age ${ages.manAge} / Korean age ${ages.koreanAge} / year age ${ages.yeonAge} → nolza.fun/games/koreanage`,
    );
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
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
          {submitted && (
            <button type="button" onClick={() => { setSubmitted(null); setBirthInput(""); }} className="text-xs text-gray-400 hover:text-accent">
              {t("다시 입력", "Enter again")}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("한국 나이 vs ", "Korean age vs ")}
            <span className="text-accent">{t("만 나이", "international age")}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "2023년 6월부터 법적 나이는 만 나이로 통일됐어요.",
              "Since June 2023, the official legal age in Korea has been standardized to international age.",
            )}
          </p>
        </header>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <label htmlFor="birth" className="block text-sm font-medium text-gray-300">
              {t("생년월일", "Date of birth")}
            </label>
            <input
              id="birth"
              type="date"
              value={birthInput}
              onChange={(e) => setBirthInput(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="mt-3 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-white outline-none focus:border-accent"
              required
            />
            <button type="submit" disabled={!birthInput} className="mt-5 w-full rounded-lg bg-accent py-3 text-base font-bold text-white hover:opacity-90 disabled:opacity-30">
              {t("계산하기 →", "Calculate →")}
            </button>
          </form>
        ) : (
          ages && (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
                  <div className="text-xs text-accent">{t("만 나이 (현재 법정)", "International age (current legal)")}</div>
                  <div className="mt-2 text-5xl font-black tabular-nums md:text-6xl">
                    {t(`${ages.manAge}세`, `${ages.manAge}`)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="text-xs text-gray-500">{t("한국 나이 (세는 나이)", "Korean age (counting age)")}</div>
                  <div className="mt-2 text-4xl font-black tabular-nums md:text-5xl">
                    {t(`${ages.koreanAge}살`, `${ages.koreanAge}`)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="text-xs text-gray-500">{t("연 나이", "Year age")}</div>
                  <div className="mt-2 text-4xl font-black tabular-nums md:text-5xl">
                    {t(`${ages.yeonAge}세`, `${ages.yeonAge}`)}
                  </div>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="text-xs text-gray-500">{t("2023 만 나이 통일법이란?", "What is the 2023 standardized-age law?")}</div>
                <p className="mt-2 text-base text-gray-300">
                  {t(
                    "2023년 6월 28일부터 행정·민사상 나이는 모두 만 나이로 계산합니다. 옛 한국식 \"세는 나이\"는 일상에서만 쓰는 표현이 됐어요.",
                    "Since June 28, 2023, all administrative and civil ages in Korea are counted as international age. The old Korean \"counting age\" is now only used casually in everyday life.",
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setShowExpat((s) => !s)}
                  className="mt-4 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                >
                  {showExpat ? t("닫기", "Close") : t("🌏 외국인 친구한테 설명하기", "🌏 Explain it to a foreign friend")}
                </button>
                {showExpat && (
                  <div className="mt-3 rounded-xl bg-bg p-4 text-sm text-gray-300">
                    Korean age system: when you&apos;re born you&apos;re already 1 year old, and everyone gets +1 on Jan 1st. So a baby born in December is &quot;2 years old&quot; on the next Jan 1.
                    Since 2023, official age is the international standard.
                  </div>
                )}
              </section>

              <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="text-xs text-gray-500">{t("나이별로 달라지는 것들", "What changes at each age")}</div>
                <ul className="mt-3 space-y-2">
                  {AGE_EVENTS.map((e) => {
                    const reached = ages.manAge >= e.age;
                    return (
                      <li
                        key={e.age}
                        className={`flex items-baseline gap-3 rounded-lg border px-4 py-3 ${
                          reached ? "border-accent/40 bg-accent/5" : "border-border bg-bg opacity-60"
                        }`}
                      >
                        <span className="text-lg font-bold tabular-nums">{t(`만 ${e.age}세`, `Age ${e.age}`)}</span>
                        <span className="text-sm text-gray-300">{t(e.event.ko, e.event.en)}</span>
                        {reached && <span className="ml-auto text-xs text-accent">{t("✓ 도달", "✓ Reached")}</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className="mt-8 flex justify-center">
                <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                  {copied ? t("✓ 복사됐어요", "✓ Copied") : t("📋 친구에게 공유하기", "📋 Share with a friend")}
                </button>
              </div>
            </>
          )
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
