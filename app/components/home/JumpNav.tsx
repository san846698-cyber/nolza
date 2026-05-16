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
      className="sticky top-0 z-40 border-b border-home-hairline bg-home-bg/82 backdrop-blur-xl"
      aria-label="Jump to category"
    >
      <div className="mx-auto flex max-w-col gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {categories.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={isActive ? "true" : undefined}
              className={[
                "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 lg:min-h-9 lg:px-3",
                "border text-[13.5px] font-black tracking-tight lg:text-[13px]",
                "whitespace-nowrap no-underline shadow-[0_8px_20px_rgba(20,17,14,0.04)] transition-[background,color,border-color,transform]",
                isActive
                  ? "border-home-ink bg-home-ink text-home-bg"
                  : "border-home-hairline bg-white/58 text-home-ink hover:-translate-y-0.5 hover:border-home-hairline-strong hover:bg-white",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-[10.5px] font-black tracking-[0.08em]",
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
