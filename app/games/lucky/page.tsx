"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";

const FORTUNES: { ko: string; en: string }[] = [
  { ko: "오늘은 행운이 가득한 하루입니다", en: "Today is a day brimming with luck" },
  { ko: "예상치 못한 좋은 소식이 들려올 거예요", en: "Unexpected good news is on its way" },
  { ko: "작은 친절이 큰 행운으로 돌아옵니다", en: "A small kindness returns as great fortune" },
  { ko: "오늘은 미루던 일을 시작하기 좋은 날", en: "A great day to start what you've been putting off" },
  { ko: "주변 사람의 말을 한 번쯤 들어볼 것", en: "Take a moment to listen to those around you" },
  { ko: "재물운이 살짝 좋아 보입니다", en: "Your finances are looking slightly up" },
  { ko: "건강이 최고의 자산이라는 걸 기억하세요", en: "Remember that health is your greatest asset" },
  { ko: "오늘 우연한 만남이 인연이 될 수 있어요", en: "A chance encounter today could become something more" },
  { ko: "쉬어가는 것도 용기예요", en: "Taking a break takes courage too" },
  { ko: "한 발자국만 더 내디디면 답이 보입니다", en: "One more step and the answer comes into view" },
  { ko: "오늘은 새로운 도전을 시작해도 좋아요", en: "Today is a good day to take on a new challenge" },
  { ko: "감정 표현에 솔직해지면 좋아질 일이 많아요", en: "Being honest with your feelings opens many doors" },
  { ko: "사소한 결정이 큰 변화를 만들 수 있어요", en: "A small decision can spark a big change" },
  { ko: "오늘은 몸이 보내는 신호에 귀 기울이세요", en: "Listen to the signals your body is sending today" },
  { ko: "주변에 좋은 사람들이 모입니다", en: "Good people are gathering around you" },
  { ko: "한 번쯤 미소 한 번 더 지어보세요", en: "Try smiling just one more time today" },
  { ko: "어제의 실수는 오늘의 자산입니다", en: "Yesterday's mistakes are today's assets" },
  { ko: "기다리던 답장이 곧 도착할 수 있어요", en: "The reply you've been waiting for may arrive soon" },
  { ko: "오늘 만나는 사람과의 대화가 의미 있을 거예요", en: "A conversation today will turn out to be meaningful" },
  { ko: "스트레스를 잠시 내려놓아도 괜찮습니다", en: "It's okay to set your stress down for a while" },
  { ko: "오랜만에 연락을 해보는 것도 좋아요", en: "Reaching out to someone you haven't in a while is a good idea" },
  { ko: "예상치 못한 곳에서 행운이 찾아옵니다", en: "Luck finds you in an unexpected place" },
  { ko: "한 번에 다 얻으려 하지 마세요. 천천히도 좋습니다", en: "Don't try to get it all at once — slow and steady is fine" },
  { ko: "오늘은 \"아니오\"를 말해도 괜찮은 날", en: "Today is a day when it's okay to say \"no\"" },
  { ko: "맛있는 음식이 기분을 바꿔줄 거예요", en: "A good meal will lift your mood" },
  { ko: "걱정하던 일이 의외로 쉽게 풀립니다", en: "What you've been worried about resolves surprisingly easily" },
  { ko: "지나간 일에 너무 매달리지 마세요", en: "Don't cling too tightly to what's already past" },
  { ko: "오늘은 자기 자신을 칭찬하는 날", en: "Today is a day to give yourself some praise" },
  { ko: "당신의 노력은 헛되지 않을 거예요", en: "Your efforts will not go to waste" },
  { ko: "마음의 짐을 한 가지 내려놓을 때", en: "It's time to lay down one of your burdens" },
  { ko: "예전부터 미뤄온 청소를 해보세요", en: "Try tackling the cleaning you've put off for ages" },
  { ko: "오늘은 새로운 길로 출근/등교 해보세요", en: "Try a new route to work or school today" },
  { ko: "잠을 푹 자는 게 가장 큰 운입니다", en: "A good night's sleep is the greatest luck of all" },
  { ko: "햇볕을 5분만 쬐어도 기분이 좋아져요", en: "Just five minutes of sunshine will brighten your mood" },
  { ko: "오늘 들은 한 마디가 평생 남을 수 있어요", en: "A single word you hear today may stay with you for life" },
  { ko: "물을 평소보다 많이 마셔보세요", en: "Try drinking more water than usual" },
  { ko: "조용히 산책하기 좋은 날입니다", en: "A perfect day for a quiet walk" },
  { ko: "당신의 매력은 오늘 더 빛이 납니다", en: "Your charm shines even brighter today" },
  { ko: "한 번 더 확인하는 습관이 도움이 됩니다", en: "The habit of double-checking will serve you well" },
  { ko: "주변의 작은 변화를 알아차려 보세요", en: "Notice the small changes around you" },
  { ko: "마음에 드는 책을 한 권 펼쳐보세요", en: "Open up a book you love" },
  { ko: "오늘은 음악이 위로가 되는 날", en: "Today is a day when music brings comfort" },
  { ko: "사람을 너무 빠르게 판단하지 마세요", en: "Don't judge people too quickly" },
  { ko: "잊고 있던 친구가 떠오를 수 있어요", en: "A friend you'd forgotten may come to mind" },
  { ko: "오늘은 카페에서 시간을 보내기 좋은 날", en: "A great day to spend some time at a café" },
  { ko: "오랜만에 가족에게 안부를 전해보세요", en: "Check in with your family — it's been a while" },
  { ko: "투자보다 저축이 답일 수 있어요", en: "Saving may be the better answer than investing" },
  { ko: "오늘은 누군가에게 도움이 되는 하루", en: "Today is a day you'll be of help to someone" },
  { ko: "당신만의 속도로 가는 게 정답입니다", en: "Going at your own pace is the right answer" },
  { ko: "오늘은 SNS를 잠시 닫아두는 것도 좋아요", en: "Closing social media for a while today is a good idea" },
  { ko: "한 가지 작은 목표를 세우고 끝내보세요", en: "Set one small goal and see it through" },
  { ko: "지금 이 순간을 즐기세요. 두 번 오지 않아요", en: "Enjoy this moment — it won't come twice" },
];

const COLORS: { ko: string; en: string }[] = [
  { ko: "빨강", en: "Red" },
  { ko: "주황", en: "Orange" },
  { ko: "노랑", en: "Yellow" },
  { ko: "초록", en: "Green" },
  { ko: "파랑", en: "Blue" },
  { ko: "보라", en: "Purple" },
  { ko: "분홍", en: "Pink" },
  { ko: "흰색", en: "White" },
  { ko: "검정", en: "Black" },
  { ko: "금색", en: "Gold" },
  { ko: "은색", en: "Silver" },
  { ko: "하늘색", en: "Sky Blue" },
  { ko: "민트", en: "Mint" },
  { ko: "코랄", en: "Coral" },
];
const NUMBERS = [1, 3, 5, 7, 9, 11, 13, 17, 19, 21, 23, 27, 33, 42, 77, 88];
const FOODS: { ko: string; en: string }[] = [
  { ko: "김치찌개", en: "Kimchi Stew" },
  { ko: "떡볶이", en: "Tteokbokki" },
  { ko: "치킨", en: "Fried Chicken" },
  { ko: "피자", en: "Pizza" },
  { ko: "라면", en: "Ramyeon" },
  { ko: "비빔밥", en: "Bibimbap" },
  { ko: "삼겹살", en: "Pork Belly" },
  { ko: "냉면", en: "Cold Noodles" },
  { ko: "김밥", en: "Gimbap" },
  { ko: "초밥", en: "Sushi" },
  { ko: "파스타", en: "Pasta" },
  { ko: "샐러드", en: "Salad" },
  { ko: "죽", en: "Porridge" },
  { ko: "국밥", en: "Gukbap" },
  { ko: "마라탕", en: "Malatang" },
];

type LocalizedText = { ko: string; en: string };

type Fortune = {
  overall: number;
  love: number;
  money: number;
  health: number;
  color: LocalizedText;
  number: number;
  food: LocalizedText;
  message: LocalizedText;
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

function Stars({ count, label }: { count: number; label: string }) {
  return (
    <div aria-label={label}>
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
  const { t, locale } = useLocale();
  const [name, setName] = useState("");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [copied, setCopied] = useState(false);

  const draw = () => {
    setFortune(generateFortune(name, name.trim().length > 0));
  };

  const handleShare = async () => {
    if (!fortune) return;
    const stars = "★".repeat(fortune.overall) + "☆".repeat(5 - fortune.overall);
    const msg = t(fortune.message.ko, fortune.message.en);
    const text = t(
      `오늘 내 운세 ${stars} (${fortune.overall}/5) — ${msg} → nolza.fun/games/lucky`,
      `My fortune today ${stars} (${fortune.overall}/5) — ${msg} → nolza.fun/games/lucky`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const today = new Date().toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
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
            {t("← nolza 홈으로", "← Back to Nolza home")}
          </Link>
          <div className="text-xs text-gray-500">{today}</div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("오늘의 ", "Today's ")}
            <span className="text-accent">{t("운세", "Fortune")}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "이름을 입력하면 맞춤 운세가, 비워두면 랜덤 운세가 나와요.",
              "Enter your name for a personalized fortune, or leave it blank for a random one.",
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            {t("이름 (선택)", "Name (optional)")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("이름을 입력하세요 (선택)", "Enter your name (optional)")}
            maxLength={10}
            className="mt-3 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-white outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={draw}
            className="mt-5 w-full rounded-lg bg-accent py-3 text-base font-bold text-white hover:opacity-90"
          >
            {t("🎰 운세 뽑기", "🎰 Draw fortune")}
          </button>
        </div>

        {fortune && (
          <>
            <div className="mt-6 rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-center">
                <div className="text-xs text-accent">
                  {name
                    ? t(`${name}님의 오늘 운세`, `${name}'s fortune today`)
                    : t("오늘 운세", "Today's fortune")}
                </div>
                <p className="mt-3 text-xl font-bold leading-relaxed md:text-2xl">
                  {t(fortune.message.ko, fortune.message.en)}
                </p>
              </div>
            </div>

            <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: t("총운", "Overall"), v: fortune.overall, e: "🔮" },
                { label: t("애정운", "Love"), v: fortune.love, e: "❤️" },
                { label: t("금전운", "Money"), v: fortune.money, e: "💰" },
                { label: t("건강운", "Health"), v: fortune.health, e: "💪" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card p-4 text-center"
                >
                  <div className="text-2xl">{item.e}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.label}</div>
                  <div className="mt-2 text-xl">
                    <Stars
                      count={item.v}
                      label={t(`${item.v}개`, `${item.v} stars`)}
                    />
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-xs text-gray-500">{t("행운의 색", "Lucky color")}</div>
                <div className="mt-2 text-lg font-bold text-accent">
                  {t(fortune.color.ko, fortune.color.en)}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-xs text-gray-500">{t("행운의 숫자", "Lucky number")}</div>
                <div className="mt-2 text-lg font-bold text-accent">
                  {fortune.number}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="text-xs text-gray-500">{t("행운의 음식", "Lucky food")}</div>
                <div className="mt-2 text-lg font-bold text-accent">
                  {t(fortune.food.ko, fortune.food.en)}
                </div>
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={draw}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                {t("↻ 다시 뽑기", "↻ Draw again")}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
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
            {t("← nolza 홈으로", "← Back to Nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
