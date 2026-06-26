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
import { homeBackLabel } from "@/app/components/BrandMark";
import CharImage from "@/app/components/game/CharImage";
import ReadableQuestion from "@/app/components/game/ReadableQuestion";
import ResultScreen from "@/app/components/game/ResultScreen";
import { QuestionTransition } from "@/app/components/motion/Motion";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import {
  trackQuestionAnswered,
  trackResultView,
  trackTestStart,
} from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  calculateAnimeResult,
  getAnimeResult,
  resultImageSrc,
  statsEndpoint,
  type AnimeAnswer,
  type AnimeChoice,
  type AnimeResult,
  type AnimeSharePayload,
  type AnimeTestConfig,
  type LocalText,
} from "@/lib/anime-test";

type Phase = "intro" | "quiz" | "result";

// 떠오르는 입자(물의 호흡/불티) — 결정적 값으로 SSR 하이드레이션 안전.
const EMBERS = [
  { left: "5%", dur: "10s", delay: "0s" },
  { left: "14%", dur: "13s", delay: "2.4s" },
  { left: "23%", dur: "9s", delay: "4.1s" },
  { left: "33%", dur: "12s", delay: "1.2s" },
  { left: "42%", dur: "11s", delay: "5.6s" },
  { left: "51%", dur: "14s", delay: "3.3s" },
  { left: "60%", dur: "10s", delay: "6.8s" },
  { left: "69%", dur: "12s", delay: "0.7s" },
  { left: "78%", dur: "9s", delay: "4.9s" },
  { left: "86%", dur: "13s", delay: "2.0s" },
  { left: "93%", dur: "11s", delay: "7.4s" },
  { left: "38%", dur: "15s", delay: "8.5s" },
];

// 귀멸 — 캐릭터별 전통 일본 무늬(공용 패턴, 저작권 X). 다른 테스트는 무늬 없음.
const DEMON_SLAYER_PATTERNS: Record<string, string> = {
  tanjiro: "ichimatsu",
  nezuko: "asanoha",
  zenitsu: "uroko",
  inosuke: "yagasuri",
  rengoku: "flame",
  shinobu: "kikkou",
  giyu: "seigaiha",
  mitsuri: "komon",
  muichiro: "seigaiha",
  tengen: "yagasuri",
  akaza: "flame",
  douma: "komon",
  kokushibo: "yagasuri",
  sanemi: "yagasuri",
  obanai: "uroko",
  gyomei: "kikkou",
  genya: "komon",
  yoriichi: "flame",
  muzan: "uroko",
};

// 일본 애니 캐릭터 테스트 공용 클라이언트 — config 만 갈아끼우면 3개 테스트가 동일 플로우로 동작.
// intro → quiz(QuestionTransition) → result(ResultScreen). 결과 리빌은 ResultScreen 기본값.
export default function AnimeTestClient({ config }: { config: AnimeTestConfig }): ReactElement {
  const { locale } = useLocale();
  const tx = useCallback((c: LocalText) => (locale === "ko" ? c.ko : c.en), [locale]);
  const t = useCallback((ko: string, en: string) => (locale === "ko" ? ko : en), [locale]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnimeAnswer[]>([]);
  const [sharedKey, setSharedKey] = useState<string | null>(null);
  const [fxKey, setFxKey] = useState(0); // 슬래시 이펙트 트리거 (값 바뀌면 재생)

  useEffect(() => {
    const payload = decodeSharePayload<AnimeSharePayload>(
      new URLSearchParams(window.location.search).get("s"),
    );
    const restored = payload && payload.v === 1 ? getAnimeResult(config, payload.resultId) : null;
    if (restored) {
      const id = window.setTimeout(() => {
        setSharedKey(restored.key);
        setPhase("result");
        setQuestionIndex(config.questions.length - 1);
        setAnswers([]);
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [config]);

  const currentQuestion = config.questions[questionIndex];
  const result = useMemo<AnimeResult>(() => {
    const shared = sharedKey ? getAnimeResult(config, sharedKey) : null;
    return shared ?? calculateAnimeResult(config, answers);
  }, [answers, sharedKey, config]);
  const progress = phase === "result" ? 100 : ((questionIndex + 1) / config.questions.length) * 100;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, questionIndex]);

  useEffect(() => {
    if (phase === "result") trackResultView(config.testId, result.key);
  }, [phase, result.key, config.testId]);

  const start = useCallback(() => {
    trackTestStart(config.testId, config.title.en);
    setPhase("quiz");
    setQuestionIndex(0);
    setAnswers([]);
    setSharedKey(null);
    setFxKey((k) => k + 1);
    window.history.replaceState(null, "", config.path);
  }, [config]);

  const choose = useCallback(
    (choice: AnimeChoice) => {
      trackQuestionAnswered(config.testId, questionIndex + 1);
      const next = [
        ...answers,
        {
          questionId: currentQuestion.id,
          choiceId: choice.id,
          weights: choice.weights,
          hiddenWeight: choice.hiddenWeight,
          hiddenWeights: choice.hiddenWeights,
        },
      ];
      setAnswers(next);
      setFxKey((k) => k + 1);
      if (questionIndex >= config.questions.length - 1) {
        const r = calculateAnimeResult(config, next);
        const url = buildShareUrl(config.path, {
          v: 1,
          resultId: r.key,
          locale,
        } satisfies AnimeSharePayload);
        window.history.replaceState(null, "", url);
        setPhase("result");
        return;
      }
      setQuestionIndex((v) => v + 1);
    },
    [answers, currentQuestion, questionIndex, config, locale],
  );

  const shareUrl = useMemo(
    () =>
      buildShareUrl(config.path, {
        v: 1,
        resultId: result.key,
        locale,
      } satisfies AnimeSharePayload),
    [config.path, result.key, locale],
  );

  const rootStyle = {
    "--accent": config.accent,
    // 분위기 씬 배경 슬롯 — /images/tests/<testId>/bg.webp 떨구면 자동 적용(없으면 안 보임, graceful).
    "--scene": `url(/images/tests/${config.testId}/bg.webp)`,
  } as CSSProperties;
  const details = [
    tx(result.oneLiner),
    `${t("강점", "Strength")} · ${tx(result.strength)}`,
    `${t("주의할 점", "Watch out")} · ${tx(result.weakPoint)}`,
  ];

  return (
    <main className="anime-test" data-test={config.testId} style={rootStyle} lang={locale}>
      <div className="anime-embers" aria-hidden>
        {EMBERS.map((e, i) => (
          <span key={i} style={{ left: e.left, animationDuration: e.dur, animationDelay: e.delay }} />
        ))}
      </div>
      <div key={fxKey} className="anime-slash" aria-hidden />
      {phase === "result" && (
        <div
          key={`burst-${result.key}`}
          className="anime-burst"
          style={{ "--burst": result.color } as CSSProperties}
          aria-hidden
        />
      )}
      <section className="anime-shell">
        <nav className="anime-back">
          <Link href="/">{homeBackLabel(locale)}</Link>
        </nav>

        {phase === "intro" ? (
          <section className="anime-hero">
            <span className="anime-eyebrow">{tx(config.eyebrow)}</span>
            <h1 className="anime-title">{tx(config.title)}</h1>
            <p className="anime-sub">{tx(config.subtitle)}</p>
            <p className="anime-desc">{tx(config.description)}</p>
            <div className="anime-chips" aria-label={t("테스트 정보", "Test info")}>
              <span>{t(`${config.questions.length}문항`, `${config.questions.length} questions`)}</span>
              <span>{t("약 3분", "~3 min")}</span>
              <span>{t(`캐릭터 ${config.results.length}종`, `${config.results.length} characters`)}</span>
            </div>
            <button type="button" className="anime-cta" onClick={start}>
              {t("테스트 시작하기", "Start the test")}
            </button>
            <p className="anime-notice">
              {t(
                "비공식 팬 콘텐츠로 만든 재미용 테스트입니다. 언급된 작품·캐릭터의 권리는 각 권리자에게 있으며, 본 테스트는 어떤 보증·후원 관계도 없습니다.",
                "An unofficial, for-fun fan quiz. All rights to the referenced works and characters belong to their owners; this test is not endorsed by or affiliated with them.",
              )}
            </p>
          </section>
        ) : phase === "quiz" && currentQuestion ? (
          <section className="anime-card">
            <div className="anime-prog">
              <span>{t("질문", "Question")}</span>
              <strong>
                {questionIndex + 1}/{config.questions.length}
              </strong>
            </div>
            <div className="anime-bar" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>
            <QuestionTransition motionKey={questionIndex}>
              <ReadableQuestion prompt={tx(currentQuestion.prompt)} locale={locale} />
              <div className="anime-answers">
                {currentQuestion.choices.map((choice) => (
                  <button key={choice.id} type="button" className="anime-answer" onClick={() => choose(choice)}>
                    <span>{choice.id.toUpperCase()}</span>
                    <strong>{tx(choice.text)}</strong>
                  </button>
                ))}
              </div>
            </QuestionTransition>
          </section>
        ) : (
          <ResultScreen
            locale={locale}
            currentGameId={config.testId}
            eyebrow={tx(config.eyebrow)}
            gameName={tx(config.gameName)}
            emoji={result.emoji}
            title={tx(result.name)}
            description={tx(result.description)}
            details={details}
            tone={config.tone}
            accentColor={result.color}
            shareTitle={tx(config.title)}
            shareText={`${tx(result.shareLine)} ${t("너는?", "What about you?")}`}
            shareUrl={shareUrl}
            onReplay={start}
            replayLabel={sharedKey ? t("나도 해보기", "Try it myself") : t("다시 하기", "Retry")}
            recommendedIds={config.recommendedIds}
            heroMedia={
              <CharImage
                src={resultImageSrc(config.testId, result.key)}
                alt={tx(result.name)}
                emoji={result.emoji}
                color={result.color}
                pattern={config.testId === "demon-slayer" ? DEMON_SLAYER_PATTERNS[result.key] : undefined}
              />
            }
            afterCard={
              <ParticipantCount
                testId={config.testId}
                resultKey={result.key}
                counted={!sharedKey}
                locale={locale}
              />
            }
          />
        )}
      </section>

      <style jsx>{`
        .anime-test {
          --ink: #f7f8f8;
          --ink-2: #d0d6e0;
          --ink-3: #8a8f98;
          --ink-4: #62666d;
          --border: rgba(255, 255, 255, 0.08);
          --border-subtle: rgba(255, 255, 255, 0.05);
          --surface-1: rgba(255, 255, 255, 0.02);
          --surface-2: rgba(255, 255, 255, 0.05);
          position: relative;
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: hidden;
          overflow-y: auto;
          color: var(--ink);
          color-scheme: dark;
          background-color: #08090a;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
            radial-gradient(48% 36% at 50% -8%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 62%),
            linear-gradient(180deg, rgba(9, 10, 12, 0.72) 0%, rgba(7, 8, 9, 0.78) 55%, rgba(5, 6, 7, 0.9) 100%),
            var(--scene, none);
          background-repeat: repeat, no-repeat, no-repeat, no-repeat;
          background-size: 130px 130px, auto, auto, cover;
          background-position: 0 0, center, center, center;
          background-blend-mode: soft-light, normal, normal, normal;
          padding: 24px clamp(16px, 4vw, 44px) 56px;
          font-family: var(--font-noto-sans-kr), "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
          font-feature-settings: "cv01", "ss03";
        }
        /* 테마 모티프 — 전통 일본/작품 상징 무늬(저작권 X). 가장자리·상단에 텍스처, 중앙은 페이드 */
        .anime-test::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-repeat: repeat;
          -webkit-mask-image: radial-gradient(145% 110% at 50% -2%, #000 22%, transparent 82%);
          mask-image: radial-gradient(145% 110% at 50% -2%, #000 22%, transparent 82%);
        }
        /* 귀멸 — 무한성 배경 이미지(bg.webp)를 쓰므로 이치마츠 무늬 오버레이는 제거 */
        .anime-test[data-test="demon-slayer"]::before {
          background-image: none;
        }
        /* 주술회전·체인소맨 — bg.webp 배경 이미지를 쓰므로 무늬 오버레이 제거 */
        .anime-test[data-test="jujutsu-kaisen"]::before,
        .anime-test[data-test="chainsaw-man"]::before {
          background-image: none;
        }
        /* 사이버펑크 — 미세한 네온 스캔라인으로 디지털 질감 */
        .anime-test[data-test="cyberpunk"]::before {
          background-image: repeating-linear-gradient(
            0deg,
            color-mix(in srgb, var(--accent) 6%, transparent) 0px,
            color-mix(in srgb, var(--accent) 6%, transparent) 1px,
            transparent 1px,
            transparent 3px
          );
        }
        .anime-shell {
          position: relative;
          z-index: 1;
          width: min(100%, 1040px);
          margin: 0 auto 34px;
          padding-top: clamp(10px, 2.5vh, 28px);
        }
        .anime-back {
          margin-bottom: 18px;
          font-size: 14px;
        }
        .anime-back :global(a) {
          color: rgba(243, 238, 251, 0.78);
          text-decoration: none;
        }
        .anime-back :global(a:hover) {
          color: #fff;
        }
        .anime-hero,
        .anime-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(10, 12, 14, 0.62);
          backdrop-filter: blur(16px) saturate(1.05);
          -webkit-backdrop-filter: blur(14px) saturate(1.05);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 20px 50px -30px rgba(0, 0, 0, 0.85);
        }
        .anime-hero {
          width: min(100%, 820px);
          margin: 0 auto;
          padding: clamp(28px, 5vw, 60px);
          background:
            radial-gradient(62% 48% at 16% 2%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
            rgba(10, 12, 14, 0.62);
        }
        .anime-eyebrow {
          display: inline-block;
          border: 1px solid var(--accent);
          border-radius: 999px;
          padding: 7px 16px;
          color: var(--accent);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }
        .anime-title {
          margin: 20px 0 0;
          font-size: clamp(34px, 6.4vw, 56px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--ink);
        }
        .anime-sub {
          margin: 18px 0 0;
          color: var(--accent);
          font-size: clamp(16px, 2.3vw, 21px);
          font-weight: 800;
        }
        .anime-desc {
          margin: 14px 0 26px;
          max-width: 620px;
          color: var(--ink-3);
          font-size: 16px;
          line-height: 1.7;
        }
        .anime-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 0 0 26px;
        }
        .anime-chips span {
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surface-1);
          color: var(--ink-2);
          padding: 8px 15px;
          font-size: 13px;
          font-weight: 600;
        }
        .anime-cta {
          display: block;
          width: 100%;
          border: 0;
          cursor: pointer;
          min-height: 52px;
          border-radius: 8px;
          padding: 0 26px;
          font-size: 16px;
          font-weight: 700;
          color: #08090a;
          background: var(--accent);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2) inset,
            0 10px 30px -10px color-mix(in srgb, var(--accent) 55%, transparent);
          transition: filter 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }
        .anime-cta:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
        }
        .anime-notice {
          margin: 18px 0 0;
          max-width: 620px;
          color: var(--ink-4);
          font-size: 13px;
          line-height: 1.6;
        }
        .anime-card {
          margin-top: clamp(12px, 3vh, 28px);
          padding: clamp(24px, 4vw, 44px);
        }
        .anime-prog {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }
        .anime-prog span {
          color: var(--accent);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .anime-prog strong {
          color: var(--ink-3);
          font-size: 15px;
        }
        .anime-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
        }
        .anime-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 55%, #ffffff), var(--accent));
          transition: width 240ms ease;
        }
        .anime-answers {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 22px;
        }
        .anime-answer {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(10, 12, 14, 0.32);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #f0f1f3;
          cursor: pointer;
          padding: 17px 18px;
          text-align: left;
          transition: border-color 150ms ease, background 150ms ease, color 150ms ease;
        }
        .anime-answer span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 7px;
          background: var(--accent);
          color: #0c0a14;
          font-size: 14px;
          font-weight: 900;
        }
        .anime-answer strong {
          font-size: 16px;
          line-height: 1.5;
          font-weight: 600;
          word-break: keep-all;
        }
        .anime-answer:hover {
          border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
          background: var(--surface-2);
          color: var(--ink);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent),
            0 8px 24px -16px color-mix(in srgb, var(--accent) 60%, transparent);
        }
        /* ReadableQuestion — dark-theme fix (anime tests were missing this override) */
        .anime-card :global(.readable-question) {
          gap: 14px !important;
          margin: 14px 0 22px !important;
        }
        .anime-card :global(.readable-question__situation) {
          margin: 0 !important;
          padding: 3px 0 5px 18px !important;
          border: 0 !important;
          border-left: 3px solid var(--accent) !important;
          border-radius: 0 !important;
          background: transparent !important;
        }
        .anime-card :global(.readable-question__situation::after) {
          display: none !important;
        }
        .anime-card :global(.readable-question__situation span) {
          color: var(--accent) !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: 0.14em !important;
          text-transform: uppercase !important;
        }
        .anime-card :global(.readable-question__situation p) {
          color: var(--ink-2) !important;
          font-style: normal !important;
        }
        .anime-card :global(.readable-question__prompt span) {
          display: none !important;
        }
        .anime-card :global(.readable-question__prompt h2) {
          color: var(--ink) !important;
          font-family: var(--font-noto-sans-kr), "Inter", system-ui, sans-serif !important;
          font-size: clamp(24px, 3.4vw, 33px) !important;
          font-weight: 700 !important;
          letter-spacing: -0.022em !important;
          line-height: 1.28 !important;
        }
        /* 귀멸 — 전통 느낌 세리프 헤드라인 */
        .anime-test[data-test="demon-slayer"] .anime-title {
          font-family: var(--font-noto-serif-kr), serif !important;
        }
        .anime-test[data-test="demon-slayer"] :global(.readable-question__prompt h2) {
          font-family: var(--font-noto-serif-kr), serif !important;
        }
        .anime-embers {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .anime-embers span {
          position: absolute;
          bottom: -10px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px 1px color-mix(in srgb, var(--accent) 65%, transparent);
          opacity: 0;
          animation-name: ember-rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes ember-rise {
          0% {
            transform: translateY(0) scale(0.7);
            opacity: 0;
          }
          12% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-104vh) scale(1.1);
            opacity: 0;
          }
        }
        .anime-slash {
          position: fixed;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 43%,
            color-mix(in srgb, var(--accent) 80%, #ffffff) 50%,
            transparent 57%
          );
          background-size: 260% 100%;
          opacity: 0;
          animation: anime-slash-sweep 340ms cubic-bezier(0.22, 1, 0.36, 1) 1;
        }
        @keyframes anime-slash-sweep {
          0% {
            background-position: 128% 0;
            opacity: 0;
          }
          35% {
            opacity: 0.9;
          }
          100% {
            background-position: -38% 0;
            opacity: 0;
          }
        }
        .anime-burst {
          position: fixed;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          mix-blend-mode: screen;
          transform-origin: 50% 40%;
          background: radial-gradient(
            circle at 50% 40%,
            color-mix(in srgb, var(--burst) 85%, #ffffff) 0%,
            var(--burst) 16%,
            color-mix(in srgb, var(--burst) 45%, transparent) 36%,
            transparent 62%
          );
          opacity: 0;
          animation: anime-burst-pulse 1150ms cubic-bezier(0.18, 0.9, 0.3, 1) 1;
        }
        @keyframes anime-burst-pulse {
          0% {
            transform: scale(0.35);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          55% {
            opacity: 0.45;
          }
          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }
        /* ── 작품별 이펙트 테마 (입자 모션·질감 + 슬래시) ── */
        /* 주술회전: 보라 주력이 흔들리며 떠오름 (현행보다 크고 글로우 강하게) */
        .anime-test[data-test="jujutsu-kaisen"] .anime-embers span {
          width: 5px;
          height: 5px;
          box-shadow: 0 0 13px 2px color-mix(in srgb, var(--accent) 70%, transparent);
          animation-name: cursed-float;
        }
        @keyframes cursed-float {
          0% {
            transform: translate(0, 0) scale(0.55);
            opacity: 0;
          }
          15% {
            opacity: 0.72;
          }
          50% {
            transform: translate(16px, -52vh) scale(1);
            opacity: 0.5;
          }
          80% {
            opacity: 0.32;
          }
          100% {
            transform: translate(-12px, -106vh) scale(1.15);
            opacity: 0;
          }
        }
        /* 체인소맨: 핏빛 입자가 위에서 아래로 떨어짐 */
        .anime-test[data-test="chainsaw-man"] .anime-embers span {
          top: -12px;
          bottom: auto;
          width: 3px;
          height: 13px;
          border-radius: 2px;
          background: #c4313d;
          box-shadow: 0 0 7px 1px rgba(196, 49, 61, 0.55);
          animation-name: blood-fall;
        }
        @keyframes blood-fall {
          0% {
            transform: translateY(-14px) scaleY(0.7);
            opacity: 0;
          }
          12% {
            opacity: 0.72;
          }
          100% {
            transform: translateY(108vh) scaleY(1.25);
            opacity: 0;
          }
        }
        /* 사이버펑크: 네온 데이터 스트림이 위에서 아래로 흘러내림 (옐로+시안) */
        .anime-test[data-test="cyberpunk"] .anime-embers span {
          top: -16px;
          bottom: auto;
          width: 2px;
          height: 18px;
          border-radius: 1px;
          background: var(--accent);
          box-shadow: 0 0 9px 1px color-mix(in srgb, var(--accent) 70%, transparent);
          animation-name: data-fall;
        }
        .anime-test[data-test="cyberpunk"] .anime-embers span:nth-child(3n) {
          background: #00e5ff;
          box-shadow: 0 0 9px 1px rgba(0, 229, 255, 0.55);
        }
        @keyframes data-fall {
          0% {
            transform: translateY(-16px) scaleY(0.6);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(110vh) scaleY(1.3);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .anime-embers,
          .anime-slash,
          .anime-burst {
            display: none;
          }
        }
        @media (max-width: 780px) {
          .anime-answers {
            grid-template-columns: 1fr;
            gap: 11px;
            margin-top: 18px;
          }
          /* 모바일: 글래스 블러 줄이고 불투명도↑ — 가독성 + 저가폰 성능 */
          .anime-hero,
          .anime-card {
            background: rgba(10, 12, 14, 0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .anime-answer {
            background: rgba(10, 12, 14, 0.66);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            padding: 15px 15px;
          }
          /* 입자 절반 (성능) */
          .anime-embers span:nth-child(even) {
            display: none;
          }
        }
        @media (max-width: 520px) {
          .anime-test {
            padding: 18px 13px 44px;
          }
          .anime-hero {
            padding: clamp(22px, 6vw, 30px);
          }
          .anime-card {
            padding: 20px 15px;
          }
          .anime-hero,
          .anime-card {
            border-radius: 8px;
          }
          .anime-back {
            margin-bottom: 12px;
          }
          .anime-answer strong {
            font-size: 15px;
          }
          .anime-cta {
            min-height: 50px;
            font-size: 15px;
          }
        }
      `}</style>
    </main>
  );
}

// 참여 카운터 — 완료 시 1건 POST(공유 조회는 GET만), KV 미설정 시 표시 안 함(graceful).
function ParticipantCount({
  testId,
  resultKey,
  counted,
  locale,
}: {
  testId: string;
  resultKey: string;
  counted: boolean;
  locale: SimpleLocale;
}): ReactElement | null {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const endpoint = statsEndpoint(testId);
    const opts: RequestInit | undefined = counted
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resultId: resultKey }),
        }
      : undefined;
    fetch(endpoint, opts)
      .then((r) => (r.ok ? (r.json() as Promise<{ enabled: boolean; total: number }>) : null))
      .then((d) => {
        if (alive && d && d.enabled && typeof d.total === "number") setTotal(d.total);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [testId, resultKey, counted]);

  if (total === null || total <= 0) return null;
  const n = total.toLocaleString();
  return (
    <p
      style={{
        margin: "16px auto 0",
        textAlign: "center",
        color: "rgba(243,238,251,0.66)",
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {locale === "ko" ? `지금까지 ${n}명이 참여했어요` : `${n} people have taken this`}
    </p>
  );
}
