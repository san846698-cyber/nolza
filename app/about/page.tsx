"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export default function AboutPage() {
  const { t, locale } = useLocale();
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
            marginBottom: 32,
          }}
        >
          {t("놀자.fun에 대하여", "About nolza.fun")}
        </h1>

        {locale === "ko" ? <AboutKo /> : <AboutEn />}
      </div>
    </main>
  );
}

function AboutKo() {
  return (
    <article style={{ fontSize: 16 }}>
      <p>
        놀자.fun은 한국에서 만들어진 인터랙티브 미니게임 모음 사이트입니다. 50개가 넘는
        게임이 네 가지 카테고리로 나뉘어 있어요 — 손맛으로 도전하고(Challenge),
        자신을 진단하고(Know Yourself), 시나리오를 체험하고(Live It), 세상을
        탐험합니다(Explore).
      </p>

      <h2 style={h2}>이 사이트가 다루는 것</h2>
      <ul style={ul}>
        <li>반응속도, 침묵, 빨리빨리 같은 단순하지만 묘하게 중독되는 도전</li>
        <li>MBTI, 사주, 애착유형 등 자기 자신을 들여다보는 진단형 게임</li>
        <li>조선시대, 한니발의 전쟁, 한강 건너기 같은 시나리오 시뮬레이션</li>
        <li>지진의 규모, 우주의 스케일, 한국의 일상 데이터를 시각화한 탐험 콘텐츠</li>
      </ul>

      <h2 style={h2}>설계 원칙</h2>
      <ul style={ul}>
        <li>
          <strong>회원가입 없음.</strong> 모든 게임은 익명으로 즉시 시작합니다.
        </li>
        <li>
          <strong>모바일 우선.</strong> 출퇴근길에 한 손으로 즐길 수 있게.
        </li>
        <li>
          <strong>한국어 / English.</strong> 한국 문화권 콘텐츠를 영어 사용자도 함께
          즐기도록.
        </li>
        <li>
          <strong>가벼움.</strong> 클릭 한 번에 게임이 시작되고, 결과는 한 화면에.
        </li>
      </ul>

      <h2 style={h2}>운영</h2>
      <p>
        놀자.fun은 서울에서 한 명이 만들고 있습니다. 새 게임 아이디어, 버그 리포트,
        피드백은 모두 환영합니다.
      </p>

      <p style={{ marginTop: 24 }}>
        문의:{" "}
        <a href="mailto:studio4any@gmail.com" style={a}>
          studio4any@gmail.com
        </a>
      </p>
    </article>
  );
}

function AboutEn() {
  return (
    <article style={{ fontSize: 16 }}>
      <p>
        nolza.fun is a collection of interactive mini-games made in Korea. More than
        50 games are sorted into four chapters — challenge your reflexes, know
        yourself, live a scenario, and explore the world.
      </p>

      <h2 style={h2}>What you&apos;ll find here</h2>
      <ul style={ul}>
        <li>Reflex-and-timing challenges (reaction speed, silence, ppalli-ppalli)</li>
        <li>Self-discovery quizzes (MBTI, saju, attachment types)</li>
        <li>
          Scenario simulations (Joseon dynasty life, Hannibal&apos;s wars, crossing
          the Han River)
        </li>
        <li>
          Data exploration (the scale of earthquakes, the size of the universe,
          everyday Korea in numbers)
        </li>
      </ul>

      <h2 style={h2}>Design principles</h2>
      <ul style={ul}>
        <li>
          <strong>No sign-ups.</strong> Every game starts anonymously, immediately.
        </li>
        <li>
          <strong>Mobile first.</strong> Designed to be played one-handed on a
          commute.
        </li>
        <li>
          <strong>Korean / English.</strong> Korean-rooted content made approachable
          for English readers.
        </li>
        <li>
          <strong>Lightweight.</strong> One click to start, one screen to read the
          result.
        </li>
      </ul>

      <h2 style={h2}>Who runs this</h2>
      <p>
        nolza.fun is built by one person in Seoul. New game ideas, bug reports, and
        feedback are all welcome.
      </p>

      <p style={{ marginTop: 24 }}>
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
const ul: React.CSSProperties = { paddingLeft: 24, margin: "12px 0" };
const a: React.CSSProperties = {
  color: "var(--home-accent, #B2102B)",
  textDecoration: "underline",
};
