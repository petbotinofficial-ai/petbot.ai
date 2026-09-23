import Link from "next/link";

export const metadata = { title: "Payment Policy | Petbot" };

export default function PaymentPolicyPage() {
  return <main className="info-page"><header><Link href="/">← Petbot</Link><Link href="/contact">Contact us</Link></header><section><p className="eyebrow">Petbot policies</p><h1>Payment<br /><em>policy.</em></h1><div className="policy-card"><h2>Prepaid orders only.</h2><p>Petbot accepts prepaid orders only. Every product is specially made for each customer with love, so we begin crafting your personalised tag after payment has been confirmed.</p><p>Once you have completed your UPI payment, Petbot will verify it and notify you when your order has been placed.</p></div></section></main>;
}
