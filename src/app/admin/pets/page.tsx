import { createClient } from "@/lib/supabase/server";
import { ProfileQr } from "@/components/profile/profile-qr";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PetsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const { data: pets } = await supabase.from("pet_profiles").select("id,public_id,pet_name,breed,is_public,orders(order_number,customer_name)").order("created_at", { ascending: false });
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Digital identities</p><h1>Pet profiles</h1><p className="admin-intro">Each order has one permanent link. Put its QR on the tag; the first scan completes the profile and every later scan shows it safely.</p><div className="orders-list">{pets?.length ? pets.map((pet) => <article className="order-card profile-admin-card" key={pet.id}><div><strong>{pet.pet_name}</strong><span>{pet.is_public ? "Profile live" : "Ready for first setup"}</span></div><p>{pet.breed || "Breed not supplied"} · Order: {Array.isArray(pet.orders) ? pet.orders[0]?.order_number || "Pending" : "Pending"}</p><a className="profile-url" href={`/p/${pet.public_id}`} target="_blank" rel="noreferrer">/p/{pet.public_id}</a><ProfileQr profileId={pet.public_id} label="Use this QR on the physical tag" /></article>) : <div className="empty-state">Pet profiles will be created as customers place orders.</div>}</div></section></main>;
}
