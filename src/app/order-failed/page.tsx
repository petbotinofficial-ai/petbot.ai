import Link from "next/link";

export const metadata = { title: "Payment Failed", robots: { index: false } };

export default async function OrderFailedPage({ searchParams }: PageProps<"/order-failed">) {
  const params = await searchParams;
  const orderNumber = typeof params.order === "string" ? params.order : "";

  return (
    <main className="order-status-page">
      <div className="order-status-card">
        <p className="eyebrow">Payment failed</p>
        <h1>Payment wasn&rsquo;t completed.</h1>
        <p>Your payment could not be processed, so no charge has been placed on a confirmed order. This can happen due to a declined card, network issue, or cancelled bank authentication.</p>
        {orderNumber && (
          <div className="order-status-details">
            <div><span>Order ID</span><span>{orderNumber}</span></div>
            <div><span>Payment status</span><span>Failed</span></div>
          </div>
        )}
        <div className="order-status-actions">
          <Link className="button button-dark" href="/checkout">Retry payment</Link>
          <Link className="button button-outline" href="/shop">Return to shop</Link>
          <Link className="button button-outline" href="/contact">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
