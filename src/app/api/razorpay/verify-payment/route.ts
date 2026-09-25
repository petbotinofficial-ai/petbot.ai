import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";

type VerifyPayload = {
  orderId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

// Called by the Razorpay Checkout success handler on the client. This is a UX shortcut only —
// it never marks an order paid based solely on the client saying so. It cryptographically
// verifies the HMAC signature Razorpay returned, and the webhook handler (server-to-server,
// independent of the browser) is the authoritative source of truth for payment state.
export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as VerifyPayload | null;
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment verification request." }, { status: 400 });
  }

  const { data: payment } = await admin
    .from("payments")
    .select("id,status,razorpay_order_id,order_id")
    .eq("order_id", orderId)
    .maybeSingle();
  if (!payment || payment.razorpay_order_id !== razorpay_order_id) {
    return NextResponse.json({ error: "Order/payment mismatch." }, { status: 400 });
  }

  const isValid = verifyRazorpayPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!isValid) {
    await admin
      .from("payments")
      .update({ status: "rejected", failure_reason: "Signature verification failed" })
      .eq("order_id", orderId)
      .eq("status", "pending");
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  // Idempotent: if the webhook already verified this payment first, do nothing further.
  if (payment.status === "verified") {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const { error: paymentError } = await admin
    .from("payments")
    .update({ status: "verified", razorpay_payment_id, razorpay_signature, reviewed_at: new Date().toISOString() })
    .eq("order_id", orderId)
    .eq("status", "pending");
  if (paymentError) return NextResponse.json({ error: "Could not record payment." }, { status: 500 });

  await admin.from("orders").update({ status: "payment_verified" }).eq("id", orderId);

  return NextResponse.json({ ok: true });
}
