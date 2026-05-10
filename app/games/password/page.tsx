"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type T = (ko: string, en: string) => string;
type RuleContext = {
  currentMonth: number;
  currentMinute: number;
  seoulTemp: number | null;
  weekdayKo: string; // 월/화/수/목/금/토/일
  weekdayEn: string;
  minLengthBoost: number; // adds to rule 15's min-length over time
  pw: string;
  t: T;
};
type Rule = {
  id: number;
  title: (ctx: RuleContext) => string;
  test: (pw: string, ctx: RuleContext) => boolean;
};

const KOREAN_REGEX = /[ᄀ-ᇿ㄰-㆏ꥠ-꥿가-힯ힰ-퟿]/;
const SPECIAL_REGEX = /[~!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>?\/`]/;
const ROMAN_REGEX = /[IVXⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ]/;
const HANJA_REGEX = /[㐀-䶿一-鿿]/;
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;
const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;

const EMOJI_PALETTE = ["😂","😭","🔥","💀","🍗","🐶","🎉","❤️","👍","😎","🤔","😅","🙏","💪","🍕","🍺","🎵","💯","👀","🌙"];
const HANJA_PALETTE = ["韓","國","人","山","水","火","木","金","土","日","月","大","小","上","下","一","二","三","四","五","六","七","八","九","十","甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const ROMAN_PALETTE = ["Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ"];
const CONFETTI_COLORS = ["#00ff88", "#34C759", "#9BC53D", "#A4E869", "#16C172", "#5DD693"];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}
function digitSum(s: string): number {
  return (s.match(/\d/g) ?? []).reduce((a, d) => a + Number(d), 0);
}
function chickenAtOddOnly(s: string): boolean {
  const chars = Array.from(s);
  let found = false;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "🍗") {
      found = true;
      if ((i + 1) % 2 === 0) return false;
    }
  }
  return found;
}

const NUMERIC_HANJA: Record<string, number> = {
  "一": 1, "二": 2, "三": 3, "四": 4, "五": 5,
  "六": 6, "七": 7, "八": 8, "九": 9, "十": 10,
};
function sumNumericHanja(s: string): number {
  let sum = 0;
  for (const ch of Array.from(s)) {
    const v = NUMERIC_HANJA[ch];
    if (v !== undefined) sum += v;
  }
  return sum;
}

// Limited to I–X (matches rule 11's "(I-X)" framing) plus Unicode Ⅰ–Ⅻ.
// L/C/D/M are intentionally excluded so common ASCII letters in passwords
// (e.g. "D" in "1D$") don't silently inflate the sum.
const ROMAN_VALUES: Record<string, number> = {
  // ASCII
  "I": 1, "V": 5, "X": 10,
  // Unicode Roman numeral block (U+2160–U+216F)
  "Ⅰ": 1, "Ⅱ": 2, "Ⅲ": 3, "Ⅳ": 4, "Ⅴ": 5,
  "Ⅵ": 6, "Ⅶ": 7, "Ⅷ": 8, "Ⅸ": 9, "Ⅹ": 10,
  "Ⅺ": 11, "Ⅻ": 12, "Ⅼ": 50, "Ⅽ": 100, "Ⅾ": 500, "Ⅿ": 1000,
};
function sumRomanChars(s: string): number {
  let sum = 0;
  for (const ch of Array.from(s)) {
    const v = ROMAN_VALUES[ch];
    if (v !== undefined) sum += v;
  }
  return sum;
}

function allEmojisDistinct(s: string): boolean {
  // Find emojis as Extended_Pictographic, ignore variation selectors / ZWJ for de-dup.
  const matches = s.match(/\p{Extended_Pictographic}/gu) ?? [];
  if (matches.length === 0) return true; // vacuously true; rule 8 enforces presence separately
  const seen = new Set<string>();
  for (const e of matches) {
    if (seen.has(e)) return false;
    seen.add(e);
  }
  return true;
}

function allHanjaDistinct(s: string): boolean {
  const matches = s.match(/[㐀-䶿一-鿿]/g) ?? [];
  if (matches.length === 0) return true; // rule 12 enforces presence
  const seen = new Set<string>();
  for (const c of matches) {
    if (seen.has(c)) return false;
    seen.add(c);
  }
  return true;
}

const FIB_SET = new Set([5, 8, 13, 21, 34, 55, 89, 144, 233]);
function isFib(n: number): boolean { return FIB_SET.has(n); }

function digitsOnly(s: string): string {
  return (s.match(/\d/g) ?? []).join("");
}
function isPalindrome(s: string): boolean {
  if (s.length < 2) return false;
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}

const HANGUL_SYL_REGEX = /[가-힣]/g;
const HANJA_ANY_REGEX = /[㐀-䶿一-鿿]/g;
function countHangulSyllables(s: string): number {
  return (s.match(HANGUL_SYL_REGEX) ?? []).length;
}
function countHanjaChars(s: string): number {
  return (s.match(HANJA_ANY_REGEX) ?? []).length;
}

const CHEONGAN_SET = new Set(["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]);
function countCheongan(s: string): number {
  let n = 0;
  for (const ch of Array.from(s)) if (CHEONGAN_SET.has(ch)) n++;
  return n;
}

// Decompose Hangul syllable -> jungseong (vowel) index 0-20.
function jungseongOf(ch: string): number | null {
  const code = ch.codePointAt(0);
  if (code === undefined) return null;
  if (code < 0xac00 || code > 0xd7a3) return null;
  const sIndex = code - 0xac00;
  return Math.floor((sIndex % (21 * 28)) / 28);
}
function distinctHangulVowels(s: string): number {
  const seen = new Set<number>();
  for (const ch of Array.from(s)) {
    const v = jungseongOf(ch);
    if (v !== null) seen.add(v);
  }
  return seen.size;
}

function countSubstring(s: string, sub: string): number {
  if (!sub) return 0;
  let n = 0;
  let i = 0;
  while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; }
  return n;
}
function distinctChars(s: string): number {
  return new Set(Array.from(s)).size;
}

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const RULES: Rule[] = [
  { id: 1, title: ({ t }) => t("5자 이상", "Min 5 characters"), test: (pw) => Array.from(pw).length >= 5 },
  { id: 2, title: ({ t }) => t("숫자 포함", "Include a number"), test: (pw) => DIGIT_REGEX.test(pw) },
  { id: 3, title: ({ t }) => t("대문자 포함", "Include uppercase"), test: (pw) => UPPERCASE_REGEX.test(pw) },
  { id: 4, title: ({ t }) => t("특수문자 포함", "Include special character"), test: (pw) => SPECIAL_REGEX.test(pw) },
  { id: 5, title: ({ t }) => t("한글 포함", "Include Korean character"), test: (pw) => KOREAN_REGEX.test(pw) },
  { id: 6, title: ({ t, pw }) => { const s = digitSum(pw); return t(`숫자 합이 10의 배수 — 현재 ${s}`, `Digits must sum to a multiple of 10 — currently ${s}`); }, test: (pw) => { const s = digitSum(pw); return s > 0 && s % 10 === 0; } },
  { id: 7, title: ({ t, currentMonth }) => t(`현재 월(${currentMonth}) 포함`, `Include current month (${currentMonth})`), test: (pw, ctx) => pw.includes(String(ctx.currentMonth)) },
  { id: 8, title: ({ t }) => t("이모지 포함", "Include an emoji"), test: (pw) => EMOJI_REGEX.test(pw) },
  { id: 9, title: ({ t }) => t('"갓생" 포함', 'Include "갓생"'), test: (pw) => pw.includes("갓생") },
  { id: 10, title: ({ t }) => t("글자수 소수", "Length must be prime"), test: (pw) => isPrime(Array.from(pw).length) },
  { id: 11, title: ({ t }) => t("로마숫자 포함 (I-X)", "Include Roman numeral (I-X)"), test: (pw) => ROMAN_REGEX.test(pw) },
  { id: 12, title: ({ t }) => t("한자 포함", "Include Chinese character"), test: (pw) => HANJA_REGEX.test(pw) },
  { id: 13, title: ({ t, seoulTemp }) => seoulTemp === null ? t("서울 기온 로딩 중...", "Loading Seoul temp...") : t(`서울 기온(${seoulTemp}°C) 포함`, `Include current Seoul temp (${seoulTemp}°C)`), test: (pw, ctx) => ctx.seoulTemp !== null && pw.includes(String(ctx.seoulTemp)) },
  { id: 14, title: ({ t }) => t("🍗 홀수 자리에", "🍗 only at odd positions"), test: (pw) => chickenAtOddOnly(pw) },
  { id: 15, title: ({ t, minLengthBoost }) => { const min = 17 + minLengthBoost; return t(`${min}자 이상`, `Min ${min} characters`); }, test: (pw, ctx) => Array.from(pw).length >= 17 + ctx.minLengthBoost },

  // ─── Demonic tier ──────────────────────────────────────────────────────
  { id: 16, title: ({ t, pw }) => { const s = sumNumericHanja(pw); return t(`한자 숫자(一=1 … 十=10)들의 합이 7 — 현재 ${s}`, `Hanja digits (一=1 … 十=10) must sum to 7 — currently ${s}`); }, test: (pw) => sumNumericHanja(pw) === 7 },
  { id: 17, title: ({ t }) => t("모든 이모지가 서로 다름", "All emojis must be distinct"), test: (pw) => allEmojisDistinct(pw) },
  { id: 18, title: ({ t, weekdayKo, weekdayEn }) => t(`오늘 요일 한글(${weekdayKo}) 포함`, `Include today's day-of-week in Korean (${weekdayKo} = ${weekdayEn})`), test: (pw, ctx) => pw.includes(ctx.weekdayKo) },
  { id: 19, title: ({ t }) => t("세종대왕 즉위년(1418) 포함", "Include the year King Sejong took the throne (1418)"), test: (pw) => pw.includes("1418") },
  { id: 20, title: ({ t, pw }) => { const s = sumRomanChars(pw); return t(`로마숫자 합 = 12 — 현재 ${s}`, `Roman numerals must sum to 12 — currently ${s}`); }, test: (pw) => sumRomanChars(pw) === 12 },
  { id: 21, title: ({ t }) => t("모든 한자가 서로 다름", "All Hanja must be distinct"), test: (pw) => allHanjaDistinct(pw) },

  // ─── Demonic+ tier (live mechanics activate at this point) ─────────────
  { id: 22, title: ({ t, currentMinute }) => t(`현재 시각의 분(${currentMinute}) 포함 — 매 분 갱신`, `Include the current minute (${currentMinute}) — refreshes every minute`), test: (pw, ctx) => pw.includes(String(ctx.currentMinute)) },
  { id: 23, title: ({ t, pw }) => { const n = Array.from(pw).length; return t(`글자수가 피보나치 (5·8·13·21·34·55·89) — 현재 ${n}`, `Length must be Fibonacci (5/8/13/21/34/55/89) — currently ${n}`); }, test: (pw) => isFib(Array.from(pw).length) },
  { id: 24, title: ({ t, pw }) => { const k = countHangulSyllables(pw); const h = countHanjaChars(pw); return t(`한글 음절 수 = 한자 글자 수 — 현재 한글 ${k} / 한자 ${h}`, `Hangul syllables = Hanja chars — currently Hangul ${k} / Hanja ${h}`); }, test: (pw) => countHangulSyllables(pw) === countHanjaChars(pw) && countHangulSyllables(pw) > 0 },
  { id: 25, title: ({ t, pw }) => { const c = countCheongan(pw); return t(`사주 천간(甲乙丙丁戊己庚辛壬癸) 정확히 2개 — 현재 ${c}`, `Exactly 2 cheongan (甲乙丙丁戊己庚辛壬癸) — currently ${c}`); }, test: (pw) => countCheongan(pw) === 2 },
  { id: 26, title: ({ t, pw }) => { const d = digitsOnly(pw); return t(`숫자만 뽑았을 때 회문 (앞뒤 똑같이) — 현재 "${d || "(없음)"}"`, `Digits-only must be palindrome — currently "${d || "(none)"}"`); }, test: (pw) => isPalindrome(digitsOnly(pw)) },
  { id: 27, title: ({ t, pw }) => { const n = countSubstring(pw, "갓"); return t(`"갓" 글자가 정확히 1개 — 현재 ${n}`, `"갓" must appear exactly once — currently ${n}`); }, test: (pw) => countSubstring(pw, "갓") === 1 },
  { id: 28, title: ({ t, pw }) => { const d = distinctChars(pw); return t(`서로 다른 글자 종류 ≥ 22개 — 현재 ${d}`, `Distinct character types ≥ 22 — currently ${d}`); }, test: (pw) => distinctChars(pw) >= 22 },
  { id: 29, title: ({ t, pw }) => { const v = distinctHangulVowels(pw); return t(`한글 모음 종류 ≥ 6 (음절의 중성 기준) — 현재 ${v}`, `Distinct Hangul vowels ≥ 6 — currently ${v}`); }, test: (pw) => distinctHangulVowels(pw) >= 6 },
  { id: 30, title: ({ t }) => t("🔥 포함 — 8초마다 왼쪽 글자 1개를 먹어치움", "Include 🔥 — eats one leftmost char every 8 seconds"), test: (pw) => pw.includes("🔥") },
];

const EMOJI_RULE = 7, ROMAN_RULE = 10, HANJA_RULE = 11;

function Confetti() {
  const pieces = useMemo(
    () => Array.from({ length: 100 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.6 + Math.random() * 2.4,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 5 + Math.random() * 7,
    })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size * 0.4,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function Palette({ items, dimmed, onSelect }: {
  items: string[]; dimmed: boolean; onSelect: (s: string) => void;
}) {
  return (
    <div
      className={`palette-enter mt-3 flex flex-wrap gap-1 transition-opacity ${
        dimmed ? "opacity-40" : ""
      }`}
    >
      {items.map((it, i) => (
        <button
          key={`${i}-${it}`}
          type="button"
          onClick={() => onSelect(it)}
          className="rounded transition-colors"
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            color: "#c9d1d9",
            padding: "6px 10px",
            fontSize: 16,
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

export default function PasswordGame() {
  const { t } = useLocale();
  const [pw, setPw] = useState("");
  const [revealed, setRevealed] = useState(1);
  const [seoulTemp, setSeoulTemp] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(() => new Date().getMinutes());
  const [minLengthBoost, setMinLengthBoost] = useState(0);
  const [demonLog, setDemonLog] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const pendingCursor = useRef<number | null>(null);
  const pwRef = useRef(pw);
  useEffect(() => { pwRef.current = pw; }, [pw]);
  const revealedRef = useRef(revealed);
  useEffect(() => { revealedRef.current = revealed; }, [revealed]);

  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  const weekdayKo = useMemo(() => WEEKDAYS_KO[new Date().getDay()], []);
  const weekdayEn = useMemo(() => WEEKDAYS_EN[new Date().getDay()], []);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.978&current=temperature_2m")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const t = data?.current?.temperature_2m;
        if (typeof t === "number") setSeoulTemp(Math.round(t));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Tick currentMinute every 5s so rule 22 stays in sync.
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentMinute(new Date().getMinutes());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // 🔥 fire eats the leftmost non-fire char every 8 seconds, once rule 30 is unlocked.
  useEffect(() => {
    const id = setInterval(() => {
      if (revealedRef.current < 30) return;
      const cur = pwRef.current;
      if (!cur.includes("🔥")) return;
      const arr = Array.from(cur);
      // Find first non-🔥 char to delete.
      const idx = arr.findIndex((ch) => ch !== "🔥");
      if (idx === -1) return;
      const removed = arr.splice(idx, 1)[0];
      setPw(arr.join(""));
      setDemonLog(`🔥 ate "${removed}"`);
      setTimeout(() => setDemonLog((m) => (m === `🔥 ate "${removed}"` ? null : m)), 1800);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // 🍗 chicken walks one position to the right every 5 seconds, once rule 22 is unlocked.
  useEffect(() => {
    const id = setInterval(() => {
      if (revealedRef.current < 22) return;
      const cur = pwRef.current;
      const arr = Array.from(cur);
      const idx = arr.findIndex((ch) => ch === "🍗");
      if (idx === -1 || idx >= arr.length - 1) return;
      // Swap with next char.
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      setPw(arr.join(""));
      setDemonLog("🍗 walked right");
      setTimeout(() => setDemonLog((m) => (m === "🍗 walked right" ? null : m)), 1500);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Min length grows by +1 every 60s once rule 23 is unlocked.
  useEffect(() => {
    const id = setInterval(() => {
      if (revealedRef.current < 23) return;
      setMinLengthBoost((b) => b + 1);
      setDemonLog("📏 min length +1");
      setTimeout(() => setDemonLog((m) => (m === "📏 min length +1" ? null : m)), 2000);
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const ctx: RuleContext = useMemo(
    () => ({ currentMonth, currentMinute, seoulTemp, weekdayKo, weekdayEn, minLengthBoost, pw, t }),
    [currentMonth, currentMinute, seoulTemp, weekdayKo, weekdayEn, minLengthBoost, pw, t],
  );

  useEffect(() => {
    if (revealed >= RULES.length) return;
    if (RULES[revealed - 1].test(pw, ctx)) {
      setRevealed((r) => Math.min(r + 1, RULES.length));
    }
  }, [pw, revealed, ctx]);

  useLayoutEffect(() => {
    if (pendingCursor.current !== null && taRef.current) {
      const pos = pendingCursor.current;
      taRef.current.focus();
      taRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  }, [pw]);

  const insertAtCursor = (text: string) => {
    const ta = taRef.current;
    if (!ta) { setPw((p) => p + text); return; }
    const start = ta.selectionStart ?? pw.length;
    const end = ta.selectionEnd ?? pw.length;
    const newValue = pw.slice(0, start) + text + pw.slice(end);
    pendingCursor.current = start + text.length;
    setPw(newValue);
  };

  const visible = RULES.slice(0, revealed);
  const passed = visible.filter((r) => r.test(pw, ctx)).length;
  const won = revealed === RULES.length && passed === visible.length;

  const handleShare = async () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://nolza.fun";
    const url = `${origin}/games/password`;
    const text = won
      ? t(
          `놀자.fun 비밀번호 게임 깨버림! ${RULES.length}개 규칙 다 통과 ${Array.from(pw).length}자\n${url}`,
          `Beat the nolza.fun password game! All ${RULES.length} rules, ${Array.from(pw).length} chars\n${url}`,
        )
      : t(
          `놀자.fun 비밀번호 게임 도전 중 — ${passed}/${revealed} 통과. 너도 해봐\n${url}`,
          `Stuck on the nolza.fun password game — ${passed}/${revealed} rules. Your turn\n${url}`,
        );
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { share?: unknown }).share === "function"
      ) {
        await (
          navigator as Navigator & {
            share: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
          }
        ).share({
          title: t("놀자.fun 비밀번호 게임", "nolza.fun password game"),
          text: won
            ? t(
                `${RULES.length}개 규칙 다 통과! ${Array.from(pw).length}자`,
                `All ${RULES.length} rules · ${Array.from(pw).length} chars`,
              )
            : t(
                `${passed}/${revealed} 통과 — 너도 해봐`,
                `${passed}/${revealed} rules · your turn`,
              ),
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const showEmoji = revealed >= EMOJI_RULE + 1;
  const showRoman = revealed >= ROMAN_RULE + 1;
  const showHanja = revealed >= HANJA_RULE + 1;

  return (
    <main
      className="min-h-screen page-in"
      style={{
        backgroundColor: "#0d1117",
        color: "#c9d1d9",
        fontFamily: "var(--font-jetbrains)",
      }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home" style={{ color: "#8b949e" }}>
        ←
      </Link>
      {won && <Confetti />}

      <div className="mx-auto max-w-5xl px-5 pt-16 md:px-8">
        <AdTop />
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-32 md:px-8">
        <h1
          className="text-center"
          style={{ fontSize: 16, color: "#7d8590", letterSpacing: "0.2em" }}
        >
          $ password-game
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr,360px]">
          <section>
            <div
              className="rounded-md"
              style={{
                background: "#010409",
                border: "1px solid #30363d",
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#7d8590",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                ~/password ▸ input
              </div>
              <textarea
                ref={taRef}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                rows={3}
                spellCheck={false}
                autoComplete="off"
                placeholder={t("비밀번호를 입력하세요...", "Enter a password...")}
                className="w-full resize-none outline-none"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#00ff88",
                  fontSize: 18,
                  fontFamily: "var(--font-jetbrains)",
                  caretColor: "#00ff88",
                }}
              />
              <div
                style={{ fontSize: 13, color: "#484f58", marginTop: 6 }}
              >
                {Array.from(pw).length} {t("자", "chars")} · {passed}/{RULES.length} {t("통과", "passed")}
              </div>
              {demonLog && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "6px 10px",
                    background: "rgba(255,80,80,0.12)",
                    border: "1px solid rgba(255,80,80,0.4)",
                    borderRadius: 6,
                    color: "#ff8b8b",
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    display: "inline-block",
                  }}
                >
                  {demonLog}
                </div>
              )}
            </div>

            {showEmoji && (
              <Palette
                items={EMOJI_PALETTE}
                dimmed={RULES[EMOJI_RULE].test(pw, ctx)}
                onSelect={insertAtCursor}
              />
            )}
            {showRoman && (
              <Palette
                items={ROMAN_PALETTE}
                dimmed={RULES[ROMAN_RULE].test(pw, ctx)}
                onSelect={insertAtCursor}
              />
            )}
            {showHanja && (
              <Palette
                items={HANJA_PALETTE}
                dimmed={RULES[HANJA_RULE].test(pw, ctx)}
                onSelect={insertAtCursor}
              />
            )}

            {won && (
              <div
                className="mt-6 rounded-md fade-in"
                style={{
                  background: "#0d1f15",
                  border: "1px solid #00ff88",
                  padding: 16,
                  color: "#00ff88",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span>
                  ✓ {t(`모든 ${RULES.length}개 규칙 통과 · 비밀번호 완성!`, `ALL ${RULES.length} RULES PASSED · COMPILED SUCCESSFULLY`)}
                </span>
                <button
                  onClick={handleShare}
                  style={{
                    padding: "6px 14px",
                    background: "transparent",
                    border: "1px solid #00ff88",
                    borderRadius: 6,
                    color: "#00ff88",
                    fontFamily: "inherit",
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "background 120ms, color 120ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#00ff88";
                    e.currentTarget.style.color = "#0d1f15";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#00ff88";
                  }}
                >
                  {copied ? t("복사됨", "Copied") : t("자랑하기 →", "Share →")}
                </button>
              </div>
            )}
          </section>

          <aside>
            <div
              style={{
                fontSize: 13,
                color: "#7d8590",
                letterSpacing: "0.1em",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span>
                # {t("규칙", "rules")}{" "}
                <span style={{ color: "#3fb950" }}>{passed}</span>
                <span style={{ color: "#30363d" }}>/</span>
                <span style={{ color: "#7d8590" }}>{revealed}</span>
                <span style={{ color: "#30363d" }}> · {RULES.length}</span>
              </span>
              {!won && revealed >= 5 && (
                <button
                  onClick={handleShare}
                  title={t("공유하기", "Share")}
                  style={{
                    padding: "3px 10px",
                    background: "transparent",
                    border: "1px solid #30363d",
                    borderRadius: 4,
                    color: "#7d8590",
                    fontFamily: "inherit",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "border-color 120ms, color 120ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#7d8590";
                    e.currentTarget.style.color = "#c9d1d9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#30363d";
                    e.currentTarget.style.color = "#7d8590";
                  }}
                >
                  {copied ? t("복사됨", "copied") : t("공유", "share")}
                </button>
              )}
            </div>
            <ul className="flex flex-col gap-1">
              {visible.slice().reverse().map((rule) => {
                const ok = rule.test(pw, ctx);
                return (
                  <li
                    key={rule.id}
                    className="palette-enter rounded-md"
                    style={{
                      padding: "8px 12px",
                      fontSize: 15,
                      color: ok ? "#3fb950" : "#f85149",
                      background: ok ? "rgba(63, 185, 80, 0.08)" : "rgba(248, 81, 73, 0.08)",
                      border: `1px solid ${ok ? "rgba(63, 185, 80, 0.3)" : "rgba(248, 81, 73, 0.3)"}`,
                    }}
                  >
                    <span style={{ marginRight: 8, fontWeight: 700 }}>
                      {ok ? "✓" : "✗"}
                    </span>
                    <span style={{ color: "#7d8590", marginRight: 6 }}>
                      [{String(rule.id).padStart(2, "0")}]
                    </span>
                    {rule.title(ctx)}
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-12 md:px-8">
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
