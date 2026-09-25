import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Refund & Cancellation Policy | Petbot",
  description: "How cancellations, refunds, and damaged-product claims work for Petbot's personalised QR pet tags.",
  alternates: { canonical: "/refund-and-cancellation" },
};

const sections = [
  {
    heading: "A. Cancellation",
    body: "Orders cannot be cancelled once placed, for any reason. Every Petbot tag is personalised and production begins as soon as your order is placed, so the tag cannot be resold or reused for another order. Please review your pet's details, delivery address, and contact information carefully before completing checkout — there is no cancellation window.",
  },
  {
    heading: "B. When a Refund Is Available",
    body: `Refunds are only available in these two situations:

- Your product arrives broken or damaged.
- The QR code / pet profile link does not work due to a fault on Petbot's side.

No other situation qualifies for a refund.`,
  },
  {
    heading: "C. When a Refund Is NOT Available",
    body: `Refunds are not available for:

- Change of mind after placing an order.
- Not liking the product once received.
- Incorrect information you provided at checkout (for example, a misspelled pet name).
- An incorrect delivery address you provided.
- Normal wear and tear over time.
- Misuse or damage caused after delivery.
- Any other issue caused by the customer rather than by Petbot.`,
  },
  {
    heading: "D. No Replacement Policy",
    body: "Petbot does not currently offer product replacements. Eligible cases (damaged product or a Petbot-side QR/link failure) are resolved only through a refund, not a replacement tag.",
  },
  {
    heading: "E. Damaged or Broken Product",
    body: `If your tag arrives broken or damaged, email ${LEGAL_CONFIG.supportEmail} with your order ID and clear photographs (or a short video) of the product and its packaging. We will review the evidence to confirm the claim before approving a refund.`,
  },
  {
    heading: "F. QR / Pet Profile Link Not Working",
    body: `If your pet's QR code or profile link is not working, email ${LEGAL_CONFIG.supportEmail} with your order ID and a description of the problem (for example, a screenshot of the error). We will verify the issue on our side before approving a refund — this policy does not cover cases where the link works correctly but is not being scanned correctly due to a damaged QR surface caused after delivery, unless that damage was present on arrival (see "Damaged or Broken Product" above).`,
  },
  {
    heading: "G. How to Request a Refund",
    body: `Email ${LEGAL_CONFIG.supportEmail} with your order ID, the registered email or phone number used at checkout, a description of the issue, and supporting evidence (photos/video/screenshots) where applicable. We will review your request by email — refund requests are reviewed individually and are not automatically approved.`,
  },
  {
    heading: "H. Refund Processing",
    body: `Once a refund request is approved, it is processed within ${LEGAL_CONFIG.refundTimeline}. The refund is issued to your original payment method. After we process the refund, your bank or payment provider may take some additional time to reflect it in your account — this final step is outside our control.`,
  },
  {
    heading: "I. Escalation",
    body: `If you are not satisfied with the outcome of your refund request, you may reply to the same email thread to ask for a review — see our Grievance Redressal page for our full complaint process.`,
  },
];

export default function RefundAndCancellationPage() {
  return (
    <LegalPage
      eyebrow="Petbot policies"
      title={<>Refund &amp;<br /><em>cancellation.</em></>}
      intro="Petbot tags are made specially for your pet, so our cancellation and refund rules are narrow and specific. Here's exactly how they work."
      sections={sections}
    />
  );
}
