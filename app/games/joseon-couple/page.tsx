import type { Metadata } from "next";
import JoseonCoupleClient from "./JoseonCoupleClient";
import { getShareMetadata } from "@/lib/result-preview";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const FALLBACK_TITLE = "조선시대 커플 궁합 테스트 | nolza.fun";
const FALLBACK_DESCRIPTION =
  "우리 둘이 조선시대에 만났다면 어떤 인연이었을까요? 이름만 넣고 운명적인 조선 커플 결과를 확인해보세요.";

const RESULT_PAGE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
};

function hasShareResultParam(params: Record<string, string | string[] | undefined>) {
  const value = params.s;
  if (Array.isArray(value)) return value.some(Boolean);
  return Boolean(value);
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const isShareResult = hasShareResultParam(params);
  const preview = getShareMetadata("joseon-couple", params);

  if (!preview) {
    return {
      title: FALLBACK_TITLE,
      description: FALLBACK_DESCRIPTION,
      robots: isShareResult ? RESULT_PAGE_ROBOTS : undefined,
      alternates: {
        canonical: "/games/joseon-couple",
      },
      openGraph: {
        title: FALLBACK_TITLE,
        description: FALLBACK_DESCRIPTION,
        url: "/games/joseon-couple",
        siteName: "nolza.fun",
        images: [
          {
            url: "/games/joseon-couple/opengraph-image",
            width: 1200,
            height: 630,
            alt: "조선시대 커플 궁합 테스트",
          },
        ],
        locale: "ko_KR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: FALLBACK_TITLE,
        description: FALLBACK_DESCRIPTION,
        images: ["/games/joseon-couple/opengraph-image"],
      },
    };
  }

  return {
    title: preview.title,
    description: preview.description,
    alternates: {
      canonical: "/games/joseon-couple",
    },
    robots: RESULT_PAGE_ROBOTS,
    openGraph: {
      title: preview.title,
      description: preview.description,
      url: preview.url,
      siteName: "nolza.fun",
      images: [
        {
          url: preview.imageUrl,
          width: 1200,
          height: 630,
          alt: preview.imageAlt,
        },
      ],
      locale: preview.locale === "ko" ? "ko_KR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: preview.title,
      description: preview.description,
      images: [preview.imageUrl],
    },
  };
}

export default function Page() {
  return <JoseonCoupleClient />;
}
