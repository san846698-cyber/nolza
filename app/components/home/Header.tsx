"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export function HomeHeader() {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <header className="bg-home-bg border-b border-dashed border-home-hairline">
      <div className="mx-auto flex w-full max-w-col items-end justify-between gap-3.5 px-4 py-4 sm:px-6 sm:py-6 lg:px-7 min-h-[80px]">
        <Link
          href="#top"
          className="inline-flex shrink-0 items-baseline gap-1 leading-none no-underline"
        >
          <span className="font-serif font-bold text-[40px] sm:text-[52px] tracking-[-0.04em] text-home-ink">
            놀자
          </span>
          <span className="font-fraunces italic font-light text-[21px] sm:text-[25px] text-home-injoo tracking-tight">
            .fun
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-3.5 pb-1">
          <span className="hidden sm:inline max-w-[34ch] font-fraunces italic font-light text-[15px] text-home-ink-2 leading-snug">
            {t("이상하게 나를 잘 맞히는 테스트 놀이터", "Fun tests that feel weirdly accurate.")}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={
              locale === "ko" ? "Switch to English" : "Switch to Korean"
            }
            className="font-inter text-[12px] font-bold tracking-[0.1em] px-3 py-2 min-h-9 border border-home-hairline-strong bg-transparent text-home-ink hover:bg-[rgba(20,17,14,0.04)] transition-colors whitespace-nowrap"
          >
            {locale === "ko" ? "한 / EN" : "EN / 한"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
