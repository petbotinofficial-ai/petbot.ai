import Link from "next/link";
import { ProfileQr } from "@/components/profile/profile-qr";

export const metadata = {
  title: "How It Works",
  description: "How Petbot's QR pet tags help a finder reach you in seconds.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  { title: "Wear", copy: "A considered tag, personalised with your pet's name and engraved details." },
  { title: "Scan", copy: "Anyone who finds your pet can scan the QR code — no app required." },
  { title: "Reconnect", copy: "The finder sees a safe profile with a way to reach you, helping bring your pet home faster." },
];

export default function HowItWorksPage() {
  return (
    <main className="petbot-page">
      <header className="checkout-header"><Link href="/">← Petbot</Link><Link href="/shop">Shop tags</Link></header>
      <section className="story-section">
        <div className="story-sticky">
          <p className="eyebrow">One thoughtful connection</p>
          <h2>One scan,<br />one way home.</h2>
          <p>Every Petbot tag pairs a durable, engraved tag with a private digital profile — so a finder can help your pet find their way back to you in seconds.</p>
        </div>
        <ol className="story-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.title}</strong>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="how-section" aria-labelledby="how-title">
        <div className="how-visual"><span className="orbit orbit-one" aria-hidden="true" /><span className="orbit orbit-two" aria-hidden="true" /><ProfileQr profileId="sample-tommy" label="Scan to meet Tommy" /></div>
        <div className="how-content">
          <p className="eyebrow">Try it yourself</p>
          <h2 id="how-title">This is a real<br /><em>profile QR.</em></h2>
          <p>Scan it, or tap below, to see the safe, finder-friendly profile that lives behind every Petbot tag. Owners control exactly what appears here.</p>
          <Link href="/p/sample-tommy" className="button button-light">Try the sample profile <span aria-hidden="true">↗</span></Link>
          <ul>
            <li><span aria-hidden="true">✦</span>No app needed to scan</li>
            <li><span aria-hidden="true">✦</span>You control what&apos;s shown publicly</li>
            <li><span aria-hidden="true">✦</span>Optional location-sharing helps a finder reach you</li>
          </ul>
        </div>
      </section>
      <section className="shop-section">
        <div className="shop-heading"><p className="eyebrow">Ready when you are</p><h2>Give your pet a way home.</h2></div>
        <div className="info-actions" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Link className="button button-dark" href="/shop">Shop tags <span aria-hidden="true">→</span></Link>
          <Link className="button button-outline" href="/faq">Read the FAQ</Link>
        </div>
      </section>
    </main>
  );
}
