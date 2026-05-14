"use client";

import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { AdBottom } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Loc = "ko" | "en";
type Phase = "intro" | "bankroll" | "select" | "play" | "result";
type ModeId = "slot" | "blackjack" | "roulette" | "oddEven" | "ladder";
type RouletteBet = "red" | "black" | "odd" | "even" | "number";
type OddEvenPick = "odd" | "even";
type LadderPick = "left" | "center" | "right";
type LadderStatus = "idle" | "running" | "revealed";

type LadderBridge = {
  y: number;
  from: 0 | 1;
};

type LadderPoint = {
  x: number;
  y: number;
};

type LadderPlan = {
  id: number;
  selected: LadderPick;
  final: LadderPick;
  bridges: LadderBridge[];
  route: LadderPoint[];
  event: RoundEvent;
  nearMiss: boolean;
};

type LadderRun = {
  status: LadderStatus;
  plan: LadderPlan | null;
};

type BankrollOption = {
  amount: number;
  ko: string;
  en: string;
  hintKo: string;
  hintEn: string;
};

type ModeInfo = {
  id: ModeId;
  icon: string;
  ko: string;
  en: string;
  hookKo: string;
  hookEn: string;
  rulesKo: string;
  rulesEn: string;
  trapKo: string;
  trapEn: string;
  revealKo: string;
  revealEn: string;
};

type RoundEvent = {
  mode: ModeId;
  bet: number;
  delta: number;
  label: string;
  note: string;
  nearMiss?: boolean;
  trap?: string;
  ladderPick?: LadderPick;
  ladderFinal?: LadderPick;
};

type Stats = {
  startingChips: number;
  startedAt: number;
  rounds: number;
  totalBet: number;
  wins: number;
  losses: number;
  biggestWin: number;
  biggestLoss: number;
  consecutiveLosses: number;
  maxConsecutiveLosses: number;
  nearMisses: number;
  repeatedSameLadderPath: number;
  switchedLadderPathAfterLoss: number;
  oneMoreMoments: number;
  increasedAfterLoss: number;
  modeRounds: Record<ModeId, number>;
};

type BlackjackState = {
  active: boolean;
  player: number[];
  dealer: number[];
  stood: boolean;
};

const BG = "#090909";
const PANEL = "rgba(255,255,255,0.055)";
const PANEL_STRONG = "rgba(255,255,255,0.085)";
const INK = "#f7f7f2";
const MUTED = "rgba(247,247,242,0.62)";
const FAINT = "rgba(247,247,242,0.42)";
const LINE = "rgba(255,255,255,0.12)";
const WARNING = "#f5b84b";
const RED = "#f05252";
const GREEN = "#64d39a";
const SANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";

const BET_OPTIONS = [10_000, 30_000, 50_000, 100_000, 300_000, 500_000];

const BANKROLL_OPTIONS: BankrollOption[] = [
  { amount: 300_000, ko: "300,000칩", en: "300,000 chips", hintKo: "가볍게 체험", hintEn: "Light demo" },
  { amount: 1_000_000, ko: "1,000,000칩", en: "1,000,000 chips", hintKo: "월급 일부", hintEn: "Part of a paycheck" },
  { amount: 5_000_000, ko: "5,000,000칩", en: "5,000,000 chips", hintKo: "위험한 시작", hintEn: "Risky start" },
  { amount: 10_000_000, ko: "10,000,000칩", en: "10,000,000 chips", hintKo: "인생 흔들림 모드", hintEn: "Life-shaking mode" },
];

const MODES: ModeInfo[] = [
  {
    id: "slot",
    icon: "S",
    ko: "슬롯머신",
    en: "Slot Machine",
    hookKo: "한 번에 크게 터질 수도 있다는 착각을 만드는 게임",
    hookEn: "A fast loop that makes a big hit feel just around the corner",
    rulesKo:
      "버튼을 누르면 무작위 결과가 나옵니다. 가끔 작은 보상이 나오고, 큰 보상은 매우 드뭅니다. 하지만 아깝게 실패한 것처럼 보이는 결과가 다시 누르게 만듭니다.",
    rulesEn:
      "Press once and a random result appears. Small rewards show up sometimes, big rewards are rare, and near-misses make another press feel reasonable.",
    trapKo: "변동 보상, 니어미스, 작은 승리",
    trapEn: "Variable reward, near-miss, small wins",
    revealKo: "대부분의 회차는 기대값이 음수입니다. 작은 승리가 손실을 가려 반복을 부릅니다.",
    revealEn: "Most rounds have negative expected value. Small wins hide the larger loss pattern.",
  },
  {
    id: "blackjack",
    icon: "21",
    ko: "블랙잭",
    en: "Blackjack",
    hookKo: "실력으로 이길 수 있을 것 같은 느낌을 주는 카드 게임",
    hookEn: "A card game that makes control feel stronger than it is",
    rulesKo:
      "카드를 뽑아 21에 가까워지면 이기는 게임입니다. 히트/스탠드를 고를 수 있어 통제감이 생기지만 운과 구조의 영향을 크게 받습니다.",
    rulesEn:
      "Draw cards and try to get close to 21. Hit or stand creates a feeling of control, but luck and structure still dominate.",
    trapKo: "통제의 착각, 실력 과신",
    trapEn: "Illusion of control, overconfidence",
    revealKo: "선택지가 있어도 장기적으로는 불리한 구조가 남습니다. 통제감이 반복을 합리화합니다.",
    revealEn: "Choices do not remove the long-run disadvantage. Control can become a justification to continue.",
  },
  {
    id: "roulette",
    icon: "R",
    ko: "룰렛",
    en: "Roulette",
    hookKo: "숫자 하나에 운명을 걸게 만드는 회전판",
    hookEn: "A spinning wheel that turns waiting into suspense",
    rulesKo:
      "공이 어디에 멈출지 맞히는 게임입니다. 색, 홀짝, 숫자 중 하나를 고를 수 있지만 결과는 무작위이며 장기적으로는 구조적으로 불리합니다.",
    rulesEn:
      "Guess where the ball lands. You can choose color, odd/even, or a number, but the result is random and structurally unfavorable over time.",
    trapKo: "시각적 긴장감, 안전해 보이는 선택",
    trapEn: "Visual suspense, safer-looking choices",
    revealKo: "색이나 홀짝은 안전해 보이지만 0 때문에 기대값은 계속 깎입니다.",
    revealEn: "Color and odd/even feel safer, but the zero keeps the expectation negative.",
  },
  {
    id: "oddEven",
    icon: "OE",
    ko: "홀짝",
    en: "Odd-Even",
    hookKo: "가장 단순하지만 가장 빠르게 반복하게 되는 선택 게임",
    hookEn: "A simple choice that becomes dangerously repeatable",
    rulesKo:
      "결과가 홀수인지 짝수인지 맞힙니다. 너무 단순해서 이번엔 맞겠지라는 생각으로 빠르게 반복하기 쉽습니다.",
    rulesEn:
      "Pick odd or even. Because it feels so simple, it is easy to repeat while thinking the next one should hit.",
    trapKo: "빠른 반복, 도박사의 오류",
    trapEn: "Fast repetition, gambler's fallacy",
    revealKo: "단순한 50대50처럼 보여도 수수료 역할의 빈 결과가 끼면 장기적으로 불리합니다.",
    revealEn: "It looks like 50/50, but a fee-like blank outcome makes the long run unfavorable.",
  },
  {
    id: "ladder",
    icon: "L",
    ko: "사다리 선택",
    en: "Ladder Demo",
    hookKo: "직접 고른 길이라 결과도 통제한 것처럼 느끼게 만드는 확률 데모",
    hookEn: "A fictional path-picking demo that makes randomness feel personal",
    rulesKo:
      "왼쪽, 가운데, 오른쪽 길 중 하나를 고릅니다. 화면은 선택한 느낌을 주지만 결과는 미리 정해진 확률 데모입니다.",
    rulesEn:
      "Pick left, center, or right. The path feels personal, but this is a fictional probability demo.",
    trapKo: "선택의 착각, 패턴 찾기",
    trapEn: "Choice illusion, pattern seeking",
    revealKo: "선택지가 많아 보이면 사람은 패턴을 찾지만, 무작위 구조는 마음을 봐주지 않습니다.",
    revealEn: "More choices make people search for patterns, but randomness does not respond to intention.",
  },
];

function emptyStats(startingChips: number): Stats {
  return {
    startingChips,
    startedAt: Date.now(),
    rounds: 0,
    totalBet: 0,
    wins: 0,
    losses: 0,
    biggestWin: 0,
    biggestLoss: 0,
    consecutiveLosses: 0,
    maxConsecutiveLosses: 0,
    nearMisses: 0,
    repeatedSameLadderPath: 0,
    switchedLadderPathAfterLoss: 0,
    oneMoreMoments: 0,
    increasedAfterLoss: 0,
    modeRounds: { slot: 0, blackjack: 0, roulette: 0, oddEven: 0, ladder: 0 },
  };
}

function formatChips(value: number, loc: Loc): string {
  const rounded = Math.round(value);
  return loc === "ko" ? `${rounded.toLocaleString("ko-KR")}칩` : `${rounded.toLocaleString("en-US")} chips`;
}


function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function clampBet(value: number, bankroll: number): number {
  return Math.max(10_000, Math.min(value, Math.max(10_000, bankroll)));
}

function cardValue(): number {
  return pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11]);
}

function handTotal(cards: number[]): number {
  let total = cards.reduce((sum, card) => sum + card, 0);
  let aces = cards.filter((card) => card === 11).length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function modeById(id: ModeId): ModeInfo {
  return MODES.find((mode) => mode.id === id) ?? MODES[0];
}

const LADDER_PICKS: LadderPick[] = ["left", "center", "right"];
const LADDER_X = [16, 50, 84];

function ladderPickLabel(pickValue: LadderPick, loc: Loc): string {
  if (loc === "en") {
    return pickValue === "left" ? "Left" : pickValue === "center" ? "Center" : "Right";
  }
  return pickValue === "left" ? "왼쪽" : pickValue === "center" ? "가운데" : "오른쪽";
}

function ladderPickIndex(pickValue: LadderPick): 0 | 1 | 2 {
  return pickValue === "left" ? 0 : pickValue === "center" ? 1 : 2;
}

function ladderPickFromIndex(index: number): LadderPick {
  return LADDER_PICKS[Math.max(0, Math.min(2, index))];
}

function traverseLadder(start: LadderPick, bridges: LadderBridge[]): { final: LadderPick; route: LadderPoint[] } {
  let column = ladderPickIndex(start);
  const route: LadderPoint[] = [{ x: LADDER_X[column], y: 3 }];
  const sorted = [...bridges].sort((a, b) => a.y - b.y);

  for (const bridge of sorted) {
    const nextColumn =
      bridge.from === column ? column + 1 : bridge.from + 1 === column ? column - 1 : column;
    if (nextColumn === column) continue;

    route.push({ x: LADDER_X[column], y: bridge.y });
    column = nextColumn as 0 | 1 | 2;
    route.push({ x: LADDER_X[column], y: bridge.y });
  }

  route.push({ x: LADDER_X[column], y: 96 });
  return { final: ladderPickFromIndex(column), route };
}

function createLadderBridges(): LadderBridge[] {
  const bridgeCount = 7 + Math.floor(Math.random() * 2);
  const bridges: LadderBridge[] = [];
  let y = 15;

  for (let i = 0; i < bridgeCount; i += 1) {
    const previous = bridges[bridges.length - 1];
    const from = (previous?.from === 0 ? 1 : Math.random() < 0.5 ? 0 : 1) as 0 | 1;
    bridges.push({ from, y });
    y += 9 + Math.floor(Math.random() * 4);
  }

  return bridges;
}

function createLadderPlan({
  loc,
  t,
  selected,
  bet,
}: {
  loc: Loc;
  t: (ko: string, en: string) => string;
  selected: LadderPick;
  bet: number;
}): LadderPlan {
  const shouldWin = Math.random() < 0.28;
  const possibleFinals = shouldWin ? [selected] : LADDER_PICKS.filter((pickValue) => pickValue !== selected);
  const final = pick(possibleFinals);
  let bridges = createLadderBridges();
  let traversed = traverseLadder(selected, bridges);

  for (let attempt = 0; attempt < 250 && traversed.final !== final; attempt += 1) {
    bridges = createLadderBridges();
    traversed = traverseLadder(selected, bridges);
  }

  const win = traversed.final === selected;
  const selectedIndex = ladderPickIndex(selected);
  const finalIndex = ladderPickIndex(traversed.final);
  const nearMiss = !win && Math.abs(selectedIndex - finalIndex) === 1;
  const delta = win ? Math.round(bet * 1.55) : -bet;
  const selectedLabel = ladderPickLabel(selected, loc);
  const finalLabel = ladderPickLabel(traversed.final, loc);

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    selected,
    final: traversed.final,
    bridges,
    route: traversed.route,
    nearMiss,
    event: {
      mode: "ladder",
      bet,
      delta,
      label: t(`선택 ${selectedLabel} → 도착 ${finalLabel}`, `Picked ${selectedLabel} → arrived ${finalLabel}`),
      note: win
        ? t(
            "이번엔 맞았습니다. 작은 승리는 다음 판을 누르게 만드는 가장 강한 장치입니다.",
            "This one hit. A small win is one of the strongest reasons to press again.",
          )
        : nearMiss
          ? t(
              "거의 맞을 뻔한 것처럼 보였지만, 결과는 실패입니다. 이런 ‘아까움’이 다시 하게 만드는 핵심 장치입니다.",
              "It looked almost right, but the result is still a loss. That feeling of almost getting it is a key replay trigger.",
            )
          : t(
              "도착지는 이미 확률이 정한 곳이지만, 움직이는 사다리는 내가 뭔가 선택한 것처럼 느끼게 만듭니다.",
              "The destination was already set by probability, but the moving ladder makes the choice feel personal.",
            ),
      nearMiss,
      trap: "pattern-seeking",
      ladderPick: selected,
      ladderFinal: traversed.final,
    },
  };
}

function psychologyType(stats: Stats, balance: number): { title: string; summary: string; memory: string; mantra: string } {
  const net = balance - stats.startingChips;
  if (stats.rounds <= 4 && balance >= stats.startingChips * 0.8) {
    return {
      title: "위험 감지 빠른 생존형",
      summary: "초반에 멈추는 감각이 살아 있습니다. 손실을 회복해야 한다는 압박이 커지기 전에 발을 빼는 쪽에 가깝습니다.",
      memory: "가장 중요한 순간은 계속할 수 있었는데도 멈출 수 있었던 순간입니다.",
      mantra: "멈추는 것은 패배가 아니라 위험을 끊는 행동입니다.",
    };
  }
  if (stats.increasedAfterLoss >= 2 || stats.oneMoreMoments >= 2) {
    return {
      title: "손실 추격형",
      summary: "처음에는 가볍게 시작했지만 잃은 칩을 회복하려는 순간부터 판단이 흔들리기 시작했습니다.",
      memory: "가장 위험했던 순간은 큰 손실 직후 판돈을 올린 순간입니다.",
      mantra: "손실을 인정하기 싫은 마음은 계산처럼 느껴질 수 있습니다.",
    };
  }
  if (stats.nearMisses >= 3) {
    return {
      title: "거의 이겼다고 믿는 타입",
      summary: "실패였지만 아깝게 보이는 장면에 오래 붙잡혔습니다. 니어미스는 실제 승리에 가까워진 증거가 아닙니다.",
      memory: "가장 흔들린 순간은 실패인데도 다음 판의 근거처럼 느껴진 장면입니다.",
      mantra: "아까운 실패는 다음 성공의 예고편이 아닙니다.",
    };
  }
  if (stats.biggestWin > stats.biggestLoss && net < 0) {
    return {
      title: "작은 승리에 묶이는 타입",
      summary: "중간중간 나온 승리가 전체 손실을 흐리게 만들었습니다. 기억은 이긴 장면을 크게 저장합니다.",
      memory: "가장 흔들린 순간은 작은 승리가 다시 플레이할 이유가 된 순간입니다.",
      mantra: "이긴 기억보다 전체 잔액이 더 정직합니다.",
    };
  }
  if (stats.modeRounds.blackjack >= Math.max(3, stats.rounds / 2)) {
    return {
      title: "근거 없는 자신감형",
      summary: "선택지가 있는 게임에서 통제감을 강하게 느꼈습니다. 선택할 수 있다는 사실이 이길 수 있다는 뜻은 아닙니다.",
      memory: "가장 흔들린 순간은 '내 판단이면 괜찮다'고 느낀 순간입니다.",
      mantra: "통제감은 확률을 바꾸지 못합니다.",
    };
  }
  return {
    title: "멈출 타이밍을 놓치는 타입",
    summary: "한두 판만 더 보려는 마음이 회차를 늘렸습니다. 반복이 빠를수록 판단은 감정에 가까워집니다.",
    memory: "가장 흔들린 순간은 그만둘 이유를 알면서도 한 번 더 누른 순간입니다.",
    mantra: "한 번 더는 계획이 아니라 구조가 심어둔 문장일 수 있습니다.",
  };
}

function strongestTrap(stats: Stats): string {
  if (stats.increasedAfterLoss >= 2) return "손실 추격과 매몰비용";
  if (stats.nearMisses >= 3) return "니어미스 효과";
  if (stats.modeRounds.blackjack >= Math.max(3, stats.rounds / 2)) return "통제의 착각";
  if (stats.maxConsecutiveLosses >= 4) return "도박사의 오류";
  return "변동 보상과 작은 승리";
}

export default function GamblingPage(): ReactElement {
  const { locale } = useLocale();
  const loc: Loc = locale === "en" ? "en" : "ko";
  const t = useCallback((ko: string, en: string) => (loc === "ko" ? ko : en), [loc]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [bankroll, setBankroll] = useState(0);
  const [balance, setBalance] = useState(0);
  const [mode, setMode] = useState<ModeId>("slot");
  const [bet, setBet] = useState(30_000);
  const [customBankroll, setCustomBankroll] = useState("2000000");
  const [stats, setStats] = useState<Stats>(() => emptyStats(0));
  const [history, setHistory] = useState<RoundEvent[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedRules, setExpandedRules] = useState<ModeId | null>(null);
  const [rouletteBet, setRouletteBet] = useState<RouletteBet>("red");
  const [oddEvenPick, setOddEvenPick] = useState<OddEvenPick>("odd");
  const [ladderPick, setLadderPick] = useState<LadderPick>("center");
  const [ladderRun, setLadderRun] = useState<LadderRun>({ status: "idle", plan: null });
  const [blackjack, setBlackjack] = useState<BlackjackState>({ active: false, player: [], dealer: [], stood: false });
  const [copied, setCopied] = useState(false);

  const activeMode = modeById(mode);
  const latest = history[0] ?? null;
  const resultType = useMemo(() => psychologyType(stats, balance), [stats, balance]);
  const currentBet = Math.min(bet, Math.max(0, balance));
  const canPlay = phase === "play" && ladderRun.status !== "running" && balance >= 10_000 && currentBet >= 10_000;

  const startWithBankroll = useCallback((amount: number) => {
    const safeAmount = Math.max(100_000, Math.min(10_000_000, Math.round(amount)));
    setBankroll(safeAmount);
    setBalance(safeAmount);
    setStats(emptyStats(safeAmount));
    setHistory([]);
    setMessage(null);
    setBet(safeAmount >= 1_000_000 ? 50_000 : 30_000);
    setCopied(false);
    setBlackjack({ active: false, player: [], dealer: [], stood: false });
    setLadderRun({ status: "idle", plan: null });
    setPhase("select");
  }, []);

  const updateBet = useCallback((amount: number) => {
    setBet(clampBet(amount, balance));
  }, [balance]);

  const settleRound = useCallback((event: RoundEvent) => {
    const nextBalance = Math.max(0, balance + event.delta);
    const last = history[0];
    const increasedAfterLoss = last && last.delta < 0 && event.bet > last.bet ? 1 : 0;
    const oneMore = last && last.delta < 0 ? 1 : 0;
    const repeatedSameLadderPath =
      event.mode === "ladder" && last?.mode === "ladder" && last.ladderPick === event.ladderPick ? 1 : 0;
    const switchedLadderPathAfterLoss =
      event.mode === "ladder" && last?.mode === "ladder" && last.delta < 0 && last.ladderPick !== event.ladderPick ? 1 : 0;

    setBalance(nextBalance);
    setStats((prev) => {
      const nextLosses = event.delta < 0 ? prev.consecutiveLosses + 1 : 0;
      return {
        ...prev,
        rounds: prev.rounds + 1,
        totalBet: prev.totalBet + event.bet,
        wins: event.delta > 0 ? prev.wins + 1 : prev.wins,
        losses: event.delta < 0 ? prev.losses + 1 : prev.losses,
        biggestWin: Math.max(prev.biggestWin, event.delta),
        biggestLoss: Math.max(prev.biggestLoss, Math.abs(Math.min(0, event.delta))),
        consecutiveLosses: nextLosses,
        maxConsecutiveLosses: Math.max(prev.maxConsecutiveLosses, nextLosses),
        nearMisses: prev.nearMisses + (event.nearMiss ? 1 : 0),
        repeatedSameLadderPath: prev.repeatedSameLadderPath + repeatedSameLadderPath,
        switchedLadderPathAfterLoss: prev.switchedLadderPathAfterLoss + switchedLadderPathAfterLoss,
        oneMoreMoments: prev.oneMoreMoments + oneMore,
        increasedAfterLoss: prev.increasedAfterLoss + increasedAfterLoss,
        modeRounds: {
          ...prev.modeRounds,
          [event.mode]: prev.modeRounds[event.mode] + 1,
        },
      };
    });
    setHistory((prev) => [event, ...prev].slice(0, 8));

    if (event.nearMiss) {
      setMessage(t("방금 결과는 거의 당첨처럼 보였지만 실제로는 실패입니다.", "That looked almost like a win, but it was still a loss."));
    } else if (increasedAfterLoss) {
      setMessage(t("연속 손실 후 판돈을 올리고 있습니다. 지금은 회복이 아니라 손실 추격에 가까워요.", "You increased the bet after a loss. This is closer to chasing than recovering."));
    } else if (event.delta > 0 && event.delta <= event.bet) {
      setMessage(t("작은 승리가 다시 플레이할 이유를 만들었습니다.", "A small win just created a reason to keep playing."));
    } else if (nextBalance <= bankroll * 0.35 && nextBalance > 0) {
      setMessage(t("멈추면 손실이 확정된다는 느낌이 들 수 있습니다.", "Stopping can feel like locking in the loss."));
    } else {
      setMessage(event.note);
    }

    if (nextBalance < 10_000) {
      setPhase("result");
    }
  }, [balance, bankroll, history, t]);

  const playSlot = useCallback(() => {
    if (!canPlay) return;
    const r = Math.random();
    const isNearMiss = r >= 0.56 && r < 0.74;
    let delta = -currentBet;
    let label = t("손실", "Loss");
    let note = t("화면은 요란했지만 잔액은 줄었습니다.", "The screen was loud, but the balance went down.");
    if (r < 0.035) {
      delta = currentBet * 8;
      label = t("큰 보상", "Large reward");
      note = t("드문 승리가 방금까지의 손실을 흐리게 만듭니다.", "A rare win can blur the losses before it.");
    } else if (r < 0.24) {
      delta = Math.round(currentBet * 0.6);
      label = t("작은 보상", "Small reward");
      note = t("작은 보상은 계속할 핑계가 되기 쉽습니다.", "A small reward easily becomes a reason to continue.");
    } else if (isNearMiss) {
      label = t("아까운 실패", "Near miss");
      note = t("거의 된 것처럼 보이지만 확률이 좋아진 것은 아닙니다.", "It felt close, but the odds did not improve.");
    }
    settleRound({ mode: "slot", bet: currentBet, delta, label, note, nearMiss: isNearMiss, trap: "near-miss" });
  }, [canPlay, currentBet, settleRound, t]);

  const dealBlackjack = useCallback(() => {
    if (!canPlay) return;
    setBlackjack({ active: true, stood: false, player: [cardValue(), cardValue()], dealer: [cardValue(), cardValue()] });
    setMessage(t("선택지가 생기면 이길 수 있을 것 같은 느낌이 강해집니다.", "Choices can make winning feel more controllable."));
  }, [canPlay, t]);

  const hitBlackjack = useCallback(() => {
    if (!blackjack.active || blackjack.stood) return;
    const player = [...blackjack.player, cardValue()];
    const total = handTotal(player);
    setBlackjack((prev) => ({ ...prev, player }));
    if (total > 21) {
      settleRound({
        mode: "blackjack",
        bet: currentBet,
        delta: -currentBet,
        label: t("버스트", "Bust"),
        note: t("내가 선택했기 때문에 손실도 더 통제 가능했다고 느껴질 수 있습니다.", "Because you chose, the loss may feel more controllable than it was."),
        trap: "illusion-control",
      });
      setBlackjack({ active: false, player: [], dealer: [], stood: false });
    }
  }, [blackjack, currentBet, settleRound, t]);

  const standBlackjack = useCallback(() => {
    if (!blackjack.active) return;
    let dealer = [...blackjack.dealer];
    while (handTotal(dealer) < 17) dealer = [...dealer, cardValue()];
    const playerTotal = handTotal(blackjack.player);
    const dealerTotal = handTotal(dealer);
    let delta = -currentBet;
    let label = t("패배", "Loss");
    let note = t("좋은 판단처럼 느껴져도 결과는 구조와 운에 묶여 있습니다.", "Even a good-feeling decision is tied to structure and luck.");

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      delta = Math.round(currentBet * 0.9);
      label = t("승리", "Win");
      note = t("이길 때는 실력처럼 느껴지고, 질 때는 운처럼 느껴지기 쉽습니다.", "Wins tend to feel like skill; losses tend to feel like luck.");
    } else if (playerTotal === dealerTotal) {
      delta = 0;
      label = t("무승부", "Push");
      note = t("잃지 않았다는 느낌도 반복의 이유가 됩니다.", "Not losing can also become a reason to continue.");
    }

    settleRound({ mode: "blackjack", bet: currentBet, delta, label, note, nearMiss: Math.abs(playerTotal - dealerTotal) <= 1 && delta < 0, trap: "illusion-control" });
    setBlackjack({ active: false, player: [], dealer: [], stood: false });
  }, [blackjack, currentBet, settleRound, t]);

  const playRoulette = useCallback(() => {
    if (!canPlay) return;
    const number = Math.floor(Math.random() * 37);
    const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
    const isRed = redNumbers.has(number);
    const win =
      rouletteBet === "number"
        ? number === 7
        : rouletteBet === "red"
          ? isRed
          : rouletteBet === "black"
            ? number !== 0 && !isRed
            : rouletteBet === "odd"
              ? number !== 0 && number % 2 === 1
              : number !== 0 && number % 2 === 0;
    const payout = rouletteBet === "number" ? currentBet * 20 : Math.round(currentBet * 0.92);
    const delta = win ? payout : -currentBet;
    settleRound({
      mode: "roulette",
      bet: currentBet,
      delta,
      label: `${number} · ${win ? t("적중", "Hit") : t("실패", "Miss")}`,
      note: t("회전의 긴장감은 선택이 특별했다는 느낌을 만듭니다.", "The spin creates suspense around a random outcome."),
      nearMiss: !win && rouletteBet === "number" && Math.abs(number - 7) <= 2,
      trap: "suspense",
    });
  }, [canPlay, currentBet, rouletteBet, settleRound, t]);

  const playOddEven = useCallback(() => {
    if (!canPlay) return;
    const roll = Math.floor(Math.random() * 100);
    const houseBlank = roll < 4;
    const number = Math.floor(Math.random() * 99) + 1;
    const actual: OddEvenPick = number % 2 === 0 ? "even" : "odd";
    const win = !houseBlank && actual === oddEvenPick;
    const delta = win ? Math.round(currentBet * 0.86) : -currentBet;
    settleRound({
      mode: "oddEven",
      bet: currentBet,
      delta,
      label: `${number} · ${actual === "odd" ? t("홀", "Odd") : t("짝", "Even")}`,
      note: t("단순할수록 방금 결과에서 패턴을 찾기 쉽습니다.", "The simpler it is, the easier it is to find false patterns."),
      nearMiss: !win && !houseBlank,
      trap: "fast-repeat",
    });
  }, [canPlay, currentBet, oddEvenPick, settleRound, t]);

  const playLadder = useCallback(() => {
    if (!canPlay) return;
    const plan = createLadderPlan({ loc, t, selected: ladderPick, bet: currentBet });
    setMessage(t("띠리띠릭… 사다리가 내려가는 중입니다.", "Tick tick... the ladder is moving."));
    setLadderRun({ status: "running", plan });
  }, [canPlay, currentBet, ladderPick, loc, t]);

  const finishLadder = useCallback((plan: LadderPlan) => {
    setLadderRun({ status: "revealed", plan });
    settleRound(plan.event);
    if (navigator.vibrate) navigator.vibrate(plan.event.delta > 0 ? 35 : [20, 35, 20]);
  }, [settleRound]);

  const stopSession = useCallback(() => {
    setPhase("result");
  }, []);

  const chooseMode = useCallback((id: ModeId) => {
    setMode(id);
    setMessage(null);
    setBlackjack({ active: false, player: [], dealer: [], stood: false });
    setLadderRun({ status: "idle", plan: null });
    setPhase("play");
  }, []);

  const restart = useCallback(() => {
    setPhase("bankroll");
    setBalance(0);
    setBankroll(0);
    setStats(emptyStats(0));
    setHistory([]);
    setMessage(null);
    setCopied(false);
    setLadderRun({ status: "idle", plan: null });
  }, []);

  const share = useCallback(async () => {
    const text =
      loc === "ko"
        ? `도박 심리학 결과: ${resultType.title}. 시작 ${formatChips(stats.startingChips, loc)} → 최종 ${formatChips(balance, loc)}. 가장 큰 함정: ${strongestTrap(stats)}.`
        : `Gambling Psychology result: ${resultType.title}. Start ${formatChips(stats.startingChips, loc)} -> final ${formatChips(balance, loc)}. Biggest trap: ${strongestTrap(stats)}.`;
    const url = `${window.location.origin}/games/gambling`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t("도박 심리학 결과", "Gambling Psychology Result"), text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
      }
      setCopied(true);
    } catch {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  }, [balance, loc, resultType.title, stats, t]);

  return (
    <main className="gambling-root">
      <style>{styles}</style>
      <div className="gambling-bg" aria-hidden />
      <div className="gambling-shell">
        <header className="topline">
          <div>
            <div className="eyebrow">{t("교육용 확률 심리 시뮬레이션", "Educational probability psychology simulation")}</div>
            <h1>도박 심리학</h1>
          </div>
          <div className="safety-pill">{t("실제 도박 아님", "No real gambling")}</div>
        </header>

        {phase === "intro" && (
          <IntroScreen t={t} onStart={() => setPhase("bankroll")} />
        )}

        {phase === "bankroll" && (
          <BankrollScreen
            t={t}
            loc={loc}
            customBankroll={customBankroll}
            setCustomBankroll={setCustomBankroll}
            onStart={startWithBankroll}
          />
        )}

        {phase === "select" && (
          <GameSelectScreen
            t={t}
            loc={loc}
            expandedRules={expandedRules}
            setExpandedRules={setExpandedRules}
            onChoose={chooseMode}
            balance={balance}
            starting={bankroll}
            onStop={stopSession}
          />
        )}

        {phase === "play" && (
          <PlayScreen
            t={t}
            loc={loc}
            mode={activeMode}
            balance={balance}
            starting={bankroll}
            bet={currentBet}
            rawBet={bet}
            onBet={updateBet}
            canPlay={canPlay}
            message={message}
            latest={latest}
            stats={stats}
            history={history}
            rouletteBet={rouletteBet}
            setRouletteBet={setRouletteBet}
            oddEvenPick={oddEvenPick}
            setOddEvenPick={setOddEvenPick}
            ladderPick={ladderPick}
            setLadderPick={setLadderPick}
            ladderRun={ladderRun}
            blackjack={blackjack}
            onSlot={playSlot}
            onDealBlackjack={dealBlackjack}
            onHitBlackjack={hitBlackjack}
            onStandBlackjack={standBlackjack}
            onRoulette={playRoulette}
            onOddEven={playOddEven}
            onLadder={playLadder}
            onLadderFinish={finishLadder}
            onStop={stopSession}
            onChangeMode={() => setPhase("select")}
          />
        )}

        {phase === "result" && (
          <ResultScreen
            t={t}
            loc={loc}
            balance={balance}
            stats={stats}
            resultType={resultType}
            onReplay={restart}
            onShare={share}
            copied={copied}
          />
        )}
      </div>
    </main>
  );
}

function IntroScreen({ t, onStart }: { t: (ko: string, en: string) => string; onStart: () => void }): ReactElement {
  return (
    <section className="hero-panel">
      <div className="warning-label">{t("픽션 칩만 사용합니다", "Fictional chips only")}</div>
      <h2>{t("왜 사람은 잃으면서도 한 번 더 누를까?", "Why do people press one more time while losing?")}</h2>
      <p>
        {t(
          "이 페이지는 실제 도박 서비스가 아니라 손실 추격, 니어미스, 변동 보상 같은 심리 장치를 체험하고 분석하는 교육용 시뮬레이션입니다.",
          "This is not a gambling service. It is an educational simulation for experiencing and analyzing chasing losses, near-misses, and variable rewards.",
        )}
      </p>
      <div className="callout">
        {t(
          "현실의 도박은 장기적으로 불리하게 설계될 수 있으며, 결제·환전·현금화 기능은 이 페이지에 없습니다.",
          "Real gambling can be structurally unfavorable. This page has no payment, exchange, withdrawal, or real-money mechanics.",
        )}
      </div>
      <button className="primary" onClick={onStart}>{t("심리 시뮬레이션 시작", "Start psychology simulation")}</button>
    </section>
  );
}

function BankrollScreen({
  t,
  loc,
  customBankroll,
  setCustomBankroll,
  onStart,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  customBankroll: string;
  setCustomBankroll: (value: string) => void;
  onStart: (amount: number) => void;
}): ReactElement {
  const custom = Number(customBankroll.replace(/,/g, ""));
  const customValid = Number.isFinite(custom) && custom >= 100_000 && custom <= 10_000_000;
  return (
    <section className="panel">
      <div className="eyebrow">{t("시작 칩 선택", "Choose starting chips")}</div>
      <h2>{t("칩은 현실 돈이 아닙니다", "Chips are not real money")}</h2>
      <p className="muted">
        {t(
          "금액은 심리 압박을 보여주기 위한 픽션 포인트입니다. 잔액이 커질수록 손실을 인정하기 어려워지는 구조를 관찰해보세요.",
          "These are fictional points for demonstrating psychological pressure. Larger balances make losses harder to accept.",
        )}
      </p>
      <div className="bank-grid">
        {BANKROLL_OPTIONS.map((option) => (
          <button key={option.amount} className="choice-card" onClick={() => onStart(option.amount)}>
            <strong>{loc === "ko" ? option.ko : option.en}</strong>
            <span>{loc === "ko" ? option.hintKo : option.hintEn}</span>
          </button>
        ))}
      </div>
      <div className="custom-row">
        <label>
          <span>{t("직접 입력", "Custom")}</span>
          <input
            inputMode="numeric"
            value={customBankroll}
            onChange={(event) => setCustomBankroll(event.target.value.replace(/[^\d]/g, ""))}
            placeholder="1000000"
          />
        </label>
        <button className="secondary" disabled={!customValid} onClick={() => onStart(custom)}>
          {t("이 칩으로 시작", "Start with this")}
        </button>
      </div>
      <p className="fineprint">{t("안전 범위: 100,000칩부터 10,000,000칩까지", "Safe range: 100,000 to 10,000,000 chips")}</p>
    </section>
  );
}

function GameSelectScreen({
  t,
  loc,
  expandedRules,
  setExpandedRules,
  onChoose,
  balance,
  starting,
  onStop,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  expandedRules: ModeId | null;
  setExpandedRules: (id: ModeId | null) => void;
  onChoose: (id: ModeId) => void;
  balance: number;
  starting: number;
  onStop: () => void;
}): ReactElement {
  return (
    <section className="panel">
      <SessionHeader t={t} loc={loc} balance={balance} starting={starting} onStop={onStop} />
      <div className="eyebrow">{t("게임 선택", "Choose mode")}</div>
      <h2>{t("확률보다 먼저 심리가 작동합니다", "Psychology acts before the odds are revealed")}</h2>
      <p className="muted">
        {t(
          "진행 중에는 정확한 승률을 숨깁니다. 실제처럼 몰입한 뒤, 결과 화면에서 기대 손실과 심리 장치를 공개합니다.",
          "Exact odds are hidden during play. After the session, the result screen reveals expected loss and manipulation patterns.",
        )}
      </p>
      <div className="mode-grid">
        {MODES.map((mode) => (
          <article className="mode-card" key={mode.id}>
            <div className="mode-icon">{mode.icon}</div>
            <h3>{loc === "ko" ? mode.ko : mode.en}</h3>
            <p>{loc === "ko" ? mode.hookKo : mode.hookEn}</p>
            <div className="mode-actions">
              <button className="secondary small" onClick={() => setExpandedRules(expandedRules === mode.id ? null : mode.id)}>
                {expandedRules === mode.id ? t("규칙 닫기", "Hide rules") : t("규칙 보기", "Rules")}
              </button>
              <button className="primary small" onClick={() => onChoose(mode.id)}>{t("체험", "Try")}</button>
            </div>
            {expandedRules === mode.id && (
              <div className="rules-box">
                <strong>{t("어떻게 진행되나", "How it works")}</strong>
                <p>{loc === "ko" ? mode.rulesKo : mode.rulesEn}</p>
                <strong>{t("노리는 심리", "Psychological trap")}</strong>
                <p>{loc === "ko" ? mode.trapKo : mode.trapEn}</p>
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="ad-inline"><AdBottom /></div>
    </section>
  );
}

function PlayScreen({
  t,
  loc,
  mode,
  balance,
  starting,
  bet,
  rawBet,
  onBet,
  canPlay,
  message,
  latest,
  stats,
  history,
  rouletteBet,
  setRouletteBet,
  oddEvenPick,
  setOddEvenPick,
  ladderPick,
  setLadderPick,
  ladderRun,
  blackjack,
  onSlot,
  onDealBlackjack,
  onHitBlackjack,
  onStandBlackjack,
  onRoulette,
  onOddEven,
  onLadder,
  onLadderFinish,
  onStop,
  onChangeMode,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  mode: ModeInfo;
  balance: number;
  starting: number;
  bet: number;
  rawBet: number;
  onBet: (amount: number) => void;
  canPlay: boolean;
  message: string | null;
  latest: RoundEvent | null;
  stats: Stats;
  history: RoundEvent[];
  rouletteBet: RouletteBet;
  setRouletteBet: (value: RouletteBet) => void;
  oddEvenPick: OddEvenPick;
  setOddEvenPick: (value: OddEvenPick) => void;
  ladderPick: LadderPick;
  setLadderPick: (value: LadderPick) => void;
  ladderRun: LadderRun;
  blackjack: BlackjackState;
  onSlot: () => void;
  onDealBlackjack: () => void;
  onHitBlackjack: () => void;
  onStandBlackjack: () => void;
  onRoulette: () => void;
  onOddEven: () => void;
  onLadder: () => void;
  onLadderFinish: (plan: LadderPlan) => void;
  onStop: () => void;
  onChangeMode: () => void;
}): ReactElement {
  const isLadderRunning = mode.id === "ladder" && ladderRun.status === "running";
  return (
    <section className="play-layout">
      <div className="play-main panel">
        <SessionHeader t={t} loc={loc} balance={balance} starting={starting} onStop={onStop} />
        <div className="mode-title">
          <span className="mode-icon">{mode.icon}</span>
          <div>
            <div className="eyebrow">{t("진행 중 확률 숨김", "Odds hidden during play")}</div>
            <h2>{loc === "ko" ? mode.ko : mode.en}</h2>
          </div>
        </div>
        <p className="muted">{loc === "ko" ? mode.rulesKo : mode.rulesEn}</p>

        <BetControls t={t} loc={loc} bet={bet} rawBet={rawBet} balance={balance} onBet={onBet} disabled={isLadderRunning} />

        {mode.id === "slot" && (
          <div className="game-surface slot-surface">
            <div className="slot-reels" aria-label={t("슬롯 결과", "Slot result")}>
              {(latest?.mode === "slot" ? latest.label : "READY").split("").slice(0, 3).map((char, index) => (
                <div key={index} className="reel">{char === " " ? "*" : char}</div>
              ))}
            </div>
            <button className="primary action" disabled={!canPlay} onClick={onSlot}>{t("한 번 눌러보기", "Press once")}</button>
          </div>
        )}

        {mode.id === "blackjack" && (
          <div className="game-surface">
            <div className="blackjack-grid">
              <Hand label={t("나", "You")} cards={blackjack.player} total={handTotal(blackjack.player)} />
              <Hand label={t("상대", "Dealer")} cards={blackjack.dealer} total={blackjack.active ? handTotal(blackjack.dealer) : 0} />
            </div>
            {!blackjack.active ? (
              <button className="primary action" disabled={!canPlay} onClick={onDealBlackjack}>{t("카드 받기", "Deal cards")}</button>
            ) : (
              <div className="action-row">
                <button className="secondary" onClick={onHitBlackjack}>{t("히트", "Hit")}</button>
                <button className="primary" onClick={onStandBlackjack}>{t("스탠드", "Stand")}</button>
              </div>
            )}
          </div>
        )}

        {mode.id === "roulette" && (
          <div className="game-surface">
            <Segmented
              options={[
                ["red", t("빨강", "Red")],
                ["black", t("검정", "Black")],
                ["odd", t("홀", "Odd")],
                ["even", t("짝", "Even")],
                ["number", t("숫자 7", "Number 7")],
              ]}
              value={rouletteBet}
              onChange={(v) => setRouletteBet(v as RouletteBet)}
            />
            <div className="wheel">{latest?.mode === "roulette" ? latest.label : "0-36"}</div>
            <button className="primary action" disabled={!canPlay} onClick={onRoulette}>{t("회전시키기", "Spin")}</button>
          </div>
        )}

        {mode.id === "oddEven" && (
          <div className="game-surface">
            <Segmented
              options={[["odd", t("홀", "Odd")], ["even", t("짝", "Even")]]}
              value={oddEvenPick}
              onChange={(v) => setOddEvenPick(v as OddEvenPick)}
            />
            <div className="simple-display">{latest?.mode === "oddEven" ? latest.label : "?"}</div>
            <button className="primary action" disabled={!canPlay} onClick={onOddEven}>{t("결과 보기", "Reveal")}</button>
          </div>
        )}

        {mode.id === "ladder" && (
          <div className="game-surface">
            <Segmented
              options={[["left", t("왼쪽", "Left")], ["center", t("가운데", "Center")], ["right", t("오른쪽", "Right")]]}
              value={ladderPick}
              onChange={(v) => setLadderPick(v as LadderPick)}
              disabled={isLadderRunning}
            />
            <LadderMiniGame
              t={t}
              loc={loc}
              pickValue={ladderPick}
              run={ladderRun}
              onFinish={onLadderFinish}
            />
            <div className="ladder-demo">
              <span /> <span /> <span />
            </div>
            <button className="primary action" disabled={!canPlay} onClick={onLadder}>{t("길 선택", "Choose path")}</button>
          </div>
        )}

        {message && <div className="psych-message">{message}</div>}
        {stats.consecutiveLosses >= 3 && (
          <div className="loss-warning">
            {t(
              "지금은 확률 계산보다 손실 회복 욕구가 커질 수 있는 구간입니다.",
              "This is the zone where the urge to recover losses can become stronger than probability thinking.",
            )}
          </div>
        )}

        <div className="action-row footer-actions">
          <button className="secondary" onClick={onChangeMode}>{t("게임 변경", "Change mode")}</button>
          <button className="danger" onClick={onStop}>{t("그만하기", "Stop and analyze")}</button>
        </div>
      </div>

      <aside className="panel side-panel">
        <div className="eyebrow">{t("세션 요약", "Session summary")}</div>
        <Metric label={t("총 회차", "Rounds")} value={`${stats.rounds}`} />
        <Metric label={t("승 / 패", "Win / Loss")} value={`${stats.wins} / ${stats.losses}`} />
        <Metric label={t("연속 손실 최대", "Max loss streak")} value={`${stats.maxConsecutiveLosses}`} />
        <Metric label={t("니어미스", "Near-misses")} value={`${stats.nearMisses}`} />
        <Metric label={t("손실 후 판돈 증가", "Raised after loss")} value={`${stats.increasedAfterLoss}`} />
        <Metric label={t("같은 길 반복", "Repeated ladder path")} value={`${stats.repeatedSameLadderPath}`} />
        <Metric label={t("패배 후 경로 변경", "Switched after loss")} value={`${stats.switchedLadderPathAfterLoss}`} />
        <HistoryList t={t} loc={loc} history={history} />
      </aside>
    </section>
  );
}

function SessionHeader({
  t,
  loc,
  balance,
  starting,
  onStop,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  balance: number;
  starting: number;
  onStop: () => void;
}): ReactElement {
  const pct = starting > 0 ? Math.max(0, Math.min(100, (balance / starting) * 100)) : 100;
  return (
    <div className="session-header">
      <div>
        <span>{t("남은 픽션 칩", "Fictional chips left")}</span>
        <strong>{formatChips(balance, loc)}</strong>
      </div>
      <div className="meter"><i style={{ width: `${pct}%` }} /></div>
      <button className="danger small" onClick={onStop}>{t("그만하기", "Stop")}</button>
    </div>
  );
}

function LadderMiniGame({
  t,
  loc,
  pickValue,
  run,
  onFinish,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  pickValue: LadderPick;
  run: LadderRun;
  onFinish: (plan: LadderPlan) => void;
}): ReactElement {
  const [progress, setProgress] = useState(1);
  const [tick, setTick] = useState<{ x: number; y: number; id: number } | null>(null);

  const plan = run.plan;
  const idleColumn = ladderPickIndex(pickValue);
  const route = useMemo(
    () => plan?.route ?? [{ x: LADDER_X[idleColumn], y: 3 }, { x: LADDER_X[idleColumn], y: 96 }],
    [idleColumn, plan],
  );
  const bridges = useMemo<LadderBridge[]>(
    () => plan?.bridges ?? [
      { from: 0, y: 22 },
      { from: 1, y: 36 },
      { from: 0, y: 51 },
      { from: 1, y: 66 },
      { from: 0, y: 80 },
    ],
    [plan],
  );
  const displayProgress = run.status === "running" ? progress : run.status === "revealed" ? 1 : 0;

  const totalLength = useMemo(() => {
    return route.slice(1).reduce((sum, point, index) => {
      const prev = route[index];
      return sum + Math.hypot(point.x - prev.x, point.y - prev.y);
    }, 0);
  }, [route]);

  const marker = useMemo(() => {
    const target = totalLength * displayProgress;
    let travelled = 0;
    const travelledPoints: LadderPoint[] = [route[0]];

    for (let i = 1; i < route.length; i += 1) {
      const from = route[i - 1];
      const to = route[i];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      if (travelled + length >= target) {
        const local = length === 0 ? 1 : (target - travelled) / length;
        const point = {
          x: from.x + (to.x - from.x) * local,
          y: from.y + (to.y - from.y) * local,
        };
        travelledPoints.push(point);
        return { point, travelledPoints };
      }
      travelled += length;
      travelledPoints.push(to);
    }

    return { point: route[route.length - 1], travelledPoints };
  }, [displayProgress, route, totalLength]);

  useEffect(() => {
    if (run.status !== "running" || !plan) {
      return;
    }

    let frame = 0;
    let done = false;
    const duration = 2200;
    const started = performance.now();
    const tickYs = new Set(plan.bridges.map((bridge) => Math.round(bridge.y)));
    const fired = new Set<number>();

    const animate = (now: number) => {
      const raw = Math.min(1, (now - started) / duration);
      const eased = raw < 0.18 ? raw * 0.75 : raw < 0.82 ? raw * 1.08 - 0.06 : 1 - Math.pow(1 - raw, 2) * 0.18;
      const next = Math.max(0, Math.min(1, eased));
      setProgress(next);

      const targetLength = totalLength * next;
      let travelled = 0;
      for (let i = 1; i < plan.route.length; i += 1) {
        const from = plan.route[i - 1];
        const to = plan.route[i];
        const length = Math.hypot(to.x - from.x, to.y - from.y);
        if (travelled + length >= targetLength) {
          const y = Math.round(to.y);
          if (tickYs.has(y) && !fired.has(y) && Math.abs(to.x - from.x) > 1) {
            fired.add(y);
            setTick({ x: to.x, y: to.y, id: Date.now() + y });
          }
          break;
        }
        travelled += length;
      }

      if (raw < 1) {
        frame = requestAnimationFrame(animate);
      } else if (!done) {
        done = true;
        setProgress(1);
        window.setTimeout(() => onFinish(plan), 260);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onFinish, plan, run.status, totalLength]);

  const trail = marker.travelledPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const selectedIndex = ladderPickIndex(plan?.selected ?? pickValue);
  const finalIndex = plan ? ladderPickIndex(plan.final) : -1;

  return (
    <div className={`ladder-game ${run.status}`}>
      <div className="ladder-top-labels" aria-hidden>
        {LADDER_PICKS.map((item, index) => (
          <span key={item} className={index === selectedIndex ? "active" : ""}>{ladderPickLabel(item, loc)}</span>
        ))}
      </div>
      <svg className="ladder-svg" viewBox="0 0 100 100" role="img" aria-label={t("사다리 진행 경로", "Ladder path")}>
        {LADDER_X.map((x, index) => (
          <line key={x} className={index === selectedIndex ? "ladder-line selected" : "ladder-line"} x1={x} y1="4" x2={x} y2="96" />
        ))}
        {bridges.map((bridge) => (
          <line
            key={`${bridge.from}-${bridge.y}`}
            className="ladder-bridge"
            x1={LADDER_X[bridge.from]}
            y1={bridge.y}
            x2={LADDER_X[bridge.from + 1]}
            y2={bridge.y}
          />
        ))}
        {run.status !== "idle" && (
          <polyline className="ladder-trail" points={trail} />
        )}
        <circle className={run.status === "running" ? "ladder-marker moving" : "ladder-marker"} cx={marker.point.x} cy={marker.point.y} r="3.2" />
      </svg>
      {tick && run.status === "running" && (
        <span key={tick.id} className="ladder-tick" style={{ left: `${tick.x}%`, top: `${tick.y}%` }}>
          {t("띠릭", "tick")}
        </span>
      )}
      <div className="ladder-bottom-labels">
        {LADDER_PICKS.map((item, index) => (
          <span key={item} className={run.status === "revealed" && index === finalIndex ? "arrived" : ""}>
            {run.status === "revealed" ? ladderPickLabel(item, loc) : "?"}
          </span>
        ))}
      </div>
    </div>
  );
}

function BetControls({
  t,
  loc,
  bet,
  rawBet,
  balance,
  onBet,
  disabled = false,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  bet: number;
  rawBet: number;
  balance: number;
  onBet: (amount: number) => void;
  disabled?: boolean;
}): ReactElement {
  return (
    <div className="bet-panel">
      <div className="bet-top">
        <span>{t("판돈", "Bet")}</span>
        <strong>{formatChips(bet, loc)}</strong>
      </div>
      <input
        aria-label={t("판돈 조절", "Adjust bet")}
        type="range"
        min={10_000}
        max={Math.max(10_000, Math.min(balance, 1_000_000))}
        step={10_000}
        value={Math.min(rawBet, Math.max(10_000, Math.min(balance, 1_000_000)))}
        onChange={(event) => onBet(Number(event.target.value))}
        disabled={disabled}
      />
      <div className="chip-row">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={bet === amount ? "chip active" : "chip"}
            disabled={disabled || amount > balance}
            onClick={() => onBet(amount)}
          >
            {formatChips(amount, loc)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hand({ label, cards, total }: { label: string; cards: number[]; total: number }): ReactElement {
  return (
    <div className="hand">
      <div className="hand-title">{label} {cards.length > 0 && <b>{total}</b>}</div>
      <div className="cards">
        {cards.length === 0 ? <span className="card muted-card">?</span> : cards.map((card, idx) => <span className="card" key={`${card}-${idx}`}>{card === 11 ? "A" : card}</span>)}
      </div>
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: Array<[string, string]>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}): ReactElement {
  return (
    <div className="segmented">
      {options.map(([id, label]) => (
        <button key={id} className={value === id ? "selected" : ""} disabled={disabled} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HistoryList({ t, loc, history }: { t: (ko: string, en: string) => string; loc: Loc; history: RoundEvent[] }): ReactElement {
  return (
    <div className="history">
      <h3>{t("최근 결과", "Recent results")}</h3>
      {history.length === 0 ? (
        <p className="muted">{t("아직 결과가 없습니다.", "No rounds yet.")}</p>
      ) : (
        history.map((item, index) => (
          <div className="history-row" key={`${item.label}-${index}`}>
            <span>{modeById(item.mode).ko} · {item.label}</span>
            <strong className={item.delta >= 0 ? "gain" : "loss"}>{item.delta >= 0 ? "+" : "-"}{formatChips(Math.abs(item.delta), loc)}</strong>
          </div>
        ))
      )}
    </div>
  );
}

function ResultScreen({
  t,
  loc,
  balance,
  stats,
  resultType,
  onReplay,
  onShare,
  copied,
}: {
  t: (ko: string, en: string) => string;
  loc: Loc;
  balance: number;
  stats: Stats;
  resultType: { title: string; summary: string; memory: string; mantra: string };
  onReplay: () => void;
  onShare: () => void;
  copied: boolean;
}): ReactElement {
  const net = balance - stats.startingChips;
  const expectedLoss = Math.round(stats.totalBet * 0.08);
  return (
    <section className="result-layout">
      <div className="panel result-hero">
        <div className="eyebrow">{t("세션 분석 결과", "Session analysis")}</div>
        <h2>{resultType.title}</h2>
        <p>{resultType.summary}</p>
        <div className="result-balance">
          <div>
            <span>{t("최종 칩", "Final chips")}</span>
            <strong>{formatChips(balance, loc)}</strong>
          </div>
          <div>
            <span>{t("순손익", "Net")}</span>
            <strong className={net >= 0 ? "gain" : "loss"}>{net >= 0 ? "+" : "-"}{formatChips(Math.abs(net), loc)}</strong>
          </div>
        </div>
        <div className="action-row">
          <button className="primary" onClick={onShare}>{copied ? t("복사 완료", "Copied") : t("공유/복사", "Share/copy")}</button>
          <button className="secondary" onClick={onReplay}>{t("다시 체험", "Replay")}</button>
        </div>
      </div>

      <div className="result-grid">
        <ResultCard title={t("당신이 가장 흔들린 순간", "Most vulnerable moment")} body={resultType.memory} />
        <ResultCard title={t("가장 큰 심리 함정", "Biggest psychological trap")} body={strongestTrap(stats)} />
        <ResultCard
          title={t("행동 분석", "Behavior analysis")}
          body={t(
            `${stats.rounds}회 동안 총 ${formatChips(stats.totalBet, loc)}을 걸었고, 손실 후 다시 누른 순간이 ${stats.oneMoreMoments}번 기록됐습니다. 니어미스는 ${stats.nearMisses}번이었습니다.`,
            `Across ${stats.rounds} rounds, you bet ${formatChips(stats.totalBet, loc)}. One-more-after-loss moments: ${stats.oneMoreMoments}. Near-misses: ${stats.nearMisses}.`,
          )}
        />
        <ResultCard
          title={t("카지노가 노리는 심리", "What the system exploits")}
          body={t(
            "작은 승리, 아까운 실패, 직접 고른 느낌이 손실을 오락처럼 포장합니다. 사람은 전체 손실보다 방금의 감정을 더 크게 느낍니다.",
            "Small wins, near-misses, and chosen actions can package loss as entertainment. Recent emotion can feel larger than total loss.",
          )}
        />
        <ResultCard
          title={t("현실이었다면 위험한 이유", "Why this would be dangerous in reality")}
          body={t(
            `이 시뮬레이션의 총 기대 손실 예시는 약 ${formatChips(expectedLoss, loc)}입니다. 실제 도박에서는 여기에 시간, 신용, 관계 손실이 겹칠 수 있습니다.`,
            `The estimated expected loss in this session is about ${formatChips(expectedLoss, loc)}. In real gambling, time, credit, and relationships can also be damaged.`,
          )}
        />
        <ResultCard title={t("다음부터 기억할 한 문장", "One sentence to remember")} body={resultType.mantra} />
      </div>

      <section className="panel">
        <div className="eyebrow">{t("결과 후 공개되는 확률 정보", "Odds revealed after the session")}</div>
        <div className="odds-grid">
          {MODES.map((mode) => (
            <div className="odds-card" key={mode.id}>
              <strong>{loc === "ko" ? mode.ko : mode.en}</strong>
              <p>{loc === "ko" ? mode.revealKo : mode.revealEn}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="eyebrow">{t("다음 추천", "Recommended next")}</div>
        <div className="recommend-row">
          <a href="/games/probability">확률 착각 테스트</a>
          <a href="/games/timesense">시간 감각 테스트</a>
          <a href="/games/balance">밸런스 선택</a>
        </div>
      </section>

      <div className="ad-inline"><AdBottom /></div>
    </section>
  );
}

function ResultCard({ title, body }: { title: string; body: string }): ReactElement {
  return (
    <article className="result-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

const styles = `
.gambling-root {
  min-height: 100svh;
  background: ${BG};
  color: ${INK};
  font-family: ${SANS};
  position: relative;
  overflow-x: hidden;
}
.gambling-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 18% 8%, rgba(245,184,75,0.18), transparent 26%),
    radial-gradient(circle at 80% 12%, rgba(125,211,252,0.13), transparent 26%),
    linear-gradient(180deg, #15100b 0%, #090909 44%, #050505 100%);
  pointer-events: none;
}
.gambling-shell {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 30px 0 80px;
}
.topline {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 28px;
}
h1, h2, h3, p { word-break: keep-all; }
h1 {
  margin: 4px 0 0;
  font-family: ${SERIF};
  font-size: clamp(34px, 6vw, 76px);
  letter-spacing: 0;
  line-height: 0.95;
}
h2 {
  margin: 8px 0 12px;
  font-family: ${SERIF};
  font-size: clamp(28px, 4vw, 46px);
  line-height: 1.1;
  letter-spacing: 0;
}
h3 {
  margin: 0 0 8px;
  font-size: 18px;
}
.eyebrow {
  color: ${WARNING};
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.safety-pill,
.warning-label {
  border: 1px solid rgba(245,184,75,0.32);
  background: rgba(245,184,75,0.1);
  color: #ffd58a;
  border-radius: 999px;
  padding: 10px 13px;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
}
.hero-panel,
.panel {
  background: linear-gradient(180deg, ${PANEL_STRONG}, ${PANEL});
  border: 1px solid ${LINE};
  border-radius: 12px;
  padding: clamp(20px, 4vw, 34px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.34);
}
.hero-panel {
  max-width: 820px;
}
.hero-panel p,
.muted {
  color: ${MUTED};
  line-height: 1.72;
  font-size: 16px;
}
.callout,
.psych-message {
  border: 1px solid rgba(245,184,75,0.28);
  background: rgba(245,184,75,0.09);
  color: #ffe3ae;
  padding: 14px 16px;
  border-radius: 10px;
  line-height: 1.65;
  margin: 18px 0;
}
.fineprint {
  color: ${FAINT};
  font-size: 13px;
  margin: 12px 0 0;
}
button,
a {
  font-family: ${SANS};
}
button {
  touch-action: manipulation;
}
.primary,
.secondary,
.danger {
  border: 0;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 950;
  cursor: pointer;
}
.primary {
  background: linear-gradient(135deg, #ffe0a3, ${WARNING});
  color: #191006;
}
.secondary {
  border: 1px solid ${LINE};
  background: rgba(255,255,255,0.06);
  color: ${INK};
}
.danger {
  border: 1px solid rgba(248,113,113,0.38);
  background: rgba(248,113,113,0.12);
  color: #fecaca;
}
.small {
  padding: 10px 12px;
  font-size: 13px;
}
button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}
.bank-grid,
.mode-grid,
.result-grid,
.odds-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}
.choice-card,
.mode-card {
  border: 1px solid ${LINE};
  background: rgba(0,0,0,0.24);
  color: ${INK};
  border-radius: 12px;
  padding: 18px;
  text-align: left;
}
.choice-card strong,
.choice-card span {
  display: block;
}
.choice-card strong {
  font-size: 22px;
}
.choice-card span,
.mode-card p {
  color: ${MUTED};
  line-height: 1.58;
  margin: 8px 0 0;
}
.custom-row {
  display: flex;
  gap: 12px;
  align-items: end;
  margin-top: 18px;
}
.custom-row label {
  flex: 1;
  min-width: 0;
}
.custom-row span {
  display: block;
  color: ${FAINT};
  font-size: 13px;
  margin-bottom: 8px;
}
input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${LINE};
  border-radius: 10px;
  min-height: 50px;
  background: rgba(255,255,255,0.08);
  color: ${INK};
  padding: 0 14px;
  font-size: 17px;
  font-weight: 800;
}
.mode-icon {
  display: inline-grid;
  place-items: center;
  min-width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(245,184,75,0.12);
  color: #ffd58a;
  font-weight: 1000;
  margin-bottom: 12px;
}
.mode-actions,
.action-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.mode-actions {
  margin-top: 16px;
}
.rules-box {
  margin-top: 14px;
  border-top: 1px solid ${LINE};
  padding-top: 14px;
}
.rules-box strong {
  color: #ffd58a;
  font-size: 13px;
}
.rules-box p {
  margin: 6px 0 12px;
}
.session-header {
  display: grid;
  grid-template-columns: minmax(0, auto) 1fr auto;
  gap: 14px;
  align-items: center;
  margin-bottom: 22px;
}
.session-header span {
  display: block;
  color: ${FAINT};
  font-size: 12px;
  font-weight: 900;
}
.session-header strong {
  display: block;
  color: ${INK};
  font-size: 22px;
}
.meter {
  height: 9px;
  background: rgba(255,255,255,0.09);
  border-radius: 999px;
  overflow: hidden;
}
.meter i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, ${RED}, ${WARNING}, ${GREEN});
}
.play-layout,
.result-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 16px;
  align-items: start;
}
.result-layout {
  grid-template-columns: 1fr;
}
.mode-title {
  display: flex;
  gap: 14px;
  align-items: center;
}
.mode-title .mode-icon {
  margin-bottom: 0;
}
.bet-panel {
  border: 1px solid ${LINE};
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 16px;
  margin: 18px 0;
}
.bet-top {
  display: flex;
  justify-content: space-between;
  color: ${MUTED};
  margin-bottom: 10px;
}
.bet-top strong {
  color: ${WARNING};
}
input[type="range"] {
  padding: 0;
  min-height: 30px;
}
.chip-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}
.chip {
  border: 1px solid ${LINE};
  background: rgba(255,255,255,0.05);
  color: ${INK};
  border-radius: 999px;
  padding: 9px 8px;
  font-size: 12px;
  font-weight: 900;
}
.chip.active {
  border-color: ${WARNING};
  color: #ffd58a;
}
.game-surface {
  border: 1px solid ${LINE};
  border-radius: 14px;
  background: radial-gradient(circle at 50% 0%, rgba(245,184,75,0.14), rgba(0,0,0,0.2) 58%);
  padding: clamp(16px, 4vw, 26px);
  text-align: center;
}
.slot-reels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 430px;
  margin: 0 auto 20px;
}
.reel,
.wheel,
.simple-display {
  border: 1px solid ${LINE};
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  display: grid;
  place-items: center;
  min-height: 96px;
  font-size: clamp(30px, 8vw, 56px);
  font-weight: 1000;
}
.wheel,
.simple-display {
  max-width: 320px;
  margin: 18px auto;
}
.action {
  min-width: min(100%, 280px);
}
.blackjack-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.hand {
  border: 1px solid ${LINE};
  background: rgba(0,0,0,0.22);
  border-radius: 12px;
  padding: 14px;
}
.hand-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: ${MUTED};
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.card {
  display: grid;
  place-items: center;
  width: 42px;
  height: 58px;
  border-radius: 8px;
  background: ${INK};
  color: #111;
  font-weight: 1000;
}
.muted-card {
  background: rgba(255,255,255,0.08);
  color: ${FAINT};
}
.segmented {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.segmented button {
  border: 1px solid ${LINE};
  background: rgba(255,255,255,0.06);
  color: ${INK};
  border-radius: 999px;
  padding: 12px 14px;
  font-weight: 900;
  min-width: 84px;
}
.segmented button.selected {
  border-color: ${WARNING};
  color: #ffd58a;
  background: rgba(245,184,75,0.14);
}
.ladder-demo {
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 320px;
  margin: 20px auto;
}
.ladder-demo span {
  height: 130px;
  border-left: 5px solid rgba(245,184,75,0.4);
  border-right: 5px solid rgba(125,211,252,0.22);
  border-radius: 14px;
  transform: skewX(-8deg);
}
.ladder-game + .ladder-demo + button.action {
  margin-top: 2px;
  font-size: 0;
}
.ladder-game + .ladder-demo + button.action::after {
  content: "사다리 타기";
  font-size: 15px;
}
.ladder-game.running + .ladder-demo + button.action::after {
  content: "내려가는 중";
}
.ladder-game {
  position: relative;
  width: min(100%, 420px);
  margin: 18px auto 16px;
  padding: 10px 10px 6px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.38));
  overflow: hidden;
}
.ladder-top-labels,
.ladder-bottom-labels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  color: ${FAINT};
  font-size: 12px;
  font-weight: 950;
}
.ladder-top-labels span,
.ladder-bottom-labels span {
  min-height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.08);
}
.ladder-top-labels .active {
  color: #191006;
  background: linear-gradient(135deg, #fff1bd, ${WARNING});
  box-shadow: 0 0 22px rgba(245,184,75,0.28);
}
.ladder-bottom-labels .arrived {
  color: #fff1bd;
  border-color: rgba(245,184,75,0.72);
  box-shadow: 0 0 24px rgba(245,184,75,0.24);
}
.ladder-svg {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1.05;
  margin: 4px 0;
  overflow: visible;
}
.ladder-line {
  stroke: rgba(255,255,255,0.2);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.ladder-line.selected {
  stroke: rgba(245,184,75,0.72);
}
.ladder-bridge {
  stroke: rgba(125,211,252,0.44);
  stroke-width: 1.9;
  stroke-linecap: round;
}
.ladder-trail {
  fill: none;
  stroke: #ffd66b;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 6px rgba(245,184,75,0.9));
}
.ladder-marker {
  fill: #fff2a8;
  stroke: #2b1602;
  stroke-width: 0.8;
  filter: drop-shadow(0 0 8px rgba(245,184,75,0.95));
}
.ladder-marker.moving {
  animation: ladderPulse 460ms ease-in-out infinite alternate;
}
.ladder-tick {
  position: absolute;
  transform: translate(-50%, -50%);
  color: #fff1bd;
  font-weight: 1000;
  font-size: 13px;
  pointer-events: none;
  animation: ladderTick 700ms ease-out forwards;
  text-shadow: 0 0 12px rgba(245,184,75,0.8);
}
.ladder-controls {
  display: grid;
  gap: 12px;
  justify-items: center;
}
.ladder-verdict {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: min(100%, 360px);
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 950;
  animation: resultPop 360ms cubic-bezier(0.2, 1.4, 0.3, 1) both;
}
.ladder-verdict.win {
  background: rgba(100,211,154,0.14);
  border: 1px solid rgba(100,211,154,0.38);
  color: #bbf7d0;
}
.ladder-verdict.loss {
  background: rgba(248,113,113,0.12);
  border: 1px solid rgba(248,113,113,0.36);
  color: #fecaca;
}
.loss-warning {
  margin-top: 12px;
  border: 1px solid rgba(248,113,113,0.3);
  background: rgba(248,113,113,0.1);
  color: #fed7aa;
  padding: 13px 15px;
  border-radius: 10px;
  line-height: 1.6;
  font-weight: 800;
}
@keyframes ladderPulse {
  from { transform: scale(1); opacity: 0.9; }
  to { transform: scale(1.32); opacity: 1; }
}
@keyframes ladderTick {
  0% { opacity: 0; transform: translate(-50%, -30%) scale(0.7); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -115%) scale(1.08); }
}
@keyframes resultPop {
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.footer-actions {
  margin-top: 18px;
}
.side-panel {
  position: sticky;
  top: 16px;
}
.metric,
.history-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid ${LINE};
}
.metric span,
.history-row span {
  color: ${MUTED};
}
.gain { color: ${GREEN}; }
.loss { color: #fca5a5; }
.history {
  margin-top: 16px;
}
.history h3 {
  font-size: 15px;
  color: #ffd58a;
}
.result-hero p,
.result-card p {
  color: ${MUTED};
  line-height: 1.72;
}
.result-balance {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0;
}
.result-balance > div,
.result-card,
.odds-card {
  border: 1px solid ${LINE};
  background: rgba(0,0,0,0.22);
  border-radius: 12px;
  padding: 16px;
}
.result-balance span {
  display: block;
  color: ${FAINT};
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 8px;
}
.result-balance strong {
  font-size: clamp(22px, 4vw, 34px);
}
.odds-card p {
  color: ${MUTED};
  line-height: 1.62;
}
.recommend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}
.recommend-row a {
  color: #ffd58a;
  text-decoration: none;
  border: 1px solid ${LINE};
  border-radius: 999px;
  padding: 10px 13px;
  font-weight: 900;
}
.ad-inline {
  margin-top: 18px;
}
@media (max-width: 780px) {
  .gambling-shell {
    width: min(100vw - 28px, 560px);
    padding-top: 20px;
  }
  .topline,
  .custom-row,
  .session-header {
    flex-direction: column;
  }
  .topline {
    display: grid;
  }
  .bank-grid,
  .mode-grid,
  .result-grid,
  .odds-grid,
  .play-layout,
  .blackjack-grid,
  .result-balance {
    grid-template-columns: 1fr;
  }
  .session-header {
    grid-template-columns: 1fr;
  }
  .side-panel {
    position: static;
  }
  .chip-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .action-row,
  .mode-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .primary,
  .secondary,
  .danger {
    width: 100%;
  }
}
`;
