import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Privacy Policy | nolza.fun",
  description:
    "Nolza 이용 중 처리될 수 있는 입력값, 공유 링크, 쿠키, 분석 도구, 광고 관련 정보를 설명합니다.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <TrustLocalizedPage page="privacy" />;
}
