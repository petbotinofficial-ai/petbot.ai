import Link from "next/link";

export const metadata = { title: "Payment Cancelled", robots: { index: false } };

export default async function OrderCancelledPage({ searchParams }: PageProps<"/order-cancelled">) {
  const params = await searchParams;
  const orderNumber = typeof params.order === "string" ? params.order : "";

  return (
    <main className="order-status-page">
      <div className="order-status-card">
        <p className="eyebrow">Payment cancelled</p>
        <h1>You closed the payment window.</h1>
        <p>Your payment process was cancelled before it completed, so no charge was made. Your order details have been saved — you can pick up where you left off.</p>
        {orderNumber && (
          <div className="order-status-details">
            <div><span>Order ID</span><span>{orderNumber}</span></div>
            <div><span>Payment status</span><span>Cancelled</span></div>
          </div>
        )}
        <div className="order-status-actions">
          <Link className="button button-dark" href="/checkout">Return to checkout</Link>
          <Link className="button button-outline" href="/shop">Continue shopping</Link>
          <Link className="button button-outline" href="/contact">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
