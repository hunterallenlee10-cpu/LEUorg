import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { serviceGroups, servicePath, servicesRoutes } from "@/data/services";
import { serviceIcons } from "@/components/services/serviceIcons";
import { MiniPreview } from "@/components/services/MiniPreview";

/**
 * "What we do" on the homepage (2026-10-17), right after the hero and its
 * websites / automations offer. It replaced the compact "Everything we do"
 * row (ServiceGroupsRow) with a bento of the six service groups: each tile
 * shows a live poster of its service (MiniPreview: a muted 5-second loop
 * with one line of what just happened, playing only on screen, still under
 * reduced motion), its icon, name and outcome,
 * and links to its page. "Try every demo" opens the Demo Lab.
 *
 * Four columns on wide screens, with the first and last groups as large
 * tiles so the rows zigzag (large + 2, then 2 + large); two columns on a
 * tablet; one on a phone.
 */
const LARGE = new Set([serviceGroups[0].slug, serviceGroups[serviceGroups.length - 1].slug]);

export function ServicesShowcase() {
  return (
    <section aria-labelledby="home-services-title" className="relative isolate py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_0%,rgb(var(--gold)/0.08),transparent_70%)]"
      />
      <div className="section-container">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] text-brass-300 uppercase">What we do</p>
          <h2 id="home-services-title" className="heading-lg mt-4 text-balance text-white md:text-5xl">
            Six ways we bring you <span className="text-brass-300">more customers</span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {serviceGroups.map((group) => {
            const Icon = serviceIcons[group.icon];
            const large = LARGE.has(group.slug);
            return (
              <li key={group.slug} className={clsx("flex", large && "md:col-span-2")}>
                <Link
                  href={servicePath(group.slug)}
                  className={clsx(
                    "group flex w-full flex-col gap-5 rounded-xl border border-white/10 bg-[#0f2346] p-4 transition-colors duration-300 hover:border-brass-400/50 motion-reduce:transition-none sm:p-5 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(15_35_70/0.18)]",
                    large && "md:grid md:grid-cols-[1.25fr_1fr] md:items-center"
                  )}
                >
                  <MiniPreview slug={group.slug} />
                  <span className="flex flex-1 flex-col">
                    <span className="flex items-center gap-2.5">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 shrink-0 text-brass-400" />
                      <span className={clsx("font-bold tracking-tight text-white", large ? "text-xl" : "text-lg")}>
                        {group.name}
                      </span>
                    </span>
                    <span className="mt-2 leading-relaxed text-neutral-300">{group.outcome}</span>
                    {large && (
                      <span className="mt-3 hidden leading-relaxed text-neutral-400 md:block">{group.description}</span>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brass-300 group-hover:underline group-hover:underline-offset-4">
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
            Try every demo
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
