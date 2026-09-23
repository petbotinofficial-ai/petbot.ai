import Link from "next/link";

export const metadata = { title: "Contact Petbot" };

export default function ContactPage() {
  return <main className="info-page"><header><Link href="/">← Petbot</Link><Link href="/shop" className="button button-dark">Shop tags</Link></header><section><p className="eyebrow">Contact Petbot</p><h1>We&rsquo;d love to<br /><em>hear from you.</em></h1><p className="info-copy">Questions about a custom tag, an existing order, or helping a pet get safely home? Reach out anytime.</p><div className="info-actions"><a className="button button-dark" href="mailto:Petbot.inofficial@gmail.com">Email Petbot</a><a className="button button-outline" href="https://www.instagram.com/petbot.in?stkn=MTBzczQ3NzFhbWQ3OA==" target="_blank" rel="noreferrer">Follow us on Instagram ↗</a></div><p className="info-email">Petbot.inofficial@gmail.com</p></section></main>;
}
