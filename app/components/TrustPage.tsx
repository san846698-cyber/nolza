import Link from "next/link";
import type { ReactNode } from "react";

export function TrustPage({
  eyebrow,
  title,
  subtitle,
  backLabel = "← Back to Nolza.fun",
  lang,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  backLabel?: string;
  lang?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="trust-page" lang={lang}>
      <div className="trust-shell">
        <div className="trust-topbar">
          <Link className="trust-back" href="/">
            {backLabel}
          </Link>
          {actions}
        </div>
        <header className="trust-hero">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{subtitle}</span>
        </header>
        <div className="trust-card">{children}</div>
      </div>
    </main>
  );
}

export function TrustSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="trust-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
