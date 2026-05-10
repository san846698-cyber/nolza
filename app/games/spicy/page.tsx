"use client";

import Link from "next/link";
import { useMemo, useState, type ReactElement } from "react";
import { AdMobileSticky } from "../../components/Ads";

// ============================================================
// Types
// ============================================================

type Q = {
  ko: string;
  en: string;
  weight: 1 | 2 | 3 | 5;
  emoji: string;
};

const ACCENT = "#FF3B30";
const BG = "#1a0000";

// ============================================================
// Questions — weighted by tier
// ============================================================

const QUESTIONS: Q[] = [
  // Beginner — 1 point each
  { ko: "청양고추 먹어봤어요?", en: "Tried Cheongyang chili pepper?", weight: 1, emoji: "🌶️" },
  { ko: "김치찌개 먹어봤어요?", en: "Tried Kimchi-jjigae (kimchi stew)?", weight: 1, emoji: "🥘" },
  { ko: "떡볶이 먹어봤어요?", en: "Tried Tteokbokki (spicy rice cakes)?", weight: 1, emoji: "🍢" },
  { ko: "라면 먹어봤어요?", en: "Tried Korean ramyun?", weight: 1, emoji: "🍜" },
  { ko: "김치 먹어봤어요?", en: "Tried Kimchi?", weight: 1, emoji: "🥬" },

  // Intermediate — 2 points each
  { ko: "불닭볶음면 먹어봤어요?", en: "Tried Buldak Bokkeummyeon (Fire Noodles)?", weight: 2, emoji: "🔥" },
  { ko: "마라탕 먹어봤어요?", en: "Tried Mala-tang (numbing soup)?", weight: 2, emoji: "🌶️" },
  { ko: "엽기떡볶이 먹어봤어요?", en: "Tried Yeopgi Tteokbokki (insanely spicy)?", weight: 2, emoji: "🍢" },
  { ko: "청양고추 날로 먹어봤어요?", en: "Eaten raw Cheongyang chili?", weight: 2, emoji: "🌶️" },
  { ko: "순대국밥 먹어봤어요?", en: "Tried Sundae-gukbap?", weight: 2, emoji: "🍲" },

  // Advanced — 3 points each
  { ko: "불닭볶음면 2배매운맛 먹어봤어요?", en: "Tried 2x Spicy Buldak?", weight: 3, emoji: "🔥" },
  { ko: "마라샹궈 먹어봤어요?", en: "Tried Mala Xiangguo (dry mala)?", weight: 3, emoji: "🌶️" },
  { ko: "핵불닭 먹어봤어요?", en: "Tried Nuclear Buldak?", weight: 3, emoji: "☢️" },
  { ko: "청양고추 3개 이상 한번에?", en: "3+ Cheongyang chilies in one bite?", weight: 3, emoji: "🌶️🌶️🌶️" },
  { ko: "불닭 챌린지 완료했어요?", en: "Completed the Buldak Challenge?", weight: 3, emoji: "🏆" },

  // Expert — 5 points each
  { ko: "하바네로 먹어봤어요?", en: "Tried Habanero pepper?", weight: 5, emoji: "🌶️" },
  { ko: "귀신고추(부트졸로키아) 먹어봤어요?", en: "Tried Ghost Pepper (Bhut Jolokia)?", weight: 5, emoji: "👻" },
  { ko: "까르보 불닭 먹어봤어요?", en: "Tried Carbo Buldak?", weight: 5, emoji: "🍝" },
  { ko: "매운 라면 10분 안에 완식?", en: "Finished spicy ramyun in under 10 min?", weight: 5, emoji: "⏱️" },
  { ko: "매운 음식 먹고 땀 안 난 적 있어요?", en: "Eaten something spicy without breaking a sweat?", weight: 5, emoji: "🥶" },
];

const TOTAL_MAX = QUESTIONS.reduce((s, q) => s + q.weight, 0); // 55

// ============================================================
// Result tiers
// ============================================================

type Tier = {
  range: [number, number];
  emojiTitle: string;
  ko: string;
  enTagline: string;
  scoville: string;
  recommend: string;
  desc: string;
};

const TIERS: Tier[] = [
  {
    range: [0, 10],
    emojiTitle: "🥛",
    ko: "순한맛 영혼",
    enTagline: "Mild Soul — you prefer milk over spice",
    scoville: "0 — 500 SHU (bell pepper level)",
    recommend: "Try mild kimbap or jajangmyeon. Avoid the red sauces.",
    desc: "Spicy food and you have an agreement: stay apart. No shame — many great cuisines need zero capsaicin.",
  },
  {
    range: [11, 20],
    emojiTitle: "🌶",
    ko: "보통맛 입문자",
    enTagline: "Beginner — getting there! Keep practicing",
    scoville: "500 — 5,000 SHU (jalapeño territory)",
    recommend: "Start with original Shin Ramyun or mild tteokbokki.",
    desc: "You can handle a little heat. Korean food is opening up to you. Next stop: kimchi-jjigae.",
  },
  {
    range: [21, 30],
    emojiTitle: "🌶🌶",
    ko: "매운맛 중급자",
    enTagline: "Intermediate — you can handle Korean spice!",
    scoville: "5,000 — 30,000 SHU (Cheongyang range)",
    recommend: "Buldak Bokkeummyeon original, mala-tang level 3.",
    desc: "Most Koreans would nod respectfully. You eat spicy on purpose, not by accident.",
  },
  {
    range: [31, 40],
    emojiTitle: "🌶🌶🌶",
    ko: "불닭 마스터",
    enTagline: "Buldak Master — Koreans would be impressed",
    scoville: "30,000 — 100,000 SHU (habanero zone)",
    recommend: "2x Buldak, Yeopgi Tteokbokki, mala xiangguo.",
    desc: "You don't sweat — you sweat strategically. Restaurants warn you and you laugh.",
  },
  {
    range: [41, 999],
    emojiTitle: "🌶🌶🌶🌶🌶",
    ko: "김치의 신",
    enTagline: "God of Kimchi — you ARE Korean at heart",
    scoville: "1,000,000+ SHU (ghost pepper +)",
    recommend: "Nuclear Buldak. Ghost pepper noodles. Whatever's hottest on the shelf.",
    desc: "You probably drink gochujang as a beverage. Your sweat could season food. Respect.",
  },
];

function tierFor(score: number): Tier {
  return TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ?? TIERS[0];
}

// ============================================================
// Page
// ============================================================

export default function SpicyPage(): ReactElement {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const current = QUESTIONS[idx];

  const begin = () => {
    setIdx(0);
    setScore(0);
    setDone(false);
    setStarted(true);
  };

  const restart = () => {
    setStarted(false);
    setDone(false);
    setIdx(0);
    setScore(0);
  };

  const answer = (yes: boolean) => {
    const newScore = score + (yes ? current.weight : 0);
    if (idx + 1 >= QUESTIONS.length) {
      setScore(newScore);
      setDone(true);
      return;
    }
    setScore(newScore);
    setIdx((i) => i + 1);
  };

  const tier = useMemo(() => tierFor(score), [score]);

  const onShare = () => {
    const text = `My Korean spice level: ${tier.emojiTitle} ${tier.ko}\nCan you beat me? → nolza.fun/games/spicy`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); })
        .catch(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); });
    } else {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPct = (idx / QUESTIONS.length) * 100;

  return (
    <main
      className="page-in min-h-screen relative"
      style={{
        background: BG,
        color: "#fff",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        paddingBottom: 100,
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(255,59,48,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(255,59,48,0.08) 0%, transparent 60%)",
      }}
    >
      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: "rgba(255,255,255,0.7)",
          textDecoration: "none",
        }}
      >
        ←
      </Link>

      <div className="mx-auto max-w-xl px-6 pt-20">
        {!started && (
          <div className="text-center pt-12">
            <div style={{ fontSize: 64, marginBottom: 12, lineHeight: 1 }}>🌶️🌶️🌶️</div>
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              KOREAN SPICE TOLERANCE TEST
            </p>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                marginBottom: 20,
                color: "#fff",
              }}
            >
              How spicy can <br /> you really handle?
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
              20 yes/no questions about Korean spicy food.
              <br />Find out where your spice level really sits.
            </p>
            <button
              type="button"
              onClick={begin}
              style={{
                background: ACCENT,
                color: "#fff",
                border: "none",
                padding: "16px 48px",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.2em",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(255,59,48,0.35)",
              }}
            >
              START
            </button>
          </div>
        )}

        {started && !done && current && (
          <div>
            {/* Progress + counter */}
            <div className="flex justify-between" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.1em" }}>
              <span>{idx + 1} / {QUESTIONS.length}</span>
              <span style={{ color: ACCENT, fontWeight: 700 }}>+{current.weight} pts if YES</span>
            </div>
            <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 40 }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  background: ACCENT,
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Question card */}
            <div
              style={{
                textAlign: "center",
                padding: "40px 24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>{current.emoji}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "var(--font-noto-sans-kr)",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {current.ko}
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                {current.en}
              </div>
            </div>

            {/* Yes / No */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => answer(true)}
                style={{
                  background: ACCENT,
                  color: "#fff",
                  border: "none",
                  padding: "20px",
                  borderRadius: 14,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "transform 0.1s ease, box-shadow 0.1s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => answer(false)}
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "20px",
                  borderRadius: 14,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "transform 0.1s ease, background 0.1s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                NO
              </button>
            </div>
          </div>
        )}

        {started && done && (
          <div className="text-center pt-8">
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              YOUR SPICE LEVEL
            </p>
            <div
              style={{
                fontSize: 64,
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              {tier.emojiTitle}
            </div>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 8,
                fontFamily: "var(--font-noto-sans-kr)",
              }}
            >
              {tier.ko}
            </h1>
            <p style={{ fontSize: 15, color: ACCENT, marginBottom: 28, fontWeight: 600 }}>
              {tier.enTagline}
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "8px 20px",
                background: "rgba(255,59,48,0.15)",
                color: "#fff",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 32,
              }}
            >
              {score} / {TOTAL_MAX} points
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", marginBottom: 28, padding: "0 8px" }}>
              {tier.desc}
            </p>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 32,
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 13, letterSpacing: "0.2em", color: ACCENT, marginBottom: 6, fontWeight: 700 }}>
                SCOVILLE EQUIVALENT
              </div>
              <div style={{ fontSize: 16, color: "#fff", marginBottom: 18 }}>{tier.scoville}</div>
              <div style={{ fontSize: 13, letterSpacing: "0.2em", color: ACCENT, marginBottom: 6, fontWeight: 700 }}>
                TRY NEXT
              </div>
              <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.5 }}>{tier.recommend}</div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                type="button"
                onClick={onShare}
                style={{
                  background: ACCENT,
                  color: "#fff",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
              >
                {copied ? "COPIED" : "SHARE RESULT"}
              </button>
              <button
                type="button"
                onClick={restart}
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "14px 32px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
              >
                AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      <AdMobileSticky />
    </main>
  );
}
