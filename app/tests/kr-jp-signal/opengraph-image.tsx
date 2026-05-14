import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "이거 호감임? 문화차이임? 한일 문화 신호 테스트";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #15141f 0%, #252235 54%, #161923 100%)",
          color: "#f7f3ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -120,
            top: 80,
            width: 360,
            height: 360,
            borderRadius: 360,
            background: "rgba(251, 191, 36, 0.16)",
            border: "2px solid rgba(255,255,255,0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -90,
            bottom: 20,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: "rgba(125, 211, 252, 0.13)",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 92,
            width: 260,
            height: 86,
            borderRadius: 30,
            border: "2px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 160,
            top: 126,
            width: 130,
            height: 5,
            borderRadius: 999,
            background: "rgba(255,255,255,0.36)",
            boxShadow: "0 18px 0 rgba(255,255,255,0.22)",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 86px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "fit-content",
              padding: "12px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              color: "#fbbf24",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            KR JP SIGNAL TEST
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              maxWidth: 850,
              fontSize: 82,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            이거 호감임?
            <br />
            문화차이임?
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 850,
              color: "rgba(247,243,234,0.76)",
              fontSize: 30,
              lineHeight: 1.4,
              fontWeight: 700,
            }}
          >
            말투, 답장, 약속, 거리감으로 보는 한일 문화 신호 테스트
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 42,
              fontSize: 24,
              fontWeight: 900,
            }}
          >
            <span style={{ padding: "12px 18px", borderRadius: 18, background: "#fbbf24", color: "#17151f" }}>
              12 SCENARIOS
            </span>
            <span style={{ padding: "12px 18px", borderRadius: 18, background: "#7dd3fc", color: "#17151f" }}>
              NO AI API
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
