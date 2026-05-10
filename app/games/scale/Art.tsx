"use client";

// Each scale object renders the matching Twemoji SVG from /public/twemoji/.
// Twemoji is © Twitter/Inc. and contributors, licensed under CC BY 4.0.
// Attribution lives in the page footer.

export function Art({ emoji, alt }: { emoji: string; alt: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/twemoji/${emoji}.svg`}
      alt={alt}
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "contain",
        userSelect: "none",
      }}
    />
  );
}
