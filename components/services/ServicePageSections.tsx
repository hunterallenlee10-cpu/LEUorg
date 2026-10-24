import Link from "next/link";
import { ArrowRight, ChevronRight, CircleCheck } from "lucide-react";
import {
  getService,
  relatedBuildsExclude,
  relatedBuildsLimit,
  serviceIndustry,
  serviceFaqs,
  servicePath,
  servicesAnchors,
  servicesRoutes,
  type ServiceGroup,
  serviceItemParts,
} from "@/data/services";
import { FaqAccordion } from "@/components/lee-systems/FaqAccordion";
import { site } from "@/data/site";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { serviceIcons } from "@/components/services/serviceIcons";
import { MiniPreview } from "@/components/services/MiniPreview";
import { DemoSlot } from "@/components/services/demos/registry";
import { DemoVideo } from "@/components/services/demo/DemoVideo";
import { BuildBox } from "@/components/shared/RecentWorkSection";
import { getDemoAssets } from "@/lib/demo-assets";

/**
 * The sections of a service page (/services/[slug]), in page order: the
 * hero, the demo, what's included, who it's for, how it works, related
 * builds (only where real work fits), and what it pairs well with. The CTA
 * band and the form follow, from the page itself. Everything comes from the
 * group's entry in data/services.ts.
 */

const eyebrow = "svc-eyebrow";
const section = "border-t border-white/[0.06] py-16 md:py-24";
export const serviceDemoAnchor = "demo";

function SectionHeader({ id, kicker, title, lead }: { id: string; kicker: string; title: string; lead?: string }) {
  return (
    <div className="mb-10 max-w-3xl md:mb-12">
      <p className={eyebrow}>{kicker}</p>
      <h2 id={id} className="heading-lg mt-4 text-balance text-white">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-neutral-300">{lead}</p>}
    </div>
  );
}

/** Where the page sits: Home › Services › this service. */
export function serviceBreadcrumbs(group: ServiceGroup) {
  return [
    { name: "Home", href: "/" },
    { name: "Services", href: servicesRoutes.hub },
    { name: group.name, href: servicePath(group.slug) },
  ];
}

function Breadcrumbs({ group }: { group: ServiceGroup }) {
  const crumbs = serviceBreadcrumbs(group);
  return (
    <nav aria-label="Breadcrumb" className="section-container mb-8 md:mb-10">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-400">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-neutral-200">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="rounded hover:text-white">
                    {crumb.name}
                  </Link>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ServiceHero({ group }: { group: ServiceGroup }) {
  const Icon = serviceIcons[group.icon];
  return (
    <section aria-labelledby="service-title" className="relative isolate overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(var(--gold)/0.12),transparent_70%)]"
      />
      <Breadcrumbs group={group} />
      <div className="section-container grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className={`${eyebrow} flex items-center gap-2.5`}>
            <Icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 text-brass-400" />
            Lee Enterprises Unlimited
          </p>
          <h1 id="service-title" className="heading-xl mt-5 text-balance text-white">
            {group.name}
          </h1>
          <p className="mt-5 text-xl font-semibold text-white md:text-2xl">{group.outcome}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-300">{group.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BookCallLink href={`#${servicesAnchors.form}`} variant="glow" arrow className="w-full sm:w-auto" />
            <a
              href={`#${serviceDemoAnchor}`}
              className="btn-ls-secondary inline-flex min-h-11 w-full items-center justify-center sm:w-auto"
            >
              Try the demo
            </a>
          </div>
        </div>
        <MiniPreview slug={group.slug} className="shadow-[0_30px_80px_-40px_rgb(var(--gold)/0.35)]" />
      </div>
    </section>
  );
}

export function ServiceDemoSection({ group }: { group: ServiceGroup }) {
  return (
    <section id={serviceDemoAnchor} aria-labelledby="service-demo-title" className={section}>
      <div className="section-container">
        <SectionHeader
          id="service-demo-title"
          kicker="See it work"
          title={`${group.name}, working`}
          lead={group.demo.intro}
        />
        <div className="mx-auto max-w-5xl">
          <DemoSlot slug={group.slug} formPath={servicePath(group.slug)} assets={getDemoAssets()} />
        </div>
      </div>
    </section>
  );
}

export function IncludedSection({ group }: { group: ServiceGroup }) {
  return (
    <section aria-labelledby="included-title" className={section}>
      <div className="section-container">
        <SectionHeader id="included-title" kicker="What's included" title="Everything in this service" />
        {/* Grouped under small headings when the items have sections, like
            Marketing & Lead Generation's SEO, Ads and Outreach. */}
        <div className="space-y-10">
          {serviceItemParts(group.items).map((part) => {
            const ItemTitle = part.section ? "h4" : "h3";
            return (
              <div key={part.section ?? "items"}>
                {part.section && (
                  <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-brass-300 uppercase">
                    {part.section}
                  </h3>
                )}
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:last-child:nth-child(3n+1)]:col-span-3">
                  {part.items.map((item) => (
                    <li
                      key={item.name}
                      className="rounded-xl border border-white/10 bg-[var(--svc-surface)] p-6 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(var(--ink)/0.18)]"
                    >
                      <CircleCheck aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-brass-400" />
                      <ItemTitle className="mt-4 text-lg leading-snug font-bold text-white">{item.name}</ItemTitle>
                      <p className="mt-2 leading-relaxed text-neutral-300">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection({ group }: { group: ServiceGroup }) {
  return (
    <section aria-labelledby="audience-title" className={section}>
      <div className="section-container">
        <SectionHeader
          id="audience-title"
          kicker="Who it's for"
          title="Built for businesses like yours"
          lead="A few examples. If you run a business, it can be built for yours."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {group.audience.map(({ industry, line }) => {
            const { name, video } = serviceIndustry(industry);
            return (
              <li
                key={industry}
                className="overflow-hidden rounded-xl border border-white/10 bg-[var(--svc-surface)] light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(var(--ink)/0.18)]"
              >
                <DemoVideo
                  src={video.src}
                  poster={video.poster}
                  className="relative aspect-[16/9] border-b border-white/10"
                />
                <div className="p-5">
                  <h3 className="font-bold text-white">{name}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-300">{line}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function StepsSection({ group }: { group: ServiceGroup }) {
  return (
    <section aria-labelledby="steps-title" className={section}>
      <div className="section-container">
        <SectionHeader id="steps-title" kicker="How it works" title="Three steps, built personally for you" />
        <ol className="grid gap-4 md:grid-cols-3">
          {group.steps.map((step, index) => (
            <li key={step.title} className="relative rounded-xl border border-white/10 p-6">
              <span className="text-5xl font-bold tracking-tight text-brass-300/80" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-bold text-white">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-neutral-300">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Only real work that fits; a page with none skips the section. */
export function RelatedBuildsSection({ group }: { group: ServiceGroup }) {
  if (!group.showRelatedBuilds) return null;
  const builds = site.projects
    .filter((project) => !relatedBuildsExclude.includes(project.name))
    .slice(0, relatedBuildsLimit);
  if (builds.length === 0) return null;
  return (
    <section aria-labelledby="related-title" className={section}>
      <div className="section-container">
        <SectionHeader id="related-title" kicker="Related builds" title="Sites we've built" />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((project) => (
            <li key={project.href} className="flex">
              <BuildBox project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PairsSection({ group }: { group: ServiceGroup }) {
  return (
    <section aria-labelledby="pairs-title" className={section}>
      <div className="section-container">
        <SectionHeader id="pairs-title" kicker="Pairs well with" title="Works even better together" />
        <ul className="grid gap-5 md:grid-cols-2">
          {group.pairsWith.map((slug) => {
            const pair = getService(slug);
            return (
              <li key={slug}>
                <Link
                  href={servicePath(slug)}
                  className="group flex h-full flex-col gap-5 rounded-xl border border-white/10 bg-[var(--svc-surface)] p-5 transition-colors hover:border-brass-400/50 motion-reduce:transition-none sm:flex-row sm:items-center light:bg-[#fff]"
                >
                  <MiniPreview slug={slug} className="w-full shrink-0 sm:w-56" />
                  <span>
                    <span className="block text-lg font-bold text-white">{pair.name}</span>
                    <span className="mt-1 block leading-relaxed text-neutral-300">{pair.outcome}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brass-300 group-hover:underline group-hover:underline-offset-4">
                      Learn more
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Answers from the /how-it-works FAQ that fit this service. */
export function ServiceFaqSection({ group }: { group: ServiceGroup }) {
  const faqs = serviceFaqs(group);
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="service-faq-title" className={section}>
      <div className="section-container">
        <div className="mx-auto max-w-3xl">
          <SectionHeader id="service-faq-title" kicker="FAQs" title="Questions people ask" />
        </div>
        <FaqAccordion items={faqs} idPrefix={`faq-${group.slug}`} chevronClassName="text-brass-400" />
      </div>
    </section>
  );
}
