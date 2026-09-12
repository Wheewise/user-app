"use client";

import { useEffect } from "react";
import { CITY_STORAGE_KEY, reverseGeocodeCity } from "../lib/geolocation";

const LOCATION_ASKED_KEY = "wheewise-location-asked";

// Fires the browser's native "share your location" prompt on a visitor's
// first visit (desktop and mobile) — once per browser.
export function AutoPrompts() {
  useEffect(() => {
    let asked = false;
    try {
      asked = localStorage.getItem(LOCATION_ASKED_KEY) === "1";
    } catch {
      return;
    }
    if (asked || !navigator.geolocation) return;
    localStorage.setItem(LOCATION_ASKED_KEY, "1");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const city = await reverseGeocodeCity(pos.coords.latitude, pos.coords.longitude);
        if (city) {
          try {
            localStorage.setItem(CITY_STORAGE_KEY, city);
          } catch {
            // Private browsing etc. — no persisted city, no harm done.
          }
        }
      },
      () => {
        // Denied/unavailable — LOCATION_ASKED_KEY is already set, so this
        // doesn't nag the visitor again on their next visit.
      },
      { timeout: 10000 },
    );
  }, []);

  return null;
}
