import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";

const APP_URL = process.env.APP_URL || "https://wheewise.com";

// The human-readable /sitemap page (category/city links, for visitors) is
// a separate thing from this — this is the machine-readable sitemap.xml
// search engines actually crawl, listing every real, indexable URL:
// every active listing and storefront, not just the static top-level pages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  const [{ data: vehicles }, { data: dealers }] = await Promise.all([
    supabase.from("vehicles").select("slug, updated_at").eq("status", "ACTIVE"),
    supabase.from("dealers").select("slug").eq("status", "ACTIVE"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/browse`, changeFrequency: "daily", priority: 0.9 },
    { url: `${APP_URL}/help`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${APP_URL}/legal`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${APP_URL}/security`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = (vehicles ?? [])
    .filter((v) => v.slug)
    .map((v) => ({
      url: `${APP_URL}/vehicle/${v.slug}`,
      lastModified: v.updated_at,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const storeRoutes: MetadataRoute.Sitemap = (dealers ?? [])
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${APP_URL}/store/${d.slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...vehicleRoutes, ...storeRoutes];
}
