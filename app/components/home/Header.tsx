"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export function HomeHeader() {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <header className="relative overflow-hidden border-b border-home-hairline bg-[radial-gradient(circle_at_18%_10%,rgba(213,111,84,0.16),transparent_30rem),radial-gradient(circle_at_86%_8%,rgba(183,134,72,0.13),transparent_28rem),linear-gradient(180deg,#fffdf8_0%,#fff8ed_62%,rgba(255,255,255,0.34)_100%)]">
      <div className="mx-auto flex w-full max-w-col items-center justify-between gap-3.5 px-4 py-4 sm:px-6 lg:px-7">
        <Link
          href="#top"
          className="inline-flex shrink-0 items-baseline gap-1 leading-none no-underline"
        >
          <span className="font-serif text-[34px] font-black tracking-[-0.04em] text-home-ink sm:text-[42px]">
            놀자
          </span>
          <span className="font-fraunces text-[19px] font-light italic tracking-tight text-home-coral sm:text-[23px]">
            .fun
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-3.5">
          <span className="hidden max-w-[34ch] font-inter text-[13px] font-semibold leading-snug text-home-muted sm:inline">
            {t("테스트하고, 웃고, 공유하는 곳", "Test, laugh, and share.")}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={
              locale === "ko" ? "Switch to English" : "Switch to Korean"
            }
            className="min-h-9 rounded-full border border-home-hairline bg-white/78 px-3 py-2 font-inter text-[12px] font-bold tracking-[0.1em] text-home-ink shadow-[0_10px_24px_rgba(48,35,24,0.06)] transition-[background,border-color,transform] hover:-translate-y-0.5 hover:border-home-hairline-strong hover:bg-white whitespace-nowrap"
          >
            {locale === "ko" ? "한 / EN" : "EN / 한"}
          </button>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-col gap-7 px-4 pb-9 pt-7 sm:px-6 sm:pb-12 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_324px] lg:items-end lg:px-6">
        <div className="max-w-[660px]">
          <p className="mb-3 font-inter text-[12px] font-black uppercase tracking-[0.18em] text-home-coral">
            {t("VIRAL TEST PLAYGROUND", "VIRAL TEST PLAYGROUND")}
          </p>
          <h1 className="m-0 max-w-[13ch] font-serif text-[42px] font-black leading-[1.02] tracking-[-0.03em] text-home-ink sm:text-[56px] lg:text-[64px]">
            {t("이상하게 나를 잘 맞히는 테스트 놀이터", "Fun tests that feel weirdly accurate.")}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[16px] font-medium leading-[1.72] text-home-ink-2/78 sm:text-[17px]">
            {t(
              "심리, 관계, 운세, 미니게임까지. 짧게 즐기고 결과를 바로 공유하기 좋은 콘텐츠를 모았습니다.",
              "Psychology, relationships, fortune-style fun, and mini games built for quick play and easy sharing.",
            )}
          </p>
        </div>

        <div className="rounded-[28px] border border-home-hairline bg-white/72 p-3.5 shadow-[0_24px_60px_rgba(48,35,24,0.10),0_1px_0_rgba(255,255,255,0.84)_inset] backdrop-blur-xl sm:p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { ko: "심리", en: "Psych", value: "12+" },
              { ko: "관계", en: "Match", value: "4" },
              { ko: "짧게", en: "Quick", value: "3m" },
            ].map((item) => (
              <div key={item.en} className="rounded-[18px] border border-home-hairline bg-white/70 px-2.5 py-2.5 text-center shadow-[0_10px_24px_rgba(48,35,24,0.045)] sm:px-3 sm:py-3">
                <strong className="block font-inter text-[21px] font-black leading-none text-home-ink sm:text-[23px]">{item.value}</strong>
                <span className="mt-1.5 block text-[11px] font-black tracking-[0.08em] text-home-muted">
                  {t(item.ko, item.en)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[13px] font-semibold leading-relaxed text-home-muted">
            {t("마음이 드는 카드를 고르면 바로 시작할 수 있어요.", "Pick a card and jump straight in.")}
          </p>
        </div>
      </section>
    </header>
  );
}

export default HomeHeader;
