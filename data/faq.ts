import { serviceGroups } from "@/data/services";
import { businessMasteryPage } from "@/data/navigation";
import { site } from "@/data/site";

/**
 * The homepage FAQ (the black-and-gold redesign, 2026-10-18). Every answer
 * is built only from facts the site already states: the offer terms
 * (data/lee-systems.ts `pricingPromise`), the reply time and contact details
 * (data/site.ts), the six service groups (data/services.ts) and the owner's
 * answers on /how-it-works.
 *
 * An entry with an empty `answer` is a question the owner still has to
 * answer: it does not render (the same rule as data/site.ts: an empty value
 * keeps a stand-in off the page), and `todo` says what is needed.
 */
export interface FaqItem {
  question: string;
  answer: string;
  /** A link shown after the answer. */
  link?: { label: string; href: string };
  /** For the owner: what this entry needs before it can show. */
  todo?: string;
}

const serviceNames = serviceGroups.map((group) => group.name);

export const homeFaqs: FaqItem[] = [
  {
    question: "What do you build?",
    answer: `Websites that bring customers in, and AI automations that answer every call, follow up and book the job. Everything we do falls into six groups: ${serviceNames.slice(0, -1).join(", ")} and ${serviceNames[serviceNames.length - 1]}. Each one is built personally for your business.`,
  },
  {
    question: "How does pricing work?",
    answer:
      "Every project is quoted on its own, on a free consultation call. You get a flat quote upfront, with no hidden fees and no revenue share.",
  },
  {
    question: "Do I have to spend money on ads?",
    answer: "No. There is no required ad spend to work with us.",
  },
  {
    question: "Do you take a cut of my revenue?",
    answer: "No. There is no revenue share. You pay the flat quote you agreed to upfront, with no hidden fees.",
  },
  {
    question: "What happens on the free call?",
    answer:
      "We look at how your business runs today and where leads slip through: missed calls, slow follow-up, or a website that doesn't bring them in. If we're a fit, you get a flat quote upfront. There is no charge and no obligation to hire us afterwards.",
  },
  {
    question: "How fast will you get back to me?",
    answer: site.replyTime
      ? `We reply ${site.replyTime}. If you'd rather talk now, call ${site.phone} or email ${site.email}.`
      : "",
  },
  {
    question: "What is Business Mastery?",
    answer:
      "Business Mastery is our program for people who want to start their own business and learn practical skills like AI. It's a paid monthly membership.",
    link: { label: "See Business Mastery", href: businessMasteryPage },
  },
  {
    question: "How long does a build take?",
    answer: "",
    todo: "Typical timelines for a website, an automation and a combined build.",
  },
  {
    question: "How much does a typical project cost?",
    answer: "",
    todo: "Starting prices or typical ranges, if you want to publish them. Until then the pricing answer above says every project is quoted on the call.",
  },
];
