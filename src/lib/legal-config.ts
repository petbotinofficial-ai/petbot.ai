// Central place for business/legal facts used across policy pages, footer, checkout, and contact.
// These are the real, confirmed facts for Petbot as supplied by the business owner. Petbot is
// currently an individual-operated brand and is NOT a registered company/LLP/partnership — do not
// add a legal entity name, GSTIN, CIN, or any registration detail here until the business is
// actually registered and that information is confirmed.
export const LEGAL_CONFIG = {
  businessName: "Petbot",
  businessStructure: "Individual-operated business (not currently a registered company, LLP, or partnership)",
  registeredAddress: "Saket Nagar, Habibganj, Bhopal, Madhya Pradesh, India",

  supportEmail: "petbot.inofficial@gmail.com",
  supportHours: "10:00 AM – 7:00 PM IST",
  instagramUrl: "https://www.instagram.com/petbot.in",
  // No phone support is offered. Do not display a phone number anywhere on the site.

  // Petbot does not have a formally appointed Grievance Officer (individual-operated, unregistered
  // business). Use this truthful, role-based contact instead of inventing a person's name/title.
  grievanceContactRole: "Petbot Grievance Contact",
  grievanceEmail: "petbot.inofficial@gmail.com",

  productName: "Petbot QR Pet Tag",
  productPrice: "₹449",
  codAvailable: false,
  shippingCharge: "Free shipping across India",
  processingTime: "3–4 business days to prepare and personalise your tag",
  deliveryEstimate: "Final delivery within 10–12 days of ordering, across India",
  refundTimeline: "7–10 days after a refund request is approved",

  effectiveDate: "25 September 2026",
} as const;
