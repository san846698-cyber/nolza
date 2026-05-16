import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Privacy Policy | Nolza.fun",
  description:
    "Nolza.fun 개인정보처리방침. Cookies, analytics, advertising, and privacy information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <TrustLocalizedPage page="privacy" />;
}
