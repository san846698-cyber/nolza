"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

// ============================================================
// Types
// ============================================================

type Phase =
  | "intro"
  | "rhythm"
  | "rhythmDone"
  | "pitch"
  | "pitchDone"
  | "reaction"
  | "reactionDone"
  | "charisma"
  | "result";

type PositionId =
  | "main-dancer"
  | "main-vocalist"
  | "lead-dancer"
  | "lead-vocalist"
  | "rapper"
  | "center"
  | "visual"
  | "all-rounder";

type Position = {
  id: PositionId;
  en: string;
  ko: string;
  desc: string;
  similar: string;
};

type Scores = {
  dance: number;   // 0-100, from rhythm test
  vocal: number;   // 0-100, from pitch test
  speed: number;   // 0-100, from reaction test (rapper/center)
  charisma: number;// 0-100, from charisma test (visual/center)
};

const ACCENT = "#ff2d78";
const BG = "#0d0d0d";
const TEXT = "#fff";

// ============================================================
// Position results
// ============================================================

const POSITIONS: Record<PositionId, Position> = {
  "main-dancer": {
    id: "main-dancer",
    en: "Main Dancer",
    ko: "메인댄서",
    desc: "You move with precision and power — the group's choreographic anchor. Eyes follow you when the formation shifts.",
    similar: "Like Lisa (BLACKPINK) or Kai (EXO).",
  },
  "main-vocalist": {
    id: "main-vocalist",
    en: "Main Vocalist",
    ko: "메인보컬",
    desc: "Your voice carries the chorus. Live performances depend on you to hit the climax notes.",
    similar: "Like Rosé (BLACKPINK) or Wendy (Red Velvet).",
  },
  "lead-dancer": {
    id: "lead-dancer",
    en: "Lead Dancer",
    ko: "리드댄서",
    desc: "Strong technique with versatile range. You back up the main dancer and bring energy to group choreo.",
    similar: "Like Momo (TWICE) or Yuta (NCT).",
  },
  "lead-vocalist": {
    id: "lead-vocalist",
    en: "Lead Vocalist",
    ko: "리드보컬",
    desc: "Smooth tone, reliable in the studio and live. The melodic core supporting the main vocalist.",
    similar: "Like Jisoo (BLACKPINK) or Suho (EXO).",
  },
  rapper: {
    id: "rapper",
    en: "Rapper",
    ko: "래퍼",
    desc: "Quick reflexes, sharp delivery. The rhythm-first specialist who carries verses.",
    similar: "Like RM (BTS) or Hwasa (MAMAMOO).",
  },
  center: {
    id: "center",
    en: "Center",
    ko: "센터",
    desc: "Magnetic stage presence. You command the camera in the chorus formation.",
    similar: "Like Karina (aespa) or Tzuyu (TWICE).",
  },
  visual: {
    id: "visual",
    en: "Visual",
    ko: "비주얼",
    desc: "All eyes — your face fits the group's image perfectly. The album cover is yours.",
    similar: "Like V (BTS) or Cha Eun-woo (ASTRO).",
  },
  "all-rounder": {
    id: "all-rounder",
    en: "All-Rounder",
    ko: "올라운더",
    desc: "You can do everything competently. Many top idols start exactly here.",
    similar: "Like Jungkook (BTS) or Yuna (ITZY).",
  },
};

function decidePosition(s: Scores): { pos: Position; topPercent: number } {
  // All-rounder check first
  const allHigh = s.dance >= 65 && s.vocal >= 65 && s.speed >= 65 && s.charisma >= 65;
  let id: PositionId;
  if (allHigh) {
    id = "all-rounder";
  } else {
    const ranked = (
      [
        { k: "dance", v: s.dance },
        { k: "vocal", v: s.vocal },
        { k: "speed", v: s.speed },
        { k: "charisma", v: s.charisma },
      ] as Array<{ k: keyof Scores; v: number }>
    ).sort((a, b) => b.v - a.v);
    const top = ranked[0];
    if (top.k === "dance") id = top.v >= 80 ? "main-dancer" : "lead-dancer";
    else if (top.k === "vocal") id = top.v >= 80 ? "main-vocalist" : "lead-vocalist";
    else if (top.k === "charisma") id = "visual";
    else id = s.charisma >= 55 ? "center" : "rapper";
  }
  const pos = POSITIONS[id];

  // Top % based on the position's defining score
  const definingScore =
    id === "main-dancer" || id === "lead-dancer" ? s.dance
    : id === "main-vocalist" || id === "lead-vocalist" ? s.vocal
    : id === "rapper" ? s.speed
    : id === "center" ? Math.round((s.speed + s.charisma) / 2)
    : id === "visual" ? s.charisma
    : Math.round((s.dance + s.vocal + s.speed + s.charisma) / 4);
  const topPercent =
    definingScore >= 90 ? 5
    : definingScore >= 80 ? 10
    : definingScore >= 70 ? 15
    : definingScore >= 60 ? 25
    : 40;

  return { pos, topPercent };
}

// ============================================================
// Test 1: Rhythm — 4/4 BPM 120, tap on the beat × 10
// ============================================================

const BPM = 120;
const BEAT_MS = 60000 / BPM; // 500ms
const RHYTHM_BEATS = 10;

function rhythmScoreFromAvg(avgErr: number): number {
  if (avgErr <= 30) return 100;
  if (avgErr >= 200) return 0;
  return Math.round(100 * (1 - (avgErr - 30) / 170));
}

function RhythmTest({
  onDone,
  t,
}: {
  onDone: (score: number) => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(-1); // -1 = pre-roll
  const [errors, setErrors] = useState<number[]>([]);
  const startedAt = useRef(0);
  const rafRef = useRef<number | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);

  // Pulse visualizer at every beat using requestAnimationFrame
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const t = performance.now() - startedAt.current;
      const idx = Math.floor(t / BEAT_MS);
      // Show pre-roll: 4 lead-in beats before scoring beats
      const showBeat = idx - 4;
      setBeat(showBeat);
      // pulse animation
      const phase = (t % BEAT_MS) / BEAT_MS;
      if (flashRef.current) {
        const intensity = Math.max(0, 1 - phase * 4);
        flashRef.current.style.transform = `scale(${1 + intensity * 0.25})`;
        flashRef.current.style.opacity = `${0.4 + intensity * 0.6}`;
      }
      if (showBeat >= RHYTHM_BEATS + 1) {
        // Done collecting (allow last beat hit window)
        setRunning(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  // Finalize when running flips off and we have collected enough
  useEffect(() => {
    if (!running && errors.length >= RHYTHM_BEATS) {
      const avg = errors.reduce((a, b) => a + b, 0) / errors.length;
      onDone(rhythmScoreFromAvg(avg));
    }
  }, [running, errors, onDone]);

  const start = () => {
    setErrors([]);
    setBeat(-4);
    startedAt.current = performance.now();
    setRunning(true);
  };

  const tap = useCallback(() => {
    if (!running) return;
    const t = performance.now() - startedAt.current;
    const idx = Math.floor(t / BEAT_MS);
    const showBeat = idx - 4;
    if (showBeat < 0 || showBeat >= RHYTHM_BEATS) return;
    const expected = (idx + 1) * BEAT_MS - BEAT_MS / 2; // hit closest to beat boundary
    const beatBoundary = idx * BEAT_MS;
    const nextBoundary = (idx + 1) * BEAT_MS;
    const err = Math.min(t - beatBoundary, nextBoundary - t);
    setErrors((prev) => (prev.length < RHYTHM_BEATS ? [...prev, err] : prev));
    void expected;
  }, [running]);

  // keyboard space tap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tap]);

  return (
    <div className="w-full max-w-xl text-center">
      <p style={{ color: "#888", fontSize: 14, letterSpacing: "0.2em", marginBottom: 12 }}>
        {t("테스트 1 / 4 — 리듬", "TEST 1 / 4 — RHYTHM")}
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
        {t("박자에 맞춰 탭하세요", "Tap on the beat")}
      </h2>
      <p style={{ color: "#aaa", fontSize: 16, marginBottom: 32 }}>
        {t(
          `BPM 120 · ${RHYTHM_BEATS}박 · 스페이스바 또는 탭`,
          `BPM 120 · ${RHYTHM_BEATS} beats · spacebar or tap`,
        )}
      </p>

      <button
        type="button"
        onPointerDown={tap}
        disabled={!running}
        className="mx-auto flex items-center justify-center"
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: ACCENT,
          color: "#fff",
          border: "none",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: running ? "pointer" : "default",
          touchAction: "manipulation",
          opacity: running ? 1 : 0.4,
        }}
      >
        <div
          ref={flashRef}
          style={{
            transition: "transform 0.05s linear, opacity 0.05s linear",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        >
          {running
            ? beat < 0
              ? t("준비", "READY")
              : `${Math.min(beat + 1, RHYTHM_BEATS)} / ${RHYTHM_BEATS}`
            : t("탭", "TAP")}
        </div>
      </button>

      <div className="mt-10 flex justify-center gap-1.5">
        {Array.from({ length: RHYTHM_BEATS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: i < errors.length ? ACCENT : "#333",
            }}
          />
        ))}
      </div>

      {!running && errors.length === 0 && (
        <button
          type="button"
          onClick={start}
          className="mt-10"
          style={{
            background: "transparent",
            border: `1px solid ${ACCENT}`,
            color: ACCENT,
            padding: "12px 36px",
            borderRadius: 999,
            fontSize: 15,
            letterSpacing: "0.2em",
            cursor: "pointer",
          }}
        >
          {t("시작", "START")}
        </button>
      )}
    </div>
  );
}

// ============================================================
// Test 2: Pitch — pick the higher tone × 10
// ============================================================

const PITCH_QUESTIONS = 10;

function generatePitchPair(idx: number): { f1: number; f2: number; firstHigher: boolean } {
  // Difficulty ramps: semitone diff goes from 5 down to 1
  const diffSemis = Math.max(1, 5 - Math.floor(idx / 2));
  const base = 392 + Math.random() * 80; // around G4–C5
  const ratio = Math.pow(2, diffSemis / 12);
  const higher = base * ratio;
  const firstHigher = Math.random() < 0.5;
  return {
    f1: firstHigher ? higher : base,
    f2: firstHigher ? base : higher,
    firstHigher,
  };
}

function PitchTest({
  onDone,
  t,
}: {
  onDone: (score: number) => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [pair, setPair] = useState(() => generatePitchPair(0));
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      type AC = typeof AudioContext;
      type WindowWithWebkit = Window & { webkitAudioContext?: AC };
      const Constructor: AC =
        window.AudioContext ||
        ((window as WindowWithWebkit).webkitAudioContext as AC);
      ctxRef.current = new Constructor();
    }
    return ctxRef.current;
  }, []);

  const playPair = useCallback(() => {
    const ctx = ensureCtx();
    const startAt = ctx.currentTime + 0.05;
    const tone = (freq: number, t0: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.04);
      gain.gain.setValueAtTime(0.25, t0 + dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    };
    setPlaying(true);
    tone(pair.f1, startAt, 0.5);
    tone(pair.f2, startAt + 0.65, 0.5);
    window.setTimeout(() => {
      setPlaying(false);
      setPlayed(true);
    }, 1300);
  }, [ensureCtx, pair]);

  const answer = (chooseFirstHigher: boolean) => {
    if (!played) return;
    const got = chooseFirstHigher === pair.firstHigher;
    const newCorrect = got ? correct + 1 : correct;
    const next = idx + 1;
    if (next >= PITCH_QUESTIONS) {
      onDone(Math.round((newCorrect / PITCH_QUESTIONS) * 100));
      return;
    }
    setCorrect(newCorrect);
    setIdx(next);
    setPair(generatePitchPair(next));
    setPlayed(false);
  };

  return (
    <div className="w-full max-w-xl text-center">
      <p style={{ color: "#888", fontSize: 14, letterSpacing: "0.2em", marginBottom: 12 }}>
        {t("테스트 2 / 4 — 음정", "TEST 2 / 4 — PITCH")}
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
        {t("어느 음이 더 높은가요?", "Which tone is higher?")}
      </h2>
      <p style={{ color: "#aaa", fontSize: 16, marginBottom: 32 }}>
        {t(`${idx + 1} / ${PITCH_QUESTIONS} 문항`, `Question ${idx + 1} of ${PITCH_QUESTIONS}`)}
      </p>

      <button
        type="button"
        onClick={playPair}
        disabled={playing}
        className="mb-8"
        style={{
          background: ACCENT,
          color: "#fff",
          border: "none",
          padding: "14px 36px",
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.15em",
          cursor: playing ? "default" : "pointer",
          opacity: playing ? 0.5 : 1,
        }}
      >
        {playing
          ? t("재생 중…", "PLAYING…")
          : played
            ? t("다시 듣기", "REPLAY")
            : `▶ ${t("재생", "PLAY")}`}
      </button>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => answer(true)}
          disabled={!played}
          style={{
            background: "transparent",
            border: `1px solid ${played ? "#fff" : "#333"}`,
            color: played ? "#fff" : "#555",
            padding: "20px",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            cursor: played ? "pointer" : "default",
          }}
        >
          {t("첫 번째가 더 높음", "1st was higher")}
        </button>
        <button
          type="button"
          onClick={() => answer(false)}
          disabled={!played}
          style={{
            background: "transparent",
            border: `1px solid ${played ? "#fff" : "#333"}`,
            color: played ? "#fff" : "#555",
            padding: "20px",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            cursor: played ? "pointer" : "default",
          }}
        >
          {t("두 번째가 더 높음", "2nd was higher")}
        </button>
      </div>

      <div className="mt-8 flex justify-center gap-1.5">
        {Array.from({ length: PITCH_QUESTIONS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 4,
              borderRadius: 2,
              background: i < idx ? ACCENT : "#333",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Test 3: Reaction — 5 trials, avg ms
// ============================================================

const REACTION_TRIALS = 5;

function reactionScoreFromAvg(avg: number): number {
  if (avg <= 150) return 100;
  if (avg >= 400) return 0;
  return Math.round(100 * (1 - (avg - 150) / 250));
}

function ReactionTest({
  onDone,
  t,
}: {
  onDone: (score: number) => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  type RPhase = "idle" | "waiting" | "go" | "tooEarly" | "showResult";
  const [rPhase, setRPhase] = useState<RPhase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const startRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Auto-finish when 5 trials collected
  useEffect(() => {
    if (times.length >= REACTION_TRIALS) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      onDone(reactionScoreFromAvg(avg));
    }
  }, [times, onDone]);

  const startTrial = () => {
    setRPhase("waiting");
    setLast(null);
    const delay = 1200 + Math.random() * 2400;
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setRPhase("go");
    }, delay);
  };

  const press = () => {
    if (rPhase === "idle" || rPhase === "showResult" || rPhase === "tooEarly") {
      if (times.length >= REACTION_TRIALS) return;
      startTrial();
      return;
    }
    if (rPhase === "waiting") {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      setRPhase("tooEarly");
      return;
    }
    if (rPhase === "go") {
      const reaction = Math.round(performance.now() - startRef.current);
      setLast(reaction);
      setTimes((t) => [...t, reaction]);
      setRPhase("showResult");
    }
  };

  let bg = "#1a1a1a";
  let label = t("탭하여 시작", "TAP TO START");
  let sub = `${times.length} / ${REACTION_TRIALS}`;
  if (rPhase === "waiting") {
    bg = "#330b08";
    label = t("기다리세요…", "WAIT…");
    sub = t("분홍색이 되면 탭하세요", "tap when it turns pink");
  } else if (rPhase === "go") {
    bg = ACCENT;
    label = t("탭!", "TAP!");
    sub = "";
  } else if (rPhase === "tooEarly") {
    bg = "#1a0000";
    label = t("너무 빨랐어요", "TOO EARLY");
    sub = t("다시 시도하려면 탭", "tap to retry");
  } else if (rPhase === "showResult") {
    bg = "#222";
    label = `${last} ms`;
    sub = `${times.length} / ${REACTION_TRIALS} · ${t("다음을 위해 탭", "tap for next")}`;
  }

  return (
    <div className="w-full max-w-xl text-center">
      <p style={{ color: "#888", fontSize: 14, letterSpacing: "0.2em", marginBottom: 12 }}>
        {t("테스트 3 / 4 — 반응속도", "TEST 3 / 4 — REACTION")}
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        {t("분홍색이 되는 순간 탭하세요", "Tap the moment it turns pink")}
      </h2>
      <button
        type="button"
        onPointerDown={press}
        style={{
          width: "100%",
          height: 280,
          borderRadius: 24,
          background: bg,
          color: "#fff",
          border: "none",
          fontSize: 36,
          fontWeight: 800,
          cursor: "pointer",
          touchAction: "manipulation",
          transition: "background-color 0.08s ease",
        }}
      >
        <div>{label}</div>
        {sub && <div style={{ fontSize: 15, fontWeight: 400, marginTop: 12, opacity: 0.7 }}>{sub}</div>}
      </button>
    </div>
  );
}

// ============================================================
// Test 4: Charisma — 10 multi-choice (Visual / Center tendency)
// ============================================================

type CharismaOption = { en: string; ko: string; pts: number };
type CharismaQ = { en: string; ko: string; options: CharismaOption[] };

const CHARISMA_QUESTIONS: CharismaQ[] = [
  {
    en: "When you mess up on stage?",
    ko: "무대에서 실수했을 때?",
    options: [
      { en: "Freeze and panic", ko: "당황해서 멈춤", pts: 0 },
      { en: "Push through harder", ko: "더 강하게 밀어붙임", pts: 8 },
      { en: "Laugh it off", ko: "웃어넘김", pts: 10 },
    ],
  },
  {
    en: "When a fan cries at fan meeting?",
    ko: "팬미팅에서 팬이 울면?",
    options: [
      { en: "Cry along with them", ko: "같이 울음", pts: 4 },
      { en: "Pull them in for a hug", ko: "꼭 안아줌", pts: 10 },
      { en: "Comfort with words", ko: "위로의 말", pts: 7 },
    ],
  },
  {
    en: "In front of the camera, what feels natural?",
    ko: "카메라 앞에서 무엇이 가장 자연스러워요?",
    options: [
      { en: "Bright wide smile", ko: "환한 미소", pts: 8 },
      { en: "Cool intense gaze", ko: "강렬한 시선", pts: 10 },
      { en: "I avoid the lens", ko: "피하고 싶음", pts: 2 },
    ],
  },
  {
    en: "Right before debut stage?",
    ko: "데뷔 첫 무대 직전?",
    options: [
      { en: "Super nervous", ko: "엄청 떨림", pts: 3 },
      { en: "Calm and focused", ko: "차분하고 집중", pts: 10 },
      { en: "Excited, can't wait", ko: "신나서 못 참음", pts: 7 },
    ],
  },
  {
    en: "In group photos, where do you stand?",
    ko: "그룹 사진에서 어디에 서 있어요?",
    options: [
      { en: "At the edge", ko: "끝쪽에", pts: 2 },
      { en: "Right in the middle", ko: "한가운데", pts: 10 },
      { en: "Wherever they put me", ko: "정해주는 자리", pts: 5 },
    ],
  },
  {
    en: "On variety shows, your character?",
    ko: "예능에서 캐릭터?",
    options: [
      { en: "Quiet observer", ko: "조용한 관찰자", pts: 3 },
      { en: "Mood maker", ko: "분위기 메이커", pts: 9 },
      { en: "Random and weird", ko: "엉뚱하고 4차원", pts: 7 },
    ],
  },
  {
    en: "Most common expression on fancams?",
    ko: "팬캠에서 가장 자주 나오는 표정?",
    options: [
      { en: "Wink and smirk", ko: "윙크 + 미소", pts: 10 },
      { en: "Serious focused face", ko: "심각한 집중 표정", pts: 8 },
      { en: "Bursting laugh", ko: "활짝 웃음", pts: 6 },
    ],
  },
  {
    en: "Concert solo moment?",
    ko: "콘서트 솔로 순간?",
    options: [
      { en: "Powerful dance break", ko: "파워풀한 댄스", pts: 8 },
      { en: "Emotional ballad", ko: "감성 발라드", pts: 7 },
      { en: "Direct fan interaction", ko: "팬과의 직접 소통", pts: 10 },
    ],
  },
  {
    en: "How fans first describe you?",
    ko: "팬들이 처음 너를 묘사할 때?",
    options: [
      { en: "Visually stunning", ko: "비주얼 충격", pts: 10 },
      { en: "Charismatic energy", ko: "카리스마 넘침", pts: 8 },
      { en: "Cute and lovable", ko: "귀엽고 사랑스러움", pts: 6 },
    ],
  },
  {
    en: "Reading fan letters, you?",
    ko: "팬 편지 읽을 때, 당신은?",
    options: [
      { en: "Tear up immediately", ko: "바로 눈물", pts: 5 },
      { en: "Stay composed, nod warmly", ko: "차분하게 끄덕임", pts: 9 },
      { en: "Hug the letter dramatically", ko: "편지를 꼭 안음", pts: 8 },
    ],
  },
];

function CharismaTest({
  onDone,
  t,
  locale,
}: {
  onDone: (score: number) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [idx, setIdx] = useState(0);
  const [total, setTotal] = useState(0);
  const q = CHARISMA_QUESTIONS[idx];
  const max = CHARISMA_QUESTIONS.length * 10;

  const pick = (pts: number) => {
    const newTotal = total + pts;
    const next = idx + 1;
    if (next >= CHARISMA_QUESTIONS.length) {
      onDone(Math.round((newTotal / max) * 100));
      return;
    }
    setTotal(newTotal);
    setIdx(next);
  };

  return (
    <div className="w-full max-w-xl">
      <p style={{ color: "#888", fontSize: 14, letterSpacing: "0.2em", marginBottom: 12, textAlign: "center" }}>
        {t("테스트 4 / 4 — 카리스마", "TEST 4 / 4 — CHARISMA")}
      </p>
      <p style={{ color: "#aaa", fontSize: 15, textAlign: "center", marginBottom: 24 }}>
        {t(
          `${idx + 1} / ${CHARISMA_QUESTIONS.length} 문항`,
          `Question ${idx + 1} of ${CHARISMA_QUESTIONS.length}`,
        )}
      </p>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 32,
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        {locale === "ko" ? q.ko : q.en}
      </h2>

      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pick(opt.pts)}
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#fff",
              padding: "18px 20px",
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = ACCENT;
              e.currentTarget.style.background = "rgba(255,45,120,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#333";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div>{locale === "ko" ? opt.ko : opt.en}</div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-1.5">
        {Array.from({ length: CHARISMA_QUESTIONS.length }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 4,
              borderRadius: 2,
              background: i < idx ? ACCENT : "#333",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Result + Share
// ============================================================

function StatBar({ label, value }: { label: string; value: number }): ReactElement {
  return (
    <div className="w-full">
      <div className="flex justify-between" style={{ fontSize: 14, color: "#aaa", marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ width: "100%", height: 6, background: "#222", borderRadius: 3 }}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: ACCENT,
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

function Result({
  scores,
  onReset,
  t,
  locale,
}: {
  scores: Scores;
  onReset: () => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const { pos, topPercent } = useMemo(() => decidePosition(scores), [scores]);
  const [copied, setCopied] = useState(false);

  const onShare = () => {
    const text = t(
      `K팝 포지션 테스트 결과: ${pos.ko}! 당신은? → nolza.fun/games/kpop-position`,
      `I got ${pos.en} in K-pop! What's yours? → nolza.fun/games/kpop-position`,
    );
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); })
        .catch(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); });
    } else {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-xl text-center">
      <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
        {t("당신의 포지션", "YOUR POSITION")}
      </p>
      <h1
        style={{
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: 6,
          color: "#fff",
          fontFamily: locale === "ko" ? "var(--font-noto-sans-kr)" : "var(--font-inter), sans-serif",
        }}
      >
        {locale === "ko" ? pos.ko : pos.en}
      </h1>
      <p style={{ fontSize: 16, color: "#888", marginBottom: 24, fontFamily: "var(--font-noto-sans-kr)" }}>
        {locale === "ko" ? pos.en : pos.ko}
      </p>

      <div
        style={{
          display: "inline-block",
          background: "rgba(255,45,120,0.15)",
          color: ACCENT,
          padding: "8px 20px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.1em",
          marginBottom: 32,
        }}
      >
        {t(
          `상위 ${topPercent}% ${pos.ko} 재목`,
          `Top ${topPercent}% ${pos.en} material`,
        )}
      </div>

      <p style={{ fontSize: 16, lineHeight: 1.7, color: "#ccc", marginBottom: 16, padding: "0 8px" }}>
        {pos.desc}
      </p>
      <p style={{ fontSize: 16, color: "#888", marginBottom: 40, fontStyle: "italic" }}>
        {pos.similar}
      </p>

      <div className="flex flex-col gap-4 mb-10 px-2">
        <StatBar label={t("댄스", "Dance")} value={scores.dance} />
        <StatBar label={t("보컬", "Vocal")} value={scores.vocal} />
        <StatBar label={t("반응속도", "Reaction")} value={scores.speed} />
        <StatBar label={t("카리스마", "Charisma")} value={scores.charisma} />
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          type="button"
          onClick={onShare}
          style={{
            background: ACCENT,
            color: "#fff",
            border: "none",
            padding: "14px 32px",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.15em",
            cursor: "pointer",
          }}
        >
          {copied ? t("✓ 복사됨", "COPIED") : t("결과 공유하기", "SHARE RESULT")}
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "transparent",
            color: "#fff",
            border: "1px solid #444",
            padding: "14px 32px",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.15em",
            cursor: "pointer",
          }}
        >
          {t("다시 하기", "AGAIN")}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main page
// ============================================================

export default function KpopPositionPage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [scores, setScores] = useState<Scores>({
    dance: 0,
    vocal: 0,
    speed: 0,
    charisma: 0,
  });

  const reset = () => {
    setScores({ dance: 0, vocal: 0, speed: 0, charisma: 0 });
    setPhase("intro");
  };

  return (
    <main
      className="page-in min-h-screen"
      style={{
        background: BG,
        color: TEXT,
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        paddingBottom: 100,
      }}
    >
      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
        }}
      >
        ←
      </Link>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {phase === "intro" && (
          <div className="text-center max-w-xl">
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              {t("K팝 포지션 테스트", "K-POP POSITION TEST")}
            </p>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              {t(
                "K팝 그룹에 데뷔한다면, 당신의 포지션은?",
                "If you debuted in a K-pop group, what would your position be?",
              )}
            </h1>
            <p style={{ color: "#999", fontSize: 15, marginBottom: 40 }}>
              {t(
                "4가지 짧은 테스트 · 리듬 · 음감 · 반응 · 카리스마",
                "4 quick tests · rhythm · pitch · reaction · charisma",
              )}
            </p>
            <button
              type="button"
              onClick={() => setPhase("rhythm")}
              style={{
                background: ACCENT,
                color: "#fff",
                border: "none",
                padding: "16px 48px",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              {t("시작", "START")}
            </button>
          </div>
        )}

        {phase === "rhythm" && (
          <RhythmTest
            t={t}
            onDone={(score) => {
              setScores((s) => ({ ...s, dance: score }));
              setPhase("pitch");
            }}
          />
        )}

        {phase === "pitch" && (
          <PitchTest
            t={t}
            onDone={(score) => {
              setScores((s) => ({ ...s, vocal: score }));
              setPhase("reaction");
            }}
          />
        )}

        {phase === "reaction" && (
          <ReactionTest
            t={t}
            onDone={(score) => {
              setScores((s) => ({ ...s, speed: score }));
              setPhase("charisma");
            }}
          />
        )}

        {phase === "charisma" && (
          <CharismaTest
            t={t}
            locale={locale}
            onDone={(score) => {
              setScores((s) => ({ ...s, charisma: score }));
              setPhase("result");
            }}
          />
        )}

        {phase === "result" && <Result scores={scores} onReset={reset} t={t} locale={locale} />}
      </div>

      <AdMobileSticky />
    </main>
  );
}
