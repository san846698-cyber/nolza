"use client";

import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";
import { homeBackLabel } from "@/app/components/BrandMark";

type TrustPageId = "about" | "contact" | "privacy" | "terms" | "disclaimer";

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
const UPDATED_KO = "최종 업데이트: 2026년 6월 1일";
const UPDATED_EN = "Last updated: June 1, 2026";

const COMMON: Record<SimpleLocale, { back: string; languageLabel: string }> = {
  ko: {
    back: homeBackLabel("ko"),
    languageLabel: "언어 선택",
  },
  en: {
    back: homeBackLabel("en"),
    languageLabel: "Language",
  },
};

const TRUST_CONTENT: Record<TrustPageId, Record<SimpleLocale, TrustContent>> = {
  about: {
    ko: {
      eyebrow: "소개",
      title: "Nolza 소개",
      subtitle:
        "Nolza는 심리테스트, 관계 테스트, 이름 기반 결과, 짧은 브라우저 게임을 제공하는 한국어 중심 인터랙티브 콘텐츠 사이트입니다.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "Nolza가 제공하는 콘텐츠",
          paragraphs: [
            "Nolza는 설치나 회원가입 없이 바로 즐길 수 있는 테스트와 게임을 만듭니다. 사용자는 짧은 문항에 답하거나 이름을 입력하고, 결과 설명과 공유 가능한 카드 형태의 콘텐츠를 읽을 수 있습니다.",
            "콘텐츠의 중심은 재미, 자기성찰, 친구와의 대화입니다. 결과는 사용자의 선택을 바탕으로 읽기 쉬운 이야기와 키워드로 구성되며, 전문 진단이나 상담을 대신하지 않습니다.",
          ],
        },
        {
          title: "콘텐츠 기준",
          paragraphs: [
            "각 테스트는 문항, 결과 설명, 관련 가이드, 내부 링크를 통해 사용자가 단순한 결과표보다 더 풍부한 맥락을 읽을 수 있도록 구성합니다.",
            "심리학 용어가 쓰이는 경우에도 결과를 병명이나 진단으로 표현하지 않고, 일상에서 자신을 이해하기 위한 엔터테인먼트 언어로 다룹니다.",
          ],
        },
        {
          title: "운영 정보",
          definitions: [
            { term: "사이트명", value: "Nolza / nolza.fun" },
            { term: "운영", value: "Studio4Any" },
            { term: "문의", value: CONTACT_EMAIL },
          ],
        },
      ],
    },
    en: {
      eyebrow: "About",
      title: "About Nolza",
      subtitle:
        "Nolza is a Korean-first interactive content site for psychology-style tests, relationship tests, name-based results, and short browser games.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "What Nolza Provides",
          paragraphs: [
            "Nolza creates browser-based tests and games that can be used without installation or account registration. Users answer short questions or enter simple inputs, then read a result explanation or shareable result card.",
            "The site focuses on entertainment, self-reflection, and conversation. Results turn choices into readable stories and keywords; they do not replace professional diagnosis or counseling.",
          ],
        },
        {
          title: "Content Standards",
          paragraphs: [
            "We aim to support each test with questions, result explanations, related guides, and internal links so users can read more than a thin result page.",
            "When psychology-related terms are used, they are presented as entertainment language for everyday reflection, not as medical or clinical labels.",
          ],
        },
        {
          title: "Operator Information",
          definitions: [
            { term: "Site name", value: "Nolza / nolza.fun" },
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
      subtitle: "오류 제보, 콘텐츠 문의, 개인정보 문의, 권리 관련 요청, 광고와 제휴 문의는 이메일로 보내주세요.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "이메일 문의",
          paragraphs: [
            "Nolza 관련 문의는 아래 이메일로 받을 수 있습니다. 현재 전화 상담이나 오프라인 방문 접수는 운영하지 않습니다.",
            "버그나 깨진 링크를 제보할 때는 문제가 생긴 페이지 주소, 사용 기기와 브라우저, 어떤 동작에서 문제가 생겼는지를 함께 적어주시면 확인에 도움이 됩니다.",
          ],
          email: true,
        },
        {
          title: "문의 가능한 내용",
          list: [
            "페이지 오류, 깨진 링크, 표시 문제",
            "콘텐츠 수정 요청 또는 제안",
            "개인정보, 쿠키, 광고 관련 문의",
            "저작권, 상표권 등 권리 관련 요청",
            "광고, 제휴, 비즈니스 문의",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Contact",
      title: "Contact Nolza",
      subtitle:
        "For bug reports, content questions, privacy requests, rights-related requests, advertising, or partnership inquiries, please contact us by email.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "Email Contact",
          paragraphs: [
            "Please send Nolza-related inquiries to the email below. We do not currently provide phone support or offline visitor support.",
            "For bug reports, include the page URL, device/browser information, and the action that caused the issue so we can review it more quickly.",
          ],
          email: true,
        },
        {
          title: "What You Can Contact Us About",
          list: [
            "Page errors, broken links, or display issues",
            "Content correction requests or suggestions",
            "Privacy, cookie, or advertising questions",
            "Copyright, trademark, or other rights-related requests",
            "Advertising, partnership, or business inquiries",
          ],
        },
      ],
    },
  },
  privacy: {
    ko: {
      eyebrow: "개인정보",
      title: "개인정보처리방침",
      subtitle: "Nolza 이용 중 처리될 수 있는 입력값, 쿠키, 분석, 광고 관련 정보를 설명합니다.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "수집 또는 처리될 수 있는 정보",
          paragraphs: [
            "대부분의 콘텐츠는 회원가입 없이 이용할 수 있습니다. 일부 테스트는 결과를 만들기 위해 이름, 별명, 생년, 성별, 선택지 같은 값을 요청할 수 있습니다.",
            "공유 링크를 만드는 콘텐츠에서는 같은 결과를 다시 열기 위해 필요한 최소한의 값이 URL에 포함될 수 있습니다. 링크를 다른 사람에게 보내면 그 사람이 해당 결과를 볼 수 있습니다.",
          ],
        },
        {
          title: "쿠키, 분석, 광고",
          paragraphs: [
            "사이트 운영, 오류 확인, 성능 개선, 트래픽 분석, 광고 제공을 위해 브라우저 정보, 기기 정보, 방문 페이지, 접속 시간, 대략적인 지역, 참조 URL 같은 기술 정보가 처리될 수 있습니다.",
            "Nolza는 광고 또는 분석 도구를 사용할 수 있으며, 사용자는 브라우저 설정을 통해 쿠키를 제한하거나 삭제할 수 있습니다. 쿠키를 제한하면 일부 기능이나 광고 표시 방식이 달라질 수 있습니다.",
            "Nolza는 Google AdSense를 포함한 제3자 광고 공급자를 사용할 수 있습니다. Google을 비롯한 제3자 공급자는 쿠키(DoubleClick 광고 쿠키 등)를 사용해 사용자의 이 사이트 또는 다른 사이트 방문 기록을 기반으로 광고를 게재할 수 있습니다. 사용자는 Google 광고 설정(adssettings.google.com)에서 맞춤 광고를 끄거나, www.aboutads.info 에서 제3자 공급자의 쿠키 사용을 관리할 수 있습니다.",
          ],
        },
        {
          title: "민감한 정보 입력 금지",
          paragraphs: [
            "Nolza 테스트는 실제 비밀번호, 주민등록번호, 결제 정보, 건강 정보, 법률 분쟁 정보 같은 민감한 개인정보를 요구하지 않습니다. 이러한 정보는 입력하지 마세요.",
          ],
        },
        {
          title: "문의와 요청",
          paragraphs: [
            "개인정보 관련 문의, 삭제 요청, 권리 관련 요청은 아래 이메일로 보내주세요. 확인 가능한 범위에서 검토하겠습니다.",
          ],
          email: true,
        },
      ],
    },
    en: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      subtitle: "This page explains inputs, cookies, analytics, and advertising information that may relate to using Nolza.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "Information That May Be Processed",
          paragraphs: [
            "Most content can be used without account registration. Some tests may request values such as a name, nickname, birth year, gender, or selected answers to generate a result.",
            "For shareable result links, the minimum values needed to reopen the same result may be included in the URL. If you send the link to someone else, that person may be able to view the result.",
          ],
        },
        {
          title: "Cookies, Analytics, and Advertising",
          paragraphs: [
            "For site operation, debugging, performance improvement, traffic analytics, and advertising, technical information such as browser type, device type, visited pages, access time, approximate region, and referring URL may be processed.",
            "Nolza may use advertising or analytics tools. Users can limit or delete cookies through browser settings, though some features or advertising behavior may change.",
            "Nolza may use third-party advertising vendors, including Google AdSense. Third parties such as Google may use cookies (including the DoubleClick advertising cookie) to serve ads based on a user's visits to this and other websites. Users can opt out of personalized advertising in Google Ads Settings (adssettings.google.com), or manage third-party vendor cookies at www.aboutads.info.",
          ],
        },
        {
          title: "Do Not Enter Sensitive Information",
          paragraphs: [
            "Nolza tests do not require real passwords, national ID numbers, payment information, health information, or legal dispute details. Please do not enter such information.",
          ],
        },
        {
          title: "Questions and Requests",
          paragraphs: ["For privacy questions, deletion requests, or rights-related requests, contact us at:"],
          email: true,
        },
      ],
    },
  },
  terms: {
    ko: {
      eyebrow: "약관",
      title: "이용약관",
      subtitle: "Nolza 콘텐츠의 성격과 기본 이용 기준을 안내합니다.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "서비스 이용",
          paragraphs: [
            "Nolza를 이용함으로써 사용자는 본 약관에 동의한 것으로 봅니다. 동의하지 않는 경우 사이트 이용을 중단할 수 있습니다.",
            "Nolza는 심리테스트, 관계 테스트, 이름 기반 결과, 문화형 테스트, 브라우저 미니게임 등 인터랙티브 엔터테인먼트 콘텐츠를 제공합니다.",
          ],
        },
        {
          title: "사용자 책임",
          list: [
            "악성 코드, 자동화 공격, 스팸, 무단 스크래핑 금지",
            "타인의 개인정보나 민감정보를 허락 없이 입력하거나 공유하지 않기",
            "결과 공유 링크를 이용해 타인을 괴롭히거나 오해를 유발하지 않기",
            "저작권, 상표권 등 제3자의 권리를 침해하지 않기",
          ],
        },
        {
          title: "콘텐츠의 한계",
          paragraphs: [
            "Nolza는 안정적인 서비스를 제공하기 위해 노력하지만 모든 콘텐츠의 정확성, 완전성, 지속적인 제공을 보장하지 않습니다.",
            "테스트와 게임 결과는 재미와 자기성찰을 위한 것이며, 전문적인 판단이나 조언을 대신하지 않습니다.",
          ],
        },
        {
          title: "문의",
          paragraphs: ["약관 관련 문의는 아래 이메일로 보내주세요."],
          email: true,
        },
      ],
    },
    en: {
      eyebrow: "Terms",
      title: "Terms of Use",
      subtitle: "These terms explain the nature of Nolza content and basic rules for using the site.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "Use of Service",
          paragraphs: [
            "By using Nolza, you agree to these Terms of Use. If you do not agree, you may stop using the site.",
            "Nolza provides interactive entertainment content such as psychology-style tests, relationship tests, name-based results, culture tests, and browser mini games.",
          ],
        },
        {
          title: "User Responsibility",
          list: [
            "Do not use malicious code, automated attacks, spam, or unauthorized scraping.",
            "Do not enter or share another person's private or sensitive information without permission.",
            "Do not use result share links to harass others or create misleading situations.",
            "Do not infringe copyrights, trademarks, or other third-party rights.",
          ],
        },
        {
          title: "Content Limitations",
          paragraphs: [
            "Nolza tries to provide a stable service, but does not guarantee the accuracy, completeness, or continuous availability of all content.",
            "Test and game results are for entertainment and self-reflection and do not replace professional judgment or advice.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["For terms-related inquiries, contact:"],
          email: true,
        },
      ],
    },
  },
  disclaimer: {
    ko: {
      eyebrow: "면책 고지",
      title: "콘텐츠 이용 고지",
      subtitle:
        "Nolza의 테스트와 게임은 재미와 자기성찰을 위한 엔터테인먼트 콘텐츠이며 전문 진단이나 조언이 아닙니다.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "전문 진단 또는 조언이 아닙니다",
          paragraphs: [
            "Nolza의 심리테스트, 관계 테스트, 애착유형 테스트, 인지왜곡 테스트, 방어기제 테스트, 공포 테스트, 운세형 콘텐츠, 미니게임 결과는 모두 엔터테인먼트와 자기성찰을 위한 참고 콘텐츠입니다.",
            "이 결과는 의학적 진단, 심리학적 진단, 정신건강 상담, 법률 조언, 재정 조언, 투자 조언, 관계 판단, 직업 상담 또는 기타 전문적인 조언을 대신하지 않습니다.",
          ],
        },
        {
          title: "중요한 결정에는 사용하지 마세요",
          paragraphs: [
            "건강, 법률, 재정, 관계, 진로, 안전과 관련된 중요한 결정은 테스트 결과가 아니라 신뢰할 수 있는 정보, 실제 대화, 자격을 갖춘 전문가의 도움을 바탕으로 판단해야 합니다.",
            "콘텐츠를 이용하다가 불편한 감정이 오래 지속되거나 일상에 영향을 준다면 가까운 사람 또는 관련 전문가와 상담하는 것이 좋습니다.",
          ],
        },
        {
          title: "결과 해석 방식",
          paragraphs: [
            "결과는 사용자의 선택을 바탕으로 구성된 이야기형 해석입니다. 맞는 부분만 가볍게 참고하고, 맞지 않는 부분은 재미있는 표현으로 넘겨도 괜찮습니다.",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Disclaimer",
      title: "Content Disclaimer",
      subtitle:
        "Nolza tests and games are entertainment and self-reflection content. They are not professional diagnosis or advice.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "Not Professional Diagnosis or Advice",
          paragraphs: [
            "Nolza psychology-style tests, relationship tests, attachment tests, cognitive distortion tests, defense mechanism tests, fear tests, fortune-style content, and mini game results are for entertainment and self-reflection only.",
            "Results do not replace medical diagnosis, psychological diagnosis, mental health counseling, legal advice, financial advice, investment advice, relationship judgment, career counseling, or any other professional advice.",
          ],
        },
        {
          title: "Do Not Use for Important Decisions",
          paragraphs: [
            "Important decisions about health, law, finance, relationships, work, or safety should be based on reliable information, real conversation, and help from qualified professionals where appropriate.",
            "If content leaves you distressed for a long time or affects daily life, consider talking to someone you trust or a qualified professional.",
          ],
        },
        {
          title: "How to Read Results",
          paragraphs: [
            "Results are story-like interpretations based on user choices. Keep the parts that feel useful and treat the rest as playful expression.",
          ],
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
          <button
            type="button"
            aria-pressed={locale === "ko"}
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          >
            KO / EN
          </button>
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
