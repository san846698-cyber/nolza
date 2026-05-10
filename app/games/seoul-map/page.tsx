"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type District = {
  name: string; en: string; row: number; col: number;
  famous: string;
};

const DISTRICTS: District[] = [
  { name: "강북구", en: "Gangbuk", row: 0, col: 2, famous: "북한산" },
  { name: "도봉구", en: "Dobong", row: 0, col: 3, famous: "도봉산" },
  { name: "노원구", en: "Nowon", row: 0, col: 4, famous: "롯데백화점, 학원가" },
  { name: "은평구", en: "Eunpyeong", row: 1, col: 1, famous: "은평한옥마을" },
  { name: "성북구", en: "Seongbuk", row: 1, col: 2, famous: "길음역" },
  { name: "도봉·중랑", en: "Jungnang", row: 1, col: 3, famous: "면목·상봉" },
  { name: "중랑구", en: "Jungnang", row: 1, col: 4, famous: "면목·상봉" },
  { name: "서대문구", en: "Seodaemun", row: 2, col: 1, famous: "연세대, 신촌" },
  { name: "종로구", en: "Jongno", row: 2, col: 2, famous: "경복궁, 인사동" },
  { name: "동대문구", en: "Dongdaemun", row: 2, col: 3, famous: "동대문시장, DDP" },
  { name: "광진구", en: "Gwangjin", row: 2, col: 4, famous: "건대, 어린이대공원" },
  { name: "마포구", en: "Mapo", row: 3, col: 1, famous: "홍대, 합정, 연남" },
  { name: "용산구", en: "Yongsan", row: 3, col: 2, famous: "이태원, 용산역" },
  { name: "중구", en: "Junggu", row: 3, col: 3, famous: "명동, 을지로" },
  { name: "성동구", en: "Seongdong", row: 3, col: 4, famous: "성수동, 서울숲" },
  { name: "강서구", en: "Gangseo", row: 4, col: 0, famous: "김포공항, 마곡" },
  { name: "양천구", en: "Yangcheon", row: 4, col: 1, famous: "목동" },
  { name: "영등포구", en: "Yeongdeungpo", row: 4, col: 2, famous: "여의도, IFC" },
  { name: "동작구", en: "Dongjak", row: 4, col: 3, famous: "노량진, 사당" },
  { name: "강동구", en: "Gangdong", row: 4, col: 5, famous: "천호, 둔촌" },
  { name: "구로구", en: "Guro", row: 5, col: 1, famous: "구로디지털단지" },
  { name: "관악구", en: "Gwanak", row: 5, col: 2, famous: "서울대, 신림" },
  { name: "서초구", en: "Seocho", row: 5, col: 3, famous: "강남역, 반포" },
  { name: "강남구", en: "Gangnam", row: 5, col: 4, famous: "압구정, 청담, 코엑스" },
  { name: "송파구", en: "Songpa", row: 5, col: 5, famous: "잠실, 롯데타워" },
  { name: "금천구", en: "Geumcheon", row: 6, col: 1, famous: "가산디지털" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SeoulMap() {
  const [mode, setMode] = useState<"explore" | "quiz">("explore");
  const [selected, setSelected] = useState<District | null>(null);
  const [quizList, setQuizList] = useState<District[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (mode === "quiz" && quizList.length === 0) {
      setQuizList(shuffle(DISTRICTS).slice(0, 10));
    }
  }, [mode, quizList.length]);

  const current = quizList[quizIdx];

  const onClick = (d: District) => {
    if (mode === "explore") { setSelected(d); return; }
    if (!current || feedback) return;
    if (d.name === current.name) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback(null);
      if (quizIdx + 1 >= 10) setDone(true);
      else setQuizIdx((i) => i + 1);
    }, 800);
  };

  const restart = () => {
    setQuizList(shuffle(DISTRICTS).slice(0, 10));
    setQuizIdx(0);
    setScore(0);
    setDone(false);
    setFeedback(null);
  };

  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: "#f5f5f0", color: "#1a1a1a" }}
    >
      <Link href="/" className="back-arrow" aria-label="home" style={{ color: "#5a5040" }}>
        ←
      </Link>

      <div className="mx-auto max-w-5xl px-6 pb-12 pt-20">
        <h1
          className="text-center"
          style={{
            fontSize: 16,
            color: "#888",
            letterSpacing: "0.3em",
            fontWeight: 300,
          }}
        >
          SEOUL · 서울
        </h1>

        <div className="mt-8 flex justify-center gap-2">
          {([
            { key: "explore", label: "EXPLORE" },
            { key: "quiz", label: "QUIZ" },
          ] as const).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => { setMode(m.key); setSelected(null); restart(); }}
              className="rounded-full transition-colors"
              style={{
                background: mode === m.key ? "#1a1a1a" : "transparent",
                color: mode === m.key ? "white" : "#888",
                border: mode === m.key ? "1px solid #1a1a1a" : "1px solid #ddd",
                padding: "8px 20px",
                fontSize: 13,
                letterSpacing: "0.2em",
                fontWeight: 500,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "quiz" && !done && current && (
          <div className="mt-8 text-center">
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.2em",
                color: "#888",
              }}
            >
              {quizIdx + 1} / 10 · FIND
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 32,
                fontWeight: 700,
                color: feedback === "correct" ? "#16a34a" : feedback === "wrong" ? "#FF3B30" : "#1a1a1a",
                transition: "color 0.2s",
              }}
            >
              {current.name}
              {feedback === "correct" && " ✓"}
              {feedback === "wrong" && " ✕"}
            </div>
          </div>
        )}

        <div
          className="mx-auto mt-10"
          style={{
            maxWidth: 600,
            background: "white",
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="grid grid-cols-6 gap-1.5 md:gap-2">
            {Array.from({ length: 7 * 6 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const d = DISTRICTS.find((x) => x.row === row && x.col === col);
              if (!d) return <div key={i} className="aspect-square" />;
              const isSelected = selected?.name === d.name;
              const isQuizCorrect = mode === "quiz" && current?.name === d.name && feedback === "correct";
              const isQuizWrong = mode === "quiz" && feedback === "wrong" && current?.name === d.name;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onClick(d)}
                  className="aspect-square rounded transition-all"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    background: isQuizCorrect
                      ? "rgba(22, 163, 74, 0.15)"
                      : isQuizWrong
                      ? "rgba(255, 59, 48, 0.15)"
                      : isSelected
                      ? "#1a1a1a"
                      : "white",
                    color: isSelected ? "white" : "#5a5040",
                    border: `1px solid ${isQuizCorrect ? "#16a34a" : isQuizWrong ? "#FF3B30" : isSelected ? "#1a1a1a" : "#e5e5e0"}`,
                    cursor: "pointer",
                  }}
                >
                  {d.name.replace(/[·구중랑]/g, "").slice(0, 2)}
                </button>
              );
            })}
          </div>
        </div>

        {mode === "explore" && selected && (
          <div
            className="mx-auto mt-6 max-w-md fade-in"
            style={{
              background: "white",
              padding: 24,
              borderRadius: 8,
              border: "1px solid #e5e5e0",
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#888" }}>
              {selected.en.toUpperCase()}
            </div>
            <div style={{ marginTop: 4, fontSize: 24, fontWeight: 700 }}>
              {selected.name}
            </div>
            <div style={{ marginTop: 12, fontSize: 16, color: "#5a5040" }}>
              {selected.famous}
            </div>
          </div>
        )}

        {mode === "quiz" && done && (
          <div
            className="mx-auto mt-8 max-w-md text-center fade-in"
            style={{
              background: "white",
              padding: 32,
              borderRadius: 8,
              border: "1px solid #e5e5e0",
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#888" }}>
              FINAL
            </div>
            <div
              className="tabular-nums"
              style={{
                marginTop: 8,
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {score}
              <span style={{ fontSize: 28, color: "#bbb" }}>/10</span>
            </div>
            <button
              type="button"
              onClick={restart}
              className="mt-8 rounded-full"
              style={{
                background: "#1a1a1a", color: "white",
                padding: "10px 28px", fontSize: 14, letterSpacing: "0.2em",
              }}
            >
              AGAIN
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
