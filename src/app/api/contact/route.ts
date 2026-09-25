import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { LEGAL_CONFIG } from "@/lib/legal-config";

type ContactPayload = {
  name?: string;
  email?: string;
  orderId?: string;
  category?: string;
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Support messaging is not configured yet." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as ContactPayload | null;
  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const message = body?.message?.trim() ?? "";
  const orderId = body?.orderId?.trim() ?? "";
  const category = body?.category?.trim() || "General question";

  if (!name || name.length > 120 || !EMAIL_PATTERN.test(email) || !message || message.length > 4000) {
    return NextResponse.json({ error: "Please provide a valid name, email, and message." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Petbot Support <onboarding@resend.dev>",
    to: [LEGAL_CONFIG.supportEmail],
    replyTo: email,
    subject: `Contact form: ${category}${orderId ? ` — ${orderId}` : ""}`,
    text: `Name: ${name}\nEmail: ${email}\nOrder ID: ${orderId || "N/A"}\nCategory: ${category}\n\nMessage:\n${message}`,
  });

  if (error) return NextResponse.json({ error: "We couldn't deliver your message. Please try again shortly." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
