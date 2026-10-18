"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqAccordionProps {
  items: readonly { question: string; answer: string }[];
  /** Prefix for each trigger and panel id; unique per page. */
  idPrefix: string;
  /** The chevron's text colour, the page's accent. */
  chevronClassName: string;
}

/**
 * The question list in the /how-it-works FAQ: one answer open at a time, the
 * first open on load. Each question is an h3 wrapping a button, so it stays in
 * the heading outline while the button carries the expanded state. It is the
 * only client code in the FAQ section; the heading and copy around it are
 * rendered on the server.
 */
export function FaqAccordion({ items, idPrefix, chevronClassName }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(15_35_70/0.18)]">
      {items.map(({ question, answer }, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-panel-${index}`}
                id={`${idPrefix}-trigger-${index}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-400"
              >
                <span className="font-semibold text-white">{question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 ${chevronClassName} transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${idPrefix}-panel-${index}`}
              role="region"
              aria-labelledby={`${idPrefix}-trigger-${index}`}
              hidden={!isOpen}
              className="px-6 pb-5"
            >
              <p className="leading-relaxed text-neutral-400">{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
