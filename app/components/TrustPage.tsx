import Link from "next/link";
import type { ReactNode } from "react";

export function TrustPage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="trust-page">
      <div className="trust-shell">
        <Link className="trust-back" href="/">
          ← Back to Nolza.fun
        </Link>
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
