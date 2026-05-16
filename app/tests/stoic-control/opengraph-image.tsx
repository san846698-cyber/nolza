import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "스토아 철학 테스트 | Stoic Control Test";
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
          background: "linear-gradient(135deg, #161614 0%, #2a2721 48%, #ead9bd 100%)",
          color: "#fff8ea",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 22% 20%, rgba(214,173,104,.3), transparent 34%), radial-gradient(circle at 78% 25%, rgba(113,124,131,.28), transparent 36%)" }} />
        <div style={{ position: "absolute", left: 112, top: 96, width: 330, height: 275, borderRadius: "42% 58% 47% 53%", border: "2px solid rgba(255,248,234,.36)", background: "linear-gradient(135deg, rgba(255,248,234,.25), rgba(113,124,131,.22))", boxShadow: "0 34px 90px rgba(0,0,0,.3)", transform: "rotate(-10deg)" }} />
        <div style={{ position: "absolute", left: 300, top: 156, width: 220, height: 180, borderRadius: "58% 42% 52% 48%", border: "2px solid rgba(255,248,234,.34)", background: "linear-gradient(135deg, rgba(255,238,207,.3), rgba(137,101,56,.18))", transform: "rotate(15deg)" }} />
        <div style={{ position: "absolute", left: 168, top: 70, width: 420, height: 420, border: "2px solid rgba(255,248,234,.22)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", left: 246, top: 148, width: 264, height: 264, border: "2px dashed rgba(255,248,234,.22)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", left: 350, top: 252, width: 62, height: 62, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffe1a4, #aa7440 62%, #384146)", boxShadow: "0 0 44px rgba(214,173,104,.52)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "360px 86px 0", width: "100%" }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#f0c16b", letterSpacing: 2 }}>STOIC CONTROL</div>
          <div style={{ marginTop: 18, fontSize: 70, fontWeight: 900, lineHeight: 1.08 }}>스토아 철학 테스트</div>
          <div style={{ marginTop: 16, fontSize: 30, fontWeight: 700, color: "rgba(255,248,234,.84)" }}>불안할 때, 나는 무엇을 붙잡으려 할까요?</div>
        </div>
      </div>
    ),
    size,
  );
}
