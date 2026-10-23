import { Check, Clock, ShieldCheck, X, Zap } from "lucide-react";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { CallOrEmailLine } from "@/components/lee-systems/CallOrEmailLine";
import { DoItYourWayButton } from "@/components/lee-systems/DoItYourWayButton";
import {
  choiceByHand,
  choiceWithSystems,
  leeSystemsAnchors,
  pricingPromise,
} from "@/data/lee-systems";

/**
 * The same six jobs done by hand and done by the systems: row n of one card
 * is row n of the other. The right-hand list only states what the site
 * already says the systems do.
 */
const byHand = choiceByHand;

const withSystems = choiceWithSystems;

const TAKE_ACTION_ID = "ls-take-action";

/**
 * "The choice is yours", after The Real World's section of that name (the
 * owner's reference, 2026-09-29): a dim "Do nothing" card beside a lit
 * "Take action" card. It is the How It Works page's closing pitch, and its
 * button scrolls to the form that follows it. The fine print is
 * the owner's pricing promise (`pricingPromise`).
 *
 * Under each heading is the owner's figure for that path: doing nothing
 * costs tens of thousands, in red, and taking action can make tens of
 * thousands, in gold (the owner's figures, 2026-09-29; the loss matched to
 * the gain at his ask, 2026-09-30). They are ranges, not results: the gain says "could",
 * and neither names a client. The "Do nothing" card's "Lose leads to whoever
 * answers first" sits in the row the other card uses for its terms.
 *
 * From 640px the cards share one set of rows (subgrid), so their dividers,
 * lists and buttons line up across the pair.
 */
export function LeeSystemsChoiceSection() {
  const [leadTerm, ...otherTerms] = pricingPromise;

  return (
    <section
      aria-labelledby="ls-choice-title"
      className="relative isolate overflow-hidden py-20 md:py-28"
    >
      <div className="absolute inset-0 -z-10 section-fade" aria-hidden="true">
        <div className="absolute right-1/4 top-1/2 h-[32rem] w-[32rem] max-w-[85vw] -translate-y-1/2 translate-x-1/2 rounded-full bg-brass-400/[0.10] blur-3xl" />
      </div>

      <div className="section-container">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-14">
          <p className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:text-sm">
            Your move
          </p>
          <h2 id="ls-choice-title" className="heading-lg mt-5 text-white">
            The choice is yours.
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center sm:row-span-5 sm:grid sm:grid-rows-subgrid sm:gap-y-0 sm:p-8">
            <div>
              <Clock
                className="mx-auto h-9 w-9 text-neutral-400"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-2xl font-semibold text-neutral-200">
                Do nothing
              </h3>
              <p className="mt-1 text-sm text-neutral-400">Keep doing it by hand</p>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p>
                <span
                  aria-hidden="true"
                  className="ls-loss text-4xl font-bold sm:text-5xl"
                >
                  −$10,000s
                </span>
                <span className="sr-only">Tens of thousands of dollars</span>
                <span className="mt-2 block text-sm text-neutral-400">
                  lost to missed leads
                </span>
              </p>
            </div>
            <ul className="mx-auto mt-6 space-y-3 text-left text-sm text-neutral-400">
              {byHand.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            {/* The row the other card uses for its terms. */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-balance font-semibold text-neutral-400">
                Lose leads to whoever answers first
              </p>
            </div>
            <div className="mt-8">
              <DoItYourWayButton nudgeId={TAKE_ACTION_ID} />
            </div>
          </div>

          <div
            id={TAKE_ACTION_ID}
            className="flex flex-col rounded-2xl border border-brass-400/40 bg-[radial-gradient(120%_70%_at_50%_0%,rgb(var(--gold)/0.09),transparent_65%)] p-6 text-center shadow-[0_0_80px_-30px_rgb(var(--gold)/0.3)] light:bg-[#fff] light:bg-[radial-gradient(120%_70%_at_50%_0%,rgb(var(--gold)/0.07),transparent_65%)] light:shadow-[0_24px_60px_-28px_rgb(23_71_154/0.3)] sm:row-span-5 sm:grid sm:grid-rows-subgrid sm:gap-y-0 sm:p-8"
          >
            <div>
              <Zap
                className="mx-auto h-9 w-9 text-brass-300"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Take action
              </h3>
              <p className="mt-1 text-sm text-brass-200/80">Let AI handle it</p>
            </div>
            <div className="mt-6 border-t border-brass-400/20 pt-6">
              <p>
                <span
                  aria-hidden="true"
                  className="ls-price text-4xl font-bold sm:text-5xl"
                >
                  +$10,000s
                </span>
                <span className="sr-only">Tens of thousands of dollars</span>
                <span className="mt-2 block text-sm text-neutral-400">
                  you could win from the same leads
                </span>
              </p>
            </div>
            <ul className="mx-auto mt-6 space-y-3 text-left text-sm text-neutral-200">
              {withSystems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-brass-300"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-brass-400/20 pt-5">
              <p className="flex items-center justify-center gap-2 font-semibold text-brass-200">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                {leadTerm}
              </p>
              <p className="mt-2 text-balance text-xs leading-relaxed text-neutral-400">
                {otherTerms.map((term, i) => (
                  <span key={term}>
                    {/* The dot rides with the term before it, so a wrapped line never
                        starts with one. */}
                    {i > 0 && " "}
                    <span className="whitespace-nowrap">
                      {term}
                      {i < otherTerms.length - 1 && " ·"}
                    </span>
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-8">
              <BookCallLink
                variant="glow"
                href={`#${leeSystemsAnchors.form}`}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <CallOrEmailLine className="mt-10 text-center" />
      </div>
    </section>
  );
}
