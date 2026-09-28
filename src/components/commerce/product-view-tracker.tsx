"use client";

import { useEffect, useRef } from "react";
import { trackViewContent } from "@/lib/meta-pixel";

export function ProductViewTracker({ slug, value }: { slug: string; value: number }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewContent(slug, value);
  }, [slug, value]);

  return null;
}
