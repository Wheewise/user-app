"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@wheewise/ui";
import { AuthField, AuthInput, AuthPasswordInput, AuthButton } from "../AuthField";
import { signupBuyer, type SignupState } from "./actions";

export function SignupForm() {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [state, formAction, pending] = useActionState<SignupState | undefined, FormData>(
    signupBuyer,
    undefined,
  );
  const errors = state && !state.ok ? state.errors : {};

  useEffect(() => {
    if (state?.ok && !state.needsConfirmation) router.push("/");
  }, [state, router]);

  if (state?.ok && state.needsConfirmation) {
    return (
      <div className="rounded-lg border border-border-default bg-surface-muted px-4 py-6 text-center">
        <p className="font-medium text-foreground">Check your email to verify your account</p>
        <p className="mt-1 text-sm text-zinc-500">
          We&apos;ve sent a confirmation link — click it to activate your account and sign in
          automatically. Check your inbox, and your spam folder if it doesn&apos;t show up.
        </p>
      </div>
    );
  }

  // Country code is a fixed "+91" label, not a real dropdown — every dealer
  // and city in this product is India/Kerala-only today. Add a real
  // selector if that ever changes; a working single-country field beats a
  // multi-country picker nobody can use yet.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    const password = new FormData(e.currentTarget).get("password");
    if (password !== confirmPassword) {
      e.preventDefault();
      setConfirmError("Passwords don't match.");
      return;
    }
    setConfirmError("");
  };

  return (
    <form action={formAction} onSubmit={submit} className="space-y-4">
      <AuthField label="Full name" name="name" errors={errors.name}>
        <AuthInput name="name" autoComplete="name" required />
      </AuthField>
      <AuthField label="Email" name="email" errors={errors.email}>
        <AuthInput name="email" type="email" autoComplete="email" required />
      </AuthField>
      <AuthField label="Mobile number" name="phone" errors={errors.phone}>
        <div className="flex gap-2">
          <span className="flex shrink-0 items-center rounded-lg border border-border-default bg-surface-muted px-3 text-sm text-zinc-600">
            +91
          </span>
          <div className="flex-1">
            <AuthInput name="phone" type="tel" autoComplete="tel" placeholder="Mobile number" required />
          </div>
        </div>
      </AuthField>
      <AuthField label="Password" name="password" errors={errors.password}>
        <AuthPasswordInput name="password" autoComplete="new-password" minLength={8} required />
        {!errors.password?.length ? <p className="text-xs text-zinc-500">At least 8 characters.</p> : null}
      </AuthField>
      <AuthField label="Confirm password" name="confirmPassword">
        <AuthPasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </AuthField>
      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      <Turnstile onVerify={setTurnstileToken} />
      {confirmError ? <p className="text-sm text-danger">{confirmError}</p> : null}
      {state && !state.ok && state.formError ? (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.formError}</p>
      ) : null}
      <AuthButton disabled={pending || !turnstileToken}>
        {pending ? "Creating account…" : "Create account"}
      </AuthButton>
    </form>
  );
}
