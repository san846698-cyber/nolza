import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "내가 힘들 때 쓰는 방어기제는? 방어기제 테스트";
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
          background: "linear-gradient(135deg, #17130f 0%, #272017 48%, #111827 100%)",
          color: "#f8efe2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -80,
            top: 70,
            width: 360,
            height: 360,
            borderRadius: 360,
            background: "rgba(242, 200, 121, 0.2)",
            border: "2px solid rgba(255,255,255,0.13)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -40,
            width: 480,
            height: 480,
            borderRadius: 480,
            background: "rgba(168, 184, 232, 0.18)",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 84,
            top: 82,
            width: 250,
            height: 330,
            borderRadius: 36,
            border: "2px solid rgba(248,239,226,0.18)",
            background: "rgba(248,239,226,0.08)",
            transform: "rotate(5deg)",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "74px 86px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 18px",
              borderRadius: 999,
              background: "rgba(248,239,226,0.1)",
              color: "#f2c879",
              fontSize: 23,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            PSYCHOLOGY-STYLE SELF-REFLECTION
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              maxWidth: 820,
              fontSize: 78,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            내가 힘들 때 쓰는
            <br />
            방어기제는?
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 760,
              color: "rgba(248,239,226,0.76)",
              fontSize: 30,
              lineHeight: 1.4,
              fontWeight: 700,
            }}
          >
            상처받거나 불편할 때 마음이 자신을 보호하는 방식
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 42,
              fontSize: 23,
              fontWeight: 900,
            }}
          >
            <span style={{ padding: "12px 18px", borderRadius: 18, background: "#f2c879", color: "#17130f" }}>
              12 QUESTIONS
            </span>
            <span style={{ padding: "12px 18px", borderRadius: 18, background: "#a8b8e8", color: "#17130f" }}>
              8 RESULTS
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
