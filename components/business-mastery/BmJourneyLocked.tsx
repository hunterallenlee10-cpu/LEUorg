import { bmJourney } from "@/data/business-mastery";
import { BmComingSoon } from "@/components/business-mastery/BmComingSoon";

/**
 * The journey while BM_JOURNEY_LOCKED is true (on the homepage since
 * 2026-09-28, right above Recent Builds): the section's presence without
 * its interaction. The owner wants the timeline visible as a thing that
 * exists rather than absent, so this renders the intro slide's identity (the
 * "A Life in Full" eyebrow, the two-line title, the description) plus a
 * chapter-count tease, with a Coming Soon marker where the timeline's "Start
 * Timeline" affordance would be. app/page.tsx swaps this for BmJourneyTimeline
 * the moment the flag flips.
 *
 * The eyebrow, title treatment, glow, and ground are copied from the
 * timeline's intro slide (BmJourneyTimeline.tsx) on purpose: unlocking should
 * read as the same section opening, not one section replacing another. The
 * neutral-950 ground is load-bearing there and stays load-bearing here: if
 * BmFinalCTASection comes back, the journey slot is what separates the black
 * offer section from the black closing CTA (see the join note in page.tsx),
 * whichever state the slot is in.
 *
 * The tease line is the owner's sentence (`bmJourney.lockedTease`, 2026-09-15).
 * It replaced a line derived from `bmChapters` (count, first title, last
 * title), so unlike that one it no longer tracks the chapter data — if the
 * chapter list changes shape, this line doesn't notice.
 *
 * The marker is the page's shared BmComingSoon, at the owner's request
 * (2026-09-13) — the badge briefly read "Locked Until Complete" behind a
 * Lock icon the same day, and that retired label survives unrendered as
 * `bmJourney.lockedLabel` so the swap back is one line here. This is not a
 * fourth BmComingSoon use: §7's three sanctioned places include the journey
 * timeline, and this placeholder IS the journey slot while it is closed —
 * same marker, different note (`lockedNote` here, `comingSoonNote` on the
 * intro slide once the timeline opens).
 */
export function BmJourneyLocked() {
  // Restyled in the black-and-gold design system (2026-10-18): the same
  // eyebrow, title, description, tease and Coming Soon marker, on a cut-corner
  // dark band. The space between "The" and "Journey" is real text now, so the
  // heading reads "The Journey" (it read "TheJourney" to screen readers and
  // search engines when the two words were only separate blocks).
  return (
    <section aria-labelledby="journey-title" className="ds-section">
      <div className="ds-container">
        <div className="ds-band ds-cut ds-cut--lg relative isolate overflow-hidden px-6 py-16 text-center md:px-12 md:py-24" data-reveal>
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -z-10 h-80 w-[48rem] max-w-[120%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(201_162_75/0.16),transparent)]"
          />
          <p className="ds-eyebrow ds-eyebrow--center">A Life in Full</p>
          <h2 id="journey-title" className="ds-h1 mt-5">
            <span className="block">The</span>{" "}
            <span className="block ds-accent">Journey</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl font-mono text-sm uppercase tracking-[0.25em] text-neutral-300 md:text-base">
            {bmJourney.description}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-neutral-400">{bmJourney.lockedTease}</p>
          <div className="mt-10">
            <BmComingSoon note={bmJourney.lockedNote} />
          </div>
        </div>
      </div>
    </section>
  );
}
