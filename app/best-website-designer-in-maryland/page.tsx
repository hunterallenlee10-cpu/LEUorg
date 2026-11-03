import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, CircleCheck, ShieldCheck } from "lucide-react";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { StatTiles } from "@/components/ui/ds";
import { SITE_URL } from "@/data/company";
import { site, telHref } from "@/data/site";
import {
  assertNoPlaceholders,
  formatLastUpdated,
  marylandAudience,
  marylandCta,
  marylandFaqs,
  marylandFeatures,
  marylandLabel,
  marylandLastUpdated,
  marylandLead,
  marylandRoute,
  marylandSeo,
  marylandSteps,
  marylandWhy,
  marylandWork,
} from "@/data/maryland-page";

/**
 * /best-website-designer-in-maryland (2026-11-03): one page that answers the
 * search "best website designer in Maryland" for people and for AI answer
 * engines. All copy is in data/maryland-page.ts; the plan and checklist are
 * in implementation/best-website-designer-in-maryland.md.
 *
 * A server component with no data fetching, so it is prerendered at build
 * time and the whole text is in the HTML without JavaScript.
 */

const pageUrl = `${SITE_URL}${marylandRoute}`;
const { title, description } = marylandSeo;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: site.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: marylandLabel, href: marylandRoute },
];

/**
 * The three builds, looked up by name so the pictures stay the site's own.
 * A build links to its live site only when `linked` is true; G1's card is
 * the screenshot alone until its real domain is confirmed.
 */
const work = marylandWork.items.flatMap((item) => {
  const project = site.projects.find((p) => p.name === item.project);
  if (!project?.image) return [];
  const href = item.linked ? (item.href ?? project.href) : undefined;
  return [{ ...item, href, image: project.image }];
});

// Stops the build if any copy still holds a stand-in.
assertNoPlaceholders();

const maryland = { "@type": "State", name: "Maryland" } as const;
const businessId = `${SITE_URL}/#organization`;

/**
 * One @graph: the page, its breadcrumb trail, the business, the service and
 * the FAQ (built from the same list as the questions on the page). No
 * rating, review or award: none exist to cite.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en-US",
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: site.name },
      about: { "@id": businessId },
      mainEntity: { "@id": `${pageUrl}#service` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      primaryImageOfPage: `${pageUrl}/opengraph-image`,
      dateModified: marylandLastUpdated,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.href === "/" ? SITE_URL : `${SITE_URL}${crumb.href}`,
      })),
    },
    {
      "@type": "ProfessionalService",
      "@id": businessId,
      name: site.name,
      alternateName: site.shortName,
      url: SITE_URL,
      logo: `${SITE_URL}/logos/leu-logo.png`,
      image: `${SITE_URL}/logos/leu-logo.png`,
      telephone: site.phone,
      email: site.email,
      areaServed: maryland,
      founder: { "@type": "Person", name: site.founder.name },
      sameAs: [site.instagramUrl, "https://www.leeenterprisesunlimited.com"],
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Website design in Maryland",
      serviceType: "Website design",
      description: marylandLead[0],
      url: pageUrl,
      provider: { "@id": businessId },
      areaServed: maryland,
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: marylandFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

const section = "ds-section border-t border-white/[0.06]";
const cardClass =
  "rounded-xl border border-white/10 bg-[var(--svc-surface)] p-6 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(var(--ink)/0.18)]";
const linkClass =
  "font-semibold text-white underline decoration-brass-400/60 underline-offset-4 hover:text-brass-400";

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: string }) {
  return (
    <>
      <p className="ds-eyebrow">{eyebrow}</p>
      <h2 id={id} className="ds-h2 ds-h2--sm mt-4">
        {children}
      </h2>
    </>
  );
}

function hostname(href: string): string {
  return new URL(href).hostname.replace(/^www\./, "");
}

export default function BestWebsiteDesignerInMarylandPage() {
  return (
    <div className="ds-page min-h-screen bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <MainHeader />

      <main className="pt-20">
        {/* Hero: the direct answer first. */}
        <section aria-labelledby="page-title" className="relative isolate overflow-hidden pt-10 pb-16 md:pt-14 md:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(var(--gold)/0.12),transparent_70%)]"
          />
          <div className="ds-container">
            <nav aria-label="Breadcrumb" className="mb-8 md:mb-10">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-400">
                {crumbs.map((crumb, index) =>
                  index === crumbs.length - 1 ? (
                    <li key={crumb.href}>
                      <span aria-current="page" className="text-neutral-200">
                        {crumb.name}
                      </span>
                    </li>
                  ) : (
                    <li key={crumb.href} className="flex items-center gap-1.5">
                      <Link href={crumb.href} className="hover:text-white">
                        {crumb.name}
                      </Link>
                      <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </li>
                  )
                )}
              </ol>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
              <div>
                <p className="ds-eyebrow">Hunter Lee · {site.name}</p>
                <h1 id="page-title" className="heading-xl mt-5 text-balance">
                  {marylandLabel}
                </h1>
                <div className="mt-7 max-w-2xl space-y-4 text-lg leading-relaxed text-neutral-300 md:text-xl">
                  {marylandLead.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <BookCallLink variant="glow" arrow className="w-full sm:w-auto" />
                  {site.phone && (
                    <a href={telHref(site.phone)} className={`${linkClass} text-center sm:text-left`}>
                      Or call {site.phone}
                    </a>
                  )}
                </div>
                <p className="mt-8 font-mono text-xs tracking-[0.18em] text-neutral-400 uppercase">
                  Last updated:{" "}
                  <time dateTime={marylandLastUpdated}>{formatLastUpdated(marylandLastUpdated)}</time>
                </p>
              </div>

              <figure className="overflow-hidden rounded-xl border border-white/10 bg-[var(--svc-surface)] shadow-[0_30px_80px_-40px_rgb(var(--gold)/0.35)] light:bg-[#fff]">
                <div className="flex h-8 items-center gap-1.5 bg-white/[0.04] px-4" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-2 truncate font-mono text-[0.6875rem] text-neutral-400">
                    leeenterprisesunlimited.com
                  </span>
                </div>
                {/* The one image whose alt text carries the phrase: LEU's own site, built by Hunter Lee. */}
                <Image
                  src="/projects/leu.webp"
                  alt={`${marylandLabel}: the ${site.name} website, built by ${site.founder.name}`}
                  width={960}
                  height={600}
                  sizes="(min-width: 1024px) 30rem, 92vw"
                  loading="eager"
                  fetchPriority="high"
                  className="block h-auto w-full"
                />
                <figcaption className="sr-only">
                  The {site.name} website, one of the sites {site.founder.name} designed and built.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 1. Who it's for */}
        <section aria-labelledby="audience-title" className={section}>
          <div className="ds-container">
            <div className="max-w-3xl">
              <SectionTitle id="audience-title" eyebrow="Who it's for">
                {marylandAudience.title}
              </SectionTitle>
              <div className="ds-sub mt-6 space-y-4">
                {marylandAudience.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {marylandAudience.examples.map((example) => (
                <li key={example.name} className={cardClass}>
                  <h3 className="text-lg font-bold text-white">{example.name}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-300">{example.line}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-neutral-300">{marylandAudience.close}</p>
          </div>
        </section>

        {/* 2. What you get */}
        <section aria-labelledby="features-title" className={`${section} ds-alt`}>
          <div className="ds-container">
            <div className="max-w-3xl">
              <SectionTitle id="features-title" eyebrow="What's included">
                {marylandFeatures.title}
              </SectionTitle>
              <p className="ds-sub mt-6">{marylandFeatures.intro}</p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {marylandFeatures.items.map((item) => (
                <li key={item.name} className={cardClass}>
                  <CircleCheck aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-brass-400" />
                  <h3 className="mt-4 text-lg font-bold text-white">{item.name}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-300">{item.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. How it works */}
        <section aria-labelledby="steps-title" className={section}>
          <div className="ds-container">
            <div className="max-w-3xl">
              <SectionTitle id="steps-title" eyebrow="The process">
                {marylandSteps.title}
              </SectionTitle>
              <p className="ds-sub mt-6">{marylandSteps.intro}</p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {marylandSteps.steps.map((step, index) => (
                <li key={step.name} className="rounded-xl border border-white/10 p-6">
                  <span className="text-5xl font-bold tracking-tight text-brass-300" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-neutral-300">{step.line}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brass-400/25 bg-[var(--svc-surface)] px-6 py-5 sm:flex-row sm:items-center sm:gap-5 light:bg-[#fff]">
              <span className="flex items-center gap-3">
                <ShieldCheck aria-hidden="true" strokeWidth={1.5} className="h-[22px] w-[22px] shrink-0 text-brass-400" />
                <h3 className="text-sm font-semibold tracking-[0.18em] whitespace-nowrap text-brass-300 uppercase">
                  {marylandSteps.carePlan.name}
                </h3>
              </span>
              <p className="leading-relaxed text-neutral-300">{marylandSteps.carePlan.line}</p>
            </div>
          </div>
        </section>

        {/* 4. Recent work */}
        {work.length > 0 && (
          <section aria-labelledby="work-title" className={`${section} ds-alt`}>
            <div className="ds-container">
              <div className="max-w-3xl">
                <SectionTitle id="work-title" eyebrow="The proof">
                  {marylandWork.title}
                </SectionTitle>
                <p className="ds-sub mt-6">{marylandWork.intro}</p>
              </div>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {work.map((item) => {
                  const body = (
                    <div className="ds-card-body">
                      <div className="border-b border-white/10">
                        <div className="flex h-8 items-center gap-1.5 bg-white/[0.04] px-4" aria-hidden="true">
                          <span className="h-2 w-2 rounded-full bg-white/20" />
                          <span className="h-2 w-2 rounded-full bg-white/20" />
                          <span className="h-2 w-2 rounded-full bg-white/20" />
                          {item.href && (
                            <span className="ml-2 min-w-0 truncate font-mono text-[0.6875rem] text-neutral-400">
                              {hostname(item.href)}
                            </span>
                          )}
                        </div>
                        <Image
                          src={item.image}
                          alt={item.alt}
                          width={960}
                          height={600}
                          loading="lazy"
                          sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 90vw"
                          className="block aspect-[16/10] h-auto w-full object-cover object-top"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl leading-tight font-bold text-white">{item.project}</h3>
                        <p className="mt-2 leading-relaxed text-neutral-300">{item.line}</p>
                        {item.href && (
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brass-400">
                            Visit the live site
                            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                  return (
                    <li key={item.project} className="flex">
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="ds-card group w-full">
                          {body}
                        </a>
                      ) : (
                        <div className="ds-card w-full">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* 5. Why LEU */}
        <section aria-labelledby="why-title" className={section}>
          <div className="ds-container">
            <div className="max-w-3xl">
              <SectionTitle id="why-title" eyebrow="Why LEU">
                {marylandWhy.title}
              </SectionTitle>
              <p className="ds-sub mt-6">{marylandWhy.body[0]}</p>
            </div>
            <StatTiles className="mt-10" />
            <p className="mt-10 text-lg text-neutral-300">{marylandWhy.body[1]}</p>
            <ul className="ds-checks mt-5 sm:grid-cols-2 lg:grid-cols-3">
              {marylandWhy.terms.map((term) => (
                <li key={term}>
                  <CircleCheck aria-hidden="true" strokeWidth={1.75} />
                  {term}
                </li>
              ))}
            </ul>
            {/* The contextual link to the sister phrase page on the .com site
                (2026-11-03), so the two Maryland pages point at each other. */}
            <p className="mt-10 text-lg text-neutral-300">
              Need more than a website? See why Hunter Lee is known as the{" "}
              <a
                href="https://www.leeenterprisesunlimited.com/best-marketer-in-maryland"
                className={linkClass}
              >
                best marketer in Maryland
              </a>
              .
            </p>
          </div>
        </section>

        {/* 6. FAQ */}
        <section aria-labelledby="faq-title" className={`${section} ds-alt`}>
          <div className="ds-container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <SectionTitle id="faq-title" eyebrow="FAQ">
                Questions Maryland owners ask
              </SectionTitle>
              <p className="ds-sub mt-6 max-w-md">Short answers. Anything else, ask on the free call.</p>
            </div>
            <div className="ds-faq">
              {marylandFaqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>
                    <h3 className="text-[1.0625rem] font-bold">{faq.question}</h3>
                    <span className="ds-faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="ds-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section aria-labelledby="cta-title" className="ds-band ds-section">
          <div className="ds-container text-center">
            <h2 id="cta-title" className="ds-h2 ds-h2--sm mx-auto max-w-3xl">
              {marylandCta.title}
            </h2>
            <p className="ds-sub mx-auto mt-6 max-w-2xl">{marylandCta.body}</p>
            <ul className="mt-6 flex flex-col items-center justify-center gap-3 text-lg sm:flex-row sm:gap-8">
              {site.phone && (
                <li>
                  <a href={telHref(site.phone)} className={linkClass}>
                    {site.phone}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${site.email}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
                  {site.email}
                </a>
              </li>
            </ul>
            {site.replyTime && (
              <p className="mt-4 text-neutral-300">Inquiries answered {site.replyTime}.</p>
            )}
            <div className="mt-10 flex justify-center">
              <BookCallLink variant="glow" arrow className="w-full sm:w-auto" />
            </div>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
