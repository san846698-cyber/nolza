import type { Metadata } from "next";
import Link from "next/link";
import { GAMES, HOMEPAGE_HIDDEN_GAME_IDS, type Game } from "@/lib/games-home";

export const metadata: Metadata = {
  title: "테스트 모아보기 | Nolza",
  description:
    "Nolza의 심리테스트, 관계 테스트, 성향 테스트, 공포 테스트를 한곳에서 둘러보세요. 결과는 재미와 자기성찰을 위한 엔터테인먼트입니다.",
  alternates: {
    canonical: "/tests",
  },
};

const sections = [
  {
    id: "psychology",
    title: "심리와 감정 테스트",
    description: "일상 속 선택으로 나의 감정 반응, 생각 패턴, 관계 습관을 가볍게 살펴봅니다.",
    filter: (game: Game) => game.href.startsWith("/tests/") && game.type === "test",
  },
  {
    id: "relationship",
    title: "관계와 궁합 테스트",
    description: "친구, 연인, 가까운 사람과 함께 읽기 좋은 관계형 결과 콘텐츠입니다.",
    filter: (game: Game) => game.type === "compatibility",
  },
  {
    id: "culture",
    title: "성향과 세계관 테스트",
    description: "한국식 성격 유형, 조선 세계관, 이름 기반 결과처럼 공유하기 쉬운 테스트를 모았습니다.",
    filter: (game: Game) =>
      game.href.startsWith("/games/") &&
      game.type === "test" &&
      ["kbti", "mbti-depth", "attachment", "joseon", "korean-name"].includes(game.id),
  },
];

function visibleGames(filter: (game: Game) => boolean) {
  return GAMES.filter((game) => !HOMEPAGE_HIDDEN_GAME_IDS.has(game.id) && filter(game));
}

export default function TestsIndexPage() {
  return (
    <main className="guide-page">
      <section className="guide-page__inner">
        <nav className="guide-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Nolza</Link>
          <span>/</span>
          <span>테스트</span>
        </nav>

        <header className="guide-hero">
          <p className="guide-hero__eyebrow">Nolza Tests</p>
          <h1>심리테스트와 관계 테스트 모아보기</h1>
          <div className="guide-hero__intro">
            <p>
              Nolza의 테스트는 짧은 문항과 결과 카드를 통해 감정, 관계, 성향, 상상 속 세계관을 가볍게 읽어보는
              엔터테인먼트 콘텐츠입니다.
            </p>
            <p>
              결과는 자기성찰과 대화를 위한 참고용이며, 의학적·심리학적 진단이나 전문적인 조언을 대신하지 않습니다.
            </p>
          </div>
        </header>

        <section className="guide-section guide-section--cards" aria-labelledby="tests-about-title">
          <div className="guide-section__head">
            <p>How to read</p>
            <h2 id="tests-about-title">Nolza 테스트는 이렇게 읽어주세요</h2>
            <span>
              Nolza의 테스트는 짧은 선택을 통해 감정, 관계, 생각 습관, 문화적 취향을 가볍게 돌아보는 엔터테인먼트 콘텐츠입니다.
            </span>
          </div>
          <article>
            <span>01</span>
            <h2>무엇을 보는가</h2>
            <p>
              각 테스트는 정답을 맞히는 시험이 아니라, 특정 상황에서 먼저 떠오르는 반응과 판단 기준을 읽어보는 경험입니다.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>결과를 읽는 법</h2>
            <p>
              결과는 자기성찰과 대화를 위한 참고용 설명입니다. 의학적, 심리학적, 법률적, 재정적 조언이나 전문 진단을 대신하지 않습니다.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>공유와 비교</h2>
            <p>
              친구와 결과를 비교할 때는 누가 맞고 틀린지보다 서로 어떤 장면에서 다르게 반응하는지 이야기해보는 것이 좋습니다.
            </p>
          </article>
        </section>

        {sections.map((section) => {
          const games = visibleGames(section.filter);
          if (games.length === 0) return null;

          return (
            <section className="guide-section" id={section.id} key={section.id}>
              <div className="guide-section__head">
                <p>Category</p>
                <h2>{section.title}</h2>
                <span>{section.description}</span>
              </div>
              <div className="guide-related">
                {games.map((game) => (
                  <Link key={game.id} href={game.href}>
                    <strong>{game.ko.title}</strong>
                    <span>{game.ko.sub}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="guide-cta" aria-label="테스트 가이드">
          <div>
            <p>결과를 더 잘 읽고 싶다면</p>
            <h2>심리테스트 가이드도 함께 확인해보세요</h2>
          </div>
          <Link href="/guides">가이드 보기</Link>
        </section>
      </section>
    </main>
  );
}
