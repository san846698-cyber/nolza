import { ImageResponse } from "next/og";
import {
  AXIS_LABEL,
  decodePicks,
  evaluate,
  type Axis,
} from "@/lib/red-cliffs";

export const runtime = "nodejs";

const BG = "#1a1410";
const PAPER = "#241a14";
const FG = "#f4ecd8";
const ACCENT = "#c9a66b";
const DIM = "#a89880";
const BORDER = "rgba(244,236,216,0.18)";
const SIZE = 1080;

const AXES: Axis[] = ["AGG", "CAU", "DIP", "INT"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("p");
  const picks = decodePicks(code);

  if (!picks) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: BG,
            color: FG,
            fontFamily: "serif",
            padding: 80,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: ACCENT,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            전쟁의 갈림길
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 124,
              fontWeight: 800,
              color: ACCENT,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            주유라면
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 36,
              color: FG,
              lineHeight: 1.4,
            }}
          >
            장강 양안, 다섯 번의 결단.
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 32,
              color: DIM,
              lineHeight: 1.4,
            }}
          >
            당신의 지휘 유형은?
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 64,
              fontSize: 26,
              color: DIM,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            nolza.fun
          </div>
        </div>
      ),
      { width: SIZE, height: SIZE },
    );
  }

  const { archetype, commanderMatchCount, scores } = evaluate(picks);
  const archetypeName = archetype.name.ko;
  const signature = archetype.signature.ko;

  // Bars use raw scores normalized into 0..1 against a fixed cap of 6.
  const cap = 6;
  const bar = (v: number) => Math.min(1, Math.abs(v) / cap);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG,
          color: FG,
          fontFamily: "serif",
          padding: "72px 80px",
        }}
      >
        {/* Top brand strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: ACCENT,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>주유라면</div>
          <div style={{ display: "flex", color: DIM }}>
            전쟁의 갈림길
          </div>
        </div>

        {/* Archetype label */}
        <div
          style={{
            marginTop: 56,
            fontSize: 28,
            color: DIM,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "flex",
          }}
        >
          당신의 지휘 유형
        </div>

        {/* Archetype name BIG */}
        <div
          style={{
            marginTop: 18,
            fontSize: 78,
            fontWeight: 800,
            color: ACCENT,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {archetypeName}
        </div>

        {/* Signature */}
        <div
          style={{
            marginTop: 32,
            padding: "26px 30px",
            background: PAPER,
            border: `2px solid ${BORDER}`,
            borderLeft: `6px solid ${ACCENT}`,
            borderRadius: 8,
            fontSize: 32,
            color: FG,
            lineHeight: 1.55,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          "{signature}"
        </div>

        {/* Axis 2x2 mini-grid */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {[0, 2].map((row) => (
            <div key={row} style={{ display: "flex", gap: 18 }}>
              {[AXES[row], AXES[row + 1]].map((axis) => {
                const v = scores[axis];
                const frac = bar(v);
                const sign = v > 0 ? "+" : "";
                return (
                  <div
                    key={axis}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      padding: "16px 22px",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          color: FG,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          display: "flex",
                        }}
                      >
                        {AXIS_LABEL[axis].ko}
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          color: v >= 0 ? ACCENT : DIM,
                          fontFamily: "monospace",
                          fontWeight: 700,
                          display: "flex",
                        }}
                      >
                        {sign}
                        {v}
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        position: "relative",
                        height: 10,
                        background: "rgba(244,236,216,0.06)",
                        borderRadius: 5,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: `${frac * 100}%`,
                          background: v >= 0 ? ACCENT : DIM,
                          borderRadius: 5,
                          display: "flex",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Match badge */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 36,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                color: DIM,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "flex",
              }}
            >
              주유와의 일치
            </div>
            <div
              style={{
                marginTop: 4,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                fontFamily: "monospace",
              }}
            >
              <span
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: ACCENT,
                  lineHeight: 1,
                }}
              >
                {commanderMatchCount}
              </span>
              <span style={{ fontSize: 36, color: DIM }}>/ 5</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 26,
              color: ACCENT,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 800,
              display: "flex",
            }}
          >
            nolza.fun
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
