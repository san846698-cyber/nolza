"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type Q = {
  lyric: string;
  options: string[];
  answer: number;
  artist: string;
};

// Lyric hooks are Korean-only by design; English-prefer players see the same
// (often romanizable / iconic) hook because that IS the song's signature line.
// Options and artists are proper nouns / song titles and stay as-is.
const SONGS: Q[] = [
  { lyric: "오빤 강남스타일", options: ["강남스타일", "행오버", "젠틀맨", "대디"], answer: 0, artist: "PSY" },
  { lyric: "거짓말 거짓말 거짓말", options: ["뱅뱅뱅", "Lies (거짓말)", "FXXK IT", "FANTASTIC BABY"], answer: 1, artist: "BIGBANG" },
  { lyric: "너무너무너무 멋져", options: ["Dancing Queen", "Gee", "Genie", "다시 만난 세계"], answer: 1, artist: "소녀시대" },
  { lyric: "어쩜 이렇게 하늘은 더 파란 건지", options: ["밤편지", "좋은 날", "스물셋", "팔레트"], answer: 1, artist: "아이유" },
  { lyric: "뚜두뚜두 뚜두뚜두", options: ["붐바야", "뚜두뚜두", "마지막처럼", "킬 디스 러브"], answer: 1, artist: "BLACKPINK" },
  { lyric: "Smooth like butter", options: ["Dynamite", "Permission to Dance", "Butter", "Boy With Luv"], answer: 2, artist: "BTS" },
  { lyric: "I'm in the stars tonight", options: ["Butter", "Dynamite", "ON", "DNA"], answer: 1, artist: "BTS" },
  { lyric: "I'm on the next level", options: ["Black Mamba", "Next Level", "Savage", "Spicy"], answer: 1, artist: "에스파" },
  { lyric: "으르렁 으르렁 으르렁대", options: ["Call Me Baby", "으르렁 (Growl)", "Love Shot", "Tempo"], answer: 1, artist: "EXO" },
  { lyric: "보고 싶다 이렇게 말하니까 더 보고 싶다", options: ["봄날", "Dynamite", "FAKE LOVE", "Spring Day"], answer: 0, artist: "BTS" },
  { lyric: "I'm so sick", options: ["TT", "Likey", "Cheer Up", "Knock Knock"], answer: 0, artist: "TWICE" },
  { lyric: "사뿐사뿐 흩날리는 나비처럼", options: ["미스터", "Bad Girl Good Girl", "Lupin", "Abracadabra"], answer: 0, artist: "카라" },
];

const TIMER_PER_Q = 12;
const PICKS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(score: number): { ko: string; en: string } {
  if (score === 10) return { ko: "🎤 K팝 마스터", en: "🎤 K-pop Master" };
  if (score >= 8) return { ko: "💯 덕후 인증", en: "💯 Certified Stan" };
  if (score >= 6) return { ko: "👍 평범한 K팝 팬", en: "👍 Casual K-pop Fan" };
  if (score >= 4) return { ko: "📚 좀 더 들어봐요", en: "📚 Keep Listening" };
  return { ko: "😅 라디오 켜세요", en: "😅 Turn On the Radio" };
}

export default function KpopGame() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_Q);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setList(shuffle(SONGS).slice(0, PICKS));
  }, []);

  useEffect(() => {
    if (selected !== null || done || list.length === 0) return;
    setTimeLeft(TIMER_PER_Q);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) { clearInterval(id); setSelected(-1); return 0; }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(id);
  }, [idx, selected, done, list.length]);

  const current = list[idx];

  const select = (i: number) => {
    if (selected !== null || !current) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    if (idx + 1 >= PICKS) setDone(true);
    else setIdx((i) => i + 1);
  };

  const restart = () => {
    setList(shuffle(SONGS).slice(0, PICKS));
    setIdx(0); setScore(0); setSelected(null); setDone(false);
  };

  const handleShare = async () => {
    const grade = getGrade(score);
    const text = t(
      `K팝 노래 맞추기 ${score}/${PICKS}점 (${grade.ko}) → nolza.fun/games/kpop`,
      `K-pop Lyric Quiz ${score}/${PICKS} (${grade.en}) → nolza.fun/games/kpop`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (list.length === 0) return <main className="min-h-screen bg-bg" />;

  if (done) {
    return (
      <main className="min-h-screen bg-bg pb-32">
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
            <Link href="/" className="text-xs text-gray-400 hover:text-accent">
              {t("← nolza 홈으로", "← Back to nolza home")}
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-16 md:px-8">
          <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
            <div className="text-sm text-accent">{t("결과", "Result")}</div>
            <div className="mt-3 text-7xl font-black tabular-nums md:text-8xl">
              {score}<span className="text-3xl text-gray-500">/{PICKS}</span>
            </div>
            <div className="mt-3 text-2xl font-bold md:text-3xl">{t(getGrade(score).ko, getGrade(score).en)}</div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                {t("↻ 다시 도전", "↻ Try Again")}
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? t("✓ 복사됐어요", "✓ Copied") : t("📋 친구에게 공유하기", "📋 Share with Friends")}
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
            {t("← nolza 홈으로", "← Back to nolza home")}
          </Link>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-white">{idx + 1}</span> / {PICKS}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-6">
          <h1 className="text-3xl font-black md:text-5xl">
            {locale === "ko" ? (
              <><span className="text-accent">K팝</span> 가사 맞추기 🎤</>
            ) : (
              <><span className="text-accent">K-pop</span> Lyric Quiz 🎤</>
            )}
          </h1>
        </header>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
          <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${(timeLeft / TIMER_PER_Q) * 100}%` }} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs text-gray-500">{t(`Q${idx + 1} · 이 가사는 어느 노래?`, `Q${idx + 1} · Which song is this lyric from?`)}</div>
          <div className="mt-3 rounded-xl bg-bg p-5 text-center text-xl font-bold leading-relaxed md:text-2xl">
            ♬ {current.lyric}
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
                <button key={i} type="button" onClick={() => select(i)} disabled={showFeedback} className={`rounded-xl border px-4 py-3 text-left text-sm md:text-base ${cls}`}>
                  <span className="mr-3 font-bold text-gray-500">{["A","B","C","D"][i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className={`mt-6 rounded-xl p-4 text-sm md:text-base ${isCorrect ? "bg-emerald-500/10 text-emerald-300" : "bg-accent/10 text-accent"}`}>
              <div className="font-bold">
                {selected === -1 ? t("⏰ 시간 초과", "⏰ Time's Up") : isCorrect ? t("✓ 정답!", "✓ Correct!") : t("✕ 오답", "✕ Wrong")}
              </div>
              <div className="mt-1 text-gray-300">{t("정답", "Answer")}: {current.options[current.answer]} — {current.artist}</div>
            </div>
          )}
        </div>

        {showFeedback && (
          <button type="button" onClick={next} className="mt-6 w-full rounded-full bg-accent py-3 text-base font-bold text-white hover:opacity-90">
            {idx + 1 >= PICKS ? t("결과 보기 →", "See Result →") : t("다음 →", "Next →")}
          </button>
        )}
        <div className="mt-3 text-center text-xs text-gray-500">{t(`현재 점수: ${score}점`, `Current score: ${score}`)}</div>
      </div>
    </main>
  );
}
