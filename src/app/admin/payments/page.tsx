import { PaymentList } from "@/components/dashboard/payment-list";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const { data } = await supabase.from("payments").select("id,status,order_id,orders(order_number,customer_name,customer_email,total_paise)").order("created_at", { ascending: false });
  const payments = (data ?? []).map((payment) => {
    const order = Array.isArray(payment.orders) ? payment.orders[0] : payment.orders;
    return { id: payment.id, orderId: payment.order_id, orderNumber: order?.order_number ?? "Order", customer: order?.customer_name ?? "", email: order?.customer_email ?? "", total: (order?.total_paise ?? 0) / 100, status: payment.status };
  });
  return <main className="admin-shell"><aside><Link href="/">petbot</Link><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/payments">Payments</Link><Link href="/admin/pets">Pet profiles</Link><Link href="/admin/settings">Settings</Link></nav></aside><section><p className="eyebrow">Payment review</p><h1>Payments</h1><PaymentList payments={payments} /></section></main>;
}
