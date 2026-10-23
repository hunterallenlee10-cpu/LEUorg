import { NextRequest, NextResponse } from "next/server";
import { inquiryIndustryOptions } from "@/data/lee-systems";
import { inquiryNeeds, legacyNeedLabels } from "@/data/services";
import { site } from "@/data/site";
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

/*
 * The /how-it-works and /services form
 * (components/lee-systems/LeeSystemsInquiryForm.tsx), which replaced the
 * automation consultation form and the website quote form on 2026-09-29.
 * Every request goes to the site-wide address (DEFAULT_TO_EMAIL); the subject
 * line tells a website request from a consultation request, in the same
 * words the two old forms used, so any inbox filters keep working.
 */
/** What the form posts. Typed `unknown` because a request can come from anywhere. */
interface LeeSystemsInquiryRequest {
  fullName?: unknown;
  businessName?: unknown;
  email?: unknown;
  phone?: unknown;
  need?: unknown;
  industry?: unknown;
  currentWebsite?: unknown;
  message?: unknown;
  /** "Book a call": the day, part of day and call type, or null. */
  call?: unknown;
  honeypot?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonBody(request);
    if (parsed instanceof NextResponse) return parsed;
    const body: LeeSystemsInquiryRequest = parsed;

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
      errors.fullName = "Name is required";
    } else if (fullName.length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    } else if (fullName.length > FIELD_LIMITS.short) {
      errors.fullName = tooLongMessage(FIELD_LIMITS.short);
    } else if (!isValidName(fullName)) {
      errors.fullName = INVALID_NAME_MESSAGE;
    }

    const businessName = stringField(body.businessName).trim();
    if (!businessName) {
      errors.businessName = "Business name is required";
    } else if (businessName.length > FIELD_LIMITS.short) {
      errors.businessName = tooLongMessage(FIELD_LIMITS.short);
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

    // Checked against the form's own lists so the email never carries a value
    // the form could not have sent. The form posts a service slug
    // ("ai-calls"); a page loaded before the slugs went in posts the old
    // label, which `legacyNeedLabels` maps on.
    const postedNeed = stringField(body.need).trim();
    const needValue = legacyNeedLabels[postedNeed] ?? postedNeed;
    const need = inquiryNeeds.find(({ value }) => value === needValue);
    if (!need) {
      errors.need = "Please select what you are looking for";
    }

    const industry = stringField(body.industry).trim();
    if (!inquiryIndustryOptions.includes(industry)) {
      errors.industry = "Please choose your industry";
    }

    const currentWebsite = stringField(body.currentWebsite).trim();
    if (currentWebsite.length > FIELD_LIMITS.short) {
      errors.currentWebsite = tooLongMessage(FIELD_LIMITS.short);
    }

    const message = stringField(body.message).trim();
    if (message.length > FIELD_LIMITS.long) {
      errors.message = tooLongMessage(FIELD_LIMITS.long);
    }

    const { call, error: callError } = readCallRequest(body.call);
    if (callError) errors.call = callError;

    if (!need || Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const emailBody = `
Name: ${fullName}
Business: ${businessName}
Email: ${email}
Phone: ${phone}
What they need: ${need.label}
Industry: ${industry}
Current Website: ${currentWebsite || "None / not provided"}

Message:
${message || "No message"}${callEmailBlock(call, phone)}

${site.replyTime ? `Reply promised ${site.replyTime}, to set up their free consultation call.` : "They asked for a free consultation call."}
    `.trim();

    // The subject line is what tells a website request from a consultation
    // request in the inbox, so it names the brand and the kind of request, in
    // the same words the two old forms used.
    return await sendLeadEmail({
      tag: "lee-systems-inquiry",
      form: "LEU inquiry form",
      to: DEFAULT_TO_EMAIL,
      replyTo: email,
      subject:
        (need.website
        ? `LEU: New Website Request from ${fullName}, ${businessName}`
        : `LEU: New Consultation Request from ${fullName}, ${businessName}`) + callSubjectSuffix(call),
      text: emailBody,
    });
  } catch (error) {
    console.error("[lee-systems-inquiry] LEU inquiry form error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
