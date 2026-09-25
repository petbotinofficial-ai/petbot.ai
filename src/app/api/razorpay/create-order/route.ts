import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRazorpayClient } from "@/lib/razorpay";

// Creates a Razorpay order for an existing Petbot order. The charge amount always comes from
// the `orders` row already written server-side by the `create_petbot_checkout` RPC (which itself
// re-reads the product price from the database) — the client never supplies or influences price.
export async function POST(request: NextRequest) {
  const razorpay = getRazorpayClient();
  if (!razorpay) return NextResponse.json({ error: "Card/UPI payments are not configured yet.", notConfigured: true }, { status: 503 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

  const body = await request.json().catch(() => null) as { orderId?: string } | null;
  const orderId = body?.orderId;
  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }

  const { data: order } = await admin
    .from("orders")
    .select("id,order_number,customer_name,customer_email,customer_phone,total_paise,status")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.status !== "payment_pending") {
    return NextResponse.json({ error: "This order has already been processed." }, { status: 409 });
  }

  const { data: payment } = await admin.from("payments").select("id,status,razorpay_order_id").eq("order_id", orderId).maybeSingle();
  if (!payment || payment.status !== "pending") {
    return NextResponse.json({ error: "This order has already been processed." }, { status: 409 });
  }

  let razorpayOrderId = payment.razorpay_order_id;
  if (!razorpayOrderId) {
    const razorpayOrder = await razorpay.orders.create({
      amount: order.total_paise,
      currency: "INR",
      receipt: order.order_number,
      notes: { petbot_order_id: order.id, petbot_order_number: order.order_number },
    });
    razorpayOrderId = razorpayOrder.id;
    const { error: updateError } = await admin
      .from("payments")
      .update({ method: "razorpay", razorpay_order_id: razorpayOrderId })
      .eq("order_id", orderId)
      .eq("status", "pending");
    if (updateError) return NextResponse.json({ error: "Could not initialise payment." }, { status: 500 });
  }

  return NextResponse.json({
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId,
    amount: order.total_paise,
    currency: "INR",
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
  });
}
