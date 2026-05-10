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
// Constants
// ============================================================

const ACCENT = "#ff2d78";
const BG = "#0d0d0d";
const RECORD_SECONDS = 30;

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type Phase = "intro" | "recording" | "result" | "denied";

type Singer = {
  name: string;
  note: string;
  hz: number;
  song?: string;
};

const SINGERS: Singer[] = [
  { name: "임창정", note: "A3", hz: 220, song: "찾아가" },
  { name: "장혜진", note: "C4", hz: 262 },
  { name: "태양", note: "D4", hz: 294 },
  { name: "G-DRAGON", note: "E4", hz: 330 },
  { name: "BTS 뷔", note: "F4", hz: 349 },
  { name: "아이유", note: "G4", hz: 392, song: "좋은날 3단 고음" },
  { name: "태연", note: "A4", hz: 440 },
  { name: "AKMU 수현", note: "B4", hz: 494 },
  { name: "휘성", note: "C5", hz: 523, song: "되돌리다" },
  { name: "BTS 정국", note: "D5", hz: 587 },
  { name: "딤플 (기현)", note: "E5", hz: 659 },
  { name: "나얼", note: "F5", hz: 698 },
  { name: "박효신", note: "G5", hz: 784 },
  { name: "김범수", note: "A5", hz: 880 },
  { name: "소향", note: "C6", hz: 1047, song: "홀로아리랑" },
];

const CHART_MIN_HZ = 180; // a bit below 임창정 (A3 = 220)
const CHART_MAX_HZ = 1100; // slightly above 소향 (C6 = 1047)

// ============================================================
// Pitch detection — Chris Wilson autocorrelation
// ============================================================

// Realistic vocal fundamental range — C2 to C6 covers all human voices.
// Frequencies outside this band are almost always harmonics or noise.
const MIN_VOCAL_HZ = 65;   // C2
const MAX_VOCAL_HZ = 1047; // C6
// Reject readings whose normalized autocorrelation peak is below this.
// Clean sung tones land around 0.9–0.99; noise/harmonics fall well below.
const MIN_CONFIDENCE = 0.9;
// Require this much sustained energy before accepting any reading.
const MIN_RMS = 0.05;

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < MIN_RMS) return -1; // too quiet — likely background noise

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }
  const trimmed = buf.slice(r1, r2);
  const newSize = trimmed.length;
  if (newSize < 256) return -1;

  // Energy at lag 0 — used to normalize peak into a [0,1] confidence.
  let energy = 0;
  for (let i = 0; i < newSize; i++) energy += trimmed[i] * trimmed[i];
  if (energy === 0) return -1;

  // Autocorrelation
  const c = new Array<number>(newSize).fill(0);
  for (let i = 0; i < newSize; i++) {
    let sum = 0;
    for (let j = 0; j < newSize - i; j++) {
      sum += trimmed[j] * trimmed[j + i];
    }
    c[i] = sum;
  }

  // Skip the descending head, then find the peak
  let d = 0;
  while (d < newSize - 1 && c[d] > c[d + 1]) d++;
  let maxval = -Infinity;
  let maxpos = -1;
  for (let i = d; i < newSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  if (maxpos <= 0 || maxpos >= newSize - 1) return -1;

  // Parabolic interpolation around the peak
  let T0 = maxpos;
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a !== 0) T0 = T0 - b / (2 * a);

  const freq = sampleRate / T0;
  if (freq < MIN_VOCAL_HZ || freq > MAX_VOCAL_HZ) return -1;

  const confidence = maxval / energy;
  if (confidence < MIN_CONFIDENCE) return -1;
  return freq;
}

function topTenPercentAvg(samples: number[]): number {
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => b - a);
  const n = Math.max(1, Math.ceil(sorted.length * 0.1));
  let sum = 0;
  for (let i = 0; i < n; i++) sum += sorted[i];
  return sum / n;
}

function freqToMidi(freq: number): number {
  return Math.round(12 * (Math.log(freq / 440) / Math.log(2)) + 69);
}

function freqToNoteName(freq: number): string {
  if (freq <= 0) return "—";
  const noteNum = 12 * (Math.log(freq / 440) / Math.log(2)) + 69;
  const midi = Math.round(noteNum);
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

function getResultMessage(hz: number): { ko: string; en: string } {
  if (hz <= 0) return { ko: "측정되지 않았어요", en: "No reading — try again" };
  if (hz < 220) return { ko: "편안한 저음대 보이스예요", en: "A comfy low-range voice" };
  if (hz < 262) return { ko: "임창정과 비슷한 음역대예요", en: "Range like Lim Chang-jung" };
  if (hz < 330) return { ko: "안정적인 중음대 보이스예요", en: "Stable mid-range voice" };
  if (hz < 392) return { ko: "아이유 음역대까지 닿아요", en: "You reach IU's range" };
  if (hz < 494) return { ko: "메인보컬 가능성 있어요 🎤", en: "Main vocalist potential 🎤" };
  if (hz < 587) return { ko: "꽤 넓은 음역대를 가지고 있어요", en: "A pretty wide range" };
  if (hz < 698) return { ko: "고음대까지 편하게 닿아요 ✨", en: "Comfortable up to high notes ✨" };
  return { ko: "소향급 음역대입니다 👑", en: "Sohyang-tier range 👑" };
}

// ============================================================
// SVG mic icon
// ============================================================

function MicIcon({ size = 96, color = ACCENT }: { size?: number; color?: string }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="22" y="8" width="20" height="34" rx="10" fill={color} />
      <path d="M14 30c0 9.94 8.06 18 18 18s18-8.06 18-18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="48" x2="32" y2="58" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="58" x2="42" y2="58" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function MicMutedIcon({ size = 96 }: { size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="22" y="8" width="20" height="34" rx="10" fill="#666" />
      <path d="M14 30c0 9.94 8.06 18 18 18s18-8.06 18-18" stroke="#666" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="48" x2="32" y2="58" stroke="#666" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="58" x2="42" y2="58" stroke="#666" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="10" x2="54" y2="54" stroke="#FF3B30" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// Page
// ============================================================

export default function HighNotePage(): ReactElement {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("intro");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorKind, setErrorKind] = useState<"notfound" | "denied" | "inuse" | "unsupported" | "other">("other");
  const [checking, setChecking] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [detectedInputs, setDetectedInputs] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(RECORD_SECONDS);
  const [currentHz, setCurrentHz] = useState(0);
  const [maxHz, setMaxHz] = useState(0);
  const [volume, setVolume] = useState(0);
  const [copied, setCopied] = useState(false);
  const [newRecordTick, setNewRecordTick] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordStartRef = useRef(0);
  const maxHzRef = useRef(0);
  const stopRequestedRef = useRef(false);
  // Continuity filter — ignore momentary spikes; only count notes held ≥ 100ms.
  const lastNoteRef = useRef<{ midi: number; startTime: number } | null>(null);
  // Sustained samples used to compute the top-10% average final pitch.
  const sustainedSamplesRef = useRef<number[]>([]);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startRecording = useCallback(() => {
    if (!analyserRef.current || !audioCtxRef.current) return;
    const sampleRate = audioCtxRef.current.sampleRate;
    const buf = new Float32Array(analyserRef.current.fftSize);
    maxHzRef.current = 0;
    stopRequestedRef.current = false;
    lastNoteRef.current = null;
    sustainedSamplesRef.current = [];
    setMaxHz(0);
    setCurrentHz(0);
    setNewRecordTick(0);
    recordStartRef.current = performance.now();

    const tick = () => {
      const t = performance.now() - recordStartRef.current;
      const remaining = Math.max(0, RECORD_SECONDS - t / 1000);
      setTimeLeft(remaining);

      const analyser = analyserRef.current;
      if (analyser) {
        analyser.getFloatTimeDomainData(buf);
        // Volume RMS for circle visualization
        let rms = 0;
        for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / buf.length);
        setVolume(Math.min(1, rms * 4));

        const freq = autoCorrelate(buf, sampleRate);
        if (freq > 0) {
          setCurrentHz(freq);

          // Continuity filter — only accept readings where the same note
          // (within ½ semitone) has been held for at least 100ms.
          const midi = freqToMidi(freq);
          const now = performance.now();
          const last = lastNoteRef.current;
          if (last && last.midi === midi) {
            if (now - last.startTime >= 100) {
              sustainedSamplesRef.current.push(freq);

              // Final "max" is the average of the top 10% of sustained samples
              // — this rejects single outlier spikes while still rewarding range.
              const top10 = topTenPercentAvg(sustainedSamplesRef.current);
              const prevMax = maxHzRef.current;
              if (top10 > prevMax * 1.005 || prevMax === 0) {
                const isFirstReading = prevMax === 0;
                maxHzRef.current = top10;
                setMaxHz(top10);
                if (!isFirstReading) {
                  setNewRecordTick((n) => n + 1);
                }
              } else if (top10 > prevMax) {
                maxHzRef.current = top10;
                setMaxHz(top10);
              }
            }
          } else {
            lastNoteRef.current = { midi, startTime: now };
          }
        } else {
          // Detection lost — reset continuity so a new sustain must start fresh.
          lastNoteRef.current = null;
        }
      }

      if (stopRequestedRef.current || t >= RECORD_SECONDS * 1000) {
        cleanup();
        setPhase("result");
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [cleanup]);

  const requestMic = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorKind("unsupported");
      setErrorMsg("이 브라우저는 마이크를 지원하지 않아요");
      setPhase("denied");
      return;
    }
    setChecking(true);
    // Probe device list first so we can give better feedback
    try {
      if (navigator.mediaDevices.enumerateDevices) {
        const devs = await navigator.mediaDevices.enumerateDevices();
        const inputs = devs.filter((d) => d.kind === "audioinput");
        setDetectedInputs(inputs.length);
      }
    } catch {
      setDetectedInputs(null);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;
      type AC = typeof AudioContext;
      type Win = Window & { webkitAudioContext?: AC };
      const Ctor: AC = window.AudioContext || ((window as Win).webkitAudioContext as AC);
      const ctx = new Ctor();
      audioCtxRef.current = ctx;
      // iOS Safari needs explicit resume after user gesture
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.0;
      source.connect(analyser);
      analyserRef.current = analyser;
      setChecking(false);
      setPhase("recording");
      startRecording();
    } catch (e) {
      const name = e instanceof Error ? e.name : "";
      const msg = e instanceof Error ? e.message : "";
      if (name === "NotFoundError" || name === "OverconstrainedError" || /not found/i.test(msg)) {
        setErrorKind("notfound");
      } else if (name === "NotAllowedError" || name === "SecurityError" || /denied|permission/i.test(msg)) {
        setErrorKind("denied");
      } else if (name === "NotReadableError" || name === "AbortError" || /in use|busy/i.test(msg)) {
        setErrorKind("inuse");
      } else {
        setErrorKind("other");
      }
      setErrorMsg(msg);
      setChecking(false);
      setPhase("denied");
    }
  }, [startRecording]);

  const finishRecording = useCallback(() => {
    stopRequestedRef.current = true;
  }, []);

  const begin = () => {
    void requestMic();
  };

  const reset = () => {
    cleanup();
    stopRequestedRef.current = false;
    setMaxHz(0);
    setCurrentHz(0);
    setVolume(0);
    setTimeLeft(RECORD_SECONDS);
    setNewRecordTick(0);
    setErrorMsg("");
    setRetryCount(0);
    setDetectedInputs(null);
    setChecking(false);
    setPhase("intro");
  };

  const noteName = useMemo(() => freqToNoteName(maxHz), [maxHz]);
  const currentNoteName = useMemo(() => freqToNoteName(currentHz), [currentHz]);
  const result = useMemo(() => getResultMessage(maxHz), [maxHz]);

  const closestSinger = useMemo<Singer | null>(() => {
    if (maxHz <= 0) return null;
    let best = SINGERS[0];
    let bestDiff = Math.abs(best.hz - maxHz);
    for (const s of SINGERS) {
      const d = Math.abs(s.hz - maxHz);
      if (d < bestDiff) {
        best = s;
        bestDiff = d;
      }
    }
    return best;
  }, [maxHz]);

  // Background tint during recording — pitch-driven gradient
  const tintT = phase === "recording" ? Math.min(1, Math.max(0, (currentHz - 200) / 800)) : 0;
  const bgRGB = useMemo(() => {
    const r = Math.round(13 + (255 - 13) * tintT * 0.4);
    const g = Math.round(13 + (45 - 13) * tintT * 0.4);
    const b = Math.round(13 + (120 - 13) * tintT * 0.4);
    return `rgb(${r}, ${g}, ${b})`;
  }, [tintT]);

  const onShare = () => {
    const text = t(
      `내가 편하게 낼 수 있는 최고음: ${noteName}` +
        (closestSinger ? `\n${closestSinger.name}과 비슷한 음역대!` : "") +
        `\n내 음역대도 측정해보기 → nolza.fun/games/highnote`,
      `My highest comfortable note: ${noteName}` +
        (closestSinger ? `\nSimilar range to ${closestSinger.name}!` : "") +
        `\nTest your range too → nolza.fun/games/highnote`,
    );
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
    } else {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main
      className="page-in min-h-screen relative"
      style={{
        background: phase === "recording" ? bgRGB : BG,
        color: "#fff",
        fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
        paddingBottom: 100,
        transition: phase === "recording" ? "background 0.15s linear" : "background 0.4s ease",
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
        {/* ─── INTRO ─── */}
        {phase === "intro" && (
          <div className="text-center max-w-md">
            <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
              <MicIcon size={88} />
            </div>
            <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
              {t("고음 챌린지", "K-POP HIGH NOTE CHALLENGE")}
            </p>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                marginBottom: 16,
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
              }}
            >
              {t(
                "당신이 부를 수 있는 가장 높은 노래를 불러보세요",
                "Sing the highest note you comfortably can",
              )}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 28,
                lineHeight: 1.6,
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
              }}
            >
              {t(
                "억지로 지르지 말고 편하게 부를 수 있는 가장 높은 곡을 불러주세요",
                "Don't strain — sing the highest note you can hit comfortably",
              )}
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 16,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: ACCENT,
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {t("측정 안내", "How to measure")}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: 15,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.7,
                  fontFamily: "var(--font-noto-sans-kr), sans-serif",
                }}
              >
                <li>
                  · {t(
                    "편하게 낼 수 있는 가장 높은 음을 내주세요",
                    "Sing the highest note you can hit comfortably",
                  )}
                </li>
                <li>
                  · {t("억지로 지르지 마세요", "Don't strain or force it")}
                </li>
                <li>
                  · {t("5초 이상 유지해주세요", "Hold the note for 5+ seconds")}
                </li>
              </ul>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 36,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: ACCENT,
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {t("예시", "Examples")}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7,
                  fontFamily: "var(--font-noto-sans-kr), sans-serif",
                }}
              >
                <li>· 좋은날 고음 부분</li>
                <li>· Oh Happy Day</li>
                <li>· 본인이 좋아하는 노래 고음 부분</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={begin}
              style={{
                background: ACCENT,
                color: "#fff",
                border: "none",
                padding: "16px 44px",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.15em",
                cursor: "pointer",
                touchAction: "manipulation",
                boxShadow: "0 8px 24px rgba(255,45,120,0.35)",
              }}
            >
              🎤 {t("노래 시작", "START SINGING")}
            </button>
          </div>
        )}

        {/* ─── RECORDING ─── */}
        {phase === "recording" && (
          <RecordingView
            volume={volume}
            currentHz={currentHz}
            currentNoteName={currentNoteName}
            timeLeft={timeLeft}
            maxNoteName={noteName}
            newRecordTick={newRecordTick}
            onFinish={finishRecording}
            t={t}
          />
        )}

        {/* ─── DENIED ─── */}
        {phase === "denied" && (
          <div className="text-center max-w-md">
            <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
              <MicMutedIcon size={88} />
            </div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 12,
                fontFamily: "var(--font-noto-sans-kr), sans-serif",
              }}
            >
              {errorKind === "notfound"
                ? t("마이크를 찾을 수 없어요 🎤", "No microphone found 🎤")
                : errorKind === "inuse"
                ? t("마이크가 사용 중이에요 🎤", "Microphone is busy 🎤")
                : errorKind === "unsupported"
                ? t("마이크를 지원하지 않아요", "Microphone not supported")
                : t("마이크 권한이 필요해요 🎤", "Microphone permission needed 🎤")}
            </h2>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginBottom: 24, lineHeight: 1.7, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
              {errorKind === "notfound" ? (
                <>
                  {t(
                    "이 컴퓨터에 연결된 마이크가 없어요. 다음을 확인해주세요:",
                    "No microphone is connected. Please check:",
                  )}
                  <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", textAlign: "left" }}>
                    <li>· {t("마이크 / 헤드셋이 연결되어 있는지", "Mic or headset is plugged in")}</li>
                    <li>· {t("Windows 설정 → 개인정보 → 마이크 허용 ON", "Windows Settings → Privacy → Microphone is ON")}</li>
                    <li>· {t("브라우저의 마이크 접근이 허용되어 있는지", "Your browser is allowed to use the mic")}</li>
                  </ul>
                </>
              ) : errorKind === "inuse" ? (
                t(
                  "다른 앱(Zoom, Discord 등)이 마이크를 쓰고 있어요. 끄고 다시 시도해주세요.",
                  "Another app (Zoom, Discord, etc.) is using the mic. Close it and retry.",
                )
              ) : errorKind === "denied" ? (
                <>
                  {t(
                    "주소창 왼쪽 자물쇠 🔒 아이콘 → 마이크 → '허용'으로 바꿔주세요.",
                    "Click the lock 🔒 icon next to the address bar → Microphone → set to 'Allow'.",
                  )}
                  <br />
                  {t(
                    "그 다음 아래 버튼을 누르면 권한 팝업이 다시 뜹니다.",
                    "Then press the button below to re-trigger the permission prompt.",
                  )}
                </>
              ) : (
                t("아래 버튼을 눌러 다시 시도해주세요.", "Press the button below to retry.")
              )}
              {detectedInputs !== null && (
                <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  {t(
                    `감지된 오디오 입력 장치: ${detectedInputs}개`,
                    `Detected audio input devices: ${detectedInputs}`,
                  )}
                  {detectedInputs === 0 && (
                    <span style={{ color: "#FF6B6B" }}>
                      {" "}
                      — {t("마이크를 연결해주세요", "Please connect a microphone")}
                    </span>
                  )}
                </div>
              )}
              {retryCount > 0 && (
                <div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                  {t(`재시도 ${retryCount}회`, `Retry attempts: ${retryCount}`)}
                </div>
              )}
              {errorMsg && (
                <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,107,107,0.8)" }}>
                  {errorMsg}
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={checking}
              onClick={() => {
                setErrorMsg("");
                setRetryCount((n) => n + 1);
                void requestMic();
              }}
              style={{
                background: checking ? "rgba(255,45,120,0.5)" : ACCENT,
                color: "#fff",
                border: "none",
                padding: "14px 36px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.15em",
                cursor: checking ? "wait" : "pointer",
                boxShadow: "0 6px 20px rgba(255,45,120,0.3)",
                marginRight: 8,
                opacity: checking ? 0.7 : 1,
              }}
            >
              {checking
                ? t("확인 중...", "CHECKING...")
                : `🎤 ${t("마이크 권한 요청", "REQUEST MIC ACCESS")}`}
            </button>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "14px 28px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              {t("처음으로", "BACK")}
            </button>
          </div>
        )}

        {/* ─── RESULT ─── */}
        {phase === "result" && (
          <ResultView
            maxHz={maxHz}
            noteName={noteName}
            result={result}
            closest={closestSinger}
            onShare={onShare}
            onReset={reset}
            copied={copied}
            t={t}
          />
        )}
      </div>

      <AdMobileSticky />
    </main>
  );
}

// ============================================================
// Recording view
// ============================================================

function RecordingView({
  volume,
  currentHz,
  currentNoteName,
  timeLeft,
  maxNoteName,
  newRecordTick,
  onFinish,
  t,
}: {
  volume: number;
  currentHz: number;
  currentNoteName: string;
  timeLeft: number;
  maxNoteName: string;
  newRecordTick: number;
  onFinish: () => void;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const progressPct = ((RECORD_SECONDS - timeLeft) / RECORD_SECONDS) * 100;
  const circleScale = 0.8 + Math.min(0.8, volume * 1.4);
  return (
    <div className="text-center max-w-md w-full">
      <p
        style={{
          fontSize: 16,
          color: "#fff",
          fontWeight: 600,
          marginBottom: 4,
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        {t("고음 부분에서 멈춰도 돼요", "You can stop at the high note")}
      </p>
      <p
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.55)",
          marginBottom: 24,
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        {t("편하게 불러주세요 🎵", "Sing comfortably 🎵")}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 280,
          marginBottom: 24,
          position: "relative",
        }}
      >
        {/* "최고음 갱신!" pop */}
        {newRecordTick > 0 && (
          <div
            key={newRecordTick}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 16,
              fontWeight: 800,
              color: "#FFD60A",
              letterSpacing: "0.15em",
              textShadow: "0 0 16px rgba(255,214,10,0.6)",
              animation: "highnote-record-pop 1s ease-out forwards",
              pointerEvents: "none",
              fontFamily: "var(--font-noto-sans-kr), sans-serif",
            }}
          >
            ✨ {t("최고음 갱신!", "NEW HIGH!")}
          </div>
        )}
        {/* Glow halo */}
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,45,120,${0.15 + volume * 0.3}) 0%, rgba(255,45,120,0) 70%)`,
            transition: "background 0.1s linear",
          }}
        />
        {/* Volume ring */}
        <div
          style={{
            width: 200 * circleScale,
            height: 200 * circleScale,
            borderRadius: "50%",
            background: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.08s linear, height 0.08s linear",
            boxShadow: `0 0 60px rgba(255,45,120,${0.4 + volume * 0.5})`,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-inter), sans-serif",
              lineHeight: 1,
            }}
          >
            {currentNoteName}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
        {t("현재 음정", "Current pitch")} · <span style={{ color: "#fff", fontWeight: 600 }}>{currentHz > 0 ? `${Math.round(currentHz)} Hz` : "—"}</span>
      </div>
      <div style={{ fontSize: 16, color: ACCENT, marginBottom: 20, fontWeight: 700 }}>
        {t("당신의 최고음", "Your highest note")} · {maxNoteName}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 6,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: ACCENT,
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 24 }}>
        {timeLeft.toFixed(1)}s {t("남음", "left")}
      </div>

      <button
        type="button"
        onClick={onFinish}
        style={{
          background: "#fff",
          color: "#0d0d0d",
          border: "none",
          padding: "14px 44px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.2em",
          cursor: "pointer",
          touchAction: "manipulation",
          boxShadow: "0 6px 20px rgba(255,255,255,0.15)",
        }}
      >
        {t("완료", "DONE")}
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes highnote-record-pop {
  0% { transform: translateX(-50%) translateY(8px) scale(0.85); opacity: 0; }
  20% { transform: translateX(-50%) translateY(0) scale(1.1); opacity: 1; }
  60% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
  100% { transform: translateX(-50%) translateY(-12px) scale(0.95); opacity: 0; }
}
`,
        }}
      />
    </div>
  );
}

// ============================================================
// Result view + chart
// ============================================================

function ResultView({
  maxHz,
  noteName,
  result,
  closest,
  onShare,
  onReset,
  copied,
  t,
}: {
  maxHz: number;
  noteName: string;
  result: { ko: string; en: string };
  closest: Singer | null;
  onShare: () => void;
  onReset: () => void;
  copied: boolean;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const userPct = (() => {
    if (maxHz <= 0) return 0;
    const t = (maxHz - CHART_MIN_HZ) / (CHART_MAX_HZ - CHART_MIN_HZ);
    return Math.max(0, Math.min(1, t)) * 100;
  })();

  return (
    <div className="w-full max-w-xl text-center">
      <p style={{ color: ACCENT, fontSize: 14, letterSpacing: "0.3em", marginBottom: 16 }}>
        {t("당신이 편하게 낼 수 있는 최고음", "Your highest comfortable note")}
      </p>
      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "#fff",
          marginBottom: 6,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {noteName}
      </div>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
        {maxHz > 0 ? `${Math.round(maxHz)} Hz` : t("측정 실패", "Measurement failed")}
      </p>
      <p
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 24,
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
          lineHeight: 1.5,
        }}
      >
        {t(
          "억지로 지른 게 아니라 실제 음역대를 측정한 값이에요",
          "This is your real comfortable range, not strained shouting",
        )}
      </p>

      <p
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 32,
          color: "#fff",
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        {t(result.ko, result.en)}
      </p>

      {/* Chart */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "20px 16px",
          marginBottom: 32,
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: "0.2em",
            color: ACCENT,
            marginBottom: 16,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {t("K-POP 가수 비교", "K-POP SINGER COMPARISON")}
        </div>

        <div className="flex flex-col" style={{ gap: 6 }}>
          {SINGERS.map((s) => {
            const isClosest = closest?.name === s.name;
            const pct = ((s.hz - CHART_MIN_HZ) / (CHART_MAX_HZ - CHART_MIN_HZ)) * 100;
            return (
              <div
                key={s.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px 1fr 60px",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 4px",
                  borderRadius: 8,
                  background: isClosest ? "rgba(255,45,120,0.12)" : "transparent",
                  border: isClosest ? `1px solid ${ACCENT}` : "1px solid transparent",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: isClosest ? "#fff" : "rgba(255,255,255,0.75)",
                    fontWeight: isClosest ? 700 : 500,
                    fontFamily: "var(--font-noto-sans-kr), sans-serif",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.name}
                </div>
                <div style={{ position: "relative", height: 18, background: "rgba(255,255,255,0.06)", borderRadius: 9, overflow: "hidden" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${Math.max(2, Math.min(100, pct))}%`,
                      background: isClosest
                        ? ACCENT
                        : "linear-gradient(90deg, rgba(255,45,120,0.55), rgba(255,45,120,0.35))",
                      borderRadius: 9,
                    }}
                  />
                  {s.song && (
                    <div
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "var(--font-noto-sans-kr), sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.song}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "right",
                    fontFamily: "var(--font-inter), sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* YOU marker line */}
        {maxHz > 0 && (
          <div style={{ position: "relative", marginTop: 14, paddingLeft: 100, paddingRight: 68 }}>
            <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.08)" }}>
              <div
                style={{
                  position: "absolute",
                  left: `${userPct}%`,
                  top: -6,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#FF3B30",
                    boxShadow: "0 0 0 4px rgba(255,59,48,0.25)",
                  }}
                />
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#FF3B30",
                    letterSpacing: "0.15em",
                  }}
                >
                  YOU · {noteName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {closest && maxHz > 0 && (
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginBottom: 24, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
          {t("가장 가까운 가수는", "Closest singer:")} <span style={{ color: ACCENT, fontWeight: 700 }}>{closest.name}</span> ({closest.note})
        </p>
      )}

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
            touchAction: "manipulation",
          }}
        >
          {copied ? t("복사됨", "Copied") : t("공유하기", "SHARE")}
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "14px 32px",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.15em",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          {t("다시 도전", "TRY AGAIN")}
        </button>
      </div>
    </div>
  );
}
