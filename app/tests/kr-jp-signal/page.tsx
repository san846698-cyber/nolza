import type { Metadata } from "next";
import KrJpSignalTestClient from "./KrJpSignalTestClient";

export const metadata: Metadata = {
  title: "이거 호감임? 문화차이임? | 한일 문화 신호 테스트",
  description:
    "한국과 일본 사이에서 자주 생기는 말투, 답장, 약속, 거리감의 신호를 얼마나 잘 읽는지 알아보는 재미용 테스트.",
  keywords: [
    "한일 문화 차이",
    "호감 신호 테스트",
    "문화차이 테스트",
    "일본어 뉘앙스",
    "한국어 말투",
    "DM 해석",
    "nolza fun",
    "재미 테스트",
  ],
  alternates: {
    canonical: "/tests/kr-jp-signal",
  },
  openGraph: {
    title: "이거 호감임? 문화차이임?",
    description:
      "말투, 답장, 약속, 거리감. 이게 호감인지 문화차이인지 12개 상황으로 테스트해보세요.",
    url: "/tests/kr-jp-signal",
    siteName: "nolza.fun",
    images: [
      {
        url: "/tests/kr-jp-signal/opengraph-image",
        width: 1200,
        height: 630,
        alt: "이거 호감임? 문화차이임? 한일 문화 신호 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "이거 호감임? 문화차이임?",
    description: "12개 상황으로 알아보는 한일 문화 신호 읽기 테스트.",
    images: ["/tests/kr-jp-signal/opengraph-image"],
  },
};

export default function KrJpSignalTestPage() {
  return <KrJpSignalTestClient />;
}
