import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { leeSystemsAnchors } from "@/data/lee-systems";
import { carePlan, serviceGroups, servicePath, servicesRoutes } from "@/data/services";
import { serviceIcons } from "@/components/services/serviceIcons";
import { MiniPreview } from "@/components/services/MiniPreview";

/**
 * "What we do" on /how-it-works (`#services`): the six service groups
 * (data/services.ts) as large cards, each with a tiny looping preview of its
 * demo, its icon, name and outcome, and a link to its own page. Since
 * 2026-10-17 the cards link out rather than opening their items in place
 * ("See what's included"): each page lists them in full. "Try the demos"
 * under the grid opens the Demo Lab on /services, and the Care Plan, an
 * add-on to any of them, is one band under that.
 *
 * Each card keeps its group's old `anchor` as its id, so links made to a
 * card before the service pages existed still land on it.
 *
 * Below md each card is a compact row, preview on the left and the words on
 * the right (2026-10-17): stacked full-size, the six ran past 3,000px on a
 * phone.
 */
export function LeeSystemsServicesSection() {
  return (
    <section
      id={leeSystemsAnchors.services}
      aria-labelledby="ls-services-title"
      className="relative isolate py-20 md:py-28"
    >
      <div className="section-container">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="ds-eyebrow ds-eyebrow--center mb-4">What we do</p>
          <h2 id="ls-services-title" className="heading-lg text-white">
            Everything that brings customers in{" "}
            <span className="text-brass-300">and takes work off your plate</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-300">
            A website that sells, AI that answers every call and lead, and the
            marketing that keeps new customers coming. Pick one or all six.
            Built personally for you.
          </p>
        </div>

        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {serviceGroups.map(({ slug, anchor, icon, name, outcome }) => {
            const Icon = serviceIcons[icon];
            return (
              <li key={slug} id={anchor} className="flex scroll-mt-24">
                <Link
                  href={servicePath(slug)}
                  className="group grid w-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-4 rounded-xl border border-white/10 bg-[#0f2346] p-3.5 transition-colors duration-300 hover:border-brass-400/50 motion-reduce:transition-none sm:p-5 md:flex md:flex-col md:items-stretch md:gap-0 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(15_35_70/0.18)]"
                >
                  <MiniPreview slug={slug} />
                  <span className="flex min-w-0 flex-col md:flex-1">
                    <span className="flex items-center gap-2.5 md:mt-5">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="hidden h-5 w-5 shrink-0 text-brass-400 md:block" />
                      <span className="text-base leading-snug font-bold tracking-tight text-white md:text-xl">{name}</span>
                    </span>
                    <span className="mt-1 text-sm leading-relaxed text-neutral-300 md:mt-2 md:text-base">{outcome}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brass-300 group-hover:underline group-hover:underline-offset-4 md:pt-4">
                    See how it works
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                    />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href={servicesRoutes.demoLab}
            className="btn-ls-secondary group inline-flex min-h-11 items-center justify-center gap-2"
          >
            Try the demos
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 rounded-xl border border-brass-400/25 bg-[#0f2346] px-6 py-5 sm:flex-row sm:items-center sm:gap-5 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(15_35_70/0.18)]">
          <span className="flex items-center gap-3">
            <ShieldCheck
              aria-hidden="true"
              strokeWidth={1.5}
              className="h-[22px] w-[22px] shrink-0 text-brass-400"
            />
            <span className="text-xs font-semibold tracking-[0.18em] whitespace-nowrap text-brass-300 uppercase">
              Add-on: {carePlan.name}
            </span>
          </span>
          <p className="leading-relaxed text-neutral-300">{carePlan.body}</p>
        </div>
      </div>
    </section>
  );
}
