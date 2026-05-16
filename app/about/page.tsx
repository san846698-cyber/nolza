import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "Nolza.fun 소개 | About Nolza.fun",
  description:
    "Studio4Any가 운영하는 Nolza.fun 소개. Original browser games, quizzes, simulations, and interactive entertainment experiences.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <TrustLocalizedPage page="about" />;
}
