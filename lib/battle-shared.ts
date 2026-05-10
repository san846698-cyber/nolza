// Shared types used by the battle-what-if game family.
// Each battle (hannibal, red-cliffs, hansando, waterloo, midway) has its own
// data file in lib/<battle>.ts that imports these types and exports the
// battle-specific dilemmas + archetypes + helpers.

export type LocalizedString = { ko: string; en: string };

// Four command-style axes shared across all battles.
export type Axis = "AGG" | "CAU" | "DIP" | "INT";
// AGG = aggression, CAU = caution, DIP = diplomacy, INT = intuition

export interface AxisTag {
  axis: Axis;
  weight: number; // -2..+2
}

export const AXIS_LABEL: Record<Axis, LocalizedString> = {
  AGG: { ko: "공격성", en: "Aggression" },
  CAU: { ko: "신중함", en: "Caution" },
  DIP: { ko: "외교", en: "Diplomacy" },
  INT: { ko: "직관", en: "Intuition" },
};

export const AXIS_DESC: Record<Axis, LocalizedString> = {
  AGG: {
    ko: "결전을 강요하고 정면으로 부수려는 손",
    en: "Forces the decisive battle and breaks frontally",
  },
  CAU: {
    ko: "시간을 벌고 적의 약점을 기다리는 손",
    en: "Buys time and waits for the enemy's weakness",
  },
  DIP: {
    ko: "동맹·협상·정치로 결판을 보려는 손",
    en: "Settles by alliance, negotiation, and politics",
  },
  INT: {
    ko: "현장의 공기를 읽고 절차를 깨는 손",
    en: "Reads the moment and breaks established procedure",
  },
};

export interface BriefingItem {
  label: LocalizedString;
  value: LocalizedString;
}

export interface Choice {
  id: string;
  label: LocalizedString;
  reasoning?: LocalizedString;
  tags: AxisTag[];
  /** Brief scholar-grounded note on what would have followed this choice. */
  shadowOutcome: LocalizedString;
  /** What choosing this reveals about the user's command style / personality. */
  judgment: LocalizedString;
  /** True if this matches what the historical commander actually did. */
  isCommanderChoice?: boolean;
}

export interface Dilemma {
  id: string;
  index: number;
  era: LocalizedString;
  location: LocalizedString;
  scene: LocalizedString;
  briefing: BriefingItem[];
  prompt: LocalizedString;
  choices: Choice[];
  /** Narrative of what the historical commander actually did + primary source citation. */
  commanderActual: LocalizedString;
  /** Sources & scholarship footer for this single dilemma. */
  sources: LocalizedString;
}

export interface Archetype {
  id: string;
  name: LocalizedString;
  /** One-line punchy phrase used on the share / OG card. */
  signature: LocalizedString;
  desc: LocalizedString;
  /** 2–3 short bullet phrases — what this hand does well. */
  strengths: LocalizedString[];
  /** 2–3 short bullet phrases — failure modes. */
  watchOut: LocalizedString[];
  /** Archetype id of a complementary commander (different archetype). */
  pairsWithId: string;
  /** Archetype id of a commander whose hand fights yours. */
  clashesWithId: string;
  profile: Record<Axis, number>;
}

export interface EvalResult {
  scores: Record<Axis, number>;
  archetype: Archetype;
  /** How many of the user's picks matched the historical commander's actual choice. */
  commanderMatchCount: number;
}

export function emptyScores(): Record<Axis, number> {
  return { AGG: 0, CAU: 0, DIP: 0, INT: 0 };
}

/**
 * Match a vector of axis scores to the closest archetype profile (L2 distance,
 * after normalizing the user's vector to the same scale as the profiles).
 * Battle-specific evaluate() helpers wrap this so they can also compute the
 * commander match count from their own dilemma list.
 */
export function matchArchetype(
  scores: Record<Axis, number>,
  archetypes: Archetype[],
): Archetype {
  const max = Math.max(1, ...Object.values(scores).map((v) => Math.abs(v)));
  const norm: Record<Axis, number> = {
    AGG: (scores.AGG / max) * 2,
    CAU: (scores.CAU / max) * 2,
    DIP: (scores.DIP / max) * 2,
    INT: (scores.INT / max) * 2,
  };
  let best = archetypes[0];
  let bestDist = Infinity;
  for (const arch of archetypes) {
    const dx = norm.AGG - arch.profile.AGG;
    const dy = norm.CAU - arch.profile.CAU;
    const dz = norm.DIP - arch.profile.DIP;
    const dw = norm.INT - arch.profile.INT;
    const dist = dx * dx + dy * dy + dz * dz + dw * dw;
    if (dist < bestDist) {
      bestDist = dist;
      best = arch;
    }
  }
  return best;
}

/**
 * Evaluate user picks against a dilemma list & archetype list.
 * Returns scores, the matched archetype, and the commander-match count.
 */
export function evaluatePicks(
  picks: Record<string, string>,
  dilemmas: Dilemma[],
  archetypes: Archetype[],
): EvalResult {
  const scores = emptyScores();
  let commanderMatchCount = 0;
  for (const dilemma of dilemmas) {
    const pickId = picks[dilemma.id];
    const choice = dilemma.choices.find((c) => c.id === pickId);
    if (!choice) continue;
    for (const tag of choice.tags) {
      scores[tag.axis] = (scores[tag.axis] ?? 0) + tag.weight;
    }
    if (choice.isCommanderChoice) commanderMatchCount += 1;
  }
  const archetype = matchArchetype(scores, archetypes);
  return { scores, archetype, commanderMatchCount };
}

/**
 * Encode picks as a compact ?p= query — one digit per dilemma (choice index 0-3).
 * Length always equals dilemmas.length when fully complete.
 */
export function encodePicksFor(
  picks: Record<string, string>,
  dilemmas: Dilemma[],
): string {
  return dilemmas
    .map((d) => {
      const id = picks[d.id];
      const idx = d.choices.findIndex((c) => c.id === id);
      return idx >= 0 ? String(idx) : "x";
    })
    .join("");
}

/**
 * Decode a ?p= string against a dilemma list. Returns null if malformed
 * or any digit is out of range.
 */
export function decodePicksFor(
  p: string | null | undefined,
  dilemmas: Dilemma[],
): Record<string, string> | null {
  if (!p) return null;
  if (p.length !== dilemmas.length) return null;
  const out: Record<string, string> = {};
  for (let i = 0; i < dilemmas.length; i++) {
    const d = dilemmas[i];
    const ch = p[i];
    const idx = ch >= "0" && ch <= "9" ? Number(ch) : -1;
    if (idx < 0 || idx >= d.choices.length) return null;
    out[d.id] = d.choices[idx].id;
  }
  return out;
}
