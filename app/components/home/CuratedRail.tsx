"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { gamesByIds, LABEL_TEXT, type Game, type HomeRail } from "@/lib/games-home";
import Thumb from "./Thumb";

function CuratedCard({ game, index }: { game: Game; index: number }) {
  const { t } = useLocale();
  const copy = t(game.ko.title, game.en.title);
  const sub = t(game.ko.sub, game.en.sub);
  const skin = game.skin ?? "paper";
  const labels = game.labels?.slice(0, 2) ?? [];

  return (
    <Link href={game.href} className="home-curated-card">
      <div className="home-curated-card__thumb" aria-hidden>
        <Thumb game={game} skin={skin} />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="home-curated-card__body">
        <div className="home-curated-card__labels">
          {labels.map((label) => (
            <em key={label}>{t(LABEL_TEXT[label].ko, LABEL_TEXT[label].en)}</em>
          ))}
          {game.duration && <em>{t(game.duration.ko, game.duration.en)}</em>}
        </div>
        <strong>{copy}</strong>
        <p>{sub}</p>
        <b>{t("바로 시작", "Start")}</b>
      </div>
    </Link>
  );
}

export default function CuratedRail({ rail }: { rail: HomeRail }) {
  const { t } = useLocale();
  const games = gamesByIds(rail.gameIds);

  if (games.length === 0) return null;

  return (
    <section className="home-curated" data-rail={rail.id}>
      <div className="home-curated__head">
        <div>
          <span className="home-curated__kicker">
            {rail.id === "today" ? "PICK" : rail.id === "quick" ? "FAST" : "SEND"}
          </span>
          <h2>{t(rail.titleKo, rail.titleEn)}</h2>
        </div>
        <p>{t(rail.subKo, rail.subEn)}</p>
      </div>
      <div className="home-curated__grid">
        {games.map((game, i) => (
          <CuratedCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </section>
  );
}
