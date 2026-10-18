import Image from "next/image";
import { ArrowUpRight, Globe } from "lucide-react";
import { isExternalHref, site, type Project } from "@/data/site";
import { ComingSoonSlot } from "@/components/shared/ComingSoonSlot";
import { ShowMoreGrid } from "@/components/ui/ShowMoreGrid";
import { SectionHead } from "@/components/ui/ds";

/** Fewer real builds than this and the section doesn't show them alone. */
const MIN_PROJECTS = 1;

/** While placeholders show, "coming soon" boxes fill the grid out to this. */
const MIN_BOXES = 3;

/** Builds shown before "Show more". */
const INITIAL = 6;

/**
 * "Recent Builds", on the homepage and /how-it-works: the proof. One
 * cut-corner card per website in `site.projects`, each showing the site's
 * first screen and linking to the live site. Six show; "Show more" reveals
 * the rest (the black-and-gold redesign, 2026-10-18, after university.com's
 * wins grid; it replaced the 360° ring, BuildsRing, which is kept).
 *
 * While `site.showPlaceholders` is true, "coming soon" boxes fill the grid
 * out to three, and each real build takes the place of one. With
 * placeholders off, the section shows only real builds and hides with none.
 * Nothing here ever stands in a made-up project.
 */
export function RecentWorkSection({ id }: { id?: string }) {
  const { projects } = site;
  const openSlots = site.showPlaceholders
    ? Math.max(0, MIN_BOXES - projects.length)
    : 0;

  if (projects.length < MIN_PROJECTS && openSlots === 0) return null;

  return (
    <section
      id={id}
      aria-labelledby="recent-work-title"
      className="ds-section"
    >
      <div className="ds-container">
        <SectionHead
          center
          id="recent-work-title"
          eyebrow="The proof"
          title={
            <>
              Recent <span className="ds-accent">builds</span>
            </>
          }
          sub="Some of our favorite most recent work. Every one is live: open it and look around."
        />

        <ShowMoreGrid
          label="builds"
          initial={INITIAL}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
          items={[
            ...projects.map((project) => (
              <BuildBox key={project.href} project={project} />
            )),
            ...Array.from({ length: openSlots }, (_, i) => (
              <ComingSoonSlot
                key={`open-slot-${i}`}
                label="More builds coming soon"
                Icon={Globe}
                className="min-h-40 w-full"
              />
            )),
          ]}
        />
      </div>
    </section>
  );
}

/** "https://www.acme.com/" -> "acme.com". */
function hostname(href: string): string {
  return new URL(href).hostname.replace(/^www\./, "");
}

export function BuildBox({ project }: { project: Project }) {
  const external = isExternalHref(project.href);
  const domain = external ? hostname(project.href) : null;

  return (
    <a
      href={project.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="ds-card group w-full"
      data-reveal
    >
      <div className="ds-card-body">
        {project.image && (
          <div className="border-b border-white/10">
            <div
              className="flex h-8 items-center gap-1.5 bg-white/[0.04] px-4"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              {domain && (
                <span className="ml-2 truncate font-mono text-[0.6875rem] text-neutral-400">
                  {domain}
                </span>
              )}
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <Image
                src={project.image}
                alt={`${project.name} website, first screen`}
                fill
                sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 90vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-brass-400">
            {project.category}
          </p>
          <h3 className="mt-3 text-xl font-bold leading-tight text-white">{project.name}</h3>
          {project.upgradedFrom && (
            <p className="mt-1 text-sm text-neutral-400">
              Upgraded from {hostname(project.upgradedFrom)}
            </p>
          )}
          {project.summary && (
            <p className="mt-2 leading-relaxed text-neutral-400">
              {project.summary}
            </p>
          )}
          {project.built.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="What we built">
              {project.built.map((item) => (
                <li
                  key={item}
                  className="border border-white/10 px-2.5 py-1 text-xs text-neutral-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brass-400">
            Visit live site
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
            {external && <span className="sr-only">(opens in a new tab)</span>}
          </span>
        </div>
      </div>
    </a>
  );
}
