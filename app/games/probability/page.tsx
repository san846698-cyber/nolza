"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

// ============================================================================
// Theme
// ============================================================================

const BG = "#0d0d0d";
const GOLD = "#FFD700";
const GOLD_DIM = "#b8920b";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";
const KSANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const INTER = "var(--font-inter), 'Inter', sans-serif";

// ============================================================================
// Experiments
// ============================================================================

type Experiment = {
  id: string;
  emoji: string;
  ko: string;
  en: string;
  denom: number;        // 1 / denom
  hitKo: string;
  hitEn: string;
  flavorKo: string;
  flavorEn: string;
  /** Visual treatment when a hit happens. */
  hitStyle: "fireworks" | "lightning" | "shark" | "money" | "headset" | "rings" | "twins" | "candle";
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "lotto",
    emoji: "🎰",
    ko: "로또 1등",
    en: "Lottery jackpot",
    denom: 8_145_060,
    hitKo: "당첨!",
    hitEn: "JACKPOT!",
    flavorKo: "한국 로또 6/45 1등 확률입니다.",
    flavorEn: "Korean Lotto 6/45 grand-prize odds.",
    hitStyle: "fireworks",
  },
  {
    id: "lightning",
    emoji: "⚡",
    ko: "벼락 맞을 확률",
    en: "Struck by lightning",
    denom: 1_000_000,
    hitKo: "맞았습니다",
    hitEn: "STRUCK",
    flavorKo: "평생 벼락에 맞을 확률입니다.",
    flavorEn: "Lifetime odds of being struck by lightning.",
    hitStyle: "lightning",
  },
  {
    id: "shark",
    emoji: "🦈",
    ko: "상어에게 물릴 확률",
    en: "Bitten by a shark",
    denom: 3_748_067,
    hitKo: "물렸습니다",
    hitEn: "BITTEN",
    flavorKo: "해변에서 상어에게 공격받을 확률.",
    flavorEn: "Annual odds of an unprovoked shark attack at a beach.",
    hitStyle: "shark",
  },
  {
    id: "rich",
    emoji: "👑",
    ko: "한국에서 재벌 될 확률",
    en: "Becoming a Korean tycoon",
    denom: 1_000_000,
    hitKo: "재벌!",
    hitEn: "TYCOON!",
    flavorKo: "재벌가 또는 자수성가 억만장자가 될 대략적 확률.",
    flavorEn: "Approximate odds of joining the Korean billionaire class.",
    hitStyle: "money",
  },
  {
    id: "pro-gamer",
    emoji: "🎮",
    ko: "프로게이머 될 확률",
    en: "Becoming a pro gamer",
    denom: 10_000,
    hitKo: "프로 데뷔!",
    hitEn: "DRAFTED!",
    flavorKo: "한국 1군 프로게이머 등록 비율.",
    flavorEn: "Roughly the share of Korean players who turn pro.",
    hitStyle: "headset",
  },
  {
    id: "soulmate",
    emoji: "💘",
    ko: "첫눈에 반한 사람과 결혼할 확률",
    en: "Marrying your love-at-first-sight",
    denom: 562_000,
    hitKo: "결혼!",
    hitEn: "MARRIED!",
    flavorKo: "한 사회학 연구의 추정치.",
    flavorEn: "From a sociological estimate of love-at-first-sight outcomes.",
    hitStyle: "rings",
  },
  {
    id: "twins",
    emoji: "🧬",
    ko: "일란성 쌍둥이 낳을 확률",
    en: "Identical twins",
    denom: 285,
    hitKo: "쌍둥이!",
    hitEn: "TWINS!",
    flavorKo: "전 세계 거의 일정한 자연 발생률.",
    flavorEn: "Roughly constant natural rate worldwide.",
    hitStyle: "twins",
  },
  {
    id: "centenarian",
    emoji: "👴",
    ko: "100세 이상 살 확률",
    en: "Living past 100",
    denom: 5_000,
    hitKo: "100세 돌파!",
    hitEn: "100 YEARS!",
    flavorKo: "선진국 평균 백세인 비율.",
    flavorEn: "Approximate centenarian share in developed countries.",
    hitStyle: "candle",
  },
];

// ============================================================================
// Storage — per-device totals
// ============================================================================

const STORAGE_KEY = "nolza_probability_v1";

type Tally = Record<
  string,
  { attempts: number; hits: number; bestHitOnAttempt: number | null }
>;

function loadTally(): Tally {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Tally;
  } catch {
    return {};
  }
}

function saveTally(t: Tally) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  } catch {
    /* ignore */
  }
}

// ============================================================================
// Page
// ============================================================================

export default function ProbabilityPage(): ReactElement {
  const { locale, t } = useLocale();
  const [tally, setTally] = useState<Tally>({});
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setTally(loadTally());
  }, []);

  const updateExperiment = useCallback(
    (id: string, attemptsAdded: number, hits: number, lastHitAttempt: number | null) => {
      setTally((prev) => {
        const cur = prev[id] ?? { attempts: 0, hits: 0, bestHitOnAttempt: null };
        const next: Tally = {
          ...prev,
          [id]: {
            attempts: cur.attempts + attemptsAdded,
            hits: cur.hits + hits,
            bestHitOnAttempt:
              lastHitAttempt !== null
                ? cur.bestHitOnAttempt === null || lastHitAttempt < cur.bestHitOnAttempt
                  ? lastHitAttempt
                  : cur.bestHitOnAttempt
                : cur.bestHitOnAttempt,
          },
        };
        saveTally(next);
        return next;
      });
    },
    [],
  );

  const exp = EXPERIMENTS.find((e) => e.id === active) ?? null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        color: "#f5f5f5",
        fontFamily: locale === "ko" ? KSANS : INTER,
        padding: "60px 20px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackdropDots />

      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.7)",
          textDecoration: "none",
          zIndex: 30,
          fontSize: 18,
        }}
      >
        ←
      </Link>

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              fontFamily: INTER,
              color: GOLD,
              fontSize: 14,
              letterSpacing: "0.4em",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            EXPERIENCE PROBABILITY
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {t("확률을 직접 체험해보세요", "Feel what probability really means")}
          </h1>
          <p
            style={{
              marginTop: 14,
              color: "rgba(255,255,255,0.7)",
              fontSize: 18,
              maxWidth: 600,
              margin: "14px auto 0",
              lineHeight: 1.6,
            }}
          >
            {t(
              "숫자로만 보던 확률을 몸으로 느껴보세요.",
              "Numbers don't feel like much. Click them and they will.",
            )}
          </p>
        </header>

        {/* Grid of experiments */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {EXPERIMENTS.map((e) => (
            <ExperimentCard
              key={e.id}
              exp={e}
              tally={tally[e.id]}
              onOpen={() => setActive(e.id)}
              t={t}
              locale={locale}
            />
          ))}
        </div>

        {/* Aggregate footer */}
        <AggregateFooter tally={tally} t={t} locale={locale} />
      </div>

      {exp && (
        <ExperimentModal
          exp={exp}
          tally={tally[exp.id]}
          onClose={() => setActive(null)}
          onUpdate={(att, hits, lastHit) => updateExperiment(exp.id, att, hits, lastHit)}
          t={t}
          locale={locale}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes probFade {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes probFlash {
  0%, 100% { background: transparent; }
  50%      { background: rgba(255,255,255,0.4); }
}
@keyframes probBoom {
  0%   { transform: scale(0.4); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
}
@keyframes probJiggle {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
@keyframes probRain {
  from { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  to   { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
@keyframes probShockBolt {
  0%   { opacity: 0; transform: scaleY(0); }
  10%  { opacity: 1; transform: scaleY(1); }
  100% { opacity: 0; transform: scaleY(1); }
}
.gold-btn {
  cursor: pointer;
  border: 1.5px solid ${GOLD}55;
  background: linear-gradient(180deg, ${GOLD}, ${GOLD_DIM});
  color: #1a1a1a;
  font-weight: 800;
  letter-spacing: 0.04em;
  border-radius: 999px;
  padding: 14px 24px;
  font-size: 15px;
  font-family: ${INTER};
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  box-shadow: 0 6px 18px ${GOLD}33;
}
.gold-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.gold-btn.ghost {
  background: transparent;
  color: #f5f5f5;
  border-color: rgba(255,255,255,0.25);
  box-shadow: none;
}
.gold-btn.ghost:hover {
  border-color: ${GOLD};
  color: ${GOLD};
}
.gold-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
`,
        }}
      />
    </main>
  );
}

// ============================================================================
// Experiment card (grid item)
// ============================================================================

function ExperimentCard({
  exp,
  tally,
  onOpen,
  t,
  locale,
}: {
  exp: Experiment;
  tally: Tally[string] | undefined;
  onOpen: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        background: "linear-gradient(180deg, #161616, #0d0d0d)",
        border: "1px solid rgba(255,215,0,0.15)",
        borderRadius: 16,
        padding: "26px 22px",
        color: "#f5f5f5",
        cursor: "pointer",
        textAlign: "left",
        transition: "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
        fontFamily: locale === "ko" ? KSANS : INTER,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = `${GOLD}66`;
        e.currentTarget.style.boxShadow = `0 12px 32px ${GOLD}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,215,0,0.15)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 16 }}>{exp.emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#f5f5f5", marginBottom: 8 }}>
        {locale === "ko" ? exp.ko : exp.en}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 17,
          fontWeight: 700,
          color: GOLD,
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
          marginBottom: 14,
        }}
      >
        1 / {exp.denom.toLocaleString()}
      </div>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
        {locale === "ko" ? exp.flavorKo : exp.flavorEn}
      </div>

      {tally && tally.attempts > 0 && (
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
            fontFamily: INTER,
          }}
        >
          <span>
            {t("시도", "Attempts")} · {tally.attempts.toLocaleString()}
          </span>
          <span style={{ color: tally.hits > 0 ? GOLD : undefined, fontWeight: tally.hits > 0 ? 700 : 500 }}>
            {t("성공", "Hits")} · {tally.hits.toLocaleString()}
          </span>
        </div>
      )}
    </button>
  );
}

// ============================================================================
// Modal — interactive trial space
// ============================================================================

type Mode = "single" | "100" | "1000" | "auto";

function ExperimentModal({
  exp,
  tally,
  onClose,
  onUpdate,
  t,
  locale,
}: {
  exp: Experiment;
  tally: Tally[string] | undefined;
  onClose: () => void;
  onUpdate: (attempts: number, hits: number, lastHitAttempt: number | null) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [sessionHits, setSessionHits] = useState(0);
  const [lastResult, setLastResult] = useState<"hit" | "miss" | null>(null);
  const [autoRunning, setAutoRunning] = useState(false);
  const [hitFx, setHitFx] = useState(0);
  const autoRef = useRef<number | null>(null);
  // Keep latest setter for use inside the auto-run interval.
  const sessionAttemptsRef = useRef(sessionAttempts);
  sessionAttemptsRef.current = sessionAttempts;

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (autoRef.current !== null) {
        window.clearInterval(autoRef.current);
        autoRef.current = null;
      }
    };
  }, []);

  const close = useCallback(() => {
    if (autoRef.current !== null) {
      window.clearInterval(autoRef.current);
      autoRef.current = null;
    }
    onClose();
  }, [onClose]);

  const trial = useCallback(
    (count: number) => {
      let hits = 0;
      let lastHitAt: number | null = null;
      const start = sessionAttemptsRef.current;
      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * exp.denom);
        if (roll === 0) {
          hits++;
          lastHitAt = start + i + 1;
        }
      }
      setSessionAttempts((p) => p + count);
      if (hits > 0) setSessionHits((p) => p + hits);
      setLastResult(hits > 0 ? "hit" : "miss");
      onUpdate(count, hits, lastHitAt);
      if (hits > 0) {
        setHitFx((n) => n + 1);
      }
    },
    [exp.denom, onUpdate],
  );

  const runMode = useCallback(
    (mode: Mode) => {
      if (autoRef.current !== null) {
        window.clearInterval(autoRef.current);
        autoRef.current = null;
      }
      if (mode === "single") {
        trial(1);
        return;
      }
      if (mode === "100") {
        trial(100);
        return;
      }
      if (mode === "1000") {
        trial(1000);
        return;
      }
      // auto: run continuously in 5000-trial chunks every 16ms
      setAutoRunning(true);
      autoRef.current = window.setInterval(() => trial(5000), 16);
    },
    [trial],
  );

  const stopAuto = useCallback(() => {
    if (autoRef.current !== null) {
      window.clearInterval(autoRef.current);
      autoRef.current = null;
    }
    setAutoRunning(false);
  }, []);

  // Auto-stop on hit
  useEffect(() => {
    if (autoRunning && sessionHits > 0) {
      stopAuto();
    }
  }, [autoRunning, sessionHits, stopAuto]);

  const expectedAttempts = exp.denom;
  const totalAttempts = (tally?.attempts ?? 0) + sessionAttempts;
  const totalHits = (tally?.hits ?? 0) + sessionHits;

  const shareText = useMemo(() => {
    if (sessionHits > 0) {
      return t(
        `${exp.ko}을 ${sessionAttempts.toLocaleString("ko-KR")}번 만에 뚫었습니다 (확률 1/${exp.denom.toLocaleString()})\n→ nolza.fun/games/probability`,
        `Hit "${exp.en}" in ${sessionAttempts.toLocaleString()} attempts (1/${exp.denom.toLocaleString()})\n→ nolza.fun/games/probability`,
      );
    }
    return t(
      `${exp.ko}을 ${sessionAttempts.toLocaleString("ko-KR")}번 했는데도 안 됨 ㅋㅋㅋ (확률 1/${exp.denom.toLocaleString()})\n→ nolza.fun/games/probability`,
      `${sessionAttempts.toLocaleString()} tries on "${exp.en}" and nothing (1/${exp.denom.toLocaleString()})\n→ nolza.fun/games/probability`,
    );
  }, [sessionHits, sessionAttempts, exp, t]);

  const [copied, setCopied] = useState(false);
  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [shareText]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(10px)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "probFade 0.3s ease",
      }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, #161616, #0a0a0a)",
          border: `1.5px solid ${GOLD}55`,
          borderRadius: 20,
          padding: "30px 28px",
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 40px ${GOLD}22`,
          position: "relative",
        }}
      >
        <button
          onClick={close}
          aria-label="close"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            fontSize: 22,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 14 }}>{exp.emoji}</div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 26,
              fontWeight: 700,
              color: "#f5f5f5",
              marginBottom: 8,
            }}
          >
            {locale === "ko" ? exp.ko : exp.en}
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 16,
              fontWeight: 700,
              color: GOLD,
              letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            1 / {exp.denom.toLocaleString()}
          </div>
        </div>

        {/* Result panel */}
        <div
          style={{
            position: "relative",
            background: "#0a0a0a",
            border: `1px solid ${
              lastResult === "hit" ? GOLD : lastResult === "miss" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"
            }`,
            borderRadius: 14,
            padding: "26px 18px",
            textAlign: "center",
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            overflow: "hidden",
          }}
        >
          {lastResult === "hit" ? (
            <>
              <HitVisual style={exp.hitStyle} key={hitFx} />
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 26,
                  color: GOLD,
                  fontWeight: 800,
                  textShadow: `0 0 18px ${GOLD}88`,
                  zIndex: 2,
                }}
              >
                ✨ {locale === "ko" ? exp.hitKo : exp.hitEn}
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", zIndex: 2 }}>
                {t(
                  `${sessionAttempts.toLocaleString("ko-KR")}번 만에 성공!`,
                  `Hit on attempt #${sessionAttempts.toLocaleString()}!`,
                )}
              </div>
            </>
          ) : lastResult === "miss" ? (
            <>
              <div style={{ fontSize: 44, opacity: 0.5 }}>✕</div>
              <div style={{ fontSize: 17, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                {t("아직 안 됐어요", "Not yet")}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 17, color: "rgba(255,255,255,0.55)" }}>
              {t("아래 버튼을 눌러 시도하세요", "Press a button to roll")}
            </div>
          )}
        </div>

        {/* Counters */}
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          <Counter label={t("이번 세션", "This session")} value={sessionAttempts.toLocaleString()} />
          <Counter
            label={t("성공", "Hits")}
            value={sessionHits.toLocaleString()}
            color={sessionHits > 0 ? GOLD : undefined}
          />
          <Counter
            label={t("기댓값까지", "Expected by")}
            value={`${expectedAttempts.toLocaleString()}`}
            small
          />
        </div>

        {/* Action buttons */}
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <button
            className="gold-btn"
            onClick={() => runMode("single")}
            disabled={autoRunning}
          >
            {t("1번 해보기", "Try once")}
          </button>
          <button
            className="gold-btn ghost"
            onClick={() => runMode("100")}
            disabled={autoRunning}
          >
            {t("100번 자동", "100 auto")}
          </button>
          <button
            className="gold-btn ghost"
            onClick={() => runMode("1000")}
            disabled={autoRunning}
          >
            {t("1,000번 자동", "1,000 auto")}
          </button>
          {autoRunning ? (
            <button
              className="gold-btn"
              onClick={stopAuto}
              style={{
                background: "linear-gradient(180deg, #ef4444, #b91c1c)",
                color: "#fff",
                borderColor: "#ef444466",
              }}
            >
              {t("멈추기", "STOP")}
            </button>
          ) : (
            <button
              className="gold-btn ghost"
              onClick={() => runMode("auto")}
            >
              {t("당첨될 때까지", "Until I win")}
            </button>
          )}
        </div>

        {autoRunning && (
          <div
            style={{
              marginTop: 14,
              fontFamily: INTER,
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              animation: "probJiggle 1s ease-in-out infinite",
            }}
          >
            {t(
              `초당 ~30만 시도... (${sessionAttempts.toLocaleString("ko-KR")}번)`,
              `~300k tries/sec... (${sessionAttempts.toLocaleString()})`,
            )}
          </div>
        )}

        {/* Persistent total */}
        {totalAttempts > 0 && (
          <div
            style={{
              marginTop: 22,
              padding: "14px 16px",
              background: "rgba(255,215,0,0.05)",
              border: `1px solid ${GOLD}33`,
              borderRadius: 10,
              fontSize: 16,
              color: "rgba(255,255,255,0.78)",
              fontFamily: locale === "ko" ? KSANS : INTER,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            {t(
              `이 기기에서 누적 ${totalAttempts.toLocaleString("ko-KR")}번 시도, ${totalHits.toLocaleString("ko-KR")}번 성공`,
              `Lifetime on this device: ${totalAttempts.toLocaleString()} attempts, ${totalHits.toLocaleString()} hits`,
            )}
          </div>
        )}

        {/* Share */}
        {sessionAttempts > 0 && (
          <button
            onClick={share}
            className="gold-btn ghost"
            style={{ marginTop: 16, width: "100%" }}
          >
            {copied ? t("복사됨 ✓", "Copied ✓") : t("결과 공유", "Share result")}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Hit visuals — one variant per experiment
// ============================================================================

function HitVisual({ style }: { style: Experiment["hitStyle"] }): ReactElement {
  if (style === "fireworks") {
    return (
      <>
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * 360;
          const dist = 80 + Math.random() * 40;
          const c = ["#FFD700", "#ef4444", "#3b82f6", "#10b981", "#f97316"][i % 5];
          return (
            <span
              key={i}
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: c,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${dist}px)`,
                opacity: 0,
                animation: `probBoom 1.2s ease-out forwards`,
              }}
            />
          );
        })}
      </>
    );
  }
  if (style === "lightning") {
    return (
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.9), transparent 50%)",
          animation: "probFlash 0.4s ease 3",
          pointerEvents: "none",
        }}
      />
    );
  }
  if (style === "shark") {
    return <SymbolBurst symbol="🦷" />;
  }
  if (style === "money") {
    return (
      <>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              top: -20,
              left: `${5 + Math.random() * 90}%`,
              fontSize: 24,
              animation: `probRain ${1 + Math.random()}s linear ${Math.random() * 0.4}s forwards`,
            }}
          >
            💵
          </span>
        ))}
      </>
    );
  }
  if (style === "headset") {
    return <SymbolBurst symbol="🏆" />;
  }
  if (style === "rings") {
    return <SymbolBurst symbol="💍" />;
  }
  if (style === "twins") {
    return <SymbolBurst symbol="👶" />;
  }
  if (style === "candle") {
    return <SymbolBurst symbol="🕯️" />;
  }
  return <></>;
}

function SymbolBurst({ symbol }: { symbol: string }): ReactElement {
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * 360;
        const dist = 50 + Math.random() * 30;
        return (
          <span
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              fontSize: 22,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${dist}px)`,
              opacity: 0,
              animation: `probBoom 1.2s ease-out forwards`,
            }}
          >
            {symbol}
          </span>
        );
      })}
    </>
  );
}

// ============================================================================
// Counter mini
// ============================================================================

function Counter({
  label,
  value,
  color,
  small,
}: {
  label: string;
  value: string;
  color?: string;
  small?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "14px 10px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: INTER,
          fontSize: 14,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.62)",
          fontWeight: 700,
          marginBottom: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontSize: small ? 18 : 22,
          fontWeight: 800,
          color: color ?? "#f5f5f5",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================================
// Aggregate footer
// ============================================================================

function AggregateFooter({
  tally,
  t,
  locale,
}: {
  tally: Tally;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const totalAttempts = useMemo(
    () => Object.values(tally).reduce((s, v) => s + v.attempts, 0),
    [tally],
  );
  const totalHits = useMemo(
    () => Object.values(tally).reduce((s, v) => s + v.hits, 0),
    [tally],
  );

  if (totalAttempts === 0) return <></>;

  return (
    <div
      style={{
        marginTop: 56,
        padding: "22px 24px",
        background: "rgba(255,215,0,0.05)",
        border: `1px solid ${GOLD}33`,
        borderRadius: 16,
        textAlign: "center",
        fontFamily: locale === "ko" ? KSANS : INTER,
      }}
    >
      <div
        style={{
          fontFamily: INTER,
          fontSize: 15,
          letterSpacing: "0.24em",
          fontWeight: 700,
          color: GOLD,
          marginBottom: 12,
        }}
      >
        {t("이 기기의 누적 통계", "ON THIS DEVICE")}
      </div>
      <div style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
        {t(
          `지금까지 ${totalAttempts.toLocaleString("ko-KR")}번 시도해서 ${totalHits.toLocaleString("ko-KR")}번 성공했어요.`,
          `${totalAttempts.toLocaleString()} attempts so far · ${totalHits.toLocaleString()} hits.`,
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Backdrop dots
// ============================================================================

function BackdropDots(): ReactElement {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        opacity: 0.05,
        pointerEvents: "none",
        backgroundImage:
          "radial-gradient(rgba(255,215,0,0.6) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        zIndex: 0,
      }}
    />
  );
}
