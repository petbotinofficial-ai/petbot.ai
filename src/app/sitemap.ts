import type { MetadataRoute } from "next";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/how-it-works",
  "/about",
  "/faq",
  "/contact",
  "/track-order",
  "/terms-and-conditions",
  "/privacy-policy",
  "/shipping-policy",
  "/refund-and-cancellation",
  "/grievance-redressal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://petbot.ai";
  return STATIC_ROUTES.map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
