"use client";

import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";
import { homeBackLabel } from "@/app/components/BrandMark";

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
const UPDATED_KO = "최종 업데이트: 2026년 5월 21일";
const UPDATED_EN = "Last updated: May 21, 2026";

const COMMON: Record<SimpleLocale, { back: string; languageLabel: string; languageName: string }> = {
  ko: {
    back: homeBackLabel("ko"),
    languageLabel: "언어 선택",
    languageName: "한",
  },
  en: {
    back: homeBackLabel("en"),
    languageLabel: "Language",
    languageName: "EN",
  },
};

const TRUST_CONTENT: Record<TrustPageId, Record<SimpleLocale, TrustContent>> = {
  about: {
    ko: {
      eyebrow: "소개",
      title: "놀자.fun 소개",
      subtitle:
        "놀자.fun은 웹에서 바로 즐기는 테스트, 관계 콘텐츠, 운세형 결과, 미니게임을 만드는 인터랙티브 엔터테인먼트 사이트입니다.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "어떤 사이트인가요?",
          paragraphs: [
            "놀자.fun은 회원가입이나 앱 설치 없이 브라우저에서 바로 즐길 수 있는 짧은 콘텐츠를 제공합니다. 심리 테스트, 커플/친구 궁합, 한국 문화 기반 테스트, 운세형 리딩, 반응형 미니게임처럼 결과를 읽고 공유하기 좋은 웹 경험을 중심으로 운영됩니다.",
            "사이트의 목표는 사용자가 혼자 가볍게 즐기거나 친구에게 보내 대화를 시작할 수 있는 오리지널 콘텐츠를 꾸준히 만드는 것입니다.",
          ],
        },
        {
          title: "콘텐츠를 만드는 기준",
          paragraphs: [
            "각 콘텐츠는 짧게 시작하되 결과를 읽을 수 있도록 설명, 맥락, 관련 추천을 함께 제공하는 방향으로 구성합니다.",
            "테스트와 운세형 결과는 재미와 자기이해를 위한 엔터테인먼트입니다. 실제 성격 진단, 궁합 판단, 의학적·법률적·재정적 조언을 대신하지 않습니다.",
          ],
        },
        {
          title: "운영과 광고",
          paragraphs: [
            "놀자.fun은 Studio4Any가 운영합니다. 사이트 운영을 위해 트래픽 분석 도구와 광고 서비스를 사용할 수 있으며, 광고가 표시되는 경우에도 결과 확인과 주요 조작을 방해하지 않도록 배치를 관리합니다.",
            "오류 제보, 콘텐츠 관련 요청, 광고/비즈니스 문의는 Contact 페이지의 이메일로 받을 수 있습니다.",
          ],
        },
        {
          title: "운영자 정보",
          definitions: [
            { term: "사이트명", value: "놀자.fun" },
            { term: "운영자", value: "Studio4Any" },
            { term: "문의", value: CONTACT_EMAIL },
          ],
        },
      ],
    },
    en: {
      eyebrow: "About",
      title: "About nolza.fun",
      subtitle:
        "nolza.fun is an interactive entertainment site for browser tests, relationship results, fortune-style readings, and mini games.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "What is nolza.fun?",
          paragraphs: [
            "nolza.fun provides short browser-based experiences that can be used without account registration or app installation. The site focuses on psychology-style tests, couple and friendship compatibility, Korean culture-inspired content, fortune-style readings, and mini games designed to be read and shared.",
            "Our goal is to create original web content that users can enjoy casually on their own or send to friends as a conversation starter.",
          ],
        },
        {
          title: "Content Standards",
          paragraphs: [
            "We try to make each experience quick to start while still giving users readable context, result explanations, and related recommendations.",
            "Tests and fortune-style results are entertainment content for fun and self-reflection. They do not replace real personality diagnosis, relationship judgment, medical advice, legal advice, financial advice, or other professional advice.",
          ],
        },
        {
          title: "Operation and Advertising",
          paragraphs: [
            "nolza.fun is operated by Studio4Any. We may use traffic analytics and advertising services to operate and improve the site. When ads are displayed, we try to place them so they do not interfere with result reading or core actions.",
            "Bug reports, content-related requests, advertising inquiries, and business inquiries can be sent through the email listed on the Contact page.",
          ],
        },
        {
          title: "Operator Information",
          definitions: [
            { term: "Site name", value: "nolza.fun" },
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
        "오류 제보, 콘텐츠 관련 요청, 개인정보 문의, 광고/비즈니스 문의는 아래 이메일로 연락해주세요.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "이메일 문의",
          paragraphs: [
            "놀자.fun 관련 문의는 아래 이메일로 보내주세요. 현재 별도의 전화 상담이나 오프라인 방문 접수는 운영하지 않습니다.",
            "정상적인 문의는 가능한 빠르게 확인하려고 노력합니다. 다만 문의량이나 내용에 따라 답변에 시간이 걸릴 수 있습니다.",
          ],
          email: true,
        },
        {
          title: "보내주시면 좋은 내용",
          paragraphs: [
            "오류나 깨진 링크를 제보할 때는 문제가 발생한 페이지 주소, 사용한 기기/브라우저, 어떤 동작을 했을 때 문제가 생겼는지 적어주시면 확인에 도움이 됩니다.",
          ],
          list: [
            "서비스 이용 문의",
            "오류, 깨진 링크, 표시 문제 제보",
            "개인정보 또는 광고/쿠키 관련 문의",
            "저작권, 상표권 등 권리 관련 요청",
            "광고, 제휴, 비즈니스 문의",
            "콘텐츠 개선 아이디어와 일반 피드백",
          ],
        },
        {
          title: "권리 관련 요청",
          paragraphs: [
            "저작권 또는 기타 권리와 관련된 요청은 권리자임을 확인할 수 있는 정보, 문제가 되는 URL, 요청 내용을 함께 보내주세요. 확인 가능한 범위에서 검토하겠습니다.",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Contact",
      title: "Contact nolza.fun",
      subtitle:
        "For bug reports, content requests, privacy questions, advertising inquiries, and business inquiries, please contact us by email.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "Email Contact",
          paragraphs: [
            "For nolza.fun-related inquiries, please contact us at the email below. We do not currently provide phone support or offline visitor support.",
            "We try to review legitimate inquiries as soon as possible. Response time may vary depending on the volume and nature of the request.",
          ],
          email: true,
        },
        {
          title: "Helpful Details to Include",
          paragraphs: [
            "For bug reports or broken links, please include the page URL, your device/browser, and what action caused the issue. This helps us review the problem more quickly.",
          ],
          list: [
            "Service questions",
            "Bug reports, broken links, or display issues",
            "Privacy, advertising, or cookie-related questions",
            "Copyright, trademark, or other rights-related requests",
            "Advertising, partnership, or business inquiries",
            "Content ideas and general feedback",
          ],
        },
        {
          title: "Rights-Related Requests",
          paragraphs: [
            "For copyright or other rights-related requests, please include information showing that you are the rights holder, the relevant URL, and a clear description of the request. We will review verifiable requests within a reasonable scope.",
          ],
        },
      ],
    },
  },
  privacy: {
    ko: {
      eyebrow: "개인정보",
      title: "개인정보처리방침",
      subtitle:
        "이 문서는 놀자.fun 이용 중 어떤 정보가 사용될 수 있는지, 쿠키·분석·광고가 어떻게 관련되는지 설명합니다.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "1. 놀자.fun이 제공하는 서비스",
          paragraphs: [
            "놀자.fun은 웹게임, 심리/관계 테스트, 운세형 결과, 시뮬레이션, 문화 퀴즈 등 브라우저 기반 엔터테인먼트 콘텐츠를 제공하는 사이트입니다.",
            "대부분의 콘텐츠는 회원가입 없이 이용할 수 있으며, 결과 생성에 필요한 이름, 선택지, 생년 등 입력값은 해당 콘텐츠의 결과를 만들고 화면에 보여주기 위해 사용됩니다.",
          ],
        },
        {
          title: "2. 사용자가 입력하는 정보",
          paragraphs: [
            "일부 테스트는 이름, 별명, 생년, 성별, 선택한 답변처럼 결과 계산에 필요한 값을 요청할 수 있습니다. 이러한 값은 결과 화면을 만들거나 사용자가 공유 링크를 만들 때 사용됩니다.",
            "공유 링크를 생성하는 콘텐츠의 경우, 결과를 다시 열기 위해 필요한 최소한의 값이 URL 안에 인코딩되어 포함될 수 있습니다. 공유 링크를 다른 사람에게 보내면 그 링크를 받은 사람이 해당 결과를 볼 수 있습니다.",
            "실제 비밀번호, 주민등록번호, 결제 정보, 민감한 개인정보는 입력하지 마세요. 놀자.fun의 테스트는 그런 정보를 요구하지 않습니다.",
          ],
        },
        {
          title: "3. 자동으로 처리될 수 있는 기술 정보",
          paragraphs: [
            "사이트 운영, 보안, 오류 확인, 성능 개선, 통계 분석, 광고 제공을 위해 브라우저 종류, 기기 정보, 방문 페이지, 접속 시간, 대략적인 지역, 상호작용 정보, 참조 URL 같은 기술 정보가 처리될 수 있습니다.",
            "일부 미니게임은 최고 기록, 최근 설정, 진행 상태 등을 사용자의 브라우저 저장소에 저장할 수 있습니다. 이 정보는 일반적으로 사용자의 기기 안에서 동작하며, 사용자는 브라우저 설정에서 삭제할 수 있습니다.",
          ],
        },
        {
          title: "4. 쿠키와 유사 기술",
          paragraphs: [
            "놀자.fun은 사이트 기능 개선, 언어/사용 환경 유지, 트래픽 분석, 광고 제공을 위해 쿠키 또는 유사한 기술을 사용할 수 있습니다.",
            "사용자는 브라우저 설정을 통해 쿠키를 제한하거나 삭제할 수 있습니다. 다만 쿠키를 제한하면 일부 기능, 분석, 광고 표시 방식이 달라질 수 있습니다.",
          ],
        },
        {
          title: "5. 분석 도구",
          paragraphs: [
            "놀자.fun은 방문자 수, 페이지 이용 방식, 콘텐츠 성과, 오류 상황을 이해하고 서비스를 개선하기 위해 Google Analytics 등 분석 도구를 사용할 수 있습니다.",
            "분석 도구는 사이트 이용 패턴을 통계적으로 이해하기 위한 목적으로 사용되며, 가능한 범위에서 서비스 품질 개선에 활용됩니다.",
          ],
        },
        {
          title: "6. 광고와 제3자 서비스",
          paragraphs: [
            "놀자.fun은 Google AdSense 등 제3자 광고 서비스를 통해 광고를 표시할 수 있습니다. Google을 포함한 광고 제공업체는 쿠키를 사용해 사용자의 이전 방문 기록을 바탕으로 광고를 제공할 수 있습니다.",
            "광고, 분석, 호스팅, 보안 등 사이트 운영에 필요한 범위에서 제3자 서비스 제공업체가 일부 기술 정보를 처리할 수 있습니다. 놀자.fun은 사용자의 개인정보를 판매하지 않습니다.",
            "Google의 광고 개인정보 설정에서 맞춤 광고를 관리할 수 있습니다.",
          ],
        },
        {
          title: "7. 엔터테인먼트 결과의 성격",
          paragraphs: [
            "놀자.fun의 테스트, 궁합, 운세형 콘텐츠, 시뮬레이션, 게임은 재미와 자기이해를 위한 콘텐츠입니다. 결과는 전문적인 진단, 상담, 조언을 대체하지 않습니다.",
          ],
        },
        {
          title: "8. 보관과 삭제 요청",
          paragraphs: [
            "문의 이메일로 직접 보내는 정보는 문의 확인과 답변을 위해 필요한 기간 동안 보관될 수 있습니다.",
            "개인정보 관련 문의, 삭제 요청, 권리 관련 요청은 아래 이메일로 보내주세요. 확인 가능한 범위에서 검토하겠습니다.",
          ],
          email: true,
        },
        {
          title: "9. 아동 개인정보",
          paragraphs: [
            "놀자.fun은 일반 이용자를 대상으로 하며, 고의로 아동의 개인정보를 수집하지 않습니다. 보호자가 아동의 개인정보가 제공되었다고 판단하는 경우 이메일로 삭제를 요청할 수 있습니다.",
          ],
        },
        {
          title: "10. 변경",
          paragraphs: [
            "이 개인정보처리방침은 서비스 변경, 법령 변경, 광고/분석 도구 변경 등에 따라 업데이트될 수 있으며, 변경된 내용은 이 페이지에 게시됩니다.",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      subtitle:
        "This page explains what information may be used on nolza.fun and how cookies, analytics, and advertising may relate to your visit.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "1. What nolza.fun Provides",
          paragraphs: [
            "nolza.fun provides browser-based entertainment content such as mini games, psychology and relationship tests, fortune-style results, simulations, and culture quizzes.",
            "Most content can be used without account registration. Names, choices, birth years, and similar inputs requested by a specific experience are used to generate and display that result.",
          ],
        },
        {
          title: "2. Information You Enter",
          paragraphs: [
            "Some tests may ask for a name, nickname, birth year, gender, or selected answers that are needed to calculate a result. These values are used to create the result screen or to create a share link when the user chooses to share.",
            "For content with share links, the minimum values needed to reopen the same result may be encoded in the URL. If you send that link to someone else, the recipient may be able to view that result.",
            "Do not enter real passwords, national ID numbers, payment information, or sensitive personal information. nolza.fun tests do not require such information.",
          ],
        },
        {
          title: "3. Technical Information",
          paragraphs: [
            "For site operation, security, debugging, performance improvement, analytics, and advertising, technical information such as browser type, device type, pages visited, access time, approximate region, interaction data, and referring URL may be processed.",
            "Some mini games may store best scores, recent settings, or progress in your browser storage. This information usually stays on your device and can be removed through your browser settings.",
          ],
        },
        {
          title: "4. Cookies and Similar Technologies",
          paragraphs: [
            "nolza.fun may use cookies or similar technologies to improve site functionality, remember language or usage preferences, analyze traffic, and support advertising.",
            "You can limit or delete cookies through your browser settings. Limiting cookies may affect some features, analytics, or ad behavior.",
          ],
        },
        {
          title: "5. Analytics",
          paragraphs: [
            "nolza.fun may use analytics tools such as Google Analytics to understand traffic, page usage, content performance, and errors.",
            "Analytics tools are used to understand site usage in aggregate and to improve service quality where possible.",
          ],
        },
        {
          title: "6. Advertising and Third-Party Services",
          paragraphs: [
            "nolza.fun may display advertisements through third-party advertising services such as Google AdSense. Advertising providers, including Google, may use cookies to serve ads based on prior visits to this or other websites.",
            "Third-party service providers may process limited technical information for hosting, analytics, advertising, and security purposes. nolza.fun does not sell personal information.",
            "You can manage personalized ads through Google's advertising privacy settings.",
          ],
        },
        {
          title: "7. Nature of Entertainment Results",
          paragraphs: [
            "Tests, compatibility results, fortune-style content, simulations, and games on nolza.fun are for entertainment and self-reflection only. Results do not replace professional diagnosis, counseling, or advice.",
          ],
        },
        {
          title: "8. Retention and Requests",
          paragraphs: [
            "Information you send directly by email may be kept as long as reasonably needed to review and respond to the inquiry.",
            "For privacy questions, deletion requests, or rights-related requests, contact us at the email below. We will review verifiable requests within a reasonable scope.",
          ],
          email: true,
        },
        {
          title: "9. Children's Privacy",
          paragraphs: [
            "nolza.fun is intended for a general audience and does not knowingly collect personal information from children. If a parent or guardian believes a child has provided personal information, they may contact us to request removal.",
          ],
        },
        {
          title: "10. Changes",
          paragraphs: [
            "This Privacy Policy may be updated when the service, applicable laws, or advertising/analytics tools change. Updated content will be posted on this page.",
          ],
        },
      ],
    },
  },
  terms: {
    ko: {
      eyebrow: "이용약관",
      title: "이용약관",
      subtitle: "놀자.fun을 이용하기 전에 엔터테인먼트 콘텐츠의 성격과 기본 이용 기준을 확인해주세요.",
      updated: UPDATED_KO,
      sections: [
        {
          title: "1. 약관 동의",
          paragraphs: [
            "놀자.fun을 이용함으로써 사용자는 본 이용약관에 동의한 것으로 간주됩니다. 동의하지 않는 경우 사이트 이용을 중단할 수 있습니다.",
          ],
        },
        {
          title: "2. 서비스 내용",
          paragraphs: [
            "놀자.fun은 웹게임, 심리/관계 테스트, 궁합 테스트, 운세형 콘텐츠, 시뮬레이션, 문화 퀴즈 등 인터랙티브 엔터테인먼트 콘텐츠를 제공합니다.",
            "일부 콘텐츠는 사용자의 입력값을 바탕으로 결과를 만들고, 사용자가 선택할 경우 결과 링크나 결과 이미지를 공유할 수 있게 합니다.",
          ],
        },
        {
          title: "3. 엔터테인먼트 목적",
          paragraphs: [
            "놀자.fun의 결과는 재미와 자기이해를 위한 콘텐츠입니다. 실제 성격 진단, 궁합 판단, 사주 상담, 의료·법률·재정·투자·연애 조언을 제공하지 않습니다.",
            "중요한 결정은 사이트 결과가 아니라 사용자의 판단과 필요한 경우 관련 전문가의 조언을 바탕으로 해야 합니다.",
          ],
        },
        {
          title: "4. 사용자 책임",
          paragraphs: [
            "사용자는 사이트를 정상적인 방식으로 이용해야 하며, 타인의 권리를 침해하거나 서비스 운영을 방해해서는 안 됩니다.",
          ],
          list: [
            "악성 코드, 자동화 공격, 스팸, 무단 크롤링 금지",
            "타인의 개인정보 또는 민감정보를 무단 입력하거나 공유하지 않기",
            "결과 공유 링크를 타인을 괴롭히거나 오해를 유발하는 방식으로 사용하지 않기",
            "저작권, 상표권 등 제3자의 권리를 침해하지 않기",
          ],
        },
        {
          title: "5. 공유 링크와 공개 범위",
          paragraphs: [
            "결과 공유 링크를 만들면 해당 결과를 다시 열기 위한 정보가 URL에 포함될 수 있습니다. 사용자가 링크를 다른 사람에게 보내면 수신자가 그 결과를 볼 수 있습니다.",
            "공유하기 전 이름, 별명, 기타 입력값이 상대방에게 보여져도 괜찮은지 확인해주세요.",
          ],
        },
        {
          title: "6. 지식재산권",
          paragraphs: [
            "놀자.fun의 오리지널 콘텐츠, 디자인, 문구, 그래픽, 로고, 인터랙티브 경험은 별도 표시가 없는 한 사이트 또는 운영자에게 권리가 있습니다.",
            "개인적인 공유나 링크 전달은 가능하지만, 무단 복제, 대량 배포, 상업적 재사용, 서비스 모방을 위한 사용은 금지됩니다.",
          ],
        },
        {
          title: "7. 제3자 서비스와 광고",
          paragraphs: [
            "놀자.fun은 호스팅, 분석, 광고, 보안 등 사이트 운영을 위해 제3자 서비스를 사용할 수 있으며, Google AdSense 등 광고 네트워크를 통해 광고를 표시할 수 있습니다.",
            "제3자 서비스의 이용 조건과 개인정보 처리 방식은 해당 서비스의 정책이 적용될 수 있습니다.",
          ],
        },
        {
          title: "8. 서비스 변경과 중단",
          paragraphs: [
            "놀자.fun은 콘텐츠, 기능, 디자인, 광고 배치, 제공 방식을 개선 또는 변경할 수 있습니다. 오류 수정, 운영상 필요, 보안 문제 등으로 일부 서비스가 일시적으로 중단될 수 있습니다.",
          ],
        },
        {
          title: "9. 면책",
          paragraphs: [
            "놀자.fun은 가능한 안정적인 서비스를 제공하기 위해 노력하지만 모든 콘텐츠의 정확성, 완전성, 지속 제공을 보장하지 않습니다. 서비스는 현재 제공되는 상태 그대로 제공됩니다.",
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
      title: "Terms of Use",
      subtitle:
        "Please review the entertainment nature of nolza.fun content and the basic rules for using the site.",
      updated: UPDATED_EN,
      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "By using nolza.fun, you agree to these Terms of Use. If you do not agree, you may stop using the site.",
          ],
        },
        {
          title: "2. Service Content",
          paragraphs: [
            "nolza.fun provides interactive entertainment content such as browser games, psychology and relationship tests, compatibility tests, fortune-style content, simulations, and culture quizzes.",
            "Some content generates results from user inputs and may allow users to share a result link or result image if they choose to do so.",
          ],
        },
        {
          title: "3. Entertainment Purpose",
          paragraphs: [
            "nolza.fun results are for fun and self-reflection. The site does not provide real personality diagnosis, relationship judgment, fortune consultation, medical advice, legal advice, financial advice, investment advice, or dating advice.",
            "Important decisions should be based on your own judgment and, where necessary, advice from qualified professionals.",
          ],
        },
        {
          title: "4. User Responsibility",
          paragraphs: [
            "Users must use the site in a normal and responsible way and must not interfere with the service or violate the rights of others.",
          ],
          list: [
            "Do not use malicious code, automated attacks, spam, or unauthorized scraping.",
            "Do not enter or share another person's private or sensitive information without permission.",
            "Do not use result share links to harass others or intentionally create misleading situations.",
            "Do not infringe copyrights, trademarks, or other third-party rights.",
          ],
        },
        {
          title: "5. Share Links and Visibility",
          paragraphs: [
            "When a result share link is created, information needed to reopen that result may be included in the URL. If you send the link to someone else, the recipient may be able to view that result.",
            "Before sharing, make sure you are comfortable with the other person seeing the name, nickname, or other input values shown in the result.",
          ],
        },
        {
          title: "6. Intellectual Property",
          paragraphs: [
            "Original content, design, text, graphics, logos, and interactive experiences on nolza.fun belong to the site or its operator unless otherwise stated.",
            "Personal sharing and link sharing are allowed, but unauthorized copying, mass distribution, commercial reuse, or use for copying the service is prohibited.",
          ],
        },
        {
          title: "7. Third-Party Services and Ads",
          paragraphs: [
            "nolza.fun may use third-party services for hosting, analytics, advertising, security, and site operation, and may display ads through networks such as Google AdSense.",
            "The terms and privacy practices of third-party services may apply to those services.",
          ],
        },
        {
          title: "8. Service Changes and Interruptions",
          paragraphs: [
            "nolza.fun may improve or change content, features, design, advertising placement, or service methods. Some services may be temporarily interrupted for bug fixes, operational needs, or security reasons.",
          ],
        },
        {
          title: "9. Disclaimer",
          paragraphs: [
            "nolza.fun tries to provide a stable service, but does not guarantee the accuracy, completeness, or continuous availability of all content. The service is provided as-is.",
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
          <button
            type="button"
            aria-pressed={locale === "ko"}
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          >
            한 / EN
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
