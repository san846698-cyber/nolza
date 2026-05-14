"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdBottom, AdMobileSticky } from "../../components/Ads";
import GameIntro from "../../components/game/GameIntro";
import ResultScreen from "../../components/game/ResultScreen";
import { useLocale } from "@/hooks/useLocale";

type LocalText = { ko: string; en: string };
type Situation = {
  id: string;
  title: LocalText;
  setup: LocalText;
  choices: LocalText[];
  correct: number;
  limitMs: number;
  success: LocalText;
  fail: LocalText;
};
type RoundResult = {
  id: string;
  choice: number | null;
  elapsedMs: number;
  correct: boolean;
  points: number;
};
type Phase = "intro" | "playing" | "feedback" | "done";

const SITUATIONS: Situation[] = [
  {
    id: "elevator",
    title: { ko: "엘리베이터 문 닫힘 1초 전", en: "Elevator doors closing in 1 second" },
    setup: { ko: "뒤에서 누가 뛰어오지만 내 회의도 2분 뒤 시작입니다.", en: "Someone is running behind you, but your meeting starts in two minutes." },
    choices: [
      { ko: "열림 누르고 한 번 기다린다", en: "Hold open once" },
      { ko: "닫힘 버튼을 조용히 누른다", en: "Quietly press close" },
      { ko: "못 본 척 휴대폰 본다", en: "Pretend to check your phone" },
    ],
    correct: 0,
    limitMs: 2800,
    success: { ko: "빠르지만 사람은 챙겼습니다. 사회생활 점수까지 챙긴 선택.", en: "Fast, but still human. Speed plus social points." },
    fail: { ko: "속도는 있었지만 뒷맛이 애매합니다. 빨라도 매너는 옵션이 아닙니다.", en: "There was speed, but the aftertaste is awkward. Manners are not optional." },
  },
  {
    id: "convenience",
    title: { ko: "편의점 계산대 뒤 3명 대기", en: "Three people waiting behind you at checkout" },
    setup: { ko: "봉투, 멤버십, 결제수단을 동시에 처리해야 합니다.", en: "Bag, membership, and payment must happen almost at once." },
    choices: [
      { ko: "멤버십 바코드와 카드 미리 준비", en: "Prepare barcode and card first" },
      { ko: "계산 끝나고 앱을 찾는다", en: "Find the app after checkout" },
      { ko: "동전 주머니를 깊게 탐사한다", en: "Explore the coin pocket" },
    ],
    correct: 0,
    limitMs: 2500,
    success: { ko: "카운터 흐름을 읽었습니다. 뒤 사람들의 무언의 박수.", en: "You read the counter flow. Silent applause from the line." },
    fail: { ko: "뒤 줄의 공기가 무거워졌습니다. 앱은 미리 켜야 제맛입니다.", en: "The line got heavier. The app should have been open." },
  },
  {
    id: "subway",
    title: { ko: "지하철 환승 4분", en: "Four-minute subway transfer" },
    setup: { ko: "계단은 두 개, 표지판은 셋, 사람은 많습니다.", en: "Two stairways, three signs, too many people." },
    choices: [
      { ko: "노선 색 보고 빠른 계단으로 이동", en: "Follow line color to the fast stairs" },
      { ko: "사람 많은 쪽으로 일단 간다", en: "Follow the crowd blindly" },
      { ko: "지도 앱 확대하다 멈춘다", en: "Freeze while zooming the map" },
    ],
    correct: 0,
    limitMs: 2400,
    success: { ko: "환승 동선이 몸에 있습니다. 계단 앞에서 이미 승부가 났어요.", en: "Transfer routes live in your body. The win happened at the stairs." },
    fail: { ko: "발은 빨랐지만 방향이 틀렸습니다. 환승은 속도보다 색깔입니다.", en: "Fast feet, wrong direction. Transfer is color before speed." },
  },
  {
    id: "delivery",
    title: { ko: "배달 도착 알림", en: "Delivery arrival notification" },
    setup: { ko: "따뜻할 때 먹어야 하는 음식입니다. 현관 앞엔 비닐 소리가 납니다.", en: "This food must be eaten hot. There is bag noise at the door." },
    choices: [
      { ko: "문 앞 확인 후 바로 수령", en: "Check the door and grab it" },
      { ko: "리뷰 이벤트 문구부터 고민", en: "Think about review-event wording first" },
      { ko: "식탁 사진 각도부터 잡는다", en: "Set up the table photo angle" },
    ],
    correct: 0,
    limitMs: 2300,
    success: { ko: "면이 불기 전에 구했습니다. 이건 생활형 순발력입니다.", en: "You saved it before the noodles softened. Practical reflexes." },
    fail: { ko: "음식의 골든타임이 지나갑니다. 리뷰보다 젓가락이 먼저입니다.", en: "The golden window is closing. Chopsticks before reviews." },
  },
  {
    id: "crosswalk",
    title: { ko: "횡단보도 3초 남음", en: "Crosswalk has 3 seconds left" },
    setup: { ko: "건너편 약속이 급하지만 안전은 더 급합니다.", en: "The appointment across the street is urgent, but safety is more urgent." },
    choices: [
      { ko: "무리하지 않고 다음 신호를 잡는다", en: "Wait for the next signal" },
      { ko: "전력질주로 밀어붙인다", en: "Sprint across anyway" },
      { ko: "차 사이로 대각선 이동", en: "Cut diagonally between cars" },
    ],
    correct: 0,
    limitMs: 2200,
    success: { ko: "진짜 고수는 급해도 선을 압니다. 안전한 빨리빨리.", en: "Real experts know the line even when rushed. Safe speed." },
    fail: { ko: "빨랐지만 위험했습니다. 이 게임도 무단횡단 점수는 안 줍니다.", en: "Fast, but unsafe. This game gives no points for reckless crossing." },
  },
  {
    id: "lunch",
    title: { ko: "점심 메뉴 결정 압박", en: "Lunch-menu pressure" },
    setup: { ko: "팀 채팅방이 조용합니다. 누군가는 결정을 내려야 합니다.", en: "The team chat is silent. Someone must decide." },
    choices: [
      { ko: "제육/비빔 중 하나로 바로 확정", en: "Lock in one reliable menu" },
      { ko: "다들 뭐 드실래요? 다시 묻기", en: "Ask everyone again" },
      { ko: "식당 리뷰 47개 정독", en: "Read 47 restaurant reviews" },
    ],
    correct: 0,
    limitMs: 2600,
    success: { ko: "결정 피로를 끊었습니다. 오늘의 작은 리더십.", en: "You ended decision fatigue. Small leadership for lunch." },
    fail: { ko: "점심은 토론회가 아닙니다. 배고픔은 의사결정을 기다려주지 않아요.", en: "Lunch is not a committee hearing. Hunger waits for no decision." },
  },
  {
    id: "pcbang",
    title: { ko: "PC방 시간 1분 남음", en: "One minute left at the PC bang" },
    setup: { ko: "게임은 끝나가고 저장도 해야 하고 연장도 고민됩니다.", en: "The match is ending, saving is needed, and extension is tempting." },
    choices: [
      { ko: "저장 후 필요한 만큼만 연장", en: "Save, then extend only what you need" },
      { ko: "시간 경고를 못 본 척한다", en: "Pretend not to see the warning" },
      { ko: "마지막 1분에 새 판 시작", en: "Start a new match in the last minute" },
    ],
    correct: 0,
    limitMs: 2300,
    success: { ko: "지갑과 세이브 파일을 동시에 지켰습니다. 차분한 급함.", en: "Wallet and save file both protected. Calm urgency." },
    fail: { ko: "급함이 판단을 이겼습니다. 새 판은 1분 안에 끝나지 않습니다.", en: "Urgency beat judgment. A new match does not end in one minute." },
  },
  {
    id: "pickup",
    title: { ko: "카페 픽업대에 음료 6잔", en: "Six drinks on the cafe pickup counter" },
    setup: { ko: "내 닉네임과 비슷한 주문이 두 개 있습니다.", en: "Two orders have names similar to yours." },
    choices: [
      { ko: "주문번호 확인 후 가져간다", en: "Check the order number first" },
      { ko: "비슷하면 일단 들고 간다", en: "Grab the similar-looking one" },
      { ko: "직원 눈치만 보며 멈춘다", en: "Freeze while watching the staff" },
    ],
    correct: 0,
    limitMs: 2200,
    success: { ko: "빠른데 정확합니다. 카페 동선까지 깔끔한 사람.", en: "Fast and accurate. Clean cafe-lane behavior." },
    fail: { ko: "속도만 챙기면 남의 라떼가 됩니다. 확인은 1초면 충분합니다.", en: "Speed alone makes it someone else's latte. One-second checking is enough." },
  },
];

function pick(text: LocalText, locale: string) {
  return locale === "en" ? text.en : text.ko;
}

function getTier(score: number, correctCount: number, t: (ko: string, en: string) => string) {
  const accuracy = correctCount / SITUATIONS.length;
  if (score >= 720 && accuracy >= 0.85) {
    return {
      title: t("빨리빨리 DNA 보유자", "Ppalli-ppalli DNA carrier"),
      desc: t("빠른데 정확하고, 급한데 선을 넘지 않습니다. 한국 생활 압박 면역이 꽤 높습니다.", "Fast but accurate, urgent but not reckless. You are highly adapted to Korean speed pressure."),
      tone: "#ff3b30",
    };
  }
  if (score >= 620) {
    return {
      title: t("지하철 환승 고수", "Subway-transfer expert"),
      desc: t("판단이 빠르고 동선 감각이 좋습니다. 다만 한두 번은 마음이 손보다 먼저 뛰었습니다.", "Fast judgment and solid route sense. Once or twice, your heart ran before your hand."),
      tone: "#ff6b35",
    };
  }
  if (score >= 500) {
    return {
      title: t("엘리베이터 닫힘 버튼 장인", "Elevator-close-button artisan"),
      desc: t("속도 본능은 확실합니다. 정확도만 조금 더 챙기면 일상 미션이 훨씬 편해집니다.", "The speed instinct is there. A bit more accuracy makes daily missions much easier."),
      tone: "#f59e0b",
    };
  }
  if (score >= 360) {
    return {
      title: t("한국 생활 적응 완료", "Korean-life adaptation complete"),
      desc: t("평균적인 급함은 따라갑니다. 아주 복잡한 상황에서는 1초만 더 보고 움직이면 좋습니다.", "You can keep up with ordinary urgency. In complex moments, look one second longer."),
      tone: "#22c55e",
    };
  }
  return {
    title: t("아직 여유로운 관광객", "Still a relaxed tourist"),
    desc: t("속도가 부족하다기보다 상황 읽기가 늦었습니다. 한국식 빨리빨리는 빠름보다 빠른 판단입니다.", "It is not just speed; situation reading came late. Korean speed is quick judgment before quick hands."),
    tone: "#64748b",
  };
}

export default function PpalliGame() {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [remaining, setRemaining] = useState(SITUATIONS[0].limitMs);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);

  const current = SITUATIONS[round] ?? SITUATIONS[0];

  const finishRound = (choice: number | null) => {
    if (phase !== "playing" || finishedRef.current) return;
    finishedRef.current = true;
    const elapsed = Math.min(current.limitMs, performance.now() - startedAtRef.current);
    const correct = choice === current.correct;
    const speedRatio = Math.max(0, Math.min(1, 1 - elapsed / current.limitMs));
    const points = correct ? Math.round(62 + speedRatio * 38) : Math.round(speedRatio * 18);
    const result: RoundResult = { id: current.id, choice, elapsedMs: elapsed, correct, points };
    setResults((prev) => [...prev, result]);
    setLastResult(result);
    setPhase("feedback");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    finishedRef.current = false;
    startedAtRef.current = performance.now();
    setRemaining(current.limitMs);
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - startedAtRef.current;
      const left = current.limitMs - elapsed;
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        finishRound(null);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, round]);

  const start = () => {
    setRound(0);
    setResults([]);
    setLastResult(null);
    setPhase("playing");
  };

  const next = () => {
    if (round + 1 >= SITUATIONS.length) {
      setPhase("done");
      return;
    }
    setRound((value) => value + 1);
    setLastResult(null);
    setPhase("playing");
  };

  const totalScore = useMemo(() => results.reduce((sum, result) => sum + result.points, 0), [results]);
  const correctCount = useMemo(() => results.filter((result) => result.correct).length, [results]);
  const tier = getTier(totalScore, correctCount, t);
  const shareText = t(
    `내 빨리빨리 결과는 "${tier.title}" · ${totalScore}점 · ${correctCount}/${SITUATIONS.length}개 성공`,
    `My Ppalli result: "${tier.title}" · ${totalScore} pts · ${correctCount}/${SITUATIONS.length} correct`,
  );

  if (phase === "intro") {
    return (
      <main className="min-h-screen page-in flex items-center justify-center px-5 py-16" style={{ background: "#fff7ed", color: "#1c1917" }}>
        <GameIntro
          eyebrow={t("SPEED · DAILY KOREA", "SPEED · DAILY KOREA")}
          title={t("한국인 빨리빨리 시뮬레이터", "Korean Ppalli-Ppalli Simulator")}
          hook={t("급한 상황에서 빠르게 고르세요. 단, 위험하거나 틀린 선택은 점수가 깎입니다.", "Choose fast under pressure. Reckless or wrong choices lose points.")}
          howTo={t("8개의 생활 미션이 나옵니다. 속도와 정확도를 합산해 당신의 빨리빨리 타입을 보여줍니다.", "Eight daily missions. Speed and accuracy combine into your result type.")}
          meta={[t("약 40초", "40 sec"), t("8개 상황", "8 scenes"), t("결과 공유", "Share result")]}
          startLabel={t("시뮬레이션 시작", "Start simulation")}
          onStart={start}
          tone="light"
        />
        <AdMobileSticky />
      </main>
    );
  }

  if (phase === "done") {
    return (
      <main className="min-h-screen page-in" style={{ background: "#0f172a", color: "#fff" }}>
        <ResultScreen
          locale={locale}
          currentGameId="ppalli"
          eyebrow={t("빨리빨리 압박 테스트", "Ppalli pressure test")}
          title={tier.title}
          score={`${totalScore}`}
          scoreLabel={t("점", "pts")}
          description={tier.desc}
          details={[
            t(`${SITUATIONS.length}개 상황 중 ${correctCount}개를 정확히 처리했습니다.`, `${correctCount} of ${SITUATIONS.length} situations handled correctly.`),
            t(`평균 반응 시간 ${Math.round(results.reduce((sum, item) => sum + item.elapsedMs, 0) / results.length)}ms`, `Average response ${Math.round(results.reduce((sum, item) => sum + item.elapsedMs, 0) / results.length)}ms`),
            t("안전한 선택과 빠른 판단을 같이 봅니다.", "This score values safe choices and quick judgment together."),
          ]}
          shareTitle={t("빨리빨리 결과", "Ppalli result")}
          shareText={shareText}
          shareUrl="/games/ppalli"
          onReplay={start}
          replayLabel={t("다시 하기", "Play again")}
          recommendedIds={["react", "timesense", "traffic"]}
          tone="dark"
        />
        <div className="mx-auto max-w-3xl px-5 pb-12">
          <AdBottom />
        </div>
        <AdMobileSticky />
      </main>
    );
  }

  const progress = Math.max(0, Math.min(1, remaining / current.limitMs));
  const selectedText =
    lastResult?.choice === null
      ? t("시간 초과", "Timed out")
      : lastResult
        ? pick(current.choices[lastResult.choice], locale)
        : "";

  return (
    <main
      className="min-h-screen page-in"
      style={{
        background: "linear-gradient(180deg, #fff7ed 0%, #fee2e2 100%)",
        color: "#1c1917",
        fontFamily: "var(--font-noto-sans-kr), sans-serif",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-bold" style={{ color: "#9a3412", letterSpacing: "0.08em" }}>
            <span>{t("상황", "Scene")} {round + 1}/{SITUATIONS.length}</span>
            <span className="tabular-nums">{(remaining / 1000).toFixed(1)}s</span>
          </div>
          <div style={{ marginTop: 10, height: 10, borderRadius: 999, background: "rgba(28,25,23,0.12)", overflow: "hidden" }}>
            <div
              style={{
                width: `${phase === "playing" ? progress * 100 : 100}%`,
                height: "100%",
                borderRadius: 999,
                background: progress > 0.45 ? "#22c55e" : progress > 0.2 ? "#f59e0b" : "#ef4444",
                transition: "width 80ms linear",
              }}
            />
          </div>
        </div>

        <section
          style={{
            flex: 1,
            display: "grid",
            alignContent: "center",
            gap: 22,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, color: "#ea580c", fontWeight: 900, letterSpacing: "0.12em" }}>
              {t("한국식 급함 미션", "Korean urgency mission")}
            </p>
            <h1 style={{ margin: "14px 0 0", fontSize: "clamp(34px, 9vw, 58px)", lineHeight: 1.05, letterSpacing: 0, fontWeight: 900 }}>
              {pick(current.title, locale)}
            </h1>
            <p style={{ margin: "16px auto 0", maxWidth: 560, color: "#57534e", fontSize: 18, lineHeight: 1.65 }}>
              {pick(current.setup, locale)}
            </p>
          </div>

          {phase === "playing" ? (
            <div style={{ display: "grid", gap: 12 }}>
              {current.choices.map((choice, index) => (
                <button
                  key={choice.ko}
                  type="button"
                  onClick={() => finishRound(index)}
                  style={{
                    minHeight: 62,
                    border: "2px solid rgba(28,25,23,0.12)",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#1c1917",
                    padding: "16px 18px",
                    textAlign: "left",
                    fontSize: 18,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 10px 24px rgba(28,25,23,0.08)",
                    touchAction: "manipulation",
                  }}
                >
                  {pick(choice, locale)}
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#fff",
                border: lastResult?.correct ? "2px solid #22c55e" : "2px solid #ef4444",
                borderRadius: 10,
                padding: "24px 22px",
                boxShadow: "0 16px 36px rgba(28,25,23,0.1)",
              }}
            >
              <p style={{ margin: 0, color: lastResult?.correct ? "#16a34a" : "#dc2626", fontWeight: 900, fontSize: 16 }}>
                {lastResult?.correct ? t("정확하고 빠름", "Fast and correct") : t("아쉽습니다", "Not quite")}
              </p>
              <h2 style={{ margin: "10px 0 0", fontSize: 28, lineHeight: 1.2 }}>
                {selectedText}
              </h2>
              <p style={{ margin: "12px 0 0", color: "#57534e", fontSize: 17, lineHeight: 1.65 }}>
                {pick(lastResult?.correct ? current.success : current.fail, locale)}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="tabular-nums" style={{ color: "#9a3412", fontWeight: 900 }}>
                  +{lastResult?.points ?? 0} {t("점", "pts")}
                </span>
                <button
                  type="button"
                  onClick={next}
                  style={{
                    minHeight: 46,
                    border: "none",
                    borderRadius: 999,
                    background: "#1c1917",
                    color: "#fff",
                    padding: "0 22px",
                    fontSize: 15,
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {round + 1 >= SITUATIONS.length ? t("결과 보기", "See result") : t("다음 상황", "Next scene")}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
      <AdMobileSticky />
    </main>
  );
}
