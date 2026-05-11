"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";
import { ITEMS, type AuctionItem } from "./data";
import { useCounter } from "./useCounter";
import s from "./auction.module.css";

const ROUNDS_PER_SESSION = 5;
const USD_TO_KRW = 1400;
const BEST_KEY = "nolza-auction-best";

type Phase = "intro" | "guessing" | "reveal" | "summary";
type RoundResult = { item: AuctionItem; guessUSD: number; score: number };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scoreFor(guess: number, actual: number): number {
  if (guess <= 0 || actual <= 0) return 0;
  const ratio = Math.min(guess, actual) / Math.max(guess, actual);
  return Math.round(100 * Math.pow(ratio, 0.6));
}

function formatKRW(krw: number): string {
  if (krw >= 1_000_000_000_000) {
    const jo = krw / 1_000_000_000_000;
    return `₩${jo.toFixed(jo >= 10 ? 1 : 2)}조`;
  }
  if (krw >= 100_000_000) {
    const eok = Math.round(krw / 100_000_000);
    return `₩${eok.toLocaleString("ko-KR")}억`;
  }
  if (krw >= 10_000) {
    const man = Math.round(krw / 10_000);
    return `₩${man.toLocaleString("ko-KR")}만`;
  }
  return `₩${krw.toLocaleString("ko-KR")}`;
}

function formatUSD(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${Math.round(usd / 1_000)}K`;
  return `$${usd.toLocaleString("en-US")}`;
}

function unitForLocale(locale: "ko" | "en") {
  return locale === "ko"
    ? { unitLabel: "억", currency: "₩", scaleToUSD: 100_000_000 / USD_TO_KRW }
    : { unitLabel: "million", currency: "$", scaleToUSD: 1_000_000 };
}

function moneyLocalized(usd: number, locale: "ko" | "en"): string {
  return locale === "ko" ? formatKRW(usd * USD_TO_KRW) : formatUSD(usd);
}

function gradeFor(total: number, t: (ko: string, en: string) => string) {
  if (total >= 450) return t("◆ 마스터 감정사", "◆ Master Appraiser");
  if (total >= 380) return t("◇ 전문 큐레이터", "◇ Senior Curator");
  if (total >= 280) return t("◌ 안목 있는 컬렉터", "◌ Discerning Collector");
  if (total >= 180) return t("· 입문 수강생", "· Apprentice");
  return t("○ 운에 맡긴 입찰자", "○ Lucky Bidder");
}

export default function AuctionGame() {
  const { locale, setLocale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [rounds, setRounds] = useState<AuctionItem[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [guessText, setGuessText] = useState("");
  const [results, setResults] = useState<RoundResult[]>([]);
  const [best, setBest] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_KEY);
      if (saved) setBest(parseInt(saved, 10) || 0);
    } catch {}
  }, []);

  const start = () => {
    setRounds(shuffle(ITEMS).slice(0, ROUNDS_PER_SESSION));
    setRoundIdx(0);
    setResults([]);
    setGuessText("");
    setImgFailed(false);
    setPhase("guessing");
  };

  const current = rounds[roundIdx];
  const unit = unitForLocale(locale);

  const parsedGuess = useMemo(() => {
    const n = parseFloat(guessText.replace(/,/g, ""));
    return isFinite(n) && n > 0 ? n : 0;
  }, [guessText]);

  const submitGuess = () => {
    if (!current || parsedGuess <= 0) return;
    const guessUSD = parsedGuess * unit.scaleToUSD;
    const score = scoreFor(guessUSD, current.hammerUSD);
    setResults((prev) => [...prev, { item: current, guessUSD, score }]);
    setPhase("reveal");
  };

  const nextRound = () => {
    if (roundIdx + 1 >= rounds.length) {
      const total = results.reduce((sum, r) => sum + r.score, 0);
      if (total > best) {
        setBest(total);
        try {
          localStorage.setItem(BEST_KEY, String(total));
        } catch {}
      }
      setPhase("summary");
    } else {
      setRoundIdx((i) => i + 1);
      setGuessText("");
      setImgFailed(false);
      setPhase("guessing");
    }
  };

  const restart = () => {
    setPhase("intro");
    setRounds([]);
    setResults([]);
    setRoundIdx(0);
    setGuessText("");
  };

  const lastResult = results[results.length - 1];
  const counterTarget = lastResult
    ? locale === "ko"
      ? Math.round(lastResult.item.hammerUSD * USD_TO_KRW)
      : Math.round(lastResult.item.hammerUSD)
    : 0;
  const counterValue = useCounter(counterTarget, 1500, phase === "reveal");

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);

  const handleShare = async () => {
    const grade = gradeFor(totalScore, t);
    const text = t(
      `놀자.fun · 유물 감정사: ${totalScore}/500 — ${grade} → nolza.fun/games/auction`,
      `nolza.fun · The Appraiser: ${totalScore}/500 — ${grade} → nolza.fun/games/auction`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className={s.shell}>
      <div className={s.topbar}>
        <div className={s.topbar__inner}>
          <Link href="/" className={s.topbar__back}>
            ← {t("놀자.fun", "Nolza.fun")}
          </Link>
          <div className={s.topbar__title}>
            {t("경매장", "The Auction House")}
          </div>
          <div className={s.topbar__right}>
            {phase === "guessing" || phase === "reveal" ? (
              <div className={s.round}>
                <span className={s.round__num}>{String(roundIdx + 1).padStart(2, "0")}</span>
                <span> / {String(ROUNDS_PER_SESSION).padStart(2, "0")}</span>
              </div>
            ) : (
              <div className={s.round}>
                {best > 0
                  ? t(`최고 ${best}/500`, `Best ${best}/500`)
                  : t("5 라운드", "5 lots")}
              </div>
            )}
            <button
              type="button"
              onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
              aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
              className={s.topbar__toggle}
            >
              {locale === "ko" ? "한 / EN" : "EN / 한"}
            </button>
          </div>
        </div>
      </div>

      <div className={s.col}>
        <AdTop />

        {phase === "intro" && <IntroView t={t} best={best} onStart={start} />}

        {phase === "guessing" && current && (
          <GuessView
            item={current}
            locale={locale}
            t={t}
            unit={unit}
            guessText={guessText}
            setGuessText={setGuessText}
            onSubmit={submitGuess}
            imgFailed={imgFailed}
            setImgFailed={setImgFailed}
            inputRef={inputRef}
            roundIdx={roundIdx}
          />
        )}

        {phase === "reveal" && lastResult && (
          <RevealView
            result={lastResult}
            counterValue={counterValue}
            locale={locale}
            t={t}
            roundIdx={roundIdx}
            isLast={roundIdx + 1 >= ROUNDS_PER_SESSION}
            onNext={nextRound}
          />
        )}

        {phase === "summary" && (
          <SummaryView
            t={t}
            locale={locale}
            results={results}
            totalScore={totalScore}
            best={best}
            onRestart={start}
            onShare={handleShare}
            copied={copied}
          />
        )}

        {phase !== "intro" && (
          <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={restart} className={`${s.btn} ${s.btnGhost}`} style={{ width: "auto", padding: "10px 24px", fontSize: 12 }}>
              {t("처음으로", "Start over")}
            </button>
          </div>
        )}

        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}

// ──────────────── Intro ────────────────

function IntroView({
  t,
  best,
  onStart,
}: {
  t: (ko: string, en: string) => string;
  best: number;
  onStart: () => void;
}) {
  return (
    <section className={s.fadeIn} style={{ paddingTop: 28 }}>
      <div className={s.kicker}>{t("놀자 도록 N°27", "Nolza Catalog N°27")}</div>
      <h1
        className={`${s.display} ${s.displayItalic}`}
        style={{ fontSize: "clamp(48px, 9vw, 96px)", marginTop: 14 }}
      >
        {t("유물 감정사", "The Appraiser")}
      </h1>
      <div className={s.divider} style={{ background: "transparent" }}>
        <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "var(--auc-bg)", padding: "0 14px", color: "var(--auc-gold)", fontSize: 14 }}>◇</span>
      </div>

      <p className={s.body} style={{ maxWidth: "36rem" }}>
        {t(
          "공룡 화석부터 아인슈타인의 친필 편지까지 — 다섯 점의 유물이 실제 경매에서 얼마에 팔렸을까. 추측가를 입력하고, 망치 소리를 들으세요.",
          "From dinosaur bones to Einstein’s handwritten letter — five real items, five real hammer prices. Enter your estimate. Wait for the gavel.",
        )}
      </p>

      <div className={s.card} style={{ marginTop: 32, padding: "28px 28px 24px" }}>
        <div className={s.kicker} style={{ marginBottom: 14 }}>
          {t("규칙", "House rules")}
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            t("① 한 라운드마다 한 점의 유물이 등장합니다.", "① Each round presents one historical lot."),
            t("② 당신이 생각하는 낙찰가를 입력합니다.", "② Enter what you think it sold for."),
            t("③ 정답에 가까울수록 점수가 높습니다 (라운드당 0–100점).", "③ The closer your guess, the higher the score (0–100 per lot)."),
            t("④ 다섯 라운드 만점은 500점.", "④ Five lots. Perfect tally: 500."),
          ].map((line, i) => (
            <li key={i} className={s.body} style={{ fontSize: 15, padding: "6px 0", color: "var(--auc-ink-soft)" }}>
              {line}
            </li>
          ))}
        </ul>

        <button onClick={onStart} className={s.btn} style={{ marginTop: 28 }}>
          {t("경매 시작", "Open the auction")} →
        </button>

        {best > 0 && (
          <div className={s.caption} style={{ textAlign: "center", marginTop: 14 }}>
            {t(`최고 기록 — ${best}/500`, `Personal best — ${best}/500`)}
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────── Guessing ────────────────

function GuessView({
  item,
  locale,
  t,
  unit,
  guessText,
  setGuessText,
  onSubmit,
  imgFailed,
  setImgFailed,
  inputRef,
  roundIdx,
}: {
  item: AuctionItem;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  unit: ReturnType<typeof unitForLocale>;
  guessText: string;
  setGuessText: (v: string) => void;
  onSubmit: () => void;
  imgFailed: boolean;
  setImgFailed: (b: boolean) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  roundIdx: number;
}) {
  const copy = item[locale];
  return (
    <section key={item.id} className={s.fadeIn} style={{ paddingTop: 8 }}>
      <div className={s.lotMeta} style={{ marginBottom: 10 }}>
        <span>Lot N°{String(roundIdx + 1).padStart(2, "0")}</span>
        <span className={s.lotMeta__center}>◆</span>
        <span>
          {item.house} · {item.year}
        </span>
      </div>

      <h2
        className={`${s.display} ${locale === "en" ? s.displayItalic : ""}`}
        style={{ fontSize: "clamp(28px, 5.5vw, 48px)", marginTop: 4 }}
      >
        {copy.title}
      </h2>

      <div className={s.divider} role="presentation" />

      <div className={s.card}>
        <div className={s.frame}>
          {imgFailed ? (
            <div className={s.frame__emoji}>{item.emoji}</div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image.src}
              alt={copy.title}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          )}
          <span className={s.frame__corner}>{item.emoji}</span>
        </div>

        <div className={s.cardBody}>
          <div className={s.caption} style={{ marginBottom: 14 }}>
            {item.image.credit}
          </div>

          <p className={s.body}>{copy.blurb}</p>

          <div className={s.divider} role="presentation" />

          <div className={s.kicker}>{t("당신의 추정가", "Your estimate")}</div>
          <div className={s.input}>
            <span className={s.input__currency}>{unit.currency}</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              autoFocus
              value={guessText}
              onChange={(e) => setGuessText(e.target.value.replace(/[^\d.,]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
              placeholder={t("예: 200", "e.g. 5")}
              className={s.input__field}
            />
            <span className={s.input__unit}>{unit.unitLabel}</span>
          </div>
          <div className={s.caption} style={{ marginTop: 8 }}>
            {locale === "ko"
              ? "‘억’ 단위. 예) 200 = 200억원"
              : "in millions of USD. e.g. 5 = $5M"}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!guessText}
            className={s.btn}
            style={{ marginTop: 22 }}
          >
            {t("입찰 마감", "Lock in bid")} →
          </button>
        </div>
      </div>
    </section>
  );
}

// ──────────────── Reveal ────────────────

function RevealView({
  result,
  counterValue,
  locale,
  t,
  roundIdx,
  isLast,
  onNext,
}: {
  result: RoundResult;
  counterValue: number;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  roundIdx: number;
  isLast: boolean;
  onNext: () => void;
}) {
  const { item, guessUSD, score } = result;
  const copy = item[locale];

  const animatedDisplay =
    locale === "ko" ? formatKRW(counterValue) : formatUSD(counterValue);

  const diffPct = Math.round(
    Math.abs(guessUSD - item.hammerUSD) / item.hammerUSD * 100,
  );
  const direction =
    guessUSD > item.hammerUSD
      ? t("너무 높음", "too high")
      : guessUSD < item.hammerUSD
      ? t("너무 낮음", "too low")
      : t("정확", "exact");

  return (
    <section key={`reveal-${item.id}`} className={s.fadeIn} style={{ paddingTop: 8 }}>
      <div className={s.lotMeta} style={{ marginBottom: 10 }}>
        <span>Lot N°{String(roundIdx + 1).padStart(2, "0")}</span>
        <span className={s.lotMeta__center}>◆</span>
        <span>{t("낙찰", "Hammer")}</span>
      </div>

      <h2
        className={`${s.display} ${locale === "en" ? s.displayItalic : ""}`}
        style={{ fontSize: "clamp(26px, 4.5vw, 40px)", marginTop: 4 }}
      >
        {copy.title}
      </h2>

      <div className={s.divider} role="presentation" />

      <div className={s.card}>
        <div className={s.hammer}>
          <div className={s.hammer__label}>
            {t("최종 낙찰가", "Final hammer")}
          </div>
          <div className={s.hammer__value}>{animatedDisplay}</div>
          <div className={s.hammer__house}>
            {item.house} · {item.year}
          </div>
        </div>

        <div className={s.stats}>
          <div className={s.stats__cell}>
            <div className={s.stats__label}>{t("당신의 추정", "Your estimate")}</div>
            <div className={s.stats__value}>
              {locale === "ko" ? formatKRW(guessUSD * USD_TO_KRW) : formatUSD(guessUSD)}
            </div>
          </div>
          <div className={s.stats__cell}>
            <div className={s.stats__label}>{t("오차", "Off by")}</div>
            <div className={s.stats__value}>{diffPct}%</div>
            <div className={s.stats__sub}>{direction}</div>
          </div>
          <div className={s.stats__cell}>
            <div className={s.stats__label}>{t("점수", "Score")}</div>
            <div className={`${s.stats__value} ${score >= 90 ? s["stats__value--gold"] : ""}`}>
              {score}/100
            </div>
            {score >= 95 && (
              <div className={s.stats__sub}>◆ {t("감정사", "appraiser")}</div>
            )}
          </div>
        </div>

        <div className={s.placard}>
          <div className={s.kicker}>{t("이 유물의 사연", "About this lot")}</div>
          <p className={s.body} style={{ marginTop: 10 }}>
            {copy.story}
          </p>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={s.placard__source}
          >
            {t("출처 보기", "View source")} ↗
          </a>
        </div>
      </div>

      <button onClick={onNext} className={s.btn} style={{ marginTop: 24 }}>
        {isLast
          ? `${t("최종 결과", "See final tally")} →`
          : `${t("다음 경매", "Next lot")} →`}
      </button>
    </section>
  );
}

// ──────────────── Summary ────────────────

function SummaryView({
  t,
  locale,
  results,
  totalScore,
  best,
  onRestart,
  onShare,
  copied,
}: {
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
  results: RoundResult[];
  totalScore: number;
  best: number;
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  const grade = gradeFor(totalScore, t);
  const newBest = totalScore >= best && totalScore > 0;
  return (
    <section className={s.fadeIn} style={{ paddingTop: 24 }}>
      <div className={s.kicker} style={{ textAlign: "center" }}>
        {t("최종 합계", "Final tally")}
      </div>
      <div className={s.summary__total} style={{ textAlign: "center", marginTop: 8 }}>
        {totalScore}
        <small> /500</small>
      </div>
      <div
        className={s.body}
        style={{
          textAlign: "center",
          marginTop: 14,
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          color: "var(--auc-gold-deep)",
          fontSize: 20,
        }}
      >
        {grade}
      </div>
      {newBest && (
        <div className={s.caption} style={{ textAlign: "center", marginTop: 6 }}>
          {t("✦ 개인 최고 기록 갱신", "✦ New personal best")}
        </div>
      )}

      <div className={s.divider} role="presentation" />

      <div className={s.kicker} style={{ marginBottom: 4 }}>
        {t("라운드별 결과", "Lot-by-lot")}
      </div>
      <div>
        {results.map((r, i) => (
          <div key={r.item.id} className={s.summary__row}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={s.summary__rowMeta}>
                Lot N°{String(i + 1).padStart(2, "0")} · {r.item.house}
              </div>
              <div className={s.summary__rowTitle} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.item[locale].title}
              </div>
              <div className={s.summary__rowSub}>
                {t("낙찰", "Hammer")}: {moneyLocalized(r.item.hammerUSD, locale)}
                {" · "}
                {t("추정", "Yours")}: {moneyLocalized(r.guessUSD, locale)}
              </div>
            </div>
            <div className={`${s.summary__rowScore} ${r.score >= 90 ? s["summary__rowScore--gold"] : ""}`}>
              {r.score}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
        <button onClick={onRestart} className={s.btn}>
          ↻ {t("다시 하기", "Play again")}
        </button>
        <button onClick={onShare} className={`${s.btn} ${s.btnGhost}`}>
          {copied
            ? t("✓ 복사됐어요", "✓ Copied")
            : `${t("결과 공유하기", "Share result")} ↗`}
        </button>
      </div>
    </section>
  );
}
