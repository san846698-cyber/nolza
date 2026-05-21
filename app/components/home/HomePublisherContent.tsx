"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { GUIDES } from "@/lib/guides";

const CATEGORY_GUIDES = [
  {
    href: "#tests",
    koTitle: "심리 테스트",
    enTitle: "Psychology tests",
    koBody:
      "짧은 상황 질문을 통해 생각 습관, 감정 반응, 관계에서 자주 보이는 패턴을 가볍게 읽어봅니다.",
    enBody:
      "Short scenario questions turn thinking habits, emotional reactions, and everyday patterns into readable results.",
  },
  {
    href: "#compatibility",
    koTitle: "커플/관계 테스트",
    enTitle: "Couple and relationship tests",
    koBody:
      "두 사람의 이름, 선택, 분위기를 바탕으로 친구나 연인과 함께 읽기 좋은 케미 결과를 만듭니다.",
    enBody:
      "Name-based and choice-based tests create chemistry results that are fun to read with friends or partners.",
  },
  {
    href: "#featured",
    koTitle: "운세/랜덤 결과",
    enTitle: "Fortune and random reads",
    koBody:
      "사주, 이름, 랜덤 키워드처럼 가볍게 즐기는 운세형 콘텐츠를 카드와 이야기 형식으로 정리합니다.",
    enBody:
      "Fortune-style pages use names, dates, or random keywords to create light card-like readings and short stories.",
  },
  {
    href: "#mini-games",
    koTitle: "미니게임",
    enTitle: "Mini games",
    koBody:
      "반응속도, 퍼즐, 감각 테스트처럼 브라우저에서 바로 플레이하고 기록을 비교할 수 있는 짧은 게임입니다.",
    enBody:
      "Short browser games cover reaction, puzzles, and timing challenges that are easy to play and compare.",
  },
];

const STEPS = [
  {
    koTitle: "1. 짧게 고르기",
    enTitle: "1. Pick a short test",
    koBody: "심리 테스트, 관계 테스트, 운세형 콘텐츠, 미니게임 중 지금 기분에 맞는 페이지를 선택합니다.",
    enBody: "Choose a personality test, relationship result, fortune-style page, or mini game that fits your mood.",
  },
  {
    koTitle: "2. 결과 읽기",
    enTitle: "2. Read the result",
    koBody: "결과는 정답이나 진단이 아니라, 선택과 입력을 읽기 쉬운 키워드와 이야기로 풀어낸 엔터테인먼트입니다.",
    enBody: "Results are entertainment, not a diagnosis. They turn choices and inputs into readable keywords and short stories.",
  },
  {
    koTitle: "3. 친구와 비교하기",
    enTitle: "3. Compare with friends",
    koBody: "공유 링크나 결과 카드를 보내고 서로의 반응, 점수, 문장을 비교해보면 대화가 더 쉽게 시작됩니다.",
    enBody: "Send a result link or card, then compare reactions, scores, and result lines with friends.",
  },
];

export default function HomePublisherContent() {
  const { t } = useLocale();

  return (
    <section className="home-publisher" aria-labelledby="home-publisher-title">
      <div className="home-publisher__inner">
        <div className="home-publisher__intro">
          <p className="home-publisher__eyebrow">About nolza.fun</p>
          <h2 id="home-publisher-title">
            {t("nolza.fun은 어떤 사이트인가요?", "What is nolza.fun?")}
          </h2>
          <p>
            {t(
              "nolza.fun은 친구에게 보내기 좋은 바이럴 테스트와 짧은 브라우저 게임을 모아둔 플레이그라운드입니다. 심리, 관계, 운세형 읽을거리, 미니게임을 빠르게 즐기되 결과 화면에는 해석과 공유 맥락을 함께 담아 단순 링크 모음처럼 보이지 않도록 구성했습니다.",
              "nolza.fun is a playground for viral tests and short browser games that are easy to send to friends. It covers psychology, relationships, fortune-style reading, and mini games with result context designed for sharing.",
            )}
          </p>
        </div>

        <div className="home-publisher__panels">
          <article className="home-publisher__panel">
            <h3>{t("왜 공유하기 좋은가요?", "Why is it good for sharing?")}</h3>
            <p>
              {t(
                "각 테스트는 결과 제목, 한 줄 설명, 추천 콘텐츠, 공유 버튼을 중심으로 설계되어 혼자 보고 끝나는 페이지가 아니라 대화의 소재가 되도록 만들어졌습니다.",
                "Each test is built around a result title, short explanation, related picks, and sharing actions so the page can become a conversation starter.",
              )}
            </p>
          </article>
          <article className="home-publisher__panel">
            <h3>{t("결과는 어떻게 봐야 하나요?", "How should I read results?")}</h3>
            <p>
              {t(
                "결과는 재미와 자기 성찰을 위한 콘텐츠입니다. 전문 상담, 의료, 재정, 관계 판단을 대신하지 않으며 친구와 가볍게 비교하며 즐기는 용도입니다.",
                "Results are for fun and reflection. They do not replace professional advice, medical guidance, financial decisions, or relationship judgment.",
              )}
            </p>
          </article>
        </div>

        <div className="home-publisher__section-title">
          <p>{t("카테고리 안내", "Category guide")}</p>
          <h3>{t("기분에 맞춰 고르는 테스트와 게임", "Choose by mood, topic, or play style")}</h3>
        </div>
        <div className="home-publisher__categories">
          {CATEGORY_GUIDES.map((category) => (
            <Link key={category.href} href={category.href} className="home-publisher__category">
              <strong>{t(category.koTitle, category.enTitle)}</strong>
              <span>{t(category.koBody, category.enBody)}</span>
            </Link>
          ))}
        </div>

        <div className="home-publisher__steps" aria-label={t("사용 방법", "How to use")}>
          {STEPS.map((step) => (
            <article key={step.enTitle} className="home-publisher__step">
              <h3>{t(step.koTitle, step.enTitle)}</h3>
              <p>{t(step.koBody, step.enBody)}</p>
            </article>
          ))}
        </div>

        <section className="home-publisher__guides" aria-labelledby="home-guides-title">
          <div className="home-publisher__section-title">
            <p>{t("테스트 더 알아보기", "Learn more")}</p>
            <h3 id="home-guides-title">
              {t("짧게 읽고 바로 시작하는 게임 가이드", "Short guides before you play")}
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
          <h3>{t("가볍고 안전하게 즐기는 엔터테인먼트", "Light, safe entertainment")}</h3>
          <p>
            {t(
              "nolza.fun의 테스트와 게임은 회원가입 없이 즐길 수 있는 엔터테인먼트 콘텐츠입니다. 이름이나 간단한 선택값을 사용하는 페이지도 결과를 만들기 위한 최소 정보만 다루며, 결과는 전문 조언이나 실제 판단을 대신하지 않습니다.",
              "nolza.fun is entertainment you can use without creating an account. Pages that ask for a name or simple choices use them only to create the result, and results do not replace professional advice or real-life decisions.",
            )}
          </p>
        </section>
      </div>
    </section>
  );
}
