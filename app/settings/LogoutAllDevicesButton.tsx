"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@wheewise/supabase";

export function LogoutAllDevicesButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (!window.confirm("Sign out everywhere you're currently logged in?")) return;
        setPending(true);
        const supabase = createBrowserSupabaseClient();
        // scope: "global" revokes every session, not just this device's —
        // the whole point of this control, vs. the regular header sign-out.
        await supabase.auth.signOut({ scope: "global" });
        router.push("/login");
        router.refresh();
      }}
      className="flex w-full items-center gap-3 border-b border-border-default px-4 py-3.5 text-left text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Logout from all devices"}
    </button>
  );
}
