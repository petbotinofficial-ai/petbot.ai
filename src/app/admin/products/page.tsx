import { ProductManager } from "@/components/dashboard/product-manager";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const { data: products } = await supabase.from("products").select("id,name,slug,description,price_paise,inventory_quantity,is_published,product_media(storage_path,position)").order("created_at", { ascending: false });
  const productData = (products ?? []).map((product) => { const image = product.product_media?.sort((a, b) => a.position - b.position)[0]; return { id: product.id, name: product.name, slug: product.slug, description: product.description, price: product.price_paise / 100, inventory: product.inventory_quantity, published: product.is_published, imageUrl: image ? supabase.storage.from("product-media").getPublicUrl(image.storage_path).data.publicUrl : "", imagePath: image?.storage_path ?? null }; });
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><ProductManager products={productData} /></section></main>;
}
