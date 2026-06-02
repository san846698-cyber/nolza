import type { Metadata } from "next";
import PoliticalTypeTestClient from "./PoliticalTypeTestClient";

const title = "정치성향 테스트 | Nolza";
const description =
  "사회 가치 문장에 대한 동의 정도로 알아보는 정치성향 테스트. 좌우 성향과 자유-질서 감각을 2축 가치 지도에서 함께 확인해보세요.";

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
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PoliticalTypeTestPage() {
  return <PoliticalTypeTestClient />;
}
