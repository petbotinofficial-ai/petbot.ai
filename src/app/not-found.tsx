import Link from "next/link";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <main className="info-page">
      <header>
        <Link href="/">← Petbot</Link>
      </header>
      <section>
        <p className="eyebrow">404</p>
        <h1>We couldn&rsquo;t find<br /><em>that page.</em></h1>
        <p className="info-copy">The page you&rsquo;re looking for may have moved or no longer exists.</p>
        <div className="info-actions">
          <Link className="button button-dark" href="/">Back to home</Link>
          <Link className="button button-outline" href="/shop">Shop tags</Link>
          <Link className="button button-outline" href="/contact">Contact us</Link>
        </div>
      </section>
    </main>
  );
}
