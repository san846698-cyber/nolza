"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export function HomeHeader() {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <header className="relative overflow-hidden border-b border-home-hairline bg-[radial-gradient(circle_at_18%_0%,rgba(178,16,43,0.10),transparent_28rem),linear-gradient(180deg,#fff9ee_0%,#f4efe4_100%)]">
      <div className="mx-auto flex w-full max-w-col items-center justify-between gap-3.5 px-4 py-4 sm:px-6 lg:px-7">
        <Link
          href="#top"
          className="inline-flex shrink-0 items-baseline gap-1 leading-none no-underline"
        >
          <span className="font-serif text-[34px] font-black tracking-[-0.04em] text-home-ink sm:text-[42px]">
            놀자
          </span>
          <span className="font-fraunces text-[19px] font-light italic tracking-tight text-home-injoo sm:text-[23px]">
            .fun
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-3.5">
          <span className="hidden max-w-[34ch] font-fraunces text-[14px] font-light italic leading-snug text-home-ink-2 sm:inline">
            {t("테스트하고, 웃고, 공유하는 곳", "Take, laugh, and share.")}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={
              locale === "ko" ? "Switch to English" : "Switch to Korean"
            }
            className="min-h-9 rounded-full border border-home-hairline-strong bg-white/55 px-3 py-2 font-inter text-[12px] font-bold tracking-[0.1em] text-home-ink shadow-[0_8px_22px_rgba(20,17,14,0.05)] transition-colors hover:bg-white whitespace-nowrap"
          >
            {locale === "ko" ? "한 / EN" : "EN / 한"}
          </button>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-col gap-6 px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_324px] lg:items-end lg:px-6">
        <div className="max-w-[660px]">
          <p className="mb-3 font-mono text-[11.5px] font-black uppercase tracking-[0.18em] text-home-injoo">
            {t("VIRAL TEST PLAYGROUND", "VIRAL TEST PLAYGROUND")}
          </p>
          <h1 className="m-0 max-w-[12ch] font-serif text-[44px] font-black leading-[0.98] tracking-[-0.045em] text-home-ink sm:text-[60px] lg:text-[70px]">
            {t("이상하게 나를 잘 맞히는 테스트 놀이터", "Fun tests that feel weirdly accurate.")}
          </h1>
          <p className="mt-4 max-w-[56ch] text-[16px] font-medium leading-[1.68] text-home-ink-2/80 sm:text-[17px]">
            {t(
              "심리, 관계, 운세, 미니게임까지. 짧게 즐기고 결과를 바로 공유하기 좋은 콘텐츠를 모았습니다.",
              "Psychology, relationships, fortune-style fun, and mini games built for quick play and easy sharing.",
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href="#featured"
              className="inline-flex min-h-10 items-center rounded-full bg-home-ink px-4.5 text-[13.5px] font-black text-home-bg no-underline shadow-[0_14px_30px_rgba(20,17,14,0.18)] transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-[14px]"
            >
              {t("추천부터 보기", "Start with featured")}
            </a>
            <a
              href="#tests"
              className="inline-flex min-h-10 items-center rounded-full border border-home-hairline-strong bg-white/60 px-4.5 text-[13.5px] font-black text-home-ink no-underline transition-colors hover:bg-white sm:px-5 sm:text-[14px]"
            >
              {t("테스트 둘러보기", "Browse tests")}
            </a>
          </div>
        </div>

        <div className="rounded-[24px] border border-home-hairline bg-white/48 p-3.5 shadow-[0_20px_54px_rgba(55,38,20,0.09)] backdrop-blur sm:p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { ko: "심리", en: "Psych", value: "12+" },
              { ko: "관계", en: "Match", value: "4" },
              { ko: "짧게", en: "Quick", value: "3m" },
            ].map((item) => (
              <div key={item.en} className="rounded-[16px] border border-home-hairline bg-home-paper/80 px-2.5 py-2.5 text-center sm:px-3 sm:py-3">
                <strong className="block font-serif text-[21px] leading-none text-home-ink sm:text-[23px]">{item.value}</strong>
                <span className="mt-1 block text-[11px] font-black tracking-[0.08em] text-home-muted">
                  {t(item.ko, item.en)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[13px] font-bold leading-relaxed text-home-muted">
            {t("마음에 드는 카드 하나만 골라도 바로 시작할 수 있어요.", "Pick a card and jump straight in.")}
          </p>
        </div>
      </section>
    </header>
  );
}

export default HomeHeader;
