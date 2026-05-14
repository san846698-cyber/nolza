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
  buildRichJoseonResult,
  hashString,
  HISTORICAL_EVENTS,
  mulberry32,
  pickClass,
  pickFromArray,
  pickJoseonName,
  PROFESSIONS,
  RESIDENCES,
  type ClassInfo,
  type FateContext,
  type Gender,
  type HistoricalEvent,
  type JoseonName,
  type RichJoseonResult,
  type Residence,
} from "@/lib/joseon";
import RecommendedGames from "../../components/game/RecommendedGames";

type Phase = "input" | "loading" | "result";

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

type Result = {
  cls: ClassInfo;
  joseonName: JoseonName;
  residence: Residence;
  event: HistoricalEvent;
  profession: { ko: string; en: string };
  storyKo: string;
  storyEn: string;
  rich: RichJoseonResult;
};

function computeResult(
  originalName: string,
  gender: Gender,
  year: string,
  month: string,
  day: string,
): Result {
  const seed = hashString(`${originalName}|${gender}|${year}-${month}-${day}`);
  const rng = mulberry32(seed);

  const cls = pickClass(rng, gender);
  const joseonName = pickJoseonName(rng, gender, originalName);
  const residence = pickFromArray(rng, RESIDENCES);
  const event = pickFromArray(rng, HISTORICAL_EVENTS);
  const profession = pickFromArray(rng, PROFESSIONS[cls.id]);

  const baseCtx: Omit<FateContext, "rng"> & { rng: () => number } = {
    cls,
    gender,
    joseonName,
    residence,
    event,
    profession,
    rng: mulberry32(seed + 1),
  };
  const rich = buildRichJoseonResult({ ...baseCtx, rng: mulberry32(seed + 3) });
  const storyKo = rich.story.ko;
  const storyEn = rich.story.en;

  return { cls, joseonName, residence, event, profession, storyKo, storyEn, rich };
}

export default function JoseonPage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("input");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [submittedName, setSubmittedName] = useState("");
  const [shareState, setShareState] = useState<"link" | "share" | null>(null);
  const [stamping, setStamping] = useState(false);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const n = name.trim();
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);
      if (!n || !gender || !Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
        return;
      }
      if (y < 1900 || y > 2025 || m < 1 || m > 12 || d < 1 || d > 31) return;
      setStamping(true);
      setSubmittedName(n);
      setTimeout(() => {
        setPhase("loading");
        setTimeout(() => {
          setResult(computeResult(n, gender, year, month, day));
          setPhase("result");
          setStamping(false);
        }, 1600);
      }, 650);
    },
    [name, gender, year, month, day],
  );

  const handleReset = useCallback(() => {
    setPhase("input");
    setResult(null);
    setName("");
    setGender(null);
    setYear("");
    setMonth("");
    setDay("");
    setSubmittedName("");
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const shareUrl =
      typeof window !== "undefined" ? `${window.location.origin}/games/joseon` : "https://nolza.fun/games/joseon";
    const title = t(result.rich.title.ko, result.rich.title.en);
    const text = t(
      `${result.rich.shareLine.ko}\n` +
        `신분: ${result.cls.ko} · 직업: ${result.profession.ko}\n` +
        `대표 키워드: ${result.rich.shareTraits.map((trait) => trait.ko).join(", ")}`,
      `${result.rich.shareLine.en}\n` +
        `Status: ${result.cls.en} · Job: ${result.profession.en}\n` +
        `Key traits: ${result.rich.shareTraits.map((trait) => trait.en).join(", ")}`,
    );
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { share?: unknown }).share === "function"
      ) {
        await (
          navigator as Navigator & {
            share: (data: { title: string; text: string; url: string }) => Promise<void>;
          }
        ).share({ title, text, url: shareUrl });
        setShareState("share");
        setTimeout(() => setShareState(null), 2000);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      }
    } catch {
      /* ignore */
    }
    setShareState("share");
    setTimeout(() => setShareState(null), 2000);
  }, [result, t]);

  const handleCopyLink = useCallback(async () => {
    const link =
      typeof window !== "undefined" ? `${window.location.origin}/games/joseon` : "https://nolza.fun/games/joseon";
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      }
    } catch {
      /* ignore */
    }
    setShareState("link");
    setTimeout(() => setShareState(null), 2000);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [phase]);

  return (
    <main
      style={{
        minHeight: "100svh",
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
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "result" ? "flex-start" : "center",
          padding: "80px 20px 20px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {phase === "input" && (
          <InputView
            name={name}
            setName={setName}
            gender={gender}
            setGender={setGender}
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            day={day}
            setDay={setDay}
            onSubmit={handleSubmit}
            stamping={stamping}
            t={t}
          />
        )}

        {phase === "loading" && <LoadingView t={t} />}

        {phase === "result" && result && (
          <ResultView
            result={result}
            originalName={submittedName}
            locale={locale}
            t={t}
            onShare={handleShare}
            onCopyLink={handleCopyLink}
            onReset={handleReset}
            shareState={shareState}
          />
        )}
      </div>

      <AdMobileSticky />

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes scrollUnroll {
  0%   { max-height: 0; opacity: 0; transform: scaleY(0.85); }
  100% { max-height: 4000px; opacity: 1; transform: scaleY(1); }
}
@keyframes inkBloom {
  from { opacity: 0; transform: translateY(10px); filter: blur(2px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes sealStamp {
  0%   { transform: scale(1.6) rotate(-8deg); opacity: 0; }
  60%  { transform: scale(0.9) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes brushStroke {
  0%   { stroke-dashoffset: 200; opacity: 0.2; }
  50%  { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes craneFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
.j-scroll {
  animation: scrollUnroll 0.9s cubic-bezier(.2,.7,.2,1) forwards;
  transform-origin: top center;
  overflow: hidden;
}
.j-ornament { width: 64px; height: 64px; }
@media (max-width: 640px) {
  .j-ornament { width: 40px; height: 40px; opacity: 0.55 !important; }
}
@media (max-width: 380px) {
  .j-ornament { display: none; }
}
.j-ink {
  opacity: 0;
  animation: inkBloom 0.7s ease-out forwards;
  animation-delay: calc(var(--j-i, 0) * 130ms + 0.5s);
}
.j-seal {
  animation: sealStamp 0.65s cubic-bezier(.3,.7,.3,1.4) forwards;
}
.brush-path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: brushStroke 1.6s ease-in-out infinite;
}
.j-crane { animation: craneFloat 6s ease-in-out infinite; }
.j-stamp-btn:hover .j-stamp-inner { transform: rotate(-3deg) scale(1.03); }
.j-stamp-btn:active .j-stamp-inner { transform: rotate(2deg) scale(0.96); }
`,
        }}
      />
    </main>
  );
}

/* ---------- Decorative components ---------- */

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
          "radial-gradient(circle at 50% 100%, rgba(196,30,58,0.04), transparent 50%)",
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
      {/* distant mountains */}
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
      {/* clouds */}
      <g fill="none" stroke={INK} strokeWidth="1.5" opacity="0.7">
        <path d="M 80 200 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0" />
        <path d="M 560 280 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0" />
        <path d="M 120 380 q 30 -20 60 0 q 30 -20 60 0" />
      </g>
      {/* pine trees */}
      <g stroke={INK} strokeWidth="2" fill="none" opacity="0.7">
        <path d="M 120 700 L 120 540" strokeWidth="3" />
        <path d="M 120 600 q -30 -20 -50 -10 M 120 580 q 30 -25 55 -12 M 120 555 q -25 -18 -45 -8 M 120 540 q 25 -10 35 0" />
      </g>
      {/* crane */}
      <g className="j-crane" stroke={INK} strokeWidth="1.5" fill="none" opacity="0.65">
        <path d="M 600 180 q 10 -15 30 -10 q 15 5 25 -5 q 5 -10 -8 -14 q -25 8 -47 29 z" />
        <path d="M 632 168 l 14 -8 M 638 172 l 8 6" />
        <path d="M 588 192 q -20 0 -28 12" />
      </g>
      {/* sun/moon */}
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
      viewBox="0 0 64 64"
      className="j-ornament"
      style={{ position: "fixed", zIndex: 20, opacity: 0.85, ...map[position] }}
    >
      <path d="M 4 4 L 60 4 L 60 12 L 12 12 L 12 60 L 4 60 Z" fill={DANCHEONG_RED} />
      <path d="M 12 12 L 56 12 L 56 16 L 16 16 L 16 56 L 12 56 Z" fill={GOLD} />
      <path d="M 18 18 L 50 18 L 50 22 L 22 22 L 22 50 L 18 50 Z" fill={DANCHEONG_BLUE} />
      <circle cx="34" cy="34" r="3" fill={DANCHEONG_RED} />
    </svg>
  );
}

/* ---------- Input view ---------- */

function InputView({
  name,
  setName,
  gender,
  setGender,
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
  onSubmit,
  stamping,
  t,
}: {
  name: string;
  setName: (v: string) => void;
  gender: Gender | null;
  setGender: (g: Gender) => void;
  year: string;
  setYear: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
  day: string;
  setDay: (v: string) => void;
  onSubmit: (e?: FormEvent) => void;
  stamping: boolean;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const ready = name.trim().length > 0 && !!gender && year && month && day;

  return (
    <div className="j-scroll" style={{ maxWidth: 480, width: "100%" }}>
      <ScrollFrame>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 14,
              letterSpacing: "0.5em",
              color: DANCHEONG_RED,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            運 命 占
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              color: SUBTLE,
              marginBottom: 18,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            {t("조선시대 운명 풀이", "JOSEON DESTINY READING")}
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              marginBottom: 8,
              color: INK,
              fontFamily: SERIF,
            }}
          >
            {t("그대 조선에 태어났다면?", "What if you lived in Joseon?")}
          </h1>
          <div
            aria-hidden
            style={{
              width: 40,
              height: 2,
              background: DANCHEONG_RED,
              margin: "14px auto 14px",
            }}
          />
          <p style={{ fontSize: 15, color: INK_SOFT, marginBottom: 24, fontFamily: SERIF }}>
            {t(
              "오백 년 사직(社稷) 속 그대의 자리를 찾아보소서",
              "Discover your place in 500 years of history",
            )}
          </p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ScrollField label={t("성명 (姓名)", "Name")}>
              <input
                type="text"
                autoComplete="off"
                maxLength={40}
                placeholder={t("이름을 적으시오", "Your name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </ScrollField>

            <ScrollField label={t("성별 (性別)", "Gender")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <HanbokTile
                  selected={gender === "male"}
                  onClick={() => setGender("male")}
                  type="male"
                  label={t("남(男)", "Male")}
                />
                <HanbokTile
                  selected={gender === "female"}
                  onClick={() => setGender("female")}
                  type="female"
                  label={t("여(女)", "Female")}
                />
              </div>
            </ScrollField>

            <ScrollField label={t("생년월일 (生年月日)", "Date of Birth")}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr",
                  gap: 8,
                }}
              >
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={t("年", "Year")}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min={1900}
                  max={2025}
                  style={inputStyle}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={t("月", "Month")}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  min={1}
                  max={12}
                  style={inputStyle}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={t("日", "Day")}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  min={1}
                  max={31}
                  style={inputStyle}
                />
              </div>
            </ScrollField>

            <SealButton
              ready={!!ready}
              stamping={stamping}
              label={t("운명 확인하기", "Reveal Destiny")}
            />
          </form>
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
        padding: "36px 28px 32px",
        boxShadow:
          "0 12px 30px rgba(26,26,26,0.12), inset 0 0 0 6px " + HANJI + ", inset 0 0 0 7px " + GOLD,
      }}
    >
      {/* Top scroll bar */}
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
      {/* Bottom scroll bar */}
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

function ScrollField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): ReactElement {
  return (
    <div>
      <div
        style={{
          textAlign: "left",
          fontSize: 12,
          color: DANCHEONG_RED,
          letterSpacing: "0.2em",
          fontFamily: SERIF,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        ◆ {label}
      </div>
      {children}
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
        borderRadius: 8,
        padding: "14px 8px",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: SERIF,
        transition: "all 0.18s",
        boxShadow: selected ? `inset 0 0 0 2px ${GOLD}` : "none",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        {/* Head */}
        <circle cx="22" cy="11" r="6" fill={INK_SOFT} />
        {type === "male" ? (
          <>
            {/* Gat (hat) */}
            <ellipse cx="22" cy="6" rx="11" ry="2.5" fill={INK} />
            <rect x="19" y="2.5" width="6" height="4" fill={INK} />
            {/* Body - jeogori + baji */}
            <path d="M 8 36 L 10 22 Q 22 17 34 22 L 36 36 Z" fill={fillBody} />
            <path d="M 14 36 L 18 42 L 26 42 L 30 36 Z" fill={INK_SOFT} />
            {/* Belt */}
            <rect x="11" y="28" width="22" height="2" fill={GOLD} />
          </>
        ) : (
          <>
            {/* Hair */}
            <path d="M 16 8 Q 22 3 28 8 L 28 12 L 16 12 Z" fill={INK} />
            {/* Jeogori (top) */}
            <path d="M 12 22 Q 22 19 32 22 L 30 28 L 14 28 Z" fill={fillBody} />
            <path d="M 19 22 L 22 26 L 25 22" stroke={GOLD} strokeWidth="0.8" fill="none" />
            {/* Chima (skirt) */}
            <path d="M 8 42 Q 8 32 14 28 L 30 28 Q 36 32 36 42 Z" fill={DANCHEONG_BLUE} />
          </>
        )}
      </svg>
      <span>{label}</span>
    </button>
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
      className="j-stamp-btn"
      style={{
        marginTop: 12,
        background: "transparent",
        border: "none",
        cursor: ready && !stamping ? "pointer" : "default",
        opacity: ready ? 1 : 0.45,
        position: "relative",
        padding: "8px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 88,
      }}
    >
      <div
        className={`j-stamp-inner ${stamping ? "j-seal" : ""}`}
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
          letterSpacing: "0.05em",
          transition: "transform 0.18s",
          textShadow: "0 1px 0 rgba(0,0,0,0.25)",
          lineHeight: 1.05,
          textAlign: "center",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        運命
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

/* ---------- Loading ---------- */

function LoadingView({ t }: { t: (ko: string, en: string) => string }): ReactElement {
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
        <circle cx="90" cy="90" r="70" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.5" />
        <path
          d="M 30 100 Q 70 40 90 100 T 150 100"
          stroke={INK}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="brush-path"
        />
        <path
          d="M 50 130 Q 90 80 130 130"
          stroke={DANCHEONG_RED}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          className="brush-path"
          style={{ animationDelay: "0.4s" }}
        />
      </svg>
      <p
        style={{
          marginTop: 20,
          fontSize: 18,
          color: INK,
          letterSpacing: "0.2em",
          fontFamily: SERIF,
          fontWeight: 700,
        }}
      >
        {t("운명을 살피는 중...", "Reading your destiny...")}
      </p>
    </div>
  );
}

/* ---------- Result view ---------- */

function ResultView({
  result,
  originalName,
  locale,
  t,
  onShare,
  onCopyLink,
  onReset,
  shareState,
}: {
  result: Result;
  originalName: string;
  locale: SimpleLocale;
  t: (ko: string, en: string) => string;
  onShare: () => void;
  onCopyLink: () => void;
  onReset: () => void;
  shareState: "link" | "share" | null;
}): ReactElement {
  const { cls, joseonName, residence, event, profession } = result;
  const story = locale === "ko" ? result.storyKo : result.storyEn;
  const rich = result.rich;
  const title = rich.title[locale];
  const summary = rich.summary[locale];
  const identityNote = rich.identityNote[locale];
  const keywords = rich.keywords.map((keyword) => keyword[locale]);
  const shareTraits = rich.shareTraits.map((trait) => trait[locale]);
  const shareLine = rich.shareLine[locale];

  let revealIdx = 0;
  const stagger = (): React.CSSProperties => ({
    ["--j-i" as string]: String(revealIdx++),
  });

  return (
    <div className="j-scroll" style={{ maxWidth: 680, width: "100%" }}>
      <ScrollFrame>
        <div className="j-ink" style={{ ...stagger(), textAlign: "center", marginBottom: 16 }}>
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
            運 命
          </div>
          <div
            aria-hidden
            style={{ width: 60, height: 1.5, background: INK, margin: "8px auto" }}
          />
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              color: SUBTLE,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
            }}
          >
            {t("그대의 조선 운명", "YOUR JOSEON DESTINY")}
          </div>
        </div>

        <div
          className="j-ink"
          style={{
            ...stagger(),
            background: HANJI,
            border: `1px solid ${INK}`,
            borderRadius: 4,
            padding: "28px 20px 24px",
            textAlign: "center",
            marginBottom: 18,
            position: "relative",
            boxShadow: `inset 0 0 0 4px ${HANJI}, inset 0 0 0 5px ${DANCHEONG_RED}`,
          }}
        >
          <div style={{ fontSize: "clamp(36px, 10vw, 50px)", marginBottom: 8 }}>{cls.emoji}</div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 12,
              letterSpacing: "0.32em",
              color: DANCHEONG_BLUE,
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            {locale === "ko" ? cls.ko : cls.en}
          </div>
          <h2
            style={{
              margin: "0 0 10px",
              fontFamily: SERIF,
              fontSize: "clamp(28px, 8vw, 46px)",
              fontWeight: 900,
              color: INK,
              lineHeight: 1.18,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: "0 auto 18px",
              maxWidth: 520,
              color: INK_SOFT,
              fontSize: "clamp(15px, 4vw, 18px)",
              lineHeight: 1.75,
              fontWeight: 700,
            }}
          >
            {summary}
          </p>
          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: "auto auto",
              alignItems: "baseline",
              gap: 10,
              padding: "10px 18px",
              border: `1px solid ${RULE}`,
              background: "rgba(235,223,184,0.45)",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(28px, 8vw, 42px)",
                fontWeight: 900,
                color: INK,
                letterSpacing: "0.05em",
                lineHeight: 1.1,
              }}
            >
              {joseonName.display}
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 20,
                color: GOLD,
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              {joseonName.hanja}
            </span>
          </div>
          {originalName && originalName.trim() !== joseonName.display && (
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                color: SUBTLE,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              ({originalName})
            </div>
          )}
          {/* Red seal in corner */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: 14,
              bottom: 14,
              width: 44,
              height: 44,
              borderRadius: 6,
              background: DANCHEONG_RED,
              opacity: 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: HANJI,
              fontFamily: SERIF,
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.05em",
              transform: "rotate(-6deg)",
              boxShadow: "inset 0 0 0 2px rgba(245,240,224,0.9), 0 2px 4px rgba(0,0,0,0.2)",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            朝鮮
            <br />
            印章
          </div>
        </div>

        <div
          className="j-ink"
          style={{
            ...stagger(),
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <InfoTile
            label={t("이름 / 호", "Name / Style")}
            hanja="姓名"
            value={`${joseonName.display} (${joseonName.hanja})`}
          />
          <InfoTile
            label={t("신분", "Status")}
            hanja="身分"
            value={locale === "ko" ? cls.ko : cls.en}
          />
          <InfoTile
            label={t("거주지", "Residence")}
            hanja="居處"
            value={locale === "ko" ? residence.ko : residence.en}
          />
          <InfoTile
            label={t("직업", "Occupation")}
            hanja="職業"
            value={locale === "ko" ? profession.ko : profession.en}
          />
          <InfoTile
            label={t("시대", "Era")}
            hanja="時代"
            value={locale === "ko" ? event.ko : event.en}
          />
          <InfoTile
            label={t("대표 키워드", "Keywords")}
            hanja="標語"
            value={keywords.join(" · ")}
            wide
          />
        </div>

        <div
          className="j-ink"
          style={{
            ...stagger(),
            background: HANJI_DEEP,
            border: `1px dashed ${RULE}`,
            borderRadius: 4,
            padding: "16px 18px",
            marginBottom: 18,
            fontSize: 16,
            lineHeight: 1.85,
            color: INK,
            fontFamily: SERIF,
          }}
        >
          <strong style={{ color: DANCHEONG_RED }}>{t("조선 신분증 해설", "Identity note")}</strong>
          <br />
          {identityNote}
        </div>

        <div className="j-ink" style={{ ...stagger(), marginBottom: 24 }}>
          <SectionTitle ko="傳記" title={t("그대의 운명 서사", "Your Fate Story")} />
          <p
            style={{
              fontSize: "clamp(15px, 3.9vw, 17px)",
              lineHeight: 2,
              color: INK,
              fontFamily: SERIF,
              margin: 0,
              background: HANJI,
              border: `1px solid ${RULE}`,
              borderLeft: `3px solid ${DANCHEONG_RED}`,
              borderRadius: 4,
              padding: "18px 20px",
              whiteSpace: "pre-line",
            }}
          >
            {story}
          </p>
        </div>

        <div
          className="j-ink"
          style={{
            ...stagger(),
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 12,
            marginBottom: 22,
          }}
        >
          {rich.sections.map((section) => (
            <ResultSectionPanel
              key={section.title.ko}
              title={section.title[locale]}
              items={section.items.map((item) => item[locale])}
            />
          ))}
        </div>

        <div
          className="j-ink"
          style={{
            ...stagger(),
            background: `linear-gradient(180deg, ${HANJI} 0%, rgba(235,223,184,0.9) 100%)`,
            border: `1.5px solid ${INK}`,
            borderRadius: 6,
            padding: "20px",
            marginBottom: 18,
            boxShadow: `inset 0 0 0 4px ${HANJI}, inset 0 0 0 5px ${GOLD}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: DANCHEONG_RED,
              letterSpacing: "0.22em",
              fontWeight: 900,
              marginBottom: 8,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            SHARE CARD
          </div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(24px, 7vw, 36px)",
              lineHeight: 1.2,
              fontWeight: 900,
            }}
          >
            {title}
          </h3>
          <p style={{ margin: "0 0 14px", lineHeight: 1.75, fontSize: 15, color: INK_SOFT }}>
            {locale === "ko"
              ? `${joseonName.display} · ${cls.ko} · ${residence.ko}의 ${profession.ko}`
              : `${joseonName.display} · ${cls.en} · ${profession.en} of ${residence.en}`}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {shareTraits.map((trait) => (
              <TraitPill key={trait} text={trait} />
            ))}
          </div>
          <p
            style={{
              margin: 0,
              borderTop: `1px dashed ${RULE}`,
              paddingTop: 12,
              color: DANCHEONG_BLUE,
              fontWeight: 800,
              lineHeight: 1.7,
            }}
          >
            {shareLine}
          </p>
        </div>

        <div
          className="j-ink"
          style={{
            ...stagger(),
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button type="button" onClick={onCopyLink} style={secondaryButton}>
            {shareState === "link" ? t("✓ 링크 복사됨", "✓ Link copied") : t("링크 복사", "Copy link")}
          </button>
          <button type="button" onClick={onShare} style={primarySealButton}>
            {shareState === "share" ? t("✓ 공유됨", "✓ Shared") : t("공유하기", "Share")}
          </button>
          <button type="button" onClick={onReset} style={secondaryButton}>
            {t("다시 보기", "Try again")}
          </button>
        </div>
      </ScrollFrame>
      <div className="j-ink" style={{ ...stagger(), marginTop: 22 }}>
        <RecommendedGames
          currentId="joseon"
          ids={["joseon-couple", "korean-name", "saju", "kbti"]}
          title={{ ko: "이 결과 다음에 하기 좋은 놀이", en: "Play next" }}
        />
      </div>
    </div>
  );
}

function InfoTile({
  label,
  hanja,
  value,
  wide = false,
}: {
  label: string;
  hanja: string;
  value: string;
  wide?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        background: HANJI,
        border: `1px solid ${RULE}`,
        borderRadius: 4,
        padding: "12px 14px",
        position: "relative",
        gridColumn: wide ? "1 / -1" : undefined,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 11,
          letterSpacing: "0.3em",
          color: DANCHEONG_RED,
          marginBottom: 4,
          fontWeight: 700,
        }}
      >
        {hanja} · {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: INK,
          fontFamily: SERIF,
          lineHeight: 1.45,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TraitPill({ text }: { text: string }): ReactElement {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 30,
        padding: "6px 10px",
        border: `1px solid ${DANCHEONG_RED}`,
        background: "rgba(196,30,58,0.08)",
        color: DANCHEONG_RED,
        fontSize: 13,
        fontWeight: 900,
        lineHeight: 1.2,
      }}
    >
      {text}
    </span>
  );
}

function ResultSectionPanel({
  title,
  items,
}: {
  title: string;
  items: string[];
}): ReactElement {
  return (
    <section
      style={{
        background: "rgba(245,240,224,0.82)",
        border: `1px solid ${RULE}`,
        borderTop: `3px solid ${DANCHEONG_BLUE}`,
        borderRadius: 4,
        padding: "14px 14px 13px",
      }}
    >
      <h3
        style={{
          margin: "0 0 9px",
          color: DANCHEONG_BLUE,
          fontSize: 15,
          fontWeight: 900,
          lineHeight: 1.35,
        }}
      >
        {title}
      </h3>
      <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
        {items.map((item) => (
          <li key={item} style={{ fontSize: 14, lineHeight: 1.65, color: INK_SOFT }}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionTitle({ ko, title }: { ko: string; title: string }): ReactElement {
  return (
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
        {ko} · {title}
      </div>
      <div style={{ flex: 1, height: 1, background: INK }} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: HANJI,
  color: INK,
  border: `1.5px solid ${RULE}`,
  borderRadius: 4,
  padding: "12px 14px",
  fontSize: 15,
  outline: "none",
  fontFamily: SERIF,
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
  fontWeight: 600,
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
