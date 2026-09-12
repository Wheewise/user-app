"use client";

import { useRef, useState } from "react";
import { BellIcon } from "@wheewise/ui";
import { NoNotifications } from "./NoNotifications";
import { useClickOutside } from "./useClickOutside";

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useClickOutside(ref, open, close);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="flex flex-col items-center gap-0.5 text-foreground hover:text-brand"
      >
        <BellIcon className="h-5 w-5" />
        <span className="hidden text-xs font-medium sm:inline">Notifications</span>
      </button>

      {open ? (
        <div className="absolute top-full right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-border-default bg-background shadow-lg">
          <NoNotifications />
        </div>
      ) : null}
    </div>
  );
}
