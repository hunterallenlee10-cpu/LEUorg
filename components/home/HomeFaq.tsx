import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeFaqs } from "@/data/faq";
import { footerContent } from "@/data/company";
import { site, telHref } from "@/data/site";

/**
 * The homepage FAQ (the black-and-gold redesign, 2026-10-18, after
 * university.com's two-column FAQ): the heading, a line and the ways to
 * reach us on the left; the questions on the right as native
 * <details> disclosures, so they open with a keyboard and work without
 * JavaScript. Questions the owner hasn't answered yet (`todo` in
 * data/faq.ts) don't show.
 */
export function HomeFaq() {
  const faqs = homeFaqs.filter((faq) => faq.answer);

  return (
    <section aria-labelledby="home-faq-title" className="ds-section">
      <div className="ds-container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div data-reveal>
          <p className="ds-eyebrow">FAQ</p>
          <h2 id="home-faq-title" className="ds-h2 ds-h2--sm mt-4">
            Questions, <span className="ds-accent">answered</span>
          </h2>
          <p className="ds-sub mt-6 max-w-md">
            Straight answers. Anything else, ask us on the free call.
          </p>
          <ul className="mt-8 space-y-2 text-neutral-300">
            {site.phone && (
              <li>
                <a href={telHref(site.phone)} className="font-semibold text-white underline decoration-brass-400/60 underline-offset-4 hover:text-brass-400">
                  {site.phone}
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${site.email}`} className="break-all font-semibold text-white underline decoration-brass-400/60 underline-offset-4 hover:text-brass-400">
                {site.email}
              </a>
            </li>
          </ul>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerContent.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-neutral-400 underline underline-offset-4 hover:text-brass-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ds-faq" data-reveal>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span className="ds-faq-icon" aria-hidden="true" />
              </summary>
              <div className="ds-faq-answer">
                <p>{faq.answer}</p>
                {faq.link && (
                  <a
                    href={faq.link.href}
                    className="mt-3 inline-flex items-center gap-1.5 font-semibold text-brass-400 hover:underline hover:underline-offset-4"
                  >
                    {faq.link.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
