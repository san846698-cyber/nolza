"use client";

import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";

type TrustPageId = "about" | "contact" | "privacy" | "terms";

type TrustSectionContent = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  definitions?: Array<{ term: string; value: string }>;
  email?: boolean;
};

type TrustContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated?: string;
  sections: TrustSectionContent[];
};

const CONTACT_EMAIL = "studio4any@gmail.com";

const COMMON: Record<SimpleLocale, { back: string; languageLabel: string; languageName: string }> = {
  ko: {
    back: "← Nolza.fun으로 돌아가기",
    languageLabel: "언어 선택",
    languageName: "KO",
  },
  en: {
    back: "← Back to Nolza.fun",
    languageLabel: "Language",
    languageName: "EN",
  },
};

const TRUST_CONTENT: Record<TrustPageId, Record<SimpleLocale, TrustContent>> = {
  about: {
    ko: {
      eyebrow: "소개",
      title: "Nolza.fun 소개",
      subtitle:
        "Studio4Any가 운영하는 오리지널 웹게임, 테스트, 시뮬레이션, 인터랙티브 엔터테인먼트 사이트입니다.",
      sections: [
        {
          title: "우리는 무엇을 만드나요?",
          paragraphs: [
            "Nolza.fun은 웹게임, 심리 테스트, 궁합 테스트, 문화 퀴즈, 시뮬레이션, 운세형 엔터테인먼트 등 다양한 인터랙티브 웹 경험을 제공하는 사이트입니다.",
            "Nolza.fun은 Studio4Any에서 운영합니다. Studio4Any는 설치 없이 브라우저에서 쉽고 빠르게 즐길 수 있는 가벼운 웹 경험을 만드는 것을 목표로 합니다.",
          ],
        },
        {
          title: "콘텐츠 방향",
          paragraphs: [
            "저희는 사용자가 모바일과 데스크톱에서 간단하게 즐기고 공유할 수 있는 오리지널 콘텐츠를 만듭니다.",
            "Nolza.fun의 테스트, 궁합, 운세형 콘텐츠는 재미와 자기이해를 위한 엔터테인먼트입니다. 실제 판단, 전문적인 조언, 의학적·법률적·재정적 조언을 대체하지 않습니다.",
          ],
        },
        {
          title: "운영자 정보",
          definitions: [
            { term: "사이트명", value: "Nolza.fun" },
            { term: "운영자", value: "Studio4Any" },
            { term: "문의", value: CONTACT_EMAIL },
          ],
        },
      ],
    },
    en: {
      eyebrow: "About",
      title: "About Nolza.fun",
      subtitle:
        "Original browser games, quizzes, simulations, and interactive entertainment experiences operated by Studio4Any.",
      sections: [
        {
          title: "What We Create",
          paragraphs: [
            "Nolza.fun provides interactive web experiences including browser games, psychology-style quizzes, compatibility tests, culture quizzes, simulations, and fortune-style entertainment.",
            "Nolza.fun is operated by Studio4Any. Studio4Any aims to create lightweight web experiences that are easy to enjoy directly in the browser without installation.",
          ],
        },
        {
          title: "Content Direction",
          paragraphs: [
            "We create original content that users can enjoy and share easily on mobile and desktop.",
            "Tests, compatibility results, and fortune-style content on Nolza.fun are entertainment experiences for fun and self-reflection. They do not replace real-world judgment, professional advice, medical advice, legal advice, or financial advice.",
          ],
        },
        {
          title: "Operator Information",
          definitions: [
            { term: "Site name", value: "Nolza.fun" },
            { term: "Operator", value: "Studio4Any" },
            { term: "Contact", value: CONTACT_EMAIL },
          ],
        },
      ],
    },
  },
  contact: {
    ko: {
      eyebrow: "문의",
      title: "문의하기",
      subtitle:
        "피드백, 오류 제보, 저작권 관련 요청, 비즈니스 문의는 아래 이메일로 연락해주세요.",
      sections: [
        {
          title: "이메일 문의",
          paragraphs: [
            "Nolza.fun 관련 문의는 아래 이메일로 보내주세요.",
            "정상적인 문의는 가능한 빠르게 확인하겠습니다.",
            "문의 유형:",
          ],
          email: true,
          list: [
            "서비스 이용 문의",
            "오류 제보",
            "저작권 관련 요청",
            "광고/비즈니스 문의",
            "기타 피드백",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Contact",
      title: "Contact Nolza.fun",
      subtitle:
        "For feedback, bug reports, copyright-related requests, and business inquiries, please contact us by email.",
      sections: [
        {
          title: "Email Contact",
          paragraphs: [
            "For Nolza.fun-related inquiries, please contact us at the email below.",
            "We try to review legitimate inquiries as soon as possible.",
            "Contact reasons:",
          ],
          email: true,
          list: [
            "Service questions",
            "Bug reports",
            "Copyright-related requests",
            "Advertising or business inquiries",
            "Other feedback",
          ],
        },
      ],
    },
  },
  privacy: {
    ko: {
      eyebrow: "개인정보",
      title: "개인정보처리방침",
      subtitle: "Nolza.fun은 사용자의 개인정보 보호를 중요하게 생각합니다.",
      sections: [
        {
          title: "1. 소개",
          paragraphs: [
            "Nolza.fun은 웹게임, 테스트, 시뮬레이션, 인터랙티브 콘텐츠를 제공하는 엔터테인먼트 사이트입니다. 본 개인정보처리방침은 사이트 이용 중 어떤 정보가 처리될 수 있는지 설명합니다.",
          ],
        },
        {
          title: "2. 수집될 수 있는 정보",
          paragraphs: [
            "Nolza.fun은 대부분의 콘텐츠를 회원가입 없이 이용할 수 있도록 설계되어 있습니다. 다만 사이트 운영, 보안, 분석, 광고 제공을 위해 브라우저 종류, 기기 정보, 방문한 페이지, 대략적인 지역, 이용 시간, 상호작용 정보 등이 처리될 수 있습니다.",
            "사용자가 문의 양식이나 이메일을 통해 직접 정보를 제공하는 경우, 해당 정보는 문의 응답을 위해 사용될 수 있습니다.",
          ],
        },
        {
          title: "3. 쿠키",
          paragraphs: [
            "Nolza.fun은 사이트 기능 개선, 사용자 환경 최적화, 트래픽 분석, 광고 제공을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키를 제한하거나 비활성화할 수 있습니다.",
          ],
        },
        {
          title: "4. Google AdSense 및 제3자 광고",
          paragraphs: [
            "Nolza.fun은 Google AdSense 또는 기타 제3자 광고 서비스를 통해 광고를 표시할 수 있습니다. Google을 포함한 제3자 광고 제공업체는 쿠키를 사용하여 사용자의 이전 방문 기록을 기반으로 광고를 제공할 수 있습니다.",
            "사용자는 Google 광고 설정에서 개인 맞춤 광고를 관리하거나 비활성화할 수 있습니다.",
          ],
        },
        {
          title: "5. 분석 도구",
          paragraphs: [
            "Nolza.fun은 방문자 수, 페이지 이용 방식, 콘텐츠 성과를 이해하고 서비스를 개선하기 위해 분석 도구를 사용할 수 있습니다.",
          ],
        },
        {
          title: "6. 엔터테인먼트 콘텐츠",
          paragraphs: [
            "Nolza.fun의 테스트, 궁합, 운세형 콘텐츠, 시뮬레이션, 게임은 재미와 자기이해를 위한 콘텐츠입니다. 이는 전문적인 조언이나 진단을 대체하지 않습니다.",
          ],
        },
        {
          title: "7. 정보 공유",
          paragraphs: [
            "Nolza.fun은 사용자의 개인정보를 판매하지 않습니다. 다만 호스팅, 분석, 광고, 보안 등 서비스 운영에 필요한 범위에서 제3자 서비스 제공업체가 일부 기술 정보를 처리할 수 있습니다.",
          ],
        },
        {
          title: "8. 아동 개인정보",
          paragraphs: [
            "Nolza.fun은 일반 이용자를 대상으로 하며, 고의로 아동의 개인정보를 수집하지 않습니다. 보호자가 아동의 개인정보가 제공되었다고 판단하는 경우, 문의 이메일을 통해 삭제를 요청할 수 있습니다.",
          ],
        },
        {
          title: "9. 문의",
          paragraphs: ["개인정보 관련 문의는 아래 이메일로 연락해주세요."],
          email: true,
        },
      ],
    },
    en: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      subtitle: "Nolza.fun values your privacy.",
      sections: [
        {
          title: "1. Introduction",
          paragraphs: [
            "Nolza.fun is an entertainment website that provides browser games, quizzes, simulations, and interactive experiences. This Privacy Policy explains what information may be processed when you use the site.",
          ],
        },
        {
          title: "2. Information We May Collect",
          paragraphs: [
            "Most content on Nolza.fun is designed to be used without account registration. However, basic technical information such as browser type, device type, pages visited, approximate region, usage time, and interaction data may be processed for site operation, security, analytics, and advertising.",
            "If you voluntarily contact us by email or form, the information you provide may be used to respond to your inquiry.",
          ],
        },
        {
          title: "3. Cookies",
          paragraphs: [
            "Nolza.fun may use cookies or similar technologies to improve site functionality, optimize user experience, analyze traffic, and support advertising. You can limit or disable cookies through your browser settings.",
          ],
        },
        {
          title: "4. Google AdSense and Third-Party Advertising",
          paragraphs: [
            "Nolza.fun may display advertisements provided by Google AdSense or other third-party advertising services. Third-party vendors, including Google, may use cookies to serve ads based on your prior visits to this or other websites.",
            "You can manage or disable personalized advertising through Google Ad Settings.",
          ],
        },
        {
          title: "5. Analytics",
          paragraphs: [
            "Nolza.fun may use analytics tools to understand traffic, page usage, and content performance in order to improve the service.",
          ],
        },
        {
          title: "6. Entertainment Content",
          paragraphs: [
            "Tests, compatibility results, fortune-style content, simulations, and games on Nolza.fun are for entertainment and self-reflection only. They do not replace professional advice or diagnosis.",
          ],
        },
        {
          title: "7. Data Sharing",
          paragraphs: [
            "Nolza.fun does not sell personal information. Limited technical data may be processed by third-party service providers for hosting, analytics, advertising, and security purposes.",
          ],
        },
        {
          title: "8. Children's Privacy",
          paragraphs: [
            "Nolza.fun is intended for a general audience and does not knowingly collect personal information from children. If a parent or guardian believes a child has provided personal information, they may contact us to request removal.",
          ],
        },
        {
          title: "9. Contact",
          paragraphs: ["For privacy-related inquiries, contact:"],
          email: true,
        },
      ],
    },
  },
  terms: {
    ko: {
      eyebrow: "이용약관",
      title: "이용약관",
      subtitle: "Nolza.fun을 이용하기 전에 아래 내용을 확인해주세요.",
      sections: [
        {
          title: "1. 약관 동의",
          paragraphs: ["Nolza.fun을 이용함으로써 사용자는 본 이용약관에 동의한 것으로 간주됩니다."],
        },
        {
          title: "2. 서비스 목적",
          paragraphs: [
            "Nolza.fun은 웹게임, 테스트, 시뮬레이션, 궁합, 운세형 콘텐츠, 기타 인터랙티브 엔터테인먼트 콘텐츠를 제공합니다.",
          ],
        },
        {
          title: "3. 엔터테인먼트 목적",
          paragraphs: [
            "Nolza.fun의 콘텐츠는 재미와 자기이해를 위한 것입니다. 테스트 결과, 궁합, 운세형 콘텐츠, 시뮬레이션 결과는 실제 판단이나 전문적인 조언을 대체하지 않습니다.",
          ],
        },
        {
          title: "4. 전문적 조언 아님",
          paragraphs: [
            "Nolza.fun은 법률, 의료, 심리, 재정, 투자, 연애, 기타 전문적인 조언을 제공하지 않습니다. 중요한 결정은 관련 전문가와 상담하거나 신중하게 판단해야 합니다.",
          ],
        },
        {
          title: "5. 사용자 책임",
          paragraphs: [
            "사용자는 사이트를 정상적인 방식으로 이용해야 하며, 서비스 방해, 악성 코드 사용, 무단 크롤링, 스팸, 공격, 기타 부적절한 행위를 해서는 안 됩니다.",
          ],
        },
        {
          title: "6. 지식재산권",
          paragraphs: [
            "Nolza.fun의 오리지널 콘텐츠, 디자인, 문구, 그래픽, 인터랙티브 경험은 별도 표시가 없는 한 사이트 또는 운영자에게 권리가 있습니다. 무단 복제, 배포, 상업적 이용은 금지됩니다.",
          ],
        },
        {
          title: "7. 제3자 서비스 및 광고",
          paragraphs: [
            "Nolza.fun은 호스팅, 분석, 광고 등 서비스 운영을 위해 제3자 서비스를 사용할 수 있으며, Google AdSense 등 광고 네트워크를 통해 광고를 표시할 수 있습니다.",
          ],
        },
        {
          title: "8. 면책",
          paragraphs: [
            "Nolza.fun은 서비스를 가능한 안정적으로 제공하기 위해 노력하지만, 모든 콘텐츠의 정확성, 완전성, 적합성을 보장하지 않습니다. 서비스는 현재 제공되는 상태 그대로 제공됩니다.",
          ],
        },
        {
          title: "9. 약관 변경",
          paragraphs: [
            "본 약관은 필요에 따라 변경될 수 있으며, 변경된 내용은 사이트에 게시될 수 있습니다.",
          ],
        },
        {
          title: "10. 문의",
          paragraphs: ["이용약관 관련 문의는 아래 이메일로 연락해주세요."],
          email: true,
        },
      ],
    },
    en: {
      eyebrow: "Terms",
      title: "Terms of Service",
      subtitle: "Please review these terms before using Nolza.fun.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: ["By using Nolza.fun, you agree to these Terms of Service."],
        },
        {
          title: "2. Service Purpose",
          paragraphs: [
            "Nolza.fun provides browser games, quizzes, simulations, compatibility tests, fortune-style content, and other interactive entertainment experiences.",
          ],
        },
        {
          title: "3. Entertainment Purpose",
          paragraphs: [
            "Nolza.fun content is provided for entertainment and self-reflection. Test results, compatibility results, fortune-style content, and simulation results do not replace real-world judgment or professional advice.",
          ],
        },
        {
          title: "4. No Professional Advice",
          paragraphs: [
            "Nolza.fun does not provide legal, medical, psychological, financial, investment, relationship, or other professional advice. Important decisions should be made carefully or with the help of qualified professionals.",
          ],
        },
        {
          title: "5. User Responsibility",
          paragraphs: [
            "Users must use the site responsibly and must not interfere with the service, use malicious code, scrape without permission, spam, attack, or otherwise misuse the site.",
          ],
        },
        {
          title: "6. Intellectual Property",
          paragraphs: [
            "Original content, design, text, graphics, and interactive experiences on Nolza.fun belong to the site or its operator unless otherwise stated. Unauthorized copying, distribution, or commercial use is prohibited.",
          ],
        },
        {
          title: "7. Third-Party Services and Ads",
          paragraphs: [
            "Nolza.fun may use third-party services for hosting, analytics, advertising, and site operation, and may display ads through networks such as Google AdSense.",
          ],
        },
        {
          title: "8. Disclaimer",
          paragraphs: [
            "Nolza.fun attempts to provide a stable service, but does not guarantee the accuracy, completeness, or suitability of all content. The service is provided as-is.",
          ],
        },
        {
          title: "9. Changes",
          paragraphs: [
            "These terms may be updated from time to time, and updated terms may be posted on the site.",
          ],
        },
        {
          title: "10. Contact",
          paragraphs: ["For terms-related inquiries, contact:"],
          email: true,
        },
      ],
    },
  },
};

export default function TrustLocalizedPage({ page }: { page: TrustPageId }) {
  const { locale, setLocale } = useLocale();
  const copy = TRUST_CONTENT[page][locale] ?? TRUST_CONTENT[page].ko;
  const common = COMMON[locale] ?? COMMON.ko;

  return (
    <TrustPage
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      backLabel={common.back}
      lang={locale}
      actions={
        <div className="trust-locale-switch" aria-label={common.languageLabel}>
          {(["ko", "en"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={locale === item}
              onClick={() => setLocale(item)}
            >
              {COMMON[item].languageName}
            </button>
          ))}
        </div>
      }
    >
      {copy.updated ? <p className="trust-updated">{copy.updated}</p> : null}

      {copy.sections.map((section) => (
        <TrustSection key={section.title} title={section.title}>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {section.email ? (
            <p className="trust-email">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          ) : null}

          {section.list ? (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {section.definitions ? (
            <dl className="trust-list">
              {section.definitions.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>
                    {item.value === CONTACT_EMAIL ? (
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </TrustSection>
      ))}
    </TrustPage>
  );
}
