"use client";

import { useState } from "react";
import type { Palette } from "@/lib/games-home";

interface ThumbProps {
  src?: string;
  alt: string;
  palette: Palette;
  no: string;
  kicker?: string;
}

export function Thumb({ src, alt, palette, no, kicker }: ThumbProps) {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: palette.bg,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  // Editorial fallback — abstract diagram in palette colors.
  // Uses a fine grid + arc + kicker so cards without thumbnails still feel
  // designed instead of empty.
  return (
    <div
      className="home-fallback-shimmer"
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(140deg, ${palette.bg} 0%, ${palette.paper} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* fine grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${palette.line} 1px, transparent 1px), linear-gradient(90deg, ${palette.line} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.45,
        }}
      />

      {/* large arc */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <circle
          cx="160"
          cy="40"
          r="120"
          fill="none"
          stroke={palette.accent}
          strokeWidth="0.6"
          opacity="0.55"
        />
        <circle
          cx="160"
          cy="40"
          r="80"
          fill="none"
          stroke={palette.accent}
          strokeWidth="0.6"
          opacity="0.35"
        />
        <line
          x1="0"
          y1="160"
          x2="200"
          y2="60"
          stroke={palette.accent}
          strokeWidth="0.4"
          opacity="0.4"
        />
      </svg>

      {/* corner inset frame */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 14,
          borderTop: `1px solid ${palette.line}`,
          borderLeft: `1px solid ${palette.line}`,
        }}
      />

      {/* kicker text — rotated, low-key */}
      {kicker && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: 18,
            transform: "rotate(-90deg) translate(50%, -50%)",
            transformOrigin: "top left",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: palette.sub,
            whiteSpace: "nowrap",
          }}
        >
          {kicker}
        </span>
      )}

      {/* large italic numeral, offset to the right so it feels composed */}
      <span
        style={{
          position: "absolute",
          right: 22,
          bottom: 14,
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 96,
          lineHeight: 1,
          color: palette.accent,
          opacity: 0.92,
          letterSpacing: "-0.04em",
        }}
      >
        {no}
      </span>

      {/* tick marks bottom */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 14,
          height: 6,
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          opacity: 0.45,
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: i % 4 === 0 ? 6 : 3,
              background: palette.sub,
            }}
          />
        ))}
      </div>
    </div>
  );
}
