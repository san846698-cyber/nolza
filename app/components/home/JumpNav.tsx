"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import type { HomeCategory } from "@/lib/games-home";

export default function JumpNav({ categories }: { categories: HomeCategory[] }) {
  const { t } = useLocale();
  const [active, setActive] = useState<string>(categories[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [categories]);

  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur bg-home-bg/90 border-b border-home-hairline"
      aria-label="Jump to category"
    >
      <div className="mx-auto max-w-col px-4 sm:px-6 lg:px-7 py-2 flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {categories.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={isActive ? "true" : undefined}
              className={[
                "inline-flex items-baseline gap-1.5 px-3 py-1.5 shrink-0 min-h-9",
                "border rounded-full text-[13.5px] font-bold tracking-tight",
                "whitespace-nowrap transition-colors no-underline",
                isActive
                  ? "bg-home-ink text-home-bg border-home-ink"
                  : "bg-home-paper text-home-ink border-home-hairline hover:border-home-hairline-strong hover:bg-white",
              ].join(" ")}
            >
              <span
                className={[
                  "font-fraunces italic font-normal text-[11px]",
                  isActive ? "text-home-bg/60" : "text-home-muted",
                ].join(" ")}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{t(c.labelKo, c.labelEn)}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
