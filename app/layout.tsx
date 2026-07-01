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
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { AdSenseScript, AdSideRails } from "./components/Ads";
import Analytics from "./components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { MotionProvider } from "./components/motion/Motion";
import LocaleToggle from "./components/LocaleToggle";
import ServiceWorkerCleanup from "./components/ServiceWorkerCleanup";
import SiteFooter from "./components/SiteFooter";

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

// 게임 성향 테스트 UI 전용 — self-host Pretendard 가변 폰트.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

const siteDescription =
  "nolza.fun — 심리테스트, 캐릭터 테스트, 연애 테스트, 운세, 미니 게임까지. 재미있는 테스트로 나를 알아보고 친구들과 결과를 공유해보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nolza.fun",
  ),
  applicationName: "nolza.fun",
  title: {
    default: "nolza.fun",
    template: "%s | nolza.fun",
  },
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "nolza.fun",
    description: siteDescription,
    url: "/",
    siteName: "nolza.fun",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "nolza.fun - viral test playground",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nolza.fun",
    description: siteDescription,
    images: ["/og-image.png"],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-3027162336323004";
  const zeroToStudioProjectKey =
    process.env.NEXT_PUBLIC_ZERO_TO_STUDIO_PROJECT_KEY ??
    "zts_pk_3bbad73665734c3095afa8803f9a7a1c";
  const zeroToStudioSdkSrc =
    process.env.NEXT_PUBLIC_ZERO_TO_STUDIO_SDK_SRC ??
    "https://studio4any.com/v1/sdk.js";
  const zeroToStudioFeedbackSlug =
    process.env.NEXT_PUBLIC_ZERO_TO_STUDIO_FEEDBACK_SLUG ?? "nolza-3b91e6";

  return (
    <html
      lang="ko"
      className={`${notoSans.variable} ${notoSerif.variable} ${jetBrains.variable} ${inter.variable} ${caveat.variable} ${gaegu.variable} ${fraunces.variable} ${pressStart.variable} ${pretendard.variable}`}
    >
      <head>
        <meta
          name="google-adsense-account"
          content={adsenseClient}
        />
        {zeroToStudioProjectKey ? (
          <script
            id="zero-to-studio-sdk"
            defer
            src={zeroToStudioSdkSrc}
            data-project-key={zeroToStudioProjectKey}
            data-feedback-slug={zeroToStudioFeedbackSlug}
            data-feedback-prompt="true"
            data-feedback-display="modal"
            data-feedback-mode="smart"
            data-feedback-cooldown-days="7"
            data-respect-dnt="true"
          />
        ) : null}
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PK7W8D9V');`}</Script>
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PK7W8D9V"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Analytics />
        <VercelAnalytics />
        <ServiceWorkerCleanup />
        <AdSenseScript />
        <LocaleToggle />
        <MotionProvider>{children}</MotionProvider>
        <SiteFooter />
        <AdSideRails />
      </body>
    </html>
  );
}
