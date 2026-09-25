import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Privacy Policy | Petbot",
  description: "How Petbot collects, uses, and protects your personal information and your pet's information.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    heading: "1. Introduction",
    body: `This Privacy Policy explains how ${LEGAL_CONFIG.businessName} ("Petbot", "we", "us") collects, uses, shares, and protects information when you visit our website, place an order, or use our QR pet profile service. By using this website, you consent to the practices described here.`,
  },
  {
    heading: "2. Information We Collect — About You",
    body: `- Full name
- Email address
- Mobile number
- Billing address
- Shipping address
- Order and payment status information (we do not store your card, CVV, UPI PIN, or net banking credentials — these are handled directly by our payment processor)`,
  },
  {
    heading: "3. Information We Collect — About Your Pet",
    body: `- Pet name
- Pet photo, if you choose to upload one
- Pet type / breed
- Age, if provided
- Any other information you voluntarily provide for personalisation or the QR profile`,
  },
  {
    heading: "4. Information Collected for the QR Pet Profile",
    body: `- Pet profile information you choose to publish (name, photo, message)
- Owner contact information you choose to display to finders
- Emergency contact information, if you provide it
- Any other information you voluntarily choose to publish on the profile`,
  },
  {
    heading: "5. Location-Sharing Feature",
    body: "If a finder scans your pet's QR code and the location-sharing workflow is enabled, the finder may be asked to voluntarily share their approximate device location. If shared, this location information is used solely to help notify you (the registered pet owner) — for example, by sending you a map link — so you can locate your pet. We do not use finder location data for any other purpose, do not sell it, and do not display it publicly. Location sharing depends on the finder's own consent and device permissions.",
  },
  {
    heading: "6. Cookies and Similar Technologies",
    body: "This website may use cookies or similar technologies required for core functionality (such as keeping you signed in to an account or admin session) and, where configured, basic website analytics (see \"Analytics\" below). We do not use cookies for third-party advertising targeting.",
  },
  {
    heading: "7. Analytics",
    body: "We may use privacy-respecting analytics tools (such as Google Analytics, where configured) to understand overall website traffic and usage patterns. Analytics data is generally aggregated and is used to improve our website and products, not to identify you individually.",
  },
  {
    heading: "8. Website Logs, IP Address, and Device Information",
    body: "Like most websites, our hosting provider automatically logs technical information such as IP address, browser type, device type, and pages visited, for security, diagnostics, and performance purposes.",
  },
  {
    heading: "9. Payment Processing",
    body: "Payments are processed through Razorpay, an authorised third-party payment gateway. Razorpay processes your payment details directly under its own security and compliance standards. Petbot never receives or stores your full card number, CVV, UPI PIN, or net banking credentials.",
  },
  {
    heading: "10. Email Service Providers",
    body: "We use a transactional email service provider (Resend) to send order confirmations, payment status updates, and support communications. Your name, email address, and order details necessary to send these communications are shared with this provider solely for that purpose.",
  },
  {
    heading: "11. Hosting and Database Providers",
    body: "This website is hosted on Vercel, and customer, order, and pet-profile data is stored using Supabase (a database and backend infrastructure provider). These providers process data on our behalf under their own security safeguards and are not authorised to use your data for their own purposes.",
  },
  {
    heading: "12. Other Third-Party Integrations",
    body: "We only share data with third-party services that are actually used to operate Petbot (payment processing, hosting, database, and transactional email, as listed above). We do not sell your personal information to third parties.",
  },
  {
    heading: "13. Order Fulfilment / Shipping Providers",
    body: "To deliver your order, we share necessary shipping details (name, address, phone number) with our shipping/courier partner(s) solely for the purpose of delivering your product.",
  },
  {
    heading: "14. Data Retention",
    body: "We retain customer and order information for as long as necessary to fulfil your order, comply with legal and tax obligations, resolve disputes, and enforce our agreements. Pet profile information is retained for as long as your profile remains active or as required by law.",
  },
  {
    heading: "15. Data Security",
    body: "We use reasonable technical and organisational measures, including access controls and database-level security policies, to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    heading: "16. Your Rights",
    body: "Subject to applicable law, you may request access to, correction of, or deletion of your personal information, or ask us to restrict certain uses of it. You may also withdraw consent for optional features such as the public QR profile at any time.",
  },
  {
    heading: "17. Data Deletion Requests",
    body: `To request deletion of your personal data or your pet's profile information, please contact us at ${LEGAL_CONFIG.supportEmail} with your order number and registered email or phone number so we can verify your request.`,
  },
  {
    heading: "18. Data Correction",
    body: `If any information we hold about you or your pet is inaccurate, you may request a correction by contacting ${LEGAL_CONFIG.supportEmail}.`,
  },
  {
    heading: "19. Children's Privacy",
    body: "This website is not directed at children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.",
  },
  {
    heading: "20. Changes to This Privacy Policy",
    body: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Updates will be posted on this page with a revised \"Last Updated\" date.",
  },
  {
    heading: "21. Contact Us",
    body: `For any privacy-related questions or requests, please contact us at ${LEGAL_CONFIG.supportEmail}.`,
  },
  {
    heading: "22. Grievance / Contact Process",
    body: "If you have a grievance regarding how your personal data has been handled, please see our Grievance Redressal page for our Grievance Officer's contact details and our complaint-resolution process.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Petbot policies"
      title={<>Privacy<br /><em>policy.</em></>}
      intro="Your trust matters to us and to your pet's safety. Here is exactly what information we collect and how we use it."
      sections={sections}
    />
  );
}
