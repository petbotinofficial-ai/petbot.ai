"use client";

import Link from "next/link";
import { trackAddToCart } from "@/lib/meta-pixel";

export function BuyNowButton({ slug, value, href }: { slug: string; value: number; href: string }) {
  return (
    <Link className="button button-dark" href={href} onClick={() => trackAddToCart(slug, value)}>
      Buy now <span aria-hidden="true">→</span>
    </Link>
  );
}
