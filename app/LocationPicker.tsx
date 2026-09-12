"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LocationIcon, ChevronRightIcon } from "@wheewise/ui";
import {
  CITY_STORAGE_KEY,
  reverseGeocodeAddress,
  getRecentCities,
  pushRecentCity,
} from "../lib/geolocation";

const CITIES = [
  "Kozhikode", "Kochi", "Thiruvananthapuram", "Thrissur", "Kannur",
  "Kollam", "Kottayam", "Malappuram", "Palakkad", "Alappuzha",
];

function useLocationPickerState() {
  const router = useRouter();
  // Starts empty (matching the server-rendered markup) and fills in from
  // localStorage only after mount — reading it inside useState's
  // initializer would render client-only text during hydration, which
  // React flags as a hydration mismatch against the server's empty markup.
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CITY_STORAGE_KEY);
      if (stored) setValue(stored);
    } catch {
      // Private browsing etc. — field just stays empty.
    }
    setRecent(getRecentCities());
  }, []);

  // Pre-resolves a "Use current location" subtitle the moment permission is
  // already granted, same as the reference apps showing the place before
  // you even tap it — never prompts for permission from here.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!navigator.geolocation) return;
      try {
        const status = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
        if (!status || status.state !== "granted") return;
      } catch {
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          const { label } = await reverseGeocodeAddress(pos.coords.latitude, pos.coords.longitude);
          if (!cancelled && label) setNearbyLabel(label);
        },
        () => {},
        { timeout: 10000 },
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CITIES;
    return CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  const recentMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter((c) => c.toLowerCase().includes(q));
  }, [recent, query]);

  const selectCity = useCallback(
    (city: string) => {
      setValue(city);
      setQuery("");
      pushRecentCity(city);
      setRecent(getRecentCities());
      try {
        localStorage.setItem(CITY_STORAGE_KEY, city);
      } catch {
        // Private browsing etc. — the pick still scopes this navigation.
      }
      router.push(`/browse?city=${encodeURIComponent(city)}`);
    },
    [router],
  );

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Not supported");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { city } = await reverseGeocodeAddress(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
        if (city) selectCity(city);
        else setError("Couldn't detect city");
      },
      () => {
        setLocating(false);
        setError("Location access denied");
      },
      { timeout: 10000 },
    );
  }, [selectCity]);

  return {
    value, query, setQuery, matches, recentMatches, locating, nearbyLabel, error,
    selectCity, useCurrentLocation,
  };
}

function UseCurrentLocationRow({
  locating,
  nearbyLabel,
  onClick,
}: {
  locating: boolean;
  nearbyLabel: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locating}
      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-muted disabled:opacity-60"
    >
      <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <span>
        <span className="block text-sm font-semibold text-brand">
          {locating ? "Locating…" : "Use current location"}
        </span>
        {nearbyLabel ? <span className="block text-xs text-zinc-500">{nearbyLabel}</span> : null}
      </span>
    </button>
  );
}

function LocationSection({ title, cities, onPick }: { title: string; cities: string[]; onPick: (c: string) => void }) {
  if (cities.length === 0) return null;
  return (
    <div className="py-2">
      <p className="px-4 pb-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">{title}</p>
      {cities.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onPick(c)}
          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-surface-muted hover:text-brand"
        >
          <LocationIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          {c}
        </button>
      ))}
    </div>
  );
}

// Desktop: field opens an inline dropdown panel below it, same trigger the
// field has always had. Structure matches the reference apps: a persistent
// "Use current location" action, then Recent, then Popular locations.
function DesktopLocationPicker({ className }: { className: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const s = useLocationPickerState();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const pick = (c: string) => {
    s.selectCity(c);
    setOpen(false);
  };
  const useCurrent = () => {
    s.useCurrentLocation();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex items-center gap-1.5 rounded-full border border-border-default bg-background px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
      >
        <LocationIcon className="h-4 w-4 shrink-0 text-brand" />
        <input
          ref={inputRef}
          name="city"
          value={open ? s.query : s.value}
          onChange={(e) => s.setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={s.locating ? "Locating…" : "Choose location"}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
        <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
      </div>

      {open ? (
        <div className="absolute top-full left-0 z-30 mt-1.5 w-72 overflow-hidden rounded-xl border border-border-default bg-background py-1.5 shadow-lg">
          <UseCurrentLocationRow locating={s.locating} nearbyLabel={s.nearbyLabel} onClick={useCurrent} />
          <div className="border-t border-border-default" />
          <LocationSection title="Recent locations" cities={s.recentMatches} onPick={pick} />
          {s.recentMatches.length > 0 ? <div className="border-t border-border-default" /> : null}
          <LocationSection title="Popular locations" cities={s.matches} onPick={pick} />
        </div>
      ) : null}

      {s.error ? <p className="mt-0.5 text-[11px] text-danger">{s.error}</p> : null}
    </div>
  );
}

// Mobile: the header field is just a display button — tapping it opens a
// full-screen panel with its own search box, matching the reference apps'
// dedicated "Location" page rather than a cramped inline dropdown.
function MobileLocationPicker({ className }: { className: string }) {
  const [open, setOpen] = useState(false);
  const s = useLocationPickerState();

  const pick = (c: string) => {
    s.selectCity(c);
    setOpen(false);
  };
  const useCurrent = () => {
    s.useCurrentLocation();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex shrink-0 items-center gap-1 py-2 text-left ${className}`}
      >
        <LocationIcon className="h-4 w-4 shrink-0 text-brand" />
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
          {s.value || "Choose location"}
        </span>
        <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center gap-3 border-b border-border-default px-4 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Back"
              className="text-zinc-500 hover:text-brand"
            >
              ←
            </button>
            <h2 className="text-base font-semibold">Location</h2>
          </div>

          <div className="px-4 py-3">
            <input
              autoFocus
              value={s.query}
              onChange={(e) => s.setQuery(e.target.value)}
              placeholder="Search city, area or locality"
              autoComplete="off"
              className="w-full rounded-full border border-border-default bg-surface-muted px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <UseCurrentLocationRow locating={s.locating} nearbyLabel={s.nearbyLabel} onClick={useCurrent} />
            <div className="border-t border-border-default" />
            <LocationSection title="Recent locations" cities={s.recentMatches} onPick={pick} />
            {s.recentMatches.length > 0 ? <div className="border-t border-border-default" /> : null}
            <LocationSection title="Popular locations" cities={s.matches} onPick={pick} />
          </div>

          {s.error ? <p className="px-4 py-2 text-xs text-danger">{s.error}</p> : null}
        </div>
      ) : null}
    </>
  );
}

export function LocationPicker({ className = "w-44", mobile = false }: { className?: string; mobile?: boolean }) {
  return mobile ? <MobileLocationPicker className={className} /> : <DesktopLocationPicker className={className} />;
}
