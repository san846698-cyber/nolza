import type { Metadata } from "next";
import SceneChoiceTestClient from "./SceneChoiceTestClient";

const koTitle = "무의식 장면 테스트 | 당신이 먼저 보는 장면은?";
const koDescription =
  "낯선 장면 속에서 무엇을 먼저 발견하는지로 알아보는, 투사적 이야기 기법에서 영감을 받은 재미용 자기이해 테스트입니다.";
const enTitle = "The Scene You Notice First | Projective-Style Self-Reflection Test";
const enDescription =
  "A mysterious self-reflection experience inspired by projective storytelling, where the details you notice first reveal a symbolic inner pattern.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  keywords: [
    "무의식 장면 테스트",
    "당신이 먼저 보는 장면 테스트",
    "심리 테스트",
    "자기이해 테스트",
    "투사적 이야기",
    "The Scene You Notice First",
    "projective style self reflection test",
    "psychology test",
    "nolza fun",
  ],
  alternates: {
    canonical: "/tests/scene-choice",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/scene-choice",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/scene-choice/opengraph-image",
        width: 1200,
        height: 630,
        alt: "무의식 장면 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/scene-choice/opengraph-image"],
  },
};

export default function SceneChoiceTestPage() {
  return <SceneChoiceTestClient />;
}
