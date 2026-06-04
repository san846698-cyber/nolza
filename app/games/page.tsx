import type { Metadata } from "next";
import Link from "next/link";
import { GAMES, HOMEPAGE_HIDDEN_GAME_IDS, type Game } from "@/lib/games-home";

export const metadata: Metadata = {
  title: "게임 모아보기 | Nolza",
  description:
    "Nolza의 브라우저 미니게임, 이름 기반 결과, 문화형 인터랙티브 콘텐츠를 한곳에서 둘러보세요.",
  alternates: {
    canonical: "/games",
  },
};

const sections = [
  {
    id: "mini",
    title: "바로 플레이하는 미니게임",
    description: "반응속도, 정확도, 퍼즐처럼 짧게 시작하고 기록을 비교하기 좋은 브라우저 게임입니다.",
    filter: (game: Game) => game.type === "game" || game.category === "mini-games",
  },
  {
    id: "story",
    title: "세계관과 이름 기반 콘텐츠",
    description: "이름, 장면, 문화적 상상을 바탕으로 결과를 만들어보는 인터랙티브 경험입니다.",
    filter: (game: Game) =>
      game.href.startsWith("/games/") &&
      game.type !== "game" &&
      ["joseon", "joseon-couple", "korean-name", "kbti", "mbti-depth", "attachment"].includes(game.id),
  },
  {
    id: "share",
    title: "친구와 공유하기 좋은 결과",
    description: "결과 링크나 카드로 대화를 시작하기 쉬운 관계형·성향형 콘텐츠입니다.",
    filter: (game: Game) => game.href.startsWith("/games/") && Boolean(game.labels?.includes("share")),
  },
];

function visibleGames(filter: (game: Game) => boolean) {
  return GAMES.filter((game) => !HOMEPAGE_HIDDEN_GAME_IDS.has(game.id) && filter(game));
}

export default function GamesIndexPage() {
  return (
    <main className="guide-page">
      <section className="guide-page__inner">
        <nav className="guide-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Nolza</Link>
          <span>/</span>
          <span>게임</span>
        </nav>

        <header className="guide-hero">
          <p className="guide-hero__eyebrow">Nolza Games</p>
          <h1>브라우저 게임과 인터랙티브 콘텐츠</h1>
          <div className="guide-hero__intro">
            <p>
              설치 없이 바로 즐길 수 있는 미니게임부터, 이름 하나로 결과가 만들어지는 세계관 콘텐츠까지 모았습니다.
              짧게 플레이하고 친구와 결과를 비교하기 좋습니다.
            </p>
            <p>
              점수와 결과는 재미를 위한 표시이며 실제 능력, 성격, 관계를 평가하는 기준이 아닙니다.
            </p>
          </div>
        </header>

        <section className="guide-section guide-section--cards" aria-labelledby="games-about-title">
          <div className="guide-section__head">
            <p>How to play</p>
            <h2 id="games-about-title">Nolza 게임은 짧게 즐기고 가볍게 비교하는 콘텐츠입니다</h2>
            <span>
              설치 없이 브라우저에서 바로 시작하고, 점수나 결과를 친구와 공유하기 쉽게 만든 미니 게임과 인터랙티브 콘텐츠를 모았습니다.
            </span>
          </div>
          <article>
            <span>01</span>
            <h2>브라우저 기반</h2>
            <p>
              대부분의 게임은 짧은 라운드로 구성되어 있으며, 휴대폰이나 데스크톱 브라우저에서 바로 플레이할 수 있습니다.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>점수의 의미</h2>
            <p>
              점수와 기록은 재미를 위한 비교 기준입니다. 실제 능력, 성격, 관계, 건강 상태를 전문적으로 측정하지 않습니다.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>친구와 비교</h2>
            <p>
              결과를 공유할 때는 순위를 매기기보다 서로 다른 타이밍, 선택, 반응을 가볍게 이야기하는 방식으로 즐겨주세요.
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

        <section className="guide-cta" aria-label="게임 가이드">
          <div>
            <p>처음 방문했다면</p>
            <h2>가이드에서 테스트와 게임을 더 잘 즐기는 법을 확인하세요</h2>
          </div>
          <Link href="/guides">가이드 보기</Link>
        </section>
      </section>
    </main>
  );
}
