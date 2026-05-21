import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuideBySlug } from "@/lib/guides";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "가이드",
      alternates: {
        canonical: "/guides",
      },
    };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: guide.href,
    },
    openGraph: {
      title: `${guide.metaTitle} | nolza.fun`,
      description: guide.metaDescription,
      url: guide.href,
      siteName: "nolza.fun",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: guide.metaTitle,
        },
      ],
      locale: "ko_KR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.metaTitle} | nolza.fun`,
      description: guide.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  return (
    <main className="guide-page">
      <article className="guide-page__inner">
        <nav className="guide-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">nolza.fun</Link>
          <span>/</span>
          <span>가이드</span>
        </nav>

        <header className="guide-hero">
          <p className="guide-hero__eyebrow">Game Guide</p>
          <h1>{guide.title}</h1>
          <div className="guide-hero__intro">
            {guide.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link className="guide-hero__cta" href={guide.ctaHref}>
            {guide.ctaLabel}
          </Link>
        </header>

        <section className="guide-section guide-section--cards" aria-label="가이드 핵심 설명">
          <article>
            <span>01</span>
            <h2>이 테스트/게임이 무엇인가요?</h2>
            <p>{guide.what}</p>
          </article>
          <article>
            <span>02</span>
            <h2>어떻게 플레이하나요?</h2>
            <p>{guide.how}</p>
          </article>
          <article>
            <span>03</span>
            <h2>결과는 어떻게 해석하나요?</h2>
            <p>{guide.interpretation}</p>
          </article>
          <article>
            <span>04</span>
            <h2>친구와 공유하면 왜 재미있나요?</h2>
            <p>{guide.sharing}</p>
          </article>
        </section>

        <section className="guide-section" aria-labelledby="related-guides-title">
          <div className="guide-section__head">
            <p>Related Tests</p>
            <h2 id="related-guides-title">함께 해보기 좋은 콘텐츠</h2>
          </div>
          <div className="guide-related">
            {guide.related.map((item) => (
              <Link key={item.href} href={item.href}>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="guide-faq-title">
          <div className="guide-section__head">
            <p>FAQ</p>
            <h2 id="guide-faq-title">자주 묻는 질문</h2>
          </div>
          <div className="guide-faq">
            {guide.faq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="guide-cta" aria-label="게임 시작">
          <div>
            <p>바로 해보고 싶다면</p>
            <h2>{guide.ctaLabel}</h2>
          </div>
          <Link href={guide.ctaHref}>게임 시작하기</Link>
        </section>
      </article>
    </main>
  );
}
