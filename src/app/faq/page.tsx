import Link from "next/link";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Petbot QR pet tags, orders, and delivery.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  { q: "What is Petbot?", a: "Petbot makes personalised, custom engraved QR pet tags. Each tag pairs a durable physical tag with a private digital profile, so a finder can help reunite you with your pet." },
  { q: "How does the QR pet tag work?", a: "Your pet wears the engraved tag. If they wander off, anyone who finds them can scan the QR code on the tag with any smartphone camera — no app required — to open your pet's profile." },
  { q: "What happens when someone scans the QR code?", a: "The finder is taken to your pet's public profile page, showing the information you've chosen to share (such as your pet's name, photo, and a way to contact you) so they can help reunite you." },
  { q: "How does the owner receive the finder's location?", a: "If location-sharing is enabled on your pet's profile, the finder can choose to share their approximate location with you, and you'll receive a map link so you can go and collect your pet. This depends on the finder's consent and device settings." },
  { q: "What information is displayed on the pet profile?", a: "Only what you choose to add — typically your pet's name, photo, a short note, and a way for a finder to reach you. You control what's public and can leave out anything you'd prefer to keep private." },
  { q: "Can I customise the tag?", a: "Yes. Every Petbot tag is personalised at checkout with details like your pet's name, and it's engraved specifically for your order." },
  { q: "How long does delivery take?", a: `Processing time (making your custom tag) is ${LEGAL_CONFIG.processingTime}, and shipping after dispatch typically takes ${LEGAL_CONFIG.deliveryEstimate}. See our Shipping & Delivery Policy for full details.` },
  { q: "Can I cancel my order?", a: "You can cancel before personalisation/production begins for a full refund. Once engraving has started, cancellation may not be possible since the tag is made specifically for you — see our Refund & Cancellation Policy for the full breakdown." },
  { q: "Can I return a personalised tag?", a: "Because tags are custom engraved, we don't accept returns for a simple change of mind once production has started. However, manufacturing defects, damage, wrong products, or engraving errors on our part are covered — see our Refund & Cancellation Policy." },
  { q: "What happens if my tag is damaged?", a: "Contact us with your order ID and photos of the damage as soon as you notice it. Verified damage is eligible for a free replacement or refund." },
  { q: "What happens if I enter the wrong engraving information?", a: "If the mistake was in the details you submitted at checkout, we generally can't offer a free replacement since the tag was made exactly as instructed — but we're happy to discuss a paid re-order. If we made the engraving error despite you submitting correct details, we'll replace it for free." },
  { q: "How can I contact Petbot?", a: `Email us at ${LEGAL_CONFIG.supportEmail} or use our Contact page — we're happy to help with anything about your tag, order, or pet profile.` },
];

export default function FaqPage() {
  return (
    <main className="info-page">
      <header>
        <Link href="/">← Petbot</Link>
        <Link href="/contact">Contact us</Link>
      </header>
      <section>
        <p className="eyebrow">Frequently asked questions</p>
        <h1>Questions,<br /><em>answered.</em></h1>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
