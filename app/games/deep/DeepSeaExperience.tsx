"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { DEEP_SEA_MILESTONES, MAX_DEEP_SEA_DEPTH } from "@/lib/deep-sea";
import s from "./deep.module.css";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatDepth(depth: number, locale: "ko" | "en") {
  return locale === "ko"
    ? `${depth.toLocaleString("ko-KR")}m`
    : `${depth.toLocaleString("en-US")} m`;
}

function useScrollDepth(containerRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const travel = Math.max(1, rect.height - viewport);
        const next = clamp(-rect.top / travel, 0, 1);
        setProgress(next);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return progress;
}

function nearestMilestone(depth: number) {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  DEEP_SEA_MILESTONES.forEach((item, index) => {
    const distance = Math.abs(depth - item.depth);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

export default function DeepSeaExperience() {
  const { locale, setLocale, t } = useLocale();
  const journeyRef = useRef<HTMLElement | null>(null);
  const progress = useScrollDepth(journeyRef);
  const [copied, setCopied] = useState(false);
  const depth = Math.round(progress * MAX_DEEP_SEA_DEPTH);
  const activeIndex = nearestMilestone(depth);
  const darkness = clamp(depth / MAX_DEEP_SEA_DEPTH, 0, 1);
  const active = DEEP_SEA_MILESTONES[activeIndex];

  useEffect(() => {
    document.title =
      locale === "ko"
        ? "마리아나 해구 끝까지 내려가면? | 심해 11,000m 체험"
        : "What Happens If You Dive to the Mariana Trench? | Deep Sea Scroll Experience";
    const description =
      locale === "ko"
        ? "해수면부터 챌린저 딥까지, 수심 11,000m의 심해를 스크롤로 내려가며 체험하는 인터랙티브 웹 콘텐츠."
        : "Scroll from the ocean surface to Challenger Deep and explore the mysterious world of the deep sea.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [locale]);

  const pageStyle = useMemo(
    () => ({
      "--deep-progress": progress.toString(),
      "--deep-darkness": darkness.toString(),
    }) as React.CSSProperties,
    [darkness, progress],
  );

  async function share() {
    const url = "https://nolza.fun/games/deep";
    const text = t(
      "나는 마리아나 해구 10,984m까지 내려갔다 🌊",
      "I descended to 10,984m in the Mariana Trench 🌊",
    );
    const nav = navigator as Navigator & {
      share?: (data: { title: string; text: string; url: string }) => Promise<void>;
      clipboard?: Clipboard;
    };
    try {
      if (nav.share) {
        await nav.share({
          title: t(
            "마리아나 해구 끝까지 내려가면?",
            "What Happens If You Dive to the Mariana Trench?",
          ),
          text,
          url,
        });
        return;
      }
      await nav.clipboard?.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sharing is optional */
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className={s.page} style={pageStyle}>
      <header className={s.topbar}>
        <Link href="/" className={s.back} aria-label={t("홈으로", "Go home")}>
          ← nolza.fun
        </Link>
        <div className={s.brand}>{t("심해 11,000m 체험", "Deep Sea Scroll")}</div>
        <button
          type="button"
          className={s.lang}
          onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
        >
          {locale === "ko" ? "EN" : "한"}
        </button>
      </header>

      <section className={s.hero}>
        <div className={s.surfaceGlow} aria-hidden />
        <div className={s.heroCopy}>
          <p className={s.kicker}>
            {t("INTERACTIVE DESCENT", "INTERACTIVE DESCENT")}
          </p>
          <h1>
            {t(
              "마리아나 해구 끝까지 내려가면?",
              "What Happens If You Dive to the Mariana Trench?",
            )}
          </h1>
          <p>
            {t(
              "해수면에서 챌린저 딥까지, 스크롤을 내리며 빛이 사라지고 압력이 커지는 심해를 체험해보세요.",
              "Scroll from the surface to Challenger Deep as light fades, pressure rises, and the ocean turns cinematic.",
            )}
          </p>
          <a href="#descent" className={s.start}>
            {t("아래로 내려가기", "Begin the descent")}
          </a>
        </div>
      </section>

      <section id="descent" ref={journeyRef} className={s.journey}>
        <div className={s.oceanBackdrop} aria-hidden>
          <div className={s.lightRays} />
          <div className={s.particles} />
          <div className={s.currentA} />
          <div className={s.currentB} />
        </div>

        <aside className={s.depthMeter} aria-label={t("현재 수심", "Current depth")}>
          <span>{t("현재 수심", "Depth")}</span>
          <strong>{formatDepth(depth, locale)}</strong>
          <div className={s.progressTrack}>
            <div className={s.progressFill} />
          </div>
          <em>{active.title[locale]}</em>
        </aside>

        {DEEP_SEA_MILESTONES.map((milestone, index) => (
          <article
            className={`${s.milestone} ${milestone.side === "right" ? s.right : s.left}`}
            key={milestone.depth}
            data-active={index === activeIndex}
          >
            <div className={s.visual} data-kind={milestone.visual} aria-hidden>
              <DeepVisual kind={milestone.visual} />
            </div>
            <div className={s.card}>
              <span className={s.depth}>{formatDepth(milestone.depth, locale)}</span>
              <h2>{milestone.title[locale]}</h2>
              <p>{milestone.fact[locale]}</p>
              {milestone.pressure && (
                <div className={s.pressure}>
                  <span>{t("수압", "Pressure")}</span>
                  <b>{milestone.pressure[locale]}</b>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className={s.final}>
        <div className={s.finalCard}>
          <p className={s.kicker}>{t("CHALLENGER DEEP", "CHALLENGER DEEP")}</p>
          <h2>
            {t(
              "당신은 지구에서 가장 깊은 곳에 도착했습니다.",
              "You reached one of the deepest known points on Earth.",
            )}
          </h2>
          <p>
            {t(
              "수심 약 10,984m. 챌린저 딥.",
              "About 10,984 meters below the surface. Challenger Deep.",
            )}
          </p>
          <div className={s.finalStats}>
            <div>
              <span>{t("최종 수심", "Final depth")}</span>
              <b>10,984m</b>
            </div>
            <div>
              <span>{t("수압", "Pressure")}</span>
              <b>{t("약 1,100기압", "About 1,100 atm")}</b>
            </div>
          </div>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={share}>
              {copied ? t("복사됨", "Copied") : t("공유하기", "Share")}
            </button>
            <button type="button" className={s.secondary} onClick={scrollToTop}>
              {t("다시 수면으로", "Back to surface")}
            </button>
          </div>
        </div>

        <div className={s.related}>
          <Link href="/games/aqua-fishing">{t("심해 낚시", "Aqua Fishing")}</Link>
          <Link href="/games/probability">{t("확률 체험기", "Probability Lab")}</Link>
          <Link href="/games/timeline">{t("세계사 타임라인", "World History Timeline")}</Link>
        </div>
      </section>
    </main>
  );
}

function DeepVisual({ kind }: { kind: string }) {
  if (kind === "wreck") {
    return (
      <svg viewBox="0 0 220 140" role="img" aria-hidden>
        <path d="M18 90h118l50 22H38z" />
        <path d="M54 70h54l18 20H38z" />
        <path d="M104 50h16v36h-16z" />
        <path d="M134 58h10v36h-10z" />
        <path d="M30 116h154" />
      </svg>
    );
  }
  if (kind === "trench") {
    return (
      <svg viewBox="0 0 220 150" role="img" aria-hidden>
        <path d="M8 122c34-10 50-34 75-34 34 0 44 32 76 32 18 0 34-9 53-22v44H8z" />
        <path d="M44 124c14-18 26-27 42-27 27 0 38 29 62 31" />
        <circle cx="176" cy="52" r="4" />
        <circle cx="154" cy="68" r="2" />
      </svg>
    );
  }
  if (kind === "creature") {
    return (
      <svg viewBox="0 0 220 130" role="img" aria-hidden>
        <path d="M24 64c28-30 94-42 139-8l34-22-10 34 10 34-34-23C112 112 50 96 24 64z" />
        <circle cx="61" cy="58" r="5" />
        <path d="M84 80c18 8 40 8 62-2" />
      </svg>
    );
  }
  if (kind === "diver") {
    return (
      <svg viewBox="0 0 180 150" role="img" aria-hidden>
        <circle cx="90" cy="44" r="18" />
        <path d="M72 68h38l18 42H58z" />
        <path d="M64 116l-32 20M116 116l32 20M64 82 28 66M116 82l36-16" />
        <path d="M110 40h30" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 130" role="img" aria-hidden>
      <path d="M24 64c34-28 102-30 148 0-46 31-114 29-148 0z" />
      <path d="M172 64l34-24v48z" />
      <circle cx="74" cy="56" r="5" />
      <path d="M92 82c18 8 38 8 58 0" />
    </svg>
  );
}
