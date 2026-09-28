"use client";

import { getMetaContentId } from "./meta-content-ids";

export { getMetaContentId };

// window.fbq is defined synchronously by the inline base-Pixel snippet in src/app/layout.tsx
// (the snippet assigns a queueing shim to window.fbq before fbevents.js itself finishes
// loading), so by the time any component below can call this, it should already exist. If it
// doesn't — e.g. an ad blocker stripped the base snippet, or this ever runs before the root
// layout mounts — fail silently in production (never crash the page over analytics) but warn
// loudly in development so a missing/broken Pixel install is caught immediately instead of
// silently dropping events.
function fbq(...args: unknown[]) {
  const win = window as unknown as { fbq?: (...fbqArgs: unknown[]) => void };
  if (typeof win.fbq !== "function") {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[meta-pixel] window.fbq is not available; dropping event:", args);
    }
    return;
  }
  win.fbq(...args);
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
