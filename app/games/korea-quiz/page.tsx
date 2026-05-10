"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Question = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    q: "한강의 총 길이는?",
    options: ["약 314km", "약 514km", "약 714km", "약 914km"],
    answer: 1,
    explanation: "한강의 총 길이는 약 514km입니다.",
  },
  {
    q: "대한민국 국보 1호는?",
    options: ["광화문", "숭례문(남대문)", "경복궁", "흥인지문"],
    answer: 1,
    explanation: "국보 1호는 숭례문입니다.",
  },
  {
    q: "남한에서 가장 높은 산은?",
    options: ["한라산", "지리산", "설악산", "태백산"],
    answer: 0,
    explanation: "한라산(1,947m)이 남한 최고봉입니다.",
  },
  {
    q: "한국의 국화는?",
    options: ["벚꽃", "무궁화", "진달래", "장미"],
    answer: 1,
    explanation: "무궁화는 한국의 국화입니다.",
  },
  {
    q: "한국에서 가장 큰 섬은?",
    options: ["거제도", "강화도", "제주도", "울릉도"],
    answer: 2,
    explanation: "제주도가 한국에서 가장 큰 섬입니다.",
  },
  {
    q: "5만원권 화폐의 인물은?",
    options: ["세종대왕", "이순신", "신사임당", "이황"],
    answer: 2,
    explanation: "5만원권 인물은 신사임당입니다.",
  },
  {
    q: "만원권 화폐의 인물은?",
    options: ["세종대왕", "이순신", "신사임당", "이이"],
    answer: 0,
    explanation: "만원권 인물은 세종대왕입니다.",
  },
  {
    q: "한국전쟁(6.25)이 발발한 해는?",
    options: ["1948년", "1950년", "1952년", "1953년"],
    answer: 1,
    explanation: "1950년 6월 25일에 발발했습니다.",
  },
  {
    q: "광복절은 몇 월 며칠?",
    options: ["3월 1일", "5월 5일", "6월 25일", "8월 15일"],
    answer: 3,
    explanation: "1945년 8월 15일에 광복했습니다.",
  },
  {
    q: "1988년 올림픽이 열린 도시는?",
    options: ["서울", "도쿄", "베이징", "방콕"],
    answer: 0,
    explanation: "1988년 서울 올림픽입니다.",
  },
  {
    q: "한글을 만든 왕은?",
    options: ["태조", "태종", "세종", "성종"],
    answer: 2,
    explanation: "세종대왕이 1443년 훈민정음을 창제했습니다.",
  },
  {
    q: "한국어 자음의 개수는? (기본)",
    options: ["10개", "14개", "20개", "24개"],
    answer: 1,
    explanation: "기본 자음은 14개입니다 (ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ).",
  },
  {
    q: "현재 KBO 리그 팀 수는?",
    options: ["8팀", "9팀", "10팀", "12팀"],
    answer: 2,
    explanation: "현재 KBO는 10개 구단입니다.",
  },
  {
    q: "조선왕조의 창시자는?",
    options: ["왕건", "이성계", "이방원", "정도전"],
    answer: 1,
    explanation: "이성계(태조)가 1392년 조선을 건국했습니다.",
  },
  {
    q: "한국에서 가장 인구가 많은 도시는?",
    options: ["부산", "인천", "대구", "서울"],
    answer: 3,
    explanation: "서울이 약 940만명으로 가장 많습니다.",
  },
  {
    q: "임진왜란이 일어난 해는?",
    options: ["1392년", "1492년", "1592년", "1692년"],
    answer: 2,
    explanation: "1592년에 일어난 7년 전쟁입니다.",
  },
  {
    q: "DDP(동대문디자인플라자)를 설계한 건축가는?",
    options: ["안도 다다오", "자하 하디드", "프랭크 게리", "렘 콜하스"],
    answer: 1,
    explanation: "이라크 출신 건축가 자하 하디드의 작품입니다.",
  },
  {
    q: "다음 중 한국 자동차 회사가 아닌 것은?",
    options: ["제네시스", "혼다", "쌍용", "기아"],
    answer: 1,
    explanation: "혼다는 일본 회사입니다.",
  },
  {
    q: "김치냉장고 '딤채'를 처음 만든 회사는?",
    options: ["삼성", "LG", "위니아만도", "대우"],
    answer: 2,
    explanation: "1995년 위니아만도가 딤채를 출시했습니다.",
  },
  {
    q: "태극기 4괘 중 '하늘'을 의미하는 것은?",
    options: ["건(乾)", "곤(坤)", "감(坎)", "리(離)"],
    answer: 0,
    explanation: "건(乾)은 하늘, 곤(坤)은 땅을 의미합니다.",
  },
  {
    q: "서울 지하철 1호선 개통 연도는?",
    options: ["1969년", "1974년", "1980년", "1988년"],
    answer: 1,
    explanation: "1974년 8월 15일에 개통되었습니다.",
  },
  {
    q: "한국의 기대수명은? (2024년 기준 약)",
    options: ["약 73세", "약 78세", "약 83세", "약 88세"],
    answer: 2,
    explanation: "한국 기대수명은 약 83세입니다.",
  },
];

const TIMER_PER_Q = 10;
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
  if (score === 10) return "👑 만점왕!";
  if (score >= 8) return "💯 한국 박사";
  if (score >= 6) return "👍 평균 이상";
  if (score >= 4) return "📚 다시 도전!";
  return "😅 한국에 더 관심을!";
}

export default function KoreaQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
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
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          clearInterval(interval);
          setSelected(-1);
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [idx, selected, done, questions.length]);

  const current = questions[idx];

  const handleSelect = (i: number) => {
    if (selected !== null || !current) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
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
    const text = `한국 상식 퀴즈 ${score}/${TOTAL_PICKS}점 (${getGrade(score)}) → nolza.fun/games/korea-quiz`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (questions.length === 0) {
    return <main className="min-h-screen bg-bg" />;
  }

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
              {score}
              <span className="text-4xl text-gray-500">/10</span>
            </div>
            <div className="mt-4 text-2xl font-bold md:text-3xl">{getGrade(score)}</div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={restart}
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
            <span className="font-medium text-white">{idx + 1}</span>
            <span className="mx-1">/</span>
            <span>{TOTAL_PICKS}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl font-black md:text-4xl">
            한국 상식 <span className="text-accent">퀴즈</span>
          </h1>
        </header>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
          <div
            className="h-full bg-accent transition-[width] duration-100"
            style={{ width: `${(timeLeft / TIMER_PER_Q) * 100}%` }}
          />
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
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={showFeedback}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors md:text-base ${cls}`}
                >
                  <span className="mr-3 font-bold text-gray-500">
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`mt-6 rounded-xl p-4 text-sm md:text-base ${
                isCorrect
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-accent/10 text-accent"
              }`}
            >
              <div className="font-bold">
                {selected === -1 ? "⏰ 시간 초과" : isCorrect ? "✓ 정답!" : "✕ 오답"}
              </div>
              <div className="mt-1 text-gray-300">{current.explanation}</div>
            </div>
          )}
        </div>

        {showFeedback && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90"
          >
            {idx + 1 >= TOTAL_PICKS ? "결과 보기 →" : "다음 문제 →"}
          </button>
        )}

        <div className="mt-3 text-center text-xs text-gray-500">
          현재 점수: {score}점
        </div>
      </div>
    </main>
  );
}
