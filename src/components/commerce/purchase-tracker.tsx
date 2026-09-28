"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMetaContentId, trackPurchase } from "@/lib/meta-pixel";

// The browser never decides whether payment succeeded and never creates the Meta event_id —
// get_petbot_meta_purchase_event is read-only and only returns data once a server-side,
// signature-verified route (Razorpay webhook / verify-payment) has already marked the order
// 'payment_verified' and created the event_id via claim_petbot_meta_capi_attempt. This component
// only forwards that existing event_id to the browser Pixel so Meta can deduplicate it against
// the server-side Conversions API Purchase for the same order. If this never runs (browser
// closed, ad-blocker, no JS), the CAPI event fired from the server is still the durable record —
// this is additive attribution, not the source of truth.
export function PurchaseTracker({ orderNumber, trackingToken }: { orderNumber: string; trackingToken: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    (async () => {
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase.rpc("get_petbot_meta_purchase_event", {
        p_order_number: orderNumber,
        p_tracking_token: trackingToken,
      });
      const row = data?.[0];
      if (!row || !row.event_id) return;
      const contentIds = ((row.product_slugs as string[]) || [])
        .map((slug) => getMetaContentId(slug))
        .filter((id): id is string => Boolean(id));
      trackPurchase(contentIds, row.total_paise / 100, row.event_id as string);
    })();
  }, [orderNumber, trackingToken]);

  return null;
}
