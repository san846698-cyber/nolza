import type { SimpleLocale } from "@/hooks/useLocale";

type BrandMarkProps = {
  locale?: SimpleLocale;
  domain?: boolean;
  className?: string;
};

export function brandText(locale: SimpleLocale = "ko") {
  return locale === "ko" ? "놀자.fun" : "nolza.fun";
}

export function homeBackLabel(locale: SimpleLocale = "ko") {
  return locale === "ko" ? "← 놀자 홈으로" : "← Back to nolza.fun";
}

export default function BrandMark({
  locale = "ko",
  domain = false,
  className,
}: BrandMarkProps) {
  const text = domain ? "nolza.fun" : brandText(locale);
  const [name, suffix] =
    !domain && locale === "ko" ? ["놀자", ".fun"] : [text, ""];

  return (
    <span
      className={[
        domain ? "brand-mark brand-mark--domain" : "brand-mark",
        !domain && locale === "ko" ? "brand-mark--ko" : "brand-mark--en",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={text}
    >
      <span className="brand-mark__name" aria-hidden="true">
        {name}
      </span>
      {suffix && (
        <span className="brand-mark__dot" aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  );
}
