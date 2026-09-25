// Central place for business/legal facts used across policy pages, footer, checkout, and contact.
// Only verified facts found in the codebase are filled in. Everything else is a clearly marked
// placeholder that MUST be replaced with real, confirmed business information before launch.
export const LEGAL_CONFIG = {
  businessName: "Petbot",
  legalEntityName: "[LEGAL ENTITY NAME — TO BE CONFIRMED]",
  registeredAddress: "[REGISTERED BUSINESS ADDRESS — TO BE CONFIRMED]",
  gstNumber: "[GST NUMBER, IF REGISTERED — TO BE CONFIRMED]",

  supportEmail: "petbot.inofficial@gmail.com",
  supportPhone: "[SUPPORT PHONE NUMBER — TO BE CONFIRMED]",
  supportHours: "[SUPPORT HOURS — TO BE CONFIRMED]",
  instagramUrl: "https://www.instagram.com/petbot.in",

  grievanceOfficerName: "[GRIEVANCE OFFICER NAME — TO BE CONFIRMED]",
  grievanceOfficerDesignation: "[DESIGNATION — TO BE CONFIRMED]",
  grievanceOfficerEmail: "petbot.inofficial@gmail.com",
  grievanceOfficerPhone: "[SUPPORT PHONE NUMBER — TO BE CONFIRMED]",

  processingTime: "[ORDER PROCESSING / CUSTOMISATION TIME — TO BE CONFIRMED]",
  deliveryEstimate: "[ESTIMATED DELIVERY TIME AFTER DISPATCH — TO BE CONFIRMED]",
  shippingCharge: "[SHIPPING CHARGE — TO BE CONFIRMED]",
  refundTimeline: "[REFUND PROCESSING TIME — TO BE CONFIRMED, subject to your bank/payment provider's own processing timelines]",

  effectiveDate: "[TO BE CONFIRMED — set to the date these policies are actually published live]",
} as const;
