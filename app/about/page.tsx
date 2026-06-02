import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "Nolza 소개 | About nolza.fun",
  description:
    "Nolza는 심리테스트, 관계 테스트, 이름 기반 결과, 짧은 브라우저 게임을 제공하는 인터랙티브 엔터테인먼트 사이트입니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <TrustLocalizedPage page="about" />;
}
