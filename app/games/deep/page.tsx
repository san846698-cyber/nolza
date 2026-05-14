import type { Metadata } from "next";
import DeepSeaExperience from "./DeepSeaExperience";

export const metadata: Metadata = {
  title: {
    default: "마리아나 해구 끝까지 내려가면? | 심해 11,000m 체험",
    template: "%s | nolza.fun",
  },
  description:
    "해수면부터 챌린저 딥까지, 수심 11,000m의 심해를 스크롤로 내려가며 체험하는 인터랙티브 웹 콘텐츠.",
  alternates: {
    canonical: "/games/deep",
  },
  openGraph: {
    title: "마리아나 해구 끝까지 내려가면?",
    description:
      "해수면부터 챌린저 딥까지, 수심 11,000m의 심해를 스크롤로 내려가며 체험하는 인터랙티브 웹 콘텐츠.",
    url: "/games/deep",
    images: ["/games/deep/opengraph-image"],
  },
};

export default function Page() {
  return <DeepSeaExperience />;
}
