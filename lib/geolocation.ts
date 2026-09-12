export const CITY_STORAGE_KEY = "wheewise-city";
const RECENT_CITIES_KEY = "wheewise-recent-cities";
const MAX_RECENT = 5;

// OpenStreetMap's Nominatim — free, no API key, fine for this volume.
// Reverse-geocodes browser coordinates to a city name so "use current
// location" doesn't need a paid Maps API just to fill in one text field.
export async function reverseGeocodeCity(lat: number, lon: number): Promise<string | null> {
  const { city } = await reverseGeocodeAddress(lat, lon);
  return city;
}

// Richer version for the "Use current location" row, which shows a
// resolved "City, State"-style label the same way the reference apps do.
export async function reverseGeocodeAddress(
  lat: number,
  lon: number,
): Promise<{ city: string | null; label: string | null }> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) return { city: null, label: null };
  const data = await res.json();
  const city = data.address?.city || data.address?.town || data.address?.county || null;
  const state = data.address?.state as string | undefined;
  const label = [city, state].filter(Boolean).join(", ") || data.display_name || null;
  return { city, label };
}

// Forward geocode (address text -> coordinates), used server-side to place
// the dealer location on the embedded map. Nominatim's usage policy wants a
// real User-Agent on server requests. Cached for a day via Next's fetch
// cache — the same dealer address geocodes to the same result on every
// vehicle page they have listed, so there's no reason to hit Nominatim
// fresh on every single page view.
export async function geocodeAddress(query: string): Promise<{ lat: number; lon: number } | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    { headers: { "User-Agent": "Wheewise/1.0 (wheewise.com)" }, next: { revalidate: 86400 } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const first = data[0];
  return first ? { lat: parseFloat(first.lat), lon: parseFloat(first.lon) } : null;
}

// Most-recently-picked cities, separate from CITY_STORAGE_KEY (which is
// just "the currently active filter") — capped and deduped, most recent
// first, matching the reference apps' "Recent locations" section.
export function getRecentCities(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_CITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushRecentCity(city: string): void {
  try {
    const next = [city, ...getRecentCities().filter((c) => c !== city)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(next));
  } catch {
    // Private browsing etc. — no persisted history, no harm done.
  }
}
