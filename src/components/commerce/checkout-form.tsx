"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FormEvent, useState } from "react";

type CheckoutProduct = { id: string; name: string; slug: string; description: string; price: number; imageUrl: string; imageAlt: string };
type CheckoutResult = { orderId: string; orderNumber: string };

export function CheckoutForm({ product }: { product: CheckoutProduct }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<CheckoutResult | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return setMessage("Checkout is not configured yet. Please try again shortly.");
    const form = new FormData(event.currentTarget);
    const photo = form.get("pet_photo");
    const payload = {
      p_customer_name: String(form.get("customer_name") ?? "").trim(),
      p_customer_email: String(form.get("customer_email") ?? "").trim(),
      p_customer_phone: String(form.get("customer_phone") ?? "").trim(),
      p_shipping_address: { line1: String(form.get("line1") ?? "").trim(), city: String(form.get("city") ?? "").trim(), state: String(form.get("state") ?? "").trim(), pincode: String(form.get("pincode") ?? "").trim() },
      p_product_id: product.id,
      p_personalization: { pet_name: String(form.get("pet_name") ?? "").trim(), breed: String(form.get("breed") ?? "").trim(), message: String(form.get("message") ?? "").trim() },
    };
    if (!payload.p_shipping_address.line1 || !payload.p_shipping_address.city || !payload.p_shipping_address.state || !payload.p_shipping_address.pincode || !payload.p_personalization.pet_name) return setMessage("Please complete your pet and delivery details.");
    if (photo instanceof File && photo.size > 8 * 1024 * 1024) return setMessage("Choose a pet photo smaller than 8 MB.");
    setSaving(true); setMessage("");
    const { data, error } = await supabase.rpc("create_petbot_checkout", payload);
    if (error || !data?.[0]) { setSaving(false); return setMessage(error?.message || "We could not create your order. Please try again."); }
    const result = { orderId: data[0].order_id as string, orderNumber: data[0].order_number as string };
    if (photo instanceof File && photo.size) {
      const extension = photo.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `orders/${result.orderId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("pet-media").upload(path, photo, { contentType: photo.type, upsert: false });
      if (!uploadError) await supabase.rpc("attach_petbot_photo", { p_order_id: result.orderId, p_photo_path: path });
    }
    setSaving(false); setOrder(result);
  }

  async function markPaymentCompleted() {
    const supabase = createClient();
    if (!supabase || !order) return;
    const { data, error } = await supabase.rpc("confirm_petbot_payment", { p_order_id: order.orderId });
    if (error || !data?.[0]) return setPaymentMessage("Payment review is not configured yet. Petbot needs to run the payment-review migration in Supabase before this button can notify the team.");
    const email = await fetch("/api/payment-completed", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderNumber: data[0].order_number, customerName: data[0].customer_name, customerEmail: data[0].customer_email, amount: data[0].total_paise / 100 }) });
    setPaymentMessage(email.ok ? "We’ll verify your payment within 5–10 minutes. If it is successful, we’ll email you to confirm that your order has been placed." : "Payment completion was saved. Petbot will review it in the dashboard shortly.");
  }

  const upiUrl = `upi://pay?pa=petbot%40ptyes&pn=Petbot&am=${product.price.toFixed(2)}&cu=INR`;
  if (order) return <main className="checkout-page"><section className="checkout-success"><p className="eyebrow">Order created</p><h1>Thank you.</h1><p>Your order <strong>{order.orderNumber}</strong> is reserved. When you are ready, tap below to open the secure UPI payment step.</p>{!paymentOpen ? <button type="button" onClick={() => setPaymentOpen(true)} className="button button-dark payment-complete">Pay via UPI →</button> : <><div className="upi-panel"><img src="/media/petbot-upi-qr.jpeg" alt="Payment QR code" /><div><p className="eyebrow">Payment QR</p><strong>₹{product.price.toFixed(2)}</strong><span>Scan with any UPI app to make payment.</span><a className="button button-dark" href={upiUrl}>Open UPI app ↗</a></div></div><button type="button" onClick={markPaymentCompleted} className="button button-dark payment-complete">I’ve completed payment</button>{paymentMessage && <p className="payment-message" role="status">{paymentMessage}</p>}</>}<Link href="/" className="text-link">← Return to Petbot</Link></section></main>;

  return <main className="checkout-page"><header className="checkout-header"><Link href="/">← Petbot</Link><span>Secure checkout</span></header><section className="checkout-layout"><div className="checkout-product">{product.imageUrl && <img src={product.imageUrl} alt={product.imageAlt} />}<p className="eyebrow">Your chosen tag</p><h1>{product.name}</h1><p>{product.description}</p><strong>₹{product.price.toFixed(2)}</strong></div><form className="checkout-form" onSubmit={placeOrder}><div><p className="eyebrow">Personalisation</p><h2>Tell us about them.</h2></div><div className="form-grid"><label>Pet name<input name="pet_name" required placeholder="Tommy" /></label><label>Breed <input name="breed" placeholder="Golden Retriever" /></label></div><label>A note for the tag / profile<textarea name="message" rows={3} placeholder="Friendly, loves treats…" /></label><label>Pet photo <input name="pet_photo" type="file" accept="image/jpeg,image/png,image/webp" /><small>Optional · JPG, PNG, or WebP · up to 8 MB. Your photo stays private and is visible only to Petbot.</small></label><div><p className="eyebrow">Your details</p><h2>Where should it go?</h2></div><div className="form-grid"><label>Your name<input name="customer_name" required autoComplete="name" /></label><label>Email<input name="customer_email" type="email" required autoComplete="email" /></label><label>Phone<input name="customer_phone" type="tel" required autoComplete="tel" /></label><label>PIN code<input name="pincode" inputMode="numeric" required autoComplete="postal-code" /></label></div><label>Address<input name="line1" required autoComplete="street-address" /></label><div className="form-grid"><label>City<input name="city" required autoComplete="address-level2" /></label><label>State<input name="state" required autoComplete="address-level1" /></label></div><div className="checkout-total"><span>Total</span><strong>₹{product.price.toFixed(2)}</strong></div><button disabled={saving} className="button button-dark checkout-submit">{saving ? "Creating your order…" : "Continue to UPI payment →"}</button>{message && <p className="form-message" role="status">{message}</p>}</form></section></main>;
}
