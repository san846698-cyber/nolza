import type { ReactElement } from "react";

// 직접 그린 유니폼 SVG (국가별 색·패턴 + 등번호 + 가슴 국기 패치).
// 실제 킷 디자인/협회 엠블럼/스폰서·제조사 로고는 일절 사용하지 않는다 → 저작권·상표 안전.
// 음영·옷깃·소매 디테일은 색에 무관한 반투명 오버레이로 처리 → 어떤 킷 컬러에도 자연스럽게 적용.
const JERSEY_PATH =
  "M44 12 C44 12 50 22 60 22 C70 22 76 12 76 12 L104 24 L96 50 L84 45 L84 110 C84 113 82 115 79 115 L41 115 C38 115 36 113 36 110 L36 45 L24 50 L16 24 Z";

// 옷깃(네크라인) 곡선 — 바디와 공유.
const NECK = "M44 12 C44 12 50 22 60 22 C70 22 76 12 76 12";

type Pattern = "stripes" | "check";
type Kit = { base: string; trim: string; ink: string; pattern?: Pattern; patternColor?: string };

// 국가별 대표팀 컬러/패턴 (대략적).
const KIT: Record<string, Kit> = {
  kr: { base: "#E0383E", trim: "#ffffff", ink: "#ffffff" },
  de: { base: "#f2f2f2", trim: "#1a1a1a", ink: "#111111" },
  be: { base: "#C8102E", trim: "#FDDA24", ink: "#ffffff" },
  ar: { base: "#eef4fb", trim: "#75AADB", ink: "#10243B", pattern: "stripes", patternColor: "#75AADB" },
  br: { base: "#FFDF00", trim: "#009C3B", ink: "#0a7d36" },
  it: { base: "#1B4BA0", trim: "#ffffff", ink: "#ffffff" },
  nl: { base: "#EC6A1A", trim: "#ffffff", ink: "#ffffff" },
  pt: { base: "#9E1B32", trim: "#0C7A3D", ink: "#ffffff" },
  es: { base: "#C60B1E", trim: "#FCD116", ink: "#ffffff" },
  at: { base: "#EF3340", trim: "#ffffff", ink: "#ffffff" },
  fr: { base: "#1B2A6B", trim: "#ffffff", ink: "#ffffff" },
  ca: { base: "#D52B1E", trim: "#ffffff", ink: "#ffffff" },
  eng: { base: "#f2f2f2", trim: "#CF142B", ink: "#1B2A6B" },
  hr: { base: "#ffffff", trim: "#C8102E", ink: "#10243B", pattern: "check", patternColor: "#D32F2F" },
  pl: { base: "#f4f7fb", trim: "#DC143C", ink: "#DC143C" },
  no: { base: "#C8102E", trim: "#ffffff", ink: "#ffffff" },
};

const GK_KIT: Kit = { base: "#1FA67A", trim: "#0a2a20", ink: "#ffffff" };
const FALLBACK: Kit = { base: "#2b3a52", trim: "#ffffff", ink: "#ffffff" };

// ink 명도로 등번호 외곽선(헤일로) 색 결정 — 패턴/단색 어디서나 또렷하게.
function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140;
}

export default function JerseyMark({
  flag,
  jersey,
  name,
  isGk = false,
}: {
  flag: string;
  jersey?: string;
  name: string;
  isGk?: boolean;
}): ReactElement {
  const c = isGk ? GK_KIT : KIT[flag] ?? FALLBACK;
  const uid = `${flag}-${jersey ?? "x"}${isGk ? "-gk" : ""}`;
  const id = (n: string) => `${n}-${uid}`;
  // 외곽선(헤일로): 패턴 킷은 ink 명도 기준(네이비 번호 + 흰 헤일로), 단색 킷은 바탕 명도 기준
  // (밝은 셔츠 → 어두운 헤일로, 어두운 셔츠 → 밝은 헤일로)으로 번호를 바탕에서 또렷하게 분리.
  const halo = c.pattern
    ? isLight(c.ink)
      ? "rgba(0,0,0,0.32)"
      : "rgba(255,255,255,0.58)"
    : isLight(c.base)
      ? "rgba(0,0,0,0.34)"
      : "rgba(255,255,255,0.55)";

  return (
    <svg className="fb-jersey" viewBox="0 0 120 124" role="img" aria-label={name}>
      <defs>
        <clipPath id={id("body")}>
          <path d={JERSEY_PATH} />
        </clipPath>
        <clipPath id={id("patch")}>
          <rect x="42" y="33" width="16" height="11" rx="2.5" />
        </clipPath>
        {/* 입체감: 상단 하이라이트 → 하단 음영 (색 무관) */}
        <linearGradient id={id("vol")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="75%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.34" />
        </linearGradient>
        {/* 가운데 접힘 음영 */}
        <linearGradient id={id("crease")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="42%" stopColor="#000000" stopOpacity="0" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="58%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        {c.pattern === "check" ? (
          <pattern id={id("check")} width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#ffffff" />
            <rect width="8" height="8" fill={c.patternColor} />
            <rect x="8" y="8" width="8" height="8" fill={c.patternColor} />
          </pattern>
        ) : null}
        <filter id={id("numsh")} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.7" floodColor="#000000" floodOpacity="0.45" />
        </filter>
        <filter id={id("patchsh")} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="0.8" stdDeviation="0.9" floodColor="#000000" floodOpacity="0.42" />
        </filter>
      </defs>

      {/* ── 바디 채움 (클립) ── */}
      <g clipPath={`url(#${id("body")})`}>
        {c.pattern === "check" ? (
          <rect x="0" y="0" width="120" height="124" fill={`url(#${id("check")})`} />
        ) : (
          <>
            <rect x="0" y="0" width="120" height="124" fill={c.base} />
            {c.pattern === "stripes"
              ? [16, 36, 56, 76, 96].map((x) => (
                  <rect key={x} x={x} y="0" width="10" height="124" fill={c.patternColor} />
                ))
              : null}
          </>
        )}
        {/* 소매 음영 (팔 분리) */}
        <polygon points="84,22 104,24 96,50 84,45" fill="#000000" fillOpacity="0.15" />
        <polygon points="36,22 16,24 24,50 36,45" fill="#000000" fillOpacity="0.15" />
        {/* 입체 + 접힘 */}
        <rect x="0" y="0" width="120" height="124" fill={`url(#${id("vol")})`} />
        <rect x="0" y="0" width="120" height="124" fill={`url(#${id("crease")})`} />
      </g>

      {/* ── 또렷한 외곽선 ── */}
      <path d={JERSEY_PATH} fill="none" stroke="rgba(0,0,0,0.30)" strokeWidth="1.5" />

      {/* ── 옷깃 + 플래킷 + 소매 커프 (클립) ── */}
      <g clipPath={`url(#${id("body")})`}>
        {/* 옷깃: 접힘 음영 → 트림 → 안쪽 음영선 */}
        <path d={NECK} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="7" strokeLinecap="round" />
        <path d={NECK} fill="none" stroke={c.trim} strokeWidth="5" strokeLinecap="round" />
        <path d={NECK} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="60" y1="22" x2="60" y2="34" stroke={c.trim} strokeWidth="1.6" strokeLinecap="round" opacity="0.92" />
        {/* 소매 커프: 솔기 그림자 → 트림 */}
        <line x1="101" y1="26" x2="93.5" y2="49" stroke="rgba(0,0,0,0.2)" strokeWidth="4.6" strokeLinecap="round" />
        <line x1="101" y1="26" x2="93.5" y2="49" stroke={c.trim} strokeWidth="3.2" strokeLinecap="round" />
        <line x1="19" y1="26" x2="26.5" y2="49" stroke="rgba(0,0,0,0.2)" strokeWidth="4.6" strokeLinecap="round" />
        <line x1="19" y1="26" x2="26.5" y2="49" stroke={c.trim} strokeWidth="3.2" strokeLinecap="round" />
      </g>

      {/* ── 가슴 국기 패치 ── */}
      <g filter={`url(#${id("patchsh")})`}>
        <rect x="42" y="33" width="16" height="11" rx="2.5" fill="#ffffff" />
        <image
          href={`/images/flags/${flag}.svg`}
          x="42"
          y="33"
          width="16"
          height="11"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id("patch")})`}
        />
        <rect x="42" y="33" width="16" height="11" rx="2.5" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
      </g>

      {/* ── 등번호 ── */}
      {jersey ? (
        <text
          x="60"
          y="89"
          textAnchor="middle"
          fontSize="46"
          fontWeight="900"
          letterSpacing="-1"
          fill={c.ink}
          stroke={halo}
          strokeWidth="3"
          paintOrder="stroke"
          strokeLinejoin="round"
          filter={`url(#${id("numsh")})`}
        >
          {jersey}
        </text>
      ) : null}
    </svg>
  );
}
