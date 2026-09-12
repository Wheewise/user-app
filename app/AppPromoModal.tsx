"use client";

import { useEffect, useState } from "react";
import { CloseIcon, ChatIcon } from "@wheewise/ui";

const SHOWN_KEY = "wheewise-app-promo-shown";
const DELAY_MS = 60_000;

// One-time app-download nudge, modeled on the reference apps' post-visit
// popup — fires once, 60s into a visit, never again after it's closed
// (tracked in localStorage, not just component state, so a page reload
// doesn't bring it back). No fake ratings/download counts here — the app
// itself is still "Coming soon" (see AppDownloadBanner), so the CTA scrolls
// to the footer's real (marked "Coming soon") app badges instead of
// pretending there's something to install right now.
export function AppPromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let shown = false;
    try {
      shown = localStorage.getItem(SHOWN_KEY) === "1";
    } catch {
      return;
    }
    if (shown) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(SHOWN_KEY, "1");
    } catch {
      // Private browsing etc. — worst case it can show again next visit.
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={dismiss}>
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-xl border border-border-default bg-background p-6 text-center shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-400 hover:text-foreground"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <ChatIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-bold">Chat your way to faster buying &amp; selling</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Enquire, chat with verified dealers, and close deals faster — right from the Wheewise app.
        </p>

        <a
          href="#get-app"
          onClick={dismiss}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Get the app
        </a>
      </div>
    </div>
  );
}
