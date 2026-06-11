"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import BrandMark, { brandText } from "@/app/components/BrandMark";

export function HomeHeader() {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <>
      {/* ── Sticky top nav ────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto flex max-w-col items-center justify-between px-4 py-3.5 sm:px-6 lg:px-7">
          <Link
            href="#top"
            className="inline-flex shrink-0 leading-none no-underline"
            aria-label={brandText(locale)}
          >
            <BrandMark locale={locale} className="brand-mark--home" />
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
            className="min-h-9 rounded-full border px-4 py-2 font-inter text-[12px] font-black tracking-[0.08em] transition-colors whitespace-nowrap"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              background: "#FFFFFF",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-secondary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#FFFFFF")
            }
          >
            한 · EN
          </button>
        </div>
      </header>

      {/* ── Hero section ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-col px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-7 lg:pt-20">
        <p
          className="mb-5 font-inter text-[11px] font-black uppercase tracking-[0.24em]"
          style={{ color: "var(--accent)" }}
        >
          PSYCHOLOGY · RELATIONSHIP · GAME
        </p>

        <h1
          className="m-0 max-w-[16ch] whitespace-pre-line font-serif text-[40px] font-black leading-[1.12] tracking-[-0.03em] [word-break:keep-all] sm:text-[54px] lg:text-[66px]"
          style={{ color: "var(--text-primary)" }}
        >
          {t("지금 이 순간,\n당신을 알아가는 시간", "This moment.\nGetting to know you.")}
        </h1>

        <p
          className="mt-6 max-w-[52ch] text-[15px] leading-[1.8] sm:text-[16px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {t(
            "심리, 관계, 운세, 미니게임까지. 결과가 신기하게 잘 맞는 테스트 모음.",
            "Psychology, relationships, fortune-style fun, and mini games. Surprisingly accurate results.",
          )}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {[
            { ko: "심리 테스트", en: "Psych tests" },
            { ko: "궁합 & 관계", en: "Compatibility" },
            { ko: "미니게임", en: "Mini games" },
            { ko: "결과 공유", en: "Share results" },
          ].map((item) => (
            <span
              key={item.en}
              className="rounded-full border px-3.5 py-1.5 font-inter text-[12px] font-semibold"
              style={{
                borderColor: "var(--border)",
                background: "#FFFFFF",
                color: "var(--text-secondary)",
              }}
            >
              {t(item.ko, item.en)}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomeHeader;
