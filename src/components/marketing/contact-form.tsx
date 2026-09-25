"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "saving" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      orderId: String(form.get("order_id") ?? "").trim(),
      category: String(form.get("category") ?? "General question"),
      message: String(form.get("message") ?? "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setError("Please fill in your name, email, and message.");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "We couldn't send your message. Please try again.");
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "We couldn't send your message. Please try again.");
    }
  }

  if (status === "success") {
    return <p className="info-copy" role="status">Thanks for reaching out — we&rsquo;ve received your message and will get back to you soon.</p>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label>
        Your name
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Order ID <span style={{ color: "#806e60" }}>(optional)</span>
        <input name="order_id" placeholder="PB-XXXXXXXX" />
      </label>
      <label>
        What&apos;s this about?
        <select name="category" defaultValue="General question">
          <option>General question</option>
          <option>Order status</option>
          <option>Damaged or defective product</option>
          <option>Wrong or incorrect engraving</option>
          <option>Cancellation / refund</option>
          <option>Pet profile / QR code</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={5} required />
      </label>
      <button type="submit" disabled={status === "saving"} className="button button-dark">
        {status === "saving" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && <p className="form-message form-error" role="alert">{error}</p>}
    </form>
  );
}
