import { bmProofPoints, bmProofStatement } from "@/data/business-mastery";

/**
 * Section 4 — the track record, as three figures and nothing else.
 *
 * It was the foot of the manifesto (then slot 2) until 2026-09-28, when the
 * owner had the page reordered so what members get comes before the
 * philosophy, and asked for the figures as their own short section here:
 * after the visitor has seen the offer and themselves in it, before the
 * belief and the member offer. It is still read before the application form,
 * which is the reason the claim was placed early in the first place
 * (docs/BUSINESS-MASTERY.md §3).
 *
 * No heading and no eyebrow, on purpose. Anything above the figures would be
 * a line the owner never wrote, and the three labels already say what each
 * figure counts. That is also why the section is short: it is the row and its
 * padding.
 *
 * Since 2026-10-22 the figures are the homepage's stat tiles (`.ds-stats`):
 * the same three figures in the same cut-corner band, so the two pages show
 * the record the same way.
 *
 * Server component, nothing interactive.
 */
export function BmProofSection() {
  return (
    <section className="pb-4">
      <div className="ds-container">
        {/* THE SENTENCE STILL SHIPS, VERBATIM. `bmProofStatement` is rendered
            `sr-only` and the tiles are `aria-hidden`, so a screen reader gets
            the owner's line exactly as written and nobody hears the figures
            twice. The words in the tiles are that sentence's own (see the
            note on `bmProofPoints`), so change the two together or not at
            all.

            The figures are numbers at the owner's request (2026-09-13): "50+",
            "1,000+" and "$150,000+" replaced "dozens", "hundreds" and
            "thousands upon thousands", the owner's own figures both times (see
            data/business-mastery.ts).

            In a `dl` the `dt` must precede its `dd`, so the label comes first
            in the DOM and `order-first` puts the figure above it. */}
        <p className="sr-only">{bmProofStatement}</p>
        <dl aria-hidden="true" className="ds-stats ds-cut" data-reveal>
          {bmProofPoints.map((point) => (
            <div key={point.label} className="ds-stat">
              <dt className="ds-stat-label">{point.label}</dt>
              <dd className="ds-stat-value order-first">{point.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
