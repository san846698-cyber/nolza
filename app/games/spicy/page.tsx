"use client";

import Link from "next/link";
import { useMemo, useState, type ReactElement } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

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

type LocaleText = { ko: string; en: string };

type Tier = {
  range: [number, number];
  emojiTitle: string;
  title: LocaleText;
  tagline: LocaleText;
  scoville: LocaleText;
  recommend: LocaleText;
  desc: LocaleText;
};

const TIERS: Tier[] = [
  {
    range: [0, 10],
    emojiTitle: "🥛",
    title: { ko: "순한맛 영혼", en: "Mild Soul" },
    tagline: {
      ko: "순한맛 영혼 — 매운맛보다 우유가 좋아요",
      en: "Mild Soul — you prefer milk over spice",
    },
    scoville: {
      ko: "0 — 500 SHU (피망 수준)",
      en: "0 — 500 SHU (bell pepper level)",
    },
    recommend: {
      ko: "순한 김밥이나 짜장면을 드세요. 빨간 양념은 피하는 게 좋아요.",
      en: "Try mild kimbap or jajangmyeon. Avoid the red sauces.",
    },
    desc: {
      ko: "매운 음식과 당신은 서로 멀리하기로 약속한 사이예요. 부끄러울 것 없어요 — 캡사이신이 전혀 필요 없는 훌륭한 요리도 많으니까요.",
      en: "Spicy food and you have an agreement: stay apart. No shame — many great cuisines need zero capsaicin.",
    },
  },
  {
    range: [11, 20],
    emojiTitle: "🌶",
    title: { ko: "보통맛 입문자", en: "Beginner" },
    tagline: {
      ko: "입문자 — 거의 다 왔어요! 계속 연습해요",
      en: "Beginner — getting there! Keep practicing",
    },
    scoville: {
      ko: "500 — 5,000 SHU (할라피뇨 영역)",
      en: "500 — 5,000 SHU (jalapeño territory)",
    },
    recommend: {
      ko: "오리지널 신라면이나 순한 떡볶이부터 시작해 보세요.",
      en: "Start with original Shin Ramyun or mild tteokbokki.",
    },
    desc: {
      ko: "약간의 매운맛은 견딜 수 있어요. 한국 음식이 당신에게 조금씩 열리고 있네요. 다음 목표는 김치찌개!",
      en: "You can handle a little heat. Korean food is opening up to you. Next stop: kimchi-jjigae.",
    },
  },
  {
    range: [21, 30],
    emojiTitle: "🌶🌶",
    title: { ko: "매운맛 중급자", en: "Intermediate" },
    tagline: {
      ko: "중급자 — 한국식 매운맛을 소화할 수 있어요!",
      en: "Intermediate — you can handle Korean spice!",
    },
    scoville: {
      ko: "5,000 — 30,000 SHU (청양고추 범위)",
      en: "5,000 — 30,000 SHU (Cheongyang range)",
    },
    recommend: {
      ko: "불닭볶음면 오리지널, 마라탕 3단계.",
      en: "Buldak Bokkeummyeon original, mala-tang level 3.",
    },
    desc: {
      ko: "대부분의 한국인이 존경의 눈빛으로 고개를 끄덕일 거예요. 당신은 실수가 아니라 일부러 매운 걸 먹는 사람이에요.",
      en: "Most Koreans would nod respectfully. You eat spicy on purpose, not by accident.",
    },
  },
  {
    range: [31, 40],
    emojiTitle: "🌶🌶🌶",
    title: { ko: "불닭 마스터", en: "Buldak Master" },
    tagline: {
      ko: "불닭 마스터 — 한국인도 감탄할 실력",
      en: "Buldak Master — Koreans would be impressed",
    },
    scoville: {
      ko: "30,000 — 100,000 SHU (하바네로 구간)",
      en: "30,000 — 100,000 SHU (habanero zone)",
    },
    recommend: {
      ko: "불닭 2배매운맛, 엽기떡볶이, 마라샹궈.",
      en: "2x Buldak, Yeopgi Tteokbokki, mala xiangguo.",
    },
    desc: {
      ko: "당신은 그냥 땀을 흘리는 게 아니라 전략적으로 땀을 흘려요. 식당이 경고해도 당신은 웃어넘기죠.",
      en: "You don't sweat — you sweat strategically. Restaurants warn you and you laugh.",
    },
  },
  {
    range: [41, 999],
    emojiTitle: "🌶🌶🌶🌶🌶",
    title: { ko: "김치의 신", en: "God of Kimchi" },
    tagline: {
      ko: "김치의 신 — 마음만은 진짜 한국인",
      en: "God of Kimchi — you ARE Korean at heart",
    },
    scoville: {
      ko: "1,000,000+ SHU (귀신고추 이상)",
      en: "1,000,000+ SHU (ghost pepper +)",
    },
    recommend: {
      ko: "핵불닭. 귀신고추 라면. 진열대에서 가장 매운 거라면 뭐든지.",
      en: "Nuclear Buldak. Ghost pepper noodles. Whatever's hottest on the shelf.",
    },
    desc: {
      ko: "아마 고추장을 음료수처럼 마실 거예요. 당신의 땀으로 음식 간을 맞출 수도 있겠네요. 존경합니다.",
      en: "You probably drink gochujang as a beverage. Your sweat could season food. Respect.",
    },
  },
];

function tierFor(score: number): Tier {
  return TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ?? TIERS[0];
}

// ============================================================
// Page
// ============================================================

export default function SpicyPage(): ReactElement {
  const { t, locale } = useLocale();
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
    const title = locale === "ko" ? tier.title.ko : tier.title.en;
    const text = t(
      `내 한국 매운맛 레벨: ${tier.emojiTitle} ${title}\n나 이길 수 있어? → nolza.fun/games/spicy`,
      `My Korean spice level: ${tier.emojiTitle} ${title}\nCan you beat me? → nolza.fun/games/spicy`,
    );
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
        aria-label={t("홈", "home")}
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
              {t("한국 매운맛 내성 테스트", "KOREAN SPICE TOLERANCE TEST")}
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
              {locale === "ko" ? (
                <>당신은 정말 <br /> 얼마나 매운 걸 견딜 수 있나요?</>
              ) : (
                <>How spicy can <br /> you really handle?</>
              )}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
              {locale === "ko" ? (
                <>한국 매운 음식에 관한 20개의 예/아니오 질문.<br />당신의 매운맛 레벨이 진짜 어디쯤인지 알아보세요.</>
              ) : (
                <>20 yes/no questions about Korean spicy food.<br />Find out where your spice level really sits.</>
              )}
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
              {t("시작", "START")}
            </button>
          </div>
        )}

        {started && !done && current && (
          <div>
            {/* Progress + counter */}
            <div className="flex justify-between" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.1em" }}>
              <span>{idx + 1} / {QUESTIONS.length}</span>
              <span style={{ color: ACCENT, fontWeight: 700 }}>{t(`YES면 +${current.weight}점`, `+${current.weight} pts if YES`)}</span>
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
                {t("네", "YES")}
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
                {t("아니오", "NO")}
              </button>
            </div>
          </div>
        )}

        {started && done && (
          <div className="text-center pt-8">
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              {t("당신의 매운맛 레벨", "YOUR SPICE LEVEL")}
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
              {t(tier.title.ko, tier.title.en)}
            </h1>
            <p style={{ fontSize: 15, color: ACCENT, marginBottom: 28, fontWeight: 600 }}>
              {t(tier.tagline.ko, tier.tagline.en)}
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
              {t(`${score} / ${TOTAL_MAX}점`, `${score} / ${TOTAL_MAX} points`)}
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", marginBottom: 28, padding: "0 8px" }}>
              {t(tier.desc.ko, tier.desc.en)}
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
                {t("스코빌 환산", "SCOVILLE EQUIVALENT")}
              </div>
              <div style={{ fontSize: 16, color: "#fff", marginBottom: 18 }}>{t(tier.scoville.ko, tier.scoville.en)}</div>
              <div style={{ fontSize: 13, letterSpacing: "0.2em", color: ACCENT, marginBottom: 6, fontWeight: 700 }}>
                {t("다음 도전", "TRY NEXT")}
              </div>
              <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.5 }}>{t(tier.recommend.ko, tier.recommend.en)}</div>
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
                {copied ? t("복사됨", "COPIED") : t("결과 공유", "SHARE RESULT")}
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
                {t("다시 하기", "AGAIN")}
              </button>
            </div>
          </div>
        )}
      </div>

      <AdMobileSticky />
    </main>
  );
}
