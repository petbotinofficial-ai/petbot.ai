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
  await supabase.from("payments").update({ status: "verified", reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq("order_id", orderId);
  await supabase.from("orders").update({ status: "payment_verified" }).eq("id", orderId);
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Payment approved, but email is not configured." }, { status: 503 });
  const { error } = await new Resend(key).emails.send({ from: "Petbot Orders <onboarding@resend.dev>", to: [order.customer_email], subject: `Payment confirmed — ${order.order_number}`, text: `Hi ${order.customer_name},\n\nWe have verified your payment for order ${order.order_number}. Your order has been placed and we’ll begin preparing your Petbot tag.\n\nWith care,\nPetbot` });
  return error ? NextResponse.json({ error: "Payment approved, but confirmation email could not be sent." }, { status: 502 }) : NextResponse.json({ ok: true });
}
