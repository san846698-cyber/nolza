"use client";

import Link from "next/link";
import { useState } from "react";

const FORTUNES = [
  "오늘은 행운이 가득한 하루입니다",
  "예상치 못한 좋은 소식이 들려올 거예요",
  "작은 친절이 큰 행운으로 돌아옵니다",
  "오늘은 미루던 일을 시작하기 좋은 날",
  "주변 사람의 말을 한 번쯤 들어볼 것",
  "재물운이 살짝 좋아 보입니다",
  "건강이 최고의 자산이라는 걸 기억하세요",
  "오늘 우연한 만남이 인연이 될 수 있어요",
  "쉬어가는 것도 용기예요",
  "한 발자국만 더 내디디면 답이 보입니다",
  "오늘은 새로운 도전을 시작해도 좋아요",
  "감정 표현에 솔직해지면 좋아질 일이 많아요",
  "사소한 결정이 큰 변화를 만들 수 있어요",
  "오늘은 몸이 보내는 신호에 귀 기울이세요",
  "주변에 좋은 사람들이 모입니다",
  "한 번쯤 미소 한 번 더 지어보세요",
  "어제의 실수는 오늘의 자산입니다",
  "기다리던 답장이 곧 도착할 수 있어요",
  "오늘 만나는 사람과의 대화가 의미 있을 거예요",
  "스트레스를 잠시 내려놓아도 괜찮습니다",
  "오랜만에 연락을 해보는 것도 좋아요",
  "예상치 못한 곳에서 행운이 찾아옵니다",
  "한 번에 다 얻으려 하지 마세요. 천천히도 좋습니다",
  "오늘은 \"아니오\"를 말해도 괜찮은 날",
  "맛있는 음식이 기분을 바꿔줄 거예요",
  "걱정하던 일이 의외로 쉽게 풀립니다",
  "지나간 일에 너무 매달리지 마세요",
  "오늘은 자기 자신을 칭찬하는 날",
  "당신의 노력은 헛되지 않을 거예요",
  "마음의 짐을 한 가지 내려놓을 때",
  "예전부터 미뤄온 청소를 해보세요",
  "오늘은 새로운 길로 출근/등교 해보세요",
  "잠을 푹 자는 게 가장 큰 운입니다",
  "햇볕을 5분만 쬐어도 기분이 좋아져요",
  "오늘 들은 한 마디가 평생 남을 수 있어요",
  "물을 평소보다 많이 마셔보세요",
  "조용히 산책하기 좋은 날입니다",
  "당신의 매력은 오늘 더 빛이 납니다",
  "한 번 더 확인하는 습관이 도움이 됩니다",
  "주변의 작은 변화를 알아차려 보세요",
  "마음에 드는 책을 한 권 펼쳐보세요",
  "오늘은 음악이 위로가 되는 날",
  "사람을 너무 빠르게 판단하지 마세요",
  "잊고 있던 친구가 떠오를 수 있어요",
  "오늘은 카페에서 시간을 보내기 좋은 날",
  "오랜만에 가족에게 안부를 전해보세요",
  "투자보다 저축이 답일 수 있어요",
  "오늘은 누군가에게 도움이 되는 하루",
  "당신만의 속도로 가는 게 정답입니다",
  "오늘은 SNS를 잠시 닫아두는 것도 좋아요",
  "한 가지 작은 목표를 세우고 끝내보세요",
  "지금 이 순간을 즐기세요. 두 번 오지 않아요",
];

const COLORS = [
  "빨강", "주황", "노랑", "초록", "파랑", "보라", "분홍", "흰색",
  "검정", "금색", "은색", "하늘색", "민트", "코랄",
];
const NUMBERS = [1, 3, 5, 7, 9, 11, 13, 17, 19, 21, 23, 27, 33, 42, 77, 88];
const FOODS = [
  "김치찌개", "떡볶이", "치킨", "피자", "라면", "비빔밥", "삼겹살",
  "냉면", "김밥", "초밥", "파스타", "샐러드", "죽", "국밥", "마라탕",
];

type Fortune = {
  overall: number;
  love: number;
  money: number;
  health: number;
  color: string;
  number: number;
  food: string;
  message: string;
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function rollStars(seed: number): number {
  return (seed % 5) + 1;
}

function generateFortune(name: string, useSeed: boolean): Fortune {
  const today = new Date().toISOString().slice(0, 10);
  const seedBase = useSeed
    ? hashStr(name + today)
    : Math.floor(Math.random() * 1_000_000);
  const overall = rollStars(seedBase);
  const love = rollStars(seedBase >> 3);
  const money = rollStars(seedBase >> 6);
  const health = rollStars(seedBase >> 9);
  return {
    overall,
    love,
    money,
    health,
    color: pick(COLORS, seedBase >> 12),
    number: pick(NUMBERS, seedBase >> 15),
    food: pick(FOODS, seedBase >> 18),
    message: pick(FORTUNES, seedBase >> 21),
  };
}

function Stars({ count }: { count: number }) {
  return (
    <div aria-label={`${count}개`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < count ? "text-accent" : "text-gray-700"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function LuckyGame() {
  const [name, setName] = useState("");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [copied, setCopied] = useState(false);

  const draw = () => {
    setFortune(generateFortune(name, name.trim().length > 0));
  };

  const handleShare = async () => {
    if (!fortune) return;
    const stars = "★".repeat(fortune.overall) + "☆".repeat(5 - fortune.overall);
    const text = `오늘 내 운세 ${stars} (${fortune.overall}/5) — ${fortune.message} → nolza.fun/games/lucky`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <div className="text-xs text-gray-500">{today}</div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            오늘의 <span className="text-accent">운세</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            이름을 입력하면 맞춤 운세가, 비워두면 랜덤 운세가 나와요.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            이름 (선택)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요 (선택)"
            maxLength={10}
            className="mt-3 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-white outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={draw}
            className="mt-5 w-full rounded-lg bg-accent py-3 text-base font-bold text-white hover:opacity-90"
          >
            🎰 운세 뽑기
          </button>
        </div>

        {fortune && (
          <>
            <div className="mt-6 rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-center">
                <div className="text-xs text-accent">
                  {name ? `${name}님의 오늘 운세` : "오늘 운세"}
                </div>
                <p className="mt-3 text-xl font-bold leading-relaxed md:text-2xl">
                  {fortune.message}
                </p>
              </div>
            </div>

            <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "총운", v: fortune.overall, e: "🔮" },
                { label: "애정운", v: fortune.love, e: "❤️" },
                { label: "금전운", v: fortune.money, e: "💰" },
                { label: "건강운", v: fortune.health, e: "💪" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card p-4 text-center"
                >
                  <div className="text-2xl">{item.e}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.label}</div>
                  <div className="mt-2 text-xl">
                    <Stars count={item.v} />
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-xs text-gray-500">행운의 색</div>
                <div className="mt-2 text-lg font-bold text-accent">
                  {fortune.color}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-xs text-gray-500">행운의 숫자</div>
                <div className="mt-2 text-lg font-bold text-accent">
                  {fortune.number}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-xs text-gray-500">행운의 음식</div>
                <div className="mt-2 text-lg font-bold text-accent">
                  {fortune.food}
                </div>
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={draw}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                ↻ 다시 뽑기
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
