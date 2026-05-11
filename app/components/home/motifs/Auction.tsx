import type { Skin } from "@/lib/games-home";

export default function AuctionMotif({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 12 12" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="3" y="2" width="6" height="2" fill="var(--skin-pixel-accent)" />
        <rect x="5" y="4" width="2" height="6" fill="var(--skin-pixel-fg)" />
        <rect x="2" y="10" width="8" height="2" fill="var(--skin-pixel-fg)" />
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
      <rect x="30" y="18" width="40" height="14" rx="2" transform="rotate(-12 50 25)" />
      <line x1="50" y1="32" x2="50" y2="74" transform="rotate(-12 50 53)" />
      <rect x="20" y="78" width="60" height="6" />
      <line x1="14" y1="84" x2="86" y2="84" />
    </svg>
  );
}
