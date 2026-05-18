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
      className="sticky top-0 z-40 border-b border-home-hairline bg-home-bg/88 shadow-[0_12px_34px_rgba(55,38,20,0.055)] backdrop-blur-xl"
      aria-label="Jump to category"
    >
      <div className="mx-auto flex max-w-col gap-3 overflow-x-auto px-4 py-3.5 sm:gap-3.5 sm:px-6 sm:py-4 lg:px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {categories.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={isActive ? "true" : undefined}
              className={[
                "inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full px-5 py-2.5 sm:min-h-[54px] sm:px-6 lg:min-h-[52px] lg:px-6",
                "border text-[15px] font-black tracking-tight sm:text-[15.5px] lg:text-[15px]",
                "whitespace-nowrap no-underline shadow-[0_10px_24px_rgba(55,38,20,0.065)] transition-[background,color,border-color,transform,box-shadow]",
                isActive
                  ? "border-home-ink bg-home-ink text-home-bg shadow-[0_16px_34px_rgba(20,17,14,0.18)]"
                  : "border-home-hairline-strong bg-white/70 text-home-ink hover:-translate-y-0.5 hover:border-home-ink/35 hover:bg-white hover:shadow-[0_16px_34px_rgba(55,38,20,0.11)]",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-[11px] font-black tracking-[0.1em]",
                  isActive ? "text-home-bg/62" : "text-home-injoo/80",
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
