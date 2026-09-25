import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://petbot.in";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/checkout", "/order-success", "/order-failed", "/order-cancelled"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
