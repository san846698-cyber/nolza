import type { Metadata } from "next";
import BreakingPointTestClient from "./BreakingPointTestClient";

const koTitle = "나를 차갑게 만드는 순간 | 심리 테스트";
const koDescription =
  "내가 언제 평소의 나와 달라지는지, 감정의 한계점과 경계가 바뀌는 순간을 알아보는 재미용 자기이해 테스트입니다.";
const enTitle = "The Moment I Turn Cold | Psychology Test";
const enDescription =
  "A mature self-reflection test about emotional limits, boundaries, and the repeated moments that shift your inner line.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  keywords: [
    "나를 차갑게 만드는 순간",
    "심리 테스트",
    "자기이해 테스트",
    "감정 경계 테스트",
    "관계 심리 테스트",
    "The Moment I Turn Cold",
    "psychology test",
    "self reflection test",
    "nolza fun",
  ],
  alternates: {
    canonical: "/tests/breaking-point",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/breaking-point",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/breaking-point/opengraph-image",
        width: 1200,
        height: 630,
        alt: "나를 차갑게 만드는 순간",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/breaking-point/opengraph-image"],
  },
};

export default function BreakingPointTestPage() {
  return <BreakingPointTestClient />;
}
