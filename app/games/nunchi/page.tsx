"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Situation = {
  id: string;
  category: { ko: string; en: string };
  correct: number | "skip";
  button: { ko: string; en: string };
  failMsg?: { ko: string; en: string };
  lines: { ko: string; en: string }[];
};

const SITUATIONS: Situation[] = [
  {
    id: "A", category: { ko: "회식", en: "Company Dinner" }, correct: 2,
    button: { ko: "먼저 계산하겠다고 말하기", en: "Offer to pay" },
    lines: [
      { ko: "식사가 끝났습니다.", en: "Dinner is over." },
      { ko: "부장님이 지갑을 꺼냅니다.", en: "The boss takes out his wallet." },
      { ko: "카드를 꺼냅니다.", en: "He pulls out a card." },
      { ko: "계산대로 걸어갑니다.", en: "He walks toward the counter." },
    ],
  },
  {
    id: "B", category: { ko: "회식", en: "Company Dinner" }, correct: "skip",
    button: { ko: "자리 정리하기", en: "Start cleaning up" },
    failMsg: { ko: "분위기 파악 못했어요", en: "You misread the mood" },
    lines: [
      { ko: "부장님이 시계를 봅니다.", en: "The boss checks his watch." },
      { ko: "'다들 피곤하죠?' 라고 묻습니다.", en: "He asks, 'Everyone tired?'" },
      { ko: "근데 막내가 술을 따릅니다.", en: "But the junior pours another drink." },
      { ko: "분위기가 다시 살아납니다.", en: "The mood picks back up." },
    ],
  },
  {
    id: "C", category: { ko: "회식", en: "Company Dinner" }, correct: 0,
    button: { ko: "먼저 일어서기", en: "Stand up first" },
    lines: [
      { ko: "2차 장소에 도착했습니다.", en: "You arrive at the second venue." },
      { ko: "부장님이 '오늘은 여기까지' 합니다.", en: "The boss says, 'That's it for today.'" },
      { ko: "외투를 입습니다.", en: "He puts on his coat." },
      { ko: "문쪽으로 걷습니다.", en: "He walks toward the door." },
    ],
  },
  {
    id: "D", category: { ko: "카페", en: "Cafe" }, correct: 1,
    button: { ko: "자리 비우기", en: "Leave your seat" },
    lines: [
      { ko: "카페가 꽉 찼습니다.", en: "The cafe is packed." },
      { ko: "직원이 당신 테이블을 봅니다.", en: "A staff member glances at your table." },
      { ko: "한숨을 쉽니다.", en: "She sighs." },
      { ko: "다른 손님이 기다리고 있습니다.", en: "Other customers are waiting." },
    ],
  },
  {
    id: "E", category: { ko: "카페", en: "Cafe" }, correct: "skip",
    button: { ko: "자리 비우기", en: "Leave your seat" },
    failMsg: { ko: "너무 예민해요", en: "You're overthinking" },
    lines: [
      { ko: "직원이 주변을 청소합니다.", en: "A staff member is tidying up." },
      { ko: "당신 테이블 주변을 닦습니다.", en: "She wipes near your table." },
      { ko: "그냥 청소 중입니다.", en: "She's just cleaning." },
      { ko: "아무 의미 없습니다.", en: "It means nothing." },
    ],
  },
  {
    id: "F", category: { ko: "친구 집", en: "Friend's House" }, correct: 2,
    button: { ko: "일어서기", en: "Stand up to leave" },
    lines: [
      { ko: "저녁 시간이 됐습니다.", en: "It's dinner time." },
      { ko: "친구가 냉장고를 열어봅니다.", en: "Your friend opens the fridge." },
      { ko: "텅 비어있습니다.", en: "It's empty." },
      { ko: "친구가 당신을 봅니다.", en: "Your friend looks at you." },
    ],
  },
  {
    id: "G", category: { ko: "친구 집", en: "Friend's House" }, correct: "skip",
    button: { ko: "일어서기", en: "Stand up to leave" },
    failMsg: { ko: "친구가 섭섭해요", en: "Your friend feels hurt" },
    lines: [
      { ko: "친구가 '배고프지 않아?' 합니다.", en: "Your friend says, 'Aren't you hungry?'" },
      { ko: "치킨 시키자고 합니다.", en: "Suggests ordering chicken." },
      { ko: "같이 먹자고 합니다.", en: "Asks you to eat together." },
      { ko: "당신을 부릅니다.", en: "Calls your name." },
    ],
  },
  {
    id: "H", category: { ko: "소개팅", en: "Blind Date" }, correct: 1,
    button: { ko: "계산하기", en: "Ask for the bill" },
    lines: [
      { ko: "대화가 뜸해집니다.", en: "Conversation slows down." },
      { ko: "상대방이 폰을 봅니다.", en: "Your date checks their phone." },
      { ko: "물을 마십니다.", en: "Sips water." },
      { ko: "창밖을 봅니다.", en: "Looks out the window." },
    ],
  },
  {
    id: "I", category: { ko: "소개팅", en: "Blind Date" }, correct: "skip",
    button: { ko: "계산하기", en: "Ask for the bill" },
    failMsg: { ko: "성급했어요", en: "Too hasty" },
    lines: [
      { ko: "상대방이 잠깐 폰을 봅니다.", en: "Your date glances at their phone." },
      { ko: "카톡 답장을 보냅니다.", en: "Sends a quick reply." },
      { ko: "다시 당신을 봅니다.", en: "Looks back at you." },
      { ko: "'아까 얘기 계속해요' 합니다.", en: "Says, 'You were saying?'" },
    ],
  },
  {
    id: "J", category: { ko: "직장", en: "Work" }, correct: 3,
    button: { ko: "먼저 일어나기", en: "Stand up first" },
    lines: [
      { ko: "회의가 길어집니다.", en: "The meeting drags on." },
      { ko: "팀장님이 자료를 닫습니다.", en: "The team lead closes the docs." },
      { ko: "펜을 내려놓습니다.", en: "Sets the pen down." },
      { ko: "'오늘은 여기까지' 합니다.", en: "Says, 'That's it for today.'" },
    ],
  },
  {
    id: "K", category: { ko: "직장", en: "Work" }, correct: "skip",
    button: { ko: "먼저 일어나기", en: "Stand up first" },
    failMsg: { ko: "분위기 파악 못했어요", en: "You misread the mood" },
    lines: [
      { ko: "회의실에 정적이 흐릅니다.", en: "Silence falls in the meeting room." },
      { ko: "팀장님이 생각 중입니다.", en: "The team lead is thinking." },
      { ko: "뭔가 말하려 합니다.", en: "Looks ready to speak." },
      { ko: "중요한 말을 하려는 것 같습니다.", en: "Looks like it's something important." },
    ],
  },
  {
    id: "L", category: { ko: "단톡방", en: "Group Chat" }, correct: 2,
    button: { ko: "화제 바꾸기", en: "Change the subject" },
    lines: [
      { ko: "누군가 실수를 했습니다.", en: "Someone made a slip." },
      { ko: "읽음 표시만 늘어납니다.", en: "Read receipts pile up." },
      { ko: "5분째 아무도 답장 안 합니다.", en: "No one's replied for 5 minutes." },
      { ko: "분위기가 싸늘합니다.", en: "The room is icy." },
    ],
  },
  {
    id: "M", category: { ko: "단톡방", en: "Group Chat" }, correct: "skip",
    button: { ko: "화제 바꾸기", en: "Change the subject" },
    failMsg: { ko: "뜬금없어요", en: "Came out of nowhere" },
    lines: [
      { ko: "단톡방이 조용합니다.", en: "The chat is quiet." },
      { ko: "그냥 다들 바쁜 것 같습니다.", en: "Everyone's just busy." },
      { ko: "특별한 일이 없습니다.", en: "Nothing special happening." },
      { ko: "평범한 오후입니다.", en: "Just an ordinary afternoon." },
    ],
  },
  {
    id: "N", category: { ko: "엘리베이터", en: "Elevator" }, correct: 0,
    button: { ko: "열림 버튼 누르기", en: "Press open button" },
    lines: [
      { ko: "엘리베이터 문이 닫히려 합니다.", en: "The elevator doors are closing." },
      { ko: "누군가 뛰어옵니다.", en: "Someone rushes over." },
      { ko: "손을 흔듭니다.", en: "Waves their hand." },
      { ko: "'잠깐만요!' 합니다.", en: "Yells, 'Wait!'" },
    ],
  },
  {
    id: "O", category: { ko: "엘리베이터", en: "Elevator" }, correct: "skip",
    button: { ko: "열림 버튼 누르기", en: "Press open button" },
    failMsg: { ko: "왜 눌렀어요?", en: "Why did you press it?" },
    lines: [
      { ko: "엘리베이터 문이 닫히려 합니다.", en: "The elevator doors are closing." },
      { ko: "아무도 없습니다.", en: "Nobody's there." },
      { ko: "조용합니다.", en: "It's quiet." },
      { ko: "그냥 올라갑니다.", en: "It just goes up." },
    ],
  },
];

const SERIF = "var(--font-noto-serif-kr), serif";
const BG = "#faf8f3";
const FG = "#1a1a1a";
const MUTED = "#aaa";
const DIM = "#888";
const BORDER = "#e0ddd6";
const BTN_FG = "#444";
const NEGATIVE = "#c0392b";

const ROUNDS = 5;

function pickFive(): Situation[] {
  const arr = [...SITUATIONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, ROUNDS);
}

function calcScore(correct: number | "skip", pressed: number | null): number {
  if (correct === "skip") {
    return pressed === null ? 100 : -50;
  }
  if (pressed === null) return 0;
  const d = Math.abs(pressed - correct);
  if (d === 0) return 100;
  if (d === 1) return 60;
  if (d === 2) return 20;
  return -20;
}

type T = (ko: string, en: string) => string;

function getTier(total: number, t: T): { name: string; emoji: string } {
  if (total >= 500) return { name: t("당신은 눈치왕입니다", "You're the Nunchi Master"), emoji: "👑" };
  if (total >= 400) return { name: t("완벽한 타이밍!", "Perfect timing!"), emoji: "" };
  if (total >= 300) return { name: t("평균적인 한국인", "Average Korean"), emoji: "" };
  if (total >= 200) return { name: t("눈치를 좀 기르세요", "Work on your nunchi"), emoji: "" };
  return { name: t("눈치 없음", "No nunchi"), emoji: "😅" };
}

type Phase = "playing" | "reveal" | "complete";

export default function NunchiGame() {
  const { locale, t } = useLocale();
  const [situations, setSituations] = useState<Situation[]>([]);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [revealStep, setRevealStep] = useState(0);
  const [pressedAt, setPressedAt] = useState<number | null>(null);
  const [skipVisible, setSkipVisible] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [scoreReveal, setScoreReveal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSituations(pickFive());
  }, []);

  useEffect(() => {
    if (phase !== "playing" || situations.length === 0) return;
    setRevealStep(0);
    setSkipVisible(false);
    setPressedAt(null);
    const lineCount = situations[round].lines.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < lineCount; i++) {
      timers.push(setTimeout(() => setRevealStep(i + 1), 100 + 1000 * i));
    }
    timers.push(setTimeout(() => setSkipVisible(true), 100 + 1000 * lineCount));
    return () => timers.forEach(clearTimeout);
  }, [round, phase, situations]);

  useEffect(() => {
    if (phase !== "reveal") return;
    setScoreReveal(false);
    const t = setTimeout(() => setScoreReveal(true), 500);
    return () => clearTimeout(t);
  }, [phase, round]);

  if (situations.length === 0) {
    return <main style={{ minHeight: "100vh", background: BG, fontFamily: SERIF }} />;
  }

  const current = situations[round];
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const handlePress = () => {
    if (phase !== "playing") return;
    const at = Math.max(0, revealStep - 1);
    setPressedAt(at);
    setScores((prev) => [...prev, calcScore(current.correct, at)]);
    setPhase("reveal");
  };

  const handleSkip = () => {
    if (phase !== "playing") return;
    setPressedAt(null);
    setScores((prev) => [...prev, calcScore(current.correct, null)]);
    setPhase("reveal");
  };

  const handleNext = () => {
    if (round + 1 >= ROUNDS) {
      setPhase("complete");
    } else {
      setRound((r) => r + 1);
      setPhase("playing");
    }
  };

  const handleRestart = () => {
    setSituations(pickFive());
    setRound(0);
    setPhase("playing");
    setScores([]);
  };

  const handleShare = async () => {
    const tier = getTier(totalScore, t);
    const suffix = tier.emoji ? ` ${tier.emoji}` : "";
    const text = t(
      `나 눈치 점수 ${totalScore}점 — ${tier.name}${suffix} → nolza.fun/games/nunchi`,
      `My nunchi score: ${totalScore} — ${tier.name}${suffix} → nolza.fun/games/nunchi`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (phase === "complete") {
    const tier = getTier(totalScore, t);
    return (
      <main
        style={{
          minHeight: "100vh",
          background: BG,
          color: FG,
          fontFamily: SERIF,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
        }}
      >
        <Link href="/" style={backArrowStyle} aria-label="home">←</Link>
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 15, color: DIM, letterSpacing: "0.1em", marginBottom: 24, textTransform: "uppercase" }}>
            {t("최종 점수", "Final Score")}
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-2px",
              marginBottom: 24,
            }}
          >
            {totalScore}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.5px",
              lineHeight: 1.5,
            }}
          >
            {tier.name}
            {tier.emoji ? ` ${tier.emoji}` : ""}
          </div>

          <div
            style={{
              marginTop: 40,
              padding: "16px 0",
              borderTop: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            {scores.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 16,
                  color: DIM,
                  padding: "6px 0",
                }}
              >
                <span>
                  {t("라운드", "Round")} {i + 1} ·{" "}
                  {locale === "ko" ? situations[i].category.ko : situations[i].category.en}
                </span>
                <span
                  style={{
                    color: s >= 60 ? FG : s >= 0 ? DIM : NEGATIVE,
                    fontWeight: s >= 60 ? 500 : 400,
                  }}
                >
                  {s >= 0 ? `+${s}` : s}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12 }}>
            <PillButton onClick={handleRestart}>{t("다시", "Again")}</PillButton>
            <PillButton onClick={handleShare}>
              {copied ? t("복사됨", "Copied") : t("공유", "Share")}
            </PillButton>
          </div>
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  const isSkipCorrect = current.correct === "skip";
  const lastScore = scores[scores.length - 1] ?? 0;

  let revealMsg: string;
  if (isSkipCorrect) {
    if (pressedAt === null) {
      revealMsg = t("이건 안 누르는 게 정답이었어요", "Not pressing was the right call");
    } else {
      const fm = current.failMsg;
      revealMsg = fm
        ? (locale === "ko" ? fm.ko : fm.en)
        : t("이건 안 누르는 게 정답이었어요", "Not pressing was the right call");
    }
  } else {
    const correctNum = (current.correct as number) + 1;
    revealMsg = t(`${correctNum}번째 줄이 정답이었어요`, `Line ${correctNum} was the right moment`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        color: FG,
        fontFamily: SERIF,
        position: "relative",
      }}
    >
      <Link href="/" style={backArrowStyle} aria-label="home">←</Link>
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 24,
          fontSize: 14,
          color: DIM,
          letterSpacing: "0.15em",
          fontFamily: SERIF,
          textTransform: "uppercase",
        }}
      >
        {t("라운드", "Round")} {round + 1} / {ROUNDS}
      </div>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 200px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div
            style={{
              fontSize: 15,
              color: DIM,
              letterSpacing: "0.1em",
              marginBottom: 32,
            }}
          >
            {locale === "ko" ? current.category.ko : current.category.en}
          </div>

          <div>
            {current.lines.map((line, i) => {
              const isAnswerLine =
                phase === "reveal" && !isSkipCorrect && i === current.correct;
              const isPressedLine =
                phase === "reveal" && pressedAt !== null && i === pressedAt && !isAnswerLine;
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 20,
                    lineHeight: 2.0,
                    letterSpacing: "-0.3px",
                    color: phase === "reveal"
                      ? isAnswerLine
                        ? FG
                        : isPressedLine
                          ? NEGATIVE
                          : DIM
                      : FG,
                    fontWeight: isAnswerLine ? 500 : 400,
                    opacity: revealStep > i ? 1 : 0,
                    transition: "opacity 0.6s ease, color 0.4s ease",
                  }}
                >
                  {locale === "ko" ? line.ko : line.en}
                </div>
              );
            })}
          </div>

          {phase === "reveal" && (
            <div
              style={{
                marginTop: 56,
                opacity: scoreReveal ? 1 : 0,
                transform: scoreReveal ? "scale(1)" : "scale(0.9)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  color: DIM,
                  marginBottom: 12,
                  letterSpacing: "-0.2px",
                }}
              >
                {revealMsg}
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 500,
                  color: lastScore >= 60 ? FG : lastScore >= 0 ? DIM : NEGATIVE,
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                {lastScore >= 0 ? `+${lastScore}` : lastScore}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 32,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        {phase === "playing" && (
          <>
            <div style={{ pointerEvents: "auto" }}>
              <PillButton onClick={handlePress}>
                {locale === "ko" ? current.button.ko : current.button.en}
              </PillButton>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                pointerEvents: skipVisible ? "auto" : "none",
                background: "transparent",
                border: "none",
                color: MUTED,
                fontSize: 16,
                fontFamily: SERIF,
                fontWeight: 400,
                letterSpacing: "-0.2px",
                cursor: "pointer",
                padding: "6px 12px",
                opacity: skipVisible ? 1 : 0,
                transition: "opacity 0.4s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = FG)}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
            >
              {t("넘어가기", "Skip")}
            </button>
          </>
        )}
        {phase === "reveal" && (
          <div
            style={{
              pointerEvents: scoreReveal ? "auto" : "none",
              opacity: scoreReveal ? 1 : 0,
              transition: "opacity 0.4s ease 0.6s",
            }}
          >
            <PillButton onClick={handleNext}>
              {round + 1 >= ROUNDS ? t("결과 보기", "Results") : t("다음", "Next")}
            </PillButton>
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 12,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 7,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: 9999,
              background: i === round ? FG : "#d8d4cc",
            }}
          />
        ))}
      </div>

      <AdMobileSticky />
    </main>
  );
}

const backArrowStyle: React.CSSProperties = {
  position: "absolute",
  top: 24,
  left: 24,
  color: MUTED,
  fontSize: 22,
  textDecoration: "none",
  zIndex: 10,
};

function PillButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        color: BTN_FG,
        fontSize: 15,
        fontFamily: SERIF,
        fontWeight: 400,
        letterSpacing: "-0.2px",
        cursor: "pointer",
        padding: "14px 32px",
        borderRadius: 50,
        transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
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
