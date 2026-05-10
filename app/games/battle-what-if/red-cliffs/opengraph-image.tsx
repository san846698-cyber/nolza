import { ImageResponse } from "next/og";
import { AXIS_LABEL, decodePicks, evaluate, type Axis } from "@/lib/red-cliffs";

export const alt = "주유라면 — 적벽의 다섯 갈림길";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#1a1410";
const PAPER = "#241a14";
const FG = "#f4ecd8";
const ACCENT = "#c9a66b";
const DIM = "#a89880";
const BORDER = "rgba(244,236,216,0.18)";

const AXES: Axis[] = ["AGG", "CAU", "DIP", "INT"];

type SearchParams = { p?: string | string[] };

function pickParam(p: string | string[] | undefined): string | undefined {
  if (Array.isArray(p)) return p[0];
  return p ?? undefined;
}

export default async function OG({
  params: _params,
  searchParams,
}: {
  params?: Record<string, string>;
  searchParams?: SearchParams;
}) {
  const code = pickParam(searchParams?.p);
  const picks = decodePicks(code ?? null);

  // Default (no result) card — game pitch
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
            padding: "80px 96px",
            backgroundColor: BG,
            color: FG,
            fontFamily: "serif",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: ACCENT,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              display: "flex",
            }}
          >
            전쟁의 갈림길 · CROSSROADS OF WAR
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 96,
              fontWeight: 800,
              color: ACCENT,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            주유라면
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              color: FG,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            장강 양안, 다섯 번의 결단.
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: DIM,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            당신의 지휘 유형은?
          </div>
          <div
            style={{
              marginTop: "auto",
              fontSize: 24,
              color: DIM,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              display: "flex",
            }}
          >
            nolza.fun
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const { archetype, commanderMatchCount, scores } = evaluate(picks);
  const archetypeName = archetype.name.ko;
  const signature = archetype.signature.ko;
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
          padding: "56px 72px",
          backgroundColor: BG,
          color: FG,
          fontFamily: "serif",
        }}
      >
        {/* Top brand strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: ACCENT,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>주유라면 · 적벽대전</div>
          <div style={{ display: "flex", color: DIM }}>nolza.fun</div>
        </div>

        {/* Two columns body */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            flex: 1,
            gap: 48,
          }}
        >
          {/* LEFT — name + signature */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
              당신의 지휘 유형
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 60,
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
            <div
              style={{
                marginTop: 24,
                padding: "20px 24px",
                background: PAPER,
                border: `1px solid ${BORDER}`,
                borderLeft: `4px solid ${ACCENT}`,
                borderRadius: 6,
                fontSize: 24,
                color: FG,
                lineHeight: 1.5,
                fontStyle: "italic",
                display: "flex",
              }}
            >
              "{signature}"
            </div>
          </div>

          {/* RIGHT — axes + match */}
          <div
            style={{
              width: 420,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
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
                      display: "flex",
                      flexDirection: "column",
                      padding: "8px 0",
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
                          fontSize: 18,
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
                          fontSize: 18,
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
                        marginTop: 6,
                        position: "relative",
                        height: 8,
                        background: "rgba(244,236,216,0.06)",
                        borderRadius: 4,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: `${frac * 100}%`,
                          background: v >= 0 ? ACCENT : DIM,
                          borderRadius: 4,
                          display: "flex",
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
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "20px 24px",
                background: PAPER,
                border: `2px solid ${BORDER}`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontSize: 18,
                  color: DIM,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                주유와의 일치
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  fontFamily: "monospace",
                }}
              >
                <span
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    color: ACCENT,
                    lineHeight: 1,
                  }}
                >
                  {commanderMatchCount}
                </span>
                <span style={{ fontSize: 28, color: DIM }}>/ 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
