import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Privacy Policy | nolza.fun",
  description:
    "놀자.fun 개인정보처리방침. 입력값, 공유 링크, 쿠키, 분석 도구, 광고, 제3자 서비스와 문의 방법 안내.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <TrustLocalizedPage page="privacy" />;
}
