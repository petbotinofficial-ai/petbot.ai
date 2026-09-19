import { CheckoutForm } from "@/components/commerce/checkout-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: PageProps<"/checkout/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data: product } = await supabase.from("products").select("id,name,slug,description,price_paise,product_media(storage_path,alt_text,position)").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!product) notFound();
  const media = product.product_media?.sort((a, b) => a.position - b.position)[0];
  return <CheckoutForm product={{ id: product.id, name: product.name, slug: product.slug, description: product.description, price: product.price_paise / 100, imageUrl: media ? supabase.storage.from("product-media").getPublicUrl(media.storage_path).data.publicUrl : "", imageAlt: media?.alt_text || product.name }} />;
}
