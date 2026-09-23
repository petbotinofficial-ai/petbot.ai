import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { productId } = await request.json().catch(() => ({}));
  if (typeof productId !== "string") return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  const { data: media } = await supabase.from("product_media").select("storage_path").eq("product_id", productId);
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return NextResponse.json({ error: "This product cannot be deleted because it is part of an existing order." }, { status: 409 });
  const paths = (media ?? []).map((item) => item.storage_path);
  if (paths.length) await supabase.storage.from("product-media").remove(paths);
  return NextResponse.json({ ok: true });
}
