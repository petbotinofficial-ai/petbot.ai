import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Grievance Redressal | Petbot",
  description: "How to raise a complaint with Petbot and our grievance contact details.",
  alternates: { canonical: "/grievance-redressal" },
};

const sections = [
  {
    heading: "Grievance Contact",
    body: `Contact: ${LEGAL_CONFIG.grievanceContactRole}
Email: ${LEGAL_CONFIG.grievanceEmail}
Phone: Not available — Petbot does not currently offer phone support.
Support hours: ${LEGAL_CONFIG.supportHours}
Address: ${LEGAL_CONFIG.registeredAddress}

Petbot is currently an ${LEGAL_CONFIG.businessStructure}. All customer complaints are handled directly through the email address above.`,
  },
  {
    heading: "How to Submit a Complaint",
    body: `Email ${LEGAL_CONFIG.grievanceEmail} with the subject line "Grievance – [Your Order ID]". Please include as much of the following as applicable:

- Your order ID
- Your registered email address or mobile number
- A clear description of the issue
- Supporting evidence, such as photos, video, or screenshots, where relevant`,
  },
  {
    heading: "Acknowledgement Process",
    body: `We will acknowledge receipt of your complaint by email, generally within a few business days of submission.`,
  },
  {
    heading: "Resolution Process",
    body: `After acknowledging your complaint, we will review the matter — which may include your order, personalisation details, payment status, and any evidence you have shared — and respond with our findings and proposed resolution. Resolution timelines depend on the nature and complexity of the issue.`,
  },
  {
    heading: "Escalation",
    body: `If you are not satisfied with the resolution provided, you may reply to the same email thread and ask for a review. You may also pursue any additional remedies available to you under the Consumer Protection Act, 2019, including approaching the National Consumer Helpline or the appropriate consumer forum, without prejudice to the process above.`,
  },
];

export default function GrievanceRedressalPage() {
  return (
    <LegalPage
      eyebrow="Petbot policies"
      title={<>Grievance<br /><em>redressal.</em></>}
      intro="If something hasn't gone right with your order, here's exactly how to reach us and what happens next."
      sections={sections}
    />
  );
}
