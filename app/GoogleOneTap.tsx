"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@wheewise/supabase";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            nonce: string;
            use_fedcm_for_prompt?: boolean;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGsiScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve()));
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function randomNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Google's native One Tap account chooser (the small card Chrome renders
// itself) — not our own login modal. The raw nonce goes to Supabase,
// the SHA-256 hash of it goes to Google; Supabase re-hashes the raw nonce
// it gets back from the ID token and checks it matches, which is what
// stops a captured token from being replayed later.
// Google's own g_state cookie already remembers a dismissal and backs off
// showing the prompt again for a while, so this doesn't need its own
// localStorage dismiss-tracking on top of that.
export function GoogleOneTap({ isAuthenticated }: { isAuthenticated: boolean }) {
  useEffect(() => {
    if (isAuthenticated) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let cancelled = false;

    loadGsiScript().then(async () => {
      if (cancelled || !window.google) return;
      const nonce = randomNonce();
      const hashedNonce = await sha256Hex(nonce);
      if (cancelled) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
        auto_select: false,
        callback: async (response) => {
          const supabase = createBrowserSupabaseClient();
          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce,
          });
          if (!error) window.location.reload();
        },
      });
      window.google.accounts.id.prompt();
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return null;
}
