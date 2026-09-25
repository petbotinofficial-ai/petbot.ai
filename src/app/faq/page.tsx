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
  { q: "What happens when someone scans the QR code?", a: "The finder is taken to your pet's public profile page, showing your pet's details and a way to reach you. The finder can also choose to share their location with you to help you find your pet faster." },
  { q: "How do I receive the finder's location?", a: "If a finder taps \"Share my location\" on your pet's profile and allows their browser to share their location, you'll receive an email with a Google Maps link to that location. This depends on the finder actively choosing to share it and granting their browser's location permission — it is not automatic just from the QR being scanned." },
  { q: "What information is displayed on the pet profile?", a: "Your pet's name, breed, a friendly/careful status, and a message for finders, along with a way to contact you. You can optionally choose to also show your address on the profile." },
  { q: "Can I customize the tag?", a: "Yes. The product is personalised specifically for your pet at checkout — for example, with your pet's name — and engraved for your order." },
  { q: "How long does delivery take?", a: `Orders generally take ${LEGAL_CONFIG.processingTime}, with final delivery within 10–12 days across India.` },
  { q: "Can I cancel my order?", a: "No. Every product is personalised specifically for the customer, so orders cannot be cancelled once placed." },
  { q: "Can I return a personalized tag?", a: "Change-of-mind returns are not accepted, and Petbot does not offer replacements. Refunds are available only for a broken/damaged product on arrival, or a Petbot-side QR/profile link failure." },
  { q: "What happens if my tag arrives damaged?", a: `Contact ${LEGAL_CONFIG.supportEmail} with your order ID and photos or video of the damage. Verified damaged-product claims are eligible for a refund after review.` },
  { q: "What if the QR code or profile link doesn't work?", a: `Contact ${LEGAL_CONFIG.supportEmail} with your order ID and a description of the problem. If we confirm the issue is on Petbot's side and it cannot be resolved, your order may qualify for a refund.` },
  { q: "What happens if I enter the wrong information at checkout?", a: "Because your tag is engraved exactly as instructed, incorrect information you provide at checkout (like a misspelled name) is not eligible for a refund. Please double-check your details before placing your order." },
  { q: "Do you offer Cash on Delivery (COD)?", a: "No. Petbot currently accepts online, prepaid payment only." },
  { q: "Do you ship across India?", a: "Yes. Petbot ships all over India with free shipping on every order." },
  { q: "Can I edit my pet's profile after ordering?", a: `Profiles cannot be edited by customers after creation. If there's a serious issue with your profile, email ${LEGAL_CONFIG.supportEmail} and we'll help.` },
  { q: "Can I delete my pet's profile?", a: `Yes. Email ${LEGAL_CONFIG.supportEmail} with your order details and we'll process the deletion for you.` },
  { q: "How can I contact Petbot?", a: `Email ${LEGAL_CONFIG.supportEmail}. Support hours are ${LEGAL_CONFIG.supportHours}. We don't currently offer phone support.` },
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
