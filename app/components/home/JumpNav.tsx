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
      className="sticky top-[57px] z-40"
      style={{
        background: "rgba(250, 250, 247, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
      aria-label="Jump to category"
    >
      <div className="mx-auto flex max-w-col items-center gap-1.5 overflow-x-auto px-4 py-2.5 sm:gap-2 sm:px-6 lg:px-7 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {categories.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={isActive ? "true" : undefined}
              className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full px-4 py-2 font-inter text-[13px] font-bold tracking-tight whitespace-nowrap no-underline transition-[background,color] duration-200"
              style={
                isActive
                  ? {
                      background: "var(--text-primary)",
                      color: "#FFFFFF",
                    }
                  : {
                      background: "transparent",
                      color: "var(--text-secondary)",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--bg-secondary)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
              }}
            >
              <span
                className="font-mono text-[10px] font-black tracking-[0.12em]"
                style={{
                  color: isActive ? "rgba(255,255,255,0.5)" : "var(--accent)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {t(c.labelKo, c.labelEn)}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
