import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import { BackHeader } from "../../BackHeader";
import { PrivacyPasswordForm } from "./PrivacyPasswordForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PrivacyPage() {
  const supabase = await createServerSupabaseClient();
  await requireAuthContext(supabase);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // A Google-only account has no "email" identity attached — it's never
  // had a password to change, only one to create for the first time (e.g.
  // to also be able to sign in with email/password going forward).
  const hasPassword = user?.identities?.some((i) => i.provider === "email") ?? true;

  return (
    <div>
      <BackHeader title="Privacy" />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h2 className="mb-4 text-sm font-semibold">{hasPassword ? "Change password" : "Create password"}</h2>
        <PrivacyPasswordForm hasPassword={hasPassword} />
      </div>
    </div>
  );
}
