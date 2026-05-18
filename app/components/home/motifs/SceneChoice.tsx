import type { Skin } from "@/lib/games-home";

export default function SceneChoiceMotif({ skin }: { skin: Skin }) {
  const isPaper = skin === "paper";

  return (
    <svg viewBox="0 0 160 88" className="h-full w-full" fill="none" aria-hidden>
      <rect width="160" height="88" fill={isPaper ? "#2a211a" : "currentColor"} opacity={isPaper ? "0.08" : "0.08"} />
      <path
        d="M32 70V24c0-6 4-10 10-10h48c6 0 10 4 10 10v46"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.82"
      />
      <path
        d="M42 70V26h48v44"
        fill={isPaper ? "#f4dfb9" : "currentColor"}
        opacity={isPaper ? "0.36" : "0.18"}
      />
      <path d="M66 26v44M42 48h48" stroke="currentColor" strokeWidth="2.5" opacity="0.42" />
      <path
        d="M110 70c0-10 8-18 18-18s18 8 18 18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path d="M128 52V34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
      <path
        d="M116 34h24"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d="M22 72h118"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 9"
        opacity="0.35"
      />
    </svg>
  );
}
