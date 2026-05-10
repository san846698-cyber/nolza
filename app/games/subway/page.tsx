"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Q = { q: string; options: string[]; answer: number; explanation: string };

const QUESTIONS: Q[] = [
  { q: "강남역은 몇 호선?", options: ["1호선", "2호선", "3호선", "4호선"], answer: 1, explanation: "강남역은 2호선과 신분당선이 지나갑니다." },
  { q: "서울역에서 환승할 수 없는 노선은?", options: ["1호선", "4호선", "공항철도", "2호선"], answer: 3, explanation: "서울역에는 1·4호선, 공항철도, 경의중앙선이 정차하지만 2호선은 없습니다." },
  { q: "홍대입구역이 속한 노선은?", options: ["2호선만", "2·6호선", "2·6호선·공항철도·경의중앙", "1호선"], answer: 2, explanation: "홍대입구역은 4개 노선이 만나는 환승역입니다." },
  { q: "신촌역과 가장 가까운 대학은?", options: ["서울대", "고려대", "연세대", "한양대"], answer: 2, explanation: "지하철 신촌역(2호선)은 연세대 정문에서 도보 거리입니다." },
  { q: "잠실역은 몇 호선?", options: ["2호선만", "8호선만", "2·8호선", "9호선"], answer: 2, explanation: "잠실역은 2호선과 8호선의 환승역입니다." },
  { q: "다음 중 환승역이 가장 많은 노선은?", options: ["1호선", "2호선", "3호선", "9호선"], answer: 1, explanation: "2호선(순환선)은 거의 모든 도심 노선과 환승됩니다." },
  { q: "서울 지하철 1호선이 개통된 해는?", options: ["1969년", "1974년", "1980년", "1988년"], answer: 1, explanation: "1974년 8월 15일 광복절에 개통되었습니다." },
  { q: "서울 지하철에서 가장 깊은 역은?", options: ["산본역", "버티고개역", "고속터미널역", "녹사평역"], answer: 1, explanation: "버티고개역(6호선)이 약 49m로 가장 깊습니다." },
  { q: "공항철도가 연결하는 두 공항은?", options: ["인천·김포", "인천·제주", "김포·김해", "인천·청주"], answer: 0, explanation: "공항철도(AREX)는 서울역-김포공항-인천공항을 연결합니다." },
  { q: "9호선의 별명은?", options: ["황금노선", "급행지옥", "한강선", "올림픽선"], answer: 1, explanation: "출퇴근 시간 9호선 급행은 \"급행지옥\"으로 유명합니다." },
  { q: "다음 중 서울 지하철 노선이 아닌 것은?", options: ["우이신설선", "신림선", "동탄선", "분당선"], answer: 2, explanation: "동탄선은 수도권광역급행철도로 분류됩니다." },
  { q: "이태원역이 속한 노선은?", options: ["3호선", "4호선", "6호선", "7호선"], answer: 2, explanation: "이태원역은 6호선입니다." },
  { q: "여의도역은 몇 호선?", options: ["5호선", "5·9호선", "9호선만", "1호선"], answer: 1, explanation: "여의도역은 5호선과 9호선의 환승역입니다." },
  { q: "건대입구역과 환승되는 노선은?", options: ["2·7호선", "2·5호선", "7·9호선", "2·9호선"], answer: 0, explanation: "건대입구역은 2호선과 7호선이 환승됩니다." },
  { q: "서울 지하철에서 가장 긴 노선은?", options: ["1호선", "5호선", "7호선", "8호선"], answer: 1, explanation: "5호선은 약 52km로 단일노선 중 가장 긴 편입니다." },
];

const TIMER_PER_Q = 12;
const TOTAL_PICKS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(score: number): string {
  if (score === 10) return "🚇 지하철 마스터";
  if (score >= 8) return "💯 서울 토박이";
  if (score >= 6) return "👍 보통 시민";
  if (score >= 4) return "📚 길 잃을 수도";
  return "😅 카카오맵 켜세요";
}

export default function SubwayQuiz() {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_Q);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setQuestions(shuffle(QUESTIONS).slice(0, TOTAL_PICKS));
  }, []);

  useEffect(() => {
    if (selected !== null || done || questions.length === 0) return;
    setTimeLeft(TIMER_PER_Q);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          clearInterval(id);
          setSelected(-1);
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(id);
  }, [idx, selected, done, questions.length]);

  const current = questions[idx];

  const select = (i: number) => {
    if (selected !== null || !current) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    if (idx + 1 >= TOTAL_PICKS) setDone(true);
    else setIdx((i) => i + 1);
  };

  const restart = () => {
    setQuestions(shuffle(QUESTIONS).slice(0, TOTAL_PICKS));
    setIdx(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  const handleShare = async () => {
    const text = `서울 지하철 퀴즈 ${score}/${TOTAL_PICKS}점 (${getGrade(score)}) → nolza.fun/games/subway`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (questions.length === 0) return <main className="min-h-screen bg-bg" />;

  if (done) {
    return (
      <main className="min-h-screen bg-bg pb-32">
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              ← 놀자.fun으로 돌아가기
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">결과</div>
            <div className="mt-3 text-7xl font-black tabular-nums md:text-8xl">
              {score}<span className="text-4xl text-gray-500">/10</span>
            </div>
            <div className="mt-4 text-2xl font-bold md:text-3xl">{getGrade(score)}</div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ 다시 도전
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isCorrect = selected !== null && selected === current.answer;
  const showFeedback = selected !== null;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{idx + 1}</span> / {TOTAL_PICKS}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-6">
          <h1 className="text-3xl font-black md:text-5xl">
            서울 <span className="text-accent">지하철</span> 퀴즈 🚇
          </h1>
        </header>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
          <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${(timeLeft / TIMER_PER_Q) * 100}%` }} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">Q{idx + 1}</div>
          <div className="mt-3 text-xl font-bold leading-relaxed md:text-2xl">
            {current.q}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {current.options.map((opt, i) => {
              let cls = "border-border bg-bg hover:border-accent";
              if (showFeedback) {
                if (i === current.answer) cls = "border-emerald-500 bg-emerald-500/10";
                else if (i === selected) cls = "border-accent bg-accent/10";
                else cls = "border-border bg-bg opacity-60";
              }
              return (
                <button key={i} type="button" onClick={() => select(i)} disabled={showFeedback} className={`rounded-xl border px-4 py-3 text-left text-sm md:text-base ${cls}`}>
                  <span className="mr-3 font-bold text-gray-500">{["A","B","C","D"][i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className={`mt-6 rounded-xl p-4 text-sm md:text-base ${isCorrect ? "bg-emerald-500/10 text-emerald-300" : "bg-accent/10 text-accent"}`}>
              <div className="font-bold">
                {selected === -1 ? "⏰ 시간 초과" : isCorrect ? "✓ 정답!" : "✕ 오답"}
              </div>
              <div className="mt-1 text-gray-300">{current.explanation}</div>
            </div>
          )}
        </div>

        {showFeedback && (
          <button type="button" onClick={next} className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90">
            {idx + 1 >= TOTAL_PICKS ? "결과 보기 →" : "다음 →"}
          </button>
        )}
        <div className="mt-3 text-center text-xs text-gray-500">현재 점수: {score}점</div>
      </div>
    </main>
  );
}
