"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type CheckoutProduct = { id: string; name: string; slug: string; description: string; price: number; imageUrl: string; imageAlt: string };
type CheckoutResult = { orderId: string; orderNumber: string };

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: (response: unknown) => void) => void };
  }
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm({ product }: { product: CheckoutProduct }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<CheckoutResult | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (order) window.scrollTo({ top: 0 });
  }, [order]);

  async function startPayment(result: CheckoutResult) {
    setPayError("");
    const response = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId: result.orderId }),
    });
    const data = await response.json();
    if (!response.ok) {
      setPayError(data.error || "We could not start payment. Please try again.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setPayError("Could not load the payment window. Please check your connection and try again.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: "Petbot",
      description: product.name,
      prefill: { name: data.customerName, email: data.customerEmail, contact: data.customerPhone },
      notes: { order_number: data.orderNumber },
      theme: { color: "#2e2119" },
      handler: async (rawResponse: unknown) => {
        const paymentResponse = rawResponse as { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
        const verify = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: result.orderId, ...paymentResponse }),
        });
        if (verify.ok) {
          router.push(`/order-success?order=${encodeURIComponent(result.orderNumber)}`);
        } else {
          router.push(`/order-failed?order=${encodeURIComponent(result.orderNumber)}`);
        }
      },
      modal: {
        ondismiss: () => {
          router.push(`/order-cancelled?order=${encodeURIComponent(result.orderNumber)}`);
        },
      },
    });
    razorpay.on("payment.failed", () => {
      router.push(`/order-failed?order=${encodeURIComponent(result.orderNumber)}`);
    });
    razorpay.open();
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setMessage("Please accept the Terms & Conditions and policies to continue.");
      return;
    }
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
    setOrder(result);
    await startPayment(result);
    setSaving(false);
  }

  if (order) {
    return (
      <main className="checkout-page">
        <section className="checkout-success">
          <p className="eyebrow">Order created</p>
          <h1>Almost there.</h1>
          <p>Your order <strong>{order.orderNumber}</strong> is reserved. If the payment window didn&rsquo;t open, tap below to try again.</p>
          <button type="button" onClick={() => startPayment(order)} className="button button-dark payment-complete">Pay now →</button>
          {payError && <p className="form-message form-error" role="alert">{payError}</p>}
          <Link href="/" className="text-link">← Return to Petbot</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header"><Link href="/">← Petbot</Link><span>Secure checkout</span></header>
      <section className="checkout-layout">
        <div className="checkout-product">
          {product.imageUrl && <img src={product.imageUrl} alt={product.imageAlt} />}
          <p className="eyebrow">Your chosen tag</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong>₹{product.price.toFixed(2)}</strong>
        </div>
        <form className="checkout-form" onSubmit={placeOrder}>
          <div><p className="eyebrow">Personalisation</p><h2>Tell us about them.</h2></div>
          <div className="form-grid"><label>Pet name<input name="pet_name" required placeholder="Tommy" /></label><label>Breed <input name="breed" placeholder="Golden Retriever" /></label></div>
          <label>A note for the tag / profile<textarea name="message" rows={3} placeholder="Friendly, loves treats…" /></label>
          <label>Pet photo <input name="pet_photo" type="file" accept="image/jpeg,image/png,image/webp" /><small>Optional · JPG, PNG, or WebP · up to 8 MB. Your photo stays private and is visible only to Petbot.</small></label>
          <div><p className="eyebrow">Your details</p><h2>Where should it go?</h2></div>
          <div className="form-grid"><label>Your name<input name="customer_name" required autoComplete="name" /></label><label>Email<input name="customer_email" type="email" required autoComplete="email" /></label><label>Phone<input name="customer_phone" type="tel" required autoComplete="tel" /></label><label>PIN code<input name="pincode" inputMode="numeric" required autoComplete="postal-code" /></label></div>
          <label>Address<input name="line1" required autoComplete="street-address" /></label>
          <div className="form-grid"><label>City<input name="city" required autoComplete="address-level2" /></label><label>State<input name="state" required autoComplete="address-level1" /></label></div>
          <div className="checkout-total"><span>Total</span><strong>₹{product.price.toFixed(2)}</strong></div>
          <p className="form-message" style={{ marginTop: "-0.5rem" }}>Free shipping across India · Online payment only, no COD · Orders cannot be cancelled once placed.</p>
          <label className="checkout-policy-line">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
            <span>
              I agree to the <Link href="/terms-and-conditions" target="_blank">Terms &amp; Conditions</Link>, <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>, <Link href="/shipping-policy" target="_blank">Shipping Policy</Link>, and <Link href="/refund-and-cancellation" target="_blank">Refund &amp; Cancellation Policy</Link>, including that orders cannot be cancelled once placed.
            </span>
          </label>
          <button disabled={saving || !agreed} className="button button-dark checkout-submit">{saving ? "Processing…" : "Continue to payment →"}</button>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
