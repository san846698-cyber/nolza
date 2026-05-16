import type { Metadata } from "next";
import ThinkingPatternTestClient from "./ThinkingPatternTestClient";

const koTitle = "인지왜곡 테스트 | 내 생각은 어디서 자주 꼬일까?";
const koDescription = "불안하거나 힘들 때 반복되는 나의 생각 습관을 알아보는 재미용 자기이해 테스트입니다.";
const enTitle = "Thinking Pattern Test | Where Does Your Thinking Get Twisted?";
const enDescription = "A light self-reflection test about the thinking habits that can make stressful moments feel heavier.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  alternates: {
    canonical: "/tests/thinking-pattern",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/thinking-pattern",
    type: "website",
    images: [
      {
        url: "/tests/thinking-pattern/opengraph-image",
        width: 1200,
        height: 630,
        alt: "인지왜곡 테스트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/thinking-pattern/opengraph-image"],
  },
};

export default function ThinkingPatternTestPage() {
  return <ThinkingPatternTestClient />;
}
