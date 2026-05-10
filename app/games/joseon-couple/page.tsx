"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  classifyCouple,
  COUPLE_STORIES,
  ENDINGS,
  hashString,
  LOVE_STYLES,
  mulberry32,
  pickClass,
  pickJoseonName,
  type ClassInfo,
  type CoupleStory,
  type Gender,
  type JoseonName,
} from "@/lib/joseon";

type Phase = "input" | "result";

const HANJI = "#f5f0e0";
const HANJI_DEEP = "#ebdfb8";
const DANCHEONG_RED = "#C41E3A";
const DANCHEONG_BLUE = "#2E4A6B";
const GOLD = "#B8960C";
const INK = "#1a1a1a";
const INK_SOFT = "#3a2f22";
const SUBTLE = "rgba(26,26,26,0.55)";
const RULE = "rgba(26,26,26,0.18)";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', 'Nanum Myeongjo', serif";

type Person = {
  cls: ClassInfo;
  name: JoseonName;
  original: string;
  gender: Gender;
};

type CoupleResult = {
  p1: Person;
  p2: Person;
  story: CoupleStory;
  meeting: { ko: string; en: string };
  score: number;
};

function buildPerson(originalName: string, gender: Gender, salt: number): Person {
  const seed = hashString(`${originalName}|${gender}|${salt}`);
  const rng = mulberry32(seed);
  const cls = pickClass(rng, gender);
  const name = pickJoseonName(rng, gender, originalName);
  return { cls, name, original: originalName, gender };
}

function computeCouple(
  n1: string,
  g1: Gender,
  n2: string,
  g2: Gender,
): CoupleResult {
  const p1 = buildPerson(n1, g1, 1);
  const p2 = buildPerson(n2, g2, 2);
  const key = classifyCouple(p1.cls.id, p2.cls.id, p1.gender, p2.gender);
  const story = COUPLE_STORIES[key];
  const meeting = {
    ko: story.meeting.ko(p1.name.display, p2.name.display),
    en: story.meeting.en(p1.name.display, p2.name.display),
  };
  const tweakSeed = hashString(`${n1}|${n2}`);
  const tweak = (mulberry32(tweakSeed)() * 14) - 7;
  const score = Math.max(60, Math.min(99, Math.round(story.baseScore + tweak)));

  return { p1, p2, story, meeting, score };
}

function hearts(score: number): string {
  if (score >= 95) return "❤❤❤❤❤";
  if (score >= 85) return "❤❤❤❤";
  if (score >= 75) return "❤❤❤";
  if (score >= 65) return "❤❤";
  return "❤";
}

export default function JoseonCouplePage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("input");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [gender1, setGender1] = useState<Gender>("male");
  const [gender2, setGender2] = useState<Gender>("female");
  const [result, setResult] = useState<CoupleResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [stamping, setStamping] = useState(false);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const n1 = name1.trim();
      const n2 = name2.trim();
      if (!n1 || !n2) return;
      setStamping(true);
      setTimeout(() => {
        setResult(computeCouple(n1, gender1, n2, gender2));
        setPhase("result");
        setStamping(false);
      }, 150);
    },
    [name1, gender1, name2, gender2],
  );

  const handleReset = useCallback(() => {
    setPhase("input");
    setResult(null);
    setName1("");
    setName2("");
    setGender1("male");
    setGender2("female");
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const text = t(
      `우리가 조선시대 커플이었다면\n` +
        `${result.p1.name.display}(${result.p1.cls.ko}) ❤ ${result.p2.name.display}(${result.p2.cls.ko})\n` +
        `${ENDINGS[result.story.ending].ko}\n` +
        `→ nolza.fun/games/joseon-couple`,
      `If we were a Joseon Dynasty couple:\n` +
        `${result.p1.name.display} (${result.p1.cls.en}) ❤ ${result.p2.name.display} (${result.p2.cls.en})\n` +
        `${ENDINGS[result.story.ending].en}\n` +
        `→ nolza.fun/games/joseon-couple`,
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
  }, [result, t]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [phase]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: HANJI,
        color: INK,
        fontFamily: SERIF,
        position: "relative",
        paddingBottom: 100,
        overflow: "hidden",
      }}
    >
      <HanjiTexture />
      <SansuBackdrop />
      <DancheongTopBorder />
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 16,
          top: 32,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: DANCHEONG_RED,
          textDecoration: "none",
          background: "rgba(245,240,224,0.85)",
          backdropFilter: "blur(4px)",
          border: `1px solid ${RULE}`,
        }}
      >
        ←
      </Link>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "input" ? "center" : "flex-start",
          padding: "80px 16px 20px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {phase === "input" && (
          <InputView
            name1={name1}
            setName1={setName1}
            name2={name2}
            setName2={setName2}
            gender1={gender1}
            setGender1={setGender1}
            gender2={gender2}
            setGender2={setGender2}
            onSubmit={handleSubmit}
            stamping={stamping}
            t={t}
          />
        )}

        {phase === "result" && result && (
          <ResultView
            result={result}
            locale={locale}
            t={t}
            onShare={handleShare}
            onReset={handleReset}
            copied={copied}
          />
        )}
      </div>

      <AdMobileSticky />

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes scrollUnroll {
  0%   { opacity: 0; transform: translateY(-6px) scaleY(0.96); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}
@keyframes inkBloom {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sealStamp {
  0%   { transform: scale(1.4) rotate(-6deg); opacity: 0; }
  60%  { transform: scale(0.95) rotate(1deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes lotusBloom {
  0%   { transform: scale(0.85) rotate(-8deg); opacity: 0; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
.jc-scroll {
  animation: scrollUnroll 0.32s cubic-bezier(.2,.7,.2,1) forwards;
  transform-origin: top center;
  will-change: opacity, transform;
}
.jc-ink {
  opacity: 0;
  animation: inkBloom 0.28s ease-out forwards;
  animation-delay: calc(var(--jc-i, 0) * 35ms + 80ms);
  will-change: opacity, transform;
}
.jc-lotus { animation: lotusBloom 0.4s ease-out 100ms forwards; opacity: 0; }
.jc-seal { animation: sealStamp 0.3s cubic-bezier(.3,.7,.3,1.4) forwards; }
.jc-stamp-btn:hover .jc-stamp-inner { transform: rotate(-3deg) scale(1.03); }
.jc-stamp-btn:active .jc-stamp-inner { transform: rotate(2deg) scale(0.96); }
@media (prefers-reduced-motion: reduce) {
  .jc-scroll, .jc-ink, .jc-lotus, .jc-seal { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}
`,
        }}
      />
    </main>
  );
}

/* ---------- Decorative ---------- */

function HanjiTexture(): ReactElement {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.5,
        backgroundImage:
          "radial-gradient(circle at 12% 18%, rgba(184,150,12,0.08), transparent 35%)," +
          "radial-gradient(circle at 88% 70%, rgba(46,74,107,0.06), transparent 40%)," +
          "radial-gradient(circle at 50% 100%, rgba(196,30,58,0.05), transparent 50%)",
      }}
    />
  );
}

function SansuBackdrop(): ReactElement {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 1200"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.1,
        zIndex: 0,
      }}
    >
      <path
        d="M 0 700 Q 80 600 160 660 T 320 640 Q 400 580 480 650 T 640 630 Q 720 590 800 660 L 800 800 L 0 800 Z"
        fill={INK}
        opacity="0.6"
      />
      <path
        d="M 0 780 Q 100 700 200 760 T 400 740 Q 500 690 600 750 T 800 730 L 800 880 L 0 880 Z"
        fill={INK}
        opacity="0.4"
      />
      <g fill="none" stroke={INK} strokeWidth="1.5" opacity="0.7">
        <path d="M 80 200 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0" />
        <path d="M 560 280 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0" />
      </g>
      <g stroke={INK} strokeWidth="2" fill="none" opacity="0.7">
        <path d="M 120 700 L 120 540" strokeWidth="3" />
        <path d="M 120 600 q -30 -20 -50 -10 M 120 580 q 30 -25 55 -12 M 120 555 q -25 -18 -45 -8 M 120 540 q 25 -10 35 0" />
      </g>
      <circle cx="680" cy="120" r="32" fill={DANCHEONG_RED} opacity="0.5" />
    </svg>
  );
}

function DancheongTopBorder(): ReactElement {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 18,
        zIndex: 30,
        backgroundImage:
          `repeating-linear-gradient(90deg, ${DANCHEONG_RED} 0 14px, ${GOLD} 14px 18px, ${DANCHEONG_BLUE} 18px 32px, ${GOLD} 32px 36px)`,
        boxShadow: `0 1px 0 ${INK} inset, 0 -1px 0 ${INK} inset, 0 2px 4px rgba(0,0,0,0.08)`,
      }}
    />
  );
}

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }): ReactElement {
  const map: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 8, transform: "rotate(0deg)" },
    tr: { top: 24, right: 8, transform: "scaleX(-1)" },
    bl: { bottom: 8, left: 8, transform: "scaleY(-1)" },
    br: { bottom: 8, right: 8, transform: "scale(-1,-1)" },
  };
  return (
    <svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      style={{ position: "fixed", zIndex: 20, opacity: 0.85, ...map[position] }}
    >
      <path d="M 4 4 L 60 4 L 60 12 L 12 12 L 12 60 L 4 60 Z" fill={DANCHEONG_RED} />
      <path d="M 12 12 L 56 12 L 56 16 L 16 16 L 16 56 L 12 56 Z" fill={GOLD} />
      <path d="M 18 18 L 50 18 L 50 22 L 22 22 L 22 50 L 18 50 Z" fill={DANCHEONG_BLUE} />
      <circle cx="34" cy="34" r="3" fill={DANCHEONG_RED} />
    </svg>
  );
}

/* ---------- Input ---------- */

function InputView({
  name1,
  setName1,
  name2,
  setName2,
  gender1,
  setGender1,
  gender2,
  setGender2,
  onSubmit,
  stamping,
  t,
}: {
  name1: string;
  setName1: (v: string) => void;
  name2: string;
  setName2: (v: string) => void;
  gender1: Gender;
  setGender1: (g: Gender) => void;
  gender2: Gender;
  setGender2: (g: Gender) => void;
  onSubmit: (e?: FormEvent) => void;
  stamping: boolean;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const ready = name1.trim() && name2.trim();
  return (
    <div className="jc-scroll" style={{ maxWidth: 720, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            letterSpacing: "0.4em",
            color: DANCHEONG_RED,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          緣 分
        </div>
        <div
          aria-hidden
          style={{ width: 50, height: 1.5, background: INK, margin: "8px auto" }}
        />
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: SUBTLE,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
          }}
        >
          {t("조선시대 커플 시뮬레이터", "JOSEON COUPLE SIMULATOR")}
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            margin: "14px 0 6px",
            color: INK,
            fontFamily: SERIF,
          }}
        >
          {t("우리가 조선의 연인이었다면?", "What if we were Joseon lovers?")}
        </h1>
        <p style={{ fontSize: 14, color: INK_SOFT, fontFamily: SERIF }}>
          {t("신분을 넘어선 운명적 사랑", "A fateful love beyond social class")}
        </p>
      </div>

      <form onSubmit={onSubmit}>
        {/* Two scrolls facing each other */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 14,
            alignItems: "center",
          }}
        >
          <PersonScroll
            name={name1}
            setName={setName1}
            gender={gender1}
            setGender={setGender1}
            placeholder={t("첫 번째", "First")}
            side="left"
            t={t}
          />

          <LotusOrnament />

          <PersonScroll
            name={name2}
            setName={setName2}
            gender={gender2}
            setGender={setGender2}
            placeholder={t("두 번째", "Second")}
            side="right"
            t={t}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <SealButton
            ready={!!ready}
            stamping={stamping}
            label={t("운명 확인하기", "Reveal Our Fate")}
          />
        </div>
      </form>

      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          color: SUBTLE,
          lineHeight: 1.6,
          fontFamily: SERIF,
          textAlign: "center",
        }}
      >
        {t(
          "신분 차이가 클수록 더 흥미로운 이야기가 나옵니다",
          "Larger class differences make for more dramatic tales",
        )}
      </p>
    </div>
  );
}

function PersonScroll({
  name,
  setName,
  gender,
  setGender,
  placeholder,
  side,
  t,
}: {
  name: string;
  setName: (v: string) => void;
  gender: Gender;
  setGender: (g: Gender) => void;
  placeholder: string;
  side: "left" | "right";
  t: (ko: string, en: string) => string;
}): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${HANJI} 0%, ${HANJI_DEEP} 100%)`,
        border: `1.5px solid ${INK}`,
        borderRadius: 4,
        padding: "20px 14px 16px",
        boxShadow: `inset 0 0 0 4px ${HANJI}, inset 0 0 0 5px ${GOLD}`,
        minWidth: 0,
      }}
    >
      {/* scroll caps */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -10,
          left: -6,
          right: -6,
          height: 14,
          background: `linear-gradient(180deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 3,
          boxShadow: `inset 0 1px 0 ${GOLD}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -10,
          left: -6,
          right: -6,
          height: 14,
          background: `linear-gradient(0deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 3,
          boxShadow: `inset 0 -1px 0 ${GOLD}`,
        }}
      />
      <div
        style={{
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 12,
          letterSpacing: "0.3em",
          color: DANCHEONG_RED,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {side === "left" ? "其 一" : "其 二"}
      </div>

      <input
        type="text"
        autoComplete="off"
        maxLength={30}
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginTop: 10,
        }}
      >
        <HanbokTile
          selected={gender === "male"}
          onClick={() => setGender("male")}
          type="male"
          label={t("남", "M")}
        />
        <HanbokTile
          selected={gender === "female"}
          onClick={() => setGender("female")}
          type="female"
          label={t("여", "F")}
        />
      </div>
    </div>
  );
}

function HanbokTile({
  selected,
  onClick,
  type,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  type: "male" | "female";
  label: string;
}): ReactElement {
  const fillBody = type === "male" ? DANCHEONG_BLUE : DANCHEONG_RED;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected ? HANJI_DEEP : HANJI,
        color: INK,
        border: `1.5px solid ${selected ? DANCHEONG_RED : RULE}`,
        borderRadius: 4,
        padding: "8px 4px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: SERIF,
        transition: "all 0.18s",
        boxShadow: selected ? `inset 0 0 0 2px ${GOLD}` : "none",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 44 44" aria-hidden>
        <circle cx="22" cy="11" r="6" fill={INK_SOFT} />
        {type === "male" ? (
          <>
            <ellipse cx="22" cy="6" rx="11" ry="2.5" fill={INK} />
            <rect x="19" y="2.5" width="6" height="4" fill={INK} />
            <path d="M 8 36 L 10 22 Q 22 17 34 22 L 36 36 Z" fill={fillBody} />
            <path d="M 14 36 L 18 42 L 26 42 L 30 36 Z" fill={INK_SOFT} />
            <rect x="11" y="28" width="22" height="2" fill={GOLD} />
          </>
        ) : (
          <>
            <path d="M 16 8 Q 22 3 28 8 L 28 12 L 16 12 Z" fill={INK} />
            <path d="M 12 22 Q 22 19 32 22 L 30 28 L 14 28 Z" fill={fillBody} />
            <path d="M 8 42 Q 8 32 14 28 L 30 28 Q 36 32 36 42 Z" fill={DANCHEONG_BLUE} />
          </>
        )}
      </svg>
      <span>{label}</span>
    </button>
  );
}

function LotusOrnament(): ReactElement {
  return (
    <div
      className="jc-lotus"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
        {/* Lotus petals */}
        <g>
          <ellipse cx="24" cy="14" rx="6" ry="10" fill={DANCHEONG_RED} opacity="0.85" />
          <ellipse cx="14" cy="22" rx="6" ry="10" fill={DANCHEONG_RED} opacity="0.85" transform="rotate(-50 14 22)" />
          <ellipse cx="34" cy="22" rx="6" ry="10" fill={DANCHEONG_RED} opacity="0.85" transform="rotate(50 34 22)" />
          <ellipse cx="18" cy="32" rx="5" ry="9" fill={DANCHEONG_RED} opacity="0.7" transform="rotate(-30 18 32)" />
          <ellipse cx="30" cy="32" rx="5" ry="9" fill={DANCHEONG_RED} opacity="0.7" transform="rotate(30 30 32)" />
          <circle cx="24" cy="22" r="5" fill={GOLD} />
          <circle cx="24" cy="22" r="2" fill={INK} />
        </g>
      </svg>
      <div
        aria-hidden
        style={{
          fontFamily: SERIF,
          fontSize: 18,
          color: DANCHEONG_RED,
          fontWeight: 900,
          letterSpacing: "0.05em",
        }}
      >
        ❤
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 11,
          color: SUBTLE,
          fontWeight: 700,
          letterSpacing: "0.2em",
        }}
      >
        緣
      </div>
    </div>
  );
}

function SealButton({
  ready,
  stamping,
  label,
}: {
  ready: boolean;
  stamping: boolean;
  label: string;
}): ReactElement {
  return (
    <button
      type="submit"
      disabled={!ready || stamping}
      className="jc-stamp-btn"
      style={{
        background: "transparent",
        border: "none",
        cursor: ready && !stamping ? "pointer" : "default",
        opacity: ready ? 1 : 0.45,
        position: "relative",
        padding: "8px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className={`jc-stamp-inner ${stamping ? "jc-seal" : ""}`}
        style={{
          width: 84,
          height: 84,
          borderRadius: 12,
          background: DANCHEONG_RED,
          border: `3px solid ${DANCHEONG_RED}`,
          boxShadow:
            "inset 0 0 0 4px rgba(245,240,224,0.95), 0 6px 16px rgba(196,30,58,0.4)," +
            "0 0 0 1px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          color: HANJI,
          fontWeight: 900,
          fontSize: 22,
          transition: "transform 0.18s",
          textShadow: "0 1px 0 rgba(0,0,0,0.25)",
          lineHeight: 1.05,
          textAlign: "center",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        緣分
      </div>
      <span
        style={{
          marginLeft: 14,
          fontFamily: SERIF,
          fontSize: 16,
          fontWeight: 700,
          color: INK,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ---------- Result ---------- */

function ResultView({
  result,
  locale,
  t,
  onShare,
  onReset,
  copied,
}: {
  result: CoupleResult;
  locale: SimpleLocale;
  t: (ko: string, en: string) => string;
  onShare: () => void;
  onReset: () => void;
  copied: boolean;
}): ReactElement {
  const { p1, p2, story, meeting, score } = result;
  let revealIdx = 0;
  const stagger = (): React.CSSProperties => ({
    ["--jc-i" as string]: String(revealIdx++),
  });

  return (
    <div className="jc-scroll" style={{ maxWidth: 600, width: "100%" }}>
      <ScrollFrame>
        <div className="jc-ink" style={{ ...stagger(), textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: "0.4em",
              color: DANCHEONG_RED,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            緣 分
          </div>
          <div
            aria-hidden
            style={{ width: 50, height: 1.5, background: INK, margin: "8px auto" }}
          />
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              color: SUBTLE,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
            }}
          >
            {t("우리의 조선 로맨스", "OUR JOSEON ROMANCE")}
          </div>
        </div>

        {/* Hero */}
        <div
          className="jc-ink"
          style={{
            ...stagger(),
            background: HANJI,
            border: `1px solid ${INK}`,
            borderRadius: 4,
            padding: "26px 18px 22px",
            marginBottom: 16,
            textAlign: "center",
            boxShadow: `inset 0 0 0 4px ${HANJI}, inset 0 0 0 5px ${DANCHEONG_RED}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <PersonCard person={p1} locale={locale} />
            <div
              aria-hidden
              style={{
                fontSize: 26,
                color: DANCHEONG_RED,
                fontWeight: 900,
              }}
            >
              ❤
            </div>
            <PersonCard person={p2} locale={locale} />
          </div>

          <div
            style={{
              marginTop: 22,
              fontFamily: SERIF,
              fontSize: 26,
              fontWeight: 800,
              lineHeight: 1.3,
              color: INK,
            }}
          >
            「{locale === "ko" ? story.title.ko : story.title.en}」
          </div>

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 11,
                letterSpacing: "0.3em",
                color: DANCHEONG_BLUE,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              緣 · {t("조선 궁합", "Joseon Compatibility")}
            </div>
            <div style={{ fontSize: 22, color: DANCHEONG_RED, letterSpacing: "0.1em" }}>
              {hearts(score)}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 38,
                fontWeight: 900,
                color: DANCHEONG_RED,
                letterSpacing: "-0.02em",
                marginTop: 4,
              }}
            >
              {score}
              <span style={{ fontSize: 16, marginLeft: 4, color: SUBTLE }}>
                {t("점", "pts")}
              </span>
            </div>
          </div>
        </div>

        <Section title={t("만남의 시작", "How You Met")} hanja="逢" stagger={stagger}>
          <p style={{ ...storyTextStyle, whiteSpace: "pre-line" }}>
            {locale === "ko" ? meeting.ko : meeting.en}
          </p>
        </Section>

        <Section title={t("사랑 방식", "How You Loved")} hanja="愛" stagger={stagger}>
          <p style={{ ...storyTextStyle, color: DANCHEONG_RED, fontWeight: 700 }}>
            {LOVE_STYLES[story.loveStyle][locale]}
          </p>
        </Section>

        <Section title={t("운명의 결말", "Your Fate")} hanja="命" stagger={stagger}>
          <p style={{ ...storyTextStyle, color: DANCHEONG_BLUE, fontWeight: 700 }}>
            {ENDINGS[story.ending][locale]}
          </p>
        </Section>

        <div
          className="jc-ink"
          style={{
            ...stagger(),
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <button type="button" onClick={onShare} style={primarySealButton}>
            {copied ? t("✓ 복사됨", "✓ Copied") : t("📜 우리 이야기 공유", "📜 Share")}
          </button>
          <button type="button" onClick={onReset} style={secondaryButton}>
            ↺ {t("다시 하기", "Try again")}
          </button>
        </div>
      </ScrollFrame>
    </div>
  );
}

function ScrollFrame({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${HANJI} 0%, ${HANJI_DEEP} 100%)`,
        border: `1.5px solid ${INK}`,
        borderRadius: 6,
        padding: "32px 24px 30px",
        boxShadow:
          "0 12px 30px rgba(26,26,26,0.12), inset 0 0 0 6px " + HANJI + ", inset 0 0 0 7px " + GOLD,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -12,
          left: -8,
          right: -8,
          height: 18,
          background: `linear-gradient(180deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 4,
          boxShadow: `inset 0 1px 0 ${GOLD}, 0 2px 6px rgba(0,0,0,0.2)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -16,
          left: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -12,
          left: -8,
          right: -8,
          height: 18,
          background: `linear-gradient(0deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 4,
          boxShadow: `inset 0 -1px 0 ${GOLD}, 0 2px 6px rgba(0,0,0,0.2)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -16,
          left: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -16,
          right: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      {children}
    </div>
  );
}

function PersonCard({
  person,
  locale,
}: {
  person: Person;
  locale: SimpleLocale;
}): ReactElement {
  return (
    <div style={{ textAlign: "center", minWidth: 110 }}>
      <div style={{ fontSize: 34, marginBottom: 4 }}>{person.cls.emoji}</div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 26,
          fontWeight: 800,
          color: INK,
          letterSpacing: "0.03em",
          lineHeight: 1.05,
        }}
      >
        {person.name.display}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 16, color: GOLD, marginTop: 2, fontWeight: 600 }}>
        {person.name.hanja}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          color: DANCHEONG_RED,
          fontFamily: SERIF,
          letterSpacing: "0.15em",
          fontWeight: 700,
        }}
      >
        {locale === "ko" ? person.cls.ko : person.cls.en}
      </div>
      {person.original && person.original.trim() !== person.name.display && (
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: SUBTLE,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ({person.original})
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  hanja,
  stagger,
  children,
}: {
  title: string;
  hanja: string;
  stagger: () => React.CSSProperties;
  children: React.ReactNode;
}): ReactElement {
  return (
    <div className="jc-ink" style={{ ...stagger(), marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ flex: 1, height: 1, background: INK }} />
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 14,
            letterSpacing: "0.3em",
            color: DANCHEONG_RED,
            fontWeight: 800,
          }}
        >
          {hanja} · {title}
        </div>
        <div style={{ flex: 1, height: 1, background: INK }} />
      </div>
      <div
        style={{
          background: HANJI,
          border: `1px solid ${RULE}`,
          borderLeft: `3px solid ${DANCHEONG_RED}`,
          borderRadius: 4,
          padding: "16px 18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: HANJI,
  color: INK,
  border: `1.5px solid ${RULE}`,
  borderRadius: 4,
  padding: "12px 12px",
  fontSize: 15,
  outline: "none",
  fontFamily: SERIF,
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
  fontWeight: 700,
};

const primarySealButton: React.CSSProperties = {
  background: DANCHEONG_RED,
  color: HANJI,
  border: `2px solid ${DANCHEONG_RED}`,
  padding: "12px 24px",
  borderRadius: 4,
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: "0.15em",
  cursor: "pointer",
  fontFamily: SERIF,
  boxShadow: `inset 0 0 0 2px rgba(245,240,224,0.9), 0 4px 12px rgba(196,30,58,0.3)`,
};

const secondaryButton: React.CSSProperties = {
  background: "transparent",
  color: INK,
  border: `1.5px solid ${INK}`,
  padding: "12px 24px",
  borderRadius: 4,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: SERIF,
};

const storyTextStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.95,
  color: INK,
  fontFamily: SERIF,
  margin: 0,
};
