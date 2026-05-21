import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "놀자.fun 소개 | About nolza.fun",
  description:
    "놀자.fun은 웹에서 바로 즐기는 테스트, 관계 콘텐츠, 운세형 결과, 미니게임을 만드는 인터랙티브 엔터테인먼트 사이트입니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <TrustLocalizedPage page="about" />;
}
