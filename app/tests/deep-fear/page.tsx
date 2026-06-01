import type { Metadata } from "next";
import DeepFearTestClient from "./DeepFearTestClient";

const koTitle = "당신 안의 가장 깊은 공포는? | Nolza";
const koDescription =
  "일상 속 선택으로 알아보는 나의 숨은 공포 유형. 버려짐, 들킴, 통제 상실, 반복, 망각 등 당신 안에 숨어 있는 심리적 공포를 확인해보세요.";
const enTitle = "What Is Your Deepest Fear? | Nolza";
const enDescription =
  "A quiet psychological horror test about hidden fear patterns such as abandonment, exposure, loss of control, repetition, and being forgotten.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  keywords: [
    "당신 안의 가장 깊은 공포는",
    "심리 호러 테스트",
    "공포 심리 테스트",
    "숨은 공포 유형",
    "버려지는 공포",
    "들키는 공포",
    "통제 상실 공포",
    "What Is Your Deepest Fear",
    "psychological horror test",
    "nolza fun",
  ],
  alternates: {
    canonical: "/tests/deep-fear",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/deep-fear",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/deep-fear/opengraph-image",
        width: 1200,
        height: 630,
        alt: "당신 안의 가장 깊은 공포는?",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/deep-fear/opengraph-image"],
  },
};

export default function DeepFearTestPage() {
  return <DeepFearTestClient />;
}
