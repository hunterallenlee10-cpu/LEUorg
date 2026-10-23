import { NextRequest, NextResponse } from "next/server";
import { contactInterests, isContactInterest } from "@/data/contact";
import { readJsonBody, stringField, tooLongMessage } from "@/lib/api";
import { DEFAULT_TO_EMAIL, sendLeadEmail } from "@/lib/email";
import { callEmailBlock, callSubjectSuffix, readCallRequest } from "@/lib/call-request";
import {
  FIELD_LIMITS,
  INVALID_NAME_MESSAGE,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "@/lib/validation";

/** What the form posts. Typed `unknown` because a request can come from anywhere. */
interface ContactFormRequest {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  message?: unknown;
  /** "Book a call": the day, part of day and call type, or null. */
  call?: unknown;
  honeypot?: unknown;
}

/**
 * The shared contact form (components/contact/ContactForm.tsx): name, email,
 * phone and an optional message. Delivered through Resend to the site-wide
 * address (DEFAULT_TO_EMAIL), with a tag at the front of the subject: "[LEU] New
 * inquiry from Jane Smith" when the visitor came from a "Book a free call"
 * link (?interest=free-call), "[General]" otherwise.
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonBody(request);
    if (parsed instanceof NextResponse) return parsed;
    const body: ContactFormRequest = parsed;

    // Honeypot field check - silently return 200 if filled
    if (stringField(body.honeypot).trim() !== "") {
      return NextResponse.json(
        { message: "Thank you for your submission" },
        { status: 200 }
      );
    }

    const errors: Record<string, string> = {};

    const name = stringField(body.name).trim();
    if (!name) {
      errors.name = "Please enter your name.";
    } else if (name.length < 2) {
      errors.name = "Please enter at least 2 characters.";
    } else if (name.length > FIELD_LIMITS.short) {
      errors.name = tooLongMessage(FIELD_LIMITS.short);
    } else if (!isValidName(name)) {
      errors.name = INVALID_NAME_MESSAGE;
    }

    const email = stringField(body.email).trim();
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (email.length > FIELD_LIMITS.email || !isValidEmail(email)) {
      errors.email = "Please enter a valid email address, like name@example.com.";
    }

    // Required since 2026-09-29, at the owner's request.
    const phone = stringField(body.phone).trim();
    if (!phone) {
      errors.phone = "Please enter your phone number.";
    } else if (phone.length > FIELD_LIMITS.phone || !isValidPhone(phone)) {
      errors.phone = "Please enter a valid phone number, including the area code.";
    }

    // Optional since the owner took "I'm interested in" off the form
    // (2026-10-06): the form sends the ?interest= its link carried, if any.
    // Anything not on the list is treated as none, so the email never carries
    // a value the form could not have sent.
    const posted = stringField(body.interest).trim();
    const interest = isContactInterest(posted) ? posted : null;

    const message = stringField(body.message).trim();
    if (message.length > FIELD_LIMITS.long) {
      errors.message = tooLongMessage(FIELD_LIMITS.long);
    }

    const { call, error: callError } = readCallRequest(body.call);
    if (callError) errors.call = callError;

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const choice = interest
      ? contactInterests.find((option) => option.value === interest)
      : undefined;

    const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}${choice ? `\nInterested in: ${choice.label}` : ""}

Message:
${message || "No message"}${callEmailBlock(call, phone)}
    `.trim();

    return await sendLeadEmail({
      tag: "contact",
      form: "contact form",
      to: DEFAULT_TO_EMAIL,
      replyTo: email,
      subject: `[${choice?.subjectTag ?? "General"}] New inquiry from ${name}` + callSubjectSuffix(call),
      text: emailBody,
    });
  } catch (error) {
    console.error("[contact] Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
