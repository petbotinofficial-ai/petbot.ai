import Link from "next/link";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer-full">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <Link className="wordmark" href="/" aria-label="Petbot home">
            <span className="wordmark-mark" aria-hidden="true">✦</span>petbot
          </Link>
          <p>More than a tag. A way back home.</p>
        </div>
        <div className="site-footer-col">
          <h3>Shop</h3>
          <ul>
            <li><Link href="/shop">Pet Tags</Link></li>
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
          </ul>
        </div>
        <div className="site-footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="site-footer-col">
          <h3>Support</h3>
          <ul>
            <li><Link href="/track-order">Track Order</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>
        <div className="site-footer-col">
          <h3>Legal</h3>
          <ul>
            <li><Link href="/terms-and-conditions">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/shipping-policy">Shipping Policy</Link></li>
            <li><Link href="/refund-and-cancellation">Refund &amp; Cancellation Policy</Link></li>
            <li><Link href="/grievance-redressal">Grievance Redressal</Link></li>
          </ul>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {year} {LEGAL_CONFIG.businessName}. All Rights Reserved.</span>
        <span className="footer-disclaimer">{LEGAL_CONFIG.businessName} is an {LEGAL_CONFIG.businessStructure}.</span>
      </div>
    </footer>
  );
}
