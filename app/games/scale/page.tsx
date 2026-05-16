"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AdBottom } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";
import { SCALE_OBJECTS, type ScaleKind } from "@/lib/scale-objects";

const logs = SCALE_OBJECTS.map((object) => Math.log10(object.m));
const MIN_LOG = logs[0];
const MAX_LOG = logs[logs.length - 1];
const CAMERA_MS = 760;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function formatPower(logValue: number) {
  const exponent = Math.round(logValue);
  if (exponent === 0) return "1 m";
  return `10${exponent > 0 ? "+" : ""}${exponent} m`;
}

export default function ScaleGame() {
  const { locale, t } = useLocale();
  const [index, setIndex] = useState(6);
  const [cameraLog, setCameraLog] = useState(logs[6]);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const dragStartRef = useRef<{ x: number; index: number } | null>(null);

  const active = SCALE_OBJECTS[index];
  const scaleProgress = (cameraLog - MIN_LOG) / (MAX_LOG - MIN_LOG);
  const gridSize = clamp(120 - scaleProgress * 64, 34, 120);

  const goTo = useCallback((nextIndex: number) => {
    setIndex(clamp(nextIndex, 0, SCALE_OBJECTS.length - 1));
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const target = logs[index];
    const start = cameraLog;
    if (Math.abs(start - target) < 0.0001) return;

    const startAt = performance.now();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const animate = (now: number) => {
      const progress = clamp((now - startAt) / CAMERA_MS, 0, 1);
      const eased = easeOutQuart(progress);
      setCameraLog(lerp(start, target, eased));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        next();
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        prev();
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(SCALE_OBJECTS.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, next, prev]);

  const wheelLock = useRef(false);
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaY + event.deltaX;
      if (Math.abs(delta) < 20 || wheelLock.current) return;
      wheelLock.current = true;
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 420);
      if (delta > 0) next();
      else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const startDrag = (clientX: number) => {
    dragStartRef.current = { x: clientX, index };
    setDragging(true);
  };

  const moveDrag = (clientX: number) => {
    const start = dragStartRef.current;
    if (!start) return;
    const width = stageRef.current?.clientWidth ?? 360;
    const deltaSteps = Math.round(((start.x - clientX) / width) * 4.2);
    goTo(start.index + deltaSteps);
  };

  const endDrag = () => {
    dragStartRef.current = null;
    setDragging(false);
  };

  const onShare = async () => {
    const text = t(
      `크기의 세계에서 ${active.name}(${active.sizeKo})를 봤어요. nolza.fun/games/scale`,
      `I explored ${active.en} (${active.sizeEn}) on Scale of Things. nolza.fun/games/scale`,
    );
    const nav =
      typeof navigator !== "undefined"
        ? (navigator as Navigator & {
            share?: (data: { title: string; text: string; url: string }) => Promise<void>;
            clipboard?: Clipboard;
          })
        : null;
    try {
      if (nav?.share) {
        await nav.share({ title: t("크기의 세계", "Scale of Things"), text, url: "/games/scale" });
        return;
      }
      if (nav?.clipboard) {
        await nav.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      try {
        await nav?.clipboard?.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        setCopied(false);
      }
    }
  };

  const visibleObjects = useMemo(() => {
    return SCALE_OBJECTS.map((object, objectIndex) => ({
      object,
      objectIndex,
      delta: logs[objectIndex] - cameraLog,
    })).filter(({ delta }) => Math.abs(delta) < 6.2);
  }, [cameraLog]);

  return (
    <main
      className="scale-page"
      style={{ "--grid-size": `${gridSize}px`, "--active-accent": active.accent } as CSSProperties}
    >
      <section className="scale-hero">
        <div className="scale-copy">
          <p className="eyebrow">{t("INTERACTIVE SCALE ATLAS", "INTERACTIVE SCALE ATLAS")}</p>
          <h1>{t("크기의 세계", "Scale of Things")}</h1>
          <p className="subtitle">
            {t(
              "세상의 작은 것과 거대한 것을 한눈에 비교해보세요.",
              "Explore how small and massive the world really is.",
            )}
          </p>
        </div>
        <button type="button" className="share-button btn-press" onClick={onShare}>
          {copied ? t("복사됨", "Copied") : t("공유", "Share")}
        </button>
      </section>

      <section
        ref={stageRef}
        className={`scale-stage ${dragging ? "is-dragging" : ""}`}
        aria-label={t("크기 비교 인터랙티브 시각화", "Interactive scale comparison")}
        onMouseDown={(event) => startDrag(event.clientX)}
        onMouseMove={(event) => {
          if (dragStartRef.current) moveDrag(event.clientX);
        }}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(event) => startDrag(event.touches[0].clientX)}
        onTouchMove={(event) => moveDrag(event.touches[0].clientX)}
        onTouchEnd={endDrag}
      >
        <div className="ruler ruler-top" aria-hidden>
          {Array.from({ length: 13 }).map((_, tick) => (
            <span key={tick} style={{ left: `${(tick / 12) * 100}%` }} />
          ))}
        </div>

        <div className="scale-axis" aria-hidden>
          <div className="axis-line" />
          <div className="axis-label axis-label-left">{formatPower(cameraLog - 3)}</div>
          <div className="axis-label axis-label-center">{formatPower(cameraLog)}</div>
          <div className="axis-label axis-label-right">{formatPower(cameraLog + 3)}</div>
        </div>

        <div className="object-field">
          {visibleObjects.map(({ object, objectIndex, delta }) => {
            const isActive = objectIndex === index;
            const distance = Math.abs(delta);
            const normalized = clamp(distance / 6.2, 0, 1);
            const x = delta * 128;
            const visualSize = clamp(56 + (1 - normalized) * 240 + (isActive ? 54 : 0), 24, 340);
            const opacity = isActive ? 1 : clamp(0.52 - normalized * 0.4, 0.08, 0.46);
            const blur = isActive ? 0 : normalized * 1.8;

            return (
              <button
                key={object.id}
                type="button"
                className={`scale-object ${isActive ? "is-active" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(objectIndex);
                }}
                aria-label={locale === "ko" ? object.name : object.en}
                style={
                  {
                    "--object-x": `${x}px`,
                    "--object-size": `${visualSize}px`,
                    "--object-opacity": opacity,
                    "--object-blur": `${blur}px`,
                    "--object-accent": object.accent,
                    zIndex: isActive ? 8 : Math.max(1, 7 - Math.round(distance)),
                  } as CSSProperties
                }
              >
                <ScaleSilhouette kind={object.kind} active={isActive} />
                <span className="object-caption">
                  {locale === "ko" ? object.name : object.en}
                </span>
              </button>
            );
          })}
        </div>

        <article className="active-panel">
          <div>
            <span>{locale === "ko" ? active.categoryKo : active.categoryEn}</span>
            <h2>{locale === "ko" ? active.name : active.en}</h2>
            <p>{locale === "ko" ? active.desc : active.descEn}</p>
          </div>
          <strong>{locale === "ko" ? active.sizeKo : active.sizeEn}</strong>
        </article>

        <button
          type="button"
          className="nav-button nav-button-left btn-press"
          onClick={prev}
          disabled={index === 0}
          aria-label={t("이전 크기", "Previous size")}
        >
          ‹
        </button>
        <button
          type="button"
          className="nav-button nav-button-right btn-press"
          onClick={next}
          disabled={index === SCALE_OBJECTS.length - 1}
          aria-label={t("다음 크기", "Next size")}
        >
          ›
        </button>
      </section>

      <section className="timeline-panel" aria-label={t("크기 타임라인", "Scale timeline")}>
        <input
          type="range"
          min={0}
          max={SCALE_OBJECTS.length - 1}
          value={index}
          onInput={(event) => goTo(Number(event.currentTarget.value))}
          onChange={(event) => goTo(Number(event.target.value))}
          aria-label={t("크기 단계 선택", "Select scale step")}
        />
        <div className="timeline-dots">
          {SCALE_OBJECTS.map((object, objectIndex) => (
            <button
              type="button"
              key={object.id}
              className={objectIndex === index ? "is-active" : ""}
              onClick={() => goTo(objectIndex)}
              aria-label={locale === "ko" ? object.name : object.en}
            >
              <span />
            </button>
          ))}
        </div>
      </section>

      <section className="scale-cards">
        {nearbyObjects(index).map((objectIndex) => {
          const object = SCALE_OBJECTS[objectIndex];
          return (
            <button type="button" key={object.id} onClick={() => goTo(objectIndex)} className="scale-card">
              <span>{locale === "ko" ? object.categoryKo : object.categoryEn}</span>
              <strong>{locale === "ko" ? object.name : object.en}</strong>
              <em>{locale === "ko" ? object.sizeKo : object.sizeEn}</em>
            </button>
          );
        })}
      </section>

      <div className="ad-spacer">
        <AdBottom />
      </div>

      <style jsx>{`
        .scale-page {
          min-height: calc(100svh - clamp(64px, 8vw, 72px));
          overflow-x: clip;
          background:
            radial-gradient(circle at 16% 12%, color-mix(in srgb, var(--active-accent) 18%, transparent), transparent 28%),
            linear-gradient(180deg, #f4efe4 0%, #ebe3d4 100%);
          color: #191713;
          font-family: var(--font-noto-sans-kr), system-ui, sans-serif;
          padding: clamp(18px, 3vw, 34px);
        }
        .scale-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(25,23,19,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25,23,19,0.055) 1px, transparent 1px);
          background-size: var(--grid-size) var(--grid-size);
          transition: background-size 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          mask-image: linear-gradient(to bottom, black 0%, black 68%, transparent 100%);
        }
        .scale-hero {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto clamp(16px, 3vw, 28px);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }
        .scale-copy {
          max-width: 760px;
        }
        .eyebrow {
          margin: 0 0 10px;
          color: var(--active-accent);
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.24em;
        }
        h1 {
          margin: 0;
          font-family: var(--font-noto-serif-kr), serif;
          font-size: clamp(42px, 8vw, 92px);
          font-weight: 700;
          line-height: 0.98;
          letter-spacing: 0;
        }
        .subtitle {
          margin: 16px 0 0;
          max-width: 620px;
          color: rgba(25,23,19,0.66);
          font-size: clamp(16px, 2vw, 20px);
          line-height: 1.65;
          word-break: keep-all;
        }
        .share-button {
          flex: 0 0 auto;
          min-height: 42px;
          border: 1px solid rgba(25,23,19,0.18);
          border-radius: 999px;
          background: rgba(255,255,255,0.48);
          color: #191713;
          padding: 10px 17px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(16px);
        }
        .scale-stage {
          position: relative;
          z-index: 1;
          width: min(100%, 1180px);
          height: clamp(480px, 62svh, 720px);
          margin: 0 auto;
          border: 1px solid rgba(25,23,19,0.12);
          border-radius: 6px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.36), rgba(255,255,255,0.08)),
            rgba(255,250,238,0.28);
          box-shadow: 0 28px 86px -58px rgba(25,23,19,0.45);
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
        }
        .scale-stage.is-dragging {
          cursor: grabbing;
        }
        .ruler {
          position: absolute;
          left: clamp(18px, 4vw, 52px);
          right: clamp(18px, 4vw, 52px);
          height: 34px;
          pointer-events: none;
          opacity: 0.56;
        }
        .ruler-top {
          top: 24px;
          border-top: 1px solid rgba(25,23,19,0.24);
        }
        .ruler span {
          position: absolute;
          top: 0;
          width: 1px;
          height: 12px;
          background: rgba(25,23,19,0.34);
        }
        .ruler span:nth-child(odd) {
          height: 22px;
        }
        .scale-axis {
          position: absolute;
          left: clamp(24px, 5vw, 72px);
          right: clamp(24px, 5vw, 72px);
          bottom: 134px;
          height: 28px;
          pointer-events: none;
        }
        .axis-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 7px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(25,23,19,0.32), transparent);
        }
        .axis-label {
          position: absolute;
          top: 16px;
          color: rgba(25,23,19,0.48);
          font-family: var(--font-inter), sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .axis-label-left {
          left: 0;
        }
        .axis-label-center {
          left: 50%;
          transform: translateX(-50%);
          color: var(--active-accent);
        }
        .axis-label-right {
          right: 0;
        }
        .object-field {
          position: absolute;
          inset: 68px 0 132px;
          pointer-events: none;
          perspective: 1000px;
        }
        .scale-object {
          --object-x: 0px;
          --object-size: 180px;
          --object-opacity: 1;
          --object-blur: 0px;
          --object-accent: #445c72;
          position: absolute;
          left: 50%;
          bottom: 22px;
          width: var(--object-size);
          height: var(--object-size);
          border: 0;
          background: transparent;
          padding: 0;
          opacity: var(--object-opacity);
          transform: translateX(calc(-50% + var(--object-x))) translateZ(0);
          transition:
            transform 0.72s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.72s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.72s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.42s ease,
            filter 0.42s ease;
          filter: blur(var(--object-blur));
          pointer-events: auto;
          cursor: pointer;
        }
        .scale-object::after {
          content: "";
          position: absolute;
          left: 16%;
          right: 16%;
          bottom: -6px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(25,23,19,0.2), transparent 70%);
          opacity: 0.55;
          transform: scaleY(0.55);
        }
        .scale-object.is-active::after {
          opacity: 0.78;
        }
        .object-caption {
          position: absolute;
          left: 50%;
          bottom: -34px;
          transform: translateX(-50%);
          white-space: nowrap;
          color: rgba(25,23,19,0.58);
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          opacity: 0;
          transition: opacity 0.28s ease;
        }
        .scale-object.is-active .object-caption {
          opacity: 1;
        }
        .active-panel {
          position: absolute;
          left: clamp(16px, 4vw, 46px);
          right: clamp(16px, 4vw, 46px);
          bottom: 32px;
          z-index: 12;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 22px;
          align-items: end;
          border-top: 1px solid rgba(25,23,19,0.16);
          padding-top: 18px;
          pointer-events: none;
        }
        .active-panel span {
          color: var(--active-accent);
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }
        .active-panel h2 {
          margin: 8px 0 0;
          font-family: var(--font-noto-serif-kr), serif;
          font-size: clamp(28px, 5vw, 54px);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: 0;
          word-break: keep-all;
        }
        .active-panel p {
          margin: 12px 0 0;
          max-width: 680px;
          color: rgba(25,23,19,0.66);
          font-size: clamp(14px, 1.5vw, 16px);
          line-height: 1.65;
          word-break: keep-all;
        }
        .active-panel strong {
          color: #191713;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(26px, 5vw, 56px);
          line-height: 0.95;
          font-weight: 300;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }
        .nav-button {
          position: absolute;
          top: 50%;
          z-index: 13;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(25,23,19,0.18);
          border-radius: 50%;
          background: rgba(255,255,255,0.58);
          color: rgba(25,23,19,0.84);
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
          backdrop-filter: blur(18px);
          transform: translateY(-50%);
        }
        .nav-button:disabled {
          opacity: 0.25;
          cursor: default;
        }
        .nav-button-left {
          left: 18px;
        }
        .nav-button-right {
          right: 18px;
        }
        .timeline-panel {
          position: relative;
          z-index: 2;
          width: min(100%, 980px);
          margin: 22px auto 0;
          display: grid;
          gap: 12px;
        }
        input[type="range"] {
          width: 100%;
          accent-color: var(--active-accent);
        }
        .timeline-dots {
          display: grid;
          grid-template-columns: repeat(${SCALE_OBJECTS.length}, minmax(0, 1fr));
          gap: 6px;
        }
        .timeline-dots button {
          min-height: 28px;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }
        .timeline-dots span {
          display: block;
          height: 2px;
          border-radius: 999px;
          background: rgba(25,23,19,0.2);
          transition: height 0.2s ease, background 0.2s ease;
        }
        .timeline-dots button.is-active span {
          height: 8px;
          background: var(--active-accent);
        }
        .scale-cards {
          width: min(100%, 980px);
          margin: 24px auto 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .scale-card {
          min-height: 118px;
          border: 1px solid rgba(25,23,19,0.12);
          border-radius: 6px;
          background: rgba(255,255,255,0.34);
          color: #191713;
          padding: 16px;
          text-align: left;
          cursor: pointer;
        }
        .scale-card span {
          color: rgba(25,23,19,0.46);
          font-family: var(--font-inter), sans-serif;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }
        .scale-card strong {
          display: block;
          margin-top: 12px;
          font-size: 18px;
          line-height: 1.2;
          word-break: keep-all;
        }
        .scale-card em {
          display: block;
          margin-top: 8px;
          color: var(--active-accent);
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-style: normal;
          font-weight: 900;
        }
        .ad-spacer {
          width: min(100%, 980px);
          margin: 36px auto 0;
        }
        @media (max-width: 720px) {
          .scale-page {
            padding: 16px 12px 32px;
          }
          .scale-hero {
            flex-direction: column;
          }
          .scale-stage {
            height: min(620px, 64svh);
            min-height: 500px;
          }
          .object-field {
            inset: 74px 0 178px;
          }
          .scale-axis {
            bottom: 236px;
          }
          .active-panel {
            grid-template-columns: 1fr;
            gap: 10px;
            align-items: start;
          }
          .active-panel strong {
            font-size: 34px;
          }
          .nav-button {
            top: 48%;
            bottom: auto;
            width: 42px;
            height: 42px;
            font-size: 28px;
          }
          .nav-button-left {
            left: 10px;
          }
          .nav-button-right {
            right: 10px;
          }
          .scale-cards {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .scale-object,
          .scale-page::before,
          .timeline-dots span {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}

function nearbyObjects(index: number) {
  const picks = new Set<number>([
    clamp(index - 1, 0, SCALE_OBJECTS.length - 1),
    index,
    clamp(index + 1, 0, SCALE_OBJECTS.length - 1),
  ]);
  return [...picks];
}

function ScaleSilhouette({ kind, active }: { kind: ScaleKind; active: boolean }) {
  const className = `silhouette silhouette-${kind} ${active ? "active" : ""}`;
  return (
    <div className={className} aria-hidden>
      <SilhouetteShape kind={kind} />
      <style jsx>{`
        .silhouette {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--object-accent);
        }
        .silhouette :global(svg) {
          width: 100%;
          height: 100%;
          overflow: visible;
          filter: drop-shadow(0 22px 28px rgba(25,23,19,0.18));
        }
        .silhouette.active :global(svg) {
          filter: drop-shadow(0 30px 36px rgba(25,23,19,0.22));
        }
      `}</style>
    </div>
  );
}

function SilhouetteShape({ kind }: { kind: ScaleKind }) {
  const common = {
    fill: "currentColor",
    stroke: "rgba(25,23,19,0.28)",
    strokeWidth: 1.2,
    vectorEffect: "non-scaling-stroke" as const,
  };

  switch (kind) {
    case "atom":
      return (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="6" {...common} />
          <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.55" />
          <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.45" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.45" transform="rotate(120 50 50)" />
        </svg>
      );
    case "dna":
      return (
        <svg viewBox="0 0 100 100">
          <path d="M31 8C72 22 72 36 31 50C72 64 72 78 31 92" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M69 8C28 22 28 36 69 50C28 64 28 78 69 92" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
          {[20, 35, 50, 65, 80].map((y) => (
            <line key={y} x1="34" x2="66" y1={y} y2={y} stroke="rgba(25,23,19,0.35)" strokeWidth="3" />
          ))}
        </svg>
      );
    case "cell":
      return (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="34" {...common} opacity="0.78" />
          <circle cx="50" cy="50" r="15" fill="rgba(255,255,255,0.44)" />
          <circle cx="50" cy="50" r="6" fill="rgba(25,23,19,0.16)" />
        </svg>
      );
    case "ant":
      return (
        <svg viewBox="0 0 120 80">
          <ellipse cx="35" cy="45" rx="19" ry="16" {...common} />
          <ellipse cx="61" cy="43" rx="18" ry="14" {...common} opacity="0.88" />
          <ellipse cx="87" cy="41" rx="24" ry="18" {...common} opacity="0.78" />
          {[38, 58, 78].map((x) => (
            <g key={x} stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.72">
              <path d={`M${x} 52 L${x - 17} 70`} />
              <path d={`M${x} 34 L${x - 17} 16`} />
            </g>
          ))}
          <path d="M22 34 Q8 18 4 9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M27 31 Q20 12 24 3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "bee":
      return (
        <svg viewBox="0 0 130 90">
          <ellipse cx="58" cy="35" rx="26" ry="18" fill="rgba(255,255,255,0.5)" stroke="currentColor" strokeWidth="4" />
          <ellipse cx="84" cy="35" rx="25" ry="17" fill="rgba(255,255,255,0.38)" stroke="currentColor" strokeWidth="4" />
          <ellipse cx="70" cy="58" rx="42" ry="22" {...common} />
          {[50, 65, 80, 95].map((x) => (
            <rect key={x} x={x} y="38" width="7" height="39" rx="4" fill="rgba(25,23,19,0.26)" />
          ))}
          <circle cx="31" cy="57" r="13" {...common} />
          <path d="M27 45 Q16 27 8 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "mouse":
      return (
        <svg viewBox="0 0 140 78">
          <path d="M31 48C41 24 86 16 114 35C132 47 125 66 94 69C58 73 19 67 31 48Z" {...common} />
          <circle cx="113" cy="31" r="13" {...common} />
          <circle cx="119" cy="24" r="7" fill="rgba(255,255,255,0.5)" />
          <path d="M31 55C11 54 7 64 2 73" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
          <circle cx="118" cy="33" r="2.5" fill="#191713" />
        </svg>
      );
    case "human":
      return (
        <svg viewBox="0 0 80 140">
          <circle cx="40" cy="18" r="13" {...common} />
          <path d="M28 36H52L58 82H22L28 36Z" {...common} />
          <path d="M27 82L22 132" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
          <path d="M53 82L58 132" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
          <path d="M27 45L12 78" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <path d="M53 45L68 78" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    case "whale":
      return (
        <svg viewBox="0 0 220 92">
          <path d="M28 54C54 18 151 10 191 44C177 70 119 86 58 72C42 68 32 63 28 54Z" {...common} />
          <path d="M188 45L215 24L208 49L218 72L190 55Z" {...common} opacity="0.85" />
          <path d="M75 69C89 86 122 85 137 67" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="58" cy="46" r="3" fill="#191713" />
        </svg>
      );
    case "skyscraper":
      return (
        <svg viewBox="0 0 90 180">
          <path d="M43 4L60 176H28L43 4Z" {...common} />
          <path d="M43 4L47 176" stroke="rgba(255,255,255,0.36)" strokeWidth="3" />
          <path d="M35 60H55M32 100H58M30 138H60" stroke="rgba(25,23,19,0.24)" strokeWidth="2" />
        </svg>
      );
    case "mountain":
      return (
        <svg viewBox="0 0 200 130">
          <path d="M20 120L90 18L137 120Z" {...common} opacity="0.72" />
          <path d="M70 120L126 34L184 120Z" {...common} />
          <path d="M126 34L112 67L132 58L145 83" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="44" {...common} />
          <circle cx="43" cy="44" r="7" fill="rgba(25,23,19,0.12)" />
          <circle cx="72" cy="58" r="10" fill="rgba(25,23,19,0.1)" />
          <circle cx="55" cy="80" r="5" fill="rgba(25,23,19,0.12)" />
        </svg>
      );
    case "earth":
      return (
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" {...common} />
          <path d="M37 40C52 28 69 39 61 50C54 60 75 62 82 72C70 87 46 87 34 72C43 66 41 55 37 40Z" fill="rgba(255,255,255,0.32)" />
          <path d="M74 33C88 40 96 52 95 66C86 57 79 51 80 43C81 38 77 35 74 33Z" fill="rgba(255,255,255,0.28)" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="42" {...common} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="70"
              x2="70"
              y1="9"
              y2="25"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              transform={`rotate(${i * 30} 70 70)`}
            />
          ))}
          <circle cx="70" cy="70" r="24" fill="rgba(255,255,255,0.24)" />
        </svg>
      );
    case "galaxy":
      return (
        <svg viewBox="0 0 180 180">
          <path d="M22 92C52 38 148 36 158 84C166 124 93 146 55 118C28 98 64 75 102 82C135 88 134 111 108 119" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" opacity="0.88" />
          <circle cx="90" cy="90" r="9" fill="currentColor" />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={24 + ((i * 37) % 132)} cy={22 + ((i * 53) % 136)} r={i % 3 === 0 ? 2 : 1.2} fill="rgba(25,23,19,0.34)" />
          ))}
        </svg>
      );
  }
}
