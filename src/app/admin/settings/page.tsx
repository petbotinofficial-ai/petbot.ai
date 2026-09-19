import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Owner controls</p><h1>Settings</h1><div className="orders-list"><article className="order-card"><strong>Payment method</strong><p>Manual UPI review is enabled. Submitted payments appear under Payments for approval.</p></article><article className="order-card"><strong>Customer email</strong><p>Payment confirmations are sent from the secure server after you approve a submitted payment.</p></article><article className="order-card"><strong>Owner access</strong><p>Use email and password at <Link href="/admin/login">the owner login</Link>. If needed, send yourself a password setup link there.</p></article></div></section></main>;
}
