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
  isTypeKey,
  scorePlaystyle,
  type PlaystyleConfig,
  type PlaystyleSharePayload,
  type PlaystyleType,
} from "@/lib/playstyle/core";

type Phase = "intro" | "quiz" | "result";

// 4개 게임 성향 테스트 공용 UI. 전 화면 다크 네이비 카드 통일, Pretendard.
// 클래스는 psx- 네임스페이스로 전역(globals.css) 페이퍼 테마와 완전 분리.
// 게임별로는 악센트 색(--ps-accent)만 분기. UI 전체 한국어 고정.
export default function PlaystyleTestClient({
  config,
}: {
  config: PlaystyleConfig;
}): ReactElement {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picks, setPicks] = useState<string[][]>([]);
  const [sharedKey, setSharedKey] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const payload = decodeSharePayload<PlaystyleSharePayload>(
      new URLSearchParams(window.location.search).get("s"),
    );
    if (payload?.v === 1 && isTypeKey(config, payload.resultId)) {
      const resultId = payload.resultId;
      const restoreId = window.setTimeout(() => {
        setSharedKey(resultId);
        setPhase("result");
        setQuestionIndex(config.questions.length - 1);
        setPicks([]);
      }, 0);
      return () => window.clearTimeout(restoreId);
    }
  }, [config]);

  const currentQuestion = config.questions[questionIndex];
  const resultKey = useMemo<string>(
    () => sharedKey ?? scorePlaystyle(picks, config.tiebreak),
    [picks, sharedKey, config.tiebreak],
  );
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / config.questions.length) * 100;

  useEffect(() => {
    if (phase !== "quiz") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result") trackResultView(config.id, resultKey);
  }, [phase, resultKey, config.id]);

  const start = useCallback(() => {
    trackTestStart(config.id, config.testName);
    setPhase("quiz");
    setQuestionIndex(0);
    setPicks([]);
    setSharedKey(null);
    setShareStatus("");
    window.history.replaceState(null, "", config.path);
  }, [config.id, config.testName, config.path]);

  const choose = useCallback(
    (types: string[]) => {
      trackQuestionAnswered(config.id, questionIndex + 1);
      const nextPicks = [...picks, types];
      setPicks(nextPicks);
      setShareStatus("");
      if (questionIndex >= config.questions.length - 1) {
        const nextKey = scorePlaystyle(nextPicks, config.tiebreak);
        const url = buildShareUrl(config.path, {
          v: 1,
          resultId: nextKey,
        } satisfies PlaystyleSharePayload);
        window.history.replaceState(null, "", url);
        setPhase("result");
        return;
      }
      setQuestionIndex((value) => value + 1);
    },
    [picks, questionIndex, config.id, config.path, config.questions.length, config.tiebreak],
  );

  const share = useCallback(async () => {
    trackShareClick(config.id, "test", resultKey);
    const type = config.types[resultKey];
    const url = buildShareUrl(config.path, {
      v: 1,
      resultId: resultKey,
    } satisfies PlaystyleSharePayload);
    const title = `${config.gameLabel} 플레이 성향 테스트 결과`;
    const body = `나의 ${config.gameLabel} 성향은 [${type.ko}]! (${config.pairLabel}: ${type.pair}) 너도 해봐 👉 ${url}`;
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
  }, [resultKey, config]);

  const rootStyle = {
    "--ps-accent": config.theme.accent,
    "--ps-accent-ink": config.theme.accentInk,
  } as CSSProperties;

  return (
    <main className="ps-test" style={rootStyle}>
      <section className="psx-shell">
        <nav className="psx-back">
          <Link href="/">{homeBackLabel("ko")}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="psx-hero">
            <div className="psx-hero-copy">
              <span className="psx-pill">{config.eyebrowPill}</span>
              <h1 className="psx-title">
                <span className="psx-title__top">{config.gameLabel} 플레이</span>
                <span className="psx-title__accent">성향 테스트</span>
              </h1>
              <p className="psx-sub">{config.introSub}</p>
              <p className="psx-desc">{config.introDesc}</p>
              <div className="psx-chips" aria-label="테스트 정보">
                <span>9문항</span>
                <span>약 2분</span>
                <span>{config.introTypeLine}</span>
              </div>
              <button type="button" onClick={start} className="psx-cta psx-cta--block">
                테스트 시작하기
              </button>
              <p className="psx-notice">
                이 테스트는 전문적인 진단이 아닌, 게임 속 플레이 성향을 바탕으로 만든 재미용 콘텐츠입니다.
              </p>
            </div>
          </section>
        ) : (
          <section className="psx-card">
            <div className="psx-prog">
              <span>{phase === "result" ? "결과" : "질문"}</span>
              <strong>
                {phase === "result"
                  ? `${config.questions.length}/${config.questions.length}`
                  : `Q${questionIndex + 1}/${config.questions.length}`}
              </strong>
            </div>
            <div className="psx-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <>
                <h2 className="psx-q">{currentQuestion.q}</h2>
                <div className="psx-opts">
                  {currentQuestion.answers.map((answer, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => choose(answer.types)}
                      className="psx-opt"
                    >
                      <span className="psx-opt__badge">{String.fromCharCode(65 + index)}</span>
                      <strong>{answer.label}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <ResultView
                config={config}
                resultKey={resultKey}
                shared={Boolean(sharedKey)}
                onRetry={start}
                onShare={share}
                shareStatus={shareStatus}
              />
            )}
          </section>
        )}

        <footer className="psx-disclaimer">{config.notice}</footer>
      </section>

      {phase === "result" && (
        <div className="result-screen--dark">
          <AdResult placement={`${config.id}-result`} />
          <RecommendedGames
            currentId={config.id}
            ids={config.recommendIds}
            title={{ ko: "다음에 해볼 테스트", en: "Try These Next" }}
            locale="ko"
          />
        </div>
      )}

      <style jsx global>{styles}</style>
    </main>
  );
}

function HeroMedia({
  config,
  type,
}: {
  config: PlaystyleConfig;
  type: PlaystyleType;
}): ReactElement {
  const [failed, setFailed] = useState(false);

  if (config.media === "art" && config.artBase && type.img && !failed) {
    return (
      <Image
        src={`${config.artBase}/${type.img}.${config.artExt ?? "png"}`}
        alt={`${type.pair} 일러스트`}
        fill
        sizes="(max-width: 520px) 90vw, 440px"
        style={{ objectFit: "cover", objectPosition: "center top" }}
        onError={() => setFailed(true)}
        priority
      />
    );
  }

  if (config.media === "emoji" && type.emoji) {
    return (
      <div className="psx-media">
        <span className="psx-media__emoji" role="img" aria-label={type.pair}>
          {type.emoji}
        </span>
      </div>
    );
  }

  if (config.media === "role" && type.role) {
    const color = config.roleColors?.[type.role] ?? config.theme.accent;
    const emoji = config.roleEmoji?.[type.role] ?? "";
    return (
      <div
        className="psx-media"
        style={{ background: `radial-gradient(circle at 50% 38%, ${color}3d, transparent 62%), #0d1830` }}
      >
        <span className="psx-media__emoji" role="img" aria-hidden>
          {emoji}
        </span>
        <span className="psx-media__role" style={{ color }}>
          {type.role}
        </span>
      </div>
    );
  }

  return (
    <div className="psx-media psx-media--fallback">
      <span>{type.pair}</span>
    </div>
  );
}

function ResultView({
  config,
  resultKey,
  shared,
  onRetry,
  onShare,
  shareStatus,
}: {
  config: PlaystyleConfig;
  resultKey: string;
  shared: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
}): ReactElement {
  const type = config.types[resultKey];
  return (
    <section className="psx-result">
      {shared ? <span className="psx-shared">공유된 결과</span> : null}

      <p className="psx-result__eyebrow">나의 {config.gameLabel} 성향</p>

      <div className="psx-poster">
        <HeroMedia config={config} type={type} />
        <div className="psx-poster__veil" aria-hidden />
        <div className="psx-poster__body">
          <span className="psx-poster__kicker">
            {config.pairLabel} · {type.pair}
          </span>
          <h2 className="psx-poster__name">{type.ko}</h2>
          <p className="psx-poster__en">{type.en}</p>
          <div className="psx-poster__tags" aria-label="성향 태그">
            {type.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="psx-result__desc">{type.desc}</p>

      <div className="psx-actions">
        <button type="button" className="psx-cta" onClick={onShare}>
          친구에게 공유하기
        </button>
        <button
          type="button"
          className="psx-ghost"
          onClick={() => {
            trackRetryClick(config.id, "test");
            onRetry();
          }}
        >
          {shared ? "나도 해보기" : "다시 하기"}
        </button>
        <p className="psx-status" role="status" aria-live="polite">{shareStatus}</p>
      </div>
    </section>
  );
}

const styles = `
  .ps-test {
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
  .ps-test * { font-family: var(--ps-font); }

  .ps-test .psx-shell {
    width: min(100%, 1040px);
    margin: 0 auto 34px;
    padding-top: clamp(10px, 2.5vh, 28px);
  }

  .ps-test .psx-back { margin-bottom: 18px; font-size: 14px; }
  .ps-test .psx-back a { display: inline-flex; align-items: center; min-height: 44px; color: rgba(190,205,228,0.78); text-decoration: none; }
  .ps-test .psx-back a:hover { color: #eef3fb; }

  .ps-test .psx-hero,
  .ps-test .psx-card {
    border: 1px solid var(--ps-border);
    border-radius: 24px;
    background: var(--ps-card-bg);
    box-shadow: 0 30px 80px rgba(2, 6, 18, 0.55);
  }

  .ps-test .psx-hero {
    display: block;
    width: min(100%, 840px);
    margin: 0 auto;
    padding: clamp(28px, 5vw, 60px);
    overflow: hidden;
  }
  .ps-test .psx-hero-copy { width: min(100%, 720px); }

  .ps-test .psx-pill {
    display: inline-block;
    border: 1px solid var(--ps-accent);
    border-radius: 999px;
    padding: 7px 16px;
    color: var(--ps-accent);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ps-test .psx-title {
    margin: 22px 0 0;
    line-height: 1.1;
    letter-spacing: -0.01em;
    font-weight: 800;
    font-size: clamp(38px, 8vw, 60px);
  }
  .ps-test .psx-title__top { display: block; color: #f3f7ff; }
  .ps-test .psx-title__accent { display: block; color: var(--ps-accent); }

  .ps-test .psx-sub {
    margin: 20px 0 0;
    color: var(--ps-cyan);
    font-size: clamp(17px, 2.4vw, 22px);
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .ps-test .psx-desc {
    margin: 14px 0 26px;
    max-width: 620px;
    color: #9fb0c8;
    font-size: 16px;
    line-height: 1.72;
  }

  .ps-test .psx-chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 26px; }
  .ps-test .psx-chips span {
    border: 1px solid var(--ps-border);
    border-radius: 999px;
    background: rgba(140,170,215,0.06);
    color: #c3d2e6;
    padding: 8px 15px;
    font-size: 13px;
    font-weight: 700;
  }

  .ps-test .psx-cta,
  .ps-test .psx-ghost {
    border: 0;
    cursor: pointer;
    min-height: 56px;
    border-radius: 16px;
    padding: 0 26px;
    font-size: 17px;
    font-weight: 800;
    transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease, background 160ms ease;
  }
  .ps-test .psx-cta--block { display: block; width: 100%; }

  .ps-test .psx-cta {
    color: var(--ps-accent-ink);
    background-color: var(--ps-accent);
    background-image: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.06));
    box-shadow: 0 16px 34px rgba(2, 6, 18, 0.45);
  }
  .ps-test .psx-cta:hover { transform: translateY(-2px); filter: brightness(1.07); box-shadow: 0 20px 42px rgba(2, 6, 18, 0.5); }

  .ps-test .psx-ghost {
    color: #e4ecf8;
    background: rgba(140,170,215,0.10);
    border: 1px solid var(--ps-border);
  }
  .ps-test .psx-ghost:hover { transform: translateY(-2px); background: rgba(140,170,215,0.16); }

  .ps-test .psx-notice {
    margin: 18px 0 0;
    max-width: 620px;
    color: #8696b0;
    font-size: 13.5px;
    line-height: 1.6;
  }

  .ps-test .psx-card { margin-top: clamp(12px, 3vh, 28px); padding: clamp(24px, 4vw, 44px); }

  .ps-test .psx-prog { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
  .ps-test .psx-prog span {
    color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .ps-test .psx-prog strong { color: #9fb4d4; font-size: 15px; font-weight: 700; }

  .ps-test .psx-bar { height: 9px; overflow: hidden; border-radius: 999px; background: rgba(140,170,215,0.14); }
  .ps-test .psx-bar span {
    display: block; height: 100%; border-radius: inherit;
    background: linear-gradient(90deg, var(--ps-cyan), var(--ps-accent));
    transition: width 220ms ease;
  }

  .ps-test .psx-q {
    margin: 26px 0 22px; color: #f3f7ff; font-weight: 800; line-height: 1.3;
    letter-spacing: -0.01em; font-size: clamp(22px, 3.6vw, 32px);
  }

  .ps-test .psx-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .ps-test .psx-opt {
    display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center;
    border: 1px solid var(--ps-border); border-radius: 16px;
    background: rgba(140,170,215,0.05); color: #e9f0fa; cursor: pointer;
    padding: 17px 18px; text-align: left;
    transition: transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
  .ps-test .psx-opt__badge {
    display: grid; place-items: center; width: 32px; height: 32px; border-radius: 11px;
    background: var(--ps-accent); color: var(--ps-accent-ink); font-size: 14px; font-weight: 900;
  }
  .ps-test .psx-opt strong { font-size: 16px; line-height: 1.45; font-weight: 600; }
  .ps-test .psx-opt:hover {
    transform: translateY(-2px); border-color: var(--ps-accent);
    background: rgba(140,170,215,0.10); box-shadow: 0 16px 30px rgba(2, 6, 18, 0.4);
  }

  .ps-test .psx-result { display: grid; gap: 20px; }
  .ps-test .psx-shared {
    width: max-content; border: 1px solid var(--ps-accent); border-radius: 999px;
    background: rgba(255,255,255,0.04); color: var(--ps-accent);
    padding: 7px 14px; font-size: 13px; font-weight: 800;
  }
  .ps-test .psx-result__eyebrow {
    margin: 0; color: var(--ps-accent); font-size: 13px; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  .ps-test .psx-poster {
    position: relative; width: 100%; max-width: 440px; margin: 0 auto;
    aspect-ratio: 4 / 5; overflow: hidden; border-radius: 22px;
    border: 1px solid var(--ps-accent); box-shadow: 0 26px 64px rgba(2, 6, 18, 0.62);
    background: #0d1830;
  }
  .ps-test .psx-media {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px; background: #0d1830;
  }
  .ps-test .psx-media__emoji {
    font-size: clamp(96px, 26vw, 150px); line-height: 1; margin-top: -10%;
    filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.5));
  }
  .ps-test .psx-media__role { font-size: clamp(28px, 7vw, 40px); font-weight: 900; letter-spacing: 0.04em; }
  .ps-test .psx-media--fallback span {
    color: var(--ps-accent); font-size: clamp(30px, 7vw, 46px); font-weight: 900; text-align: center; padding: 16px;
  }

  .ps-test .psx-poster__veil {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(5,10,20,0) 0%, rgba(5,10,20,0.12) 38%, rgba(5,10,20,0.82) 76%, rgba(5,10,20,0.97) 100%);
  }
  .ps-test .psx-poster__body {
    position: absolute; left: 0; right: 0; bottom: 0; display: grid; gap: 8px; padding: clamp(18px, 4vw, 28px);
  }
  .ps-test .psx-poster__kicker { color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.02em; }
  .ps-test .psx-poster__name {
    margin: 0; color: #fff; font-weight: 800; font-size: clamp(32px, 8vw, 50px); line-height: 1.06;
    letter-spacing: -0.01em; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55);
  }
  .ps-test .psx-poster__en { margin: 0; color: var(--ps-cyan); font-size: clamp(15px, 2.4vw, 19px); font-weight: 800; }
  .ps-test .psx-poster__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
  .ps-test .psx-poster__tags span {
    border: 1px solid rgba(255,255,255,0.26); border-radius: 999px;
    background: rgba(8, 14, 28, 0.5); color: #eaf2ff; padding: 6px 11px; font-size: 12.5px; font-weight: 700;
  }

  .ps-test .psx-result__desc { margin: 0; color: #aebdd4; font-size: 17px; line-height: 1.82; }

  .ps-test .psx-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .ps-test .psx-actions .psx-cta,
  .ps-test .psx-actions .psx-ghost { padding: 0 24px; }
  .ps-test .psx-status { margin: 0; color: #aebdd4; font-size: 14px; }

  .ps-test .psx-disclaimer {
    margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--ps-border);
    color: #8696b0; font-size: 12.5px; line-height: 1.7;
  }

  @media (max-width: 780px) {
    .ps-test .psx-opts { grid-template-columns: 1fr; }
  }
  @media (max-width: 520px) {
    .ps-test { padding-inline: 14px; }
    .ps-test .psx-hero,
    .ps-test .psx-card { border-radius: 20px; }
    .ps-test .psx-actions .psx-cta,
    .ps-test .psx-actions .psx-ghost { flex: 1 1 100%; width: 100%; }
  }
`;
