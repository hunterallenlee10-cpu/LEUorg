import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { DEFAULT_TO_EMAIL, sendEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { formatAmount } from "@/lib/money";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Events we act on: the invoices LEU sends through
 * /api/stripe/invoice. Everything else is acknowledged with a 200 so Stripe
 * stops retrying, but is otherwise ignored. The checkout events went with the
 * Support Us page on 2026-09-28; if the Dashboard endpoint still sends them,
 * they land in the ignored bucket.
 */
const HANDLED_EVENTS = new Set<Stripe.Event["type"]>([
  "payment_intent.payment_failed",
  "invoice.paid",
  "invoice.payment_failed",
]);

/**
 * Best-effort replay guard for a single serverless instance. Stripe can deliver
 * the same event more than once, and instances are recycled constantly — so
 * before this integration writes to a database or triggers fulfillment, back
 * this with a persisted `processed_events` table keyed on event id.
 */
const recentlyProcessed = new Map<string, number>();
const REPLAY_WINDOW_MS = 10 * 60 * 1000;

function alreadyProcessed(eventId: string): boolean {
  const now = Date.now();
  for (const [id, seenAt] of recentlyProcessed) {
    if (now - seenAt > REPLAY_WINDOW_MS) recentlyProcessed.delete(id);
  }
  if (recentlyProcessed.has(eventId)) return true;
  recentlyProcessed.set(eventId, now);
  return false;
}

async function notify(subject: string, lines: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    // Resend reports a rejected send (unverified sender, bad key, rate limit)
    // in the result rather than by throwing, and logs nothing itself in
    // production, so the result has to be checked here. Logged field by field
    // because the error object prints as "[object Object]" on Vercel.
    const { error } = await sendEmail({
      to: DEFAULT_TO_EMAIL,
      subject,
      text: lines.join("\n"),
    });
    if (error) {
      console.error(
        "[stripe] notification email rejected",
        `name=${error.name}`,
        `message=${error.message}`,
        `subject=${subject}`
      );
    }
  } catch (error) {
    // A failed notification must never fail the webhook — Stripe would retry
    // and we'd re-process a payment we already handled.
    console.error("[stripe] notification email failed:", error);
  }
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.warn(`[stripe] payment failed on ${intent.id} (${event.type})`);
      return;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await notify(
        `Invoice paid: ${formatAmount(invoice.amount_paid, invoice.currency)}`,
        [
          `Invoice: ${invoice.number ?? invoice.id}`,
          `Venture: ${invoice.metadata?.ventureId ?? "unknown"}`,
          `Amount paid: ${formatAmount(invoice.amount_paid, invoice.currency)}`,
          `Customer: ${invoice.customer_name ?? "unknown"} <${invoice.customer_email ?? "unknown"}>`,
        ]
      );
      return;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await notify(`Invoice payment failed: ${invoice.number ?? invoice.id}`, [
        `Invoice: ${invoice.number ?? invoice.id}`,
        `Customer: ${invoice.customer_email ?? "unknown"}`,
        `Amount due: ${formatAmount(invoice.amount_due, invoice.currency)}`,
        "Stripe will retry according to your dunning settings.",
      ]);
      return;
    }

    default:
      return;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // The signature is computed over the exact bytes Stripe sent, so the body must
  // be read raw — parsing it first would invalidate verification.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      payload,
      signature,
      secret
    );
  } catch (error) {
    console.error("[stripe] webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (alreadyProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    await handleEvent(event);
  } catch (error) {
    // Return 500 so Stripe retries — but drop the replay guard entry first, or
    // the retry would be discarded as a duplicate.
    recentlyProcessed.delete(event.id);
    console.error(`[stripe] handler failed for ${event.type}:`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
