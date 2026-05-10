"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export default function TermsPage() {
  const { t, locale } = useLocale();
  const lastUpdated = "2026-05-10";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--home-bg, #F4EFE4)",
        color: "var(--home-ink, #14110E)",
        padding: "60px clamp(20px, 5vw, 56px) 100px",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        lineHeight: 1.75,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link
          href="/"
          style={{ fontSize: 13, color: "var(--home-muted)", textDecoration: "none" }}
        >
          ← {t("놀자.fun으로 돌아가기", "Back to nolza.fun")}
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 600,
            marginTop: 32,
            marginBottom: 8,
          }}
        >
          {t("이용약관", "Terms of Service")}
        </h1>
        <p style={{ fontSize: 13, color: "var(--home-muted)", marginBottom: 40 }}>
          {t("최종 수정일", "Last updated")}: {lastUpdated}
        </p>

        {locale === "ko" ? <TermsKo /> : <TermsEn />}
      </div>
    </main>
  );
}

function TermsKo() {
  return (
    <article style={{ fontSize: 15 }}>
      <p>
        놀자.fun을 이용하면 아래 약관에 동의하는 것으로 간주됩니다. 이용에 동의하지
        않으시면 사이트를 이용하지 마세요.
      </p>

      <h2 style={h2}>1. 콘텐츠</h2>
      <p>
        본 사이트의 게임, 텍스트, 이미지 등 모든 콘텐츠는 저작권의 보호를 받습니다.
        개인적·비상업적 용도로 자유롭게 이용할 수 있으며, 무단 복제·재배포는 금지됩니다.
        일부 이미지는 Wikimedia Commons 등 외부 소스에서 가져왔으며, 각 게임 화면에
        출처가 표기되어 있습니다.
      </p>

      <h2 style={h2}>2. 게임 결과의 성격</h2>
      <p>
        본 사이트의 진단·궁합·점수 결과는 모두 오락 목적으로만 제공됩니다. 의학적, 법적,
        심리학적, 재정적 조언이 아니며, 실제 의사결정의 근거로 사용되어서는 안
        됩니다.
      </p>

      <h2 style={h2}>3. 면책</h2>
      <p>
        사이트는 &quot;있는 그대로&quot; 제공되며, 운영자는 사이트 이용으로 인해 발생하는
        어떠한 직간접 손해에 대해서도 책임지지 않습니다.
      </p>

      <h2 style={h2}>4. 외부 링크</h2>
      <p>
        본 사이트는 외부 사이트로의 링크를 포함할 수 있으며, 외부 사이트의 콘텐츠나
        개인정보 처리방침에 대해서는 책임지지 않습니다.
      </p>

      <h2 style={h2}>5. 약관 변경</h2>
      <p>
        본 약관은 사전 공지 없이 변경될 수 있으며, 변경 시 본 페이지 상단의 &quot;최종
        수정일&quot;이 갱신됩니다.
      </p>

      <h2 style={h2}>6. 문의</h2>
      <p>
        문의:{" "}
        <a href="mailto:studio4any@gmail.com" style={a}>
          studio4any@gmail.com
        </a>
      </p>
    </article>
  );
}

function TermsEn() {
  return (
    <article style={{ fontSize: 15 }}>
      <p>
        By using nolza.fun, you agree to the terms below. If you do not agree, please
        do not use the site.
      </p>

      <h2 style={h2}>1. Content</h2>
      <p>
        All games, text, and images on this site are protected by copyright. You may
        use them freely for personal, non-commercial purposes; redistribution without
        permission is prohibited. Some images come from external sources such as
        Wikimedia Commons; credits are shown on each game screen.
      </p>

      <h2 style={h2}>2. Nature of Results</h2>
      <p>
        Diagnostic, compatibility, and scoring results on this site are provided for
        entertainment only. They are not medical, legal, psychological, or financial
        advice and should not be used as a basis for actual decisions.
      </p>

      <h2 style={h2}>3. Disclaimer</h2>
      <p>
        The site is provided &quot;as is.&quot; The operator is not liable for any
        direct or indirect damages arising from the use of the site.
      </p>

      <h2 style={h2}>4. External Links</h2>
      <p>
        This site may contain links to external sites. We are not responsible for
        the content or privacy practices of external sites.
      </p>

      <h2 style={h2}>5. Changes</h2>
      <p>
        These terms may change without prior notice; the &quot;Last updated&quot;
        date at the top of this page reflects the most recent revision.
      </p>

      <h2 style={h2}>6. Contact</h2>
      <p>
        Contact:{" "}
        <a href="mailto:studio4any@gmail.com" style={a}>
          studio4any@gmail.com
        </a>
      </p>
    </article>
  );
}

const h2: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), serif",
  fontSize: 22,
  fontWeight: 600,
  marginTop: 36,
  marginBottom: 12,
};
const a: React.CSSProperties = {
  color: "var(--home-accent, #B2102B)",
  textDecoration: "underline",
};
