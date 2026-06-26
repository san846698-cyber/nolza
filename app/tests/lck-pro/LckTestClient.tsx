"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { AdResult } from "@/app/components/Ads";
import { homeBackLabel } from "@/app/components/BrandMark";
import RecommendedGames from "@/app/components/game/RecommendedGames";
import {
  trackQuestionAnswered,
  trackResultView,
  trackRetryClick,
  trackShareClick,
  trackTestStart,
} from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  LCK_ACCENT,
  LCK_ACCENT_INK,
  LCK_CHAMP_BASE,
  LCK_ID,
  LCK_NOTICE,
  LCK_PATH,
  LCK_PHOTO_BASE,
  LCK_POSITIONS,
  LCK_PLAYERS,
  LCK_QUESTIONS,
  LCK_STYLES,
  LCK_USE_PHOTOS,
  isLckPlayerKey,
  lckResult,
  posKo,
  type LckPlayer,
  type LckPosKey,
  type LckStyleKey,
} from "@/lib/playstyle/lck";
import { m, QuestionTransition, useReducedMotion } from "@/app/components/motion/Motion";

type Phase = "intro" | "quiz" | "result";
type LckSharePayload = { v: 1; resultId: string };

// 2축: 포지션 직접 선택(축1) → 스타일 5문항(축2) = 25명. UI 한국어 고정.
export default function LckTestClient(): ReactElement {
  const [phase, setPhase] = useState<Phase>("intro");
  const [position, setPosition] = useState<LckPosKey | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picks, setPicks] = useState<LckStyleKey[][]>([]);
  const [sharedKey, setSharedKey] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<LckSharePayload>(
      new URLSearchParams(window.location.search).get("s"),
    );
    if (payload?.v === 1 && isLckPlayerKey(payload.resultId)) {
      const resultId = payload.resultId;
      const restoreId = window.setTimeout(() => {
        setSharedKey(resultId);
        setPhase("result");
        setQuestionIndex(LCK_QUESTIONS.length - 1);
        setPicks([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, []);

  const currentQuestion = LCK_QUESTIONS[questionIndex];
  const resultKey = useMemo<string | null>(() => {
    if (sharedKey) return sharedKey;
    if (!position) return null;
    return lckResult(position, picks);
  }, [sharedKey, position, picks]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / LCK_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase !== "quiz") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result" && resultKey) trackResultView(LCK_ID, resultKey);
  }, [phase, resultKey]);

  const startWithPosition = useCallback((pos: LckPosKey) => {
    trackTestStart(LCK_ID, "LCK Pro Test");
    setPosition(pos);
    setPhase("quiz");
    setQuestionIndex(0);
    setPicks([]);
    setSharedKey(null);
    setShareStatus("");
    window.history.replaceState(null, "", LCK_PATH);
  }, []);

  const choose = useCallback(
    (styles: LckStyleKey[]) => {
      if (!position) return;
      trackQuestionAnswered(LCK_ID, questionIndex + 1);
      const nextPicks = [...picks, styles];
      setPicks(nextPicks);
      setShareStatus("");
      if (questionIndex >= LCK_QUESTIONS.length - 1) {
        const key = lckResult(position, nextPicks);
        const url = buildShareUrl(LCK_PATH, { v: 1, resultId: key } satisfies LckSharePayload);
        window.history.replaceState(null, "", url);
        setPhase("result");
        return;
      }
      setQuestionIndex((value) => value + 1);
    },
    [picks, questionIndex, position],
  );

  const restart = useCallback(() => {
    setPhase("intro");
    setPosition(null);
    setQuestionIndex(0);
    setPicks([]);
    setSharedKey(null);
    setShareStatus("");
    window.history.replaceState(null, "", LCK_PATH);
  }, []);

  const share = useCallback(async () => {
    if (!resultKey) return;
    trackShareClick(LCK_ID, "test", resultKey);
    const p = LCK_PLAYERS[resultKey];
    const url = buildShareUrl(LCK_PATH, { v: 1, resultId: resultKey } satisfies LckSharePayload);
    const title = "LCK 프로게이머 성향 테스트 결과";
    const body = `나랑 닮은 LCK 프로는 [${p.name}]! (${posKo(p.pos)} · ${LCK_STYLES[p.style]}) 너도 해봐 👉 ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: body });
        setShareStatus("공유 창을 열었습니다.");
        return;
      }
      await navigator.clipboard.writeText(body);
      setShareStatus("결과 링크를 복사했습니다.");
    } catch {
      try {
        await navigator.clipboard.writeText(body);
        setShareStatus("결과 링크를 복사했습니다.");
      } catch {
        setShareStatus("링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.");
      }
    }
  }, [resultKey]);

  const rootStyle = {
    "--ps-accent": LCK_ACCENT,
    "--ps-accent-ink": LCK_ACCENT_INK,
  } as CSSProperties;

  const result = resultKey ? LCK_PLAYERS[resultKey] : null;

  return (
    <main className="lck-test" style={rootStyle}>
      <section className="lck-shell">
        <nav className="lck-back">
          <Link href="/">{homeBackLabel("ko")}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="lck-hero">
            <div className="lck-hero-copy">
              <span className="lck-pill">LCK PRO TEST</span>
              <h1 className="lck-title">
                <span className="lck-title__top">LCK 프로게이머</span>
                <span className="lck-title__accent">성향 테스트</span>
              </h1>
              <p className="lck-sub">너랑 가장 닮은 LCK 선수는 누구?</p>
              <p className="lck-desc">
                주 포지션을 고르고 5문항만 답하면, 너의 플레이 성향과 똑 닮은 LCK 프로게이머를 찾아드립니다. 포지션별 5명, 총 25명 중 한 명.
              </p>
              <div className="lck-chips" aria-label="테스트 정보">
                <span>포지션 + 5문항</span>
                <span>약 1분</span>
                <span>LCK 25인</span>
              </div>
              <p className="lck-poslabel">너의 주 포지션은?</p>
              <div className="lck-pos">
                {LCK_POSITIONS.map((p) => (
                  <button key={p.key} type="button" className="lck-pos__btn" onClick={() => startWithPosition(p.key)}>
                    {p.ko}
                  </button>
                ))}
              </div>
              <p className="lck-notice">{LCK_NOTICE}</p>
            </div>
          </section>
        ) : (
          <section className="lck-card">
            <div className="lck-prog">
              <span>
                {phase === "result" ? "결과" : `${posKo(position as LckPosKey)} · 질문`}
              </span>
              <strong>
                {phase === "result"
                  ? `${LCK_QUESTIONS.length}/${LCK_QUESTIONS.length}`
                  : `Q${questionIndex + 1}/${LCK_QUESTIONS.length}`}
              </strong>
            </div>
            <div className="lck-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <QuestionTransition motionKey={questionIndex}>
                <h2 className="lck-q">{currentQuestion.q}</h2>
                <div className="lck-opts">
                  {currentQuestion.answers.map((answer, index) => (
                    <button key={index} type="button" className="lck-opt" onClick={() => choose(answer.styles)}>
                      <span className="lck-opt__badge">{String.fromCharCode(65 + index)}</span>
                      <strong>{answer.label}</strong>
                    </button>
                  ))}
                </div>
              </QuestionTransition>
            ) : result ? (
              <ResultView player={result} shared={Boolean(sharedKey)} onRetry={restart} onShare={share} shareStatus={shareStatus} />
            ) : null}
          </section>
        )}

        <footer className="lck-disclaimer">{LCK_NOTICE}</footer>
      </section>

      {phase === "result" && (
        <div className="result-screen--dark">
          <AdResult placement={`${LCK_ID}-result`} />
          <RecommendedGames
            currentId={LCK_ID}
            ids={["lol-playstyle", "valorant-playstyle", "overwatch-playstyle", "pubg-playstyle"]}
            title={{ ko: "다음에 해볼 테스트", en: "Try These Next" }}
            locale="ko"
          />
        </div>
      )}

      <style jsx global>{styles}</style>
    </main>
  );
}

function PlayerMedia({ player }: { player: LckPlayer }): ReactElement {
  const [stage, setStage] = useState<"photo" | "champ" | "text">(LCK_USE_PHOTOS ? "photo" : "champ");

  if (stage === "text") {
    return (
      <div className="lck-media lck-media--text">
        <span className="lck-media__name">{player.name}</span>
        <span className="lck-media__role">
          {posKo(player.pos)} · {LCK_STYLES[player.style]}
        </span>
      </div>
    );
  }

  const src = stage === "photo" ? `${LCK_PHOTO_BASE}/${player.key}.jpg` : `${LCK_CHAMP_BASE}/${player.key}.jpg`;
  return (
    <Image
      key={stage}
      src={src}
      alt={`${player.name} 사진`}
      fill
      sizes="(max-width: 520px) 90vw, 440px"
      style={{ objectFit: "cover", objectPosition: "center top" }}
      onError={() => setStage((s) => (s === "photo" ? "champ" : "text"))}
      priority
    />
  );
}

function ResultView({
  player,
  shared,
  onRetry,
  onShare,
  shareStatus,
}: {
  player: LckPlayer;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  const reduce = useReducedMotion();
  return (
    <m.section
      className="lck-result"
      initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduce ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {shared ? <span className="lck-shared">공유된 결과</span> : null}
      <p className="lck-result__eyebrow">나랑 닮은 LCK 프로</p>

      <div className="lck-poster">
        <PlayerMedia player={player} />
        <div className="lck-poster__veil" aria-hidden />
        <div className="lck-poster__body">
          <span className="lck-poster__kicker">
            {posKo(player.pos)} · {LCK_STYLES[player.style]}
          </span>
          <h2 className="lck-poster__name">{player.name}상</h2>
          <div className="lck-poster__tags" aria-label="성향 태그">
            {player.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="lck-result__desc">{player.desc}</p>

      <div className="lck-actions">
        <button type="button" className="lck-cta" onClick={onShare}>
          친구에게 공유하기
        </button>
        <button
          type="button"
          className="lck-ghost"
          onClick={() => {
            trackRetryClick(LCK_ID, "test");
            onRetry();
          }}
        >
          {shared ? "나도 해보기" : "다시 하기"}
        </button>
        <p className="lck-status" role="status" aria-live="polite">{shareStatus}</p>
      </div>
    </m.section>
  );
}

const styles = `
  .lck-test {
    --ps-font: var(--font-pretendard), "Pretendard", system-ui, -apple-system, "Segoe UI", "Apple SD Gothic Neo", sans-serif;
    --ps-cyan: #63b3e8;
    --ps-card-bg: linear-gradient(160deg, rgba(21,33,55,0.96), rgba(11,19,34,0.96));
    --ps-border: rgba(140,170,215,0.18);
    min-height: 100vh;
    min-height: 100svh;
    overflow-x: hidden;
    overflow-y: auto;
    color: #eef3fb;
    font-family: var(--ps-font);
    background:
      radial-gradient(circle at 50% -12%, rgba(120,160,220,0.10), transparent 46%),
      linear-gradient(180deg, #0a1322 0%, #0b1525 55%, #080f1c 100%) !important;
    padding: 24px clamp(16px, 4vw, 44px) 56px;
  }
  .lck-test * { font-family: var(--ps-font); }

  .lck-test .lck-shell { width: min(100%, 1040px); margin: 0 auto 34px; padding-top: clamp(10px, 2.5vh, 28px); }
  .lck-test .lck-back { margin-bottom: 18px; font-size: 14px; }
  .lck-test .lck-back a { display: inline-flex; align-items: center; min-height: 44px; color: rgba(190,205,228,0.78); text-decoration: none; }
  .lck-test .lck-back a:hover { color: #eef3fb; }

  .lck-test .lck-hero,
  .lck-test .lck-card {
    border: 1px solid var(--ps-border); border-radius: 14px; background: var(--ps-card-bg);
    box-shadow: 0 30px 80px rgba(2, 6, 18, 0.55);
  }
  .lck-test .lck-hero { display: block; width: min(100%, 840px); margin: 0 auto; padding: clamp(28px, 5vw, 60px) 0; overflow: hidden; background: transparent; border: 0; box-shadow: none; }
  .lck-test .lck-hero-copy { width: min(100%, 760px); }

  .lck-test .lck-pill {
    display: inline-block; border: 1px solid var(--ps-accent); border-radius: 999px; padding: 7px 16px;
    color: var(--ps-accent); font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
  }
  .lck-test .lck-title { margin: 22px 0 0; line-height: 1.1; letter-spacing: -0.02em; font-weight: 800; font-size: clamp(32px, 6.4vw, 54px); }
  .lck-test .lck-title__top { display: block; color: #f3f7ff; }
  .lck-test .lck-title__accent { display: block; color: var(--ps-accent); }
  .lck-test .lck-sub { margin: 20px 0 0; color: var(--ps-cyan); font-size: clamp(17px, 2.4vw, 22px); font-weight: 800; letter-spacing: -0.01em; }
  .lck-test .lck-desc { margin: 14px 0 24px; max-width: 640px; color: #9fb0c8; font-size: 16px; line-height: 1.72; }

  .lck-test .lck-chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 26px; }
  .lck-test .lck-chips span {
    border: 1px solid var(--ps-border); border-radius: 999px; background: rgba(140,170,215,0.06);
    color: #c3d2e6; padding: 8px 15px; font-size: 13px; font-weight: 700;
  }

  .lck-test .lck-poslabel { margin: 0 0 12px; color: var(--ps-accent); font-size: 14px; font-weight: 800; letter-spacing: 0.04em; }
  .lck-test .lck-pos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .lck-test .lck-pos__btn {
    min-height: 64px; border: 1px solid var(--ps-border); border-radius: 10px;
    background: rgba(140,170,215,0.06); color: #eef3fb; cursor: pointer;
    font-size: 18px; font-weight: 800;
    transition: transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
  .lck-test .lck-pos__btn:hover {
    transform: translateY(-2px); border-color: var(--ps-accent); background: rgba(140,170,215,0.12);
    box-shadow: 0 14px 28px rgba(2, 6, 18, 0.4);
  }

  .lck-test .lck-notice { margin: 18px 0 0; max-width: 640px; color: #8696b0; font-size: 13px; line-height: 1.6; }

  .lck-test .lck-card { margin-top: clamp(12px, 3vh, 28px); padding: clamp(24px, 4vw, 44px); }
  .lck-test .lck-prog { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
  .lck-test .lck-prog span { color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.08em; }
  .lck-test .lck-prog strong { color: #9fb4d4; font-size: 15px; font-weight: 700; }
  .lck-test .lck-bar { height: 9px; overflow: hidden; border-radius: 999px; background: rgba(140,170,215,0.14); }
  .lck-test .lck-bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--ps-cyan), var(--ps-accent)); transition: width 220ms ease; }

  .lck-test .lck-q { margin: 26px 0 22px; color: #f3f7ff; font-weight: 800; line-height: 1.3; letter-spacing: -0.01em; font-size: clamp(22px, 3.6vw, 32px); }

  .lck-test .lck-opts { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .lck-test .lck-opt {
    display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center;
    border: 1px solid var(--ps-border); border-radius: 10px; background: rgba(140,170,215,0.05);
    color: #e9f0fa; cursor: pointer; padding: 16px 18px; text-align: left;
    transition: transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
  .lck-test .lck-opt__badge { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; background: var(--ps-accent); color: var(--ps-accent-ink); font-size: 14px; font-weight: 800; }
  .lck-test .lck-opt strong { font-size: 16px; line-height: 1.45; font-weight: 600; }
  .lck-test .lck-opt:hover { transform: translateY(-2px); border-color: var(--ps-accent); background: rgba(140,170,215,0.10); box-shadow: 0 16px 30px rgba(2, 6, 18, 0.4); }

  .lck-test .lck-result { display: grid; gap: 20px; }
  .lck-test .lck-shared { width: max-content; border: 1px solid var(--ps-accent); border-radius: 999px; background: rgba(255,255,255,0.04); color: var(--ps-accent); padding: 7px 14px; font-size: 13px; font-weight: 800; }
  .lck-test .lck-result__eyebrow { margin: 0; color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }

  .lck-test .lck-poster {
    position: relative; width: 100%; max-width: 440px; margin: 0 auto; aspect-ratio: 4 / 5; overflow: hidden;
    border-radius: 14px; border: 1px solid var(--ps-accent); box-shadow: 0 26px 64px rgba(2, 6, 18, 0.62); background: #0d1830;
  }
  .lck-test .lck-media { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #0d1830; }
  .lck-test .lck-media--text .lck-media__name { color: #fff; font-size: clamp(32px, 8vw, 52px); font-weight: 800; letter-spacing: -0.02em; }
  .lck-test .lck-media--text .lck-media__role { color: var(--ps-accent); font-size: clamp(15px, 3.5vw, 20px); font-weight: 800; }

  .lck-test .lck-poster__veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,10,20,0) 0%, rgba(5,10,20,0.12) 38%, rgba(5,10,20,0.82) 76%, rgba(5,10,20,0.97) 100%); }
  .lck-test .lck-poster__body { position: absolute; left: 0; right: 0; bottom: 0; display: grid; gap: 8px; padding: clamp(18px, 4vw, 28px); }
  .lck-test .lck-poster__kicker { color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.02em; }
  .lck-test .lck-poster__name { margin: 0; color: #fff; font-weight: 800; font-size: clamp(34px, 9vw, 54px); line-height: 1.05; letter-spacing: -0.01em; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55); }
  .lck-test .lck-poster__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .lck-test .lck-poster__tags span { border: 1px solid rgba(255,255,255,0.26); border-radius: 999px; background: rgba(8, 14, 28, 0.5); color: #eaf2ff; padding: 6px 11px; font-size: 12.5px; font-weight: 700; }

  .lck-test .lck-result__desc { margin: 0; color: #aebdd4; font-size: 17px; line-height: 1.82; }

  .lck-test .lck-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .lck-test .lck-cta, .lck-test .lck-ghost {
    border: 0; cursor: pointer; min-height: 52px; border-radius: 10px; padding: 0 24px; font-size: 16px; font-weight: 800;
    transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease, background 160ms ease;
  }
  .lck-test .lck-cta { color: var(--ps-accent-ink); background-color: var(--ps-accent); background-image: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.06)); box-shadow: 0 16px 34px rgba(2, 6, 18, 0.45); }
  .lck-test .lck-cta:hover { transform: translateY(-2px); filter: brightness(1.07); box-shadow: 0 20px 42px rgba(2, 6, 18, 0.5); }
  .lck-test .lck-ghost { color: #e4ecf8; background: rgba(140,170,215,0.10); border: 1px solid var(--ps-border); }
  .lck-test .lck-ghost:hover { transform: translateY(-2px); background: rgba(140,170,215,0.16); }
  .lck-test .lck-status { margin: 0; color: #aebdd4; font-size: 14px; }

  .lck-test .lck-disclaimer { margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--ps-border); color: #8696b0; font-size: 12.5px; line-height: 1.7; }

  @media (max-width: 520px) {
    .lck-test { padding-inline: 14px; }
    .lck-test .lck-hero, .lck-test .lck-card { border-radius: 14px; }
    .lck-test .lck-actions .lck-cta, .lck-test .lck-actions .lck-ghost { flex: 1 1 100%; width: 100%; }
  }
`;
