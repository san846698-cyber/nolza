"use client";

import Link from "next/link";
import { useState } from "react";

type Consonant = { c: string; name: string; organ: string; desc: string };
type Vowel = { c: string; name: string; origin: string; desc: string };

const CONSONANTS: Consonant[] = [
  { c: "ㄱ", name: "기역", organ: "혀뿌리", desc: "혀뿌리가 목구멍을 막는 모양을 본떴어요" },
  { c: "ㄴ", name: "니은", organ: "혀끝", desc: "혀끝이 윗잇몸에 닿는 모양을 본떴어요" },
  { c: "ㄷ", name: "디귿", organ: "혀끝(센)", desc: "ㄴ에 한 획을 더한 강한 발음이에요" },
  { c: "ㄹ", name: "리을", organ: "혀의 굴림", desc: "혀가 굴러가는 모양이에요" },
  { c: "ㅁ", name: "미음", organ: "입", desc: "입의 사각형 모양을 본떴어요" },
  { c: "ㅂ", name: "비읍", organ: "입(센)", desc: "ㅁ에 한 획을 더한 강한 발음이에요" },
  { c: "ㅅ", name: "시옷", organ: "이", desc: "이(齒)의 모양을 본떴어요" },
  { c: "ㅇ", name: "이응", organ: "목구멍", desc: "목구멍의 둥근 모양을 본떴어요" },
  { c: "ㅈ", name: "지읒", organ: "이(센)", desc: "ㅅ에 한 획을 더했어요" },
  { c: "ㅎ", name: "히읗", organ: "목구멍(센)", desc: "ㅇ에 두 획을 더한 강한 소리예요" },
];

const VOWELS: Vowel[] = [
  { c: "ㆍ", name: "아래아", origin: "天 하늘", desc: "둥근 점은 하늘을 본떴어요" },
  { c: "ㅡ", name: "으", origin: "地 땅", desc: "수평선은 평평한 땅을 본떴어요" },
  { c: "ㅣ", name: "이", origin: "人 사람", desc: "수직선은 서있는 사람을 본떴어요" },
  { c: "ㅏ", name: "아", origin: "ㅣ + 점", desc: "사람 오른쪽에 하늘이 있는 모양" },
  { c: "ㅓ", name: "어", origin: "점 + ㅣ", desc: "사람 왼쪽에 하늘이 있는 모양" },
  { c: "ㅗ", name: "오", origin: "점 + ㅡ", desc: "땅 위에 하늘이 있는 모양" },
  { c: "ㅜ", name: "우", origin: "ㅡ + 점", desc: "땅 아래에 하늘이 있는 모양" },
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
  const [selectedC, setSelectedC] = useState<Consonant | null>(null);
  const [selectedV, setSelectedV] = useState<Vowel | null>(null);

  const composed =
    selectedC && selectedV ? compose(selectedC.c, selectedV.c) : null;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-10">
          <h1 className="text-3xl font-black md:text-5xl">
            한글 <span className="text-accent">창제 원리</span> 탐험
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            세종대왕이 어떻게 한글을 만들었는지, 자모를 클릭해 알아보세요.
          </p>
        </header>

        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-300">
            자음 — 발음 기관의 모양
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
                {selectedC.name} · 발음 기관: {selectedC.organ}
              </div>
              <div className="mt-2 text-base text-gray-300">{selectedC.desc}</div>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-gray-300">
            모음 — 천(•)·지(ㅡ)·인(ㅣ) 삼재 원리
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
                {selectedV.name} · {selectedV.origin}
              </div>
              <div className="mt-2 text-base text-gray-300">{selectedV.desc}</div>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">자음 + 모음 조합 미리보기</div>
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
              자음과 모음을 각각 하나씩 선택해보세요
            </p>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
          <h2 className="text-2xl font-black md:text-3xl">
            세종대왕이 <span className="text-accent">천재인 이유</span>
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-300 md:text-base">
            <li>
              <span className="font-bold text-white">📐 발음기관을 그대로 본뜬 자음:</span>{" "}
              혀·이·입·목구멍 모양을 각각 ㄴ·ㅅ·ㅁ·ㅇ으로 표현
            </li>
            <li>
              <span className="font-bold text-white">🌌 우주 철학으로 만든 모음:</span>{" "}
              하늘(•)·땅(ㅡ)·사람(ㅣ) 세 요소만으로 모든 모음을 조합
            </li>
            <li>
              <span className="font-bold text-white">🧩 자음+모음+받침 조합 시스템:</span>{" "}
              28개 기본 자모만으로 무려 11,172개 글자를 만들 수 있어요
            </li>
            <li>
              <span className="font-bold text-white">📜 1443년 창제:</span>{" "}
              유네스코가 인정한 세계 유일의 "발명자가 명확한" 문자
            </li>
            <li>
              <span className="font-bold text-white">⏱️ 배우기 쉬움:</span>{" "}
              자모 24개를 익히면 바로 읽고 쓸 수 있어요. 다른 문자에서는 드문 일
            </li>
          </ul>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent"
          >
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
