"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Localized = { ko: string; en: string };

type Question = {
  q: Localized;
  options: Localized[];
  answer: number;
  explanation: Localized;
};

const QUESTIONS: Question[] = [
  {
    q: { ko: "한강의 총 길이는?", en: "How long is the Han River?" },
    options: [
      { ko: "약 314km", en: "About 314 km" },
      { ko: "약 514km", en: "About 514 km" },
      { ko: "약 714km", en: "About 714 km" },
      { ko: "약 914km", en: "About 914 km" },
    ],
    answer: 1,
    explanation: {
      ko: "한강의 총 길이는 약 514km입니다.",
      en: "The Han River is about 514 km long.",
    },
  },
  {
    q: {
      ko: "대한민국 국보 1호는?",
      en: "What is South Korea's National Treasure No. 1?",
    },
    options: [
      { ko: "광화문", en: "Gwanghwamun" },
      { ko: "숭례문(남대문)", en: "Sungnyemun (Namdaemun)" },
      { ko: "경복궁", en: "Gyeongbokgung Palace" },
      { ko: "흥인지문", en: "Heunginjimun" },
    ],
    answer: 1,
    explanation: {
      ko: "국보 1호는 숭례문입니다.",
      en: "National Treasure No. 1 is Sungnyemun.",
    },
  },
  {
    q: {
      ko: "남한에서 가장 높은 산은?",
      en: "What is the highest mountain in South Korea?",
    },
    options: [
      { ko: "한라산", en: "Hallasan" },
      { ko: "지리산", en: "Jirisan" },
      { ko: "설악산", en: "Seoraksan" },
      { ko: "태백산", en: "Taebaeksan" },
    ],
    answer: 0,
    explanation: {
      ko: "한라산(1,947m)이 남한 최고봉입니다.",
      en: "Hallasan (1,947 m) is the highest peak in South Korea.",
    },
  },
  {
    q: {
      ko: "한국의 국화는?",
      en: "What is the national flower of Korea?",
    },
    options: [
      { ko: "벚꽃", en: "Cherry blossom" },
      { ko: "무궁화", en: "Mugunghwa (rose of Sharon)" },
      { ko: "진달래", en: "Azalea" },
      { ko: "장미", en: "Rose" },
    ],
    answer: 1,
    explanation: {
      ko: "무궁화는 한국의 국화입니다.",
      en: "The mugunghwa (rose of Sharon) is Korea's national flower.",
    },
  },
  {
    q: {
      ko: "한국에서 가장 큰 섬은?",
      en: "What is the largest island in Korea?",
    },
    options: [
      { ko: "거제도", en: "Geojedo" },
      { ko: "강화도", en: "Ganghwado" },
      { ko: "제주도", en: "Jejudo" },
      { ko: "울릉도", en: "Ulleungdo" },
    ],
    answer: 2,
    explanation: {
      ko: "제주도가 한국에서 가장 큰 섬입니다.",
      en: "Jejudo is the largest island in Korea.",
    },
  },
  {
    q: {
      ko: "5만원권 화폐의 인물은?",
      en: "Who appears on the 50,000-won banknote?",
    },
    options: [
      { ko: "세종대왕", en: "King Sejong" },
      { ko: "이순신", en: "Yi Sun-sin" },
      { ko: "신사임당", en: "Shin Saimdang" },
      { ko: "이황", en: "Yi Hwang" },
    ],
    answer: 2,
    explanation: {
      ko: "5만원권 인물은 신사임당입니다.",
      en: "The 50,000-won note features Shin Saimdang.",
    },
  },
  {
    q: {
      ko: "만원권 화폐의 인물은?",
      en: "Who appears on the 10,000-won banknote?",
    },
    options: [
      { ko: "세종대왕", en: "King Sejong" },
      { ko: "이순신", en: "Yi Sun-sin" },
      { ko: "신사임당", en: "Shin Saimdang" },
      { ko: "이이", en: "Yi I" },
    ],
    answer: 0,
    explanation: {
      ko: "만원권 인물은 세종대왕입니다.",
      en: "The 10,000-won note features King Sejong.",
    },
  },
  {
    q: {
      ko: "한국전쟁(6.25)이 발발한 해는?",
      en: "In what year did the Korean War break out?",
    },
    options: [
      { ko: "1948년", en: "1948" },
      { ko: "1950년", en: "1950" },
      { ko: "1952년", en: "1952" },
      { ko: "1953년", en: "1953" },
    ],
    answer: 1,
    explanation: {
      ko: "1950년 6월 25일에 발발했습니다.",
      en: "It broke out on June 25, 1950.",
    },
  },
  {
    q: {
      ko: "광복절은 몇 월 며칠?",
      en: "On what date is National Liberation Day?",
    },
    options: [
      { ko: "3월 1일", en: "March 1" },
      { ko: "5월 5일", en: "May 5" },
      { ko: "6월 25일", en: "June 25" },
      { ko: "8월 15일", en: "August 15" },
    ],
    answer: 3,
    explanation: {
      ko: "1945년 8월 15일에 광복했습니다.",
      en: "Korea was liberated on August 15, 1945.",
    },
  },
  {
    q: {
      ko: "1988년 올림픽이 열린 도시는?",
      en: "Which city hosted the 1988 Olympics?",
    },
    options: [
      { ko: "서울", en: "Seoul" },
      { ko: "도쿄", en: "Tokyo" },
      { ko: "베이징", en: "Beijing" },
      { ko: "방콕", en: "Bangkok" },
    ],
    answer: 0,
    explanation: {
      ko: "1988년 서울 올림픽입니다.",
      en: "It was the 1988 Seoul Olympics.",
    },
  },
  {
    q: {
      ko: "한글을 만든 왕은?",
      en: "Which king created Hangeul?",
    },
    options: [
      { ko: "태조", en: "Taejo" },
      { ko: "태종", en: "Taejong" },
      { ko: "세종", en: "Sejong" },
      { ko: "성종", en: "Seongjong" },
    ],
    answer: 2,
    explanation: {
      ko: "세종대왕이 1443년 훈민정음을 창제했습니다.",
      en: "King Sejong created Hunminjeongeum in 1443.",
    },
  },
  {
    q: {
      ko: "한국어 자음의 개수는? (기본)",
      en: "How many basic consonants does the Korean alphabet have?",
    },
    options: [
      { ko: "10개", en: "10" },
      { ko: "14개", en: "14" },
      { ko: "20개", en: "20" },
      { ko: "24개", en: "24" },
    ],
    answer: 1,
    explanation: {
      ko: "기본 자음은 14개입니다 (ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ).",
      en: "There are 14 basic consonants (ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ).",
    },
  },
  {
    q: {
      ko: "현재 KBO 리그 팀 수는?",
      en: "How many teams are in the KBO League today?",
    },
    options: [
      { ko: "8팀", en: "8 teams" },
      { ko: "9팀", en: "9 teams" },
      { ko: "10팀", en: "10 teams" },
      { ko: "12팀", en: "12 teams" },
    ],
    answer: 2,
    explanation: {
      ko: "현재 KBO는 10개 구단입니다.",
      en: "The KBO currently has 10 clubs.",
    },
  },
  {
    q: {
      ko: "조선왕조의 창시자는?",
      en: "Who founded the Joseon dynasty?",
    },
    options: [
      { ko: "왕건", en: "Wang Geon" },
      { ko: "이성계", en: "Yi Seong-gye" },
      { ko: "이방원", en: "Yi Bang-won" },
      { ko: "정도전", en: "Jeong Do-jeon" },
    ],
    answer: 1,
    explanation: {
      ko: "이성계(태조)가 1392년 조선을 건국했습니다.",
      en: "Yi Seong-gye (King Taejo) founded Joseon in 1392.",
    },
  },
  {
    q: {
      ko: "한국에서 가장 인구가 많은 도시는?",
      en: "Which is the most populous city in Korea?",
    },
    options: [
      { ko: "부산", en: "Busan" },
      { ko: "인천", en: "Incheon" },
      { ko: "대구", en: "Daegu" },
      { ko: "서울", en: "Seoul" },
    ],
    answer: 3,
    explanation: {
      ko: "서울이 약 940만명으로 가장 많습니다.",
      en: "Seoul is the largest, with about 9.4 million people.",
    },
  },
  {
    q: {
      ko: "임진왜란이 일어난 해는?",
      en: "In what year did the Imjin War begin?",
    },
    options: [
      { ko: "1392년", en: "1392" },
      { ko: "1492년", en: "1492" },
      { ko: "1592년", en: "1592" },
      { ko: "1692년", en: "1692" },
    ],
    answer: 2,
    explanation: {
      ko: "1592년에 일어난 7년 전쟁입니다.",
      en: "It was a seven-year war that began in 1592.",
    },
  },
  {
    q: {
      ko: "DDP(동대문디자인플라자)를 설계한 건축가는?",
      en: "Which architect designed the DDP (Dongdaemun Design Plaza)?",
    },
    options: [
      { ko: "안도 다다오", en: "Tadao Ando" },
      { ko: "자하 하디드", en: "Zaha Hadid" },
      { ko: "프랭크 게리", en: "Frank Gehry" },
      { ko: "렘 콜하스", en: "Rem Koolhaas" },
    ],
    answer: 1,
    explanation: {
      ko: "이라크 출신 건축가 자하 하디드의 작품입니다.",
      en: "It is the work of Iraqi-born architect Zaha Hadid.",
    },
  },
  {
    q: {
      ko: "다음 중 한국 자동차 회사가 아닌 것은?",
      en: "Which of these is NOT a Korean car company?",
    },
    options: [
      { ko: "제네시스", en: "Genesis" },
      { ko: "혼다", en: "Honda" },
      { ko: "쌍용", en: "SsangYong" },
      { ko: "기아", en: "Kia" },
    ],
    answer: 1,
    explanation: {
      ko: "혼다는 일본 회사입니다.",
      en: "Honda is a Japanese company.",
    },
  },
  {
    q: {
      ko: "김치냉장고 '딤채'를 처음 만든 회사는?",
      en: "Which company first made the 'Dimchae' kimchi refrigerator?",
    },
    options: [
      { ko: "삼성", en: "Samsung" },
      { ko: "LG", en: "LG" },
      { ko: "위니아만도", en: "Winia Mando" },
      { ko: "대우", en: "Daewoo" },
    ],
    answer: 2,
    explanation: {
      ko: "1995년 위니아만도가 딤채를 출시했습니다.",
      en: "Winia Mando launched the Dimchae in 1995.",
    },
  },
  {
    q: {
      ko: "태극기 4괘 중 '하늘'을 의미하는 것은?",
      en: "Which of the four trigrams on the Taegukgi means 'heaven'?",
    },
    options: [
      { ko: "건(乾)", en: "Geon (乾)" },
      { ko: "곤(坤)", en: "Gon (坤)" },
      { ko: "감(坎)", en: "Gam (坎)" },
      { ko: "리(離)", en: "Ri (離)" },
    ],
    answer: 0,
    explanation: {
      ko: "건(乾)은 하늘, 곤(坤)은 땅을 의미합니다.",
      en: "Geon (乾) means heaven, and Gon (坤) means earth.",
    },
  },
  {
    q: {
      ko: "서울 지하철 1호선 개통 연도는?",
      en: "In what year did Seoul Subway Line 1 open?",
    },
    options: [
      { ko: "1969년", en: "1969" },
      { ko: "1974년", en: "1974" },
      { ko: "1980년", en: "1980" },
      { ko: "1988년", en: "1988" },
    ],
    answer: 1,
    explanation: {
      ko: "1974년 8월 15일에 개통되었습니다.",
      en: "It opened on August 15, 1974.",
    },
  },
  {
    q: {
      ko: "한국의 기대수명은? (2024년 기준 약)",
      en: "What is Korea's life expectancy? (approx., as of 2024)",
    },
    options: [
      { ko: "약 73세", en: "About 73 years" },
      { ko: "약 78세", en: "About 78 years" },
      { ko: "약 83세", en: "About 83 years" },
      { ko: "약 88세", en: "About 88 years" },
    ],
    answer: 2,
    explanation: {
      ko: "한국 기대수명은 약 83세입니다.",
      en: "Korea's life expectancy is about 83 years.",
    },
  },
];

const TIMER_PER_Q = 10;
const TOTAL_PICKS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(score: number): Localized {
  if (score === 10) return { ko: "👑 만점왕!", en: "👑 Perfect score!" };
  if (score >= 8) return { ko: "💯 한국 박사", en: "💯 Korea expert" };
  if (score >= 6) return { ko: "👍 평균 이상", en: "👍 Above average" };
  if (score >= 4) return { ko: "📚 다시 도전!", en: "📚 Try again!" };
  return { ko: "😅 한국에 더 관심을!", en: "😅 Get to know Korea more!" };
}

export default function KoreaQuiz() {
  const { t } = useLocale();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_Q);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setQuestions(shuffle(QUESTIONS).slice(0, TOTAL_PICKS));
  }, []);

  useEffect(() => {
    if (selected !== null || done || questions.length === 0) return;
    setTimeLeft(TIMER_PER_Q);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          clearInterval(interval);
          setSelected(-1);
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [idx, selected, done, questions.length]);

  const current = questions[idx];

  const handleSelect = (i: number) => {
    if (selected !== null || !current) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    if (idx + 1 >= TOTAL_PICKS) setDone(true);
    else setIdx((i) => i + 1);
  };

  const restart = () => {
    setQuestions(shuffle(QUESTIONS).slice(0, TOTAL_PICKS));
    setIdx(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  const handleShare = async () => {
    const grade = getGrade(score);
    const text = t(
      `한국 상식 퀴즈 ${score}/${TOTAL_PICKS}점 (${grade.ko}) → nolza.fun/games/korea-quiz`,
      `Korea Trivia Quiz ${score}/${TOTAL_PICKS} (${grade.en}) → nolza.fun/games/korea-quiz`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (questions.length === 0) {
    return <main className="min-h-screen bg-bg" />;
  }

  if (done) {
    return (
      <main className="min-h-screen bg-bg pb-32">
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              {t("← 놀자 홈으로", "← Back to Nolza home")}
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">{t("결과", "Result")}</div>
            <div className="mt-3 text-7xl font-black tabular-nums md:text-8xl">
              {score}
              <span className="text-4xl text-gray-500">/10</span>
            </div>
            <div className="mt-4 text-2xl font-bold md:text-3xl">
              {t(getGrade(score).ko, getGrade(score).en)}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
              >
                {t("↻ 다시 도전", "↻ Try again")}
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
          </div>
        </div>
      </main>
    );
  }

  const isCorrect = selected !== null && selected === current.answer;
  const showFeedback = selected !== null;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to Nolza home")}
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{idx + 1}</span>
            <span className="mx-1">/</span>
            <span>{TOTAL_PICKS}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl font-black md:text-4xl">
            {t("한국 상식 ", "Korea Trivia ")}
            <span className="text-accent">{t("퀴즈", "Quiz")}</span>
          </h1>
        </header>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
          <div
            className="h-full bg-accent transition-[width] duration-100"
            style={{ width: `${(timeLeft / TIMER_PER_Q) * 100}%` }}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">Q{idx + 1}</div>
          <div className="mt-3 text-xl font-bold leading-relaxed md:text-2xl">
            {t(current.q.ko, current.q.en)}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {current.options.map((opt, i) => {
              let cls = "border-border bg-bg hover:border-accent";
              if (showFeedback) {
                if (i === current.answer) cls = "border-emerald-500 bg-emerald-500/10";
                else if (i === selected) cls = "border-accent bg-accent/10";
                else cls = "border-border bg-bg opacity-60";
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={showFeedback}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors md:text-base ${cls}`}
                >
                  <span className="mr-3 font-bold text-gray-500">
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {t(opt.ko, opt.en)}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`mt-6 rounded-xl p-4 text-sm md:text-base ${
                isCorrect
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-accent/10 text-accent"
              }`}
            >
              <div className="font-bold">
                {selected === -1
                  ? t("⏰ 시간 초과", "⏰ Time's up")
                  : isCorrect
                    ? t("✓ 정답!", "✓ Correct!")
                    : t("✕ 오답", "✕ Wrong")}
              </div>
              <div className="mt-1 text-gray-300">
                {t(current.explanation.ko, current.explanation.en)}
              </div>
            </div>
          )}
        </div>

        {showFeedback && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90"
          >
            {idx + 1 >= TOTAL_PICKS
              ? t("결과 보기 →", "See results →")
              : t("다음 문제 →", "Next question →")}
          </button>
        )}

        <div className="mt-3 text-center text-xs text-gray-500">
          {t(`현재 점수: ${score}점`, `Current score: ${score}`)}
        </div>
      </div>
    </main>
  );
}
