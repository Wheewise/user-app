import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import { ChevronRightIcon, BellIcon } from "@wheewise/ui";
import { BackHeader } from "../BackHeader";
import { LogoutAllDevicesButton } from "./LogoutAllDevicesButton";
import { SoonRow } from "../SoonRow";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  await requireAuthContext(supabase);

  return (
    <div>
      <BackHeader title="Settings" />
      <div className="mx-auto max-w-2xl">
        <Link
          href="/settings/privacy"
          className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium hover:bg-surface-muted"
        >
          Privacy
          <ChevronRightIcon className="ml-auto h-4 w-4 text-zinc-400" />
        </Link>

        {/* No notifications system built yet — same "Soon" treatment as the
            header/mobile-menu bell, rather than a row that goes nowhere. */}
        <SoonRow icon={BellIcon} label="Notifications" />

        <LogoutAllDevicesButton />

        {/* Real account deletion needs an admin-privileged server endpoint
            (cascading the profile/listings/enquiries data, not just the
            auth user) that doesn't exist yet — flagged as coming rather
            than wired to a button that silently does nothing. */}
        <SoonRow label="Delete account" />

        <Link
          href="/settings/chat-safety-tips"
          className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium hover:bg-surface-muted"
        >
          Chat safety tips
          <ChevronRightIcon className="ml-auto h-4 w-4 text-zinc-400" />
        </Link>
      </div>
    </div>
  );
}
