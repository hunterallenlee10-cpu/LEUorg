import clsx from "clsx";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { site, telHref } from "@/data/site";
import { BookCallLink } from "@/components/ui/BookCallLink";

/**
 * "Rather talk now? Connect with us." beside the contact form, on the homepage
 * and /contact: the phone, Instagram and email, each a row that links straight
 * to it, in brass to match the LEU offer.
 *
 * The "Book a free call" button only appears here once a booking link is set
 * in data/site.ts. Until then that button leads to this same contact form, so
 * showing it next to the form would send people in a circle; the phone number
 * is the way to talk now instead.
 */
export function TalkNow({
  headingLevel = "h3",
  className,
}: {
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  const phoneLink = site.phone ? telHref(site.phone) : "";
  const instagramHandle = site.instagramUrl
    ? `@${site.instagramUrl.replace(/\/+$/, "").split("/").pop()}`
    : "";

  return (
    <div className={className}>
      <Heading className="ds-keep text-base font-semibold text-white">
        Rather talk now? Connect with us.
      </Heading>

      {site.bookingUrl && <BookCallLink variant="secondary" className="mt-4" />}

      <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {phoneLink && (
          <li>
            <a href={phoneLink} className={rowClass}>
              <span className={iconClass}>
                <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={labelClass}>Call</span>
                <span className={valueClass}>{site.phone}</span>
              </span>
              <ArrowUpRight className={arrowClass} aria-hidden="true" />
            </a>
          </li>
        )}
        {site.instagramUrl && (
          <li>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={rowClass}
            >
              <span className={iconClass}>
                <InstagramIcon />
              </span>
              <span className="min-w-0 flex-1">
                <span className={labelClass}>Instagram</span>
                <span className={valueClass}>{instagramHandle}</span>
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
              <ArrowUpRight className={arrowClass} aria-hidden="true" />
            </a>
          </li>
        )}
        <li>
          <a href={`mailto:${site.email}`} className={rowClass}>
            <span className={iconClass}>
              <Mail className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={labelClass}>Email</span>
              <span className={valueClass}>
                <EmailBreakable email={site.email} />
              </span>
            </span>
            <ArrowUpRight className={arrowClass} aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  );
}

const rowClass = clsx(
  "group flex min-h-11 items-center gap-4 py-4 outline-offset-4",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass-300"
);

const iconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brass-400/25 bg-brass-400/[0.06] text-brass-300 transition-colors group-hover:border-brass-400/60";

const labelClass =
  "block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-neutral-400";

const valueClass =
  "mt-0.5 block font-medium [overflow-wrap:anywhere] text-neutral-100 transition-colors group-hover:text-brass-300";

const arrowClass =
  "h-4 w-4 shrink-0 text-neutral-600 max-[359px]:hidden transition-[color,transform] duration-200 group-hover:text-brass-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5";

/** The address with a line-break point after the "@", so on a narrow phone it
 *  splits as "ceo@" / "domain.com" rather than mid-word. */
function EmailBreakable({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at < 0) return email;
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  );
}

/** lucide-react dropped its brand icons, so the Instagram glyph is drawn here
 *  in the same 24px, 2px-stroke style as the Mail icon beside it. */
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[1.125rem] w-[1.125rem]"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
