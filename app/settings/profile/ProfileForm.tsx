"use client";

import { useCallback, useState, type FormEvent } from "react";
import type { UserIdentity } from "@supabase/supabase-js";
import { Field, Input, Button, GoogleIcon, UserIcon } from "@wheewise/ui";
import { createBrowserSupabaseClient } from "@wheewise/supabase";
import { saveProfile } from "../../profile-actions";

const NAME_MAX = 100;
const PHONE_MAX = 20;

export function ProfileForm({
  name: initialName,
  phone: initialPhone,
  email,
  avatarUrl,
  googleIdentity,
}: {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string | null;
  googleIdentity: UserIdentity | null;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setPending(true);
      setError("");
      setSaved(false);
      const result = await saveProfile({ name, phone });
      setPending(false);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      setSaved(true);
    },
    [name, phone],
  );

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-8">
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Basic information</h2>
          <div className="flex items-start gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- external Google-hosted URL, not a local asset next/image can optimize
              <img src={avatarUrl} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-muted text-zinc-400">
                <UserIcon className="h-7 w-7" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <Field label="Full name" name="name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
                  maxLength={NAME_MAX}
                  required
                />
              </Field>
              <p className="mt-1 text-right text-xs text-zinc-400">
                {name.length} / {NAME_MAX}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Contact information</h2>
          <div className="space-y-4">
            <Field label="Mobile number" name="phone">
              <div className="flex items-center rounded-md border border-border-default shadow-xs focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                <span className="shrink-0 border-r border-border-default px-3 py-2 text-sm text-zinc-500">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.slice(0, PHONE_MAX))}
                  maxLength={PHONE_MAX}
                  required
                  className="min-w-0 flex-1 rounded-r-md px-3 py-2 text-sm outline-none"
                />
              </div>
            </Field>

            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="mt-1.5 rounded-md border border-border-default bg-surface-muted px-3 py-2 text-sm text-zinc-500">
                {email}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Your email is never shared with dealers or third parties.
              </p>
            </div>
          </div>
        </section>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {saved && !error ? <p className="text-sm text-success">Profile updated.</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Additional information</h2>
        <GoogleLinkRow identity={googleIdentity} />
      </section>
    </div>
  );
}

function GoogleLinkRow({ identity }: { identity: UserIdentity | null }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const unlink = useCallback(async () => {
    if (!identity) return;
    if (!window.confirm("Unlink your Google account? You'll need your password to sign in afterward.")) return;
    setPending(true);
    setError("");
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.unlinkIdentity(identity);
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.reload();
  }, [identity]);

  const link = useCallback(async () => {
    setPending(true);
    setError("");
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/settings/profile` },
    });
    // Browser navigates away to Google on success; only reset on failure.
    if (error) {
      setPending(false);
      setError(error.message);
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 rounded-md border border-border-default px-4 py-3">
        <div className="flex items-center gap-3">
          <GoogleIcon className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium text-foreground">Google</p>
            <p className="text-xs text-zinc-500">
              {identity ? "Linked to your account." : "Link your Google account for faster sign-in."}
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={identity ? unlink : link} disabled={pending}>
          {pending ? "…" : identity ? "Unlink" : "Link"}
        </Button>
      </div>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
