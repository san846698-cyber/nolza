import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Political Values Test — Where do you land on the map?";
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
          background: "linear-gradient(135deg, #0f1c3f 0%, #1c2f66 55%, #7a2740 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(90,140,255,.35), transparent 40%), radial-gradient(circle at 82% 78%, rgba(255,90,120,.32), transparent 42%)",
          }}
        />

        {/* Left text block */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 90px",
            width: "56%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "#8fb4ff", letterSpacing: 2 }}>
            POLITICAL VALUES TEST
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 62, fontWeight: 900, lineHeight: 1.12 }}>
            Not left vs. right.
          </div>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 900, lineHeight: 1.12, color: "#ffd166" }}>
            It's what you
          </div>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 900, lineHeight: 1.12, color: "#ffd166" }}>
            protect first.
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>
            Freedom or order. Change or stability.
          </div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>
            Find your spot on the 2-axis map.
          </div>
        </div>

        {/* Right compass graphic */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 65,
            width: 460,
            height: 460,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "rgba(255,255,255,.06)",
              border: "2px solid rgba(255,255,255,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(255,255,255,.45)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: "rgba(255,255,255,.45)" }} />
            <div style={{ position: "absolute", top: -46, left: "50%", transform: "translateX(-50%)", fontSize: 24, fontWeight: 800, color: "#ffd166" }}>ORDER</div>
            <div style={{ position: "absolute", bottom: -46, left: "50%", transform: "translateX(-50%)", fontSize: 24, fontWeight: 800, color: "#8fb4ff" }}>FREEDOM</div>
            <div style={{ position: "absolute", left: -78, top: "50%", transform: "translateY(-50%)", fontSize: 24, fontWeight: 800, color: "#8fb4ff" }}>LEFT</div>
            <div style={{ position: "absolute", right: -90, top: "50%", transform: "translateY(-50%)", fontSize: 24, fontWeight: 800, color: "#ff8fa3" }}>RIGHT</div>
            <div
              style={{
                position: "absolute",
                left: "68%",
                top: "32%",
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#ffd166",
                boxShadow: "0 0 0 8px rgba(255,209,102,.25), 0 10px 30px rgba(0,0,0,.4)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 90,
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            color: "rgba(255,255,255,.65)",
            letterSpacing: 1,
          }}
        >
          nolza.fun
        </div>
      </div>
    ),
    size,
  );
}
