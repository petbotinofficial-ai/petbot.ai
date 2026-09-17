import { CinematicHome } from "@/components/marketing/cinematic-home";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: rows } = supabase
    ? await supabase
        .from("products")
        .select("id,name,slug,description,price_paise,product_media(storage_path,alt_text,position)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
    : { data: null };

  const products = (rows ?? []).map((product) => {
    const media = product.product_media?.sort((a, b) => a.position - b.position)[0];
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price_paise / 100,
      imageUrl: media ? supabase?.storage.from("product-media").getPublicUrl(media.storage_path).data.publicUrl ?? "" : "",
      imageAlt: media?.alt_text || product.name,
    };
  });

  return <CinematicHome products={products} />;
}
