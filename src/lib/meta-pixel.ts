"use client";

import { getMetaContentId } from "./meta-content-ids";

export { getMetaContentId };

function fbq(...args: unknown[]) {
  const win = window as unknown as { fbq?: (...fbqArgs: unknown[]) => void };
  win.fbq?.(...args);
}

export function trackViewContent(productSlug: string, value: number) {
  const contentId = getMetaContentId(productSlug);
  if (!contentId) return;
  fbq("track", "ViewContent", { content_ids: [contentId], content_type: "product", value, currency: "INR" });
}

export function trackAddToCart(productSlug: string, value: number) {
  const contentId = getMetaContentId(productSlug);
  if (!contentId) return;
  fbq("track", "AddToCart", { content_ids: [contentId], content_type: "product", value, currency: "INR" });
}

export function trackInitiateCheckout(productSlug: string, value: number) {
  const contentId = getMetaContentId(productSlug);
  if (!contentId) return;
  fbq("track", "InitiateCheckout", { content_ids: [contentId], content_type: "product", value, currency: "INR" });
}

// eventId must come from the database (see get_petbot_meta_purchase_event) — the browser never
// creates it. Sending it alongside content_ids/value/currency lets Meta deduplicate this browser
// event against the server-side Conversions API Purchase fired from the Razorpay
// webhook/verify-payment routes for the same order, so a successful browser fire is additive
// attribution signal, never the thing that determines whether Purchase was recorded at all.
export function trackPurchase(contentIds: string[], value: number, eventId: string) {
  if (!contentIds.length) return;
  fbq("track", "Purchase", { content_ids: contentIds, content_type: "product", value, currency: "INR" }, { eventID: eventId });
}
