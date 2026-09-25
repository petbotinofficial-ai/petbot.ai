import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Contact Petbot",
  description: "Get in touch with Petbot for order support, a damaged tag, or general questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="info-page">
      <header>
        <Link href="/">← Petbot</Link>
        <Link href="/shop" className="button button-dark">Shop tags</Link>
      </header>
      <section>
        <p className="eyebrow">Contact Petbot</p>
        <h1>We&rsquo;d love to<br /><em>hear from you.</em></h1>
        <p className="info-copy">Questions about a custom tag, an existing order, or helping a pet get safely home? Reach out anytime.</p>
        <div className="info-actions">
          <a className="button button-dark" href={`mailto:${LEGAL_CONFIG.supportEmail}`}>Email Petbot</a>
          <a className="button button-outline" href={LEGAL_CONFIG.instagramUrl} target="_blank" rel="noreferrer">Follow us on Instagram ↗</a>
        </div>
        <div className="policy-card">
          <h2>Reach us directly.</h2>
          <p>Support email: <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>{LEGAL_CONFIG.supportEmail}</a> (no phone support at this time)</p>
          <p>Support hours: {LEGAL_CONFIG.supportHours}</p>
          <p>Address: {LEGAL_CONFIG.registeredAddress}</p>
        </div>
        <div className="policy-card">
          <h2>Send us a message.</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
