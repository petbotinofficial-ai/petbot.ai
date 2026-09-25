"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";

type OrderStatus = {
  orderNumber: string;
  status: string;
  createdAt: string;
  totalPaise: number;
};

const TIMELINE_STEPS = ["payment_pending", "payment_verified", "in_production", "shipped", "delivered"] as const;

const STATUS_LABELS: Record<string, string> = {
  payment_pending: "Order Confirmed",
  payment_submitted: "Order Confirmed",
  payment_verified: "Processing",
  in_production: "Customization",
  shipped: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment Failed",
};

export function TrackOrderForm() {
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return setError("Order tracking is not configured yet.");
    const form = new FormData(event.currentTarget);
    const orderNumber = String(form.get("order_number") ?? "").trim();
    const contact = String(form.get("contact") ?? "").trim();
    if (!orderNumber || !contact) return setError("Please enter your order ID and registered email or phone number.");

    setLoading(true);
    setError("");
    setResult(null);
    const { data, error: rpcError } = await supabase.rpc("get_petbot_order_status", {
      p_order_number: orderNumber,
      p_contact: contact,
    });
    setLoading(false);
    const row = data?.[0];
    if (rpcError || !row) {
      setError("We couldn't find an order matching those details. Please double-check your order ID and contact information.");
      return;
    }
    setResult({ orderNumber: row.order_number, status: row.status, createdAt: row.created_at, totalPaise: row.total_paise });
  }

  const activeIndex = result ? TIMELINE_STEPS.indexOf(result.status as (typeof TIMELINE_STEPS)[number]) : -1;
  const isTerminalIssue = result && ["cancelled", "payment_failed"].includes(result.status);

  return (
    <>
      <form className="track-order-form" onSubmit={handleSubmit}>
        <label>Order ID<input name="order_number" placeholder="PB-XXXXXXXX" required /></label>
        <label>Email or mobile number<input name="contact" required /></label>
        <button type="submit" disabled={loading} className="button button-dark">{loading ? "Searching…" : "Track order"}</button>
        {error && <p className="form-message form-error" role="alert">{error}</p>}
      </form>
      {result && (
        <div className="order-status-details" style={{ marginTop: "2rem" }}>
          <div><span>Order ID</span><span>{result.orderNumber}</span></div>
          <div><span>Status</span><span>{STATUS_LABELS[result.status] ?? result.status}</span></div>
          <div><span>Amount</span><span>₹{(result.totalPaise / 100).toFixed(2)}</span></div>
          <div><span>Placed on</span><span>{new Date(result.createdAt).toLocaleDateString("en-IN")}</span></div>
        </div>
      )}
      {result && !isTerminalIssue && (
        <ol className="track-order-timeline">
          {TIMELINE_STEPS.map((step, index) => (
            <li key={step} className={index <= activeIndex ? "is-done" : undefined}>{STATUS_LABELS[step]}</li>
          ))}
        </ol>
      )}
    </>
  );
}
