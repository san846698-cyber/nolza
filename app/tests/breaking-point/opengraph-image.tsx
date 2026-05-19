import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "나를 차갑게 만드는 순간 | The Moment I Turn Cold";
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
          background: "linear-gradient(135deg, #12100f 0%, #211b18 48%, #3b3029 100%)",
          color: "#fff2e2",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(216,108,84,.34), transparent 32%), radial-gradient(circle at 82% 18%, rgba(123,140,166,.26), transparent 34%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 170,
            top: -40,
            width: 2,
            height: 760,
            background: "linear-gradient(180deg, transparent, rgba(255,242,226,.58), transparent)",
            transform: "rotate(22deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 246,
            top: 92,
            width: 250,
            height: 380,
            borderRadius: 999,
            border: "2px solid rgba(255,242,226,.28)",
            transform: "rotate(22deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "118px 84px 0",
            width: 790,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 900, color: "#d7a36f", letterSpacing: 3 }}>
            PSYCHOLOGY TEST
          </div>
          <div style={{ marginTop: 20, fontSize: 76, fontWeight: 900, lineHeight: 1.08 }}>
            나를 차갑게 만드는 순간
          </div>
          <div style={{ marginTop: 22, fontSize: 32, fontWeight: 800, color: "rgba(255,242,226,.84)" }}>
            평소의 내가 달라지는 지점은 어디일까요?
          </div>
          <div style={{ marginTop: 28, fontSize: 25, fontWeight: 700, color: "rgba(255,242,226,.68)" }}>
            The Moment I Turn Cold
          </div>
        </div>
      </div>
    ),
    size,
  );
}
