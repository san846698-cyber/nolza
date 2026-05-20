"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import BrandMark, { brandText } from "@/app/components/BrandMark";

export function HomeHeader() {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <header className="relative overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(90deg,rgba(210,91,69,0.11),transparent_38%,rgba(149,94,42,0.10))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-18%,rgba(255,255,255,0.88),transparent_36rem)]" />

      <div className="relative mx-auto flex w-full max-w-col items-center justify-between gap-3.5 px-4 py-4 max-[640px]:mx-0 max-[640px]:max-w-none sm:px-6 lg:px-7">
        <Link
          href="#top"
          className="inline-flex shrink-0 leading-none no-underline"
          aria-label={brandText(locale)}
        >
          <BrandMark locale={locale} className="brand-mark--home" />
        </Link>

        <div className="ml-4 flex shrink-0 items-center gap-3.5 sm:ml-auto">
          <span className="hidden max-w-[34ch] font-inter text-[13px] font-semibold leading-snug text-home-muted sm:inline">
            {t("짧게 즐기고 바로 공유하는 테스트 스튜디오", "Quick tests made to play and share.")}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={
              locale === "ko" ? "Switch to English" : "Switch to Korean"
            }
            className="min-h-9 rounded-full border border-home-hairline bg-white/82 px-3.5 py-2 font-inter text-[12px] font-black tracking-[0.08em] text-home-ink shadow-[0_10px_24px_rgba(48,35,24,0.07)] transition-[background,border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-home-coral/35 hover:bg-white hover:shadow-[0_14px_30px_rgba(48,35,24,0.10)] whitespace-nowrap"
          >
            한 / EN
          </button>
        </div>
      </div>

      <section className="relative mx-auto w-full max-w-col px-4 pb-9 pt-7 sm:px-6 sm:pb-12 sm:pt-10 lg:px-6">
        <div className="max-w-[860px]">
          <p className="mb-3 font-inter text-[12px] font-black uppercase tracking-[0.2em] text-home-coral">
            VIRAL TEST PLAYGROUND
          </p>
          <h1 className="m-0 max-w-[360px] font-serif text-[38px] font-black leading-[1.04] tracking-[-0.035em] text-home-ink [word-break:keep-all] sm:max-w-[14ch] sm:text-[58px] sm:leading-[1.02] lg:text-[70px]">
            {t("이상하게 나를 잘 맞히는 테스트 놀이터", "Fun tests that feel weirdly accurate.")}
          </h1>
          <p className="mt-5 max-w-[62ch] text-[16px] font-semibold leading-[1.72] text-home-ink-2/78 sm:text-[17px]">
            {t(
              "심리, 관계, 운세, 미니게임까지. 짧게 즐기고 결과를 바로 공유하기 좋은 콘텐츠를 모았습니다.",
              "Psychology, relationships, fortune-style fun, and mini games built for quick play and easy sharing.",
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { ko: "심리 테스트", en: "Psych tests" },
              { ko: "궁합 & 관계", en: "Compatibility" },
              { ko: "미니게임", en: "Mini games" },
              { ko: "결과 공유", en: "Shareable results" },
            ].map((item) => (
              <span
                key={item.en}
                className="rounded-full border border-home-hairline bg-white/72 px-3.5 py-2 font-inter text-[12px] font-black tracking-[0.03em] text-home-ink shadow-[0_10px_24px_rgba(48,35,24,0.055)]"
              >
                {t(item.ko, item.en)}
              </span>
            ))}
          </div>
        </div>
      </section>
    </header>
  );
}

export default HomeHeader;
