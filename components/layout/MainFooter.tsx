import Image from "next/image";
import Link from "next/link";
import { SITE_URL, companyInfo, footerContent } from "@/data/company";
import { footerPages } from "@/data/navigation";
import { site, telHref } from "@/data/site";

/** 44px tall, so every row is a comfortable tap target on a phone. */
const footerLinkClass =
  "inline-flex min-h-11 items-center text-sm text-neutral-400 transition-colors hover:text-amber-400";

/** Headings are h2s so the outline stays in order under any page's sections. */
const footerHeadingClass =
  "mb-2 font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass-400";

/**
 * `variant="business-mastery"` is the footer of Business Mastery's own site
 * (docs/BUSINESS-MASTERY.md): the program's name, with Lee Enterprises
 * Unlimited as one link under it rather than a column of the main site's
 * pages, and the legal links as full www addresses, since the page may be
 * on its own subdomain where a bare /legal does not live.
 */
export function MainFooter({
  variant = "leu",
}: {
  variant?: "leu" | "business-mastery";
}) {
  const isBm = variant === "business-mastery";
  const legalHref = (href: string) => (isBm ? `${SITE_URL}${href}` : href);

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="ds-container py-14 md:py-20">
        <div
          className={`mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-8 ${
            isBm ? "md:grid-cols-3" : "md:grid-cols-4"
          }`}
        >
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={companyInfo.mark}
                alt={companyInfo.logoAlt}
                width={164}
                height={160}
                sizes="56px"
                className="h-11 w-auto"
              />
              <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-amber-400">
                {isBm ? "Business Mastery" : site.name}
              </p>
            </div>
            {isBm && (
              <p className="mb-3 text-sm text-neutral-300">
                A program of{" "}
                <a
                  href={SITE_URL}
                  className="underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-amber-400"
                >
                  {site.name}
                </a>
              </p>
            )}
            {site.slogan && (
              <p className="mb-3 text-sm text-neutral-300">{site.slogan}</p>
            )}
            {/* The owner's verse. Kept as one plain line in the footer's own
                type so it reads as the company's own words rather than a
                decorated pull quote. */}
            <p className="text-sm text-neutral-400">
              Philippians 4:13, &ldquo;I can do all things through Christ who
              strengthens me.&rdquo;
            </p>
          </div>

          {!isBm && (
            <nav aria-labelledby="footer-pages">
              <h2 id="footer-pages" className={footerHeadingClass}>
                Pages
              </h2>
              <ul>
                {footerPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className={footerLinkClass}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <h2 className={footerHeadingClass}>Get in touch</h2>
            <ul>
              {site.phone && (
                <li>
                  <a href={telHref(site.phone)} className={footerLinkClass}>
                    {site.phone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className={`${footerLinkClass} [overflow-wrap:anywhere]`}
                >
                  {site.email}
                </a>
              </li>
              {site.instagramUrl && (
                <li>
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLinkClass}
                  >
                    Instagram
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className={footerHeadingClass}>Legal</h2>
            <ul>
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  <Link href={legalHref(link.href)} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <p className="text-center text-sm text-neutral-400 md:text-left">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
