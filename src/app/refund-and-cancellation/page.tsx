import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Refund & Cancellation Policy | Petbot",
  description: "How cancellations, returns, and refunds work for Petbot's personalised, custom engraved QR pet tags.",
  alternates: { canonical: "/refund-and-cancellation" },
};

const sections = [
  {
    heading: "A. Order Cancellation",
    body: `Because every Petbot tag is personalised, cancellation eligibility depends on how far your order has progressed:

- Before personalisation/production begins: you may request cancellation for a full refund. Contact us as soon as possible after placing your order.
- After personalisation/engraving has begun: cancellation may no longer be possible, since the product is already being made specifically for you and cannot be resold. Contact us immediately — we will try to accommodate your request if production has not progressed too far, but this cannot be guaranteed.
- After dispatch: orders cannot be cancelled once shipped. You may still be eligible for a return/refund under the damaged, defective, or incorrect-product scenarios below.

Exact cancellation windows are ${LEGAL_CONFIG.processingTime.startsWith("[") ? "still being finalised and will be confirmed here" : LEGAL_CONFIG.processingTime}.`,
  },
  {
    heading: "B. Personalised Products — General Approach",
    body: "Personalised and custom engraved products are, by their nature, made specifically for you and cannot be resold to another customer. This means a simple change of mind after production has started is generally not eligible for a return in the way a standard, non-personalised product would be. This policy does not apply to defects, damage, or errors caused by Petbot — see below.",
  },
  {
    heading: "C. Manufacturing Defect",
    body: `If your tag has a genuine manufacturing defect (for example, a QR code that does not scan, a structural flaw, or a coating/finish defect not caused by normal wear), contact us at ${LEGAL_CONFIG.supportEmail} with your order ID and photos/video of the issue. Verified manufacturing defects are eligible for a free replacement or a refund, at your choice, subject to our review.`,
  },
  {
    heading: "D. Wrong Product",
    body: "If you receive a product different from what you ordered (wrong item, wrong design, or wrong tag entirely), please contact us with your order ID and photos. Once verified, we will arrange a free replacement of the correct item or a full refund.",
  },
  {
    heading: "E. Incorrect Engraving",
    body: `We distinguish between two different situations:

- You entered incorrect information at checkout (for example, a misspelled pet name): because the tag was engraved exactly as instructed, this is generally not eligible for a free replacement, but we will always try to help — contact us to discuss a paid re-order at a reduced cost where possible.
- Petbot engraved incorrect information despite you providing correct details at checkout: this is our error. Contact us with your order ID and the correct details originally submitted, and we will provide a free replacement with the correct engraving.

Please review your personalisation details carefully at checkout, since custom engraving cannot generally be edited once production has started.`,
  },
  {
    heading: "F. Damaged Product",
    body: "If your tag arrives physically damaged (in transit or otherwise), please contact us within a reasonable time of delivery with clear photographs of the product and its packaging. Verified transit/manufacturing damage is eligible for a free replacement or refund, at your choice.",
  },
  {
    heading: "G. Lost / Undelivered Product",
    body: `If your order never arrives and tracking shows it as lost, delayed indefinitely, or undeliverable through no fault of yours, contact ${LEGAL_CONFIG.supportEmail} with your order ID. Once we confirm the loss with our courier partner, we will offer a free reshipment or a full refund, at your choice.`,
  },
  {
    heading: "H. Product Damaged During Shipping",
    body: "See \"Damaged Product\" above — the same evidence-based process (photos of the product and packaging, submitted promptly after delivery) applies to damage that occurs in transit.",
  },
  {
    heading: "I. Refund Process",
    body: `- Refund approval: once we verify your claim (defect, damage, wrong product, our engraving error, or lost shipment), we will confirm approval by email.
- Refund method: approved refunds are issued to your original payment method via Razorpay.
- Processing time: ${LEGAL_CONFIG.refundTimeline}.
- Bank/provider timelines: after we initiate a refund, your bank or payment provider may take additional time to reflect it in your account or statement — this final step is outside our direct control.`,
  },
  {
    heading: "J. Refund Exclusions",
    body: `Refunds/replacements are not available in the following situations, except as required by applicable consumer law:

- Simple change of mind after personalised production has begun.
- Incorrect information entered by the customer at checkout (see "Incorrect Engraving" above for our approach here).
- Normal wear and tear over time after delivery.
- Damage caused by misuse after the product has been delivered in good condition.`,
  },
  {
    heading: "K. How to Raise a Request",
    body: `Email ${LEGAL_CONFIG.supportEmail} with your order ID, registered email/phone number, a description of the issue, and photos or video where relevant. We will acknowledge your request and guide you through the next steps. If you are not satisfied with the outcome, you may escalate the matter — see our Grievance Redressal page.`,
  },
];

export default function RefundAndCancellationPage() {
  return (
    <LegalPage
      eyebrow="Petbot policies"
      title={<>Refund &amp;<br /><em>cancellation.</em></>}
      intro="Petbot tags are made specially for your pet. Here's exactly how cancellations, returns, and refunds work depending on your situation."
      sections={sections}
    />
  );
}
