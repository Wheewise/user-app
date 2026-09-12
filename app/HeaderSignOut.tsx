"use client";

import { SignOutButton } from "@wheewise/ui";
import { createBrowserSupabaseClient } from "@wheewise/supabase";

export function HeaderSignOut({ className }: { className?: string }) {
  return (
    <SignOutButton
      className={className}
      signOut={async () => { await createBrowserSupabaseClient().auth.signOut(); }}
    />
  );
}
