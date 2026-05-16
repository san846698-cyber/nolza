import type { Metadata } from "next";
import MemeAgeTestClient from "./MemeAgeTestClient";

const title = "밈 나이 테스트 | 한국 인터넷 밈 추리 퀴즈";
const description =
  "싸이월드 감성부터 2010년대 드립, 숏폼 밈까지. 12라운드 텍스트 퀴즈로 알아보는 나의 인터넷 세대.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "한국 밈 테스트",
    "밈 나이 테스트",
    "밈 퀴즈",
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
    title: "밈 나이 테스트",
    description:
      "12라운드 텍스트 퀴즈로 맞혀보는 나의 한국 인터넷 밈 나이. 친구들과 결과를 비교해보세요.",
    url: "/tests/meme-age",
    siteName: "nolza.fun",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/tests/meme-age/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "밈 나이 테스트",
    description:
      "12라운드 텍스트 퀴즈로 맞혀보는 나의 한국 인터넷 밈 나이. 친구들과 결과를 비교해보세요.",
    images: ["/tests/meme-age/opengraph-image"],
  },
};

export default function MemeAgeTestPage() {
  return <MemeAgeTestClient />;
}
