import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "이용약관 | Terms of Service | Nolza.fun",
  description:
    "Nolza.fun 이용약관. Terms for using games, tests, simulations, and interactive entertainment content.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TrustLocalizedPage page="terms" />;
}
