import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Terms & Conditions | Petbot",
  description: "Terms and conditions for using the Petbot website and purchasing custom engraved QR pet tags.",
  alternates: { canonical: "/terms-and-conditions" },
};

const sections = [
  {
    heading: "1. Introduction",
    body: `These Terms & Conditions ("Terms") govern your access to and use of the Petbot website and the purchase of any products or services offered by ${LEGAL_CONFIG.businessName} ("Petbot", "we", "us", "our"). By browsing this website or placing an order, you agree to be bound by these Terms. If you do not agree, please do not use the website or place an order.`,
  },
  {
    heading: "2. About Petbot",
    body: `Petbot designs and sells personalised, custom engraved QR pet tags and related pet-identity products in India. Petbot is currently an ${LEGAL_CONFIG.businessStructure}, operating from ${LEGAL_CONFIG.registeredAddress}.`,
  },
  {
    heading: "3. Eligibility",
    body: "You must be at least 18 years old, or be using this website under the supervision of a parent or legal guardian, to place an order. By placing an order you confirm that the information you provide is accurate and that you are legally capable of entering into a binding contract.",
  },
  {
    heading: "4. Website Usage",
    body: `You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of, this website by any third party. You must not misuse the website by knowingly introducing viruses, attempt unauthorised access, or scrape content without permission.`,
  },
  {
    heading: "5. Product Information",
    body: "We make reasonable efforts to display product details, images, and pricing accurately. However, actual colours, finishes, and dimensions may vary slightly due to photography, display settings, or manufacturing tolerances. We reserve the right to correct any errors, inaccuracies, or omissions and to update information at any time without prior notice.",
  },
  {
    heading: "6. Personalised / Custom Engraved Products",
    body: "Petbot products are personalised or custom engraved based on the information you provide at checkout (such as your pet's name and other details). Because each item is made specifically for you, personalised products are treated differently from standard, off-the-shelf products with respect to cancellation and returns, as explained in our Refund & Cancellation Policy.",
  },
  {
    heading: "7. QR Pet Profile Service",
    body: "Certain Petbot tags include a QR code linked to an online pet profile page. This profile may display information you choose to provide, such as your pet's name, photo, and a way for a finder to contact you. You are solely responsible for the accuracy and appropriateness of the information you choose to publish on this profile.",
  },
  {
    heading: "8. Product Pricing",
    body: "All prices are listed in Indian Rupees (INR) and are displayed on the product and checkout pages at the time of purchase. We reserve the right to change prices at any time, but changes will not affect orders that have already been confirmed and paid for.",
  },
  {
    heading: "9. Taxes and Charges",
    body: "Unless stated otherwise on the product or checkout page, displayed prices are inclusive of applicable taxes. Any shipping charges applicable to your order will be clearly shown at checkout before you complete payment.",
  },
  {
    heading: "10. Orders",
    body: "Placing an order through this website constitutes an offer to purchase. All orders are subject to availability and acceptance by Petbot.",
  },
  {
    heading: "11. Order Acceptance",
    body: "An order is only confirmed once payment has been successfully verified and you receive an order confirmation. Petbot reserves the right to refuse or cancel any order at its discretion, including in cases of suspected fraud, pricing errors, or unavailability of stock, in which case any payment received will be refunded.",
  },
  {
    heading: "12. Payment",
    body: "Petbot accepts prepaid orders only. Full payment must be made at the time of checkout before production of your personalised product begins.",
  },
  {
    heading: "13. Payment Processing",
    body: "Petbot currently accepts payment via UPI, verified manually before your order is confirmed. Petbot does not collect, view, or store your UPI PIN, net banking credentials, or other sensitive payment credentials. If Petbot enables an automated payment gateway such as Razorpay in the future, this section will be updated accordingly, and any such gateway will process payments under its own security and compliance standards.",
  },
  {
    heading: "14. Shipping and Delivery",
    body: "Shipping and delivery timelines, charges, and related terms are set out in our Shipping & Delivery Policy, which forms part of these Terms.",
  },
  {
    heading: "15. Cancellation",
    body: "Because every Petbot tag is personalised and production begins as soon as your order is placed, orders cannot be cancelled once placed, for any reason. Please review your details carefully before completing checkout.",
  },
  {
    heading: "16. Returns",
    body: "Petbot does not accept returns or replacements. Refunds are available only in the limited circumstances set out in our Refund & Cancellation Policy — namely a damaged/broken product or a Petbot-side QR/profile link failure.",
  },
  {
    heading: "17. Refunds",
    body: "Approved refunds will be processed to the original payment method. Refund timelines are described in our Refund & Cancellation Policy and are also subject to your bank or payment provider's own processing timelines, which are outside our control.",
  },
  {
    heading: "18. Damaged / Defective / Incorrect Products",
    body: "If you receive a product that is damaged, defective, or different from what you ordered, please contact us promptly with your order details and, where possible, photographic evidence, so we can investigate and resolve the issue in accordance with our Refund & Cancellation Policy.",
  },
  {
    heading: "19. Customer Responsibilities",
    body: `You are responsible for providing accurate shipping details, contact information, and personalisation/engraving details at checkout. Petbot is not responsible for delays or delivery failures caused by incorrect or incomplete information provided by you.`,
  },
  {
    heading: "20. Information Provided by Customers",
    body: "You warrant that all information you submit (including customer details, shipping address, and personalisation details) is accurate, current, and does not infringe the rights of any third party.",
  },
  {
    heading: "21. QR Code Usage",
    body: "Each QR code is unique to the specific tag it is printed on. Do not share, replicate, or misuse another person's QR code or pet profile. Petbot may take reasonable action, including deactivation, to prevent misuse of the QR/profile system.",
  },
  {
    heading: "22. Pet Profile Information",
    body: "You control what information is shown on your pet's public profile page. We recommend not publishing sensitive personal information that you would not want visible to a stranger who scans the tag, beyond what is reasonably necessary to help reunite you with your pet.",
  },
  {
    heading: "23. Location-Sharing Functionality",
    body: "If enabled for your pet profile, Petbot's QR scanning feature may allow a finder to voluntarily share their approximate location with you (for example, via a map link) to help you locate your pet. This functionality, where available, is described further in our Privacy Policy. Location sharing depends on the finder's consent and device settings and is not guaranteed to be available or accurate in every case.",
  },
  {
    heading: "24. Intellectual Property",
    body: "All content on this website, including the Petbot name, logo, design, graphics, and website code, is the property of Petbot or its licensors and is protected by applicable intellectual property laws. You may not copy, reproduce, or use this content without prior written permission, except as necessary to use the website for its intended purpose.",
  },
  {
    heading: "25. Third-Party Services",
    body: "This website relies on third-party service providers for functions such as hosting, database services, analytics, and transactional email delivery. Petbot is not responsible for outages, errors, or issues arising from the systems of these independent third parties, though we will make reasonable efforts to assist you if such an issue affects your order.",
  },
  {
    heading: "26. Website Availability",
    body: "We aim to keep this website available at all times but do not guarantee uninterrupted or error-free access. We may suspend or restrict access for maintenance, updates, or reasons beyond our control.",
  },
  {
    heading: "27. Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, Petbot's liability for any claim arising from your use of this website or purchase of a product is limited to the amount you paid for the relevant order. Petbot is not liable for indirect, incidental, or consequential damages, except where such limitation is not permitted under applicable Indian consumer protection law.",
  },
  {
    heading: "28. Indemnification",
    body: "You agree to indemnify and hold Petbot harmless from any claims, losses, or damages arising from your misuse of the website, breach of these Terms, or the information you submit, to the extent permitted by law.",
  },
  {
    heading: "29. Changes to Terms",
    body: "We may update these Terms from time to time to reflect changes in our business, products, or legal requirements. The updated Terms will be posted on this page with a revised \"Last Updated\" date. Continued use of the website after changes are posted constitutes acceptance of the updated Terms.",
  },
  {
    heading: "30. Governing Law",
    body: "These Terms are governed by the laws of India. Subject to the dispute resolution process below, courts at the location of Petbot's registered address shall have exclusive jurisdiction, without prejudice to any rights you may have under applicable consumer protection law to approach a consumer forum local to you.",
  },
  {
    heading: "31. Dispute Resolution",
    body: `We encourage you to first contact us at ${LEGAL_CONFIG.supportEmail} to resolve any concern informally. If a dispute cannot be resolved this way, either party may pursue remedies available under applicable Indian law, including under the Consumer Protection Act, 2019.`,
  },
  {
    heading: "32. Contact Information",
    body: `For any questions about these Terms, please contact us at ${LEGAL_CONFIG.supportEmail} (${LEGAL_CONFIG.supportHours}). We do not currently offer phone support.`,
  },
  {
    heading: "33. Grievance Redressal",
    body: "If you have a complaint or grievance regarding your order or this website, please see our dedicated Grievance Redressal page, which sets out our grievance contact details and our complaint-handling process.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Petbot policies"
      title={<>Terms &amp;<br /><em>Conditions.</em></>}
      intro="Please read these Terms carefully before using the Petbot website or placing an order for a personalised QR pet tag."
      sections={sections}
    />
  );
}
