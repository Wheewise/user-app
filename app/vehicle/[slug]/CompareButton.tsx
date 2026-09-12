"use client";

import { CompareIcon } from "@wheewise/ui";
import { useLoginModal } from "../../LoginModalProvider";

// Compare isn't built yet either — same treatment as ChatButton.
// Signed-out visitors always hit the sign-in gate on click regardless, so
// the button looks fully active to invite that — only once actually
// signed in does it honestly show as "coming soon" rather than silently
// doing nothing.
export function CompareButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { open } = useLoginModal();

  return (
    <button
      type="button"
      title={isAuthenticated ? "Compare — coming soon" : undefined}
      onClick={() => {
        if (!isAuthenticated) open();
      }}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border-default px-4 py-2 text-sm font-semibold transition-colors ${
        isAuthenticated ? "text-zinc-400 opacity-60" : "text-foreground hover:bg-surface-muted"
      }`}
    >
      <CompareIcon className="h-4 w-4" />
      Compare
    </button>
  );
}
