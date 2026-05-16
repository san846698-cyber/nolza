import type { Metadata } from "next";
import CrushTypeTestClient from "./CrushTypeTestClient";

const koTitle = "짝사랑 유형 테스트 | 좋아하는 사람 앞에서 나는 왜 이상해질까?";
const koDescription =
  "좋아하는 사람 앞에서 나는 어떤 사람이 되는지 알아보는 재미용 짝사랑 유형 테스트입니다.";
const enTitle = "Crush Type Test | Why Do I Act Weird Around My Crush?";
const enDescription =
  "A fun relationship test that shows what kind of person you become around your crush.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  alternates: {
    canonical: "/tests/crush-type",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/crush-type",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/crush-type/opengraph-image",
        width: 1200,
        height: 630,
        alt: "짝사랑 유형 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/crush-type/opengraph-image"],
  },
};

export default function CrushTypeTestPage() {
  return <CrushTypeTestClient />;
}
