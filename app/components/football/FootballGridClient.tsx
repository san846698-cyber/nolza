"use client";

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
  gridResult,
  isPlayerKey,
  playerName,
  posLabel,
  styleLabel,
  type FbPlayer,
  type FbStyleKey,
  type FootballSharePayload,
  type FootballTestConfig,
} from "@/lib/football/engine";
import JerseyMark from "@/app/components/football/JerseyMark";
import { useLocale } from "@/hooks/useLocale";

type Phase = "intro" | "quiz" | "result";
type StatsResponse = { enabled: boolean; counts: Record<string, number>; total: number };

// 2축: 포지션 직접 선택(축1) → 스타일 5문항(축2) = 25명.
// 영어는 config.localized 인 테스트(글로벌)만 활성화 — 아니면 한국어 고정(폴백).
export default function FootballGridClient({
  config,
}: {
  config: FootballTestConfig;
}): ReactElement {
  const { locale } = useLocale();
  const en = locale === "en" && Boolean(config.localized);
  const uiLocale: "ko" | "en" = en ? "en" : "ko";
  const t = useCallback((ko: string, enText: string) => (en ? enText : ko), [en]);
  const cfg = useCallback(
    (ko: string, enText: string | undefined) => (en ? enText ?? ko : ko),
    [en],
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [position, setPosition] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picks, setPicks] = useState<FbStyleKey[][]>([]);
  const [sharedKey, setSharedKey] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [statsSeed, setStatsSeed] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const payload = decodeSharePayload<FootballSharePayload>(
      new URLSearchParams(window.location.search).get("s"),
    );
    if (payload?.v === 1 && isPlayerKey(config, payload.resultId)) {
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
  const resultKey = useMemo<string | null>(() => {
    if (sharedKey) return sharedKey;
    if (!position) return null;
    return gridResult(config, position, picks);
  }, [sharedKey, position, picks, config]);
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
    if (phase === "result" && resultKey) trackResultView(config.id, resultKey);
  }, [phase, resultKey, config.id]);

  const startWithPosition = useCallback(
    (pos: string) => {
      trackTestStart(config.id, config.testName);
      setPosition(pos);
      setPhase("quiz");
      setQuestionIndex(0);
      setPicks([]);
      setSharedKey(null);
      setShareStatus("");
      setStatsSeed(null);
      window.history.replaceState(null, "", config.path);
    },
    [config.id, config.testName, config.path],
  );

  const choose = useCallback(
    (styles: FbStyleKey[]) => {
      if (!position) return;
      trackQuestionAnswered(config.id, questionIndex + 1);
      const nextPicks = [...picks, styles];
      setPicks(nextPicks);
      setShareStatus("");
      if (questionIndex >= config.questions.length - 1) {
        const key = gridResult(config, position, nextPicks);
        const payload: FootballSharePayload = en ? { v: 1, resultId: key, lang: "en" } : { v: 1, resultId: key };
        const url = buildShareUrl(config.path, payload);
        window.history.replaceState(null, "", url);
        // 실제 완료 1건만 집계 (공유 링크 조회는 카운트하지 않는다).
        fetch(config.statsEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resultId: key }),
        })
          .then((r) => (r.ok ? (r.json() as Promise<StatsResponse>) : null))
          .then((d) => { if (d) setStatsSeed(d); })
          .catch(() => {});
        setPhase("result");
        return;
      }
      setQuestionIndex((value) => value + 1);
    },
    [picks, questionIndex, position, config, en],
  );

  const restart = useCallback(() => {
    setPhase("intro");
    setPosition(null);
    setQuestionIndex(0);
    setPicks([]);
    setSharedKey(null);
    setShareStatus("");
    setStatsSeed(null);
    window.history.replaceState(null, "", config.path);
  }, [config.path]);

  const share = useCallback(async () => {
    if (!resultKey) return;
    trackShareClick(config.id, "test", resultKey);
    const p = config.players[resultKey];
    const payload: FootballSharePayload = en
      ? { v: 1, resultId: resultKey, lang: "en" }
      : { v: 1, resultId: resultKey };
    const url = buildShareUrl(config.path, payload);
    const name = playerName(p, en);
    const pos = posLabel(config, p.pos, en);
    const style = styleLabel(config, p.style, en);
    const title = en ? "Which footballer are you?" : `${config.testName} 결과`;
    const body = en
      ? `I got ${name} (${pos} · ${style}) in the World Footballer Test! Who are you? 👉 ${url}`
      : `나랑 닮은 축구선수는 [${name}]! (${pos} · ${style}) 너도 해봐 👉 ${url}`;
    const opened = t("공유 창을 열었습니다.", "Share dialog opened.");
    const copied = t("결과 링크를 복사했습니다.", "Result link copied.");
    const failed = t(
      "링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.",
      "Couldn't copy the link — please copy it from the address bar.",
    );
    try {
      if (navigator.share) {
        await navigator.share({ title, text: body });
        setShareStatus(opened);
        return;
      }
      await navigator.clipboard.writeText(body);
      setShareStatus(copied);
    } catch {
      try {
        await navigator.clipboard.writeText(body);
        setShareStatus(copied);
      } catch {
        setShareStatus(failed);
      }
    }
  }, [resultKey, config, en, t]);

  const rootStyle = {
    "--ps-accent": config.accent,
    "--ps-accent-ink": config.accentInk,
  } as CSSProperties;

  const result = resultKey ? config.players[resultKey] : null;

  return (
    <main className="fb-test" style={rootStyle}>
      <section className="fb-shell">
        <nav className="fb-back">
          <Link href="/">{homeBackLabel(uiLocale)}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="fb-hero">
            <div className="fb-hero-copy">
              <span className="fb-pill">{config.eyebrowPill}</span>
              <h1 className="fb-title">
                <span className="fb-title__top">{cfg(config.introTitleTop, config.introTitleTopEn)}</span>
              </h1>
              <p className="fb-sub">{cfg(config.introSub, config.introSubEn)}</p>
              <p className="fb-desc">{cfg(config.introDesc, config.introDescEn)}</p>
              <div className="fb-chips" aria-label={t("테스트 정보", "Test info")}>
                <span>{t("포지션 + 5문항", "Position + 5 questions")}</span>
                <span>{t("약 1분", "~1 min")}</span>
                <span>{t("25인 중 한 명", "1 of 25")}</span>
              </div>
              <p className="fb-poslabel">{t("너의 주 포지션은?", "What's your main position?")}</p>
              <div className="fb-pos">
                {config.positions.map((p) => (
                  <button key={p.key} type="button" className="fb-pos__btn" onClick={() => startWithPosition(p.key)}>
                    {en ? p.en ?? p.ko : p.ko}
                  </button>
                ))}
              </div>
              <p className="fb-notice">{cfg(config.notice, config.noticeEn)}</p>
            </div>
          </section>
        ) : (
          <section className="fb-card">
            <div className="fb-prog">
              <span>
                {phase === "result"
                  ? t("결과", "Result")
                  : `${posLabel(config, position as string, en)} · ${t("질문", "Question")}`}
              </span>
              <strong>
                {phase === "result"
                  ? `${config.questions.length}/${config.questions.length}`
                  : `Q${questionIndex + 1}/${config.questions.length}`}
              </strong>
            </div>
            <div className="fb-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>

            {phase === "quiz" ? (
              <>
                <h2 className="fb-q">{en ? currentQuestion.qEn ?? currentQuestion.q : currentQuestion.q}</h2>
                <div className="fb-opts">
                  {currentQuestion.answers.map((answer, index) => (
                    <button key={index} type="button" className="fb-opt" onClick={() => choose(answer.styles)}>
                      <span className="fb-opt__badge">{String.fromCharCode(65 + index)}</span>
                      <strong>{en ? answer.labelEn ?? answer.label : answer.label}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : result ? (
              <ResultView
                config={config}
                player={result}
                resultKey={resultKey as string}
                shared={Boolean(sharedKey)}
                en={en}
                onRetry={restart}
                onShare={share}
                shareStatus={shareStatus}
                statsSeed={statsSeed}
              />
            ) : null}
          </section>
        )}

        <footer className="fb-disclaimer">{cfg(config.notice, config.noticeEn)}</footer>
      </section>

      {phase === "result" && (
        <div className="result-screen--dark">
          <AdResult placement={`${config.id}-result`} />
          <RecommendedGames
            currentId={config.id}
            ids={config.recommendIds}
            title={{ ko: "다음에 해볼 테스트", en: "Try These Next" }}
            locale={uiLocale}
          />
        </div>
      )}

      <style jsx global>{styles}</style>
    </main>
  );
}

function ResultView({
  config,
  player,
  resultKey,
  shared,
  en,
  onRetry,
  onShare,
  shareStatus,
  statsSeed,
}: {
  config: FootballTestConfig;
  player: FbPlayer;
  resultKey: string;
  shared: boolean;
  en: boolean;
  onRetry: () => void;
  onShare: () => void;
  shareStatus: string;
  statsSeed: StatsResponse | null;
}): ReactElement {
  const name = playerName(player, en);
  const tags = en ? player.tagsEn ?? player.tags : player.tags;
  return (
    <section className="fb-result">
      {shared ? <span className="fb-shared">{en ? "Shared result" : "공유된 결과"}</span> : null}
      <p className="fb-result__eyebrow">{en ? "You play like" : "나랑 닮은 축구선수"}</p>

      <div className="fb-poster">
        <div className="fb-poster__media">
          <JerseyMark flag={player.flag} jersey={player.jersey} name={name} isGk={player.pos === "gk"} />
        </div>
        <div className="fb-poster__veil" aria-hidden />
        <div className="fb-poster__body">
          <span className="fb-poster__kicker">
            {posLabel(config, player.pos, en)} · {styleLabel(config, player.style, en)}
          </span>
          <h2 className="fb-poster__name">{name}</h2>
          <div className="fb-poster__tags" aria-label={en ? "Playstyle tags" : "성향 태그"}>
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="fb-result__desc">{en ? player.descEn ?? player.desc : player.desc}</p>

      <StatsRanking config={config} resultKey={resultKey} en={en} seed={statsSeed} />

      <div className="fb-actions">
        <button type="button" className="fb-cta" onClick={onShare}>
          {en ? "Share with friends" : "친구에게 공유하기"}
        </button>
        <button
          type="button"
          className="fb-ghost"
          onClick={() => {
            trackRetryClick(config.id, "test");
            onRetry();
          }}
        >
          {shared ? (en ? "Try it too" : "나도 해보기") : en ? "Retry" : "다시 하기"}
        </button>
        <p className="fb-status" role="status" aria-live="polite">{shareStatus}</p>
      </div>
    </section>
  );
}

// 월드컵 랭킹 — 실제 누적 집계만 노출. 데이터 없거나 KV 미설정 시 "집계 중" 폴백(가짜 수치 없음).
function StatsRanking({
  config,
  resultKey,
  en,
  seed,
}: {
  config: FootballTestConfig;
  resultKey: string;
  en: boolean;
  seed: StatsResponse | null;
}): ReactElement {
  const [fetched, setFetched] = useState<StatsResponse | null>(null);
  const data = seed ?? fetched;

  useEffect(() => {
    if (seed) return;
    let alive = true;
    fetch(config.statsEndpoint)
      .then((r) => (r.ok ? (r.json() as Promise<StatsResponse>) : null))
      .then((d) => { if (alive && d) setFetched(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, [seed, config.statsEndpoint]);

  if (!data || !data.enabled || data.total <= 0) {
    return (
      <div className="fb-rank fb-rank--empty">
        {en
          ? "Live ranking coming soon — you're one of the first to play!"
          : "월드컵 랭킹은 곧 집계됩니다. 첫 주자가 되어보세요!"}
      </div>
    );
  }

  const total = data.total;
  const rows = Object.keys(config.players)
    .map((k) => ({ k, n: data.counts[k] ?? 0 }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 8);

  return (
    <div className="fb-rank">
      <div className="fb-rank__head">
        <span className="fb-rank__title">🏆 {en ? "Most common result" : "가장 많이 나온 선수"}</span>
        <strong className="fb-rank__total">
          {en ? `${total.toLocaleString()} played` : `${total.toLocaleString()}명 참여`}
        </strong>
      </div>
      <ol className="fb-rank__list">
        {rows.map((row, i) => {
          const p = config.players[row.k];
          const pct = total > 0 ? Math.round((row.n / total) * 100) : 0;
          const me = row.k === resultKey;
          return (
            <li key={row.k} className={me ? "is-me" : undefined}>
              <span className="fb-rank__pos">{i + 1}</span>
              <div className="fb-rank__body">
                <div className="fb-rank__top">
                  <span className="fb-rank__name">
                    {playerName(p, en)}
                    <em className="fb-rank__sub"> · {posLabel(config, p.pos, en)}</em>
                    {me ? <em className="fb-rank__me"> · {en ? "You" : "내 결과"}</em> : null}
                  </span>
                  <span className="fb-rank__pct">{pct}%</span>
                </div>
                <div className="fb-rank__bar" aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const styles = `
  .fb-test {
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
  .fb-test * { font-family: var(--ps-font); }

  .fb-test .fb-shell { width: min(100%, 1040px); margin: 0 auto 34px; padding-top: clamp(10px, 2.5vh, 28px); }
  .fb-test .fb-back { margin-bottom: 18px; font-size: 14px; }
  .fb-test .fb-back a { display: inline-flex; align-items: center; min-height: 44px; color: rgba(190,205,228,0.78); text-decoration: none; }
  .fb-test .fb-back a:hover { color: #eef3fb; }

  .fb-test .fb-hero,
  .fb-test .fb-card {
    border: 1px solid var(--ps-border); border-radius: 24px; background: var(--ps-card-bg);
    box-shadow: 0 30px 80px rgba(2, 6, 18, 0.55);
  }
  .fb-test .fb-hero { display: block; width: min(100%, 840px); margin: 0 auto; padding: clamp(28px, 5vw, 60px); overflow: hidden; }
  .fb-test .fb-hero-copy { width: min(100%, 760px); }

  .fb-test .fb-pill {
    display: inline-block; border: 1px solid var(--ps-accent); border-radius: 999px; padding: 7px 16px;
    color: var(--ps-accent); font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
  }
  .fb-test .fb-title { margin: 22px 0 0; line-height: 1.12; letter-spacing: -0.01em; font-weight: 800; font-size: clamp(30px, 6.4vw, 52px); }
  .fb-test .fb-title__top { display: block; color: #f3f7ff; }
  .fb-test .fb-sub { margin: 18px 0 0; color: var(--ps-cyan); font-size: clamp(17px, 2.4vw, 22px); font-weight: 800; letter-spacing: -0.01em; }
  .fb-test .fb-desc { margin: 14px 0 24px; max-width: 640px; color: #9fb0c8; font-size: 16px; line-height: 1.72; }

  .fb-test .fb-chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 26px; }
  .fb-test .fb-chips span {
    border: 1px solid var(--ps-border); border-radius: 999px; background: rgba(140,170,215,0.06);
    color: #c3d2e6; padding: 8px 15px; font-size: 13px; font-weight: 700;
  }

  .fb-test .fb-poslabel { margin: 0 0 12px; color: var(--ps-accent); font-size: 14px; font-weight: 800; letter-spacing: 0.04em; }
  .fb-test .fb-pos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .fb-test .fb-pos__btn {
    min-height: 64px; border: 1px solid var(--ps-border); border-radius: 16px;
    background: rgba(140,170,215,0.06); color: #eef3fb; cursor: pointer;
    font-size: 17px; font-weight: 800; padding: 8px;
    transition: transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
  .fb-test .fb-pos__btn:hover {
    transform: translateY(-2px); border-color: var(--ps-accent); background: rgba(140,170,215,0.12);
    box-shadow: 0 14px 28px rgba(2, 6, 18, 0.4);
  }

  .fb-test .fb-notice { margin: 18px 0 0; max-width: 640px; color: #8696b0; font-size: 13px; line-height: 1.6; }

  .fb-test .fb-card { margin-top: clamp(12px, 3vh, 28px); padding: clamp(24px, 4vw, 44px); }
  .fb-test .fb-prog { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
  .fb-test .fb-prog span { color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.08em; }
  .fb-test .fb-prog strong { color: #9fb4d4; font-size: 15px; font-weight: 700; }
  .fb-test .fb-bar { height: 9px; overflow: hidden; border-radius: 999px; background: rgba(140,170,215,0.14); }
  .fb-test .fb-bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--ps-cyan), var(--ps-accent)); transition: width 220ms ease; }

  .fb-test .fb-q { margin: 26px 0 22px; color: #f3f7ff; font-weight: 800; line-height: 1.3; letter-spacing: -0.01em; font-size: clamp(22px, 3.6vw, 32px); }

  .fb-test .fb-opts { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .fb-test .fb-opt {
    display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center;
    border: 1px solid var(--ps-border); border-radius: 16px; background: rgba(140,170,215,0.05);
    color: #e9f0fa; cursor: pointer; padding: 16px 18px; text-align: left;
    transition: transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
  .fb-test .fb-opt__badge { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 11px; background: var(--ps-accent); color: var(--ps-accent-ink); font-size: 14px; font-weight: 900; }
  .fb-test .fb-opt strong { font-size: 16px; line-height: 1.45; font-weight: 600; }
  .fb-test .fb-opt:hover { transform: translateY(-2px); border-color: var(--ps-accent); background: rgba(140,170,215,0.10); box-shadow: 0 16px 30px rgba(2, 6, 18, 0.4); }

  .fb-test .fb-result { display: grid; gap: 20px; }
  .fb-test .fb-shared { width: max-content; border: 1px solid var(--ps-accent); border-radius: 999px; background: rgba(255,255,255,0.04); color: var(--ps-accent); padding: 7px 14px; font-size: 13px; font-weight: 800; }
  .fb-test .fb-result__eyebrow { margin: 0; color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }

  .fb-test .fb-poster {
    position: relative; width: 100%; max-width: 440px; margin: 0 auto; aspect-ratio: 4 / 5; overflow: hidden;
    border-radius: 22px; border: 1px solid var(--ps-accent); box-shadow: 0 26px 64px rgba(2, 6, 18, 0.62); background: #0d1830;
  }
  .fb-test .fb-poster__media {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(circle at 50% 40%, rgba(255,255,255,0.05), transparent 64%), #0d1830;
  }
  .fb-test .fb-jersey { width: clamp(200px, 56%, 270px); height: auto; margin-top: -8%; filter: drop-shadow(0 18px 36px rgba(0,0,0,0.55)); }
  .fb-test .fb-jersey text { font-family: var(--ps-font); font-variant-numeric: tabular-nums; }

  .fb-test .fb-poster__veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,10,20,0) 0%, rgba(5,10,20,0.10) 40%, rgba(5,10,20,0.82) 76%, rgba(5,10,20,0.97) 100%); }
  .fb-test .fb-poster__body { position: absolute; left: 0; right: 0; bottom: 0; display: grid; gap: 8px; padding: clamp(18px, 4vw, 28px); }
  .fb-test .fb-poster__kicker { color: var(--ps-accent); font-size: 13px; font-weight: 800; letter-spacing: 0.02em; }
  .fb-test .fb-poster__name { margin: 0; color: #fff; font-weight: 800; font-size: clamp(34px, 9vw, 54px); line-height: 1.05; letter-spacing: -0.01em; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55); }
  .fb-test .fb-poster__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .fb-test .fb-poster__tags span { border: 1px solid rgba(255,255,255,0.26); border-radius: 999px; background: rgba(8, 14, 28, 0.5); color: #eaf2ff; padding: 6px 11px; font-size: 12.5px; font-weight: 700; }

  .fb-test .fb-result__desc { margin: 0; color: #aebdd4; font-size: 17px; line-height: 1.82; }

  .fb-test .fb-rank { border: 1px solid var(--ps-border); border-radius: 18px; background: rgba(140,170,215,0.05); padding: 18px clamp(16px, 3vw, 22px); }
  .fb-test .fb-rank--empty { color: #9fb0c8; font-size: 14.5px; line-height: 1.6; text-align: center; }
  .fb-test .fb-rank__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .fb-test .fb-rank__title { color: #f3f7ff; font-size: 16px; font-weight: 900; }
  .fb-test .fb-rank__total { color: var(--ps-accent); font-size: 13px; font-weight: 800; }
  .fb-test .fb-rank__list { display: grid; gap: 11px; margin: 0; padding: 0; list-style: none; }
  .fb-test .fb-rank__list li { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
  .fb-test .fb-rank__pos { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: rgba(140,170,215,0.12); color: #c3d2e6; font-size: 13px; font-weight: 900; }
  .fb-test .fb-rank__list li.is-me .fb-rank__pos { background: var(--ps-accent); color: var(--ps-accent-ink); }
  .fb-test .fb-rank__body { display: grid; gap: 6px; min-width: 0; }
  .fb-test .fb-rank__top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .fb-test .fb-rank__name { color: #dde7f5; font-size: 14.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fb-test .fb-rank__sub { color: #8aa0bf; font-style: normal; font-weight: 600; font-size: 12.5px; }
  .fb-test .fb-rank__me { color: var(--ps-accent); font-style: normal; font-weight: 800; }
  .fb-test .fb-rank__list li.is-me .fb-rank__name { color: #fff; font-weight: 800; }
  .fb-test .fb-rank__pct { color: #9fb4d4; font-size: 13.5px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .fb-test .fb-rank__bar { height: 8px; overflow: hidden; border-radius: 999px; background: rgba(140,170,215,0.12); }
  .fb-test .fb-rank__bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--ps-cyan), var(--ps-accent)); transition: width 320ms ease; }
  .fb-test .fb-rank__list li.is-me .fb-rank__bar span { background: var(--ps-accent); }

  .fb-test .fb-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .fb-test .fb-cta, .fb-test .fb-ghost {
    border: 0; cursor: pointer; min-height: 52px; border-radius: 16px; padding: 0 24px; font-size: 16px; font-weight: 800;
    transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease, background 160ms ease;
  }
  .fb-test .fb-cta { color: var(--ps-accent-ink); background-color: var(--ps-accent); background-image: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.06)); box-shadow: 0 16px 34px rgba(2, 6, 18, 0.45); }
  .fb-test .fb-cta:hover { transform: translateY(-2px); filter: brightness(1.07); box-shadow: 0 20px 42px rgba(2, 6, 18, 0.5); }
  .fb-test .fb-ghost { color: #e4ecf8; background: rgba(140,170,215,0.10); border: 1px solid var(--ps-border); }
  .fb-test .fb-ghost:hover { transform: translateY(-2px); background: rgba(140,170,215,0.16); }
  .fb-test .fb-status { margin: 0; color: #aebdd4; font-size: 14px; }

  .fb-test .fb-disclaimer { margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--ps-border); color: #8696b0; font-size: 12.5px; line-height: 1.7; }

  @media (max-width: 520px) {
    .fb-test { padding-inline: 14px; }
    .fb-test .fb-hero, .fb-test .fb-card { border-radius: 20px; }
    .fb-test .fb-actions .fb-cta, .fb-test .fb-actions .fb-ghost { flex: 1 1 100%; width: 100%; }
  }
`;
