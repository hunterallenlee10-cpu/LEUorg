"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CornerDownLeft } from "lucide-react";
import {
  FIELD_LIMITS,
  INVALID_NAME_MESSAGE,
  filterInput,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "@/lib/validation";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  story: "",
};

type FormState = typeof emptyForm;
type StepId = keyof FormState;
type FieldErrors = Partial<Record<StepId | "form", string>>;

/** The questions, one per screen, in the order they are asked. */
const steps: StepId[] = ["fullName", "email", "phone", "story"];

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

/** The same rules the route applies, one field at a time. */
function checkField(id: StepId, form: FormState): string | undefined {
  const value = form[id].trim();
  switch (id) {
    case "fullName":
      if (value.length < 2) return "Please enter your name.";
      if (!isValidName(value)) return INVALID_NAME_MESSAGE;
      return undefined;
    case "email":
      return isValidEmail(value) ? undefined : "Please enter a valid email address, like name@example.com.";
    case "phone":
      return isValidPhone(value)
        ? undefined
        : "Please enter a valid phone number, including the area code.";
    case "story":
      return value.length >= 20
        ? undefined
        : "Please tell us a little more about where you are and what you want to build.";
  }
}

/** Square fields with an accent focus edge, as on the contact form. */
const inputClass =
  "w-full rounded-none border bg-neutral-950/70 px-4 py-3 text-lg text-white placeholder-neutral-500 transition-colors focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-400/40 md:text-xl";

/** A cut-corner card in the design system's surface colour, like the
 *  contact form's ("LEU design system" in globals.css). */
const cardClass =
  "ds-cut relative mx-auto max-w-3xl border border-white/10 bg-[var(--ds-surface)]";

/**
 * The founding-member application, asked one question at a time: name, email,
 * phone, then their story. Enter (or Continue) checks the answer and moves on
 * to the next question, Back returns to the last one, and the answers carry
 * across. It replaced the all-at-once form on 2026-09-29 at the owner's
 * request.
 *
 * Same skeleton as the other site forms underneath: honeypot, the shared rules
 * in lib/validation.ts checked here and again in
 * app/api/business-mastery-application/route.ts, which also sets the
 * recipient. No payment is taken here; the owner follows up personally.
 *
 * Dressed like the contact form since 2026-10-22: a cut-corner card, square
 * fields and progress segments, mono labels and a display-face question.
 */
export function BmApplicationForm() {
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  // Focus follows the question only after the visitor has moved, so the page
  // does not jump to the form (or open a phone keyboard) on load.
  const hasMoved = useRef(false);

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const name = firstName(formData.fullName);

  useEffect(() => {
    if (hasMoved.current) fieldRef.current?.focus();
  }, [step]);

  // The success panel replaces the form, taking the focused button with it,
  // so focus would fall back to <body>. Moving it to the panel keeps a
  // keyboard or screen reader user on the confirmation.
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const goTo = (next: number) => {
    hasMoved.current = true;
    setDirection(next > step ? "forward" : "back");
    setStep(next);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, dropped } = filterInput(
      current === "fullName" ? "name" : current === "phone" ? "phone" : null,
      e.target.value
    );
    setFormData((prev) => ({ ...prev, [current]: value }));
    setErrors((prev) => ({ ...prev, [current]: dropped, form: undefined }));
  };

  const submit = async () => {
    // Every answer again, in case one was changed on the way back through.
    const firstBad = steps.findIndex((id) => checkField(id, formData));
    if (firstBad !== -1) {
      setErrors({ [steps[firstBad]]: checkField(steps[firstBad], formData) });
      if (firstBad !== step) goTo(firstBad);
      else fieldRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // The recipient is set server side in
      // app/api/business-mastery-application/route.ts, never posted from the
      // browser.
      const response = await fetch("/api/business-mastery-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, honeypot }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData(emptyForm);
        setStep(0);
        hasMoved.current = false;
        return;
      }

      const data = await response.json().catch(() => null);
      const serverErrors = (data?.errors ?? null) as FieldErrors | null;
      const badStep = serverErrors
        ? steps.findIndex((id) => serverErrors[id])
        : -1;
      if (serverErrors && badStep !== -1) {
        setErrors(serverErrors);
        if (badStep !== step) goTo(badStep);
        else fieldRef.current?.focus();
      } else {
        setErrors({
          form: `We couldn't send your application. Please try again. Reference: ${
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isLast) {
      void submit();
      return;
    }

    const problem = checkField(current, formData);
    if (problem) {
      setErrors((prev) => ({ ...prev, [current]: problem }));
      fieldRef.current?.focus();
      return;
    }
    goTo(step + 1);
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={`${cardClass} p-10 text-center focus:outline-none md:p-12`}
      >
        <CheckCircle2
          className="mx-auto mb-5 h-12 w-12 text-brass-400"
          aria-hidden="true"
        />
        <h3 className="ds-h3 mb-3">
          Application received
        </h3>
        <p className="mb-6 text-neutral-300">
          Thank you for applying to become a member. We&apos;ll review
          your application and reach out personally to talk through the next
          step.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brass-300 underline-offset-4 hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  const question = {
    fullName: "Let's start with your name.",
    email: name
      ? `Nice to meet you, ${name}. What's the best email for you?`
      : "What's the best email for you?",
    phone: "And a phone number we can reach you on?",
    story: "Last one. Tell us your story.",
  }[current];

  const error = errors[current];
  const fieldId = `bm-${current}`;
  const describedBy =
    [current === "story" ? "bm-story-hint" : null, error ? `${fieldId}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  const sharedFieldProps = {
    id: fieldId,
    name: current,
    value: formData[current],
    onChange: handleChange,
    required: true,
    "aria-required": "true" as const,
    "aria-invalid": error ? ("true" as const) : undefined,
    "aria-describedby": describedBy,
    className: `${inputClass} ${
      error ? "border-red-500/60" : "border-white/10 hover:border-white/20"
    }`,
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="bm-form-title"
      aria-describedby="bm-form-description"
      className={cardClass}
    >
      {/* Progress: a segment per question, lit as each one is answered. */}
      <div className="flex gap-1.5 px-6 pt-6 md:px-10 md:pt-8" aria-hidden="true">
        {steps.map((id, i) => (
          <span
            key={id}
            className={`h-1 flex-1 transition-colors duration-300 ${
              i <= step ? "bg-brass-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-between gap-4 px-6 pt-4 md:px-10">
        <h3 id="bm-form-title" className="font-mono text-xs uppercase tracking-[0.25em] text-brass-400">
          Apply to join
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.15em] tabular-nums text-neutral-400" aria-live="polite">
          Question {step + 1} of {steps.length}
        </p>
      </div>

      {/* Honeypot - visually hidden, ignored by real visitors */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="bm-company-fax">Leave this field empty</label>
        <input
          id="bm-company-fax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div
        key={current}
        className={`bm-apply-step bm-apply-step--${direction} px-6 pb-2 pt-8 md:px-10 md:pt-10`}
      >
        <label
          htmlFor={fieldId}
          className="ds-h3 block"
        >
          {question}
        </label>

        {current === "story" && (
          <p id="bm-story-hint" className="mt-4 text-sm leading-relaxed text-neutral-400">
            Where you are right now, what you&apos;re building or want to build,
            what&apos;s holding you back, and what you&apos;re hoping to get
            out of membership. An idea, a business you already run, or &ldquo;I
            don&apos;t know yet&rdquo; are all real answers.
          </p>
        )}

        <div className="mt-6">
          {current === "fullName" && (
            <input
              {...sharedFieldProps}
              ref={fieldRef as React.RefObject<HTMLInputElement>}
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              placeholder="First and last name"
              maxLength={FIELD_LIMITS.short}
            />
          )}
          {current === "email" && (
            <input
              {...sharedFieldProps}
              ref={fieldRef as React.RefObject<HTMLInputElement>}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={FIELD_LIMITS.email}
            />
          )}
          {current === "phone" && (
            <input
              {...sharedFieldProps}
              ref={fieldRef as React.RefObject<HTMLInputElement>}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(240) 000-0000"
              maxLength={FIELD_LIMITS.phone}
            />
          )}
          {current === "story" && (
            <textarea
              {...sharedFieldProps}
              ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
              rows={5}
              maxLength={FIELD_LIMITS.long}
              placeholder="The more we know, the better we can help."
              onKeyDown={(e) => {
                // Enter is a new line in the story; Ctrl/Cmd + Enter sends it.
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              className={`${sharedFieldProps.className} resize-y text-lg leading-relaxed md:text-xl`}
            />
          )}
        </div>

        {error && (
          <p id={`${fieldId}-error`} role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {errors.form && (
        <p
          role="alert"
          className="mx-6 mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 md:mx-10"
        >
          {errors.form}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-6 pt-8 md:px-10 md:pb-8">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 font-mono text-xs text-neutral-400 md:inline-flex">
            {isLast ? (
              "Ctrl or ⌘ + Enter to send"
            ) : (
              <>
                Press Enter
                <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-ds group inline-flex min-h-11 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLast ? (isSubmitting ? "Sending..." : "Send my application") : "Continue"}
            {!isLast && (
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      <p
        id="bm-form-description"
        className="border-t border-white/10 px-6 py-4 text-center text-xs text-neutral-400 md:px-10"
      >
        Four quick questions. No payment is taken here. We review every
        application and follow up personally.
      </p>
    </form>
  );
}
