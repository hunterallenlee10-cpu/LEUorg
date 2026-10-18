import { MissedRevenueCalculator } from "@/components/sections/MissedRevenueCalculator";

/**
 * "See what you're missing" (the black-and-gold redesign, 2026-10-18): the
 * missed-revenue calculator, its logic unchanged, under a section heading of
 * its own. The card still ends with the line saying it's an estimate, not a
 * quote or a promise of results.
 */
export function HomeCalculator() {
  return (
    <section aria-labelledby="home-calc-title" className="ds-section">
      <div className="ds-container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <p className="ds-eyebrow">Missed revenue</p>
          <h2 id="home-calc-title" className="ds-h2 ds-h2--sm mt-4">
            See what you&apos;re <span className="ds-accent">missing</span>
          </h2>
          <p className="ds-sub mt-6 max-w-md">
            Switch on what fits your business, then slide in your numbers. It&apos;s quick math, not a
            quote.
          </p>
        </div>
        <div data-reveal>
          <MissedRevenueCalculator headless />
        </div>
      </div>
    </section>
  );
}
