import type { Skin } from "@/lib/games-home";

export default function ScaleMotif({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 12 12" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="5" y="2" width="2" height="2" fill="var(--skin-pixel-accent)" />
        <rect x="1" y="6" width="4" height="2" fill="var(--skin-pixel-fg)" />
        <rect x="7" y="6" width="4" height="2" fill="var(--skin-pixel-fg)" />
        <rect x="5" y="4" width="2" height="6" fill="var(--skin-pixel-fg)" />
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
      <line x1="50" y1="20" x2="50" y2="80" />
      <line x1="20" y1="40" x2="80" y2="40" />
      <circle cx="25" cy="55" r="10" />
      <circle cx="75" cy="55" r="14" />
      <rect x="44" y="78" width="12" height="4" />
    </svg>
  );
}
