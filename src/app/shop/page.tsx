import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = supabase ? await supabase.from("products").select("id,name,slug,description,price_paise,product_media(storage_path,alt_text,position)").eq("is_published", true).order("created_at", { ascending: false }) : { data: [] };
  return <main className="shop-page"><header className="checkout-header"><Link href="/">← Petbot</Link><span>All Petbot tags</span></header><section className="shop-page-heading"><p className="eyebrow">Petbot collection</p><h1>Choose their way home.</h1><p>Thoughtfully personalised tags, each with a digital connection when it matters most.</p></section><section className="shop-grid shop-page-grid">{products?.length ? products.map((product) => { const media = product.product_media?.sort((a, b) => a.position - b.position)[0]; const imageUrl = media ? supabase?.storage.from("product-media").getPublicUrl(media.storage_path).data.publicUrl : ""; return <article className="shop-card" key={product.id}><Link className="shop-image" href={`/shop/${product.slug}`}>{imageUrl ? <img src={imageUrl} alt={media?.alt_text || product.name} /> : <Image src="/media/petbot-tag-front.png" alt="Petbot tag" fill sizes="(max-width: 720px) 90vw, 32vw" />}</Link><div className="shop-card-copy"><div><h2>{product.name}</h2><p>{product.description || "Personalised with purpose."}</p></div><div className="product-price">₹{(product.price_paise / 100).toFixed(2)}</div></div><Link className="button button-dark" href={`/shop/${product.slug}`}>Choose this tag →</Link></article>; }) : <p className="shop-empty">No tags are available yet.</p>}</section></main>;
}
