import { sectionIds } from "@/data/navigation";
import { site } from "@/data/site";
import { ContactFormBlock } from "@/components/contact/ContactFormBlock";
import { TalkNow } from "@/components/contact/TalkNow";

/**
 * Homepage: the contact section, the page's last ask. It keeps
 * the id "contact" so old /#contact links still land here; the nav's Contact
 * goes to /contact, which carries the same form.
 *
 * Dressed like the LEU offer at the top of the page (2026-10-06, the
 * owner's ask to make it "go with the rest of the site"): the same brass
 * eyebrow and headline, and a form card cut like the calculator's. The
 * headline is the owner's, "Every missed lead is lost money.", picking up
 * the calculator's missed revenue, and the line under it carries the offer
 * terms (2026-10-06, replacing "Not sure which fits? Tell me what you
 * need.").
 */
export function ContactSection() {
  // Restyled in the black-and-gold design system (2026-10-18). The owner's
  // "Every missed lead is lost money." is now the closing banner just above
  // (HomeClosingBanner), so this heading takes the line's own ask instead;
  // the offer terms, reply time, form and contact details are unchanged.
  return (
    <section
      id={sectionIds.contact}
      aria-labelledby="contact-title"
      className="ds-section"
    >
      <div className="ds-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:pt-4" data-reveal>
            <p className="ds-eyebrow">Contact</p>
            <h2 id="contact-title" className="ds-h2 ds-h2--sm mt-4">
              Tell us where leads <span className="ds-accent">slip through</span>
            </h2>
            <p className="ds-sub mt-6 max-w-md">
              Missed calls, slow follow-up, or a website that doesn&apos;t bring
              them in. You&apos;ll get a flat upfront quote with no hidden fees,
              built personally for you.
            </p>
            {site.replyTime && (
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-brass-400">
                We reply {site.replyTime}.
              </p>
            )}
            <TalkNow className="mt-10" />
          </div>

          <div data-reveal>
            <ContactFormBlock headingLevel="h3" />
          </div>
        </div>
      </div>
    </section>
  );
}
