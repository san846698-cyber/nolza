import type { Skin } from "@/lib/games-home";

export default function PoliticalTypeMotif({ skin }: { skin: Skin }) {
  const strokeWidth = skin === "mono" ? 1.6 : 2.2;

  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="political-spectrum-card" x1="22" x2="138" y1="62" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="0.5" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <rect x="18" y="20" width="124" height="60" rx="10" fill="rgba(255,255,255,.72)" />
      <rect x="24" y="60" width="112" height="10" rx="5" fill="url(#political-spectrum-card)" />
      <circle cx="80" cy="65" r="8" fill="#111827" stroke="white" strokeWidth="3" />
      <path
        d="M34 38H86M34 48H116"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        opacity="0.72"
      />
      <path
        d="M36 76H136"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
        strokeDasharray="2 7"
        opacity="0.34"
      />
      <circle cx="24" cy="24" r="5" fill="#2563eb" opacity="0.86" />
      <circle cx="142" cy="80" r="5" fill="#dc2626" opacity="0.86" />
    </svg>
  );
}
