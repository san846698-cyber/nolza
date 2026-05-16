"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { trackRecommendationClick } from "@/lib/analytics";
import { GAMES } from "@/lib/games-home";
import type { ContentType, Lang } from "@/lib/games-home";

type RecommendedGamesProps = {
  currentId: string;
  ids?: string[];
  title?: { ko: string; en: string };
  limit?: number;
};

const DEFAULT_IDS = ["kbti", "circle", "react", "password", "ijy", "timesense", "average"];

function ctaFor(type: ContentType | undefined, locale: Lang) {
  if (type === "game") return locale === "ko" ? "플레이하기" : "Play";
  if (type === "test") return locale === "ko" ? "테스트하기" : "Take test";
  if (type === "compatibility" || type === "fortune") {
    return locale === "ko" ? "해보기" : "Try it";
  }
  return locale === "ko" ? "해보기" : "Try it";
}

export default function RecommendedGames({
  currentId,
  ids,
  title,
  limit = 3,
}: RecommendedGamesProps) {
  const { locale, t } = useLocale();
  const chosenIds = ids?.length ? ids : DEFAULT_IDS;
  const games = chosenIds
    .filter((id) => id !== currentId)
    .map((id) => GAMES.find((game) => game.id === id))
    .filter(Boolean)
    .slice(0, limit);

  if (games.length === 0) return null;

  return (
    <section className="recommended-games" aria-label={t("추천 테스트", "Recommended tests")}>
      <div className="recommended-games__head">
        <small>{t("추천", "RECOMMENDED")}</small>
        <span>{title ? title[locale] : t("이 테스트도 해보세요", "Try these next")}</span>
      </div>
      <div className="recommended-games__grid">
        {games.map((game) => {
          if (!game) return null;
          const copy = game[locale];
          return (
            <Link
              key={game.id}
              href={game.href}
              className="recommended-games__item"
              onClick={() => trackRecommendationClick(currentId, game.id, game.type)}
            >
              <span className="recommended-games__kicker">{copy.kicker}</span>
              <strong>{copy.title}</strong>
              <span>{copy.sub}</span>
              <em>{ctaFor(game.type, locale)}</em>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
