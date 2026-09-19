import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) return <main className="admin-login"><section><p className="eyebrow">Setup required</p><h1>Connect Supabase first.</h1><p>Add the public Supabase URL and publishable key to Vercel to enable the Petbot owner workspace.</p></section></main>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) return <main className="admin-login"><section><p className="eyebrow">Access restricted</p><h1>This workspace is private.</h1><p>Your account is signed in but has not been approved as a Petbot administrator.</p></section></main>;
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Owner workspace</p><h1>Good to see you.</h1><div className="admin-grid"><article><span>Products</span><strong>Catalogue</strong><p>Manage the tags you sell.</p></article><article><span>Orders</span><strong>Fulfilment</strong><p>Customer orders and pet photos.</p></article><article><span>Payments to review</span><strong>Review</strong><p>Approve submitted UPI payments.</p></article></div></section></main>;
}
