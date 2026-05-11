import type { Skin } from "@/lib/games-home";

export default function IjyMotif({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 12 12" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="2" y="3" width="8" height="6" fill="var(--skin-pixel-accent)" />
        <rect x="4" y="5" width="4" height="2" fill="var(--skin-pixel-bg)" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="20" y="32" width="60" height="38" rx="2" />
      <circle cx="50" cy="51" r="10" />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-noto-serif-kr), serif"
        fontWeight="700"
        fontSize="12"
        fill="currentColor"
        stroke="none"
      >
        ₩
      </text>
    </svg>
  );
}
