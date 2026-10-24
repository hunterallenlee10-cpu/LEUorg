import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  industryInSentence,
  leeSystemsAnchors,
  leeSystemsIndustries,
  otherIndustries,
} from "@/data/lee-systems";
import { serviceGroups, servicePath } from "@/data/services";
import { DemoVideo } from "@/components/services/demo/DemoVideo";

type IndustryId = (typeof leeSystemsIndustries)[number]["id"];

/**
 * The industries whose picture is in public/lee-systems/industries/, as
 * `<id>.webp`. All six were generated on 2026-09-29 and went in on
 * 2026-10-06. A card whose id isn't listed shows its cover's brass glow
 * instead, the same glow every picture loads over.
 */
const pictured: ReadonlySet<IndustryId> = new Set<IndustryId>([
  "law-firms",
  "home-services",
  "real-estate",
  "fitness",
  "dealerships",
  "restaurants",
]);

/**
 * "Who we help" on /how-it-works: example industries as picture-led cards,
 * after The Real World's campus cards (the owner's reference, 2026-09-29):
 * a picture with the industry's name set over it, its one-line summary, and
 * a small uppercase "See examples", after The Real World's "Explore campus".
 * The heading frames them as examples, not the only businesses served (the
 * owner's request, 2026-09-29). Under the cards, a callout says any business
 * is welcome (2026-10-04), naming the services rather than more industries,
 * and links to the page's form.
 *
 * Each industry's examples stay on its card behind "See examples", a native
 * <details> (so no client JS), and the shared `name` keeps one open at a
 * time. Cards align to the top of their row, so opening one doesn't stretch
 * the others; from two columns up every summary is held to three lines'
 * height (none is longer), so closed cards match.
 * Each card keeps its industry's id, so /how-it-works#real-estate lands on it,
 * and the retired law firm and home services pages redirect to theirs.
 *
 * The pictures (public/lee-systems/industries/, 800 x 450 WebP) were
 * generated for this section: empty rooms and buildings, no people, no
 * signage, nothing that stands for a client or a result. They are decorative
 * (empty alt), since the name is set over each one as text. Under each
 * picture is a brass glow, its position stepped card to card, which is what
 * shows while a picture loads or before it is listed in `pictured`.
 */
export function LeeSystemsIndustriesSection() {
  return (
    <section id="industries" className="relative isolate py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="svc-kicker">
            Who we help
          </p>
          <h2 className="heading-lg text-white">
            For example, we help businesses like these
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {leeSystemsIndustries.map(({ id, name, summary, examples }, i) => {
            const audience = industryInSentence(name);
            return (
              <div
                key={id}
                id={id}
                className="group/card overflow-hidden rounded-xl border border-white/10 bg-[var(--svc-surface)] transition-colors duration-300 hover:border-brass-400/40 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(var(--ink)/0.18)]"
              >
                <div
                  className="relative aspect-[2/1] overflow-hidden md:aspect-video [--ind-glow:rgb(var(--gold)/0.13)] light:bg-[#172554] light:[--ind-glow:rgb(var(--gold)/0.2)]"
                  style={{
                    backgroundImage: `radial-gradient(60% 85% at ${22 + i * 11}% 30%, var(--ind-glow), transparent 70%)`,
                  }}
                >
                  {pictured.has(id) && (
                    // The picture as a 5-second loop (public/demos/video/, made
                    // from it in Higgsfield), still under reduced motion.
                    <DemoVideo
                      src={`/demos/video/${id}.mp4`}
                      poster={`/demos/video/${id}.webp`}
                      className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover/card:scale-[1.04]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[var(--svc-surface)] via-[var(--svc-surface)]/25 to-transparent light:from-[#0f1a2e]/90 light:via-[#0f1a2e]/20"
                  />
                  <h3
                    className="absolute inset-x-6 bottom-1 text-[2rem] font-bold leading-[1.05] tracking-tight text-brass-200 [text-shadow:0_2px_16px_rgb(0_0_0/0.85)] light:text-[#f6f7f9]"
                  >
                    {name}
                  </h3>
                </div>

                <div className="bg-[radial-gradient(90%_80%_at_0%_100%,rgb(var(--gold)/0.08),transparent_70%)] light:bg-none px-6 pt-3 pb-3">
                  <p className="leading-relaxed text-neutral-300 md:min-h-[3lh]">
                    {summary}
                  </p>

                  <details name="industry-examples" className="group/examples mt-2">
                    <summary className="inline-flex min-h-11 w-fit cursor-pointer list-none items-center gap-1.5 rounded text-xs font-semibold tracking-[0.18em] text-brass-300 uppercase transition-colors hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300 [&::-webkit-details-marker]:hidden">
                      <span className="group-open/examples:hidden">See examples</span>
                      <span className="hidden group-open/examples:inline">
                        Hide examples
                      </span>
                      <span className="sr-only"> for {audience}</span>
                      <ChevronDown
                        className="h-3.5 w-3.5 transition-transform duration-200 group-open/examples:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>

                    <ul className="mt-1 mb-3 space-y-2.5 border-t border-white/10 pt-4">
                      {examples.map((example) => (
                        <li
                          key={example}
                          className="flex items-start gap-2.5 text-sm text-neutral-400"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass-400"
                          />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-brass-400/25 bg-[var(--svc-surface)] light:bg-[#fff] light:shadow-[0_24px_60px_-28px_rgb(var(--ink)/0.22)] px-6 py-10 text-center md:px-14 md:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,rgb(var(--gold)/0.16),transparent_70%)] light:opacity-50"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass-300/70 to-transparent"
          />

          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.18em] text-brass-300 uppercase">
              {otherIndustries.eyebrow}
            </p>
            <h3 className="mx-auto mt-4 max-w-2xl text-3xl leading-tight font-bold tracking-tight text-white md:text-[2.75rem]">
              {otherIndustries.title}{" "}
              <span className="bg-gradient-to-b from-brass-200 to-brass-400 bg-clip-text text-transparent">
                {otherIndustries.titleAccent}
              </span>
            </h3>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-neutral-300 md:text-lg">
              {otherIndustries.body}
            </p>

            <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
              {serviceGroups.map(({ slug, name }) => (
                <li key={slug} className="flex">
                  <Link
                    href={servicePath(slug)}
                    className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-neutral-200 transition-colors hover:border-brass-400/50 hover:text-white motion-reduce:transition-none"
                  >
                    {name}
                  </Link>
                </li>
              ))}
              <li className="rounded-full border border-brass-400/40 bg-brass-400/10 px-4 py-1.5 text-sm font-medium text-brass-200">
                <span aria-hidden="true">+ </span>
                {otherIndustries.capabilitiesMore}
              </li>
            </ul>

            <a
              href={`#${leeSystemsAnchors.form}`}
              className="btn-ls-secondary group mt-9 inline-flex min-h-11 items-center gap-2"
            >
              {otherIndustries.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
