// No locale prefix in the URL on purpose — every route/canonical/sitemap
// URL already built this session stays valid, and search engines keep
// indexing one URL per page. The tradeoff (no per-language indexing via
// hreflang) is acceptable for a first pass; add locale-prefixed routing
// later if that's ever worth the URL restructure.
export const locales = ["en", "ml", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale";
