"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function ProductManager() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  function previewImage(event: ChangeEvent<HTMLInputElement>) {
    const image = event.target.files?.[0];
    if (!image) return setImagePreview("");
    setImagePreview(URL.createObjectURL(image));
  }

  async function createProduct(formData: FormData) {
    const supabase = createClient();
    if (!supabase) return setMessage("Supabase is not configured.");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const priceRupees = Number(formData.get("price"));
    if (name.length < 2 || !slug || !Number.isFinite(priceRupees) || priceRupees < 0) return setMessage("Add a product name, a valid slug, and a valid price.");
    const image = formData.get("image");
    if (image instanceof File && image.size > MAX_IMAGE_BYTES) return setMessage("Choose an image smaller than 8 MB.");
    if (image instanceof File && image.size && !image.type.startsWith("image/")) return setMessage("Choose an image file (JPG, PNG, or WebP).");
    setSaving(true);
    const { data: product, error } = await supabase.from("products").insert({
      name,
      slug,
      description: String(formData.get("description") ?? "").trim(),
      price_paise: Math.round(priceRupees * 100),
      inventory_quantity: Number(formData.get("inventory")) || 0,
      is_published: formData.get("is_published") === "on",
    }).select("id").single();
    if (error) return setMessage("We could not save that product. Check the slug is unique and try again.");

    if (image instanceof File && image.size && product) {
      const extension = image.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "image";
      const storagePath = `${product.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("product-media").upload(storagePath, image, { contentType: image.type, upsert: false });
      if (uploadError) {
        setSaving(false);
        return setMessage("Product saved, but the image upload failed. Please try the image again shortly.");
      }
      const { error: mediaError } = await supabase.from("product_media").insert({ product_id: product.id, storage_path: storagePath, alt_text: name, position: 0 });
      if (mediaError) {
        await supabase.storage.from("product-media").remove([storagePath]);
        setSaving(false);
        return setMessage("Product saved, but its image could not be attached. Please try again shortly.");
      }
    }

    setSaving(false);
    setImagePreview("");
    setMessage(image instanceof File && image.size ? "Product and image saved." : "Product saved. You can add its main image next time from this form.");
    router.refresh();
  }

  return <form action={createProduct} className="product-form"><div className="form-heading"><div><p className="eyebrow">Catalogue</p><h2>Add a product</h2></div><button disabled={saving}>{saving ? "Saving…" : "Save product"}</button></div><div className="form-grid"><label>Product name<input name="name" required placeholder="Personalized Bone Tag" /></label><label>URL slug<input name="slug" required placeholder="personalized-bone-tag" pattern="[a-z0-9-]+" /></label><label>Price (₹)<input name="price" required type="number" min="0" step="0.01" placeholder="449" /></label><label>Inventory<input name="inventory" type="number" min="0" defaultValue="0" /></label></div><label>Description<textarea name="description" rows={4} placeholder="A short, customer-facing description." /></label><div className="image-upload"><label htmlFor="image">Main product image<input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={previewImage} /></label><p>JPG, PNG, or WebP · maximum 8 MB</p>{imagePreview && <img alt="Selected product preview" className="image-preview" src={imagePreview} />}</div><label className="checkbox"><input name="is_published" type="checkbox" /> Publish immediately</label>{message && <p className="form-message" role="status">{message}</p>}</form>;
}
