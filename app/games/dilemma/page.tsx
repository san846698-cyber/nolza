"use client";

/**
 * Supabase 스키마 (실서비스 연동 시):
 *   CREATE TABLE dilemma_votes (
 *     id BIGSERIAL PRIMARY KEY,
 *     dilemma_id INT NOT NULL,
 *     choice_id TEXT NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 * 현재는 localStorage seed로 mock 집계.
 */

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Tag = "U" | "D" | "I" | "C";
type Category = "TROLLEY" | "IDENTITY" | "ETHICS" | "KOREA" | "TIME" | "FREEWILL";
type Choice = { id: string; text: string; tags?: Tag[] };
type Dilemma = {
  id: number;
  category: Category;
  text: string;
  choices: Choice[];
};

const DILEMMAS: Dilemma[] = [
  { id: 1, category: "TROLLEY", text: "기차가 5명을 향해 달리고 있습니다.\n레버를 당기면 1명이 죽습니다.", choices: [
    { id: "a", text: "레버를 당긴다", tags: ["U"] },
    { id: "b", text: "그대로 둔다", tags: ["D"] },
  ]},
  { id: 2, category: "TROLLEY", text: "똑같은 상황입니다.\n근데 그 1명이 당신의 가족이에요.", choices: [
    { id: "a", text: "레버를 당긴다", tags: ["U"] },
    { id: "b", text: "그대로 둔다", tags: ["D", "I"] },
  ]},
  { id: 3, category: "TROLLEY", text: "5명을 살리려면\n육교 위의 낯선 사람을\n직접 밀어야 합니다.", choices: [
    { id: "a", text: "낯선 사람을 민다", tags: ["U"] },
    { id: "b", text: "밀지 않는다", tags: ["D"] },
  ]},
  { id: 4, category: "IDENTITY", text: "당신이 자는 동안\n완벽하게 복제됩니다.\n아침에 깨어난 당신은 진짜 당신인가요?", choices: [
    { id: "a", text: "네, 나예요" },
    { id: "b", text: "아니요, 복제본이에요" },
    { id: "c", text: "알 수 없어요" },
  ]},
  { id: 5, category: "IDENTITY", text: "당신의 기억을 전부 지우고\n더 행복한 기억으로 교체할 수 있습니다.", choices: [
    { id: "a", text: "교체한다", tags: ["U"] },
    { id: "b", text: "그대로 둔다", tags: ["D"] },
  ]},
  { id: 6, category: "IDENTITY", text: "당신이 평생 살아온 세상이\n사실 시뮬레이션이라는 걸 알게 됐습니다.\n알고 싶었나요?", choices: [
    { id: "a", text: "알고 싶었어요" },
    { id: "b", text: "모르는 게 나았어요" },
  ]},
  { id: 7, category: "IDENTITY", text: "100년 후 당신의 뇌를\n로봇에 이식할 수 있습니다.\n그 로봇은 당신인가요?", choices: [
    { id: "a", text: "네" },
    { id: "b", text: "아니요" },
    { id: "c", text: "모르겠어요" },
  ]},
  { id: 8, category: "ETHICS", text: "버튼을 누르면\n당신이 모르는 사람 한 명이 죽는 대신\n전 세계 빈곤이 사라집니다.", choices: [
    { id: "a", text: "버튼을 누른다", tags: ["U"] },
    { id: "b", text: "누르지 않는다", tags: ["D"] },
  ]},
  { id: 9, category: "ETHICS", text: "완벽한 거짓말로\n100명을 행복하게 할 수 있습니다.\n나에겐 아무 손해도 없습니다.", choices: [
    { id: "a", text: "거짓말한다", tags: ["U"] },
    { id: "b", text: "진실을 말한다", tags: ["D"] },
  ]},
  { id: 10, category: "ETHICS", text: "나쁜 사람을 고문하면\n무고한 100명을 살릴 수 있습니다.", choices: [
    { id: "a", text: "고문한다", tags: ["U"] },
    { id: "b", text: "고문하지 않는다", tags: ["D"] },
  ]},
  { id: 11, category: "KOREA", text: "부모님이 부탁한 일과\n절친한 친구가 부탁한 일이 겹칩니다.\n누구를 선택하나요?", choices: [
    { id: "a", text: "부모님", tags: ["C"] },
    { id: "b", text: "친구", tags: ["I"] },
    { id: "c", text: "둘 다 안 함", tags: ["I"] },
  ]},
  { id: 12, category: "KOREA", text: "직장 동료의 부정행위를 알게 됐습니다.\n신고하면 그 사람 가족이\n길거리에 나앉습니다.", choices: [
    { id: "a", text: "신고한다", tags: ["C", "D"] },
    { id: "b", text: "모른 척한다", tags: ["I"] },
    { id: "c", text: "직접 해결한다", tags: ["I"] },
  ]},
  { id: 13, category: "KOREA", text: "당신만 침묵하면\n팀 전체가 책임을 면합니다.\n혼자 뒤집어쓰겠습니까?", choices: [
    { id: "a", text: "혼자 뒤집어쓴다", tags: ["C"] },
    { id: "b", text: "안 한다", tags: ["I"] },
  ]},
  { id: 14, category: "TIME", text: "과거로 돌아가\n히틀러를 어릴 때 죽일 수 있습니다.", choices: [
    { id: "a", text: "죽인다", tags: ["U"] },
    { id: "b", text: "죽이지 않는다", tags: ["D"] },
    { id: "c", text: "모르겠어요" },
  ]},
  { id: 15, category: "TIME", text: "당신이 태어나지 않았다면\n세상이 더 나았을 수도 있다는 걸\n증명할 수 있습니다.", choices: [
    { id: "a", text: "알고 싶어요" },
    { id: "b", text: "알고 싶지 않아요" },
  ]},
  { id: 16, category: "TIME", text: "지구를 구하기 위해\n인류의 절반이 사라져야 합니다.\n(당신도 포함될 수 있습니다)", choices: [
    { id: "a", text: "동의한다", tags: ["U", "C"] },
    { id: "b", text: "동의하지 않는다", tags: ["D", "I"] },
  ]},
  { id: 17, category: "FREEWILL", text: "당신의 모든 선택이\n사실 이미 정해져 있다는 게 증명됐습니다.\n그래도 선택하는 의미가 있나요?", choices: [
    { id: "a", text: "있어요" },
    { id: "b", text: "없어요" },
    { id: "c", text: "모르겠어요" },
  ]},
  { id: 18, category: "FREEWILL", text: "AI가 당신보다\n더 나은 인생 결정을 내릴 수 있습니다.\nAI에게 인생을 맡기겠습니까?", choices: [
    { id: "a", text: "네 맡깁니다", tags: ["U"] },
    { id: "b", text: "아니요", tags: ["I"] },
    { id: "c", text: "일부만" },
  ]},
  { id: 19, category: "FREEWILL", text: "당신이 죽은 후\nAI가 당신의 모든 기억으로\n당신을 시뮬레이션합니다.\n그게 당신인가요?", choices: [
    { id: "a", text: "네" },
    { id: "b", text: "아니요" },
  ]},
  { id: 20, category: "FREEWILL", text: "지금 이 딜레마들을 선택한 당신,\n자유의지로 선택했나요?", choices: [
    { id: "a", text: "네" },
    { id: "b", text: "아니요" },
    { id: "c", text: "이 질문 자체가 딜레마예요" },
  ]},
];

const SEEDS: Record<number, Record<string, number>> = {
  1: { a: 720, b: 280 }, 2: { a: 240, b: 760 }, 3: { a: 220, b: 780 },
  4: { a: 480, b: 280, c: 240 }, 5: { a: 350, b: 650 }, 6: { a: 600, b: 400 },
  7: { a: 350, b: 350, c: 300 }, 8: { a: 700, b: 300 }, 9: { a: 420, b: 580 },
  10: { a: 480, b: 520 }, 11: { a: 600, b: 280, c: 120 }, 12: { a: 350, b: 320, c: 330 },
  13: { a: 280, b: 720 }, 14: { a: 700, b: 200, c: 100 }, 15: { a: 380, b: 620 },
  16: { a: 280, b: 720 }, 17: { a: 520, b: 280, c: 200 }, 18: { a: 200, b: 650, c: 150 },
  19: { a: 380, b: 620 }, 20: { a: 320, b: 320, c: 360 },
};

const TALLY_KEY = "nolza-dilemma-tally-v2";
const CHOICES_KEY = "nolza-dilemma-choices-v2";
type Tally = Record<number, Record<string, number>>;

function loadTally(): Tally {
  try {
    const saved = localStorage.getItem(TALLY_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const seed: Tally = {};
  for (const d of DILEMMAS) {
    seed[d.id] = {};
    for (const c of d.choices) {
      seed[d.id][c.id] = (SEEDS[d.id]?.[c.id] ?? 100) + Math.floor(Math.random() * 40);
    }
  }
  try { localStorage.setItem(TALLY_KEY, JSON.stringify(seed)); } catch {}
  return seed;
}

function loadChoices(): Record<number, string> {
  try {
    const saved = localStorage.getItem(CHOICES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

const TYPE_MAP: Record<string, { name: string; desc: string }> = {
  "공리주의 + 개인주의": { name: "결과주의 자유인", desc: "결과의 총합을 중시하면서도 자기 판단을 신뢰합니다." },
  "공리주의 + 집단주의": { name: "사회 공학자", desc: "공동체 전체의 최대 행복을 위해 어려운 결정도 감수합니다." },
  "의무론 + 개인주의": { name: "원칙주의 자유인", desc: "옳고 그름이 우선이되, 그 판단은 양심에 맡깁니다." },
  "의무론 + 집단주의": { name: "전통 수호자", desc: "도덕 원칙과 공동체 규범을 함께 지키려 합니다." },
  "균형 + 개인주의": { name: "유연한 자유인", desc: "결과와 원칙을 저울질하며 자기 판단을 따릅니다." },
  "균형 + 집단주의": { name: "조정자", desc: "결과와 원칙 모두를 고려하면서 조화를 우선합니다." },
  "공리주의 + 균형": { name: "실용주의자", desc: "결과를 중시하지만 어느 진영에도 치우치지 않습니다." },
  "의무론 + 균형": { name: "원칙주의자", desc: "도덕 원칙은 분명하지만 사회 관계는 유연합니다." },
  "균형 + 균형": { name: "회의주의자", desc: "어떤 진영도 절대시하지 않습니다." },
};

function analyze(answers: Record<number, string>) {
  let u = 0, d = 0, i = 0, c = 0;
  for (const dilemma of DILEMMAS) {
    const cid = answers[dilemma.id];
    if (!cid) continue;
    const choice = dilemma.choices.find((x) => x.id === cid);
    if (!choice?.tags) continue;
    if (choice.tags.includes("U")) u++;
    if (choice.tags.includes("D")) d++;
    if (choice.tags.includes("I")) i++;
    if (choice.tags.includes("C")) c++;
  }
  const ethical = Math.abs(u - d) <= 1 ? "균형" : u > d ? "공리주의" : "의무론";
  const social = Math.abs(i - c) <= 1 ? "균형" : i > c ? "개인주의" : "집단주의";
  const key = `${ethical} + ${social}`;
  const meta = TYPE_MAP[key] ?? { name: "독자적 사고", desc: "분류하기 어려운 독특한 패턴이에요." };
  return { u, d, i, c, ethical, social, type: meta.name, desc: meta.desc };
}

type Phase = "reading" | "blackout" | "result" | "complete";

const SERIF = "var(--font-noto-serif-kr), serif";
const BG = "#faf8f3";
const FG = "#1a1a1a";
const MUTED = "#aaa";
const DIM = "#888";
const BORDER = "#e0ddd6";
const BTN_FG = "#444";

export default function DilemmaGame() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("reading");
  const [tally, setTally] = useState<Tally>({});
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [revealStep, setRevealStep] = useState(0);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [resultRevealStep, setResultRevealStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTally(loadTally());
    setChoices(loadChoices());
  }, []);

  // Reading phase reset — runs synchronously before paint so the new dilemma
  // never flashes its previous fully-revealed state for one frame.
  useLayoutEffect(() => {
    if (phase !== "reading") return;
    setRevealStep(0);
    setChoicesVisible(false);
  }, [step, phase]);

  // Reading phase reveal timers (line-by-line fade-in).
  useEffect(() => {
    if (phase !== "reading") return;
    const lines = DILEMMAS[step]?.text.split("\n").length ?? 1;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < lines; i++) {
      timers.push(setTimeout(() => setRevealStep(i + 1), 400 * (i + 1)));
    }
    timers.push(setTimeout(() => setChoicesVisible(true), 400 * (lines + 1)));
    return () => timers.forEach(clearTimeout);
  }, [step, phase]);

  // Result phase reset — same reasoning, prevents stale full-reveal flash.
  useLayoutEffect(() => {
    if (phase !== "result") return;
    setResultRevealStep(0);
  }, [phase, step]);

  // Result phase reveal timers.
  useEffect(() => {
    if (phase !== "result") return;
    const current = DILEMMAS[step];
    const total = 1 + (current?.choices.length ?? 0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(setTimeout(() => setResultRevealStep(i + 1), 400 * (i + 1)));
    }
    return () => timers.forEach(clearTimeout);
  }, [phase, step]);

  const current = DILEMMAS[step];

  const select = (choiceId: string) => {
    if (phase !== "reading" || !current) return;
    setChoices((prev) => {
      const next = { ...prev, [current.id]: choiceId };
      try { localStorage.setItem(CHOICES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setTally((prev) => {
      const next = {
        ...prev,
        [current.id]: { ...(prev[current.id] ?? {}), [choiceId]: ((prev[current.id]?.[choiceId] ?? 0) + 1) },
      };
      try { localStorage.setItem(TALLY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    // 0.5s blackout, then result
    setPhase("blackout");
    setTimeout(() => setPhase("result"), 500);
  };

  const next = () => {
    if (step + 1 >= DILEMMAS.length) {
      setPhase("complete");
    } else {
      setStep((s) => s + 1);
      setPhase("reading");
    }
  };

  const restart = () => {
    setStep(0);
    setPhase("reading");
    setChoices({});
    try { localStorage.removeItem(CHOICES_KEY); } catch {}
  };

  const analysis = useMemo(() => analyze(choices), [choices]);
  const majorityCount = useMemo(() => {
    let majority = 0, minority = 0;
    for (const d of DILEMMAS) {
      const userChoice = choices[d.id];
      if (!userChoice) continue;
      const dT = tally[d.id] ?? {};
      const myCount = dT[userChoice] ?? 0;
      const isMajority = d.choices.every((c) => (dT[c.id] ?? 0) <= myCount);
      if (isMajority) majority++;
      else minority++;
    }
    return { majority, minority };
  }, [choices, tally]);

  const handleShare = async () => {
    const text = t(
      `나 딜레마 ${DILEMMAS.length}번 선택했는데 다수파 ${majorityCount.majority}개 / 소수파 ${majorityCount.minority}개 — ${analysis.type} → nolza.fun/games/dilemma`,
      `Made ${DILEMMAS.length} dilemma choices: ${majorityCount.majority} with majority / ${majorityCount.minority} with minority — ${analysis.type} → nolza.fun/games/dilemma`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const baseLineStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 1.7,
    color: FG,
    letterSpacing: "-0.3px",
    fontFamily: SERIF,
    textAlign: "center",
  };

  /* ── COMPLETE ── */
  if (phase === "complete") {
    return (
      <main
        className="page-in"
        style={{
          minHeight: "100svh",
          backgroundColor: BG,
          color: FG,
          fontFamily: SERIF,
          position: "relative",
        }}
      >
        <Link
          href="/"
          aria-label="home"
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            color: MUTED,
            fontSize: 22,
            textDecoration: "none",
          }}
        >
          ←
        </Link>
        <div
          className="mx-auto"
          style={{ maxWidth: 520, padding: "120px 24px 80px" }}
        >
          <div className="text-center fade-in">
            <div style={{ fontSize: 15, color: DIM, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
              {t("당신의 선택 패턴 분석", "Your Choice Pattern")}
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 40,
                fontWeight: 600,
                color: FG,
                lineHeight: 1.3,
                letterSpacing: "-0.5px",
              }}
            >
              {analysis.type}
            </div>
            <p
              style={{
                marginTop: 24,
                fontSize: 19,
                color: DIM,
                lineHeight: 1.75,
                letterSpacing: "-0.2px",
              }}
            >
              {analysis.desc}
            </p>
          </div>

          <div className="mt-16 space-y-6">
            <Axis
              left={t("공리주의", "Utilitarian")}
              right={t("의무론", "Deontological")}
              leftValue={analysis.u}
              rightValue={analysis.d}
            />
            <Axis
              left={t("개인주의", "Individualist")}
              right={t("집단주의", "Collectivist")}
              leftValue={analysis.i}
              rightValue={analysis.c}
            />
          </div>

          <div
            className="mt-16 flex justify-around tabular-nums"
            style={{ padding: "24px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
          >
            <div className="text-center">
              <div style={{ fontSize: 32, fontWeight: 500, color: FG, letterSpacing: "-0.5px" }}>
                {majorityCount.majority}
              </div>
              <div style={{ fontSize: 14, color: DIM, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {t("다수파", "Majority")}
              </div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 32, fontWeight: 500, color: FG, letterSpacing: "-0.5px" }}>
                {majorityCount.minority}
              </div>
              <div style={{ fontSize: 14, color: DIM, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {t("소수파", "Minority")}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-3">
            <PillButton onClick={restart}>{t("다시", "Again")}</PillButton>
            <PillButton onClick={handleShare}>
              {copied ? t("복사됨", "Copied") : t("공유", "Share")}
            </PillButton>
          </div>

          <p
            style={{
              marginTop: 56,
              fontSize: 16,
              lineHeight: 2,
              color: DIM,
              textAlign: "center",
              letterSpacing: "-0.2px",
            }}
          >
            {t(
              "도덕적 딜레마는 옳고 그름을 단순히 가를 수 없는 상황을 탐구하는 철학의 도구입니다.",
              "Moral dilemmas are philosophy's tool for exploring situations where right and wrong can't be simply separated.",
            )}
          </p>
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  if (!current) return null;

  const lines = current.text.split("\n");
  const dT = tally[current.id] ?? {};
  const total = Object.values(dT).reduce((s, v) => s + v, 0);
  const userChoice = choices[current.id];

  return (
    <main
      style={{
        minHeight: "100svh",
        backgroundColor: BG,
        color: FG,
        fontFamily: SERIF,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 24px",
      }}
    >
      <Link
        href="/"
        aria-label="home"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          color: MUTED,
          fontSize: 22,
          textDecoration: "none",
          zIndex: 10,
        }}
      >
        ←
      </Link>
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Reading phase: lines + choice buttons */}
        {phase === "reading" && (
          <>
            <div style={{ width: "100%" }}>
              {lines.map((line, i) => (
                <div
                  key={`${current.id}-${i}`}
                  style={{
                    ...baseLineStyle,
                    opacity: revealStep > i ? 1 : 0,
                    transition: "opacity 0.6s ease",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 56,
                display: "flex",
                justifyContent: "center",
                gap: 16,
                flexWrap: "wrap",
                opacity: choicesVisible ? 1 : 0,
                transition: "opacity 0.6s ease",
                pointerEvents: choicesVisible ? "auto" : "none",
              }}
            >
              {current.choices.map((c) => (
                <PillButton key={c.id} onClick={() => select(c.id)}>
                  {c.text}
                </PillButton>
              ))}
            </div>
          </>
        )}

        {/* Blackout: empty 0.5s */}
        {phase === "blackout" && <div style={{ minHeight: 200 }} />}

        {/* Result phase */}
        {phase === "result" && userChoice && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                ...baseLineStyle,
                opacity: resultRevealStep > 0 ? 1 : 0,
                transition: "opacity 0.6s ease",
                color: DIM,
                fontSize: 19,
              }}
            >
              {locale === "ko" ? `전 세계 ${total.toLocaleString("ko-KR")}명 중` : `Worldwide of ${total.toLocaleString("en-US")} people`}
            </div>
            <div style={{ marginTop: 24 }}>
              {current.choices.map((c, i) => {
                const count = dT[c.id] ?? 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                const isMine = c.id === userChoice;
                return (
                  <div
                    key={c.id}
                    style={{
                      ...baseLineStyle,
                      opacity: resultRevealStep > i + 1 ? 1 : 0,
                      transition: "opacity 0.6s ease",
                      color: isMine ? FG : DIM,
                      fontWeight: isMine ? 500 : 400,
                      marginTop: i === 0 ? 0 : 4,
                    }}
                  >
                    {locale === "ko"
                      ? `${pct.toFixed(0)}%가 “${c.text}”`
                      : `${pct.toFixed(0)}% chose “${c.text}”`}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 48,
                display: "flex",
                justifyContent: "center",
                opacity: resultRevealStep >= current.choices.length + 1 ? 1 : 0,
                transition: "opacity 0.6s ease 0.4s",
              }}
            >
              <PillButton onClick={next}>
                {step + 1 >= DILEMMAS.length ? t("결과 보기", "Results") : t("다음", "Next")}
              </PillButton>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 9,
          }}
        >
          {DILEMMAS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 10 : 7,
                height: i === step ? 10 : 7,
                borderRadius: 9999,
                background: i === step ? FG : "#d8d4cc",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>

      <AdMobileSticky />
    </main>
  );
}

function PillButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        color: BTN_FG,
        fontSize: 18,
        fontFamily: SERIF,
        fontWeight: 500,
        letterSpacing: "-0.2px",
        cursor: "pointer",
        padding: "18px 40px",
        borderRadius: 999,
        transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
        minWidth: 180,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1a1a1a";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = "#1a1a1a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.color = BTN_FG;
        e.currentTarget.style.borderColor = BORDER;
      }}
    >
      {children}
    </button>
  );
}

function Axis({
  left, right, leftValue, rightValue,
}: {
  left: string; right: string; leftValue: number; rightValue: number;
}) {
  const total = leftValue + rightValue;
  const leftPct = total > 0 ? (leftValue / total) * 100 : 50;
  return (
    <div>
      <div
        className="flex justify-between"
        style={{ fontSize: 16, color: DIM, marginBottom: 10, letterSpacing: "-0.2px", fontWeight: 500 }}
      >
        <span>{left} · {leftValue}</span>
        <span>{rightValue} · {right}</span>
      </div>
      <div
        style={{
          height: 4,
          background: BORDER,
          borderRadius: 9999,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${leftPct}%`,
            background: FG,
          }}
        />
      </div>
    </div>
  );
}
