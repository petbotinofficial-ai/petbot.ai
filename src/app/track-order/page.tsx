import Link from "next/link";
import { TrackOrderForm } from "@/components/commerce/track-order-form";

export const metadata = {
  title: "Track Your Order",
  description: "Check the status of your Petbot order using your order ID and registered contact details.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <main className="info-page">
      <header><Link href="/">← Petbot</Link><Link href="/contact">Contact us</Link></header>
      <section>
        <p className="eyebrow">Track your order</p>
        <h1>Where&rsquo;s your<br /><em>tag right now?</em></h1>
        <p className="info-copy">Enter your order ID along with the email or mobile number you used at checkout.</p>
        <TrackOrderForm />
      </section>
    </main>
  );
}
