import type { Metadata } from "next";
import FootballLineupClient from "./FootballLineupClient";

const title = "대한민국 대표팀 전술판 | 월드컵 감독모드";
const description =
  "등번호와 이름만 보이는 선수 칩을 직접 배치해 나만의 대한민국 대표팀 라인업과 전술을 만들어보세요.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "대한민국 축구대표팀",
    "월드컵 라인업",
    "축구 전술판",
    "베스트11",
    "축구 포메이션",
    "대표팀 감독모드",
  ],
  alternates: {
    canonical: "/tests/football-lineup",
  },
  openGraph: {
    title,
    description,
    url: "/tests/football-lineup",
    siteName: "nolza.fun",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function FootballLineupPage() {
  return <FootballLineupClient />;
}
