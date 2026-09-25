import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data: product } = await supabase.from("products").select("id,name,slug,description,price_paise,product_media(storage_path,alt_text,position)").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!product) notFound();
  const media = product.product_media?.sort((a, b) => a.position - b.position)[0];
  const imageUrl = media ? supabase.storage.from("product-media").getPublicUrl(media.storage_path).data.publicUrl : "";
  return <main className="product-page"><header className="checkout-header"><Link href="/">← Petbot</Link><Link href="/#shop">All tags</Link></header><section className="product-detail"><div className="product-detail-image">{imageUrl ? <img src={imageUrl} alt={media?.alt_text || product.name} /> : <Image src="/media/petbot-tag-front.png" alt="Personalised Petbot tag" fill sizes="(max-width: 760px) 90vw, 50vw" />}</div><div className="product-detail-copy"><p className="eyebrow">Petbot personalised tag</p><h1>{product.name}</h1><p>{product.description || "A thoughtful tag made for everyday adventures and the moments that matter."}</p><strong>₹{(product.price_paise / 100).toFixed(2)}</strong><ul><li>Personalised for your pet</li><li>QR-powered digital identity</li><li>{LEGAL_CONFIG.shippingCharge}, no Cash on Delivery</li><li>{LEGAL_CONFIG.processingTime}; final delivery within 10–12 days</li><li>Orders cannot be cancelled once placed — see our <Link href="/refund-and-cancellation">Refund &amp; Cancellation Policy</Link></li></ul><Link className="button button-dark" href={`/checkout/${product.slug}`}>Buy now <span aria-hidden="true">→</span></Link></div></section></main>;
}
