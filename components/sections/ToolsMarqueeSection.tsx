import { site, type Tool } from "@/data/site";

/**
 * The moving strip of tool logos under the homepage hero, in the style the
 * owner pointed to (synvolo.com): two rows of pills sliding in opposite
 * directions, faded at the edges. It replaced the "No surprises on price."
 * band on the homepage on 2026-09-28; that band still runs on the industry
 * pages.
 *
 * The tools are `site.tools` in data/site.ts. The logos are symbols in
 * public/tools/sprite.svg, drawn through `<use>` so they cost one cached file
 * rather than markup on every page load, and take their colour from the pill.
 *
 * Each row is its list twice, and the track slides by exactly one copy, so
 * the loop has no seam. Screen readers get the first copy only. Under
 * prefers-reduced-motion the rows stop and wrap instead (`.tools-*` in
 * app/globals.css).
 */
export function ToolsMarqueeSection() {
  const rows = site.tools.filter((row) => row.length > 0);
  if (rows.length === 0) return null;

  return (
    <section
      aria-labelledby="tools-title"
      className="ds-section relative isolate overflow-hidden"
    >
      {/* Restyled in the black-and-gold design system (2026-10-18): the
          section heading pattern, square pills; every tool is kept. */}
      <div className="ds-container mb-12 flex flex-col items-center gap-4 text-center" data-reveal>
        <p className="ds-eyebrow ds-eyebrow--center">Integrations</p>
        <h2 id="tools-title" className="ds-h2 max-w-4xl text-[clamp(2rem,4.4vw,3.5rem)]">
          Built to work with{" "}
          <span className="ds-accent">the tools you already use.</span>
        </h2>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="tools-row">
            <div
              className={`tools-track ${i % 2 === 1 ? "tools-track--reverse" : ""}`}
            >
              <ToolList tools={row} />
              <ToolList tools={row} hidden />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolList({ tools, hidden = false }: { tools: Tool[]; hidden?: boolean }) {
  return (
    <ul className="tools-list" aria-hidden={hidden || undefined}>
      {tools.map(({ name, icon }) => (
        <li key={name} className="tools-pill">
          <svg aria-hidden="true" focusable="false" className="h-[1.375rem] w-[1.375rem] shrink-0">
            <use href={`/tools/sprite.svg#${icon}`} />
          </svg>
          {name}
        </li>
      ))}
    </ul>
  );
}
