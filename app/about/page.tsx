import type { Metadata } from "next";
import TrustLocalizedPage from "@/app/components/TrustLocalizedPage";

export const metadata: Metadata = {
  title: "놀자.fun 소개 | About nolza.fun",
  description:
    "Studio4Any가 운영하는 놀자.fun 소개. Original browser games, quizzes, simulations, and interactive entertainment experiences.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <TrustLocalizedPage page="about" />;
}
