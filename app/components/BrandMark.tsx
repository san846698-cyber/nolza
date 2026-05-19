import type { SimpleLocale } from "@/hooks/useLocale";

type BrandMarkProps = {
  locale?: SimpleLocale;
  domain?: boolean;
  className?: string;
};

export function brandText(locale: SimpleLocale = "ko") {
  return locale === "ko" ? "놀자.fun" : "Nolza.fun";
}

export function homeBackLabel(locale: SimpleLocale = "ko") {
  return locale === "ko" ? "← 놀자 홈으로" : "← Back to Nolza.fun";
}

export default function BrandMark({
  locale = "ko",
  domain = false,
  className,
}: BrandMarkProps) {
  if (domain) {
    return <span className={className}>nolza.fun</span>;
  }

  const isKo = locale === "ko";

  return (
    <span
      className={["brand-mark", isKo ? "brand-mark--ko" : "brand-mark--en", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="brand-mark__name">{isKo ? "놀자" : "Nolza"}</span>
      <span className="brand-mark__dot">.fun</span>
    </span>
  );
}
