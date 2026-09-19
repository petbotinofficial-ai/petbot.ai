import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const { data: orders } = await supabase.from("orders").select("id,order_number,customer_name,customer_email,customer_phone,shipping_address,status,total_paise,order_items(product_name,personalization),payments(status,utr),pet_profiles(pet_name,breed,photo_path)").order("created_at", { ascending: false });
  const cards = await Promise.all((orders ?? []).map(async (order) => { const pet = order.pet_profiles?.[0]; const item = order.order_items?.[0]; const payment = order.payments?.[0]; const signed = pet?.photo_path ? await supabase.storage.from("pet-media").createSignedUrl(pet.photo_path, 900) : null; const photoUrl = signed?.data?.signedUrl ?? null; return <article className="order-card" key={order.id}><div><strong>{order.order_number}</strong><span>{order.status.replace("_", " ")}</span></div><p>{item?.product_name} · ₹{(order.total_paise / 100).toFixed(2)}</p><p>{order.customer_name} · {order.customer_email} · {order.customer_phone}</p><p>Pet: {pet?.pet_name || "Not supplied"} {pet?.breed ? `· ${pet.breed}` : ""}</p><p>Payment: {payment?.status || "pending"}{payment?.utr ? ` · UTR ${payment.utr}` : ""}</p>{photoUrl ? <a className="button button-dark" href={photoUrl}>Download pet photo ↓</a> : <span>No pet photo uploaded</span>}</article>; }));
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Fulfilment</p><h1>Orders</h1><div className="orders-list">{cards.length ? cards : <div className="empty-state">New customer orders will appear here after checkout.</div>}</div></section></main>;
}
