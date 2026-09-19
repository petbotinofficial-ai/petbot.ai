"use client";

import { useState } from "react";

type Order = { id: string; orderNumber: string; status: string; product: string; total: number; customer: string; pet: string; photoUrl: string | null };

export function OrderList({ orders }: { orders: Order[] }) {
  const [items, setItems] = useState(orders);
  const [message, setMessage] = useState("");
  async function removeOrder(order: Order) {
    if (!window.confirm(`Delete ${order.orderNumber}? This permanently removes its order, payment record, pet profile, and uploaded pet photo.`)) return;
    const response = await fetch("/api/admin/delete-order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId: order.id }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return setMessage(result.error || "Could not delete this order.");
    setItems((current) => current.filter((item) => item.id !== order.id));
    setMessage("Order and related private data deleted.");
  }
  return <div className="orders-list">{items.length ? items.map((order) => <article className="order-card" key={order.id}><div><strong>{order.orderNumber}</strong><span>{order.status.replace("_", " ")}</span></div><p>{order.product} · ₹{order.total.toFixed(2)}</p><p>{order.customer}</p><p>Pet: {order.pet}</p>{order.photoUrl ? <a className="button button-dark" href={order.photoUrl}>Download pet photo ↓</a> : <span>No pet photo uploaded</span>}<button className="button danger-button" onClick={() => removeOrder(order)}>Delete order</button></article>) : <div className="empty-state">New customer orders will appear here after checkout.</div>}{message && <p className="form-message" role="status">{message}</p>}</div>;
}
