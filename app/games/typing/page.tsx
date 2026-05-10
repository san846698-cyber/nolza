"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const SENTENCES = [
  "동해 물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세.",
  "나는 자랑스러운 태극기 앞에 자유롭고 정의로운 대한민국의 무궁한 영광을 위하여 충성을 다할 것을 다짐합니다.",
  "꿈은 이루어진다. 오늘 걷지 않으면 내일은 뛰어야 한다.",
  "한국 사람의 정은 어디서나 통한다. 시작이 반이다.",
  "백문이 불여일견이라는 말이 있다. 고생 끝에 낙이 온다.",
  "행복은 마음의 상태에 달려있다. 모든 것은 마음먹기에 달렸다.",
  "사람이 온다는 건 실은 어마어마한 일이다. 그의 일생이 오기 때문이다.",
  "흔들리지 않고 피는 꽃이 어디 있으랴. 흔들리면서 피는 것이 꽃이다.",
];

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const KOREAN_AVERAGE = 300;

function strokeCount(s: string): number {
  let count = 0;
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      const jong = (code - HANGUL_BASE) % 28;
      count += jong === 0 ? 2 : 3;
    } else {
      count += 1;
    }
  }
  return count;
}

function getGrade(kpm: number): { tier: string; tone: string } {
  if (kpm >= 500) return { tier: "프로 타이피스트 ⌨️", tone: "text-accent" };
  if (kpm >= 400) return { tier: "빠름! 👏", tone: "text-emerald-400" };
  if (kpm >= 300) return { tier: "평균 이상 👍", tone: "text-yellow-300" };
  if (kpm >= 200) return { tier: "보통 🙂", tone: "text-gray-300" };
  return { tier: "조금 더 연습! 📚", tone: "text-orange-400" };
}

function buildTarget(): string {
  const arr = [SENTENCES[Math.floor(Math.random() * SENTENCES.length)]];
  for (let i = 0; i < 5; i++) {
    arr.push(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  }
  return arr.join(" ");
}

export default function TypingGame() {
  const [mode, setMode] = useState<30 | 60>(60);
  const [target, setTarget] = useState<string>("");
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTarget(buildTarget());
  }, []);

  useEffect(() => {
    if (!startTime || done) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setNow(Date.now());
      if (elapsed >= mode) {
        setDone(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, mode, done]);

  const elapsed = startTime ? (now - startTime) / 1000 : 0;
  const timeLeft = Math.max(0, mode - elapsed);

  const correctChars = useMemo(() => {
    let count = 0;
    const targetChars = Array.from(target);
    const typedChars = Array.from(typed);
    for (let i = 0; i < typedChars.length && i < targetChars.length; i++) {
      if (typedChars[i] === targetChars[i]) count++;
    }
    return count;
  }, [typed, target]);

  const typedLen = Array.from(typed).length;
  const accuracy = typedLen === 0 ? 100 : (correctChars / typedLen) * 100;
  const minutes = Math.max(elapsed / 60, 1 / 60);
  const kpm = Math.floor(strokeCount(typed) / minutes);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (done) return;
    const v = e.target.value;
    if (startTime === null) setStartTime(Date.now());
    setTyped(v);
  };

  const reset = (newMode?: 30 | 60) => {
    setTyped("");
    setStartTime(null);
    setDone(false);
    setNow(Date.now());
    setTarget(buildTarget());
    if (newMode) setMode(newMode);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleShare = async () => {
    const text = `내 타자속도 ${kpm}타 (정확도 ${accuracy.toFixed(1)}%) → nolza.fun/games/typing`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const targetChars = Array.from(target);
  const typedChars = Array.from(typed);
  const visibleEnd = Math.min(targetChars.length, typedChars.length + 80);

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <div className="text-xs tabular-nums text-gray-500">
            <span className="font-medium text-white">{Math.ceil(timeLeft)}</span>
            <span className="ml-1">초</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-6">
          <h1 className="text-3xl font-black md:text-5xl">
            한국어 <span className="text-accent">타자속도</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            아래 문장을 빠르고 정확하게 따라 쳐보세요.
          </p>
        </header>

        <div className="mb-5 inline-flex rounded-full border border-border bg-card p-1 text-sm">
          {([30, 60] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => reset(m)}
              className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                mode === m ? "bg-accent text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {m}초
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="break-keep font-mono text-lg leading-relaxed md:text-xl">
            {targetChars.slice(0, visibleEnd).map((c, i) => {
              let cls = "text-gray-500";
              if (i < typedChars.length) {
                cls =
                  typedChars[i] === c
                    ? "text-white"
                    : "text-accent bg-accent/20 rounded";
              } else if (i === typedChars.length) {
                cls = "text-white border-l-2 border-accent animate-pulse";
              }
              return (
                <span key={i} className={cls}>
                  {c}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={onChange}
            disabled={done}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder="여기에 따라 입력하세요..."
            className="mt-6 w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-base text-white outline-none transition-colors focus:border-accent disabled:opacity-50"
          />

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-500">타수 (KPM)</div>
              <div className="mt-1 text-2xl font-black tabular-nums text-accent">
                {kpm}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">정확도</div>
              <div className="mt-1 text-2xl font-black tabular-nums">
                {accuracy.toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">남은 시간</div>
              <div className="mt-1 text-2xl font-black tabular-nums">
                {Math.ceil(timeLeft)}s
              </div>
            </div>
          </div>
        </div>

        {done && (
          <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8">
            <div className="text-xs text-accent">결과</div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-5xl font-black tabular-nums md:text-6xl">{kpm}</span>
              <span className="text-2xl text-gray-500">타</span>
            </div>
            <div className={`mt-2 text-lg font-bold md:text-2xl ${getGrade(kpm).tone}`}>
              {getGrade(kpm).tier}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              한국인 평균 {KOREAN_AVERAGE}타 / 정확도 {accuracy.toFixed(1)}%
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                ↻ 다시 도전
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent"
          >
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
