import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "콘텐츠 이용 고지 | Disclaimer | nolza.fun",
  description:
    "Nolza 테스트와 게임은 재미와 자기성찰을 위한 엔터테인먼트이며 의학적, 심리학적, 법률적, 재정적 또는 전문적인 진단과 조언이 아닙니다.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return <TrustLocalizedPage page="disclaimer" />;
}
