"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createBrowserSupabaseClient } from "@wheewise/supabase";
import { MailIcon, Turnstile } from "@wheewise/ui";
import { GoogleSignInButton } from "../GoogleSignInButton";
import { AuthField, AuthInput, AuthPasswordInput, AuthButton } from "../AuthField";

// Always the home page after signing in — not wherever the visitor was
// headed before hitting the login gate. Simpler and more predictable than
// a callbackUrl round trip, at the cost of not returning them to e.g. the
// listing they were trying to wishlist.
const POST_LOGIN_URL = "/";

export function LoginPageForm() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Forgot password is its own step (own email field, own Turnstile token —
  // tokens are single-use, so reusing the sign-in form's would fail) rather
  // than a mode swap within the sign-in form.
  const [mode, setMode] = useState<"signIn" | "forgotPassword" | "resetRequested">("signIn");
  const [resetEmail, setResetEmail] = useState("");
  const [resetTurnstileToken, setResetTurnstileToken] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetPending, setResetPending] = useState(false);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPending(true);
      setError("");
      const supabase = createBrowserSupabaseClient();
      // Verified server-side by Supabase itself — Authentication > Settings >
      // Bot and Abuse Protection (Turnstile) must be enabled with the secret
      // key for this token to actually be checked, not just collected.
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken: turnstileToken },
      });
      setPending(false);
      if (error) {
        setError(
          error.code === "email_not_confirmed"
            ? "Please verify your email before signing in — check your inbox (and spam folder) for the link we sent you."
            : error.message,
        );
        return;
      }
      router.push(POST_LOGIN_URL);
      router.refresh();
    },
    [email, password, turnstileToken, router],
  );

  const requestReset = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setResetPending(true);
      setResetError("");
      try {
        const supabase = createBrowserSupabaseClient();
        // Lands on /auth/callback like every other Supabase email link here —
        // that route already exchanges the code for a session before handing
        // off, so the recovery session is live by the time /reset-password loads.
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
          redirectTo: `${window.location.origin}/auth/callback?callbackUrl=/reset-password`,
          captchaToken: resetTurnstileToken,
        });
        if (error) {
          setResetError(error.message);
          return;
        }
        setMode("resetRequested");
      } catch {
        setResetError("Couldn't send the reset link — check your connection and try again.");
      } finally {
        setResetPending(false);
      }
    },
    [resetEmail, resetTurnstileToken],
  );

  if (mode === "resetRequested") {
    return (
      <div className="rounded-lg border border-border-default bg-surface-muted px-4 py-6 text-center">
        <p className="font-medium text-foreground">{t("checkYourEmail")}</p>
        <p className="mt-1 text-sm text-zinc-500">{t("resetLinkSent", { email: resetEmail })}</p>
      </div>
    );
  }

  if (mode === "forgotPassword") {
    return (
      <div>
        <h1 className="text-xl font-bold text-foreground">{t("resetPasswordTitle")}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t("resetPasswordSubtitle")}</p>
        <form onSubmit={requestReset} className="mt-5 space-y-4">
          <AuthField label={t("email")} name="resetEmail">
            <AuthInput
              icon={MailIcon}
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
            />
          </AuthField>
          <Turnstile onVerify={setResetTurnstileToken} />
          {resetError ? <p className="text-sm text-danger">{resetError}</p> : null}
          <AuthButton disabled={resetPending || !resetTurnstileToken}>
            {resetPending ? t("sending") : t("sendResetLink")}
          </AuthButton>
        </form>
        <button
          type="button"
          onClick={() => {
            setMode("signIn");
            setResetError("");
            // Otherwise a revisit to this step re-mounts a fresh Turnstile
            // widget while the button still reads the old, already-used
            // token until the new one finishes verifying — briefly letting
            // a fast resubmit go out with a stale captcha token.
            setResetTurnstileToken("");
          }}
          className="mt-4 block w-full text-center text-sm font-medium text-brand hover:underline"
        >
          {t("backToSignIn")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">{t("signIn")}</h1>
      <p className="mt-1 text-sm text-zinc-500">{t("signInSubtitle")}</p>
      <div className="mt-6 space-y-5">
        <GoogleSignInButton callbackUrl={POST_LOGIN_URL} />

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="h-px flex-1 bg-border-default" />
          {t("or")}
          <div className="h-px flex-1 bg-border-default" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <AuthField label={t("email")} name="email">
            <AuthInput
              icon={MailIcon}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
            />
          </AuthField>
          <AuthField
            label={t("password")}
            name="password"
            action={
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setMode("forgotPassword");
                }}
                className="text-xs font-medium text-brand hover:underline"
              >
                {t("forgotPassword")}
              </button>
            }
          >
            <AuthPasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </AuthField>
          <Turnstile onVerify={setTurnstileToken} />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <AuthButton disabled={pending || !turnstileToken}>
            {pending ? t("signingIn") : t("logIn")}
          </AuthButton>
        </form>
      </div>
    </div>
  );
}
