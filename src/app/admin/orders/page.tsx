import { createClient } from "@/lib/supabase/server";
import { OrderList } from "@/components/dashboard/order-list";
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
  const orderData = await Promise.all((orders ?? []).map(async (order) => { const pet = order.pet_profiles?.[0]; const item = order.order_items?.[0]; const signed = pet?.photo_path ? await supabase.storage.from("pet-media").createSignedUrl(pet.photo_path, 900) : null; return { id: order.id, orderNumber: order.order_number, status: order.status, product: item?.product_name || "Petbot tag", total: order.total_paise / 100, customer: `${order.customer_name} · ${order.customer_email} · ${order.customer_phone}`, pet: `${pet?.pet_name || "Not supplied"}${pet?.breed ? ` · ${pet.breed}` : ""}`, photoUrl: signed?.data?.signedUrl ?? null }; }));
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Fulfilment</p><h1>Orders</h1><OrderList orders={orderData} /></section></main>;
}
