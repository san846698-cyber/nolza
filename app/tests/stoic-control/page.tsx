import type { Metadata } from "next";
import StoicControlTestClient from "./StoicControlTestClient";

const koTitle = "스토아 철학 테스트 | 불안할 때 붙잡는 통제";
const koDescription = "통제할 수 있는 것과 없는 것을 구분하는 나의 마음 습관을 알아보는 철학 기반 자기이해 테스트입니다.";
const enTitle = "Stoic Control Test | What You Hold Onto";
const enDescription = "A Stoic-inspired self-reflection test about how you separate what you can control from what you cannot.";

export const metadata: Metadata = {
  title: koTitle,
  description: koDescription,
  alternates: {
    canonical: "/tests/stoic-control",
  },
  openGraph: {
    title: koTitle,
    description: koDescription,
    url: "/tests/stoic-control",
    type: "website",
    images: [
      {
        url: "/tests/stoic-control/opengraph-image",
        width: 1200,
        height: 630,
        alt: "스토아 철학 테스트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: enTitle,
    description: enDescription,
    images: ["/tests/stoic-control/opengraph-image"],
  },
};

export default function StoicControlTestPage() {
  return <StoicControlTestClient />;
}
