"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductManager() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function createProduct(formData: FormData) {
    const supabase = createClient();
    if (!supabase) return setMessage("Supabase is not configured.");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const priceRupees = Number(formData.get("price"));
    if (name.length < 2 || !slug || !Number.isFinite(priceRupees) || priceRupees < 0) return setMessage("Add a product name, a valid slug, and a valid price.");
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name,
      slug,
      description: String(formData.get("description") ?? "").trim(),
      price_paise: Math.round(priceRupees * 100),
      inventory_quantity: Number(formData.get("inventory")) || 0,
      is_published: formData.get("is_published") === "on",
    });
    setSaving(false);
    if (error) return setMessage("We could not save that product. Check the slug is unique and try again.");
    setMessage("Product saved.");
    router.refresh();
  }

  return <form action={createProduct} className="product-form"><div className="form-heading"><div><p className="eyebrow">Catalogue</p><h2>Add a product</h2></div><button disabled={saving}>{saving ? "Saving…" : "Save product"}</button></div><div className="form-grid"><label>Product name<input name="name" required placeholder="Personalized Bone Tag" /></label><label>URL slug<input name="slug" required placeholder="personalized-bone-tag" pattern="[a-z0-9-]+" /></label><label>Price (₹)<input name="price" required type="number" min="0" step="0.01" placeholder="449" /></label><label>Inventory<input name="inventory" type="number" min="0" defaultValue="0" /></label></div><label>Description<textarea name="description" rows={4} placeholder="A short, customer-facing description." /></label><label className="checkbox"><input name="is_published" type="checkbox" /> Publish immediately</label>{message && <p className="form-message" role="status">{message}</p>}</form>;
}
