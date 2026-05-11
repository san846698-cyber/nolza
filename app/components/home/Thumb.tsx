import type { Game, Skin } from "@/lib/games-home";
import ScaleMotif from "./motifs/Scale";
import AuctionMotif from "./motifs/Auction";
import RewindMotif from "./motifs/Rewind";
import ReactMotif from "./motifs/React";
import KbtiMotif from "./motifs/Kbti";
import IjyMotif from "./motifs/Ijy";

const REGISTRY: Record<string, React.FC<{ skin: Skin }>> = {
  scale: ScaleMotif,
  auction: AuctionMotif,
  rewind: RewindMotif,
  react: ReactMotif,
  kbti: KbtiMotif,
  ijy: IjyMotif,
};

export default function Thumb({ game, skin }: { game: Game; skin: Skin }) {
  if (game.thumb) {
    return (
      <img
        src={game.thumb}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  const Motif = game.art ? REGISTRY[game.art] : undefined;
  if (Motif) return <Motif skin={skin} />;
  return <DefaultMark skin={skin} />;
}

function DefaultMark({ skin }: { skin: Skin }) {
  if (skin === "pixel") {
    return (
      <svg viewBox="0 0 10 10" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="3" y="3" width="4" height="4" fill="var(--skin-pixel-accent)" />
      </svg>
    );
  }
  if (skin === "hand") {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M20 50 Q 50 10, 80 50 T 20 50" />
      </svg>
    );
  }
  if (skin === "block") {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="28" y="28" width="44" height="44" fill="currentColor" opacity="0.85" />
      </svg>
    );
  }
  if (skin === "mono") {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
        <line x1="20" y1="42" x2="80" y2="42" strokeDasharray="3 4" />
        <line x1="20" y1="50" x2="80" y2="50" strokeDasharray="3 4" />
        <line x1="20" y1="58" x2="60" y2="58" strokeDasharray="3 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
