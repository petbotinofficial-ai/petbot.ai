import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const metadata = {
  title: "Shipping & Delivery Policy | Petbot",
  description: "Order processing, custom engraving, dispatch, and delivery timelines for Petbot QR pet tags.",
  alternates: { canonical: "/shipping-policy" },
};

const sections = [
  {
    heading: "1. Processing Time",
    body: `"Processing time" is the time we need to prepare and custom-engrave your tag after your payment is verified — it is separate from shipping time. Current estimated processing time: ${LEGAL_CONFIG.processingTime}.`,
  },
  {
    heading: "2. Shipping Time",
    body: `"Shipping time" is the time it takes for your order to reach you after it has been dispatched, and is in addition to processing time. Current estimated shipping time after dispatch: ${LEGAL_CONFIG.deliveryEstimate}.`,
  },
  {
    heading: "3. Dispatch Timeline",
    body: "Once your personalised tag has completed production and quality checks, it is handed over to our shipping partner for dispatch. You will be notified when your order is dispatched, where tracking information is available.",
  },
  {
    heading: "4. Delivery Locations",
    body: "We currently ship across serviceable pin codes within India. If your location is not serviceable by our courier partner, we will contact you using the details provided at checkout.",
  },
  {
    heading: "5. Shipping Charges",
    body: `Shipping charges, if any, are shown clearly at checkout before you complete payment. Current shipping charge: ${LEGAL_CONFIG.shippingCharge}.`,
  },
  {
    heading: "6. Free Shipping",
    body: "Any free-shipping offers or minimum order thresholds, if applicable, will be clearly communicated on the product or checkout page at the time of your purchase.",
  },
  {
    heading: "7. Order Tracking",
    body: "You can check your order status using our Track Order page with your order ID and registered email or mobile number. Where a courier tracking number is available, it will also be shared with you.",
  },
  {
    heading: "8. Delayed Delivery",
    body: "While we aim to meet our estimated timelines, deliveries may occasionally be delayed due to courier network issues, weather, regional restrictions, or other circumstances beyond our control. We will keep you informed of any known significant delay.",
  },
  {
    heading: "9. Incorrect Shipping Address",
    body: "Please double-check your shipping address at checkout. Petbot is not responsible for delivery delays or failures caused by an incomplete or incorrect address provided by you. If you notice an error shortly after placing your order, contact us immediately and we will try to update it before dispatch.",
  },
  {
    heading: "10. Failed Delivery Attempts",
    body: "If our courier partner is unable to deliver your order after reasonable attempts (for example, due to an unreachable address or unavailability of the recipient), the shipment may be returned to us. We will contact you to arrange re-delivery, which may involve additional shipping charges.",
  },
  {
    heading: "11. Returned Shipments",
    body: "If a shipment is returned to us because it was undeliverable, we will contact you to confirm your correct address and arrange re-shipment, subject to any applicable additional shipping charges.",
  },
  {
    heading: "12. Lost Shipments",
    body: `If a shipment appears to be lost in transit and has not arrived within a reasonable time beyond the estimated delivery window, please contact ${LEGAL_CONFIG.supportEmail} with your order ID so we can investigate with our courier partner and arrange a resolution.`,
  },
  {
    heading: "13. Damaged Packages",
    body: "If your package arrives visibly damaged, please avoid discarding the packaging and contact us with photographs as soon as possible so we can assess the issue under our Refund & Cancellation Policy.",
  },
  {
    heading: "14. Undeliverable Orders",
    body: "Orders that cannot be delivered due to reasons attributable to the customer (such as a consistently unreachable address) may be cancelled after reasonable attempts, subject to our Refund & Cancellation Policy.",
  },
  {
    heading: "15. Customer Support",
    body: `For any shipping or delivery questions, please reach out to ${LEGAL_CONFIG.supportEmail}. Support hours: ${LEGAL_CONFIG.supportHours}.`,
  },
];

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Petbot policies"
      title={<>Shipping &amp;<br /><em>delivery.</em></>}
      intro="Every Petbot tag is made especially for your pet. Here's what to expect from order to doorstep."
      sections={sections}
    />
  );
}
