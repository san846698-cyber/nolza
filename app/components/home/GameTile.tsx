"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import Thumb from "./Thumb";
import type { Game, Skin } from "@/lib/games-home";

type SkinRecipe = {
  border: string;
  radius: string;
  body: string;
  titleFont: string;
  titleColor: string;
  subColor: string;
  shadow: string;
};

const SKIN_STYLES: Record<Skin, SkinRecipe> = {
  paper: {
    border: "border border-home-hairline bg-home-paper text-home-ink",
    radius: "rounded-none",
    body: "border-t border-home-hairline bg-black/[0.02]",
    titleFont: "font-serif font-bold",
    titleColor: "text-home-ink",
    subColor: "text-home-ink-2",
    shadow:
      "shadow-[0_1px_0_rgba(20,17,14,0.04)] hover:shadow-[0_14px_32px_-16px_rgba(20,17,14,0.32)]",
  },
  block: {
    border: "border-2 border-home-ink text-home-ink",
    radius: "rounded-none",
    body: "border-t-2 border-home-ink bg-home-ink text-home-bg",
    titleFont: "font-serif font-black uppercase",
    titleColor: "text-home-bg",
    subColor: "text-home-bg/70",
    shadow:
      "shadow-[4px_4px_0_0_var(--home-ink)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--home-ink)]",
  },
  hand: {
    border: "border border-dashed border-home-ink-2 text-home-ink",
    radius: "rounded-[18px]",
    body: "border-t border-dashed border-home-ink-2/40 bg-transparent",
    titleFont: "font-hand font-bold",
    titleColor: "text-home-ink",
    subColor: "text-home-ink-2",
    shadow: "shadow-none hover:-rotate-1",
  },
  pixel: {
    border: "border-2 border-skin-pixel-accent bg-skin-pixel-bg text-skin-pixel-fg",
    radius: "rounded-none",
    body: "border-t-2 border-skin-pixel-accent bg-skin-pixel-bg",
    titleFont: "font-pixel",
    titleColor: "text-skin-pixel-fg",
    subColor: "text-skin-pixel-accent",
    shadow:
      "shadow-[0_0_0_3px_var(--skin-pixel-bg),0_0_0_4px_var(--skin-pixel-accent)] hover:shadow-[0_0_0_3px_var(--skin-pixel-bg),0_0_0_6px_var(--skin-pixel-accent)]",
  },
  mono: {
    border: "border border-dotted border-home-ink-2 bg-skin-mono text-home-ink",
    radius: "rounded-none",
    body: "border-t border-dotted border-home-ink-2/50 bg-transparent",
    titleFont: "font-mono font-bold uppercase",
    titleColor: "text-home-ink",
    subColor: "text-home-muted",
    shadow: "shadow-none",
  },
  sticker: {
    border: "border-0 bg-skin-sticker text-home-ink",
    radius: "rounded-2xl",
    body: "border-t border-home-hairline",
    titleFont: "font-serif font-bold",
    titleColor: "text-home-ink",
    subColor: "text-home-ink-2",
    shadow:
      "shadow-[0_2px_0_rgba(20,17,14,0.06),0_8px_24px_-8px_rgba(20,17,14,0.18)] hover:-translate-y-[2px] hover:shadow-[0_2px_0_rgba(20,17,14,0.06),0_18px_40px_-12px_rgba(20,17,14,0.28)]",
  },
};

const TONE_BG: Record<string, string> = {
  "block-1": "bg-skin-block-1",
  "block-2": "bg-skin-block-2",
  "block-3": "bg-skin-block-3",
  "block-4": "bg-skin-block-4",
  "block-5": "bg-skin-block-5",
  "hand-1": "bg-skin-hand-1",
  "hand-2": "bg-skin-hand-2",
  "hand-3": "bg-skin-hand-3",
};

export default function GameTile({ game, no }: { game: Game; no: number }) {
  const { t } = useLocale();
  const skinKey: Skin = game.skin ?? "paper";
  const s = SKIN_STYLES[skinKey];

  let toneBg = "";
  if (skinKey === "block") toneBg = TONE_BG[`block-${game.tone ?? 1}`];
  if (skinKey === "hand") toneBg = TONE_BG[`hand-${game.tone ?? 1}`];

  const noColor =
    skinKey === "pixel"
      ? "text-skin-pixel-accent"
      : skinKey === "block"
        ? "text-home-ink"
        : "text-home-muted";

  return (
    <Link
      href={game.href}
      className={[
        "group relative flex flex-col overflow-hidden no-underline",
        toneBg,
        s.border,
        s.radius,
        s.shadow,
        "transition-[transform,box-shadow] duration-300",
      ].join(" ")}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-[12%] transition-transform duration-500 group-hover:scale-[1.04]">
          <Thumb game={game} skin={skinKey} />
        </div>
        <span
          className={[
            "absolute top-2 left-3 font-mono text-[10px] tracking-wider font-medium",
            noColor,
          ].join(" ")}
        >
          {String(no).padStart(2, "0")}
        </span>
      </div>

      <div className={["px-3.5 py-3", s.body].join(" ")}>
        <h3
          className={[
            "m-0 text-[15px] sm:text-[16px] leading-tight tracking-tight",
            s.titleFont,
            s.titleColor,
          ].join(" ")}
        >
          {t(game.ko.title, game.en.title)}
        </h3>
        <p
          className={[
            "mt-1 text-[12px] leading-snug",
            "[word-break:keep-all] [overflow-wrap:anywhere]",
            s.subColor,
          ].join(" ")}
        >
          {t(game.ko.sub, game.en.sub)}
        </p>
      </div>
    </Link>
  );
}
