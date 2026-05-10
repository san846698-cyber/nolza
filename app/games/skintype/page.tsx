"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Type = "건성" | "지성" | "복합성" | "민감성";

type Question = {
  q: string;
  options: { text: string; type: Type }[];
};

const QUESTIONS: Question[] = [
  {
    q: "Q1. 세안 후 30분 뒤 피부 상태?",
    options: [
      { text: "당기고 푸석거림", type: "건성" },
      { text: "T존이 번들거림", type: "복합성" },
      { text: "전체적으로 번들거림", type: "지성" },
      { text: "붉어짐 / 가려움", type: "민감성" },
    ],
  },
  {
    q: "Q2. 평소 모공 상태?",
    options: [
      { text: "거의 안 보임", type: "건성" },
      { text: "T존만 큼", type: "복합성" },
      { text: "전체적으로 큼", type: "지성" },
      { text: "잘 모르겠음", type: "민감성" },
    ],
  },
  {
    q: "Q3. 트러블이 자주 나는 부위?",
    options: [
      { text: "거의 안 남", type: "건성" },
      { text: "이마/턱/볼 다양", type: "복합성" },
      { text: "이마·코·턱 (T존)", type: "지성" },
      { text: "볼이 자주 빨개짐", type: "민감성" },
    ],
  },
  {
    q: "Q4. 화장이 잘 먹는가?",
    options: [
      { text: "각질이 들떠요", type: "건성" },
      { text: "T존만 들뜸", type: "복합성" },
      { text: "금방 무너짐", type: "지성" },
      { text: "성분에 따라 다름", type: "민감성" },
    ],
  },
  {
    q: "Q5. 새 화장품 사용 시?",
    options: [
      { text: "별 반응 없음", type: "건성" },
      { text: "가끔 트러블", type: "복합성" },
      { text: "여드름이 잘 남", type: "지성" },
      { text: "따끔거리거나 빨개짐", type: "민감성" },
    ],
  },
  {
    q: "Q6. 계절별 피부 변화?",
    options: [
      { text: "겨울에 매우 건조", type: "건성" },
      { text: "여름엔 지성, 겨울엔 건성", type: "복합성" },
      { text: "여름 내내 번들번들", type: "지성" },
      { text: "환절기에 매우 예민", type: "민감성" },
    ],
  },
  {
    q: "Q7. 표정 주름은?",
    options: [
      { text: "잘 보임 (탄력 부족)", type: "건성" },
      { text: "보통", type: "복합성" },
      { text: "거의 없음", type: "지성" },
      { text: "잘 모름", type: "민감성" },
    ],
  },
  {
    q: "Q8. 수분크림 흡수?",
    options: [
      { text: "금방 흡수, 또 발라야 함", type: "건성" },
      { text: "부분에 따라 다름", type: "복합성" },
      { text: "잘 흡수 안 됨", type: "지성" },
      { text: "성분 보고 신중히 사용", type: "민감성" },
    ],
  },
  {
    q: "Q9. 자외선 노출 시?",
    options: [
      { text: "쉽게 빨개지고 가려움", type: "민감성" },
      { text: "쉽게 그을림", type: "건성" },
      { text: "기름 분비 늘어남", type: "지성" },
      { text: "별 변화 없음", type: "복합성" },
    ],
  },
  {
    q: "Q10. 피부톤은?",
    options: [
      { text: "창백한 편", type: "건성" },
      { text: "균일하지 않음", type: "복합성" },
      { text: "노르스름 ", type: "지성" },
      { text: "잦은 홍조", type: "민감성" },
    ],
  },
];

const RECOMMEND: Record<Type, { celebs: string[]; routine: string[]; emoji: string }> = {
  건성: {
    emoji: "🥀",
    celebs: ["송혜교", "김태희", "수지"],
    routine: [
      "유분 많은 클렌저 (오일/밀크 타입)",
      "히알루론산 토너 듬뿍",
      "고보습 크림 + 페이스 오일",
      "각질 제거는 주 1회 이하",
    ],
  },
  지성: {
    emoji: "✨",
    celebs: ["전소민", "박명수", "데프콘"],
    routine: [
      "산뜻한 폼 클렌저, 더블 클렌징 권장",
      "BHA(살리실산) 토너 주 2~3회",
      "젤 타입 수분크림",
      "유분 컨트롤 마스크팩",
    ],
  },
  복합성: {
    emoji: "🌗",
    celebs: ["이병헌", "유재석", "아이유"],
    routine: [
      "약산성 클렌저",
      "T존엔 BHA, 볼엔 보습 토너",
      "부위별 다른 크림 사용",
      "주 1~2회 클레이 마스크 (T존만)",
    ],
  },
  민감성: {
    emoji: "🌸",
    celebs: ["박은빈", "한지민", "지창욱"],
    routine: [
      "무향·무알콜 클렌저",
      "센텔라/판테놀 진정 토너",
      "성분 단순한 보습 크림",
      "자극적인 성분(향료, 알코올) 회피",
    ],
  },
};

export default function SkinTypeGame() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Type[]>([]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (answers.length < QUESTIONS.length) return null;
    const counts: Record<Type, number> = {
      건성: 0, 지성: 0, 복합성: 0, 민감성: 0,
    };
    for (const t of answers) counts[t]++;
    const top = (Object.entries(counts) as [Type, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    return { type: top, ...RECOMMEND[top] };
  }, [answers]);

  const answer = (t: Type) => {
    setAnswers((a) => [...a, t]);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `내 피부타입은 ${result.type} ${result.emoji} (비슷한 연예인: ${result.celebs[0]}) → nolza.fun/games/skintype`;
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
            내 <span className="text-accent">피부 타입</span>은?
          </h1>
        </header>

        {!result && step < QUESTIONS.length && (
          <>
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
              <div className="h-full bg-accent transition-[width]" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="text-xs text-gray-500">{step + 1}/{QUESTIONS.length}</div>
              <div className="mt-3 text-xl font-bold md:text-2xl">{QUESTIONS[step].q}</div>
              <div className="mt-6 flex flex-col gap-2">
                {QUESTIONS[step].options.map((o, i) => (
                  <button key={i} type="button" onClick={() => answer(o.type)} className="rounded-xl border border-border bg-bg px-4 py-3 text-left text-base hover:border-accent">
                    {o.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-7xl md:text-8xl">{result.emoji}</div>
              <div className="mt-4 text-xs text-accent">당신의 피부 타입</div>
              <div className="mt-1 text-4xl font-black md:text-6xl">{result.type}</div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-bg p-4">
                  <div className="text-xs text-gray-500">비슷한 연예인</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.celebs.map((c) => (
                      <span key={c} className="rounded-full border border-border px-3 py-1 text-sm">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-bg p-4">
                  <div className="text-xs text-gray-500">추천 루틴</div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-300">
                    {result.routine.map((r, i) => (
                      <li key={i}>{i + 1}. {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ 다시 하기
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </>
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
