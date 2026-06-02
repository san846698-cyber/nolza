import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "문의하기 | Contact nolza.fun",
  description:
    "Nolza 오류 제보, 콘텐츠 문의, 개인정보 문의, 권리 관련 요청, 광고와 제휴 문의를 위한 연락처 안내입니다.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <TrustLocalizedPage page="contact" />;
}
