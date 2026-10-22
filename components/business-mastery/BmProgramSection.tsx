import { ArrowRight, BookOpen } from "lucide-react";
import {
  bmPillars,
  bmProgram,
  bmPageAction,
} from "@/data/business-mastery";
import { BmProgramShowcase } from "@/components/business-mastery/BmProgramShowcase";
import { pillarIcons } from "@/components/business-mastery/bmPillarIcons";
import { SectionHead } from "@/components/ui/ds";

/**
 * Section 3 — what membership actually is, then the page's second "Apply".
 *
 * Six pillar cards until 2026-09-29, when the owner asked for less of a
 * cards-on-cards page: from lg up the pillars are an auto-stepping list beside
 * one large panel (BmProgramShowcase); below lg, where a list of tabs would
 * hide five of six descriptions behind taps, they are a plain numbered list
 * with hairlines between, no boxes. Same content either way.
 *
 * It sat at slot 2 until "The world is about to change" (BmShiftSection) took
 * that slot on 2026-09-29, and handed that slot its glow: the page alternates
 * one, and 3 is a plain slot.
 *
 * The Tools & Resources pillar (the one carrying a bullet list) came off at
 * the owner's request (2026-09-27). Its content is intact in the data file;
 * any pillar with `items` is still skipped here. `bmProgram.closer` came off
 * on 2026-09-07 and is intact in the data file too.
 *
 * The "Apply now" button moved here from "Who this is for" when that section
 * folded into BmShiftSection: this is now the first point where a visitor has
 * seen why, what, and who, and it keeps the owner's wording and look
 * (2026-09-28). A plain anchor to the form, like the hero's.
 *
 * In the site's design system since 2026-10-22: the shared section head
 * (mono eyebrow, display headline, line under it), square icon boxes and mono
 * numbers like the homepage's service cards, and the hero's `.btn-hero` with
 * the site's stepping arrow in place of the uppercase glowing button.
 */
export function BmProgramSection() {
  const pillars = bmPillars.filter((pillar) => !pillar.items);

  return (
    <section aria-labelledby="bm-program-title" className="ds-section">
      <div className="ds-container">
        <SectionHead
          center
          id="bm-program-title"
          eyebrow="What Business Mastery actually is"
          title={bmProgram.heading}
          sub={bmProgram.description}
          className="mb-12 lg:mb-16"
        />

        <div className="hidden lg:block" data-reveal>
          <BmProgramShowcase pillars={pillars} />
        </div>

        <ol className="mx-auto max-w-2xl lg:hidden">
          {pillars.map((pillar, i) => {
            const Icon = pillarIcons[pillar.id] ?? BookOpen;
            return (
              <li
                key={pillar.id}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/10 py-6 last:border-b"
                data-reveal
              >
                <span className="grid h-12 w-12 place-items-center border border-brass-400/40 text-brass-400">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] tabular-nums text-neutral-400" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="ds-h3 mt-1.5">{pillar.title}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-300">{pillar.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex justify-center md:mt-16">
          <a href={bmPageAction.href} className="btn-hero group w-full sm:w-auto">
            {/* "Apply now" here, at the owner's request (2026-09-28); the
                hero keeps "Apply to join". Once joining is by link, both
                follow `bmPageAction`. */}
            {bmPageAction.label === "Apply to join"
              ? "Apply now"
              : bmPageAction.label}
            <ArrowRight
              className="h-5 w-5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
