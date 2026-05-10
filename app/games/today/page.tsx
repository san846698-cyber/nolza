"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Q = { id: number; q: string; options: { label: string; emoji: string }[] };

const QUESTIONS: Q[] = [
  { id: 1, q: "오늘 점심 뭐 드셨어요?", options: [{ label: "한식", emoji: "🍱" }, { label: "양식", emoji: "🍝" }, { label: "중식", emoji: "🥡" }, { label: "일식", emoji: "🍣" }, { label: "안 먹음", emoji: "🚫" }] },
  { id: 2, q: "오늘 커피 몇 잔 드셨어요?", options: [{ label: "0잔", emoji: "🚫" }, { label: "1잔", emoji: "☕" }, { label: "2~3잔", emoji: "☕☕" }, { label: "4잔+", emoji: "🆘" }] },
  { id: 3, q: "지금 기분은?", options: [{ label: "좋아요", emoji: "😊" }, { label: "그냥 그래요", emoji: "😐" }, { label: "별로예요", emoji: "😞" }, { label: "최악", emoji: "💀" }] },
  { id: 4, q: "오늘 운동했어요?", options: [{ label: "헬스장 갔어요", emoji: "💪" }, { label: "산책 정도", emoji: "🚶" }, { label: "전혀", emoji: "🛋️" }] },
  { id: 5, q: "요즘 제일 많이 쓰는 앱?", options: [{ label: "카카오톡", emoji: "💬" }, { label: "유튜브", emoji: "📺" }, { label: "인스타", emoji: "📷" }, { label: "넷플릭스", emoji: "🎬" }, { label: "쿠팡", emoji: "📦" }] },
  { id: 6, q: "오늘 몇 시에 일어났어요?", options: [{ label: "6시 전", emoji: "🌅" }, { label: "6~8시", emoji: "☀️" }, { label: "8~10시", emoji: "🥱" }, { label: "10시 이후", emoji: "💤" }] },
  { id: 7, q: "지금 어디 있어요?", options: [{ label: "집", emoji: "🏠" }, { label: "회사", emoji: "🏢" }, { label: "학교", emoji: "🏫" }, { label: "카페", emoji: "☕" }, { label: "이동중", emoji: "🚇" }] },
  { id: 8, q: "오늘 날씨 어떤가요?", options: [{ label: "맑음", emoji: "☀️" }, { label: "흐림", emoji: "☁️" }, { label: "비", emoji: "🌧️" }, { label: "눈", emoji: "❄️" }] },
  { id: 9, q: "어제 몇 시간 잤어요?", options: [{ label: "5시간 미만", emoji: "💀" }, { label: "5~7시간", emoji: "🥱" }, { label: "7~9시간", emoji: "😊" }, { label: "9시간+", emoji: "😴" }] },
  { id: 10, q: "오늘 누구랑 점심 먹었어요?", options: [{ label: "혼밥", emoji: "🧑" }, { label: "동료", emoji: "🧑‍💼" }, { label: "친구", emoji: "🧑‍🤝‍🧑" }, { label: "가족", emoji: "👪" }] },
  { id: 11, q: "지금 가장 사고 싶은 것?", options: [{ label: "맛있는 거", emoji: "🍕" }, { label: "옷", emoji: "👕" }, { label: "전자제품", emoji: "📱" }, { label: "휴식", emoji: "🌴" }] },
  { id: 12, q: "오늘 카드 얼마 썼어요?", options: [{ label: "1만원 미만", emoji: "🪙" }, { label: "1~5만원", emoji: "💵" }, { label: "5~10만원", emoji: "💸" }, { label: "10만원+", emoji: "🆘" }] },
  { id: 13, q: "이번 주 회식 있어요?", options: [{ label: "있음 (피하고 싶음)", emoji: "🙃" }, { label: "있음 (기대됨)", emoji: "🍻" }, { label: "없음", emoji: "🥳" }] },
  { id: 14, q: "출퇴근 수단은?", options: [{ label: "지하철", emoji: "🚇" }, { label: "버스", emoji: "🚌" }, { label: "자가용", emoji: "🚗" }, { label: "도보/자전거", emoji: "🚶" }, { label: "재택", emoji: "🏠" }] },
  { id: 15, q: "오늘 인스타 몇 번 켰어요?", options: [{ label: "0번", emoji: "🚫" }, { label: "1~5번", emoji: "📱" }, { label: "5~20번", emoji: "📷" }, { label: "셀 수 없음", emoji: "🆘" }] },
  { id: 16, q: "오늘 라면 먹었어요?", options: [{ label: "안 먹음", emoji: "🚫" }, { label: "1봉지", emoji: "🍜" }, { label: "2봉지+", emoji: "🤤" }] },
  { id: 17, q: "이번 달 카드값 예상", options: [{ label: "괜찮을 듯", emoji: "😊" }, { label: "조금 걱정", emoji: "😅" }, { label: "큰일 났다", emoji: "💀" }] },
  { id: 18, q: "오늘 만난 사람 중 가장 반가웠던 건?", options: [{ label: "친구", emoji: "🧑‍🤝‍🧑" }, { label: "가족", emoji: "👪" }, { label: "동료", emoji: "🧑‍💼" }, { label: "혼자였음", emoji: "🧑" }] },
  { id: 19, q: "주말에 뭐할 거예요?", options: [{ label: "푹 쉴 거예요", emoji: "🛋️" }, { label: "놀러 가요", emoji: "🚗" }, { label: "약속 있음", emoji: "🍻" }, { label: "일/공부", emoji: "📚" }] },
  { id: 20, q: "오늘 본 영상 중 최고는?", options: [{ label: "유튜브", emoji: "📺" }, { label: "쇼츠/릴스", emoji: "📱" }, { label: "넷플릭스", emoji: "🎬" }, { label: "안 봤음", emoji: "🚫" }] },
  { id: 21, q: "오늘 한 끼 평균 가격대?", options: [{ label: "1만원 미만", emoji: "🍙" }, { label: "1~2만원", emoji: "🍱" }, { label: "2~5만원", emoji: "🍣" }, { label: "5만원+", emoji: "💎" }] },
  { id: 22, q: "오늘 회사/학교 가기 싫었어요?", options: [{ label: "전혀", emoji: "😊" }, { label: "조금", emoji: "😐" }, { label: "엄청", emoji: "🆘" }] },
  { id: 23, q: "지금 마시고 싶은 술은?", options: [{ label: "맥주", emoji: "🍺" }, { label: "소주", emoji: "🍶" }, { label: "막걸리", emoji: "🥃" }, { label: "와인", emoji: "🍷" }, { label: "안 마심", emoji: "🚫" }] },
  { id: 24, q: "오늘 산책했어요?", options: [{ label: "10분 이상", emoji: "🚶" }, { label: "잠깐", emoji: "🚶‍♀️" }, { label: "안 함", emoji: "🛋️" }] },
  { id: 25, q: "이번 달 저축 가능?", options: [{ label: "넉넉하게", emoji: "💰" }, { label: "조금", emoji: "🪙" }, { label: "마이너스", emoji: "📉" }] },
  { id: 26, q: "오늘 가장 많이 한 일은?", options: [{ label: "일/공부", emoji: "💼" }, { label: "휴식", emoji: "🛋️" }, { label: "스마트폰", emoji: "📱" }, { label: "사람 만나기", emoji: "🧑‍🤝‍🧑" }] },
  { id: 27, q: "오늘 카페 갔어요?", options: [{ label: "갔어요", emoji: "☕" }, { label: "테이크아웃", emoji: "🥤" }, { label: "안 갔어요", emoji: "🚫" }] },
  { id: 28, q: "다음 휴가 계획?", options: [{ label: "국내 여행", emoji: "🇰🇷" }, { label: "해외 여행", emoji: "✈️" }, { label: "집콕", emoji: "🏠" }, { label: "계획 없음", emoji: "❓" }] },
  { id: 29, q: "오늘 웃었어요?", options: [{ label: "많이", emoji: "😄" }, { label: "조금", emoji: "🙂" }, { label: "거의 못 웃음", emoji: "😞" }] },
  { id: 30, q: "내일도 놀자.fun 올 거예요?", options: [{ label: "당연히!", emoji: "🤝" }, { label: "글쎄...", emoji: "🤔" }, { label: "안 옴", emoji: "👋" }] },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(): string {
  return new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function TodayGame() {
  const [today] = useState(todayKey());
  const todaysQ = useMemo(
    () => QUESTIONS[hashStr(today) % QUESTIONS.length],
    [today],
  );

  const VOTES_KEY = `nolza-today-${today}-${todaysQ.id}-votes`;
  const CHOICE_KEY = `nolza-today-${today}-${todaysQ.id}-choice`;

  const [votes, setVotes] = useState<number[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [liveUsers, setLiveUsers] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let v: number[];
    try {
      const saved = localStorage.getItem(VOTES_KEY);
      v = saved ? JSON.parse(saved) : [];
    } catch {
      v = [];
    }
    if (v.length !== todaysQ.options.length) {
      v = todaysQ.options.map(() => 30 + Math.floor(Math.random() * 200));
      try {
        localStorage.setItem(VOTES_KEY, JSON.stringify(v));
      } catch {}
    }
    setVotes(v);
    try {
      const saved = localStorage.getItem(CHOICE_KEY);
      if (saved !== null) setChoice(Number(saved));
    } catch {}
    setLiveUsers(50 + Math.floor(Math.random() * 200));
  }, [VOTES_KEY, CHOICE_KEY, todaysQ]);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveUsers((u) => u + Math.floor(Math.random() * 3));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const total = votes.reduce((s, v) => s + v, 0);

  const vote = (i: number) => {
    if (choice !== null) return;
    const newVotes = [...votes];
    newVotes[i] = (newVotes[i] ?? 0) + 1;
    setVotes(newVotes);
    setChoice(i);
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(newVotes));
      localStorage.setItem(CHOICE_KEY, String(i));
    } catch {}
  };

  const handleShare = async () => {
    if (choice === null) return;
    const opt = todaysQ.options[choice];
    const text = `[오늘의 한국인] ${todaysQ.q} → ${opt.emoji} ${opt.label} → nolza.fun/games/today`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border" style={{ backgroundColor: "rgba(52, 199, 89, 0.04)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <div className="text-xs text-gray-500">
            🟢 지금 <span className="font-bold text-emerald-400 tabular-nums">{liveUsers.toLocaleString("ko-KR")}</span>명 함께
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <div className="text-xs text-emerald-400">{fmtDate()}</div>
          <h1 className="mt-1 text-3xl font-black md:text-5xl">
            오늘의 <span style={{ color: "#34C759" }}>한국인</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            매일 한 가지 질문. 내일 또 와서 새 질문 풀어요.
          </p>
        </header>

        <div className="rounded-2xl border bg-card p-6 md:p-8" style={{ borderColor: "rgba(52, 199, 89, 0.3)" }}>
          <div className="text-xl font-bold leading-relaxed md:text-2xl">
            {todaysQ.q}
          </div>

          {choice === null ? (
            <div className="mt-6 flex flex-col gap-2">
              {todaysQ.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => vote(i)}
                  className="rounded-xl border border-border bg-bg px-4 py-4 text-left text-base transition-colors hover:border-emerald-500"
                >
                  <span className="mr-3 text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              {todaysQ.options.map((opt, i) => {
                const v = votes[i] ?? 0;
                const pct = total > 0 ? (v / total) * 100 : 0;
                const isMine = choice === i;
                return (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl border px-4 py-3 ${
                      isMine ? "border-emerald-500" : "border-border"
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{ width: `${pct}%`, backgroundColor: isMine ? "rgba(52, 199, 89, 0.2)" : "rgba(255, 255, 255, 0.05)" }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="text-sm">
                        <span className="mr-3 text-xl">{opt.emoji}</span>
                        {opt.label}
                      </span>
                      <span className="text-sm tabular-nums text-gray-300">
                        {pct.toFixed(1)}%
                        {isMine && (
                          <span className="ml-2" style={{ color: "#34C759" }}>
                            ← 내 선택
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-center text-xs text-gray-500">
                총 {total.toLocaleString("ko-KR")}명 응답
              </div>
            </div>
          )}
        </div>

        {choice !== null && (
          <>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-center text-sm text-gray-400">
              내일 또 와요. 새로운 질문이 기다려요 👋
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full px-6 py-3 text-sm font-bold text-black hover:opacity-90"
                style={{ backgroundColor: "#34C759" }}
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
