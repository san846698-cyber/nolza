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
      className="sticky top-0 z-40 border-b border-home-hairline bg-[rgba(255,248,235,0.82)] shadow-[0_14px_36px_rgba(48,35,24,0.06)] backdrop-blur-xl"
      aria-label="Jump to category"
    >
      <div className="mx-auto flex max-w-col gap-2.5 overflow-x-auto px-4 py-3 sm:gap-3 sm:px-6 sm:py-3.5 lg:px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {categories.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={isActive ? "true" : undefined}
              className={[
                "inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-full px-[18px] py-2.5 sm:min-h-[50px] sm:px-5 lg:min-h-[48px] lg:px-5",
                "border text-[14.5px] font-black tracking-tight sm:text-[15px]",
                "whitespace-nowrap no-underline shadow-[0_10px_24px_rgba(48,35,24,0.055)] transition-[background,color,border-color,transform,box-shadow]",
                isActive
                  ? "border-home-ink bg-home-ink text-white shadow-[0_16px_34px_rgba(20,17,14,0.16)]"
                  : "border-home-hairline bg-white/72 text-home-ink hover:-translate-y-0.5 hover:border-home-coral/30 hover:bg-white hover:shadow-[0_16px_34px_rgba(48,35,24,0.10)]",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-[11px] font-black tracking-[0.1em]",
                  isActive ? "text-white/62" : "text-home-coral/80",
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
