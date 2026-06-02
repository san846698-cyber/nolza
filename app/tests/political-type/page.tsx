import type { Metadata } from "next";
import PoliticalTypeTestClient from "./PoliticalTypeTestClient";

const title = "정치성향 테스트 | Nolza";
const description =
  "사회 이슈에 대한 선택으로 알아보는 나의 정치성향 테스트. 진보, 중도, 보수 스펙트럼에서 내가 어디에 가까운지 확인해보세요.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "정치성향 테스트",
    "정치 성향",
    "진보 보수 테스트",
    "중도 테스트",
    "사회 가치관 테스트",
    "Political Orientation Test",
    "political spectrum test",
    "nolza fun",
  ],
  alternates: {
    canonical: "/tests/political-type",
  },
  openGraph: {
    title,
    description,
    url: "/tests/political-type",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/political-type/opengraph-image",
        width: 1200,
        height: 630,
        alt: "정치성향 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/tests/political-type/opengraph-image"],
  },
};

export default function PoliticalTypeTestPage() {
  return <PoliticalTypeTestClient />;
}
