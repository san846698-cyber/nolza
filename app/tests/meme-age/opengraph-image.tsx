import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "당신의 밈 나이는 몇 살? 한국 인터넷 밈 테스트";

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
          background: "linear-gradient(135deg, #16112a 0%, #211846 54%, #32143a 100%)",
          color: "#fff7dc",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            opacity: 0.36,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -70,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "rgba(255,95,168,0.28)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: -80,
            width: 310,
            height: 310,
            borderRadius: "50%",
            background: "rgba(69,255,176,0.18)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "4px solid #fff7dc",
            borderRadius: 36,
            padding: 50,
            background: "rgba(255,255,255,0.08)",
            boxShadow: "14px 14px 0 #000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                color: "#45ffb0",
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "0.12em",
              }}
            >
              KOREAN INTERNET MEME AGE TEST
            </div>
            <div
              style={{
                display: "flex",
                border: "3px solid #fff7dc",
                borderRadius: 999,
                padding: "10px 18px",
                color: "#ffe45e",
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              12 QUESTIONS
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                maxWidth: 850,
                fontSize: 92,
                fontWeight: 900,
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                textShadow: "6px 6px 0 #000",
              }}
            >
              당신의 밈 나이는 몇 살?
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                color: "rgba(255,247,220,0.82)",
                fontSize: 36,
                lineHeight: 1.38,
              }}
            >
              디시, 싸이월드, 급식체, 쇼츠 밈까지.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              color: "#1d1232",
              fontSize: 24,
              fontWeight: 900,
            }}
          >
            {["2003", "2007", "2016", "2024", "2026"].map((year) => (
              <div
                key={year}
                style={{
                  display: "flex",
                  border: "3px solid #1d1232",
                  borderRadius: 18,
                  background: year === "2026" ? "#b197fc" : "#fff7dc",
                  padding: "12px 18px",
                }}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
