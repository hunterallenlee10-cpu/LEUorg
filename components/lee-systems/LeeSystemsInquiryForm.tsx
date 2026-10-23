"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { inquiryIndustryOptions, leeSystems } from "@/data/lee-systems";
import { inquiryNeeds } from "@/data/services";
import { site } from "@/data/site";
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

const emptyForm = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  need: "",
  industry: "",
  currentWebsite: "",
  message: "",
};

type FormState = typeof emptyForm;
type FieldErrors = Partial<Record<keyof FormState | "call" | "form", string>>;

const industryOptions = inquiryIndustryOptions.map((option) => ({
  value: option,
  label: option,
}));

/** Square fields with a gold focus edge, the same as the contact form's (the
 *  black-and-gold redesign; this form joined it on 2026-10-23). */
const labelClass = "mb-2 block text-sm font-medium text-neutral-300";
const fieldClass =
  "w-full rounded-none border bg-neutral-950/70 px-4 py-3 text-white placeholder-neutral-500 transition-colors focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-400/40";

/**
 * The one form on /how-it-works. It replaced the automation page's
 * consultation form and the websites page's quote form (2026-09-29): what the
 * visitor needs is now one of its questions. Posts to /api/lee-systems-inquiry,
 * which checks the same rules server side and emails the request to where the
 * old form for that kind of request sent it; the recipient is set there and
 * never sent from the browser.
 *
 * "What do you need?" lists the six service groups and "Not sure", each
 * posted as its slug (data/services.ts). `initialNeed` starts it on one: a
 * service page passes its own, and LeeSystemsInquiryFormBlock passes a link's
 * ?service= or ?interest=.
 */
export function LeeSystemsInquiryForm({
  initialNeed = "",
}: {
  initialNeed?: string;
} = {}) {
  const [formData, setFormData] = useState<FormState>({
    ...emptyForm,
    need: initialNeed,
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [call, setCall] = useState(() => emptyCallChoice());
  /** The call asked for in the request just sent, for the thank-you. */
  const [sentCall, setSentCall] = useState<CallRequest | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // The success panel replaces the form, taking the focused submit button with
  // it, so focus would fall back to <body>. Moving it to the panel keeps a
  // keyboard or screen reader user on the confirmation.
  useEffect(() => {
    if (submitted) {
      successRef.current?.focus();
    }
  }, [submitted]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value: typed } = e.target;
    const { value, dropped } = filterInput(
      name === "fullName" ? "name" : name === "phone" ? "phone" : null,
      typed
    );
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: dropped, form: undefined }));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (formData.fullName.trim().length < 2)
      next.fullName = "Please enter your name.";
    else if (!isValidName(formData.fullName.trim()))
      next.fullName = INVALID_NAME_MESSAGE;
    if (!formData.businessName.trim())
      next.businessName = "Please enter your business name.";
    if (!isValidEmail(formData.email.trim()))
      next.email = "Please enter a valid email address, like name@example.com.";
    if (!isValidPhone(formData.phone.trim()))
      next.phone = "Please enter a valid phone number, including the area code.";
    if (!formData.need) next.need = "Please choose what you need.";
    if (!formData.industry) next.industry = "Please choose your industry.";
    if (call.wanted && !call.day) next.call = CALL_DAY_ERROR;
    return next;
  };

  /** Shows the errors, then puts focus on the first field that needs fixing,
   *  in the order the form lists them, which on a phone also scrolls it into
   *  view. The errors are applied first so the field is already marked
   *  invalid and described by its message when focus lands on it. */
  const showErrors = (found: FieldErrors) => {
    flushSync(() => setErrors(found));
    const names = Object.keys(found).filter((name) => name !== "form");
    if (names.length === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>(
        names.map((name) => `[name="${CSS.escape(name)}"]`).join(", ")
      )
      ?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length > 0) {
      showErrors(found);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/lee-systems-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, call: callPayload(call), honeypot }),
      });

      if (response.ok) {
        setSentCall(callPayload(call));
        setSubmitted(true);
        setCall(emptyCallChoice());
        setFormData({ ...emptyForm, need: initialNeed });
        return;
      }

      const data = await response.json().catch(() => null);
      if (data?.errors) {
        showErrors(data.errors as FieldErrors);
      } else {
        setErrors({
          form: `We couldn't send your request. Please try again, or email ${leeSystems.contactEmail}. Reference: ${
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

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="ds-cut mx-auto max-w-2xl border border-brass-400/30 bg-[var(--ds-surface)] p-10 text-center focus:outline-none md:p-12"
      >
        <CheckCircle2
          className="mx-auto mb-5 h-12 w-12 text-brass-300"
          aria-hidden="true"
        />
        <h3 className="mb-3 text-2xl font-bold text-white">
          {sentCall ? "Call request received" : "Details received"}
        </h3>
        <p className="mb-6 text-neutral-300">
          Thank you.{" "}
          {sentCall
            ? callConfirmation(sentCall, site.replyTime)
            : site.replyTime
            ? `We'll reply ${site.replyTime} to set up your free consultation call.`
            : "We'll get back to you to set up your free consultation call."}
        </p>
        {site.bookingUrl && (
          <div className="mb-6">
            <p className="mb-4 text-neutral-300">Rather pick a time now?</p>
            <BookCallLink />
          </div>
        )}
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brass-300 underline-offset-4 hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="inquiry-form-description"
      className="ds-cut relative mx-auto max-w-3xl border border-white/10 bg-[var(--ds-surface)] p-6 md:p-10"
    >
      <div className="mb-2">
        <h3 className="ds-h3">
          Request your free consultation
        </h3>
      </div>
      <p id="inquiry-form-description" className="mb-8 text-sm text-neutral-400">
        Fields marked with an asterisk are required.
        {site.replyTime && ` We reply ${site.replyTime}.`}
      </p>

      {/* Honeypot - visually hidden, ignored by real visitors */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="ls-inquiry-company-website">Leave this field empty</label>
        <input
          id="ls-inquiry-company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errors.form && (
        <p
          role="alert"
          className="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {errors.form}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          id="fullName"
          label="Name"
          required
          error={errors.fullName}
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          maxLength={FIELD_LIMITS.short}
        />
        <Field
          id="businessName"
          label="Business name"
          required
          error={errors.businessName}
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Your business name"
          autoComplete="organization"
          maxLength={FIELD_LIMITS.short}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          error={errors.email}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
        />
        <Field
          id="phone"
          label="Phone"
          type="tel"
          required
          error={errors.phone}
          value={formData.phone}
          onChange={handleChange}
          placeholder="(240) 000-0000"
          autoComplete="tel"
          maxLength={FIELD_LIMITS.phone}
        />
        <SelectField
          id="need"
          label="What do you need?"
          error={errors.need}
          value={formData.need}
          onChange={handleChange}
          options={inquiryNeeds}
        />
        <SelectField
          id="industry"
          label="Industry"
          error={errors.industry}
          value={formData.industry}
          onChange={handleChange}
          options={industryOptions}
        />
      </div>

      <div className="mt-5">
        <Field
          id="currentWebsite"
          label="Current website"
          optional
          type="url"
          error={errors.currentWebsite}
          value={formData.currentWebsite}
          onChange={handleChange}
          placeholder="https://yourcompany.com"
          autoComplete="url"
          maxLength={FIELD_LIMITS.short}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          Message <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Anything else we should know?"
          value={formData.message}
          onChange={handleChange}
          maxLength={FIELD_LIMITS.long}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y ${
            errors.message ? "border-red-500/60" : "border-white/10 hover:border-white/20"
          }`}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-2 text-sm text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <BookCallPicker
        idPrefix="ls-inquiry"
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
        className="btn-ls-primary mt-8 inline-flex min-h-11 w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send my details"}
      </button>

      <p className="mt-4 text-center text-sm text-neutral-400">
        Free, with no obligation.
      </p>
    </form>
  );
}

function RequiredMark() {
  return (
    <>
      {" "}
      <span className="text-brass-400" aria-hidden="true">
        *
      </span>
    </>
  );
}

interface FieldProps {
  id: keyof FormState;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  /** Says "(optional)" after the label. */
  optional?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  optional,
  error,
  placeholder,
  autoComplete,
  maxLength,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <RequiredMark />}
        {optional && (
          <span className="font-normal text-neutral-400"> (optional)</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`${fieldClass} ${error ? "border-red-500/60" : "border-white/10 hover:border-white/20"}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  id: keyof FormState;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly { value: string; label: string }[];
  error?: string;
}

/** A required dropdown. */
function SelectField({ id, label, value, onChange, options, error }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <RequiredMark />
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        aria-required="true"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass} ${error ? "border-red-500/60" : "border-white/10 hover:border-white/20"}`}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
