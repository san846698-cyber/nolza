"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { SCALE_OBJECTS, type ScaleObj } from "@/lib/scale-objects";
import { Art } from "./Art";

/* -------------------------------------------------------------------------- */
/*  Layout & camera math                                                      */
/* -------------------------------------------------------------------------- */

const objLogs = SCALE_OBJECTS.map((o) => Math.log10(o.m));

// Focal sits at FOCAL_PX. Smaller neighbours drift left at proper relative
// pixel sizes; bigger neighbours sit just past the focal's right edge so they
// never overlap. Outside the visible band, objects fade or aren't rendered.
const FOCAL_PX = 280;
const X_SPACING_NEG = 200;
const VISIBLE_DELTA_MIN = -2.5;
const VISIBLE_DELTA_MAX = 1.0;
const FADE_RANGE = 0.5;

const ANIM_MS = 600;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function fadeOpacity(delta: number) {
  const lo = VISIBLE_DELTA_MIN;
  const hi = VISIBLE_DELTA_MAX;
  const d = clamp(delta, lo, hi);
  const f = Math.min((d - lo) / FADE_RANGE, (hi - d) / FADE_RANGE);
  return clamp(f, 0, 1);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ScaleGame() {
  const { locale, t } = useLocale();
  const [index, setIndex] = useState(0);
  const [cameraLog, setCameraLog] = useState(objLogs[0]);
  const [vh, setVh] = useState(700);
  const [copied, setCopied] = useState(false);

  const animRaf = useRef<number | null>(null);
  const focal = SCALE_OBJECTS[index];

  /* Track viewport height for render cap. */
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Smooth camera animation toward objLogs[index]. */
  useEffect(() => {
    const target = objLogs[index];
    const start = cameraLog;
    if (Math.abs(target - start) < 1e-6) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = clamp((now - t0) / ANIM_MS, 0, 1);
      const eased = easeOutCubic(p);
      setCameraLog(start + (target - start) * eased);
      if (p < 1) animRaf.current = requestAnimationFrame(tick);
      else animRaf.current = null;
    };
    if (animRaf.current) cancelAnimationFrame(animRaf.current);
    animRaf.current = requestAnimationFrame(tick);
    return () => {
      if (animRaf.current) cancelAnimationFrame(animRaf.current);
      animRaf.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goto = useCallback((next: number) => {
    setIndex(clamp(next, 0, SCALE_OBJECTS.length - 1));
  }, []);
  const next = useCallback(() => goto(index + 1), [goto, index]);
  const prev = useCallback(() => goto(index - 1), [goto, index]);

  /* Keyboard pagination. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") goto(0);
      else if (e.key === "End") goto(SCALE_OBJECTS.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goto, next, prev]);

  /* Wheel pagination — debounced, snaps one object per click. */
  const wheelLockRef = useRef(false);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaY + e.deltaX;
      if (Math.abs(dy) < 8) return;
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 380);
      if (dy > 0) next();
      else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  /* Touch pagination. */
  const touchStartXRef = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  };

  const visible = useMemo(() => {
    return SCALE_OBJECTS.map((obj, i) => {
      const delta = objLogs[i] - cameraLog;
      return { obj, i, delta };
    }).filter(
      (e) =>
        e.delta >= VISIBLE_DELTA_MIN - 0.2 &&
        e.delta <= VISIBLE_DELTA_MAX + 0.2,
    );
  }, [cameraLog]);

  const RENDER_PX_CAP = vh * 0.92;
  const FOCAL_HALF = FOCAL_PX / 2;
  const RIGHT_GUTTER = 90;

  const onShare = async () => {
    const text = t(
      `${focal.name} 크기를 봤어요 (${focal.size}) → nolza.fun/games/scale`,
      `Saw ${focal.en} (${focal.size}) → nolza.fun/games/scale`,
    );
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      style={{
        position: "relative",
        height: "calc(100svh - clamp(64px, 8vw, 72px))",
        minHeight: "min(520px, calc(100svh - 64px))",
        background: "#faf6e8",
        color: "#2a2620",
        fontFamily: "var(--font-noto-serif-kr), serif",
        overflow: "hidden",
        touchAction: "pan-y",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Notebook ruled paper lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 38px, rgba(85,60,40,0.10) 38px, rgba(85,60,40,0.10) 39px)",
          pointerEvents: "none",
        }}
      />

      {/* Header — title + subtitle */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: "0 24px",
          zIndex: 12,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: "clamp(28px, 4.4vw, 44px)",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: "#2a2620",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {locale === "ko" ? focal.name : focal.en}
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 720,
            fontSize: "clamp(14px, 1.4vw, 17px)",
            color: "#5a4f44",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {locale === "ko" ? focal.desc : focal.descEn}
        </p>
      </div>

      {/* Top-right share */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          display: "flex",
          gap: 8,
          zIndex: 14,
        }}
      >
        <button
          type="button"
          onClick={onShare}
          aria-label={t("공유", "Share")}
          style={toolButtonStyle}
        >
          {copied ? "✓" : "⌗"}
        </button>
      </div>

      {/* Stage — objects sit on a baseline at proper relative pixel sizes */}
      <section
        aria-label={t("스케일 비교", "Scale comparison")}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        {/* Baseline */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "16%",
            height: 1,
            background:
              "linear-gradient(to right, transparent 0%, rgba(85,60,40,0.16) 18%, rgba(85,60,40,0.16) 82%, transparent 100%)",
            zIndex: 4,
          }}
        />

        {visible.map(({ obj, i, delta }) => {
          const idealPx = FOCAL_PX * Math.pow(10, delta);
          const px = Math.min(idealPx, RENDER_PX_CAP);
          const isFocal = i === index;
          const isDot = idealPx < 2;
          const opacity = fadeOpacity(delta);

          let x: number;
          if (delta <= 0) {
            x = delta * X_SPACING_NEG;
          } else {
            x = FOCAL_HALF + RIGHT_GUTTER + px / 2;
          }

          const z = isFocal ? 200 : Math.round(120 - Math.abs(delta) * 20);

          if (isDot) {
            return (
              <div
                key={obj.emoji}
                aria-hidden
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px)`,
                  bottom: "16%",
                  width: 5,
                  height: 5,
                  marginLeft: -2.5,
                  marginBottom: -2.5,
                  borderRadius: "50%",
                  background: "#3a2e22",
                  opacity,
                  zIndex: z,
                  transition: "opacity 0.25s linear",
                }}
              />
            );
          }

          return (
            <ArtCard
              key={obj.emoji}
              obj={obj}
              px={px}
              x={x}
              z={z}
              opacity={opacity}
              isFocal={isFocal}
              showMeasure={isFocal}
              locale={locale}
            />
          );
        })}
      </section>

      {/* Prev / next arrows */}
      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label={t("이전", "Previous")}
        style={{ ...arrowStyle, left: 28 }}
      >
        ←
      </button>
      <button
        type="button"
        onClick={next}
        disabled={index >= SCALE_OBJECTS.length - 1}
        aria-label={t("다음", "Next")}
        style={{ ...arrowStyle, right: 28 }}
      >
        →
      </button>

      {/* Bottom: progress dots + counter */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          zIndex: 12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 5,
            maxWidth: "min(540px, 88vw)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {SCALE_OBJECTS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === index ? 7 : 5,
                height: i === index ? 7 : 5,
                borderRadius: "50%",
                background: i <= index ? "#2a2620" : "rgba(85,60,40,0.22)",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            color: "#8b7e6e",
            letterSpacing: "0.18em",
          }}
        >
          {index + 1} / {SCALE_OBJECTS.length}
        </div>
      </div>

      {/* Twemoji attribution (CC BY 4.0) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 24,
          bottom: 18,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 13,
          color: "rgba(58,46,34,0.4)",
          letterSpacing: "0.08em",
          pointerEvents: "none",
          zIndex: 11,
        }}
      >
        Art: Twemoji · CC BY 4.0
      </div>

      <AdMobileSticky />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Object card — SVG art + measurement annotation                            */
/* -------------------------------------------------------------------------- */

function ArtCard({
  obj,
  px,
  x,
  z,
  opacity,
  isFocal,
  showMeasure,
  locale,
}: {
  obj: ScaleObj;
  px: number;
  x: number;
  z: number;
  opacity: number;
  isFocal: boolean;
  showMeasure: boolean;
  locale: SimpleLocale;
}) {
  const measureLabel = (() => {
    const m = obj.measure;
    if (locale === "ko") {
      const ko: Record<typeof obj.measure, string> = {
        TALL: `${obj.size} 높이`,
        WIDE: `${obj.size} 너비`,
        DIAMETER: `${obj.size} 지름`,
        ACROSS: `${obj.size}`,
      };
      return ko[m];
    }
    return `${obj.size} ${m}`;
  })();

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        bottom: "16%",
        width: px,
        height: px,
        marginLeft: -px / 2,
        opacity,
        zIndex: z,
        transition:
          "opacity 0.25s linear, left 0.45s cubic-bezier(0.22,1,0.36,1), width 0.45s cubic-bezier(0.22,1,0.36,1), height 0.45s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }}
    >
      {/* Twemoji illustration — transparent, consistent style across all 21 items */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Art emoji={obj.emoji} alt={obj.name} />
      </div>

      {/* Soft cast shadow on the baseline */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          bottom: -10,
          transform: "translateX(-50%)",
          width: px * 0.7,
          height: 10,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(58,46,34,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Measurement annotation — vertical bracket on the right with rotated label */}
      {showMeasure && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: -34,
            width: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <svg
            width="14"
            height="100%"
            viewBox="0 0 14 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, margin: "auto", height: "100%" }}
          >
            <line x1="7" y1="2" x2="7" y2="98" stroke="rgba(58,46,34,0.55)" strokeWidth="1" />
            <line x1="2" y1="2" x2="12" y2="2" stroke="rgba(58,46,34,0.55)" strokeWidth="1" />
            <line x1="2" y1="98" x2="12" y2="98" stroke="rgba(58,46,34,0.55)" strokeWidth="1" />
          </svg>
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%) rotate(90deg)",
              transformOrigin: "center",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: "#3a2e22",
              background: "#faf6e8",
              padding: "2px 10px",
            }}
          >
            {measureLabel.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reused button styles                                                      */
/* -------------------------------------------------------------------------- */

const arrowStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "50%",
  transform: "translateY(50%)",
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: "1px solid rgba(58,46,34,0.30)",
  background: "rgba(255,250,235,0.85)",
  color: "#2a2620",
  fontSize: 22,
  fontWeight: 500,
  cursor: "pointer",
  zIndex: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.15s ease, background 0.15s ease",
  boxShadow: "0 6px 16px -6px rgba(58,46,34,0.25)",
};

const toolButtonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1px solid rgba(58,46,34,0.30)",
  background: "rgba(255,250,235,0.85)",
  color: "#2a2620",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 10px -4px rgba(58,46,34,0.25)",
};
