// Asteroid impact physics — simplified from Collins, Melosh & Marcus (2005),
// "Earth Impact Effects Program: A Web-based computer program for calculating
//  the regional environmental consequences of a meteoroid impact on Earth."
//
// We don't claim research-grade accuracy — this is a game. Numbers should be
// in the right order of magnitude.

export type Composition = "iron" | "stone" | "carbon" | "gold" | "comet";

// Wikimedia Commons hot-link via Special:FilePath. All public domain (NASA / ESO).
const wmImg = (filename: string, width = 700) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`;

export const COMPOSITIONS: Record<
  Composition,
  {
    ko: string;
    en: string;
    density: number;
    emoji: string;
    image: string;
    /** Real-world body the photo depicts — shown as caption */
    body: { ko: string; en: string };
    credit: string;
  }
> = {
  iron: {
    ko: "철", en: "Iron", density: 8000, emoji: "⚙️",
    image: wmImg("Psyche_asteroid_%28Artist%27s_Concept%29_%284%29.jpg"),
    body: { ko: "16 프시케 (NASA 컨셉 이미지)", en: "16 Psyche (NASA concept art)" },
    credit: "Image: NASA/JPL-Caltech (public domain)",
  },
  stone: {
    ko: "암석", en: "Stone", density: 3000, emoji: "🪨",
    image: wmImg("Eros_-_PIA02923_(color).jpg"),
    body: { ko: "433 에로스 (NEAR 슈메이커 촬영)", en: "433 Eros (NEAR Shoemaker)" },
    credit: "Photo: NASA / JHUAPL (public domain)",
  },
  carbon: {
    ko: "탄소", en: "Carbon", density: 2200, emoji: "🌑",
    image: wmImg("BennuAsteroid.jpg"),
    body: { ko: "101955 베누 (OSIRIS-REx 촬영)", en: "101955 Bennu (OSIRIS-REx)" },
    credit: "Photo: NASA / GSFC / U. Arizona (public domain)",
  },
  gold: {
    ko: "금", en: "Gold", density: 19300, emoji: "🟡",
    image: wmImg("Vesta_as_seen_with_the_Dawn_spacecraft_(ann14003b).jpg"),
    body: { ko: "4 베스타 (Dawn 탐사선)", en: "4 Vesta (Dawn spacecraft)" },
    credit: "Photo: NASA/JPL-Caltech / Wikimedia (public domain)",
  },
  comet: {
    ko: "혜성", en: "Comet", density: 600, emoji: "☄️",
    image: wmImg("Hartley2_by_Deep_Impact_closeup500747main_-full_full.jpg"),
    body: { ko: "103P/하틀리 2 혜성 (Deep Impact 근접촬영)", en: "103P/Hartley 2 (Deep Impact close-up)" },
    credit: "Photo: NASA / JPL / UMD (public domain)",
  },
};

const G = 9.81;            // gravity (m/s²)
const RHO_TARGET = 2500;   // crust density (kg/m³) — sedimentary average

const TNT_PER_JOULE = 1 / 4.184e9; // 1 ton TNT = 4.184e9 J
const HIROSHIMA_KT = 15;            // approximate Little Boy yield in kt TNT

export type ImpactInputs = {
  diameterM: number;        // projectile diameter, meters (1 .. 10000)
  velocityKmS: number;      // impact velocity, km/s (11 .. 72)
  angleDeg: number;         // entry angle from horizontal, degrees (15 .. 90)
  composition: Composition;
};

export type ImpactResult = {
  // Inputs echoed
  inputs: ImpactInputs;

  // Energy
  energyJ: number;          // joules
  yieldKtTNT: number;       // kilotons TNT
  hiroshimas: number;       // multiples of Hiroshima yield

  // Effects (radii in meters from ground zero)
  craterDiameterM: number;
  fireballRadiusM: number;
  shockwaveSeriousRadiusM: number;   // ~5 psi: collapses most buildings
  shockwaveLightRadiusM: number;     // ~1 psi: window shatter
  thermalBurnRadiusM: number;        // 3rd-degree burns
  windRadiusM: number;               // hurricane-force winds (>~120 mph)
  earthquakeMagnitude: number;       // Richter equivalent

  // Probabilistic / atmosphere
  airburst: boolean;        // true if disrupts in atmosphere before ground impact
};

export function computeImpact(inputs: ImpactInputs): ImpactResult {
  const { diameterM, velocityKmS, angleDeg, composition } = inputs;
  const v = velocityKmS * 1000; // m/s
  const angleRad = (angleDeg * Math.PI) / 180;
  const r = diameterM / 2;
  const volume = (4 / 3) * Math.PI * r ** 3;
  const rho = COMPOSITIONS[composition].density;
  const mass = rho * volume;

  // Kinetic energy
  const energyJ = 0.5 * mass * v * v;
  const yieldKtTNT = (energyJ * TNT_PER_JOULE) / 1000;
  const hiroshimas = yieldKtTNT / HIROSHIMA_KT;

  // Airburst: small/loose bodies entering shallow tend to disrupt before impact.
  // Crude rule: stone/carbon/comet under 50m at <60° → airburst.
  const fragile = composition === "stone" || composition === "carbon" || composition === "comet";
  const airburst = fragile && diameterM < 50 && angleDeg < 60;

  // ─── Crater (Collins-Melosh-Marcus simplified, transient → final scaling) ───
  // D_tc = 1.161 * (rho_i/rho_t)^(1/3) * L^0.78 * v^0.44 * g^-0.22 * sin(theta)^(1/3)
  // Final crater diameter ≈ 1.25 * D_tc for simple craters
  let craterM = 0;
  if (!airburst) {
    const dtc =
      1.161 *
      Math.pow(rho / RHO_TARGET, 1 / 3) *
      Math.pow(diameterM, 0.78) *
      Math.pow(v / 1000, 0.44) *           // km/s used in original formula
      Math.pow(G, -0.22) *
      Math.pow(Math.sin(angleRad), 1 / 3);
    craterM = 1.25 * dtc;
  }

  // ─── Fireball radius ───
  // R_fireball ≈ 0.002 * E^(1/3)  (E in Joules → meters); empirical scaling
  const fireballRadiusM = 0.002 * Math.pow(energyJ, 1 / 3);

  // ─── Thermal radiation: 3rd-degree burn radius ───
  // Distance at which thermal exposure ≈ 4e5 J/m² (approx threshold)
  // R_thermal = sqrt(k * E / (4 * pi * Q_3rd))   with k ≈ 1e-3 efficiency
  const thermalBurnRadiusM = Math.sqrt((1e-3 * energyJ) / (4 * Math.PI * 4e5));

  // ─── Air-blast radii ───
  // Scaled distance Z = R / W^(1/3) (W in kt). Standard cube-root scaling.
  // Empirical thresholds: 5 psi at Z≈4.6 (m/kt^1/3), 1 psi at Z≈10
  const W3 = Math.pow(yieldKtTNT, 1 / 3);
  const shockwaveSeriousRadiusM = 4.6 * W3 * 1000; // 5 psi
  const shockwaveLightRadiusM = 10 * W3 * 1000;    // 1 psi

  // ─── Wind: hurricane-force (>~50 m/s) radius ────
  // Roughly the 2 psi contour. Z ≈ 6.5
  const windRadiusM = 6.5 * W3 * 1000;

  // ─── Seismic: Richter magnitude from kinetic energy ───
  // M = 0.67 * log10(E) - 5.87  (Schultz & Gault 1975 equivalent)
  const earthquakeMagnitude = 0.67 * Math.log10(energyJ) - 5.87;

  return {
    inputs,
    energyJ,
    yieldKtTNT,
    hiroshimas,
    craterDiameterM: craterM,
    fireballRadiusM,
    shockwaveSeriousRadiusM,
    shockwaveLightRadiusM,
    thermalBurnRadiusM,
    windRadiusM,
    earthquakeMagnitude: Math.max(0, earthquakeMagnitude),
    airburst,
  };
}

// ─── Formatters ───
export function formatDistance(m: number, locale: "ko" | "en"): string {
  if (m >= 1_000_000) {
    const km = m / 1000;
    return locale === "ko"
      ? `${km.toLocaleString("ko-KR", { maximumFractionDigits: 0 })} km`
      : `${km.toLocaleString("en-US", { maximumFractionDigits: 0 })} km`;
  }
  if (m >= 1000) {
    const km = m / 1000;
    return locale === "ko"
      ? `${km.toFixed(km >= 100 ? 0 : km >= 10 ? 1 : 2)} km`
      : `${km.toFixed(km >= 100 ? 0 : km >= 10 ? 1 : 2)} km`;
  }
  return `${m.toFixed(0)} m`;
}

export function formatYield(ktTNT: number, locale: "ko" | "en"): string {
  if (ktTNT >= 1_000_000) {
    const gigatons = ktTNT / 1_000_000;
    return locale === "ko"
      ? `${gigatons.toFixed(1)} 기가톤 TNT`
      : `${gigatons.toFixed(1)} Gt TNT`;
  }
  if (ktTNT >= 1000) {
    const mt = ktTNT / 1000;
    return locale === "ko" ? `${mt.toFixed(1)} 메가톤 TNT` : `${mt.toFixed(1)} Mt TNT`;
  }
  if (ktTNT >= 1) {
    return locale === "ko"
      ? `${ktTNT.toFixed(1)} 킬로톤 TNT`
      : `${ktTNT.toFixed(1)} kt TNT`;
  }
  const tons = ktTNT * 1000;
  return locale === "ko" ? `${tons.toFixed(0)} 톤 TNT` : `${tons.toFixed(0)} t TNT`;
}

export function formatHiroshimas(n: number, locale: "ko" | "en"): string {
  if (n < 0.01) {
    return locale === "ko" ? "히로시마 폭탄보다 약함" : "weaker than Hiroshima";
  }
  if (n < 1) {
    return locale === "ko"
      ? `히로시마의 ${(n * 100).toFixed(0)}%`
      : `${(n * 100).toFixed(0)}% of Hiroshima`;
  }
  return locale === "ko"
    ? `히로시마 ${n.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}배`
    : `${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}× Hiroshima`;
}
