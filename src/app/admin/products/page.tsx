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
  const { data: products } = await supabase.from("products").select("id,name,slug,price_paise,inventory_quantity,is_published,product_media(storage_path,alt_text,position)").order("created_at", { ascending: false });
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><a href="/admin#orders">Orders</a><a href="/admin#payments">Payments</a></nav></aside><section><ProductManager /><div className="product-list"><div className="form-heading"><div><p className="eyebrow">Live catalogue</p><h2>Products</h2></div><span>{products?.length ?? 0} total</span></div>{products?.length ? <div className="product-table">{products.map((product) => { const image = product.product_media?.sort((a, b) => a.position - b.position)[0]; const imageUrl = image ? supabase.storage.from("product-media").getPublicUrl(image.storage_path).data.publicUrl : ""; return <article key={product.id}>{imageUrl ? <img src={imageUrl} alt={image?.alt_text || product.name} className="product-thumbnail" /> : <div className="product-thumbnail placeholder">No image</div>}<div><strong>{product.name}</strong><span>/{product.slug}</span></div><span>₹{(product.price_paise / 100).toFixed(2)}</span><span>{product.inventory_quantity} in stock</span><span className={product.is_published ? "status-live" : "status-draft"}>{product.is_published ? "Live" : "Draft"}</span></article>; })}</div> : <div className="empty-state">Your catalogue is empty. Add your first personalised tag above.</div>}</div></section></main>;
}
