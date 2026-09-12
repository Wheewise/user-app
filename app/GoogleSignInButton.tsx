"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { createBrowserSupabaseClient } from "@wheewise/supabase";
import { GoogleIcon } from "@wheewise/ui";

export function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  const [pending, setPending] = useState(false);
  const t = useTranslations("auth");

  const continueWithGoogle = useCallback(async () => {
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      // Enabled dashboard-side (Authentication > Providers > Google) — the
      // redirect itself needs no client secret here, Supabase holds that.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        },
      });
      // Browser navigates away to Google on success; only reset on failure
      // (a thrown/rejected client — e.g. missing env config — would
      // otherwise leave this stuck on "Redirecting…" forever with no clue).
      if (error) {
        console.error("Google sign-in failed:", error.message);
        setPending(false);
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setPending(false);
    }
  }, [callbackUrl]);

  return (
    <button
      type="button"
      onClick={continueWithGoogle}
      disabled={pending}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-border-default px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted disabled:opacity-50"
    >
      <GoogleIcon className="h-5 w-5" />
      {pending ? t("redirecting") : t("continueWithGoogle")}
    </button>
  );
}
