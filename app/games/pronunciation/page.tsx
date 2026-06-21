"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Difficulty = "쉬움" | "보통" | "어려움" | "한국인도 헷갈림";

type Word = {
  word: string;
  ipa: string;
  romanWrong: string;
  hint: string;
  hint_en: string;
  difficulty: Difficulty;
};

const WORDS: Word[] = [
  { word: "닭볶음탕", ipa: "[tak̚.po.kɯm.tʰaŋ]", romanWrong: "Dak-bok-eum-tang", hint: "ㄺ 받침 처리가 핵심", hint_en: "The trick is the final ㄺ cluster", difficulty: "어려움" },
  { word: "값싼", ipa: "[kap̚.s͈an]", romanWrong: "Gabs-ssan", hint: "ㅄ 받침은 ㅂ만 발음", hint_en: "In the ㅄ cluster, only ㅂ is pronounced", difficulty: "어려움" },
  { word: "잃어버린", ipa: "[i.ɾʌ.bʌ.ɾin]", romanWrong: "Ilh-eo-beo-rin", hint: "ㅀ 받침은 ㄹ만 남음", hint_en: "In the ㅀ cluster, only ㄹ remains", difficulty: "보통" },
  { word: "맑다", ipa: "[mak̚.t͈a]", romanWrong: "Malg-da", hint: "ㄺ + ㄷ → ㅋ + ㄸ", hint_en: "ㄺ + ㄷ → ㅋ + ㄸ", difficulty: "어려움" },
  { word: "넓다", ipa: "[nʌl.t͈a]", romanWrong: "Neolb-da", hint: "ㄼ + ㄷ → ㄹ + ㄸ", hint_en: "ㄼ + ㄷ → ㄹ + ㄸ", difficulty: "어려움" },
  { word: "괜찮아", ipa: "[kwɛn.t͡ɕʰa.na]", romanWrong: "Gwaen-chanh-a", hint: "ㄶ 받침은 약화", hint_en: "The ㄶ cluster weakens", difficulty: "보통" },
  { word: "씨앗", ipa: "[s͈i.at̚]", romanWrong: "Ssi-at", hint: "ㅆ 된소리", hint_en: "Tense (fortis) ㅆ", difficulty: "쉬움" },
  { word: "꿰뚫다", ipa: "[k͈we.t͈ul.t͈a]", romanWrong: "Kkwe-ttulh-da", hint: "초성에 ㄲ + ㄸ + ㄸ", hint_en: "Tense onsets: ㄲ + ㄸ + ㄸ", difficulty: "한국인도 헷갈림" },
  { word: "햇볕", ipa: "[hɛp̚.p͈jʌt̚]", romanWrong: "Haet-byeot", hint: "사이시옷 + 된소리화", hint_en: "Linking ㅅ (sai-siot) plus tensification", difficulty: "어려움" },
  { word: "찾았어요", ipa: "[t͡ɕʰa.d͡ʑa.s͈ʌ.jo]", romanWrong: "Chaj-ass-eo-yo", hint: "받침 ㅈ + 모음 → 연음", hint_en: "Final ㅈ + vowel → liaison", difficulty: "보통" },
  { word: "사랑해요", ipa: "[sa.ɾaŋ.hɛ.jo]", romanWrong: "Sa-rang-hae-yo", hint: "기본기", hint_en: "The basics", difficulty: "쉬움" },
  { word: "감사합니다", ipa: "[kam.sa.ham.ɲi.da]", romanWrong: "Gam-sa-hap-ni-da", hint: "ㅂ + ㄴ → ㅁ + ㄴ", hint_en: "ㅂ + ㄴ → ㅁ + ㄴ", difficulty: "보통" },
  { word: "꽃잎", ipa: "[k͈on.ɲip̚]", romanWrong: "Kkoch-ip", hint: "ㅊ 받침 + 이 → ㄴ + 이", hint_en: "Final ㅊ + 이 → ㄴ + 이", difficulty: "어려움" },
  { word: "찰떡", ipa: "[t͡ɕʰal.t͈ʌk̚]", romanWrong: "Chal-tteok", hint: "된소리 ㄸ", hint_en: "Tense (fortis) ㄸ", difficulty: "쉬움" },
  { word: "쑥쑥", ipa: "[s͈uk̚.s͈uk̚]", romanWrong: "Ssuk-ssuk", hint: "초성에 ㅆ 두 번", hint_en: "Tense ㅆ onset, twice", difficulty: "한국인도 헷갈림" },
];

const DIFF_LABEL: Record<Difficulty, { ko: string; en: string }> = {
  쉬움: { ko: "쉬움", en: "Easy" },
  보통: { ko: "보통", en: "Medium" },
  어려움: { ko: "어려움", en: "Hard" },
  "한국인도 헷갈림": { ko: "한국인도 헷갈림", en: "Even Koreans struggle" },
};

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
  const { t } = useLocale();
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
    if (score >= 90) return t("🇰🇷 토박이급", "🇰🇷 Native-level");
    if (score >= 70) return t("💯 잘함", "💯 Great");
    if (score >= 50) return t("👍 평균", "👍 Average");
    if (score >= 30) return t("📚 더 연습!", "📚 Keep practicing!");
    return t("😅 한국어 어렵죠", "😅 Korean is tough, right?");
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
    const text = t(
      `한국어 발음 ${score}점 (${grade}) → nolza.fun/games/pronunciation`,
      `Korean Pronunciation: ${score}/100 (${grade}) → nolza.fun/games/pronunciation`,
    );
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
            {t("← 놀자 홈으로", "← Back to nolza home")}
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
            {t("한국어 ", "Korean ")}
            <span className="text-accent">
              {t("발음 테스트", "Pronunciation Test")}
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "단어를 소리내어 읽어보고, 힌트와 비교해보세요.",
              "Read each word aloud, then compare with the hint.",
            )}
          </p>
        </header>

        {!done ? (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className={`text-xs ${DIFF_COLOR[current.difficulty]}`}>
              {t("난이도: ", "Difficulty: ")}
              {t(
                DIFF_LABEL[current.difficulty].ko,
                DIFF_LABEL[current.difficulty].en,
              )}
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
                {t("🔍 힌트 / 정답 보기", "🔍 Show hint / answer")}
              </button>
            ) : (
              <div className="mt-6 rounded-xl bg-bg p-4">
                <div className="text-xs text-gray-500">{t("힌트", "Hint")}</div>
                <p className="mt-1 text-base">
                  {t(current.hint, current.hint_en)}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  {t("외국인이 잘못 읽으면:", "Common foreigner misreading:")}{" "}
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
                  {t("❌ 못 맞췄다", "❌ Got it wrong")}
                </button>
                <button
                  type="button"
                  onClick={() => answer(true)}
                  className="rounded-full bg-accent px-4 py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  {t("✅ 맞췄다", "✅ Got it right")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">{t("결과", "Result")}</div>
            <div className="mt-3 text-7xl font-black tabular-nums md:text-8xl">
              {score}
              <span className="text-3xl text-gray-500">{t("점", " pts")}</span>
            </div>
            <div className="mt-3 text-2xl font-bold md:text-3xl">{grade}</div>
            <div className="mt-2 text-sm text-gray-400">
              {t(`${correct}/10 단어 성공`, `${correct}/10 words correct`)}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                {t("↻ 다시 도전", "↻ Try again")}
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied
                  ? t("✓ 복사됐어요", "✓ Copied")
                  : t("📋 친구에게 공유하기", "📋 Share with friends")}
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
