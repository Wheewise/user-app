"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@wheewise/supabase";
import { AuthField, AuthPasswordInput, AuthButton } from "../AuthField";

// Reachable only with a live recovery session — /auth/callback already
// exchanged the emailed code for one before redirecting here (see
// LoginPageForm's requestReset), so this just calls updateUser directly,
// no token handling of its own.
export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
      setPending(true);
      setError("");
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      setPending(false);
      if (error) {
        setError(error.message);
        return;
      }
      setDone(true);
    },
    [password, confirmPassword],
  );

  if (done) {
    return (
      <div className="rounded-lg border border-border-default bg-surface-muted px-4 py-6 text-center">
        <p className="font-medium text-foreground">Password updated</p>
        <button
          type="button"
          onClick={() => router.push("/browse")}
          className="mt-3 text-sm font-medium text-brand hover:underline"
        >
          Continue to Wheewise
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <AuthField label="New password" name="password">
        <AuthPasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          autoFocus
        />
      </AuthField>
      <AuthField label="Confirm password" name="confirmPassword">
        <AuthPasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </AuthField>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <AuthButton disabled={pending}>{pending ? "Saving…" : "Save password"}</AuthButton>
    </form>
  );
}
