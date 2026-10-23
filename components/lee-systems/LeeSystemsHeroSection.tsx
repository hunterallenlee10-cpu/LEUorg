import { HeroStill } from "@/components/lee-systems/HeroStill";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { leeSystems, leeSystemsAnchors } from "@/data/lee-systems";

/**
 * The LEU main page hero, over a still of a laptop at night
 * (HeroStill; the owner's pick, 2026-09-30, which replaced the Signal Routes
 * lines, was a loop of it until 2026-10-07). The copy answers "what's in it for me": the owner's
 * headline in three beats, the last in brass, then "Let AI make you money."
 * and how, in one sentence. One button: the free call, which scrolls to the
 * form.
 *
 * From md up the copy sits on the left, where the shade is darkest, with the
 * laptop on the right. On a phone the picture is a band across the top and
 * the copy starts where it fades to black, so neither covers the other.
 */
export function LeeSystemsHeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroStill />
      <div className="leu-grain" aria-hidden="true" />

      <div className="section-container relative z-10 flex flex-col pb-20 pt-60 sm:pt-80 md:min-h-[40rem] md:justify-center md:py-28 lg:min-h-[44rem]">
        <div className="max-w-xl">
          <div className="mb-8">
            <p className="text-lg font-bold tracking-[0.2em] text-white uppercase">
              How it works
            </p>
          </div>

          <h1 className="heading-xl mb-6 text-white lg:text-[4.5rem]">
            {leeSystems.headline.map((beat) => (
              <span key={beat} className="block">
                {beat}
              </span>
            ))}
            <span className="block text-brass-300">{leeSystems.headlineAccent}</span>
          </h1>

          <p className="mb-2 text-xl font-semibold text-white md:text-2xl">
            {leeSystems.heroLine}
          </p>
          <p className="mb-10 max-w-lg text-lg leading-relaxed text-neutral-300">
            {leeSystems.heroHow}
          </p>

          {/* The lit gold button the page's other closing asks use, a size up:
              full width up to 20rem on a phone, its own width from 640px. */}
          <BookCallLink
            variant="glow"
            href={`#${leeSystemsAnchors.form}`}
            arrow
            className="h-14 w-full max-w-xs px-10 text-lg sm:w-auto sm:max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
