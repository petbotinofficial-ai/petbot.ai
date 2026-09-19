import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PetsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const { data: pets } = await supabase.from("pet_profiles").select("id,pet_name,breed,photo_path,orders(order_number,customer_name)").order("created_at", { ascending: false });
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Digital identities</p><h1>Pet profiles</h1><div className="orders-list">{pets?.length ? pets.map((pet) => <article className="order-card" key={pet.id}><strong>{pet.pet_name}</strong><p>{pet.breed || "Breed not supplied"}</p><p>Order: {Array.isArray(pet.orders) ? pet.orders[0]?.order_number || "Pending" : "Pending"}</p></article>) : <div className="empty-state">Pet profiles will be created as customers place orders.</div>}</div></section></main>;
}
