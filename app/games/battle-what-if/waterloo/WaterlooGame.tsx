"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { AdMobileSticky } from "../../../components/Ads";
import {
  AXIS_DESC,
  AXIS_LABEL,
  WATERLOO_DILEMMAS,
  encodePicks,
  evaluate,
  getArchetypeById,
  type Archetype,
  type Axis,
  type Choice,
  type Dilemma,
  type LocalizedString,
} from "@/lib/waterloo";

const SERIF = "var(--font-noto-serif-kr), serif";
const MONO = "var(--font-jetbrains), monospace";
const BG = "#1a1410";
const PAPER = "#241a14";
const FG = "#f4ecd8";
const ACCENT = "#c9a66b";
const DIM = "#a89880";
const BORDER = "rgba(244,236,216,0.18)";

const AXES: Axis[] = ["AGG", "CAU", "DIP", "INT"];

type Phase = "intro" | "dilemma" | "result";

export default function WaterlooGame({
  initialPicks,
}: {
  initialPicks?: Record<string, string>;
}) {
  const { t } = useLocale();
  const hasInitial = !!initialPicks && Object.keys(initialPicks).length === WATERLOO_DILEMMAS.length;
  const [phase, setPhase] = useState<Phase>(hasInitial ? "result" : "intro");
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>(
    hasInitial ? (initialPicks as Record<string, string>) : {},
  );
  const [copied, setCopied] = useState(false);

  const start = () => {
    setStep(0);
    setPicks({});
    setPhase("dilemma");
  };

  const reset = () => {
    setStep(0);
    setPicks({});
    setPhase("intro");
  };

  const select = (dilemma: Dilemma, choice: Choice) => {
    setPicks((prev) => ({ ...prev, [dilemma.id]: choice.id }));
    if (step + 1 < WATERLOO_DILEMMAS.length) {
      setStep(step + 1);
    } else {
      setPhase("result");
    }
  };

  const result = useMemo(() => {
    if (phase !== "result") return null;
    return evaluate(picks);
  }, [phase, picks]);

  const handleShare = async () => {
    if (!result) return;
    const name = t(result.archetype.name.ko, result.archetype.name.en);
    const code = encodePicks(picks);
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://nolza.fun";
    const url = `${origin}/games/battle-what-if/waterloo?p=${code}`;
    const text = t(
      `나폴레옹이라면 — 나의 지휘 유형: ${name} · 나폴레옹과 ${result.commanderMatchCount}/5 일치\n${url}`,
      `If You Were Napoleon — my command type: ${name} · matched Napoleon ${result.commanderMatchCount}/5\n${url}`,
    );
    try {
      // Prefer native share sheet on mobile (one-tap to KakaoTalk, iMessage, etc.)
      if (
        typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { share?: unknown }).share === "function"
      ) {
        await (
          navigator as Navigator & {
            share: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
          }
        ).share({
          title: t("나폴레옹이라면", "If You Were Napoleon"),
          text: t(
            `나의 지휘 유형: ${name} · 나폴레옹과 ${result.commanderMatchCount}/5 일치`,
            `My command type: ${name} · matched Napoleon ${result.commanderMatchCount}/5`,
          ),
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main
      className="page-in bwif-root"
      style={{
        minHeight: "100svh",
        backgroundColor: BG,
        color: FG,
        fontFamily: SERIF,
        position: "relative",
      }}
    >
      <Link
        href="/games/battle-what-if"
        aria-label="back"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          color: DIM,
          fontSize: 24,
          textDecoration: "none",
          zIndex: 5,
        }}
      >
        ←
      </Link>

      <div
        className="mx-auto"
        style={{
          maxWidth: phase === "dilemma" ? 1180 : 720,
          padding: phase === "dilemma" ? "72px 24px 72px" : "96px 24px 96px",
        }}
      >
        {phase === "intro" && <IntroScreen onStart={start} />}
        {phase === "dilemma" && (
          <DilemmaScreen
            key={WATERLOO_DILEMMAS[step].id}
            dilemma={WATERLOO_DILEMMAS[step]}
            onSelect={select}
          />
        )}
        {phase === "result" && result && (
          <ResultScreen
            scores={result.scores}
            archetype={result.archetype}
            commanderMatchCount={result.commanderMatchCount}
            picks={picks}
            onRestart={reset}
            onShare={handleShare}
            copied={copied}
          />
        )}
      </div>
      <AdMobileSticky />
    </main>
  );
}

/* ─────── INTRO ─────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  const { t } = useLocale();
  return (
    <div className="text-center fade-in">
      <div
        style={{
          fontSize: 15,
          color: ACCENT,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {t("1815년 6월 18일 · 몽생장", "18 June 1815 · Mont-Saint-Jean")}
      </div>
      <h1
        style={{
          marginTop: 24,
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: "-0.5px",
        }}
      >
        {t("나폴레옹이라면", "If You Were Napoleon")}
      </h1>
      <div
        style={{
          marginTop: 12,
          fontSize: 19,
          color: DIM,
          fontStyle: "italic",
        }}
      >
        {t("당신의 지휘 성향 진단", "A command-style assessment")}
      </div>
      <p
        style={{
          marginTop: 32,
          fontSize: 19,
          color: FG,
          lineHeight: 1.85,
          letterSpacing: "-0.1px",
          textAlign: "left",
          padding: "24px 28px",
          background: PAPER,
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
        }}
      >
        {t(
          "엘바 탈출 후 100일 천하의 마지막 날. 웰링턴의 영국·연합군이 몽생장 능선에 진을 쳤고, 블뤼허의 프로이센군은 동쪽에서 다가오고 있다. 어젯밤 폭우로 땅이 진창. 당신은 그가 아는 사실만 알고 있다 — 정찰 보고, 참모의 의견, 그루시의 행방 불명. 다섯 번의 결정이 끝나면 당신의 지휘 성향이 나폴레옹·웰링턴·블뤼허 같은 실존 지휘관 유형과 비교된다.",
          "The final day of the Hundred Days after the escape from Elba. Wellington's allied army holds the Mont-Saint-Jean ridge; Blücher's Prussians close from the east. Last night's storm has turned the field to mud. You know only what Napoleon knew — scout reports, staff voices, Grouchy's silence. After five decisions, your command style is matched to a real commander archetype — Napoleon, Wellington, Blücher, and others.",
        )}
      </p>
      <p
        style={{
          marginTop: 16,
          fontSize: 16,
          color: DIM,
          lineHeight: 1.85,
          letterSpacing: "0.02em",
          textAlign: "left",
          padding: "0 4px",
        }}
      >
        {t(
          "각 결정의 브리핑·나폴레옹의 실제·후일담은 Wellington's Despatches·Houssaye(1898)·Chandler(1966)·Roberts(2014)·Barbero(2003) 분석에 근거합니다. 정답은 없습니다 — 당신의 손이 어떤 손인지를 비춰줄 뿐입니다.",
          "Briefings, Napoleon's actual decisions, and shadow outcomes are grounded in Wellington's Despatches, Houssaye (1898), Chandler (1966), Roberts (2014), and Barbero (2003). There is no right answer — the game only mirrors what kind of hand yours is.",
        )}
      </p>
      <div className="mt-12 flex justify-center">
        <Pill onClick={onStart}>{t("지휘를 시작한다", "Take command")}</Pill>
      </div>
    </div>
  );
}

/* ─────── DILEMMA ─────── */
function DilemmaScreen({
  dilemma,
  onSelect,
}: {
  dilemma: Dilemma;
  onSelect: (d: Dilemma, c: Choice) => void;
}) {
  const { t } = useLocale();
  const [revealed, setRevealed] = useState<Choice | null>(null);
  return (
    <div className="fade-in">
      {/* Header — full width */}
      <div
        style={{
          textAlign: "center",
          fontSize: 14,
          color: DIM,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {t(`결정 ${dilemma.index} / 5`, `Decision ${dilemma.index} / 5`)}
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 6,
          fontSize: 15,
          color: ACCENT,
          letterSpacing: "0.08em",
        }}
      >
        {t(dilemma.era.ko, dilemma.era.en)} · {t(dilemma.location.ko, dilemma.location.en)}
      </div>

      {/* Two-column body: scene+briefing on left, prompt+choices on right */}
      <style>{`
        .waterloo-dilemma-grid {
          display: grid;
          gap: 28px;
          grid-template-columns: 1fr;
          align-items: start;
          margin-top: 24px;
        }
        @media (min-width: 880px) {
          .waterloo-dilemma-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }
      `}</style>
      <div className="waterloo-dilemma-grid">
          {/* LEFT — scene + briefing */}
          <div>
            <p
              style={{
                fontSize: 18,
                color: FG,
                lineHeight: 1.85,
                letterSpacing: "-0.1px",
                padding: "18px 22px",
                background: PAPER,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                margin: 0,
              }}
            >
              {t(dilemma.scene.ko, dilemma.scene.en)}
            </p>

            <div
              style={{
                marginTop: 16,
                padding: "14px 18px",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: ACCENT,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {t("당신이 알고 있는 것", "What you know")}
              </div>
              {dilemma.briefing.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 0 8px 12px",
                    borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                    borderLeft: `2px solid ${ACCENT}33`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: DIM,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    {t(item.label.ko, item.label.en)}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: FG,
                      lineHeight: 1.7,
                      letterSpacing: "-0.05px",
                    }}
                  >
                    {t(item.value.ko, item.value.en)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — prompt + choices/aftermath */}
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1.5,
                letterSpacing: "-0.2px",
                textAlign: "left",
              }}
            >
              {t(dilemma.prompt.ko, dilemma.prompt.en)}
            </h3>

            {revealed ? (
              <AftermathCard
                choice={revealed}
                onContinue={() => onSelect(dilemma, revealed)}
              />
            ) : (
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                {dilemma.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setRevealed(choice)}
                    style={{
                      padding: "14px 18px",
                      background: PAPER,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      color: FG,
                      fontFamily: SERIF,
                      fontSize: 17,
                      lineHeight: 1.5,
                      letterSpacing: "-0.1px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "border-color 200ms, background 200ms, transform 80ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = ACCENT;
                      e.currentTarget.style.background = "#2c2118";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                      e.currentTarget.style.background = PAPER;
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "scale(0.99)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{t(choice.label.ko, choice.label.en)}</div>
                    {choice.reasoning && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 14,
                          color: DIM,
                          fontStyle: "italic",
                          lineHeight: 1.6,
                        }}
                      >
                        {t(choice.reasoning.ko, choice.reasoning.en)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

/* ─────── AFTERMATH CARD ─────── */
function AftermathCard({
  choice,
  onContinue,
}: {
  choice: Choice;
  onContinue: () => void;
}) {
  const { t } = useLocale();
  return (
    <div style={{ marginTop: 28 }} className="fade-in">
      <div
        style={{
          padding: "22px 24px",
          background: PAPER,
          border: `1px solid ${ACCENT}55`,
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: ACCENT,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {t("당신의 선택", "Your choice")}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 20,
            color: FG,
            fontWeight: 500,
            lineHeight: 1.55,
            letterSpacing: "-0.2px",
          }}
        >
          {t(choice.label.ko, choice.label.en)}
        </div>
        {choice.reasoning && (
          <div
            style={{
              marginTop: 10,
              fontSize: 16,
              color: DIM,
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            {t(choice.reasoning.ko, choice.reasoning.en)}
          </div>
        )}

        <div
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: DIM,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("후일담", "Shadow outcome")}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 17,
              color: FG,
              lineHeight: 1.85,
              letterSpacing: "-0.05px",
            }}
          >
            {t(choice.shadowOutcome.ko, choice.shadowOutcome.en)}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Pill onClick={onContinue}>{t("계속", "Continue")}</Pill>
      </div>
    </div>
  );
}

/* ─────── RESULT ─────── */
function ResultScreen({
  scores,
  archetype,
  commanderMatchCount,
  picks,
  onRestart,
  onShare,
  copied,
}: {
  scores: Record<Axis, number>;
  archetype: Archetype;
  commanderMatchCount: number;
  picks: Record<string, string>;
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  const { t } = useLocale();
  const code = encodePicks(picks);
  const shareCardUrl = `/games/battle-what-if/waterloo/share-card?p=${code}`;

  return (
    <div className="fade-in">
      {/* Small archetype headline — context for the timeline below */}
      <div
        style={{
          textAlign: "center",
          fontSize: 14,
          color: ACCENT,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {t("당신의 지휘 성격", "Your command personality")}
      </div>
      <h2
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: 34,
          fontWeight: 700,
          color: ACCENT,
          letterSpacing: "-0.4px",
          lineHeight: 1.2,
        }}
      >
        {t(archetype.name.ko, archetype.name.en)}
      </h2>
      <p
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: 18,
          color: FG,
          lineHeight: 1.7,
          fontStyle: "italic",
          letterSpacing: "-0.05px",
          padding: "0 8px",
        }}
      >
        "{t(archetype.signature.ko, archetype.signature.en)}"
      </p>

      {/* MAIN — five-decision timeline with personality/judgment per choice */}
      <HistoryTimeline picks={picks} commanderMatchCount={commanderMatchCount} />

      {/* Action row */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Pill onClick={onShare}>
          {copied ? t("링크 복사됨", "Link copied") : t("링크 공유", "Share link")}
        </Pill>
        <Pill onClick={onRestart}>{t("다시", "Again")}</Pill>
      </div>
    </div>
  );
}

/* ─────── AXIS BAR ─────── */
function AxisBar({ axis, value }: { axis: Axis; value: number }) {
  const { t } = useLocale();
  const cap = 6;
  const clamped = Math.max(-cap, Math.min(cap, value));
  const negFrac = clamped < 0 ? Math.abs(clamped) / cap : 0;
  const posFrac = clamped > 0 ? clamped / cap : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontSize: 15,
            color: FG,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {t(AXIS_LABEL[axis].ko, AXIS_LABEL[axis].en)}
        </span>
        <span
          style={{
            fontSize: 15,
            color: value >= 0 ? ACCENT : DIM,
            fontFamily: MONO,
            letterSpacing: "0.04em",
          }}
        >
          {value > 0 ? "+" : ""}
          {value}
        </span>
      </div>
      <div
        style={{
          fontSize: 14,
          color: DIM,
          lineHeight: 1.6,
          fontStyle: "italic",
          marginBottom: 8,
        }}
      >
        {t(AXIS_DESC[axis].ko, AXIS_DESC[axis].en)}
      </div>
      <div
        style={{
          position: "relative",
          height: 6,
          background: "rgba(244,236,216,0.06)",
          borderRadius: 3,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: BORDER,
          }}
        />
        {posFrac > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: `${posFrac * 50}%`,
              background: ACCENT,
              borderRadius: "0 3px 3px 0",
            }}
          />
        )}
        {negFrac > 0 && (
          <div
            style={{
              position: "absolute",
              right: "50%",
              top: 0,
              bottom: 0,
              width: `${negFrac * 50}%`,
              background: DIM,
              borderRadius: "3px 0 0 3px",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ─────── TRAIT BLOCK (강점 / 주의점) ─────── */
function TraitBlock({
  label,
  color,
  items,
}: {
  label: string;
  color: string;
  items: LocalizedString[];
}) {
  const { t } = useLocale();
  return (
    <div
      style={{
        padding: "18px 20px",
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 16,
              color: FG,
              lineHeight: 1.6,
              letterSpacing: "-0.05px",
            }}
          >
            <span style={{ color, flexShrink: 0 }}>—</span>
            <span>{t(item.ko, item.en)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────── CHEMISTRY CARD (궁합) ─────── */
function ChemistryCard({
  kind,
  label,
  archetype,
}: {
  kind: "pair" | "clash";
  label: string;
  archetype: Archetype;
}) {
  const { t } = useLocale();
  const tone = kind === "pair" ? ACCENT : "#b86b5a";
  return (
    <div
      style={{
        padding: "16px 18px",
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderLeft: `3px solid ${tone}`,
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: tone,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          color: FG,
          fontWeight: 600,
          letterSpacing: "-0.1px",
          lineHeight: 1.4,
        }}
      >
        {t(archetype.name.ko, archetype.name.en)}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 15,
          color: DIM,
          lineHeight: 1.65,
          fontStyle: "italic",
          letterSpacing: "-0.02px",
        }}
      >
        "{t(archetype.signature.ko, archetype.signature.en)}"
      </div>
    </div>
  );
}

/* ─────── HISTORY TIMELINE (역사가 바뀐 이야기) ─────── */
// Renders the user's five picks as an alternate-history journal.
// All factual content comes from existing shadowOutcome / commanderActual /
// sources fields in lib/waterloo.ts — no new historical claims invented.
function HistoryTimeline({
  picks,
  commanderMatchCount,
}: {
  picks: Record<string, string>;
  commanderMatchCount: number;
}) {
  const { t } = useLocale();

  const opener =
    commanderMatchCount === 5
      ? t(
          "다섯 결정 모두 나폴레옹과 같았다. 사료가 기록한 그대로의 길이 당신의 길 — 매 순간 같은 무게의 결정을 내린 사람의 일관성.",
          "All five decisions matched Napoleon. The road the sources record is your road — the consistency of someone who weighed every fork the same way.",
        )
      : commanderMatchCount === 0
        ? t(
            "다섯 결정 모두 나폴레옹과 다른 길을 골랐다. 사료에 없는 워털루가 당신의 워털루 — 자기만의 시선으로 갈림길을 읽어낸 결과.",
            "All five diverged from Napoleon. The Waterloo the sources never wrote is yours — the result of reading every fork through your own eyes.",
        )
        : t(
            `다섯 갈림길 중 ${commanderMatchCount}번은 나폴레옹과 같은 결정, ${5 - commanderMatchCount}번은 다른 결정이었다. 그 차이가 곧 당신의 성격이고 판단력이다.`,
            `Of the five forks, ${commanderMatchCount} matched Napoleon and ${5 - commanderMatchCount} did not. That difference is your personality and your judgment.`,
        );

  return (
    <div style={{ marginTop: 44 }}>
      {/* Section eyebrow + main headline */}
      <div
        style={{
          fontSize: 12,
          color: ACCENT,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {t("성격과 판단력 진단", "Personality & Judgment Reading")}
      </div>
      <h3
        style={{
          margin: "12px 0 0",
          textAlign: "center",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: FG,
          lineHeight: 1.25,
        }}
      >
        {t(
          "당신의 다섯 결정이 그려낸 가지(枝)",
          "The branch your five decisions traced",
        )}
      </h3>
      <p
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: 17,
          color: DIM,
          lineHeight: 1.85,
          fontStyle: "italic",
          letterSpacing: "-0.02px",
          padding: "0 8px",
        }}
      >
        {opener}
      </p>

      {/* Chapters */}
      <div
        style={{
          marginTop: 28,
          position: "relative",
          paddingLeft: 24,
        }}
      >
        {/* Vertical timeline rail */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 6,
            bottom: 6,
            left: 7,
            width: 2,
            background: `linear-gradient(${ACCENT}33, ${ACCENT}66, ${ACCENT}33)`,
            borderRadius: 1,
          }}
        />
        {WATERLOO_DILEMMAS.map((d) => {
          const pickId = picks[d.id];
          const pick = d.choices.find((c) => c.id === pickId);
          if (!pick) return null;
          const matched = !!pick.isCommanderChoice;
          return (
            <div
              key={d.id}
              style={{
                position: "relative",
                marginBottom: 28,
              }}
            >
              {/* Node dot */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: -23,
                  top: 4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: matched ? ACCENT : BG,
                  border: `2px solid ${ACCENT}`,
                  boxShadow: `0 0 0 4px ${BG}`,
                }}
              />

              {/* Chapter header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: DIM,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {t(`제 ${d.index} 장`, `Chapter ${d.index}`)} · {t(d.era.ko, d.era.en)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: matched ? "#7ad77a" : DIM,
                    fontFamily: MONO,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  {matched ? t("✓ 나폴레옹과 같음", "✓ matched Napoleon") : t("· 다른 결정", "· different decision")}
                </div>
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: ACCENT,
                  fontWeight: 600,
                  letterSpacing: "-0.1px",
                  marginBottom: 12,
                }}
              >
                {t(d.location.ko, d.location.en)}
              </div>

              {/* Narrative card */}
              <div
                style={{
                  padding: "14px 16px",
                  background: PAPER,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                }}
              >
                {/* Lead-in: what you chose */}
                <div
                  style={{
                    fontSize: 16,
                    color: FG,
                    lineHeight: 1.7,
                    letterSpacing: "-0.05px",
                  }}
                >
                  <span style={{ color: DIM }}>
                    {t("당신은 ", "You chose to ")}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {t(pick.label.ko, pick.label.en)}
                  </span>
                  <span style={{ color: DIM }}>{t("을 택했다.", ".")}</span>
                </div>

                {/* Personality / judgment evaluation — what this choice reveals */}
                <div
                  style={{
                    marginTop: 12,
                    padding: "12px 14px",
                    background: "rgba(201,166,107,0.08)",
                    borderLeft: `3px solid ${ACCENT}`,
                    borderRadius: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: ACCENT,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    {t("이 선택이 보여주는 당신", "What this choice reveals about you")}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: FG,
                      lineHeight: 1.75,
                      letterSpacing: "-0.05px",
                    }}
                  >
                    {t(pick.judgment.ko, pick.judgment.en)}
                  </div>
                </div>

                {/* Ripple — research-grounded shadowOutcome */}
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: `1px dashed ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: DIM,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {t("그 결정이 만든 가지", "The branch this decision grew")}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: DIM,
                      lineHeight: 1.75,
                      fontStyle: "italic",
                      letterSpacing: "-0.02px",
                    }}
                  >
                    {t(pick.shadowOutcome.ko, pick.shadowOutcome.en)}
                  </div>
                </div>

                {/* Counterpoint — what Napoleon actually did, only when differed */}
                {!matched && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: DIM,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {t("사료가 기록한 나폴레옹", "Napoleon in the sources")}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: DIM,
                        lineHeight: 1.7,
                      }}
                    >
                      {t(d.commanderActual.ko, d.commanderActual.en)}
                    </div>
                  </div>
                )}

                {/* Sources footer */}
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 8,
                    borderTop: `1px dashed ${BORDER}`,
                    fontSize: 12,
                    color: DIM,
                    fontFamily: MONO,
                    lineHeight: 1.6,
                    letterSpacing: "0.01em",
                  }}
                >
                  {t(d.sources.ko, d.sources.en)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────── SHARE CARD PANEL ─────── */
// Visual replica of the downloadable PNG — designed for screenshots and
// in-page bragging rights. The "이미지 저장" button opens the actual PNG
// (rendered server-side) in a new tab where users can long-press / right-click
// to save and share to KakaoTalk, Instagram, etc.
function ShareCardPanel({
  archetypeName,
  archetypeSignature,
  scores,
  commanderMatchCount,
  shareCardUrl,
  onShare,
  copied,
}: {
  archetypeName: LocalizedString;
  archetypeSignature: LocalizedString;
  scores: Record<Axis, number>;
  commanderMatchCount: number;
  shareCardUrl: string;
  onShare: () => void;
  copied: boolean;
}) {
  const { t } = useLocale();
  const cap = 6;
  const bar = (v: number) => Math.min(1, Math.abs(v) / cap);

  return (
    <div>
      {/* The visual card — square-ish on desktop, scales on mobile */}
      <div
        style={{
          position: "relative",
          padding: "32px 28px 28px",
          background: PAPER,
          border: `2px solid ${BORDER}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Decorative corner ornament */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          }}
        />

        {/* Brand strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 12,
            color: ACCENT,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span>{t("나폴레옹이라면", "If You Were Napoleon")}</span>
          <span style={{ color: DIM }}>
            {t("전쟁의 갈림길", "Crossroads of War")}
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: 24,
            fontSize: 14,
            color: DIM,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {t("당신의 지휘 유형", "Your command type")}
        </div>

        {/* Archetype name BIG */}
        <h2
          style={{
            margin: 0,
            marginTop: 8,
            fontSize: "clamp(28px, 5.6vw, 44px)",
            fontWeight: 800,
            color: ACCENT,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {t(archetypeName.ko, archetypeName.en)}
        </h2>

        {/* Signature */}
        <div
          style={{
            marginTop: 18,
            padding: "16px 18px",
            background: "rgba(244,236,216,0.04)",
            borderLeft: `3px solid ${ACCENT}`,
            borderRadius: 4,
            fontSize: 18,
            color: FG,
            lineHeight: 1.65,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
          }}
        >
          "{t(archetypeSignature.ko, archetypeSignature.en)}"
        </div>

        {/* Axes 2x2 mini-grid */}
        <div
          className="waterloo-share-axes"
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {AXES.map((axis) => {
            const v = scores[axis];
            const frac = bar(v);
            const sign = v > 0 ? "+" : "";
            return (
              <div
                key={axis}
                style={{
                  padding: "10px 12px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: FG,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {t(AXIS_LABEL[axis].ko, AXIS_LABEL[axis].en)}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: v >= 0 ? ACCENT : DIM,
                      fontFamily: MONO,
                      fontWeight: 700,
                    }}
                  >
                    {sign}
                    {v}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 6,
                    height: 5,
                    background: "rgba(244,236,216,0.06)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${frac * 100}%`,
                      height: "100%",
                      background: v >= 0 ? ACCENT : DIM,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Match badge */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: DIM,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {t("나폴레옹과의 일치", "Match with Napoleon")}
            </div>
            <div
              style={{
                marginTop: 2,
                display: "flex",
                alignItems: "baseline",
                gap: 3,
                fontFamily: MONO,
              }}
            >
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: ACCENT,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {commanderMatchCount}
              </span>
              <span style={{ fontSize: 18, color: DIM }}>/ 5</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: ACCENT,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            nolza.fun
          </div>
        </div>
      </div>

      {/* CTA row */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onShare}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: `1px solid ${ACCENT}`,
            borderRadius: 999,
            color: ACCENT,
            fontFamily: SERIF,
            fontSize: 16,
            letterSpacing: "0.08em",
            cursor: "pointer",
            transition: "background 150ms, color 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = ACCENT;
            e.currentTarget.style.color = BG;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = ACCENT;
          }}
        >
          {copied
            ? t("링크 복사됨", "Link copied")
            : t("링크 공유", "Share link")}
        </button>
      </div>
      <div
        style={{
          marginTop: 10,
          textAlign: "center",
          fontSize: 14,
          color: DIM,
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
      >
        {t(
          "모바일에서 길게 눌러 저장 · 인스타·카톡 프로필에 그대로 올리기 좋아요",
          "Long-press to save on mobile · ready for Instagram and Kakao",
        )}
      </div>
    </div>
  );
}

/* ─────── PILL ─────── */
function Pill({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 28px",
        background: "transparent",
        border: `1px solid ${ACCENT}`,
        borderRadius: 999,
        color: ACCENT,
        fontFamily: SERIF,
        fontSize: 17,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "background 150ms, color 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = ACCENT;
        e.currentTarget.style.color = BG;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = ACCENT;
      }}
    >
      {children}
    </button>
  );
}
