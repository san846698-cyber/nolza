import type { Metadata } from "next";
import PoliticalTypeTestClient from "../PoliticalTypeTestClient";

const title = "Political Values Test | Nolza";
const description =
  "Not left vs. right — it's about what you protect first: freedom or order, change or stability. Take the 5-minute values test and see where you land on the 2-axis map.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "political values test",
    "political spectrum test",
    "political compass",
    "political orientation test",
    "left right test",
    "freedom vs order",
    "nolza fun",
  ],
  alternates: {
    canonical: "/tests/political-type/en",
  },
  openGraph: {
    title,
    description,
    url: "/tests/political-type/en",
    siteName: "nolza.fun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PoliticalTypeTestEnPage() {
  return <PoliticalTypeTestClient />;
}
