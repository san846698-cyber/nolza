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
import { AdSenseScript, AdSideRails } from "./components/Ads";
import Analytics from "./components/Analytics";
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

const siteDescription =
  "nolza.fun is a playful viral test playground for quizzes, relationship tests, fortune readings, mini games, and quick shareable results.";

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
      className={`${notoSans.variable} ${notoSerif.variable} ${jetBrains.variable} ${inter.variable} ${caveat.variable} ${gaegu.variable} ${fraunces.variable} ${pressStart.variable}`}
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
          />
        ) : null}
      </head>
      <body className="font-sans antialiased">
        <Analytics />
        <ServiceWorkerCleanup />
        <AdSenseScript />
        <LocaleToggle />
        {children}
        <SiteFooter />
        <AdSideRails />
      </body>
    </html>
  );
}
