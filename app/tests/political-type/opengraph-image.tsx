import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "정치성향 테스트 | 나는 사회를 어떤 기준으로 판단할까?";
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
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 48%, #fff1f2 100%)",
          color: "#0f172a",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 14% 16%, rgba(37,99,235,.18), transparent 30%), radial-gradient(circle at 88% 8%, rgba(220,38,38,.16), transparent 34%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 86,
            height: 34,
            borderRadius: 999,
            background: "linear-gradient(90deg, #2563eb 0%, #f8fafc 50%, #dc2626 100%)",
            boxShadow: "inset 0 0 0 1px rgba(15,23,42,.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 582,
            bottom: 74,
            width: 58,
            height: 58,
            borderRadius: 999,
            background: "#111827",
            border: "8px solid #ffffff",
            boxShadow: "0 18px 40px rgba(15,23,42,.24)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "94px 80px 0",
            width: 980,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 900, color: "#475569", letterSpacing: 4 }}>
            SOCIAL VALUES TEST
          </div>
          <div style={{ marginTop: 22, fontSize: 88, fontWeight: 900, lineHeight: 1.05 }}>
            정치성향 테스트
          </div>
          <div style={{ marginTop: 24, fontSize: 36, fontWeight: 800, color: "#1d4ed8" }}>
            나는 사회를 어떤 기준으로 판단할까?
          </div>
          <div style={{ marginTop: 30, fontSize: 24, fontWeight: 700, color: "rgba(15,23,42,.62)" }}>
            진보 · 중도 · 보수 스펙트럼에서 나의 기준 읽어보기
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 42,
            display: "flex",
            justifyContent: "space-between",
            width: 1040,
            color: "#475569",
            fontSize: 23,
            fontWeight: 800,
          }}
        >
          <span>극좌</span>
          <span>진보</span>
          <span>중도</span>
          <span>보수</span>
          <span>극우</span>
        </div>
      </div>
    ),
    size,
  );
}
