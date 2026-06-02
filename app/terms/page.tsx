import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "이용약관 | Terms of Use | nolza.fun",
  description:
    "Nolza 콘텐츠의 엔터테인먼트 성격, 사용자 책임, 공유 링크, 지식재산권, 서비스 이용 기준을 안내합니다.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TrustLocalizedPage page="terms" />;
}
