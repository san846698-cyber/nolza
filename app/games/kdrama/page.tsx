"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Genre =
  | "재벌 로맨스"
  | "복수극"
  | "좀비물"
  | "의학물"
  | "학원물"
  | "사극"
  | "스릴러";

const GENRE_LABEL: Record<Genre, { ko: string; en: string }> = {
  "재벌 로맨스": { ko: "재벌 로맨스", en: "Chaebol Romance" },
  "복수극": { ko: "복수극", en: "Revenge Drama" },
  "좀비물": { ko: "좀비물", en: "Zombie Apocalypse" },
  "의학물": { ko: "의학물", en: "Medical Drama" },
  "학원물": { ko: "학원물", en: "School Drama" },
  "사극": { ko: "사극", en: "Historical Drama" },
  "스릴러": { ko: "스릴러", en: "Thriller" },
};

type Question = {
  q: { ko: string; en: string };
  a: { text: { ko: string; en: string }; genre: Genre }[];
};

const QUESTIONS: Question[] = [
  {
    q: { ko: "Q1. 누군가 나를 배신했다면?", en: "Q1. If someone betrayed you?" },
    a: [
      { text: { ko: "끝까지 추적한다", en: "Hunt them down to the end" }, genre: "복수극" },
      { text: { ko: "용서한다", en: "Forgive them" }, genre: "재벌 로맨스" },
    ],
  },
  {
    q: { ko: "Q2. 이상형의 직업은?", en: "Q2. Your ideal partner's job?" },
    a: [
      { text: { ko: "재벌 후계자", en: "Chaebol heir" }, genre: "재벌 로맨스" },
      { text: { ko: "응급실 의사", en: "ER doctor" }, genre: "의학물" },
    ],
  },
  {
    q: { ko: "Q3. 갑자기 좀비가 출몰한다면?", en: "Q3. If zombies suddenly appeared?" },
    a: [
      { text: { ko: "맞서 싸운다", en: "Stand and fight" }, genre: "좀비물" },
      { text: { ko: "도망친다", en: "Run away" }, genre: "스릴러" },
    ],
  },
  {
    q: { ko: "Q4. 시간을 돌릴 수 있다면?", en: "Q4. If you could turn back time?" },
    a: [
      { text: { ko: "조선시대로 가본다", en: "Travel to the Joseon era" }, genre: "사극" },
      { text: { ko: "고등학교 시절로 돌아간다", en: "Go back to high school" }, genre: "학원물" },
    ],
  },
  {
    q: { ko: "Q5. 가장 잘 어울리는 의상은?", en: "Q5. The outfit that suits you best?" },
    a: [
      { text: { ko: "한복", en: "Hanbok" }, genre: "사극" },
      { text: { ko: "교복", en: "School uniform" }, genre: "학원물" },
    ],
  },
  {
    q: { ko: "Q6. 위기 상황에서 나는?", en: "Q6. In a crisis, you?" },
    a: [
      { text: { ko: "냉정하게 분석한다", en: "Analyze it calmly" }, genre: "스릴러" },
      { text: { ko: "본능적으로 행동한다", en: "Act on instinct" }, genre: "좀비물" },
    ],
  },
  {
    q: { ko: "Q7. 가장 두려워하는 것은?", en: "Q7. What do you fear most?" },
    a: [
      { text: { ko: "사랑하는 사람을 잃는 것", en: "Losing the one you love" }, genre: "재벌 로맨스" },
      { text: { ko: "복수에 실패하는 것", en: "Failing at revenge" }, genre: "복수극" },
    ],
  },
  {
    q: { ko: "Q8. 휴대폰 배경화면은?", en: "Q8. Your phone wallpaper?" },
    a: [
      { text: { ko: "옛 친구들과의 사진", en: "A photo with old friends" }, genre: "학원물" },
      { text: { ko: "수술 사진", en: "A surgery photo" }, genre: "의학물" },
    ],
  },
  {
    q: { ko: "Q9. 인생 목표는?", en: "Q9. Your life goal?" },
    a: [
      { text: { ko: "사람 살리는 일", en: "Saving lives" }, genre: "의학물" },
      { text: { ko: "왕좌를 차지하는 것", en: "Claiming the throne" }, genre: "사극" },
    ],
  },
  {
    q: { ko: "Q10. 끝맺음을 좋아하는 스타일?", en: "Q10. The kind of ending you like?" },
    a: [
      { text: { ko: "해피엔딩", en: "Happy ending" }, genre: "재벌 로맨스" },
      { text: { ko: "충격적인 반전", en: "A shocking twist" }, genre: "스릴러" },
    ],
  },
];

const TITLE_PREFIX = {
  ko: ["비밀의", "달콤한", "잔혹한", "마지막", "끝없는", "운명의", "진짜"],
  en: ["Secret", "Sweet", "Cruel", "The Last", "Endless", "Fated", "The Real"],
};
const TITLE_SUFFIX = {
  ko: ["연인", "복수", "사랑", "왕국", "약속", "비밀", "유산"],
  en: ["Lover", "Revenge", "Love", "Kingdom", "Promise", "Secret", "Legacy"],
};

const COSTARS = [
  "이병헌", "현빈", "공유", "정해인", "박서준",
  "수지", "송혜교", "전지현", "아이유", "박은빈",
];

const PLOT_TEMPLATE: Record<Genre, { ko: string; en: string }> = {
  "재벌 로맨스": {
    ko: "재벌 3세인 {name}이(가) 평범한 회사원과 만나며 시작되는 운명의 사랑.",
    en: "{name}, the third-generation chaebol heir, falls into a fated love after meeting an ordinary office worker.",
  },
  "복수극": {
    ko: "{name}이(가) 가족을 잃은 사건의 진실을 파헤치며 복수를 시작한다.",
    en: "{name} digs into the truth behind the loss of their family and sets revenge in motion.",
  },
  "좀비물": {
    ko: "어느 날 {name}이(가) 사는 도시에 좀비가 출몰하며 생존이 시작된다.",
    en: "One day zombies overrun {name}'s city, and the fight for survival begins.",
  },
  "의학물": {
    ko: "응급실 천재 의사 {name}, 매일 죽음과 마주하며 생명을 살린다.",
    en: "{name}, a genius ER doctor, faces death every day while saving lives.",
  },
  "학원물": {
    ko: "전학 온 {name}, 평범해 보였지만 학교의 비밀을 알게 된다.",
    en: "{name}, a new transfer student who seemed ordinary, uncovers the school's secret.",
  },
  "사극": {
    ko: "{name}, 조선의 운명을 좌우할 한 사람의 이야기가 시작된다.",
    en: "{name} — the story of the one person who will decide the fate of Joseon begins.",
  },
  "스릴러": {
    ko: "{name}의 평범한 일상이 어느 날 한 통의 전화로 무너지기 시작한다.",
    en: "{name}'s ordinary life starts to crumble with a single phone call one day.",
  },
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function KdramaGame() {
  const { t, locale } = useLocale();
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
    const prefix = TITLE_PREFIX[locale];
    const suffix = TITLE_SUFFIX[locale];
    const title = `${prefix[seed % prefix.length]} ${suffix[(seed >> 3) % suffix.length]}`;
    const costar = COSTARS[(seed >> 6) % COSTARS.length];
    const fallbackName = t("당신", "You");
    const plot = PLOT_TEMPLATE[top][locale].replace("{name}", name || fallbackName);
    const genreLabel = t(GENRE_LABEL[top].ko, GENRE_LABEL[top].en);
    return { genre: top, genreLabel, title, costar, plot };
  }, [answers, name, locale, t]);

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
    const text = t(
      `내가 주인공인 K드라마 "${result.title}" (${result.genreLabel}) · 상대 배우: ${result.costar} → nolza.fun/games/kdrama`,
      `The K-drama I'm starring in: "${result.title}" (${result.genreLabel}) · Co-star: ${result.costar} → nolza.fun/games/kdrama`,
    );
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
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {locale === "ko" ? (
              <>
                나는 어떤 <span className="text-accent">K드라마</span> 주인공?
              </>
            ) : (
              <>
                Which <span className="text-accent">K-drama</span> lead are you?
              </>
            )}
          </h1>
        </header>

        {step === -1 && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <label className="block text-sm font-medium text-gray-300">
              {t("주인공 이름 (당신 이름)", "Lead's name (your name)")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("예: 김민준", "e.g. Min-jun")}
              className="mt-3 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-white outline-none focus:border-accent"
              maxLength={10}
            />
            <button
              type="button"
              onClick={start}
              disabled={!name.trim()}
              className="mt-5 w-full rounded-lg bg-accent py-3 text-base font-bold text-white hover:opacity-90 disabled:opacity-30"
            >
              {t("시작하기 →", "Start →")}
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
                {t(QUESTIONS[step].q.ko, QUESTIONS[step].q.en)}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                {QUESTIONS[step].a.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => answer(opt.genre)}
                    className="rounded-xl border border-border bg-bg px-4 py-4 text-left text-base hover:border-accent"
                  >
                    {t(opt.text.ko, opt.text.en)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="text-xs text-accent">{result.genreLabel}</div>
              <div className="mt-2 text-3xl font-black md:text-5xl">
                《{result.title}》
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs text-gray-500">{t("주연", "Lead")}</div>
                  <div className="mt-1 text-lg font-bold">{name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t("상대 배우", "Co-star")}</div>
                  <div className="mt-1 text-lg font-bold">{result.costar}</div>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-bg p-4">
                <div className="text-xs text-gray-500">{t("1회 줄거리", "Episode 1 synopsis")}</div>
                <p className="mt-2 text-base text-gray-300">{result.plot}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                {t("↻ 다시 하기", "↻ Try again")}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                {copied
                  ? t("✓ 복사됐어요", "✓ Copied")
                  : t("📋 친구에게 공유하기", "📋 Share with friends")}
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
