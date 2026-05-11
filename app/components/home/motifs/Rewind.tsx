import type { Skin } from "@/lib/games-home";

export default function RewindMotif({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 12 12" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="2" y="3" width="2" height="6" fill="var(--skin-pixel-fg)" />
        <rect x="4" y="4" width="2" height="4" fill="var(--skin-pixel-fg)" />
        <rect x="6" y="5" width="2" height="2" fill="var(--skin-pixel-accent)" />
        <rect x="8" y="3" width="2" height="6" fill="var(--skin-pixel-fg)" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="48,30 22,50 48,70" />
      <polygon points="80,30 54,50 80,70" />
    </svg>
  );
}
