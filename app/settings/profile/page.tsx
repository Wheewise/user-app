import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import { BackHeader } from "../../BackHeader";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { profile } = await requireAuthContext(supabase);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
  const googleIdentity = user?.identities?.find((i) => i.provider === "google") ?? null;
  // Never null in practice (Supabase requires an email), but the type is
  // nullable — fall back rather than render "undefined" if it ever is.
  const email = user?.email ?? "";

  return (
    <div>
      <BackHeader title="Edit profile" />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <ProfileForm
          name={profile.name}
          phone={profile.phone ?? ""}
          email={email}
          avatarUrl={avatarUrl}
          googleIdentity={googleIdentity}
        />
      </div>
    </div>
  );
}
