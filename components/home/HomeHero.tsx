import Image from "next/image";
import { sectionIds } from "@/data/navigation";
import { site } from "@/data/site";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { ScribbleArrow, Underlined } from "@/components/ui/ds";

/** Three real builds for the proof line's thumbnail stack. */
const proofThumbs = site.projects.filter((project) => project.image).slice(0, 3);

/**
 * The homepage hero (the black-and-gold redesign, 2026-10-18, after
 * university.com's): eyebrow, the owner's headline with a gold hand-drawn
 * underline on "Customer", the owner's line, the gold call with hand-drawn
 * arrows pointing in from both sides, and a proof line: three client-site
 * thumbnails (real builds from data/site.ts, never faces) beside the first of
 * the owner's published stats.
 *
 * Under it, the owner's video sales letter, off until `site.vsl.show` is true
 * and a file is set (data/site.ts).
 */
export function HomeHero() {
  const proofStat = site.stats[0];
  const { vsl } = site;

  return (
    <section
      id={sectionIds.hero}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24"
    >
      {/* A soft gold pool and a faint grid behind the headline: depth without
          a photo, so the headline is the page's first paint. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[18%] h-[38rem] w-[60rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--gold)/0.16),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(var(--ink)/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--ink)/0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_50%_30%,black_20%,transparent_70%)]" />
      </div>

      <div className="ds-container flex flex-col items-center text-center">
        <p className="ds-eyebrow ds-eyebrow--center">Lee Enterprises Unlimited</p>

        <h1 id="hero-title" className="ds-h1 mt-6 max-w-5xl">
          Never miss another <Underlined>customer</Underlined>
        </h1>

        <p className="ds-sub mt-8 text-lg text-neutral-300 md:text-xl">
          <span className="whitespace-nowrap">More customers.</span>{" "}
          <span className="whitespace-nowrap">More money.</span>{" "}
          <span className="whitespace-nowrap">Less work.</span>
        </p>

        <div className="mt-10 flex w-full items-center justify-center gap-3 sm:w-auto sm:gap-5">
          <ScribbleArrow side="left" className="hidden sm:block" />
          <BookCallLink variant="hero" className="w-full sm:w-auto" />
          <ScribbleArrow side="right" className="hidden sm:block" />
        </div>

        {proofStat && (
          <p className="mt-7 flex items-center gap-3 text-sm font-semibold text-white">
            {proofThumbs.length > 0 && (
              <span className="flex" aria-hidden="true">
                {proofThumbs.map((project, i) => (
                  <span
                    key={project.href}
                    className="relative block h-8 w-12 overflow-hidden border-2 border-neutral-950 bg-neutral-900"
                    style={{ marginLeft: i === 0 ? 0 : "-0.75rem", zIndex: proofThumbs.length - i }}
                  >
                    <Image
                      src={project.image!}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </span>
                ))}
              </span>
            )}
            <span>
              <span className="text-brass-400">{proofStat.value}</span> {proofStat.label.toLowerCase()}
            </span>
          </p>
        )}
      </div>

      {vsl.show && vsl.src && (
        <div className="ds-container mt-14 md:mt-20">
          <figure className="mx-auto max-w-4xl">
            <div className="ds-cut ds-cut--lg border border-white/10 bg-black p-1.5 md:p-2">
              <video
                src={vsl.src}
                poster={vsl.poster || undefined}
                controls
                preload="none"
                playsInline
                className="aspect-video w-full bg-black"
                aria-label={vsl.title || "Video from Lee Enterprises Unlimited"}
              />
            </div>
            {vsl.title && (
              <figcaption className="mt-3 text-center text-sm text-neutral-400">{vsl.title}</figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
