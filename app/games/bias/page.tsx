"use client";
import { useLocale } from "@/hooks/useLocale";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";

/* ============================================================================
   Theme
   ============================================================================ */

const ACCENT = "#ff2d78";
const BG = "#0d0d0d";

/* ============================================================================
   Types & data
   ============================================================================ */

type Position = "Leader" | "Vocal" | "Rapper" | "Dancer" | "Visual" | "Maknae";

type Idol = {
  id: string;
  ko: string;
  en: string;
  group: string;
  groupKo: string;
  positions: Position[];
  color: string;
  /** Optional path under /public — defaults to `/idols/{id}.jpg`; falls back to gradient if missing. */
  image: string;
};

const G_COLORS: Record<string, string> = {
  BTS: "#9b51e0",
  BLACKPINK: "#ff5fa2",
  aespa: "#22d3ee",
  NewJeans: "#60a5fa",
  IVE: "#d946ef",
  "Stray Kids": "#ef4444",
  TWICE: "#fbbf24",
  EXO: "#facc15",
  "NCT 127": "#84cc16",
  ENHYPEN: "#3b82f6",
  ITZY: "#fb923c",
  "Red Velvet": "#e11d48",
  GOT7: "#10b981",
  "MONSTA X": "#818cf8",
};

// Group fandom names for end-of-tournament message
const G_FANDOM: Record<string, string> = {
  BTS: "ARMY",
  BLACKPINK: "BLINK",
  aespa: "MY",
  NewJeans: "Bunnies",
  IVE: "DIVE",
  "Stray Kids": "STAY",
  TWICE: "ONCE",
  EXO: "EXO-L",
  "NCT 127": "NCTzen",
  ENHYPEN: "ENGENE",
  ITZY: "MIDZY",
  "Red Velvet": "ReVeluv",
  GOT7: "IGOT7",
  "MONSTA X": "MONBEBE",
};

function makeIdol(
  ko: string,
  en: string,
  group: string,
  groupKo: string,
  positions: Position[],
  photo?: string,
): Idol {
  const id = `${group}-${en}`.replace(/\s+/g, "-");
  return {
    id,
    ko,
    en,
    group,
    groupKo,
    positions,
    color: G_COLORS[group] ?? "#888",
    image: photo ?? `/idols/${id}.jpg`,
  };
}

const IDOLS: Idol[] = [
  // ── BTS ────────────────────────────────────
  makeIdol("RM", "RM", "BTS", "방탄소년단", ["Leader", "Rapper"], "/idols/rm.jpg"),
  makeIdol("진", "Jin", "BTS", "방탄소년단", ["Vocal", "Visual"], "/idols/jin.png"),
  makeIdol("슈가", "Suga", "BTS", "방탄소년단", ["Rapper"], "/idols/suga.jpg"),
  makeIdol("제이홉", "J-Hope", "BTS", "방탄소년단", ["Rapper", "Dancer"], "/idols/jhope.png"),
  makeIdol("지민", "Jimin", "BTS", "방탄소년단", ["Vocal", "Dancer"], "/idols/jimin.jpg"),
  makeIdol("뷔", "V", "BTS", "방탄소년단", ["Vocal", "Visual"], "/idols/v.jpg"),
  makeIdol("정국", "Jungkook", "BTS", "방탄소년단", ["Vocal", "Maknae"], "/idols/jungkook.png"),

  // ── BLACKPINK ──────────────────────────────
  makeIdol("지수", "Jisoo", "BLACKPINK", "블랙핑크", ["Vocal", "Visual"], "/idols/jisoo.png"),
  makeIdol("제니", "Jennie", "BLACKPINK", "블랙핑크", ["Rapper", "Vocal"], "/idols/jennie.jpg"),
  makeIdol("로제", "Rosé", "BLACKPINK", "블랙핑크", ["Vocal"], "/idols/rose.jpg"),
  makeIdol("리사", "Lisa", "BLACKPINK", "블랙핑크", ["Rapper", "Dancer"], "/idols/lisa.jpg"),

  // ── aespa ──────────────────────────────────
  makeIdol("카리나", "Karina", "aespa", "에스파", ["Leader", "Rapper", "Dancer"], "/idols/karina.jpg"),
  makeIdol("지젤", "Giselle", "aespa", "에스파", ["Rapper"], "/idols/giselle.jpg"),
  makeIdol("윈터", "Winter", "aespa", "에스파", ["Vocal", "Dancer"], "/idols/winter.png"),
  makeIdol("닝닝", "Ningning", "aespa", "에스파", ["Vocal", "Maknae"], "/idols/ningning.png"),

  // ── NewJeans ───────────────────────────────
  makeIdol("민지", "Minji", "NewJeans", "뉴진스", ["Leader", "Vocal"], "/idols/minji.jpg"),
  makeIdol("하니", "Hanni", "NewJeans", "뉴진스", ["Vocal"], "/idols/hanni.jpg"),
  makeIdol("다니엘", "Danielle", "NewJeans", "뉴진스", ["Vocal"], "/idols/danielle.jpg"),
  makeIdol("해린", "Haerin", "NewJeans", "뉴진스", ["Vocal", "Dancer"], "/idols/haerin.jpg"),
  makeIdol("혜인", "Hyein", "NewJeans", "뉴진스", ["Vocal", "Maknae"], "/idols/hyein.png"),

  // ── IVE ────────────────────────────────────
  makeIdol("안유진", "Yujin", "IVE", "아이브", ["Leader", "Vocal"], "/idols/yujin.jpg"),
  makeIdol("가을", "Gaeul", "IVE", "아이브", ["Vocal", "Dancer"], "/idols/gaeul.png"),
  makeIdol("레이", "Rei", "IVE", "아이브", ["Rapper", "Dancer"], "/idols/rei.png"),
  makeIdol("리즈", "Liz", "IVE", "아이브", ["Vocal"]),
  makeIdol("이서", "Leeseo", "IVE", "아이브", ["Vocal", "Maknae"], "/idols/leeseo.png"),
  makeIdol("장원영", "Wonyoung", "IVE", "아이브", ["Vocal", "Visual"], "/idols/wonyoung.png"),

  // ── Stray Kids ─────────────────────────────
  makeIdol("방찬", "Bang Chan", "Stray Kids", "스트레이 키즈", ["Leader", "Rapper"], "/idols/bangchan.png"),
  makeIdol("리노", "Lee Know", "Stray Kids", "스트레이 키즈", ["Dancer", "Vocal"], "/idols/leeknow.png"),
  makeIdol("창빈", "Changbin", "Stray Kids", "스트레이 키즈", ["Rapper"], "/idols/changbin.png"),
  makeIdol("현진", "Hyunjin", "Stray Kids", "스트레이 키즈", ["Rapper", "Dancer"], "/idols/hyunjin.png"),
  makeIdol("한", "Han", "Stray Kids", "스트레이 키즈", ["Rapper", "Vocal"], "/idols/han.png"),
  makeIdol("필릭스", "Felix", "Stray Kids", "스트레이 키즈", ["Rapper", "Vocal"], "/idols/felix.png"),
  makeIdol("승민", "Seungmin", "Stray Kids", "스트레이 키즈", ["Vocal"], "/idols/seungmin.png"),
  makeIdol("아이엔", "I.N", "Stray Kids", "스트레이 키즈", ["Vocal", "Maknae"], "/idols/in.png"),

  // ── TWICE ──────────────────────────────────
  makeIdol("나연", "Nayeon", "TWICE", "트와이스", ["Vocal"], "/idols/nayeon.jpg"),
  makeIdol("정연", "Jeongyeon", "TWICE", "트와이스", ["Vocal"], "/idols/jeongyeon.jpg"),
  makeIdol("모모", "Momo", "TWICE", "트와이스", ["Dancer"], "/idols/momo.jpg"),
  makeIdol("사나", "Sana", "TWICE", "트와이스", ["Vocal"], "/idols/sana.png"),
  makeIdol("지효", "Jihyo", "TWICE", "트와이스", ["Leader", "Vocal"], "/idols/jihyo.jpg"),
  makeIdol("미나", "Mina", "TWICE", "트와이스", ["Vocal", "Dancer"], "/idols/mina.jpg"),
  makeIdol("다현", "Dahyun", "TWICE", "트와이스", ["Rapper"], "/idols/dahyun.png"),
  makeIdol("채영", "Chaeyoung", "TWICE", "트와이스", ["Rapper", "Vocal"], "/idols/chaeyoung.jpg"),
  makeIdol("쯔위", "Tzuyu", "TWICE", "트와이스", ["Vocal", "Visual"], "/idols/tzuyu.jpg"),

  // ── EXO ────────────────────────────────────
  makeIdol("수호", "Suho", "EXO", "엑소", ["Leader", "Vocal"]),
  makeIdol("백현", "Baekhyun", "EXO", "엑소", ["Vocal"]),
  makeIdol("첸", "Chen", "EXO", "엑소", ["Vocal"]),
  makeIdol("찬열", "Chanyeol", "EXO", "엑소", ["Rapper", "Vocal"]),
  makeIdol("세훈", "Sehun", "EXO", "엑소", ["Dancer", "Maknae"]),
  makeIdol("카이", "Kai", "EXO", "엑소", ["Dancer", "Vocal"]),

  // ── NCT 127 ────────────────────────────────
  makeIdol("태용", "Taeyong", "NCT 127", "엔시티 127", ["Leader", "Rapper"]),
  makeIdol("쟈니", "Johnny", "NCT 127", "엔시티 127", ["Rapper"]),
  makeIdol("태일", "Taeil", "NCT 127", "엔시티 127", ["Vocal"]),
  makeIdol("유타", "Yuta", "NCT 127", "엔시티 127", ["Vocal", "Dancer"]),
  makeIdol("도영", "Doyoung", "NCT 127", "엔시티 127", ["Vocal"]),
  makeIdol("재현", "Jaehyun", "NCT 127", "엔시티 127", ["Vocal", "Visual"]),
  makeIdol("마크", "Mark", "NCT 127", "엔시티 127", ["Rapper"]),
  makeIdol("해찬", "Haechan", "NCT 127", "엔시티 127", ["Vocal"]),

  // ── ENHYPEN ────────────────────────────────
  makeIdol("희승", "Heeseung", "ENHYPEN", "엔하이픈", ["Vocal"], "/idols/heeseung.jpg"),
  makeIdol("제이", "Jay", "ENHYPEN", "엔하이픈", ["Rapper", "Vocal"]),
  makeIdol("제이크", "Jake", "ENHYPEN", "엔하이픈", ["Vocal"]),
  makeIdol("성훈", "Sunghoon", "ENHYPEN", "엔하이픈", ["Dancer", "Vocal"], "/idols/sunghoon.png"),
  makeIdol("선우", "Sunoo", "ENHYPEN", "엔하이픈", ["Vocal"], "/idols/sunoo.png"),
  makeIdol("정원", "Jungwon", "ENHYPEN", "엔하이픈", ["Leader", "Vocal"], "/idols/jungwon.png"),
  makeIdol("니키", "Ni-Ki", "ENHYPEN", "엔하이픈", ["Dancer", "Maknae"], "/idols/niki.png"),

  // ── ITZY ───────────────────────────────────
  makeIdol("예지", "Yeji", "ITZY", "있지", ["Leader", "Rapper"]),
  makeIdol("리아", "Lia", "ITZY", "있지", ["Vocal"]),
  makeIdol("류진", "Ryujin", "ITZY", "있지", ["Rapper", "Dancer"]),
  makeIdol("채령", "Chaeryeong", "ITZY", "있지", ["Vocal", "Dancer"]),
  makeIdol("유나", "Yuna", "ITZY", "있지", ["Vocal", "Maknae"]),

  // ── Red Velvet ─────────────────────────────
  makeIdol("아이린", "Irene", "Red Velvet", "레드벨벳", ["Leader", "Visual"], "/idols/irene.jpg"),
  makeIdol("슬기", "Seulgi", "Red Velvet", "레드벨벳", ["Vocal", "Dancer"], "/idols/seulgi.jpg"),
  makeIdol("웬디", "Wendy", "Red Velvet", "레드벨벳", ["Vocal"], "/idols/wendy.png"),
  makeIdol("조이", "Joy", "Red Velvet", "레드벨벳", ["Vocal"], "/idols/joy.jpg"),
  makeIdol("예리", "Yeri", "Red Velvet", "레드벨벳", ["Vocal", "Maknae"], "/idols/yeri.jpg"),

  // ── GOT7 ───────────────────────────────────
  makeIdol("제이비", "JB", "GOT7", "갓세븐", ["Leader", "Vocal"]),
  makeIdol("마크", "Mark", "GOT7", "갓세븐", ["Rapper"]),
  makeIdol("잭슨", "Jackson", "GOT7", "갓세븐", ["Rapper"]),
  makeIdol("진영", "Jinyoung", "GOT7", "갓세븐", ["Vocal"]),
  makeIdol("영재", "Youngjae", "GOT7", "갓세븐", ["Vocal"]),
  makeIdol("뱀뱀", "BamBam", "GOT7", "갓세븐", ["Rapper"]),
  makeIdol("유겸", "Yugyeom", "GOT7", "갓세븐", ["Vocal", "Dancer"]),

  // ── MONSTA X ───────────────────────────────
  makeIdol("셔누", "Shownu", "MONSTA X", "몬스타엑스", ["Vocal", "Visual"]),
  makeIdol("원호", "Wonho", "MONSTA X", "몬스타엑스", ["Vocal"]),
  makeIdol("민혁", "Minhyuk", "MONSTA X", "몬스타엑스", ["Vocal", "Rapper"]),
  makeIdol("기현", "Kihyun", "MONSTA X", "몬스타엑스", ["Vocal"]),
  makeIdol("형원", "Hyungwon", "MONSTA X", "몬스타엑스", ["Rapper", "Dancer"]),
  makeIdol("주헌", "Joohoney", "MONSTA X", "몬스타엑스", ["Rapper"]),
  makeIdol("아이엠", "I.M", "MONSTA X", "몬스타엑스", ["Rapper"]),
];

/* ============================================================================
   Tournament constants & helpers
   ============================================================================ */

const TOURNEY_SIZE = 64;
const TOTAL_ROUNDS = Math.log2(TOURNEY_SIZE); // 6
const STORAGE_KEY = "nolza_bias_picks_v1";
const SWIPE_THRESHOLD = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a 64-entry bracket where adjacent pairs (round-1 matchups) are
// always different groups, by round-robin across groups.
function buildBracket(): Idol[] {
  const byGroup = new Map<string, Idol[]>();
  for (const i of IDOLS) {
    if (!byGroup.has(i.group)) byGroup.set(i.group, []);
    byGroup.get(i.group)!.push(i);
  }
  for (const list of byGroup.values()) {
    // Shuffle within group so different members appear each playthrough
    list.splice(0, list.length, ...shuffle(list));
  }

  const bracket: Idol[] = [];
  while (bracket.length < TOURNEY_SIZE) {
    // Sort groups by remaining members descending — pick from the largest
    // first so big groups (TWICE, Stray Kids) don't bunch at the end.
    const queues = Array.from(byGroup.entries())
      .filter(([, l]) => l.length > 0)
      .sort((a, b) => b[1].length - a[1].length);
    if (queues.length === 0) break;

    let chosen: [string, Idol[]] | null = null;
    for (const q of queues) {
      const slot = bracket.length;
      const prevSameGroup = slot > 0 && bracket[slot - 1].group === q[0];
      const wouldBeSamePair = slot % 2 === 1 && bracket[slot - 1].group === q[0];
      if (wouldBeSamePair) continue;
      if (prevSameGroup) continue;
      chosen = q;
      break;
    }
    // If no group avoids both constraints, relax to just "no same first-round pair"
    if (!chosen) {
      for (const q of queues) {
        const slot = bracket.length;
        const wouldBeSamePair = slot % 2 === 1 && bracket[slot - 1].group === q[0];
        if (!wouldBeSamePair) {
          chosen = q;
          break;
        }
      }
    }
    if (!chosen) chosen = queues[0]; // last resort — shouldn't happen with 14 groups

    bracket.push(chosen[1].shift()!);
  }
  return bracket;
}

function avatarLetter(en: string): string {
  const first = en.replace(/[^A-Za-z0-9]/g, "")[0];
  return (first ?? "?").toUpperCase();
}

/* ============================================================================
   localStorage stats — tally champion picks across plays on this device
   ============================================================================ */

type Tally = Record<string, number>;

function loadTally(): Tally {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? (parsed as Tally) : {};
  } catch {
    return {};
  }
}

function saveTallyForChampion(champId: string): Tally {
  const t = loadTally();
  t[champId] = (t[champId] ?? 0) + 1;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  } catch {
    /* ignore quota */
  }
  return t;
}

function tallyPercentForChampion(t: Tally, champId: string): { pct: number; total: number } {
  const total = Object.values(t).reduce((a, b) => a + b, 0);
  if (total === 0) return { pct: 0, total: 0 };
  return { pct: Math.round(((t[champId] ?? 0) / total) * 100), total };
}

/* ============================================================================
   Avatar
   ============================================================================ */

function Avatar({
  idol,
  size,
  glow = false,
  dim = false,
}: {
  idol: Idol;
  size: number;
  glow?: boolean;
  dim?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${idol.color}, ${idol.color}cc 60%, ${idol.color}88)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-inter), sans-serif",
        fontWeight: 800,
        fontSize: Math.round(size * 0.42),
        color: "#fff",
        letterSpacing: "-0.02em",
        boxShadow: glow
          ? `0 0 0 3px ${ACCENT}, 0 0 36px ${ACCENT}aa, 0 0 80px ${ACCENT}66`
          : "0 8px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease, filter 0.25s ease",
        opacity: dim ? 0.35 : 1,
        filter: dim ? "saturate(0.5)" : "none",
        userSelect: "none",
      }}
    >
      {avatarLetter(idol.en)}
    </div>
  );
}

/* ============================================================================
   Idol side panel — full-height half of the matchup arena
   ============================================================================ */

function IdolSide({
  idol,
  side,
  flexBasis,
  onClick,
  onMouseEnter,
  onMouseLeave,
  picked,
  lost,
  disabled,
  locale,
}: {
  idol: Idol;
  side: "left" | "right";
  flexBasis: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  picked: boolean;
  lost: boolean;
  disabled: boolean;
  locale: "ko" | "en";
}): ReactElement {
  const [imgFailed, setImgFailed] = useState(false);
  // Reset image-failure state when the idol on this side changes between matches.
  useEffect(() => {
    setImgFailed(false);
  }, [idol.id]);

  const showFallback = imgFailed;

  // Pick animation: winner translates to viewport center + scales up briefly,
  // then fades out so the next match can fade in. Loser fades out simultaneously.
  const pickAnimation = picked
    ? side === "left"
      ? "biasPickLeft 0.6s ease forwards"
      : "biasPickRight 0.6s ease forwards"
    : lost
      ? "biasLose 0.4s ease forwards"
      : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      aria-label={`Choose ${idol.en}`}
      style={{
        position: "relative",
        height: "100svh",
        flex: `0 0 ${flexBasis}`,
        cursor: disabled ? "default" : "pointer",
        overflow: "hidden",
        border: "none",
        padding: 0,
        background: "#000",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        zIndex: picked ? 5 : 1,
        animation: pickAnimation,
      }}
    >
      {/* Image or gradient fallback */}
      {!showFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={idol.image}
          alt={idol.en}
          onError={() => setImgFailed(true)}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${idol.color}ee 0%, ${idol.color}88 50%, #000 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.18)",
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 900,
            fontSize: "min(28vw, 280px)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            userSelect: "none",
          }}
          aria-hidden
        >
          {avatarLetter(idol.en)}
        </div>
      )}

      {/* Top + bottom darken gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#fff",
          width: "100%",
          padding: "0 20px",
          boxSizing: "border-box",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <div
          className="bias-name"
          style={{
            fontFamily:
              locale === "ko"
                ? "var(--font-noto-sans-kr), sans-serif"
                : "var(--font-inter), sans-serif",
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          {locale === "ko" ? idol.ko : idol.en}
        </div>
        <div
          className="bias-group"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 20,
            opacity: 0.7,
            marginTop: 8,
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          {idol.group}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 6,
            marginTop: 14,
          }}
        >
          {idol.positions.map((p) => (
            <span
              key={p}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                letterSpacing: "0.12em",
                fontWeight: 700,
                textTransform: "uppercase",
                backdropFilter: "blur(6px)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/* ============================================================================
   Page
   ============================================================================ */

type Phase = "intro" | "playing" | "result";

type HistoryItem = {
  round: number;
  picked: Idol;
  lost: Idol;
};

function roundLabel(
  round: number,
  total: number,
  t: (ko: string, en: string) => string,
): string {
  const remaining = Math.pow(2, total - round + 1);
  if (remaining === 2) return t("결승", "Final");
  if (remaining === 4) return t("준결승", "Semi-Final");
  if (remaining === 8) return t("8강", "Quarter-Final");
  return t(`라운드 ${round} / ${total}`, `Round ${round} of ${total}`);
}

export default function BiasPage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [bracket, setBracket] = useState<Idol[]>([]);
  const [winners, setWinners] = useState<Idol[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [picked, setPicked] = useState<null | "left" | "right">(null);
  const [champion, setChampion] = useState<Idol | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stat, setStat] = useState<{ pct: number; total: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const startTournament = useCallback(() => {
    setBracket(buildBracket());
    setWinners([]);
    setMatchIndex(0);
    setRound(1);
    setPicked(null);
    setChampion(null);
    setHistory([]);
    setStat(null);
    setPhase("playing");
  }, []);

  const totalMatchesInRound = bracket.length / 2;

  const [left, right] =
    bracket.length >= 2 && matchIndex * 2 + 1 < bracket.length
      ? [bracket[matchIndex * 2], bracket[matchIndex * 2 + 1]]
      : [null, null];

  const handlePick = useCallback(
    (side: "left" | "right") => {
      if (picked !== null || !left || !right) return;
      setPicked(side);
      const winner = side === "left" ? left : right;
      const loser = side === "left" ? right : left;
      setHistory((h) => [...h, { round, picked: winner, lost: loser }]);

      advanceTimerRef.current = setTimeout(() => {
        const nextWinners = [...winners, winner];
        const isLastMatchInRound = matchIndex >= totalMatchesInRound - 1;

        if (isLastMatchInRound) {
          if (nextWinners.length === 1) {
            const champ = nextWinners[0];
            setChampion(champ);
            const tally = saveTallyForChampion(champ.id);
            setStat(tallyPercentForChampion(tally, champ.id));
            setPhase("result");
            return;
          }
          setBracket(nextWinners);
          setWinners([]);
          setMatchIndex(0);
          setRound((r) => r + 1);
        } else {
          setWinners(nextWinners);
          setMatchIndex((i) => i + 1);
        }
        setPicked(null);
      }, 600);
    },
    [picked, left, right, winners, matchIndex, totalMatchesInRound, round],
  );

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "1") handlePick("left");
      else if (e.key === "ArrowRight" || e.key === "2") handlePick("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handlePick]);

  const progressPct = useMemo(() => {
    if (phase !== "playing") return 0;
    let totalMatchesAll = 0;
    let matchesDone = 0;
    let size = TOURNEY_SIZE;
    for (let r = 1; r <= TOTAL_ROUNDS; r++) {
      const matchesThisRound = size / 2;
      totalMatchesAll += matchesThisRound;
      if (r < round) matchesDone += matchesThisRound;
      else if (r === round) matchesDone += matchIndex;
      size = matchesThisRound;
    }
    return Math.round((matchesDone / totalMatchesAll) * 100);
  }, [phase, round, matchIndex]);

  // Touch swipe handlers (left swipe → pick left; right swipe → pick right)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartXRef.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      touchStartXRef.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      handlePick(dx < 0 ? "left" : "right");
    },
    [handlePick],
  );

  const onShare = async () => {
    if (!champion) return;
    const text = t(
      `나의 K팝 최애는 ${champion.ko} (${champion.group})!\n` +
        `당신의 최애는? → nolza.fun/games/bias`,
      `My Ultimate K-pop Bias is ${champion.en} (${champion.group})!\n` +
        `Who's yours? → nolza.fun/games/bias`,
    );
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      style={{
        minHeight: "100svh",
        background: BG,
        color: "#fff",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr), sans-serif",
        position: "relative",
        paddingBottom: 100,
      }}
    >
      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
        }}
      >
        ←
      </Link>
      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        {phase === "intro" && <IntroView onStart={startTournament} t={t} />}

        {phase === "playing" && left && right && (
          <PlayingView
            round={round}
            roundLabelText={roundLabel(round, TOTAL_ROUNDS, t)}
            t={t}
            locale={locale}
            matchIndex={matchIndex}
            totalMatchesInRound={totalMatchesInRound}
            progressPct={progressPct}
            left={left}
            right={right}
            picked={picked}
            onPick={handlePick}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        )}

        {phase === "result" && champion && (
          <ResultView
            champion={champion}
            stat={stat}
            history={history}
            onRestart={startTournament}
            onShare={onShare}
            copied={copied}
            t={t}
            locale={locale}
          />
        )}
      </div>

      {phase !== "playing" && <AdMobileSticky />}
    </main>
  );
}

/* ============================================================================
   Intro view
   ============================================================================ */

function IntroView({ onStart, t }: { onStart: () => void; t: (ko: string, en: string) => string }): ReactElement {
  return (
    <div style={{ maxWidth: 460, textAlign: "center" }}>
      <div
        style={{
          color: ACCENT,
          fontSize: 13,
          letterSpacing: "0.32em",
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        {t("K팝 최애 토너먼트", "K-POP BIAS TOURNAMENT")}
      </div>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {t("나의 Ultimate Bias 찾기", "Find Your Ultimate Bias")}
      </h1>
      <p
        style={{
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
          fontSize: 17,
          color: "rgba(255,255,255,0.65)",
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        {t("누가 당신의 최애인가요?", "Who's your bias?")}
      </p>
      <p
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 40,
          lineHeight: 1.7,
        }}
      >
        {t("64명 · 6라운드 · 한 명의 승자", "64 idols · 6 rounds · one winner")}
        <br />
        <span style={{ fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
          {t(
            "매 라운드 둘 중 한 명만 살아남습니다",
            "Only one survives each round",
          )}
        </span>
      </p>
      <button
        type="button"
        onClick={onStart}
        style={{
          background: ACCENT,
          color: "#fff",
          border: "none",
          padding: "16px 44px",
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.2em",
          cursor: "pointer",
          touchAction: "manipulation",
          boxShadow: "0 8px 28px rgba(255,45,120,0.35)",
        }}
      >
        {t("시작", "START")}
      </button>
    </div>
  );
}

/* ============================================================================
   Playing view
   ============================================================================ */

function PlayingView({
  round,
  roundLabelText,
  matchIndex,
  totalMatchesInRound,
  left,
  right,
  picked,
  onPick,
  onTouchStart,
  onTouchEnd,
  locale,
}: {
  round: number;
  roundLabelText: string;
  matchIndex: number;
  totalMatchesInRound: number;
  progressPct: number;
  left: Idol;
  right: Idol;
  picked: null | "left" | "right";
  onPick: (side: "left" | "right") => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const isAnimating = picked !== null;
  // Both sides stay at 50/50; pick animation is handled by transform on the
  // picked side (move to center + scale + fade) and opacity on the loser side.
  const leftBasis = "50vw";
  const rightBasis = "50vw";

  return (
    <div
      key={`${round}-${matchIndex}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        overflow: "hidden",
        zIndex: 1,
        animation: "biasFadeIn 0.45s ease",
      }}
    >
      {/* ROUND label — top center */}
      <div
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 15,
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.6)",
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 700,
          textTransform: "uppercase",
          zIndex: 30,
          textAlign: "center",
          pointerEvents: "none",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        {roundLabelText}
        <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
        {matchIndex + 1} / {totalMatchesInRound}
      </div>

      {/* Left side */}
      <IdolSide
        idol={left}
        side="left"
        flexBasis={leftBasis}
        onClick={() => onPick("left")}
        onMouseEnter={() => undefined}
        onMouseLeave={() => undefined}
        picked={picked === "left"}
        lost={picked === "right"}
        disabled={isAnimating}
        locale={locale}
      />

      {/* Center VS — hidden once a side is picked so it doesn't sit over the sweep */}
      {!isAnimating && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.04em",
            zIndex: 10,
            pointerEvents: "none",
            textShadow:
              "0 4px 24px rgba(0,0,0,0.7), 0 0 60px rgba(255,45,120,0.4)",
            userSelect: "none",
          }}
          aria-hidden
        >
          VS
        </div>
      )}

      {/* Right side */}
      <IdolSide
        idol={right}
        side="right"
        flexBasis={rightBasis}
        onClick={() => onPick("right")}
        onMouseEnter={() => undefined}
        onMouseLeave={() => undefined}
        picked={picked === "right"}
        lost={picked === "left"}
        disabled={isAnimating}
        locale={locale}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes biasFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Winner: translate horizontally to viewport center, scale up slightly,
   hold briefly, then fade. Each side is 50vw so a 50% self-translate centers it. */
@keyframes biasPickLeft {
  0%   { transform: translateX(0) scale(1);    opacity: 1; filter: brightness(1); }
  35%  { transform: translateX(50%) scale(1.06); opacity: 1; filter: brightness(1.12); }
  70%  { transform: translateX(50%) scale(1.06); opacity: 1; filter: brightness(1.12); }
  100% { transform: translateX(50%) scale(1.06); opacity: 0; filter: brightness(1.12); }
}
@keyframes biasPickRight {
  0%   { transform: translateX(0) scale(1);     opacity: 1; filter: brightness(1); }
  35%  { transform: translateX(-50%) scale(1.06); opacity: 1; filter: brightness(1.12); }
  70%  { transform: translateX(-50%) scale(1.06); opacity: 1; filter: brightness(1.12); }
  100% { transform: translateX(-50%) scale(1.06); opacity: 0; filter: brightness(1.12); }
}
@keyframes biasLose {
  to { opacity: 0; }
}
@media (max-width: 640px) {
  .bias-name { font-size: 30px !important; }
  .bias-group { font-size: 14px !important; }
}
`,
        }}
      />
    </div>
  );
}

/* ============================================================================
   Result view
   ============================================================================ */

function ResultView({
  champion,
  stat,
  history,
  onRestart,
  onShare,
  copied,
  t,
  locale,
}: {
  champion: Idol;
  stat: { pct: number; total: number } | null;
  history: HistoryItem[];
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [showHistory, setShowHistory] = useState(false);
  const fandom = G_FANDOM[champion.group] ?? "fan";

  return (
    <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
      <div
        style={{
          color: ACCENT,
          fontSize: 13,
          letterSpacing: "0.32em",
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        🏆  {t("당신의 ULTIMATE BIAS", "YOUR ULTIMATE BIAS")}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <Avatar idol={champion} size={180} glow />
      </div>

      <div
        style={{
          fontFamily: locale === "ko"
            ? "var(--font-noto-sans-kr), sans-serif"
            : "var(--font-inter), sans-serif",
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          color: "#fff",
        }}
      >
        {locale === "ko" ? champion.ko : champion.en}
      </div>
      <div
        style={{
          fontFamily: locale === "ko"
            ? "var(--font-inter), sans-serif"
            : "var(--font-noto-sans-kr), sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.6)",
          marginTop: 6,
        }}
      >
        {locale === "ko" ? champion.en : champion.ko}
      </div>
      <div
        style={{
          color: champion.color,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.2em",
          marginTop: 14,
          textTransform: "uppercase",
        }}
      >
        {champion.group}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 6,
          marginTop: 16,
        }}
      >
        {champion.positions.map((p) => (
          <span
            key={p}
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "4px 10px",
              borderRadius: 999,
              letterSpacing: "0.05em",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <p
        style={{
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
          marginTop: 32,
          fontSize: 15,
          color: "#fff",
          lineHeight: 1.6,
        }}
      >
        {locale === "ko" ? (
          <>
            당신은 진정한 <span style={{ color: ACCENT, fontWeight: 700 }}>{fandom}</span>이군요!
          </>
        ) : (
          <>
            You're a true <span style={{ color: ACCENT, fontWeight: 700 }}>{fandom}</span>!
          </>
        )}
      </p>

      {stat && stat.total > 1 && (
        <p
          style={{
            fontFamily: "var(--font-noto-sans-kr), sans-serif",
            marginTop: 8,
            fontSize: 15,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
          }}
        >
          {locale === "ko" ? (
            <>
              이 기기 플레이 {stat.total}회 중{" "}
              <span style={{ color: ACCENT, fontWeight: 700 }}>{stat.pct}%</span>가 같은 선택을 했어요
            </>
          ) : (
            <>
              <span style={{ color: ACCENT, fontWeight: 700 }}>{stat.pct}%</span> of {stat.total} plays on this device picked the same
            </>
          )}
        </p>
      )}
      {stat && stat.total === 1 && (
        <p
          style={{
            fontFamily: "var(--font-noto-sans-kr), sans-serif",
            marginTop: 8,
            fontSize: 15,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
          }}
        >
          {t("첫 플레이! 다시 도전해서 통계를 쌓아보세요.", "First play! Try again to build stats.")}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onShare}
          style={{
            background: ACCENT,
            color: "#fff",
            border: "none",
            padding: "14px 30px",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.18em",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          {copied ? t("✓ 복사됨", "COPIED") : t("공유하기", "SHARE")}
        </button>
        <button
          type="button"
          onClick={onRestart}
          style={{
            background: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "14px 30px",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.18em",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          {t("다시 하기", "PLAY AGAIN")}
        </button>
      </div>

      {/* History toggle */}
      <button
        type="button"
        onClick={() => setShowHistory((s) => !s)}
        style={{
          marginTop: 28,
          background: "transparent",
          color: "rgba(255,255,255,0.55)",
          border: "none",
          fontSize: 14,
          letterSpacing: "0.15em",
          cursor: "pointer",
          textTransform: "uppercase",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {showHistory
          ? `▲ ${t("선택 기록 숨기기", "Hide your picks")}`
          : `▼ ${t("선택 기록 보기", "See your picks")}`}
      </button>

      {showHistory && (
        <div
          style={{
            marginTop: 14,
            textAlign: "left",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "14px 16px",
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          {[...history].reverse().map((h, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto 1fr",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom:
                  i === history.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                fontSize: 14,
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
              >
                R{h.round}
              </span>
              <span style={{ color: ACCENT, fontWeight: 700 }}>
                {locale === "ko" ? h.picked.ko : h.picked.en}{" "}
                <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 13 }}>
                  {locale === "ko" ? h.picked.en : h.picked.ko}
                </span>
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 13,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                vs
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "line-through",
                  textDecorationThickness: 1,
                }}
              >
                {locale === "ko" ? h.lost.ko : h.lost.en}{" "}
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  {locale === "ko" ? h.lost.en : h.lost.ko}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
