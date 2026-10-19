import { NextResponse } from "next/server";
import { Resend } from "resend";
import { companyInfo } from "@/data/company";

/**
 * Constructed per call rather than at module scope: the Resend constructor
 * throws when the key is missing, which fails `next build` on any environment
 * that doesn't expose RESEND_API_KEY at build time.
 */
export function getResend(): Resend {
  // Trimmed: a key pasted into Vercel with a trailing space or newline is
  // otherwise refused by Resend as invalid.
  return new Resend(process.env.RESEND_API_KEY?.trim());
}

/**
 * The sender on every email the site sends. Defaults to Resend's shared
 * onboarding@resend.dev, which the owner's Resend account already sends the
 * .com site's form emails from (2026-10-19). It works without a verified
 * domain, but only delivers to the Resend account's own address, which is
 * ceo@leeenterprisesunlimited.com. Once leeenterprisesunlimited.com is
 * verified in Resend, set CONTACT_FROM_EMAIL to an address on it.
 */
export const FALLBACK_FROM_EMAIL =
  "Lee Enterprises Unlimited <onboarding@resend.dev>";

export const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || FALLBACK_FROM_EMAIL;

interface OutgoingEmail {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

/**
 * Sends one email through Resend. If CONTACT_FROM_EMAIL names a sender Resend
 * refuses (most often an address on a domain not yet verified there), it
 * tries once more from onboarding@resend.dev, so a stale sender setting can't
 * stop every lead from arriving. `from` is the sender that was used last.
 */
export async function sendEmail(email: OutgoingEmail) {
  const resend = getResend();
  let from = FROM_EMAIL;
  let response = await resend.emails.send({ from, ...email });

  if (response.error && from !== FALLBACK_FROM_EMAIL) {
    console.error(
      `Resend refused the sender ${from}; retrying from ${FALLBACK_FROM_EMAIL}.`,
      `name=${response.error.name}`,
      `message=${response.error.message}`
    );
    from = FALLBACK_FROM_EMAIL;
    response = await resend.emails.send({ from, ...email });
  }

  return { ...response, from };
}

/**
 * Where every form submission and payment notification lands:
 * ceo@leeenterprisesunlimited.com (site.email in data/site.ts). Fixed in code
 * at the owner's request (2026-10-19) rather than read from an environment
 * variable, so no setting in Vercel can quietly send leads somewhere else.
 * The old overrides (CONTACT_TO_EMAIL, LEE_SYSTEMS_TO_EMAIL, LMM_TO_EMAIL,
 * WEBSITE_TO_EMAIL, BM_TO_EMAIL) are no longer read.
 */
export const DEFAULT_TO_EMAIL = companyInfo.contactEmail;

interface LeadEmail {
  /** The route's log prefix, e.g. "contact" for "[contact] ...". */
  tag: string;
  /** The form as log lines name it, e.g. "contact form". */
  form: string;
  to: string;
  /** The visitor's address, so the owner can answer straight from the inbox. */
  replyTo: string;
  subject: string;
  text: string;
}

/**
 * Emails a lead form's submission to the owner and returns the response for
 * the browser. The Lee Systems and Business Mastery forms show `code` as the
 * reference on a failure, which is what tells a missing key apart from a
 * rejected send.
 */
export async function sendLeadEmail({
  tag,
  form,
  to,
  replyTo,
  subject,
  text,
}: LeadEmail): Promise<NextResponse> {
  // LEAD_EMAIL_DRY_RUN=1 logs the email instead of sending it, for testing
  // the forms locally or on a preview without filling a real inbox. Never set
  // it on Production: every lead would be logged and dropped.
  if (process.env.LEAD_EMAIL_DRY_RUN === "1") {
    console.info(
      `[${tag}] Dry run (LEAD_EMAIL_DRY_RUN=1): the ${form} email was not sent.`,
      JSON.stringify({ to, replyTo, subject, text })
    );
    return NextResponse.json(
      { message: "Dry run: email not sent", dryRun: true },
      { status: 200 }
    );
  }

  // Checked up front so a missing key is reported as itself rather than as a
  // generic failure: the Resend constructor throws on an absent key.
  if (!process.env.RESEND_API_KEY) {
    console.error(
      `[${tag}] RESEND_API_KEY is not set - the ${form} cannot send email.`
    );
    return NextResponse.json(
      { error: "Failed to send email", code: "email_not_configured" },
      { status: 500 }
    );
  }

  const response = await sendEmail({ to, replyTo, subject, text });

  if (response.error) {
    // Logged field by field: Resend's error object stringifies to "[object
    // Object]" through console.error on Vercel, hiding the actual reason.
    console.error(
      `[${tag}] Resend rejected the ${form} email.`,
      `name=${response.error.name}`,
      `message=${response.error.message}`,
      `from=${response.from}`,
      `to=${to}`
    );
    // `reason` is Resend's error name (e.g. "validation_error",
    // "invalid_api_key"): enough to tell the causes apart from the browser,
    // without the message, which can name the Resend account's address.
    return NextResponse.json(
      {
        error: "Failed to send email",
        code: "email_rejected",
        reason: response.error.name,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Email sent successfully", id: response.data?.id },
    { status: 200 }
  );
}
