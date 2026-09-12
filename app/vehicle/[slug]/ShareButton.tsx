"use client";

import { useState } from "react";
import { ShareIcon } from "@wheewise/ui";

// Small circular button placed next to the title.
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      title={copied ? "Link copied" : "Share"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-default text-zinc-500 transition-colors hover:bg-surface-muted"
    >
      <ShareIcon className="h-4 w-4" />
    </button>
  );
}
