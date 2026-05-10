"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Choice = { ko: string; en: string; value: string };
type QDef = {
  ko: string;
  en: string;
  key: "job" | "personality" | "setting" | "love";
  options: Choice[];
};

const QUESTIONS: QDef[] = [
  {
    ko: "당신의 직업은?", en: "Your job?", key: "job",
    options: [
      { ko: "재벌 후계자", en: "Chaebol heir", value: "재벌" },
      { ko: "의사", en: "Doctor", value: "의사" },
      { ko: "형사/검사", en: "Detective", value: "형사" },
      { ko: "평범한 직장인", en: "Office worker", value: "직장인" },
    ],
  },
  {
    ko: "성격은?", en: "Personality?", key: "personality",
    options: [
      { ko: "차갑고 도도", en: "Cold & aloof", value: "차가움" },
      { ko: "밝고 긍정", en: "Bright", value: "밝음" },
      { ko: "조용하고 신비", en: "Mysterious", value: "신비" },
    ],
  },
  {
    ko: "드라마 배경은?", en: "Setting?", key: "setting",
    options: [
      { ko: "현대 서울", en: "Modern Seoul", value: "현대" },
      { ko: "조선시대", en: "Joseon Dynasty", value: "사극" },
      { ko: "좀비 아포칼립스", en: "Zombie apocalypse", value: "좀비" },
      { ko: "판타지/타임슬립", en: "Fantasy / time travel", value: "판타지" },
    ],
  },
  {
    ko: "첫사랑과의 관계?", en: "First love?", key: "love",
    options: [
      { ko: "이미 만났는데 모름", en: "Already met, didn't realize", value: "첫사랑" },
      { ko: "철천지 원수", en: "Sworn enemies", value: "원수" },
      { ko: "출생의 비밀", en: "Birth secret", value: "비밀" },
      { ko: "삼각관계", en: "Love triangle", value: "삼각관계" },
    ],
  },
  {
    ko: "당신의 가족은?", en: "Your family?", key: "job",
    options: [
      { ko: "엄청난 부자", en: "Super rich", value: "재벌" },
      { ko: "의사 집안", en: "Family of doctors", value: "의사" },
      { ko: "법조인 집안", en: "Family of lawyers", value: "형사" },
      { ko: "평범한 가족", en: "Average family", value: "직장인" },
    ],
  },
  {
    ko: "위기 상황에서?", en: "In a crisis?", key: "personality",
    options: [
      { ko: "냉정하게 분석", en: "Analyze coolly", value: "차가움" },
      { ko: "긍정으로 돌파", en: "Push through", value: "밝음" },
      { ko: "조용히 관찰", en: "Observe silently", value: "신비" },
    ],
  },
  {
    ko: "당신의 패션은?", en: "Your fashion?", key: "setting",
    options: [
      { ko: "명품 정장", en: "Designer suit", value: "현대" },
      { ko: "한복/도포", en: "Hanbok/Dopo", value: "사극" },
      { ko: "야상점퍼+무기", en: "Tactical jacket", value: "좀비" },
      { ko: "판타지스러운 의상", en: "Fantasy outfit", value: "판타지" },
    ],
  },
  {
    ko: "갈등 해결 방법?", en: "Conflict resolution?", key: "love",
    options: [
      { ko: "오해 풀고 화해", en: "Clear misunderstandings", value: "첫사랑" },
      { ko: "끝까지 싸움", en: "Fight to the end", value: "원수" },
      { ko: "비밀 폭로", en: "Reveal a secret", value: "비밀" },
      { ko: "한 명을 선택", en: "Choose one", value: "삼각관계" },
    ],
  },
];

const COSTARS = ["현빈","공유","박서준","이병헌","송중기","박보검","수지","송혜교","전지현","아이유","박은빈"];
const RATINGS = [
  { range: "10-15%", desc: "안정적인 흥행" },
  { range: "15-20%", desc: "케이블 대박" },
  { range: "20-25%", desc: "공중파 핫" },
  { range: "25-30%", desc: "사회적 신드롬" },
  { range: "30%+", desc: "전설의 명작" },
];

function generateTitle(answers: Record<string, string>): { ko: string; en: string } {
  const j = answers.job, s = answers.setting, l = answers.love;
  if (s === "사극") return { ko: j === "재벌" ? "왕가의 비밀" : "조선의 명탐정", en: j === "재벌" ? "Royal Secret" : "Joseon Detective" };
  if (s === "좀비") return { ko: "끝까지 살아남기", en: "Last Stand" };
  if (s === "판타지") return { ko: "시간을 거스르다", en: "Against Time" };
  if (l === "원수") return { ko: j === "재벌" ? "재벌가의 적" : "복수의 시간", en: j === "재벌" ? "Enemy of the Heir" : "Time of Revenge" };
  if (l === "비밀") return { ko: j === "재벌" ? "재벌가의 숨겨진 딸" : "출생의 비밀", en: j === "재벌" ? "Hidden Heiress" : "The Secret" };
  if (l === "삼각관계") return { ko: "둘 사이에서", en: "Between Two" };
  if (j === "의사") return { ko: "심장 박동", en: "Heartbeat" };
  if (j === "형사") return { ko: "사건의 끝", en: "End of the Case" };
  if (j === "재벌") return { ko: "그 남자의 회사", en: "His Company" };
  return { ko: "오늘도 평범하게", en: "Just an Ordinary Day" };
}

export default function KdramaTrope() {
  const [lang, setLang] = useState<"en" | "ko">("en");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const result = useMemo(() => {
    if (step < QUESTIONS.length) return null;
    const title = generateTitle(answers);
    let h = 0;
    const seedStr = JSON.stringify(answers);
    for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) | 0;
    h = Math.abs(h);
    return {
      title,
      costar: COSTARS[h % COSTARS.length],
      rating: RATINGS[(h >> 3) % RATINGS.length],
    };
  }, [step, answers]);

  const select = (val: string) => {
    const q = QUESTIONS[step];
    setAnswers((a) => ({ ...a, [q.key]: val }));
    setStep((s) => s + 1);
  };
  const restart = () => { setStep(0); setAnswers({}); };
  const t = (en: string, ko: string) => (lang === "en" ? en : ko);
  const current = QUESTIONS[step];

  return (
    <main
      className="min-h-screen page-in"
      style={{
        background: "linear-gradient(135deg, #1a0a0a 0%, #4a0e0e 50%, #1a0a0a 100%)",
        color: "#FFD700",
        fontFamily: "var(--font-inter)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home" style={{ color: "rgba(255,215,0,0.7)" }}>
        ←
      </Link>
      <button
        type="button"
        onClick={() => setLang((l) => (l === "en" ? "ko" : "en"))}
        className="fixed right-5 top-5 z-50 rounded-full transition-colors"
        style={{
          fontSize: 13, color: "rgba(255,215,0,0.7)",
          padding: "6px 12px", background: "rgba(255,215,0,0.05)",
          border: "1px solid rgba(255,215,0,0.2)", letterSpacing: "0.1em",
        }}
      >
        {lang === "en" ? "한" : "EN"}
      </button>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 pb-16 pt-20">
        {!result && current && (
          <div className="w-full text-center" key={step}>
            <div
              className="fade-in"
              style={{
                fontSize: 13, color: "rgba(255,215,0,0.5)",
                letterSpacing: "0.3em", marginBottom: 32,
              }}
            >
              EPISODE {step + 1} / {QUESTIONS.length}
            </div>
            <h2
              className="fade-in"
              style={{
                fontSize: 28, fontWeight: 400,
                color: "#FFD700", marginBottom: 48,
              }}
            >
              {t(current.en, current.ko)}
            </h2>
            <div className="space-y-3">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(opt.value)}
                  className="block w-full rounded-full transition-all"
                  style={{
                    background: "rgba(255, 215, 0, 0.05)",
                    border: "1px solid rgba(255, 215, 0, 0.3)",
                    color: "#FFD700",
                    padding: "14px 24px",
                    fontSize: 15,
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,215,0,0.15)";
                    e.currentTarget.style.borderColor = "#FFD700";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,215,0,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,215,0,0.3)";
                  }}
                >
                  {t(opt.en, opt.ko)}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="w-full max-w-md fade-in">
            <div
              className="rounded text-center"
              style={{
                background: "linear-gradient(180deg, #1a0a0a 0%, #2a0a0a 100%)",
                border: "1px solid #FFD700",
                padding: "48px 32px",
                boxShadow: "0 0 60px rgba(255, 215, 0, 0.15)",
              }}
            >
              <div
                style={{
                  fontSize: 13, letterSpacing: "0.3em",
                  color: "rgba(255,215,0,0.7)",
                }}
              >
                NETFLIX ORIGINAL
              </div>
              <div
                style={{
                  marginTop: 24, fontSize: 16, fontWeight: 300,
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "0.05em",
                }}
              >
                {t("MY K-DRAMA", "내 K-드라마")}
              </div>
              <h1
                style={{
                  marginTop: 16, fontSize: 42, fontWeight: 900,
                  color: "#FFD700", lineHeight: 1.1,
                  textShadow: "0 0 30px rgba(255,215,0,0.4)",
                  fontFamily: lang === "ko" ? "var(--font-noto-serif-kr)" : "var(--font-inter)",
                }}
              >
                《{t(result.title.en, result.title.ko)}》
              </h1>
              <div
                style={{
                  marginTop: 32, paddingTop: 24,
                  borderTop: "1px solid rgba(255, 215, 0, 0.2)",
                  fontSize: 15, color: "#c4a960",
                  letterSpacing: "0.05em",
                  lineHeight: 1.8,
                }}
              >
                <div>
                  {t("STARRING", "주연")} · {t("YOU", "나")} & {result.costar}
                </div>
                <div>
                  {t("EXPECTED RATINGS", "예상 시청률")} · {result.rating.range}
                </div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
                  {result.rating.desc}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={restart}
                className="rounded-full transition-opacity"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,215,0,0.4)",
                  color: "#c4a960",
                  padding: "10px 28px",
                  fontSize: 14, letterSpacing: "0.2em",
                }}
              >
                NEW DRAMA
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
