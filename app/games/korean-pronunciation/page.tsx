"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { AdMobileSticky } from "../../components/Ads";

// ============================================================
// Word pool — first option in each row is the correct romanization
// ============================================================

type Word = {
  hangul: string;
  options: [string, string, string, string]; // index 0 = correct
};

const POOL: Word[] = [
  { hangul: "오빠", options: ["oppa", "obba", "opa", "oppha"] },
  { hangul: "언니", options: ["eonni", "unni", "eoni", "uni"] },
  { hangul: "화이팅", options: ["hwaiting", "fighting", "hwiting", "faiting"] },
  { hangul: "대박", options: ["daebak", "debak", "daeback", "deabak"] },
  { hangul: "귀여워", options: ["gwiyeowo", "kiyowo", "gwiyowo", "kiyeowo"] },
  { hangul: "사랑해", options: ["saranghae", "saranghe", "salanghae", "saranghay"] },
  { hangul: "아이고", options: ["aigo", "aygo", "aego", "aigu"] },
  { hangul: "빨리빨리", options: ["ppalli ppalli", "balli balli", "ppali ppali", "pali pali"] },
  { hangul: "맛있어", options: ["masisseo", "matisseo", "masiso", "matiseo"] },
  { hangul: "잠깐만", options: ["jamkkanman", "chamkkanman", "jamkanman", "chamkanman"] },
  { hangul: "괜찮아", options: ["gwaenchana", "kwenchana", "gwaenchanha", "kwenchanha"] },
  { hangul: "진짜", options: ["jinjja", "chicha", "jinja", "chincha"] },
  { hangul: "행복해", options: ["haengbokhae", "haengbokhe", "hengbokhae", "haengbokhai"] },
  { hangul: "노래해", options: ["noraehae", "nolahae", "noraehai", "nolaehai"] },
  { hangul: "예쁘다", options: ["yeppeuda", "yeppuda", "yepeuda", "yeppueda"] },
  { hangul: "멋있어", options: ["meositsseo", "mossisseo", "meositseo", "meosisseo"] },
  { hangul: "파이팅", options: ["paiting", "fighting", "faiting", "phaiting"] },
  { hangul: "어떻게", options: ["eotteoke", "otoke", "eottoke", "otokeyo"] },
  { hangul: "할수있어", options: ["halsu isseo", "halsu isso", "halsseu isseo", "halseu isso"] },
  { hangul: "감사합니다", options: ["gamsahamnida", "kamsahamnida", "gamsahabnida", "kamsahabmnida"] },
  { hangul: "죄송합니다", options: ["joesonghamnida", "jwesonghamnida", "joseonghamnida", "jweseonghabnida"] },
  { hangul: "안녕하세요", options: ["annyeonghaseyo", "annyonghaseyo", "anyeonghaseyo", "annyeonghaseoyo"] },
  { hangul: "반갑습니다", options: ["bangapseumnida", "bangabseumnida", "bangapsumnida", "bangabsumnida"] },
  { hangul: "고마워", options: ["gomawo", "komawo", "gomaeo", "komaeo"] },
  { hangul: "배고파", options: ["baegopa", "begopa", "baegoppa", "begoppa"] },
  { hangul: "졸려", options: ["jollyeo", "chollyeo", "jolleo", "cholleo"] },
  { hangul: "피곤해", options: ["pigonhae", "pikkonhae", "pigonhe", "pikonhae"] },
  { hangul: "기다려", options: ["gidaryeo", "kidaryeo", "gidalyeo", "kidalyeo"] },
  { hangul: "사람", options: ["saram", "shalram", "sarham", "salram"] },
  { hangul: "나중에", options: ["najunge", "nachunge", "najungey", "nachungey"] },
];

const QUIZ_LEN = 15;
const TIME_PER_Q = 10;
const ACCENT = "#FF3B30";
const BG = "#fafafa";

// ============================================================
// Helpers
// ============================================================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Question = {
  hangul: string;
  options: string[];
  correctIdx: number;
};

function buildQuiz(): Question[] {
  return shuffle(POOL).slice(0, QUIZ_LEN).map((w) => {
    const correct = w.options[0];
    const opts = shuffle(w.options as unknown as string[]);
    return {
      hangul: w.hangul,
      options: opts,
      correctIdx: opts.indexOf(correct),
    };
  });
}

function speak(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = 0.85;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

// ============================================================
// Result tiers
// ============================================================

function tierFor(score: number): { title: string; sub: string } {
  if (score >= 15) return { title: "You're basically Korean 🇰🇷", sub: "Native-level ear. Are you sure you don't speak Korean?" };
  if (score >= 12) return { title: "Almost fluent!", sub: "Keep practicing — you've got this." };
  if (score >= 9)  return { title: "Not bad for a K-pop fan!", sub: "Solid base. A bit more listening and you'll nail it." };
  if (score >= 6)  return { title: "Keep listening to more K-pop", sub: "Romanization is tricky. More exposure helps." };
  return { title: "Start with 안녕하세요!", sub: "Everyone starts somewhere — welcome." };
}

// ============================================================
// Page
// ============================================================

export default function KoreanPronunciationPage(): ReactElement {
  const [started, setStarted] = useState(false);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const current = quiz[idx];

  const goNext = useCallback((wasCorrect: boolean) => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCorrectCount((c) => c + (wasCorrect ? 1 : 0));
    if (idx + 1 >= QUIZ_LEN) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    setTimeLeft(TIME_PER_Q);
  }, [idx]);

  // Timer per question
  useEffect(() => {
    if (!started || done) return;
    if (picked !== null) return;
    setTimeLeft(TIME_PER_Q);
    if (timerRef.current !== null) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Time out — count as wrong, advance after short pause
          setPicked(-1);
          window.setTimeout(() => goNext(false), 700);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [started, idx, picked, done, goNext]);

  // Speak the word when a new question shows
  useEffect(() => {
    if (!started || done || !current) return;
    if (picked !== null) return;
    const t = window.setTimeout(() => speak(current.hangul), 250);
    return () => window.clearTimeout(t);
  }, [started, idx, current, picked, done]);

  const begin = () => {
    setQuiz(buildQuiz());
    setIdx(0);
    setCorrectCount(0);
    setPicked(null);
    setDone(false);
    setTimeLeft(TIME_PER_Q);
    setStarted(true);
  };

  const restart = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStarted(false);
    setDone(false);
  };

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const got = i === current.correctIdx;
    window.setTimeout(() => goNext(got), 800);
  };

  const tier = useMemo(() => tierFor(correctCount), [correctCount]);

  const onShare = () => {
    const text = `I scored ${correctCount}/${QUIZ_LEN} on the Korean pronunciation test! → nolza.fun/games/korean-pronunciation`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); })
        .catch(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); });
    } else {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPct = ((idx + (picked !== null ? 1 : 0)) / QUIZ_LEN) * 100;

  return (
    <main
      className="page-in min-h-screen"
      style={{
        background: BG,
        color: "#1a1a1a",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        paddingBottom: 100,
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
          color: "#666",
          textDecoration: "none",
        }}
      >
        ←
      </Link>

      <div className="mx-auto max-w-xl px-6 pt-20">
        {!started && (
          <div className="text-center pt-12">
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              K-POP PRONUNCIATION CHALLENGE
            </p>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              Can you tell <br /> Korean from K-pop romanization?
            </h1>
            <p style={{ color: "#666", fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
              Listen to the word, then pick the correct romanization. 15 random questions · 10s each.
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
              }}
            >
              START
            </button>

            <div
              style={{
                marginTop: 60,
                padding: 20,
                background: "rgba(255,59,48,0.05)",
                borderRadius: 16,
                fontSize: 15,
                color: "#777",
                lineHeight: 1.6,
              }}
            >
              💡 Browser will read each word aloud. Audio playback uses your device&apos;s
              Korean text-to-speech if available.
            </div>
          </div>
        )}

        {started && !done && current && (
          <div>
            {/* Progress + counter */}
            <div className="flex justify-between" style={{ fontSize: 14, color: "#999", marginBottom: 8, letterSpacing: "0.1em" }}>
              <span>{idx + 1} / {QUIZ_LEN}</span>
              <span style={{ color: timeLeft <= 3 ? ACCENT : "#999", fontWeight: 700 }}>
                {timeLeft}s
              </span>
            </div>
            <div style={{ width: "100%", height: 4, background: "#eee", borderRadius: 2, marginBottom: 32 }}>
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

            {/* Hangul word */}
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                background: "#fff",
                borderRadius: 24,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontFamily: "var(--font-noto-sans-kr)",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                {current.hangul}
              </div>
              <button
                type="button"
                onClick={() => speak(current.hangul)}
                style={{
                  background: "transparent",
                  border: "1px solid #ddd",
                  color: "#666",
                  padding: "8px 20px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                ▶ PLAY AGAIN
              </button>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {current.options.map((opt, i) => {
                const isPicked = picked === i;
                const isCorrect = i === current.correctIdx;
                const showResult = picked !== null;
                let bg = "#fff";
                let borderColor = "#e5e5e5";
                let color = "#1a1a1a";
                if (showResult) {
                  if (isCorrect) {
                    bg = "rgba(52,199,89,0.12)";
                    borderColor = "#34C759";
                    color = "#1a1a1a";
                  } else if (isPicked) {
                    bg = "rgba(255,59,48,0.1)";
                    borderColor = ACCENT;
                    color = "#1a1a1a";
                  } else {
                    color = "#999";
                  }
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    style={{
                      background: bg,
                      border: `2px solid ${borderColor}`,
                      color,
                      padding: "18px 22px",
                      borderRadius: 14,
                      fontSize: 17,
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      cursor: picked !== null ? "default" : "pointer",
                      transition: "background 0.15s, border-color 0.15s, color 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (picked === null) {
                        e.currentTarget.style.borderColor = ACCENT;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (picked === null) {
                        e.currentTarget.style.borderColor = "#e5e5e5";
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {started && done && (
          <div className="text-center pt-12">
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              YOUR SCORE
            </p>
            <div
              style={{
                fontSize: 88,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              {correctCount}<span style={{ color: "#bbb", fontSize: 56 }}>/{QUIZ_LEN}</span>
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 700,
                marginTop: 20,
                marginBottom: 10,
                letterSpacing: "-0.01em",
              }}
            >
              {tier.title}
            </h2>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 40, lineHeight: 1.6 }}>
              {tier.sub}
            </p>

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
                {copied ? "COPIED" : "SHARE"}
              </button>
              <button
                type="button"
                onClick={restart}
                style={{
                  background: "transparent",
                  color: "#1a1a1a",
                  border: "1px solid #ddd",
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
