"use client";

import { useEffect } from "react";

// Registered only in production — an active service worker under `next dev`
// fights with Fast Refresh and can serve stale hot-reloaded code from cache.
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
