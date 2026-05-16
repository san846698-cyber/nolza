import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "짝사랑 유형 테스트 — Crush Type Test";
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
          background: "linear-gradient(135deg, #241423 0%, #4c2638 46%, #fff1df 100%)",
          color: "#fff7eb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            right: -80,
            top: -90,
            background: "radial-gradient(circle, rgba(255,130,136,.55), rgba(255,130,136,0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            left: 110,
            bottom: -100,
            background: "radial-gradient(circle, rgba(255,206,134,.36), rgba(255,206,134,0) 68%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 84px", zIndex: 2 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: ".08em", color: "#ffd5c9" }}>NOLZA.FUN RELATIONSHIP TEST</div>
          <div style={{ marginTop: 24, fontSize: 78, fontWeight: 900, lineHeight: 1.1 }}>짝사랑 유형 테스트</div>
          <div style={{ marginTop: 22, fontSize: 38, fontWeight: 700, lineHeight: 1.35, color: "#fff1df" }}>
            좋아하는 사람 앞에서 나는 왜 이상해질까?
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 110,
            bottom: 92,
            width: 220,
            height: 150,
            borderRadius: 34,
            background: "rgba(255,255,255,.8)",
            boxShadow: "0 26px 70px rgba(30,12,20,.24)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 170,
            bottom: 160,
            width: 150,
            height: 150,
            transform: "rotate(45deg)",
            borderRadius: 34,
            background: "linear-gradient(135deg,#ff7688,#ca3c64)",
            boxShadow: "0 24px 80px rgba(202,60,100,.42)",
          }}
        />
      </div>
    ),
    size,
  );
}
