import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getMetaContentId } from "./meta-content-ids";

// Same Dataset the browser Pixel (src/app/layout.tsx) initializes. Do not create a second
// Pixel/Dataset for server-side delivery — CAPI and the browser Pixel must report to the same
// Dataset ID for Meta's event_id deduplication to apply.
const META_PIXEL_ID = "1134116805951491";

// Bounded retry budget: each call to claim_petbot_meta_capi_attempt consumes one attempt whether
// or not the Graph API call ultimately succeeds, so a permanently failing config (e.g. an
// expired token) stops retrying after this many webhook/verify-payment deliveries instead of
// retrying forever. meta_capi_last_error is left in place for operator visibility either way.
const MAX_CAPI_ATTEMPTS = 5;

type CapiClaimRow = {
  event_id: string;
  total_paise: number;
  product_slugs: string[] | null;
  fbp: string | null;
  fbc: string | null;
};

async function sendMetaPurchaseCapiEvent(input: {
  eventId: string;
  contentIds: string[];
  valueRupees: number;
  fbp?: string | null;
  fbc?: string | null;
  eventSourceUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) return { ok: false, error: "META_CAPI_ACCESS_TOKEN is not configured" };

  const graphApiVersion = process.env.META_GRAPH_API_VERSION;
  if (!graphApiVersion) return { ok: false, error: "META_GRAPH_API_VERSION is not configured" };

  if (!input.contentIds.length) return { ok: false, error: "No Meta catalog content_id resolved for this order's products" };

  const userData: Record<string, string> = {};
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          content_ids: input.contentIds,
          content_type: "product",
          value: input.valueRupees,
          currency: "INR",
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphApiVersion}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) },
    );
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      // Never log accessToken — it isn't part of the body/response, only confirm it isn't echoed.
      return { ok: false, error: `Meta CAPI responded ${response.status}: ${detail.slice(0, 400)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown network error calling Meta CAPI" };
  }
}

// Call this from both the Razorpay webhook and the verify-payment route once an order's status
// is 'payment_verified'. Safe to call repeatedly (webhook retries, races between the two routes,
// an order that was already delivered): claim_petbot_meta_capi_attempt only returns a row when
// there is genuinely an attempt budget left and meta_capi_sent_at is still null, and it is the
// one place that creates/reuses the stable event_id (never the browser).
export async function attemptMetaPurchaseCapiDelivery(admin: SupabaseClient, orderId: string) {
  const { data } = await admin.rpc("claim_petbot_meta_capi_attempt", {
    p_order_id: orderId,
    p_max_attempts: MAX_CAPI_ATTEMPTS,
  });
  const claim = (data?.[0] as CapiClaimRow | undefined) ?? undefined;
  if (!claim) return;

  const contentIds = (claim.product_slugs ?? [])
    .map((slug) => getMetaContentId(slug))
    .filter((id): id is string => Boolean(id));

  const result = await sendMetaPurchaseCapiEvent({
    eventId: claim.event_id,
    contentIds,
    valueRupees: claim.total_paise / 100,
    fbp: claim.fbp,
    fbc: claim.fbc,
    eventSourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://petbot.in"}/order-success`,
  });

  if (result.ok) {
    await admin.from("orders").update({ meta_capi_sent_at: new Date().toISOString(), meta_capi_last_error: null }).eq("id", orderId);
  } else {
    await admin.from("orders").update({ meta_capi_last_error: result.error.slice(0, 500) }).eq("id", orderId);
  }
}
