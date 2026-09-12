import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import { NoNotifications } from "../NoNotifications";
import { BackHeader } from "../BackHeader";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function NotificationsPage() {
  const supabase = await createServerSupabaseClient();
  await requireAuthContext(supabase);

  return (
    <div>
      <BackHeader title="Notifications" />
      <NoNotifications />
    </div>
  );
}
