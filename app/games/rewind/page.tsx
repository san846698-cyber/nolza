"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";
import { ERAS, TOTAL_ERAS, type EraIndex } from "@/lib/rewind/eras";
import {
  CORPUS,
  type CorpusEntry,
  pickRandom,
  getVersion,
  getGloss,
} from "@/lib/rewind/corpus";
import styles from "./rewind.module.css";

const SEEN_KEY = "nolza-rewind-seen";

function loadSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveSeen(ids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {}
}

export default function RewindGame() {
  const { locale, t } = useLocale();
  const [entry, setEntry] = useState<CorpusEntry | null>(null);
  const [era, setEra] = useState<EraIndex>(0);
  const [frozen, setFrozen] = useState(false);
  const [showGloss, setShowGloss] = useState(false);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    const s = loadSeen();
    setSeen(s);
    setEntry(pickRandom(s));
  }, []);

  const rewind = () => {
    if (!entry || frozen) return;
    if (era < TOTAL_ERAS - 1) {
      setEra((e) => (e + 1) as EraIndex);
    } else {
      setFrozen(true);
    }
  };

  const freeze = () => {
    if (!entry) return;
    setFrozen(true);
    const next = Array.from(new Set([...seen, entry.id]));
    setSeen(next);
    saveSeen(next);
  };

  const reset = () => {
    setEra(0);
    setFrozen(false);
    setShowGloss(false);
  };

  const newSentence = () => {
    const nextSeen = entry ? Array.from(new Set([...seen, entry.id])) : seen;
    setSeen(nextSeen);
    saveSeen(nextSeen);
    setEntry(pickRandom(nextSeen));
    setEra(0);
    setFrozen(false);
    setShowGloss(false);
  };

  const currentEra = ERAS[era];
  const currentText = entry ? getVersion(entry, era) : "";
  const currentGloss = entry ? getGloss(entry, era) : "";

  const stack = useMemo(() => {
    if (!entry) return [];
    return ERAS.slice(0, era + 1).map((e) => ({
      era: e,
      text: getVersion(entry, e.index),
      gloss: getGloss(entry, e.index),
    }));
  }, [entry, era]);

  const progressPct = ((era + 1) / TOTAL_ERAS) * 100;
  const seenCount = seen.length;
  const totalCount = CORPUS.length;

  return (
    <div className={styles.shell} data-game-shell="light">
      <header className={styles.topbar}>
        <Link href="/" className={styles.back}>
          ← {t("놀자.fun", "nolza.fun")}
        </Link>
        <div className={styles.title}>
          {t("한국말 되감기", "Korean Rewind")}
        </div>
        <div className={styles.counter}>
          {seenCount}/{totalCount}
        </div>
      </header>

      <AdTop />

      <main className={styles.main}>
        {!entry ? (
          <div className={styles.loading}>…</div>
        ) : !frozen ? (
          <>
            <div className={styles.timeline}>
              <div className={styles.timelineTrack}>
                <div
                  className={styles.timelineFill}
                  style={{ width: `${progressPct}%` }}
                />
                {ERAS.map((e) => (
                  <div
                    key={e.index}
                    className={styles.timelineDot}
                    data-active={e.index <= era}
                    style={{ left: `${(e.index / (TOTAL_ERAS - 1)) * 100}%` }}
                    title={t(e.nameKo, e.nameEn)}
                  />
                ))}
              </div>
              <div className={styles.timelineLabels}>
                <span>{ERAS[TOTAL_ERAS - 1].yearLabel}</span>
                <span>{ERAS[0].yearLabel}</span>
              </div>
            </div>

            <div className={styles.eraBadge}>
              <span className={styles.eraYear}>{currentEra.yearLabel}</span>
              <span className={styles.eraName}>
                {t(currentEra.nameKo, currentEra.nameEn)}
              </span>
            </div>

            <div
              className={styles.sentence}
              style={{ fontFamily: currentEra.font }}
              key={`${entry.id}-${era}`}
            >
              {currentText}
            </div>

            <button
              type="button"
              className={styles.glossBtn}
              onClick={() => setShowGloss((s) => !s)}
            >
              {showGloss
                ? t("뜻 숨기기", "Hide gloss")
                : t("뜻 보기", "Show gloss")}
            </button>
            {showGloss && (
              <div className={styles.gloss}>{currentGloss}</div>
            )}

            <div className={styles.eraBlurb}>
              {t(currentEra.blurbKo, currentEra.blurbEn)}
            </div>

            <div className={styles.controls}>
              <button
                type="button"
                className={styles.rewindBtn}
                onClick={rewind}
                disabled={era >= TOTAL_ERAS - 1}
              >
                <span className={styles.rewindIcon}>⏪</span>
                <span className={styles.rewindLabel}>
                  {era >= TOTAL_ERAS - 1
                    ? t("끝까지 갔습니다", "End of time")
                    : t("한 시대 되감기", "Rewind one era")}
                </span>
              </button>
              <button
                type="button"
                className={styles.freezeBtn}
                onClick={freeze}
                disabled={era === 0}
              >
                ⏸ {t("이 시대에서 멈추기", "Freeze here")}
              </button>
            </div>

            <p className={styles.disclaimer}>
              {t(
                "재미를 위한 변환입니다 · 학술 자료 아님",
                "Stylized for fun · not academic philology",
              )}
            </p>
          </>
        ) : (
          <div className={styles.result}>
            <h2 className={styles.resultTitle}>
              {t("당신은 ", "You stopped at ")}
              <span className={styles.resultYear}>
                {currentEra.yearLabel}
              </span>
              {t("년에 멈췄습니다", "")}
            </h2>
            <div className={styles.resultEra}>
              {t(currentEra.nameKo, currentEra.nameEn)} ·{" "}
              {t(currentEra.blurbKo, currentEra.blurbEn)}
            </div>

            <ol className={styles.stack}>
              {stack
                .slice()
                .reverse()
                .map(({ era: e, text, gloss }) => (
                  <li key={e.index} className={styles.stackItem}>
                    <div className={styles.stackYear}>
                      {e.yearLabel}
                      <span className={styles.stackEraName}>
                        {t(e.nameKo, e.nameEn)}
                      </span>
                    </div>
                    <div
                      className={styles.stackText}
                      style={{ fontFamily: e.font }}
                    >
                      {text}
                    </div>
                    {locale === "en" && (
                      <div className={styles.stackGloss}>{gloss}</div>
                    )}
                  </li>
                ))}
            </ol>

            <div className={styles.resultActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={newSentence}
              >
                {t("다른 문장으로", "Try another sentence")}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={reset}
              >
                {t("다시 되감기", "Rewind again")}
              </button>
            </div>
          </div>
        )}
      </main>

      <AdBottom />
      <AdMobileSticky />
    </div>
  );
}
