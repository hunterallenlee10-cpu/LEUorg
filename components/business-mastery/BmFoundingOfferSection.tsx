import { ShieldCheck } from "lucide-react";
import { BM_OFFER_ID, bmOffer } from "@/data/business-mastery";
import { BmApplicationForm } from "@/components/business-mastery/BmApplicationForm";
import { companyInfo } from "@/data/company";
import { site } from "@/data/site";
import { SectionHead } from "@/components/ui/ds";

/** The titles only name what each line already says. */
const afterApplySteps = [
  { title: "Apply", body: "Send your application. No payment is taken." },
  {
    title: "Personal follow-up",
    body: "Hunter reviews it and follows up personally.",
  },
  {
    title: "Get access",
    body: site.businessMastery.platform
      ? `You get access to the community on ${site.businessMastery.platform}.`
      : site.businessMastery.afterJoining,
  },
];

/**
 * Section 6 — the conversion section every CTA on the page points at. The
 * guarantee expandable is a native <details>, so it works with no JS and the
 * section stays a server component around the one client child (the form).
 *
 * tabIndex={-1} on the section: every CTA is an anchor to this id, and the
 * homepage's smoothScrollToElement pattern focuses its target for keyboard
 * users — a focusable landing target keeps hash navigation equivalent.
 *
 * In the site's design system since 2026-10-22: the shared section head, the
 * guarantee as one of the site's FAQ bars, the steps in the display face with
 * badges shaped like the site's buttons, and the form as a cut-corner card
 * like the contact form.
 */
export function BmFoundingOfferSection() {
  return (
    <section
      id={BM_OFFER_ID}
      tabIndex={-1}
      aria-labelledby="bm-offer-title"
      className="ds-section outline-none"
    >
      <div className="ds-container">
        {/* The line under the heading is how membership is paid for, and the
            price once one is set in data/site.ts. Stated up front so nobody
            applies thinking it is free. */}
        <SectionHead
          center
          id="bm-offer-title"
          eyebrow={bmOffer.eyebrow}
          title={bmOffer.heading}
          sub={
            site.businessMastery.format || site.businessMastery.price
              ? `${[site.businessMastery.format, site.businessMastery.price]
                  .filter(Boolean)
                  .join(": ")}.`
              : undefined
          }
        />

        {/* Scarcity, only when the owner states it in data/site.ts. The
            "Limited Spots" box that sat here came off on 2026-09-28 at the
            owner's request, with the homepage's "4 Spots Remain" line. Any
            wording set there must be literally true, and shows exactly once,
            here. */}
        {site.businessMastery.scarcity && (
          <p className="mt-8 text-center font-mono text-sm uppercase tracking-[0.2em] text-brass-400">
            {site.businessMastery.scarcity}
          </p>
        )}

        {/* 90-day guarantee. Native <details> keeps it dependency-free; the
            full legal terms are a Phase C gate — see docs/BUSINESS-MASTERY.md
            §6 — so the body carries the summary and points people to email
            for the details. */}
        <div className="ds-faq mx-auto mt-10 max-w-2xl" data-reveal>
          <details>
            <summary>
              <span className="flex items-center gap-3">
                <ShieldCheck
                  className="h-6 w-6 shrink-0 text-brass-400"
                  aria-hidden="true"
                />
                {bmOffer.guaranteeHeading}
              </span>
              <span className="ds-faq-icon" aria-hidden="true" />
            </summary>
            <div className="ds-faq-answer">
              <p className="text-neutral-300">{bmOffer.guaranteeSummary}</p>
              <p className="mt-4 text-sm">
                {bmOffer.guaranteeTermsNote}{" "}
                <a
                  href={`mailto:${companyInfo.contactEmail}`}
                  className="font-medium text-brass-400 underline underline-offset-4 hover:text-white"
                >
                  {companyInfo.contactEmail}
                </a>
              </p>
            </div>
          </details>
        </div>

        {/* What happens after you apply, while joining is by application
            (`joinMode` "apply" in data/site.ts). The third step is the owner's
            own description of joining; a named platform replaces it once
            `platform` is set. */}
        {site.businessMastery.joinMode === "apply" && (
          <div className="bm-steps mx-auto mt-20 max-w-5xl md:mt-24">
            <div className="text-center" data-reveal>
              <p className="ds-eyebrow ds-eyebrow--center">Next steps</p>
              <h3 className="ds-h2 ds-h2--sm mt-4">
                What happens after you apply
              </h3>
            </div>
            {/* Laid out after a process strip the owner sent (2026-09-29):
                numbered squares on one line, each with a bold title and a
                line under it. The line still draws itself as the steps
                scroll into view (the owner's request, 2026-09-29): across
                from md up, down the left between the squares below it. */}
            <div className="relative mt-12 md:mt-16">
              <span className="bm-steps-line bm-steps-line--x" aria-hidden="true" />
              <ol className="bm-steps-list">
                {afterApplySteps.map(({ title, body }, i) => (
                  <li
                    key={title}
                    className="relative grid grid-cols-[var(--bm-badge)_1fr] items-start gap-x-5 md:flex md:flex-col md:items-center md:text-center"
                  >
                    {i < afterApplySteps.length - 1 && (
                      <span
                        className="bm-steps-line bm-steps-line--y"
                        aria-hidden="true"
                      />
                    )}
                    <span aria-hidden="true" className="bm-step-badge">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-2 md:pt-0">
                      <h4 className="ds-h3 md:mt-6">{title}</h4>
                      <p className="mt-2 text-pretty leading-relaxed text-neutral-300 md:mx-auto md:max-w-[17rem]">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div className="mt-16 md:mt-20">
          <BmApplicationForm />
        </div>
      </div>
    </section>
  );
}
