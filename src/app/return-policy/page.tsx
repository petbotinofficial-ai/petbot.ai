import Link from "next/link";

export const metadata = { title: "Return Policy | Petbot" };

export default function ReturnPolicyPage() {
  return <main className="info-page"><header><Link href="/">← Petbot</Link><Link href="/contact">Contact us</Link></header><section><p className="eyebrow">Petbot policies</p><h1>Return<br /><em>policy.</em></h1><div className="policy-card"><h2>Custom made, just for them.</h2><p>Petbot products are customised for each pet. Because every tag is made especially for your order, we do not offer returns or exchanges once an order has been placed.</p><p>If your order arrives damaged or has a manufacturing issue, please contact us at <a href="mailto:Petbot.inofficial@gmail.com">Petbot.inofficial@gmail.com</a> so we can help.</p></div></section></main>;
}
