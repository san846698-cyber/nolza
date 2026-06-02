import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Nolza 가이드 | 심리테스트와 게임을 더 잘 즐기는 법",
  description:
    "Nolza의 심리테스트, 관계 테스트, 공포 테스트, 조선 세계관 게임을 더 잘 이해하고 즐기기 위한 한국어 가이드 모음입니다.",
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesIndexPage() {
  return (
    <main className="guide-page">
      <section className="guide-page__inner">
        <nav className="guide-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Nolza</Link>
          <span>/</span>
          <span>가이드</span>
        </nav>

        <header className="guide-hero">
          <p className="guide-hero__eyebrow">Nolza Guides</p>
          <h1>심리테스트와 게임을 더 잘 즐기는 가이드</h1>
          <div className="guide-hero__intro">
            <p>
              Nolza의 테스트와 게임은 짧게 즐길 수 있지만, 결과를 읽는 방식에 따라 대화와 자기성찰의 깊이가 달라집니다.
              이곳에는 결과를 과하게 믿지 않으면서도 더 재미있고 안전하게 즐기기 위한 설명을 모았습니다.
            </p>
            <p>
              방어기제, 인지왜곡, 애착유형, 공포 패턴, 관계의 경계처럼 테스트와 연결되는 주제를 쉬운 한국어로 정리했습니다.
            </p>
          </div>
          <Link className="guide-hero__cta" href="/tests">
            테스트 모아보기
          </Link>
        </header>

        <section className="guide-section" aria-labelledby="guide-list-title">
          <div className="guide-section__head">
            <p>Articles</p>
            <h2 id="guide-list-title">전체 가이드</h2>
          </div>
          <div className="guide-related">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={guide.href}>
                <strong>{guide.homeTitle}</strong>
                <span>{guide.homeDescription}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
