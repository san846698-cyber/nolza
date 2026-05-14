import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";

export const metadata: Metadata = {
  title: "About Nolza.fun | Original Web Games, Quizzes and Interactive Experiences",
  description:
    "Learn about Nolza.fun, a collection of original browser games, quizzes, simulations, and interactive entertainment experiences operated by Studio4Any.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="About Us"
      title="About Nolza.fun"
      subtitle="Original browser games, quizzes, simulations, and interactive entertainment experiences operated by Studio4Any."
    >
      <TrustSection title="Who We Are">
        <p>
          Nolza.fun is a collection of original interactive web experiences, casual
          browser games, quizzes, personality tests, simulations, and playful tools
          designed for entertainment.
        </p>
        <p>
          The site is operated by <strong>Studio4Any</strong>. Studio4Any is an
          application software development and supply business focused on lightweight
          web experiences that are easy to access without installation.
        </p>
      </TrustSection>

      <TrustSection title="What We Create">
        <p>
          Our goal is to create simple, fun, mobile-friendly, and shareable web
          content for users around the world. Nolza.fun may include games, cultural
          quizzes, compatibility tests, fortune-style entertainment content,
          simulations, and other interactive experiences.
        </p>
        <p>
          All content is created for entertainment purposes. Tests, fortune-style
          readings, compatibility results, and simulations should not be treated as
          professional advice or real-world decision guidance.
        </p>
      </TrustSection>

      <TrustSection title="한국어 안내">
        <p>
          놀자.fun은 웹게임, 테스트, 시뮬레이션, 궁합, 운세형 엔터테인먼트
          콘텐츠 등 다양한 인터랙티브 웹 경험을 제공하는 사이트입니다.
        </p>
        <p>
          놀자.fun은 <strong>Studio4Any</strong>에서 운영합니다. Studio4Any는
          애플리케이션 소프트웨어 개발 및 공급을 수행하는 사업자입니다.
        </p>
        <p>
          저희는 사용자가 설치 없이 모바일과 데스크톱 브라우저에서 쉽고 빠르게
          즐길 수 있는 오리지널 웹 콘텐츠를 만드는 것을 목표로 합니다. 놀자.fun의
          콘텐츠는 재미와 엔터테인먼트를 위한 것이며, 일부 테스트나 운세형 콘텐츠는
          실제 판단이나 전문적인 조언을 대체하지 않습니다.
        </p>
      </TrustSection>

      <TrustSection title="Operator Information">
        <dl className="trust-list">
          <div>
            <dt>Site name</dt>
            <dd>Nolza.fun</dd>
          </div>
          <div>
            <dt>Operator / Business name</dt>
            <dd>Studio4Any</dd>
          </div>
          <div>
            <dt>Business type</dt>
            <dd>Application software development and supply</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              <a href="mailto:studio4any@gmail.com">studio4any@gmail.com</a>
            </dd>
          </div>
        </dl>
      </TrustSection>
    </TrustPage>
  );
}
