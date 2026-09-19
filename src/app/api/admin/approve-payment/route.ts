import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { orderId } = await request.json().catch(() => ({}));
  if (typeof orderId !== "string") return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  const { data: order } = await supabase.from("orders").select("order_number,customer_name,customer_email").eq("id", orderId).maybeSingle();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { error: paymentError } = await supabase.from("payments").update({ status: "verified", reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq("order_id", orderId).eq("status", "submitted");
  if (paymentError) return NextResponse.json({ error: paymentError.message }, { status: 500 });
  const { error: orderError } = await supabase.from("orders").update({ status: "payment_verified" }).eq("id", orderId);
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: true, emailSent: false, message: "Payment approved. Buyer email is not configured yet." });
  const { error } = await new Resend(key).emails.send({ from: "Petbot Orders <onboarding@resend.dev>", to: [order.customer_email], subject: `Payment confirmed — ${order.order_number}`, text: `Hi ${order.customer_name},\n\nWe have verified your payment for order ${order.order_number}. Your order has been placed and we’ll begin preparing your Petbot tag.\n\nWith care,\nPetbot` });
  return NextResponse.json({ ok: true, emailSent: !error, message: error ? "Payment approved. The buyer email could not be sent yet." : "Payment approved and buyer confirmation email sent." });
}
