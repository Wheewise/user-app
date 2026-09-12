import type { MetadataRoute } from "next";

const APP_URL = process.env.APP_URL || "https://wheewise.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Signed-in-only pages have nothing for a crawler to index anyway
      // (RLS/requireAuthContext just bounces an anonymous request), and
      // the OAuth/reset routes are pure redirects, never real content.
      disallow: ["/wishlist", "/enquiries", "/auth/", "/reset-password"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
