"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export default function PrivacyPage() {
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
          {t("개인정보처리방침", "Privacy Policy")}
        </h1>
        <p style={{ fontSize: 13, color: "var(--home-muted)", marginBottom: 40 }}>
          {t("최종 수정일", "Last updated")}: {lastUpdated}
        </p>

        {locale === "ko" ? <PrivacyKo /> : <PrivacyEn />}
      </div>
    </main>
  );
}

function PrivacyKo() {
  return (
    <article style={{ fontSize: 15 }}>
      <p>
        놀자.fun(이하 &quot;사이트&quot;)은 사용자의 개인정보 보호를 중요하게 생각합니다.
        본 방침은 사이트가 어떤 정보를 수집하고, 어떻게 사용하며, 어떻게 보호하는지를
        설명합니다.
      </p>

      <h2 style={h2}>1. 수집하는 정보</h2>
      <p>
        놀자.fun의 게임 대부분은 회원가입 없이 익명으로 동작하며, 사용자가 입력한
        값(예: 생년월일, 닉네임, 점수)은 서버로 전송되지 않고 브라우저 안에서만
        처리됩니다. 일부 게임은 사용자 편의를 위해 브라우저
        <code style={code}>localStorage</code>에 진행 상태나 언어 설정을 저장할 수 있습니다.
      </p>

      <h2 style={h2}>2. 자동으로 수집되는 정보</h2>
      <p>
        사이트 운영을 위해 표준 웹 로그(IP 주소, 브라우저 종류, 접속 시각, 참조 페이지
        등)가 호스팅 제공자(Vercel)에 의해 일시적으로 기록될 수 있습니다.
      </p>

      <h2 style={h2}>3. 광고 (Google AdSense)</h2>
      <p>
        본 사이트는 Google AdSense를 통해 제3자 광고를 게재합니다. Google을 비롯한 제3자
        공급업체는 쿠키를 사용하여 사용자가 본 사이트와 다른 사이트를 방문한 기록을
        바탕으로 광고를 게재합니다.
      </p>
      <ul style={ul}>
        <li>
          Google의 광고 쿠키 사용으로 인해 Google과 그 파트너는 사용자의 사이트나 다른
          인터넷 사이트 방문 정보를 기반으로 광고를 게재할 수 있습니다.
        </li>
        <li>
          사용자는{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            style={a}
          >
            Google 광고 설정
          </a>
          에서 맞춤 광고를 비활성화할 수 있습니다.
        </li>
        <li>
          제3자 공급업체의 쿠키 사용은{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            style={a}
          >
            Google 광고 및 콘텐츠 네트워크 개인정보 처리방침
          </a>
          에서 더 자세히 확인할 수 있습니다.
        </li>
      </ul>

      <h2 style={h2}>4. 분석 도구</h2>
      <p>
        사이트 사용 패턴을 이해하기 위해 익명화된 분석 도구(예: Vercel Analytics)를 사용할
        수 있습니다. 이 도구들은 개인을 식별할 수 있는 정보를 수집하지 않습니다.
      </p>

      <h2 style={h2}>5. 쿠키 관리</h2>
      <p>
        대부분의 브라우저는 설정에서 쿠키를 삭제하거나 거부할 수 있습니다. 다만 쿠키를
        차단할 경우 사이트 일부 기능(예: 언어 설정 유지)이 정상 작동하지 않을 수
        있습니다.
      </p>

      <h2 style={h2}>6. 어린이 개인정보</h2>
      <p>
        본 사이트는 만 13세 미만 어린이로부터 의도적으로 개인정보를 수집하지 않습니다.
      </p>

      <h2 style={h2}>7. 변경사항</h2>
      <p>
        본 방침은 사전 공지 없이 변경될 수 있으며, 변경 시 본 페이지 상단의 &quot;최종
        수정일&quot;이 갱신됩니다.
      </p>

      <h2 style={h2}>8. 문의</h2>
      <p>
        개인정보 처리에 관한 문의는{" "}
        <a href="mailto:hello@nolza.fun" style={a}>
          hello@nolza.fun
        </a>
        으로 보내주세요.
      </p>
    </article>
  );
}

function PrivacyEn() {
  return (
    <article style={{ fontSize: 15 }}>
      <p>
        nolza.fun (the &quot;Site&quot;) takes your privacy seriously. This policy explains
        what data the Site collects, how it is used, and how it is protected.
      </p>

      <h2 style={h2}>1. Information We Collect</h2>
      <p>
        Most games on nolza.fun run anonymously without any account. The values you
        enter (e.g. birth year, nickname, scores) are processed inside your browser
        and are not transmitted to a server. Some games may use the browser&apos;s{" "}
        <code style={code}>localStorage</code> to remember your progress or language
        preference for convenience.
      </p>

      <h2 style={h2}>2. Automatically Collected Information</h2>
      <p>
        Standard web access logs (IP address, browser type, request time, referring
        page) may be temporarily recorded by our hosting provider (Vercel) for the
        purpose of operating the site.
      </p>

      <h2 style={h2}>3. Advertising (Google AdSense)</h2>
      <p>
        This site uses Google AdSense to serve third-party advertisements. Google and
        third-party vendors use cookies to serve ads based on your prior visits to
        this site and other sites on the internet.
      </p>
      <ul style={ul}>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to
          serve ads to users based on their visit to this site and other sites on
          the internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            style={a}
          >
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          More information about how Google uses cookies in advertising can be found
          in the{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            style={a}
          >
            Google Advertising Policies
          </a>
          .
        </li>
      </ul>

      <h2 style={h2}>4. Analytics</h2>
      <p>
        We may use anonymized analytics tools (such as Vercel Analytics) to understand
        how the Site is used. These tools do not collect personally identifiable
        information.
      </p>

      <h2 style={h2}>5. Managing Cookies</h2>
      <p>
        Most browsers let you delete or refuse cookies in their settings. Note that
        blocking cookies may break some site features (e.g. remembering your
        language preference).
      </p>

      <h2 style={h2}>6. Children&apos;s Privacy</h2>
      <p>
        This site does not knowingly collect personal information from children
        under the age of 13.
      </p>

      <h2 style={h2}>7. Changes</h2>
      <p>
        This policy may change without prior notice; the &quot;Last updated&quot;
        date at the top of this page reflects the most recent revision.
      </p>

      <h2 style={h2}>8. Contact</h2>
      <p>
        For privacy-related inquiries, contact{" "}
        <a href="mailto:hello@nolza.fun" style={a}>
          hello@nolza.fun
        </a>
        .
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
const ul: React.CSSProperties = { paddingLeft: 24, margin: "12px 0" };
const a: React.CSSProperties = {
  color: "var(--home-accent, #B2102B)",
  textDecoration: "underline",
};
const code: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains), monospace",
  fontSize: 13,
  background: "rgba(0,0,0,0.06)",
  padding: "1px 6px",
  borderRadius: 4,
};
