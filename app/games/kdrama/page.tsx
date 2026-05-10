"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Genre =
  | "재벌 로맨스"
  | "복수극"
  | "좀비물"
  | "의학물"
  | "학원물"
  | "사극"
  | "스릴러";

type Question = {
  q: string;
  a: { text: string; genre: Genre }[];
};

const QUESTIONS: Question[] = [
  {
    q: "Q1. 누군가 나를 배신했다면?",
    a: [
      { text: "끝까지 추적한다", genre: "복수극" },
      { text: "용서한다", genre: "재벌 로맨스" },
    ],
  },
  {
    q: "Q2. 이상형의 직업은?",
    a: [
      { text: "재벌 후계자", genre: "재벌 로맨스" },
      { text: "응급실 의사", genre: "의학물" },
    ],
  },
  {
    q: "Q3. 갑자기 좀비가 출몰한다면?",
    a: [
      { text: "맞서 싸운다", genre: "좀비물" },
      { text: "도망친다", genre: "스릴러" },
    ],
  },
  {
    q: "Q4. 시간을 돌릴 수 있다면?",
    a: [
      { text: "조선시대로 가본다", genre: "사극" },
      { text: "고등학교 시절로 돌아간다", genre: "학원물" },
    ],
  },
  {
    q: "Q5. 가장 잘 어울리는 의상은?",
    a: [
      { text: "한복", genre: "사극" },
      { text: "교복", genre: "학원물" },
    ],
  },
  {
    q: "Q6. 위기 상황에서 나는?",
    a: [
      { text: "냉정하게 분석한다", genre: "스릴러" },
      { text: "본능적으로 행동한다", genre: "좀비물" },
    ],
  },
  {
    q: "Q7. 가장 두려워하는 것은?",
    a: [
      { text: "사랑하는 사람을 잃는 것", genre: "재벌 로맨스" },
      { text: "복수에 실패하는 것", genre: "복수극" },
    ],
  },
  {
    q: "Q8. 휴대폰 배경화면은?",
    a: [
      { text: "옛 친구들과의 사진", genre: "학원물" },
      { text: "수술 사진", genre: "의학물" },
    ],
  },
  {
    q: "Q9. 인생 목표는?",
    a: [
      { text: "사람 살리는 일", genre: "의학물" },
      { text: "왕좌를 차지하는 것", genre: "사극" },
    ],
  },
  {
    q: "Q10. 끝맺음을 좋아하는 스타일?",
    a: [
      { text: "해피엔딩", genre: "재벌 로맨스" },
      { text: "충격적인 반전", genre: "스릴러" },
    ],
  },
];

const TITLE_PREFIX = ["비밀의", "달콤한", "잔혹한", "마지막", "끝없는", "운명의", "진짜"];
const TITLE_SUFFIX = ["연인", "복수", "사랑", "왕국", "약속", "비밀", "유산"];

const COSTARS = [
  "이병헌", "현빈", "공유", "정해인", "박서준",
  "수지", "송혜교", "전지현", "아이유", "박은빈",
];

const PLOT_TEMPLATE: Record<Genre, string> = {
  "재벌 로맨스": "재벌 3세인 {name}이(가) 평범한 회사원과 만나며 시작되는 운명의 사랑.",
  "복수극": "{name}이(가) 가족을 잃은 사건의 진실을 파헤치며 복수를 시작한다.",
  "좀비물": "어느 날 {name}이(가) 사는 도시에 좀비가 출몰하며 생존이 시작된다.",
  "의학물": "응급실 천재 의사 {name}, 매일 죽음과 마주하며 생명을 살린다.",
  "학원물": "전학 온 {name}, 평범해 보였지만 학교의 비밀을 알게 된다.",
  "사극": "{name}, 조선의 운명을 좌우할 한 사람의 이야기가 시작된다.",
  "스릴러": "{name}의 평범한 일상이 어느 날 한 통의 전화로 무너지기 시작한다.",
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function KdramaGame() {
  const [name, setName] = useState("");
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Genre[]>([]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (answers.length < QUESTIONS.length) return null;
    const counts: Record<string, number> = {};
    for (const g of answers) counts[g] = (counts[g] ?? 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Genre;
    const seed = hashStr(name + top);
    const title = `${TITLE_PREFIX[seed % TITLE_PREFIX.length]} ${TITLE_SUFFIX[(seed >> 3) % TITLE_SUFFIX.length]}`;
    const costar = COSTARS[(seed >> 6) % COSTARS.length];
    const plot = PLOT_TEMPLATE[top].replace("{name}", name || "당신");
    return { genre: top, title, costar, plot };
  }, [answers, name]);

  const start = () => {
    if (!name.trim()) return;
    setStep(0);
    setAnswers([]);
  };

  const answer = (g: Genre) => {
    const next = [...answers, g];
    setAnswers(next);
    if (next.length >= QUESTIONS.length) {
      setStep(QUESTIONS.length);
    } else {
      setStep((s) => s + 1);
    }
  };

  const restart = () => {
    setStep(-1);
    setAnswers([]);
    setName("");
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `내가 주인공인 K드라마 "${result.title}" (${result.genre}) · 상대 배우: ${result.costar} → nolza.fun/games/kdrama`;
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
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            나는 어떤 <span className="text-accent">K드라마</span> 주인공?
          </h1>
        </header>

        {step === -1 && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <label className="block text-sm font-medium text-gray-300">
              주인공 이름 (당신 이름)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김민준"
              className="mt-3 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-white outline-none focus:border-accent"
              maxLength={10}
            />
            <button
              type="button"
              onClick={start}
              disabled={!name.trim()}
              className="mt-5 w-full rounded-lg bg-accent py-3 text-base font-bold text-white hover:opacity-90 disabled:opacity-30"
            >
              시작하기 →
            </button>
          </div>
        )}

        {step >= 0 && step < QUESTIONS.length && (
          <>
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
              <div
                className="h-full bg-accent transition-[width]"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="text-xs text-gray-500">
                {step + 1}/{QUESTIONS.length}
              </div>
              <div className="mt-3 text-xl font-bold md:text-2xl">
                {QUESTIONS[step].q}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                {QUESTIONS[step].a.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => answer(opt.genre)}
                    className="rounded-xl border border-border bg-bg px-4 py-4 text-left text-base hover:border-accent"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-xs text-accent">{result.genre}</div>
              <div className="mt-2 text-3xl font-black md:text-5xl">
                《{result.title}》
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs text-gray-500">주연</div>
                  <div className="mt-1 text-lg font-bold">{name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">상대 배우</div>
                  <div className="mt-1 text-lg font-bold">{result.costar}</div>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-bg p-4">
                <div className="text-xs text-gray-500">1회 줄거리</div>
                <p className="mt-2 text-base text-gray-300">{result.plot}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                ↻ 다시 하기
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </>
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
