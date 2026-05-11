"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export function HomeHeader() {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <header className="bg-home-bg border-b border-dashed border-home-hairline">
      <div className="mx-auto max-w-col px-4 sm:px-6 py-5 sm:py-7 flex items-end justify-between gap-4 min-h-[80px]">
        <Link
          href="#top"
          className="inline-flex items-baseline gap-1 leading-none no-underline"
        >
          <span className="font-serif font-bold text-[40px] sm:text-[56px] tracking-[-0.04em] text-home-ink">
            놀자
          </span>
          <span className="font-fraunces italic font-light text-[20px] sm:text-[26px] text-home-injoo tracking-tight">
            .fun
          </span>
        </Link>

        <div className="flex items-center gap-3 shrink-0 pb-1.5">
          <span className="hidden sm:inline font-fraunces italic font-light text-[15px] text-home-ink-2 leading-tight">
            {t("심심할 때 클릭하는 곳", "stuff to click when bored")}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={
              locale === "ko" ? "Switch to English" : "한국어로 전환"
            }
            className="font-inter text-[11px] font-semibold tracking-[0.1em] px-3 py-2 border border-home-hairline-strong bg-transparent text-home-ink hover:bg-[rgba(20,17,14,0.04)] transition-colors whitespace-nowrap"
          >
            {locale === "ko" ? "한 / EN" : "EN / 한"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
