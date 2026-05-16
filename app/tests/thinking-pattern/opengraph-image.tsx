import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "인지왜곡 테스트 | Thinking Pattern Test";
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
          background: "linear-gradient(135deg, #151416 0%, #272231 48%, #eadbc3 100%)",
          color: "#fff8ea",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 22% 20%, rgba(222,166,93,.28), transparent 34%), radial-gradient(circle at 76% 24%, rgba(138,130,184,.34), transparent 36%)" }} />
        <div style={{ position: "absolute", left: 90, top: 85, width: 360, height: 300, borderRadius: "42% 58% 48% 52%", border: "2px solid rgba(255,248,234,.36)", background: "linear-gradient(135deg, rgba(255,248,234,.25), rgba(138,130,184,.18))", boxShadow: "0 34px 90px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: 160, top: 145, width: 220, height: 180, borderRadius: "58% 42% 52% 48%", border: "2px solid rgba(255,248,234,.42)", background: "linear-gradient(135deg, rgba(255,228,176,.32), rgba(159,101,48,.18))" }} />
        <div style={{ position: "absolute", left: 247, top: 208, width: 58, height: 58, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffe1aa, #b56b35 62%, #4b3e61)", boxShadow: "0 0 44px rgba(222,166,93,.55)" }} />
        <div style={{ position: "absolute", left: 62, top: 244, width: 410, height: 2, transform: "rotate(24deg)", background: "linear-gradient(90deg, transparent, rgba(255,248,234,.62), transparent)" }} />
        <div style={{ position: "absolute", left: 90, top: 245, width: 380, height: 2, transform: "rotate(-31deg)", background: "linear-gradient(90deg, transparent, rgba(255,248,234,.48), transparent)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "360px 86px 0", width: "100%" }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#f0c16b", letterSpacing: 2 }}>SELF REFLECTION TEST</div>
          <div style={{ marginTop: 18, fontSize: 72, fontWeight: 900, lineHeight: 1.08 }}>인지왜곡 테스트</div>
          <div style={{ marginTop: 16, fontSize: 30, fontWeight: 700, color: "rgba(255,248,234,.84)" }}>내 생각은 어디서 자주 꼬일까?</div>
        </div>
      </div>
    ),
    size,
  );
}
