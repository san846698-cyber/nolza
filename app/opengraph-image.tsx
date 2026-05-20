import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "nolza.fun - viral test playground";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background:
            "radial-gradient(circle at 22% 26%, rgba(168,85,247,0.42), transparent 42%), linear-gradient(135deg, #171225 0%, #101827 48%, #0b1020 100%)",
          color: "#ffffff",
          fontFamily: "Inter, Arial, sans-serif",
          padding: "0 82px",
        }}
      >
        <div
          style={{
            width: 232,
            height: 232,
            borderRadius: 54,
            background: "linear-gradient(135deg, #a855f7, #7c3aed 54%, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
            boxShadow: "0 38px 90px rgba(124,58,237,0.34)",
          }}
        >
          <div
            style={{
              fontSize: 148,
              fontWeight: 900,
              letterSpacing: -14,
              lineHeight: 1,
              color: "#ffffff",
              display: "flex",
              transform: "translateX(-13px)",
            }}
          >
            N
          </div>
          <div
            style={{
              position: "absolute",
              right: 52,
              top: 62,
              width: 0,
              height: 0,
              borderTop: "36px solid transparent",
              borderBottom: "36px solid transparent",
              borderLeft: "62px solid #b7d5ff",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 42,
              bottom: 54,
              width: 15,
              height: 15,
              background: "#ffffff",
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            marginLeft: 66,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            <span>nolza</span>
            <span style={{ color: "#a78bfa" }}>.fun</span>
          </div>
          <div
            style={{
              marginTop: 36,
              display: "flex",
              color: "#d6d3e8",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            viral test playground
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              color: "#b8b4cf",
              fontSize: 28,
              fontWeight: 500,
            }}
          >
            quizzes / relationship tests / fortunes / mini games
          </div>
          <div
            style={{
              marginTop: 56,
              width: 360,
              height: 2,
              background: "#7c3aed",
              display: "flex",
            }}
          />
          <div
            style={{
              marginTop: 30,
              display: "flex",
              fontSize: 38,
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            quick to play, easy to share
          </div>
        </div>
      </div>
    ),
    size,
  );
}
