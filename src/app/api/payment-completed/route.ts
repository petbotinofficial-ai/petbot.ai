import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const paymentRecipient = "petbot.inofficial@gmail.com";

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email service is not configured." }, { status: 503 });
  const body = await request.json().catch(() => null) as { orderNumber?: string; customerName?: string; customerEmail?: string; amount?: number } | null;
  if (!body || !/^PB-[A-F0-9]{8}$/.test(body.orderNumber ?? "") || !body.customerName || !body.customerEmail || !Number.isFinite(body.amount)) {
    return NextResponse.json({ error: "Invalid payment notification." }, { status: 400 });
  }
  const amount = body.amount as number;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Petbot Orders <onboarding@resend.dev>",
    to: [paymentRecipient],
    subject: `Payment review needed — ${body.orderNumber}`,
    text: `A customer marked a Petbot UPI payment as completed.\n\nOrder: ${body.orderNumber}\nCustomer: ${body.customerName}\nEmail: ${body.customerEmail}\nAmount: ₹${amount.toFixed(2)}\n\nOpen the Petbot Orders dashboard to review and approve the payment.`,
  });
  if (error) return NextResponse.json({ error: "Payment was saved, but the email could not be delivered." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
