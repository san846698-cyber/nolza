"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { GAMES } from "@/lib/games-home";

type RecommendedGamesProps = {
  currentId: string;
  ids?: string[];
  title?: { ko: string; en: string };
  limit?: number;
};

const DEFAULT_IDS = ["kbti", "circle", "react", "password", "ijy", "timesense", "average"];

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
    <section className="recommended-games" aria-label={t("추천 놀이", "Recommended games")}>
      <div className="recommended-games__head">
        <small>{t("NEXT PLAY", "NEXT PLAY")}</small>
        <span>{title ? title[locale] : t("다음 중독 후보", "Try these next")}</span>
      </div>
      <div className="recommended-games__grid">
        {games.map((game) => {
          if (!game) return null;
          const copy = game[locale];
          return (
            <Link key={game.id} href={game.href} className="recommended-games__item">
              <span className="recommended-games__kicker">{copy.kicker}</span>
              <strong>{copy.title}</strong>
              <span>{copy.sub}</span>
              <em>{t("친구도 시키기", "Play")}</em>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
