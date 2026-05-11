"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLocale } from "@/hooks/useLocale";

// ─── Design tokens ─────────────────────────────────────────────────────────
const BG      = "#0C0A07";
const SURFACE = "#141109";
const SURF2   = "#1A1610";
const INK     = "#EDE8DF";
const INK2    = "rgba(237,232,223,0.55)";
const INK3    = "rgba(237,232,223,0.22)";
const GOLD    = "#C8A96A";
const GOLD_D  = "rgba(200,169,106,0.18)";
const GREEN   = "#5BB88A";
const SERIF   = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";
const MONO    = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";
const SANS    = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const INTER   = "var(--font-inter), 'Inter', sans-serif";

// ─── Experiments ───────────────────────────────────────────────────────────
type HitStyle = "burst" | "flash" | "rain" | "rise";

type Experiment = {
  id: string;
  code: string;
  ko: string;
  en: string;
  denom: number;
  hitKo: string;
  hitEn: string;
  flavorKo: string;
  flavorEn: string;
  hitStyle: HitStyle;
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "lotto",
    code: "LOT",
    ko: "로또 1등",
    en: "Lottery jackpot",
    denom: 8_145_060,
    hitKo: "당첨",
    hitEn: "JACKPOT",
    flavorKo: "한국 로또 6/45 1등 확률.",
    flavorEn: "Korean Lotto 6/45 grand-prize odds.",
    hitStyle: "burst",
  },
  {
    id: "lightning",
    code: "LTN",
    ko: "벼락 맞을 확률",
    en: "Struck by lightning",
    denom: 1_000_000,
    hitKo: "맞음",
    hitEn: "STRUCK",
    flavorKo: "평생 벼락에 맞을 확률.",
    flavorEn: "Lifetime odds of being struck by lightning.",
    hitStyle: "flash",
  },
  {
    id: "shark",
    code: "SHK",
    ko: "상어에게 물릴 확률",
    en: "Bitten by a shark",
    denom: 3_748_067,
    hitKo: "물림",
    hitEn: "BITTEN",
    flavorKo: "해변에서 상어에게 공격받을 연간 확률.",
    flavorEn: "Annual odds of an unprovoked shark attack.",
    hitStyle: "burst",
  },
  {
    id: "rich",
    code: "RCH",
    ko: "재벌 될 확률",
    en: "Becoming a tycoon",
    denom: 1_000_000,
    hitKo: "재벌",
    hitEn: "TYCOON",
    flavorKo: "자수성가 억만장자가 될 대략적 확률.",
    flavorEn: "Approximate odds of joining the Korean billionaire class.",
    hitStyle: "rain",
  },
  {
    id: "pro-gamer",
    code: "PRO",
    ko: "프로게이머 될 확률",
    en: "Going pro",
    denom: 10_000,
    hitKo: "프로",
    hitEn: "DRAFTED",
    flavorKo: "한국 1군 프로게이머 등록 비율.",
    flavorEn: "Share of Korean players who turn pro.",
    hitStyle: "rise",
  },
  {
    id: "soulmate",
    code: "LVE",
    ko: "첫눈에 반한 상대와 결혼",
    en: "Marry love-at-first-sight",
    denom: 562_000,
    hitKo: "결혼",
    hitEn: "MARRIED",
    flavorKo: "사회학 연구 기반 추정치.",
    flavorEn: "From a sociological estimate.",
    hitStyle: "burst",
  },
  {
    id: "twins",
    code: "TWN",
    ko: "일란성 쌍둥이 낳을 확률",
    en: "Identical twins",
    denom: 285,
    hitKo: "쌍둥이",
    hitEn: "TWINS",
    flavorKo: "전 세계 자연 발생률.",
    flavorEn: "Roughly constant natural rate worldwide.",
    hitStyle: "burst",
  },
  {
    id: "centenarian",
    code: "C·T",
    ko: "100세 이상 살 확률",
    en: "Living past 100",
    denom: 5_000,
    hitKo: "100세",
    hitEn: "CENTURY",
    flavorKo: "선진국 평균 백세인 비율.",
    flavorEn: "Centenarian share in developed countries.",
    hitStyle: "rise",
  },
];

// ─── Storage ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "nolza_probability_v1";
type Tally = Record<string, { attempts: number; hits: number; bestHitOnAttempt: number | null }>;

function loadTally(): Tally {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Tally; }
  catch { return {}; }
}
function saveTally(t: Tally) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch { /* */ }
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ProbabilityPage(): ReactElement {
  const { locale } = useLocale();
  const t = useCallback(
    (ko: ReactNode, en: ReactNode): ReactNode => (locale === "ko" ? ko : en),
    [locale],
  );
  const [tally, setTally] = useState<Tally>({});
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => { setTally(loadTally()); }, []);

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
                  ? lastHitAttempt : cur.bestHitOnAttempt
                : cur.bestHitOnAttempt,
          },
        };
        saveTally(next);
        return next;
      });
    }, [],
  );

  const exp = EXPERIMENTS.find((e) => e.id === active) ?? null;

  return (
    <main style={{
      minHeight: "100vh",
      background: BG,
      color: INK,
      fontFamily: locale === "ko" ? SANS : INTER,
    }}>
      <GlobalStyles />

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(20px,4vw,40px) 80px" }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: "clamp(48px,6vw,72px)" }}>
          <p style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.3em",
            color: GOLD,
            fontWeight: 500,
            marginBottom: 20,
            textTransform: "uppercase",
          }}>
            {t("확률 체험기", "Probability Lab")}
          </p>
          <h1 style={{
            fontFamily: SERIF,
            fontSize: "clamp(32px,5vw,56px)",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: INK,
          }}>
            {t(
              <>1%가 얼마나<br />자주 일어나는지</>,
              <>How often is<br />1%, really?</>
            )}
          </h1>
          <p style={{
            marginTop: 20,
            fontFamily: locale === "ko" ? SANS : INTER,
            fontSize: "clamp(14px,1.8vw,17px)",
            color: INK2,
            lineHeight: 1.7,
            maxWidth: "48ch",
          }}>
            {t(
              "숫자로 보면 감이 없어요. 직접 눌러보면 달라집니다.",
              "Numbers don't feel like much. Click them and they will.",
            )}
          </p>
        </header>

        {/* ── Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(10px,1.6vw,16px)",
        }}>
          {EXPERIMENTS.map((e, i) => (
            <ExperimentCard
              key={e.id}
              exp={e}
              index={i}
              tally={tally[e.id]}
              onOpen={() => setActive(e.id)}
              t={t}
              locale={locale}
            />
          ))}
        </div>

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
    </main>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────
function ExperimentCard({
  exp, index, tally, onOpen, t, locale,
}: {
  exp: Experiment;
  index: number;
  tally: Tally[string] | undefined;
  onOpen: () => void;
  t: (ko: React.ReactNode, en: React.ReactNode) => React.ReactNode;
  locale: "ko" | "en";
}): ReactElement {
  const pct = Math.max((1 / exp.denom) * 100, 0.002);
  const hasData = tally && tally.attempts > 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="prob-card"
      style={{
        background: SURFACE,
        border: `1px solid ${INK3}`,
        borderRadius: 4,
        padding: "28px 26px 22px",
        color: INK,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: locale === "ko" ? SANS : INTER,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          color: GOLD,
          fontWeight: 600,
        }}>
          {exp.code}
        </span>
        <span style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.15em",
          color: INK3,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Fraction — hero element */}
      <div style={{ marginBottom: 20, flex: 1 }}>
        <div style={{
          fontFamily: SERIF,
          fontSize: "clamp(13px,1.6vw,15px)",
          color: INK2,
          marginBottom: 4,
          letterSpacing: "-0.01em",
        }}>
          {locale === "ko" ? exp.ko : exp.en}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
          <span style={{
            fontFamily: MONO,
            fontSize: "clamp(11px,1.3vw,13px)",
            color: INK3,
            marginRight: 4,
          }}>1 ÷</span>
          <span style={{
            fontFamily: MONO,
            fontSize: "clamp(26px,3.6vw,38px)",
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}>
            {exp.denom.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Flavor */}
      <p style={{
        fontSize: 13,
        color: INK2,
        lineHeight: 1.6,
        margin: 0,
        marginBottom: 20,
      }}>
        {locale === "ko" ? exp.flavorKo : exp.flavorEn}
      </p>

      {/* Stats */}
      {hasData && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontFamily: MONO,
          color: INK2,
          paddingTop: 14,
          borderTop: `1px solid ${INK3}`,
          marginBottom: 14,
        }}>
          <span>{tally!.attempts.toLocaleString()} {t("번", "tries")}</span>
          <span style={{ color: tally!.hits > 0 ? GREEN : INK2, fontWeight: tally!.hits > 0 ? 700 : 400 }}>
            {tally!.hits > 0 ? `✓ ${tally!.hits.toLocaleString()}` : t("미성공", "0 hits")}
          </span>
        </div>
      )}

      {/* Probability bar */}
      <div style={{
        height: 2,
        background: INK3,
        borderRadius: 999,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          minWidth: 2,
          background: GOLD,
          borderRadius: 999,
        }} />
      </div>
    </button>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
type Mode = "single" | "100" | "1000" | "auto";

function ExperimentModal({ exp, tally, onClose, onUpdate, t, locale }: {
  exp: Experiment;
  tally: Tally[string] | undefined;
  onClose: () => void;
  onUpdate: (a: number, h: number, l: number | null) => void;
  t: (ko: React.ReactNode, en: React.ReactNode) => React.ReactNode;
  locale: "ko" | "en";
}): ReactElement {
  const [sAttempts, setSAttempts] = useState(0);
  const [sHits, setSHits] = useState(0);
  const [lastResult, setLastResult] = useState<"hit" | "miss" | null>(null);
  const [autoRunning, setAutoRunning] = useState(false);
  const [hitKey, setHitKey] = useState(0);
  const autoRef = useRef<number | null>(null);
  const sAttemptsRef = useRef(sAttempts);
  sAttemptsRef.current = sAttempts;

  useEffect(() => () => { if (autoRef.current) window.clearInterval(autoRef.current); }, []);

  const close = useCallback(() => {
    if (autoRef.current) { window.clearInterval(autoRef.current); autoRef.current = null; }
    onClose();
  }, [onClose]);

  const trial = useCallback((count: number) => {
    let hits = 0;
    let lastHitAt: number | null = null;
    const start = sAttemptsRef.current;
    for (let i = 0; i < count; i++) {
      if (Math.floor(Math.random() * exp.denom) === 0) { hits++; lastHitAt = start + i + 1; }
    }
    setSAttempts((p) => p + count);
    if (hits > 0) setSHits((p) => p + hits);
    setLastResult(hits > 0 ? "hit" : "miss");
    onUpdate(count, hits, lastHitAt);
    if (hits > 0) setHitKey((n) => n + 1);
  }, [exp.denom, onUpdate]);

  const runMode = useCallback((mode: Mode) => {
    if (autoRef.current) { window.clearInterval(autoRef.current); autoRef.current = null; }
    if (mode === "single") { trial(1); return; }
    if (mode === "100")   { trial(100); return; }
    if (mode === "1000")  { trial(1000); return; }
    setAutoRunning(true);
    autoRef.current = window.setInterval(() => trial(5000), 16);
  }, [trial]);

  const stopAuto = useCallback(() => {
    if (autoRef.current) { window.clearInterval(autoRef.current); autoRef.current = null; }
    setAutoRunning(false);
  }, []);

  useEffect(() => { if (autoRunning && sHits > 0) stopAuto(); }, [autoRunning, sHits, stopAuto]);

  const totalAttempts = (tally?.attempts ?? 0) + sAttempts;
  const totalHits     = (tally?.hits ?? 0) + sHits;

  const [copied, setCopied] = useState(false);
  const shareText = useMemo(() => {
    if (sHits > 0)
      return t(
        `${exp.ko}을 ${sAttempts.toLocaleString("ko-KR")}번 만에 성공 (1/${exp.denom.toLocaleString()}) → nolza.fun/games/probability`,
        `Hit "${exp.en}" in ${sAttempts.toLocaleString()} tries (1/${exp.denom.toLocaleString()}) → nolza.fun/games/probability`,
      ) as string;
    return t(
      `${exp.ko}을 ${sAttempts.toLocaleString("ko-KR")}번 했는데도 실패 (1/${exp.denom.toLocaleString()}) → nolza.fun/games/probability`,
      `${sAttempts.toLocaleString()} tries on "${exp.en}", nothing (1/${exp.denom.toLocaleString()}) → nolza.fun/games/probability`,
    ) as string;
  }, [sHits, sAttempts, exp, t]);

  const share = useCallback(async () => {
    try { await navigator.clipboard.writeText(shareText); } catch { /* */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [shareText]);

  return (
    <div
      className="prob-overlay"
      onClick={close}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: SURF2,
          border: `1px solid rgba(200,169,106,0.3)`,
          borderRadius: 6,
          padding: "clamp(24px,4vw,40px)",
          maxWidth: 480,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
        }}
      >
        <button onClick={close} aria-label="close" style={{
          position: "absolute", top: 16, right: 18,
          background: "transparent", border: "none",
          color: INK2, fontSize: 20, cursor: "pointer", padding: 4, lineHeight: 1,
        }}>×</button>

        {/* Modal header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: MONO, fontSize: 10,
            letterSpacing: "0.25em", color: GOLD, marginBottom: 10,
          }}>
            {exp.code} · {String(EXPERIMENTS.findIndex(e => e.id === exp.id) + 1).padStart(2, "0")}
          </div>
          <div style={{
            fontFamily: SERIF,
            fontSize: "clamp(20px,2.8vw,26px)",
            fontWeight: 700, color: INK, letterSpacing: "-0.02em", marginBottom: 6,
          }}>
            {locale === "ko" ? exp.ko : exp.en}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: INK3 }}>1 ÷</span>
            <span style={{
              fontFamily: MONO, fontSize: "clamp(22px,3vw,30px)",
              fontWeight: 700, color: GOLD, letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}>
              {exp.denom.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Result box */}
        <div style={{
          background: BG,
          border: `1px solid ${
            lastResult === "hit" ? GOLD :
            lastResult === "miss" ? INK3 : INK3
          }`,
          borderRadius: 4,
          minHeight: 110,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "24px 20px", textAlign: "center",
          position: "relative", overflow: "hidden",
          gap: 8,
          transition: "border-color 0.3s",
        }}>
          {lastResult === "hit" ? (
            <>
              <HitVisual style={exp.hitStyle} key={hitKey} />
              <div style={{
                fontFamily: SERIF, fontSize: "clamp(22px,3vw,28px)",
                fontWeight: 900, color: GOLD, letterSpacing: "-0.02em",
                textShadow: `0 0 24px ${GOLD}66`, zIndex: 2,
              }}>
                {locale === "ko" ? exp.hitKo : exp.hitEn}
              </div>
              <div style={{ fontSize: 14, color: INK2, zIndex: 2 }}>
                {t(
                  `${sAttempts.toLocaleString("ko-KR")}번 만에 성공`,
                  `Hit on attempt #${sAttempts.toLocaleString()}`,
                )}
              </div>
            </>
          ) : lastResult === "miss" ? (
            <>
              <div style={{ fontFamily: MONO, fontSize: 28, color: INK3, letterSpacing: "-0.04em" }}>—</div>
              <div style={{ fontSize: 14, color: INK2 }}>
                {t("아직 안 됐어요", "Not yet")}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: INK3, fontFamily: MONO, letterSpacing: "0.05em" }}>
              {t("버튼을 눌러 시도하세요", "press a button to roll")}
            </div>
          )}
        </div>

        {/* Counters */}
        <div style={{
          marginTop: 14,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
        }}>
          {[
            { label: t("시도", "Tries"), value: sAttempts.toLocaleString(), color: INK },
            { label: t("성공", "Hits"), value: sHits.toLocaleString(), color: sHits > 0 ? GREEN : INK2 },
            { label: t("기댓값", "Expected"), value: exp.denom.toLocaleString(), color: INK3 },
          ].map(({ label, value, color }) => (
            <div key={String(label)} style={{
              background: BG, border: `1px solid ${INK3}`,
              borderRadius: 4, padding: "12px 8px", textAlign: "center",
            }}>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: INK3, marginBottom: 6 }}>
                {label}
              </div>
              <div style={{
                fontFamily: MONO, fontSize: "clamp(14px,2vw,18px)",
                fontWeight: 700, color, fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button className="prob-btn primary" onClick={() => runMode("single")} disabled={autoRunning}>
            {t("1번", "× 1")}
          </button>
          <button className="prob-btn ghost" onClick={() => runMode("100")} disabled={autoRunning}>
            {t("100번", "× 100")}
          </button>
          <button className="prob-btn ghost" onClick={() => runMode("1000")} disabled={autoRunning}>
            {t("1,000번", "× 1,000")}
          </button>
          {autoRunning ? (
            <button className="prob-btn stop" onClick={stopAuto}>
              {t("중지", "STOP")}
            </button>
          ) : (
            <button className="prob-btn ghost" onClick={() => runMode("auto")}>
              {t("될 때까지", "until I win")}
            </button>
          )}
        </div>

        {autoRunning && (
          <div style={{
            marginTop: 12, textAlign: "center",
            fontFamily: MONO, fontSize: 12, color: INK3,
            letterSpacing: "0.05em",
          }}>
            {t(
              `${sAttempts.toLocaleString("ko-KR")}번 시도 중...`,
              `${sAttempts.toLocaleString()} tries...`,
            )}
          </div>
        )}

        {/* Lifetime */}
        {totalAttempts > 0 && (
          <div style={{
            marginTop: 16,
            padding: "12px 14px",
            background: GOLD_D,
            border: `1px solid rgba(200,169,106,0.2)`,
            borderRadius: 4,
            fontFamily: MONO, fontSize: 12, color: INK2,
            lineHeight: 1.7, textAlign: "center",
            letterSpacing: "0.02em",
          }}>
            {t(
              `누적 ${totalAttempts.toLocaleString("ko-KR")}번 · ${totalHits.toLocaleString("ko-KR")}번 성공`,
              `${totalAttempts.toLocaleString()} total · ${totalHits.toLocaleString()} hits`,
            )}
          </div>
        )}

        {/* Share */}
        {sAttempts > 0 && (
          <button
            onClick={share}
            className="prob-btn ghost"
            style={{ marginTop: 10, width: "100%" }}
          >
            {copied ? t("복사됨 ✓", "Copied ✓") : t("결과 공유", "Share")}
          </button>
        )}

        {/* Flavor */}
        <p style={{
          marginTop: 20, marginBottom: 0,
          fontFamily: MONO, fontSize: 11,
          color: INK3, lineHeight: 1.7,
          letterSpacing: "0.03em", textAlign: "center",
        }}>
          {locale === "ko" ? exp.flavorKo : exp.flavorEn}
        </p>
      </div>
    </div>
  );
}

// ─── Hit visuals ───────────────────────────────────────────────────────────
function HitVisual({ style }: { style: HitStyle }): ReactElement {
  if (style === "flash") {
    return (
      <span aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 40%, rgba(200,169,106,0.5), transparent 60%)",
        animation: "probFlash 0.35s ease 3",
        pointerEvents: "none",
      }} />
    );
  }
  if (style === "rain") {
    return (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} aria-hidden style={{
            position: "absolute", top: -10,
            left: `${8 + Math.random() * 84}%`,
            fontFamily: MONO, fontSize: 13,
            color: GOLD, opacity: 0.8,
            animation: `probRain ${0.8 + Math.random() * 0.6}s linear ${Math.random() * 0.3}s forwards`,
          }}>₩</span>
        ))}
      </>
    );
  }
  if (style === "rise") {
    return (
      <span aria-hidden style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(0deg, ${GOLD_D}, transparent 60%)`,
        animation: "probRise 0.8s ease forwards",
        pointerEvents: "none",
      }} />
    );
  }
  // burst (default)
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * 360;
        const dist = 60 + Math.random() * 30;
        const colors = [GOLD, INK, GREEN, "rgba(200,169,106,0.6)"];
        return (
          <span key={i} aria-hidden style={{
            position: "absolute", left: "50%", top: "50%",
            width: 5, height: 5, borderRadius: "50%",
            background: colors[i % colors.length],
            transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-${dist}px)`,
            opacity: 0,
            animation: "probBoom 1s ease-out forwards",
          }} />
        );
      })}
    </>
  );
}

// ─── Aggregate footer ──────────────────────────────────────────────────────
function AggregateFooter({ tally, t, locale }: {
  tally: Tally;
  t: (ko: React.ReactNode, en: React.ReactNode) => React.ReactNode;
  locale: "ko" | "en";
}): ReactElement {
  const totalAttempts = useMemo(() => Object.values(tally).reduce((s, v) => s + v.attempts, 0), [tally]);
  const totalHits     = useMemo(() => Object.values(tally).reduce((s, v) => s + v.hits, 0), [tally]);
  if (totalAttempts === 0) return <></>;
  return (
    <div style={{
      marginTop: 56,
      padding: "20px 24px",
      border: `1px solid ${INK3}`,
      borderRadius: 4,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12,
      fontFamily: MONO,
    }}>
      <span style={{ fontSize: 11, letterSpacing: "0.2em", color: INK3 }}>
        {t("이 기기 누적", "THIS DEVICE")}
      </span>
      <span style={{ fontSize: 14, color: INK2, letterSpacing: "-0.01em" }}>
        {t(
          `${totalAttempts.toLocaleString("ko-KR")}번 시도 · ${totalHits.toLocaleString("ko-KR")}번 성공`,
          `${totalAttempts.toLocaleString()} tries · ${totalHits.toLocaleString()} hits`,
        )}
      </span>
    </div>
  );
}

// ─── Global styles ─────────────────────────────────────────────────────────
function GlobalStyles(): ReactElement {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
@keyframes probFade  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
@keyframes probBoom  { 0%{opacity:1;transform:translate(-50%,-50%) rotate(var(--a,0deg)) translateY(0)} 100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--a,0deg)) translateY(-80px)} }
@keyframes probFlash { 0%,100%{opacity:0} 50%{opacity:1} }
@keyframes probRain  { from{transform:translateY(-10px);opacity:1} to{transform:translateY(120px);opacity:0} }
@keyframes probRise  { from{opacity:0} to{opacity:1} }

.prob-overlay { animation: probFade 0.25s ease; }

.prob-card {
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.prob-card:hover {
  transform: translateY(-3px);
  border-color: rgba(200,169,106,0.4) !important;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
}

.prob-btn {
  cursor: pointer;
  border-radius: 3px;
  padding: 13px 18px;
  font-size: 13px;
  font-family: ${MONO};
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: opacity 0.15s, transform 0.15s;
}
.prob-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.prob-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

.prob-btn.primary {
  background: ${GOLD};
  color: ${BG};
  border: none;
}
.prob-btn.ghost {
  background: transparent;
  color: ${INK};
  border: 1px solid ${INK3};
}
.prob-btn.ghost:hover { border-color: ${GOLD}; color: ${GOLD}; }
.prob-btn.stop {
  background: transparent;
  color: #E05C5C;
  border: 1px solid rgba(224,92,92,0.4);
}
` }} />
  );
}
