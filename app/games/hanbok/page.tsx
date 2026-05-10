"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Role = "Scholar" | "General" | "Princess" | "King" | "Merchant" | "Farmer";

const ROLE_DATA: Record<Role, {
  ko: string;
  en: string;
  emoji: string;
  desc: { en: string; ko: string };
  jeogori: string;
  chima: string;
  trim: string;
}> = {
  Scholar: {
    ko: "선비 (학자)", en: "Scholar", emoji: "📜",
    desc: { en: "A wise and contemplative soul, devoted to learning.", ko: "지혜롭고 사색하는 학자형. 학문에 헌신적입니다." },
    jeogori: "#F8F8F8", chima: "#1F4068", trim: "#000000",
  },
  General: {
    ko: "장군 (무인)", en: "General", emoji: "🗡️",
    desc: { en: "Bold, strategic, and protective. A warrior at heart.", ko: "용감하고 전략적인 무인. 보호 본능이 강합니다." },
    jeogori: "#8B0000", chima: "#2F2F2F", trim: "#FFD700",
  },
  Princess: {
    ko: "공주 (왕족)", en: "Princess", emoji: "👑",
    desc: { en: "Graceful, refined, and dreamy royalty.", ko: "우아하고 세련된 왕족. 꿈꾸는 듯한 분위기." },
    jeogori: "#FFB6C1", chima: "#FFFFFF", trim: "#FFD700",
  },
  King: {
    ko: "왕 (군주)", en: "King", emoji: "👑",
    desc: { en: "Born to lead. Authoritative and commanding.", ko: "리더로 태어난 군주. 권위와 카리스마." },
    jeogori: "#1A1A1A", chima: "#8B0000", trim: "#FFD700",
  },
  Merchant: {
    ko: "상인 (장사꾼)", en: "Merchant", emoji: "💰",
    desc: { en: "Resourceful and witty. Always finding opportunity.", ko: "재치있고 기지있는 상인. 늘 기회를 봅니다." },
    jeogori: "#D4A574", chima: "#5C4033", trim: "#8B4513",
  },
  Farmer: {
    ko: "농부 (백성)", en: "Farmer", emoji: "🌾",
    desc: { en: "Honest, hardworking, the heart of the country.", ko: "정직하고 성실한 백성. 나라의 근간." },
    jeogori: "#F5DEB3", chima: "#8B7355", trim: "#A0826D",
  },
};

type Q = {
  ko: string;
  en: string;
  options: { ko: string; en: string; weight: Partial<Record<Role, number>> }[];
};

const QUESTIONS: Q[] = [
  {
    ko: "이상적인 하루는?", en: "Your ideal day?",
    options: [
      { ko: "책 읽고 글 쓰기", en: "Read books, write essays", weight: { Scholar: 3, Princess: 1 } },
      { ko: "무예 연마", en: "Train in martial arts", weight: { General: 3, King: 1 } },
      { ko: "사람들 만나 사업", en: "Meet people, do business", weight: { Merchant: 3, King: 1 } },
      { ko: "자연 속 농사", en: "Tend the fields in nature", weight: { Farmer: 3 } },
    ],
  },
  {
    ko: "리더십 스타일?", en: "Your leadership style?",
    options: [
      { ko: "조용한 모범", en: "Quiet example", weight: { Scholar: 2, Farmer: 1 } },
      { ko: "강력한 카리스마", en: "Powerful charisma", weight: { King: 3, General: 2 } },
      { ko: "우아한 외교", en: "Graceful diplomacy", weight: { Princess: 3 } },
      { ko: "현실적 협상", en: "Practical negotiation", weight: { Merchant: 3 } },
    ],
  },
  {
    ko: "선호하는 색감은?", en: "Preferred colors?",
    options: [
      { ko: "흰색·남색", en: "White & navy", weight: { Scholar: 2 } },
      { ko: "빨강·검정", en: "Red & black", weight: { General: 2, King: 2 } },
      { ko: "분홍·금색", en: "Pink & gold", weight: { Princess: 3 } },
      { ko: "갈색·황토", en: "Brown & ochre", weight: { Farmer: 2, Merchant: 1 } },
    ],
  },
  {
    ko: "갈등 시 행동?", en: "In conflict, you...",
    options: [
      { ko: "논리로 설득", en: "Persuade with logic", weight: { Scholar: 3 } },
      { ko: "정면 돌파", en: "Charge head-on", weight: { General: 3 } },
      { ko: "우아하게 회피", en: "Avoid gracefully", weight: { Princess: 2 } },
      { ko: "거래로 해결", en: "Negotiate a deal", weight: { Merchant: 3 } },
    ],
  },
  {
    ko: "조선시대로 갔다면?", en: "In Joseon, you'd be...",
    options: [
      { ko: "성균관에서 공부", en: "Studying at Sungkyunkwan", weight: { Scholar: 3 } },
      { ko: "전장의 장수", en: "On the battlefield", weight: { General: 3 } },
      { ko: "궁중에서 생활", en: "Living in the palace", weight: { Princess: 2, King: 2 } },
      { ko: "장터에서 장사", en: "Trading at the market", weight: { Merchant: 3 } },
    ],
  },
];

function HanbokSVG({ jeogori, chima, trim }: { jeogori: string; chima: string; trim: string }) {
  return (
    <svg viewBox="0 0 200 280" className="h-72 w-auto md:h-96">
      <ellipse cx="100" cy="40" rx="22" ry="26" fill="#F4D7B5" />
      <path d="M 78 30 Q 100 15 122 30 Q 120 22 100 18 Q 80 22 78 30 Z" fill="#1A1A1A" />
      <path
        d="M 60 75 Q 100 60 140 75 L 155 130 Q 120 140 100 135 Q 80 140 45 130 Z"
        fill={jeogori} stroke={trim} strokeWidth="2"
      />
      <path d="M 100 75 L 100 135" stroke={trim} strokeWidth="2" />
      <path d="M 95 75 Q 100 85 105 75" fill={trim} />
      <path d="M 60 75 Q 35 100 30 130 L 45 130 Q 50 100 60 80 Z" fill={jeogori} stroke={trim} strokeWidth="1.5" />
      <path d="M 140 75 Q 165 100 170 130 L 155 130 Q 150 100 140 80 Z" fill={jeogori} stroke={trim} strokeWidth="1.5" />
      <path
        d="M 45 130 Q 100 120 155 130 L 175 270 L 25 270 Z"
        fill={chima} stroke={trim} strokeWidth="2"
      />
      <path d="M 60 150 L 50 270" stroke={trim} strokeWidth="0.5" opacity="0.4" />
      <path d="M 100 145 L 100 270" stroke={trim} strokeWidth="0.5" opacity="0.4" />
      <path d="M 140 150 L 150 270" stroke={trim} strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export default function HanbokGame() {
  const [lang, setLang] = useState<"en" | "ko">("en");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Role, number>>({
    Scholar: 0, General: 0, Princess: 0, King: 0, Merchant: 0, Farmer: 0,
  });
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (step < QUESTIONS.length) return null;
    const top = (Object.entries(scores) as [Role, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    return { role: top, ...ROLE_DATA[top] };
  }, [step, scores]);

  const select = (weight: Partial<Record<Role, number>>) => {
    setScores((s) => {
      const next = { ...s };
      for (const k of Object.keys(weight) as Role[]) {
        next[k] += weight[k] ?? 0;
      }
      return next;
    });
    setStep((x) => x + 1);
  };

  const restart = () => {
    setStep(0);
    setScores({ Scholar: 0, General: 0, Princess: 0, King: 0, Merchant: 0, Farmer: 0 });
  };

  const handleShare = async () => {
    if (!result) return;
    const text =
      lang === "en"
        ? `My Hanbok Style: ${result.en} ${result.emoji} → nolza.fun/games/hanbok`
        : `나의 한복 스타일: ${result.ko} ${result.emoji} → nolza.fun/games/hanbok`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const t = (en: string, ko: string) => (lang === "en" ? en : ko);
  const current = QUESTIONS[step];

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border" style={{ background: "linear-gradient(90deg, rgba(255,59,48,0.04), rgba(255,215,0,0.04), rgba(52,199,89,0.04), rgba(0,122,255,0.04), rgba(175,82,222,0.04))" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <button
            type="button"
            onClick={() => setLang((l) => (l === "en" ? "ko" : "en"))}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-accent"
          >
            {lang === "en" ? "🌐 한국어" : "🌐 EN"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("My Hanbok Style", "나의 한복 스타일")} 🇰🇷
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "Discover your Joseon-era role and traditional Korean attire.",
              "조선시대의 신분과 어울리는 한복을 알려드려요.",
            )}
          </p>
        </header>

        {!result && current && (
          <>
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
              <div className="h-full bg-accent transition-[width]" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="text-xs text-accent">Q{step + 1}/{QUESTIONS.length}</div>
              <div className="mt-3 text-xl font-bold md:text-2xl">{t(current.en, current.ko)}</div>
              <div className="mt-6 flex flex-col gap-2">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => select(opt.weight)}
                    className="rounded-xl border border-border bg-bg px-4 py-3 text-left text-sm hover:border-accent md:text-base"
                  >
                    {t(opt.en, opt.ko)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <HanbokSVG
                  jeogori={result.jeogori}
                  chima={result.chima}
                  trim={result.trim}
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="text-7xl">{result.emoji}</div>
                  <div className="mt-3 text-xs text-accent">
                    {t("Your Joseon Role", "조선시대 신분")}
                  </div>
                  <div className="mt-1 text-3xl font-black md:text-4xl">
                    {t(result.en, result.ko)}
                  </div>
                  <p className="mt-3 text-sm text-gray-300 md:text-base">
                    {t(result.desc.en, result.desc.ko)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-block h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: result.jeogori }} />
                    <span className="inline-block h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: result.chima }} />
                    <span className="inline-block h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: result.trim }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={restart} className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ {t("Try Again", "다시")}
              </button>
              <button type="button" onClick={handleShare} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓" : "📋"} {t("Share Result", "공유")}
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
