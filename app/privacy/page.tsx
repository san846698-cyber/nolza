import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";

const contactEmail = "studio4any@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy | Nolza.fun",
  description:
    "Read how Nolza.fun handles cookies, analytics, advertising, and privacy.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <TrustPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      subtitle="How Nolza.fun handles cookies, analytics, advertising, and privacy."
    >
      <p className="trust-updated">Last updated: May 13, 2026</p>

      <TrustSection title="1. Introduction">
        <p>
          Nolza.fun respects user privacy. This policy explains what information may
          be collected, how it may be used, and what choices users have when using
          this site.
        </p>
        <p>
          놀자.fun은 사용자의 개인정보 보호를 중요하게 생각합니다. 본 문서는
          사이트 이용 시 수집될 수 있는 정보와 사용 목적을 설명합니다.
        </p>
      </TrustSection>

      <TrustSection title="2. Information We Collect">
        <p>
          Basic technical information such as browser type, device type, pages
          visited, approximate region, and interaction data may be collected through
          analytics tools or server logs. Nolza.fun may also collect information
          voluntarily submitted through forms, if any.
        </p>
        <p>
          Most games and tests are designed to work without requiring account
          registration. Many interactive results are calculated locally in the
          browser and do not require users to submit personal information.
        </p>
      </TrustSection>

      <TrustSection title="3. Cookies">
        <p>
          Nolza.fun may use cookies or similar technologies to improve the site,
          remember preferences, analyze traffic, and support advertising. Users can
          disable cookies in their browser settings, although some site features may
          not work as expected.
        </p>
      </TrustSection>

      <TrustSection title="4. Google AdSense and Third-Party Advertising">
        <p>
          Nolza.fun may display advertisements provided by Google AdSense or other
          third-party ad partners. Third-party vendors, including Google, may use
          cookies to serve ads based on prior visits to this or other websites.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners to serve
          ads based on visits to Nolza.fun and/or other sites. Users may opt out of
          personalized advertising through{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ad Settings
          </a>
          . More information is available in Google&apos;s{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            advertising cookie policy
          </a>
          .
        </p>
      </TrustSection>

      <TrustSection title="5. Analytics">
        <p>
          The site may use analytics tools to understand traffic, measure content
          performance, detect technical issues, and improve user experience. These
          tools may process limited technical and interaction data.
        </p>
      </TrustSection>

      <TrustSection title="6. Entertainment Content">
        <p>
          Quizzes, fortune-style readings, compatibility tests, simulations, and
          games on Nolza.fun are for entertainment purposes only. They should not be
          treated as professional advice or as a basis for important real-world
          decisions.
        </p>
      </TrustSection>

      <TrustSection title="7. Data Sharing">
        <p>
          Nolza.fun does not sell personal information. Limited technical data may
          be processed by service providers such as hosting, analytics, and
          advertising partners when necessary to operate, secure, analyze, or
          monetize the site.
        </p>
      </TrustSection>

      <TrustSection title="8. Children’s Privacy">
        <p>
          Nolza.fun is intended for a general audience. The site does not knowingly
          collect personal information from children. If a parent or guardian
          believes a child has provided personal information, they can contact us
          and request removal.
        </p>
      </TrustSection>

      <TrustSection title="9. Contact">
        <p>
          For privacy-related questions or removal requests, contact{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
