import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "문의하기 | Contact Nolza.fun",
  description:
    "Nolza.fun 문의, 피드백, 오류 제보, 저작권 관련 요청, 비즈니스 문의 안내.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <TrustLocalizedPage page="contact" />;
}
