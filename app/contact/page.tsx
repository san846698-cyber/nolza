import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "문의하기 | Contact nolza.fun",
  description:
    "놀자.fun 문의 페이지. 오류 제보, 콘텐츠 요청, 개인정보 문의, 저작권 관련 요청, 광고/비즈니스 문의 안내.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <TrustLocalizedPage page="contact" />;
}
