import Link from "next/link";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderSuccessPage({ searchParams }: PageProps<"/order-success">) {
  const params = await searchParams;
  const orderNumber = typeof params.order === "string" ? params.order : "";

  return (
    <main className="order-status-page">
      <div className="order-status-card">
        <p className="eyebrow">Payment successful</p>
        <h1>Order confirmed.</h1>
        <p>Thank you — we&rsquo;ve received your payment and your Petbot tag is being prepared.</p>
        {orderNumber && (
          <div className="order-status-details">
            <div><span>Order ID</span><span>{orderNumber}</span></div>
            <div><span>Payment status</span><span>Paid</span></div>
            <div><span>Processing time</span><span>{LEGAL_CONFIG.processingTime}</span></div>
            <div><span>Estimated delivery</span><span>{LEGAL_CONFIG.deliveryEstimate}</span></div>
          </div>
        )}
        <p>A confirmation email has been sent to your registered email address with your order details.</p>
        <div className="order-status-actions">
          <Link className="button button-dark" href="/track-order">Track your order</Link>
          <Link className="button button-outline" href="/shop">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
}
