"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const AGE_EVENTS = [
  { age: 14, event: "법정 SNS 가입 가능 (카카오톡 등)" },
  { age: 17, event: "운전면허 시험 응시 (오토)" },
  { age: 18, event: "선거권 (대통령·국회의원)" },
  { age: 19, event: "술·담배 가능, 청소년 보호법 해제" },
  { age: 20, event: "본격 성인 (만 20세 = 한국 21살)" },
  { age: 25, event: "남성 군 입대 마지노선 (대학원 진학 등 변수)" },
  { age: 30, event: "청년 정책 일부 종료 (만 19~34세 등)" },
  { age: 35, event: "청년 주택 청약 가점 등 변동" },
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
    const text = `만 ${ages.manAge}세 / 한국 ${ages.koreanAge}살 / 연 ${ages.yeonAge}세 → nolza.fun/games/koreanage`;
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
          {submitted && (
            <button type="button" onClick={() => { setSubmitted(null); setBirthInput(""); }} className="text-xs text-gray-400 hover:text-accent">
              다시 입력
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            한국 나이 vs <span className="text-accent">만 나이</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            2023년 6월부터 법적 나이는 만 나이로 통일됐어요.
          </p>
        </header>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <label htmlFor="birth" className="block text-sm font-medium text-gray-300">
              생년월일
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
              계산하기 →
            </button>
          </form>
        ) : (
          ages && (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
                  <div className="text-xs text-accent">만 나이 (현재 법정)</div>
                  <div className="mt-2 text-5xl font-black tabular-nums md:text-6xl">
                    {ages.manAge}세
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="text-xs text-gray-500">한국 나이 (세는 나이)</div>
                  <div className="mt-2 text-4xl font-black tabular-nums md:text-5xl">
                    {ages.koreanAge}살
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="text-xs text-gray-500">연 나이</div>
                  <div className="mt-2 text-4xl font-black tabular-nums md:text-5xl">
                    {ages.yeonAge}세
                  </div>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="text-xs text-gray-500">2023 만 나이 통일법이란?</div>
                <p className="mt-2 text-base text-gray-300">
                  2023년 6월 28일부터 행정·민사상 나이는 모두 만 나이로 계산합니다.
                  옛 한국식 \"세는 나이\"는 일상에서만 쓰는 표현이 됐어요.
                </p>
                <button
                  type="button"
                  onClick={() => setShowExpat((s) => !s)}
                  className="mt-4 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                >
                  {showExpat ? "닫기" : "🌏 외국인 친구한테 설명하기"}
                </button>
                {showExpat && (
                  <div className="mt-3 rounded-xl bg-bg p-4 text-sm text-gray-300">
                    Korean age system: when you&apos;re born you&apos;re already 1 year old, and everyone gets +1 on Jan 1st. So a baby born in December is &quot;2 years old&quot; on the next Jan 1.
                    Since 2023, official age is the international standard.
                  </div>
                )}
              </section>

              <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="text-xs text-gray-500">나이별로 달라지는 것들</div>
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
                        <span className="text-lg font-bold tabular-nums">만 {e.age}세</span>
                        <span className="text-sm text-gray-300">{e.event}</span>
                        {reached && <span className="ml-auto text-xs text-accent">✓ 도달</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className="mt-8 flex justify-center">
                <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                  {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
                </button>
              </div>
            </>
          )
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
