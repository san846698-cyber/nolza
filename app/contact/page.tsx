import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/app/components/TrustPage";

const contactEmail = "studio4any@gmail.com";

export const metadata: Metadata = {
  title: "Contact Nolza.fun | Studio4Any",
  description:
    "Contact Nolza.fun for feedback, copyright concerns, bug reports, or business inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <TrustPage
      eyebrow="Contact Us"
      title="Contact Nolza.fun"
      subtitle="Questions, feedback, copyright concerns, bug reports, and business inquiries are welcome."
    >
      <TrustSection title="Contact">
        <p>
          If you have any questions, feedback, copyright concerns, bug reports, or
          business inquiries, please contact us at:
        </p>
        <p className="trust-email">
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
        <p>
          We try to review legitimate inquiries as soon as possible. Please include
          the relevant page URL and a clear description when reporting a bug or
          content concern.
        </p>
      </TrustSection>

      <TrustSection title="한국어 문의">
        <p>
          문의, 피드백, 저작권 관련 요청, 오류 제보, 비즈니스 문의가 있으시면
          아래 이메일로 연락해주세요.
        </p>
        <p className="trust-email">
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
        <p>
          정상적인 문의는 가능한 빠르게 확인하겠습니다. 오류 또는 콘텐츠 관련
          문의를 보내실 때는 관련 페이지 주소와 내용을 함께 알려주시면 도움이 됩니다.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
