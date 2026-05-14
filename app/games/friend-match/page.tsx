"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { AdBottom } from "@/app/components/Ads";
import { ShareCard } from "@/app/components/ShareCard";
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
      `${a.name}와 ${b.name}: ${result.archetype.title} (${result.total}점)`,
      `${a.name} × ${b.name}: ${result.total} / 100`,
    );
    const desc = locale === "ko"
      ? buildKoreanShareText(a.name, b.name, result)
      : `${a.name} and ${b.name}: ${result.archetype.enTitle}. ${result.archetype.enVerdict}`;

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
        minHeight: "100svh",
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
          {t("우리 궁합 보기", "See our compatibility")}
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
          {t("이름 또는 닉네임", "Name or nickname")}
        </div>
        <input
          type="text"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          maxLength={12}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: `1px solid rgba(245,241,230,0.18)`,
            background: "rgba(255,255,255,0.045)",
            color: C.ink,
            fontSize: 16,
            fontWeight: 600,
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
            border: `1px solid rgba(245,241,230,0.18)`,
            background: "rgba(255,255,255,0.045)",
            color: C.ink,
            fontSize: 16,
            fontWeight: 600,
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
      body: locale === "ko"
        ? `${scoreRangeText("우정", result.friendship)}\n\n${result.copy.friendship[locale]}`
        : result.copy.friendship[locale],
    },
    {
      icon: "💬",
      name: t("대화", "Conversation"),
      sub: t("말이 통하는 정도", "How well your words meet"),
      score: result.conversation,
      body: locale === "ko"
        ? `${scoreRangeText("대화", result.conversation)}\n\n${result.copy.conversation[locale]}`
        : result.copy.conversation[locale],
    },
    {
      icon: "✨",
      name: t("시너지", "Synergy"),
      sub: t("같이하면 1+1=3이 되는가", "Whether 1+1 turns into 3"),
      score: result.synergy,
      body: locale === "ko"
        ? `${scoreRangeText("시너지", result.synergy)}\n\n${result.copy.synergy[locale]}`
        : result.copy.synergy[locale],
    },
    {
      icon: "🌱",
      name: t("성장", "Growth"),
      sub: t("서로에게 좋은 영향을 주는가", "Whether you push each other up"),
      score: result.growth,
      body: locale === "ko"
        ? `${scoreRangeText("성장", result.growth)}\n\n${result.copy.growth[locale]}`
        : result.copy.growth[locale],
    },
  ];

  return (
    <ShareCard
      filename={`nolza-friend-match-${a.name}x${b.name}`}
      locale={locale}
      buttonLabel={{ ko: "결과 이미지 저장", en: "Save result image" }}
      backgroundColor={C.bg}
      buttonStyle={{
        padding: "13px 24px",
        borderRadius: 999,
        border: `1px solid ${C.gold}`,
        background: "transparent",
        color: C.gold,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        fontFamily: FONT_SANS,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
      }}
    >
      {({ cardRef }) => (
        <>
        <div ref={cardRef} style={{ background: C.bg, paddingBottom: 8 }}>
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

        <div
          style={{
            margin: "18px auto 0",
            maxWidth: 680,
            padding: 24,
            borderRadius: 24,
            border: `1px solid ${C.line}`,
            background: "linear-gradient(180deg, rgba(201,168,76,0.16), rgba(255,255,255,0.04))",
            boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
          }}
        >
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "clamp(24px, 5.6vw, 40px)",
              fontWeight: 900,
              color: C.goldSoft,
              lineHeight: 1.25,
            }}
          >
            {locale === "ko" ? result.archetype.title : result.archetype.enTitle}
          </div>
          <p
            style={{
              margin: "12px auto 0",
              fontSize: "clamp(15px, 2.4vw, 18px)",
              color: C.ink,
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            {locale === "ko" ? result.archetype.verdict : result.archetype.enVerdict}
          </p>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {result.archetype.keywords.slice(0, 4).map((keyword) => (
              <span
                key={keyword}
                style={{
                  padding: "7px 12px",
                  borderRadius: 999,
                  border: `1px solid ${C.line}`,
                  background: "rgba(15,15,26,0.62)",
                  color: C.ink,
                  fontSize: 13,
                  lineHeight: 1.25,
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
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
      {locale === "ko" ? (
        <section style={{ marginBottom: 18 }}>
          <ResultStoryCard
            title="둘의 관계 서사"
            body={result.archetype.story}
            highlight={buildKoreanShareText(a.name, b.name, result)}
          />
        </section>
      ) : null}

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
      {locale === "ko" ? (
        <section
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 12,
          }}
          className="fm-insight-grid"
        >
          <MiniInsight title="남들이 보는 우리" body={result.archetype.outsideView} />
          <MiniInsight title="둘만 아는 포인트" body={result.archetype.secretPoint} />
          <MiniInsight title="싸우면 생기는 일" body={result.archetype.fightPattern} />
          <MiniInsight title="화해 방식" body={result.archetype.makeUpStyle} />
          <MiniInsight title="같이 있으면 생기는 현상" body={result.archetype.togetherEffect} />
          <MiniInsight title="주의할 점" body={result.archetype.watchout} />
          <MiniInsight title="현실 관계로 치면" body={result.archetype.realLifeType} />
          <MiniInsight title="친구에게 보내는 한 줄" body={result.archetype.sendLine} />
        </section>
      ) : null}

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
          {locale === "ko" ? result.archetype.title : result.copy.title[locale]}
        </div>
        <div style={{ marginTop: 18, fontSize: 14, lineHeight: 1.7, opacity: 0.85 }}>
          {locale === "ko" ? result.archetype.sendLine : result.copy.summary[locale]}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {(locale === "ko" ? result.archetype.keywords : result.copy.tags[locale]).map((tag) => (
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

        </div>
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
          :global(.fm-insight-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
        </>
      )}
    </ShareCard>
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

function ResultStoryCard({
  title,
  body,
  highlight,
}: {
  title: string;
  body: string;
  highlight: string;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: C.paper,
        border: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          color: C.goldSoft,
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        {title}
      </div>
      <p style={{ margin: "12px 0 0", color: "rgba(245,241,230,0.86)", fontSize: 15, lineHeight: 1.85 }}>
        {body}
      </p>
      <div
        style={{
          marginTop: 16,
          padding: "14px 16px",
          borderRadius: 16,
          background: "rgba(201,168,76,0.12)",
          border: "1px solid rgba(201,168,76,0.22)",
          color: C.goldSoft,
          fontSize: 13.5,
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {highlight}
      </div>
    </div>
  );
}

function MiniInsight({ title, body }: { title: string; body: string }) {
  return (
    <article
      style={{
        minHeight: 132,
        padding: 18,
        borderRadius: 18,
        background: C.paper,
        border: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          color: C.goldSoft,
          fontWeight: 800,
          fontSize: 15,
        }}
      >
        {title}
      </div>
      <p style={{ margin: "10px 0 0", color: "rgba(245,241,230,0.82)", fontSize: 13.5, lineHeight: 1.75 }}>
        {body}
      </p>
    </article>
  );
}

export default function FriendMatchPage() {
  return (
    <Suspense fallback={null}>
      <FriendMatchInner />
    </Suspense>
  );
}
