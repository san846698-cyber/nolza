import type { Metadata } from "next";
import {
  Noto_Sans_KR,
  Noto_Serif_KR,
  JetBrains_Mono,
  Inter,
  Caveat,
  Gaegu,
  Fraunces,
  Press_Start_2P,
} from "next/font/google";
import "./globals.css";
import LocaleToggle from "./components/LocaleToggle";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const gaegu = Gaegu({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-gaegu",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun",
  ),
  title: "놀자.fun",
  description: "놀자.fun — 인터랙티브 게임 모음",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-3027162336323004";
  return (
    <html
      lang="ko"
      className={`${notoSans.variable} ${notoSerif.variable} ${jetBrains.variable} ${inter.variable} ${caveat.variable} ${gaegu.variable} ${fraunces.variable} ${pressStart.variable}`}
    >
      <head>
        {adsenseClient && !adsenseClient.startsWith("ca-pub-XXX") && (
          // AdSense verification + ad-serving script must be a real <script> in <head>.
          // next/script only injects a preload hint here, which the AdSense crawler ignores.
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <meta
          name="google-adsense-account"
          content={adsenseClient}
        />
      </head>
      <body className="font-sans antialiased">
        <LocaleToggle />
        {children}
      </body>
    </html>
  );
}
