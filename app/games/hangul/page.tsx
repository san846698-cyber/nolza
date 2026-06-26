"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Consonant = {
  c: string;
  name: { ko: string; en: string };
  organ: { ko: string; en: string };
  desc: { ko: string; en: string };
};
type Vowel = {
  c: string;
  name: { ko: string; en: string };
  origin: { ko: string; en: string };
  desc: { ko: string; en: string };
};

const CONSONANTS: Consonant[] = [
  {
    c: "ㄱ",
    name: { ko: "기역", en: "Giyeok (g/k)" },
    organ: { ko: "혀뿌리", en: "Root of the tongue" },
    desc: {
      ko: "혀뿌리가 목구멍을 막는 모양을 본떴어요",
      en: "Shaped after the root of the tongue blocking the throat",
    },
  },
  {
    c: "ㄴ",
    name: { ko: "니은", en: "Nieun (n)" },
    organ: { ko: "혀끝", en: "Tip of the tongue" },
    desc: {
      ko: "혀끝이 윗잇몸에 닿는 모양을 본떴어요",
      en: "Shaped after the tongue tip touching the upper gum",
    },
  },
  {
    c: "ㄷ",
    name: { ko: "디귿", en: "Digeut (d/t)" },
    organ: { ko: "혀끝(센)", en: "Tip of the tongue (strong)" },
    desc: {
      ko: "ㄴ에 한 획을 더한 강한 발음이에요",
      en: "ㄴ with one stroke added for a stronger sound",
    },
  },
  {
    c: "ㄹ",
    name: { ko: "리을", en: "Rieul (r/l)" },
    organ: { ko: "혀의 굴림", en: "Rolling of the tongue" },
    desc: {
      ko: "혀가 굴러가는 모양이에요",
      en: "Depicts the tongue rolling",
    },
  },
  {
    c: "ㅁ",
    name: { ko: "미음", en: "Mieum (m)" },
    organ: { ko: "입", en: "Mouth" },
    desc: {
      ko: "입의 사각형 모양을 본떴어요",
      en: "Shaped after the square form of the mouth",
    },
  },
  {
    c: "ㅂ",
    name: { ko: "비읍", en: "Bieup (b/p)" },
    organ: { ko: "입(센)", en: "Mouth (strong)" },
    desc: {
      ko: "ㅁ에 한 획을 더한 강한 발음이에요",
      en: "ㅁ with one stroke added for a stronger sound",
    },
  },
  {
    c: "ㅅ",
    name: { ko: "시옷", en: "Siot (s)" },
    organ: { ko: "이", en: "Teeth" },
    desc: {
      ko: "이(齒)의 모양을 본떴어요",
      en: "Shaped after the form of the teeth (齒)",
    },
  },
  {
    c: "ㅇ",
    name: { ko: "이응", en: "Ieung (ng / silent)" },
    organ: { ko: "목구멍", en: "Throat" },
    desc: {
      ko: "목구멍의 둥근 모양을 본떴어요",
      en: "Shaped after the round form of the throat",
    },
  },
  {
    c: "ㅈ",
    name: { ko: "지읒", en: "Jieut (j)" },
    organ: { ko: "이(센)", en: "Teeth (strong)" },
    desc: {
      ko: "ㅅ에 한 획을 더했어요",
      en: "ㅅ with one stroke added",
    },
  },
  {
    c: "ㅎ",
    name: { ko: "히읗", en: "Hieut (h)" },
    organ: { ko: "목구멍(센)", en: "Throat (strong)" },
    desc: {
      ko: "ㅇ에 두 획을 더한 강한 소리예요",
      en: "ㅇ with two strokes added for a stronger sound",
    },
  },
];

const VOWELS: Vowel[] = [
  {
    c: "ㆍ",
    name: { ko: "아래아", en: "Arae-a (older ·)" },
    origin: { ko: "天 하늘", en: "天 Heaven" },
    desc: {
      ko: "둥근 점은 하늘을 본떴어요",
      en: "The round dot represents heaven",
    },
  },
  {
    c: "ㅡ",
    name: { ko: "으", en: "Eu" },
    origin: { ko: "地 땅", en: "地 Earth" },
    desc: {
      ko: "수평선은 평평한 땅을 본떴어요",
      en: "The horizontal line represents the flat earth",
    },
  },
  {
    c: "ㅣ",
    name: { ko: "이", en: "I" },
    origin: { ko: "人 사람", en: "人 Human" },
    desc: {
      ko: "수직선은 서있는 사람을 본떴어요",
      en: "The vertical line represents a standing person",
    },
  },
  {
    c: "ㅏ",
    name: { ko: "아", en: "A" },
    origin: { ko: "ㅣ + 점", en: "ㅣ + dot" },
    desc: {
      ko: "사람 오른쪽에 하늘이 있는 모양",
      en: "Heaven placed to the right of the person",
    },
  },
  {
    c: "ㅓ",
    name: { ko: "어", en: "Eo" },
    origin: { ko: "점 + ㅣ", en: "dot + ㅣ" },
    desc: {
      ko: "사람 왼쪽에 하늘이 있는 모양",
      en: "Heaven placed to the left of the person",
    },
  },
  {
    c: "ㅗ",
    name: { ko: "오", en: "O" },
    origin: { ko: "점 + ㅡ", en: "dot + ㅡ" },
    desc: {
      ko: "땅 위에 하늘이 있는 모양",
      en: "Heaven placed above the earth",
    },
  },
  {
    c: "ㅜ",
    name: { ko: "우", en: "U" },
    origin: { ko: "ㅡ + 점", en: "ㅡ + dot" },
    desc: {
      ko: "땅 아래에 하늘이 있는 모양",
      en: "Heaven placed below the earth",
    },
  },
];

const CHO_MAP: Record<string, number> = {
  ㄱ: 0, ㄴ: 2, ㄷ: 3, ㄹ: 5, ㅁ: 6, ㅂ: 7, ㅅ: 9, ㅇ: 11, ㅈ: 12, ㅎ: 18,
};
const JUNG_MAP: Record<string, number> = {
  ㅏ: 0, ㅓ: 4, ㅗ: 8, ㅜ: 13, ㅡ: 18, ㅣ: 20,
};

function compose(cho: string, jung: string): string {
  const c = CHO_MAP[cho];
  const j = JUNG_MAP[jung];
  if (c === undefined || j === undefined) return cho + jung;
  return String.fromCharCode(0xac00 + c * 588 + j * 28);
}

export default function HangulGame() {
  const { t } = useLocale();
  const [selectedC, setSelectedC] = useState<Consonant | null>(null);
  const [selectedV, setSelectedV] = useState<Vowel | null>(null);

  const composed =
    selectedC && selectedV ? compose(selectedC.c, selectedV.c) : null;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← nolza 홈으로", "← Back to Nolza home")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-10">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("한글 ", "Exploring the ")}
            <span className="text-accent">
              {t("창제 원리", "Design Principles")}
            </span>
            {t(" 탐험", " of Hangul")}
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "세종대왕이 어떻게 한글을 만들었는지, 자모를 클릭해 알아보세요.",
              "Discover how King Sejong created Hangul — click each letter to find out.",
            )}
          </p>
        </header>

        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-300">
            {t("자음 — 발음 기관의 모양", "Consonants — shaped after the speech organs")}
          </h2>
          <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
            {CONSONANTS.map((c) => (
              <button
                key={c.c}
                type="button"
                onClick={() => setSelectedC(c)}
                className={`rounded-xl border p-4 text-center text-3xl font-bold transition-all md:text-4xl ${
                  selectedC?.c === c.c
                    ? "border-accent bg-accent/10 scale-105"
                    : "border-border bg-card hover:border-accent"
                }`}
              >
                {c.c}
              </button>
            ))}
          </div>
          {selectedC && (
            <div className="palette-enter mt-4 rounded-2xl border border-accent/40 bg-card p-5">
              <div className="text-xs text-accent">
                {t(selectedC.name.ko, selectedC.name.en)}
                {t(" · 발음 기관: ", " · speech organ: ")}
                {t(selectedC.organ.ko, selectedC.organ.en)}
              </div>
              <div className="mt-2 text-base text-gray-300">
                {t(selectedC.desc.ko, selectedC.desc.en)}
              </div>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-gray-300">
            {t(
              "모음 — 천(•)·지(ㅡ)·인(ㅣ) 삼재 원리",
              "Vowels — the three-element principle: Heaven (•), Earth (ㅡ), Human (ㅣ)",
            )}
          </h2>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
            {VOWELS.map((v) => (
              <button
                key={v.c}
                type="button"
                onClick={() => setSelectedV(v)}
                className={`rounded-xl border p-4 text-center text-3xl font-bold transition-all md:text-4xl ${
                  selectedV?.c === v.c
                    ? "border-accent bg-accent/10 scale-105"
                    : "border-border bg-card hover:border-accent"
                }`}
              >
                {v.c}
              </button>
            ))}
          </div>
          {selectedV && (
            <div className="palette-enter mt-4 rounded-2xl border border-accent/40 bg-card p-5">
              <div className="text-xs text-accent">
                {t(selectedV.name.ko, selectedV.name.en)} ·{" "}
                {t(selectedV.origin.ko, selectedV.origin.en)}
              </div>
              <div className="mt-2 text-base text-gray-300">
                {t(selectedV.desc.ko, selectedV.desc.en)}
              </div>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">
            {t("자음 + 모음 조합 미리보기", "Consonant + vowel combination preview")}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-center">
            <div className="rounded-xl bg-bg px-6 py-4 text-4xl font-bold md:text-5xl">
              {selectedC?.c ?? "?"}
            </div>
            <div className="text-2xl text-accent">+</div>
            <div className="rounded-xl bg-bg px-6 py-4 text-4xl font-bold md:text-5xl">
              {selectedV?.c ?? "?"}
            </div>
            <div className="text-2xl text-accent">=</div>
            <div className="rounded-xl border border-accent bg-accent/10 px-6 py-4 text-5xl font-bold md:text-6xl">
              {composed ?? "?"}
            </div>
          </div>
          {!composed && (
            <p className="mt-4 text-center text-xs text-gray-500">
              {t(
                "자음과 모음을 각각 하나씩 선택해보세요",
                "Select one consonant and one vowel to combine them",
              )}
            </p>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
          <h2 className="text-2xl font-black md:text-3xl">
            {t("세종대왕이 ", "Why King Sejong was a ")}
            <span className="text-accent">
              {t("천재인 이유", "genius")}
            </span>
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-300 md:text-base">
            <li>
              <span className="font-bold text-white">
                {t(
                  "📐 발음기관을 그대로 본뜬 자음:",
                  "📐 Consonants modeled on the speech organs:",
                )}
              </span>{" "}
              {t(
                "혀·이·입·목구멍 모양을 각각 ㄴ·ㅅ·ㅁ·ㅇ으로 표현",
                "the shapes of tongue, teeth, mouth, and throat become ㄴ·ㅅ·ㅁ·ㅇ",
              )}
            </li>
            <li>
              <span className="font-bold text-white">
                {t(
                  "🌌 우주 철학으로 만든 모음:",
                  "🌌 Vowels built on cosmic philosophy:",
                )}
              </span>{" "}
              {t(
                "하늘(•)·땅(ㅡ)·사람(ㅣ) 세 요소만으로 모든 모음을 조합",
                "every vowel is formed from just three elements — Heaven (•), Earth (ㅡ), and Human (ㅣ)",
              )}
            </li>
            <li>
              <span className="font-bold text-white">
                {t(
                  "🧩 자음+모음+받침 조합 시스템:",
                  "🧩 A consonant + vowel + final-consonant system:",
                )}
              </span>{" "}
              {t(
                "28개 기본 자모만으로 무려 11,172개 글자를 만들 수 있어요",
                "just 28 basic letters can form a remarkable 11,172 syllable blocks",
              )}
            </li>
            <li>
              <span className="font-bold text-white">
                {t("📜 1443년 창제:", "📜 Created in 1443:")}
              </span>{" "}
              {t(
                '유네스코가 인정한 세계 유일의 "발명자가 명확한" 문자',
                'recognized by UNESCO as the world\'s only script with a clearly known inventor',
              )}
            </li>
            <li>
              <span className="font-bold text-white">
                {t("⏱️ 배우기 쉬움:", "⏱️ Easy to learn:")}
              </span>{" "}
              {t(
                "자모 24개를 익히면 바로 읽고 쓸 수 있어요. 다른 문자에서는 드문 일",
                "learn its 24 letters and you can read and write right away — rare among writing systems",
              )}
            </li>
          </ul>
        </section>

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
