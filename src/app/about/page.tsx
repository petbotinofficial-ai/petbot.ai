import Link from "next/link";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "About Petbot",
  description: "Petbot makes thoughtfully designed, personalised QR pet tags to help every companion find their way home.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="info-page">
      <header>
        <Link href="/">← Petbot</Link>
        <Link href="/shop" className="button button-dark">Shop tags</Link>
      </header>
      <section>
        <p className="eyebrow">About Petbot</p>
        <h1>More than a tag.<br /><em>A way back home.</em></h1>
        <p className="info-copy">
          Petbot makes personalised, custom engraved QR pet tags — a small, everyday object designed
          to carry something bigger: a fast way for a stranger to help your pet find their way back to you.
          Each tag is engraved specifically for your pet and paired with a private QR profile that a finder
          can scan to reach you.
        </p>
        <div className="policy-card">
          <h2>What we believe.</h2>
          <p>
            We think pet identity should feel personal, not clinical. That&rsquo;s why every Petbot tag is made
            to order — engraved for your pet, connected to a profile you control, and designed to be worn every day.
          </p>
        </div>
        <p className="info-copy">
          Petbot is operated by {LEGAL_CONFIG.legalEntityName}. Have a question about a tag, an order, or how the
          QR profile works? <Link href="/contact">Get in touch</Link> — we&rsquo;d love to help.
        </p>
      </section>
    </main>
  );
}
