import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Grievance Redressal | Petbot",
  description: "How to raise a complaint with Petbot and contact details for our Grievance Officer.",
  alternates: { canonical: "/grievance-redressal" },
};

const sections = [
  {
    heading: "Grievance Officer",
    body: `Name: ${LEGAL_CONFIG.grievanceOfficerName}
Designation: ${LEGAL_CONFIG.grievanceOfficerDesignation}
Email: ${LEGAL_CONFIG.grievanceOfficerEmail}
Phone: ${LEGAL_CONFIG.grievanceOfficerPhone}
Address: ${LEGAL_CONFIG.registeredAddress}

In accordance with the Consumer Protection (E-Commerce) Rules, 2020, this Grievance Officer is responsible for addressing complaints from customers regarding their orders and use of the Petbot website.`,
  },
  {
    heading: "How to Submit a Complaint",
    body: `Email the Grievance Officer at ${LEGAL_CONFIG.grievanceOfficerEmail} with the subject line "Grievance – [Your Order ID]". Please include as much of the following as applicable:

- Your order ID
- Your registered email address or mobile number
- A clear description of the issue
- Supporting evidence, such as photos or screenshots, where relevant
- Any previous correspondence with our support team about this issue`,
  },
  {
    heading: "Acknowledgement Process",
    body: `We will acknowledge receipt of your complaint, generally within a few business days of submission. Our acknowledgement will include a reference for your complaint so you can follow up easily.`,
  },
  {
    heading: "Resolution Process",
    body: `After acknowledging your complaint, we will investigate the matter — which may include reviewing your order, personalisation details, payment status, and any evidence you have shared — and respond with our findings and proposed resolution. Resolution timelines depend on the nature and complexity of the issue.`,
  },
  {
    heading: "Escalation",
    body: `If you are not satisfied with the resolution provided, you may request escalation by replying to the same email thread and asking for a review. You may also pursue any additional remedies available to you under the Consumer Protection Act, 2019, including approaching the National Consumer Helpline or the appropriate consumer forum, without prejudice to the process above.`,
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
