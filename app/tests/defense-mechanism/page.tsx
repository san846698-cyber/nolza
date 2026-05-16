import type { Metadata } from "next";
import DefenseMechanismTestClient from "./DefenseMechanismTestClient";

const koTitle = "내가 힘들 때 쓰는 방어기제는? | 방어기제 테스트";
const koDescription =
  "상처받거나 스트레스를 받을 때, 당신의 마음이 어떤 방식으로 자신을 보호하는지 알아보는 재미용 심리 테스트입니다.";
const enTitle =
  "What Is Your Defense Mechanism? | Psychology-Style Self-Reflection Test";
const enDescription =
  "A light, entertainment-focused test that explores how your mind may protect itself when you feel stressed, hurt, or emotionally uncomfortable.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  keywords: [
    "방어기제 테스트",
    "심리 테스트",
    "자기이해 테스트",
    "재미 테스트",
    "defense mechanism test",
    "psychology style test",
    "self reflection test",
    "nolza fun",
  ],
  alternates: {
    canonical: "/tests/defense-mechanism",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/defense-mechanism",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/defense-mechanism/opengraph-image",
        width: 1200,
        height: 630,
        alt: "내가 힘들 때 쓰는 방어기제는? 방어기제 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/defense-mechanism/opengraph-image"],
  },
};

export default function DefenseMechanismTestPage() {
  return <DefenseMechanismTestClient />;
}
