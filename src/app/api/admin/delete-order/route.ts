import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { orderId } = await request.json().catch(() => ({}));
  if (typeof orderId !== "string") return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  const { data: pets } = await supabase.from("pet_profiles").select("id,photo_path").eq("order_id", orderId);
  const paths = (pets ?? []).flatMap((pet) => pet.photo_path ? [pet.photo_path] : []);
  if (paths.length) await supabase.storage.from("pet-media").remove(paths);
  const { error: petError } = await supabase.from("pet_profiles").delete().eq("order_id", orderId);
  if (petError) return NextResponse.json({ error: petError.message }, { status: 500 });
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
