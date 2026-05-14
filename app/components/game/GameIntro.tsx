"use client";

import type { ReactNode } from "react";

type GameIntroProps = {
  eyebrow?: string;
  title: string;
  hook: string;
  howTo: string;
  meta?: string[];
  startLabel?: string;
  onStart?: () => void;
  tone?: "light" | "dark" | "paper";
  children?: ReactNode;
};

export default function GameIntro({
  eyebrow,
  title,
  hook,
  howTo,
  meta = [],
  startLabel,
  onStart,
  tone = "light",
  children,
}: GameIntroProps) {
  return (
    <section className={`game-intro game-intro--${tone}`} aria-label={title}>
      {eyebrow && <div className="game-intro__eyebrow">{eyebrow}</div>}
      <h1 className="game-intro__title">{title}</h1>
      <p className="game-intro__hook">{hook}</p>
      <p className="game-intro__how">{howTo}</p>
      {meta.length > 0 && (
        <div className="game-intro__meta" aria-label="game details">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
      {children}
      {onStart && (
        <button type="button" className="game-intro__start btn-press" onClick={onStart}>
          {startLabel ?? "시작하기"}
        </button>
      )}
    </section>
  );
}
