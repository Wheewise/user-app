"use client";

import { useCallback, useState, type FormEvent } from "react";
import { createBrowserSupabaseClient } from "@wheewise/supabase";
import { Field, Input, Button } from "@wheewise/ui";

export function PrivacyPasswordForm({ hasPassword }: { hasPassword: boolean }) {
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
      setPassword("");
      setConfirmPassword("");
    },
    [password, confirmPassword],
  );

  if (done) {
    return (
      <p className="rounded-lg border border-border-default bg-surface-muted px-4 py-3 text-sm text-foreground">
        Password {hasPassword ? "updated" : "created"}.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label={hasPassword ? "New password" : "Password"} name="password">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          autoFocus
        />
      </Field>
      <Field label="Confirm password" name="confirmPassword">
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : hasPassword ? "Update password" : "Create password"}
      </Button>
    </form>
  );
}
