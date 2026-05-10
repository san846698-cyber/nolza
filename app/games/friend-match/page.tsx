"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { AdBottom } from "@/app/components/Ads";
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

/* ---------------- 색상 ---------------- */
const C = {
  bg: "#0f0f1a",
  paper: "#171726",
  paper2: "#1f1f30",
  ink: "#f5f1e6",
  sub: "#a09cb5",
  gold: "#c9a84c",
  goldSoft: "#e6c878",
  lavender: "#a78bfa",
  line: "rgba(245,241,230,0.10)",
};

const FONT_SERIF = `"Noto Serif KR", "Noto Serif", Georgia, serif`;
const FONT_SANS = `"Noto Sans KR", "Noto Sans", system-ui, sans-serif`;

/* ---------------- 점수 ---------------- */
function score(a: number, b: number, salt: number): number {
  return ((a * 7 + b * 13 + (a + b) * 3 + salt * 11) % 41) + 60;
}

function totalScore(a: number, b: number) {
  return score(a, b, 0);
}
function friendshipScore(a: number, b: number) {
  return score(a, b, 1);
}
function conversationScore(a: number, b: number) {
  return score(a, b, 2);
}
function synergyScore(a: number, b: number) {
  return score(a, b, 3);
}
function growthScore(a: number, b: number) {
  return score(a, b, 4);
}


/* ---------------- 모드 / 입력 ---------------- */
type Person = { name: string; year: string };

function clampYear(y: string): number | null {
  const n = parseInt(y, 10);
  if (!Number.isFinite(n)) return null;
  if (n < 1900 || n > 2100) return null;
  return n;
}

function encodeShareUrl(a: Person, b: Person): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams();
  params.set("a", `${a.name},${a.year}`);
  params.set("b", `${b.name},${b.year}`);
  return `${window.location.origin}/games/friend-match?${params.toString()}`;
}

/* ---------------- 카운트업 훅 ---------------- */
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

/* ---------------- 페이지 ---------------- */
function FriendMatchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, locale } = useLocale();

  const [a, setA] = useState<Person>({ name: "", year: "" });
  const [b, setB] = useState<Person>({ name: "", year: "" });
  const [submitted, setSubmitted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // URL 파라미터로 들어온 경우 자동 결과
  useEffect(() => {
    const ap = params.get("a");
    const bp = params.get("b");
    if (ap && bp) {
      const [an, ay] = ap.split(",");
      const [bn, by] = bp.split(",");
      if (an && ay && bn && by && clampYear(ay) && clampYear(by)) {
        setA({ name: an, year: ay });
        setB({ name: bn, year: by });
        setSubmitted(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yearA = clampYear(a.year);
  const yearB = clampYear(b.year);
  const canSubmit =
    a.name.trim().length > 0 &&
    b.name.trim().length > 0 &&
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
    };
  }, [submitted, yearA, yearB]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const url = encodeShareUrl(a, b);
    setSubmitted(true);
    // URL을 갱신하여 새로고침/공유에도 결과가 남도록.
    if (typeof window !== "undefined") {
      const path = url.replace(window.location.origin, "");
      router.replace(path);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setA({ name: "", year: "" });
    setB({ name: "", year: "" });
    setShareCopied(false);
    router.replace("/games/friend-match");
  };

  const handleShare = async () => {
    if (!result) return;
    const url = encodeShareUrl(a, b);
    const title = t(
      `${a.name}과 ${b.name}의 궁합은 ${result.total}점!`,
      `${a.name} × ${b.name}: ${result.total} / 100`,
    );
    const desc = result.copy.summary[locale];

    // Kakao SDK 가 있으면 사용, 없으면 navigator.share, 없으면 클립보드.
    const w = typeof window !== "undefined" ? (window as unknown as {
      Kakao?: { isInitialized?: () => boolean; Share?: { sendDefault: (a: unknown) => void } };
    }) : undefined;
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
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.ink,
        fontFamily: FONT_SANS,
        paddingBottom: 80,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@500;700;900&display=swap"
      />

      {/* 헤더 */}
      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        <div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{ fontSize: 12, color: C.sub, textDecoration: "none" }}
          >
            ← {t("놀자.fun으로 돌아가기", "Back to nolza.fun")}
          </Link>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: C.gold, letterSpacing: "0.05em" }}>
            ✦ {t("우리 사이, 하늘이 정해놨다", "Written in the stars")}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px" }}>
        {!submitted || !result ? (
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
            shareCopied={shareCopied}
            t={t}
            locale={locale}
          />
        )}
      </div>
    </main>
  );
}

/* ---------------- 입력 화면 ---------------- */
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
    <>
      <header style={{ textAlign: "center", marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 1.2,
            margin: 0,
            color: C.ink,
          }}
        >
          {t("우리 사이, 하늘이 정해놨다", "Was it written in the stars?")}
        </h1>
        <p style={{ marginTop: 14, color: C.sub, fontSize: 14, lineHeight: 1.7 }}>
          {t(
            "두 사람의 생년월일로 사주 기반 궁합을 봐드려요. 가볍게 보지만, 결은 진짜.",
            "A saju-rooted compatibility read for two — light to play with, real in tone.",
          )}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
          alignItems: "stretch",
          position: "relative",
        }}
        className="fm-grid"
      >
        <PersonCard
          label={t("나", "Me")}
          person={a}
          setPerson={setA}
          accent={C.gold}
          t={t}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.gold,
            fontFamily: FONT_SERIF,
            fontSize: 28,
          }}
          className="fm-divider"
        >
          ✦
        </div>
        <PersonCard
          label={t("친구", "Friend")}
          person={b}
          setPerson={setB}
          accent={C.lavender}
          t={t}
        />
      </div>

      <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          style={{
            padding: "14px 36px",
            borderRadius: 999,
            border: "none",
            background: canSubmit ? C.gold : "rgba(201,168,76,0.25)",
            color: canSubmit ? "#1a1408" : "rgba(245,241,230,0.5)",
            fontFamily: FONT_SERIF,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.04em",
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "transform 0.15s",
            boxShadow: canSubmit ? "0 8px 24px rgba(201,168,76,0.25)" : "none",
          }}
          onMouseDown={(e) => {
            if (canSubmit) (e.currentTarget.style.transform = "scale(0.97)");
          }}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          {t("궁합 보기", "See our compatibility")}
        </button>
      </div>

      <p style={{ marginTop: 18, textAlign: "center", color: C.sub, fontSize: 12 }}>
        {t("· 데이터는 저장되지 않아요 ·", "· nothing is stored ·")}
      </p>

      <style jsx>{`
        @media (min-width: 720px) {
          :global(.fm-grid) {
            grid-template-columns: 1fr 60px 1fr !important;
          }
          :global(.fm-divider) {
            font-size: 36px !important;
          }
        }
      `}</style>
    </>
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
  return (
    <div
      style={{
        background: C.paper,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        padding: 22,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontSize: 14,
          letterSpacing: "0.1em",
          color: accent,
          marginBottom: 14,
        }}
      >
        {label.toUpperCase()}
      </div>

      <label style={{ display: "block", marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>
          {t("이름 (또는 닉네임)", "Name (or nickname)")}
        </div>
        <input
          type="text"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          placeholder={t("예: 유빈", "e.g. Yubin")}
          maxLength={12}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            background: C.paper2,
            color: C.ink,
            fontSize: 15,
            fontFamily: FONT_SANS,
            outline: "none",
          }}
        />
      </label>

      <label style={{ display: "block" }}>
        <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>
          {t("출생 연도", "Birth year")}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={person.year}
          onChange={(e) => setPerson({ ...person, year: e.target.value })}
          placeholder="1995"
          min={1900}
          max={2100}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            background: C.paper2,
            color: C.ink,
            fontSize: 15,
            fontFamily: FONT_SANS,
            outline: "none",
          }}
        />
      </label>
    </div>
  );
}

/* ---------------- 결과 화면 ---------------- */
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
};

function ResultView({
  a,
  b,
  result,
  onShare,
  onReset,
  shareCopied,
  t,
  locale,
}: {
  a: Person;
  b: Person;
  result: Result;
  onShare: () => void;
  onReset: () => void;
  shareCopied: boolean;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}) {
  const total = useCountUp(result.total, 1200);

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
  }> = [
    {
      icon: "🤝",
      name: t("우정", "Friendship"),
      sub: t("함께할수록 깊어지는 사이", "Deepens the more you stay near"),
      score: result.friendship,
      body: result.copy.friendship[locale],
    },
    {
      icon: "💬",
      name: t("대화", "Conversation"),
      sub: t("말이 통하는 정도", "How well your words meet"),
      score: result.conversation,
      body: result.copy.conversation[locale],
    },
    {
      icon: "✨",
      name: t("시너지", "Synergy"),
      sub: t("같이하면 1+1=3이 되는가", "Whether 1+1 turns into 3"),
      score: result.synergy,
      body: result.copy.synergy[locale],
    },
    {
      icon: "🌱",
      name: t("성장", "Growth"),
      sub: t("서로에게 좋은 영향을 주는가", "Whether you push each other up"),
      score: result.growth,
      body: result.copy.growth[locale],
    },
  ];

  return (
    <>
      {/* 상단 — 두 이름 + 종합 점수 */}
      <section style={{ textAlign: "center", margin: "8px 0 32px" }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: C.ink,
          }}
        >
          {a.name}
          <span style={{ color: C.gold, margin: "0 10px" }}>×</span>
          {b.name}
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            letterSpacing: "0.15em",
            lineHeight: 1,
          }}
        >
          {emojiA} <span style={{ color: C.gold, fontSize: 22 }}>×</span> {emojiB}
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: C.sub, fontFamily: FONT_SERIF }}>
          {elemA} · {elemB}
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "clamp(72px, 16vw, 132px)",
              fontWeight: 900,
              color: C.gold,
              lineHeight: 1,
              textShadow: "0 0 40px rgba(201,168,76,0.35)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {total}
          </span>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 24, color: C.sub }}>
            / 100
          </span>
        </div>

        <p
          style={{
            marginTop: 18,
            fontFamily: FONT_SERIF,
            fontSize: "clamp(16px, 2.4vw, 20px)",
            color: C.goldSoft,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "18px auto 0",
          }}
        >
          “{result.copy.summary[locale]}”
        </p>
      </section>

      {/* 카테고리 카드 4개 */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 14,
        }}
        className="fm-cat-grid"
      >
        {categories.slice(0, 2).map((cat) => (
          <CategoryCard key={cat.name} {...cat} />
        ))}
      </section>

      {/* AdSense 슬롯 — 결과 카드 사이 */}
      <div style={{ margin: "20px 0" }}>
        <AdBottom />
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 14,
        }}
        className="fm-cat-grid"
      >
        {categories.slice(2).map((cat) => (
          <CategoryCard key={cat.name} {...cat} />
        ))}
      </section>

      {/* 하단 총평 카드 */}
      <section
        style={{
          marginTop: 26,
          padding: 26,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldSoft} 60%, #b58a2c 100%)`,
          color: "#1a1408",
          boxShadow: "0 14px 40px rgba(201,168,76,0.25)",
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontSize: 13, opacity: 0.7, letterSpacing: "0.08em" }}>
          {t("이 조합의 한 문장", "The one line for this pair")}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT_SERIF,
            fontSize: "clamp(20px, 3.2vw, 26px)",
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {result.copy.title[locale]}
        </div>
        <div style={{ marginTop: 18, fontSize: 14, lineHeight: 1.7, opacity: 0.85 }}>
          {result.copy.summary[locale]}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {result.copy.tags[locale].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(26,20,8,0.15)",
                fontFamily: FONT_SANS,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 액션 버튼 */}
      <div
        style={{
          marginTop: 28,
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onShare}
          style={{
            padding: "13px 24px",
            borderRadius: 999,
            border: "none",
            background: "#fee500",
            color: "#191600",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: FONT_SANS,
          }}
        >
          {shareCopied
            ? t("✓ 링크 복사됨", "✓ Link copied")
            : t("💬 카카오톡 공유", "💬 Share")}
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{
            padding: "13px 24px",
            borderRadius: 999,
            border: `1px solid ${C.line}`,
            background: "transparent",
            color: C.ink,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: FONT_SANS,
          }}
        >
          ↻ {t("다시 하기", "Try again")}
        </button>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link
          href="/"
          style={{ color: C.sub, fontSize: 13, textDecoration: "none" }}
        >
          ← {t("놀자.fun에서 다른 게임", "More games on nolza.fun")}
        </Link>
      </div>

      <style jsx>{`
        @media (min-width: 720px) {
          :global(.fm-cat-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

function CategoryCard({
  icon,
  name,
  sub,
  score,
  body,
}: {
  icon: string;
  name: string;
  sub: string;
  score: number;
  body: string;
}) {
  const v = useCountUp(score, 900);
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div
      style={{
        background: C.paper,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        padding: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 17,
              fontWeight: 700,
              color: C.ink,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{sub}</div>
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 26,
            fontWeight: 900,
            color: C.gold,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {v}
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
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
          marginTop: 14,
          fontSize: 13.5,
          lineHeight: 1.75,
          color: "rgba(245,241,230,0.82)",
        }}
      >
        {body}
      </p>
    </div>
  );
}

export default function FriendMatchPage() {
  return (
    <Suspense fallback={null}>
      <FriendMatchInner />
    </Suspense>
  );
}
