"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { AdBottom } from "@/app/components/Ads";
import { trackResultView, trackRetryClick, trackShareClick, trackTestStart } from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  PAIR_COPY,
  type PairCopy,
  type ElementKey,
  ELEMENT_KO_NAME,
  ELEMENT_EN_NAME,
  ELEMENT_HANJA,
  ELEMENT_EMOJI,
  elementFromYear,
} from "./copy";

/* ============================================================
 * 색상 / 폰트
 * ========================================================== */
const C = {
  bg: "#0a0e1a",
  bgDeep: "#070a14",
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.10)",
  ink: "#f5f1e6",
  sub: "#9aa0b8",
  gold: "#c9a84c",
  goldSoft: "#e6c878",
  lavender: "#a78bfa",
  lavenderSoft: "#c7b6ff",
};

const FONT_SERIF = `"Noto Serif KR", "Noto Serif", Georgia, serif`;
const FONT_SANS = `"Noto Sans KR", "Noto Sans", system-ui, sans-serif`;

/* ============================================================
 * 점수 계산 — (로직 유지)
 * ========================================================== */
function totalScore(a: number, b: number) {
  return Math.round(
    (friendshipScore(a, b) +
      conversationScore(a, b) +
      synergyScore(a, b) +
      growthScore(a, b)) /
      4,
  );
}
function friendshipScore(a: number, b: number) {
  return ((a * 17 + b * 11 + Math.abs(a - b) * 9 + 19) % 41) + 60;
}
function conversationScore(a: number, b: number) {
  return ((a * 5 + b * 23 + Math.abs(a - b) * 7 + (a + b) * 3 + 7) % 41) + 60;
}
function synergyScore(a: number, b: number) {
  return ((a * b * 7 + a * 13 + b * 3 + 29) % 41) + 60;
}
function growthScore(a: number, b: number) {
  return ((((a + 3) * (b + 5)) * 5 + Math.abs(a - b) * 11 + a * 2 + 17) % 41) + 60;
}

/* ============================================================
 * 입력 / 공유 유틸 — (로직 유지)
 * ========================================================== */
type Person = { name: string; year: string };
type FriendSharePayload = { v: 1; a: Person; b: Person };

const EDGE_NAME_PUNCT_RE = /^[\s"'`“”‘’「」『』!?.,，。！？]+|[\s"'`“”‘’「」『』!?.,，。！？]+$/g;

function sanitizeDisplayName(name: string): string {
  return name
    .trim()
    .replace(EDGE_NAME_PUNCT_RE, "")
    .trim()
    .replace(/\s+/g, " ");
}

function finalConsonantIndex(value: string): number {
  const last = Array.from(value.trim()).reverse().find((char) => /\S/.test(char));
  if (!last) return 0;
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28;
  if (/x$/i.test(last)) return 0;
  return /[0-9bcdfghjklmnpqrstvwxyz]$/i.test(last) ? 1 : 0;
}

function withJosa(value: string, pair: "과/와"): string {
  const jong = finalConsonantIndex(value);
  return `${value}${jong ? "과" : "와"}`;
}

function clampYear(y: string): number | null {
  const n = parseInt(y, 10);
  if (!Number.isFinite(n)) return null;
  if (n < 1900 || n > 2100) return null;
  return n;
}

function encodeShareUrl(a: Person, b: Person): string {
  return buildShareUrl("/games/friend-match", { v: 1, a, b } satisfies FriendSharePayload);
}

/* ============================================================
 * 카운트업 훅 — (로직 유지)
 * ========================================================== */
function useCountUp(target: number, ms = 1100): number {
  const [v, setV] = useState(0);
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    setV(0);
    startedAt.current = null;
    let raf = 0;
    const step = (t: number) => {
      if (startedAt.current === null) startedAt.current = t;
      const p = Math.min(1, (t - startedAt.current) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/* ============================================================
 * 별빛 파티클 (canvas)
 * ========================================================== */
function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    type Star = { x: number; y: number; r: number; tw: number; sp: number; hue: number };
    let stars: Star[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const seed = () => {
      const count = Math.min(160, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.4, 1.6),
        tw: Math.random() * Math.PI * 2,
        sp: rand(0.6, 1.8),
        hue: Math.random() < 0.18 ? 1 : Math.random() < 0.5 ? 2 : 0,
      }));
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(s.tw + t * s.sp));
        const color =
          s.hue === 1
            ? `rgba(201,168,76,${a})`
            : s.hue === 2
              ? `rgba(167,139,250,${a * 0.9})`
              : `rgba(245,241,230,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ============================================================
 * 팔괘 로딩 스피너
 * ========================================================== */
const TRIGRAMS = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];

function BaguaLoader({ t }: { t: (ko: string, en: string) => string }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "70svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <div className="fm-bagua" style={{ position: "relative", width: 168, height: 168 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid rgba(201,168,76,0.25)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 26,
            borderRadius: "50%",
            border: `1px solid rgba(167,139,250,0.18)`,
          }}
        />
        {TRIGRAMS.map((g, i) => {
          const angle = (i / TRIGRAMS.length) * 360;
          return (
            <span
              key={g}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                fontSize: 22,
                color: i % 2 === 0 ? C.gold : C.lavender,
                transform: `rotate(${angle}deg) translateY(-78px) rotate(-${angle}deg)`,
                transformOrigin: "0 0",
                marginLeft: -8,
                marginTop: -14,
              }}
            >
              {g}
            </span>
          );
        })}
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: 30,
            color: C.goldSoft,
          }}
        >
          ✦
        </span>
      </div>
      <p
        style={{
          fontFamily: FONT_SERIF,
          color: C.sub,
          fontSize: 14,
          letterSpacing: "0.08em",
        }}
      >
        {t("하늘의 결을 읽는 중…", "Reading the heavens…")}
      </p>

      <style jsx>{`
        .fm-bagua {
          animation: fm-spin 2s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }
        @keyframes fm-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * 페이지 루트
 * ========================================================== */
function FriendMatchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, locale } = useLocale();

  const [a, setA] = useState<Person>({ name: "", year: "" });
  const [b, setB] = useState<Person>({ name: "", year: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSharedResult, setIsSharedResult] = useState(false);

  // URL 파라미터로 들어온 경우 자동 결과 (로직 유지)
  useEffect(() => {
    let restored: { a: Person; b: Person } | null = null;
    const shared = decodeSharePayload<FriendSharePayload>(params.get("s"));
    if (
      shared?.v === 1 &&
      shared.a?.name &&
      shared.b?.name &&
      clampYear(shared.a.year) &&
      clampYear(shared.b.year)
    ) {
      const nameA = sanitizeDisplayName(shared.a.name);
      const nameB = sanitizeDisplayName(shared.b.name);
      if (!nameA || !nameB) return;
      restored = {
        a: { name: nameA, year: shared.a.year },
        b: { name: nameB, year: shared.b.year },
      };
    } else {
      const ap = params.get("a");
      const bp = params.get("b");
      if (ap && bp) {
        const [an, ay] = ap.split(",");
        const [bn, by] = bp.split(",");
        if (an && ay && bn && by && clampYear(ay) && clampYear(by)) {
          const nameA = sanitizeDisplayName(an);
          const nameB = sanitizeDisplayName(bn);
          if (!nameA || !nameB) return;
          restored = {
            a: { name: nameA, year: ay },
            b: { name: nameB, year: by },
          };
        }
      }
    }
    if (!restored) return;
    const restoreId = window.setTimeout(() => {
      setA(restored.a);
      setB(restored.b);
      setSubmitted(true);
      setIsSharedResult(true);
    }, 0);
    return () => window.clearTimeout(restoreId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yearA = clampYear(a.year);
  const yearB = clampYear(b.year);
  const canSubmit =
    sanitizeDisplayName(a.name).length > 0 &&
    sanitizeDisplayName(b.name).length > 0 &&
    yearA !== null &&
    yearB !== null;

  const result = useMemo(() => {
    if (!submitted || yearA === null || yearB === null) return null;
    const i1 = ((yearA % 10) + 10) % 10;
    const i2 = ((yearB % 10) + 10) % 10;
    const e1: ElementKey = elementFromYear(yearA);
    const e2: ElementKey = elementFromYear(yearB);
    const key = `${e1}_${e2}` as keyof typeof PAIR_COPY;
    return {
      i1,
      i2,
      e1,
      e2,
      total: totalScore(i1, i2),
      friendship: friendshipScore(i1, i2),
      conversation: conversationScore(i1, i2),
      synergy: synergyScore(i1, i2),
      growth: growthScore(i1, i2),
      copy: PAIR_COPY[key] as PairCopy,
      archetype: selectRelationshipArchetype({
        total: totalScore(i1, i2),
        friendship: friendshipScore(i1, i2),
        conversation: conversationScore(i1, i2),
        synergy: synergyScore(i1, i2),
        growth: growthScore(i1, i2),
        seed: i1 * 17 + i2 * 31,
      }),
    };
  }, [submitted, yearA, yearB]);

  useEffect(() => {
    if (result) {
      trackResultView("friend-match", result.archetype.enTitle);
    }
  }, [result]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const nextA = { ...a, name: sanitizeDisplayName(a.name) };
    const nextB = { ...b, name: sanitizeDisplayName(b.name) };
    if (!nextA.name || !nextB.name) return;
    trackTestStart("friend-match", "Friend Match");
    const url = encodeShareUrl(nextA, nextB);
    setIsSharedResult(false);
    setA(nextA);
    setB(nextB);
    // 팔괘 로딩 2초 → 결과
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
    if (typeof window !== "undefined") {
      const path = url.replace(window.location.origin, "");
      router.replace(path);
    }
  };

  const handleReset = () => {
    trackRetryClick("friend-match", "compatibility");
    setSubmitted(false);
    setLoading(false);
    setIsSharedResult(false);
    setA({ name: "", year: "" });
    setB({ name: "", year: "" });
    router.replace("/games/friend-match");
  };

  const handleShare = async () => {
    if (!result) return;
    trackShareClick("friend-match", "compatibility", result.archetype.enTitle);
    const url = encodeShareUrl(a, b);
    const title = t(
      `${withJosa(a.name, "과/와")} ${b.name}: ${result.archetype.title} (${result.total}점)`,
      `${a.name} × ${b.name}: ${result.total} / 100`,
    );
    const desc =
      locale === "ko"
        ? buildKoreanShareText(a.name, b.name, result)
        : `${a.name} and ${b.name}: ${result.archetype.enTitle}. ${result.archetype.enVerdict}`;

    const w =
      typeof window !== "undefined"
        ? (window as unknown as {
            Kakao?: { isInitialized?: () => boolean; Share?: { sendDefault: (a: unknown) => void } };
          })
        : undefined;
    if (w?.Kakao?.Share && w.Kakao.isInitialized?.()) {
      try {
        w.Kakao.Share.sendDefault({
          objectType: "feed",
          content: { title, description: desc, link: { webUrl: url, mobileWebUrl: url } },
        });
        return;
      } catch {
        /* fall through */
      }
    }

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: { title: string; text: string; url: string }) => Promise<void> })
          .share({ title, text: desc, url });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(`${title}\n${desc}\n${url}`);
    } catch {
      /* ignore */
    }
  };

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100svh",
        background: `radial-gradient(120% 80% at 50% -10%, #131a30 0%, ${C.bg} 55%, ${C.bgDeep} 100%)`,
        color: C.ink,
        fontFamily: FONT_SANS,
        overflow: "hidden",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@500;700;900&display=swap"
      />

      <Starfield />

      {/* 상단 홈 링크 */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 880,
          margin: "0 auto",
          padding: "18px 20px 0",
        }}
      >
        <Link
          href="/"
          style={{ color: "rgba(245,241,230,0.55)", textDecoration: "none", fontSize: 13 }}
        >
          ← {t("놀자 홈", "Home")}
        </Link>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "8px 20px 96px",
        }}
      >
        {loading ? (
          <BaguaLoader t={t} />
        ) : !submitted || !result ? (
          <InputView
            a={a}
            b={b}
            setA={setA}
            setB={setB}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            t={t}
          />
        ) : (
          <ResultView
            a={a}
            b={b}
            result={result}
            onShare={handleShare}
            onReset={handleReset}
            isSharedResult={isSharedResult}
            t={t}
            locale={locale}
          />
        )}
      </div>
    </main>
  );
}

/* ============================================================
 * 입력 화면
 * ========================================================== */
function InputView({
  a,
  b,
  setA,
  setB,
  canSubmit,
  onSubmit,
  t,
}: {
  a: Person;
  b: Person;
  setA: (p: Person) => void;
  setB: (p: Person) => void;
  canSubmit: boolean;
  onSubmit: () => void;
  t: (ko: string, en: string) => string;
}) {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <header style={{ textAlign: "center", margin: "28px 0 30px" }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 13,
            color: C.gold,
            letterSpacing: "0.14em",
            marginBottom: 16,
          }}
        >
          ✦ {t("FRIEND MATCH", "FRIEND MATCH")} ✦
        </div>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: "clamp(28px, 7vw, 42px)",
            lineHeight: 1.28,
            margin: 0,
            color: C.ink,
          }}
        >
          {t("우리 사이,", "Was our bond")}
          <br />
          {t("하늘이 정해놨다", "written in the stars?")}
        </h1>
        <p style={{ marginTop: 16, color: C.sub, fontSize: 14, lineHeight: 1.7 }}>
          {t(
            "두 사람의 이름과 태어난 해로 보는 사주 기반 궁합.",
            "A saju-rooted compatibility read for two.",
          )}
        </p>
      </header>

      <div className="fm-pair">
        <PersonCard label={t("나", "Me")} person={a} setPerson={setA} accent={C.gold} t={t} />
        <div className="fm-cross">✦</div>
        <PersonCard
          label={t("친구", "Friend")}
          person={b}
          setPerson={setB}
          accent={C.lavender}
          t={t}
        />
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
        style={{
          marginTop: 30,
          width: "100%",
          padding: "17px 24px",
          borderRadius: 16,
          border: "none",
          background: canSubmit
            ? `linear-gradient(180deg, ${C.goldSoft} 0%, ${C.gold} 100%)`
            : "rgba(201,168,76,0.18)",
          color: canSubmit ? "#1a1408" : "rgba(245,241,230,0.4)",
          fontFamily: FONT_SERIF,
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: "0.04em",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "transform 0.12s, box-shadow 0.2s",
          boxShadow: canSubmit ? "0 12px 32px rgba(201,168,76,0.30)" : "none",
        }}
        onMouseDown={(e) => {
          if (canSubmit) e.currentTarget.style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
      >
        {t("궁합 보기", "See our compatibility")}
      </button>

      <p style={{ marginTop: 16, textAlign: "center", color: "rgba(154,160,184,0.7)", fontSize: 12 }}>
        {t("· 입력한 정보는 저장되지 않아요 ·", "· nothing is stored ·")}
      </p>

      <style jsx>{`
        .fm-pair {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          align-items: stretch;
        }
        .fm-cross {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${C.gold};
          font-family: ${FONT_SERIF};
          font-size: 26px;
        }
        @media (min-width: 560px) {
          .fm-pair {
            grid-template-columns: 1fr 44px 1fr;
          }
          .fm-cross {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
}

function PersonCard({
  label,
  person,
  setPerson,
  accent,
  t,
}: {
  label: string;
  person: Person;
  setPerson: (p: Person) => void;
  accent: string;
  t: (ko: string, en: string) => string;
}) {
  const year = clampYear(person.year);
  const symbol = year !== null ? ELEMENT_EMOJI[elementFromYear(year)] : "✦";

  const underline: React.CSSProperties = {
    width: "100%",
    padding: "9px 2px",
    border: "none",
    borderBottom: `1px solid rgba(245,241,230,0.22)`,
    background: "transparent",
    color: C.ink,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: FONT_SANS,
    outline: "none",
  };

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "22px 20px 24px",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          fontSize: 40,
          textAlign: "center",
          lineHeight: 1,
          filter: year !== null ? "none" : "grayscale(0.4) opacity(0.55)",
          color: accent,
        }}
      >
        {symbol}
      </div>
      <div
        style={{
          marginTop: 10,
          marginBottom: 18,
          textAlign: "center",
          fontFamily: FONT_SERIF,
          fontSize: 14,
          letterSpacing: "0.12em",
          color: accent,
        }}
      >
        {label}
      </div>

      <label style={{ display: "block", marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: C.sub, marginBottom: 2 }}>
          {t("이름 / 닉네임", "Name")}
        </div>
        <input
          type="text"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          maxLength={12}
          placeholder={t("이름", "Name")}
          style={underline}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(245,241,230,0.22)")}
        />
      </label>

      <label style={{ display: "block" }}>
        <div style={{ fontSize: 11, color: C.sub, marginBottom: 2 }}>
          {t("태어난 해", "Birth year")}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={person.year}
          onChange={(e) => setPerson({ ...person, year: e.target.value })}
          placeholder="1995"
          min={1900}
          max={2100}
          style={underline}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent)}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(245,241,230,0.22)")}
        />
      </label>
    </div>
  );
}

/* ============================================================
 * 관계 아키타입 데이터 / 선택 로직 — (데이터·로직 유지)
 * ========================================================== */
type Result = {
  i1: number;
  i2: number;
  e1: ElementKey;
  e2: ElementKey;
  total: number;
  friendship: number;
  conversation: number;
  synergy: number;
  growth: number;
  copy: PairCopy;
  archetype: RelationshipArchetype;
};

type ScoreShape = {
  total: number;
  friendship: number;
  conversation: number;
  synergy: number;
  growth: number;
  seed: number;
};

type RelationshipArchetype = {
  id: string;
  title: string;
  enTitle: string;
  verdict: string;
  enVerdict: string;
  keywords: [string, string, string, string];
  story: string;
  outsideView: string;
  secretPoint: string;
  fightPattern: string;
  makeUpStyle: string;
  togetherEffect: string;
  watchout: string;
  realLifeType: string;
  sendLine: string;
};

const RELATIONSHIP_ARCHETYPES: RelationshipArchetype[] = [
  {
    id: "all-high",
    title: "하늘이 괜히 엮은 게 아닌 사이",
    enTitle: "Not randomly written in the stars",
    verdict: "완벽하진 않아도, 둘이 붙으면 관계의 설명서가 짧아집니다.",
    enVerdict: "Not perfect, but the manual gets shorter when you are together.",
    keywords: ["눈빛 번역 가능", "같은 편 본능", "시간 삭제", "오래 가는 케미"],
    story: "둘은 처음부터 모든 게 딱 맞는 사이는 아니어도, 중요한 순간에 같은 방향을 보는 조합입니다. 한 명이 흐름을 놓치면 다른 한 명이 자연스럽게 잡아주고, 대화가 샛길로 빠져도 이상하게 결론은 같이 도착합니다. 주변에서는 운이 좋다고 말하지만, 사실은 서로의 리듬을 꽤 성실하게 배워온 관계입니다.",
    outsideView: "둘이 있으면 굳이 설명하지 않아도 편이 정해져 보입니다.",
    secretPoint: "별말 안 했는데도 상대가 지금 무슨 표정인지 대충 압니다.",
    fightPattern: "서운함은 생기지만 오래 끌기 전에 둘 다 티가 납니다.",
    makeUpStyle: "진지한 말 한마디와 뜬금없는 농담 하나면 분위기가 풀립니다.",
    togetherEffect: "계획은 작게 시작했는데 결과가 이상하게 커집니다.",
    watchout: "너무 잘 통한다고 해서 말하지 않아도 다 안다고 믿으면 삐끗할 수 있습니다.",
    realLifeType: "같은 팀이면 든든하고, 여행 가면 역할 분담이 빨리 끝나는 관계.",
    sendLine: "우리 이거 나왔는데, 설명이 좀 억울할 정도로 맞음.",
  },
  {
    id: "high-friend-talk",
    title: "말 안 해도 대충 통하는 사이",
    enTitle: "The almost-telepathic pair",
    verdict: "대화가 길지 않아도 핵심은 묘하게 전달됩니다.",
    enVerdict: "Even short talks somehow carry the whole signal.",
    keywords: ["눈빛 번역 가능", "짧은 말 긴 이해", "침묵 안 어색함", "같은 웃음 포인트"],
    story: "둘은 말이 많은 날도 좋고, 말이 적은 날도 크게 어색하지 않습니다. 설명을 길게 하지 않아도 상대가 중간 과정을 알아서 채워 넣는 편이라, 대화가 빠르게 본론으로 들어갑니다. 다만 너무 익숙해서 가끔은 고마운 걸 말로 빼먹기 쉬운 조합입니다.",
    outsideView: "왜 저 말에 웃는지 남들은 모르는데 둘만 이미 터져 있습니다.",
    secretPoint: "대화가 끝난 줄 알았는데 세 시간 뒤에 자연스럽게 이어집니다.",
    fightPattern: "서로 말투 하나에 예민해졌다가도 진짜 마음은 빨리 알아챕니다.",
    makeUpStyle: "괜히 다른 얘기를 꺼내며 다시 원래 텐션으로 돌아옵니다.",
    togetherEffect: "카페에 앉으면 할 말 없다고 해놓고 결국 오래 있습니다.",
    watchout: "아는 사이라고 생략만 하면, 중요한 감정까지 생략될 수 있습니다.",
    realLifeType: "서로의 번역기이자 오래된 채팅방 같은 관계.",
    sendLine: "우리 말 안 해도 통하는 사이래. 근데 읽씹까지 미화하면 안 됨.",
  },
  {
    id: "synergy-low-talk",
    title: "일은 잘 맞는데 말은 자주 꼬이는 사이",
    enTitle: "Great output, tangled words",
    verdict: "결과물은 좋은데 그 과정에서 자막이 조금 필요합니다.",
    enVerdict: "The output works, but the process needs subtitles.",
    keywords: ["협업 케미", "말투 번역 필요", "결과로 증명", "오해 회복형"],
    story: "둘은 같은 목표가 생기면 의외로 손발이 잘 맞습니다. 문제는 과정에서 말이 짧아지거나 의도가 다르게 들리는 순간이 잦다는 점입니다. 그래도 막상 끝나고 보면 서로가 없었으면 이만큼 못 했다는 걸 인정하게 되는, 조금 피곤하지만 쓸모가 확실한 관계입니다.",
    outsideView: "둘이 싸우는 줄 알았는데 결과물은 제일 잘 나옵니다.",
    secretPoint: "말로는 삐걱대도 일단 시작하면 역할이 저절로 나뉩니다.",
    fightPattern: "내용보다 말투 때문에 불이 붙는 경우가 많습니다.",
    makeUpStyle: "결과가 잘 나오면 둘 다 은근히 풀립니다.",
    togetherEffect: "회의는 어수선한데 마감은 이상하게 지킵니다.",
    watchout: "상대의 의도를 확인하지 않고 말투만 해석하면 손해입니다.",
    realLifeType: "같이 과제하면 투덜대다가 A 받는 조합.",
    sendLine: "우리 일은 잘 맞는데 말은 꼬이는 사이래. 너무 현실적이라 킹받음.",
  },
  {
    id: "talk-low-growth",
    title: "수다는 많은데 변화는 느린 사이",
    enTitle: "Endless talk, slow change",
    verdict: "말은 많이 하는데 실행 버튼은 가끔 늦게 눌립니다.",
    enVerdict: "Lots of talk, but the action button takes a while.",
    keywords: ["대화 주제 자동 생성", "계획만 3회차", "편한 수다", "느린 업데이트"],
    story: "둘이 만나면 대화 주제는 끊기지 않습니다. 서로의 생각을 꺼내는 데는 능하지만, 그 대화가 바로 변화로 이어지지는 않을 때가 있습니다. 그래도 이 관계의 장점은 말하는 동안 마음이 정리되고, 언젠가 그 말들이 천천히 행동으로 넘어간다는 점입니다.",
    outsideView: "둘이 또 무슨 얘기를 저렇게 오래 하나 싶어 보입니다.",
    secretPoint: "작년에도 한 얘기를 올해 더 구체적으로 다시 합니다.",
    fightPattern: "말이 많아질수록 핵심이 흐려져서 서로 지칠 수 있습니다.",
    makeUpStyle: "결국 대화로 풀지만, 중간에 딴길을 세 번 갑니다.",
    togetherEffect: "같이 있으면 아이디어는 많아지고 일정표는 조금 밀립니다.",
    watchout: "좋은 얘기가 좋은 변화가 되려면 작은 약속 하나가 필요합니다.",
    realLifeType: "새벽 대화는 깊은데 다음 날 실천은 각자 미루는 관계.",
    sendLine: "우리 수다는 많은데 변화는 느리대. 일단 이 얘기로 또 2시간 가능.",
  },
  {
    id: "growth-low-friend",
    title: "서로를 성장시키지만 편하진 않은 사이",
    enTitle: "Growth with a little friction",
    verdict: "편안함보다 자극이 먼저 오는 관계입니다.",
    enVerdict: "The spark arrives before comfort does.",
    keywords: ["성장 자극", "불편한 고마움", "현실 조언", "레벨업 관계"],
    story: "둘은 마냥 편한 조합이라기보다 서로의 빈틈을 보게 만드는 관계입니다. 상대의 한마디가 가끔은 찔리지만, 시간이 지나면 그 말 때문에 내가 조금 나아졌다는 걸 알게 됩니다. 오래 가려면 날카로운 조언 뒤에 애정 표현을 꼭 남겨야 합니다.",
    outsideView: "친한 건지 경쟁하는 건지 헷갈리지만 둘 다 은근히 신경 씁니다.",
    secretPoint: "상대에게 들은 말이 오래 남아서 나중에 행동을 바꿉니다.",
    fightPattern: "정확한 지적이 감정선을 건드리며 시작됩니다.",
    makeUpStyle: "사과보다 먼저 '그 말은 맞긴 해'가 나올 수 있습니다.",
    togetherEffect: "같이 있으면 편하진 않아도 게을러지긴 어렵습니다.",
    watchout: "성장이라는 이름으로 너무 자주 평가하지 않기.",
    realLifeType: "나를 제일 잘 놀리는데, 제일 필요한 말도 해주는 사람.",
    sendLine: "우리 편하진 않은데 성장시키는 사이래. 약간 인정하기 싫은데 맞음.",
  },
  {
    id: "all-mid",
    title: "천천히 익어가는 관계",
    enTitle: "A slow-ripening bond",
    verdict: "한 번에 폭발하진 않아도, 오래 두면 맛이 깊어집니다.",
    enVerdict: "Not explosive, but deeper with time.",
    keywords: ["느린 친밀감", "안정 상승", "서서히 가까움", "오래 보기"],
    story: "둘은 처음부터 강렬하게 맞아떨어지는 관계는 아닐 수 있습니다. 대신 시간이 쌓일수록 서로의 기준과 속도를 이해하게 되고, 그 과정에서 안정감이 생깁니다. 급하게 결론 내리기보다 자주 보고 조금씩 쌓을수록 진짜 장점이 나오는 조합입니다.",
    outsideView: "엄청 가까워 보이진 않는데 은근히 오래 갑니다.",
    secretPoint: "크게 티 내지 않아도 서로의 생활에 조금씩 들어와 있습니다.",
    fightPattern: "폭발보다는 서운함이 조용히 쌓이는 편입니다.",
    makeUpStyle: "시간을 두고 자연스럽게 다시 말을 겁니다.",
    togetherEffect: "큰 이벤트보다 작은 루틴에서 친해집니다.",
    watchout: "느린 관계라고 방치하면 그냥 멀어질 수 있습니다.",
    realLifeType: "몇 년 뒤 돌아보면 생각보다 중요한 사람이 되어 있는 관계.",
    sendLine: "우리 천천히 익어가는 관계래. 약간 장기 숙성형임.",
  },
  {
    id: "friend-low-synergy",
    title: "친하긴 한데 같이 일하면 삐걱대는 사이",
    enTitle: "Close hearts, chaotic teamwork",
    verdict: "마음은 가까운데 업무 방식은 각자 세계관이 있습니다.",
    enVerdict: "Close hearts, separate operating systems.",
    keywords: ["친밀감 높음", "협업 주의", "역할분담 필수", "놀 때 강함"],
    story: "둘은 관계 자체의 온도는 따뜻하지만, 같이 뭔가를 굴리기 시작하면 방식 차이가 드러납니다. 한 명은 빠르게 움직이고 싶고, 다른 한 명은 다르게 확인하고 싶을 수 있습니다. 그래서 이 조합은 같이 일하기보다 같이 쉬고 웃을 때 진가가 더 잘 나옵니다.",
    outsideView: "분명 친한데 팀플만 하면 표정이 복잡해집니다.",
    secretPoint: "일 얘기만 빼면 둘의 텐션은 꽤 안정적입니다.",
    fightPattern: "누가 뭘 맡을지 애매할 때 삐걱댑니다.",
    makeUpStyle: "일단 일 얘기를 내려놓고 밥 먹으면 회복됩니다.",
    togetherEffect: "놀 때는 효율이 좋고, 일할 때는 룰이 필요합니다.",
    watchout: "친하다는 이유로 역할 분담을 대충 넘기지 않기.",
    realLifeType: "여행 친구로는 좋은데 공동 프로젝트는 계약서가 필요한 사이.",
    sendLine: "우리 친한데 같이 일하면 삐걱댄대. 팀플은 잠시 보류하자.",
  },
  {
    id: "low-friend-high-growth",
    title: "처음엔 어색하지만 배울 게 많은 사이",
    enTitle: "Awkward first, useful forever",
    verdict: "편해지는 데 시간은 걸리지만, 남는 게 많은 관계입니다.",
    enVerdict: "Comfort takes time, but the relationship leaves something behind.",
    keywords: ["어색함 회복 중", "배울 점 많음", "낯가림 성장", "천천히 신뢰"],
    story: "둘은 처음부터 친밀감이 확 올라오는 조합은 아닙니다. 하지만 대화와 경험이 쌓일수록 서로에게 없는 관점이 있다는 걸 발견합니다. 친해지는 속도는 느려도, 어느 순간 '이 사람 덕분에 내가 달라졌네'라고 느끼기 쉬운 관계입니다.",
    outsideView: "처음엔 어색해 보이는데 은근히 서로를 챙깁니다.",
    secretPoint: "불편한 침묵을 지나고 나면 진짜 이야기가 나옵니다.",
    fightPattern: "친밀감이 덜 쌓인 상태에서 조언이 먼저 나오면 삐끗합니다.",
    makeUpStyle: "시간을 두고 조심스럽게 다시 접근합니다.",
    togetherEffect: "서로의 다른 세계관을 견학하게 됩니다.",
    watchout: "빨리 친해지려고 무리하면 오히려 거리가 생깁니다.",
    realLifeType: "처음엔 데면데면한데 나중에 은근히 고마워지는 사람.",
    sendLine: "우리 처음엔 어색하지만 배울 게 많은 사이래. 묘하게 설득됨.",
  },
  {
    id: "talk-synergy-low-friend",
    title: "케미는 좋은데 마음의 거리는 조절 중인 사이",
    enTitle: "Great chemistry, careful distance",
    verdict: "잘 맞는 순간은 분명한데, 친밀감은 천천히 여는 타입입니다.",
    enVerdict: "The chemistry is real; the closeness opens slowly.",
    keywords: ["케미 선명", "거리 조절", "대화 잘 굴러감", "천천히 마음 열기"],
    story: "둘은 말과 행동의 합이 꽤 잘 맞습니다. 같이 무언가를 하면 자연스럽게 흐름이 생기지만, 마음의 거리까지 바로 좁혀지는 건 아닙니다. 서로를 너무 빨리 규정하지 않고 시간을 주면, 이 케미가 진짜 친밀감으로 바뀔 가능성이 큽니다.",
    outsideView: "둘이 잘 맞아 보이는데 막상 본인들은 아직 조심스럽습니다.",
    secretPoint: "재밌게 대화하고 나서도 혼자 거리감을 다시 계산합니다.",
    fightPattern: "상대가 선을 넘었다고 느끼면 갑자기 조용해집니다.",
    makeUpStyle: "부담스럽지 않은 톤으로 다시 대화를 열어야 합니다.",
    togetherEffect: "같이 하면 속도는 나는데 감정은 천천히 따라옵니다.",
    watchout: "케미가 좋다고 친밀감도 자동이라고 착각하지 않기.",
    realLifeType: "처음엔 일로 만났다가 천천히 사적인 농담이 생기는 관계.",
    sendLine: "우리 케미는 좋은데 마음의 거리는 조절 중이래. 너무 우리 아님?",
  },
  {
    id: "low-talk-high-friend",
    title: "말은 적어도 오래 가는 사이",
    enTitle: "Few words, long bond",
    verdict: "연락이 뜸해도 관계가 끊긴 느낌은 아닙니다.",
    enVerdict: "Sparse messages, steady bond.",
    keywords: ["조용한 의리", "연락 텀 긴데 안 멀어짐", "무소식 안정", "오래 감"],
    story: "둘은 매일 연락하거나 감정을 자주 확인하는 스타일은 아닐 수 있습니다. 그래도 이상하게 끊겼다는 느낌이 적고, 필요할 때 다시 연결되는 힘이 있습니다. 이 관계의 핵심은 빈도보다 신뢰에 가깝습니다.",
    outsideView: "별로 안 친한 줄 알았는데 중요한 날엔 꼭 챙깁니다.",
    secretPoint: "몇 달 만에 연락해도 어제 본 사람처럼 시작됩니다.",
    fightPattern: "말이 부족해서 오해가 생기지만 악의는 적습니다.",
    makeUpStyle: "긴 설명보다 짧은 확인과 행동으로 풀립니다.",
    togetherEffect: "같이 있으면 굳이 텐션을 올리지 않아도 됩니다.",
    watchout: "편하다고 너무 오래 방치하면 상대가 혼자 해석할 수 있습니다.",
    realLifeType: "생일은 조용히 챙기고 위기엔 갑자기 나타나는 관계.",
    sendLine: "우리 말은 적어도 오래 가는 사이래. 연락 텀까지 들킨 느낌.",
  },
  {
    id: "friend-extreme",
    title: "서로의 흑역사를 보관 중인 관계",
    enTitle: "Each other's archive of chaos",
    verdict: "친밀감이 높아서 놀릴 거리도 자산처럼 쌓입니다.",
    enVerdict: "So close that teasing material becomes shared property.",
    keywords: ["흑역사 보관함", "놀림 방지선 있음", "편한 장난", "오래된 증거"],
    story: "둘 사이에는 남들이 모르는 에피소드가 꽤 쌓여 있습니다. 서로를 놀리지만 선은 기가 막히게 알고, 웃기게 말해도 관계의 바닥에는 편이 되어준다는 믿음이 있습니다. 이 조합은 시간이 지날수록 추억보다 증거 자료가 많아지는 타입입니다.",
    outsideView: "둘이 서로 너무 놀리는데 이상하게 기분 나빠 보이진 않습니다.",
    secretPoint: "상대의 과거 발언을 정확한 날짜감으로 기억합니다.",
    fightPattern: "장난이 선을 넘었다고 느끼는 순간 분위기가 식습니다.",
    makeUpStyle: "진심 어린 사과 뒤에 가벼운 농담으로 원래 톤을 찾습니다.",
    togetherEffect: "만나면 기억도 안 나는 옛날 얘기가 계속 발굴됩니다.",
    watchout: "놀림이 애정이라는 걸 상대도 같은 강도로 느끼는지 확인하기.",
    realLifeType: "서로의 사진첩을 공개하면 둘 다 위험해지는 사이.",
    sendLine: "우리 서로의 흑역사 보관 중인 관계래. 자료 삭제 협상하자.",
  },
  {
    id: "talk-extreme",
    title: "만나면 말 많고 헤어지면 조용한 사이",
    enTitle: "Loud together, quiet apart",
    verdict: "같이 있을 때 몰아서 충전하는 관계입니다.",
    enVerdict: "You charge the bond in intense in-person bursts.",
    keywords: ["만나면 폭주", "헤어지면 잠잠", "대화 몰아치기", "현장형 케미"],
    story: "둘은 평소 연락이 엄청 촘촘하지 않아도, 만나면 말이 한번에 터지는 편입니다. 대화가 꼬리에 꼬리를 물고, 작은 사건도 둘 사이에서는 큰 에피소드가 됩니다. 이 관계는 매일 확인하는 친밀감보다 만나서 살아나는 현장감이 강합니다.",
    outsideView: "아까 만난 사람들 맞나 싶을 정도로 말이 많아집니다.",
    secretPoint: "연락창은 조용한데 만나면 업데이트가 폭포처럼 나옵니다.",
    fightPattern: "쌓아둔 말을 한 번에 꺼내다가 과열될 수 있습니다.",
    makeUpStyle: "직접 만나서 얼굴 보고 풀 때 가장 빠릅니다.",
    togetherEffect: "짧은 약속이 긴 토크쇼로 바뀝니다.",
    watchout: "중요한 이야기는 너무 오래 묵히지 않기.",
    realLifeType: "단톡에서는 조용한데 오프라인에서 MC 되는 조합.",
    sendLine: "우리 만나면 말 많고 헤어지면 조용한 사이래. 너무 들켰다.",
  },
  {
    id: "synergy-extreme",
    title: "같은 편이면 든든하고 적이면 피곤한 사이",
    enTitle: "Powerful allies, exhausting rivals",
    verdict: "방향만 같으면 추진력이 꽤 무섭습니다.",
    enVerdict: "When aligned, the momentum gets serious.",
    keywords: ["팀플 전투력", "같은 편 버프", "결과 집착", "추진력 상승"],
    story: "둘은 같은 목표를 잡았을 때 에너지가 크게 올라갑니다. 한 명이 시작하면 다른 한 명이 밀고, 중간에 흐름이 죽을 때도 서로를 다시 끌어올립니다. 다만 방향이 어긋나는 순간 둘 다 만만치 않아서, 시작 전에 기준을 맞추는 게 중요합니다.",
    outsideView: "같은 편이면 무섭고, 반대편이면 피곤해 보입니다.",
    secretPoint: "둘 다 은근히 지기 싫어해서 결과가 좋아집니다.",
    fightPattern: "목표보다 방식에서 주도권 싸움이 생깁니다.",
    makeUpStyle: "공통 목표를 다시 확인하면 감정이 정리됩니다.",
    togetherEffect: "작은 아이디어가 프로젝트처럼 커집니다.",
    watchout: "승부욕을 관계보다 앞세우지 않기.",
    realLifeType: "같은 조 되면 성적은 오르는데 회의가 뜨거운 관계.",
    sendLine: "우리 같은 편이면 든든하고 적이면 피곤한 사이래. 인정?",
  },
  {
    id: "growth-extreme",
    title: "서로의 급발진을 받아주는 사이",
    enTitle: "The mutual growth brake and boost",
    verdict: "한 명이 흔들리면 다른 한 명이 방향을 잡아줍니다.",
    enVerdict: "When one swerves, the other finds the lane.",
    keywords: ["급발진 방지턱", "현실 조언 담당", "서로 보정", "성장 스위치"],
    story: "둘은 서로를 그냥 편하게만 두지는 않습니다. 한 명이 너무 빨리 달리면 다른 한 명이 속도를 조절하고, 한 명이 멈춰 있으면 다른 한 명이 살짝 밀어줍니다. 그래서 이 관계는 편안함과 자극 사이에서 묘하게 균형을 잡습니다.",
    outsideView: "둘이 서로를 말리다가도 결국 제일 응원합니다.",
    secretPoint: "상대가 하는 잔소리 중 일부는 실제로 도움이 됩니다.",
    fightPattern: "조언이 통제처럼 들리는 순간 예민해집니다.",
    makeUpStyle: "상대의 의도가 걱정이었다는 걸 확인하면 풀립니다.",
    togetherEffect: "각자 혼자였으면 놓쳤을 선택지를 다시 보게 됩니다.",
    watchout: "고쳐주려는 마음보다 들어주는 시간이 먼저 필요합니다.",
    realLifeType: "사고 치기 직전에 '야 잠깐' 해주는 사람.",
    sendLine: "우리 서로의 급발진을 받아주는 사이래. 너의 잔소리 지분 인정.",
  },
  {
    id: "low-one",
    title: "안 맞는 척 제일 잘 맞는 사이",
    enTitle: "Looks mismatched, works somehow",
    verdict: "한 군데가 삐걱대도 전체 그림은 이상하게 굴러갑니다.",
    enVerdict: "One part squeaks, yet the whole thing moves.",
    keywords: ["삐걱 케미", "오해 후 회복", "다름 인정", "묘한 안정감"],
    story: "둘 사이에는 분명히 잘 안 맞는 구간이 있습니다. 그런데 그 부분이 관계 전체를 망치기보다, 오히려 서로를 더 구체적으로 알게 만드는 장치처럼 작동합니다. 맞지 않는 척하면서도 계속 돌아오는 힘이 있는 관계입니다.",
    outsideView: "안 맞는다고 말하면서 계속 같이 있습니다.",
    secretPoint: "불평은 하는데 막상 없으면 허전합니다.",
    fightPattern: "같은 문제로 반복해서 삐걱댈 수 있습니다.",
    makeUpStyle: "서로의 패턴을 인정하는 말이 제일 잘 먹힙니다.",
    togetherEffect: "다른 점 때문에 에피소드가 계속 생깁니다.",
    watchout: "반복되는 문제를 개그로만 넘기면 나중에 커집니다.",
    realLifeType: "궁시렁거리면서도 결국 같이 가는 관계.",
    sendLine: "우리 안 맞는 척 제일 잘 맞는 사이래. 킹받는데 맞는 듯.",
  },
  {
    id: "default",
    title: "가끔 멀어져도 다시 돌아오는 사이",
    enTitle: "A bond that finds its way back",
    verdict: "완벽한 밀착형은 아니어도, 관계의 복귀력이 좋습니다.",
    enVerdict: "Not always close, but good at finding the way back.",
    keywords: ["복귀력 좋음", "느슨한 신뢰", "다시 연결", "편한 거리"],
    story: "둘은 늘 같은 텐션으로 붙어 있는 관계는 아닐 수 있습니다. 하지만 거리가 생겨도 완전히 끊어졌다는 느낌보다는, 다시 이어질 수 있는 여지가 남습니다. 서로의 생활을 인정하면서도 중요한 순간에는 다시 같은 편이 되는 조합입니다.",
    outsideView: "자주 붙어 있진 않아도 묘하게 관계가 유지됩니다.",
    secretPoint: "오랜만에 연락해도 생각보다 어색함 회복이 빠릅니다.",
    fightPattern: "서운함을 바로 말하지 않아서 늦게 드러날 수 있습니다.",
    makeUpStyle: "부담 없는 안부 하나로 다시 연결됩니다.",
    togetherEffect: "각자 살다가도 필요할 때 자연스럽게 모입니다.",
    watchout: "느슨함과 무심함을 헷갈리지 않기.",
    realLifeType: "오래 안 봐도 내 사람 목록에서 빠지지 않는 관계.",
    sendLine: "우리 가끔 멀어져도 다시 돌아오는 사이래. 이건 좀 좋다.",
  },
];

function pick(id: string): RelationshipArchetype {
  return RELATIONSHIP_ARCHETYPES.find((item) => item.id === id) ?? RELATIONSHIP_ARCHETYPES[RELATIONSHIP_ARCHETYPES.length - 1];
}

function selectRelationshipArchetype(shape: ScoreShape): RelationshipArchetype {
  const scores = [shape.friendship, shape.conversation, shape.synergy, shape.growth];
  const high = (n: number) => n >= 86;
  const veryHigh = (n: number) => n >= 94;
  const mid = (n: number) => n >= 72 && n < 86;
  const low = (n: number) => n < 72;
  const allHigh = scores.every(high);
  const allMid = scores.every(mid);
  const lows = scores.filter(low).length;

  if (allHigh) return pick("all-high");
  if (allMid) return pick("all-mid");
  if (high(shape.friendship) && high(shape.conversation)) return pick("high-friend-talk");
  if (high(shape.synergy) && low(shape.conversation)) return pick("synergy-low-talk");
  if (high(shape.conversation) && low(shape.growth)) return pick("talk-low-growth");
  if (high(shape.growth) && low(shape.friendship)) return pick("growth-low-friend");
  if (high(shape.friendship) && low(shape.synergy)) return pick("friend-low-synergy");
  if (low(shape.friendship) && high(shape.growth)) return pick("low-friend-high-growth");
  if (high(shape.conversation) && high(shape.synergy) && low(shape.friendship)) return pick("talk-synergy-low-friend");
  if (low(shape.conversation) && high(shape.friendship)) return pick("low-talk-high-friend");
  if (veryHigh(shape.friendship)) return pick("friend-extreme");
  if (veryHigh(shape.conversation)) return pick("talk-extreme");
  if (veryHigh(shape.synergy)) return pick("synergy-extreme");
  if (veryHigh(shape.growth)) return pick("growth-extreme");
  if (lows > 0) return pick("low-one");
  return pick("default");
}

function scoreRangeText(name: string, value: number): string {
  if (value >= 90) return `${name} ${value}점: 거의 설명서 없이 작동하는 관계입니다. 말보다 패턴이 먼저 맞습니다.`;
  if (value >= 80) return `${name} ${value}점: 꽤 잘 맞지만 가끔 튜닝이 필요합니다. 서로의 속도를 확인하면 더 좋아집니다.`;
  if (value >= 70) return `${name} ${value}점: 가능성은 충분합니다. 다만 상대의 리듬을 조금 더 읽어야 오래 편합니다.`;
  if (value >= 60) return `${name} ${value}점: 맞추려면 약간의 번역기가 필요합니다. 다름을 개그로만 넘기지 않는 게 핵심입니다.`;
  return `${name} ${value}점: 서로 다른 세계관에서 접속한 상태입니다. 천천히 룰을 맞추면 의외의 장점이 보입니다.`;
}

function buildKoreanShareText(aName: string, bName: string, result: Result): string {
  const keywords = result.archetype.keywords.slice(0, 3).join(" / ");
  return `우리 사이 결과: '${result.archetype.title}' 나왔는데, 설명이 너무 우리임.\n하늘이 정한 우리 사이 점수 ${result.total}점.\n관계 키워드: ${keywords}\n${result.archetype.sendLine}`;
}

/* ============================================================
 * 결과 화면
 * ========================================================== */
function ResultView({
  a,
  b,
  result,
  onShare,
  onReset,
  isSharedResult,
  t,
  locale,
}: {
  a: Person;
  b: Person;
  result: Result;
  onShare: () => void;
  onReset: () => void;
  isSharedResult: boolean;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}) {
  const archeTitle = locale === "ko" ? result.archetype.title : result.archetype.enTitle;
  const verdict = locale === "ko" ? result.archetype.verdict : result.archetype.enVerdict;
  const keywords = result.archetype.keywords.slice(0, 4);
  const total = useCountUp(result.total, 1400);

  const emojiA = ELEMENT_EMOJI[result.e1];
  const emojiB = ELEMENT_EMOJI[result.e2];
  const elemA =
    locale === "ko"
      ? `${ELEMENT_KO_NAME[result.e1]}(${ELEMENT_HANJA[result.e1]})`
      : ELEMENT_EN_NAME[result.e1];
  const elemB =
    locale === "ko"
      ? `${ELEMENT_KO_NAME[result.e2]}(${ELEMENT_HANJA[result.e2]})`
      : ELEMENT_EN_NAME[result.e2];

  const categories: Array<{
    icon: string;
    name: string;
    sub: string;
    score: number;
    body: string;
    accent: string;
  }> = [
    {
      icon: "🤝",
      name: t("우정", "Friendship"),
      sub: t("함께할수록 깊어지는 사이", "Deepens the more you stay near"),
      score: result.friendship,
      accent: C.gold,
      body:
        locale === "ko"
          ? `${scoreRangeText("우정", result.friendship)}\n\n${result.copy.friendship[locale]}`
          : result.copy.friendship[locale],
    },
    {
      icon: "💬",
      name: t("대화", "Conversation"),
      sub: t("말이 통하는 정도", "How well your words meet"),
      score: result.conversation,
      accent: C.lavender,
      body:
        locale === "ko"
          ? `${scoreRangeText("대화", result.conversation)}\n\n${result.copy.conversation[locale]}`
          : result.copy.conversation[locale],
    },
    {
      icon: "✨",
      name: t("시너지", "Synergy"),
      sub: t("같이하면 1+1=3이 되는가", "Whether 1+1 turns into 3"),
      score: result.synergy,
      accent: C.gold,
      body:
        locale === "ko"
          ? `${scoreRangeText("시너지", result.synergy)}\n\n${result.copy.synergy[locale]}`
          : result.copy.synergy[locale],
    },
    {
      icon: "🌱",
      name: t("성장", "Growth"),
      sub: t("서로에게 좋은 영향을 주는가", "Whether you push each other up"),
      score: result.growth,
      accent: C.lavender,
      body:
        locale === "ko"
          ? `${scoreRangeText("성장", result.growth)}\n\n${result.copy.growth[locale]}`
          : result.copy.growth[locale],
    },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* 상단: 두 이름 */}
      <header style={{ textAlign: "center", margin: "30px 0 6px" }}>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: "clamp(26px, 6.4vw, 40px)",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          <span style={{ color: C.goldSoft }}>{a.name}</span>
          <span style={{ color: C.sub, margin: "0 12px", fontWeight: 400 }}>×</span>
          <span style={{ color: C.lavenderSoft }}>{b.name}</span>
        </h1>
      </header>

      {/* 종합 점수 카운트업 */}
      <div style={{ textAlign: "center", marginTop: 6 }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: 80,
            lineHeight: 1,
            color: C.gold,
            textShadow: "0 8px 40px rgba(201,168,76,0.35)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {total}
        </div>
        <div style={{ marginTop: 2, color: C.sub, fontSize: 13, letterSpacing: "0.1em" }}>
          / 100 · {t("하늘이 정한 점수", "score from the stars")}
        </div>
      </div>

      {/* 아키타입 제목 + 한 줄 총평 */}
      <div style={{ textAlign: "center", marginTop: 22 }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "clamp(19px, 4vw, 24px)",
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.4,
          }}
        >
          {archeTitle}
        </div>
        <p
          style={{
            margin: "12px auto 0",
            maxWidth: 460,
            fontStyle: "italic",
            color: "rgba(245,241,230,0.78)",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          “{verdict}”
        </p>
      </div>

      {/* 오행 조합: 금색별 × 라벤더별 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: 24,
        }}
      >
        <ElementBadge emoji={emojiA} name={elemA} accent={C.gold} />
        <span style={{ color: C.sub, fontSize: 18 }}>✦</span>
        <ElementBadge emoji={emojiB} name={elemB} accent={C.lavender} />
      </div>

      {/* 키워드 칩 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        {keywords.map((kw) => (
          <span
            key={kw}
            style={{
              padding: "6px 13px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${C.cardBorder}`,
              fontSize: 12.5,
              color: "rgba(245,241,230,0.85)",
            }}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* 4개 카테고리 카드 */}
      <section className="fm-cats" style={{ marginTop: 30 }}>
        {categories.map((cat) => (
          <CategoryCard key={cat.name} {...cat} />
        ))}
      </section>

      {/* 관계 서사 (한국어) */}
      {locale === "ko" ? (
        <section
          style={{
            marginTop: 18,
            padding: 22,
            borderRadius: 20,
            background: C.card,
            border: `1px solid ${C.cardBorder}`,
          }}
        >
          <div style={{ fontFamily: FONT_SERIF, color: C.goldSoft, fontSize: 17, fontWeight: 800 }}>
            {t("둘의 관계 서사", "Your story")}
          </div>
          <p
            style={{
              margin: "12px 0 0",
              color: "rgba(245,241,230,0.84)",
              fontSize: 14.5,
              lineHeight: 1.85,
            }}
          >
            {result.archetype.story}
          </p>
        </section>
      ) : null}

      {/* 광고 슬롯 */}
      <div style={{ margin: "22px 0" }}>
        <AdBottom />
      </div>

      {/* 미니 인사이트 (한국어) */}
      {locale === "ko" ? (
        <section className="fm-insights">
          <MiniInsight title="남들이 보는 우리" body={result.archetype.outsideView} />
          <MiniInsight title="둘만 아는 포인트" body={result.archetype.secretPoint} />
          <MiniInsight title="싸우면 생기는 일" body={result.archetype.fightPattern} />
          <MiniInsight title="화해 방식" body={result.archetype.makeUpStyle} />
          <MiniInsight title="같이 있으면" body={result.archetype.togetherEffect} />
          <MiniInsight title="주의할 점" body={result.archetype.watchout} />
          <MiniInsight title="현실 관계로 치면" body={result.archetype.realLifeType} />
          <MiniInsight title="친구에게 한 줄" body={result.archetype.sendLine} />
        </section>
      ) : null}

      {/* 하단: 공유용 캡처 카드 + 버튼 */}
      <div>
        <div>
            <div
              id="result-card"
              style={{
                marginTop: 28,
                padding: "34px 28px 30px",
                borderRadius: 24,
                background: `radial-gradient(120% 90% at 50% 0%, #1b2440 0%, #111935 45%, ${C.bgDeep} 100%)`,
                border: "1px solid rgba(201,168,76,0.28)",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: C.gold,
                }}
              >
                ✦ {t("우리 사이, 하늘이 정해놨다", "WRITTEN IN THE STARS")} ✦
              </div>

              <div
                style={{
                  marginTop: 18,
                  fontFamily: FONT_SERIF,
                  fontWeight: 900,
                  fontSize: "clamp(22px, 5.4vw, 30px)",
                  lineHeight: 1.3,
                }}
              >
                <span style={{ color: C.goldSoft }}>{a.name}</span>
                <span style={{ color: C.sub, margin: "0 10px", fontWeight: 400 }}>×</span>
                <span style={{ color: C.lavenderSoft }}>{b.name}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 8,
                  fontSize: 22,
                }}
              >
                <span>{emojiA}</span>
                <span style={{ color: C.sub, fontSize: 15 }}>×</span>
                <span>{emojiB}</span>
              </div>

              <div
                style={{
                  marginTop: 14,
                  fontFamily: FONT_SERIF,
                  fontWeight: 900,
                  fontSize: 64,
                  lineHeight: 1,
                  color: C.gold,
                  textShadow: "0 6px 28px rgba(201,168,76,0.4)",
                }}
              >
                {result.total}
                <span style={{ fontSize: 22, color: C.sub, fontWeight: 400 }}> / 100</span>
              </div>

              <div
                style={{
                  marginTop: 16,
                  fontFamily: FONT_SERIF,
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.ink,
                  lineHeight: 1.4,
                }}
              >
                {archeTitle}
              </div>
              <p
                style={{
                  margin: "10px auto 0",
                  maxWidth: 380,
                  fontStyle: "italic",
                  color: "rgba(245,241,230,0.75)",
                  fontSize: 13.5,
                  lineHeight: 1.7,
                }}
              >
                “{verdict}”
              </p>

              <div
                style={{
                  marginTop: 22,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(245,241,230,0.12)",
                  fontFamily: FONT_SERIF,
                  letterSpacing: "0.16em",
                  fontSize: 14,
                  color: C.goldSoft,
                }}
              >
                nolza.fun
              </div>
            </div>

            {/* 버튼 영역 (캡처 제외) */}
            <div data-share-card-skip="true" style={{ marginTop: 18 }}>
              <ShareButtons onShare={onShare} t={t} />
              <button
                type="button"
                onClick={onReset}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "13px",
                  borderRadius: 14,
                  border: "1px solid rgba(245,241,230,0.18)",
                  background: "transparent",
                  color: "rgba(245,241,230,0.75)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isSharedResult ? t("나도 해보기", "Try it myself") : t("다시 하기", "Try again")}
              </button>
            </div>
        </div>
      </div>

      <style jsx>{`
        .fm-cats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        .fm-insights {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 4px;
        }
        @media (min-width: 600px) {
          .fm-cats {
            grid-template-columns: 1fr 1fr;
          }
          .fm-insights {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function ElementBadge({ emoji, name, accent }: { emoji: string; name: string; accent: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${accent}55`,
      }}
    >
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span style={{ fontFamily: FONT_SERIF, fontSize: 14, color: accent, fontWeight: 700 }}>
        {name}
      </span>
    </div>
  );
}

/* ShareCard 의 이미지 저장 버튼 + 카카오 공유 버튼 묶음 */
function ShareButtons({
  onShare,
  t,
}: {
  onShare: () => void;
  t: (ko: string, en: string) => string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <ImageSaveButton t={t} />
      <button
        type="button"
        onClick={onShare}
        style={{
          padding: "14px",
          borderRadius: 14,
          border: "none",
          background: "#FEE500",
          color: "#191600",
          fontSize: 14.5,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {t("카카오 공유", "Share")}
      </button>
    </div>
  );
}

/* 이미지 저장 버튼 — 가장 가까운 #result-card 를 html-to-image 로 캡처 */
function ImageSaveButton({ t }: { t: (ko: string, en: string) => string }) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handle = async () => {
    if (saving) return;
    const node = document.getElementById("result-card");
    if (!node) return;
    setSaving(true);
    setDone(false);
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: C.bgDeep,
        filter: (n: HTMLElement) => {
          if (n.tagName === "IFRAME") return false;
          if (n.dataset?.shareCardSkip === "true") return false;
          return true;
        },
      });
      if (!blob) throw new Error("no-blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "friend-match.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      console.error("save image failed:", err);
      alert(t("이미지 저장에 실패했어요. 화면을 캡처해주세요.", "Couldn't save. Please screenshot."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={saving}
      style={{
        padding: "14px",
        borderRadius: 14,
        border: `1px solid ${C.gold}`,
        background: "rgba(201,168,76,0.12)",
        color: C.goldSoft,
        fontSize: 14.5,
        fontWeight: 700,
        cursor: saving ? "wait" : "pointer",
        opacity: saving ? 0.7 : 1,
      }}
    >
      {done ? t("저장됨", "Saved") : saving ? t("저장 중…", "Saving…") : `↓ ${t("이미지 저장", "Save")}`}
    </button>
  );
}

function CategoryCard({
  icon,
  name,
  sub,
  score,
  body,
  accent,
}: {
  icon: string;
  name: string;
  sub: string;
  score: number;
  body: string;
  accent: string;
}) {
  const v = useCountUp(score, 900);
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 18,
        padding: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 700, color: C.ink }}>
            {name}
          </div>
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 1 }}>{sub}</div>
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 24,
            fontWeight: 900,
            color: accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {v}
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          height: 6,
          borderRadius: 999,
          background: "rgba(245,241,230,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${C.lavender} 0%, ${C.gold} 100%)`,
            borderRadius: 999,
            transition: "width 1.1s cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        />
      </div>

      <p
        style={{
          marginTop: 12,
          fontSize: 13,
          lineHeight: 1.7,
          color: "rgba(245,241,230,0.8)",
          whiteSpace: "pre-line",
        }}
      >
        {body}
      </p>
    </div>
  );
}

function MiniInsight({ title, body }: { title: string; body: string }) {
  return (
    <article
      style={{
        padding: 16,
        borderRadius: 16,
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
      }}
    >
      <div style={{ fontFamily: FONT_SERIF, color: C.goldSoft, fontWeight: 800, fontSize: 14 }}>
        {title}
      </div>
      <p style={{ margin: "8px 0 0", color: "rgba(245,241,230,0.8)", fontSize: 13, lineHeight: 1.7 }}>
        {body}
      </p>
    </article>
  );
}

/* ============================================================
 * Suspense 래퍼 + 폴백
 * ========================================================== */
export default function FriendMatchPage() {
  return (
    <Suspense fallback={<FriendMatchFallback />}>
      <FriendMatchInner />
    </Suspense>
  );
}

function FriendMatchFallback() {
  return (
    <main
      style={{
        minHeight: "100svh",
        background: `radial-gradient(120% 80% at 50% -10%, #131a30 0%, ${C.bg} 55%, ${C.bgDeep} 100%)`,
        color: C.ink,
        fontFamily: FONT_SANS,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", color: C.sub }}>
        <div style={{ fontSize: 30, color: C.goldSoft }}>✦</div>
        <p style={{ marginTop: 12, fontFamily: FONT_SERIF }}>우리 사이, 하늘이 정해놨다</p>
      </div>
    </main>
  );
}
