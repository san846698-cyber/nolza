"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useLocale } from "@/hooks/useLocale";

// ============================================================================
// Theme + constants
// ============================================================================

const BG = "#0a0a0a";
const GOLD = "#FFD700";
const GOLD_DIM = "#b8920b";
const FELT = "#0d3a1f"; // table green
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";
const KSANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const INTER = "var(--font-inter), 'Inter', sans-serif";

const CHIP_DENOMS = [1000, 5000, 10000, 50000];

type Phase =
  | "intro"
  | "bankSelect"
  | "gameSelect"
  | "slot"
  | "blackjack"
  | "roulette"
  | "bankrupt"
  | "leftEarly";

type GameId = "slot" | "blackjack" | "roulette";

type Stats = {
  startingMoney: number;
  startTime: number;
  totalGames: number;
  totalSpins: number;
  consecutiveLosses: number;
  oneMoreClicks: number;
  thinkItllWorkPrompts: number;
  breakEvenPrompts: number;
  rechargeAttempts: number;
  biggestWin: number;
  biggestLoss: number;
};

function emptyStats(starting: number): Stats {
  return {
    startingMoney: starting,
    startTime: Date.now(),
    totalGames: 0,
    totalSpins: 0,
    consecutiveLosses: 0,
    oneMoreClicks: 0,
    thinkItllWorkPrompts: 0,
    breakEvenPrompts: 0,
    rechargeAttempts: 0,
    biggestWin: 0,
    biggestLoss: 0,
  };
}

const RESULT_KEY = "nolza_gambling_last_v1";

type LastRun = {
  startingMoney: number;
  finalBalance: number;
  totalGames: number;
  durationMs: number;
};

// ============================================================================
// Money helpers
// ============================================================================

function formatWon(n: number, locale: "ko" | "en"): string {
  const v = Math.max(0, Math.round(n));
  if (locale === "ko") {
    return `${v.toLocaleString("ko-KR")}원`;
  }
  return `₩${v.toLocaleString("en-US")}`;
}

function elapsed(ms: number, locale: "ko" | "en"): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return locale === "ko" ? `${m}분 ${s}초` : `${m}m ${s}s`;
}

// ============================================================================
// Sound — synthesized via Web Audio API (no external assets)
// ============================================================================

type Sounds = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  spin: () => void;
  reelStop: () => void;
  win: () => void;
  bigWin: () => void;
  lose: () => void;
  coin: () => void;
  card: () => void;
  click: () => void;
  rouletteSpin: () => void;
};

function useSounds(): Sounds {
  const [enabled, setEnabledState] = useState(true);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      type AC = typeof AudioContext;
      type Win = Window & { webkitAudioContext?: AC };
      const Ctor: AC = window.AudioContext || ((window as Win).webkitAudioContext as AC);
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try {
      window.localStorage.setItem("nolza_gambling_sound", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("nolza_gambling_sound");
      if (v === "0") setEnabledState(false);
    } catch {
      /* ignore */
    }
    return () => {
      if (ctxRef.current) {
        void ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  const blip = useCallback(
    (
      freq: number,
      durMs: number,
      type: OscillatorType = "sine",
      gain = 0.12,
      slideTo?: number,
    ) => {
      if (!enabledRef.current) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + durMs / 1000);
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + durMs / 1000 + 0.05);
    },
    [ensureCtx],
  );

  const chord = useCallback(
    (freqs: number[], durMs: number, type: OscillatorType = "triangle", gain = 0.08) => {
      if (!enabledRef.current) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const t0 = ctx.currentTime;
      for (const f of freqs) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f, t0);
        g.gain.setValueAtTime(gain, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + durMs / 1000 + 0.05);
      }
    },
    [ensureCtx],
  );

  const noiseBurst = useCallback(
    (durMs: number, gain = 0.04) => {
      if (!enabledRef.current) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const t0 = ctx.currentTime;
      const dur = durMs / 1000;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(g);
      g.connect(ctx.destination);
      src.start(t0);
    },
    [ensureCtx],
  );

  return {
    enabled,
    setEnabled,
    spin: () => blip(220, 800, "sawtooth", 0.05, 110),
    reelStop: () => blip(180, 80, "square", 0.08),
    win: () => chord([523.25, 659.25, 783.99], 380, "triangle", 0.09),
    bigWin: () => {
      chord([523.25, 659.25, 783.99, 1046.5], 600, "triangle", 0.11);
      setTimeout(() => chord([659.25, 830.61, 987.77, 1318.5], 700, "triangle", 0.1), 220);
    },
    lose: () => blip(220, 280, "sine", 0.06, 80),
    coin: () => {
      blip(1480, 60, "triangle", 0.08);
      setTimeout(() => blip(1760, 50, "triangle", 0.07), 60);
    },
    card: () => noiseBurst(70, 0.05),
    click: () => blip(660, 30, "square", 0.04),
    rouletteSpin: () => noiseBurst(900, 0.03),
  };
}

// ============================================================================
// Random helpers
// ============================================================================

function pickWeighted<T>(entries: Array<[T, number]>): T {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [item, w] of entries) {
    r -= w;
    if (r <= 0) return item;
  }
  return entries[entries.length - 1][0];
}

// ============================================================================
// Page
// ============================================================================

export default function GamblingPage(): ReactElement {
  const { locale, t } = useLocale();
  const sounds = useSounds();
  const [phase, setPhase] = useState<Phase>("intro");
  const [bankroll, setBankroll] = useState(0);
  const [stats, setStats] = useState<Stats>(() => emptyStats(0));
  const [bet, setBet] = useState(5000);
  const [lastRun, setLastRun] = useState<LastRun | null>(null);
  const [exitDialog, setExitDialog] = useState(false);
  const [oneMoreDialog, setOneMoreDialog] = useState(false);
  const [oneMoreShownAt, setOneMoreShownAt] = useState<number | null>(null);
  const [rechargeDialog, setRechargeDialog] = useState(false);
  const [rechargeShown, setRechargeShown] = useState(false);
  const [eduPopup, setEduPopup] = useState<number | null>(null);
  const [eduShownIdxs, setEduShownIdxs] = useState<number[]>([]);
  const [tickerLine, setTickerLine] = useState<string | null>(null);

  // Load last run for the restart-prompt
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RESULT_KEY);
      if (raw) setLastRun(JSON.parse(raw) as LastRun);
    } catch {
      /* ignore */
    }
  }, []);

  // Bankrupt detection
  useEffect(() => {
    if (
      bankroll <= 0 &&
      (phase === "slot" || phase === "blackjack" || phase === "roulette")
    ) {
      const run: LastRun = {
        startingMoney: stats.startingMoney,
        finalBalance: 0,
        totalGames: stats.totalGames,
        durationMs: Date.now() - stats.startTime,
      };
      try {
        window.localStorage.setItem(RESULT_KEY, JSON.stringify(run));
      } catch {
        /* ignore */
      }
      setLastRun(run);
      const id = window.setTimeout(() => setPhase("bankrupt"), 800);
      return () => window.clearTimeout(id);
    }
  }, [bankroll, phase, stats]);

  // Recharge dialog when crossing 50% loss
  useEffect(() => {
    if (rechargeShown) return;
    if (phase !== "slot" && phase !== "blackjack" && phase !== "roulette") return;
    if (stats.startingMoney === 0) return;
    if (bankroll > 0 && bankroll <= stats.startingMoney * 0.5) {
      setRechargeDialog(true);
      setRechargeShown(true);
    }
  }, [bankroll, stats.startingMoney, phase, rechargeShown]);

  // "한 번만 더" dialog when bankroll falls to 20% of start
  useEffect(() => {
    if (oneMoreShownAt !== null) return;
    if (phase !== "slot" && phase !== "blackjack" && phase !== "roulette") return;
    if (stats.startingMoney === 0) return;
    if (bankroll > 0 && bankroll <= stats.startingMoney * 0.2) {
      setOneMoreDialog(true);
      setOneMoreShownAt(Date.now());
    }
  }, [bankroll, stats.startingMoney, phase, oneMoreShownAt]);

  // Manipulation ticker after streaks of losses
  useEffect(() => {
    if (phase !== "slot" && phase !== "blackjack" && phase !== "roulette") return;
    if (stats.consecutiveLosses === 3) {
      setTickerLine(
        t("이번엔 진짜 될 것 같은데...", "This time feels different..."),
      );
      setStats((s) => ({ ...s, thinkItllWorkPrompts: s.thinkItllWorkPrompts + 1 }));
    } else if (stats.consecutiveLosses === 5) {
      setTickerLine(t("이제 당첨될 차례예요!", "You're due for a win!"));
    } else if (stats.consecutiveLosses === 8) {
      setTickerLine(t("지금 그만두면 손해잖아요", "Quit now and you lock in the loss"));
      setStats((s) => ({ ...s, breakEvenPrompts: s.breakEvenPrompts + 1 }));
    }
  }, [stats.consecutiveLosses, phase, t]);

  // Auto-clear the ticker
  useEffect(() => {
    if (!tickerLine) return;
    const id = window.setTimeout(() => setTickerLine(null), 3500);
    return () => window.clearTimeout(id);
  }, [tickerLine]);

  // Random education popups while playing
  useEffect(() => {
    if (phase !== "slot" && phase !== "blackjack" && phase !== "roulette") return;
    const total = EDUCATION.length;
    if (eduShownIdxs.length >= total) return;
    const triggers = [6, 14, 22, 30];
    const target = triggers.find((tg) => stats.totalGames === tg);
    if (target === undefined) return;
    const remaining = EDUCATION.map((_, i) => i).filter((i) => !eduShownIdxs.includes(i));
    if (remaining.length === 0) return;
    const idx = remaining[Math.floor(Math.random() * remaining.length)];
    setEduPopup(idx);
    setEduShownIdxs((p) => [...p, idx]);
  }, [stats.totalGames, phase, eduShownIdxs]);

  // ─── Phase transitions ─────────────────────────────────────
  const startGame = useCallback((amount: number) => {
    setBankroll(amount);
    setStats(emptyStats(amount));
    setBet(Math.min(5000, Math.floor(amount / 20)));
    setOneMoreShownAt(null);
    setRechargeShown(false);
    setEduShownIdxs([]);
    setTickerLine(null);
    setPhase("gameSelect");
  }, []);

  const pickGame = useCallback(
    (g: GameId) => {
      sounds.click();
      setPhase(g);
    },
    [sounds],
  );

  const exitToGameSelect = useCallback(() => {
    setPhase("gameSelect");
  }, []);

  const requestExit = useCallback(() => {
    if (bankroll > 0 && phase !== "intro" && phase !== "bankSelect" && phase !== "gameSelect") {
      setExitDialog(true);
    } else {
      setPhase("intro");
    }
  }, [bankroll, phase]);

  const confirmExit = useCallback(() => {
    setExitDialog(false);
    const run: LastRun = {
      startingMoney: stats.startingMoney,
      finalBalance: bankroll,
      totalGames: stats.totalGames,
      durationMs: Date.now() - stats.startTime,
    };
    try {
      window.localStorage.setItem(RESULT_KEY, JSON.stringify(run));
    } catch {
      /* ignore */
    }
    setLastRun(run);
    setPhase("leftEarly");
  }, [bankroll, stats]);

  const restart = useCallback(() => {
    setBankroll(0);
    setStats(emptyStats(0));
    setPhase("bankSelect");
  }, []);

  // ─── Game callbacks ────────────────────────────────────────
  const settleRound = useCallback(
    (delta: number) => {
      setBankroll((b) => Math.max(0, b + delta));
      setStats((s) => ({
        ...s,
        totalGames: s.totalGames + 1,
        totalSpins: s.totalSpins + 1,
        consecutiveLosses: delta >= 0 ? 0 : s.consecutiveLosses + 1,
        biggestWin: delta > s.biggestWin ? delta : s.biggestWin,
        biggestLoss: delta < -s.biggestLoss ? -delta : s.biggestLoss,
      }));
    },
    [],
  );

  const adjustBet = useCallback(
    (newBet: number) => {
      setBet(Math.max(CHIP_DENOMS[0], Math.min(newBet, bankroll)));
    },
    [bankroll],
  );

  // ─── Render ────────────────────────────────────────────────
  return (
    <main
      style={{
        minHeight: "100svh",
        background: BG,
        color: "#f5f5f5",
        fontFamily: locale === "ko" ? KSANS : INTER,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SuitsBackdrop />

      {/* Top bar */}
      {phase !== "intro" && phase !== "bankrupt" && phase !== "leftEarly" && (
        <TopBar
          bankroll={bankroll}
          startingMoney={stats.startingMoney}
          phase={phase}
          locale={locale}
          t={t}
          soundOn={sounds.enabled}
          toggleSound={() => sounds.setEnabled(!sounds.enabled)}
          onExit={requestExit}
          onBackToMenu={
            phase === "slot" || phase === "blackjack" || phase === "roulette"
              ? exitToGameSelect
              : undefined
          }
        />
      )}

      {/* Phases */}
      {phase === "intro" && <IntroScreen onStart={() => setPhase("bankSelect")} t={t} lastRun={lastRun} locale={locale} />}

      {phase === "bankSelect" && (
        <BankSelectScreen
          onSelect={(amt) => {
            sounds.coin();
            startGame(amt);
          }}
          lastRun={lastRun}
          t={t}
          locale={locale}
        />
      )}

      {phase === "gameSelect" && (
        <GameSelectScreen onPick={pickGame} t={t} locale={locale} />
      )}

      {phase === "slot" && (
        <SlotMachine
          bankroll={bankroll}
          bet={bet}
          onBetChange={adjustBet}
          onSettle={settleRound}
          spinCount={stats.totalSpins}
          sounds={sounds}
          t={t}
          locale={locale}
        />
      )}

      {phase === "blackjack" && (
        <Blackjack
          bankroll={bankroll}
          bet={bet}
          onBetChange={adjustBet}
          onSettle={settleRound}
          sounds={sounds}
          t={t}
          locale={locale}
        />
      )}

      {phase === "roulette" && (
        <Roulette
          bankroll={bankroll}
          bet={bet}
          onBetChange={adjustBet}
          onSettle={settleRound}
          sounds={sounds}
          t={t}
          locale={locale}
        />
      )}

      {phase === "bankrupt" && lastRun && (
        <BankruptScreen
          stats={stats}
          run={lastRun}
          onRestart={restart}
          t={t}
          locale={locale}
        />
      )}

      {phase === "leftEarly" && lastRun && (
        <LeftEarlyScreen
          run={lastRun}
          onHome={() => setPhase("intro")}
          t={t}
          locale={locale}
        />
      )}

      {/* Manipulation ticker */}
      {tickerLine && <Ticker text={tickerLine} />}

      {/* Dialogs */}
      {oneMoreDialog && (
        <OneMoreDialog
          bankroll={bankroll}
          startingMoney={stats.startingMoney}
          onContinue={() => {
            setOneMoreDialog(false);
            setStats((s) => ({ ...s, oneMoreClicks: s.oneMoreClicks + 1 }));
          }}
          onStop={() => {
            setOneMoreDialog(false);
            confirmExit();
          }}
          t={t}
          locale={locale}
        />
      )}

      {rechargeDialog && (
        <RechargeDialog
          onAccept={() => {
            setRechargeDialog(false);
            setStats((s) => ({ ...s, rechargeAttempts: s.rechargeAttempts + 1 }));
          }}
          onCancel={() => setRechargeDialog(false)}
          t={t}
          locale={locale}
        />
      )}

      {exitDialog && (
        <ExitDialog
          bankroll={bankroll}
          startingMoney={stats.startingMoney}
          onConfirm={confirmExit}
          onCancel={() => setExitDialog(false)}
          t={t}
          locale={locale}
        />
      )}

      {eduPopup !== null && (
        <EducationPopup
          idx={eduPopup}
          onClose={() => setEduPopup(null)}
          t={t}
          locale={locale}
        />
      )}

      <Disclaimer t={t} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes gambleFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gambleLightOn {
  0%   { opacity: 0; }
  20%  { opacity: 0.4; }
  30%  { opacity: 0.05; }
  40%  { opacity: 0.6; }
  60%  { opacity: 0.2; }
  100% { opacity: 1; }
}
@keyframes gambleGlow {
  0%, 100% { text-shadow: 0 0 12px ${GOLD}66, 0 0 24px ${GOLD}33; }
  50%      { text-shadow: 0 0 20px ${GOLD}aa, 0 0 40px ${GOLD}66; }
}
@keyframes gambleSlide {
  from { transform: translateX(100%); opacity: 0; }
  10%  { transform: translateX(0); opacity: 1; }
  90%  { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}
@keyframes gambleFlash {
  0%, 100% { background: transparent; }
  50%      { background: ${GOLD}33; }
}
@keyframes gambleSpin360 {
  to { transform: rotate(360deg); }
}
@keyframes chipDrop {
  from { transform: translateY(-50px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.gamble-btn {
  cursor: pointer;
  border: 1.5px solid ${GOLD}55;
  background: linear-gradient(180deg, ${GOLD}, ${GOLD_DIM});
  color: #1a1a1a;
  font-weight: 800;
  letter-spacing: 0.04em;
  border-radius: 999px;
  padding: 14px 32px;
  font-size: 15px;
  font-family: ${INTER};
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  box-shadow: 0 6px 20px ${GOLD}33, inset 0 1px 0 rgba(255,255,255,0.4);
}
.gamble-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: 0 10px 28px ${GOLD}55, inset 0 1px 0 rgba(255,255,255,0.4);
}
.gamble-btn:active {
  transform: translateY(0);
  filter: brightness(0.95);
}
.gamble-btn.ghost {
  background: transparent;
  border: 1.5px solid rgba(255,255,255,0.3);
  color: #f5f5f5;
  box-shadow: none;
}
.gamble-btn.ghost:hover {
  border-color: ${GOLD};
  color: ${GOLD};
  box-shadow: 0 0 20px ${GOLD}33;
}
.gamble-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
.gamble-card {
  background: linear-gradient(180deg, #161616, #0d0d0d);
  border: 1px solid rgba(255,215,0,0.18);
  border-radius: 16px;
}
`,
        }}
      />
    </main>
  );
}

// ============================================================================
// Suits backdrop — faint repeating ♠♥♦♣ pattern
// ============================================================================

function SuitsBackdrop(): ReactElement {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        opacity: 0.04,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at top, rgba(255,215,0,0.08), transparent 60%)",
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="suits" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <text x="20" y="40" fontSize="22" fill="#fff">♠</text>
            <text x="80" y="40" fontSize="22" fill="#fff">♥</text>
            <text x="20" y="100" fontSize="22" fill="#fff">♦</text>
            <text x="80" y="100" fontSize="22" fill="#fff">♣</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#suits)" />
      </svg>
    </div>
  );
}

// ============================================================================
// Top bar
// ============================================================================

function TopBar({
  bankroll,
  startingMoney,
  phase,
  locale,
  t,
  soundOn,
  toggleSound,
  onExit,
  onBackToMenu,
}: {
  bankroll: number;
  startingMoney: number;
  phase: Phase;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  soundOn: boolean;
  toggleSound: () => void;
  onExit: () => void;
  onBackToMenu?: () => void;
}): ReactElement {
  const pct = startingMoney > 0 ? (bankroll / startingMoney) * 100 : 100;
  const color = pct > 60 ? GOLD : pct > 30 ? "#f59e0b" : "#ef4444";
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0))",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onExit}
          aria-label={t("나가기", "Exit")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#f5f5f5",
            width: 36,
            height: 36,
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ←
        </button>
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: locale === "ko" ? KSANS : INTER,
              letterSpacing: "0.04em",
            }}
          >
            {t("게임 변경", "Change game")}
          </button>
        )}
      </div>

      {phase !== "bankSelect" && phase !== "gameSelect" && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 13,
              letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 700,
            }}
          >
            {t("잔액", "BALANCE")}
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 22,
              fontWeight: 800,
              color,
              letterSpacing: "-0.01em",
              fontVariantNumeric: "tabular-nums",
              textShadow: `0 0 16px ${color}55`,
            }}
          >
            {formatWon(bankroll, locale)}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={toggleSound}
          aria-label={soundOn ? "Mute" : "Unmute"}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: soundOn ? GOLD : "rgba(255,255,255,0.5)",
            width: 36,
            height: 36,
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {soundOn ? "♪" : "✕"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Intro
// ============================================================================

function IntroScreen({
  onStart,
  t,
  lastRun,
  locale,
}: {
  onStart: () => void;
  t: (ko: string, en: string) => string;
  lastRun: LastRun | null;
  locale: "ko" | "en";
}): ReactElement {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 1500);
    const t2 = window.setTimeout(() => setStep(2), 4200);
    const t3 = window.setTimeout(() => setStep(3), 5800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      {/* Casino lights */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(circle at 20% 20%, ${GOLD}22 0%, transparent 30%),` +
            `radial-gradient(circle at 80% 30%, ${GOLD}22 0%, transparent 30%),` +
            `radial-gradient(circle at 50% 80%, ${GOLD}22 0%, transparent 35%)`,
          animation: "gambleLightOn 2.5s ease-out forwards",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: INTER,
          color: GOLD,
          fontSize: 14,
          letterSpacing: "0.4em",
          fontWeight: 700,
          marginBottom: 36,
          opacity: step >= 0 ? 1 : 0,
          transition: "opacity 1s ease 0.4s",
          animation: "gambleGlow 2.4s ease-in-out infinite",
        }}
      >
        CASINO ROYALE · {t("도박 시뮬레이터", "GAMBLING SIMULATOR")}
      </div>

      <h1
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.4,
          maxWidth: 720,
          margin: 0,
          color: "#f5f5f5",
          opacity: step >= 1 ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      >
        {t(
          "라스베이거스의 카지노들은 매년 70억 달러를 법니다.",
          "Las Vegas casinos earn $7 billion every year.",
        )}
      </h1>

      <p
        style={{
          marginTop: 36,
          fontFamily: SERIF,
          fontSize: "clamp(22px, 3.5vw, 32px)",
          color: GOLD,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          opacity: step >= 2 ? 1 : 0,
          transition: "opacity 1.2s ease",
          textShadow: `0 0 18px ${GOLD}55`,
        }}
      >
        {t("당신에게서요.", "From you.")}
      </p>

      {step >= 3 && (
        <div
          style={{
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            animation: "gambleFadeIn 0.8s ease forwards",
          }}
        >
          <button onClick={onStart} className="gamble-btn">
            {t("직접 체험해보기 →", "Try it yourself →")}
          </button>
          {lastRun && (
            <div
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "rgba(255,255,255,0.45)",
                fontFamily: locale === "ko" ? KSANS : INTER,
                letterSpacing: "0.05em",
              }}
            >
              {t(
                `지난번엔 ${formatWon(lastRun.startingMoney, locale)}로 시작해서 ${formatWon(lastRun.finalBalance, locale)}이 남았습니다.`,
                `Last time: started with ${formatWon(lastRun.startingMoney, locale)}, ended with ${formatWon(lastRun.finalBalance, locale)}.`,
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Bank select
// ============================================================================

const BANK_OPTIONS: Array<{ amount: number; ko: string; en: string }> = [
  { amount: 100_000, ko: "가볍게", en: "Light" },
  { amount: 500_000, ko: "적당히", en: "Moderate" },
  { amount: 1_000_000, ko: "한번 해보자", en: "Going big" },
];

function BankSelectScreen({
  onSelect,
  lastRun,
  t,
  locale,
}: {
  onSelect: (amount: number) => void;
  lastRun: LastRun | null;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 20px 60px",
        textAlign: "center",
      }}
    >
      {lastRun && lastRun.finalBalance === 0 && (
        <div
          style={{
            marginBottom: 32,
            padding: "14px 22px",
            border: `1px solid ${GOLD}33`,
            borderRadius: 999,
            background: "rgba(255,215,0,0.05)",
            color: GOLD,
            fontFamily: locale === "ko" ? KSANS : INTER,
            fontSize: 15,
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          {t(
            `지난번엔 ${formatWon(lastRun.startingMoney, locale)}을 잃으셨어요. 정말 다시 하실 건가요?`,
            `Last time you lost ${formatWon(lastRun.startingMoney, locale)}. Are you sure?`,
          )}
        </div>
      )}

      <h2
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(26px, 4.5vw, 40px)",
          fontWeight: 700,
          color: "#f5f5f5",
          margin: 0,
          marginBottom: 14,
        }}
      >
        {t("오늘 밤 얼마로 시작할까요?", "How much will you bring tonight?")}
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 16,
          letterSpacing: "0.03em",
          marginBottom: 48,
          fontFamily: locale === "ko" ? KSANS : INTER,
        }}
      >
        {t(
          "선택한 금액이 칩으로 환전됩니다.",
          "Your chips will be exchanged at the cage.",
        )}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          width: "100%",
          maxWidth: 760,
        }}
      >
        {BANK_OPTIONS.map((opt) => (
          <button
            key={opt.amount}
            onClick={() => onSelect(opt.amount)}
            className="gamble-card"
            style={{
              padding: "30px 18px",
              cursor: "pointer",
              transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
              color: "#f5f5f5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              fontFamily: locale === "ko" ? KSANS : INTER,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = GOLD;
              e.currentTarget.style.boxShadow = `0 16px 40px ${GOLD}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,215,0,0.18)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <ChipStack value={opt.amount} />
            <div style={{ fontSize: 26, fontWeight: 800, color: GOLD, fontFamily: INTER }}>
              {formatWon(opt.amount, locale)}
            </div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)" }}>
              {locale === "ko" ? opt.ko : opt.en}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipStack({ value }: { value: number }): ReactElement {
  const colors =
    value >= 1_000_000
      ? ["#7c3aed", "#dc2626", "#16a34a", GOLD]
      : value >= 500_000
        ? ["#dc2626", "#16a34a", GOLD]
        : ["#16a34a", GOLD];
  return (
    <div
      style={{
        position: "relative",
        height: 60,
        width: 60,
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
      }}
      aria-hidden
    >
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: i * 8,
            width: 56,
            height: 18,
            borderRadius: "50%/50%",
            background: `radial-gradient(ellipse at 50% 30%, ${c}, ${c}aa)`,
            border: "2px dashed rgba(255,255,255,0.3)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            animation: `chipDrop 0.4s ease ${i * 0.08}s both`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Game select
// ============================================================================

function GameSelectScreen({
  onPick,
  t,
  locale,
}: {
  onPick: (g: GameId) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const games: Array<{ id: GameId; emoji: string; ko: string; en: string; oddsKo: string; oddsEn: string }> = [
    { id: "slot", emoji: "🎰", ko: "슬롯머신", en: "Slot Machine", oddsKo: "당첨 확률 1/1000", oddsEn: "Jackpot odds 1/1,000" },
    { id: "blackjack", emoji: "🃏", ko: "블랙잭", en: "Blackjack", oddsKo: "카지노 승률 51%", oddsEn: "House edge 1–2%" },
    { id: "roulette", emoji: "🎲", ko: "룰렛", en: "Roulette", oddsKo: "카지노 승률 52.7%", oddsEn: "House edge 5.26%" },
  ];
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 20px 60px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(26px, 4.5vw, 40px)",
          fontWeight: 700,
          color: "#f5f5f5",
          margin: 0,
          marginBottom: 48,
        }}
      >
        {t("어떤 게임으로 시작할까요?", "Which table will it be?")}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
          width: "100%",
          maxWidth: 820,
        }}
      >
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => onPick(g.id)}
            className="gamble-card"
            style={{
              padding: "32px 20px",
              cursor: "pointer",
              transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
              color: "#f5f5f5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = GOLD;
              e.currentTarget.style.boxShadow = `0 16px 40px ${GOLD}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,215,0,0.18)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 56, lineHeight: 1 }}>{g.emoji}</div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 22,
                fontWeight: 700,
                color: GOLD,
              }}
            >
              {locale === "ko" ? g.ko : g.en}
            </div>
            {/* Tiny probability text — intentionally easy to miss */}
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.25)",
                fontFamily: INTER,
                letterSpacing: "0.05em",
              }}
            >
              {locale === "ko" ? g.oddsKo : g.oddsEn}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Bet selector — shared
// ============================================================================

function BetSelector({
  bet,
  bankroll,
  onChange,
  t,
  locale,
  disabled,
}: {
  bet: number;
  bankroll: number;
  onChange: (n: number) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
  disabled?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 13,
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 700,
          fontFamily: INTER,
        }}
      >
        {t("베팅", "BET")}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {CHIP_DENOMS.map((d) => {
          const active = bet === d;
          const tooBig = d > bankroll;
          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              disabled={disabled || tooBig}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `2.5px dashed ${active ? GOLD : "rgba(255,255,255,0.2)"}`,
                background: active
                  ? `radial-gradient(circle at 30% 30%, ${GOLD}, ${GOLD_DIM})`
                  : "radial-gradient(circle at 30% 30%, #2a2a2a, #1a1a1a)",
                color: active ? "#1a1a1a" : "rgba(255,255,255,0.7)",
                fontWeight: 800,
                fontFamily: INTER,
                fontSize: 13,
                cursor: tooBig || disabled ? "not-allowed" : "pointer",
                opacity: tooBig ? 0.3 : 1,
                transition: "transform 0.15s ease",
                boxShadow: active ? `0 0 16px ${GOLD}66` : "none",
              }}
            >
              {d >= 10000 ? `${d / 10000}만` : `${d / 1000}천`}
            </button>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 15,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {formatWon(bet, locale)}
      </div>
    </div>
  );
}

// ============================================================================
// Slot machine
// ============================================================================

const SLOT_SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];
type SlotResult = "big" | "small" | "even" | "loss";

function rollSlot(spinNumber: number): SlotResult {
  // First 3 spins: "beginner's luck" — boosted win chances
  if (spinNumber < 3) {
    return pickWeighted<SlotResult>([
      ["big", 0.05],
      ["small", 0.5],
      ["even", 0.2],
      ["loss", 0.25],
    ]);
  }
  // After: house-favorable spec
  return pickWeighted<SlotResult>([
    ["big", 0.005],
    ["small", 0.2],
    ["even", 0.15],
    ["loss", 0.645],
  ]);
}

function symbolsForResult(result: SlotResult): [string, string, string] {
  if (result === "big") {
    return ["7️⃣", "7️⃣", "7️⃣"];
  }
  if (result === "small") {
    const s = SLOT_SYMBOLS[Math.floor(Math.random() * 4)]; // 🍒/🍋/🔔/⭐
    return [s, s, s];
  }
  if (result === "even") {
    const s = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    const o = SLOT_SYMBOLS.filter((x) => x !== s);
    return [s, s, o[Math.floor(Math.random() * o.length)]];
  }
  // miss — three different symbols
  const arr = [...SLOT_SYMBOLS];
  const out: string[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * arr.length);
    out.push(arr[idx]);
    arr.splice(idx, 1);
  }
  return [out[0], out[1], out[2]];
}

function payoutForResult(result: SlotResult, bet: number): number {
  if (result === "big") return bet * 10;
  if (result === "small") return Math.round(bet * 1.5);
  if (result === "even") return bet;
  return 0;
}

function SlotMachine({
  bankroll,
  bet,
  onBetChange,
  onSettle,
  spinCount,
  sounds,
  t,
  locale,
}: {
  bankroll: number;
  bet: number;
  onBetChange: (n: number) => void;
  onSettle: (delta: number) => void;
  spinCount: number;
  sounds: Sounds;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [reels, setReels] = useState<[string, string, string]>(["🎰", "🎰", "🎰"]);
  const [spinning, setSpinning] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [lastResult, setLastResult] = useState<{ delta: number; result: SlotResult } | null>(null);
  const [flash, setFlash] = useState(false);

  const pull = useCallback(() => {
    if (spinning[0] || spinning[1] || spinning[2]) return;
    if (bet > bankroll) return;
    const result = rollSlot(spinCount);
    const final = symbolsForResult(result);
    setSpinning([true, true, true]);
    setLastResult(null);
    sounds.spin();

    // Stagger the reel stops
    [600, 1100, 1700].forEach((ms, i) => {
      window.setTimeout(() => {
        setReels((prev) => {
          const next = [...prev] as [string, string, string];
          next[i] = final[i];
          return next;
        });
        setSpinning((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[i] = false;
          return next;
        });
        sounds.reelStop();
      }, ms);
    });

    window.setTimeout(() => {
      const payout = payoutForResult(result, bet);
      const delta = payout - bet;
      onSettle(delta);
      setLastResult({ delta, result });
      if (result === "big") {
        sounds.bigWin();
        setFlash(true);
        window.setTimeout(() => setFlash(false), 1500);
      } else if (result === "small") {
        sounds.win();
        sounds.coin();
      } else if (result === "even") {
        sounds.coin();
      } else {
        sounds.lose();
      }
    }, 1850);
  }, [bet, bankroll, sounds, onSettle, spinCount, spinning]);

  const isSpinning = spinning[0] || spinning[1] || spinning[2];

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 20px 60px",
      }}
    >
      {flash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "transparent",
            animation: "gambleFlash 0.4s ease 3",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}

      <div
        style={{
          background:
            "linear-gradient(180deg, #2a1810 0%, #1a0f08 100%)",
          border: `3px solid ${GOLD}`,
          borderRadius: 24,
          padding: "32px 40px 28px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.7), inset 0 0 40px ${GOLD}22`,
          maxWidth: 480,
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            color: GOLD,
            fontSize: 18,
            textAlign: "center",
            letterSpacing: "0.3em",
            marginBottom: 4,
            animation: "gambleGlow 2.4s ease-in-out infinite",
            fontWeight: 700,
          }}
        >
          ★ JACKPOT ★
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            textAlign: "center",
            marginBottom: 24,
            letterSpacing: "0.4em",
          }}
        >
          MEGA BIG WIN
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            background: "#000",
            border: `2px solid ${GOLD_DIM}`,
            borderRadius: 12,
            padding: 14,
            boxShadow: `inset 0 0 24px rgba(0,0,0,0.9), 0 0 0 4px ${GOLD}33`,
          }}
        >
          {[0, 1, 2].map((i) => (
            <Reel key={i} symbol={reels[i]} spinning={spinning[i]} />
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            minHeight: 28,
            textAlign: "center",
            fontFamily: INTER,
            fontSize: 18,
            fontWeight: 800,
            color: lastResult
              ? lastResult.delta > 0
                ? GOLD
                : lastResult.delta === 0
                  ? "#9ca3af"
                  : "#ef4444"
              : "transparent",
          }}
        >
          {lastResult
            ? lastResult.delta > 0
              ? `+ ${formatWon(lastResult.delta, locale)} ✨`
              : lastResult.delta < 0
                ? `− ${formatWon(-lastResult.delta, locale)}`
                : t("본전", "Push")
            : "—"}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <BetSelector
          bet={bet}
          bankroll={bankroll}
          onChange={onBetChange}
          t={t}
          locale={locale}
          disabled={isSpinning}
        />
      </div>

      <button
        onClick={pull}
        disabled={isSpinning || bet > bankroll}
        className="gamble-btn"
        style={{
          marginTop: 24,
          padding: "18px 56px",
          fontSize: 18,
        }}
      >
        {isSpinning ? t("돌리는 중…", "Spinning…") : t("레버 당기기", "PULL THE LEVER")}
      </button>
    </div>
  );
}

function Reel({ symbol, spinning }: { symbol: string; spinning: boolean }): ReactElement {
  const [tickSymbol, setTickSymbol] = useState(symbol);
  useEffect(() => {
    if (!spinning) {
      setTickSymbol(symbol);
      return;
    }
    const id = window.setInterval(() => {
      setTickSymbol(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
    }, 70);
    return () => window.clearInterval(id);
  }, [spinning, symbol]);
  return (
    <div
      style={{
        height: 100,
        background: "linear-gradient(180deg, #1a1a1a, #050505 50%, #1a1a1a)",
        border: "1px solid rgba(255,215,0,0.25)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 56,
        overflow: "hidden",
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
      }}
    >
      {tickSymbol}
    </div>
  );
}

// ============================================================================
// Blackjack
// ============================================================================

type Suit = "♠" | "♥" | "♦" | "♣";
type Card = { rank: string; suit: Suit; value: number };

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Array<{ rank: string; value: number }> = [
  { rank: "A", value: 11 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 10 },
  { rank: "Q", value: 10 },
  { rank: "K", value: 10 },
];

function newDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) for (const r of RANKS) deck.push({ ...r, suit: s });
  // Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handTotal(cards: Card[]): number {
  let total = cards.reduce((s, c) => s + c.value, 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

type BJPhase = "idle" | "playing" | "dealer" | "done";

function Blackjack({
  bankroll,
  bet,
  onBetChange,
  onSettle,
  sounds,
  t,
  locale,
}: {
  bankroll: number;
  bet: number;
  onBetChange: (n: number) => void;
  onSettle: (delta: number) => void;
  sounds: Sounds;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const deckRef = useRef<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [phase, setPhase] = useState<BJPhase>("idle");
  const [activeBet, setActiveBet] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const draw = useCallback((): Card => {
    if (deckRef.current.length < 10) deckRef.current = newDeck();
    return deckRef.current.shift()!;
  }, []);

  const deal = useCallback(() => {
    if (bet > bankroll) return;
    deckRef.current = newDeck();
    sounds.card();
    const p1 = draw();
    const d1 = draw();
    const p2 = draw();
    const d2 = draw();
    setPlayer([p1, p2]);
    setDealer([d1, d2]);
    setActiveBet(bet);
    setPhase("playing");
    setMessage(null);
    setRevealed(false);
    // Naturals
    if (handTotal([p1, p2]) === 21) {
      window.setTimeout(() => settle([p1, p2], [d1, d2], bet, true), 600);
    }
  }, [bet, bankroll, draw, sounds]);

  const hit = useCallback(() => {
    if (phase !== "playing") return;
    sounds.card();
    const next = [...player, draw()];
    setPlayer(next);
    if (handTotal(next) >= 21) {
      window.setTimeout(() => stand(next), 350);
    }
  }, [phase, player, draw, sounds]);

  const stand = useCallback(
    (final?: Card[]) => {
      if (phase !== "playing") return;
      const playerHand = final ?? player;
      setPhase("dealer");
      setRevealed(true);
      let dealerHand = [...dealer];
      const playDealer = () => {
        if (handTotal(playerHand) > 21) {
          settle(playerHand, dealerHand, activeBet, false);
          return;
        }
        if (handTotal(dealerHand) < 17) {
          dealerHand = [...dealerHand, draw()];
          setDealer(dealerHand);
          sounds.card();
          window.setTimeout(playDealer, 600);
        } else {
          settle(playerHand, dealerHand, activeBet, false);
        }
      };
      window.setTimeout(playDealer, 500);
    },
    [phase, player, dealer, activeBet, draw, sounds],
  );

  const double = useCallback(() => {
    if (phase !== "playing" || player.length !== 2) return;
    if (activeBet * 2 > bankroll + activeBet) return; // not enough chips left
    setActiveBet(activeBet * 2);
    sounds.card();
    const next = [...player, draw()];
    setPlayer(next);
    window.setTimeout(() => stand(next), 350);
  }, [phase, player, activeBet, bankroll, draw, sounds, stand]);

  const settle = useCallback(
    (p: Card[], d: Card[], wager: number, playerNatural: boolean) => {
      const pt = handTotal(p);
      const dt = handTotal(d);
      let delta = -wager;
      let msg = t("패배", "Lose");
      if (pt > 21) {
        delta = -wager;
        msg = t("버스트!", "Bust!");
      } else if (dt > 21) {
        delta = wager;
        msg = t("딜러 버스트 — 승리", "Dealer busts — You win");
      } else if (playerNatural && dt !== 21) {
        delta = Math.round(wager * 1.5);
        msg = t("블랙잭! 1.5배 지급", "Blackjack! 3:2 payout");
      } else if (pt > dt) {
        delta = wager;
        msg = t("승리", "You win");
      } else if (pt === dt) {
        delta = 0;
        msg = t("푸시 — 본전", "Push");
      }
      setRevealed(true);
      setPhase("done");
      setMessage(msg);
      onSettle(delta);
      if (delta > 0) sounds.win();
      else if (delta === 0) sounds.click();
      else sounds.lose();
    },
    [onSettle, sounds, t],
  );

  const reset = useCallback(() => {
    setPlayer([]);
    setDealer([]);
    setPhase("idle");
    setMessage(null);
    setRevealed(false);
  }, []);

  const playerScore = handTotal(player);
  const dealerScore = revealed ? handTotal(dealer) : dealer[0]?.value ?? 0;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "92px 20px 40px",
      }}
    >
      <div
        style={{
          background: `radial-gradient(ellipse at center top, ${FELT}, #061a0e)`,
          border: `3px solid ${GOLD}`,
          borderRadius: 200,
          width: "100%",
          maxWidth: 720,
          padding: "40px 24px 80px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(0,0,0,0.6)`,
          position: "relative",
          minHeight: 460,
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            color: GOLD,
            fontSize: 13,
            letterSpacing: "0.4em",
            textAlign: "center",
            marginBottom: 18,
            opacity: 0.7,
            fontWeight: 700,
          }}
        >
          BLACKJACK · {t("3:2 지급", "PAYS 3 TO 2")}
        </div>

        {/* Dealer */}
        <div style={{ marginBottom: 24 }}>
          <Label text={t("딜러", "Dealer")} score={phase !== "idle" ? dealerScore : null} hidden={!revealed && dealer.length > 0} />
          <Hand cards={dealer} hideSecond={!revealed} />
        </div>

        {/* Player */}
        <div>
          <Label text={t("나", "You")} score={phase !== "idle" ? playerScore : null} />
          <Hand cards={player} />
        </div>

        {message && (
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              fontFamily: SERIF,
              fontSize: 22,
              color: GOLD,
              fontWeight: 700,
            }}
          >
            {message}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {phase === "idle" || phase === "done" ? (
          <>
            <BetSelector bet={bet} bankroll={bankroll} onChange={onBetChange} t={t} locale={locale} />
            <button
              onClick={() => {
                if (phase === "done") reset();
                deal();
              }}
              disabled={bet > bankroll}
              className="gamble-btn"
              style={{ padding: "16px 44px", fontSize: 16 }}
            >
              {phase === "done"
                ? t("다음 판", "Next hand")
                : t("딜 (Deal)", "DEAL")}
            </button>
          </>
        ) : phase === "playing" ? (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={hit} className="gamble-btn">
              HIT
            </button>
            <button onClick={() => stand()} className="gamble-btn ghost">
              STAND
            </button>
            <button
              onClick={double}
              disabled={player.length !== 2 || activeBet * 2 > bankroll + activeBet}
              className="gamble-btn ghost"
            >
              DOUBLE
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Label({
  text,
  score,
  hidden,
}: {
  text: string;
  score: number | null;
  hidden?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: 10,
        fontFamily: INTER,
        fontSize: 13,
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.55)",
        fontWeight: 700,
      }}
    >
      {text}
      {score !== null && !hidden && (
        <span style={{ marginLeft: 8, color: GOLD }}>· {score}</span>
      )}
    </div>
  );
}

function Hand({ cards, hideSecond = false }: { cards: Card[]; hideSecond?: boolean }): ReactElement {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, minHeight: 110 }}>
      {cards.map((c, i) => (
        <CardView key={i} card={c} hidden={hideSecond && i === 1} index={i} />
      ))}
    </div>
  );
}

function CardView({ card, hidden, index }: { card: Card; hidden: boolean; index: number }): ReactElement {
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      style={{
        width: 70,
        height: 100,
        borderRadius: 8,
        background: hidden
          ? `linear-gradient(135deg, #7c1d2a, #4a0f1a)`
          : "#fefefe",
        border: hidden ? `2px solid ${GOLD}55` : "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 6,
        boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
        animation: `gambleFadeIn 0.35s ease ${index * 0.08}s both`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hidden ? (
        <div
          style={{
            color: GOLD,
            fontSize: 32,
            margin: "auto",
            fontFamily: SERIF,
            fontWeight: 800,
            opacity: 0.6,
          }}
        >
          ♛
        </div>
      ) : (
        <>
          <div style={{ color: red ? "#dc2626" : "#0a0a0a", fontWeight: 700, fontFamily: INTER }}>
            <div style={{ fontSize: 16, lineHeight: 1 }}>{card.rank}</div>
            <div style={{ fontSize: 16, lineHeight: 1 }}>{card.suit}</div>
          </div>
          <div
            style={{
              color: red ? "#dc2626" : "#0a0a0a",
              fontSize: 30,
              alignSelf: "center",
            }}
          >
            {card.suit}
          </div>
          <div
            style={{
              color: red ? "#dc2626" : "#0a0a0a",
              fontWeight: 700,
              fontFamily: INTER,
              alignSelf: "flex-end",
              transform: "rotate(180deg)",
            }}
          >
            <div style={{ fontSize: 16, lineHeight: 1 }}>{card.rank}</div>
            <div style={{ fontSize: 16, lineHeight: 1 }}>{card.suit}</div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Roulette (American — 0 and 00 → house edge 5.26%)
// ============================================================================

type RouletteBet =
  | { kind: "color"; value: "red" | "black" }
  | { kind: "parity"; value: "odd" | "even" }
  | { kind: "number"; value: number };

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

function rouletteSpin(): { number: number | "00" } {
  const r = Math.floor(Math.random() * 38);
  if (r === 0) return { number: 0 };
  if (r === 1) return { number: "00" };
  return { number: r - 1 };
}

function payoutRoulette(bet: RouletteBet, result: number | "00", wager: number): number {
  if (result === "00" || result === 0) return -wager;
  if (bet.kind === "color") {
    const isRed = RED_NUMBERS.has(result);
    if ((bet.value === "red" && isRed) || (bet.value === "black" && !isRed)) return wager;
    return -wager;
  }
  if (bet.kind === "parity") {
    const odd = result % 2 === 1;
    if ((bet.value === "odd" && odd) || (bet.value === "even" && !odd)) return wager;
    return -wager;
  }
  if (bet.kind === "number") {
    return bet.value === result ? wager * 35 : -wager;
  }
  return -wager;
}

function Roulette({
  bankroll,
  bet,
  onBetChange,
  onSettle,
  sounds,
  t,
  locale,
}: {
  bankroll: number;
  bet: number;
  onBetChange: (n: number) => void;
  onSettle: (delta: number) => void;
  sounds: Sounds;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [pick, setPick] = useState<RouletteBet>({ kind: "color", value: "red" });
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | "00" | null>(null);
  const [angle, setAngle] = useState(0);

  const spin = useCallback(() => {
    if (spinning || bet > bankroll) return;
    const outcome = rouletteSpin();
    setSpinning(true);
    setResult(null);
    sounds.rouletteSpin();
    // Random angle that lands on a multiple of 360 + a stable position
    setAngle((a) => a + 1800 + Math.floor(Math.random() * 360));
    window.setTimeout(() => {
      setSpinning(false);
      setResult(outcome.number);
      const delta = payoutRoulette(pick, outcome.number, bet);
      onSettle(delta);
      if (delta > 0) sounds.win();
      else sounds.lose();
    }, 3200);
  }, [spinning, bet, bankroll, pick, onSettle, sounds]);

  const resultColor =
    result === "00" || result === 0
      ? "#10b981"
      : typeof result === "number" && RED_NUMBERS.has(result)
        ? "#dc2626"
        : "#1a1a1a";

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "92px 20px 40px",
      }}
    >
      {/* Wheel */}
      <div
        style={{
          width: 280,
          height: 280,
          borderRadius: "50%",
          position: "relative",
          background: `radial-gradient(circle at 50% 50%, #1a0f08 0%, #0a0a0a 80%)`,
          border: `4px solid ${GOLD}`,
          boxShadow: `0 0 50px ${GOLD}55, inset 0 0 60px rgba(0,0,0,0.7)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RouletteWheelSVG angle={angle} spinning={spinning} />
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `16px solid ${GOLD}`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
          }}
        />
      </div>

      {result !== null && !spinning && (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
            animation: "gambleFadeIn 0.5s ease",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: resultColor,
              border: `2px solid ${GOLD}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: INTER,
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              boxShadow: `0 0 24px ${resultColor}88`,
            }}
          >
            {result}
          </div>
        </div>
      )}

      {/* Betting */}
      <div
        className="gamble-card"
        style={{
          marginTop: 28,
          padding: "20px 22px",
          width: "100%",
          maxWidth: 560,
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 14,
            fontFamily: INTER,
          }}
        >
          {t("어디에 거시겠어요?", "PLACE YOUR BET")}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          <RBet
            label={t("빨강 (1:1)", "RED (1:1)")}
            color="#dc2626"
            active={pick.kind === "color" && pick.value === "red"}
            onClick={() => setPick({ kind: "color", value: "red" })}
          />
          <RBet
            label={t("검정 (1:1)", "BLACK (1:1)")}
            color="#1a1a1a"
            active={pick.kind === "color" && pick.value === "black"}
            onClick={() => setPick({ kind: "color", value: "black" })}
          />
          <RBet
            label={t("홀수 (1:1)", "ODD (1:1)")}
            color="#374151"
            active={pick.kind === "parity" && pick.value === "odd"}
            onClick={() => setPick({ kind: "parity", value: "odd" })}
          />
          <RBet
            label={t("짝수 (1:1)", "EVEN (1:1)")}
            color="#374151"
            active={pick.kind === "parity" && pick.value === "even"}
            onClick={() => setPick({ kind: "parity", value: "even" })}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em",
              fontFamily: INTER,
            }}
          >
            {t("숫자 (35:1)", "NUMBER (35:1)")}
          </span>
          <input
            type="number"
            min={0}
            max={36}
            value={pick.kind === "number" ? pick.value : ""}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v) && v >= 0 && v <= 36) {
                setPick({ kind: "number", value: v });
              }
            }}
            placeholder="0–36"
            style={{
              width: 72,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.4)",
              color: "#fff",
              fontFamily: INTER,
              textAlign: "center",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            marginTop: 8,
            letterSpacing: "0.05em",
          }}
        >
          {t(
            "0과 00에 멈추면 모든 베팅이 카지노에 갑니다",
            "0 and 00 sweep all outside bets to the house",
          )}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <BetSelector
          bet={bet}
          bankroll={bankroll}
          onChange={onBetChange}
          t={t}
          locale={locale}
          disabled={spinning}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || bet > bankroll}
        className="gamble-btn"
        style={{ marginTop: 22, padding: "16px 44px", fontSize: 16 }}
      >
        {spinning ? t("회전 중…", "Spinning…") : t("스핀", "SPIN")}
      </button>
    </div>
  );
}

function RouletteWheelSVG({ angle, spinning }: { angle: number; spinning: boolean }): ReactElement {
  return (
    <svg
      viewBox="0 0 200 200"
      width="240"
      height="240"
      style={{
        transform: `rotate(${angle}deg)`,
        transition: spinning ? "transform 3s cubic-bezier(0.18, 0.85, 0.2, 1)" : "none",
      }}
      aria-hidden
    >
      {/* 38 segments — alternating red/black + green for 0/00 */}
      {Array.from({ length: 38 }, (_, i) => {
        const a1 = (i * 360) / 38;
        const a2 = ((i + 1) * 360) / 38;
        const x1 = 100 + 90 * Math.cos((a1 - 90) * Math.PI / 180);
        const y1 = 100 + 90 * Math.sin((a1 - 90) * Math.PI / 180);
        const x2 = 100 + 90 * Math.cos((a2 - 90) * Math.PI / 180);
        const y2 = 100 + 90 * Math.sin((a2 - 90) * Math.PI / 180);
        let fill = i % 2 === 0 ? "#dc2626" : "#1a1a1a";
        if (i === 0 || i === 19) fill = "#10b981";
        return (
          <path
            key={i}
            d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
            fill={fill}
            stroke="#0a0a0a"
            strokeWidth="0.5"
          />
        );
      })}
      <circle cx="100" cy="100" r="22" fill={GOLD} />
      <circle cx="100" cy="100" r="14" fill="#1a0f08" />
    </svg>
  );
}

function RBet({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? color : `${color}55`,
        border: `2px solid ${active ? GOLD : "transparent"}`,
        color: "#fff",
        fontFamily: INTER,
        fontSize: 14,
        fontWeight: 700,
        padding: "10px 14px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.15s ease",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </button>
  );
}

// ============================================================================
// Bankrupt screen — the reckoning
// ============================================================================

type AlternativeUse = { emoji: string; ko: string; en: string; cost: number };

const ALTERNATIVES: AlternativeUse[] = [
  { emoji: "🍕", ko: "피자", en: "pizza", cost: 20000 },
  { emoji: "📚", ko: "책", en: "books", cost: 15000 },
  { emoji: "🎬", ko: "영화", en: "movie tickets", cost: 13000 },
  { emoji: "✈️", ko: "제주도 왕복 항공권", en: "Jeju round-trip flights", cost: 120000 },
  { emoji: "☕", ko: "카페 라떼", en: "lattes", cost: 5000 },
  { emoji: "🎮", ko: "스팀 인기 게임", en: "Steam game", cost: 30000 },
  { emoji: "🏃", ko: "헬스장 한 달 회원권", en: "month of gym membership", cost: 80000 },
];

function BankruptScreen({
  stats,
  run,
  onRestart,
  t,
  locale,
}: {
  stats: Stats;
  run: LastRun;
  onRestart: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [copied, setCopied] = useState(false);
  const lost = run.startingMoney;
  const alt = useMemo(
    () =>
      ALTERNATIVES.map((a) => ({ ...a, count: Math.floor(lost / a.cost) }))
        .filter((a) => a.count > 0)
        .slice(0, 5),
    [lost],
  );

  const share = useCallback(async () => {
    const text = t(
      `도박 시뮬레이터에서 ${formatWon(run.startingMoney, locale)}을 ${elapsed(run.durationMs, locale)}만에 잃었습니다.\n이것이 도박의 현실입니다.\n→ nolza.fun/games/gambling`,
      `Lost ${formatWon(run.startingMoney, locale)} in ${elapsed(run.durationMs, locale)} on the gambling simulator.\nThis is what gambling looks like.\n→ nolza.fun/games/gambling`,
    );
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [run, locale, t]);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        background:
          "radial-gradient(ellipse at top, rgba(0,0,0,0.4), transparent 60%), #0a0a0a",
        padding: "60px 20px 80px",
        animation: "gambleFadeIn 1s ease",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Dealer line */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            fontFamily: SERIF,
            fontSize: 22,
            color: "rgba(255,255,255,0.65)",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {t("\"오늘 밤은 여기까지인 것 같네요.\"", "\"That's the end of the night.\"")}
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              fontStyle: "normal",
              letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.35)",
              fontFamily: INTER,
              fontWeight: 700,
            }}
          >
            — DEALER
          </div>
        </div>

        {/* Section: tonight's record */}
        <Section title={t("오늘 밤의 기록", "TONIGHT'S RECORD")}>
          <RecordRow label={t("시작 금액", "Started with")} value={formatWon(run.startingMoney, locale)} />
          <RecordRow label={t("최종 잔액", "Ended with")} value="0" />
          <RecordRow
            label={t("잃은 금액", "Lost")}
            value={formatWon(run.startingMoney, locale)}
            danger
          />
          <RecordRow label={t("총 게임 횟수", "Total rounds")} value={`${stats.totalGames}`} />
          <RecordRow label={t("소요 시간", "Time")} value={elapsed(run.durationMs, locale)} />
        </Section>

        {/* Section: what this money could buy */}
        <Section title={t("이 돈으로 할 수 있었던 것들", "WHAT THIS MONEY COULD BUY")}>
          {alt.map((a) => (
            <div
              key={a.en}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 0",
                fontFamily: locale === "ko" ? KSANS : INTER,
                fontSize: 15,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span style={{ fontSize: 24 }}>{a.emoji}</span>
              <span>
                {locale === "ko"
                  ? `${a.ko} ${a.count}${a.count > 1 ? "개/판" : ""}`
                  : `${a.count} ${a.en}`}
              </span>
            </div>
          ))}
        </Section>

        {/* Section: what you experienced */}
        <Section title={t("당신이 경험한 것들", "WHAT YOU EXPERIENCED")}>
          <ExperienceRow
            ko={"\"한 번만 더\""}
            en={'"Just one more"'}
            count={stats.oneMoreClicks}
            locale={locale}
          />
          <ExperienceRow
            ko={"\"이번엔 될 것 같은데\""}
            en={'"This time will be different"'}
            count={stats.thinkItllWorkPrompts}
            locale={locale}
          />
          <ExperienceRow
            ko={"\"본전만 찾자\""}
            en={'"Just break even"'}
            count={stats.breakEvenPrompts}
            locale={locale}
          />
          <ExperienceRow
            ko={"\"충전하기\" 시도"}
            en={'"Recharge" attempts'}
            count={stats.rechargeAttempts}
            locale={locale}
          />
          <div
            style={{
              marginTop: 18,
              padding: "16px 18px",
              borderRadius: 12,
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.3)",
              color: "#fca5a5",
              fontFamily: locale === "ko" ? KSANS : INTER,
              fontSize: 16,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            {t(
              "이것이 도박 중독의 시작입니다.",
              "This is how gambling addiction begins.",
            )}
          </div>
        </Section>

        {/* Section: real-world stats */}
        <Section title={t("실제 통계 (한국)", "REAL-WORLD STATISTICS (KOREA)")}>
          <StatRow ko="한국 도박 중독자" en="Koreans with gambling addiction" value="약 220만명" valueEn="~2.2 million" locale={locale} />
          <StatRow ko="평균 도박 빚" en="Average gambling debt" value="4,700만원" valueEn="₩47 million" locale={locale} />
          <StatRow ko="도박 중독 회복률" en="Recovery rate" value="30%" valueEn="30%" locale={locale} />
        </Section>

        {/* Helpline */}
        <div
          style={{
            margin: "32px 0 28px",
            padding: "20px 22px",
            border: `1.5px solid ${GOLD}66`,
            borderRadius: 16,
            background: "rgba(255,215,0,0.04)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.3em",
              color: GOLD,
              fontWeight: 700,
              marginBottom: 10,
              fontFamily: INTER,
            }}
          >
            {t("도움이 필요하다면", "IF YOU NEED HELP")}
          </div>
          <div
            style={{
              fontFamily: locale === "ko" ? KSANS : INTER,
              fontSize: 16,
              color: "#f5f5f5",
              marginBottom: 4,
            }}
          >
            {t("한국도박문제예방치유원", "Korea Center on Gambling Problems")}
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 22,
              color: GOLD,
              fontWeight: 800,
              letterSpacing: "0.05em",
            }}
          >
            ☎ 1336
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              marginTop: 4,
              fontFamily: locale === "ko" ? KSANS : INTER,
            }}
          >
            {t("24시간 무료 상담", "24-hour confidential helpline")}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={share} className="gamble-btn ghost">
            {copied ? t("복사됨 ✓", "Copied ✓") : t("공유하기", "Share")}
          </button>
          <button onClick={onRestart} className="gamble-btn">
            {t("한 번만 더?", "One more time?")}
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 13,
            color: "rgba(255,255,255,0.3)",
            fontFamily: locale === "ko" ? KSANS : INTER,
          }}
        >
          {t(
            "(도박 중독자가 가장 많이 하는 말입니다.)",
            "(The exact phrase gambling addicts say most.)",
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): ReactElement {
  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: GOLD,
          fontWeight: 700,
          marginBottom: 14,
          paddingBottom: 8,
          borderBottom: `1px solid ${GOLD}33`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function RecordRow({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>{label}</span>
      <span
        style={{
          fontFamily: INTER,
          fontSize: 16,
          fontWeight: 700,
          color: danger ? "#ef4444" : "#f5f5f5",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ExperienceRow({
  ko,
  en,
  count,
  locale,
}: {
  ko: string;
  en: string;
  count: number;
  locale: "ko" | "en";
}): ReactElement {
  if (count === 0) return <></>;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontFamily: locale === "ko" ? KSANS : INTER }}>
        ❌ {locale === "ko" ? ko : en}
      </span>
      <span
        style={{
          fontFamily: INTER,
          fontSize: 16,
          fontWeight: 700,
          color: GOLD,
        }}
      >
        × {count}
      </span>
    </div>
  );
}

function StatRow({
  ko,
  en,
  value,
  valueEn,
  locale,
}: {
  ko: string;
  en: string;
  value: string;
  valueEn: string;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, fontFamily: locale === "ko" ? KSANS : INTER }}>
        {locale === "ko" ? ko : en}
      </span>
      <span
        style={{
          fontFamily: INTER,
          fontSize: 16,
          fontWeight: 700,
          color: "#f5f5f5",
        }}
      >
        {locale === "ko" ? value : valueEn}
      </span>
    </div>
  );
}

// ============================================================================
// Left-early screen — quiet validation
// ============================================================================

function LeftEarlyScreen({
  run,
  onHome,
  t,
  locale,
}: {
  run: LastRun;
  onHome: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const lostAmount = run.startingMoney - run.finalBalance;
  const saved = run.finalBalance;
  const alt = useMemo(
    () =>
      ALTERNATIVES.map((a) => ({ ...a, count: Math.floor(saved / a.cost) }))
        .filter((a) => a.count > 0)
        .slice(0, 4),
    [saved],
  );
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(28px, 5vw, 44px)",
          color: GOLD,
          fontWeight: 700,
          marginBottom: 20,
          textShadow: `0 0 24px ${GOLD}55`,
        }}
      >
        {t("현명한 선택이에요.", "Wise choice.")}
      </div>
      <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 420, lineHeight: 1.7, fontSize: 15 }}>
        {t(
          `${formatWon(saved, locale)}을 지켰습니다. 잃은 ${formatWon(lostAmount, locale)}은 수업료라고 생각하세요.`,
          `You preserved ${formatWon(saved, locale)}. The ${formatWon(lostAmount, locale)} you lost — call it tuition.`,
        )}
      </p>

      {alt.length > 0 && (
        <div
          className="gamble-card"
          style={{
            marginTop: 32,
            padding: "20px 22px",
            maxWidth: 420,
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.3em",
              color: GOLD,
              fontWeight: 700,
              marginBottom: 12,
              fontFamily: INTER,
            }}
          >
            {t("이 돈을 지켰습니다 ✓", "WHAT YOU SAVED ✓")}
          </div>
          {alt.map((a) => (
            <div
              key={a.en}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                fontFamily: locale === "ko" ? KSANS : INTER,
                fontSize: 16,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span style={{ fontSize: 22 }}>{a.emoji}</span>
              <span>
                {locale === "ko"
                  ? `${a.ko} ${a.count}${a.count > 1 ? "개/판" : ""}`
                  : `${a.count} ${a.en}`}
              </span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onHome} className="gamble-btn ghost" style={{ marginTop: 32 }}>
        {t("처음으로", "Back to start")}
      </button>
    </div>
  );
}

// ============================================================================
// Manipulation popups
// ============================================================================

function OneMoreDialog({
  bankroll,
  startingMoney,
  onContinue,
  onStop,
  t,
  locale,
}: {
  bankroll: number;
  startingMoney: number;
  onContinue: () => void;
  onStop: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <Modal>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 22,
          color: "#f5f5f5",
          marginBottom: 8,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {t("거의 다 왔어요!", "You're so close!")}
      </div>
      <p style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", fontSize: 16, lineHeight: 1.6, fontFamily: locale === "ko" ? KSANS : INTER }}>
        {t(
          `잔액이 ${formatWon(bankroll, locale)}밖에 안 남았어요. 한 번만 더 해보면 본전을 찾을 수 있을지도 몰라요.`,
          `You only have ${formatWon(bankroll, locale)} left. One more spin and you might break even.`,
        )}
      </p>
      <div
        style={{
          marginTop: 14,
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          letterSpacing: "0.05em",
          fontFamily: locale === "ko" ? KSANS : INTER,
        }}
      >
        {t(
          `(시작했을 땐 ${formatWon(startingMoney, locale)}이었어요.)`,
          `(You started with ${formatWon(startingMoney, locale)}.)`,
        )}
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onStop} className="gamble-btn ghost">
          {t("그만하기", "Stop")}
        </button>
        <button onClick={onContinue} className="gamble-btn">
          {t("한 번만 더", "One more")}
        </button>
      </div>
    </Modal>
  );
}

function RechargeDialog({
  onAccept,
  onCancel,
  t,
  locale,
}: {
  onAccept: () => void;
  onCancel: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <Modal>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 22,
          color: GOLD,
          marginBottom: 8,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        💳 {t("충전이 필요하신가요?", "Need to recharge?")}
      </div>
      <p style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", fontSize: 16, lineHeight: 1.6, fontFamily: locale === "ko" ? KSANS : INTER }}>
        {t(
          "잔액이 절반 이상 줄었어요. 다시 채우고 본전을 노려볼까요?",
          "You've lost more than half. Top up and try to win it back?",
        )}
      </p>
      <div
        style={{
          marginTop: 14,
          padding: "12px 14px",
          background: "rgba(220,38,38,0.1)",
          border: "1px solid rgba(220,38,38,0.3)",
          borderRadius: 8,
          fontSize: 14,
          color: "#fca5a5",
          textAlign: "center",
          fontFamily: locale === "ko" ? KSANS : INTER,
          lineHeight: 1.6,
        }}
      >
        {t(
          "⚠️ 잠깐 — 실제 카지노에선 이 순간이 가장 위험합니다. 현명한 선택을 해주세요.",
          "⚠️ Wait — in a real casino this is the most dangerous moment. Choose wisely.",
        )}
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onCancel} className="gamble-btn ghost">
          {t("괜찮아요", "I'm good")}
        </button>
        <button onClick={onAccept} className="gamble-btn">
          {t("계속하기", "Keep playing")}
        </button>
      </div>
    </Modal>
  );
}

function ExitDialog({
  bankroll,
  startingMoney,
  onConfirm,
  onCancel,
  t,
  locale,
}: {
  bankroll: number;
  startingMoney: number;
  onConfirm: () => void;
  onCancel: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const lost = startingMoney - bankroll;
  return (
    <Modal>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 20,
          color: "#f5f5f5",
          marginBottom: 6,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {t("정말 나가실 건가요?", "Leave the table?")}
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.65)",
          textAlign: "center",
          fontSize: 15,
          lineHeight: 1.7,
          fontFamily: locale === "ko" ? KSANS : INTER,
          margin: "10px 0",
        }}
      >
        {t(
          `잔액: ${formatWon(bankroll, locale)} · 잃은 금액: ${formatWon(lost, locale)}`,
          `Balance: ${formatWon(bankroll, locale)} · Lost: ${formatWon(lost, locale)}`,
        )}
      </p>
      <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onCancel} className="gamble-btn ghost">
          {t("계속하기", "Keep playing")}
        </button>
        <button onClick={onConfirm} className="gamble-btn">
          {t("나가기", "Cash out")}
        </button>
      </div>
    </Modal>
  );
}

// ============================================================================
// Education popups
// ============================================================================

const EDUCATION: Array<{ ko: string; en: string }> = [
  {
    ko: "슬롯머신은 당신이 '거의 당첨됐다'고 느끼도록 설계됐습니다. 실제로는 완전히 다른 결과예요.",
    en: "Slots are designed so you feel you 'almost won'. The result is actually a complete miss.",
  },
  {
    ko: "카지노에는 창문도 시계도 없습니다. 당신이 시간 감각을 잃게 만들기 위해서요.",
    en: "Casinos have no windows or clocks — to disorient your sense of time.",
  },
  {
    ko: "당첨 효과음은 실제 보상보다 훨씬 크게 설계됩니다. 잃는 소리는 거의 들리지 않게요.",
    en: "Winning sounds are deliberately louder than the real payout. Losing sounds are nearly silent.",
  },
  {
    ko: "'거의 다 맞췄다'는 느낌은 당첨된 것과 같은 도파민을 분비시킵니다. 진짜로요.",
    en: "A 'near miss' triggers the same dopamine as a win. Literally.",
  },
  {
    ko: "확률은 기억이 없습니다. '이번엔 될 것 같다'는 직감은 항상 틀려요.",
    en: "Probability has no memory. 'I'm due for a win' is always a fallacy.",
  },
];

function EducationPopup({
  idx,
  onClose,
  t,
  locale,
}: {
  idx: number;
  onClose: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const item = EDUCATION[idx];
  return (
    <Modal>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 13,
          letterSpacing: "0.3em",
          color: GOLD,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        💡 {t("알고 계셨나요?", "DID YOU KNOW?")}
      </div>
      <p
        style={{
          color: "#f5f5f5",
          textAlign: "center",
          fontSize: 16,
          lineHeight: 1.7,
          fontFamily: locale === "ko" ? KSANS : INTER,
          margin: 0,
        }}
      >
        {locale === "ko" ? item.ko : item.en}
      </p>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
        <button onClick={onClose} className="gamble-btn ghost">
          {t("계속하기", "Continue")}
        </button>
      </div>
    </Modal>
  );
}

// ============================================================================
// Modal shell
// ============================================================================

function Modal({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "gambleFadeIn 0.25s ease",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #1a1a1a, #0d0d0d)",
          border: `1.5px solid ${GOLD}55`,
          borderRadius: 16,
          padding: "28px 26px",
          maxWidth: 460,
          width: "100%",
          boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 30px ${GOLD}22`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Manipulation ticker (toast-like)
// ============================================================================

function Ticker({ text }: { text: string }): ReactElement {
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        top: 80,
        zIndex: 25,
        background: "rgba(220,38,38,0.15)",
        border: "1px solid rgba(220,38,38,0.4)",
        padding: "12px 18px",
        borderRadius: 10,
        color: "#fca5a5",
        fontSize: 15,
        fontFamily: KSANS,
        animation: "gambleSlide 3.5s ease forwards",
        backdropFilter: "blur(6px)",
        maxWidth: 280,
        lineHeight: 1.5,
      }}
    >
      {text}
    </div>
  );
}

// ============================================================================
// Bottom disclaimer
// ============================================================================

function Disclaimer({ t }: { t: (ko: string, en: string) => string }): ReactElement {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 9,
        color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.05em",
        zIndex: 4,
        pointerEvents: "none",
        padding: "0 20px",
      }}
    >
      {t(
        "이 게임은 교육 목적의 시뮬레이션입니다. 실제 도박을 조장하지 않습니다.",
        "Educational simulation only. Does not promote actual gambling.",
      )}
    </div>
  );
}

