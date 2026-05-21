import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "이용약관 | Terms of Use | nolza.fun",
  description:
    "놀자.fun 이용약관. 엔터테인먼트 목적, 사용자 책임, 공유 링크, 광고, 제3자 서비스와 서비스 이용 기준 안내.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TrustLocalizedPage page="terms" />;
}
