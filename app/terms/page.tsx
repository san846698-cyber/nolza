import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";

const contactEmail = "studio4any@gmail.com";

export const metadata: Metadata = {
  title: "Terms of Service | Nolza.fun",
  description:
    "Read the terms for using Nolza.fun games, quizzes, simulations, and interactive entertainment content.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <TrustPage
      eyebrow="Terms of Service"
      title="Terms of Service"
      subtitle="Terms for using Nolza.fun games, quizzes, simulations, and interactive entertainment content."
    >
      <p className="trust-updated">Last updated: May 13, 2026</p>

      <TrustSection title="1. Acceptance of Terms">
        <p>
          By using Nolza.fun, users agree to these Terms of Service. If you do not
          agree with these terms, please do not use the site.
        </p>
      </TrustSection>

      <TrustSection title="2. Entertainment Purpose">
        <p>
          Nolza.fun provides games, quizzes, simulations, compatibility tests,
          fortune-style content, and playful tools for entertainment purposes. The
          content is designed to be lightweight, interactive, and shareable.
        </p>
      </TrustSection>

      <TrustSection title="3. No Professional Advice">
        <p>
          Nolza.fun content does not provide legal, financial, medical,
          psychological, relationship, or other professional advice. Users should
          not rely on games, tests, quizzes, simulations, or results as professional
          guidance.
        </p>
      </TrustSection>

      <TrustSection title="4. User Responsibility">
        <p>
          Users agree to use the site responsibly and not misuse, attack, scrape,
          spam, reverse engineer, overload, or interfere with the service. Users are
          responsible for their own actions and interpretation of entertainment
          results.
        </p>
      </TrustSection>

      <TrustSection title="5. Intellectual Property">
        <p>
          Nolza.fun content, design, text, original graphics, and interactive
          experiences belong to the site/operator unless otherwise stated. Users may
          share links to the site, but may not copy, redistribute, or commercially
          reuse site content without permission.
        </p>
      </TrustSection>

      <TrustSection title="6. Third-Party Services and Ads">
        <p>
          The site may use third-party services such as hosting providers, analytics
          tools, and advertising networks including Google AdSense. These services
          may process limited technical data according to their own policies.
        </p>
      </TrustSection>

      <TrustSection title="7. Disclaimer">
        <p>
          Nolza.fun is provided as-is. No guarantee is made that every result, test,
          quiz, game, or simulation is accurate, complete, uninterrupted, error-free,
          or suitable for every user.
        </p>
      </TrustSection>

      <TrustSection title="8. Changes">
        <p>
          These terms may be updated from time to time. Continued use of Nolza.fun
          after changes are posted means users accept the updated terms.
        </p>
      </TrustSection>

      <TrustSection title="9. Contact">
        <p>
          For questions about these terms, contact{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
