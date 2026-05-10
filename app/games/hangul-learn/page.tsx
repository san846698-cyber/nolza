"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Lesson = "vowels" | "consonants" | "syllables" | "words" | "complete";

const VOWELS = [
  { c: "ㅏ", romaji: "a" }, { c: "ㅓ", romaji: "eo" }, { c: "ㅗ", romaji: "o" },
  { c: "ㅜ", romaji: "u" }, { c: "ㅡ", romaji: "eu" }, { c: "ㅣ", romaji: "i" },
];

const CONSONANTS = [
  { c: "ㄱ", romaji: "g/k" }, { c: "ㄴ", romaji: "n" }, { c: "ㄷ", romaji: "d/t" },
  { c: "ㄹ", romaji: "r/l" }, { c: "ㅁ", romaji: "m" }, { c: "ㅂ", romaji: "b/p" },
  { c: "ㅅ", romaji: "s" }, { c: "ㅇ", romaji: "ng" }, { c: "ㅈ", romaji: "j" }, { c: "ㅎ", romaji: "h" },
];

const SYLLABLES = [
  { syll: "가", parts: "ㄱ + ㅏ" }, { syll: "나", parts: "ㄴ + ㅏ" },
  { syll: "마", parts: "ㅁ + ㅏ" }, { syll: "오", parts: "ㅇ + ㅗ" },
];

const WORDS = [
  { word: "안녕", romaji: "annyeong", meaning: "Hi" },
  { word: "감사", romaji: "gamsa", meaning: "Thanks" },
  { word: "치킨", romaji: "chikin", meaning: "Chicken" },
  { word: "오빠", romaji: "oppa", meaning: "Older brother" },
];

const ORDER: Lesson[] = ["vowels", "consonants", "syllables", "words", "complete"];

export default function HangulLearn() {
  const [lesson, setLesson] = useState<Lesson>("vowels");
  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [popKey, setPopKey] = useState<string | null>(null);

  const idx = ORDER.indexOf(lesson);
  const goNext = () => { if (idx < ORDER.length - 1) { setLesson(ORDER[idx + 1]); setTapped(new Set()); } };

  const handleTap = (c: string) => {
    setTapped((s) => new Set(s).add(c));
    setPopKey(c);
    setTimeout(() => setPopKey(null), 300);
  };

  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: "white", color: "#1a1a1a", fontFamily: "var(--font-inter)" }}
    >
      <Link href="/" className="back-arrow" aria-label="home" style={{ color: "#1a1a1a" }}>
        ←
      </Link>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-20">
        {lesson === "vowels" && (
          <div className="w-full text-center fade-in">
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#bbb" }}>
              LESSON 1 · VOWELS
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 sm:grid-cols-6">
              {VOWELS.map((v) => (
                <button
                  key={v.c}
                  type="button"
                  onClick={() => handleTap(v.c)}
                  className={popKey === v.c ? "pop" : ""}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 72,
                      fontWeight: 900,
                      color: tapped.has(v.c) ? "#0044AA" : "#1a1a1a",
                      transition: "color 0.2s",
                      fontFamily: "var(--font-noto-sans-kr)",
                      lineHeight: 1,
                    }}
                  >
                    {v.c}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 16,
                      color: "#888",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {v.romaji}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              disabled={tapped.size < VOWELS.length}
              className="mt-16 rounded-full transition-opacity disabled:opacity-30"
              style={{
                background: "#1a1a1a",
                color: "white",
                padding: "12px 32px",
                fontSize: 15,
                letterSpacing: "0.15em",
                cursor: tapped.size < VOWELS.length ? "not-allowed" : "pointer",
              }}
            >
              NEXT ▸
            </button>
          </div>
        )}

        {lesson === "consonants" && (
          <div className="w-full text-center fade-in">
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#bbb" }}>
              LESSON 2 · CONSONANTS
            </div>
            <div className="mt-12 grid grid-cols-5 gap-6">
              {CONSONANTS.map((c) => (
                <button
                  key={c.c}
                  type="button"
                  onClick={() => handleTap(c.c)}
                  className={popKey === c.c ? "pop" : ""}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      color: tapped.has(c.c) ? "#FF3B30" : "#1a1a1a",
                      transition: "color 0.2s",
                      fontFamily: "var(--font-noto-sans-kr)",
                      lineHeight: 1,
                    }}
                  >
                    {c.c}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14, color: "#888" }}>{c.romaji}</div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              disabled={tapped.size < CONSONANTS.length}
              className="mt-16 rounded-full transition-opacity disabled:opacity-30"
              style={{
                background: "#1a1a1a", color: "white",
                padding: "12px 32px", fontSize: 15, letterSpacing: "0.15em",
                cursor: tapped.size < CONSONANTS.length ? "not-allowed" : "pointer",
              }}
            >
              NEXT ▸
            </button>
          </div>
        )}

        {lesson === "syllables" && (
          <div className="w-full text-center fade-in">
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#bbb" }}>
              LESSON 3 · COMBINE
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {SYLLABLES.map((s) => (
                <div key={s.syll}>
                  <div
                    style={{
                      fontSize: 80,
                      fontWeight: 900,
                      fontFamily: "var(--font-noto-sans-kr)",
                      color: "#1a1a1a",
                      lineHeight: 1,
                    }}
                  >
                    {s.syll}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 14, color: "#888" }}>{s.parts}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="mt-16 rounded-full"
              style={{
                background: "#1a1a1a", color: "white",
                padding: "12px 32px", fontSize: 15, letterSpacing: "0.15em",
              }}
            >
              NEXT ▸
            </button>
          </div>
        )}

        {lesson === "words" && (
          <div className="w-full max-w-md text-center fade-in">
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#bbb" }}>
              LESSON 4 · WORDS
            </div>
            <ul className="mt-12 space-y-6">
              {WORDS.map((w) => (
                <li key={w.word} className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: "#eee" }}>
                  <span style={{ fontSize: 36, fontWeight: 700, fontFamily: "var(--font-noto-sans-kr)" }}>
                    {w.word}
                  </span>
                  <span style={{ fontSize: 15, color: "#888" }}>
                    {w.romaji} · {w.meaning}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={goNext}
              className="mt-16 rounded-full"
              style={{
                background: "#FF3B30", color: "white",
                padding: "12px 32px", fontSize: 15, letterSpacing: "0.15em",
              }}
            >
              GET CERTIFICATE ▸
            </button>
          </div>
        )}

        {lesson === "complete" && (
          <div
            className="text-center fade-in"
            style={{
              padding: "48px 40px",
              border: "1px solid #1a1a1a",
              borderRadius: 8,
              background: "linear-gradient(135deg, rgba(255,59,48,0.04), rgba(0,68,170,0.04))",
              maxWidth: 480,
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#888" }}>
              CERTIFICATE OF COMPLETION
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 36,
                fontWeight: 300,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              I can read Korean
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 16,
                fontFamily: "var(--font-noto-sans-kr)",
                color: "#FF3B30",
              }}
            >
              한국어를 읽을 수 있어요
            </div>
            <div
              style={{
                marginTop: 32,
                fontSize: 14,
                color: "#bbb",
                letterSpacing: "0.1em",
              }}
            >
              한글 · 24 letters · 10 minutes
            </div>
            <button
              type="button"
              onClick={() => { setLesson("vowels"); setTapped(new Set()); }}
              className="mt-10 rounded-full"
              style={{
                background: "transparent", color: "#888",
                border: "1px solid #ccc",
                padding: "8px 24px", fontSize: 14, letterSpacing: "0.1em",
              }}
            >
              RESTART
            </button>
          </div>
        )}

        {lesson !== "complete" && (
          <div className="mt-16 flex gap-2">
            {ORDER.slice(0, 4).map((l, i) => (
              <span
                key={l}
                style={{
                  width: 8, height: 8, borderRadius: 9999,
                  background: i <= idx ? "#1a1a1a" : "#e5e5e5",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
