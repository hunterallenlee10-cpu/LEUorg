import { FaqAccordion } from "@/components/lee-systems/FaqAccordion";
import { leeSystemsFaqs } from "@/data/lee-systems";

/**
 * The /how-it-works FAQ: the automation and websites pages' questions in one
 * list (`leeSystemsFaqs`), since those pages folded into this one
 * (2026-09-29). The page also emits the list as FAQPage structured data.
 */
export function LeeSystemsFAQSection() {
  return (
    <section id="faq" className="relative isolate py-20 md:py-28">
      <div className="section-container">
        {/* The FAQ opens after the onboarding steps; the hairline gives the
            page somewhere to breathe before the questions. */}
        <div
          aria-hidden="true"
          className="mx-auto mb-14 h-px max-w-md bg-gradient-to-r from-transparent via-brass-400/30 to-transparent"
        />

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="ds-eyebrow ds-eyebrow--center mb-4">FAQs</p>
          <h2 className="heading-lg text-white">Frequently Asked Questions</h2>
        </div>

        <FaqAccordion
          items={leeSystemsFaqs}
          idPrefix="faq"
          chevronClassName="text-brass-400"
        />
      </div>
    </section>
  );
}
