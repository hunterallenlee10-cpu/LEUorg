import { site } from "@/data/site";

/**
 * Business Mastery's membership terms, in the owner's words (agreed
 * 2026-10-23): billing, renewal, cancellation and the 90-day guarantee.
 * One source for both places they show, so the two never disagree:
 *
 * - the "Membership terms" dropdowns in the member offer section
 *   (components/business-mastery/BmMembershipTerms.tsx), and
 * - the Business Mastery entries in the Terms of Service on /legal
 *   (`termsOfServiceContent` in data/company.ts).
 *
 * The monthly amount comes from `site.businessMastery.price`, so a price
 * change there changes it here too. Anything else here that stops being
 * true (how people pay, how to cancel, the refund rules) changes in this
 * file, and the page and /legal follow.
 */

const email = site.email;

/** "$199" out of "$199/month". */
const amount = site.businessMastery.price.match(/\$[\d,.]+/)?.[0] ?? "";

/** "$199 a month", or "a monthly fee" if no price is set. */
const monthly = amount ? `${amount} a month` : "a monthly fee";

/** "your first month ($199)", or "your first month" with no price set. */
const firstMonth = amount ? `your first month (${amount})` : "your first month";

export type BmTerm = {
  id: "billing" | "renewal" | "cancellation" | "guarantee";
  heading: string;
  body: string;
};

export const bmTermsHeading = "Membership terms";

export const bmTerms: readonly BmTerm[] = [
  {
    id: "billing",
    heading: "Billing",
    body: `Applying is free. If you're accepted, we send you a secure Stripe payment link. Membership is ${monthly}, charged to your card when you pay that link to join. That day becomes your monthly billing date.`,
  },
  {
    id: "renewal",
    heading: "Renewal",
    body: `Your membership renews automatically every month on your billing date${amount ? `, at ${amount},` : ""} until you cancel. There's no contract and no minimum term.`,
  },
  {
    id: "cancellation",
    heading: "Cancellation",
    body: `Cancel anytime by emailing ${email}. Once you cancel, you won't be charged again, and you keep access until the end of the month you've already paid for. Months already paid for aren't refunded, except under the 90-day guarantee.`,
  },
  {
    id: "guarantee",
    heading: "90-Day Money-Back Guarantee",
    body: `If Business Mastery isn't for you, email us within 90 days of your first payment and we'll refund ${firstMonth}. To qualify, you need to have gone through the material and joined the community, and be able to show us what you put into practice. The refund goes back to the card you paid with within 14 days, and your membership ends when it's issued. The guarantee applies to your first membership only.`,
  },
];

/** Under the dropdowns, followed by the email as a link. */
export const bmTermsNote = "Questions about any of this? Email";
