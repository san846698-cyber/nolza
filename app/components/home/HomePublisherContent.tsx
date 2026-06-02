"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { GUIDES } from "@/lib/guides";

const CATEGORY_GUIDES = [
  {
    href: "/tests",
    koTitle: "심리테스트 모아보기",
    enTitle: "Psychology tests",
    koBody:
      "방어기제, 인지왜곡, 깊은 공포, 마음이 차가워지는 순간처럼 일상 속 감정과 생각 패턴을 읽어봅니다.",
    enBody:
      "Browse tests about defense mechanisms, thinking patterns, deep fear, and emotional turning points.",
  },
  {
    href: "/tests#relationship",
    koTitle: "관계와 궁합 콘텐츠",
    enTitle: "Relationship tests",
    koBody:
      "친구, 연인, 가까운 사람과 함께 읽기 좋은 관계형 결과와 공유용 테스트를 모았습니다.",
    enBody:
      "Relationship and compatibility results made to read and compare with friends or partners.",
  },
  {
    href: "/games",
    koTitle: "브라우저 게임",
    enTitle: "Browser games",
    koBody:
      "설치 없이 바로 시작할 수 있는 미니게임, 이름 기반 결과, 세계관형 콘텐츠를 둘러보세요.",
    enBody:
      "Play short browser games and name-based story experiences without installation.",
  },
  {
    href: "/guides",
    koTitle: "가이드와 해설",
    enTitle: "Guides",
    koBody:
      "테스트 결과를 과하게 믿지 않으면서도 더 재미있고 안전하게 해석하는 방법을 안내합니다.",
    enBody:
      "Read guides that explain how to enjoy results safely without treating them as diagnosis.",
  },
];

const STEPS = [
  {
    koTitle: "1. 지금 끌리는 주제 고르기",
    enTitle: "1. Pick a topic",
    koBody: "심리, 관계, 공포, 성향, 조선 세계관, 미니게임 중 지금의 기분에 맞는 콘텐츠를 선택합니다.",
    enBody: "Choose a test or game by mood: psychology, relationships, fear, personality, Joseon stories, or mini games.",
  },
  {
    koTitle: "2. 결과를 참고용으로 읽기",
    enTitle: "2. Read results lightly",
    koBody: "결과는 진단이 아니라 재미와 자기성찰을 위한 설명입니다. 맞는 문장만 편하게 가져가세요.",
    enBody: "Results are for entertainment and reflection, not diagnosis. Keep only what feels useful.",
  },
  {
    koTitle: "3. 친구와 대화로 이어가기",
    enTitle: "3. Compare with friends",
    koBody: "결과를 공유할 때는 상대를 단정하지 말고 서로 다른 반응과 기준을 이야기해보세요.",
    enBody: "When sharing, avoid labeling others and use results to talk about different reactions.",
  },
];

export default function HomePublisherContent() {
  const { t } = useLocale();

  return (
    <section className="home-publisher" aria-labelledby="home-publisher-title">
      <div className="home-publisher__inner">
        <div className="home-publisher__intro">
          <p className="home-publisher__eyebrow">{t("Nolza 안내", "About Nolza")}</p>
          <h2 id="home-publisher-title">
            {t("테스트, 게임, 가이드를 함께 읽는 인터랙티브 놀이터", "An interactive site for tests, games, and guides")}
          </h2>
          <p>
            {t(
              "Nolza는 심리테스트, 관계 테스트, 이름 기반 결과, 짧은 브라우저 게임을 제공하는 한국어 중심 콘텐츠 사이트입니다. 각 콘텐츠는 결과만 보여주는 데서 끝나지 않고, 이용 방법과 결과 해석, 관련 가이드로 이어지도록 구성되어 있습니다.",
              "Nolza is a Korean-first content site for psychology-style tests, relationship tests, name-based results, and short browser games. Each experience connects results with explanations, related guides, and internal links.",
            )}
          </p>
        </div>

        <div className="home-publisher__panels">
          <article className="home-publisher__panel">
            <h3>{t("결과는 어떻게 봐야 하나요?", "How should I read results?")}</h3>
            <p>
              {t(
                "Nolza의 테스트 결과는 재미와 자기성찰을 위한 엔터테인먼트입니다. 의학적, 심리학적, 법률적, 재정적 또는 전문적인 진단과 조언을 대신하지 않습니다.",
                "Nolza results are entertainment for fun and self-reflection. They do not replace medical, psychological, legal, financial, or professional advice.",
              )}
            </p>
          </article>
          <article className="home-publisher__panel">
            <h3>{t("왜 가이드가 있나요?", "Why are there guides?")}</h3>
            <p>
              {t(
                "방어기제, 애착유형, 인지왜곡 같은 주제는 결과만 보면 너무 단순해질 수 있습니다. 가이드는 테스트를 낙인으로 쓰지 않고 대화와 이해의 힌트로 읽도록 돕습니다.",
                "Topics like defense mechanisms, attachment, and cognitive distortions can feel too thin without context. Guides help users read results as conversation starters, not labels.",
              )}
            </p>
          </article>
        </div>

        <div className="home-publisher__section-title">
          <p>{t("둘러보기", "Explore")}</p>
          <h3>{t("콘텐츠 색인", "Content indexes")}</h3>
        </div>
        <div className="home-publisher__categories">
          {CATEGORY_GUIDES.map((category) => (
            <Link key={category.href} href={category.href} className="home-publisher__category">
              <strong>{t(category.koTitle, category.enTitle)}</strong>
              <span>{t(category.koBody, category.enBody)}</span>
            </Link>
          ))}
        </div>

        <div className="home-publisher__steps" aria-label={t("이용 방법", "How to use")}>
          {STEPS.map((step) => (
            <article key={step.enTitle} className="home-publisher__step">
              <h3>{t(step.koTitle, step.enTitle)}</h3>
              <p>{t(step.koBody, step.enBody)}</p>
            </article>
          ))}
        </div>

        <section className="home-publisher__guides" aria-labelledby="home-guides-title">
          <div className="home-publisher__section-title">
            <p>{t("읽을거리", "Guides")}</p>
            <h3 id="home-guides-title">
              {t("테스트 결과를 더 잘 이해하는 가이드", "Guides for reading test results")}
            </h3>
          </div>
          <div className="home-publisher__guide-list">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={guide.href} className="home-publisher__guide-link">
                <strong>{guide.homeTitle}</strong>
                <span>{guide.homeDescription}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-publisher__safe">
          <h3>{t("가볍고 안전하게 즐기기", "Light, safe entertainment")}</h3>
          <p>
            {t(
              "이름이나 선택값을 사용하는 페이지는 결과를 만들기 위한 최소한의 정보만 요청합니다. 중요한 결정은 테스트 결과가 아니라 실제 상황, 신뢰할 수 있는 정보, 필요한 경우 전문가의 도움을 바탕으로 판단하세요.",
              "Pages that request names or choices use them to generate the result. Important decisions should be based on real context, reliable information, and professional help where needed.",
            )}
          </p>
        </section>
      </div>
    </section>
  );
}
