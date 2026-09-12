"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@wheewise/ui";

const DISMISS_KEY = "wheewise-app-banner-dismissed";

// Only ever mounted for real phone devices — layout.tsx renders this
// conditionally on lib/device.ts's User-Agent check, not a CSS breakpoint.
// A "get our phone app" prompt doesn't apply on desktop/tablet, which
// already have the Footer's App Store/Play Store badges instead.
export function AppDownloadBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      // Private browsing etc. — just show the banner, no harm done.
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Nothing to persist — banner just stays dismissed for this visit.
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-zinc-900 px-4 py-3 text-white">
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-zinc-400 hover:text-white">
        <CloseIcon className="h-5 w-5" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-mark.webp" alt="" className="h-8 w-8 shrink-0 rounded-lg bg-white object-contain p-1" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-semibold">Buy & sell better with the app</p>
        <p className="text-xs text-zinc-400">Coming soon</p>
      </div>
      <a
        href="#get-app"
        onClick={dismiss}
        className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-semibold hover:bg-brand-dark"
      >
        Learn more
      </a>
    </div>
  );
}
