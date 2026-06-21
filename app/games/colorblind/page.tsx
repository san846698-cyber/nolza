"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

type PlateType = "정상" | "적록색맹" | "청황색맹";

type Plate = {
  digit: string;
  options: { ko: string; en: string }[];
  answer: number;
  pattern: number[][];
  fg: string;
  bg: string;
  type: PlateType;
};

const NOT_VISIBLE = { ko: "안 보임", en: "Can't see it" };
const num = (n: string) => ({ ko: n, en: n });

const N5 = [
  [0,1,1,1,1],
  [1,0,0,0,0],
  [1,1,1,1,0],
  [0,0,0,0,1],
  [1,1,1,1,0],
];
const N3 = [
  [1,1,1,1,0],
  [0,0,0,0,1],
  [0,0,1,1,0],
  [0,0,0,0,1],
  [1,1,1,1,0],
];
const N8 = [
  [0,1,1,1,0],
  [1,0,0,0,1],
  [0,1,1,1,0],
  [1,0,0,0,1],
  [0,1,1,1,0],
];
const N6 = [
  [0,1,1,1,1],
  [1,0,0,0,0],
  [1,1,1,1,0],
  [1,0,0,0,1],
  [0,1,1,1,0],
];
const N2 = [
  [0,1,1,1,0],
  [1,0,0,0,1],
  [0,0,0,1,0],
  [0,1,1,0,0],
  [1,1,1,1,1],
];
const N7 = [
  [1,1,1,1,1],
  [0,0,0,0,1],
  [0,0,0,1,0],
  [0,0,1,0,0],
  [0,1,0,0,0],
];

const PLATES: Plate[] = [
  { digit: "5", options: [num("3"), num("5"), num("8"), NOT_VISIBLE], answer: 1, pattern: N5, fg: "#A85432", bg: "#5A8C5A", type: "적록색맹" },
  { digit: "3", options: [num("3"), num("8"), num("5"), NOT_VISIBLE], answer: 0, pattern: N3, fg: "#C36941", bg: "#7B9E5C", type: "적록색맹" },
  { digit: "8", options: [num("3"), num("8"), num("0"), NOT_VISIBLE], answer: 1, pattern: N8, fg: "#A56B4F", bg: "#6E955F", type: "적록색맹" },
  { digit: "6", options: [num("6"), num("8"), num("5"), NOT_VISIBLE], answer: 0, pattern: N6, fg: "#B5A847", bg: "#5C7DB5", type: "청황색맹" },
  { digit: "2", options: [num("2"), num("7"), num("3"), NOT_VISIBLE], answer: 0, pattern: N2, fg: "#B79447", bg: "#5C7DA8", type: "청황색맹" },
  { digit: "7", options: [num("7"), num("1"), num("2"), NOT_VISIBLE], answer: 0, pattern: N7, fg: "#A75C42", bg: "#618B5C", type: "적록색맹" },
];

function generateDots(pattern: number[][], fg: string, bg: string, seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const dots: { x: number; y: number; r: number; color: string }[] = [];
  const cx = 100, cy = 100, R = 95;
  for (let i = 0; i < 250; i++) {
    let attempt = 0;
    while (attempt < 30) {
      const x = rand() * 200;
      const y = rand() * 200;
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy < R * R) {
        const gx = Math.floor((x / 200) * pattern[0].length);
        const gy = Math.floor((y / 200) * pattern.length);
        const isFg = pattern[gy]?.[gx] === 1;
        const r = 3 + rand() * 5;
        dots.push({ x, y, r, color: isFg ? fg : bg });
        break;
      }
      attempt++;
    }
  }
  return dots;
}

function PlateView({ plate, seed }: { plate: Plate; seed: number }) {
  const dots = useMemo(
    () => generateDots(plate.pattern, plate.fg, plate.bg, seed),
    [plate, seed],
  );
  return (
    <svg viewBox="0 0 200 200" className="h-64 w-64 rounded-full md:h-80 md:w-80">
      <circle cx={100} cy={100} r={98} fill="#0d0d0d" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.color} />
      ))}
    </svg>
  );
}

function getResult(
  score: number,
  total: number,
): { label: { ko: string; en: string }; tone: string } {
  const ratio = score / total;
  if (ratio >= 0.9)
    return {
      label: { ko: "정상 색각으로 보입니다", en: "Your color vision looks normal" },
      tone: "text-emerald-400",
    };
  if (ratio >= 0.6)
    return {
      label: {
        ko: "약간의 색각 이상이 의심됩니다",
        en: "A slight color vision deficiency is possible",
      },
      tone: "text-yellow-300",
    };
  if (ratio >= 0.3)
    return {
      label: {
        ko: "색각 이상이 의심됩니다",
        en: "A color vision deficiency is suspected",
      },
      tone: "text-orange-400",
    };
  return {
    label: { ko: "전문가 검사를 권합니다", en: "We recommend a professional exam" },
    tone: "text-accent",
  };
}

export default function ColorblindTest() {
  const { t, locale } = useLocale();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [seed, setSeed] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSeed(Date.now() % 1_000_000);
  }, []);

  const current = PLATES[idx];
  const score = answers.reduce(
    (s, a, i) => s + (a === PLATES[i].answer ? 1 : 0),
    0,
  );

  const select = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length >= PLATES.length) setDone(true);
    else setIdx((x) => x + 1);
  };

  const restart = () => {
    setIdx(0);
    setAnswers([]);
    setDone(false);
    setSeed(Date.now() % 1_000_000);
  };

  const result = done ? getResult(score, PLATES.length) : null;

  const handleShare = async () => {
    if (!result) return;
    const text = t(
      `색맹 테스트 ${score}/${PLATES.length}점 — ${result.label.ko} → nolza.fun/games/colorblind`,
      `Color Blindness Test ${score}/${PLATES.length} — ${result.label.en} → nolza.fun/games/colorblind`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza")}
          </Link>
          {!done && (
            <div className="text-xs text-gray-500">
              <span className="font-medium text-white">{idx + 1}</span> / {PLATES.length}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            {t("색맹 ", "Color Blindness ")}
            <span className="text-accent">{t("테스트", "Test")}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            {t(
              "이시하라식 검사판을 단순화한 게임용 테스트입니다. 의료 진단 아님.",
              "A simplified, for-fun take on Ishihara plates. Not a medical diagnosis.",
            )}
          </p>
        </header>

        {!done ? (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex justify-center">
              <PlateView plate={current} seed={seed + idx * 13} />
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              {t("어떤 숫자가 보이나요?", "What number do you see?")}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(i)}
                  className="rounded-xl border border-border bg-bg px-4 py-3 text-base font-bold hover:border-accent"
                >
                  {t(opt.ko, opt.en)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          result && (
            <div className="rounded-2xl border border-accent/40 bg-card p-8 text-center md:p-12">
              <div className="text-sm text-accent">{t("결과", "Result")}</div>
              <div className="mt-3 text-7xl font-black tabular-nums md:text-8xl">
                {score}<span className="text-3xl text-gray-500">/{PLATES.length}</span>
              </div>
              <div className={`mt-3 text-xl font-bold md:text-2xl ${result.tone}`}>
                {t(result.label.ko, result.label.en)}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                {t(
                  "⚠️ 정확한 진단은 안과 검진을 받으세요",
                  "⚠️ For an accurate diagnosis, see an eye doctor",
                )}
              </p>
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
          )
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            {t("← 놀자 홈으로", "← Back to nolza")}
          </Link>
        </div>
      </div>
    </main>
  );
}
