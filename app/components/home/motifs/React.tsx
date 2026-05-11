import type { Skin } from "@/lib/games-home";

export default function ReactMotif({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 12 12" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="4" y="1" width="4" height="2" fill="var(--skin-pixel-fg)" />
        <rect x="3" y="3" width="6" height="6" fill="#6BCB77" />
        <rect x="5" y="5" width="2" height="2" fill="var(--skin-pixel-bg)" />
        <rect x="4" y="9" width="4" height="2" fill="var(--skin-pixel-fg)" />
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
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}
