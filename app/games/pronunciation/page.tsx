"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Difficulty = "쉬움" | "보통" | "어려움" | "한국인도 헷갈림";

type Word = {
  word: string;
  ipa: string;
  romanWrong: string;
  hint: string;
  difficulty: Difficulty;
};

const WORDS: Word[] = [
  { word: "닭볶음탕", ipa: "[tak̚.po.kɯm.tʰaŋ]", romanWrong: "Dak-bok-eum-tang", hint: "ㄺ 받침 처리가 핵심", difficulty: "어려움" },
  { word: "값싼", ipa: "[kap̚.s͈an]", romanWrong: "Gabs-ssan", hint: "ㅄ 받침은 ㅂ만 발음", difficulty: "어려움" },
  { word: "잃어버린", ipa: "[i.ɾʌ.bʌ.ɾin]", romanWrong: "Ilh-eo-beo-rin", hint: "ㅀ 받침은 ㄹ만 남음", difficulty: "보통" },
  { word: "맑다", ipa: "[mak̚.t͈a]", romanWrong: "Malg-da", hint: "ㄺ + ㄷ → ㅋ + ㄸ", difficulty: "어려움" },
  { word: "넓다", ipa: "[nʌl.t͈a]", romanWrong: "Neolb-da", hint: "ㄼ + ㄷ → ㄹ + ㄸ", difficulty: "어려움" },
  { word: "괜찮아", ipa: "[kwɛn.t͡ɕʰa.na]", romanWrong: "Gwaen-chanh-a", hint: "ㄶ 받침은 약화", difficulty: "보통" },
  { word: "씨앗", ipa: "[s͈i.at̚]", romanWrong: "Ssi-at", hint: "ㅆ 된소리", difficulty: "쉬움" },
  { word: "꿰뚫다", ipa: "[k͈we.t͈ul.t͈a]", romanWrong: "Kkwe-ttulh-da", hint: "초성에 ㄲ + ㄸ + ㄸ", difficulty: "한국인도 헷갈림" },
  { word: "햇볕", ipa: "[hɛp̚.p͈jʌt̚]", romanWrong: "Haet-byeot", hint: "사이시옷 + 된소리화", difficulty: "어려움" },
  { word: "찾았어요", ipa: "[t͡ɕʰa.d͡ʑa.s͈ʌ.jo]", romanWrong: "Chaj-ass-eo-yo", hint: "받침 ㅈ + 모음 → 연음", difficulty: "보통" },
  { word: "사랑해요", ipa: "[sa.ɾaŋ.hɛ.jo]", romanWrong: "Sa-rang-hae-yo", hint: "기본기", difficulty: "쉬움" },
  { word: "감사합니다", ipa: "[kam.sa.ham.ɲi.da]", romanWrong: "Gam-sa-hap-ni-da", hint: "ㅂ + ㄴ → ㅁ + ㄴ", difficulty: "보통" },
  { word: "꽃잎", ipa: "[k͈on.ɲip̚]", romanWrong: "Kkoch-ip", hint: "ㅊ 받침 + 이 → ㄴ + 이", difficulty: "어려움" },
  { word: "찰떡", ipa: "[t͡ɕʰal.t͈ʌk̚]", romanWrong: "Chal-tteok", hint: "된소리 ㄸ", difficulty: "쉬움" },
  { word: "쑥쑥", ipa: "[s͈uk̚.s͈uk̚]", romanWrong: "Ssuk-ssuk", hint: "초성에 ㅆ 두 번", difficulty: "한국인도 헷갈림" },
];

const DIFF_COLOR: Record<Difficulty, string> = {
  쉬움: "text-emerald-400",
  보통: "text-yellow-300",
  어려움: "text-orange-400",
  "한국인도 헷갈림": "text-accent",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PronunciationGame() {
  const [list, setList] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setList(shuffle(WORDS).slice(0, 10));
  }, []);

  const current = list[idx];
  const score = useMemo(() => Math.round((correct / 10) * 100), [correct]);

  const grade = (() => {
    if (score >= 90) return "🇰🇷 토박이급";
    if (score >= 70) return "💯 잘함";
    if (score >= 50) return "👍 평균";
    if (score >= 30) return "📚 더 연습!";
    return "😅 한국어 어렵죠";
  })();

  const answer = (got: boolean) => {
    if (got) setCorrect((c) => c + 1);
    setRevealed(false);
    if (idx + 1 >= 10) setDone(true);
    else setIdx((i) => i + 1);
  };

  const restart = () => {
    setList(shuffle(WORDS).slice(0, 10));
    setIdx(0);
    setCorrect(0);
    setRevealed(false);
    setDone(false);
  };

  const handleShare = async () => {
    const text = `한국어 발음 ${score}점 (${grade}) → nolza.fun/games/pronunciation`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (list.length === 0) return <main className="min-h-screen bg-bg" />;

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          {!done && (
            <div className="text-xs text-gray-500">
              <span className="font-medium text-white">{idx + 1}</span> / 10
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            한국어 <span className="text-accent">발음 테스트</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            단어를 소리내어 읽어보고, 힌트와 비교해보세요.
          </p>
        </header>

        {!done ? (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className={`text-xs ${DIFF_COLOR[current.difficulty]}`}>
              난이도: {current.difficulty}
            </div>
            <div className="mt-3 text-center">
              <div className="text-6xl font-black md:text-8xl">{current.word}</div>
              <div className="mt-3 font-mono text-sm text-gray-400 md:text-base">
                {current.ipa}
              </div>
            </div>

            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-6 w-full rounded-lg bg-accent py-3 text-base font-bold text-white hover:opacity-90"
              >
                🔍 힌트 / 정답 보기
              </button>
            ) : (
              <div className="mt-6 rounded-xl bg-bg p-4">
                <div className="text-xs text-gray-500">힌트</div>
                <p className="mt-1 text-base">{current.hint}</p>
                <div className="mt-3 text-xs text-gray-500">
                  외국인이 잘못 읽으면:{" "}
                  <span className="font-mono text-orange-400">
                    {current.romanWrong}
                  </span>
                </div>
              </div>
            )}

            {revealed && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => answer(false)}
                  className="rounded-full border border-border bg-bg px-4 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent"
                >
                  ❌ 못 맞췄다
                </button>
                <button
                  type="button"
                  onClick={() => answer(true)}
                  className="rounded-full bg-accent px-4 py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  ✅ 맞췄다
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">결과</div>
            <div className="mt-3 text-7xl font-black tabular-nums md:text-8xl">
              {score}<span className="text-3xl text-gray-500">점</span>
            </div>
            <div className="mt-3 text-2xl font-bold md:text-3xl">{grade}</div>
            <div className="mt-2 text-sm text-gray-400">
              {correct}/10 단어 성공
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ 다시 도전
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </div>
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
