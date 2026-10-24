import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { pricingPromise } from "@/data/lee-systems";
import {
  demoLabHref,
  serviceGroups,
  servicePath,
  servicesAnchors,
} from "@/data/services";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { QueryHashLink } from "@/components/ui/QueryHashLink";
import { serviceIcons } from "@/components/services/serviceIcons";
import { MiniPreview } from "@/components/services/MiniPreview";
import { DemoLab } from "@/components/services/DemoLab";
import { getDemoAssets } from "@/lib/demo-assets";

/**
 * The sections of /services, top to bottom: the hero, one row per service
 * group, the Demo Lab, and the closing call before the form.
 * Each reads the groups from data/services.ts.
 */

const formAnchor = `#${servicesAnchors.form}`;
const eyebrow = "svc-eyebrow";

export function ServicesHero() {
  return (
    <section
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(var(--gold)/0.12),transparent_70%)]"
      />
      <div className="section-container text-center">
        <p className={eyebrow}>Services</p>
        <h1
          id="services-title"
          className="heading-xl mx-auto mt-5 max-w-4xl text-balance text-white"
        >
          Everything we build, <span className="text-brass-300">in one place.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-neutral-300">
          Six ways we bring you more customers and take work off your plate. See
          each one working below, then pick what fits. Built personally for you.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BookCallLink href={formAnchor} variant="glow" arrow className="w-full sm:w-auto" />
          <a
            href={`#${servicesAnchors.demoLab}`}
            className="btn-ls-secondary inline-flex min-h-11 w-full items-center justify-center sm:w-auto"
          >
            Try the demos
          </a>
        </div>

        {/* Straight to one service's row (2026-10-17). */}
        <nav aria-label="Jump to a service" className="mx-auto mt-10 max-w-3xl">
          <ul className="flex flex-wrap justify-center gap-2">
            {serviceGroups.map(({ slug, name, icon }) => {
              const Icon = serviceIcons[icon];
              return (
                <li key={slug}>
                  <a
                    href={`#${slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-neutral-200 transition-colors hover:border-brass-400/50 hover:text-white motion-reduce:transition-none light:bg-[#fff]"
                  >
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-brass-400" />
                    {name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}

/** The six groups as large rows, text and preview alternating sides. */
export function ServiceRows() {
  return (
    <div>
      {serviceGroups.map((group, index) => {
        const Icon = serviceIcons[group.icon];
        const flip = index % 2 === 1;
        return (
          <section
            key={group.slug}
            id={group.slug}
            aria-labelledby={`service-row-${group.slug}`}
            className="scroll-mt-24 border-t border-white/[0.06] py-16 md:py-24"
          >
            <div className="section-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={flip ? "lg:order-2" : undefined}>
                <p className={`${eyebrow} flex items-center gap-2.5`}>
                  <Icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 text-brass-400" />
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2
                  id={`service-row-${group.slug}`}
                  className="heading-lg mt-4 text-balance text-white"
                >
                  {group.name}
                </h2>
                <p className="mt-3 text-xl font-semibold text-white">{group.outcome}</p>
                <p className="mt-4 max-w-xl leading-relaxed text-neutral-300">
                  {group.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.keyItems.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] leading-snug text-neutral-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <QueryHashLink
                    href={demoLabHref(group.slug)}
                    aria-label={`See it work: ${group.name} demo`}
                    className="btn-ls-primary inline-flex min-h-11 items-center justify-center"
                  >
                    See it work
                  </QueryHashLink>
                  <Link
                    href={servicePath(group.slug)}
                    className="btn-ls-secondary group inline-flex min-h-11 items-center justify-center gap-2"
                  >
                    {/* One flex item, so the hidden words join the visible
                        ones without a stray space. */}
                    <span>
                      Learn more<span className="sr-only"> about {group.name}</span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
              <div className={flip ? "lg:order-1" : undefined}>
                <MiniPreview
                  variant="ui"
                  slug={group.slug}
                  className="shadow-[0_30px_80px_-40px_rgb(var(--gold)/0.35)]"
                />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function DemoLabSection() {
  return (
    <section
      id={servicesAnchors.demoLab}
      aria-labelledby="demo-lab-title"
      className="relative isolate border-t border-white/[0.06] py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_0%,rgb(var(--gold)/0.1),transparent_70%)]"
      />
      <div className="section-container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className={eyebrow}>Demo Lab</p>
          <h2 id="demo-lab-title" className="heading-lg mt-4 text-balance text-white">
            See it working <span className="text-brass-300">in under a minute</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-neutral-300">
            Pick a service and press play. Every demo runs right here in your
            browser with made-up businesses.
          </p>
        </div>
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-6 light:bg-[#fff]/60">
          <DemoLab assets={getDemoAssets()} />
        </div>
      </div>
    </section>
  );
}

/** The closing call to action before a page's form. */
export function ServicesCtaBand({
  title,
  body,
  href = formAnchor,
}: {
  title: string;
  body: string;
  href?: string;
}) {
  return (
    <section aria-labelledby="services-cta-title" className="py-16 md:py-20">
      <div className="section-container">
        <div className="relative isolate overflow-hidden rounded-2xl border border-brass-400/25 bg-[var(--svc-surface)] px-6 py-12 text-center sm:px-12 md:py-16 light:bg-[#fff]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_50%_0%,rgb(var(--gold)/0.14),transparent_70%)]"
          />
          <h2 id="services-cta-title" className="heading-lg mx-auto max-w-2xl text-balance text-white">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-300">{body}</p>
          <BookCallLink href={href} variant="glow" arrow className="mt-8" />
          {/* The owner's offer terms (`pricingPromise`), right where the
              decision is made. */}
          <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-neutral-300">
            {pricingPromise.map((term) => (
              <li key={term} className="flex items-center gap-1.5">
                <Check aria-hidden="true" className="h-4 w-4 text-brass-400" />
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
