import type { Skin } from "@/lib/games-home";

export default function KbtiMotif({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 12 12" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="2" y="3" width="3" height="6" fill="var(--skin-pixel-fg)" />
        <rect x="7" y="3" width="3" height="6" fill="var(--skin-pixel-accent)" />
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
    >
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="var(--font-noto-serif-kr), serif"
        fontWeight="700"
        fontSize="34"
        fill="currentColor"
        stroke="none"
      >
        K
      </text>
      <circle cx="50" cy="50" r="38" />
    </svg>
  );
}
