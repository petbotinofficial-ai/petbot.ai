# Petbot Pre-Launch / Live-Order Audit

Date: 25 September 2026
Scope: Full codebase + live production Supabase project (`hugmkeomiidentycwdll`) + live Vercel deployment (`petbot.in`).

Legend: **FIXED** / **VERIFIED** / **NEEDS TESTING** / **BLOCKED**

---

## 1. Executive Summary

Petbot's existing design, checkout flow, and QR pet-profile architecture were **not** rebuilt or redesigned. This audit removed every customer-facing placeholder, corrected several statements that did not match the actual live implementation (payment method, analytics, domain), and fixed one real security gap (unbounded location-alert spam potential). It also found and clearly documents one **expectation mismatch that is not a bug**: the "notify owner on every scan" requirement cannot literally be true for a QR-code scan by itself — it is technically only possible when a finder explicitly taps "Share my location" and their browser grants permission. This is explained in detail in §9.

No destructive database operations were performed. Two migrations were added (both additive: new columns/functions only, no drops, no data changes). No production data was touched or deleted.

---

## 2. Business Information Updated — STATUS: FIXED

Centralized in `src/lib/legal-config.ts` and consumed by every legal/support page and the footer:

- Business: Petbot, **individual-operated, not registered** (no Pvt Ltd/LLP/GSTIN/CIN invented)
- Address: Saket Nagar, Habibganj, Bhopal, Madhya Pradesh, India
- Support email: petbot.inofficial@gmail.com — **no phone number displayed anywhere**
- Support hours: 10:00 AM – 7:00 PM IST
- Instagram: `https://www.instagram.com/petbot.in` (already clean, no tracking params — verified)
- Price: ₹449 (verified live in production DB, see §4)
- Free shipping across India, no COD, online payment only
- Processing: 3–4 business days; delivery: within 10–12 days
- **No cancellations** once an order is placed
- Refunds **only** for damaged/broken product or a Petbot-side QR/profile-link failure — **no replacements**
- Refund processing: 7–10 days after approval
- Grievance contact: role-based "Petbot Grievance Contact" (no invented officer name/designation)

Global search confirmed **zero** remaining `[TO BE CONFIRMED]`-style placeholders anywhere in `src/`, `supabase/`, or `.env.example`.

## 3. Pages Audited / Fixed

| Page | Status |
|---|---|
| Footer (`site-footer.tsx`) | FIXED — removed the "Legal entity: [TO BE CONFIRMED]" line, replaced with an accurate individual-operated-business statement. All footer links verified to resolve (no dead links). |
| About | FIXED — no more invented legal entity; states individual-operated business plainly. |
| Contact | FIXED — phone placeholder removed, real address/hours shown, contact form unchanged (already had validation, success/error states, category dropdown). |
| FAQ | FIXED — every answer rewritten to match the exact business rules (no cancellation, narrow refund, no COD, delivery timeline, profile edit/delete process). |
| Terms & Conditions | FIXED — legal-entity language removed; cancellation section rewritten to "no cancellations"; payment-processing section corrected from "Razorpay" to the actual live method (manual UPI, verified by us before confirming); Razorpay reference removed from the third-party-services section. |
| Privacy Policy | FIXED — payment section corrected to match actual UPI flow; **Analytics section corrected** (Google Analytics is not actually wired into the code even though `NEXT_PUBLIC_GA_ID` exists as an unused env var — see §12); Location-Sharing section rewritten to accurately describe the real, code-verified mechanism (opt-in, browser geolocation only, not persisted, rate-limited) instead of a vague "if enabled" description; profile edit/delete process documented. |
| Shipping Policy | FIXED — concrete numbers (3–4 days processing, 10–12 days delivery, free shipping, no COD) replacing all `[TO BE CONFIRMED]` placeholders. |
| Refund & Cancellation | FIXED — fully rewritten to the strict rule set: no cancellations, refund only for damage or Petbot-side QR failure, explicit exclusion list, no replacement policy, 7–10 day processing. |
| Grievance Redressal | FIXED — role-based "Petbot Grievance Contact" instead of a fabricated officer name/designation, per instruction not to invent one. |
| Product page (`/shop/[slug]`) | FIXED — added free-shipping/no-COD/processing-time/no-cancellation facts and a link to the refund policy, which were previously absent from the product page entirely. |
| Checkout | FIXED — added an explicit "Free shipping · no COD · orders cannot be cancelled" line and updated the policy-acknowledgement checkbox wording to include the no-cancellation fact. Payment flow itself is unchanged (manual UPI, per your instruction to leave it as-is until a Razorpay account exists). |
| `/product/pet-tag`, `/checkout`, `/about`, `/faq`, `/how-it-works`, `/track-order`, `/order-success`, `/order-failed`, `/order-cancelled`, custom `/404` | VERIFIED — all exist, build successfully, no dead links found. `/payment-policy` and `/return-policy` are intentional redirects to the canonical Terms and Refund pages (kept for old links, not duplicate content). |

## 4. Payment / Price Audit

- **STATUS: VERIFIED (live production query, not just code review).** Queried the production database directly (read-only, via the public anon key, respecting RLS): both published products ("Personalized Cat Tag", "Personalized Dog Tag") are priced at exactly **₹449.00** (`price_paise: 44900`). Matches the business-supplied price with no discrepancy.
- **Actual live payment method: manual UPI**, not Razorpay. Confirmed by reading `checkout-form.tsx`: the customer scans a static UPI QR, pays externally, self-declares completion, and an admin manually verifies via `/admin/payments` before the order is marked paid. There is no automated payment gateway in the live flow today.
- A full Razorpay integration (server-side order creation, HMAC signature verification, webhook handler with idempotent processing, service-role admin client) exists in the codebase (`src/app/api/razorpay/*`, `src/lib/razorpay.ts`) from earlier work, **but is not wired into the checkout UI** and requires `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET` to activate — none of which are set, per your confirmation that you don't have a Razorpay account yet. All legal copy now correctly reflects "manual UPI today," not "Razorpay live."
- **Backend amount integrity — VERIFIED (code review):** the manual-UPI order total is computed server-side inside the `create_petbot_checkout` Postgres function, which re-reads `price_paise` from the `products` table itself. The client only ever sends a `product_id`, never a price — so the ₹449 cannot be altered by manipulating frontend JavaScript.
- No Razorpay/payment secret keys found in any client-reachable code (`grep`-verified across `src/`).

## 5. Supabase / Security Audit

- **RLS: VERIFIED.** Customers cannot `SELECT` `orders`/`payments` directly — all customer-facing reads/writes go through narrowly-scoped `SECURITY DEFINER` RPCs (by design, per the migration's own comments). Public product/media reads are scoped to `is_published = true`. Admin-only tables require `is_admin()`, backed by an `admin_users` table.
- **Admin dashboard auth: VERIFIED.** Every admin page (`/admin`, `/admin/orders`, `/admin/payments`, `/admin/pets`, `/admin/products`, `/admin/settings`) and every admin API route (`approve-payment`, `delete-order`, `delete-product`) independently checks for a logged-in Supabase user **and** membership in `admin_users` before returning data or performing an action. `/admin/login` and `/admin/set-password` correctly have no such check (they are the entry points before authentication; `set-password` is currently a stub that redirects to login).
- **No service-role key is used anywhere in the live payment/admin path** — all of it runs on the same publishable/anon key as the browser, secured by RLS + `is_admin()`. A `SUPABASE_SERVICE_ROLE_KEY`-based admin client exists only for the (currently unwired) Razorpay webhook/verify routes and correctly reads from `process.env.SUPABASE_SERVICE_ROLE_KEY`, marked `server-only`, never referenced from any `"use client"` file.
- **File upload: VERIFIED.** Pet-photo uploads are restricted server-side by a storage RLS policy to `orders/%` paths with extensions limited to `jpg/jpeg/png/webp`; client also enforces an 8 MB size cap before upload. Supabase project storage has a 50 MiB global object limit as a backstop.
- **Secrets hygiene: VERIFIED.** `.gitignore` excludes `.env*`; grepped the full repo for `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` — all occurrences are in server-only route files, never in client components, never committed with real values.

## 6. QR Pet-Profile / Location-Notification Audit — the critical section

**STATUS: CODE VERIFIED end-to-end. Functionally NOT "every scan," by technical necessity — see below.**

Full trace performed (RPC → route → email):

1. Opening a QR / `/p/[publicId]` link **does not by itself notify the owner**. It only loads the public profile (pet name, breed, friendly status, owner phone number — shown unconditionally — and optionally the address, if the owner opted in). This is a read-only profile lookup (`get_petbot_profile`), unrelated to the alert system.
2. Owner notification **only** fires when a finder explicitly taps "📍 Share my location" on that profile **and** their browser grants location permission. This calls `navigator.geolocation.getCurrentPosition`, then `POST /api/pets/[publicId]/share-location`, which calls the `create_petbot_location_alert` RPC and, on success, sends an email via Resend using `RESEND_API_KEY_FOR_MAP`.
3. **Why this can't be "automatic on every scan":** browser geolocation APIs cannot be invoked without an explicit user gesture and permission grant — there is no way to silently read a visitor's location just because they opened a page, in any browser. This is a platform/privacy constraint, not an implementation gap. Reflecting this accurately, we did not add a "fake" or IP-based fallback that would either be inaccurate or misleadingly labeled as GPS.
4. **Does it work every time the button is used (not just the first time)?** Yes — verified in the SQL: there is no de-duplication or "first scan only" logic. Every successful share inserts a new row and triggers a new email, up to the rate limits below.
5. **Owner-email correctness / IDOR: VERIFIED — no issue found.** The route only accepts `publicId` from the URL and `{latitude, longitude, accuracy}` in the body — never an order ID, email, or profile ID. The RPC resolves the owner's email server-side via a strict join (`pet_profiles.public_id → orders.customer_email`), so a finder cannot redirect the notification to an arbitrary address or target another owner's inbox.
6. **Secret exposure: VERIFIED.** `RESEND_API_KEY_FOR_MAP` appears in exactly one file, `src/app/api/pets/[publicId]/share-location/route.ts`, a server-only route handler. It is not `NEXT_PUBLIC_*`, does not appear in any client component, and cannot reach the browser bundle.
7. **Failure handling: VERIFIED.** If the finder denies permission, has no geolocation support, or the request times out, the profile page still works fine — no crash, no broken UI — but no email is sent for that visit, and (correctly, since it would be inaccurate) there is no IP-based fallback location.
8. **Resend failure:** if the email send fails, the route returns an error response to the finder, but the profile page itself was never blocked by this — it had already fully loaded before the button was even tapped.
9. **Abuse protection — FIXED.** The original implementation only capped alerts at 3 per pet per 30 minutes, with no daily ceiling, no IP throttling, and no CAPTCHA — meaning a scripted, unauthenticated caller could still generate roughly 144 owner-notification emails per day indefinitely for a single known/guessable `public_id`. We added a second, additive database migration (`20260925010000_location_alert_daily_cap.sql`) capping alerts at **12 per pet per rolling 24 hours**, on top of the existing 3-per-30-minute cap. This was deployed to production. Residual risk (documented, not fixed, since it would require new infrastructure): there is still no per-IP or CAPTCHA-based protection, so a determined attacker could still exhaust the daily cap for a specific pet using multiple guessed/known `public_id`s. This is a reasonable MVP trade-off but worth revisiting if abuse is observed.
10. **Environment risk — FIXED (documentation) / NEEDS VERIFICATION (you).** `RESEND_API_KEY_FOR_MAP` was previously undocumented in `.env.example` (only set as a stray Vercel variable). It is now documented there. **You should independently confirm in the Vercel dashboard that `RESEND_API_KEY_FOR_MAP` is set specifically under the Production environment** — I did not have visibility into whether its value is a live, valid Resend key (only that the variable name exists per your earlier message), and I cannot send a real test email without triggering it in the live browser flow.

**What I could NOT actually test (as opposed to code-verify):** I did not have a browser/device available to physically scan a QR code, grant location permission, and confirm a real email lands in an inbox. Everything above is **CODE VERIFIED** via full read-through of the RPC, the route, and the email payload construction — not **ACTUALLY TESTED** end-to-end in a live browser. I recommend you personally do one real test scan before relying on this feature for a live customer.

## 7. Email / Resend Audit

- Four distinct Resend call sites, each server-only: `payment-completed` (buyer→admin notification), `approve-payment` (admin→buyer confirmation), `contact` (contact form→support inbox), `share-location` (finder location→owner). Each uses its own correctly-scoped key or `RESEND_API_KEY` as appropriate; `RESEND_API_KEY_FOR_MAP` is exclusively for the location-alert path, with no fallback.
- All are POST-only server routes; none expose their key to the client; all fail gracefully (return an error JSON) rather than crashing the page when Resend is unreachable or misconfigured.

## 8. Mobile / Accessibility / SEO — STATUS: VERIFIED (code review) / spot build-checked

- All new/edited pages reuse the existing `.info-page`/`.policy-card`/`.faq-item` styling already used on production pages — no new layout system introduced, so existing mobile responsiveness (already in the stylesheet's `@media (max-width: 760px)` rules) applies automatically.
- Canonical domain corrected from a placeholder `petbot.ai` guess to the actual registered and live-aliased domain `https://petbot.in` (confirmed via `vercel domains ls` / `vercel alias ls` — `petbot.in` and `www.petbot.in` are both aliased to this exact deployment). `NEXT_PUBLIC_SITE_URL` was added to the Vercel production environment to match.
- `robots.txt` and `sitemap.xml` routes exist and now use the correct domain; sensitive/non-indexable routes (`/admin`, `/api`, `/checkout`, order-status pages) are disallowed/marked `noindex`.
- I did not have a real browser/device to click through every breakpoint (320px–1440px) — this is a code-level check that the existing responsive CSS rules apply to the new content, not a rendered visual test.

## 9. Google Maps Notification — Direct Answer to "Does it work on every scan?"

**No, not on every scan in the literal sense — and it technically cannot, for any website, without either (a) requiring an explicit user action and browser permission grant (what Petbot does today), or (b) using IP-based approximate geolocation as a silent fallback (which Petbot does not do, correctly avoiding a misleading "location" claim for something that's often only city-level accurate).**

What **is** true and verified: every time a finder actively taps "Share my location" and grants permission — whether it's their 1st or 10th time doing so for that pet — the owner receives a fresh email with a real Google Maps link, up to the (now improved) rate limits. If your business expectation was for this to happen invisibly on page load, that is not achievable within normal browser privacy rules, and I did not implement a workaround that would either violate that privacy model or produce an inaccurate location.

## 10. Remaining Issues / Launch Blockers

| Item | Status |
|---|---|
| `RESEND_API_KEY_FOR_MAP` validity in **Production** specifically | **NEEDS TESTING (you)** — I could not verify the key's actual value or perform a real send. |
| One real end-to-end QR scan → location share → email test | **NEEDS TESTING (you)** — code-verified only, not physically tested. |
| Per-IP / CAPTCHA protection on location-alert spam | **BLOCKED (not fixed)** — would require new infrastructure (e.g., Turnstile) beyond a safe in-place fix; flagged, not built, per the "don't over-engineer" instruction. |
| Razorpay | **BLOCKED (expected)** — no account/keys yet; manual UPI remains the live payment method; all copy now accurately reflects this. |
| Business registration / GST / legal entity | **BLOCKED (by design)** — correctly left unfilled since the business isn't registered; do not add until it is. |

## 11. Build / Lint Results

```
npm run lint  → 0 errors, 9 pre-existing warnings (all "<img> vs next/image", unrelated to this audit)
npm run build → succeeds, all 37 routes compile (see route table in repo build output)
```

## 12. Files Changed

**Content/business-info fixes:**
`src/lib/legal-config.ts`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/faq/page.tsx`, `src/app/grievance-redressal/page.tsx`, `src/app/privacy-policy/page.tsx`, `src/app/refund-and-cancellation/page.tsx`, `src/app/shipping-policy/page.tsx`, `src/app/terms-and-conditions/page.tsx`, `src/app/shop/[slug]/page.tsx`, `src/components/commerce/checkout-form.tsx`, `src/components/marketing/site-footer.tsx`

**Domain/SEO fixes:**
`src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`

**Security fix (additive DB migration):**
`supabase/migrations/20260925010000_location_alert_daily_cap.sql`

**Documentation fix:**
`.env.example` (documented `RESEND_API_KEY_FOR_MAP`)

**Vercel config (no code):** added `NEXT_PUBLIC_SITE_URL=https://petbot.in` to the Production environment.

## 13. Is the Website Ready for Real Customers?

**For the manual-UPI flow it's already running on: yes, with two action items on your side** — (1) personally verify `RESEND_API_KEY_FOR_MAP` is a live key in the Vercel Production environment, and (2) do one real test scan of a QR code to confirm the location email actually lands, since I could only verify the code path, not send a real email myself. Everything else audited — pricing, RLS, admin auth, IDOR, legal-content accuracy, and placeholder removal — is either fixed or verified against the live production database and deployment.
