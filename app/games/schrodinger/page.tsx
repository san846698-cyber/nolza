"use client";

/**
 * Supabase 스키마 (실서비스 연동 시):
 *   CREATE TABLE schrodinger_observations (
 *     id BIGSERIAL PRIMARY KEY,
 *     outcome TEXT NOT NULL,
 *     observed_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 * 현재는 localStorage seed로 mock 집계.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Outcome = "alive" | "dead" | "empty" | "box" | "question" | "universe";

const OUTCOMES: { id: Outcome; ko: string; en: string; icon: string; tone: string }[] = [
  { id: "alive", ko: "살아있는 고양이", en: "Cat (alive)", icon: "😺", tone: "#34C759" },
  { id: "dead", ko: "죽은 고양이", en: "Cat (dead)", icon: "💀", tone: "#FF3B30" },
  { id: "empty", ko: "텅 빈 상자", en: "Empty box", icon: "📦", tone: "#888" },
  { id: "box", ko: "또 다른 상자", en: "Another box", icon: "🔁", tone: "#FFD60A" },
  { id: "question", ko: "당신의 질문", en: "Your question", icon: "❓", tone: "#AF52DE" },
  { id: "universe", ko: "우주", en: "The universe", icon: "🌌", tone: "#5DA9DD" },
];

const STORAGE_KEY = "nolza-schrodinger-tally";

function loadTally(): Record<Outcome, number> {
  if (typeof window === "undefined") {
    return {} as Record<Outcome, number>;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Seed
  const seed: Record<string, number> = {};
  for (const o of OUTCOMES) {
    seed[o.id] = 50 + Math.floor(Math.random() * 200);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {}
  return seed as Record<Outcome, number>;
}

function pickRandom(): Outcome {
  return OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)].id;
}

type Phase = "closed" | "opening" | "result";

export default function SchrodingerGame() {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("closed");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [tally, setTally] = useState<Record<Outcome, number>>({} as Record<Outcome, number>);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTally(loadTally());
  }, []);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => {
      const result = pickRandom();
      setOutcome(result);
      setTally((prev) => {
        const next = { ...prev, [result]: (prev[result] ?? 0) + 1 };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
      setPhase("result");
    }, 1500);
  };

  const reset = () => {
    setPhase("closed");
    setOutcome(null);
  };

  const total = useMemo(
    () => Object.values(tally).reduce((s, v) => s + v, 0),
    [tally],
  );

  const handleShare = async () => {
    if (!outcome) return;
    const o = OUTCOMES.find((x) => x.id === outcome)!;
    const text = t(
      `슈뢰딩거 상자에서 ${o.ko}이(가) 나왔다 → nolza.fun/games/schrodinger`,
      `Got ${o.en} from Schrödinger's box → nolza.fun/games/schrodinger`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main
      className="page-in min-h-screen"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#aaa",
        fontFamily: "var(--font-noto-sans-kr)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">
        ←
      </Link>
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-8">
        {/* Box visual */}
        <div className="flex flex-col items-center text-center">
          <svg
            viewBox="0 0 240 200"
            width="320"
            height="280"
            style={{
              filter:
                phase === "result" && outcome === "alive"
                  ? "drop-shadow(0 0 40px rgba(52, 199, 89, 0.5))"
                  : phase === "result" && outcome === "dead"
                  ? "drop-shadow(0 0 40px rgba(255, 59, 48, 0.5))"
                  : "none",
              transition: "filter 0.6s",
            }}
          >
            <defs>
              <linearGradient id="boxFront" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3a3a3a" />
                <stop offset="1" stopColor="#1a1a1a" />
              </linearGradient>
              <linearGradient id="boxSide" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#2a2a2a" />
                <stop offset="1" stopColor="#1a1a1a" />
              </linearGradient>
            </defs>
            {/* Box body */}
            <polygon
              points="60,80 180,80 180,170 60,170"
              fill="url(#boxFront)"
              stroke="#444"
              strokeWidth="2"
            />
            {/* Side */}
            <polygon
              points="180,80 210,60 210,150 180,170"
              fill="url(#boxSide)"
              stroke="#444"
              strokeWidth="2"
            />
            {/* Top */}
            <polygon
              points="60,80 90,60 210,60 180,80"
              fill="#2a2a2a"
              stroke="#444"
              strokeWidth="2"
              style={{
                transformOrigin: "60px 80px",
                transform:
                  phase === "opening" || phase === "result"
                    ? "rotate(-30deg)"
                    : "rotate(0)",
                transition: "transform 1.4s ease",
              }}
            />
            {/* Inside icon */}
            {phase === "result" && outcome && (
              <foreignObject x="80" y="90" width="80" height="80">
                <div
                  className="fade-in"
                  style={{ fontSize: 60, textAlign: "center" }}
                >
                  {OUTCOMES.find((x) => x.id === outcome)!.icon}
                </div>
              </foreignObject>
            )}
            {/* Closed indicator */}
            {phase === "closed" && (
              <text
                x="120"
                y="130"
                fontSize="32"
                textAnchor="middle"
                fill="#555"
                fontWeight="bold"
              >
                ?
              </text>
            )}
          </svg>

          {phase === "closed" && (
            <>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: "#aaa",
                  lineHeight: 1.6,
                }}
              >
                {t("상자 안에 무엇이 있을까요?", "What's inside the box?")}<br />
                <span style={{ fontSize: 15, color: "#666" }}>
                  {t(
                    "열기 전까지는 모든 것이 동시에 존재합니다",
                    "Everything exists simultaneously until observed",
                  )}
                </span>
              </p>
              <button
                type="button"
                onClick={open}
                className="mt-8 rounded-full"
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "12px 36px",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {t("열기", "OPEN")}
              </button>
            </>
          )}

          {phase === "opening" && (
            <p
              className="fade-in"
              style={{
                marginTop: 24,
                fontSize: 14,
                color: "#666",
                letterSpacing: "0.3em",
              }}
            >
              {t("관찰 중...", "Observing...")}
            </p>
          )}

          {phase === "result" && outcome && (
            <div className="text-center fade-in" style={{ marginTop: 20 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "#666",
                  letterSpacing: "0.3em",
                }}
              >
                {t("관찰 결과", "OBSERVED")}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 28,
                  fontWeight: 700,
                  color: OUTCOMES.find((x) => x.id === outcome)!.tone,
                }}
              >
                {locale === "ko"
                  ? OUTCOMES.find((x) => x.id === outcome)!.ko
                  : OUTCOMES.find((x) => x.id === outcome)!.en}
              </div>
              {outcome === "question" && (
                <p style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
                  {t("당신은 지금 무엇을 기대했나요?", "What were you expecting?")}
                </p>
              )}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full"
                  style={{
                    background: "transparent",
                    border: "1px solid #444",
                    color: "#aaa",
                    padding: "10px 24px",
                    fontSize: 14,
                    letterSpacing: "0.15em",
                  }}
                >
                  {t("다시 열어볼까요?", "Open again?")}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full"
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "10px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                  }}
                >
                  {copied ? "✓ COPIED" : t("공유", "SHARE")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tally — shown after first observation */}
        {phase === "result" && total > 0 && (
          <div
            className="fade-in"
            style={{
              marginTop: 48,
              padding: 20,
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#666",
                letterSpacing: "0.3em",
                marginBottom: 12,
              }}
            >
              {t("전 세계 관찰 결과", "Worldwide results so far")} · {total.toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}{t("회", "")}
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {OUTCOMES.map((o) => {
                const count = tally[o.id] ?? 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                const isMine = outcome === o.id;
                return (
                  <li
                    key={o.id}
                    style={{
                      position: "relative",
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: isMine
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${pct}%`,
                        background: `${o.tone}1A`,
                      }}
                    />
                    <div
                      className="relative flex justify-between tabular-nums"
                      style={{ fontSize: 15 }}
                    >
                      <span style={{ color: "#bbb" }}>
                        {o.icon} {locale === "ko" ? o.ko : o.en}
                        {isMine && (
                          <span
                            style={{
                              marginLeft: 8,
                              color: o.tone,
                              fontSize: 13,
                            }}
                          >
                            {t("← 내 결과", "← yours")}
                          </span>
                        )}
                      </span>
                      <span style={{ color: "#888" }}>{pct.toFixed(1)}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Science */}
      <section
        className="mx-auto max-w-2xl"
        style={{ padding: "32px 24px 48px", color: "#888" }}
      >
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#888",
            fontFamily:
              locale === "ko"
                ? "var(--font-noto-sans-kr)"
                : "var(--font-inter)",
          }}
        >
          {t(
            "1935년 물리학자 에르빈 슈뢰딩거는 양자역학의 역설을 설명하기 위해 고양이 사고실험을 제안했습니다. 밀폐된 상자 안에 고양이와 50% 확률로 작동하는 독약 장치를 넣었을 때, 관찰자가 상자를 열기 전까지 고양이는 살아있는 상태와 죽은 상태가 동시에 중첩되어 존재한다는 것입니다. 이는 양자역학의 측정 문제를 보여주는 가장 유명한 사고실험입니다.",
            "In 1935, physicist Erwin Schrödinger proposed his famous cat thought experiment to illustrate the paradox of quantum superposition. With a cat sealed in a box alongside a 50% probability poison device, until the observer opens the box, the cat exists in a superposition — simultaneously alive and dead. It remains the most famous illustration of quantum mechanics' measurement problem.",
          )}
        </p>
      </section>

      <AdMobileSticky />
    </main>
  );
}
