import { Check, X } from "lucide-react";
import { choiceByHand, choiceWithSystems, pricingPromise } from "@/data/lee-systems";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { SectionHead } from "@/components/ui/ds";

/**
 * "Two paths" (the black-and-gold redesign, 2026-10-18, after
 * university.com's): doing it all yourself on the left, working with LEU on
 * the right, a VS badge between. The lists are the ones "The choice is
 * yours" on /how-it-works uses (data/lee-systems.ts), so the two pages say
 * the same thing. Side by side from `md`, stacked below with the badge
 * between the cards.
 */
export function HomeTwoPaths() {
  return (
    <section aria-labelledby="home-paths-title" className="ds-section">
      <div className="ds-container">
        <SectionHead
          center
          id="home-paths-title"
          eyebrow="Choose your path"
          title={
            <>
              Two paths. <span className="ds-accent">One choice.</span>
            </>
          }
        />

        {/* The fork: one line splitting to the two paths (decorative). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 70"
          preserveAspectRatio="none"
          className="mx-auto mt-10 hidden h-16 w-full max-w-[44rem] md:block"
        >
          <path d="M400 0 V 26 M400 26 H 120 V 66 M400 26 H 680 V 66" fill="none" stroke="rgb(var(--ink) / 0.25)" strokeWidth="2" />
          <path d="M400 26 H 680 V 66" fill="none" stroke="var(--ds-gold)" strokeWidth="2" />
          <path d="M112 58 L120 68 L128 58 M672 58 L680 68 L688 58" fill="none" stroke="var(--ds-gold)" strokeWidth="2" />
        </svg>

        <div className="relative mx-auto mt-10 grid max-w-5xl gap-4 md:mt-2 md:grid-cols-2 md:gap-20">
          {/* Doing it yourself */}
          <article
            aria-labelledby="path-diy-title"
            className="ds-cut flex flex-col border border-white/10 bg-white/[0.03] p-7 md:p-10"
            data-reveal
          >
            <p className="font-mono text-xs tracking-[0.3em] text-neutral-400">THE OLD WAY</p>
            <h3 id="path-diy-title" className="ds-h3 mt-3 text-neutral-200">
              Doing it all yourself
            </h3>
            <ul className="mt-7 space-y-3.5">
              {choiceByHand.map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-300">
                  <X aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-auto border-t border-white/10 pt-6 font-semibold text-neutral-400 md:mt-8">
              Lose leads to whoever answers first.
            </p>
          </article>

          {/* The badge: between the columns on wide screens, between the
              stacked cards on a phone. */}
          <div
            aria-hidden="true"
            className="flex justify-center md:absolute md:top-1/2 md:left-1/2 md:z-10 md:-translate-x-1/2 md:-translate-y-1/2"
          >
            <span className="ds-vs">VS</span>
          </div>

          {/* With LEU */}
          <article
            aria-labelledby="path-leu-title"
            className="ds-card"
            data-reveal
          >
            <div className="ds-card-body p-7 md:p-10" style={{ background: "linear-gradient(180deg, rgb(var(--gold) / 0.12), transparent 55%), var(--ds-surface)" }}>
              <p className="font-mono text-xs tracking-[0.3em] text-brass-400">THE LEU WAY</p>
              <h3 id="path-leu-title" className="ds-h3 mt-3">
                Working with <span className="ds-accent">LEU</span>
              </h3>
              <ul className="ds-checks mt-7">
                {choiceWithSystems.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-white/10 pt-6 text-sm text-neutral-300">
                {pricingPromise.slice(0, 4).join(" · ")}
              </p>
              <BookCallLink arrow className="mt-6 w-full" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
