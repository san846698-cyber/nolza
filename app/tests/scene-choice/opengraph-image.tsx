import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "무의식 장면 테스트 | The Scene You Notice First";
export const size = { width: 1200, height: 630 };
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
          background: "linear-gradient(135deg, #15120f 0%, #252018 48%, #5b4632 100%)",
          color: "#fff1d8",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(219, 171, 101, .34), transparent 32%), radial-gradient(circle at 80% 18%, rgba(107, 134, 162, .28), transparent 34%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 110,
            top: 78,
            width: 290,
            height: 380,
            borderRadius: 34,
            border: "2px solid rgba(255,241,216,.34)",
            background: "rgba(255,241,216,.06)",
            boxShadow: "0 34px 90px rgba(0,0,0,.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 176,
            top: 136,
            width: 120,
            height: 150,
            borderRadius: "60px 60px 12px 12px",
            border: "2px solid rgba(255,241,216,.48)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 266,
            bottom: 132,
            width: 92,
            height: 2,
            background: "rgba(255,241,216,.55)",
            transform: "rotate(-18deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "128px 86px 0",
            width: "760px",
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 900, color: "#dcb36f", letterSpacing: 3 }}>
            PSYCHOLOGY TEST
          </div>
          <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, lineHeight: 1.04 }}>
            무의식 장면 테스트
          </div>
          <div style={{ marginTop: 18, fontSize: 34, fontWeight: 800, color: "rgba(255,241,216,.84)" }}>
            당신이 먼저 보는 장면은?
          </div>
          <div style={{ marginTop: 26, fontSize: 25, fontWeight: 700, color: "rgba(255,241,216,.68)" }}>
            The Scene You Notice First
          </div>
        </div>
      </div>
    ),
    size,
  );
}
