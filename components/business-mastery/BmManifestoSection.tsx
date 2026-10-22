import { bmTenets, bmTenetsIntro } from "@/data/business-mastery";
import { SectionHead } from "@/components/ui/ds";

/**
 * Section 5 — our core tenets: Speed, Money In, For Free.
 *
 * WHAT IS OFF THIS SECTION, and kept in the data file on the owner's terms
 * (taking a block off a page is not the same decision as deleting the words):
 *
 *  - The manifesto, `bmCoreBelief` (off 2026-09-29, at the owner's request):
 *    the "What we believe" eyebrow, "Nobody builds something great alone.",
 *    its message, the lead-in line and the glowing "NETWORK." payoff. It was
 *    this section's first movement, over the tenets, since the two merged on
 *    2026-09-28 (BmTenetsSection.tsx was deleted then; this file kept the
 *    manifesto's name). Putting it back means the tenets' heading steps back
 *    down to an h3 under the manifesto's h2, and their titles to h4.
 *  - The pivot, `bmTransition` (off 2026-09-13). First person and about the
 *    founder's story, which is not on this page; check that before restoring.
 *  - The clarifier, `bmCoreBelief.clarifier` (off 2026-09-15), and the Core
 *    Philosophy block, `bmCoreBelief.philosophyTitle` and `.philosophy` (off
 *    2026-09-07). Both sat in the manifesto, so both come back with it.
 *
 * The tenets are numbered rows rather than cards (2026-09-29): a large
 * numeral beside each, hairlines between, each row rising in as it scrolls
 * into view (`data-reveal`, scroll-driven, still under reduced motion). Since
 * 2026-10-22 the heading is the shared section head and the numerals and
 * titles are the site's display face, the numerals in the accent like the
 * stat tiles' figures.
 *
 * Server component, no client boundary. The only motion is CSS.
 */
export function BmManifestoSection() {
  return (
    <section aria-labelledby="bm-tenets-title" className="ds-section">
      <div className="ds-container">
        <SectionHead
          center
          id="bm-tenets-title"
          title={bmTenetsIntro.heading}
          sub={bmTenetsIntro.description}
          className="mb-10 md:mb-14"
        />

        <ol className="mx-auto max-w-4xl">
          {bmTenets.map((tenet) => (
            <li
              key={tenet.id}
              className="grid grid-cols-[4.5rem_1fr] items-center gap-x-6 border-t border-white/10 py-8 last:border-b sm:grid-cols-[7rem_1fr] md:grid-cols-[9rem_1fr] md:gap-x-10 md:py-10"
              data-reveal
            >
              <span
                className="bm-tenet-num text-6xl sm:text-8xl md:text-[7.5rem]"
                aria-hidden="true"
              >
                {String(tenet.number).padStart(2, "0")}
              </span>
              <div>
                <h3 className="ds-h3">{tenet.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-neutral-300 text-pretty">
                  {tenet.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
