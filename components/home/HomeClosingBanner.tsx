import { BookCallLink } from "@/components/ui/BookCallLink";

/**
 * The closing banner (the black-and-gold redesign, 2026-10-18, after
 * university.com's full-width last call, without its "limited spaces"
 * line): the owner's line and the gold call, on a cut-corner dark band with
 * a gold edge.
 */
export function HomeClosingBanner() {
  return (
    <section aria-labelledby="home-closing-title" className="ds-section--tight">
      <div className="ds-container">
        <div className="ds-cut ds-cut--lg bg-[var(--ds-gold)] p-px" data-reveal>
          <div className="ds-band ds-cut ds-cut--lg relative isolate overflow-hidden px-6 py-16 text-center md:px-12 md:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 -z-10 h-full bg-[radial-gradient(60%_80%_at_50%_110%,rgb(201_162_75/0.22),transparent)]"
            />
            <h2 id="home-closing-title" className="ds-h2 mx-auto max-w-4xl">
              Every missed lead is <span className="ds-accent">lost money.</span>
            </h2>
            <div className="mt-10 flex justify-center">
              <BookCallLink variant="hero" arrow className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
