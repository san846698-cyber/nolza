import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "조선시대 나의 일대기 | Nolza.fun",
  description: "이름 하나로 만들어보는 가상의 조선시대 인생 기록.",
  openGraph: {
    title: "조선시대 나의 일대기 | Nolza.fun",
    description: "이름 하나로 만들어보는 가상의 조선시대 인생 기록.",
    images: ["/games/joseon/opengraph-image"],
  },
};

export default function JoseonLayout({ children }: { children: ReactNode }) {
  return children;
}
