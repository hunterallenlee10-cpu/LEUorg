import { Check, Sparkles } from "lucide-react";
import {
  bmHero,
  bmHeroCopyIsConsistent,
  bmHeroTrust,
  bmPageAction,
} from "@/data/business-mastery";
import { site } from "@/data/site";
import { BmHeroBackground } from "@/components/business-mastery/BmHeroBackground";
import { ScribbleArrow } from "@/components/ui/ds";

/**
 * The page's own section grammar, used once more at the top (the owner's
 * pick on 2026-10-06, from five concepts): the pill with the gold badge that
 * opens every section below, the headline set dim-then-bright the way the
 * "why now" rows set theirs, the promise line in grey with its key phrase
 * bright, the description, the uppercase gold button the program section
 * uses, and under it a line of three facts the page already states. It
 * replaced the hairline "BUSINESS / MASTERY" masthead, the gold rule and the
 * amber promise line, which were the one part of the page that spoke a
 * different language from the rest of it. The constellation behind it is
 * unchanged.
 *
 * Still a server component. The CTA is a plain anchor: `html` carries
 * `scroll-smooth` and `scroll-padding-top: 80px` globally, so an in-page hash
 * link gets the smooth scroll and the header offset with no JS at all.
 * `BmHeroBackground` is this section's only client boundary, and it is a
 * sibling of the copy rather than a wrapper around it, so none of the words
 * cross it.
 *
 * Every sentence is `bmHero`, verbatim. The headline and the promise line
 * are set from their split forms (`manifestoLines`, `subtitleRuns`) only
 * while `bmHeroCopyIsConsistent` says those still spell the sentences; if an
 * edit ever breaks that, the whole sentences render instead. The pill's two
 * names are the program's and the company's, set here. The uppercase on the
 * button is `text-transform`, not retyped copy. The trust line is
 * `bmHeroTrust`, which documents the fact each item restates.
 *
 * Since 2026-10-22 it is set in the site's design system, like every other
 * page's hero: the tag is square and mono, the headline is the display face
 * with its second line in the accent (where it used to be dim then bright),
 * and the button is the site's `.btn-hero` between the homepage hero's
 * hand-drawn arrows, in its own case rather than uppercase. The words are
 * unchanged.
 *
 * The sizes, the rhythm and the veil behind the copy are argued in
 * app/globals.css, which owns this block's typography.
 */
export function BmHeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-80px)] items-center overflow-hidden">
      {/* A drifting network of nodes and links, with two craft crossing it and
          lighting what they pass. Geometry, palette and the reasoning behind
          each layer live with the component and with the styles in
          app/globals.css. The gold pool the previous hero used is still here —
          it is the first layer of `.bmc-field`. */}
      <BmHeroBackground />

      {/* Floor fade, so the first content section below never shows a hard
          seam. Outside the background component because it belongs to the
          join between two sections, not to the field. */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent to-neutral-950"
        aria-hidden="true"
      />

      {/* Asymmetric on purpose. MainHeader is `position: fixed`, so it
          overlays this section rather than sitting above it in flow, and a
          block centred in the section's own box is centred 40px too high --
          which puts the pill behind the header once the copy is this size.
          The extra 5rem on top is the header's own height, and it is what
          returns the block to the centre of the space a visitor can actually
          see. */}
      <div className="ds-container relative z-[2] w-full pb-16 pt-[calc(5rem+4rem)] text-center [@media(max-height:820px)]:pb-8 [@media(max-height:820px)]:pt-[calc(5rem+2rem)]">
        <div className="bmh mx-auto flex max-w-[1100px] flex-col items-center">
          {/* The same pill BmShiftSection opens with, with the names the other
              way round: here the badge carries the program, since this is its
              page, and the quiet half carries the company. */}
          <p className="bm-pill bmh-rise [animation-delay:60ms]">
            <span className="bm-pill-badge">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Business Mastery
            </span>
            <span className="pr-1">Lee Enterprises Unlimited</span>
          </p>

          {/* Each line is its own block, so the white one and the accent one
              break on their own. The space between the two spans is real
              text, so the sentence reads as one sentence to search engines
              and screen readers, not as two headings. */}
          <h1 className="ds-h1 bmh-headline bmh-rise [animation-delay:150ms]">
            {bmHeroCopyIsConsistent ? (
              <>
                <span className="block">{bmHero.manifestoLines[0]}</span>{" "}
                <span className="block ds-accent">{bmHero.manifestoLines[1]}</span>
              </>
            ) : (
              bmHero.manifesto
            )}
          </h1>

          <p className="bmh-promise bmh-rise max-w-[30em] text-neutral-300 text-balance [animation-delay:260ms]">
            {bmHeroCopyIsConsistent
              ? bmHero.subtitleRuns.map((run, i) =>
                  "strong" in run && run.strong ? (
                    <strong key={i} className="font-semibold text-white">
                      {run.text}
                    </strong>
                  ) : (
                    <span key={i}>{run.text}</span>
                  )
                )
              : bmHero.subtitle}
          </p>

          {site.businessMastery.price && (
            <p className="bmh-rise mt-3 text-base font-semibold text-white [animation-delay:320ms]">
              {site.businessMastery.price}
            </p>
          )}

          <p className="bmh-mechanism bmh-rise max-w-[36em] text-neutral-400 text-pretty [animation-delay:380ms]">
            {bmHero.description}
          </p>

          {/* The site's hero button with the homepage's hand-drawn arrows
              pointing in at it, and the twin of the one at the foot of the
              program section. */}
          <div className="bmh-cta bmh-rise flex w-full items-center justify-center gap-3 sm:w-auto sm:gap-5 [animation-delay:480ms]">
            <ScribbleArrow side="left" className="hidden sm:block" />
            <a href={bmPageAction.href} className="btn-hero w-full sm:w-auto">
              {bmPageAction.label}
            </a>
            <ScribbleArrow side="right" className="hidden sm:block" />
          </div>

          {/* A list, so a screen reader gets the three facts as three items
              rather than one run-on line. The check marks are decoration. */}
          <ul className="bmh-trust bmh-rise [animation-delay:580ms]">
            {bmHeroTrust.map((item) => (
              <li key={item}>
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-brass-400"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
