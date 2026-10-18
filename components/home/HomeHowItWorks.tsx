import clsx from "clsx";
import { onboardingSteps } from "@/data/lee-systems";
import { OnboardingDevices } from "@/components/lee-systems/OnboardingDevices";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { SectionHead } from "@/components/ui/ds";

/**
 * "How it works" on the homepage (the black-and-gold redesign, 2026-10-18,
 * after university.com's alternating rows): Audit, Build and Take off, one
 * row each, the device scene from /how-it-works on one side and the step on
 * the other, swapping sides row to row. The middle row sits a step off the
 * page colour.
 */
export function HomeHowItWorks() {
  return (
    <section aria-labelledby="home-how-title" className="ds-section pb-0">
      <div className="ds-container">
        <SectionHead
          center
          id="home-how-title"
          eyebrow="How it works"
          title={
            <>
              Three steps. <span className="ds-accent">Then it runs.</span>
            </>
          }
        />
      </div>

      <ol className="mt-12 lg:mt-16">
        {onboardingSteps.map((step, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={step.title} className={clsx("py-14 md:py-20", flip && "ds-alt ds-cut ds-cut--lg")}>
              <div className="ds-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={clsx(flip && "lg:order-2")} data-reveal>
                  <p className="font-mono text-sm tracking-[0.3em] text-brass-400">STEP 0{i + 1}</p>
                  <h3 className="ds-h2 mt-3">{step.title}</h3>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-300">{step.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-brass-400/40 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-brass-400"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {i === 0 && <BookCallLink arrow className="mt-8" />}
                </div>
                <div className={clsx(flip && "lg:order-1")} data-reveal>
                  <OnboardingDevices active={i} single />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
