import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "QR Pet Tag",
  description: "Petbot's personalised, custom engraved QR pet tag — a durable everyday tag paired with a private digital profile.",
  alternates: { canonical: "/product/pet-tag" },
};

// Canonical marketing URL for the flagship product. Products live at dynamic /shop/[slug]
// routes, so this page forwards to the first published product rather than duplicating content.
export default async function PetTagProductPage() {
  const supabase = await createClient();
  const { data: product } = supabase
    ? await supabase.from("products").select("slug").eq("is_published", true).order("created_at", { ascending: false }).limit(1).maybeSingle()
    : { data: null };

  if (product?.slug) redirect(`/shop/${product.slug}`);

  return (
    <main className="info-page">
      <header><Link href="/">← Petbot</Link></header>
      <section>
        <p className="eyebrow">Petbot QR pet tag</p>
        <h1>Coming back<br /><em>very soon.</em></h1>
        <p className="info-copy">Our tags are being prepared. Check back shortly, or explore the full shop.</p>
        <div className="info-actions"><Link className="button button-dark" href="/shop">Visit the shop</Link></div>
      </section>
    </main>
  );
}
