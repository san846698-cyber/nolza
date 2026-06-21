"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Loc = { ko: string; en: string };
type Q = { id: number; q: Loc; options: { label: Loc; emoji: string }[] };

const QUESTIONS: Q[] = [
  { id: 1, q: { ko: "오늘 점심 뭐 드셨어요?", en: "What did you have for lunch today?" }, options: [{ label: { ko: "한식", en: "Korean" }, emoji: "🍱" }, { label: { ko: "양식", en: "Western" }, emoji: "🍝" }, { label: { ko: "중식", en: "Chinese" }, emoji: "🥡" }, { label: { ko: "일식", en: "Japanese" }, emoji: "🍣" }, { label: { ko: "안 먹음", en: "Skipped it" }, emoji: "🚫" }] },
  { id: 2, q: { ko: "오늘 커피 몇 잔 드셨어요?", en: "How many coffees today?" }, options: [{ label: { ko: "0잔", en: "0 cups" }, emoji: "🚫" }, { label: { ko: "1잔", en: "1 cup" }, emoji: "☕" }, { label: { ko: "2~3잔", en: "2–3 cups" }, emoji: "☕☕" }, { label: { ko: "4잔+", en: "4+ cups" }, emoji: "🆘" }] },
  { id: 3, q: { ko: "지금 기분은?", en: "How are you feeling right now?" }, options: [{ label: { ko: "좋아요", en: "Great" }, emoji: "😊" }, { label: { ko: "그냥 그래요", en: "Meh" }, emoji: "😐" }, { label: { ko: "별로예요", en: "Not good" }, emoji: "😞" }, { label: { ko: "최악", en: "The worst" }, emoji: "💀" }] },
  { id: 4, q: { ko: "오늘 운동했어요?", en: "Did you work out today?" }, options: [{ label: { ko: "헬스장 갔어요", en: "Hit the gym" }, emoji: "💪" }, { label: { ko: "산책 정도", en: "Just a walk" }, emoji: "🚶" }, { label: { ko: "전혀", en: "Not at all" }, emoji: "🛋️" }] },
  { id: 5, q: { ko: "요즘 제일 많이 쓰는 앱?", en: "Which app do you use most these days?" }, options: [{ label: { ko: "카카오톡", en: "KakaoTalk" }, emoji: "💬" }, { label: { ko: "유튜브", en: "YouTube" }, emoji: "📺" }, { label: { ko: "인스타", en: "Instagram" }, emoji: "📷" }, { label: { ko: "넷플릭스", en: "Netflix" }, emoji: "🎬" }, { label: { ko: "쿠팡", en: "Coupang" }, emoji: "📦" }] },
  { id: 6, q: { ko: "오늘 몇 시에 일어났어요?", en: "What time did you wake up today?" }, options: [{ label: { ko: "6시 전", en: "Before 6am" }, emoji: "🌅" }, { label: { ko: "6~8시", en: "6–8am" }, emoji: "☀️" }, { label: { ko: "8~10시", en: "8–10am" }, emoji: "🥱" }, { label: { ko: "10시 이후", en: "After 10am" }, emoji: "💤" }] },
  { id: 7, q: { ko: "지금 어디 있어요?", en: "Where are you right now?" }, options: [{ label: { ko: "집", en: "Home" }, emoji: "🏠" }, { label: { ko: "회사", en: "Work" }, emoji: "🏢" }, { label: { ko: "학교", en: "School" }, emoji: "🏫" }, { label: { ko: "카페", en: "Café" }, emoji: "☕" }, { label: { ko: "이동중", en: "On the move" }, emoji: "🚇" }] },
  { id: 8, q: { ko: "오늘 날씨 어떤가요?", en: "What's the weather like today?" }, options: [{ label: { ko: "맑음", en: "Sunny" }, emoji: "☀️" }, { label: { ko: "흐림", en: "Cloudy" }, emoji: "☁️" }, { label: { ko: "비", en: "Rainy" }, emoji: "🌧️" }, { label: { ko: "눈", en: "Snowy" }, emoji: "❄️" }] },
  { id: 9, q: { ko: "어제 몇 시간 잤어요?", en: "How many hours did you sleep last night?" }, options: [{ label: { ko: "5시간 미만", en: "Under 5 hrs" }, emoji: "💀" }, { label: { ko: "5~7시간", en: "5–7 hrs" }, emoji: "🥱" }, { label: { ko: "7~9시간", en: "7–9 hrs" }, emoji: "😊" }, { label: { ko: "9시간+", en: "9+ hrs" }, emoji: "😴" }] },
  { id: 10, q: { ko: "오늘 누구랑 점심 먹었어요?", en: "Who did you have lunch with today?" }, options: [{ label: { ko: "혼밥", en: "Ate alone" }, emoji: "🧑" }, { label: { ko: "동료", en: "Coworkers" }, emoji: "🧑‍💼" }, { label: { ko: "친구", en: "Friends" }, emoji: "🧑‍🤝‍🧑" }, { label: { ko: "가족", en: "Family" }, emoji: "👪" }] },
  { id: 11, q: { ko: "지금 가장 사고 싶은 것?", en: "What do you most want to buy right now?" }, options: [{ label: { ko: "맛있는 거", en: "Good food" }, emoji: "🍕" }, { label: { ko: "옷", en: "Clothes" }, emoji: "👕" }, { label: { ko: "전자제품", en: "Electronics" }, emoji: "📱" }, { label: { ko: "휴식", en: "A break" }, emoji: "🌴" }] },
  { id: 12, q: { ko: "오늘 카드 얼마 썼어요?", en: "How much did you spend today?" }, options: [{ label: { ko: "1만원 미만", en: "Under ₩10k" }, emoji: "🪙" }, { label: { ko: "1~5만원", en: "₩10k–50k" }, emoji: "💵" }, { label: { ko: "5~10만원", en: "₩50k–100k" }, emoji: "💸" }, { label: { ko: "10만원+", en: "₩100k+" }, emoji: "🆘" }] },
  { id: 13, q: { ko: "이번 주 회식 있어요?", en: "Any work dinner this week?" }, options: [{ label: { ko: "있음 (피하고 싶음)", en: "Yes (want to skip)" }, emoji: "🙃" }, { label: { ko: "있음 (기대됨)", en: "Yes (looking forward)" }, emoji: "🍻" }, { label: { ko: "없음", en: "None" }, emoji: "🥳" }] },
  { id: 14, q: { ko: "출퇴근 수단은?", en: "How do you commute?" }, options: [{ label: { ko: "지하철", en: "Subway" }, emoji: "🚇" }, { label: { ko: "버스", en: "Bus" }, emoji: "🚌" }, { label: { ko: "자가용", en: "Own car" }, emoji: "🚗" }, { label: { ko: "도보/자전거", en: "Walk/bike" }, emoji: "🚶" }, { label: { ko: "재택", en: "Work from home" }, emoji: "🏠" }] },
  { id: 15, q: { ko: "오늘 인스타 몇 번 켰어요?", en: "How many times did you open Instagram today?" }, options: [{ label: { ko: "0번", en: "0 times" }, emoji: "🚫" }, { label: { ko: "1~5번", en: "1–5 times" }, emoji: "📱" }, { label: { ko: "5~20번", en: "5–20 times" }, emoji: "📷" }, { label: { ko: "셀 수 없음", en: "Lost count" }, emoji: "🆘" }] },
  { id: 16, q: { ko: "오늘 라면 먹었어요?", en: "Did you eat ramyeon today?" }, options: [{ label: { ko: "안 먹음", en: "Nope" }, emoji: "🚫" }, { label: { ko: "1봉지", en: "1 pack" }, emoji: "🍜" }, { label: { ko: "2봉지+", en: "2+ packs" }, emoji: "🤤" }] },
  { id: 17, q: { ko: "이번 달 카드값 예상", en: "Your expected card bill this month" }, options: [{ label: { ko: "괜찮을 듯", en: "Should be fine" }, emoji: "😊" }, { label: { ko: "조금 걱정", en: "A bit worried" }, emoji: "😅" }, { label: { ko: "큰일 났다", en: "I'm in trouble" }, emoji: "💀" }] },
  { id: 18, q: { ko: "오늘 만난 사람 중 가장 반가웠던 건?", en: "Who were you happiest to see today?" }, options: [{ label: { ko: "친구", en: "Friends" }, emoji: "🧑‍🤝‍🧑" }, { label: { ko: "가족", en: "Family" }, emoji: "👪" }, { label: { ko: "동료", en: "Coworkers" }, emoji: "🧑‍💼" }, { label: { ko: "혼자였음", en: "Was alone" }, emoji: "🧑" }] },
  { id: 19, q: { ko: "주말에 뭐할 거예요?", en: "What are you doing this weekend?" }, options: [{ label: { ko: "푹 쉴 거예요", en: "Resting up" }, emoji: "🛋️" }, { label: { ko: "놀러 가요", en: "Going out" }, emoji: "🚗" }, { label: { ko: "약속 있음", en: "Have plans" }, emoji: "🍻" }, { label: { ko: "일/공부", en: "Work/study" }, emoji: "📚" }] },
  { id: 20, q: { ko: "오늘 본 영상 중 최고는?", en: "Best video you watched today?" }, options: [{ label: { ko: "유튜브", en: "YouTube" }, emoji: "📺" }, { label: { ko: "쇼츠/릴스", en: "Shorts/Reels" }, emoji: "📱" }, { label: { ko: "넷플릭스", en: "Netflix" }, emoji: "🎬" }, { label: { ko: "안 봤음", en: "Didn't watch any" }, emoji: "🚫" }] },
  { id: 21, q: { ko: "오늘 한 끼 평균 가격대?", en: "Average price per meal today?" }, options: [{ label: { ko: "1만원 미만", en: "Under ₩10k" }, emoji: "🍙" }, { label: { ko: "1~2만원", en: "₩10k–20k" }, emoji: "🍱" }, { label: { ko: "2~5만원", en: "₩20k–50k" }, emoji: "🍣" }, { label: { ko: "5만원+", en: "₩50k+" }, emoji: "💎" }] },
  { id: 22, q: { ko: "오늘 회사/학교 가기 싫었어요?", en: "Did you dread going to work/school today?" }, options: [{ label: { ko: "전혀", en: "Not at all" }, emoji: "😊" }, { label: { ko: "조금", en: "A little" }, emoji: "😐" }, { label: { ko: "엄청", en: "So much" }, emoji: "🆘" }] },
  { id: 23, q: { ko: "지금 마시고 싶은 술은?", en: "What do you feel like drinking right now?" }, options: [{ label: { ko: "맥주", en: "Beer" }, emoji: "🍺" }, { label: { ko: "소주", en: "Soju" }, emoji: "🍶" }, { label: { ko: "막걸리", en: "Makgeolli" }, emoji: "🥃" }, { label: { ko: "와인", en: "Wine" }, emoji: "🍷" }, { label: { ko: "안 마심", en: "None" }, emoji: "🚫" }] },
  { id: 24, q: { ko: "오늘 산책했어요?", en: "Did you go for a walk today?" }, options: [{ label: { ko: "10분 이상", en: "10+ minutes" }, emoji: "🚶" }, { label: { ko: "잠깐", en: "Briefly" }, emoji: "🚶‍♀️" }, { label: { ko: "안 함", en: "Didn't" }, emoji: "🛋️" }] },
  { id: 25, q: { ko: "이번 달 저축 가능?", en: "Can you save money this month?" }, options: [{ label: { ko: "넉넉하게", en: "Comfortably" }, emoji: "💰" }, { label: { ko: "조금", en: "A little" }, emoji: "🪙" }, { label: { ko: "마이너스", en: "In the red" }, emoji: "📉" }] },
  { id: 26, q: { ko: "오늘 가장 많이 한 일은?", en: "What did you do most today?" }, options: [{ label: { ko: "일/공부", en: "Work/study" }, emoji: "💼" }, { label: { ko: "휴식", en: "Resting" }, emoji: "🛋️" }, { label: { ko: "스마트폰", en: "On my phone" }, emoji: "📱" }, { label: { ko: "사람 만나기", en: "Seeing people" }, emoji: "🧑‍🤝‍🧑" }] },
  { id: 27, q: { ko: "오늘 카페 갔어요?", en: "Did you go to a café today?" }, options: [{ label: { ko: "갔어요", en: "Yes" }, emoji: "☕" }, { label: { ko: "테이크아웃", en: "Takeout" }, emoji: "🥤" }, { label: { ko: "안 갔어요", en: "No" }, emoji: "🚫" }] },
  { id: 28, q: { ko: "다음 휴가 계획?", en: "Plans for your next vacation?" }, options: [{ label: { ko: "국내 여행", en: "Domestic trip" }, emoji: "🇰🇷" }, { label: { ko: "해외 여행", en: "Trip abroad" }, emoji: "✈️" }, { label: { ko: "집콕", en: "Staying home" }, emoji: "🏠" }, { label: { ko: "계획 없음", en: "No plans" }, emoji: "❓" }] },
  { id: 29, q: { ko: "오늘 웃었어요?", en: "Did you laugh today?" }, options: [{ label: { ko: "많이", en: "A lot" }, emoji: "😄" }, { label: { ko: "조금", en: "A little" }, emoji: "🙂" }, { label: { ko: "거의 못 웃음", en: "Barely" }, emoji: "😞" }] },
  { id: 30, q: { ko: "내일도 놀자.fun 올 거예요?", en: "Coming back to nolza.fun tomorrow?" }, options: [{ label: { ko: "당연히!", en: "Of course!" }, emoji: "🤝" }, { label: { ko: "글쎄...", en: "Maybe..." }, emoji: "🤔" }, { label: { ko: "안 옴", en: "Nope" }, emoji: "👋" }] },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(locale: "ko" | "en"): string {
  return new Date().toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function TodayGame() {
  const { t, locale } = useLocale();
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
    const text = t(
      `[오늘의 한국인] ${todaysQ.q.ko} → ${opt.emoji} ${opt.label.ko} → nolza.fun/games/today`,
      `[Korean Daily] ${todaysQ.q.en} → ${opt.emoji} ${opt.label.en} → nolza.fun/games/today`,
    );
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
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
          <div className="text-xs text-gray-500">
            {t("🟢 지금 ", "🟢 ")}
            <span className="font-bold text-emerald-400 tabular-nums">
              {liveUsers.toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
            </span>
            {t("명 함께", " here now")}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <div className="text-xs text-emerald-400">{fmtDate(locale)}</div>
          <h1 className="mt-1 text-3xl font-black md:text-5xl">
            {t("오늘의 ", "Korean ")}
            <span style={{ color: "#34C759" }}>{t("한국인", "Daily")}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "매일 한 가지 질문. 내일 또 와서 새 질문 풀어요.",
              "One question every day. Come back tomorrow for a new one.",
            )}
          </p>
        </header>

        <div className="rounded-2xl border bg-card p-6 md:p-8" style={{ borderColor: "rgba(52, 199, 89, 0.3)" }}>
          <div className="text-xl font-bold leading-relaxed md:text-2xl">
            {t(todaysQ.q.ko, todaysQ.q.en)}
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
                  {t(opt.label.ko, opt.label.en)}
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
                        {t(opt.label.ko, opt.label.en)}
                      </span>
                      <span className="text-sm tabular-nums text-gray-300">
                        {pct.toFixed(1)}%
                        {isMine && (
                          <span className="ml-2" style={{ color: "#34C759" }}>
                            {t("← 내 선택", "← Your pick")}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="text-center text-xs text-gray-500">
                {t(
                  `총 ${total.toLocaleString("ko-KR")}명 응답`,
                  `${total.toLocaleString("en-US")} responses`,
                )}
              </div>
            </div>
          )}
        </div>

        {choice !== null && (
          <>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-center text-sm text-gray-400">
              {t(
                "내일 또 와요. 새로운 질문이 기다려요 👋",
                "Come back tomorrow. A new question awaits 👋",
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full px-6 py-3 text-sm font-bold text-black hover:opacity-90"
                style={{ backgroundColor: "#34C759" }}
              >
                {copied
                  ? t("✓ 복사됐어요", "✓ Copied")
                  : t("📋 친구에게 공유하기", "📋 Share with a friend")}
              </button>
            </div>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent"
          >
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
