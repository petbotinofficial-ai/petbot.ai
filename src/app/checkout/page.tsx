import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout", robots: { index: false } };

// Petbot checkout is per-product (/checkout/[slug]) since there is no multi-item cart.
// This route exists so "/checkout" is a valid entry point that forwards to the right place.
export default async function CheckoutIndexPage() {
  const supabase = await createClient();
  const { data: product } = supabase
    ? await supabase.from("products").select("slug").eq("is_published", true).order("created_at", { ascending: false }).limit(1).maybeSingle()
    : { data: null };

  if (product?.slug) redirect(`/checkout/${product.slug}`);

  return (
    <main className="info-page">
      <header><Link href="/">← Petbot</Link></header>
      <section>
        <p className="eyebrow">Checkout</p>
        <h1>No tags available<br /><em>right now.</em></h1>
        <p className="info-copy">Please visit the shop to choose a tag before checking out.</p>
        <div className="info-actions"><Link className="button button-dark" href="/shop">Visit the shop</Link></div>
      </section>
    </main>
  );
}
