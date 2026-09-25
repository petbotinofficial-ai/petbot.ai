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
- Shipping/delivery address
- Order status information (we do not store your UPI PIN, net banking credentials, or other sensitive payment credentials)`,
  },
  {
    heading: "3. Information We Collect — About Your Pet",
    body: `- Pet name
- Pet photo, if you choose to upload one
- Breed, if provided
- Any other note you voluntarily provide for personalisation or the QR profile`,
  },
  {
    heading: "4. Information Collected for the QR Pet Profile",
    body: `- Pet profile information you choose to publish (name, breed, a message for finders)
- Whether your pet is shown as friendly or careful-around-strangers
- Your phone number, so a finder can contact you (shown on the public profile)
- Your address, only if you choose to make it visible on the profile
- Any other information you voluntarily choose to publish on the profile`,
  },
  {
    heading: "5. Location-Sharing Feature",
    body: "Your pet's public profile includes a \"Share my location\" option a finder can choose to use. If a finder taps this and their browser grants location access, their approximate device location (via their browser's own geolocation, not IP-based or GPS-precision tracking) is used once, immediately, to generate a Google Maps link that is emailed to you, the registered owner — it is not stored in our database. This only happens when a finder actively chooses to share their location and their browser permits it; it does not happen automatically just from the QR code being scanned or the profile being viewed. If the finder declines, their device doesn't support it, or the request times out, no location email is sent for that visit and there is currently no fallback location method. To limit misuse, repeated location-sharing requests for the same pet are limited to a small number within a short time window.",
  },
  {
    heading: "6. Cookies and Similar Technologies",
    body: "This website uses cookies required for core functionality — specifically, to keep an admin signed in to the dashboard. We do not use cookies for advertising or cross-site tracking.",
  },
  {
    heading: "7. Analytics",
    body: "Petbot does not currently have any third-party analytics or advertising tracking (such as Google Analytics or a Meta Pixel) installed on this website.",
  },
  {
    heading: "8. Website Logs, IP Address, and Device Information",
    body: "Like most websites, our hosting provider automatically logs technical information such as IP address, browser type, device type, and pages visited, for security, diagnostics, and performance purposes.",
  },
  {
    heading: "9. Payment Processing",
    body: "Petbot currently accepts payment via UPI, which you complete directly in your own UPI app; we then verify your payment manually before confirming your order. Petbot never receives or stores your UPI PIN or net banking credentials. If Petbot moves to an automated payment gateway such as Razorpay in the future, this section will be updated, and that gateway would process your payment details under its own security and compliance standards.",
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
    body: "Subject to applicable law, you may request access to, correction of, or deletion of your personal information. Pet profiles cannot currently be edited by customers after creation — if you need a correction or have a serious issue with your profile, please contact us and we will assist directly.",
  },
  {
    heading: "17. Data Deletion Requests",
    body: `To request deletion of your personal data or your pet's public profile, email ${LEGAL_CONFIG.supportEmail} with your order number and the registered email or phone number used at checkout so we can verify your request.`,
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
    body: "If you have a grievance regarding how your personal data has been handled, please see our Grievance Redressal page for our grievance contact details and our complaint-resolution process.",
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
