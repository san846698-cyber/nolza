import Link from "next/link";

const CONTACT_EMAIL = "studio4any@gmail.com";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>Nolza.fun</strong>
          <span>Operated by Studio4Any</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <nav className="site-footer__links" aria-label="Footer links">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="site-footer__copy">
          © 2026 Nolza.fun / Studio4Any. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
