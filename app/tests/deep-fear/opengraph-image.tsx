import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "당신 안의 가장 깊은 공포는? | What Is Your Deepest Fear?";
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
          background: "linear-gradient(135deg, #050506 0%, #101014 48%, #1e1719 100%)",
          color: "#f3e6d6",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 16% 24%, rgba(159, 61, 78, .34), transparent 28%), radial-gradient(circle at 82% 12%, rgba(94, 119, 132, .28), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.04), transparent 44%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 720,
            top: 76,
            width: 320,
            height: 420,
            border: "1px solid rgba(243,230,214,.28)",
            borderRadius: 180,
            boxShadow: "0 0 80px rgba(183,91,98,.16)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 786,
            top: 132,
            width: 190,
            height: 300,
            border: "1px solid rgba(243,230,214,.14)",
            borderRadius: 120,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 122,
            top: -20,
            width: 2,
            height: 720,
            background: "linear-gradient(180deg, transparent, rgba(243,230,214,.42), transparent)",
            transform: "rotate(17deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "108px 80px 0",
            width: 770,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 900, color: "#c49a61", letterSpacing: 4 }}>
            PSYCHOLOGICAL HORROR TEST
          </div>
          <div style={{ marginTop: 24, fontSize: 78, fontWeight: 900, lineHeight: 1.08 }}>
            당신 안의 가장 깊은 공포는?
          </div>
          <div style={{ marginTop: 26, fontSize: 31, fontWeight: 800, color: "rgba(243,230,214,.82)" }}>
            귀신보다 오래 남는 마음의 그림자
          </div>
          <div style={{ marginTop: 28, fontSize: 24, fontWeight: 700, color: "rgba(243,230,214,.62)" }}>
            What Is Your Deepest Fear?
          </div>
        </div>
      </div>
    ),
    size,
  );
}
