import {
  CalendarX,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  bmTerms,
  bmTermsHeading,
  bmTermsNote,
  type BmTerm,
} from "@/data/business-mastery-terms";
import { companyInfo } from "@/data/company";

const icons: Record<BmTerm["id"], LucideIcon> = {
  billing: CreditCard,
  renewal: RefreshCw,
  cancellation: CalendarX,
  guarantee: ShieldCheck,
};

const linkClass =
  "font-medium text-brass-400 underline underline-offset-4 hover:text-white";

/** The contact email inside a term's text, as a mailto link. */
function withEmailLink(text: string) {
  const email = companyInfo.contactEmail;
  const parts = text.split(email);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a key={i} href={`mailto:${email}`} className={linkClass}>
            {email}
          </a>,
          part,
        ],
  );
}

/**
 * Billing, renewal, cancellation and the 90-day guarantee, one of the site's
 * FAQ bars each, in the member offer section under the price (the owner's
 * request, 2026-10-23). The wording is data/business-mastery-terms.ts, which
 * /legal's Terms of Service shows too. Native <details>, so it works with no
 * JS.
 */
export function BmMembershipTerms() {
  return (
    <div className="mx-auto mt-10 max-w-2xl" data-reveal>
      <h3 className="ds-eyebrow ds-eyebrow--center mb-4">{bmTermsHeading}</h3>
      <div className="ds-faq">
        {bmTerms.map((term) => {
          const Icon = icons[term.id];
          return (
            <details key={term.id}>
              <summary>
                <span className="flex items-center gap-3">
                  <Icon
                    className="h-6 w-6 shrink-0 text-brass-400"
                    aria-hidden="true"
                  />
                  {term.heading}
                </span>
                <span className="ds-faq-icon" aria-hidden="true" />
              </summary>
              <div className="ds-faq-answer">
                <p className="text-neutral-300">{withEmailLink(term.body)}</p>
              </div>
            </details>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-neutral-400">
        {bmTermsNote}{" "}
        <a href={`mailto:${companyInfo.contactEmail}`} className={linkClass}>
          {companyInfo.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
