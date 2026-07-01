import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "정치성향 테스트 | Political Orientation Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img
          src={`${SITE}/images/tests/political-type/thumb.jpg`}
          width={1200}
          height={630}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ),
    size,
  );
}
