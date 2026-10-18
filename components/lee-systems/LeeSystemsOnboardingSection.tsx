"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { OnboardingDevices } from "@/components/lee-systems/OnboardingDevices";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { leeSystemsAnchors, onboardingSteps } from "@/data/lee-systems";

const steps = onboardingSteps;

/**
 * "Onboarding process": the three steps down one side, with a laptop and an
 * iPhone on the other acting out whichever step is current (the owner's
 * brief, 2026-09-29). Used by the main page and the industry pages.
 *
 * What makes a step current. On desktop the devices stay pinned while the
 * steps scroll past, and the step crossing the middle of the viewport is the
 * current one. On smaller screens the devices sit above the steps, not
 * pinned, so they cycle through the steps on a timer instead, and the list
 * lights the step they are showing. Under prefers-reduced-motion the timer
 * does not run: the devices hold the first step and the list reads as plain
 * text.
 *
 * Under the steps, "Book a free call" (the owner's request, 2026-10-06), the
 * hero's lit gold button, scrolling down to the page's form like the others
 * in the page's body.
 */
export function LeeSystemsOnboardingSection() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    const start = () => {
      stop();
      if (desktop.matches) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                setActive(Number((entry.target as HTMLElement).dataset.step));
              }
            }
          },
          { rootMargin: "-45% 0px -45% 0px" }
        );
        stepRefs.current.forEach((el) => el && observer.observe(el));
        stop = () => observer.disconnect();
      } else if (!reduce.matches) {
        const id = window.setInterval(() => setActive((a) => (a + 1) % steps.length), 4500);
        stop = () => window.clearInterval(id);
      }
    };

    start();
    desktop.addEventListener("change", start);
    reduce.addEventListener("change", start);
    return () => {
      stop();
      desktop.removeEventListener("change", start);
      reduce.removeEventListener("change", start);
    };
  }, []);

  return (
    <section className="relative isolate py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-8">
          <p className="ds-eyebrow ds-eyebrow--center mb-4">Onboarding process</p>
          <h2 className="heading-lg mb-4 text-white">Audit. Build. Take off.</h2>
          <p className="text-lg leading-relaxed text-neutral-400">
            Three steps from the first call to a business that answers every
            lead without you chasing it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <div className="lg:sticky lg:top-[calc(50vh-15rem)] lg:flex lg:h-[30rem] lg:items-center">
              <OnboardingDevices active={active} />
            </div>
          </div>

          <ol className="lg:order-1">
            {steps.map((step, i) => {
              const isActive = i === active;
              const isLast = i === steps.length - 1;
              return (
                <li
                  key={step.title}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-step={i}
                  className="relative flex gap-6 pb-12 last:pb-0 lg:min-h-[60vh] lg:items-center lg:pb-0"
                >
                  {/* The rail: lit up to and including the current step. */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-12 bottom-0 left-6 w-px -translate-x-1/2 bg-white/10 lg:top-[calc(50%+1.5rem)] lg:bottom-[calc(-50%+1.5rem)]"
                    >
                      <span
                        className={clsx(
                          "block h-full origin-top bg-gradient-to-b from-brass-300 to-brass-400/60 transition-transform duration-700",
                          i < active ? "scale-y-100" : "scale-y-0"
                        )}
                      />
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className={clsx(
                      "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full border text-sm font-semibold tabular-nums transition-colors duration-500 lg:self-center",
                      i <= active
                        ? "border-brass-300 bg-neutral-950 text-brass-200"
                        : "border-white/15 bg-neutral-950 text-neutral-400"
                    )}
                  >
                    {isActive && (
                      <span className="ls-status absolute -inset-1.5 rounded-full border border-brass-300/50" />
                    )}
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div
                    className={clsx(
                      "transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-60 motion-reduce:opacity-100"
                    )}
                  >
                    <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-brass-300 uppercase">
                      Step {i + 1}
                    </p>
                    <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                    <p className="mb-5 max-w-lg leading-relaxed text-neutral-300">{step.body}</p>
                    <ul className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-brass-400/30 px-3 py-1 text-xs font-semibold text-brass-200"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 flex justify-center lg:mt-16">
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
