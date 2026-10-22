import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceGroups, servicePath, servicesRoutes } from "@/data/services";
import { serviceIcons } from "@/components/services/serviceIcons";
import { MiniPreview } from "@/components/services/MiniPreview";
import { SectionHead } from "@/components/ui/ds";

/**
 * "What we do" (the black-and-gold redesign, 2026-10-18): the six service
 * groups as cut-corner cards, each with a tiny looping preview of its demo
 * (MiniPreview, the same one /services shows, with the demos' real photos),
 * its icon, name and outcome, linking to its /services page. "Try every
 * demo" opens the Demo Lab.
 */
export function HomeServices() {
  return (
    <section aria-labelledby="home-services-title" className="ds-section">
      <div className="ds-container">
        <SectionHead
          center
          id="home-services-title"
          eyebrow="What we do"
          title={
            <>
              6 ways we bring you <span className="ds-accent">more customers</span>
            </>
          }
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {serviceGroups.map((group, i) => {
            const Icon = serviceIcons[group.icon];
            return (
              <li key={group.slug} className="flex" data-reveal>
                <Link href={servicePath(group.slug)} className="ds-card group w-full">
                  <div className="ds-card-body gap-5 p-6 md:p-8">
                    <MiniPreview slug={group.slug} />
                    <span className="flex items-start justify-between gap-4">
                      <span className="grid h-12 w-12 place-items-center border border-brass-400/40 text-brass-400">
                        <Icon aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
                      </span>
                      <span className="font-mono text-xs tracking-[0.2em] text-neutral-400" aria-hidden="true">
                        0{i + 1}
                      </span>
                    </span>
                    <div>
                      <h3 className="ds-h3">{group.name}</h3>
                      <p className="mt-3 leading-relaxed text-neutral-300">{group.outcome}</p>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-brass-400">
                      See how it works
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link href={servicesRoutes.demoLab} className="btn-ds-outline group">
            Try every demo
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
