import type { Metadata } from "next";
import MemeAgeTestClient from "./MemeAgeTestClient";

const title = "당신의 밈 나이는 몇 살? | 한국 인터넷 밈 테스트";
const description =
  "디시, 싸이월드, 급식체, 쇼츠 밈까지. 12문제로 알아보는 나의 한국 인터넷 밈 나이 테스트.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "한국 밈 테스트",
    "밈 나이 테스트",
    "인터넷 밈",
    "밈력고사",
    "nolza fun",
    "심리테스트",
    "재미있는 테스트",
  ],
  alternates: {
    canonical: "/tests/meme-age",
  },
  openGraph: {
    title: "당신의 밈 나이는 몇 살?",
    description:
      "12문제로 알아보는 나의 한국 인터넷 밈 나이. 친구들과 결과를 비교해보세요.",
    url: "/tests/meme-age",
    siteName: "nolza.fun",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/tests/meme-age/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "당신의 밈 나이는 몇 살?",
    description:
      "12문제로 알아보는 나의 한국 인터넷 밈 나이. 친구들과 결과를 비교해보세요.",
    images: ["/tests/meme-age/opengraph-image"],
  },
};

export default function MemeAgeTestPage() {
  return <MemeAgeTestClient />;
}
