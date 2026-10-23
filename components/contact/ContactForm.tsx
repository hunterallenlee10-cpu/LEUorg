"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import type { ContactInterest } from "@/data/contact";
import { bookHref, site } from "@/data/site";
import {
  FIELD_LIMITS,
  INVALID_NAME_MESSAGE,
  filterInput,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "@/lib/validation";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { BookCallPicker } from "@/components/forms/BookCallPicker";
import {
  CALL_DAY_ERROR,
  callConfirmation,
  callPayload,
  emptyCallChoice,
  type CallRequest,
} from "@/lib/call-request";

type Field = "name" | "email" | "phone" | "message" | "call";
type FieldErrors = Partial<Record<Field | "form", string>>;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

/** Square fields with a gold focus edge (the black-and-gold redesign). */
const labelClass = "mb-2 block text-sm font-medium text-neutral-300";
const fieldClass =
  "w-full rounded-none border bg-neutral-950/70 px-4 py-3 text-white placeholder-neutral-500 transition-colors focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-400/40";
const borderFor = (error?: string) =>
  error ? "border-red-500/60" : "border-white/10 hover:border-white/20";

/** A cut-corner card in the design system's surface colour (graphite in
 *  dark, white in light; "LEU design system" in globals.css). */
const cardClass =
  "ds-cut relative border border-white/10 bg-[var(--ds-surface)] p-6 md:p-9";

/** The order errors are checked in, which is the order focus goes to them. */
const fieldOrder: Field[] = ["name", "email", "phone", "message", "call"];

/** The `?interest=` every "Book a free call" link carries, when the button
 *  leads here (data/site.ts). Arriving with it starts "Book a call" on. */
const bookInterest = bookHref.startsWith("/contact")
  ? new URLSearchParams(bookHref.split("?")[1] ?? "").get("interest")
  : null;

function RequiredMark() {
  return (
    <>
      {" "}
      <span className="text-brass-300" aria-hidden="true">
        *
      </span>
    </>
  );
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-400">
      {children}
    </p>
  );
}

export interface ContactFormProps {
  /** Which path the visitor came from, from a link's ?interest= (every
   *  "Book a free call" passes lee-systems). There's no field for it since
   *  the owner took "I'm interested in" out (2026-10-06); it only tags the
   *  email's subject line. */
  initialInterest?: ContactInterest | "";
  /** The level of the form's "Send a message" heading and of the success
   *  message's: they sit under the page's H1 on /contact and under a
   *  section's H2 on the homepage. */
  headingLevel?: "h2" | "h3";
}

/**
 * The shared contact form, on the homepage (#contact) and on /contact. Four
 * fields, three required. It posts to /api/contact, which checks the same
 * rules and emails the owner.
 */
export function ContactForm({
  initialInterest = "",
  headingLevel = "h3",
}: ContactFormProps) {
  const [formData, setFormData] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const callOnAtStart = !!initialInterest && initialInterest === bookInterest;
  const [call, setCall] = useState(() => emptyCallChoice(callOnAtStart));
  /** The call asked for in the message just sent, for the thank-you. */
  const [sentCall, setSentCall] = useState<CallRequest | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // The success panel replaces the form, taking the focused submit button with
  // it, so focus would fall back to <body>. Moving it to the panel keeps a
  // keyboard or screen reader user on the confirmation.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: typed } = e.target;
    const { value, dropped } = filterInput(
      name === "name" ? "name" : name === "phone" ? "phone" : null,
      typed
    );
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: dropped, form: undefined }));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name) next.name = "Please enter your name.";
    else if (name.length < 2) next.name = "Please enter at least 2 characters.";
    else if (!isValidName(name)) next.name = INVALID_NAME_MESSAGE;

    if (!email) next.email = "Please enter your email address.";
    else if (!isValidEmail(email))
      next.email = "Please enter a valid email address, like name@example.com.";

    if (!phone) next.phone = "Please enter your phone number.";
    else if (!isValidPhone(phone))
      next.phone = "Please enter a valid phone number, including the area code.";

    if (call.wanted && !call.day) next.call = CALL_DAY_ERROR;

    return next;
  };

  /** Puts focus on the first field that needs fixing. Callers apply the
   *  errors with flushSync first, so the field is already marked invalid and
   *  described by its message when focus lands on it. */
  const focusFirstError = (found: FieldErrors) => {
    const first = fieldOrder.find((field) => found[field]);
    if (!first) return;
    document.getElementById(`contact-${first}`)?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length > 0) {
      flushSync(() => setErrors(found));
      focusFirstError(found);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          interest: initialInterest,
          call: callPayload(call),
          honeypot,
        }),
      });

      if (response.ok) {
        setSentCall(callPayload(call));
        setSent(true);
        setFormData(emptyForm);
        setCall(emptyCallChoice(callOnAtStart));
        setHoneypot("");
        return;
      }

      const data = await response.json().catch(() => null);
      if (data?.errors) {
        flushSync(() => setErrors(data.errors as FieldErrors));
        focusFirstError(data.errors as FieldErrors);
      } else {
        setErrors({
          form: `Your message didn't send. Please try again, or email ${site.email}. Reference: ${
            data?.code || "unknown"
          }, http_${response.status}`,
        });
      }
    } catch {
      setErrors({
        form: "We couldn't reach the server. Please check your connection and try again. Reference: network_error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    const Heading = headingLevel;
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={clsx(cardClass, "text-center focus:outline-none md:p-12")}
      >
        <CheckCircle2
          className="mx-auto mb-5 h-12 w-12 text-brass-400"
          aria-hidden="true"
        />
        <Heading className="mb-3 text-2xl font-bold text-white">
          {sentCall
            ? "Thanks, your call request is in."
            : "Thanks, your message is in."}
        </Heading>
        <p className="text-neutral-300">
          {sentCall
            ? callConfirmation(sentCall, site.replyTime)
            : site.replyTime
              ? `We'll reply ${site.replyTime}.`
              : "We'll get back to you soon."}
        </p>

        {site.bookingUrl && (
          <div className="mt-6">
            <p className="mb-4 text-neutral-300">Rather pick a time now?</p>
            <BookCallLink />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSent(false);
          }}
          className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-brass-300 underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const FormHeading = headingLevel;
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      aria-describedby="contact-form-description"
      className={cardClass}
    >
      <FormHeading
        id="contact-form-title"
        className="ds-h3"
      >
        Send a message
      </FormHeading>
      <p id="contact-form-description" className="mb-7 mt-1.5 text-sm text-neutral-400">
        Fields marked with an asterisk are required.
      </p>

      {errors.form && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {errors.form}
        </p>
      )}

      {/* Honeypot. Off-screen with a real label rather than `display: none`,
          matching the site's other forms: a bot that skips hidden inputs walks
          past the first and fills the second. The body posts it as
          `honeypot`, the key /api/contact checks. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="contact-website-ext">Leave this field empty</label>
        <input
          id="contact-website-ext"
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
            <RequiredMark />
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={FIELD_LIMITS.short}
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={`${fieldClass} ${borderFor(errors.name)}`}
          />
          <ErrorText id="contact-name-error">{errors.name}</ErrorText>
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
            <RequiredMark />
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={`${fieldClass} ${borderFor(errors.email)}`}
          />
          <ErrorText id="contact-email-error">{errors.email}</ErrorText>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-phone" className={labelClass}>
            Phone
            <RequiredMark />
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={FIELD_LIMITS.phone}
            value={formData.phone}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={`${fieldClass} ${borderFor(errors.phone)}`}
          />
          <ErrorText id="contact-phone-error">{errors.phone}</ErrorText>
        </div>
      </div>


      <div className="mt-5">
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={FIELD_LIMITS.long}
          value={formData.message}
          onChange={handleChange}
          placeholder="What do you need help with?"
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${fieldClass} ${borderFor(errors.message)} resize-y`}
        />
        <ErrorText id="contact-message-error">{errors.message}</ErrorText>
      </div>

      <BookCallPicker
        idPrefix="contact"
        value={call}
        onChange={(next) => {
          setCall(next);
          setErrors((prev) => ({ ...prev, call: undefined, form: undefined }));
        }}
        error={errors.call}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-ls-glow group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            Send message
            <ArrowRight
              className="h-5 w-5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </form>
  );
}
