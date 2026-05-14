"use client";

import { useEffect, useRef, useState } from "react";
import { AdBottom, AdMobileSticky } from "../../components/Ads";
import GameIntro from "../../components/game/GameIntro";
import ResultScreen from "../../components/game/ResultScreen";
import { useLocale } from "@/hooks/useLocale";

const TRIALS = 5;
const KOREAN_AVG = 250;

type Phase = "idle" | "waiting" | "go" | "tooEarly" | "showResult" | "done";
type T = (ko: string, en: string) => string;

type ReactionTier = {
  title: string;
  desc: string;
  percentile: string;
  feedback: string;
  tone: string;
};

function getReactionTier(ms: number, t: T): ReactionTier {
  if (ms <= 170) {
    return {
      title: t("프로게이머급 반응속도", "Pro-gamer reaction speed"),
      desc: t("초록불을 보는 순간 손이 이미 출발했습니다. 이 정도면 생각보다 근육이 회의를 빨리 끝냅니다.", "Your hand leaves the second green appears. Muscle finished the meeting before thought arrived."),
      percentile: t("0-170ms 최상위 구간", "0-170ms top tier"),
      feedback: t("프로게이머급 탭", "Pro-gamer tap"),
      tone: "#00FF88",
    };
  }
  if (ms <= 220) {
    return {
      title: t("모기 잡기 상위권", "Mosquito-catching upper tier"),
      desc: t("대한민국 평균보다 확실히 빠릅니다. 모기가 근처에 오면 긴장해야 하는 손입니다.", "Clearly faster than average. Mosquitoes should be nervous around this hand."),
      percentile: t("171-220ms 빠른 손", "171-220ms fast hand"),
      feedback: t("모기 잡기권", "Mosquito tier"),
      tone: "#34C759",
    };
  }
  if (ms <= 280) {
    return {
      title: t("편의점 알바생급 반응", "Convenience-store reflex"),
      desc: t("카드 꽂기 전에 봉투부터 준비하는 실전형 속도입니다. 바쁜 계산대에서도 버틸 수 있어요.", "Practical speed: bag ready before the card goes in. You could survive a busy counter."),
      percentile: t("221-280ms 실전형", "221-280ms practical tier"),
      feedback: t("알바생급 스캔", "Cashier-scan speed"),
      tone: "#FFD60A",
    };
  }
  if (ms <= 350) {
    return {
      title: t("평범한 인간의 손가락", "Ordinary human finger"),
      desc: t("놀랄 만큼 정상입니다. 사회생활 가능한 반응속도고, 가끔 커피가 들어가면 더 빨라질 수 있습니다.", "Impressively normal. Socially functional reflexes, possibly faster after coffee."),
      percentile: t("281-350ms 평균권", "281-350ms average tier"),
      feedback: t("정상 작동 중", "Human system normal"),
      tone: "#fff",
    };
  }
  return {
    title: t("손가락이 아직 출근 전", "Finger has not clocked in yet"),
    desc: t("신호는 받았는데 내부 결재가 길었습니다. 손에게 권한 위임이 조금 필요합니다.", "Signal received, internal approval delayed. Your hand needs a little more authority."),
    percentile: t("351ms 이상 워밍업 필요", "351ms+ needs warm-up"),
    feedback: t("출근 준비 중", "Still clocking in"),
    tone: "#FF9F0A",
  };
}

function roundFeedback(ms: number | null, t: T): string {
  if (ms === null) return "";
  return getReactionTier(ms, t).feedback;
}

export default function ReactGame() {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const startRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTrial = () => {
    setPhase("waiting");
    setLast(null);
    const delay = 1200 + Math.random() * 2800;
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  };

  // Critical: pointerdown fires the moment of press — not after release.
  const press = () => {
    if (phase === "done") return;
    if (phase === "idle" || phase === "showResult" || phase === "tooEarly") {
      if (times.length >= TRIALS) return;
      startTrial();
      return;
    }
    if (phase === "waiting") {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      setPhase("tooEarly");
      return;
    }
    if (phase === "go") {
      const reaction = Math.round(performance.now() - startRef.current);
      const next = [...times, reaction];
      setLast(reaction);
      setTimes(next);
      if (next.length >= TRIALS) setPhase("done");
      else setPhase("showResult");
    }
  };

  const reset = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    setTimes([]);
    setLast(null);
    setPhase("idle");
  };

  const avg =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;
  const grade = avg > 0 ? getReactionTier(avg, t) : null;

  // Color & content per phase
  let bg = "#fafafa";
  let fg = "#0a0a0a";
  let mainText = "";
  let subText = "";
  let mainSize = 96;

  if (phase === "idle") {
    bg = "#fafafa"; fg = "#0a0a0a";
    mainText = "TAP";
    subText = t("준비되면 화면 어디든 누르세요", "Tap anywhere when ready");
    mainSize = 120;
  } else if (phase === "waiting") {
    bg = "#FF3B30"; fg = "#fff";
    mainText = t("기다리세요...", "Wait...");
    subText = t("초록색이 되는 순간 누르세요", "Tap the moment it turns green");
    mainSize = 88;
  } else if (phase === "go") {
    bg = "#00FF88"; fg = "#0a0a0a";
    mainText = t("지금!", "NOW!");
    subText = "";
    mainSize = 200;
  } else if (phase === "tooEarly") {
    bg = "#1a0000"; fg = "#FF3B30";
    mainText = t("너무 빨랐어요", "Too early!");
    subText = t("다시 누르면 시작합니다", "Tap to restart");
    mainSize = 72;
  } else if (phase === "showResult") {
    bg = "#0a0a0a"; fg = "#fff";
    mainText = `${last}`;
    subText = `${times.length} / ${TRIALS} · ${roundFeedback(last, t)} · ${t("누르면 다음", "tap for next")}`;
    mainSize = 144;
  } else if (phase === "done" && grade) {
    bg = "#0a0a0a"; fg = grade.tone;
    mainText = `${avg}`;
    subText = grade.title;
    mainSize = 160;
  }

  const showMs = phase === "showResult" || phase === "done";
  const mainSizeStyle = `clamp(58px, ${phase === "go" ? "38vw" : "30vw"}, ${mainSize}px)`;
  const unitSizeStyle = `clamp(22px, 9vw, ${Math.round(mainSize * 0.32)}px)`;
  const verdict = phase === "done" && avg > 0 ? getReactionTier(avg, t) : null;
  const shareText = verdict
    ? t(
        `내 반응속도 평균은 ${avg}ms, 결과는 "${verdict.title}". 초록불 뜨면 손이 먼저 갑니다.`,
        `My reaction average is ${avg}ms. Result: "${verdict.title}". My hand leaves first.`,
      )
    : "";

  if (phase === "idle") {
    return (
      <main
        className="min-h-screen page-in flex items-center justify-center px-5 py-16"
        style={{ backgroundColor: "#fafafa", color: "#0a0a0a" }}
      >
        <GameIntro
          eyebrow={t("CHALLENGE · 5라운드", "CHALLENGE · 5 ROUNDS")}
          title={t("반응속도", "Reaction Speed")}
          hook={t("빨간 화면에서 기다렸다가 초록색이 되는 순간 누르세요.", "Wait on red, tap the instant it turns green.")}
          howTo={t("총 5번 측정해서 평균 반응속도를 냅니다. 너무 빨리 누르면 그 판은 다시 시작합니다.", "Five trials make your average. Tap too early and that round restarts.")}
          meta={[t("약 20초", "20 sec"), t("5번 측정", "5 taps"), t("결과 공유", "Share result")]}
          startLabel={t("측정 시작", "Start test")}
          onStart={startTrial}
          tone="light"
        />
        <AdMobileSticky />
      </main>
    );
  }

  return (
    <main
      onPointerDown={press}
      className="page-in relative min-h-screen select-none"
      style={{
        backgroundColor: bg,
        color: fg,
        transition: "background-color 0.08s ease",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        cursor: phase === "done" ? "default" : "pointer",
        touchAction: "manipulation",
      }}
    >
      <div onPointerDown={(e) => e.stopPropagation()}>
      </div>

      {/* Trial counter — top-center to avoid LocaleToggle overlap */}
      <div
        className="pointer-events-none fixed z-50 tabular-nums"
        style={{
          left: "50%",
          top: 22,
          transform: "translateX(-50%)",
          fontSize: 15,
          fontWeight: 700,
          color: fg,
          opacity: 0.5,
          letterSpacing: "0.1em",
        }}
      >
        <span style={{ color: fg }}>{times.length}</span>
        <span style={{ marginLeft: 4 }}>/ {TRIALS}</span>
      </div>

      {/* Main centered content */}
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div
          className="tabular-nums"
          style={{
            fontSize: mainSizeStyle,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            transition: "font-size 0.12s ease",
            maxWidth: "100%",
            overflowWrap: "anywhere",
          }}
        >
          {mainText}
          {showMs && (
            <span
              style={{
                fontSize: unitSizeStyle,
                fontWeight: 700,
                opacity: 0.5,
                marginLeft: 8,
              }}
            >
              ms
            </span>
          )}
        </div>

        {subText && (
          <p
            className="mt-5"
            style={{
              fontSize: 16,
              opacity: phase === "go" ? 0 : 0.75,
              fontWeight: 500,
              maxWidth: 560,
              lineHeight: 1.55,
            }}
          >
            {subText}
          </p>
        )}

        {phase === "done" && grade && (
          <>
            <p
              className="mt-3"
              style={{ fontSize: 15, opacity: 0.45, color: "#fff" }}
            >
              {t("한국인 평균", "Korean average")} {KOREAN_AVG}ms · {t("차이", "diff")}{" "}
              <span style={{ color: avg < KOREAN_AVG ? "#00FF88" : "#FF9F0A" }}>
                {avg < KOREAN_AVG ? "" : "+"}
                {avg - KOREAN_AVG}ms
              </span>
            </p>
            {verdict && (
              <div onPointerDown={(e) => e.stopPropagation()} style={{ width: "100%" }}>
                <ResultScreen
                  locale={locale}
                  currentGameId="react"
                  eyebrow={t("5라운드 평균", "5-round average")}
                  title={verdict.title}
                  score={`${avg}`}
                  scoreLabel="ms"
                  description={verdict.desc}
                  details={[
                    verdict.percentile,
                    t(`가장 빠른 기록은 ${Math.min(...times)}ms입니다. 손가락이 잠깐 독립했습니다.`, `Fastest tap: ${Math.min(...times)}ms. Your finger briefly became independent.`),
                    t(`한국인 평균 ${KOREAN_AVG}ms와의 차이: ${avg - KOREAN_AVG > 0 ? "+" : ""}${avg - KOREAN_AVG}ms`, `Difference from ${KOREAN_AVG}ms average: ${avg - KOREAN_AVG > 0 ? "+" : ""}${avg - KOREAN_AVG}ms`),
                  ]}
                  shareTitle={t("반응속도 결과", "Reaction Speed result")}
                  shareText={shareText}
                  shareUrl="/games/react"
                  onReplay={reset}
                  replayLabel={t("다시 측정", "Test again")}
                  recommendedIds={["circle", "timesense", "password"]}
                  tone="dark"
                />
              </div>
            )}
          </>
        )}

        {/* Trial dots — only visible after first trial, hidden in waiting/go */}
        {times.length > 0 &&
          phase !== "waiting" &&
          phase !== "go" &&
          phase !== "done" && (
            <div className="mt-12 flex gap-2 tabular-nums">
              {Array.from({ length: TRIALS }).map((_, i) => {
                const has = i < times.length;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 56,
                      height: 32,
                      fontSize: 13,
                      fontWeight: 700,
                      background: has ? fg : "transparent",
                      color: has ? bg : fg,
                      border: `1px solid ${fg}`,
                      opacity: has ? 0.9 : 0.3,
                    }}
                  >
                    {has ? times[i] : i + 1}
                  </div>
                );
              })}
            </div>
          )}
      </div>
      {phase === "done" && (
        <div className="mx-auto max-w-3xl px-5 pb-12 md:px-8">
          <AdBottom />
        </div>
      )}
      <AdMobileSticky />
    </main>
  );
}
