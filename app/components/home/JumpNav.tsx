"use client";

import { useLocale } from "@/hooks/useLocale";
import type { HomeCategory } from "@/lib/games-home";

// 섹션 네비 = 필터 탭. "전체" + 각 카테고리. 누르면 해당 섹션만 표시(스크롤 점프 X).
export default function JumpNav({
  categories,
  active,
  onSelect,
}: {
  categories: HomeCategory[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLocale();

  const tabs: { id: string; labelKo: string; labelEn: string; num: number | null }[] = [
    { id: "all", labelKo: "전체", labelEn: "All", num: null },
    ...categories.map((c, i) => ({
      id: c.id,
      labelKo: c.labelKo,
      labelEn: c.labelEn,
      num: i + 1,
    })),
  ];

  return (
    <nav
      className="sticky top-[57px] z-40"
      style={{
        background: "rgba(250, 250, 247, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
      aria-label="Filter by category"
    >
      <div className="mx-auto flex max-w-col items-center gap-1.5 overflow-x-auto px-4 py-2.5 sm:gap-2 sm:px-6 lg:px-7 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {tabs.map((tb) => {
          const isActive = active === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              onClick={() => onSelect(tb.id)}
              aria-pressed={isActive}
              className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border-0 px-4 py-2 font-inter text-[13px] font-bold tracking-tight whitespace-nowrap transition-[background,color] duration-200"
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
              {tb.num !== null && (
                <span
                  className="font-mono text-[10px] font-black tracking-[0.12em]"
                  style={{
                    color: isActive ? "rgba(255,255,255,0.5)" : "var(--accent)",
                  }}
                >
                  {String(tb.num).padStart(2, "0")}
                </span>
              )}
              {t(tb.labelKo, tb.labelEn)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
