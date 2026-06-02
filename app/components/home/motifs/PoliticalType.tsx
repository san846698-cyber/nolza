import type { Skin } from "@/lib/games-home";

export default function PoliticalTypeMotif({ skin }: { skin: Skin }) {
  const strokeWidth = skin === "mono" ? 1.2 : 1.6;

  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="political-spectrum-card" x1="24" x2="136" y1="82" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="0.5" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="political-map-card" x1="42" x2="120" y1="14" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dbeafe" />
          <stop offset="0.48" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#fee2e2" />
        </linearGradient>
      </defs>
      <rect x="18" y="10" width="124" height="80" rx="12" fill="rgba(255,255,255,.78)" />
      <rect x="34" y="18" width="92" height="58" rx="9" fill="url(#political-map-card)" stroke="currentColor" strokeWidth="1.1" opacity="0.98" />
      <path
        d="M80 18V76M34 47H126M49 18V76M111 18V76M34 32H126M34 62H126"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        opacity="0.2"
      />
      <path d="M80 18V76M34 47H126" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" opacity="0.42" />
      <text x="80" y="15" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="900" opacity="0.68">ORDER</text>
      <text x="80" y="83" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="900" opacity="0.62">FREEDOM</text>
      <text x="24" y="50" textAnchor="middle" fill="#2563eb" fontSize="6" fontWeight="900" opacity="0.82">L</text>
      <text x="136" y="50" textAnchor="middle" fill="#dc2626" fontSize="6" fontWeight="900" opacity="0.82">R</text>
      <circle cx="72" cy="54" r="7.5" fill="#111827" stroke="white" strokeWidth="3" />
      <path
        d="M26 84H134"
        stroke="url(#political-spectrum-card)"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M38 84H122"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
        strokeDasharray="1 7"
        opacity="0.2"
      />
      <circle cx="72" cy="84" r="4.4" fill="#111827" stroke="white" strokeWidth="2" />
      <circle cx="25" cy="18" r="4" fill="#2563eb" opacity="0.75" />
      <circle cx="137" cy="86" r="4" fill="#dc2626" opacity="0.75" />
    </svg>
  );
}
