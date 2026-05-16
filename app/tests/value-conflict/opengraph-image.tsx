import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "가치관 갈등 테스트 — Value Conflict Test";
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
          background: "linear-gradient(135deg, #171817 0%, #2b2821 48%, #e8d9bd 100%)",
          color: "#fff8ea",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 24% 24%, rgba(221, 171, 83, .32), transparent 34%), radial-gradient(circle at 78% 28%, rgba(118, 151, 205, .28), transparent 34%)" }} />
        <div style={{ position: "absolute", left: 100, top: 108, width: 210, height: 210, borderRadius: "50%", background: "linear-gradient(135deg, #f0c16b, #8e5c20)", boxShadow: "0 30px 80px rgba(0,0,0,.28)" }} />
        <div style={{ position: "absolute", right: 100, top: 108, width: 210, height: 210, borderRadius: "50%", background: "linear-gradient(135deg, #d9e6ff, #526b93)", boxShadow: "0 30px 80px rgba(0,0,0,.28)" }} />
        <div style={{ position: "absolute", left: 260, right: 260, top: 214, height: 2, background: "linear-gradient(90deg, transparent, rgba(255,248,234,.82), transparent)" }} />
        <div style={{ position: "absolute", left: 598, top: 80, width: 4, height: 285, background: "linear-gradient(180deg, transparent, rgba(255,248,234,.8), transparent)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "380px 88px 0", width: "100%" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#f0c16b", letterSpacing: 2 }}>SELF REFLECTION TEST</div>
          <div style={{ marginTop: 18, fontSize: 72, fontWeight: 900, lineHeight: 1.08 }}>가치관 갈등 테스트</div>
          <div style={{ marginTop: 16, fontSize: 30, fontWeight: 700, color: "rgba(255,248,234,.82)" }}>당신 안에서 충돌하는 두 가지 가치는?</div>
        </div>
      </div>
    ),
    size,
  );
}
