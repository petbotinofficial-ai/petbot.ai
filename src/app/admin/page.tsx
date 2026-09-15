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
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><a href="#orders">Orders</a><a href="#payments">Payments</a><a href="#pets">Pet profiles</a><a href="#settings">Settings</a></nav></aside><section><p className="eyebrow">Owner workspace</p><h1>Good to see you.</h1><div className="admin-grid"><article><span>Products</span><strong>0</strong><p>Add your first tag to begin selling.</p></article><article><span>Orders</span><strong>0</strong><p>New manual payments will appear here.</p></article><article><span>Payments to review</span><strong>0</strong><p>UTR references and proofs stay private.</p></article></div></section></main>;
}
