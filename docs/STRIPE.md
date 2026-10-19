# Stripe Integration — Lee Enterprises Unlimited

- **Stripe API version:** `2026-06-24.dahlia` (pinned in `lib/stripe.ts`)
- **SDK:** `stripe` 22.3.x for Node
- **Framework:** Next.js 16 App Router, Node runtime for all Stripe routes
- **Account model:** one Stripe account covering Lee Systems Co. (formerly Lee Marketing Mastery, still tagged `lmm`), plus H1 and Thread invoicing (`docs/H1.md`, `docs/THREAD.md`)

Two flows are live in code:

| Flow | Route | Who calls it |
| --- | --- | --- |
| **Invoicing** — quoted work | `POST /api/stripe/invoice` | Internal only |
| **Client billing** — payment links | `/pay/admin`, `/pay/{id}` | The owner makes them; clients pay |

Invoicing is admin-only and has no UI. Client billing has its own doc,
[docs/PAY.md](PAY.md). Payment events come back through
`POST /api/stripe/webhook` (§4).

---

## 1. Removed: the Support flow (2026-09-28)

The public "Support Us" page (`/support`), its pay-what-you-choose Checkout
route (`/api/stripe/support`), its success and canceled pages, the
`SupportForm` component, `lib/support-config.ts` and `scripts/stripe-setup.mjs`
came off the site on 2026-09-28: the site covers LEU, Lee Systems Co. and
Business Mastery only, with no donation or tip pages. `/support` and its
sub-pages now 301 to the homepage (`next.config.mjs`). The webhook's
`checkout.session.*` handling went with it; invoicing is untouched.

Nothing in Stripe or Vercel was changed from the code side. Cleanup you can do
by hand, whenever convenient:

- In Vercel, delete `STRIPE_PRICE_SUPPORT_CUSTOM` and `NEXT_PUBLIC_SITE_URL`;
  nothing reads either one now.
- In Stripe, archive the "Support Lee Enterprises Unlimited" Product and its
  custom-amount Price (lookup key `leu_support_custom_amount`).
- On the webhook endpoint, unsubscribe the `checkout.session.*` events. If they
  keep arriving they are acknowledged with a 200 and ignored.
- A restricted key scoped only for the support flow (Checkout Sessions,
  Products, Prices) can be rolled or narrowed to the invoicing permissions in
  §3.1.

The code is in git history if a checkout is ever wanted again (Business
Mastery's planned member checkout, say).

---

## 2. Invoicing

`POST /api/stripe/invoice` is **admin-only** — it creates receivables and emails
real customers, so it requires a bearer token and must never be called from a
browser.

```bash
curl https://www.leeenterprisesunlimited.com/api/stripe/invoice \
  -X POST \
  -H "Authorization: Bearer $STRIPE_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": { "email": "client@example.com", "name": "Example Co" },
    "ventureId": "lmm",
    "daysUntilDue": 14,
    "description": "Lead follow-up automation — Example Co",
    "lines": [
      { "description": "Automation build", "amountCents": 150000 }
    ]
  }'
```

Finds or creates the Customer by email, opens a draft with
`collection_method: "send_invoice"`, attaches each line, finalizes, and sends.
Response includes `hostedInvoiceUrl` and `invoicePdf`.

Pass `"send": false` to stop at the draft and review it in the Dashboard
first. It is left unfinalized, so it is not yet numbered and its lines can
still be edited; finalize and send it from the Dashboard. The response then
has `"status": "draft"` and `null` for `hostedInvoiceUrl` and `invoicePdf`.

Customers are reused by email so each client accumulates one payment history.

`ventureId` must be one of `lmm`, `h1`, `thread` — it tags the
invoice for per-venture reporting inside the single shared account. H1
Performance is off the LEU site entirely (`docs/H1.md`) and its own site takes
no payment, but H1 clients are still invoiced from here, so the tag is
unchanged. This route sits behind `STRIPE_ADMIN_TOKEN` and renders nothing, so
accepting `h1` says nothing to a visitor about which ventures LEU lists.
Thread T-Shirts is the same case since 2026-09-25 (`docs/THREAD.md`): off this
site entirely, taking no payment on its own, and invoiced from here, tagged
`thread`, as before.

---

## 3. Setup

### 3.1 Use a restricted key

Create a **restricted API key** (`rk_...`) at
<https://dashboard.stripe.com/apikeys> rather than using the account secret key.
Grant only:

| Resource | Permission |
| --- | --- |
| Customers | Write |
| Invoices | Write |
| PaymentIntents | Read |
| Products | Write (client billing) |
| Prices | Write (client billing) |
| Payment Links | Write (client billing) |

Stripe has folded invoice items into the **Invoices** permission — there is no
separate "Invoice Items" row to grant.

Separate key per environment (test / preview / production), with an access
policy on each. Permissions can be edited after creation, so start narrow.

### 3.2 Environment variables

`.env.local` locally; **sensitive** environment variables in Vercel for
production, so values are write-only and never surface in logs.

Required: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_ADMIN_TOKEN`.

```bash
openssl rand -base64 32   # STRIPE_ADMIN_TOKEN
```

### 3.3 Pre-commit key scanner

```bash
git config core.hooksPath .githooks
```

Audit any time with `./scripts/check-secrets.sh --all`.

---

## 4. Webhooks

The webhook is the **only** trustworthy signal that money moved.

### Local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the printed whsec_... into STRIPE_WEBHOOK_SECRET
stripe trigger invoice.paid
```

### Production

Endpoint `https://www.leeenterprisesunlimited.com/api/stripe/webhook`,
subscribed to:

`invoice.paid`, `invoice.payment_failed`, `payment_intent.payment_failed`

Every event is signature-verified against the raw request body before anything
else runs. `invoice.*` events email ceo@leeenterprisesunlimited.com through the Resend
account the site's forms already use; a failed payment intent is logged.

**The hostname must be canonical.** Stripe does not follow redirects. Register
the apex when the site redirects apex → `www` and every delivery fails with a
redirect, having never reached the route — the response time looks healthy
because the edge answered, not the app. Use the `www` host.

A `200` here does not prove the notification email sent. `notify()` returns
silently when `RESEND_API_KEY` is unset, and logs a Resend error (as
`[stripe] notification email rejected` or `... failed`) rather than failing,
so a failed email never fails the webhook. Confirm delivery by reading the
inbox, not the status code.

### Before automating fulfillment

The replay guard is in-memory, which is best-effort on serverless where
instances recycle constantly. Fine for notification email. Before the webhook
does anything that must not happen twice, back it with a persisted
`processed_events` table keyed on `event.id`.

### Test cards

`4242 4242 4242 4242` succeeds, `4000 0000 0000 0002` declines, and
`4000 0025 0000 3155` requires 3D Secure. Any future expiry, any CVC.

---

## 5. Tax

Stripe Tax is intentionally **not** enabled.

Setting `automatic_tax: { enabled: true }` without an active registration means
Stripe calculates and collects **nothing** and returns **no error** — you would
believe tax was handled while it silently wasn't.

To enable Stripe Tax properly: register where you have nexus, add registrations
at <https://dashboard.stripe.com/tax>, assign product tax codes, then turn on
`automatic_tax`. Confirm treatment with your accountant first.

---

## 6. Security

- Keys never in source; pre-commit hook enforces it.
- Restricted keys over secret keys, one per environment.
- All Stripe calls are server-side.
- Webhook signatures verified on the raw body before handling.
- Invoices are paid on Stripe's hosted invoice page, and client billing
  links on Stripe's hosted checkout, so the site loads no
  Stripe.js and embeds no Stripe UI, and the CSP in `next.config.mjs` allows no
  Stripe hosts. Adopting Stripe.js or embedded Checkout means adding
  `https://*.stripe.com` (and `https://*.link.com` for Link) to
  script/frame/connect. `'unsafe-inline'` is present for Next's hydration
  bootstrap; to remove it, emit a per-request nonce from `proxy.ts` (Next 16's
  name for middleware; a nonce and `'unsafe-inline'` cannot be combined —
  browsers ignore the latter when a nonce is present).
- Route errors log server-side and return generic messages so account detail
  doesn't leak.
- If a key is ever exposed, roll it at <https://dashboard.stripe.com/apikeys>,
  then review Workbench request logs for unrecognized activity.

---

## 7. Go-live checklist

- [ ] Swap test keys for live restricted keys (Vercel sensitive env vars)
- [ ] Register the production webhook endpoint on the `www` host, subscribed
      to every event in §4, and set its signing secret
- [ ] Redeploy — env vars do nothing until a fresh build
- [ ] Enable the payment methods you want in Dashboard → Payment methods
- [ ] Decide on Stripe Tax (§5) with your accountant
- [ ] Persist webhook idempotency before automating fulfillment
- [ ] `git config core.hooksPath .githooks` on every clone
- [ ] Review <https://docs.stripe.com/get-started/checklist/go-live>

---

## 8. Deferred

- **Checkout.** Business Mastery's member checkout (docs/BUSINESS-MASTERY.md,
  Phase C) would bring a Checkout route back; the removed support flow in git
  history is a working pattern for it.
- **Connect.** Only relevant if LEU ever collects on behalf of independent
  operators. Standard accounts are the safe default.
- **A database.** Payments notify by email and live in Stripe. Durable records
  and idempotent fulfillment need persistence.
