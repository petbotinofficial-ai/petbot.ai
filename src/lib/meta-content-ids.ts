// Maps this app's canonical product slug (products.slug) to the exact Content ID registered
// for that product in Meta Commerce Manager. Confirmed directly from the live catalog — these
// values are NOT derived from the slug. The cat tag's catalog Content ID is a differently-cased,
// space-containing string that the products.slug check constraint (^[a-z0-9]+(-[a-z0-9]+)*$)
// would reject as a slug, so it can only be reached via this explicit mapping.
// Do not lowercase, slugify, or otherwise transform these values.
//
// Shared by both browser code (src/lib/meta-pixel.ts) and server-only code
// (src/lib/meta-capi.ts) — this module itself must stay free of "use client"/"server-only"
// so either side can import it.
const PRODUCT_SLUG_TO_META_CONTENT_ID: Record<string, string> = {
  "personalized-dog-tag": "personalized-dog-tag",
  "personalized-cat-tag": "Personalized Cat Tag",
};

export function getMetaContentId(productSlug: string): string | null {
  return PRODUCT_SLUG_TO_META_CONTENT_ID[productSlug] ?? null;
}
