import { NextRequest, NextResponse } from "next/server";
import { readJsonBody, stringField, tooLongMessage } from "@/lib/api";
import { DEFAULT_TO_EMAIL, sendLeadEmail } from "@/lib/email";
import {
  FIELD_LIMITS,
  INVALID_NAME_MESSAGE,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "@/lib/validation";

// Delivers to the site-wide address (DEFAULT_TO_EMAIL), like the other forms.
// Its own route rather than a shared one with a flag: the subject line is
// what distinguishes a Business Mastery application in the inbox, and that
// only works if it is set here.

/** What the form posts. Typed `unknown` because a request can come from anywhere. */
interface BmApplicationRequest {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  story?: unknown;
  honeypot?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonBody(request);
    if (parsed instanceof NextResponse) return parsed;
    const body: BmApplicationRequest = parsed;

    // Honeypot field check - silently return 200 if filled
    if (stringField(body.honeypot).trim() !== "") {
      return NextResponse.json(
        { message: "Thank you for your submission" },
        { status: 200 }
      );
    }

    const errors: Record<string, string> = {};

    const fullName = stringField(body.fullName).trim();
    if (!fullName) {
      errors.fullName = "Full name is required";
    } else if (fullName.length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    } else if (fullName.length > FIELD_LIMITS.short) {
      errors.fullName = tooLongMessage(FIELD_LIMITS.short);
    } else if (!isValidName(fullName)) {
      errors.fullName = INVALID_NAME_MESSAGE;
    }

    const email = stringField(body.email).trim();
    if (!email) {
      errors.email = "Email is required";
    } else if (email.length > FIELD_LIMITS.email || !isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    const phone = stringField(body.phone).trim();
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (phone.length > FIELD_LIMITS.phone || !isValidPhone(phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    const story = stringField(body.story).trim();
    if (!story) {
      errors.story = "Please tell us about where you are and what you want to build";
    } else if (story.length < 20) {
      errors.story = "Please add a little more detail";
    } else if (story.length > FIELD_LIMITS.long) {
      errors.story = tooLongMessage(FIELD_LIMITS.long);
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const emailBody = `
Applicant: ${fullName}
Email Address: ${email}
Phone Number: ${phone}

Their Story:
${story}
    `.trim();

    return await sendLeadEmail({
      tag: "bm-application",
      form: "Business Mastery application form",
      to: DEFAULT_TO_EMAIL,
      replyTo: email,
      subject: `New Business Mastery Application from ${fullName}`,
      text: emailBody,
    });
  } catch (error) {
    console.error("[bm-application] Business Mastery application form error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
