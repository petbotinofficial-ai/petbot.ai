import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

type RazorpayWebhookEvent = {
  event: string;
  payload: {
    payment?: {
      entity?: {
        id: string;
        order_id: string;
        status: string;
        error_description?: string | null;
      };
    };
  };
};

// Server-to-server source of truth for payment state. Configure this URL + a webhook secret
// in the Razorpay dashboard (Settings -> Webhooks) for at least: payment.captured, payment.failed.
// The raw request body is read BEFORE JSON parsing because HMAC verification must run over the
// exact bytes Razorpay signed, not a re-serialised object.
export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  const paymentEntity = event.payload?.payment?.entity;
  if (!paymentEntity) return NextResponse.json({ ok: true, ignored: true });

  const { data: payment } = await admin
    .from("payments")
    .select("id,order_id,status,razorpay_payment_id")
    .eq("razorpay_order_id", paymentEntity.order_id)
    .maybeSingle();
  if (!payment) return NextResponse.json({ ok: true, ignored: true });

  // Idempotency: a payment already in a terminal state is never re-processed, so duplicate
  // webhook deliveries (Razorpay retries on any non-2xx, or genuine duplicate sends) are safe.
  if (payment.status === "verified" || payment.status === "rejected") {
    return NextResponse.json({ ok: true, alreadyProcessed: true });
  }

  if (event.event === "payment.captured") {
    await admin
      .from("payments")
      .update({ status: "verified", razorpay_payment_id: paymentEntity.id, reviewed_at: new Date().toISOString() })
      .eq("id", payment.id)
      .eq("status", "pending");
    await admin.from("orders").update({ status: "payment_verified" }).eq("id", payment.order_id).eq("status", "payment_pending");
  } else if (event.event === "payment.failed") {
    await admin
      .from("payments")
      .update({ status: "rejected", failure_reason: paymentEntity.error_description || "Payment failed" })
      .eq("id", payment.id)
      .eq("status", "pending");
    await admin.from("orders").update({ status: "payment_failed" }).eq("id", payment.order_id).eq("status", "payment_pending");
  }

  return NextResponse.json({ ok: true });
}
