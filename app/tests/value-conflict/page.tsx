import type { Metadata } from "next";
import ValueConflictTestClient from "./ValueConflictTestClient";

const koTitle = "가치관 갈등 테스트 | 당신 안에서 충돌하는 두 가지 가치는?";
const koDescription = "당신 안에서 자주 부딪히는 두 가지 가치를 알아보는 재미용 자기이해 테스트입니다.";
const enTitle = "Value Conflict Test | What Two Values Are Fighting Inside You?";
const enDescription = "A self-reflection test that reveals the two values often pulling you in different directions.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  alternates: {
    canonical: "/tests/value-conflict",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/value-conflict",
    type: "website",
    images: [
      {
        url: "/tests/value-conflict/opengraph-image",
        width: 1200,
        height: 630,
        alt: "가치관 갈등 테스트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/value-conflict/opengraph-image"],
  },
};

export default function ValueConflictTestPage() {
  return <ValueConflictTestClient />;
}
